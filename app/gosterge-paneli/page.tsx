"use client";

import { useState, useMemo } from "react";
import { Search, X, ChevronDown, ChevronUp, Wrench, AlertTriangle, Info, Lightbulb } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import faultData from "../../data/fault_lights.json";

interface WarningLight {
    id: string;
    title: string;
    severity: string;
    color: string;
    icon_resource: string;
    visual_desc: string;
    meaning: string;
    action: string;
    tags: string[];
}

const severityLabels: Record<string, { label: string; bg: string; text: string }> = {
    "critical": { label: "ACİL", bg: "rgba(255, 59, 48, 0.15)", text: "#FF3B30" },
    "warning": { label: "UYARI", bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B" },
    "info_warning": { label: "BİLGİ", bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B" },
    "info": { label: "BİLGİ", bg: "rgba(52, 199, 89, 0.15)", text: "#34C759" },
};

const filterColors = [
    { id: "all", label: "Tümü", color: null },
    { id: "critical", label: "Acil", color: "#FF3B30" },
    { id: "warning", label: "Uyarı", color: "#F59E0B" },
    { id: "info", label: "Bilgi", color: "#34C759" },
    { id: "lights", label: "Farlar", color: "#3B82F6" },
];

export default function GostergePaneliPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const indicators = faultData.warningLights as WarningLight[];

    const filteredIndicators = useMemo(() => {
        return indicators.filter(item => {
            // Search filter
            const matchesSearch = searchQuery.length < 2 ||
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            // Color filter
            let matchesColor = true;
            if (selectedFilter === "critical") {
                matchesColor = item.color === "#FF3B30";
            } else if (selectedFilter === "warning") {
                matchesColor = item.color === "#F59E0B";
            } else if (selectedFilter === "info") {
                matchesColor = item.color === "#34C759";
            } else if (selectedFilter === "lights") {
                matchesColor = item.color === "#3B82F6";
            }

            return matchesSearch && matchesColor;
        });
    }, [indicators, searchQuery, selectedFilter]);

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Hero Header with Gradient */}
                <div style={{
                    background: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
                    padding: '48px 24px',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Background Pattern */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    }} />

                    <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: 'rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <AlertTriangle style={{ width: '32px', height: '32px', color: 'white' }} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px' }}>
                                    Gösterge Paneli
                                </h1>
                                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)' }}>
                                    İkaz ışıklarının anlamları ve çözümleri
                                </p>
                            </div>
                        </div>

                        {/* Search Box */}
                        <div style={{
                            position: 'relative',
                            marginTop: '24px',
                            maxWidth: '600px',
                        }}>
                            <div style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)',
                            }}>
                                <Search style={{ width: '20px', height: '20px' }} />
                            </div>
                            <input
                                type="text"
                                placeholder="Gösterge ara... (örn: motor, fren, yağ)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px 16px 16px 52px',
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    color: '#1a1a1a',
                                    fontSize: '16px',
                                    outline: 'none',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#666',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <X style={{ width: '20px', height: '20px' }} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filter Pills */}
                <div style={{
                    background: 'var(--ticker-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '16px 24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {filterColors.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(filter.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 18px',
                                        borderRadius: '50px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        border: selectedFilter === filter.id ? 'none' : '1px solid var(--card-border)',
                                        cursor: 'pointer',
                                        background: selectedFilter === filter.id
                                            ? (filter.color || 'var(--foreground)')
                                            : 'var(--secondary)',
                                        color: selectedFilter === filter.id ? 'white' : 'var(--foreground)',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {filter.color && (
                                        <span style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: selectedFilter === filter.id ? 'white' : filter.color,
                                        }} />
                                    )}
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
                        {/* Indicators Grid */}
                        <div>
                            <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                {filteredIndicators.length} gösterge bulundu
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
                                {filteredIndicators.map((item) => {
                                    const isExpanded = expandedId === item.id;
                                    const severity = severityLabels[item.severity] || severityLabels.info;

                                    return (
                                        <div
                                            key={item.id}
                                            style={{
                                                background: 'var(--card-bg)',
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '16px',
                                                overflow: 'hidden',
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            {/* Card Header */}
                                            <div
                                                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                                style={{
                                                    padding: '20px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px',
                                                }}
                                            >
                                                {/* Icon */}
                                                <div style={{
                                                    width: '64px',
                                                    height: '64px',
                                                    borderRadius: '16px',
                                                    background: `${item.color}20`,
                                                    border: `2px solid ${item.color}40`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    overflow: 'hidden'
                                                }}>
                                                    <Image
                                                        src={item.icon_resource.startsWith('ic_') ? `/indicators/${item.icon_resource}.png` : `/indicators/${item.icon_resource}.png`}
                                                        alt={item.title}
                                                        width={item.icon_resource.startsWith('ic_') ? 40 : 64}
                                                        height={item.icon_resource.startsWith('ic_') ? 40 : 64}
                                                        style={{ 
                                                            objectFit: item.icon_resource.startsWith('ic_') ? 'contain' : 'cover',
                                                            width: item.icon_resource.startsWith('ic_') ? '40px' : '100%',
                                                            height: item.icon_resource.startsWith('ic_') ? '40px' : '100%',
                                                        }}
                                                    />
                                                </div>

                                                {/* Content */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                        <span style={{
                                                            padding: '3px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '10px',
                                                            fontWeight: '700',
                                                            background: severity.bg,
                                                            color: severity.text,
                                                        }}>
                                                            {severity.label}
                                                        </span>
                                                    </div>
                                                    <h3 style={{
                                                        fontSize: '16px',
                                                        fontWeight: '600',
                                                        color: 'var(--foreground)',
                                                        marginBottom: '4px',
                                                    }}>
                                                        {item.title}
                                                    </h3>
                                                    <p style={{
                                                        fontSize: '14px',
                                                        color: 'var(--text-muted)',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: isExpanded ? 'normal' : 'nowrap',
                                                    }}>
                                                        {item.meaning}
                                                    </p>
                                                </div>

                                                {/* Expand Icon */}
                                                <div style={{ color: 'var(--text-muted)' }}>
                                                    {isExpanded ? (
                                                        <ChevronUp style={{ width: '24px', height: '24px' }} />
                                                    ) : (
                                                        <ChevronDown style={{ width: '24px', height: '24px' }} />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Expanded Content */}
                                            {isExpanded && (
                                                <div style={{
                                                    padding: '0 20px 20px',
                                                    borderTop: '1px solid var(--card-border)',
                                                }}>
                                                    {/* Visual Description */}
                                                    <div style={{
                                                        padding: '16px 0',
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: '12px',
                                                    }}>
                                                        <Info style={{ width: '20px', height: '20px', color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
                                                        <div>
                                                            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                                                GÖRÜNÜM
                                                            </div>
                                                            <div style={{ fontSize: '14px', color: 'var(--foreground)', fontStyle: 'italic' }}>
                                                                {item.visual_desc}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action */}
                                                    <div style={{
                                                        padding: '16px',
                                                        background: `${item.color}10`,
                                                        borderRadius: '12px',
                                                        border: `1px solid ${item.color}30`,
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: '12px',
                                                    }}>
                                                        <Wrench style={{ width: '20px', height: '20px', color: item.color, flexShrink: 0, marginTop: '2px' }} />
                                                        <div>
                                                            <div style={{ fontSize: '12px', fontWeight: '700', color: item.color, marginBottom: '6px' }}>
                                                                NE YAPMALI?
                                                            </div>
                                                            <div style={{ fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.6' }}>
                                                                {item.action}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Tags */}
                                                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                                                        {item.tags.map((tag, i) => (
                                                            <span
                                                                key={i}
                                                                style={{
                                                                    padding: '4px 10px',
                                                                    background: 'var(--secondary)',
                                                                    borderRadius: '6px',
                                                                    fontSize: '12px',
                                                                    color: 'var(--text-muted)',
                                                                }}
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredIndicators.length === 0 && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                    background: 'var(--card-bg)',
                                    borderRadius: '16px',
                                    border: '1px dashed var(--card-border)',
                                }}>
                                    <Search style={{ width: '48px', height: '48px', color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>
                                        Sonuç Bulunamadı
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                                        Arama kriterlerinizi değiştirerek tekrar deneyin.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <aside>
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {/* Info Box */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    marginBottom: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Lightbulb style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
                                        Nasıl Kullanılır?
                                    </h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                                        Aracınızda yanan ikaz ışığını yukarıdaki arama kutusuna yazarak veya renk filtrelerini kullanarak bulabilirsiniz.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {[
                                            { color: '#FF3B30', label: 'Kırmızı', desc: 'Acil durum - Hemen dur' },
                                            { color: '#F59E0B', label: 'Sarı/Turuncu', desc: 'Uyarı - Dikkatli ol' },
                                            { color: '#34C759', label: 'Yeşil', desc: 'Bilgi - Normal durum' },
                                            { color: '#3B82F6', label: 'Mavi', desc: 'Bilgi - Far/Işık durumu' },
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    borderRadius: '50%',
                                                    background: item.color,
                                                }} />
                                                <span style={{ fontSize: '12px', color: 'var(--foreground)', fontWeight: '500' }}>{item.label}:</span>
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(255, 81, 47, 0.1), rgba(221, 36, 118, 0.1))',
                                    border: '1px solid rgba(255, 81, 47, 0.3)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>
                                        📊 İstatistikler
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {[
                                            { label: 'Toplam Gösterge', value: indicators.length.toString() },
                                            { label: 'Acil (Kırmızı)', value: indicators.filter(i => i.color === "#FF3B30").length.toString() },
                                            { label: 'Uyarı (Sarı)', value: indicators.filter(i => i.color === "#F59E0B").length.toString() },
                                            { label: 'Bilgi (Yeşil/Mavi)', value: indicators.filter(i => i.color === "#34C759" || i.color === "#3B82F6").length.toString() },
                                        ].map((stat, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                                                <span style={{ color: 'var(--foreground)', fontWeight: '600' }}>{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
