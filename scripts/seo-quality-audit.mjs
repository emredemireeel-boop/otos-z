import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { loadSource } from './seo-quality-loader.mjs';

const quality = loadSource('lib/indexability.ts');
const { vehicleDNAData, createSlug, isVehicleEditoriallyReviewed } = loadSource('data/vehicle-dna.ts');
const { engineDNAData } = loadSource('data/engine-dna.ts');
const { trimLevelsData } = loadSource('data/trim-levels.ts');
const { dictionaryTerms: rawDictionaryTerms } = loadSource('data/dictionary.ts');
const { reviewedObdCodes } = loadSource('data/obd-reviewed.ts');
const { obdCodes, indexableObdCodes: beforeObd } = loadSource('lib/obd-catalog.ts');
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8').replace(/^\uFEFF/, ''));
const normalized = text => quality.visibleText(text).toLocaleLowerCase('tr-TR').replace(/ı/g, 'i')
    .normalize('NFKD').replace(/\p{M}/gu, '').replace(/\b[pbcu][0-3][0-9a-f]{3}\b/gi, 'kod')
    .match(/[\p{L}\p{N}]+/gu)?.join(' ') || '';
const shingles = text => {
    const words = normalized(text).split(' ').filter(Boolean);
    const result = new Set();
    for (let index = 0; index + 6 <= words.length; index++) result.add(words.slice(index, index + 6).join(' '));
    return result;
};
function similarity(left, right) {
    if (!left.size || !right.size) return 0;
    const small = left.size <= right.size ? left : right;
    const large = left.size <= right.size ? right : left;
    let intersection = 0;
    for (const shingle of small) if (large.has(shingle)) intersection++;
    return intersection / (left.size + right.size - intersection);
}
function compare(records, threshold, label) {
    const sets = records.map(record => shingles(record.text));
    const maximum = records.map(() => 0);
    const pairs = [];
    for (let i = 0; i < records.length; i++) {
        for (let j = 0; j < i; j++) {
            const score = similarity(sets[i], sets[j]);
            maximum[i] = Math.max(maximum[i], score); maximum[j] = Math.max(maximum[j], score);
            if (score > (pairs.length < 15 ? 0 : pairs.at(-1).similarity)) {
                pairs.push({ left: records[j].id, right: records[i].id, similarity: Number(score.toFixed(6)) });
                pairs.sort((a, b) => b.similarity - a.similarity); pairs.length = Math.min(15, pairs.length);
            }
        }
        if (i > 0 && i % 1000 === 0) console.log(`${label}: compared ${i}/${records.length}`);
    }
    return { signals: Object.fromEntries(records.map((record, index) => [record.id, {
        maxSimilarity: maximum[index], hasNearDuplicate: maximum[index] >= threshold,
    }])), mostSimilarPairs: pairs, threshold, method: 'Exact pairwise Jaccard over normalized six-word shingles' };
}
const content = quality.qualityContentText;
const firstBy = (items, key) => [...items.reduce((map, item) => {
    const id = key(item); if (!map.has(id)) map.set(id, item); return map;
}, new Map()).values()];
const count = (items, predicate) => ({ total: items.length, indexable: items.filter(predicate).length,
    noindex: items.filter(item => !predicate(item)).length });
const emptyFields = (items, fields) => Object.fromEntries(fields.map(field => [field, items.filter(item =>
    item[field] == null || item[field] === '' || (Array.isArray(item[field]) && !item[field].length)).length]));
const canonicalDictionaryId = loadSource('lib/seoUrls.ts').getCanonicalDictionaryId;
const dictionaryTerms = firstBy(rawDictionaryTerms.filter(term => canonicalDictionaryId(term.id) === term.id), term => term.id);

const obdSimilarity = compare(obdCodes.map(code => ({ id: code.code,
    text: [code.title, code.description, ...code.causes, ...code.fixes].join(' ') })), quality.QUALITY_THRESHOLDS.obdSimilarity, 'OBD');
