"use client";

import { useParams } from "next/navigation";
import { vehicleDNAData, createSlug } from "@/data/vehicle-dna";
import { engineDNAData } from "@/data/engine-dna";
import Link from "next/link";
import { Car, Zap } from "lucide-react";

export default function VehicleModelSelectionPage() {
    const params = useParams();

    const brandSlug = (params?.brand as string)?.toLowerCase() || "";
    const modelSlug = (params?.model as string)?.toLowerCase() || "";

    const vehicle = vehicleDNAData.find(v => {
        const vBrandSlug = createSlug(v.brand);
        const vModelSlug = createSlug(v.model);
        return vBrandSlug === brandSlug && vModelSlug === modelSlug;
    });

    if (!vehicle) return null;

    const engineData = engineDNAData.find(e => e.vehicleId === vehicle.id);

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <Car size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px' }}>
                Lütfen Motor Seçeneği Belirtin
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '40px' }}>
                {vehicle.brand} {vehicle.model} aracının tam DNA analizini görebilmek için yakıt ve vites kombinasyonunu seçmelisiniz.
            </p>

            {engineData && engineData.engines.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {engineData.engines.map((engine) => (
                        <Link 
                            key={engine.slug} 
                            href={`/arac-dna/${brandSlug}/${modelSlug}/${engine.slug}`} 
                            style={{ textDecoration: 'none' }}
                        >
                            <div style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '12px',
                                padding: '24px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'left',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--card-border)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Zap size={24} color="#3b82f6" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px' }}>
                                        {engine.name}
                                    </h3>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                        {engine.fuelType} • {engine.transmission}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                    Bu araca ait spesifik motor varyantları bulunamadı.
                </div>
            )}

            <section style={{
                marginTop: '48px',
                padding: '32px',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                textAlign: 'left',
                color: 'var(--text-muted)',
                lineHeight: '1.7'
            }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>
                    {vehicle.brand} {vehicle.model} dosya kapsamı
                </h2>
                <p style={{ marginBottom: '20px' }}>
                    Bu dosya <strong>{vehicle.year}</strong> üretim dönemini, {engineData?.engines.length || 0} motor seçeneğini ve editoryal kayıttaki {vehicle.chronicIssues.length} kontrol başlığını kapsar. Motor ve şanzıman seçimine göre riskler değişebileceği için ayrıntıyı ilgili motor kartından inceleyin.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    <div>
                        <h3 style={{ fontSize: '15px', color: 'var(--foreground)', marginBottom: '8px' }}>Öne çıkan yönler</h3>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {vehicle.strengths.slice(0, 3).map(item => <li key={item}>{item}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '15px', color: 'var(--foreground)', marginBottom: '8px' }}>Satın almadan önce kontrol</h3>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {vehicle.chronicIssues.slice(0, 3).map(issue => <li key={issue.id}>{issue.title}</li>)}
                        </ul>
                    </div>
                </div>
                <p style={{ marginTop: '20px', fontSize: '13px' }}>
                    DNA puanı bir satın alma garantisi değildir; araç yaşı, bakım geçmişi, kullanım biçimi ve ekspertiz sonucu birlikte değerlendirilmelidir.
                </p>
            </section>
        </div>
    );
}
