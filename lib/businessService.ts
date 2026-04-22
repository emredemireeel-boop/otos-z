import {
    collection, addDoc, getDocs, query, where, orderBy,
    doc, updateDoc, deleteDoc, serverTimestamp, Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { markQuestComplete } from "./questService";
import { createNotification } from "./notificationService";

export type BusinessType = "tamirci" | "aksesuarci" | "yikama" | "lastikci" | "elektrikci" | "boyaci" | "diger";

export interface Business {
    id: string;
    name: string;
    type: BusinessType;
    city: string;
    district: string;
    phone: string;
    address: string;
    addedBy: string;
    addedByUsername: string;
    createdAt: Timestamp | null;
    approved: boolean;
}

export const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
    { value: "tamirci", label: "Oto Tamirci" },
    { value: "aksesuarci", label: "Aksesuarci" },
    { value: "yikama", label: "Oto Yikama" },
    { value: "lastikci", label: "Lastikci" },
    { value: "elektrikci", label: "Oto Elektrikci" },
    { value: "boyaci", label: "Oto Boyaci" },
    { value: "diger", label: "Diger" },
];

/** Isletme ekle + gorev tamamla */
export async function addBusiness(data: {
    name: string;
    type: BusinessType;
    city: string;
    district: string;
    phone: string;
    address: string;
    addedBy: string;
    addedByUsername: string;
}): Promise<string> {
    const docRef = await addDoc(collection(db, "businesses"), {
        ...data,
        approved: false,
        createdAt: serverTimestamp(),
    });

    // Gorev tamamla
    await markQuestComplete(data.addedBy, "businessAdded");

    // Admin'lere onay bildirimi
    try {
        const adminsQ = query(collection(db, "users"), where("role", "==", "admin"));
        const adminsSnap = await getDocs(adminsQ);
        for (const adminDoc of adminsSnap.docs) {
            await createNotification({
                userId: adminDoc.id,
                type: "system",
                title: "Yeni Isletme Onay Bekliyor",
                message: `@${data.addedByUsername} "${data.name}" isletmesini ekledi. Onayiniz bekleniyor.`,
            });
        }
    } catch (e) {
        console.error("Bildirim hatasi:", e);
    }

    return docRef.id;
}

/** Onay bekleyen isletmeleri getir (admin icin) */
export async function getPendingBusinesses(): Promise<Business[]> {
    const q = query(
        collection(db, "businesses"),
        where("approved", "==", false),
        orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Business));
}

/** Tum onaylanmis isletmeleri getir */
export async function getApprovedBusinesses(city?: string): Promise<Business[]> {
    let q;
    if (city) {
        q = query(
            collection(db, "businesses"),
            where("approved", "==", true),
            where("city", "==", city)
        );
    } else {
        q = query(
            collection(db, "businesses"),
            where("approved", "==", true)
        );
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Business));
}

/** Isletmeyi onayla */
export async function approveBusiness(businessId: string): Promise<void> {
    await updateDoc(doc(db, "businesses", businessId), { approved: true });
}

/** Isletmeyi reddet / sil */
export async function rejectBusiness(businessId: string): Promise<void> {
    await deleteDoc(doc(db, "businesses", businessId));
}
