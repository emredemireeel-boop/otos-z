import { staticVehicleParams } from '@/lib/vehicle-index';
import AracDNAShell from '../AracDNAShell';
import { notFound } from 'next/navigation';
import { findVehicleByRoute } from '@/lib/aracDnaSeo';

import { createSlug, vehicleDNAData } from "@/data/vehicle-dna";
import { ThumbsUp, CheckCircle, AlertTriangle } from "lucide-react";

export default async function ProsAndConsPage({ params }: { params: Promise<{ brand: string; model: string }> }) {
    const { brand: brandSlug, model: modelSlug } = await params;
    const vehicle = findVehicleByRoute(brandSlug, modelSlug);
    if (!vehicle) notFound();

    return (<AracDNAShell vehicle={vehicle} section="artilar">
        <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '32px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                <ThumbsUp size={28} color="var(--primary)" />
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>
                    {vehicle.brand} {vehicle.model} Güçlü Yönleri ve Dikkat Noktaları
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
                            Güçlü Yönleri
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
                            Dikkat Noktaları
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
    </AracDNAShell>);
}

export const revalidate = 1800;
export const dynamic = 'force-static';
export const dynamicParams = true;
export function generateStaticParams({params}:{params:{brand:string}}) {return staticVehicleParams('neden-alinir',params.brand);}
