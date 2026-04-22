"use client";

import { useState, useEffect } from "react";
import {
    Shield, Key, Smartphone, Monitor, LogOut, Eye, EyeOff,
    Check, X, AlertTriangle, Clock, Globe, Lock, Bell,
    RefreshCw, Copy, Mail, User, Camera, ChevronRight,
    Fingerprint, Trash2, Download, Upload, Activity, Zap,
    CheckCircle, XCircle, Info, ShieldCheck, ShieldAlert,
    QrCode
} from "lucide-react";

//  Tipler 
interface Session {
    id: string;
    device: string;
    os: string;
    browser: string;
    ip: string;
    location: string;
    lastSeen: string;
    current: boolean;
    flagged: boolean;
}

const MOCK_SESSIONS: Session[] = [
    { id: "s1", device: "💻 MacBook Pro", os: "macOS 14.4", browser: "Chrome 124", ip: "88.247.xx.xx", location: "İstanbul, TR", lastSeen: "Şu an aktif", current: true, flagged: false },
    { id: "s2", device: "📑± iPhone 15 Pro", os: "iOS 17.4", browser: "Safari 17", ip: "88.247.xx.xx", location: "İstanbul, TR", lastSeen: "2 saat önce", current: false, flagged: false },
    { id: "s3", device: " Windows PC", os: "Windows 11", browser: "Edge 123", ip: "185.61.xx.xx", location: "Ankara, TR", lastSeen: "1 gün önce", current: false, flagged: false },
    { id: "s4", device: " Bilinmeyen", os: "Linux", browser: "Firefox 125", ip: "31.45.xx.xx", location: "Moskova, RU", lastSeen: "3 gün önce", current: false, flagged: true },
];

const ACTIVITY_LOG = [
    { id: 1, action: "Giriş yapıldı", detail: "Chrome / İstanbul", time: "Şu an", type: "success" },
    { id: 2, action: "Şifre değiştirildi", detail: "Admin panelinden", time: "14 Nis 2026", type: "warning" },
    { id: 3, action: "2FA etkinleştirildi", detail: "Authenticator uygulaması", time: "10 Nis 2026", type: "success" },
    { id: 4, action: "Başarısız giriş denemesi", detail: "Moskova, RU - 31.45.xx.xx", time: "8 Nis 2026", type: "danger" },
    { id: 5, action: "API anahtarı oluşturuldu", detail: "Otosöz-admin-key", time: "1 Nis 2026", type: "info" },
    { id: 6, action: "Giriş yapıldı", detail: "Safari / iPhone", time: "28 Mar 2026", type: "success" },
];

type SectionType = "profil" | "sifre" | "2fa" | "oturumlar" | "bildirimler" | "api" | "gizlilik";

