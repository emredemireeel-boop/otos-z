"use client";
import { useEffect, useState } from "react";
import { BellRing, CalendarClock, MessageSquareReply, Fuel, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { subscribeToPush, type PushPreferences } from "@/lib/pushNotificationService";
import styles from "./PushNotificationManager.module.css";
const DEFAULTS:PushPreferences = { maintenance:true, replies:true, fuel:true };
export default function PushNotificationManager() {
    const { firebaseUser } = useAuth(); const [visible,setVisible]=useState(false); const [prefs,setPrefs]=useState(DEFAULTS); const [busy,setBusy]=useState(false); const [message,setMessage]=useState("");
    useEffect(() => {
        if (!firebaseUser || !("Notification" in window)) return;
        if (Notification.permission === "granted") {
            let saved=DEFAULTS; try { saved={...DEFAULTS,...JSON.parse(localStorage.getItem("push_preferences") || "{}")} } catch {}
            void subscribeToPush(firebaseUser, saved).catch(() => {}); return;
        }
        if (Notification.permission === "denied") return;
        const until = Number(localStorage.getItem("push_prompt_snooze") || 0); if (Date.now() < until) return;
        const timer=setTimeout(() => setVisible(true), 9000); return () => clearTimeout(timer);
    },[firebaseUser]);
    if (!visible || !firebaseUser) return null;
    const toggle=(key:keyof PushPreferences)=>setPrefs(current=>({...current,[key]:!current[key]}));
    const close=()=>{ localStorage.setItem("push_prompt_snooze", String(Date.now()+7*86400000)); setVisible(false); };
    const enable=async()=>{ setBusy(true);setMessage("");try{localStorage.setItem("push_preferences",JSON.stringify(prefs));await subscribeToPush(firebaseUser,prefs);setMessage("Bildirimler açıldı.");setTimeout(()=>setVisible(false),1200);}catch(error){setMessage(error instanceof Error?error.message:"Bildirim açılamadı.");}finally{setBusy(false);} };
    return <aside className={styles.card} role="dialog" aria-label="OtoSöz bildirim tercihleri"><button className={styles.close} onClick={close} aria-label="Şimdi değil"><X size={16}/></button><div className={styles.heading}><span><BellRing size={20}/></span><div><b>Önemli gelişmeleri kaçırma</b><p>Yalnızca seçtiğin konularda tarayıcı bildirimi gönderelim.</p></div></div><div className={styles.choices}><button className={prefs.maintenance?styles.on:""} onClick={()=>toggle("maintenance")}><CalendarClock/>Bakım zamanı</button><button className={prefs.replies?styles.on:""} onClick={()=>toggle("replies")}><MessageSquareReply/>Yeni cevap</button><button className={prefs.fuel?styles.on:""} onClick={()=>toggle("fuel")}><Fuel/>Yakıt fiyatı</button></div><div className={styles.actions}><button onClick={close}>Şimdi değil</button><button disabled={busy||!Object.values(prefs).some(Boolean)} onClick={enable}>{busy?"Açılıyor…":"Bildirimleri aç"}</button></div>{message&&<p className={styles.message}>{message}</p>}</aside>;
}
