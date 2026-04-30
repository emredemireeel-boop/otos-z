"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Map as MapIcon, Award, Globe } from "lucide-react";
import Link from "next/link";
import ulkeData from "@/data/ulke_plaka_kodlari.json";

export default function UlkePlakalariClient() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUlkeler = useMemo(() => {
        if (!searchQuery) return ulkeData.ulkeler;
        const query = searchQuery.toLocaleLowerCase('tr');
        return ulkeData.ulkeler.filter(u => 
            u.ulke.toLocaleLowerCase('tr').includes(query) || 
            u.kod.toLocaleLowerCase('tr').includes(query) ||
            u.bolge.toLocaleLowerCase('tr').includes(query)
        );
    }, [searchQuery]);

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 40px', minHeight: '100vh' }}>
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
                        <Globe size={32} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Ülke Plaka Kodları</h2>
                        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                            Dünya genelindeki ülkelerin araç plaka kodları (TR, D, GB, vb.) ve bölgeleri.
                        </p>
                    </div>
                </div>

                {/* İç Menü */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px', overflowX: 'auto' }}>
                    <Link href="/kutuphane?kategori=plaka-kodlari" style={{ textDecoration: 'none' }}>
                        <button
                            style={{
                                padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                                background: 'var(--card-bg)',
                                color: 'var(--foreground)',
                                border: '1px solid var(--card-border)',
                                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--foreground)'; }}
                        >
                            <MapIcon size={16} /> İl Plaka Kodları (01-81)
                        </button>
                    </Link>
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
                    <button
                        style={{
                            padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                            background: '#00C9B8',
                            color: 'white',
                            border: '1px solid #00C9B8',
                            cursor: 'default', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                        }}>
                        <Globe size={16} /> Ülke Plaka Kodları
                    </button>
                </div>

                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                    borderRadius: '12px', marginBottom: '24px', maxWidth: '500px'
                }}>
                    <Search style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Ülke adı, plaka kodu veya bölge ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1, background: 'transparent', border: 'none', outline: 'none',
                            color: 'var(--foreground)', fontSize: '15px'
                        }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                    {filteredUlkeler.map((u, idx) => (
                        <div key={idx} style={{
                            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                            borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px',
                            transition: 'all 0.2s'
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '10px', background: 'var(--background)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)'
                            }}>
                                <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)' }}>{u.kod}</span>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>{u.ulke}</h3>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{u.bolge}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredUlkeler.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Globe size={48} style={{ opacity: 0.3, margin: '0 auto 16px auto' }} />
                        <p>Aradığınız kritere uygun ülke kodu bulunamadı.</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
