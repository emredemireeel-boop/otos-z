import {createPageMetadata} from '@/lib/seo';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import {breadcrumb as buildSchemaBreadcrumbList} from '@/lib/schema';
import {schemaJson, article} from '@/lib/schema';
import { isQualityGuide } from '@/lib/guide-quality';
import { indexabilityRobots } from '@/lib/indexability';
import { notFound } from "next/navigation";
import { Metadata } from "next";
import NasilYapilirDetailClient from "./NasilYapilirDetailClient";
import path from "path";
import fs from "fs";

export const dynamic = 'force-dynamic';

const createSlug = (text: string) => {
  const trMap: { [key: string]: string } = {
      'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
      'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
  };
  return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, match => trMap[match] || match)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
};

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const filePath = path.join(process.cwd(), 'data', 'nasil-yapilir.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        let guide = null;
        for (const cat of data.categories) {
            const found = cat.guides.find((g: any) => (g.slug && g.slug === slug) || createSlug(g.title) === slug);
            if (found) {
                guide = found;
                break;
            }
        }

        if (!guide) return createPageMetadata({
        title: 'Rehber Bulunamadı | OtoSöz'
    });

        const ogUrl = `/api/og?title=${encodeURIComponent(guide.title)}&desc=${encodeURIComponent(guide.description.slice(0, 160))}`;

        return createPageMetadata({
        title: `${guide.title} - Nasıl Yapılır? | OtoSöz`,
        description: guide.description,
        path: `https://otosoz.com/nasil-yapilir/${slug}`,
        index: isQualityGuide(guide, 'howto')
    });
    } catch (error) {
        return createPageMetadata({
        title: 'Hata | OtoSöz'
    });
    }
}

export default async function NasilYapilirPage({ params }: PageProps) {
    const { slug } = await params;

    let guide = null;
    let category = null;
    try {
        const filePath = path.join(process.cwd(), 'data', 'nasil-yapilir.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        for (const cat of data.categories) {
            const found = cat.guides.find((g: any) => (g.slug && g.slug === slug) || createSlug(g.title) === slug);
            if (found) {
                guide = found;
                category = cat;
                break;
            }
        }
    } catch (error) {
        console.error("Error reading nasil-yapilir data", error);
    }

    if (!guide) {
        notFound();
    }

    const structuredData = article({url:`https://otosoz.com/nasil-yapilir/${slug}`,headline:guide.title,description:guide.description,datePublished:guide.createdAt,dateModified:guide.updatedAt});

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
                "name": "Kütüphane",
                "item": "https://otosoz.com/kutuphane/kategori/nasil-yapilir"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": guide.title,
                "item": `https://otosoz.com/nasil-yapilir/${slug}`
            }
        ]});

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaJson(isQualityGuide(guide, 'howto') ? [structuredData, breadcrumbSchema] : [breadcrumbSchema]) }}
            />
            <NasilYapilirDetailClient breadcrumbs={<PageBreadcrumbs url={`/nasil-yapilir/${slug}`}/>} guide={guide} category={category} />
        </>
    );
}
