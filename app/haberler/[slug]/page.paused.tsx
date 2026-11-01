import {createPageMetadata} from '@/lib/seo';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import {schemaJson, schemaGraph, newsArticle, breadcrumb} from '@/lib/schema';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HaberDetailClient from './HaberDetailClient';
import path from 'path';
import fs from 'fs';
import { isQualityGuide } from '@/lib/guide-quality';
import { indexabilityRobots } from '@/lib/indexability';

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
        return createPageMetadata({
        title: 'Haber Bulunamadı | OtoSöz Haberler',
        index: false
    });
    }

    const canonicalUrl = `https://otosoz.com/haberler/${slug}`;
    const description = String(post.description || '').slice(0, 160);
    const ogUrl = `/api/og?title=${encodeURIComponent(post.title)}&desc=${encodeURIComponent(description)}`;

    return createPageMetadata({
        title: `${post.title} | OtoSöz Haberler`,
        description,
        path: canonicalUrl,
        index: isQualityGuide(post, 'news'),
        type: 'article',
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt || post.createdAt
    });
}

export default async function HaberDetailServerPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPost(slug);
    if (!post) notFound();
    const url=`https://otosoz.com/haberler/${slug}`;
    const nodes=[breadcrumb([{name:'Ana Sayfa',url:'https://otosoz.com/'},{name:'Haberler',url:'https://otosoz.com/haberler'},{name:post.title,url}],url),...(isQualityGuide(post,'news')?[newsArticle({url,headline:post.title,description:post.description,datePublished:post.createdAt,dateModified:post.updatedAt||post.createdAt})]:[])];
    return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:schemaJson(schemaGraph(nodes))}}/><HaberDetailClient breadcrumbs={<PageBreadcrumbs url={url}/>} slug={slug} initialPost={post} indexable={isQualityGuide(post, 'news')}/></>;
}
