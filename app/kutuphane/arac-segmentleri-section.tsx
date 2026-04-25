"use client";

import { useState } from "react";
import { Car, Truck, GitMerge, Mountain, Wind, Box, Info, CheckCircle2, XCircle, Crown, Gem, Scale, MoveRight, HelpCircle, BookMarked } from "lucide-react";
import Link from "next/link";
import segmentData from "@/data/arac_segmentleri.json";

export default function AracSegmentleriSection() {
    const [activeTab, setActiveTab] = useState<'segmentler' | 'kasatipleri' | 'karsilastirma'>('segmentler');

    const getIcon = (name: string) => {
        switch (name) {
            case "Car": return <Car size={24} color="var(--primary)" />;
            case "Hatchback": return <Car size={24} color="var(--primary)" />; // Fallback since Lucide doesn't have a specific Hatchback icon
            case "Mountain": return <Mountain size={24} color="var(--primary)" />;
            case "GitMerge": return <GitMerge size={24} color="var(--primary)" />;
            case "Box": return <Box size={24} color="var(--primary)" />;
            case "Wind": return <Wind size={24} color="var(--primary)" />;
            case "Truck": return <Truck size={24} color="var(--primary)" />;
            
            case "car-small": return <Car size={20} color="var(--primary)" />;
            case "car": return <Car size={24} color="var(--primary)" />;
            case "car-medium": return <Car size={28} color="var(--primary)" />;
            case "car-large": return <Car size={32} color="var(--primary)" />;
            case "crown": return <Crown size={32} color="var(--primary)" />;
            case "gem": return <Gem size={32} color="var(--primary)" />;
            
            default: return <Info size={24} color="var(--primary)" />;
        }
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
                    <BookMarked size={32} color="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Araç Kasa Tipleri ve Segmentler</h2>
                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                        Otomobil dünyasındaki A, B, C, D segment kavramları ne anlama gelir? SUV ile Crossover arasındaki fark nedir? İhtiyacınıza en uygun kasa tipini ve sınıfı detaylı rehberimizle keşfedin.
                    </p>
                </div>
            </div>

            {/* İç Menü */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px', overflowX: 'auto' }}>
                <button
                    onClick={() => setActiveTab('segmentler')}
                    style={{
                        padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                        background: activeTab === 'segmentler' ? '#3B82F6' : 'var(--card-bg)',
                        color: activeTab === 'segmentler' ? 'white' : 'var(--foreground)',
                        border: activeTab === 'segmentler' ? '1px solid #3B82F6' : '1px solid var(--card-border)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                    <Crown size={16} /> Otomobil Segmentleri (A-F)
                </button>
                <button
                    onClick={() => setActiveTab('kasatipleri')}
                    style={{
                        padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                        background: activeTab === 'kasatipleri' ? '#10B981' : 'var(--card-bg)',
                        color: activeTab === 'kasatipleri' ? 'white' : 'var(--foreground)',
                        border: activeTab === 'kasatipleri' ? '1px solid #10B981' : '1px solid var(--card-border)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                    <Car size={16} /> Kasa Gövde Tipleri
                </button>
                <button
                    onClick={() => setActiveTab('karsilastirma')}
                    style={{
                        padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                        background: activeTab === 'karsilastirma' ? '#8B5CF6' : 'var(--card-bg)',
                        color: activeTab === 'karsilastirma' ? 'white' : 'var(--foreground)',
                        border: activeTab === 'karsilastirma' ? '1px solid #8B5CF6' : '1px solid var(--card-border)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                    <Scale size={16} /> Karşılaştırma Tablosu
                </button>
            </div>

            {/* Segmentler Tab'ı */}
            {activeTab === 'segmentler' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {segmentData.segments.map((segment) => (
                        <Link href={`/kutuphane/segment/${segment.id.toLowerCase()}-segmenti`} key={segment.id} style={{ textDecoration: 'none', display: 'block' }}>
                            <div style={{
                                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%',
                                transition: 'all 0.3s', cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#3B82F6' }}>{segment.id}</span>
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)' }}>{segment.title}</h3>
                            </div>
                            
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                                {segment.description}
                            </p>
                            
                            <div style={{ background: 'var(--background)', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                                <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Özellikler</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {segment.characteristics.map((char, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                            <MoveRight size={14} color="#3B82F6" style={{ marginTop: '2px', flexShrink: 0 }} />
                                            {char}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Popüler Örnekler</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {segment.examples.map((ex, i) => (
                                        <span key={i} style={{ fontSize: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#3B82F6', padding: '4px 10px', borderRadius: '6px', fontWeight: '600' }}>
                                            {ex}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Kasa Tipleri Tab'ı */}
            {activeTab === 'kasatipleri' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {segmentData.bodyTypes.map((type) => (
                        <Link href={`/kutuphane/kasa/${type.id}`} key={type.id} style={{ textDecoration: 'none', display: 'block' }}>
                            <div style={{
                                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                borderRadius: '16px', padding: '24px', transition: 'all 0.3s', cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                    {getIcon(type.imageIcon)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
                                        {type.title}
                                    </h3>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                                        {type.description}
                                    </p>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: '#10B981', marginBottom: '12px' }}>
                                                <CheckCircle2 size={16} /> Avantajları
                                            </h4>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {type.pros.map((pro, idx) => (
                                                    <li key={idx} style={{ fontSize: '13px', color: 'var(--foreground)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                                        <span style={{ color: '#10B981', marginTop: '2px' }}>•</span> {pro}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: '#EF4444', marginBottom: '12px' }}>
                                                <XCircle size={16} /> Dezavantajları
                                            </h4>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {type.cons.map((con, idx) => (
                                                    <li key={idx} style={{ fontSize: '13px', color: 'var(--foreground)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                                        <span style={{ color: '#EF4444', marginTop: '2px' }}>•</span> {con}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Karşılaştırma Tablosu */}
            {activeTab === 'karsilastirma' && (
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', background: 'rgba(139, 92, 246, 0.05)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Scale color="#8B5CF6" /> Kasa Tipleri Karşılaştırması
                        </h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px' }}>Farklı araç kasa tiplerinin güçlü ve zayıf yönlerini yan yana inceleyin.</p>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--background)' }}>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', color: 'var(--text-muted)', fontSize: '13px', borderBottom: '1px solid var(--card-border)', width: '20%' }}>Özellik</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '800', color: 'var(--foreground)', fontSize: '14px', borderBottom: '1px solid var(--card-border)', width: '20%' }}>Sedan</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '800', color: 'var(--foreground)', fontSize: '14px', borderBottom: '1px solid var(--card-border)', width: '20%' }}>Hatchback</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '800', color: 'var(--foreground)', fontSize: '14px', borderBottom: '1px solid var(--card-border)', width: '20%' }}>SUV</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '800', color: 'var(--foreground)', fontSize: '14px', borderBottom: '1px solid var(--card-border)', width: '20%' }}>Station Wagon</th>
                                </tr>
                            </thead>
                            <tbody>
                                {segmentData.comparisonTable.map((row, idx) => (
                                    <tr key={idx} style={{ background: idx % 2 === 0 ? 'transparent' : 'var(--background)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', borderBottom: '1px solid var(--card-border)' }}>{row.feature}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-muted)', borderBottom: '1px solid var(--card-border)' }}>{row.sedan}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-muted)', borderBottom: '1px solid var(--card-border)' }}>{row.hatchback}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-muted)', borderBottom: '1px solid var(--card-border)' }}>{row.suv}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-muted)', borderBottom: '1px solid var(--card-border)' }}>{row.stationWagon}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
