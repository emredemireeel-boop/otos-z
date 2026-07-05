import { Metadata } from "next";
import obdCodes from "@/data/obd-codes.json";
import carModelsData from "@/data/carmodels.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OBDListClient from "./OBDListClient";

// ── SEO Metadata ──
export const metadata: Metadata = {
    title: "OBD Arıza Kodları Veritabanı — 3.500+ Kod | OtoSöz",
    description: "Tüm OBD-II (P, B, C, U) arıza kodlarının Türkçe açıklamaları, belirtileri, nedenleri ve çözüm önerileri. 3.500+ arıza kodu veritabanı ile motor arıza lambası kodlarını sorgulayın.",
    keywords: [
        "OBD arıza kodları", "OBD-II kodları", "motor arıza kodu sorgulama",
        "P0 kodları", "arıza kodu nedir", "DTC kodları", "EOBD arıza kodları",
        "araç arıza kodları", "check engine light", "arıza lambası sorgulama",
    ],
    openGraph: {
        title: "OBD Arıza Kodları Veritabanı — 3.500+ Kod | OtoSöz",
        description: "Tüm OBD-II arıza kodlarının Türkçe açıklamaları, belirtileri ve çözüm önerileri. Motor arıza lambası kodlarını sorgulayın.",
        url: "https://otosoz.com/obd",
        type: "website",
        images: [{
            url: "/api/og?title=OBD%20Arıza%20Kodları&desc=3.500%2B%20arıza%20kodu%20veritabanı",
            width: 1200,
            height: 630,
            alt: "OtoSöz OBD Arıza Kodları Veritabanı",
        }],
    },
    twitter: {
        card: "summary_large_image",
        title: "OBD Arıza Kodları Veritabanı | OtoSöz",
        description: "3.500+ OBD-II arıza kodlarının Türkçe açıklamaları ve çözüm önerileri.",
    },
    alternates: {
        canonical: "https://otosoz.com/obd",
    },
};

interface ObdCode {
    code: string;
    title: string;
    description: string;
    type: string;
    isGeneric: boolean;
    severity: string;
    systems: string[];
    symptoms: string[];
    causes: string[];
    fixes: string[];
}

export default function ObdPage() {
    const allCodes = obdCodes as ObdCode[];

    // Server'da istatistikleri hesapla — client'a sadece sayılar gider
    const stats = {
        total: allCodes.length,
        P: allCodes.filter(c => c.type === 'P').length,
        B: allCodes.filter(c => c.type === 'B').length,
        C: allCodes.filter(c => c.type === 'C').length,
        U: allCodes.filter(c => c.type === 'U').length,
    };

    // İlk 30 kodu server'da hazırla — client bundle'a sadece bu küçük parça gider
    const initialCodes = allCodes.slice(0, 30);

    // Marka listesi
    const brands = Object.keys(carModelsData).sort().slice(0, 15);

    // JSON-LD: FAQPage — server-side render (Googlebot için)
    const faqSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "FAQPage",
                "mainEntity": allCodes.slice(0, 20).map(code => ({
                    "@type": "Question",
                    "name": `${code.code} Arıza Kodu Nedir?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `${code.title}. ${code.description}`
                    }
                }))
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://otosoz.com" },
                    { "@type": "ListItem", position: 2, name: "OBD Arıza Kodları", item: "https://otosoz.com/obd" },
                ]
            },
            {
                "@type": "CollectionPage",
                "name": "OBD Arıza Kodları Veritabanı",
                "description": `${stats.total.toLocaleString('tr-TR')}+ OBD-II arıza kodlarının Türkçe açıklamaları`,
                "url": "https://otosoz.com/obd",
                "isPartOf": { "@type": "WebSite", "name": "OtoSöz", "url": "https://otosoz.com" },
            },
        ]
    };

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Sub Header */}
                <div style={{
                    background: 'var(--overlay-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '16px 24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>OBD Veritabanı</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <OBDListClient
                    initialCodes={initialCodes}
                    totalCount={stats.total}
                    stats={stats}
                    brands={brands}
                />
            </main>

            <Footer />
        </div>
    );
}
