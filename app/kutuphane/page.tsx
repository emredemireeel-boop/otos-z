import { Metadata } from "next";
import { permanentRedirect, redirect } from "next/navigation";
import KutuphaneClient from "./KutuphaneClient";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const BASE_URL = "https://otosoz.com";
const LIBRARY_LAST_REVIEWED = "2026-08-26";

// Eski → yeni kategori eşleştirmesi. Google'ın taradığı eski slug'ları doğru
// URL'ye 308 permanent redirect ile yönlendirir (200+canonical yerine).
const LEGACY_CATEGORY_MAP: Record<string, string | null> = {
    'otoyol-ucretleri': 'otoyol-ve-kopru-ucretleri',
    'ehliyet-sinifari': 'ehliyet-siniflari', // typo correction
    'makaleler': null, // null = redirect to /kutuphane (root)
};

// Her kategori benzersiz başlık, açıklama ve arama niyetiyle sunulur.
// Yapılandırılmış veri yalnızca sunucuda, görünür içerikle uyumlu üretilir.
interface CatMeta {
    slug: string;
    name: string;
    title: string;
    description: string;
    keywords: string[];
    faq?: { q: string; a: string }[];
}

const CATEGORIES: CatMeta[] = [
    {
        slug: "makaleler", name: "Makaleler",
        title: "Otomobil Bilgi Kütüphanesi ve Araç Rehberleri | OtoSöz",
        description: "OBD-II arıza kodları, gösterge ışıkları, bakım, lastik, trafik, muayene ve ikinci el araç rehberleri. Türkçe otomobil bilgi kütüphanesi.",
        keywords: ["otomobil bilgi kütüphanesi", "araç rehberleri", "otomotiv sözlüğü", "araç bakım rehberi", "OBD arıza kodları"],
    },
    {
        slug: "ilginc-bilgiler", name: "İlginç Bilgiler",
        title: "İlginç Otomotiv Bilgileri ve İpuçları | OtoSöz",
        description: "Otomobil dünyasından ilginç bilgiler, pratik ipuçları, kontrol listeleri ve az bilinen gerçekler.",
        keywords: ["ilginç otomotiv bilgileri", "araba ipuçları", "oto bilgi", "araç püf noktaları"],
    },
    {
        slug: "otomotiv-sozluk", name: "Otomotiv Sözlüğü",
        title: "Otomotiv Sözlüğü - Türkçe Araç Terimleri | OtoSöz",
        description: "A'dan Z'ye tüm otomotiv terimlerinin Türkçe açıklamaları. ABS, ESP, Tramer, Ekspertiz, Turbo ve daha fazlası.",
        keywords: ["otomotiv sözlüğü", "araç terimleri", "abs nedir", "tramer nedir", "ekspertiz nedir"],
        faq: [
            { q: "Tramer nedir?", a: "Tramer, Türkiye Motorlu Taşıt Bürosu'nun tuttuğu, bir aracın geçmiş hasar ve kaza kayıtlarını gösteren sistemdir. İkinci el araç alırken tramer sorgusu yapmak önemlidir." },
            { q: "ABS ne işe yarar?", a: "ABS (Kilitlenme Önleyici Fren Sistemi), sert frenlerde tekerleklerin kilitlenmesini önleyerek aracın kontrolünü kaybetmemenizi sağlar." },
        ],
    },
    {
        slug: "trafik-isaretleri", name: "Trafik İşaretleri",
        title: "Türkiye Trafik İşaretleri ve Anlamları (Resimli) | OtoSöz",
        description: "Tüm trafik tanzim, tehlike uyarı, bilgi ve park levhalarının resimleri ve detaylı açıklamaları. Ehliyet sınavı için trafik işaretleri.",
        keywords: ["trafik işaretleri", "trafik levhaları anlamları", "trafik tabelaları", "ehliyet trafik işaretleri"],
    },
    {
        slug: "obd-ariza-kodlari", name: "OBD Arıza Kodları",
        title: "OBD Arıza Kodları Sorgulama ve Anlamları | OtoSöz",
        description: "P0, P1, P2 ve tüm OBD2 arıza kodlarının Türkçe açıklamaları, nedenleri ve çözüm önerileri. Motor arıza lambası kod okuma.",
        keywords: ["obd arıza kodları", "p0 kodları", "motor arıza kodu", "obd2 kod sorgulama", "arıza kodu ne demek"],
        faq: [
            { q: "OBD arıza kodu nasıl okunur?", a: "OBD arıza kodları, araca takılan bir OBD2 tarayıcı cihazıyla okunur. Cihaz motor arıza lambasının nedenini P0300 gibi kodlar halinde gösterir." },
        ],
    },
    {
        slug: "gosterge-isiklari", name: "Gösterge Işıkları",
        title: "Araç Gösterge Işıkları ve Anlamları (Resimli) | OtoSöz",
        description: "Arabadaki tüm ikaz lambalarının anlamları: motor arıza, ABS, yağ basıncı, akü, hararet ve daha fazlası. Hangi ışık ne anlama gelir?",
        keywords: ["gösterge ışıkları", "ikaz lambaları", "motor arıza lambası", "araç uyarı ışıkları anlamları"],
        faq: [
            { q: "Sarı motor arıza lambası yandı, ne yapmalıyım?", a: "Sarı motor arıza lambası aracı hemen durdurmanızı gerektirmez ancak en kısa sürede bir servise başvurmalısınız. Kırmızı yanıyorsa aracı güvenli şekilde durdurun." },
        ],
    },
    {
        slug: "trafik-cezalari", name: "Trafik Cezaları",
        title: "2026 Trafik Ceza Tablosu - Güncel Tutarlar | OtoSöz",
        description: "2026 yılı güncel trafik ceza tutarları, ehliyet ceza puanları, alkol sınırları, hız cezaları ve araç men süreleri.",
        keywords: ["2026 trafik cezaları", "trafik ceza tutarları", "hız cezası 2026", "ceza puanı sorgulama"],
        faq: [
            { q: "2026 hız sınırı aşma cezası ne kadar?", a: "2026 yılında hız sınırını %10-%30 aşmanın cezası ve %30 üzeri aşmanın cezası kademeli olarak uygulanır. Güncel tutarlar için tablomuzu inceleyin." },
        ],
    },
    {
        slug: "lastik-rehberi", name: "Lastik Rehberi",
        title: "Lastik Rehberi - Ebat Okuma, Mevsim, Bakım | OtoSöz",
        description: "Lastik ebat okuma, kış/yaz lastik rehberi, hava basıncı tablosu, DOT tarihi ve lastik bakım önerileri.",
        keywords: ["lastik ebatları", "lastik okuma", "kış lastiği zorunluluğu", "lastik hava basıncı", "dot nedir"],
        faq: [
            { q: "Lastik ebatı nasıl okunur? (Örn: 205/55 R16)", a: "205 lastik genişliği (mm), 55 kesit oranı (%), R radyal yapı, 16 ise jant çapıdır (inç). Bu değerler lastiğin yan yüzeyinde yazar." },
        ],
    },
    {
        slug: "ikinci-el-rehberi", name: "İkinci El Rehberi",
        title: "İkinci El Araç Alırken Dikkat Edilecekler - Kontrol Listesi | OtoSöz",
        description: "İkinci el araç alırken dikkat edilmesi gerekenler: ekspertiz, tramer sorgulama, km kontrolü, boya kontrolü ve pazarlık taktikleri.",
        keywords: ["ikinci el araç alırken dikkat", "ikinci el kontrol listesi", "araç ekspertiz", "km düşürme tespiti"],
    },
    {
        slug: "kaza-ilkyardim", name: "Kaza & İlk Yardım",
        title: "Trafik Kazasında Ne Yapılmalı? İlk Yardım Rehberi | OtoSöz",
        description: "Kaza anında yapılması gerekenler, ilk yardım adımları, kaza tespit tutanağı, sigorta bildirimi ve hukuki süreç.",
        keywords: ["trafik kazasında ne yapılmalı", "kaza tespit tutanağı", "kaza sonrası ilk yardım", "maddi hasarlı kaza"],
    },
    {
        slug: "mevsimsel-bakim", name: "Mevsimsel Bakım",
        title: "Mevsimsel Araç Bakımı - Kış ve Yaz Hazırlığı | OtoSöz",
        description: "Kış ve yaz hazırlığı için araç bakım kontrol listesi. Antifriz, lastik, akü, klima ve silecek bakımı.",
        keywords: ["kışa araç hazırlığı", "yaz araç bakımı", "antifriz", "mevsimsel bakım"],
    },
    {
        slug: "sigorta-rehberi", name: "Sigorta Rehberi",
        title: "Kasko ve Trafik Sigortası Farkları - Rehber | OtoSöz",
        description: "Kasko ve zorunlu trafik sigortası arasındaki farklar, hasarsızlık indirimi, hasar süreci ve sigorta yaptırma rehberi.",
        keywords: ["kasko trafik sigortası farkı", "kasko nedir", "hasarsızlık indirimi", "sigorta rehberi"],
        faq: [
            { q: "Kasko ile trafik sigortası arasındaki fark nedir?", a: "Zorunlu trafik sigortası karşı tarafın zararını karşılar. Kasko ise isteğe bağlıdır ve kendi aracınızdaki hasarları (çarpma, çalınma, yangın vb.) da kapsar." },
        ],
    },
    {
        slug: "otoyol-ve-kopru-ucretleri", name: "Otoyol Ücretleri",
        title: "Otoyol ve Köprü Geçiş Ücretleri 2026 | OtoSöz",
        description: "2026 güncel Karayolları (KGM) ve Yap-İşlet-Devret otoyol, köprü, tünel geçiş ücretleri. HGS ücret tablosu.",
        keywords: ["otoyol ücretleri 2026", "köprü geçiş ücreti", "hgs ücretleri", "osmangazi köprüsü ücreti"],
    },
    {
        slug: "bakim-zamanlari", name: "Bakım Zamanları",
        title: "Araç Periyodik Bakım Zamanları ve Km Tablosu | OtoSöz",
        description: "Benzinli, dizel, LPG, hibrit ve elektrikli araçlar için kilometre ve yıl bazlı periyodik bakım takvimi. Yağ, filtre ve triger değişim zamanları.",
        keywords: ["periyodik bakım km", "yağ değişimi ne zaman", "triger değişimi", "araç bakım takvimi"],
    },
    {
        slug: "tuvturk-muayene", name: "TÜVTÜRK Muayene",
        title: "TÜVTÜRK Araç Muayenesi Rehberi 2026 - Ücret ve Randevu | OtoSöz",
        description: "2026 TÜVTÜRK muayene ücretleri, ağır ve hafif kusurlar, randevu alma ve araç muayene aşamaları. Muayeneden kalma nedenleri.",
        keywords: ["tüvtürk muayene ücreti 2026", "araç muayene randevu", "muayeneden kalma nedenleri", "tüvtürk"],
        faq: [
            { q: "Araç muayenesi kaç yılda bir yapılır?", a: "Otomobiller ilk 3 yaşından sonra 2 yılda bir muayeneye girer. Ticari araçlar ve taksilerde bu süre 1 yıldır." },
        ],
    },
    {
        slug: "arac-segmentleri", name: "Kasa ve Segmentler",
        title: "Araç Kasa Tipleri ve Segmentler (A, B, C, D) | OtoSöz",
        description: "SUV, Sedan, Hatchback, Station Wagon nedir? A, B, C, D, E segment araç farkları, örnekler ve karşılaştırma tablosu.",
        keywords: ["araç segmentleri", "b segment nedir", "c segment araçlar", "suv sedan farkı", "kasa tipleri"],
        faq: [
            { q: "C segment araç ne demek?", a: "C segment, kompakt sınıf olarak bilinir. Volkswagen Golf, Fiat Egea, Renault Megane gibi araçlar bu segmentte yer alır." },
        ],
    },
    {
        slug: "plaka-kodlari", name: "Plaka Kodları",
        title: "Türkiye İl Plaka Kodları (01-81) ve Özel Plakalar | OtoSöz",
        description: "01'den 81'e tüm il plaka kodları listesi ve kırmızı, yeşil, mavi renkli özel plakaların anlamları.",
        keywords: ["il plaka kodları", "34 nerenin plakası", "plaka kodları listesi", "kırmızı plaka anlamı"],
    },
    {
        slug: "noter-islemleri", name: "Noter & Alım Satım",
        title: "2026 Araç Noter Satış İşlemleri ve Devir Ücretleri | OtoSöz",
        description: "2026 güncel noter araç satış ve plaka devir harçları, gerekli evraklar ve güvenli ödeme sistemi rehberi.",
        keywords: ["noter araç satış ücreti 2026", "araç devir işlemleri", "noter satış evrakları", "güvenli araç ödeme"],
    },
    {
        slug: "ehliyet-siniflari", name: "Ehliyet & Harçlar",
        title: "2026 Ehliyet Sınıfları (A, B, C, D) ve Harç Ücretleri | OtoSöz",
        description: "A, B, C, D sınıfı ehliyetler hangi araçları kullanır? 2026 ehliyet harcı ücretleri, SRC belgesi ve yenileme rehberi.",
        keywords: ["ehliyet sınıfları", "b sınıfı ehliyet", "ehliyet harcı 2026", "src belgesi", "ehliyet yenileme"],
    },
    {
        slug: "kasko-deger", name: "Kasko Değer",
        title: "Kasko Değer Listesi 2026 - Araç Kasko Bedeli Sorgulama | OtoSöz",
        description: "TSB güncel kasko değer listesi 2026. Fiat Egea, Renault Clio, VW Golf ve tüm araçların güncel kasko değerlerini sorgulayın.",
        keywords: ["kasko değer listesi 2026", "araç kasko bedeli", "tsb kasko değer", "kasko değeri sorgulama"],
    },
    {
        slug: "hgs-siniflari", name: "HGS Sınıfları",
        title: "HGS Araç Sınıfları ve Geçiş Ücretleri 2026 | OtoSöz",
        description: "HGS araç sınıfları nedir? 1-5. sınıf araç tanımları, aks sayısı, geçiş ücretleri ve bakiye yükleme rehberi.",
        keywords: ["hgs sınıfları", "hgs araç sınıfı sorgulama", "hgs 1. sınıf", "hgs geçiş ücreti"],
    },
    {
        slug: "dolandiricilik-rehberi", name: "Dolandırıcılık Rehberi",
        title: "Araç Dolandırıcılığı Yöntemleri ve Korunma Yolları | OtoSöz",
        description: "Otomotiv sektöründeki en yaygın dolandırıcılık yöntemleri ve korunma kuralları. Sahte ilan, km düşürme, kaparo ve evrak sahteciliği.",
        keywords: ["araç dolandırıcılığı", "sahte ilan", "km düşürme", "araç kaparo dolandırıcılığı"],
    },
    {
        slug: "nereye-gitmeli", name: "Nereye Gitmeli?",
        title: "Araç Arızasında Nereye Gitmeli? Doğru Servis Rehberi | OtoSöz",
        description: "Klima, motor, şanzıman, fren, elektrik arızasında hangi uzmana gitmelisiniz? Doğru servis rehberi, tahmini maliyet ve süreler.",
        keywords: ["araç arızası nereye gitmeli", "hangi tamirciye gitmeli", "oto servis rehberi", "arıza maliyeti"],
    },
    {
        slug: "hasar-sorgulama", name: "Hasar Sorgulama",
        title: "5664 Hasar (Tramer) Sorgulama Nasıl Yapılır? | OtoSöz",
        description: "İkinci el araç almadan önce 5664 SMS ile tramer/hasar sorgulama nasıl yapılır? ERP nedir, bedelsiz hasarın riskleri nelerdir?",
        keywords: ["5664 hasar sorgulama", "tramer sorgulama sms", "araç hasar kaydı sorgulama", "erp nedir"],
    },
    {
        slug: "efsane-avcilari", name: "Efsane Avcıları",
        title: "Oto Efsane Avcıları - Doğru Bilinen Yanlışlar | OtoSöz",
        description: "Otomotiv dünyasında doğru bilinen yanlışlar. Yokuş aşağı boşa atmak, motoru ısıtmak, kalın yağ kullanmak gibi sanayi efsanelerinin mühendislik gerçekleri.",
        keywords: ["oto efsaneleri", "doğru bilinen yanlışlar araba", "motor ısıtmak gerekli mi", "yokuş aşağı boşa almak"],
    },
    {
        slug: "nasil-yapilir", name: "Nasıl Yapılır?",
        title: "Nasıl Yapılır? Adım Adım Araç Bakım Rehberleri | OtoSöz",
        description: "Patlak lastik değiştirme, akü takviyesi, motor yağı kontrolü ve daha fazlası. Adım adım resimli araç bakım ve acil durum rehberleri.",
        keywords: ["lastik nasıl değiştirilir", "akü takviyesi nasıl yapılır", "motor yağı kontrolü", "araç bakımı nasıl yapılır"],
    },
];

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
    const canonicalUrl = isRoot ? `${BASE_URL}/kutuphane` : `${BASE_URL}/kutuphane?kategori=${cat.slug}`;
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
    const pageUrl = isRoot ? `${BASE_URL}/kutuphane` : `${BASE_URL}/kutuphane?kategori=${cat.slug}`;

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

    // Kütüphane içindeki eski OBD kopyasını ana, kapsamlı OBD merkezinde birleştir.
    if (kategori === "obd-ariza-kodlari") {
        permanentRedirect("/obd");
    }

    // ── Eski veya geçersiz kategori slug'larını 308 redirect ile doğru URL'ye yönlendir ──
    // Bu, Google'ın "Doğru standart etikete sahip alternatif sayfa" uyarısını önler.
    if (kategori) {
        // 1) Bilinen eski slug → yeni slug eşleştirmesi
        if (kategori in LEGACY_CATEGORY_MAP) {
            const newSlug = LEGACY_CATEGORY_MAP[kategori];
            if (newSlug) {
                permanentRedirect(`/kutuphane?kategori=${newSlug}`);
            } else {
                permanentRedirect('/kutuphane');
            }
        }
        // 2) Tanınmayan slug → ana kütüphane sayfasına yönlendir
        const isKnown = CATEGORIES.some(c => c.slug === kategori);
        if (!isKnown) {
            redirect('/kutuphane');
        }
    }

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
