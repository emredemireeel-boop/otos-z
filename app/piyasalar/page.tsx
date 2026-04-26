"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    turkeyBrandMarkets,
    turkeyModelMarkets,
    MarketBrandRow,
    MarketModelRow,
    getFlagUrl,
    formatPrice,
    formatNumber
} from "@/data/markets";
import { Search, Trophy, BarChart3, Car, Target, TrendingUp, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function PiyasalarPage() {
    const [selectedTab, setSelectedTab] = useState<"brands" | "models">("brands");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        document.title = "2026 Türkiye Otomobil Pazar Endeksi & 2025 En Çok Satan Arabalar | OtoAsfalt";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', '2026 Türkiye otomobil pazar endeksi, 2025 yılında en çok satan arabalar, güncel araç satış istatistikleri ve sıfır kilometre otomobil marka-model sıralaması.');
    }, []);

    const filteredBrands = turkeyBrandMarkets.filter(row =>
        row.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredModels = turkeyModelMarkets.filter(row =>
        row.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.model.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalSales = turkeyBrandMarkets.reduce((sum, b) => sum + b.totalSales, 0);
    const totalBrands = turkeyBrandMarkets.length;
    const topModel = turkeyModelMarkets[0];

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Hero Section */}
                <div style={{
                    background: 'var(--background)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '48px 24px 0',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ padding: '4px 12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', fontSize: '12px', fontWeight: '700', borderRadius: '20px' }}>
                                2025 Verileri Güncellendi
                            </span>
                        </div>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px', lineHeight: '1.2' }}>
                            2026 Türkiye Otomobil Pazar Endeksi
                        </h1>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '700px', lineHeight: '1.6' }}>
                            2025 yılı ODMD resmi satış verileriyle hazırlanan kapsamlı pazar analizi. Toplam <strong style={{ color: 'var(--foreground)' }}>{formatNumber(totalSales)}</strong> adet satış, <strong style={{ color: 'var(--foreground)' }}>{totalBrands}</strong> marka ve en çok satan modeller.
                        </p>

                        {/* Quick Stats */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Toplam Satış (2025)', value: formatNumber(totalSales) },
                                { label: 'Pazar Lideri', value: 'Renault' },
                                { label: 'En Çok Satan Model', value: `${topModel.brand} ${topModel.model}` },
                                { label: 'Elektrikli Araç Artışı', value: '+%90' },
                            ].map((stat) => (
                                <div key={stat.label} style={{
                                    display: 'flex', flexDirection: 'column',
                                    padding: '16px', background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)', borderRadius: '12px', flex: 1, minWidth: '150px'
                                }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>{stat.label}</div>
                                    <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Tab Navigation */}
                        <div style={{ display: 'flex', gap: '0' }}>
                            <button onClick={() => setSelectedTab("brands")} style={{
                                padding: '16px 24px', background: 'transparent', border: 'none',
                                borderBottom: selectedTab === "brands" ? '2px solid var(--foreground)' : '2px solid transparent',
                                color: selectedTab === "brands" ? 'var(--foreground)' : 'var(--text-muted)',
                                fontSize: '15px', fontWeight: selectedTab === "brands" ? '700' : '500',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                            }}>
                                Markalar Başarı Endeksi
                            </button>
                            <button onClick={() => setSelectedTab("models")} style={{
                                padding: '16px 24px', background: 'transparent', border: 'none',
                                borderBottom: selectedTab === "models" ? '2px solid var(--foreground)' : '2px solid transparent',
                                color: selectedTab === "models" ? 'var(--foreground)' : 'var(--text-muted)',
                                fontSize: '15px', fontWeight: selectedTab === "models" ? '700' : '500',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                            }}>
                                Model Satış Endeksi
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
                                width: '300px', padding: '12px 16px',
                                background: 'var(--secondary)', border: '1px solid var(--card-border)',
                                borderRadius: '12px', color: 'var(--foreground)', outline: 'none', fontSize: '14px',
                            }}
                        />
                    </div>

                    {selectedTab === "brands" ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
                            <div>
                                {/* Desktop Headers */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '60px 2fr 1.5fr 1.5fr 1.5fr',
                                    padding: '0 16px 12px 16px', borderBottom: '1px solid var(--card-border)', marginBottom: '12px',
                                }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>SIRA</span>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>MARKA</span>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'right' }}>TOPLAM SATIŞ</span>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'right' }}>PAZAR PAYI</span>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'right' }}>BAŞLANGIÇ FİYATI</span>
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
                                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                        borderRadius: '20px', padding: '24px',
                                    }}>
                                        <h3 style={{
                                            fontSize: '15px', fontWeight: '700', color: 'var(--foreground)',
                                            marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
                                        }}>
                                            Pazar Liderleri
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {turkeyBrandMarkets.slice(0, 5).map((brand, idx) => (
                                                <div key={brand.brand} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{
                                                        fontSize: '14px', fontWeight: '800',
                                                        color: 'var(--foreground)',
                                                        width: '20px', textAlign: 'center'
                                                    }}>{idx + 1}</span>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{brand.brand}</span>
                                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>%{brand.marketSharePercent}</span>
                                                        </div>
                                                        <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{
                                                                width: `${(brand.marketSharePercent / turkeyBrandMarkets[0].marketSharePercent) * 100}%`,
                                                                height: '100%',
                                                                background: 'var(--foreground)',
                                                            }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Elektrikli Araç Yükselişi */}
                                    <div style={{
                                        marginTop: '16px', background: 'var(--card-bg)',
                                        border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px',
                                    }}>
                                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            Elektrikli Araç Yükselişi
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {turkeyModelMarkets.filter(m => m.isElectric).map((m) => (
                                                <div key={m.rank} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{m.brand} {m.model}</span>
                                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Elektrikli</span>
                                                    </div>
                                                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--foreground)' }}>{formatNumber(m.totalSales2025)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    ) : (
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
                                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                        borderRadius: '20px', padding: '24px',
                                    }}>
                                        <h3 style={{
                                            fontSize: '15px', fontWeight: '700', color: 'var(--foreground)',
                                            marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
                                        }}>
                                            En Çok Talep Görenler
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {turkeyModelMarkets.slice(0, 5).map((model, idx) => (
                                                <div key={model.rank} style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '8px 0', borderBottom: '1px solid var(--border-subtle)'
                                                }}>
                                                    <div>
                                                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', display: 'block' }}>{model.brand} {model.model}</span>
                                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatNumber(model.totalSales2025)} adet</span>
                                                    </div>
                                                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>
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
            display: 'grid', gridTemplateColumns: '60px 2fr 1.5fr 1.5fr 1.5fr',
            alignItems: 'center', background: 'var(--secondary)',
            border: '1px solid var(--card-border)', borderRadius: '16px',
            padding: '16px', transition: 'all 0.2s ease',
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
            <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--foreground)', opacity: 0.9 }}>#{row.rank}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={getFlagUrl(row.country)} alt={row.country} style={{ width: '20px', height: '15px', borderRadius: '3px', objectFit: 'cover' }} />
                <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>{row.brand}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--foreground)' }}>{formatNumber(row.totalSales)}</span>
                {row.yoyChange !== undefined && (
                    <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--foreground)', display: 'block' }}>
                        {row.yoyChange > 0 ? '+' : ''}{row.yoyChange}%
                    </span>
                )}
            </div>
            <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)' }}>%{row.marketSharePercent}</span>
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
            background: 'var(--secondary)', border: '1px solid var(--card-border)',
            borderRadius: '16px', padding: '16px', transition: 'all 0.2s ease',
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
                        padding: '4px 8px', borderRadius: '8px',
                        background: `var(--card-bg)`, color: 'var(--foreground)',
                        border: '1px solid var(--card-border)',
                        fontSize: '14px', fontWeight: '800',
                    }}>#{row.rank}</span>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>{row.brand} {row.model}</span>
                            <img src={getFlagUrl(row.country)} alt={row.country} style={{ width: '16px', height: '12px', borderRadius: '2px', objectFit: 'cover' }} />
                            {row.isElectric && (
                                <span style={{ fontSize: '11px', padding: '2px 8px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', borderRadius: '6px', fontWeight: '700' }}>Elektrikli</span>
                            )}
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.segment} • {row.bodyType} • {row.yearRange}</span>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    {row.isDiscontinued ? (
                        <span style={{
                            fontSize: '13px', fontWeight: '700', color: 'var(--foreground)',
                            background: 'var(--card-bg)', padding: '6px 12px',
                            borderRadius: '8px', border: '1px solid var(--card-border)'
                        }}>Üretimden Kalktı</span>
                    ) : (
                        <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)' }}>
                            {formatPrice(row.averagePriceTl)}
                        </span>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>2025 Satış:</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>
                        {formatNumber(row.totalSales2025)} adet
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Talep Endeksi:</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>
                        {row.demandIndex}/100
                    </span>
                </div>
            </div>
        </div>
    );
}
