"use client";

import { VehicleTrimData } from "@/data/trim-dna";
import { Check, X, Circle, Info } from "lucide-react";

interface TrimComparisonTableProps {
    trimData: VehicleTrimData;
}

export default function TrimComparisonTable({ trimData }: TrimComparisonTableProps) {
    if (!trimData || !trimData.trims || trimData.trims.length === 0) return null;

    const renderStatus = (status: string) => {
        switch (status) {
            case "standard":
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '6px', borderRadius: '50%' }}>
                            <Check size={20} color="#22c55e" strokeWidth={3} />
                        </div>
                    </div>
                );
            case "optional":
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '6px', borderRadius: '50%' }}>
                            <span style={{ color: '#f59e0b', fontWeight: '800', fontSize: '15px' }}>O</span>
                        </div>
                    </div>
                );
            case "unavailable":
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '6px', borderRadius: '50%' }}>
                            <X size={20} color="#ef4444" strokeWidth={3} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: 'var(--foreground)' }}>
                Donanım Paketleri Kıyaslaması
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={16} color="#22c55e" /> Standart</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 'bold' }}>O Opsiyonel</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><X size={16} color="#ef4444" /> Yok</span>
            </p>

            <div style={{ 
                background: 'var(--card-bg)', 
                border: '1px solid var(--card-border)', 
                borderRadius: '16px', 
                overflow: 'hidden',
                overflowX: 'auto'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                    <thead>
                        <tr>
                            <th style={{ 
                                padding: '16px', 
                                borderBottom: '2px solid var(--card-border)',
                                background: 'rgba(0,0,0,0.02)',
                                color: 'var(--foreground)',
                                fontWeight: '700',
                                width: '30%'
                            }}>
                                Özellikler
                            </th>
                            {trimData.trims.map((trim, idx) => (
                                <th key={idx} style={{ 
                                    padding: '16px', 
                                    borderBottom: '2px solid var(--card-border)',
                                    background: 'rgba(0,0,0,0.02)',
                                    color: 'var(--foreground)',
                                    fontWeight: '800',
                                    textAlign: 'center',
                                    width: `${70 / trimData.trims.length}%`
                                }}>
                                    {trim.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {trimData.features.map((feature, featureIdx) => (
                            <tr key={featureIdx} style={{ 
                                borderBottom: featureIdx === trimData.features.length - 1 ? 'none' : '1px solid var(--card-border)',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={{ 
                                    padding: '16px', 
                                    fontSize: '15px', 
                                    color: 'var(--foreground)',
                                    fontWeight: '500'
                                }}>
                                    {feature}
                                </td>
                                {trimData.trims.map((trim, trimIdx) => (
                                    <td key={trimIdx} style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                        {renderStatus(trim.availability[featureIdx])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={16} /> Tablodaki donanım özellikleri yıllara veya özel serilere göre değişiklik gösterebilir.
            </div>
        </div>
    );
}
