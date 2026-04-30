"use client";
import { useState, useCallback } from "react";

// @ts-ignore - no types available
import citiesData from "react-turkey-map/src/cities";

interface City { plate: string; city: string; draw: string; }

interface Props {
    onCityClick?: (plate: string, cityName: string) => void;
    selectedPlate?: string | null;
    masterCounts?: Record<string, number>;
}

export default function TurkeyMapSVG({ onCityClick, selectedPlate, masterCounts = {} }: Props) {
    const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
    const cities = citiesData as City[];

    const getFill = useCallback((plate: string) => {
        if (selectedPlate === plate) return "#7c4dff";
        const count = masterCounts[plate] || 0;
        if (count >= 3) return "#FFD700";
        if (count >= 2) return "#FFA000";
        if (count >= 1) return "#4ade80";
        return "#2a2a3e";
    }, [selectedPlate, masterCounts]);

    return (
        <div style={{ position: "relative", width: "100%" }}>
            {tooltip && (
                <div style={{
                    position: "fixed", top: tooltip.y + 15, left: tooltip.x,
                    background: "rgba(0,0,0,0.85)", color: "#fff", padding: "6px 12px",
                    borderRadius: "8px", fontSize: "12px", fontWeight: "600",
                    pointerEvents: "none", zIndex: 1000, whiteSpace: "nowrap",
                    border: "1px solid rgba(255,215,0,0.3)"
                }}>{tooltip.text}</div>
            )}
            <svg viewBox="0 0 1007 443" xmlns="http://www.w3.org/2000/svg"
                style={{ width: "100%", height: "auto", cursor: "pointer" }}>
                <g>
                    {cities.map((c: City) => (
                        <g key={c.plate} data-plate={c.plate} data-city={c.city}>
                            <path d={c.draw}
                                fill={getFill(c.plate)}
                                stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"
                                style={{ transition: "fill 0.2s, opacity 0.2s" }}
                                onMouseEnter={(e) => {
                                    const count = masterCounts[c.plate] || 0;
                                    setTooltip({
                                        text: `${c.city}${count > 0 ? ` — ${count} Usta` : ""}`,
                                        x: e.clientX, y: e.clientY
                                    });
                                    (e.target as SVGPathElement).style.opacity = "0.75";
                                    (e.target as SVGPathElement).style.filter = "brightness(1.3)";
                                }}
                                onMouseMove={(e) => setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)}
                                onMouseLeave={(e) => {
                                    setTooltip(null);
                                    (e.target as SVGPathElement).style.opacity = "1";
                                    (e.target as SVGPathElement).style.filter = "none";
                                }}
                                onClick={() => onCityClick?.(c.plate, c.city)}
                            />
                        </g>
                    ))}
                </g>
            </svg>
        </div>
    );
}
