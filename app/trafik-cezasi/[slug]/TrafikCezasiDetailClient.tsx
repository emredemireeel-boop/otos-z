"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ShieldAlert, FileText, AlertTriangle, CheckCircle, ExternalLink, Info, BadgeAlert, Coins, Gavel, ChevronDown, ChevronRight, Scale, Clock, BookOpen, HelpCircle } from "lucide-react";
import Link from "next/link";

interface TrafikCezasiDetailClientProps {
    cezaItem: any;
    kategori: string;
    ilgiliCezalar?: any[];
}

function FAQAccordion({ faq }: { faq: { soru: string; cevap: string }[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {faq.map((item, idx) => (
                <div key={idx} style={{
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: openIndex === idx ? 'rgba(59, 130, 246, 0.03)' : 'transparent',
                    transition: 'all 0.2s ease'
                }}>
                    <button
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        style={{
                            width: '100%',
                            padding: '16px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            color: 'var(--foreground)',
                            fontSize: '15px',
                            fontWeight: '600',
                            lineHeight: '1.5'
                        }}
                    >
                        <span style={{ flex: 1 }}>{item.soru}</span>
                        <span style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: openIndex === idx ? 'var(--primary)' : 'var(--secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.2s ease'
                        }}>
                            <ChevronDown
                                size={16}
                                color={openIndex === idx ? 'white' : 'var(--text-muted)'}
                                style={{
                                    transform: openIndex === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease'
                                }}
                            />
                        </span>
                    </button>
                    {openIndex === idx && (
                        <div style={{
                            padding: '0 20px 16px',
                            fontSize: '14px',
                            color: 'var(--text-muted)',
                            lineHeight: '1.7',
                            animation: 'fadeIn 0.2s ease'
                        }}>
                            {item.cevap}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function TrafikCezasiDetailClient({ cezaItem, kategori, ilgiliCezalar = [] }: TrafikCezasiDetailClientProps) {
    const router = useRouter();

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: '60px' }}>
                {/* Breadcrumb */}
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px 24px 0' }}>
                    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Ana Sayfa</Link>
                        <ChevronRight size={14} />
                        <Link href="/kutuphane" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Kütüphane</Link>
                        <ChevronRight size={14} />
                        <Link href="/kutuphane?kategori=trafik-cezalari" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Trafik Cezaları</Link>
                        <ChevronRight size={14} />
                        <span style={{ color: 'var(--foreground)', fontWeight: '600' }}>{cezaItem.ihlal}</span>
                    </nav>
                </div>

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
                            <ArrowLeft size={16} /> Tüm Cezalara Dön
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
                                    {cezaItem.kanunMaddesi && (
                                        <span style={{
                                            padding: '6px 12px',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            color: '#10B981',
                                            fontSize: '12px',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            border: '1px solid rgba(16, 185, 129, 0.2)'
                                        }}>
                                            {cezaItem.kanunMaddesi}
                                        </span>
                                    )}
                                </div>
                                <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px', lineHeight: '1.3' }}>
                                    {cezaItem.ihlal} Cezası 2026
                                </h1>
                                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                                    {cezaItem.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: '1000px', margin: '-30px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>

                    {/* Ceza Özeti Kartları */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Coins size={22} color="#F59E0B" />
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>Ceza Tutarı</p>
                                <p style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>{cezaItem.ceza}</p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <BadgeAlert size={22} color="#3B82F6" />
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>Ehliyet Yaptırımı</p>
                                <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>{cezaItem.ehliyet}</p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Gavel size={22} color="#EF4444" />
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>Araç Men</p>
                                <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>{cezaItem.arac}</p>
                            </div>
                        </div>

                        {cezaItem.erkenOdemeIndirimi && (
                            <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Clock size={22} color="#10B981" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>Erken Ödeme</p>
                                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#10B981', margin: 0 }}>{cezaItem.erkenOdemeIndirimi}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', alignItems: 'start' }}>
                        {/* Sol Kolon: Detaylar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {/* Detaylı Açıklama */}
                            {cezaItem.detayliAciklama && (
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '32px'
                                }}>
                                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <BookOpen style={{ color: 'var(--primary)' }} size={22} />
                                        Detaylı Bilgi ve Kanun Maddesi
                                    </h2>
                                    <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.8', margin: 0 }}>
                                        {cezaItem.detayliAciklama}
                                    </p>
                                </div>
                            )}

                            {/* Ne Yapılmalı */}
                            <div style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '32px'
                            }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle style={{ color: '#10B981' }} size={22} />
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

                            {/* İtiraz Bilgisi */}
                            {cezaItem.itirazBilgisi && (
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '32px'
                                }}>
                                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Scale style={{ color: '#8B5CF6' }} size={22} />
                                        İtiraz Süreci
                                    </h2>
                                    <div style={{
                                        background: 'rgba(139, 92, 246, 0.05)',
                                        borderLeft: '4px solid #8B5CF6',
                                        padding: '16px',
                                        borderRadius: '0 8px 8px 0',
                                        color: 'var(--foreground)',
                                        fontSize: '15px',
                                        lineHeight: '1.7'
                                    }}>
                                        {cezaItem.itirazBilgisi}
                                    </div>

                                    {cezaItem.tekrarCezasi && (
                                        <div style={{
                                            marginTop: '16px',
                                            background: 'rgba(239, 68, 68, 0.05)',
                                            borderLeft: '4px solid #EF4444',
                                            padding: '16px',
                                            borderRadius: '0 8px 8px 0',
                                            color: 'var(--foreground)',
                                            fontSize: '14px',
                                            lineHeight: '1.6'
                                        }}>
                                            <strong style={{ color: '#EF4444' }}>⚠️ Tekrar Durumu:</strong>{' '}
                                            {cezaItem.tekrarCezasi}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* FAQ Section */}
                            {cezaItem.faq && cezaItem.faq.length > 0 && (
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '32px'
                                }}>
                                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <HelpCircle style={{ color: '#F59E0B' }} size={22} />
                                        Sıkça Sorulan Sorular
                                    </h2>
                                    <FAQAccordion faq={cezaItem.faq} />
                                </div>
                            )}

                            {/* Tags */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {cezaItem.tags?.map((tag: string, idx: number) => (
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Erken Ödeme */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                borderRadius: '16px',
                                padding: '24px'
                            }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Clock size={18} color="#10B981" />
                                    Erken Ödeme İndirimi
                                </h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '0' }}>
                                    Trafik cezalarını tebliğ tarihinden itibaren <strong style={{ color: 'var(--foreground)' }}>1 ay içerisinde</strong> öderseniz, <strong style={{ color: '#10B981' }}>%25 erken ödeme indirimi</strong> uygulanır.
                                </p>
                            </div>

                            {/* e-Devlet Sorgulama */}
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

                            {/* İlgili Cezalar */}
                            {ilgiliCezalar && ilgiliCezalar.length > 0 && (
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '20px'
                                }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '14px' }}>İlgili Cezalar</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {ilgiliCezalar.map((c, idx) => (
                                            <Link key={idx} href={`/trafik-cezasi/${c.slug}`} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '12px',
                                                background: 'var(--secondary)',
                                                borderRadius: '10px',
                                                textDecoration: 'none',
                                                transition: 'all 0.2s',
                                                border: '1px solid transparent'
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; }}
                                            >
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {c.ihlal}
                                                    </p>
                                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Madde {c.madde}</p>
                                                </div>
                                                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                                                    {c.ceza}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tüm Cezalar */}
                            <div style={{
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '20px'
                            }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>Tüm Trafik Cezaları</h3>
                                <Link href="/kutuphane?kategori=trafik-cezalari" style={{
                                    display: 'inline-block',
                                    fontSize: '14px',
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    fontWeight: '600'
                                }}>
                                    2026 Güncel Ceza Tablosunu Gör →
                                </Link>
                            </div>

                            {/* Yasal Uyarı */}
                            <div style={{
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '12px',
                                padding: '16px'
                            }}>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                                    <strong>⚖️ Yasal Not:</strong> Bu sayfadaki bilgiler 2918 sayılı Karayolları Trafik Kanunu ve ilgili yönetmelikler kapsamında bilgilendirme amaçlı hazırlanmıştır. Kesin ve güncel bilgi için Emniyet Genel Müdürlüğü veya yetkili makamlara başvurunuz. © OtoSöz
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (max-width: 768px) {
                    div[style*="grid-template-columns: 1fr 350px"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
