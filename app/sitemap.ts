import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { categories, getBrandsForCategory } from '@/data/guvenmetre';
import { getAdminDb, initError } from '@/lib/firebaseAdmin';
import { events } from '@/data/events';

// Sitemap'in 15 dakikada bir yeniden oluşturulması — yeni başlık/entry'ler hızla Google'a gider
export const revalidate = 900;

const BASE_URL = 'https://otosoz.com';

// Slug oluşturma aracı (google-index.js ile aynı standart)
function createSlug(text: string) {
    if (!text) return '';
    const trMap: Record<string, string> = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'ë': 'e',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u', 'Ë': 'e',
    };
    return text.replace(/[çğıöşüëÇĞİÖŞÜË]/g, m => trMap[m] || m)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemapEntries: MetadataRoute.Sitemap = [
        // Ana Hub Sayfaları
        { url: `${BASE_URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/kutuphane`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/forum`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
        { url: `${BASE_URL}/forum?kategori=genel`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/forum?kategori=teknik`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/forum?kategori=deneyim`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/forum?kategori=marka`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/forum?kategori=alim-satim`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/arac-dna`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/otobutce`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/haberler`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/karsilastirma`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/uzmana-sor`, lastModified: new Date(), changeFrequency: 'always', priority: 0.8 },
        { url: `${BASE_URL}/otohesap`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/piyasalar`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/guvenmetre`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/altin-anahtar`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/anket`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/etkinlikler`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/sozluk`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/obd`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/ajanda`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/bakim-rehberi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/ikinci-el-rehberi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/usta-ol`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/uzman-ol`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/hakkimizda`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/iletisim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/gizlilik-politikasi`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/kullanim-sartlari`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ];

    const safeReadFile = (fileName: string) => {
        try {
            const filePath = path.join(process.cwd(), 'data', fileName);
            if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            // public/data klasörünü de dene
            const publicPath = path.join(process.cwd(), 'public', 'data', fileName);
            if (fs.existsSync(publicPath)) return JSON.parse(fs.readFileSync(publicPath, 'utf8'));
        } catch (e) {
            console.error(`Sitemap error for ${fileName}:`, e);
        }
        return null;
    };

    // 1. Araç DNA Markaları, Modelleri ve Kronik Sorun Sayfaları (vehicle-dna'dan dinamik olarak)
    const { vehicleDNAData } = require('@/data/vehicle-dna');
    const { engineDNAData } = require('@/data/engine-dna');
    const { trimLevelsData } = require('@/data/trim-levels');
    const { OTOBUTCE_CATEGORIES } = require('@/data/otobutce-data');
    
    const vehicleList = vehicleDNAData || [];
    const engineList = engineDNAData || [];
    const trimList = trimLevelsData || [];
    
    const uniqueBrands = [...new Set(vehicleList.map((v: any) => v.brand))] as string[];
    // Combined/ortak marka isimlerini filtrele (ör. "Dacia / Renault") — bu slug'lar gerçek marka hub sayfası değil
    const filteredBrands = uniqueBrands.filter(brand => !brand.includes('/'));
    filteredBrands.forEach(brand => {
        sitemapEntries.push({
            url: `${BASE_URL}/arac-dna/${createSlug(brand)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        });
    });


    vehicleList.forEach((vehicle: any) => {
        const brandSlug = createSlug(vehicle.brand);
        const modelSlug = createSlug(vehicle.model);

        // Model detay sayfası
        sitemapEntries.push({
            url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        });

        // Kronik sorunlar sayfası
        sitemapEntries.push({
            url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/kronik-sorunlar`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        });

        // Neden alınır sayfası
        sitemapEntries.push({
            url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/neden-alinir`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        });

        // Kullanıcı deneyimleri sayfası
        sitemapEntries.push({
            url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/kullanici-deneyimleri`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        });
        
        // Donanım paketleri sayfası (Sadece varsa)
        const hasTrim = trimList.find((t: any) => t.brand === vehicle.brand && t.model === vehicle.model);
        if (hasTrim) {
            sitemapEntries.push({
                url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/arac-paketleri`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
        
        // Motor seçenekleri (Sadece varsa)
        const vehicleEngines = engineList.find((e: any) => e.brand === vehicle.brand && e.model === vehicle.model);
        if (vehicleEngines && vehicleEngines.engines) {
            vehicleEngines.engines.forEach((engine: any) => {
                sitemapEntries.push({
                    url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/${createSlug(engine.name)}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });
            });
        }
    });

    if (OTOBUTCE_CATEGORIES) {
        OTOBUTCE_CATEGORIES.forEach((category: any) => {
            sitemapEntries.push({
                url: `${BASE_URL}/otobutce/${category.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        });
    }

    // 2. OBD Arıza Kodları - Marka Hub'ları + Tekil Kodlar
    // Marka hub'larını ve tüm tekil arıza kodlarını sitemap'e ekliyoruz.
    // Canonical URL: /obd/{code} (marksız genel sayfa)
    const carModelsData = safeReadFile('carmodels.json');
    if (carModelsData) {
        Object.keys(carModelsData).forEach(brand => {
            sitemapEntries.push({
                url: `${BASE_URL}/obd/${createSlug(brand)}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });
    }

    // 2b. Tekil OBD Kodları (genel /obd/{code} URL'leri)
    // Crawl budget korumak için: yalnızca generic (standart) kodları ekle, max 500
    const obdCodesData = safeReadFile('obd-codes.json');
    if (obdCodesData && Array.isArray(obdCodesData)) {
        const genericCodes = obdCodesData
            .filter((c: any) => c.isGeneric !== false) // Generic/standart kodları öncelikle al
            .slice(0, 500);
        genericCodes.forEach((code: any) => {
            if (code.code) {
                sitemapEntries.push({
                    url: `${BASE_URL}/obd/${code.code.toLowerCase()}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.4,
                });
            }
        });
    }

    // 3. Trafik Cezaları
    const trafikData = safeReadFile('trafik_cezalari.json');
    if (trafikData && trafikData.categories) {
        trafikData.categories.forEach((cat: any) => {
            cat.rows.forEach((row: any) => {
                if (row.slug) {
                    sitemapEntries.push({
                        url: `${BASE_URL}/trafik-cezasi/${row.slug}`,
                        lastModified: new Date(),
                        changeFrequency: 'monthly',
                        priority: 0.7,
                    });
                }
            });
        });
    }

    // 4. Makaleler / Rehberler
    const guidesData = safeReadFile('library_guides.json');
    if (guidesData && guidesData.guides) {
        guidesData.guides.forEach((guide: any) => {
            sitemapEntries.push({
                url: `${BASE_URL}/makale/${createSlug(guide.title)}--${guide.urlId || guide.id}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        });
    }

    // 4.5 Nasıl Yapılır Rehberleri
    const nasilYapilirData = safeReadFile('nasil-yapilir.json');
    if (nasilYapilirData && nasilYapilirData.categories) {
        nasilYapilirData.categories.forEach((cat: any) => {
            if (cat.guides) {
                cat.guides.forEach((guide: any) => {
                    sitemapEntries.push({
                        url: `${BASE_URL}/nasil-yapilir/${guide.slug || createSlug(guide.title)}`,
                        lastModified: new Date(),
                        changeFrequency: 'monthly',
                        priority: 0.7,
                    });
                });
            }
        });
    }

    // 5. İlginç Bilgiler
    const interestingData = safeReadFile('interesting_information.json');
    if (interestingData && interestingData.interestingFacts) {
        const processArray = (arr: any[], titleKey: string) => {
            if (!arr) return;
            arr.forEach(item => {
                sitemapEntries.push({
                    url: `${BASE_URL}/kutuphane/ilginc/${createSlug(item[titleKey] || item.myth || item.text?.slice(0, 40))}-${item.id}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                });
            });
        };
        const facts = interestingData.interestingFacts;
        processArray(facts.dailyTips, 'title');
        processArray(facts.checklists, 'title');
        processArray(facts.doAndDont, 'title');
        processArray(facts.quickFacts, 'text');
        processArray(facts.mythBusters, 'myth');
    }

    // 6. Sözlük
    try {
        const dictionaryContent = fs.readFileSync(path.join(process.cwd(), 'data', 'dictionary.ts'), 'utf8');
        const matches = dictionaryContent.match(/id:\s*["']([^"']+)["']/g);
        if (matches) {
            matches.forEach(match => {
                const id = match.split(/["']/)[1];
                sitemapEntries.push({
                    url: `${BASE_URL}/sozluk/${id}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                });
            });
        }
    } catch (e) {}

    // 7. Gösterge Paneli Işıkları
    const faultLights = safeReadFile('fault_lights.json');
    if (faultLights && faultLights.warningLights) {
        faultLights.warningLights.forEach((light: any) => {
            sitemapEntries.push({
                url: `${BASE_URL}/gosterge/${createSlug(light.title)}--${light.urlId || light.id}`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.5,
            });
        });
    }

    // 8. GüvenMetre Kategorileri ve Markaları
    if (categories) {
        categories.forEach(category => {
            sitemapEntries.push({
                url: `${BASE_URL}/guvenmetre/${category.id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            });

            const categoryBrands = getBrandsForCategory(category.id);
            if (categoryBrands && categoryBrands.length > 0) {
                categoryBrands.forEach(brand => {
                    sitemapEntries.push({
                        url: `${BASE_URL}/guvenmetre/${category.id}/${brand.id}`,
                        lastModified: new Date(),
                        changeFrequency: 'weekly',
                        priority: 0.7,
                    });
                });
            }
        });
    }

    // 9. Haberler (news_posts.json'dan)
    const newsData = safeReadFile('news_posts.json');
    if (newsData && newsData.posts) {
        newsData.posts.forEach((post: any) => {
            if (post.slug) {
                sitemapEntries.push({
                    url: `${BASE_URL}/haberler/${post.slug}`,
                    lastModified: post.createdAt ? new Date(post.createdAt) : new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                });
            }
        });
    }

    // 10. Otoyol Ücretleri
    const otoyolData = safeReadFile('otoyol_ucretleri.json');
    if (otoyolData && Array.isArray(otoyolData)) {
        otoyolData.forEach((item: any) => {
            if (item.id) {
                sitemapEntries.push({
                    url: `${BASE_URL}/kutuphane/otoyol-ucretleri/${item.id}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                });
            }
        });
    }

    // 11. Efsane Avcıları (TS dosyasından ID'ler)
    try {
        const efsaneContent = fs.readFileSync(path.join(process.cwd(), 'data', 'efsane-avcilari-data.ts'), 'utf8');
        const efsaneMatches = efsaneContent.match(/id:\s*["']([^"']+)["']/g);
        if (efsaneMatches) {
            efsaneMatches.forEach(match => {
                const id = match.split(/["']/)[1];
                sitemapEntries.push({
                    url: `${BASE_URL}/kutuphane/efsane-avcilari/${id}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                });
            });
        }
    } catch (e) {}

    // 12. Kütüphane Kategorileri (server-rendered, benzersiz metadata + JSON-LD)
    // Not: Bu kategoriler /kutuphane?kategori=<slug> olarak sunulur; her biri
    // kendi başlığı, açıklaması ve yapılandırılmış verisiyle indekslenir.
    const kutuphaneCategories = [
        'ilginc-bilgiler', 'otomotiv-sozluk', 'trafik-isaretleri', 'obd-ariza-kodlari',
        'gosterge-isiklari', 'trafik-cezalari', 'lastik-rehberi', 'ikinci-el-rehberi',
        'kaza-ilkyardim', 'mevsimsel-bakim', 'sigorta-rehberi', 'otoyol-ve-kopru-ucretleri',
        'bakim-zamanlari', 'tuvturk-muayene', 'arac-segmentleri', 'plaka-kodlari',
        'noter-islemleri', 'ehliyet-siniflari', 'kasko-deger', 'hgs-siniflari',
        'dolandiricilik-rehberi', 'nereye-gitmeli', 'hasar-sorgulama', 'efsane-avcilari',
        'nasil-yapilir',
    ];
    kutuphaneCategories.forEach(slug => {
        sitemapEntries.push({
            url: `${BASE_URL}/kutuphane?kategori=${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.75,
        });
    });

    // 13. OtoHesap Modülleri
    const { OTOHESAP_META } = require('@/data/otohesap-meta');
    const otohesapModules = Object.keys(OTOHESAP_META || {});
    otohesapModules.forEach(mod => {
        sitemapEntries.push({
            url: `${BASE_URL}/otohesap/${mod}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    });

    // 14. Etkinlikler (events.ts'den - dinamik)
    events.forEach(event => {
        sitemapEntries.push({
            url: `${BASE_URL}/etkinlikler/${event.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        });
    });

    // 15. Dinamik Forum Konuları (Firestore'dan)
    if (!initError) {
        try {
            const db = getAdminDb();
            const threadsSnapshot = await db.collection('threads')
                .orderBy('createdAt', 'desc')
                .limit(2000)
                .get();
                
            threadsSnapshot.forEach(doc => {
                const threadData = doc.data();
                const threadSlug = threadData.urlId
                    ? `${createSlug(threadData.title || '')}--${threadData.urlId}`
                    : doc.id;
                sitemapEntries.push({
                    url: `${BASE_URL}/forum/${threadSlug}`,
                    lastModified: threadData.lastEntryAt
                        ? new Date(threadData.lastEntryAt.toDate())
                        : threadData.createdAt
                            ? new Date(threadData.createdAt.toDate())
                            : new Date(),
                    changeFrequency: 'hourly',
                    priority: 0.8,
                });
            });
        } catch (e) {
            console.error('Sitemap Firestore thread fetching error:', e);
        }
    }

    // 16. Dinamik Sözlük Terimleri (Firestore'dan)
    if (!initError) {
        try {
            const db = getAdminDb();
            const dictSnapshot = await db.collection('dictionary')
                .limit(500)
                .get();
            dictSnapshot.forEach(doc => {
                sitemapEntries.push({
                    url: `${BASE_URL}/sozluk/${doc.id}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                });
            });
        } catch (e) {}
    }

    return sitemapEntries;
}

