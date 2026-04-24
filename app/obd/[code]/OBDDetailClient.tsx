"use client";

import Link from "next/link";
import { ArrowLeft, AlertTriangle, Activity, Wrench, CheckCircle2, ChevronRight, Share2, ExternalLink, Cpu, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export default function OBDDetailClient({ codeData, relatedCodes, typeLabel }: {
    codeData: ObdCode;
    relatedCodes: ObdCode[];
    typeLabel: string;
}) {
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
                        <Link href="/kutuphane?kategori=obd-ariza-kodlari" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>OBD Arıza Kodları</Link>
                        <ChevronRight size={14} />
                        <span style={{ color: colors.text, fontWeight: '600' }}>{codeData.code}</span>
                    </nav>

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
                                {codeData.title}
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
                        <p style={{ fontSize: '16px', color: 'var(--foreground)', lineHeight: '1.8', fontWeight: '400' }}>
                            {codeData.description}
                        </p>
                    </section>

                    {/* Symptoms + Causes Side by Side */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
                                <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>Olası Nedenler</h2>
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
                                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>Çözüm Önerileri</h2>
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

                    {/* Back to OBD */}
                    <Link href="/kutuphane?kategori=obd-ariza-kodlari" style={{ textDecoration: 'none' }}>
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
                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>Tüm OBD Kodları</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OBD veritabanına dön</div>
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
