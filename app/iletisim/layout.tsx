import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'OtoSöz İletişim',
    description: 'Soru, görüş, içerik bildirimi ve iş birliği talepleriniz için OtoSöz ekibiyle iletişime geçin.',
    path: '/iletisim',
});

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
    return children;
}
