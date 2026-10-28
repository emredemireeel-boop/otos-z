import { dictionaryTerms } from '../data/dictionary';
import signals from '../data/seo-quality/dictionary.json';
import { isDictionaryIndexable, type SimilaritySignal } from './indexability';

export const isQualityDictionaryTerm = (term: (typeof dictionaryTerms)[number]) =>
    isDictionaryIndexable(term, (signals.records as Record<string, SimilaritySignal>)[term.id] || {});
export const indexableDictionaryTerms = dictionaryTerms.filter(isQualityDictionaryTerm);
