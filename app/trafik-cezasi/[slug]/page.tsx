import { notFound } from "next/navigation";
import { Metadata } from "next";
import TrafikCezasiDetailClient from "./TrafikCezasiDetailClient";
import path from "path";
import fs from "fs";

interface PageProps {
    params: Promise<{ slug: string }>;
}

function getAllCezalar() {
    const filePath = path.join(process.cwd(), 'data', 'trafik_cezalari.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
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

        if (!cezaItem) return { title: 'Trafik Cezası Bulunamadı | OtoSöz' };

        const title = `${cezaItem.ihlal} Cezası ${cezaItem.ceza} (Madde ${cezaItem.madde}) - 2026 Güncel | OtoSöz`;
        const description = `2026 güncel ${cezaItem.ihlal.toLowerCase()} cezası: ${cezaItem.ceza} para cezası, ${cezaItem.ehliyet} ehliyet yaptırımı. ${cezaItem.kanunMaddesi || ''} kapsamında detaylı bilgi, itiraz süreci ve erken ödeme indirimi.`;

        return {
            title,
            description,
            keywords: [...(cezaItem.tags || []), 'trafik cezası 2026', 'güncel trafik cezaları', cezaItem.kanunMaddesi],
            openGraph: {
                title: `${cezaItem.ihlal} - ${cezaItem.ceza} Trafik Cezası`,
                description,
                type: 'article',
                url: `https://otosoz.com/trafik-cezasi/${slug}`,
                siteName: 'OtoSöz',
            },
            alternates: {
                canonical: `https://otosoz.com/trafik-cezasi/${slug}`,
            },
            robots: {
                index: true,
                follow: true,
            },
        };
    } catch (error) {
        return { title: 'Hata | OtoSöz' };
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
        "url": `https://otosoz.com/trafik-cezasi/${slug}`,
        "datePublished": "2026-01-01T00:00:00+03:00",
        "dateModified": new Date().toISOString(),
        "author": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": "https://otosoz.com"
        },
        "publisher": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": "https://otosoz.com"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://otosoz.com/trafik-cezasi/${slug}`
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
                "item": "https://otosoz.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Kütüphane",
                "item": "https://otosoz.com/kutuphane"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Trafik Cezaları",
                "item": "https://otosoz.com/kutuphane?kategori=trafik-cezalari"
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": cezaItem.ihlal,
                "item": `https://otosoz.com/trafik-cezasi/${slug}`
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
