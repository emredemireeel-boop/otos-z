"use client";

import Link from "next/link";
import Image from "next/image";
import { Youtube, Instagram, MapPin, Mail } from "lucide-react";
import CookieSettingsTrigger from "@/components/CookieSettingsTrigger";

const forumLinks = [
    { href: "/forum", label: "Forum başlıkları" },
    { href: "/anket", label: "Topluluk anketleri" },
    { href: "/uzmana-sor", label: "Uzmana sor" },
];

const guideLinks = [
    { href: "/kutuphane", label: "Kütüphane kategorileri" },
    { href: "/makale", label: "Otomobil makaleleri" },
    { href: "/haberler", label: "Otomobil haberleri" },
    { href: "/piyasalar", label: "Otomotiv piyasaları" },
    { href: "/otobutce", label: "Bütçeye göre otomobil rehberi" },
    { href: "/trafik-cezasi", label: "Trafik cezası rehberi" },
    { href: "/acik-oto-pazari", label: "Açık oto pazarı rehberi" },
    { href: "/arac-dna", label: "Araç DNA analizleri" },
    { href: "/obd", label: "OBD arıza kodları" },
    { href: "/karsilastirma", label: "Araç karşılaştırma" },
    { href: "/otohesap", label: "OtoHesap araçları" },
];

const corporateLinks = [
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/editoryal-politika", label: "Editoryal politika" },
    { href: "/kaynaklar", label: "Kaynaklar" },
    { href: "/iletisim", label: "İletişim" },
    { href: "/kullanim-sartlari", label: "Kullanım şartları" },
    { href: "/gizlilik-politikasi", label: "Gizlilik politikası" },
    { href: "/cerez-politikasi", label: "Çerez politikası" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="site-footer-inner">
                <div className="site-footer-grid">
                    <section className="site-footer-brand" aria-labelledby="site-footer-brand-title">
                        <div className="site-footer-logo-row">
                            <span className="site-footer-logo">
                                <Image src="/white_logo.svg" alt="OtoSöz" fill sizes="40px" className="site-footer-logo-image" />
                            </span>
                            <span id="site-footer-brand-title" className="site-footer-name">OtoSöz</span>
                        </div>
                        <p>Arabanla ilgili karar vermeden önce OtoSöz&apos;e sor.</p>
                        <address className="site-footer-contact">
                            <Link prefetch={false} href="/iletisim"><Mail size={15} /> E-posta ile iletişim</Link>
                            <span><MapPin size={15} /> İzmir, Türkiye</span>
                        </address>
                        <div className="site-footer-socials" aria-label="OtoSöz sosyal medya hesapları">
                            <a href="https://www.youtube.com/@otosoz" target="_blank" rel="noopener noreferrer" aria-label="OtoSöz YouTube"><Youtube size={22} /></a>
                            <a href="https://www.instagram.com/otosoz.tr" target="_blank" rel="noopener noreferrer" aria-label="OtoSöz Instagram"><Instagram size={22} /></a>
                        </div>
                    </section>

                    <nav className="site-footer-nav" aria-labelledby="site-footer-forum-title">
                        <h2 id="site-footer-forum-title">Topluluk</h2>
                        {forumLinks.map(link => <Link prefetch={false} key={link.href + link.label} href={link.href}>{link.label}</Link>)}
                    </nav>

                    <nav className="site-footer-nav" aria-labelledby="site-footer-guides-title">
                        <h2 id="site-footer-guides-title">Karar araçları</h2>
                        {guideLinks.map(link => <Link prefetch={false} key={link.href} href={link.href}>{link.label}</Link>)}
                    </nav>

                    <nav className="site-footer-nav" aria-labelledby="site-footer-corporate-title">
                        <h2 id="site-footer-corporate-title">Kurumsal</h2>
                        {corporateLinks.map(link => <Link prefetch={false} key={link.href} href={link.href}>{link.label}</Link>)}
                        <CookieSettingsTrigger className="footer-cookie-settings-trigger">Çerez tercihleri</CookieSettingsTrigger>
                    </nav>
                </div>

                <div className="site-footer-bottom">
                    <p>© {currentYear} OtoSöz. Tüm hakları saklıdır.</p>
                    <span>Türkiye&apos;nin otomotiv karar platformu</span>
                </div>
            </div>
        </footer>
    );
}
