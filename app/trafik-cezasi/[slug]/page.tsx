import { notFound } from "next/navigation";
import { Metadata } from "next";
import TrafikCezasiDetailClient from "./TrafikCezasiDetailClient";
import path from "path";
import fs from "fs";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    
    // Format is like "hiz-sinirini-asmak-51-2-a" or "hiz-sinirini-asmak--1" 
    // We didn't use double dash in JSON for slugs, we used full slug. We will just find by slug.
    
    try {
        const filePath = path.join(process.cwd(), 'data', 'trafik_cezalari.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        
        let cezaItem = null;
        for (const category of data.categories) {
            const found = category.rows.find((r: any) => r.slug === slug);
            if (found) {
                cezaItem = found;
                break;
            }
        }

        if (!cezaItem) return { title: 'Trafik Cezası Bulunamadı | OtoSöz' };

        return {
            title: `${cezaItem.madde} Trafik Cezası: ${cezaItem.ceza} - ${cezaItem.ihlal} | OtoSöz`,
            description: cezaItem.description,
            keywords: cezaItem.tags,
            openGraph: {
                title: `${cezaItem.madde} Madde Trafik Cezası`,
                description: cezaItem.description,
                type: 'article',
                url: `https://www.otosoz.com/trafik-cezasi/${slug}`,
            },
            alternates: {
                canonical: `https://www.otosoz.com/trafik-cezasi/${slug}`,
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

    try {
        const filePath = path.join(process.cwd(), 'data', 'trafik_cezalari.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        
        for (const cat of data.categories) {
            const found = cat.rows.find((r: any) => r.slug === slug);
            if (found) {
                cezaItem = found;
                kategori = cat.kategori;
                break;
            }
        }
    } catch (error) {
        console.error("Error reading trafik cezalari data", error);
    }

    if (!cezaItem) {
        notFound();
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${cezaItem.madde} Madde Trafik Cezası: ${cezaItem.ihlal}`,
        "description": cezaItem.description,
        "url": `https://www.otosoz.com/trafik-cezasi/${slug}`,
        "publisher": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": "https://www.otosoz.com"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <TrafikCezasiDetailClient cezaItem={cezaItem} kategori={kategori} />
        </>
    );
}
