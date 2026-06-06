import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Kelime Filtresi Servisi
 *
 * Admin panelindeki bad_words koleksiyonundaki kuralları okur ve
 * forum içeriklerine (başlık + entry) uygular.
 *  - mode "engelle": içerik reddedilir (hata fırlatılır / blocked döner)
 *  - mode "yildizla": kelime ★ ile maskelenir
 *  - mode "uyar": içerik geçer ama uyarı listesinde işaretlenir
 *
 * Performans için kurallar bellekte 5 dakika cache'lenir.
 */

export type FilterMode = "engelle" | "yildizla" | "uyar";

export interface BadWordRule {
    word: string;
    mode: FilterMode;
    regex: boolean;
    whitelist: string[];
    active: boolean;
}

let cache: { rules: BadWordRule[]; time: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

async function getRules(): Promise<BadWordRule[]> {
    if (cache && Date.now() - cache.time < CACHE_TTL) return cache.rules;
    try {
        const snap = await getDocs(query(collection(db, "bad_words"), where("active", "==", true)));
        const rules: BadWordRule[] = snap.docs.map(d => {
            const data = d.data();
            return {
                word: data.word || "",
                mode: (data.mode || "yildizla") as FilterMode,
                regex: !!data.regex,
                whitelist: Array.isArray(data.whitelist) ? data.whitelist : [],
                active: data.active !== false,
            };
        }).filter(r => r.word);
        cache = { rules, time: Date.now() };
        return rules;
    } catch (e) {
        console.warn("Kelime filtresi okunamadı:", e);
        return cache?.rules || [];
    }
}

/** Cache'i temizle (admin kelime ekleyince çağrılabilir) */
export function clearWordFilterCache() {
    cache = null;
}

function buildPattern(rule: BadWordRule): RegExp {
    if (rule.regex) {
        return new RegExp(rule.word, "gi");
    }
    // Kelime sınırıyla, özel karakterler escape edilerek
    const escaped = rule.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(escaped, "gi");
}

export interface FilterResult {
    blocked: boolean;       // engelle modunda eşleşme oldu mu
    clean: string;          // yıldızlanmış/temiz çıktı
    matchedWords: string[]; // eşleşen kelimeler
    warned: boolean;        // uyar modunda eşleşme oldu mu
}

/**
 * Metni filtreden geçirir.
 */
export async function applyWordFilter(text: string): Promise<FilterResult> {
    const rules = await getRules();
    let clean = text;
    let blocked = false;
    let warned = false;
    const matchedWords: string[] = [];

    for (const rule of rules) {
        let pattern: RegExp;
        try {
            pattern = buildPattern(rule);
        } catch {
            continue; // geçersiz regex — atla
        }

        if (!pattern.test(text)) continue;

        // Whitelist: bu bağlamlardan biri varsa kuralı atla
        const isWhitelisted = rule.whitelist.some(wl => wl && text.toLowerCase().includes(wl.toLowerCase()));
        if (isWhitelisted) continue;

        matchedWords.push(rule.word);

        if (rule.mode === "engelle") {
            blocked = true;
        } else if (rule.mode === "yildizla") {
            clean = clean.replace(buildPattern(rule), (m) => "★".repeat(m.length));
        } else if (rule.mode === "uyar") {
            warned = true;
        }
    }

    return { blocked, clean, matchedWords, warned };
}
