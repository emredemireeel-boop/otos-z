import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HaberDetailClient from './HaberDetailClient';
import path from 'path';
import fs from 'fs';

interface PageProps {
    params: Promise<{ slug: string }>;
}

function getPost(slug: string): any | null {
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'news_posts.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return data.posts?.find((post: any) => post.slug === slug) || null;
    } catch (error) {
        console.error('News post data error:', error);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPost(slug);

    if (!post) {
        return {
            title: 'Haber Bulunamadı | OtoSöz Haberler',
            robots: { index: false, follow: false },
        };
    }

    const canonicalUrl = `https://otosoz.com/haberler/${slug}`;
    const description = String(post.description || '').slice(0, 160);
    const ogUrl = `/api/og?title=${encodeURIComponent(post.title)}&desc=${encodeURIComponent(description)}`;
    const publishedTime = new Date(post.createdAt).toISOString();
    const modifiedTime = new Date(post.updatedAt || post.createdAt).toISOString();

    return {
        title: `${post.title} | OtoSöz Haberler`,
        description,
        keywords: post.tags,
        authors: [{ name: post.author || 'OtoSöz Editör' }],
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: post.title,
            description,
            type: 'article',
            url: canonicalUrl,
            siteName: 'OtoSöz',
            publishedTime,
            modifiedTime,
            authors: [post.author || 'OtoSöz Editör'],
            tags: post.tags || [],
            images: [{ url: ogUrl, width: 1200, height: 630, alt: post.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: [ogUrl],
        },
    };
}

export default async function HaberDetailServerPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPost(slug);
    if (!post) notFound();
    return <HaberDetailClient slug={slug} initialPost={post} />;
}
