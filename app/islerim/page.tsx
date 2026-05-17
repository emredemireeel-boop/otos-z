"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
    ClipboardCheck, Clock, CheckCircle, Search, ChevronRight,
    Wrench, ShoppingCart, Car, Lock, Briefcase, AlertCircle,
    ArrowRight, Filter, MoreHorizontal
} from "lucide-react";

type JobStatus = "waiting" | "in_progress" | "completed";
type JobType = "buysell" | "fault" | "accident" | "expertise";

interface Job {
    id: string;
    type: JobType;
    title: string;
    from: string;
    date: string;
    status: JobStatus;
    summary: string;
    price?: string;
}

const MOCK_JOBS: Job[] = [];

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; icon: any }> = {
    waiting: { label: "Bekliyor", color: "#a3a3a3", icon: Clock },
    in_progress: { label: "İnceleniyor", color: "var(--foreground)", icon: Search },
    completed: { label: "Tamamlandı", color: "#22c55e", icon: CheckCircle },
};

const TYPE_CONFIG: Record<JobType, { label: string; icon: any }> = {
    buysell: { label: "Alım-Satım", icon: ShoppingCart },
    fault: { label: "Araç Arıza", icon: Wrench },
    accident: { label: "Kaza Destek", icon: Car },
    expertise: { label: "Ekspertiz", icon: ClipboardCheck },
};

