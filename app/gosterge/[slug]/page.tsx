import { notFound } from "next/navigation";
import { Metadata } from "next";
import GostergeDetailClient from "./GostergeDetailClient";
import path from "path";
import fs from "fs";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const parts = slug.split('--');
    const id = parts[parts.length - 1];

    try {
        const filePath = path.join(process.cwd(), 'data', 'fault_lights.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        const light = data.warningLights.find((g: any) => g.urlId.toString() === id);

        if (!light) return { title: 'Gösterge Bulunamadı | OtoSöz' };

        const ogUrl = `/api/og?title=${encodeURIComponent(light.title + ' İkaz Lambası')}&desc=${encodeURIComponent(light.meaning.slice(0, 160))}`;

        return {
            title: `${light.title} İkaz Lambası Anlamı | OtoSöz`,
            description: light.meaning,
            keywords: light.tags,
            openGraph: {
                title: `${light.title} İkaz Lambası`,
                description: light.meaning,
                type: 'article',
                url: `https://www.otosoz.com/gosterge/${slug}`,
                images: [
                    {
                        url: ogUrl,
                        width: 1200,
                        height: 630,
                        alt: `${light.title} İkaz Lambası`,
                    }
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${light.title} İkaz Lambası`,
                description: light.meaning,
                images: [ogUrl],
            },
            alternates: {
                canonical: `https://www.otosoz.com/gosterge/${slug}`,
            },
        };
    } catch (error) {
        return { title: 'Hata | OtoSöz' };
    }
}

export default async function GostergePage({ params }: PageProps) {
    const { slug } = await params;
    const parts = slug.split('--');
    const id = parts[parts.length - 1];

    let light = null;
    try {
        const filePath = path.join(process.cwd(), 'data', 'fault_lights.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        light = data.warningLights.find((g: any) => g.urlId.toString() === id);
    } catch (error) {
        console.error("Error reading fault lights data", error);
    }

    if (!light) {
        notFound();
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${light.title} İkaz Lambası`,
        "description": light.meaning,
        "url": `https://www.otosoz.com/gosterge/${slug}`,
        "publisher": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": "https://www.otosoz.com"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Ana Sayfa",
                "item": "https://www.otosoz.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Gösterge Işıkları",
                "item": "https://www.otosoz.com/kutuphane?kategori=gosterge-isiklari"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": light.title,
                "item": `https://www.otosoz.com/gosterge/${slug}`
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([structuredData, breadcrumbSchema]) }}
            />
            <GostergeDetailClient light={light} />
        </>
    );
}
