"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewCard from "@/components/guvenmetre/ReviewCard";
import RatingDialog from "@/components/guvenmetre/RatingDialog";
import type {BrandRating,UserReview} from "@/data/guvenmetre";
import { ArrowLeft, Star, Share2, ThumbsUp, MessageSquare, TrendingUp, Users, Award, ChevronRight, Youtube, Instagram, MapPin } from "lucide-react";

export default function BrandDetailClient({categoryId,brandId,brandRecord,initialReviews,header}:{categoryId:string;brandId:string;brandRecord:BrandRating;initialReviews:UserReview[];header:React.ReactNode}) {
    const router = useRouter();
    const brand=brandRecord;
    const [reviews, setReviews] = useState<UserReview[]>(initialReviews);
    const [activeTab, setActiveTab] = useState<'reviews' | 'stats'>('reviews');
    const [showDialog, setShowDialog] = useState(false);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);

    // Firestore'dan yorumları çek
    const fetchReviews = useCallback(async () => {
        if (!categoryId || !brandId) return;
        setIsLoadingReviews(true);
        try {
            const res = await fetch(`/api/guvenmetre/reviews?categoryId=${categoryId}&brandId=${brandId}`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.reviews || []);
            }
        } catch (err) {
            console.error('Yorumlar yüklenemedi:', err);
        } finally {
            setIsLoadingReviews(false);
        }
    }, [categoryId, brandId]);

    useEffect(()=>{void fetchReviews();},[fetchReviews]);

    if (!brand) return <div>Yükleniyor...</div>;

    // Distribution is calculated from actual approved reviews, never fabricated percentages.
    const ratingBreakdown=[5,4,3,2,1].map(stars=>{const count=reviews.filter(review=>Math.round(review.rating)===stars).length;return {stars,count,percentage:reviews.length?Math.round(count/reviews.length*100):0};});
    return (
        <div onClick={event=>{if((event.target as Element).closest('[data-open-rating]'))setShowDialog(true);}} style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {header}
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

                                {/* About (if bio exists) */}
                                {brand.bio && (
                                    <div style={{
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '16px',
                                        padding: '20px',
                                        marginBottom: '16px'
                                    }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>
                                            Hakkında
                                        </h3>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                                            {brand.bio}
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--card-border)', paddingTop: '14px' }}>
                                            {brand.realName && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>👤 Gerçek İsim</span>
                                                    <span style={{ fontSize: '13px', color: 'var(--foreground)', fontWeight: '600', textAlign: 'right', maxWidth: '60%' }}>
                                                        {brand.realName}
                                                    </span>
                                                </div>
                                            )}
                                            {brand.birthYear && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>🎂 Yaş</span>
                                                    <span style={{ fontSize: '13px', color: 'var(--foreground)', fontWeight: '600' }}>
                                                        {new Date().getFullYear() - brand.birthYear} yaşında ({brand.birthYear})
                                                    </span>
                                                </div>
                                            )}
                                            {brand.location && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>📍 Konum</span>
                                                    <span style={{ fontSize: '13px', color: 'var(--foreground)', fontWeight: '600' }}>
                                                        {brand.location}
                                                    </span>
                                                </div>
                                            )}
                                            {brand.business && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>🏢 İşletme</span>
                                                    <span style={{ fontSize: '13px', color: 'var(--foreground)', fontWeight: '600', textAlign: 'right', maxWidth: '60%' }}>
                                                        {brand.business}
                                                    </span>
                                                </div>
                                            )}
                                            {brand.followers && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>📊 Takipçi</span>
                                                    <span style={{ fontSize: '13px', color: 'var(--foreground)', fontWeight: '600' }}>
                                                        {brand.followers} Abone
                                                    </span>
                                                </div>
                                            )}
                                            {brand.youtubeUrl && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>🔗 Kanal</span>
                                                    <a href={brand.youtubeUrl} target="_blank" rel="noopener noreferrer"
                                                        style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                                                        YouTube →
                                                    </a>
                                                </div>
                                            )}
                                            {brand.instagramUrl && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>📸 Instagram</span>
                                                    <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer"
                                                        style={{ fontSize: '13px', color: '#E4405F', fontWeight: '600', textDecoration: 'none' }}>
                                                        Profil →
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Quick Stats */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
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
                                    {isLoadingReviews ? (
                                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
                                            <div style={{ width: '32px', height: '32px', border: '3px solid var(--card-border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Değerlendirmeler yükleniyor...</p>
                                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                        </div>
                                    ) : reviews.length === 0 ? (
                                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
                                            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>💬</span>
                                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>Henüz değerlendirme yok</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>{brand.specialties ? 'Bu içerik üreticisi' : 'Bu firma'} için ilk yorumu siz yapabilirsiniz!</p>
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
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--primary)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    textAlign: 'center'
                                }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                        Deneyimini Paylaş
                                    </h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.4' }}>
                                        {brand.name} hakkındaki görüşlerini diğer kullanıcılarla paylaş!
                                    </p>
                                    <button
                                        onClick={() => setShowDialog(true)}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'var(--primary)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white',
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
                    categoryId={categoryId!}
                    brandId={brandId!}
                    onClose={() => setShowDialog(false)}
                    onSuccess={fetchReviews}
                />
            )}

            <Footer />
        </div>
    );
}
