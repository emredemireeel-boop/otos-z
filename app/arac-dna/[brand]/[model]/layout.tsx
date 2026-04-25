"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { vehicleDNAData, getDNAScoreColor, getDNAScoreLabel } from "@/data/vehicle-dna";
import { ArrowLeft, Dna, FileText, Wrench, ThumbsUp, MessageCircle } from "lucide-react";

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
        const vBrandSlug = v.brand.toLowerCase().replace(/\s+/g, '-');
        const vModelSlug = v.model.toLowerCase().replace(/\s+/g, '-');
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

    const scoreColor = getDNAScoreColor(vehicle.dnaScore);
    const scoreLabel = getDNAScoreLabel(vehicle.dnaScore);

    const basePath = `/arac-dna/${brandSlug}/${modelSlug}`;

    const tabs = [
        { name: "Genel Bakış", path: basePath, icon: <FileText size={16} />, exact: true },
        { name: "Artıları & Eksileri", path: `${basePath}/artilari-eksileri`, icon: <ThumbsUp size={16} />, exact: false },
        { name: "Kronik Sorunlar", path: `${basePath}/kronik-sorunlar`, icon: <Wrench size={16} />, exact: false },
        { name: "Kullanıcı Deneyimleri", path: `${basePath}/kullanici-deneyimleri`, icon: <MessageCircle size={16} />, exact: false },
    ];

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
                                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', margin: 0, marginBottom: '4px' }}>
                                    {vehicle.brand} {vehicle.model}
                                </h1>
                                <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: 0 }}>
                                    {vehicle.year} Model
                                </p>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', borderTop: '1px solid var(--card-border)', paddingTop: '24px' }} className="hide-scrollbar">
                            {tabs.map((tab) => {
                                const isActive = tab.exact ? pathname === tab.path : pathname.startsWith(tab.path);
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
