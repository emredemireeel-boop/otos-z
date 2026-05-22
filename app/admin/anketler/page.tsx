"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckCircle, XCircle, Trash2, Clock, CheckSquare } from "lucide-react";

interface Nominee {
    id: number;
    name: string;
    votes: number;
}

interface Survey {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    totalVotes: number;
    nominees: Nominee[];
    createdBy?: string;
    createdAt?: any;
}

export default function AdminAnketlerPage() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const loadSurveys = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(query(collection(db, "surveys"), orderBy("createdAt", "desc")));
            const items = snap.docs.map(d => ({
                id: d.id,
                ...d.data(),
            })) as Survey[];
            setSurveys(items);
        } catch (error) {
            console.error("Anketler yuklenemedi:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadSurveys();
    }, []);

    const handleApprove = async (id: string) => {
        if (!confirm("Bu anketi yayınlamak istediğinize emin misiniz?")) return;
        setActionLoading(id);
        try {
            await updateDoc(doc(db, "surveys", id), { status: "active" });
            setSurveys(prev => prev.map(s => s.id === id ? { ...s, status: "active" } : s));
        } catch (e) {
            console.error("Hata:", e);
            alert("Onaylanırken bir hata oluştu.");
        }
        setActionLoading(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu anketi tamamen silmek istediğinize emin misiniz?")) return;
        setActionLoading(id);
        try {
            await deleteDoc(doc(db, "surveys", id));
            setSurveys(prev => prev.filter(s => s.id !== id));
        } catch (e) {
            console.error("Hata:", e);
            alert("Silinirken bir hata oluştu.");
        }
        setActionLoading(null);
    };

    const pendingSurveys = surveys.filter(s => s.status === "pending");
    const activeSurveys = surveys.filter(s => s.status === "active");

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CheckSquare size={32} color="var(--primary)" /> Anket Onayları
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '8px' }}>Kullanıcıların oluşturduğu anketleri inceleyin ve onaylayın.</p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Yükleniyor...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {/* Onay Bekleyenler */}
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B' }}>
                            <Clock size={20} /> Onay Bekleyen Anketler ({pendingSurveys.length})
                        </h2>
                        {pendingSurveys.length === 0 ? (
                            <div style={{ padding: '24px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                                Onay bekleyen anket bulunmuyor.
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '16px' }}>
                                {pendingSurveys.map(survey => (
                                    <div key={survey.id} style={{ background: 'var(--card-bg)', border: '1px solid #F59E0B', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px' }}>{survey.title}</h3>
                                                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{survey.description}</p>
                                            </div>
                                            <div style={{ background: 'var(--secondary)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                                {survey.category}
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {survey.nominees.map(n => (
                                                <div key={n.id} style={{ background: 'var(--secondary)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }}>
                                                    {n.name}
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
                                            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                Oluşturan: <strong>{survey.createdBy || 'Bilinmiyor'}</strong>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleDelete(survey.id)} disabled={actionLoading === survey.id} style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px',
                                                    background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', cursor: 'pointer', fontWeight: '600', fontSize: '13px'
                                                }}>
                                                    <Trash2 size={16} /> Reddet / Sil
                                                </button>
                                                <button onClick={() => handleApprove(survey.id)} disabled={actionLoading === survey.id} style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px',
                                                    background: '#10B981', border: 'none', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '13px'
                                                }}>
                                                    <CheckCircle size={16} /> Onayla ve Yayınla
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Yayındaki Anketler */}
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981' }}>
                            <CheckCircle size={20} /> Yayındaki Anketler ({activeSurveys.length})
                        </h2>
                        {activeSurveys.length === 0 ? (
                            <div style={{ padding: '24px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                                Yayında anket bulunmuyor.
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '16px' }}>
                                {activeSurveys.map(survey => (
                                    <div key={survey.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--foreground)' }}>{survey.title}</h3>
                                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Kategori: {survey.category} • Toplam Oy: {survey.totalVotes}</div>
                                        </div>
                                        <button onClick={() => handleDelete(survey.id)} disabled={actionLoading === survey.id} style={{
                                            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px',
                                            background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: '600', fontSize: '13px'
                                        }}>
                                            <Trash2 size={16} /> Yayından Kaldır
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
