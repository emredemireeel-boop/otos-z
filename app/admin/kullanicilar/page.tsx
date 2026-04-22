"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Search, Eye, X, CheckCircle, AlertTriangle,
    UserX, Clock, MessageSquare, Activity, Ban, Undo2, UserCheck,
    Filter, Hash, Mail, Calendar, Shield, AlertCircle, RefreshCw,
    ChevronDown, Car, Star
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

type Role = string;
type FilterType = "hepsi" | "usta" | "caylak" | "silik";

interface LiveUser {
    id: string;
    username: string;
    displayName: string;
    bio: string;
    level: string;
    reputation: number;
    joinDate: string;
    carBrand: string;
    carModel: string;
    city: string;
    avatar: string;
    badges: string[];
    email: string;
    role: Role;
    warnings: number;
    banned: boolean;
}

type ModalType =
    | { type: "ban"; user: LiveUser }
    | { type: "affet"; user: LiveUser }
    | { type: "warn"; user: LiveUser }
    | { type: "usta"; user: LiveUser }
    | { type: "caylak"; user: LiveUser }
    | null;

const BAN_DURATIONS = [
    { label: "1 Gün", value: "1g" },
    { label: "3 Gün", value: "3g" },
    { label: "1 Hafta", value: "1h" },
    { label: "1 Ay", value: "1ay" },
    { label: "3 Ay", value: "3ay" },
    { label: "Kalıcı Ban", value: "kalici" },
];

