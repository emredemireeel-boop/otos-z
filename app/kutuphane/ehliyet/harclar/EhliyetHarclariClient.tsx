"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import LatestThreadsWidget from "@/components/LatestThreadsWidget";
import { HelpCircle, ArrowLeft, Coins, TrendingUp, ChevronRight, MessageSquare, BookOpen, ExternalLink, FileText, Calculator, AlertTriangle, CheckCircle, Info, ChevronDown, Shield, Scale, CreditCard, Car } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ehliyetData from "@/data/ehliyet_siniflari.json";

/* ─── Detaylı maliyet tablosu verileri (B Sınıfı toplam maliyet) ─── */
const toplamMaliyetTablosu = [
    { kalem: "Sürücü Kursu Eğitim Ücreti", tutar: "~25.000,00", tahsilEden: "Özel Sürücü Kursları (İl Taban Fiyatlarına Göre Ortalama)" },
    { kalem: "Teorik Sınav (E-Sınav) Ücreti", tutar: "1.250,00", tahsilEden: "Milli Eğitim Bakanlığı" },
    { kalem: "Direksiyon Uygulama Sınavı Ücreti", tutar: "2.800,00", tahsilEden: "Milli Eğitim Bakanlığı" },
    { kalem: "Ehliyet Harç Bedeli", tutar: "9.456,44", tahsilEden: "Hazine ve Maliye Bakanlığı (Vergi Dairesi/GİB)" },
    { kalem: "Değerli Kağıt Bedeli", tutar: "2.366,00", tahsilEden: "Darphane / Hazine ve Maliye Bakanlığı" },
    { kalem: "Vakıf Hizmet Payı", tutar: "595,00", tahsilEden: "Türk Polis Teşkilatını Güçlendirme Vakfı" },
    { kalem: "Sürücü Sağlık Raporu", tutar: "~312,00", tahsilEden: "Devlet Hastanesi veya Özel Poliklinik" },
    { kalem: "Biyometrik Fotoğraf ve Kırtasiye", tutar: "~500,00", tahsilEden: "Fotoğraf Stüdyoları" },
];

const toplamMinimum = "~42.279,44";

