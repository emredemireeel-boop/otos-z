"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    Flag, Users, MessageSquareWarning, ShoppingCart, ShieldCheck,
    Megaphone, Filter, Activity, Award, Radio, Lock,
    TrendingUp, AlertTriangle, Shield, FileText
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const QUICK_LINKS = [
    { label: "Sikayet Kuyrugu", href: "/moderator/raporlar", icon: <Flag size={20} />, color: "#EF4444" },
    { label: "Icerik Moderasyonu", href: "/moderator/moderasyon", icon: <MessageSquareWarning size={20} />, color: "#F59E0B" },
    { label: "Kullanici Yonetimi", href: "/moderator/kullanicilar", icon: <Users size={20} />, color: "#3B82F6" },
    { label: "Pazar Kontrolu", href: "/moderator/pazar", icon: <ShoppingCart size={20} />, color: "#10B981" },
    { label: "Guvenmetre Onayi", href: "/moderator/guvenmetre", icon: <ShieldCheck size={20} />, color: "#8B5CF6" },
    { label: "Kelime Filtresi", href: "/moderator/kelime-filtresi", icon: <Filter size={20} />, color: "#06B6D4" },
];

export default function ModeratorDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ threads: 0, users: 0, entries: 0 });

    useEffect(() => {
        async function load() {
            try {
                const threadsDocs = await getDocs(collection(db, 'threads'));
                const usersDocs = await getDocs(collection(db, 'users'));
                let totalEntries = 0;
                threadsDocs.forEach(d => { totalEntries += d.data().entryCount || 0; });
                setStats({ threads: threadsDocs.size, users: usersDocs.size, entries: totalEntries });
            } catch (e) {
                console.error('Moderator stats hatasi:', e);
            }
        }
        load();
    }, []);

    return (
        <div style={{ paddingBottom: "40px" }}>
            {/* Header */}
            <div style={{ marginBottom: "26px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg,#8B5CF6,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900", fontSize: "20px" }}>
                        {user?.username?.charAt(0)?.toUpperCase() || "M"}
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "900", color: "var(--foreground)" }}>
                            Hos geldin, {user?.username || "Moderator"}!
                        </h1>
                        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Shield size={13} color="#8B5CF6" /> Moderator Paneli
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "22px" }}>
                {[
                    { label: "Toplam Baslik", val: stats.threads, color: "#3B82F6", icon: <MessageSquareWarning size={16} /> },
                    { label: "Toplam Kullanici", val: stats.users, color: "#10B981", icon: <Users size={16} /> },
                    { label: "Toplam Entry", val: stats.entries, color: "#8B5CF6", icon: <FileText size={16} /> },
                ].map(s => (
                    <div key={s.label} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", background: `${s.color}15`, borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>{s.icon}</div>
                        <div>
                            <p style={{ margin: "0 0 2px", fontSize: "20px", fontWeight: "900", color: "var(--foreground)" }}>{s.val}</p>
                            <p style={{ margin: 0, fontSize: "10px", fontWeight: "600", color: "var(--text-muted)" }}>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hizli Erisim */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--card-border)" }}>
                    <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <TrendingUp size={16} color="#8B5CF6" /> Hizli Erisim
                    </h3>
                    <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)" }}>Moderasyon modulleri</p>
                </div>
                <div style={{ padding: "12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    {QUICK_LINKS.map(link => (
                        <Link key={link.href} href={link.href}
                            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderRadius: "10px", border: "1px solid var(--border-subtle)", background: "var(--background)", textDecoration: "none", color: "var(--foreground)", transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = link.color; e.currentTarget.style.background = `${link.color}08`; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.background = "var(--background)"; }}>
                            <span style={{ color: link.color, flexShrink: 0 }}>{link.icon}</span>
                            <span style={{ fontSize: "13px", fontWeight: "700" }}>{link.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
