import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL('https://www.otosoz.com'),
    title: {
        default: "Otosöz - Türkiye'nin En Büyük Otomobil Platformu",
        template: '%s | Otosöz',
    },
    description: "OtoSöz: Araç DNA analizi, OBD arıza kodları, otomotiv sözlüğü, gösterge ışıkları rehberi, trafik cezaları, yakıt hesaplayıcı, ikinci el rehberi ve 50.000+ otomotiv verisi. Türkiye'nin en kapsamlı otomobil platformu.",
    keywords: [
        "otomobil", "araç arıza kodları", "OBD kodları", "gösterge ışıkları",
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
    alternates: {
        canonical: 'https://www.otosoz.com',
    },
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
        title: "Otosöz - Türkiye'nin En Büyük Otomobil Platformu",
        description: "Araç DNA analizi, OBD arıza kodları, otomotiv sözlüğü, gösterge ışıkları rehberi, trafik cezaları, yakıt hesaplayıcı ve 50.000+ otomotiv verisi.",
        url: 'https://www.otosoz.com',
        siteName: 'OtoSöz',
        locale: 'tr_TR',
        type: 'website',
        images: [
            {
                url: '/api/og',
                width: 1200,
                height: 630,
                alt: 'OtoSöz — Türkiye\'nin En Kapsamlı Otomotiv Platformu',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Otosöz - Türkiye'nin En Büyük Otomobil Platformu",
        description: "Araç DNA, OBD kodları, otomotiv sözlüğü, gösterge ışıkları ve 50.000+ veri. Tek platformda tüm otomotiv bilgisi.",
        images: ['/api/og'],
        creator: '@otosoz',
    },
    category: 'automotive',
    other: {
        'google-site-verification': 'GOOGLE_VERIFICATION_CODE',
        'msvalidate.01': 'BING_VERIFICATION_CODE',
    },
};

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

// ── JSON-LD Yapılandırılmış Veri (Structured Data) ──
// Google'ın siteyi bir "Kuruluş" ve "Web Sitesi" olarak tanımasını sağlar.
// Sitelinks Search Box, Knowledge Panel ve zengin snippet tetikleyicileri.
const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': 'https://www.otosoz.com/#organization',
            name: 'OtoSöz',
            url: 'https://www.otosoz.com',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.otosoz.com/dark_logo.svg',
                width: 512,
                height: 512,
            },
            description: 'Türkiye\'nin en kapsamlı otomotiv bilgi platformu. Araç DNA analizi, OBD arıza kodları, otomotiv sözlüğü ve teknik rehberler.',
            foundingDate: '2024',
            sameAs: [
                'https://www.instagram.com/otosoz',
                'https://twitter.com/otosoz',
            ],
            contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                availableLanguage: 'Turkish',
                url: 'https://www.otosoz.com/iletisim',
            },
        },
        {
            '@type': 'WebSite',
            '@id': 'https://www.otosoz.com/#website',
            url: 'https://www.otosoz.com',
            name: 'OtoSöz',
            description: 'Türkiye\'nin #1 Otomotiv Bilgi Platformu',
            publisher: { '@id': 'https://www.otosoz.com/#organization' },
            inLanguage: 'tr-TR',
            // Google Sitelinks Search Box — Arama kutusunu doğrudan SERP'e taşır
            potentialAction: {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://www.otosoz.com/sozluk?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
            },
        },
        {
            '@type': 'WebPage',
            '@id': 'https://www.otosoz.com/#webpage',
            url: 'https://www.otosoz.com',
            name: 'OtoSöz — Türkiye\'nin #1 Otomotiv Bilgi Platformu',
            isPartOf: { '@id': 'https://www.otosoz.com/#website' },
            about: { '@id': 'https://www.otosoz.com/#organization' },
            description: 'Araç DNA analizi, OBD arıza kodları, otomotiv sözlüğü, gösterge ışıkları rehberi, trafik cezaları, yakıt hesaplayıcı ve 50.000+ otomotiv verisi.',
            inLanguage: 'tr-TR',
        },
        {
            // BreadcrumbList — Google'da breadcrumb zengin snippet'i tetikler
            '@type': 'BreadcrumbList',
            '@id': 'https://www.otosoz.com/#breadcrumb',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://www.otosoz.com' },
                { '@type': 'ListItem', position: 2, name: 'Kütüphane', item: 'https://www.otosoz.com/kutuphane' },
                { '@type': 'ListItem', position: 3, name: 'Forum', item: 'https://www.otosoz.com/forum' },
                { '@type': 'ListItem', position: 4, name: 'Araç DNA', item: 'https://www.otosoz.com/arac-dna' },
                { '@type': 'ListItem', position: 5, name: 'OBD Kodları', item: 'https://www.otosoz.com/obd' },
            ],
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
                {/* Mobile viewport */}
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

                {/* ── Tema ve PWA Renkleri ── */}
                <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
                <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="OtoSöz" />

                {/* ── Geo & Language Sinyalleri ── */}
                <meta name="geo.region" content="TR" />
                <meta name="geo.placename" content="Ankara" />
                <meta name="language" content="Turkish" />
                <meta httpEquiv="content-language" content="tr" />

                {/* ── Ek SEO Sinyalleri ── */}
                <meta name="author" content="OtoSöz" />
                <meta name="publisher" content="OtoSöz" />
                <meta name="copyright" content="© 2024-2026 OtoSöz. Tüm hakları saklıdır." />
                <meta name="rating" content="general" />
                <meta name="distribution" content="global" />
                <meta name="revisit-after" content="1 day" />

                {/* LCP optimizasyonu: Logoları en yüksek öncelikle önyükle */}
                <link rel="preload" href="/dark_logo.svg" as="image" type="image/svg+xml" fetchPriority="high" />
                <link rel="preload" href="/whitemode_logo.svg" as="image" type="image/svg+xml" fetchPriority="high" />

                {/* ── DNS Prefetch & Preconnect — Kritik 3. parti bağlantılar ── */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
                <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

                {/* ── JSON-LD Yapılandırılmış Veri — Google Knowledge Graph & Rich Snippets ── */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body>
                {/* Google Analytics */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-WBNEVXRYML"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-WBNEVXRYML');
                    `}
                </Script>

                <ThemeProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
