"use client";

import { useState } from "react";
import { Star, X, MessageSquare } from "lucide-react";

export default function RatingDialog({
    brandName,
    onClose
}: {
    brandName: string,
    onClose: () => void
}) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");

    const labels = {
        5: "Mükemmel! 🎉",
        4: "Çok İyi! 👍",
        3: "İyi 👍",
        2: "Orta 🤔",
        1: "Kötü 😞"
    };

    const handleSubmit = () => {
        // Handle submission logic here
        console.log({ brandName, rating, comment });
        onClose();
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div style={{
                    background: 'var(--primary)',
                    padding: '32px',
                    position: 'relative'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    >
                        <X style={{ width: '20px', height: '20px', color: 'white' }} />
                    </button>

                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '8px'
                    }}>
                        {brandName} Değerlendir
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.9)'
                    }}>
                        Deneyimini paylaşarak diğer kullanıcılara yardımcı ol
                    </p>
                </div>

                {/* Content */}
                <div style={{ padding: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        {/* Left: Rating */}
                        <div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: 'var(--foreground)',
                                marginBottom: '20px'
                            }}>
                                Puanını Ver
                            </h3>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '12px',
                                marginBottom: '16px',
                                padding: '20px',
                                background: 'var(--secondary)',
                                borderRadius: '16px'
                            }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '8px',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    >
                                        <Star
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                fill: star <= (hoverRating || rating) ? '#eab308' : 'transparent',
                                                color: star <= (hoverRating || rating) ? '#eab308' : '#404040',
                                                transition: 'all 0.2s'
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div style={{
                                textAlign: 'center',
                                minHeight: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {(hoverRating || rating) > 0 && (
                                    <p style={{
                                        fontSize: '20px',
                                        fontWeight: '700',
                                        color: '#eab308',
                                        animation: 'fadeIn 0.2s'
                                    }}>
                                        {labels[(hoverRating || rating) as keyof typeof labels]}
                                    </p>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div style={{
                                marginTop: '24px',
                                padding: '16px',
                                background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.1), rgba(0, 212, 255, 0.1))',
                                border: '1px solid var(--primary)',
                                borderRadius: '12px'
                            }}>
                                <p style={{
                                    fontSize: '13px',
                                    color: 'var(--text-muted)',
                                    lineHeight: '1.6'
                                }}>
                                    💡 <strong>İpucu:</strong> Dürüst ve detaylı değerlendirmeler diğer kullanıcılar için çok değerlidir!
                                </p>
                            </div>
                        </div>

                        {/* Right: Comment */}
                        <div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: 'var(--foreground)',
                                marginBottom: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <MessageSquare style={{ width: '18px', height: '18px' }} />
                                Yorumun (İsteğe Bağlı)
                            </h3>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Deneyimini detaylı anlat... Ne beğendin? Neleri geliştirmeli?"
                                style={{
                                    width: '100%',
                                    height: '240px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    color: 'var(--foreground)',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    resize: 'none',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                            />

                            <p style={{
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                                marginTop: '8px'
                            }}>
                                {comment.length}/500 karakter
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '16px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '12px',
                                color: 'var(--foreground)',
                                fontWeight: '600',
                                fontSize: '15px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            İptal
                        </button>
                        <button
                            disabled={rating === 0}
                            onClick={handleSubmit}
                            style={{
                                flex: 2,
                                padding: '16px',
                                background: rating === 0
                                    ? 'var(--secondary)'
                                    : 'var(--primary)',
                                border: 'none',
                                borderRadius: '12px',
                                color: rating === 0 ? 'var(--text-muted)' : 'white',
                                fontWeight: '700',
                                fontSize: '16px',
                                cursor: rating === 0 ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: rating === 0 ? 'none' : '0 4px 12px rgba(255, 107, 0, 0.3)'
                            }}
                        >
                            {rating === 0 ? 'Puan Seç' : 'Değerlendirmeyi Gönder'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
