import {createPageMetadata} from '@/lib/seo';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import {itemList as buildSchemaItemList,collectionPage as buildSchemaCollectionPage,breadcrumb as buildSchemaBreadcrumbList} from '@/lib/schema';
import {schemaJson} from '@/lib/schema';
import { indexabilityRobots, isHubIndexable } from '@/lib/indexability';
import type { Metadata } from "next";
import OtoHesapIndexView from "@/components/OtoHesapIndexView";
import { OTOHESAP_META } from "@/data/otohesap-meta";
import { OTOHESAP_GUIDES, OTOHESAP_LAST_REVIEWED } from "@/data/otohesap-content";

const PAGE_URL = "https://otosoz.com/otohesap";
const PAGE_DESCRIPTION = "Yakıt, araç maliyeti, kredi, MTV, bakım, değer kaybı, motor gücü ve lastik basıncı için 21 ücretsiz otomotiv hesaplama aracını kullanın.";

export const metadata: Metadata = createPageMetadata({
        path:"/otohesap",
        title: "OtoHesap: 21 Ücretsiz Araç Hesaplama Aracı | Otosöz",
        description: PAGE_DESCRIPTION,
        index: isHubIndexable('/otohesap')
    });

export default function OtoHesapIndex() {
  const modules = Object.keys(OTOHESAP_META).filter(module => OTOHESAP_GUIDES[module]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildSchemaBreadcrumbList({"@id": PAGE_URL + "#breadcrumb",
itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://otosoz.com/" },
          { "@type": "ListItem", position: 2, name: "OtoHesap", item: PAGE_URL },
        ]}),
      buildSchemaCollectionPage({"@id": PAGE_URL + "#webpage",
url: PAGE_URL,
name: "OtoHesap: Otomotiv Hesaplama Araçları",
description: PAGE_DESCRIPTION,
inLanguage: "tr-TR",
dateModified: OTOHESAP_LAST_REVIEWED,
breadcrumb: { "@id": PAGE_URL + "#breadcrumb" },
isPartOf: { "@id": "https://otosoz.com/#website" },
mainEntity: { "@id": PAGE_URL + "#tools" }}),
      buildSchemaItemList({"@id": PAGE_URL + "#tools",
name: "OtoHesap araçları",
numberOfItems: modules.length,
itemListElement: modules.map((module, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: OTOHESAP_GUIDES[module].h1,
          url: PAGE_URL + "/" + module,
        }))}),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(jsonLd) }} />
      <OtoHesapIndexView breadcrumbs={<PageBreadcrumbs url={PAGE_URL}/>} />
    </>
  );
}
