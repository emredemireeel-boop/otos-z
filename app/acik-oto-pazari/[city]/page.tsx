import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    TURKEY_PROVINCES,
    getMarketPath,
    getMarketsByProvince,
    getProvinceBySlug,
} from "@/data/open-car-markets";
import styles from "../open-car-markets.module.css";

interface CityPageProps {
    params: Promise<{ city: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
    return TURKEY_PROVINCES.map((province) => ({ city: province.slug }));
}

function safeJsonLd(data: object) {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}

function statusLabel(status: "verified" | "needs-confirmation" | "historical") {
    if (status === "verified") return "Doğrulanmış kayıt";
    if (status === "historical") return "Eski / aktif değil";
    return "Teyit bekliyor";
}

function statusClass(status: "verified" | "needs-confirmation" | "historical") {
    if (status === "verified") return styles.verifiedBadge;
    if (status === "historical") return styles.historicalBadge;
    return styles.reviewBadge;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
    const { city } = await params;
    const province = getProvinceBySlug(city);
    if (!province) return {};

    const markets = getMarketsByProvince(city);
    const verified = markets.filter((market) => market.status === "verified");
    const hasVerified = verified.length > 0;
    const canonical = `https://otosoz.com/acik-oto-pazari/${province.slug}`;
    const first = verified[0];
    const directAnswer = first
        ? `${first.shortName}${first.day ? ` ${first.day} günü` : ""}${first.address ? `, ${first.address} konumunda` : ""}.`
        : `${province.name} için güncel resmî kaynakla doğrulanmış aktif açık oto pazarı kaydı henüz bulunmuyor.`;

    return {
        title: `${province.name} Açık Oto Pazarı Nerede, Hangi Gün? | OtoSöz`,
        description: `${directAnswer} ${province.name} oto pazarı adres, gün, saat ve kaynak bilgilerini kontrol edin.`.slice(0, 160),
        keywords: [
            `${province.name} açık oto pazarı`, `${province.name} oto pazarı nerede`,
            `${province.name} araba pazarı hangi gün`, `${province.name} oto pazarı saat kaçta açılıyor`,
        ],
        alternates: { canonical },
        robots: hasVerified
            ? { index: true, follow: true, googleBot: { index: true, follow: true } }
            : { index: false, follow: true, googleBot: { index: false, follow: true } },
        openGraph: {
            title: `${province.name} Açık Oto Pazarı Rehberi`,
            description: directAnswer,
            url: canonical,
            siteName: "OtoSöz",
            locale: "tr_TR",
            type: "website",
            images: [{ url: "/acik-oto-pazari-og.png", width: 1200, height: 630, alt: `${province.name} açık oto pazarı` }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${province.name} Açık Oto Pazarı Rehberi`,
            description: directAnswer,
            images: ["/acik-oto-pazari-og.png"],
        },
    };
}

export default async function CityOpenCarMarketPage({ params }: CityPageProps) {
    const { city } = await params;
    const province = getProvinceBySlug(city);
    if (!province) notFound();

    const markets = getMarketsByProvince(city);
    const verifiedMarkets = markets.filter((market) => market.status === "verified");
    const reviewMarkets = markets.filter((market) => market.status !== "verified");
    const firstVerified = verifiedMarkets[0];
    const canonical = `https://otosoz.com/acik-oto-pazari/${province.slug}`;
    const directWhere = firstVerified?.address ?? "Güncel resmî adres kaydı bekleniyor";
    const directDay = firstVerified?.day ?? "Güncel resmî takvim bekleniyor";
    const directHours = firstVerified?.hours ?? "Resmî kaynakta güncel saat yayımlanmadı";

    const faqs = firstVerified
        ? [
            {
                question: `${province.name} açık oto pazarı nerede kuruluyor?`,
                answer: firstVerified.address
                    ? `${firstVerified.shortName}, ${firstVerified.address} konumunda yer alıyor. Aynı ilde birden fazla pazar varsa her biri aşağıda ayrı gösterilir.`
                    : `${firstVerified.shortName} için belediye kaydı bulunuyor; ancak açık adres ilgili resmî duyuruda yayımlanmamış.`,
            },
            {
                question: `${province.name} araba pazarı hangi gün kuruluyor?`,
                answer: firstVerified.day
                    ? `${firstVerified.shortName} için kaynaklarda belirtilen gün ${firstVerified.day}. Program değişebileceği için gitmeden önce kaynak bağlantısını kontrol edin.`
                    : "Güncel resmî kaynakta kesin gün yayımlanmadığı için tahmini gün bilgisi verilmiyor.",
            },
            {
                question: `${province.name} oto pazarı saat kaçta açılıyor?`,
                answer: firstVerified.hours
                    ? `Son resmî yayımlanan çalışma aralığı ${firstVerified.hours}. Programın değişmiş olabileceğini unutmayın.`
                    : "Güncel resmî açılış-kapanış saati yayımlanmadı. Belediyeden veya pazar işletmesinden teyit edin.",
            },
        ]
        : [
            {
                question: `${province.name} açık oto pazarı var mı?`,
                answer: `${province.name} için 21 Temmuz 2026 kontrolünde güncel resmî kaynakla doğrulanmış aktif açık oto pazarı kaydı bulunamadı. Bu ifade hiç pazar olmadığı anlamına gelmez; güvenilir gün ve adres kaydı beklenmektedir.`,
            },
            {
                question: `${province.name} oto pazarı bilgisi nasıl teyit edilir?`,
                answer: "İl veya ilçe belediyesinin zabıta, pazar yerleri ya da işletme biriminden gün, saat ve adres bilgisini teyit edin.",
            },
        ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${canonical}#page`,
                url: canonical,
                name: `${province.name} Açık Oto Pazarı Rehberi`,
                description: `${province.name} ilindeki açık oto pazarlarını kaynak ve doğrulama durumuyla listeleyen rehber.`,
                inLanguage: "tr-TR",
                isPartOf: { "@id": "https://otosoz.com/#website" },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Ana sayfa", item: "https://otosoz.com" },
                    { "@type": "ListItem", position: 2, name: "Etkinlikler", item: "https://otosoz.com/etkinlikler" },
                    { "@type": "ListItem", position: 3, name: province.name, item: canonical },
                ],
            },
            ...(verifiedMarkets.length > 0 ? [{
                "@type": "ItemList",
                itemListElement: verifiedMarkets.map((market, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: market.name,
                    url: `https://otosoz.com${getMarketPath(market)}`,
                })),
            }] : []),
            {
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: { "@type": "Answer", text: faq.answer },
                })),
            },
        ],
    };

    return (
        <div className={styles.page}>
            <Navbar />
            <main className={styles.main}>
                <nav className={styles.breadcrumbs} aria-label="Sayfa yolu">
                    <Link href="/">Ana sayfa</Link><span>/</span>
                    <Link href="/etkinlikler">Etkinlikler</Link><span>/</span>
                    <span>{province.name}</span>
                </nav>

                <header className={styles.cityHero}>
                    <span className={styles.eyebrow}>{String(province.plate).padStart(2, "0")} plaka · il rehberi</span>
                    <h1>{province.name} açık oto pazarı nerede, hangi gün?</h1>
                    <p className={styles.cityLead}>
                        {firstVerified
                            ? `${province.name} için doğrulanabilen pazarları ilçe ilçe ayırdık. Gün, saat ve adres bilgisinin hangi kaynağa dayandığını her kayıtta görebilirsiniz.`
                            : `${province.name} için doğrulanmış aktif pazar kaydı bekleniyor. Eski veya kaynaksız bilgiyi kesin program gibi göstermiyoruz.`}
                    </p>
                    <div className={styles.heroBadgeRow}>
                        <span className={`${styles.statusBadge} ${firstVerified ? styles.verifiedBadge : styles.reviewBadge}`}>
                            {firstVerified ? `${verifiedMarkets.length} doğrulanmış kayıt` : "Resmî teyit bekleniyor"}
                        </span>
                        <span className={styles.badge}>Son kontrol: 21 Temmuz 2026</span>
                        {markets.length > 1 && <span className={styles.badge}>{markets.length} pazar ayrı listelendi</span>}
                    </div>
                </header>

                <section className={styles.answerGrid} aria-label="Kısa cevaplar">
                    <article className={styles.answerCard}><span>Nerede?</span><strong>{directWhere}</strong></article>
                    <article className={styles.answerCard}><span>Hangi gün?</span><strong>{directDay}</strong></article>
                    <article className={styles.answerCard}><span>Saat kaçta?</span><strong>{directHours}</strong></article>
                </section>

                {verifiedMarkets.length > 0 ? (
                    <section className={styles.marketSection}>
                        <span className={styles.eyebrow}>Doğrulanmış kayıtlar</span>
                        <h2>{province.name} ilindeki açık oto pazarları</h2>
                        <div className={styles.marketList}>
                            {verifiedMarkets.map((market) => (
                                <Link key={market.slug} href={getMarketPath(market)} className={styles.marketCard}>
                                    <img className={styles.marketImage} src={market.imageUrl ?? "/otopazari_final_1.png"} alt="" />
                                    <div>
                                        <span className={`${styles.statusBadge} ${styles.verifiedBadge}`}>Doğrulanmış kayıt</span>
                                        <h3>{market.shortName}</h3>
                                        <p>{market.summary}</p>
                                        <div className={styles.marketMeta}>
                                            <span>{market.district}</span>
                                            <span>{market.day ?? "Gün teyidi bekleniyor"}</span>
                                            <span>{market.hours ?? "Saat yayımlanmadı"}</span>
                                        </div>
                                    </div>
                                    <span className={styles.marketArrow} aria-hidden="true">→</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : (
                    <section className={styles.marketSection}>
                        <div className={styles.notice}>
                            <strong>Doğrulanmış aktif pazar kaydı henüz yok</strong>
                            <p>
                                {province.name} sayfası 81 il rehberinin parçası olarak hazırlandı; fakat kaynak olmadan adres ve saat üretmedik.
                                Belediye veya pazar işletmesinden güncel bilgi yayımlandığında bu sayfa doğrulanmış kayda geçirilecek.
                            </p>
                        </div>
                    </section>
                )}

                {reviewMarkets.length > 0 && (
                    <section className={styles.marketSection}>
                        <span className={styles.eyebrow}>Yanlış yönlendirmeyi önleyen kayıtlar</span>
                        <h2>Teyit bekleyen veya eski pazarlar</h2>
                        <div className={styles.marketList}>
                            {reviewMarkets.map((market) => (
                                <Link key={market.slug} href={getMarketPath(market)} className={styles.marketCard}>
                                    <img className={styles.marketImage} src={market.imageUrl ?? "/otopazari_final_1.png"} alt="" />
                                    <div>
                                        <span className={`${styles.statusBadge} ${statusClass(market.status)}`}>
                                            {statusLabel(market.status)}
                                        </span>
                                        <h3>{market.shortName}</h3>
                                        <p>{market.verificationNote}</p>
                                    </div>
                                    <span className={styles.marketArrow} aria-hidden="true">→</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <section className={styles.contentSection}>
                    <span className={styles.eyebrow}>Alıcı ve satıcı kontrolü</span>
                    <h2>Pazara gitmeden önce üç kısa kontrol</h2>
                    <div className={styles.checklistGrid}>
                        <article className={styles.checkCard}>
                            <h3>Programı teyit edin</h3>
                            <p>Resmî tatil, mevsim ve hava koşullarında gün veya saat değişebilir.</p>
                        </article>
                        <article className={styles.checkCard}>
                            <h3>Ekspertizi pazardan ayırın</h3>
                            <p>Satıcının yönlendirdiği tek noktayla yetinmeden bağımsız ekspertiz seçin.</p>
                        </article>
                        <article className={styles.checkCard}>
                            <h3>Ödemeyi güvenli yapın</h3>
                            <p>Noter işlemi tamamlanmadan kapora veya araç bedelini kontrolsüz göndermeyin.</p>
                        </article>
                    </div>
                </section>

                <section className={styles.faqSection}>
                    <span className={styles.eyebrow}>Sık sorulan sorular</span>
                    <h2>{province.name} oto pazarı hakkında kısa cevaplar</h2>
                    <div className={styles.faqList}>
                        {faqs.map((faq) => (
                            <article key={faq.question} className={styles.faqItem}>
                                <h3>{faq.question}</h3><p>{faq.answer}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <Link className={styles.backLink} href="/etkinlikler">← Tüm etkinliklere dön</Link>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
            </main>
            <Footer />
        </div>
    );
}
