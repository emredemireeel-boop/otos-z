import type { Metadata } from "next";

const title = "OtoSöz'e Üye Ol | Ücretsiz Kayıt";
const description = "Ücretsiz OtoSöz hesabınızı oluşturun; otomobil sorularına, sürücü deneyimlerine ve araç karar topluluğuna katılın.";

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: "https://otosoz.com/kayit" },
    robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
    },
    openGraph: {
        title,
        description,
        url: "https://otosoz.com/kayit",
        siteName: "OtoSöz",
        locale: "tr_TR",
        type: "website",
    },
};

export default function KayitLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
}
