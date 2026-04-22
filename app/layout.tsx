import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Otosöz - Türkiye'nin En Büyük Otomobil Forumu",
    description: "Araba tutkunlarının buluşma noktası. Güncel haberler, incelemeler, kullanıcı deneyimleri ve teknik bilgiler.",
    keywords: "araba, otomobil, forum, türkiye, bmw, mercedes, audi, volkswagen, araç, motor",
    icons: {
        icon: '/dark_logo.svg',
    }
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
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>
            <body>
                <ThemeProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
