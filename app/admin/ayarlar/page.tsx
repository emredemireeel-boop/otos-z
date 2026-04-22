"use client";

import { useState } from "react";
import {
    Settings, Shield, Globe, Database, Save, CheckCircle,
    RefreshCcw, Bell, Eye, Lock, Users, Zap, AlertTriangle,
    ToggleLeft, ToggleRight, Server, Mail, MessageSquare,
    Palette, Code, Key, Trash2, Upload, Download, ChevronRight
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
}

//  Ayar Bölümleri 
const SECTIONS: SectionDef[] = [
    { id: "genel", icon: <Globe size={18} />, label: "Genel Sistem" },
    { id: "guvenlik", icon: <Shield size={18} />, label: "Güvenlik & Erişim" },
    { id: "kullanici", icon: <Users size={18} />, label: "Kullanıcı Yönetimi" },
    { id: "bildirim", icon: <Bell size={18} />, label: "Bildirimler" },
    { id: "performans", icon: <Zap size={18} />, label: "Performans & Cache" },
    { id: "gelisim", icon: <Code size={18} />, label: "Geliştirici Seçenekleri" },
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
        { id: "s2", title: "Captcha (Kayıt)", description: "Yeni üye kaydında robot doğrulama istenir.", active: true },
        { id: "s3", title: "CSRF Koruması", description: "Cross-Site Request Forgery token doğrulaması aktif.", active: true },
        { id: "s4", title: "Rate Limiting (API)", description: "Dakikada 100+ istek atan IP'ler geçici olarak bloklanır.", active: true },
        { id: "s5", title: "IP Blacklist Aktif", description: "Manuel eklenen kötü niyetli IP adresleri engellenir.", active: false },
        { id: "s6", title: "2FA Admin Giriş", description: "Admin paneli girişleri iki faktörlü doğrulama gerektirir.", active: false, premium: true },
    ],
    kullanici: [
        { id: "u1", title: "Çaylak Entry Limiti (30)", description: "Bot saldırısına karşı: Yazar olmak için 10 yerine 30 entry şartı.", active: true },
        { id: "u2", title: "Görsel Yükleme Aktif", description: "Forum ve pazarda kullanıcı resim/medya yüklemesine izin verir.", active: true },
        { id: "u3", title: "PM Sistemi Aktif", description: "Kullanıcılar arası özel mesajlaşma sistemi aktif.", active: false, premium: true },
        { id: "u4", title: "Garaj Profili (Beta)", description: "Kullanıcı garajı ve Güvenmetre rozetleri profillerde gösterilir.", active: true },
        { id: "u5", title: "Kullanıcı Rapor Sistemi", description: "Ziyaretçiler entry ve başlıkları raporlayabilir.", active: true },
        { id: "u6", title: "Başlık Oluşturma (Yazarlar)", description: "Yazar seviyesi kullanıcılar yeni başlık açabilir.", active: true },
    ],
    bildirim: [
        { id: "n1", title: "E-posta Bildirimleri", description: "Sistem geneli e-posta bildirimleri aktif (SMTP ile).", active: true },
        { id: "n2", title: "Site İçi Bildirimler", description: "Kullanıcılara uygulama içi cevap/beğeni bildirimleri.", active: true },
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
    siteSlogan: "Otomobil Sözlüğü",
    entryPerPage: "20",
    maxEntryLength: "5000",
    maxTitleLength: "200",
    minEntryLength: "10",
    contactEmail: "admin@otosoz.com",
    supportEmail: "destek@otosoz.com",
    discordUrl: "https://discord.gg/otosoz",
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
        showToast("✓ Tüm ayarlar başarıyla güncellendi!");
    };

    const handleClearCache = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 600));
        setSaving(false);
        showToast(" Önbellek (Cache) temizlendi!");
    };

    const curToggles = toggles[activeSection] || [];
    const activeCount = curToggles.filter(t => t.active).length;

    return (
        <div style={{ position: "relative", paddingBottom: "60px", maxWidth: "1200px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid var(--border-subtle)" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--foreground)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px", letterSpacing: "-0.5px" }}>
                        <div style={{ padding: "8px", background: "var(--primary)", borderRadius: "10px", display: "flex", color: "white" }}>
                            <Settings size={22} />
                        </div>
                        Sistem Ayarları
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "15px", margin: 0 }}>Platformun temel yapılandırmasını ve güvenlik politikalarını yönetin.</p>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={handleClearCache} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)", padding: "12px 20px", borderRadius: "12px", cursor: "pointer", fontSize: "14px", fontWeight: "600", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--card-border)"}>
                        <RefreshCcw size={16} /> Önbelleği Temizle
                    </button>
                    <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--primary)", border: "none", color: "white", padding: "12px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "14px", fontWeight: "700", transition: "opacity 0.2s", opacity: saving ? 0.7 : 1 }}>
                        {saving ? <RefreshCcw size={16} style={{ animation: "spin 0.8s linear infinite" }} /> : <Save size={16} />}
                        {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </button>
                </div>
            </div>

            {/* Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "32px" }}>
                {/* Sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", paddingLeft: "4px" }}>
                        Ayarlar Menüsü
                    </div>
                    {SECTIONS.map(s => {
                        const isActive = activeSection === s.id;
                        return (
                            <button key={s.id} onClick={() => setActiveSection(s.id)}
                                style={{
                                    display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px",
                                    borderRadius: "12px", border: "none",
                                    background: isActive ? "var(--primary)" : "transparent",
                                    color: isActive ? "white" : "var(--text-muted)",
                                    cursor: "pointer", fontSize: "14px", fontWeight: "600",
                                    textAlign: "left", transition: "all 0.2s ease"
                                }}
                                onMouseEnter={e => !isActive && (e.currentTarget.style.background = "var(--card-bg)")}
                                onMouseLeave={e => !isActive && (e.currentTarget.style.background = "transparent")}
                            >
                                <div style={{ opacity: isActive ? 1 : 0.7 }}>{s.icon}</div>
                                {s.label}
                                {isActive && <ChevronRight size={16} style={{ marginLeft: "auto", opacity: 0.8 }} />}
                            </button>
                        );
                    })}

                    <div style={{ height: "1px", background: "var(--border-subtle)", margin: "16px 0" }} />

                    <div style={{ padding: "16px", background: "rgba(239, 68, 68, 0.04)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "12px" }}>
                        <p style={{ margin: "0 0 12px", fontSize: "12px", fontWeight: "800", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <AlertTriangle size={14} /> Kritik İşlemler
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <button onClick={() => showToast(`Sistem sıfırlama talebi gönderildi.`, "warning")}
                                style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", background: "var(--card-bg)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#EF4444", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"}
                                onMouseLeave={e => e.currentTarget.style.background = "var(--card-bg)"}>
                                <Trash2 size={14} /> Sistemi Sıfırla
                            </button>
                            <button onClick={() => showToast(`Yedekleme başlatıldı.`, "success")}
                                style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", background: "transparent", border: "1px solid var(--border-subtle)", color: "var(--foreground)", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "var(--card-bg)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                <Download size={14} /> Veritabanı Yedeği Al
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    
                    {/* General Configuration Cards */}
                    {activeSection === "genel" && (
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                            <h3 style={{ margin: "0 0 24px", fontSize: "16px", fontWeight: "800", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "10px" }}>
                                <Globe size={18} color="var(--primary)" /> Temel Platform Yapılandırması
                            </h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                {[
                                    { label: "Platform Adı", key: "siteName", placeholder: "Otosöz" },
                                    { label: "Slogan", key: "siteSlogan", placeholder: "Otomobil Dünyası" },
                                    { label: "Resmi İletişim E-postası", key: "contactEmail", placeholder: "info@domain.com" },
                                    { label: "Destek E-postası", key: "supportEmail", placeholder: "destek@domain.com" },
                                    { label: "Sayfa Başına Entry", key: "entryPerPage", placeholder: "20" },
                                    { label: "Maksimum Entry Karakter", key: "maxEntryLength", placeholder: "5000" },
                                    { label: "Minimum Entry Karakter", key: "minEntryLength", placeholder: "10" },
                                    { label: "Topluluk (Discord) Linki", key: "discordUrl", placeholder: "https://discord.gg/..." },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--foreground)", marginBottom: "8px" }}>{f.label}</label>
                                        <input
                                            value={config[f.key as keyof typeof config]}
                                            onChange={e => setConfig(c => ({ ...c, [f.key]: e.target.value }))}
                                            placeholder={f.placeholder}
                                            style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid var(--border-subtle)", background: "var(--background)", color: "var(--foreground)", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }} 
                                            onFocus={e => e.target.style.borderColor = "var(--primary)"}
                                            onBlur={e => e.target.style.borderColor = "var(--border-subtle)"}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Toggles Panel */}
                    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                        <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--background)" }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "var(--foreground)" }}>
                                    Modül ve Özellik Yönetimi
                                </h3>
                                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--text-muted)" }}>{curToggles.length} özellikten {activeCount} tanesi aktif durumda.</p>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {curToggles.map((t, i) => (
                                <div key={t.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", padding: "20px 28px", borderBottom: i !== curToggles.length - 1 ? "1px solid var(--border-subtle)" : "none", background: t.danger && t.active ? "rgba(239,68,68,0.02)" : "transparent", transition: "background 0.2s" }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                                            <span style={{ fontSize: "15px", fontWeight: "700", color: t.danger && t.active ? "#EF4444" : "var(--foreground)" }}>{t.title}</span>
                                            {t.danger && <span style={{ fontSize: "10px", background: "rgba(239,68,68,0.1)", color: "#EF4444", padding: "3px 8px", borderRadius: "6px", fontWeight: "800", letterSpacing: "0.5px" }}>RİSKLİ</span>}
                                            {t.premium && <span style={{ fontSize: "10px", background: "rgba(245,158,11,0.1)", color: "#F59E0B", padding: "3px 8px", borderRadius: "6px", fontWeight: "800", letterSpacing: "0.5px" }}>YAKINDA</span>}
                                        </div>
                                        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>{t.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle(activeSection, t.id)}
                                        disabled={!!t.premium}
                                        style={{
                                            width: "48px", height: "26px", borderRadius: "13px", border: "none",
                                            background: t.active ? (t.danger ? "#EF4444" : "var(--primary)") : "var(--border-subtle)",
                                            cursor: t.premium ? "not-allowed" : "pointer",
                                            padding: "3px", display: "flex", alignItems: "center",
                                            transition: "background 0.3s ease", flexShrink: 0, opacity: t.premium ? 0.6 : 1,
                                            boxShadow: t.active ? `0 0 0 2px ${t.danger ? "rgba(239,68,68,0.2)" : "rgba(0,90,226,0.2)"}` : "none"
                                        }}>
                                        <div style={{
                                            width: "20px", height: "20px", borderRadius: "50%", background: "white",
                                            transform: t.active ? "translateX(22px)" : "translateX(0px)",
                                            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                        }} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Developer Info Card */}
                    {activeSection === "gelisim" && (
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                            <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "800", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "10px" }}>
                                <Server size={18} color="var(--primary)" /> Sistem Ortamı Bilgileri
                            </h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                {[
                                    { label: "Framework", val: "Next.js 14 (App Router)" },
                                    { label: "Node.js Sürümü", val: "v20.11.0" },
                                    { label: "Çalışma Ortamı", val: "Development" },
                                    { label: "Veritabanı Sağlayıcı", val: "Firebase Firestore" },
                                    { label: "Kimlik Doğrulama", val: "Firebase Auth" },
                                    { label: "Sunucu Bağlantısı", val: "Aktif" },
                                    { label: "Admin Panel Versiyonu", val: "v3.0.0-PRO" },
                                    { label: "Son Güncelleme Zamanı", val: new Date().toLocaleDateString('tr-TR') },
                                ].map(info => (
                                    <div key={info.label} style={{ padding: "14px 16px", background: "var(--background)", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                                        <p style={{ margin: "0 0 4px", fontSize: "11px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{info.label}</p>
                                        <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "var(--foreground)" }}>{info.val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Security API Keys */}
                    {activeSection === "guvenlik" && (
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                            <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "800", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "10px" }}>
                                <Key size={18} color="#EF4444" /> Servis Anahtarları (API Keys)
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {[
                                    { label: "reCAPTCHA v3 Site Key", val: "6Lcbxxxx...AAAA" },
                                    { label: "SMTP Auth Password", val: "smtp-secret-xxxx" },
                                    { label: "Sentry DSN Endpoint", val: "https://xxxx@sentry.io/xxxx" },
                                ].map(k => (
                                    <div key={k.label} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", background: "var(--background)", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: "0 0 6px", fontSize: "12px", color: "var(--foreground)", fontWeight: "700" }}>{k.label}</p>
                                            <code style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "monospace", letterSpacing: "2px" }}>{"•".repeat(24)}</code>
                                        </div>
                                        <button style={{ fontSize: "13px", padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border-subtle)", background: "var(--card-bg)", color: "var(--foreground)", cursor: "pointer", fontWeight: "600", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--border-subtle)"} onMouseLeave={e => e.currentTarget.style.background = "var(--card-bg)"}>
                                            Göster
                                        </button>
                                        <button style={{ fontSize: "13px", padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)", color: "#EF4444", cursor: "pointer", fontWeight: "600", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.05)"}>
                                            Yenile
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <p style={{ marginTop: "16px", fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                                <Shield size={14} /> Anahtarlar güvenlik amacıyla maskelenmiştir. Yenileme işlemi servisleri anlık kesintiye uğratabilir.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div style={{ position: "fixed", bottom: "40px", right: "40px", background: toast.type === "warning" ? "#F59E0B" : "var(--foreground)", color: "var(--background)", padding: "16px 24px", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", fontWeight: "600", fontSize: "15px", zIndex: 9999, animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)", display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={18} /> {toast.msg}
                </div>
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
