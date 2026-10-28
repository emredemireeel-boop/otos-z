import { readFile, writeFile } from 'node:fs/promises';
import nextEnv from '@next/env';
import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

nextEnv.loadEnvConfig(process.cwd());
const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const endpoint = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents`;
function decode(value = {}) {
    if ('stringValue' in value) return value.stringValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return value.doubleValue;
    if ('booleanValue' in value) return value.booleanValue;
    if ('timestampValue' in value) return value.timestampValue;
    if ('arrayValue' in value) return (value.arrayValue.values || []).map(decode);
    if ('mapValue' in value) return fields(value.mapValue.fields);
    return null;
}
const fields = values => Object.fromEntries(Object.entries(values || {}).map(([key, value]) => [key, decode(value)]));
const document = doc => ({ id: doc.name.split('/').at(-1), data: fields(doc.fields) });
async function query(collectionId, orderField, parent, limit = 2000, cursor) {
    const structuredQuery = { from: [{ collectionId }], limit,
        orderBy: [{ field: { fieldPath: orderField }, direction: orderField === '__name__' ? 'ASCENDING' : 'DESCENDING' }] };
    if (cursor) structuredQuery.startAt = { values: [{ referenceValue: `projects/${project}/databases/(default)/documents/${cursor}` }], before: false };
    const response = await fetch(`${endpoint}${parent ? '/' + parent : ''}:runQuery?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ structuredQuery }), signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()).filter(row => row.document).map(row => document(row.document));
}
const hidden = data => data.hidden === true || data.deleted === true
    || ['deleted', 'hidden', 'spam', 'rejected', 'silindi', 'gizli', 'reddedildi'].includes(String(data.status || '').toLocaleLowerCase('tr-TR'));

async function main() {
    const [all, created, active] = await Promise.all([
        query('threads', '__name__'), query('threads', 'createdAt'), query('threads', 'lastEntryAt'),
    ]);
    const report = { checkedAt: new Date().toISOString(), writes: false,
        public: { documents: all.length, createdQuery: created.length, activeQuery: active.length,
            oldQueryUnion: new Set([...created, ...active].map(row => row.id)).size },
        admin: {}, threads: [] };
    const paginated = [];
    let cursor;
    do {
        const batch = await query('threads', '__name__', undefined, 5, cursor);
        paginated.push(...batch);
        if (batch.length < 5) break;
        cursor = `threads/${batch.at(-1).id}`;
    } while (true);
    report.public.cursorPagination = { batchSize: 5, documents: paginated.length,
        matchesUnpaginatedIds: paginated.length === all.length && paginated.every(row => all.some(item => item.id === row.id)) };
    let adminDb;
    try {
        let raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!raw) { try { raw = await readFile('otosoz-admin.json', 'utf8'); } catch { /* ADC fallback */ } }
        const service = raw ? JSON.parse(raw) : null;
        if (service?.private_key) service.private_key = service.private_key.replace(/\\n/g, '\n');
        const app = initializeApp({ credential: service ? cert(service) : applicationDefault(), projectId: project }, 'seo-forum-audit');
        adminDb = getFirestore(app);
        const snapshot = await adminDb.collection('threads').get();
        report.admin = { available: true, documents: snapshot.size,
            sameDocumentIdsAsPublic: snapshot.docs.every(doc => all.some(row => row.id === doc.id)) && snapshot.size === all.length };
    } catch (error) {
        report.admin = { available: false, code: String(error.code || 'unavailable') };
    } finally {
        if (adminDb) await adminDb.terminate();
    }
    // Yalnızca gerçek kayıtlar okunur; rapora entry metinleri veya özel kullanıcı alanları yazılmaz.
    for (let offset = 0; offset < all.length; offset += 4) {
        report.threads.push(...await Promise.all(all.slice(offset, offset + 4).map(async row => {
            const entries = hidden(row.data) ? [] : await query('entries', '__name__', `threads/${row.id}`);
            const visibleEntries = entries.filter(entry => !hidden(entry.data) && String(entry.data.content || '').trim());
            const content = visibleEntries.map(entry => String(entry.data.content).trim()).join(' ');
            return { id: row.id, title: String(row.data.title || ''), category: String(row.data.category || 'Genel'),
                hidden: hidden(row.data), storedEntryCount: Number(row.data.entryCount || 0),
                storedCountPresent: 'entryCount' in row.data, actualEntries: entries.length,
                visibleEntries: visibleEntries.length, visibleContentCharacters: content.length,
                descriptionCharacters: String(row.data.description || row.data.seoExcerpt || '').length,
                hasCreatedAt: Boolean(row.data.createdAt), hasLastEntryAt: Boolean(row.data.lastEntryAt),
                moderationFields: Object.keys(row.data).filter(key => /spam|moderat|status|hidden|deleted/i.test(key)),
                oldSummaryIncluded: !hidden(row.data) && String(row.data.title || '').trim().length >= 5 && Number(row.data.entryCount || 0) >= 1 };
        })));
    }
    const visible = report.threads.filter(thread => !thread.hidden);
    report.findings = { visibleThreads: visible.length, hiddenThreads: all.length - visible.length,
        oldSummaryCount: report.threads.filter(thread => thread.oldSummaryIncluded).length,
        threadsWithVisibleEntries: visible.filter(thread => thread.visibleEntries >= 1).length,
        missingStoredCountWithActualEntries: visible.filter(thread => thread.storedEntryCount < 1 && thread.visibleEntries >= 1).length,
        storedCountMismatches: visible.filter(thread => thread.storedEntryCount !== thread.visibleEntries).length,
        emptyThreads: visible.filter(thread => thread.visibleEntries === 0).length,
        singleEntryUnder200Characters: visible.filter(thread => thread.visibleEntries === 1 && thread.visibleContentCharacters < 200).length,
        belowOldQueryUnion: all.filter(thread => ![...created, ...active].some(row => row.id === thread.id)).length };
    const path = process.argv[2] || 'docs/seo/step02-forum-data-audit-20261029.json';
    await writeFile(path, JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ public: report.public, admin: report.admin, findings: report.findings }, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
