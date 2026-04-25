"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ShieldAlert, FileText, AlertTriangle, CheckCircle, ExternalLink, Info, BadgeAlert, Coins, Gavel } from "lucide-react";
import Link from "next/link";

interface TrafikCezasiDetailClientProps {
    cezaItem: any;
    kategori: string;
}

export default function TrafikCezasiDetailClient({ cezaItem, kategori }: TrafikCezasiDetailClientProps) {
    const router = useRouter();

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: '60px' }}>
                {/* Hero Section */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%)',
                    borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
                    padding: '40px 24px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-20%',
                        right: '-5%',
                        opacity: 0.05,
                        transform: 'rotate(-15deg)',
                        pointerEvents: 'none'
                    }}>
                        <ShieldAlert size={400} />
                    </div>

                    <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                        <button
                            onClick={() => router.back()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--foreground)',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginBottom: '24px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateX(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                        >
                            <ArrowLeft size={16} /> Kütüphaneye Dön
                        </button>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #DC2626, #991B1B)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4)'
                            }}>
                                <FileText size={40} color="white" />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                    <span style={{
                                        padding: '6px 12px',
                                        background: 'rgba(239, 68, 68, 0.15)',
                                        color: '#EF4444',
                                        fontSize: '13px',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        border: '1px solid rgba(239, 68, 68, 0.3)'
                                    }}>
                                        Madde {cezaItem.madde}
                                    </span>
                                    <span style={{
                                        padding: '6px 12px',
                                        background: 'var(--secondary)',
                                        color: 'var(--text-muted)',
                                        fontSize: '13px',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        border: '1px solid var(--card-border)'
                                    }}>
                                        {kategori}
                                    </span>
                                </div>
                                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px', lineHeight: '1.3' }}>
                                    {cezaItem.ihlal}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: '1000px', margin: '-30px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
                    
                    {/* Ceza Özeti Kartları */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Coins size={24} color="#F59E0B" />
                            </div>
                            <div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>Ceza Tutarı (2026)</p>
                                <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)' }}>{cezaItem.ceza}</p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <BadgeAlert size={24} color="#3B82F6" />
                            </div>
                            <div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>Ehliyet & Ceza Puanı</p>
                                <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)' }}>{cezaItem.ehliyet}</p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Gavel size={24} color="#EF4444" />
                            </div>
                            <div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>Araç Men Durumu</p>
                                <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)' }}>{cezaItem.arac}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', alignItems: 'start' }}>
                        {/* Sol Kolon: Detaylar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            
                            {/* Anlamı / Açıklama */}
                            <div style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '32px'
                            }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Info style={{ color: 'var(--primary)' }} />
                                    Ceza Detayı ve Açıklaması
                                </h2>
                                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                                    {cezaItem.description}
                                </p>
                            </div>

                            {/* Ne Yapılmalı */}
                            <div style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '32px'
                            }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle style={{ color: '#10B981' }} />
                                    Ne Yapılmalı? Nasıl Önlenir?
                                </h2>
                                <div style={{
                                    background: 'rgba(16, 185, 129, 0.05)',
                                    borderLeft: '4px solid #10B981',
                                    padding: '16px',
                                    borderRadius: '0 8px 8px 0',
                                    color: 'var(--foreground)',
                                    fontSize: '15px',
                                    lineHeight: '1.7'
                                }}>
                                    {cezaItem.neYapilmali}
                                </div>
                            </div>
                            
                            {/* Tags */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {cezaItem.tags.map((tag: string, idx: number) => (
                                    <span key={idx} style={{
                                        padding: '6px 14px',
                                        background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        color: 'var(--text-muted)',
                                        fontWeight: '500'
                                    }}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Sağ Kolon: Ek Bilgiler */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                borderRadius: '16px',
                                padding: '24px'
                            }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertTriangle size={18} color="#3B82F6" />
                                    Erken Ödeme İndirimi
                                </h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '0' }}>
                                    Trafik cezalarını tebliğ tarihinden itibaren <strong style={{ color: 'var(--foreground)' }}>1 ay içerisinde</strong> öderseniz, <strong style={{ color: '#10B981' }}>%25 erken ödeme indirimi</strong> uygulanır.
                                </p>
                            </div>

                            <a href="https://www.turkiye.gov.tr/emniyet-arac-plakasina-yazilan-ceza-sorgulama?hizmet=Ekrani" target="_blank" rel="noopener noreferrer" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '20px',
                                textDecoration: 'none',
                                color: 'var(--foreground)',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div>
                                    <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>Ceza Sorgulama</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>e-Devlet üzerinden sorgulayın</p>
                                </div>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ExternalLink size={16} color="#3B82F6" />
                                </div>
                            </a>
                            
                            <div style={{
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '20px'
                            }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>Diğer Cezalar</h3>
                                <Link href="/kutuphane?kategori=trafik-cezalari" style={{
                                    display: 'inline-block',
                                    fontSize: '14px',
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    fontWeight: '600'
                                }}>
                                    Tüm 2026 ceza tablosunu gör →
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
