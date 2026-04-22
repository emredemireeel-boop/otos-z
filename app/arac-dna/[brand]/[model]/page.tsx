"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { vehicleDNAData, getDNAScoreColor, getDNAScoreLabel, getSeverityColor, getSeverityLabel } from "@/data/vehicle-dna";
import { ArrowLeft, Dna, CheckCircle, AlertTriangle, Wrench, MessageCircle, ThumbsUp, Star, Shield } from "lucide-react";

// Yazar seviye renkleri
const levelColors: Record<string, { bg: string; text: string }> = {
    "Çaylak": { bg: "rgba(100, 100, 100, 0.2)", text: "#888" },
    "Sürücü": { bg: "rgba(59, 130, 246, 0.2)", text: "#3b82f6" },
    "Tutkun": { bg: "rgba(168, 85, 247, 0.2)", text: "#a855f7" },
    "Usta": { bg: "rgba(245, 158, 11, 0.2)", text: "#f59e0b" },
    "Efsane": { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" },
};

export default function VehicleDNADetailPage() {
    const params = useParams();
    const [newExperience, setNewExperience] = useState("");
    const [rating, setRating] = useState(5);

    // Parse brand and model from URL
    const brand = (params.brand as string)?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const model = (params.model as string)?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Find vehicle data
    const vehicle = vehicleDNAData.find(v =>
        v.brand.toLowerCase() === brand?.toLowerCase() &&
        v.model.toLowerCase() === model?.toLowerCase()
    );

    if (!vehicle) {
        return (
            <div>
                <Navbar />
                <main style={{ minHeight: '100vh', background: 'var(--background)', padding: '100px 20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '24px', color: 'var(--foreground)' }}>Araç DNA verisi bulunamadı</h1>
                        <Link href="/arac-dna">
                            <button style={{
                                marginTop: '20px',
                                padding: '12px 24px',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}>
                                Araç DNA Sayfasına Dön
                            </button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const scoreColor = getDNAScoreColor(vehicle.dnaScore);
    const scoreLabel = getDNAScoreLabel(vehicle.dnaScore);

    const handleSubmitExperience = () => {
        if (newExperience.trim()) {
            alert("Deneyiminiz gönderildi! (Demo mode)");
            setNewExperience("");
            setRating(5);
        }
    };

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                    {/* Back Button */}
                    <Link href="/arac-dna">
                        <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '10px',
                            color: 'var(--foreground)',
                            cursor: 'pointer',
                            marginBottom: '24px',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            <ArrowLeft size={18} />
                            Geri Dön
                        </button>
                    </Link>

                    {/* Header */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '16px',
                        padding: '32px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${scoreColor}, ${scoreColor}dd)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Dna size={32} color="white" />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', margin: 0, marginBottom: '4px' }}>
                                    {vehicle.brand} {vehicle.model}
                                </h1>
                                <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: 0 }}>
                                    {vehicle.year} Model
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        {/* DNA Score Card */}
                        <div style={{
                            background: `linear-gradient(135deg, ${scoreColor}15, ${scoreColor}05)`,
                            border: `2px solid ${scoreColor}`,
                            borderRadius: '16px',
                            padding: '32px',
                            textAlign: 'center'
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                DNA SKORU
                            </h2>
                            <div style={{ fontSize: '64px', fontWeight: '800', color: scoreColor, marginBottom: '16px' }}>
                                {vehicle.dnaScore}<span style={{ fontSize: '32px', opacity: 0.6 }}>/100</span>
                            </div>
                            <div style={{
                                width: '100%',
                                maxWidth: '300px',
                                height: '12px',
                                background: 'var(--secondary)',
                                borderRadius: '6px',
                                overflow: 'hidden',
                                margin: '0 auto 16px'
                            }}>
                                <div style={{
                                    width: `${vehicle.dnaScore}%`,
                                    height: '100%',
                                    background: scoreColor,
                                    transition: 'width 0.5s ease'
                                }} />
                            </div>
                            <div style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: scoreColor
                            }}>
                                {scoreLabel}
                            </div>
                        </div>

                        {/* Euro NCAP Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.05))',
                            border: '2px solid #2563eb',
                            borderRadius: '16px',
                            padding: '32px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Shield size={20} />
                                EURO NCAP
                            </h2>
                            {vehicle.ncapStars ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={40}
                                                fill={i < (vehicle.ncapStars || 0) ? '#EAB308' : 'var(--secondary)'}
                                                color={i < (vehicle.ncapStars || 0) ? '#EAB308' : '#666'}
                                            />
                                        ))}
                                    </div>
                                    <div style={{
                                        fontSize: '24px',
                                        fontWeight: '700',
                                        color: '#EAB308',
                                        marginBottom: '8px'
                                    }}>
                                        {vehicle.ncapStars} Yıldız
                                    </div>
                                    {vehicle.ncapYear && (
                                        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                            Test Yılı: {vehicle.ncapYear}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ color: 'var(--text-muted)' }}>
                                    NCAP verisi bulunamadı
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        {/* Strengths */}
                        <div style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '16px',
                            padding: '24px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <CheckCircle size={24} color="#22C55E" />
                                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                                    Güçlü Yanları
                                </h3>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {vehicle.strengths.map((strength, index) => (
                                    <li key={index} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        padding: '12px',
                                        background: 'rgba(34, 197, 94, 0.05)',
                                        borderRadius: '8px',
                                        marginBottom: '8px'
                                    }}>
                                        <span style={{ color: '#22C55E', fontSize: '18px', flexShrink: 0 }}>✓</span>
                                        <span style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5' }}>
                                            {strength}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Weaknesses */}
                        <div style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '16px',
                            padding: '24px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <AlertTriangle size={24} color="#F59E0B" />
                                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                                    Zayıf Yanları
                                </h3>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {vehicle.weaknesses.map((weakness, index) => (
                                    <li key={index} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        padding: '12px',
                                        background: 'rgba(245, 158, 11, 0.05)',
                                        borderRadius: '8px',
                                        marginBottom: '8px'
                                    }}>
                                        <span style={{ color: '#F59E0B', fontSize: '18px', flexShrink: 0 }}>⚠️</span>
                                        <span style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5' }}>
                                            {weakness}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Chronic Issues */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '16px',
                        padding: '32px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                            <Wrench size={24} color="var(--primary)" />
                            <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                                Kronik Sorunlar
                            </h3>
                        </div>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            {vehicle.chronicIssues.map((issue) => {
                                const severityColor = getSeverityColor(issue.severity);
                                const severityLabel = getSeverityLabel(issue.severity);

                                return (
                                    <div key={issue.id} style={{
                                        background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '12px',
                                        padding: '20px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <h4 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--foreground)', margin: 0 }}>
                                                {issue.title}
                                            </h4>
                                            <span style={{
                                                padding: '4px 12px',
                                                background: `${severityColor}20`,
                                                color: severityColor,
                                                fontSize: '12px',
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {severityLabel} Seviye
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '12px' }}>
                                            {issue.description}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                            <span>📊</span>
                                            <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{issue.reportCount}</span>
                                            <span>kullanıcı raporu</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* User Experiences */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '16px',
                        padding: '32px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                            <MessageCircle size={24} color="var(--primary)" />
                            <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                                Kullanıcı Deneyimleri ({vehicle.userExperiences.length})
                            </h3>
                        </div>

                        {vehicle.userExperiences.length > 0 ? (
                            <div style={{ marginBottom: '32px' }}>
                                {vehicle.userExperiences.map((exp) => (
                                    <div key={exp.id} style={{
                                        background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        marginBottom: '12px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: levelColors[exp.authorLevel]?.bg || '#333',
                                                color: levelColors[exp.authorLevel]?.text || '#888',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                flexShrink: 0
                                            }}>
                                                {exp.author.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                    <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--primary)' }}>
                                                        @{exp.author}
                                                    </span>
                                                    <span style={{
                                                        padding: '2px 8px',
                                                        background: levelColors[exp.authorLevel]?.bg || '#333',
                                                        color: levelColors[exp.authorLevel]?.text || '#888',
                                                        fontSize: '11px',
                                                        borderRadius: '4px',
                                                        fontWeight: '600'
                                                    }}>
                                                        {exp.authorLevel}
                                                    </span>
                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                        • {exp.date}
                                                    </span>
                                                    <div style={{ display: 'flex', gap: '2px', marginLeft: '8px' }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={14}
                                                                fill={i < exp.rating ? '#FFC107' : 'none'}
                                                                color={i < exp.rating ? '#FFC107' : '#666'}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--foreground)', marginBottom: '12px' }}>
                                                    {exp.text}
                                                </p>
                                                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <ThumbsUp size={14} />
                                                        {exp.likes}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <MessageCircle size={14} />
                                                        {exp.replies} yanıt
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '32px', textAlign: 'center', padding: '20px' }}>
                                Henüz kullanıcı deneyimi paylaşılmamış. İlk siz paylaşın!
                            </p>
                        )}

                        {/* Add Experience Form */}
                        <div style={{
                            background: 'var(--secondary)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '12px',
                            padding: '20px'
                        }}>
                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>
                                Deneyiminizi Paylaşın
                            </h4>

                            {/* Rating */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Puanınız
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0
                                            }}
                                        >
                                            <Star
                                                size={28}
                                                fill={star <= rating ? '#FFC107' : 'none'}
                                                color={star <= rating ? '#FFC107' : '#666'}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                value={newExperience}
                                onChange={(e) => setNewExperience(e.target.value)}
                                placeholder="Aracınız hakkındaki deneyimlerinizi, yaşadığınız sorunları veya memnuniyetinizi paylaşın..."
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'var(--background)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '10px',
                                    color: 'var(--foreground)',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    marginBottom: '12px'
                                }}
                            />
                            <button
                                onClick={handleSubmitExperience}
                                disabled={!newExperience.trim()}
                                style={{
                                    padding: '12px 24px',
                                    background: newExperience.trim() ? 'linear-gradient(135deg, #FF6B35, #FF8E53)' : 'var(--secondary)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: newExperience.trim() ? 'pointer' : 'not-allowed',
                                    opacity: newExperience.trim() ? 1 : 0.5
                                }}
                            >
                                Deneyimi Paylaş
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
