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

            {/* SEO Content Depth Expansion */}
            <div style={{
                marginTop: '48px',
                padding: '32px',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                textAlign: 'left',
                color: 'var(--text-muted)',
                lineHeight: '1.7'
            }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px' }}>
                    {vehicle.brand} {vehicle.model} Hakkında Detaylı Analiz
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    <strong>{vehicle.brand} {vehicle.model}</strong>, sınıfının en çok tercih edilen ve merak edilen araçlarından biridir. Otomobil tutkunları ve potansiyel alıcılar, bu modeli incelerken özellikle motor seçeneklerinin performans, yakıt tüketimi ve kronik sorunlar açısından nasıl farklılaştığını merak etmektedir. Aracın üretim yılına, donanım paketine ve tercih edilen vites tipine (manuel, tam otomatik, yarı otomatik vb.) bağlı olarak kullanım deneyimi büyük ölçüde değişebilir. 
                </p>
                <p style={{ marginBottom: '16px' }}>
                    OtoAsfalt Araç DNA platformu, <strong>{vehicle.brand} {vehicle.model}</strong> için en ince ayrıntısına kadar veri analizi sunar. Hangi motorun daha uzun ömürlü olduğunu, hangisinin kronik yağ yakma, şanzıman ısınması veya elektronik arıza gibi potansiyel sorunlara yatkın olduğunu görmek için yukarıdaki seçeneklerden aracınıza veya almayı düşündüğünüz araca en uygun motor varyantını seçmeniz gerekir.
                </p>
                <p>
                    {vehicle.brand} markasının geliştirdiği teknolojik altyapılar ve {vehicle.model} modeline özel kronik sorunların tüm detayları, sanayi ustalarının yorumları ve gerçek kullanıcı deneyimleriyle harmanlanarak 10 üzerinden bir <strong>DNA Skoru</strong> ile değerlendirilir. En düşük puanlı sorunlu motorlardan kaçınmak ve bütçenize en uygun en sorunsuz aracı bulmak için motor seçiminizi yaparak detaylı incelemeye hemen başlayın.
                </p>
            </div>
        </div>
    );
}
