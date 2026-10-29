import { indexabilityRobots, isHubIndexable } from '@/lib/indexability';
import { Metadata } from "next";
import { obdCodes as allCodes, obdSearchCodes, OBD_LAST_REVIEWED, obdDirectoryPageCount, indexableObdCodes } from "@/lib/obd-catalog";
import Link from "next/link";
import carModelsData from "@/data/carmodels.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OBDListClient from "./OBDListClient";


// ── SEO Metadata ──
export const metadata: Metadata = {
    title: "OBD-II Arıza Kodları: Türkçe Sorgulama | OtoSöz",
    description: "3.500'den fazla OBD-II arıza kodunun Türkçe anlamını, belirtilerini, olası nedenlerini ve çözüm adımlarını sorgulayın. P, B, C ve U kodları.",
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
    robots: indexabilityRobots(isHubIndexable('/obd')),
};

export default function ObdPage() {


    // Server'da istatistikleri hesapla — client'a sadece sayılar gider
    const stats = {
        total: allCodes.length,
        P: allCodes.filter(c => c.type === 'P').length,
        B: allCodes.filter(c => c.type === 'B').length,
        C: allCodes.filter(c => c.type === 'C').length,
        U: allCodes.filter(c => c.type === 'U').length,
    };

    const initialCodes = indexableObdCodes.slice(0, 48);

    // Marka listesi
    const brands = Object.keys(carModelsData).sort().slice(0, 15);

    // JSON-LD: Yalnızca sayfada gerçekten görünen koleksiyon ve breadcrumb.
    const collectionSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "name": "OBD Arıza Kodları Veritabanı",
                "description": `${stats.total.toLocaleString('tr-TR')} OBD-II arıza kodunun Türkçe açıklamaları`,
                "url": "https://otosoz.com/obd",
                "inLanguage": "tr-TR",
                "dateModified": OBD_LAST_REVIEWED,
                "isPartOf": { "@type": "WebSite", "name": "OtoSöz", "url": "https://otosoz.com" },
                "mainEntity": {
                    "@type": "ItemList",
                    "numberOfItems": initialCodes.length,
                    "itemListElement": initialCodes.map((code, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "name": `${code.code} — ${code.title}`,
                        "url": `https://otosoz.com/obd/${code.code.toLowerCase()}`
                    }))
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://otosoz.com" },
                    { "@type": "ListItem", position: 2, name: "OBD Arıza Kodları", item: "https://otosoz.com/obd" },
                ]
            },
        ]
    };

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
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
                                <div>
                                    <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px' }}>
                                        OBD-II Arıza Kodları: Türkçe Anlam ve Çözüm Rehberi
                                    </h1>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', maxWidth: '850px' }}>
                                        Aracınızdan okunan P, B, C veya U kodunu arayın; kodun hangi sistemi ilgilendirdiğini, belirtilerini, olası nedenlerini ve güvenli çözüm sırasını inceleyin.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 24px 0' }}>
                    <Link href="/obd-kodlari/1" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        Tam kod dizinini incele →
                    </Link>
                    <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Kod kataloğunu {obdDirectoryPageCount} sayfalık dizinde tarayabilir veya arama kutusundan kodunuzu bulabilirsiniz. Kaynak ve teşhis kapsamı her kodun ayrıntısında belirtilir.</p>
                </section>
                <OBDListClient
                    initialCodes={initialCodes}
                    totalCount={initialCodes.length}
                    stats={stats}
                    brands={brands}
                />

                <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '8px 24px 56px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '18px', padding: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '750', color: 'var(--foreground)', marginBottom: '12px' }}>OBD-II kodu nasıl okunur?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.75', marginBottom: '16px' }}>
                            Kodun ilk harfi arızanın ana ailesini belirtir: P motor ve şanzıman, B gövde ve konfor, C şasi-fren-süspansiyon, U ise araç içi iletişim ağı kodlarıdır. Kod tek başına parça değişimi talimatı değildir; belirti, tesisat ve ölçüm sonuçlarıyla birlikte değerlendirilmelidir.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Link href="/kutuphane/kategori/gosterge-isiklari" style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: '650', textDecoration: 'none' }}>Gösterge ışıkları rehberi →</Link>
                            <Link href="/kutuphane/kategori/nereye-gitmeli" style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: '650', textDecoration: 'none' }}>Hangi ustaya gitmeli? →</Link>
                            <Link href="/uzmana-sor" style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: '650', textDecoration: 'none' }}>Uzmana sor →</Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
