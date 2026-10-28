import 'server-only';
import { createSeoSlug } from './slug';
import { findPublicContentDocument, getPublicContentDocument, isHiddenContent } from './public-content-server';

// Yönlendirme için yalnızca konu belgesi okunur; yanıtlar/içerik listesi çekilmez.
export async function getForumCanonicalRoute(requestedSlug: string): Promise<string | null> {
    const routeId = requestedSlug.split('--').at(-1) || '';
    const byUrlId = /^\d{8}$/.test(routeId)
        ? await findPublicContentDocument('threads', 'urlId', Number(routeId)) : null;
    const document = byUrlId || await getPublicContentDocument('threads', requestedSlug);
    if (!document || isHiddenContent(document.data)) return null;
    return document.data.urlId
        ? `${createSeoSlug(String(document.data.title || ''))}--${document.data.urlId}` : document.id;
}
