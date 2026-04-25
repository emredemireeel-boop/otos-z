"use Map";
"use client";

import { useState, useMemo } from "react";
import { Search, Map as MapIcon, Award } from "lucide-react";
import Link from "next/link";
import plakaData from "@/data/plaka_kodlari.json";

export default function PlakaKodlariSection() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredIller = useMemo(() => {
        if (!searchQuery) return plakaData.iller;
        const query = searchQuery.toLowerCase('tr');
        return plakaData.iller.filter(il => 
            il.il.toLowerCase('tr').includes(query) || 
            il.kod.includes(query) ||
            il.bolge.toLowerCase('tr').includes(query)
        );
    }, [searchQuery]);

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
                    <MapIcon size={32} color="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Türkiye Plaka Kodları ve Özel Plakalar</h2>
                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                        01'den 81'e kadar tüm il plaka kodlarını hızlıca arayın. Kırmızı, Yeşil, Sarı ve Mavi plakaların kimlere verildiğini ve anlamlarını öğrenin.
                    </p>
                </div>
            </div>

            {/* İç Menü */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px', overflowX: 'auto' }}>
                <button
                    style={{
                        padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                        background: '#EF4444',
                        color: 'white',
                        border: '1px solid #EF4444',
                        cursor: 'default', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                    <MapIcon size={16} /> İl Plaka Kodları (01-81)
                </button>
                <Link href="/kutuphane/ozel-plakalar" style={{ textDecoration: 'none' }}>
                    <button
                        style={{
                            padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                            background: 'var(--card-bg)',
                            color: 'var(--foreground)',
                            border: '1px solid var(--card-border)',
                            cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#8B5CF6'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--foreground)'; }}
                    >
                        <Award size={16} /> Resmi ve Özel Plakalar
                    </button>
                </Link>
            </div>

            {/* İl Plaka Kodları Tab'ı */}
            <div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                    borderRadius: '12px', marginBottom: '24px', maxWidth: '500px'
                }}>
                    <Search style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="İl adı, plaka kodu veya bölge ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1, background: 'transparent', border: 'none', outline: 'none',
                            color: 'var(--foreground)', fontSize: '15px'
                        }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {filteredIller.map((il, idx) => {
                        const slug = `${il.kod}-${il.il.toLowerCase('tr').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c')}-plaka-kodu`;
                        return (
                            <Link href={`/kutuphane/plaka/${slug}`} key={idx} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                    borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px',
                                    transition: 'all 0.2s', cursor: 'pointer', height: '100%'
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '10px', background: 'var(--background)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)'
                                    }}>
                                        <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)' }}>{il.kod}</span>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>{il.il}</h3>
                                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{il.bolge} Bölgesi</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                {filteredIller.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <MapIcon size={48} style={{ opacity: 0.3, margin: '0 auto 16px auto' }} />
                        <p>Aradığınız kritere uygun plaka kodu bulunamadı.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
