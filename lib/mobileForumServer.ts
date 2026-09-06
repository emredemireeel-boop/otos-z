import "server-only";

import { randomInt } from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb, FieldValue } from "@/lib/firebaseAdmin";
import { getXpMultiplier } from "@/lib/campaign";
import { createSeoSlug } from "@/lib/slug";
import { sendPushToUser } from "@/lib/pushServer";
import { validateEntryContent, validateTags, validateThreadTitle } from "@/lib/validation";

const CATEGORIES = new Set([
    "Genel", "Teknik & Arıza", "Bakım & Tamir", "Modifiye & Aksesuar",
    "Elektrikli & Hibrit", "Lastik & Jant", "Sigorta & Hukuk", "Alım-Satım",
    "Deneyim & İnceleme", "Marka & Model", "Anket", "Uzmana Sor", "Karşılaştırma",
]);

const LEVELS = [
    [0, "Çaylak"], [100, "Sürücü"], [500, "Tutkun"], [1500, "Mekanik"],
    [5000, "Usta"], [15000, "Uzman"], [50000, "Efsane"], [100000, "Elçi"],
] as const;

type ContentAction = "CREATE_THREAD" | "WRITE_ENTRY";

function levelForXp(xp: number) {
    return [...LEVELS].reverse().find(([minimum]) => xp >= minimum)?.[1] || "Çaylak";
}
function dayKey(date: Date) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Istanbul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
}

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function applyServerWordFilter(input: string) {
    let clean = input;
    const snapshot = await getAdminDb().collection("bad_words").where("active", "==", true).limit(500).get();
    for (const document of snapshot.docs) {
        const data = document.data();
        const word = typeof data.word === "string" ? data.word.trim() : "";
        if (!word) continue;
        const whitelist = Array.isArray(data.whitelist) ? data.whitelist.filter((item): item is string => typeof item === "string") : [];
        if (whitelist.some(item => item && clean.toLocaleLowerCase("tr-TR").includes(item.toLocaleLowerCase("tr-TR")))) continue;
        let pattern: RegExp;
        try {
            pattern = new RegExp(data.regex === true ? word : escapeRegExp(word), "giu");
        } catch {
            continue;
        }
        if (!pattern.test(clean)) continue;
        pattern.lastIndex = 0;
        if ((data.mode || "yildizla") === "engelle") throw new Error("İçerik topluluk kurallarına uygun değil.");
        clean = clean.replace(pattern, match => "★".repeat([...match].length));
    }
    return clean;
}

async function usernameFor(uid: string) {
    const snapshot = await getAdminDb().collection("users").doc(uid).get();
    const data = snapshot.data() || {};
    const username = typeof data.username === "string" ? data.username.trim() : "";
    return username ? username.slice(0, 30) : "otosoz_uyesi";
}

async function uniqueUrlId() {
    const db = getAdminDb();
    for (let attempt = 0; attempt < 8; attempt += 1) {
        const candidate = randomInt(10_000_000, 100_000_000);
        const match = await db.collection("threads").where("urlId", "==", candidate).limit(1).get();
        if (match.empty) return candidate;
    }
    throw new Error("Başlık bağlantısı üretilemedi. Lütfen yeniden deneyin.");
}

async function awardContentXp(uid: string, action: ContentAction) {
    const db = getAdminDb();
    const multiplier = getXpMultiplier();
    await db.runTransaction(async transaction => {
        const userRef = db.collection("users").doc(uid);
        const userSnapshot = await transaction.get(userRef);
        if (!userSnapshot.exists) return;

        const data = userSnapshot.data() || {};
        const currentXp = Number(data.xp || 0);
        const now = new Date();
        const today = dayKey(now);
        const yesterdayDate = new Date(now.getTime() - 86_400_000);
        const lastDate = data.lastContentDate?.toDate?.() as Date | undefined;
        const lastKey = lastDate ? dayKey(lastDate) : "";
        let streak = Number(data.streak || 0);
        let gained = (action === "CREATE_THREAD" ? 15 : 10) * multiplier;

        if (lastKey !== today) {
            streak = lastKey === dayKey(yesterdayDate) ? streak + 1 : 1;
            gained += 10 * multiplier;
            if (streak === 7) gained += 50 * multiplier;
            if (streak === 30) gained += 200 * multiplier;
            if (streak === 100) gained += 500 * multiplier;
        }

        const newXp = currentXp + gained;
        const oldLevel = levelForXp(currentXp);
        const newLevel = levelForXp(newXp);
        const update: Record<string, unknown> = {
            xp: FieldValue.increment(gained),
            weeklyXP: FieldValue.increment(gained),
            monthlyXP: FieldValue.increment(gained),
            level: newLevel,
        };
        if (lastKey !== today) {
            update.lastContentDate = Timestamp.fromDate(now);
            update.streak = streak;
        }
        transaction.update(userRef, update);

        if (oldLevel !== newLevel) {
            transaction.create(db.collection("notifications").doc(), {
                userId: uid,
                type: "achievement",
                title: "Seviye atladın",
                message: `${newLevel} seviyesine ulaştın.`,
                createdAt: FieldValue.serverTimestamp(),
                read: false,
                link: `/profil/${uid}`,
                source: "mobile_xp",
            });
        }
    });
}

