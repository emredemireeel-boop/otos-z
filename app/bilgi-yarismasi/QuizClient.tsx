"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BrainCircuit, Trophy, Clock3, CheckCircle2, XCircle, Share2, Zap, Medal, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { LAUNCH_CAMPAIGN, isLaunchCampaignActive } from "@/lib/campaign";
import styles from "./page.module.css";

type Mode = "daily" | "weekly";
interface Question { id:string; category:string; question:string; options:string[]; }
interface Rank { rank:number; username:string; correct:number; total:number; xp:number; }
interface Result { id:string; correctIndex:number; selectedIndex:number; isCorrect:boolean; explanation:string; }

export default function QuizClient() {
    const { user, getIdToken } = useAuth();
    const [mode,setMode] = useState<Mode>("daily");
    const [questions,setQuestions] = useState<Question[]>([]);
    const [periodKey,setPeriodKey] = useState("");
    const [leaderboard,setLeaderboard] = useState<Rank[]>([]);
    const [answers,setAnswers] = useState<number[]>([]);
    const [results,setResults] = useState<Result[] | null>(null);
    const [summary,setSummary] = useState<{correct:number;xpAwarded:number;multiplier:number}|null>(null);
    const [loading,setLoading] = useState(true);
    const [message,setMessage] = useState("");

    useEffect(() => {
        setLoading(true); setResults(null); setSummary(null); setMessage("");
        fetch(`/api/quiz?mode=${mode}`, { cache:"no-store" }).then(r => r.json()).then(data => {
            setQuestions(data.questions || []); setPeriodKey(data.periodKey || ""); setLeaderboard(data.leaderboard || []); setAnswers(Array((data.questions || []).length).fill(-1));
        }).catch(() => setMessage("Sorular şu anda yüklenemedi.")).finally(() => setLoading(false));
    }, [mode]);

    const submit = async () => {
        if (!user) { setMessage("XP kazanmak için önce giriş yapmalısın."); return; }
        if (answers.some(answer => answer < 0)) { setMessage("Göndermeden önce 10 soruyu da cevapla."); return; }
        setLoading(true); setMessage("");
        const token = await getIdToken();
        const response = await fetch("/api/quiz", { method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` }, body:JSON.stringify({ mode, periodKey, answers }) });
        const data = await response.json();
        if (!response.ok) setMessage(data.message || "Sonuç kaydedilemedi.");
        else { setResults(data.results); setSummary({ correct:data.correct, xpAwarded:data.xpAwarded, multiplier:data.multiplier }); window.dispatchEvent(new CustomEvent("xp_gained", { detail:{ xpAmount:data.xpAwarded, action:"Bilgi yarışması" } })); }
        setLoading(false);
    };

    const share = async () => {
        const text = summary ? `OtoSöz otomotiv bilgi yarışmasında 10 sorudan ${summary.correct} doğru yaptım! Sen de bilgini ölç.` : "OtoSöz otomotiv bilgi yarışmasında bilgini ölç!";
        try {
            if (navigator.share) await navigator.share({ title:"OtoSöz Bilgi Yarışması", text, url:location.href });
            else await navigator.clipboard.writeText(`${text} ${location.href}`);
            if (user) {
                const token = await getIdToken();
                const response = await fetch("/api/campaign/share", { method:"POST", headers:{ Authorization:`Bearer ${token}` } });
                const data = await response.json();
                setMessage(data.message || "Paylaşım bağlantısı kopyalandı.");
                if (data.xp) window.dispatchEvent(new CustomEvent("xp_gained", { detail:{ xpAmount:data.xp, action:"Lansman paylaşımı" } }));
            } else setMessage("Paylaşım bağlantısı kopyalandı.");
        } catch { setMessage("Paylaşım iptal edildi."); }
    };

    const answered = answers.filter(answer => answer >= 0).length;
    return <div className={styles.page}><Navbar /><main className={styles.main}>
        <header className={styles.hero}><div><span className={styles.eyebrow}><BrainCircuit size={15}/> OtoSöz Akademi</span><h1>Otomotiv bilgi yarışması</h1><p>Ezber değil, gerçek sürüş ve bakım bilgisi. Her tur 10 soru; her cevaptan sonra açıklaması sende kalır.</p></div><div className={styles.heroMetric}><Trophy/><strong>10 soru</strong><span>XP ödüllü</span></div></header>
        {isLaunchCampaignActive() && <section className={styles.campaign}><div><span>Lansman kampanyası</span><h2>İlk 1000 Üye</h2><p>İlk 1000 üyeye özel rozet, ${new Date(LAUNCH_CAMPAIGN.endAt).toLocaleDateString("tr-TR")} tarihine kadar tüm XP'lerde 2x ve ilk sosyal paylaşımda +50 XP.</p></div><button onClick={share}><Share2 size={16}/> Paylaş, +50 XP kazan</button></section>}
        <div className={styles.layout}><section className={styles.quizCard}>
            <div className={styles.toolbar}><div className={styles.tabs}><button className={mode === "daily" ? styles.activeTab:""} onClick={() => setMode("daily")}>Günlük</button><button className={mode === "weekly" ? styles.activeTab:""} onClick={() => setMode("weekly")}>Haftalık</button></div><div className={styles.progress}><span>{answered}/10</span><i><b style={{ width:`${answered * 10}%` }}/></i></div></div>
            {loading && !questions.length ? <div className={styles.loading}>Sorular hazırlanıyor…</div> : <div className={styles.questions}>{questions.map((question,index) => { const result = results?.[index]; return <article className={styles.question} key={question.id}><div className={styles.questionTop}><span>{String(index+1).padStart(2,"0")}</span><em>{question.category}</em></div><h2>{question.question}</h2><div className={styles.options}>{question.options.map((option,optionIndex) => { const selected = answers[index] === optionIndex; const className = result ? (optionIndex === result.correctIndex ? styles.correct : selected ? styles.wrong : "") : selected ? styles.selected : ""; return <button disabled={!!results} className={className} key={option} onClick={() => setAnswers(current => current.map((value,i) => i === index ? optionIndex:value))}><span>{String.fromCharCode(65+optionIndex)}</span>{option}{result && optionIndex === result.correctIndex ? <CheckCircle2 size={18}/>:result && selected ? <XCircle size={18}/>:null}</button>})}</div>{result && <p className={styles.explanation}><strong>{result.isCorrect ? "Doğru." : "Öğrenme notu:"}</strong> {result.explanation}</p>}</article>})}</div>}
            {summary ? <div className={styles.resultBox}><div><Medal/><strong>{summary.correct}/10 doğru</strong><span>+{summary.xpAwarded} XP {summary.multiplier === 2 ? "· 2x lansman bonusu":""}</span></div><button onClick={share}><Share2 size={16}/> Sonucu paylaş</button></div> : <button className={styles.submit} disabled={loading} onClick={submit}><Zap size={18}/>{user ? "Cevapları gönder":"Giriş yap ve XP kazan"}</button>}
            {message && <p className={styles.message}>{message} {!user && <Link href="/giris">Giriş yap</Link>}</p>}
        </section><aside className={styles.aside}><section><div className={styles.asideTitle}><Trophy size={18}/><div><span>Bu hafta</span><h2>Topluluk sıralaması</h2></div></div>{leaderboard.length ? <ol>{leaderboard.map(rank => <li key={rank.rank+rank.username}><b>{rank.rank}</b><span>@{rank.username}</span><strong>{rank.correct}/10</strong></li>)}</ol>:<p className={styles.empty}>Haftanın ilk derecesini sen oluştur.</p>}</section><section><div className={styles.asideTitle}><Clock3 size={18}/><div><span>Nasıl çalışır?</span><h2>Adil ve tek deneme</h2></div></div><ul className={styles.rules}><li>Günlük ve haftalık setler 10 sorudur.</li><li>Her dönem yalnız ilk gönderim XP kazandırır.</li><li>Yanlış cevapta doğru açıklama gösterilir.</li><li>Haftalık puanlar topluluk tablosuna girer.</li></ul></section><Link className={styles.altin} href="/altin-anahtar"><Medal size={18}/><span><b>Altın Anahtar</b>Haritadan güvenilir ustaları keşfet</span></Link></aside></div>
    </main><Footer /></div>;
}
