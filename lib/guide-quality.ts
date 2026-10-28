import signals from '../data/seo-quality/guide.json';
import { isGuideIndexable, qualityContentText, type SimilaritySignal } from './indexability';

export function isQualityGuide(guide: any, kind: string): boolean {
    const group = (signals.records as Record<string, Record<string, SimilaritySignal>>)[kind] || {};
    const signal = group[String(guide.id || guide.slug || '')] || {};
    return isGuideIndexable(guide, { ...signal, kind, text: qualityContentText(guide) });
}
