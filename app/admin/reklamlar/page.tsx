"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Megaphone, Plus, Trash2, Pause, Play, Eye, MousePointer,
    TrendingUp, RefreshCw, Search, X, ExternalLink, CheckCircle,
    AlertCircle, Clock, BarChart3, DollarSign, Zap, Monitor,
    Smartphone, LayoutTemplate, AlignLeft, ChevronRight, Edit3,
    ToggleLeft, ToggleRight, Globe, PieChart, Target
} from "lucide-react";

//  Tipler 
interface Ad {
    id: string;
    advertiser: string;
    title: string;
    description: string;
    url: string;
    imageUrl: string;
    position: string;
    type: string;
    size: string;
    status: 'active' | 'paused' | 'ended';
    budget: number;
    impressions: number;
    clicks: number;
    startDate: string;
    endDate: string;
    createdAt: string;
    priority: number;
}

interface AdSummary {
    total: number;
    active: number;
    paused: number;
    ended: number;
    totalImpressions: number;
    totalClicks: number;
    totalBudget: number;
    avgCtr: string;
}

type FilterType = 'hepsi' | 'active' | 'paused' | 'ended';
type Tab = 'kampanyalar' | 'pozisyonlar' | 'yeni';
type Modal = { type: 'delete'; ad: Ad } | { type: 'edit'; ad: Ad } | null;

//  Reklam Pozisyonları (sitenin özel slot'ları) 
const AD_POSITIONS = [
    { key: 'anasayfa_hero', label: 'Ana Sayfa Hero Altı', page: 'Ana Sayfa', desc: 'En yüksek trafik, tam genişlik banner alanı', size: '1200x90', traffic: 'Çok Yüksek', icon: ' ' },
    { key: 'forum_feed', label: 'Forum Liste Arası', page: 'Forum', desc: 'Her 5 başlıktan sonra görünen native reklam', size: '728x90', traffic: 'Yüksek', icon: '💬' },
    { key: 'entry_arasi', label: 'Entry Arası (Native)', page: 'Başlık Detay', desc: 'Entry\'ler arasında yerleşik, doğal görünümlü', size: 'Native', traffic: 'Yüksek', icon: '📑' },
    { key: 'sidebar', label: 'Sağ Kenar Çubuğu', page: 'Forum / Sözlük', desc: 'Sabit pozisyonlu, kullanıcı scroll\'larken takip eden', size: '300x250', traffic: 'Orta', icon: '📌' },
    { key: 'pazar_listesi', label: 'Pazar İlan Arası', page: 'Pazar', desc: 'İlan listeleri arasında beliren reklam kartı', size: '300x250', traffic: 'Orta', icon: '🚗' },
    { key: 'arac_dna', label: 'Araç DNA Sayfası', page: 'Araç DNA', desc: 'Araç detay sayfasında ilgili sponsor gösterimi', size: '728x90', traffic: 'Hedefli', icon: '🏎️' },
    { key: 'profil_alti', label: 'Profil Sayfası Altı', page: 'Profil', desc: 'Kullanıcı profil sayfasının altında görünen alan', size: '300x250', traffic: 'Düşük', icon: '👍' },
    { key: 'popup_exit', label: 'Çıkış Pop-up', page: 'Global', desc: 'Kullanıcı siteyi terk etmeden önce gösterilen overlay', size: '500x400', traffic: 'Hedefli', icon: '🛑' },
];

const AD_TYPES = [
    { key: 'banner_leaderboard', label: 'Leaderboard Banner', size: '728x90', icon: <Monitor size={14} /> },
    { key: 'banner_rectangle', label: 'Rectangle Banner', size: '300x250', icon: <LayoutTemplate size={14} /> },
    { key: 'banner_halfpage', label: 'Half Page', size: '300x600', icon: <LayoutTemplate size={14} /> },
    { key: 'banner_mobile', label: 'Mobil Banner', size: '320x50', icon: <Smartphone size={14} /> },
    { key: 'native', label: 'Native / İçerik', size: 'Otomatik', icon: <AlignLeft size={14} /> },
];

