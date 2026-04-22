"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { subscribeToThreads, createThread, formatTimestamp, type ForumThread } from "@/lib/forumService";
import {
    MessageSquare, Eye, Clock, TrendingUp, Search, GitCompare,
    HelpCircle, Users, Tag, ChevronLeft, ChevronRight, Plus, X, Send, LogIn, Sparkles, Car
} from "lucide-react";
import { sampleListings, formatListingPrice } from "@/data/listings";

const CATEGORIES = ["Tümü", "Genel", "Teknik", "Deneyim", "Karşılaştırma", "Uzmana Sor", "Marka", "Alim-Satim"];

export default function ForumPage() {
    const { user } = useAuth();
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("Tumu");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showNewTopicModal, setShowNewTopicModal] = useState(false);
    const [newTopic, setNewTopic] = useState({ title: "", content: "", category: "Genel", tags: "" });
    const [creating, setCreating] = useState(false);
    const [randomListings, setRandomListings] = useState<any[]>([]);
    const threadsPerPage = 8;

    // Firestore'dan realtime thread'leri dinle
    useEffect(() => {
        const unsub = subscribeToThreads((newThreads) => {
            setThreads(newThreads);
            setLoading(false);
        }, 100);
        
        // Rastgele ilanları hazırla
        const shuffled = [...sampleListings].sort(() => 0.5 - Math.random());
        setRandomListings(shuffled.slice(0, 3));
        
        return () => unsub();
    }, []);

    const filteredThreads = threads.filter(thread => {
        const matchesCategory = selectedCategory === "Tumu" || thread.category === selectedCategory;
        const matchesSearch = !searchQuery ||
            thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            thread.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const sortedThreads = [...filteredThreads].sort((a, b) => b.views - a.views);
    const totalPages = Math.ceil(sortedThreads.length / threadsPerPage);
    const startIndex = (currentPage - 1) * threadsPerPage;
    const currentThreads = sortedThreads.slice(startIndex, startIndex + threadsPerPage);

    const handleCategoryChange = (category: string) => { setSelectedCategory(category); setCurrentPage(1); };
    const handleSearchChange = (query: string) => { setSearchQuery(query); setCurrentPage(1); };

    // Yeni konu olustur
    const handleCreateTopic = async () => {
        if (!user || !newTopic.title.trim() || !newTopic.content.trim() || creating) return;
        setCreating(true);
        try {
            const tags = newTopic.tags.split(",").map(t => t.trim()).filter(Boolean);
            const threadId = await createThread({
                title: newTopic.title.trim(),
                category: newTopic.category,
                content: newTopic.content.trim(),
                tags,
                authorId: user.id as string,
                authorUsername: user.username,
            });
            setShowNewTopicModal(false);
            setNewTopic({ title: "", content: "", category: "Genel", tags: "" });
            // Yeni konuya yonlendir
            window.location.href = `/forum/${threadId}`;
        } catch (e) {
            console.error("Konu olusturulamadi:", e);
        }
        setCreating(false);
    };

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px' }}>
                {/* Hero */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.1), rgba(59, 130, 246, 0.1))',
                    borderBottom: '1px solid var(--card-border)', padding: '48px 24px'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), #3b82f6)', marginBottom: '24px'
                        }}>
                            <MessageSquare size={40} color="white" />
                        </div>
                        <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px' }}>
                            Topluluk Forumu
                        </h1>
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 24px' }}>
                            Otomotiv tutkunlariyla deneyimlerinizi paylasin, sorularinizi sorun ve tartismalara katilin
                        </p>
                        {user && user.role !== 'caylak' && (
                            <button
                                onClick={() => setShowNewTopicModal(true)}
                                style={{
                                    padding: '14px 28px', background: 'var(--primary)', color: 'white',
                                    border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700',
                                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    boxShadow: '0 4px 15px var(--primary-glow)', transition: 'all 0.2s',
                                }}
                            >
                                <Plus size={18} /> Yeni Konu Ac
                            </button>
                        )}
                        {user && user.role === 'caylak' && (
                            <div style={{
                                padding: '12px 24px', background: 'rgba(245,158,11,0.1)',
                                border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px',
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                color: '#F59E0B', fontSize: '14px', fontWeight: '600',
                            }}>
                                <Sparkles size={16} /> Baslik acmak icin Usta olmaniz gerekiyor
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                    {/* Quick Access */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        <Link href="/karsilastirma" style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 107, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                    <GitCompare size={24} color="var(--primary)" />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>Arac Karsilastir</h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>İki aracı yan yana koyup detaylı karşılaştırma yapın</p>
                            </div>
                        </Link>
                        <Link href="/uzmana-sor" style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                    <HelpCircle size={24} color="#3b82f6" />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>Uzmana Sor</h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>Otomotiv uzmanlarina sorularinizi sorun ve yanit alin</p>
                            </div>
                        </Link>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
                            border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '16px', padding: '24px'
                        }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                <Users size={24} color="#22c55e" />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>Aktif Topluluk</h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                <strong style={{ color: '#22c55e' }}>{threads.length}</strong> aktif tartisma konusu
                            </p>
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div style={{
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '16px', padding: '24px', marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
                                <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder="Konu veya etiket ara..."
                                    style={{
                                        width: '100%', padding: '12px 12px 12px 44px', background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)', borderRadius: '12px',
                                        color: 'var(--foreground)', fontSize: '14px', outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {CATEGORIES.map(cat => (
                                    <button key={cat} onClick={() => handleCategoryChange(cat)}
                                        style={{
                                            padding: '8px 16px',
                                            background: selectedCategory === cat ? 'var(--primary)' : 'var(--secondary)',
                                            border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                                            borderRadius: '8px',
                                            color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                            fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                    >{cat}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px' }}>
                            <div style={{
                                width: 40, height: 40, border: '3px solid var(--card-border)',
                                borderTop: '3px solid var(--primary)', borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
                            }} />
                            <p style={{ color: 'var(--text-muted)' }}>Konular yukleniyor...</p>
                        </div>
                    ) : (
                        <div className="forum-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                            {/* Left Column: Threads */}
                            <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                                {/* Thread List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {currentThreads.map(thread => {
                                    const isComp = thread.category === "Karsilastirma" || thread.category === "Karşılaştırma";
                                    const isExpert = thread.category === "Uzmana Sor";
                                    const href = isComp ? `/karsilastirma/${thread.id}` : isExpert ? `/uzmana-sor/${thread.id}` : `/forum/${thread.id}`;
                                    return (
                                        <Link key={thread.id}
                                            href={href}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div style={{
                                                background: 'var(--card-bg)',
                                                border: isComp ? '1px solid rgba(255, 107, 53, 0.4)' : isExpert ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid var(--card-border)',
                                                borderRadius: '16px', padding: '24px', cursor: 'pointer',
                                                transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                                            }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = isComp ? 'rgba(255, 107, 53, 0.4)' : isExpert ? 'rgba(59, 130, 246, 0.4)' : 'var(--card-border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                                                    <div style={{ flex: 1, minWidth: '250px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                            <span style={{
                                                                padding: '4px 12px', background: 'rgba(255, 107, 0, 0.1)',
                                                                color: 'var(--primary)', borderRadius: '6px',
                                                                fontSize: '11px', fontWeight: '700', textTransform: 'uppercase'
                                                            }}>{thread.category}</span>
                                                            {thread.views > 50 && (
                                                                <span style={{
                                                                    padding: '4px 8px', background: 'rgba(239, 68, 68, 0.1)',
                                                                    color: '#ef4444', borderRadius: '6px', fontSize: '11px',
                                                                    fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px'
                                                                }}>
                                                                    <TrendingUp size={12} /> POPULER
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                                            {thread.title}
                                                        </h3>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <Users size={14} /> {thread.authorUsername}
                                                            </span>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <Clock size={14} /> {formatTimestamp(thread.createdAt)}
                                                            </span>
                                                        </div>
                                                        {thread.tags.length > 0 && (
                                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                                {thread.tags.slice(0, 4).map(tag => (
                                                                    <span key={tag} style={{
                                                                        padding: '4px 10px', background: 'var(--secondary)',
                                                                        borderRadius: '6px', fontSize: '12px', color: 'var(--text-muted)',
                                                                        display: 'flex', alignItems: 'center', gap: '4px'
                                                                    }}>
                                                                        <Tag size={10} /> {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>{thread.entryCount}</div>
                                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                                                                <MessageSquare size={12} /> Entry
                                                            </div>
                                                        </div>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>{thread.views}</div>
                                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                                                                <Eye size={12} /> Goruntulenme
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Empty State */}
                            {sortedThreads.length === 0 && (
                                <div style={{
                                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                    borderRadius: '16px', padding: '60px 24px', textAlign: 'center'
                                }}>
                                    <MessageSquare size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>
                                        {searchQuery ? "Sonuc Bulunamadi" : "Henuz konu yok"}
                                    </h3>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                                        {searchQuery ? "Farkli bir arama deneyin." : "Ilk konuyu siz acin!"}
                                    </p>
                                    {!searchQuery && user && (
                                        <button onClick={() => setShowNewTopicModal(true)} style={{
                                            padding: '12px 24px', background: 'var(--primary)', color: 'white',
                                            border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px'
                                        }}>
                                            <Plus size={16} /> Yeni Konu Ac
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '32px' }}>
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                        style={{
                                            padding: '10px 16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                            borderRadius: '8px', color: 'var(--foreground)', fontSize: '14px', fontWeight: '600',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1,
                                            display: 'flex', alignItems: 'center', gap: '6px'
                                        }}>
                                        <ChevronLeft size={16} /> Onceki
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button key={page} onClick={() => setCurrentPage(page)}
                                            style={{
                                                padding: '10px 14px',
                                                background: currentPage === page ? 'var(--primary)' : 'var(--card-bg)',
                                                border: currentPage === page ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                                                borderRadius: '8px', color: currentPage === page ? 'white' : 'var(--foreground)',
                                                fontSize: '14px', fontWeight: '600', cursor: 'pointer', minWidth: '40px'
                                            }}>{page}</button>
                                    ))}
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                        style={{
                                            padding: '10px 16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                            borderRadius: '8px', color: 'var(--foreground)', fontSize: '14px', fontWeight: '600',
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1,
                                            display: 'flex', alignItems: 'center', gap: '6px'
                                        }}>
                                        Sonraki <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
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
                            </div>
                        </div>
                    )}
                </div>

                {/* New Topic Modal */}
                {showNewTopicModal && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', zIndex: 1000, padding: '16px',
                    }} onClick={() => setShowNewTopicModal(false)}>
                        <div style={{
                            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                            borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '550px',
                        }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--foreground)' }}>
                                    Yeni Konu Ac
                                </h2>
                                <button onClick={() => setShowNewTopicModal(false)} style={{
                                    background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                                }}>
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Kategori */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Kategori</label>
                                <select value={newTopic.category} onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                                    style={{
                                        width: '100%', padding: '12px 16px', background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)', borderRadius: '10px',
                                        color: 'var(--foreground)', fontSize: '14px', outline: 'none',
                                    }}>
                                    {["Genel", "Teknik", "Deneyim", "Karsilastirma", "Marka", "Alim-Satim"].map(c => (
                                        <option key={c} value={c}>{c === "Karsilastirma" ? "Karşılaştırma" : c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Baslik */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Baslik <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input type="text" value={newTopic.title} onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                                    placeholder="Konunuzun basligini yazin..."
                                    style={{
                                        width: '100%', padding: '12px 16px', background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)', borderRadius: '10px',
                                        color: 'var(--foreground)', fontSize: '14px', outline: 'none',
                                    }}
                                />
                            </div>

                            {/* Icerik */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Icerik <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <textarea value={newTopic.content} onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                                    placeholder="Ilk entry'nizi yazin..."
                                    rows={4}
                                    style={{
                                        width: '100%', padding: '12px 16px', background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)', borderRadius: '10px',
                                        color: 'var(--foreground)', fontSize: '14px', outline: 'none', resize: 'none',
                                    }}
                                />
                            </div>

                            {/* Etiketler */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Etiketler (virgul ile ayirin)
                                </label>
                                <input type="text" value={newTopic.tags} onChange={(e) => setNewTopic({ ...newTopic, tags: e.target.value })}
                                    placeholder="BMW, Motor, Tamir"
                                    style={{
                                        width: '100%', padding: '12px 16px', background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)', borderRadius: '10px',
                                        color: 'var(--foreground)', fontSize: '14px', outline: 'none',
                                    }}
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => setShowNewTopicModal(false)} style={{
                                    flex: 1, padding: '14px', background: 'var(--secondary)', border: '1px solid var(--card-border)',
                                    borderRadius: '10px', color: 'var(--foreground)', fontWeight: '500', cursor: 'pointer', fontSize: '14px',
                                }}>Iptal</button>
                                <button onClick={handleCreateTopic}
                                    disabled={!newTopic.title.trim() || !newTopic.content.trim() || creating}
                                    style={{
                                        flex: 1, padding: '14px',
                                        background: (!newTopic.title.trim() || !newTopic.content.trim()) ? 'var(--secondary)' : 'var(--primary)',
                                        border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600',
                                        cursor: (!newTopic.title.trim() || !newTopic.content.trim()) ? 'not-allowed' : 'pointer',
                                        opacity: (!newTopic.title.trim() || !newTopic.content.trim()) ? 0.5 : 1, fontSize: '14px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    }}>
                                    {creating ? "Olusturuluyor..." : <><Sparkles size={16} /> Paylas</>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
            <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
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
