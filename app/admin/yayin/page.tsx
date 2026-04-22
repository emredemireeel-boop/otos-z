"use client";

import { useState } from "react";
import {
    Send, Users, Crown, User, Bell, CheckCircle, Clock,
    AlertTriangle, Eye, Trash2, Plus, ChevronRight, Search,
    X, Megaphone, Tag, Calendar, BarChart3
} from "lucide-react";


//  Tipler 
type Target = "hepsi" | "yazarlar" | "premium" | "caylakar" | "tek_kullanici";
type MsgType = "bilgi" | "uyari" | "duyuru" | "odul";
type MsgStatus = "gonderildi" | "planlandi" | "taslak";

interface Message {
    id: string;
    title: string;
    body: string;
    target: Target;
    type: MsgType;
    status: MsgStatus;
    sentAt?: string;
    scheduledFor?: string;
    recipientCount: number;
    openRate?: number;
}

const MOCK_MESSAGES: Message[] = [
    { id: "m-001", title: "Güvenmetre Sistemi Yenilendi!", body: "Sevgili Otosöz üyeleri, Güvenmetre sistemimiz yenilendi. Artık araç sahipliğinizi çok daha kolay doğrulayabilirsiniz.", target: "hepsi", type: "duyuru", status: "gonderildi", sentAt: "17.04.2026 - 18:00", recipientCount: 35, openRate: 68 },
    { id: "m-002", title: "Premium Üyelik Kampanyası", body: "Nisan ayına özel %30 indirimle premium üye olun! Vitrin ilanı hakkı + özel rozet sizi bekliyor.", target: "yazarlar", type: "duyuru", status: "gonderildi", sentAt: "15.04.2026 - 10:00", recipientCount: 20, openRate: 54 },
    { id: "m-003", title: "Forum Kuralları Güncellendi", body: "Platform kurallarında yapılan değişiklikler hakkında bilgilendirme mesajı.", target: "hepsi", type: "bilgi", status: "planlandi", scheduledFor: "20.04.2026 - 09:00", recipientCount: 35 },
    { id: "m-004", title: "⚠️ Sistem Bakımı", body: "18 Nisan saat 03:00-05:00 arası kısa süreli bakım yapılacak.", target: "hepsi", type: "uyari", status: "taslak", recipientCount: 35 },
];

const TARGETS: { key: Target; label: string; desc: string; icon: React.ReactNode; count: number; color: string }[] = [
    { key: "hepsi", label: "Tum Kullanicilar", desc: "Kayitli tum platform uyeleri", icon: <Users size={16} />, count: 0, color: "#6B7280" },
    { key: "yazarlar", label: "Yazarlar", desc: "Yazar seviyesine ulasmis kullanicilar", icon: <User size={16} />, count: 0, color: "#3B82F6" },
    { key: "premium", label: "Premium Uyeler", desc: "Aktif premium aboneligi olanlar", icon: <Crown size={16} />, count: 0, color: "#F59E0B" },
    { key: "caylakar", label: "Caylaklar", desc: "Henuz yazar olmayan yeni uyeler", icon: <User size={16} />, count: 0, color: "#8B5CF6" },
    { key: "tek_kullanici", label: "Tek Kullanici", desc: "Belirli bir kullaniciya ozel mesaj", icon: <Tag size={16} />, count: 1, color: "#10B981" },
];

const MSG_TYPE_STYLE: Record<MsgType, { bg: string; color: string; label: string; emoji: string }> = {
    bilgi: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6", label: "Bilgi", emoji: "🔔" },
    uyari: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", label: "Uyarı", emoji: "⚠️" },
    duyuru: { bg: "rgba(239,68,68,0.1)", color: "#EF4444", label: "Duyuru", emoji: "📑" },
    odul: { bg: "rgba(16,185,129,0.1)", color: "#10B981", label: "Ödül", emoji: "🔔" },
};

const STATUS_STYLE: Record<MsgStatus, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
    gonderildi: { bg: "rgba(16,185,129,0.1)", color: "#10B981", label: "Gönderildi", icon: <CheckCircle size={11} /> },
    planlandi: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6", label: "Planlandı", icon: <Clock size={11} /> },
    taslak: { bg: "rgba(107,114,128,0.1)", color: "#6B7280", label: "Taslak", icon: <Eye size={11} /> },
};

