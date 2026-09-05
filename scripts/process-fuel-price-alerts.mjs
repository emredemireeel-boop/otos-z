import axios from "axios";
import * as cheerio from "cheerio";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

const app = getApps()[0] || initializeApp({
    credential: applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "otosoz",
});
const db = getFirestore(app);

function citySlug(value) {
    return String(value || "")
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ı/g, "i")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function parsePrice(value) {
    return Number(String(value || "").replace(/[^0-9,.-]/g, "").replace(",", "."));
}

async function fetchPrices(city) {
    const source = `https://www.petrolofisi.com.tr/akaryakit-fiyatlari/${city}-akaryakit-fiyatlari`;
    const response = await axios.get(source, {
        timeout: 12_000,
        headers: { "User-Agent": "OtoSoz-Fuel-Alert/1.0" },
    });
    const $ = cheerio.load(response.data);
    const cells = $("table tbody tr").first().find("td");
    if (cells.length < 7) throw new Error("Fiyat tablosu bulunamadı");
    return {
        benzin: parsePrice($(cells[1]).text()),
        motorin: parsePrice($(cells[2]).text()),
        lpg: parsePrice($(cells[6]).text()),
        source,
    };
}

const subscriptions = await db.collection("push_subscriptions").get();
const groups = new Map();
subscriptions.docs.forEach(doc => {
    const data = doc.data();
    if (data.preferences?.fuel === false || !data.city || !data.token) return;
    const city = citySlug(data.city);
    if (!groups.has(city)) groups.set(city, []);
    groups.get(city).push({ doc, ...data });
});

let notifications = 0;
let pushSent = 0;

for (const [city, citySubscriptions] of groups) {
    try {
        const current = await fetchPrices(city);
        const stateRef = db.collection("fuel_price_states").doc(city);
        const before = (await stateRef.get()).data();
        await stateRef.set({ ...current, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
        if (!before) continue;

        for (const fuel of ["benzin", "motorin", "lpg"]) {
            const delta = Number((current[fuel] - Number(before[fuel] || 0)).toFixed(2));
            if (!Number.isFinite(delta) || Math.abs(delta) < 0.05) continue;

            const label = { benzin: "Benzin", motorin: "Motorin", lpg: "LPG" }[fuel];
            const direction = delta > 0 ? "arttı" : "düştü";
            const title = `${label} fiyatı ${direction}`;
            const body = `${city.replace(/-/g, " ")} için litre fiyatı ${current[fuel].toFixed(2)} TL. Değişim: ${delta > 0 ? "+" : ""}${delta.toFixed(2)} TL.`;
            const users = [...new Set(citySubscriptions.map(item => item.userId))];

            for (const userId of users) {
                const eventId = `fuel_${city}_${fuel}_${new Date().toISOString().slice(0, 10)}_${String(current[fuel]).replace(".", "-")}`;
                try {
                    await db.collection("notifications").doc(`${userId}_${eventId}`).create({
                        userId,
                        type: "info",
                        title,
                        message: body,
                        read: false,
                        createdAt: FieldValue.serverTimestamp(),
                        link: "/piyasalar",
                        source: "fuel_price_alert",
                    });
                    notifications += 1;
                } catch (error) {
                    if (error?.code !== 6 && error?.code !== "already-exists") throw error;
                }
            }

            const result = await getMessaging(app).sendEachForMulticast({
                tokens: citySubscriptions.map(item => item.token),
                notification: { title, body },
                data: { link: "/piyasalar", tag: `fuel-${city}-${fuel}` },
                webpush: { fcmOptions: { link: "/piyasalar" } },
            });
            pushSent += result.successCount;
        }
    } catch (error) {
        console.warn(`Yakıt fiyatı kontrolü başarısız (${city}):`, error?.message || error);
    }
}

console.log(JSON.stringify({ ok: true, cities: groups.size, notifications, pushSent }));
