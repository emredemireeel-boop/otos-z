"use client";

import { useState, useEffect } from "react";
import {
    Shield, Plus, Trash2, Edit2, Key, Ban, CheckCircle,
    Clock, AlertTriangle, Eye, EyeOff, X, Save, User,
    Activity, ChevronDown, ChevronRight, ToggleLeft, ToggleRight,
    RefreshCw, Zap, Lock, Unlock, ShieldOff, ShieldCheck
} from "lucide-react";
import { ALL_PERMISSIONS, type Moderator, type ModPermission } from "@/data/moderators";

//  Başlangıç Verisi (moderators.ts ile aynı) 
const INITIAL: Moderator[] = [
    {
        id: "mod-001", username: "mod_ayse", displayName: "Ayşe Moderatör",
        password: "mod123", email: "ayse@Otosöz.com", avatar: "🛠️",
        createdAt: "01.03.2026", createdBy: "Admin", status: "aktif",
        permissions: ["rapor_kuyruğu", "kullanici_yonetim", "icerik_moderasyon", "pazar_kontrol", "guvenmetre"],
        lastLogin: "18.04.2026 - 11:00", actionCount: 142, notes: "Forum başlıkları ve kullanıcı yönetimi odaklı.",
    },
    {
        id: "mod-002", username: "mod_kemal", displayName: "Kemal Moderatör",
        password: "kemal456", email: "kemal@Otosöz.com", avatar: "⚡",
        createdAt: "15.03.2026", createdBy: "Admin", status: "aktif",
        permissions: ["rapor_kuyruğu", "icerik_moderasyon", "duyuru", "kelime_filtresi"],
        lastLogin: "18.04.2026 - 09:30", actionCount: 87, notes: "İçerik kalitesi ve duyuru sorumlusu.",
    },
    {
        id: "mod-003", username: "mod_selin", displayName: "Selin Moderatör",
        password: "selin789", email: "selin@Otosöz.com", avatar: "",
        createdAt: "01.04.2026", createdBy: "Admin", status: "askida",
        permissions: ["rapor_kuyruğu", "pazar_kontrol"],
        lastLogin: "15.04.2026 - 16:00", actionCount: 23, notes: "Pazar ilanları moderasyonu. Şu an askıda.",
    },
];

const STATUS_STYLE = {
    aktif: { bg: "rgba(16,185,129,0.1)", color: "#10B981", label: "Aktif", icon: <CheckCircle size={12} /> },
    askida: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", label: "Askıda", icon: <Clock size={12} /> },
    banlandi: { bg: "rgba(239,68,68,0.1)", color: "#EF4444", label: "Banlı", icon: <ShieldOff size={12} /> },
};

type ModalType = "ekle" | "duzenle" | "sifre" | "ban" | "delete" | null;

