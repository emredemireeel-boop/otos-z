import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'OtoSöz Hakkında',
    description: 'OtoSöz’ün otomobil sahipleri için güvenilir bilgi, karşılaştırma, arıza kodu ve topluluk deneyimi sunma yaklaşımını keşfedin.',
    path: '/hakkimizda',
});

export default function HakkimizdaLayout({ children }: { children: React.ReactNode }) {
    return children;
}
