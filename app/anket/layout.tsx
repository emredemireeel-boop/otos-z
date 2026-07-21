import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Otomobil Anketleri ve Sürücü Görüşleri',
    description: 'Otomobil tercihleri, markalar, modeller ve sürüş deneyimi hakkındaki güncel anketlere katılın; topluluk sonuçlarını görün.',
});

export default function AnketLayout({ children }: { children: React.ReactNode }) {
    return children;
}
