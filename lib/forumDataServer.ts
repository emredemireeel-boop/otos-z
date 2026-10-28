import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { FieldPath } from 'firebase-admin/firestore';
import { getForumIndexDecision } from '@/lib/forum-index-policy';
import { normalizeForumCategory } from '@/lib/forum-hub';
import { getAdminDb, initError } from '@/lib/firebaseAdmin';
import { createSeoSlug } from '@/lib/slug';
import {
    getPublicFirestoreDocument,
    runPublicFirestoreQuery,
    type PublicFirestoreDocument,
} from '@/lib/forumPublicServer';

export interface ForumSeoEntry {
    id: string;
    username: string;
    content: string;
    createdAt: number | null;
    likes: number;
}

export interface ForumSeoThread {
    id: string;
    slug: string;
    title: string;
    category: string;
    description: string;
    authorUsername: string;
    createdAt: number | null;
    lastEntryAt: number | null;
    entryCount: number;
    views: number;
    entries: ForumSeoEntry[];
    indexable: boolean;
    indexReasons: string[];
}

export interface ForumSeoSummary {
    id: string;
    slug: string;
    title: string;
    category: string;
    description: string;
    authorUsername: string;
    createdAt: number | null;
    lastEntryAt: number | null;
    entryCount: number;
    views: number;
    indexable: boolean;
}

interface PortableDocument {
    id: string;
    data: Record<string, any>;
}

function timestampToMillis(value: any): number | null {
    if (!value) return null;
    if (typeof value.toMillis === 'function') return value.toMillis();
    if (typeof value.toDate === 'function') return value.toDate().getTime();
    if (typeof value.seconds === 'number') return value.seconds * 1000;
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : null;
}

function isHiddenThread(data: Record<string, any>): boolean {
    const status = String(data.status || '').toLocaleLowerCase('tr-TR');
    return data.deleted === true
        || data.hidden === true
        || ['deleted', 'hidden', 'spam', 'rejected', 'silindi', 'gizli', 'reddedildi'].includes(status);
}

function toPortable(document: PublicFirestoreDocument): PortableDocument {
    return { id: document.id, data: document.data };
}

function summaryFromThread(thread: ForumSeoThread): ForumSeoSummary {
    return {
        id: thread.id, slug: thread.slug, title: thread.title,
        category: thread.category,
        description: plainTextExcerpt(thread.description || thread.entries[0]?.content || '', 240),
        authorUsername: thread.authorUsername, createdAt: thread.createdAt,
        lastEntryAt: thread.lastEntryAt, entryCount: thread.entryCount,
        views: thread.views, indexable: thread.indexable,
    };
}

async function getAdminCatalog(): Promise<ForumSeoThread[]> {
    const db = getAdminDb();
    const documents: PortableDocument[] = [];
    let cursor: FirebaseFirestore.QueryDocumentSnapshot | undefined;
    while (true) {
        let query = db.collection('threads').orderBy(FieldPath.documentId()).limit(500);
        if (cursor) query = query.startAfter(cursor);
        const batch = await query.get();
        documents.push(...batch.docs.map(doc => ({ id: doc.id, data: doc.data() })));
        if (batch.size < 500) break;
        cursor = batch.docs.at(-1);
    }
    const results: ForumSeoThread[] = [];
    const visible = documents.filter(document => !isHiddenThread(document.data));
    for (let offset = 0; offset < visible.length; offset += 4) {
        const batch = await Promise.all(visible.slice(offset, offset + 4).map(async document => {
            const snapshot = await db.collection('threads').doc(document.id).collection('entries')
                .orderBy(FieldPath.documentId()).limit(50).get();
            return buildSeoThread({ document,
                entries: snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })) });
        }));
        results.push(...batch.filter((thread): thread is ForumSeoThread => Boolean(thread)));
    }
    return results;
}

