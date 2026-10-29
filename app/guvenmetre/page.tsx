import CityPickerClient from "./CityPickerClient";
import ServerCatalogClient from "@/components/ServerCatalogClient";


import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/data/guvenmetre";
import { Shield, Store, ChevronRight, MapPin, X, Search, Star, Sparkles, TrendingUp, Award } from "lucide-react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import LatestThreadsWidget from "@/components/LatestThreadsWidget";

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



export default async function GuvenmetrePage(){
    const selectedCategory:string='Tümü';
    const categoryTypes=['Tümü','Hizmet','Ürün','Servis','Alışveriş','Medya'];
    const filteredCategories=categories;
    const groups=(id:string)=>['Alışveriş',...(['fuel_stations','car_wash','expertise'].includes(id)?['Hizmet']:[]),...(['private_service','authorized_service'].includes(id)?['Servis']:[]),...(['spare_parts','accessories'].includes(id)?['Ürün']:[]),...(id==='auto_influencers'?['Medya']:[])].join('|');
    return (
        <CityPickerClient cities={SEHIRLER}><ServerCatalogClient>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Sub Header — White, same pattern as main page */}
                <div style={{
                    background: 'var(--top-bar-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '16px 24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>GüvenMetre</h1>
                                <span style={{
                                    padding: '4px 10px',
                                    background: 'var(--secondary)',
                                    color: 'var(--foreground)',
                                    border: '1px solid var(--card-border)',
                                    fontSize: '11px',
                                    borderRadius: '9999px',
                                    fontWeight: '700',
                                    letterSpacing: '0.5px'
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
                        </div>

                        {/* Category Pills */}
                        <div className="category-pills" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {categoryTypes.map((cat) => (
                                <button
                                    key={cat}
                                    data-catalog-filter={cat}
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

                {/* 3-Column Layout */}
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div className="home-main-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '24px' }}>
                        {/* Left Sidebar */}
                        <aside className="home-left-sidebar">
                            <div style={{
                                position: 'sticky', top: '100px',
                                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                borderRadius: '16px', padding: '16px',
                            }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    Kategoriler
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {categoryTypes.map((cat) => (
                                        <li key={cat} style={{ marginBottom: '4px' }}>
                                            <button
                                                data-catalog-filter={cat}
                                                style={{
                                                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                                    background: selectedCategory === cat ? 'var(--primary)' : 'transparent',
                                                    color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                                    fontSize: '14px', textAlign: 'left',
                                                }}
                                            >
                                                <span>{cat}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Reklam Alanı */}
                            <AdPlaceholder position="sidebar" style={{ marginTop: '16px' }} />
                        </aside>

                        {/* Main Content - Categories Grid */}
                        <div>
                            <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{filteredCategories.length} Kategori</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button style={{
                                        padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
                                        border: 'none', cursor: 'pointer', background: 'var(--primary)', color: 'white',
                                    }}>
                                        Popüler
                                    </button>
                                    <button style={{
                                        padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
                                        border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)',
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
                                        data-city-required={CITY_REQUIRED.includes(category.id)?"true":undefined} data-category-id={category.id} data-category-title={category.title} data-catalog-row data-catalog-group={groups(category.id)}
                                    >
                                        <div
                                            style={{
                                                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                                borderRadius: '14px', padding: '20px', cursor: 'pointer',
                                                transition: 'all 0.2s ease', height: '100%',
                                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                            }}
                                            
                                            
                                        >
                                            {/* Header */}
                                            <div>


                                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '6px' }}>
                                                    {category.title}
                                                </h3>
                                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                                    {category.description}
                                                </p>
                                            </div>

                                            {/* Footer Stats */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
                                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{category.stats}</span>
                                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Değerlendir</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <aside className="home-right-sidebar">
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {/* Pazar Vitrini (Gizlendi) */}
                                <LatestThreadsWidget />


                                {/* En Popüler */}
                                <div style={{
                                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                    borderRadius: '16px', padding: '16px', marginBottom: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                        Popüler Kategoriler
                                    </h3>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {categories.slice(0, 5).map((cat, index) => (
                                            <li key={cat.id} style={{
                                                display: 'flex', alignItems: 'flex-start', gap: '10px',
                                                padding: '10px 8px', borderRadius: '8px',
                                            }}>
                                                <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px' }}>{index + 1}</span>
                                                <span style={{ color: 'var(--foreground)', fontSize: '13px', lineHeight: 1.4 }}>{cat.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* İstatistikler */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px', padding: '16px', marginBottom: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>
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

                                {/* Reklam Alanı */}
                                <AdPlaceholder position="sidebar" />

                            </div>
                        </aside>
                    </div>
                </div>
            </main>

        <Footer /></ServerCatalogClient></CityPickerClient>
    );
}
