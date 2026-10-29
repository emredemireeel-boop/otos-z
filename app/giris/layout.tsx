import {createPageMetadata} from '@/lib/seo';
import type { Metadata } from "next";

const title = "OtoSöz'e Giriş Yap | Üye Girişi";
const description = "OtoSöz hesabınıza giriş yaparak otomobil topluluğuna katılın, sorularınızı ve araç deneyimlerinizi paylaşın.";

export const metadata: Metadata = createPageMetadata({
        path:"/giris",
        title,
        description,
        index: false
    });

export default function GirisLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
}
