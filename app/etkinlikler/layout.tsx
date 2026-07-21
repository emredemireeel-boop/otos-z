import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Otomobil Etkinlikleri, Fuarlar ve Buluşmalar',
    description: 'Türkiye genelindeki otomobil fuarlarını, klasik araç buluşmalarını, pist günlerini ve otomotiv etkinliklerini tarih ve konum bilgileriyle keşfedin.',
});

export default function EtkinliklerLayout({ children }: { children: React.ReactNode }) {
    return children;
}
