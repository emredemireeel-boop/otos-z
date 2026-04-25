"use client";

import Link from "next/link";
import { ArrowLeft, BookMarked, TrendingUp, ChevronRight, Share2, Tag, Lightbulb } from "lucide-react";
import { DictionaryTerm, categoryColors } from "@/data/dictionary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoLinkText from "@/components/AutoLinkText";

export default function SozlukDetailClient({ term, relatedTerms, sameLetterTerms }: {
    term: DictionaryTerm;
    relatedTerms: DictionaryTerm[];
    sameLetterTerms: DictionaryTerm[];
}) {
    const color = categoryColors[term.category] || '#3b82f6';
    const colorBg = `${color}15`;
    const colorBorder = `${color}30`;
    const colorGlow = `${color}20`;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: `${term.term} Nedir? - OtoSöz`, url: window.location.href });
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
                    background: `radial-gradient(ellipse 60% 120% at 30% -20%, ${colorGlow}, transparent)`,
                }} />
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 24px 32px', position: 'relative' }}>
                    {/* Breadcrumb */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Ana Sayfa</Link>
                        <ChevronRight size={14} />
                        <Link href="/kutuphane?kategori=otomotiv-sozluk" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Otomotiv Sözlüğü</Link>
                        <ChevronRight size={14} />
                        <span style={{ color, fontWeight: '600' }}>{term.term}</span>
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                            {/* Letter badge + category */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                <div style={{
                                    width: '52px', height: '52px', borderRadius: '14px',
                                    background: colorBg, border: `2px solid ${colorBorder}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '24px', fontWeight: '800', color,
                                    boxShadow: `0 4px 20px ${colorGlow}`,
                                }}>
                                    {term.letter}
                                </div>
                                <span style={{
                                    padding: '7px 14px',
                                    background: colorBg,
                                    color,
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    borderRadius: '10px',
                                    border: `1px solid ${colorBorder}`,
                                }}>
                                    {term.category}
                                </span>
                            </div>

                            <h1 style={{
                                fontSize: 'clamp(22px, 4vw, 36px)',
                                fontWeight: '800',
                                color: 'var(--foreground)',
                                lineHeight: '1.2',
                                marginBottom: '8px',
                                letterSpacing: '-0.5px',
                            }}>
                                {term.term}
                            </h1>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                Otomotiv Sözlüğü · {term.category}
                            </p>
                        </div>

                        <button
                            onClick={handleShare}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '10px 18px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '10px',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '13px', fontWeight: '500',
                                flexShrink: 0,
                            }}
                        >
                            <Share2 size={16} /> Paylaş
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="sozluk-layout" style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Left: Article */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Description */}
                    <section style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '20px',
                        padding: '32px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${color}, transparent)` }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: colorBg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${colorBorder}` }}>
                                <BookMarked size={18} style={{ color }} />
                            </div>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>Tanım</h2>
                        </div>
                        <AutoLinkText 
                            text={term.description} 
                            style={{ fontSize: '17px', color: 'var(--foreground)', fontWeight: 400 }} 
                        />
                    </section>

                    {/* Why Important */}
                    <section style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '20px',
                        padding: '32px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #f59e0b, transparent)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245,158,11,0.2)' }}>
                                <Lightbulb size={18} style={{ color: '#f59e0b' }} />
                            </div>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>Neden Önemli?</h2>
                        </div>
                        <div style={{
                            padding: '20px 24px',
                            background: 'rgba(245,158,11,0.05)',
                            border: '1px solid rgba(245,158,11,0.15)',
                            borderRadius: '14px',
                            borderLeft: '4px solid #f59e0b',
                        }}>
                            <AutoLinkText 
                                text={term.why} 
                                style={{ fontSize: '16px', color: 'var(--foreground)' }} 
                            />
                        </div>
                    </section>

                    {/* Related terms in same category */}
                    {relatedTerms.length > 0 && (
                        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '28px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                                <Tag size={18} style={{ color: 'var(--primary)' }} />
                                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>
                                    {term.category} Kategorisindeki Diğer Terimler
                                </h2>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {relatedTerms.map(rt => (
                                    <Link key={rt.id} href={`/sozluk/${rt.id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '14px 16px',
                                            background: 'var(--secondary)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '12px',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                        >
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)' }}>{rt.term}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>{rt.description.slice(0, 80)}...</div>
                                            </div>
                                            <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Sidebar */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Quick Info */}
                    <div style={{ background: 'var(--card-bg)', border: `1px solid ${colorBorder}`, borderRadius: '20px', padding: '20px', boxShadow: `0 4px 20px ${colorGlow}` }}>
                        <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Terim Bilgisi</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { label: 'Kategori', value: term.category },
                                { label: 'Harf', value: term.letter },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.label}</span>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Same Letter Terms */}
                    {sameLetterTerms.length > 0 && (
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '20px' }}>
                            <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '14px' }}>
                                "{term.letter}" Harfi ile Başlayanlar
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {sameLetterTerms.map(st => (
                                    <Link key={st.id} href={`/sozluk/${st.id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            padding: '10px 12px',
                                            borderRadius: '10px',
                                            transition: 'all 0.15s',
                                            cursor: 'pointer',
                                            borderLeft: `3px solid ${categoryColors[st.category] || '#3b82f6'}`,
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--secondary)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>{st.term}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{st.category}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tip Box */}
                    <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '16px', padding: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <TrendingUp size={16} style={{ color: 'var(--primary)' }} />
                            <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>İpucu</h3>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            OtoSöz Sözlüğünde yüzlerce otomotiv terimini keşfedebilirsiniz.
                        </p>
                    </div>

                    {/* Back to Dictionary */}
                    <Link href="/kutuphane?kategori=otomotiv-sozluk" style={{ textDecoration: 'none' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '16px',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <ArrowLeft size={18} style={{ color: 'var(--primary)' }} />
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>Tüm Sözlük</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Otomotiv sözlüğüne dön</div>
                            </div>
                        </div>
                    </Link>
                </aside>
            </div>
            </main>
            <Footer />
        </>
    );
}
