const DICTIONARY_CANONICAL_IDS: Record<string, string> = {
    "amortisör_takozu": "amortisor_takozu",
    "krank_mili": "krank",
    "mcpherson": "macpherson",
};

export function getCanonicalDictionaryId(id: string): string {
    return DICTIONARY_CANONICAL_IDS[id] || id;
}
