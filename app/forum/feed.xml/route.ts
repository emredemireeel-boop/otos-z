import { NextResponse } from 'next/server';
import { getRecentForumThreadSummaries, plainTextExcerpt } from '@/lib/forumDataServer';

export const revalidate = 300;
const BASE_URL = 'https://otosoz.com';

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function GET() {
    const threads = await getRecentForumThreadSummaries(100);
    const lastBuildDate = threads[0]?.lastEntryAt || threads[0]?.createdAt
        ? new Date(threads[0].lastEntryAt || threads[0].createdAt || Date.now())
        : new Date();

    const items = threads.map(thread => {
        const link = `${BASE_URL}/forum/${thread.slug}`;
        const published = new Date(thread.lastEntryAt || thread.createdAt || Date.now());
        const description = plainTextExcerpt(thread.description || thread.title, 240);
        return [
            '<item>',
            `<title>${escapeXml(thread.title)}</title>`,
            `<link>${escapeXml(link)}</link>`,
            `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
            `<pubDate>${published.toUTCString()}</pubDate>`,
            `<description>${escapeXml(description)}</description>`,
            '</item>',
        ].join('');
    });

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        '<channel>',
        '<title>OtoSöz Forum - Son Başlıklar</title>',
        `<link>${BASE_URL}/forum</link>`,
        '<description>OtoSöz otomobil topluluğundaki yeni ve güncellenen başlıklar.</description>',
        '<language>tr-TR</language>',
        `<lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>`,
        `<atom:link href="${BASE_URL}/forum/feed.xml" rel="self" type="application/rss+xml" />`,
        ...items,
        '</channel>',
        '</rss>',
    ].join('');

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
    });
}
