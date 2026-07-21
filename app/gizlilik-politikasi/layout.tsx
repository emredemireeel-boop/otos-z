import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Gizlilik Politikası',
    description: 'OtoSöz platformunda kişisel verilerin işlenmesi, korunması, saklanması ve kullanıcı hakları hakkında bilgi edinin.',
    path: '/gizlilik-politikasi',
});

export default function GizlilikPolitikasiLayout({ children }: { children: React.ReactNode }) {
    return children;
}
