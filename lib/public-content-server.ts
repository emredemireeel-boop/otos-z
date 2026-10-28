import 'server-only';
import { cache } from 'react';
import { getAdminDb, initError } from './firebaseAdmin';
import { getPublicFirestoreDocument, runPublicFirestoreQuery } from './forumPublicServer';

type Collection = 'threads' | 'surveys' | 'users';

function requirePublicConfig() {
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        throw new Error('Public content lookup is unavailable');
    }
}

// Yalnızca sunucuda varlık kontrolü. Ağ/izin hatası "içerik yok" sayılmaz;
// hata üst katmana gider, geçerli bir sayfa yanlışlıkla 404 olarak önbelleklenmez.
export const getPublicContentDocument = cache(async (collection: Collection, id: string) => {
    if (!id || id.includes('/') || Buffer.byteLength(id, 'utf8') > 1500) return null;
    if (!initError) {
        try {
            const document = await getAdminDb().collection(collection).doc(id).get();
            return document.exists ? { id: document.id, data: document.data() || {} } : null;
        } catch {
            // Public fallback aynı Firestore güvenlik kurallarını kullanır.
        }
    }
    requirePublicConfig();
    return getPublicFirestoreDocument(collection, id);
});

export const findPublicContentDocument = cache(async (collection: Collection, field: string, value: string | number) => {
    if (!initError) {
        try {
            const result = await getAdminDb().collection(collection).where(field, '==', value).limit(1).get();
            const document = result.docs[0];
            return document ? { id: document.id, data: document.data() } : null;
        } catch {
            // Public fallback aynı Firestore güvenlik kurallarını kullanır.
        }
    }
    requirePublicConfig();
    return (await runPublicFirestoreQuery({ collectionId: collection, where: { field, value }, limit: 1 }))[0] || null;
});

export function isHiddenContent(data: Record<string, unknown>): boolean {
    const status = String(data.status || '').toLocaleLowerCase('tr-TR');
    return data.deleted === true || data.hidden === true
        || ['deleted', 'hidden', 'spam', 'rejected', 'silindi', 'gizli', 'reddedildi'].includes(status);
}
