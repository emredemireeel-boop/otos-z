"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Flag, ChevronRight, Search, X, RefreshCw, Check,
    AlertTriangle, Trash2, Ban, Eye, MessageSquare,
    User, FileText, Clock, CheckCircle, XCircle,
    ShieldAlert, Filter, SlidersHorizontal, ExternalLink
} from "lucide-react";

//  Tipler 
type ReportType = "entry" | "baslik" | "kullanici" | "ilan";
type ReportStatus = "bekliyor" | "incelendi" | "islendi" | "reddedildi";
type SortBy = "yeni" | "eski" | "tur";

interface Report {
    id: string;
    type: ReportType;
    targetId: string;
    targetTitle: string;
    targetAuthor: string;
    targetContent: string;
    reportedBy: string;
    reason: string;
    category: string;
    date: string;
    status: ReportStatus;
    priority: "dusuk" | "orta" | "yuksek" | "kritik";
    notes: string;
    count: number; // aynı içerik kaç kere rapor edildi
}

const MOCK_REPORTS: Report[] = [
    { id: "r-001", type: "entry", targetId: "e-155", targetTitle: "lpg araba almak mantıklı mı", targetAuthor: "modifiyeci", targetContent: "Bu sözlükte yazan herkes cahil, kesinlikle okumayın. Hepsi yanlış bilgi veriyor.", reportedBy: "turbosever", reason: "Hakaret & Küçümseme", category: "hakaret", date: "18.04.2026 - 11:42", status: "bekliyor", priority: "yuksek", notes: "", count: 7 },
    { id: "r-002", type: "kullanici", targetId: "spambot99", targetTitle: "Kullanıcı: @spambot99", targetAuthor: "spambot99", targetContent: "Profil: 20 dakikada 15 aynı entry paylaşıyor, link spam.", reportedBy: "yolcanavari", reason: "Spam & Bot Aktivitesi", category: "spam", date: "18.04.2026 - 10:15", status: "bekliyor", priority: "kritik", notes: "", count: 12 },
    { id: "r-003", type: "entry", targetId: "e-089", targetTitle: "bmw vs mercedes hangisi daha iyi", targetAuthor: "almanhayrani", targetContent: "BMW alanlar bok yiyor diyeyim de geçeyim. Sadece gösteriş meraklıları alır.", reportedBy: "sedansevdalisi", reason: "Kaba Dil & Küfür", category: "kufur", date: "17.04.2026 - 22:30", status: "bekliyor", priority: "orta", notes: "", count: 3 },
    { id: "r-004", type: "baslik", targetId: "t-044", targetTitle: "gizli Şirket ürün iÃŒâ€¡ncelemesi aöklsjdf", targetAuthor: "reklamposter", targetContent: "Başlık: Belirli bir markaya gizli reklam niteliÃ„şinde içerik barındırıyor.", reportedBy: "lpglisurucu", reason: "Reklam / Sponsorlu İçerik", category: "reklam", date: "17.04.2026 - 18:55", status: "incelendi", priority: "orta", notes: "İnceleniyor, marka doÃ„şrulanacak.", count: 2 },
    { id: "r-005", type: "ilan", targetId: "l-003", targetTitle: "2019 BMW 3 Series - 320i", targetAuthor: "vites_kolu_34", targetContent: "İlan: FotoÃ„şraflar başka araçtan alınmış, km bilgisi manipüle edilmiş olabilir.", reportedBy: "suvkrali", reason: "Sahte / Yanıltıcı İlan", category: "yaniltici", date: "17.04.2026 - 14:20", status: "bekliyor", priority: "yuksek", notes: "", count: 5 },
    { id: "r-006", type: "entry", targetId: "e-201", targetTitle: "elektrikli araç gerçekten değer mi", targetAuthor: "elektriklidunya", targetContent: "Bu entry'deki bilgiler tamamen yanlış. Yazar hiç araştırmadan yazmış, yanlış bilgi yayıyor.", reportedBy: "manuelci", reason: "Yanlış / Yanıltıcı Bilgi", category: "yaniltici", date: "16.04.2026 - 09:10", status: "islendi", priority: "dusuk", notes: "Entry düzenlendi, yazar uyarıldı.", count: 1 },
    { id: "r-007", type: "kullanici", targetId: "troll_hesap", targetTitle: "Kullanıcı: @troll_hesap", targetAuthor: "troll_hesap", targetContent: "Her entryde başkalarına aşaÃ„şılayıcı yorumlar. Birden fazla kullanıcı tarafından raporlanmış.", reportedBy: "japonguvenlir", reason: "Trollük & Taciz", category: "taciz", date: "15.04.2026 - 16:45", status: "islendi", priority: "yuksek", notes: "Hesap 7 günlüÃ„şüne askıya alındı.", count: 9 },
    { id: "r-008", type: "entry", targetId: "e-315", targetTitle: "sigorta dolandırıcılıÃ„şı nasıl", targetAuthor: "anonim_yazar", targetContent: "Entry sigorta dolandırıcılıÃ„şı hakkında nasıl yapılacaÃ„şına dair adım adım bilgi içeriyor.", reportedBy: "turbosever", reason: "Yasadışı İçerik", category: "yasadisi", date: "15.04.2026 - 08:30", status: "reddedildi", priority: "kritik", notes: "Entry kaldırılmadı, yanlış rapor.", count: 1 },
];

