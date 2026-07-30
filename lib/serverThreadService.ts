import 'server-only';
import type { DocumentData } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebaseAdmin';

export interface ServerThreadPreview {
    title: string;
    category: string;
    authorUsername: string;
    entryCount: number;
    createdAt: { toMillis?: () => number } | null;
}

function mapThreadPreview(data: DocumentData | undefined): ServerThreadPreview {
    return {
        title: data?.title || '',
        category: data?.category || 'Genel',
        authorUsername: data?.authorUsername || 'OtoSöz kullanıcısı',
        entryCount: data?.entryCount || 0,
        createdAt: data?.createdAt || null,
    };
}

export async function getThreadPreviewById(threadId: string): Promise<ServerThreadPreview | null> {
    const snapshot = await getAdminDb().collection('threads').doc(threadId).get();
    return snapshot.exists ? mapThreadPreview(snapshot.data()) : null;
}

export async function getThreadPreviewBySlug(slug: string): Promise<ServerThreadPreview | null> {
    const db = getAdminDb();
    const parts = slug.split('--');
    const urlIdText = parts[parts.length - 1];
    const urlId = Number.parseInt(urlIdText, 10);

    if (/^\d{8}$/.test(urlIdText) && Number.isFinite(urlId)) {
        const querySnapshot = await db.collection('threads')
            .where('urlId', '==', urlId)
            .limit(1)
            .get();
        const queryDocument = querySnapshot.docs[0];
        if (queryDocument) return mapThreadPreview(queryDocument.data());
    }

    return getThreadPreviewById(slug);
}
