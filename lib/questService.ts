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
    threadCreated: boolean;      // 1 baslik ac
    receivedLikes: boolean;      // entry'lerin toplam 10 begeni alsin
    profileCompleted: boolean;   // profil bilgilerini tamamla
    streak3: boolean;            // 3 gun ust uste aktif ol
    completedCount: number;      // Tamamlanan gorev sayisi
    totalQuests: number;         // Toplam gorev sayisi
    allCompleted: boolean;       // Tumu tamamlandi mi
    promotedAt: Timestamp | null;
}

export const QUEST_DEFINITIONS = [
    {
        key: "entryWritten" as const,
        title: "İlk Sözünü Söyle",
        description: "Herhangi bir başlığa ilk entry'ni yaz ve topluluğa katıl",
        icon: "MessageSquare",
        href: "/forum",
        color: "#3B82F6",
        xp: 25,
    },
    {
        key: "threadCreated" as const,
        title: "Kendi Başlığını Aç",
        description: "Merak ettiğin bir konuda yeni bir forum başlığı oluştur",
        icon: "PlusCircle",
        href: "/forum",
        color: "#6366F1",
        xp: 30,
    },
    {
        key: "receivedLikes" as const,
        title: "Topluluğun Beğenisini Kazan",
        description: "Yazdığın entry'ler toplam 10 beğeni toplasın",
        icon: "ThumbsUp",
        href: "/forum",
        color: "#EC4899",
        xp: 50,
    },
    {
        key: "businessAdded" as const,
        title: "Esnafı Tanıt",
        description: "İlindeki güvendiğin bir oto tamirci veya esnafı ekle",
        icon: "Store",
        href: "/ayarlar?tab=usta",
        color: "#10B981",
        xp: 40,
    },
    {
        key: "surveyVoted" as const,
        title: "Sesini Duyur",
        description: "Bir topluluk anketinde oy kullanarak fikrini belirt",
        icon: "BarChart3",
        href: "/anket",
        color: "#8B5CF6",
        xp: 15,
    },
    {
        key: "dnaCommented" as const,
        title: "Araç DNA'sına Katkı Yap",
        description: "Bir araç DNA analizine deneyiminden yorum bırak",
        icon: "Dna",
        href: "/arac-dna",
        color: "#F59E0B",
        xp: 35,
    },
    {
        key: "ekspertizDone" as const,
        title: "Karşılaştırma Ustası",
        description: "Karşılaştırma modülünde araçlar arası bir tercih yap",
        icon: "ClipboardCheck",
        href: "/karsilastirma",
        color: "#EF4444",
        xp: 20,
    },
    {
        key: "guvenmetreDone" as const,
        title: "GüvenMetre Değerlendir",
        description: "GüvenMetre'de bir firmayı değerlendir ve puanla",
        icon: "Shield",
        href: "/guvenmetre",
        color: "#06B6D4",
        xp: 25,
    },
    {
        key: "profileCompleted" as const,
        title: "Profilini Tamamla",
        description: "Şehir, araç bilgisi ve profil detaylarını doldur",
        icon: "UserCheck",
        href: "/ayarlar",
        color: "#14B8A6",
        xp: 20,
    },
    {
        key: "streak3" as const,
        title: "Sadık Üye",
        description: "3 gün üst üste platformda aktif ol",
        icon: "Flame",
        href: "/forum",
        color: "#F97316",
        xp: 60,
    },
];

const QUEST_KEYS: (keyof QuestProgress)[] = [
    "entryWritten", "threadCreated", "receivedLikes", "businessAdded",
    "surveyVoted", "dnaCommented", "ekspertizDone", "guvenmetreDone",
    "profileCompleted", "streak3",
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
        threadCreated: false,
        receivedLikes: false,
        profileCompleted: false,
        streak3: false,
        completedCount: 0,
        totalQuests: QUEST_KEYS.length,
        allCompleted: false,
        promotedAt: null,
    };

    if (!snap.exists()) return defaults;

    const data = snap.data();
    const progress: QuestProgress = {
        ...defaults,
        entryWritten: data.entryWritten || false,
        surveyVoted: data.surveyVoted || false,
        businessAdded: data.businessAdded || false,
        dnaCommented: data.dnaCommented || false,
        ekspertizDone: data.ekspertizDone || false,
        guvenmetreDone: data.guvenmetreDone || false,
        threadCreated: data.threadCreated || false,
        receivedLikes: data.receivedLikes || false,
        profileCompleted: data.profileCompleted || false,
        streak3: data.streak3 || false,
        promotedAt: data.promotedAt || null,
    };

    progress.completedCount = QUEST_KEYS.filter(k => progress[k] === true).length;
    progress.allCompleted = progress.completedCount === QUEST_KEYS.length;

    return progress;
}

type QuestKey = "entryWritten" | "surveyVoted" | "businessAdded" | "dnaCommented"
    | "ekspertizDone" | "guvenmetreDone" | "threadCreated" | "receivedLikes"
    | "profileCompleted" | "streak3";

/** Gorevi tamamla */
export async function markQuestComplete(
    userId: string,
    questKey: QuestKey
) {
    const ref = doc(db, "userQuests", userId);

    // Zaten tamamlanmissa tekrar bildirim gonderme
    const before = await getDoc(ref);
    if (before.exists() && before.data()?.[questKey] === true) {
        return;
    }

    await setDoc(ref, { [questKey]: true }, { merge: true });

    // Gorevi tamamladiginda kullaniciya bildirim + XP
    const quest = QUEST_DEFINITIONS.find(q => q.key === questKey);
    if (quest) {
        await createNotification({
            userId,
            type: "info",
            title: "Görev Tamamlandı",
            message: `"${quest.title}" görevini tamamladın (+${quest.xp} XP). Usta olmaya bir adım daha yaklaştın!`,
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
