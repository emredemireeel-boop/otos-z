import { notFound } from "next/navigation";
import { Metadata } from "next";
import obdCodes from "@/data/obd-codes.json";
import carModelsData from "@/data/carmodels.json";
import OBDDetailClient from "../../[slug]/OBDDetailClient";

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
    params: Promise<{ slug: string; code: string }>;
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug: brand, code } = await params;
    
    // Validate Brand
    const brandName = Object.keys(carModelsData).find(k => createSlug(k) === brand.toLowerCase());
    if (!brandName) return { title: "Marka Bulunamadı" };

    const upperCode = code.toUpperCase();
    const codeData = (obdCodes as ObdCode[]).find(c => c.code.toLowerCase() === code.toLowerCase());

    if (!codeData) {
        return {
            title: `${brandName} ${upperCode} Arıza Kodu Bulunamadı | OtoSöz`,
        };
    }

    const title = `${brandName} ${upperCode} Arıza Kodu Nedir? Çözümü [2026] | OtoSöz`;
    const description = `${brandName} ${upperCode} (${codeData.title}) DTC arıza kodu rehberi ✓ Belirtiler: ${codeData.symptoms.slice(0, 2).join(', ')} ✓ ${brandName} araçlara özel çözümler ✓ Tahmini onarım maliyeti ✓ OBD-II/EOBD [2026]`;

    const ogUrl = `/api/og?title=${encodeURIComponent(brandName + ' ' + upperCode + ' - ' + codeData.title)}&desc=${encodeURIComponent(description.slice(0, 160))}`;

    return {
        title,
        description: description.slice(0, 160),
        keywords: [`${brandName} ${upperCode}`, `${brandName} arıza kodları`, `${upperCode} nedir`, `${brandName} ${codeData.title}`, 'arıza kodu sorgulama', `DTC ${upperCode} ${brandName}`, `${brandName} OBD kodları`, `EOBD ${upperCode}`, `${upperCode} ${brandName.toLowerCase()} çözümü`],
        openGraph: {
            title,
            description: description.slice(0, 160),
            type: 'article',
            url: `https://otosoz.com/obd/${brand.toLowerCase()}/${code.toLowerCase()}`,
            images: [{ url: ogUrl, width: 1200, height: 630, alt: `${brandName} ${upperCode} Arıza Kodu` }],
        },
        alternates: {
            canonical: `https://otosoz.com/obd/${code.toLowerCase()}`,
        },
    };
}

export default async function BrandOBDCodePage({ params }: PageProps) {
    const { slug: brand, code } = await params;
    
    // Validate Brand
    const brandName = Object.keys(carModelsData).find(k => createSlug(k) === brand.toLowerCase());
    if (!brandName) notFound();

    // Validate Code
    const codeData = (obdCodes as ObdCode[]).find(c => c.code.toLowerCase() === code.toLowerCase());
    if (!codeData) notFound();

    // Related codes
    const prefix = codeData.code.slice(0, 2);
    const relatedCodes = (obdCodes as ObdCode[])
        .filter(c => c.type === codeData.type && c.code !== codeData.code && c.code.startsWith(prefix))
        .slice(0, 4);

    const typeLabel = getTypeLabel(codeData.type);

    // JSON-LD Structured Data
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${brandName} ${codeData.code} Arıza Kodu Nedir? ${codeData.title}`,
        "description": `${brandName} araçlar için ${codeData.description}`,
        "url": `https://otosoz.com/obd/${brand.toLowerCase()}/${codeData.code.toLowerCase()}`,
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
                "name": `${brandName} aracımda ${codeData.code} arıza kodu ne anlama gelir?`,
                "acceptedAnswer": { "@type": "Answer", "text": codeData.description }
            },
            {
                "@type": "Question",
                "name": `${brandName} ${codeData.code} arıza kodunun belirtileri nelerdir?`,
                "acceptedAnswer": { "@type": "Answer", "text": codeData.symptoms.join('. ') }
            },
            {
                "@type": "Question",
                "name": `${brandName} ${codeData.code} arıza kodu nasıl çözülür?`,
                "acceptedAnswer": { "@type": "Answer", "text": codeData.fixes.join('. ') }
            }
        ]
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://otosoz.com/" },
            { "@type": "ListItem", "position": 2, "name": "OBD Arıza Kodları", "item": "https://otosoz.com/obd" },
            { "@type": "ListItem", "position": 3, "name": brandName, "item": `https://otosoz.com/obd/${brand.toLowerCase()}` },
            { "@type": "ListItem", "position": 4, "name": codeData.code, "item": `https://otosoz.com/obd/${brand.toLowerCase()}/${codeData.code.toLowerCase()}` }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema, breadcrumbSchema]) }} />
            <OBDDetailClient codeData={codeData} relatedCodes={relatedCodes} typeLabel={typeLabel} brandName={brandName} />
        </>
    );
}
