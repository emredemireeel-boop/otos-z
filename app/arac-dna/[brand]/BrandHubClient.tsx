"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createSlug, getDNAScoreColor, getDNAScoreLabel } from "@/data/vehicle-dna";
import { useState } from "react";
import { Search, Car, ArrowLeft, TrendingUp, AlertTriangle, ChevronRight } from "lucide-react";

interface ModelData {
    id: number;
    brand: string;
    model: string;
    year: string;
    dnaScore: number;
    strengths: string[];
    weaknesses: string[];
    chronicIssues: any[];
    totalReports: number;
    ncapStars?: number;
    ncapYear?: string;
    engineCount: number;
}

interface Props {
    brandName: string;
    models: ModelData[];
}

export default function BrandHubClient({ brandName, models }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"score" | "name">("score");

    const brandSlug = createSlug(brandName);
    const avgScore = Math.round(models.reduce((s, v) => s + v.dnaScore, 0) / models.length);

    const filtered = models
        .filter(m => m.model.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => sortBy === "score" ? b.dnaScore - a.dnaScore : a.model.localeCompare(b.model, 'tr'));

    return (
        <>
            <Navbar />
            <main style={{ minHeight: "100vh", background: "var(--background)", padding: "0 20px 60px" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", paddingTop: 32 }}>

                    {/* Breadcrumb */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 14, color: "var(--text-muted)" }}>
                        <Link href="/arac-dna" style={{ color: "var(--primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                            <ArrowLeft size={16} /> Araç DNA
                        </Link>
                        <span>/</span>
                        <span style={{ color: "var(--foreground)" }}>{brandName}</span>
                    </div>

                    {/* Hero */}
                    <div style={{
                        background: "linear-gradient(135deg, var(--card-bg), var(--card-bg-hover))",
                        border: "1px solid var(--card-border)",
                        borderRadius: 16,
                        padding: "32px 28px",
                        marginBottom: 28,
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: 14,
                                background: "linear-gradient(135deg, var(--primary), var(--primary-dark, #3b82f6))",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <Car size={28} color="white" />
                            </div>
                            <div>
                                <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--foreground)", margin: 0 }}>
                                    {brandName} Araç DNA Analizi
                                </h1>
                                <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "4px 0 0" }}>
                                    {models.length} model detaylı analiz edildi
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginTop: 20 }}>
                            <div style={{
                                background: "var(--background)", borderRadius: 12, padding: "14px 16px",
                                textAlign: "center", border: "1px solid var(--card-border)"
                            }}>
                                <div style={{ fontSize: 24, fontWeight: 800, color: getDNAScoreColor(avgScore) }}>{avgScore}</div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Ort. DNA Puanı</div>
                            </div>
                            <div style={{
                                background: "var(--background)", borderRadius: 12, padding: "14px 16px",
                                textAlign: "center", border: "1px solid var(--card-border)"
                            }}>
                                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--foreground)" }}>{models.length}</div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Model</div>
                            </div>
                            <div style={{
                                background: "var(--background)", borderRadius: 12, padding: "14px 16px",
                                textAlign: "center", border: "1px solid var(--card-border)"
                            }}>
                                <div style={{ fontSize: 24, fontWeight: 800, color: "#22c55e" }}>
                                    {getDNAScoreLabel(avgScore)}
                                </div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Genel Değerlendirme</div>
                            </div>
                        </div>
                    </div>

                    {/* Search + Sort */}
                    <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                        <div style={{
                            flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8,
                            background: "var(--card-bg)", border: "1px solid var(--card-border)",
                            borderRadius: 12, padding: "0 14px",
                        }}>
                            <Search size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder={`${brandName} model ara...`}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                    flex: 1, padding: "12px 0", background: "transparent",
                                    border: "none", color: "var(--foreground)", fontSize: 15, outline: "none",
                                }}
                            />
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                            {(["score", "name"] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSortBy(s)}
                                    style={{
                                        padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                                        border: sortBy === s ? "1.5px solid var(--primary)" : "1px solid var(--card-border)",
                                        background: sortBy === s ? "var(--primary)" : "var(--card-bg)",
                                        color: sortBy === s ? "white" : "var(--text-muted)",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {s === "score" ? "Puana Göre" : "İsme Göre"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Model List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {filtered.length === 0 && (
                            <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                                Eşleşen model bulunamadı
                            </div>
                        )}
                        {filtered.map(model => {
                            const scoreColor = getDNAScoreColor(model.dnaScore);
                            return (
                                <Link
                                    key={model.id}
                                    href={`/arac-dna/${brandSlug}/${createSlug(model.model)}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <div style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        background: "var(--card-bg)", border: "1px solid var(--card-border)",
                                        borderRadius: 14, padding: "18px 20px",
                                        transition: "all 0.2s ease", cursor: "pointer",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = "var(--primary)";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = "var(--card-border)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", marginBottom: 4 }}>
                                                {model.model}
                                            </div>
                                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 13, color: "var(--text-muted)" }}>
                                                {model.ncapStars && (
                                                    <span>⭐ NCAP {model.ncapStars}/5</span>
                                                )}
                                                {model.engineCount > 0 && (
                                                    <span>🔧 {model.engineCount} motor seçeneği</span>
                                                )}
                                                {model.chronicIssues?.length > 0 && (
                                                    <span style={{ color: "#f59e0b" }}>
                                                        ⚠️ {model.chronicIssues.length} kronik sorun
                                                    </span>
                                                )}
                                                <span>📊 {model.totalReports} rapor</span>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{
                                                width: 48, height: 48, borderRadius: 12,
                                                background: `${scoreColor}18`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontWeight: 800, fontSize: 18, color: scoreColor,
                                            }}>
                                                {model.dnaScore}
                                            </div>
                                            <ChevronRight size={20} color="var(--text-muted)" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
