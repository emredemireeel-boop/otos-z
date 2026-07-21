import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Araç DNA Analizi: Kronik Sorunlar ve Motor Seçenekleri',
    description: 'Marka ve modele göre araç DNA puanlarını, kronik sorunları, motor seçeneklerini, kullanıcı deneyimlerini ve donanım paketlerini karşılaştırın.',
});

export default function AracDnaRootLayout({ children }: { children: React.ReactNode }) {
    return children;
}
