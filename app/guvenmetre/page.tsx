"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/data/guvenmetre";
import { Shield, Store, TrendingUp, Users, Award, ChevronRight, MapPin, X, Search } from "lucide-react";
import Link from "next/link";

// Türkiye'nin 81 ili
const SEHIRLER = [
    "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir",
    "Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli",
    "Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari",
    "Hatay","Isparta","İçel (Mersin)","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırşehir","Kocaeli",
    "Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir","Niğde",
    "Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Şanlıurfa","Şırnak","Tekirdağ",
    "Tokat","Trabzon","Tunceli","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman",
    "Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce"
];

const CITY_REQUIRED = ["private_service", "authorized_service", "car_wash", "dealers", "spare_parts"];

export default function GuvenmetrePage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
    const [cityModal, setCityModal] = useState<{ categoryId: string; title: string } | null>(null);
    const [citySearch, setCitySearch] = useState("");
    const router = useRouter();

    const categoryTypes = ["Tümü", "Hizmet", "Ürün", "Servis", "Alışveriş"];

    const filteredCategories = selectedCategory === "Tümü"
        ? categories
        : categories.filter(c => {
            if (selectedCategory === "Hizmet") return ["fuel_stations", "car_wash", "expertise"].includes(c.id);
            if (selectedCategory === "Servis") return ["private_service", "authorized_service"].includes(c.id);
            if (selectedCategory === "Ürün") return ["spare_parts", "accessories"].includes(c.id);
            return true;
        });

    const handleCategoryClick = (e: React.MouseEvent, categoryId: string, title: string) => {
        if (CITY_REQUIRED.includes(categoryId)) {
            e.preventDefault();
            setCityModal({ categoryId, title });
            setCitySearch("");
        }
    };

    const filteredCities = SEHIRLER.filter(s =>
        s.toLowerCase().includes(citySearch.toLowerCase())
    );

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Sub Header */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '16px 24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>GüvenMetre</h1>
                                <span style={{
                                    padding: '4px 10px',
                                    background: 'rgba(34, 197, 94, 0.2)',
                                    color: '#22c55e',
                                    fontSize: '11px',
                                    borderRadius: '9999px',
                                    fontWeight: '600',
                                }}>
                                    GÜNCEL
                                </span>
                                <span style={{
                                    padding: '4px 10px',
                                    background: 'var(--secondary)',
                                    color: 'var(--text-muted)',
                                    fontSize: '11px',
                                    borderRadius: '9999px'
                                }}>
                                    {categories.length} Kategori
                                </span>
                            </div>

                            <button style={{
                                padding: '10px 20px',
                                background: 'var(--primary)',
                                color: 'white',
                                fontWeight: '600',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}>
                                + Değerlendir
                            </button>
                        </div>

                        {/* Category Pills */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {categoryTypes.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        whiteSpace: 'nowrap',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: selectedCategory === cat ? 'var(--primary)' : 'var(--secondary)',
                                        color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '24px' }}>
                        {/* Left Sidebar */}
                        <aside>
                            <div style={{
                                position: 'sticky',
                                top: '100px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '16px',
                            }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    Kategoriler
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {categoryTypes.map((cat) => (
                                        <li key={cat} style={{ marginBottom: '4px' }}>
                                            <button
                                                onClick={() => setSelectedCategory(cat)}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '10px 12px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    background: selectedCategory === cat ? 'var(--primary)' : 'transparent',
                                                    color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                                    fontSize: '14px',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <span>{cat}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* Main Content - Categories Grid */}
                        <div>
                            <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{filteredCategories.length} Kategori</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button style={{
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: 'var(--primary)',
                                        color: 'white',
                                    }}>
                                        Popüler
                                    </button>
                                    <button style={{
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: 'transparent',
                                        color: 'var(--text-muted)',
                                    }}>
                                        A-Z
                                    </button>
                                </div>
                            </div>

                            {/* Categories Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                {filteredCategories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/guvenmetre/${category.id}`}
                                        style={{ textDecoration: 'none' }}
                                        onClick={(e) => handleCategoryClick(e, category.id, category.title)}
                                    >
                                        <div
                                            style={{
                                                background: 'var(--card-bg)',
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '14px',
                                                padding: '20px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--primary)';
                                                e.currentTarget.style.boxShadow = '0 0 20px var(--primary-glow)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--card-border)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            {/* Header */}
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                                    <div style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '12px',
                                                        background: `${category.colors[0]}20`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                        <Shield style={{ width: '24px', height: '24px', color: category.colors[0] }} />
                                                    </div>
                                                    <ChevronRight style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
                                                </div>

                                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '6px' }}>
                                                    {category.title}
                                                </h3>
                                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                                    {category.description}
                                                </p>
                                            </div>

                                            {/* Footer Stats */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Store style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{category.stats}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Users style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                        Henüz değerlendirme yok
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <aside>
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {/* En Popüler */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <TrendingUp style={{ width: '14px', height: '14px' }} />
                                        Popüler Kategoriler
                                    </h3>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {categories.slice(0, 5).map((cat, index) => (
                                            <li key={cat.id} style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '10px',
                                                padding: '10px 8px',
                                                borderRadius: '8px',
                                            }}>
                                                <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px' }}>{index + 1}</span>
                                                <span style={{ color: 'var(--foreground)', fontSize: '13px', lineHeight: 1.4 }}>{cat.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* İstatistikler */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.1), rgba(0, 212, 255, 0.1))',
                                    border: '1px solid var(--primary)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Award style={{ width: '14px', height: '14px' }} />
                                        İstatistikler
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {[
                                            { label: 'Toplam Kategori', value: categories.length.toString() },
                                            { label: 'Değerlendirme', value: '0' },
                                        ].map((stat) => (
                                            <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                                                <span style={{ color: 'var(--foreground)', fontWeight: '600' }}>{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Şehir Seçim Modalı (Özel Servis & Yetkili Bayi) */}
            {cityModal && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setCityModal(null)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1100, backdropFilter: 'blur(3px)' }}
                    />
                    {/* Modal */}
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%',
                        transform: 'translate(-50%,-50%)',
                        width: '480px', maxWidth: '95vw',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '20px',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                        zIndex: 1200,
                        overflow: 'hidden',
                    }}>
                        {/* Header */}
                        <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid var(--card-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,107,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MapPin size={18} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>
                                            Şehir Seçin
                                        </h2>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                                            {cityModal.title} · Bölgenizi seçerek devam edin
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setCityModal(null)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            {/* Arama */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--background)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0 12px', marginTop: '12px' }}>
                                <Search size={14} color="var(--text-muted)" />
                                <input
                                    autoFocus
                                    value={citySearch}
                                    onChange={e => setCitySearch(e.target.value)}
                                    placeholder="Şehir ara... (İstanbul, Ankara...)"
                                    style={{ flex: 1, padding: '10px 0', border: 'none', background: 'transparent', outline: 'none', color: 'var(--foreground)', fontSize: '13px' }}
                                />
                                {citySearch && (
                                    <button onClick={() => setCitySearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Şehir Grid */}
                        <div style={{ padding: '12px 16px', maxHeight: '340px', overflowY: 'auto' }}>
                            {filteredCities.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px', fontSize: '13px' }}>
                                    &quot;{citySearch}&quot; bulunamadı.
                                </p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                                    {filteredCities.map(sehir => (
                                        <button
                                            key={sehir}
                                            onClick={() => {
                                                setCityModal(null);
                                                router.push(`/guvenmetre/${cityModal.categoryId}?sehir=${encodeURIComponent(sehir)}`);
                                            }}
                                            style={{
                                                padding: '9px 12px',
                                                borderRadius: '9px',
                                                border: '1px solid var(--border-subtle)',
                                                background: 'var(--background)',
                                                color: 'var(--foreground)',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'all 0.15s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = 'var(--primary)';
                                                e.currentTarget.style.background = 'rgba(255,107,0,0.06)';
                                                e.currentTarget.style.color = 'var(--primary)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                                e.currentTarget.style.background = 'var(--background)';
                                                e.currentTarget.style.color = 'var(--foreground)';
                                            }}
                                        >
                                            <MapPin size={10} style={{ flexShrink: 0, opacity: 0.5 }} />
                                            {sehir}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '12px 24px', borderTop: '1px solid var(--card-border)', background: 'var(--background)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {filteredCities.length} Şehir listeleniyor
                            </span>
                            <button
                                onClick={() => setCityModal(null)}
                                style={{ padding: '7px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                İptal
                            </button>
                        </div>
                    </div>
                </>
            )}

            <Footer />
        </div>
    );
}
