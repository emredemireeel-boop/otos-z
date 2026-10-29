import {createPageMetadata} from '@/lib/seo';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import {collectionPage as buildSchemaCollectionPage,itemList as buildSchemaItemList,breadcrumb as buildSchemaBreadcrumbList} from '@/lib/schema';
import {schemaJson} from '@/lib/schema';
import library from '@/public/data/library_guides.json';
import {getIndexableUrls} from '@/lib/seoRoutes';
import interesting from '@/public/data/interesting_information.json';
import segmentData from '@/data/arac_segmentleri.json';
import tolls from '@/public/data/otoyol_ucretleri.json';
import {createSeoSlug} from '@/lib/slug';
import { indexabilityRobots, isHubIndexable } from '@/lib/indexability';
import { Metadata } from "next";
import { CATEGORIES, type CatMeta } from "@/lib/library-categories";
import KutuphaneClient from "./KutuphaneClient";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const BASE_URL = "https://otosoz.com";
const LIBRARY_LAST_REVIEWED = "2026-08-26";
const TRAFFIC_FINES_CANONICAL = `${BASE_URL}/trafik-cezasi`;

function resolveCategory(kategori: string | null): CatMeta {
    if (kategori) {
        const found = CATEGORIES.find(c => c.slug === kategori);
        if (found) return found;
    }
    return CATEGORIES[0];
}

export function libraryMetadata(kategori: string | null): Metadata {
    const cat = resolveCategory(kategori);

    const isRoot = !kategori || cat.slug === "makaleler";
    const canonicalUrl = cat.slug === "trafik-cezalari"
        ? TRAFFIC_FINES_CANONICAL
        : isRoot
            ? `${BASE_URL}/kutuphane`
            : `${BASE_URL}/kutuphane/kategori/${cat.slug}`;
    const ogUrl = `/api/og?title=${encodeURIComponent(cat.title.split("|")[0].trim())}&desc=${encodeURIComponent(cat.description.slice(0, 100))}`;

    return createPageMetadata({
        title: cat.title,
        description: cat.description,
        index: isHubIndexable('/kutuphane', { category: cat.slug }),
        path: canonicalUrl
    });
}

// Sunucu tarafında görünür içerikle uyumlu CollectionPage ve BreadcrumbList üretir.
function buildJsonLd(cat: CatMeta): string {
    const isRoot = cat.slug === "makaleler";
    const pageUrl = cat.slug === "trafik-cezalari"
        ? TRAFFIC_FINES_CANONICAL
        : isRoot
            ? `${BASE_URL}/kutuphane`
            : `${BASE_URL}/kutuphane/kategori/${cat.slug}`;

    const graph: any[] = [
        buildSchemaBreadcrumbList({"itemListElement": [
                { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
                { "@type": "ListItem", position: 2, name: "Kütüphane", item: `${BASE_URL}/kutuphane` },
                ...(isRoot ? [] : [{ "@type": "ListItem", position: 3, name: cat.name, item: pageUrl }]),
            ]}),
        buildSchemaCollectionPage({name: cat.title.split("|")[0].trim(),
description: cat.description,
url: pageUrl,
inLanguage: "tr-TR",
isPartOf: { "@type": "WebSite", name: "OtoSöz", url: BASE_URL },
...(isRoot ? {
                mainEntity: buildSchemaItemList({numberOfItems: CATEGORIES.length,
itemListElement: CATEGORIES.map((category, index) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        name: category.name,
                        url: category.slug === "makaleler"
                            ? `${BASE_URL}/kutuphane`
                            : category.slug === "obd-ariza-kodlari"
                                ? `${BASE_URL}/obd`
                                : category.slug === "trafik-cezalari"
                                    ? TRAFFIC_FINES_CANONICAL
                                    : `${BASE_URL}/kutuphane/kategori/${category.slug}`,
                    }))}),
            } : {})}),
    ];


    return schemaJson({ "@context": "https://schema.org", "@graph": graph });
}

export default async function LibraryHub({kategori=null}:{kategori?:string|null}) {
    const articleUrls=new Set((await getIndexableUrls('makale')).map(entry=>entry.url));

    // Kategori yönlendirmeleri render öncesinde proxy.ts tarafından uygulanır.
    const cat = resolveCategory(kategori);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: buildJsonLd(cat) }}
            />
            <KutuphaneClient breadcrumbs={<PageBreadcrumbs url={cat.slug==='makaleler'?'/kutuphane':`/kutuphane/kategori/${cat.slug}`}/>} initialCategory={cat.slug} initialGuides={cat.slug==='makaleler'?library.guides.map(guide=>({id:guide.id,urlId:guide.urlId,title:guide.title,description:guide.description,minutes:guide.minutes,difficulty:guide.difficulty,tags:guide.tags,author:guide.author,indexable:articleUrls.has(`https://otosoz.com/makale/${createSeoSlug(guide.title)}--${guide.urlId||guide.id}`)})):[]} initialInterestingData={cat.slug==='ilginc-bilgiler'?interesting.interestingFacts:null} segmentData={cat.slug==='arac-segmentleri'?segmentData:undefined} initialTolls={cat.slug==='otoyol-ve-kopru-ucretleri'?tolls:[]}/>
        </>
    );
}
