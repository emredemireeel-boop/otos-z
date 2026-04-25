"use client";

import { useState } from "react";
import { Handshake, FileText, CheckCircle2, ShieldAlert, CreditCard, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import noterData from "@/data/noter_islemleri.json";

export default function NoterIslemleriSection() {
    const [activeTab, setActiveTab] = useState<'ucretler' | 'guvenli-odeme' | 'adimlar'>('ucretler');

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
                    <Handshake size={32} color="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Araç Alım Satım ve Noter İşlemleri (2026)</h2>
                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                        2026 güncel noter araç devir harçları, ruhsat ve plaka çıkarma bedelleri. Güvenli Ödeme Sistemi ile dolandırıcılıklara karşı kendinizi nasıl koruyacağınızı adım adım öğrenin.
                    </p>
                </div>
            </div>

            {/* İç Menü */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px', overflowX: 'auto' }}>
                <button
                    onClick={() => setActiveTab('ucretler')}
                    style={{
                        padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                        background: activeTab === 'ucretler' ? '#10B981' : 'var(--card-bg)',
                        color: activeTab === 'ucretler' ? 'white' : 'var(--foreground)',
                        border: activeTab === 'ucretler' ? '1px solid #10B981' : '1px solid var(--card-border)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                    <CreditCard size={16} /> 2026 Masraf & Ücretler
                </button>
                <button
                    onClick={() => setActiveTab('guvenli-odeme')}
                    style={{
                        padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                        background: activeTab === 'guvenli-odeme' ? '#3B82F6' : 'var(--card-bg)',
                        color: activeTab === 'guvenli-odeme' ? 'white' : 'var(--foreground)',
                        border: activeTab === 'guvenli-odeme' ? '1px solid #3B82F6' : '1px solid var(--card-border)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                    <ShieldCheck size={16} /> Güvenli Ödeme Sistemi
                </button>
                <button
                    onClick={() => setActiveTab('adimlar')}
                    style={{
                        padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                        background: activeTab === 'adimlar' ? '#8B5CF6' : 'var(--card-bg)',
                        color: activeTab === 'adimlar' ? 'white' : 'var(--foreground)',
                        border: activeTab === 'adimlar' ? '1px solid #8B5CF6' : '1px solid var(--card-border)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                    <FileText size={16} /> Satış Adımları & Uyarılar
                </button>
            </div>

            {/* Ücretler Tab'ı */}
            {activeTab === 'ucretler' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px dashed #EF4444', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AlertTriangle size={24} color="#EF4444" />
                        <p style={{ fontSize: '14px', color: 'var(--foreground)', margin: 0 }}>
                            <strong style={{ color: '#EF4444' }}>Önemli Not:</strong> Listelenen ücretler 2026 yılı yeniden değerleme oranlarına göre güncellenmiş Noterlik ücret tarifeleridir.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                        {noterData.ucretler.map((item, idx) => (
                            <div key={idx} style={{
                                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column',
                                transition: 'all 0.2s'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10B981'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)' }}>{item.islem}</h3>
                                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '8px 16px', borderRadius: '8px', fontWeight: '800', fontSize: '16px', alignSelf: 'flex-start' }}>
                                        {item.ucret}
                                    </div>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginTop: 'auto' }}>
                                    {item.detay}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'guvenli-odeme' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid #3B82F6', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldCheck size={40} color="#3B82F6" />
                            </div>
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px' }}>{noterData.guvenliOdeme.baslik}</h3>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                            {noterData.guvenliOdeme.aciklama} Araç alım satımında zorunlu hale gelen bu sistemin nasıl kullanılacağını ve tüm adımlarını öğrenmek için detay sayfasına göz atın.
                        </p>
                        <Link href="/kutuphane/noter/guvenli-odeme" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '14px 28px',
                            background: '#3B82F6', color: 'white', fontWeight: '700', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s'
                        }}>
                            Güvenli Ödeme Sistemini İncele <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            )}

            {activeTab === 'adimlar' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid #8B5CF6', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText size={40} color="#8B5CF6" />
                            </div>
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px' }}>Noter Satış Adımları ve Uyarılar</h3>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                            Araç alım satım sürecinde noter adımları nelerdir? Dolandırıcılara karşı alınması gereken hayati önem taşıyan önlemler ve uyarılar için rehberimizi okuyun.
                        </p>
                        <Link href="/kutuphane/noter/satis-adimlari" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '14px 28px',
                            background: '#8B5CF6', color: 'white', fontWeight: '700', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s'
                        }}>
                            Satış Adımlarını ve Uyarıları Oku <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
