"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { ClipboardCheck, Clock, AlertTriangle, CheckCircle, Search, Filter, ChevronRight, Wrench, ShoppingCart, Car, Sparkles } from "lucide-react";

type JobStatus = "waiting" | "in_progress" | "completed";
type JobType = "buysell" | "fault" | "accident";

interface Job {
    id: string;
    type: JobType;
    title: string;
    from: string;
    date: string;
    status: JobStatus;
    summary: string;
}

const MOCK_JOBS: Job[] = [];

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; icon: any }> = {
    waiting: { label: "Bekliyor", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: Clock },
    in_progress: { label: "İnceleniyor", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", icon: Search },
    completed: { label: "Tamamlandı", color: "#22c55e", bg: "rgba(34,197,94,0.12)", icon: CheckCircle },
};

const TYPE_CONFIG: Record<JobType, { label: string; color: string; gradient: string; icon: any }> = {
    buysell: { label: "Alım-Satım", color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #ef4444)", icon: ShoppingCart },
    fault: { label: "Araç Arıza", color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #f97316)", icon: Wrench },
    accident: { label: "Kaza Destek", color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)", icon: Car },
};

export default function IslerimPage() {
    const { user } = useAuth();
    const [filter, setFilter] = useState<"all" | JobStatus>("all");
    const jobs = MOCK_JOBS;

    const filtered = filter === "all" ? jobs : jobs.filter(j => j.status === filter);

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: "100vh", background: "var(--background)" }}>
                {/* Hero Header */}
                <div style={{
                    background: "linear-gradient(135deg, rgba(124,77,255,0.08), rgba(255,107,0,0.06))",
                    borderBottom: "1px solid var(--card-border)",
                    padding: "32px 24px",
                }}>
                    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
                            <div style={{
                                width: "48px", height: "48px", borderRadius: "14px",
                                background: "linear-gradient(135deg, #7c4dff, #ff6b00)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <ClipboardCheck size={24} color="white" />
                            </div>
                            <div>
                                <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>İşlerim</h1>
                                <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                                    Gelen uzman talepleri ve iş durumları
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Banner */}
                <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 24px 0" }}>
                    <div style={{
                        background: "linear-gradient(135deg, rgba(124,77,255,0.1), rgba(255,107,0,0.08))",
                        border: "1px solid rgba(124,77,255,0.25)",
                        borderRadius: "16px",
                        padding: "20px 24px",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                    }}>
                        <div style={{
                            width: "44px", height: "44px", borderRadius: "12px",
                            background: "rgba(124,77,255,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                            <Sparkles size={22} color="#7c4dff" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)", margin: "0 0 4px 0" }}>
                                🚧 Bu modül geliştirme aşamasındadır
                            </h3>
                            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
                                Uzmana Sor premium hizmeti yakında aktif olacak. Aktif olduğunda gelen taleplerinizi buradan takip edebileceksiniz.
                            </p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div style={{ display: "flex", gap: "8px", marginTop: "24px", overflowX: "auto", paddingBottom: "4px" }}>
                        {([
                            { key: "all", label: "Tümü" },
                            { key: "waiting", label: "Bekleyen" },
                            { key: "in_progress", label: "İncelenen" },
                            { key: "completed", label: "Tamamlanan" },
                        ] as const).map(f => (
                            <button key={f.key} onClick={() => setFilter(f.key)} style={{
                                padding: "8px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: "600",
                                border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
                                background: filter === f.key ? "var(--primary)" : "var(--secondary)",
                                color: filter === f.key ? "white" : "var(--foreground)",
                            }}>{f.label}</button>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filtered.length === 0 && (
                        <div style={{
                            marginTop: "40px", textAlign: "center", padding: "60px 24px",
                            background: "var(--card-bg)", border: "1px solid var(--card-border)",
                            borderRadius: "20px",
                        }}>
                            <div style={{
                                width: "72px", height: "72px", borderRadius: "50%", margin: "0 auto 20px",
                                background: "linear-gradient(135deg, rgba(124,77,255,0.1), rgba(255,107,0,0.08))",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <ClipboardCheck size={32} color="var(--text-muted)" />
                            </div>
                            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--foreground)", marginBottom: "8px" }}>
                                Henüz iş talebiniz yok
                            </h3>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto", lineHeight: "1.6" }}>
                                Premium Uzmana Sor hizmeti aktif olduğunda, gelen talepler burada listelenecek.
                            </p>
                        </div>
                    )}

                    {/* Job Cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px", paddingBottom: "40px" }}>
                        {filtered.map(job => {
                            const status = STATUS_CONFIG[job.status];
                            const type = TYPE_CONFIG[job.type];
                            const StatusIcon = status.icon;
                            const TypeIcon = type.icon;
                            return (
                                <div key={job.id} style={{
                                    background: "var(--card-bg)", border: "1px solid var(--card-border)",
                                    borderRadius: "16px", padding: "20px", cursor: "pointer",
                                    transition: "all 0.2s",
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.transform = "none"; }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                                        <div style={{ display: "flex", gap: "14px", flex: 1 }}>
                                            <div style={{
                                                width: "44px", height: "44px", borderRadius: "12px",
                                                background: type.gradient,
                                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                            }}>
                                                <TypeIcon size={22} color="white" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                                                    <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: status.bg, color: status.color }}>
                                                        {status.label}
                                                    </span>
                                                    <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "600", background: "var(--secondary)", color: "var(--text-muted)" }}>
                                                        {type.label}
                                                    </span>
                                                </div>
                                                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)", margin: "0 0 4px 0" }}>{job.title}</h3>
                                                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                                                    {job.from} · {job.date}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} color="var(--text-muted)" style={{ marginTop: "12px" }} />
                                    </div>
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
