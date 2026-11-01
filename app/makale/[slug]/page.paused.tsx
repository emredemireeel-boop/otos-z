import ContentConnections from '@/components/ContentConnections';
import {createPageMetadata} from '@/lib/seo';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import {breadcrumb as buildSchemaBreadcrumbList,article as buildSchemaArticle} from '@/lib/schema';
import {schemaJson} from '@/lib/schema';
import { notFound } from "next/navigation";
import { Metadata } from "next";
import MakaleDetailClient from "./MakaleDetailClient";
import path from "path";
import fs from "fs";
import { createSeoSlug } from "@/lib/slug";
import { isQualityGuide } from '@/lib/guide-quality';
import { indexabilityRobots } from '@/lib/indexability';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

function getGuides(): any[] {
    const filePath = path.join(process.cwd(), 'public', 'data', 'library_guides.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents).guides || [];
}

function findArticle(guides: any[], routeId: string) {
    return guides.find((guide: any) => (
        String(guide.urlId || '') === routeId || String(guide.id) === routeId
    ));
}

function getCanonicalSlug(article: any): string {
    return `${createSeoSlug(article.title)}--${article.urlId || article.id}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const parts = slug.split('--');
    const id = parts[parts.length - 1];

    try {
        const article = findArticle(getGuides(), id);

        if (!article) return createPageMetadata({
        title: 'Makale Bulunamadı | OtoSöz'
    });

        const canonicalSlug = getCanonicalSlug(article);
        const canonicalUrl = `https://otosoz.com/makale/${canonicalSlug}`;
        const ogUrl = `/api/og?title=${encodeURIComponent(article.title)}&desc=${encodeURIComponent(article.description.slice(0, 160))}`;

        return createPageMetadata({
        title: `${article.title} | OtoSöz Makaleler`,
        description: article.description,
        path: canonicalUrl,
        index: isQualityGuide(article, 'article'),
        type: 'article', publishedTime: article.createdAt, modifiedTime: article.updatedAt || article.lastReviewed
    });
    } catch (error) {
        return createPageMetadata({
        title: 'Hata | OtoSöz'
    });
    }
}

export default async function MakalePage({ params }: PageProps) {
    const { slug } = await params;
    const parts = slug.split('--');
    const id = parts[parts.length - 1];

    let article = null;
    try {
        article = findArticle(getGuides(), id);
    } catch (error) {
        console.error("Error reading guides data", error);
    }

    if (!article) {
        notFound();
    }

    const canonicalSlug = getCanonicalSlug(article);

    const canonicalUrl = `https://otosoz.com/makale/${canonicalSlug}`;

    const structuredData = buildSchemaArticle({"@context": "https://schema.org",
"headline": article.title,
"description": article.description,
"author": {
            "@type": "Organization",
            "@id": "https://otosoz.com/#organization",
            "name": "OtoSöz"
        },
"url": canonicalUrl,
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
                "name": "Makaleler",
                "item": "https://otosoz.com/makale"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": article.title,
                "item": canonicalUrl
            }
        ]});

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaJson(isQualityGuide(article, 'article') ? [structuredData, breadcrumbSchema] : [breadcrumbSchema]) }}
            />
            <MakaleDetailClient breadcrumbs={<PageBreadcrumbs url={canonicalUrl}/>} connections={<ContentConnections url={canonicalUrl}/>} article={article} indexable={isQualityGuide(article, 'article')} />
        </>
    );
}
