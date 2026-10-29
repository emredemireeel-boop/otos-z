import type {BrandRating} from '@/data/guvenmetre';
import {Star,ChevronRight,Youtube,Instagram,Share2,MessageSquare,ThumbsUp,Users,Award,MapPin} from 'lucide-react';
import BrandLogoClient from '@/components/guvenmetre/BrandLogoClient';
export default function BrandHeader({brand,categoryId}:{brand:BrandRating;categoryId:string}){return <>                {/* Header Section */}
                <div style={{
                    background: 'var(--overlay-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        {/* Breadcrumb */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
                            <a href={'/guvenmetre'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                GüvenMetre
                            </a>
                            <ChevronRight style={{ width: '14px', height: '14px' }} />
                            <a href={`/guvenmetre/${categoryId}`} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                Kategori
                            </a>
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
                                        <BrandLogoClient src={brand.logoUrl!} name={brand.name} emoji={brand.logoEmoji}/>
                                    ) : null}
                                    <span style={{ display: brand.logoUrl ? 'none' : 'block' }}>{brand.logoEmoji}</span>
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

                            {/* Specialties Tags */}
                            {brand.specialties && brand.specialties.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                                    {brand.specialties.map(tag => (
                                        <span key={tag} style={{
                                            fontSize: '12px', fontWeight: '600',
                                            padding: '5px 14px', borderRadius: '20px',
                                            background: 'var(--secondary)', color: 'var(--text-muted)',
                                            border: '1px solid var(--card-border)'
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Social + Action Buttons */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
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
                                {brand.youtubeUrl && (
                                    <a
                                        href={brand.youtubeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: '12px 24px',
                                            background: '#ff0000',
                                            border: 'none',
                                            borderRadius: '10px',
                                            color: 'white',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '14px',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <Youtube style={{ width: '18px', height: '18px' }} />
                                        Kanala Git
                                    </a>
                                )}
                                {brand.instagramUrl && (
                                    <a
                                        href={brand.instagramUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: '12px 24px',
                                            background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                                            border: 'none',
                                            borderRadius: '10px',
                                            color: 'white',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '14px',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <Instagram style={{ width: '18px', height: '18px' }} />
                                        Instagram
                                    </a>
                                )}
                                <button
                                    data-open-rating
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
                                        boxShadow: '0 4px 12px var(--primary-glow)'
                                    }}
                                >
                                    <Star style={{ width: '18px', height: '18px' }} />
                                    Oy Ver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

</>;}
