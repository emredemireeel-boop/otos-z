import {
    collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, limit
} from "firebase/firestore";
import { db } from "./firebase";
import { createNotification } from "./notificationService";

/**
 * Uzman Başvuru Servisi
 *
 * Kullanıcılar uzmanlık alanlarında (galerici, tamirci, ekspertiz, trafikçi)
 * başvuru yapar. Başvurular `expert_applications` koleksiyonuna kaydedilir.
 * Admin yönetim panelinden inceleyip onaylar → kullanıcı "uzman" rolü alır.
 */

export type ExpertProfession = "dealer" | "mechanic" | "expert" | "traffic";
export type ExpertAppStatus = "bekliyor" | "onaylandi" | "reddedildi";

export interface ExpertApplication {
    id?: string;
    userId: string;
    username: string;
    profession: ExpertProfession;
    professionTitle: string;
    fullName: string;
    phone: string;
    city: string;
    experience: string;
    businessName: string;
    businessAddress: string;
    message: string;
    documents: string[];      // gerekli belge isimleri
    status: ExpertAppStatus;
    adminNote?: string;
    createdAt?: any;
}

/** Yeni uzman başvurusu oluştur */
export async function submitExpertApplication(data: Omit<ExpertApplication, "status" | "createdAt" | "id">): Promise<string> {
    // Aynı kullanıcının aynı meslekte bekleyen başvurusu var mı?
    const existing = await getDocs(query(
        collection(db, "expert_applications"),
        where("userId", "==", data.userId),
        where("profession", "==", data.profession),
        where("status", "==", "bekliyor")
    ));
    if (!existing.empty) {
        throw new Error("Bu alanda zaten bekleyen bir başvurunuz var.");
    }

    const ref = await addDoc(collection(db, "expert_applications"), {
        ...data,
        status: "bekliyor" as ExpertAppStatus,
        createdAt: serverTimestamp(),
    });

    // Adminlere bildirim
    try {
        const adminsSnap = await getDocs(query(collection(db, "users"), where("role", "==", "admin")));
        for (const adminDoc of adminsSnap.docs) {
            await createNotification({
                userId: adminDoc.id,
                type: "system",
                title: "Yeni Uzman Başvurusu",
                message: `@${data.username} "${data.professionTitle}" alanında uzman başvurusu yaptı.`,
            });
        }
    } catch (e) {
        console.warn("Admin bildirim hatası:", e);
    }

    return ref.id;
}

/** Kullanıcının kendi başvurularını getir */
export async function getMyExpertApplications(userId: string): Promise<ExpertApplication[]> {
    const snap = await getDocs(query(
        collection(db, "expert_applications"),
        where("userId", "==", userId),
        limit(20)
    ));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ExpertApplication));
}
