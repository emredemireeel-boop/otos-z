"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, MessageSquare, TrendingUp, BarChart3, Clock, Flame, ChevronRight, Plus, MapPin, Search, X, CalendarDays, Newspaper, Car, Dna, Wrench, AlertTriangle, ClipboardCheck, ShieldCheck, Lightbulb, Save, Loader2, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

import { events } from "@/data/events";

import { subscribeToThreads, formatTimestamp, getThreadSlugUrl, createThread, type ForumThread as FirestoreThread } from "@/lib/forumService";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import carModelsData from "@/data/carmodels.json";
import { mythsData, Myth } from "@/data/efsane-avcilari-data";
import { createSlug as createVehicleSlug, vehicleDNAData } from "@/data/vehicle-dna";
import LatestThreadsWidget from "@/components/LatestThreadsWidget";
import MarkdownEditor from "@/components/MarkdownEditor";
import { validateEntryContent, validateThreadTitle } from "@/lib/validation";

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

type NewContentType = "topic" | "survey" | "expert";

type NewTopicFormData = {
    title: string;
    content: string;
    category: string;
    type: NewContentType;
    carBrand: string;
    carModel: string;
    carYear: string;
    carKm: string;
};

const EMPTY_NEW_TOPIC_DATA: NewTopicFormData = {
    title: "",
    content: "",
    category: "",
    type: "topic",
    carBrand: "",
    carModel: "",
    carYear: "",
    carKm: "",
};

const NEW_TOPIC_DRAFT_KEY = "otosoz_new_topic_draft_v1";

const DRIVER_ESSENTIALS = [
    { href: "/kutuphane?kategori=obd-ariza-kodlari", title: "OBD arıza kodları", description: "Nedenini ve çözümünü bul", icon: Wrench },
    { href: "/kutuphane?kategori=gosterge-isiklari", title: "Gösterge ışıkları", description: "Uyarının önemini öğren", icon: AlertTriangle },
    { href: "/kutuphane?kategori=ikinci-el-rehberi", title: "İkinci el kontrolü", description: "Almadan önce adım adım kontrol et", icon: ClipboardCheck },
    { href: "/kutuphane?kategori=kaza-ilkyardim", title: "Kaza ve ilk yardım", description: "Doğru sırayla ne yapacağını gör", icon: ShieldCheck },
];

const FEATURED_DNA_MODELS = vehicleDNAData.filter((vehicle) => [1, 2, 3, 4, 5, 6, 7, 8, 13].includes(vehicle.id));

