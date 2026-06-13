"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2, BookOpen, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoLinkText from "@/components/AutoLinkText";
import RelatedContent from "@/components/RelatedContent";
import FloatingActionBar from "@/components/FloatingActionBar";
import AdPlaceholder from "@/components/AdPlaceholder";
import { motion } from "framer-motion";

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

    const renderMarkdown = (text: string) => {
        if (!text) return { __html: '' };
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: var(--primary); text-decoration: underline; font-weight: 600;">$1</a>');
        return { __html: html };
    };

    const getDifficultyColor = (difficulty: string) => {
        if (!difficulty) return '#818CF8';
        switch (difficulty.toLowerCase()) {
            case 'kolay': return '#34D399';
            case 'orta': return '#FBBF24';
            case 'zor': return '#F87171';
            case 'kritik': return '#EF4444';
            default: return '#818CF8';
        }
    };

    const jsonLd = article ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": article.sections?.filter((s: any) => s.title).map((section: any) => ({
            "@type": "Question",
            "name": section.title,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": section.content || (section.subsections ? section.subsections.map((s: any) => s.text).join(" ") : article.description)
            }
        }))
    } : null;

    return (
        <>
            <Navbar />
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                    borderRadius: '0 0 32px 32px',
                    padding: '60px 24px 40px',
                    marginBottom: '32px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', opacity: 0.5 }} />
                    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                        <Link href="/kutuphane?kategori=makaleler" style={{ textDecoration: 'none' }}>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '10px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '24px'
                                }}
                            >
                                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                                Tüm Makaleler
                            </button>
                        </Link>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                            <span style={{
                                padding: '6px 14px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '10px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <Clock style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
                                {article.minutes || 5} dakika
                            </span>
                            {article.difficulty && (
                                <span style={{
                                    padding: '6px 14px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: `1px solid ${getDifficultyColor(article.difficulty)}`,
                                    borderRadius: '10px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: getDifficultyColor(article.difficulty),
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    {article.difficulty}
                                </span>
                            )}
                            <button
                                onClick={handleShare}
                                style={{
                                    padding: '6px 14px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    borderRadius: '10px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backdropFilter: 'blur(10px)',
                                    cursor: 'pointer'
                                }}
                            >
                                <Share2 style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
                                Paylaş
                            </button>
                        </div>

                        <h1 style={{
                            fontSize: '36px',
                            fontWeight: '800',
                            color: 'white',
                            marginBottom: '16px',
                            lineHeight: '1.3'
                        }}>
                            {article.title}
                        </h1>

                        <p style={{
                            fontSize: '16px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            lineHeight: '1.6',
                            marginBottom: '20px'
                        }}>
                            {article.description}
                        </p>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {article.tags?.map((tag: string, idx: number) => (
                                <span key={idx} style={{
                                    padding: '6px 12px',
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    border: '1px solid rgba(255, 255, 255, 0.25)',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    color: 'white',
                                    fontWeight: '600'
                                }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <div className="makale-layout" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px' }}>
                    <div className="layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px', alignItems: 'start' }}>
                        {/* Main Content */}
                        <div style={{ minWidth: 0 }}>
                            {article.sections?.map((section: any, idx: number) => {
                                const sectionId = section.title ? generateId(section.title) : `section-${idx}`;
                                return (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    style={{ marginBottom: '32px' }}
                                >
                                    {section.type !== 'intro' && section.title && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{
                                                width: '6px',
                                                height: '32px',
                                                background: 'var(--primary)',
                                                borderRadius: '3px'
                                            }} />
                                            <h2 id={sectionId} style={{
                                                scrollMarginTop: '100px',
                                                fontSize: '24px',
                                                fontWeight: '700',
                                                color: 'var(--foreground)'
                                            }}>
                                                {section.title}
                                            </h2>
                                        </div>
                                    )}

                                    <div style={{
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '16px',
                                        padding: '24px'
                                    }}>
                                        {section.content && (
                                            <div style={{ marginBottom: section.subsections ? '20px' : 0 }}>
                                                {section.content.split('\n\n').map((paragraph: string, pIdx: number) => (
                                                    <p key={pIdx} style={{
                                                        fontSize: '15px',
                                                        color: 'var(--text-muted)',
                                                        lineHeight: '1.8',
                                                        textAlign: 'justify',
                                                        marginBottom: '16px'
                                                    }} dangerouslySetInnerHTML={renderMarkdown(paragraph)} />
                                                ))}
                                            </div>
                                        )}

                                        {section.subsections?.map((sub: any, subIdx: number) => (
                                            <div key={subIdx} style={{
                                                marginTop: subIdx > 0 ? '20px' : 0,
                                                paddingTop: subIdx > 0 ? '20px' : 0,
                                                borderTop: subIdx > 0 ? '1px solid var(--card-border)' : 'none'
                                            }}>
                                                <h4 style={{
                                                    fontSize: '16px',
                                                    fontWeight: '700',
                                                    color: 'var(--foreground)',
                                                    marginBottom: '8px'
                                                }}>
                                                    {sub.subtitle}
                                                </h4>
                                                <div style={{ marginBottom: sub.points ? '12px' : 0 }}>
                                                    {sub.text?.split('\n\n').map((paragraph: string, pIdx: number) => (
                                                        <p key={pIdx} style={{
                                                            fontSize: '14px',
                                                            color: 'var(--text-muted)',
                                                            lineHeight: '1.7',
                                                            textAlign: 'justify',
                                                            marginBottom: pIdx === (sub.text.split('\n\n').length - 1) ? 0 : '16px'
                                                        }} dangerouslySetInnerHTML={renderMarkdown(paragraph)} />
                                                    ))}
                                                </div>
                                                {sub.points && (
                                                    <ul style={{ margin: 0, paddingLeft: '20px', listStyle: 'none' }}>
                                                        {sub.points.map((point: string, pointIdx: number) => (
                                                            <li key={pointIdx} style={{
                                                                fontSize: '14px',
                                                                color: 'var(--text-muted)',
                                                                lineHeight: '1.7',
                                                                marginBottom: '8px',
                                                                paddingLeft: '24px',
                                                                position: 'relative',
                                                                textAlign: 'justify'
                                                            }}>
                                                                <span style={{
                                                                    position: 'absolute',
                                                                    left: 0,
                                                                    color: 'var(--primary)',
                                                                    fontWeight: '700'
                                                                }}>
                                                                    →
                                                                </span>
                                                                <span dangerouslySetInnerHTML={renderMarkdown(point)} />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}

                                        {/* Table Render */}
                                        {section.table && (
                                            <div style={{ overflowX: 'auto', marginTop: '24px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                                    <thead style={{ background: 'var(--secondary)' }}>
                                                        <tr>
                                                            {section.table.headers.map((th: string, i: number) => (
                                                                <th key={i} style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--foreground)', borderBottom: '1px solid var(--card-border)' }}>{th}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {section.table.rows.map((row: string[], i: number) => (
                                                            <tr key={i} style={{ borderBottom: i === section.table!.rows.length - 1 ? 'none' : '1px solid var(--card-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                                                {row.map((td: string, j: number) => (
                                                                    <td key={j} style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{td}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>

                                    {/* Warning */}
                                    {section.warning && (
                                        <div style={{
                                            marginTop: '16px',
                                            background: 'rgba(239, 68, 68, 0.08)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            display: 'flex',
                                            gap: '12px'
                                        }}>
                                            <AlertTriangle style={{ width: '20px', height: '20px', color: '#EF4444', flexShrink: 0 }} />
                                            <div>
                                                <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#EF4444', marginBottom: '6px' }}>
                                                    {section.warning.title || 'Dikkat'}
                                                </h5>
                                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }} dangerouslySetInnerHTML={renderMarkdown(section.warning.text)} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Tip */}
                                    {section.tip && (
                                        <div style={{
                                            marginTop: '16px',
                                            background: 'rgba(16, 185, 129, 0.08)',
                                            border: '1px solid rgba(16, 185, 129, 0.2)',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            display: 'flex',
                                            gap: '12px'
                                        }}>
                                            <Lightbulb style={{ width: '20px', height: '20px', color: '#10B981', flexShrink: 0 }} />
                                            <div>
                                                <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#10B981', marginBottom: '6px' }}>
                                                    {section.tip.title || 'İpucu'}
                                                </h5>
                                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }} dangerouslySetInnerHTML={renderMarkdown(section.tip.text)} />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )})}

                            {/* FAQs */}
                            {article.faqs && article.faqs.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    marginTop: '32px'
                                }}>
                                    <h2 id="sikca-sorulan-sorular" style={{ scrollMarginTop: '100px', fontSize: '24px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Lightbulb style={{ color: '#8B5CF6' }} />
                                        Sıkça Sorulan Sorular (SSS)
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {article.faqs.map((faq: any, idx: number) => (
                                            <div key={idx} style={{
                                                padding: '20px',
                                                background: 'var(--secondary)',
                                                borderRadius: '12px',
                                                border: '1px solid var(--card-border)'
                                            }}>
                                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                                    {faq.soru}
                                                </h3>
                                                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                                                    {faq.cevap}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Final Checklist */}
                            {article.finalChecklist && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    marginTop: '32px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: 'rgba(67, 233, 123, 0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <CheckCircle2 style={{ width: '24px', height: '24px', color: '#43E97B' }} />
                                        </div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>
                                            Özet Kontrol Listesi
                                        </h3>
                                    </div>
                                    <div style={{ height: '1px', background: 'var(--card-border)', marginBottom: '20px' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {article.finalChecklist.map((item: string, idx: number) => (
                                            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                                                <CheckCircle2 style={{ width: '18px', height: '18px', color: '#43E97B', flexShrink: 0, marginTop: '2px' }} />
                                                <span style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Related Content / Recommendations */}
                            <div style={{ paddingTop: '64px', marginTop: '64px', borderTop: '1px solid var(--card-border)' }}>
                                <RelatedContent currentId={article.id} tags={article.tags || []} titleKeywords={article.title.split(' ')} />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="right-sidebar">
                            <motion.div 
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                                style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                            >
                                {/* Table of contents */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '20px'
                                }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <BookOpen style={{ width: '16px', height: '16px' }} />
                                        Bu Rehberde
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {article.sections?.filter((s: any) => s.type !== 'intro' && s.title).map((section: any, idx: number) => {
                                            const sectionId = generateId(section.title);
                                            const isActive = activeSection === sectionId;
                                            return (
                                            <a
                                                key={idx}
                                                href={`#${sectionId}`}
                                                style={{
                                                    padding: '10px',
                                                    background: isActive ? 'var(--primary)' : 'var(--secondary)',
                                                    borderRadius: '8px',
                                                    fontSize: '13px',
                                                    color: isActive ? 'white' : 'var(--foreground)',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                    border: `1px solid ${isActive ? 'var(--primary)' : 'var(--card-border)'}`
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isActive) {
                                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isActive) {
                                                        e.currentTarget.style.borderColor = 'var(--card-border)';
                                                    }
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                                                    setActiveSection(sectionId);
                                                }}
                                            >
                                                {section.title}
                                            </a>
                                        )})}
                                        {article.faqs && article.faqs.length > 0 && (
                                            <a
                                                href="#sikca-sorulan-sorular"
                                                style={{
                                                    padding: '10px',
                                                    background: activeSection === 'sikca-sorulan-sorular' ? 'var(--primary)' : 'var(--secondary)',
                                                    borderRadius: '8px',
                                                    fontSize: '13px',
                                                    color: activeSection === 'sikca-sorulan-sorular' ? 'white' : 'var(--foreground)',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                    border: `1px solid ${activeSection === 'sikca-sorulan-sorular' ? 'var(--primary)' : 'var(--card-border)'}`
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById('sikca-sorulan-sorular')?.scrollIntoView({ behavior: 'smooth' });
                                                    setActiveSection('sikca-sorulan-sorular');
                                                }}
                                            >
                                                Sıkça Sorulan Sorular
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Author Box */}
                                <div style={{
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--primary)',
                                    borderRadius: '16px',
                                    padding: '16px'
                                }}>
                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>👍</div>
                                    <h5 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                        Yazar
                                    </h5>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                        {article.author || 'OtoSöz Editörleri'}
                                    </p>
                                </div>

                                {/* Square Ad Placeholder */}
                                <div style={{ marginTop: '8px' }}>
                                    <AdPlaceholder position="sidebar" />
                                </div>
                            </motion.div>
                        </aside>
                    </div>
                </div>
            </main>
            
            <FloatingActionBar 
                title={article.title} 
                url={typeof window !== 'undefined' ? window.location.href : `https://otosoz.com/makale/${article.id}`} 
                onCommentClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })} 
            />
            <Footer />
            <style jsx global>{`
                @media (max-width: 900px) {
                    .layout-grid {
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
