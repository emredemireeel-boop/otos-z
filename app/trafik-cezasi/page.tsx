import {createPageMetadata} from '@/lib/seo';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import {collectionPage as buildSchemaCollectionPage,itemList as buildSchemaItemList,breadcrumb as buildSchemaBreadcrumbList} from '@/lib/schema';
import {schemaJson} from '@/lib/schema';
import { indexabilityRobots, isHubIndexable } from '@/lib/indexability';
import type { Metadata } from "next";
import KutuphaneClient from "@/app/kutuphane/KutuphaneClient";
import trafikCezalariData from "@/data/trafik_cezalari.json";

const BASE_URL = "https://otosoz.com";
const PAGE_URL = `${BASE_URL}/trafik-cezasi`;
const LAST_REVIEWED = "2026-09-09";
const TITLE = "2026 Trafik Cezaları ve Güncel Ceza Tutarları | OtoSöz";
const DESCRIPTION = "2026 trafik cezaları, güncel ceza tutarları, ehliyet ceza puanları, araç men süreleri, erken ödeme ve itiraz bilgilerini madde madde inceleyin.";

const allFines = trafikCezalariData.categories.flatMap((category) => category.rows);

export const metadata: Metadata = createPageMetadata({
        path:"/trafik-cezasi",
        title: TITLE,
        description: DESCRIPTION,
        category: "Trafik mevzuatı",
        index: isHubIndexable('/trafik-cezasi')
    });

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        buildSchemaBreadcrumbList({itemListElement: [
                { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
                { "@type": "ListItem", position: 2, name: "Kütüphane", item: `${BASE_URL}/kutuphane` },
                { "@type": "ListItem", position: 3, name: "Trafik Cezaları", item: PAGE_URL },
            ]}),
        buildSchemaCollectionPage({"@id": `${PAGE_URL}#collection`,
url: PAGE_URL,
name: TITLE,
description: DESCRIPTION,
inLanguage: "tr-TR",
dateModified: LAST_REVIEWED,
isPartOf: {
                "@type": "WebSite",
                "@id": `${BASE_URL}/#website`,
                name: "OtoSöz",
                url: BASE_URL,
            },
citation: {
                "@type": "Legislation",
                name: "7574 sayılı Karayolları Trafik Kanununda Değişiklik Yapılmasına Dair Kanun",
                url: "https://resmigazete.gov.tr/27.02.2026",
            },
mainEntity: buildSchemaItemList({numberOfItems: allFines.length,
itemListElement: allFines.map((fine, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: `${fine.ihlal} - ${fine.ceza}`,
                    url: `${BASE_URL}/trafik-cezasi/${fine.slug}`,
                }))})}),
    ],
};

export default function TrafikCezalariPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaJson(jsonLd) }}
            />
            <KutuphaneClient breadcrumbs={<PageBreadcrumbs url="/trafik-cezasi"/>} initialCategory="trafik-cezalari" />
        </>
    );
}
