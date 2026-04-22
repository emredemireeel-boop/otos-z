"use client";

import { useState, useEffect, useCallback } from "react";
import {
    ShieldCheck, CheckCircle, XCircle, Search, X, RefreshCw,
    Car, User, AlertCircle, Clock, Star, Hash, ChevronRight,
    Gauge, FileText, AlertTriangle
} from "lucide-react";

interface GuvenRequest {
    id: string;
    username: string;
    displayName: string;
    carBrand: string;
    carModel: string;
    plate: string;
    date: string;
    status: string;
    score: number;
    note: string;
}

type FilterType = 'hepsi' | 'bekleyen' | 'onaylanan' | 'reddedilen';
type Modal = { type: 'approve' | 'reject'; req: GuvenRequest } | null;

const SCORE_BONUSES = [
    { label: 'Araç Ruhsatı DoÃ„şrulandı', pts: 150, checked: false },
    { label: 'Profil FotoÃ„şrafı Mevcut', pts: 50, checked: false },
    { label: '30+ Entry Girmiş', pts: 100, checked: false },
    { label: 'Premium Üye', pts: 80, checked: false },
    { label: 'Üyelik 6+ Ay', pts: 60, checked: false },
];

export default function AdminGuvenmetrePage() {
    const [requests, setRequests] = useState<GuvenRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('hepsi');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<GuvenRequest | null>(null);
    const [modal, setModal] = useState<Modal>(null);
    const [rejectNote, setRejectNote] = useState('');
    const [checkedBonuses, setCheckedBonuses] = useState<boolean[]>(SCORE_BONUSES.map(() => false));
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

    const showToast = (msg: string, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin?section=guvenmetre${search ? `&q=${search}` : ''}`);
            const data = await res.json();
            if (data.success) setRequests(data.requests);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const t = setTimeout(fetchRequests, 300);
        return () => clearTimeout(t);
    }, [fetchRequests]);

    const apiAction = async (action: string, target: string, detail?: string) => {
        setActionLoading(true);
        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, target, detail }),
            });
            const data = await res.json();
            if (data.success) { await fetchRequests(); return true; }
        } finally {
            setActionLoading(false);
        }
        return false;
    };

    const calcScore = () => {
        const base = selected?.score || 0;
        const bonus = SCORE_BONUSES.reduce((sum, b, i) => sum + (checkedBonuses[i] ? b.pts : 0), 0);
        return Math.min(1000, base + bonus);
    };

    const handleApprove = async () => {
        if (!modal || modal.type !== 'approve') return;
        const finalScore = calcScore();
        const ok = await apiAction('approve_guvenmetre', modal.req.id, `Puan: ${finalScore}`);
        if (ok) {
            setModal(null); setSelected(null); setCheckedBonuses(SCORE_BONUSES.map(() => false));
            showToast(`✓ @${modal.req.username} garajı onaylandı! Güvenmetre: ${finalScore}`);
        }
    };

    const handleReject = async () => {
        if (!modal || modal.type !== 'reject') return;
        const ok = await apiAction('reject_guvenmetre', modal.req.id, rejectNote || 'Yetersiz belge');
        if (ok) {
            setModal(null); setSelected(null); setRejectNote('');
            showToast('Başvuru reddedildi.', 'error');
        }
    };

    const statusStyle = (s: string) => ({
        pending: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', label: 'Bekliyor' },
        approved: { bg: 'rgba(16,185,129,0.12)', color: '#10B981', label: 'Onaylandı' },
        rejected: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', label: 'Reddedildi' },
    }[s] || { bg: 'rgba(100,100,100,0.1)', color: '#6B7280', label: s });

    const scoreColor = (s: number) => s >= 800 ? '#10B981' : s >= 600 ? '#F59E0B' : '#EF4444';
    const scoreLabel = (s: number) => s >= 800 ? 'Yüksek Güven' : s >= 600 ? 'Orta Güven' : 'Düşük Güven';

    const filtered = requests.filter(r => {
        if (filter === 'bekleyen') return r.status === 'pending';
        if (filter === 'onaylanan') return r.status === 'approved';
        if (filter === 'reddedilen') return r.status === 'rejected';
        return true;
    });

    const counts = {
        hepsi: requests.length,
        bekleyen: requests.filter(r => r.status === 'pending').length,
        onaylanan: requests.filter(r => r.status === 'approved').length,
        reddedilen: requests.filter(r => r.status === 'rejected').length,
    };

    return (
        <div style={{ position: 'relative', paddingBottom: '40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px' }}>Güvenmetre & Garaj Doğrulama</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Araç sahiplik belgelerini incele ve güvenmetre puanını güncelle</p>
                </div>
                <button onClick={fetchRequests} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                    <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} /> Yenile
                </button>
            </div>

            {/* Filter Tabs + Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '6px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '4px' }}>
                    {([
                        { key: 'hepsi', label: 'Tümü' },
                        { key: 'bekleyen', label: ' Bekleyen' },
                        { key: 'onaylanan', label: '✓ Onaylanan' },
                        { key: 'reddedilen', label: '✤ Reddedilen' },
                    ] as { key: FilterType; label: string }[]).map(t => (
                        <button key={t.key} onClick={() => setFilter(t.key)} style={{ padding: '7px 14px', borderRadius: '7px', border: 'none', background: filter === t.key ? 'var(--primary)' : 'transparent', color: filter === t.key ? 'white' : 'var(--text-muted)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {t.label}
                            <span style={{ fontSize: '10px', background: filter === t.key ? 'rgba(255,255,255,0.25)' : 'var(--background)', padding: '1px 6px', borderRadius: '10px', fontWeight: '800' }}>{counts[t.key]}</span>
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '0 12px', height: '40px', width: '220px', gap: '7px' }}>
                    <Search size={14} style={{ color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="Kullanıcı adı, araç..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--foreground)', fontSize: '13px' }} />
                    {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={13} /></button>}
                </div>
            </div>

            {/* 2-kolon layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px' }}>
                {/* Sol: Başvuru Listesi */}
                <div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                            <RefreshCw size={28} style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 10px', display: 'block', opacity: 0.4 }} />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', color: 'var(--text-muted)' }}>
                            <ShieldCheck size={36} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.3 }} />
                            <p style={{ fontWeight: '600', margin: 0 }}>Bu filtrede başvuru yok</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {filtered.map(req => {
                                const ss = statusStyle(req.status);
                                const sc = scoreColor(req.score);
                                const isSelected = selected?.id === req.id;
                                return (
                                    <div key={req.id} onClick={() => setSelected(isSelected ? null : req)} style={{ background: 'var(--card-bg)', border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--card-border)'}`, borderRadius: '12px', padding: '14px 16px', cursor: 'pointer', transition: 'border-color 0.15s', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${sc}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                                            🚗
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
                                                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>@{req.username}</span>
                                                <span style={{ padding: '2px 7px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', background: ss.bg, color: ss.color }}>{ss.label}</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{req.carBrand} {req.carModel} · {req.plate}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                    <Gauge size={11} color={sc} />
                                                    <span style={{ fontSize: '11px', fontWeight: '800', color: sc }}>{req.score}</span>
                                                    <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>/ 1000</span>
                                                </div>
                                                <span style={{ fontSize: '10px', color: sc, fontWeight: '600' }}>{scoreLabel(req.score)}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} color="var(--text-muted)" style={{ transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* SaÃ„ş: Detay Panel */}
                <div>
                    {!selected ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', color: 'var(--text-muted)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldCheck size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                            <p style={{ fontWeight: '600', margin: 0 }}>Başvuru seçin</p>
                            <p style={{ fontSize: '12px', margin: '6px 0 0' }}>Soldaki listeden bir başvuruya tıklayın</p>
                        </div>
                    ) : (
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', overflow: 'hidden' }}>
                            {/* Header */}
                            <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--card-border)', background: `${scoreColor(selected.score)}08` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--foreground)' }}>@{selected.username}</h3>
                                        <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>{selected.displayName} · #{selected.id}</p>
                                    </div>
                                    {/* Güvenmetre Halkaları */}
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                                            <svg width="64" height="64" viewBox="0 0 64 64">
                                                <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border-subtle)" strokeWidth="5" />
                                                <circle cx="32" cy="32" r="26" fill="none" stroke={scoreColor(selected.score)} strokeWidth="5"
                                                    strokeDasharray={`${(selected.score / 1000) * 163} 163`}
                                                    strokeLinecap="round" transform="rotate(-90 32 32)"
                                                    style={{ transition: 'stroke-dasharray 1s ease' }} />
                                            </svg>
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '14px', fontWeight: '900', color: scoreColor(selected.score), lineHeight: 1 }}>{selected.score}</span>
                                            </div>
                                        </div>
                                        <p style={{ margin: '4px 0 0', fontSize: '10px', fontWeight: '700', color: scoreColor(selected.score) }}>{scoreLabel(selected.score)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Araç ve Plaka */}
                            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--card-border)' }}>
                                <h4 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' }}>Başvuru Bilgileri</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {[
                                        { label: 'Araç', value: `${selected.carBrand} ${selected.carModel}`, icon: <Car size={12} /> },
                                        { label: 'Plaka', value: selected.plate, icon: <FileText size={12} /> },
                                        { label: 'Başvuru', value: selected.date, icon: <Clock size={12} /> },
                                        { label: 'Mevcut Puan', value: `${selected.score} / 1000`, icon: <Gauge size={12} /> },
                                    ].map(info => (
                                        <div key={info.label} style={{ background: 'var(--background)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', marginBottom: '3px' }}>
                                                {info.icon}
                                                <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{info.label}</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: 'var(--foreground)' }}>{info.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Puan Kırılımı */}
                            {selected.status === 'pending' && (
                                <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--card-border)' }}>
                                    <h4 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' }}>Puan Artırımları</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {SCORE_BONUSES.map((bonus, i) => (
                                            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', background: checkedBonuses[i] ? 'rgba(16,185,129,0.06)' : 'var(--background)', border: `1px solid ${checkedBonuses[i] ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`, transition: 'all 0.15s' }}>
                                                <input type="checkbox" checked={checkedBonuses[i]} onChange={e => {
                                                    const n = [...checkedBonuses]; n[i] = e.target.checked; setCheckedBonuses(n);
                                                }} style={{ width: '15px', height: '15px' }} />
                                                <span style={{ flex: 1, fontSize: '13px', color: 'var(--foreground)' }}>{bonus.label}</span>
                                                <span style={{ fontSize: '12px', fontWeight: '800', color: '#10B981' }}>+{bonus.pts}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: '14px', padding: '12px 14px', borderRadius: '10px', background: `${scoreColor(calcScore())}10`, border: `1px solid ${scoreColor(calcScore())}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Hesaplanan Güvenmetre</span>
                                        <span style={{ fontSize: '20px', fontWeight: '900', color: scoreColor(calcScore()) }}>{calcScore()} / 1000</span>
                                    </div>
                                </div>
                            )}

                            {/* Aksiyonlar */}
                            <div style={{ padding: '16px 22px' }}>
                                {selected.status === 'pending' ? (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => setModal({ type: 'reject', req: selected })} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                                            <XCircle size={16} /> Reddet
                                        </button>
                                        <button onClick={() => setModal({ type: 'approve', req: selected })} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', background: '#10B981', border: 'none', color: 'white', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                                            <CheckCircle size={16} /> Garajı Onayla ({calcScore()} puan)
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ padding: '14px', borderRadius: '10px', background: selected.status === 'approved' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${selected.status === 'approved' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {selected.status === 'approved' ? <CheckCircle size={18} color="#10B981" /> : <XCircle size={18} color="#EF4444" />}
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '700', fontSize: '13px', color: selected.status === 'approved' ? '#10B981' : '#EF4444' }}>
                                                {selected.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                                            </p>
                                            {selected.note && <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>{selected.note}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODALS */}
            {modal && (
                <>
                    <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, backdropFilter: 'blur(2px)' }} />
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '460px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', zIndex: 1200, padding: '28px', animation: 'popIn 0.2s ease' }}>

                        {modal.type === 'approve' && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheck size={22} color="#10B981" /></div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--foreground)' }}>Garaj Onaylansın mı?</h3>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#10B981', fontWeight: '600' }}>@{modal.req.username} · {modal.req.carBrand} {modal.req.carModel}</p>
                                    </div>
                                </div>
                                <div style={{ background: 'var(--background)', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Başlangıç Puanı</span>
                                        <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--foreground)' }}>{selected?.score}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Seçili Bonus</span>
                                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#10B981' }}>+{SCORE_BONUSES.reduce((s, b, i) => s + (checkedBonuses[i] ? b.pts : 0), 0)}</span>
                                    </div>
                                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>Toplam Güvenmetre</span>
                                        <span style={{ fontSize: '20px', fontWeight: '900', color: scoreColor(calcScore()) }}>{calcScore()}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                                    <button onClick={handleApprove} disabled={actionLoading} style={successBtnStyle}>{actionLoading ? '...' : `✓ Onayla (${calcScore()} puan)`}</button>
                                </div>
                            </>
                        )}

                        {modal.type === 'reject' && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><XCircle size={22} color="#EF4444" /></div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--foreground)' }}>Başvuru Reddedilsin mi?</h3>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#EF4444', fontWeight: '600' }}>@{modal.req.username}</p>
                                    </div>
                                </div>
                                <label style={labelStyle}>Red Sebebi</label>
                                <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="Örn: Ruhsat fotoÃ„şrafı okunamıyor, plaka eşleşmiyor..." rows={3} style={{ ...textareaStyle, marginBottom: '20px' }} />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                                    <button onClick={handleReject} disabled={actionLoading} style={dangerBtnStyle}>{actionLoading ? '...' : 'Reddet'}</button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {toast && (
                <div style={{ position: 'fixed', bottom: '32px', right: '32px', background: toast.type === 'error' ? '#EF4444' : '#10B981', color: 'white', padding: '14px 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', fontWeight: '600', fontSize: '14px', zIndex: 9999, animation: 'slideUp 0.3s ease' }}>
                    {toast.msg}
                </div>
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideUp { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes popIn { from { transform: translate(-50%,-50%) scale(0.9); opacity: 0; } to { transform: translate(-50%,-50%) scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' };
const textareaStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box' };
const cancelBtnStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border-subtle)', color: 'var(--foreground)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };
const dangerBtnStyle: React.CSSProperties = { flex: 2, padding: '12px', borderRadius: '10px', background: '#EF4444', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' };
const successBtnStyle: React.CSSProperties = { flex: 2, padding: '12px', borderRadius: '10px', background: '#10B981', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' };
