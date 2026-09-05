import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { createSlug, isVehicleEditoriallyReviewed } from "@/data/vehicle-dna";
import { engineDNAData } from "@/data/engine-dna";
import { findVehicleByRoute } from "@/lib/aracDnaSeo";
import { buildVehicleFaq } from "@/lib/vehicleFaq";
import AracDNALayoutClient from "./AracDNALayoutClient";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ brand: string; model: string }>;
}


export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { brand, model } = await params;
    const vehicle = findVehicleByRoute(brand, model);

    if (!vehicle) {
        return {
            title: "Araç DNA Verisi Bulunamadı | OtoSöz",
            robots: { index: false, follow: false },
        };
    }

    const canonicalPath = `/arac-dna/${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`;
    const engines = engineDNAData.find(item => item.vehicleId === vehicle.id)?.engines || [];
    const engineKeywords = engines.flatMap(engine => [
        `${vehicle.brand} ${vehicle.model} ${engine.name} yakıt tüketimi`,
        `${vehicle.brand} ${vehicle.model} ${engine.transmission} şanzıman arızası`,
        `${vehicle.brand} ${vehicle.model} ${engine.name} alınır mı`,
    ]);
    const metadata = createPageMetadata({
        title: `${vehicle.brand} ${vehicle.model} Araç DNA Analizi`,
        description: `${vehicle.brand} ${vehicle.model} için motor seçenekleri, DNA puanı, kronik sorunlar, kullanıcı deneyimleri ve donanım paketlerini inceleyin.`,
        path: canonicalPath,
        keywords: [
            `${vehicle.brand} ${vehicle.model} kronik sorunlar`,
            `${vehicle.brand} ${vehicle.model} yorumları`,
            `${vehicle.brand} ${vehicle.model} motor seçenekleri`,
            `${vehicle.brand} ${vehicle.model} yakıt tüketimi`,
            `${vehicle.brand} ${vehicle.model} alınır mı`,
            ...engineKeywords,
        ],
    });

    return isVehicleEditoriallyReviewed(vehicle)
        ? metadata
        : { ...metadata, robots: { index: false, follow: true } };
}

export default async function AracDNALayout({ children, params }: LayoutProps) {
    const { brand, model } = await params;
    const vehicle = findVehicleByRoute(brand, model);

    if (!vehicle) notFound();

    const canonicalBrand = createSlug(vehicle.brand);
    const canonicalModel = createSlug(vehicle.model);
    if (brand !== canonicalBrand || model !== canonicalModel) {
        permanentRedirect(`/arac-dna/${canonicalBrand}/${canonicalModel}`);
    }

    const engines = engineDNAData.find(item => item.vehicleId === vehicle.id)?.engines || [];
    const faqItems = buildVehicleFaq(vehicle, engines);
    const canonicalUrl = `https://otosoz.com/arac-dna/${canonicalBrand}/${canonicalModel}`;
    const faqSchema = isVehicleEditoriallyReviewed(vehicle) ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": { "@type": "Answer", "text": item.answer },
        })),
    } : null;

    return (
        <>
            {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
            <AracDNALayoutClient>{children}</AracDNALayoutClient>
        </>
    );
}
