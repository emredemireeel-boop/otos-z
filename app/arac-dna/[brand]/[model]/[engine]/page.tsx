"use client";

import { useParams, useRouter } from "next/navigation";
import { vehicleDNAData, getDNAScoreColor, getDNAScoreLabel, createSlug } from "@/data/vehicle-dna";
import { engineDNAData } from "@/data/engine-dna";
import { trimLevelsData } from "@/data/trim-levels";
import TrimLevelsTable from "@/components/TrimLevelsTable";
import { Shield, Star, Info, MessageCircle, AlertCircle, TrendingUp, TrendingDown, Clock, ThumbsUp, Wrench, FileText, Package, Plus, X, CheckCircle, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { submitDNAChronicReport } from "@/lib/dnaService";

const suffixes = {
    'artilar': '-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri',
    'kronik': '-kronik-sorunlari',
    'donanim': '-arac-paketleri',
    'deneyimler': '-kullanici-deneyimleri'
};

export default function EngineDetailedPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const brandSlug = (params?.brand as string)?.toLowerCase() || "";
    const modelSlug = (params?.model as string)?.toLowerCase() || "";
    const engineParam = (params?.engine as string)?.toLowerCase() || "";

    let baseEngineSlug = engineParam;
    let currentTab = "genel-bakis";

    for (const [tab, suffix] of Object.entries(suffixes)) {
        if (engineParam.endsWith(suffix)) {
            baseEngineSlug = engineParam.replace(suffix, "");
            currentTab = tab;
            break;
        }
    }

    const [showReportModal, setShowReportModal] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [reportTitle, setReportTitle] = useState("");
    const [reportDesc, setReportDesc] = useState("");
    const [reportSeverity, setReportSeverity] = useState<'low' | 'medium' | 'high'>('medium');
    const [reportSubmitting, setReportSubmitting] = useState(false);

    // Interactive State
    const [issues, setIssues] = useState<any[]>([]);
    const [experiences, setExperiences] = useState<any[]>([]);
    const [newReviewText, setNewReviewText] = useState("");
    const [newReviewRating, setNewReviewRating] = useState(5);

    const vehicle = vehicleDNAData.find(v => {
        const vBrandSlug = createSlug(v.brand);
        const vModelSlug = createSlug(v.model);
        return vBrandSlug === brandSlug && vModelSlug === modelSlug;
    });

    const specificEngine = vehicle ? engineDNAData.find(e => e.vehicleId === vehicle.id)?.engines.find(e => e.slug === baseEngineSlug) : null;

    useEffect(() => {
        if (vehicle && specificEngine && issues.length === 0) {
            const allIssues = [
                ...vehicle.chronicIssues.map(i => ({...i, id: Math.random()})),
                ...specificEngine.chronicIssues.map(issue => ({
                    id: Math.random(),
                    title: issue.title,
                    description: issue.description,
                    severity: issue.severity,
                    reportCount: issue.reportCount
                }))
            ];
            setIssues(allIssues.sort((a, b) => b.reportCount - a.reportCount));
        }

        if (vehicle && experiences.length === 0) {
            const exps = vehicle.userExperiences.map((e, index) => ({
                ...e,
                id: Math.random(),
                upvotes: (e as any).upvotes || Math.floor(Math.random() * 50) + 5 // Mock initial upvotes
            }));
            setExperiences(exps.sort((a, b) => b.upvotes - a.upvotes));
        }
    }, [vehicle, specificEngine]); // eslint-disable-line

    if (!vehicle || !specificEngine) return null;

    const activeScore = specificEngine.score;
    const scoreColor = getDNAScoreColor(activeScore);
    const scoreLabel = getDNAScoreLabel(activeScore);
    const vehicleTrimData = trimLevelsData.find(t => t.vehicleId === vehicle.id);

    const handleReportSubmit = async () => {
        if (!reportTitle.trim() || !reportDesc.trim() || !user || reportSubmitting) return;
        setReportSubmitting(true);
        try {
            const success = await submitDNAChronicReport({
                brandSlug,
                modelSlug,
                brandName: vehicle.brand,
                modelName: vehicle.model,
                engineName: specificEngine.name,
                issueTitle: reportTitle.trim(),
                issueDescription: reportDesc.trim(),
                severity: reportSeverity,
                username: user.username,
                userId: user.id as string,
            });
            if (success) {
                // Optimistically add to list
                const newIssue = {
                    id: Math.random(),
                    title: reportTitle.trim(),
                    description: reportDesc.trim(),
                    severity: reportSeverity,
                    reportCount: 1
                };
                setIssues(prev => [newIssue, ...prev].sort((a, b) => b.reportCount - a.reportCount));
                
                setReportTitle("");
                setReportDesc("");
                setReportSeverity('medium');
                setShowReportModal(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 4000);
            }
        } catch (e) {
            console.error("Kronik sorun bildirimi gönderilemedi:", e);
        }
        setReportSubmitting(false);
    };

    const handleMeToo = (id: number) => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
        setIssues(prev => {
            const next = prev.map(issue => 
                issue.id === id ? { ...issue, reportCount: issue.reportCount + 1 } : issue
            );
            return next.sort((a, b) => b.reportCount - a.reportCount);
        });
    };

    const handleUpvote = (id: number) => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
        setExperiences(prev => {
            const next = prev.map(exp => 
                exp.id === id ? { ...exp, upvotes: exp.upvotes + 1 } : exp
            );
            return next.sort((a, b) => b.upvotes - a.upvotes);
        });
    };

    const handleSubmitReview = () => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
        if (!newReviewText.trim()) return;

        const newExp = {
            id: Math.random(),
            author: user.username,
            authorLevel: "Yeni Üye",
            date: new Date().toLocaleDateString('tr-TR'),
            rating: newReviewRating,
            text: newReviewText,
            upvotes: 0
        };

        setExperiences(prev => {
            const next = [newExp, ...prev];
            return next.sort((a, b) => b.upvotes - a.upvotes);
        });
        setNewReviewText("");
        setNewReviewRating(5);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Overview Section */}
            {currentTab === 'genel-bakis' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
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
                </div>
            )}

            {/* Pros and Cons */}
            {currentTab === 'artilar' && (
                <div id="artilar" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '700', color: '#10b981', marginBottom: '20px' }}>
                            <TrendingUp size={24} /> En Beğenilen Yönleri
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {specificEngine.pros ? specificEngine.pros.map((strength, index) => (
                                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginTop: '6px', flexShrink: 0 }} />
                                    <span style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5' }}>{strength}</span>
                                </div>
                            )) : vehicle.strengths.map((strength, index) => (
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
                            {specificEngine.cons ? specificEngine.cons.map((weakness, index) => (
                                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', marginTop: '6px', flexShrink: 0 }} />
                                    <span style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5' }}>{weakness}</span>
                                </div>
                            )) : vehicle.weaknesses.map((weakness, index) => (
                                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', marginTop: '6px', flexShrink: 0 }} />
                                    <span style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5' }}>{weakness}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Chronic Issues */}
            {currentTab === 'kronik' && (
                <div id="kronik" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                            <Wrench size={24} />
                            Kronik Sorunlar (Mekanik & Donanımsal)
                        </h2>
                        <button
                            onClick={() => {
                                if (!user) {
                                    setShowLoginPrompt(true);
                                    return;
                                }
                                setShowReportModal(true);
                            }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '10px 16px', borderRadius: '8px',
                                background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Plus size={16} /> Kronik Sorun Bildir
                        </button>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Bu araca (ve özellikle seçilen {specificEngine.name} motor/şanzıman kombinasyonuna) ait bildirilen yaygın arızalar en çok karşılaşılana göre sıralanmıştır.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {issues.slice(0, 15).map((issue) => (
                            <div key={issue.id} style={{
                                display: 'flex', gap: '16px', padding: '20px',
                                background: 'var(--secondary)', borderRadius: '12px',
                                borderLeft: `4px solid ${issue.severity === 'high' ? '#ef4444' : issue.severity === 'medium' ? '#f59e0b' : '#eab308'}`,
                                transition: 'transform 0.3s ease'
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
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 10px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                                            {issue.reportCount} Kullanıcı Raporu
                                        </span>
                                        <button 
                                            onClick={() => handleMeToo(issue.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                padding: '6px 12px', borderRadius: '8px',
                                                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                                color: 'var(--foreground)', fontSize: '13px', fontWeight: '600',
                                                cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                                        >
                                            <TrendingUp size={14} /> Ben de yaşadım (+1)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Trim Packages */}
            {currentTab === 'donanim' && (
                <div id="donanim">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '20px' }}>
                        <Package size={24} />
                        Donanım Paketleri Kıyaslaması
                    </h2>
                    {vehicleTrimData ? (
                        <TrimLevelsTable data={vehicleTrimData} />
                    ) : (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--card-bg)', borderRadius: '12px' }}>
                            Bu araç için henüz donanım paketi kıyaslama verisi girilmemiştir.
                        </div>
                    )}
                </div>
            )}

            {/* User Reviews */}
            {currentTab === 'deneyimler' && (
                <div id="deneyimler" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                        <MessageCircle size={24} />
                        Kullanıcı Deneyimleri
                    </h2>
                    
                    {/* Otosöz Yıldız Puanı */}
                    {experiences.length > 0 && (
                        (() => {
                            const avgRating = experiences.reduce((acc, curr) => acc + curr.rating, 0) / experiences.length;
                            const displayRating = avgRating.toFixed(1);
                            
                            return (
                                <div style={{ 
                                    display: 'flex', alignItems: 'center', gap: '16px', 
                                    padding: '16px', background: 'rgba(234, 179, 8, 0.1)', 
                                    border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: '12px',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>
                                        Otosöz Yıldız Puanı
                                    </div>
                                    <div 
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative', cursor: 'help' }}
                                        title={`Ortalama Puan: ${displayRating} / 5.0`}
                                    >
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const fillPercentage = Math.max(0, Math.min(100, (avgRating - star + 1) * 100));
                                            return (
                                                <div key={star} style={{ position: 'relative', display: 'inline-block', width: '20px', height: '20px' }}>
                                                    <Star size={20} color="var(--text-muted)" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.3 }} />
                                                    <div style={{ 
                                                        position: 'absolute', top: 0, left: 0, 
                                                        width: `${fillPercentage}%`, overflow: 'hidden',
                                                        display: 'flex'
                                                    }}>
                                                        <Star size={20} color="#EAB308" fill="#EAB308" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <span style={{ fontSize: '18px', fontWeight: '800', color: '#EAB308', marginLeft: '8px' }}>
                                            {displayRating}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                        ({experiences.length} Değerlendirme)
                                    </div>
                                </div>
                            );
                        })()
                    )}
                    
                    {/* Add Review Form */}
                    <div style={{ background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px', marginTop: '16px', marginBottom: '32px' }}>
                        {user ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: 'var(--foreground)' }}>Deneyiminizi Paylaşın</h3>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Puanınız:</span>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={20}
                                            fill={star <= newReviewRating ? "#EAB308" : "none"}
                                            color={star <= newReviewRating ? "#EAB308" : "var(--text-muted)"}
                                            style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                                            onClick={() => setNewReviewRating(star)}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    ))}
                                </div>
                                <textarea
                                    value={newReviewText}
                                    onChange={(e) => setNewReviewText(e.target.value)}
                                    placeholder={`${vehicle.brand} ${vehicle.model} ile deneyiminiz nasıldı? Nelere dikkat edilmeli?`}
                                    style={{
                                        width: '100%', height: '80px', padding: '12px 16px',
                                        background: 'var(--background)', border: '1px solid var(--card-border)',
                                        borderRadius: '10px', color: 'var(--foreground)',
                                        fontSize: '14px', resize: 'none', outline: 'none', boxSizing: 'border-box'
                                    }}
                                />
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={!newReviewText.trim()}
                                    style={{
                                        alignSelf: 'flex-end', padding: '10px 24px',
                                        background: 'var(--primary)', color: 'white',
                                        border: 'none', borderRadius: '8px',
                                        fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                                        opacity: !newReviewText.trim() ? 0.6 : 1
                                    }}
                                >
                                    Gönder
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '10px' }}>
                                <AlertCircle size={28} color="var(--primary)" />
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', margin: '0 0 4px 0' }}>Giriş Yaparak Deneyiminizi Paylaşın</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Diğer kullanıcılara yardımcı olmak için kendi tecrübelerinizi aktarabilirsiniz.</p>
                                </div>
                                <button onClick={() => setShowLoginPrompt(true)} style={{ padding: '8px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '4px' }}>
                                    Giriş Yap
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {experiences.map((exp) => (
                            <div key={exp.id} style={{ display: 'flex', gap: '16px', padding: '20px', background: 'var(--secondary)', borderRadius: '12px', border: '1px solid var(--card-border)', transition: 'transform 0.3s ease' }}>
                                {/* Upvote Column */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <button 
                                        onClick={() => handleUpvote(exp.id)}
                                        style={{ 
                                            background: 'transparent', border: 'none', cursor: 'pointer',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                    >
                                        <ArrowUp size={24} />
                                    </button>
                                    <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>{exp.upvotes}</span>
                                </div>

                                {/* Content Column */}
                                <div style={{ flex: 1 }}>
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
                                        &quot;{exp.text}&quot;
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Kronik Sorun Bildir Modal */}
            {showReportModal && (
                <>
                    <div onClick={() => setShowReportModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 999 }} />
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        padding: '32px', borderRadius: '24px', zIndex: 1000,
                        width: '90%', maxWidth: '500px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                <Wrench size={20} color="#ef4444" /> Kronik Sorun Bildir
                            </h3>
                            <button onClick={() => setShowReportModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '12px 16px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '10px', marginBottom: '20px' }}>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                                <strong style={{ color: 'var(--foreground)' }}>{vehicle.brand} {vehicle.model}</strong> • {specificEngine.name}
                                <br />
                                Bildirdiğiniz sorun admin onayından geçtikten sonra kronik sorunlar listesine eklenecektir.
                            </p>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '6px' }}>
                                Sorun Başlığı *
                            </label>
                            <input
                                type="text"
                                value={reportTitle}
                                onChange={(e) => setReportTitle(e.target.value)}
                                placeholder="Örn: Turbo Valfi Arızası"
                                maxLength={80}
                                style={{
                                    width: '100%', padding: '12px 16px',
                                    background: 'var(--background)', border: '1px solid var(--card-border)',
                                    borderRadius: '10px', color: 'var(--foreground)',
                                    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '6px' }}>
                                Sorun Açıklaması *
                            </label>
                            <textarea
                                value={reportDesc}
                                onChange={(e) => setReportDesc(e.target.value)}
                                placeholder="Sorunu detaylı bir şekilde açıklayın..."
                                maxLength={300}
                                style={{
                                    width: '100%', height: '100px', padding: '12px 16px',
                                    background: 'var(--background)', border: '1px solid var(--card-border)',
                                    borderRadius: '10px', color: 'var(--foreground)',
                                    fontSize: '14px', resize: 'none', outline: 'none', boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                Ciddiyet Seviyesi
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {([
                                    { key: 'low' as const, label: 'Düşük', color: '#3B82F6' },
                                    { key: 'medium' as const, label: 'Orta', color: '#F59E0B' },
                                    { key: 'high' as const, label: 'Yüksek', color: '#EF4444' },
                                ]).map(sev => (
                                    <button
                                        key={sev.key}
                                        onClick={() => setReportSeverity(sev.key)}
                                        style={{
                                            flex: 1, padding: '10px', borderRadius: '8px',
                                            background: reportSeverity === sev.key ? sev.color : `${sev.color}15`,
                                            color: reportSeverity === sev.key ? 'white' : sev.color,
                                            border: `1px solid ${reportSeverity === sev.key ? sev.color : `${sev.color}30`}`,
                                            fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {sev.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleReportSubmit}
                            disabled={reportSubmitting || !reportTitle.trim() || !reportDesc.trim()}
                            style={{
                                width: '100%', padding: '14px',
                                background: '#ef4444', color: 'white',
                                border: 'none', borderRadius: '12px',
                                fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                                opacity: (reportSubmitting || !reportTitle.trim() || !reportDesc.trim()) ? 0.7 : 1,
                                transition: 'opacity 0.2s'
                            }}
                        >
                            {reportSubmitting ? 'Gönderiliyor...' : 'Sorunu Bildir'}
                        </button>
                    </div>
                </>
            )}

            {/* Giriş Yap Uyarı Modal */}
            {showLoginPrompt && (
                <>
                    <div onClick={() => setShowLoginPrompt(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 999 }} />
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        padding: '32px', borderRadius: '24px', zIndex: 1000,
                        width: '90%', maxWidth: '400px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                        }}>
                            <AlertCircle size={32} color="#ef4444" />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
                            Giriş Yapmanız Gerekiyor
                        </h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                            Bu işlemi gerçekleştirebilmek için üye girişi yapmanız gerekmektedir.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => router.push('/giris')}
                                style={{
                                    flex: 1, padding: '14px',
                                    background: 'var(--primary)', color: 'white',
                                    border: 'none', borderRadius: '12px',
                                    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                                }}
                            >
                                Giriş Yap
                            </button>
                            <button
                                onClick={() => router.push('/kayit')}
                                style={{
                                    flex: 1, padding: '14px',
                                    background: 'var(--secondary)', color: 'var(--foreground)',
                                    border: '1px solid var(--card-border)', borderRadius: '12px',
                                    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                                }}
                            >
                                Kayıt Ol
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Başarı Toast */}
            {showSuccess && (
                <div style={{
                    position: 'fixed', bottom: '32px', right: '32px',
                    background: '#10B981', color: 'white',
                    padding: '16px 24px', borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                    fontWeight: '600', fontSize: '14px', zIndex: 9999,
                    display: 'flex', alignItems: 'center', gap: '8px',
                    animation: 'slideUp 0.3s ease'
                }}>
                    <CheckCircle size={18} />
                    Bildiriminiz başarıyla alındı!
                </div>
            )}

            <style>{`
                @keyframes slideUp { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
