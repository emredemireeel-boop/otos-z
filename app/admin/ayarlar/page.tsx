"use client";

import { useState } from "react";
import {
    Settings, Shield, Globe, Database, Save, CheckCircle,
    RefreshCcw, Bell, Eye, Lock, Users, Zap, AlertTriangle,
    ToggleLeft, ToggleRight, Server, Mail, MessageSquare,
    Palette, Code, Key, Trash2, Upload, Download
} from "lucide-react";

//  Tipler 
interface Toggle {
    id: string;
    title: string;
    description: string;
    active: boolean;
    danger?: boolean;
    premium?: boolean;
}

interface SectionDef {
    id: string;
    icon: React.ReactNode;
    label: string;
    color: string;
}

//  Ayar Bölümleri 
const SECTIONS: SectionDef[] = [
    { id: "genel", icon: <Globe size={16} />, label: "Genel Site", color: "#3B82F6" },
    { id: "guvenlik", icon: <Shield size={16} />, label: "Güvenlik", color: "#EF4444" },
    { id: "kullanici", icon: <Users size={16} />, label: "Kullanıcı", color: "#8B5CF6" },
    { id: "bildirim", icon: <Bell size={16} />, label: "Bildirimler", color: "#F59E0B" },
    { id: "performans", icon: <Zap size={16} />, label: "Performans", color: "#10B981" },
    { id: "gelisim", icon: <Code size={16} />, label: "Geliştirici", color: "#6B7280" },
];

const INITIAL_TOGGLES: Record<string, Toggle[]> = {
    genel: [
        { id: "g1", title: "Bakım Modu", description: "Tüm ziyaretçiler 'Bakımdayız' ekranı görür. Adminler erişebilir.", active: false, danger: true },
        { id: "g2", title: "Yeni Kayıt Kabul", description: "Siteye yeni üye kaydı alınmasını açar/kapatır.", active: true },
        { id: "g3", title: "Misafir Görüntüleme", description: "Kayıtsız kullanıcılar forum başlıklarını ve entryleri okuyabilir.", active: true },
        { id: "g4", title: "Sözlük Açık", description: "Forum/Sözlük kısmı aktif ve erişilebilir durumda.", active: true },
        { id: "g5", title: "Pazar Açık", description: "Araç alım-satım pazar yeri erişilebilir durumda.", active: true },
        { id: "g6", title: "Araç DNA Açık", description: "Araç karşılaştırma ve DNA sayfaları erişilebilir.", active: true },
    ],
    guvenlik: [
        { id: "s1", title: "Brute-Force Koruması", description: "5 başarısız girişte IP geçici olarak engellenir.", active: true },
        { id: "s2", title: "Captcha (Kayıt)", description: "Yeni üye kaydında reCAPTCHA / Turnstile doÃ„şrulaması istenir.", active: true },
        { id: "s3", title: "CSRF Koruması", description: "Cross-Site Request Forgery token doÃ„şrulaması aktif.", active: true },
        { id: "s4", title: "Rate Limiting (API)", description: "Dakikada 100+ istek atan IP'ler geçici olarak bloklanır.", active: true },
        { id: "s5", title: "IP Blacklist Aktif", description: "Manuel eklenen kötü niyetli IP adresleri engellenir.", active: false },
        { id: "s6", title: "2FA Admin Giriş", description: "Admin paneli girişleri iki faktörlü doÃ„şrulama gerektirir.", active: false, premium: true },
    ],
    kullanici: [
        { id: "u1", title: "Çaylak Entry Limiti (30)", description: "Bot saldırısına karşı: Yazar olmak için 10 yerine 30 entry Şartı.", active: true },
        { id: "u2", title: "Görsel Yükleme Aktif", description: "Forum ve pazarda kullanıcı resim/medya yüklemesine izin verir.", active: true },
        { id: "u3", title: "PM Sistemi Aktif", description: "Kullanıcılar arası özel mesajlaşma sistemi aktif.", active: false, premium: true },
        { id: "u4", title: "Garaj Profili (Beta)", description: "Kullanıcı garası ve Güvenmetre rozetleri profillerde gösterilir.", active: true },
        { id: "u5", title: "Kullanıcı Rapor Sistemi", description: "Ziyaretçiler entry ve başlıkları raporlayabilir.", active: true },
        { id: "u6", title: "Başlık Oluşturma (Yazarlar)", description: "Yazar seviyesi kullanıcılar yeni başlık açabilir.", active: true },
    ],
    bildirim: [
        { id: "n1", title: "E-posta Bildirimleri", description: "Sistem geneli e-posta bildirimleri aktif (SMTP ile).", active: true },
        { id: "n2", title: "Site İçi Bildirimler", description: "Kullanıcılara uygulama içi cevap/beÃ„şeni bildirimleri.", active: true },
        { id: "n3", title: "Admin Uyarı Mailleri", description: "Kritik olaylarda (ban, rapor, hack girişimi) admin'e mail.", active: true },
        { id: "n4", title: "Haftalık Özet Maili", description: "Her Pazartesi istatistik özeti adminlere gönderilir.", active: false },
    ],
    performans: [
        { id: "p1", title: "Next.js Cache Aktif", description: "Sık ziyaret edilen sayfalar önbellekte tutulur.", active: true },
        { id: "p2", title: "Görsel Optimizasyon", description: "Yüklenen görseller WebP formatına otomatik dönüştürülür.", active: true },
        { id: "p3", title: "Lazy Loading", description: "Uzak içerikler (resim, video) görünüme girince yüklenir.", active: true },
        { id: "p4", title: "CDN Aktif", description: "Statik dosyalar CDN üzerinden sunulur.", active: false, premium: true },
    ],
    gelisim: [
        { id: "d1", title: "Debug Modu", description: "Hata ayıklama logları konsola ve admin paneline yazar.", active: false, danger: true },
        { id: "d2", title: "API Sandbox Modu", description: "Ödeme ve SMS entegrasyonları test modunda çalışır.", active: true },
        { id: "d3", title: "Mock Data (Demo)", description: "Gerçek DB yerine sahte veri kaynakları kullanılır.", active: true },
        { id: "d4", title: "Error Tracking (Sentry)", description: "Üretim hataları Sentry'ye raporlanır.", active: false },
    ],
};

