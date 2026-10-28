import { isVehicleEditoriallyReviewed } from './vehicle-editorial';

export const QUALITY_THRESHOLDS = {
    obdDescription: 300, obdSpecificCauses: 3, obdSpecificChecks: 3, obdSimilarity: 0.5,
    vehicleChronicItems: 3, vehicleStrengths: 2, vehicleWeaknesses: 2,
    engineUniqueIssues: 2, engineUniqueProsCons: 2,
    dictionaryCharacters: 250, dictionarySimilarity: 0.85,
    articleCharacters: 600, guideCharacters: 300, guideSimilarity: 0.85,
    threadCharacters: 200,
} as const;
export const SUPPORTING_TEMPLATE_INDEXABLE = false;

type RecordData = Record<string, any>;
export interface SimilaritySignal { hasNearDuplicate?: boolean; maxSimilarity?: number; isRepresentative?: boolean }
export interface ObdQualitySignal extends SimilaritySignal {
    editorialRecord?: boolean; specificCauses?: number; specificChecks?: number;
}
export interface EngineQualitySignal {
    uniqueIssueCount?: number; uniqueProsConsCount?: number;
}

export function qualityContentText(value: unknown): string {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.map(qualityContentText).join(' ');
    if (!value || typeof value !== 'object') return '';
    return Object.entries(value).filter(([key]) => !key.startsWith('_')
        && !/^(id|urlId|slug|author|date|createdAt|updatedAt|imageUrl|image|icon|color|gradient|tags|sources|url)$/i.test(key))
        .map(([, nested]) => qualityContentText(nested)).join(' ');
}

export function indexabilityRobots(index: boolean) {
    return { index, follow: true, googleBot: { index, follow: true, 'max-image-preview': 'large' as const } };
}

const CORE_HUB_PATHS = new Set([
    '/', '/trafik-cezasi', '/kutuphane', '/makale', '/kutuphane/kasko-deger', '/arac-dna', '/otobutce',
    '/haberler', '/karsilastirma', '/uzmana-sor', '/piyasalar', '/guvenmetre', '/altin-anahtar',
    '/anket', '/otohesap', '/etkinlikler', '/obd', '/forum', '/acik-oto-pazari',
    '/hakkimizda', '/iletisim', '/gizlilik-politikasi', '/cerez-politikasi', '/kullanim-sartlari',
]);
export function isHubIndexable(path: string, context: { category?: string; visibleThreads?: number } = {}): boolean {
    if (path.startsWith('/forum/kategori/')) return isForumCategoryIndexable(context.visibleThreads || 0);
    if (path.startsWith('/forum/sayfa/')) return (context.visibleThreads || 0) > 0;
    if (path === '/kutuphane' && context.category) return !['otomotiv-sozluk', 'gosterge-isiklari'].includes(context.category);
    return CORE_HUB_PATHS.has(path);
}

