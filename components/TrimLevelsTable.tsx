"use client";

import React from "react";

import { Check, X, Circle } from "lucide-react";
import { TrimLevelData } from "@/data/trim-levels";

export default function TrimLevelsTable({ data }: { data: TrimLevelData }) {
    return (
        <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            overflow: 'hidden',
            marginTop: '24px'
        }}>
            <div style={{
                background: 'rgba(59, 130, 246, 0.05)',
                padding: '20px 24px',
                borderBottom: '1px solid var(--card-border)'
            }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                    Donanım Paketleri Karşılaştırması
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    Paketler arasındaki farkları ve opsiyonel sunulan donanımları inceleyin.
                </p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--foreground)' }}>
                        <Check size={16} color="#10b981" /> Standart
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--foreground)' }}>
                        <X size={16} color="#ef4444" /> Yok
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--foreground)' }}>
                        <Circle size={14} color="#eab308" /> Opsiyonel
                    </span>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ background: 'var(--secondary)' }}>
                            <th style={{ padding: '16px', borderBottom: '1px solid var(--card-border)', borderRight: '1px solid var(--card-border)', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', position: 'sticky', left: 0, background: 'var(--secondary)', zIndex: 10 }}>
                                Donanım Özelliği
                            </th>
                            {data.trims.map((trim, idx) => (
                                <th key={trim} style={{ padding: '16px', borderBottom: '1px solid var(--card-border)', borderRight: idx === data.trims.length - 1 ? 'none' : '1px solid var(--card-border)', color: 'var(--foreground)', fontWeight: '700', fontSize: '14px' }}>
                                    {trim}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.categories.map((category, catIdx) => (
                            <React.Fragment key={category.categoryName}>
                                <tr>
                                    <td colSpan={data.trims.length + 1} style={{
                                        background: 'rgba(59, 130, 246, 0.02)',
                                        padding: '12px 16px',
                                        textAlign: 'left',
                                        fontWeight: '700',
                                        fontSize: '13px',
                                        color: '#3b82f6',
                                        borderBottom: '1px solid var(--card-border)'
                                    }}>
                                        {category.categoryName}
                                    </td>
                                </tr>
                                {category.features.map((feature, featIdx) => (
                                    <tr key={feature.name} style={{
                                        transition: 'background 0.2s',
                                    }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-primary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{
                                            padding: '16px',
                                            borderBottom: '1px solid var(--card-border)',
                                            borderRight: '1px solid var(--card-border)',
                                            textAlign: 'left',
                                            fontSize: '14px',
                                            color: 'var(--foreground)',
                                            position: 'sticky',
                                            left: 0,
                                            background: 'inherit',
                                            zIndex: 1
                                        }}>
                                            {feature.name}
                                        </td>
                                        {data.trims.map((trim, idx) => {
                                            const status = feature.status[trim] || 'none';
                                            return (
                                                <td key={`${feature.name}-${trim}`} style={{
                                                    padding: '16px',
                                                    borderBottom: '1px solid var(--card-border)',
                                                    borderRight: idx === data.trims.length - 1 ? 'none' : '1px solid var(--card-border)'
                                                }}>
                                                    {status === 'standard' && <Check size={20} color="#10b981" style={{ margin: '0 auto' }} />}
                                                    {status === 'none' && <X size={20} color="#ef4444" style={{ margin: '0 auto' }} />}
                                                    {status === 'optional' && <Circle size={18} color="#eab308" style={{ margin: '0 auto' }} />}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
