"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dictionaryTerms, getAllLetters, categoryColors } from "@/data/dictionary";
import { BookOpen, Lightbulb, BookMarked, Clock, Tag, TrendingUp, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, CheckCircle, XCircle, Search, Wrench, AlertTriangle, ChevronLeft, ChevronRight, ShieldAlert, Zap } from "lucide-react";
import Link from "next/link";
import ObdSection from "./obd-section";
import GostergeSection from "./gosterge-section";
import LastikRehberiSection from "./lastik-rehberi-section";
import IkinciElSection from "./ikinci-el-section";
import KazaIlkYardimSection from "./kaza-ilkyardim-section";
import MevsimselBakimSection from "./mevsimsel-bakim-section";
import SigortaRehberiSection from "./sigorta-rehberi-section";

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
    const [activeTab, setActiveTab] = useState(0);
    const [guides, setGuides] = useState<GuideDetail[]>([]);
    const [interestingData, setInterestingData] = useState<any>(null);
    const [expandedChecklists, setExpandedChecklists] = useState<Set<string>>(new Set());
    const [selectedLetter, setSelectedLetter] = useState<string>('A');
    const [searchQuery, setSearchQuery] = useState("");

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

    const tabs = [
        { name: 'Makale', icon: BookOpen },
        { name: 'İlginç', icon: Lightbulb },
        { name: 'Sözlük', icon: BookMarked },
        { name: 'OBD', icon: Wrench },
        { name: 'Göstergeler', icon: AlertTriangle },
        { name: 'Trafik Cezaları', icon: ShieldAlert },
        { name: 'Lastik Rehberi', icon: TrendingUp },
        { name: 'İkinci El', icon: CheckCircle },
        { name: 'Kaza & İlk Yardım', icon: ShieldAlert },
        { name: 'Mevsimsel Bakım', icon: Tag },
        { name: 'Sigorta Rehberi', icon: BookMarked },
    ];

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
        if (!searchQuery) return guides;
        const query = searchQuery.toLowerCase();
        return guides.filter(g =>
            g.title.toLowerCase().includes(query) ||
            g.description.toLowerCase().includes(query) ||
            g.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }, [guides, searchQuery]);

    const filteredDictionary = useMemo(() => {
        let terms = dictionaryTerms;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return terms.filter(t =>
                t.term.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query)
            );
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
                                background: 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '12px',
                                minWidth: '250px',
                                flex: '1',
                                maxWidth: '400px',
                            }}>
                                <Search style={{ width: '18px', height: '18px', color: 'rgba(255, 255, 255, 0.5)' }} />
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
                                        color: 'white',
                                        fontSize: '14px',
                                    }}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'rgba(255, 255, 255, 0.5)',
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
                                                e.currentTarget.style.background = 'rgba(255, 107, 0, 0.1)';
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                            {filteredGuides.map((guide) => (
                                <Link key={guide.id} href={`/kutuphane/${guide.id}`} style={{ textDecoration: 'none' }}>
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
                                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 107, 0, 0.15)';
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
                    )}

                    {/* Tab 2: ?İlginç? (Interesting Facts) */}
                    {activeTab === 1 && filteredInteresting && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {/* Daily Tips */}
                            {filteredInteresting.dailyTips.length > 0 && <SectionCarousel title="Günlük İpuçları" icon={<Lightbulb color="#F59E0B" />}>
                                {filteredInteresting.dailyTips.map((tip: DailyTip) => (
                                    <div key={tip.id} style={{
                                        minWidth: '280px', flex: '0 0 auto', scrollSnapAlign: 'start',
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '14px',
                                        padding: '20px'
                                    }}>
                                        <div style={{ marginBottom: '12px' }}><Lightbulb size={32} color="var(--primary)" /></div>
                                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>{tip.title}</h4>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{tip.tip}</p>
                                    </div>
                                ))}
                            </SectionCarousel>}

                            {/* Checklists */}
                            {filteredInteresting.checklists.length > 0 && <SectionCarousel title="Kontrol Listeleri" icon={<CheckCircle color="#43E97B" />}>
                                {filteredInteresting.checklists.map((checklist: any) => {
                                    const isExpanded = expandedChecklists.has(checklist.id);
                                    return (
                                        <div key={checklist.id} style={{
                                            minWidth: '350px', flex: '0 0 auto', scrollSnapAlign: 'start',
                                            background: 'var(--card-bg)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '14px',
                                            overflow: 'hidden'
                                        }}>
                                                <button
                                                    onClick={() => toggleChecklist(checklist.id)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '20px 24px',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        cursor: 'pointer',
                                                        color: 'var(--foreground)'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                                                            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{checklist.title}</h4>
                                                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{checklist.items.length} madde</p>
                                                        </div>
                                                    </div>
                                                    {isExpanded ? <ChevronUp style={{ width: '20px', height: '20px' }} /> : <ChevronDown style={{ width: '20px', height: '20px' }} />}
                                                </button>
                                                {isExpanded && (
                                                    <div style={{ padding: '0 24px 24px 24px' }}>
                                                        <div style={{ height: '1px', background: 'var(--card-border)', marginBottom: '16px' }} />
                                                        <div style={{ display: 'grid', gap: '8px' }}>
                                                            {checklist.items.map((item: any, idx: number) => (
                                                                <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                                                                    <CheckCircle style={{ width: '16px', height: '16px', color: '#43E97B', flexShrink: 0, marginTop: '2px' }} />
                                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </SectionCarousel>}

                            {/* Do & Don't */}
                            {filteredInteresting.doAndDont.length > 0 && <SectionCarousel title="Yap & Yapma" icon={<ThumbsUp color="#3B82F6" />}>
                                {filteredInteresting.doAndDont.map((item: DoAndDontData) => (
                                        <div key={item.id} style={{
                                            minWidth: '400px', flex: '0 0 auto', scrollSnapAlign: 'start',
                                            background: 'var(--card-bg)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '14px',
                                            padding: '24px'
                                        }}>
                                            <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '20px' }}>{item.title}</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                        <ThumbsUp style={{ width: '16px', height: '16px', color: '#43E97B' }} />
                                                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#43E97B' }}>Yap</span>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        {item.do.points.map((point, idx) => (
                                                            <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                                                                <span style={{ color: '#43E97B' }}>✓</span>
                                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{point}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                        <ThumbsDown style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                                                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#EF4444' }}>Yapma</span>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        {item.dont.points.map((point, idx) => (
                                                            <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                                                                <span style={{ color: '#EF4444' }}>✗</span>
                                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{point}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </SectionCarousel>}

                            {/* Quick Facts */}
                            {filteredInteresting.quickFacts.length > 0 && <SectionCarousel title="Hızlı Bilgiler" icon={<Zap color="#F59E0B" />}>
                                {filteredInteresting.quickFacts.map((fact: QuickFactData) => (
                                        <div key={fact.id} style={{
                                            minWidth: '300px', flex: '0 0 auto', scrollSnapAlign: 'start',
                                            background: 'var(--card-bg)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            display: 'flex',
                                            gap: '12px'
                                        }}>
                                            <Zap style={{ width: '20px', height: '20px', color: 'var(--primary)', flexShrink: 0 }} />
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{fact.text}</p>
                                        </div>
                                    ))}
                                </SectionCarousel>}

                            {/* Myth Busters */}
                            {filteredInteresting.mythBusters.length > 0 && <SectionCarousel title="Mit Kırıcılar" icon={<ShieldAlert color="#EF4444" />}>
                                {filteredInteresting.mythBusters.map((myth: MythBuster) => (
                                        <div key={myth.id} style={{
                                            minWidth: '350px', flex: '0 0 auto', scrollSnapAlign: 'start',
                                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                                            border: '1px solid #EF4444',
                                            borderRadius: '14px',
                                            padding: '20px'
                                        }}>
                                            <div style={{ display: 'flex', gap: '16px' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                        <XCircle style={{ width: '18px', height: '18px', color: '#EF4444' }} />
                                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#EF4444', textTransform: 'uppercase' }}>Yanlış</span>
                                                    </div>
                                                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>{myth.myth}</p>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                        <CheckCircle style={{ width: '18px', height: '18px', color: '#43E97B' }} />
                                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#43E97B', textTransform: 'uppercase' }}>Doğru</span>
                                                    </div>
                                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{myth.truth}</p>
                                                </div>
                                            </div>
                                        </div>
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
                                                onMouseEnter={(e) => { if (selectedLetter !== letter) { e.currentTarget.style.background = 'rgba(255, 107, 0, 0.1)'; e.currentTarget.style.borderColor = 'var(--primary)'; } }}
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
                                        <div key={term.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '24px' }}>
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
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>{term.term}</h3>
                                                        <span style={{ padding: '4px 10px', background: `${categoryColors[term.category]}20`, color: categoryColors[term.category], fontSize: '11px', borderRadius: '6px', fontWeight: '600' }}>
                                                            {term.category}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>{term.description}</p>
                                                    <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.1), rgba(0, 212, 255, 0.05))', border: '1px solid rgba(255, 107, 0, 0.3)', borderRadius: '10px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                            <TrendingUp style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                                                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>Neden Önemli?</span>
                                                        </div>
                                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{term.why}</p>
                                                    </div>
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
                            {[
                                { id: 'hiz', kategori: 'HIZ (Şehir İçi)', rows: [
                                    { ihlal: '6 - 45 km/s arası aşım (Kademeli)', ceza: '2.000 - 15.000 TL', ehliyet: '10 - 20 Ceza Puanı', arac: 'Yok' },
                                    { ihlal: '46 - 55 km/s arası aşım', ceza: '20.000 TL', ehliyet: '30 Gün El Koyma', arac: 'Yok' },
                                    { ihlal: '56 - 65 km/s arası aşım', ceza: '25.000 TL', ehliyet: '60 Gün El Koyma', arac: 'Yok' },
                                    { ihlal: '66 km/s ve üzeri aşım', ceza: '30.000 TL', ehliyet: '90 Gün El Koyma', arac: 'Yok' },
                                ]},
                                { id: 'alkol', kategori: 'ALKOL & MADDE', rows: [
                                    { ihlal: 'Alkol Testini Reddetme', ceza: '150.000 TL', ehliyet: '5 Yıl El Koyma', arac: 'Men Edilir' },
                                    { ihlal: 'Alkollü Araç (1. Kez / 0.50 Promil Üstü)', ceza: '25.000 TL', ehliyet: '6 Ay El Koyma', arac: 'Men (Yedek şoför yok)' },
                                    { ihlal: 'Alkollü Araç (3. Kez ve Sonrası)', ceza: '150.000 TL', ehliyet: '5 Yıl El Koyma', arac: 'Kesin Men' },
                                    { ihlal: 'Uyuşturucu Etkisinde Araç', ceza: '150.000 TL', ehliyet: 'Ehliyet İptali', arac: 'Kesin Men' },
                                ]},
                                { id: 'zorbalik', kategori: 'TRAFİK ZORBALIĞI', rows: [
                                    { ihlal: 'Saldırgan Sürüş / Israrlı Takip', ceza: '180.000 TL', ehliyet: '60 Gün El Koyma', arac: '30-60 Gün Men' },
                                    { ihlal: 'Drift Yapmak', ceza: '140.000 TL', ehliyet: '60 Gün El Koyma', arac: '60 Gün Men' },
                                    { ihlal: 'Makas Atmak', ceza: '90.000 TL', ehliyet: '60 Gün El Koyma', arac: 'Yok' },
                                    { ihlal: '"Dur" İhtarına Uymayıp Kaçma', ceza: '200.000 TL', ehliyet: '60 Gün El Koyma', arac: '60 Gün Men' },
                                ]},
                                { id: 'plaka', kategori: 'PLAKA & BELGE', rows: [
                                    { ihlal: 'Sahte Plaka Kullanma', ceza: '140.000 TL', ehliyet: 'Adli Soruşturma', arac: '30 Gün Men' },
                                    { ihlal: 'Plakasını Okunmaz Hale Getirme', ceza: '140.000 TL', ehliyet: 'Tekerde 280.000 TL', arac: '30 Gün Men' },
                                    { ihlal: 'Ehliyetsiz Araç Kullanma', ceza: '40.000 TL', ehliyet: '-', arac: 'Araçtan Men' },
                                    { ihlal: 'Ehliyeti Alınmışken Araç', ceza: '200.000 TL', ehliyet: '+40.000 TL (İşletene)', arac: 'Kesin Men' },
                                ]},
                                { id: 'guvenlik', kategori: 'GÜVENLİK', rows: [
                                    { ihlal: 'Kırmızı Işık (6. Tekrar)', ceza: '80.000 TL', ehliyet: 'Ehliyet İptali', arac: 'Yok' },
                                    { ihlal: 'Cep Telefonu (3. Tekrar+)', ceza: '20.000 TL', ehliyet: '30 Gün El Koyma', arac: 'Yok' },
                                    { ihlal: 'Emniyet Şeridi İhlali', ceza: '11.631 TL', ehliyet: '20 Ceza Puanı', arac: 'Yok' },
                                    { ihlal: 'Ters Yönde Araç (Otoyol)', ceza: '90.000 TL', ehliyet: '60 Gün El Koyma', arac: 'Men Edilir' },
                                    { ihlal: 'Yayaya Yol Vermemek', ceza: '5.661 TL', ehliyet: '20 Ceza Puanı', arac: 'Yok' },
                                    { ihlal: 'Çocuk Koltuğu Kullanmamak', ceza: '5.000 TL', ehliyet: '10 Ceza Puanı', arac: 'Yok' },
                                ]},
                                { id: 'park', kategori: 'PARK & SİGORTA', rows: [
                                    { ihlal: 'Trafik Sigortasız Gezmek', ceza: '1.246 TL', ehliyet: '-', arac: 'Anında Men' },
                                    { ihlal: 'Muayenesiz Araçla Trafiğe Çıkma', ceza: '2.719 TL', ehliyet: '10 Ceza Puanı', arac: 'İzin Belgesi' },
                                    { ihlal: 'Engelli Park Yerini İşgal', ceza: '2.492 TL', ehliyet: '15 Ceza Puanı', arac: 'Anında Çekilir' },
                                    { ihlal: 'Hatalı Park Etmek', ceza: '1.246 TL', ehliyet: '10 Ceza Puanı', arac: 'Engelse Çekilir' },
                                ]},
                                { id: 'ticari', kategori: 'TİCARİ', rows: [
                                    { ihlal: 'Takograf Veri Müdahalesi', ceza: '185.000 TL', ehliyet: '30-90 Gün El Koyma', arac: 'Yok' },
                                    { ihlal: 'Taksimetre Bulundurmamak', ceza: '46.000 TL', ehliyet: '-', arac: 'Men Edilir' },
                                ]},
                            ].map((section, sIdx) => (
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
                                                        <td style={{ padding: '11px 16px', fontSize: '13px', color: 'var(--foreground)', fontWeight: '400', lineHeight: '1.4', width: '40%' }}>{row.ihlal}</td>
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
                </div>
            </main>

            <Footer />
        </div>
    );
}
