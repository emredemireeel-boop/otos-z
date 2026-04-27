import {
    collection, doc, addDoc, getDoc, getDocs, updateDoc, setDoc, deleteDoc,
    query, orderBy, limit, onSnapshot, serverTimestamp, increment,
    arrayUnion, arrayRemove, Timestamp, where,
    type DocumentData, type QuerySnapshot
} from "firebase/firestore";
import { db } from "./firebase";
import { sanitizeText, validateThreadTitle, validateEntryContent, validateTags } from "./validation";

/* ── Types ── */
export interface ChronicIssue {
    id: string;
    text: string;
    author: string;
    authorId: string;
    votes: number;
    votedBy: string[];
}

export interface ForumEntry {
    id: string;
    authorId: string;
    username: string;
    content: string;
    createdAt: Timestamp | null;
    likes: number;
    likedBy: string[];
}

export interface ForumThread {
    id: string;
    title: string;
    category: string;
    description: string;
    authorId: string;
    authorUsername: string;
    createdAt: Timestamp | null;
    views: number;
    tags: string[];
    entryCount: number;
    lastEntryAt: Timestamp | null;
    vehicleVotes?: Record<string, string[]>;
    chronicIssues?: ChronicIssue[];
    urlId?: number;
    carBrand?: string;
    carModel?: string;
    carYear?: string;
    carKm?: string;
}

/* ── Helpers ── */

/** Turkce karakterleri SEO-uyumlu slug'a cevir */
export function createSlug(text: string): string {
    const trMap: { [key: string]: string } = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
    };
    return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, match => trMap[match] || match)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80);
}

/** 8 haneli benzersiz URL ID uret */
function generateUrlId(): number {
    return Math.floor(10000000 + Math.random() * 90000000);
}

/** Thread icin SEO-uyumlu slug URL olustur (eksi sozluk formati) */
export function getThreadSlugUrl(thread: ForumThread): string {
    if (thread.urlId) {
        return `/forum/${createSlug(thread.title)}--${thread.urlId}`;
    }
    // Eski thread'ler icin fallback (urlId yoksa Firestore ID kullan)
    return `/forum/${thread.id}`;
}

function mapThread(docSnap: DocumentData, id: string): ForumThread {
    const d = docSnap;
    return {
        id,
        title: d.title || "",
        category: d.category || "Genel",
        description: d.description || "",
        authorId: d.authorId || "",
        authorUsername: d.authorUsername || "",
        createdAt: d.createdAt || null,
        views: d.views || 0,
        tags: d.tags || [],
        entryCount: d.entryCount || 0,
        lastEntryAt: d.lastEntryAt || d.createdAt || null,
        vehicleVotes: d.vehicleVotes || {},
        chronicIssues: d.chronicIssues || [],
        urlId: d.urlId || undefined,
        carBrand: d.carBrand || undefined,
        carModel: d.carModel || undefined,
        carYear: d.carYear || undefined,
        carKm: d.carKm || undefined,
    };
}

function mapEntry(docSnap: DocumentData, id: string): ForumEntry {
    const d = docSnap;
    return {
        id,
        authorId: d.authorId || "",
        username: d.username || "",
        content: d.content || "",
        createdAt: d.createdAt || null,
        likes: d.likes || 0,
        likedBy: d.likedBy || [],
    };
}

/* ── Thread Operations ── */

/** Tum konulari getir (son entry tarihine gore sirali) */
export async function getThreads(limitCount = 50): Promise<ForumThread[]> {
    const q = query(
        collection(db, "threads"),
        orderBy("lastEntryAt", "desc"),
        limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapThread(d.data(), d.id));
}

