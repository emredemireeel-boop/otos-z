import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authGuard";
import { FieldValue, getAdminDb } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rateLimit";
import { sendPushToUser } from "@/lib/pushServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MessageAction = "start" | "send";

function cleanText(value: unknown, maximum: number) {
    if (typeof value !== "string") return "";
    return value.replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maximum);
}

function validDocumentId(value: string) {
    return value.length >= 3 && value.length <= 300 && !value.includes("/");
}

async function assertAllowedMessage(content: string) {
    const snapshot = await getAdminDb().collection("bad_words").limit(500).get();
    const normalized = content.toLocaleLowerCase("tr-TR");
    const blocked = snapshot.docs
        .map((document) => String(document.data()?.word || document.id).trim().toLocaleLowerCase("tr-TR"))
        .filter((word) => word.length > 1)
        .some((word) => normalized.includes(word));
    if (blocked) throw new Error("Mesaj uygunsuz ifade içeriyor.");
}

async function startConversation(uid: string, body: Record<string, unknown>) {
    const otherUserId = cleanText(body.otherUserId, 128);
    if (!validDocumentId(otherUserId) || otherUserId === uid) throw new Error("Geçersiz kullanıcı.");

    const db = getAdminDb();
    const participants = [uid, otherUserId].sort();
    const conversationId = participants.join("_");
    const conversationRef = db.collection("conversations").doc(conversationId);
    const [conversation, me, other] = await Promise.all([
        conversationRef.get(),
        db.collection("users").doc(uid).get(),
        db.collection("users").doc(otherUserId).get(),
    ]);
    if (!other.exists) throw new Error("Kullanıcı bulunamadı.");
    if (conversation.exists) {
        const existingParticipants = conversation.data()?.participants;
        if (!Array.isArray(existingParticipants) || !existingParticipants.includes(uid)) throw new Error("Bu konuşmaya erişemezsin.");
        return { conversationId };
    }

    const myUsername = cleanText(me.data()?.username || me.data()?.displayName || "otosoz_uyesi", 60);
    const otherUsername = cleanText(other.data()?.username || other.data()?.displayName || "otosoz_uyesi", 60);
    try {
        await conversationRef.create({
            participants,
            participantUsernames: { [uid]: myUsername, [otherUserId]: otherUsername },
            lastMessage: "",
            lastMessageAt: FieldValue.serverTimestamp(),
            lastSenderId: "",
            blockedBy: [],
            createdAt: FieldValue.serverTimestamp(),
        });
    } catch (error) {
        const code = (error as { code?: string | number }).code;
        if (code !== 6 && code !== "already-exists") throw error;
    }
    return { conversationId };
}

async function sendMessage(uid: string, body: Record<string, unknown>) {
    const conversationId = cleanText(body.conversationId, 300);
    const content = cleanText(body.content, 2001);
    if (!validDocumentId(conversationId)) throw new Error("Geçersiz konuşma.");
    if (!content || content.length > 2000) throw new Error("Mesaj 1–2000 karakter olmalıdır.");
    await assertAllowedMessage(content);

    const db = getAdminDb();
    const conversationRef = db.collection("conversations").doc(conversationId);
    const conversation = await conversationRef.get();
    if (!conversation.exists) throw new Error("Konuşma bulunamadı.");
    const data = conversation.data() || {};
    const participants = Array.isArray(data.participants) ? data.participants.filter((item): item is string => typeof item === "string") : [];
    if (participants.length !== 2 || !participants.includes(uid)) throw new Error("Bu konuşmaya erişemezsin.");
    if (Array.isArray(data.blockedBy) && data.blockedBy.length > 0) throw new Error("Bu konuşmada mesajlaşma engellendi.");

    const recipientId = participants.find((participant) => participant !== uid)!;
    const profile = await db.collection("users").doc(uid).get();
    const senderUsername = cleanText(profile.data()?.username || profile.data()?.displayName || "otosoz_uyesi", 60);
    const messageRef = conversationRef.collection("messages").doc();
    const notificationRef = db.collection("notifications").doc();
    const batch = db.batch();
    batch.create(messageRef, {
        senderId: uid,
        senderUsername,
        content,
        read: false,
        createdAt: FieldValue.serverTimestamp(),
    });
    batch.update(conversationRef, {
        lastMessage: content,
        lastMessageAt: FieldValue.serverTimestamp(),
        lastSenderId: uid,
    });
    batch.create(notificationRef, {
        userId: recipientId,
        type: "message",
        title: `${senderUsername} sana mesaj gönderdi`,
        message: content.slice(0, 180),
        read: false,
        createdAt: FieldValue.serverTimestamp(),
        link: "/mesajlar",
        source: "mobile_message",
        conversationId,
    });
    await batch.commit();
    await sendPushToUser(recipientId, {
        title: `${senderUsername} sana mesaj gönderdi`,
        body: content.slice(0, 180),
        link: "/mesajlar",
        tag: `message-${conversationId}`,
    }, "messages");
    return { conversationId, messageId: messageRef.id };
}

export async function POST(request: Request) {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 16_384) return NextResponse.json({ success: false, message: "İstek çok büyük." }, { status: 413 });
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const action = body.action as MessageAction;
    if (action !== "start" && action !== "send") return NextResponse.json({ success: false, message: "Geçersiz işlem." }, { status: 400 });

    const rate = checkRateLimit(`mobile-message:${action}:${auth.uid}:${getClientIP(request)}`, action === "send" ? RATE_LIMITS.createContent : RATE_LIMITS.general);
    if (!rate.allowed) {
        return NextResponse.json({ success: false, message: "Çok hızlı işlem yapıyorsun. Biraz bekleyip tekrar dene." }, {
            status: 429,
            headers: { "Retry-After": String(Math.ceil((rate.retryAfterMs || 60_000) / 1000)) },
        });
    }

    try {
        const result = action === "start" ? await startConversation(auth.uid!, body) : await sendMessage(auth.uid!, body);
        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error("Mobile messages API error:", error);
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Mesaj işlemi tamamlanamadı." }, { status: 400 });
    }
}
