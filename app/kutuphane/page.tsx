"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dictionaryTerms, getAllLetters, categoryColors } from "@/data/dictionary";
import { BookOpen, Lightbulb, BookMarked, Clock, Tag, TrendingUp, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, CheckCircle, XCircle, Search, Wrench, AlertTriangle, ChevronLeft, ChevronRight, ShieldAlert, Zap, ExternalLink, Map } from "lucide-react";
import Link from "next/link";
import ObdSection from "./obd-section";
import GostergeSection from "./gosterge-section";
import LastikRehberiSection from "./lastik-rehberi-section";
import IkinciElSection from "./ikinci-el-section";
import KazaIlkYardimSection from "./kaza-ilkyardim-section";
import MevsimselBakimSection from "./mevsimsel-bakim-section";
import SigortaRehberiSection from "./sigorta-rehberi-section";
import OtoyolUcretleriSection from "./otoyol-ucretleri-section";
import BakimZamanlariSection from "./bakim-zamanlari-section";
import trafikCezalariData from "@/data/trafik_cezalari.json";

// Types for Library Guides
interface GuideDetail {
    id: string;
    title: string;
    description: string;
    minutes: number;
    difficulty: string;
    tags: string[];
    author: string;
}

// Types for Interesting Facts
interface DailyTip {
    id: string;
    title: string;
    tip: string;
    category: string;
    icon: string;
}

interface ChecklistData {
    id: string;
    title: string;
    category: string;
    gradient: string[];
    items: string[];
}

interface DoAndDontData {
    id: string;
    title: string;
    gradient: string[];
    do: {
        title: string;
        icon: string;
        points: string[];
    };
    dont: {
        title: string;
        icon: string;
        points: string[];
    };
}

interface MythBuster {
    id: string;
    myth: string;
    truth: string;
    category: string;
    gradient: string[];
}

interface QuickFactData {
    id: string;
    text: string;
    category: string;
    gradient: string[];
}

const SectionCarousel = ({ title, icon, children }: { title: string, icon?: React.ReactNode, children: React.ReactNode }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };
    return (
        <section style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {icon} {title}
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => scroll('left')} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--foreground)' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => scroll('right')} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--foreground)' }}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
            <div ref={scrollRef} style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '16px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none' }}>
                <style>{`
                    div::-webkit-scrollbar { display: none; }
                `}</style>
                {children}
            </div>
        </section>
    );
};

