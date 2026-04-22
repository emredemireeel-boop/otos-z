"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Search, CheckCircle, X, AlertTriangle, Car, MapPin,
    ExternalLink, RefreshCw, Ban, Eye, Clock, Hash, Fuel,
    Gauge, AlertCircle, ChevronRight
} from "lucide-react";

interface LiveListing {
    id: string;
    brand: string;
    model: string;
    year: number;
    km: number;
    price: number;
    originalPrice?: number;
    fuelType?: string;
    transmission?: string;
    horsepower?: number;
    city?: string;
    district?: string;
    userName: string;
    phoneNumber: string;
    description?: string;
    createdAt: string;
    isUrgent?: boolean;
    tramerPrice?: number;
    tireCondition?: number;
    externalLink: string;
    source: string;
    status: string; // pending | approved | rejected
}

type FilterType = "hepsi" | "bekleyen" | "onaylandı" | "reddedildi";
type Modal = { type: "approve" | "reject"; listing: LiveListing } | null;

export default function AdminPazarPage() {
    const [listings, setListings] = useState<LiveListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>("hepsi");
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<string | null>(null);
    const [modal, setModal] = useState<Modal>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warning" } | null>(null);

    const showToast = (msg: string, type: "success" | "error" | "warning" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchListings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin?section=listings${search ? `&q=${search}` : ''}`);
            const data = await res.json();
            if (data.success) setListings(data.listings);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const t = setTimeout(fetchListings, 300);
        return () => clearTimeout(t);
    }, [fetchListings]);

    const apiAction = async (action: string, target: string, detail?: string) => {
        setActionLoading(true);
        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, target, detail }),
            });
            const data = await res.json();
            if (data.success) { await fetchListings(); return true; }
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!modal || modal.type !== "approve") return;
        const ok = await apiAction('approve_listing', modal.listing.id);
        if (ok) { setModal(null); showToast(`✓ İlan onaylandı: ${modal.listing.brand} ${modal.listing.model}`); }
    };

    const handleReject = async () => {
        if (!modal || modal.type !== "reject") return;
        const ok = await apiAction('reject_listing', modal.listing.id, rejectReason);
        if (ok) { setModal(null); setRejectReason(""); showToast(`İlan reddedildi.`, "error"); }
    };

    const statusStyle = (status: string) => {
        switch (status) {
            case "approved": return { bg: 'rgba(16,185,129,0.12)', color: '#10B981', label: "Onaylandı" };
            case "rejected": return { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', label: "Reddedildi" };
            default: return { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', label: "Bekliyor" };
        }
    };

    const fuelLabel = (f?: string) => {
        const map: Record<string, string> = { benzin: "Benzin", dizel: "Dizel", elektrik: "Elektrik", hibrit: "Hibrit", lpg: "LPG", "benzin-lpg": "Benzin+LPG" };
        return f ? (map[f] || f) : "-";
    };

    const transmissionLabel = (t?: string) => {
        const map: Record<string, string> = { otomatik: "Otomatik", manuel: "Manuel", dsg: "DSG", cvt: "CVT" };
        return t ? (map[t] || t) : "-";
    };

    const filtered = listings.filter(l => {
        if (filter === "bekleyen") return l.status === "pending";
        if (filter === "onaylandı") return l.status === "approved";
        if (filter === "reddedildi") return l.status === "rejected";
        return true;
    });

    const counts = {
        hepsi: listings.length,
        bekleyen: listings.filter(l => l.status === "pending").length,
        onaylandı: listings.filter(l => l.status === "approved").length,
        reddedildi: listings.filter(l => l.status === "rejected").length,
    };

    return (
        <div style={{ position: 'relative', paddingBottom: '40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px' }}>
                        Pazar İlan Yönetimi
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        Araç ilanlarını incele, onayla veya reddet · {listings.length} ilan
                    </p>
                </div>
                <button onClick={fetchListings} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                    <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} /> Yenile
                </button>
            </div>

            {/* Tabs + Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '6px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '4px' }}>
                    {([
                        { key: "hepsi", label: "Tümü" },
                        { key: "bekleyen", label: " Bekleyen" },
                        { key: "onaylandı", label: "✓ Onaylandı" },
                        { key: "reddedildi", label: "X Reddedildi" },
                    ] as { key: FilterType; label: string }[]).map(tab => (
                        <button key={tab.key} onClick={() => setFilter(tab.key)} style={{ padding: '7px 14px', borderRadius: '7px', border: 'none', background: filter === tab.key ? 'var(--primary)' : 'transparent', color: filter === tab.key ? 'white' : 'var(--text-muted)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {tab.label}
                            <span style={{ fontSize: '10px', fontWeight: '800', background: filter === tab.key ? 'rgba(255,255,255,0.25)' : 'var(--background)', padding: '1px 6px', borderRadius: '10px' }}>{counts[tab.key]}</span>
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '0 14px', height: '40px', width: '260px', gap: '8px' }}>
                    <Search size={14} style={{ color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="Marka, model, satıcı..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--foreground)', fontSize: '13px' }} />
                    {search && <button onClick={() => setSearch("")} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={13} /></button>}
                </div>
            </div>

            {/* Listings */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                    <RefreshCw size={32} style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
                    Yükleniyor...
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', color: 'var(--text-muted)' }}>
                            <Car size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                            Bu filtrede ilan bulunamadı.
                        </div>
                    )}
                    {filtered.map((listing, i) => {
                        const ss = statusStyle(listing.status);
                        const isEx = expanded === listing.id;
                        return (
                            <div key={listing.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', overflow: 'hidden', borderLeft: `4px solid ${ss.color}` }}>
                                {/* Row */}
                                <div style={{ padding: '14px 18px', display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer' }}
                                    onClick={() => setExpanded(isEx ? null : listing.id)}>

                                    {/* Araç emoji */}
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${ss.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🚗</div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--foreground)' }}>{listing.brand} {listing.model}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{listing.year}</span>
                                            {listing.isUrgent && <span style={{ fontSize: '10px', background: '#EF444420', color: '#EF4444', padding: '2px 7px', borderRadius: '10px', fontWeight: '800' }}>ACİL</span>}
                                            <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: ss.bg, color: ss.color, marginLeft: 'auto' }}>{ss.label}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>
                                                {listing.price.toLocaleString('tr-TR')} ₺
                                            </span>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Gauge size={11} />{listing.km.toLocaleString('tr-TR')} km
                                            </span>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Fuel size={11} />{fuelLabel(listing.fuelType)}
                                            </span>
                                            {listing.city && (
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <MapPin size={11} />{listing.city}
                                                </span>
                                            )}
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Satıcı: <strong>{listing.userName}</strong></span>
                                        </div>
                                    </div>

                                    <ChevronRight size={16} color="var(--text-muted)" style={{ transform: isEx ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                                </div>

                                {/* Expanded Detail */}
                                {isEx && (
                                    <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                        {/* Teknik Bilgiler */}
                                        <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                            {[
                                                { label: "Yakıt", value: fuelLabel(listing.fuelType) },
                                                { label: "Vites", value: transmissionLabel(listing.transmission) },
                                                { label: "Beygir", value: listing.horsepower ? `${listing.horsepower} HP` : "-" },
                                                { label: "Şehir", value: listing.city ? `${listing.city}${listing.district ? ' / ' + listing.district : ''}` : "-" },
                                                { label: "Tramer", value: listing.tramerPrice ? `${listing.tramerPrice.toLocaleString('tr-TR')} ₺` : "Temiz" },
                                                { label: "Lastik", value: listing.tireCondition ? `%${listing.tireCondition}` : "-" },
                                                { label: "Kaynak", value: listing.source },
                                                { label: "Tarih", value: listing.createdAt },
                                            ].map(info => (
                                                <div key={info.label} style={{ background: 'var(--background)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                                                    <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>{info.label}</p>
                                                    <p style={{ margin: '3px 0 0', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{info.value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {listing.description && (
                                            <div style={{ padding: '0 18px 14px' }}>
                                                <div style={{ background: 'var(--background)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '700' }}>Açıklama</p>
                                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--foreground)' }}>{listing.description}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Tramer uyarısı */}
                                        {listing.tramerPrice && listing.tramerPrice > 20000 && (
                                            <div style={{ margin: '0 18px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <AlertCircle size={14} color="#EF4444" />
                                                <p style={{ margin: 0, fontSize: '12px', color: '#EF4444', fontWeight: '600' }}>Yüksek tramer kaydı: {listing.tramerPrice.toLocaleString('tr-TR')} ₺</p>
                                            </div>
                                        )}

                                        {/* Aksiyonlar */}
                                        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.01)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <a href={listing.externalLink} target="_blank" rel="noopener noreferrer"
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--background)', border: '1px solid var(--border-subtle)', color: 'var(--foreground)', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }}>
                                                <ExternalLink size={13} /> Orijinal İlana Git
                                            </a>
                                            {listing.status !== "approved" && (
                                                <button onClick={() => setModal({ type: "approve", listing })}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#10B981', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                                    <CheckCircle size={13} /> Onayla
                                                </button>
                                            )}
                                            {listing.status !== "rejected" && (
                                                <button onClick={() => setModal({ type: "reject", listing })}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                                    <Ban size={13} /> Reddet
                                                </button>
                                            )}
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                                                {listing.phoneNumber}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODALS */}
            {modal && (
                <>
                    <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, backdropFilter: 'blur(2px)' }} />
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '460px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', zIndex: 1200, padding: '28px', animation: 'popIn 0.2s ease' }}>

                        {modal.type === "approve" && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={22} color="#10B981" /></div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--foreground)' }}>İlan Onaylansın mı?</h3>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#10B981', fontWeight: '600' }}>{modal.listing.brand} {modal.listing.model} {modal.listing.year}</p>
                                    </div>
                                </div>
                                <div style={{ background: 'var(--background)', borderRadius: '10px', padding: '14px', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <div><p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>FİYAT</p><p style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--primary)' }}>{modal.listing.price.toLocaleString('tr-TR')} ₺</p></div>
                                        <div><p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>KİLOMETRE</p><p style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--foreground)' }}>{modal.listing.km.toLocaleString('tr-TR')} km</p></div>
                                        <div><p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>SATICI</p><p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>{modal.listing.userName}</p></div>
                                        <div><p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>TRAMER</p><p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: modal.listing.tramerPrice && modal.listing.tramerPrice > 20000 ? '#EF4444' : '#10B981' }}>{modal.listing.tramerPrice ? `${modal.listing.tramerPrice.toLocaleString('tr-TR')} ₺` : "Temiz"}</p></div>
                                    </div>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>İlan pazarda yayına girecek ve kullanıcılara gösterilecek.</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                                    <button onClick={handleApprove} disabled={actionLoading} style={successBtnStyle}>{actionLoading ? "..." : "✓ Onayla"}</button>
                                </div>
                            </>
                        )}

                        {modal.type === "reject" && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ban size={22} color="#EF4444" /></div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--foreground)' }}>İlan Reddedilsin mi?</h3>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#EF4444', fontWeight: '600' }}>{modal.listing.brand} {modal.listing.model}</p>
                                    </div>
                                </div>
                                <label style={labelStyle}>Red Sebebi (opsiyonel)</label>
                                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Örn: Eksik bilgi, uygunsuz fiyat, sahte ilan..." rows={3} style={{ ...textareaStyle, marginBottom: '20px' }} />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                                    <button onClick={handleReject} disabled={actionLoading} style={dangerBtnStyle}>{actionLoading ? "..." : "Reddet"}</button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {toast && (
                <div style={{ position: 'fixed', bottom: '32px', right: '32px', background: toast.type === "error" ? '#EF4444' : toast.type === "warning" ? '#F59E0B' : '#10B981', color: 'white', padding: '14px 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 9999, animation: 'slideUp 0.3s ease' }}>
                    {toast.type === "error" ? <Ban size={18} /> : <CheckCircle size={18} />}
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

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' };
const textareaStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 };
const cancelBtnStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border-subtle)', color: 'var(--foreground)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };
const dangerBtnStyle: React.CSSProperties = { flex: 2, padding: '12px', borderRadius: '10px', background: '#EF4444', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' };
const successBtnStyle: React.CSSProperties = { flex: 2, padding: '12px', borderRadius: '10px', background: '#10B981', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' };
