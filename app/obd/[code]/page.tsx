import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import obdCodes from "@/data/obd-codes.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OBDDetailClient from "./OBDDetailClient";

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
    params: Promise<{ code: string }>;
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
    const { code } = await params;
    const upperCode = code.toUpperCase();
    const codeData = (obdCodes as ObdCode[]).find(c => c.code.toLowerCase() === code.toLowerCase());

    if (!codeData) {
        return {
            title: `${upperCode} Arıza Kodu Bulunamadı | OtoSöz`,
        };
    }

    const description = `${upperCode} arıza kodu nedir? ${codeData.title}. Belirtiler: ${codeData.symptoms.slice(0, 2).join(', ')}. Olası nedenler ve çözüm yolları hakkında detaylı rehber.`;

    return {
        title: `${upperCode} Arıza Kodu Nedir? Nedenleri ve Çözümü | OtoSöz`,
        description: description.slice(0, 160),
        keywords: [`${upperCode}`, `${upperCode} arıza kodu`, `${upperCode} nedir`, `OBD ${upperCode}`, `${codeData.title}`, 'arıza kodu sorgulama', 'OBD kodları'],
        openGraph: {
            title: `${upperCode} - ${codeData.title} | OtoSöz`,
            description: description.slice(0, 160),
            type: 'article',
            url: `https://www.otosoz.com/obd/${code.toLowerCase()}`,
        },
        alternates: {
            canonical: `https://www.otosoz.com/obd/${code.toLowerCase()}`,
        },
    };
}

export default async function OBDCodePage({ params }: PageProps) {
    const { code } = await params;
    const codeData = (obdCodes as ObdCode[]).find(c => c.code.toLowerCase() === code.toLowerCase());

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
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${codeData.code} Arıza Kodu Nedir? ${codeData.title}`,
        "description": codeData.description,
        "url": `https://www.otosoz.com/obd/${codeData.code.toLowerCase()}`,
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
        }
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
