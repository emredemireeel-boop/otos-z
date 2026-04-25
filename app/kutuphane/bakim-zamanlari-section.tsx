"use client";

import { useState } from "react";
import { Fuel, Battery, Settings, Zap, ShieldCheck, PenTool } from "lucide-react";
import Link from "next/link";

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
                        { text: "Motor Yağı Değişimi", slug: "motor-yagi-degisimi" },
                        { text: "Yağ Filtresi Değişimi", slug: "yag-filtresi-degisimi" },
                        { text: "Hava Filtresi Değişimi", slug: "hava-filtresi-degisimi" },
                        { text: "Polen Filtresi Değişimi", slug: "polen-filtresi-degisimi" },
                        { text: "Alt Takım ve Fren Balatası Kontrolü", slug: "fren-balatasi-kontrolu" }
                    ]
                },
                {
                    km: "30.000 - 40.000 km",
                    time: "2 - 3 Yıl",
                    items: [
                        { text: "Buji Değişimi (İridyum bujilerde 60-90 bin km olabilir)", slug: "buji-degisimi" },
                        { text: "Fren Hidroliği Değişimi (Neme bağlı kaynama noktasını korumak için)", slug: "fren-hidroligi-degisimi" },
                        { text: "Yakıt Filtresi Kontrolü/Değişimi", slug: "yakit-filtresi-degisimi" }
                    ]
                },
                {
                    km: "60.000 - 90.000 km",
                    time: "4 - 5 Yıl",
                    items: [
                        { text: "Triger Kayışı ve Rulman Seti Değişimi (Zincir ise sadece kontrol)", slug: "triger-kayisi-degisimi" },
                        { text: "V Kayışı Değişimi", slug: "v-kayisi-degisimi" },
                        { text: "Şanzıman Yağı Değişimi (Özellikle otomatik şanzımanlarda)", slug: "sanziman-yagi-degisimi" },
                        { text: "Motor Soğutma Sıvısı (Antifriz) Değişimi", slug: "motor-sogutma-sivisi-antifriz-degisimi" }
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
                        { text: "Motor Yağı Değişimi (DPF uyumlu partiküllü yağ olmalı)", slug: "motor-yagi-degisimi" },
                        { text: "Yağ Filtresi Değişimi", slug: "yag-filtresi-degisimi" },
                        { text: "Hava Filtresi Değişimi (Dizeller havaya çok hassastır)", slug: "hava-filtresi-degisimi" },
                        { text: "Polen Filtresi Değişimi", slug: "polen-filtresi-degisimi" }
                    ]
                },
                {
                    km: "20.000 - 30.000 km",
                    time: "2 Yıl",
                    items: [
                        { text: "Yakıt (Mazot) Filtresi Değişimi (Kötü yakıt enjektörleri bozabilir)", slug: "yakit-filtresi-degisimi" },
                        { text: "Fren Hidroliği Değişimi", slug: "fren-hidroligi-degisimi" }
                    ]
                },
                {
                    km: "80.000 - 120.000 km",
                    time: "4 - 5 Yıl",
                    items: [
                        { text: "Triger Kayışı ve Devirdaim (Su Pompası) Değişimi", slug: "triger-kayisi-degisimi" },
                        { text: "Kızdırma (Isıtma) Bujileri Kontrolü ve Değişimi", slug: "kizdirma-bujisi-kontrolu" },
                        { text: "DPF (Dizel Partikül Filtresi) Doluluk Kontrolü ve Rejenerasyonu", slug: "dpf-doluluk-kontrolu" },
                        { text: "EGR Valfi Temizliği", slug: null }
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
                        { text: "LPG Gaz ve Sıvı Faz Filtreleri Değişimi", slug: "lpg-filtreleri-degisimi" },
                        { text: "LPG Sistemi Sızdırmazlık Kontrolü", slug: null },
                        { text: "Motor Yağı ve Klasik Filtrelerin Değişimi (Benzin periyodu ile aynı)", slug: "motor-yagi-degisimi" }
                    ]
                },
                {
                    km: "20.000 - 30.000 km",
                    time: "2 Yıl",
                    items: [
                        { text: "Buji Değişimi (LPG yüksek ısıda yandığı için bujiler normalden hızlı erir)", slug: "buji-degisimi" },
                        { text: "LPG Enjektörleri ve Regülatör (Beyin) Basınç Kontrolü", slug: null },
                        { text: "AFR (Hava/Yakıt Karışımı) Ayarı Kontrolü", slug: null }
                    ]
                },
                {
                    km: "100.000 km",
                    time: "10 Yıl",
                    items: [
                        { text: "LPG Tankı Değişimi (Yasal zorunluluktur, ömrü 10 yıldır)", slug: null },
                        { text: "Muayene öncesi sızdırmazlık raporu alınması (Tadilat varsa)", slug: null }
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
                        { text: "İçten Yanmalı Motor Yağı ve Filtresi Değişimi", slug: "motor-yagi-degisimi" },
                        { text: "Hava ve Polen Filtresi Değişimi", slug: "hava-filtresi-degisimi" },
                        { text: "Hibrit Batarya Fan Filtresi Temizliği (Batarya soğutması için çok önemlidir)", slug: null }
                    ]
                },
                {
                    km: "30.000 - 60.000 km",
                    time: "2 - 4 Yıl",
                    items: [
                        { text: "Fren Hidroliği Değişimi", slug: "fren-hidroligi-degisimi" },
                        { text: "Fren Balatası Kontrolü (Rejeneratif frenleme sayesinde balatalar 100.000 km'den fazla dayanabilir)", slug: "fren-balatasi-kontrolu" }
                    ]
                },
                {
                    km: "90.000 - 150.000 km",
                    time: "5 - 10 Yıl",
                    items: [
                        { text: "İnvertör Soğutma Sıvısı Değişimi", slug: "motor-sogutma-sivisi-antifriz-degisimi" },
                        { text: "Hibrit Batarya Sağlık (SOH) Kontrolü (Genellikle 10 yıl / 160.000 km garantilidir)", slug: null }
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
                        { text: "Polen Filtresi (Kabin Filtresi) Değişimi", slug: "polen-filtresi-degisimi" },
                        { text: "Silecek Süpürgeleri Değişimi ve Cam Suyu Eklenmesi", slug: null },
                        { text: "Yazılım Güncellemeleri ve Arıza Tespit Taraması", slug: null },
                        { text: "Yüksek Voltaj Kablolarının Fiziksel Kontrolü", slug: null }
                    ]
                },
                {
                    km: "60.000 - 80.000 km",
                    time: "3 - 4 Yıl",
                    items: [
                        { text: "Fren Hidroliği Değişimi", slug: "fren-hidroligi-degisimi" },
                        { text: "Batarya Termal Yönetim Soğutma Sıvısı Kontrolü/Değişimi", slug: "motor-sogutma-sivisi-antifriz-degisimi" }
                    ]
                },
                {
                    km: "Uzun Vadeli",
                    time: "Kullanıma Bağlı",
                    items: [
                        { text: "Fren Balatası Değişimi (150.000+ km gidebilir, tek pedal sürüş sayesinde)", slug: "fren-balatasi-kontrolu" },
                        { text: "Batarya Sağlık Durumu (SOH) Raporlanması", slug: null }
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
                                            {item.slug ? (
                                                <Link href={`/bakim-rehberi/${item.slug}`} style={{ fontSize: '14px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                                                    {item.text}
                                                </Link>
                                            ) : (
                                                <span style={{ fontSize: '14px', color: 'var(--foreground)' }}>{item.text}</span>
                                            )}
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