export default function Home() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
    const [sortBy, setSortBy] = useState<"popular" | "new">("new");
    const [showNewTopicModal, setShowNewTopicModal] = useState(false);
    const [newTopicData, setNewTopicData] = useState<NewTopicFormData>({ ...EMPTY_NEW_TOPIC_DATA });
    const [newSurveyOptions, setNewSurveyOptions] = useState(["Evet", "Hayır"]);
    const [draftReady, setDraftReady] = useState(false);
    const [draftRestored, setDraftRestored] = useState(false);
    const [isSubmittingTopic, setIsSubmittingTopic] = useState(false);
    const [newTopicError, setNewTopicError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const [randomGuide, setRandomGuide] = useState<any>(null);
    const [randomMyth, setRandomMyth] = useState<Myth | null>(null);
    const [latestNews, setLatestNews] = useState<any[]>([]);

    const availableBrands = Object.keys(carModelsData).sort();
    const availableModels = newTopicData.carBrand && (carModelsData as Record<string, string[]>)[newTopicData.carBrand] 
        ? (carModelsData as Record<string, string[]>)[newTopicData.carBrand].sort() 
        : [];


    const [liveThreads, setLiveThreads] = useState<FirestoreThread[]>([]);
    const [loadingThreads, setLoadingThreads] = useState(true);
    const [homeSurveys, setHomeSurveys] = useState<any[]>([]);

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

        fetch('/data/news_posts.json')
            .then(res => res.json())
            .then(data => {
                const sortedPosts = [...(data.posts || [])].sort(
                    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setLatestNews(sortedPosts.slice(0, 2));
            })
            .catch(err => console.error("Error loading news:", err));

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

    // ── Yeni başlık taslağı ve modal davranışı ───────────────────────────────
    useEffect(() => {
        try {
            const savedDraft = localStorage.getItem(NEW_TOPIC_DRAFT_KEY);
            if (savedDraft) {
                const parsed = JSON.parse(savedDraft);
                const savedType: NewContentType = ["topic", "survey", "expert"].includes(parsed?.data?.type)
                    ? parsed.data.type
                    : "topic";
                const restoredData: NewTopicFormData = {
                    ...EMPTY_NEW_TOPIC_DATA,
                    ...(parsed.data || {}),
                    type: savedType,
                    category: savedType === "survey"
                        ? "Anket"
                        : savedType === "expert"
                            ? "Uzmana Sor"
                            : (parsed?.data?.category || ""),
                };
                setNewTopicData(restoredData);
                if (Array.isArray(parsed.options) && parsed.options.length >= 2) {
                    setNewSurveyOptions(parsed.options.slice(0, 8));
                }
                setDraftRestored(Boolean(restoredData.title || restoredData.content || restoredData.category || restoredData.carBrand));
            }
        } catch {
            localStorage.removeItem(NEW_TOPIC_DRAFT_KEY);
        } finally {
            setDraftReady(true);
        }
    }, []);

    useEffect(() => {
        if (!draftReady) return;
        const timeout = window.setTimeout(() => {
            const hasDraft = Boolean(
                newTopicData.title.trim() ||
                newTopicData.content.trim() ||
                newTopicData.category ||
                newTopicData.carBrand ||
                newTopicData.carModel ||
                newTopicData.carYear ||
                newTopicData.carKm
            );
            if (!hasDraft) {
                localStorage.removeItem(NEW_TOPIC_DRAFT_KEY);
                return;
            }
            localStorage.setItem(NEW_TOPIC_DRAFT_KEY, JSON.stringify({
                data: newTopicData,
                options: newSurveyOptions,
            }));
        }, 450);
        return () => window.clearTimeout(timeout);
    }, [draftReady, newTopicData, newSurveyOptions]);

    useEffect(() => {
        setNewTopicError("");
    }, [newTopicData, newSurveyOptions]);

    useEffect(() => {
        if (!showNewTopicModal) return;
        const previousOverflow = document.body.style.overflow;
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isSubmittingTopic) setShowNewTopicModal(false);
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [showNewTopicModal, isSubmittingTopic]);

    // ── Firestore Forum Threads ──────────────────────────────────────────────
    useEffect(() => {
        const unsub = subscribeToThreads((threads) => {
            setLiveThreads(threads);
            setLoadingThreads(false);
        }, 100);
        return () => unsub();
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

    const titleValidation = validateThreadTitle(newTopicData.title);
    const contentValidation = validateEntryContent(newTopicData.content);
    const validSurveyOptions = newSurveyOptions.map(option => option.trim()).filter(Boolean);
    const normalizedSurveyOptions = validSurveyOptions.map(option => option.toLocaleLowerCase("tr-TR"));
    const hasDuplicateSurveyOptions = new Set(normalizedSurveyOptions).size !== normalizedSurveyOptions.length;
    const categoryIsValid = newTopicData.type === "survey"
        ? newTopicData.category === "Anket"
        : newTopicData.type === "expert"
            ? newTopicData.category === "Uzmana Sor"
            : FORUM_CATS.includes(newTopicData.category);
    const surveyContentIsValid = !newTopicData.content.trim() || contentValidation.valid;
    const maxVehicleYear = new Date().getFullYear() + 1;
    const vehicleYearIsValid = !newTopicData.carYear || (
        Number.isInteger(Number(newTopicData.carYear)) &&
        Number(newTopicData.carYear) >= 1900 &&
        Number(newTopicData.carYear) <= maxVehicleYear
    );
    const vehicleKmIsValid = !newTopicData.carKm || (
        Number(newTopicData.carKm) >= 0 && Number(newTopicData.carKm) <= 2000000
    );
    const newTopicFormIsValid = Boolean(
        titleValidation.valid &&
        categoryIsValid &&
        vehicleYearIsValid &&
        vehicleKmIsValid &&
        (newTopicData.type === "survey"
            ? validSurveyOptions.length >= 2 && !hasDuplicateSurveyOptions && surveyContentIsValid
            : contentValidation.valid)
    );

    const normalizedDraftTitle = newTopicData.title
        .toLocaleLowerCase("tr-TR")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
    const ignoredSimilarityTerms = new Set(["araç", "araba", "sorun", "sorunu", "hakkında", "için", "olan", "nasıl"]);
    const draftTitleTerms = [...new Set(normalizedDraftTitle.split(" ").filter(term => term.length >= 3 && !ignoredSimilarityTerms.has(term)))];
    const similarTopicMatches = normalizedDraftTitle.length < 5 || draftTitleTerms.length === 0
        ? []
        : liveThreads
            .map(thread => {
                const normalizedThreadTitle = thread.title
                    .toLocaleLowerCase("tr-TR")
                    .replace(/[^\p{L}\p{N}\s]/gu, " ")
                    .replace(/\s+/g, " ")
                    .trim();
                const matchedTerms = draftTitleTerms.filter(term => normalizedThreadTitle.includes(term)).length;
                const phraseMatch = normalizedThreadTitle.includes(normalizedDraftTitle) || normalizedDraftTitle.includes(normalizedThreadTitle);
                return {
                    thread,
                    score: (matchedTerms / draftTitleTerms.length) + (phraseMatch ? 1 : 0),
                    matchedTerms,
                };
            })
            .filter(match => match.matchedTerms >= Math.min(2, draftTitleTerms.length))
            .sort((a, b) => b.score - a.score || b.thread.views - a.thread.views)
            .slice(0, 3);

    const newTopicChecklist = [
        { label: "Açık ve anlaşılır başlık", complete: titleValidation.valid },
        { label: "Doğru kategori", complete: categoryIsValid },
        {
            label: newTopicData.type === "survey" ? "En az iki farklı seçenek" : "Açıklayıcı ilk entry",
            complete: newTopicData.type === "survey"
                ? validSurveyOptions.length >= 2 && !hasDuplicateSurveyOptions
                : contentValidation.valid,
        },
        {
            label: "Araç bilgisi ekle",
            complete: Boolean(newTopicData.carBrand && newTopicData.carModel),
            optional: true,
        },
    ];

    const resetNewTopicForm = () => {
        setNewTopicData({ ...EMPTY_NEW_TOPIC_DATA });
        setNewSurveyOptions(["Evet", "Hayır"]);
        setDraftRestored(false);
        setNewTopicError("");
        if (typeof window !== "undefined") localStorage.removeItem(NEW_TOPIC_DRAFT_KEY);
    };

    const handleContentTypeChange = (type: NewContentType) => {
        setNewTopicData(previous => ({
            ...previous,
            type,
            category: type === "survey" ? "Anket" : type === "expert" ? "Uzmana Sor" : "",
        }));
    };

    const handleCreateContent = async () => {
        if (isSubmittingTopic) return;
        if (!titleValidation.valid) {
            setNewTopicError(titleValidation.error || "Başlığınızı kontrol edin.");
            return;
        }
        if (!categoryIsValid) {
            setNewTopicError("Lütfen başlığınız için uygun bir kategori seçin.");
            return;
        }
        if (!vehicleYearIsValid || !vehicleKmIsValid) {
            setNewTopicError("Araç yılı veya kilometre bilgisi geçerli aralıkta değil.");
            return;
        }
        if (newTopicData.type === "survey") {
            if (validSurveyOptions.length < 2) {
                setNewTopicError("Anket için en az iki seçenek yazın.");
                return;
            }
            if (hasDuplicateSurveyOptions) {
                setNewTopicError("Anket seçenekleri birbirinden farklı olmalı.");
                return;
            }
            if (!surveyContentIsValid) {
                setNewTopicError(contentValidation.error || "Anket açıklamasını kontrol edin.");
                return;
            }
        } else if (!contentValidation.valid) {
            setNewTopicError(contentValidation.error || "İlk entry'nizi kontrol edin.");
            return;
        }
        if (!user) {
            setNewTopicError("Başlık açmak için giriş yapmalısınız. Taslağınız bu cihazda korunacak.");
            return;
        }

        setIsSubmittingTopic(true);
        setNewTopicError("");
        try {
            if (newTopicData.type === "survey") {
                const nominees = validSurveyOptions.map((name, index) => ({ id: index + 1, name, votes: 0 }));
                await addDoc(collection(db, "surveys"), {
                    title: newTopicData.title.trim(),
                    description: newTopicData.content.trim(),
                    category: "Genel",
                    iconName: "none",
                    status: "active",
                    totalVotes: 0,
                    nominees,
                    voters: {},
                    createdBy: user.username,
                    createdById: user.id as string,
                    createdAt: serverTimestamp(),
                });
                resetNewTopicForm();
                setShowNewTopicModal(false);
                window.location.href = "/anket";
                return;
            }

            const tags = [newTopicData.carBrand, newTopicData.carModel].filter(Boolean);
            const threadSlug = await createThread({
                title: newTopicData.title.trim(),
                category: newTopicData.category,
                content: newTopicData.content.trim(),
                tags,
                authorId: user.id as string,
                authorUsername: user.username,
                ...(newTopicData.carBrand ? { carBrand: newTopicData.carBrand } : {}),
                ...(newTopicData.carModel ? { carModel: newTopicData.carModel } : {}),
                ...(newTopicData.carYear ? { carYear: newTopicData.carYear } : {}),
                ...(newTopicData.carKm ? { carKm: newTopicData.carKm } : {}),
            });

            resetNewTopicForm();
            setShowNewTopicModal(false);
            window.location.href = `/forum/${threadSlug}`;
        } catch (error) {
            setNewTopicError(error instanceof Error ? error.message : "İçerik oluşturulamadı. Lütfen tekrar deneyin.");
        } finally {
            setIsSubmittingTopic(false);
        }
    };

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

    const featuredEvent = events[0];
    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema).replace(/</g, '\\u003c') }}
            />
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Sub Header */}
                <div style={{
                    background: 'var(--top-bar-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '16px 24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div className="subheader-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
                            <div className="forum-page-heading">
                                <span className="forum-page-eyebrow">Otosöz topluluğu</span>
                                <h1>Forum</h1>
                                <p>Gerçek sürücü deneyimleri, teknik çözümler ve güncel tartışmalar.</p>
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
                                            <MapPin size={11} /> {tickerCity}
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
                                <Plus size={16} strokeWidth={3} /> Yeni başlık aç
                            </button>
                        </div>



                    </div>
                </div>

                <div className="forum-shell" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 24px 32px' }}>
                    <div className="home-main-grid" style={{ display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr) 300px', gap: '20px' }}>
                        {/* Sol sütun — forum kategorileri */}
                        <aside className="home-left-sidebar forum-sidebar" data-ad-rail-anchor="forum-start">
                            <div className="forum-sidebar-stack">
                                <section className="forum-sidebar-card forum-category-card" aria-labelledby="forum-categories-title">
                                    <div className="forum-sidebar-heading">
                                        <div>
                                            <span className="forum-sidebar-kicker">Başlıklara göz at</span>
                                            <h2 id="forum-categories-title">Kategoriler</h2>
                                        </div>
                                        <span className="forum-sidebar-total">{liveThreads.length}</span>
                                    </div>
                                    <ul className="forum-category-list">
                                        {dynamicCategories.map((cat) => {
                                            const active = selectedCategory === cat.name;
                                            const meta = CATEGORY_META[cat.name];
                                            return (
                                                <li key={cat.name}>
                                                    <button
                                                        type="button"
                                                        aria-pressed={active}
                                                        onClick={() => setSelectedCategory(cat.name)}
                                                        className={`forum-category-item${active ? ' active' : ''}`}
                                                    >
                                                        <span className="forum-category-copy">
                                                            <span>{cat.name}</span>
                                                            <small>{meta?.desc}</small>
                                                        </span>
                                                        <span className="forum-category-count">{cat.count}</span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>

                                <div className="forum-latest-wrapper">
                                    <LatestThreadsWidget />
                                </div>

                                <section className="forum-sidebar-card forum-resource-card forum-sidebar-fill" aria-labelledby="driver-essentials-title">
                                    <div className="forum-sidebar-heading">
                                        <div>
                                            <span className="forum-sidebar-kicker">Sürücü araçları</span>
                                            <h2 id="driver-essentials-title"><Wrench size={15} /> Yolda lazım olur</h2>
                                        </div>
                                        <Link href="/kutuphane" className="forum-heading-link">Tümü <ChevronRight size={13} /></Link>
                                    </div>
                                    <div className="forum-resource-list">
                                        {DRIVER_ESSENTIALS.map(({ href, title, description, icon: ToolIcon }) => (
                                            <Link key={href} href={href} className="forum-resource-row">
                                                <span className="forum-resource-icon"><ToolIcon size={15} /></span>
                                                <span className="forum-resource-copy">
                                                    <strong>{title}</strong>
                                                    <small>{description}</small>
                                                </span>
                                                <ChevronRight size={14} />
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                {randomMyth && (
                                    <section className="forum-sidebar-card forum-myth-card forum-sidebar-bottom">
                                        <span className="forum-sidebar-kicker">Kütüphaneden</span>
                                        <h3>Günün efsanesi</h3>
                                        <Link href={`/kutuphane/efsane-avcilari/${randomMyth.slug}--${randomMyth.id}`}>
                                            <p>“{randomMyth.myth}”</p>
                                            <span className="forum-card-link">Gerçeğini öğren <ArrowRight size={14} /></span>
                                        </Link>
                                    </section>
                                )}
                            </div>
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
                                            Tümünü gör <ChevronRight size={14} />
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
                                        Sayfa {safePage} / {totalPages}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Sağ sütun — keşif akışı */}
                        <aside className="home-right-sidebar forum-sidebar">
                            <div className="forum-sidebar-stack">
                                <section className="forum-sidebar-card forum-trending-card">
                                    <div className="forum-sidebar-heading">
                                        <div>
                                            <span className="forum-sidebar-kicker">Topluluk nabzı</span>
                                            <h2><Flame size={15} /> Gündemde</h2>
                                        </div>
                                        <Link href="/forum" className="forum-heading-link">Tümü <ChevronRight size={13} /></Link>
                                    </div>

                                    {loadingThreads ? (
                                        <div className="forum-compact-list">
                                            {[...Array(5)].map((_, i) => <div key={i} className="forum-compact-skeleton skeleton-pulse" />)}
                                        </div>
                                    ) : liveThreads.length === 0 ? (
                                        <p className="forum-sidebar-empty">Henüz gündem yok.</p>
                                    ) : (
                                        <div className="forum-compact-list">
                                            {[...liveThreads].sort((a, b) => b.views - a.views).slice(0, 5).map((thread, index) => (
                                                <Link key={thread.id} href={getThreadSlugUrl(thread)} className="forum-trending-row">
                                                    <span className="forum-trending-rank">{String(index + 1).padStart(2, '0')}</span>
                                                    <span className="forum-trending-copy">
                                                        <strong>{thread.title}</strong>
                                                        <small>{thread.entryCount} entry · {thread.views.toLocaleString('tr-TR')} görüntülenme</small>
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                {latestNews.length > 0 && (
                                    <section className="forum-sidebar-card forum-discovery-card">
                                        <div className="forum-sidebar-heading">
                                            <div>
                                                <span className="forum-sidebar-kicker">Güncel</span>
                                                <h2><Newspaper size={15} /> Son haberler</h2>
                                            </div>
                                            <Link href="/haberler" className="forum-heading-link">Tümü <ChevronRight size={13} /></Link>
                                        </div>
                                        <div className="forum-discovery-list">
                                            {latestNews.map((post) => (
                                                <Link key={post.id} href={`/haberler/${post.slug}`}>
                                                    <strong>{post.title}</strong>
                                                    <small>{post.readTime} dk okuma</small>
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {randomGuide && (
                                    <section className="forum-sidebar-card forum-guide-card">
                                        <span className="forum-sidebar-kicker">Kütüphaneden seçki</span>
                                        <div className="forum-guide-icon"><BookOpen size={18} /></div>
                                        <h2>{randomGuide.title}</h2>
                                        <p>{randomGuide.description}</p>
                                        <Link href={`/makale/${randomGuide.title.toLowerCase().replace(/[^a-z0-9ğüşöçı]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}--${randomGuide.urlId || randomGuide.id}`} className="forum-card-link">
                                            Rehberi oku <ArrowRight size={14} />
                                        </Link>
                                    </section>
                                )}

                                <section className="forum-sidebar-card forum-dna-card forum-sidebar-fill" aria-labelledby="featured-dna-title">
                                    <div className="forum-sidebar-heading">
                                        <div>
                                            <span className="forum-sidebar-kicker">Araç DNA&apos;dan</span>
                                            <h2 id="featured-dna-title"><Dna size={15} /> Popüler araç dosyaları</h2>
                                        </div>
                                    </div>
                                    <div className="forum-dna-list">
                                        {FEATURED_DNA_MODELS.map((vehicle) => (
                                            <Link
                                                key={vehicle.id}
                                                href={`/arac-dna/${createVehicleSlug(vehicle.brand)}/${createVehicleSlug(vehicle.model)}`}
                                                className="forum-dna-row"
                                            >
                                                <span className="forum-dna-copy">
                                                    <strong>{vehicle.brand} {vehicle.model}</strong>
                                                    <small>{vehicle.chronicIssues.length} kronik konu · {vehicle.totalReports} kullanıcı raporu</small>
                                                </span>
                                                <span className="forum-dna-score" title={`DNA puanı ${vehicle.dnaScore}`}>{vehicle.dnaScore}</span>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link href="/arac-dna" className="forum-card-link forum-card-footer-link">
                                        Tüm araçları keşfet <ArrowRight size={14} />
                                    </Link>
                                </section>

                                {featuredEvent && (
                                    <section className="forum-sidebar-card forum-event-card forum-sidebar-bottom">
                                        <span className="forum-sidebar-kicker">Takvim</span>
                                        <div className="forum-event-meta">
                                            <span className="forum-event-date">
                                                <CalendarDays size={15} />
                                                {new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(new Date(featuredEvent.date))}
                                            </span>
                                            <span>{featuredEvent.city}</span>
                                        </div>
                                        <h2>{featuredEvent.title}</h2>
                                        <Link href={`/etkinlikler/${featuredEvent.id}`} className="forum-card-link">
                                            Etkinliği incele <ArrowRight size={14} />
                                        </Link>
                                    </section>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </main >





            {/* Yeni Başlık Modal */}
            {showNewTopicModal && (
                <div
                    className="new-topic-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !isSubmittingTopic) setShowNewTopicModal(false);
                    }}
                >
                    <section
                        className="new-topic-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="new-topic-modal-title"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <header className="new-topic-modal-header">
                            <div>
                                <span className="new-topic-modal-kicker"><MessageSquare size={13} /> Topluluğa katkı</span>
                                <h2 id="new-topic-modal-title">Yeni başlık aç</h2>
                                <p>Konuyu net anlatın; doğru sürücüler daha hızlı yanıt versin.</p>
                            </div>
                            <button
                                type="button"
                                className="new-topic-modal-close"
                                aria-label="Yeni başlık penceresini kapat"
                                disabled={isSubmittingTopic}
                                onClick={() => setShowNewTopicModal(false)}
                            >
                                <X size={18} />
                            </button>
                        </header>

                        <form
                            className="new-topic-modal-form"
                            onSubmit={(event) => {
                                event.preventDefault();
                                void handleCreateContent();
                            }}
                        >
                            <div className="new-topic-type-grid" role="group" aria-label="İçerik türü">
                                {([
                                    { id: "topic", label: "Forum başlığı", description: "Deneyim veya tartışma", icon: MessageSquare },
                                    { id: "survey", label: "Anket", description: "Topluluğun fikrini al", icon: BarChart3 },
                                    { id: "expert", label: "Uzmana sor", description: "Teknik destek iste", icon: Lightbulb },
                                ] as const).map((type) => {
                                    const TypeIcon = type.icon;
                                    const active = newTopicData.type === type.id;
                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            className={`new-topic-type-button${active ? " active" : ""}`}
                                            aria-pressed={active}
                                            onClick={() => handleContentTypeChange(type.id)}
                                        >
                                            <span className="new-topic-type-icon"><TypeIcon size={17} /></span>
                                            <span>
                                                <strong>{type.label}</strong>
                                                <small>{type.description}</small>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="new-topic-modal-layout">
                                <div className="new-topic-form-column">
                                    <div className="new-topic-field">
                                        <div className="new-topic-label-row">
                                            <label htmlFor="new-topic-title">Başlık</label>
                                            <span className={newTopicData.title.length > 180 ? "limit" : ""}>{newTopicData.title.length}/200</span>
                                        </div>
                                        <input
                                            id="new-topic-title"
                                            type="text"
                                            autoFocus
                                            maxLength={200}
                                            value={newTopicData.title}
                                            aria-invalid={Boolean(newTopicData.title && !titleValidation.valid)}
                                            className={`new-topic-control${newTopicData.title && !titleValidation.valid ? " is-error" : ""}`}
                                            onChange={(event) => setNewTopicData(previous => ({ ...previous, title: event.target.value }))}
                                            placeholder={
                                                newTopicData.type === "survey"
                                                    ? "Örn. Şehir içi için hangi motor daha mantıklı?"
                                                    : newTopicData.type === "expert"
                                                        ? "Örn. Soğuk motorda gelen zincir sesi normal mi?"
                                                        : "Örn. Egea 1.4 Fire uzun kullanım deneyimim"
                                            }
                                        />
                                        {newTopicData.title && !titleValidation.valid ? (
                                            <small className="new-topic-field-error">{titleValidation.error}</small>
                                        ) : (
                                            <small className="new-topic-field-help">En az 5 karakter; model, belirti veya deneyimi açıkça yazın.</small>
                                        )}
                                    </div>

                                    <div className="new-topic-field">
                                        <div className="new-topic-label-row">
                                            <label htmlFor="new-topic-category">Kategori</label>
                                            <span>Zorunlu</span>
                                        </div>
                                        {newTopicData.type === "topic" ? (
                                            <select
                                                id="new-topic-category"
                                                className={`new-topic-control${newTopicData.category && !categoryIsValid ? " is-error" : ""}`}
                                                value={newTopicData.category}
                                                onChange={(event) => setNewTopicData(previous => ({ ...previous, category: event.target.value }))}
                                            >
                                                <option value="">Kategori seçin</option>
                                                {categories.filter(category => !category.special && category.name !== "Tümü").map(category => (
                                                    <option key={category.name} value={category.name}>{category.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="new-topic-locked-category" id="new-topic-category">
                                                <span>{newTopicData.type === "survey" ? "Anket" : "Uzmana Sor"}</span>
                                                <small>Kategori içerik türüne göre otomatik seçildi.</small>
                                            </div>
                                        )}
                                    </div>

                                    <div className="new-topic-field">
                                        <div className="new-topic-label-row">
                                            <label>{newTopicData.type === "survey" ? "Açıklama" : "İlk entry"}</label>
                                            <span className={newTopicData.content.length > 9000 ? "limit" : ""}>{newTopicData.content.length}/10.000</span>
                                        </div>
                                        <MarkdownEditor
                                            value={newTopicData.content}
                                            onChange={(value) => setNewTopicData(previous => ({ ...previous, content: value }))}
                                            placeholder={
                                                newTopicData.type === "survey"
                                                    ? "Anketin kapsamını kısaca açıklayın (isteğe bağlı)..."
                                                    : newTopicData.type === "expert"
                                                        ? "Belirtileri, ne zaman başladığını ve denediğiniz çözümleri yazın..."
                                                        : "Deneyiminizi veya sorunuzu ayrıntılarıyla anlatın..."
                                            }
                                            minRows={newTopicData.type === "survey" ? 3 : 6}
                                        />
                                        {newTopicData.content && !contentValidation.valid && (
                                            <small className="new-topic-field-error">{contentValidation.error}</small>
                                        )}
                                    </div>

                                    {newTopicData.type !== "survey" && (
                                        <details
                                            className="new-topic-vehicle-panel"
                                            open={newTopicData.carBrand || newTopicData.carYear ? true : undefined}
                                        >
                                            <summary>
                                                <span><Car size={16} /> Araç bilgisi</span>
                                                <small>İsteğe bağlı</small>
                                            </summary>
                                            <div className="new-topic-vehicle-content">
                                                <div className="new-topic-control-grid">
                                                    <select
                                                        className="new-topic-control"
                                                        value={newTopicData.carBrand}
                                                        onChange={(event) => setNewTopicData(previous => ({
                                                            ...previous,
                                                            carBrand: event.target.value,
                                                            carModel: "",
                                                        }))}
                                                    >
                                                        <option value="">Marka seçin</option>
                                                        {availableBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                                                    </select>
                                                    <select
                                                        className="new-topic-control"
                                                        value={newTopicData.carModel}
                                                        disabled={!newTopicData.carBrand}
                                                        onChange={(event) => setNewTopicData(previous => ({ ...previous, carModel: event.target.value }))}
                                                    >
                                                        <option value="">Model seçin</option>
                                                        {availableModels.map((model: string) => <option key={model} value={model}>{model}</option>)}
                                                    </select>
                                                </div>
                                                <div className="new-topic-control-grid">
                                                    <input
                                                        className={`new-topic-control${!vehicleYearIsValid ? " is-error" : ""}`}
                                                        type="number"
                                                        min="1900"
                                                        max={maxVehicleYear}
                                                        placeholder="Model yılı"
                                                        value={newTopicData.carYear}
                                                        onChange={(event) => setNewTopicData(previous => ({ ...previous, carYear: event.target.value }))}
                                                    />
                                                    <input
                                                        className={`new-topic-control${!vehicleKmIsValid ? " is-error" : ""}`}
                                                        type="number"
                                                        min="0"
                                                        max="2000000"
                                                        placeholder="Kilometre"
                                                        value={newTopicData.carKm}
                                                        onChange={(event) => setNewTopicData(previous => ({ ...previous, carKm: event.target.value }))}
                                                    />
                                                </div>
                                                {(!vehicleYearIsValid || !vehicleKmIsValid) && (
                                                    <small className="new-topic-field-error">Yıl veya kilometre değerini kontrol edin.</small>
                                                )}
                                            </div>
                                        </details>
                                    )}

                                    {newTopicData.type === "survey" && (
                                        <div className="new-topic-field">
                                            <div className="new-topic-label-row">
                                                <label>Anket seçenekleri</label>
                                                <span>{validSurveyOptions.length}/8</span>
                                            </div>
                                            <div className="new-topic-survey-options">
                                                {newSurveyOptions.map((option, index) => (
                                                    <div key={index} className="new-topic-survey-row">
                                                        <span>{index + 1}</span>
                                                        <input
                                                            type="text"
                                                            maxLength={80}
                                                            className="new-topic-control"
                                                            value={option}
                                                            placeholder={`${index + 1}. seçenek`}
                                                            onChange={(event) => {
                                                                const nextOptions = [...newSurveyOptions];
                                                                nextOptions[index] = event.target.value;
                                                                setNewSurveyOptions(nextOptions);
                                                            }}
                                                        />
                                                        {newSurveyOptions.length > 2 && (
                                                            <button
                                                                type="button"
                                                                aria-label={`${index + 1}. seçeneği kaldır`}
                                                                onClick={() => setNewSurveyOptions(current => current.filter((_, optionIndex) => optionIndex !== index))}
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {hasDuplicateSurveyOptions && (
                                                <small className="new-topic-field-error">Aynı seçenek birden fazla kez kullanılamaz.</small>
                                            )}
                                            {newSurveyOptions.length < 8 && (
                                                <button
                                                    type="button"
                                                    className="new-topic-add-option"
                                                    onClick={() => setNewSurveyOptions(current => [...current, ""])}
                                                >
                                                    <Plus size={14} /> Seçenek ekle
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <aside className="new-topic-help-column">
                                    <section className="new-topic-draft-card">
                                        <Save size={17} />
                                        <div>
                                            <strong>{draftRestored ? "Taslağın geri yüklendi" : "Taslak otomatik kaydedilir"}</strong>
                                            <span>{draftReady ? "Bu cihazda yazmaya sonra devam edebilirsin." : "Taslak hazırlanıyor..."}</span>
                                        </div>
                                        {draftRestored && (
                                            <button type="button" onClick={resetNewTopicForm}>Temizle</button>
                                        )}
                                    </section>

                                    <section className="new-topic-help-card">
                                        <span className="new-topic-help-kicker">Yayın kontrolü</span>
                                        <h3>İyi bir başlık için</h3>
                                        <ul className="new-topic-checklist">
                                            {newTopicChecklist.map(item => (
                                                <li key={item.label} className={item.complete ? "complete" : ""}>
                                                    <span>{item.complete ? "✓" : "·"}</span>
                                                    <div>
                                                        {item.label}
                                                        {item.optional && <small>İsteğe bağlı</small>}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>

                                    {similarTopicMatches.length > 0 && (
                                        <section className="new-topic-help-card new-topic-similar-card">
                                            <span className="new-topic-help-kicker">Önce kontrol et</span>
                                            <h3>Benzer başlıklar olabilir</h3>
                                            <div>
                                                {similarTopicMatches.map(({ thread }) => (
                                                    <Link key={thread.id} href={getThreadSlugUrl(thread)} target="_blank" rel="noopener noreferrer">
                                                        <strong>{thread.title}</strong>
                                                        <small>{thread.entryCount || 0} yanıt · yeni sekmede açılır</small>
                                                    </Link>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {!user && (
                                        <section className="new-topic-login-card">
                                            <strong>Yayınlamak için giriş gerekli</strong>
                                            <span>Formu doldurabilirsin; taslağın kaybolmaz.</span>
                                            <Link href="/giris">Giriş yap <ArrowRight size={13} /></Link>
                                        </section>
                                    )}
                                </aside>
                            </div>

                            {newTopicError && (
                                <div className="new-topic-submit-error" role="alert">
                                    <AlertTriangle size={17} />
                                    <span>{newTopicError}</span>
                                    {!user && <Link href="/giris">Giriş yap</Link>}
                                </div>
                            )}

                            <footer className="new-topic-modal-footer">
                                <button
                                    type="button"
                                    className="new-topic-secondary-button"
                                    disabled={isSubmittingTopic}
                                    onClick={() => setShowNewTopicModal(false)}
                                >
                                    Daha sonra
                                </button>
                                <button
                                    type="submit"
                                    className="new-topic-primary-button"
                                    disabled={!newTopicFormIsValid || isSubmittingTopic}
                                >
                                    {isSubmittingTopic && <Loader2 size={16} className="new-topic-spinner" />}
                                    {isSubmittingTopic
                                        ? "Yayınlanıyor..."
                                        : newTopicData.type === "survey"
                                            ? "Anketi yayınla"
                                            : newTopicData.type === "expert"
                                                ? "Soruyu gönder"
                                                : "Başlığı yayınla"}
                                </button>
                            </footer>
                        </form>
                    </section>
                </div>
            )}
            <Footer />
        </div >
    );
}
