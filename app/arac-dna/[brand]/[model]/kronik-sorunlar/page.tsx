"use client";

import { useParams, useRouter } from "next/navigation";
import { vehicleDNAData, getSeverityColor, getSeverityLabel } from "@/data/vehicle-dna";
import { Wrench, AlertCircle, AlertTriangle, Plus, X } from "lucide-react";
import Script from "next/script";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getVehicleChronicIssues, addVehicleChronicIssue, toggleVehicleChronicVote, getVehicleStaticVotes, toggleVehicleStaticVote, type DNAChronicIssue } from "@/lib/dnaService";

export default function ChronicIssuesPage() {
    const params = useParams();

    const brandSlug = (params?.brand as string)?.toLowerCase() || "";
    const modelSlug = (params?.model as string)?.toLowerCase() || "";
    const { user } = useAuth();

    const [dynamicIssues, setDynamicIssues] = useState<DNAChronicIssue[]>([]);
    const [staticVotes, setStaticVotes] = useState<Record<string, string[]>>({});
    const [isReportingChronic, setIsReportingChronic] = useState(false);
    const [chronicText, setChronicText] = useState("");
    const [chronicSubmitting, setChronicSubmitting] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const router = useRouter();

    const vehicle = vehicleDNAData.find(v => {
        const vBrandSlug = v.brand.toLowerCase().replace(/\s+/g, '-');
        const vModelSlug = v.model.toLowerCase().replace(/\s+/g, '-');
        return vBrandSlug === brandSlug && vModelSlug === modelSlug;
    });

    useEffect(() => {
        if (!brandSlug || !modelSlug) return;
        getVehicleChronicIssues(brandSlug, modelSlug).then(issues => {
            setDynamicIssues(issues);
        });
        getVehicleStaticVotes(brandSlug, modelSlug).then(votes => {
            setStaticVotes(votes);
        });
    }, [brandSlug, modelSlug]);

    const handleChronicSubmit = async () => {
        if (!chronicText.trim() || !user || chronicSubmitting) return;
        setChronicSubmitting(true);
        try {
            const newIssue = await addVehicleChronicIssue(brandSlug, modelSlug, {
                text: chronicText.trim(),
                authorId: user.id as string,
                username: user.username,
            });
            if (newIssue) {
                setDynamicIssues(prev => [...prev, newIssue]);
            }
            setChronicText("");
            setIsReportingChronic(false);
        } catch (e) {
            console.error("Kronik sorun eklenemedi:", e);
        }
        setChronicSubmitting(false);
    };

    const handleChronicVote = async (issueId: string) => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
        try {
            setDynamicIssues(prev => prev.map(iss => {
                if (iss.id !== issueId) return iss;
                const hasVoted = iss.votedBy.includes(user.id as string);
                return {
                    ...iss,
                    votes: hasVoted ? iss.votes - 1 : iss.votes + 1,
                    votedBy: hasVoted ? iss.votedBy.filter(id => id !== user.id) : [...iss.votedBy, user.id as string]
                };
            }));
            await toggleVehicleChronicVote(brandSlug, modelSlug, issueId, user.id as string);
        } catch (e) {
            console.error("Kronik sorun oy hatasi:", e);
            // Re-fetch on error
            getVehicleChronicIssues(brandSlug, modelSlug).then(setDynamicIssues);
        }
    };

    const handleStaticVote = async (issueId: number) => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
        const idStr = issueId.toString();
        try {
            setStaticVotes(prev => {
                const voters = prev[idStr] || [];
                const hasVoted = voters.includes(user.id as string);
                const newVoters = hasVoted ? voters.filter(id => id !== user.id) : [...voters, user.id as string];
                return { ...prev, [idStr]: newVoters };
            });
            await toggleVehicleStaticVote(brandSlug, modelSlug, idStr, user.id as string);
        } catch (e) {
            console.error("Statik kronik sorun oy hatasi:", e);
            getVehicleStaticVotes(brandSlug, modelSlug).then(setStaticVotes);
        }
    };

    if (!vehicle) return null;

    // Generate FAQ Schema for SEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": vehicle.chronicIssues.map(issue => ({
            "@type": "Question",
            "name": `${vehicle.brand} ${vehicle.model} modelinde ${issue.title} sorunu var mı?`,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": `${issue.description} Bu sorun Otosöz veritabanında ${issue.reportCount} kullanıcı tarafından raporlanmış olup, ${getSeverityLabel(issue.severity).toLowerCase()} düzeyde bir sorundur.`
            }
        }))
    };

    return (
        <div>
            {/* Inject FAQ Schema for Google Rich Snippets */}
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Wrench size={28} color="var(--primary)" />
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>
                            {vehicle.brand} {vehicle.model} Kronik Sorunları
                        </h2>
                    </div>
                    <button 
                        onClick={() => {
                            if (!user) {
                                setShowLoginPrompt(true);
                                return;
                            }
                            setIsReportingChronic(true);
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
                        <Plus size={16} /> Kullanıcı Sorunu Bildir
                    </button>
                </div>
                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
                    Bu sayfada, Otosöz uzmanları ve servis verileri tarafından toplanan sabit sorunlar ile kullanıcıların bizzat bildirdiği yaygın kronik hastalıklar ve arızalar listelenmektedir.
                </p>

                {vehicle.chronicIssues.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {vehicle.chronicIssues.map((issue) => {
                            const severityColor = getSeverityColor(issue.severity);
                            const severityLabel = getSeverityLabel(issue.severity);
                            const hasVoted = user && (staticVotes[issue.id.toString()] || []).includes(user.id as string);

                            return (
                                <div key={issue.id} style={{
                                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderLeft: `4px solid ${severityColor}`,
                                    borderRadius: '12px',
                                    padding: '24px',
                                    flexWrap: 'wrap'
                                }}>
                                    <div style={{ flex: 1, minWidth: '250px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
                                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                                                {issue.title}
                                            </h3>
                                            <span style={{
                                                padding: '6px 16px',
                                                background: `${severityColor}15`,
                                                color: severityColor,
                                                fontSize: '13px',
                                                borderRadius: '8px',
                                                fontWeight: '700',
                                                whiteSpace: 'nowrap',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <AlertCircle size={16} />
                                                {severityLabel} Risk
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
                                            {issue.description}
                                        </p>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--foreground)', background: 'var(--card-bg)', padding: '12px 16px', borderRadius: '8px' }}>
                                            <span style={{ fontSize: '18px' }}>📊</span>
                                            <span>Bugüne kadar</span>
                                            <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>{issue.reportCount + (staticVotes[issue.id.toString()]?.length || 0)}</strong>
                                            <span>kullanıcı bu sorunu raporladı.</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleStaticVote(issue.id)}
                                        disabled={false}
                                        style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                                            padding: '10px 16px', borderRadius: '8px', flexShrink: 0,
                                            background: hasVoted ? severityColor : `${severityColor}15`,
                                            border: `1px solid ${hasVoted ? severityColor : `${severityColor}30`}`,
                                            color: hasVoted ? 'white' : severityColor,
                                            cursor: 'pointer', transition: 'all 0.2s',
                                        }}
                                    >
                                        <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                                            {hasVoted ? 'Yaşadınız' : 'Ben de Yaşadım'}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : null}

                {/* Dinamik Kullanıcı Sorunları */}
                {dynamicIssues.length > 0 && (
                    <div style={{ marginTop: '40px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangle size={20} color="#ef4444" /> Kullanıcı Bildirimleri
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[...dynamicIssues].sort((a, b) => b.votes - a.votes).map((issue) => {
                                const hasVoted = user && issue.votedBy.includes(user.id as string);
                                return (
                                    <div key={issue.id} style={{
                                        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px',
                                        background: 'var(--card-bg)', border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderLeft: '4px solid #ef4444', borderRadius: '12px', padding: '20px',
                                        flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: 1, minWidth: '250px' }}>
                                            <p style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.6', margin: 0, marginBottom: '12px' }}>
                                                {issue.text}
                                            </p>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bildiren: @{issue.author}</span>
                                        </div>
                                        <button
                                            onClick={() => handleChronicVote(issue.id)}
                                            disabled={false}
                                            style={{
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                                                padding: '10px 16px', borderRadius: '8px', flexShrink: 0,
                                                background: hasVoted ? '#ef4444' : 'rgba(239, 68, 68, 0.05)',
                                                border: `1px solid ${hasVoted ? '#ef4444' : 'rgba(239, 68, 68, 0.2)'}`,
                                                color: hasVoted ? 'white' : '#ef4444',
                                                cursor: 'pointer', transition: 'all 0.2s',
                                            }}
                                        >
                                            <span style={{ fontSize: '20px', fontWeight: '800' }}>{issue.votes}</span>
                                            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                                                {hasVoted ? 'Yaşadınız' : 'Ben de Yaşadım'}
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {vehicle.chronicIssues.length === 0 && dynamicIssues.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', background: 'var(--secondary)', borderRadius: '12px', border: '1px dashed var(--card-border)' }}>
                        <span style={{ fontSize: '40px', marginBottom: '16px', display: 'block' }}>✅</span>
                        <h3 style={{ fontSize: '18px', color: 'var(--foreground)', marginBottom: '8px' }}>Bilinen Kronik Sorun Yok</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Bu araç için henüz kaydedilmiş yaygın bir kronik arıza verisi bulunmamaktadır.</p>
                    </div>
                )}
            </div>

            {/* Kronik Sorun Bildir Modali */}
            {isReportingChronic && (
                <>
                    <div onClick={() => setIsReportingChronic(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 999 }} />
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        padding: '32px', borderRadius: '24px', zIndex: 1000,
                        width: '90%', maxWidth: '440px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertTriangle size={20} color="#ef4444" /> Sorun Bildir
                            </h3>
                            <button onClick={() => setIsReportingChronic(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                            Lütfen <strong>{vehicle.brand} {vehicle.model}</strong> aracında yaşadığınız yaygın teknik sorunu kısaca açıklayın.
                        </p>
                        <textarea
                            value={chronicText}
                            onChange={(e) => setChronicText(e.target.value)}
                            placeholder="Örn: Motor ısındığında şanzıman vuruntu yapıyor..."
                            style={{
                                width: '100%', height: '100px', padding: '16px',
                                background: 'var(--background)', border: '1px solid var(--card-border)',
                                borderRadius: '12px', color: 'var(--foreground)',
                                fontSize: '14px', resize: 'none', marginBottom: '16px',
                                outline: 'none'
                            }}
                            maxLength={200}
                        />
                        <button
                            onClick={handleChronicSubmit}
                            disabled={chronicSubmitting || !chronicText.trim()}
                            style={{
                                width: '100%', padding: '14px',
                                background: '#ef4444', color: 'white',
                                border: 'none', borderRadius: '12px',
                                fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                                opacity: (chronicSubmitting || !chronicText.trim()) ? 0.7 : 1,
                                transition: 'opacity 0.2s'
                            }}
                        >
                            {chronicSubmitting ? 'Bildiriliyor...' : 'Sorunu Bildir'}
                        </button>
                    </div>
                </>
            )}

            {/* Giriş Yap Uyarı Modali */}
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
                            Oy verebilmek veya sorun bildirmek için üye girişi yapmanız gerekmektedir.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => router.push('/giris')}
                                style={{
                                    flex: 1, padding: '14px',
                                    background: 'var(--primary)', color: 'white',
                                    border: 'none', borderRadius: '12px',
                                    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                                    transition: 'opacity 0.2s'
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
                                    transition: 'opacity 0.2s'
                                }}
                            >
                                Kayıt Ol
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
