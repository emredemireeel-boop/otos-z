"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Wrench, Search, X, Check, XCircle, Trash2,
    AlertTriangle, Clock, CheckCircle, ChevronRight,
    User, Car, Filter
} from "lucide-react";
import { getDNAChronicReports, updateDNAChronicReportStatus, deleteDNAChronicReport, type DNAChronicReport } from "@/lib/dnaService";

const SEVERITY_STYLE: Record<string, { bg: string; color: string; label: string }> = {
    low: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6", label: "Düşük" },
    medium: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", label: "Orta" },
    high: { bg: "rgba(239,68,68,0.1)", color: "#EF4444", label: "Yüksek" },
};

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
    bekliyor: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", label: "Bekliyor", icon: <Clock size={11} /> },
    onaylandi: { bg: "rgba(16,185,129,0.1)", color: "#10B981", label: "Onaylandı", icon: <CheckCircle size={11} /> },
    reddedildi: { bg: "rgba(107,114,128,0.1)", color: "#6B7280", label: "Reddedildi", icon: <XCircle size={11} /> },
};

export default function AdminDNARaporlarPage() {
    const [reports, setReports] = useState<DNAChronicReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("bekliyor");
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getDNAChronicReports();
            setReports(data);
        } catch (e) {
            console.error("DNA raporları yüklenirken hata:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const showToast = (msg: string, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleApprove = async (report: DNAChronicReport) => {
        setActionLoading(report.id);
        try {
            const success = await updateDNAChronicReportStatus(report.id, 'onaylandi');
            if (success) {
                setReports(rs => rs.map(r => r.id === report.id ? { ...r, status: 'onaylandi' } : r));
                showToast(`✅ "${report.issueTitle}" kronik sorun olarak onaylandı!`);
            }
        } catch (e) {
            showToast("İşlem başarısız oldu.", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (report: DNAChronicReport) => {
        setActionLoading(report.id);
        try {
            const success = await updateDNAChronicReportStatus(report.id, 'reddedildi');
            if (success) {
                setReports(rs => rs.map(r => r.id === report.id ? { ...r, status: 'reddedildi' } : r));
                showToast("Bildirim reddedildi.");
            }
        } catch (e) {
            showToast("İşlem başarısız oldu.", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (reportId: string) => {
        setActionLoading(reportId);
        try {
            const success = await deleteDNAChronicReport(reportId);
            if (success) {
                setReports(rs => rs.filter(r => r.id !== reportId));
                showToast("Bildirim silindi.");
                if (expanded === reportId) setExpanded(null);
            }
        } catch (e) {
            showToast("Silme başarısız oldu.", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = reports
        .filter(r => statusFilter === "hepsi" || r.status === statusFilter)
        .filter(r => !search ||
            r.issueTitle.toLowerCase().includes(search.toLowerCase()) ||
            r.username.toLowerCase().includes(search.toLowerCase()) ||
            r.brandName.toLowerCase().includes(search.toLowerCase()) ||
            r.modelName.toLowerCase().includes(search.toLowerCase())
        );

    const counts = {
        hepsi: reports.length,
        bekliyor: reports.filter(r => r.status === "bekliyor").length,
        onaylandi: reports.filter(r => r.status === "onaylandi").length,
        reddedildi: reports.filter(r => r.status === "reddedildi").length,
    };

    return (
        <div style={{ position: "relative", paddingBottom: "40px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Wrench size={24} color="#EF4444" /> DNA Kronik Sorun Bildirimleri
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Kullanıcıların bildirdiği kronik sorunları incele, onayla veya reddet</p>
                </div>
                {counts.bekliyor > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "10px", padding: "10px 14px" }}>
                        <AlertTriangle size={15} color="#F59E0B" />
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#F59E0B" }}>{counts.bekliyor} onay bekliyor</span>
                    </div>
                )}
            </div>

            {/* Stat mini bar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
                {[
                    { label: "Bekleyen", val: counts.bekliyor, color: "#F59E0B", key: "bekliyor" },
                    { label: "Onaylandı", val: counts.onaylandi, color: "#10B981", key: "onaylandi" },
                    { label: "Reddedildi", val: counts.reddedildi, color: "#6B7280", key: "reddedildi" },
                ].map(s => (
                    <div key={s.label}
                        onClick={() => setStatusFilter(s.key)}
                        style={{
                            background: statusFilter === s.key ? `${s.color}15` : "var(--card-bg)",
                            border: statusFilter === s.key ? `2px solid ${s.color}` : "1px solid var(--card-border)",
                            borderRadius: "12px", padding: "14px 18px",
                            display: "flex", alignItems: "center", gap: "10px", cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        <span style={{ fontSize: "24px", fontWeight: "900", color: s.color }}>{s.val}</span>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Filtreler */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "4px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "4px" }}>
                    {(["hepsi", "bekliyor", "onaylandi", "reddedildi"] as const).map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)} style={{
                            padding: "6px 12px", borderRadius: "7px", border: "none",
                            background: statusFilter === s ? "var(--primary)" : "transparent",
                            color: statusFilter === s ? "white" : "var(--text-muted)",
                            fontSize: "12px", fontWeight: "600", cursor: "pointer"
                        }}>
                            {s === "hepsi" ? "Tümü" : s === "bekliyor" ? "Bekliyor" : s === "onaylandi" ? "Onaylandı" : "Reddedildi"}
                            <span style={{ marginLeft: "4px", fontSize: "10px", background: statusFilter === s ? "rgba(255,255,255,0.25)" : "var(--background)", padding: "1px 5px", borderRadius: "7px", fontWeight: "800" }}>
                                {counts[s]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Arama */}
                <div style={{ display: "flex", alignItems: "center", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "0 12px", height: "38px", width: "260px", gap: "7px", marginLeft: "auto" }}>
                    <Search size={13} style={{ color: "var(--text-muted)" }} />
                    <input type="text" placeholder="Sorun, kullanıcı, marka..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ border: "none", background: "transparent", outline: "none", width: "100%", color: "var(--foreground)", fontSize: "13px" }} />
                    {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={12} /></button>}
                </div>
            </div>

            {/* Liste */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
                    <p style={{ fontWeight: "600" }}>Yükleniyor...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", color: "var(--text-muted)" }}>
                    <CheckCircle size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                    <p style={{ fontWeight: "600", margin: 0 }}>Bu filtrede bildirim yok 🎉</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {filtered.map(r => {
                        const ss = STATUS_STYLE[r.status] || STATUS_STYLE.bekliyor;
                        const sv = SEVERITY_STYLE[r.severity] || SEVERITY_STYLE.medium;
                        const isOpen = expanded === r.id;
                        const isActioning = actionLoading === r.id;
                        return (
                            <div key={r.id} style={{
                                background: "var(--card-bg)",
                                border: `1px solid ${r.status === 'bekliyor' ? 'rgba(245,158,11,0.3)' : 'var(--card-border)'}`,
                                borderRadius: "12px", overflow: "hidden",
                                borderLeft: `4px solid ${sv.color}`
                            }}>
                                {/* Row */}
                                <div style={{ padding: "14px 18px", display: "flex", gap: "12px", alignItems: "center", cursor: "pointer" }}
                                    onClick={() => setExpanded(isOpen ? null : r.id)}>

                                    {/* Avatar */}
                                    <div style={{
                                        width: "36px", height: "36px", borderRadius: "10px",
                                        background: `${sv.color}15`, display: "flex", alignItems: "center",
                                        justifyContent: "center", flexShrink: 0
                                    }}>
                                        <Wrench size={16} color={sv.color} />
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", gap: "7px", alignItems: "center", marginBottom: "3px", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>{r.issueTitle}</span>
                                        </div>
                                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                                                <User size={11} /> @{r.username}
                                            </span>
                                            <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Car size={11} /> {r.brandName} {r.modelName} • {r.engineName}
                                            </span>
                                            <span style={{ fontSize: "11px", color: "var(--text-subtle)" }}>
                                                {new Date(r.createdAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "700", background: sv.bg, color: sv.color, padding: "3px 8px", borderRadius: "6px" }}>
                                            {sv.label}
                                        </span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "700", background: ss.bg, color: ss.color, padding: "3px 8px", borderRadius: "6px" }}>
                                            {ss.icon} {ss.label}
                                        </span>
                                        <ChevronRight size={15} color="var(--text-muted)" style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                                    </div>
                                </div>

                                {/* Expanded */}
                                {isOpen && (
                                    <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
                                        <div style={{ padding: "14px 18px", background: "var(--background)", borderBottom: "1px solid var(--border-subtle)" }}>
                                            <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Bildirilen Sorun Açıklaması</p>
                                            <p style={{ margin: 0, fontSize: "13px", color: "var(--foreground)", lineHeight: "1.6", borderLeft: `3px solid ${sv.color}`, paddingLeft: "12px", fontStyle: "italic" }}>
                                                &quot;{r.issueDescription}&quot;
                                            </p>
                                            <div style={{ marginTop: "12px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                                <div style={{ padding: "6px 12px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
                                                    <strong>Kullanıcı:</strong> @{r.username}
                                                </div>
                                                <div style={{ padding: "6px 12px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
                                                    <strong>Araç:</strong> {r.brandName} {r.modelName}
                                                </div>
                                                <div style={{ padding: "6px 12px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
                                                    <strong>Motor:</strong> {r.engineName}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {r.status === "bekliyor" ? (
                                            <div style={{ padding: "12px 18px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                <button
                                                    onClick={() => handleApprove(r)}
                                                    disabled={isActioning}
                                                    style={{
                                                        display: "flex", alignItems: "center", gap: "6px",
                                                        padding: "8px 16px", borderRadius: "8px",
                                                        border: "1px solid rgba(16,185,129,0.4)",
                                                        background: "rgba(16,185,129,0.1)", color: "#10B981",
                                                        fontSize: "13px", fontWeight: "700", cursor: "pointer",
                                                        opacity: isActioning ? 0.6 : 1
                                                    }}
                                                >
                                                    <Check size={14} /> Onayla & Kronik Sorunlara Ekle
                                                </button>
                                                <button
                                                    onClick={() => handleReject(r)}
                                                    disabled={isActioning}
                                                    style={{
                                                        display: "flex", alignItems: "center", gap: "6px",
                                                        padding: "8px 16px", borderRadius: "8px",
                                                        border: "1px solid rgba(107,114,128,0.4)",
                                                        background: "rgba(107,114,128,0.1)", color: "#6B7280",
                                                        fontSize: "13px", fontWeight: "700", cursor: "pointer",
                                                        opacity: isActioning ? 0.6 : 1
                                                    }}
                                                >
                                                    <XCircle size={14} /> Reddet
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(r.id)}
                                                    disabled={isActioning}
                                                    style={{
                                                        display: "flex", alignItems: "center", gap: "6px",
                                                        padding: "8px 16px", borderRadius: "8px",
                                                        border: "1px solid rgba(239,68,68,0.4)",
                                                        background: "rgba(239,68,68,0.1)", color: "#EF4444",
                                                        fontSize: "13px", fontWeight: "700", cursor: "pointer",
                                                        marginLeft: "auto", opacity: isActioning ? 0.6 : 1
                                                    }}
                                                >
                                                    <Trash2 size={14} /> Sil
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                                                    Bu bildirim {r.status === 'onaylandi' ? 'onaylanmış' : 'reddedilmiş'} durumda.
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(r.id)}
                                                    disabled={isActioning}
                                                    style={{
                                                        display: "flex", alignItems: "center", gap: "6px",
                                                        padding: "6px 12px", borderRadius: "6px",
                                                        border: "1px solid rgba(239,68,68,0.3)",
                                                        background: "rgba(239,68,68,0.05)", color: "#EF4444",
                                                        fontSize: "11px", fontWeight: "700", cursor: "pointer",
                                                        opacity: isActioning ? 0.6 : 1
                                                    }}
                                                >
                                                    <Trash2 size={12} /> Sil
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: "32px", right: "32px",
                    background: toast.type === "error" ? "#EF4444" : "#10B981",
                    color: "white", padding: "14px 20px", borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.25)", fontWeight: "600",
                    fontSize: "14px", zIndex: 9999, animation: "slideUp 0.3s ease"
                }}>
                    {toast.msg}
                </div>
            )}

            <style>{`
                @keyframes slideUp { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
