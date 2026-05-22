"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    vehicleDNAData,
    VehicleDNA,
    getDNAScoreColor,
    getDNAScoreLabel,
    getSeverityColor,
    getSeverityLabel,
    createSlug,
} from "@/data/vehicle-dna";
import { engineDNAData, EngineOption } from "@/data/engine-dna";
import { trimLevelsData } from "@/data/trim-levels";
import {
    Dna,
    X,
    Plus,
    Search,
    Shield,
    Star,
    TrendingUp,
    TrendingDown,
    Wrench,
    Zap,
    AlertCircle,
    ChevronDown,
    ArrowLeft,
    BarChart3,
    Package,
    Check,
    Minus,
    Trophy,
    Scale,
    Sparkles,
    Circle,
} from "lucide-react";

const MAX_COMPARE = 3;

interface SelectedVehicle {
    vehicle: VehicleDNA;
    engine: EngineOption | null;
}

export default function DNAComparisonPage() {
    const [selectedVehicles, setSelectedVehicles] = useState<SelectedVehicle[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSlot, setActiveSlot] = useState<number | null>(null);
    const [engineSelectors, setEngineSelectors] = useState<Record<number, boolean>>({});
    const [activeTab, setActiveTab] = useState<string>("overview");

    // Build searchable list
    const allVehicles = useMemo(() => vehicleDNAData, []);

    const filteredVehicles = useMemo(() => {
        if (!searchQuery.trim()) return allVehicles.slice(0, 20);
        const q = searchQuery.toLowerCase();
        return allVehicles.filter(
            (v) =>
                v.brand.toLowerCase().includes(q) ||
                v.model.toLowerCase().includes(q) ||
                `${v.brand} ${v.model}`.toLowerCase().includes(q)
        );
    }, [searchQuery, allVehicles]);

    const addVehicle = (vehicle: VehicleDNA, slotIndex: number) => {
        const engines = engineDNAData.find((e) => e.vehicleId === vehicle.id);
        const newSelected: SelectedVehicle = { vehicle, engine: null };

        const updated = [...selectedVehicles];
        if (slotIndex < updated.length) {
            updated[slotIndex] = newSelected;
        } else {
            updated.push(newSelected);
        }
        setSelectedVehicles(updated);
        setActiveSlot(null);
        setSearchQuery("");

        // Show engine selector if engines exist
        if (engines && engines.engines.length > 0) {
            setEngineSelectors((prev) => ({ ...prev, [slotIndex]: true }));
        }
    };

    const setEngine = (slotIndex: number, engine: EngineOption) => {
        const updated = [...selectedVehicles];
        if (updated[slotIndex]) {
            updated[slotIndex] = { ...updated[slotIndex], engine };
        }
        setSelectedVehicles(updated);
        setEngineSelectors((prev) => ({ ...prev, [slotIndex]: false }));
    };

    const removeVehicle = (index: number) => {
        setSelectedVehicles((prev) => prev.filter((_, i) => i !== index));
        setEngineSelectors((prev) => {
            const n = { ...prev };
            delete n[index];
            return n;
        });
    };

    const getEnginesForVehicle = (vehicleId: number) => {
        return engineDNAData.find((e) => e.vehicleId === vehicleId)?.engines || [];
    };

    const getTrimsForVehicle = (vehicleId: number) => {
        return trimLevelsData.find((t) => t.vehicleId === vehicleId) || null;
    };

    // Color assignments for comparison columns
    const columnColors = ["#3b82f6", "#8b5cf6", "#f59e0b"];

    const isComparing = selectedVehicles.length >= 2;

    const tabs = [
        { id: "overview", label: "Genel Bakış", icon: <BarChart3 size={16} /> },
        { id: "pros-cons", label: "Artılar & Eksiler", icon: <Scale size={16} /> },
        { id: "chronic", label: "Kronik Sorunlar", icon: <Wrench size={16} /> },
        { id: "engines", label: "Motor Seçenekleri", icon: <Zap size={16} /> },
        { id: "trims", label: "Donanım Paketleri", icon: <Package size={16} /> },
    ];

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: "100vh", background: "var(--background)", paddingTop: "60px" }}>
                {/* Hero */}
                <div
                    style={{
                        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.08), rgba(245, 158, 11, 0.05))",
                        borderBottom: "1px solid var(--card-border)",
                        padding: "40px 24px",
                    }}
                >
                    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                        <Link href="/arac-dna" style={{ textDecoration: "none" }}>
                            <button
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "8px 16px",
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--card-border)",
                                    borderRadius: "10px",
                                    color: "var(--foreground)",
                                    cursor: "pointer",
                                    marginBottom: "20px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                }}
                            >
                                <ArrowLeft size={16} /> Araç DNA&apos;ya Dön
                            </button>
                        </Link>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                            <div
                                style={{
                                    width: "64px",
                                    height: "64px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
                                }}
                            >
                                <Scale size={32} color="white" />
                            </div>
                            <div>
                                <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>
                                    DNA Kıyaslama
                                </h1>
                                <p style={{ fontSize: "16px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                                    {MAX_COMPARE} araca kadar seçip DNA profillerini tablolar halinde detaylı kıyaslayın.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
                    {/* Vehicle Selection Slots */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${MAX_COMPARE}, 1fr)`,
                            gap: "16px",
                            marginBottom: "32px",
                        }}
                    >
                        {Array.from({ length: MAX_COMPARE }).map((_, slotIndex) => {
                            const selected = selectedVehicles[slotIndex];
                            const isOpen = activeSlot === slotIndex;
                            const color = columnColors[slotIndex];
                            const engines = selected ? getEnginesForVehicle(selected.vehicle.id) : [];
                            const showEngineSelector = engineSelectors[slotIndex];

                            return (
                                <div key={slotIndex} style={{ position: "relative" }}>
                                    {/* Slot Card */}
                                    <div
                                        style={{
                                            background: selected ? "var(--card-bg)" : "var(--secondary)",
                                            border: `2px ${selected ? "solid" : "dashed"} ${selected ? color : "var(--card-border)"}`,
                                            borderRadius: "16px",
                                            padding: "20px",
                                            minHeight: "140px",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            cursor: selected ? "default" : "pointer",
                                            transition: "all 0.3s",
                                            position: "relative",
                                        }}
                                        onClick={() => !selected && setActiveSlot(isOpen ? null : slotIndex)}
                                        onMouseEnter={(e) => {
                                            if (!selected) {
                                                e.currentTarget.style.borderColor = color;
                                                e.currentTarget.style.background = "var(--card-bg)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!selected) {
                                                e.currentTarget.style.borderColor = "var(--card-border)";
                                                e.currentTarget.style.background = "var(--secondary)";
                                            }
                                        }}
                                    >
                                        {selected ? (
                                            <>
                                                {/* Remove button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeVehicle(slotIndex);
                                                    }}
                                                    style={{
                                                        position: "absolute",
                                                        top: "10px",
                                                        right: "10px",
                                                        width: "28px",
                                                        height: "28px",
                                                        borderRadius: "50%",
                                                        background: "rgba(239, 68, 68, 0.1)",
                                                        border: "1px solid rgba(239, 68, 68, 0.3)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        cursor: "pointer",
                                                        transition: "all 0.2s",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = "#ef4444";
                                                        (e.currentTarget.firstChild as any)?.style && ((e.currentTarget.firstChild as HTMLElement).style.color = "white");
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                                                    }}
                                                >
                                                    <X size={14} color="#ef4444" />
                                                </button>

                                                {/* Slot number badge */}
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "10px",
                                                        left: "10px",
                                                        width: "24px",
                                                        height: "24px",
                                                        borderRadius: "50%",
                                                        background: color,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "12px",
                                                        fontWeight: "800",
                                                        color: "white",
                                                    }}
                                                >
                                                    {slotIndex + 1}
                                                </div>

                                                {/* Vehicle info */}
                                                <div style={{ textAlign: "center", width: "100%" }}>
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            fontWeight: "700",
                                                            color: "var(--foreground)",
                                                            marginBottom: "4px",
                                                            lineHeight: "1.3",
                                                        }}
                                                    >
                                                        {selected.vehicle.brand}{" "}
                                                        {selected.vehicle.model.replace(/\s*\([^)]+\)/, "").trim()}
                                                    </div>
                                                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                                                        {selected.vehicle.year}
                                                    </div>

                                                    {/* Engine selection */}
                                                    {selected.engine ? (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                gap: "6px",
                                                                padding: "6px 12px",
                                                                background: `${color}15`,
                                                                borderRadius: "8px",
                                                                fontSize: "12px",
                                                                fontWeight: "600",
                                                                color: color,
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                setEngineSelectors((prev) => ({
                                                                    ...prev,
                                                                    [slotIndex]: true,
                                                                }))
                                                            }
                                                        >
                                                            <Zap size={12} />
                                                            {selected.engine.name}
                                                            <ChevronDown size={12} />
                                                        </div>
                                                    ) : engines.length > 0 ? (
                                                        <button
                                                            onClick={() =>
                                                                setEngineSelectors((prev) => ({
                                                                    ...prev,
                                                                    [slotIndex]: true,
                                                                }))
                                                            }
                                                            style={{
                                                                padding: "6px 12px",
                                                                background: `${color}15`,
                                                                border: `1px dashed ${color}50`,
                                                                borderRadius: "8px",
                                                                fontSize: "12px",
                                                                fontWeight: "600",
                                                                color: color,
                                                                cursor: "pointer",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "4px",
                                                                margin: "0 auto",
                                                            }}
                                                        >
                                                            <Zap size={12} /> Motor Seç
                                                        </button>
                                                    ) : null}

                                                    {/* DNA Score badge */}
                                                    <div
                                                        style={{
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "6px",
                                                            padding: "6px 14px",
                                                            borderRadius: "20px",
                                                            background: `${getDNAScoreColor(selected.engine?.score ?? selected.vehicle.dnaScore)}15`,
                                                            border: `1px solid ${getDNAScoreColor(selected.engine?.score ?? selected.vehicle.dnaScore)}30`,
                                                            marginTop: "8px",
                                                        }}
                                                    >
                                                        <Dna size={14} color={getDNAScoreColor(selected.engine?.score ?? selected.vehicle.dnaScore)} />
                                                        <span
                                                            style={{
                                                                fontSize: "16px",
                                                                fontWeight: "800",
                                                                color: getDNAScoreColor(selected.engine?.score ?? selected.vehicle.dnaScore),
                                                            }}
                                                        >
                                                            {selected.engine?.score ?? selected.vehicle.dnaScore}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    style={{
                                                        width: "48px",
                                                        height: "48px",
                                                        borderRadius: "50%",
                                                        background: `${color}15`,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        marginBottom: "12px",
                                                    }}
                                                >
                                                    <Plus size={24} color={color} />
                                                </div>
                                                <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>
                                                    {slotIndex + 1}. Araç Ekle
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Engine Selector Dropdown */}
                                    {showEngineSelector && selected && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                left: 0,
                                                right: 0,
                                                marginTop: "8px",
                                                background: "var(--card-bg)",
                                                border: "1px solid var(--card-border)",
                                                borderRadius: "12px",
                                                boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
                                                zIndex: 50,
                                                overflow: "hidden",
                                                maxHeight: "300px",
                                                overflowY: "auto",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: "12px 16px",
                                                    borderBottom: "1px solid var(--card-border)",
                                                    fontSize: "13px",
                                                    fontWeight: "700",
                                                    color: "var(--text-muted)",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                Motor Seçin
                                                <button
                                                    onClick={() =>
                                                        setEngineSelectors((prev) => ({
                                                            ...prev,
                                                            [slotIndex]: false,
                                                        }))
                                                    }
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        padding: "4px",
                                                    }}
                                                >
                                                    <X size={14} color="var(--text-muted)" />
                                                </button>
                                            </div>
                                            {engines.map((engine) => (
                                                <div
                                                    key={engine.slug}
                                                    onClick={() => setEngine(slotIndex, engine)}
                                                    style={{
                                                        padding: "12px 16px",
                                                        cursor: "pointer",
                                                        transition: "all 0.15s",
                                                        borderBottom: "1px solid var(--card-border)",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-primary)")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                                >
                                                    <div>
                                                        <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                                                            {engine.name}
                                                        </div>
                                                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                                            {engine.fuelType} • {engine.transmission}
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "13px",
                                                            fontWeight: "800",
                                                            color: getDNAScoreColor(engine.score),
                                                        }}
                                                    >
                                                        {engine.score}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Vehicle Search Dropdown */}
                                    {isOpen && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                left: 0,
                                                right: 0,
                                                marginTop: "8px",
                                                background: "var(--card-bg)",
                                                border: "1px solid var(--card-border)",
                                                borderRadius: "12px",
                                                boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
                                                zIndex: 100,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div style={{ padding: "12px", borderBottom: "1px solid var(--card-border)" }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                        padding: "10px 14px",
                                                        background: "var(--secondary)",
                                                        borderRadius: "10px",
                                                    }}
                                                >
                                                    <Search size={16} color="var(--text-muted)" />
                                                    <input
                                                        type="text"
                                                        placeholder="Marka veya model ara..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        autoFocus
                                                        style={{
                                                            flex: 1,
                                                            background: "transparent",
                                                            border: "none",
                                                            outline: "none",
                                                            color: "var(--foreground)",
                                                            fontSize: "14px",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                                                {filteredVehicles.map((v) => {
                                                    const alreadySelected = selectedVehicles.some(
                                                        (s) => s.vehicle.id === v.id
                                                    );
                                                    return (
                                                        <div
                                                            key={v.id}
                                                            onClick={() => !alreadySelected && addVehicle(v, slotIndex)}
                                                            style={{
                                                                padding: "12px 16px",
                                                                cursor: alreadySelected ? "not-allowed" : "pointer",
                                                                opacity: alreadySelected ? 0.4 : 1,
                                                                transition: "all 0.15s",
                                                                borderBottom: "1px solid var(--card-border)",
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                if (!alreadySelected) e.currentTarget.style.background = "var(--hover-primary)";
                                                            }}
                                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                                        >
                                                            <div>
                                                                <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                                                                    {v.brand} {v.model.replace(/\s*\([^)]+\)/, "").trim()}
                                                                </div>
                                                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{v.year}</div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "6px",
                                                                }}
                                                            >
                                                                <Dna size={14} color={getDNAScoreColor(v.dnaScore)} />
                                                                <span
                                                                    style={{
                                                                        fontSize: "14px",
                                                                        fontWeight: "800",
                                                                        color: getDNAScoreColor(v.dnaScore),
                                                                    }}
                                                                >
                                                                    {v.dnaScore}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {filteredVehicles.length === 0 && (
                                                    <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                                                        Araç bulunamadı
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Comparison Content */}
                    {isComparing ? (
                        <>
                            {/* Tabs */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "6px",
                                    marginBottom: "24px",
                                    overflowX: "auto",
                                    paddingBottom: "8px",
                                }}
                                className="hide-scrollbar"
                            >
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "12px 20px",
                                            borderRadius: "12px",
                                            background: activeTab === tab.id ? "var(--primary)" : "var(--card-bg)",
                                            color: activeTab === tab.id ? "white" : "var(--foreground)",
                                            fontWeight: activeTab === tab.id ? "700" : "500",
                                            fontSize: "14px",
                                            border: `1px solid ${activeTab === tab.id ? "var(--primary)" : "var(--card-border)"}`,
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* ═══════ OVERVIEW TAB ═══════ */}
                            {activeTab === "overview" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                    {/* DNA Scores Comparison */}
                                    <div
                                        style={{
                                            background: "var(--card-bg)",
                                            border: "1px solid var(--card-border)",
                                            borderRadius: "16px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                padding: "20px 24px",
                                                borderBottom: "1px solid var(--card-border)",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                            }}
                                        >
                                            <BarChart3 size={20} color="var(--primary)" />
                                            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>
                                                DNA Skor Kıyaslaması
                                            </h3>
                                        </div>
                                        <div style={{ padding: "24px" }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", borderBottom: "2px solid var(--card-border)", width: "25%" }}>
                                                            Kriter
                                                        </th>
                                                        {selectedVehicles.map((sv, i) => (
                                                            <th key={i} style={{ padding: "12px 16px", textAlign: "center", fontSize: "13px", fontWeight: "700", color: columnColors[i], borderBottom: `2px solid ${columnColors[i]}` }}>
                                                                {sv.vehicle.brand} {sv.vehicle.model.replace(/\s*\([^)]+\)/, "").trim()}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* DNA Score row */}
                                                    <tr>
                                                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "var(--foreground)", borderBottom: "1px solid var(--card-border)" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                                <Dna size={16} color="var(--primary)" /> DNA Skoru
                                                            </div>
                                                        </td>
                                                        {selectedVehicles.map((sv, i) => {
                                                            const score = sv.engine?.score ?? sv.vehicle.dnaScore;
                                                            const scoreColor = getDNAScoreColor(score);
                                                            const best = Math.max(...selectedVehicles.map(s => s.engine?.score ?? s.vehicle.dnaScore));
                                                            return (
                                                                <td key={i} style={{ padding: "16px", textAlign: "center", borderBottom: "1px solid var(--card-border)" }}>
                                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                                                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                                            <span style={{ fontSize: "28px", fontWeight: "800", color: scoreColor }}>{score}</span>
                                                                            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>/100</span>
                                                                        </div>
                                                                        <div style={{ width: "100%", maxWidth: "160px", height: "8px", background: "var(--secondary)", borderRadius: "4px", overflow: "hidden" }}>
                                                                            <div style={{ width: `${score}%`, height: "100%", background: scoreColor, borderRadius: "4px", transition: "width 0.5s" }} />
                                                                        </div>
                                                                        <span style={{ fontSize: "12px", fontWeight: "700", color: scoreColor }}>
                                                                            {getDNAScoreLabel(score)}
                                                                            {score === best && <Trophy size={12} style={{ marginLeft: "4px", verticalAlign: "middle" }} />}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                    {/* NCAP */}
                                                    <tr>
                                                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "var(--foreground)", borderBottom: "1px solid var(--card-border)" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                                <Shield size={16} color="#2563eb" /> Euro NCAP
                                                            </div>
                                                        </td>
                                                        {selectedVehicles.map((sv, i) => (
                                                            <td key={i} style={{ padding: "16px", textAlign: "center", borderBottom: "1px solid var(--card-border)" }}>
                                                                {sv.vehicle.ncapStars ? (
                                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                                                        <div style={{ display: "flex", gap: "2px" }}>
                                                                            {[...Array(5)].map((_, si) => (
                                                                                <Star key={si} size={18} fill={si < (sv.vehicle.ncapStars || 0) ? "#EAB308" : "var(--secondary)"} color={si < (sv.vehicle.ncapStars || 0) ? "#EAB308" : "#666"} />
                                                                            ))}
                                                                        </div>
                                                                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>({sv.vehicle.ncapYear})</span>
                                                                    </div>
                                                                ) : (
                                                                    <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>—</span>
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    {/* Motor */}
                                                    <tr>
                                                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "var(--foreground)", borderBottom: "1px solid var(--card-border)" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                                <Zap size={16} color="#f59e0b" /> Seçili Motor
                                                            </div>
                                                        </td>
                                                        {selectedVehicles.map((sv, i) => (
                                                            <td key={i} style={{ padding: "16px", textAlign: "center", borderBottom: "1px solid var(--card-border)", fontSize: "14px", color: "var(--foreground)", fontWeight: "500" }}>
                                                                {sv.engine ? (
                                                                    <div>
                                                                        <div style={{ fontWeight: "700" }}>{sv.engine.name}</div>
                                                                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{sv.engine.fuelType} • {sv.engine.transmission}</div>
                                                                    </div>
                                                                ) : (
                                                                    <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>Seçilmedi</span>
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    {/* Jenerasyon */}
                                                    <tr>
                                                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "var(--foreground)", borderBottom: "1px solid var(--card-border)" }}>
                                                            Jenerasyon / Yıl
                                                        </td>
                                                        {selectedVehicles.map((sv, i) => (
                                                            <td key={i} style={{ padding: "16px", textAlign: "center", borderBottom: "1px solid var(--card-border)", fontSize: "14px", color: "var(--foreground)" }}>
                                                                {sv.vehicle.year}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    {/* Toplam Rapor */}
                                                    <tr>
                                                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                                                            Toplam Rapor
                                                        </td>
                                                        {selectedVehicles.map((sv, i) => (
                                                            <td key={i} style={{ padding: "16px", textAlign: "center", fontSize: "14px", color: "var(--foreground)" }}>
                                                                {sv.vehicle.totalReports}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ═══════ PROS / CONS TAB ═══════ */}
                            {activeTab === "pros-cons" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                    {/* Strengths Table */}
                                    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden" }}>
                                        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--card-border)", display: "flex", alignItems: "center", gap: "10px" }}>
                                            <TrendingUp size={20} color="#10b981" />
                                            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#10b981", margin: 0 }}>En Beğenilen Yönleri</h3>
                                        </div>
                                        <div style={{ padding: "0", overflowX: "auto" }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <thead>
                                                    <tr>
                                                        {selectedVehicles.map((sv, i) => (
                                                            <th key={i} style={{ padding: "16px", textAlign: "left", fontSize: "13px", fontWeight: "700", color: columnColors[i], borderBottom: `2px solid ${columnColors[i]}`, width: `${100 / selectedVehicles.length}%` }}>
                                                                {sv.vehicle.brand} {sv.vehicle.model.replace(/\s*\([^)]+\)/, "").trim()}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.from({ length: Math.max(...selectedVehicles.map((sv) => sv.vehicle.strengths.length)) }).map((_, rowIdx) => (
                                                        <tr key={rowIdx}>
                                                            {selectedVehicles.map((sv, colIdx) => (
                                                                <td key={colIdx} style={{ padding: "12px 16px", borderBottom: "1px solid var(--card-border)", verticalAlign: "top" }}>
                                                                    {sv.vehicle.strengths[rowIdx] ? (
                                                                        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                                                                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", marginTop: "7px", flexShrink: 0 }} />
                                                                            <span style={{ fontSize: "14px", color: "var(--foreground)", lineHeight: "1.5" }}>{sv.vehicle.strengths[rowIdx]}</span>
                                                                        </div>
                                                                    ) : null}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Weaknesses Table */}
                                    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden" }}>
                                        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--card-border)", display: "flex", alignItems: "center", gap: "10px" }}>
                                            <TrendingDown size={20} color="#ef4444" />
                                            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ef4444", margin: 0 }}>En Çok Şikayet Edilenler</h3>
                                        </div>
                                        <div style={{ padding: "0", overflowX: "auto" }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <thead>
                                                    <tr>
                                                        {selectedVehicles.map((sv, i) => (
                                                            <th key={i} style={{ padding: "16px", textAlign: "left", fontSize: "13px", fontWeight: "700", color: columnColors[i], borderBottom: `2px solid ${columnColors[i]}`, width: `${100 / selectedVehicles.length}%` }}>
                                                                {sv.vehicle.brand} {sv.vehicle.model.replace(/\s*\([^)]+\)/, "").trim()}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.from({ length: Math.max(...selectedVehicles.map((sv) => sv.vehicle.weaknesses.length)) }).map((_, rowIdx) => (
                                                        <tr key={rowIdx}>
                                                            {selectedVehicles.map((sv, colIdx) => (
                                                                <td key={colIdx} style={{ padding: "12px 16px", borderBottom: "1px solid var(--card-border)", verticalAlign: "top" }}>
                                                                    {sv.vehicle.weaknesses[rowIdx] ? (
                                                                        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                                                                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", marginTop: "7px", flexShrink: 0 }} />
                                                                            <span style={{ fontSize: "14px", color: "var(--foreground)", lineHeight: "1.5" }}>{sv.vehicle.weaknesses[rowIdx]}</span>
                                                                        </div>
                                                                    ) : null}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ═══════ CHRONIC ISSUES TAB ═══════ */}
                            {activeTab === "chronic" && (
                                <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden" }}>
                                    <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--card-border)", display: "flex", alignItems: "center", gap: "10px" }}>
                                        <Wrench size={20} color="var(--primary)" />
                                        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>Kronik Sorunlar Kıyaslaması</h3>
                                    </div>
                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr>
                                                    {selectedVehicles.map((sv, i) => (
                                                        <th key={i} style={{ padding: "16px", textAlign: "left", fontSize: "13px", fontWeight: "700", color: columnColors[i], borderBottom: `2px solid ${columnColors[i]}`, width: `${100 / selectedVehicles.length}%` }}>
                                                            {sv.vehicle.brand} {sv.vehicle.model.replace(/\s*\([^)]+\)/, "").trim()}
                                                            {sv.engine && <div style={{ fontSize: "11px", fontWeight: "500", color: "var(--text-muted)", marginTop: "2px" }}>{sv.engine.name}</div>}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(() => {
                                                    // Combine vehicle and engine chronic issues
                                                    const allIssues = selectedVehicles.map((sv) => {
                                                        const vehicleIssues = sv.vehicle.chronicIssues;
                                                        const engineIssues = sv.engine?.chronicIssues || [];
                                                        return [
                                                            ...engineIssues.map((e) => ({
                                                                title: e.title,
                                                                description: e.description,
                                                                severity: e.severity,
                                                                reportCount: e.reportCount,
                                                                isEngine: true,
                                                            })),
                                                            ...vehicleIssues.map((v) => ({
                                                                title: v.title,
                                                                description: v.description,
                                                                severity: v.severity,
                                                                reportCount: v.reportCount,
                                                                isEngine: false,
                                                            })),
                                                        ];
                                                    });
                                                    const maxRows = Math.max(...allIssues.map((a) => a.length));
                                                    return Array.from({ length: maxRows }).map((_, rowIdx) => (
                                                        <tr key={rowIdx}>
                                                            {allIssues.map((issues, colIdx) => (
                                                                <td key={colIdx} style={{ padding: "16px", borderBottom: "1px solid var(--card-border)", verticalAlign: "top" }}>
                                                                    {issues[rowIdx] ? (
                                                                        <div
                                                                            style={{
                                                                                padding: "12px",
                                                                                background: "var(--secondary)",
                                                                                borderRadius: "10px",
                                                                                borderLeft: `3px solid ${getSeverityColor(issues[rowIdx].severity)}`,
                                                                            }}
                                                                        >
                                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                                                                                <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>{issues[rowIdx].title}</span>
                                                                                <span
                                                                                    style={{
                                                                                        fontSize: "10px",
                                                                                        fontWeight: "700",
                                                                                        padding: "2px 8px",
                                                                                        borderRadius: "10px",
                                                                                        background: `${getSeverityColor(issues[rowIdx].severity)}15`,
                                                                                        color: getSeverityColor(issues[rowIdx].severity),
                                                                                        whiteSpace: "nowrap",
                                                                                        marginLeft: "8px",
                                                                                    }}
                                                                                >
                                                                                    {getSeverityLabel(issues[rowIdx].severity)}
                                                                                </span>
                                                                            </div>
                                                                            <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5", margin: 0, marginBottom: "6px" }}>
                                                                                {issues[rowIdx].description.slice(0, 120)}
                                                                                {issues[rowIdx].description.length > 120 ? "..." : ""}
                                                                            </p>
                                                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                                                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                                                                                    {issues[rowIdx].reportCount} rapor
                                                                                </span>
                                                                                {issues[rowIdx].isEngine && (
                                                                                    <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", background: "rgba(245,158,11,0.1)", color: "#f59e0b", fontWeight: "600" }}>
                                                                                        Motor Özel
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ) : null}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ));
                                                })()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ═══════ ENGINES TAB ═══════ */}
                            {activeTab === "engines" && (
                                <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden" }}>
                                    <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--card-border)", display: "flex", alignItems: "center", gap: "10px" }}>
                                        <Zap size={20} color="#f59e0b" />
                                        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>Motor Seçenekleri Kıyaslaması</h3>
                                    </div>
                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr>
                                                    {selectedVehicles.map((sv, i) => (
                                                        <th key={i} style={{ padding: "16px", textAlign: "left", fontSize: "13px", fontWeight: "700", color: columnColors[i], borderBottom: `2px solid ${columnColors[i]}`, width: `${100 / selectedVehicles.length}%` }}>
                                                            {sv.vehicle.brand} {sv.vehicle.model.replace(/\s*\([^)]+\)/, "").trim()}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(() => {
                                                    const allEngines = selectedVehicles.map((sv) => getEnginesForVehicle(sv.vehicle.id));
                                                    const maxRows = Math.max(...allEngines.map((a) => a.length));
                                                    return Array.from({ length: maxRows }).map((_, rowIdx) => (
                                                        <tr key={rowIdx}>
                                                            {allEngines.map((engines, colIdx) => (
                                                                <td key={colIdx} style={{ padding: "12px 16px", borderBottom: "1px solid var(--card-border)", verticalAlign: "top" }}>
                                                                    {engines[rowIdx] ? (
                                                                        <div
                                                                            style={{
                                                                                padding: "14px",
                                                                                background: "var(--secondary)",
                                                                                borderRadius: "10px",
                                                                                border: selectedVehicles[colIdx]?.engine?.slug === engines[rowIdx].slug ? `2px solid ${columnColors[colIdx]}` : "1px solid transparent",
                                                                            }}
                                                                        >
                                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                                                                <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--foreground)" }}>{engines[rowIdx].name}</span>
                                                                                <span
                                                                                    style={{
                                                                                        fontSize: "13px",
                                                                                        fontWeight: "800",
                                                                                        color: getDNAScoreColor(engines[rowIdx].score),
                                                                                    }}
                                                                                >
                                                                                    {engines[rowIdx].score}/100
                                                                                </span>
                                                                            </div>
                                                                            <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                                                <span style={{ padding: "2px 8px", background: "var(--card-bg)", borderRadius: "4px" }}>{engines[rowIdx].fuelType}</span>
                                                                                <span style={{ padding: "2px 8px", background: "var(--card-bg)", borderRadius: "4px" }}>{engines[rowIdx].transmission}</span>
                                                                            </div>
                                                                            {engines[rowIdx].chronicIssues.length > 0 && (
                                                                                <div style={{ marginTop: "8px", fontSize: "12px", color: "#f59e0b", display: "flex", alignItems: "center", gap: "4px" }}>
                                                                                    <AlertCircle size={12} />
                                                                                    {engines[rowIdx].chronicIssues.length} kronik sorun
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : null}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ));
                                                })()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ═══════ TRIMS TAB ═══════ */}
                            {activeTab === "trims" && (
                                <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden" }}>
                                    <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--card-border)", display: "flex", alignItems: "center", gap: "10px" }}>
                                        <Package size={20} color="var(--primary)" />
                                        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>Donanım Paketleri Kıyaslaması</h3>
                                    </div>
                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr>
                                                    {selectedVehicles.map((sv, i) => (
                                                        <th key={i} style={{ padding: "16px", textAlign: "left", fontSize: "13px", fontWeight: "700", color: columnColors[i], borderBottom: `2px solid ${columnColors[i]}`, width: `${100 / selectedVehicles.length}%` }}>
                                                            {sv.vehicle.brand} {sv.vehicle.model.replace(/\s*\([^)]+\)/, "").trim()}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {selectedVehicles.map((sv, colIdx) => {
                                                        const trimData = getTrimsForVehicle(sv.vehicle.id);
                                                        return (
                                                            <td key={colIdx} style={{ padding: "16px", verticalAlign: "top" }}>
                                                                {trimData ? (
                                                                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                                                        {/* Trim names */}
                                                                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                                                            {trimData.trims.map((trim, i) => (
                                                                                <span
                                                                                    key={i}
                                                                                    style={{
                                                                                        padding: "4px 12px",
                                                                                        background: `${columnColors[colIdx]}10`,
                                                                                        border: `1px solid ${columnColors[colIdx]}30`,
                                                                                        borderRadius: "20px",
                                                                                        fontSize: "12px",
                                                                                        fontWeight: "700",
                                                                                        color: columnColors[colIdx],
                                                                                    }}
                                                                                >
                                                                                    {trim}
                                                                                </span>
                                                                            ))}
                                                                        </div>

                                                                        {/* Categories and features */}
                                                                        {trimData.categories.map((cat, catIdx) => (
                                                                            <div key={catIdx}>
                                                                                <div style={{ fontSize: "12px", fontWeight: "700", color: columnColors[colIdx], marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                                                    {cat.categoryName}
                                                                                </div>
                                                                                {cat.features.map((feat, featIdx) => {
                                                                                    const statuses = trimData.trims.map((t) => feat.status[t] || "none");
                                                                                    const bestStatus = statuses.includes("standard") ? "standard" : statuses.includes("optional") ? "optional" : "none";
                                                                                    return (
                                                                                        <div
                                                                                            key={featIdx}
                                                                                            style={{
                                                                                                display: "flex",
                                                                                                justifyContent: "space-between",
                                                                                                alignItems: "center",
                                                                                                padding: "6px 0",
                                                                                                borderBottom: featIdx < cat.features.length - 1 ? "1px solid var(--card-border)" : "none",
                                                                                            }}
                                                                                        >
                                                                                            <span style={{ fontSize: "13px", color: "var(--foreground)" }}>{feat.name}</span>
                                                                                            <div style={{ display: "flex", gap: "4px" }}>
                                                                                                {trimData.trims.map((t, ti) => {
                                                                                                    const st = feat.status[t] || "none";
                                                                                                    return (
                                                                                                        <div
                                                                                                            key={ti}
                                                                                                            title={`${t}: ${st === "standard" ? "Standart" : st === "optional" ? "Opsiyonel" : "Yok"}`}
                                                                                                            style={{
                                                                                                                width: "18px",
                                                                                                                height: "18px",
                                                                                                                borderRadius: "4px",
                                                                                                                display: "flex",
                                                                                                                alignItems: "center",
                                                                                                                justifyContent: "center",
                                                                                                                background: st === "standard" ? "rgba(34,197,94,0.15)" : st === "optional" ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.08)",
                                                                                                            }}
                                                                                                        >
                                                                                                            {st === "standard" && <Check size={10} color="#22c55e" strokeWidth={3} />}
                                                                                                            {st === "optional" && <Circle size={8} color="#f59e0b" />}
                                                                                                            {st === "none" && <Minus size={10} color="#ef4444" strokeWidth={2} />}
                                                                                                        </div>
                                                                                                    );
                                                                                                })}
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-muted)", fontSize: "13px" }}>
                                                                        <Package size={32} style={{ opacity: 0.2, marginBottom: "8px" }} />
                                                                        <p>Donanım verisi henüz eklenmemiş</p>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Empty state */
                        <div
                            style={{
                                background: "var(--card-bg)",
                                border: "1px solid var(--card-border)",
                                borderRadius: "16px",
                                padding: "64px 24px",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 20px",
                                }}
                            >
                                <Sparkles size={36} color="var(--primary)" style={{ opacity: 0.5 }} />
                            </div>
                            <h3 style={{ fontSize: "22px", fontWeight: "700", color: "var(--foreground)", marginBottom: "8px" }}>
                                Kıyaslama Başlatın
                            </h3>
                            <p style={{ fontSize: "15px", color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto" }}>
                                En az 2 araç seçerek DNA profil kıyaslamasını başlatabilirsiniz. Yukarıdaki kutulara tıklayarak araç ekleyin.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @media (max-width: 768px) {
                    table {
                        font-size: 13px;
                    }
                }
            `}</style>
        </div>
    );
}