async function awardLikeXp(uid: string) {
    const db = getAdminDb();
    const gained = 5 * getXpMultiplier();
    await db.runTransaction(async transaction => {
        const userRef = db.collection("users").doc(uid);
        const snapshot = await transaction.get(userRef);
        if (!snapshot.exists) return;
        const currentXp = Number(snapshot.data()?.xp || 0);
        transaction.update(userRef, {
            xp: FieldValue.increment(gained),
            weeklyXP: FieldValue.increment(gained),
            monthlyXP: FieldValue.increment(gained),
            level: levelForXp(currentXp + gained),
        });
    });
}

async function markContentQuest(uid: string, action: ContentAction) {
    await getAdminDb().collection("userQuests").doc(uid).set({
        ...(action === "CREATE_THREAD" ? { threadCreated: true } : {}),
        entryWritten: true,
        updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
}

async function evaluateBadges(uid: string) {
    const db = getAdminDb();
    const [profile, entries] = await Promise.all([
        db.collection("users").doc(uid).get(),
        db.collectionGroup("entries").limit(2000).get(),
    ]);
    if (!profile.exists) return;
    const data = profile.data() || {};
    const userEntries = entries.docs.filter(entry => entry.data().authorId === uid);
    const likes = userEntries.reduce((total, entry) => total + Number(entry.data().likes || 0), 0);
    const earned: string[] = [];
    if (userEntries.length >= 1) earned.push("İlk Forum Yazısı");
    if (likes >= 100) earned.push("100 Beğeni");
    if (userEntries.length >= 50) earned.push("50 Cevap");
    const createdAt = data.createdAt?.toDate?.() as Date | undefined;
    if (createdAt && Date.now() - createdAt.getTime() >= 365 * 86_400_000) earned.push("1 Yıllık Üye");
    const existing = Array.isArray(data.badges) ? data.badges : [];
    const fresh = earned.filter(badge => !existing.includes(badge));
    if (!fresh.length) return;
    const batch = db.batch();
    batch.update(profile.ref, { badges: FieldValue.arrayUnion(...fresh) });
    for (const badge of fresh) {
        batch.create(db.collection("notifications").doc(), {
            userId: uid,
            type: "achievement",
            title: "Yeni rozet kazandın",
            message: `${badge} rozeti profiline eklendi.`,
            read: false,
            createdAt: FieldValue.serverTimestamp(),
            link: `/profil/${uid}`,
            source: "mobile_achievement",
        });
    }
    await batch.commit();
}

export async function createMobileThread(uid: string, body: Record<string, unknown>) {
    const titleCheck = validateThreadTitle(typeof body.title === "string" ? body.title : "");
    const contentCheck = validateEntryContent(typeof body.content === "string" ? body.content : "");
    if (!titleCheck.valid) throw new Error(titleCheck.error);
    if (!contentCheck.valid) throw new Error(contentCheck.error);
    const category = typeof body.category === "string" && CATEGORIES.has(body.category) ? body.category : "Genel";
    const [title, content, username, urlId] = await Promise.all([
        applyServerWordFilter(titleCheck.sanitized),
        applyServerWordFilter(contentCheck.sanitized),
        usernameFor(uid),
        uniqueUrlId(),
    ]);
    const db = getAdminDb();
    const threadRef = db.collection("threads").doc();
    const entryRef = threadRef.collection("entries").doc();
    const now = FieldValue.serverTimestamp();
    const tags = validateTags(Array.isArray(body.tags) ? body.tags.filter((item): item is string => typeof item === "string") : []);
    const batch = db.batch();
    batch.create(threadRef, {
        title,
        category,
        description: "",
        seoExcerpt: content.slice(0, 240),
        authorId: uid,
        authorUsername: username,
        createdAt: now,
        views: 0,
        tags,
        entryCount: 1,
        lastEntryAt: now,
        urlId,
        carBrand: null,
        carModel: null,
        carYear: null,
        carKm: null,
    });
    batch.create(entryRef, { authorId: uid, username, content, createdAt: now, likes: 0, likedBy: [] });
    await batch.commit();
    await Promise.allSettled([
        awardContentXp(uid, "CREATE_THREAD"),
        markContentQuest(uid, "CREATE_THREAD"),
        evaluateBadges(uid),
    ]);
    return { threadId: threadRef.id, entryId: entryRef.id, slug: `${createSeoSlug(title)}--${urlId}` };
}

export async function addMobileReply(uid: string, body: Record<string, unknown>) {
    const threadId = typeof body.threadId === "string" ? body.threadId : "";
    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(threadId)) throw new Error("Geçersiz başlık.");
    const contentCheck = validateEntryContent(typeof body.content === "string" ? body.content : "");
    if (!contentCheck.valid) throw new Error(contentCheck.error);
    const [content, username] = await Promise.all([applyServerWordFilter(contentCheck.sanitized), usernameFor(uid)]);
    const db = getAdminDb();
    const threadRef = db.collection("threads").doc(threadId);
    const thread = await threadRef.get();
    if (!thread.exists) throw new Error("Başlık bulunamadı.");
    if (thread.data()?.locked === true) throw new Error("Bu başlık yanıta kapalı.");
    const entryRef = threadRef.collection("entries").doc();
    const now = FieldValue.serverTimestamp();
    const batch = db.batch();
    batch.create(entryRef, { authorId: uid, username, content, createdAt: now, likes: 0, likedBy: [] });
    batch.update(threadRef, { entryCount: FieldValue.increment(1), lastEntryAt: now });
    await batch.commit();

    const threadData = thread.data() || {};
    const slug = threadData.urlId ? `${createSeoSlug(String(threadData.title || "baslik"))}--${threadData.urlId}` : threadId;
    const target = typeof threadData.authorId === "string" ? threadData.authorId : "";
    await Promise.allSettled([
        awardContentXp(uid, "WRITE_ENTRY"),
        markContentQuest(uid, "WRITE_ENTRY"),
        evaluateBadges(uid),
    ]);
    if (target && target !== uid) {
        const title = "Başlığına yeni cevap geldi";
        const message = `@${username}, “${String(threadData.title || "başlığın").slice(0, 90)}” başlığına cevap yazdı.`;
        const notificationRef = db.collection("notifications").doc(`reply_${threadId}_${entryRef.id}`);
        await notificationRef.set({
            userId: target,
            type: "reply",
            title,
            message,
            read: false,
            createdAt: FieldValue.serverTimestamp(),
            link: `/forum/${slug}`,
            source: "mobile_forum_reply",
        }, { merge: false });
        await sendPushToUser(target, { title, body: message, link: `/forum/${slug}`, tag: `reply-${threadId}` }, "replies");
    }
    return { threadId, entryId: entryRef.id, slug };
}

export async function toggleMobileLike(uid: string, body: Record<string, unknown>) {
    const threadId = typeof body.threadId === "string" ? body.threadId : "";
    const entryId = typeof body.entryId === "string" ? body.entryId : "";
    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(threadId) || !/^[a-zA-Z0-9_-]{1,128}$/.test(entryId)) throw new Error("Geçersiz entry.");
    const db = getAdminDb();
    const entryRef = db.collection("threads").doc(threadId).collection("entries").doc(entryId);
    const result = await db.runTransaction(async transaction => {
        const snapshot = await transaction.get(entryRef);
        if (!snapshot.exists) throw new Error("Entry bulunamadı.");
        const data = snapshot.data() || {};
        const likedBy = Array.isArray(data.likedBy) ? data.likedBy.filter((item): item is string => typeof item === "string") : [];
        const wasLiked = likedBy.includes(uid);
        const next = wasLiked ? likedBy.filter(item => item !== uid) : [...likedBy, uid];
        transaction.update(entryRef, { likedBy: next, likes: next.length });
        return { liked: !wasLiked, likes: next.length, authorId: typeof data.authorId === "string" ? data.authorId : "" };
    });
    if (result.liked && result.authorId && result.authorId !== uid) {
        await db.collection("users").doc(result.authorId).update({ likesReceived: FieldValue.increment(1) }).catch(() => undefined);
        await awardLikeXp(result.authorId).catch(() => undefined);
    }
    return { liked: result.liked, likes: result.likes };
}

