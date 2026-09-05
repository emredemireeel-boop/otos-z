import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authGuard";
import { getAdminDb, FieldValue } from "@/lib/firebaseAdmin";
import { createSeoSlug } from "@/lib/slug";
import { sendPushToUser } from "@/lib/pushServer";

export async function POST(request:Request) {
    const auth = await requireAuth(request); if (auth instanceof NextResponse) return auth;
    const body = await request.json().catch(() => ({}));
    const threadId = typeof body.threadId === "string" ? body.threadId : ""; const entryId = typeof body.entryId === "string" ? body.entryId : "";
    if (!threadId || !entryId) return NextResponse.json({ success:false }, { status:400 });
    const db = getAdminDb(); const threadRef = db.collection("threads").doc(threadId);
    const [thread, entry, replier] = await Promise.all([threadRef.get(), threadRef.collection("entries").doc(entryId).get(), db.collection("users").doc(auth.uid!).get()]);
    if (!thread.exists || !entry.exists || entry.data()?.authorId !== auth.uid) return NextResponse.json({ success:false, message:"Cevap doğrulanamadı." }, { status:403 });
    const data = thread.data() || {}; const target = data.authorId;
    if (!target || target === auth.uid) return NextResponse.json({ success:true, skipped:true });
    const link = data.urlId ? `/forum/${createSeoSlug(data.title || "baslik")}--${data.urlId}` : `/forum/${threadId}`;
    const username = replier.data()?.username || entry.data()?.username || "Bir OtoSöz üyesi";
    const title = "Başlığına yeni cevap geldi"; const message = `@${username}, “${String(data.title || "başlığın").slice(0,90)}” başlığına cevap yazdı.`;
    const notificationRef = db.collection("notifications").doc(`reply_${threadId}_${entryId}`);
    try { await notificationRef.create({ userId:target, type:"reply", title, message, read:false, createdAt:FieldValue.serverTimestamp(), link, source:"forum_reply" }); } catch (error:any) { if (error?.code !== 6 && error?.code !== "already-exists") throw error; }
    await sendPushToUser(target, { title, body:message, link, tag:`reply-${threadId}` }, "replies");
    return NextResponse.json({ success:true });
}
