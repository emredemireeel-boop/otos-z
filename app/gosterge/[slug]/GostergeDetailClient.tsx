"use client";

import Link from "next/link";
import { ArrowLeft, AlertTriangle, AlertCircle, Share2, ChevronRight, Activity, Wrench, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function GostergeDetailClient({ light }: { light: any }) {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: `${light.title} Göstergesi - OtoSöz`, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const isCritical = light.severity === "critical";

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
                        background: `radial-gradient(ellipse 60% 120% at 50% -20%, ${light.color}20, transparent)`,
                    }} />
                    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', position: 'relative' }}>
                        {/* Breadcrumb */}
                        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Ana Sayfa</Link>
                            <ChevronRight size={14} />
                            <Link href="/kutuphane?kategori=gosterge-isiklari" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Gösterge Işıkları</Link>
                            <ChevronRight size={14} />
                            <span style={{ color: light.color, fontWeight: '600' }}>{light.title}</span>
                        </nav>

                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                    {light.tags?.map((tag: string, idx: number) => (
                                        <span key={idx} style={{
                                            padding: '4px 10px',
                                            background: `${light.color}15`,
                                            color: light.color,
                                            fontSize: '12px',
                                            borderRadius: '6px',
                                            fontWeight: '600',
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                    {isCritical && (
                                        <span style={{
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            padding: '4px 10px',
                                            background: 'rgba(239,68,68,0.1)',
                                            color: '#ef4444',
                                            fontSize: '12px',
                                            borderRadius: '6px',
                                            fontWeight: '700',
                                        }}>
                                            <ShieldAlert size={12} /> Kritik Uyarı
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
                                    {light.title}
                                </h1>

                                <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                                    {light.meaning}
                                </p>

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
                            
                            {/* Icon Visual */}
                            <div style={{
                                width: '120px', height: '120px',
                                borderRadius: '24px',
                                background: `${light.color}15`,
                                border: `2px solid ${light.color}40`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: `0 8px 32px ${light.color}30`,
                            }}>
                                <AlertTriangle style={{ width: '60px', height: '60px', color: light.color }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Visual Description */}
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{ padding: '12px', background: 'var(--secondary)', borderRadius: '12px', color: 'var(--primary)' }}>
                            <Activity size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>Nasıl Görünür?</h3>
                            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{light.visual_desc}</p>
                        </div>
                    </div>

                    {/* Action Required */}
                    <div style={{ background: isCritical ? 'rgba(239,68,68,0.05)' : 'rgba(234,179,8,0.05)', border: `1px solid ${isCritical ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.2)'}`, borderLeft: `4px solid ${isCritical ? '#ef4444' : '#eab308'}`, borderRadius: '16px', padding: '28px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: '800', color: isCritical ? '#ef4444' : '#eab308', marginBottom: '16px' }}>
                            <Wrench size={24} /> Yapılması Gerekenler
                        </h3>
                        <p style={{ fontSize: '17px', color: 'var(--foreground)', lineHeight: '1.7', fontWeight: isCritical ? '600' : '400' }}>
                            {light.action}
                        </p>
                    </div>

                    <div style={{ marginTop: '20px', borderTop: '1px solid var(--card-border)', paddingTop: '32px', display: 'flex', justifyContent: 'center' }}>
                        <Link href="/kutuphane?kategori=gosterge-isiklari" style={{ textDecoration: 'none' }}>
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
                                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--foreground)' }}>Tüm Göstergelere Dön</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
