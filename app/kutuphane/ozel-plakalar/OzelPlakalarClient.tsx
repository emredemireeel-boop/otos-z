"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Briefcase, Info, ArrowLeft, Map as MapIcon, Globe } from "lucide-react";
import Link from "next/link";
import plakaData from "@/data/plaka_kodlari.json";

export default function OzelPlakalarClient() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />
            
            <main style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 60px 24px' }}>
                <Link href="/kutuphane?kategori=plaka-kodlari" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '24px', textDecoration: 'none', fontWeight: '600' }}>
                    <ArrowLeft size={16} /> Kütüphaneye Dön
                </Link>

                <div style={{
                    background: 'linear-gradient(135deg, #1E1B4B, #4338CA)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '48px',
                    marginBottom: '40px',
                    boxShadow: '0 20px 40px rgba(67, 56, 202, 0.2)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)',
                        margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)'
                    }}>
                        <Award size={40} color="#FBBF24" />
                    </div>
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>Özel ve Resmi Plakalar</h1>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' }}>
                        Türkiye'de sivil plakalar dışında devlet görevlilerine, diplomatlara, emniyet güçlerine ve özel durumlara tahsis edilen çeşitli renk ve formatlarda plakalar bulunmaktadır. Bu plakaların kimlere verildiğini ve ne anlama geldiğini keşfedin.
                    </p>
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
                    <button
                        style={{
                            padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                            background: '#8B5CF6',
                            color: 'white',
                            border: '1px solid #8B5CF6',
                            cursor: 'default', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                        }}>
                        <Award size={16} /> Resmi ve Özel Plakalar
                    </button>
                    <Link href="/kutuphane/ulke-plakalari" style={{ textDecoration: 'none' }}>
                        <button
                            style={{
                                padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                                background: 'var(--card-bg)',
                                color: 'var(--foreground)',
                                border: '1px solid var(--card-border)',
                                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00C9B8'; e.currentTarget.style.color = '#00C9B8'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--foreground)'; }}
                        >
                            <Globe size={16} /> Ülke Plaka Kodları
                        </button>
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {plakaData.ozelPlakalar.map((plaka) => (
                        <Link href={`/kutuphane/plaka/${plaka.id}`} key={plaka.id} style={{ textDecoration: 'none', display: 'block' }}>
                            <div style={{
                                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%',
                                transition: 'all 0.3s', cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = plaka.renkKodu !== '#FFFFFF' ? plaka.renkKodu : 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                {/* Plaka Görseli Reprodüksiyonu */}
                                <div style={{
                                    background: plaka.renkKodu, color: plaka.yaziRengi,
                                    border: plaka.renkKodu === '#FFFFFF' ? '2px solid #000' : '2px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px', padding: '20px', marginBottom: '24px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: `0 4px 15px ${plaka.renkKodu}40`, position: 'relative', overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40px', background: '#2563EB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '4px' }}>
                                        <span style={{ color: 'white', fontSize: '10px', fontWeight: '800' }}>TR</span>
                                    </div>
                                    <span style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '4px', marginLeft: '30px' }}>
                                        {plaka.ornek || (plaka.harfGruplari ? `34 ${plaka.harfGruplari[0]} 123` : '34 ABC 123')}
                                    </span>
                                </div>

                                <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px' }}>
                                    {plaka.isim}
                                </h2>
                                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                                    {plaka.anlam}
                                </p>

                                <div style={{ background: 'var(--background)', borderRadius: '12px', padding: '16px', marginTop: 'auto', border: '1px solid var(--border-subtle)' }}>
                                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>
                                        <Briefcase size={16} color="var(--primary)" /> Kimler Kullanabilir?
                                    </h3>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {plaka.kullananlar.map((kisi, idx) => (
                                            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                                <span style={{ color: 'var(--primary)', marginTop: '2px' }}>•</span> {kisi}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
