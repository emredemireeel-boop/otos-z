import {createPageMetadata} from '@/lib/seo';
import {article as buildSchemaArticle} from '@/lib/schema';
import {schemaJson} from '@/lib/schema';
import { SUPPORTING_TEMPLATE_INDEXABLE } from '@/lib/indexability';
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

        if (!rehberItem) return createPageMetadata({
        title: 'Rehber İçeriği Bulunamadı | OtoSöz'
    });

        return createPageMetadata({
        title: `${rehberItem.title} - İkinci El Oto Ekspertiz Rehberi | OtoSöz`,
        description: rehberItem.description,
        path: `https://otosoz.com/ikinci-el-rehberi/${slug}`
    });
    } catch (error) {
        return createPageMetadata({
        title: 'Hata | OtoSöz'
    });
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

    const structuredData = buildSchemaArticle({"@context": "https://schema.org",
"headline": rehberItem.title,
"description": rehberItem.description,
"url": `https://otosoz.com/ikinci-el-rehberi/${slug}`,
"publisher": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": "https://otosoz.com"
        }});

    return (
        <>
            {SUPPORTING_TEMPLATE_INDEXABLE && <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaJson(structuredData) }}
            />}
            <IkinciElRehberiDetailClient rehberItem={rehberItem} />
        </>
    );
}
