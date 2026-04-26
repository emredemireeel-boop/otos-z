"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock, Eye, Calendar, ChevronRight, TrendingUp, Tag } from "lucide-react";

export default function HaberlerClient() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/data/news_posts.json?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                // Sort by date descending
                const sorted = (data.posts || []).sort((a: any, b: any) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setPosts(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching blog posts", err);
                setLoading(false);
            });
    }, []);

    const featuredPost = posts.find(p => p.isFeatured) || posts[0];
    const regularPosts = posts.filter(p => p.id !== featuredPost?.id);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 40, height: 40, border: '3px solid var(--card-border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </main>
                <Footer />
                <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Header */}
                <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)', padding: '32px 24px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px' }}>OtoSöz Haberler</h1>
                        <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                            Otomotiv dünyasından en güncel gelişmeler, yasal düzenlemeler, vergi oranları ve sürüş güvenliğine dair uzman haberleri.
                        </p>
                    </div>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', gap: '32px', flexDirection: 'column' }}>
                    {/* Hero Featured Post */}
                    {featuredPost && (
                        <Link href={`/haberler/${featuredPost.slug}`} style={{ textDecoration: 'none' }}>
                            <div style={{ 
                                position: 'relative', borderRadius: '24px', overflow: 'hidden', minHeight: '400px', 
                                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2)', transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div style={{ 
                                    position: 'absolute', inset: 0, 
                                    backgroundImage: `url(${featuredPost.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                                }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 40%, transparent 100%)' }} />
                                
                                <div style={{ position: 'relative', zIndex: 10, padding: '40px', maxWidth: '800px' }}>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                        {featuredPost.tags.slice(0,2).map((tag: string) => (
                                            <span key={tag} style={{ padding: '6px 14px', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'white', marginBottom: '16px', lineHeight: 1.3 }}>
                                        {featuredPost.title}
                                    </h2>
                                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginBottom: '24px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {featuredPost.description}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '600' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {formatDate(featuredPost.createdAt)}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {featuredPost.readTime} dk okuma</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={14} /> {featuredPost.views} okunma</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Layout with Sidebar */}
                    <div style={{ display: 'flex', gap: '32px', marginTop: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        
                        {/* Main Grid */}
                        <div style={{ flex: '1', minWidth: '300px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '4px' }} />
                                <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)' }}>Son Yazılar</h3>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                                {regularPosts.map((post) => (
                                    <Link key={post.id} href={`/haberler/${post.slug}`} style={{ textDecoration: 'none' }}>
                                        <div style={{ 
                                            background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', 
                                            overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column',
                                            transition: 'transform 0.2s, border-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}>
                                            <div style={{ height: '200px', backgroundImage: `url(${post.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                                                <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '8px', color: 'white', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Tag size={12} /> {post.tags[0]}
                                                </div>
                                            </div>
                                            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {post.title}
                                                </h3>
                                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {post.description}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--card-border)', paddingTop: '16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>
                                                    <span>{formatDate(post.createdAt)}</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>Okumaya Devam Et <ChevronRight size={14} /></span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Popular Widget */}
                            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                    <TrendingUp color="var(--primary)" size={20} />
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)' }}>Çok Okunanlar</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {[...posts].sort((a,b) => b.views - a.views).slice(0, 4).map((p, idx) => (
                                        <Link key={p.id} href={`/haberler/${p.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--border-subtle)', lineHeight: 1 }}>{idx + 1}</div>
                                            <div>
                                                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px', lineHeight: 1.4, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground)'}>
                                                    {p.title}
                                                </h4>
                                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.readTime} dk okuma</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Promo Widget */}
                            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '20px', padding: '32px 24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(59,130,246,0.2)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <Eye size={28} />
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '12px' }}>Sorunuz mu var?</h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: 1.6 }}>Otomobilinizle ilgili tüm teknik soruları uzmanlarımıza ücretsiz sorabilirsiniz.</p>
                                <Link href="/uzmana-sor">
                                    <button style={{ width: '100%', padding: '14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'} onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}>
                                        Uzmana Sor
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
