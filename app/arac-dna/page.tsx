import {createPageMetadata} from '@/lib/seo';
import {schemaJson,schemaGraph,itemList} from '@/lib/schema';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import {indexabilityRobots,isHubIndexable} from '@/lib/indexability';

import { isVehicleIndexable } from '@/lib/indexability';
import { isEngineRouteIndexable } from '@/lib/engine-quality';

import DnaSearchClient from "./DnaSearchClient";
import { getVehicleIndex } from "@/lib/vehicle-index";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { vehicleDNAData, getDNAScoreColor, getDNAScoreLabel, createSlug, isVehicleEditoriallyReviewed } from "@/data/vehicle-dna";
import { engineDNAData, EngineOption } from "@/data/engine-dna";
import { getVehicleGenerationInfo, resolveVehicleGeneration } from "@/lib/vehicleGeneration";
import { topSellingVehicleGuides } from "@/data/top-selling-vehicle-guides";
import { getAllBrands, getModelsForBrand } from "@/data/listings";

interface EngineVariantDisplay {
    vehicle: typeof vehicleDNAData[0];
    engine: EngineOption;
}

import { Dna, Search, TrendingUp, Car, Calendar, AlertCircle, Send, CheckCircle2, Zap, Star, TrendingDown } from "lucide-react";
import AdPlaceholder from "@/components/AdPlaceholder";

export default async function AracDNAPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
    const query=await searchParams;
    const value=(key:string)=>typeof query[key]==='string'?query[key] as string:'';
    const brandInput=value('brand'),modelInput=value('model'),vehicleYear=value('year'),fuelType=value('fuel'),transmissionType=value('transmission');
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

    const reviewedEngineVariants = allEngineVariants.filter(item => isEngineRouteIndexable(item.vehicle, item.engine));
    const reviewedVehicles = vehicleDNAData.filter(isVehicleIndexable);
    const resolvedGeneration = brandInput && modelInput && vehicleYear
        ? resolveVehicleGeneration(reviewedVehicles, brandInput, modelInput, Number(vehicleYear))
        : null;

    // Popüler ve puan sıralamaları yalnızca kaynak kontrolü tamamlanan kayıtları kullanır.
    const popularVehicles = reviewedEngineVariants.slice(0, 50);
    const topCars = [...reviewedEngineVariants]
        .sort((a, b) => b.engine.score - a.engine.score)
        .slice(0, 5);

    const bottomCars = [...reviewedEngineVariants]
        .filter(a => a.engine.score > 0)
        .sort((a, b) => a.engine.score - b.engine.score)
        .slice(0, 5);

    const searchResults = brandInput && modelInput && vehicleYear ? (()=>{
        // Find all matching engines
        const matches = allEngineVariants.filter(item => {
            const v = item.vehicle;
            const e = item.engine;

            const matchesBrand = v.brand.toLowerCase() === brandInput.toLowerCase();
            const matchesModel = resolvedGeneration ? v.id === resolvedGeneration.id : false;

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

        return matches;
    })() : null;
    const displayedVehicles=searchResults!==null?searchResults:popularVehicles;

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px' }}>
<PageBreadcrumbs url={'/arac-dna'}/>
{!Object.values(query).some(Boolean)&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:schemaJson(schemaGraph([itemList({url:'https://otosoz.com/arac-dna',items:topSellingVehicleGuides.map(guide=>({name:guide.generation,url:`https://otosoz.com/arac-dna/${guide.vehiclePath}`}))})]))}}/>}

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

                            >
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

                                                 >
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
                        <DnaSearchClient index={getVehicleIndex()} initial={{brand:brandInput,model:modelInput,year:vehicleYear,fuel:fuelType,transmission:transmissionType}} />
                    {searchResults !== null && searchResults.length===0 && <div style={{padding:24,background:'var(--card-bg)',borderRadius:16,marginBottom:24}}><h2>Aracınız için eşleşen kayıt bulunamadı</h2><p>Marka, model ve yılı kontrol edebilir veya deneyiminizi forumda paylaşabilirsiniz.</p><Link href="/forum">Forumda deneyiminizi paylaşın</Link></div>}
                    {searchResults === null && (
                        <section className="dna-market-list" aria-labelledby="market-list-title">
                            <div className="dna-market-list__head">
                                <div><span className="dna-section-kicker">Türkiye pazarı</span><h2 id="market-list-title">2026’nın en çok satan 5 otomobili</h2></div>
                                <small>Ocak–Ağustos satışları · ODMD</small>
                            </div>
                            <div className="dna-market-list__grid">
                                {topSellingVehicleGuides.map((guide) => (
                                    <Link key={guide.vehiclePath} href={`/arac-dna/${guide.vehiclePath}`}>
                                        <span>#{guide.rank}</span><strong>{guide.generation}</strong><small>{guide.registrations.toLocaleString('tr-TR')} adet</small>
                                    </Link>
                                ))}
                            </div>
                        </section>
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
                                const isReviewed = isVehicleIndexable(vehicle);
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

                                                 >
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

            <SeoContentDirectory type="arac-dna" title="Markalara göre model dosyaları" modelsOnly/>
            <Footer />
        </div>
    );
}

export async function generateMetadata({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const query=await searchParams;return createPageMetadata({
        path:"/arac-dna",
        index: !query.brand&&!query.model&&!query.year&&isHubIndexable('/arac-dna')
    });
}
import SeoContentDirectory from '@/components/SeoContentDirectory';
