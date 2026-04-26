import { Metadata } from "next";
import UzmanaSorClient from "./UzmanaSorClient";
import { getThreadById } from "@/lib/forumService";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const threadId = resolvedParams.id;

    try {
        const thread = await getThreadById(threadId);

        if (!thread) {
            return {
                title: 'Soru Bulunamadı | Uzmana Sor',
            };
        }

        const ogUrl = `/api/og?title=${encodeURIComponent(thread.title)}&desc=${encodeURIComponent("Uzmanlara sorulan bu soruyu ve yanıtlarını inceleyin.")}`;

        return {
            title: `${thread.title} | Uzmana Sor | OtoSöz`,
            description: `${thread.authorUsername} tarafından sorulan soru: ${thread.title}. Uzmanların yanıtlarını inceleyin veya siz de yanıtlayın.`,
            openGraph: {
                title: `${thread.title} | Uzmana Sor`,
                description: `${thread.authorUsername} tarafından sorulan soru: ${thread.title}. Uzmanların yanıtlarını inceleyin veya siz de yanıtlayın.`,
                type: 'article',
                url: `https://www.otosoz.com/uzmana-sor/${threadId}`,
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
                description: `Uzmana sorulan bu soruyu inceleyin.`,
                images: [ogUrl],
            },
            alternates: {
                canonical: `https://www.otosoz.com/uzmana-sor/${threadId}`,
            },
        };
    } catch (error) {
        return {
            title: 'Hata | Uzmana Sor',
        };
    }
}

export default async function UzmanaSorServerPage({ params }: PageProps) {
    const resolvedParams = await params;
    const threadId = resolvedParams.id;
    let schemaJson = null;

    try {
        const thread = await getThreadById(threadId);
        if (thread) {
            schemaJson = {
                "@context": "https://schema.org",
                "@type": "QAPage",
                "mainEntity": {
                    "@type": "Question",
                    "name": thread.title,
                    "text": thread.title, // In a real app, this would be the full question body
                    "answerCount": 0, // Would be fetched from replies
                    "upvoteCount": 0,
                    "dateCreated": new Date(thread.createdAt?.toMillis ? thread.createdAt.toMillis() : Date.now()).toISOString(),
                    "author": {
                        "@type": "Person",
                        "name": thread.authorUsername
                    }
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
            <UzmanaSorClient />
        </>
    );
}
