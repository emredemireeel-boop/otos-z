"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { Sparkles, Zap, ChevronRight, ChevronLeft } from "lucide-react";

interface Ad {
    id: string;
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
    advertiser: string;
    createdAt?: any;
}

interface AdPlaceholderProps {
    position?: string;
    className?: string;
    style?: React.CSSProperties;
    fallbackTitle?: string;
    fallbackDesc?: string;
    variant?: 'square' | 'banner' | 'rail';
}

export default function AdPlaceholder({
    position = "general",
    className,
    style,
    fallbackTitle = "Buraya Reklam Ver",
    fallbackDesc = "Günde 10.000+ otomotiv tutkununa ulaşın.",
    variant = "square"
}: AdPlaceholderProps) {
    const { theme } = useTheme();
    const [ads, setAds] = useState<Ad[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAds() {
            try {
                const adsQuery = query(
                    collection(db, "advertisements"),
                    where("status", "==", "active"),
                    where("position", "==", position)
                );
                const snapshot = await getDocs(adsQuery);
                let activeAds = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Ad[];

                // En güncel olanlar en başta olacak şekilde sırala
                activeAds.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
                    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
                    return timeB - timeA;
                });
                
                const limitedAds = activeAds.slice(0, 10);
                setAds(limitedAds);
            } catch (error) {
                console.error("Ads fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAds();
    }, [position]);

    useEffect(() => {
        if (ads.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, 6000); 

        return () => clearInterval(interval);
    }, [ads.length]);

    const isBanner = variant === 'banner';
    const isRail = variant === 'rail';
    const containerStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        aspectRatio: isBanner || isRail ? 'auto' : '1 / 1',
        height: isRail ? '100%' : isBanner ? '75px' : 'auto',
        ...style
    };

    if (loading) {
        return (
            <div style={{
                background: 'var(--secondary)', border: '1px dashed var(--card-border)', borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', ...containerStyle
            }} className={`${isRail ? 'ad-placeholder-mobile ad-rail-placeholder ' : ''}${className || ''}` }>
                <div style={{ opacity: 0.5, fontSize: '14px', color: 'var(--text-muted)' }}>Yükleniyor...</div>
            </div>
        );
    }

    if (ads.length === 0) {
        if (isRail) {
            return (
                <Link href="/iletisim" className={`ad-placeholder-mobile ad-rail-placeholder ${className || ''}`} style={{ textDecoration: 'none', display: 'block', ...containerStyle }}>
                    <div className="ad-rail-fallback">
                        <span className="ad-rail-fallback-icon"><Image src={theme === "light" ? "/whitemode_logo.svg" : "/dark_logo.svg"} alt="OtoSöz" width={34} height={34} /></span>
                        <span className="ad-rail-fallback-kicker">Reklam alanı</span>
                        <h3>{fallbackTitle}</h3>
                        <p>{fallbackDesc}</p>
                        <span className="ad-rail-fallback-action">Bilgi al <ChevronRight size={14} /></span>
                    </div>
                </Link>
            );
        }

        return (
            <Link href="/iletisim" className="ad-placeholder-mobile" style={{ textDecoration: 'none', display: 'block', ...containerStyle }}>
                <div style={{
                    background: 'var(--secondary)', border: '1px dashed var(--card-border)', borderRadius: isBanner ? '12px' : '16px',
                    height: '100%', display: 'flex', flexDirection: isBanner ? 'row' : 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', padding: isBanner ? '0 16px' : '20px', textAlign: isBanner ? 'left' : 'center'
                }}
                    className={className}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                    <div style={{ 
                        width: isBanner ? '32px' : '42px', height: isBanner ? '32px' : '42px', borderRadius: '50%', 
                        background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        marginBottom: isBanner ? '0' : '14px', marginRight: isBanner ? '12px' : '0', flexShrink: 0
                    }}>
                        <Sparkles size={isBanner ? 16 : 20} color="currentColor" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                        <h3 style={{ fontSize: isBanner ? '13px' : '15px', fontWeight: '700', marginBottom: isBanner ? '2px' : '8px', whiteSpace: isBanner ? 'nowrap' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fallbackTitle}</h3>
                        <p style={{ fontSize: isBanner ? '11px' : '12px', lineHeight: '1.4', margin: 0, whiteSpace: isBanner ? 'nowrap' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fallbackDesc}</p>
                    </div>
                </div>
            </Link>
        );
    }

    const currentAd = ads[currentIndex];
    const adHref = currentAd?.url ? currentAd.url : "/iletisim";
    const adTarget = currentAd?.url ? "_blank" : "_self";

    if (isRail) {
        return (
            <div className={`ad-placeholder-mobile ad-rail-placeholder ${className || ''}`} style={containerStyle}>
                <Link href={adHref} target={adTarget} rel={currentAd?.url ? "sponsored noopener noreferrer" : undefined} className="ad-rail-link" aria-label={`${currentAd.title} — ${currentAd.advertiser}` }>
                    <div className={`ad-rail-creative${currentAd.imageUrl ? ' has-image' : ''}`}>
                        <span className="ad-rail-sponsored">Sponsorlu</span>
                        {currentAd.imageUrl ? (
                            <div className="ad-rail-image" style={{ backgroundImage: `url(${currentAd.imageUrl})` }} />
                        ) : (
                            <>
                                <span className="ad-rail-brand-icon"><Zap size={24} /></span>
                                <div className="ad-rail-copy">
                                    <h4>{currentAd.title}</h4>
                                    <p>{currentAd.description}</p>
                                    <small>{currentAd.advertiser}</small>
                                </div>
                            </>
                        )}
                    </div>
                </Link>
                {ads.length > 1 && (
                    <div className="ad-rail-dots" aria-hidden="true">
                        {ads.map((_, idx) => <span key={idx} className={idx === currentIndex ? 'active' : ''} />)}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`ad-placeholder-mobile ${className || ''}`} style={containerStyle}>
            <Link href={adHref} target={adTarget} rel={currentAd?.url ? "sponsored noopener noreferrer" : undefined} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div style={{
                    background: 'var(--card-bg)', border: '1px solid var(--primary)', borderRadius: isBanner ? '12px' : '16px', padding: isBanner && currentAd.imageUrl ? '0' : isBanner ? '8px 12px' : '16px',
                    position: 'relative', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', height: '100%',
                    display: 'flex', flexDirection: isBanner ? 'row' : 'column', alignItems: isBanner ? 'center' : 'stretch', gap: isBanner ? '12px' : '0',
                    transition: 'opacity 0.3s ease-in-out'
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, background: 'var(--primary)', color: 'white', fontSize: '9px', padding: '3px 8px', borderBottomRightRadius: '8px', fontWeight: '600', zIndex: 2 }}>
                        Sponsorlu
                    </div>
                    
                    {currentAd.imageUrl ? (
                        <div style={{ 
                            width: '100%', height: isBanner ? '100%' : 'auto', flex: '1', borderRadius: isBanner ? '11px' : '8px', marginBottom: isBanner ? '0' : '10px',
                            backgroundImage: `url(${currentAd.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center',
                            minHeight: '0'
                        }} />
                    ) : (
                        <div style={{ 
                            width: isBanner ? '40px' : '40px', height: isBanner ? '40px' : '40px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: isBanner ? '0' : '10px', flexShrink: 0
                        }}>
                            <Zap size={isBanner ? 16 : 20} />
                        </div>
                    )}
                    
                    {!(isBanner && currentAd.imageUrl) && (
                        <div style={{ marginTop: isBanner ? '0' : 'auto', flex: 1, overflow: 'hidden' }}>
                            <h4 style={{ fontSize: isBanner ? '13px' : '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '2px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{currentAd.title}</h4>
                            <p style={{ fontSize: isBanner ? '11px' : '12px', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0, display: '-webkit-box', WebkitLineClamp: isBanner ? 1 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{currentAd.description}</p>
                            {!isBanner && <div style={{ fontSize: '10px', color: 'var(--text-subtle)', marginTop: '6px', fontWeight: '600' }}>{currentAd.advertiser}</div>}
                        </div>
                    )}
                </div>
            </Link>

            {/* Slider Controls */}
            {ads.length > 1 && (
                <div style={{ position: 'absolute', bottom: isBanner ? '6px' : '12px', right: isBanner ? '12px' : '20px', display: 'flex', gap: '4px', zIndex: 2 }}>
                    {ads.map((_, idx) => (
                        <div key={idx} style={{
                            width: idx === currentIndex ? '10px' : '5px',
                            height: '4px',
                            borderRadius: '2px',
                            background: idx === currentIndex ? 'var(--primary)' : 'var(--card-border)',
                            transition: 'all 0.3s ease'
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
}
