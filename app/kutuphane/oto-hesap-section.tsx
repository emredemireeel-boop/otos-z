"use client";

import { useState } from "react";
import { Calculator, Fuel, CreditCard } from "lucide-react";
import YakitHesaplamaSection from "./yakit-hesaplama-section";
import KrediKartiAracSection from "./kredi-karti-arac-section";

const subTabs = [
    { key: "yakit", label: "Yakıt Hesaplama", icon: Fuel, color: "#2563EB" },
    { key: "kredi-karti", label: "Kredi Kartı ile Araç", icon: CreditCard, color: "#7C3AED" },
];

export default function OtoHesapSection() {
    const [activeSubTab, setActiveSubTab] = useState("yakit");

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
                    <Calculator size={26} color="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>OtoHesap</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Yakıt maliyeti ve kredi kartı komisyon hesaplayıcı</p>
                </div>
            </div>

            {/* Sub-tab Navigation */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: 'var(--secondary)', padding: '6px', borderRadius: '14px', border: '1px solid var(--card-border)' }}>
                {subTabs.map((tab) => {
                    const active = activeSubTab === tab.key;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveSubTab(tab.key)}
                            style={{
                                flex: 1, padding: '12px 16px', borderRadius: '10px', border: 'none',
                                background: active ? 'var(--card-bg)' : 'transparent',
                                color: active ? tab.color : 'var(--text-muted)',
                                fontWeight: active ? '700' : '600', fontSize: '14px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: 'all 0.2s',
                                boxShadow: active ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                            }}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            {activeSubTab === "yakit" && <YakitHesaplamaSection />}
            {activeSubTab === "kredi-karti" && <KrediKartiAracSection />}
        </div>
    );
}
