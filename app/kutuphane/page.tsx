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

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const kategori = typeof resolvedParams.kategori === "string" ? resolvedParams.kategori : null;
    const cat = resolveCategory(kategori);

    const isRoot = !kategori || cat.slug === "makaleler";
    const canonicalUrl = cat.slug === "trafik-cezalari"
        ? TRAFFIC_FINES_CANONICAL
        : isRoot
            ? `${BASE_URL}/kutuphane`
            : `${BASE_URL}/kutuphane?kategori=${cat.slug}`;
    const ogUrl = `/api/og?title=${encodeURIComponent(cat.title.split("|")[0].trim())}&desc=${encodeURIComponent(cat.description.slice(0, 100))}`;

    return {
        title: cat.title,
        description: cat.description,
        keywords: cat.keywords,
        openGraph: {
            title: cat.title,
            description: cat.description,
            type: "website",
            url: canonicalUrl,
            siteName: "OtoSöz",
            images: [{ url: ogUrl, width: 1200, height: 630, alt: cat.title }],
        },
        twitter: {
            card: "summary_large_image",
            title: cat.title,
            description: cat.description,
            images: [ogUrl],
        },
        alternates: { canonical: canonicalUrl },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
        },
    };
}

// Sunucu tarafında görünür içerikle uyumlu CollectionPage ve BreadcrumbList üretir.
function buildJsonLd(cat: CatMeta): string {
    const isRoot = cat.slug === "makaleler";
    const pageUrl = cat.slug === "trafik-cezalari"
        ? TRAFFIC_FINES_CANONICAL
        : isRoot
            ? `${BASE_URL}/kutuphane`
            : `${BASE_URL}/kutuphane?kategori=${cat.slug}`;

    const graph: any[] = [
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
                { "@type": "ListItem", position: 2, name: "Kütüphane", item: `${BASE_URL}/kutuphane` },
                ...(isRoot ? [] : [{ "@type": "ListItem", position: 3, name: cat.name, item: pageUrl }]),
            ],
        },
        {
            "@type": "CollectionPage",
            name: cat.title.split("|")[0].trim(),
            description: cat.description,
            url: pageUrl,
            inLanguage: "tr-TR",
            dateModified: LIBRARY_LAST_REVIEWED,
            isPartOf: { "@type": "WebSite", name: "OtoSöz", url: BASE_URL },
            ...(isRoot ? {
                mainEntity: {
                    "@type": "ItemList",
                    numberOfItems: CATEGORIES.length,
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
                                    : `${BASE_URL}/kutuphane?kategori=${category.slug}`,
                    })),
                },
            } : {}),
        },
    ];


    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

export default async function KutuphaneServerPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const kategori = typeof resolvedParams.kategori === "string" ? resolvedParams.kategori : null;

    // Kategori yönlendirmeleri render öncesinde proxy.ts tarafından uygulanır.
    const cat = resolveCategory(kategori);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: buildJsonLd(cat) }}
            />
            <KutuphaneClient initialCategory={cat.slug} />
        </>
    );
}
