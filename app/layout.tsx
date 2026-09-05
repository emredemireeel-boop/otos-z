import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "./cookie-consent.css";

export const metadata: Metadata = {
    metadataBase: new URL('https://otosoz.com'),
    title: {
        default: "OtoSöz | Araç Alımı, Arıza Çözümü ve Karşılaştırma",
        // Alt sayfalar kendi marka eklerini yönetiyor. Burada tekrar eklemek
        // "... | Otosöz | Otosöz" biçiminde yinelenen başlıklar üretiyordu.
        template: '%s',
    },
    description: "OtoSöz; araç alırken, arıza araştırırken veya iki otomobili karşılaştırırken gerçek sürücü deneyimini, uzman görüşünü ve veriyi bir araya getiren otomotiv karar platformudur.",
    keywords: [
        "otomotiv karar platformu", "araç satın alma", "araba alınır mı", "araç kullanıcı yorumları",
        "otomobil arıza çözümü", "uzmana sor", "kronik sorunlar", "otomobil",
        "araç arıza kodları", "OBD kodları", "gösterge ışıkları",
        "ikinci el araç", "araç karşılaştırma", "araç DNA", "trafik cezaları 2026",
        "yakıt hesaplama", "otomotiv forum", "araç bakım rehberi", "kasko değer listesi",
        "motor arıza", "lastik rehberi", "ehliyet sınıfları", "MTV hesaplama",
        "otomotiv sözlük", "araç muayene", "TÜVTÜRK randevu", "otoyol ücretleri",
    ],
    icons: {
        icon: [
            { url: '/dark_logo.svg', media: '(prefers-color-scheme: dark)' },
            { url: '/whitemode_logo.svg', media: '(prefers-color-scheme: light)' },
        ],
        apple: '/dark_logo.svg',
    },
    manifest: '/manifest.json',
    robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
    openGraph: {
        title: "OtoSöz | Araç Alımı, Arıza Çözümü ve Karşılaştırma",
        description: "Araç seçimi, arıza çözümü ve otomobil karşılaştırması için gerçek deneyim, uzman görüşü ve veriler tek platformda.",
        url: 'https://otosoz.com',
        siteName: 'OtoSöz',
        locale: 'tr_TR',
        type: 'website',
        images: [
            {
                url: '/api/og',
                width: 1200,
                height: 630,
                alt: 'OtoSöz — Otomotiv Karar Platformu',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "OtoSöz | Araç Alımı, Arıza Çözümü ve Karşılaştırma",
        description: "Araç seçimi, arıza çözümü ve otomobil karşılaştırması için doğru bilgi ve gerçek deneyim tek platformda.",
        images: ['/api/og'],
        creator: '@otosoz',
    },
    category: 'automotive',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: '(prefers-color-scheme: dark)', color: '#000000' },
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    ],
};

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import GlobalEngagement from "@/components/GlobalEngagement";
import GlobalAdRails from "@/components/GlobalAdRails";
import CookieConsent from "@/components/CookieConsent";

// ── JSON-LD Yapılandırılmış Veri (Structured Data) ──
// Google'ın siteyi bir "Kuruluş" ve "Web Sitesi" olarak tanımasını sağlar.
// Sitelinks Search Box, Knowledge Panel ve zengin snippet tetikleyicileri.
const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': 'https://otosoz.com/#organization',
            name: 'OtoSöz',
            url: 'https://otosoz.com',
            logo: {
                '@type': 'ImageObject',
                url: 'https://otosoz.com/dark_logo.svg',
                width: 512,
                height: 512,
            },
            description: 'Araç seçimi, arıza çözümü ve otomobil karşılaştırması için sürücü deneyimini, uzman görüşünü ve veriyi bir araya getiren otomotiv karar platformu.',
            slogan: 'Arabanla ilgili karar vermeden önce OtoSöz’e sor.',
            knowsAbout: ['Araç satın alma', 'Otomobil arızaları', 'Araç karşılaştırma', 'Araç DNA analizi', 'OBD arıza kodları'],
            foundingDate: '2024-01-01',
            email: 'iletisim@otosoz.com',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'İzmir',
                addressCountry: 'TR',
            },
            areaServed: {
                '@type': 'Country',
                name: 'Türkiye',
            },
            sameAs: [
                'https://www.youtube.com/@otosoz',
                'https://www.instagram.com/otosoz.tr',
            ],
            contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                availableLanguage: 'Turkish',
                email: 'iletisim@otosoz.com',
                url: 'https://otosoz.com/iletisim',
            },
        },
        {
            '@type': 'WebSite',
            '@id': 'https://otosoz.com/#website',
            url: 'https://otosoz.com',
            name: 'OtoSöz',
            description: 'Türkiye’nin araç seçimi, arıza çözümü ve otomobil karşılaştırmasına odaklanan otomotiv karar platformu',
            publisher: { '@id': 'https://otosoz.com/#organization' },
            inLanguage: 'tr-TR',
        },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr" dir="ltr">
            <head>
                {/* Viewport ve tema renkleri Next.js viewport metadata üzerinden üretilir. */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="OtoSöz" />

                {/* ── Geo & Language Sinyalleri ── */}
                <meta name="geo.region" content="TR" />
                <meta name="geo.placename" content="İzmir" />
                <meta name="language" content="Turkish" />
                {/* content-language artık html lang="tr" ile karşılanıyor */}

                {/* ── Ek SEO Sinyalleri ── */}
                <meta name="author" content="OtoSöz" />
                <meta name="publisher" content="OtoSöz" />
                <meta name="copyright" content="© 2024-2026 OtoSöz. Tüm hakları saklıdır." />
                <meta name="rating" content="general" />
                <meta name="distribution" content="global" />
                <meta name="revisit-after" content="1 day" />

                {/* Navbar görseli Next/Image tarafından yalnızca kullanılan tema için önyüklenir. */}
                <link rel="alternate" type="application/rss+xml" title="OtoSöz Forum - Son Başlıklar" href="/forum/feed.xml" />
                <link rel="alternate" type="text/plain" title="OtoSöz LLM içerik haritası" href="/llms.txt" />

                {/* ── JSON-LD Yapılandırılmış Veri — Google Knowledge Graph & Rich Snippets ── */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body>
                {/* Google Consent Mode: ziyaretçi seçim yapana kadar isteğe bağlı depolama kapalıdır. */}
                <Script id="google-consent-default" strategy="beforeInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        window.gtag = gtag;
                        gtag('consent', 'default', {
                            analytics_storage: 'denied',
                            ad_storage: 'denied',
                            ad_user_data: 'denied',
                            ad_personalization: 'denied',
                            functionality_storage: 'granted',
                            security_storage: 'granted',
                            wait_for_update: 500
                        });
                    `}
                </Script>

                <ThemeProvider>
                    <AuthProvider>
                        {children}
                        <GlobalAdRails />
                        <GlobalEngagement />
                    </AuthProvider>
                    <CookieConsent />
                </ThemeProvider>
            </body>
        </html>
    );
}
