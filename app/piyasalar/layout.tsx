import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Otomotiv Piyasaları ve Güncel Fiyat Verileri',
    description: 'Akaryakıt, döviz, altın ve otomobil sahipliğini etkileyen güncel piyasa verilerini tek ekranda takip edin.',
    path: '/piyasalar',
});

export default function PiyasalarLayout({ children }: { children: React.ReactNode }) {
    return children;
}
