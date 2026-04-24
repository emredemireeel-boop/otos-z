"use client";

import { useState } from "react";
import { Fuel, Battery, Settings, Zap, ShieldCheck, PenTool } from "lucide-react";

export default function BakimZamanlariSection() {
    const [activeFuelType, setActiveFuelType] = useState<string>("Benzin");

    const maintenanceData = [
        {
            id: "Benzin",
            label: "Benzinli Araçlar",
            icon: Fuel,
            color: "#EF4444",
            description: "Benzinli araçlarda motor yağı ve bujilerin durumu ateşleme sağlığı için kritik öneme sahiptir.",
            intervals: [
                {
                    km: "10.000 - 15.000 km",
                    time: "1 Yıl (Hangisi önce dolarsa)",
                    items: [
                        "Motor Yağı Değişimi",
                        "Yağ Filtresi Değişimi",
                        "Hava Filtresi Değişimi",
                        "Polen Filtresi Değişimi",
                        "Alt Takım ve Fren Balatası Kontrolü"
                    ]
                },
                {
                    km: "30.000 - 40.000 km",
                    time: "2 - 3 Yıl",
                    items: [
                        "Buji Değişimi (İridyum bujilerde 60-90 bin km olabilir)",
                        "Fren Hidroliği Değişimi (Neme bağlı kaynama noktasını korumak için)",
                        "Yakıt Filtresi Kontrolü/Değişimi"
                    ]
                },
                {
                    km: "60.000 - 90.000 km",
                    time: "4 - 5 Yıl",
                    items: [
                        "Triger Kayışı ve Rulman Seti Değişimi (Zincir ise sadece kontrol)",
                        "V Kayışı Değişimi",
                        "Şanzıman Yağı Değişimi (Özellikle otomatik şanzımanlarda)",
                        "Motor Soğutma Sıvısı (Antifriz) Değişimi"
                    ]
                }
            ]
        },
        {
            id: "Dizel",
            label: "Dizel Araçlar",
            icon: Settings,
            color: "#10B981",
            description: "Dizel araçlarda yüksek basınçlı sistemler kullanıldığı için yakıt ve hava filtrelerinin temizliği hayati önem taşır.",
            intervals: [
                {
                    km: "10.000 - 15.000 km",
                    time: "1 Yıl (Hangisi önce dolarsa)",
                    items: [
                        "Motor Yağı Değişimi (DPF uyumlu partiküllü yağ olmalı)",
                        "Yağ Filtresi Değişimi",
                        "Hava Filtresi Değişimi (Dizeller havaya çok hassastır)",
                        "Polen Filtresi Değişimi"
                    ]
                },
                {
                    km: "20.000 - 30.000 km",
                    time: "2 Yıl",
                    items: [
                        "Yakıt (Mazot) Filtresi Değişimi (Kötü yakıt enjektörleri bozabilir)",
                        "Fren Hidroliği Değişimi"
                    ]
                },
                {
                    km: "80.000 - 120.000 km",
                    time: "4 - 5 Yıl",
                    items: [
                        "Triger Kayışı ve Devirdaim (Su Pompası) Değişimi",
                        "Kızdırma (Isıtma) Bujileri Kontrolü ve Değişimi",
                        "DPF (Dizel Partikül Filtresi) Doluluk Kontrolü ve Rejenerasyonu",
                        "EGR Valfi Temizliği"
                    ]
                }
            ]
        },
        {
            id: "LPG",
            label: "LPG / Otogaz",
            icon: ShieldCheck,
            color: "#F59E0B",
            description: "LPG kuru bir yakıt olduğu için motor daha yüksek ısılarda çalışır. Benzine ek olarak LPG sisteminin de kendi bakımları vardır.",
            intervals: [
                {
                    km: "10.000 km",
                    time: "1 Yıl (Hangisi önce dolarsa)",
                    items: [
                        "LPG Gaz ve Sıvı Faz Filtreleri Değişimi",
                        "LPG Sistemi Sızdırmazlık Kontrolü",
                        "Motor Yağı ve Klasik Filtrelerin Değişimi (Benzin periyodu ile aynı)"
                    ]
                },
                {
                    km: "20.000 - 30.000 km",
                    time: "2 Yıl",
                    items: [
                        "Buji Değişimi (LPG yüksek ısıda yandığı için bujiler normalden hızlı erir)",
                        "LPG Enjektörleri ve Regülatör (Beyin) Basınç Kontrolü",
                        "AFR (Hava/Yakıt Karışımı) Ayarı Kontrolü"
                    ]
                },
                {
                    km: "100.000 km",
                    time: "10 Yıl",
                    items: [
                        "LPG Tankı Değişimi (Yasal zorunluluktur, ömrü 10 yıldır)",
                        "Muayene öncesi sızdırmazlık raporu alınması (Tadilat varsa)"
                    ]
                }
            ]
        },
        {
            id: "Hibrit",
            label: "Hibrit Araçlar",
            icon: Zap,
            color: "#3B82F6",
            description: "Hibrit araçlarda hem içten yanmalı motorun standart bakımları, hem de elektrik sisteminin kontrolleri yapılır.",
            intervals: [
                {
                    km: "15.000 km",
                    time: "1 Yıl (Hangisi önce dolarsa)",
                    items: [
                        "İçten Yanmalı Motor Yağı ve Filtresi Değişimi",
                        "Hava ve Polen Filtresi Değişimi",
                        "Hibrit Batarya Fan Filtresi Temizliği (Batarya soğutması için çok önemlidir)"
                    ]
                },
                {
                    km: "30.000 - 60.000 km",
                    time: "2 - 4 Yıl",
                    items: [
                        "Fren Hidroliği Değişimi",
                        "Fren Balatası Kontrolü (Rejeneratif frenleme sayesinde balatalar 100.000 km'den fazla dayanabilir)"
                    ]
                },
                {
                    km: "90.000 - 150.000 km",
                    time: "5 - 10 Yıl",
                    items: [
                        "İnvertör Soğutma Sıvısı Değişimi",
                        "Hibrit Batarya Sağlık (SOH) Kontrolü (Genellikle 10 yıl / 160.000 km garantilidir)"
                    ]
                }
            ]
        },
        {
            id: "Elektrik",
            label: "Elektrikli (EV)",
            icon: Battery,
            color: "#8B5CF6",
            description: "Elektrikli araçlarda motor yağı, buji, kayış veya egzoz sistemi olmadığı için bakım maliyetleri içten yanmalılara göre %70 daha düşüktür.",
            intervals: [
                {
                    km: "15.000 - 30.000 km",
                    time: "1 - 2 Yıl (Markaya göre değişir)",
                    items: [
                        "Polen Filtresi (Kabin Filtresi) Değişimi",
                        "Silecek Süpürgeleri Değişimi ve Cam Suyu Eklenmesi",
                        "Yazılım Güncellemeleri ve Arıza Tespit Taraması",
                        "Yüksek Voltaj Kablolarının Fiziksel Kontrolü"
                    ]
                },
                {
                    km: "60.000 - 80.000 km",
                    time: "3 - 4 Yıl",
                    items: [
                        "Fren Hidroliği Değişimi",
                        "Batarya Termal Yönetim Soğutma Sıvısı Kontrolü/Değişimi"
                    ]
                },
                {
                    km: "Uzun Vadeli",
                    time: "Kullanıma Bağlı",
                    items: [
                        "Fren Balatası Değişimi (150.000+ km gidebilir, tek pedal sürüş sayesinde)",
                        "Batarya Sağlık Durumu (SOH) Raporlanması"
                    ]
                }
            ]
        }
    ];

    const activeData = maintenanceData.find(d => d.id === activeFuelType) || maintenanceData[0];

    return (
        <div style={{ userSelect: 'none' }}>
            <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', margin: '0 0 4px 0' }}>Araç Bakım Zamanları ve Takvimi</h2>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Yakıt türüne göre kilometre ve yıl bazlı periyodik bakım detayları</p>
                    </div>
                </div>
            </div>

            {/* Yakıt Türü Seçimi */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid var(--card-border)' }}>
                {maintenanceData.map((type) => {
                    const Icon = type.icon;
                    const isActive = activeFuelType === type.id;
                    return (
                        <button
                            key={type.id}
                            onClick={() => setActiveFuelType(type.id)}
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
                                background: isActive ? type.color : 'var(--secondary)',
                                color: isActive ? 'white' : 'var(--foreground)',
                                transition: 'all 0.2s',
                                border: `1px solid ${isActive ? type.color : 'var(--card-border)'}`
                            }}
                        >
                            <Icon size={18} />
                            {type.label}
                        </button>
                    )
                })}
            </div>

            {/* İçerik Kartı */}
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    opacity: 0.05,
                    pointerEvents: 'none'
                }}>
                    <activeData.icon size={200} />
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: activeData.color }}></span>
                    {activeData.label} Bakım Rehberi
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6', maxWidth: '80%' }}>
                    {activeData.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
                    {activeData.intervals.map((interval, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            gap: '16px',
                            background: 'var(--secondary)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '12px',
                            padding: '16px',
                            alignItems: 'flex-start'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--card-bg)',
                                border: `1px solid ${activeData.color}40`,
                                borderRadius: '10px',
                                padding: '12px',
                                minWidth: '120px',
                                flexShrink: 0
                            }}>
                                <span style={{ fontSize: '16px', fontWeight: '800', color: activeData.color }}>{interval.km}</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '600' }}>VEYA {interval.time}</span>
                            </div>

                            <div style={{ flex: 1 }}>
                                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {interval.items.map((item, itemIdx) => (
                                        <li key={itemIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                            <PenTool size={14} color={activeData.color} style={{ marginTop: '3px', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: 'var(--foreground)' }}>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Uyarı Notu */}
            <div style={{ marginTop: '24px', padding: '16px', background: 'var(--card-bg)', borderLeft: '4px solid #F59E0B', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
                    <strong>Önemli Not:</strong> Yukarıda belirtilen bakım periyotları genel endüstri standartlarıdır. Her aracın üreticisi tarafından belirlenen spesifik bakım kitapçığı (manuel) esas alınmalıdır. Garantisi devam eden araçlarda yetkili servis yönergelerine uyulması zorunludur.
                </p>
            </div>
        </div>
    );
}
