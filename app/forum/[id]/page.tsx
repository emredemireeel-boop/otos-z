import {createPageMetadata} from '@/lib/seo';
import {verifiedForumAuthorUrl} from '@/lib/forum-author-schema';
import {schemaJson} from '@/lib/schema';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import {breadcrumb as buildSchemaBreadcrumbList,discussionForumPosting as buildSchemaDiscussionForumPosting} from '@/lib/schema';
import ForumThreadSidebarCards from '@/components/ForumThreadSidebarCards';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
        return createPageMetadata({
        title: 'Konu Bulunamadı | OtoSöz Forum',
        index: false
    });
    }

    const canonicalUrl = `${BASE_URL}/forum/${thread.slug}`;
    const firstEntry = thread.entries[0]?.content || '';
    const description = plainTextExcerpt(
        thread.description || firstEntry || `${thread.title} başlığındaki otomobil topluluğu tartışmasını inceleyin.`,
        160,
    );
    const ogUrl = `/api/og?title=${encodeURIComponent(thread.title)}&desc=${encodeURIComponent(description.slice(0, 120))}`;

    return createPageMetadata({
        title: `${thread.title} | OtoSöz Forum`,
        description,
        path: canonicalUrl,
        index: thread.indexable,
        publishedTime: toIso(thread.createdAt),
        modifiedTime: toIso(thread.lastEntryAt)
    });
}

export default async function ForumThreadServerPage({ params }: PageProps) {
    const { id } = await params;
    const thread = await getForumThreadSeo(id);
    if (!thread) notFound();


    const canonicalUrl = `${BASE_URL}/forum/${thread.slug}`;
    const originalPost = thread.entries[0];
    const authorNames=[...new Set([originalPost?.username||thread.authorUsername,...thread.entries.slice(1,50).map(entry=>entry.username)])];
    const authorUrls=new Map(await Promise.all(authorNames.map(async name=>[name,await verifiedForumAuthorUrl(name)] as const)));
    const replyCount = Math.max(0, thread.entryCount - 1);
    const discussionPosting: Record<string, unknown> = buildSchemaDiscussionForumPosting({'@id': `${canonicalUrl}#discussion`,
url: canonicalUrl,
mainEntityOfPage: canonicalUrl,
headline: thread.title,
text: originalPost?.content || thread.description || thread.title,
author: {
            '@type': 'Person',
            name: originalPost?.username || thread.authorUsername,
            ...(authorUrls.get(originalPost?.username||thread.authorUsername)?{url:authorUrls.get(originalPost?.username||thread.authorUsername)}:{}),
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
comment: thread.entries.slice(1,50).map(entry => ({
            '@type': 'Comment',
            '@id': `${canonicalUrl}#entry-${entry.id}`,
            url: `${canonicalUrl}#entry-${entry.id}`,
            text: entry.content,
            ...(toIso(entry.createdAt) ? { datePublished: toIso(entry.createdAt) } : {}),
            author: { '@type': 'Person', name: entry.username, ...(authorUrls.get(entry.username)?{url:authorUrls.get(entry.username)}:{}) },
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
...(toIso(thread.lastEntryAt) ? { dateModified: toIso(thread.lastEntryAt) } : {})});

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            discussionPosting,
            buildSchemaBreadcrumbList({itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: BASE_URL },
                    { '@type': 'ListItem', position: 2, name: 'Forum', item: `${BASE_URL}/forum` },
                    { '@type': 'ListItem', position: 3, name: thread.title, item: canonicalUrl },
                ]}),
        ],
    };
    const safeJsonLd = schemaJson(jsonLd);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd }} />
            <ForumThreadClient breadcrumbs={<PageBreadcrumbs url={canonicalUrl}/>} sidebarLeft={<ForumThreadSidebarCards side="left" seedKey={thread.id}/>} sidebarRight={<ForumThreadSidebarCards side="right" seedKey={thread.id}/>}
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
