const TURKISH_CHAR_MAP: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    ë: "e",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
    Ë: "e",
};

/** Arama motorları ve iç bağlantılar için tek, kararlı URL slug standardı. */
export function createSeoSlug(text: string): string {
    if (!text) return "";

    return text
        .replace(/[çğıöşüëÇĞİÖŞÜË]/g, character => TURKISH_CHAR_MAP[character] || character)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}
