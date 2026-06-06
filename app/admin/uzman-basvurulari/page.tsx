"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Briefcase, CheckCircle, XCircle, Clock, Search, Store,
    Wrench, Car, Shield, Phone, MapPin, FileText, User, ChevronRight, RefreshCw
} from "lucide-react";
import { adminGet, adminPost } from "@/lib/adminFetch";

interface ExpertApp {
    id: string;
    userId: string;
    username: string;
    profession: string;
    professionTitle: string;
    fullName: string;
    phone: string;
    city: string;
    experience: string;
    businessName: string;
    businessAddress: string;
    message: string;
    documents: string[];
    status: "bekliyor" | "onaylandi" | "reddedildi";
    adminNote?: string;
    createdAt: string;
}

const PROF_ICONS: Record<string, React.ReactNode> = {
    dealer: <Store size={18} />,
    mechanic: <Wrench size={18} />,
    expert: <Car size={18} />,
    traffic: <Shield size={18} />,
};

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
    bekliyor: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", label: "Bekliyor", icon: <Clock size={12} /> },
    onaylandi: { bg: "rgba(16,185,129,0.1)", color: "#10B981", label: "Onaylandı", icon: <CheckCircle size={12} /> },
    reddedildi: { bg: "rgba(239,68,68,0.1)", color: "#EF4444", label: "Reddedildi", icon: <XCircle size={12} /> },
};

