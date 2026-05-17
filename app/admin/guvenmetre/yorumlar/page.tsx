"use client";

import { useState, useEffect, useCallback } from "react";
import {
    MessageSquare, CheckCircle, XCircle, Search, X, RefreshCw,
    Trash2, Star, User, ChevronRight, Eye, Filter, AlertTriangle
} from "lucide-react";
import { adminGet, adminPost } from "@/lib/adminFetch";

interface GmReview {
    id: string;
    userName: string;
    userEmail: string;
    userId: string;
    categoryId: string;
    brandId: string;
    rating: number;
    comment: string;
    status: string;
    createdAt: string;
}

type FilterType = 'hepsi' | 'approved' | 'pending' | 'rejected';
type Modal = { type: 'delete' | 'approve' | 'reject'; review: GmReview } | null;

export default function AdminGuvenmetreReviewsPage() {
    const [reviews, setReviews] = useState<GmReview[]>([]);
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('hepsi');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<GmReview | null>(null);
    const [modal, setModal] = useState<Modal>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

    const showToast = (msg: string, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminGet('guvenmetre_reviews', search ? { q: search } : undefined);
            if (data.success) {
                setReviews(data.reviews || []);
                setStats(data.stats || { total: 0, approved: 0, pending: 0 });
            }
        } catch (e) {
            console.error('GüvenMetre yorumları yüklenemedi:', e);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const t = setTimeout(fetchReviews, 300);
        return () => clearTimeout(t);
    }, [fetchReviews]);

    const apiAction = async (action: string, target: string) => {
        setActionLoading(true);
        try {
            const data = await adminPost({ action, target });
            if (data.success) {
                await fetchReviews();
                return true;
            }
        } catch (e) {
            console.error('Admin aksiyon hatası:', e);
        } finally {
            setActionLoading(false);
        }
        return false;
    };

    const handleAction = async () => {
        if (!modal) return;
        const { type, review } = modal;
        let ok = false;
        if (type === 'delete') {
            ok = await apiAction('delete_review', review.id);
            if (ok) showToast('Yorum silindi.', 'error');
        } else if (type === 'approve') {
            ok = await apiAction('approve_review', review.id);
            if (ok) showToast('Yorum onaylandı.');
        } else if (type === 'reject') {
            ok = await apiAction('reject_review', review.id);
            if (ok) showToast('Yorum reddedildi.', 'error');
        }
        if (ok) { setModal(null); setSelected(null); }
    };

    const statusStyle = (s: string) => ({
        approved: { bg: 'rgba(16,185,129,0.12)', color: '#10B981', label: 'Onaylı' },
        pending: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', label: 'Bekliyor' },
        rejected: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', label: 'Reddedildi' },
    }[s] || { bg: 'rgba(100,100,100,0.1)', color: '#6B7280', label: s });

    const filtered = reviews.filter(r => {
        if (filter === 'approved') return r.status === 'approved';
        if (filter === 'pending') return r.status === 'pending';
        if (filter === 'rejected') return r.status === 'rejected';
        return true;
    });

    const counts = {
        hepsi: reviews.length,
        approved: reviews.filter(r => r.status === 'approved').length,
        pending: reviews.filter(r => r.status === 'pending').length,
        rejected: reviews.filter(r => r.status === 'rejected').length,
    };

    const renderStars = (rating: number) => (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={12} style={{
                    fill: i <= rating ? '#eab308' : 'transparent',
                    color: i <= rating ? '#eab308' : '#404040'
                }} />
            ))}
        </div>
    );

    return (
        <div style={{ position: 'relative', paddingBottom: '40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px' }}>
                        GüvenMetre Yorumları
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        Kullanıcıların GüvenMetre değerlendirmelerini yönetin · {stats.total} toplam · {stats.approved} onaylı · {stats.pending} bekleyen
                    </p>
                </div>
                <button onClick={fetchReviews} disabled={loading} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                    color: 'var(--foreground)', padding: '10px 16px', borderRadius: '10px',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '600'
                }}>
                    <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} /> Yenile
                </button>
            </div>

            {/* Filter Tabs + Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '6px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '4px' }}>
                    {([
                        { key: 'hepsi' as FilterType, label: 'Tümü' },
                        { key: 'approved' as FilterType, label: '✓ Onaylı' },
                        { key: 'pending' as FilterType, label: '⏳ Bekleyen' },
                        { key: 'rejected' as FilterType, label: '✕ Reddedilen' },
                    ]).map(t => (
                        <button key={t.key} onClick={() => setFilter(t.key)} style={{
                            padding: '7px 14px', borderRadius: '7px', border: 'none',
                            background: filter === t.key ? 'var(--primary)' : 'transparent',
                            color: filter === t.key ? 'white' : 'var(--text-muted)',
                            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            {t.label}
                            <span style={{
                                fontSize: '10px',
                                background: filter === t.key ? 'rgba(255,255,255,0.25)' : 'var(--background)',
                                padding: '1px 6px', borderRadius: '10px', fontWeight: '800'
                            }}>{counts[t.key]}</span>
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '0 12px', height: '40px', width: '240px', gap: '7px' }}>
                    <Search size={14} style={{ color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="Kullanıcı, marka, yorum..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--foreground)', fontSize: '13px' }} />
                    {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={13} /></button>}
                </div>
            </div>

            {/* 2-kolon layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px' }}>
                {/* Sol: Yorum Listesi */}
                <div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                            <RefreshCw size={28} style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 10px', display: 'block', opacity: 0.4 }} />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', color: 'var(--text-muted)' }}>
                            <MessageSquare size={36} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.3 }} />
                            <p style={{ fontWeight: '600', margin: 0 }}>Yorum bulunamadı</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '70vh', overflowY: 'auto' }}>
                            {filtered.map(rev => {
                                const ss = statusStyle(rev.status);
                                const isSelected = selected?.id === rev.id;
                                return (
                                    <div key={rev.id} onClick={() => setSelected(isSelected ? null : rev)} style={{
                                        background: 'var(--card-bg)',
                                        border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--card-border)'}`,
                                        borderRadius: '12px', padding: '14px 16px', cursor: 'pointer',
                                        transition: 'border-color 0.15s'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <User size={14} color="var(--text-muted)" />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{rev.userName}</span>
                                                    <span style={{ padding: '1px 6px', borderRadius: '20px', fontSize: '9px', fontWeight: '700', background: ss.bg, color: ss.color }}>{ss.label}</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{rev.brandId} · {rev.createdAt}</p>
                                            </div>
                                            <ChevronRight size={14} color="var(--text-muted)" style={{ transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {renderStars(rev.rating)}
                                            {rev.comment && <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{rev.comment}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Sağ: Detay Panel */}
                <div>
                    {!selected ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', color: 'var(--text-muted)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <MessageSquare size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                            <p style={{ fontWeight: '600', margin: 0 }}>Yorum seçin</p>
                            <p style={{ fontSize: '12px', margin: '6px 0 0' }}>Soldaki listeden bir yoruma tıklayın</p>
                        </div>
                    ) : (
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', overflow: 'hidden' }}>
                            {/* Header */}
                            <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--card-border)', background: 'var(--secondary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--foreground)' }}>{selected.userName}</h3>
                                        <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>{selected.userEmail} · #{selected.id.slice(0, 8)}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', ...(() => { const s = statusStyle(selected.status); return { background: s.bg, color: s.color }; })() }}>
                                        <span style={{ fontSize: '12px', fontWeight: '700' }}>{statusStyle(selected.status).label}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bilgiler */}
                            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--card-border)' }}>
                                <h4 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' }}>Değerlendirme Detayı</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {[
                                        { label: 'Kategori', value: selected.categoryId },
                                        { label: 'Marka/Kişi', value: selected.brandId },
                                        { label: 'Tarih', value: selected.createdAt },
                                        { label: 'Kullanıcı ID', value: selected.userId.slice(0, 12) + '...' },
                                    ].map(info => (
                                        <div key={info.label} style={{ background: 'var(--background)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                                            <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>{info.label}</span>
                                            <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: 'var(--foreground)' }}>{info.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Puan */}
                            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--card-border)' }}>
                                <h4 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>Puan</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {renderStars(selected.rating)}
                                    <span style={{ fontSize: '24px', fontWeight: '900', color: '#eab308' }}>{selected.rating}/5</span>
                                </div>
                            </div>

                            {/* Yorum */}
                            {selected.comment && (
                                <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--card-border)' }}>
                                    <h4 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>Yorum</h4>
                                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.6', background: 'var(--background)', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                                        &quot;{selected.comment}&quot;
                                    </p>
                                </div>
                            )}

                            {/* Aksiyonlar */}
                            <div style={{ padding: '16px 22px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {selected.status !== 'approved' && (
                                        <button onClick={() => setModal({ type: 'approve', review: selected })} style={{
                                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                                            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)',
                                            color: '#10B981', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
                                        }}>
                                            <CheckCircle size={16} /> Onayla
                                        </button>
                                    )}
                                    {selected.status !== 'rejected' && (
                                        <button onClick={() => setModal({ type: 'reject', review: selected })} style={{
                                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                                            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
                                            color: '#F59E0B', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
                                        }}>
                                            <XCircle size={16} /> Reddet
                                        </button>
                                    )}
                                    <button onClick={() => setModal({ type: 'delete', review: selected })} style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
                                        color: '#EF4444', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
                                    }}>
                                        <Trash2 size={16} /> Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {modal && (
                <>
                    <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, backdropFilter: 'blur(2px)' }} />
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '420px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', zIndex: 1200, padding: '28px', animation: 'popIn 0.2s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: modal.type === 'approve' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {modal.type === 'approve'
                                    ? <CheckCircle size={22} color="#10B981" />
                                    : modal.type === 'reject'
                                        ? <XCircle size={22} color="#F59E0B" />
                                        : <Trash2 size={22} color="#EF4444" />
                                }
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--foreground)' }}>
                                    {modal.type === 'approve' ? 'Yorum onaylansın mı?' : modal.type === 'reject' ? 'Yorum reddedilsin mi?' : 'Yorum silinsin mi?'}
                                </h3>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                                    {modal.review.userName} · {modal.review.brandId}
                                </p>
                            </div>
                        </div>

                        {modal.review.comment && (
                            <div style={{ background: 'var(--background)', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', border: '1px solid var(--card-border)' }}>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--foreground)', lineHeight: '1.5' }}>
                                    &quot;{modal.review.comment}&quot;
                                </p>
                            </div>
                        )}

                        {modal.type === 'delete' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', marginBottom: '20px' }}>
                                <AlertTriangle size={16} color="#EF4444" />
                                <span style={{ fontSize: '12px', color: '#EF4444', fontWeight: '600' }}>Bu işlem geri alınamaz!</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setModal(null)} style={{
                                flex: 1, padding: '12px', borderRadius: '10px',
                                background: 'var(--background)', border: '1px solid var(--card-border)',
                                color: 'var(--foreground)', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                            }}>
                                Vazgeç
                            </button>
                            <button onClick={handleAction} disabled={actionLoading} style={{
                                flex: 2, padding: '12px', borderRadius: '10px', border: 'none',
                                background: modal.type === 'approve' ? '#10B981' : '#EF4444',
                                color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer'
                            }}>
                                {actionLoading ? '...' : modal.type === 'approve' ? '✓ Onayla' : modal.type === 'reject' ? '✕ Reddet' : '🗑 Sil'}
                            </button>
                        </div>
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
