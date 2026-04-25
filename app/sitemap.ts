import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import obdCodes from '@/data/obd-codes.json';
import { dictionaryTerms } from '@/data/dictionary';
import { events } from '@/data/events';
import { vehicleDNAData } from '@/data/vehicle-dna';

interface ObdCode { code: string; }

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.otosoz.com';
    const now = new Date().toISOString();

    // Helper for URL slugs
    const createSlug = (text: string) => {
        const trMap: { [key: string]: string } = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
        };
        return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, match => trMap[match] || match)
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    // ═══════════════════════════════════════════════════════════════
    // 1. ANA SAYFALAR — Yüksek Öncelik
    // ═══════════════════════════════════════════════════════════════
    const mainPages = [
        { url: baseUrl, lastModified: now, changeFrequency: 'daily' as const, priority: 1.0 },
        { url: `${baseUrl}/forum`, lastModified: now, changeFrequency: 'hourly' as const, priority: 0.9 },
        { url: `${baseUrl}/pazar`, lastModified: now, changeFrequency: 'hourly' as const, priority: 0.9 },
        { url: `${baseUrl}/uzmana-sor`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
        { url: `${baseUrl}/karsilastirma`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
        { url: `${baseUrl}/arac-dna`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    ];

    // ═══════════════════════════════════════════════════════════════
    // 2. İÇERİK SAYFALARI — Orta Öncelik
    // ═══════════════════════════════════════════════════════════════
    const contentPages = [
        { url: `${baseUrl}/kutuphane`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
        { url: `${baseUrl}/sozluk`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
        { url: `${baseUrl}/gosterge-paneli`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.75 },
        { url: `${baseUrl}/anket`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7 },
        { url: `${baseUrl}/guvenmetre`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.6 },
        { url: `${baseUrl}/obd`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${baseUrl}/yakit-hesaplama`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${baseUrl}/para-kazan`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.5 },
        { url: `${baseUrl}/premium`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 },
    ];

    // ═══════════════════════════════════════════════════════════════
    // 3. PİYASALAR — Marka & Model Endeksleri
    // ═══════════════════════════════════════════════════════════════
    const piyasalarPages = [
        { url: `${baseUrl}/piyasalar`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.85 },
    ];

    // ═══════════════════════════════════════════════════════════════
    // 4. ETKİNLİKLER — Oto Pazarları ve Etkinlik Detayları
    // ═══════════════════════════════════════════════════════════════
    const etkinliklerPages = [
        { url: `${baseUrl}/etkinlikler`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.75 },
        // Dinamik etkinlik detay sayfaları
        ...events.map(event => ({
            url: `${baseUrl}/etkinlikler/${event.id}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        })),
    ];

    // ═══════════════════════════════════════════════════════════════
    // 5. ARAÇ DNA — Marka Bazlı Analiz Sayfaları
    // ═══════════════════════════════════════════════════════════════
    // Benzersiz marka slug'ları
    const uniqueBrands = [...new Set(vehicleDNAData.map(v => v.brand))];
    const aracDnaPages = uniqueBrands.map(brand => ({
        url: `${baseUrl}/arac-dna/${brand.toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Marka + Model detay sayfaları (her araç DNA analizi)
    const aracDnaModelPages = vehicleDNAData.map(vehicle => ({
        url: `${baseUrl}/arac-dna/${vehicle.brand.toLowerCase().replace(/\s+/g, '-')}/${vehicle.model.toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.65,
    }));

    // ═══════════════════════════════════════════════════════════════
    // 6. KÜTÜPHANE ALT BÖLÜMLERİ
    // ═══════════════════════════════════════════════════════════════
    const kutuphaneSections = [
        { slug: 'otomotiv-sozluk', priority: 0.85 },
        { slug: 'obd-ariza-kodlari', priority: 0.85 },
        { slug: 'gosterge-isiklari', priority: 0.85 },
        { slug: 'trafik-cezalari', priority: 0.9 },
        { slug: 'lastik-rehberi', priority: 0.7 },
        { slug: 'ikinci-el-rehberi', priority: 0.8 },
        { slug: 'kaza-ilkyardim', priority: 0.75 },
        { slug: 'mevsimsel-bakim', priority: 0.7 },
        { slug: 'sigorta-rehberi', priority: 0.7 },
        { slug: 'ilginc-bilgiler', priority: 0.6 },
        { slug: 'makaleler', priority: 0.7 },
    ].map(s => ({
        url: `${baseUrl}/kutuphane?kategori=${s.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: s.priority,
    }));

    // ═══════════════════════════════════════════════════════════════
    // 7. OBD ARIZA KODLARI — Long-tail SEO
    // ═══════════════════════════════════════════════════════════════
    const obdPages = (obdCodes as ObdCode[]).map(code => ({
        url: `${baseUrl}/obd/${code.code.toLowerCase()}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
    }));

    // ═══════════════════════════════════════════════════════════════
    // 8. SÖZLÜK TERİMLERİ — Long-tail SEO
    // ═══════════════════════════════════════════════════════════════
    const sozlukPages = dictionaryTerms.map(term => ({
        url: `${baseUrl}/sozluk/${term.id}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // ═══════════════════════════════════════════════════════════════
    // 9. GÖSTERGELER, MAKALELER & OTOYOL ÜCRETLERİ — Dinamik İçerik
    // ═══════════════════════════════════════════════════════════════
    let gostergePages: any[] = [];
    let makalePages: any[] = [];
    let otoyolPages: any[] = [];
    try {
        const faultLightsPath = path.join(process.cwd(), 'data', 'fault_lights.json');
        const faultLightsData = JSON.parse(fs.readFileSync(faultLightsPath, 'utf8'));
        gostergePages = faultLightsData.warningLights.map((light: any) => ({
            url: `${baseUrl}/gosterge/${createSlug(light.title)}--${light.urlId}`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

        const guidesPath = path.join(process.cwd(), 'public', 'data', 'library_guides.json');
        const guidesData = JSON.parse(fs.readFileSync(guidesPath, 'utf8'));
        makalePages = guidesData.guides.map((guide: any) => ({
            url: `${baseUrl}/makale/${createSlug(guide.title)}--${guide.urlId}`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

        const otoyolPath = path.join(process.cwd(), 'public', 'data', 'otoyol_ucretleri.json');
        if (fs.existsSync(otoyolPath)) {
            const otoyolData = JSON.parse(fs.readFileSync(otoyolPath, 'utf8'));
            otoyolPages = otoyolData.map((item: any) => ({
                url: `${baseUrl}/kutuphane/otoyol-ucretleri/${item.id}`,
                lastModified: now,
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));
        }
    } catch (e) {
        console.error("Error generating sitemap for dynamic pages", e);
    }

    // ═══════════════════════════════════════════════════════════════
    // 10. BİLGİ SAYFALARI — Düşük Öncelik
    // ═══════════════════════════════════════════════════════════════
    const infoPages = [
        { url: `${baseUrl}/hakkimizda`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${baseUrl}/iletisim`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.4 },
        { url: `${baseUrl}/ajanda`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.5 },
        { url: `${baseUrl}/gizlilik-politikasi`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
        { url: `${baseUrl}/kullanim-sartlari`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    ];

    return [
        ...mainPages,
        ...contentPages,
        ...piyasalarPages,
        ...etkinliklerPages,
        ...aracDnaPages,
        ...aracDnaModelPages,
        ...kutuphaneSections,
        ...obdPages,
        ...sozlukPages,
        ...gostergePages,
        ...makalePages,
        ...otoyolPages,
        ...infoPages,
    ];
}
