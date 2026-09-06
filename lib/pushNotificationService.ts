import type { User as FirebaseUser } from "firebase/auth";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { app } from "@/lib/firebase";

export interface PushPreferences { maintenance:boolean; replies:boolean; messages:boolean; fuel:boolean; }

function workerUrl() {
    const params = new URLSearchParams({
        apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
        authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
        projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
        storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
        messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
        appId:process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    });
    return `/firebase-messaging-sw.js?${params.toString()}`;
}

export async function subscribeToPush(user: FirebaseUser, preferences: PushPreferences) {
    if (!(await isSupported()) || !("serviceWorker" in navigator) || !("Notification" in window)) throw new Error("Bu tarayıcı push bildirimini desteklemiyor.");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") throw new Error("Bildirim izni verilmedi.");
    const registration = await navigator.serviceWorker.register(workerUrl(), { scope:"/" });
    await navigator.serviceWorker.ready;
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim();
    const token = await getToken(getMessaging(app), { serviceWorkerRegistration:registration, ...(vapidKey ? { vapidKey } : {}) });
    if (!token) throw new Error("Bildirim anahtarı üretilemedi.");
    const idToken = await user.getIdToken();
    const response = await fetch("/api/push/subscribe", { method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${idToken}` }, body:JSON.stringify({ token, preferences }) });
    if (!response.ok) throw new Error("Bildirim tercihi kaydedilemedi.");
    localStorage.setItem("otosoz_push_token", token);
    return token;
}

export async function unsubscribeFromPush(user: FirebaseUser) {
    const token = localStorage.getItem("otosoz_push_token");
    if (!token) return;
    const idToken = await user.getIdToken();
    const response = await fetch("/api/push/subscribe", {
        method:"DELETE",
        keepalive:true,
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${idToken}` },
        body:JSON.stringify({ token }),
    });
    if (response.ok) localStorage.removeItem("otosoz_push_token");
}
