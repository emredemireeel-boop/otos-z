import {createPageMetadata} from '@/lib/seo';
import type { Metadata } from "next";

const title = "OtoSöz'e Üye Ol | Ücretsiz Kayıt";
const description = "Ücretsiz OtoSöz hesabınızı oluşturun; otomobil sorularına, sürücü deneyimlerine ve araç karar topluluğuna katılın.";

export const metadata: Metadata = createPageMetadata({
        path:"/kayit",
        title,
        description,
        index: false
    });

export default function KayitLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
}
