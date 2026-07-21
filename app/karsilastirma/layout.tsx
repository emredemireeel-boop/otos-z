import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Araç Karşılaştırma: Model ve Motor Kıyaslama',
    description: 'Otomobilleri teknik özellik, motor, yakıt tüketimi, donanım, kullanım maliyeti ve kullanıcı deneyimi açısından yan yana karşılaştırın.',
});

export default function KarsilastirmaLayout({ children }: { children: React.ReactNode }) {
    return children;
}
