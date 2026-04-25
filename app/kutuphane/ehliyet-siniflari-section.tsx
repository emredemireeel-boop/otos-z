"use client";

import { useState } from "react";
import { IdCard, Bike, Car, Truck, Bus, Tractor, HelpCircle, BadgeAlert, FileCheck, Coins, ArrowRight } from "lucide-react";
import Link from "next/link";
import ehliyetData from "@/data/ehliyet_siniflari.json";

export default function EhliyetSiniflariSection() {
    const [activeTab, setActiveTab] = useState<'siniflar' | 'ucretler' | 'src'>('siniflar');

    const getIcon = (id: string) => {
        if (id.includes('A') || id === 'M') return <Bike size={24} color="#8B5CF6" />;
        if (id.includes('B')) return <Car size={24} color="#3B82F6" />;
        if (id.includes('C')) return <Truck size={24} color="#F59E0B" />;
        if (id.includes('D')) return <Bus size={24} color="#EF4444" />;
        if (id === 'F') return <Tractor size={24} color="#10B981" />;
        return <IdCard size={24} color="var(--primary)" />;
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{
                background: 'linear-gradient(135deg, #006C4C, #00C9B8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                boxShadow: '0 10px 30px rgba(0, 108, 76, 0.2)'
            }}>
                <div style={{
                    width: '60px', height: '60px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    border: '1px solid rgba(255,255,255,0.3)'
                }}>
                    <IdCard size={32} color="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Ehliyet Sınıfları ve Harç Ücretleri (2026)</h2>
                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                        Hangi ehliyet sınıfı hangi aracı kullanır? 2026 yılı güncel ehliyet harçları, kurs ücretleri ve ticari araç kullananlar için zorunlu SRC belgesi rehberi.
                    </p>
                </div>
            </div>

            {/* İç Menü */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px', overflowX: 'auto' }}>
                <button
                    onClick={() => setActiveTab('siniflar')}
                    style={{
                        padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                        background: activeTab === 'siniflar' ? '#F59E0B' : 'var(--card-bg)',
                        color: activeTab === 'siniflar' ? 'white' : 'var(--foreground)',
                        border: activeTab === 'siniflar' ? '1px solid #F59E0B' : '1px solid var(--card-border)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                    <IdCard size={16} /> Ehliyet Sınıfları (A-F)
                </button>
                <button
                    onClick={() => setActiveTab('ucretler')}
                    style={{
                        padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                        background: activeTab === 'ucretler' ? '#10B981' : 'var(--card-bg)',
                        color: activeTab === 'ucretler' ? 'white' : 'var(--foreground)',
                        border: activeTab === 'ucretler' ? '1px solid #10B981' : '1px solid var(--card-border)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                    <Coins size={16} /> 2026 Harç ve Ücretler
                </button>
                <button
                    onClick={() => setActiveTab('src')}
                    style={{
                        padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                        background: activeTab === 'src' ? '#3B82F6' : 'var(--card-bg)',
                        color: activeTab === 'src' ? 'white' : 'var(--foreground)',
                        border: activeTab === 'src' ? '1px solid #3B82F6' : '1px solid var(--card-border)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                    <FileCheck size={16} /> SRC Belgesi Nedir?
                </button>
            </div>

            {/* Sınıflar Tab'ı */}
            {activeTab === 'siniflar' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {ehliyetData.siniflar.map((sinif) => (
                        <Link href={`/kutuphane/ehliyet/sinif/${sinif.id.toLowerCase()}-sinifi-ehliyet`} key={sinif.id} style={{ textDecoration: 'none', display: 'block' }}>
                            <div style={{
                                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%',
                                transition: 'all 0.3s', cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px', background: 'var(--background)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-subtle)'
                                    }}>
                                        {getIcon(sinif.id)}
                                    </div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)' }}>{sinif.isim}</h3>
                                </div>
                                
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Kullanılan Araçlar</span>
                                        <p style={{ fontSize: '14px', color: 'var(--foreground)', margin: '4px 0 0 0', lineHeight: '1.5' }}>{sinif.araclar}</p>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '16px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
                                        <div style={{ flex: 1 }}>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Yaş Sınırı</span>
                                            <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>{sinif.yasSiniri} Yaş</span>
                                        </div>
                                        <div style={{ flex: 2 }}>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tecrübe Şartı</span>
                                            <span style={{ fontSize: '13px', color: 'var(--foreground)' }}>{sinif.tecrube}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Ücretler Tab'ı */}
            {activeTab === 'ucretler' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid #10B981', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Coins size={40} color="#10B981" />
                            </div>
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px' }}>2026 Yılı Güncel Ehliyet Harçları</h3>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                            B sınıfı otomobil, A2 motosiklet ve tüm ehliyet sınıflarının 2026 yılı güncel harç tutarları, vakıf payı ve ehliyet yenileme ücretleri detaylarını inceleyin.
                        </p>
                        <Link href="/kutuphane/ehliyet/harclar" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '14px 28px',
                            background: '#10B981', color: 'white', fontWeight: '700', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s'
                        }}>
                            Ehliyet Fiyatlarını Görüntüle <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            )}

            {activeTab === 'src' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid #3B82F6', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileCheck size={40} color="#3B82F6" />
                            </div>
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px' }}>{ehliyetData.srcBelgesi.baslik}</h3>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                            Ticari amaçla yük, eşya veya yolcu taşıyan sürücülerin alması zorunlu olan Mesleki Yeterlilik Belgesidir. SRC türleri ve şartlarını detaylıca okuyun.
                        </p>
                        <Link href="/kutuphane/ehliyet/src-belgesi" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '14px 28px',
                            background: '#3B82F6', color: 'white', fontWeight: '700', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s'
                        }}>
                            SRC Belgesi Şartlarını İncele <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