export function visibleText(value: unknown): string {
    return String(value || '').replace(/<[^>]*>/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[*_#>`~]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function isObdIndexable(code: RecordData, signal: ObdQualitySignal = {}): boolean {
    if (signal.editorialRecord || code.sources?.some((source: RecordData) => /^https:\/\//.test(source.url || ''))) return true;
    return Boolean(code.isGeneric && visibleText(code.description).length >= QUALITY_THRESHOLDS.obdDescription
        && (signal.specificCauses ?? 0) >= QUALITY_THRESHOLDS.obdSpecificCauses
        && (signal.specificChecks ?? 0) >= QUALITY_THRESHOLDS.obdSpecificChecks
        && signal.hasNearDuplicate === false);
}

export function isVehicleIndexable(vehicle: RecordData): boolean {
    if (!vehicle || typeof vehicle.brand !== 'string') return false;
    return isVehicleEditoriallyReviewed(vehicle as { id: number; brand: string; dnaScore: number })
        && Boolean(vehicle.chronicIssues?.length || (vehicle.strengths?.length && vehicle.weaknesses?.length));
}

export const isForumCategoryIndexable = (visibleThreads: number) => visibleThreads >= 5;

export function isVehicleSectionIndexable(vehicle: RecordData, section: string, context: RecordData = {}): boolean {
    if (!isVehicleIndexable(vehicle)) return false;
    if (section === 'kronik-sorunlar') return (vehicle.chronicIssues || []).filter((item: RecordData) => visibleText(item.description).length >= 40).length >= QUALITY_THRESHOLDS.vehicleChronicItems;
    if (section === 'neden-alinir') return (vehicle.strengths?.length || 0) >= QUALITY_THRESHOLDS.vehicleStrengths && (vehicle.weaknesses?.length || 0) >= QUALITY_THRESHOLDS.vehicleWeaknesses;
    if (section === 'kullanici-deneyimleri') return (vehicle.userExperiences || []).filter((item: RecordData) => visibleText(item.text).length >= 100 && item.author).length >= 2;
    if (section === 'arac-paketleri') return (context.trims?.length || 0) >= 2;
    return false;
}

export function isEngineIndexable(vehicle: RecordData, engine: RecordData, signal: EngineQualitySignal = {}, section = 'genel-bakis'): boolean {
    if (!isVehicleIndexable(vehicle) || !engine.slug) return false;
    const issues = (signal.uniqueIssueCount ?? 0) >= QUALITY_THRESHOLDS.engineUniqueIssues;
    const prosCons = (signal.uniqueProsConsCount ?? 0) >= QUALITY_THRESHOLDS.engineUniqueProsCons;
    if (section === 'kronik') return issues;
    if (section === 'artilar') return prosCons;
    if (section !== 'genel-bakis') return false;
    return issues || prosCons;
}

export function isDictionaryIndexable(term: RecordData, signal: SimilaritySignal = {}): boolean {
    return visibleText(term.description).length >= QUALITY_THRESHOLDS.dictionaryCharacters
        && signal.hasNearDuplicate === false;
}

export function isGuideIndexable(guide: RecordData, context: SimilaritySignal & { text?: string; kind?: string } = {}): boolean {
    if (context.kind === 'utility-template') return SUPPORTING_TEMPLATE_INDEXABLE;
    if (context.kind === 'verified-market') return guide.status === 'verified';
    if (context.kind === 'functional-utility') return Boolean(guide.title || guide.name)
        && visibleText(context.text || guide.description || guide.introText).length >= 120;
    const minimum = context.kind === 'article' ? QUALITY_THRESHOLDS.articleCharacters : QUALITY_THRESHOLDS.guideCharacters;
    return Boolean(guide.title || guide.name || guide.question || guide.myth || guide.text || guide.ihlal)
        && visibleText(context.text || guide.description || guide.content || guide.answer || guide.truth || guide.text).length >= minimum
        && (context.hasNearDuplicate === false || context.isRepresentative === true);
}

export function threadIndexDecision({ title, visibleEntryCount, content, data }: {
    title: string; visibleEntryCount: number; content: string; data: Record<string, unknown>;
}) {
    const reasons: string[] = [];
    if (title.trim().length < 5) reasons.push('short-title');
    if (visibleEntryCount < 1) reasons.push('no-visible-entry');
    if (visibleText(content).length < QUALITY_THRESHOLDS.threadCharacters) reasons.push('content-under-200-characters');
    const moderation = String(data.moderationStatus || data.status || '').toLowerCase();
    if (data.spam === true || data.isSpam === true || data.spamSuspected === true || data.reportedAsSpam === true
        || ['spam', 'suspected_spam', 'spam_suspected', 'suspected-spam', 'flagged_spam'].includes(moderation)) reasons.push('spam-moderation-signal');
    return { indexable: reasons.length === 0, reasons };
}

export const isThreadIndexable = (thread: Parameters<typeof threadIndexDecision>[0]) => threadIndexDecision(thread).indexable;
