import { getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { getAdminDb } from "@/lib/firebaseAdmin";

export type PushPreference = "maintenance" | "replies" | "messages" | "fuel";
export async function sendPushToUser(userId:string, payload:{ title:string; body:string; link:string; tag?:string }, preference:PushPreference) {
    try {
        const db = getAdminDb();
        const snapshot = await db.collection("push_subscriptions").where("userId", "==", userId).limit(500).get();
        const docs = snapshot.docs.filter(doc => doc.data()?.preferences?.[preference] !== false && typeof doc.data()?.token === "string");
        if (!docs.length || !getApps().length) return { sent:0, failed:0 };
        const response = await getMessaging(getApps()[0]).sendEachForMulticast({
            tokens:docs.map(doc => doc.data().token),
            notification:{ title:payload.title, body:payload.body },
            data:{ link:payload.link, tag:payload.tag || preference },
            webpush:{ fcmOptions:{ link:payload.link } },
        });
        const invalid = new Set(["messaging/registration-token-not-registered", "messaging/invalid-registration-token"]);
        const batch = db.batch(); let hasInvalid=false;
        response.responses.forEach((item,index) => { if (!item.success && invalid.has(item.error?.code || "")) { batch.delete(docs[index].ref); hasInvalid=true; } });
        if (hasInvalid) await batch.commit();
        return { sent:response.successCount, failed:response.failureCount };
    } catch (error) { console.warn("Push gönderilemedi:", error); return { sent:0, failed:1 }; }
}