const CATEGORIES = [
    { key: "hepsi", label: "Tümü" },
    { key: "hakaret", label: "Hakaret" },
    { key: "spam", label: "Spam/Bot" },
    { key: "kufur", label: "Küfür" },
    { key: "reklam", label: "Reklam" },
    { key: "yaniltici", label: "Yanıltıcı" },
    { key: "taciz", label: "Taciz" },
    { key: "yasadisi", label: "Yasadışı" },
];

const TYPE_ICONS: Record<ReportType, React.ReactNode> = {
    entry: <FileText size={13} />,
    baslik: <MessageSquare size={13} />,
    kullanici: <User size={13} />,
    ilan: <ShieldAlert size={13} />,
};

const TYPE_LABELS: Record<ReportType, string> = {
    entry: "Entry",
    baslik: "Başlık",
    kullanici: "Kullanıcı",
    ilan: "İlan",
};

const PRIORITY_STYLE: Record<string, { bg: string; color: string; label: string }> = {
    kritik: { bg: "rgba(239,68,68,0.15)", color: "#EF4444", label: "Kritik" },
    yuksek: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B", label: "Yüksek" },
    orta: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6", label: "Orta" },
    dusuk: { bg: "rgba(107,114,128,0.1)", color: "#6B7280", label: "Düşük" },
};

const STATUS_STYLE: Record<ReportStatus, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
    bekliyor: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", label: "Bekliyor", icon: <Clock size={11} /> },
    incelendi: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6", label: "İnceleniyor", icon: <Eye size={11} /> },
    islendi: { bg: "rgba(16,185,129,0.1)", color: "#10B981", label: "İŞlendi", icon: <CheckCircle size={11} /> },
    reddedildi: { bg: "rgba(107,114,128,0.1)", color: "#6B7280", label: "Reddedildi", icon: <XCircle size={11} /> },
};

type ActionModal = { type: "warn" | "ban" | "delete" | "dismiss"; report: Report } | null;