const adviceFrequency = new Map();
for (const code of obdCodes) for (const field of ['causes', 'fixes']) for (const item of new Set(code[field])) {
    const key = `${field}:${normalized(item)}`; adviceFrequency.set(key, (adviceFrequency.get(key) || 0) + 1);
}
const obdSignals = Object.fromEntries(obdCodes.map(code => [code.code, {
    ...obdSimilarity.signals[code.code], editorialRecord: Object.hasOwn(reviewedObdCodes, code.code),
    specificCauses: code.causes.filter(item => (adviceFrequency.get(`causes:${normalized(item)}`) || 0) <= 3).length,
    specificChecks: code.fixes.filter(item => (adviceFrequency.get(`fixes:${normalized(item)}`) || 0) <= 3).length,
}]));
const models = firstBy(vehicleDNAData, vehicle => `${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`);
const enginesByVehicle = new Map(firstBy(engineDNAData, record => record.vehicleId).map(record => [record.vehicleId, record.engines]));
const engines = models.flatMap(vehicle => (enginesByVehicle.get(vehicle.id) || []).map(engine => ({ vehicle, engine, id: `${vehicle.id}/${engine.slug}` })));
const modelSimilarity = compare(models.map(vehicle => ({ id: `${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`,
    text: [vehicle.brand, vehicle.model, ...vehicle.strengths, ...vehicle.weaknesses, ...vehicle.chronicIssues.map(issue => `${issue.title} ${issue.description}`)].join(' ') })), 0.85, 'vehicles');
const engineSimilarity = compare(engines.map(({ id, engine }) => ({ id,
    text: [engine.name, engine.description || '', ...(engine.pros || []), ...(engine.cons || []), ...engine.chronicIssues.map(issue => `${issue.title} ${issue.description}`)].join(' ') })), 0.5, 'engines');
