import { indexabilityRobots, isHubIndexable } from '@/lib/indexability';
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OPEN_CAR_MARKETS, TURKEY_PROVINCES, getMarketsByProvince, getMarketPath } from "@/data/open-car-markets";
import MarketDirectory from "./market-directory";
import styles from "./open-car-markets.module.css";

export const metadata: Metadata = {
    robots: indexabilityRobots(isHubIndexable('/acik-oto-pazari')),
    title: "Açık Oto Pazarı Nerede, Hangi Gün? İl İl Rehber | OtoSöz",
    description: "Şehrindeki açık oto pazarının adresini, kurulduğu günü ve kaynaklarını bul. Doğrulanmış kayıtları, teyit bekleyen ve kapanmış pazarlardan ayır.",
    alternates: { canonical: "https://otosoz.com/acik-oto-pazari" },
};

export default function OpenCarMarketPage() {
    const verifiedMarkets = OPEN_CAR_MARKETS.filter((market) => market.status === "verified");
    const provinces = TURKEY_PROVINCES.map((province) => {
        const markets = getMarketsByProvince(province.slug);
        return { ...province, verifiedCount: markets.filter((market) => market.status === "verified").length,
            reviewCount: markets.filter((market) => market.status === "needs-confirmation").length };
    });

    return (
        <div className={styles.page}>
            <Navbar />
            <main className={styles.main}>
                <nav className={styles.breadcrumbs} aria-label="İçerik yolu"><Link href="/">Ana sayfa</Link><span>/</span><span>Açık oto pazarları</span></nav>
                <section className={styles.hero}>
                    <div>
                        <span className={styles.eyebrow}>Adres · gün · kaynak</span>
                        <h1>Açık oto pazarı nerede, hangi gün?</h1>
                        <p>İlini seç, pazarın adresini ve kurulduğu günü kaynaklarıyla kontrol et. Teyit bekleyen veya kapanmış bir kaydı aktif pazar gibi sunmuyoruz.</p>
                        <div className={styles.heroActions}><a className={styles.primaryButton} href="#iller-baslik">Şehrimi seç</a><Link className={styles.secondaryButton} href="/kutuphane?kategori=ikinci-el-rehberi">İkinci el alım rehberi</Link></div>
                    </div>
                    <aside className={styles.heroStats} aria-label="Rehberin kapsamı">
                        <div className={styles.statCard}><span className={styles.statValue}>81</span><div><strong>İl dizini</strong><span>Adres ve gün bilgisine şehrinden ulaş.</span></div></div>
                        <div className={styles.statCard}><span className={styles.statValue}>{verifiedMarkets.length}</span><div><strong>Doğrulanmış pazar kaydı</strong><span>Her kaydın kaynaklarını ve kontrol tarihini incele.</span></div></div>
                    </aside>
                </section>
                <div className={styles.notice}><strong>Gitmeden önce güncel durumu teyit et.</strong><p>Belediye duyuruları ve çalışma saatleri değişebilir. Her pazarın ayrıntısındaki kaynak bağlantılarını kontrol et; doğrulanmamış kayıtlarda gün veya saat tahmin etmiyoruz.</p></div>
                <MarketDirectory provinces={provinces} />
                <section className={styles.contentSection} aria-labelledby="dogrulanmis-pazarlar">
                    <h2 id="dogrulanmis-pazarlar">Kaynaklı açık oto pazarı kayıtları</h2>
                    <div className={styles.marketList}>{verifiedMarkets.map((market) => (
                        <Link key={getMarketPath(market)} href={getMarketPath(market)} className={styles.marketCard}>
                            <div><h3>{market.name}</h3><p>{market.summary}</p><span className={styles.marketMeta}>{market.province} · {market.day || "Gün bilgisini kaynakta kontrol et"}</span></div>
                        </Link>
                    ))}</div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
