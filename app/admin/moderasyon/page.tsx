"use client";

import { useState, useEffect, useCallback } from "react";
import {
    BookOpen, Search, AlertTriangle, CheckCircle, ChevronRight, X,
    UserCheck, Shield, Star, Activity, Edit3
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

type Role = "caylak" | "cirak" | "uzman" | "usta" | "moderator" | "admin" | "standard";

interface LiveUser {
    id: string;
    username: string;
    displayName: string;
    email: string;
    role: Role;
    entryCount: number;
    avatar: string;
}

const ROLES = [
    { id: "caylak", label: "Çaylak", color: "#888" },
    { id: "cirak", label: "Çırak", color: "#4FACFE" },
    { id: "uzman", label: "Uzman", color: "#F59E0B" },
    { id: "usta", label: "Usta", color: "#22c55e" },
];

export default function DictionaryManagementPage() {
    const [users, setUsers] = useState<LiveUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("hepsi");
    const [selectedUser, setSelectedUser] = useState<LiveUser | null>(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
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
                    email: data.email || '',
                    role: data.role || 'caylak',
                    entryCount: data.entryCount || 0,
                    avatar: data.username?.charAt(0)?.toUpperCase() || 'U',
                } as LiveUser;
            });
            // Sadece sözlük yazarlarıyla ilgilendiğimiz için admin/moderatör harici tümünü alalım (veya hepsini gösterelim)
            setUsers(allUsers);
        } catch (e) {
            console.error('Kullanıcılar yüklenemedi:', e);
            showToast('Veriler yüklenemedi.', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleUpdate = async (userId: string, newRole: Role, roleLabel: string) => {
        if (saving) return;
        setSaving(true);
        try {
            // Firebase Update
            await updateDoc(doc(db, "users", userId), { role: newRole });
            // Local state update
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            if (selectedUser?.id === userId) {
                setSelectedUser({ ...selectedUser, role: newRole });
            }
            showToast(`Kullanıcı başarıyla "${roleLabel}" yapıldı.`, "success");
        } catch (error) {
            console.error("Rol güncellenirken hata:", error);
            showToast("Rol güncellenemedi.", "error");
        } finally {
            setSaving(false);
        }
    };

    const filtered = users.filter(u => {
        const matchSearch = !search || u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === "hepsi" || u.role === filterRole;
        return matchSearch && matchRole;
    });

    const getRoleInfo = (r: string) => {
        return ROLES.find(x => x.id === r) || { label: r, color: "#6B7280" };
    };

    return (
        <div style={{ paddingBottom: '40px' }}>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
                    padding: '14px 24px', borderRadius: '12px',
                    background: toast.type === 'success' ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)',
                    color: 'white', fontSize: '14px', fontWeight: '600',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    animation: 'slideIn 0.3s ease',
                }}>
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <BookOpen size={28} color="#8B5CF6" /> Sözlük Yönetimi (Yazar Onay)
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        Yazarların seviyelerini (Çırak, Uzman, Usta) belirle ve başvuruları incele. Toplam {users.length} kullanıcı.
                    </p>
                </div>
            </div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Kullanıcı ara..."
                        style={{ width: '100%', padding: '12px 16px 12px 40px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }} />
                </div>
                <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
                    style={{ padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontSize: '13px', outline: 'none' }}>
                    <option value="hepsi">Tüm Rütbeler</option>
                    {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                {ROLES.map(role => {
                    const count = users.filter(u => u.role === role.id).length;
                    return (
                        <div key={role.id} onClick={() => setFilterRole(filterRole === role.id ? 'hepsi' : role.id)} style={{
                            background: filterRole === role.id ? `${role.color}15` : 'var(--card-bg)',
                            border: filterRole === role.id ? `1px solid ${role.color}60` : '1px solid var(--card-border)',
                            borderRadius: '12px', padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: filterRole === role.id ? role.color : 'var(--foreground)' }}>{count}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>{role.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content: List + Detail */}
            <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 400px' : '1fr', gap: '20px', alignItems: 'start' }}>
                {/* Users List */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <div style={{ width: 40, height: 40, border: '3px solid var(--card-border)', borderTop: '3px solid #8B5CF6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Kullanıcılar yükleniyor...</p>
                    </div>
                ) : (
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>{filtered.length} sonuç</span>
                            {selectedUser && (
                                <span style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: '600' }}>İnceleme paneli açık</span>
                            )}
                        </div>
                        {filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                <UserCheck size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                                <p>Kullanıcı bulunamadı</p>
                            </div>
                        ) : (
                            <div>
                                {filtered.map((u, i) => {
                                    const isSelected = selectedUser?.id === u.id;
                                    const rInfo = getRoleInfo(u.role);
                                    return (
                                        <div key={u.id} onClick={() => setSelectedUser(isSelected ? null : u)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '14px',
                                                padding: '14px 20px',
                                                borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                                cursor: 'pointer', transition: 'all 0.15s',
                                                background: isSelected ? 'rgba(139,92,246,0.08)' : 'transparent',
                                                borderLeft: isSelected ? '3px solid #8B5CF6' : '3px solid transparent',
                                            }}
                                            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--secondary)'; }}
                                            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: `${rInfo.color}18`, color: rInfo.color,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '16px', fontWeight: '800', flexShrink: 0,
                                                border: `1px solid ${rInfo.color}30`,
                                            }}>{u.avatar}</div>
                                            
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '3px' }}>@{u.username}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.entryCount} Entry</div>
                                            </div>

                                            <span style={{
                                                fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px',
                                                background: `${rInfo.color}15`, color: rInfo.color, flexShrink: 0, border: `1px solid ${rInfo.color}30`,
                                                textTransform: 'uppercase'
                                            }}>
                                                {rInfo.label}
                                            </span>

                                            <button style={{
                                                padding: '6px 12px', borderRadius: '6px', background: '#8B5CF6', color: 'white',
                                                border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer'
                                            }}>
                                                İncele
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Detail Panel */}
                {selectedUser && (
                    <div style={{
                        position: 'sticky', top: '96px',
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '16px', overflow: 'hidden',
                    }}>
                        {/* Detail Header */}
                        <div style={{
                            padding: '20px', borderBottom: '1px solid var(--card-border)',
                            background: `linear-gradient(135deg, ${getRoleInfo(selectedUser.role).color}10, transparent)`,
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: `${getRoleInfo(selectedUser.role).color}18`,
                                    border: `2px solid ${getRoleInfo(selectedUser.role).color}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '28px', fontWeight: '800', color: getRoleInfo(selectedUser.role).color,
                                }}>{selectedUser.avatar}</div>
                                <button onClick={() => setSelectedUser(null)} style={{
                                    background: 'var(--secondary)', border: '1px solid var(--card-border)',
                                    borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-muted)',
                                }}><X size={16} /></button>
                            </div>
                            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px' }}>
                                @{selectedUser.username}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>{selectedUser.email}</p>
                            
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700',
                                background: `${getRoleInfo(selectedUser.role).color}15`,
                                color: getRoleInfo(selectedUser.role).color,
                                border: `1px solid ${getRoleInfo(selectedUser.role).color}30`,
                                textTransform: 'uppercase'
                            }}>
                                <Shield size={12} /> Mevcut Rütbe: {getRoleInfo(selectedUser.role).label}
                            </span>
                        </div>

                        {/* Detail Body */}
                        <div style={{ padding: '20px' }}>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', background: 'var(--secondary)', padding: '12px', borderRadius: '10px' }}>
                                <Activity size={16} color="#8B5CF6" />
                                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>Toplam {selectedUser.entryCount} Entry Girdi</span>
                            </div>

                            <h3 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Rütbe İşlemleri</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button 
                                    disabled={saving || selectedUser.role === 'caylak'}
                                    onClick={() => handleRoleUpdate(selectedUser.id, 'caylak', 'Çaylak')}
                                    style={{
                                        padding: '12px', background: 'rgba(100,100,100,0.1)', border: '1px solid rgba(100,100,100,0.3)',
                                        borderRadius: '10px', color: '#888', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '13px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    }}>
                                    Çaylak Bırak
                                </button>
                                
                                <button 
                                    disabled={saving || selectedUser.role === 'cirak'}
                                    onClick={() => handleRoleUpdate(selectedUser.id, 'cirak', 'Çırak')}
                                    style={{
                                        padding: '12px', background: 'rgba(79,172,254,0.1)', border: '1px solid rgba(79,172,254,0.3)',
                                        borderRadius: '10px', color: '#4FACFE', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '13px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    }}>
                                    Çırak Yap
                                </button>
                                
                                <button 
                                    disabled={saving || selectedUser.role === 'uzman'}
                                    onClick={() => handleRoleUpdate(selectedUser.id, 'uzman', 'Uzman')}
                                    style={{
                                        padding: '12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                                        borderRadius: '10px', color: '#F59E0B', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '13px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    }}>
                                    <Star size={14} /> Uzman Yap
                                </button>
                                
                                <button 
                                    disabled={saving || selectedUser.role === 'usta'}
                                    onClick={() => handleRoleUpdate(selectedUser.id, 'usta', 'Usta')}
                                    style={{
                                        padding: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                                        borderRadius: '10px', color: '#22c55e', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '13px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    }}>
                                    <Shield size={14} /> Usta Yap
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