async function getPublicCatalog(): Promise<ForumSeoThread[]> {
    const documents: PortableDocument[] = [];
    let cursor: string | undefined;
    while (true) {
        const batch = await runPublicFirestoreQuery({ collectionId: 'threads', limit: 500,
            orderBy: { field: '__name__', direction: 'ASCENDING' }, startAfterDocument: cursor });
        documents.push(...batch.map(toPortable));
        if (batch.length < 500) break;
        cursor = `threads/${batch.at(-1)!.id}`;
    }
    const results: ForumSeoThread[] = [];
    const visible = documents.filter(document => !isHiddenThread(document.data));
    for (let offset = 0; offset < visible.length; offset += 4) {
        const batch = await Promise.all(visible.slice(offset, offset + 4).map(async document => {
            const entries = await runPublicFirestoreQuery({ collectionId: 'entries',
                parent: `threads/${document.id}`, limit: 50,
                orderBy: { field: '__name__', direction: 'ASCENDING' } });
            return buildSeoThread({ document, entries: entries.map(toPortable) });
        }));
        results.push(...batch.filter((thread): thread is ForumSeoThread => Boolean(thread)));
    }
    console.info('Forum public fallback counts:', { documents: documents.length,
        visibleThreads: results.length, indexableThreads: results.filter(thread => thread.indexable).length });
    return results;
}

// Proje Cache Components kullanmıyor: 900 saniyelik ortak veri önbelleği,
// metadata, hub, RSS ve sitemap kararlarının aynı içerikten üretilmesini sağlar.
const readForumCatalog = unstable_cache(async (): Promise<ForumSeoThread[]> => {
    if (!initError) {
        try { return await getAdminCatalog(); }
        catch { console.warn('Forum Admin catalog failed; public fallback will be used.'); }
    } else {
        console.warn('Forum Admin unavailable; public fallback will be used.');
    }
    return getPublicCatalog();
}, ['forum-visible-catalog-v2'], { revalidate: 900, tags: ['forum'] });

export const getForumCatalog = cache(async () => (await readForumCatalog())
    .sort((a, b) => (b.lastEntryAt || b.createdAt || 0) - (a.lastEntryAt || a.createdAt || 0)
        || a.slug.localeCompare(b.slug, 'tr')));

export const getRecentForumThreadSummaries = cache(async (limit = 1200): Promise<ForumSeoSummary[]> =>
    (await getForumCatalog()).filter(thread => thread.entries.length > 0)
        .slice(0, Math.max(0, limit)).map(summaryFromThread));

export const getForumHubThreadSummaries = cache(async (categoryName: string | null): Promise<ForumSeoSummary[]> =>
    (await getForumCatalog()).filter(thread => thread.entries.length > 0
        && (!categoryName || normalizeForumCategory(thread.category) === categoryName))
        .map(thread => ({ ...summaryFromThread(thread), category: normalizeForumCategory(thread.category) })));

export const getIndexableForumThreadSummaries = cache(async (): Promise<ForumSeoSummary[]> =>
    (await getForumCatalog()).filter(thread => thread.indexable && thread.entries.length > 0).map(summaryFromThread));

async function getAdminThread(requestedSlug: string): Promise<{ document: PortableDocument; entries: PortableDocument[] } | null> {
    const db = getAdminDb();
    const urlIdText = requestedSlug.split('--').at(-1) || '';
    const urlId = /^\d{8}$/.test(urlIdText) ? Number(urlIdText) : null;
    let threadDoc: FirebaseFirestore.DocumentSnapshot | null = null;

    if (urlId !== null) {
        const snapshot = await db.collection('threads').where('urlId', '==', urlId).limit(1).get();
        if (!snapshot.empty) threadDoc = snapshot.docs[0];
    }
    if (!threadDoc) {
        const snapshot = await db.collection('threads').doc(requestedSlug).get();
        if (snapshot.exists) threadDoc = snapshot;
    }
    if (!threadDoc?.exists) return null;

    const entrySnapshot = await threadDoc.ref.collection('entries').orderBy('createdAt', 'asc').limit(50).get();
    return {
        document: { id: threadDoc.id, data: threadDoc.data() || {} },
        entries: entrySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })),
    };
}

