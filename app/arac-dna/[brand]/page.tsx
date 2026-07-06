import { Metadata } from "next";
import { vehicleDNAData, createSlug } from "@/data/vehicle-dna";
import { engineDNAData } from "@/data/engine-dna";
import { notFound } from "next/navigation";
import BrandHubClient from "./BrandHubClient";

interface PageProps {
    params: Promise<{ brand: string }>;
}

// Birleşik marka isimlerini ('/' içerenleri) filtrele
const uniqueBrands = [...new Set(vehicleDNAData.map(v => v.brand))]
    .filter(b => !b.includes('/'));

export async function generateStaticParams() {
    return uniqueBrands.map(brand => ({
        brand: createSlug(brand),
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { brand: brandSlug } = await params;

    const brandName = uniqueBrands.find(b => createSlug(b) === brandSlug.toLowerCase());
    if (!brandName) return { title: "Marka Bulunamadı | OtoSöz" };

    const brandModels = vehicleDNAData.filter(v => v.brand === brandName);
    const avgScore = Math.round(brandModels.reduce((s, v) => s + v.dnaScore, 0) / brandModels.length);

    const title = `${brandName} Araç DNA Analizi – ${brandModels.length} Model İncelemesi [2026] | OtoSöz`;
    const description = `${brandName} marka araçların detaylı DNA analizi ✓ ${brandModels.length} model ✓ Ortalama DNA Puanı: ${avgScore}/100 ✓ Kronik sorunlar, güçlü yönler ve kullanıcı deneyimleri ✓ Motor seçenekleri karşılaştırması`;

    return {
        title,
        description,
        keywords: [
            `${brandName} araç analizi`, `${brandName} DNA puanı`, `${brandName} kronik sorunlar`,
            `${brandName} modelleri`, `${brandName} arıza`, `${brandName} 2026`,
            `${brandName} ikinci el`, `${brandName} kullanıcı yorumları`,
        ],
        openGraph: {
            title,
            description,
            type: "website",
            url: `https://otosoz.com/arac-dna/${brandSlug.toLowerCase()}`,
            siteName: "OtoSöz",
        },
        alternates: {
            canonical: `https://otosoz.com/arac-dna/${brandSlug.toLowerCase()}`,
        },
    };
}

export default async function BrandPage({ params }: PageProps) {
    const { brand: brandSlug } = await params;

    const brandName = uniqueBrands.find(b => createSlug(b) === brandSlug.toLowerCase());
    if (!brandName) notFound();

    const brandModels = vehicleDNAData.filter(v => v.brand === brandName);
    
    // Her model için motor bilgilerini de ekle
    const modelsWithEngines = brandModels.map(vehicle => {
        const engineData = engineDNAData.find(e => e.vehicleId === vehicle.id);
        return {
            ...vehicle,
            engineCount: engineData?.engines?.length || 0,
        };
    });

    // JSON-LD
    const brandSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${brandName} Araç DNA Analizi`,
        "description": `${brandName} marka araçların detaylı analizi`,
        "url": `https://otosoz.com/arac-dna/${brandSlug.toLowerCase()}`,
        "publisher": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": "https://otosoz.com",
        },
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": brandModels.length,
            "itemListElement": modelsWithEngines.slice(0, 20).map((v, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": `${v.brand} ${v.model}`,
                "url": `https://otosoz.com/arac-dna/${createSlug(v.brand)}/${createSlug(v.model)}`,
            })),
        },
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://otosoz.com/" },
            { "@type": "ListItem", "position": 2, "name": "Araç DNA", "item": "https://otosoz.com/arac-dna" },
            { "@type": "ListItem", "position": 3, "name": brandName, "item": `https://otosoz.com/arac-dna/${brandSlug.toLowerCase()}` },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([brandSchema, breadcrumbSchema]) }} />
            <BrandHubClient brandName={brandName} models={JSON.parse(JSON.stringify(modelsWithEngines))} />
        </>
    );
}
