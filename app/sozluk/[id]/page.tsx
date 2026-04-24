import { notFound } from "next/navigation";
import { Metadata } from "next";
import { dictionaryTerms, categoryColors } from "@/data/dictionary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SozlukDetailClient from "./SozlukDetailClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const term = dictionaryTerms.find(t => t.id === id);

    if (!term) {
        return { title: 'Terim Bulunamadı | OtoSöz Sözlük' };
    }

    const description = `${term.term} nedir? ${term.description.slice(0, 120)}... OtoSöz Otomotiv Sözlüğünde ${term.category} kategorisinde.`;

    return {
        title: `${term.term} Nedir? Anlamı ve Önemi | OtoSöz Otomotiv Sözlüğü`,
        description: description.slice(0, 160),
        keywords: [term.term, `${term.term} nedir`, `${term.term} ne demek`, `otomotiv ${term.term}`, term.category, 'otomotiv sözlük', 'araba terimleri'],
        openGraph: {
            title: `${term.term} Nedir? | OtoSöz`,
            description: description.slice(0, 160),
            type: 'article',
            url: `https://www.otosoz.com/sozluk/${id}`,
        },
        alternates: {
            canonical: `https://www.otosoz.com/sozluk/${id}`,
        },
    };
}

export default async function SozlukTermPage({ params }: PageProps) {
    const { id } = await params;
    const term = dictionaryTerms.find(t => t.id === id);

    if (!term) {
        notFound();
    }

    // Find same-category related terms
    const relatedTerms = dictionaryTerms
        .filter(t => t.category === term.category && t.id !== term.id)
        .slice(0, 5);

    // Find same-letter terms
    const sameLetterTerms = dictionaryTerms
        .filter(t => t.letter === term.letter && t.id !== term.id)
        .slice(0, 4);

    // JSON-LD structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${term.term} Nedir?`,
        "description": term.description,
        "url": `https://www.otosoz.com/sozluk/${id}`,
        "publisher": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": "https://www.otosoz.com"
        },
        "mainEntity": {
            "@type": "FAQPage",
            "mainEntity": [
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
            ]
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <SozlukDetailClient term={term} relatedTerms={relatedTerms} sameLetterTerms={sameLetterTerms} />
        </>
    );
}
