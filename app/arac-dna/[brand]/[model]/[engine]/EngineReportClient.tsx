"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plus, X, AlertCircle, CheckCircle, Wrench } from 'lucide-react';
export default function EngineReportClient({brandSlug,modelSlug,brandName,modelName,engineName}:{brandSlug:string;modelSlug:string;brandName:string;modelName:string;engineName:string}) {
    const {user}=useAuth(); const router=useRouter();
    const [showReportModal, setShowReportModal] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [reportTitle, setReportTitle] = useState("");
    const [reportDesc, setReportDesc] = useState("");
    const [reportSeverity, setReportSeverity] = useState<'low' | 'medium' | 'high'>('medium');
    const [reportSubmitting, setReportSubmitting] = useState(false);

    const handleReportSubmit = async () => {
        if (!reportTitle.trim() || !reportDesc.trim() || !user || reportSubmitting) return;
        setReportSubmitting(true);
        try {
            const {submitDNAChronicReport}=await import('@/lib/dnaService');
            const success = await submitDNAChronicReport({
                brandSlug,
                modelSlug,
                brandName: brandName,
                modelName: modelName,
                engineName: engineName,
                issueTitle: reportTitle.trim(),
                issueDescription: reportDesc.trim(),
                severity: reportSeverity,
                username: user.username,
                userId: user.id as string,
            });
            if (success) {
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

    return <>                        <button
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
                        </button>            {/* Kronik Sorun Bildir Modal */}
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
                                <strong style={{ color: 'var(--foreground)' }}>{brandName} {modelName}</strong> • {engineName}
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
</>;
}
