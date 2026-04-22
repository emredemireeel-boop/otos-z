"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    turkeyBrandMarkets,
    turkeyModelMarkets,
    MarketBrandRow,
    MarketModelRow,
    getFlagUrl,
    formatPrice,
    formatNumber,
    getRankColor,
    getDemandColor
} from "@/data/markets";
import { Search, Trophy, BarChart3, Car, Target, TrendingUp } from "lucide-react";

export default function PiyasalarPage() {
    const [selectedTab, setSelectedTab] = useState<"brands" | "models">("brands");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBrands = turkeyBrandMarkets.filter(row =>
        row.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredModels = turkeyModelMarkets.filter(row =>
        row.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.model.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />

            <main>
                {/* Header Section */}
                <div style={{
                    background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 0%, transparent 100%)',
                    padding: '40px 24px',
                    borderBottom: '1px solid var(--card-border)',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px' }}>
                            2025 Türkiye Otomobil Pazar Endeksi
                        </h1>
                        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                            Türkiye'nin en çok satan marka ve modellerinin güncel satış performansı, pazar analizleri ve fiyat endeksleri.
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div style={{
                    borderBottom: '1px solid var(--card-border)',
                    background: 'var(--card-bg)',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setSelectedTab("brands")}
                                style={{
                                    padding: '16px 24px',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: selectedTab === "brands" ? '2px solid #6366F1' : '2px solid transparent',
                                    color: selectedTab === "brands" ? 'var(--foreground)' : 'var(--text-muted)',
                                    fontSize: '15px',
                                    fontWeight: selectedTab === "brands" ? '700' : '500',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Target style={{ width: '18px', height: '18px' }} />
                                Markalar Başarı Endeksi
                            </button>
                            <button
                                onClick={() => setSelectedTab("models")}
                                style={{
                                    padding: '16px 24px',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: selectedTab === "models" ? '2px solid #6366F1' : '2px solid transparent',
                                    color: selectedTab === "models" ? 'var(--foreground)' : 'var(--text-muted)',
                                    fontSize: '15px',
                                    fontWeight: selectedTab === "models" ? '700' : '500',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Car style={{ width: '18px', height: '18px' }} />
                                Model Fiyat Endeksi
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Search style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder={selectedTab === "brands" ? "Marka ara..." : "Model veya marka ara..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '300px',
                                padding: '12px 16px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '12px',
                                color: 'var(--foreground)',
                                outline: 'none',
                                fontSize: '14px',
                            }}
                        />
                    </div>

                    {selectedTab === "brands" ? (
                        /* Brands Tab Content */
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
                            <div>
                                {/* Desktop Headers */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '60px 2fr 1.5fr 1.5fr 1.5fr',
                                    padding: '0 16px 12px 16px',
                                    borderBottom: '1px solid var(--card-border)',
                                    marginBottom: '12px',
                                }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>SIRA</span>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>MARKA</span>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'right' }}>TOPLAM SATIŞ</span>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'right' }}>PAZAR PAYI</span>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'right' }}>BAşLANGIÇ FİYATI</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {filteredBrands.map((row) => (
                                        <MarketBrandCard key={row.rank} row={row} />
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar - Market Leaders */}
                            <aside className="d-none d-lg-block">
                                <div style={{ position: 'sticky', top: '20px' }}>
                                    <div style={{
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '20px',
                                        padding: '24px',
                                    }}>
                                        <h3 style={{
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'var(--foreground)',
                                            marginBottom: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <Trophy style={{ width: '16px', height: '16px', color: '#FFD700' }} />
                                            Pazar Liderleri
                                        </h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {turkeyBrandMarkets.slice(0, 5).map((brand, idx) => (
                                                <div key={brand.brand} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{
                                                        fontSize: '14px',
                                                        fontWeight: '800',
                                                        color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : 'var(--foreground)',
                                                        width: '20px',
                                                        textAlign: 'center'
                                                    }}>
                                                        {idx + 1}
                                                    </span>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{brand.brand}</span>
                                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>%{brand.marketSharePercent}</span>
                                                        </div>
                                                        <div style={{
                                                            width: '100%',
                                                            height: '6px',
                                                            background: 'var(--border-subtle)',
                                                            borderRadius: '3px',
                                                            overflow: 'hidden'
                                                        }}>
                                                            <div style={{
                                                                width: `${(brand.marketSharePercent / turkeyBrandMarkets[0].marketSharePercent) * 100}%`,
                                                                height: '100%',
                                                                background: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : '#6366F1',
                                                            }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    ) : (
                        /* Models Tab Content */
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {filteredModels.map((row) => (
                                    <MarketModelCard key={row.rank} row={row} />
                                ))}
                            </div>

                            {/* Sidebar - Trending Models */}
                            <aside className="d-none d-lg-block">
                                <div style={{ position: 'sticky', top: '20px' }}>
                                    <div style={{
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '20px',
                                        padding: '24px',
                                    }}>
                                        <h3 style={{
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'var(--foreground)',
                                            marginBottom: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <TrendingUp style={{ width: '16px', height: '16px', color: '#10B981' }} />
                                            En Çok Talep Görenler
                                        </h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {turkeyModelMarkets.slice(0, 5).map((model, idx) => (
                                                <div key={model.rank} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                                    <div>
                                                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', display: 'block' }}>{model.brand} {model.model}</span>
                                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>En yüksek talep</span>
                                                    </div>
                                                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#10B981' }}>
                                                        {model.demandIndex}/100
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

function MarketBrandCard({ row }: { row: MarketBrandRow }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 2fr 1.5fr 1.5fr 1.5fr',
            alignItems: 'center',
            background: 'var(--secondary)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '16px',
            transition: 'all 0.2s ease',
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--hover-primary)';
                e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--secondary)';
                e.currentTarget.style.borderColor = 'var(--card-border)';
            }}
        >
            <span style={{ fontSize: '16px', fontWeight: '800', color: getRankColor(row.rank), opacity: 0.9 }}>#{row.rank}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={getFlagUrl(row.country)} alt={row.country} style={{ width: '20px', height: '15px', borderRadius: '3px', objectFit: 'cover' }} />
                <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>{row.brand}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--foreground)' }}>{formatNumber(row.totalSales)}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#6366F1' }}>%{row.marketSharePercent}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)' }}>{formatPrice(row.basePriceTl)}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Başlangıç (2026)</span>
            </div>
        </div>
    );
}

function MarketModelCard({ row }: { row: MarketModelRow }) {
    return (
        <div style={{
            background: 'var(--secondary)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '16px',
            transition: 'all 0.2s ease',
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--hover-primary)';
                e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--secondary)';
                e.currentTarget.style.borderColor = 'var(--card-border)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        background: `${getRankColor(row.rank)}20`,
                        color: getRankColor(row.rank),
                        fontSize: '14px',
                        fontWeight: '800',
                    }}>
                        #{row.rank}
                    </span>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>{row.brand} {row.model}</span>
                            <img src={getFlagUrl(row.country)} alt={row.country} style={{ width: '16px', height: '12px', borderRadius: '2px', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.segment} • {row.bodyType} • {row.yearRange}</span>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    {row.isDiscontinued ? (
                        <span style={{
                            fontSize: '13px',
                            fontWeight: '700',
                            color: '#EF4444',
                            background: 'rgba(239, 68, 68, 0.1)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            Üretimden Kalktı
                        </span>
                    ) : (
                        <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)' }}>
                            {formatPrice(row.averagePriceTl)}
                        </span>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Talep Endeksi:</span>
                    <span style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: getDemandColor(row.demandIndex)
                    }}>
                        {row.demandIndex}/100
                    </span>
                </div>
            </div>
        </div>
    );
}
