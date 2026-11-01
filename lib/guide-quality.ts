import signals from '../data/seo-quality/guide.json';
import { isGuideIndexable, qualityContentText, type SimilaritySignal } from './indexability';
import {isSearchDiscoverablePath} from './site-sections';

const routes: Record<string,string> = {howto:'/nasil-yapilir',warningLight:'/gosterge',article:'/makale',news:'/haberler',interesting:'/kutuphane',myth:'/kutuphane',toll:'/kutuphane'};

export function isQualityGuide(guide: any, kind: string): boolean {
    if(routes[kind] && !isSearchDiscoverablePath(routes[kind])) return false;
    const group = (signals.records as Record<string, Record<string, SimilaritySignal>>)[kind] || {};
    const signal = group[String(guide.id || guide.slug || '')] || {};
    return isGuideIndexable(guide, { ...signal, kind, text: qualityContentText(guide) });
}
