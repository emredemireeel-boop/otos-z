import {
    collection, getDocs, query, where, orderBy,
    onSnapshot, Timestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

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
    blockedBy?: string[];
}

async function messageApi(body: Record<string, unknown>) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Mesajlar için giriş yapmalısınız.");
    const token = await currentUser.getIdToken();
    const response = await fetch("/api/mobile/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(body),
    });
    const result = await response.json().catch(() => ({})) as { message?: string; conversationId?: string };
    if (!response.ok) throw new Error(result.message || "Mesaj işlemi tamamlanamadı.");
    return result;
}

export async function startConversation(myId: string, myUsername: string, otherId: string, otherUsername: string): Promise<string> {
    if (auth.currentUser?.uid !== myId) throw new Error("Oturum doğrulanamadı.");
    void myUsername;
    void otherUsername;
    const result = await messageApi({ action: "start", otherUserId: otherId });
    if (!result.conversationId) throw new Error("Konuşma başlatılamadı.");
    return result.conversationId;
}

export function subscribeToConversations(userId: string, callback: (conversations: Conversation[]) => void) {
    const q = query(collection(db, "conversations"), where("participants", "array-contains", userId), orderBy("lastMessageAt", "desc"));
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map((item) => ({ id: item.id, ...item.data() })) as Conversation[]);
    }, (err) => {
        console.warn("Konuşma dinleme hatası:", err);
        callback([]);
    });
}

export function subscribeToMessages(conversationId: string, callback: (messages: ChatMessage[]) => void) {
    const q = query(collection(db, "conversations", conversationId, "messages"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map((item) => ({ id: item.id, ...item.data() })) as ChatMessage[]);
    }, (err) => {
        console.warn("Mesaj dinleme hatası:", err);
        callback([]);
    });
}

export async function setConversationBlocked(conversationId: string, userId: string, blocked: boolean) {
    if (auth.currentUser?.uid !== userId) throw new Error("Oturum doğrulanamadı.");
    await messageApi({ action: "block", conversationId, blocked });
}

export async function sendMessage(conversationId: string, senderId: string, senderUsername: string, content: string) {
    if (auth.currentUser?.uid !== senderId) throw new Error("Oturum doğrulanamadı.");
    void senderUsername;
    await messageApi({ action: "send", conversationId, content });
}

export async function searchUsers(searchTerm: string, currentUserId: string) {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs
        .map((item) => ({ id: item.id, username: item.data().username || "", displayName: item.data().displayName || "" }))
        .filter((item) => item.id !== currentUserId && item.username.toLowerCase().includes(searchTerm.toLowerCase()));
}
