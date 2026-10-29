import rawCodes from '../data/obd-codes.json';
import { reviewedObdCodes } from '../data/obd-reviewed';
import type { ObdCode } from './obd-content';
import qualitySignals from '../data/seo-quality/obd.json';
import directory from '../data/seo-quality/obd-directory-codes.json';
import { isObdIndexable, type ObdQualitySignal } from './indexability';

export const OBD_LAST_REVIEWED = '2026-08-26';
export const OBD_DIRECTORY_PAGE_SIZE = 80;
export const POPULAR_OBD_CODES = ['P0420', 'P0171', 'P0300', 'P0299', 'P0401', 'P0101', 'P0340', 'P0016', 'P0128', 'P0442', 'B0001', 'C0035', 'U0100', 'U0121'];
// Eski toplu zenginleştirme, yüzlerce farklı koda aynı teşhis listelerini
// eklemişti. Kaynaklı editoryal kayıtları koru; doğrulanmamış şablon maddelerini
// kod özelinde bulguymuş gibi API, FAQ ve sayfa üzerinden yayımlama.
const repeatedAdvice = new Map<string, number>();
for (const raw of rawCodes) {
    for (const field of ['causes', 'fixes'] as const) {
        for (const text of new Set(raw[field] || [])) {
            const key = `${field}:${text}`;
            repeatedAdvice.set(key, (repeatedAdvice.get(key) || 0) + 1);
        }
    }
}
const records = new Map<string, ObdCode>();
for (const raw of rawCodes) {
    const code = raw.code.trim().toUpperCase();
    if (!/^[PBCU][0-3][0-9A-F]{3}$/.test(code)) continue;
    // Aynı kaydın son sürümü: API, detay, dizin ve sitemap aynı veriyi kullanır.
    const record: ObdCode = { ...raw, ...reviewedObdCodes[code], code,
        qualitySignal: { ...(qualitySignals.records as Record<string, ObdQualitySignal>)[code],
            editorialRecord: Object.hasOwn(reviewedObdCodes, code) } };
    if (!record.sources?.length) {
        for (const field of ['causes', 'fixes'] as const) {
            record[field] = record[field].filter(text => (repeatedAdvice.get(`${field}:${text}`) || 0) < 300);
        }
    }
    records.set(code, record);
}
export const obdCodes = [...records.values()].sort((a, b) => a.code.localeCompare(b.code, 'en'));
export function isObdCodeIndexable(code: ObdCode) {
    return isObdIndexable(code, code.qualitySignal);
}
export const indexableObdCodes = obdCodes.filter(isObdCodeIndexable);
const popularOrder = new Map(POPULAR_OBD_CODES.map((code, index) => [code, index]));
// İlk SSR listesi ve API offset'leri birebir aynı sıralamayı paylaşır.
export const obdSearchCodes = [...obdCodes].sort((a, b) => (popularOrder.get(a.code) ?? 999) - (popularOrder.get(b.code) ?? 999) || a.code.localeCompare(b.code, 'en'));
const obdDirectoryCodes = directory.codes.map(code => records.get(code)).filter((code): code is ObdCode => Boolean(code));
// Eski dizin URL'leri kullanıcı için 200 kalır; dizin bir index allowlist'i değildir.
export const obdDirectoryPageCount = Math.ceil(obdDirectoryCodes.length / OBD_DIRECTORY_PAGE_SIZE);
export function getObdCode(value: string) { return records.get(value.trim().toUpperCase()); }
export function getObdDirectoryPage(page: number) { return obdDirectoryCodes.slice((page - 1) * OBD_DIRECTORY_PAGE_SIZE, page * OBD_DIRECTORY_PAGE_SIZE); }
export function getObdDirectoryPageNumber(code: string) { return Math.floor(obdDirectoryCodes.findIndex(item => item.code === code) / OBD_DIRECTORY_PAGE_SIZE) + 1; }
export function searchObdCodes(query = '', type = '') {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    return obdSearchCodes.filter(code => (!['P', 'B', 'C', 'U'].includes(type.toUpperCase()) || code.type === type.toUpperCase()) && (!q || `${code.code} ${code.title} ${code.description}`.toLocaleLowerCase('tr-TR').includes(q)));
}
export function getRelatedObdCodes(code: ObdCode) {
    const systems = new Set(code.systems.filter(system => system !== 'Diğer'));
    const score = (other: ObdCode) => other.systems.filter(system => systems.has(system)).length * 10 + (other.code.slice(0, 3) === code.code.slice(0, 3) ? 5 : 0);
    return indexableObdCodes.filter(other => other.type === code.type && other.code !== code.code && other.systems.some(system=>systems.has(system)))
        .sort((a, b) => score(b) - score(a) || Math.abs(parseInt(a.code.slice(1), 16) - parseInt(code.code.slice(1), 16)) - Math.abs(parseInt(b.code.slice(1), 16) - parseInt(code.code.slice(1), 16)))
        .slice(0, 6);
}
