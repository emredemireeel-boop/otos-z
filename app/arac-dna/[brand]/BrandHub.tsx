
import { isVehicleIndexable } from '@/lib/indexability';
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createSlug, getDNAScoreColor, getDNAScoreLabel, isVehicleEditoriallyReviewed } from "@/data/vehicle-dna";
import { BrandFilterClient, BrandFilterControls } from "./BrandFilterClient";
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
    userExperiences: any[];
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
    const searchQuery = "";
    const sortBy: "score" | "name" = "score";

    const brandSlug = createSlug(brandName);
    const reviewedModels = models.filter(model => isVehicleIndexable(model));
    const avgScore = reviewedModels.length
        ? Math.round(reviewedModels.reduce((sum, vehicle) => sum + vehicle.dnaScore, 0) / reviewedModels.length)
        : 0;

    const filtered = reviewedModels
        .filter(m => m.model.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            const reviewOrder = Number(isVehicleIndexable(b)) - Number(isVehicleIndexable(a));
            if (reviewOrder !== 0) return reviewOrder;
            return sortBy === "score" ? b.dnaScore - a.dnaScore : a.model.localeCompare(b.model, 'tr');
        });

    return (
        <BrandFilterClient>
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

                    <BrandFilterControls brandName={brandName}/>
                    {/* Model List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {filtered.length === 0 && (
                            <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                                Eşleşen model bulunamadı
                            </div>
                        )}
                        {filtered.map(model => {
                            const isReviewed = isVehicleIndexable(model);
                            const scoreColor = isReviewed ? getDNAScoreColor(model.dnaScore) : '#d97706';
                            return (
                                <Link
                                    key={model.id}
                                    data-model-card data-name={model.model} data-score={model.dnaScore}
                                        href={`/arac-dna/${brandSlug}/${createSlug(model.model)}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <div style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        background: "var(--card-bg)", border: "1px solid var(--card-border)",
                                        borderRadius: 14, padding: "18px 20px",
                                        transition: "all 0.2s ease", cursor: "pointer",
                                    }}
                                    
                                     data-hover-card>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", marginBottom: 4 }}>
                                                {model.model}
                                            </div>
                                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 13, color: "var(--text-muted)" }}>
                                                {isReviewed ? (
                                                    <>
                                                        {model.ncapStars && <span>⭐ NCAP {model.ncapStars}/5</span>}
                                                        {model.engineCount > 0 && <span>🔧 {model.engineCount} motor seçeneği</span>}
                                                        {model.chronicIssues?.length > 0 && (
                                                            <span style={{ color: "#f59e0b" }}>⚠️ {model.chronicIssues.length} kronik sorun</span>
                                                        )}
                                                        <span>📊 {model.totalReports} rapor</span>
                                                    </>
                                                ) : (
                                                    <span style={{ color: '#d97706', fontWeight: 700 }}>Kaynak kontrolü sürüyor</span>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{
                                                width: 48, height: 48, borderRadius: 12,
                                                background: `${scoreColor}18`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontWeight: 800, fontSize: 18, color: scoreColor,
                                            }}>
                                                {isReviewed ? model.dnaScore : 'Kontrol'}
                                            </div>
                                            <ChevronRight size={20} color="var(--text-muted)" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                        <p data-empty-models hidden role="status">Aramanıza uygun model bulunamadı.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </BrandFilterClient>
    );
}
