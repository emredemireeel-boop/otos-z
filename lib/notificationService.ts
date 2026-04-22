import {
    collection, addDoc, getDocs, query, where, orderBy, limit,
    doc, updateDoc, serverTimestamp, onSnapshot, Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface Notification {
    id: string;
    userId: string;
    type: "promotion" | "warning" | "info" | "system";
    title: string;
    message: string;
    read: boolean;
    createdAt: Timestamp | null;
}

/** Bildirim olustur */
export async function createNotification(data: {
    userId: string;
    type: Notification["type"];
    title: string;
    message: string;
}) {
    await addDoc(collection(db, "notifications"), {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        read: false,
        createdAt: serverTimestamp(),
    });
}

/** Kullanicinin bildirimlerini dinle (realtime) */
export function subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void
) {
    const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(20)
    );
    return onSnapshot(q, (snap) => {
        const items = snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
        })) as Notification[];
        callback(items);
    });
}

/** Bildirimi okundu olarak isaretle */
export async function markNotificationRead(notificationId: string) {
    await updateDoc(doc(db, "notifications", notificationId), { read: true });
}

/** Tum bildirimleri okundu yap */
export async function markAllRead(userId: string) {
    const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("read", "==", false)
    );
    const snap = await getDocs(q);
    const promises = snap.docs.map(d => updateDoc(d.ref, { read: true }));
    await Promise.all(promises);
}

/** Kullanici usta'ya terfi ettirildiginde bildirim gonder */
export async function notifyPromotion(userId: string) {
    await createNotification({
        userId,
        type: "promotion",
        title: "Tebrikler! Usta oldunuz!",
        message: "Artik baslik acabilir ve tum forum ozelliklerini kullanabilirsiniz.",
    });
}
