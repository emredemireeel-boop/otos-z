import 'server-only';
import { cache } from 'react';
import { getAdminDb, initError } from '@/lib/firebaseAdmin';
import { createSeoSlug } from '@/lib/slug';

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

function timestampToMillis(value: any): number | null {
    if (!value) return null;
    if (typeof value.toMillis === 'function') return value.toMillis();
    if (typeof value.toDate === 'function') return value.toDate().getTime();
    if (typeof value.seconds === 'number') return value.seconds * 1000;
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : null;
}

function isHiddenThread(data: FirebaseFirestore.DocumentData): boolean {
    const status = String(data.status || '').toLocaleLowerCase('tr-TR');
    return data.deleted === true
        || data.hidden === true
        || ['deleted', 'hidden', 'spam', 'rejected', 'silindi', 'gizli', 'reddedildi'].includes(status);
}

export const getForumThreadSeo = cache(async (requestedSlug: string): Promise<ForumSeoThread | null> => {
    if (initError) return null;

    try {
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
        const data = threadDoc.data() || {};
        if (isHiddenThread(data)) return null;

        const entrySnapshot = await threadDoc.ref.collection('entries')
            .orderBy('createdAt', 'asc')
            .limit(50)
            .get();
        const entries = entrySnapshot.docs.map(doc => {
            const entry = doc.data();
            return {
                id: doc.id,
                username: String(entry.username || 'OtoSöz üyesi'),
                content: String(entry.content || '').trim(),
                createdAt: timestampToMillis(entry.createdAt),
                likes: Number(entry.likes || 0),
            };
        }).filter(entry => entry.content.length > 0);

        const title = String(data.title || '').trim();
        const canonicalSlug = data.urlId
            ? `${createSeoSlug(title)}--${data.urlId}`
            : threadDoc.id;
        const firstEntry = entries[0];
        const entryCount = Math.max(Number(data.entryCount || 0), entries.length);

        return {
            id: threadDoc.id,
            slug: canonicalSlug,
            title,
            category: String(data.category || 'Genel'),
            description: String(data.description || '').trim(),
            authorUsername: String(data.authorUsername || firstEntry?.username || 'OtoSöz üyesi'),
            createdAt: timestampToMillis(data.createdAt) || firstEntry?.createdAt || null,
            lastEntryAt: timestampToMillis(data.lastEntryAt) || timestampToMillis(data.createdAt),
            entryCount,
            views: Number(data.views || 0),
            entries,
            indexable: title.length >= 5 && Boolean(firstEntry && firstEntry.content.length >= 20),
        };
    } catch (error) {
        console.error('Forum SEO fetch error:', error);
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