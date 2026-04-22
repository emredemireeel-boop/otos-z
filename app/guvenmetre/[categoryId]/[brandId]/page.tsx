"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewCard from "@/components/guvenmetre/ReviewCard";
import RatingDialog from "@/components/guvenmetre/RatingDialog";
import { getBrandsForCategory, getReviewsForBrand, BrandRating, UserReview } from "@/data/guvenmetre";
import { ArrowLeft, Star, Share2, ThumbsUp, MessageSquare, TrendingUp, Users, Award, ChevronRight } from "lucide-react";

export default function BrandDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [brand, setBrand] = useState<BrandRating | null>(null);
    const [reviews, setReviews] = useState<UserReview[]>([]);
    const [activeTab, setActiveTab] = useState<'reviews' | 'stats'>('reviews');
    const [showDialog, setShowDialog] = useState(false);

    const categoryId = Array.isArray(params.categoryId) ? params.categoryId[0] : params.categoryId;
    const brandId = Array.isArray(params.brandId) ? params.brandId[0] : params.brandId;

    useEffect(() => {
        if (!categoryId || !brandId) return;

        const brands = getBrandsForCategory(categoryId);
        const foundBrand = brands.find(b => b.id === brandId);

        if (foundBrand) {
            setBrand(foundBrand);
            setReviews(getReviewsForBrand(brandId));
        }
    }, [categoryId, brandId]);

    if (!brand) return <div>Yükleniyor...</div>;

    // Mock rating breakdown
    const ratingBreakdown = [
        { stars: 5, count: Math.floor(brand.totalReviews * 0.6), percentage: 60 },
        { stars: 4, count: Math.floor(brand.totalReviews * 0.25), percentage: 25 },
        { stars: 3, count: Math.floor(brand.totalReviews * 0.1), percentage: 10 },
        { stars: 2, count: Math.floor(brand.totalReviews * 0.03), percentage: 3 },
        { stars: 1, count: Math.floor(brand.totalReviews * 0.02), percentage: 2 },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Header Section */}
                <div style={{
                    background: 'var(--overlay-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        {/* Breadcrumb */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
                            <button onClick={() => router.push('/guvenmetre')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                GüvenMetre
                            </button>
                            <ChevronRight style={{ width: '14px', height: '14px' }} />
                            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                Kategori
                            </button>
                            <ChevronRight style={{ width: '14px', height: '14px' }} />
                            <span style={{ color: 'var(--foreground)' }}>{brand.name}</span>
                        </div>

                        {/* Brand Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '20px',
                                    background: brand.brandColor || 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '40px',
                                    fontWeight: '900',
                                    color: 'white',
                                    overflow: 'hidden'
                                }}>
                                    {brand.logoUrl ? (
                                        <img 
                                            src={brand.logoUrl} 
                                            alt={brand.name} 
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'white', padding: '10px' }}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                if (e.currentTarget.nextElementSibling) {
                                                    e.currentTarget.nextElementSibling.classList.remove('hidden');
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <span className={brand.logoUrl ? 'hidden' : ''}>{brand.logoEmoji}</span>
                                </div>
                                <div>
                                    <h1 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>{brand.name}</h1>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star
                                                        key={i}
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            fill: i <= Math.round(brand.rating) ? '#eab308' : 'transparent',
                                                            color: i <= Math.round(brand.rating) ? '#eab308' : '#404040'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <span style={{ fontSize: '24px', fontWeight: '700', color: '#eab308' }}>{brand.rating}</span>
                                        </div>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                                            {brand.totalReviews.toLocaleString()} değerlendirme
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button style={{
                                    padding: '12px 24px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '10px',
                                    color: 'var(--foreground)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px'
                                }}>
                                    <Share2 style={{ width: '16px', height: '16px' }} />
                                    Paylaş
                                </button>
                                <button
                                    onClick={() => setShowDialog(true)}
                                    style={{
                                        padding: '12px 32px',
                                        background: 'var(--primary)',
                                        border: 'none',
                                        borderRadius: '10px',
                                        color: 'white',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)'
                                    }}
                                >
                                    <Star style={{ width: '18px', height: '18px' }} />
                                    Oy Ver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: '24px' }}>
                        {/* Left Sidebar */}
                        <aside>
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {/* Rating Breakdown */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    marginBottom: '16px'
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                        Puan Dağılımı
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {ratingBreakdown.map(item => (
                                            <div key={item.stars} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '13px', color: 'var(--foreground)', width: '20px' }}>{item.stars}★</span>
                                                <div style={{ flex: 1, height: '6px', background: 'var(--secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${item.percentage}%`, height: '100%', background: '#eab308', borderRadius: '3px' }} />
                                                </div>
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '40px', textAlign: 'right' }}>
                                                    {item.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.1), rgba(0, 212, 255, 0.1))',
                                    border: '1px solid var(--primary)',
                                    borderRadius: '16px',
                                    padding: '20px'
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>
                                        İstatistikler
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {[
                                            { label: 'Toplam Oy', value: brand.totalReviews.toLocaleString(), icon: Users },
                                            { label: 'Ortalama', value: brand.rating.toFixed(1), icon: Star },
                                            { label: 'Trend', value: brand.trend === 'up' ? '↑ Yükseliyor' : brand.trend === 'down' ? '↓ Düşüyor' : '→ Sabit', icon: TrendingUp },
                                        ].map((stat) => (
                                            <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <stat.icon style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{stat.label}</span>
                                                </div>
                                                <span style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: '600' }}>{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div>
                            {/* Tabs */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '6px' }}>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    style={{
                                        flex: 1,
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        background: activeTab === 'reviews' ? 'var(--primary)' : 'transparent',
                                        color: activeTab === 'reviews' ? 'white' : 'var(--text-muted)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Yorumlar ({reviews.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('stats')}
                                    style={{
                                        flex: 1,
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        background: activeTab === 'stats' ? 'var(--primary)' : 'transparent',
                                        color: activeTab === 'stats' ? 'white' : 'var(--text-muted)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    İstatistikler
                                </button>
                            </div>

                            {/* Content */}
                            {activeTab === 'reviews' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {reviews.length === 0 ? (
                                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
                                            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>💬</span>
                                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>Henüz değerlendirme yok</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>Bu firma için ilk yorumu siz yapabilirsiniz!</p>
                                            <button onClick={() => setShowDialog(true)} style={{ padding: '12px 28px', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>⭐ Görüşünü Paylaş</button>
                                        </div>
                                    ) : (
                                        reviews.map(review => (
                                            <ReviewCard key={review.id} review={review} />
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '60px',
                                    textAlign: 'center'
                                }}>
                                    <Star style={{ width: '48px', height: '48px', color: '#eab308', margin: '0 auto 16px', opacity: 0.5 }} />
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                        Detaylı İstatistikler
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                                        Bu özellik yakında eklenecek.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <aside>
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {/* Top Reviewers */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    marginBottom: '16px'
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Award style={{ width: '14px', height: '14px' }} />
                                        En Faydalı Yorumlar
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {reviews.slice(0, 3).map((review, idx) => (
                                            <div key={review.id} style={{
                                                padding: '12px',
                                                background: 'var(--secondary)',
                                                borderRadius: '10px',
                                                cursor: 'pointer'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                    <div style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        background: 'var(--primary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '12px',
                                                        fontWeight: '700',
                                                        color: 'white'
                                                    }}>
                                                        {review.userName[0]}
                                                    </div>
                                                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>
                                                        {review.userName}
                                                    </span>
                                                </div>
                                                <p style={{
                                                    fontSize: '12px',
                                                    color: 'var(--text-muted)',
                                                    lineHeight: '1.4',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical'
                                                }}>
                                                    {review.comment}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Call to Action */}
                                <div style={{
                                    background: 'var(--primary)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    textAlign: 'center'
                                }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                        Deneyimini Paylaş
                                    </h3>
                                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginBottom: '16px', lineHeight: '1.4' }}>
                                        {brand.name} hakkındaki görüşlerini diğer kullanıcılarla paylaş!
                                    </p>
                                    <button
                                        onClick={() => setShowDialog(true)}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'var(--primary)',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Değerlendir
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {showDialog && (
                <RatingDialog
                    brandName={brand.name}
                    onClose={() => setShowDialog(false)}
                />
            )}

            <Footer />
        </div>
    );
}
