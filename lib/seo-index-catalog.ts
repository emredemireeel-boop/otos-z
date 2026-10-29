import 'server-only';
import { isHubIndexable, isVehicleIndexable, isVehicleSectionIndexable } from './indexability';
import { vehicleDNAData, createSlug } from '../data/vehicle-dna';
import { engineDNAData } from '../data/engine-dna';
import { trimLevelsData } from '../data/trim-levels';
import { getObdCode, isObdCodeIndexable } from './obd-catalog';
import { isEngineRouteIndexable } from './engine-quality';
import { isQualityDictionaryTerm } from './dictionary-catalog';
import { dictionaryTerms } from '../data/dictionary';
import { isQualityGuide } from './guide-quality';
import { isGuideIndexable, qualityContentText } from './indexability';
import library from '../public/data/library_guides.json';
import howto from '../data/nasil-yapilir.json';
import interesting from '../public/data/interesting_information.json';
import lights from '../data/fault_lights.json';
import traffic from '../data/trafik_cezalari.json';
import news from '../public/data/news_posts.json';
import tolls from '../public/data/otoyol_ucretleri.json';
import { mythsData } from '../data/efsane-avcilari-data';
import { OTOHESAP_META } from '../data/otohesap-meta';
import { OTOHESAP_GUIDES } from '../data/otohesap-content';
import { OTOBUTCE_CATEGORIES } from '../data/otobutce-data';
import { OPEN_CAR_MARKETS } from '../data/open-car-markets';
import { CATEGORIES } from './library-categories';
import { createSeoSlug } from './slug';

const facts = ['dailyTips', 'quickFacts', 'mythBusters', 'checklists', 'doAndDont']
    .flatMap(key => (interesting.interestingFacts as any)[key] || []);

/** URL çözümleyicisi kalite kurallarını yeniden yazmaz; aynı saf kapıları çağırır. */
export function isSeoUrlIndexable(value: string, context: { indexableThreads?: Set<string>; categoryCounts?: Map<string, number> } = {}): boolean {
    const url = new URL(value, 'https://otosoz.com');
    if (url.origin !== 'https://otosoz.com' || url.pathname !== url.pathname.toLowerCase()
        || (url.pathname.length > 1 && url.pathname.endsWith('/'))) return false;
    const p = url.pathname.split('/').filter(Boolean);
    if (p[0] === 'kutuphane' && p[1] === 'kategori' && p.length === 3 && !url.search) {
        return CATEGORIES.some(item=>item.slug===p[2]) && isHubIndexable('/kutuphane',{category:p[2]});
    }
    if (url.search) return false;
    if (isHubIndexable(url.pathname)) return true;
    if (p[0] === 'obd' && p.length === 2) { const code = getObdCode(p[1]); return Boolean(code && isObdCodeIndexable(code)); }
    if (p[0] === 'obd-kodlari') return false;
    if (p[0] === 'arac-dna') {
        const models = vehicleDNAData.filter(vehicle => createSlug(vehicle.brand) === p[1]);
        if (p.length === 2) return models.some(isVehicleIndexable);
        const vehicle = models.find(item => createSlug(item.model) === p[2]);
        if (!vehicle) return false;
        if (p.length === 3) return isVehicleIndexable(vehicle);
        if (p.length !== 4) return false;
        if (['kronik-sorunlar', 'neden-alinir', 'kullanici-deneyimleri', 'arac-paketleri'].includes(p[3])) {
            return isVehicleSectionIndexable(vehicle, p[3], { trims: trimLevelsData.find(item => item.vehicleId === vehicle.id)?.trims || [] });
        }
        let engineSlug = p[3], section = 'genel-bakis';
        if (engineSlug.endsWith('-kronik-sorunlari')) { engineSlug = engineSlug.slice(0, -'-kronik-sorunlari'.length); section = 'kronik'; }
        if (engineSlug.endsWith('-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri')) { engineSlug = engineSlug.slice(0, -'-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri'.length); section = 'artilar'; }
        const engine = engineDNAData.find(item => item.vehicleId === vehicle.id)?.engines.find(item => item.slug === engineSlug);
        return Boolean(engine && isEngineRouteIndexable(vehicle, engine, section));
    }
    if (p[0] === 'sozluk') { const term = dictionaryTerms.find(item => item.id === p[1]); return Boolean(term && isQualityDictionaryTerm(term)); }
    if (p[0] === 'makale' && p.length === 2) { const guide = library.guides.find(item => String(item.urlId || item.id) === p[1].split('--').at(-1)); return Boolean(guide && isQualityGuide(guide, 'article')); }
    if (p[0] === 'nasil-yapilir') { const guide = howto.categories.flatMap(category => category.guides).find(item => (item.slug || createSeoSlug(item.title)) === p[1]); return Boolean(guide && isQualityGuide(guide, 'howto')); }
    if (p[0] === 'gosterge') { const guide = lights.warningLights.find(item => String(item.urlId || item.id) === p[1]?.split('--').at(-1)); return Boolean(guide && isQualityGuide(guide, 'warningLight')); }
    if (p[0] === 'haberler') { const guide = news.posts.find(item => item.slug === p[1]); return Boolean(guide && isQualityGuide(guide, 'news')); }
    if (p[0] === 'trafik-cezasi') { const guide = traffic.categories.flatMap(category => category.rows).find(item => item.slug === p[1]); return Boolean(guide && isQualityGuide(guide, 'trafficFine')); }
    if (p[0] === 'kutuphane' && p[1] === 'ilginc') { const guide = facts.find(item => item.id === p[2]?.match(/(ilginc-\d+)$/)?.[1]); return Boolean(guide && isQualityGuide(guide, 'interesting')); }
    if (p[0] === 'kutuphane' && p[1] === 'efsane-avcilari') { const guide = mythsData.find(item => String(item.id) === p[2]?.split('--').at(-1)); return Boolean(guide && isQualityGuide(guide, 'myth')); }
    if (p[0] === 'kutuphane' && p[1] === 'otoyol-ucretleri') { const guide = tolls.find(item => item.id === p[2]); return Boolean(guide && isQualityGuide(guide, 'toll')); }
    if (p[0] === 'otobutce') { const guide = OTOBUTCE_CATEGORIES.find(item => item.slug === p[1]); return Boolean(guide && isGuideIndexable(guide, { kind: 'functional-utility', text: qualityContentText(guide) })); }
    if (p[0] === 'otohesap') { const meta = OTOHESAP_META[p[1] as keyof typeof OTOHESAP_META]; const guide = OTOHESAP_GUIDES[p[1] as keyof typeof OTOHESAP_GUIDES]; return Boolean(meta && guide && isGuideIndexable(meta, { kind: 'functional-utility', text: qualityContentText(guide) })); }
    if (p[0] === 'acik-oto-pazari') {
        const markets = OPEN_CAR_MARKETS.filter(item => item.provinceSlug === p[1]);
        return p.length === 2 ? markets.some(item => isGuideIndexable(item, { kind: 'verified-market' }))
            : Boolean(markets.some(item => item.slug === p[2] && isGuideIndexable(item, { kind: 'verified-market' })));
    }
    if (p[0] === 'forum') {
        if (p[1] === 'kategori') return isHubIndexable(url.pathname, { visibleThreads: context.categoryCounts?.get(p[2]) || 0 });
        if (p[1] === 'sayfa') return isHubIndexable(url.pathname, { visibleThreads: 1 });
        return context.indexableThreads?.has(p[1]) || false;
    }
    return false;
}