export default function IslerimPage() {
    const { user, isLoading } = useAuth();
    const [filter, setFilter] = useState<"all" | JobStatus>("all");
    const jobs = MOCK_JOBS;

    const isExpert = (user?.role as string) === "uzman" || (user?.role as string) === "admin" || (user?.role as string) === "moderator";

    const filtered = filter === "all" ? jobs : jobs.filter(j => j.status === filter);

    const stats = {
        total: jobs.length,
        waiting: jobs.filter(j => j.status === "waiting").length,
        inProgress: jobs.filter(j => j.status === "in_progress").length,
        completed: jobs.filter(j => j.status === "completed").length,
    };

    if (!isLoading && !isExpert) {
        return (
            <div>
                <Navbar />
                <main style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{
                        maxWidth: "480px", width: "100%", margin: "0 20px",
                        background: "var(--card-bg)", border: "1px solid var(--card-border)",
                        borderRadius: "20px", padding: "48px 36px", textAlign: "center",
                    }}>
                        <div style={{
                            width: "64px", height: "64px", borderRadius: "50%",
                            background: "var(--secondary)", display: "flex",
                            alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
                        }}>
                            <Lock size={28} color="var(--text-muted)" />
                        </div>
                        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--foreground)", marginBottom: "12px" }}>
                            Erişim Kısıtlı
                        </h1>
                        <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.7", marginBottom: "28px" }}>
                            İşlerim paneli sadece <strong style={{ color: "var(--foreground)" }}>Uzman</strong> ve <strong style={{ color: "var(--foreground)" }}>Usta</strong> statüsündeki kullanıcılara açıktır.
                            Uzman başvurusu yaparak iş talebi alabilirsiniz.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <Link href="/uzman-ol" style={{ textDecoration: "none" }}>
                                <button style={{
                                    width: "100%", padding: "14px", borderRadius: "12px",
                                    background: "var(--foreground)", color: "var(--background)",
                                    border: "none", fontSize: "14px", fontWeight: "700",
                                    cursor: "pointer", display: "flex", alignItems: "center",
                                    justifyContent: "center", gap: "8px", transition: "opacity 0.2s",
                                }}>
                                    <Briefcase size={16} /> Uzman Başvurusu Yap
                                </button>
                            </Link>
                            <Link href="/ayarlar?tab=usta" style={{ textDecoration: "none" }}>
                                <button style={{
                                    width: "100%", padding: "14px", borderRadius: "12px",
                                    background: "transparent", color: "var(--foreground)",
                                    border: "1px solid var(--card-border)", fontSize: "14px",
                                    fontWeight: "600", cursor: "pointer", display: "flex",
                                    alignItems: "center", justifyContent: "center", gap: "8px",
                                }}>
                                    <Wrench size={16} /> Usta Ol Görevleri
                                </button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: "100vh", background: "var(--background)" }}>
                {/* Header */}
                <div style={{
                    borderBottom: "1px solid var(--card-border)",
                    padding: "28px 24px",
                }}>
                    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                <div style={{
                                    width: "44px", height: "44px", borderRadius: "12px",
                                    background: "var(--foreground)", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                }}>
                                    <ClipboardCheck size={22} color="var(--background)" />
                                </div>
                                <div>
                                    <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>İşlerim</h1>
                                    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                                        Gelen talepler ve iş takibi
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div style={{ display: "flex", gap: "20px" }}>
                                {[
                                    { label: "Toplam", value: stats.total },
                                    { label: "Bekleyen", value: stats.waiting },
                                    { label: "Aktif", value: stats.inProgress },
                                    { label: "Biten", value: stats.completed },
                                ].map(s => (
                                    <div key={s.label} style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--foreground)" }}>{s.value}</div>
                                        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: "960px", margin: "0 auto", padding: "24px 24px 60px" }}>
                    {/* Filter Tabs */}
                    <div style={{
                        display: "flex", gap: "6px", marginBottom: "24px",
                        borderBottom: "1px solid var(--card-border)", paddingBottom: "12px",
                    }}>
                        {([
                            { key: "all", label: "Tümü" },
                            { key: "waiting", label: "Bekleyen" },
                            { key: "in_progress", label: "Aktif" },
                            { key: "completed", label: "Tamamlanan" },
                        ] as const).map(f => (
                            <button key={f.key} onClick={() => setFilter(f.key)} style={{
                                padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600",
                                border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
                                background: filter === f.key ? "var(--foreground)" : "transparent",
                                color: filter === f.key ? "var(--background)" : "var(--text-muted)",
                            }}>{f.label}</button>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filtered.length === 0 && (
                        <div style={{
                            textAlign: "center", padding: "80px 24px",
                            background: "var(--card-bg)", border: "1px solid var(--card-border)",
                            borderRadius: "16px",
                        }}>
                            <div style={{
                                width: "56px", height: "56px", borderRadius: "50%", margin: "0 auto 20px",
                                background: "var(--secondary)", display: "flex",
                                alignItems: "center", justifyContent: "center",
                            }}>
                                <ClipboardCheck size={26} color="var(--text-muted)" />
                            </div>
                            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", marginBottom: "8px" }}>
                                Henüz iş talebiniz yok
                            </h3>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "360px", margin: "0 auto 24px", lineHeight: "1.6" }}>
                                Uzman profiliniz aktif olduğunda, kullanıcılardan gelen talepler burada listelenecek.
                            </p>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: "6px",
                                padding: "10px 20px", borderRadius: "8px",
                                background: "var(--secondary)", color: "var(--text-muted)",
                                fontSize: "12px", fontWeight: "600",
                            }}>
                                <AlertCircle size={14} /> Profiliniz kullanıcılara görünür durumdadır
                            </div>
                        </div>
                    )}

                    {/* Job Cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {filtered.map(job => {
                            const status = STATUS_CONFIG[job.status];
                            const type = TYPE_CONFIG[job.type];
                            const StatusIcon = status.icon;
                            const TypeIcon = type.icon;
                            return (
                                <div key={job.id} style={{
                                    background: "var(--card-bg)", border: "1px solid var(--card-border)",
                                    borderRadius: "12px", padding: "18px 20px", cursor: "pointer",
                                    transition: "all 0.15s",
                                    display: "flex", alignItems: "center", gap: "14px",
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--foreground)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--card-border)"; }}
                                >
                                    <div style={{
                                        width: "40px", height: "40px", borderRadius: "10px",
                                        background: "var(--secondary)", display: "flex",
                                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    }}>
                                        <TypeIcon size={20} color="var(--foreground)" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--foreground)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {job.title}
                                            </h3>
                                            <span style={{
                                                padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700",
                                                border: `1px solid ${status.color}20`,
                                                color: status.color,
                                            }}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                                            {job.from} · {job.date} · {type.label}
                                        </p>
                                    </div>
                                    {job.price && (
                                        <span style={{ fontSize: "14px", fontWeight: "800", color: "var(--foreground)", flexShrink: 0 }}>
                                            {job.price}
                                        </span>
                                    )}
                                    <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
