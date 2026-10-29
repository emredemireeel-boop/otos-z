import {createPageMetadata} from '@/lib/seo';
import {schemaJson, schemaGraph, organization, website} from '@/lib/schema';
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "./cookie-consent.css";

export const metadata: Metadata = createPageMetadata({
        path:"/",
        metadataBase: new URL('https://otosoz.com'),
        title: {
        default: "OtoSöz | Araç Alımı, Arıza Çözümü ve Karşılaştırma",
        // Alt sayfalar kendi marka eklerini yönetiyor. Burada tekrar eklemek
        // "... | Otosöz | Otosöz" biçiminde yinelenen başlıklar üretiyordu.
        template: '%s',
    },
        description: "OtoSöz; araç alırken, arıza araştırırken veya iki otomobili karşılaştırırken gerçek sürücü deneyimini, uzman görüşünü ve veriyi bir araya getiren otomotiv karar platformudur.",
        icons: {
        icon: [
            { url: '/dark_logo.svg', media: '(prefers-color-scheme: dark)' },
            { url: '/whitemode_logo.svg', media: '(prefers-color-scheme: light)' },
        ],
        apple: '/dark_logo.svg',
    },
        manifest: '/manifest.json',
        category: 'automotive',
        index: false
    });

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
const jsonLd = schemaGraph([organization(), website()]);

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

                {/* Navbar görseli Next/Image tarafından yalnızca kullanılan tema için önyüklenir. */}
                <link rel="alternate" type="application/rss+xml" title="OtoSöz Forum - Son Başlıklar" href="/forum/feed.xml" />
                <link rel="alternate" type="text/plain" title="OtoSöz LLM içerik haritası" href="/llms.txt" />

                {/* ── JSON-LD Yapılandırılmış Veri — Google Knowledge Graph & Rich Snippets ── */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: schemaJson(jsonLd) }}
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
