"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, MessageSquare, TrendingUp, Users, BarChart3, Star, Clock, Eye, ThumbsUp, Award, Crown, Flame, ChevronRight, Zap, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";


import { events } from "@/data/events";
import { sampleListings, formatListingPrice, formatKm } from "@/data/listings";
import { subscribeToThreads, formatTimestamp, getThreadSlugUrl, createThread, getThreadById, type ForumThread as FirestoreThread } from "@/lib/forumService";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Yazar seviye renkleri
const levelColors: Record<string, { bg: string; text: string }> = {
    "Çaylak": { bg: "rgba(100, 100, 100, 0.2)", text: "#888" },
    "Sürücü": { bg: "rgba(59, 130, 246, 0.2)", text: "#3b82f6" },
    "Tutkun": { bg: "rgba(168, 85, 247, 0.2)", text: "#a855f7" },
    "Usta": { bg: "rgba(245, 158, 11, 0.2)", text: "#f59e0b" },
    "Efsane": { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" },
};



// Kategoriler (statik)
const FORUM_CATS = ["Genel", "Teknik", "Deneyim", "Karşılaştırma", "Marka", "Alim-Satim"];
const categories = [
    { name: "Tümü", count: 0, type: "topic" },
    ...FORUM_CATS.map(cat => ({ name: cat, count: 0, type: "topic" })),
    { name: "Anket", count: 0, type: "survey", special: true },
    { name: "Uzmana Sor", count: 3, type: "expert", special: true },
];

export default function Home() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
    const [sortBy, setSortBy] = useState<"popular" | "new">("popular");
    const [showNewTopicModal, setShowNewTopicModal] = useState(false);
    const [newTopicData, setNewTopicData] = useState({ title: "", content: "", category: "", type: "topic" });
    const [searchQuery, setSearchQuery] = useState("");
    const [randomGuide, setRandomGuide] = useState<any>(null);


    const [liveThreads, setLiveThreads] = useState<FirestoreThread[]>([]);
    const [topUsers, setTopUsers] = useState<{username: string; role: string; entryCount?: number}[]>([]);
    const [platformStats, setPlatformStats] = useState({ totalThreads: 0, totalEntries: 0, totalUsers: 0, todayThreads: 0 });
    const [homeSurveys, setHomeSurveys] = useState<any[]>([]);
    const [sidebarAd, setSidebarAd] = useState<any>(null);

    // ── Yakıt Fiyatları Ticker State ──────────────────────────────────────────
    interface FuelPrice { name: string; price: string; trend: string; }
    const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>([
        { name: "V/Max Kurşunsuz 95", price: "...", trend: "stable" },
        { name: "V/Max Diesel",       price: "...", trend: "stable" },
        { name: "Otogaz",              price: "...", trend: "stable" },
        { name: "Gazyağı",            price: "...", trend: "stable" },
        { name: "Kalorifer Yakıtı",   price: "...", trend: "stable" },
        { name: "Fuel Oil",           price: "...", trend: "stable" },
    ]);
    const [tickerCity, setTickerCity] = useState("istanbul");

    // ── Yakıt Fiyatları Fetch ─────────────────────────────────────────────────
    useEffect(() => {
        // Kullanıcının şehrini belirle: (1) user.city, (2) localStorage, (3) İstanbul
        const normalize = (s: string) =>
            s.replace(/İ/g, 'i').replace(/I/g, 'i')
             .toLowerCase()
             .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
             .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
             .replace(/â/g,'a').replace(/î/g,'i').replace(/û/g,'u')
             .replace(/\s+/g,'');

        const localCity = typeof window !== 'undefined' ? localStorage.getItem('oto_user_city') : null;
        const rawCity = user?.city || localCity || 'İstanbul';
        const citySlug = normalize(rawCity);
        setTickerCity(rawCity);

        // Kendi iç Next.js API'mize istek atıyoruz
        fetch(`/api/fiyatlar/${citySlug}`)
            .then(res => res.json())
            .then(data => {
                if (!data.veriler || data.veriler.length === 0) return;
                // İlk ilçenin fiyatlarını kullan (şehir genelini yansıtır)
                const f = data.veriler[0].fiyatlar;
                setFuelPrices([
                    { name: 'V/Max Kurşunsuz 95', price: f.benzin_95  ? `${f.benzin_95.fiyat} TL`  : 'N/A', trend: 'up' },
                    { name: 'V/Max Diesel',       price: f.motorin    ? `${f.motorin.fiyat} TL`    : 'N/A', trend: 'up' },
                    { name: 'Gazyağı',            price: f.gazyagi    ? `${f.gazyagi.fiyat} TL`    : 'N/A', trend: 'stable' },
                    { name: 'Kalorifer Yakıtı',   price: f.kalorifer_yakiti ? `${f.kalorifer_yakiti.fiyat} TL` : 'N/A', trend: 'stable' },
                    { name: 'Fuel Oil',           price: f.fuel_oil   ? `${f.fuel_oil.fiyat} TL`   : 'N/A', trend: 'stable' },
                    { name: 'Otogaz',              price: f.lpg_otogaz ? `${f.lpg_otogaz.fiyat} TL` : 'N/A', trend: 'up' },
                ]);
            })
            .catch(() => {
                // API erişilemez – fallback: boş göster
                console.warn('Yakıt fiyatları API\'ye ulaşılamadı.');
            });
    }, [user]);

    // ── Rehber & İlan ─────────────────────────────────────────────────────────
    useEffect(() => {
        // Random Guide
        fetch('/data/library_guides.json')
            .then(res => res.json())
            .then(data => {
                if (data.guides && data.guides.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.guides.length);
                    setRandomGuide(data.guides[randomIndex]);
                }
            })
            .catch(err => console.error("Error loading guides:", err));

        // Sidebar Reklamı
        fetch('/api/admin?section=advertisements')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.ads) {
                    const activeSidebarAds = data.ads.filter((a: any) => a.position === 'sidebar' && a.status === 'active');
                    if (activeSidebarAds.length > 0) {
                        setSidebarAd(activeSidebarAds[Math.floor(Math.random() * activeSidebarAds.length)]);
                    }
                }
            })
            .catch(err => console.error("Error loading ads:", err));
    }, []);

    // ── Firestore Forum Threads ──────────────────────────────────────────────
    useEffect(() => {
        const unsub = subscribeToThreads((threads) => {
            setLiveThreads(threads);
            // İstatistikleri canlı thread'lerden hesapla
            const totalEntries = threads.reduce((sum, t) => sum + (t.entryCount || 0), 0);
            const now = Date.now();
            const todayStart = now - 24 * 60 * 60 * 1000;
            const todayThreads = threads.filter(t => {
                if (!t.createdAt) return false;
                return t.createdAt.toMillis() > todayStart;
            }).length;
            setPlatformStats(prev => ({ ...prev, totalThreads: threads.length, totalEntries, todayThreads }));
        }, 100);
        return () => unsub();
    }, []);

    // ── Firestore Top Users ──────────────────────────────────────────────────
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = collection(db, 'users');
                const snap = await getDocs(usersRef);
                const allUsers = snap.docs.map(d => ({
                    username: d.data().username || 'anonim',
                    role: d.data().role || 'caylak',
                    entryCount: d.data().entryCount || 0,
                }));
                setPlatformStats(prev => ({ ...prev, totalUsers: allUsers.length }));
                // En aktif yazarlari sirala
                allUsers.sort((a, b) => (b.entryCount || 0) - (a.entryCount || 0));
                setTopUsers(allUsers.slice(0, 5));
            } catch (e) {
                console.error('Top users cekilemedi:', e);
            }
        };
        fetchUsers();
    }, []);

    // Derive allTopics from liveThreads for compatibility
    const allTopics = liveThreads.map(thread => ({
        id: thread.id,
        title: thread.title,
        entryCount: thread.entryCount || 0,
        category: thread.category === "Karsilastirma" ? "Karşılaştırma" : thread.category,
        isHot: thread.views > 50,
        lastActivity: formatTimestamp(thread.createdAt),
        lastAuthor: thread.authorUsername,
        authorLevel: "Surucu",
        lastEntry: "",
        slugUrl: getThreadSlugUrl(thread),
    }));

    const currentCat = categories.find(c => c.name === selectedCategory);
    const isSpecialCategory = currentCat?.special;

    const filteredTopics = selectedCategory === "Tümü"
        ? allTopics
        : allTopics.filter(t => t.category === selectedCategory);

    // Search filter
    const searchFilteredTopics = searchQuery.trim() === ""
        ? filteredTopics
        : filteredTopics.filter(t =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.lastEntry?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const sortedTopics = [...searchFilteredTopics].sort((a, b) => {
        if (sortBy === "popular") return b.entryCount - a.entryCount;
        return 0;
    });


    const renderContent = () => {
        if (currentCat?.type === 'survey') {
            return (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {homeSurveys.map((survey: any) => (
                        <Link key={survey.id} href={`/anket/${survey.id}`}>
                            <div style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '20px',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--foreground)' }}>{survey.title}</h3>
                                    <span style={{ fontSize: '12px', padding: '4px 10px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', borderRadius: '6px', fontWeight: '600' }}>
                                        {survey.status === 'active' ? 'Aktif' : 'Tamamlandı'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                    <span>📊 {survey.totalVotes.toLocaleString()} Oy</span>
                                    <span>📅 Bitiş: {survey.endDate}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            );
        }

        if (currentCat?.type === 'expert') {
            // Uzmana Sor - Firestore'dan gelen thread'ler
            const expertThreads = liveThreads.filter(t => t.category === 'Uzmana Sor');
            if (expertThreads.length === 0) {
                return (
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '60px 24px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>Henuz soru sorulmadi</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>Otomotiv uzmanlarindan profesyonel cevaplar almak icin ilk soruyu siz sorun!</p>
                        <Link href="/uzmana-sor" style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', borderRadius: '10px', fontSize: '14px', fontWeight: '700', textDecoration: 'none', display: 'inline-block' }}>Uzmana Sor Sayfasina Git</Link>
                    </div>
                );
            }
            return (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {expertThreads.slice(0, 5).map((thread) => (
                        <Link key={thread.id} href={`/uzmana-sor/${thread.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 20px var(--primary-glow)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                            {thread.tags.slice(0, 2).map((tag: string) => (
                                                <span key={tag} style={{ fontSize: '12px', padding: '3px 8px', background: 'var(--secondary)', borderRadius: '4px', color: 'var(--text-muted)' }}>{tag}</span>
                                            ))}
                                            {thread.entryCount > 1 && (
                                                <span style={{ fontSize: '12px', padding: '3px 8px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', borderRadius: '4px', fontWeight: '500' }}>✓ Yanitlandi</span>
                                            )}
                                        </div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>{thread.title}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                            <span style={{ color: 'var(--primary)' }}>@{thread.authorUsername}</span>
                                            <span>•</span>
                                            <span>{formatTimestamp(thread.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center', padding: '0 10px' }}>
                                        <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>{thread.entryCount}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Yanit</div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            );
        }

        return (
            <div style={{ display: 'grid', gap: '16px' }}>
                {sortedTopics.map((topic) => (
                    <Link key={topic.id} href={topic.slugUrl}>
                        <div
                            style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '24px',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: '20px',
                            }}
                            className="topic-card"
                        >
                            {/* Topic content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                {/* Category + badges */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        background: 'var(--secondary)',
                                        color: 'var(--text-muted)',
                                        fontSize: '12px',
                                        borderRadius: '6px',
                                        fontWeight: '500',
                                    }}>
                                        {topic.category}
                                    </span>
                                    {topic.isHot && (
                                        <span style={{
                                            padding: '4px 10px',
                                            background: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 90, 226, 0.1)',
                                            color: 'var(--primary)',
                                            fontSize: '12px',
                                            borderRadius: '6px',
                                            fontWeight: '600',
                                        }}>
                                             Gündemde
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h2 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>
                                    {topic.title}
                                </h2>

                                {/* Last entry preview */}
                                {topic.lastEntry && (
                                    <p style={{
                                        color: 'var(--text-muted)',
                                        fontSize: '14px',
                                        marginBottom: '12px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        &quot;{topic.lastEntry}&quot;
                                    </p>
                                )}

                                {/* Footer */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                    <span>💬 {topic.entryCount} Entry</span>
                                    <span>•</span>
                                    <span>{topic.lastActivity}</span>
                                    <span>•</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '10px',
                                            fontWeight: '700',
                                            background: levelColors[topic.authorLevel]?.bg || '#333',
                                            color: levelColors[topic.authorLevel]?.text || '#888',
                                        }}>
                                            {topic.lastAuthor.charAt(0).toUpperCase()}
                                        </span>
                                        <span style={{ color: 'var(--primary)' }}>@{topic.lastAuthor}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Entry count */}
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary)' }}>{topic.entryCount}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Entry</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Sub Header */}
                <div style={{
                    background: 'var(--top-bar-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '16px 24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>Topluluk</h1>
                            </div>

                            {/* Horizontal Fuel Ticker */}
                            <div style={{
                                flex: 1,
                                margin: '0 32px',
                                overflow: 'hidden',
                                background: 'var(--ticker-bg)',
                                border: '1px solid var(--ticker-border)',
                                borderRadius: '8px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative'
                            }}>
                                <style jsx>{`
                                    @keyframes ticker {
                                        0% { transform: translateX(0); }
                                        100% { transform: translateX(-50%); }
                                    }
                                    .ticker-track {
                                        display: flex;
                                        gap: 32px;
                                        padding-left: 16px;
                                        animation: ticker 30s linear infinite;
                                        white-space: nowrap;
                                        width: max-content;
                                    }
                                    .ticker-track:hover {
                                        animation-play-state: paused;
                                    }
                                `}</style>
                                <div className="ticker-track">
                                    {/* Şehir etiketi */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                        <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', fontFamily: 'monospace' }}>
                                            📍 {tickerCity.toUpperCase()}
                                        </span>
                                        <span style={{ width: '1px', height: '14px', background: 'var(--card-border)', display: 'inline-block' }} />
                                    </div>
                                    {/* Fiyat listesi – 2x tekrar seamless scroll için */}
                                    {[...fuelPrices, ...fuelPrices].map((fuel, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{fuel.name}</span>
                                            <span style={{ fontSize: '13px', color: 'var(--foreground)', fontWeight: '700', fontFamily: 'monospace' }}>{fuel.price}</span>
                                            <span style={{
                                                fontSize: '10px',
                                                color: fuel.trend === 'up' ? '#22c55e' : fuel.trend === 'down' ? '#ef4444' : 'var(--text-muted)'
                                            }}>
                                                {fuel.trend === 'up' ? '▲' : fuel.trend === 'down' ? '▼' : '▬'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowNewTopicModal(true)}
                                style={{
                                    padding: '10px 20px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    fontWeight: '600',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                + Yeni Başlık
                            </button>
                        </div>



                        {/* Category Pills */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {categories.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        whiteSpace: 'nowrap',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: selectedCategory === cat.name ? 'var(--primary)' : 'var(--secondary)',
                                        color: selectedCategory === cat.name ? 'white' : 'var(--foreground)',
                                    }}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '24px' }}>
                        {/* Left Sidebar - Kategoriler */}
                        <aside>
                            <div style={{
                                position: 'sticky',
                                top: '100px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '16px',
                            }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    Kategoriler
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {categories.map((cat) => (
                                        <li key={cat.name} style={{ marginBottom: '4px' }}>
                                            <button
                                                onClick={() => setSelectedCategory(cat.name)}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '10px 12px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    background: selectedCategory === cat.name ? 'var(--primary)' : 'transparent',
                                                    color: selectedCategory === cat.name ? 'white' : 'var(--foreground)',
                                                    fontSize: '14px',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <span>{cat.name}</span>
                                                <span style={{ fontSize: '12px', opacity: 0.6 }}>{cat.count}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* Reklam Alanı */}
                            {sidebarAd ? (
                                <a href={sidebarAd.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginTop: '16px' }}>
                                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--primary)', borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                        <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'white', fontSize: '10px', padding: '4px 10px', borderBottomLeftRadius: '12px', fontWeight: 'bold' }}>Sponsorlu</div>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '12px' }}>
                                            <Zap size={20} />
                                        </div>
                                        <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px' }}>{sidebarAd.title}</h4>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>{sidebarAd.description}</p>
                                    </div>
                                </a>
                            ) : (
                                <Link href="/iletisim" style={{ textDecoration: 'none', display: 'block', marginTop: '16px' }}>
                                    <div style={{ 
                                        background: 'var(--secondary)', border: '1px dashed var(--card-border)', borderRadius: '16px', 
                                        height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', padding: '20px', textAlign: 'center'
                                    }}
                                         onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                                         onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                                            <Sparkles size={20} color="currentColor" />
                                        </div>
                                        <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>Buraya Reklam Ver</h3>
                                        <p style={{ fontSize: '12px', lineHeight: '1.5', margin: 0 }}>Günde 10.000+ otomotiv tutkununa markanızı ulaştırın.</p>
                                    </div>
                                </Link>
                            )}

                            {/* Pazar Vitrini */}
                            <div style={{
                                marginTop: '16px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '16px',
                                overflow: 'hidden'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>
                                        Pazar Vitrini
                                    </h3>
                                    <Link href="/pazar" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                                        Tümü
                                    </Link>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {sampleListings.slice(0, 2).map((listing, index) => (
                                        <Link key={listing.id || index} href="/pazar" style={{ textDecoration: 'none' }}>
                                            <div style={{
                                                background: 'var(--secondary)',
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '12px',
                                                padding: '12px',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer'
                                            }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                                            >
                                                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {listing.brand} {listing.model}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{listing.year} • {formatKm(listing.km)}</span>
                                                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#22c55e', whiteSpace: 'nowrap' }}>{formatListingPrice(listing.price)}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Main Content - BAşLIKLAR LİSTESİ */}
                        <div>
                            {/* Sort Bar */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                                padding: '12px 16px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '12px',
                            }}>
                                {/* Search Bar */}
                                <div style={{ position: 'relative', width: '300px' }}>
                                    <input
                                        type="text"
                                        placeholder="Başlık ara..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px 8px 36px',
                                            background: 'var(--background)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '12px',
                                            color: 'var(--foreground)',
                                            fontSize: '13px',
                                            outline: 'none',
                                            transition: 'all 0.2s',
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--card-border)';
                                        }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        left: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '14px',
                                    }}>
                                        
                                    </span>
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            style={{
                                                position: 'absolute',
                                                right: '8px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                padding: '4px',
                                            }}
                                        >
                                            ✤
                                        </button>
                                    )}
                                </div>
                                {/* Removed sort tabs */}
                            </div>

                            {selectedCategory !== "Anket" && homeSurveys.length > 0 && (
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                            <BarChart3 size={16} color="var(--primary)" /> Aktif Anketler
                                        </h3>
                                        <Link href="/anket" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            Tumunu Gor <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                                        {homeSurveys.slice(0, 3).map((survey: any) => (
                                            <Link key={survey.id} href={`/anket/${survey.id}`} style={{ textDecoration: 'none', minWidth: '200px', flex: '1' }}>
                                                <div style={{
                                                    padding: '12px 16px',
                                                    background: 'var(--secondary)',
                                                    borderRadius: '10px',
                                                    border: '1px solid var(--card-border)',
                                                    transition: 'all 0.2s',
                                                    cursor: 'pointer',
                                                }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; }}>
                                                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)', margin: '0 0 6px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {survey.title}
                                                    </h4>
                                                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                                        <span>{(survey.totalVotes || 0).toLocaleString()} oy</span>
                                                        <span style={{ color: '#22c55e', fontWeight: '600' }}>Aktif</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Content List */}
                            {renderContent()}

                            {/* Load More */}
                            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                <button style={{
                                    padding: '14px 36px',
                                    background: 'var(--secondary)',
                                    color: 'var(--foreground)',
                                    fontWeight: '500',
                                    borderRadius: '12px',
                                    border: '1px solid var(--card-border)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                }}>
                                    Daha Fazla Başlık Yükle
                                </button>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <aside>
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {/* Bugün Gündemde */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Flame size={14} color="var(--primary)" /> Bugün Gündemde
                                    </h3>
                                    {liveThreads.length === 0 ? (
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>Henüz gündem yok</p>
                                    ) : (
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {[...liveThreads].sort((a, b) => b.views - a.views).slice(0, 5).map((thread, index) => (
                                                <li key={thread.id}>
                                                    <Link
                                                        href={getThreadSlugUrl(thread)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            gap: '10px',
                                                            padding: '10px 8px',
                                                            borderRadius: '8px',
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>{index + 1}</span>
                                                        <div style={{ flex: 1 }}>
                                                            <span style={{ color: 'var(--foreground)', fontSize: '13px', lineHeight: 1.4, display: 'block' }}>{thread.title}</span>
                                                            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{thread.views} görüntülenme</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Top Yazarlar */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Crown size={14} color="var(--primary)" /> Top Yazarlar
                                    </h3>
                                    {topUsers.length === 0 ? (
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>Henüz yazar yok</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {topUsers.map((u, i) => (
                                                <div key={`${u.username}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '8px', background: 'transparent' }}>
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--secondary)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--foreground)', flexShrink: 0 }}>{i + 1}</div>
                                                    <div style={{ flex: 1 }}>
                                                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>@{u.username}</span>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.role === 'usta' ? 'Usta' : 'Çırak'}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* İstatistikler */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.1), rgba(0, 212, 255, 0.1))',
                                    border: '1px solid var(--primary)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <BarChart3 size={14} /> İstatistikler
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {[
                                            { label: 'Toplam Başlık', value: platformStats.totalThreads.toLocaleString() },
                                            { label: 'Toplam Entry', value: platformStats.totalEntries.toLocaleString() },
                                            { label: 'Kayıtlı Üye', value: platformStats.totalUsers.toLocaleString() },
                                            { label: 'Bugün Açılan', value: `+${platformStats.todayThreads}`, color: 'var(--success)' },
                                        ].map((stat) => (
                                            <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                                                <span style={{ color: stat.color || 'var(--foreground)', fontWeight: '600' }}>{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Random Guide Card - UPDATED BLACK */}
                                {randomGuide && (
                                    <div style={{
                                        marginTop: '16px',
                                        background: 'var(--card-bg)',
                                        borderRadius: '16px',
                                        padding: '20px',
                                        color: 'var(--foreground)',
                                        boxShadow: 'var(--card-shadow)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        border: '1px solid var(--card-border)'
                                    }}>
                                        {/* Background Decor */}
                                        <div style={{
                                            position: 'absolute',
                                            top: -20,
                                            right: -20,
                                            opacity: 0.05,
                                            transform: 'rotate(15deg)'
                                        }}>
                                            <BookOpen size={120} color="var(--text-muted)" />
                                        </div>

                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                opacity: 0.7
                                            }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    background: 'var(--secondary)',
                                                    borderRadius: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    border: '1px solid var(--card-border)'
                                                }}>
                                                    <BookOpen size={12} />
                                                    Rastgele Bilgi
                                                </span>
                                            </div>

                                            <h3 style={{
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                marginBottom: '8px',
                                                lineHeight: '1.4',
                                                color: 'var(--foreground)'
                                            }}>
                                                {randomGuide.title}
                                            </h3>

                                            <p style={{
                                                fontSize: '13px',
                                                opacity: 0.6,
                                                marginBottom: '16px',
                                                lineHeight: '1.5',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                color: 'var(--text-muted)'
                                            }}>
                                                {randomGuide.description}
                                            </p>

                                            <Link href={`/kutuphane/${randomGuide.id}`} style={{ textDecoration: 'none' }}>
                                                <button style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    background: 'var(--secondary)',
                                                    color: 'var(--foreground)',
                                                    border: '1px solid var(--card-border)',
                                                    borderRadius: '12px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s'
                                                }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'var(--hover-primary)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'var(--secondary)';
                                                    }}
                                                >
                                                    <span>Okumaya Başla</span>
                                                    <ArrowRight size={16} />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </main >

            {/* ===== İSTATİSTİKLER ===== */}
            <section style={{

                padding: '60px 24px',
                background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.015)',
                borderTop: '1px solid var(--card-border)',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                        <h2 className="forum-section-title" style={{ justifyContent: 'center' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.06)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#22c55e',
                            }}>
                                <BarChart3 size={20} />
                            </div>
                            Forum İstatistikleri
                        </h2>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '8px' }}>
                            Topluluğumuzun gücünü rakamlarla keşfedin
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {[
                            {
                                label: 'Toplam Üye',
                                value: platformStats.totalUsers.toLocaleString('tr-TR'),
                                icon: <Users size={22} />,
                                change: 'Kayitli uye',
                                color: isDark ? '#ff6b00' : '#005ae2',
                                bg: isDark ? 'rgba(255,107,0,0.06)' : 'rgba(0,90,226,0.04)',
                            },
                            {
                                label: 'Forum Konusu',
                                value: liveThreads.length.toLocaleString('tr-TR'),
                                suffix: '+',
                                icon: <MessageSquare size={22} />,
                                change: 'Bu hafta',
                                color: '#3b82f6',
                                bg: 'rgba(59,130,246,0.06)',
                            },
                            {
                                label: 'Toplam Entry',
                                value: liveThreads.reduce((sum, t) => sum + (t.entryCount || 0), 0).toLocaleString('tr-TR'),
                                suffix: '+',
                                icon: <MessageSquare size={22} />,
                                change: '+127 bu hafta',
                                color: '#22c55e',
                                bg: 'rgba(34,197,94,0.06)',
                            },
                            {
                                label: 'Sayfa Goruntuleme',
                                value: liveThreads.reduce((sum, t) => sum + (t.views || 0), 0).toLocaleString('tr-TR'),
                                icon: <Eye size={22} />,
                                change: 'Toplam',
                                color: '#a855f7',
                                bg: 'rgba(168,85,247,0.06)',
                            },
                        ].map((stat, i) => (
                            <div key={i} className="stat-card">
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '14px',
                                    background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: stat.color, margin: '0 auto 16px',
                                }}>
                                    {stat.icon}
                                </div>
                                <div style={{
                                    fontSize: '32px', fontWeight: '900', color: 'var(--foreground)',
                                    lineHeight: 1, marginBottom: '6px', letterSpacing: '-1px',
                                }}>
                                    {stat.value}{stat.suffix || ''}
                                </div>
                                <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>
                                    {stat.label}
                                </div>
                                <div style={{
                                    fontSize: '12px', fontWeight: '700', color: stat.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                }}>
                                    <TrendingUp size={12} /> {stat.change}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Online Users Bar */}
                    <div style={{
                        marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '20px', padding: '18px 28px', borderRadius: '14px',
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e',
                                boxShadow: '0 0 8px rgba(34,197,94,0.5)',
                                animation: 'pulse-glow 2s infinite',
                            }} />
                            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>{platformStats.totalUsers}</span>
                            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>kayitli uye</span>
                        </div>
                        <span style={{ width: '1px', height: '20px', background: 'var(--card-border)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={14} style={{ color: '#f59e0b' }} />
                            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                Toplam <strong style={{ color: 'var(--foreground)' }}>{platformStats.totalEntries}</strong> entry
                            </span>
                        </div>
                        {topUsers.length > 0 && (
                            <>
                                <span style={{ width: '1px', height: '20px', background: 'var(--card-border)' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Star size={14} style={{ color: 'var(--primary)' }} />
                                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                        En aktif: <strong style={{ color: 'var(--foreground)' }}>@{topUsers[0].username}</strong>
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* ===== 5. CTA BANNER ===== */}
            <section style={{
                padding: '80px 24px',
                background: isDark
                    ? 'linear-gradient(135deg, rgba(255,107,0,0.04), rgba(0,212,255,0.02))'
                    : 'linear-gradient(135deg, rgba(0,90,226,0.03), rgba(34,197,94,0.02))',
                borderTop: '1px solid var(--card-border)',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px', color: 'white',
                        boxShadow: '0 8px 25px var(--primary-glow)',
                    }}>
                        <MessageSquare size={24} />
                    </div>
                    <h2 style={{
                        fontSize: '32px', fontWeight: '900', color: 'var(--foreground)',
                        marginBottom: '12px', letterSpacing: '-0.5px',
                    }}>
                        Tartışmaya Katılın
                    </h2>
                    <p style={{
                        fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px',
                    }}>
                        12.000'den fazla otomobil tutkununun bulunduğu topluluğumuza katılın,
                        deneyimlerinizi paylaşın ve uzman görüşlerinden yararlanın.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <Link href="/kayit" style={{
                            padding: '14px 32px', borderRadius: '12px',
                            background: 'var(--primary)', color: 'white',
                            fontWeight: '700', fontSize: '15px', textDecoration: 'none',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'all 0.3s',
                            boxShadow: '0 4px 15px var(--primary-glow)',
                        }}>
                            Ücretsiz Kayıt Ol <ArrowRight size={16} />
                        </Link>
                        <Link href="/forum" style={{
                            padding: '14px 32px', borderRadius: '12px',
                            background: 'var(--card-bg)', color: 'var(--foreground)',
                            fontWeight: '700', fontSize: '15px', textDecoration: 'none',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            border: '1px solid var(--card-border)',
                            transition: 'all 0.3s',
                        }}>
                            Forumu Keşfet
                        </Link>
                    </div>
                </div>
            </section>

            {/* Yeni Başlık Modal */}
            {
                showNewTopicModal && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'var(--overlay-bg)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '16px',
                        }}
                        onClick={() => setShowNewTopicModal(false)}
                    >
                        <div
                            style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '20px',
                                padding: '28px',
                                width: '100%',
                                maxWidth: '550px',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '24px' }}>
                                Yeni İçerik Oluştur
                            </h2>

                            {/* Tür Seçimi */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '10px' }}>
                                    İçerik Türü
                                </label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {[
                                        { id: 'topic', label: '📄 Başlık', desc: 'Forum başlığı' },
                                        { id: 'survey', label: '📊 Anket', desc: 'Oylama' },
                                        { id: 'expert', label: '💡 Soru', desc: 'Uzmana Sor' },
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => {
                                                const isSurvey = type.id === 'survey';
                                                setNewTopicData({
                                                    ...newTopicData,
                                                    type: type.id,
                                                    category: isSurvey ? 'Anket' : ''
                                                });
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: '14px 12px',
                                                background: newTopicData.type === type.id ? 'var(--primary)' : 'var(--secondary)',
                                                border: newTopicData.type === type.id ? '2px solid var(--primary)' : '1px solid var(--card-border)',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <div style={{ fontSize: '18px', marginBottom: '4px' }}>{type.label.split(' ')[0]}</div>
                                            <div style={{ fontSize: '12px', fontWeight: '600', color: newTopicData.type === type.id ? 'white' : 'var(--foreground)' }}>
                                                {type.label.split(' ')[1]}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Kategori */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Kategori <span style={{ color: '#ff4444' }}>*</span>
                                </label>
                                {newTopicData.type === 'survey' ? (
                                    <input
                                        type="text"
                                        value="Anket"
                                        disabled
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'var(--secondary)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '10px',
                                            color: 'var(--text-muted)',
                                            fontSize: '14px',
                                            outline: 'none',
                                        }}
                                    />
                                ) : (
                                    <select
                                        value={newTopicData.category}
                                        onChange={(e) => setNewTopicData({ ...newTopicData, category: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'var(--secondary)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '10px',
                                            color: 'var(--foreground)',
                                            fontSize: '14px',
                                            outline: 'none',
                                        }}
                                    >
                                        <option value="" disabled>Kategori Seçiniz</option>
                                        {categories.filter(c => !c.special).map((cat) => (
                                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Başlık */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Başlık <span style={{ color: '#ff4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newTopicData.title}
                                    onChange={(e) => setNewTopicData({ ...newTopicData, title: e.target.value })}
                                    placeholder="Başlığınızı yazın..."
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '10px',
                                        color: 'var(--foreground)',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            {/* İçerik */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    İçerik
                                </label>
                                <textarea
                                    value={newTopicData.content}
                                    onChange={(e) => setNewTopicData({ ...newTopicData, content: e.target.value })}
                                    placeholder={
                                        newTopicData.type === 'survey' ? "Anket açıklaması..." :
                                            newTopicData.type === 'expert' ? "Sorununuzu detaylı açıklayın..." :
                                                "İlk entry'nizi yazın..."
                                    }
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '10px',
                                        color: 'var(--foreground)',
                                        fontSize: '14px',
                                        outline: 'none',
                                        resize: 'none',
                                    }}
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setShowNewTopicModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '10px',
                                        color: 'var(--foreground)',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={async () => {
                                        if (newTopicData.type === 'survey') {
                                            const newSurvey = {
                                                id: Date.now().toString(),
                                                title: newTopicData.title,
                                                description: newTopicData.content,
                                                // Schema fields
                                                image: "default_survey.jpg",
                                                color: "from-blue-600 to-blue-400",
                                                icon: "help-circle",
                                                nominees: [
                                                    { id: 1, name: "Evet", votes: 0, color: "#10b981" },
                                                    { id: 2, name: "Hayır", votes: 0, color: "#ef4444" }
                                                ],
                                                // UI fields
                                                status: 'active',
                                                totalVotes: 0,
                                                endDate: '7 gün kaldı'
                                            };
                                            setHomeSurveys([newSurvey, ...homeSurveys]);
                                            setSelectedCategory("Anket");
                                            alert(`Anket başarıyla oluşturuldu!`);
                                            setShowNewTopicModal(false);
                                            setNewTopicData({ title: "", content: "", category: "", type: "topic" });
                                        } else {
                                            if (!user) {
                                                alert("İçerik oluşturmak için giriş yapmalısınız.");
                                                return;
                                            }
                                            try {
                                                const threadId = await createThread({
                                                    title: newTopicData.title.trim(),
                                                    category: newTopicData.category,
                                                    content: newTopicData.content.trim(),
                                                    tags: [],
                                                    authorId: user.id as string,
                                                    authorUsername: user.username,
                                                });
                                                
                                                setShowNewTopicModal(false);
                                                setNewTopicData({ title: "", content: "", category: "", type: "topic" });
                                                
                                                const newThread = await getThreadById(threadId);
                                                if (newThread) {
                                                    window.location.href = getThreadSlugUrl(newThread);
                                                } else {
                                                    window.location.href = `/forum/${threadId}`;
                                                }
                                            } catch (e: any) {
                                                alert("Hata: " + e.message);
                                            }
                                        }
                                    }}
                                    disabled={!newTopicData.title.trim() || !newTopicData.category}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: (!newTopicData.title.trim() || !newTopicData.category) ? 'var(--secondary)' : 'var(--primary)',
                                        border: 'none',
                                        borderRadius: '10px',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: (!newTopicData.title.trim() || !newTopicData.category) ? 'not-allowed' : 'pointer',
                                        opacity: (!newTopicData.title.trim() || !newTopicData.category) ? 0.5 : 1,
                                        fontSize: '14px',
                                    }}
                                >
                                    Paylaş
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <Footer />
        </div >
    );
}