export default function AdminHesapAyarlariPage() {
    const [section, setSection] = useState<SectionType>("profil");
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warning" } | null>(null);
    const showToast = (msg: string, type: "success" | "error" | "warning" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Profil state
    const [displayName, setDisplayName] = useState("Otosöz Admin");
    const [email, setEmail] = useState("admin@Otosöz.com");
    const [phone, setPhone] = useState("+90 5xx xxx xx xx");
    const [profileSaving, setProfileSaving] = useState(false);

    // Şifre state
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);

    // 2FA state
    const [twoFAEnabled, setTwoFAEnabled] = useState(true);
    const [twoFAStep, setTwoFAStep] = useState<"idle" | "setup" | "verify" | "backup">("idle");
    const [twoFACode, setTwoFACode] = useState("");
    const [backupCodes] = useState(["A3F2-K9XR", "B7T1-M4WL", "C5P8-N2QZ", "D9J6-H7VE", "E1L4-G3YS", "F8R0-I6DM", "G2W5-J1UA", "H6N3-K8CB"]);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // Oturumlar
    const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
    const [terminatingId, setTerminatingId] = useState<string | null>(null);

    // Bildirimler
    const [notifications, setNotifications] = useState({
        loginAlert: true, failedLoginAlert: true, moderatorAction: true,
        reportFiled: true, systemAlert: false, weeklyReport: true,
        emailLogin: true, emailReport: false,
    });

    // API Keys
    const [apiKeys, setApiKeys] = useState([
        { id: "k1", name: "Ana Admin Key", key: "sk_admin_••••••••••••••••XYZ9", created: "1 Nis 2026", lastUsed: "Şu an", active: true },
        { id: "k2", name: "Backup Key", key: "sk_admin_••••••••••••••••ABC3", created: "15 Mar 2026", lastUsed: "5 gün önce", active: true },
    ]);
    const [showNewKeyModal, setShowNewKeyModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");

    // Şifre güç hesabı
    const pwStrength = (() => {
        if (!newPw) return { score: 0, label: "", color: "" };
        let score = 0;
        if (newPw.length >= 8) score++;
        if (newPw.length >= 12) score++;
        if (/[A-Z]/.test(newPw)) score++;
        if (/[0-9]/.test(newPw)) score++;
        if (/[^A-Za-z0-9]/.test(newPw)) score++;
        if (score <= 1) return { score, label: "Çok Zayıf", color: "#EF4444" };
        if (score <= 2) return { score, label: "Zayıf", color: "#F97316" };
        if (score <= 3) return { score, label: "Orta", color: "#F59E0B" };
        if (score <= 4) return { score, label: "Güçlü", color: "#10B981" };
        return { score, label: "Çok Güçlü", color: "#3B82F6" };
    })();

    const handleProfileSave = async () => {
        setProfileSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setProfileSaving(false);
        showToast("✓ Profil bilgileri güncellendi.");
    };

    const handlePasswordChange = async () => {
        if (!currentPw || !newPw || !confirmPw) return showToast("Tüm alanları doldurun.", "error");
        if (newPw !== confirmPw) return showToast("Yeni Şifreler eşleşmiyor.", "error");
        if (newPw.length < 8) return showToast("Şifre en az 8 karakter olmalı.", "error");
        if (pwStrength.score < 3) return showToast("Daha güçlü bir Şifre seçin.", "warning");
        setPwSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        setPwSaving(false);
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
        showToast("✓ Şifre başarıyla değiştirildi!");
    };

    const handleTerminateSession = async (id: string) => {
        setTerminatingId(id);
        await new Promise(r => setTimeout(r, 600));
        setSessions(prev => prev.filter(s => s.id !== id));
        setTerminatingId(null);
        showToast("Oturum sonlandırıldı.", "warning");
    };

    const handleTerminateAll = async () => {
        setSessions(prev => prev.filter(s => s.current));
        showToast("Tüm diğer oturumlar sonlandırıldı.", "warning");
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code).catch(() => { });
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 1500);
    };

    const handle2FAToggle = () => {
        if (twoFAEnabled) {
            setTwoFAEnabled(false);
            showToast("2FA devre dışı bırakıldı.", "warning");
        } else {
            setTwoFAStep("setup");
        }
    };

    const handle2FAVerify = () => {
        if (twoFACode.length === 6) {
            setTwoFAEnabled(true);
            setTwoFAStep("backup");
            showToast("✓ 2FA başarıyla etkinleştirildi!");
        } else {
            showToast("6 haneli kodu girin.", "error");
        }
    };

    const generateApiKey = () => {
        if (!newKeyName.trim()) return;
        const newKey = {
            id: `k${Date.now()}`,
            name: newKeyName,
            key: `sk_admin_••••••••••••••••${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            created: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
            lastUsed: "Henüz kullanılmadı",
            active: true,
        };
        setApiKeys(prev => [...prev, newKey]);
        setNewKeyName("");
        setShowNewKeyModal(false);
        showToast("✓ Yeni API anahtarı oluşturuldu.");
    };

    const NAV_ITEMS: { key: SectionType; label: string; icon: React.ReactNode; badge?: string }[] = [
        { key: "profil", label: "Profil Bilgileri", icon: <User size={15} /> },
        { key: "sifre", label: "Şifre Değiştir", icon: <Key size={15} /> },
        { key: "2fa", label: "İki Faktörlü Doğrulama", icon: <Shield size={15} />, badge: twoFAEnabled ? "AKTİF" : "KAPALI" },
        { key: "oturumlar", label: "Aktif Oturumlar", icon: <Monitor size={15} />, badge: sessions.filter(s => s.flagged).length > 0 ? "!" : undefined },
        { key: "bildirimler", label: "Bildirim Tercihleri", icon: <Bell size={15} /> },
        { key: "api", label: "API Anahtarları", icon: <Zap size={15} /> },
        { key: "gizlilik", label: "Gizlilik & Aktivite", icon: <Activity size={15} /> },
    ];

    return (
        <div style={{ display: 'flex', gap: '24px', minHeight: '70vh' }}>
            {/*  Sol Menü  */}
            <div style={{ width: '240px', flexShrink: 0 }}>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', overflow: 'hidden', position: 'sticky', top: '20px' }}>
                    {/* Profile card */}
                    <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))', borderBottom: '1px solid var(--card-border)', textAlign: 'center' }}>
                        <div style={{ width: '62px', height: '62px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '26px', position: 'relative' }}>
                            👔˜
                            {twoFAEnabled && <div style={{ position: 'absolute', bottom: '0', right: '0', width: '18px', height: '18px', borderRadius: '50%', background: '#10B981', border: '2px solid var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={10} color="white" /></div>}
                        </div>
                        <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '800', color: 'var(--foreground)' }}>{displayName}</p>
                        <p style={{ margin: '0 0 8px', fontSize: '11px', color: 'var(--text-muted)' }}>{email}</p>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <span style={pill("#EF4444")}>👔˜ Süper Admin</span>
                            {twoFAEnabled && <span style={pill("#10B981")}> 2FA</span>}
                        </div>
                    </div>

                    <nav style={{ padding: '8px' }}>
                        {NAV_ITEMS.map(item => (
                            <button key={item.key} onClick={() => setSection(item.key)}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', border: 'none', background: section === item.key ? 'rgba(239,68,68,0.08)' : 'transparent', color: section === item.key ? '#EF4444' : 'var(--foreground)', fontSize: '13px', fontWeight: section === item.key ? '700' : '500', cursor: 'pointer', textAlign: 'left', borderLeft: `3px solid ${section === item.key ? '#EF4444' : 'transparent'}`, transition: 'all 0.15s' }}>
                                {item.icon}
                                <span style={{ flex: 1 }}>{item.label}</span>
                                {item.badge && (
                                    <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '6px', background: item.badge === '!' ? '#EF4444' : item.badge === 'AKTİF' ? '#10B981' : '#6B7280', color: 'white' }}>
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/*  SaÃ„ş İçerik  */}
            <div style={{ flex: 1, minWidth: 0 }}>

                {/*  PROFİL BİLGİLERİ  */}
                {section === "profil" && (
                    <Card title="👍¤ Profil Bilgileri" subtitle="Admin hesabınızın genel bilgileri">
                        <FormRow label="Görünen Ad">
                            <input value={displayName} onChange={e => setDisplayName(e.target.value)} style={inputStyle} />
                        </FormRow>
                        <FormRow label="E-posta Adresi">
                            <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={inputStyle} />
                        </FormRow>
                        <FormRow label="Telefon Numarası">
                            <input value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
                        </FormRow>
                        <FormRow label="Rol">
                            <div style={{ padding: '10px 14px', borderRadius: '9px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', fontWeight: '700', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                👔˜ Süper Admin —� değiştirilemez
                            </div>
                        </FormRow>
                        <FormRow label="Admin ID">
                            <div style={{ padding: '10px 14px', borderRadius: '9px', background: 'var(--background)', border: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'monospace', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>ADM-001-Otosöz</span>
                                <button onClick={() => { navigator.clipboard.writeText('ADM-001-Otosöz'); showToast("Kopyalandı."); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><Copy size={13} /></button>
                            </div>
                        </FormRow>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                            <button onClick={handleProfileSave} disabled={profileSaving} style={{ ...primaryBtnStyle, minWidth: '140px' }}>
                                {profileSaving ? <><RefreshCw size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Kaydediliyor...</> : "✓ Bilgileri Güncelle"}
                            </button>
                        </div>
                    </Card>
                )}

                {/*  ŞİFRE DEĞİŞTİR  */}
                {section === "sifre" && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Card title=" Şifre Değiştir" subtitle="Hesabınızı güvende tutmak için güçlü bir Şifre kullanın">
                            <FormRow label="Mevcut Şifre">
                                <div style={pwInputWrap}>
                                    <input type={showCurrent ? "text" : "password"} value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: '40px' }} />
                                    <button onClick={() => setShowCurrent(v => !v)} style={eyeBtn}>{showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                                </div>
                            </FormRow>
                            <FormRow label="Yeni Şifre">
                                <div style={pwInputWrap}>
                                    <input type={showNew ? "text" : "password"} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="En az 8 karakter" style={{ ...inputStyle, paddingRight: '40px' }} />
                                    <button onClick={() => setShowNew(v => !v)} style={eyeBtn}>{showNew ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                                </div>
                                {/* Şifre güç göstergesi */}
                                {newPw && (
                                    <div style={{ marginTop: '8px' }}>
                                        <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= pwStrength.score ? pwStrength.color : 'var(--border-subtle)', transition: 'background 0.3s' }} />
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                            {[
                                                { ok: newPw.length >= 8, label: "8+ karakter" },
                                                { ok: /[A-Z]/.test(newPw), label: "Büyük harf" },
                                                { ok: /[0-9]/.test(newPw), label: "Rakam" },
                                                { ok: /[^A-Za-z0-9]/.test(newPw), label: "Özel karakter" },
                                            ].map(r => (
                                                <span key={r.label} style={{ fontSize: '11px', color: r.ok ? '#10B981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: r.ok ? '700' : '400' }}>
                                                    {r.ok ? <CheckCircle size={11} /> : <XCircle size={11} color="var(--text-muted)" />} {r.label}
                                                </span>
                                            ))}
                                        </div>
                                        <p style={{ margin: '4px 0 0', fontSize: '11px', fontWeight: '700', color: pwStrength.color }}>Güç: {pwStrength.label}</p>
                                    </div>
                                )}
                            </FormRow>
                            <FormRow label="Yeni Şifre (Tekrar)">
                                <div style={pwInputWrap}>
                                    <input type={showConfirm ? "text" : "password"} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: '40px', borderColor: confirmPw && newPw && confirmPw !== newPw ? '#EF4444' : undefined }} />
                                    <button onClick={() => setShowConfirm(v => !v)} style={eyeBtn}>{showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                                </div>
                                {confirmPw && newPw && confirmPw !== newPw && (
                                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#EF4444' }}>⚠️� Şifreler eşleşmiyor</p>
                                )}
                            </FormRow>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                                <button onClick={() => { setCurrentPw(""); setNewPw(""); setConfirmPw(""); }} style={cancelBtnStyle}>Temizle</button>
                                <button onClick={handlePasswordChange} disabled={pwSaving} style={{ ...primaryBtnStyle, minWidth: '160px' }}>
                                    {pwSaving ? <><RefreshCw size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Değiştiriliyor...</> : " Şifreyi Değiştir"}
                                </button>
                            </div>
                        </Card>

                        {/* Şifre İpuçları */}
                        <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', padding: '16px 20px' }}>
                            <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '7px' }}><Info size={14} /> Güçlü Şifre İpuçları</p>
                            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 2 }}>
                                <li>En az 12 karakter kullanın</li>
                                <li>Büyük/küçük harf, rakam ve özel karakter ekleyin</li>
                                <li>Kişisel bilgi (doğum tarihi, isim) kullanmayın</li>
                                <li>Her hesap için farklı Şifre belirleyin</li>
                                <li>Bir Şifre yöneticisi (Bitwarden, 1Password) kullanmayı düşünün</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/*  2FA  */}
                {section === "2fa" && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Durum kartı */}
                        <div style={{ background: twoFAEnabled ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${twoFAEnabled ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: twoFAEnabled ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {twoFAEnabled ? <ShieldCheck size={26} color="#10B981" /> : <ShieldAlert size={26} color="#EF4444" />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>
                                    {twoFAEnabled ? "İki Faktörlü Doğrulama Aktif" : "İki Faktörlü Doğrulama Kapalı"}
                                </p>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                                    {twoFAEnabled ? "Hesabınız ekstra koruma altında. Her girişte doÃ„şrulama kodu gerekli." : "Hesabınız yalnızca Şifre ile korunuyor. 2FA etkinleştirmenizi öneririz."}
                                </p>
                            </div>
                            {twoFAStep === "idle" && (
                                <button onClick={handle2FAToggle}
                                    style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: twoFAEnabled ? '#EF4444' : '#10B981', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', flexShrink: 0 }}>
                                    {twoFAEnabled ? "Devre Dışı Bırak" : "Etkinleştir"}
                                </button>
                            )}
                        </div>

                        {/* Setup adımı */}
                        {twoFAStep === "setup" && (
                            <Card title=" 2FA Kurulumu" subtitle="Google Authenticator veya Authy kullanın">
                                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    {/* QR Code placeholder */}
                                    <div style={{ width: '160px', height: '160px', borderRadius: '12px', background: 'var(--background)', border: '2px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <QrCode size={80} color="var(--foreground)" style={{ opacity: 0.4 }} />
                                        <p style={{ margin: '8px 0 0', fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>QR Kod burada görünür</p>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>1. Authenticator uygulamasını açın</p>
                                        <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--text-muted)' }}>2. QR kodu taratın veya gizli anahtarı manuel girin:</p>
                                        <div style={{ padding: '10px 14px', background: 'var(--background)', border: '1px solid var(--border-subtle)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', letterSpacing: '2px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>OTOA SFAL T2FA DEMO</span>
                                            <button onClick={() => { navigator.clipboard.writeText('Otosöz2FADEMO'); showToast("Kopyalandı."); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Copy size={13} /></button>
                                        </div>
                                        <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>3. Uygulama gösterdigi 6 haneli kodu girin:</p>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <input value={twoFACode} onChange={e => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                placeholder="000000" maxLength={6}
                                                style={{ ...inputStyle, letterSpacing: '6px', fontSize: '18px', fontWeight: '800', textAlign: 'center', width: '140px' }} />
                                            <button onClick={handle2FAVerify} style={{ ...primaryBtnStyle }}>DoÃ„şrula</button>
                                            <button onClick={() => setTwoFAStep("idle")} style={cancelBtnStyle}>İptal</button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Backup kodlar */}
                        {twoFAStep === "backup" && (
                            <Card title=" Yedek Kodlarınız" subtitle="Bu kodları güvenli bir yere kaydedin —� her biri bir kez kullanılabilir">
                                <div style={{ padding: '14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', marginBottom: '16px', display: 'flex', gap: '8px' }}>
                                    <AlertTriangle size={15} color="#F59E0B" style={{ flexShrink: 0, marginTop: '1px' }} />
                                    <p style={{ margin: 0, fontSize: '12px', color: '#F59E0B', fontWeight: '600' }}>Bu kodları kaydetmeyi unutmayın! 2FA cihazınıza erişimi kaybederseniz bunlar hesabınızı kurtarır.</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                                    {backupCodes.map(code => (
                                        <button key={code} onClick={() => handleCopyCode(code)}
                                            style={{ padding: '10px', borderRadius: '8px', background: copiedCode === code ? 'rgba(16,185,129,0.1)' : 'var(--background)', border: `1px solid ${copiedCode === code ? '#10B981' : 'var(--border-subtle)'}`, fontFamily: 'monospace', fontSize: '12px', fontWeight: '700', color: copiedCode === code ? '#10B981' : 'var(--foreground)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                            {copiedCode === code ? <Check size={11} /> : null} {code}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => { const t = backupCodes.join('\n'); navigator.clipboard.writeText(t); showToast("Tüm kodlar kopyalandı."); }} style={cancelBtnStyle}><Copy size={13} /> Tümünü Kopyala</button>
                                    <button onClick={() => { setTwoFAStep("idle"); }} style={primaryBtnStyle}>✓ Anladım, Bitir</button>
                                </div>
                            </Card>
                        )}

                        {/* 2FA yöntem seçenekleri —� sadece aktifken göster */}
                        {twoFAEnabled && twoFAStep === "idle" && (
                            <Card title="🛠️� Doğrulama Yöntemleri" subtitle="Birden fazla yöntem ekleyerek hesabınızı daha güvenli yapın">
                                {[
                                    { icon: "📑±", title: "Authenticator Uygulaması", desc: "Google Authenticator, Authy, vb.", active: true },
                                    { icon: "💬", title: "SMS Doğrulama", desc: "+90 5xx xxx xx xx", active: false },
                                    { icon: "📧", title: "E-posta Doğrulama", desc: "admin@Otosöz.com", active: false },
                                    { icon: "🔑", title: "Güvenlik Anahtarı (FIDO2)", desc: "YubiKey veya uyumlu donanım", active: false },
                                ].map(m => (
                                    <div key={m.title} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                        <span style={{ fontSize: '20px', width: '32px', textAlign: 'center', flexShrink: 0 }}>{m.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{m.title}</p>
                                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{m.desc}</p>
                                        </div>
                                        {m.active
                                            ? <span style={pill("#10B981")}>✓ Aktif</span>
                                            : <button style={{ padding: '6px 12px', borderRadius: '7px', background: 'var(--background)', border: '1px solid var(--border-subtle)', color: 'var(--foreground)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Ekle</button>}
                                    </div>
                                ))}
                            </Card>
                        )}
                    </div>
                )}

                {/*  AKTİF OTURUMLAR  */}
                {section === "oturumlar" && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Card title=" Aktif Oturumlar" subtitle={`${sessions.length} oturum —� ${sessions.filter(s => s.flagged).length > 0 ? '⚠️� Şüpheli oturum var!' : 'Tüm oturumlar tanıdık'}`}>
                            {sessions.filter(s => s.flagged).length > 0 && (
                                <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <AlertTriangle size={16} color="#EF4444" />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#EF4444' }}>Şüpheli oturum tespit edildi!</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Rusya'dan bir oturum açık. Tanımıyorsanız hemen sonlandırın ve Şifrenizi değiştirin.</p>
                                    </div>
                                    <button onClick={() => handleTerminateSession("s4")} style={{ padding: '7px 14px', borderRadius: '8px', background: '#EF4444', border: 'none', color: 'white', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Sonlandır</button>
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {sessions.map(s => (
                                    <div key={s.id} style={{ padding: '14px 18px', borderRadius: '11px', background: s.current ? 'rgba(16,185,129,0.04)' : s.flagged ? 'rgba(239,68,68,0.04)' : 'var(--background)', border: `1px solid ${s.current ? 'rgba(16,185,129,0.2)' : s.flagged ? 'rgba(239,68,68,0.25)' : 'var(--border-subtle)'}`, display: 'flex', gap: '14px', alignItems: 'center' }}>
                                        <div style={{ fontSize: '22px', flexShrink: 0 }}>{s.device.split(' ')[0]}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', gap: '6px', marginBottom: '3px', flexWrap: 'wrap', alignItems: 'center' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{s.device.slice(2)}</span>
                                                {s.current && <span style={pill("#10B981")}>🟢�Â� Bu cihaz</span>}
                                                {s.flagged && <span style={pill("#EF4444")}>⚠️� Şüpheli</span>}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
                                                {s.os} · {s.browser} · {s.ip} · {s.location}
                                            </p>
                                            <p style={{ margin: 0, fontSize: '11px', color: s.current ? '#10B981' : 'var(--text-subtle)' }}>
                                                <Clock size={9} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />{s.lastSeen}
                                            </p>
                                        </div>
                                        {!s.current && (
                                            <button onClick={() => handleTerminateSession(s.id)} disabled={terminatingId === s.id}
                                                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: '12px', fontWeight: '700', cursor: 'pointer', flexShrink: 0 }}>
                                                {terminatingId === s.id ? <RefreshCw size={11} style={{ animation: 'spin 0.6s linear infinite' }} /> : <LogOut size={11} />}
                                                Sonlandır
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {sessions.filter(s => !s.current).length > 0 && (
                                <button onClick={handleTerminateAll}
                                    style={{ width: '100%', marginTop: '12px', padding: '11px', borderRadius: '10px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <LogOut size={14} /> Tüm Diğer Oturumları Sonlandır
                                </button>
                            )}
                        </Card>
                    </div>
                )}

                {/*  BİLDİRİMLER  */}
                {section === "bildirimler" && (
                    <Card title=" Bildirim Tercihleri" subtitle="Hangi durumlarda bildirim almak istediğinizi seçin">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            <SectionHeader>Panel Bildirimleri</SectionHeader>
                            {[
                                { key: 'loginAlert', label: 'Yeni giriş uyarısı', desc: 'Hesabınıza her girişte bildirim alın' },
                                { key: 'failedLoginAlert', label: 'Başarısız giriş uyarısı', desc: 'Şüpheli giriş denemeleri için anlık uyarı' },
                                { key: 'moderatorAction', label: 'Moderatör aksiyonları', desc: 'Moderatörler işlem yaptıÃ„şında haberdar ol' },
                                { key: 'reportFiled', label: 'Yeni rapor/Şikayet', desc: 'Kullanıcı Şikayeti geldiğinde bildir' },
                                { key: 'systemAlert', label: 'Sistem uyarıları', desc: 'Sunucu ve performans uyarıları' },
                                { key: 'weeklyReport', label: 'Haftalık özet rapor', desc: 'Pazar günleri haftalık aktivite özeti' },
                            ].map((n) => (
                                <div key={n.key} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>{n.label}</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{n.desc}</p>
                                    </div>
                                    <Toggle
                                        checked={(notifications as any)[n.key]}
                                        onChange={(v) => setNotifications(prev => ({ ...prev, [n.key]: v }))}
                                    />
                                </div>
                            ))}
                            <SectionHeader>E-posta Bildirimleri</SectionHeader>
                            {[
                                { key: 'emailLogin', label: 'Giriş bildirimleri e-posta', desc: 'Her girişte admin@Otosöz.com adresine gönder' },
                                { key: 'emailReport', label: 'Rapor özeti e-posta', desc: 'Günlük rapor özeti mail ile ilet' },
                            ].map((n) => (
                                <div key={n.key} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>{n.label}</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{n.desc}</p>
                                    </div>
                                    <Toggle checked={(notifications as any)[n.key]} onChange={(v) => setNotifications(prev => ({ ...prev, [n.key]: v }))} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                            <button onClick={() => showToast("✓ Bildirim tercihleri kaydedildi.")} style={primaryBtnStyle}>✓ Tercihleri Kaydet</button>
                        </div>
                    </Card>
                )}

                {/*  API ANAHTARLARI  */}
                {section === "api" && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Card title="⚡ API Anahtarları" subtitle="Otosöz admin API'sine erişim için kullanılan anahtarlar">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                                {apiKeys.map(k => (
                                    <div key={k.id} style={{ padding: '14px 18px', background: 'var(--background)', border: '1px solid var(--border-subtle)', borderRadius: '10px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Zap size={18} color="#3B82F6" />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '3px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{k.name}</span>
                                                {k.active && <span style={pill("#10B981")}>Aktif</span>}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{k.key}</p>
                                            <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-subtle)' }}>Oluşturuldu: {k.created} · Son kullanım: {k.lastUsed}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                            <button onClick={() => { navigator.clipboard.writeText(k.key); showToast("Kopyalandı."); }} style={{ padding: '6px 10px', borderRadius: '7px', background: 'var(--card-bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}><Copy size={11} /></button>
                                            <button onClick={() => { setApiKeys(prev => prev.filter(x => x.id !== k.id)); showToast("Anahtar silindi.", "warning"); }} style={{ padding: '6px 10px', borderRadius: '7px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}><Trash2 size={11} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {!showNewKeyModal ? (
                                <button onClick={() => setShowNewKeyModal(true)} style={{ ...primaryBtnStyle, width: '100%' }}>+ Yeni API Anahtarı Oluştur</button>
                            ) : (
                                <div style={{ padding: '16px', background: 'var(--background)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
                                    <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>Yeni API Anahtarı</p>
                                    <input value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="Anahtar adı (örn: Webhook Entegrasyonu)" style={{ ...inputStyle, marginBottom: '10px' }} />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => { setShowNewKeyModal(false); setNewKeyName(""); }} style={cancelBtnStyle}>İptal</button>
                                        <button onClick={generateApiKey} disabled={!newKeyName.trim()} style={primaryBtnStyle}>Oluştur</button>
                                    </div>
                                </div>
                            )}
                        </Card>

                        <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '16px 20px' }}>
                            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: '700', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={14} /> API GüvenliÃ„şi</p>
                            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 2 }}>
                                <li>API anahtarlarını kimseyle paylaşmayın</li>
                                <li>Kullanılmayan anahtarları silin</li>
                                <li>HTTPS dışında asla kullanmayın</li>
                                <li>Şüpheli kullanımda hemen devre dışı bırakın</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/*  GİZLİLİK & AKTİVİTE  */}
                {section === "gizlilik" && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Card title="📋 Aktivite GünlüÃ„şü" subtitle="Son 30 günlük admin hesabı aktivitesi">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                {ACTIVITY_LOG.map((log, i) => (
                                    <div key={log.id} style={{ display: 'flex', gap: '14px', padding: '12px 0', borderBottom: i < ACTIVITY_LOG.length - 1 ? '1px solid var(--border-subtle)' : 'none', alignItems: 'flex-start' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: log.type === "success" ? 'rgba(16,185,129,0.12)' : log.type === "danger" ? 'rgba(239,68,68,0.12)' : log.type === "warning" ? 'rgba(245,158,11,0.12)' : 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {log.type === "success" ? <CheckCircle size={15} color="#10B981" />
                                                : log.type === "danger" ? <XCircle size={15} color="#EF4444" />
                                                    : log.type === "warning" ? <AlertTriangle size={15} color="#F59E0B" />
                                                        : <Info size={15} color="#3B82F6" />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{log.action}</p>
                                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{log.detail}</p>
                                        </div>
                                        <span style={{ fontSize: '11px', color: 'var(--text-subtle)', flexShrink: 0 }}>{log.time}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card title=" Veri & Gizlilik" subtitle="Hesap verilerinizi yönetin">
                            {[
                                { icon: <Download size={16} />, title: "Hesap Verilerini Dışa Aktar", desc: "Tüm admin aktivitelerinizi JSON olarak indirin", color: "#3B82F6", action: () => showToast("Dışa aktarma başlatıldı. E-posta ile iletilecek.") },
                                { icon: <RefreshCw size={16} />, title: "Aktivite GünlüÃ„şünü Temizle", desc: "30 günden eski aktivite kayıtlarını sil", color: "#F59E0B", action: () => showToast("Eski kayıtlar temizlendi.", "warning") },
                                { icon: <Globe size={16} />, title: "IP Beyaz Listesi", desc: "Yalnızca belirli IP adreslerinden erişime izin ver", color: "#8B5CF6", action: () => showToast("Bu özellik yakında geliyor.", "warning") },
                            ].map(item => (
                                <div key={item.title} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }} onClick={item.action}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: item.color }}>{item.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{item.title}</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{item.desc}</p>
                                    </div>
                                    <ChevronRight size={15} color="var(--text-muted)" />
                                </div>
                            ))}
                        </Card>
                    </div>
                )}
            </div>

            {/* Toast */}
            {toast && (
                <div style={{ position: 'fixed', bottom: '32px', right: '32px', background: toast.type === "error" ? '#EF4444' : toast.type === "warning" ? '#F59E0B' : '#10B981', color: 'white', padding: '14px 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 9999, animation: 'slideUp 0.3s ease' }}>
                    {toast.type === "error" ? <XCircle size={16} /> : toast.type === "warning" ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                    {toast.msg}
                </div>
            )}
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideUp { from { transform: translateY(80px); opacity:0; } to { transform: translateY(0); opacity:1; } }
            `}</style>
        </div>
    );
}

//  Alt Bileşenler 
function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '24px', marginBottom: '0' }}>
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: '800', color: 'var(--foreground)' }}>{title}</h2>
                {subtitle && <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' }}>{label}</label>
            {children}
        </div>
    );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
    return <p style={{ margin: '16px 0 0', padding: '10px 0 0', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', borderTop: '1px solid var(--border-subtle)' }}>{children}</p>;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button onClick={() => onChange(!checked)}
            style={{ width: '44px', height: '24px', borderRadius: '12px', background: checked ? '#10B981' : 'var(--border-subtle)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: '3px', left: checked ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
        </button>
    );
}

//  Stiller 
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: '9px', border: '1px solid var(--border-subtle)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const primaryBtnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 20px', borderRadius: '9px', background: '#EF4444', border: 'none', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const cancelBtnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 18px', borderRadius: '9px', background: 'var(--background)', border: '1px solid var(--border-subtle)', color: 'var(--foreground)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };
const pwInputWrap: React.CSSProperties = { position: 'relative', display: 'flex', alignItems: 'center' };
const eyeBtn: React.CSSProperties = { position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' };

function pill(color: string): React.CSSProperties {
    return { display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '800', background: `${color}18`, color, border: `1px solid ${color}30` };
}
