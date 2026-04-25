"use client";

import { useState, useMemo } from "react";
import { Search, X, ChevronDown, ChevronUp, Wrench, AlertTriangle, Info, Lightbulb, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import faultData from "@/data/fault_lights.json";

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
    "warning": { label: "UYARI", bg: "rgba(255, 204, 0, 0.15)", text: "#FFCC00" },
    "info_warning": { label: "BİLGİ", bg: "rgba(255, 204, 0, 0.15)", text: "#FFCC00" },
    "info": { label: "BİLGİ", bg: "rgba(52, 199, 89, 0.15)", text: "#34C759" },
};

const filterColors = [
    { id: "all", label: "Tümü", color: null },
    { id: "critical", label: "Acil", color: "#FF3B30" },
    { id: "warning", label: "Uyarı", color: "#FFCC00" },
    { id: "info", label: "Bilgi", color: "#34C759" },
    { id: "lights", label: "Farlar", color: "#007AFF" },
];

export default function GostergeSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Helper for URL slugs
    const createSlug = (text: string) => {
        const trMap: { [key: string]: string } = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
        };
        const slug = text.replace(/[çğıöşüÇĞİÖŞÜ]/g, match => trMap[match] || match)
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        return slug;
    };

    const indicators = faultData.warningLights as any[];

    const filteredIndicators = useMemo(() => {
        return indicators.filter(item => {
            // Search filter
            const matchesSearch = searchQuery.length < 2 ||
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            // Color filter
            let matchesColor = true;
            if (selectedFilter === "critical") {
                matchesColor = item.color === "#FF3B30";
            } else if (selectedFilter === "warning") {
                matchesColor = item.color === "#FFCC00";
            } else if (selectedFilter === "info") {
                matchesColor = item.color === "#34C759";
            } else if (selectedFilter === "lights") {
                matchesColor = item.color === "#007AFF";
            }

            return matchesSearch && matchesColor;
        });
    }, [indicators, searchQuery, selectedFilter]);

    return (
        <div style={{ width: '100%' }}>
            {/* Filter Pills */}
            <div style={{
                borderBottom: '1px solid var(--card-border)',
                paddingBottom: '16px',
                marginBottom: '24px',
            }}>
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

            {/* Main Content */}
            <div className="gosterge-layout">
                {/* Indicators Grid */}
                <div>
                    {/* Search Box */}
                    <div style={{
                        position: 'relative',
                        marginBottom: '24px',
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
                                padding: '14px 16px 14px 48px',
                                background: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#1a1a1a',
                                fontSize: '14px',
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

                    <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        {filteredIndicators.length} gösterge bulundu
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                                        }}>
                                            <Image
                                                src={`/indicators/${item.icon_resource}.png`}
                                                alt={item.title}
                                                width={40}
                                                height={40}
                                                style={{ objectFit: 'contain' }}
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
                                                {item.tags.map((tag: string, i: number) => (
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
                                                <Link href={`/gosterge/${createSlug(item.title)}--${item.urlId}`} style={{ textDecoration: 'none', marginLeft: 'auto' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                        padding: '6px 14px', fontSize: '13px', fontWeight: '600',
                                                        background: `${item.color}15`,
                                                        border: `1px solid ${item.color}30`,
                                                        borderRadius: '8px', cursor: 'pointer',
                                                        color: item.color,
                                                    }}>
                                                        <ExternalLink size={13} /> Detay Sayfası
                                                    </span>
                                                </Link>
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
                                    { color: '#FFCC00', label: 'Sarı/Turuncu', desc: 'Uyarı - Dikkatli ol' },
                                    { color: '#34C759', label: 'Yeşil', desc: 'Bilgi - Normal durum' },
                                    { color: '#007AFF', label: 'Mavi', desc: 'Bilgi - Far/Işık durumu' },
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
                                    { label: 'Uyarı (Sarı)', value: indicators.filter(i => i.color === "#FFCC00").length.toString() },
                                    { label: 'Bilgi (Yeşil/Mavi)', value: indicators.filter(i => i.color === "#34C759" || i.color === "#007AFF").length.toString() },
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
    );
}