async function getPublicThread(requestedSlug: string): Promise<{ document: PortableDocument; entries: PortableDocument[] } | null> {
    const urlIdText = requestedSlug.split('--').at(-1) || '';
    const urlId = /^\d{8}$/.test(urlIdText) ? Number(urlIdText) : null;
    let document: PublicFirestoreDocument | null = null;

    if (urlId !== null) {
        const matches = await runPublicFirestoreQuery({
            collectionId: 'threads',
            where: { field: 'urlId', value: urlId },
            limit: 1,
        });
        document = matches[0] || null;
    }
    if (!document) document = await getPublicFirestoreDocument('threads', requestedSlug);
    if (!document) return null;

    const entries = await runPublicFirestoreQuery({
        collectionId: 'entries',
        parent: `threads/${document.id}`,
        orderBy: { field: 'createdAt', direction: 'ASCENDING' },
        limit: 50,
    });
    return { document: toPortable(document), entries: entries.map(toPortable) };
}

function buildSeoThread(result: { document: PortableDocument; entries: PortableDocument[] }): ForumSeoThread | null {
    const data = result.document.data;
    if (isHiddenThread(data)) return null;

    const entries = result.entries.filter(document => !isHiddenThread(document.data)).map(document => {
        const entry = document.data;
        return {
            id: document.id,
            username: String(entry.username || 'OtoSöz üyesi'),
            content: String(entry.content || '').trim(),
            createdAt: timestampToMillis(entry.createdAt),
            likes: Number(entry.likes || 0),
        };
    }).filter(entry => entry.content.length > 0)
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0) || a.id.localeCompare(b.id));

    const title = String(data.title || '').trim();
    const firstEntry = entries[0];
    const decision = getForumIndexDecision({ title, visibleEntryCount: entries.length,
        content: entries.map(entry => entry.content).join(' '), data });
    return {
        id: result.document.id,
        slug: data.urlId ? `${createSeoSlug(title)}--${data.urlId}` : result.document.id,
        title,
        category: String(data.category || 'Genel'),
        description: String(data.description || '').trim(),
        authorUsername: String(data.authorUsername || firstEntry?.username || 'OtoSöz üyesi'),
        createdAt: timestampToMillis(data.createdAt) || firstEntry?.createdAt || null,
        lastEntryAt: Math.max(timestampToMillis(data.lastEntryAt) || 0,
            entries.at(-1)?.createdAt || 0, timestampToMillis(data.createdAt) || 0) || null,
        entryCount: Math.max(Number(data.entryCount || 0), entries.length),
        views: Number(data.views || 0),
        entries,
        indexable: decision.indexable,
        indexReasons: decision.reasons,
    };
}

export const getForumThreadSeo = cache(async (requestedSlug: string): Promise<ForumSeoThread | null> => {
    const routeId = requestedSlug.split('--').at(-1);
    const cached = (await getForumCatalog()).find(thread => thread.slug === requestedSlug || thread.id === requestedSlug
        || (/^\d{8}$/.test(routeId || '') && thread.slug.endsWith(`--${routeId}`)));
    if (cached) return cached;
    if (!initError) {
        try {
            const result = await getAdminThread(requestedSlug);
            if (result) return buildSeoThread(result);
        } catch (error) {
            console.error('Forum Admin SEO fetch failed; public fallback will be used:', error);
        }
    }
    try {
        const result = await getPublicThread(requestedSlug);
        return result ? buildSeoThread(result) : null;
    } catch (error) {
        console.error('Forum public SEO fetch error:', error);
        return null;
    }
});

export function plainTextExcerpt(value: string, maxLength = 160): string {
    return value
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[*_#>`~\-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength);
}
