import {createPageMetadata} from '@/lib/seo';
import {breadcrumb as buildSchemaBreadcrumbList,article as buildSchemaArticle,faqPage as buildSchemaFAQPage} from '@/lib/schema';
import {schemaJson} from '@/lib/schema';
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { dictionaryTerms, categoryColors } from "@/data/dictionary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SozlukDetailClient from "./SozlukDetailClient";
import { getCanonicalDictionaryId } from "@/lib/seoUrls";
import { indexableDictionaryTerms, isQualityDictionaryTerm } from '@/lib/dictionary-catalog';
import { indexabilityRobots } from '@/lib/indexability';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const canonicalId = getCanonicalDictionaryId(id);
    const term = dictionaryTerms.find(t => t.id === canonicalId);

    if (!term) {
        return createPageMetadata({
        title: 'Terim Bulunamadı | OtoSöz Sözlük'
    });
    }

    const description = `${term.term} nedir? ${term.description.slice(0, 120)}... OtoSöz Otomotiv Sözlüğünde ${term.category} kategorisinde.`;

    const ogUrl = `/api/og?title=${encodeURIComponent(term.term)}&desc=${encodeURIComponent(term.description.slice(0, 160))}`;

    return createPageMetadata({
        title: `${term.term} Nedir? Anlamı ve Önemi | OtoSöz Otomotiv Sözlüğü`,
        description: description.slice(0, 160),
        path: `https://otosoz.com/sozluk/${canonicalId}`,
        index: isQualityDictionaryTerm(term)
    });
}

export default async function SozlukTermPage({ params }: PageProps) {
    const { id } = await params;
    const canonicalId = getCanonicalDictionaryId(id);
    const term = dictionaryTerms.find(t => t.id === canonicalId);

    if (!term) {
        notFound();
    }


    // Find same-category related terms
    const relatedTerms = indexableDictionaryTerms
        .filter(t => t.category === term.category && t.id !== term.id)
        .slice(0, 5);

    // Find same-letter terms
    const sameLetterTerms = indexableDictionaryTerms
        .filter(t => t.letter === term.letter && t.id !== term.id)
        .slice(0, 4);

    // JSON-LD structured data
    const structuredData = buildSchemaArticle({"@context": "https://schema.org",
"headline": `${term.term} Nedir?`,
"description": term.description,
"url": `https://otosoz.com/sozluk/${id}`,
"publisher": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": "https://otosoz.com"
        },
"mainEntity": buildSchemaFAQPage({"mainEntity": [
                {
                    "@type": "Question",
                    "name": `${term.term} nedir?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": term.description
                    }
                },
                {
                    "@type": "Question",
                    "name": `${term.term} neden önemlidir?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": term.why
                    }
                }
            ]})});

    const breadcrumbSchema = buildSchemaBreadcrumbList({"@context": "https://schema.org",
"itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Ana Sayfa",
                "item": "https://otosoz.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Otomotiv Sözlüğü",
                "item": "https://otosoz.com/kutuphane/kategori/otomotiv-sozluk"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": term.term,
                "item": `https://otosoz.com/sozluk/${id}`
            }
        ]});

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaJson(isQualityDictionaryTerm(term) ? [structuredData, breadcrumbSchema] : [breadcrumbSchema]) }}
            />
            <SozlukDetailClient term={term} relatedTerms={relatedTerms} sameLetterTerms={sameLetterTerms} />
        </>
    );
}
