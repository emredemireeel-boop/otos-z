import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.otosoz.com';
    const now = new Date().toISOString();

    // Ana sayfalar - yüksek öncelik
    const mainPages = [
        { url: baseUrl, lastModified: now, changeFrequency: 'daily' as const, priority: 1.0 },
        { url: `${baseUrl}/forum`, lastModified: now, changeFrequency: 'hourly' as const, priority: 0.9 },
        { url: `${baseUrl}/pazar`, lastModified: now, changeFrequency: 'hourly' as const, priority: 0.9 },
        { url: `${baseUrl}/uzmana-sor`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
        { url: `${baseUrl}/karsilastirma`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
        { url: `${baseUrl}/arac-dna`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    ];

    // İçerik sayfaları - orta öncelik
    const contentPages = [
        { url: `${baseUrl}/kutuphane`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
        { url: `${baseUrl}/piyasalar`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7 },
        { url: `${baseUrl}/anket`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7 },
        { url: `${baseUrl}/etkinlikler`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.6 },
        { url: `${baseUrl}/ajanda`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.6 },
        { url: `${baseUrl}/guvenmetre`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.6 },
        { url: `${baseUrl}/obd`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${baseUrl}/yakit-hesaplama`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${baseUrl}/para-kazan`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.5 },
        { url: `${baseUrl}/premium`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 },
    ];

    // Bilgi sayfaları - düşük öncelik
    const infoPages = [
        { url: `${baseUrl}/hakkimizda`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${baseUrl}/iletisim`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${baseUrl}/gizlilik-politikasi`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
        { url: `${baseUrl}/kullanim-sartlari`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    ];

    return [...mainPages, ...contentPages, ...infoPages];
}
