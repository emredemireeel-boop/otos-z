"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Settings, Fuel, CarFront, Activity, Award, CheckCircle, AlertCircle, Plus, X, Trash2, Sparkles, TrendingUp, Users, CheckSquare, BookOpen, ChevronRight, Gauge, ShieldCheck } from "lucide-react";
import {
    collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
    serverTimestamp, query, orderBy, increment
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import LatestThreadsWidget from "@/components/LatestThreadsWidget";
import AdPlaceholder from "@/components/AdPlaceholder";
import { curatedSurveys } from "@/data/curated-surveys";
import { createSlug, vehicleDNAData } from "@/data/vehicle-dna";

interface Nominee {
    id: number;
    name: string;
    votes: number;
}

interface Survey {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    totalVotes: number;
    nominees: Nominee[];
    createdBy?: string;
    voters?: Record<string, number>; // userId -> nomineeId
    source?: "curated" | "firestore";
}

const CURATED_VOTE_STORAGE_PREFIX = "otosoz-curated-survey-votes";

const libraryShortcuts = [
    { title: "Gösterge ışıkları", description: "Uyarı lambalarının anlamını öğrenin", href: "/kutuphane?kategori=gosterge-isiklari" },
    { title: "OBD arıza kodları", description: "Arıza kodunu hızlıca yorumlayın", href: "/obd" },
    { title: "İkinci el rehberi", description: "Satın almadan önce kontrol listesi", href: "/kutuphane?kategori=ikinci-el-rehberi" },
    { title: "Bakım zamanları", description: "Periyodik bakımı kaçırmayın", href: "/kutuphane?kategori=bakim-zamanlari" },
];

function getCuratedSurveysForUser(userId?: string): Survey[] {
    let savedVotes: Record<string, number> = {};
    if (userId && typeof window !== "undefined") {
        try {
            savedVotes = JSON.parse(window.localStorage.getItem(`${CURATED_VOTE_STORAGE_PREFIX}:${userId}`) || "{}");
        } catch {
            savedVotes = {};
        }
    }

    return curatedSurveys.map((survey) => {
        const selectedNomineeId = savedVotes[survey.id];
        const hasSavedVote = Boolean(userId && selectedNomineeId !== undefined);
        return {
            ...survey,
            totalVotes: survey.totalVotes + (hasSavedVote ? 1 : 0),
            nominees: survey.nominees.map((nominee) => ({
                ...nominee,
                votes: nominee.votes + (hasSavedVote && nominee.id === selectedNomineeId ? 1 : 0),
            })),
            voters: hasSavedVote && userId ? { [userId]: selectedNomineeId } : {},
        };
    });
}

export default function AnketPage() {
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const categories = ["Tümü", "Motor", "Performans", "Modifiye", "Sürüş", "Genel"];



    const showToast = (message: string, type: 'error' | 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Editör anketleri her zaman görünür; topluluk anketleri Firestore'dan eklenir.
    useEffect(() => {
        const loadSurveys = async () => {
            const builtInSurveys = getCuratedSurveysForUser(user?.id as string | undefined);
            try {
                const snap = await getDocs(query(collection(db, "surveys"), orderBy("createdAt", "desc")));
                const items = snap.docs.map(d => ({
                    id: d.id,
                    ...d.data(),
                    source: "firestore" as const,
                })) as Survey[];
                const curatedTitles = new Set(builtInSurveys.map(survey => survey.title.toLocaleLowerCase("tr-TR")));
                const uniqueCommunitySurveys = items.filter(survey => !curatedTitles.has(survey.title.toLocaleLowerCase("tr-TR")));
                setSurveys([...builtInSurveys, ...uniqueCommunitySurveys]);
            } catch (e) {
                console.warn("Anketler yuklenemedi:", e);
                setSurveys(builtInSurveys);
            }
            setLoading(false);
        };
        loadSurveys();
    }, [user?.id]);

    // Handle vote
    const handleVote = async (surveyId: string, nomineeId: number) => {
        if (!user) {
            showToast("Oy verebilmek icin uye girisi yapmalisiniz.", "error");
            return;
        }

        const survey = surveys.find(s => s.id === surveyId);
        if (!survey) return;

        const voters = survey.voters || {};
        const prevNomineeId = voters[user.id as string];
        if (prevNomineeId === nomineeId) return; // Same vote

        // Optimistic update
        setSurveys(prev => prev.map(s => {
            if (s.id !== surveyId) return s;
            const newVoters = { ...s.voters, [user.id as string]: nomineeId };
            const newTotalVotes = prevNomineeId !== undefined ? s.totalVotes : s.totalVotes + 1;
            return {
                ...s,
                totalVotes: newTotalVotes,
                voters: newVoters,
                nominees: s.nominees.map(n => {
                    let newVotes = n.votes;
                    if (n.id === nomineeId) newVotes += 1;
                    else if (n.id === prevNomineeId) newVotes = Math.max(0, newVotes - 1);
                    return { ...n, votes: newVotes };
                }),
            };
        }));

        if (survey.source === "curated") {
            try {
                const storageKey = `${CURATED_VOTE_STORAGE_PREFIX}:${user.id as string}`;
                const savedVotes = JSON.parse(window.localStorage.getItem(storageKey) || "{}") as Record<string, number>;
                savedVotes[surveyId] = nomineeId;
                window.localStorage.setItem(storageKey, JSON.stringify(savedVotes));
                showToast("Oyunuz kaydedildi!", "success");
                try {
                    const { markQuestComplete } = await import("@/lib/questService");
                    await markQuestComplete(user.id as string, "surveyVoted");
                } catch { /* sessiz */ }
            } catch {
                showToast("Oy tarayıcıya kaydedilemedi, tekrar deneyin.", "error");
            }
            return;
        }

        // Topluluk anketlerini Firebase'e kaydet.
        try {
            const surveyRef = doc(db, "surveys", surveyId);
            const updatedSurvey = surveys.find(s => s.id === surveyId)!;
            const newVoters = { ...(updatedSurvey.voters || {}), [user.id as string]: nomineeId };
            const newNominees = updatedSurvey.nominees.map(n => {
                let newVotes = n.votes;
                if (n.id === nomineeId) newVotes += 1;
                else if (n.id === prevNomineeId) newVotes = Math.max(0, newVotes - 1);
                return { ...n, votes: newVotes };
            });
            const newTotalVotes = prevNomineeId !== undefined ? updatedSurvey.totalVotes : updatedSurvey.totalVotes + 1;

            await updateDoc(surveyRef, {
                voters: newVoters,
                nominees: newNominees,
                totalVotes: newTotalVotes,
            });
            showToast("Oyunuz kaydedildi!", "success");
            // Görev tetikle: ankete oy verildi
            try {
                const { markQuestComplete } = await import("@/lib/questService");
                await markQuestComplete(user.id as string, "surveyVoted");
            } catch { /* sessiz */ }
        } catch (e) {
            console.error("Oy kaydedilemedi:", e);
            showToast("Oy kaydedilemedi, tekrar deneyin.", "error");
        }
    };

    // Create new survey
    const handleCreateSurvey = async (data: { title: string; description: string; category: string; options: string[] }) => {
        if (!user) return;
        try {
            const nominees = data.options.map((name, i) => ({ id: i + 1, name, votes: 0 }));
            const docRef = await addDoc(collection(db, "surveys"), {
                title: data.title,
                description: data.description,
                category: data.category,
                status: "pending",
                totalVotes: 0,
                nominees,
                voters: {},
                createdBy: user.username,
                createdById: user.id as string,
                createdAt: serverTimestamp(),
            });
            setSurveys(prev => [{
                id: docRef.id,
                title: data.title,
                description: data.description,
                category: data.category,
                status: "pending",
                totalVotes: 0,
                nominees,
                voters: {},
                createdBy: user.username,
            }, ...prev]);
            setShowCreateModal(false);
            showToast("Anketiniz onay için yönetime gönderildi!", "success");
        } catch (e) {
            console.error("Anket olusturulamadi:", e);
            showToast("Anket olusturulamadi.", "error");
        }
    };

    const filteredSurveys = useMemo(() => {
        const activeSurveys = surveys.filter(s => s.status === 'active');
        if (selectedCategory === "Tümü") return activeSurveys;
        return activeSurveys.filter(s => s.category === selectedCategory);
    }, [surveys, selectedCategory]);

    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.max(1, Math.ceil(filteredSurveys.length / ITEMS_PER_PAGE));
    const paginatedSurveys = filteredSurveys.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const activeSurveys = useMemo(() => surveys.filter(survey => survey.status === "active"), [surveys]);
    const featuredSurveys = useMemo(
        () => [...activeSurveys].sort((a, b) => b.totalVotes - a.totalVotes).slice(0, 2),
        [activeSurveys]
    );
    const popularSurveys = useMemo(
        () => [...activeSurveys].sort((a, b) => b.totalVotes - a.totalVotes).slice(0, 4),
        [activeSurveys]
    );
    const totalVotes = useMemo(() => activeSurveys.reduce((sum, survey) => sum + survey.totalVotes, 0), [activeSurveys]);
    const popularCategory = useMemo(() => {
        const totals = activeSurveys.reduce<Record<string, number>>((acc, survey) => {
            acc[survey.category] = (acc[survey.category] || 0) + survey.totalVotes;
            return acc;
        }, {});
        return Object.entries(totals).sort(([, a], [, b]) => b - a)[0]?.[0] || "Genel";
    }, [activeSurveys]);
    const featuredVehicles = vehicleDNAData.slice(0, 3);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    const focusSurvey = (surveyId: string) => {
        const surveyIndex = activeSurveys.findIndex(survey => survey.id === surveyId);
        if (surveyIndex < 0) return;
        setSelectedCategory("Tümü");
        setCurrentPage(Math.floor(surveyIndex / ITEMS_PER_PAGE) + 1);
        window.setTimeout(() => {
            const element = document.getElementById(`survey-${surveyId}`);
            if (!element) return;
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: "smooth" });
        }, 80);
    };

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Toast */}
                {toast && (
                    <div style={{
                        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px',
                        background: toast.type === 'error' ? 'var(--card-bg)' : '#10B981',
                        border: toast.type === 'error' ? '1px solid #EF4444' : 'none',
                        color: toast.type === 'error' ? '#EF4444' : 'white',
                        borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        zIndex: 9999, fontWeight: '600',
                    }}>
                        {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                        {toast.message}
                    </div>
                )}

                {/* Sub Header */}
                <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)', padding: '16px 24px' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>Anketler</h1>
                            {user ? (
                                <button onClick={() => setShowCreateModal(true)} style={{
                                    padding: '10px 20px', background: 'var(--primary)', color: 'white',
                                    fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                    fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px',
                                }}>
                                    <Plus size={16} /> Yeni Anket
                                </button>
                            ) : (
                                <Link href="/giris" style={{
                                    padding: '10px 20px', background: 'var(--secondary)', color: 'var(--foreground)',
                                    fontWeight: '600', borderRadius: '10px', border: '1px solid var(--card-border)',
                                    textDecoration: 'none', fontSize: '14px',
                                }}>
                                    Giriş Yap
                                </Link>
                            )}
                        </div>

                        {/* Category Pills */}
                        <div className="category-pills" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {categories.map((cat) => (
                                <button key={cat} onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }} style={{
                                    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
                                    whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
                                    background: selectedCategory === cat ? 'var(--primary)' : 'var(--secondary)',
                                    color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                    transition: 'all 0.2s',
                                }}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div className="home-main-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '24px' }}>
                        {/* Sol Sidebar */}
                        <aside className="home-left-sidebar" data-ad-rail-anchor="survey-sidebar">
                            <div>
                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                        <TrendingUp size={16} color="var(--primary)" /> Anket nabzı
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><Users size={15}/></div>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{totalVotes.toLocaleString('tr-TR')} oy</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Topluluk görüşü</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><CheckSquare size={15}/></div>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{activeSurveys.length} aktif anket</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sonuçlar anlık güncellenir</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '18px', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                            <BookOpen size={16} color="var(--primary)" /> Kütüphaneden
                                        </h3>
                                        <Link href="/kutuphane" style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: '700', textDecoration: 'none' }}>Tümü</Link>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {libraryShortcuts.map((item) => (
                                            <Link key={item.href} href={item.href} style={{ display: 'block', padding: '11px 0', borderTop: '1px solid var(--card-border)', textDecoration: 'none' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                                    <span style={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: '700' }}>{item.title}</span>
                                                    <ChevronRight size={14} color="var(--primary)" />
                                                </div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '10px', lineHeight: 1.45, marginTop: '3px' }}>{item.description}</div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '18px', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>Nasıl çalışır?</h3>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.55', margin: 0 }}>Seçeneğinizi işaretleyin; oy verdikten sonra topluluğun güncel dağılımını görün. Giriş yapan üyeler oylarını daha sonra değiştirebilir.</p>
                                </div>

                                <LatestThreadsWidget />

                                <div style={{ marginTop: '16px' }}>
                                    <AdPlaceholder position="anket_sol_ust" fallbackTitle="Anket sayfasında reklam ver" fallbackDesc="Karar aşamasındaki otomobil kullanıcılarına ulaşın." style={{ aspectRatio: '4 / 5' }} />
                                </div>

                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '18px', marginTop: '16px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '6px' }}>Hızlı araçlar</h3>
                                    <p style={{ fontSize: '11px', lineHeight: 1.5, color: 'var(--text-muted)', margin: '0 0 10px' }}>Karar vermeden önce hesaplayın, karşılaştırın veya uzmana danışın.</p>
                                    {[
                                        { title: 'Yakıt maliyetini hesapla', href: '/otohesap/yakit-hesaplama' },
                                        { title: 'Araçları karşılaştır', href: '/karsilastirma' },
                                        { title: 'Uzmana sor', href: '/uzmana-sor' },
                                    ].map(item => (
                                        <Link key={item.href} href={item.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', padding: '10px 0', borderTop: '1px solid var(--card-border)', color: 'var(--foreground)', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                                            {item.title}<ChevronRight size={14} color="var(--primary)" />
                                        </Link>
                                    ))}
                                </div>

                                <div style={{ position: 'sticky', top: '100px', marginTop: '16px' }}>
                                    <AdPlaceholder position="anket_sol_alt" fallbackTitle="OtoSöz topluluğuna ulaşın" fallbackDesc="Markanızı otomobil meraklılarıyla buluşturun." style={{ aspectRatio: '4 / 5' }} />
                                </div>
                            </div>
                        </aside>
                        {/* Orta İçerik */}
                        <div>

                    {/* Vitrin Alanı */}
                    {!loading && featuredSurveys.length > 0 && (
                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '8px', borderRadius: '10px' }}>
                                    <Award size={20} color="#fbbf24" />
                                </div>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>Günün Vitrini</h2>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                                {featuredSurveys.map((survey) => (
                                    <div key={`vitrin-${survey.id}`} style={{
                                        background: 'linear-gradient(145deg, var(--card-bg), rgba(255,255,255,0.02))',
                                        border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px',
                                        position: 'relative', overflow: 'hidden'
                                    }}>
                                        <div style={{ position: 'absolute', top: 0, right: 0, background: '#fbbf24', color: 'black', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderBottomLeftRadius: '12px' }}>ÖNE ÇIKAN</div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px', paddingRight: '60px' }}>{survey.title}</h3>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{survey.description}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{survey.totalVotes.toLocaleString()} oy</span>
                                            <button onClick={() => focusSurvey(survey.id)} style={{ padding: '6px 12px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}>
                                                Oyla
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '10px' }}>
                            <Activity size={20} color="#3b82f6" />
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>Tüm Anketler</h2>
                    </div>

                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Anketler yükleniyor...</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {filteredSurveys.length === 0 ? (
                                <div style={{ padding: '60px', textAlign: 'center', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', color: 'var(--text-muted)' }}>
                                    {selectedCategory === "Tümü" ? "Henüz anket oluşturulmamış. İlk anketi siz oluşturun!" : "Bu kategoride henüz anket bulunmuyor."}
                                </div>
                            ) : (
                                <>
                                {paginatedSurveys.map((survey) => {
                                    const myVote = user ? (survey.voters || {})[user.id as string] : undefined;
                                    const hasVoted = myVote !== undefined;

                                    return (
                                        <div id={`survey-${survey.id}`} key={survey.id} style={{
                                            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                            borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.3s ease',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                                        >
                                            {/* Survey Header */}
                                            <div style={{ padding: '20px', borderBottom: '1px solid var(--card-border)' }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '6px' }}>
                                                            {survey.title}
                                                        </h2>
                                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                                                            {survey.description}
                                                        </p>
                                                    </div>
                                                    <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                            {survey.totalVotes.toLocaleString()} oy
                                                        </span>
                                                        <span style={{ fontSize: '11px', padding: '2px 8px', background: 'var(--secondary)', borderRadius: '4px', color: 'var(--primary)' }}>
                                                            {survey.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Nominees */}
                                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {survey.nominees.map((nominee) => {
                                                    const isSelected = myVote === nominee.id;
                                                    const percentage = survey.totalVotes > 0 ? Math.round((nominee.votes / survey.totalVotes) * 100) : 0;

                                                    return (
                                                        <button
                                                            key={nominee.id}
                                                            onClick={() => handleVote(survey.id, nominee.id)}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                                padding: '14px 16px', borderRadius: '12px',
                                                                border: isSelected ? '2px solid var(--primary)' : '2px solid var(--card-border)',
                                                                cursor: 'pointer',
                                                                background: isSelected ? 'rgba(0, 90, 226, 0.05)' : 'var(--secondary)',
                                                                width: '100%', textAlign: 'left',
                                                                position: 'relative', overflow: 'hidden',
                                                                transition: 'border-color 0.2s ease, background 0.2s',
                                                            }}
                                                        >
                                                            {hasVoted && (
                                                                <div style={{
                                                                    position: 'absolute', left: 0, top: 0, bottom: 0,
                                                                    width: `${percentage}%`,
                                                                    background: isSelected ? 'rgba(0, 90, 226, 0.1)' : 'var(--card-bg)',
                                                                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                    pointerEvents: 'none',
                                                                }} />
                                                            )}

                                                            <div style={{
                                                                width: '22px', height: '22px', borderRadius: '50%',
                                                                border: isSelected ? '6px solid var(--primary)' : '2px solid var(--text-muted)',
                                                                flexShrink: 0, background: 'transparent',
                                                                transition: 'all 0.2s ease', zIndex: 1,
                                                            }} />

                                                            <span style={{
                                                                color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                                                                fontWeight: isSelected ? '700' : '500',
                                                                fontSize: '15px', zIndex: 1,
                                                            }}>
                                                                {nominee.name}
                                                            </span>

                                                            {hasVoted && (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', zIndex: 1 }}>
                                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
                                                                        {nominee.votes.toLocaleString()} oy
                                                                    </span>
                                                                    <span style={{
                                                                        fontSize: '15px', fontWeight: '800',
                                                                        color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                                                                        minWidth: '40px', textAlign: 'right',
                                                                    }}>
                                                                        %{percentage}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Footer */}
                                            {survey.createdBy && (
                                                <div style={{ padding: '0 20px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                                    Oluşturan: @{survey.createdBy}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        marginTop: '16px', padding: '16px 0', borderTop: '1px solid var(--card-border)'
                                    }}>
                                        <button 
                                            onClick={() => setCurrentPage(1)} 
                                            disabled={currentPage === 1}
                                            style={{ padding: '8px 12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--foreground)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                        >
                                            « İlk
                                        </button>
                                        <button 
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                            disabled={currentPage === 1}
                                            style={{ padding: '8px 12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--foreground)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                        >
                                            ‹ Önceki
                                        </button>
                                        
                                        <span style={{ fontSize: '14px', fontWeight: '600', padding: '0 12px', color: 'var(--foreground)' }}>
                                            Sayfa {currentPage} / {totalPages}
                                        </span>

                                        <button 
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                                            disabled={currentPage === totalPages}
                                            style={{ padding: '8px 12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--foreground)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                        >
                                            Sonraki ›
                                        </button>
                                        <button 
                                            onClick={() => setCurrentPage(totalPages)} 
                                            disabled={currentPage === totalPages}
                                            style={{ padding: '8px 12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--foreground)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                        >
                                            Son »
                                        </button>
                                    </div>
                                )}
                                </>
                            )}
                        </div>
                    )}
                        </div>

                        {/* Sağ Sidebar */}
                        <aside className="home-right-sidebar">
                            <div>
                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '18px', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>
                                            <Gauge size={16} color="var(--primary)" /> Araç DNA&apos;dan
                                        </h3>
                                        <Link href="/arac-dna" style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: '700', textDecoration: 'none' }}>Tümü</Link>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {featuredVehicles.map((vehicle) => (
                                            <Link
                                                key={vehicle.id}
                                                href={`/arac-dna/${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`}
                                                style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center', padding: '12px 0', borderTop: '1px solid var(--card-border)', textDecoration: 'none' }}
                                            >
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '700', marginBottom: '3px' }}>{vehicle.brand}</div>
                                                    <div style={{ fontSize: '12px', lineHeight: 1.4, color: 'var(--foreground)', fontWeight: '700' }}>{vehicle.model}</div>
                                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{vehicle.chronicIssues.length} kronik konu · {vehicle.totalReports} rapor</div>
                                                </div>
                                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: vehicle.dnaScore >= 80 ? 'rgba(16,185,129,.12)' : 'rgba(245,158,11,.12)', color: vehicle.dnaScore >= 80 ? '#10b981' : '#f59e0b', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: '800' }}>
                                                    {vehicle.dnaScore}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '18px', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                                        <Activity size={16} color="var(--primary)" />
                                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>Anket özeti</h3>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <div style={{ padding: '12px', background: 'var(--secondary)', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '19px', fontWeight: '800', color: '#3b82f6' }}>{activeSurveys.length}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Aktif anket</div>
                                        </div>
                                        <div style={{ padding: '12px', background: 'var(--secondary)', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '19px', fontWeight: '800', color: '#10b981' }}>{totalVotes.toLocaleString('tr-TR')}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Kullanılan oy</div>
                                        </div>
                                        <div style={{ gridColumn: '1 / -1', padding: '12px', background: 'var(--secondary)', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: '800', color: '#f59e0b' }}>{popularCategory}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>En çok ilgi gören kategori</div>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/kutuphane?kategori=ikinci-el-rehberi" style={{ display: 'block', background: 'linear-gradient(135deg, rgba(0,90,226,.12), rgba(59,130,246,.04))', border: '1px solid rgba(0,90,226,.25)', borderRadius: '16px', padding: '18px', textDecoration: 'none' }}>
                                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(0,90,226,.12)', display: 'grid', placeItems: 'center', marginBottom: '12px' }}><ShieldCheck size={18} color="var(--primary)" /></div>
                                    <div style={{ color: 'var(--primary)', fontSize: '10px', fontWeight: '800', letterSpacing: '.05em', marginBottom: '5px' }}>SATIN ALMA REHBERİ</div>
                                    <div style={{ color: 'var(--foreground)', fontSize: '14px', fontWeight: '800', lineHeight: 1.4 }}>İkinci el araçta doğru kontrol sırası</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.5, marginTop: '6px' }}>İlan, kayıt, ekspertiz ve test sürüşü adımlarını tek listede inceleyin.</div>
                                    <div style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>Rehberi aç <ChevronRight size={13} /></div>
                                </Link>

                                <div style={{ marginTop: '16px' }}>
                                    <AdPlaceholder position="anket_sag_ust" fallbackTitle="Bu alanda markanız yer alsın" fallbackDesc="Otomobil tercihlerini araştıran kullanıcılara ulaşın." style={{ aspectRatio: '1 / 1' }} />
                                </div>

                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '18px', marginTop: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>Çok oy alanlar</h3>
                                        <TrendingUp size={15} color="var(--primary)" />
                                    </div>
                                    {popularSurveys.map((survey, index) => (
                                        <button key={survey.id} onClick={() => focusSurvey(survey.id)} style={{ display: 'grid', gridTemplateColumns: '22px 1fr auto', gap: '8px', alignItems: 'start', width: '100%', padding: '11px 0', border: 0, borderTop: '1px solid var(--card-border)', background: 'transparent', color: 'var(--foreground)', cursor: 'pointer', textAlign: 'left' }}>
                                            <span style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: '800' }}>{String(index + 1).padStart(2, '0')}</span>
                                            <span style={{ fontSize: '12px', lineHeight: 1.45, fontWeight: '700' }}>{survey.title}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '10px', whiteSpace: 'nowrap' }}>{survey.totalVotes.toLocaleString('tr-TR')}</span>
                                        </button>
                                    ))}
                                </div>

                                <div style={{ position: 'sticky', top: '100px', marginTop: '16px' }}>
                                    <AdPlaceholder position="anket_sag_alt" fallbackTitle="Premium reklam alanı" fallbackDesc="Anket sayfasında sürekli görünür olun." style={{ aspectRatio: '1 / 1' }} />
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Create Survey Modal */}
                {showCreateModal && (
                    <CreateSurveyModal
                        onClose={() => setShowCreateModal(false)}
                        onCreate={handleCreateSurvey}
                        categories={categories.filter(c => c !== "Tümü")}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
}

// Create Survey Modal
function CreateSurveyModal({
    onClose,
    onCreate,
    categories,
}: {
    onClose: () => void;
    onCreate: (data: { title: string; description: string; category: string; options: string[] }) => void;
    categories: string[];
}) {
    const [title, setTitle] = useState("Motor Tipi Tercihi: Benzin mi, Dizel mi, Elektrik mi?");
    const [description, setDescription] = useState("Performans, yakıt ekonomisi ve gelecek vizyonu açısından en doğru seçim hangisi?");
    const [category, setCategory] = useState("Genel");
    const [options, setOptions] = useState(["Benzin", "Dizel", "Elektrik"]);

    const addOption = () => {
        if (options.length < 10) setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
    };

    const updateOption = (index: number, value: string) => {
        setOptions(options.map((o, i) => i === index ? value : o));
    };

    const canSubmit = title.trim() && description.trim() && options.filter(o => o.trim()).length >= 2;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        onCreate({
            title: title.trim(),
            description: description.trim(),
            category,
            options: options.filter(o => o.trim()),
        });
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px', borderRadius: '10px',
        background: 'var(--secondary)', border: '1px solid var(--card-border)',
        color: 'var(--foreground)', outline: 'none', fontSize: '14px',
    };



    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px',
        }}>
            <div style={{
                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                borderRadius: '20px', width: '100%', maxWidth: '520px',
                maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid var(--card-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>Yeni Anket Olustur</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                    {/* Title */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Baslik</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Anket basligini girin" style={inputStyle} />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Aciklama</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Kisa bir aciklama" rows={2} style={{ ...inputStyle, resize: 'none' }} />
                    </div>

                    {/* Category */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Kategori</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Options */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            Secenekler (en az 2)
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {options.map((opt, i) => (
                                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input type="text" value={opt} onChange={e => updateOption(i, e.target.value)} placeholder={`Secenek ${i + 1}`} style={{ ...inputStyle, flex: 1 }} />
                                    {options.length > 2 && (
                                        <button type="button" onClick={() => removeOption(i)} style={{
                                            background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px',
                                        }}>
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {options.length < 10 && (
                            <button type="button" onClick={addOption} style={{
                                marginTop: '8px', padding: '8px 16px', borderRadius: '8px',
                                background: 'var(--secondary)', border: '1px solid var(--card-border)',
                                color: 'var(--foreground)', cursor: 'pointer', fontSize: '13px',
                                display: 'flex', alignItems: 'center', gap: '4px',
                            }}>
                                <Plus size={14} /> Secenek Ekle
                            </button>
                        )}
                    </div>

                    {/* Submit */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '12px 24px', borderRadius: '10px', background: 'transparent',
                            border: '1px solid var(--card-border)', color: 'var(--foreground)',
                            cursor: 'pointer', fontWeight: '600',
                        }}>
                            İptal
                        </button>
                        <button type="submit" disabled={!canSubmit} style={{
                            padding: '12px 24px', borderRadius: '10px', background: 'var(--primary)',
                            border: 'none', color: 'white', cursor: 'pointer', fontWeight: '600',
                            opacity: canSubmit ? 1 : 0.5,
                        }}>
                            Anketi Onaya Gönder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