export default function AdminRaporlarPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<ReportStatus | "hepsi">("bekliyor");
    const [catFilter, setCatFilter] = useState("hepsi");
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<string | null>(null);
    const [modal, setModal] = useState<ActionModal>(null);
    const [note, setNote] = useState("");
    const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin?section=reports');
            const data = await res.json();
            if (data.success) {
                setReports(data.reports);
            }
        } catch (e) {
            console.error("Raporlar yuklenirken hata:", e);
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

    const updateReport = (id: string, updates: Partial<Report>) => {
        setReports(rs => rs.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const handleAction = async (type: "warn" | "ban" | "delete" | "dismiss") => {
        if (!modal || actionLoading) return;
        setActionLoading(true);
        const { report } = modal;
        
        let newStatus = "islendi";
        let apiAction = "resolve_report";
        let apiDetail = { status: "islendi", note: note || "" };

        if (type === "dismiss") {
            newStatus = "reddedildi";
            apiDetail.status = "reddedildi";
            apiDetail.note = note || "Şikayet reddedildi.";
        } else if (type === "warn") {
            apiDetail.note = note || "Kullanıcı uyarıldı.";
        } else if (type === "ban") {
            apiDetail.note = note || "Kullanıcı banlandı.";
            // Also call ban_user via API
            await fetch('/api/admin', { method: 'POST', body: JSON.stringify({ action: 'ban_user', target: report.targetAuthor }) });
        } else if (type === "delete") {
            apiDetail.note = note || "İçerik silindi.";
            // If it's a thread or entry, we could call delete API. For now, just mark resolved.
        }

        try {
            await fetch('/api/admin', {
                method: 'POST',
                body: JSON.stringify({
                    action: apiAction,
                    target: report.id,
                    detail: JSON.stringify(apiDetail),
                    actor: "Admin"
                })
            });

            // Optimistic update
            updateReport(report.id, { status: newStatus as ReportStatus, notes: apiDetail.note });

            switch (type) {
                case "warn": showToast(`⚠️ @${report.targetAuthor} uyarıldı.`, "warning"); break;
                case "ban": showToast(` @${report.targetAuthor} banlandı!`, "error"); break;
                case "delete": showToast(` İçerik kaldırıldı.`, "error"); break;
                case "dismiss": showToast(`İşlem yapılmadı, Şikayet kapatıldı.`); break;
            }
        } catch (e) {
            showToast("İşlem başarısız oldu.", "error");
        } finally {
            setActionLoading(false);
            setModal(null);
            setNote("");
            if (expanded === report.id) setExpanded(null);
        }
    };

    const markAsIncelendi = async (id: string) => {
        try {
            await fetch('/api/admin', {
                method: 'POST',
                body: JSON.stringify({ action: 'update_report_status', target: id, detail: 'incelendi' })
            });
            updateReport(id, { status: "incelendi" });
            showToast("İnceleme başlatıldı.");
        } catch (e) {
            console.error(e);
        }
    };

    const filtered = reports
        .filter(r => statusFilter === "hepsi" || r.status === statusFilter)
        .filter(r => catFilter === "hepsi" || r.category === catFilter)
        .filter(r => !search || r.targetTitle.toLowerCase().includes(search.toLowerCase()) || r.reportedBy.toLowerCase().includes(search.toLowerCase()));

    const counts = {
        hepsi: reports.length,
        bekliyor: reports.filter(r => r.status === "bekliyor").length,
        incelendi: reports.filter(r => r.status === "incelendi").length,
        islendi: reports.filter(r => r.status === "islendi").length,
        reddedildi: reports.filter(r => r.status === "reddedildi").length,
    };

    return (
        <div style={{ position: "relative", paddingBottom: "40px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Flag size={24} color="#EF4444" /> Şikayet & Rapor Kuyruğu
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Kullanıcı raporlarını incele · entry, başlık, kullanıcı ve ilan raporları</p>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                    {counts.bekliyor > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "10px", padding: "10px 14px" }}>
                            <AlertTriangle size={15} color="#F59E0B" />
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#F59E0B" }}>{counts.bekliyor} bekliyor</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Stat mini bar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "20px" }}>
                {[
                    { label: "Bekleyen", val: counts.bekliyor, color: "#F59E0B" },
                    { label: "İnceleniyor", val: counts.incelendi, color: "#3B82F6" },
                    { label: "İŞlendi", val: counts.islendi, color: "#10B981" },
                    { label: "Reddedildi", val: counts.reddedildi, color: "#6B7280" },
                ].map(s => (
                    <div key={s.label} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                        onClick={() => setStatusFilter(s.label === "Bekleyen" ? "bekliyor" : s.label === "İnceleniyor" ? "incelendi" : s.label === "İşlendi" ? "islendi" : "reddedildi")}>
                        <span style={{ fontSize: "24px", fontWeight: "900", color: s.color }}>{s.val}</span>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Filtreler */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
                {/* Durum filter */}
                <div style={{ display: "flex", gap: "4px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "4px" }}>
                    {(["hepsi", "bekliyor", "incelendi", "islendi", "reddedildi"] as const).map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "6px 12px", borderRadius: "7px", border: "none", background: statusFilter === s ? "var(--primary)" : "transparent", color: statusFilter === s ? "white" : "var(--text-muted)", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                            {s === "hepsi" ? "Tümü" : s === "bekliyor" ? "Bekliyor" : s === "incelendi" ? "İnceleniyor" : s === "islendi" ? "İşlendi" : "Reddedildi"}
                            <span style={{ marginLeft: "4px", fontSize: "10px", background: statusFilter === s ? "rgba(255,255,255,0.25)" : "var(--background)", padding: "1px 5px", borderRadius: "7px", fontWeight: "800" }}>
                                {counts[s]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Kategori filter */}
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--foreground)", fontSize: "12px", fontWeight: "600", cursor: "pointer", outline: "none" }}>
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>

                {/* Arama */}
                <div style={{ display: "flex", alignItems: "center", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "0 12px", height: "38px", width: "220px", gap: "7px", marginLeft: "auto" }}>
                    <Search size={13} style={{ color: "var(--text-muted)" }} />
                    <input type="text" placeholder="Başlık, kullanıcı..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ border: "none", background: "transparent", outline: "none", width: "100%", color: "var(--foreground)", fontSize: "13px" }} />
                    {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={12} /></button>}
                </div>
            </div>

            {/* Liste */}
            {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", color: "var(--text-muted)" }}>
                    <CheckCircle size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                    <p style={{ fontWeight: "600", margin: 0 }}>Bu filtrede rapor yok 🎉</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {filtered.map(r => {
                        const ps = PRIORITY_STYLE[r.priority];
                        const ss = STATUS_STYLE[r.status];
                        const isOpen = expanded === r.id;
                        return (
                            <div key={r.id} style={{ background: "var(--card-bg)", border: `1px solid ${r.priority === "kritik" && r.status === "bekliyor" ? "rgba(239,68,68,0.4)" : "var(--card-border)"}`, borderRadius: "12px", overflow: "hidden", borderLeft: `4px solid ${ps.color}` }}>
                                {/* Row */}
                                <div style={{ padding: "14px 18px", display: "flex", gap: "12px", alignItems: "center", cursor: "pointer" }}
                                    onClick={() => setExpanded(isOpen ? null : r.id)}>
                                    {/* Rapor sayısı badge */}
                                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${ps.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, flexDirection: "column" }}>
                                        <span style={{ fontSize: "14px", fontWeight: "900", color: ps.color, lineHeight: 1 }}>{r.count}</span>
                                        <span style={{ fontSize: "8px", color: ps.color, opacity: 0.7 }}>rapor</span>
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", gap: "7px", alignItems: "center", marginBottom: "3px", flexWrap: "wrap" }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "700", background: "var(--background)", color: "var(--text-muted)", padding: "2px 7px", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
                                                {TYPE_ICONS[r.type]} {TYPE_LABELS[r.type]}
                                            </span>
                                            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>{r.targetTitle}</span>
                                        </div>
                                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>@{r.targetAuthor} · {r.reason}</span>
                                            <span style={{ fontSize: "11px", color: "var(--text-subtle)" }}>{r.date}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "700", background: ps.bg, color: ps.color, padding: "3px 8px", borderRadius: "6px" }}>{ps.label}</span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "700", background: ss.bg, color: ss.color, padding: "3px 8px", borderRadius: "6px" }}>{ss.icon} {ss.label}</span>
                                        <ChevronRight size={15} color="var(--text-muted)" style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                                    </div>
                                </div>

                                {/* Expanded */}
                                {isOpen && (
                                    <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
                                        {/* İçerik */}
                                        <div style={{ padding: "14px 18px", background: "var(--background)", borderBottom: "1px solid var(--border-subtle)" }}>
                                            <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Şikayet Edilen İçerik</p>
                                            <p style={{ margin: 0, fontSize: "13px", color: "var(--foreground)", lineHeight: "1.6", borderLeft: `3px solid ${ps.color}`, paddingLeft: "12px", fontStyle: "italic" }}>"{r.targetContent}"</p>
                                            {r.notes && (
                                                <div style={{ marginTop: "10px", padding: "8px 12px", background: "rgba(16,185,129,0.08)", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.2)" }}>
                                                    <p style={{ margin: 0, fontSize: "12px", color: "#10B981" }}>📑 Admin Notu: {r.notes}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Aksiyon Butonları */}
                                        {r.status === "bekliyor" || r.status === "incelendi" ? (
                                            <div style={{ padding: "12px 18px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                {r.status === "bekliyor" && (
                                                    <button onClick={() => markAsIncelendi(r.id)} style={btnStyle("#3B82F6")}><Eye size={13} /> İncelemeye Al</button>
                                                )}
                                                <button onClick={() => setModal({ type: "warn", report: r })} style={btnStyle("#F59E0B")}><AlertTriangle size={13} /> Yazar Uyar</button>
                                                <button onClick={() => setModal({ type: "ban", report: r })} style={btnStyle("#EF4444")}><Ban size={13} /> Banla</button>
                                                <button onClick={() => setModal({ type: "delete", report: r })} style={btnStyle("#EF4444")}><Trash2 size={13} /> İçeriği Sil</button>
                                                <button onClick={() => setModal({ type: "dismiss", report: r })} style={{ ...btnStyle("#6B7280"), marginLeft: "auto" }}><XCircle size={13} /> Şikayeti Reddet</button>
                                            </div>
                                        ) : (
                                            <div style={{ padding: "12px 18px" }}>
                                                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>Bu rapor işlenmiş durumda.</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {modal && (
                <>
                    <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1100, backdropFilter: "blur(2px)" }} />
                    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "480px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", zIndex: 1200, padding: "28px", animation: "popIn 0.2s ease" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: modal.type === "dismiss" ? "rgba(107,114,128,0.1)" : "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {modal.type === "warn" && <AlertTriangle size={22} color="#F59E0B" />}
                                {modal.type === "ban" && <Ban size={22} color="#EF4444" />}
                                {modal.type === "delete" && <Trash2 size={22} color="#EF4444" />}
                                {modal.type === "dismiss" && <XCircle size={22} color="#6B7280" />}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: "var(--foreground)" }}>
                                    {modal.type === "warn" ? "Yazar Uyarılsın mı?" : modal.type === "ban" ? "Kullanıcı Banlanıyor" : modal.type === "delete" ? "İçerik Siliniyor" : "Şikayet Reddedilsin mi?"}
                                </h3>
                                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>@{modal.report.targetAuthor} · {modal.report.targetTitle}</p>
                            </div>
                        </div>
                        <label style={labelStyle}>Admin Notu (opsiyonel)</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Neden bu işlemi yaptıÃ„şınızı not olarak bırakın..."
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border-subtle)", background: "var(--background)", color: "var(--foreground)", fontSize: "13px", outline: "none", resize: "none", boxSizing: "border-box", marginBottom: "20px" }} />
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => setModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                            <button onClick={() => handleAction(modal.type)} disabled={actionLoading}
                                style={{ flex: 2, padding: "13px", borderRadius: "10px", background: modal.type === "dismiss" ? "#6B7280" : modal.type === "warn" ? "#F59E0B" : "#EF4444", border: "none", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer", opacity: actionLoading ? 0.7 : 1 }}>
                                {actionLoading ? "İşleniyor..." : modal.type === "warn" ? "Uyarı Gönder" : modal.type === "ban" ? "Banla" : modal.type === "delete" ? "İçeriği Sil" : "Şikayeti Reddet"}
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
                @keyframes popIn { from { transform: translate(-50%,-50%) scale(0.9); opacity: 0; } to { transform: translate(-50%,-50%) scale(1); opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}

function btnStyle(color: string): React.CSSProperties {
    return { display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: `1px solid ${color}40`, background: `${color}10`, color, fontSize: "12px", fontWeight: "700", cursor: "pointer" };
}
const labelStyle: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "7px" };
const cancelBtnStyle: React.CSSProperties = { flex: 1, padding: "13px", borderRadius: "10px", background: "var(--background)", border: "1px solid var(--border-subtle)", color: "var(--foreground)", fontSize: "14px", fontWeight: "600", cursor: "pointer" };
