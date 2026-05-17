"use client";

import { BrandRating } from "@/data/guvenmetre";
import { Star, Trophy } from "lucide-react";

export default function Podium({
    first,
    second,
    third
}: {
    first: BrandRating,
    second: BrandRating,
    third: BrandRating
}) {
    // Hiç oy yoksa podium gösterme
    if (first.totalReviews === 0 && second.totalReviews === 0 && third.totalReviews === 0) {
        return null;
    }
    return (
        <div style={{
            width: '100%',
            background: 'var(--card-bg)',
            borderRadius: '20px',
            padding: '28px 24px 16px',
            border: '1px solid var(--card-border)',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                justifyContent: 'center', marginBottom: '28px',
            }}>
                <Trophy style={{ width: '20px', height: '20px', color: 'var(--foreground)' }} />
                <span style={{
                    fontSize: '16px', fontWeight: '800',
                    color: 'var(--foreground)', letterSpacing: '-0.3px',
                }}>
                    Lider Tablosu
                </span>
            </div>

            {/* Podium */}
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
                gap: '12px', maxWidth: '560px', margin: '0 auto', height: '280px',
            }}>
                <PodiumItem brand={second} position={2} height="120px" color="silver" />
                <PodiumItem brand={first} position={1} height="160px" color="gold" />
                <PodiumItem brand={third} position={3} height="100px" color="bronze" />
            </div>
        </div>
    );
}

function PodiumItem({
    brand,
    position,
    height,
    color
}: {
    brand: BrandRating,
    position: number,
    height: string,
    color: 'gold' | 'silver' | 'bronze'
}) {
    const colors = {
        gold: {
            gradient: 'linear-gradient(180deg, #FFD700 0%, #B8860B 100%)',
            pillar: 'linear-gradient(180deg, rgba(255, 215, 0, 0.25) 0%, rgba(255, 215, 0, 0.08) 100%)',
            border: 'rgba(255, 215, 0, 0.35)',
            text: '#D4A017',
            glow: '0 0 20px rgba(255, 215, 0, 0.15)',
        },
        silver: {
            gradient: 'linear-gradient(180deg, #C0C0C0 0%, #808080 100%)',
            pillar: 'linear-gradient(180deg, rgba(192, 192, 192, 0.2) 0%, rgba(192, 192, 192, 0.05) 100%)',
            border: 'rgba(192, 192, 192, 0.3)',
            text: '#A0A0A0',
            glow: '0 0 16px rgba(192, 192, 192, 0.1)',
        },
        bronze: {
            gradient: 'linear-gradient(180deg, #CD7F32 0%, #8B4513 100%)',
            pillar: 'linear-gradient(180deg, rgba(205, 127, 50, 0.2) 0%, rgba(205, 127, 50, 0.05) 100%)',
            border: 'rgba(205, 127, 50, 0.3)',
            text: '#B8733A',
            glow: '0 0 16px rgba(205, 127, 50, 0.1)',
        }
    };

    const c = colors[color];

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', width: '120px', flex: '0 0 120px',
        }}>
            {/* Rank Badge */}
            <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: c.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: c.glow, marginBottom: '10px', zIndex: 10,
            }}>
                <span style={{ fontSize: '16px', fontWeight: '900', color: position === 1 ? '#000' : '#fff' }}>
                    {position}
                </span>
            </div>

            {/* Avatar Circle */}
            <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'var(--secondary)',
                border: `2px solid ${c.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '8px', overflow: 'hidden',
                boxShadow: c.glow,
            }}>
                {brand.logoUrl ? (
                    <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        style={{
                            width: '100%', height: '100%',
                            objectFit: 'contain', padding: '6px',
                        }}
                    />
                ) : (
                    <span style={{
                        fontSize: '16px', fontWeight: '800',
                        color: 'var(--foreground)',
                        letterSpacing: '-0.5px',
                    }}>
                        {brand.name.substring(0, 2).toUpperCase()}
                    </span>
                )}
            </div>

            {/* Brand Info */}
            <div style={{ textAlign: 'center', marginBottom: '8px', width: '100%', overflow: 'hidden' }}>
                <p style={{
                    fontWeight: '700', color: 'var(--foreground)',
                    fontSize: '13px', marginBottom: '4px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    padding: '0 4px',
                }}>
                    {brand.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Star style={{ width: '12px', height: '12px', color: c.text, fill: c.text }} />
                    <span style={{ fontWeight: '700', fontSize: '12px', color: c.text }}>
                        {brand.rating === 0 ? '—' : brand.rating.toFixed(1)}
                    </span>
                </div>
            </div>

            {/* Pillar */}
            <div style={{
                width: '100%',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                background: c.pillar,
                border: `1px solid ${c.border}`,
                borderBottom: 'none',
                height: height,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <span style={{
                    fontSize: '28px', fontWeight: '900',
                    color: c.text, opacity: 0.3,
                }}>
                    #{position}
                </span>
            </div>
        </div>
    );
}
