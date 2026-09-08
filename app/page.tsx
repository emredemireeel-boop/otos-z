import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const title = "OtoSöz | Araç Alımı, Arıza Çözümü ve Karşılaştırma";
const description = "Araç alırken, otomobil arızasını araştırırken veya iki aracı karşılaştırırken gerçek sürücü deneyimi, uzman görüşü ve düzenli veriyi OtoSöz'de inceleyin.";
const canonicalUrl = "https://otosoz.com/";

export const metadata: Metadata = {
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

export default function HomePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd).replace(/</g, "\u003c") }}
            />
            <HomeClient />
        </>
    );
}
