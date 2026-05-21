"use client";

import { useParams } from "next/navigation";
import { vehicleDNAData, getDNAScoreColor, getDNAScoreLabel, createSlug } from "@/data/vehicle-dna";
import { engineDNAData } from "@/data/engine-dna";
import { trimDNAData } from "@/data/trim-dna";
import TrimComparisonTable from "@/components/TrimComparisonTable";
import { Shield, Star, Info, MessageCircle, AlertCircle, TrendingUp, TrendingDown, Clock, ThumbsUp, Wrench, FileText, Package } from "lucide-react";

export default function EngineDetailedPage() {
    const params = useParams();

    const brandSlug = (params?.brand as string)?.toLowerCase() || "";
    const modelSlug = (params?.model as string)?.toLowerCase() || "";
    const engineSlug = (params?.engine as string)?.toLowerCase() || "";

    const vehicle = vehicleDNAData.find(v => {
        const vBrandSlug = createSlug(v.brand);
        const vModelSlug = createSlug(v.model);
        return vBrandSlug === brandSlug && vModelSlug === modelSlug;
    });

    if (!vehicle) return null;

    const specificEngine = engineDNAData.find(e => e.vehicleId === vehicle.id)?.engines.find(e => e.slug === engineSlug);
    if (!specificEngine) return null;

    const activeScore = specificEngine.score;
    const scoreColor = getDNAScoreColor(activeScore);
    const scoreLabel = getDNAScoreLabel(activeScore);

    const vehicleTrimData = trimDNAData.find(t => t.vehicleId === vehicle.id);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Overview Section */}
            <div id="genel-bakis" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
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
                        {activeScore}<span style={{ fontSize: '32px', opacity: 0.6 }}>/100</span>
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
                            width: `${activeScore}%`,
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
                    {vehicle.brand} {vehicle.model} <strong>{specificEngine.name}</strong> motor seçeneği, {activeScore >= 80 ? "sınıfının en güçlü ve sorunsuz seçeneklerinden biridir." : activeScore >= 60 ? "fiyat/performans açısından değerlendirilebilir ancak kronik sorunlara dikkat edilmesi gereken bir motor/vites kombinasyonudur." : "almadan önce kronik sorunlarının dikkatlice araştırılması gereken bir kombinasyondur."}
                </p>
            </div>

            {/* Pros and Cons */}
            <div id="artilar" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '700', color: '#10b981', marginBottom: '20px' }}>
                        <TrendingUp size={24} /> En Beğenilen Yönleri
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {vehicle.strengths.map((strength, index) => (
                            <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginTop: '6px', flexShrink: 0 }} />
                                <span style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5' }}>{strength}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '700', color: '#ef4444', marginBottom: '20px' }}>
                        <TrendingDown size={24} /> En Çok Şikayet Edilenler
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {vehicle.weaknesses.map((weakness, index) => (
                            <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', marginTop: '6px', flexShrink: 0 }} />
                                <span style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5' }}>{weakness}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chronic Issues */}
            <div id="kronik" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                    <Wrench size={24} />
                    Kronik Sorunlar (Mekanik & Donanımsal)
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                    Bu araca (ve özellikle seçilen {specificEngine.name} motor/şanzıman kombinasyonuna) ait bildirilen yaygın arızalar.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Combine general vehicle issues and engine specific issues */}
                    {(() => {
                        const allIssues = [
                            ...vehicle.chronicIssues,
                            ...specificEngine.issues.map(issueText => ({
                                id: Math.random(),
                                title: "Motora Özel Durum",
                                description: issueText,
                                severity: "medium" as const,
                                reportCount: 0
                            }))
                        ];
                        return allIssues.map((issue, idx) => (
                            <div key={idx} style={{
                                display: 'flex', gap: '16px', padding: '20px',
                                background: 'var(--secondary)', borderRadius: '12px',
                                borderLeft: `4px solid ${issue.severity === 'high' ? '#ef4444' : issue.severity === 'medium' ? '#f59e0b' : '#eab308'}`
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                                    background: issue.severity === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <AlertCircle size={20} color={issue.severity === 'high' ? '#ef4444' : '#f59e0b'} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px' }}>
                                        {issue.title}
                                    </h3>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '12px' }}>
                                        {issue.description}
                                    </p>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 10px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                                            {issue.reportCount} Kullanıcı Raporu
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ));
                    })()}
                </div>
            </div>

            {/* Trim Packages */}
            <div id="donanim">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '20px' }}>
                    <Package size={24} />
                    Donanım Paketleri Kıyaslaması
                </h2>
                {vehicleTrimData ? (
                    <TrimComparisonTable trimData={vehicleTrimData} />
                ) : (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--card-bg)', borderRadius: '12px' }}>
                        Bu araç için henüz donanım paketi kıyaslama verisi girilmemiştir.
                    </div>
                )}
            </div>

            {/* User Reviews */}
            <div id="deneyimler" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                    <MessageCircle size={24} />
                    Kullanıcı Deneyimleri
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                    {vehicle.userExperiences.map((exp, idx) => (
                        <div key={idx} style={{ padding: '20px', background: 'var(--secondary)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {exp.author.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--foreground)', fontSize: '15px' }}>{exp.author}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={12} /> {exp.date} • {exp.authorLevel}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(234, 179, 8, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                                    <Star size={14} color="#eab308" fill="#eab308" />
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#eab308' }}>{exp.rating}/5</span>
                                </div>
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.6', marginBottom: 0 }}>
                                "{exp.text}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
