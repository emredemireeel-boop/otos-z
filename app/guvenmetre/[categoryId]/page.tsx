"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Podium from "@/components/guvenmetre/Podium";
import BrandRankingCard from "@/components/guvenmetre/BrandRankingCard";
import { categories, getBrandsForCategory, BrandRating } from "@/data/guvenmetre";
import { ArrowLeft, Star, Users, TrendingUp, Info, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { sampleListings, formatListingPrice, formatKm } from "@/data/listings";

export default function CategoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filter, setFilter] = useState<'rating' | 'reviews' | 'trending'>('rating');
    const [brands, setBrands] = useState<BrandRating[]>([]);
    const [randomListings, setRandomListings] = useState<typeof sampleListings>([]);

    const categoryId = Array.isArray(params.categoryId) ? params.categoryId[0] : params.categoryId;
    const category = categories.find(c => c.id === categoryId);
    const selectedCity = searchParams?.get('sehir') || null;
    const isCityRequired = ["private_service", "authorized_service", "car_wash", "dealers", "spare_parts"].includes(categoryId ?? "");

    useEffect(() => {
        if (!categoryId) return;
        const data = getBrandsForCategory(categoryId);
        setBrands(data.sort((a, b) => b.rating - a.rating));
        setRandomListings([...sampleListings].sort(() => 0.5 - Math.random()).slice(0, 3));
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

    const filterOptions = [
        { id: 'rating' as const, label: 'En Yüksek Puan', icon: Star },
        { id: 'reviews' as const, label: 'En Çok Değerlendirilen', icon: Users },
        { id: 'trending' as const, label: 'Trendler', icon: TrendingUp },
    ];

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Header — White */}
                <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)', padding: '16px 24px' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={() => router.back()}
                                style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'var(--secondary)', border: '1px solid var(--card-border)',
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: 'var(--foreground)',
                                }}
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>
                                        {category.title}
                                    </h1>
                                    {isCityRequired && selectedCity && (
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            padding: '3px 10px', background: 'var(--secondary)',
                                            color: 'var(--foreground)', fontSize: '12px', borderRadius: '6px', fontWeight: '600',
                                        }}>
                                            <MapPin size={11} /> {selectedCity}
                                        </span>
                                    )}
                                    {isCityRequired && !selectedCity && (
                                        <span
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                padding: '3px 10px', background: 'rgba(245,158,11,0.1)',
                                                color: '#F59E0B', fontSize: '12px', borderRadius: '6px',
                                                fontWeight: '600', cursor: 'pointer',
                                            }}
                                            onClick={() => router.back()}
                                        >
                                            ⚠️ Şehir seçilmedi
                                        </span>
                                    )}
                                    <span style={{
                                        padding: '3px 8px', background: 'var(--secondary)',
                                        color: 'var(--text-muted)', fontSize: '11px', borderRadius: '6px', fontWeight: '600',
                                    }}>
                                        {brands.length} marka
                                    </span>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    {category.description}
                                </p>
                            </div>
                        </div>

                        {/* Filter Pills */}
                        <div className="category-pills" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginTop: '12px' }}>
                            {filterOptions.map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 16px', borderRadius: '8px',
                                        fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap',
                                        border: 'none', cursor: 'pointer',
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

                {/* 3-Column Layout */}
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div className="home-main-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '24px' }}>
                        {/* LEFT SIDEBAR — Reklam & Vitrin (same pattern as main page) */}
                        <aside className="home-left-sidebar">
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {/* Reklam Alanı — matches main page pattern */}
                                <Link href="/iletisim" style={{ textDecoration: 'none', display: 'block' }}>
                                    <div style={{
                                        background: 'var(--secondary)', border: '1px dashed var(--card-border)', borderRadius: '16px',
                                        height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', padding: '20px', textAlign: 'center'
                                    }}
                                         onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                                         onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                                            <Sparkles size={20} color="currentColor" />
                                        </div>
                                        <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>Buraya Reklam Ver</h3>
                                        <p style={{ fontSize: '12px', lineHeight: '1.5', margin: 0 }}>Günde 10.000+ otomotiv tutkununa markanızı ulaştırın.</p>
                                    </div>
                                </Link>

                                {/* Öne Çıkanlar */}
                                <div style={{
                                    marginTop: '16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                    borderRadius: '16px', padding: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                        ⭐ Öne Çıkanlar
                                    </h3>
                                    {filteredBrands.slice(0, 3).map((brand) => (
                                        <div key={brand.id} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '8px', borderRadius: '8px', marginBottom: '4px',
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>{brand.name}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⭐ {brand.rating.toFixed(1)}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredBrands.length === 0 && (
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>Yakında...</p>
                                    )}
                                </div>
                            </div>
                        </aside>

                        {/* CENTER — Main Content */}
                        <div>
                            {filteredBrands.length >= 3 && (
                                <div style={{ marginBottom: '20px' }}>
                                    <Podium first={filteredBrands[0]} second={filteredBrands[1]} third={filteredBrands[2]} />
                                </div>
                            )}

                            <div style={{
                                padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                borderRadius: '12px', marginBottom: '12px',
                            }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>
                                    Tüm Markalar ({filteredBrands.length})
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {filteredBrands.length === 0 ? (
                                    <div style={{
                                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                        borderRadius: '14px', padding: '56px 24px', textAlign: 'center',
                                    }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '6px' }}>
                                            Bu kategoride henüz firma bulunmuyor
                                        </h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                            Çok yakında yeni firmalar eklenecektir.
                                        </p>
                                    </div>
                                ) : (
                                    filteredBrands.map((brand, idx) => (
                                        <BrandRankingCard key={brand.id} brand={brand} rank={idx + 1} categoryId={categoryId} />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <aside className="home-right-sidebar">
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {/* Top 3 */}
                                <div style={{
                                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                    borderRadius: '16px', padding: '16px', marginBottom: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                        🏆 Top 3
                                    </h3>
                                    {filteredBrands.slice(0, 3).map((brand, index) => (
                                        <div key={brand.id} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '8px 6px', borderRadius: '8px',
                                        }}>
                                            <div style={{
                                                width: '24px', height: '24px', borderRadius: '6px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: '700', fontSize: '12px',
                                                background: index === 0 ? 'rgba(255,215,0,0.15)' : 'var(--secondary)',
                                                color: index === 0 ? '#B8860B' : 'var(--text-muted)',
                                            }}>
                                                {index + 1}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: 'var(--foreground)', fontSize: '13px', fontWeight: '600' }}>{brand.name}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>⭐ {brand.rating.toFixed(1)}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredBrands.length === 0 && (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '12px 0' }}>Henüz veri yok</p>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{
                                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                    borderRadius: '16px', padding: '16px', marginBottom: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Info style={{ width: '14px', height: '14px' }} /> Bilgi
                                    </h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                        {category.description}. Toplam {brands.reduce((acc, b) => acc + b.totalReviews, 0).toLocaleString()} kullanıcı değerlendirmesi.
                                    </p>
                                </div>

                                {/* Pazar Vitrini */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>
                                            Pazar Vitrini
                                        </h3>
                                        <Link href="/pazar" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                                            Tümü
                                        </Link>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {(randomListings.length > 0 ? randomListings : sampleListings.slice(0, 3)).map((listing, index) => (
                                            <Link key={listing.id || index} href="/pazar" style={{ textDecoration: 'none' }}>
                                                <div style={{
                                                    background: 'var(--secondary)',
                                                    border: '1px solid var(--card-border)',
                                                    borderRadius: '12px',
                                                    padding: '12px',
                                                    transition: 'all 0.2s',
                                                    cursor: 'pointer',
                                                    position: 'relative'
                                                }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                                                >
                                                    <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderBottomLeftRadius: '6px' }}>VİTRİN</div>
                                                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px', paddingRight: '40px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {listing.brand} {listing.model}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{listing.year} • {formatKm(listing.km)}</span>
                                                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#22c55e', whiteSpace: 'nowrap' }}>{formatListingPrice(listing.price)}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
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
