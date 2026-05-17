"use client";

import { useState } from "react";
import { Star, X, MessageSquare, Loader2, CheckCircle, AlertCircle, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function RatingDialog({
    brandName,
    categoryId,
    brandId,
    onClose,
    onSuccess,
}: {
    brandName: string;
    categoryId: string;
    brandId: string;
    onClose: () => void;
    onSuccess?: () => void;
}) {
    const { user, getIdToken } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    const labels = {
        5: "Mükemmel! 🎉",
        4: "Çok İyi! 👍",
        3: "İyi 👍",
        2: "Orta 🤔",
        1: "Kötü 😞"
    };

    const handleSubmit = async () => {
        if (rating === 0 || !user || isSubmitting) return;

        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const token = await getIdToken();
            if (!token) {
                setSubmitResult({ success: false, message: 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın.' });
                setIsSubmitting(false);
                return;
            }

            const res = await fetch('/api/guvenmetre/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    categoryId,
                    brandId,
                    rating,
                    comment: comment.trim(),
                }),
            });

            const data = await res.json();

            if (data.success) {
                setSubmitResult({ success: true, message: data.message || 'Değerlendirmeniz kaydedildi!' });
                setTimeout(() => {
                    onSuccess?.();
                    onClose();
                }, 1500);
            } else {
                setSubmitResult({ success: false, message: data.message || 'Bir hata oluştu.' });
            }
        } catch {
            setSubmitResult({ success: false, message: 'Bağlantı hatası. Lütfen tekrar deneyin.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Giriş yapılmamışsa uyarı göster
    if (!user) {
        return (
            <div
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                >
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%',
                            background: 'var(--secondary)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <LogIn style={{ width: '28px', height: '28px', color: 'var(--primary)' }} />
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '10px' }}>
                            Giriş Yapmalısınız
                        </h2>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
                            Değerlendirme yapabilmek için üye girişi yapmanız gerekiyor.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={onClose}
                                style={{
                                    flex: 1, padding: '12px',
                                    background: 'var(--secondary)', border: '1px solid var(--card-border)',
                                    borderRadius: '10px', color: 'var(--foreground)',
                                    fontWeight: '600', cursor: 'pointer', fontSize: '14px'
                                }}
                            >
                                İptal
                            </button>
                            <Link
                                href="/giris"
                                style={{
                                    flex: 1, padding: '12px',
                                    background: 'var(--primary)', border: 'none',
                                    borderRadius: '10px', color: 'white',
                                    fontWeight: '700', cursor: 'pointer', fontSize: '14px',
                                    textDecoration: 'none', textAlign: 'center', display: 'block'
                                }}
                            >
                                Giriş Yap
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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

                    <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
                        {brandName} Değerlendir
                    </h2>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                        {user.username} olarak değerlendirme yapıyorsunuz
                    </p>
                </div>

                {/* Content */}
                <div style={{ padding: '32px' }}>
                    {/* Success/Error Banner */}
                    {submitResult && (
                        <div style={{
                            padding: '14px 18px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: submitResult.success
                                ? 'rgba(34, 197, 94, 0.1)'
                                : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${submitResult.success ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        }}>
                            {submitResult.success
                                ? <CheckCircle style={{ width: '20px', height: '20px', color: '#22c55e', flexShrink: 0 }} />
                                : <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444', flexShrink: 0 }} />
                            }
                            <span style={{ fontSize: '14px', fontWeight: '600', color: submitResult.success ? '#22c55e' : '#ef4444' }}>
                                {submitResult.message}
                            </span>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        {/* Left: Rating */}
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '20px' }}>
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

                            {/* Info Box */}
                            <div style={{
                                marginTop: '24px',
                                padding: '16px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '12px'
                            }}>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
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
                                onChange={(e) => setComment(e.target.value.slice(0, 500))}
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

                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
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
                            disabled={rating === 0 || isSubmitting}
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
                                cursor: rating === 0 || isSubmitting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: rating === 0 ? 'none' : '0 4px 12px var(--primary-glow)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                                    Gönderiliyor...
                                </>
                            ) : (
                                rating === 0 ? 'Puan Seç' : 'Değerlendirmeyi Gönder'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
