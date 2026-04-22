"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Users, MessageSquareWarning, Settings, LogOut,
    ShoppingCart, Banknote, Tags, ShieldCheck, Activity,
    AlertCircle, Megaphone, Flag, Award,
    Filter, Radio, UserCog, BookOpen
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const navItems = [
    {
        group: "GENEL",
        items: [
            { name: "Ana Pano", href: "/admin", icon: LayoutDashboard, badge: null },
            { name: "Moderatorler", href: "/admin/moderatorler", icon: UserCog, badge: null },
            { name: "Hesap Ayarlari", href: "/admin/hesap", icon: ShieldCheck, badge: null },
        ]
    },
    {
        group: "MODERASYON",
        items: [
            { name: "Kullanici Yonetimi", href: "/admin/kullanicilar", icon: Users, badge: null },
            { name: "Sozluk Yonetimi", href: "/admin/moderasyon", icon: BookOpen, badge: null },
            { name: "Sikayet Kuyrugu", href: "/admin/raporlar", icon: Flag, badge: null, badgeRed: true },
            { name: "Pazar Kontrolu", href: "/admin/pazar", icon: ShoppingCart, badge: null },
            { name: "Guvenmetre Onayi", href: "/admin/guvenmetre", icon: ShieldCheck, badge: null },
        ]
    },
    {
        group: "YONETIM",
        items: [
            { name: "Finans ve Premium", href: "/admin/finans", icon: Banknote, badge: null },
            { name: "Icerik ve Trendler", href: "/admin/icerik", icon: Tags, badge: null },
            { name: "Reklam Yonetimi", href: "/admin/reklamlar", icon: Megaphone, badge: null },
            { name: "Rozet ve Seviyeler", href: "/admin/rozetler", icon: Award, badge: null },
            { name: "Kelime Filtresi", href: "/admin/kelime-filtresi", icon: Filter, badge: null },
            { name: "Toplu Yayin", href: "/admin/yayin", icon: Radio, badge: null },
            { name: "Sistem Loglari", href: "/admin/loglar", icon: Activity, badge: null },
            { name: "Sistem Ayarlari", href: "/admin/ayarlar", icon: Settings, badge: null },
        ]
    }
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { theme } = useTheme();
    const { user } = useAuth();

    return (
        <aside style={{
            width: '260px', backgroundColor: 'var(--navbar-bg)',
            borderRight: '1px solid var(--card-border)', display: 'flex',
            flexDirection: 'column', height: '100vh', position: 'sticky',
            top: 0, flexShrink: 0,
        }}>
            {/* Logo */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--card-border)' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                        <Image src={theme === 'light' ? "/whitemode_logo.svg" : "/dark_logo.svg"} alt="Otosoz Admin" fill style={{ objectFit: 'contain' }} priority />
                    </div>
                    <div>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--logo-text)', display: 'block', lineHeight: 1.1 }}>OTO SOZ</span>
                        <span style={{ fontSize: '9px', fontWeight: '700', color: 'white', letterSpacing: '1px', background: '#EF4444', padding: '1px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>YONETIM PANELI</span>
                    </div>
                </Link>
            </div>

            {/* Admin Info */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: '800', fontSize: '14px' }}>
                        {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{user?.username || 'Admin'}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#10B981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                            Cevrimici
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div style={{ padding: '12px 12px', flex: 1, overflowY: 'auto' }}>
                {navItems.map((group) => (
                    <div key={group.group} style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 8px', marginBottom: '6px' }}>
                            {group.group}
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link key={item.name} href={item.href}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            padding: '9px 12px', borderRadius: '8px',
                                            backgroundColor: isActive ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                                            color: isActive ? '#EF4444' : 'var(--foreground)',
                                            textDecoration: 'none', fontWeight: isActive ? '700' : '500',
                                            fontSize: '13px', transition: 'all 0.15s ease',
                                            borderLeft: isActive ? '3px solid #EF4444' : '3px solid transparent',
                                        }}
                                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--hover-primary)'; }}
                                        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                        <Icon size={16} style={{ flexShrink: 0 }} />
                                        <span style={{ flex: 1 }}>{item.name}</span>
                                        {item.badge && (
                                            <span style={{
                                                fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '10px',
                                                background: (item as any).badgeRed ? '#EF4444' : 'rgba(59,130,246,0.15)',
                                                color: (item as any).badgeRed ? 'white' : '#3B82F6',
                                            }}>{item.badge}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom: Siteye Don */}
            <div style={{ padding: '12px', borderTop: '1px solid var(--card-border)' }}>
                <Link href="/" style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '8px',
                    color: 'var(--text-muted)', textDecoration: 'none',
                    fontWeight: '500', fontSize: '13px', transition: 'all 0.15s ease',
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--hover-primary)'; e.currentTarget.style.color = 'var(--foreground)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                    <LogOut size={15} style={{ transform: 'rotate(180deg)' }} />
                    Ana Siteye Don
                </Link>
            </div>
        </aside>
    );
}
