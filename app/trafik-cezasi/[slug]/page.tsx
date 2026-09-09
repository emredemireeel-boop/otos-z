import { notFound } from "next/navigation";
import { Metadata } from "next";
import TrafikCezasiDetailClient from "./TrafikCezasiDetailClient";
import path from "path";
import fs from "fs";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const BASE_URL = "https://otosoz.com";
const LAST_REVIEWED = "2026-09-09T00:00:00+03:00";
const OFFICIAL_SOURCE_URL = "https://resmigazete.gov.tr/27.02.2026";

export const dynamicParams = false;

function getAllCezalar() {
    const filePath = path.join(process.cwd(), 'data', 'trafik_cezalari.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}

function compactTitle(item: any): string {
    const topic = String(item.ihlal || "Trafik").split(" (")[0].trim();
    const descriptiveTitle = `${topic} Cezası 2026 | OtoSöz`;

    if (descriptiveTitle.length <= 65) return descriptiveTitle;
    return `Madde ${item.madde} Trafik Cezası 2026: ${item.ceza} | OtoSöz`;
}

function compactDescription(item: any): string {
    const topic = String(item.ihlal || "trafik ihlali").toLocaleLowerCase("tr-TR");
    const text = `2026 ${topic} cezası: ${item.ceza}. Ehliyet yaptırımı: ${item.ehliyet}; araç men durumu: ${item.arac}. Madde ${item.madde}, erken ödeme ve itiraz bilgileri.`;
    return text.length <= 160 ? text : `${text.slice(0, 157).trimEnd()}…`;
}

export async function generateStaticParams() {
    try {
        const data = getAllCezalar();
        const params: { slug: string }[] = [];
        for (const cat of data.categories) {
            for (const row of cat.rows) {
                params.push({ slug: row.slug });
            }
        }
        return params;
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const data = getAllCezalar();

        let cezaItem = null;
        for (const category of data.categories) {
            const found = category.rows.find((r: any) => r.slug === slug);
            if (found) {
                cezaItem = found;
                break;
            }
        }

        if (!cezaItem) {
            return {
                title: "Trafik Cezası Bulunamadı | OtoSöz",
                robots: { index: false, follow: false },
            };
        }

        const title = compactTitle(cezaItem);
        const description = compactDescription(cezaItem);
        const canonicalUrl = `${BASE_URL}/trafik-cezasi/${slug}`;
        const ogImage = `${BASE_URL}/api/og?title=${encodeURIComponent(`${cezaItem.ihlal} Cezası 2026`)}&desc=${encodeURIComponent(`${cezaItem.ceza} · Madde ${cezaItem.madde}`)}`;

        return {
            title,
            description,
            keywords: [...(cezaItem.tags || []), "trafik cezası 2026", "güncel trafik cezaları", cezaItem.kanunMaddesi].filter(Boolean),
            openGraph: {
                title,
                description,
                type: 'article',
                url: canonicalUrl,
                siteName: 'OtoSöz',
                publishedTime: "2026-04-25T10:26:05+03:00",
                modifiedTime: LAST_REVIEWED,
                images: [{ url: ogImage, width: 1200, height: 630, alt: `${cezaItem.ihlal} cezası 2026` }],
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [ogImage],
            },
            alternates: {
                canonical: canonicalUrl,
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
    } catch {
        return {
            title: "Trafik Cezası Bulunamadı | OtoSöz",
            robots: { index: false, follow: false },
        };
    }
}

export default async function TrafikCezasiPage({ params }: PageProps) {
    const { slug } = await params;

    let cezaItem = null;
    let kategori = "";
    let ilgiliCezalar: any[] = [];

    try {
        const data = getAllCezalar();

        for (const cat of data.categories) {
            const found = cat.rows.find((r: any) => r.slug === slug);
            if (found) {
                cezaItem = found;
                kategori = cat.kategori;
                // Aynı kategorideki diğer cezaları al (ilgili cezalar)
                ilgiliCezalar = cat.rows
                    .filter((r: any) => r.slug !== slug)
                    .slice(0, 4)
                    .map((r: any) => ({ ihlal: r.ihlal, ceza: r.ceza, slug: r.slug, madde: r.madde }));
                break;
            }
        }
    } catch (error) {
        console.error("Error reading trafik cezalari data", error);
    }

    if (!cezaItem) {
        notFound();
    }

    // Article Schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${cezaItem.ihlal} Cezası - Madde ${cezaItem.madde}`,
        "description": cezaItem.detayliAciklama || cezaItem.description,
        "url": `${BASE_URL}/trafik-cezasi/${slug}`,
        "datePublished": "2026-04-25T10:26:05+03:00",
        "dateModified": LAST_REVIEWED,
        "author": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": BASE_URL
        },
        "publisher": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": BASE_URL,
            "logo": {
                "@type": "ImageObject",
                "url": `${BASE_URL}/whitemode_logo.svg`,
                "width": 512,
                "height": 512
            }
        },
        "citation": {
            "@type": "Legislation",
            "name": "7574 sayılı Karayolları Trafik Kanununda Değişiklik Yapılmasına Dair Kanun",
            "url": OFFICIAL_SOURCE_URL
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${BASE_URL}/trafik-cezasi/${slug}`
        }
    };

    // FAQ Schema
    const faqSchema = cezaItem.faq && cezaItem.faq.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": cezaItem.faq.map((f: any) => ({
            "@type": "Question",
            "name": f.soru,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.cevap
            }
        }))
    } : null;

    // BreadcrumbList Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Ana Sayfa",
                "item": BASE_URL
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Kütüphane",
                "item": `${BASE_URL}/kutuphane`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Trafik Cezaları",
                "item": `${BASE_URL}/trafik-cezasi`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": cezaItem.ihlal,
                "item": `${BASE_URL}/trafik-cezasi/${slug}`
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <TrafikCezasiDetailClient cezaItem={cezaItem} kategori={kategori} ilgiliCezalar={ilgiliCezalar} />
        </>
    );
}
