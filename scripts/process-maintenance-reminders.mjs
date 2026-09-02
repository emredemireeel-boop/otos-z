import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { FieldPath, FieldValue, getFirestore } from "firebase-admin/firestore";

const TIMEZONE = "Europe/Istanbul";
const PAGE_SIZE = 500;
const DRY_RUN = process.argv.includes("--dry-run");

const ITEM_LABELS = {
    inspection: "Araç muayenesi",
    insurance: "Trafik sigortası",
    mtv: "MTV ödemesi",
    kasko: "Kasko yenilemesi",
    maintenance: "Periyodik bakım",
    oilChange: "Motor yağı değişimi",
    oilFilter: "Yağ filtresi değişimi",
    airFilter: "Hava filtresi değişimi",
    trigerBelt: "Triger seti değişimi",
    polenFilter: "Polen filtresi değişimi",
    fuelFilter: "Yakıt filtresi değişimi",
    dpf: "DPF kontrolü",
    sparkPlugs: "Buji değişimi",
    brakePads: "Fren balatası kontrolü",
    brakeFluid: "Fren hidroliği değişimi",
    transmissionFluid: "Şanzıman yağı değişimi",
    tireRotation: "Lastik rotasyonu",
    coolant: "Antifriz değişimi",
    battery: "Akü kontrolü",
};

function dateInTimezone(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
}

function dayDifference(fromDate, toDate) {
    const from = Date.parse(`${fromDate}T00:00:00Z`);
    const to = Date.parse(`${toDate}T00:00:00Z`);
    return Math.round((to - from) / 86_400_000);
}

function readableDate(dateValue) {
    return new Intl.DateTimeFormat("tr-TR", {
        timeZone: TIMEZONE,
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(`${dateValue}T12:00:00Z`));
}

function reminderFor(label, dueDate, daysUntil) {
    if (daysUntil > 0 && daysUntil <= 7) {
        return {
            stage: "week",
            type: "warning",
            title: daysUntil === 7 ? `${label} için 1 hafta kaldı` : `${label} için ${daysUntil} gün kaldı`,
            message: `${readableDate(dueDate)} tarihindeki işleminizi unutmayın. Bakım Ajandası'ndan tarihi güncelleyebilirsiniz.`,
        };
    }
    if (daysUntil <= 0) {
        const isToday = daysUntil === 0;
        return {
            stage: "due",
            type: "warning",
            title: isToday ? `${label} bugün` : `${label} tarihi geçti`,
            message: isToday
                ? `Bugün ${label.toLocaleLowerCase("tr-TR")} zamanı. İşlemi tamamladıktan sonra yeni tarihi ajandanıza kaydedin.`
                : `${readableDate(dueDate)} tarihli işlem henüz güncellenmedi. Tamamladıysanız yeni tarihi ajandanıza kaydedin.`,
        };
    }
    return null;
}

async function createOnce(db, id, data) {
    if (DRY_RUN) return true;
    try {
        await db.collection("notifications").doc(id).create(data);
        return true;
    } catch (error) {
        if (error?.code === 6 || error?.code === "already-exists") return false;
        throw error;
    }
}

async function processAgenda(db, snapshot, today, counters) {
    const agenda = snapshot.data();
    const userId = typeof agenda.userId === "string" ? agenda.userId : snapshot.id;
    if (!agenda.items || typeof agenda.items !== "object") return;

    for (const [itemKey, item] of Object.entries(agenda.items)) {
        if (!item || item.enabled !== true || item.notify !== true || typeof item.dueDate !== "string") continue;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(item.dueDate)) continue;

        const daysUntil = dayDifference(today, item.dueDate);
        const label = ITEM_LABELS[itemKey] || "Bakım işlemi";
        const reminder = reminderFor(label, item.dueDate, daysUntil);
        if (!reminder) continue;

        counters.eligible += 1;
        const notificationId = `agenda_${userId}_${itemKey}_${item.dueDate}_${reminder.stage}`;
        const created = await createOnce(db, notificationId, {
            userId,
            type: reminder.type,
            title: reminder.title,
            message: reminder.message,
            read: false,
            createdAt: FieldValue.serverTimestamp(),
            link: "/ajanda",
            source: "maintenance_agenda",
            reminderKey: `${itemKey}:${item.dueDate}:${reminder.stage}`,
            dueDate: item.dueDate,
        });
        if (created) counters.created += 1;
        else counters.duplicates += 1;
    }
}

async function main() {
    const app = getApps()[0] || initializeApp({
        credential: applicationDefault(),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "otosoz",
    });
    const db = getFirestore(app);
    const today = dateInTimezone();
    const counters = { agendas: 0, eligible: 0, created: 0, duplicates: 0 };
    let lastDocument = null;

    do {
        let query = db.collection("maintenance_agendas")
            .orderBy(FieldPath.documentId())
            .limit(PAGE_SIZE);
        if (lastDocument) query = query.startAfter(lastDocument);
        const page = await query.get();
        if (page.empty) break;

        for (const snapshot of page.docs) {
            counters.agendas += 1;
            await processAgenda(db, snapshot, today, counters);
        }
        lastDocument = page.docs.at(-1);
        if (page.size < PAGE_SIZE) break;
    } while (lastDocument);

    console.log(JSON.stringify({ ok: true, dryRun: DRY_RUN, timezone: TIMEZONE, today, ...counters }));
}

main().catch((error) => {
    console.error("Bakım hatırlatıcı görevi başarısız:", error);
    process.exitCode = 1;
});
