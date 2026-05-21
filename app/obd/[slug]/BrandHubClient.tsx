"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Car } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ObdCode {
    code: string;
    title: string;
    description: string;
    type: string;
    systems: string[];
}

interface BrandHubClientProps {
    brandName: string;
    obdCodes: ObdCode[];
}

export default function BrandHubClient({ brandName, obdCodes }: BrandHubClientProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCodes = obdCodes.filter(c => 
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        <div>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Header */}
                <div style={{
                    background: 'var(--overlay-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '32px 24px',
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <div style={{ 
                            width: '64px', height: '64px', 
                            background: 'var(--card-bg)', 
                            border: '1px solid var(--card-border)',
                            borderRadius: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <Car size={32} color="var(--primary)" />
                        </div>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>
                            {brandName} Arıza Kodları
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
                            {brandName} marka aracınızda karşılaştığınız OBD-II arıza kodlarının anlamları, olası nedenleri ve çözüm yolları.
                        </p>
                    </div>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
                    {/* Search */}
                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                        <input
                            type="text"
                            placeholder={`${brandName} kodu ara (Örn: P0420)...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '16px 16px 16px 48px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filteredCodes.slice(0, 50).map(code => {
                            const colors = getTypeColor(code.type);
                            return (
                                <Link 
                                    key={code.code} 
                                    href={`/obd/${brandName.toLowerCase()}/${code.code.toLowerCase()}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--card-border)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    background: colors.bg,
                                                    color: colors.text,
                                                    fontSize: '12px',
                                                    borderRadius: '6px',
                                                    fontWeight: '700',
                                                    border: `1px solid ${colors.border}`,
                                                }}>
                                                    {code.code}
                                                </span>
                                            </div>
                                            <h3 style={{ color: 'var(--foreground)', fontSize: '15px', fontWeight: '600' }}>
                                                {code.title}
                                            </h3>
                                        </div>
                                        <ChevronRight size={20} color="var(--text-muted)" />
                                    </div>
                                </Link>
                            )
                        })}
                        {filteredCodes.length === 0 && (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>Sonuç bulunamadı.</p>
                        )}
                        {filteredCodes.length > 50 && (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '16px' }}>En ilgili 50 sonuç gösteriliyor. Lütfen aramayı daraltın.</p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