const issueFrequency = new Map(), prosConsFrequency = new Map();
for (const { engine } of engines) {
    for (const issue of engine.chronicIssues || []) {
        const key = normalized(`${issue.title} ${issue.description}`); issueFrequency.set(key, (issueFrequency.get(key) || 0) + 1);
    }
    for (const text of [...(engine.pros || []), ...(engine.cons || [])]) {
        const key = normalized(text); prosConsFrequency.set(key, (prosConsFrequency.get(key) || 0) + 1);
    }
}
const engineSignals = Object.fromEntries(engines.map(({ vehicle, engine, id }) => {
    const parentIssues = new Set((vehicle.chronicIssues || []).map(issue => normalized(`${issue.title} ${issue.description}`)));
    const parentProsCons = new Set([...vehicle.strengths, ...vehicle.weaknesses].map(normalized));
    return [id, {
        uniqueIssueCount: (engine.chronicIssues || []).filter(issue => {
            const key = normalized(`${issue.title} ${issue.description}`); return issueFrequency.get(key) === 1 && !parentIssues.has(key);
        }).length,
        uniqueProsConsCount: [...(engine.pros || []), ...(engine.cons || [])].filter(text => prosConsFrequency.get(normalized(text)) === 1 && !parentProsCons.has(normalized(text))).length,
    }];
}));
const dictionarySimilarity = compare(dictionaryTerms.map(term => ({ id: term.id, text: term.description })), quality.QUALITY_THRESHOLDS.dictionarySimilarity, 'dictionary');
const guides = read('public/data/library_guides.json').guides;
const guideSimilarity = compare(guides.map(guide => ({ id: String(guide.id), text: content(guide) })), quality.QUALITY_THRESHOLDS.guideSimilarity, 'articles');
const articleActions = [];
for (const pair of guideSimilarity.mostSimilarPairs.filter(pair => pair.similarity >= quality.QUALITY_THRESHOLDS.guideSimilarity)) {
    const left = guides.find(guide => String(guide.id) === pair.left);
    const right = guides.find(guide => String(guide.id) === pair.right);
    const winner = content(left).length >= content(right).length ? left : right;
    const loser = winner === left ? right : left;
    guideSimilarity.signals[winner.id].isRepresentative = true;
    guideSimilarity.signals[loser.id].isRepresentative = false;
    const slug = loadSource('lib/slug.ts').createSeoSlug;
    articleActions.push({ source: `/makale/${slug(loser.title)}--${loser.urlId || loser.id}`,
        proposedStatus: 308, destination: `/makale/${slug(winner.title)}--${winner.urlId || winner.id}`,
        sixWordJaccard: pair.similarity, status: 'user-selected-noindex-only', appliedHttpStatus: 200, appliedRobots: 'noindex,follow',
        reason: 'Near-duplicate article; representative chosen by longer existing content, without adding text' });
}
const trimFor = vehicle => trimLevelsData.find(item => item.vehicleId === vehicle.id)?.trims || [];
const sections = ['kronik-sorunlar', 'neden-alinir', 'kullanici-deneyimleri', 'arac-paketleri'];
const summary = {
    obd: { ...count(obdCodes, code => quality.isObdIndexable(code, obdSignals[code.code])), catalogueIndexable: beforeObd.length, baselineIndexable: read('data/seo-quality/obd-directory-codes.json').codes.length,
        rawRecords: read('data/obd-codes.json').length, editorialRecords: Object.keys(reviewedObdCodes).length,
        emptyFields: emptyFields(obdCodes, ['description', 'causes', 'fixes', 'sources']), mostSimilarPairs: obdSimilarity.mostSimilarPairs },
    vehicle: { ...count(models, quality.isVehicleIndexable), rawRecords: vehicleDNAData.length,
        currentlyReviewed: models.filter(isVehicleEditoriallyReviewed).length, emptyFields: emptyFields(models, ['strengths', 'weaknesses', 'chronicIssues', 'userExperiences']), mostSimilarPairs: modelSimilarity.mostSimilarPairs },
    vehicleSections: Object.fromEntries(sections.map(section => [section, count(models, vehicle => quality.isVehicleSectionIndexable(vehicle, section, { trims: trimFor(vehicle) }))])),
    engine: { ...count(engines, ({ vehicle, engine, id }) => quality.isEngineIndexable(vehicle, engine, engineSignals[id])),
        emptyFields: emptyFields(engines.map(item => item.engine), ['description', 'pros', 'cons', 'chronicIssues']), mostSimilarPairs: engineSimilarity.mostSimilarPairs },
    dictionary: { ...count(dictionaryTerms, term => quality.isDictionaryIndexable(term, dictionarySimilarity.signals[term.id])), rawRecords: rawDictionaryTerms.length,
        emptyFields: emptyFields(dictionaryTerms, ['description']), mostSimilarPairs: dictionarySimilarity.mostSimilarPairs },
    article: { ...count(guides, guide => quality.isGuideIndexable(guide, { ...guideSimilarity.signals[guide.id], text: content(guide), kind: 'article' })),
        emptyFields: emptyFields(guides, ['title', 'description', 'sections']), mostSimilarPairs: guideSimilarity.mostSimilarPairs },
};
const guideGroups = {};
const howto = read('data/nasil-yapilir.json').categories.flatMap(category => category.guides || []);
const factData = read('public/data/interesting_information.json').interestingFacts;
const facts = firstBy(['dailyTips', 'quickFacts', 'mythBusters', 'checklists', 'doAndDont'].flatMap(key => factData[key] || []), item => item.id);
const { mythsData } = loadSource('data/efsane-avcilari-data.ts');
const otherGuideRecords = {};
const guideSignals = {};
for (const [kind, items] of [['howto', howto], ['interesting', facts], ['myth', mythsData], ['warningLight', read('data/fault_lights.json').warningLights],
    ['news', read('public/data/news_posts.json').posts], ['trafficFine', read('data/trafik_cezalari.json').categories.flatMap(category => category.rows)], ['toll', read('public/data/otoyol_ucretleri.json')]]) {
    otherGuideRecords[kind] = items;
    const measured = compare(items.map((item, index) => ({ id: String(item.id || item.slug || index), text: content(item) })), 0.85, kind);
    guideSignals[kind] = measured.signals;
    guideGroups[kind] = { emptyFields: emptyFields(items, ['title', 'description', 'sources']), ...count(items, guide => quality.isGuideIndexable(guide, { ...measured.signals[String(guide.id || guide.slug || items.indexOf(guide))], text: content(guide), kind })), mostSimilarPairs: measured.mostSimilarPairs };
}
const supportingTemplates = {};
for (const [kind, items] of [
    ['bodyType', read('data/arac_segmentleri.json').bodyTypes], ['segment', read('data/arac_segmentleri.json').segments],
    ['plate', [...read('data/plaka_kodlari.json').iller, ...read('data/plaka_kodlari.json').ozelPlakalar]],
    ['license', read('data/ehliyet_siniflari.json').siniflar], ['inspectionFaq', read('data/tuvturk_faq.json')],
    ['maintenance', read('data/bakim_icerikleri.json').bakim_icerikleri], ['usedCarChecklist', read('data/ikinci_el_kontrol.json').ikinci_el_icerikleri],
]) {
    const measured = compare(items.map((item, index) => ({ id: String(item.id || item.slug || index), text: content(item) })), quality.QUALITY_THRESHOLDS.guideSimilarity, kind);
    supportingTemplates[kind] = { ...count(items, item => quality.isGuideIndexable(item, { kind: 'utility-template' })),
        emptyReadableRecords: items.filter(item => !quality.visibleText(content(item))).length, mostSimilarPairs: measured.mostSimilarPairs,
        reason: 'Supporting reference templates have no curated indexing eligibility; remain available to explicit user navigation.' };
}
const priceRecords = read('data/kasko_deger.json').araclar;
supportingTemplates.insuranceValue = { ...count(priceRecords, item => quality.isGuideIndexable(item, { kind: 'utility-template' })),
    emptyReadableRecords: priceRecords.filter(item => !quality.visibleText(content(item))).length,
    mostSimilarPairs: [], similarityMeasurement: 'Not applicable: structured vehicle/year/price rows; no editorial body to compare.' };
