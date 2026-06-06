"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Shield, Plus, Trash2, CheckCircle, Clock, X, User,
    Activity, Search, UserPlus, ShieldCheck, ShieldOff, RefreshCw
} from "lucide-react";
import { adminGet, adminPost } from "@/lib/adminFetch";

interface Mod {
    id: string;
    username: string;
    displayName: string;
    email: string;
    role: string;
    banned: boolean;
    createdAt: string;
}

interface SearchUser {
    id: string;
    username: string;
    displayName: string;
    email: string;
    role: string;
}

export default function AdminModeratorlerPage() {
    const [mods, setMods] = useState<Mod[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Moderatör ekleme (kullanıcı arama)
    const [showAdd, setShowAdd] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
    const [searching, setSearching] = useState(false);

    const showToast = (msg: string, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchMods = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminGet("moderators");
            if (res.success) setMods(res.moderators || []);
        } catch (e) {
            console.error("Moderatörler yuklenemedi:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMods(); }, [fetchMods]);

    const searchUsers = async () => {
        if (!searchTerm.trim()) return;
        setSearching(true);
        try {
            const res = await adminGet("users", { q: searchTerm.trim() });
            if (res.success) {
                // Zaten moderatör/admin olmayanları göster
                setSearchResults((res.users || []).filter((u: SearchUser) => u.role !== "moderator" && u.role !== "admin"));
            }
        } catch {
            showToast("Arama başarısız.", "error");
        } finally {
            setSearching(false);
        }
    };

    const makeModerator = async (userId: string, username: string) => {
        if (actionLoading) return;
        setActionLoading(true);
        try {
            const res = await adminPost({ action: "add_moderator", target: userId });
            if (res.success) {
                showToast(`✓ @${username} moderatör yapıldı.`);
                setShowAdd(false); setSearchTerm(""); setSearchResults([]);
                await fetchMods();
            } else showToast(res.message || "İşlem başarısız.", "error");
        } catch { showToast("İşlem başarısız.", "error"); }
        finally { setActionLoading(false); }
    };

    const removeModerator = async (userId: string, username: string) => {
        if (actionLoading) return;
        setActionLoading(true);
        try {
            const res = await adminPost({ action: "remove_moderator", target: userId });
            if (res.success) {
                showToast(`@${username} moderatörlükten çıkarıldı.`, "warning");
                await fetchMods();
            } else showToast(res.message || "İşlem başarısız.", "error");
        } catch { showToast("İşlem başarısız.", "error"); }
        finally { setActionLoading(false); }
    };

    const moderatorList = mods.filter(m => m.role === "moderator");
    const adminList = mods.filter(m => m.role === "admin");

    return (
        <div style={{ position: "relative", paddingBottom: "40px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <ShieldCheck size={24} color="#8B5CF6" /> Moderatörler
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                        Kullanıcıları moderatör olarak ata veya moderatörlüğü kaldır
                    </p>
                </div>
                <button onClick={() => setShowAdd(v => !v)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--primary)", border: "none", color: "white", padding: "11px 18px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>
                    <UserPlus size={15} /> Moderatör Ata
                </button>
            </div>

            {/* İstatistik kartları */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "22px" }}>
                {[
                    { label: "Moderatör", val: moderatorList.length, color: "#8B5CF6", icon: <ShieldCheck size={18} /> },
                    { label: "Admin", val: adminList.length, color: "#EF4444", icon: <Shield size={18} /> },
                    { label: "Toplam Yetkili", val: mods.length, color: "#10B981", icon: <Activity size={18} /> },
                ].map(s => (
                    <div key={s.label} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${s.color}15`, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon}</div>
                        <div>
                            <p style={{ margin: "0 0 2px", fontSize: "22px", fontWeight: "900", color: "var(--foreground)" }}>{s.val}</p>
                            <p style={{ margin: 0, fontSize: "11px", fontWeight: "600", color: "var(--text-muted)" }}>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Moderatör Atama Paneli */}
            {showAdd && (
                <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "20px", marginBottom: "20px", borderLeft: "4px solid var(--primary)" }}>
                    <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "800", color: "var(--foreground)" }}>Kullanıcı Ara ve Moderatör Yap</h3>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
                        <div style={{ flex: 1, display: "flex", alignItems: "center", background: "var(--background)", border: "1px solid var(--border-subtle)", borderRadius: "9px", padding: "0 12px", height: "42px", gap: "8px" }}>
                            <Search size={15} color="var(--text-muted)" />
                            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === "Enter" && searchUsers()} placeholder="Kullanıcı adı veya isim..."
                                style={{ border: "none", background: "transparent", outline: "none", width: "100%", color: "var(--foreground)", fontSize: "13px" }} />
                        </div>
                        <button onClick={searchUsers} disabled={searching} style={{ padding: "0 20px", borderRadius: "9px", background: "var(--primary)", border: "none", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                            {searching ? "Aranıyor..." : "Ara"}
                        </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "320px", overflowY: "auto" }}>
                        {searchResults.map(u => (
                            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: "var(--background)", border: "1px solid var(--border-subtle)" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(139,92,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B5CF6", flexShrink: 0 }}>
                                    <User size={16} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>{u.displayName || u.username}</p>
                                    <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)" }}>@{u.username} · {u.email}</p>
                                </div>
                                <button onClick={() => makeModerator(u.id, u.username)} disabled={actionLoading} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.08)", color: "#8B5CF6", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                                    <ShieldCheck size={13} /> Moderatör Yap
                                </button>
                            </div>
                        ))}
                        {searchTerm && !searching && searchResults.length === 0 && (
                            <p style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "13px" }}>Uygun kullanıcı bulunamadı.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Yetkili Listesi */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                    <RefreshCw size={28} style={{ margin: "0 auto 10px", display: "block", opacity: 0.4, animation: "spin 0.8s linear infinite" }} />
                    Yükleniyor...
                </div>
            ) : mods.length === 0 ? (
                <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "60px 24px", textAlign: "center" }}>
                    <ShieldCheck size={40} style={{ margin: "0 auto 14px", display: "block", opacity: 0.3 }} />
                    <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "800", color: "var(--foreground)" }}>Henüz moderatör yok</h3>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>"Moderatör Ata" ile bir kullanıcıya moderatör yetkisi verebilirsiniz.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {mods.map(m => {
                        const isAdmin = m.role === "admin";
                        const color = isAdmin ? "#EF4444" : "#8B5CF6";
                        return (
                            <div key={m.id} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "16px 20px", display: "flex", gap: "14px", alignItems: "center", borderLeft: `4px solid ${color}` }}>
                                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
                                    {isAdmin ? <Shield size={20} /> : <ShieldCheck size={20} />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                                        <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--foreground)" }}>{m.displayName || m.username}</span>
                                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>@{m.username}</span>
                                        <span style={{ fontSize: "10px", fontWeight: "700", background: `${color}15`, color, padding: "2px 8px", borderRadius: "6px" }}>
                                            {isAdmin ? "ADMIN" : "MODERATÖR"}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: "11px", color: "var(--text-subtle)" }}>{m.email} · Üyelik: {m.createdAt}</span>
                                </div>
                                {!isAdmin && (
                                    <button onClick={() => removeModerator(m.id, m.username)} disabled={actionLoading} title="Moderatörlükten çıkar"
                                        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", color: "#EF4444", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                                        <ShieldOff size={14} /> Çıkar
                                    </button>
                                )}
                                {isAdmin && (
                                    <span style={{ fontSize: "11px", color: "var(--text-subtle)", fontStyle: "italic" }}>Admin korumalı</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {toast && (
                <div style={{ position: "fixed", bottom: "32px", right: "32px", background: toast.type === "error" ? "#EF4444" : toast.type === "warning" ? "#F59E0B" : "#10B981", color: "white", padding: "14px 20px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", fontWeight: "600", fontSize: "14px", zIndex: 9999, animation: "slideUp 0.3s ease" }}>
                    {toast.msg}
                </div>
            )}
            <style>{`
                @keyframes slideUp { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
