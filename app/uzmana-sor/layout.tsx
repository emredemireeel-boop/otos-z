import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Otomobil Uzmanına Sor: Arıza ve Bakım Soruları',
    description: 'Aracınızın arızası, bakımı, ekspertizi veya satın alma süreci hakkında sorunuzu otomobil uzmanlarına iletin ve yanıtları inceleyin.',
    path: '/uzmana-sor',
});

export default function UzmanaSorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
