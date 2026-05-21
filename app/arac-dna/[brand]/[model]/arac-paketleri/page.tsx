"use client";

import { useParams } from "next/navigation";
import { vehicleDNAData, createSlug } from "@/data/vehicle-dna";
import { trimLevelsData } from "@/data/trim-levels";
import TrimLevelsTable from "@/components/TrimLevelsTable";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";

export default function TrimLevelsPage() {
    const params = useParams();
    const brandSlug = (params?.brand as string)?.toLowerCase() || "";
    const modelSlug = (params?.model as string)?.toLowerCase() || "";

    const vehicle = vehicleDNAData.find(v => {
        const vBrandSlug = createSlug(v.brand);
        const vModelSlug = createSlug(v.model);
        return vBrandSlug === brandSlug && vModelSlug === modelSlug;
    });

    if (!vehicle) {
        return (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Araç bulunamadı.
            </div>
        );
    }

    const trimData = trimLevelsData.find(t => t.vehicleId === vehicle.id);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Link href={`/arac-dna/${brandSlug}/${modelSlug}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '15px',
                    marginBottom: '16px'
                }}>
                    <ArrowLeft size={18} /> DNA Özetine Dön
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'var(--primary)', borderRadius: '12px', color: 'white' }}>
                        <Layers size={28} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0, color: 'var(--foreground)' }}>
                            Araç Paketleri Kıyaslaması
                        </h1>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                            {vehicle.brand} {vehicle.model.replace(/\([^)]+\)/, '').trim()} donanım seviyeleri arasındaki farkları inceleyin.
                        </p>
                    </div>
                </div>
            </div>

            {trimData ? (
                <TrimLevelsTable data={trimData} />
            ) : (
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    marginTop: '24px'
                }}>
                    <Layers size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Veri Hazırlanıyor</h3>
                    <p>Bu aracın donanım paketi verileri henüz uzmanlarımız tarafından eklenmemiştir.</p>
                </div>
            )}
        </div>
    );
}
