/**
 * 🚀 SEO Ping Helper — Google Anında İndeksleme
 * 
 * Yeni içerik oluşturulduğunda arka planda Google'a bildirim gönderir.
 * Bu fonksiyon client-side'da çalışır ve sunucudaki /api/seo/ping endpoint'ine istek atar.
 * Hata durumunda sessizce devam eder (kullanıcı deneyimini etkilemez).
 */

const SEO_PING_SECRET = 'OtoSozSecretPing2026';
const BASE_URL = 'https://www.otosoz.com';

/**
 * Google'a yeni/güncellenen URL bildirimi gönderir.
 * @param path - Site yolu (örn: "/forum/konu-basligi--12345678")
 * @returns Promise<boolean> - Başarılı mı?
 */
export async function pingGoogle(path: string): Promise<boolean> {
    try {
        // Geliştirme ortamında (localhost) API çağrısı yapma
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            console.log(`🔍 [SEO] Dev mode — Google ping atlanıyor: ${path}`);
            return false;
        }

        const fullUrl = path.startsWith('http') ? path : `${BASE_URL}${path}`;

        const res = await fetch('/api/seo/ping', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: fullUrl, secret: SEO_PING_SECRET }),
        });

        if (res.ok) {
            console.log(`✅ [SEO] Google ping başarılı: ${fullUrl}`);
            return true;
        } else {
            console.warn(`⚠️ [SEO] Google ping başarısız (${res.status}): ${fullUrl}`);
            return false;
        }
    } catch (error) {
        // Sessizce devam et — SEO ping başarısız olsa bile kullanıcı deneyimini bozma
        console.warn(`⚠️ [SEO] Ping hatası:`, error);
        return false;
    }
}

/**
 * Birden fazla URL'yi sırayla Google'a bildir.
 * @param paths - URL yolları dizisi
 */
export async function pingGoogleBatch(paths: string[]): Promise<void> {
    for (const path of paths) {
        await pingGoogle(path);
        // Rate limit koruması: 300ms bekle
        await new Promise(r => setTimeout(r, 300));
    }
}
