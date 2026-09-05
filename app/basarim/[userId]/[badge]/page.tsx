import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Award, Trophy, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AchievementShareButton from "./AchievementShareButton";
import { getAdminDb } from "@/lib/firebaseAdmin";
import styles from "./page.module.css";

interface Props { params:Promise<{ userId:string; badge:string }>; }
async function achievement(params:Props["params"]) {
    const { userId, badge:encoded } = await params;
    const badge = decodeURIComponent(encoded);
    const snapshot = await getAdminDb().collection("users").doc(userId).get();
    const data = snapshot.data();
    if (!snapshot.exists || !Array.isArray(data?.badges) || !data.badges.includes(badge)) return null;
    return { userId, badge, username:data.username || data.displayName || "OtoSöz üyesi" };
}
export async function generateMetadata({ params }:Props):Promise<Metadata> {
    const item=await achievement(params); if(!item)return{title:"Başarım bulunamadı | OtoSöz",robots:{index:false,follow:false}};
    const url=`https://otosoz.com/basarim/${item.userId}/${encodeURIComponent(item.badge)}`; const title=`${item.badge} başarımı | OtoSöz`; const description=`@${item.username}, OtoSöz'de “${item.badge}” rozetini kazandı.`;
    return { title,description,alternates:{canonical:url},robots:{index:false,follow:true},openGraph:{title,description,url,type:"profile",images:[{url:`/api/og?title=${encodeURIComponent(item.badge)}&desc=${encodeURIComponent(description)}`,width:1200,height:630}]},twitter:{card:"summary_large_image",title,description} };
}
export default async function AchievementPage({ params }:Props) { const item=await achievement(params);if(!item)notFound();return <div className={styles.page}><Navbar/><main className={styles.main}><article className={styles.card}><div className={styles.brand}><ShieldCheck/> OtoSöz başarımı</div><div className={styles.icon}><Trophy/></div><span className={styles.kicker}>Kazanılan rozet</span><h1>{item.badge}</h1><p>@{item.username}, gerçek otomotiv deneyimine katkısıyla bu başarımı kazandı.</p><div className={styles.footer}><span><Award/> Topluluk katkısı doğrulandı</span><AchievementShareButton badge={item.badge} username={item.username}/></div></article></main><Footer/></div>; }
