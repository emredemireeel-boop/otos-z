"use client";

import { useParams } from "next/navigation";
import { vehicleDNAData } from "@/data/vehicle-dna";
import { MessageCircle, Star, ThumbsUp } from "lucide-react";
import { useState } from "react";

const levelColors: Record<string, { bg: string; text: string }> = {
    "Çaylak": { bg: "rgba(100, 100, 100, 0.2)", text: "#888" },
    "Sürücü": { bg: "rgba(59, 130, 246, 0.2)", text: "#3b82f6" },
    "Tutkun": { bg: "rgba(168, 85, 247, 0.2)", text: "#a855f7" },
    "Usta": { bg: "rgba(245, 158, 11, 0.2)", text: "#f59e0b" },
    "Efsane": { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" },
};

export default function UserExperiencesPage() {
    const params = useParams();
    const [newExperience, setNewExperience] = useState("");
    const [rating, setRating] = useState(5);

    const brandSlug = (params?.brand as string)?.toLowerCase() || "";
    const modelSlug = (params?.model as string)?.toLowerCase() || "";

    const vehicle = vehicleDNAData.find(v => {
        const vBrandSlug = v.brand.toLowerCase().replace(/\s+/g, '-');
        const vModelSlug = v.model.toLowerCase().replace(/\s+/g, '-');
        return vBrandSlug === brandSlug && vModelSlug === modelSlug;
    });

    if (!vehicle) return null;

    const handleSubmitExperience = () => {
        if (newExperience.trim()) {
            alert("Deneyiminiz incelenmek üzere moderasyon kuyruğuna gönderildi.");
            setNewExperience("");
            setRating(5);
        }
    };

    return (
        <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '32px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <MessageCircle size={24} color="var(--primary)" />
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>
                    {vehicle.brand} {vehicle.model} Kullanıcı Yorumları
                </h2>
            </div>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
                Gerçek araç sahipleri tarafından paylaşılan şeffaf ve onaylanmış Otosöz yorumları. Toplam {vehicle.userExperiences.length} değerlendirme listeleniyor.
            </p>

            {/* Existing Comments */}
            {vehicle.userExperiences.length > 0 ? (
                <div style={{ marginBottom: '40px' }}>
                    {vehicle.userExperiences.map((exp) => (
                        <div key={exp.id} style={{
                            background: 'var(--secondary)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '12px',
                            padding: '24px',
                            marginBottom: '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: levelColors[exp.authorLevel]?.bg || '#333',
                                    color: levelColors[exp.authorLevel]?.text || '#888',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    flexShrink: 0
                                }}>
                                    {exp.author.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>
                                            @{exp.author}
                                        </span>
                                        <span style={{
                                            padding: '2px 8px',
                                            background: levelColors[exp.authorLevel]?.bg || '#333',
                                            color: levelColors[exp.authorLevel]?.text || '#888',
                                            fontSize: '12px',
                                            borderRadius: '6px',
                                            fontWeight: '700'
                                        }}>
                                            {exp.authorLevel}
                                        </span>
                                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                                            {exp.date}
                                        </span>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i < exp.rating ? '#FFC107' : 'none'}
                                                color={i < exp.rating ? '#FFC107' : '#666'}
                                            />
                                        ))}
                                    </div>

                                    <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--foreground)', marginBottom: '16px' }}>
                                        {exp.text}
                                    </p>
                                    
                                    <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: 'var(--text-muted)', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                                        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>
                                            <ThumbsUp size={16} /> {exp.likes}
                                        </button>
                                        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>
                                            <MessageCircle size={16} /> {exp.replies} Yanıt
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ padding: '40px', textAlign: 'center', background: 'var(--secondary)', borderRadius: '12px', border: '1px dashed var(--card-border)', marginBottom: '40px' }}>
                    <span style={{ fontSize: '40px', marginBottom: '16px', display: 'block' }}>✍️</span>
                    <h3 style={{ fontSize: '18px', color: 'var(--foreground)', marginBottom: '8px' }}>Henüz Yorum Yok</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Bu araç için henüz deneyim paylaşılmamış. İlk değerlendiren siz olun!</p>
                </div>
            )}

            {/* Add Experience Form */}
            <div style={{
                background: 'linear-gradient(145deg, var(--card-bg), var(--secondary))',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                padding: '24px'
            }}>
                <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px' }}>
                    Kendi Deneyiminizi Paylaşın
                </h4>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>
                        Genel Memnuniyet Puanınız
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
                                    padding: '4px',
                                    transition: 'transform 0.1s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <Star
                                    size={32}
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
                    placeholder="Aracınız hakkındaki olumlu ve olumsuz yönleri, sürüş hissiyatını veya yaşadığınız sorunları detaylıca anlatın..."
                    rows={5}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'var(--background)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '12px',
                        color: 'var(--foreground)',
                        fontSize: '15px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        marginBottom: '16px',
                        outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                />
                
                <button
                    onClick={handleSubmitExperience}
                    disabled={!newExperience.trim()}
                    style={{
                        padding: '14px 28px',
                        background: newExperience.trim() ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'var(--secondary)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: newExperience.trim() ? 'pointer' : 'not-allowed',
                        opacity: newExperience.trim() ? 1 : 0.5,
                        width: '100%',
                        transition: 'all 0.2s'
                    }}
                >
                    İncelemeyi Gönder
                </button>
            </div>
        </div>
    );
}