/** Kategoriye gore konulari getir */
export async function getThreadsByCategory(category: string): Promise<ForumThread[]> {
    const q = query(
        collection(db, "threads"),
        where("category", "==", category),
        orderBy("lastEntryAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapThread(d.data(), d.id));
}

/** Tek bir konuyu getir */
export async function getThreadById(threadId: string): Promise<ForumThread | null> {
    const snap = await getDoc(doc(db, "threads", threadId));
    if (!snap.exists()) return null;
    return mapThread(snap.data(), snap.id);
}

/** Slug--urlId formatindan thread getir (eksi sozluk stili) */
export async function getThreadBySlug(slug: string): Promise<ForumThread | null> {
    // slug--12345678 formatini parse et
    const parts = slug.split('--');
    const urlIdStr = parts[parts.length - 1];
    const urlId = parseInt(urlIdStr, 10);

    // Eger gecerli 8 haneli bir sayi ise urlId ile ara
    if (!isNaN(urlId) && urlIdStr.length === 8) {
        const q = query(
            collection(db, "threads"),
            where("urlId", "==", urlId),
            limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
            const d = snap.docs[0];
            return mapThread(d.data(), d.id);
        }
    }

    // Fallback: eski Firestore doc ID ile ara
    return getThreadById(slug);
}

/** Bir konunun entry'lerini getir */
export async function getEntries(threadId: string): Promise<ForumEntry[]> {
    const q = query(
        collection(db, "threads", threadId, "entries"),
        orderBy("createdAt", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapEntry(d.data(), d.id));
}

/** Bir kullanicinin tum entry'lerini getir (Profil icin) */
export async function getUserEntries(username: string): Promise<(ForumEntry & { threadId: string })[]> {
    const { collectionGroup } = await import("firebase/firestore");
    try {
        const q = query(
            collectionGroup(db, "entries"),
            where("username", "==", username),
            orderBy("createdAt", "desc"),
            limit(50)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => {
            const data = d.data();
            const threadId = d.ref.parent.parent?.id || "";
            return { ...mapEntry(data, d.id), threadId };
        });
    } catch (error) {
        console.warn("collectionGroup sorgusu basarisiz, fallback kullaniliyor:", error);
        // Fallback: Sadece kullanicinin actigi basliklardaki kendi entry'lerini getir
        const threadsSnap = await getDocs(query(collection(db, "threads"), where("authorUsername", "==", username)));
        const allEntries: (ForumEntry & { threadId: string })[] = [];
        
        for (const tDoc of threadsSnap.docs) {
            const entriesSnap = await getDocs(query(collection(db, "threads", tDoc.id, "entries"), where("username", "==", username)));
            entriesSnap.forEach(eDoc => {
                allEntries.push({ ...mapEntry(eDoc.data(), eDoc.id), threadId: tDoc.id });
            });
        }
        
        // Tarihe gore sirala (en yeni en uste)
        return allEntries.sort((a, b) => {
            const tA = a.createdAt?.toMillis?.() || 0;
            const tB = b.createdAt?.toMillis?.() || 0;
            return tB - tA;
        });
    }
}

/** Yeni konu olustur (ilk entry ile birlikte) */
export async function createThread(data: {
    title: string;
    category: string;
    content: string;
    description?: string;
    tags: string[];
    authorId: string;
    authorUsername: string;
    carBrand?: string;
    carModel?: string;
    carYear?: string;
    carKm?: string;
}): Promise<string> {
    // Input dogrulama
    const titleCheck = validateThreadTitle(data.title);
    if (!titleCheck.valid) throw new Error(titleCheck.error);

    const contentCheck = validateEntryContent(data.content);
    if (!contentCheck.valid) throw new Error(contentCheck.error);

    const safeTags = validateTags(data.tags);
    const safeUsername = sanitizeText(data.authorUsername).slice(0, 30);
    const safeDescription = sanitizeText(data.description || '').slice(0, 500);
    const safeCategory = sanitizeText(data.category).slice(0, 50);

    const now = serverTimestamp();
    const urlId = generateUrlId();

    // Thread olustur
    const threadRef = await addDoc(collection(db, "threads"), {
        title: titleCheck.sanitized,
        category: safeCategory,
        description: safeDescription,
        authorId: data.authorId,
        authorUsername: safeUsername,
        createdAt: now,
        views: 0,
        tags: safeTags,
        entryCount: 1,
        lastEntryAt: now,
        urlId,
        carBrand: data.carBrand || null,
        carModel: data.carModel || null,
        carYear: data.carYear || null,
        carKm: data.carKm || null,
    });

    // Ilk entry olustur
    await addDoc(collection(db, "threads", threadRef.id, "entries"), {
        authorId: data.authorId,
        username: safeUsername,
        content: contentCheck.sanitized,
        createdAt: now,
        likes: 0,
        likedBy: [],
    });

    // Slug URL dondur (yonlendirme icin)
    const slugUrl = `${createSlug(titleCheck.sanitized)}--${urlId}`;
    return slugUrl;
}

/** Konuya entry ekle */
export async function addEntry(threadId: string, data: {
    authorId: string;
    username: string;
    content: string;
}): Promise<string> {
    // Input dogrulama
    const contentCheck = validateEntryContent(data.content);
    if (!contentCheck.valid) throw new Error(contentCheck.error);

    const safeUsername = sanitizeText(data.username).slice(0, 30);
    const now = serverTimestamp();

    // Entry ekle
    const entryRef = await addDoc(collection(db, "threads", threadId, "entries"), {
        authorId: data.authorId,
        username: safeUsername,
        content: contentCheck.sanitized,
        createdAt: now,
        likes: 0,
        likedBy: [],
    });

    // Thread'in entryCount ve lastEntryAt guncelle
    await updateDoc(doc(db, "threads", threadId), {
        entryCount: increment(1),
        lastEntryAt: now,
    });

    return entryRef.id;
}

/** Begeni toggle */
export async function toggleLike(threadId: string, entryId: string, userId: string): Promise<boolean> {
    const entryRef = doc(db, "threads", threadId, "entries", entryId);
    const entrySnap = await getDoc(entryRef);
    if (!entrySnap.exists()) return false;

    const likedBy: string[] = entrySnap.data().likedBy || [];
    const isLiked = likedBy.includes(userId);

    await updateDoc(entryRef, {
        likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId),
        likes: increment(isLiked ? -1 : 1),
    });

    return !isLiked;
}

/** Tek araca oy verme (Karsilastirma icin) */
export async function toggleVehicleVote(threadId: string, vehicleName: string, userId: string): Promise<boolean> {
    const threadRef = doc(db, "threads", threadId);
    const snap = await getDoc(threadRef);
    if (!snap.exists()) return false;

    const currentVotes: Record<string, string[]> = snap.data().vehicleVotes || {};
    
    // Check if user already voted for this specific vehicle
    const hasVotedForThis = currentVotes[vehicleName]?.includes(userId);

    // Remove user's vote from ALL vehicles to ensure single vote
    const updatedVotes: Record<string, string[]> = {};
    for (const [vName, voters] of Object.entries(currentVotes)) {
        updatedVotes[vName] = (voters as string[]).filter(id => id !== userId);
    }

    let isNowVoted = false;
    // If they didn't already vote for this vehicle, add their vote to this vehicle
    if (!hasVotedForThis) {
        if (!updatedVotes[vehicleName]) updatedVotes[vehicleName] = [];
        updatedVotes[vehicleName].push(userId);
        isNowVoted = true;
    }

    await updateDoc(threadRef, {
        vehicleVotes: updatedVotes
    });

    return isNowVoted;
}

/** Goruntuleme sayisini artir */
export async function incrementViews(threadId: string): Promise<void> {
    try {
        await updateDoc(doc(db, "threads", threadId), {
            views: increment(1),
        });
    } catch (e) {
        console.warn("Goruntulenme guncellenemedi:", e);
    }
}

/** Konuyu (Baslik) Sil (Admin) */
export async function deleteThread(threadId: string): Promise<void> {
    // Ilk olarak konuya ait tum entry'leri sil
    const entriesSnap = await getDocs(collection(db, "threads", threadId, "entries"));
    const deletePromises = entriesSnap.docs.map(d => deleteDoc(doc(db, "threads", threadId, "entries", d.id)));
    await Promise.all(deletePromises);
    // Sonra konuyu sil
    await deleteDoc(doc(db, "threads", threadId));
}

/** Entry Sil (Admin) */
export async function deleteEntry(threadId: string, entryId: string): Promise<void> {
    await deleteDoc(doc(db, "threads", threadId, "entries", entryId));
    // Konunun entryCount'unu azalt
    await updateDoc(doc(db, "threads", threadId), {
        entryCount: increment(-1)
    });
}

/** Realtime listener for threads */
export function subscribeToThreads(
    callback: (threads: ForumThread[]) => void,
    limitCount = 50
): () => void {
    const q = query(
        collection(db, "threads"),
        orderBy("lastEntryAt", "desc"),
        limit(limitCount)
    );
    return onSnapshot(q, (snap) => {
        const threads = snap.docs.map(d => mapThread(d.data(), d.id));
        callback(threads);
    });
}

/** Realtime listener for entries */
export function subscribeToEntries(
    threadId: string,
    callback: (entries: ForumEntry[]) => void
): () => void {
    const q = query(
        collection(db, "threads", threadId, "entries"),
        orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (snap) => {
        const entries = snap.docs.map(d => mapEntry(d.data(), d.id));
        callback(entries);
    });
}

/** Zaman damgasini Turkce metne cevir */
export function formatTimestamp(ts: Timestamp | null): string {
    if (!ts) return "az once";
    const now = Date.now();
    const date = ts.toDate().getTime();
    const diff = now - date;

    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "az once";
    if (mins < 60) return `${mins} dakika once`;
    if (hours < 24) return `${hours} saat once`;
    if (days < 7) return `${days} gun once`;
    if (days < 30) return `${Math.floor(days / 7)} hafta once`;
    return ts.toDate().toLocaleDateString("tr-TR");
}

/* ── Kronik Sorun Sistemi ── */

/** Yeni kronik sorun ekle */
export async function addChronicIssue(threadId: string, data: {
    text: string;
    authorId: string;
    username: string;
}): Promise<void> {
    const threadRef = doc(db, "threads", threadId);
    const snap = await getDoc(threadRef);
    if (!snap.exists()) return;

    const issues: ChronicIssue[] = snap.data().chronicIssues || [];
    const newIssue: ChronicIssue = {
        id: `ci_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        text: sanitizeText(data.text).slice(0, 200),
        author: sanitizeText(data.username).slice(0, 30),
        authorId: data.authorId,
        votes: 1,
        votedBy: [data.authorId],
    };

    await updateDoc(threadRef, {
        chronicIssues: [...issues, newIssue],
    });
}

/** Kronik soruna "Ben de yasadim" oyu ver/geri al */
export async function toggleChronicVote(threadId: string, issueId: string, userId: string): Promise<boolean> {
    const threadRef = doc(db, "threads", threadId);
    const snap = await getDoc(threadRef);
    if (!snap.exists()) return false;

    const issues: ChronicIssue[] = snap.data().chronicIssues || [];
    let toggled = false;
    const updated = issues.map(issue => {
        if (issue.id !== issueId) return issue;
        const hasVoted = issue.votedBy.includes(userId);
        toggled = !hasVoted;
        return {
            ...issue,
            votedBy: hasVoted ? issue.votedBy.filter(id => id !== userId) : [...issue.votedBy, userId],
            votes: hasVoted ? issue.votes - 1 : issue.votes + 1,
        };
    });

    await updateDoc(threadRef, { chronicIssues: updated });
    return toggled;
}
