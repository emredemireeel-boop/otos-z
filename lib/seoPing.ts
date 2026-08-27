/**
 * Yeni veya güncellenen içerikten sonra keşif yüzeylerini yeniler.
 *
 * Google Indexing API genel web sayfalarını desteklemez. Bu yardımcı dışarıya
 * yapay bir "indeksleme" isteği göndermek yerine canonical sayfayı, sitemap'i
 * ve son içerik akışını sunucuda yeniden üretir.
 */

/**
 * @param path Site içi canonical yol (örn. /forum/baslik--12345678)
 */
export async function refreshSeoDiscovery(path: string): Promise<boolean> {
    try {
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            return false;
        }

        const response = await fetch('/api/seo/ping', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path }),
            keepalive: true,
        });

        return response.ok;
    } catch {
        // Keşif yenilemesi ana içerik kaydını hiçbir zaman engellememeli.
        return false;
    }
}

// Mevcut servislerin geriye dönük uyumluluğu için eski isim korunuyor.
export const pingGoogle = refreshSeoDiscovery;

export async function refreshSeoDiscoveryBatch(paths: string[]): Promise<void> {
    for (const path of paths) {
        await refreshSeoDiscovery(path);
    }
}

export const pingGoogleBatch = refreshSeoDiscoveryBatch;