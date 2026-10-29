
import { DnaTabLinks } from "@/components/DnaTabLinks";
import type { VehicleDNA } from "@/lib/dna-types";
import { isVehicleIndexable, isVehicleSectionIndexable } from '@/lib/indexability';
import { isEngineRouteIndexable } from '@/lib/engine-quality';
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { vehicleDNAData, getDNAScoreColor, getDNAScoreLabel, createSlug, isVehicleEditoriallyReviewed } from "@/data/vehicle-dna";
import { engineDNAData } from "@/data/engine-dna";
import { trimLevelsData } from "@/data/trim-levels";
import { ArrowLeft, Dna, FileText, Wrench, ThumbsUp, MessageCircle, Package, HelpCircle } from "lucide-react";
import { buildVehicleFaq } from "@/lib/vehicleFaq";
import { getVehicleGenerationInfo } from "@/lib/vehicleGeneration";

const suffixes = {
    'artilar': '-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri',
    'kronik': '-kronik-sorunlari',
    'donanim': '-arac-paketleri',
    'deneyimler': '-kullanici-deneyimleri'
};

export default function AracDNAShell({ children, vehicle, engineParam = '', section = 'genel-bakis' }: { children: React.ReactNode; vehicle: VehicleDNA; engineParam?: string; section?: string }) {
    const brandSlug = createSlug(vehicle.brand);
    const modelSlug = createSlug(vehicle.model);
    if (!vehicle) {
        return (
            <div>
                <Navbar />
                <main style={{ minHeight: '100vh', background: 'var(--background)', padding: '100px 20px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '24px', color: 'var(--foreground)' }}>Araç DNA verisi bulunamadı</h1>
                    <Link href="/arac-dna">
                        <button style={{
                            marginTop: '20px', padding: '12px 24px', background: 'var(--primary)',
                            color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600'
                        }}>
                            Araç DNA Sayfasına Dön
                        </button>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    if (!isVehicleIndexable(vehicle)) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: 1, background: 'var(--background)', padding: '100px 20px 60px' }}>
                    <section style={{ maxWidth: 720, margin: '0 auto', padding: 32, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', color: '#d97706', marginBottom: 10 }}>
                            EDİTORYAL İNCELEME
                        </div>
                        <h1 style={{ fontSize: 28, color: 'var(--foreground)', marginBottom: 12 }}>
                            {vehicle.brand} {vehicle.model} dosyası doğrulanıyor
                        </h1>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>
                            Bu eski kayıt birden fazla nesil veya donanım bilgisini karıştırdığı için puan ve arıza iddialarını geçici olarak göstermiyoruz. Kaynak kontrolü tamamlandığında canonical Araç DNA dosyası yeniden yayına alınacak.
                        </p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <Link href={`/arac-dna/${brandSlug}`} style={{ padding: '11px 16px', borderRadius: 10, background: 'var(--primary)', color: 'white', textDecoration: 'none', fontWeight: 700 }}>
                                {vehicle.brand} modellerine dön
                            </Link>
                            <Link href="/" style={{ padding: '11px 16px', borderRadius: 10, border: '1px solid var(--card-border)', color: 'var(--foreground)', textDecoration: 'none', fontWeight: 700 }}>
                                Forum deneyimlerini incele
                            </Link>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    // Engine-specific heading and navigation are supplied by the engine page itself.
    let baseEngineSlug = engineParam;
    let currentTab = section;
    for (const [tab, suffix] of Object.entries(suffixes)) {
        if (engineParam.endsWith(suffix)) { baseEngineSlug = engineParam.slice(0,-suffix.length); currentTab = tab; break; }
    }
    const vehicleEngines = engineDNAData.find(e => e.vehicleId === vehicle.id)?.engines || [];
    const specificEngine = baseEngineSlug ? vehicleEngines.find(engine => engine.slug === baseEngineSlug) || null : null;
    const faqItems = buildVehicleFaq(vehicle, vehicleEngines);

    // Determine the active score and title
    const activeScore = specificEngine ? specificEngine.score : vehicle.dnaScore;
    const scoreColor = getDNAScoreColor(activeScore);
    const scoreLabel = getDNAScoreLabel(activeScore);

    const basePath = specificEngine 
        ? `/arac-dna/${brandSlug}/${modelSlug}/${baseEngineSlug}`
        : `/arac-dna/${brandSlug}/${modelSlug}`;

    const modelPath = `/arac-dna/${brandSlug}/${modelSlug}`;
    const hasTrimLevels = trimLevelsData.some(item => item.vehicleId === vehicle.id);
    const modelTabs = [
        { id: "genel-bakis", name: "Nesil ve Motorlar", path: modelPath, icon: <FileText size={16} /> },
        ...((vehicle.strengths.length || vehicle.weaknesses.length)
            ? [{ id: "artilar", name: "Güçlü Yönler ve Dikkat Noktaları", path: `${modelPath}/neden-alinir`, icon: <ThumbsUp size={16} /> }]
            : []),
        ...(vehicle.chronicIssues.length > 0
            ? [{ id: "kronik", name: "Kronik Riskler", path: `${modelPath}/kronik-sorunlar`, icon: <Wrench size={16} /> }]
            : []),
        ...(hasTrimLevels
            ? [{ id: "donanim", name: "Araç Paketleri", path: `${modelPath}/arac-paketleri`, icon: <Package size={16} /> }]
            : []),
        ...(vehicle.userExperiences.length > 0
            ? [{ id: "deneyimler", name: "Kullanıcı Deneyimleri", path: `${modelPath}/kullanici-deneyimleri`, icon: <MessageCircle size={16} /> }]
            : []),
    ];

    const availableTabs = specificEngine ? [
        { id: "genel-bakis", name: "Genel Bakış", path: basePath, icon: <FileText size={16} /> },
        ...((specificEngine.pros?.length || specificEngine.cons?.length)
            ? [{ id: "artilar", name: "Güçlü Yönler ve Dikkat Noktaları", path: `${basePath}-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri`, icon: <ThumbsUp size={16} /> }]
            : (vehicle.strengths.length || vehicle.weaknesses.length)
                ? [{ id: "artilar", name: "Güçlü Yönler ve Dikkat Noktaları", path: `${modelPath}/neden-alinir`, icon: <ThumbsUp size={16} /> }]
                : []),
        ...(specificEngine.chronicIssues.length > 0
            ? [{ id: "kronik", name: "Kronik Riskler", path: `${basePath}-kronik-sorunlari`, icon: <Wrench size={16} /> }]
            : vehicle.chronicIssues.length > 0
                ? [{ id: "kronik", name: "Kronik Riskler", path: `${modelPath}/kronik-sorunlar`, icon: <Wrench size={16} /> }]
                : []),
        ...(hasTrimLevels
            ? [{ id: "donanim", name: "Araç Paketleri", path: `${modelPath}/arac-paketleri`, icon: <Package size={16} /> }]
            : []),
        ...(vehicle.userExperiences.length > 0
            ? [{ id: "deneyimler", name: "Kullanıcı Deneyimleri", path: `${modelPath}/kullanici-deneyimleri`, icon: <MessageCircle size={16} /> }]
            : []),
    ] : modelTabs;
    const sectionForTab: Record<string, string> = { artilar: 'neden-alinir', kronik: 'kronik-sorunlar', donanim: 'arac-paketleri', deneyimler: 'kullanici-deneyimleri' };
    const tabs = availableTabs.filter(tab => {
        if (tab.id === currentTab) return true;
        if (tab.path.startsWith(basePath) && specificEngine && !tab.path.startsWith(modelPath + '/arac-paketleri')) {
            return isEngineRouteIndexable(vehicle, specificEngine, tab.id);
        }
        return tab.id === 'genel-bakis' ? isVehicleIndexable(vehicle) : isVehicleSectionIndexable(vehicle,
            sectionForTab[tab.id], { trims: trimLevelsData.find(item => item.vehicleId === vehicle.id)?.trims || [] });
    });


    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <main style={{ flex: 1, background: 'var(--background)', paddingTop: '60px', paddingBottom: '60px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

                    {/* Back Button */}
                    <Link href="/arac-dna">
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                            background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px',
                            color: 'var(--foreground)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', fontWeight: '500'
                        }}>
                            <ArrowLeft size={18} /> Geri Dön
                        </button>
                    </Link>

                    {/* Header Card */}
                    <div style={{
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '16px', padding: '32px', marginBottom: '24px',
                        display: 'flex', flexDirection: 'column', gap: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '50%',
                                background: `linear-gradient(135deg, ${scoreColor}, ${scoreColor}dd)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <Dna size={32} color="white" />
                            </div>
                            <div>
                                {(() => {
                                    const generation = getVehicleGenerationInfo(vehicle);
                                    const generationInfo = generation.label;
                                    const mainModelName = vehicle.model.replace(/\s*\([^)]+\)/, "").trim();
                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <h1 style={{ fontSize: '30px', fontWeight: '800', color: 'var(--foreground)', margin: 0, lineHeight: '1.2' }}>
                                                {vehicle.brand} {mainModelName}
                                                {specificEngine ? ` ${specificEngine.name} (${specificEngine.fuelType} - ${specificEngine.transmission})` : ''}
                                            </h1>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                                {generationInfo && (
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                                                        color: 'white',
                                                        fontSize: '12px',
                                                        borderRadius: '20px',
                                                        fontWeight: '700',
                                                        boxShadow: '0 4px 10px rgba(234, 179, 8, 0.25)',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}>
                                                        Jenerasyon: {generationInfo}
                                                    </span>
                                                )}
                                                <span style={{
                                                    padding: '4px 12px',
                                                    background: 'var(--secondary)',
                                                    border: '1px solid var(--card-border)',
                                                    color: 'var(--text-muted)',
                                                    fontSize: '12px',
                                                    borderRadius: '20px',
                                                    fontWeight: '600'
                                                }}>
                                                    📅 {vehicle.year}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                    </div>

                    {/* Persistent model/engine navigation */}
                    {tabs.length > 0 && (
                        <div
                            className="dna-tabs-sticky"
                            style={{
                                position: 'sticky',
                                top: '62px',
                                zIndex: 900,
                                marginBottom: '24px',
                                padding: '10px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '14px',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
                            }}
                            aria-label="Araç DNA bölümleri"
                        >
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }} className="hide-scrollbar">
                                <DnaTabLinks>{tabs.map(tab => <a key={tab.path} href={tab.path} className="dna-tab-link" aria-current={tab.id === currentTab ? "page" : undefined}>{tab.icon}{tab.name}</a>)}</DnaTabLinks>
                            </div>
                        </div>
                    )}

                    {/* Page Content */}
                    <div>
                        {children}
                    </div>



                </div>
            </main>

            <Footer />
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