export default function AdminYayinPage() {
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [showCompose, setShowCompose] = useState(false);
    const [preview, setPreview] = useState<Message | null>(null);
    const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [target, setTarget] = useState<Target>("hepsi");
    const [msgType, setMsgType] = useState<MsgType>("duyuru");
    const [scheduledFor, setScheduledFor] = useState("");
    const [targetUser, setTargetUser] = useState("");

    const showToast = (msg: string, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const targetInfo = TARGETS.find(t => t.key === target)!;

    const sendMessage = (asDraft: boolean = false) => {
        if (!title.trim() || !body.trim()) { showToast("Başlık ve mesaj gerekli!", "error"); return; }
        const nm: Message = {
            id: `m-${Date.now()}`, title, body, target, type: msgType,
            status: asDraft ? "taslak" : scheduledFor ? "planlandi" : "gonderildi",
            sentAt: !asDraft && !scheduledFor ? new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : undefined,
            scheduledFor: scheduledFor || undefined,
            recipientCount: target === "tek_kullanici" ? 1 : targetInfo.count,
            openRate: !asDraft && !scheduledFor ? 0 : undefined,
        };
        setMessages(prev => [nm, ...prev]);
        setTitle(""); setBody(""); setTarget("hepsi"); setMsgType("duyuru"); setScheduledFor(""); setTargetUser("");
        setShowCompose(false);
        showToast(asDraft ? "Taslak kaydedildi." : scheduledFor ? `✓ Mesaj planlandı: ${scheduledFor}` : ` Mesaj ${nm.recipientCount} kişiye gönderildi!`);
    };

    const deleteMsg = (id: string) => {
        setMessages(prev => prev.filter(m => m.id !== id));
        showToast("Mesaj silindi.", "warning");
    };

    const totalSent = messages.filter(m => m.status === "gonderildi").reduce((s, m) => s + m.recipientCount, 0);
    const avgOpen = messages.filter(m => m.openRate !== undefined).reduce((s, m) => s + (m.openRate || 0), 0) / (messages.filter(m => m.openRate !== undefined).length || 1);

    return (
        <div style={{ position: "relative", paddingBottom: "40px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Megaphone size={24} color="#EF4444" /> Toplu Mesaj Yayını
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Tüm kullanıcılara veya belirli gruplara mesaj ve bildirim gönder</p>
                </div>
                <button onClick={() => setShowCompose(v => !v)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--primary)", border: "none", color: "white", padding: "10px 18px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>
                    <Plus size={15} /> Yeni Mesaj Yaz
                </button>
            </div>

            {/* Özet Kartlar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "22px" }}>
                {[
                    { label: "Toplam Gönderilen", val: totalSent, icon: <Send size={18} />, color: "#10B981" },
                    { label: "Ortalama Açılma", val: `%${Math.round(avgOpen)}`, icon: <Eye size={18} />, color: "#3B82F6" },
                    { label: "Planlanan", val: messages.filter(m => m.status === "planlandi").length, icon: <Clock size={18} />, color: "#F59E0B" },
                    { label: "Taslak", val: messages.filter(m => m.status === "taslak").length, icon: <BarChart3 size={18} />, color: "#6B7280" },
                ].map(s => (
                    <div key={s.label} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>{s.icon}</div>
                        <div>
                            <p style={{ margin: "0 0 2px", fontSize: "20px", fontWeight: "900", color: "var(--foreground)" }}>{s.val}</p>
                            <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mesaj Yazma Formu */}
            {showCompose && (
                <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px", marginBottom: "22px", borderLeft: "4px solid var(--primary)" }}>
                    <h3 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: "800", color: "var(--foreground)" }}> Yeni Mesaj Oluştur</h3>

                    {/* Hedef Seçimi */}
                    <label style={labelStyle}>Hedef Kitle</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "8px", marginBottom: "16px" }}>
                        {TARGETS.map(t => (
                            <button key={t.key} onClick={() => setTarget(t.key)}
                                style={{ padding: "10px", borderRadius: "10px", border: `2px solid ${target === t.key ? t.color : "var(--border-subtle)"}`, background: target === t.key ? `${t.color}10` : "var(--background)", cursor: "pointer", textAlign: "center" }}>
                                <div style={{ color: target === t.key ? t.color : "var(--text-muted)", marginBottom: "5px", display: "flex", justifyContent: "center" }}>{t.icon}</div>
                                <p style={{ margin: 0, fontSize: "11px", fontWeight: "700", color: target === t.key ? t.color : "var(--foreground)" }}>{t.label}</p>
                                <p style={{ margin: 0, fontSize: "10px", color: "var(--text-muted)" }}>{t.count} kişi</p>
                            </button>
                        ))}
                    </div>

                    {target === "tek_kullanici" && (
                        <div style={{ marginBottom: "14px" }}>
                            <label style={labelStyle}>Kullanıcı Adı</label>
                            <div style={{ display: "flex", alignItems: "center", background: "var(--background)", border: "1px solid var(--border-subtle)", borderRadius: "9px", padding: "0 12px", height: "42px", gap: "8px" }}>
                                <User size={14} color="var(--text-muted)" />
                                <input value={targetUser} onChange={e => setTargetUser(e.target.value)} placeholder="@kullaniciadi"
                                    style={{ border: "none", background: "transparent", outline: "none", width: "100%", color: "var(--foreground)", fontSize: "13px" }} />
                            </div>
                        </div>
                    )}

                    {/* Mesaj Tipi */}
                    <div style={{ marginBottom: "14px" }}>
                        <label style={labelStyle}>Mesaj Tipi</label>
                        <div style={{ display: "flex", gap: "7px" }}>
                            {(Object.entries(MSG_TYPE_STYLE) as [MsgType, typeof MSG_TYPE_STYLE[MsgType]][]).map(([key, s]) => (
                                <button key={key} onClick={() => setMsgType(key)}
                                    style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px", borderRadius: "9px", border: `2px solid ${msgType === key ? s.color : "var(--border-subtle)"}`, background: msgType === key ? s.bg : "var(--background)", color: msgType === key ? s.color : "var(--text-muted)", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                                    {s.emoji} {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                        <div>
                            <label style={labelStyle}>Başlık</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Mesaj başlıÃ„şı..." style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Planlı Gönderim (opsiyonel)</label>
                            <input type="datetime-local" value={scheduledFor} onChange={e => setScheduledFor(e.target.value)} style={inputStyle} />
                        </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <label style={labelStyle}>Mesaj İçeriÃ„şi</label>
                        <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="Kullanıcılara gönderilecek mesajı buraya yazın..."
                            style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }} />
                        <p style={{ margin: "4px 0 0", fontSize: "11px", color: "var(--text-muted)", textAlign: "right" }}>{body.length} / 1000</p>
                    </div>

                    {/* Önizleme */}
                    {title && body && (
                        <div style={{ padding: "14px 16px", background: "var(--background)", borderRadius: "10px", border: `1px solid ${MSG_TYPE_STYLE[msgType].color}30`, marginBottom: "16px", borderLeft: `4px solid ${MSG_TYPE_STYLE[msgType].color}` }}>
                            <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Önizleme — {targetInfo.label}</p>
                            <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "800", color: "var(--foreground)" }}>{MSG_TYPE_STYLE[msgType].emoji} {title}</p>
                            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>{body}</p>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => setShowCompose(false)} style={cancelBtnStyle}>İptal</button>
                        <button onClick={() => sendMessage(true)} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid var(--border-subtle)", background: "var(--background)", color: "var(--foreground)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                            Taslak Kaydet
                        </button>
                        <button onClick={() => sendMessage(false)} disabled={!title.trim() || !body.trim()}
                            style={{ flex: 2, padding: "12px", borderRadius: "10px", background: "var(--primary)", border: "none", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer", opacity: title.trim() && body.trim() ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                            <Send size={15} /> {scheduledFor ? "Planla" : `${targetInfo.count} Kişiye Gönder`}
                        </button>
                    </div>
                </div>
            )}

            {/* Mesaj Geçmişi */}
            <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "800", color: "var(--foreground)" }}>Mesaj Geçmişi</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {messages.map(m => {
                    const ts = MSG_TYPE_STYLE[m.type];
                    const ss = STATUS_STYLE[m.status];
                    const tg = TARGETS.find(t => t.key === m.target)!;
                    return (
                        <div key={m.id} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "16px 20px", display: "flex", gap: "14px", alignItems: "center" }}>
                            <div style={{ width: "44px", height: "44px", borderRadius: "11px", background: ts.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                                {ts.emoji}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                                    <span style={{ fontSize: "14px", fontWeight: "800", color: "var(--foreground)" }}>{m.title}</span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "700", background: ss.bg, color: ss.color, padding: "2px 7px", borderRadius: "6px" }}>{ss.icon} {ss.label}</span>
                                    <span style={{ fontSize: "10px", fontWeight: "700", background: `${tg.color}15`, color: tg.color, padding: "2px 7px", borderRadius: "6px" }}>{tg.label}</span>
                                </div>
                                <p style={{ margin: "0 0 4px", fontSize: "12px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.body}</p>
                                <div style={{ display: "flex", gap: "14px" }}>
                                    <span style={{ fontSize: "11px", color: "var(--text-subtle)" }}>
                                        {m.status === "gonderildi" ? `Gönderildi: ${m.sentAt}` : m.status === "planlandi" ? `Planlandı: ${m.scheduledFor}` : "Taslak"}
                                    </span>
                                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>{m.recipientCount} alıcı</span>
                                    {m.openRate !== undefined && <span style={{ fontSize: "11px", color: "#10B981", fontWeight: "700" }}>%{m.openRate} açıldı</span>}
                                </div>
                            </div>
                            <button onClick={() => deleteMsg(m.id)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", padding: "7px", borderRadius: "7px", flexShrink: 0 }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {toast && (
                <div style={{ position: "fixed", bottom: "32px", right: "32px", background: toast.type === "error" ? "#EF4444" : "#10B981", color: "white", padding: "14px 20px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", fontWeight: "600", fontSize: "14px", zIndex: 9999, animation: "slideUp 0.3s ease" }}>
                    {toast.msg}
                </div>
            )}
            <style>{`@keyframes slideUp { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        </div>
    );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: "9px", border: "1px solid var(--border-subtle)", background: "var(--background)", color: "var(--foreground)", fontSize: "13px", outline: "none", boxSizing: "border-box" };
const cancelBtnStyle: React.CSSProperties = { flex: 1, padding: "12px", borderRadius: "10px", background: "var(--background)", border: "1px solid var(--border-subtle)", color: "var(--foreground)", fontSize: "13px", fontWeight: "600", cursor: "pointer" };
