import { Metadata } from "next";
import HaberDetailClient from "./HaberDetailClient";
import path from "path";
import fs from "fs";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'news_posts.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        const post = data.posts?.find((p: any) => p.slug === slug);

        if (!post) {
            return {
                title: 'Haber Bulunamadı | OtoSöz Haberler',
            };
        }

        const ogUrl = `/api/og?title=${encodeURIComponent(post.title)}&desc=${encodeURIComponent(post.description.slice(0, 160))}`;

        return {
            title: `${post.title} | OtoSöz Haberler`,
            description: post.description,
            keywords: post.tags,
            openGraph: {
                title: post.title,
                description: post.description,
                type: 'article',
                url: `https://www.otosoz.com/haberler/${slug}`,
                images: [
                    {
                        url: ogUrl, // Can also use post.image if we want the actual image instead of the generic card
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    }
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.description,
                images: [ogUrl],
            },
            alternates: {
                canonical: `https://www.otosoz.com/haberler/${slug}`,
            },
        };
    } catch (error) {
        return {
            title: 'Hata | OtoSöz Haberler',
        };
    }
}

export default async function HaberDetailServerPage({ params }: PageProps) {
    const resolvedParams = await params;
    return <HaberDetailClient slug={resolvedParams.slug} />;
}
