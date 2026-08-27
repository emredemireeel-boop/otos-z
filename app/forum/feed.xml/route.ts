import { NextResponse } from 'next/server';
import { getAdminDb, initError } from '@/lib/firebaseAdmin';
import { createSeoSlug } from '@/lib/slug';
import { plainTextExcerpt } from '@/lib/forumSeoServer';

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

function timestampToDate(value: any): Date | null {
    if (!value) return null;
    if (typeof value.toDate === 'function') return value.toDate();
    if (typeof value.seconds === 'number') return new Date(value.seconds * 1000);
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function GET() {
    const items: string[] = [];
    let lastBuildDate = new Date();

    if (!initError) {
        try {
            const db = getAdminDb();
            let snapshot: FirebaseFirestore.QuerySnapshot;
            try {
                snapshot = await db.collection('threads').orderBy('lastEntryAt', 'desc').limit(100).get();
            } catch {
                snapshot = await db.collection('threads').orderBy('createdAt', 'desc').limit(100).get();
            }

            snapshot.docs.forEach((doc, index) => {
                const data = doc.data();
                const title = String(data.title || '').trim();
                if (title.length < 5 || data.deleted === true || data.hidden === true) return;

                const slug = data.urlId ? `${createSeoSlug(title)}--${data.urlId}` : doc.id;
                const link = `${BASE_URL}/forum/${slug}`;
                const published = timestampToDate(data.lastEntryAt) || timestampToDate(data.createdAt) || new Date();
                if (index === 0) lastBuildDate = published;
                const description = plainTextExcerpt(String(data.seoExcerpt || data.description || title), 240);

                items.push([
                    '<item>',
                    `<title>${escapeXml(title)}</title>`,
                    `<link>${escapeXml(link)}</link>`,
                    `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
                    `<pubDate>${published.toUTCString()}</pubDate>`,
                    `<description>${escapeXml(description)}</description>`,
                    '</item>',
                ].join(''));
            });
        } catch (error) {
            console.error('Forum RSS feed error:', error);
        }
    }

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