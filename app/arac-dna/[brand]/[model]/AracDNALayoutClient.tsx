"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { vehicleDNAData, getDNAScoreColor, getDNAScoreLabel, createSlug, isVehicleEditoriallyReviewed } from "@/data/vehicle-dna";
import { engineDNAData } from "@/data/engine-dna";
import { trimLevelsData } from "@/data/trim-levels";
import { ArrowLeft, Dna, FileText, Wrench, ThumbsUp, MessageCircle, Package, Zap } from "lucide-react";

const suffixes = {
    'artilar': '-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri',
    'kronik': '-kronik-sorunlari',
    'donanim': '-arac-paketleri',
    'deneyimler': '-kullanici-deneyimleri'
};

export default function AracDNALayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const pathname = usePathname();

    const brandSlug = (params?.brand as string)?.toLowerCase() || "";
    const modelSlug = (params?.model as string)?.toLowerCase() || "";

    const vehicle = vehicleDNAData.find(v => {
        const vBrandSlug = createSlug(v.brand);
        const vModelSlug = createSlug(v.model);
        return vBrandSlug === brandSlug && vModelSlug === modelSlug;
    });

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

    if (!isVehicleEditoriallyReviewed(vehicle)) {
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
                            <Link href="/forum" style={{ padding: '11px 16px', borderRadius: 10, border: '1px solid var(--card-border)', color: 'var(--foreground)', textDecoration: 'none', fontWeight: 700 }}>
                                Forum deneyimlerini incele
                            </Link>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    const engineParam = (params?.engine as string)?.toLowerCase() || "";
    let baseEngineSlug = engineParam;
    let currentTab = "genel-bakis";

    for (const [tab, suffix] of Object.entries(suffixes)) {
        if (engineParam.endsWith(suffix)) {
            baseEngineSlug = engineParam.replace(suffix, "");
            currentTab = tab;
            break;
        }
    }

    const specificEngine = baseEngineSlug ? engineDNAData.find(e => e.vehicleId === vehicle.id)?.engines.find(e => e.slug === baseEngineSlug) : null;

    // Determine the active score and title
    const activeScore = specificEngine ? specificEngine.score : vehicle.dnaScore;
    const scoreColor = getDNAScoreColor(activeScore);
    const scoreLabel = getDNAScoreLabel(activeScore);

    const basePath = specificEngine 
        ? `/arac-dna/${brandSlug}/${modelSlug}/${baseEngineSlug}`
        : `/arac-dna/${brandSlug}/${modelSlug}`;

    const modelPath = `/arac-dna/${brandSlug}/${modelSlug}`;
    const hasTrimLevels = trimLevelsData.some(item => item.vehicleId === vehicle.id);
    const tabs = specificEngine ? [
        { id: "genel-bakis", name: "Genel Bakış", path: `${basePath}`, icon: <FileText size={16} /> },
        ...((specificEngine.pros?.length || specificEngine.cons?.length)
            ? [{ id: "artilar", name: "Artıları & Eksileri", path: `${basePath}-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri`, icon: <ThumbsUp size={16} /> }]
            : (vehicle.strengths.length || vehicle.weaknesses.length)
                ? [{ id: "artilar", name: "Artıları & Eksileri", path: `${modelPath}/neden-alinir`, icon: <ThumbsUp size={16} /> }]
                : []),
        ...(specificEngine.chronicIssues.length > 0
            ? [{ id: "kronik", name: "Kronik Sorunlar", path: `${basePath}-kronik-sorunlari`, icon: <Wrench size={16} /> }]
            : vehicle.chronicIssues.length > 0
                ? [{ id: "kronik", name: "Kronik Sorunlar", path: `${modelPath}/kronik-sorunlar`, icon: <Wrench size={16} /> }]
                : []),
        ...(hasTrimLevels
            ? [{ id: "donanim", name: "Araç Paketleri", path: `${modelPath}/arac-paketleri`, icon: <Package size={16} /> }]
            : []),
        ...(vehicle.userExperiences.length > 0
            ? [{ id: "deneyimler", name: "Kullanıcı Deneyimleri", path: `${modelPath}/kullanici-deneyimleri`, icon: <MessageCircle size={16} /> }]
            : []),
    ] : [];

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
                                    const generationMatch = vehicle.model.match(/\(([^)]+)\)/);
                                    const generationInfo = generationMatch ? generationMatch[1] : null;
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
                                                        🛡️ Jenerasyon: {generationInfo}
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

                        {/* Tab Navigation (Only show if specific engine is selected) */}
                        {tabs.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', borderTop: '1px solid var(--card-border)', paddingTop: '24px' }} className="hide-scrollbar">
                                {tabs.map((tab) => {
                                    const isActive = currentTab === tab.id;
                                    return (
                                        <Link key={tab.path} href={tab.path} style={{ textDecoration: 'none' }}>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                padding: '12px 20px', borderRadius: '12px',
                                                background: isActive ? 'var(--primary)' : 'var(--secondary)',
                                                color: isActive ? 'white' : 'var(--foreground)',
                                                fontWeight: isActive ? '600' : '500',
                                                fontSize: '15px', whiteSpace: 'nowrap',
                                                transition: 'all 0.2s', border: `1px solid ${isActive ? 'var(--primary)' : 'transparent'}`
                                            }}>
                                                {tab.icon}
                                                {tab.name}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Page Content */}
                    <div>
                        {children}
                    </div>

                </div>
            </main>

            <Footer />
            <style jsx>{`
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
