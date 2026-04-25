"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Wrench, AlertTriangle, CheckCircle, Info, CalendarClock, TurkishLira, Activity, Settings2 } from "lucide-react";
import Link from "next/link";
import AutoLinkText from "@/components/AutoLinkText";
import RelatedContent from "@/components/RelatedContent";
import FloatingActionBar from "@/components/FloatingActionBar";

interface BakimRehberiDetailClientProps {
    bakimItem: any;
}

export default function BakimRehberiDetailClient({ bakimItem }: BakimRehberiDetailClientProps) {
    const router = useRouter();

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: '60px' }}>
                {/* Hero Section */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.1) 100%)',
                    borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
                    padding: '40px 24px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-20%',
                        right: '-5%',
                        opacity: 0.05,
                        transform: 'rotate(15deg)',
                        pointerEvents: 'none'
                    }}>
                        <Wrench size={400} />
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
                                background: 'linear-gradient(135deg, #10B981, #059669)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
                            }}>
                                <Settings2 size={40} color="white" />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                    <span style={{
                                        padding: '6px 12px',
                                        background: 'rgba(16, 185, 129, 0.15)',
                                        color: '#10B981',
                                        fontSize: '13px',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        border: '1px solid rgba(16, 185, 129, 0.3)'
                                    }}>
                                        Periyodik Bakım
                                    </span>
                                </div>
                                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px', lineHeight: '1.3' }}>
                                    {bakimItem.title}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: '1000px', margin: '-30px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
                    
                    {/* Özet Kartları */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CalendarClock size={24} color="#3B82F6" />
                            </div>
                            <div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>Değişim Periyodu</p>
                                <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>{bakimItem.degisimPeriyodu}</p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TurkishLira size={24} color="#F59E0B" />
                            </div>
                            <div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>Ortalama Maliyet (2026)</p>
                                <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)' }}>{bakimItem.ortalamaMaliyet}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bakim-layout">
                        {/* Sol Kolon: Detaylar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            
                            {/* Neden Önemli */}
                            <div style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '32px'
                            }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle style={{ color: '#10B981' }} />
                                    Neden Önemli ve Ne İşe Yarar?
                                </h2>
                                <AutoLinkText 
                                    text={bakimItem.nedenOnemli} 
                                    style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.8' }} 
                                />
                            </div>

                            {/* İhmal Edilirse Ne Olur? */}
                            <div style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '32px'
                            }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertTriangle style={{ color: '#EF4444' }} />
                                    Değiştirilmezse ve İhmal Edilirse Ne Olur?
                                </h2>
                                <div style={{
                                    background: 'rgba(239, 68, 68, 0.05)',
                                    borderLeft: '4px solid #EF4444',
                                    padding: '16px',
                                    borderRadius: '0 8px 8px 0',
                                    color: 'var(--foreground)',
                                }}>
                                    <AutoLinkText 
                                        text={bakimItem.degismezseNeOlur} 
                                        style={{ fontSize: '15px', lineHeight: '1.7' }} 
                                    />
                                </div>
                            </div>
                            
                            {/* Tags */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {bakimItem.tags.map((tag: string, idx: number) => (
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
                                    <Activity size={18} color="#3B82F6" />
                                    Uzman Tavsiyesi
                                </h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '0' }}>
                                    Üretici firmanın belirlediği kilometre veya yıl süresi (hangisi önce dolarsa) dikkate alınarak periyodik bakımlar zamanında yapılmalıdır. <strong style={{ color: 'var(--foreground)' }}>Parçaların orijinal (OEM) olması</strong> uzun vadede daha ekonomik olacaktır.
                                </p>
                            </div>
                            
                            <div style={{
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '20px'
                            }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>Tüm Bakım Rehberi</h3>
                                <Link href="/kutuphane?kategori=bakim-zamanlari" style={{
                                    display: 'inline-block',
                                    fontSize: '14px',
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    fontWeight: '600'
                                }}>
                                    Kapsamlı periyodik tabloyu gör →
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Related Content / Recommendations */}
                    <div style={{ paddingBottom: '20px' }}>
                        <RelatedContent currentId={bakimItem.id} tags={bakimItem.tags} titleKeywords={bakimItem.title.split(' ')} />
                    </div>
                </div>
            </main>

            <FloatingActionBar 
                title={bakimItem.title} 
                url={typeof window !== 'undefined' ? window.location.href : `https://otosoz.com/bakim-rehberi/${bakimItem.id}`} 
            />
            <Footer />
        </div>
    );
}
