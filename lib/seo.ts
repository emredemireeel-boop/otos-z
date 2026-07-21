import type { Metadata } from 'next';

const SITE_URL = 'https://otosoz.com';

interface PageMetadataOptions {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
}

export function createPageMetadata({ title, description, path, keywords }: PageMetadataOptions): Metadata {
    const fullTitle = /otosöz/i.test(title) ? title : `${title} | OtoSöz`;
    const canonical = path ? new URL(path, SITE_URL).toString() : undefined;
    const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(fullTitle)}&desc=${encodeURIComponent(description.slice(0, 160))}`;

    return {
        title: fullTitle,
        description,
        keywords,
        ...(canonical ? { alternates: { canonical } } : {}),
        openGraph: {
            title: fullTitle,
            description,
            ...(canonical ? { url: canonical } : {}),
            siteName: 'OtoSöz',
            locale: 'tr_TR',
            type: 'website',
            images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [ogImage],
        },
    };
}
