import {
    collection, addDoc, getDocs, query, where, orderBy,
    doc, updateDoc, serverTimestamp, onSnapshot, Timestamp,
    setDoc, getDoc
} from "firebase/firestore";
import { db } from "./firebase";

export interface ChatMessage {
    id: string;
    senderId: string;
    senderUsername: string;
    content: string;
    createdAt: Timestamp | null;
    read: boolean;
}

export interface Conversation {
    id: string;
    participants: string[];
    participantUsernames: Record<string, string>;
    lastMessage: string;
    lastMessageAt: Timestamp | null;
    lastSenderId: string;
    createdAt: Timestamp | null;
}

/** Iki kullanici arasindaki conversation ID'sini olustur (deterministik) */
function getConversationId(uid1: string, uid2: string): string {
    return [uid1, uid2].sort().join("_");
}

/** Yeni konusma baslat veya mevcut olanin ID'sini dondur */
export async function startConversation(
    myId: string, myUsername: string,
    otherId: string, otherUsername: string
): Promise<string> {
    const convId = getConversationId(myId, otherId);
    const convRef = doc(db, "conversations", convId);
    const snap = await getDoc(convRef);

    if (!snap.exists()) {
        await setDoc(convRef, {
            participants: [myId, otherId],
            participantUsernames: { [myId]: myUsername, [otherId]: otherUsername },
            lastMessage: "",
            lastMessageAt: serverTimestamp(),
            lastSenderId: "",
            createdAt: serverTimestamp(),
        });
    }
    return convId;
}

/** Kullanicinin tum konusmalarini dinle (realtime) */
export function subscribeToConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
) {
    const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", userId),
        orderBy("lastMessageAt", "desc")
    );
    return onSnapshot(q, (snap) => {
        const items = snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
        })) as Conversation[];
        callback(items);
    }, (err) => {
        console.warn("Konusma dinleme hatasi:", err);
        callback([]);
    });
}

/** Bir konusmanin mesajlarini dinle (realtime) */
export function subscribeToMessages(
    conversationId: string,
    callback: (messages: ChatMessage[]) => void
) {
    const q = query(
        collection(db, "conversations", conversationId, "messages"),
        orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (snap) => {
        const items = snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
        })) as ChatMessage[];
        callback(items);
    }, (err) => {
        console.warn("Mesaj dinleme hatasi:", err);
        callback([]);
    });
}

/** Mesaj gonder */
export async function sendMessage(
    conversationId: string,
    senderId: string,
    senderUsername: string,
    content: string
) {
    // Mesaji subcollection'a ekle
    await addDoc(collection(db, "conversations", conversationId, "messages"), {
        senderId,
        senderUsername,
        content,
        read: false,
        createdAt: serverTimestamp(),
    });

    // Konusma metadata'sini guncelle
    await updateDoc(doc(db, "conversations", conversationId), {
        lastMessage: content,
        lastMessageAt: serverTimestamp(),
        lastSenderId: senderId,
    });
}

/** Kullanici ara (username ile) */
export async function searchUsers(searchTerm: string, currentUserId: string) {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs
        .map(d => ({ id: d.id, username: d.data().username || "", displayName: d.data().displayName || "" }))
        .filter(u => u.id !== currentUserId && u.username.toLowerCase().includes(searchTerm.toLowerCase()));
}
