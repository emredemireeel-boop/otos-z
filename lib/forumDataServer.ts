import 'server-only';
import { cache } from 'react';
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

function summaryFromDocument(document: PortableDocument): ForumSeoSummary | null {
    const data = document.data;
    const title = String(data.title || '').trim();
    const entryCount = Number(data.entryCount || 0);
    if (isHiddenThread(data) || title.length < 5 || entryCount < 1) return null;

    return {
        id: document.id,
        slug: data.urlId ? `${createSeoSlug(title)}--${data.urlId}` : document.id,
        title,
        category: String(data.category || 'Genel'),
        description: String(data.description || data.seoExcerpt || '').trim(),
        authorUsername: String(data.authorUsername || 'OtoSöz üyesi'),
        createdAt: timestampToMillis(data.createdAt),
        lastEntryAt: timestampToMillis(data.lastEntryAt) || timestampToMillis(data.createdAt),
        entryCount,
        views: Number(data.views || 0),
    };
}

function mergeSummaries(documents: PortableDocument[], limit: number): ForumSeoSummary[] {
    const unique = new Map<string, ForumSeoSummary>();
    documents.forEach(document => {
        const summary = summaryFromDocument(document);
        if (summary) unique.set(document.id, summary);
    });
    return [...unique.values()]
        .sort((a, b) => (b.lastEntryAt || b.createdAt || 0) - (a.lastEntryAt || a.createdAt || 0))
        .slice(0, limit);
}

async function getAdminRecentSummaries(limit: number): Promise<ForumSeoSummary[]> {
    const fetchLimit = Math.min(Math.max(limit, 1), 1200);
    const db = getAdminDb();
    const [recentlyCreated, recentlyActive] = await Promise.all([
        db.collection('threads').orderBy('createdAt', 'desc').limit(fetchLimit).get(),
        db.collection('threads').orderBy('lastEntryAt', 'desc').limit(fetchLimit).get(),
    ]);
    return mergeSummaries(
        [...recentlyCreated.docs, ...recentlyActive.docs].map(doc => ({ id: doc.id, data: doc.data() })),
        limit,
    );
}

async function getPublicRecentSummaries(limit: number): Promise<ForumSeoSummary[]> {
    const fetchLimit = Math.min(Math.max(limit, 1), 1200);
    const [recentlyCreated, recentlyActive] = await Promise.all([
        runPublicFirestoreQuery({
            collectionId: 'threads',
            orderBy: { field: 'createdAt', direction: 'DESCENDING' },
            limit: fetchLimit,
        }),
        runPublicFirestoreQuery({
            collectionId: 'threads',
            orderBy: { field: 'lastEntryAt', direction: 'DESCENDING' },
            limit: fetchLimit,
        }),
    ]);
    return mergeSummaries([...recentlyCreated, ...recentlyActive].map(toPortable), limit);
}

export const getRecentForumThreadSummaries = cache(async (limit = 1200): Promise<ForumSeoSummary[]> => {
    if (!initError) {
        try {
            return await getAdminRecentSummaries(limit);
        } catch (error) {
            console.error('Forum Admin summary fetch failed; public fallback will be used:', error);
        }
    }
    try {
        return await getPublicRecentSummaries(limit);
    } catch (error) {
        console.error('Forum public summary fetch error:', error);
        return [];
    }
});

export const getForumHubThreadSummaries = cache(async (categoryName: string | null): Promise<ForumSeoSummary[]> => {
    if (!categoryName) return (await getRecentForumThreadSummaries(100)).slice(0, 50);

    if (!initError) {
        try {
            const snapshot = await getAdminDb().collection('threads').where('category', '==', categoryName).limit(100).get();
            return mergeSummaries(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })), 50);
        } catch (error) {
            console.error('Forum Admin category fetch failed; public fallback will be used:', error);
        }
    }
    try {
        const documents = await runPublicFirestoreQuery({
            collectionId: 'threads',
            where: { field: 'category', value: categoryName },
            limit: 100,
        });
        return mergeSummaries(documents.map(toPortable), 50);
    } catch (error) {
        console.error('Forum public category fetch error:', error);
        return [];
    }
});

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

    const entries = result.entries.map(document => {
        const entry = document.data;
        return {
            id: document.id,
            username: String(entry.username || 'OtoSöz üyesi'),
            content: String(entry.content || '').trim(),
            createdAt: timestampToMillis(entry.createdAt),
            likes: Number(entry.likes || 0),
        };
    }).filter(entry => entry.content.length > 0);

    const title = String(data.title || '').trim();
    const firstEntry = entries[0];
    return {
        id: result.document.id,
        slug: data.urlId ? `${createSeoSlug(title)}--${data.urlId}` : result.document.id,
        title,
        category: String(data.category || 'Genel'),
        description: String(data.description || '').trim(),
        authorUsername: String(data.authorUsername || firstEntry?.username || 'OtoSöz üyesi'),
        createdAt: timestampToMillis(data.createdAt) || firstEntry?.createdAt || null,
        lastEntryAt: timestampToMillis(data.lastEntryAt) || timestampToMillis(data.createdAt),
        entryCount: Math.max(Number(data.entryCount || 0), entries.length),
        views: Number(data.views || 0),
        entries,
        indexable: title.length >= 5 && Boolean(firstEntry && firstEntry.content.length >= 20),
    };
}

export const getForumThreadSeo = cache(async (requestedSlug: string): Promise<ForumSeoThread | null> => {
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
