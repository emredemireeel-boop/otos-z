const DICTIONARY_CANONICAL_IDS: Record<string, string> = {
    "amortisör_takozu": "amortisor_takozu",
    "krank_mili": "krank",
    "mcpherson": "macpherson",
};

export function getCanonicalDictionaryId(id: string): string {
    const normalized = id.toLowerCase();
    return Object.hasOwn(DICTIONARY_CANONICAL_IDS, normalized)
        ? DICTIONARY_CANONICAL_IDS[normalized] : normalized;
}
