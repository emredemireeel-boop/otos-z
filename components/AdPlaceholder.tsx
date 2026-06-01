"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Sparkles, Zap, ChevronRight, ChevronLeft } from "lucide-react";

interface Ad {
    id: string;
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
    advertiser: string;
}

interface AdPlaceholderProps {
    position: string;
    className?: string;
    style?: React.CSSProperties;
    fallbackTitle?: string;
    fallbackDesc?: string;
}

export default function AdPlaceholder({
    position,
    className,
    style,
    fallbackTitle = "Buraya Reklam Ver",
    fallbackDesc = "Günde 10.000+ otomotiv tutkununa ulaşın. (Önerilen Görsel: 300x300px Kare)"
}: AdPlaceholderProps) {
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
                const activeAds = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Ad[];
                
                // Shuffle or limit to 10 if needed
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

    // Slider effect: 60 seconds / max 10 ads = 6 seconds per ad
    useEffect(() => {
        if (ads.length <= 1) return;
        
        // As requested: 6 seconds if 10 ads, so total 1 min.
        // Even if less than 10 ads, 6 seconds is a good default interval.
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, 6000); 

        return () => clearInterval(interval);
    }, [ads.length]);

    if (loading) {
        return (
            <div style={{
                background: 'var(--secondary)', border: '1px dashed var(--card-border)', borderRadius: '16px',
                aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style
            }} className={className}>
                <div style={{ opacity: 0.5, fontSize: '14px', color: 'var(--text-muted)' }}>Yükleniyor...</div>
            </div>
        );
    }

    if (ads.length === 0) {
        // Fallback: Buraya Reklam Ver
        return (
            <Link href="/iletisim" className="ad-placeholder-mobile" style={{ textDecoration: 'none', display: 'block', width: '100%', aspectRatio: '1 / 1' }}>
                <div style={{
                    background: 'var(--secondary)', border: '1px dashed var(--card-border)', borderRadius: '16px',
                    height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', padding: '20px', textAlign: 'center',
                    ...style
                }}
                    className={className}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                        <Sparkles size={20} color="currentColor" />
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>{fallbackTitle}</h3>
                    <p style={{ fontSize: '12px', lineHeight: '1.5', margin: 0 }}>{fallbackDesc}</p>
                </div>
            </Link>
        );
    }

    const currentAd = ads[currentIndex];

    return (
        <div className="ad-placeholder-mobile" style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', ...style }}>
            <a href={currentAd.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div style={{
                    background: 'var(--card-bg)', border: '1px solid var(--primary)', borderRadius: '16px', padding: '16px',
                    position: 'relative', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    transition: 'opacity 0.3s ease-in-out'
                }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'white', fontSize: '10px', padding: '4px 10px', borderBottomLeftRadius: '12px', fontWeight: 'bold', zIndex: 2 }}>
                        Sponsorlu
                    </div>
                    
                    {currentAd.imageUrl ? (
                        <div style={{ 
                            width: '100%', flex: '1', borderRadius: '10px', marginBottom: '10px',
                            backgroundImage: `url(${currentAd.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center',
                            minHeight: '0'
                        }} />
                    ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '10px' }}>
                            <Zap size={20} />
                        </div>
                    )}
                    
                    <div style={{ marginTop: 'auto' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{currentAd.title}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{currentAd.description}</p>
                        <div style={{ fontSize: '10px', color: 'var(--text-subtle)', marginTop: '6px', fontWeight: '600' }}>{currentAd.advertiser}</div>
                    </div>
                </div>
            </a>

            {/* Slider Controls / Indicators if multiple ads */}
            {ads.length > 1 && (
                <div style={{ position: 'absolute', bottom: '12px', right: '20px', display: 'flex', gap: '4px', zIndex: 2 }}>
                    {ads.map((_, idx) => (
                        <div key={idx} style={{
                            width: idx === currentIndex ? '12px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            background: idx === currentIndex ? 'var(--primary)' : 'var(--card-border)',
                            transition: 'all 0.3s ease'
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
}
