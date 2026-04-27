"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import {
    getThreadById, getThreadBySlug, subscribeToEntries, addEntry, toggleLike,
    incrementViews, formatTimestamp, subscribeToThreads, getThreadSlugUrl,
    type ForumThread, type ForumEntry
} from "@/lib/forumService";
import { startConversation } from "@/lib/messageService";
import { rateUser } from "@/lib/userService";
import { ThumbsUp, MessageSquare, Clock, User, Send, Eye, ArrowLeft, LogIn, ExternalLink, CheckCircle, Car, Sparkles, Flag, Star, ChevronLeft, ChevronRight, TrendingUp, ArrowUp, Flame, AlertTriangle, Plus, X, ShieldCheck } from "lucide-react";
import { sampleListings, formatListingPrice } from "@/data/listings";
import AutoLinkText from "@/components/AutoLinkText";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const parseComparisonContent = (text: string) => {
    if (!text.includes("Karsilastirilan Araclar:")) return { description: text, vehicles: [] };
    
    const parts = text.split("Karsilastirilan Araclar:");
    const description = parts[0].trim();
    const vehiclesText = parts[1].trim();
    
    const vehicles: {name: string, url: string}[] = [];
    vehiclesText.split('\n').forEach(line => {
        const match = line.match(/^(.+?):\s*(https?:\/\/[^\s]+)/);
        if (match) {
            vehicles.push({ name: match[1].trim(), url: match[2].trim() });
        }
    });
    
    return { description, vehicles };
};

