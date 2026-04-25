"use client";

import { useState, useEffect } from "react";
import { Share2, Bookmark, BookmarkCheck, Heart, MessageCircle, ChevronUp } from "lucide-react";

interface FloatingActionBarProps {
    title: string;
    url: string;
    onCommentClick?: () => void;
}

export default function FloatingActionBar({ title, url, onCommentClick }: FloatingActionBarProps) {
    const [isSaved, setIsSaved] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 12);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Hide/show based on scroll direction for better UX
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                // Scrolling down - hide
                setIsVisible(false);
            } else {
                // Scrolling up - show
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Otosöz - ${title}`,
                    url: url,
                });
            } catch (err) {
                console.log("Paylaşım iptal edildi veya desteklenmiyor.");
            }
        } else {
            // Fallback copy to clipboard
            navigator.clipboard.writeText(url);
            alert("Bağlantı kopyalandı!");
        }
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* Spacer so content doesn't get hidden behind the bar at the very bottom */}
            <div style={{ height: '70px', display: 'block' }} className="mobile-only-spacer" />

            <div style={{
                position: 'fixed',
                bottom: isVisible ? '16px' : '-80px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100% - 32px)',
                maxWidth: '400px',
                background: 'rgba(20, 20, 25, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50px',
                padding: '12px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                zIndex: 9999,
            }} className="floating-action-bar">
                
                {/* Like Button */}
                <button onClick={handleLike} style={actionBtn(isLiked ? "#ef4444" : "var(--foreground)")}>
                    <Heart size={22} fill={isLiked ? "#ef4444" : "none"} color={isLiked ? "#ef4444" : "var(--foreground)"} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: isLiked ? "#ef4444" : "var(--foreground)" }}>{likeCount}</span>
                </button>

                {/* Comment Button (if applicable) */}
                {onCommentClick && (
                    <button onClick={onCommentClick} style={actionBtn("var(--foreground)")}>
                        <MessageCircle size={22} color="var(--foreground)" />
                    </button>
                )}

                {/* Save Button */}
                <button onClick={() => setIsSaved(!isSaved)} style={actionBtn(isSaved ? "#3b82f6" : "var(--foreground)")}>
                    {isSaved ? <BookmarkCheck size={22} color="#3b82f6" /> : <Bookmark size={22} color="var(--foreground)" />}
                </button>

                {/* Share Button */}
                <button onClick={handleShare} style={actionBtn("var(--foreground)")}>
                    <Share2 size={22} color="var(--foreground)" />
                </button>

                {/* Scroll to Top */}
                <button onClick={scrollToTop} style={{
                    ...actionBtn("var(--foreground)"),
                    background: 'var(--primary)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                }}>
                    <ChevronUp size={20} color="white" />
                </button>
            </div>

            <style>{`
                .floating-action-bar {
                    display: none !important;
                }
                .mobile-only-spacer {
                    display: none !important;
                }
                @media (max-width: 768px) {
                    .floating-action-bar {
                        display: flex !important;
                    }
                    .mobile-only-spacer {
                        display: block !important;
                    }
                }
            `}</style>
        </>
    );
}

function actionBtn(color: string): React.CSSProperties {
    return {
        background: 'none',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        padding: '8px',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
    };
}
