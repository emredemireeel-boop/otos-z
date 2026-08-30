import { notFound, permanentRedirect } from "next/navigation";
import { Metadata } from "next";
import MakaleDetailClient from "./MakaleDetailClient";
import path from "path";
import fs from "fs";
import { createSeoSlug } from "@/lib/slug";

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

        if (!article) return { title: 'Makale Bulunamadı | OtoSöz' };

        const canonicalSlug = getCanonicalSlug(article);
        const canonicalUrl = `https://otosoz.com/makale/${canonicalSlug}`;
        const ogUrl = `/api/og?title=${encodeURIComponent(article.title)}&desc=${encodeURIComponent(article.description.slice(0, 160))}`;

        return {
            title: `${article.title} | OtoSöz Makaleler`,
            description: article.description,
            keywords: article.tags,
            openGraph: {
                title: article.title,
                description: article.description,
                type: 'article',
                url: canonicalUrl,
                images: [
                    {
                        url: ogUrl,
                        width: 1200,
                        height: 630,
                        alt: article.title,
                    }
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: article.title,
                description: article.description,
                images: [ogUrl],
            },
            alternates: {
                canonical: canonicalUrl,
            },
        };
    } catch (error) {
        return { title: 'Hata | OtoSöz' };
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
    if (slug !== canonicalSlug) {
        permanentRedirect(`/makale/${canonicalSlug}`);
    }

    const canonicalUrl = `https://otosoz.com/makale/${canonicalSlug}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.description,
        "author": {
            "@type": "Person",
            "name": article.author || "OtoSöz Uzmanları"
        },
        "url": canonicalUrl,
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
                "name": "Makaleler",
                "item": "https://otosoz.com/kutuphane"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": article.title,
                "item": canonicalUrl
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([structuredData, breadcrumbSchema]) }}
            />
            <MakaleDetailClient article={article} />
        </>
    );
}
