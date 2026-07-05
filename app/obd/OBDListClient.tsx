"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Activity, AlertCircle, Wrench, X, ChevronRight } from "lucide-react";
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

interface OBDListClientProps {
    initialCodes: ObdCode[];
    totalCount: number;
    stats: { P: number; B: number; C: number; U: number; total: number };
    brands: string[];
}

const CATEGORIES = [
    { id: 'ALL', label: 'Tümü', description: 'Tüm Arıza Kodları' },
    { id: 'P', label: 'Powertrain (P)', description: 'Motor ve Şanzıman' },
    { id: 'B', label: 'Body (B)', description: 'Gövde ve Konfor' },
    { id: 'C', label: 'Chassis (C)', description: 'Şasi, Fren, Süspansiyon' },
    { id: 'U', label: 'Network (U)', description: 'Ağ ve İletişim' },
];

export default function OBDListClient({ initialCodes, totalCount, stats, brands }: OBDListClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("ALL");
    const [codes, setCodes] = useState<ObdCode[]>(initialCodes);
    const [total, setTotal] = useState(totalCount);
    const [loading, setLoading] = useState(false);
    const [selectedCode, setSelectedCode] = useState<ObdCode | null>(null);

    // Filtre/arama değiştiğinde API'den çek
    const fetchCodes = useCallback(async (query: string, type: string, offset = 0) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (query.length >= 2) params.set('q', query);
            if (type !== 'ALL') params.set('type', type);
            params.set('offset', String(offset));
            params.set('limit', '30');

            const res = await fetch(`/api/obd?${params.toString()}`);
            const data = await res.json();

            if (offset === 0) {
                setCodes(data.items);
            } else {
                setCodes(prev => [...prev, ...data.items]);
            }
            setTotal(data.total);
        } catch (e) {
            console.error('OBD fetch error:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    // Filtre/arama değişince tetikle
    useEffect(() => {
        // İlk render'da initialCodes zaten var, sadece filtre değişince çek
        if (searchQuery.length >= 2 || selectedType !== 'ALL') {
            const timeout = setTimeout(() => fetchCodes(searchQuery, selectedType), 300);
            return () => clearTimeout(timeout);
        } else if (searchQuery === '' && selectedType === 'ALL') {
            setCodes(initialCodes);
            setTotal(totalCount);
        }
    }, [searchQuery, selectedType, fetchCodes, initialCodes, totalCount]);

    const loadMore = () => {
        fetchCodes(searchQuery, selectedType, codes.length);
    };

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
        <>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                <div className="home-main-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '24px' }}>
                    {/* Left Sidebar */}
                    <aside className="home-left-sidebar">
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

                        {/* Marka Hub Linkleri */}
                        <div style={{
                            marginTop: '16px',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '16px',
                            padding: '16px',
                        }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                Markaya Göre Kodlar
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {brands.map((brand) => (
                                    <li key={brand}>
                                        <Link href={`/obd/${brand.toLowerCase()}`} style={{
                                            display: 'block',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            background: 'var(--secondary)',
                                            color: 'var(--foreground)',
                                            textDecoration: 'none',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'var(--primary)';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'var(--secondary)';
                                            e.currentTarget.style.color = 'var(--foreground)';
                                        }}>
                                            {brand} Arıza Kodları
                                        </Link>
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
                                    color: 'white',
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

                        {/* Category Pills - Mobile */}
                        <div className="category-pills" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px' }}>
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
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                                {loading ? 'Aranıyor...' : `${total} Sonuç`}
                            </span>
                        </div>

                        {/* OBD Code List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {codes.length > 0 ? (
                                codes.map((code) => {
                                    const colors = getTypeColor(code.type);
                                    return (
                                        <div
                                            key={code.code}
                                            onClick={() => setSelectedCode(code)}
                                            style={{
                                                display: 'block',
                                                background: 'var(--card-bg)',
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '14px',
                                                padding: '18px',
                                                cursor: 'pointer',
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
                                                    }}>
                                                        {code.description}
                                                    </p>
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
                                                }}>
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
                        {codes.length < total && (
                            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    style={{
                                        padding: '14px 36px',
                                        background: 'var(--secondary)',
                                        color: 'var(--foreground)',
                                        fontWeight: '500',
                                        borderRadius: '12px',
                                        border: '1px solid var(--card-border)',
                                        cursor: loading ? 'wait' : 'pointer',
                                        fontSize: '14px',
                                        opacity: loading ? 0.6 : 1,
                                    }}
                                >
                                    {loading ? 'Yükleniyor...' : `Daha Fazla Yükle (${total - codes.length} kaldı)`}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <aside className="home-right-sidebar">
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
                                    İstatistikler
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {[
                                        { label: 'Toplam Kod', value: stats.total.toLocaleString() },
                                        { label: 'Powertrain (P)', value: stats.P.toLocaleString() },
                                        { label: 'Body (B)', value: stats.B.toLocaleString() },
                                        { label: 'Chassis (C)', value: stats.C.toLocaleString() },
                                        { label: 'Network (U)', value: stats.U.toLocaleString() },
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
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '16px',
                            }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>
                                    Nasıl Kullanılır?
                                </h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                    Aracınızdaki arıza kodunu arama kutusuna yazın veya kategorilerden birini seçerek ilgili kodları görüntüleyin.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
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
        </>
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
                    background: '#161616',
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
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
