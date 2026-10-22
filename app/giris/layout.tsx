import type { Metadata } from "next";

const title = "OtoSöz'e Giriş Yap | Üye Girişi";
const description = "OtoSöz hesabınıza giriş yaparak otomobil topluluğuna katılın, sorularınızı ve araç deneyimlerinizi paylaşın.";

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: "https://otosoz.com/giris" },
    robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
    },
    openGraph: {
        title,
        description,
        url: "https://otosoz.com/giris",
        siteName: "OtoSöz",
        locale: "tr_TR",
        type: "website",
    },
};

export default function GirisLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
}
