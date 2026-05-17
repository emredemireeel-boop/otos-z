import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

/**
 * 🚀 Google Instant Indexing API (Anında İndeksleme)
 * Kullanım: POST /api/seo/ping { url: "https://www.otosoz.com/...", secret: "..." }
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, secret } = body;

        // Basit bir güvenlik: Sadece bizim sistemimiz bu API'yi tetikleyebilir
        const validSecret = process.env.SEO_PING_SECRET || 'OtoSozSecretPing2026';
        if (secret !== validSecret) {
            return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
        }

        if (!url || !url.startsWith('https://www.otosoz.com')) {
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

        // Google'a anında "URL_UPDATED" (Yeni sayfa veya güncellenmiş sayfa) bildirimi gönder
        const res = await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: 'URL_UPDATED',
            },
        });

        console.log(`✅ SEO Ping Başarılı: ${url}`, res.data);
        return NextResponse.json({ success: true, data: res.data });

    } catch (error: any) {
        console.error('❌ SEO Ping Hatası:', error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