export default function AdminUzmanBasvurulariPage() {
    const [apps, setApps] = useState<ExpertApp[]>([]);
    const [counts, setCounts] = useState({ total: 0, bekliyor: 0, onaylandi: 0, reddedildi: 0 });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("bekliyor");
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<string | null>(null);
    const [modal, setModal] = useState<{ type: "approve" | "reject"; app: ExpertApp } | null>(null);
    const [note, setNote] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null);

    const showToast = (msg: string, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchApps = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminGet("expert_applications", statusFilter !== "all" ? { status: statusFilter } : undefined);
            if (res.success) {
                setApps(res.applications || []);
                setCounts(res.counts || { total: 0, bekliyor: 0, onaylandi: 0, reddedildi: 0 });
            }
        } catch (e) {
            console.error("Başvurular yüklenemedi:", e);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => { fetchApps(); }, [fetchApps]);

    const handleAction = async () => {
        if (!modal || actionLoading) return;
        setActionLoading(true);
        const { type, app } = modal;
        try {
            const res = await adminPost({
                action: type === "approve" ? "approve_expert" : "reject_expert",
                target: app.id,
                detail: JSON.stringify({ userId: app.userId, note }),
            });
            if (res.success) {
                showToast(type === "approve" ? `✓ @${app.username} uzman yapıldı!` : `@${app.username} başvurusu reddedildi.`, type === "approve" ? "success" : "warning");
                setModal(null); setNote("");
                await fetchApps();
            } else {
                showToast(res.message || "İşlem başarısız.", "error");
            }
        } catch {
            showToast("İşlem başarısız.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const filtered = apps.filter(a => !search ||
        a.username.toLowerCase().includes(search.toLowerCase()) ||
        a.fullName.toLowerCase().includes(search.toLowerCase()) ||
        a.city.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ position: "relative", paddingBottom: "40px" }}>
            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Briefcase size={24} color="#8B5CF6" /> Uzman Başvuruları
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                    Belgelerini sunan kullanıcıları inceleyip onaylı uzman yapın
                </p>
            </div>

            {/* İstatistik */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "20px" }}>
                {[
                    { label: "Toplam", val: counts.total, color: "#6B7280", icon: <Briefcase size={18} /> },
                    { label: "Bekliyor", val: counts.bekliyor, color: "#F59E0B", icon: <Clock size={18} /> },
                    { label: "Onaylandı", val: counts.onaylandi, color: "#10B981", icon: <CheckCircle size={18} /> },
                    { label: "Reddedildi", val: counts.reddedildi, color: "#EF4444", icon: <XCircle size={18} /> },
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

            {/* Filtreler */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "4px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "4px" }}>
                    {[
                        { key: "bekliyor", label: "Bekleyenler" },
                        { key: "onaylandi", label: "Onaylananlar" },
                        { key: "reddedildi", label: "Reddedilenler" },
                        { key: "all", label: "Tümü" },
                    ].map(f => (
                        <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{ padding: "7px 14px", borderRadius: "7px", border: "none", background: statusFilter === f.key ? "var(--primary)" : "transparent", color: statusFilter === f.key ? "white" : "var(--text-muted)", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                            {f.label}
                        </button>
                    ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "0 12px", height: "38px", width: "220px", gap: "7px", marginLeft: "auto" }}>
                    <Search size={13} style={{ color: "var(--text-muted)" }} />
                    <input type="text" placeholder="İsim, kullanıcı, şehir..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ border: "none", background: "transparent", outline: "none", width: "100%", color: "var(--foreground)", fontSize: "13px" }} />
                </div>
            </div>

            {/* Liste */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                    <RefreshCw size={28} style={{ margin: "0 auto 10px", display: "block", opacity: 0.4, animation: "spin 0.8s linear infinite" }} />
                    Yükleniyor...
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "60px 24px", textAlign: "center" }}>
                    <Briefcase size={40} style={{ margin: "0 auto 14px", display: "block", opacity: 0.3 }} />
                    <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "800", color: "var(--foreground)" }}>Başvuru yok</h3>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>Bu kategoride gösterilecek başvuru bulunmuyor.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {filtered.map(app => {
                        const ss = STATUS_STYLE[app.status] || STATUS_STYLE.bekliyor;
                        const isExpanded = expanded === app.id;
                        return (
                            <div key={app.id} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", overflow: "hidden", borderLeft: `4px solid ${ss.color}` }}>
                                <div style={{ padding: "16px 20px", display: "flex", gap: "14px", alignItems: "center", cursor: "pointer" }} onClick={() => setExpanded(isExpanded ? null : app.id)}>
                                    <div style={{ width: "44px", height: "44px", borderRadius: "11px", background: "rgba(139,92,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B5CF6", flexShrink: 0 }}>
                                        {PROF_ICONS[app.profession] || <User size={18} />}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--foreground)" }}>{app.fullName || app.username}</span>
                                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>@{app.username}</span>
                                            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "700", background: ss.bg, color: ss.color, padding: "2px 8px", borderRadius: "6px" }}>{ss.icon} {ss.label}</span>
                                        </div>
                                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                            {app.professionTitle} · {app.city || "—"} · {app.experience || "0"} yıl deneyim · {app.createdAt}
                                        </span>
                                    </div>
                                    {app.status === "bekliyor" && (
                                        <div style={{ display: "flex", gap: "7px", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                                            <button onClick={() => { setModal({ type: "approve", app }); setNote(""); }} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "8px 14px", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.08)", color: "#10B981", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                                                <CheckCircle size={14} /> Onayla
                                            </button>
                                            <button onClick={() => { setModal({ type: "reject", app }); setNote(""); }} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "8px 14px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", color: "#EF4444", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                                                <XCircle size={14} /> Reddet
                                            </button>
                                        </div>
                                    )}
                                    <ChevronRight size={15} color="var(--text-muted)" style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                                </div>
                                {isExpanded && (
                                    <div style={{ borderTop: "1px solid var(--border-subtle)", padding: "16px 20px", background: "var(--background)" }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                                            <InfoRow icon={<Phone size={13} />} label="Telefon" value={app.phone || "—"} />
                                            <InfoRow icon={<MapPin size={13} />} label="Şehir" value={app.city || "—"} />
                                            <InfoRow icon={<Store size={13} />} label="İşyeri" value={app.businessName || "—"} />
                                            <InfoRow icon={<MapPin size={13} />} label="İşyeri Adresi" value={app.businessAddress || "—"} />
                                        </div>
                                        {app.message && (
                                            <div style={{ marginBottom: "14px" }}>
                                                <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Ek Mesaj</p>
                                                <p style={{ margin: 0, fontSize: "13px", color: "var(--foreground)", lineHeight: 1.6 }}>{app.message}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                                                <FileText size={13} /> İstenen Belgeler
                                            </p>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                {(app.documents || []).map((d, i) => (
                                                    <span key={i} style={{ fontSize: "11px", fontWeight: "600", background: "var(--card-bg)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)", padding: "4px 10px", borderRadius: "7px" }}>{d}</span>
                                                ))}
                                            </div>
                                        </div>
                                        {app.adminNote && (
                                            <div style={{ marginTop: "14px", padding: "10px 14px", borderRadius: "8px", background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}>
                                                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}><strong style={{ color: "#8B5CF6" }}>Yönetici notu:</strong> {app.adminNote}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Onay/Red Modal */}
            {modal && (
                <>
                    <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1100, backdropFilter: "blur(2px)" }} />
                    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "460px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", zIndex: 1200, padding: "28px" }}>
                        <h3 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: "800", color: "var(--foreground)" }}>
                            {modal.type === "approve" ? "Uzman Başvurusunu Onayla" : "Başvuruyu Reddet"}
                        </h3>
                        <p style={{ margin: "0 0 18px", fontSize: "13px", color: "var(--text-muted)" }}>
                            @{modal.app.username} · {modal.app.professionTitle}
                            {modal.type === "approve" && " — onaylanınca kullanıcı 'uzman' rolü alacak."}
                        </p>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "7px" }}>
                            {modal.type === "approve" ? "Not (opsiyonel)" : "Red Sebebi (kullanıcıya iletilir)"}
                        </label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder={modal.type === "approve" ? "İsteğe bağlı not..." : "Neden reddedildiğini açıklayın..."}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "9px", border: "1px solid var(--border-subtle)", background: "var(--background)", color: "var(--foreground)", fontSize: "13px", outline: "none", resize: "none", boxSizing: "border-box", marginBottom: "18px" }} />
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => setModal(null)} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "var(--background)", border: "1px solid var(--border-subtle)", color: "var(--foreground)", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Vazgeç</button>
                            <button onClick={handleAction} disabled={actionLoading} style={{ flex: 2, padding: "12px", borderRadius: "10px", background: modal.type === "approve" ? "#10B981" : "#EF4444", border: "none", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer", opacity: actionLoading ? 0.7 : 1 }}>
                                {actionLoading ? "İşleniyor..." : modal.type === "approve" ? "Onayla ve Uzman Yap" : "Reddet"}
                            </button>
                        </div>
                    </div>
                </>
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

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "var(--text-muted)" }}>{icon}</span>
            <div>
                <p style={{ margin: 0, fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>{label}</p>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--foreground)", fontWeight: 600 }}>{value}</p>
            </div>
        </div>
    );
}
