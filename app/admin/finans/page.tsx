"use client";

import { useState, useEffect, useCallback } from "react";
import {
    TrendingUp, Banknote, CreditCard, Star, Users, Crown,
    ArrowUpRight, ArrowDownRight, Download, Calendar,
    RefreshCw, Search, X, ChevronRight, CheckCircle,
    Clock, AlertCircle, Zap, BarChart3, DollarSign
} from "lucide-react";


// â”€â”€ Tipler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface Transaction {
    id: string;
    user: string;
    displayName: string;
    type: "Premium Üyelik" | "Vitrin İlanı" | "Öne Çıkarma" | "Reklam";
    amount: number;
    date: string;
    status: "Tamamlandı" | "Bekliyor" | "İade";
    method: "Kredi Kartı" | "EFT/Havale" | "Sistem";
}

interface PremiumUser {
    username: string;
    displayName: string;
    city: string;
    carBrand: string;
    plan: "Aylık" | "Yıllık";
    renewDate: string;
    amount: number;
    active: boolean;
}

// Dinamik veriler — Firestore'dan gelecek
const generatePremiumUsers = (): PremiumUser[] => [];

const TRANSACTIONS: Transaction[] = [];

const PREMIUM_USERS = generatePremiumUsers();

const monthlyRevenue = [18400, 22100, 19800, 26500, 24200, 31800, 28900, 35100, 32400, 40200, 38700, 45800];
const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

type Tab = "ozet" | "islemler" | "premium";
type TxFilter = "hepsi" | "Tamamlandı" | "Bekliyor" | "İade";

