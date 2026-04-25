"use client";

import { useState, useEffect } from "react";
import { Car, Truck, Anchor, Navigation, AlertCircle, Bus, Info } from "lucide-react";
import Link from "next/link";

export default function OtoyolUcretleriSection() {
    const [activeVehicleType, setActiveVehicleType] = useState<number>(1);
    const [tollDataRaw, setTollDataRaw] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/data/otoyol_ucretleri.json')
            .then(res => res.json())
            .then(data => {
                setTollDataRaw(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load toll data", err);
                setIsLoading(false);
            });
    }, []);

    // Araç Sınıfları: 
    // 1: Otomobil
    // 2: Minibüs/Kamyonet
    // 3: 3 Akslı Yolcu Otobüsü
    // 4: 4-5 Akslı Kamyon/Tır
    // 5: 6+ Akslı Tır
    // 6: Motosiklet

    const vehicleTypes = [
        { id: 1, label: "Otomobil", icon: Car },
        { id: 2, label: "Minibüs", icon: Truck },
        { id: 3, label: "Otobüs", icon: Bus },
        { id: 4, label: "Kamyon", icon: Truck },
        { id: 5, label: "Tır", icon: Truck },
        { id: 6, label: "Motosiklet", icon: Anchor }, // Anchor placeholder for Moto
    ];

    // Grouping the raw data
    const groupedData = tollDataRaw.reduce((acc: any, curr: any) => {
        const groupIndex = acc.findIndex((g: any) => g.group === curr.group);
        if (groupIndex === -1) {
            acc.push({ group: curr.group, items: [curr] });
        } else {
            acc[groupIndex].items.push(curr);
        }
        return acc;
    }, []);

    return (
        <div style={{ userSelect: 'none' }}>
            <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', margin: '0 0 4px 0' }}>Otoyol ve Köprü Geçiş Ücretleri (2026)</h2>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Türkiye geneli köprü, otoyol ve tünel güncel geçiş ücretleri</p>
                    </div>
                </div>
            </div>

            {/* Araç Sınıfı Seçimi */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                {vehicleTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                        <button
                            key={type.id}
                            onClick={() => setActiveVehicleType(type.id)}
                            style={{
                                padding: '10px 16px',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: activeVehicleType === type.id ? 'var(--primary)' : 'var(--secondary)',
                                color: activeVehicleType === type.id ? 'white' : 'var(--foreground)',
                                transition: 'all 0.2s',
                                border: `1px solid ${activeVehicleType === type.id ? 'var(--primary)' : 'var(--card-border)'}`
                            }}
                        >
                            <Icon size={16} />
                            {type.label} <span style={{ fontSize: '11px', opacity: 0.7 }}>Sınıf {type.id}</span>
                        </button>
                    )
                })}
            </div>

            {isLoading && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Veriler yükleniyor...</div>}

            {/* Fiyat Tabloları */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {groupedData.map((group: any, idx: number) => (
                    <div key={idx} style={{ 
                        background: 'var(--card-bg)', 
                        border: '1px solid var(--card-border)', 
                        borderRadius: '16px', 
                        overflow: 'hidden' 
                    }}>
                        <div style={{ 
                            padding: '12px 20px', 
                            background: 'var(--secondary)', 
                            borderBottom: '1px solid var(--card-border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <Navigation size={18} color="var(--primary)" />
                            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                                {group.group}
                            </h3>
                        </div>

                        <div style={{ padding: '0' }}>
                            {group.items.map((item: any, itemIdx: number) => {
                                const price = item.prices[activeVehicleType];
                                return (
                                    <Link key={itemIdx} href={`/kutuphane/otoyol-ucretleri/${item.id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            padding: '16px 20px',
                                            borderBottom: itemIdx !== group.items.length - 1 ? '1px solid var(--card-border)' : 'none',
                                            transition: 'background 0.2s'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div>
                                                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {item.name}
                                                    <Info size={14} color="var(--primary)" />
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                    {item.desc}
                                                </div>
                                            </div>
                                            <div style={{ 
                                                fontSize: '18px', 
                                                fontWeight: '800', 
                                                color: '#22C55E',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {price ? `${price.toFixed(2)} ₺` : 'Yasaklı'}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Uyarı */}
            <div style={{ marginTop: '24px', padding: '16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <AlertCircle size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
                    Yukarıdaki ücretler 2026 yılı Karayolları Genel Müdürlüğü (KGM) ve özel otoyol işletmeleri tarifelerine göre derlenmiştir. HGS (Hızlı Geçiş Sistemi) bakiyenizin yeterli olduğundan emin olunuz. İhlalli (kaçak) geçişlerde geçiş ücretinin 4 katı idari para cezası uygulanmaktadır. Detaylı bilgi, yasaklar ve geçiş kuralları için otoyol / köprü ismine tıklayabilirsiniz.
                </p>
            </div>
        </div>
    );
}
