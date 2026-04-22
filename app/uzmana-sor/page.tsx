"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { subscribeToThreads, createThread, formatTimestamp, type ForumThread } from "@/lib/forumService";
import { HelpCircle, Plus, X, Sparkles, Users, Clock, MessageSquare, Eye, Lightbulb, RefreshCw, Award } from "lucide-react";

const CATEGORIES = ["Tumu", "Motor", "Sanziman", "Lastik", "Bakim", "Elektrik", "Fren", "Suspansiyon"];

export default function UzmanaSorPage() {
    const { user } = useAuth();
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("Tumu");
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newQ, setNewQ] = useState({ title: "", content: "", description: "", subCategory: "Motor", tags: "" });
    const [randomFact, setRandomFact] = useState<{ title: string; text: string } | null>(null);

    // Firestore'dan Uzmana Sor thread'lerini dinle
    useEffect(() => {
        const unsub = subscribeToThreads((allThreads) => {
            const expertThreads = allThreads.filter(t => t.category === "Uzmana Sor");
            setThreads(expertThreads);
            setLoading(false);
        }, 200);
        return () => unsub();
    }, []);

    // Random fact
    useEffect(() => {
        fetch('/data/library_guides.json')
            .then(res => res.json())
            .then(data => {
                if (data.guides) {
                    const allTips: { title: string; text: string }[] = [];
                    data.guides.forEach((guide: any) => {
                        guide.sections.forEach((section: any) => {
                            if (section.tip) allTips.push({ title: section.tip.title.replace('\u{1F4A1} ', ''), text: section.tip.text });
                        });
                    });
                    if (allTips.length > 0) setRandomFact(allTips[Math.floor(Math.random() * allTips.length)]);
                }
            }).catch(() => {});
    }, []);

    const filteredThreads = selectedCategory === "Tumu"
        ? threads
        : threads.filter(t => t.tags.includes(selectedCategory));

    const handleCreate = async () => {
        if (!user || !newQ.title.trim() || !newQ.content.trim() || creating) return;
        setCreating(true);
        try {
            const tags = [newQ.subCategory, ...newQ.tags.split(",").map(t => t.trim()).filter(Boolean)];
            const threadId = await createThread({
                title: newQ.title.trim(),
                category: "Uzmana Sor",
                content: newQ.content.trim(),
                description: newQ.description.trim(),
                tags,
                authorId: user.id as string,
                authorUsername: user.username,
            });
            setShowModal(false);
            setNewQ({ title: "", content: "", description: "", subCategory: "Motor", tags: "" });
            window.location.href = `/uzmana-sor/${threadId}`;
        } catch (e) { console.error("Soru olusturulamadi:", e); }
        setCreating(false);
    };

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px' }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #0a3d2e, #1a6b5a)',
                    borderBottom: '1px solid var(--card-border)', padding: '48px 24px'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.25)', marginBottom: '24px'
                        }}>
                            <HelpCircle size={40} color="white" />
                        </div>
                        <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>Uzmana Sor</h1>
                        <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto 24px' }}>
                            Otomotiv uzmanlarından profesyonel cevaplar alın
                        </p>
                        {user && (
                            <button onClick={() => setShowModal(true)} style={{
                                padding: '14px 28px', background: 'var(--primary)', color: 'white',
                                border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700',
                                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                                boxShadow: '0 4px 15px var(--primary-glow)',
                            }}>
                                <Plus size={18} /> Soru Sor
                            </button>
                        )}
                    </div>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                    {/* Filter */}
                    <div style={{
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '16px', padding: '24px', marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {CATEGORIES.map(cat => (
                                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                                    padding: '8px 16px',
                                    background: selectedCategory === cat ? 'var(--primary)' : 'var(--secondary)',
                                    border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                                    borderRadius: '8px', color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                                }}>{cat}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                        {/* Main content */}
                        <div>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '60px' }}>
                                    <div style={{ width: 40, height: 40, border: '3px solid var(--card-border)', borderTop: '3px solid #4CE0B3', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                                    <p style={{ color: 'var(--text-muted)' }}>Sorular yükleniyor...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Vitrin Alanı */}
                                    {!loading && threads.length > 0 && (
                                        <div style={{ marginBottom: '32px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                                <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '6px', borderRadius: '8px' }}>
                                                    <Award size={18} color="#fbbf24" />
                                                </div>
                                                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)' }}>Uzmanların Seçimi</h2>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                                                {threads.slice(0, 2).map(thread => (
                                                    <Link key={`vitrin-${thread.id}`} href={`/uzmana-sor/${thread.id}`} style={{ textDecoration: 'none' }}>
                                                        <div style={{
                                                            background: 'linear-gradient(to bottom right, var(--card-bg), rgba(251, 191, 36, 0.05))',
                                                            border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px',
                                                            position: 'relative', height: '100%', transition: 'all 0.2s',
                                                        }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                                        >
                                                            <div style={{ position: 'absolute', top: 0, right: 0, background: '#fbbf24', color: 'black', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderBottomLeftRadius: '8px' }}>VİTRİN</div>
                                                            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px', paddingRight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{thread.title}</h3>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12}/>{thread.authorUsername}</span>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={12}/>{thread.entryCount} Yanıt</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                        <div style={{ background: 'rgba(76, 224, 179, 0.1)', padding: '6px', borderRadius: '8px' }}>
                                            <HelpCircle size={18} color="#4CE0B3" />
                                        </div>
                                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)' }}>Tüm Sorular</h2>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {filteredThreads.map(thread => (
                                            <Link key={thread.id} href={`/uzmana-sor/${thread.id}`} style={{ textDecoration: 'none' }}>
                                                <div style={{
                                                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                                    borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s',
                                                }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4CE0B3'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                                                        <div style={{ flex: 1, minWidth: '250px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                                                {thread.tags.slice(0, 2).map(tag => (
                                                                    <span key={tag} style={{ padding: '4px 10px', background: 'rgba(76, 224, 179, 0.1)', color: '#4CE0B3', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                                {thread.entryCount > 1 && (
                                                                    <span style={{ padding: '4px 10px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', fontSize: '11px', borderRadius: '6px', fontWeight: '700' }}>
                                                                        Yanıtlandı
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>{thread.title}</h3>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {thread.authorUsername}</span>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {formatTimestamp(thread.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CE0B3' }}>{thread.entryCount}</div>
                                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Yanıt</div>
                                                            </div>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-muted)' }}>{thread.views}</div>
                                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Görüntülenme</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {filteredThreads.length === 0 && (
                                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '60px 24px', textAlign: 'center' }}>
                                            <HelpCircle size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>Henüz soru yok</h3>
                                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>İlk soruyu siz sorun!</p>
                                            {user && (
                                                <button onClick={() => setShowModal(true)} style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                                    <Plus size={16} /> Soru Sor
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Right sidebar */}
                        <aside>
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {/* Reklam Alanı */}
                                <Link href="/iletisim" style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
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

                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>Nasıl Çalışır?</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                        Sorunuzu sorun, topluluk ve uzmanlar en kısa sürede yanıtlasın.
                                    </p>
                                </div>
                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Lightbulb size={16} color="#fbbf24" />
                                            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>İstatistikler</h3>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ padding: '12px', background: 'var(--secondary)', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#4CE0B3' }}>{threads.length}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Toplam Soru</div>
                                        </div>
                                        <div style={{ padding: '12px', background: 'var(--secondary)', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>{threads.filter(t => t.entryCount > 1).length}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Yanıtlanan</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* New Question Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', zIndex: 1000, padding: '16px',
                    }} onClick={() => setShowModal(false)}>
                        <div style={{
                            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                            borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '550px',
                        }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--foreground)' }}>Uzmana Soru Sor</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Kategori</label>
                                <select value={newQ.subCategory} onChange={(e) => setNewQ({ ...newQ, subCategory: e.target.value })}
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }}>
                                    {["Motor", "Sanziman", "Lastik", "Bakim", "Elektrik", "Fren", "Suspansiyon"].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Başlık <span style={{ color: '#ef4444' }}>*</span></label>
                                <input type="text" value={newQ.title} onChange={(e) => setNewQ({ ...newQ, title: e.target.value })}
                                    placeholder="Sorunuzun başlığını yazın..."
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }} />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Detaylı Açıklama <span style={{ color: '#ef4444' }}>*</span></label>
                                <textarea value={newQ.content} onChange={(e) => setNewQ({ ...newQ, content: e.target.value })}
                                    placeholder="Sorununuzu detaylı anlatınız..."
                                    rows={4}
                                    style={{ width: '100%', padding: '12px 16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontSize: '14px', outline: 'none', resize: 'none' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => setShowModal(false)} style={{
                                    flex: 1, padding: '14px', background: 'var(--secondary)', border: '1px solid var(--card-border)',
                                    borderRadius: '10px', color: 'var(--foreground)', fontWeight: '500', cursor: 'pointer', fontSize: '14px',
                                }}>İptal</button>
                                <button onClick={handleCreate} disabled={!newQ.title.trim() || !newQ.content.trim() || creating}
                                    style={{
                                        flex: 1, padding: '14px',
                                        background: (!newQ.title.trim() || !newQ.content.trim()) ? 'var(--secondary)' : 'var(--primary)',
                                        border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600',
                                        cursor: (!newQ.title.trim() || !newQ.content.trim()) ? 'not-allowed' : 'pointer',
                                        opacity: (!newQ.title.trim() || !newQ.content.trim()) ? 0.5 : 1, fontSize: '14px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    }}>
                                    {creating ? "Gönderiliyor..." : <><Sparkles size={16} /> Soruyu Gönder</>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
            <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
