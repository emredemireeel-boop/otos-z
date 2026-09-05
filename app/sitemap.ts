import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { categories, getBrandsForCategory } from '@/data/guvenmetre';
import { getRecentForumThreadSummaries } from '@/lib/forumDataServer';
import { events } from '@/data/events';
import { OTOHESAP_META } from '@/data/otohesap-meta';
import { OTOHESAP_LAST_REVIEWED } from '@/data/otohesap-content';
import { createSeoSlug as createSlug } from '@/lib/slug';
import { dictionaryTerms } from '@/data/dictionary';
import { mythsData } from '@/data/efsane-avcilari-data';
import { getCanonicalDictionaryId } from '@/lib/seoUrls';

// Sitemap'in 15 dakikada bir yeniden oluşturulması — yeni başlık/entry'ler hızla Google'a gider
export const revalidate = 900;

const BASE_URL = 'https://otosoz.com';
const OBD_LAST_REVIEWED = '2026-08-26';
const LIBRARY_LAST_REVIEWED = '2026-08-26';

const LIBRARY_CATEGORY_SLUGS = [
    'ilginc-bilgiler',
    'otomotiv-sozluk',
    'trafik-isaretleri',

    'gosterge-isiklari',
    'trafik-cezalari',
    'lastik-rehberi',
    'ikinci-el-rehberi',
    'kaza-ilkyardim',
    'mevsimsel-bakim',
    'sigorta-rehberi',
    'otoyol-ve-kopru-ucretleri',
    'bakim-zamanlari',
    'tuvturk-muayene',
    'arac-segmentleri',
    'plaka-kodlari',
    'noter-islemleri',
    'ehliyet-siniflari',
    'hgs-siniflari',
    'dolandiricilik-rehberi',
    'nereye-gitmeli',
    'hasar-sorgulama',
    'efsane-avcilari',
    'nasil-yapilir',
] as const;


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const generatedAt = Date.now();
    const sitemapEntries: MetadataRoute.Sitemap = [
        // Ana Hub Sayfaları
        { url: `${BASE_URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/kutuphane`, lastModified: new Date(LIBRARY_LAST_REVIEWED), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/kutuphane/kasko-deger`, lastModified: new Date(LIBRARY_LAST_REVIEWED), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/forum`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
        { url: `${BASE_URL}/forum?kategori=genel`, changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/forum?kategori=teknik-ariza`, changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/forum?kategori=bakim-tamir`, changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/forum?kategori=modifiye-aksesuar`, changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/forum?kategori=elektrikli-hibrit`, changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/forum?kategori=lastik-jant`, changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/forum?kategori=sigorta-hukuk`, changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/forum?kategori=alim-satim`, changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/forum?kategori=deneyim-inceleme`, changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/forum?kategori=marka-model`, changeFrequency: 'daily', priority: 0.7 },        { url: `${BASE_URL}/arac-dna`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/otobutce`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/haberler`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/karsilastirma`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/uzmana-sor`, lastModified: new Date(), changeFrequency: 'always', priority: 0.8 },
        { url: `${BASE_URL}/piyasalar`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/guvenmetre`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/altin-anahtar`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/bilgi-yarismasi`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/anket`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/otohesap`, lastModified: new Date(OTOHESAP_LAST_REVIEWED), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/etkinlikler`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },

        { url: `${BASE_URL}/obd`, lastModified: new Date(OBD_LAST_REVIEWED), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/ajanda`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/usta-ol`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/uzman-ol`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/hakkimizda`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/iletisim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/gizlilik-politikasi`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/cerez-politikasi`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/kullanim-sartlari`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ];

    // Her kütüphane sekmesi ayrı ve kendi canonical'ına sahip bir koleksiyon sayfasıdır.
    LIBRARY_CATEGORY_SLUGS.forEach(categorySlug => {
        sitemapEntries.push({
            url: `${BASE_URL}/kutuphane?kategori=${categorySlug}`,
            lastModified: new Date(LIBRARY_LAST_REVIEWED),
            changeFrequency: 'weekly',
            priority: 0.7,
        });
    });

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
    const { vehicleDNAData, isVehicleEditoriallyReviewed } = require('@/data/vehicle-dna');
    const { engineDNAData } = require('@/data/engine-dna');
    const { trimLevelsData } = require('@/data/trim-levels');
    const { OTOBUTCE_CATEGORIES } = require('@/data/otobutce-data');
    
    const vehicleList = vehicleDNAData || [];
    const engineList = engineDNAData || [];
    const trimList = trimLevelsData || [];
    // Veri dosyasında aynı marka/model yolu bazı eski kayıtlar nedeniyle tekrar
    // edebiliyor. Sayfa çözümleyicisinin kullandığı ilk kaydı canonical kabul et;
    // sonraki kopyaların motorlarını aynı URL altında sitemap'e karıştırma.
    const uniqueVehicleMap = new Map<string, any>();
    vehicleList.forEach((vehicle: any) => {
        const vehiclePath = `${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`;
        if (!uniqueVehicleMap.has(vehiclePath)) uniqueVehicleMap.set(vehiclePath, vehicle);
    });
    const uniqueVehicleList = Array.from(uniqueVehicleMap.values()).filter((vehicle: any) => isVehicleEditoriallyReviewed(vehicle));
    
    const uniqueBrands = [...new Set(uniqueVehicleList.map((v: any) => v.brand))] as string[];
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


    uniqueVehicleList.forEach((vehicle: any) => {
        const brandSlug = createSlug(vehicle.brand);
        const modelSlug = createSlug(vehicle.model);

        // Model detay sayfası
        sitemapEntries.push({
            url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        });

        // Yalnızca benzersiz ve görünür verisi olan alt sayfaları Google'a bildir.
        if (vehicle.chronicIssues?.length > 0) {
            sitemapEntries.push({
                url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/kronik-sorunlar`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }

        if (vehicle.strengths?.length > 0 || vehicle.weaknesses?.length > 0) {
            sitemapEntries.push({
                url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/neden-alinir`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }

        if (vehicle.userExperiences?.length > 0) {
            sitemapEntries.push({
                url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/kullanici-deneyimleri`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
        
        // Donanım paketleri sayfası (Sadece varsa)
        const hasTrim = trimList.find((t: any) => t.vehicleId === vehicle.id);
        if (hasTrim) {
            sitemapEntries.push({
                url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/arac-paketleri`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
        
        // Motor seçenekleri (Sadece varsa)
        const vehicleEngines = engineList.find((e: any) => e.vehicleId === vehicle.id);
        if (vehicleEngines && vehicleEngines.engines) {
            vehicleEngines.engines.forEach((engine: any) => {
                const engineSlug = engine.slug || createSlug(engine.name);
                const engineUrls = [
                    { suffix: '', include: true, priority: 0.7 },
                    { suffix: '-kronik-sorunlari', include: engine.chronicIssues?.length > 0, priority: 0.6 },
                    {
                        suffix: '-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri',
                        include: Boolean(engine.pros?.length || engine.cons?.length),
                        priority: 0.6,
                    },
                ];

                engineUrls.filter(item => item.include).forEach(item => {
                    sitemapEntries.push({
                        url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/${engineSlug}${item.suffix}`,
                        lastModified: new Date(),
                        changeFrequency: 'weekly',
                        priority: item.priority,
                    });
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

    // 2. Tekil OBD Kodları — yalnızca indekslenebilir canonical /obd/{code} URL'leri.
    // Marka sayfaları evrensel kodları tekrar ettiği için sitemap'e alınmaz.
    // Sitemap sınırı 50.000 URL'dir; veritabanındaki tüm benzersiz kodları
    // eklemek güvenlidir ve daha önce görünmez kalan binlerce detay sayfasının
    // keşfedilmesini sağlar.
    const obdCodesData = safeReadFile('obd-codes.json');
    if (obdCodesData && Array.isArray(obdCodesData)) {
        const uniqueObdCodes = new Map<string, any>();

        obdCodesData.forEach((code: any) => {
            const normalizedCode = String(code.code || '').trim().toLowerCase();
            if (/^[pbcu][0-9a-f]{4}$/i.test(normalizedCode) && !uniqueObdCodes.has(normalizedCode)) {
                uniqueObdCodes.set(normalizedCode, code);
            }
        });

        uniqueObdCodes.forEach((code, normalizedCode) => {
            sitemapEntries.push({
                url: `${BASE_URL}/obd/${normalizedCode}`,
                lastModified: new Date(OBD_LAST_REVIEWED),
                changeFrequency: 'monthly',
                priority: code.isGeneric !== false ? 0.7 : 0.6,
            });
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
    // Sayfa yalnızca yerel sözlük veri kümesini sunuyor. Firestore'daki veya
    // Unicode kimlikli eski kayıtları sitemap'e eklemek, 200 kodlu bulunamadı
    // sayfaları ve soft 404 üretirdi. Yalnızca gerçekten çözümlenen canonical
    // kimlikleri yayınla.
    const canonicalDictionaryIds = new Set(
        dictionaryTerms.map(term => getCanonicalDictionaryId(term.id)),
    );
    canonicalDictionaryIds.forEach(id => {
        sitemapEntries.push({
            url: `${BASE_URL}/sozluk/${id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        });
    });

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

    // 11. Efsane Avcıları — canonical slug ve sayısal ID birlikte kullanılır
    mythsData.forEach((myth) => {
        sitemapEntries.push({
            url: `${BASE_URL}/kutuphane/efsane-avcilari/${myth.slug}--${myth.id}`,
            lastModified: new Date(LIBRARY_LAST_REVIEWED),
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    });

    // 13. OtoHesap Modülleri
    const otohesapModules = Object.keys(OTOHESAP_META || {});
    otohesapModules.forEach(mod => {
        sitemapEntries.push({
            url: `${BASE_URL}/otohesap/${mod}`,
            lastModified: new Date(OTOHESAP_LAST_REVIEWED),
            changeFrequency: 'weekly',
            priority: 0.82,
        });
    });

    // 14. Etkinlikler (oto pazarları kaynak kontrollü yeni dizinde tutulur)
    events.filter(event => event.category !== 'pazar').forEach(event => {
        sitemapEntries.push({
            url: `${BASE_URL}/etkinlikler/${event.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        });
    });

    // 15. Dinamik forum konuları: Admin erişimi yoksa güvenli public Firestore
    // yedeği devreye girer. Yeni başlık ve entry'ler 15 dakika içinde görünür.
    const forumThreads = await getRecentForumThreadSummaries(1200);
    forumThreads.forEach(thread => {
        sitemapEntries.push({
            url: `${BASE_URL}/forum/${thread.slug}`,
            ...(thread.lastEntryAt || thread.createdAt
                ? { lastModified: new Date(thread.lastEntryAt || thread.createdAt || Date.now()) }
                : {}),
            changeFrequency: 'hourly',
            priority: 0.8,
        });
    });

    // Aynı URL farklı veri kümelerinden birden fazla kez gelebiliyor. Arama
    // motorlarına her canonical URL'yi yalnızca bir kez gönder.
    const uniqueEntries = new Map<string, MetadataRoute.Sitemap[number]>();
    sitemapEntries.forEach(entry => {
        if (!uniqueEntries.has(entry.url)) uniqueEntries.set(entry.url, entry);
    });

    // "lastmod" yalnızca gerçek bir değişiklik tarihiyse güvenilir bir sinyaldir.
    // Eski kod her sitemap yenilemesinde binlerce URL'yi o an değişmiş gibi
    // işaretliyordu. Çalışma anında üretilmiş sentetik tarihleri kaldır; içerik
    // veya Firestore kaydından gelen gerçek tarihleri koru.
    return Array.from(uniqueEntries.values()).map(entry => {
        if (entry.lastModified instanceof Date) {
            const isSynthetic = Math.abs(entry.lastModified.getTime() - generatedAt) < 5 * 60 * 1000;
            const isForumThread = entry.url.startsWith(`${BASE_URL}/forum/`);
            if (isSynthetic && !isForumThread) {
                const { lastModified: _lastModified, ...stableEntry } = entry;
                return stableEntry;
            }
        }
        return entry;
    });
}
