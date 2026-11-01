import {createPageMetadata} from '@/lib/seo';
import {schemaJson} from '@/lib/schema';
import {isHubIndexable} from '@/lib/indexability';
import type {Metadata} from 'next';
import HomeClient from './HomeClient';
import {getCommunitySurveys} from '@/lib/community-server';
import {getRecentForumThreadSummaries} from '@/lib/forumDataServer';

export const revalidate = 900;

const title = "Otomobil Forumu, Sorular ve Sürücü Deneyimleri";
const description = "OtoSöz otomobil forumunda arıza ve bakım sorularını sorun, sürücü deneyimlerini okuyun. Topluluk anketlerine katılın, otomobiller hakkında fikir paylaşın.";
const canonicalUrl = "https://otosoz.com/";

export const metadata: Metadata = createPageMetadata({
        path:"/",
        title,
        description,
        index: isHubIndexable('/')
    });

const homePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://otosoz.com/#webpage",
    url: canonicalUrl,
    name: title,
    description,
    isPartOf: { "@id": "https://otosoz.com/#website" },
    about: [
        { "@type": "Thing", name: "Otomobil forumu ve sürücü deneyimleri" },
        { "@type": "Thing", name: "Otomobil arızaları ve OBD kodları" },
        { "@type": "Thing", name: "Topluluk soruları ve anketleri" },
    ],
    inLanguage: "tr-TR",
};

export default async function HomePage() {
    const [initialThreads, initialSurveys] = await Promise.all([getRecentForumThreadSummaries(100), getCommunitySurveys()]);
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaJson(homePageJsonLd) }}
            />
            <HomeClient initialThreads={initialThreads} initialSurveys={initialSurveys} featuredDnaVehicles={[]} />
        </>
    );
}
