"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { subscribeToThreads, formatTimestamp, type ForumThread } from "@/lib/forumService";
import { ArrowLeftRight, Plus, Search, Users, Clock, MessageSquare, Eye } from "lucide-react";

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
                            Arac Karsilastirma
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
                                <Plus size={18} /> Yeni Karsilastirma
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
                            <p style={{ color: 'var(--text-muted)' }}>Karsilastirmalar yukleniyor...</p>
                        </div>
                    ) : (
                        <>
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
                                                        }}>Karsilastirma</span>
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
                                        Henuz karsilastirma yok
                                    </h3>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                                        Ilk karsilastirmayi siz olusturun!
                                    </p>
                                    {user && (
                                        <Link href="/karsilastirma/yeni" style={{
                                            padding: '12px 24px', background: 'var(--primary)', color: 'white',
                                            border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            textDecoration: 'none',
                                        }}>
                                            <Plus size={16} /> Yeni Karsilastirma
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
