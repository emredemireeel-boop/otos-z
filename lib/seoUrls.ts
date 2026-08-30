const DICTIONARY_CANONICAL_IDS: Record<string, string> = {
    "amortisör_takozu": "amortisor_takozu",
};

export function getCanonicalDictionaryId(id: string): string {
    return DICTIONARY_CANONICAL_IDS[id] || id;
}
