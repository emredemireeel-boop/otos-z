import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const revalidate = 900;
const BASE_URL = 'https://otosoz.com';
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function GET() {
    let posts: any[] = [];
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'news_posts.json');
        posts = JSON.parse(fs.readFileSync(filePath, 'utf8')).posts || [];
    } catch (error) {
        console.error('News sitemap data error:', error);
    }

    const now = Date.now();
    const urls = posts
        .filter(post => {
            const publishedAt = new Date(post.createdAt || '').getTime();
            return post.slug
                && post.title
                && Number.isFinite(publishedAt)
                && publishedAt >= now - TWO_DAYS_MS
                && publishedAt <= now + 5 * 60 * 1000;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 1000)
        .map(post => [
            '<url>',
            `<loc>${escapeXml(`${BASE_URL}/haberler/${post.slug}`)}</loc>`,
            '<news:news>',
            '<news:publication>',
            '<news:name>OtoSöz</news:name>',
            '<news:language>tr</news:language>',
            '</news:publication>',
            `<news:publication_date>${new Date(post.createdAt).toISOString()}</news:publication_date>`,
            `<news:title>${escapeXml(String(post.title))}</news:title>`,
            '</news:news>',
            `<lastmod>${new Date(post.updatedAt || post.createdAt).toISOString()}</lastmod>`,
            '</url>',
        ].join(''));

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
        ...urls,
        '</urlset>',
    ].join('');

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
        },
    });
}
