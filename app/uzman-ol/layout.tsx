import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Otomobil Uzmanı Ol: Uzmanlık Başvurusu',
    description: 'Otomotiv bilginizle sürücülerin sorularını yanıtlamak ve OtoSöz uzman topluluğuna katılmak için başvurun.',
    path: '/uzman-ol',
});

export default function UzmanOlLayout({ children }: { children: React.ReactNode }) {
    return children;
}
