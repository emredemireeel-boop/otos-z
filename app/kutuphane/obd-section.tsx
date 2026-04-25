"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Activity, AlertCircle, Wrench, X, ChevronRight, ExternalLink } from "lucide-react";
import obdCodes from "@/data/obd-codes.json";
import Link from "next/link";

interface ObdCode {
    code: string;
    title: string;
    description: string;
    type: string;
    isGeneric: boolean;
    severity: string;
    systems: string[];
    symptoms: string[];
    causes: string[];
    fixes: string[];
}

const CATEGORIES = [
    { id: 'ALL', label: 'Tümü', description: 'Tüm Arıza Kodları' },
    { id: 'P', label: 'Powertrain (P)', description: 'Motor ve Şanzıman' },
    { id: 'B', label: 'Body (B)', description: 'Gövde ve Konfor' },
    { id: 'C', label: 'Chassis (C)', description: 'Şasi, Fren, Süspansiyon' },
    { id: 'U', label: 'Network (U)', description: 'Ağ ve İletişim' },
];

export default function ObdSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("ALL");
    const [displayLimit, setDisplayLimit] = useState(30);
    const [selectedCode, setSelectedCode] = useState<ObdCode | null>(null);

    const filteredCodes = useMemo(() => {
        let result = obdCodes as ObdCode[];

        if (selectedType !== "ALL") {
            result = result.filter(code => code.type === selectedType);
        }

        if (searchQuery.length >= 2) {
            const q = searchQuery.toLowerCase();
            result = result.filter(code =>
                code.code.toLowerCase().includes(q) ||
                code.title.toLowerCase().includes(q) ||
                code.description.toLowerCase().includes(q)
            );
        }

        return result;
    }, [searchQuery, selectedType]);

    const displayedCodes = filteredCodes.slice(0, displayLimit);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'P': return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' };
            case 'B': return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' };
            case 'C': return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)', text: '#10b981' };
            case 'U': return { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.2)', text: '#eab308' };
            default: return { bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.2)', text: '#6b7280' };
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {/* Category Pills inside the section instead of header, for mobile/quick access mostly handled by sidebar but good to have */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid var(--card-border)' }}>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedType(cat.id)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500',
                            whiteSpace: 'nowrap',
                            border: 'none',
                            cursor: 'pointer',
                            background: selectedType === cat.id ? 'var(--primary)' : 'var(--secondary)',
                            color: selectedType === cat.id ? 'white' : 'var(--foreground)',
                        }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="obd-layout">
                {/* Left Sidebar */}
                <aside>
                    <div style={{
                        position: 'sticky',
                        top: '100px',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '16px',
                        padding: '16px',
                    }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>
                            Kategoriler
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {CATEGORIES.map((cat) => (
                                <li key={cat.id} style={{ marginBottom: '4px' }}>
                                    <button
                                        onClick={() => setSelectedType(cat.id)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            background: selectedType === cat.id ? 'var(--primary)' : 'transparent',
                                            color: selectedType === cat.id ? 'white' : 'var(--foreground)',
                                            fontSize: '14px',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <span style={{ fontWeight: '600' }}>{cat.label}</span>
                                        <span style={{ fontSize: '11px', opacity: 0.6 }}>{cat.description}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main Content */}
                <div>
                    {/* Search Bar */}
                    <div style={{
                        marginBottom: '16px',
                        position: 'relative',
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
                            placeholder="Arıza kodu (P0101) veya açıklama ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 48px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '12px',
                                color: 'var(--foreground)',
                                fontSize: '14px',
                                outline: 'none',
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
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                }}
                            >
                                <X style={{ width: '20px', height: '20px' }} />
                            </button>
                        )}
                    </div>

                    {/* Results count */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                        padding: '12px 16px',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '12px',
                    }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{filteredCodes.length} Sonuç</span>
                    </div>

                    {/* OBD Code List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {displayedCodes.length > 0 ? (
                            displayedCodes.map((code) => {
                                const colors = getTypeColor(code.type);
                                return (
                                    <div
                                        key={code.code}
                                        style={{
                                            display: 'block',
                                            background: 'var(--card-bg)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '14px',
                                            padding: '18px',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                            e.currentTarget.style.boxShadow = '0 0 20px var(--primary-glow)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--card-border)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                {/* Code badge and type */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                                    <span style={{
                                                        padding: '6px 12px',
                                                        background: colors.bg,
                                                        color: colors.text,
                                                        fontSize: '14px',
                                                        borderRadius: '8px',
                                                        fontWeight: '700',
                                                        border: `1px solid ${colors.border}`,
                                                        fontFamily: 'monospace',
                                                    }}>
                                                        {code.code}
                                                    </span>
                                                    {code.systems.slice(0, 2).map((sys, i) => (
                                                        <span key={i} style={{
                                                            padding: '4px 10px',
                                                            background: 'var(--secondary)',
                                                            color: 'var(--text-muted)',
                                                            fontSize: '11px',
                                                            borderRadius: '6px',
                                                            fontWeight: '500',
                                                        }}>
                                                            {sys}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Title */}
                                                <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>
                                                    {code.title}
                                                </h2>

                                                {/* Description */}
                                                <p style={{
                                                    color: 'var(--text-muted)',
                                                    fontSize: '14px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    marginBottom: '12px',
                                                }}>
                                                    {code.description}
                                                </p>

                                                {/* Action buttons */}
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => setSelectedCode(code)}
                                                        style={{
                                                            padding: '6px 14px', fontSize: '12px', fontWeight: '600',
                                                            background: 'var(--secondary)', border: '1px solid var(--card-border)',
                                                            borderRadius: '8px', cursor: 'pointer', color: 'var(--foreground)',
                                                        }}
                                                    >
                                                        Hızlı Bak
                                                    </button>
                                                    <Link href={`/obd/${code.code.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                            padding: '6px 14px', fontSize: '12px', fontWeight: '600',
                                                            background: colors.bg, border: `1px solid ${colors.border}`,
                                                            borderRadius: '8px', cursor: 'pointer', color: colors.text,
                                                        }}>
                                                            <ExternalLink size={12} /> Detay Sayfası
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: 'var(--secondary)',
                                                flexShrink: 0,
                                                cursor: 'pointer',
                                            }}
                                                onClick={() => setSelectedCode(code)}
                                            >
                                                <ChevronRight style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{
                                padding: '60px 20px',
                                textAlign: 'center',
                                background: 'var(--card-bg)',
                                border: '1px dashed var(--card-border)',
                                borderRadius: '16px',
                            }}>
                                <Activity style={{ width: '48px', height: '48px', color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Sonuç Bulunamadı</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                            </div>
                        )}
                    </div>

                    {/* Load More */}
                    {displayedCodes.length < filteredCodes.length && (
                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <button
                                onClick={() => setDisplayLimit(prev => prev + 30)}
                                style={{
                                    padding: '14px 36px',
                                    background: 'var(--secondary)',
                                    color: 'var(--foreground)',
                                    fontWeight: '500',
                                    borderRadius: '12px',
                                    border: '1px solid var(--card-border)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                }}
                            >
                                Daha Fazla Yükle ({filteredCodes.length - displayedCodes.length} kaldı)
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <aside>
                    <div style={{ position: 'sticky', top: '100px' }}>
                        {/* İstatistikler */}
                        <div style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '16px',
                            padding: '16px',
                            marginBottom: '16px',
                        }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                📊 İstatistikler
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { label: 'Toplam Kod', value: obdCodes.length.toLocaleString() },
                                    { label: 'Powertrain (P)', value: (obdCodes as ObdCode[]).filter(c => c.type === 'P').length.toLocaleString() },
                                    { label: 'Body (B)', value: (obdCodes as ObdCode[]).filter(c => c.type === 'B').length.toLocaleString() },
                                    { label: 'Chassis (C)', value: (obdCodes as ObdCode[]).filter(c => c.type === 'C').length.toLocaleString() },
                                    { label: 'Network (U)', value: (obdCodes as ObdCode[]).filter(c => c.type === 'U').length.toLocaleString() },
                                ].map((stat) => (
                                    <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                                        <span style={{ color: 'var(--foreground)', fontWeight: '600' }}>{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bilgi Kutusu */}
                        <div style={{
                            background: 'var(--secondary)',
                            border: '1px solid var(--primary)',
                            borderRadius: '16px',
                            padding: '16px',
                        }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>
                                💡 Nasıl Kullanılır?
                            </h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                Aracınızdaki arıza kodunu arama kutusuna yazın veya kategorilerden birini seçerek ilgili kodları görüntüleyin.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedCode && (
                    <DetailModal
                        code={selectedCode}
                        onClose={() => setSelectedCode(null)}
                        getTypeColor={getTypeColor}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function DetailModal({ code, onClose, getTypeColor }: { code: ObdCode, onClose: () => void, getTypeColor: (type: string) => { bg: string; border: string; text: string } }) {
    const colors = getTypeColor(code.type);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(8px)',
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: '800px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '16px',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid var(--card-border)',
                    background: 'var(--secondary)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <span style={{
                                    padding: '8px 16px',
                                    background: colors.bg,
                                    color: colors.text,
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    border: `1px solid ${colors.border}`,
                                }}>
                                    {code.code}
                                </span>
                                <span style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '14px',
                                }}>
                                    {code.systems[0] || "Sistem Bilinmiyor"}
                                </span>
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>
                                {code.title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '8px',
                                background: 'var(--secondary)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                            }}
                        >
                            <X style={{ width: '20px', height: '20px' }} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>TEKNİK AÇIKLAMA</h3>
                        <p style={{
                            fontSize: '16px',
                            color: 'var(--foreground)',
                            lineHeight: '1.6',
                            padding: '16px',
                            background: 'var(--secondary)',
                            borderRadius: '12px',
                        }}>
                            {code.description}
                        </p>
                    </div>

                    <div className="obd-two-col">
                        <div>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Activity style={{ width: '16px', height: '16px' }} />
                                BELİRTİLER
                            </h3>
                            {code.symptoms.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {code.symptoms.map((s, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px', color: 'var(--foreground)' }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', marginTop: '8px', flexShrink: 0 }} />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Belirti bilgisi bulunmuyor.</p>
                            )}
                        </div>

                        <div>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#eab308', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle style={{ width: '16px', height: '16px' }} />
                                OLASI NEDENLER
                            </h3>
                            {code.causes.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {code.causes.map((c, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px', color: 'var(--foreground)' }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eab308', marginTop: '8px', flexShrink: 0 }} />
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Neden bilgisi bulunmuyor.</p>
                            )}
                        </div>
                    </div>

                    {code.fixes.length > 0 && (
                        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '24px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Wrench style={{ width: '16px', height: '16px' }} />
                                ÇÖZÜM ÖNERİLERİ
                            </h3>
                            <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {code.fixes.map((f, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: 'var(--secondary)',
                                        borderRadius: '8px',
                                    }}>
                                        <span style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: 'rgba(34, 197, 94, 0.1)',
                                            color: '#22c55e',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            flexShrink: 0,
                                        }}>
                                            {i + 1}
                                        </span>
                                        <span style={{ color: 'var(--foreground)', fontSize: '14px' }}>{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

