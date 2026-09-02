"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { subscribeToThreads, createThread, formatTimestamp, type ForumThread } from "@/lib/forumService";
import { HelpCircle, Plus, X, Sparkles, Users, Clock, MessageSquare, Eye, Lightbulb, Award, BarChart3 } from "lucide-react";
import { sampleListings, formatListingPrice, formatKm } from "@/data/listings";
import ExpertModal from "@/components/ExpertModal";
import AdPlaceholder from "@/components/AdPlaceholder";
import LatestThreadsWidget from "@/components/LatestThreadsWidget";
import { SAMPLE_EXPERT_QUESTIONS } from "@/data/showcase-content";

const CATEGORIES = ["Tümü", "Motor", "Sanzıman", "Lastik", "Bakım", "Elektrik", "Fren", "Süspansiyon", "Diğer"];

export default function UzmanaSorPage() {
    const { user } = useAuth();
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
    const [showModal, setShowModal] = useState(false);
    const [showExpertModal, setShowExpertModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newQ, setNewQ] = useState({ title: "", content: "", subCategory: "Motor", tags: "" });

    useEffect(() => {
        const unsub = subscribeToThreads((allThreads) => {
            setThreads(allThreads.filter(t => t.category === "Uzmana Sor"));
            setLoading(false);
        }, 200);
        return () => unsub();
    }, []);

    const filteredThreads = selectedCategory === "Tümü"
        ? threads
        : threads.filter(t => t.tags.includes(selectedCategory));
    const filteredSamples = selectedCategory === "Tümü"
        ? SAMPLE_EXPERT_QUESTIONS
        : SAMPLE_EXPERT_QUESTIONS.filter(question => (
            question.category === selectedCategory || question.tags.includes(selectedCategory)
        ));

    const handleCreate = async () => {
        if (!user || !newQ.title.trim() || !newQ.content.trim() || creating) return;
        setCreating(true);
        try {
            const tags = [newQ.subCategory, ...newQ.tags.split(",").map(t => t.trim()).filter(Boolean)];
            const threadId = await createThread({
                title: newQ.title.trim(),
                category: "Uzmana Sor",
                content: newQ.content.trim(),
                tags,
                authorId: user.id as string,
                authorUsername: user.username,
            });
            setShowModal(false);
            setNewQ({ title: "", content: "", subCategory: "Motor", tags: "" });
            window.location.href = `/uzmana-sor/${threadId}`;
        } catch (e) { console.error("Soru olusturulamadi:", e); }
        setCreating(false);
    };

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Sub Header — White */}
                <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)', padding: '16px 24px' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>Uzmana Sor</h1>
                                <span style={{ padding: '4px 10px', background: 'var(--secondary)', color: 'var(--text-muted)', fontSize: '11px', borderRadius: '9999px' }}>
                                    {threads.length + SAMPLE_EXPERT_QUESTIONS.length} Soru
                                </span>
                            </div>
                            <button onClick={() => {
                                if (!user) {
                                    window.location.href = '/giris';
                                    return;
                                }
                                setShowExpertModal(true);
                            }} style={{
                                padding: '10px 20px', background: 'var(--foreground)', color: 'var(--card-bg)',
                                fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px',
                            }}>
                                <Plus size={16} /> Soru Sor
                            </button>
                        </div>
                        <div className="category-pills" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {CATEGORIES.map(cat => (
                                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                                    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
                                    whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
                                    background: selectedCategory === cat ? 'var(--foreground)' : 'var(--card-bg)',
                                    color: selectedCategory === cat ? 'var(--card-bg)' : 'var(--foreground)',
                                }}>{cat}</button>
                            ))}
                        </div>
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
                            <Sparkles size={14} color="var(--foreground)" />
                            İlk üç kayıt sayfa kullanımını göstermek amacıyla hazırlanmış örnek içeriktir.
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
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>Nasıl Çalışır?</h3>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                                        Sorunuzu sorun, topluluk ve uzmanlar en kısa sürede yanıtlasın. Kategori seçerek filtreleme yapabilirsiniz.
                                    </p>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <AdPlaceholder position="sidebar" />
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '60px' }}>
                                    <div style={{ width: 40, height: 40, border: '3px solid var(--card-border)', borderTop: '3px solid var(--foreground)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                                    <p style={{ color: 'var(--text-muted)' }}>Sorular yükleniyor...</p>
                                </div>
                            ) : (
                                <>


                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '6px', borderRadius: '8px' }}><HelpCircle size={18} color="var(--foreground)" /></div>
                                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)' }}>Tüm Sorular</h2>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {filteredSamples.map(question => (
                                            <Link key={question.id} href={`/uzmana-sor/${question.id}`} style={{ textDecoration: 'none' }}>
                                                <div style={{
                                                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                                    borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s',
                                                }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--foreground)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                                                <span style={{ padding: '4px 10px', background: 'var(--card-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>Örnek içerik</span>
                                                                {question.tags.slice(0, 2).map(tag => (
                                                                    <span key={tag} style={{ padding: '4px 10px', background: 'var(--card-bg)', color: 'var(--text-muted)', border: '1px solid var(--card-border)', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>{tag}</span>
                                                                ))}
                                                                <span style={{ padding: '4px 10px', background: 'var(--card-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)', fontSize: '11px', borderRadius: '6px', fontWeight: '700' }}>Yanıtlandı</span>
                                                            </div>
                                                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>{question.title}</h3>
                                                            <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-muted)', margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{question.description}</p>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {question.authorUsername}</span>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {question.dateLabel}</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>{Math.max(0, question.entries.length - 1)}</div>
                                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Yanıt</div>
                                                            </div>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>—</div>
                                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Örnek</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        {filteredThreads.map(thread => (
                                            <Link key={thread.id} href={`/uzmana-sor/${thread.id}`} style={{ textDecoration: 'none' }}>
                                                <div style={{
                                                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                                    borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s',
                                                }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--foreground)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                                                {thread.tags.slice(0, 2).map(tag => (
                                                                    <span key={tag} style={{ padding: '4px 10px', background: 'var(--card-bg)', color: 'var(--text-muted)', border: '1px solid var(--card-border)', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>{tag}</span>
                                                                ))}
                                                                {thread.entryCount > 1 && (
                                                                    <span style={{ padding: '4px 10px', background: 'var(--card-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)', fontSize: '11px', borderRadius: '6px', fontWeight: '700' }}>Yanıtlandı</span>
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
                                                                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>{thread.entryCount}</div>
                                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Yanıt</div>
                                                            </div>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>{thread.views}</div>
                                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Görüntülenme</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {filteredThreads.length === 0 && filteredSamples.length === 0 && (
                                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '60px 24px', textAlign: 'center' }}>
                                            <HelpCircle size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>Henüz soru yok</h3>
                                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>İlk soruyu siz sorun!</p>
                                            <button onClick={() => {
                                                if (!user) {
                                                    window.location.href = '/giris';
                                                    return;
                                                }
                                                setShowExpertModal(true);
                                            }} style={{ padding: '12px 24px', background: 'var(--foreground)', color: 'var(--card-bg)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                                <Plus size={16} /> Soru Sor
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <aside className="home-right-sidebar">
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {(threads.length > 0 || SAMPLE_EXPERT_QUESTIONS.length > 0) && (
                                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                            <Award size={16} color="#fbbf24" />
                                            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>Örnek uzman soruları</h3>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {SAMPLE_EXPERT_QUESTIONS.slice(0, 3).map(question => (
                                                <Link key={`sample-${question.id}`} href={`/uzmana-sor/${question.id}`} style={{ textDecoration: 'none' }}>
                                                    <div style={{
                                                        background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '12px',
                                                        position: 'relative', transition: 'all 0.2s',
                                                    }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--foreground)'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                                                    >
                                                        <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--foreground)', color: 'var(--card-bg)', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderBottomLeftRadius: '6px' }}>ÖRNEK</div>
                                                        <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '6px', paddingRight: '42px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{question.title}</h3>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={10} />{question.authorUsername}</span>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={10} />{Math.max(0, question.entries.length - 1)}</span>
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
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>{threads.length + SAMPLE_EXPERT_QUESTIONS.length}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Toplam Soru</div>
                                        </div>
                                        <div style={{ padding: '12px', background: 'var(--secondary)', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>{threads.filter(t => t.entryCount > 1).length + SAMPLE_EXPERT_QUESTIONS.length}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Yanıtlanan</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <AdPlaceholder position="sidebar" />
                                </div>

                                {/* Pazar Vitrini (Gizlendi) */}
                                <LatestThreadsWidget />

                            </div>
                        </aside>
                    </div>
                </div>

                {/* Expert Modal */}
                <ExpertModal
                    show={showExpertModal}
                    onClose={() => setShowExpertModal(false)}
                    onSubmitFree={async (data: { title: string; content: string; subCategory: string }) => {
                        if (!user || creating) return;
                        setCreating(true);
                        try {
                            const tags = [data.subCategory];
                            const threadId = await createThread({
                                title: data.title,
                                category: "Uzmana Sor",
                                content: data.content,
                                tags,
                                authorId: user.id as string,
                                authorUsername: user.username,
                            });
                            window.location.href = `/uzmana-sor/${threadId}`;
                        } catch (e) { console.error("Soru oluşturulamadı:", e); }
                        setCreating(false);
                    }}
                />
            </main>
            <Footer />
            <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