export default function ForumThreadPage() {
    const params = useParams();
    const router = useRouter();
    const slugParam = params.id as string;
    const { user } = useAuth();

    const [thread, setThread] = useState<ForumThread | null>(null);
    const [entries, setEntries] = useState<ForumEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [newEntry, setNewEntry] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [likingEntry, setLikingEntry] = useState<string | null>(null);
    const [randomListings, setRandomListings] = useState<any[]>([]);
    const [sidebarAd, setSidebarAd] = useState<any>(null);
    const [reportModal, setReportModal] = useState<{ entry?: ForumEntry; threadTitle: string; reportType: 'entry' | 'thread' } | null>(null);
    const [reportCategory, setReportCategory] = useState('hakaret');
    const [reportNote, setReportNote] = useState('');
    const [reportSending, setReportSending] = useState(false);
    const [reportToast, setReportToast] = useState<string | null>(null);
    const [ratingModal, setRatingModal] = useState<{ userId: string; username: string } | null>(null);
    const [ratingScore, setRatingScore] = useState(0);
    const [hoverScore, setHoverScore] = useState(0);
    const [ratingSending, setRatingSending] = useState(false);
    const [activeUserMenu, setActiveUserMenu] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [popularThreads, setPopularThreads] = useState<ForumThread[]>([]);
    const [sortMode, setSortMode] = useState<'top' | 'new'>('top');
    const [userGarageMap, setUserGarageMap] = useState<Record<string, string>>({});
    const [userRoleMap, setUserRoleMap] = useState<Record<string, string>>({});
    
    const ENTRIES_PER_PAGE = 13;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const viewCounted = useRef(false);

    // Thread yukle (slug--urlId veya eski ID formatini destekler)
    useEffect(() => {
        async function load() {
            // Slug--urlId formatini parse et, fallback olarak eski ID kullan
            const t = await getThreadBySlug(slugParam);
            setThread(t);
            setLoading(false);

            // Goruntuleme sayacini artir (sayfa basina 1 kez)
            if (t && !viewCounted.current) {
                viewCounted.current = true;
                incrementViews(t.id); // Gercek Firestore ID kullan
            }
        }
        load();
        
        // Rastgele ilanları hazırla
        const shuffled = [...sampleListings].sort(() => 0.5 - Math.random());
        setRandomListings(shuffled.slice(0, 3));

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
    }, [slugParam]);

    // Entry'leri realtime dinle (thread yuklendikten sonra gercek ID kullan)
    useEffect(() => {
        if (!thread) return;
        const unsub = subscribeToEntries(thread.id, (newEntries) => {
            setEntries(newEntries);
        });
        return () => unsub();
    }, [thread?.id]);

    // Popular threads (left sidebar)
    useEffect(() => {
        const unsub = subscribeToThreads((threads) => {
            // Sort by entry count and take top 10
            const sorted = [...threads].sort((a, b) => b.entryCount - a.entryCount).slice(0, 10);
            setPopularThreads(sorted);
        }, 50); // Get enough threads to find the most popular
        return () => unsub();
    }, []);

    // Dijital Garaj ve Uzman Rolleri: Kullanıcı bilgilerini Firestore'dan çek
    useEffect(() => {
        if (entries.length === 0) return;
        const uniqueAuthorIds = [...new Set(entries.map(e => e.authorId))];
        const fetchUserData = async () => {
            const newGarageMap: Record<string, string> = {};
            const newRoleMap: Record<string, string> = {};
            for (const uid of uniqueAuthorIds) {
                if (userGarageMap[uid] && userRoleMap[uid]) continue;
                try {
                    const snap = await getDoc(doc(db, "users", uid));
                    if (snap.exists()) {
                        const d = snap.data();
                        if (d.carBrand && !userGarageMap[uid]) {
                            const parts = [d.carYear, d.carBrand, d.carModel].filter(Boolean);
                            newGarageMap[uid] = parts.join(' ');
                        }
                        if (d.role && !userRoleMap[uid]) {
                            newRoleMap[uid] = d.role;
                        }
                    }
                } catch {}
            }
            if (Object.keys(newGarageMap).length > 0) {
                setUserGarageMap(prev => ({ ...prev, ...newGarageMap }));
            }
            if (Object.keys(newRoleMap).length > 0) {
                setUserRoleMap(prev => ({ ...prev, ...newRoleMap }));
            }
        };
        fetchUserData();
    }, [entries]);

    // Reddit tarzı sıralama: OP sabit, geri kalanlar upvote veya tarihe göre
    const sortedEntries = useMemo(() => {
        if (entries.length <= 1) return entries;
        const op = entries[0]; // İlk entry = OP
        const rest = entries.slice(1);
        const sorted = [...rest].sort((a, b) => {
            if (sortMode === 'top') {
                if (b.likes !== a.likes) return b.likes - a.likes;
                // Eşit beğenide yenisi üste
                const ta = a.createdAt?.toMillis?.() || 0;
                const tb = b.createdAt?.toMillis?.() || 0;
                return tb - ta;
            }
            // 'new' mode: en yeni üstte
            const ta = a.createdAt?.toMillis?.() || 0;
            const tb = b.createdAt?.toMillis?.() || 0;
            return tb - ta;
        });
        return [op, ...sorted];
    }, [entries, sortMode]);

    // En iyi cevap (OP hariç, en az 1 upvote)
    const bestAnswerId = useMemo(() => {
        if (entries.length <= 1) return null;
        const rest = entries.slice(1);
        const best = rest.reduce((max, e) => (e.likes > max.likes ? e : max), rest[0]);
        return best && best.likes >= 1 ? best.id : null;
    }, [entries]);

    // Entry gonder
    const handleSubmit = async () => {
        if (!newEntry.trim() || !user || submitting) return;
        setSubmitting(true);
        try {
            await addEntry(thread!.id, {
                authorId: user.id as string,
                username: user.username,
                content: newEntry.trim(),
            });
            setNewEntry("");
            if (textareaRef.current) textareaRef.current.style.height = "auto";
        } catch (e) {
            console.error("Entry gonderilemedi:", e);
        }
        setSubmitting(false);
    };

    // Begeni toggle
    const handleLike = async (entryId: string) => {
        if (!user || likingEntry) return;
        setLikingEntry(entryId);
        try {
            await toggleLike(thread!.id, entryId, user.id as string);
        } catch (e) {
            console.error("Begeni hatasi:", e);
        }
        setLikingEntry(null);
    };

    // Sikayet gonder
    const handleReport = async () => {
        if (!user || !reportModal || reportSending) return;
        setReportSending(true);
        try {
            const isThreadReport = reportModal.reportType === 'thread';
            await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'submit_report',
                    target: isThreadReport ? thread!.id : reportModal.entry!.id,
                    detail: JSON.stringify({
                        type: isThreadReport ? 'thread' : 'entry',
                        targetId: isThreadReport ? thread!.id : reportModal.entry!.id,
                        targetTitle: reportModal.threadTitle,
                        targetAuthor: isThreadReport ? thread!.authorUsername : reportModal.entry!.username,
                        targetContent: isThreadReport ? thread!.title : reportModal.entry!.content.slice(0, 300),
                        reportedBy: user.username,
                        reportedById: user.id,
                        reason: reportCategory,
                        category: reportCategory,
                        note: reportNote,
                        threadId: thread!.id,
                    }),
                    actor: user.username,
                }),
            });
            setReportModal(null);
            setReportNote('');
            setReportCategory('hakaret');
            setReportToast(isThreadReport ? 'Başlık şikâyeti gönderildi. Admin inceleyecek.' : 'Entry şikâyeti gönderildi. Admin inceleyecek.');
            setTimeout(() => setReportToast(null), 3500);
        } catch (e) {
            console.error('Şikayet gonderilemedi:', e);
        }
        setReportSending(false);
    };

    // Puan ver
    const handleRateUser = async () => {
        if (!user || !ratingModal || ratingScore === 0 || ratingSending) return;
        setRatingSending(true);
        try {
            const result = await rateUser(ratingModal.userId, ratingModal.username, user.id as string, ratingScore);
            setReportToast(result.message);
            setTimeout(() => setReportToast(null), 3500);
            setRatingModal(null);
            setRatingScore(0);
        } catch (e) {
            console.error("Puan verilemedi:", e);
        }
        setRatingSending(false);
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: 40, height: 40, border: '3px solid var(--card-border)',
                            borderTop: '3px solid var(--primary)', borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
                        }} />
                        <p style={{ color: 'var(--text-muted)' }}>Konu yukleniyor...</p>
                    </div>
                </main>
                <Footer />
                <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!thread) {
        return (
            <div>
                <Navbar />
                <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--foreground)' }}>404</h1>
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '24px' }}>Konu bulunamadi</p>
                        <Link href="/forum">
                            <button style={{
                                padding: '12px 24px', background: 'var(--primary)',
                                color: 'white', border: 'none', borderRadius: '8px',
                                cursor: 'pointer', fontWeight: '600'
                            }}>
                                Foruma Don
                            </button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const getCategoryStyle = (cat: string) => {
        const c = cat.toLowerCase();
        if (c.includes('uzman')) {
            return {
                gradient: 'linear-gradient(135deg, #006C4C, #00C9B8)', // Plutos Green
                badgeBg: 'rgba(52, 211, 153, 0.2)',
                badgeColor: '#6EE7B7'
            };
        }
        if (c.includes('karşılaştırma') || c.includes('karsilastirma')) {
            return {
                gradient: 'linear-gradient(135deg, #18181b, #3f3f46)', // Dark Zinc/Slate
                badgeBg: 'rgba(161, 161, 170, 0.2)',
                badgeColor: '#D4D4D8'
            };
        }
        if (c.includes('sorun') || c.includes('hata')) {
            return {
                gradient: 'linear-gradient(135deg, #7f1d1d, #991b1b)', // Dark Red
                badgeBg: 'rgba(248, 113, 113, 0.2)',
                badgeColor: '#FCA5A5'
            };
        }
        if (c.includes('ikinci el') || c.includes('pazar') || c.includes('ilan')) {
            return {
                gradient: 'linear-gradient(135deg, #78350f, #9a3412)', // Dark Amber
                badgeBg: 'rgba(251, 146, 60, 0.2)',
                badgeColor: '#FDBA74'
            };
        }
        // Default (Genel vb.) -> Dark Blue
        return {
            gradient: 'linear-gradient(135deg, #0f172a, #1e3a8a)', // Dark Blue
            badgeBg: 'rgba(96, 165, 250, 0.2)',
            badgeColor: '#93C5FD'
        };
    };

    const catStyle = getCategoryStyle(thread.category);

    const structuredData = [
        {
            "@context": "https://schema.org",
            "@type": "DiscussionForumPosting",
            "headline": thread.title,
            "author": {
                "@type": "Person",
                "name": thread.authorUsername
            },
            "interactionStatistic": {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/CommentAction",
                "userInteractionCount": entries.length
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Ana Sayfa",
                    "item": "https://www.otosoz.com/"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Forum",
                    "item": "https://www.otosoz.com/forum"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": thread.title,
                    "item": `https://www.otosoz.com/forum/${slugParam}`
                }
            ]
        }
    ];

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px' }}>
                {/* Header */}
                <div style={{
                    background: catStyle.gradient,
                    borderBottom: '1px solid var(--card-border)',
                    padding: '32px 24px'
                }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '16px' }}>
                            <Link href="/forum" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ArrowLeft size={14} /> Forum
                            </Link>
                            <span>/</span>
                            <span style={{ color: catStyle.badgeColor }}>{thread.category}</span>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <span style={{
                                padding: '4px 12px',
                                background: catStyle.badgeBg,
                                color: catStyle.badgeColor,
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '700',
                                textTransform: 'uppercase'
                            }}>
                                {thread.category}
                            </span>
                        </div>

                        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'white', marginBottom: '16px', lineHeight: 1.3 }}>
                            {thread.title}
                        </h1>

                        {(thread.carBrand || thread.carModel || thread.carYear || thread.carKm) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                {thread.carBrand && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '13px', color: 'white', fontWeight: '600' }}>
                                        <Car size={14} /> {thread.carBrand}
                                    </span>
                                )}
                                {thread.carModel && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '13px', color: 'white', fontWeight: '600' }}>
                                        {thread.carModel}
                                    </span>
                                )}
                                {thread.carYear && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '13px', color: 'white', fontWeight: '600' }}>
                                        {thread.carYear}
                                    </span>
                                )}
                                {thread.carKm && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '13px', color: 'white', fontWeight: '600' }}>
                                        {thread.carKm} km
                                    </span>
                                )}
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={15} />
                                {thread.authorUsername}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={15} />
                                {formatTimestamp(thread.createdAt)}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Eye size={15} />
                                {thread.views} goruntulenme
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MessageSquare size={15} />
                                {entries.length} entry
                            </span>
                        </div>

                        {thread.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                                {thread.tags.map(tag => (
                                    <span key={tag} style={{
                                        padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                                        background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.8)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                    }}>#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Layout */}
                <div className="forum-layout" style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    
                    {/* Left Column: Popular Threads */}
                    <div className="forum-sidebar-left" style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>
                         <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '16px', boxShadow: 'var(--card-shadow)' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
                                 <TrendingUp size={18} color="var(--primary)" />
                                 <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>Gündem</h3>
                             </div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                 {popularThreads.map((pt, idx) => (
                                     <Link href={getThreadSlugUrl(pt)} key={pt.id} style={{ textDecoration: 'none' }}>
                                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }}
                                              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                                                 <span style={{ fontSize: '14px', fontWeight: '800', color: idx < 3 ? 'var(--primary)' : 'var(--text-muted)' }}>{idx + 1}</span>
                                                 <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pt.title}</span>
                                             </div>
                                             <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--secondary)', padding: '2px 6px', borderRadius: '4px' }}>{pt.entryCount}</span>
                                         </div>
                                     </Link>
                                 ))}
                             </div>
                         </div>
                    </div>

                    {/* Middle Column: Entries */}
                    <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                        
                        {entries.length === 0 ? (
                            <div style={{
                                textAlign: 'center', padding: '60px 20px',
                                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                            }}>
                                <MessageSquare size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Henuz entry yok. Ilk entry'yi siz yazin!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Reddit tarzı sıralama sekmeleri */}
                                {entries.length > 1 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginRight: '4px' }}>Sırala:</span>
                                        {([
                                            { key: 'top' as const, label: 'En İyiler', icon: <Flame size={14} /> },
                                            { key: 'new' as const, label: 'En Yeniler', icon: <Clock size={14} /> },
                                        ]).map(tab => (
                                            <button
                                                key={tab.key}
                                                onClick={() => { setSortMode(tab.key); setCurrentPage(1); }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    padding: '6px 14px', borderRadius: '8px',
                                                    fontSize: '13px', fontWeight: '600',
                                                    background: sortMode === tab.key ? 'var(--foreground)' : 'transparent',
                                                    color: sortMode === tab.key ? 'var(--background)' : 'var(--text-muted)',
                                                    border: sortMode === tab.key ? 'none' : '1px solid var(--card-border)',
                                                    cursor: 'pointer', transition: 'all 0.2s',
                                                }}
                                            >
                                                {tab.icon} {tab.label}
                                            </button>
                                        ))}
                                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>{entries.length} cevap</span>
                                    </div>
                                )}
                                {(() => {
                                    const totalPages = Math.ceil(sortedEntries.length / ENTRIES_PER_PAGE);
                                    const startIdx = (currentPage - 1) * ENTRIES_PER_PAGE;
                                    const paginatedEntries = sortedEntries.slice(startIdx, startIdx + ENTRIES_PER_PAGE);
                                    return paginatedEntries.map((entry, idx) => {
                                    const index = startIdx + idx;
                                    const isLiked = user ? entry.likedBy.includes(user.id as string) : false;
                                    const isFirstEntry = index === 0;
                                    const isBestAnswer = entry.id === bestAnswerId;
                                    const isKarsilastirma = thread.category === "Karsilastirma";
                                    const { description, vehicles } = (isFirstEntry && isKarsilastirma) ? parseComparisonContent(entry.content) : { description: entry.content, vehicles: [] };
                                    const garageText = userGarageMap[entry.authorId];
                                    const isExpert = userRoleMap[entry.authorId] === 'usta';

                                    return (
                                        <div key={entry.id} style={{
                                            background: isExpert ? 'linear-gradient(to right, rgba(234,179,8,0.03), transparent)' : 'var(--card-bg)',
                                            border: isExpert ? '1px solid rgba(234, 179, 8, 0.4)' : (isBestAnswer ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid var(--card-border)'),
                                            borderRadius: '16px',
                                            position: 'relative',
                                            transition: 'border-color 0.2s',
                                            boxShadow: isExpert ? '0 4px 20px rgba(234,179,8,0.08)' : (isBestAnswer ? '0 4px 20px rgba(34,197,94,0.08)' : ((isFirstEntry && isKarsilastirma) ? '0 8px 30px rgba(0,0,0,0.04)' : 'none')),
                                            display: 'flex',
                                        }}>
                                            {/* Reddit tarzı sol upvote bar */}
                                            <div style={{
                                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                                padding: '16px 10px', gap: '4px',
                                                background: isFirstEntry ? 'transparent' : 'var(--secondary)',
                                                borderRight: isFirstEntry ? 'none' : '1px solid var(--card-border)',
                                                minWidth: isFirstEntry ? '0px' : '52px',
                                                width: isFirstEntry ? '0px' : '52px',
                                                flexShrink: 0,
                                                borderRadius: isFirstEntry ? '0' : '16px 0 0 16px',
                                            }}>
                                                {!isFirstEntry && (
                                                    <>
                                                        <button
                                                            onClick={() => handleLike(entry.id)}
                                                            disabled={!user || likingEntry === entry.id}
                                                            style={{
                                                                background: 'none', border: 'none', cursor: user ? 'pointer' : 'not-allowed',
                                                                color: isLiked ? '#22c55e' : 'var(--text-muted)',
                                                                padding: '4px', borderRadius: '6px', transition: 'all 0.15s',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            }}
                                                            title="Upvote"
                                                        >
                                                            <ArrowUp size={20} strokeWidth={isLiked ? 3 : 2} />
                                                        </button>
                                                        <span style={{
                                                            fontSize: '15px', fontWeight: '800',
                                                            color: isLiked ? '#22c55e' : (entry.likes > 0 ? 'var(--foreground)' : 'var(--text-muted)'),
                                                        }}>
                                                            {entry.likes}
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Sağ taraf: içerik */}
                                            <div style={{ flex: 1, padding: '24px', minWidth: 0 }}>
                                                {/* Badges: OP / Best Answer */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'absolute', top: '16px', right: '16px' }}>
                                                    {isFirstEntry && (
                                                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', letterSpacing: '0.5px' }}>OP</span>
                                                    )}
                                                    {isBestAnswer && (
                                                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <CheckCircle size={11} /> EN İYİ CEVAP
                                                        </span>
                                                    )}
                                                </div>

                                            {/* Author Info */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', position: 'relative' }}>
                                                <div 
                                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                                                    onClick={() => setActiveUserMenu(activeUserMenu === entry.id ? null : entry.id)}
                                                >
                                                    <div style={{
                                                        width: '40px', height: '40px', borderRadius: '50%',
                                                        background: (isFirstEntry && isKarsilastirma) ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, var(--primary), #3b82f6)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '16px', fontWeight: '700', color: 'white',
                                                        flexShrink: 0,
                                                        boxShadow: (isFirstEntry && isKarsilastirma) ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                                                    }}>
                                                        {entry.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '15px', fontWeight: '700', color: isExpert ? '#eab308' : 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            @{entry.username} 
                                                            {isExpert && (
                                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '10px', background: '#eab308', color: 'white', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                                                                    <ShieldCheck size={10} /> ONAYLI UZMAN
                                                                </span>
                                                            )}
                                                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '2px' }}>▼</span>
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                            {formatTimestamp(entry.createdAt)}
                                                        </div>
                                                        {garageText && (
                                                            <div style={{
                                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                fontSize: '11px', color: 'var(--text-muted)',
                                                                background: 'var(--secondary)',
                                                                border: '1px solid var(--card-border)',
                                                                padding: '2px 8px', borderRadius: '6px', marginTop: '2px',
                                                            }}>
                                                                <Car size={10} /> {garageText}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Author Dropdown Menu */}
                                                {activeUserMenu === entry.id && (
                                                    <div style={{
                                                        position: 'absolute', top: '45px', left: '0', zIndex: 10,
                                                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                                        borderRadius: '12px', padding: '8px', minWidth: '180px',
                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                                    }}>
                                                        <button onClick={() => router.push(`/profil/${entry.username}`)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'transparent', border: 'none', color: 'var(--foreground)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background='var(--secondary)'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
                                                            <User size={14} /> Profili Ziyaret Et
                                                        </button>
                                                        {user && user.id !== entry.authorId && (
                                                            <button onClick={async () => {
                                                                try {
                                                                    const convId = await startConversation(user.id as string, user.username, entry.authorId, entry.username);
                                                                    router.push(`/mesajlar?conv=${convId}`);
                                                                } catch(e) { console.error(e); }
                                                            }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'transparent', border: 'none', color: 'var(--foreground)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background='var(--secondary)'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
                                                                <MessageSquare size={14} /> Mesaj Gönder
                                                            </button>
                                                        )}
                                                        {user && user.id !== entry.authorId && (
                                                            <button onClick={() => { setRatingModal({ userId: entry.authorId, username: entry.username }); setActiveUserMenu(null); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'transparent', border: 'none', color: 'var(--foreground)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background='var(--secondary)'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
                                                                <Star size={14} color="#f59e0b" /> Puan Ver
                                                            </button>
                                                        )}
                                                        {user && user.id !== entry.authorId && (
                                                            <>
                                                                <div style={{ height: '1px', background: 'var(--card-border)', margin: '4px 0' }} />
                                                                <button onClick={() => { setReportModal({ entry, threadTitle: thread.title, reportType: 'entry' }); setActiveUserMenu(null); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background='rgba(239,68,68,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
                                                                    <Flag size={14} /> Entry&apos;yi Şikâyet Et
                                                                </button>
                                                                <button onClick={() => { setReportModal({ threadTitle: thread.title, reportType: 'thread' }); setActiveUserMenu(null); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background='rgba(239,68,68,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background='transparent'}>
                                                                    <AlertTriangle size={14} /> Başlığı Şikâyet Et
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            {description && (
                                                <div style={{
                                                    fontSize: '15px', lineHeight: '1.7',
                                                    color: 'var(--foreground)', marginBottom: vehicles.length > 0 ? '24px' : '16px',
                                                }}>
                                                    <AutoLinkText text={description} style={{ whiteSpace: 'pre-wrap' }} />
                                                </div>
                                            )}

                                            {vehicles.length > 0 && (
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px', padding: '24px', background: 'var(--secondary)', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                                                    {vehicles.map((v, i) => (
                                                        <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }}
                                                             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                                             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                                            <h4 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{v.name}</h4>
                                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                                <a href={v.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '12px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '14px', fontWeight: '700', transition: 'all 0.2s' }}
                                                                   onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--foreground)'; e.currentTarget.style.background = 'var(--card-bg)'; }}
                                                                   onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.background = 'var(--secondary)'; }}>
                                                                    <ExternalLink size={16} /> İlana Git
                                                                </a>
                                                                <button style={{ flex: 1, padding: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '10px', color: '#22c55e', fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                                                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#22c55e'; e.currentTarget.style.color = 'white'; }}
                                                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)'; e.currentTarget.style.color = '#22c55e'; }}>
                                                                    <CheckCircle size={16} /> Oy Ver
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                        {/* Actions - OP entry için basit beğeni gösterimi */}
                                        {isFirstEntry && (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            paddingTop: '16px', borderTop: '1px solid var(--card-border)'
                                        }}>
                                            <button
                                                onClick={() => handleLike(entry.id)}
                                                disabled={!user || likingEntry === entry.id}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    padding: '6px 14px',
                                                    background: isLiked ? 'rgba(34, 197, 94, 0.1)' : 'var(--secondary)',
                                                    border: isLiked ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--card-border)',
                                                    borderRadius: '8px',
                                                    color: isLiked ? '#22c55e' : 'var(--text-muted)',
                                                    fontSize: '13px', fontWeight: '600',
                                                    cursor: user ? 'pointer' : 'not-allowed',
                                                    transition: 'all 0.2s',
                                                    opacity: !user ? 0.5 : 1,
                                                }}
                                            >
                                                <ArrowUp size={14} />
                                                {entry.likes}
                                            </button>
                                        </div>
                                        )}
                                    </div>
                                    </div>
                                );
                            });
                            })()}
                            </div>
                    )}

                    {/* Pagination */}
                    {sortedEntries.length > ENTRIES_PER_PAGE && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                                disabled={currentPage === 1}
                                style={{ padding: '8px 14px', background: currentPage === 1 ? 'var(--secondary)' : 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--foreground)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', opacity: currentPage === 1 ? 0.5 : 1, transition: 'all 0.2s' }}
                            >
                                <ChevronLeft size={16} /> Önceki
                            </button>
                            {Array.from({ length: Math.ceil(sortedEntries.length / ENTRIES_PER_PAGE) }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => { setCurrentPage(page); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                                    style={{ width: '40px', height: '40px', borderRadius: '10px', border: currentPage === page ? '1px solid var(--primary)' : '1px solid var(--card-border)', background: currentPage === page ? 'var(--primary)' : 'var(--card-bg)', color: currentPage === page ? 'white' : 'var(--foreground)', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => { setCurrentPage(p => Math.min(Math.ceil(sortedEntries.length / ENTRIES_PER_PAGE), p + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                                disabled={currentPage === Math.ceil(sortedEntries.length / ENTRIES_PER_PAGE)}
                                style={{ padding: '8px 14px', background: currentPage === Math.ceil(sortedEntries.length / ENTRIES_PER_PAGE) ? 'var(--secondary)' : 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', color: currentPage === Math.ceil(sortedEntries.length / ENTRIES_PER_PAGE) ? 'var(--text-muted)' : 'var(--foreground)', cursor: currentPage === Math.ceil(sortedEntries.length / ENTRIES_PER_PAGE) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', opacity: currentPage === Math.ceil(sortedEntries.length / ENTRIES_PER_PAGE) ? 0.5 : 1, transition: 'all 0.2s' }}
                            >
                                Sonraki <ChevronRight size={16} />
                            </button>
                            <div style={{ width: '100%', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                                Sayfa {currentPage} / {Math.ceil(sortedEntries.length / ENTRIES_PER_PAGE)} • Toplam {sortedEntries.length} entry
                            </div>
                        </div>
                    )}

                    {/* New Entry Form */}
                    <div style={{
                        marginTop: '32px',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '16px',
                        padding: '24px',
                    }}>
                        {user ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: 'var(--primary)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontSize: '14px', fontWeight: '700',
                                    }}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>
                                        Yanit Yaz
                                    </h3>
                                </div>
                                <textarea
                                    ref={textareaRef}
                                    value={newEntry}
                                    onChange={(e) => {
                                        setNewEntry(e.target.value);
                                        // Auto-resize
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                    }}
                                    placeholder="Dusuncelerinizi paylasin..."
                                    style={{
                                        width: '100%', minHeight: '100px', padding: '16px',
                                        background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '12px', color: 'var(--foreground)',
                                        fontSize: '15px', resize: 'none', outline: 'none',
                                        marginBottom: '16px', lineHeight: 1.6,
                                        transition: 'border-color 0.2s',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {newEntry.length} karakter
                                    </span>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!newEntry.trim() || submitting}
                                        style={{
                                            padding: '12px 28px',
                                            background: newEntry.trim() ? 'var(--primary)' : 'var(--card-border)',
                                            color: 'white', border: 'none', borderRadius: '10px',
                                            fontSize: '14px', fontWeight: '700', cursor: newEntry.trim() ? 'pointer' : 'not-allowed',
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            transition: 'all 0.2s',
                                            opacity: submitting ? 0.7 : 1,
                                        }}
                                    >
                                        {submitting ? (
                                            <>
                                                <div style={{
                                                    width: 14, height: 14,
                                                    border: '2px solid rgba(255,255,255,0.3)',
                                                    borderTop: '2px solid white',
                                                    borderRadius: '50%',
                                                    animation: 'spin 0.8s linear infinite',
                                                }} />
                                                Gonderiliyor...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={14} /> Gonder
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <LogIn size={28} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '16px' }}>
                                    Entry yazmak icin giris yapmaniz gerekiyor
                                </p>
                                <Link href="/giris">
                                    <button style={{
                                        padding: '12px 28px', background: 'var(--primary)',
                                        color: 'white', border: 'none', borderRadius: '10px',
                                        fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    }}>
                                        <LogIn size={16} /> Giris Yap
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                    </div>

                    {/* Right Column: Sidebar (Vitrin & Ads) */}
                    <div className="forum-sidebar" style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px', flexShrink: 0 }}>
                        {/* Vitrin Widget */}
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid var(--card-border)', background: 'rgba(255,107,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Car size={18} color="var(--primary)" />
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>Pazar Vitrini</h3>
                            </div>
                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {randomListings.map(listing => (
                                    <Link href="/pazar" key={listing.id} style={{ textDecoration: 'none' }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }}
                                             onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                                             onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px' }}>{listing.brand} {listing.model}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{listing.year} • {listing.km.toLocaleString()} km</div>
                                            </div>
                                            <div style={{ fontSize: '14px', fontWeight: '800', color: '#10B981' }}>
                                                {formatListingPrice(listing.price)}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link href="/pazar" style={{ display: 'block', padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: 'var(--primary)', borderTop: '1px solid var(--card-border)', textDecoration: 'none', background: 'var(--secondary)' }}>
                                Tüm İlanları Gör
                            </Link>
                        </div>
                        
                        {/* Reklam Alani */}
                        {sidebarAd ? (
                            <a href={sidebarAd.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--primary)', borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                    <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'white', fontSize: '10px', padding: '4px 10px', borderBottomLeftRadius: '12px', fontWeight: 'bold' }}>Sponsorlu</div>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '12px' }}>
                                        <Sparkles size={20} />
                                    </div>
                                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px' }}>{sidebarAd.title}</h4>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>{sidebarAd.description}</p>
                                </div>
                            </a>
                        ) : (
                            <Link href="/iletisim" style={{ textDecoration: 'none', display: 'block' }}>
                                <div style={{ 
                                    background: 'var(--secondary)', border: '1px dashed var(--card-border)', borderRadius: '16px', 
                                    height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', padding: '24px', textAlign: 'center'
                                }}
                                     onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                                     onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                        <Sparkles size={24} color="currentColor" />
                                    </div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Buraya Reklam Ver</h3>
                                    <p style={{ fontSize: '13px', lineHeight: '1.5' }}>Günde 10.000+ otomotiv tutkununa markanızı ulaştırın.</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </main>

            <Footer />

            {/* Şikayet Modalı */}
            {reportModal && (
                <>
                    <div onClick={() => setReportModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, backdropFilter: 'blur(2px)' }} />
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '400px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', zIndex: 1200, padding: '28px', animation: 'popIn 0.2s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Flag size={22} color="#EF4444" />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--foreground)' }}>
                                    {reportModal.reportType === 'thread' ? 'Başlığı Şikâyet Et' : 'Entry\'yi Şikâyet Et'}
                                </h3>
                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                                    {reportModal.reportType === 'thread' 
                                        ? `"${reportModal.threadTitle}" başlığı`
                                        : `@${reportModal.entry?.username} kullanıcısının girdisi`
                                    }
                                </p>
                            </div>
                        </div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Şikayet Nedeni</label>
                        <select
                            value={reportCategory}
                            onChange={(e) => setReportCategory(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', outline: 'none', marginBottom: '16px' }}
                        >
                            <option value="hakaret">Hakaret / Küfür</option>
                            <option value="spam">Spam / Bot Aktivitesi</option>
                            <option value="reklam">Reklam / Sponsorlu İçerik</option>
                            <option value="yaniltici">Yanlış / Yanıltıcı Bilgi</option>
                            <option value="taciz">Trollük & Taciz</option>
                            <option value="yasadisi">Yasadışı İçerik</option>
                        </select>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Ek Notlar (opsiyonel)</label>
                        <textarea
                            value={reportNote}
                            onChange={(e) => setReportNote(e.target.value)}
                            rows={3}
                            placeholder="Durumu kısaca açıklayın..."
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', outline: 'none', resize: 'none', marginBottom: '20px' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setReportModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border-subtle)', color: 'var(--foreground)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>İptal</button>
                            <button onClick={handleReport} disabled={reportSending} style={{ flex: 2, padding: '12px', borderRadius: '10px', background: '#EF4444', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: reportSending ? 0.7 : 1 }}>
                                {reportSending ? 'Gönderiliyor...' : 'Şikayet Et'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Puan Verme Modalı */}
            {ratingModal && (
                <>
                    <div onClick={() => setRatingModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, backdropFilter: 'blur(2px)' }} />
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '400px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', zIndex: 1200, padding: '28px', animation: 'popIn 0.2s ease', textAlign: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <Star size={24} color="#F59E0B" fill="#F59E0B" />
                        </div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800', color: 'var(--foreground)' }}>Kullanıcıyı Değerlendir</h3>
                        <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'var(--text-muted)' }}>@{ratingModal.username} için puanınız (Anonim olarak verilecektir)</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoverScore(star)}
                                    onMouseLeave={() => setHoverScore(0)}
                                    onClick={() => setRatingScore(star)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                                        transition: 'transform 0.1s'
                                    }}
                                >
                                    <Star 
                                        size={32} 
                                        color={star <= (hoverScore || ratingScore) ? '#F59E0B' : 'var(--card-border)'} 
                                        fill={star <= (hoverScore || ratingScore) ? '#F59E0B' : 'transparent'} 
                                    />
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setRatingModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border-subtle)', color: 'var(--foreground)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>İptal</button>
                            <button onClick={handleRateUser} disabled={ratingScore === 0 || ratingSending} style={{ flex: 2, padding: '12px', borderRadius: '10px', background: '#F59E0B', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: (ratingScore === 0 || ratingSending) ? 0.7 : 1 }}>
                                {ratingSending ? 'Kaydediliyor...' : 'Puan Ver'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Toast Mesajı */}
            {reportToast && (
                <div style={{ position: 'fixed', bottom: '32px', right: '32px', background: '#10B981', color: 'white', padding: '14px 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', fontWeight: '600', fontSize: '14px', zIndex: 9999, animation: 'slideUp 0.3s ease' }}>
                    {reportToast}
                </div>
            )}

            <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes popIn { from { transform: translate(-50%,-50%) scale(0.9); opacity: 0; } to { transform: translate(-50%,-50%) scale(1); opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @media (max-width: 1024px) {
                    .forum-layout {
                        flex-direction: column !important;
                    }
                    .forum-sidebar {
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
}
