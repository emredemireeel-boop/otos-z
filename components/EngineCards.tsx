"use client";

import { useState } from "react";
import { VehicleEngineData, EngineOption } from "@/data/engine-dna";
import { Zap, Droplet, Battery, Leaf, AlertTriangle, ShieldCheck } from "lucide-react";

interface EngineCardsProps {
    engineData: VehicleEngineData;
}

export default function EngineCards({ engineData }: EngineCardsProps) {
    const [activeTab, setActiveTab] = useState<string>("Tümü");
    const [transFilter, setTransFilter] = useState<string>("Tümü");

    const fuelTypes = Array.from(new Set(engineData.engines.map(e => e.fuelType)));
    const tabs = ["Tümü", ...fuelTypes];

    const filteredEngines = engineData.engines.filter(e => {
        const matchesFuel = activeTab === "Tümü" ? true : e.fuelType === activeTab;
        let matchesTrans = true;
        if (transFilter === "Manuel") {
            matchesTrans = e.transmission.toLowerCase().includes("manuel");
        } else if (transFilter === "Otomatik") {
            matchesTrans = !e.transmission.toLowerCase().includes("manuel") || e.transmission.toLowerCase().includes("otomatik") || e.transmission.toLowerCase().includes("dsg") || e.transmission.toLowerCase().includes("edc") || e.transmission.toLowerCase().includes("cvt");
        }
        return matchesFuel && matchesTrans;
    });

    const getFuelIcon = (fuelType: string) => {
        switch (fuelType) {
            case "Benzin": return <Droplet size={18} color="#ef4444" />;
            case "Dizel": return <Droplet size={18} color="#000000" />;
            case "Elektrik": return <Battery size={18} color="#3b82f6" />;
            case "Hibrit": return <Leaf size={18} color="#10b981" />;
            default: return <Zap size={18} color="#f59e0b" />;
        }
    };

    const getFuelBg = (fuelType: string) => {
        switch (fuelType) {
            case "Benzin": return "rgba(239, 68, 68, 0.1)";
            case "Dizel": return "rgba(0, 0, 0, 0.05)";
            case "Elektrik": return "rgba(59, 130, 246, 0.1)";
            case "Hibrit": return "rgba(16, 185, 129, 0.1)";
            default: return "var(--secondary)";
        }
    };

    return (
        <div style={{ marginTop: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', color: 'var(--foreground)' }}>
                Motor Seçenekleri & Kronik Sorunlar
            </h2>
            
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '24px',
                            background: activeTab === tab ? 'var(--primary)' : 'var(--card-bg)',
                            color: activeTab === tab ? 'white' : 'var(--foreground)',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            border: activeTab === tab ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            
            {/* Transmission Filter */}
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>Vites Tipi:</span>
                <select 
                    value={transFilter} 
                    onChange={e => setTransFilter(e.target.value)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        color: 'var(--foreground)',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option value="Tümü">Tümü</option>
                    <option value="Manuel">Manuel</option>
                    <option value="Otomatik">Otomatik</option>
                </select>
            </div>

            {/* Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filteredEngines.map(engine => (
                    <div key={engine.slug} style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ 
                            padding: '16px', 
                            borderBottom: '1px solid var(--card-border)',
                            background: getFuelBg(engine.fuelType),
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                    {getFuelIcon(engine.fuelType)}
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>{engine.fuelType}</span>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--foreground)' }}>
                                    {engine.name}
                                </h3>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    Şanzıman: {engine.transmission}
                                </div>
                            </div>
                            <div style={{ 
                                background: engine.score >= 90 ? '#10b981' : engine.score >= 80 ? '#f59e0b' : '#ef4444', 
                                color: 'white', 
                                padding: '4px 10px', 
                                borderRadius: '12px', 
                                fontSize: '14px', 
                                fontWeight: '800' 
                            }}>
                                {engine.score}/100
                            </div>
                        </div>

                        <div style={{ padding: '16px', flexGrow: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                                <AlertTriangle size={16} color="#f59e0b" />
                                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>
                                    Bu Motora Özel Kronik Sorunlar
                                </h4>
                            </div>
                            {engine.issues.length > 0 ? (
                                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {engine.issues.map((issue, idx) => (
                                        <li key={idx}>{issue}</li>
                                    ))}
                                </ul>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '14px' }}>
                                    <ShieldCheck size={16} /> Bilinen yaygın bir arıza yok
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
