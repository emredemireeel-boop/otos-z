import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';

const BASE_URL = 'https://otosoz.com';
const ALLOWED_PREFIXES = ['/forum/', '/sozluk/', '/guvenmetre/'];

/**
 * Yeni kullanıcı içeriğinden sonra sitemap ve keşif akışını yeniler.
 * Bu endpoint Google Indexing API çağırmaz; API yalnızca JobPosting ve canlı
 * yayın sayfaları için desteklendiğinden normal forum URL'lerinde kullanılmaz.
 */
export async function POST(request: Request) {
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(`seo-refresh:${ip}`, {
        windowMs: 60 * 60_000,
        maxRequests: 120,
    });

    if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, error: 'Çok fazla istek.' }, { status: 429 });
    }

    try {
        const origin = request.headers.get('origin') || '';
        const allowedOrigins = new Set([
            BASE_URL,
            'https://www.otosoz.com',
            ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000'] : []),
        ]);
        const envSecret = process.env.SEO_PING_SECRET;
        const hasValidSecret = Boolean(envSecret)
            && request.headers.get('x-seo-secret') === envSecret;

        if (!allowedOrigins.has(origin) && !hasValidSecret) {
            return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
        }

        const body = await request.json();
        const rawPath = typeof body?.path === 'string'
            ? body.path
            : typeof body?.url === 'string'
                ? body.url
                : '';
        const parsed = new URL(rawPath, BASE_URL);

        if (!['otosoz.com', 'www.otosoz.com'].includes(parsed.hostname)) {
            return NextResponse.json({ success: false, error: 'Geçersiz alan adı.' }, { status: 400 });
        }

        const pathname = parsed.pathname.replace(/\/{2,}/g, '/');
        if (!ALLOWED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
            return NextResponse.json({ success: false, error: 'Bu içerik yolu desteklenmiyor.' }, { status: 400 });
        }

        const refreshed = new Set<string>(['/sitemap.xml']);
        refreshed.add(pathname);

        if (pathname.startsWith('/forum/')) {
            refreshed.add('/forum');
            refreshed.add('/forum/feed.xml');
        } else if (pathname.startsWith('/sozluk/')) {
            refreshed.add('/sozluk');
        } else if (pathname.startsWith('/guvenmetre/')) {
            refreshed.add('/guvenmetre');
        }

        for (const target of refreshed) {
            revalidatePath(target);
        }

        return NextResponse.json({ success: true, refreshed: [...refreshed] });
    } catch (error) {
        console.error('SEO discovery refresh error:', error);
        return NextResponse.json({ success: false, error: 'Keşif yüzeyleri yenilenemedi.' }, { status: 500 });
    }
}