import 'server-only';
import type { MetadataRoute } from 'next';
import { CATEGORIES, libraryCategoryPath } from './library-categories';
import { indexableObdCodes, obdDirectoryPageCount } from '@/lib/obd-catalog';
import fs from 'fs';
import path from 'path';
import { getIndexableForumThreadSummaries, getForumHubThreadSummaries } from '@/lib/forumDataServer';
import { forumCategories, forumHubPath, FORUM_PAGE_SIZE } from '@/lib/forum-hub';
import { isForumCategoryIndexable } from '@/lib/forum-pagination';
import { isSeoUrlIndexable } from '@/lib/seo-index-catalog';
import { events } from '@/data/events';
import { OTOHESAP_META } from '@/data/otohesap-meta';
import { createSeoSlug as createSlug } from '@/lib/slug';
import { dictionaryTerms } from '@/data/dictionary';
import { mythsData } from '@/data/efsane-avcilari-data';
import { getCanonicalDictionaryId } from '@/lib/seoUrls';
import { OPEN_CAR_MARKETS, TURKEY_PROVINCES, getMarketPath, hasVerifiedMarket } from '@/data/open-car-markets';



const BASE_URL = 'https://otosoz.com';



async function collectUrls(type?:SitemapType): Promise<MetadataRoute.Sitemap> {
    const sitemapEntries: MetadataRoute.Sitemap = [
        // Ana Hub Sayfaları
        { url: `${BASE_URL}/trafik-cezasi`},
        { url: `${BASE_URL}`},
        { url: `${BASE_URL}/kutuphane`},
        { url: `${BASE_URL}/makale`},
        { url: `${BASE_URL}/kutuphane/kasko-deger`},
        { url: `${BASE_URL}/arac-dna`},
        { url: `${BASE_URL}/otobutce`},
        { url: `${BASE_URL}/haberler`},
        { url: `${BASE_URL}/karsilastirma`},
        { url: `${BASE_URL}/uzmana-sor`},
        { url: `${BASE_URL}/piyasalar`},
        { url: `${BASE_URL}/guvenmetre`},
        { url: `${BASE_URL}/altin-anahtar`},
        { url: `${BASE_URL}/anket`},
        { url: `${BASE_URL}/otohesap`},
        { url: `${BASE_URL}/etkinlikler`},

        { url: `${BASE_URL}/obd`},
        { url: `${BASE_URL}/ajanda`},
        { url: `${BASE_URL}/hakkimizda`},
        { url: `${BASE_URL}/iletisim`},
        { url: `${BASE_URL}/gizlilik-politikasi`},
        { url: `${BASE_URL}/cerez-politikasi`},
        { url: `${BASE_URL}/kullanim-sartlari`},
    ];

    // Yalnızca kaynaklı, dizine açık pazar sayfalarını bildir.
    sitemapEntries.push({ url: `${BASE_URL}/acik-oto-pazari` });
    for (const province of TURKEY_PROVINCES.filter((entry) => hasVerifiedMarket(entry.slug))) {
        sitemapEntries.push({ url: `${BASE_URL}/acik-oto-pazari/${province.slug}` });
    }
    for (const market of OPEN_CAR_MARKETS.filter((entry) => entry.status === 'verified')) {
        sitemapEntries.push({ url: `${BASE_URL}${getMarketPath(market)}`, lastModified: new Date(market.checkedAt) });
    }

    // Her kütüphane sekmesi ayrı ve kendi canonical'ına sahip bir koleksiyon sayfasıdır.
    CATEGORIES.filter(cat => libraryCategoryPath(cat.slug).startsWith("/kutuphane/kategori/")).forEach(({slug: categorySlug}) => {
        sitemapEntries.push({
            url: `${BASE_URL}${libraryCategoryPath(categorySlug)}`,

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

        });
    });


    uniqueVehicleList.forEach((vehicle: any) => {
        const brandSlug = createSlug(vehicle.brand);
        const modelSlug = createSlug(vehicle.model);

        // Model detay sayfası
        sitemapEntries.push({
            url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}`,

        });

        // Yalnızca benzersiz ve görünür verisi olan alt sayfaları Google'a bildir.
        if (vehicle.chronicIssues?.length > 0) {
            sitemapEntries.push({
                url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/kronik-sorunlar`,

            });
        }

        if (vehicle.strengths?.length > 0 || vehicle.weaknesses?.length > 0) {
            sitemapEntries.push({
                url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/neden-alinir`,

            });
        }

        if (vehicle.userExperiences?.length > 0) {
            sitemapEntries.push({
                url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/kullanici-deneyimleri`,

            });
        }
        
        // Donanım paketleri sayfası (Sadece varsa)
        const hasTrim = trimList.find((t: any) => t.vehicleId === vehicle.id);
        if (hasTrim) {
            sitemapEntries.push({
                url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/arac-paketleri`,

            });
        }
        
        // Motor seçenekleri (Sadece varsa)
        const vehicleEngines = engineList.find((e: any) => e.vehicleId === vehicle.id);
        if (vehicleEngines && vehicleEngines.engines) {
            vehicleEngines.engines.forEach((engine: any) => {
                const engineSlug = engine.slug || createSlug(engine.name);
                const engineUrls = [
                    { suffix: '', include: true},
                    { suffix: '-kronik-sorunlari', include: engine.chronicIssues?.length > 0},
                    {
                        suffix: '-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri',
                        include: Boolean(engine.pros?.length || engine.cons?.length),
                    },
                ];

                engineUrls.filter(item => item.include).forEach(item => {
                    sitemapEntries.push({
                        url: `${BASE_URL}/arac-dna/${brandSlug}/${modelSlug}/${engineSlug}${item.suffix}`,

                    });
                });
            });
        }
    });

    if (OTOBUTCE_CATEGORIES) {
        OTOBUTCE_CATEGORIES.forEach((category: any) => {
            sitemapEntries.push({
                url: `${BASE_URL}/otobutce/${category.slug}`,

            });
        });
    }

    // Detay sayfası, API ve sitemap aynı tekilleştirilmiş kataloğu kullanır.
    indexableObdCodes.forEach(code => {
        sitemapEntries.push({
            url: BASE_URL + '/obd/' + code.code.toLowerCase(),
            ...(recordDate(code.lastReviewed) ? {lastModified:recordDate(code.lastReviewed)} : {}),
        });
    });
    for (let page = 1; page <= obdDirectoryPageCount; page++) {
        sitemapEntries.push({ url: BASE_URL + '/obd-kodlari/' + page});
    }

    // 3. Trafik Cezaları
    const trafikData = safeReadFile('trafik_cezalari.json');
    if (trafikData && trafikData.categories) {
        trafikData.categories.forEach((cat: any) => {
            cat.rows.forEach((row: any) => {
                if (row.slug) {
                    sitemapEntries.push({
                        url: `${BASE_URL}/trafik-cezasi/${row.slug}`,

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

        });
    });

    // 7. Gösterge Paneli Işıkları
    const faultLights = safeReadFile('fault_lights.json');
    if (faultLights && faultLights.warningLights) {
        faultLights.warningLights.forEach((light: any) => {
            sitemapEntries.push({
                url: `${BASE_URL}/gosterge/${createSlug(light.title)}--${light.urlId || light.id}`,

            });
        });
    }

    // 8. GüvenMetre alt sayfaları henüz bağımsız canonical içerik sunmadığı
    // için sitemap'e eklenmez. Ana /guvenmetre sayfası yukarıda yer alır.

    // 9. Haberler (news_posts.json'dan)
    const newsData = safeReadFile('news_posts.json');
    if (newsData && newsData.posts) {
        newsData.posts.forEach((post: any) => {
            if (post.slug) {
                sitemapEntries.push({
                    url: `${BASE_URL}/haberler/${post.slug}`,
                    ...(recordDate(post.updatedAt || post.createdAt) ? {lastModified: recordDate(post.updatedAt || post.createdAt)} : {}),
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

                });
            }
        });
    }

    // 11. Efsane Avcıları — canonical slug ve sayısal ID birlikte kullanılır
    mythsData.forEach((myth) => {
        sitemapEntries.push({
            url: `${BASE_URL}/kutuphane/efsane-avcilari/${myth.slug}--${myth.id}`,

        });
    });

    // 13. OtoHesap Modülleri
    const otohesapModules = Object.keys(OTOHESAP_META || {});
    otohesapModules.forEach(mod => {
        sitemapEntries.push({
            url: `${BASE_URL}/otohesap/${mod}`,

        });
    });

    // 14. Etkinlikler (oto pazarları kaynak kontrollü yeni dizinde tutulur)
    events.filter(event => event.category !== 'pazar').forEach(event => {
        sitemapEntries.push({
            url: `${BASE_URL}/etkinlikler/${event.id}`,

        });
    });

    // 15. Dinamik forum konuları: Admin erişimi yoksa güvenli public Firestore
    // yedeği devreye girer. Yeni başlık ve entry'ler 15 dakika içinde görünür.
    const [forumThreads, visibleForumThreads] = !type || type==='forum' ? await Promise.all([
        getIndexableForumThreadSummaries(), getForumHubThreadSummaries(null),
    ]) : [[],[]];
    // Thin/spam noindex kararı tekil metadata ile aynı politikadan gelir.
    forumThreads.forEach(thread => {
        sitemapEntries.push({
            url: `${BASE_URL}/forum/${thread.slug}`,
            ...(thread.lastEntryAt || thread.createdAt
                ? { lastModified: new Date((thread.lastEntryAt || thread.createdAt)!) }
                : {}),
        });
    });

    sitemapEntries.push({ url: `${BASE_URL}/forum`});
    for (let page = 2; page <= Math.ceil(visibleForumThreads.length / FORUM_PAGE_SIZE); page++) {
        sitemapEntries.push({ url: `${BASE_URL}${forumHubPath(page)}`});
    }
    for (const category of forumCategories) {
        const count = visibleForumThreads.filter(thread => thread.category === category.name).length;
        if (!isForumCategoryIndexable(count)) continue;
        for (let page = 1; page <= Math.ceil(count / FORUM_PAGE_SIZE); page++) {
            sitemapEntries.push({ url: `${BASE_URL}${forumHubPath(page, category.slug)}`});
        }
    }

    // Aynı URL farklı veri kümelerinden birden fazla kez gelebiliyor. Arama
    // motorlarına her canonical URL'yi yalnızca bir kez gönder.
    const uniqueEntries = new Map<string, MetadataRoute.Sitemap[number]>();
    sitemapEntries.forEach(entry => {
        if (!uniqueEntries.has(entry.url)) uniqueEntries.set(entry.url, entry);
    });

    const indexableThreads = new Set(forumThreads.map(thread => thread.slug));
    const categoryCounts = new Map(forumCategories.map(category => [category.slug,
        visibleForumThreads.filter(thread => thread.category === category.name).length]));
    return Array.from(uniqueEntries.values()).filter(entry => isSeoUrlIndexable(entry.url, {indexableThreads,categoryCounts}));
}

// Unknown dates are omitted. A build/deployment date is never a content date.
export function recordDate(value: unknown): string | undefined {
    if (!value || (typeof value !== 'string' && typeof value !== 'number' && !(value instanceof Date))) return undefined;
    const date=new Date(value);
    return Number.isFinite(date.getTime()) && date.getTime() <= Date.now() ? date.toISOString() : undefined;
}
export const SITEMAP_TYPES=['core','arac-dna','obd','sozluk','kutuphane','makale','forum','haberler','trafik-cezasi','otohesap','acik-oto-pazari'] as const;
export type SitemapType=typeof SITEMAP_TYPES[number];
export function seoRouteType(url:string):SitemapType {
    const prefix=new URL(url).pathname.split('/')[1];
    if(prefix==='otobutce')return 'otohesap';
    if(['nasil-yapilir','gosterge'].includes(prefix))return 'kutuphane';
    return SITEMAP_TYPES.includes(prefix as SitemapType)?prefix as SitemapType:'core';
}
export async function getIndexableUrls(type?:SitemapType):Promise<MetadataRoute.Sitemap> {
    const urls=await collectUrls(type);
    return type?urls.filter(entry=>seoRouteType(entry.url)===type):urls;
}
