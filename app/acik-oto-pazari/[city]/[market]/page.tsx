import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    OPEN_CAR_MARKETS,
    getMarket,
    getMarketPath,
    getProvinceBySlug,
} from "@/data/open-car-markets";
import styles from "../../open-car-markets.module.css";

interface MarketPageProps {
    params: Promise<{ city: string; market: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
    return OPEN_CAR_MARKETS.map((market) => ({
        city: market.provinceSlug,
        market: market.slug,
    }));
}

function safeJsonLd(data: object) {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}

function getStatusContent(status: "verified" | "needs-confirmation" | "historical") {
    if (status === "verified") {
        return { label: "Kaynaklarla doğrulanmış", className: styles.verifiedBadge };
    }
    if (status === "historical") {
        return { label: "Eski veya aktif değil", className: styles.historicalBadge };
    }
    return { label: "Güncel resmî teyit bekleniyor", className: styles.reviewBadge };
}

export async function generateMetadata({ params }: MarketPageProps): Promise<Metadata> {
    const { city, market: marketSlug } = await params;
    const market = getMarket(city, marketSlug);
    if (!market) return {};

    const canonical = `https://otosoz.com${getMarketPath(market)}`;
    const direct = `${market.shortName}${market.day ? ` ${market.day} günü` : ""}${market.address ? ` ${market.address} adresinde` : ""}.`;
    const isIndexable = market.status === "verified";

    return {
        title: `${market.shortName} Nerede, Hangi Gün, Saat Kaçta? | OtoSöz`,
        description: `${direct} Güncel adres, çalışma günü, saat, doğrulama tarihi ve kaynak bağlantılarını inceleyin.`.slice(0, 160),
        keywords: [
            market.name,
            `${market.province} oto pazarı`,
            `${market.district} açık oto pazarı`,
            `${market.shortName} hangi gün`,
            `${market.shortName} saat kaçta açılıyor`,
        ],
        alternates: { canonical },
        robots: isIndexable
            ? { index: true, follow: true, googleBot: { index: true, follow: true } }
            : { index: false, follow: true, googleBot: { index: false, follow: true } },
        openGraph: {
            title: `${market.shortName}: Nerede, Hangi Gün?`,
            description: market.verificationNote,
            url: canonical,
            siteName: "OtoSöz",
            locale: "tr_TR",
            type: "website",
            images: [{ url: "/acik-oto-pazari-og.png", width: 1200, height: 630, alt: market.shortName }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${market.shortName}: Nerede, Hangi Gün?`,
            description: market.verificationNote,
            images: ["/acik-oto-pazari-og.png"],
        },
    };
}

export default async function OpenCarMarketDetailPage({ params }: MarketPageProps) {
    const { city, market: marketSlug } = await params;
    const province = getProvinceBySlug(city);
    const market = getMarket(city, marketSlug);
    if (!province || !market) notFound();

    const status = getStatusContent(market.status);
    const canonical = `https://otosoz.com${getMarketPath(market)}`;
    const mapQuery = market.address ? `${market.name}, ${market.address}, ${market.province}` : `${market.name}, ${market.province}`;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
    const faqs = [
        {
            question: `${market.shortName} nerede?`,
            answer: market.address
                ? `${market.shortName}, ${market.address}, ${market.province} konumundadır. Konum bilgisinin doğrulama notunu ve kaynaklarını ziyaret öncesi kontrol edin.`
                : "Güncel resmî açık adres yayımlanmadığı için kesin konum bilgisi verilmemektedir.",
        },
        {
            question: `${market.shortName} hangi gün kuruluyor?`,
            answer: market.day
                ? `Kaynaklarda belirtilen gün ${market.day}. Program değişebileceği için yola çıkmadan önce güncel teyit önerilir.`
                : "Güncel resmî kaynakta kesin kuruluş günü yayımlanmamıştır.",
        },
        {
            question: `${market.shortName} saat kaçta açılıyor?`,
            answer: market.hours
                ? `Son yayımlanan çalışma saati ${market.hours}. Bu saat güncel olmayabileceği için ilgili kurumdan teyit edilmelidir.`
                : "Güncel resmî açılış-kapanış saati yayımlanmadı; tahmini saat bilgisi verilmemektedir.",
        },
    ];

    const graph: object[] = [
        {
            "@type": "WebPage",
            "@id": `${canonical}#page`,
            url: canonical,
            name: market.name,
            description: market.summary,
            inLanguage: "tr-TR",
            dateModified: market.checkedAt,
            isPartOf: { "@id": "https://otosoz.com/#website" },
        },
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Ana sayfa", item: "https://otosoz.com" },
                { "@type": "ListItem", position: 2, name: "Açık Oto Pazarı", item: "https://otosoz.com/acik-oto-pazari" },
                { "@type": "ListItem", position: 3, name: province.name, item: `https://otosoz.com/acik-oto-pazari/${province.slug}` },
                { "@type": "ListItem", position: 4, name: market.shortName, item: canonical },
            ],
        },
        {
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
        },
    ];

    if (market.status === "verified") {
        graph.push({
            "@type": "Place",
            "@id": `${canonical}#place`,
            name: market.name,
            description: market.summary,
            url: canonical,
            address: {
                "@type": "PostalAddress",
                streetAddress: market.address,
                addressLocality: market.district,
                addressRegion: market.province,
                addressCountry: "TR",
            },
        });
    }

    const jsonLd = { "@context": "https://schema.org", "@graph": graph };

    return (
        <div className={styles.page}>
            <Navbar />
            <main className={styles.main}>
                <nav className={styles.breadcrumbs} aria-label="Sayfa yolu">
                    <Link href="/">Ana sayfa</Link><span>/</span>
                    <Link href="/acik-oto-pazari">Açık oto pazarı</Link><span>/</span>
                    <Link href={`/acik-oto-pazari/${province.slug}`}>{province.name}</Link><span>/</span>
                    <span>{market.shortName}</span>
                </nav>

                <header className={styles.detailHero}>
                    <span className={styles.eyebrow}>{market.province} · {market.district}</span>
                    <h1>{market.shortName} nerede, hangi gün?</h1>
                    <p className={styles.detailLead}>{market.summary}</p>
                    <div className={styles.heroBadgeRow}>
                        <span className={`${styles.statusBadge} ${status.className}`}>{status.label}</span>
                        <span className={styles.badge}>Kontrol: 21 Temmuz 2026</span>
                    </div>
                </header>

                <section className={styles.answerGrid} aria-label="Kısa cevaplar">
                    <article className={styles.answerCard}>
                        <span>Nerede?</span><strong>{market.address ?? "Resmî adres teyidi bekleniyor"}</strong>
                    </article>
                    <article className={styles.answerCard}>
                        <span>Hangi gün?</span><strong>{market.day ?? "Güncel resmî takvim yayımlanmadı"}</strong>
                    </article>
                    <article className={styles.answerCard}>
                        <span>Saat kaçta?</span><strong>{market.hours ?? "Güncel resmî saat yayımlanmadı"}</strong>
                    </article>
                </section>

                <div className={styles.detailLayout}>
                    <div className={styles.detailContent}>
                        <section className={styles.panel}>
                            <h2>Bilginin doğrulama durumu</h2>
                            <p>{market.verificationNote}</p>
                        </section>

                        <section className={styles.panel}>
                            <h2>Pazara gitmeden önce</h2>
                            <p>
                                Açık oto pazarlarında program; resmî tatil, hava koşulu, mevsim ve belediye kararıyla değişebilir.
                                Araç alacaksanız bağımsız ekspertiz, noter güvenli ödeme ve şasi-motor numarası kontrolünü atlamayın.
                            </p>
                        </section>

                        <section className={styles.faqSection}>
                            <span className={styles.eyebrow}>Sık sorulan sorular</span>
                            <h2>{market.shortName} hakkında kısa cevaplar</h2>
                            <div className={styles.faqList}>
                                {faqs.map((faq) => (
                                    <article key={faq.question} className={styles.faqItem}>
                                        <h3>{faq.question}</h3><p>{faq.answer}</p>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className={styles.detailSidebar}>
                        <section className={styles.panel}>
                            <h3>Hızlı bilgi</h3>
                            <dl className={styles.factList}>
                                <div className={styles.factRow}><dt>İl</dt><dd>{market.province}</dd></div>
                                <div className={styles.factRow}><dt>İlçe</dt><dd>{market.district}</dd></div>
                                <div className={styles.factRow}><dt>Gün</dt><dd>{market.day ?? "Teyit bekleniyor"}</dd></div>
                                <div className={styles.factRow}><dt>Saat</dt><dd>{market.hours ?? "Yayımlanmadı"}</dd></div>
                                <div className={styles.factRow}><dt>Durum</dt><dd>{status.label}</dd></div>
                            </dl>
                            {market.address && (
                                <a className={styles.primaryButton} style={{ marginTop: 18, width: "100%" }} href={mapUrl} target="_blank" rel="noreferrer">
                                    Haritada ara
                                </a>
                            )}
                        </section>

                        <section className={styles.panel}>
                            <h3>Kaynaklar</h3>
                            {market.sources.length > 0 ? (
                                <div className={styles.sourceList}>
                                    {market.sources.map((source) => (
                                        <a key={source.url} className={styles.sourceLink} href={source.url} target="_blank" rel="noreferrer">
                                            <div><strong>{source.publisher}</strong><span>{source.label}</span></div><em>Aç ↗</em>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p>Güncel resmî kaynak bulunamadı; kayıt bu nedenle teyit bekliyor.</p>
                            )}
                        </section>

                        <section className={styles.panel}>
                            <h3>Bilgi hatalı mı?</h3>
                            <p>Belediye duyurusu veya işletme belgesiyle birlikte bize bildirin; doğrulayıp güncelleyelim.</p>
                            <Link className={styles.secondaryButton} style={{ marginTop: 18, width: "100%" }} href="/iletisim">Düzeltme bildir</Link>
                        </section>
                    </aside>
                </div>

                <Link className={styles.backLink} href={`/acik-oto-pazari/${province.slug}`}>← {province.name} pazarlarına dön</Link>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
            </main>
            <Footer />
        </div>
    );
}
