import {schemaJson} from '@/lib/schema';
import { SUPPORTING_TEMPLATE_INDEXABLE } from '@/lib/indexability';
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BakimRehberiDetailClient from "./BakimRehberiDetailClient";
import path from "path";
import fs from "fs";
import { buildMaintenanceSteps } from "@/lib/maintenanceHowTo";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    
    try {
        const filePath = path.join(process.cwd(), 'data', 'bakim_icerikleri.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        
        const bakimItem = data.bakim_icerikleri.find((r: any) => r.slug === slug);

        if (!bakimItem) return { title: 'Bakım İçeriği Bulunamadı | OtoSöz' };

        return {
            title: `${bakimItem.title} - Ne Zaman Değişir? | OtoSöz Bakım Rehberi`,
            description: bakimItem.description,
            keywords: bakimItem.tags,
            openGraph: {
                title: `${bakimItem.title} Rehberi`,
                description: bakimItem.description,
                type: 'article',
                url: `https://otosoz.com/bakim-rehberi/${slug}`,
            },
            alternates: {
                canonical: `https://otosoz.com/bakim-rehberi/${slug}`,
            },
        };
    } catch (error) {
        return { title: 'Hata | OtoSöz' };
    }
}

export default async function BakimRehberiPage({ params }: PageProps) {
    const { slug } = await params;

    let bakimItem = null;

    try {
        const filePath = path.join(process.cwd(), 'data', 'bakim_icerikleri.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        
        bakimItem = data.bakim_icerikleri.find((r: any) => r.slug === slug);
    } catch (error) {
        console.error("Error reading bakim_icerikleri data", error);
    }

    if (!bakimItem) {
        notFound();
    }

    const maintenanceSteps = buildMaintenanceSteps(bakimItem.title, bakimItem.degisimPeriyodu);
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": bakimItem.title,
        "description": bakimItem.description,
        "url": `https://otosoz.com/bakim-rehberi/${slug}`,
        "publisher": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": "https://otosoz.com"
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
                "item": "https://otosoz.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Bakım Zamanları",
                "item": "https://otosoz.com/kutuphane/kategori/bakim-zamanlari"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": bakimItem.title,
                "item": `https://otosoz.com/bakim-rehberi/${slug}`
            }
        ]
    };

    return (
        <>
            {SUPPORTING_TEMPLATE_INDEXABLE && <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaJson([structuredData, breadcrumbSchema]) }}
            />}
            <BakimRehberiDetailClient bakimItem={bakimItem} />
        </>
    );
}
