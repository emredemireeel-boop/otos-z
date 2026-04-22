"use client";

import { useState } from "react";
import {
    Star, Award, ChevronRight, Search, X, Plus, Crown,
    Shield, CheckCircle, Clock, User, Trophy, Zap,
    Edit2, Trash2, TrendingUp, ArrowUpRight, ChevronDown
} from "lucide-react";


//  Tipler 
type Level = "çaylak" | "yazar" | "muhabir" | "editör" | "moderatör" | "kıdemli";

interface Badge {
    id: string;
    name: string;
    emoji: string;
    description: string;
    color: string;
    type: "manuel" | "otomatik";
    count: number; // kaç kullanıcıda
}

interface UserWithLevel {
    username: string;
    displayName: string;
    city: string;
    carBrand: string;
    level: Level;
    entryCount: number;
    reputation: number;
    badges: string[];
    joinDate: string;
}

const BADGES: Badge[] = [
    { id: "b1", name: "OtoExpert", emoji: "🏆", description: "Teknik konularda güvenilir bilgi üreten yazarlar", color: "#3B82F6", type: "manuel", count: 8 },
    { id: "b2", name: "Güvenilir Satıcı", emoji: " ", description: "Pazar'da başarılı işlem geçmişi", color: "#10B981", type: "manuel", count: 14 },
    { id: "b3", name: "Trend Yapıcı", emoji: "📈", description: "Siteye gündem olan içerik üretmiş", color: "#EF4444", type: "otomatik", count: 5 },
    { id: "b4", name: "Eski Üye", emoji: "📅", description: "2+ yıldır aktif platform üyesi", color: "#8B5CF6", type: "otomatik", count: 19 },
    { id: "b5", name: "Editör Seçimi", emoji: "🌟", description: "Yönetici tarafından öne çıkarılmış içerik", color: "#F59E0B", type: "manuel", count: 3 },
    { id: "b6", name: "Beta Katılımcı", emoji: "⚡", description: "Platform beta döneminde katılan üye", color: "#6B7280", type: "manuel", count: 6 },
    { id: "b7", name: "Süvari", emoji: "🐎", description: "10,000+ beğeni almış", color: "#EC4899", type: "otomatik", count: 2 },
    { id: "b8", name: "Garaj Doğrulandı", emoji: "🛡️", description: "Güvenmetre ile araç sahipliği doğrulanmış", color: "#14B8A6", type: "otomatik", count: 22 },
];

const LEVELS: { key: Level; label: string; color: string; bg: string; icon: React.ReactNode; minEntry: number }[] = [
    { key: "çaylak", label: "Çaylak", color: "#6B7280", bg: "rgba(107,114,128,0.1)", icon: <User size={12} />, minEntry: 0 },
    { key: "yazar", label: "Yazar", color: "#3B82F6", bg: "rgba(59,130,246,0.1)", icon: <Zap size={12} />, minEntry: 10 },
    { key: "muhabir", label: "Muhabir", color: "#10B981", bg: "rgba(16,185,129,0.1)", icon: <Star size={12} />, minEntry: 50 },
    { key: "editör", label: "Editör", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: <Crown size={12} />, minEntry: 200 },
    { key: "moderatör", label: "Moderatör", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)", icon: <Shield size={12} />, minEntry: 0 },
    { key: "kıdemli", label: "Kıdemli", color: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: <Trophy size={12} />, minEntry: 1000 },
];

const generateUsers = (): UserWithLevel[] => [];

const MOCK_USERS = generateUsers();

type Tab = "kullanicilar" | "rozetler" | "seviyeler";

interface AssignModal {
    user: UserWithLevel;
    type: "badge" | "level";
}

