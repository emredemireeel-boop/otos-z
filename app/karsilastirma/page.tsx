"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { subscribeToThreads, formatTimestamp, type ForumThread } from "@/lib/forumService";
import { ArrowLeftRight, Plus, Search, Users, Clock, MessageSquare, Eye, Award, Sparkles } from "lucide-react";

const VEHICLE_COUNTS = ["Tumu", "2 Arac", "3 Arac", "4 Arac", "5 Arac"];

export default function ComparisonPage() {
    const { user } = useAuth();
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("Tumu");
    const [sortBy, setSortBy] = useState<"popular" | "new">("popular");

    // Firestore'dan Karsilastirma thread'lerini dinle
    useEffect(() => {
        const unsub = subscribeToThreads((allThreads) => {
            const compThreads = allThreads.filter(t => t.category === "Karsilastirma");
            setThreads(compThreads);
            setLoading(false);
        }, 200);
        return () => unsub();
    }, []);

    const filteredThreads = selectedCategory === "Tumu"
        ? threads
        : threads.filter(t => {
            const tagCount = t.tags.filter(tag => tag.startsWith("arac:")).length;
            const num = parseInt(selectedCategory);
            return tagCount === num || t.tags.includes(selectedCategory);
        });

    const sortedThreads = [...filteredThreads].sort((a, b) => {
        if (sortBy === "popular") return b.views - a.views;
        return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
    });

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px' }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #18181b, #3f3f46)',
                    borderBottom: '1px solid var(--card-border)', padding: '48px 24px'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)', marginBottom: '24px'
                        }}>
                            <ArrowLeftRight size={40} color="white" />
                        </div>
                        <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>
                            Araç Karşılaştırma
                        </h1>
                        <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)', maxWidth: '600px', margin: '0 auto 24px' }}>
                            Araclari karsilastirin, toplulukla paylasin ve oy verin
                        </p>
                        {user && (
                            <Link href="/karsilastirma/yeni" style={{
                                padding: '14px 28px', background: 'var(--primary)', color: 'white',
                                border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700',
                                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                                boxShadow: '0 4px 15px var(--primary-glow)', textDecoration: 'none',
                            }}>
                                <Plus size={18} /> Yeni Karşılaştırma
                            </Link>
                        )}
                    </div>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                    {/* Filter & Sort */}
                    <div style={{
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '16px', padding: '24px', marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {VEHICLE_COUNTS.map(cat => (
                                    <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                                        padding: '8px 16px',
                                        background: selectedCategory === cat ? 'var(--primary)' : 'var(--secondary)',
                                        border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                                        borderRadius: '8px',
                                        color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                        fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                                    }}>{cat}</button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => setSortBy("popular")} style={{
                                    padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
                                    border: 'none', cursor: 'pointer',
                                    background: sortBy === "popular" ? 'var(--primary)' : 'var(--secondary)',
                                    color: sortBy === "popular" ? 'white' : 'var(--text-muted)',
                                }}>Populer</button>
                                <button onClick={() => setSortBy("new")} style={{
                                    padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
                                    border: 'none', cursor: 'pointer',
                                    background: sortBy === "new" ? 'var(--primary)' : 'var(--secondary)',
                                    color: sortBy === "new" ? 'white' : 'var(--text-muted)',
                                }}>Yeni</button>
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
                            <p style={{ color: 'var(--text-muted)' }}>Karşılaştırmalar yükleniyor...</p>
                        </div>
                    ) : (
                        <>
                            {/* Reklam Alanı */}
                            <Link href="/iletisim" style={{ textDecoration: 'none', display: 'block', marginBottom: '32px' }}>
                                <div style={{
                                    background: 'var(--secondary)', border: '1px dashed var(--card-border)', borderRadius: '16px',
                                    height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', padding: '20px', textAlign: 'center'
                                }}
                                     onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                                     onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                                        <Sparkles size={20} color="currentColor" />
                                    </div>
                                    <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>Buraya Reklam Ver</h3>
                                    <p style={{ fontSize: '12px', lineHeight: '1.5', margin: 0 }}>Karşılaştırma yapan binlerce kullanıcıya doğrudan ulaşın.</p>
                                </div>
                            </Link>

                            {/* Vitrin Alanı */}
                            {!loading && threads.length > 0 && (
                                <div style={{ marginBottom: '40px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                        <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '8px', borderRadius: '10px' }}>
                                            <Award size={20} color="#fbbf24" />
                                        </div>
                                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>Popüler Karşılaştırmalar</h2>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                                        {sortedThreads.slice(0, 2).map(thread => (
                                            <Link key={`vitrin-${thread.id}`} href={`/karsilastirma/${thread.id}`} style={{ textDecoration: 'none' }}>
                                                <div style={{
                                                    background: 'linear-gradient(145deg, var(--card-bg), rgba(255,255,255,0.02))',
                                                    border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px',
                                                    position: 'relative', overflow: 'hidden', transition: 'all 0.2s', height: '100%',
                                                }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                                >
                                                    <div style={{ position: 'absolute', top: 0, right: 0, background: '#fbbf24', color: 'black', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderBottomLeftRadius: '12px' }}>VİTRİN</div>
                                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px', paddingRight: '60px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{thread.title}</h3>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12}/>{thread.authorUsername}</span>
                                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={12}/>{thread.entryCount}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <div style={{ background: 'rgba(255, 107, 53, 0.1)', padding: '8px', borderRadius: '10px' }}>
                                    <ArrowLeftRight size={20} color="#FF6B35" />
                                </div>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>Tüm Karşılaştırmalar</h2>
                            </div>

                            {/* Thread List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {sortedThreads.map(thread => (
                                    <Link key={thread.id} href={`/karsilastirma/${thread.id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            background: 'var(--card-bg)',
                                            border: '1px solid rgba(255, 107, 53, 0.3)',
                                            borderRadius: '16px', padding: '24px', cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.3)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                                <div style={{ flex: 1, minWidth: '250px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                        <span style={{
                                                            padding: '4px 12px', background: 'rgba(255, 107, 0, 0.1)',
                                                            color: '#FF6B35', borderRadius: '6px',
                                                            fontSize: '11px', fontWeight: '700', textTransform: 'uppercase'
                                                        }}>Karşılaştırma</span>
                                                    </div>
                                                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                                        {thread.title}
                                                    </h3>
                                                    {thread.description && (
                                                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {thread.description}
                                                        </p>
                                                    )}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Users size={14} /> {thread.authorUsername}
                                                        </span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Clock size={14} /> {formatTimestamp(thread.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B35' }}>{thread.entryCount}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <MessageSquare size={12} /> Entry
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>{thread.views}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Eye size={12} /> Goruntulenme
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Empty State */}
                            {sortedThreads.length === 0 && (
                                <div style={{
                                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                    borderRadius: '16px', padding: '60px 24px', textAlign: 'center'
                                }}>
                                    <ArrowLeftRight size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>
                                        Henüz karşılaştırma yok
                                    </h3>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                                        İlk karşılaştırmayı siz oluşturun!
                                    </p>
                                    {user && (
                                        <Link href="/karsilastirma/yeni" style={{
                                            padding: '12px 24px', background: 'var(--primary)', color: 'white',
                                            border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            textDecoration: 'none',
                                        }}>
                                            <Plus size={16} /> Yeni Karşılaştırma
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>


            </main>
            <Footer />
            <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
