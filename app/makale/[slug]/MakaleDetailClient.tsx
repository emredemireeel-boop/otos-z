"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Tag, Share2, ChevronRight, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MakaleDetailClient({ article }: { article: any }) {
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
                {/* Hero Header */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: `radial-gradient(ellipse 60% 120% at 50% -20%, rgba(59,130,246,0.1), transparent)`,
                    }} />
                    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', position: 'relative' }}>
                        {/* Breadcrumb */}
                        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Ana Sayfa</Link>
                            <ChevronRight size={14} />
                            <Link href="/kutuphane?kategori=makaleler" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Makaleler</Link>
                            <ChevronRight size={14} />
                            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{article.title}</span>
                        </nav>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                            {article.tags?.map((tag: string, idx: number) => (
                                <span key={idx} style={{
                                    padding: '4px 10px',
                                    background: 'rgba(59,130,246,0.1)',
                                    color: 'var(--primary)',
                                    fontSize: '12px',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                }}>
                                    {tag}
                                </span>
                            ))}
                            {article.difficulty && (
                                <span style={{
                                    padding: '4px 10px',
                                    background: article.difficulty === 'Kritik' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)',
                                    color: article.difficulty === 'Kritik' ? '#ef4444' : '#eab308',
                                    fontSize: '12px',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                }}>
                                    {article.difficulty}
                                </span>
                            )}
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(24px, 5vw, 40px)',
                            fontWeight: '800',
                            color: 'var(--foreground)',
                            lineHeight: '1.2',
                            marginBottom: '16px',
                            letterSpacing: '-0.5px',
                        }}>
                            {article.title}
                        </h1>

                        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                            {article.description}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                    <BookOpen size={16} /> <span>{article.author || 'OtoSöz Uzmanları'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                    <Clock size={16} /> <span>{article.minutes || 5} Dk Okuma</span>
                                </div>
                            </div>

                            <button
                                onClick={handleShare}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '8px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '8px',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '13px', fontWeight: '500',
                                }}
                            >
                                <Share2 size={16} /> Paylaş
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {article.sections?.map((section: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Section Title */}
                            {section.title && (
                                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
                                    {section.title}
                                </h2>
                            )}

                            {/* Section Content */}
                            {section.content && (
                                <p style={{ fontSize: '17px', color: 'var(--foreground)', lineHeight: '1.8' }}>
                                    {section.content}
                                </p>
                            )}

                            {/* Subsections */}
                            {section.subsections && section.subsections.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
                                    {section.subsections.map((sub: any, sIdx: number) => (
                                        <div key={sIdx} style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)', marginBottom: '12px' }}>
                                                {sub.subtitle}
                                            </h3>
                                            {sub.text && (
                                                <p style={{ fontSize: '16px', color: 'var(--foreground)', lineHeight: '1.7', marginBottom: sub.points ? '16px' : '0' }}>
                                                    {sub.text}
                                                </p>
                                            )}
                                            {sub.points && sub.points.length > 0 && (
                                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', padding: 0, margin: 0 }}>
                                                    {sub.points.map((pt: string, pIdx: number) => (
                                                        <li key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.6' }}>
                                                            <div style={{ marginTop: '4px', color: 'var(--primary)', flexShrink: 0 }}><CheckCircle2 size={16} /></div>
                                                            {pt}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Info Boxes */}
                            {section.tip && (
                                <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderLeft: '4px solid #3b82f6', borderRadius: '12px', padding: '20px' }}>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
                                        {section.tip.title || '💡 İpucu'}
                                    </h4>
                                    <p style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.6' }}>{section.tip.text}</p>
                                </div>
                            )}
                            {section.warning && (
                                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderLeft: '4px solid #ef4444', borderRadius: '12px', padding: '20px' }}>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '700', color: '#ef4444', marginBottom: '8px' }}>
                                        <AlertTriangle size={18} /> {section.warning.title || '⚠️ Uyarı'}
                                    </h4>
                                    <p style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.6' }}>{section.warning.text}</p>
                                </div>
                            )}

                            {/* Final Checklist */}
                            {section.finalChecklist && section.finalChecklist.length > 0 && (
                                <div style={{ background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '28px', marginTop: '20px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle2 size={20} style={{ color: '#22c55e' }} /> Özet Kontrol Listesi
                                    </h3>
                                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0, margin: 0 }}>
                                        {section.finalChecklist.map((pt: string, pIdx: number) => (
                                            <li key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5' }}>
                                                <div style={{ marginTop: '2px', color: '#22c55e', flexShrink: 0 }}><CheckCircle2 size={18} /></div>
                                                {pt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}

                    <div style={{ marginTop: '20px', borderTop: '1px solid var(--card-border)', paddingTop: '32px', display: 'flex', justifyContent: 'center' }}>
                        <Link href="/kutuphane?kategori=makaleler" style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '16px 24px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <ArrowLeft size={18} style={{ color: 'var(--primary)' }} />
                                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--foreground)' }}>Tüm Makalelere Dön</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
