import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Kullanım Şartları',
    description: 'OtoSöz platformunun kullanım koşulları, içerik kuralları, sorumluluklar ve kullanıcı hakları hakkında bilgi edinin.',
    path: '/kullanim-sartlari',
});

export default function KullanimSartlariLayout({ children }: { children: React.ReactNode }) {
    return children;
}
