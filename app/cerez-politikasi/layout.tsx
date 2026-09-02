import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
    title: "Çerez Politikası | OtoSöz",
    description: "OtoSöz'ün kullandığı zorunlu ve isteğe bağlı çerezleri, amaçlarını, sağlayıcılarını, saklama sürelerini ve tercihlerinizi nasıl yönetebileceğinizi inceleyin.",
    path: "/cerez-politikasi",
});

export default function CookiePolicyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
}
