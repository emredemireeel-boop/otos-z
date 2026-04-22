import {
    collection, doc, addDoc, getDoc, getDocs, updateDoc, setDoc,
    query, orderBy, limit, onSnapshot, serverTimestamp, increment,
    arrayUnion, arrayRemove, Timestamp, where,
    type DocumentData, type QuerySnapshot
} from "firebase/firestore";
import { db } from "./firebase";

/* ── Types ── */
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
}

/* ── Helpers ── */
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

/** Bir konunun entry'lerini getir */
export async function getEntries(threadId: string): Promise<ForumEntry[]> {
    const q = query(
        collection(db, "threads", threadId, "entries"),
        orderBy("createdAt", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => mapEntry(d.data(), d.id));
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
}): Promise<string> {
    const now = serverTimestamp();

    // Thread olustur
    const threadRef = await addDoc(collection(db, "threads"), {
        title: data.title,
        category: data.category,
        description: data.description || "",
        authorId: data.authorId,
        authorUsername: data.authorUsername,
        createdAt: now,
        views: 0,
        tags: data.tags,
        entryCount: 1,
        lastEntryAt: now,
    });

    // Ilk entry olustur
    await addDoc(collection(db, "threads", threadRef.id, "entries"), {
        authorId: data.authorId,
        username: data.authorUsername,
        content: data.content,
        createdAt: now,
        likes: 0,
        likedBy: [],
    });

    return threadRef.id;
}

/** Konuya entry ekle */
export async function addEntry(threadId: string, data: {
    authorId: string;
    username: string;
    content: string;
}): Promise<string> {
    const now = serverTimestamp();

    // Entry ekle
    const entryRef = await addDoc(collection(db, "threads", threadId, "entries"), {
        authorId: data.authorId,
        username: data.username,
        content: data.content,
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
