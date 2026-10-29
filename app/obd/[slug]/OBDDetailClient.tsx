"use client";

import Link from "next/link";
import { ArrowLeft, AlertTriangle, Activity, Wrench, CheckCircle2, ChevronRight, Share2, ExternalLink, Cpu, Zap, DollarSign, HelpCircle, MessageSquare, BookOpen, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoLinkText from "@/components/AutoLinkText";
import RelatedContent from "@/components/RelatedContent";
import FloatingActionBar from "@/components/FloatingActionBar";
import AdPlaceholder from "@/components/AdPlaceholder";
import { getObdFaq } from "@/lib/obd-content";

interface ObdCode {
    code: string;
    title: string;
    description: string;
    type: string;
    isGeneric: boolean;
    severity: string;
    systems: string[];
    symptoms: string[];
    causes: string[];
    fixes: string[];
    lastReviewed?: string;
    sources?: { title: string; url: string }[];
}

function getTypeColor(type: string) {
    switch (type) {
        case 'P': return { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#ef4444', glow: 'rgba(239,68,68,0.2)' };
        case 'B': return { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', text: '#3b82f6', glow: 'rgba(59,130,246,0.2)' };
        case 'C': return { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981', glow: 'rgba(16,185,129,0.2)' };
        case 'U': return { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', text: '#eab308', glow: 'rgba(234,179,8,0.2)' };
        default: return { bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.3)', text: '#6b7280', glow: 'rgba(107,114,128,0.2)' };
    }
}

function getSeverityConfig(severity: string) {
    const s = severity?.toLowerCase() || '';
    if (s.includes('kritik') || s.includes('acil')) return { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: '🔴 Kritik' };
    if (s.includes('yüksek') || s.includes('high')) return { color: '#f97316', bg: 'rgba(249,115,22,0.1)', label: '🟠 Yüksek' };
    if (s.includes('orta') || s.includes('medium')) return { color: '#eab308', bg: 'rgba(234,179,8,0.1)', label: '🟡 Orta' };
    if (s.includes('düşük') || s.includes('low')) return { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', label: '🟢 Düşük' };
    return { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', label: '⚪ Değişken' };
}

export default function OBDDetailClient({ codeData, relatedCodes, typeLabel, brandName, directoryPage ,breadcrumbs,connections}: {
    codeData: ObdCode;
    relatedCodes: ObdCode[];
    typeLabel: string;
    brandName?: string;
    directoryPage: number;breadcrumbs?:React.ReactNode;connections?:React.ReactNode;}) {
    const colors = getTypeColor(codeData.type);
    const severity = getSeverityConfig(codeData.severity);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${codeData.code} Arıza Kodu - OtoSöz`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
{breadcrumbs}

            {/* Hero Header */}
            <div style={{
                background: 'var(--card-bg)',
                borderBottom: '1px solid var(--card-border)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background glow */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: `radial-gradient(ellipse 60% 100% at 50% -10%, ${colors.glow}, transparent)`,
                    opacity: 0.6,
                }} />
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 24px 32px', position: 'relative' }}>
                    {/* Breadcrumb */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Ana Sayfa</Link>
                        <ChevronRight size={14} />
                        <Link href="/obd" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>OBD Arıza Kodları</Link>
                        {brandName && (
                            <>
                                <ChevronRight size={14} />
                                <Link href={`/obd/${brandName.toLowerCase()}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{brandName}</Link>
                            </>
                        )}
                        <ChevronRight size={14} />
                        <span style={{ color: colors.text, fontWeight: '600' }}>{codeData.code}</span>
                    </nav>
                    {directoryPage > 0 ? (
                        <Link href={`/obd-kodlari/${directoryPage}`} style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 650, display: 'inline-block', marginBottom: '18px' }}>
                            Evrensel OBD dizininde bu kodu göster →
                        </Link>
                    ) : (
                        <Link href="/obd" style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 650, display: 'inline-block', marginBottom: '18px' }}>
                            OBD kodu sorgulamaya dön →
                        </Link>
                    )}


                    {/* Code Badge + Title */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                <span style={{
                                    padding: '10px 20px',
                                    background: colors.bg,
                                    color: colors.text,
                                    fontSize: '22px',
                                    fontWeight: '800',
                                    borderRadius: '12px',
                                    border: `2px solid ${colors.border}`,
                                    letterSpacing: '1px',
                                    boxShadow: `0 4px 20px ${colors.glow}`,
                                    fontFamily: 'monospace',
                                }}>
                                    {codeData.code}
                                </span>
                                <span style={{
                                    padding: '6px 14px',
                                    background: severity.bg,
                                    color: severity.color,
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    borderRadius: '8px',
                                    border: `1px solid ${severity.color}40`,
                                }}>
                                    {severity.label}
                                </span>
                                {codeData.isGeneric && (
                                    <span style={{
                                        padding: '6px 14px',
                                        background: 'var(--secondary)',
                                        color: 'var(--text-muted)',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        borderRadius: '8px',
                                        border: '1px solid var(--card-border)',
                                    }}>
                                        Evrensel Kod
                                    </span>
                                )}
                            </div>

                            <h1 style={{
                                fontSize: 'clamp(20px, 4vw, 30px)',
                                fontWeight: '800',
                                color: 'var(--foreground)',
                                lineHeight: '1.3',
                                marginBottom: '12px',
                            }}>
                                {brandName ? `${brandName} ` : ''}{codeData.code} Arıza Kodu: {codeData.title}
                            </h1>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <Cpu size={14} style={{ color: 'var(--text-muted)' }} />
                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{typeLabel}</span>
                                {codeData.systems.map((sys, i) => (
                                    <span key={i} style={{
                                        padding: '3px 10px',
                                        background: 'var(--secondary)',
                                        color: 'var(--text-muted)',
                                        fontSize: '11px',
                                        borderRadius: '6px',
                                        border: '1px solid var(--card-border)',
                                    }}>
                                        {sys}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                            <button
                                onClick={handleShare}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '10px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '10px',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                }}
                            >
                                <Share2 size={16} /> Paylaş
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px' }}>
                {/* Left: Main Article */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Description */}
                    <section style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '20px',
                        padding: '28px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                            background: `linear-gradient(90deg, ${colors.text}, transparent)`,
                        }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${colors.border}` }}>
                                <Cpu size={18} style={{ color: colors.text }} />
                            </div>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>Teknik Açıklama</h2>
                        </div>
                        <AutoLinkText
                            text={codeData.description}
                            style={{ fontSize: '16px', color: 'var(--foreground)', fontWeight: 400 }}
                        />
                    </section>

                    {/* Symptoms + Causes Side by Side */}
                    <div className="obd-two-col">
                        {/* Symptoms */}
                        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #ef4444, transparent)' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239,68,68,0.2)' }}>
                                    <Activity size={18} style={{ color: '#ef4444' }} />
                                </div>
                                <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>Belirtiler</h2>
                            </div>
                            {codeData.symptoms.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {codeData.symptoms.map((s, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.5' }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', marginTop: '6px', flexShrink: 0, boxShadow: '0 0 6px rgba(239,68,68,0.5)' }} />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            ) : <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '14px' }}>Belirti bilgisi yok.</p>}
                        </section>

                        {/* Causes */}
                        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #eab308, transparent)' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(234,179,8,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(234,179,8,0.2)' }}>
                                    <AlertTriangle size={18} style={{ color: '#eab308' }} />
                                </div>
                                <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>{codeData.sources?.length ? 'Olası Nedenler' : 'Genel bilgi: Olası Nedenler'}</h2>
                            </div>
                            {codeData.causes.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {codeData.causes.map((c, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.5' }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', marginTop: '6px', flexShrink: 0, boxShadow: '0 0 6px rgba(234,179,8,0.5)' }} />
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            ) : <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '14px' }}>Neden bilgisi yok.</p>}
                        </section>
                    </div>

                    {/* Fixes */}
                    {codeData.fixes.length > 0 && (
                        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #22c55e, transparent)' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(34,197,94,0.2)' }}>
                                    <Wrench size={18} style={{ color: '#22c55e' }} />
                                </div>
                                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>{codeData.sources?.length ? 'Çözüm Önerileri' : 'Genel bilgi: Kontrol ve Çözüm Önerileri'}</h2>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                                {codeData.fixes.map((fix, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'flex-start', gap: '14px',
                                        padding: '16px',
                                        background: 'var(--secondary)',
                                        borderRadius: '14px',
                                        border: '1px solid var(--card-border)',
                                    }}>
                                        <span style={{
                                            minWidth: '28px', height: '28px',
                                            borderRadius: '8px',
                                            background: 'rgba(34,197,94,0.15)',
                                            color: '#22c55e',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '13px', fontWeight: '800',
                                            border: '1px solid rgba(34,197,94,0.3)',
                                            flexShrink: 0,
                                        }}>
                                            {i + 1}
                                        </span>
                                        <span style={{ fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.5' }}>{fix}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Related Codes */}
                    {relatedCodes.length > 0 && (
                        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '28px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Zap size={18} style={{ color: 'var(--primary)' }} /> İlgili Arıza Kodları
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                {relatedCodes.map((rc) => {
                                    const rc_colors = getTypeColor(rc.type);
                                    return (
                                        <Link key={rc.code} href={`/obd/${rc.code.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                                            <div style={{
                                                padding: '14px 16px',
                                                background: 'var(--secondary)',
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '12px',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer',
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                            >
                                                <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '14px', color: rc_colors.text }}>{rc.code}</span>
                                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rc.title}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '28px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Bu kaydı nasıl kullanmalı?</h2>
                        <p>{codeData.sources?.length ? 'Aşağıdaki kaynakların kapsadığı araçları ve model yıllarını kontrol edin. Bir araç için yayımlanmış servis bülteni bütün modellere uygulanamaz.' : 'Bu bir katalog kaydıdır. Gösterilen olasılıklar araç özelinde doğrulanmış teşhis değildir. Üreticinin servis belgesiyle karşılaştırın; boş liste arıza olmadığı anlamına gelmez.'}</p>
                        <p>Tam kodu, varsa alt kodunu, kontrol modülünü, araç yılı ve motorunu kaydedin. Genel kod tanımı aynı olsa bile test koşulları ve ölçüm sınırları üreticiye göre değişir.</p>
                        <p>Kod tek başına güvenli sürüş veya parça değişimi kararı verdirmez. Yanıp sönen motor lambası, hararet, fren veya direksiyon sorunu varsa güvenli yerde durup uzman yardımına başvurun.</p>
                    </section>

                    {/* ── Sık Sorulan Sorular (FAQ) ── */}
                    <section style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '20px',
                        padding: '28px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.2)' }}>
                                <HelpCircle size={18} style={{ color: '#10b981' }} />
                            </div>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>
                                {codeData.code} Hakkında Sıkça Sorulan Sorular
                            </h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {getObdFaq(codeData).map((faq, i) => (
                                <details key={i} style={{
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                }}>
                                    <summary style={{
                                        padding: '16px 20px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: 'var(--foreground)',
                                        listStyle: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '12px',
                                    }}>
                                        {faq.question}
                                        <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                    </summary>
                                    <div style={{ padding: '0 20px 16px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                                        {faq.answer}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>

                    {codeData.sources && codeData.sources.length > 0 && (
                        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '28px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '12px' }}>İnceleme kaynakları</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6, marginBottom: '12px' }}>Bu üretici bültenleri yalnızca bültende belirtilen araçlara doğrudan uygulanır; genel teşhis sırasını desteklemek için kaynak gösterilmiştir.</p>
                            {codeData.sources.map(source => (
                                <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: 'var(--primary)', marginTop: '8px' }}>
                                    {source.title} <ExternalLink size={13} style={{ display: 'inline' }} />
                                </a>
                            ))}
                            {codeData.lastReviewed && <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '12px' }}>Son teknik inceleme: {codeData.lastReviewed}</p>}
                        </section>
                    )}

                    {/* ── Forum CTA Banner ── */}
                    <div style={{
                        background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        borderRadius: '20px',
                        padding: '28px',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', pointerEvents: 'none' }} />
                        <MessageSquare size={28} color="rgba(147,197,253,0.8)" style={{ marginBottom: '12px' }} />
                        <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: 'white' }}>
                            {codeData.code} Arızası Hakkında Sorunuz mu Var?
                        </h3>
                        <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
                            Forumda deneyimli mekaniklerden ve uzmanlardan yardım alın.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/" style={{ textDecoration: 'none' }}>
                                <span style={{
                                    padding: '12px 24px', background: '#3b82f6', color: 'white',
                                    border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                }}>
                                    <MessageSquare size={14} /> Foruma Git
                                </span>
                            </Link>
                            <Link href="/uzmana-sor" style={{ textDecoration: 'none' }}>
                                <span style={{
                                    padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: 'white',
                                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                                    cursor: 'pointer', display: 'inline-block',
                                }}>
                                    Uzmana Sor
                                </span>
                            </Link>
                        </div>
                    </div>


                </div>

                {/* Right Sidebar */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Quick Info Card */}
                    <div style={{ background: 'var(--card-bg)', border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '20px', boxShadow: `0 4px 20px ${colors.glow}` }}>
                        <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hızlı Bilgi</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { label: 'Kod', value: codeData.code, mono: true },
                                { label: 'Tür', value: `${codeData.type} Kodu` },
                                { label: 'Ciddiyet', value: codeData.severity || 'Değişken' },
                                { label: 'Evrensel mi?', value: codeData.isGeneric ? 'Evet, tüm araçlarda geçerli' : 'Üretici özel' },
                                { label: 'Sistem', value: codeData.systems[0] || '—' },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', flexShrink: 0 }}>{item.label}</span>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: item.mono ? colors.text : 'var(--foreground)', textAlign: 'right', fontFamily: item.mono ? 'monospace' : 'inherit' }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Warning Box */}
                    <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '16px', padding: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                            <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#ef4444' }}>Önemli Uyarı</h3>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Arıza kodları kesin teşhis sunmaz. Aracınızı yetkili bir servise götürmenizi öneririz.
                        </p>
                    </div>

                    <Link href={brandName ? `/obd/${brandName.toLowerCase()}` : "/obd"} style={{ textDecoration: 'none' }}>
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
                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>{brandName ? `${brandName} Kodları` : 'Tüm OBD Kodları'}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OBD veritabanına dön</div>
                            </div>
                        </div>
                    </Link>

                    {/* ── Sidebar Reklam ── */}
                    <AdPlaceholder position="sidebar-obd" />

                    {/* ── Uzmana Sor CTA ── */}
                    <Link href="/uzmana-sor" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))',
                            border: '1px solid rgba(16,185,129,0.2)',
                            borderRadius: '16px',
                            padding: '18px',
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Star size={16} color="#10b981" />
                                <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>Uzman Mekanik Yardımı</h3>
                            </div>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                {codeData.code} kaydını, araç bilgilerini ve belirtileri paylaşın.
                            </p>
                        </div>
                    </Link>

                    {/* ── Faydalı Sayfalar ── */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '16px',
                        padding: '18px',
                    }}>
                        <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Faydalı Sayfalar</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {[
                                { label: 'OBD Arıza Kodları', href: '/obd', icon: <Cpu size={14} /> },
                                { label: 'Gösterge Işıkları', href: '/kutuphane/kategori/gosterge-isiklari', icon: <AlertTriangle size={14} /> },
                                { label: 'Bakım Rehberi', href: '/kutuphane/kategori/bakim-zamanlari', icon: <Wrench size={14} /> },
                                { label: 'Forumda Tartış', href: '/', icon: <MessageSquare size={14} /> },
                            ].map((link, i) => (
                                <Link key={i} href={link.href} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '10px 8px', borderRadius: '8px',
                                        transition: 'background 0.15s',
                                        fontSize: '13px', color: 'var(--foreground)', fontWeight: '500',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--secondary)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <span style={{ color: 'var(--primary)', display: 'flex' }}>{link.icon}</span>
                                        {link.label}
                                        <ChevronRight size={12} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ── Alt Sidebar Reklam ── */}
                    <AdPlaceholder position="sidebar-obd-bottom" />

                </aside>
            </div>

            {/* Related Content / Recommendations */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 60px' }}>
                <RelatedContent currentId={codeData.code} tags={codeData.symptoms.concat(codeData.systems)} titleKeywords={[codeData.code, ...codeData.title.split(' ')]} />
            </div>
        </main>

        <FloatingActionBar
            title={`${codeData.code} - ${brandName ? brandName + ' ' : ''}${codeData.title}`}
            url={typeof window !== 'undefined' ? window.location.href : `https://otosoz.com/obd/${codeData.code.toLowerCase()}`}
        />
        <Footer />
        </>
    );
}
