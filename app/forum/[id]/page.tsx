import { Metadata } from "next";
import ForumThreadClient from "./ForumThreadClient";
import { getThreadBySlug } from "@/lib/forumService";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.id;

    try {
        const thread = await getThreadBySlug(slug);

        if (!thread) {
            return {
                title: 'Konu Bulunamadı | OtoSöz Forum',
            };
        }

        const ogUrl = `/api/og?title=${encodeURIComponent(thread.title)}&desc=${encodeURIComponent((thread.category + " kategorisindeki bu forum başlığını inceleyin.").slice(0, 160))}`;

        return {
            title: `${thread.title} | OtoSöz Forum`,
            description: `${thread.authorUsername} tarafından ${thread.category} kategorisinde açılan konu: ${thread.title}. Oku ve tartışmaya katıl.`,
            openGraph: {
                title: thread.title,
                description: `${thread.authorUsername} tarafından ${thread.category} kategorisinde açılan konu: ${thread.title}. Oku ve tartışmaya katıl.`,
                type: 'article',
                url: `https://www.otosoz.com/forum/${slug}`,
                images: [
                    {
                        url: ogUrl,
                        width: 1200,
                        height: 630,
                        alt: thread.title,
                    }
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: thread.title,
                description: `${thread.authorUsername} tarafından açılan konuyu incele.`,
                images: [ogUrl],
            },
            alternates: {
                canonical: `https://www.otosoz.com/forum/${slug}`,
            },
        };
    } catch (error) {
        return {
            title: 'Hata | OtoSöz Forum',
        };
    }
}

export default async function ForumThreadServerPage({ params }: PageProps) {
    const resolvedParams = await params;
    const slug = resolvedParams.id;
    let schemaJson = null;

    try {
        const thread = await getThreadBySlug(slug);
        if (thread) {
            schemaJson = {
                "@context": "https://schema.org",
                "@type": "DiscussionForumPosting",
                "headline": thread.title,
                "datePublished": new Date(thread.createdAt?.toMillis ? thread.createdAt.toMillis() : Date.now()).toISOString(),
                "author": {
                    "@type": "Person",
                    "name": thread.authorUsername
                },
                "interactionStatistic": {
                    "@type": "InteractionCounter",
                    "interactionType": "https://schema.org/CommentAction",
                    "userInteractionCount": thread.entryCount || 0
                }
            };
        }
    } catch (e) {
        console.error("Schema error", e);
    }

    return (
        <>
            {schemaJson && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
                />
            )}
            <ForumThreadClient />
        </>
    );
}