export default function LibraryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // SEO-friendly slug mappings
    const tabSlugs = [
        { slug: 'makaleler', name: 'Makale', icon: BookOpen, title: 'Otomotiv Makaleleri | OtoSöz Kütüphane', description: 'Otomotiv dünyasına dair detaylı makaleler, bakım rehberleri ve uzman önerileri.' },
        { slug: 'ilginc-bilgiler', name: 'İlginç', icon: Lightbulb, title: 'İlginç Otomotiv Bilgileri | OtoSöz', description: 'Otomobil dünyasından ilginç bilgiler, ipucları, mit kırıcılar ve kontrol listeleri.' },
        { slug: 'otomotiv-sozluk', name: 'Sözlük', icon: BookMarked, title: 'Otomotiv Sözlüğü - Türkçe Araç Terimleri | OtoSöz', description: 'A\'dan Z\'ye tüm otomotiv terimlerinin Türkçe açıklamaları. ABS, ESP, Tramer, Ekspertiz ve daha fazlası.' },
        { slug: 'obd-ariza-kodlari', name: 'OBD', icon: Wrench, title: 'OBD Arıza Kodları Sorgulama | OtoSöz', description: 'P0, P1, P2 ve tüm OBD arıza kodlarının Türkçe açıklamaları, nedenleri ve çözüm önerileri.' },
        { slug: 'gosterge-isiklari', name: 'Göstergeler', icon: AlertTriangle, title: 'Araç Gösterge Işıkları ve Anlamları | OtoSöz', description: 'Arabadaki tüm ikaz lambalarının anlamları: motor arıza, ABS, yağ basıncı, hararet ve daha fazlası.' },
        { slug: 'trafik-cezalari', name: 'Trafik Cezaları', icon: ShieldAlert, title: '2026 Trafik Ceza Tablosu - Güncel Tutarlar | OtoSöz', description: '2026 yılı güncel trafik ceza tutarları, ehliyet ceza puanları, alkol sınırları ve araç men süreleri.' },
        { slug: 'lastik-rehberi', name: 'Lastik Rehberi', icon: TrendingUp, title: 'Lastik Rehberi - Ebat, Mevsim, Bakım | OtoSöz', description: 'Lastik ebat okuma, kış/yaz lastik rehberi, hava basıncı tablosu ve lastik bakım önerileri.' },
        { slug: 'ikinci-el-rehberi', name: 'İkinci El', icon: CheckCircle, title: 'İkinci El Araç Kontrol Listesi | OtoSöz', description: 'İkinci el araç alırken dikkat edilmesi gerekenler: ekspertiz, tramer, km kontrolü ve pazarlık taktikleri.' },
        { slug: 'kaza-ilkyardim', name: 'Kaza & İlk Yardım', icon: ShieldAlert, title: 'Trafik Kazasında Ne Yapılmalı? | OtoSöz', description: 'Kaza anında yapılması gerekenler, ilk yardım adımları, sigorta bildirimi ve hukuki süreç.' },
        { slug: 'mevsimsel-bakim', name: 'Mevsimsel Bakım', icon: Tag, title: 'Mevsimsel Araç Bakım Rehberi | OtoSöz', description: 'Kış ve yaz hazırlığı için araç bakım kontrol listesi. Antifriz, lastik, akü ve klima bakımı.' },
        { slug: 'sigorta-rehberi', name: 'Sigorta Rehberi', icon: BookMarked, title: 'Kasko vs Trafik Sigortası Karşılaştırma | OtoSöz', description: 'Kasko ve trafik sigortası arasındaki farklar, hasar süreci, sigorta yaptırma rehberi.' },
        { slug: 'otoyol-ve-kopru-ucretleri', name: 'Otoyol Ücretleri', icon: Map, title: 'Otoyol ve Köprü Geçiş Ücretleri 2026 | OtoSöz', description: '2026 yılı güncel Karayolları (KGM) ve Yap-İşlet-Devret otoyol, köprü, tünel geçiş ücretleri.' },
        { slug: 'bakim-zamanlari', name: 'Bakım Zamanları', icon: Clock, title: 'Araç Bakım Zamanları ve Periyotları | OtoSöz', description: 'Benzinli, dizel, LPG, hibrit ve elektrikli araçlar için kilometre ve yıl bazlı periyodik bakım takvimi.' },
    ];

    // Determine active tab from URL
    const sekmeParam = searchParams.get('kategori');
    const activeTab = useMemo(() => {
        if (!sekmeParam) return 0;
        const idx = tabSlugs.findIndex(t => t.slug === sekmeParam);
        return idx >= 0 ? idx : 0;
    }, [sekmeParam]);

    // Dynamic page title & meta description for SEO
    useEffect(() => {
        const currentTab = tabSlugs[activeTab];
        document.title = currentTab.title;
        
        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', currentTab.description);

        // Update canonical URL  
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        canonical.setAttribute('href', activeTab === 0 ? `${baseUrl}/kutuphane` : `${baseUrl}/kutuphane?kategori=${currentTab.slug}`);
    }, [activeTab]);

    const setActiveTab = (index: number) => {
        const slug = tabSlugs[index].slug;
        if (index === 0) {
            router.push('/kutuphane', { scroll: false });
        } else {
            router.push(`/kutuphane?kategori=${slug}`, { scroll: false });
        }
    };

    const [guides, setGuides] = useState<GuideDetail[]>([]);
    const [interestingData, setInterestingData] = useState<any>(null);
    const [expandedChecklists, setExpandedChecklists] = useState<Set<string>>(new Set());
    const [selectedLetter, setSelectedLetter] = useState<string>('A');
    const [searchQuery, setSearchQuery] = useState("");
    const [guidePage, setGuidePage] = useState(1);
    const GUIDES_PER_PAGE = 10;

    // Helper for URL slugs
    const createSlug = (text: string) => {
        const trMap: { [key: string]: string } = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
        };
        const slug = text.replace(/[çğıöşüÇĞİÖŞÜ]/g, match => trMap[match] || match)
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        return slug;
    };

    // Load JSON data
    useEffect(() => {
        // Load guides (with cache buster)
        fetch(`/data/library_guides.json?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => setGuides(data.guides || []))
            .catch(err => console.error('Error loading guides:', err));

        // Load interesting facts (with cache buster)
        fetch(`/data/interesting_information.json?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => setInterestingData(data.interestingFacts || null))
            .catch(err => console.error('Error loading interesting data:', err));
    }, []);

    const toggleChecklist = (id: string) => {
        const newSet = new Set(expandedChecklists);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedChecklists(newSet);
    };

    const tabs = tabSlugs.map(t => ({ name: t.name, icon: t.icon }));

    // Copy protection handler
    const blockCopy = (e: React.SyntheticEvent) => {
        e.preventDefault();
        return false;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'kolay': return '#10B981';
            case 'orta': return '#F59E0B';
            case 'zor': return '#EF4444';
            case 'kritik': return '#DC2626';
            default: return '#3B82F6';
        }
    };

    const allLetters = getAllLetters();

    // --- Search Logic ---
    const filteredGuides = useMemo(() => {
        // En yeni önce: urlId büyük olan daha yeni
        const sorted = [...guides].sort((a, b) => {
            const aId = parseInt((a as any).urlId || a.id.replace(/\D/g, '')) || 0;
            const bId = parseInt((b as any).urlId || b.id.replace(/\D/g, '')) || 0;
            return bId - aId;
        });
        if (!searchQuery) return sorted;
        const query = searchQuery.toLowerCase();
        return sorted.filter(g =>
            g.title.toLowerCase().includes(query) ||
            g.description.toLowerCase().includes(query) ||
            g.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }, [guides, searchQuery]);

    const totalGuidePages = Math.ceil(filteredGuides.length / GUIDES_PER_PAGE);
    const paginatedGuides = filteredGuides.slice((guidePage - 1) * GUIDES_PER_PAGE, guidePage * GUIDES_PER_PAGE);

    const filteredDictionary = useMemo(() => {
        let terms = dictionaryTerms;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const filtered = terms.filter(t =>
                t.term.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query)
            );
            
            // Sort by relevance (Exact match > Starts with > Term includes > Description includes)
            return filtered.sort((a, b) => {
                const aTerm = a.term.toLowerCase();
                const bTerm = b.term.toLowerCase();
                
                if (aTerm === query && bTerm !== query) return -1;
                if (bTerm === query && aTerm !== query) return 1;
                
                if (aTerm.startsWith(query) && !bTerm.startsWith(query)) return -1;
                if (bTerm.startsWith(query) && !aTerm.startsWith(query)) return 1;
                
                if (aTerm.includes(query) && !bTerm.includes(query)) return -1;
                if (bTerm.includes(query) && !aTerm.includes(query)) return 1;
                
                return 0;
            });
        }
        return terms.filter(item => item.letter === selectedLetter);
    }, [dictionaryTerms, searchQuery, selectedLetter]);

    const filteredInteresting = useMemo(() => {
        if (!interestingData) return null;
        if (!searchQuery) return interestingData;

        const query = searchQuery.toLowerCase();
        const filter = (item: any) => JSON.stringify(item).toLowerCase().includes(query);

        return {
            dailyTips: interestingData.dailyTips?.filter(filter) || [],
            checklists: interestingData.checklists?.filter(filter) || [],
            doAndDont: interestingData.doAndDont?.filter(filter) || [],
            quickFacts: interestingData.quickFacts?.filter(filter) || [],
            mythBusters: interestingData.mythBusters?.filter(filter) || [],
        }
    }, [interestingData, searchQuery]);

    const getMythBustersSchema = () => {
        if (!filteredInteresting || !filteredInteresting.mythBusters || filteredInteresting.mythBusters.length === 0) return null;
        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": filteredInteresting.mythBusters.map((myth: any) => ({
                "@type": "Question",
                "name": myth.myth,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": myth.truth
                }
            }))
        };
        return JSON.stringify(schema);
    };

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Sub Header */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '16px 24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: activeTab === 0 ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                                        : activeTab === 1 ? 'linear-gradient(135deg, #10B981, #047857)'
                                            : 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                }} />
                                <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)' }}>Oto Kütüphane</h1>
                                {activeTab !== 0 && (
                                    <span style={{
                                        padding: '4px 12px',
                                        background: 'var(--secondary)',
                                        borderRadius: '9999px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: 'var(--text-muted)'
                                    }}>
                                         {activeTab === 1 ? 'İpuçları & Bilgiler'
                                            : activeTab === 2 ? `${filteredDictionary.length} Terim`
                                            : activeTab === 3 ? 'OBD Veritabanı'
                                            : activeTab === 4 ? 'Gösterge Paneli'
                                            : activeTab === 5 ? '2026 Trafik Cezaları'
                                            : activeTab === 6 ? 'Yakıt & Maliyet Hesaplama'
                                            : activeTab === 7 ? 'Km Bazlı Bakım Takvimi'
                                            : activeTab === 8 ? 'Lastik Kodu & Mevsim Rehberi'
                                            : activeTab === 9 ? 'İkinci El Kontrol Listesi'
                                            : activeTab === 10 ? 'Kaza Anında Ne Yapmalı'
                                            : activeTab === 11 ? 'Kış & Yaz Hazırlığı'
                                            : 'Kasko vs Trafik Sigortası'}
                                    </span>
                                )}
                            </div>

                            {/* Search Bar */}
                            {(activeTab !== 3 && activeTab !== 4 && activeTab < 6) && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 16px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '12px',
                                minWidth: '250px',
                                flex: '1',
                                maxWidth: '400px',
                            }}>
                                <Search style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="Kütüphanede ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        flex: 1,
                                        background: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        color: 'var(--foreground)',
                                        fontSize: '14px',
                                    }}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <XCircle style={{ width: '16px', height: '16px' }} />
                                    </button>
                                )}
                            </div>
                            )}
                        </div>

                        {/* Tab Pills */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingBottom: '4px' }}>
                            {tabs.map((tab, index) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTab(index)}
                                        style={{
                                            padding: '7px 13px',
                                            background: activeTab === index ? 'var(--primary)' : 'var(--secondary)',
                                            color: activeTab === index ? 'white' : 'var(--foreground)',
                                            border: `1px solid ${activeTab === index ? 'var(--primary)' : 'var(--card-border)'}`,
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            fontSize: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.2s ease',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (activeTab !== index) {
                                                e.currentTarget.style.borderColor = 'var(--primary)';
                                                e.currentTarget.style.background = 'var(--card-bg)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (activeTab !== index) {
                                                e.currentTarget.style.borderColor = 'var(--card-border)';
                                                e.currentTarget.style.background = 'var(--secondary)';
                                            }
                                        }}
                                    >
                                        <Icon style={{ width: '14px', height: '14px' }} />
                                        {tab.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    {/* Tab 1: Makale (Guides) */}
                    {activeTab === 0 && (
                        <div>
                            {/* Sayfa bilgisi */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                    Toplam <strong style={{ color: 'var(--foreground)' }}>{filteredGuides.length}</strong> makale
                                    {totalGuidePages > 1 && <> · Sayfa <strong style={{ color: 'var(--foreground)' }}>{guidePage}/{totalGuidePages}</strong></>}
                                </p>
                                {searchQuery && <button onClick={() => setSearchQuery('')} style={{ fontSize: '12px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Aramayı Temizle</button>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                            {paginatedGuides.map((guide) => (
                                <Link key={guide.id} href={`/makale/${createSlug(guide.title)}--${(guide as any).urlId}`} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        height: '100%'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--card-border)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}>
                                        {/* Header */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <BookOpen size={24} color="white" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                                                    <span style={{
                                                        padding: '4px 10px',
                                                        background: 'var(--background)',
                                                        border: '1px solid var(--border-subtle)',
                                                        color: 'var(--foreground)',
                                                        fontSize: '11px',
                                                        borderRadius: '6px',
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <Clock style={{ width: '12px', height: '12px', color: 'var(--text-muted)' }} />
                                                        {guide.minutes} dk
                                                    </span>
                                                    <span style={{
                                                        padding: '4px 10px',
                                                        background: 'var(--background)',
                                                        border: `1px solid ${getDifficultyColor(guide.difficulty)}`,
                                                        color: getDifficultyColor(guide.difficulty),
                                                        fontSize: '11px',
                                                        borderRadius: '6px',
                                                        fontWeight: '700'
                                                    }}>
                                                        {guide.difficulty}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            color: 'var(--foreground)',
                                            marginBottom: '12px',
                                            lineHeight: '1.4',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {guide.title}
                                        </h3>

                                        {/* Description */}
                                        <p style={{
                                            fontSize: '14px',
                                            color: 'var(--text-muted)',
                                            lineHeight: '1.6',
                                            marginBottom: '16px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {guide.description}
                                        </p>

                                        {/* Tags */}
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {guide.tags.slice(0, 3).map((tag, idx) => (
                                                <span key={idx} style={{
                                                    padding: '4px 10px',
                                                    background: 'var(--secondary)',
                                                    border: '1px solid var(--card-border)',
                                                    borderRadius: '6px',
                                                    fontSize: '11px',
                                                    color: 'var(--text-muted)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}>
                                                    <Tag style={{ width: '10px', height: '10px' }} />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            </div>

                            {/* Pagination */}
                            {totalGuidePages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => { setGuidePage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        disabled={guidePage === 1}
                                        style={{ padding: '10px 18px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontSize: '14px', fontWeight: '600', cursor: guidePage === 1 ? 'not-allowed' : 'pointer', opacity: guidePage === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <ChevronLeft size={16} /> Önceki
                                    </button>
                                    {(() => {
                                        const pages: (number | string)[] = [];
                                        if (totalGuidePages <= 7) {
                                            for (let i = 1; i <= totalGuidePages; i++) pages.push(i);
                                        } else {
                                            pages.push(1);
                                            if (guidePage > 3) pages.push('...');
                                            for (let i = Math.max(2, guidePage - 1); i <= Math.min(totalGuidePages - 1, guidePage + 1); i++) pages.push(i);
                                            if (guidePage < totalGuidePages - 2) pages.push('...');
                                            pages.push(totalGuidePages);
                                        }
                                        return pages.map((page, idx) =>
                                            typeof page === 'string' ? (
                                                <span key={`d${idx}`} style={{ padding: '10px 4px', color: 'var(--text-muted)', fontSize: '14px' }}>...</span>
                                            ) : (
                                                <button key={page} onClick={() => { setGuidePage(page as number); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    style={{ padding: '10px 14px', minWidth: '42px', background: guidePage === page ? 'var(--primary)' : 'var(--card-bg)', border: guidePage === page ? '1px solid var(--primary)' : '1px solid var(--card-border)', borderRadius: '10px', color: guidePage === page ? 'white' : 'var(--foreground)', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
                                                >{page}</button>
                                            )
                                        );
                                    })()}
                                    <button
                                        onClick={() => { setGuidePage(p => Math.min(totalGuidePages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        disabled={guidePage === totalGuidePages}
                                        style={{ padding: '10px 18px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontSize: '14px', fontWeight: '600', cursor: guidePage === totalGuidePages ? 'not-allowed' : 'pointer', opacity: guidePage === totalGuidePages ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        Sonraki <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: İlginç (Interesting Facts) */}
                    {activeTab === 1 && filteredInteresting && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {getMythBustersSchema() && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: getMythBustersSchema()! }} />}
                            {/* Daily Tips */}
                            {filteredInteresting.dailyTips.length > 0 && <SectionCarousel title="Günlük İpuçları" icon={<Lightbulb color="#F59E0B" />}>
                                {filteredInteresting.dailyTips.map((tip: DailyTip) => (
                                    <Link key={tip.id} href={`/kutuphane/ilginc/${createSlug(tip.title)}--${tip.id}`} style={{ textDecoration: 'none', minWidth: '280px', flex: '0 0 auto', scrollSnapAlign: 'start', display: 'block' }}>
                                        <div style={{
                                            background: 'var(--card-bg)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '14px',
                                            padding: '20px',
                                            height: '100%',
                                            transition: 'border-color 0.2s, transform 0.2s',
                                        }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                                        >
                                            <div style={{ marginBottom: '12px' }}><Lightbulb size={32} color="var(--primary)" /></div>
                                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>{tip.title}</h4>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{tip.tip}</p>
                                            <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><ExternalLink size={11} /> Detaylı İncele</div>
                                        </div>
                                    </Link>
                                ))}
                            </SectionCarousel>}

                            {/* Checklists */}
                            {filteredInteresting.checklists.length > 0 && <SectionCarousel title="Kontrol Listeleri" icon={<CheckCircle color="#43E97B" />}>
                                {filteredInteresting.checklists.map((checklist: any) => (
                                    <Link key={checklist.id} href={`/kutuphane/ilginc/${createSlug(checklist.title)}--${checklist.id}`} style={{ textDecoration: 'none', minWidth: '350px', flex: '0 0 auto', scrollSnapAlign: 'start', display: 'block' }}>
                                        <div style={{
                                            background: 'var(--card-bg)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '14px',
                                            padding: '20px',
                                            height: '100%',
                                            transition: 'border-color 0.2s',
                                        }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '10px',
                                                    background: `linear-gradient(135deg, ${checklist.gradient[0]}, ${checklist.gradient[1]})`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <CheckCircle size={20} color="white" />
                                                </div>
                                                <div style={{ textAlign: 'left' }}>
                                                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>{checklist.title}</h4>
                                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{checklist.items.length} kontrol maddesi</p>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><ExternalLink size={11} /> Listeyi İncele</div>
                                        </div>
                                    </Link>
                                ))}
                            </SectionCarousel>}

                            {/* Do & Don't */}
                            {filteredInteresting.doAndDont.length > 0 && <SectionCarousel title="Yap & Yapma" icon={<ThumbsUp color="#3B82F6" />}>
                                {filteredInteresting.doAndDont.map((item: DoAndDontData) => (
                                    <Link key={item.id} href={`/kutuphane/ilginc/${createSlug(item.title)}--${item.id}`} style={{ textDecoration: 'none', minWidth: '400px', flex: '0 0 auto', scrollSnapAlign: 'start', display: 'block' }}>
                                        <div style={{
                                            background: 'var(--card-bg)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '14px',
                                            padding: '24px',
                                            height: '100%',
                                            transition: 'border-color 0.2s',
                                        }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'}
                                        >
                                            <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '20px' }}>{item.title}</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                        <ThumbsUp style={{ width: '16px', height: '16px', color: '#43E97B' }} />
                                                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#43E97B' }}>Yap</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <span style={{ color: '#43E97B' }}>✓</span>
                                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.do.points[0]}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                        <ThumbsDown style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                                                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#EF4444' }}>Yapma</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <span style={{ color: '#EF4444' }}>✗</span>
                                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.dont.points[0]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><ExternalLink size={11} /> Detaylı İncele</div>
                                        </div>
                                    </Link>
                                ))}
                            </SectionCarousel>}

                            {/* Quick Facts */}
                            {filteredInteresting.quickFacts.length > 0 && <SectionCarousel title="Hızlı Bilgiler" icon={<Zap color="#F59E0B" />}>
                                {filteredInteresting.quickFacts.map((fact: QuickFactData) => (
                                    <Link key={fact.id} href={`/kutuphane/ilginc/${createSlug(fact.text.slice(0, 40))}--${fact.id}`} style={{ textDecoration: 'none', minWidth: '300px', flex: '0 0 auto', scrollSnapAlign: 'start', display: 'block' }}>
                                        <div style={{
                                            background: 'var(--card-bg)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            display: 'flex',
                                            gap: '12px',
                                            height: '100%',
                                            transition: 'border-color 0.2s',
                                        }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'}
                                        >
                                            <Zap style={{ width: '20px', height: '20px', color: 'var(--primary)', flexShrink: 0 }} />
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{fact.text}</p>
                                        </div>
                                    </Link>
                                ))}
                                </SectionCarousel>}

                            {/* Myth Busters */}
                            {filteredInteresting.mythBusters.length > 0 && <SectionCarousel title="Mit Kırıcılar" icon={<ShieldAlert color="#EF4444" />}>
                                {filteredInteresting.mythBusters.map((myth: MythBuster) => (
                                    <Link key={myth.id} href={`/kutuphane/ilginc/${createSlug(myth.myth)}--${myth.id}`} style={{ textDecoration: 'none', minWidth: '350px', flex: '0 0 auto', scrollSnapAlign: 'start', display: 'block' }}>
                                        <div style={{
                                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                                            border: '1px solid rgba(239,68,68,0.4)',
                                            borderRadius: '14px',
                                            padding: '20px',
                                            height: '100%',
                                            transition: 'border-color 0.2s',
                                        }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#EF4444'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.4)'}
                                        >
                                            <div style={{ display: 'flex', gap: '16px' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                        <XCircle style={{ width: '18px', height: '18px', color: '#EF4444' }} />
                                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#EF4444', textTransform: 'uppercase' }}>Yanlış İnanış</span>
                                                    </div>
                                                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>{myth.myth}</p>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                        <CheckCircle style={{ width: '18px', height: '18px', color: '#43E97B' }} />
                                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#43E97B', textTransform: 'uppercase' }}>Gerçek</span>
                                                    </div>
                                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{myth.truth}</p>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '10px', fontSize: '11px', color: '#EF4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><ExternalLink size={11} /> Detaylı İncele</div>
                                        </div>
                                    </Link>
                                ))}
                                </SectionCarousel>}

                            {/* No Results */}
                            {Object.values(filteredInteresting).every((arr: any) => arr.length === 0) && (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    <Lightbulb style={{ width: '48px', height: '48px', opacity: 0.5, marginBottom: '10px' }} />
                                    <p>Bu arama için İlginç bilgi bulunamadı.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 3: Sözlük */}
                    {activeTab === 2 && (
                        <div>
                            {/* Dictionary Search Box */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    background: 'var(--card-bg)', border: '2px solid var(--primary)',
                                    borderRadius: '16px', padding: '12px 20px',
                                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
                                }}>
                                    <Search style={{ width: '24px', height: '24px', color: 'var(--primary)' }} />
                                    <input
                                        type="text"
                                        placeholder="Otomotiv sözlüğünde terim ara... (Örn: Ekspertiz, Tramer, Rot)"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            flex: 1, background: 'transparent', border: 'none',
                                            outline: 'none', color: 'var(--foreground)',
                                            fontSize: '16px', fontWeight: '500'
                                        }}
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            style={{
                                                background: 'var(--secondary)', border: 'none',
                                                borderRadius: '50%', width: '32px', height: '32px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', color: 'var(--text-muted)'
                                            }}
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {!searchQuery && (
                                <div style={{
                                    position: 'sticky', top: '60px', background: 'var(--background)',
                                    zIndex: 10, padding: '16px 0', marginBottom: '24px',
                                    borderBottom: '1px solid var(--card-border)'
                                }}>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {allLetters.map((letter) => (
                                            <button
                                                key={letter}
                                                onClick={() => setSelectedLetter(letter)}
                                                style={{
                                                    width: '40px', height: '40px', borderRadius: '10px',
                                                    background: selectedLetter === letter ? 'var(--primary)' : 'var(--secondary)',
                                                    color: selectedLetter === letter ? 'white' : 'var(--foreground)',
                                                    border: `1px solid ${selectedLetter === letter ? 'var(--primary)' : 'var(--card-border)'}`,
                                                    cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => { if (selectedLetter !== letter) { e.currentTarget.style.background = 'var(--card-bg)'; e.currentTarget.style.borderColor = 'var(--primary)'; } }}
                                                onMouseLeave={(e) => { if (selectedLetter !== letter) { e.currentTarget.style.background = 'var(--secondary)'; e.currentTarget.style.borderColor = 'var(--card-border)'; } }}
                                            >
                                                {letter}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {filteredDictionary.length > 0 ? (
                                    filteredDictionary.map((term) => (
                                        <div key={term.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '24px', transition: 'all 0.2s ease' }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 20px var(--primary-glow)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
                                                <div style={{
                                                    width: '50px', height: '50px', borderRadius: '12px',
                                                    background: `${categoryColors[term.category]}20`,
                                                    border: `2px solid ${categoryColors[term.category]}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '24px', fontWeight: '800', color: categoryColors[term.category], flexShrink: 0
                                                }}>
                                                    {term.letter}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>{term.term}</h3>
                                                        <span style={{ padding: '4px 10px', background: `${categoryColors[term.category]}20`, color: categoryColors[term.category], fontSize: '11px', borderRadius: '6px', fontWeight: '600' }}>
                                                            {term.category}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>{term.description}</p>
                                                    <div style={{ padding: '16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', marginBottom: '14px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                            <TrendingUp style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                                                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>Neden Önemli?</span>
                                                        </div>
                                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{term.why}</p>
                                                    </div>
                                                    <Link href={`/sozluk/${term.id}`} style={{ textDecoration: 'none' }}>
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                            padding: '8px 16px', fontSize: '13px', fontWeight: '600',
                                                            background: `${categoryColors[term.category]}15`,
                                                            border: `1px solid ${categoryColors[term.category]}30`,
                                                            borderRadius: '8px', cursor: 'pointer',
                                                            color: categoryColors[term.category],
                                                        }}>
                                                            <ExternalLink size={13} /> Detay Sayfası
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        <BookMarked style={{ width: '48px', height: '48px', opacity: 0.5, marginBottom: '10px' }} />
                                        <p>Bu arama için sonuç bulunamadı.</p>
                                    </div>
                                )}

                            </div>
                        </div>
                    )}

                    {/* Tab 4: OBD */}
                    {activeTab === 3 && (
                        <ObdSection />
                    )}

                    {/* Tab 5: Göstergeler */}
                    {activeTab === 4 && (
                        <GostergeSection />
                    )}

                    {/* Tab 6: Trafik Cezaları */}
                    {activeTab === 5 && (
                        <div
                            onCopy={(e: React.SyntheticEvent) => { e.preventDefault(); }}
                            onContextMenu={(e: React.SyntheticEvent) => { e.preventDefault(); }}
                            style={{ position: 'relative', userSelect: 'none', WebkitUserSelect: 'none' }}
                        >
                            <div aria-hidden="true" style={{
                                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0,
                                overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: 0,
                            }}>
                                {[...Array(15)].map((_, i) => (
                                    <span key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: '900', color: 'rgba(59,130,246,0.035)', whiteSpace: 'nowrap', transform: 'rotate(-30deg)', letterSpacing: '6px', userSelect: 'none', pointerEvents: 'none' }}>OTO SÖZ</span>
                                ))}
                            </div>
                            <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                                    <div>
                                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', margin: '0 0 4px 0' }}>2026 Trafik Cezaları</h2>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Güncel ceza tutarları, ehliyet yaptırımları ve araç men durumları</p>
                                    </div>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.3px' }}>
                                        © Otosöz • Kopyalanamaz
                                    </span>
                                </div>
                            </div>
                            {trafikCezalariData.categories.map((section, sIdx) => (
                                <div key={section.id} style={{ marginBottom: '12px', position: 'relative', zIndex: 1, borderRadius: '12px', border: '1px solid var(--card-border)', overflow: 'hidden', background: 'var(--card-bg)' }}>
                                    <div style={{ padding: '9px 16px', background: 'var(--secondary)', borderBottom: '1px solid var(--card-border)' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{section.kategori}</span>
                                    </div>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', minWidth: '700px' }}>
                                            {sIdx === 0 && (
                                                <thead>
                                                    <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                                                        {['İhlal Türü', 'Ceza Tutarı', 'Ehliyet / Puan', 'Araç Men'].map((h, i) => (
                                                            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap', width: i === 0 ? '40%' : i === 1 ? '20%' : i === 2 ? '25%' : '15%' }}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                            )}
                                            <tbody>
                                                {section.rows.map((row, idx) => (
                                                    <tr key={idx}
                                                        style={{ borderBottom: idx < section.rows.length - 1 ? '1px solid var(--card-border)' : 'none', transition: 'background 0.1s' }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                                    >
                                                        <td style={{ padding: '11px 16px', fontSize: '13px', color: 'var(--foreground)', fontWeight: '400', lineHeight: '1.4', width: '40%' }}>
                                                            <Link href={`/trafik-cezasi/${row.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                                                                {row.madde && (
                                                                    <span style={{ padding: '2px 6px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '6px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                                                        {row.madde}
                                                                    </span>
                                                                )}
                                                                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                                                                    {row.ihlal}
                                                                </span>
                                                            </Link>
                                                        </td>
                                                        <td style={{ padding: '11px 16px', fontSize: '13px', color: 'var(--foreground)', fontWeight: '600', whiteSpace: 'nowrap', width: '20%' }}>{row.ceza}</td>
                                                        <td style={{ padding: '11px 16px', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', width: '25%' }}>{row.ehliyet}</td>
                                                        <td style={{ padding: '11px 16px', width: '15%' }}>
                                                            <span style={{ padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: '600', background: row.arac === 'Yok' ? 'var(--secondary)' : 'rgba(59,130,246,0.1)', color: row.arac === 'Yok' ? 'var(--text-muted)' : '#60A5FA', border: '1px solid ' + (row.arac === 'Yok' ? 'var(--card-border)' : 'rgba(59,130,246,0.25)'), whiteSpace: 'nowrap' }}>{row.arac}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                            <div style={{ marginTop: '8px', padding: '12px 16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
                                <span style={{ fontSize: '14px', opacity: 0.5 }}>•</span>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                                    Bu tablo <strong style={{ color: 'var(--foreground)', fontWeight: '600' }}>Otosöz</strong> tarafından 2026 yılı güncel mevzuatı kapsamında hazırlanmıştır. Kesin bilgi için yetkili makamlara başvurunuz.
                                </p>
                            </div>
                            
                            {/* e-Devlet Sorgulama Linki */}
                            <a href="https://www.turkiye.gov.tr/emniyet-arac-plakasina-yazilan-ceza-sorgulama?hizmet=Ekrani" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', padding: '16px', background: 'var(--primary)', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', position: 'relative', zIndex: 1, boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)' }}>
                                <ExternalLink size={20} /> e-Devlet'ten Trafik Cezası Sorgula
                            </a>
                        </div>
                    )}

                    {/* Tab 7: Lastik Rehberi */}
                    {activeTab === 6 && (
                        <LastikRehberiSection />
                    )}

                    {/* Tab 8: İkinci El */}
                    {activeTab === 7 && (
                        <IkinciElSection />
                    )}

                    {/* Tab 9: Kaza & İlk Yardım */}
                    {activeTab === 8 && (
                        <KazaIlkYardimSection />
                    )}

                    {/* Tab 10: Mevsimsel Bakım */}
                    {activeTab === 9 && (
                        <MevsimselBakimSection />
                    )}

                    {/* Tab 11: Sigorta Rehberi */}
                    {activeTab === 10 && (
                        <SigortaRehberiSection />
                    )}

                    {/* Tab 12: Otoyol Ücretleri */}
                    {activeTab === 11 && (
                        <OtoyolUcretleriSection />
                    )}

                    {/* Tab 13: Bakım Zamanları */}
                    {activeTab === 12 && (
                        <BakimZamanlariSection />
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
