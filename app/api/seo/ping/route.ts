import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';

/**
 * 🚀 Google Instant Indexing API (Anında İndeksleme)
 * Kullanım: POST /api/seo/ping { url: "https://www.otosoz.com/..." }
 *
 * ✅ GÜVENLİK: İki koruma katmanı:
 *   1) Same-origin kontrolü (yalnızca kendi sitemizden gelen istekler) VEYA
 *      sunucudan-sunucuya çağrılar için SEO_PING_SECRET header'ı.
 *   2) IP bazlı rate limit (kötüye kullanım / DoS önleme).
 * İstemci tarafında artık secret tutulmuyor.
 */
export async function POST(request: Request) {
    // ── Rate limit (saatte 60 ping yeterli) ──
    const ip = getClientIP(request);
    const rl = checkRateLimit(`seo-ping:${ip}`, { windowMs: 60 * 60_000, maxRequests: 60 });
    if (!rl.allowed) {
        return NextResponse.json(
            { success: false, error: 'Çok fazla istek.' },
            { status: 429 }
        );
    }

    try {
        const body = await request.json();
        const { url } = body;

        // ── Erişim kontrolü ──
        // a) Same-origin: tarayıcıdan gelen isteklerin Origin'i kendi sitemiz olmalı
        // b) Server-to-server: SEO_PING_SECRET header'ı (opsiyonel, env tanımlıysa)
        const origin = request.headers.get('origin') || '';
        const allowedOrigins = ['https://www.otosoz.com', 'https://otosoz.com'];
        const isSameOrigin = allowedOrigins.includes(origin);

        const envSecret = process.env.SEO_PING_SECRET;
        const headerSecret = request.headers.get('x-seo-secret');
        const hasValidSecret = !!envSecret && headerSecret === envSecret;

        if (!isSameOrigin && !hasValidSecret) {
            return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
        }

        if (!url || typeof url !== 'string' || !url.startsWith('https://www.otosoz.com')) {
            return NextResponse.json({ success: false, error: 'Geçerli bir OtoSöz URL\'si gereklidir.' }, { status: 400 });
        }

        // Google Indexing API Kimlik Doğrulaması
        const KEY_FILE = 'otosozindex-7a4ca5cb2331.json';
        const keyFilePath = path.join(process.cwd(), KEY_FILE);

        const auth = new google.auth.GoogleAuth({
            keyFile: keyFilePath,
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });

        const client = await auth.getClient();
        const indexing = google.indexing({ version: 'v3', auth: client as any });

        const res = await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: 'URL_UPDATED',
            },
        });

        return NextResponse.json({ success: true, data: res.data });

    } catch (error: any) {
        console.error('❌ SEO Ping Hatası:', error?.message);
        return NextResponse.json({ success: false, error: 'İndeksleme bildirimi başarısız.' }, { status: 500 });
    }
}
