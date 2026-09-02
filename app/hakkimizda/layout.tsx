import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'OtoSöz Hakkında',
    description: 'OtoSöz, OBDKodu ve OtoKusur projelerinin sürücülere güvenilir otomobil bilgisi, arıza kodu araştırması ve kronik kusur analizi sunan yaklaşımını keşfedin.',
    path: '/hakkimizda',
});

export default function HakkimizdaLayout({ children }: { children: React.ReactNode }) {
    return children;
}
