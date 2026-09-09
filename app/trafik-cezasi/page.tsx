import type { Metadata } from "next";
import KutuphaneClient from "@/app/kutuphane/KutuphaneClient";
import trafikCezalariData from "@/data/trafik_cezalari.json";

const BASE_URL = "https://otosoz.com";
const PAGE_URL = `${BASE_URL}/trafik-cezasi`;
const LAST_REVIEWED = "2026-09-09";
const TITLE = "2026 Trafik Cezaları ve Güncel Ceza Tutarları | OtoSöz";
const DESCRIPTION = "2026 trafik cezaları, güncel ceza tutarları, ehliyet ceza puanları, araç men süreleri, erken ödeme ve itiraz bilgilerini madde madde inceleyin.";

const allFines = trafikCezalariData.categories.flatMap((category) => category.rows);

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
        "2026 trafik cezaları",
        "trafik cezası sorgulama",
        "güncel trafik ceza tutarları",
        "hız cezası 2026",
        "ehliyet ceza puanı",
        "trafik cezası erken ödeme",
    ],
    alternates: { canonical: PAGE_URL },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        type: "website",
        url: PAGE_URL,
        siteName: "OtoSöz",
        images: [{
            url: `${BASE_URL}/api/og?title=${encodeURIComponent("2026 Trafik Cezaları")}&desc=${encodeURIComponent("Güncel tutarlar, ceza puanları ve yaptırımlar")}`,
            width: 1200,
            height: 630,
            alt: "2026 trafik cezaları ve güncel ceza tutarları",
        }],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: [`${BASE_URL}/api/og?title=${encodeURIComponent("2026 Trafik Cezaları")}&desc=${encodeURIComponent("Güncel tutarlar, ceza puanları ve yaptırımlar")}`],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },
    category: "Trafik mevzuatı",
};

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
                { "@type": "ListItem", position: 2, name: "Kütüphane", item: `${BASE_URL}/kutuphane` },
                { "@type": "ListItem", position: 3, name: "Trafik Cezaları", item: PAGE_URL },
            ],
        },
        {
            "@type": "CollectionPage",
            "@id": `${PAGE_URL}#collection`,
            url: PAGE_URL,
            name: TITLE,
            description: DESCRIPTION,
            inLanguage: "tr-TR",
            dateModified: LAST_REVIEWED,
            isPartOf: {
                "@type": "WebSite",
                "@id": `${BASE_URL}/#website`,
                name: "OtoSöz",
                url: BASE_URL,
            },
            citation: {
                "@type": "Legislation",
                name: "7574 sayılı Karayolları Trafik Kanununda Değişiklik Yapılmasına Dair Kanun",
                url: "https://resmigazete.gov.tr/27.02.2026",
            },
            mainEntity: {
                "@type": "ItemList",
                numberOfItems: allFines.length,
                itemListElement: allFines.map((fine, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: `${fine.ihlal} - ${fine.ceza}`,
                    url: `${BASE_URL}/trafik-cezasi/${fine.slug}`,
                })),
            },
        },
    ],
};

export default function TrafikCezalariPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
            />
            <KutuphaneClient initialCategory="trafik-cezalari" />
        </>
    );
}
