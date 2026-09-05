import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'OtoSöz Hakkında | Otomotiv Karar Platformu',
    description: 'OtoSöz; araç satın alma, arıza çözümü ve otomobil karşılaştırması kararlarında gerçek deneyim, uzman görüşü ve veriyi buluşturan otomotiv karar platformudur.',
    path: '/hakkimizda',
    keywords: ['OtoSöz', 'otomotiv karar platformu', 'araç satın alma', 'otomobil arıza çözümü', 'araç karşılaştırma'],
});

export default function HakkimizdaLayout({ children }: { children: React.ReactNode }) {
    return children;
}
