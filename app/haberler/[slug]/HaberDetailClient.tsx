"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock, Eye, Calendar, ArrowLeft, User, Share2, Facebook, Twitter, Linkedin, CheckCircle } from "lucide-react";
import AutoLinkText from "@/components/AutoLinkText";

export default function HaberDetailClient({ slug }: { slug: string }) {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetch(`/data/news_posts.json?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                const found = data.posts?.find((p: any) => p.slug === slug);
                setPost(found || null);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching blog post", err);
                setLoading(false);
            });
    }, [slug]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

    if (!post) {
        return (
            <div>
                <Navbar />
                <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--foreground)' }}>404</h1>
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '24px' }}>Makale bulunamadı.</p>
                        <Link href="/haberler"><button style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Haberler'e Dön</button></Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.description,
        "image": post.image,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "OtoSöz",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.otosoz.com/logo.png"
            }
        },
        "datePublished": post.createdAt,
        "dateModified": post.createdAt
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.otosoz.com/" },
            { "@type": "ListItem", "position": 2, "name": "Haberler", "item": "https://www.otosoz.com/haberler" },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://www.otosoz.com/haberler/${slug}` }
        ]
    };

    return (
        <div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([structuredData, breadcrumbSchema]) }} />
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px' }}>
                
                {/* Hero Banner */}
                <div style={{ 
                    width: '100%', height: '450px', position: 'relative', 
                    backgroundImage: `url(${post.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    display: 'flex', alignItems: 'flex-end'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--background) 0%, rgba(15,23,42,0.4) 100%)' }} />
                    <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 10, padding: '0 24px 40px', width: '100%' }}>
                        <Link href="/haberler" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>
                            <ArrowLeft size={16} /> Haberler'e Dön
                        </Link>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                            {post.tags.map((tag: string) => (
                                <span key={tag} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '16px', lineHeight: 1.2, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                            {post.title}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '600', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>{post.author.charAt(0)}</div>
                                {post.author}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={15} /> {formatDate(post.createdAt)}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={15} /> {post.readTime} dk</span>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    
                    {/* Main Article */}
                    <article className="blog-content" style={{ flex: 1, minWidth: '300px', maxWidth: '800px', fontSize: '18px', lineHeight: '1.8', color: 'var(--foreground)' }}>
                        <div style={{ fontSize: '20px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '40px', paddingLeft: '20px', borderLeft: '4px solid var(--primary)', fontStyle: 'italic' }}>
                            {post.description}
                        </div>
                        
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />

                        {/* Share & Author Box */}
                        <div style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)' }}>
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>{post.author}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{post.authorRole} • OtoSöz</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={handleCopyLink} style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--secondary)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        {copied ? <CheckCircle size={18} color="#10B981" /> : <Share2 size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px' }}>Bu Konudaki Etiketler</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {post.tags.map((tag: string) => (
                                    <span key={tag} style={{ padding: '8px 12px', background: 'var(--secondary)', border: '1px solid var(--card-border)', color: 'var(--text-muted)', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

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
                    </aside>
                </div>
            </main>
            <Footer />

            <style jsx global>{`
                .blog-content h2, .blog-content h3 {
                    color: var(--foreground);
                    font-weight: 800;
                    margin-top: 40px;
                    margin-bottom: 16px;
                    line-height: 1.3;
                }
                .blog-content h2 { font-size: 28px; }
                .blog-content h3 { font-size: 22px; }
                .blog-content p {
                    margin-bottom: 24px;
                }
                .blog-content ul, .blog-content ol {
                    margin-bottom: 24px;
                    padding-left: 24px;
                }
                .blog-content li {
                    margin-bottom: 12px;
                }
                .blog-content strong {
                    color: var(--foreground);
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
}
