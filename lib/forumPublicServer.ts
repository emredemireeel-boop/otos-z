import 'server-only';

export interface PublicFirestoreDocument {
    id: string;
    data: Record<string, any>;
}

interface RestDocument {
    name?: string;
    fields?: Record<string, RestValue>;
}

interface RestValue {
    nullValue?: null;
    booleanValue?: boolean;
    integerValue?: string;
    doubleValue?: number;
    timestampValue?: string;
    stringValue?: string;
    bytesValue?: string;
    referenceValue?: string;
    geoPointValue?: { latitude?: number; longitude?: number };
    arrayValue?: { values?: RestValue[] };
    mapValue?: { fields?: Record<string, RestValue> };
}

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || '';
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || '';
const HAS_CONFIG = /^AIza[0-9A-Za-z_-]{35}$/.test(API_KEY) && /^[a-z0-9-]+$/.test(PROJECT_ID);

function decodeValue(value: RestValue | undefined): any {
    if (!value || value.nullValue === null) return null;
    if (value.stringValue !== undefined) return value.stringValue;
    if (value.integerValue !== undefined) return Number(value.integerValue);
    if (value.doubleValue !== undefined) return value.doubleValue;
    if (value.booleanValue !== undefined) return value.booleanValue;
    if (value.timestampValue !== undefined) return value.timestampValue;
    if (value.bytesValue !== undefined) return value.bytesValue;
    if (value.referenceValue !== undefined) return value.referenceValue;
    if (value.geoPointValue !== undefined) return value.geoPointValue;
    if (value.arrayValue !== undefined) return (value.arrayValue.values || []).map(decodeValue);
    if (value.mapValue !== undefined) return decodeFields(value.mapValue.fields || {});
    return null;
}

function decodeFields(fields: Record<string, RestValue>): Record<string, any> {
    return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));
}

function toDocument(document: RestDocument | undefined): PublicFirestoreDocument | null {
    if (!document?.name) return null;
    return {
        id: document.name.split('/').at(-1) || '',
        data: decodeFields(document.fields || {}),
    };
}

function filterValue(value: string | number): RestValue {
    return typeof value === 'number' ? { integerValue: String(value) } : { stringValue: value };
}

/**
 * Server-only fallback for public forum reads. It uses the same Firebase web
 * configuration and Firestore security rules as the browser; no Admin secret
 * is embedded or transferred to the web server.
 */
export async function runPublicFirestoreQuery(options: {
    collectionId: string;
    parent?: string;
    limit: number;
    orderBy?: { field: string; direction: 'ASCENDING' | 'DESCENDING' };
    where?: { field: string; value: string | number };
}): Promise<PublicFirestoreDocument[]> {
    if (!HAS_CONFIG) return [];

    const parent = options.parent ? `/${options.parent.split('/').map(encodeURIComponent).join('/')}` : '';
    const endpoint = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents${parent}:runQuery?key=${API_KEY}`;
    const structuredQuery: Record<string, any> = {
        from: [{ collectionId: options.collectionId }],
        limit: options.limit,
    };
    if (options.orderBy) {
        structuredQuery.orderBy = [{
            field: { fieldPath: options.orderBy.field },
            direction: options.orderBy.direction,
        }];
    }
    if (options.where) {
        structuredQuery.where = {
            fieldFilter: {
                field: { fieldPath: options.where.field },
                op: 'EQUAL',
                value: filterValue(options.where.value),
            },
        };
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ structuredQuery }),
        next: { revalidate: 300 },
    });
    if (!response.ok) throw new Error(`Public Firestore query failed (${response.status})`);
    const rows = await response.json() as Array<{ document?: RestDocument }>;
    return rows.map(row => toDocument(row.document)).filter((doc): doc is PublicFirestoreDocument => Boolean(doc?.id));
}

export async function getPublicFirestoreDocument(collectionId: string, documentId: string): Promise<PublicFirestoreDocument | null> {
    if (!HAS_CONFIG || !documentId || documentId.includes('/')) return null;
    const endpoint = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${encodeURIComponent(collectionId)}/${encodeURIComponent(documentId)}?key=${API_KEY}`;
    const response = await fetch(endpoint, { next: { revalidate: 300 } });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Public Firestore document fetch failed (${response.status})`);
    return toDocument(await response.json() as RestDocument);
}
