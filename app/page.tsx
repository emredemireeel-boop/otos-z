import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import Link from "next/link";
import { ArrowRight, Car, Wrench, Scale } from "lucide-react";

const title = "OtoSöz | Araç Alımı, Arıza Çözümü ve Karşılaştırma";
const description = "Araç alırken, otomobil arızasını araştırırken veya iki aracı karşılaştırırken gerçek sürücü deneyimi, uzman görüşü ve düzenli veriyi OtoSöz'de inceleyin.";
const canonicalUrl = "https://otosoz.com/";

export const metadata: Metadata = {
    title,
    description,
    keywords: [
        "araç alımı",
        "araba alınır mı",
        "otomobil arıza çözümü",
        "araç karşılaştırma",
        "araç kullanıcı yorumları",
        "kronik sorunlar",
        "OBD arıza kodları",
        "otomotiv karar platformu",
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "OtoSöz",
        locale: "tr_TR",
        type: "website",
        images: [{ url: "/api/og", width: 1200, height: 630, alt: "OtoSöz otomotiv karar platformu" }],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/api/og"],
    },
};

const homePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://otosoz.com/#webpage",
    url: canonicalUrl,
    name: title,
    description,
    isPartOf: { "@id": "https://otosoz.com/#website" },
    about: [
        { "@type": "Thing", name: "Araç satın alma kararı" },
        { "@type": "Thing", name: "Otomobil arızaları ve OBD kodları" },
        { "@type": "Thing", name: "Araç karşılaştırma" },
    ],
    inLanguage: "tr-TR",
};

function DecisionHub() {
    const paths = [
        { number:"01", href:"/arac-dna", label:"Araç alacağım", description:"Kronik sorunları, kullanıcı deneyimlerini ve alınır mı analizini tek dosyada incele.", action:"Araç DNA’yı incele", icon:Car },
        { number:"02", href:"/uzmana-sor", label:"Aracım bozuldu", description:"Belirtiyi anlat; uzman ve topluluk görüşüyle arızayı anlamaya ve doğru adıma ulaşmaya başla.", action:"Uzmana sor", icon:Wrench },
        { number:"03", href:"/karsilastirma", label:"İki araç arasında kaldım", description:"Araçları yan yana karşılaştır; gerçek kullanıcı görüşünü ve topluluk oyunu birlikte değerlendir.", action:"Karşılaştırmaya başla", icon:Scale },
    ];
    return <section className="decision-hub" aria-labelledby="decision-hub-title"><div className="decision-hub-intro"><div><span className="decision-hub-kicker">OtoSöz karar merkezi</span><h1 id="decision-hub-title">Arabanla ilgili karar vermeden önce OtoSöz’e sor.</h1></div><p>OtoSöz yalnızca bir forum değil; araç seçimini, arıza çözümünü ve karşılaştırmayı gerçek deneyim, uzman görüşü ve düzenli veriyle birleştiren otomotiv karar platformudur.</p></div><div className="decision-path-grid">{paths.map(({number,href,label,description,action,icon:Icon})=><Link key={href} href={href} className="decision-path-card"><span className="decision-path-number">{number}</span><span className="decision-path-icon"><Icon size={21}/></span><h2>{label}</h2><p>{description}</p><span className="decision-path-action">{action} <ArrowRight size={15}/></span></Link>)}</div></section>;
}

export default function HomePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd).replace(/</g, "\u003c") }}
            />
            <HomeClient decisionHub={<DecisionHub />} />
        </>
    );
}
