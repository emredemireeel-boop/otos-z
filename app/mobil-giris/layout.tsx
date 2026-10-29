import {createPageMetadata} from '@/lib/seo';
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
        path:"/mobil-giris",
        title: "Mobil oturum | OtoSöz",
        index: false
    });

export default function MobileLoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
}
