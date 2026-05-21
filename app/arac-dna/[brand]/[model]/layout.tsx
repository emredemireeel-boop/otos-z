"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { vehicleDNAData, getDNAScoreColor, getDNAScoreLabel, createSlug } from "@/data/vehicle-dna";
import { engineDNAData } from "@/data/engine-dna";
import { ArrowLeft, Dna, FileText, Wrench, ThumbsUp, MessageCircle, Package, Zap } from "lucide-react";

export default function AracDNALayout({
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

    const engineSlug = (params?.engine as string)?.toLowerCase() || "";
    const specificEngine = engineSlug ? engineDNAData.find(e => e.vehicleId === vehicle.id)?.engines.find(e => e.slug === engineSlug) : null;

    // Determine the active score and title
    const activeScore = specificEngine ? specificEngine.score : vehicle.dnaScore;
    const scoreColor = getDNAScoreColor(activeScore);
    const scoreLabel = getDNAScoreLabel(activeScore);

    const basePath = specificEngine 
        ? `/arac-dna/${brandSlug}/${modelSlug}/${engineSlug}`
        : `/arac-dna/${brandSlug}/${modelSlug}`;

    const tabs = specificEngine ? [
        { name: "Genel Bakış", path: `${basePath}#genel-bakis`, hash: "#genel-bakis", icon: <FileText size={16} /> },
        { name: "Artıları & Eksileri", path: `${basePath}#artilar`, hash: "#artilar", icon: <ThumbsUp size={16} /> },
        { name: "Kronik Sorunlar", path: `${basePath}#kronik`, hash: "#kronik", icon: <Wrench size={16} /> },
        { name: "Araç Paketleri", path: `${basePath}#donanim`, hash: "#donanim", icon: <Package size={16} /> },
        { name: "Kullanıcı Deneyimleri", path: `${basePath}#deneyimler`, hash: "#deneyimler", icon: <MessageCircle size={16} /> },
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
                                    const isActive = false;
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
