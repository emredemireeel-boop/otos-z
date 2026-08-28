import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import ForumThreadClient from './ForumThreadClient';
import { getForumThreadSeo, plainTextExcerpt } from '@/lib/forumDataServer';

interface PageProps {
    params: Promise<{ id: string }>;
}

const BASE_URL = 'https://otosoz.com';

function toIso(value: number | null): string | undefined {
    return value ? new Date(value).toISOString() : undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const thread = await getForumThreadSeo(id);

    if (!thread) {
        return {
            title: 'Konu Bulunamadı | OtoSöz Forum',
            robots: { index: false, follow: false },
        };
    }

    const canonicalUrl = `${BASE_URL}/forum/${thread.slug}`;
    const firstEntry = thread.entries[0]?.content || '';
    const description = plainTextExcerpt(
        thread.description || firstEntry || `${thread.title} başlığındaki otomobil topluluğu tartışmasını inceleyin.`,
        160,
    );
    const ogUrl = `/api/og?title=${encodeURIComponent(thread.title)}&desc=${encodeURIComponent(description.slice(0, 120))}`;

    return {
        title: `${thread.title} | OtoSöz Forum`,
        description,
        robots: thread.indexable
            ? { index: true, follow: true }
            : { index: false, follow: true },
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: thread.title,
            description,
            type: 'article',
            url: canonicalUrl,
            siteName: 'OtoSöz',
            publishedTime: toIso(thread.createdAt),
            modifiedTime: toIso(thread.lastEntryAt),
            images: [{ url: ogUrl, width: 1200, height: 630, alt: thread.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: thread.title,
            description,
            images: [ogUrl],
        },
    };
}

export default async function ForumThreadServerPage({ params }: PageProps) {
    const { id } = await params;
    const thread = await getForumThreadSeo(id);
    if (!thread) notFound();

    if (id !== thread.slug) {
        permanentRedirect(`/forum/${thread.slug}`);
    }

    const canonicalUrl = `${BASE_URL}/forum/${thread.slug}`;
    const originalPost = thread.entries[0];
    const replyCount = Math.max(0, thread.entryCount - 1);
    const discussionPosting: Record<string, unknown> = {
        '@type': 'DiscussionForumPosting',
        '@id': `${canonicalUrl}#discussion`,
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
        headline: thread.title,
        text: originalPost?.content || thread.description || thread.title,
        author: {
            '@type': 'Person',
            name: originalPost?.username || thread.authorUsername,
        },
        interactionStatistic: [
            {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/CommentAction',
                userInteractionCount: replyCount,
            },
            {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/ViewAction',
                userInteractionCount: thread.views,
            },
        ],
        comment: thread.entries.slice(1).map(entry => ({
            '@type': 'Comment',
            '@id': `${canonicalUrl}#entry-${entry.id}`,
            url: `${canonicalUrl}#entry-${entry.id}`,
            text: entry.content,
            ...(toIso(entry.createdAt) ? { datePublished: toIso(entry.createdAt) } : {}),
            author: { '@type': 'Person', name: entry.username },
            interactionStatistic: {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/LikeAction',
                userInteractionCount: entry.likes,
            },
        })),
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            name: 'OtoSöz',
            url: BASE_URL,
        },
        ...(toIso(thread.createdAt) ? { datePublished: toIso(thread.createdAt) } : {}),
        ...(toIso(thread.lastEntryAt) ? { dateModified: toIso(thread.lastEntryAt) } : {}),
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            discussionPosting,
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: BASE_URL },
                    { '@type': 'ListItem', position: 2, name: 'Forum', item: `${BASE_URL}/forum` },
                    { '@type': 'ListItem', position: 3, name: thread.title, item: canonicalUrl },
                ],
            },
        ],
    };
    const safeJsonLd = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd }} />
            <ForumThreadClient
                initialThread={{
                    id: thread.id,
                    title: thread.title,
                    category: thread.category,
                    description: thread.description,
                    authorUsername: thread.authorUsername,
                    createdAt: thread.createdAt,
                    views: thread.views,
                    entryCount: thread.entryCount,
                    lastEntryAt: thread.lastEntryAt,
                    urlId: /^\d{8}$/.test(thread.slug.split('--').at(-1) || '')
                        ? Number(thread.slug.split('--').at(-1))
                        : undefined,
                }}
                initialEntries={thread.entries}
            />
        </>
    );
}