const forumAudit = read('docs/seo/step02-forum-data-audit-20261029.json');
summary.thread = { snapshotOnly: true, total: forumAudit.findings.visibleThreads, indexable: forumAudit.threads.filter(thread => !thread.hidden && thread.visibleEntries >= 1 && thread.visibleContentCharacters >= quality.QUALITY_THRESHOLDS.threadCharacters && thread.title.length >= 5).length,
    noindex: forumAudit.threads.filter(thread => !thread.hidden && (thread.visibleEntries < 1 || thread.visibleContentCharacters < quality.QUALITY_THRESHOLDS.threadCharacters || thread.title.length < 5)).length,
    sourceCheckedAt: forumAudit.checkedAt };
const performancePath = 'docs/seo/performance-20261022/Sayfa sayısı.csv';
const performance = fs.existsSync(performancePath)
    ? fs.readFileSync(performancePath, 'utf8').trim().split(/\r?\n/).slice(1)
    : read('docs/seo/quality-audit-20261029.json').historicalObd.records.map(row => [row.url, row.clicks, row.impressions].join(','));

const historical = performance.map(line => line.split(',')).filter(row => /\/obd\//i.test(row[0]) && Number(row[1]) > 0)
    .map(row => { const last = row[0].split('/').at(-1); const code = /^[pbcu][0-9a-f]{4}$/i.test(last) ? last.toUpperCase() : null; const record = obdCodes.find(item => item.code === code);
        return { code, url: row[0], kind: code ? (row[0].split('/').length > 5 ? 'legacy-brand-code' : 'code') : 'brand-hub', clicks: Number(row[1]), impressions: Number(row[2]), exists: code ? Boolean(record) : 'brand-route-check',
            editorialRecord: Boolean(obdSignals[code]?.editorialRecord), proposedIndexable: Boolean(record && quality.isObdIndexable(record, obdSignals[code])),
            proposedHttpStatus: record ? 200 : 'existing-missing-record', reviewPriority: 'historical-clicks' }; });

const snapshot = read('docs/seo/step02-sitemap-check-20261029.json').results.map(row => row.url);
const { isSeoUrlIndexable } = loadSource('lib/seo-index-catalog.ts');
const { normalizeForumCategory } = loadSource('lib/forum-hub.ts');
const { createSeoSlug } = loadSource('lib/slug.ts');
const categoryCounts = new Map();
for (const thread of forumAudit.threads.filter(thread => !thread.hidden)) {
    const slug = createSeoSlug(normalizeForumCategory(thread.category));
    categoryCounts.set(slug, (categoryCounts.get(slug) || 0) + 1);
}
const indexableThreads = new Set(snapshot.filter(url => /^https:\/\/otosoz\.com\/forum\/[^/]+$/.test(url)).map(url => new URL(url).pathname.split('/').at(-1)));
const projected = snapshot.filter(url => isSeoUrlIndexable(url, { indexableThreads, categoryCounts }));
const projectedByPrefix = {};
for (const url of projected) { const prefix = new URL(url).pathname.split('/')[1] || 'home'; projectedByPrefix[prefix] = (projectedByPrefix[prefix] || 0) + 1; }
const report = { checkedAt: new Date().toISOString(), mode: 'applied-policy-audit', httpChangesApplied: false,
    thresholds: quality.QUALITY_THRESHOLDS, method: { shingleWords: 6, similarity: 'exact pairwise Jaccard',
        normalizesCodeTokens: true, specificObdAdvice: 'Exact normalized advice text occurs in at most 3 catalogue records',
        uniqueEngineItems: 'Exact normalized item occurs once across engines and is absent from its parent model' },
    summary, otherGuideTypes: guideGroups, supportingTemplates,
    projection: { currentSitemap: snapshot.length, proposedCoreSitemap: projected.length, byPrefix: projectedByPrefix,
        note: 'Evaluated through the same URL registry used by sitemap. Personal agenda and empty dictionary/indicator promotion categories are excluded. HTTP routes are unchanged.' },
    historicalObd: { source: performancePath, usesSavedPerformanceSnapshot: !fs.existsSync(performancePath), clickedUrls: historical.length, preservedIndexable: historical.filter(item => item.proposedIndexable).length,
        manualReviewQueue: historical.filter(item => !item.proposedIndexable).length, records: historical },
    proposedUrlActionsRequiringApproval: articleActions,
    notes: ['The audit only measures data; --write-signals explicitly refreshes local measurements. No remote data is written.',
        'A low similarity score is a textual measurement, not evidence that mechanical claims are correct.',
        'Traffic history does not override the source/content quality rules; existing valid historical URLs remain HTTP 200.'] };
const output = process.argv[2]?.startsWith('--') ? undefined : process.argv[2];
const outputPath = output || 'docs/seo/quality-audit-applied-20261029.json';
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n');
const measuredSignals = { obd: obdSignals, engine: engineSignals, dictionary: dictionarySimilarity.signals,
    article: guideSimilarity.signals, guide: guideSignals };
const sourceFiles = ['data/obd-codes.json', 'data/obd-reviewed.ts', 'data/vehicle-dna.ts', 'lib/vehicle-editorial.ts',
    'data/engine-dna.ts', 'data/trim-levels.ts', 'data/dictionary.ts', 'public/data/library_guides.json',
    'data/nasil-yapilir.json', 'public/data/interesting_information.json', 'data/efsane-avcilari-data.ts',
    'data/fault_lights.json', 'data/trafik_cezalari.json', 'public/data/otoyol_ucretleri.json', 'public/data/news_posts.json'];
const fingerprints = Object.fromEntries(sourceFiles.map(file => [file, createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));
const linkCandidates = { version: 1, fingerprints, records: obdCodes.filter(code => quality.isObdIndexable(code, obdSignals[code.code]))
    .map(code => ({ code: code.code, title: code.title, description: code.description, isGeneric: code.isGeneric,
        sources: code.sources || [], qualitySignal: obdSignals[code.code] })) };
if (process.argv.includes('--write-signals')) {
    fs.writeFileSync('data/seo-quality/link-candidates.json', JSON.stringify(linkCandidates) + '\n');
    for (const kind of ['obd', 'engine', 'dictionary', 'guide']) {
        const records = kind === 'guide' ? { ...guideSignals, article: guideSimilarity.signals } : measuredSignals[kind];
        fs.writeFileSync(`data/seo-quality/${kind}.json`, JSON.stringify({ version: 1, measured: true, fingerprints, records }) + '\n');
    }
    // obd-directory-codes.json is a stable navigation snapshot, never an indexing allowlist.
}
if (process.argv.includes('--check-signals')) {
    if (JSON.stringify(read('data/seo-quality/link-candidates.json')) !== JSON.stringify(linkCandidates)) throw new Error('Stale link candidates');
    for (const kind of ['obd', 'engine', 'dictionary', 'guide']) {
        const saved = read(`data/seo-quality/${kind}.json`);
        const records = kind === 'guide' ? { ...guideSignals, article: guideSimilarity.signals } : measuredSignals[kind];
        if (JSON.stringify(saved.records) !== JSON.stringify(records) || JSON.stringify(saved.fingerprints) !== JSON.stringify(fingerprints)) {
            throw new Error(`Stale ${kind} measurements; rerun audit with --write-signals`);
        }
    }
    console.log('All source fingerprints and measured quality signals match.');
}
console.log(JSON.stringify({ summary: Object.fromEntries(Object.entries(summary).map(([type, value]) => [type,
    value.total === undefined ? value : { total: value.total, indexable: value.indexable, noindex: value.noindex }])),
    otherGuideTypes: guideGroups, projection: report.projection, historicalObd: { total: historical.length,
        indexable: report.historicalObd.preservedIndexable, manualReview: report.historicalObd.manualReviewQueue } }, null, 2));
