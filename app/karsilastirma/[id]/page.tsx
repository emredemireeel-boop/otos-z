"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import {
    getThreadById, subscribeToEntries, addEntry, toggleLike,
    incrementViews, formatTimestamp, subscribeToThreads, toggleVehicleVote,
    type ForumThread, type ForumEntry
} from "@/lib/forumService";
import { ThumbsUp, MessageSquare, Clock, User, Send, Eye, ArrowLeft, LogIn, ExternalLink, CheckCircle, Car, Sparkles, Loader2 } from "lucide-react";
import { sampleListings, formatListingPrice } from "@/data/listings";

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

export default function ComparisonDetailPage() {
    const params = useParams();
    const threadId = params.id as string;
    const { user } = useAuth();

    const [thread, setThread] = useState<ForumThread | null>(null);
    const [entries, setEntries] = useState<ForumEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [newEntry, setNewEntry] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [likingEntry, setLikingEntry] = useState<string | null>(null);
    const [votingVehicle, setVotingVehicle] = useState<string | null>(null);
    const [randomListings, setRandomListings] = useState<any[]>([]);
    const [sidebarAd, setSidebarAd] = useState<any>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const viewCounted = useRef(false);

    useEffect(() => {
        // We subscribe to the thread to get real-time vote updates
        const unsubThread = subscribeToThreads((threads) => {
            const t = threads.find(th => th.id === threadId);
            if (t) setThread(t);
            setLoading(false);
        }, 1000);

        async function loadViews() {
            if (!viewCounted.current) {
                viewCounted.current = true;
                incrementViews(threadId);
            }
        }
        loadViews();

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
    }, [threadId]);

    useEffect(() => {
        const unsub = subscribeToEntries(threadId, setEntries);
        return () => unsub();
    }, [threadId]);

    const handleVehicleVote = async (vehicleName: string) => {
        if (!user || votingVehicle) {
            if (!user) alert("Oy vermek için giriş yapmalısınız.");
            return;
        }
        setVotingVehicle(vehicleName);
        try {
            await toggleVehicleVote(threadId, vehicleName, user.id as string);
        } catch (e) {
            console.error(e);
        }
        setVotingVehicle(null);
    };

    const handleSubmit = async () => {
        if (!newEntry.trim() || !user || submitting) return;
        setSubmitting(true);
        try {
            await addEntry(threadId, {
                authorId: user.id as string,
                username: user.username,
                content: newEntry.trim(),
            });
            setNewEntry("");
        } catch (e) { console.error("Entry gonderilemedi:", e); }
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
            <div>
                <Navbar />
                <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 40, height: 40, border: '3px solid var(--card-border)', borderTop: '3px solid #FF6B35', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                        <p style={{ color: 'var(--text-muted)' }}>Karşılaştırma yükleniyor...</p>
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
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '24px' }}>Karşılaştırma bulunamadı</p>
                        <Link href="/karsilastirma">
                            <button style={{ padding: '12px 24px', background: '#FF6B35', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Karşılaştırmalara Dön</button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px' }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #18181b, #3f3f46)',
                    borderBottom: '1px solid var(--card-border)', padding: '40px 24px'
                }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '20px' }}>
                            <Link href="/karsilastirma" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}
                                  onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                                <ArrowLeft size={16} /> Karşılaştırmalara Dön
                            </Link>
                        </div>
                        <span style={{ padding: '6px 14px', background: 'rgba(161, 161, 170, 0.2)', border: '1px solid rgba(161, 161, 170, 0.3)', color: '#D4D4D8', borderRadius: '8px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            ARAÇ KARŞILAŞTIRMA
                        </span>
                        <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '12px', marginTop: '20px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                            {thread.title}
                        </h1>
                        {thread.description && (
                            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>{thread.description}</p>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={15} /> {thread.authorUsername}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={15} /> {formatTimestamp(thread.createdAt)}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={15} /> {thread.views} goruntulenme</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageSquare size={15} /> {entries.length} entry</span>
                        </div>
                        {thread.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                                {thread.tags.map(tag => (
                                    <span key={tag} style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Layout */}
                <div className="forum-layout" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    
                    {/* Left Column: Entries */}
                    <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                        {entries.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px' }}>
                                <MessageSquare size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Henuz yorum yok. Ilk yorumu siz yapin!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {entries.map((entry, index) => {
                                const isLiked = user ? entry.likedBy.includes(user.id as string) : false;
                                const isFirstEntry = index === 0;
                                const { description, vehicles } = isFirstEntry ? parseComparisonContent(entry.content) : { description: entry.content, vehicles: [] };

                                return (
                                    <div key={entry.id} style={{
                                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                        borderRadius: '16px', padding: '24px', position: 'relative',
                                        boxShadow: isFirstEntry ? '0 8px 30px rgba(0,0,0,0.04)' : 'none'
                                    }}>
                                        <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'var(--secondary)', padding: '4px 10px', borderRadius: '6px', fontWeight: '700' }}>
                                            #{index + 1}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: isFirstEntry ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'linear-gradient(135deg, #64748b, #475569)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: 'white', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                                {entry.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>@{entry.username}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{formatTimestamp(entry.createdAt)}</div>
                                            </div>
                                        </div>
                                        
                                        {description && (
                                            <div style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--foreground)', marginBottom: vehicles.length > 0 ? '24px' : '16px', whiteSpace: 'pre-wrap' }}>{description}</div>
                                        )}

                                        {vehicles.length > 0 && (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px', padding: '24px', background: 'var(--secondary)', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                                                {vehicles.map((v, i) => {
                                                    const votesObj = thread?.vehicleVotes || {};
                                                    const totalVotes = Object.values(votesObj).reduce((sum, arr) => sum + arr.length, 0);
                                                    const vehicleVotesArr = votesObj[v.name] || [];
                                                    const voteCount = vehicleVotesArr.length;
                                                    const votePct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                                                    const isVoted = user ? vehicleVotesArr.includes(user.id as string) : false;

                                                    return (
                                                        <div key={i} style={{ background: 'var(--card-bg)', border: `2px solid ${isVoted ? '#22c55e' : 'var(--card-border)'}`, borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: isVoted ? '0 0 0 1px #22c55e' : '0 4px 12px rgba(0,0,0,0.03)', transition: 'transform 0.2s, border-color 0.2s' }}
                                                             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                                             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <h4 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{v.name}</h4>
                                                                {voteCount > 0 && (
                                                                    <div style={{ padding: '4px 10px', background: isVoted ? '#22c55e' : 'var(--secondary)', color: isVoted ? 'white' : 'var(--foreground)', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
                                                                        {voteCount} Oy
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                                <a href={v.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '12px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '14px', fontWeight: '700', transition: 'all 0.2s' }}
                                                                   onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--foreground)'; e.currentTarget.style.background = 'var(--card-bg)'; }}
                                                                   onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.background = 'var(--secondary)'; }}>
                                                                    <ExternalLink size={16} /> İlana Git
                                                                </a>
                                                                <button onClick={() => handleVehicleVote(v.name)}
                                                                        disabled={votingVehicle === v.name}
                                                                        style={{ flex: 1, padding: '12px', background: isVoted ? '#22c55e' : 'rgba(34, 197, 94, 0.1)', border: '1px solid', borderColor: isVoted ? '#22c55e' : 'rgba(34, 197, 94, 0.3)', borderRadius: '10px', color: isVoted ? 'white' : '#22c55e', fontSize: '14px', fontWeight: '800', cursor: votingVehicle === v.name ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}>
                                                                    {votingVehicle === v.name ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                                                    {isVoted ? 'Oyunuz' : 'Oy Ver'}
                                                                </button>
                                                            </div>
                                                            
                                                            {totalVotes > 0 && (
                                                                <div style={{ marginTop: '4px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700' }}>
                                                                        <span>Oy Oranı</span>
                                                                        <span style={{ color: isVoted ? '#22c55e' : 'var(--foreground)' }}>%{votePct}</span>
                                                                    </div>
                                                                    <div style={{ height: '6px', background: 'var(--card-border)', borderRadius: '3px', overflow: 'hidden' }}>
                                                                        <div style={{ height: '100%', width: `${votePct}%`, background: isVoted ? '#22c55e' : '#FF6B35', borderRadius: '3px', transition: 'width 0.5s ease' }} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '700' }}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>Yorum Yaz</h3>
                                </div>
                                <textarea ref={textareaRef} value={newEntry} onChange={(e) => { setNewEntry(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                    placeholder="Dusuncelerinizi paylasin..."
                                    style={{ width: '100%', minHeight: '100px', padding: '16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--foreground)', fontSize: '15px', resize: 'none', outline: 'none', marginBottom: '16px', lineHeight: 1.6 }}
                                    onFocus={(e) => e.target.style.borderColor = '#FF6B35'} onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{newEntry.length} karakter</span>
                                    <button onClick={handleSubmit} disabled={!newEntry.trim() || submitting} style={{
                                        padding: '12px 28px', background: newEntry.trim() ? '#FF6B35' : 'var(--card-border)', color: 'white', border: 'none', borderRadius: '10px',
                                        fontSize: '14px', fontWeight: '700', cursor: newEntry.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px', opacity: submitting ? 0.7 : 1,
                                    }}>
                                        {submitting ? "Gonderiliyor..." : <><Send size={14} /> Gonder</>}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <LogIn size={28} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '16px' }}>Yorum yazmak icin giris yapmaniz gerekiyor</p>
                                <Link href="/giris">
                                    <button style={{ padding: '12px 28px', background: '#FF6B35', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
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