export default function AdminRozetlerPage() {
    const [tab, setTab] = useState<Tab>("kullanicilar");
    const [users, setUsers] = useState(MOCK_USERS);
    const [badges, setBadges] = useState(BADGES);
    const [search, setSearch] = useState("");
    const [levelFilter, setLevelFilter] = useState<Level | "hepsi">("hepsi");
    const [assignModal, setAssignModal] = useState<AssignModal | null>(null);
    const [selectedBadge, setSelectedBadge] = useState("");
    const [selectedLevel, setSelectedLevel] = useState<Level>("yazar");
    const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null);

    // Yeni rozet form
    const [showNewBadge, setShowNewBadge] = useState(false);
    const [newBadgeName, setNewBadgeName] = useState("");
    const [newBadgeEmoji, setNewBadgeEmoji] = useState("🏆");
    const [newBadgeDesc, setNewBadgeDesc] = useState("");
    const [newBadgeColor, setNewBadgeColor] = useState("#3B82F6");

    const showToast = (msg: string, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const assignBadge = () => {
        if (!assignModal || !selectedBadge) return;
        setUsers(us => us.map(u =>
            u.username === assignModal.user.username && !u.badges.includes(selectedBadge)
                ? { ...u, badges: [...u.badges, selectedBadge] } : u
        ));
        setBadges(bs => bs.map(b => b.name === selectedBadge ? { ...b, count: b.count + 1 } : b));
        showToast(`✓ @${assignModal.user.username} → "${selectedBadge}" rozeti verildi.`);
        setAssignModal(null); setSelectedBadge("");
    };

    const upgradeLevel = () => {
        if (!assignModal) return;
        setUsers(us => us.map(u =>
            u.username === assignModal.user.username ? { ...u, level: selectedLevel } : u
        ));
        showToast(`✓ @${assignModal.user.username} seviyesi → ${selectedLevel} yapıldı.`);
        setAssignModal(null);
    };

    const removeBadge = (username: string, badge: string) => {
        setUsers(us => us.map(u =>
            u.username === username ? { ...u, badges: u.badges.filter(b => b !== badge) } : u
        ));
        setBadges(bs => bs.map(b => b.name === badge ? { ...b, count: Math.max(0, b.count - 1) } : b));
        showToast(`Rozet kaldırıldı.`, "warning");
    };

    const createBadge = () => {
        if (!newBadgeName.trim()) return;
        const nb: Badge = { id: `b-${Date.now()}`, name: newBadgeName, emoji: newBadgeEmoji, description: newBadgeDesc, color: newBadgeColor, type: "manuel", count: 0 };
        setBadges(bs => [nb, ...bs]);
        setNewBadgeName(""); setNewBadgeDesc(""); setShowNewBadge(false);
        showToast(`✓ "${nb.emoji} ${nb.name}" rozeti oluşturuldu.`);
    };

    const filteredUsers = users
        .filter(u => levelFilter === "hepsi" || u.level === levelFilter)
        .filter(u => !search || u.username.includes(search.toLowerCase()) || u.displayName.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ position: "relative", paddingBottom: "40px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Award size={24} color="#F59E0B" /> Rozet & Seviye Yönetimi
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Kullanıcı seviyelerini ve özel rozetleri yönet</p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "5px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "11px", padding: "4px", marginBottom: "22px", width: "fit-content" }}>
                {([
                    { key: "kullanicilar", label: "👍¤ Kullanıcılar" },
                    { key: "rozetler", label: " Rozetler" },
                    { key: "seviyeler", label: "📊 Seviye Sistemi" },
                ] as { key: Tab; label: string }[]).map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: tab === t.key ? "var(--primary)" : "transparent", color: tab === t.key ? "white" : "var(--text-muted)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/*  KULLANICILAR  */}
            {tab === "kullanicilar" && (
                <>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "4px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "4px" }}>
                            <button onClick={() => setLevelFilter("hepsi")} style={{ padding: "6px 10px", borderRadius: "7px", border: "none", background: levelFilter === "hepsi" ? "var(--primary)" : "transparent", color: levelFilter === "hepsi" ? "white" : "var(--text-muted)", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>Tümü</button>
                            {LEVELS.map(l => (
                                <button key={l.key} onClick={() => setLevelFilter(l.key)} style={{ padding: "6px 10px", borderRadius: "7px", border: "none", background: levelFilter === l.key ? l.color : "transparent", color: levelFilter === l.key ? "white" : "var(--text-muted)", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>{l.label}</button>
                            ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "0 12px", height: "38px", width: "200px", gap: "7px", marginLeft: "auto" }}>
                            <Search size={13} style={{ color: "var(--text-muted)" }} />
                            <input type="text" placeholder="Kullanıcı ara..." value={search} onChange={e => setSearch(e.target.value)}
                                style={{ border: "none", background: "transparent", outline: "none", width: "100%", color: "var(--foreground)", fontSize: "13px" }} />
                            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={12} /></button>}
                        </div>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '60px 24px', textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📌</div>
                            <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: '800', color: 'var(--foreground)' }}>Henuz kullanici yok</h3>
                            <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>Kullanicilar platforma kayit oldukca burada listelenecek.</p>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-subtle)' }}>Rozet ve seviye atamalari bu panel uzerinden yapilacak.</p>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {filteredUsers.map(u => {
                            const lv = LEVELS.find(l => l.key === u.level)!;
                            return (
                                <div key={u.username} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "14px 18px", display: "flex", gap: "14px", alignItems: "center" }}>
                                    <div style={{ width: "42px", height: "42px", borderRadius: "11px", background: lv.bg, display: "flex", alignItems: "center", justifyContent: "center", color: lv.color, flexShrink: 0 }}>
                                        {lv.icon}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                                            <span style={{ fontSize: "14px", fontWeight: "800", color: "var(--foreground)" }}>{u.displayName}</span>
                                            <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>@{u.username}</span>
                                            <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "10px", fontWeight: "700", background: lv.bg, color: lv.color, padding: "2px 7px", borderRadius: "6px" }}>{lv.icon} {lv.label}</span>
                                            {u.badges.map(b => {
                                                const bd = badges.find(x => x.name === b);
                                                return bd ? (
                                                    <span key={b} style={{ fontSize: "10px", fontWeight: "700", background: `${bd.color}15`, color: bd.color, padding: "2px 7px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "3px", cursor: "pointer" }}
                                                        onClick={() => removeBadge(u.username, b)}>
                                                        {bd.emoji} {bd.name} <X size={9} />
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                                            {u.entryCount} entry · {u.reputation.toLocaleString("tr-TR")} rep · {u.carBrand} · {u.city}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", gap: "7px", flexShrink: 0 }}>
                                        <button onClick={() => { setAssignModal({ user: u, type: "badge" }); setSelectedBadge(badges[0]?.name || ""); }}
                                            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "8px", border: "1px solid rgba(245,158,11,0.4)", background: "rgba(245,158,11,0.08)", color: "#F59E0B", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                                            <Award size={13} /> Rozet Ver
                                        </button>
                                        <button onClick={() => { setAssignModal({ user: u, type: "level" }); setSelectedLevel(u.level); }}
                                            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "8px", border: "1px solid rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.08)", color: "#8B5CF6", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                                            <TrendingUp size={13} /> Seviye Değiştir
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/*  ROZETLER  */}
            {tab === "rozetler" && (
                <>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
                        <button onClick={() => setShowNewBadge(v => !v)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--primary)", border: "none", color: "white", padding: "10px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>
                            <Plus size={14} /> Yeni Rozet Oluştur
                        </button>
                    </div>

                    {showNewBadge && (
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "20px", marginBottom: "16px", borderLeft: "4px solid #F59E0B" }}>
                            <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "800", color: "var(--foreground)" }}>Yeni Rozet</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "0.5fr 2fr 3fr 0.8fr", gap: "12px", marginBottom: "12px" }}>
                                <div><label style={labelStyle}>Emoji</label><input value={newBadgeEmoji} onChange={e => setNewBadgeEmoji(e.target.value)} style={{ ...inputStyle, fontSize: "20px", textAlign: "center" }} /></div>
                                <div><label style={labelStyle}>Rozet Adı</label><input value={newBadgeName} onChange={e => setNewBadgeName(e.target.value)} placeholder="Örn: OtoExpert" style={inputStyle} /></div>
                                <div><label style={labelStyle}>Açıklama</label><input value={newBadgeDesc} onChange={e => setNewBadgeDesc(e.target.value)} placeholder="Bu rozet ne anlama geliyor?" style={inputStyle} /></div>
                                <div><label style={labelStyle}>Renk</label><input type="color" value={newBadgeColor} onChange={e => setNewBadgeColor(e.target.value)} style={{ ...inputStyle, padding: "4px", height: "40px", cursor: "pointer" }} /></div>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button onClick={() => setShowNewBadge(false)} style={cancelBtnStyle}>İptal</button>
                                <button onClick={createBadge} style={{ flex: 2, padding: "11px", borderRadius: "10px", background: "var(--primary)", border: "none", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Oluştur</button>
                            </div>
                        </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "12px" }}>
                        {badges.map(b => (
                            <div key={b.id} style={{ background: "var(--card-bg)", border: `1px solid ${b.color}30`, borderRadius: "14px", padding: "18px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${b.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                                    {b.emoji}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                                        <span style={{ fontSize: "14px", fontWeight: "800", color: "var(--foreground)" }}>{b.name}</span>
                                        <span style={{ fontSize: "10px", fontWeight: "700", background: b.type === "manuel" ? "rgba(139,92,246,0.1)" : "rgba(16,185,129,0.1)", color: b.type === "manuel" ? "#8B5CF6" : "#10B981", padding: "2px 6px", borderRadius: "5px" }}>{b.type === "manuel" ? "Manuel" : "Otomatik"}</span>
                                    </div>
                                    <p style={{ margin: "0 0 10px", fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>{b.description}</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "12px", fontWeight: "700", color: b.color }}>{b.count} kullanıcıda</span>
                                        <div style={{ flex: 1, height: "4px", background: "var(--border-subtle)", borderRadius: "2px", overflow: "hidden" }}>
                                            <div style={{ width: `${Math.min(100, (b.count / 25) * 100)}%`, height: "100%", background: b.color, borderRadius: "2px" }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/*  SEVİYELER  */}
            {tab === "seviyeler" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {LEVELS.map((l, i) => {
                        const count = users.filter(u => u.level === l.key).length;
                        const nextEntry = LEVELS[i + 1]?.minEntry;
                        return (
                            <div key={l.key} style={{ background: "var(--card-bg)", border: `1px solid ${l.color}30`, borderRadius: "14px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px" }}>
                                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: l.bg, display: "flex", alignItems: "center", justifyContent: "center", color: l.color, flexShrink: 0 }}>
                                    {l.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                                        <span style={{ fontSize: "16px", fontWeight: "800", color: l.color }}>{l.label}</span>
                                        <span style={{ fontSize: "12px", fontWeight: "700", background: l.bg, color: l.color, padding: "3px 9px", borderRadius: "7px" }}>{count} kullanıcı</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
                                        {l.minEntry > 0 ? `Minimum ${l.minEntry} entry` : "Yönetici ataması, entry Şartı yok"} ·
                                        {nextEntry ? ` Sonraki seviye: ${nextEntry} entry` : " En üst seviye"}
                                    </p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px" }}>
                                    <div style={{ width: "120px", height: "8px", background: "var(--border-subtle)", borderRadius: "4px", overflow: "hidden" }}>
                                        <div style={{ width: `${(count / MOCK_USERS.length) * 100}%`, height: "100%", background: l.color, borderRadius: "4px" }} />
                                    </div>
                                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>%{Math.round((count / MOCK_USERS.length) * 100)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Rozet Atama Modal */}
            {assignModal && (
                <>
                    <div onClick={() => setAssignModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1100, backdropFilter: "blur(2px)" }} />
                    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "440px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", zIndex: 1200, padding: "28px", animation: "popIn 0.2s ease" }}>
                        <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "800", color: "var(--foreground)" }}>
                            {assignModal.type === "badge" ? " Rozet Ver" : "📊 Seviye Değiştir"}
                        </h3>
                        <p style={{ margin: "0 0 20px", fontSize: "13px", color: "var(--text-muted)" }}>@{assignModal.user.username} · {assignModal.user.displayName}</p>

                        {assignModal.type === "badge" ? (
                            <>
                                <label style={labelStyle}>Rozet Seç</label>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px", maxHeight: "240px", overflowY: "auto" }}>
                                    {badges.filter(b => !assignModal.user.badges.includes(b.name)).map(b => (
                                        <button key={b.id} onClick={() => setSelectedBadge(b.name)}
                                            style={{ display: "flex", alignItems: "center", gap: "11px", padding: "10px 14px", borderRadius: "10px", border: `2px solid ${selectedBadge === b.name ? b.color : "var(--border-subtle)"}`, background: selectedBadge === b.name ? `${b.color}10` : "var(--background)", cursor: "pointer", textAlign: "left" }}>
                                            <span style={{ fontSize: "20px" }}>{b.emoji}</span>
                                            <div><p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>{b.name}</p><p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)" }}>{b.description}</p></div>
                                            {selectedBadge === b.name && <CheckCircle size={16} color={b.color} style={{ marginLeft: "auto" }} />}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button onClick={() => setAssignModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                                    <button onClick={assignBadge} disabled={!selectedBadge} style={{ flex: 2, padding: "13px", borderRadius: "10px", background: "var(--primary)", border: "none", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer", opacity: selectedBadge ? 1 : 0.4 }}>Rozet Ver</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <label style={labelStyle}>Yeni Seviye</label>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
                                    {LEVELS.map(l => (
                                        <button key={l.key} onClick={() => setSelectedLevel(l.key)}
                                            style={{ display: "flex", alignItems: "center", gap: "11px", padding: "10px 14px", borderRadius: "10px", border: `2px solid ${selectedLevel === l.key ? l.color : "var(--border-subtle)"}`, background: selectedLevel === l.key ? l.bg : "var(--background)", cursor: "pointer" }}>
                                            <span style={{ color: l.color }}>{l.icon}</span>
                                            <span style={{ fontSize: "13px", fontWeight: "700", color: l.color }}>{l.label}</span>
                                            {l.minEntry > 0 && <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>min {l.minEntry} entry</span>}
                                            {(l.key === "moderatör" || l.key === "kıdemli") && <span style={{ fontSize: "10px", background: "rgba(139,92,246,0.1)", color: "#8B5CF6", padding: "1px 6px", borderRadius: "5px", fontWeight: "700" }}>Manuel</span>}
                                            {selectedLevel === l.key && <CheckCircle size={16} color={l.color} style={{ marginLeft: "auto" }} />}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button onClick={() => setAssignModal(null)} style={cancelBtnStyle}>Vazgeç</button>
                                    <button onClick={upgradeLevel} style={{ flex: 2, padding: "13px", borderRadius: "10px", background: "var(--primary)", border: "none", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Uygula</button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {toast && (
                <div style={{ position: "fixed", bottom: "32px", right: "32px", background: toast.type === "warning" ? "#F59E0B" : "#10B981", color: "white", padding: "14px 20px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", fontWeight: "600", fontSize: "14px", zIndex: 9999, animation: "slideUp 0.3s ease" }}>
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

const labelStyle: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: "9px", border: "1px solid var(--border-subtle)", background: "var(--background)", color: "var(--foreground)", fontSize: "13px", outline: "none", boxSizing: "border-box" };
const cancelBtnStyle: React.CSSProperties = { flex: 1, padding: "13px", borderRadius: "10px", background: "var(--background)", border: "1px solid var(--border-subtle)", color: "var(--foreground)", fontSize: "14px", fontWeight: "600", cursor: "pointer" };
