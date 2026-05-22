"use client";

import { useEffect, useState } from "react";
import { getPendingSubmissions, updateSubmissionStatus, EventSubmission } from "@/lib/eventSubmissionService";
import { Check, X, MapPin, Calendar, DollarSign, Clock, Building2, HelpCircle } from "lucide-react";

export default function AdminOtopazarlarPage() {
    const [submissions, setSubmissions] = useState<EventSubmission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        setLoading(true);
        try {
            const data = await getPendingSubmissions();
            setSubmissions(data);
        } catch (error) {
            console.error("Error loading submissions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await updateSubmissionStatus(id, status);
            // Remove from list
            setSubmissions(prev => prev.filter(s => s.id !== id));
            // Optional: If approved, we could also inject it into events.ts here or call an API, 
            // but the plan says "İlk aşamada başvuruyu toplayıp admin panelinde inceleme imkanı veriyoruz."
        } catch (error) {
            console.error("Error updating submission:", error);
            alert("İşlem sırasında bir hata oluştu.");
        }
    };

    if (loading) {
        return <div style={{ padding: '24px', color: 'var(--text-muted)' }}>Yükleniyor...</div>;
    }

    return (
        <div style={{ padding: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '24px' }}>
                Oto Pazarı & Etkinlik Başvuruları
            </h1>

            {submissions.length === 0 ? (
                <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '16px',
                    color: 'var(--text-muted)'
                }}>
                    Bekleyen başvuru bulunmuyor.
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {submissions.map(sub => (
                        <div key={sub.id} style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '16px',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            background: sub.type === 'NEW_EVENT' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: sub.type === 'NEW_EVENT' ? '#3B82F6' : '#F59E0B',
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            borderRadius: '6px'
                                        }}>
                                            {sub.type === 'NEW_EVENT' ? 'YENİ PAZAR EKLENTİSİ' : 'BİLGİ GÜNCELLEMESİ'}
                                        </span>
                                        <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
                                            {sub.submittedAt?.toDate().toLocaleString('tr-TR')}
                                        </span>
                                    </div>
                                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)' }}>
                                        {sub.type === 'NEW_EVENT' ? sub.eventName : sub.eventTitle}
                                    </h2>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleAction(sub.id!, 'REJECTED')}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <X size={16} /> Reddet
                                    </button>
                                    <button
                                        onClick={() => handleAction(sub.id!, 'APPROVED')}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            color: '#10b981',
                                            border: '1px solid rgba(16, 185, 129, 0.2)',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <Check size={16} /> Onayla
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div style={{ background: 'var(--secondary)', borderRadius: '12px', padding: '16px' }}>
                                {sub.type === 'NEW_EVENT' ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                        <InfoItem icon={<MapPin size={16} />} label="İl / İlçe" value={`${sub.city} / ${sub.district}`} />
                                        <InfoItem icon={<MapPin size={16} />} label="Açık Adres" value={sub.address || '-'} />
                                        <InfoItem 
                                            icon={<Calendar size={16} />} 
                                            label={sub.isOneTimeEvent ? "Etkinlik Tarihi" : "Açık Günler"} 
                                            value={sub.isOneTimeEvent ? (sub.eventDate || '-') : (sub.daysOpen || '-')} 
                                        />
                                        <InfoItem icon={<DollarSign size={16} />} label="Ücret" value={sub.price || '-'} />
                                        <InfoItem icon={<Building2 size={16} />} label="Organizatör" value={sub.organizer || '-'} />
                                    </div>
                                ) : (
                                    <div>
                                        <h3 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Kullanıcı Mesajı:</h3>
                                        <p style={{ fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.6', margin: 0, padding: '12px', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                                            {sub.updateMessage}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{icon}</div>
            <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: '600' }}>{label}</div>
                <div style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: '500' }}>{value}</div>
            </div>
        </div>
    );
}
