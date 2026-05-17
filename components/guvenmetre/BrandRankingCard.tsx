"use client";

import { BrandRating } from "@/data/guvenmetre";
import { Star, TrendingUp, TrendingDown, Minus, Users, ChevronRight, MapPin, Youtube } from "lucide-react";
import Link from "next/link";

export default function BrandRankingCard({
    brand,
    rank,
    categoryId
}: {
    brand: BrandRating,
    rank: number,
    categoryId: string
}) {
    const isTop3 = rank <= 3;
    const isInfluencer = categoryId === "auto_influencers";

    // Rank badge renkleri
    const rankStyles: Record<number, { bg: string; color: string; border: string; glow: string }> = {
        1: { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)', color: '#000', border: 'rgba(255, 215, 0, 0.4)', glow: '0 0 16px rgba(255, 215, 0, 0.2)' },
        2: { bg: 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)', color: '#000', border: 'rgba(192, 192, 192, 0.4)', glow: '0 0 12px rgba(192, 192, 192, 0.15)' },
        3: { bg: 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)', color: '#fff', border: 'rgba(205, 127, 50, 0.4)', glow: '0 0 12px rgba(205, 127, 50, 0.15)' },
    };

    const currentRankStyle = rankStyles[rank] || {
        bg: 'var(--secondary)', color: 'var(--text-muted)', border: 'var(--card-border)', glow: 'none'
    };

    // Yıldız puanına göre skor çubuğu rengi
    const getScoreColor = (rating: number) => {
        if (rating >= 4.5) return '#22c55e';
        if (rating >= 3.5) return 'var(--primary)';
        if (rating >= 2.5) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <Link
            href={`/guvenmetre/${categoryId}/${brand.id}`}
            style={{ textDecoration: 'none', display: 'block' }}
        >
            <div
                style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--card-border)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
            >
                {/* Rank Badge */}
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: isTop3 ? currentRankStyle.bg : currentRankStyle.bg,
                    border: `1.5px solid ${currentRankStyle.border}`,
                    boxShadow: currentRankStyle.glow,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <span style={{
                        fontSize: isTop3 ? '18px' : '16px',
                        fontWeight: '800',
                        color: isTop3 ? currentRankStyle.color : currentRankStyle.color,
                        letterSpacing: '-0.5px',
                    }}>
                        #{rank}
                    </span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name */}
                    <h3 style={{
                        fontSize: '17px',
                        fontWeight: '700',
                        color: 'var(--foreground)',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                        {brand.name}
                    </h3>

                    {/* Influencer Meta */}
                    {isInfluencer && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            marginBottom: '8px', flexWrap: 'wrap',
                        }}>
                            {brand.location && (
                                <span style={{
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    fontSize: '12px', color: 'var(--text-muted)',
                                }}>
                                    <MapPin style={{ width: '12px', height: '12px' }} />
                                    {brand.location}
                                </span>
                            )}
                            {brand.followers && (
                                <span style={{
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    fontSize: '12px', color: 'var(--text-muted)',
                                }}>
                                    <Youtube style={{ width: '12px', height: '12px' }} />
                                    {brand.followers} Abone
                                </span>
                            )}
                        </div>
                    )}

                    {/* Specialty Tags */}
                    {isInfluencer && brand.specialties && brand.specialties.length > 0 && (
                        <div style={{
                            display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap',
                        }}>
                            {brand.specialties.slice(0, 3).map(tag => (
                                <span key={tag} style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    padding: '3px 10px',
                                    borderRadius: '6px',
                                    background: 'var(--secondary)',
                                    color: 'var(--text-muted)',
                                    border: '1px solid var(--card-border)',
                                    letterSpacing: '0.2px',
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Rating Row */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        marginTop: isInfluencer ? '0' : '6px',
                    }}>
                        {/* Stars */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star
                                    key={i}
                                    style={{
                                        width: '14px',
                                        height: '14px',
                                        fill: i <= Math.round(brand.rating) ? '#FFD700' : 'var(--card-border)',
                                        color: i <= Math.round(brand.rating) ? '#FFD700' : 'var(--card-border)',
                                    }}
                                />
                            ))}
                            <span style={{
                                fontSize: '14px',
                                fontWeight: '800',
                                color: brand.rating > 0 ? getScoreColor(brand.rating) : 'var(--text-muted)',
                                marginLeft: '6px',
                                fontFamily: 'Inter, system-ui, sans-serif',
                            }}>
                                {brand.rating === 0 ? '—' : brand.rating.toFixed(1)}
                            </span>
                        </div>

                        {/* Divider */}
                        <div style={{ width: '1px', height: '16px', background: 'var(--card-border)' }} />

                        {/* Reviews */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            fontSize: '13px', color: 'var(--text-muted)',
                        }}>
                            <Users style={{ width: '13px', height: '13px' }} />
                            <span style={{ fontWeight: '500' }}>
                                {brand.totalReviews === 0
                                    ? 'Henüz oy yok'
                                    : brand.totalReviews >= 1000
                                        ? `${(brand.totalReviews / 1000).toFixed(1)}K`
                                        : `${brand.totalReviews} değerlendirme`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Section — Trend + Arrow */}
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: '8px', flexShrink: 0,
                }}>
                    {/* Trend Indicator */}
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: brand.trend === 'up' ? 'rgba(34, 197, 94, 0.1)'
                            : brand.trend === 'down' ? 'rgba(239, 68, 68, 0.1)'
                            : 'var(--secondary)',
                    }}>
                        {brand.trend === 'up' && <TrendingUp style={{ width: '18px', height: '18px', color: '#22c55e' }} />}
                        {brand.trend === 'down' && <TrendingDown style={{ width: '18px', height: '18px', color: '#ef4444' }} />}
                        {brand.trend === 'stable' && <Minus style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} />}
                    </div>

                    {/* Arrow */}
                    <ChevronRight style={{
                        width: '18px', height: '18px',
                        color: 'var(--text-muted)',
                        transition: 'all 0.2s',
                    }} />
                </div>
            </div>
        </Link>
    );
}
