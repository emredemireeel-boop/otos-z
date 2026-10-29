import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { createSlug } from "@/data/vehicle-dna";
import { isVehicleIndexable } from '@/lib/indexability';
import { engineDNAData } from "@/data/engine-dna";
import { findVehicleByRoute, vehicleMetadataName } from "@/lib/aracDnaSeo";
import AracDNAShell from "./AracDNAShell";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ brand: string; model: string }>;
}


export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { brand, model } = await params;
    const vehicle = findVehicleByRoute(brand, model);

    if (!vehicle) {
        return createPageMetadata({
        title: "Araç DNA Verisi Bulunamadı | OtoSöz",
        index: false
    });
    }

    const canonicalPath = `/arac-dna/${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`;
    const engines = engineDNAData.find(item => item.vehicleId === vehicle.id)?.engines || [];
    const engineKeywords = engines.flatMap(engine => [
        `${vehicle.brand} ${vehicle.model} ${engine.name} yakıt tüketimi`,
        `${vehicle.brand} ${vehicle.model} ${engine.transmission} şanzıman arızası`,
        `${vehicle.brand} ${vehicle.model} ${engine.name} alınır mı`,
    ]);
    const metadata = createPageMetadata({
        title: `${vehicleMetadataName(vehicle)} Alınır mı? Kronik Sorunlar ve Motorlar`,
        description: `${vehicle.brand} ${vehicle.model} için motor seçenekleri, DNA puanı, kronik sorunlar, kullanıcı deneyimleri ve donanım paketlerini inceleyin.`,
        path: canonicalPath,
        indexable: isVehicleIndexable(vehicle)
    });

    return metadata;
}

export default async function AracDNALayout({ children, params }: LayoutProps) {
    const { brand, model } = await params;
    const vehicle = findVehicleByRoute(brand, model);

    if (!vehicle) notFound();

    const canonicalBrand = createSlug(vehicle.brand);
    const canonicalModel = createSlug(vehicle.model);

    return (
        <>
            {children}
        </>
    );
}
