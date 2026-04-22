import {
    collection, doc, getDoc, setDoc, getDocs, query, where,
    updateDoc, serverTimestamp, Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { createNotification } from "./notificationService";

/**
 * Usta Ol! Gorev Sistemi
 * 6 gorev tamamlaninca kullanici otomatik "usta" yapilir.
 */

export interface QuestProgress {
    entryWritten: boolean;       // 1 forum entry'si
    surveyVoted: boolean;        // 1 anket oyu
    businessAdded: boolean;      // 1 oto isletme ekleme
    dnaCommented: boolean;       // 1 DNA analizi yorumu
    ekspertizDone: boolean;      // 1 ekspertiz tercihi
    guvenmetreDone: boolean;     // 1 guvenmetre firma tercihi
    completedCount: number;      // Tamamlanan gorev sayisi
    allCompleted: boolean;       // Tumu tamamlandi mi
    promotedAt: Timestamp | null;
}

export const QUEST_DEFINITIONS = [
    {
        key: "entryWritten" as const,
        title: "Forum'a Entry Gir",
        description: "Herhangi bir basliga 1 entry yaz",
        icon: "MessageSquare",
        href: "/forum",
        color: "#3B82F6",
    },
    {
        key: "businessAdded" as const,
        title: "Oto Isletme Ekle",
        description: "Ilindeki bir oto tamirci veya aksesuarci ekle",
        icon: "Store",
        href: "/ayarlar?tab=usta",
        color: "#10B981",
    },
    {
        key: "surveyVoted" as const,
        title: "Ankete Oy Ver",
        description: "Bir topluluk anketinde oy kullan",
        icon: "BarChart3",
        href: "/anket",
        color: "#8B5CF6",
    },
    {
        key: "dnaCommented" as const,
        title: "DNA Analizi Yorumu Yap",
        description: "Bir arac DNA analizine yorum birak",
        icon: "Dna",
        href: "/arac-dna",
        color: "#F59E0B",
    },
    {
        key: "ekspertizDone" as const,
        title: "Ekspertiz Tercihi Yap",
        description: "Karsilastirma modulunde bir tercih yap",
        icon: "ClipboardCheck",
        href: "/karsilastirma",
        color: "#EF4444",
    },
    {
        key: "guvenmetreDone" as const,
        title: "Guvenmetre Firma Sec",
        description: "Guvenmetrede bir firma tercih yap",
        icon: "Shield",
        href: "/guvenmetre",
        color: "#06B6D4",
    },
];

/** Gorev ilerleme durumunu oku */
export async function getQuestProgress(userId: string): Promise<QuestProgress> {
    const ref = doc(db, "userQuests", userId);
    const snap = await getDoc(ref);

    const defaults: QuestProgress = {
        entryWritten: false,
        surveyVoted: false,
        businessAdded: false,
        dnaCommented: false,
        ekspertizDone: false,
        guvenmetreDone: false,
        completedCount: 0,
        allCompleted: false,
        promotedAt: null,
    };

    if (!snap.exists()) return defaults;

    const data = snap.data();
    const progress: QuestProgress = {
        entryWritten: data.entryWritten || false,
        surveyVoted: data.surveyVoted || false,
        businessAdded: data.businessAdded || false,
        dnaCommented: data.dnaCommented || false,
        ekspertizDone: data.ekspertizDone || false,
        guvenmetreDone: data.guvenmetreDone || false,
        completedCount: 0,
        allCompleted: false,
        promotedAt: data.promotedAt || null,
    };

    const boolKeys: (keyof QuestProgress)[] = [
        "entryWritten", "surveyVoted", "businessAdded",
        "dnaCommented", "ekspertizDone", "guvenmetreDone"
    ];
    progress.completedCount = boolKeys.filter(k => progress[k] === true).length;
    progress.allCompleted = progress.completedCount === 6;

    return progress;
}

/** Gorevi tamamla */
export async function markQuestComplete(
    userId: string,
    questKey: keyof Pick<QuestProgress, "entryWritten" | "surveyVoted" | "businessAdded" | "dnaCommented" | "ekspertizDone" | "guvenmetreDone">
) {
    const ref = doc(db, "userQuests", userId);
    await setDoc(ref, { [questKey]: true }, { merge: true });

    // Gorevi tamamladiginda kullaniciya bildirim
    const quest = QUEST_DEFINITIONS.find(q => q.key === questKey);
    if (quest) {
        await createNotification({
            userId,
            type: "info",
            title: "Gorev Tamamlandi!",
            message: `"${quest.title}" gorevi basariyla tamamlandi. Usta olmaya bir adim daha yaklastiniz!`,
        });
    }

    // Kontrol et: Tum gorevler tamamlandi mi?
    await checkAndPromote(userId);
}

/** 6/6 ise usta yap + bildirim gonder */
export async function checkAndPromote(userId: string): Promise<boolean> {
    const progress = await getQuestProgress(userId);

    if (!progress.allCompleted) return false;
    if (progress.promotedAt) return false; // Zaten terfi etmis

    // Kullaniciyi usta yap
    await updateDoc(doc(db, "users", userId), {
        role: "usta",
        level: "Usta",
    });

    // Quest'i tamamlandi olarak isaretle
    await setDoc(doc(db, "userQuests", userId), {
        promotedAt: serverTimestamp(),
    }, { merge: true });

    // Kullaniciya bildirim
    await createNotification({
        userId,
        type: "promotion",
        title: "Tebrikler! Usta Oldunuz!",
        message: "Tum gorevleri basariyla tamamladiniz. Artik Usta statusundesiniz!",
    });

    // Admin'e bildirim gonder
    await notifyAdminsAboutPromotion(userId);

    return true;
}

/** Tum adminlere terfi bildirimi */
async function notifyAdminsAboutPromotion(userId: string) {
    try {
        // Kullanici adini al
        const userSnap = await getDoc(doc(db, "users", userId));
        const username = userSnap.data()?.username || "Bilinmeyen";

        // Admin'leri bul
        const adminsQ = query(collection(db, "users"), where("role", "==", "admin"));
        const adminsSnap = await getDocs(adminsQ);

        for (const adminDoc of adminsSnap.docs) {
            await createNotification({
                userId: adminDoc.id,
                type: "system",
                title: "Yeni Usta!",
                message: `@${username} tum gorevleri tamamlayarak Usta oldu!`,
            });
        }
    } catch (e) {
        console.error("Admin bildirim hatasi:", e);
    }
}
