"use client";

import { useState } from "react";
import { Car, Truck, Anchor, Navigation, Calendar, AlertCircle } from "lucide-react";

export default function OtoyolUcretleriSection() {
    const [activeVehicleType, setActiveVehicleType] = useState<number>(1);

    // Araç Sınıfları: 
    // 1: Otomobil
    // 2: Minibüs/Kamyonet
    // 3: 3 Akslı Yolcu Otobüsü
    // 4: 4-5 Akslı Kamyon/Tır
    // 5: 6+ Akslı Tır
    // 6: Motosiklet

    const vehicleTypes = [
        { id: 1, label: "Otomobil (Sınıf 1)", icon: Car },
        { id: 2, label: "Minibüs (Sınıf 2)", icon: Truck },
        { id: 6, label: "Motosiklet (Sınıf 6)", icon: Anchor }, // Anchor placeholder for Moto
    ];

    const tollData = [
        {
            group: "KÖPRÜLER",
            items: [
                {
                    name: "15 Temmuz Şehitler ve FSM Köprüsü",
                    prices: { 1: 33.00, 2: 42.00, 6: 14.00 },
                    desc: "Tek yön ücretlendirilir."
                },
                {
                    name: "Yavuz Sultan Selim Köprüsü",
                    prices: { 1: 70.00, 2: 95.00, 6: 50.00 },
                    desc: "Çift yön ücretlendirilir."
                },
                {
                    name: "Osmangazi Köprüsü",
                    prices: { 1: 555.00, 2: 890.00, 6: 390.00 },
                    desc: "Gebze - Orhangazi güzergahı."
                },
                {
                    name: "1915 Çanakkale Köprüsü",
                    prices: { 1: 585.00, 2: 730.00, 6: 145.00 },
                    desc: "Malkara - Çanakkale güzergahı."
                }
            ]
        },
        {
            group: "TÜNELLER",
            items: [
                {
                    name: "Avrasya Tüneli (Gündüz)",
                    prices: { 1: 156.00, 2: 234.00, 6: 60.00 },
                    desc: "05:00 - 23:59 arası geçerlidir."
                },
                {
                    name: "Avrasya Tüneli (Gece)",
                    prices: { 1: 78.00, 2: 117.00, 6: 30.00 },
                    desc: "00:00 - 04:59 arası %50 indirimli."
                }
            ]
        },
        {
            group: "OTOYOLLAR (KGM)",
            items: [
                {
                    name: "Anadolu Otoyolu (Çamlıca İstasyonu - Akıncı)",
                    prices: { 1: 134.00, 2: 153.00, 6: 55.00 },
                    desc: "İstanbul - Ankara güzergahı."
                },
                {
                    name: "İzmir - Aydın Otoyolu",
                    prices: { 1: 40.00, 2: 48.00, 6: 18.00 },
                    desc: "Tam güzergah."
                },
                {
                    name: "Çukurova Otoyolları (Adana - Şanlıurfa)",
                    prices: { 1: 85.00, 2: 95.00, 6: 40.00 },
                    desc: "Tam güzergah."
                }
            ]
        },
        {
            group: "YAP-İŞLET-DEVRET OTOYOLLARI",
            items: [
                {
                    name: "İstanbul - İzmir Otoyolu (Osmangazi Köprüsü DAHİL)",
                    prices: { 1: 1370.00, 2: 2210.00, 6: 955.00 },
                    desc: "Tam güzergah toplamı."
                },
                {
                    name: "Kuzey Marmara Otoyolu (Avrupa Yakası)",
                    prices: { 1: 185.00, 2: 295.00, 6: 130.00 },
                    desc: "Kınalı - Odayeri güzergahı."
                },
                {
                    name: "Kuzey Marmara Otoyolu (Anadolu Yakası)",
                    prices: { 1: 275.00, 2: 440.00, 6: 195.00 },
                    desc: "Kurtköy - Akyazı güzergahı."
                }
            ]
        }
    ];

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
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px' }}>
                {vehicleTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                        <button
                            key={type.id}
                            onClick={() => setActiveVehicleType(type.id)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                border: 'none',
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
                            <Icon size={18} />
                            {type.label}
                        </button>
                    )
                })}
            </div>

            {/* Fiyat Tabloları */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {tollData.map((group, idx) => (
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
                            {group.items.map((item, itemIdx) => {
                                const price = (item.prices as any)[activeVehicleType];
                                return (
                                    <div key={itemIdx} style={{ 
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
                                            <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '4px' }}>
                                                {item.name}
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
                                            {price ? `${price.toFixed(2)} ₺` : 'Bilgi Yok'}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Uyarı */}
            <div style={{ marginTop: '24px', padding: '16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <AlertCircle size={20} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
                    Yukarıdaki ücretler 2026 yılı Karayolları Genel Müdürlüğü (KGM) ve özel otoyol işletmeleri tarifelerine göre <strong>Otomobil (1. Sınıf)</strong>, <strong>Minibüs (2. Sınıf)</strong> ve <strong>Motosiklet (6. Sınıf)</strong> için derlenmiştir. HGS (Hızlı Geçiş Sistemi) bakiyenizin yeterli olduğundan emin olunuz. İhlalli (kaçak) geçişlerde geçiş ücretinin 4 katı idari para cezası uygulanmaktadır.
                </p>
            </div>
        </div>
    );
}
