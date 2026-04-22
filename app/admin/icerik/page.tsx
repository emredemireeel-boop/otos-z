"use client";

import { useState, useEffect, useCallback } from "react";
import {
    TrendingUp, Pin, Trash2, Plus, CheckCircle, Search, X,
    RefreshCw, Bell, AlertTriangle, Info, MessageSquare,
    ChevronRight, GripVertical, Eye, Hash, Clock, ArrowUp, ArrowDown
} from "lucide-react";

interface LiveThread {
    id: string;
    title: string;
    category: string;
    author: string;
    views: number;
    entryCount: number;
    createdAt: string;
    trending: boolean;
    trendingRank: number;
    pinned: boolean;
    locked: boolean;
}

interface Announcement {
    id: string;
    title: string;
    body: string;
    type: 'info' | 'warning' | 'danger' | 'success';
    pinned: boolean;
    author: string;
    createdAt: string;
}

type Tab = 'trending' | 'announcements';
type AnnType = 'info' | 'warning' | 'danger' | 'success';
type Modal = { type: 'addAnn' } | { type: 'deleteAnn'; id: string; title: string } | { type: 'addTrend' } | null;

export default function AdminContentPage() {
    const [tab, setTab] = useState<Tab>('trending');
    const [threads, setThreads] = useState<LiveThread[]>([]);
    const [trendingThreads, setTrendingThreads] = useState<LiveThread[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<Modal>(null);
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    // Duyuru formu
    const [annTitle, setAnnTitle] = useState('');
    const [annBody, setAnnBody] = useState('');
    const [annType, setAnnType] = useState<AnnType>('info');
    const [annPinned, setAnnPinned] = useState(false);

    const showToast = (msg: string, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [threadsRes, trendRes, annRes] = await Promise.all([
                fetch(`/api/admin?section=threads${search ? `&q=${search}` : ''}`),
                fetch('/api/admin?section=trending'),
                fetch('/api/admin?section=announcements'),
            ]);
            const [td, tr, an] = await Promise.all([threadsRes.json(), trendRes.json(), annRes.json()]);
            if (td.success) setThreads(td.threads);
            if (tr.success) setTrendingThreads(tr.trendingThreads);
            if (an.success) setAnnouncements(an.announcements);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const t = setTimeout(fetchData, 300);
        return () => clearTimeout(t);
    }, [fetchData]);

    const apiAction = async (action: string, target: string, detail?: string) => {
        setActionLoading(true);
        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, target, detail }),
            });
            const data = await res.json();
            if (data.success) { await fetchData(); return true; }
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddTrend = async (threadId: string) => {
        const ok = await apiAction('set_trending', threadId);
        if (ok) { setModal(null); showToast('âœ“ Başlık öne çıkarılan listesine eklendi!'); }
    };

    const handleRemoveTrend = async (threadId: string) => {
        const ok = await apiAction('remove_trending', threadId);
        if (ok) showToast('Öne çıkarılan listesinden çıkarıldı.', 'warning');
    };

    const handleAddAnnouncement = async () => {
        if (!annTitle.trim()) return;
        const ok = await apiAction('add_announcement', 'system', JSON.stringify({ title: annTitle, body: annBody, type: annType, pinned: annPinned }));
        if (ok) {
            setModal(null); setAnnTitle(''); setAnnBody(''); setAnnType('info'); setAnnPinned(false);
            showToast('âœ“ Duyuru yayımlandı!');
        }
    };

    const handleDeleteAnn = async (id: string) => {
        const ok = await apiAction('delete_announcement', id);
        if (ok) { setModal(null); showToast('Duyuru silindi.', 'error'); }
    };

    const handleTogglePin = async (id: string) => {
        await apiAction('toggle_announcement_pin', id);
        await fetchData();
    };

    const getCategoryColor = (cat: string) => {
        const map: Record<string, string> = { Teknik: '#3B82F6', Karşılaştırma: '#8B5CF6', Genel: '#10B981', Deneyim: '#F59E0B', Marka: '#EF4444', 'Alım-Satım': '#06B6D4' };
        return map[cat] || '#6B7280';
    };

    const annTypeConfig = {
        info: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', label: 'Bilgilendirme', icon: <Info size={16} /> },
        warning: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'Uyarı', icon: <AlertTriangle size={16} /> },
        danger: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'Kritik', icon: <Bell size={16} /> },
        success: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'Başarı', icon: <CheckCircle size={16} /> },
    };

    // Henüz trendde olmayan başlıklar
    const trendingIds = trendingThreads.map(t => t.id);
    const notTrending = threads.filter(t => !trendingIds.includes(t.id));

    return (
        <div style={{ position: 'relative', paddingBottom: '40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px' }}>İçerik & Trendler</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Öne çıkan başlıkları ve site duyurularını yönet</p>
                </div>
                <button onClick={fetchData} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                    <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} /> Yenile
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '6px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
                {([
                    { key: 'trending', label: '🔥 Öne Çıkan Başlıklar', count: trendingThreads.length },
                    { key: 'announcements', label: '📢 Site Duyuruları', count: announcements.length },
                ] as const).map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '8px 18px', borderRadius: '7px', border: 'none', background: tab === t.key ? 'var(--primary)' : 'transparent', color: tab === t.key ? 'white' : 'var(--text-muted)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        {t.label}
                        <span style={{ fontSize: '10px', fontWeight: '800', background: tab === t.key ? 'rgba(255,255,255,0.25)' : 'var(--background)', padding: '1px 6px', borderRadius: '10px' }}>{t.count}</span>
                    </button>
                ))}
            </div>

            {/* â”€â”€ TREND SEKME â”€â”€ */}
            {tab === 'trending' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Sol: Mevcut Trendler */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>
                                🔥 Öne Çıkan Liste <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>(maks. 10)</span>
                            </h3>
                            <button onClick={() => setModal({ type: 'addTrend' })} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--primary)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                <Plus size={14} /> Ekle
                            </button>
                        </div>

                        {trendingThreads.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', color: 'var(--text-muted)' }}>
                                <TrendingUp size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                                <p style={{ fontWeight: '600', margin: 0 }}>Henüz öne çıkan başlık yok</p>
                                <p style={{ fontSize: '12px', margin: '6px 0 0' }}>Sağ panelden başlık ekleyin</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {trendingThreads.map((thread, i) => {
                                    const cc = getCategoryColor(thread.category);
                                    return (
                                        <div key={thread.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '12px 14px', display: 'flex', gap: '12px', alignItems: 'center', borderLeft: `3px solid ${cc}` }}>
                                            <span style={{ fontSize: '18px', fontWeight: '900', color: cc, width: '24px', flexShrink: 0, textAlign: 'center' }}>{i + 1}</span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{thread.title}</p>
                                                <div style={{ display: 'flex', gap: '10px', marginTop: '3px' }}>
                                                    <span style={{ fontSize: '10px', color: cc, fontWeight: '700', background: `${cc}15`, padding: '1px 6px', borderRadius: '4px' }}>{thread.category}</span>
                                                    <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
                                                        <Eye size={9} style={{ display: 'inline', verticalAlign: 'middle' }} /> {thread.views}
                                                    </span>
                                                    <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
                                                        <Hash size={9} style={{ display: 'inline', verticalAlign: 'middle' }} /> {thread.entryCount}
                                                    </span>
                                                </div>
                                            </div>
                                            <button onClick={() => handleRemoveTrend(thread.id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Sağ: Tüm başlıklar listesi */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>Tüm Başlıklar</h3>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0 10px', height: '34px', width: '180px', gap: '6px' }}>
                                <Search size={12} style={{ color: 'var(--text-muted)' }} />
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Ara..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--foreground)', fontSize: '12px' }} />
                                {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={12} /></button>}
                            </div>
                        </div>

                        <div style={{ maxHeight: '520px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
                            {notTrending.map(thread => {
                                const cc = getCategoryColor(thread.category);
                                return (
                                    <div key={thread.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '10px 12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{thread.title}</p>
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '3px' }}>
                                                <span style={{ fontSize: '10px', color: cc }}>{thread.category}</span>
                                                <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>{thread.views} görüntülenme</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleAddTrend(thread.id)} disabled={trendingThreads.length >= 10} style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', color: '#8B5CF6', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, opacity: trendingThreads.length >= 10 ? 0.4 : 1 }}>
                                            <TrendingUp size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />Öne Çıkar
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* â”€â”€ DUYURU SEKME â”€â”€ */}
            {tab === 'announcements' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
                        <button onClick={() => setModal({ type: 'addAnn' })} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'var(--primary)', border: 'none', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                            <Plus size={15} /> Yeni Duyuru Yayımla
                        </button>
                    </div>

                    {announcements.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', color: 'var(--text-muted)' }}>
                            <Bell size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                            <p style={{ fontWeight: '600', margin: 0 }}>Aktif duyuru yok</p>
                            <p style={{ fontSize: '12px', margin: '6px 0 0' }}>Yeni duyuru yazarak kullanıcılara bildirim gönderin</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {announcements.map(ann => {
                                const cfg = annTypeConfig[ann.type];
                                return (
                                    <div key={ann.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '18px 20px', borderLeft: `4px solid ${cfg.color}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.color, flexShrink: 0 }}>
                                                    {cfg.icon}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--foreground)' }}>{ann.title}</span>
                                                        <span style={{ padding: '2px 7px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                                        {ann.pinned && <span style={{ padding: '2px 7px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>📌 Sabitlenmiş</span>}
                                                    </div>
                                                    {ann.body && <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{ann.body}</p>}
                                                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-subtle)' }}>
                                                        <Clock size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
                                                        {ann.createdAt} · @{ann.author}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                                <button onClick={() => handleTogglePin(ann.id)} style={{ background: ann.pinned ? 'rgba(245,158,11,0.1)' : 'var(--background)', border: '1px solid var(--border-subtle)', color: '#F59E0B', padding: '6px 10px', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                                                    {ann.pinned ? 'Unpin' : '📌 Sabitle'}
                                                </button>
                                                <button onClick={() => setModal({ type: 'deleteAnn', id: ann.id, title: ann.title })} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', padding: '6px 10px', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700' }}>
                                                    <Trash2 size={13} /> Sil
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* â”€â”€ MODALS â”€â”€ */}
            {modal && (
                <>
                    <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, backdropFilter: 'blur(2px)' }} />
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', zIndex: 1200, padding: '28px', animation: 'popIn 0.2s ease' }}>

                        {/* Duyuru Ekle */}
                        {modal.type === 'addAnn' && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={22} color="#3B82F6" /></div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--foreground)' }}>Yeni Duyuru Yayımla</h3>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Tüm kullanıcılara gösterilecek</p>
                                    </div>
                                </div>

                                <label style={labelStyle}>Duyuru Türü</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '16px' }}>
                                    {(['info', 'warning', 'danger', 'success'] as AnnType[]).map(t => {
                                        const cfg = annTypeConfig[t];
                                        return (
                                            <button key={t} onClick={() => setAnnType(t)} style={{ padding: '10px 6px', borderRadius: '8px', border: annType === t ? `2px solid ${cfg.color}` : '1px solid var(--border-subtle)', background: annType === t ? cfg.bg : 'var(--background)', color: cfg.color, fontSize: '11px', fontWeight: '700', cursor: 'pointer', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>{cfg.icon}</div>
                                                {cfg.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                <label style={labelStyle}>Başlık</label>
                                <input value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Duyuru başlığı..." style={{ ...inputStyle, marginBottom: '14px' }} />

                                <label style={labelStyle}>İçerik (opsiyonel)</label>
                                <textarea value={annBody} onChange={e => setAnnBody(e.target.value)} placeholder="Duyuru detayları..." rows={3} style={{ ...textareaStyle, marginBottom: '14px' }} />

                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>
                                    <input type="checkbox" checked={annPinned} onChange={e => setAnnPinned(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                                    Sayfanın üstünde sabitle
                                </label>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                                    <button onClick={handleAddAnnouncement} disabled={!annTitle.trim() || actionLoading} style={{ ...primaryBtnStyle(annTypeConfig[annType].color), opacity: annTitle.trim() ? 1 : 0.4 }}>
                                        {actionLoading ? '...' : '📢 Yayımla'}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Duyuru Sil */}
                        {modal.type === 'deleteAnn' && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={22} color="#EF4444" /></div>
                                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--foreground)' }}>Duyuru Silinsin mi?</h3>
                                </div>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                                    "<strong>{modal.title}</strong>" duyurusu kalıcı olarak silinecek.
                                </p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                                    <button onClick={() => handleDeleteAnn(modal.id)} disabled={actionLoading} style={dangerBtnStyle}>{actionLoading ? '...' : 'Sil'}</button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* Toast */}
            {toast && (
                <div style={{ position: 'fixed', bottom: '32px', right: '32px', background: toast.type === 'error' ? '#EF4444' : toast.type === 'warning' ? '#F59E0B' : '#10B981', color: 'white', padding: '14px 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', fontWeight: '600', fontSize: '14px', zIndex: 9999, animation: 'slideUp 0.3s ease' }}>
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

// Style constants
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const textareaStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box' };
const cancelBtnStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border-subtle)', color: 'var(--foreground)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };
const dangerBtnStyle: React.CSSProperties = { flex: 2, padding: '12px', borderRadius: '10px', background: '#EF4444', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' };
const primaryBtnStyle = (color: string): React.CSSProperties => ({ flex: 2, padding: '12px', borderRadius: '10px', background: color, border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' });