export default function AdminModeratörlerPage() {
    const [mods, setMods] = useState<Moderator[]>(INITIAL);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedMod, setSelectedMod] = useState<Moderator | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [modal, setModal] = useState<ModalType>(null);
    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
    const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null);
    const [banReason, setBanReason] = useState("");

    // Form state
    const [fUsername, setFUsername] = useState("");
    const [fDisplayName, setFDisplayName] = useState("");
    const [fEmail, setFEmail] = useState("");
    const [fPassword, setFPassword] = useState("");
    const [fAvatar, setFAvatar] = useState("🛠️");
    const [fNotes, setFNotes] = useState("");
    const [fPerms, setFPerms] = useState<ModPermission[]>([]);
    const [fNewPass, setFNewPass] = useState("");
    const [showNewPass, setShowNewPass] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("otosöz_admin_mods");
        if (saved) {
            try {
                setMods(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved moderators", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever mods changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("otosöz_admin_mods", JSON.stringify(mods));
        }
    }, [mods, isLoaded]);

    const showToast = (msg: string, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const openEdit = (m: Moderator) => {
        setSelectedMod(m);
        setFUsername(m.username); setFDisplayName(m.displayName); setFEmail(m.email);
        setFPassword(m.password); setFAvatar(m.avatar); setFNotes(m.notes); setFPerms([...m.permissions]);
        setModal("duzenle");
    };

    const openAdd = () => {
        setSelectedMod(null);
        setFUsername(""); setFDisplayName(""); setFEmail(""); setFPassword(""); setFAvatar("🛠️"); setFNotes(""); setFPerms([]);
        setModal("ekle");
    };

    const togglePerm = (p: ModPermission) => {
        setFPerms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    };

    const saveNew = () => {
        if (!fUsername.trim() || !fPassword.trim() || !fDisplayName.trim()) {
            showToast("Kullanıcı adı, ad ve Şifre zorunlu.", "error"); return;
        }
        if (mods.some(m => m.username === fUsername.trim())) {
            showToast("Bu kullanıcı adı zaten mevcut.", "error"); return;
        }
        const newMod: Moderator = {
            id: `mod-${Date.now()}`, username: fUsername.trim(), displayName: fDisplayName.trim(),
            password: fPassword, email: fEmail, avatar: fAvatar, createdAt: new Date().toLocaleDateString("tr-TR"),
            createdBy: "Admin", status: "aktif", permissions: fPerms, actionCount: 0, notes: fNotes,
        };
        setMods(prev => [newMod, ...prev]);
        setModal(null);
        showToast(`✓ @${newMod.username} moderatör olarak eklendi. Şifre: ${fPassword}`);
    };

    const saveEdit = () => {
        if (!selectedMod) return;
        setMods(prev => prev.map(m => m.id === selectedMod.id
            ? { ...m, username: fUsername, displayName: fDisplayName, email: fEmail, avatar: fAvatar, notes: fNotes, permissions: fPerms }
            : m
        ));
        setModal(null);
        showToast(`✓ @${fUsername} bilgileri güncellendi.`);
    };

    const changePassword = () => {
        if (!selectedMod || !fNewPass.trim()) return;
        if (fNewPass.length < 6) { showToast("Şifre en az 6 karakter olmalı.", "error"); return; }
        setMods(prev => prev.map(m => m.id === selectedMod.id ? { ...m, password: fNewPass } : m));
        setModal(null); setFNewPass("");
        showToast(`✓ @${selectedMod.username} Şifresi değiştirildi.`);
    };

    const banMod = () => {
        if (!selectedMod) return;
        setMods(prev => prev.map(m => m.id === selectedMod.id ? { ...m, status: "banlandi", banReason } : m));
        setModal(null); setBanReason("");
        showToast(` @${selectedMod.username} banlandı.`, "error");
    };

    const unbanMod = (id: string, username: string) => {
        setMods(prev => prev.map(m => m.id === id ? { ...m, status: "aktif", banReason: undefined } : m));
        showToast(`✓ @${username} banı kaldırıldı.`);
    };

    const toggleSuspend = (id: string, username: string, currentStatus: string) => {
        const newStatus = currentStatus === "askida" ? "aktif" : "askida";
        setMods(prev => prev.map(m => m.id === id ? { ...m, status: newStatus as "aktif" | "askida" | "banlandi" } : m));
        showToast(newStatus === "askida" ? `⚠️ @${username} askıya alındı.` : `✓ @${username} tekrar aktif edildi.`, newStatus === "askida" ? "warning" : "success");
    };

    const deleteMod = () => {
        if (!selectedMod) return;
        setMods(prev => prev.filter(m => m.id !== selectedMod.id));
        setModal(null); setExpandedId(null);
        showToast(`@${selectedMod.username} silindi.`, "error");
    };

    const stats = {
        aktif: mods.filter(m => m.status === "aktif").length,
        askida: mods.filter(m => m.status === "askida").length,
        banlandi: mods.filter(m => m.status === "banlandi").length,
        toplamIslem: mods.reduce((s, m) => s + m.actionCount, 0),
    };

    return (
        <div style={{ position: "relative", paddingBottom: "40px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <ShieldCheck size={24} color="#8B5CF6" /> Moderatörler
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                        Moderatör ekle, yetkilerini düzenle, hesaplarını yönet
                    </p>
                </div>
                <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--primary)", border: "none", color: "white", padding: "11px 18px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>
                    <Plus size={15} /> Yeni Moderatör Ekle
                </button>
            </div>

            {/* İstatistik kartları */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "22px" }}>
                {[
                    { label: "Aktif", val: stats.aktif, color: "#10B981", icon: <CheckCircle size={18} /> },
                    { label: "Askıda", val: stats.askida, color: "#F59E0B", icon: <Clock size={18} /> },
                    { label: "Banlı", val: stats.banlandi, color: "#EF4444", icon: <Ban size={18} /> },
                    { label: "Toplam İŞlem", val: stats.toplamIslem, color: "#8B5CF6", icon: <Activity size={18} /> },
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

            {/* Moderatör Listesi */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {mods.map(m => {
                    const ss = STATUS_STYLE[m.status];
                    const isExpanded = expandedId === m.id;
                    return (
                        <div key={m.id} style={{ background: "var(--card-bg)", border: `1px solid ${m.status === "banlandi" ? "rgba(239,68,68,0.35)" : m.status === "askida" ? "rgba(245,158,11,0.3)" : "var(--card-border)"}`, borderRadius: "14px", overflow: "hidden", borderLeft: `4px solid ${ss.color}` }}>
                            {/* Ana satır */}
                            <div style={{ padding: "16px 20px", display: "flex", gap: "14px", alignItems: "center", cursor: "pointer" }}
                                onClick={() => setExpandedId(isExpanded ? null : m.id)}>
                                {/* Avatar */}
                                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${ss.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                                    {m.avatar}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                                        <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--foreground)" }}>{m.displayName}</span>
                                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>@{m.username}</span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "700", background: ss.bg, color: ss.color, padding: "2px 8px", borderRadius: "6px" }}>
                                            {ss.icon} {ss.label}
                                        </span>
                                        {m.status === "banlandi" && m.banReason && (
                                            <span style={{ fontSize: "10px", color: "#EF4444", fontStyle: "italic" }}>Ban: {m.banReason}</span>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                                            {m.permissions.length} yetki · {m.actionCount} işlem
                                        </span>
                                        <span style={{ fontSize: "11px", color: "var(--text-subtle)" }}>
                                            Son giriş: {m.lastLogin || "—"}
                                        </span>
                                        <span style={{ fontSize: "11px", color: "var(--text-subtle)" }}>Ekleyen: {m.createdBy} · {m.createdAt}</span>
                                    </div>
                                </div>
                                {/* Hızlı aksiyon butonları */}
                                <div style={{ display: "flex", gap: "7px", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                                    <button onClick={() => openEdit(m)} title="Düzenle" style={iconBtn("#3B82F6")}><Edit2 size={14} /></button>
                                    <button onClick={() => { setSelectedMod(m); setModal("sifre"); setFNewPass(""); }} title="Şifre Değiştir" style={iconBtn("#F59E0B")}><Key size={14} /></button>
                                    {m.status !== "banlandi" ? (
                                        <>
                                            <button onClick={() => toggleSuspend(m.id, m.username, m.status)} title={m.status === "askida" ? "Aktif Et" : "Askıya Al"} style={iconBtn(m.status === "askida" ? "#10B981" : "#F59E0B")}>
                                                {m.status === "askida" ? <Unlock size={14} /> : <Lock size={14} />}
                                            </button>
                                            <button onClick={() => { setSelectedMod(m); setModal("ban"); setBanReason(""); }} title="Banla" style={iconBtn("#EF4444")}><Ban size={14} /></button>
                                        </>
                                    ) : (
                                        <button onClick={() => unbanMod(m.id, m.username)} title="Banı Kaldır" style={iconBtn("#10B981")}><ShieldCheck size={14} /></button>
                                    )}
                                    <button onClick={() => { setSelectedMod(m); setModal("delete"); }} title="Sil" style={iconBtn("#EF4444")}><Trash2 size={14} /></button>
                                </div>
                                <ChevronRight size={15} color="var(--text-muted)" style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                            </div>

                            {/* Genişletilmiş — yetkiler ve Şifre */}
                            {isExpanded && (
                                <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
                                    <div style={{ padding: "16px 20px 0" }}>
                                        <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Atanmış Yetkiler ({m.permissions.length}/{ALL_PERMISSIONS.length})</p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                                            {ALL_PERMISSIONS.map(p => {
                                                const has = m.permissions.includes(p.key);
                                                return (
                                                    <span key={p.key} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "7px", background: has ? "rgba(139,92,246,0.12)" : "var(--background)", color: has ? "#8B5CF6" : "var(--text-subtle)", border: `1px solid ${has ? "rgba(139,92,246,0.3)" : "var(--border-subtle)"}`, opacity: has ? 1 : 0.5 }}>
                                                        {p.icon} {p.label}
                                                        {!has && <X size={9} />}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div style={{ padding: "14px 20px", display: "flex", gap: "12px", alignItems: "center", background: "var(--background)", borderTop: "1px solid var(--border-subtle)" }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: "0 0 2px", fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Şifre</p>
                                            <code style={{ fontSize: "13px", fontFamily: "monospace", color: "var(--foreground)" }}>
                                                {showPasswords[m.id] ? m.password : "•".repeat(m.password.length)}
                                            </code>
                                        </div>
                                        <button onClick={() => setShowPasswords(prev => ({ ...prev, [m.id]: !prev[m.id] }))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "6px" }}>
                                            {showPasswords[m.id] ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                        {m.notes && (
                                            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic", maxWidth: "400px" }}>📑 {m.notes}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/*  Modal'lar  */}
            {(modal === "ekle" || modal === "duzenle") && (
                <Overlay onClose={() => setModal(null)}>
                    <ModalHeader icon={modal === "ekle" ? "➕" : "✏️"} title={modal === "ekle" ? "Yeni Moderatör Ekle" : `@${selectedMod?.username} Düzenle`} sub={modal === "ekle" ? "Yeni moderatör hesabı oluştur ve yetkilerini belirle" : "Bilgilerini ve yetkilerini düzenle"} />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                        {[
                            { label: "Kullanıcı Adı", val: fUsername, set: setFUsername, ph: "mod_ali", disabled: modal === "duzenle" },
                            { label: "Görünen Ad", val: fDisplayName, set: setFDisplayName, ph: "Ali Moderatör" },
                            { label: "E-posta", val: fEmail, set: setFEmail, ph: "ali@Otosöz.com" },
                            { label: modal === "ekle" ? "Şifre" : "Mevcut Şifre", val: fPassword, set: setFPassword, ph: "min 6 karakter", type: "password" },
                        ].map(f => (
                            <div key={f.label}>
                                <label style={lbl}>{f.label}</label>
                                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} type={f.type || "text"} disabled={f.disabled}
                                    style={{ ...inp, opacity: f.disabled ? 0.5 : 1, cursor: f.disabled ? "not-allowed" : "text" }} />
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: "14px" }}>
                        <label style={lbl}>Avatar Emoji</label>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {["🛠️", "⚡", "🚗", "⚙️", "💬", "🛡️", "🤔"].map(em => (
                                <button key={em} onClick={() => setFAvatar(em)} style={{ width: "40px", height: "40px", fontSize: "20px", borderRadius: "10px", border: `2px solid ${fAvatar === em ? "var(--primary)" : "var(--border-subtle)"}`, background: fAvatar === em ? "rgba(239,68,68,0.08)" : "var(--background)", cursor: "pointer" }}>
                                    {em}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Yetkiler */}
                    <div style={{ marginBottom: "16px" }}>
                        <label style={lbl}>Yetkiler ({fPerms.length}/{ALL_PERMISSIONS.length} seçili)</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
                            {ALL_PERMISSIONS.map(p => {
                                const has = fPerms.includes(p.key);
                                return (
                                    <button key={p.key} onClick={() => togglePerm(p.key)}
                                        style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: `2px solid ${has ? (p.danger ? "#EF4444" : "#8B5CF6") : "var(--border-subtle)"}`, background: has ? (p.danger ? "rgba(239,68,68,0.06)" : "rgba(139,92,246,0.07)") : "var(--background)", cursor: "pointer", textAlign: "left" }}>
                                        <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>{p.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: "0 0 2px", fontSize: "12px", fontWeight: "700", color: has ? (p.danger ? "#EF4444" : "#8B5CF6") : "var(--foreground)", display: "flex", alignItems: "center", gap: "5px" }}>
                                                {p.label}
                                                {p.danger && <span style={{ fontSize: "9px", background: "rgba(239,68,68,0.1)", color: "#EF4444", padding: "1px 4px", borderRadius: "4px" }}>GÜÇLÜ</span>}
                                            </p>
                                            <p style={{ margin: 0, fontSize: "10px", color: "var(--text-muted)", lineHeight: "1.4" }}>{p.desc}</p>
                                        </div>
                                        <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: has ? (p.danger ? "#EF4444" : "#8B5CF6") : "var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            {has && <CheckCircle size={10} color="white" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <label style={lbl}>Not (opsiyonel)</label>
                        <textarea value={fNotes} onChange={e => setFNotes(e.target.value)} rows={2} placeholder="Bu moderatörle ilgili dahili not..." style={{ ...inp, resize: "none" }} />
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => setModal(null)} style={cancelBtn}>İptal</button>
                        <button onClick={modal === "ekle" ? saveNew : saveEdit}
                            style={{ flex: 2, padding: "13px", borderRadius: "10px", background: "var(--primary)", border: "none", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                            {modal === "ekle" ? "Moderatör Oluştur" : "Değişiklikleri Kaydet"}
                        </button>
                    </div>
                </Overlay>
            )}

            {/* Şifre Değiştir */}
            {modal === "sifre" && selectedMod && (
                <Overlay onClose={() => setModal(null)}>
                    <ModalHeader icon="🔑" title={`Şifre Değiştir`} sub={`@${selectedMod.username} için yeni Şifre belirle`} />
                    <label style={lbl}>Yeni Şifre</label>
                    <div style={{ position: "relative", marginBottom: "18px" }}>
                        <input type={showNewPass ? "text" : "password"} value={fNewPass} onChange={e => setFNewPass(e.target.value)} placeholder="En az 6 karakter..."
                            style={{ ...inp, paddingRight: "44px" }} />
                        <button onClick={() => setShowNewPass(v => !v)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                            {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => setModal(null)} style={cancelBtn}>İptal</button>
                        <button onClick={changePassword} disabled={fNewPass.length < 6}
                            style={{ flex: 2, padding: "13px", borderRadius: "10px", background: "#F59E0B", border: "none", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer", opacity: fNewPass.length >= 6 ? 1 : 0.4 }}>
                            Şifreyi Güncelle
                        </button>
                    </div>
                </Overlay>
            )}

            {/* Ban Modal */}
            {modal === "ban" && selectedMod && (
                <Overlay onClose={() => setModal(null)}>
                    <ModalHeader icon="🚫" title={`@${selectedMod.username} Banlanıyor`} sub="Bu moderatör hesabına giriş yapamayacak." />
                    <label style={lbl}>Ban Sebebi</label>
                    <textarea value={banReason} onChange={e => setBanReason(e.target.value)} rows={3} placeholder="Neden banlandığını açıklayın..."
                        style={{ ...inp, resize: "none", marginBottom: "18px" }} />
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => setModal(null)} style={cancelBtn}>Vazgeç</button>
                        <button onClick={banMod} style={{ flex: 2, padding: "13px", borderRadius: "10px", background: "#EF4444", border: "none", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                            Hesabı Banla
                        </button>
                    </div>
                </Overlay>
            )}

            {/* Sil Onay */}
            {modal === "delete" && selectedMod && (
                <Overlay onClose={() => setModal(null)}>
                    <ModalHeader icon="🗑️" title={`@${selectedMod.username} Silinsin mi?`} sub="Bu işlem geri alınamaz. Moderatör hesabı tamamen kaldırılır." />
                    <div style={{ padding: "14px", background: "rgba(239,68,68,0.07)", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.2)", marginBottom: "20px" }}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#EF4444", fontWeight: "600" }}>
                            ⚠️ @{selectedMod.username} ({selectedMod.displayName}) — {selectedMod.actionCount} işlem kaydı, {selectedMod.permissions.length} yetki
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => setModal(null)} style={cancelBtn}>Vazgeç</button>
                        <button onClick={deleteMod} style={{ flex: 2, padding: "13px", borderRadius: "10px", background: "#EF4444", border: "none", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                            Kesin Olarak Sil
                        </button>
                    </div>
                </Overlay>
            )}

            {/* Toast */}
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

//  Yardımcı bileşenler 
function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <>
            <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1100, backdropFilter: "blur(3px)" }} />
            <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "620px", maxHeight: "88vh", overflowY: "auto", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", zIndex: 1200, padding: "28px", animation: "popIn 0.2s ease" }}>
                {children}
            </div>
        </>
    );
}

function ModalHeader({ icon, title, sub }: { icon: string; title: string; sub: string }) {
    return (
        <div style={{ marginBottom: "22px" }}>
            <h3 style={{ margin: "0 0 5px", fontSize: "18px", fontWeight: "800", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "22px" }}>{icon}</span> {title}
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>{sub}</p>
        </div>
    );
}

function iconBtn(color: string): React.CSSProperties {
    return { width: "32px", height: "32px", borderRadius: "8px", border: `1px solid ${color}30`, background: `${color}10`, color, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };
}

const lbl: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "7px" };
const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: "9px", border: "1px solid var(--border-subtle)", background: "var(--background)", color: "var(--foreground)", fontSize: "13px", outline: "none", boxSizing: "border-box" };
const cancelBtn: React.CSSProperties = { flex: 1, padding: "13px", borderRadius: "10px", background: "var(--background)", border: "1px solid var(--border-subtle)", color: "var(--foreground)", fontSize: "14px", fontWeight: "600", cursor: "pointer" };
