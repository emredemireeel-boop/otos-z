import library from '@/public/data/library_guides.json';
import news from '@/public/data/news_posts.json';
import {getIndexableUrls} from '@/lib/seoRoutes';
import {createSeoSlug} from '@/lib/slug';
import {createPageMetadata} from '@/lib/seo';
import {schemaJson} from '@/lib/schema';
import {vehicleDNAData} from '@/data/vehicle-dna';
import {isVehicleIndexable} from '@/lib/indexability';
import { indexabilityRobots, isHubIndexable } from '@/lib/indexability';
import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import HomeDiscovery from '@/components/HomeDiscovery';
import { getRecentForumThreadSummaries } from "@/lib/forumDataServer";

export const revalidate = 900;

const title = "OtoSöz | Araç Alımı, Arıza Çözümü ve Karşılaştırma";
const description = "Araç alırken, otomobil arızasını araştırırken veya iki aracı karşılaştırırken gerçek sürücü deneyimi, uzman görüşü ve düzenli veriyi OtoSöz'de inceleyin.";
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
        { "@type": "Thing", name: "Araç satın alma kararı" },
        { "@type": "Thing", name: "Otomobil arızaları ve OBD kodları" },
        { "@type": "Thing", name: "Araç karşılaştırma" },
    ],
    inLanguage: "tr-TR",
};

export default async function HomePage() {
    const initialThreads = await getRecentForumThreadSummaries(100);
    const [articleUrls,newsUrls]=await Promise.all([getIndexableUrls('makale'),getIndexableUrls('haberler')]);
    const allowedArticles=new Set(articleUrls.map(row=>row.url)),allowedNews=new Set(newsUrls.map(row=>row.url));
    const dailySeed=Math.floor(Date.now()/86400000);
    const selections=library.guides.map(guide=>({title:guide.title,description:guide.description,href:`/makale/${createSeoSlug(guide.title)}--${guide.urlId||guide.id}`})).filter(guide=>allowedArticles.has('https://otosoz.com'+guide.href));
    const selectedGuide=selections.length?selections[dailySeed%selections.length]:undefined;
    const initialNews=[...news.posts].filter(post=>allowedNews.has('https://otosoz.com/haberler/'+post.slug)).sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt)).slice(0,2).map(({id,title,slug,readTime})=>({id,title,slug,readTime}));
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaJson(homePageJsonLd) }}
            />
            <HomeClient selectedGuide={selectedGuide} initialNews={initialNews} dailySeed={dailySeed} initialThreads={initialThreads} featuredDnaVehicles={vehicleDNAData.filter(vehicle=>[1,2,3,4,5,6,7,8,13].includes(vehicle.id)&&isVehicleIndexable(vehicle)).map(({id,brand,model,dnaScore,totalReports,chronicIssues})=>({id,brand,model,dnaScore,totalReports,chronicIssueCount:chronicIssues.length}))} discovery={<HomeDiscovery/>}/>
        </>
    );
}
