import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
    title:"Otomotiv Bilgi Yarışması: Günlük Quiz ve XP | OtoSöz",
    description:"Her gün 10 otomotiv sorusu çözün, doğru cevapların açıklamasını öğrenin, XP kazanın ve haftalık OtoSöz sıralamasına girin.",
    alternates:{ canonical:"https://otosoz.com/bilgi-yarismasi" },
    keywords:["otomotiv bilgi yarışması","araba quiz","otomobil soruları","motor bilgisi testi","günlük otomotiv testi"],
    openGraph:{ title:"OtoSöz Otomotiv Bilgi Yarışması", description:"10 soruda otomotiv bilgini ölç, XP kazan ve haftalık sıralamaya gir.", url:"https://otosoz.com/bilgi-yarismasi", type:"website" },
};

export default function QuizPage() {
    const schema = { "@context":"https://schema.org", "@type":"Quiz", name:"OtoSöz Otomotiv Bilgi Yarışması", description:"Günlük ve haftalık 10 soruluk otomotiv bilgi yarışması.", educationalLevel:"Başlangıç ve orta", about:["Otomobil bakımı","Arıza bilgisi","Güvenli sürüş","Araç teknolojisi"], inLanguage:"tr-TR" };
    return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html:JSON.stringify(schema) }} /><QuizClient /></>;
}