//  Yardımcı Bileşenler 
function StatPill({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
    return (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>{icon}</div>
            <div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{label}</p>
                <p style={{ margin: '2px 0 0', fontSize: '22px', fontWeight: '900', color: 'var(--foreground)' }}>{value}</p>
            </div>
        </div>
    );
}

function Ctr({ impressions, clicks }: { impressions: number; clicks: number }) {
    const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
    const color = parseFloat(ctr) >= 3 ? '#10B981' : parseFloat(ctr) >= 1 ? '#F59E0B' : '#EF4444';
    return <span style={{ fontWeight: '800', color, fontSize: '13px' }}>%{ctr}</span>;
}

const posLabel = (key: string) => AD_POSITIONS.find(p => p.key === key)?.label || key;
const typeLabel = (key: string) => AD_TYPES.find(t => t.key === key)?.label || key;

export default function AdminReklamlarPage() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [summary, setSummary] = useState<AdSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<Tab>('kampanyalar');
    const [filter, setFilter] = useState<FilterType>('hepsi');
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [modal, setModal] = useState<Modal>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null);

    // Yeni reklam formu
    const [form, setForm] = useState({
        advertiser: '', title: '', description: '', url: '',
        position: 'forum_feed', type: 'banner_leaderboard', budget: '',
        startDate: '', endDate: '',
    });

    const showToast = (msg: string, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchAds = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin?section=advertisements${search ? `&q=${search}` : ''}`);
            const data = await res.json();
            if (data.success) { setAds(data.ads); setSummary(data.summary); }
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const t = setTimeout(fetchAds, 300);
        return () => clearTimeout(t);
    }, [fetchAds]);

    const apiAction = async (action: string, target: string, detail?: string) => {
        setActionLoading(true);
        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, target, detail }),
            });
            const data = await res.json();
            if (data.success) { await fetchAds(); return true; }
        } finally { setActionLoading(false); }
        return false;
    };

    const handleStatusToggle = async (ad: Ad) => {
        const newStatus = ad.status === 'active' ? 'paused' : 'active';
        const ok = await apiAction('update_ad_status', ad.id, newStatus);
        if (ok) showToast(newStatus === 'active' ? `✓ "${ad.title}" yayına alındı.` : `"${ad.title}" duraklatıldı.`, newStatus === 'active' ? 'success' : 'warning');
    };

    const handleDelete = async () => {
        if (!modal || modal.type !== 'delete') return;
        const ok = await apiAction('delete_ad', modal.ad.id);
        if (ok) { setModal(null); showToast(`"${modal.ad.title}" silindi.`, 'error'); }
    };

    const handleCreate = async () => {
        if (!form.advertiser.trim() || !form.title.trim()) return;
        const sizeMap: Record<string, string> = {
            banner_leaderboard: '728x90', banner_rectangle: '300x250',
            banner_halfpage: '300x600', banner_mobile: '320x50', native: 'native',
        };
        const payload = { ...form, size: sizeMap[form.type] || '300x250', budget: Number(form.budget) || 0 };
        const ok = await apiAction('create_ad', 'new', JSON.stringify(payload));
        if (ok) {
            setForm({ advertiser: '', title: '', description: '', url: '', position: 'forum_feed', type: 'banner_leaderboard', budget: '', startDate: '', endDate: '' });
            setTab('kampanyalar');
            showToast(`✓ "${form.title}" kampanyası oluşturuldu ve yayına alındı!`);
        }
    };

    const handleSimulate = async (ad: Ad) => {
        const ok = await apiAction('simulate_impression', ad.id);
        if (ok) showToast(`📊 "${ad.title}" görüntülenme simüle edildi.`);
    };

    const statusStyle = (s: string) => ({
        active: { bg: 'rgba(16,185,129,0.12)', color: '#10B981', label: 'Yayında', dot: '🟢' },
        paused: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', label: 'Duraklatıldı', dot: '⏸️' },
        ended: { bg: 'rgba(107,114,128,0.12)', color: '#6B7280', label: 'Bitti', dot: '🔴' },
    }[s] || { bg: 'rgba(107,114,128,0.1)', color: '#6B7280', label: s, dot: '•' });

    const filtered = ads.filter(a => {
        if (filter === 'active') return a.status === 'active';
        if (filter === 'paused') return a.status === 'paused';
        if (filter === 'ended') return a.status === 'ended';
        return true;
    });

    const totalEarning = summary ? Math.round(summary.totalBudget * 0.72) : 0; // ~%72 gerçekleşme simülasyonu

    return (
        <div style={{ position: 'relative', paddingBottom: '40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Megaphone size={24} color="var(--primary)" /> Reklam Yönetimi
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        Sitenin özel reklam alanlarını yönet · {summary?.total ?? 0} kampanya
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={fetchAds} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                        <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} /> Yenile
                    </button>
                    <button onClick={() => setTab('yeni')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', border: 'none', color: 'white', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
                        <Plus size={15} /> Yeni Kampanya
                    </button>
                </div>
            </div>

            {/* Özet Stat Kartları */}
            {summary && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                    <StatPill icon={<BarChart3 size={20} />} label="Toplam Gösterim" value={summary.totalImpressions.toLocaleString('tr-TR')} color="#3B82F6" />
                    <StatPill icon={<MousePointer size={20} />} label="Toplam Tıklama" value={summary.totalClicks.toLocaleString('tr-TR')} color="#8B5CF6" />
                    <StatPill icon={<Target size={20} />} label="Ortalama CTR" value={`%${summary.avgCtr}`} color="#10B981" />
                    <StatPill icon={<DollarSign size={20} />} label="Toplam Bütçe" value={`₺${summary.totalBudget.toLocaleString('tr-TR')}`} color="#F59E0B" />
                    <StatPill icon={<Zap size={20} />} label="Aktif Kampanya" value={summary.active} color="#10B981" />
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '6px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '4px', marginBottom: '22px', width: 'fit-content' }}>
                {([
                    { key: 'kampanyalar', label: '📋 Kampanyalar' },
                    { key: 'pozisyonlar', label: ' Reklam Pozisyonları' },
                    { key: 'yeni', label: '+ Yeni Kampanya' },
                ] as { key: Tab; label: string }[]).map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '8px 18px', borderRadius: '7px', border: 'none', background: tab === t.key ? 'var(--primary)' : 'transparent', color: tab === t.key ? 'white' : 'var(--text-muted)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/*  KAMPANYALAR SEKME  */}
            {tab === 'kampanyalar' && (
                <>
                    {/* Filtre + Arama */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '10px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: '5px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '4px' }}>
                            {([
                                { key: 'hepsi', label: 'Tümü', count: summary?.total ?? 0 },
                                { key: 'active', label: '🟢 Yayında', count: summary?.active ?? 0 },
                                { key: 'paused', label: ' Duraklatıldı', count: summary?.paused ?? 0 },
                                { key: 'ended', label: '🔴 Bitti', count: summary?.ended ?? 0 },
                            ] as { key: FilterType; label: string; count: number }[]).map(f => (
                                <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: '6px 12px', borderRadius: '7px', border: 'none', background: filter === f.key ? 'var(--primary)' : 'transparent', color: filter === f.key ? 'white' : 'var(--text-muted)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {f.label}
                                    <span style={{ fontSize: '10px', background: filter === f.key ? 'rgba(255,255,255,0.25)' : 'var(--background)', padding: '1px 5px', borderRadius: '8px', fontWeight: '800' }}>{f.count}</span>
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '0 12px', height: '40px', width: '240px', gap: '8px' }}>
                            <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                            <input type="text" placeholder="Reklamveren, başlık..." value={search} onChange={e => setSearch(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--foreground)', fontSize: '13px' }} />
                            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={13} /></button>}
                        </div>
                    </div>

                    {/* Ad List */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                            <RefreshCw size={28} style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 10px', display: 'block', opacity: 0.4 }} />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', color: 'var(--text-muted)' }}>
                            <Megaphone size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                            <p style={{ fontWeight: '600', margin: 0 }}>Kampanya bulunamadı</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {filtered.map(ad => {
                                const ss = statusStyle(ad.status);
                                const posInfo = AD_POSITIONS.find(p => p.key === ad.position);
                                const isExpanded = expanded === ad.id;
                                const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100) : 0;

                                return (
                                    <div key={ad.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', overflow: 'hidden', borderLeft: `4px solid ${ss.color}`, opacity: ad.status === 'ended' ? 0.75 : 1 }}>
                                        {/* Row */}
                                        <div style={{ padding: '14px 18px', display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer' }}
                                            onClick={() => setExpanded(isExpanded ? null : ad.id)}>
                                            {/* Pozisyon icon */}
                                            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${ss.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                                                {posInfo?.icon ?? '📑'}
                                            </div>

                                            {/* Ana Bilgi */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--foreground)' }}>{ad.title}</span>
                                                    <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', background: ss.bg, color: ss.color }}>{ss.dot} {ss.label}</span>
                                                    <span style={{ padding: '2px 7px', borderRadius: '6px', fontSize: '10px', fontWeight: '600', background: 'var(--background)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>{posLabel(ad.position)}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ad.advertiser}</span>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Eye size={10} />{ad.impressions.toLocaleString('tr-TR')} gösterim
                                                    </span>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <MousePointer size={10} />{ad.clicks.toLocaleString('tr-TR')} tık
                                                    </span>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>CTR: </span>
                                                    <Ctr impressions={ad.impressions} clicks={ad.clicks} />
                                                </div>
                                            </div>

                                            {/* Bütçe */}
                                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                <p style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--foreground)' }}>₺{ad.budget.toLocaleString('tr-TR')}</p>
                                                <p style={{ margin: '2px 0 0', fontSize: '10px', color: 'var(--text-subtle)' }}>{ad.size}</p>
                                            </div>

                                            <ChevronRight size={16} color="var(--text-muted)" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                                        </div>

                                        {/* Expanded Detail */}
                                        {isExpanded && (
                                            <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                                {/* İstatistik Barları */}
                                                <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                                                    {[
                                                        { label: 'Gösterim', val: ad.impressions.toLocaleString('tr-TR'), color: '#3B82F6', icon: <Eye size={12} /> },
                                                        { label: 'Tıklama', val: ad.clicks.toLocaleString('tr-TR'), color: '#8B5CF6', icon: <MousePointer size={12} /> },
                                                        { label: 'CTR', val: `%${ctr.toFixed(2)}`, color: ctr >= 3 ? '#10B981' : ctr >= 1 ? '#F59E0B' : '#EF4444', icon: <Target size={12} /> },
                                                        { label: 'Bütçe', val: `₺${ad.budget.toLocaleString('tr-TR')}`, color: '#F59E0B', icon: <DollarSign size={12} /> },
                                                    ].map(s => (
                                                        <div key={s.label} style={{ background: 'var(--background)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: s.color, marginBottom: '4px' }}>{s.icon}<span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span></div>
                                                            <p style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: s.color }}>{s.val}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* CTR Progress Bar */}
                                                <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Performans (CTR hedef: %3.0)</span>
                                                        <span style={{ fontSize: '11px', fontWeight: '700', color: ctr >= 3 ? '#10B981' : '#F59E0B' }}>%{ctr.toFixed(2)}</span>
                                                    </div>
                                                    <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${Math.min(100, (ctr / 3) * 100)}%`, height: '100%', background: ctr >= 3 ? '#10B981' : ctr >= 1 ? '#F59E0B' : '#EF4444', borderRadius: '3px', transition: 'width 0.8s ease' }} />
                                                    </div>
                                                </div>

                                                {/* Meta Bilgiler */}
                                                <div style={{ padding: '12px 18px', display: 'flex', gap: '20px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-muted)' }}>
                                                    <span><Globe size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                                        <a href={ad.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{ad.url}</a>
                                                    </span>
                                                    <span><Clock size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />{ad.startDate} → {ad.endDate || 'Belirsiz'}</span>
                                                    <span><LayoutTemplate size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />{typeLabel(ad.type)} · {ad.size}</span>
                                                </div>

                                                {/* Aksiyonlar */}
                                                <div style={{ padding: '12px 18px', display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(0,0,0,0.01)' }}>
                                                    {ad.status !== 'ended' && (
                                                        <button onClick={() => handleStatusToggle(ad)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: ad.status === 'active' ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${ad.status === 'active' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`, color: ad.status === 'active' ? '#F59E0B' : '#10B981', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                                            {ad.status === 'active' ? <><Pause size={13} /> Duraklat</> : <><Play size={13} /> Yayına Al</>}
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleSimulate(ad)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', color: '#3B82F6', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                                        <Zap size={13} /> İstatistik Güncelle
                                                    </button>
                                                    {ad.status !== 'ended' && (
                                                        <button onClick={() => { apiAction('update_ad_status', ad.id, 'ended'); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(107,114,128,0.08)', border: '1px solid rgba(107,114,128,0.25)', color: '#6B7280', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                                            <Clock size={13} /> Bitir
                                                        </button>
                                                    )}
                                                    <div style={{ marginLeft: 'auto' }}>
                                                        <button onClick={() => setModal({ type: 'delete', ad })} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#EF4444', border: 'none', color: 'white', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                                            <Trash2 size={13} /> Sil
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/*  POZİSYONLAR SEKME  */}
            {tab === 'pozisyonlar' && (
                <div>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.7 }}>
                        Aşağıdaki alanlar Otosöz'ın sitesinde tanımlanmış özel reklam slotlarıdır. Google AdSense değil — sitenin kendi sistemidir. Her pozisyon bağımsız kampanya kabul eder.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
                        {AD_POSITIONS.map(pos => {
                            const activeAdsHere = ads.filter(a => a.position === pos.key && a.status === 'active');
                            const trafficColor = {
                                'Çok Yüksek': '#EF4444', 'Yüksek': '#F59E0B', 'Orta': '#3B82F6',
                                'Düşük': '#6B7280', 'Hedefli': '#8B5CF6',
                            }[pos.traffic] || '#6B7280';

                            return (
                                <div key={pos.key} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '20px', position: 'relative' }}>
                                    {activeAdsHere.length > 0 && (
                                        <div style={{ position: 'absolute', top: '14px', right: '14px', width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)' }} />
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                                        <span style={{ fontSize: '28px', flexShrink: 0 }}>{pos.icon}</span>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: 'var(--foreground)' }}>{pos.label}</h3>
                                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>{pos.page}</p>
                                        </div>
                                    </div>
                                    <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'var(--text-subtle)', lineHeight: 1.6 }}>{pos.desc}</p>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '700', background: 'var(--background)', border: '1px solid var(--border-subtle)', color: 'var(--foreground)', padding: '3px 8px', borderRadius: '6px' }}>
                                            📑 {pos.size}
                                        </span>
                                        <span style={{ fontSize: '11px', fontWeight: '700', background: `${trafficColor}15`, color: trafficColor, border: `1px solid ${trafficColor}30`, padding: '3px 8px', borderRadius: '6px' }}>
                                            📊 {pos.traffic} Trafik
                                        </span>
                                        <span style={{ fontSize: '11px', fontWeight: '700', background: activeAdsHere.length > 0 ? 'rgba(16,185,129,0.1)' : 'var(--background)', color: activeAdsHere.length > 0 ? '#10B981' : 'var(--text-muted)', border: `1px solid ${activeAdsHere.length > 0 ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`, padding: '3px 8px', borderRadius: '6px' }}>
                                            {activeAdsHere.length > 0 ? `✓ ${activeAdsHere.length} Aktif Kampanya` : '— Boş'}
                                        </span>
                                    </div>
                                    <button onClick={() => { setForm(f => ({ ...f, position: pos.key })); setTab('yeni'); }} style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', color: '#3B82F6', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                        + Bu Alana Kampanya Ekle
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/*  YENİ KAMPANYA SEKME  */}
            {tab === 'yeni' && (
                <div style={{ maxWidth: '700px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '28px' }}>
                        <h2 style={{ margin: '0 0 22px', fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Plus size={20} color="var(--primary)" /> Yeni Reklam Kampanyası
                        </h2>

                        {/* Reklamveren + Başlık */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                            <div>
                                <label style={labelStyle}>Reklamveren Firma</label>
                                <input value={form.advertiser} onChange={e => setForm(f => ({ ...f, advertiser: e.target.value }))} placeholder="Örn: Yeti Lastik A.Ş." style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Kampanya Başlığı</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Örn: Yaz Lastik Kampanyası" style={inputStyle} />
                            </div>
                        </div>

                        {/* Açıklama */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={labelStyle}>Reklam Metni / Açıklama</label>
                            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Kullanıcıya gösterilecek kısa reklam metni..." rows={2} style={{ ...textareaStyle }} />
                        </div>

                        {/* URL + Bütçe */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '14px' }}>
                            <div>
                                <label style={labelStyle}>Hedef URL</label>
                                <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://firma.com/kampanya" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Bütçe (₺)</label>
                                <input type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="5000" style={inputStyle} />
                            </div>
                        </div>

                        {/* Reklam Tipi */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={labelStyle}>Reklam Türü</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                                {AD_TYPES.map(t => (
                                    <button key={t.key} onClick={() => setForm(f => ({ ...f, type: t.key }))} style={{ padding: '10px 8px', borderRadius: '8px', border: form.type === t.key ? '2px solid var(--primary)' : '1px solid var(--border-subtle)', background: form.type === t.key ? 'rgba(59,130,246,0.07)' : 'var(--background)', color: form.type === t.key ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '11px', fontWeight: '700', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>{t.icon}</div>
                                        {t.label}<br />
                                        <span style={{ fontSize: '10px', opacity: 0.7 }}>{t.size}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pozisyon */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={labelStyle}>Reklam Pozisyonu (Slot)</label>
                            <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                                {AD_POSITIONS.map(p => (
                                    <option key={p.key} value={p.key}>{p.icon} {p.label} ({p.page} · {p.size})</option>
                                ))}
                            </select>
                        </div>

                        {/* Tarih Aralığı */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '22px' }}>
                            <div>
                                <label style={labelStyle}>Başlangıç Tarihi</label>
                                <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Bitiş Tarihi (opsiyonel)</label>
                                <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} style={inputStyle} />
                            </div>
                        </div>

                        {/* Önizleme kartı */}
                        {(form.advertiser || form.title) && (
                            <div style={{ marginBottom: '20px', padding: '14px 16px', borderRadius: '12px', background: 'var(--background)', border: '2px dashed var(--border-subtle)' }}>
                                <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Önizleme</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📑</div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '700', fontSize: '13px', color: 'var(--foreground)' }}>{form.title || 'Kampanya Başlığı'}</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{form.description || 'Reklam açıklaması'} · <span style={{ color: 'var(--primary)' }}>{form.advertiser}</span></p>
                                    </div>
                                    <span style={{ marginLeft: 'auto', fontSize: '10px', background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '2px 7px', borderRadius: '5px', fontWeight: '700' }}>Reklam</span>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setTab('kampanyalar')} style={cancelBtnStyle}>İptal</button>
                            <button onClick={handleCreate} disabled={!form.advertiser.trim() || !form.title.trim() || actionLoading} style={{ ...primaryBtnStyle, opacity: form.advertiser.trim() && form.title.trim() ? 1 : 0.4 }}>
                                {actionLoading ? 'Oluşturuluyor...' : ' Kampanyayı Oluştur & Yayına Al'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/*  DELETE MODAL  */}
            {modal?.type === 'delete' && (
                <>
                    <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, backdropFilter: 'blur(2px)' }} />
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '460px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', zIndex: 1200, padding: '28px', animation: 'popIn 0.2s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={22} color="#EF4444" /></div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--foreground)' }}>Kampanya Silinsin mi?</h3>
                                <p style={{ margin: 0, fontSize: '12px', color: '#EF4444' }}>Bu işlem geri alınamaz!</p>
                            </div>
                        </div>
                        <div style={{ background: 'var(--background)', borderRadius: '10px', padding: '14px', marginBottom: '20px', border: '1px solid var(--border-subtle)', borderLeft: '3px solid #EF4444' }}>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>{modal.ad.title}</p>
                            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>{modal.ad.advertiser} · ₺{modal.ad.budget.toLocaleString('tr-TR')} bütçe · {modal.ad.impressions.toLocaleString('tr-TR')} gösterim</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                            <button onClick={handleDelete} disabled={actionLoading} style={dangerBtnStyle}>{actionLoading ? '...' : 'Kampanyayı Sil'}</button>
                        </div>
                    </div>
                </>
            )}

            {/* Toast */}
            {toast && (
                <div style={{ position: 'fixed', bottom: '32px', right: '32px', background: toast.type === 'error' ? '#EF4444' : toast.type === 'warning' ? '#F59E0B' : '#10B981', color: 'white', padding: '14px 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', fontWeight: '600', fontSize: '14px', zIndex: 9999, animation: 'slideUp 0.3s ease', maxWidth: '360px' }}>
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
const cancelBtnStyle: React.CSSProperties = { flex: 1, padding: '13px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border-subtle)', color: 'var(--foreground)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };
const dangerBtnStyle: React.CSSProperties = { flex: 2, padding: '13px', borderRadius: '10px', background: '#EF4444', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' };
const primaryBtnStyle: React.CSSProperties = { flex: 2, padding: '13px', borderRadius: '10px', background: 'var(--primary)', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' };
