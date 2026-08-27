import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL('https://otosoz.com'),
    title: {
        default: "Otosöz - Türkiye'nin Otomobil Topluluğu",
        // Alt sayfalar kendi marka eklerini yönetiyor. Burada tekrar eklemek
        // "... | Otosöz | Otosöz" biçiminde yinelenen başlıklar üretiyordu.
        template: '%s',
    },
    description: "Otosöz; sürücü deneyimlerini Araç DNA analizleri, OBD arıza kodları, otomotiv sözlüğü, gösterge ışıkları ve hesaplama araçlarıyla bir araya getiren otomobil topluluğudur.",
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
        title: "Otosöz - Türkiye'nin Otomobil Topluluğu",
        description: "Araç DNA analizleri, OBD arıza kodları, otomotiv sözlüğü, gösterge ışıkları ve sürücü deneyimleri tek toplulukta.",
        url: 'https://otosoz.com',
        siteName: 'Otosöz',
        locale: 'tr_TR',
        type: 'website',
        images: [
            {
                url: '/api/og',
                width: 1200,
                height: 630,
                alt: 'Otosöz — Türkiye\'nin Otomobil Topluluğu',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Otosöz - Türkiye'nin Otomobil Topluluğu",
        description: "Araç DNA, OBD kodları, otomotiv sözlüğü, gösterge ışıkları ve sürücü deneyimleri tek toplulukta.",
        images: ['/api/og'],
        creator: '@otosoz',
    },
    category: 'automotive',
};

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import GlobalEngagement from "@/components/GlobalEngagement";
import GlobalAdRails from "@/components/GlobalAdRails";

// ── JSON-LD Yapılandırılmış Veri (Structured Data) ──
// Google'ın siteyi bir "Kuruluş" ve "Web Sitesi" olarak tanımasını sağlar.
// Sitelinks Search Box, Knowledge Panel ve zengin snippet tetikleyicileri.
const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': 'https://otosoz.com/#organization',
            name: 'Otosöz',
            url: 'https://otosoz.com',
            logo: {
                '@type': 'ImageObject',
                url: 'https://otosoz.com/dark_logo.svg',
                width: 512,
                height: 512,
            },
            description: 'Sürücü deneyimlerini Araç DNA analizi, OBD arıza kodları, otomotiv sözlüğü ve teknik rehberlerle buluşturan otomobil topluluğu.',
            foundingDate: '2024-01-01',
            sameAs: [
                'https://www.instagram.com/otosoz',
                'https://twitter.com/otosoz',
            ],
            contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                availableLanguage: 'Turkish',
                url: 'https://otosoz.com/iletisim',
            },
        },
        {
            '@type': 'WebSite',
            '@id': 'https://otosoz.com/#website',
            url: 'https://otosoz.com',
            name: 'Otosöz',
            description: 'Türkiye\'nin otomobil topluluğu ve bilgi platformu',
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
                {/* Mobile viewport */}
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

                {/* ── Tema ve PWA Renkleri ── */}
                <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
                <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="Otosöz" />

                {/* ── Geo & Language Sinyalleri ── */}
                <meta name="geo.region" content="TR" />
                <meta name="geo.placename" content="Ankara" />
                <meta name="language" content="Turkish" />
                {/* content-language artık html lang="tr" ile karşılanıyor */}

                {/* ── Ek SEO Sinyalleri ── */}
                <meta name="author" content="Otosöz" />
                <meta name="publisher" content="Otosöz" />
                <meta name="copyright" content="© 2024-2026 Otosöz. Tüm hakları saklıdır." />
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

                <link rel="alternate" type="application/rss+xml" title="OtoSöz Forum - Son Başlıklar" href="/forum/feed.xml" />

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
                        <GlobalAdRails />
                        <GlobalEngagement />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
