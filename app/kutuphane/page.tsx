import { Metadata } from "next";
import KutuphaneClient from "./KutuphaneClient";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const tabSlugs = [
    { slug: 'makaleler', name: 'Makale', title: 'Otomotiv Makaleleri | OtoSöz Kütüphane', description: 'Otomotiv dünyasına dair detaylı makaleler, bakım rehberleri ve uzman önerileri.' },
    { slug: 'ilginc-bilgiler', name: 'İlginç', title: 'İlginç Otomotiv Bilgileri | OtoSöz', description: 'Otomobil dünyasından ilginç bilgiler, ipucları, mit kırıcılar ve kontrol listeleri.' },
    { slug: 'otomotiv-sozluk', name: 'Sözlük', title: 'Otomotiv Sözlüğü - Türkçe Araç Terimleri | OtoSöz', description: 'A\'dan Z\'ye tüm otomotiv terimlerinin Türkçe açıklamaları. ABS, ESP, Tramer, Ekspertiz ve daha fazlası.' },
    { slug: 'obd-ariza-kodlari', name: 'OBD', title: 'OBD Arıza Kodları Sorgulama | OtoSöz', description: 'P0, P1, P2 ve tüm OBD arıza kodlarının Türkçe açıklamaları, nedenleri ve çözüm önerileri.' },
    { slug: 'gosterge-isiklari', name: 'Göstergeler', title: 'Araç Gösterge Işıkları ve Anlamları | OtoSöz', description: 'Arabadaki tüm ikaz lambalarının anlamları: motor arıza, ABS, yağ basıncı, hararet ve daha fazlası.' },
    { slug: 'trafik-cezalari', name: 'Trafik Cezaları', title: '2026 Trafik Ceza Tablosu - Güncel Tutarlar | OtoSöz', description: '2026 yılı güncel trafik ceza tutarları, ehliyet ceza puanları, alkol sınırları ve araç men süreleri.' },
    { slug: 'lastik-rehberi', name: 'Lastik Rehberi', title: 'Lastik Rehberi - Ebat, Mevsim, Bakım | OtoSöz', description: 'Lastik ebat okuma, kış/yaz lastik rehberi, hava basıncı tablosu ve lastik bakım önerileri.' },
    { slug: 'ikinci-el-rehberi', name: 'İkinci El', title: 'İkinci El Araç Kontrol Listesi | OtoSöz', description: 'İkinci el araç alırken dikkat edilmesi gerekenler: ekspertiz, tramer, km kontrolü ve pazarlık taktikleri.' },
    { slug: 'kaza-ilkyardim', name: 'Kaza & İlk Yardım', title: 'Trafik Kazasında Ne Yapılmalı? | OtoSöz', description: 'Kaza anında yapılması gerekenler, ilk yardım adımları, sigorta bildirimi ve hukuki süreç.' },
    { slug: 'mevsimsel-bakim', name: 'Mevsimsel Bakım', title: 'Mevsimsel Araç Bakım Rehberi | OtoSöz', description: 'Kış ve yaz hazırlığı için araç bakım kontrol listesi. Antifriz, lastik, akü ve klima bakımı.' },
    { slug: 'sigorta-rehberi', name: 'Sigorta Rehberi', title: 'Kasko vs Trafik Sigortası Karşılaştırma | OtoSöz', description: 'Kasko ve trafik sigortası arasındaki farklar, hasar süreci, sigorta yaptırma rehberi.' },
    { slug: 'otoyol-ve-kopru-ucretleri', name: 'Otoyol Ücretleri', title: 'Otoyol ve Köprü Geçiş Ücretleri 2026 | OtoSöz', description: '2026 yılı güncel Karayolları (KGM) ve Yap-İşlet-Devret otoyol, köprü, tünel geçiş ücretleri.' },
    { slug: 'bakim-zamanlari', name: 'Bakım Zamanları', title: 'Araç Bakım Zamanları ve Periyotları | OtoSöz', description: 'Benzinli, dizel, LPG, hibrit ve elektrikli araçlar için kilometre ve yıl bazlı periyodik bakım takvimi.' },
    { slug: 'tuvturk-muayene', name: 'TÜVTÜRK', title: 'TÜVTÜRK Araç Muayenesi Rehberi 2026 | OtoSöz', description: 'Ağır kusurlar, hafif kusurlar, randevu alma ve araç muayene aşamaları.' },
    { slug: 'arac-segmentleri', name: 'Kasa ve Segmentler', title: 'Araç Kasa Tipleri ve Segmentler (A,B,C,D) | OtoSöz', description: 'SUV, Sedan, Hatchback nedir? A, B, C, D sınıfı araç farkları ve karşılaştırma tablosu.' },
    { slug: 'plaka-kodlari', name: 'Plaka Kodları', title: 'Türkiye Plaka Kodları ve Özel Plakalar | OtoSöz', description: '01-81 tüm il plaka kodları sorgulama ve kırmızı, yeşil, sarı renkli özel plakaların anlamları.' },
    { slug: 'noter-islemleri', name: 'Noter & Alım Satım', title: '2026 Araç Noter İşlemleri ve Devir Ücretleri | OtoSöz', description: '2026 güncel noter araç satış ve plaka devir harçları. Güvenli ödeme sistemi rehberi.' },
    { slug: 'ehliyet-siniflari', name: 'Ehliyet & Harçlar', title: '2026 Ehliyet Sınıfları ve Sınav Harçları | OtoSöz', description: 'A, B, C, D sınıfı ehliyetler neleri kullanır? 2026 ehliyet harcı ücretleri ve SRC belgesi rehberi.' },
];

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const kategori = typeof resolvedParams.kategori === 'string' ? resolvedParams.kategori : null;
    
    let activeTabInfo = tabSlugs[0]; // Default is Makaleler
    if (kategori) {
        const found = tabSlugs.find(t => t.slug === kategori);
        if (found) activeTabInfo = found;
    }

    const title = activeTabInfo.title;
    const description = activeTabInfo.description;
    
    // Base URL or specific OG image can be created here
    const ogUrl = `/api/og?title=${encodeURIComponent(title.split('|')[0].trim())}&desc=${encodeURIComponent(description.slice(0, 100))}`;
    
    const canonicalUrl = kategori ? `https://www.otosoz.com/kutuphane?kategori=${kategori}` : `https://www.otosoz.com/kutuphane`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: canonicalUrl,
            images: [
                {
                    url: ogUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogUrl],
        },
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

export default async function KutuphaneServerPage() {
    return <KutuphaneClient />;
}
