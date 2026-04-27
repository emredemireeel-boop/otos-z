import { notFound } from "next/navigation";
import { Metadata } from "next";
import MakaleDetailClient from "./MakaleDetailClient";
import path from "path";
import fs from "fs";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const parts = slug.split('--');
    const id = parts[parts.length - 1];

    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'library_guides.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        const article = data.guides.find((g: any) => g.urlId.toString() === id);

        if (!article) return { title: 'Makale Bulunamadı | OtoSöz' };

        const ogUrl = `/api/og?title=${encodeURIComponent(article.title)}&desc=${encodeURIComponent(article.description.slice(0, 160))}`;

        return {
            title: `${article.title} | OtoSöz Makaleler`,
            description: article.description,
            keywords: article.tags,
            openGraph: {
                title: article.title,
                description: article.description,
                type: 'article',
                url: `https://www.otosoz.com/makale/${slug}`,
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
                canonical: `https://www.otosoz.com/makale/${slug}`,
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
        const filePath = path.join(process.cwd(), 'public', 'data', 'library_guides.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        article = data.guides.find((g: any) => g.urlId.toString() === id);
    } catch (error) {
        console.error("Error reading guides data", error);
    }

    if (!article) {
        notFound();
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.description,
        "author": {
            "@type": "Person",
            "name": article.author || "OtoSöz Uzmanları"
        },
        "url": `https://www.otosoz.com/makale/${slug}`,
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
                "name": "Makaleler",
                "item": "https://www.otosoz.com/kutuphane?kategori=makaleler"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": article.title,
                "item": `https://www.otosoz.com/makale/${slug}`
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
