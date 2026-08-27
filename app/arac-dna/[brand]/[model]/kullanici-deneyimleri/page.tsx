"use client";

import { useParams } from "next/navigation";
import { createSlug, vehicleDNAData } from "@/data/vehicle-dna";
import Link from "next/link";
import { MessageCircle, Star, ThumbsUp } from "lucide-react";


const levelColors: Record<string, { bg: string; text: string }> = {
    "Çaylak": { bg: "rgba(100, 100, 100, 0.2)", text: "#888" },
    "Sürücü": { bg: "rgba(59, 130, 246, 0.2)", text: "#3b82f6" },
    "Tutkun": { bg: "rgba(168, 85, 247, 0.2)", text: "#a855f7" },
    "Usta": { bg: "rgba(245, 158, 11, 0.2)", text: "#f59e0b" },
    "Efsane": { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" },
};

export default function UserExperiencesPage() {
    const params = useParams();

    const brandSlug = (params?.brand as string)?.toLowerCase() || "";
    const modelSlug = (params?.model as string)?.toLowerCase() || "";

    const vehicle = vehicleDNAData.find(v => {
        const vBrandSlug = createSlug(v.brand);
        const vModelSlug = createSlug(v.model);
        return vBrandSlug === brandSlug && vModelSlug === modelSlug;
    });

    if (!vehicle) return null;


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
                {vehicle.userExperiences.length > 0
                    ? `Toplam ${vehicle.userExperiences.length} onaylanmış sürücü deneyimi listeleniyor.`
                    : 'Bu model için henüz onaylanmış sürücü deneyimi bulunmuyor. Teknik kayıtları inceleyebilir veya deneyiminizi forumda başlık açarak paylaşabilirsiniz.'}
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
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Bu araç için henüz onaylanmış sürücü deneyimi yok. Mevcut teknik verileri inceleyebilir veya deneyiminizi forumda paylaşabilirsiniz.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <Link href={`/arac-dna/${brandSlug}/${modelSlug}/kronik-sorunlar`} style={{ padding: '10px 14px', borderRadius: '9px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--primary)', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                            {vehicle.chronicIssues.length} kronik sorunu incele
                        </Link>
                        <Link href={`/arac-dna/${brandSlug}/${modelSlug}/neden-alinir`} style={{ padding: '10px 14px', borderRadius: '9px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--primary)', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                            Artıları ve eksileri gör
                        </Link>
                        <Link href={`/arac-dna/${brandSlug}/${modelSlug}`} style={{ padding: '10px 14px', borderRadius: '9px', background: 'var(--primary)', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
                            Motor seçeneklerine dön
                        </Link>
                    </div>
                </div>
            )}

            <div style={{
                background: 'linear-gradient(145deg, var(--card-bg), var(--secondary))',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                padding: '24px'
            }}>
                <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                    Deneyiminizi toplulukla paylaşın
                </h4>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                    Araç yılı, motor, kilometre ve bakım geçmişini belirterek forumda yeni başlık açın. Yayınlanan deneyimler moderasyon ve kaynak kontrolünden sonra Araç DNA dosyasına eklenebilir.
                </p>
                <Link href="/forum" style={{ display: 'inline-flex', padding: '12px 18px', background: 'var(--primary)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: 700 }}>
                    Forumda deneyim paylaş
                </Link>
            </div>
        </div>
    );
}