export default function EhliyetHarclariClient() {
    const { ucretler2026, digerUcretler } = ehliyetData;
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        ...ucretler2026.map((item) => ({
            question: `2026 Yılı ${item.sinif} Ehliyet Harcı Ne Kadar?`,
            answer: `${item.sinif} ehliyet için 2026 yılında ödenmesi gereken toplam devlete ödenen tutar ${item.toplam}'dir. Bu tutar; ${item.harc} harç bedeli, ${item.degerliKagit} değerli kağıt bedeli ve ${item.vakifPayi} vakıf payından oluşmaktadır.`
        })),
        ...digerUcretler.map((item) => ({
            question: `${item.islem} Ücreti Ne Kadar?`,
            answer: `2026 güncel verilerine göre ${item.islem} için ödenmesi gereken tutar ${item.ucret}'dir. Detay: ${item.detay}`
        }))
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    const ilgiliKonular = [
        { title: "Ehliyet Sınıfları Rehberi", desc: "M, A1, A2, B, C, D, E, F sınıfları", href: "/kutuphane?kategori=ehliyet-siniflari", icon: <Car size={16} /> },
        { title: "SRC Belgesi Nedir?", desc: "Ticari sürücüler için zorunlu belge", href: "/kutuphane/ehliyet/src-belgesi", icon: <FileText size={16} /> },
        { title: "Trafik Cezaları 2026", desc: "Güncel ceza tarifeleri tablosu", href: "/trafik-cezasi", icon: <AlertTriangle size={16} /> },
        { title: "OtoBütçe Hesaplama", desc: "Araç masraflarınızı planlayın", href: "/otobutce", icon: <Calculator size={16} /> },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* ─── HERO HEADER ─── */}
            <div className="harclar-hero" style={{
                background: 'linear-gradient(135deg, #064E3B 0%, #047857 40%, #10B981 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                padding: '32px 24px',
                paddingTop: '92px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

                <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
                        <Link href="/kutuphane?kategori=ehliyet-siniflari" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ArrowLeft size={14} /> Kütüphane
                        </Link>
                        <span>/</span>
                        <span style={{ color: '#6EE7B7' }}>Ehliyet Harçları</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '18px',
                            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0,
                        }}>
                            <Coins size={32} color="white" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: 0, lineHeight: 1.2 }}>
                                2026 Ehliyet Harç Ücretleri
                            </h1>
                            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', margin: '6px 0 0', lineHeight: 1.5 }}>
                                Haziran 2026 itibarıyla güncel devlete ödenen harç, değerli kağıt ve vakıf payı tarifeleri
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                        <span style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.12)', borderRadius: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Scale size={12} /> B Sınıfı Odaklı
                        </span>
                        <span style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.12)', borderRadius: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>
                            Haziran 2026 Güncel
                        </span>
                        <span style={{ padding: '5px 12px', background: 'rgba(16,185,129,0.3)', borderRadius: '20px', fontSize: '12px', color: '#A7F3D0', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={12} /> Resmi Kaynaklardan
                        </span>
                    </div>
                </div>
            </div>

            {/* ─── 3-COLUMN LAYOUT ─── */}
            <main className="harclar-layout" style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

                {/* ──── LEFT SIDEBAR ──── */}
                <aside className="harclar-sidebar-left" style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>
                    {/* Reklam Alanı */}
                    <AdPlaceholder position="sidebar" />

                    {/* Son Forum Başlıkları */}
                    <LatestThreadsWidget />

                    {/* İkinci reklam alanı */}
                    <AdPlaceholder position="sidebar-bottom" fallbackTitle="Premium Reklam Alanı" fallbackDesc="Forum sayfalarında görüntülenin." />
                </aside>

                {/* ──── CENTER CONTENT ──── */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* ── Üst Banner Reklam ── */}
                    <AdPlaceholder position="content-top" variant="banner" />

                    {/* ── Güncel Değişiklikler Uyarısı ── */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))',
                        border: '1px solid rgba(245,158,11,0.25)',
                        borderRadius: '16px',
                        padding: '20px 24px',
                        display: 'flex', gap: '16px', alignItems: 'flex-start',
                    }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <AlertTriangle size={20} color="#F59E0B" />
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '800', color: 'var(--foreground)' }}>
                                Haziran 2026 Güncellemesi
                            </h3>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span>• <strong style={{ color: 'var(--foreground)' }}>Harç Bedeli:</strong> 6.754,60 TL → <span style={{ color: '#EF4444', fontWeight: '700' }}>9.456,44 TL</span></span>
                                    <span>• <strong style={{ color: 'var(--foreground)' }}>Değerli Kağıt:</strong> 1.690,00 TL → <span style={{ color: '#EF4444', fontWeight: '700' }}>2.366,00 TL</span></span>
                                    <span>• <strong style={{ color: 'var(--foreground)' }}>Vakıf Payı:</strong> 425,00 TL → <span style={{ color: '#EF4444', fontWeight: '700' }}>595,00 TL</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Sınıfa Göre Devlete Ödenen Ücretler Tablosu ── */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: 'var(--card-shadow)',
                    }}>
                        <div style={{ padding: '24px 28px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--card-border)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CreditCard size={20} color="#10B981" />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--foreground)' }}>Sınıfa Göre Devlete Ödenen Ücretler</h2>
                                <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>2026 yılı güncel harç + değerli kağıt + vakıf payı</p>
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ background: 'var(--secondary)' }}>
                                        <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '700', color: 'var(--foreground)', fontSize: '13px' }}>Ehliyet Sınıfı</th>
                                        <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', color: 'var(--foreground)', fontSize: '13px' }}>Harç</th>
                                        <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', color: 'var(--foreground)', fontSize: '13px' }}>D. Kağıt</th>
                                        <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', color: 'var(--foreground)', fontSize: '13px' }}>Vakıf Payı</th>
                                        <th style={{ padding: '14px 20px', textAlign: 'right', fontWeight: '800', color: 'var(--foreground)', fontSize: '13px' }}>Toplam</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ucretler2026.map((item, idx) => (
                                        <tr key={idx} style={{
                                            borderBottom: idx < ucretler2026.length - 1 ? '1px solid var(--card-border)' : 'none',
                                            background: item.sinif.includes('B Sınıfı') ? 'rgba(16,185,129,0.04)' : 'transparent',
                                        }}>
                                            <td style={{ padding: '16px 20px', fontWeight: item.sinif.includes('B Sınıfı') ? '700' : '500', color: 'var(--foreground)', whiteSpace: 'nowrap' }}>
                                                {item.sinif.includes('B Sınıfı') && (
                                                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', marginRight: '8px' }} />
                                                )}
                                                {item.sinif}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '13px' }}>{item.harc}</td>
                                            <td style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '13px' }}>{item.degerliKagit}</td>
                                            <td style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '13px' }}>{item.vakifPayi}</td>
                                            <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: '800', color: item.sinif.includes('B Sınıfı') ? '#10B981' : 'var(--foreground)', fontFamily: 'monospace', fontSize: '14px' }}>{item.toplam}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Orta Reklam Alanı ── */}
                    <AdPlaceholder position="content-mid" variant="banner" />

                    {/* ── B Sınıfı Toplam Maliyet Detaylı Tablosu ── */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: 'var(--card-shadow)',
                    }}>
                        <div style={{
                            padding: '24px 28px 16px',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            borderBottom: '1px solid var(--card-border)',
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.06), transparent)',
                        }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Coins size={20} color="#10B981" />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--foreground)' }}>B Sınıfı Ehliyet – Toplam Maliyet Tablosu</h2>
                                <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>Sürücü kursundan ehliyeti almaya kadar tüm kalemler</p>
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ background: 'var(--secondary)' }}>
                                        <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '700', color: 'var(--foreground)', fontSize: '13px' }}>Gider Kalemi</th>
                                        <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', color: 'var(--foreground)', fontSize: '13px', whiteSpace: 'nowrap' }}>Güncel Tutar (TL)</th>
                                        <th className="harclar-hide-mobile" style={{ padding: '14px 20px', textAlign: 'left', fontWeight: '700', color: 'var(--foreground)', fontSize: '13px' }}>Tahsil Eden / Hizmet Sağlayıcı</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {toplamMaliyetTablosu.map((item, idx) => (
                                        <tr key={idx} style={{
                                            borderBottom: '1px solid var(--card-border)',
                                            transition: 'background 0.15s',
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '14px 20px', fontWeight: '600', color: 'var(--foreground)', fontSize: '13px' }}>{item.kalem}</td>
                                            <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', color: 'var(--foreground)', fontFamily: 'monospace', fontSize: '14px' }}>{item.tutar}</td>
                                            <td className="harclar-hide-mobile" style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.5 }}>{item.tahsilEden}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))' }}>
                                        <td style={{ padding: '18px 20px', fontWeight: '800', fontSize: '15px', color: 'var(--foreground)' }}>Toplam Minimum Maliyet</td>
                                        <td style={{ padding: '18px 16px', textAlign: 'right', fontWeight: '900', fontSize: '18px', color: '#10B981', fontFamily: 'monospace' }}>{toplamMinimum}</td>
                                        <td className="harclar-hide-mobile" style={{ padding: '18px 20px', color: 'var(--text-muted)', fontSize: '11px', fontStyle: 'italic' }}>Sınavlardan kalma durumundaki telafi ve tekrar ücretleri hariçtir</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* ── Diğer Ücretler Kartları ── */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '20px',
                        padding: '28px',
                        boxShadow: 'var(--card-shadow)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <Shield size={22} color="#3b82f6" />
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--foreground)' }}>Diğer Ücretler & Detaylar</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                            {digerUcretler.map((item, idx) => (
                                <div key={idx} style={{
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '14px',
                                    padding: '20px',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <h3 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>{item.islem}</h3>
                                    <p style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '900', color: '#10B981', fontFamily: 'monospace' }}>{item.ucret}</p>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.detay}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Alt Reklam Alanı ── */}
                    <AdPlaceholder position="content-bottom" variant="banner" />

                    {/* ── FAQ Akordeonu ── */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '20px',
                        padding: '28px',
                        boxShadow: 'var(--card-shadow)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <HelpCircle size={24} color="#10B981" />
                            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: 'var(--foreground)' }}>Sıkça Sorulan Sorular</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {faqs.map((faq, idx) => (
                                <div key={idx} style={{
                                    background: openFaq === idx ? 'var(--secondary)' : 'transparent',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '14px',
                                    overflow: 'hidden',
                                    transition: 'background 0.2s',
                                }}>
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
                                            textAlign: 'left', gap: '12px',
                                        }}
                                    >
                                        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', lineHeight: 1.5 }}>
                                            {faq.question}
                                        </span>
                                        <ChevronDown size={18} style={{
                                            color: 'var(--text-muted)', flexShrink: 0,
                                            transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.25s ease',
                                        }} />
                                    </button>
                                    {openFaq === idx && (
                                        <div style={{ padding: '0 20px 16px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Forum CTA (Ortada, Alt Kısım) ── */}
                    <div style={{
                        background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        borderRadius: '20px',
                        padding: '32px',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)' }} />
                        <MessageSquare size={36} color="rgba(147,197,253,0.8)" style={{ marginBottom: '16px' }} />
                        <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '800', color: 'white' }}>
                            Ehliyet Sürecinde Sorunuz mu Var?
                        </h3>
                        <p style={{ margin: '0 0 20px', fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                            Forumda deneyimli sürücülerden ve uzmanlardan yardım alın. Sorularınızı sorun, cevaplar bulsun.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/forum" style={{ textDecoration: 'none' }}>
                                <button style={{
                                    padding: '14px 28px', background: '#3b82f6', color: 'white',
                                    border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                    transition: 'transform 0.15s, box-shadow 0.15s',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.3)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <MessageSquare size={16} /> Foruma Git
                                </button>
                            </Link>
                            <Link href="/uzmana-sor" style={{ textDecoration: 'none' }}>
                                <button style={{
                                    padding: '14px 28px', background: 'rgba(255,255,255,0.1)', color: 'white',
                                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '15px', fontWeight: '700',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                    transition: 'all 0.15s',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                >
                                    Uzmana Sor
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ──── RIGHT SIDEBAR ──── */}
                <aside className="harclar-sidebar-right" style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>

                    {/* İlgili Konular Widget */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '16px',
                        padding: '20px',
                        boxShadow: 'var(--card-shadow)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
                            <BookOpen size={16} color="var(--primary)" />
                            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>İlgili Konular</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {ilgiliKonular.map((konu, idx) => (
                                <Link key={idx} href={konu.href} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '10px 8px', borderRadius: '10px',
                                        transition: 'background 0.15s',
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                                            {konu.icon}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '1px' }}>{konu.title}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{konu.desc}</div>
                                        </div>
                                        <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Reklam Alanı */}
                    <AdPlaceholder position="sidebar-right" />

                    {/* Forum CTA Sidebar Widget */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))',
                        border: '1px solid rgba(16,185,129,0.2)',
                        borderRadius: '16px',
                        padding: '20px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <MessageSquare size={16} color="#10B981" />
                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>Tartışmaya Katıl</h3>
                        </div>
                        <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            Ehliyet harcları hakkında görüşlerinizi paylaşın, diğer sürücülere yardım edin.
                        </p>
                        <Link href="/forum" style={{ textDecoration: 'none' }}>
                            <button style={{
                                width: '100%', padding: '10px', background: '#10B981', color: 'white',
                                border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                transition: 'transform 0.15s',
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Foruma Git <ChevronRight size={14} />
                            </button>
                        </Link>
                    </div>

                    {/* İkinci Reklam Alanı */}
                    <AdPlaceholder position="sidebar-right-bottom" />

                    {/* Kaynak Bilgisi Widget */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '16px',
                        padding: '20px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <Info size={16} color="var(--text-muted)" />
                            <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Kaynak Bilgisi</h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                            Harç bedelleri Hazine ve Maliye Bakanlığı Genel Tebliği&apos;ne, değerli kağıt bedelleri
                            Darphane resmi tarifelerine, vakıf payı Türk Polis Teşkilatını Güçlendirme Vakfı kararlarına
                            dayanmaktadır. Son güncelleme: Haziran 2026.
                        </p>
                    </div>
                </aside>
            </main>

            <Footer />

            <style jsx>{`
                @media (max-width: 1200px) {
                    .harclar-layout {
                        flex-wrap: wrap !important;
                    }
                    .harclar-sidebar-left {
                        display: none !important;
                    }
                    .harclar-sidebar-right {
                        width: 100% !important;
                        max-width: 100% !important;
                        position: static !important;
                    }
                }
                @media (max-width: 768px) {
                    .harclar-hero {
                        padding-left: 16px !important;
                        padding-right: 16px !important;
                    }
                    .harclar-hero h1 {
                        font-size: 24px !important;
                    }
                    .harclar-layout {
                        padding: 16px !important;
                        gap: 16px !important;
                    }
                    .harclar-hide-mobile {
                        display: none !important;
                    }
                    .harclar-sidebar-right {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
