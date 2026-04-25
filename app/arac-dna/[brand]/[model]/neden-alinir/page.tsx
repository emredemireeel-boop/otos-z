"use client";

import { useParams } from "next/navigation";
import { vehicleDNAData } from "@/data/vehicle-dna";
import { ThumbsUp, CheckCircle, AlertTriangle } from "lucide-react";

export default function ProsAndConsPage() {
    const params = useParams();

    const brandSlug = (params?.brand as string)?.toLowerCase() || "";
    const modelSlug = (params?.model as string)?.toLowerCase() || "";

    const vehicle = vehicleDNAData.find(v => {
        const vBrandSlug = v.brand.toLowerCase().replace(/\s+/g, '-');
        const vModelSlug = v.model.toLowerCase().replace(/\s+/g, '-');
        return vBrandSlug === brandSlug && vModelSlug === modelSlug;
    });

    if (!vehicle) return null;

    return (
        <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '32px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                <ThumbsUp size={28} color="var(--primary)" />
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>
                    {vehicle.brand} {vehicle.model} Artıları ve Eksileri
                </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Strengths */}
                <div style={{
                    background: 'var(--background)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '16px',
                    padding: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--card-border)' }}>
                        <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '8px', borderRadius: '8px' }}>
                            <CheckCircle size={24} color="#22C55E" />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                            Güçlü Yanları
                        </h3>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {vehicle.strengths.map((strength, index) => (
                            <li key={index} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '16px',
                                background: 'rgba(34, 197, 94, 0.05)',
                                border: '1px solid rgba(34, 197, 94, 0.1)',
                                borderRadius: '12px'
                            }}>
                                <span style={{ color: '#22C55E', fontSize: '18px', flexShrink: 0, marginTop: '-2px' }}>✓</span>
                                <span style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5', fontWeight: '500' }}>
                                    {strength}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div style={{
                    background: 'var(--background)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '16px',
                    padding: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--card-border)' }}>
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '8px', borderRadius: '8px' }}>
                            <AlertTriangle size={24} color="#F59E0B" />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                            Zayıf Yanları
                        </h3>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {vehicle.weaknesses.map((weakness, index) => (
                            <li key={index} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '16px',
                                background: 'rgba(245, 158, 11, 0.05)',
                                border: '1px solid rgba(245, 158, 11, 0.1)',
                                borderRadius: '12px'
                            }}>
                                <span style={{ color: '#F59E0B', fontSize: '18px', flexShrink: 0, marginTop: '-2px' }}>✕</span>
                                <span style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5', fontWeight: '500' }}>
                                    {weakness}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
