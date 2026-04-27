"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Shield, Flag, Users, MessageSquareWarning, ShoppingCart,
    ShieldCheck, Megaphone, Filter, Activity, LogOut,
    Radio, Award, LayoutDashboard, Lock
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ALL_NAV = [
    { name: "Gosterge Paneli", href: "/moderator", icon: LayoutDashboard },
    { name: "Sikayet Kuyrugu", href: "/moderator/raporlar", icon: Flag },
    { name: "Kullanici Yonetimi", href: "/moderator/kullanicilar", icon: Users },
    { name: "Icerik Moderasyonu", href: "/moderator/moderasyon", icon: MessageSquareWarning },
    { name: "Pazar Kontrolu", href: "/moderator/pazar", icon: ShoppingCart },
    { name: "Guvenmetre Onayi", href: "/moderator/guvenmetre", icon: ShieldCheck },
    { name: "Duyuru Yonetimi", href: "/moderator/duyurular", icon: Megaphone },
    { name: "Kelime Filtresi", href: "/moderator/kelime-filtresi", icon: Filter },
    { name: "Sistem Loglari", href: "/moderator/loglar", icon: Activity },
    { name: "Rozet Atama", href: "/moderator/rozetler", icon: Award },
    { name: "Toplu Yayin", href: "/moderator/yayin", icon: Radio },
];

export default function ModeratorSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const { theme } = useTheme();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("Otosoz_user");
            router.push("/giris");
        } catch (e) {
            console.error("Cikis hatasi:", e);
        }
    };

    return (
        <aside style={{ width: "250px", backgroundColor: "var(--navbar-bg)", borderRight: "1px solid var(--card-border)", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0 }}>
            {/* Logo */}
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--card-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ position: "relative", width: "30px", height: "30px" }}>
                        <Image src={theme === "light" ? "/whitemode_logo.svg" : "/dark_logo.svg"} alt="Otosoz" fill sizes="30px" style={{ objectFit: "contain" }} priority />
                    </div>
                    <div>
                        <span style={{ fontSize: "13px", fontWeight: "800", color: "var(--logo-text)", display: "block", lineHeight: 1.1 }}>OTO SOZ</span>
                        <span style={{ fontSize: "9px", fontWeight: "700", color: "white", letterSpacing: "1px", background: "#8B5CF6", padding: "1px 6px", borderRadius: "4px", display: "inline-block", marginTop: "2px" }}>
                            MODERATOR
                        </span>
                    </div>
                </div>
            </div>

            {/* Moderator info */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--card-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#8B5CF6,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "white", fontWeight: "800", fontSize: "14px" }}>
                        {user?.username?.charAt(0)?.toUpperCase() || "M"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: "12px", fontWeight: "800", color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.username || "Moderator"}</p>
                        <p style={{ margin: 0, fontSize: "10px", color: "#8B5CF6", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                            <Shield size={10} /> Moderator
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div style={{ padding: "10px", flex: 1, overflowY: "auto" }}>
                <h4 style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 8px", marginBottom: "6px", marginTop: "4px" }}>
                    MODERASYON
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    {ALL_NAV.map(item => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={item.href}
                                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", backgroundColor: isActive ? "rgba(139,92,246,0.1)" : "transparent", color: isActive ? "#8B5CF6" : "var(--foreground)", textDecoration: "none", fontWeight: isActive ? "700" : "500", fontSize: "13px", transition: "all 0.15s", borderLeft: isActive ? "3px solid #8B5CF6" : "3px solid transparent" }}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--hover-primary)"; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}>
                                <Icon size={15} style={{ flexShrink: 0 }} />
                                <span style={{ flex: 1 }}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Bottom */}
            <div style={{ padding: "10px", borderTop: "1px solid var(--card-border)", display: "flex", flexDirection: "column", gap: "4px" }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", color: "var(--text-muted)", textDecoration: "none", fontSize: "12px", fontWeight: "500" }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--hover-primary)"; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                    <LogOut size={14} style={{ transform: "rotate(180deg)" }} /> Ana Siteye Don
                </Link>
                <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", color: "#EF4444", background: "none", border: "none", fontSize: "12px", fontWeight: "600", cursor: "pointer", textAlign: "left", width: "100%" }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                    <LogOut size={14} /> Cikis Yap
                </button>
            </div>
        </aside>
    );
}
