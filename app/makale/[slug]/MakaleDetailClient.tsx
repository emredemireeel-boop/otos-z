"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Share2, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoLinkText from "@/components/AutoLinkText";
import RelatedContent from "@/components/RelatedContent";
import FloatingActionBar from "@/components/FloatingActionBar";
import AdPlaceholder from "@/components/AdPlaceholder";
import LatestThreadsWidget from "@/components/LatestThreadsWidget";
import PopularThreadsWidget from "@/components/PopularThreadsWidget";

export default function MakaleDetailClient({ article }: { article: any }) {
    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -60% 0px" }
        );

        const headings = document.querySelectorAll("h2[id]");
        headings.forEach((h) => observer.observe(h));

        return () => observer.disconnect();
    }, [article]);

    const generateId = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9ğüşöçı]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: `${article.title} - OtoSöz`, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Minimalist Hero Header */}
                <div style={{
                    background: 'var(--background)',
                    borderBottom: '1px solid var(--border)',
                    padding: '48px 24px',
                    textAlign: 'center',
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {/* Breadcrumb */}
                        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Ana Sayfa</Link>
                            <ChevronRight size={14} />
                            <Link href="/kutuphane?kategori=makaleler" style={{ color: 'inherit', textDecoration: 'none' }}>Makaleler</Link>
                            <ChevronRight size={14} />
                            <span style={{ color: 'var(--foreground)', fontWeight: '600' }}>{article.title}</span>
                        </nav>

                        <h1 style={{
                            fontSize: 'clamp(28px, 5vw, 48px)',
                            fontWeight: '800',
                            color: 'var(--foreground)',
                            lineHeight: '1.2',
                            marginBottom: '24px',
                            letterSpacing: '-0.5px',
                        }}>
                            {article.title}
                        </h1>

                        <div style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
                            {article.description}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '24px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>{article.author || 'OtoSöz Uzmanları'}</span>
                            </div>
                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border)' }}></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                <Clock size={16} /> <span>{article.minutes || 5} Dk Okuma</span>
                            </div>
                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border)' }}></div>
                            <button
                                onClick={handleShare}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '14px', fontWeight: '500',
                                    padding: 0
                                }}
                            >
                                <Share2 size={16} /> Paylaş
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3-Column Layout */}
                <div className="makale-layout" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: '40px', alignItems: 'start' }}>
                    
                    {/* Left Sidebar */}
                    <aside className="left-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'sticky', top: '100px' }}>
                        {article.sections && article.sections.length > 0 && (
                            <div className="toc-container">
                                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
                                    İçindekiler
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {article.sections.map((section: any, idx: number) => {
                                        if (!section.title) return null;
                                        const sectionId = generateId(section.title);
                                        const isActive = activeSection === sectionId;
                                        
                                        return (
                                            <a key={idx} href={`#${sectionId}`} style={{
                                                fontSize: '14px',
                                                color: isActive ? 'var(--foreground)' : 'var(--text-muted)',
                                                fontWeight: isActive ? '700' : '400',
                                                textDecoration: 'none',
                                                paddingLeft: '12px',
                                                borderLeft: isActive ? '2px solid var(--foreground)' : '2px solid var(--border)',
                                                transition: 'all 0.2s ease',
                                                lineHeight: '1.4'
                                            }} onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                                            }}>
                                                {section.title}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <AdPlaceholder format="vertical" />
                    </aside>

                    {/* Main Content (Centered, High Readability) */}
                    <article className="main-content" style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                        {article.sections?.map((section: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Section Title */}
                            {section.title && (
                                <h2 id={generateId(section.title)} style={{ scrollMarginTop: '100px', fontSize: '28px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px', letterSpacing: '-0.3px' }}>
                                    {section.title}
                                </h2>
                            )}

                            {/* Section Content */}
                            {section.content && (
                                <div className="article-text">
                                    <AutoLinkText 
                                        text={section.content} 
                                    />
                                </div>
                            )}

                            {/* Subsections */}
                            {section.subsections && section.subsections.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '16px' }}>
                                    {section.subsections.map((sub: any, sIdx: number) => (
                                        <div key={sIdx}>
                                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px' }}>
                                                {sub.subtitle}
                                            </h3>
                                            {sub.text && (
                                                <div className="article-text" style={{ marginBottom: sub.points ? '16px' : '0' }}>
                                                    <AutoLinkText text={sub.text} />
                                                </div>
                                            )}
                                            {sub.points && sub.points.length > 0 && (
                                                <ul className="article-list">
                                                    {sub.points.map((pt: string, pIdx: number) => (
                                                        <li key={pIdx}>
                                                            <div className="list-bullet"></div>
                                                            <span>{pt}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Table Render (Minimalist) */}
                            {section.table && (
                                <div style={{ overflowX: 'auto', marginTop: '32px', marginBottom: '32px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '15px' }}>
                                        <thead>
                                            <tr>
                                                {section.table.headers.map((th: string, i: number) => (
                                                    <th key={i} style={{ padding: '16px', fontWeight: '700', color: 'var(--foreground)', borderBottom: '2px solid var(--border)' }}>{th}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {section.table.rows.map((row: string[], i: number) => (
                                                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                                    {row.map((td: string, j: number) => (
                                                        <td key={j} style={{ padding: '16px', color: 'var(--text-muted)' }}>{td}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Info Boxes (Sleek Typography, No Colors/Emojis) */}
                            {section.tip && (
                                <div style={{ borderLeft: '3px solid var(--foreground)', paddingLeft: '24px', margin: '32px 0' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                                        {section.tip.title.replace(/[^a-zA-ZğüşöçıİĞÜŞÖÇ ]/g, '').trim() || 'İpucu'}
                                    </h4>
                                    <div className="article-text" style={{ fontStyle: 'italic' }}>
                                        <AutoLinkText text={section.tip.text} />
                                    </div>
                                </div>
                            )}
                            {section.warning && (
                                <div style={{ border: '1px solid var(--border)', padding: '24px', margin: '32px 0' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                                        {section.warning.title.replace(/[^a-zA-ZğüşöçıİĞÜŞÖÇ ]/g, '').trim() || 'Önemli'}
                                    </h4>
                                    <div className="article-text">
                                        <AutoLinkText text={section.warning.text} />
                                    </div>
                                </div>
                            )}

                            {/* Section Final Checklist (No Colors) */}
                            {section.finalChecklist && section.finalChecklist.length > 0 && (
                                <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '32px 0', marginTop: '32px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '24px' }}>
                                        Kontrol Listesi
                                    </h3>
                                    <ul className="article-list">
                                        {section.finalChecklist.map((pt: string, pIdx: number) => (
                                            <li key={pIdx}>
                                                <div className="list-bullet"></div>
                                                <span>{pt}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Root Final Checklist */}
                    {article.finalChecklist && article.finalChecklist.length > 0 && (
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '40px', marginTop: '32px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Genel Özet ve Kontroller
                            </h3>
                            <ul className="article-list">
                                {article.finalChecklist.map((item: string, idx: number) => (
                                    <li key={idx}>
                                        <div className="list-bullet" style={{ background: 'var(--foreground)' }}></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
                        <Link href="/kutuphane?kategori=makaleler" style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '16px 32px',
                                border: '1px solid var(--foreground)',
                                color: 'var(--foreground)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                fontSize: '14px',
                                letterSpacing: '0.5px'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--foreground)'; e.currentTarget.style.color = 'var(--background)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--foreground)'; }}
                            >
                                <ArrowLeft size={18} /> Tüm Makalelere Dön
                            </div>
                        </Link>
                    </div>

                    {/* Related Content / Recommendations (Bottom of main content) */}
                    <div style={{ paddingTop: '64px', marginTop: '64px', borderTop: '1px solid var(--border)' }}>
                        <RelatedContent currentId={article.id} tags={article.tags || []} titleKeywords={article.title.split(' ')} />
                    </div>
                    </article>

                    {/* Right Sidebar */}
                    <aside className="right-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <PopularThreadsWidget limit={5} />
                        <LatestThreadsWidget limit={5} />
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <AdPlaceholder format="square" />
                        </div>
                    </aside>
                </div>
            </main>
            
            <FloatingActionBar 
                title={article.title} 
                url={typeof window !== 'undefined' ? window.location.href : `https://otosoz.com/makale/${article.id}`} 
                onCommentClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })} 
            />
            <Footer />
            <style jsx global>{`
                .article-text {
                    font-size: 18px;
                    line-height: 1.8;
                    color: var(--text-article);
                    font-weight: 400;
                }
                .article-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .article-list li {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    font-size: 17px;
                    line-height: 1.7;
                    color: var(--text-article);
                }
                .list-bullet {
                    width: 6px;
                    height: 6px;
                    background-color: var(--border);
                    border-radius: 50%;
                    margin-top: 10px;
                    flex-shrink: 0;
                }
                /* CSS variables mapping to root theme */
                :root {
                    --text-article: #333333;
                }
                [data-theme="dark"] {
                    --text-article: #cccccc;
                }

                @media (max-width: 1100px) {
                    .makale-layout {
                        grid-template-columns: 1fr 300px !important;
                    }
                    .left-sidebar {
                        display: none !important;
                    }
                }
                @media (max-width: 900px) {
                    .makale-layout {
                        grid-template-columns: 1fr !important;
                    }
                    .right-sidebar {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
}
