"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ShieldCheck, AlertOctagon, Info, Activity, AlertCircle, TrendingDown, ClipboardList } from "lucide-react";
import Link from "next/link";

interface IkinciElRehberiDetailClientProps {
    rehberItem: any;
}

export default function IkinciElRehberiDetailClient({ rehberItem }: IkinciElRehberiDetailClientProps) {
    const router = useRouter();

    const isKritik = rehberItem.oncelik === "kritik";

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: '60px' }}>
                {/* Hero Section */}
                <div style={{
                    background: isKritik 
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.1) 100%)',
                    borderBottom: `1px solid ${isKritik ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
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
                        <ClipboardList size={400} />
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
                                background: isKritik ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #F59E0B, #D97706)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: `0 8px 24px ${isKritik ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                            }}>
                                {isKritik ? <AlertOctagon size={40} color="white" /> : <ShieldCheck size={40} color="white" />}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                    <span style={{
                                        padding: '6px 12px',
                                        background: isKritik ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                        color: isKritik ? '#EF4444' : '#F59E0B',
                                        fontSize: '13px',
                                        borderRadius: '8px',
                                        fontWeight: '800',
                                        border: `1px solid ${isKritik ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                                    }}>
                                        {isKritik ? 'Kritik Riskli Kontrol' : 'Önemli Kontrol'}
                                    </span>
                                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                        Kategori: {rehberItem.kategori}
                                    </span>
                                </div>
                                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px', lineHeight: '1.3' }}>
                                    {rehberItem.title}
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
                                <Activity size={24} color="#3B82F6" />
                            </div>
                            <div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>Kontrol Aşamasındaki Zorluk</p>
                                <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>Detaylı Gözlem Gerektirir</p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingDown size={24} color="#EF4444" />
                            </div>
                            <div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>Arızanın/Hasarın Olası Maliyeti</p>
                                <p style={{ fontSize: '18px', fontWeight: '700', color: '#EF4444' }}>{rehberItem.olasiMasraflar}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', alignItems: 'start' }}>
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
                                    <Info style={{ color: '#3B82F6' }} />
                                    Detaylı Açıklama
                                </h2>
                                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                                    {rehberItem.detayliAciklama}
                                </p>
                            </div>

                            {/* Belirtiler */}
                            <div style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '32px'
                            }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertCircle style={{ color: '#F59E0B' }} />
                                    Sorun Belirtileri Nelerdir?
                                </h2>
                                <div style={{
                                    background: 'rgba(245, 158, 11, 0.05)',
                                    borderLeft: '4px solid #F59E0B',
                                    padding: '16px',
                                    borderRadius: '0 8px 8px 0',
                                    color: 'var(--foreground)',
                                    fontSize: '15px',
                                    lineHeight: '1.7'
                                }}>
                                    {rehberItem.sorunBelirtileri}
                                </div>
                            </div>
                            
                            {/* Tags */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {rehberItem.tags.map((tag: string, idx: number) => (
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
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                borderRadius: '16px',
                                padding: '24px',
                                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.1)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '20px' }}>💡</span>
                                    </div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#10B981', margin: 0 }}>
                                        Gizli Ekspertiz Tüyosu
                                    </h3>
                                </div>
                                <p style={{ fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.6', marginBottom: '0', fontWeight: '500' }}>
                                    {rehberItem.ekspertizTavsiyesi}
                                </p>
                            </div>
                            
                            <div style={{
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '20px'
                            }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>Tüm Ekspertiz Rehberi</h3>
                                <Link href="/kutuphane?kategori=ikinci-el-rehberi" style={{
                                    display: 'inline-block',
                                    fontSize: '14px',
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    fontWeight: '600'
                                }}>
                                    Kontrol listesine geri dön →
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