function LineChart({ data, color, width = 380, height = 80 }: { data: number[]; color: string; width?: number; height?: number }) {
    const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 8) - 4}`).join(" ");
    const areaPoints = `0,${height} ${points} ${width},${height}`;
    const lastPoint = points.split(" ").pop()!.split(",");
    return (
        <svg width={width} height={height} style={{ overflow: "visible" }}>
            <defs>
                <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
            </defs>
            <polygon points={areaPoints} fill="url(#rev-grad)" />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={lastPoint[0]} cy={lastPoint[1]} r="5" fill={color} stroke="var(--card-bg)" strokeWidth="2" />
        </svg>
    );
}

export default function AdminFinancePage() {
    const [tab, setTab] = useState<Tab>("ozet");
    const [txFilter, setTxFilter] = useState<TxFilter>("hepsi");
    const [search, setSearch] = useState("");
    const [premiumSearch, setPremiumSearch] = useState("");

    const totalRevenue = TRANSACTIONS.filter(t => t.status === "Tamamlandı").reduce((s, t) => s + t.amount, 0);
    const pendingRevenue = TRANSACTIONS.filter(t => t.status === "Bekliyor").reduce((s, t) => s + t.amount, 0);
    const refundAmount = TRANSACTIONS.filter(t => t.status === "İade").reduce((s, t) => s + t.amount, 0);
    const activePremium = PREMIUM_USERS.filter(u => u.active).length;

    const txFiltered = TRANSACTIONS
        .filter(t => txFilter === "hepsi" || t.status === txFilter)
        .filter(t => !search || t.user.toLowerCase().includes(search.toLowerCase()) || t.displayName.toLowerCase().includes(search.toLowerCase()));

    const premiumFiltered = PREMIUM_USERS.filter(u =>
        !premiumSearch || u.username.toLowerCase().includes(premiumSearch.toLowerCase()) || u.displayName.toLowerCase().includes(premiumSearch.toLowerCase())
    );

    const txTypeColor = (type: string) => ({
        "Premium Üyelik": "#8B5CF6",
        "Vitrin İlanı": "#3B82F6",
        "Öne Çıkarma": "#F59E0B",
        "Reklam": "#10B981",
    }[type] || "#6B7280");

    const txStatusStyle = (s: string) => ({
        "Tamamlandı": { bg: "rgba(16,185,129,0.1)", color: "#10B981", icon: <CheckCircle size={11} /> },
        "Bekliyor": { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", icon: <Clock size={11} /> },
        "İade": { bg: "rgba(239,68,68,0.1)", color: "#EF4444", icon: <AlertCircle size={11} /> },
    }[s] || { bg: "rgba(100,100,100,0.1)", color: "#6B7280", icon: null });

    const barMax = Math.max(...monthlyRevenue);

    return (
        <div style={{ paddingBottom: "40px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Banknote size={24} color="var(--primary)" /> Finans & Premium
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Gelir takibi · Premium üyeler · Ödeme işlemleri</p>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)", padding: "10px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                    <Download size={14} /> Rapor İndir
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "6px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "4px", marginBottom: "22px", width: "fit-content" }}>
                {([
                    { key: "ozet", label: "📊 Özet" },
                    { key: "islemler", label: "💳 İŞlemler" },
                    { key: "premium", label: "👑 Premium Üyeler" },
                ] as { key: Tab; label: string }[]).map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "8px 18px", borderRadius: "7px", border: "none", background: tab === t.key ? "var(--primary)" : "transparent", color: tab === t.key ? "white" : "var(--text-muted)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* â”€â”€ ÖZET â”€â”€ */}
            {tab === "ozet" && (
                <>
                    {/* Stat Pills */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "14px", marginBottom: "22px" }}>
                        {[
                            { label: "Toplam Gelir (Nisan)", value: `₺${totalRevenue.toLocaleString("tr-TR")}`, sub: "+12% geçen aya göre", icon: <TrendingUp size={20} />, color: "#10B981", trend: "up" },
                            { label: "Bekleyen Tahsilat", value: `₺${pendingRevenue.toLocaleString("tr-TR")}`, sub: `${TRANSACTIONS.filter(t => t.status === "Bekliyor").length} işlem`, icon: <Clock size={20} />, color: "#F59E0B", trend: null },
                            { label: "Aktif Premium Üye", value: activePremium, sub: `${PREMIUM_USERS.length} toplam`, icon: <Crown size={20} />, color: "#8B5CF6", trend: "up" },
                            { label: "İade Edilen", value: `₺${refundAmount.toLocaleString("tr-TR")}`, sub: `${TRANSACTIONS.filter(t => t.status === "İade").length} işlem`, icon: <AlertCircle size={20} />, color: "#EF4444", trend: "down" },
                        ].map(s => (
                            <div key={s.label} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "18px 22px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                    <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>{s.label}</p>
                                    <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>{s.icon}</div>
                                </div>
                                <p style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: "900", color: "var(--foreground)" }}>{s.value}</p>
                                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-subtle)", display: "flex", alignItems: "center", gap: "4px" }}>
                                    {s.trend === "up" && <ArrowUpRight size={12} color="#10B981" />}
                                    {s.trend === "down" && <ArrowDownRight size={12} color="#EF4444" />}
                                    {s.sub}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Aylık Gelir Grafiği */}
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "20px" }}>
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "22px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "var(--foreground)" }}>Aylık Gelir Trendi</h3>
                                <span style={{ fontSize: "11px", background: "rgba(16,185,129,0.1)", color: "#10B981", padding: "3px 8px", borderRadius: "6px", fontWeight: "700" }}>+18% â†‘ YTD</span>
                            </div>
                            <p style={{ margin: "0 0 16px", fontSize: "22px", fontWeight: "900", color: "var(--foreground)" }}>
                                ₺{monthlyRevenue[monthlyRevenue.length - 1].toLocaleString("tr-TR")}
                                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "400" }}> / bu ay</span>
                            </p>
                            <LineChart data={monthlyRevenue} color="#10B981" />
                            <div style={{ display: "flex", gap: "0", marginTop: "10px" }}>
                                {months.map((m, i) => (
                                    <span key={i} style={{ fontSize: "9px", color: "var(--text-subtle)", flex: 1, textAlign: "center" }}>{m}</span>
                                ))}
                            </div>
                        </div>

                        {/* Gelir Dağılımı */}
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "22px" }}>
                            <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "700", color: "var(--foreground)" }}>Gelir Kaynakları</h3>
                            {[
                                { label: "Premium Üyelik", pct: 52, color: "#8B5CF6", amount: "₺23.816" },
                                { label: "Vitrin İlanı", pct: 24, color: "#3B82F6", amount: "₺10.992" },
                                { label: "Reklam Gelirleri", pct: 18, color: "#10B981", amount: "₺8.244" },
                                { label: "Öne Çıkarma", pct: 6, color: "#F59E0B", amount: "₺2.748" },
                            ].map(s => (
                                <div key={s.label} style={{ marginBottom: "14px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                        <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)" }}>{s.label}</span>
                                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                            <span style={{ fontSize: "12px", fontWeight: "800", color: s.color }}>%{s.pct}</span>
                                            <span style={{ fontSize: "11px", color: "var(--text-subtle)" }}>{s.amount}</span>
                                        </div>
                                    </div>
                                    <div style={{ height: "7px", background: "var(--border-subtle)", borderRadius: "4px", overflow: "hidden" }}>
                                        <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: "4px", transition: "width 1s ease" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Aylık Bar Chart */}
                    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "22px" }}>
                        <h3 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: "700", color: "var(--foreground)" }}>Aylık Karşılaştırma</h3>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "100px" }}>
                            {monthlyRevenue.map((v, i) => {
                                const isLast = i === monthlyRevenue.length - 1;
                                const pct = (v / barMax) * 100;
                                return (
                                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                                        {isLast && (
                                            <span style={{ fontSize: "10px", fontWeight: "800", color: "#10B981", whiteSpace: "nowrap", marginBottom: "-2px" }}>
                                                ₺{(v / 1000).toFixed(1)}K
                                            </span>
                                        )}
                                        <div style={{ width: "100%", height: `${pct}%`, background: isLast ? "linear-gradient(180deg, #10B981, #059669)" : `var(--border-subtle)`, borderRadius: "4px 4px 0 0", minHeight: "6px", position: "relative", transition: "height 0.5s ease" }}>
                                            {isLast && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100%", background: "linear-gradient(180deg, rgba(16,185,129,0.8), rgba(16,185,129,0.4))", borderRadius: "4px 4px 0 0" }} />}
                                        </div>
                                        <span style={{ fontSize: "9px", color: "var(--text-subtle)", textAlign: "center" }}>{months[i]}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {/* â”€â”€ İŞLEMLER â”€â”€ */}
            {tab === "islemler" && (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "10px", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", gap: "5px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "4px" }}>
                            {(["hepsi", "Tamamlandı", "Bekliyor", "İade"] as TxFilter[]).map(f => {
                                const count = f === "hepsi" ? TRANSACTIONS.length : TRANSACTIONS.filter(t => t.status === f).length;
                                return (
                                    <button key={f} onClick={() => setTxFilter(f)} style={{ padding: "6px 12px", borderRadius: "7px", border: "none", background: txFilter === f ? "var(--primary)" : "transparent", color: txFilter === f ? "white" : "var(--text-muted)", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                                        {f} <span style={{ fontSize: "10px", background: txFilter === f ? "rgba(255,255,255,0.25)" : "var(--background)", padding: "1px 5px", borderRadius: "8px", fontWeight: "800" }}>{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "0 12px", height: "40px", width: "220px", gap: "7px" }}>
                            <Search size={13} style={{ color: "var(--text-muted)" }} />
                            <input type="text" placeholder="Kullanıcı ara..." value={search} onChange={e => setSearch(e.target.value)}
                                style={{ border: "none", background: "transparent", outline: "none", width: "100%", color: "var(--foreground)", fontSize: "13px" }} />
                            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={12} /></button>}
                        </div>
                    </div>

                    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden" }}>
                        {/* Table Header */}
                        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 0.8fr 0.8fr 1fr", gap: "0", padding: "12px 20px", borderBottom: "1px solid var(--card-border)", background: "var(--background)" }}>
                            {["Kullanıcı", "Tür", "Tutar", "Durum", "Yöntem", "Tarih"].map(h => (
                                <span key={h} style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
                            ))}
                        </div>
                        {txFiltered.map((tx, i) => {
                            const ss = txStatusStyle(tx.status);
                            const tc = txTypeColor(tx.type);
                            return (
                                <div key={tx.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 0.8fr 0.8fr 1fr", gap: "0", padding: "14px 20px", borderBottom: i !== txFiltered.length - 1 ? "1px solid var(--border-subtle)" : "none", alignItems: "center" }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>{tx.displayName}</p>
                                        <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)" }}>@{tx.user} · {tx.id}</p>
                                    </div>
                                    <span style={{ fontSize: "12px", fontWeight: "700", background: `${tc}15`, color: tc, padding: "3px 8px", borderRadius: "6px", display: "inline-block" }}>{tx.type}</span>
                                    <span style={{ fontSize: "15px", fontWeight: "900", color: tx.status === "İade" ? "#EF4444" : "var(--foreground)" }}>
                                        {tx.status === "İade" ? "-" : ""}₺{tx.amount.toLocaleString("tr-TR")}
                                    </span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "5px", background: ss.bg, color: ss.color, padding: "4px 8px", borderRadius: "8px", width: "fit-content", fontSize: "11px", fontWeight: "700" }}>
                                        {ss.icon} {tx.status}
                                    </div>
                                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>{tx.method}</span>
                                    <span style={{ fontSize: "11px", color: "var(--text-subtle)" }}>{tx.date}</span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* â”€â”€ PREMIUM ÜYELER â”€â”€ */}
            {tab === "premium" && (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                            {[
                                { label: "Toplam Premium", val: PREMIUM_USERS.length, color: "#8B5CF6" },
                                { label: "Aktif", val: PREMIUM_USERS.filter(u => u.active).length, color: "#10B981" },
                                { label: "Yıllık Plan", val: PREMIUM_USERS.filter(u => u.plan === "Yıllık").length, color: "#F59E0B" },
                            ].map(s => (
                                <div key={s.label} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{ fontSize: "18px", fontWeight: "900", color: s.color }}>{s.val}</span>
                                    <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "0 12px", height: "40px", width: "220px", gap: "7px" }}>
                            <Search size={13} style={{ color: "var(--text-muted)" }} />
                            <input type="text" placeholder="Üye ara..." value={premiumSearch} onChange={e => setPremiumSearch(e.target.value)}
                                style={{ border: "none", background: "transparent", outline: "none", width: "100%", color: "var(--foreground)", fontSize: "13px" }} />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
                        {premiumFiltered.map(u => (
                            <div key={u.username} style={{ background: "var(--card-bg)", border: `1px solid ${u.active ? "var(--card-border)" : "rgba(107,114,128,0.3)"}`, borderRadius: "12px", padding: "16px 18px", opacity: u.active ? 1 : 0.7 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                    <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: u.plan === "Yıllık" ? "linear-gradient(135deg, #F59E0B, #D97706)" : "linear-gradient(135deg, #8B5CF6, #6D28D9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Crown size={18} color="white" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                                            <p style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "var(--foreground)" }}>{u.displayName}</p>
                                            {!u.active && <span style={{ fontSize: "10px", background: "rgba(107,114,128,0.15)", color: "#6B7280", padding: "2px 6px", borderRadius: "5px", fontWeight: "700" }}>Pasif</span>}
                                        </div>
                                        <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>@{u.username} · {u.city}</p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ display: "block", fontSize: "12px", fontWeight: "800", padding: "3px 8px", borderRadius: "8px", background: u.plan === "Yıllık" ? "rgba(245,158,11,0.12)" : "rgba(139,92,246,0.12)", color: u.plan === "Yıllık" ? "#F59E0B" : "#8B5CF6" }}>
                                            {u.plan}
                                        </span>
                                        <span style={{ fontSize: "13px", fontWeight: "900", color: "var(--foreground)" }}>₺{u.amount.toLocaleString("tr-TR")}</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "var(--background)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: "10px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Araç</p>
                                        <p style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: "var(--foreground)" }}>{u.carBrand}</p>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <p style={{ margin: 0, fontSize: "10px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Yenileme</p>
                                        <p style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: u.active ? "#10B981" : "#6B7280" }}>{u.renewDate}</p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ margin: 0, fontSize: "10px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Durum</p>
                                        <p style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: u.active ? "#10B981" : "#6B7280" }}>{u.active ? "âœ“ Aktif" : "X Pasif"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
