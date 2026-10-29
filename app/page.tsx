import {vehicleDNAData} from '@/data/vehicle-dna';
import {isVehicleIndexable} from '@/lib/indexability';
import { indexabilityRobots, isHubIndexable } from '@/lib/indexability';
import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getRecentForumThreadSummaries } from "@/lib/forumDataServer";

export const revalidate = 900;

const title = "OtoSöz | Araç Alımı, Arıza Çözümü ve Karşılaştırma";
const description = "Araç alırken, otomobil arızasını araştırırken veya iki aracı karşılaştırırken gerçek sürücü deneyimi, uzman görüşü ve düzenli veriyi OtoSöz'de inceleyin.";
const canonicalUrl = "https://otosoz.com/";

export const metadata: Metadata = {
    robots: indexabilityRobots(isHubIndexable('/')),
    title,
    description,
    keywords: [
        "araç alımı",
        "araba alınır mı",
        "otomobil arıza çözümü",
        "araç karşılaştırma",
        "araç kullanıcı yorumları",
        "kronik sorunlar",
        "OBD arıza kodları",
        "otomotiv karar platformu",
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "OtoSöz",
        locale: "tr_TR",
        type: "website",
        images: [{ url: "/api/og", width: 1200, height: 630, alt: "OtoSöz otomotiv karar platformu" }],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/api/og"],
    },
};

const homePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://otosoz.com/#webpage",
    url: canonicalUrl,
    name: title,
    description,
    isPartOf: { "@id": "https://otosoz.com/#website" },
    about: [
        { "@type": "Thing", name: "Araç satın alma kararı" },
        { "@type": "Thing", name: "Otomobil arızaları ve OBD kodları" },
        { "@type": "Thing", name: "Araç karşılaştırma" },
    ],
    inLanguage: "tr-TR",
};

export default async function HomePage() {
    const initialThreads = await getRecentForumThreadSummaries(100);
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd).replace(/</g, "\u003c") }}
            />
            <HomeClient initialThreads={initialThreads} featuredDnaVehicles={vehicleDNAData.filter(vehicle=>[1,2,3,4,5,6,7,8,13].includes(vehicle.id)&&isVehicleIndexable(vehicle)).map(({id,brand,model,dnaScore,totalReports,chronicIssues})=>({id,brand,model,dnaScore,totalReports,chronicIssueCount:chronicIssues.length}))} />
        </>
    );
}
