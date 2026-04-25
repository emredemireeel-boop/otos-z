"use client";

import { useParams } from "next/navigation";
import { vehicleDNAData, getDNAScoreColor, getDNAScoreLabel } from "@/data/vehicle-dna";
import { Star, Shield, Info } from "lucide-react";
import Link from "next/link";

export default function VehicleDNAOverviewPage() {
    const params = useParams();

    const brandSlug = (params?.brand as string)?.toLowerCase() || "";
    const modelSlug = (params?.model as string)?.toLowerCase() || "";

    const vehicle = vehicleDNAData.find(v => {
        const vBrandSlug = v.brand.toLowerCase().replace(/\s+/g, '-');
        const vModelSlug = v.model.toLowerCase().replace(/\s+/g, '-');
        return vBrandSlug === brandSlug && vModelSlug === modelSlug;
    });

    if (!vehicle) return null; // Handled by layout

    const scoreColor = getDNAScoreColor(vehicle.dnaScore);
    const scoreLabel = getDNAScoreLabel(vehicle.dnaScore);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
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
                        EURO NCAP GÜVENLİK
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

            {/* Quick Summary Alert */}
            <div style={{
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderLeft: '4px solid #3b82f6',
                borderRadius: '12px',
                padding: '24px'
            }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '700', color: '#3b82f6', marginBottom: '12px' }}>
                    <Info size={20} /> Otosöz Uzman Özeti
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.6', marginBottom: 0 }}>
                    {vehicle.brand} {vehicle.model}, {vehicle.dnaScore >= 80 ? "sınıfının en güçlü seçeneklerinden biridir." : vehicle.dnaScore >= 60 ? "fiyat/performans açısından değerlendirilebilir bir araçtır." : "almadan önce dikkatlice araştırılması gereken bir araçtır."} Toplamda <strong>{vehicle.chronicIssues.length} kronik sorun</strong> raporlanmış olup, <strong>{vehicle.totalReports}</strong> kullanıcı deneyimi sistemimize kaydedilmiştir. Detaylar için yukarıdaki sekmeleri kullanabilirsiniz.
                </p>
            </div>
            
            {/* Shortcuts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
                 <Link href={`/arac-dna/${brandSlug}/${modelSlug}/kronik-sorunlar`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--foreground)' }}>Kronik Sorunları İncele</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{vehicle.chronicIssues.length} bilinen arıza listelendi</div>
                        </div>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>→</span>
                    </div>
                </Link>
                <Link href={`/arac-dna/${brandSlug}/${modelSlug}/kullanici-deneyimleri`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--foreground)' }}>Kullanıcı Yorumları</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{vehicle.userExperiences.length} kişi bu aracı değerlendirdi</div>
                        </div>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>→</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
