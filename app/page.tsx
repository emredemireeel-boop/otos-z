"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, MessageSquare, TrendingUp, Users, BarChart3, Star, Clock, Eye, ThumbsUp, Award, Crown, Flame, ChevronRight, Zap, Sparkles, Plus, Car, AlertTriangle, CheckCircle, MapPin, Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import AdPlaceholder from "@/components/AdPlaceholder";
import { events } from "@/data/events";
import { sampleListings, formatListingPrice, formatKm } from "@/data/listings";
import { subscribeToThreads, formatTimestamp, getThreadSlugUrl, createThread, getThreadById, type ForumThread as FirestoreThread } from "@/lib/forumService";
import { collection, getDocs, query, orderBy, limit, getCountFromServer, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import carModelsData from "@/data/carmodels.json";
import { mythsData, Myth } from "@/data/efsane-avcilari-data";
import LatestThreadsWidget from "@/components/LatestThreadsWidget";
import MarkdownEditor from "@/components/MarkdownEditor";

// Yazar seviye renkleri
const levelColors: Record<string, { bg: string; text: string }> = {
    "Çaylak": { bg: "rgba(100, 100, 100, 0.2)", text: "#888" },
    "Sürücü": { bg: "rgba(59, 130, 246, 0.2)", text: "#3b82f6" },
    "Tutkun": { bg: "rgba(168, 85, 247, 0.2)", text: "#a855f7" },
    "Usta": { bg: "rgba(245, 158, 11, 0.2)", text: "#f59e0b" },
    "Efsane": { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" },
};
// Kategoriler (statik) — otomotiv topluluğu için kapsamlı set
const FORUM_CATS = [
    "Genel",
    "Teknik & Arıza",
    "Bakım & Tamir",
    "Modifiye & Aksesuar",
    "Elektrikli & Hibrit",
    "Lastik & Jant",
    "Sigorta & Hukuk",
    "Alım-Satım",
    "Deneyim & İnceleme",
    "Marka & Model",
];

// Kategori açıklamaları (tooltip için)
const CATEGORY_META: Record<string, { desc: string }> = {
    "Tümü": { desc: "Tüm başlıklar" },
    "Genel": { desc: "Genel sohbet, gündem ve sorular" },
    "Teknik & Arıza": { desc: "Arıza kodları, motor, şanzıman sorunları" },
    "Bakım & Tamir": { desc: "Periyodik bakım, yağ, servis önerileri" },
    "Modifiye & Aksesuar": { desc: "Donanım, görsel ve performans modifiyeleri" },
    "Elektrikli & Hibrit": { desc: "EV, hibrit, şarj ve menzil" },
    "Lastik & Jant": { desc: "Lastik seçimi, ebat, jant ve balans" },
    "Sigorta & Hukuk": { desc: "Kasko, trafik sigortası, kaza ve mevzuat" },
    "Alım-Satım": { desc: "İkinci el, fiyat ve ekspertiz" },
    "Deneyim & İnceleme": { desc: "Kullanıcı deneyimleri ve araç incelemeleri" },
    "Marka & Model": { desc: "Marka ve model tartışmaları" },
    "Anket": { desc: "Topluluk anketleri" },
    "Uzmana Sor": { desc: "Uzmana danış" },
};

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
    const [sortBy, setSortBy] = useState<"popular" | "new">("new");
    const [showNewTopicModal, setShowNewTopicModal] = useState(false);
    const [newTopicData, setNewTopicData] = useState({ title: "", content: "", category: "", type: "topic", carBrand: "", carModel: "", carYear: "", carKm: "" });
    const [newSurveyOptions, setNewSurveyOptions] = useState(["Evet", "Hayır"]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;
    const [randomGuide, setRandomGuide] = useState<any>(null);
    const [randomMyth, setRandomMyth] = useState<Myth | null>(null);

    const availableBrands = Object.keys(carModelsData).sort();
    const availableModels = newTopicData.carBrand && (carModelsData as Record<string, string[]>)[newTopicData.carBrand] 
        ? (carModelsData as Record<string, string[]>)[newTopicData.carBrand].sort() 
        : [];


    const [liveThreads, setLiveThreads] = useState<FirestoreThread[]>([]);
    const [loadingThreads, setLoadingThreads] = useState(true);
    const [topUsers, setTopUsers] = useState<{username: string; role: string; entryCount?: number}[]>([]);
    const [platformStats, setPlatformStats] = useState({ totalThreads: 0, totalEntries: 0, totalUsers: 0, todayThreads: 0 });
    const [homeSurveys, setHomeSurveys] = useState<any[]>([]);
    const [sidebarAd, setSidebarAd] = useState<any>(null);
    const [globalUserMap, setGlobalUserMap] = useState<Record<string, { photoURL: string | null }>>({});

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
    const [tickerCity, setTickerCity] = useState("İstanbul");

    // ── Yakıt Fiyatları Fetch ─────────────────────────────────────────────────
    // Türkçe şehir adını API slug'ına çeviren normalize fonksiyonu
    const normalizeCitySlug = (s: string) =>
        s.replace(/İ/g, 'i').replace(/I/g, 'i')
         .toLowerCase()
         .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
         .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
         .replace(/â/g,'a').replace(/î/g,'i').replace(/û/g,'u')
         .replace(/\s+/g,'');

    useEffect(() => {
        // Kullanıcının şehrini belirle:
        // (1) Giriş yapmış kullanıcının Firestore'daki city bilgisi (birincil kaynak)
        // (2) localStorage'daki son bilinen şehir (oturumlar arası cache)
        // (3) Varsayılan: İstanbul

        // Kullanıcı giriş yapmışsa ama city henüz yüklenmediyse, bekle
        // (user objesi var ama city undefined → Firestore'dan henüz gelmemiş olabilir)

        const localCity = typeof window !== 'undefined' ? localStorage.getItem('oto_user_city') : null;
        const rawCity = user?.city || localCity || 'İstanbul';
        const citySlug = normalizeCitySlug(rawCity);
        setTickerCity(rawCity);

        // Kullanıcının şehrini localStorage'a kaydet (sonraki ziyaretlerde hızlı erişim)
        if (user?.city && typeof window !== 'undefined') {
            localStorage.setItem('oto_user_city', user.city);
        }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.city]);

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

        // Random Myth
        if (mythsData && mythsData.length > 0) {
            const randomMythIndex = Math.floor(Math.random() * mythsData.length);
            setRandomMyth(mythsData[randomMythIndex]);
        }
    }, []);

    // ── Global New Topic Modal Listener ──────────────────────────────────────
    useEffect(() => {
        const handleOpenModal = () => setShowNewTopicModal(true);
        window.addEventListener('open_new_topic_modal', handleOpenModal);

        const params = new URLSearchParams(window.location.search);
        const initialSearch = params.get('q');
        if (initialSearch) setSearchQuery(initialSearch);
        if (params.get('yeni') === '1') setShowNewTopicModal(true);

        return () => window.removeEventListener('open_new_topic_modal', handleOpenModal);
    }, []);

    // ── Firestore Forum Threads ──────────────────────────────────────────────
    useEffect(() => {
        const unsub = subscribeToThreads((threads) => {
            setLiveThreads(threads);
            setLoadingThreads(false);
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

    // ── Firestore Top Users & Stats ──────────────────────────────────────────
    useEffect(() => {
        const fetchTopUsersAndStats = async () => {
            try {
                const usersRef = collection(db, 'users');
                // Toplam kullanici sayisini sunucudan say
                const countSnap = await getCountFromServer(usersRef);
                setPlatformStats(prev => ({ ...prev, totalUsers: countSnap.data().count }));

                // Sadece Top 5 kullaniciyi getir
                const topUsersQuery = query(usersRef, orderBy('entryCount', 'desc'), limit(5));
                const topUsersSnap = await getDocs(topUsersQuery);
                const top5 = topUsersSnap.docs.map(d => {
                    const data = d.data();
                    return {
                        username: data.username || 'anonim',
                        role: data.role || 'caylak',
                        entryCount: data.entryCount || 0,
                    };
                });
                setTopUsers(top5);
            } catch (e) {
                console.error('Top users veya stats cekilemedi:', e);
            }
        };
        fetchTopUsersAndStats();
    }, []);

    // ── Lazy load avatars for threads ──────────────────────────────────────────
    useEffect(() => {
        if (liveThreads.length === 0) return;
        
        setGlobalUserMap(prev => {
            const usernamesToFetch = new Set<string>();
            liveThreads.forEach(t => {
                if (t.authorUsername && prev[t.authorUsername] === undefined) {
                    usernamesToFetch.add(t.authorUsername);
                }
            });
            
            const missing = Array.from(usernamesToFetch);
            if (missing.length === 0) return prev;
            
            const next = { ...prev };
            // Hemen null olarak isaretle ki tekrar fetch yapmaya calismasin
            missing.forEach(u => next[u] = { photoURL: null });
            
            const doFetch = async () => {
                const chunks = [];
                for (let i = 0; i < missing.length; i += 10) {
                    chunks.push(missing.slice(i, i + 10));
                }
                
                let hasUpdates = false;
                const fetchedMap: Record<string, { photoURL: string | null }> = {};
                
                for (const chunk of chunks) {
                    try {
                        const q = query(collection(db, 'users'), where('username', 'in', chunk));
                        const snap = await getDocs(q);
                        snap.docs.forEach(d => {
                            const data = d.data();
                            if (data.username && data.photoURL) {
                                fetchedMap[data.username] = { photoURL: data.photoURL };
                                hasUpdates = true;
                            }
                        });
                    } catch (e) {
                        console.error('Avatar chunk error:', e);
                    }
                }
                
                if (hasUpdates) {
                    setGlobalUserMap(current => ({ ...current, ...fetchedMap }));
                }
            };
            doFetch();
            
            return next;
        });
    }, [liveThreads]);

    // Derive allTopics from liveThreads for compatibility
    const allTopics = liveThreads.map(thread => ({
        id: thread.id,
        title: thread.title,
        entryCount: thread.entryCount || 0,
        category: thread.category === "Karsilastirma" ? "Karşılaştırma" : thread.category,
        isHot: thread.views > 50,
        lastActivity: formatTimestamp(thread.lastEntryAt || thread.createdAt),
        rawActivityAt: thread.lastEntryAt || thread.createdAt,
        lastAuthor: thread.authorUsername,
        authorLevel: "Surucu",
        lastEntry: "",
        slugUrl: getThreadSlugUrl(thread),
    }));

    const dynamicCategories = [
        { name: "Tümü", count: liveThreads.length, type: "topic" },
        ...FORUM_CATS.map(cat => ({ 
            name: cat, 
            count: liveThreads.filter(t => t.category === cat).length, 
            type: "topic" 
        })),
        { name: "Anket", count: homeSurveys.length || 0, type: "survey", special: true },
        { name: "Uzmana Sor", count: liveThreads.filter(t => t.category === "Uzmana Sor").length, type: "expert", special: true },
    ];

    const currentCat = dynamicCategories.find(c => c.name === selectedCategory);
    const isSpecialCategory = currentCat?.special;

    const filteredTopics = selectedCategory === "Tümü"
        ? allTopics
        : allTopics.filter(t => t.category === selectedCategory);

    // Search filter
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase('tr-TR');
    const searchFilteredTopics = normalizedSearch === ""
        ? filteredTopics
        : filteredTopics.filter(t =>
            t.title.toLocaleLowerCase('tr-TR').includes(normalizedSearch) ||
            t.category.toLocaleLowerCase('tr-TR').includes(normalizedSearch) ||
            t.lastAuthor.toLocaleLowerCase('tr-TR').includes(normalizedSearch) ||
            t.lastEntry?.toLocaleLowerCase('tr-TR').includes(normalizedSearch)
        );

    const sortedTopics = [...searchFilteredTopics].sort((a, b) => {
        if (sortBy === "popular") return b.entryCount - a.entryCount;
        // Varsayılan: En yeni (en güncel) olan en başta
        const timeA = a.rawActivityAt?.toMillis ? a.rawActivityAt.toMillis() : 0;
        const timeB = b.rawActivityAt?.toMillis ? b.rawActivityAt.toMillis() : 0;
        return timeB - timeA;
    });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(sortedTopics.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedTopics = sortedTopics.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    // Reset page on filter change
    useEffect(() => { setCurrentPage(1); }, [selectedCategory, searchQuery, sortBy]);


    const renderContent = () => {
        if (currentCat?.type === 'survey') {
            return (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {homeSurveys.map((survey: any) => (
                        <Link key={survey.id} href={`/anket/${survey.id}`}>
                            <div className="survey-card">
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
                    <div className="expert-empty-state">
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--text-muted)' }}><MessageSquare size={44} /></div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>Henüz soru sorulmadı</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>Otomotiv uzmanlarından profesyonel cevaplar almak için ilk soruyu siz sorun!</p>
                        <Link href="/uzmana-sor" style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', borderRadius: '10px', fontSize: '14px', fontWeight: '700', textDecoration: 'none', display: 'inline-block' }}>Uzmana Sor Sayfasına Git</Link>
                    </div>
                );
            }
            return (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {expertThreads.slice(0, 5).map((thread) => (
                        <Link key={thread.id} href={`/uzmana-sor/${thread.id}`} style={{ textDecoration: 'none' }}>
                            <div className="expert-card">
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
                {loadingThreads ? (
                    [...Array(10)].map((_, i) => (
                        <div key={i} className="topic-card" style={{ display: 'flex', gap: '16px', opacity: 0.7 }}>
                            <div style={{ flex: 1 }}>
                                <div className="skeleton-pulse" style={{ width: '80px', height: '24px', borderRadius: '6px', marginBottom: '12px' }} />
                                <div className="skeleton-pulse" style={{ width: '80%', height: '20px', borderRadius: '4px', marginBottom: '8px' }} />
                                <div className="skeleton-pulse" style={{ width: '100%', height: '16px', borderRadius: '4px', marginBottom: '12px' }} />
                                <div className="skeleton-pulse" style={{ width: '40%', height: '16px', borderRadius: '4px' }} />
                            </div>
                            <div style={{ width: '60px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <div className="skeleton-pulse" style={{ width: '40px', height: '32px', borderRadius: '4px', marginBottom: '4px' }} />
                                <div className="skeleton-pulse" style={{ width: '30px', height: '12px', borderRadius: '4px' }} />
                            </div>
                        </div>
                    ))
                ) : paginatedTopics.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        <MessageSquare size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <p>{searchQuery ? `“${searchQuery}” için sonuç bulunamadı.` : 'Bu kategoride henüz başlık bulunmuyor.'}</p>
                        {searchQuery && (
                            <button className="forum-empty-reset" onClick={() => setSearchQuery('')}>Aramayı temizle</button>
                        )}
                    </div>
                ) : (
                    paginatedTopics.map((topic) => (
                        <Link key={topic.id} href={topic.slugUrl} className="topic-link" aria-label={`${topic.title} konusunu aç`}>
                        <article className="topic-card">
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
                                <h2 className="topic-card-title" style={{ fontSize: '17px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                                    <span style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><MessageSquare size={13} /> {topic.entryCount} yanıt</span>
                                    <span style={{ opacity: 0.5 }}>•</span>
                                    <span style={{ whiteSpace: 'nowrap' }}>{topic.lastActivity}</span>
                                    <span style={{ opacity: 0.5 }}>•</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
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
                                            backgroundImage: globalUserMap[topic.lastAuthor]?.photoURL ? `url(${globalUserMap[topic.lastAuthor].photoURL})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            color: levelColors[topic.authorLevel]?.text || '#888',
                                            overflow: 'hidden'
                                        }}>
                                            {!globalUserMap[topic.lastAuthor]?.photoURL && topic.lastAuthor.charAt(0).toUpperCase()}
                                        </span>
                                        <span style={{ color: 'var(--primary)' }}>@{topic.lastAuthor}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Entry count */}
                            <div className="topic-entry-count" style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary)' }}>{topic.entryCount}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>yanıt</div>
                            </div>
                        </article>
                    </Link>
                )))}
            </div>
        );
    };
    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Gündemdeki Başlıklar',
        'itemListElement': sortedTopics.slice(0, 10).map((topic, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'url': `https://otosoz.com${topic.slugUrl}`
        }))
    };

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* ─── Hero (sadece giriş yapmamış ziyaretçiler) ─── */}
                {!user && (
                    <section className="home-hero">
                        <div className="home-hero-inner">
                            <div className="home-hero-badge">
                                <Sparkles size={14} /> Türkiye'nin otomobil topluluğu
                            </div>
                            <h1 className="home-hero-title">
                                Aracını tanı, doğru kararı ver.
                            </h1>
                            <p className="home-hero-subtitle">
                                Binlerce sürücünün deneyimi, uzman görüşleri ve gerçek veriler tek çatı altında.
                                Arıza kodlarından araç DNA'sına, fiyat analizinden topluluk tartışmalarına kadar her şey OtoSöz'de.
                            </p>
                            <div className="home-hero-actions">
                                <Link href="/kayit" style={{ textDecoration: 'none' }}>
                                    <button className="home-hero-btn-primary">
                                        Ücretsiz Katıl <ArrowRight size={17} />
                                    </button>
                                </Link>
                                <Link href="/forum" style={{ textDecoration: 'none' }}>
                                    <button className="home-hero-btn-ghost">
                                        Forumu Keşfet
                                    </button>
                                </Link>
                            </div>
                            <div className="home-hero-stats">
                                {[
                                    { icon: MessageSquare, value: platformStats.totalThreads, label: 'Başlık' },
                                    { icon: BarChart3, value: platformStats.totalEntries, label: 'Entry' },
                                    { icon: Users, value: platformStats.totalUsers, label: 'Üye' },
                                ].map((s, i) => {
                                    const Icon = s.icon;
                                    return (
                                        <div key={i} className="home-hero-stat">
                                            <Icon size={18} className="home-hero-stat-icon" />
                                            <div>
                                                <div className="home-hero-stat-val">{s.value > 0 ? s.value.toLocaleString('tr-TR') : '—'}</div>
                                                <div className="home-hero-stat-label">{s.label}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* Sub Header */}
                <div style={{
                    background: 'var(--top-bar-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '16px 24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div className="subheader-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>Topluluk</h2>
                            </div>

                            {/* Fuel Widget */}
                            <div className="fuel-ticker-wrapper glass" style={{
                                flex: 1,
                                margin: '0 32px',
                                overflow: 'hidden',
                                borderRadius: '12px',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}>
                                <style jsx>{`
                                    @keyframes ticker {
                                        0% { transform: translateX(0); }
                                        100% { transform: translateX(-50%); }
                                    }
                                    @keyframes bounce-sm {
                                        0%, 100% { transform: translateY(0); }
                                        50% { transform: translateY(-2px); }
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
                                    .trend-up {
                                        color: var(--success);
                                        animation: bounce-sm 2s infinite;
                                        display: inline-block;
                                    }
                                    .trend-down {
                                        color: var(--danger);
                                        animation: bounce-sm 2s infinite;
                                        animation-direction: reverse;
                                        display: inline-block;
                                    }
                                `}</style>
                                <div className="ticker-track">
                                    {/* Şehir etiketi */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                        <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', fontFamily: 'monospace', padding: '4px 8px', background: 'var(--hover-primary)', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <MapPin size={11} /> {tickerCity.toUpperCase()}
                                        </span>
                                        <span style={{ width: '1px', height: '18px', background: 'var(--card-border)', display: 'inline-block', margin: '0 8px' }} />
                                    </div>
                                    {/* Fiyat listesi – 2x tekrar seamless scroll için */}
                                    {[...fuelPrices, ...fuelPrices].map((fuel, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{fuel.name}</span>
                                            <span style={{ fontSize: '13px', color: 'var(--foreground)', fontWeight: '700', fontFamily: 'monospace' }}>{fuel.price}</span>
                                            <span className={fuel.trend === 'up' ? 'trend-up' : fuel.trend === 'down' ? 'trend-down' : ''} style={{
                                                fontSize: '11px',
                                                color: fuel.trend === 'stable' ? 'var(--text-muted)' : undefined
                                            }}>
                                                {fuel.trend === 'up' ? '▲' : fuel.trend === 'down' ? '▼' : '▬'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                className="new-topic-btn hover-lift"
                                onClick={() => setShowNewTopicModal(true)}
                                style={{
                                    padding: '12px 24px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    fontWeight: '700',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    boxShadow: '0 6px 18px rgba(59,130,246,0.25)',
                                }}
                            >
                                <Plus size={16} strokeWidth={3} /> Yeni Başlık
                            </button>
                        </div>



                        {/* Reklam Alanı (Yan Yana) */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px', marginBottom: '8px' }}>
                            <AdPlaceholder variant="banner" fallbackTitle="Reklam Alanı" fallbackDesc="Buraya reklam verebilirsiniz." />
                            <AdPlaceholder variant="banner" fallbackTitle="Reklam Alanı" fallbackDesc="Buraya reklam verebilirsiniz." />
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div className="home-main-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '24px' }}>
                        {/* Left Sidebar - Kategoriler */}
                        <aside className="home-left-sidebar">
                            <div style={{
                                position: 'sticky',
                                top: '100px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '16px',
                            }}>
                                <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    Kategoriler
                                </h2>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {dynamicCategories.map((cat) => {
                                        const active = selectedCategory === cat.name;
                                        const meta = CATEGORY_META[cat.name];
                                        return (
                                            <li key={cat.name} style={{ marginBottom: '4px' }}>
                                                <button
                                                    type="button"
                                                    aria-pressed={active}
                                                    onClick={() => setSelectedCategory(cat.name)}
                                                    title={meta?.desc}
                                                    style={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: '10px',
                                                        padding: '10px 12px',
                                                        borderRadius: '10px',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        background: active ? 'var(--secondary)' : 'transparent',
                                                        color: active ? 'var(--foreground)' : 'var(--text-muted)',
                                                        fontSize: '14px',
                                                        fontWeight: active ? '700' : '500',
                                                        textAlign: 'left',
                                                        transition: 'all 0.15s ease',
                                                        borderLeft: active ? '3px solid var(--text-muted)' : '3px solid transparent',
                                                    }}
                                                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--secondary)'; }}
                                                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                                                >
                                                    <span style={{ flex: 1 }}>{cat.name}</span>
                                                    <span style={{
                                                        fontSize: '11px', fontWeight: '700',
                                                        color: 'var(--text-muted)',
                                                        background: 'var(--secondary)',
                                                        padding: '2px 8px', borderRadius: '10px', minWidth: '24px', textAlign: 'center',
                                                    }}>{cat.count}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            
                            {/* Reklam Alanı */}
                            <AdPlaceholder position="sidebar" style={{ marginTop: '16px' }} />

                            {/* Pazar Vitrini (Gizlendi) */}
                            <LatestThreadsWidget />


                            {/* Efsane Avcıları Vitrini */}
                            {randomMyth && (
                                <div style={{
                                    marginTop: '16px',
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>
                                            Günün Efsanesi
                                        </h3>
                                    </div>
                                    
                                    <Link href={`/kutuphane/efsane-avcilari/${randomMyth.slug}--${randomMyth.id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{ cursor: 'pointer' }}
                                             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                                            <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px', lineHeight: '1.4' }}>
                                                &quot;{randomMyth.myth}&quot;
                                            </p>
                                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: '1.5', borderLeft: '2px solid var(--card-border)', paddingLeft: '8px' }}>
                                                {randomMyth.reality}
                                            </p>
                                            <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                Detaylı Oku <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )}

                            {/* Reklam Alanı (Rastgele Bilgi Altı) */}
                            <AdPlaceholder position="sidebar_bottom" style={{ marginTop: '16px' }} />
                        </aside>

                        {/* Main Content - BAşLIKLAR LİSTESİ */}
                        <div className="home-forum-feed">
                            <div className="forum-mobile-categories" role="group" aria-label="Forum kategorileri">
                                {dynamicCategories.map((cat) => {
                                    const active = selectedCategory === cat.name;
                                    return (
                                        <button
                                            key={`mobile-${cat.name}`}
                                            type="button"
                                            aria-pressed={active}
                                            onClick={() => setSelectedCategory(cat.name)}
                                            className={active ? 'forum-mobile-category active' : 'forum-mobile-category'}
                                        >
                                            {cat.name}<span>{cat.count}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Sort Bar */}
                            <div className="forum-feed-toolbar" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                                padding: '10px 16px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '12px',
                                gap: '12px',
                                flexWrap: 'wrap',
                            }}>
                                {/* Search Bar */}
                                <div className="sort-bar-search" style={{ position: 'relative', width: '220px', flexShrink: 0 }}>
                                    <input
                                        type="text"
                                        aria-label="Forum başlıklarında ara"
                                        placeholder="Başlık ara..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '7px 32px',
                                            background: 'var(--background)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '8px',
                                            color: 'var(--foreground)',
                                            fontSize: '13px',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                        }}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                                    />
                                    <Search aria-hidden="true" size={14} style={{
                                        position: 'absolute', left: '10px', top: '50%',
                                        transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
                                    }} />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            aria-label="Aramayı temizle"
                                            onClick={() => setSearchQuery("")}
                                            style={{
                                                position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
                                                background: 'transparent', border: 'none', color: 'var(--text-muted)',
                                                cursor: 'pointer', fontSize: '12px', padding: '4px', lineHeight: 1,
                                            }}
                                        ><X size={14} /></button>
                                    )}
                                </div>

                                <div className="forum-sort-segment" role="group" aria-label="Başlık sıralaması">
                                    <button
                                        type="button"
                                        aria-pressed={sortBy === 'new'}
                                        className={sortBy === 'new' ? 'active' : ''}
                                        onClick={() => setSortBy('new')}
                                    >
                                        <Clock size={14} /> Son hareket
                                    </button>
                                    <button
                                        type="button"
                                        aria-pressed={sortBy === 'popular'}
                                        className={sortBy === 'popular' ? 'active' : ''}
                                        onClick={() => setSortBy('popular')}
                                    >
                                        <TrendingUp size={14} /> En çok yanıt
                                    </button>
                                </div>

                                {/* Ekşi Sözlük-style Pagination */}
                                {totalPages > 1 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                        {(() => {
                                            const pBtn = (label: string, page: number, disabled: boolean, isActive?: boolean) => (
                                                <button
                                                    key={label + page}
                                                    onClick={() => !disabled && setCurrentPage(page)}
                                                    disabled={disabled}
                                                    style={{
                                                        minWidth: isActive !== undefined ? '28px' : '26px',
                                                        height: '28px',
                                                        padding: '0 6px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        border: isActive ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                                                        borderRadius: '6px',
                                                        background: isActive ? 'var(--primary)' : 'var(--background)',
                                                        color: isActive ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--foreground)',
                                                        fontSize: '12px', fontWeight: isActive ? '700' : '500',
                                                        cursor: disabled ? 'default' : 'pointer',
                                                        opacity: disabled && !isActive ? 0.4 : 1,
                                                        transition: 'all 0.15s',
                                                    }}
                                                >{label}</button>
                                            );

                                            const pages: React.ReactNode[] = [];

                                            // << and < buttons
                                            pages.push(pBtn('«', 1, safePage === 1));
                                            pages.push(pBtn('‹', safePage - 1, safePage === 1));

                                            // Page numbers with ellipsis
                                            const range: number[] = [];
                                            if (totalPages <= 7) {
                                                for (let i = 1; i <= totalPages; i++) range.push(i);
                                            } else {
                                                range.push(1);
                                                if (safePage > 4) range.push(-1); // ellipsis
                                                const start = Math.max(2, safePage - 1);
                                                const end = Math.min(totalPages - 1, safePage + 1);
                                                for (let i = start; i <= end; i++) range.push(i);
                                                if (safePage < totalPages - 3) range.push(-2); // ellipsis
                                                range.push(totalPages);
                                            }

                                            range.forEach((p, idx) => {
                                                if (p < 0) {
                                                    pages.push(
                                                        <span key={`dots-${idx}`} style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '0 2px' }}>…</span>
                                                    );
                                                } else {
                                                    pages.push(pBtn(String(p), p, false, p === safePage));
                                                }
                                            });

                                            // > and >> buttons
                                            pages.push(pBtn('›', safePage + 1, safePage === totalPages));
                                            pages.push(pBtn('»', totalPages, safePage === totalPages));

                                            return pages;
                                        })()}

                                        <span style={{
                                            fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {safePage}/{totalPages}
                                        </span>
                                    </div>
                                )}
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

                            {/* Bottom Pagination */}
                            {totalPages > 1 && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginTop: '20px', padding: '12px 16px',
                                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                    borderRadius: '12px', gap: '4px', flexWrap: 'wrap',
                                }}>
                                    {(() => {
                                        const pBtn = (label: string, page: number, disabled: boolean, isActive?: boolean) => (
                                            <button
                                                key={`btm-${label}-${page}`}
                                                onClick={() => { if (!disabled) { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
                                                disabled={disabled}
                                                style={{
                                                    minWidth: isActive !== undefined ? '32px' : '28px',
                                                    height: '32px', padding: '0 8px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    border: isActive ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                                                    borderRadius: '6px',
                                                    background: isActive ? 'var(--primary)' : 'var(--background)',
                                                    color: isActive ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--foreground)',
                                                    fontSize: '13px', fontWeight: isActive ? '700' : '500',
                                                    cursor: disabled ? 'default' : 'pointer',
                                                    opacity: disabled && !isActive ? 0.4 : 1,
                                                    transition: 'all 0.15s',
                                                }}
                                            >{label}</button>
                                        );
                                        const pages: React.ReactNode[] = [];
                                        pages.push(pBtn('«', 1, safePage === 1));
                                        pages.push(pBtn('‹', safePage - 1, safePage === 1));
                                        const range: number[] = [];
                                        if (totalPages <= 7) {
                                            for (let i = 1; i <= totalPages; i++) range.push(i);
                                        } else {
                                            range.push(1);
                                            if (safePage > 4) range.push(-1);
                                            const start = Math.max(2, safePage - 1);
                                            const end = Math.min(totalPages - 1, safePage + 1);
                                            for (let i = start; i <= end; i++) range.push(i);
                                            if (safePage < totalPages - 3) range.push(-2);
                                            range.push(totalPages);
                                        }
                                        range.forEach((p, idx) => {
                                            if (p < 0) {
                                                pages.push(<span key={`btm-dots-${idx}`} style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '0 2px' }}>…</span>);
                                            } else {
                                                pages.push(pBtn(String(p), p, false, p === safePage));
                                            }
                                        });
                                        pages.push(pBtn('›', safePage + 1, safePage === totalPages));
                                        pages.push(pBtn('»', totalPages, safePage === totalPages));
                                        return pages;
                                    })()}
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '12px' }}>
                                        sayfa {safePage} / {totalPages}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <aside className="home-right-sidebar">
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {/* Bugün Gündemde */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                                        <h3 style={{
                                            fontSize: '13px', fontWeight: '700', color: 'var(--foreground)',
                                            margin: 0, display: 'flex', alignItems: 'center', gap: '6px',
                                        }}>
                                            <Flame size={14} color="var(--text-muted)" />
                                            Bugün Gündemde
                                        </h3>
                                        <Link href="/forum" style={{
                                            fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500',
                                            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px',
                                        }}>
                                            tümü <ChevronRight size={11} />
                                        </Link>
                                    </div>

                                    {loadingThreads ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '10px', padding: '9px 6px', borderBottom: i < 4 ? '1px solid var(--card-border)' : 'none' }}>
                                                    <div className="skeleton-pulse" style={{ width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0 }} />
                                                    <div style={{ flex: 1 }}>
                                                        <div className="skeleton-pulse" style={{ width: '100%', height: '14px', borderRadius: '4px', marginBottom: '6px' }} />
                                                        <div className="skeleton-pulse" style={{ width: '60%', height: '10px', borderRadius: '4px' }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : liveThreads.length === 0 ? (
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0', margin: 0 }}>Henüz gündem yok</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                            {[...liveThreads].sort((a, b) => b.views - a.views).slice(0, 5).map((thread, index) => (
                                                <Link key={thread.id} href={getThreadSlugUrl(thread)} style={{ textDecoration: 'none' }}>
                                                    <div
                                                        style={{
                                                            display: 'flex', alignItems: 'flex-start', gap: '10px',
                                                            padding: '9px 6px',
                                                            borderBottom: index < 4 ? '1px solid var(--card-border)' : 'none',
                                                            transition: 'background 0.15s',
                                                            borderRadius: '4px',
                                                        }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                                    >
                                                        <span style={{
                                                            fontSize: '12px', fontWeight: '700',
                                                            color: index < 3 ? 'var(--primary)' : 'var(--text-muted)',
                                                            minWidth: '16px', textAlign: 'center', flexShrink: 0,
                                                            lineHeight: '18px',
                                                        }}>
                                                            {index + 1}
                                                        </span>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <span style={{
                                                                color: 'var(--foreground)', fontSize: '12.5px',
                                                                fontWeight: '500', lineHeight: 1.45,
                                                                display: '-webkit-box', WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                            }}>
                                                                {thread.title}
                                                            </span>
                                                            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                                                                {thread.views >= 1000 ? `${(thread.views / 1000).toFixed(1)}K` : thread.views} görüntülenme
                                                                {thread.entryCount > 0 && ` · ${thread.entryCount} entry`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>



                                {/* En Aktif Üyeler */}
                                {topUsers.length > 0 && (
                                    <div className="home-sidebar-extra" style={{
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '16px',
                                        padding: '16px',
                                        marginBottom: '16px',
                                    }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Award size={16} color="var(--primary)" /> En Aktif Üyeler
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            {topUsers.map((tu, index) => {
                                                const rankColors = ['#F59E0B', '#9CA3AF', '#B45309'];
                                                const rankColor = index < 3 ? rankColors[index] : 'var(--text-muted)';
                                                return (
                                                    <Link key={tu.username} href={`/profil/${tu.username}`} style={{ textDecoration: 'none' }}>
                                                        <div style={{
                                                            display: 'flex', alignItems: 'center', gap: '10px',
                                                            padding: '8px 6px', borderRadius: '8px',
                                                            transition: 'background 0.15s',
                                                        }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)'; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                                                            <span style={{
                                                                fontSize: '13px', fontWeight: '800', color: rankColor,
                                                                minWidth: '18px', textAlign: 'center', flexShrink: 0,
                                                            }}>{index + 1}</span>
                                                            <div style={{
                                                                width: '30px', height: '30px', borderRadius: '50%',
                                                                background: 'var(--secondary)', border: '1px solid var(--card-border)',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', flexShrink: 0,
                                                            }}>{tu.username.charAt(0).toUpperCase()}</div>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {tu.username}
                                                                </div>
                                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                                    {(tu.entryCount || 0).toLocaleString('tr-TR')} entry
                                                                </div>
                                                            </div>
                                                            {index === 0 && <Crown size={15} color="#F59E0B" style={{ flexShrink: 0 }} />}
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* İstatistikler */}
                                <div className="home-sidebar-extra" style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>
                                        İstatistikler
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
                                    <div className="home-sidebar-extra" style={{
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

                                            <Link href={`/makale/${randomGuide.title.toLowerCase().replace(/[^a-z0-9ğüşöçı]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}--${randomGuide.urlId || randomGuide.id}`} style={{ textDecoration: 'none' }}>
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

                                {/* Reklam Alanı (Sağ Sidebar Alt) */}
                                <AdPlaceholder position="sidebar_right" style={{ marginTop: '16px' }} />
                            </div>
                        </aside>
                    </div>
                </div>
            </main >





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
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '16px',
                            overflowY: 'auto',
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
                                marginTop: '40px',
                                marginBottom: '40px',
                                position: 'relative',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowNewTopicModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    fontSize: '18px',
                                    zIndex: 1,
                                }}
                            >
                                ✕
                            </button>
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

                            {/* Araç Detayları (Opsiyonel) */}
                            <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Car size={16} /> Araç Detayları (Opsiyonel)
                                </label>
                                <div className="car-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                    <select
                                        value={newTopicData.carBrand}
                                        onChange={(e) => setNewTopicData({ ...newTopicData, carBrand: e.target.value, carModel: "" })}
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'var(--secondary)',
                                            border: '1px solid var(--card-border)', borderRadius: '10px',
                                            color: 'var(--foreground)', fontSize: '14px', outline: 'none'
                                        }}
                                    >
                                        <option value="">Marka Seçin</option>
                                        {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                    <select
                                        value={newTopicData.carModel}
                                        onChange={(e) => setNewTopicData({ ...newTopicData, carModel: e.target.value })}
                                        disabled={!newTopicData.carBrand}
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'var(--secondary)',
                                            border: '1px solid var(--card-border)', borderRadius: '10px',
                                            color: 'var(--foreground)', fontSize: '14px', outline: 'none',
                                            opacity: newTopicData.carBrand ? 1 : 0.5
                                        }}
                                    >
                                        <option value="">Model Seçin</option>
                                        {availableModels.map((m: string) => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="car-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <input
                                        type="number"
                                        placeholder="Yıl (Örn: 2018)"
                                        value={newTopicData.carYear}
                                        onChange={(e) => setNewTopicData({ ...newTopicData, carYear: e.target.value })}
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'var(--secondary)',
                                            border: '1px solid var(--card-border)', borderRadius: '10px',
                                            color: 'var(--foreground)', fontSize: '14px', outline: 'none'
                                        }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="KM (Örn: 120000)"
                                        value={newTopicData.carKm}
                                        onChange={(e) => setNewTopicData({ ...newTopicData, carKm: e.target.value })}
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'var(--secondary)',
                                            border: '1px solid var(--card-border)', borderRadius: '10px',
                                            color: 'var(--foreground)', fontSize: '14px', outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* İçerik Başlığı */}
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
                            <div style={{ marginBottom: newTopicData.type === 'survey' ? '16px' : '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    İçerik
                                </label>
                                <MarkdownEditor
                                    value={newTopicData.content}
                                    onChange={(val) => setNewTopicData({ ...newTopicData, content: val })}
                                    placeholder={
                                        newTopicData.type === 'survey' ? "Anket açıklaması..." :
                                            newTopicData.type === 'expert' ? "Sorununuzu detaylı açıklayın..." :
                                                "İlk entry'nizi yazın..."
                                    }
                                    minRows={newTopicData.type === 'survey' ? 2 : 4}
                                />
                            </div>

                            {/* Anket Seçenekleri */}
                            {newTopicData.type === 'survey' && (
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                        Seçenekler (en az 2) <span style={{ color: '#ff4444' }}>*</span>
                                    </label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {newSurveyOptions.map((opt, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => {
                                                        const newOpts = [...newSurveyOptions];
                                                        newOpts[i] = e.target.value;
                                                        setNewSurveyOptions(newOpts);
                                                    }}
                                                    placeholder={`${i + 1}. Seçenek`}
                                                    style={{
                                                        flex: 1, padding: '10px 14px', background: 'var(--background)',
                                                        border: '1px solid var(--card-border)', borderRadius: '8px',
                                                        color: 'var(--foreground)', fontSize: '14px', outline: 'none'
                                                    }}
                                                />
                                                {newSurveyOptions.length > 2 && (
                                                    <button onClick={() => setNewSurveyOptions(newSurveyOptions.filter((_, idx) => idx !== i))}
                                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {newSurveyOptions.length < 8 && (
                                            <button onClick={() => setNewSurveyOptions([...newSurveyOptions, ""])}
                                                style={{
                                                    alignSelf: 'flex-start', padding: '8px 16px', background: 'var(--secondary)',
                                                    border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)',
                                                    fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                                                }}>
                                                <Plus size={14} /> Seçenek Ekle
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

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
                                            const validOptions = newSurveyOptions.filter(o => o.trim() !== "");
                                            if (validOptions.length < 2) {
                                                alert("Anket için en az 2 geçerli seçenek girmelisiniz.");
                                                return;
                                            }
                                            
                                            // Normal anket Firestore kaydı (Anket sayfasına gidecek)
                                            if (!user) {
                                                alert("Anket oluşturmak için giriş yapmalısınız.");
                                                return;
                                            }
                                            try {
                                                const { addDoc, serverTimestamp, collection } = require("firebase/firestore");
                                                const nominees = validOptions.map((name, i) => ({ id: i + 1, name, votes: 0 }));
                                                const docRef = await addDoc(collection(db, "surveys"), {
                                                    title: newTopicData.title.trim(),
                                                    description: newTopicData.content.trim(),
                                                    category: "Genel",
                                                    iconName: "none",
                                                    status: "active",
                                                    totalVotes: 0,
                                                    nominees,
                                                    voters: {},
                                                    createdBy: user.username,
                                                    createdAt: serverTimestamp(),
                                                });
                                                
                                                alert(`Anket başarıyla oluşturuldu!`);
                                                setShowNewTopicModal(false);
                                                setNewTopicData({ title: "", content: "", category: "", type: "topic", carBrand: "", carModel: "", carYear: "", carKm: "" });
                                                setNewSurveyOptions(["Evet", "Hayır"]);
                                                window.location.href = '/anket';
                                            } catch (e: any) {
                                                alert("Hata: " + e.message);
                                            }
                                        } else {
                                            if (!user) {
                                                alert("İçerik oluşturmak için giriş yapmalısınız.");
                                                return;
                                            }
                                            try {
                                                const threadData: any = {
                                                    title: newTopicData.title.trim(),
                                                    category: newTopicData.category,
                                                    content: newTopicData.content.trim(),
                                                    tags: [],
                                                    authorId: user.id as string,
                                                    authorUsername: user.username,
                                                };
                                                
                                                if (newTopicData.carBrand) threadData.carBrand = newTopicData.carBrand;
                                                if (newTopicData.carModel) threadData.carModel = newTopicData.carModel;
                                                if (newTopicData.carYear) threadData.carYear = newTopicData.carYear;
                                                if (newTopicData.carKm) threadData.carKm = newTopicData.carKm;
                                                if (newTopicData.carBrand) threadData.tags.push(newTopicData.carBrand);
                                                if (newTopicData.carModel) threadData.tags.push(newTopicData.carModel);

                                                const threadId = await createThread(threadData);
                                                
                                                setShowNewTopicModal(false);
                                                setNewTopicData({ title: "", content: "", category: "", type: "topic", carBrand: "", carModel: "", carYear: "", carKm: "" });
                                                
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
                                    disabled={!newTopicData.title.trim() || (!newTopicData.category && newTopicData.type !== 'survey')}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: (!newTopicData.title.trim() || (!newTopicData.category && newTopicData.type !== 'survey')) ? 'var(--secondary)' : 'var(--primary)',
                                        border: 'none',
                                        borderRadius: '10px',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: (!newTopicData.title.trim() || (!newTopicData.category && newTopicData.type !== 'survey')) ? 'not-allowed' : 'pointer',
                                        opacity: (!newTopicData.title.trim() || (!newTopicData.category && newTopicData.type !== 'survey')) ? 0.5 : 1,
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
