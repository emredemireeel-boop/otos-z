import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL('https://www.otosoz.com'),
    title: "Otosöz - Türkiye'nin En Büyük Otomobil Platformu",
    description: "Araç arıza kodları, gösterge işaretleri, kütüphane ve teknik rehberler. Aradığınız her şey OtoSöz'de.",
    keywords: "araba, otomobil, forum, türkiye, bmw, mercedes, audi, volkswagen, araç, motor, obd arıza kodları, gösterge işaretleri",
    icons: {
        icon: '/dark_logo.svg',
    },
    openGraph: {
        title: "Otosöz - Türkiye'nin En Büyük Otomobil Platformu",
        description: "Araç arıza kodları, gösterge işaretleri, kütüphane ve teknik rehberler. Aradığınız her şey OtoSöz'de.",
        url: 'https://www.otosoz.com',
        siteName: 'OtoSöz',
        locale: 'tr_TR',
        type: 'website',
        images: [
            {
                url: '/api/og',
                width: 1200,
                height: 630,
                alt: 'OtoSöz Önizleme Görseli',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Otosöz - Türkiye'nin En Büyük Otomobil Platformu",
        description: "Araç arıza kodları, gösterge işaretleri, kütüphane ve teknik rehberler. Aradığınız her şey OtoSöz'de.",
        images: ['/api/og'],
    },
};

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <head>
                {/* LCP optimizasyonu: Logoları en yüksek öncelikle önyükle */}
                <link rel="preload" href="/dark_logo.svg" as="image" type="image/svg+xml" fetchPriority="high" />
                <link rel="preload" href="/whitemode_logo.svg" as="image" type="image/svg+xml" fetchPriority="high" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
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
