"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Podium from "@/components/guvenmetre/Podium";
import BrandRankingCard from "@/components/guvenmetre/BrandRankingCard";
import { categories, getBrandsForCategory, BrandRating } from "@/data/guvenmetre";
import { ArrowLeft, Star, Users, TrendingUp, Info, MapPin } from "lucide-react";

export default function CategoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filter, setFilter] = useState<'rating' | 'reviews' | 'trending'>('rating');
    const [brands, setBrands] = useState<BrandRating[]>([]);

    const categoryId = Array.isArray(params.categoryId) ? params.categoryId[0] : params.categoryId;
    const category = categories.find(c => c.id === categoryId);
    const selectedCity = searchParams?.get('sehir') || null;
    const isCityRequired = ["private_service", "authorized_service", "car_wash", "dealers", "spare_parts"].includes(categoryId ?? "");

    useEffect(() => {
        if (!categoryId) return;
        const data = getBrandsForCategory(categoryId);
        setBrands(data.sort((a, b) => b.rating - a.rating));
    }, [categoryId]);

    if (!category || !categoryId) return <div>Yükleniyor...</div>;

    const filteredBrands = [...brands].sort((a, b) => {
        if (filter === 'rating') return b.rating - a.rating;
        if (filter === 'reviews') return b.totalReviews - a.totalReviews;
        if (filter === 'trending') {
            const score = { up: 3, stable: 2, down: 1 };
            return score[b.trend] - score[a.trend];
        }
        return 0;
    });

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Sub Header */}
                <div style={{
                    background: 'var(--overlay-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '16px 24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button
                                    onClick={() => router.back()}
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        color: 'var(--foreground)',
                                    }}
                                >
                                    <ArrowLeft style={{ width: '20px', height: '20px' }} />
                                </button>
                                <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>{category.title}</h1>
                                {/* Şehir Rozeti */}
                                {isCityRequired && selectedCity && (
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                        padding: '4px 12px',
                                        background: 'rgba(255,107,0,0.18)',
                                        color: 'var(--primary)',
                                        fontSize: '13px',
                                        borderRadius: '9999px',
                                        fontWeight: '700',
                                        border: '1px solid rgba(255,107,0,0.35)',
                                    }}>
                                        <MapPin size={13} /> {selectedCity}
                                    </span>
                                )}
                                {/* Şehir seçilmemişse uyarı */}
                                {isCityRequired && !selectedCity && (
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                        padding: '4px 12px',
                                        background: 'rgba(245,158,11,0.12)',
                                        color: '#F59E0B',
                                        fontSize: '12px',
                                        borderRadius: '9999px',
                                        fontWeight: '600',
                                        border: '1px solid rgba(245,158,11,0.3)',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => router.back()}>
                                        ⚠️ Şehir seçilmedi — geri dön
                                    </span>
                                )}
                                <span style={{
                                    padding: '4px 10px',
                                    background: 'rgba(34, 197, 94, 0.2)',
                                    color: '#22c55e',
                                    fontSize: '11px',
                                    borderRadius: '9999px',
                                    fontWeight: '600',
                                }}>
                                    {brands.length} MARKA
                                </span>
                                <span style={{
                                    padding: '4px 10px',
                                    background: 'var(--secondary)',
                                    color: 'var(--text-muted)',
                                    fontSize: '11px',
                                    borderRadius: '9999px'
                                }}>
                                    {brands.reduce((acc, b) => acc + b.totalReviews, 0).toLocaleString()} değerlendirme
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

                        {/* Filter Pills */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {[
                                { id: 'rating', label: 'En Yüksek Puan', icon: Star },
                                { id: 'reviews', label: 'En Çok Değerlendirilen', icon: Users },
                                { id: 'trending', label: 'Trendler', icon: TrendingUp },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id as any)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        whiteSpace: 'nowrap',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: filter === f.id ? 'var(--primary)' : 'var(--secondary)',
                                        color: filter === f.id ? 'white' : 'var(--foreground)',
                                    }}
                                >
                                    <f.icon style={{ width: '14px', height: '14px' }} />
                                    {f.label}
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
                                    Filtreler
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {[
                                        { id: 'rating', label: 'En Yüksek Puan' },
                                        { id: 'reviews', label: 'En Çok Değ.' },
                                        { id: 'trending', label: 'Trendler' },
                                    ].map((f) => (
                                        <li key={f.id} style={{ marginBottom: '4px' }}>
                                            <button
                                                onClick={() => setFilter(f.id as any)}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '10px 12px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    background: filter === f.id ? 'var(--primary)' : 'transparent',
                                                    color: filter === f.id ? 'white' : 'var(--foreground)',
                                                    fontSize: '14px',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <span>{f.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div>
                            {/* Podium for Top 3 */}
                            {filteredBrands.length >= 3 && (
                                <div style={{ marginBottom: '24px' }}>
                                    <Podium
                                        first={filteredBrands[0]}
                                        second={filteredBrands[1]}
                                        third={filteredBrands[2]}
                                    />
                                </div>
                            )}

                            {/* Full List */}
                            <div>
                                <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Tüm Markalar ({filteredBrands.length})</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {filteredBrands.length === 0 ? (
                                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '60px 20px', textAlign: 'center' }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>Bu kategoride henüz firma bulunmuyor</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Çok yakında yeni firmalar eklenecektir.</p>
                                        </div>
                                    ) : (
                                        filteredBrands.map((brand, idx) => (
                                            <BrandRankingCard
                                                key={brand.id}
                                                brand={brand}
                                                rank={idx + 1}
                                                categoryId={categoryId}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <aside>
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {/* Top 3 */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          Top 3
                                    </h3>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {filteredBrands.slice(0, 3).map((brand, index) => (
                                            <li key={brand.id} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '10px 8px',
                                                borderRadius: '8px',
                                                marginBottom: '4px',
                                            }}>
                                                <span style={{
                                                    color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                                                    fontWeight: '700',
                                                    fontSize: '16px'
                                                }}>{index + 1}</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ color: 'var(--foreground)', fontSize: '13px', fontWeight: '600' }}>{brand.name}</div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>⭐ {brand.rating.toFixed(1)}</div>
                                                </div>
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
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Info style={{ width: '14px', height: '14px' }} />
                                        Bilgi
                                    </h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                        {category.description}. Toplam {brands.reduce((acc, b) => acc + b.totalReviews, 0).toLocaleString()} kullanıcı değerlendirmesi.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
