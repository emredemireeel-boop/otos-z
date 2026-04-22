"use client";

import { useState } from "react";
import { Bell, Search, LogOut, User, ChevronDown, Settings, Shield, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    "/admin": { title: "Ana Gosterge Paneli", subtitle: "Platforma genel bakis" },
    "/admin/kullanicilar": { title: "Kullanici Yonetimi", subtitle: "Kullanici yonetimi ve ban islemleri" },
    "/admin/moderatorler": { title: "Moderatorler", subtitle: "Moderator hesaplari ve yetki yonetimi" },
    "/admin/moderasyon": { title: "Sozluk Yonetimi", subtitle: "Terim ekleme, duzenleme ve silme" },
    "/admin/pazar": { title: "Pazar Kontrolu", subtitle: "Arac ilanlarini denetle ve onayla" },
    "/admin/finans": { title: "Finans ve Premium", subtitle: "Gelir, odeme ve premium uyeler" },
    "/admin/icerik": { title: "Icerik ve Trendler", subtitle: "One cikan basliklar ve site duyurulari" },
    "/admin/guvenmetre": { title: "Guvenmetre Onaylari", subtitle: "Garaj dogrulama talepleri" },
    "/admin/reklamlar": { title: "Reklam Yonetimi", subtitle: "Sitenin reklam alanlari" },
    "/admin/raporlar": { title: "Sikayet Kuyrugu", subtitle: "Kullanici raporlarini incele ve isle" },
    "/admin/rozetler": { title: "Rozet ve Seviye Yonetimi", subtitle: "Kullanici seviyeleri ve ozel rozetler" },
    "/admin/kelime-filtresi": { title: "Kelime Filtresi", subtitle: "Yasakli kelime ve icerik filtreleme kurallari" },
    "/admin/yayin": { title: "Toplu Mesaj Yayini", subtitle: "Kullanici gruplarina bildirim gonder" },
    "/admin/loglar": { title: "Sistem Loglari", subtitle: "Tum yonetici hareketleri" },
    "/admin/ayarlar": { title: "Sistem Ayarlari", subtitle: "Platform konfigurasyonlari" },
    "/admin/hesap": { title: "Hesap Ayarlari", subtitle: "Guvenlik ve oturum yonetimi" },
    "/admin/seed-dictionary": { title: "Sozluk Aktarimi", subtitle: "Statik verileri Firestore'a aktar" },
};

export default function AdminTopbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [searchVal, setSearchVal] = useState("");

    const pageInfo = pageTitles[pathname] ?? { title: "Admin Paneli", subtitle: "" };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("Otosoz_user");
            router.push("/giris");
        } catch (e) {
            console.error("Cikis hatasi:", e);
        }
    };

    const isDark = theme === 'dark';

    return (
        <header style={{
            height: '64px', borderBottom: '1px solid var(--card-border)',
            backgroundColor: 'var(--navbar-bg)', display: 'flex',
            alignItems: 'center', padding: '0 32px', gap: '12px',
            position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)',
        }}>
            <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>{pageInfo.title}</h2>
                {pageInfo.subtitle && <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{pageInfo.subtitle}</p>}
            </div>

            {/* Quick Search */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '0 14px', height: '38px', width: '200px', gap: '8px' }}>
                <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input type="text" placeholder="Hizli ara..." value={searchVal} onChange={e => setSearchVal(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--foreground)', fontSize: '13px', width: '100%' }} />
            </div>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} title={isDark ? 'Acik temaya gec' : 'Koyu temaya gec'} style={{
                width: '76px', height: '38px', borderRadius: '20px', border: '1px solid var(--card-border)',
                background: isDark ? 'linear-gradient(135deg, #1e2a3a, #0f172a)' : 'linear-gradient(135deg, #fff7ed, #fef3c7)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '3px', position: 'relative',
                transition: 'all 0.3s ease', flexShrink: 0,
                boxShadow: isDark ? 'inset 0 0 12px rgba(99,102,241,0.15)' : 'inset 0 0 12px rgba(251,191,36,0.15)',
            }}>
                <div style={{ position: 'absolute', left: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isDark ? 0.35 : 1, transition: 'opacity 0.3s' }}>
                    <Sun size={14} color="#F59E0B" />
                </div>
                <div style={{ position: 'absolute', right: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isDark ? 1 : 0.35, transition: 'opacity 0.3s' }}>
                    <Moon size={13} color="#818CF8" />
                </div>
                <div style={{
                    width: '30px', height: '30px', borderRadius: '15px',
                    background: isDark ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                    transform: isDark ? 'translateX(38px)' : 'translateX(0px)',
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s',
                    boxShadow: isDark ? '0 2px 8px rgba(79,70,229,0.5)' : '0 2px 8px rgba(251,191,36,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, flexShrink: 0,
                }}>
                    {isDark ? <Moon size={13} color="white" /> : <Sun size={14} color="white" />}
                </div>
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
                <button onClick={() => { setShowNotifications(v => !v); setShowProfile(false); }}
                    style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '10px', background: showNotifications ? 'rgba(239,68,68,0.1)' : 'var(--background)', border: '1px solid var(--card-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: showNotifications ? '#EF4444' : 'var(--foreground)' }}>
                    <Bell size={17} />
                </button>

                {showNotifications && (
                    <>
                        <div onClick={() => setShowNotifications(false)} style={{ position: 'fixed', inset: 0, zIndex: 990 }} />
                        <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '320px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', zIndex: 1000, overflow: 'hidden' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--card-border)' }}>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>Bildirimler</span>
                            </div>
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                                Yeni bildirim yok
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
                <button onClick={() => { setShowProfile(v => !v); setShowNotifications(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: showProfile ? 'rgba(239,68,68,0.1)' : 'var(--background)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '6px 12px', cursor: 'pointer', color: 'var(--foreground)', height: '38px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={13} color="white" />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>{user?.username || 'Admin'}</span>
                    <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: showProfile ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {showProfile && (
                    <>
                        <div onClick={() => setShowProfile(false)} style={{ position: 'fixed', inset: 0, zIndex: 990 }} />
                        <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '200px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', zIndex: 1000, overflow: 'hidden' }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid var(--card-border)' }}>
                                <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>{user?.username || 'Admin'}</p>
                                <p style={{ fontSize: '12px', color: '#EF4444', margin: 0, fontWeight: '600' }}>{user?.role === 'admin' ? 'Super Admin' : 'Moderator'}</p>
                            </div>
                            <div style={{ padding: '8px' }}>
                                {[
                                    { href: '/admin/ayarlar', icon: <Settings size={15} />, label: 'Ayarlar' },
                                    { href: '/', icon: <User size={15} />, label: 'Siteye Don' },
                                ].map(item => (
                                    <Link key={item.href} href={item.href} onClick={() => setShowProfile(false)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: 'var(--foreground)', fontSize: '13px', fontWeight: '500' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-primary)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        {item.icon}{item.label}
                                    </Link>
                                ))}
                                <button onClick={handleLogout}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#EF4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', marginTop: '4px' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <LogOut size={15} /> Cikis Yap
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
