import type { Metadata } from 'next';
import { indexabilityRobots, isHubIndexable } from './indexability';
export const SITE_URL = 'https://otosoz.com';
type PageMetadataOptions = Omit<Metadata, 'description'> & {
    title?: Metadata['title'];
    description?: string | null;
    path?: string;
    type?: 'website' | 'article';
    image?: string;
    index?: boolean;
    indexable?: boolean;
    publishedTime?: string;
    modifiedTime?: string;
};
const clean = (value: unknown) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
export function wordLimit(value: string, max: number): string {
    if ([...value].length <= max)
        return value;
    const slice = [...value].slice(0, max).join('');
    const boundary = slice.lastIndexOf(' ');
    return (boundary > max * 0.6 ? slice.slice(0, boundary) : slice).replace(/[\s|—:;,.-]+$/g, '').trim();
}
export function metadataTitle(value: string): string {
    const base = clean(value).replace(/\s*\|\s*OtoSöz.*$/i, '').replace(/^OtoSöz\s*[|—:-]\s*/i, '').trim();
    const withBrand = `${base} | OtoSöz`;
    return [...withBrand].length <= 60 ? withBrand : wordLimit(base, 60);
}
export function metadataDescription(value: string, title: string): string {
    let text = clean(value);
    if ([...text].length < 120) {
        const lead = clean(title).replace(/\s*\|.*$/, '');
        if (!text.toLocaleLowerCase('tr').includes(lead.toLocaleLowerCase('tr')))
            text = `${lead}: ${text}`;
        if ([...text].length < 120)
            text = `${text.replace(/[.!?]+$/, '')}. Konuyla ilgili açıklamaları, sayfanın ayrıntılarını ve ilgili içerikleri inceleyerek OtoSöz üzerinden daha fazla bilgi edinin.`;
    }
    return wordLimit(text, 158);
}
function date(value: unknown) { if (!value)
    return undefined; const d = new Date(String(value)); return Number.isFinite(d.getTime()) && d.getTime() <= Date.now() ? d.toISOString() : undefined; }
export function createPageMetadata(options: PageMetadataOptions): Metadata {
    const { path, index, indexable, type, image, publishedTime, modifiedTime, ...legacy } = options;
    const og = (options.openGraph || {}) as Record<string, any>;
    const rawTitle = typeof options.title === 'string' ? options.title : options.title && ('absolute' in options.title ? options.title.absolute : 'default' in options.title ? options.title.default : 'OtoSöz') || 'OtoSöz';
    const title = metadataTitle(String(rawTitle)), description = metadataDescription(options.description || String(og.description || ''), String(rawTitle));
    const rawPath = path || options.alternates?.canonical?.toString() || og.url?.toString();
    let canonical: string | undefined;
    if (rawPath) {
        const url = new URL(rawPath, SITE_URL);
        if (url.origin !== SITE_URL)
            throw new Error('Canonical must use https://otosoz.com');
        url.hash = '';
        url.pathname = url.pathname.toLowerCase().replace(/\/$/, '') || '/';
        canonical = url.href;
    }
    const robots = typeof options.robots === 'object' && options.robots ? options.robots : null;
    const shouldIndex = index ?? indexable ?? (robots?.index === false ? false : robots?.index === true ? true : isHubIndexable(canonical ? new URL(canonical).pathname : ''));
    const contentType = type || (og.type === 'article' ? 'article' : 'website');
    const ogImage = new URL(image || `/api/og?title=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}`, SITE_URL).href;
    const published = date(publishedTime || og.publishedTime), modified = date(modifiedTime || og.modifiedTime);
    return { ...legacy,
        // Next 16 metadataBase resolves a root URL to its origin and drops '/'.
        // All canonical and social URLs are absolute, so the home page needs no base.
        ...(canonical === `${SITE_URL}/` ? { metadataBase: null } : {}), title, description, keywords: undefined, authors: undefined, publisher: undefined, creator: undefined,
        robots: indexabilityRobots(shouldIndex), ...(canonical ? { alternates: { ...options.alternates, canonical } } : {}),
        openGraph: { title, description, url: canonical, siteName: 'OtoSöz', locale: 'tr_TR', type: contentType, images: [{ url: ogImage, width: 1200, height: 630, alt: title }], ...(contentType === 'article' ? { publishedTime: published, modifiedTime: modified } : {}) },
        twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    };
}
