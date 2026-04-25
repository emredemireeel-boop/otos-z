"use client";

import { BrandRating } from "@/data/guvenmetre";
import { Star } from "lucide-react";

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
            background: 'linear-gradient(to bottom, rgba(255, 215, 0, 0.1), transparent)',
            borderRadius: '16px',
            padding: '20px',
            paddingBottom: '8px',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            marginBottom: '24px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                justifyContent: 'center',
                background: 'rgba(255, 215, 0, 0.15)',
                width: 'fit-content',
                margin: '0 auto 24px auto',
                padding: '8px 20px',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
                <Star style={{ width: '20px', height: '20px', color: '#EAB308', fill: '#EAB308' }} />
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#EAB308' }}>Lider Markalar</span>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                gap: '12px',
                maxWidth: '600px',
                margin: '0 auto',
                height: '320px'
            }}>
                <PodiumItem brand={second} position={2} height="130px" color="silver" />
                <PodiumItem brand={first} position={1} height="170px" color="gold" />
                <PodiumItem brand={third} position={3} height="110px" color="bronze" />
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
            bg: 'linear-gradient(to top, #CA8A04, #EAB308)',
            border: '#EAB308',
            text: '#EAB308',
            rankBg: '#EAB308'
        },
        silver: {
            bg: 'linear-gradient(to top, #64748B, #94A3B8)',
            border: '#CBD5E1',
            text: '#CBD5E1',
            rankBg: '#94A3B8'
        },
        bronze: {
            bg: 'linear-gradient(to top, #C2410C, #F97316)',
            border: '#FB923C',
            text: '#FB923C',
            rankBg: '#F97316'
        }
    };

    const c = colors[color];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '110px',
            flex: '0 0 110px'
        }}>
            {/* Rank Circle */}
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: `3px solid ${c.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#171717',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                marginBottom: '10px',
                position: 'relative',
                zIndex: 10
            }}>
                <span style={{ fontSize: '20px', fontWeight: '900', color: 'white' }}>{position}</span>
            </div>

            {/* Avatar */}
            <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${brand.brandColor || '#3b82f6'}, #0f172a)`,
                border: `2px solid ${c.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top right, rgba(0,0,0,0.4), transparent, rgba(255,255,255,0.2))' }}></div>
                {brand.logoUrl && (
                    <img 
                        src={brand.logoUrl} 
                        alt={brand.name} 
                        style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', objectFit: 'contain', background: 'white', padding: '4px' }}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.classList.remove('hidden');
                            }
                        }}
                    />
                )}
                <span 
                    className={brand.logoUrl ? 'hidden' : ''} 
                    style={{ 
                        position: 'relative', 
                        zIndex: 10, 
                        fontSize: '18px', 
                        fontWeight: '900', 
                        color: 'transparent',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        backgroundImage: 'linear-gradient(to bottom right, #ffffff, rgba(255,255,255,0.6))',
                        filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))',
                        letterSpacing: '-0.5px'
                    }}
                >
                    {brand.name.substring(0, 2).toUpperCase()}
                </span>
            </div>

            {/* Brand Info */}
            <div style={{ textAlign: 'center', marginBottom: '8px', width: '100%', overflow: 'hidden' }}>
                <p style={{
                    fontWeight: '700',
                    color: 'white',
                    fontSize: '13px',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    padding: '0 4px'
                }}>{brand.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Star style={{ width: '12px', height: '12px', color: c.text, fill: c.text }} />
                    <span style={{ fontWeight: '700', fontSize: '12px', color: c.text }}>{brand.rating === 0 ? '—' : brand.rating.toFixed(1)}</span>
                </div>
            </div>

            {/* Pillar */}
            <div style={{
                width: '100%',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                background: c.bg,
                opacity: 0.3,
                position: 'relative',
                height: height
            }}>
                <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    opacity: 0.5
                }}>
                    <span style={{ fontSize: '32px', fontWeight: '900', color: c.text }}>#{position}</span>
                </div>
            </div>
        </div>
    );
}
