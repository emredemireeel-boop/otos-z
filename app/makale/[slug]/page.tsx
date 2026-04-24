import { notFound } from "next/navigation";
import { Metadata } from "next";
import MakaleDetailClient from "./MakaleDetailClient";
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
        const filePath = path.join(process.cwd(), 'public', 'data', 'library_guides.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        const article = data.guides.find((g: any) => g.urlId.toString() === id);

        if (!article) return { title: 'Makale Bulunamadı | OtoSöz' };

        return {
            title: `${article.title} | OtoSöz Makaleler`,
            description: article.description,
            keywords: article.tags,
            openGraph: {
                title: article.title,
                description: article.description,
                type: 'article',
                url: `https://www.otosoz.com/makale/${slug}`,
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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <MakaleDetailClient article={article} />
        </>
    );
}
