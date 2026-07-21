import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { createSlug, vehicleDNAData } from "@/data/vehicle-dna";
import AracDNALayoutClient from "./AracDNALayoutClient";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ brand: string; model: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { brand, model } = await params;
    const vehicle = vehicleDNAData.find(item => (
        createSlug(item.brand) === brand.toLowerCase()
        && createSlug(item.model) === model.toLowerCase()
    ));

    if (!vehicle) {
        return {
            title: "Araç DNA Verisi Bulunamadı | OtoSöz",
            robots: { index: false, follow: false },
        };
    }

    const canonicalPath = `/arac-dna/${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`;
    return createPageMetadata({
        title: `${vehicle.brand} ${vehicle.model} Araç DNA Analizi`,
        description: `${vehicle.brand} ${vehicle.model} için motor seçenekleri, DNA puanı, kronik sorunlar, kullanıcı deneyimleri ve donanım paketlerini inceleyin.`,
        path: canonicalPath,
        keywords: [
            `${vehicle.brand} ${vehicle.model} kronik sorunlar`,
            `${vehicle.brand} ${vehicle.model} yorumları`,
            `${vehicle.brand} ${vehicle.model} motor seçenekleri`,
        ],
    });
}

export default function AracDNALayout({ children }: LayoutProps) {
    return <AracDNALayoutClient>{children}</AracDNALayoutClient>;
}