export async function toggleMobileVehicleVote(uid: string, body: Record<string, unknown>) {
    const threadId = typeof body.threadId === "string" ? body.threadId : "";
    const vehicleName = typeof body.vehicleName === "string" ? body.vehicleName.trim().slice(0, 120) : "";
    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(threadId) || !vehicleName) throw new Error("Geçersiz karşılaştırma oyu.");
    const db = getAdminDb();
    const threadRef = db.collection("threads").doc(threadId);
    return db.runTransaction(async transaction => {
        const snapshot = await transaction.get(threadRef);
        if (!snapshot.exists) throw new Error("Karşılaştırma bulunamadı.");
        const raw = snapshot.data()?.vehicleVotes;
        const current = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
        const hadVote = Array.isArray(current[vehicleName]) && (current[vehicleName] as unknown[]).includes(uid);
        const updated: Record<string, string[]> = {};
        for (const [name, voters] of Object.entries(current)) {
            updated[name] = Array.isArray(voters) ? voters.filter((item): item is string => typeof item === "string" && item !== uid) : [];
        }
        if (!hadVote) updated[vehicleName] = [...(updated[vehicleName] || []), uid];
        transaction.update(threadRef, { vehicleVotes: updated });
        return { voted: !hadVote, vehicleVotes: updated };
    });
}

export async function incrementMobileView(body: Record<string, unknown>) {
    const threadId = typeof body.threadId === "string" ? body.threadId : "";
    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(threadId)) throw new Error("Geçersiz başlık.");
    await getAdminDb().collection("threads").doc(threadId).update({ views: FieldValue.increment(1) });
    return { viewed: true };
}
