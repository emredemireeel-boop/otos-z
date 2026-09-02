import type { Metadata } from "next";
import OtoHesapIndexView from "@/components/OtoHesapIndexView";
import { OTOHESAP_META } from "@/data/otohesap-meta";
import { OTOHESAP_GUIDES, OTOHESAP_LAST_REVIEWED } from "@/data/otohesap-content";

const PAGE_URL = "https://otosoz.com/otohesap";
const PAGE_DESCRIPTION = "Yakıt, araç maliyeti, kredi, MTV, bakım, değer kaybı, motor gücü ve lastik basıncı için 21 ücretsiz otomotiv hesaplama aracını kullanın.";

export const metadata: Metadata = {
  title: "OtoHesap: 21 Ücretsiz Araç Hesaplama Aracı | Otosöz",
  description: PAGE_DESCRIPTION,
  keywords: ["araç hesaplama araçları", "araç maliyeti hesaplama", "yakıt hesaplama", "kilometre maliyeti", "MTV hesaplama 2026", "taşıt kredisi hesaplama", "kW beygir hesaplama", "PSI bar çevirme", "OtoHesap"],
  alternates: { canonical: PAGE_URL },
  authors: [{ name: "Otosöz İçerik Ekibi", url: "https://otosoz.com/hakkimizda" }],
  creator: "Otosöz",
  publisher: "Otosöz",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
  openGraph: {
    title: "OtoHesap: Ücretsiz Otomotiv Hesaplama Araçları",
    description: "Araç alırken ve kullanırken ihtiyaç duyacağınız 21 ücretsiz hesaplayıcı tek merkezde.",
    url: PAGE_URL,
    siteName: "Otosöz",
    locale: "tr_TR",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "OtoHesap: Ücretsiz Otomotiv Hesaplama Araçları",
    description: "Yakıt, kredi, vergi, bakım ve araç değeri hesaplamaları tek merkezde.",
    images: [],
  },
};

export default function OtoHesapIndex() {
  const modules = Object.keys(OTOHESAP_META).filter(module => OTOHESAP_GUIDES[module]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": PAGE_URL + "#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://otosoz.com/" },
          { "@type": "ListItem", position: 2, name: "OtoHesap", item: PAGE_URL },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": PAGE_URL + "#webpage",
        url: PAGE_URL,
        name: "OtoHesap: Otomotiv Hesaplama Araçları",
        description: PAGE_DESCRIPTION,
        inLanguage: "tr-TR",
        dateModified: OTOHESAP_LAST_REVIEWED,
        breadcrumb: { "@id": PAGE_URL + "#breadcrumb" },
        isPartOf: { "@id": "https://otosoz.com/#website" },
        mainEntity: { "@id": PAGE_URL + "#tools" },
      },
      {
        "@type": "ItemList",
        "@id": PAGE_URL + "#tools",
        name: "OtoHesap araçları",
        numberOfItems: modules.length,
        itemListElement: modules.map((module, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: OTOHESAP_GUIDES[module].h1,
          url: PAGE_URL + "/" + module,
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <OtoHesapIndexView />
    </>
  );
}
