"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
    sampleListings,
    getAllBrands,
    getModelsForBrand,
    paintPanels,
    paintStatusColors,
    paintStatusLabels,
    getPaintSummary,
    getPaintScore,
    getPaintScoreColor,
    formatListingPrice,
    formatKm,
    detectSource,
    CarListing,
    PaintPanel,
    PaintStatus,
    getFuelTypeLabel,
    getFuelTypeColor,
    formatInspectionStatus,
    getInspectionColor,
    getTireConditionColor,
    getDiscountPercentage,
    getDiscountAmount,
    getAllFuelTypes,
    getAllTransmissionTypes,
    getAllEngineTypes,
    getAllDrivetrainTypes,
    getAllEngineDisplacements,
    carColors,
    getColorLabel,
    getColorHex,
} from "@/data/listings";
import {
    getAllCities,
    getDistrictsForCity
} from "@/data/locations";
import {
    Search,
    Filter,
    Plus,
    ExternalLink,
    Car,
    Calendar,
    Gauge,
    ChevronDown,
    X,
    Check,
    Phone,
    MapPin
} from "lucide-react";


export default function PazarPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBrand, setSelectedBrand] = useState<string>("Tümü");
    const [selectedModel, setSelectedModel] = useState<string>("Tümü");
    const [selectedColor, setSelectedColor] = useState<string>("Tümü");
    const [showNewListingModal, setShowNewListingModal] = useState(false);
    const [listings, setListings] = useState<CarListing[]>(sampleListings);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const brands = useMemo(() => ["Tümü", ...getAllBrands()], []);
    const colors = useMemo(() => ["Tümü", ...carColors.map(c => c.name)], []);
    const models = useMemo(() => {
        if (selectedBrand === "Tümü") return ["Tümü"];
        return ["Tümü", ...getModelsForBrand(selectedBrand)];
    }, [selectedBrand]);

    const filteredListings = useMemo(() => {
        return listings.filter(listing => {
            const matchesSearch = searchQuery === "" ||
                listing.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                listing.model.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesBrand = selectedBrand === "Tümü" || listing.brand === selectedBrand;
            const matchesModel = selectedModel === "Tümü" || listing.model === selectedModel;
            const matchesColor = selectedColor === "Tümü" || getColorLabel(listing.color) === selectedColor;

            return matchesSearch && matchesBrand && matchesModel && matchesColor;
        });
    }, [listings, searchQuery, selectedBrand, selectedModel]);

    // Pagination logic
    const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
    const paginatedListings = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredListings.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredListings, currentPage, itemsPerPage]);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedBrand, selectedModel, selectedColor]);

    const addListing = (newListing: CarListing) => {
        setListings(prev => [newListing, ...prev]);
        setShowNewListingModal(false);
    };

    // Reset model when brand changes
    const handleBrandChange = (brand: string) => {
        setSelectedBrand(brand);
        setSelectedModel("Tümü");
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />

            <main>
                {/* Header */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '20px 24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div>
                                <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
                                    Araç Pazarı
                                </h1>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                    Gerçek boya durumunu görün, diğer sitelerin aksine şeffaf bilgi
                                </p>
                            </div>
                            <button
                                onClick={() => setShowNewListingModal(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 20px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    fontWeight: '600',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                }}
                            >
                                <Plus style={{ width: '18px', height: '18px' }} />
                                Yeni İlan Ekle
                            </button>
                        </div>

                        {/* Filters */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 16px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '12px',
                                flex: 1,
                                maxWidth: '400px',
                            }}>
                                <Search style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="Marka veya model ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        flex: 1,
                                        background: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        color: 'var(--foreground)',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            <select
                                value={selectedBrand}
                                onChange={(e) => handleBrandChange(e.target.value)}
                                style={{
                                    padding: '10px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '12px',
                                    color: 'var(--foreground)',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    minWidth: '150px',
                                }}
                            >
                                {brands.map(brand => (
                                    <option key={brand} value={brand} style={{ background: 'var(--card-bg)' }}>
                                        {brand}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                disabled={selectedBrand === "Tümü"}
                                style={{
                                    padding: '10px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '12px',
                                    color: selectedBrand === "Tümü" ? 'var(--text-muted)' : 'var(--foreground)',
                                    fontSize: '14px',
                                    cursor: selectedBrand === "Tümü" ? 'not-allowed' : 'pointer',
                                    minWidth: '150px',
                                }}
                            >
                                {models.map(model => (
                                    <option key={model} value={model} style={{ background: 'var(--card-bg)' }}>
                                        {model}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                style={{
                                    padding: '10px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '12px',
                                    color: 'var(--foreground)',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    minWidth: '150px',
                                }}
                            >
                                {colors.map(color => (
                                    <option key={color} value={color} style={{ background: 'var(--card-bg)' }}>
                                        {color}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Listings Grid */}
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        {filteredListings.length} ilan bulundu
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr', // Single column for horizontal cards
                        gap: '20px'
                    }}>
                        {paginatedListings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {filteredListings.length > itemsPerPage && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '12px',
                            marginTop: '40px',
                            padding: '20px 0',
                            borderTop: '1px solid var(--card-border)'
                        }}>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    background: currentPage === 1 ? 'var(--secondary)' : 'var(--card-bg)',
                                    color: currentPage === 1 ? 'var(--text-muted)' : 'var(--foreground)',
                                    border: '1px solid var(--card-border)',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                            >
                                ← Önceki
                            </button>

                            <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
                                Sayfa {currentPage} / {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    background: currentPage === totalPages ? 'var(--secondary)' : 'var(--card-bg)',
                                    color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--foreground)',
                                    border: '1px solid var(--card-border)',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Sonraki →
                            </button>
                        </div>
                    )}

                    {filteredListings.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: 'var(--text-muted)',
                        }}>
                            <Car style={{ width: '48px', height: '48px', marginBottom: '16px', opacity: 0.5 }} />
                            <p style={{ fontSize: '16px' }}>Araç bulunamadı</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {/* New Listing Modal */}
            {showNewListingModal && (
                <NewListingModal
                    onClose={() => setShowNewListingModal(false)}
                    onSubmit={addListing}
                />
            )}

            <style jsx global>{`
                @media (max-width: 768px) {
                    div[style*="gridTemplateColumns: repeat(auto-fill"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}

// Listing Card Component
function ListingCard({ listing }: { listing: CarListing }) {
    const paintSummary = getPaintSummary(listing.paintStatus);
    const paintScore = getPaintScore(listing.paintStatus);
    const scoreColor = getPaintScoreColor(paintScore);
    const colorHex = getColorHex(listing.color);
    const colorLabel = getColorLabel(listing.color);

    return (
        <div style={{
            position: 'relative',
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '18px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            flexDirection: 'row', // Horizontal layout
            minHeight: '220px',
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--card-shadow)';
            }}>
            {/* Diagonal Badge for Urgent/Heavy Damage */}
            {(listing.isUrgent || listing.isHeavilyDamaged) && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '-30px',
                    transform: 'rotate(45deg)',
                    background: listing.isHeavilyDamaged
                        ? 'linear-gradient(135deg, #DC2626, #991B1B)'
                        : 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: 'var(--foreground)',
                    padding: '4px 40px',
                    fontSize: '9px',
                    fontWeight: '900',
                    letterSpacing: '0.8px',
                    zIndex: 10,
                    boxShadow: 'var(--card-shadow)',
                    textTransform: 'uppercase',
                }}>
                    {listing.isHeavilyDamaged ? 'AĞIR HASARLI' : 'ACİL SATILIK'}
                </div>
            )}
            {/* COLUMN 1: Basic Info (40%) */}
            <div style={{
                flex: '0 0 40%',
                padding: '24px',
                borderRight: '1px solid var(--card-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', margin: 0, lineHeight: 1.2 }}>
                        {listing.brand} {listing.model}
                    </h3>
                    <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--card-border)',
                        color: 'var(--text-muted)',
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
                        {listing.source === 'sahibinden' ? 'Sahibinden' : 'Arabam'}
                    </span>
                </div>

                {/* Location Display */}
                {(listing.city && listing.district) && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '16px',
                        color: 'var(--foreground)',
                        fontSize: '14px',
                        fontWeight: '600',
                        background: 'var(--secondary)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        width: 'fit-content'
                    }}>
                        <MapPin style={{ width: '16px', height: '16px', color: '#F97316' }} />
                        {listing.city}, {listing.district}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', marginBottom: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
                        <Calendar style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                        {listing.year}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
                        <Gauge style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                        {formatKm(listing.km)}
                    </span>
                    {listing.fuelType && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>
                            <span style={{ filter: 'grayscale(1)' }}>⛽</span> {getFuelTypeLabel(listing.fuelType)}
                        </span>
                    )}
                    {listing.tireCondition !== undefined && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>
                            <span style={{ filter: 'grayscale(1)' }}>🛞</span> Lastik %{listing.tireCondition}
                        </span>
                    )}
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    background: 'var(--secondary)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '10px',
                    width: 'fit-content',
                    marginBottom: '12px'
                }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: colorHex,
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }} />
                    <span style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: '600' }}>
                        {colorLabel}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {listing.tramerPrice ? (
                        <div style={{
                            padding: '4px 10px',
                            background: 'var(--secondary)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Tramer:</span>
                            <span style={{ fontSize: '13px', color: 'var(--foreground)', fontWeight: '700' }}>{formatListingPrice(listing.tramerPrice)}</span>
                        </div>
                    ) : (
                        <div style={{
                            padding: '4px 10px',
                            background: 'var(--secondary)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}>
                            <span style={{ fontSize: '13px', filter: 'grayscale(1)' }}>🛠️</span>
                            <span style={{ fontSize: '12px', color: 'var(--foreground)', fontWeight: '600' }}>Tramersiz</span>
                        </div>
                    )}

                    {/* Inspection Status - Outlined */}
                    {listing.inspectionDate && (
                        <div style={{
                            padding: '4px 10px',
                            background: 'var(--secondary)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                Muayene {formatInspectionStatus(listing.inspectionDate)}
                            </span>
                        </div>
                    )}

                    {/* Routine Maintenance - Outlined */}
                    {listing.nextMaintenanceKm && (
                        <div style={{
                            padding: '4px 10px',
                            background: 'var(--secondary)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                Bakım {(listing.nextMaintenanceKm - listing.km).toLocaleString()} km
                            </span>
                        </div>
                    )}

                    {/* Major Maintenance Button - Outlined */}
                    {listing.completedMaintenance && listing.completedMaintenance.length > 0 && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                alert(`Yapılan Ağır Bakımlar:\n\n${listing.completedMaintenance!.map(m => `✓ ${m}`).join('\n')}`);
                            }}
                            style={{
                                padding: '4px 10px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--card-bg)';
                                e.currentTarget.style.color = 'var(--foreground)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--secondary)';
                                e.currentTarget.style.color = 'var(--text-muted)';
                            }}
                        >
                             Geçmiş ({listing.completedMaintenance.length})
                        </button>
                    )}
                </div>
            </div>

            {/* COLUMN 2: Paint Status (35%) */}
            <div style={{
                flex: '0 0 35%',
                padding: '24px',
                borderRight: '1px solid var(--card-border)',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.5px' }}>
                        ARAÇ DURUMU
                    </div>
                    <div style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: `${scoreColor}20`,
                        color: scoreColor,
                        fontSize: '12px',
                        fontWeight: '700',
                    }}>
                        %{paintScore} Orijinal
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {Object.entries(paintStatusColors).map(([status, color]) => {
                        const count = paintSummary[status as PaintStatus];
                        if (count === 0) return null;
                        return (
                            <span key={status} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--foreground)',
                                fontSize: '11px',
                                fontWeight: '600',
                            }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
                                {count} {paintStatusLabels[status as PaintStatus]}
                            </span>
                        );
                    })}
                </div>

                <div style={{ flex: 1, overflowY: 'auto', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {(() => {
                        const affectedPanels: { status: PaintStatus; panels: string[] }[] = [];
                        (['boyali', 'degisen', 'hasarli'] as PaintStatus[]).forEach(status => {
                            const panels = listing.paintStatus
                                .filter(p => p.status === status)
                                .map(p => paintPanels.find(panel => panel.id === p.panelId)?.name || p.panelId);
                            if (panels.length > 0) affectedPanels.push({ status, panels });
                        });

                        if (affectedPanels.length === 0) return <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}><Check style={{ width: '14px', height: '14px' }} /> Hatasız, boyasız</span>;

                        return affectedPanels.map(({ status, panels }, idx) => (
                            <div key={status} style={{ marginBottom: '4px' }}>
                                <span style={{ color: paintStatusColors[status], fontWeight: '700' }}>
                                    {paintStatusLabels[status]}:
                                </span>{' '}
                                {panels.join(', ')}
                            </div>
                        ));
                    })()}
                </div>
            </div>

            {/* COLUMN 3: Price & Action (25%) */}
            <div style={{
                flex: '1',
                padding: '24px',
                background: 'var(--secondary)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-end',
                textAlign: 'right'
            }}>
                {listing.originalPrice && (
                    <div style={{ marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'line-through', marginRight: '8px' }}>
                            {formatListingPrice(listing.originalPrice)}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#F97316', background: 'rgba(249, 115, 22, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                            %{getDiscountPercentage(listing.originalPrice, listing.price)}
                        </span>
                    </div>
                )}

                <div style={{ fontSize: '28px', fontWeight: '900', color: '#10B981', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                    {formatListingPrice(listing.price)}
                </div>

                {listing.originalPrice && (
                    <div style={{ fontSize: '11px', color: 'rgba(16, 185, 129, 0.7)', fontWeight: '600', marginBottom: '20px' }}>
                        {formatListingPrice(getDiscountAmount(listing.originalPrice, listing.price))} avantaj
                    </div>
                )}
                {!listing.originalPrice && <div style={{ marginBottom: '20px' }}></div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        @{listing.userName} • {listing.phoneNumber}
                    </div>

                    <a
                        href={listing.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '16px 32px', // Increased padding
                            background: 'var(--primary)',
                            color: 'white',
                            borderRadius: '14px',
                            fontSize: '16px', // Increased font size
                            fontWeight: '800', // Increased weight
                            textDecoration: 'none',
                            transition: 'transform 0.2s',
                            boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)',
                            width: '100%',
                            maxWidth: '220px' // Increased width
                        }}
                    >
                        <ExternalLink style={{ width: '20px', height: '20px' }} />
                        İlana Git
                    </a>
                </div>
            </div>

            {/* Mobile Stack Fix */}
            <style jsx>{`
                @media (max-width: 1024px) {
                    div[style*="flexDirection: 'row'"] {
                        flex-direction: column !important;
                        min-height: auto !important;
                    }
                    div[style*="flex: '0 0 40%'"], div[style*="flex: '0 0 35%'"], div[style*="flex: '1'"] {
                        flex: auto !important;
                        width: 100% !important;
                        border-right: none !important;
                        border-bottom: 1px solid var(--card-border) !important;
                        text-align: left !important;
                        align-items: flex-start !important;
                    }
                    div[style*="justifyContent: 'center'"] {
                        justify-content: flex-start !important;
                    }
                    div[style*="alignItems: 'flex-end'"] {
                        align-items: flex-start !important;
                    }
                    div[style*="textAlign: 'right'"] {
                        text-align: left !important;
                    }
                    /* Fix badge position relative to column */
                    div[style*="left: '-32px'"] {
                       left: auto !important;
                       right: -35px !important;
                       top: 25px !important;
                       transform: rotate(45deg) !important;
                    }
                }
            `}</style>
        </div>
    );
}

// New Listing Modal Component
function NewListingModal({
    onClose,
    onSubmit
}: {
    onClose: () => void;
    onSubmit: (listing: CarListing) => void;
}) {
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [color, setColor] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");

    const [year, setYear] = useState<number>(2024);
    const [km, setKm] = useState<number>(0);
    const [originalPrice, setOriginalPrice] = useState<number>(0);  // İlan linkindeki fiyat
    const [price, setPrice] = useState<number>(0);                   // Otosöz fiyatı
    const [externalLink, setExternalLink] = useState("");
    const [description, setDescription] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [linkPhoneConfirm, setLinkPhoneConfirm] = useState(false);

    // Engine and vehicle specs
    const [fuelType, setFuelType] = useState("");
    const [transmission, setTransmission] = useState("");
    const [engineType, setEngineType] = useState("");
    const [drivetrain, setDrivetrain] = useState("");
    const [engineDisplacement, setEngineDisplacement] = useState("");
    const [horsepower, setHorsepower] = useState<number>(0);
    const [inspectionDate, setInspectionDate] = useState("");
    const [tireCondition, setTireCondition] = useState<number>(100);
    const [tramerPrice, setTramerPrice] = useState<number>(0);
    const [isUrgent, setIsUrgent] = useState(false);
    const [isHeavilyDamaged, setIsHeavilyDamaged] = useState(false);

    // Maintenance tracking
    const [nextMaintenanceKm, setNextMaintenanceKm] = useState<number>(0);
    const [completedMaintenance, setCompletedMaintenance] = useState<string[]>([]);

    const maintenanceOptions = [
        "Triger kayışı",
        "Su pompası",
        "Debriyaj",
        "Fren balatası/diski",
        "Süspansiyon",
        "Turbo",
        "Motor revizyonu",
        "Şanzıman bakımı"
    ];

    const [paintStatus, setPaintStatus] = useState<PaintPanel[]>(
        paintPanels.map(p => ({ panelId: p.id, status: "orijinal" as PaintStatus }))
    );

    const brands = getAllBrands();
    const models = brand ? getModelsForBrand(brand) : [];
    const colors = carColors;

    // Location Data
    const cities = useMemo(() => getAllCities(), []);
    const districts = useMemo(() => getDistrictsForCity(city), [city]);


    const updatePanelStatus = (panelId: string, status: PaintStatus) => {
        setPaintStatus(prev =>
            prev.map(p => p.panelId === panelId ? { ...p, status } : p)
        );
    };

    const handleSubmit = () => {
        if (!brand || !model || !externalLink) {
            alert("Lütfen marka, model ve ilan linkini doldurun!");
            return;
        }

        if (!color) {
            alert("Lütfen araç rengini seçiniz!");
            return;
        }

        if (!city || !district) {
            alert("Lütfen İl ve İlçe seçiniz!");
            return;
        }

        if (!phoneNumber) {
            alert(" Telefon numarası zorunludur!");
            return;
        }

        if (!linkPhoneConfirm) {
            alert(" Telefon numarasının ilan linkindeki ile aynı olduğunu onaylamalısınız!\n\nLütfen ilan linkindeki telefon numarasıyla aynı numarayı girin ve onay kutusunu işaretleyin.");
            return;
        }

        // Check for minimum 1% discount
        if (originalPrice > 0) {
            const discountPercentage = getDiscountPercentage(originalPrice, price);
            if (discountPercentage < 1) {
                alert(" Otosöz fiyatı, orijinal fiyattan en az %1 düşük olmalıdır!\n\nşu anki indirim: %" + discountPercentage.toFixed(1) + "\n\nDaha düşük bir fiyat belirleyiniz.");
                return;
            }
        }

        const newListing: CarListing = {
            id: Date.now().toString(),
            brand,
            model,
            year,
            km,
            color,
            price,
            originalPrice: originalPrice > 0 ? originalPrice : undefined,
            paintStatus,
            externalLink,
            source: detectSource(externalLink),
            description,
            createdAt: new Date().toISOString().split('T')[0],
            userId: "current_user",
            userName: "Ben",
            phoneNumber,
            // Engine specs
            fuelType: fuelType || undefined,
            transmission: transmission || undefined,
            engineType: engineType || undefined,
            drivetrain: drivetrain || undefined,
            engineDisplacement: engineDisplacement || undefined,
            horsepower: horsepower || undefined,
            // Additional info
            inspectionDate: inspectionDate || undefined,
            tireCondition: tireCondition || undefined,
            tramerPrice: tramerPrice > 0 ? tramerPrice : undefined,
            isUrgent: isUrgent || undefined,
            isHeavilyDamaged: isHeavilyDamaged || undefined,
            // Maintenance
            nextMaintenanceKm: nextMaintenanceKm > 0 ? nextMaintenanceKm : undefined,
            completedMaintenance: completedMaintenance.length > 0 ? completedMaintenance : undefined,
            // Location
            city,
            district
        };

        onSubmit(newListing);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--card-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
        }}>
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '700px',
                maxHeight: '90vh',
                overflow: 'auto',
            }}>
                {/* Modal Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--card-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    background: 'var(--card-bg)',
                    zIndex: 10,
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>
                        Yeni İlan Ekle
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '8px',
                        }}
                    >
                        <X style={{ width: '24px', height: '24px' }} />
                    </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '24px' }}>
                    {/* Brand & Model */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                                Marka *
                            </label>
                            <select
                                value={brand}
                                onChange={(e) => { setBrand(e.target.value); setModel(""); }}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '10px',
                                    color: 'var(--foreground)',
                                    fontSize: '14px',
                                }}
                            >
                                <option value="" style={{ background: 'var(--card-bg)', color: 'var(--foreground)' }}>Marka seçin</option>
                                {brands.map(b => (
                                    <option key={b} value={b} style={{ background: 'var(--card-bg)' }}>{b}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                                Model *
                            </label>
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                disabled={!brand}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '10px',
                                    color: brand ? 'var(--foreground)' : 'var(--text-muted)',
                                    fontSize: '14px',
                                }}
                            >
                                <option value="" style={{ background: 'var(--card-bg)' }}>Model seçin</option>
                                {models.map(m => (
                                    <option key={m} value={m} style={{ background: 'var(--card-bg)' }}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Color & Location */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                                Renk *
                            </label>
                            <select
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '10px',
                                    color: 'var(--foreground)',
                                    fontSize: '14px',
                                }}
                            >
                                <option value="" style={{ background: 'var(--card-bg)' }}>Renk seçin</option>
                                {colors.map(c => (
                                    <option key={c.id} value={c.id} style={{ background: 'var(--card-bg)' }}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                                İl *
                            </label>
                            <select
                                value={city}
                                onChange={(e) => { setCity(e.target.value); setDistrict(""); }}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '10px',
                                    color: 'var(--foreground)',
                                    fontSize: '14px',
                                }}
                            >
                                <option value="" style={{ background: 'var(--card-bg)' }}>İl seçin</option>
                                {cities.map(c => (
                                    <option key={c} value={c} style={{ background: 'var(--card-bg)' }}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                                İlçe *
                            </label>
                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                disabled={!city}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '10px',
                                    color: city ? 'var(--foreground)' : 'var(--text-muted)',
                                    fontSize: '14px',
                                }}
                            >
                                <option value="" style={{ background: 'var(--card-bg)' }}>İlçe seçin</option>
                                {districts.map(d => (
                                    <option key={d} value={d} style={{ background: 'var(--card-bg)' }}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>


                    {/* Year, KM, Price */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                                Yıl
                            </label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                                min={1990}
                                max={2025}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '10px',
                                    color: 'var(--foreground)',
                                    fontSize: '14px',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                                KM
                            </label>
                            <input
                                type="number"
                                value={km}
                                onChange={(e) => setKm(parseInt(e.target.value))}
                                min={0}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '10px',
                                    color: 'var(--foreground)',
                                    fontSize: '14px',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                                Fiyat (₺)
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(parseInt(e.target.value))}
                                min={0}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '10px',
                                    color: 'var(--foreground)',
                                    fontSize: '14px',
                                }}
                            />
                        </div>
                    </div>

                    {/* External Link */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                            İlan Linki * (arabam.com veya sahibinden.com)
                        </label>
                        <input
                            type="url"
                            value={externalLink}
                            onChange={(e) => setExternalLink(e.target.value)}
                            placeholder="https://www.sahibinden.com/ilan/..."
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '10px',
                                color: 'var(--foreground)',
                                fontSize: '14px',
                            }}
                        />
                    </div>

                    {/* Phone Number */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                            Telefon Numarası * (İlan linkindeki ile aynı olmalı)
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="0532 123 4567"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '10px',
                                color: 'var(--foreground)',
                                fontSize: '14px',
                            }}
                        />
                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            alignItems: 'start',
                            gap: '10px',
                            padding: '12px',
                            background: 'rgba(255, 215, 0, 0.1)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            borderRadius: '10px'
                        }}>
                            <input
                                type="checkbox"
                                id="phone-confirm"
                                checked={linkPhoneConfirm}
                                onChange={(e) => setLinkPhoneConfirm(e.target.checked)}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer',
                                    marginTop: '2px',
                                    accentColor: '#FFD700'
                                }}
                            />
                            <label
                                htmlFor="phone-confirm"
                                style={{
                                    fontSize: '12px',
                                    color: '#FFD700',
                                    cursor: 'pointer',
                                    lineHeight: '1.5'
                                }}
                            >
                                ✓ Bu telefon numarasının, ilan linkinde (sahibinden/arabam) yazan telefon numarasıyla <strong>tamamen aynı</strong> olduğunu onaylıyorum.
                            </label>
                        </div>
                    </div>

                    {/* Paint Status */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '600' }}>
                            ARAÇ DURUMU
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                            {paintPanels.map(panel => {
                                const currentStatus = paintStatus.find(p => p.panelId === panel.id)?.status || 'orijinal';
                                return (
                                    <div key={panel.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '10px 14px',
                                        background: 'var(--secondary)',
                                        borderRadius: '10px',
                                    }}>
                                        <span style={{ fontSize: '13px', color: 'var(--foreground)' }}>
                                            {panel.name}
                                        </span>
                                        <select
                                            value={currentStatus}
                                            onChange={(e) => updatePanelStatus(panel.id, e.target.value as PaintStatus)}
                                            style={{
                                                padding: '6px 10px',
                                                background: `${paintStatusColors[currentStatus]}20`,
                                                border: `1px solid ${paintStatusColors[currentStatus]}50`,
                                                borderRadius: '8px',
                                                color: paintStatusColors[currentStatus],
                                                fontSize: '12px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            <option value="orijinal" style={{ background: 'var(--card-bg)', color: 'var(--foreground)' }}>Orijinal</option>
                                            <option value="boyali" style={{ background: 'var(--card-bg)', color: 'var(--foreground)' }}>Boyalı</option>
                                            <option value="lokal" style={{ background: 'var(--card-bg)', color: 'var(--foreground)' }}>Lokal Boya</option>
                                            <option value="degisen" style={{ background: 'var(--card-bg)', color: 'var(--foreground)' }}>Değişen</option>
                                            <option value="hasarli" style={{ background: 'var(--card-bg)', color: 'var(--foreground)' }}>Hasarlı</option>
                                        </select>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                            Açıklama (Opsiyonel)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Araç hakkında kısa bir not..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '10px',
                                color: 'var(--foreground)',
                                fontSize: '14px',
                                resize: 'vertical',
                            }}
                        />
                    </div>

                    {/* Maintenance Section */}
                    <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '14px', color: '#60A5FA', fontWeight: '700', marginBottom: '16px' }}>
                             Bakım Bilgileri
                        </h3>

                        {/* Next Maintenance KM */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                                Sonraki Rutin Bakım (km)
                            </label>
                            <input
                                type="number"
                                value={nextMaintenanceKm || ''}
                                onChange={(e) => setNextMaintenanceKm(parseInt(e.target.value) || 0)}
                                placeholder="Örn: 50000"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '10px',
                                    color: 'var(--foreground)',
                                    fontSize: '14px',
                                }}
                            />
                        </div>

                        {/* Completed Major Maintenance */}
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '600' }}>
                                Yapılan Ağır Bakımlar
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                {maintenanceOptions.map(option => (
                                    <label
                                        key={option}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 12px',
                                            background: completedMaintenance.includes(option) ? 'rgba(168, 85, 247, 0.15)' : 'var(--secondary)',
                                            border: completedMaintenance.includes(option) ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid var(--card-border)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!completedMaintenance.includes(option)) {
                                                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.08)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!completedMaintenance.includes(option)) {
                                                e.currentTarget.style.background = 'var(--secondary)';
                                            }
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={completedMaintenance.includes(option)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setCompletedMaintenance([...completedMaintenance, option]);
                                                } else {
                                                    setCompletedMaintenance(completedMaintenance.filter(m => m !== option));
                                                }
                                            }}
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                cursor: 'pointer',
                                                accentColor: '#A855F7'
                                            }}
                                        />
                                        <span style={{ fontSize: '12px', color: completedMaintenance.includes(option) ? '#A855F7' : 'var(--foreground)', fontWeight: '500' }}>
                                            {option}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: 'var(--primary)',
                            color: 'white',
                            fontWeight: '700',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                        }}
                    >
                        <Check style={{ width: '18px', height: '18px' }} />
                        İlan Ekle
                    </button>
                </div>
            </div >
        </div >
    );
}

