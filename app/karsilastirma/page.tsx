"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { subscribeToThreads, formatTimestamp, type ForumThread } from "@/lib/forumService";
import { ArrowLeftRight, Plus, Users, Clock, MessageSquare, Eye, Award, Sparkles, TrendingUp, BarChart3 } from "lucide-react";
import { sampleListings, formatListingPrice, formatKm } from "@/data/listings";

const VEHICLE_COUNTS = ["Tümü", "2 Araç", "3 Araç", "4 Araç", "5 Araç"];

export default function ComparisonPage() {
    const { user } = useAuth();
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
    const [sortBy, setSortBy] = useState<"popular" | "new">("popular");

    useEffect(() => {
        const unsub = subscribeToThreads((allThreads) => {
            setThreads(allThreads.filter(t => t.category === "Karsilastirma"));
            setLoading(false);
        }, 200);
        return () => unsub();
    }, []);

    const filteredThreads = selectedCategory === "Tümü"
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
            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Sub Header — White */}
                <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)', padding: '16px 24px' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>Araç Karşılaştırma</h1>
                                <span style={{ padding: '4px 10px', background: 'var(--secondary)', color: 'var(--text-muted)', fontSize: '11px', borderRadius: '9999px' }}>
                                    {threads.length} Karşılaştırma
                                </span>
                            </div>
                            <Link href="/karsilastirma/yeni" style={{
                                padding: '10px 20px', background: 'var(--primary)', color: 'white',
                                fontWeight: '600', borderRadius: '10px', border: 'none',
                                fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
                            }}>
                                <Plus size={16} /> Yeni Karşılaştırma
                            </Link>
                        </div>
                        <div className="category-pills" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {VEHICLE_COUNTS.map(cat => (
                                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                                    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
                                    whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
                                    background: selectedCategory === cat ? 'var(--primary)' : 'var(--secondary)',
                                    color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                }}>{cat}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3-Column Layout */}
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div className="home-main-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '24px' }}>
                        {/* Left Sidebar */}
                        <aside className="home-left-sidebar">
                            <div style={{ position: 'sticky', top: '100px' }}>
                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>Sıralama</h3>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {[{ id: "popular", label: "Popüler" }, { id: "new", label: "En Yeni" }].map(s => (
                                            <li key={s.id} style={{ marginBottom: '4px' }}>
                                                <button onClick={() => setSortBy(s.id as any)} style={{
                                                    width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                                    background: sortBy === s.id ? 'var(--primary)' : 'transparent',
                                                    color: sortBy === s.id ? 'white' : 'var(--foreground)',
                                                    fontSize: '14px', textAlign: 'left',
                                                }}>{s.label}</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Link href="/iletisim" style={{ textDecoration: 'none', display: 'block' }}>
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
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '60px' }}>
                                    <div style={{ width: 40, height: 40, border: '3px solid var(--card-border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                                    <p style={{ color: 'var(--text-muted)' }}>Karşılaştırmalar yükleniyor...</p>
                                </div>
                            ) : (
                                <>


                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                        <div style={{ background: 'var(--secondary)', border: '1px solid var(--card-border)', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ArrowLeftRight size={20} color="var(--text-muted)" />
                                        </div>
                                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>Tüm Karşılaştırmalar</h2>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {sortedThreads.map(thread => (
                                            <Link key={thread.id} href={`/karsilastirma/${thread.id}`} style={{ textDecoration: 'none' }}>
                                                <div style={{
                                                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                                    borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s',
                                                }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                                            <span style={{ padding: '4px 12px', background: 'rgba(255, 107, 0, 0.1)', color: '#FF6B35', borderRadius: '6px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Karşılaştırma</span>
                                                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', margin: '12px 0 8px' }}>{thread.title}</h3>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {thread.authorUsername}</span>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {formatTimestamp(thread.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>{thread.entryCount}</div>
                                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Entry</div>
                                                            </div>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>{thread.views}</div>
                                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Görüntülenme</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {sortedThreads.length === 0 && (
                                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '60px 24px', textAlign: 'center' }}>
                                            <ArrowLeftRight size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>Henüz karşılaştırma yok</h3>
                                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>İlk karşılaştırmayı siz oluşturun!</p>
                                            <Link href="/karsilastirma/yeni" style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', borderRadius: '10px', fontSize: '14px', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                                <Plus size={16} /> Yeni Karşılaştırma
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <aside className="home-right-sidebar">
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {sortedThreads.length > 0 && (
                                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                            <Award size={16} color="#fbbf24" />
                                            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>Popüler Seçimler</h3>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {sortedThreads.slice(0, 3).map(thread => (
                                                <Link key={`vs-${thread.id}`} href={`/karsilastirma/${thread.id}`} style={{ textDecoration: 'none' }}>
                                                    <div style={{
                                                        background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '12px',
                                                        position: 'relative', transition: 'all 0.2s',
                                                    }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                                                    >
                                                        <div style={{ position: 'absolute', top: 0, right: 0, background: '#fbbf24', color: 'black', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderBottomLeftRadius: '6px' }}>VİTRİN</div>
                                                        <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '6px', paddingRight: '30px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{thread.title}</h3>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={10} />{thread.authorUsername}</span>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={10} />{thread.entryCount}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <BarChart3 size={14} /> İstatistikler
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ padding: '12px', background: 'var(--secondary)', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>{threads.length}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Toplam Karşılaştırma</div>
                                        </div>
                                        <div style={{ padding: '12px', background: 'var(--secondary)', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>{threads.reduce((a, t) => a + t.views, 0)}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Toplam Görüntülenme</div>
                                        </div>
                                    </div>
                                </div>
                                <Link href="/iletisim" style={{ textDecoration: 'none', display: 'block' }}>
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
                                        <p style={{ fontSize: '12px', lineHeight: '1.5', margin: 0 }}>Günde 10.000+ otomotiv tutkununa ulaşın.</p>
                                    </div>
                                </Link>

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
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
            <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
