import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Oto Ustası Kaydı ve Usta Başvurusu',
    description: 'Otomotiv alanındaki uzmanlığınızı OtoSöz topluluğuyla paylaşmak ve müşterilere ulaşmak için usta başvurusu yapın.',
    path: '/usta-ol',
});

export default function UstaOlLayout({ children }: { children: React.ReactNode }) {
    return children;
}
