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
import { ThumbsUp, MessageSquare, Clock, User, Send, Eye, ArrowLeft, LogIn, ShieldCheck, HelpCircle } from "lucide-react";

export default function QuestionDetailPage() {
    const params = useParams();
    const threadId = params.id as string;
    const { user } = useAuth();

    const [thread, setThread] = useState<ForumThread | null>(null);
    const [entries, setEntries] = useState<ForumEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [newEntry, setNewEntry] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [likingEntry, setLikingEntry] = useState<string | null>(null);
    const viewCounted = useRef(false);

    useEffect(() => {
        async function load() {
            const t = await getThreadById(threadId);
            setThread(t);
            setLoading(false);
            if (t && !viewCounted.current) {
                viewCounted.current = true;
                incrementViews(threadId);
            }
        }
        load();
    }, [threadId]);

    useEffect(() => {
        const unsub = subscribeToEntries(threadId, setEntries);
        return () => unsub();
    }, [threadId]);

    const handleSubmit = async () => {
        if (!newEntry.trim() || !user || submitting) return;
        setSubmitting(true);
        try {
            await addEntry(threadId, { authorId: user.id as string, username: user.username, content: newEntry.trim() });
            setNewEntry("");
        } catch (e) { console.error("Yanit gonderilemedi:", e); }
        setSubmitting(false);
    };

    const handleLike = async (entryId: string) => {
        if (!user || likingEntry) return;
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
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '24px' }}>Soru bulunamadi</p>
                        <Link href="/uzmana-sor"><button style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Sorulara Don</button></Link>
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
                    background: 'linear-gradient(135deg, #006C4C, #00C9B8)',
                    borderBottom: '1px solid var(--card-border)', padding: '32px 24px'
                }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <Link href="/uzmana-sor" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '14px', marginBottom: '16px' }}>
                            <ArrowLeft size={14} /> Uzmana Sor
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            {thread.tags.slice(0, 2).map(tag => (
                                <span key={tag} style={{ padding: '4px 12px', background: 'rgba(255, 255, 255, 0.15)', color: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>{tag}</span>
                            ))}
                            {entries.length > 1 && (
                                <span style={{ padding: '4px 12px', background: 'rgba(52, 211, 153, 0.2)', color: '#6EE7B7', borderRadius: '6px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <ShieldCheck size={14} /> Yanitlandi
                                </span>
                            )}
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'white', marginBottom: '8px', lineHeight: 1.3 }}>{thread.title}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={15} /> {thread.authorUsername}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={15} /> {formatTimestamp(thread.createdAt)}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={15} /> {thread.views} goruntulenme</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageSquare size={15} /> {entries.length} yanit</span>
                        </div>
                    </div>
                </div>

                {/* Entries */}
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
                    {entries.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px' }}>
                            <HelpCircle size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Henuz yanit yok. Ilk yaniti siz verin!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {entries.map((entry, index) => {
                                const isLiked = user ? entry.likedBy.includes(user.id as string) : false;
                                const isFirst = index === 0;
                                return (
                                    <div key={entry.id} style={{
                                        background: isFirst ? 'var(--card-bg)' : 'var(--card-bg)',
                                        border: isFirst ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--card-border)',
                                        borderRadius: '16px', padding: '24px', position: 'relative',
                                    }}>
                                        <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'var(--secondary)', padding: '2px 8px', borderRadius: '4px' }}>
                                            {isFirst ? "Soru" : `#${index}`}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isFirst ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: 'white', flexShrink: 0 }}>
                                                {entry.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>@{entry.username}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatTimestamp(entry.createdAt)}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--foreground)', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>{entry.content}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
                                            <button onClick={() => handleLike(entry.id)} disabled={!user || likingEntry === entry.id} style={{
                                                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px',
                                                background: isLiked ? 'rgba(34, 197, 94, 0.1)' : 'var(--secondary)',
                                                border: isLiked ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--card-border)',
                                                borderRadius: '8px', color: isLiked ? '#22c55e' : 'var(--text-muted)',
                                                fontSize: '13px', fontWeight: '600', cursor: user ? 'pointer' : 'not-allowed', opacity: !user ? 0.5 : 1,
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
                        {user ? (
                            <>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px' }}>Yanit Yaz</h3>
                                <textarea value={newEntry} onChange={(e) => setNewEntry(e.target.value)}
                                    placeholder="Yanitinizi yazin..."
                                    style={{ width: '100%', minHeight: '100px', padding: '16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--foreground)', fontSize: '15px', resize: 'none', outline: 'none', marginBottom: '16px', lineHeight: 1.6 }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'} onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={handleSubmit} disabled={!newEntry.trim() || submitting} style={{
                                        padding: '12px 28px', background: newEntry.trim() ? '#3b82f6' : 'var(--card-border)', color: 'white', border: 'none', borderRadius: '10px',
                                        fontSize: '14px', fontWeight: '700', cursor: newEntry.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px',
                                    }}>
                                        {submitting ? "Gonderiliyor..." : <><Send size={14} /> Gonder</>}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <LogIn size={28} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '16px' }}>Yanit yazmak icin giris yapmaniz gerekiyor</p>
                                <Link href="/giris"><button style={{ padding: '12px 28px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Giris Yap</button></Link>
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
