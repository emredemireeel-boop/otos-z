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

        return {
            title: `${light.title} İkaz Lambası Anlamı | OtoSöz`,
            description: light.meaning,
            keywords: light.tags,
            openGraph: {
                title: `${light.title} İkaz Lambası`,
                description: light.meaning,
                type: 'article',
                url: `https://www.otosoz.com/gosterge/${slug}`,
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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <GostergeDetailClient light={light} />
        </>
    );
}
