"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Search, Flame, Droplet, ShieldAlert, Disc, XCircle, Info, Beaker, Zap, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { mythsData, Myth } from "@/data/efsane-avcilari-data";

export default function EfsaneAvcilariSection() {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    const ITEMS_PER_PAGE = 15;

    // Arama veya kategori değiştiğinde ilk sayfaya dön
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, searchQuery]);

    const categories = [
        { id: 'all', name: 'Tüm Efsaneler', icon: Search },
        { id: 'fuel', name: 'Yakıt Tüketimi', icon: Flame },
        { id: 'engine', name: 'Motor & Bakım', icon: Droplet },
        { id: 'safety', name: 'Sürüş & Güvenlik', icon: ShieldAlert },
        { id: 'tire', name: 'Lastik & Yürüyen', icon: Disc },
        { id: 'electric', name: 'Elektrik & Donanım', icon: Zap },
        { id: 'general', name: 'Genel', icon: Info },
    ];

    const filteredMyths = mythsData.filter(myth => {
        const matchesCat = activeCategory === 'all' || myth.category === activeCategory;
        const matchesSearch = myth.myth.toLowerCase().includes(searchQuery.toLowerCase()) ||
            myth.explanation.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const totalPages = Math.ceil(filteredMyths.length / ITEMS_PER_PAGE);
    const paginatedMyths = filteredMyths.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getCategoryDetails = (catId: string) => {
        switch (catId) {
            case 'fuel': return { color: 'var(--foreground)', label: 'Yakıt Tüketimi', icon: Flame };
            case 'engine': return { color: 'var(--foreground)', label: 'Motor & Bakım', icon: Droplet };
            case 'safety': return { color: 'var(--foreground)', label: 'Güvenlik', icon: ShieldAlert };
            case 'tire': return { color: 'var(--foreground)', label: 'Lastik', icon: Disc };
            case 'electric': return { color: 'var(--foreground)', label: 'Elektrik', icon: Zap };
            default: return { color: 'var(--text-muted)', label: 'Genel', icon: Info };
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            {/* Header Section */}
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: '20px',
                padding: '40px',
                marginBottom: '32px',
                border: '1px solid var(--card-border)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    opacity: 0.03,
                    transform: 'scale(1.5)'
                }}>
                    <Beaker size={200} color="var(--foreground)" />
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--secondary)', padding: '6px 12px', borderRadius: '99px', marginBottom: '16px', border: '1px solid var(--card-border)' }}>
                        <Beaker size={16} color="var(--foreground)" />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--foreground)', letterSpacing: '0.5px' }}>OTO EFSANE AVCILARI</span>
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px', lineHeight: '1.2' }}>
                        Doğru Bilinen Yanlışlar
                    </h2>
                    <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '700px', marginBottom: '32px' }}>
                        Sanayi ustalarından nesilden nesile aktarılan, hepimizin inandığı ancak mühendislik ve fizik kurallarıyla taban tabana zıt olan otomobil efsanelerini çürütüyoruz. Aracınızın ömrünü uzatacak ve cebinizi koruyacak {mythsData.length} efsane gerçeğiyle yüzleşin.
                    </p>

                    {/* Filter and Search */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px' }}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {categories.map(cat => {
                                const Icon = cat.icon;
                                const isActive = activeCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        style={{
                                            padding: '8px 16px',
                                            background: isActive ? 'var(--foreground)' : 'var(--secondary)',
                                            border: `1px solid ${isActive ? 'var(--foreground)' : 'var(--card-border)'}`,
                                            borderRadius: '12px',
                                            color: isActive ? 'var(--background)' : 'var(--text-muted)',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Icon size={16} />
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                            <input
                                type="text"
                                placeholder="Efsane ara... (Örn: vitesi boşa almak, abs, kalın yağ, akü)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    padding: '16px 16px 16px 48px',
                                    borderRadius: '12px',
                                    color: 'var(--foreground)',
                                    fontSize: '15px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--foreground)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                                >
                                    <XCircle size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Myths Grid */}
            {paginatedMyths.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                    <Search size={48} color="var(--border-strong)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '18px', color: 'var(--foreground)', marginBottom: '8px', fontWeight: '600' }}>Sonuç Bulunamadı</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Aradığınız kritere uygun bir otomobil efsanesi bulamadık.</p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                        {paginatedMyths.map((myth) => {
                            const catDetails = getCategoryDetails(myth.category);
                            const CatIcon = catDetails.icon;

                            return (
                                <div key={myth.id} style={{
                                    background: 'var(--card-bg)',
                                    border: `1px solid var(--card-border)`,
                                    borderRadius: '16px',
                                    padding: '24px',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    position: 'relative',
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--foreground)';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--card-border)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}>
                                    {/* Top Category Badge */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                                        <CatIcon size={14} color={catDetails.color} />
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: catDetails.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            {catDetails.label}
                                        </span>
                                    </div>

                                    {/* Myth Title */}
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 }}>
                                        <div style={{ flexShrink: 0, marginTop: '2px' }}>
                                            <AlertTriangle size={20} color="var(--foreground)" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', lineHeight: '1.4', marginBottom: '12px' }}>
                                                "{myth.myth}"
                                            </h3>
                                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                                                <span style={{ color: 'var(--foreground)', fontWeight: '700', marginRight: '6px' }}>Gerçek:</span>
                                                {myth.reality}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Details Button */}
                                    <Link href={`/kutuphane/efsane-avcilari/${myth.slug}--${myth.id}`} style={{ textDecoration: 'none', marginTop: 'auto' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            width: '100%',
                                            padding: '12px',
                                            background: 'var(--secondary)',
                                            border: '1px solid var(--border-subtle)',
                                            borderRadius: '10px',
                                            color: 'var(--foreground)',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            transition: 'background 0.2s'
                                        }}>
                                            Mühendislik Gerçeğini Oku <ArrowRight size={16} />
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px' }}>
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 16px',
                                    background: currentPage === 1 ? 'transparent' : 'var(--card-bg)',
                                    border: `1px solid ${currentPage === 1 ? 'var(--border-subtle)' : 'var(--card-border)'}`,
                                    borderRadius: '12px',
                                    color: currentPage === 1 ? 'var(--text-muted)' : 'var(--foreground)',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                    opacity: currentPage === 1 ? 0.5 : 1,
                                    fontWeight: '600'
                                }}
                            >
                                <ChevronLeft size={18} /> Önceki
                            </button>
                            
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
                                Sayfa {currentPage} / {totalPages}
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 16px',
                                    background: currentPage === totalPages ? 'transparent' : 'var(--card-bg)',
                                    border: `1px solid ${currentPage === totalPages ? 'var(--border-subtle)' : 'var(--card-border)'}`,
                                    borderRadius: '12px',
                                    color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--foreground)',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                    opacity: currentPage === totalPages ? 0.5 : 1,
                                    fontWeight: '600'
                                }}
                            >
                                Sonraki <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