export default function AdminUsersPage() {
    const [users, setUsers] = useState<LiveUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<FilterType>("hepsi");
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warning" } | null>(null);
    const [selectedUser, setSelectedUser] = useState<LiveUser | null>(null);
    const [modal, setModal] = useState<ModalType>(null);
    const [banDuration, setBanDuration] = useState("1h");
    const [banReason, setBanReason] = useState("");
    const [warnReason, setWarnReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const showToast = (msg: string, type: "success" | "error" | "warning" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, 'users'));
            const allUsers = snap.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    username: data.username || '',
                    displayName: data.displayName || '',
                    bio: data.bio || '',
                    level: data.level || 'Yeni Uye',
                    reputation: data.reputation || 0,
                    joinDate: data.createdAt?.toDate?.() ? data.createdAt.toDate().toLocaleDateString('tr-TR') : '-',
                    carBrand: data.carBrand || '',
                    carModel: data.carModel || '',
                    city: data.city || '',
                    avatar: data.username?.charAt(0)?.toUpperCase() || 'U',
                    badges: data.badges || [],
                    email: data.email || '',
                    role: data.role || 'standard',
                    warnings: data.warnings || 0,
                    banned: data.banned || false,
                } as LiveUser;
            }).filter(u => !searchTerm || u.username.toLowerCase().includes(searchTerm.toLowerCase()) || u.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
            setUsers(allUsers);
        } catch (e) {
            console.error('Kullanicilar yuklenemedi:', e);
            showToast('Kullanicilar yuklenemedi.', 'error');
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        const t = setTimeout(fetchUsers, 300);
        return () => clearTimeout(t);
    }, [fetchUsers]);

    const apiAction = async (action: string, target: string, detail?: string, duration?: string) => {
        setActionLoading(true);
        try {
            if (action === 'ban_user') {
                await updateDoc(doc(db, 'users', target), { banned: true, role: 'banned' });
            } else if (action === 'unban_user') {
                await updateDoc(doc(db, 'users', target), { banned: false, role: 'standard', warnings: 0 });
            } else if (action === 'warn_user') {
                const u = users.find(x => x.id === target);
                await updateDoc(doc(db, 'users', target), { warnings: (u?.warnings || 0) + 1 });
            } else if (action === 'set_role') {
                await updateDoc(doc(db, 'users', target), { role: detail });
            }
            await fetchUsers();
            return true;
        } catch (e) {
            console.error('Islem hatasi:', e);
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    const applyBan = async () => {
        if (!modal || modal.type !== "ban") return;
        const ok = await apiAction('ban_user', modal.user.id, banReason, banDuration);
        if (ok) {
            setModal(null);
            setBanReason(""); setBanDuration("1h");
            setSelectedUser(null);
            showToast(banDuration === "kalici"
                ? `@${modal.user.username} kalici olarak ucuruldu.`
                : `@${modal.user.username} ${BAN_DURATIONS.find(d => d.value === banDuration)?.label} banlandi.`, "error");
        }
    };

    const applyPardon = async () => {
        if (!modal || modal.type !== "affet") return;
        const ok = await apiAction('unban_user', modal.user.id);
        if (ok) {
            setModal(null); setSelectedUser(null);
            showToast(`@${modal.user.username} affedildi.`);
        }
    };

    const applyWarn = async () => {
        if (!modal || modal.type !== "warn") return;
        const ok = await apiAction('warn_user', modal.user.id, warnReason);
        if (ok) {
            setModal(null); setWarnReason("");
            showToast(`@${modal.user.username} kullanicisina uyari verildi.`, "warning");
        }
    };

    const applyRole = async (action: "usta" | "caylak") => {
        if (!modal) return;
        const user = (modal as any).user as LiveUser;
        const newRole = action === "usta" ? "usta" : "caylak";
        const displayRole = action === "usta" ? "Usta" : "Caylak";
        const ok = await apiAction('set_role', user.id, newRole);
        if (ok) {
            setModal(null); setSelectedUser(null);
            showToast(`@${user.username} → ${displayRole} yapildi!`);
        }
    };

    const getRoleStyle = (u: LiveUser) => {
        if (u.banned) return { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', label: 'Ban’lı' };
        switch (u.role) {
            case 'usta':      return { bg: 'rgba(139,92,246,0.12)',  color: '#8B5CF6', label: 'Usta' };
            case 'moderator': return { bg: 'rgba(59,130,246,0.12)',  color: '#3B82F6', label: 'Modöratör' };
            case 'admin':     return { bg: 'rgba(239,68,68,0.12)',   color: '#EF4444', label: 'Admin' };
            default:          return { bg: 'rgba(245,158,11,0.12)',  color: '#F59E0B', label: 'Caylak' };
        }
    };

    const filtered = users.filter(u => {
        if (filter === "usta") return !u.banned && (u.role === "usta" || u.role === "moderator" || u.role === "admin");
        if (filter === "caylak") return !u.banned && (!u.role || u.role === "caylak" || u.role === "standard" || u.role === "cirak");
        if (filter === "silik") return u.banned;
        return true;
    });

    const counts = {
        hepsi: users.length,
        usta: users.filter(u => !u.banned && (u.role === "usta" || u.role === "moderator" || u.role === "admin")).length,
        caylak: users.filter(u => !u.banned && (!u.role || u.role === "caylak" || u.role === "standard" || u.role === "cirak")).length,
        silik: users.filter(u => u.banned).length,
    };

    return (
        <div style={{ position: 'relative', paddingBottom: '40px' }}>
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px' }}>
                            Kullanıcı Yönetimi
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                            Gerçek platform kullanıcıları · {users.length} kayıt
                        </p>
                    </div>
                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                    >
                        <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
                        Yenile
                    </button>
                </div>
            </div>

            {/* Filter Tabs + Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '6px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '4px' }}>
                    {([
                        { key: "hepsi", label: "Tümü" },
                        { key: "usta", label: "Usta" },
                        { key: "caylak", label: "Caylak" },
                        { key: "silik", label: "Ban'lı" },
                    ] as { key: FilterType; label: string }[]).map(tab => (
                        <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
                            padding: '7px 14px', borderRadius: '7px', border: 'none',
                            background: filter === tab.key ? 'var(--primary)' : 'transparent',
                            color: filter === tab.key ? 'white' : 'var(--text-muted)',
                            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                            {tab.label}
                            <span style={{ fontSize: '10px', fontWeight: '800', background: filter === tab.key ? 'rgba(255,255,255,0.25)' : 'var(--background)', padding: '1px 6px', borderRadius: '10px' }}>
                                {counts[tab.key]}
                            </span>
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '0 14px', height: '42px', width: '280px', gap: '8px' }}>
                    <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input type="text" placeholder="İsim, kullanıcı adı..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--foreground)', fontSize: '13px' }} />
                    {searchTerm && <button onClick={() => setSearchTerm("")} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={14} /></button>}
                </div>
            </div>

            {/* Table */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <RefreshCw size={32} style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
                        Yükleniyor...
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)' }}>
                                {["Kullanıcı", "Araç", "Şehir", "İtibar", "Statü", "Uyarı", "İşlemler"].map((h, i) => (
                                    <th key={h} style={{ textAlign: i === 6 ? 'right' : 'left', padding: '12px 16px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>Sonuç bulunamadı.</td></tr>
                            )}
                            {filtered.map((u, i) => {
                                const rs = getRoleStyle(u);
                                return (
                                    <tr key={u.id} style={{ borderBottom: i !== filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: u.banned ? 'rgba(239,68,68,0.02)' : 'transparent' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.015)'}
                                        onMouseLeave={e => e.currentTarget.style.background = u.banned ? 'rgba(239,68,68,0.02)' : 'transparent'}
                                    >
                                        {/* Kullanıcı */}
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: u.banned ? '#EF4444' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                                                    {u.banned ? "X" : u.avatar}
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: '700', fontSize: '13px', color: u.banned ? '#EF4444' : 'var(--foreground)' }}>@{u.username}</p>
                                                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-subtle)' }}>{u.displayName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Araç */}
                                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                            {u.carBrand} {u.carModel}
                                        </td>
                                        {/* Şehir */}
                                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                            {u.city}
                                        </td>
                                        {/* İtibar */}
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Star size={11} color="#F59E0B" fill="#F59E0B" />
                                                {u.reputation.toLocaleString('tr-TR')}
                                            </span>
                                        </td>
                                        {/* Statü */}
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: rs.bg, color: rs.color }}>{rs.label}</span>
                                        </td>
                                        {/* Uyarı */}
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: u.warnings === 0 ? 'var(--text-subtle)' : u.warnings >= 3 ? '#EF4444' : '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {u.warnings > 0 && <AlertTriangle size={12} />}{u.warnings}
                                            </span>
                                        </td>
                                        {/* İşlemler */}
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                                                <button onClick={() => setSelectedUser(u)} style={smBtn}>
                                                    <Eye size={12} /> İncele
                                                </button>
                                                {!u.banned ? (
                                                    <>
                                                        <button onClick={() => setModal({ type: "warn", user: u })} style={{ ...smBtn, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}>
                                                            <AlertTriangle size={12} /> Uyar
                                                        </button>
                                                        <button onClick={() => setModal({ type: "ban", user: u })} style={{ ...smBtn, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>
                                                            <Ban size={12} /> Uçur
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => setModal({ type: "affet", user: u })} style={{ ...smBtn, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}>
                                                        <Undo2 size={12} /> Affet
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* —— Detay Drawer —— */}
            {selectedUser && (
                <>
                    <div onClick={() => setSelectedUser(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }} />
                    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '460px', backgroundColor: 'var(--card-bg)', borderLeft: '1px solid var(--card-border)', boxShadow: '-16px 0 48px rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.25s ease' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>@{selectedUser.username}</h2>
                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{selectedUser.displayName} · {selectedUser.level}</p>
                            </div>
                            <button onClick={() => setSelectedUser(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                            {/* Avatar + Profil */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                                    {selectedUser.avatar}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--foreground)' }}>@{selectedUser.username}</h3>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{selectedUser.bio}</p>
                                    <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                                        {selectedUser.badges.map(b => (
                                            <span key={b} style={{ fontSize: '10px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '2px 7px', borderRadius: '10px', fontWeight: '600' }}>{b}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                {[
                                    { label: "Katılım", value: selectedUser.joinDate, icon: <Calendar size={12} /> },
                                    { label: "Şehir", value: selectedUser.city, icon: <Shield size={12} /> },
                                    { label: "Araç", value: `${selectedUser.carBrand} ${selectedUser.carModel}`, icon: <Car size={12} /> },
                                    { label: "İtibar", value: selectedUser.reputation.toLocaleString('tr-TR'), icon: <Star size={12} /> },
                                    { label: "Seviye", value: selectedUser.level, icon: <Hash size={12} /> },
                                    { label: "Uyarı", value: `${selectedUser.warnings} uyarı`, icon: <AlertTriangle size={12} />, danger: selectedUser.warnings > 0 },
                                ].map(info => (
                                    <div key={info.label} style={{ background: 'var(--background)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                            {info.icon}
                                            <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{info.label}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: (info as any).danger ? '#EF4444' : 'var(--foreground)' }}>{info.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Aksiyonlar */}
                            <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Aksiyonlar</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {!selectedUser.banned && selectedUser.role !== 'usta' && selectedUser.role !== 'moderator' && (
                                    <ActionBtn color="#8B5CF6" label="★ Usta Yap" desc="Uzman olarak ata" onClick={() => setModal({ type: "usta", user: selectedUser })} />
                                )}
                                {!selectedUser.banned && (selectedUser.role === 'usta') && (
                                    <ActionBtn color="#F59E0B" label="↓ Caylak Yap" desc="Yetkileri geri al" onClick={() => setModal({ type: "caylak", user: selectedUser })} />
                                )}
                                {!selectedUser.banned && (
                                    <ActionBtn color="#F59E0B" label={`⚠ Uyarı Ver (${selectedUser.warnings}/3)`} desc="Kural ihlali bildirimi" onClick={() => setModal({ type: "warn", user: selectedUser })} />
                                )}
                                {!selectedUser.banned ? (
                                    <ActionBtn color="#EF4444" label="✕ Uçur / Ban" desc="Geçici veya kalıcı ban" onClick={() => setModal({ type: "ban", user: selectedUser })} />
                                ) : (
                                    <ActionBtn color="#10B981" label="→ Affet" desc="Ban kaldır, Caylak yap" onClick={() => setModal({ type: "affet", user: selectedUser })} />
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* —— MODALS —— */}
            {modal && (
                <>
                    <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, backdropFilter: 'blur(2px)' }} />
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '460px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', zIndex: 1200, padding: '28px', animation: 'popIn 0.2s ease' }}>

                        {/* BAN */}
                        {modal.type === "ban" && (
                            <>
                                <ModalHeader icon={<Ban size={22} color="#EF4444" />} iconBg="rgba(239,68,68,0.1)" title="Kullanıcı Uçurulsun mu?" sub={`@${modal.user.username} · ${modal.user.displayName}`} />
                                <label style={labelStyle}>Ban Süresi</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                                    {BAN_DURATIONS.map(d => (
                                        <button key={d.value} onClick={() => setBanDuration(d.value)} style={{ padding: '10px 6px', borderRadius: '8px', border: banDuration === d.value ? '2px solid #EF4444' : '1px solid var(--border-subtle)', background: banDuration === d.value ? 'rgba(239,68,68,0.1)' : 'var(--background)', color: banDuration === d.value ? '#EF4444' : 'var(--foreground)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                                <label style={labelStyle}>Ban Nedeni (zorunlu)</label>
                                <textarea value={banReason} onChange={e => setBanReason(e.target.value)} placeholder="Örn: Kural ihlali, trollük, spam..." rows={3} style={{ ...textareaStyle, marginBottom: '16px' }} />
                                {banDuration === "kalici" && (
                                    <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', gap: '10px' }}>
                                        <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                                        <p style={{ margin: 0, fontSize: '12px', color: '#EF4444', fontWeight: '600' }}>Kalıcı ban! Hesap tamamen erişime kapatılacak.</p>
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                                    <button onClick={applyBan} disabled={!banReason.trim() || actionLoading} style={{ ...dangerBtnStyle, opacity: banReason.trim() ? 1 : 0.4 }}>
                                        {actionLoading ? "İşleniyor..." : banDuration === "kalici" ? "Kalıcı Uçur" : `${BAN_DURATIONS.find(d => d.value === banDuration)?.label} Süreyle Ban`}
                                    </button>
                                </div>
                            </>
                        )}

                        {modal.type === "affet" && (
                            <>
                                <ModalHeader icon={<Undo2 size={22} color="#10B981" />} iconBg="rgba(16,185,129,0.1)" title="Affedilsin mi?" sub={`@${modal.user.username}`} />
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                                    Ban kaldırılacak, <strong>Caylak</strong> yapılacak ve uyarılar sıfırlanacak. Emin misiniz?
                                </p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                                    <button onClick={applyPardon} disabled={actionLoading} style={successBtnStyle}>{actionLoading ? "..." : "Affet"}</button>
                                </div>
                            </>
                        )}

                        {modal.type === "warn" && (
                            <>
                                <ModalHeader icon={<AlertTriangle size={22} color="#F59E0B" />} iconBg="rgba(245,158,11,0.1)" title={`Uyarı Ver (${modal.user.warnings}/3)`} sub={`@${modal.user.username}`} />
                                <label style={labelStyle}>Uyarı Sebebi</label>
                                <textarea value={warnReason} onChange={e => setWarnReason(e.target.value)} placeholder="Örn: Hakaret içeren yorum yaptı..." rows={3} style={{ ...textareaStyle, marginBottom: '16px' }} />
                                {modal.user.warnings >= 2 && (
                                    <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '16px', display: 'flex', gap: '10px' }}>
                                        <AlertCircle size={15} color="#EF4444" style={{ flexShrink: 0 }} />
                                        <p style={{ margin: 0, fontSize: '12px', color: '#EF4444' }}>3. uyarıyla ban uygulamayı değerlendirin.</p>
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                                    <button onClick={applyWarn} disabled={actionLoading} style={warnBtnStyle}>{actionLoading ? "..." : "Uyarıyı Gönder"}</button>
                                </div>
                            </>
                        )}

                        {(modal.type === "usta" || modal.type === "caylak") && (
                            <>
                                <ModalHeader
                                    icon={
                                        modal.type === "usta"  ? <UserCheck size={22} color="#8B5CF6" /> :
                                        <UserX size={22} color="#F59E0B" />
                                    }
                                    iconBg={
                                        modal.type === "usta"  ? "rgba(139,92,246,0.1)" :
                                        "rgba(245,158,11,0.1)"
                                    }
                                    title={
                                        modal.type === "usta"  ? "Usta Yap" :
                                        "Caylak Yap"
                                    }
                                    sub={`@${(modal as any).user.username}`}
                                />
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                                    {modal.type === "usta"
                                        ? "Bu kullanıcı Usta statüsüne yükseltilecek ve uzman rozetini alacak."
                                        : "Bu kullanıcının yetkileri kısıtlanacak, Çaylak yapılacak."
                                    }
                                </p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                                    <button onClick={() => applyRole(modal.type as "usta" | "caylak")} disabled={actionLoading}
                                        style={modal.type === "usta" ? ustaBtnStyle : warnBtnStyle}>
                                        {actionLoading ? "..." :
                                            modal.type === "usta"  ? "Usta Yap" :
                                            "Caylak Yap"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* Toast */}
            {toast && (
                <div style={{ position: 'fixed', bottom: '32px', right: '32px', background: toast.type === "error" ? '#EF4444' : toast.type === "warning" ? '#F59E0B' : '#10B981', color: 'white', padding: '14px 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 9999, animation: 'slideUp 0.3s ease' }}>
                    {toast.type === "error" ? <Ban size={18} /> : toast.type === "warning" ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                    {toast.msg}
                </div>
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideUp { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
                @keyframes popIn { from { transform: translate(-50%,-50%) scale(0.9); opacity: 0; } to { transform: translate(-50%,-50%) scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}

function ActionBtn({ color, label, desc, onClick }: { color: string; label: string; desc: string; onClick: () => void }) {
    return (
        <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${color}0D`, border: `1px solid ${color}33`, padding: '12px 16px', borderRadius: '10px', color, fontSize: '13px', fontWeight: '700', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${color}1A`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${color}0D`; }}>
            <span>{label}</span>
            <span style={{ fontSize: '11px', opacity: 0.7, fontWeight: '500' }}>{desc}</span>
        </button>
    );
}

function ModalHeader({ icon, iconBg, title, sub }: { icon: React.ReactNode; iconBg: string; title: string; sub: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
            <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--foreground)' }}>{title}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>{sub}</p>
            </div>
        </div>
    );
}

const smBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--background)', border: '1px solid var(--border-subtle)', color: 'var(--foreground)', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' };
const textareaStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 };
const cancelBtnStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border-subtle)', color: 'var(--foreground)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };
const dangerBtnStyle: React.CSSProperties = { flex: 2, padding: '12px', borderRadius: '10px', background: '#EF4444', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' };
const successBtnStyle: React.CSSProperties = { flex: 2, padding: '12px', borderRadius: '10px', background: '#10B981', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' };
const ustaBtnStyle: React.CSSProperties = { flex: 2, padding: '12px', borderRadius: '10px', background: '#8B5CF6', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' };
const warnBtnStyle: React.CSSProperties = { flex: 2, padding: '12px', borderRadius: '10px', background: '#F59E0B', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' };