const PLATFORM_CONFIG = {
    siteName: "Otosöz",
    siteSlogan: "Otomobil SözlüÃ„şü",
    entryPerPage: "20",
    maxEntryLength: "5000",
    maxTitleLength: "200",
    minEntryLength: "10",
    contactEmail: "admin@Otosöz.com",
    supportEmail: "destek@Otosöz.com",
    discordUrl: "https://discord.gg/Otosöz",
};

export default function AdminAyarlarPage() {
    const [activeSection, setActiveSection] = useState("genel");
    const [toggles, setToggles] = useState(INITIAL_TOGGLES);
    const [config, setConfig] = useState(PLATFORM_CONFIG);
    const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null);
    const [saving, setSaving] = useState(false);

    const showToast = (msg: string, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleToggle = (section: string, id: string) => {
        setToggles(prev => ({
            ...prev,
            [section]: prev[section].map(t => t.id === id ? { ...t, active: !t.active } : t),
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setSaving(false);
        showToast("✓ Tüm ayarlar kaydedildi ve canlıya yansıdı!");
    };

    const handleClearCache = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 600));
        setSaving(false);
        showToast(" Önbellek başarıyla temizlendi!");
    };

    const curToggles = toggles[activeSection] || [];
    const activeCount = curToggles.filter(t => t.active).length;

    return (
        <div style={{ position: "relative", paddingBottom: "40px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Settings size={24} color="var(--primary)" /> Sistem Ayarları
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Platform geneli tüm ayarlar, özellikler ve konfigürasyonlar</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={handleClearCache} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)", padding: "10px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                        <RefreshCcw size={14} /> Cache Temizle
                    </button>
                    <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "8px", background: saving ? "rgba(16,185,129,0.7)" : "#10B981", border: "none", color: "white", padding: "10px 18px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>
                        {saving ? <RefreshCcw size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : <Save size={14} />}
                        {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </button>
                </div>
            </div>

            {/* 2-kolon layout */}
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "20px" }}>
                {/* Sol nav */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {SECTIONS.map(s => (
                        <button key={s.id} onClick={() => setActiveSection(s.id)}
                            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", borderRadius: "10px", border: activeSection === s.id ? `1px solid ${s.color}40` : "1px solid transparent", background: activeSection === s.id ? `${s.color}10` : "transparent", color: activeSection === s.id ? s.color : "var(--text-muted)", cursor: "pointer", fontSize: "13px", fontWeight: "700", textAlign: "left", transition: "all 0.15s" }}>
                            {s.icon} {s.label}
                            <span style={{ marginLeft: "auto", fontSize: "10px", background: activeSection === s.id ? `${s.color}25` : "var(--background)", color: activeSection === s.id ? s.color : "var(--text-muted)", padding: "1px 6px", borderRadius: "8px", fontWeight: "800", border: "1px solid var(--border-subtle)" }}>
                                {(toggles[s.id] || []).filter(t => t.active).length}/{(toggles[s.id] || []).length}
                            </span>
                        </button>
                    ))}

                    {/* Tehlikeli Bölge */}
                    <div style={{ marginTop: "16px", padding: "14px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px" }}>
                        <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: "700", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "5px" }}>
                            <AlertTriangle size={11} /> Tehlikeli Bölge
                        </p>
                        {[
                            { label: "Tüm Cache'i Sil", icon: <Trash2 size={12} /> },
                            { label: "DB Yedek Al", icon: <Download size={12} /> },
                        ].map(a => (
                            <button key={a.label} onClick={() => showToast(`"${a.label}" işlemi başlatıldı.`, "warning")}
                                style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "7px", background: "transparent", border: "none", color: "#EF4444", fontSize: "12px", fontWeight: "600", cursor: "pointer", marginBottom: "4px" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                {a.icon} {a.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* SaÃ„ş panel */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Genel → platform config göster */}
                    {activeSection === "genel" && (
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "22px 24px" }}>
                            <h3 style={{ margin: "0 0 18px", fontSize: "14px", fontWeight: "800", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "8px" }}>
                                <Globe size={15} color="#3B82F6" /> Platform Yapılandırması
                            </h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                                {[
                                    { label: "Site Adı", key: "siteName" },
                                    { label: "Slogan", key: "siteSlogan" },
                                    { label: "İletişim E-postası", key: "contactEmail" },
                                    { label: "Destek E-postası", key: "supportEmail" },
                                    { label: "Entry / Sayfa", key: "entryPerPage" },
                                    { label: "Max. Entry UzunluÃ„şu", key: "maxEntryLength" },
                                    { label: "Min. Entry UzunluÃ„şu", key: "minEntryLength" },
                                    { label: "Discord Davet URL", key: "discordUrl" },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label style={{ display: "block", fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "5px" }}>{f.label}</label>
                                        <input
                                            value={config[f.key as keyof typeof config]}
                                            onChange={e => setConfig(c => ({ ...c, [f.key]: e.target.value }))}
                                            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--border-subtle)", background: "var(--background)", color: "var(--foreground)", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Toggle listesi */}
                    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", overflow: "hidden" }}>
                        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "var(--foreground)" }}>
                                    {SECTIONS.find(s => s.id === activeSection)?.label} Ayarları
                                </h3>
                                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>{activeCount} / {curToggles.length} özellik aktif</p>
                            </div>
                            <div style={{ display: "flex", gap: "6px" }}>
                                <div style={{ height: "8px", width: `${(activeCount / curToggles.length) * 80}px`, background: SECTIONS.find(s => s.id === activeSection)?.color || "var(--primary)", borderRadius: "4px", transition: "width 0.4s", marginTop: "4px" }} />
                                <div style={{ height: "8px", width: `${((curToggles.length - activeCount) / curToggles.length) * 80}px`, background: "var(--border-subtle)", borderRadius: "4px", marginTop: "4px" }} />
                            </div>
                        </div>

                        {curToggles.map((t, i) => (
                            <div key={t.id}
                                style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "18px 24px", borderBottom: i !== curToggles.length - 1 ? "1px solid var(--border-subtle)" : "none", background: t.danger && t.active ? "rgba(239,68,68,0.03)" : "transparent" }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                        <span style={{ fontSize: "14px", fontWeight: "700", color: t.danger ? "#EF4444" : "var(--foreground)" }}>{t.title}</span>
                                        {t.danger && <span style={{ fontSize: "10px", background: "rgba(239,68,68,0.1)", color: "#EF4444", padding: "2px 6px", borderRadius: "5px", fontWeight: "700" }}>DİKKAT</span>}
                                        {t.premium && <span style={{ fontSize: "10px", background: "rgba(245,158,11,0.1)", color: "#F59E0B", padding: "2px 6px", borderRadius: "5px", fontWeight: "700" }}>YAKINDA</span>}
                                    </div>
                                    <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>{t.description}</p>
                                </div>
                                {/* Toggle Switch */}
                                <button
                                    onClick={() => handleToggle(activeSection, t.id)}
                                    disabled={!!t.premium}
                                    style={{
                                        width: "52px", height: "28px", borderRadius: "14px", border: "none",
                                        background: t.active
                                            ? (t.danger ? "#EF4444" : "#10B981")
                                            : "var(--border-subtle)",
                                        cursor: t.premium ? "not-allowed" : "pointer",
                                        padding: "3px", display: "flex", alignItems: "center",
                                        transition: "background 0.25s", flexShrink: 0, opacity: t.premium ? 0.5 : 1,
                                    }}>
                                    <div style={{
                                        width: "22px", height: "22px", borderRadius: "11px", background: "white",
                                        transform: t.active ? "translateX(24px)" : "translateX(0px)",
                                        transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                                    }} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Sistem Bilgisi (sadece Geliştirici sekmesinde) */}
                    {activeSection === "gelisim" && (
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "22px 24px" }}>
                            <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "800", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "8px" }}>
                                <Server size={15} color="#6B7280" /> Sistem Bilgisi
                            </h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                {[
                                    { label: "Framework", val: "Next.js 14 (App Router)" },
                                    { label: "Node.js", val: "v20.11.0" },
                                    { label: "Ortam", val: "Development" },
                                    { label: "Veritabanı", val: "In-Memory (→ Prisma/PgSQL)" },
                                    { label: "Auth", val: "Custom JWT (→ NextAuth)" },
                                    { label: "Deploy", val: "Vercel (Yakında)" },
                                    { label: "Panel Sürümü", val: "v2.4.0" },
                                    { label: "Son Güncelleme", val: "18 Nisan 2026" },
                                ].map(info => (
                                    <div key={info.label} style={{ padding: "10px 14px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                                        <p style={{ margin: "0 0 2px", fontSize: "10px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{info.label}</p>
                                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>{info.val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* API Anahtarları —� sadece Güvenlik sekmesi */}
            {activeSection === "guvenlik" && (
                <div style={{ marginTop: "16px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "22px 24px" }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "800", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Key size={15} color="#EF4444" /> API Anahtarları (Simülasyon)
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {[
                            { label: "reCAPTCHA Site Key", val: "6Lcbxxxx...AAAA", masked: true },
                            { label: "SMTP Şifresi", val: "smtp-secret-xxxx", masked: true },
                            { label: "Sentry DSN", val: "https://xxxx@sentry.io/xxxx", masked: true },
                        ].map(k => (
                            <div key={k.label} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "var(--background)", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: "0 0 2px", fontSize: "11px", color: "var(--text-muted)", fontWeight: "700" }}>{k.label}</p>
                                    <code style={{ fontSize: "12px", color: "var(--foreground)", fontFamily: "monospace" }}>{"🟢�Â�".repeat(24)}</code>
                                </div>
                                <button style={{ fontSize: "11px", padding: "6px 12px", borderRadius: "7px", border: "1px solid var(--border-subtle)", background: "var(--card-bg)", color: "var(--text-muted)", cursor: "pointer", fontWeight: "600" }}>
                                    Göster
                                </button>
                                <button style={{ fontSize: "11px", padding: "6px 12px", borderRadius: "7px", border: "none", background: "rgba(239,68,68,0.08)", color: "#EF4444", cursor: "pointer", fontWeight: "600" }}>
                                    Yenile
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div style={{ position: "fixed", bottom: "32px", right: "32px", background: toast.type === "warning" ? "#F59E0B" : "#10B981", color: "white", padding: "14px 20px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", fontWeight: "600", fontSize: "14px", zIndex: 9999, animation: "slideUp 0.3s ease" }}>
                    {toast.msg}
                </div>
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideUp { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
