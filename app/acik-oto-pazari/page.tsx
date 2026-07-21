import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    OPEN_CAR_MARKETS,
    TURKEY_PROVINCES,
    getMarketsByProvince,
} from "@/data/open-car-markets";
import MarketDirectory from "./market-directory";
import styles from "./open-car-markets.module.css";

const PAGE_URL = "https://otosoz.com/acik-oto-pazari";

export const metadata: Metadata = {
    title: "81 İl Açık Oto Pazarı Rehberi: Nerede, Hangi Gün? | OtoSöz",
    description: "Türkiye'nin 81 ili için açık oto pazarı rehberi. Kayseri, Antalya ve diğer illerde pazarın nerede kurulduğunu, hangi gün açık olduğunu ve kaynak durumunu kontrol edin.",
    keywords: [
        "açık oto pazarı", "oto pazarı nerede", "araba pazarı hangi gün", "81 il oto pazarı",
        "Kayseri oto pazarı", "Antalya açık oto pazarı",
    ],
    alternates: { canonical: PAGE_URL },
    openGraph: {
        title: "81 İl Açık Oto Pazarı Rehberi",
        description: "Doğrulama tarihi ve kaynaklarıyla Türkiye açık oto pazarı rehberi.",
        url: PAGE_URL,
        siteName: "OtoSöz",
        locale: "tr_TR",
        type: "website",
        images: [{ url: "/acik-oto-pazari-og.png", width: 1200, height: 630, alt: "81 İl Açık Oto Pazarı Rehberi" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "81 İl Açık Oto Pazarı Rehberi",
        description: "Pazarları kaynak, gün ve doğrulama durumuyla inceleyin.",
        images: ["/acik-oto-pazari-og.png"],
    },
};

function safeJsonLd(data: object) {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function OpenCarMarketsPage() {
    const verifiedMarkets = OPEN_CAR_MARKETS.filter((market) => market.status === "verified");
    const verifiedProvinceCount = new Set(verifiedMarkets.map((market) => market.provinceSlug)).size;
    const directory = TURKEY_PROVINCES.map((province) => {
        const markets = getMarketsByProvince(province.slug);
        return {
            ...province,
            verifiedCount: markets.filter((market) => market.status === "verified").length,
            reviewCount: markets.filter((market) => market.status !== "verified").length,
        };
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${PAGE_URL}#page`,
                url: PAGE_URL,
                name: "81 İl Açık Oto Pazarı Rehberi",
                description: "Türkiye genelindeki açık oto pazarlarını doğrulama ve kaynak durumuyla listeleyen il rehberi.",
                inLanguage: "tr-TR",
                isPartOf: { "@id": "https://otosoz.com/#website" },
            },
            {
                "@type": "ItemList",
                "@id": `${PAGE_URL}#iller`,
                numberOfItems: TURKEY_PROVINCES.length,
                itemListElement: TURKEY_PROVINCES.map((province, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: `${province.name} Açık Oto Pazarı`,
                    url: `${PAGE_URL}/${province.slug}`,
                })),
            },
        ],
    };

    return (
        <div className={styles.page}>
            <Navbar />
            <main className={styles.main}>
                <nav className={styles.breadcrumbs} aria-label="Sayfa yolu">
                    <Link href="/">Ana sayfa</Link><span>/</span><span>Açık oto pazarı</span>
                </nav>

                <section className={styles.hero}>
                    <div>
                        <span className={styles.eyebrow}>Kaynak kontrollü Türkiye rehberi</span>
                        <h1>81 il açık oto pazarı: nerede, hangi gün?</h1>
                        <p className={styles.heroLead}>
                            Eski veya kopyalanmış saatler yerine; pazarları il, ilçe, doğrulama tarihi ve kaynaklarıyla gösteriyoruz.
                            Kayseri ve Antalya başta olmak üzere her il için ayrı sayfaya ulaşabilirsiniz.
                        </p>
                        <div className={styles.heroActions}>
                            <a className={styles.primaryButton} href="#iller-baslik">İlini seç</a>
                            <Link className={styles.secondaryButton} href="/etkinlikler">Tüm otomobil etkinlikleri</Link>
                        </div>
                    </div>
                    <div className={styles.heroStats} aria-label="Rehber özeti">
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>81</span>
                            <div><strong>İl sayfası</strong><span>Her il için tek, kalıcı adres</span></div>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{verifiedMarkets.length}</span>
                            <div><strong>Doğrulanmış pazar</strong><span>{verifiedProvinceCount} ilde kaynaklı kayıt</span></div>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>21.07</span>
                            <div><strong>Son kontrol</strong><span>21 Temmuz 2026</span></div>
                        </div>
                    </div>
                </section>

                <section className={styles.trustStrip} aria-label="Bilgi politikası">
                    <div className={styles.trustItem}>
                        <strong>Kaynak görünür</strong>
                        <p>Belediye kaydı ve yayın tarihi pazar sayfasında açıkça gösterilir.</p>
                    </div>
                    <div className={styles.trustItem}>
                        <strong>Kesin olmayan bilgi işaretli</strong>
                        <p>Gün veya saat doğrulanamıyorsa tahmin yerine “teyit bekleniyor” yazar.</p>
                    </div>
                    <div className={styles.trustItem}>
                        <strong>Büyükşehir pazarları ayrı</strong>
                        <p>Aynı ildeki farklı ilçe ve pazarlar tek kayıt altında birleştirilmez.</p>
                    </div>
                </section>

                <MarketDirectory provinces={directory} />

                <section className={styles.contentSection}>
                    <span className={styles.eyebrow}>Gitmeden önce</span>
                    <h2>Açık oto pazarı bilgisi nasıl kontrol edilir?</h2>
                    <div className={styles.guideGrid}>
                        <article className={styles.guideCard}>
                            <span className={styles.guideNumber}>01</span>
                            <h3>Doğrulama tarihine bakın</h3>
                            <p>Pazar günleri, giriş ücretleri ve çalışma saatleri belediye kararıyla değişebilir.</p>
                        </article>
                        <article className={styles.guideCard}>
                            <span className={styles.guideNumber}>02</span>
                            <h3>Kaynağı açın</h3>
                            <p>Her doğrulanmış kayıtta belediye veya kurum sayfasına doğrudan bağlantı bulunur.</p>
                        </article>
                        <article className={styles.guideCard}>
                            <span className={styles.guideNumber}>03</span>
                            <h3>Yola çıkmadan teyit edin</h3>
                            <p>Özellikle resmî tatil, kış dönemi ve hava koşullarında belediyeden son bilgiyi alın.</p>
                        </article>
                    </div>
                </section>

                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
            </main>
            <Footer />
        </div>
    );
}
