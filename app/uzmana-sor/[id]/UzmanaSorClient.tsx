"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import {
    getThreadById, subscribeToEntries, addEntry, toggleLike,
    incrementViews, formatTimestamp,
    type ForumThread, type ForumEntry
} from "@/lib/forumService";
import { ThumbsUp, MessageSquare, Clock, User, Send, Eye, ArrowLeft, LogIn, ShieldCheck, HelpCircle, Sparkles } from "lucide-react";
import { getSampleExpertQuestion, type ShowcaseExpertQuestion } from "@/data/showcase-content";

function createSampleThread(question: ShowcaseExpertQuestion): ForumThread {
    return {
        id: question.id,
        title: question.title,
        category: 'Uzmana Sor',
        description: question.description,
        authorId: 'sample',
        authorUsername: question.authorUsername,
        createdAt: null,
        views: 0,
        tags: question.tags,
        entryCount: question.entries.length,
        lastEntryAt: null,
    };
}

function createSampleEntries(question: ShowcaseExpertQuestion): ForumEntry[] {
    return question.entries.map(entry => ({
        id: entry.id,
        authorId: 'sample',
        username: entry.username,
        content: entry.content,
        createdAt: null,
        likes: entry.likes,
        likedBy: [],
    }));
}

export default function QuestionDetailPage() {
    const params = useParams();
    const threadId = params.id as string;
    const { user } = useAuth();
    const sampleQuestion = getSampleExpertQuestion(threadId);
    const isSample = Boolean(sampleQuestion);

    const [thread, setThread] = useState<ForumThread | null>(() => sampleQuestion ? createSampleThread(sampleQuestion) : null);
    const [entries, setEntries] = useState<ForumEntry[]>(() => sampleQuestion ? createSampleEntries(sampleQuestion) : []);
    const [loading, setLoading] = useState(!sampleQuestion);
    const [newEntry, setNewEntry] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [likingEntry, setLikingEntry] = useState<string | null>(null);
    const viewCounted = useRef(false);

    useEffect(() => {
        if (sampleQuestion) {
            setThread(createSampleThread(sampleQuestion));
            setEntries(createSampleEntries(sampleQuestion));
            setLoading(false);
            return;
        }

        async function load() {
            try {
                const t = await getThreadById(threadId);
                setThread(t);
                if (t && !viewCounted.current) {
                    viewCounted.current = true;
                    incrementViews(threadId);
                }
            } catch (error) {
                console.error('Soru yüklenemedi:', error);
                setThread(null);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [sampleQuestion, threadId]);

    useEffect(() => {
        if (sampleQuestion) return;
        const unsub = subscribeToEntries(threadId, setEntries);
        return () => unsub();
    }, [sampleQuestion, threadId]);

    const handleSubmit = async () => {
        if (isSample || !newEntry.trim() || !user || submitting) return;
        setSubmitting(true);
        try {
            await addEntry(threadId, { authorId: user.id as string, username: user.username, content: newEntry.trim() });
            setNewEntry("");
        } catch (e) { console.error("Yanit gonderilemedi:", e); }
        setSubmitting(false);
    };

    const handleLike = async (entryId: string) => {
        if (isSample || !user || likingEntry) return;
        setLikingEntry(entryId);
        try { await toggleLike(threadId, entryId, user.id as string); } catch (e) { console.error(e); }
        setLikingEntry(null);
    };

    if (loading) {
        return (
            <div><Navbar />
                <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 40, height: 40, border: '3px solid var(--card-border)', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                    </div>
                </main><Footer /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!thread) {
        return (
            <div><Navbar />
                <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--foreground)' }}>404</h1>
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '24px' }}>Soru bulunamadı</p>
                        <Link href="/uzmana-sor"><button style={{ padding: '12px 24px', background: 'var(--foreground)', color: 'var(--card-bg)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Sorulara dön</button></Link>
                    </div>
                </main><Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px' }}>
                {/* Header */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderBottom: '1px solid var(--card-border)', padding: '32px 24px'
                }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <Link href="/uzmana-sor" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '14px', marginBottom: '16px' }}>
                            <ArrowLeft size={14} /> Uzmana Sor
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            {isSample && (
                                <span style={{ padding: '4px 12px', background: 'var(--card-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>Örnek içerik</span>
                            )}
                            {thread.tags.slice(0, 2).map(tag => (
                                <span key={tag} style={{ padding: '4px 12px', background: 'var(--card-bg)', color: 'var(--text-muted)', border: '1px solid var(--card-border)', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>{tag}</span>
                            ))}
                            {entries.length > 1 && (
                                <span style={{ padding: '4px 12px', background: 'var(--card-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)', borderRadius: '6px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <ShieldCheck size={14} /> Yanitlandi
                                </span>
                            )}
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px', lineHeight: 1.3 }}>{thread.title}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={15} /> {thread.authorUsername}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={15} /> {isSample ? sampleQuestion?.dateLabel : formatTimestamp(thread.createdAt)}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={15} /> {thread.views} görüntülenme</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageSquare size={15} /> {Math.max(0, entries.length - 1)} yanıt</span>
                        </div>
                    </div>
                </div>

                {/* Entries */}
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
                    {isSample && (
                        <div style={{ marginBottom: '20px', padding: '14px 16px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', fontSize: '13px', lineHeight: 1.6 }}>
                            <strong>Örnek içerik:</strong> Bu soru ve yanıt, Uzmana Sor sayfa yapısını göstermek amacıyla hazırlanmıştır; gerçek kullanıcı kaydı değildir.
                        </div>
                    )}
                    {entries.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px' }}>
                            <HelpCircle size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Henüz yanıt yok. İlk yanıtı siz verin!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {entries.map((entry, index) => {
                                const isLiked = user ? entry.likedBy.includes(user.id as string) : false;
                                const isFirst = index === 0;
                                return (
                                    <div key={entry.id} style={{
                                        background: isFirst ? 'var(--card-bg)' : 'var(--card-bg)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '16px', padding: '24px', position: 'relative',
                                    }}>
                                        <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'var(--secondary)', padding: '2px 8px', borderRadius: '4px' }}>
                                            {isFirst ? "Soru" : `#${index}`}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', flexShrink: 0 }}>
                                                {entry.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>@{entry.username}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{isSample ? sampleQuestion?.entries[index]?.dateLabel : formatTimestamp(entry.createdAt)}</div>
                                                {isSample && sampleQuestion?.entries[index]?.role && (
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '700' }}>{sampleQuestion.entries[index].role}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--foreground)', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>{entry.content}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
                                            <button onClick={() => handleLike(entry.id)} disabled={isSample || !user || likingEntry === entry.id} style={{
                                                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px',
                                                background: 'var(--card-bg)',
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '8px', color: isLiked ? 'var(--foreground)' : 'var(--text-muted)',
                                                fontSize: '13px', fontWeight: '600', cursor: !isSample && user ? 'pointer' : 'not-allowed', opacity: !isSample && user ? 1 : 0.6,
                                            }}>
                                                <ThumbsUp size={14} /> {entry.likes}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* New Entry Form */}
                    <div style={{ marginTop: '32px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
                        {isSample ? (
                            <div style={{ textAlign: 'center', padding: '8px 20px' }}>
                                <Sparkles size={28} style={{ color: 'var(--foreground)', marginBottom: '12px' }} />
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>Bu sayfa örnektir</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
                                    Örnek kayda yanıt gönderilmez. Kendi araç sorunuzu açarak topluluktan ve uzmanlardan görüş alabilirsiniz.
                                </p>
                                <Link href="/uzmana-sor" style={{ display: 'inline-flex', padding: '11px 20px', background: 'var(--foreground)', color: 'var(--card-bg)', borderRadius: '10px', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
                                    Kendi sorunu sor
                                </Link>
                            </div>
                        ) : user ? (
                            <>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px' }}>Yanıt yaz</h3>
                                <textarea value={newEntry} onChange={(e) => setNewEntry(e.target.value)}
                                    placeholder="Yanıtınızı yazın..."
                                    style={{ width: '100%', minHeight: '100px', padding: '16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--foreground)', fontSize: '15px', resize: 'none', outline: 'none', marginBottom: '16px', lineHeight: 1.6 }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--foreground)'} onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={handleSubmit} disabled={!newEntry.trim() || submitting} style={{
                                        padding: '12px 28px', background: newEntry.trim() ? 'var(--foreground)' : 'var(--card-border)', color: newEntry.trim() ? 'var(--card-bg)' : 'var(--text-muted)', border: 'none', borderRadius: '10px',
                                        fontSize: '14px', fontWeight: '700', cursor: newEntry.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px',
                                    }}>
                                        {submitting ? "Gönderiliyor..." : <><Send size={14} /> Gönder</>}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <LogIn size={28} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '16px' }}>Yanıt yazmak için giriş yapmanız gerekiyor</p>
                                <Link href="/giris"><button style={{ padding: '12px 28px', background: 'var(--foreground)', color: 'var(--card-bg)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Giriş yap</button></Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
            <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
