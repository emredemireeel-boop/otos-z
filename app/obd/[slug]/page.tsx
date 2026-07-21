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

function createSlug(text: string) {
    if (!text) return '';
    const map: Record<string, string> = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'ë': 'e',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u', 'Ë': 'e',
    };
    return text.replace(/[çğıöşüëÇĞİÖŞÜË]/g, m => map[m] || m)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function truncateMetaDescription(text: string, maxLength = 160) {
    if (text.length <= maxLength) return text;
    const shortened = text.slice(0, maxLength - 1);
    const lastSpace = shortened.lastIndexOf(' ');
    return `${shortened.slice(0, lastSpace > 100 ? lastSpace : shortened.length).trim()}…`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    
    // Check if it's a brand
    const brandName = Object.keys(carModelsData).find(k => createSlug(k) === slug.toLowerCase());
    if (brandName) {
        const models = (carModelsData as Record<string, string[]>)[brandName] || [];
        const modelSample = models.slice(0, 4).join(', ');
        const description = truncateMetaDescription(`${brandName} ${modelSample ? `${modelSample} gibi modellerde ` : ''}görülebilen OBD-II arıza kodlarının Türkçe anlamlarını, belirtilerini, nedenlerini ve çözüm adımlarını sorgulayın.`);
        return {
            title: `${brandName} OBD Arıza Kodları ve Çözümleri | OtoSöz`,
            description,
            keywords: [`${brandName} arıza kodları`, `${brandName} OBD kodları`, `${brandName} motor arıza kodu`, 'OBD-II kod sorgulama'],
            openGraph: {
                title: `${brandName} OBD Arıza Kodları | OtoSöz`,
                description,
                url: `https://otosoz.com/obd/${slug.toLowerCase()}`,
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${brandName} OBD Arıza Kodları | OtoSöz`,
                description,
            },
            alternates: {
                canonical: `https://otosoz.com/obd/${slug.toLowerCase()}`,
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

    const description = `${upperCode} (${codeData.title}) OBD-II/EOBD arıza kodu rehberi ✓ Belirtiler: ${codeData.symptoms.slice(0, 2).join(', ')} ✓ Nedenleri ve çözüm yolları ✓ Tahmini onarım maliyeti ✓ DTC ${upperCode} [2026 Güncel]`;

    const metaDescription = truncateMetaDescription(description);
    const ogUrl = `/api/og?title=${encodeURIComponent(upperCode + ' - ' + codeData.title)}&desc=${encodeURIComponent(metaDescription)}`;

    return {
        title: `${upperCode} Arıza Kodu Nedir? Nedenleri ve Çözümü [2026] | OtoSöz`,
        description: metaDescription,
        keywords: [`${upperCode}`, `${upperCode} arıza kodu`, `${upperCode} nedir`, `OBD ${upperCode}`, `DTC ${upperCode}`, `EOBD ${upperCode}`, `${codeData.title}`, 'arıza kodu sorgulama', 'OBD kodları', `${upperCode} çözümü`, `${upperCode} tamiri`, `${upperCode} onarım maliyeti`],
        openGraph: {
            title: `${upperCode} - ${codeData.title} | OtoSöz`,
            description: metaDescription,
            type: 'article',
            url: `https://otosoz.com/obd/${slug.toLowerCase()}`,
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
            description: metaDescription,
            images: [ogUrl],
        },
        alternates: {
            canonical: `https://otosoz.com/obd/${slug.toLowerCase()}`,
        },
    };
}

export default async function OBDSlugPage({ params }: PageProps) {
    const { slug } = await params;
    
    // 1. Check if slug is a Brand
    const brandName = Object.keys(carModelsData).find(k => createSlug(k) === slug.toLowerCase());
    if (brandName) {
        const uniqueCodes = Array.from(
            new Map((obdCodes as ObdCode[]).map(code => [code.code.toUpperCase(), code])).values()
        );
        const brandCodes = ['P', 'B', 'C', 'U'].flatMap(type =>
            uniqueCodes.filter(code => code.type === type).slice(0, 12)
        );
        const brandModels = (carModelsData as Record<string, string[]>)[brandName] || [];
        const brandUrl = `https://otosoz.com/obd/${slug.toLowerCase()}`;
        const brandDescription = `${brandName} araçlarda görülebilen evrensel OBD-II arıza kodlarının anlamları, belirtileri, nedenleri ve çözüm yolları.`;
        const brandSchema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "CollectionPage",
                    "name": `${brandName} OBD Arıza Kodları`,
                    "description": brandDescription,
                    "url": brandUrl,
                    "isPartOf": { "@type": "WebSite", "name": "OtoSöz", "url": "https://otosoz.com" },
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://otosoz.com" },
                        { "@type": "ListItem", "position": 2, "name": "OBD Arıza Kodları", "item": "https://otosoz.com/obd" },
                        { "@type": "ListItem", "position": 3, "name": brandName, "item": brandUrl },
                    ],
                },
            ],
        };

        return (
            <>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }} />
                <BrandHubClient brandName={brandName} obdCodes={brandCodes} brandModels={brandModels} />
            </>
        );
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
        "url": `https://otosoz.com/obd/${codeData.code.toLowerCase()}`,
        "publisher": {
            "@type": "Organization",
            "name": "OtoSöz",
            "url": "https://otosoz.com"
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
            },
            {
                "@type": "Question",
                "name": `${codeData.code} arıza kodu ile araç kullanmak güvenli mi?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${codeData.code} arıza kodunun ciddiyeti ${codeData.severity || 'Değişken'} seviyesindedir. Kesin teşhis için yetkili servise başvurmanız önerilir.`
                }
            },
            {
                "@type": "Question",
                "name": `${codeData.code} onarımı ne kadar tutar?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${codeData.code} onarım maliyeti araç markasına, model yılına ve servis noktasına göre değişiklik gösterir. Tahmini maliyet bilgisi için sayfamızdaki detaylı rehberi inceleyebilirsiniz.`
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
                "item": "https://otosoz.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "OBD Arıza Kodları",
                "item": "https://otosoz.com/obd"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": codeData.code,
                "item": `https://otosoz.com/obd/${codeData.code.toLowerCase()}`
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
