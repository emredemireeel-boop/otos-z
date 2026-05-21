import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import obdCodes from "@/data/obd-codes.json";
import carModelsData from "@/data/carmodels.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OBDDetailClient from "./OBDDetailClient";
import BrandHubClient from "./BrandHubClient";

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

function getTypeLabel(type: string) {
    switch (type) {
        case 'P': return 'Powertrain – Motor & Şanzıman';
        case 'B': return 'Body – Gövde & Konfor';
        case 'C': return 'Chassis – Şasi, Fren, Süspansiyon';
        case 'U': return 'Network – Araç İletişim Ağı';
        default: return 'Bilinmeyen Sistem';
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    
    // Check if it's a brand
    const brandName = Object.keys(carModelsData).find(k => k.toLowerCase() === slug.toLowerCase());
    if (brandName) {
        return {
            title: `${brandName} Arıza Kodları ve Çözümleri | OtoSöz`,
            description: `${brandName} marka aracınızda karşılaştığınız tüm OBD-II arıza kodlarının anlamları, belirtileri ve çözüm yolları.`,
            alternates: {
                canonical: `https://www.otosoz.com/obd/${slug.toLowerCase()}`,
            },
        };
    }

    const upperCode = slug.toUpperCase();
    const codeData = (obdCodes as ObdCode[]).find(c => c.code.toLowerCase() === slug.toLowerCase());

    if (!codeData) {
        return {
            title: `${upperCode} Arıza Kodu Bulunamadı | OtoSöz`,
        };
    }

    const description = `${upperCode} arıza kodu nedir? ${codeData.title}. Belirtiler: ${codeData.symptoms.slice(0, 2).join(', ')}. Olası nedenler ve çözüm yolları hakkında detaylı rehber.`;

    const ogUrl = `/api/og?title=${encodeURIComponent(upperCode + ' - ' + codeData.title)}&desc=${encodeURIComponent(description.slice(0, 160))}`;

    return {
        title: `${upperCode} Arıza Kodu Nedir? Nedenleri ve Çözümü | OtoSöz`,
        description: description.slice(0, 160),
        keywords: [`${upperCode}`, `${upperCode} arıza kodu`, `${upperCode} nedir`, `OBD ${upperCode}`, `${codeData.title}`, 'arıza kodu sorgulama', 'OBD kodları'],
        openGraph: {
            title: `${upperCode} - ${codeData.title} | OtoSöz`,
            description: description.slice(0, 160),
            type: 'article',
            url: `https://www.otosoz.com/obd/${slug.toLowerCase()}`,
            images: [
                {
                    url: ogUrl,
                    width: 1200,
                    height: 630,
                    alt: `${upperCode} Arıza Kodu`,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${upperCode} - ${codeData.title} | OtoSöz`,
            description: description.slice(0, 160),
            images: [ogUrl],
        },
        alternates: {
            canonical: `https://www.otosoz.com/obd/${slug.toLowerCase()}`,
        },
    };
}

export default async function OBDSlugPage({ params }: PageProps) {
    const { slug } = await params;
    
    // 1. Check if slug is a Brand
    const brandName = Object.keys(carModelsData).find(k => k.toLowerCase() === slug.toLowerCase());
    if (brandName) {
        return <BrandHubClient brandName={brandName} obdCodes={obdCodes as ObdCode[]} />;
    }

    // 2. Check if slug is a Code
    const codeData = (obdCodes as ObdCode[]).find(c => c.code.toLowerCase() === slug.toLowerCase());

    if (!codeData) {
        notFound();
    }

    // Related codes (same type, similar code prefix)
    const prefix = codeData.code.slice(0, 2);
    const relatedCodes = (obdCodes as ObdCode[])
        .filter(c => c.type === codeData.type && c.code !== codeData.code && c.code.startsWith(prefix))
        .slice(0, 4);

    const typeLabel = getTypeLabel(codeData.type);

    // JSON-LD Structured Data for Google Rich Results
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${codeData.code} Arıza Kodu Nedir? ${codeData.title}`,
        "description": codeData.description,
        "url": `https://www.otosoz.com/obd/${codeData.code.toLowerCase()}`,
        "publisher": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": "https://www.otosoz.com"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `${codeData.code} arıza kodu ne anlama gelir?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": codeData.description
                }
            },
            {
                "@type": "Question",
                "name": `${codeData.code} arıza kodunun belirtileri nelerdir?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": codeData.symptoms.join('. ')
                }
            },
            {
                "@type": "Question",
                "name": `${codeData.code} arıza kodu nasıl çözülür?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": codeData.fixes.join('. ')
                }
            }
        ]
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Ana Sayfa",
                "item": "https://www.otosoz.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "OBD Arıza Kodları",
                "item": "https://www.otosoz.com/obd"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": codeData.code,
                "item": `https://www.otosoz.com/obd/${codeData.code.toLowerCase()}`
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema, breadcrumbSchema]) }}
            />
            <OBDDetailClient codeData={codeData} relatedCodes={relatedCodes} typeLabel={typeLabel} />
        </>
    );
}
