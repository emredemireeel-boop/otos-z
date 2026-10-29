import {createPageMetadata} from '@/lib/seo';
import {breadcrumb as buildSchemaBreadcrumbList,article as buildSchemaArticle} from '@/lib/schema';
import {schemaJson} from '@/lib/schema';
import { isQualityGuide } from '@/lib/guide-quality';
import { indexabilityRobots } from '@/lib/indexability';
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

        if (!light) return createPageMetadata({
        title: 'Gösterge Bulunamadı | OtoSöz'
    });

        const ogUrl = `/api/og?title=${encodeURIComponent(light.title + ' İkaz Lambası')}&desc=${encodeURIComponent(light.meaning.slice(0, 160))}`;

        return createPageMetadata({
        title: `${light.title} İkaz Lambası Anlamı | OtoSöz`,
        description: light.meaning,
        path: `https://otosoz.com/gosterge/${slug}`,
        index: isQualityGuide(light, 'warningLight')
    });
    } catch (error) {
        return createPageMetadata({
        title: 'Hata | OtoSöz'
    });
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

    const structuredData = buildSchemaArticle({"@context": "https://schema.org",
"headline": `${light.title} İkaz Lambası`,
"description": light.meaning,
"url": `https://otosoz.com/gosterge/${slug}`,
"publisher": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": "https://otosoz.com"
        }});

    const breadcrumbSchema = buildSchemaBreadcrumbList({"@context": "https://schema.org",
"itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Ana Sayfa",
                "item": "https://otosoz.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Gösterge Işıkları",
                "item": "https://otosoz.com/kutuphane/kategori/gosterge-isiklari"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": light.title,
                "item": `https://otosoz.com/gosterge/${slug}`
            }
        ]});

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaJson(isQualityGuide(light, 'warningLight') ? [structuredData, breadcrumbSchema] : [breadcrumbSchema]) }}
            />
            <GostergeDetailClient light={light} />
        </>
    );
}
