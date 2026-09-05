import { notFound } from "next/navigation";
import { Metadata } from "next";
import obdCodes from "@/data/obd-codes.json";
import carModelsData from "@/data/carmodels.json";
import OBDDetailClient from "./OBDDetailClient";
import BrandHubClient from "./BrandHubClient";
import { createSeoSlug } from "@/lib/slug";

const BASE_URL = "https://otosoz.com";
const OBD_LAST_REVIEWED = "2026-08-26";
const POPULAR_OBD_CODES = [
    "P0420", "P0171", "P0300", "P0299", "P0401", "P0101",
    "P0340", "P0016", "P0128", "P0442", "B0001", "C0035",
    "U0100", "U0121",
];

interface ObdCode {
    code: string;
    title: string;
    description: string;
    type: string;
    isGeneric: boolean;
    severity: string;
    systems: string[];
    symptoms: string[];
    causes: string[];
    fixes: string[];
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

const ALL_CODES = Array.from(
    new Map((obdCodes as ObdCode[]).map(code => [code.code.toUpperCase(), code])).values()
);

function getTypeLabel(type: string) {
    switch (type) {
        case "P": return "Powertrain – Motor ve Şanzıman";
        case "B": return "Body – Gövde ve Konfor";
        case "C": return "Chassis – Şasi, Fren ve Süspansiyon";
        case "U": return "Network – Araç İletişim Ağı";
        default: return "OBD-II Sistemi";
    }
}

function truncateMetaDescription(text: string, maxLength = 158) {
    if (text.length <= maxLength) return text;
    const shortened = text.slice(0, maxLength - 1);
    const lastSpace = shortened.lastIndexOf(" ");
    return `${shortened.slice(0, lastSpace > 100 ? lastSpace : shortened.length).trim()}…`;
}

function findBrand(slug: string) {
    return Object.keys(carModelsData).find(brand => createSeoSlug(brand) === slug.toLowerCase());
}

export function generateStaticParams() {
    const popularSet = new Set(POPULAR_OBD_CODES);
    const selected = [
        ...ALL_CODES.filter(code => popularSet.has(code.code.toUpperCase())),
        ...["P", "B", "C", "U"].flatMap(type =>
            ALL_CODES.filter(code => code.type === type).slice(0, 30)
        ),
    ];

    return Array.from(new Map(selected.map(code => [code.code.toUpperCase(), code])).values())
        .map(code => ({ slug: code.code.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const normalizedSlug = slug.toLowerCase();
    const brandName = findBrand(normalizedSlug);

    if (brandName) {
        const models = (carModelsData as Record<string, string[]>)[brandName] || [];
        const description = truncateMetaDescription(
            `${brandName} araçlarda görülebilen OBD-II kodlarını sorgulayın. ${models.slice(0, 4).join(", ")} modelleri için kod anlamı, belirti ve çözüm rehberi.`
        );
        const url = `${BASE_URL}/obd/${normalizedSlug}`;

        return {
            title: `${brandName} OBD-II Arıza Kodu Sorgulama | OtoSöz`,
            description,
            alternates: { canonical: url },
            robots: {
                index: false,
                follow: true,
                googleBot: { index: false, follow: true },
            },
            openGraph: {
                title: `${brandName} OBD-II Arıza Kodu Sorgulama | OtoSöz`,
                description,
                url,
                type: "website",
            },
        };
    }

    const upperCode = normalizedSlug.toUpperCase();
    const codeData = ALL_CODES.find(code => code.code.toUpperCase() === upperCode);

    if (!codeData) {
        return {
            title: "OBD Arıza Kodu Bulunamadı | OtoSöz",
            robots: { index: false, follow: false },
        };
    }

    const canonicalUrl = `${BASE_URL}/obd/${codeData.code.toLowerCase()}`;
    const metaDescription = truncateMetaDescription(
        `${codeData.code} arıza kodu: ${codeData.title}. Türkçe anlamı, belirtileri, olası nedenleri, ciddiyet seviyesi ve kontrol edilmesi gereken çözüm adımları.`
    );
    const ogUrl = `/api/og?title=${encodeURIComponent(`${codeData.code} Arıza Kodu`)}&desc=${encodeURIComponent(codeData.title)}`;

    return {
        title: `${codeData.code} Arıza Kodu Nedir? Belirtileri ve Çözümü | OtoSöz`,
        description: metaDescription,
        keywords: [`${codeData.code} arıza kodu`, `${codeData.code} nedir`, `OBD ${codeData.code}`, codeData.title],
        alternates: { canonical: canonicalUrl },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
        },
        openGraph: {
            title: `${codeData.code} Arıza Kodu: ${codeData.title} | OtoSöz`,
            description: metaDescription,
            type: "article",
            url: canonicalUrl,
            images: [{ url: ogUrl, width: 1200, height: 630, alt: `${codeData.code} arıza kodu açıklaması` }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${codeData.code} Arıza Kodu: ${codeData.title} | OtoSöz`,
            description: metaDescription,
            images: [ogUrl],
        },
    };
}

export default async function OBDSlugPage({ params }: PageProps) {
    const { slug } = await params;
    const normalizedSlug = slug.toLowerCase();

    const brandName = findBrand(normalizedSlug);
    if (brandName) {
        const brandCodes = ["P", "B", "C", "U"].flatMap(type =>
            ALL_CODES.filter(code => code.type === type).slice(0, 12)
        );
        const brandModels = (carModelsData as Record<string, string[]>)[brandName] || [];

        return <BrandHubClient brandName={brandName} obdCodes={brandCodes} brandModels={brandModels} />;
    }

    const codeData = ALL_CODES.find(code => code.code.toLowerCase() === normalizedSlug);
    if (!codeData) notFound();

    const prefix = codeData.code.slice(0, 2);
    const relatedCodes = ALL_CODES
        .filter(code => code.type === codeData.type && code.code !== codeData.code && code.code.startsWith(prefix))
        .slice(0, 6);

    const canonicalUrl = `${BASE_URL}/obd/${codeData.code.toLowerCase()}`;
    const typeLabel = getTypeLabel(codeData.type);
    const faqItems = [
        { question: `${codeData.code} arıza kodu nedir?`, answer: codeData.description || codeData.title },
        ...(codeData.symptoms.length ? [{ question: `${codeData.code} arıza kodunun belirtileri nelerdir?`, answer: codeData.symptoms.slice(0, 5).join("; ") }] : []),
        ...(codeData.causes.length ? [{ question: `${codeData.code} arıza kodu neden oluşur?`, answer: codeData.causes.slice(0, 5).join("; ") }] : []),
        ...(codeData.fixes.length ? [{ question: `${codeData.code} arıza kodu nasıl giderilir?`, answer: `Kontrol sırası: ${codeData.fixes.slice(0, 5).join("; ")}` }] : []),
    ];
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "@id": `${canonicalUrl}#article`,
                "headline": `${codeData.code} Arıza Kodu: ${codeData.title}`,
                "description": codeData.description,
                "url": canonicalUrl,
                "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
                "dateModified": OBD_LAST_REVIEWED,
                "inLanguage": "tr-TR",
                "articleSection": typeLabel,
                "author": { "@type": "Organization", "name": "OtoSöz", "url": BASE_URL },
                "publisher": {
                    "@type": "Organization",
                    "name": "OtoSöz",
                    "url": BASE_URL,
                    "logo": { "@type": "ImageObject", "url": `${BASE_URL}/dark_logo.svg` },
                },
                "about": {
                    "@type": "DefinedTerm",
                    "name": codeData.code,
                    "description": codeData.title,
                    "inDefinedTermSet": `${BASE_URL}/obd`,
                },
            },
            {
                "@type": "FAQPage",
                "@id": `${canonicalUrl}#faq`,
                "mainEntity": faqItems.map(item => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": { "@type": "Answer", "text": item.answer },
                })),
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": BASE_URL },
                    { "@type": "ListItem", "position": 2, "name": "OBD-II Arıza Kodları", "item": `${BASE_URL}/obd` },
                    { "@type": "ListItem", "position": 3, "name": `${codeData.code} Arıza Kodu`, "item": canonicalUrl },
                ],
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <OBDDetailClient codeData={codeData} relatedCodes={relatedCodes} typeLabel={typeLabel} />
        </>
    );
}
