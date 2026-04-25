import { notFound } from "next/navigation";
import { Metadata } from "next";
import IkinciElRehberiDetailClient from "./IkinciElRehberiDetailClient";
import path from "path";
import fs from "fs";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    
    try {
        const filePath = path.join(process.cwd(), 'data', 'ikinci_el_kontrol.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        
        const rehberItem = data.ikinci_el_icerikleri.find((r: any) => r.slug === slug);

        if (!rehberItem) return { title: 'Rehber İçeriği Bulunamadı | OtoSöz' };

        return {
            title: `${rehberItem.title} - İkinci El Oto Ekspertiz Rehberi | OtoSöz`,
            description: rehberItem.description,
            keywords: rehberItem.tags,
            openGraph: {
                title: `${rehberItem.title} | Araç Alım Rehberi`,
                description: rehberItem.description,
                type: 'article',
                url: `https://www.otosoz.com/ikinci-el-rehberi/${slug}`,
            },
            alternates: {
                canonical: `https://www.otosoz.com/ikinci-el-rehberi/${slug}`,
            },
        };
    } catch (error) {
        return { title: 'Hata | OtoSöz' };
    }
}

export default async function IkinciElRehberiPage({ params }: PageProps) {
    const { slug } = await params;

    let rehberItem = null;

    try {
        const filePath = path.join(process.cwd(), 'data', 'ikinci_el_kontrol.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        
        rehberItem = data.ikinci_el_icerikleri.find((r: any) => r.slug === slug);
    } catch (error) {
        console.error("Error reading ikinci_el_kontrol data", error);
    }

    if (!rehberItem) {
        notFound();
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": rehberItem.title,
        "description": rehberItem.description,
        "url": `https://www.otosoz.com/ikinci-el-rehberi/${slug}`,
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
            <IkinciElRehberiDetailClient rehberItem={rehberItem} />
        </>
    );
}
