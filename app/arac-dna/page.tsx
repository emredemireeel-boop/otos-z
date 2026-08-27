"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { vehicleDNAData, getDNAScoreColor, getDNAScoreLabel, createSlug, isVehicleEditoriallyReviewed } from "@/data/vehicle-dna";
import { engineDNAData, EngineOption } from "@/data/engine-dna";
import { getAllBrands, getModelsForBrand } from "@/data/listings";

interface EngineVariantDisplay {
    vehicle: typeof vehicleDNAData[0];
    engine: EngineOption;
}

import { Dna, Search, TrendingUp, Car, Calendar, AlertCircle, Send, CheckCircle2, Zap, Star, TrendingDown } from "lucide-react";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function AracDNAPage() {
    const [brandInput, setBrandInput] = useState("");
    const [modelInput, setModelInput] = useState("");
    const [vehicleYear, setVehicleYear] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [transmissionType, setTransmissionType] = useState("");
    const [searchAttempted, setSearchAttempted] = useState(false);
    const [showContributeForm, setShowContributeForm] = useState(false);
    const [searchResults, setSearchResults] = useState<EngineVariantDisplay[] | null>(null);

    // Contribution form states
    const [strengths, setStrengths] = useState("");
    const [weaknesses, setWeaknesses] = useState("");
    const [chronicIssues, setChronicIssues] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // Flatten all engine variants
    const allEngineVariants: EngineVariantDisplay[] = [];
    vehicleDNAData.forEach(vehicle => {
        const engineData = engineDNAData.find(e => e.vehicleId === vehicle.id);
        if (engineData && engineData.engines.length > 0) {
            engineData.engines.forEach(engine => {
                allEngineVariants.push({ vehicle, engine });
            });
        } else {
            allEngineVariants.push({ 
                vehicle, 
                engine: { slug: 'standart', name: 'Standart Motor', fuelType: 'Benzin', transmission: 'Manuel', score: vehicle.dnaScore, issues: [] } as any
            });
        }
    });

    const reviewedEngineVariants = allEngineVariants.filter(item => isVehicleEditoriallyReviewed(item.vehicle));

    // Popüler ve puan sıralamaları yalnızca kaynak kontrolü tamamlanan kayıtları kullanır.
    const popularVehicles = reviewedEngineVariants.slice(0, 50);
    const topCars = [...reviewedEngineVariants]
        .sort((a, b) => b.engine.score - a.engine.score)
        .slice(0, 5);
        
    const bottomCars = [...reviewedEngineVariants]
        .filter(a => a.engine.score > 0)
        .sort((a, b) => a.engine.score - b.engine.score)
        .slice(0, 5);

    const handleSearch = () => {
        setSearchAttempted(true);
        setShowContributeForm(false);
        setSubmitted(false);

        // Find all matching engines
        const matches = allEngineVariants.filter(item => {
            const v = item.vehicle;
            const e = item.engine;
            
            const matchesBrand = v.brand.toLowerCase() === brandInput.toLowerCase();
            const matchesModel = v.model.toLowerCase().includes(modelInput.toLowerCase());
            
            // Year matching logic
            let matchesYear = true;
            if (vehicleYear) {
                const yearNum = parseInt(vehicleYear);
                const yearMatch = v.year.match(/(\d{4})-(\d{4})/);
                if (yearMatch) {
                    const start = parseInt(yearMatch[1]);
                    const end = parseInt(yearMatch[2]);
                    matchesYear = yearNum >= start && yearNum <= end;
                } else {
                    matchesYear = v.year.includes(vehicleYear);
                }
            }

            // Engine matching logic
            const matchesFuel = fuelType ? e.fuelType === fuelType : true;
            let matchesTrans = true;
            if (transmissionType) {
                if (transmissionType === "Manuel") {
                    matchesTrans = e.transmission.toLowerCase().includes("manuel");
                } else if (transmissionType === "Otomatik") {
                    matchesTrans = !e.transmission.toLowerCase().includes("manuel") || e.transmission.toLowerCase().includes("otomatik") || e.transmission.toLowerCase().includes("dsg") || e.transmission.toLowerCase().includes("edc") || e.transmission.toLowerCase().includes("cvt");
                }
            }

            return matchesBrand && matchesModel && matchesYear && matchesFuel && matchesTrans;
        });

        if (matches.length > 0) {
            setSearchResults(matches);
        } else {
            setSearchResults([]);
            setTimeout(() => setShowContributeForm(true), 500);
        }
    };

    const displayedVehicles = searchResults !== null ? searchResults : popularVehicles;

    const handleContribute = () => {
        // Here you would send data to backend
        console.log({
            brand: brandInput,
            model: modelInput,
            year: vehicleYear,
            fuelType: fuelType,
            transmissionType: transmissionType,
            strengths,
            weaknesses,
            chronicIssues
        });

        setSubmitted(true);
        setTimeout(() => {
            setShowContributeForm(false);
            setSearchAttempted(false);
            setBrandInput("");
            setModelInput("");
            setVehicleYear("");
            setFuelType("");
            setTransmissionType("");
            setStrengths("");
            setWeaknesses("");
            setChronicIssues("");
            setSubmitted(false);
        }, 3000);
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px' }}>
                {/* Hero Section */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '48px 24px'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #22C55E, #3B82F6)',
                            marginBottom: '24px'
                        }}>
                            <Dna size={40} color="white" />
                        </div>
                        <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px' }}>
                             Araç DNA Analizi
                        </h1>
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 24px auto' }}>
                            Aracınızın marka, model ve yılını girin. Detaylı DNA analizi, güçlü/zayıf yanları ve kronik sorunları görün
                        </p>
                        
                        {/* Kıyaslama Butonu */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                            <Link href="/arac-dna/kiyasla" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'var(--card-bg)',
                                color: 'var(--foreground)',
                                border: '1px solid var(--card-border)',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '16px',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--card-border)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8"/><path d="m3 3 7 7"/><path d="m21 3-7 7"/><path d="m14 15-2-2-2 2"/><path d="M4 15h16"/></svg>
                                Araçları Kıyasla
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="home-main-grid" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '250px 1fr 250px', gap: '24px', alignItems: 'start' }}>
                    {/* Left Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <AdPlaceholder position="sidebar_left" />
                        
                        {/* Top Rated Vehicles Card */}
                        <div style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '16px',
                            padding: '24px',
                            color: 'var(--foreground)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <Star fill="#22c55e" color="#22c55e" size={16} />
                                <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: 'var(--foreground)' }}>En Yüksek Puanlılar</h3>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {topCars.map((item, idx) => {
                                    const slug = `${createSlug(item.vehicle.brand)}/${createSlug(item.vehicle.model)}/${item.engine.slug}`;
                                    return (
                                        <li key={idx}>
                                            <Link href={`/arac-dna/${slug}`} style={{ textDecoration: 'none', color: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 6px', borderRadius: '6px', transition: 'background 0.2s' }}
                                                 onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                                                 onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.vehicle.brand} {item.vehicle.model}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.engine.name}</div>
                                                </div>
                                                <div style={{ color: '#22c55e', fontWeight: '700', fontSize: '13px', paddingLeft: '8px', flexShrink: 0 }}>
                                                    {item.engine.score}
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div>
                        {/* Search Form */}
                        <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '16px',
                        padding: '32px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <Search size={24} color="var(--primary)" />
                            <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                                Araç Bilgilerini Girin
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                            {/* Brand Select */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
                                    Marka
                                </label>
                                <select
                                    value={brandInput}
                                    onChange={(e) => {
                                        setBrandInput(e.target.value);
                                        setModelInput(""); // Reset model when brand changes
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'var(--input-bg)',
                                        border: '2px solid var(--input-border)',
                                        borderRadius: '12px',
                                        color: 'var(--foreground)',
                                        fontSize: '15px',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--input-border)'}
                                >
                                    <option value="" style={{ color: 'black' }}>Marka Seçiniz</option>
                                    {getAllBrands().map(brand => (
                                        <option key={brand} value={brand} style={{ color: 'black' }}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Model Select */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
                                    Model
                                </label>
                                <select
                                    value={modelInput}
                                    onChange={(e) => setModelInput(e.target.value)}
                                    disabled={!brandInput}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: !brandInput ? 'var(--secondary)' : 'var(--input-bg)',
                                        border: '2px solid var(--input-border)',
                                        borderRadius: '12px',
                                        color: 'var(--foreground)',
                                        fontSize: '15px',
                                        outline: 'none',
                                        cursor: !brandInput ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        opacity: !brandInput ? 0.7 : 1,
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                    onFocus={(e) => !brandInput ? null : e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => !brandInput ? null : e.currentTarget.style.borderColor = 'var(--input-border)'}
                                >
                                    <option value="" style={{ color: 'black' }}>Model Seçiniz</option>
                                    {brandInput && getModelsForBrand(brandInput).map(model => (
                                        <option key={model} value={model} style={{ color: 'black' }}>{model}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Vehicle Year */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={14} />
                                    Araç Yılı
                                </label>
                                <select
                                    value={vehicleYear}
                                    onChange={(e) => setVehicleYear(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'var(--input-bg)',
                                        border: '2px solid var(--input-border)',
                                        borderRadius: '12px',
                                        color: 'var(--foreground)',
                                        fontSize: '15px',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--input-border)'}
                                >
                                    <option value="" style={{ color: 'black' }}>Seçiniz</option>
                                    {years.map(year => (
                                        <option key={year} value={year} style={{ color: 'black' }}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Fuel Type */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Zap size={14} />
                                    Yakıt Tipi
                                </label>
                                <select
                                    value={fuelType}
                                    onChange={(e) => setFuelType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'var(--input-bg)',
                                        border: '2px solid var(--input-border)',
                                        borderRadius: '12px',
                                        color: 'var(--foreground)',
                                        fontSize: '15px',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--input-border)'}
                                >
                                    <option value="" style={{ color: 'black' }}>Tümü</option>
                                    <option value="Benzin" style={{ color: 'black' }}>Benzin</option>
                                    <option value="Dizel" style={{ color: 'black' }}>Dizel</option>
                                    <option value="Elektrik" style={{ color: 'black' }}>Elektrik</option>
                                    <option value="Hibrit" style={{ color: 'black' }}>Hibrit</option>
                                </select>
                            </div>

                            {/* Transmission Type */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                                    Vites Tipi
                                </label>
                                <select
                                    value={transmissionType}
                                    onChange={(e) => setTransmissionType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'var(--input-bg)',
                                        border: '2px solid var(--input-border)',
                                        borderRadius: '12px',
                                        color: 'var(--foreground)',
                                        fontSize: '15px',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--input-border)'}
                                >
                                    <option value="" style={{ color: 'black' }}>Tümü</option>
                                    <option value="Manuel" style={{ color: 'black' }}>Manuel</option>
                                    <option value="Otomatik" style={{ color: 'black' }}>Otomatik</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleSearch}
                            disabled={!brandInput || !modelInput}
                            style={{
                                width: '100%',
                                padding: '14px 24px',
                                background: (!brandInput || !modelInput) ? 'var(--secondary)' : 'var(--primary)',
                                color: (!brandInput || !modelInput) ? 'var(--text-muted)' : 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: (!brandInput || !modelInput) ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s',
                                opacity: (!brandInput || !modelInput) ? 0.5 : 1
                            }}
                        >
                            <Search size={20} />
                            DNA Analizi Ara
                        </button>
                    </div>

                    {/* No Data Found - Contribution Form */}
                    {showContributeForm && !submitted && (
                        <div style={{
                            background: 'var(--card-bg)',
                            border: '2px solid #f59e0b',
                            borderRadius: '16px',
                            padding: '32px',
                            marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <AlertCircle size={24} color="#f59e0b" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                        Veri Bulunamadı
                                    </h3>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                        <strong>{brandInput} {modelInput}</strong> {vehicleYear && `(${vehicleYear})`} için henüz DNA analizi verisi bulunmuyor.
                                        Topluluğa katkıda bulunarak bu aracın ilk DNA profilini oluşturabilirsiniz!
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '20px' }}>
                                {/* Strengths */}
                                <div>
                                    <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px', display: 'block' }}>
                                        💪 Güçlü Yönleri
                                    </label>
                                    <textarea
                                        value={strengths}
                                        onChange={(e) => setStrengths(e.target.value)}
                                        placeholder="Bu aracın güçlü yönlerini yazın (yakıt ekonomisi, dayanıklılık, konfor vb.)"
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'var(--input-bg)',
                                            border: '2px solid var(--input-border)',
                                            borderRadius: '12px',
                                            color: 'var(--foreground)',
                                            fontSize: '14px',
                                            outline: 'none',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--input-border)'}
                                    />
                                </div>

                                {/* Weaknesses */}
                                <div>
                                    <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px', display: 'block' }}>
                                        ⚠️ Zayıf Yönleri
                                    </label>
                                    <textarea
                                        value={weaknesses}
                                        onChange={(e) => setWeaknesses(e.target.value)}
                                        placeholder="Bu aracın zayıf yönlerini yazın (yüksek bakım maliyeti, düşük performans vb.)"
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'var(--input-bg)',
                                            border: '2px solid var(--input-border)',
                                            borderRadius: '12px',
                                            color: 'var(--foreground)',
                                            fontSize: '14px',
                                            outline: 'none',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#f59e0b'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--input-border)'}
                                    />
                                </div>

                                {/* Chronic Issues */}
                                <div>
                                    <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px', display: 'block' }}>
                                         Kronik Sorunlar
                                    </label>
                                    <textarea
                                        value={chronicIssues}
                                        onChange={(e) => setChronicIssues(e.target.value)}
                                        placeholder="Bu araçta sık görülen kronik sorunları yazın (Şanzıman arızası, elektrik problemleri vb.)"
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'var(--input-bg)',
                                            border: '2px solid var(--input-border)',
                                            borderRadius: '12px',
                                            color: 'var(--foreground)',
                                            fontSize: '14px',
                                            outline: 'none',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#ef4444'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--input-border)'}
                                    />
                                </div>

                                <button
                                    onClick={handleContribute}
                                    disabled={!strengths && !weaknesses && !chronicIssues}
                                    style={{
                                        padding: '14px 24px',
                                        background: (!strengths && !weaknesses && !chronicIssues) ? 'var(--secondary)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                                        color: (!strengths && !weaknesses && !chronicIssues) ? 'var(--text-muted)' : 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        cursor: (!strengths && !weaknesses && !chronicIssues) ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s',
                                        opacity: (!strengths && !weaknesses && !chronicIssues) ? 0.5 : 1
                                    }}
                                >
                                    <Send size={20} />
                                    Katkıda Bulun
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {submitted && (
                        <div style={{
                            background: 'var(--card-bg)',
                            border: '2px solid #22c55e',
                            borderRadius: '16px',
                            padding: '32px',
                            marginBottom: '24px',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'rgba(34, 197, 94, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px'
                            }}>
                                <CheckCircle2 size={32} color="#22c55e" />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                Teşekkürler!
                            </h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                Katkınız başarıyla kaydedildi. Moderasyon sonrası yayınlanacaktır.
                            </p>
                        </div>
                    )}

                    {/* Popular Vehicles */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '16px',
                        padding: '32px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <TrendingUp size={24} color="var(--primary)" />
                            <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                                {searchResults !== null 
                                    ? (searchResults.length > 0 ? 'Arama Sonuçları' : 'Sonuç Bulunamadı') 
                                    : 'Popüler Araçlar'}
                            </h2>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '16px'
                        }}>
                            {displayedVehicles.map((item, index) => {
                                const { vehicle, engine } = item;
                                const isReviewed = isVehicleEditoriallyReviewed(vehicle);
                                const scoreColor = isReviewed ? getDNAScoreColor(engine.score) : '#d97706';
                                const slug = `${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}/${engine.slug}`;

                                return (
                                    <Link
                                        key={`${vehicle.id}-${engine.slug}-${index}`}
                                        href={`/arac-dna/${slug}`}
                                        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                                    >
                                        <div style={{
                                            background: 'var(--secondary)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '12px',
                                            padding: '20px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--primary)';
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--card-border)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{ marginBottom: '16px', flex: 1 }}>
                                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px', lineHeight: '1.3' }}>
                                                    {vehicle.brand} {vehicle.model.replace(/\s*\([^)]+\)/, "").trim()}
                                                </h3>
                                                <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>
                                                    {engine.name} ({engine.fuelType} - {engine.transmission})
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Calendar size={14} /> {vehicle.year}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <AlertCircle size={14} /> {vehicle.chronicIssues.length + (engine.chronicIssues?.length || 0)} Sorun
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                borderTop: '1px solid var(--card-border)',
                                                paddingTop: '16px',
                                                marginTop: 'auto'
                                            }}>
                                                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>
                                                    {isReviewed ? 'DNA Skoru' : 'Veri durumu'}
                                                </span>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    background: `linear-gradient(135deg, ${scoreColor}15, ${scoreColor}05)`,
                                                    padding: '6px 12px',
                                                    borderRadius: '8px',
                                                    border: `1px solid ${scoreColor}30`
                                                }}>
                                                    <Dna size={16} color={scoreColor} />
                                                    <span style={{ fontSize: isReviewed ? '16px' : '12px', fontWeight: '800', color: scoreColor }}>
                                                        {isReviewed ? engine.score : 'İncelemede'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    </div>

                    {/* Right Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Lowest Rated Vehicles Card */}
                        <div style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '16px',
                            padding: '24px',
                            color: 'var(--foreground)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <TrendingDown color="#ef4444" size={16} />
                                <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: 'var(--foreground)' }}>En Düşük Puanlılar</h3>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {bottomCars.map((item, idx) => {
                                    const slug = `${createSlug(item.vehicle.brand)}/${createSlug(item.vehicle.model)}/${item.engine.slug}`;
                                    return (
                                        <li key={idx}>
                                            <Link href={`/arac-dna/${slug}`} style={{ textDecoration: 'none', color: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 6px', borderRadius: '6px', transition: 'background 0.2s' }}
                                                 onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                                                 onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.vehicle.brand} {item.vehicle.model}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.engine.name}</div>
                                                </div>
                                                <div style={{ color: '#ef4444', fontWeight: '700', fontSize: '13px', paddingLeft: '8px', flexShrink: 0 }}>
                                                    {item.engine.score}
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <AdPlaceholder position="sidebar_right" />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
