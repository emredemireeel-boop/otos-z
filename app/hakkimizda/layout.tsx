import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
        title: 'Hakkımızda: OtoSöz ve Otomotiv Projelerimiz',
        description: 'OtoSöz otomobil topluluğunu, çalışma ilkelerimizi ve bize ait OtoKusur ile OBDKodu projelerini tanıyın. Site sorumlusu ve iletişim bilgilerine ulaşın.',
        path: '/hakkimizda'
    });

export default function HakkimizdaLayout({ children }: { children: React.ReactNode }) {
    return children;
}
