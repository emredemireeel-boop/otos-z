import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'GüvenMetre: Otomotiv Marka ve Hizmet Puanları',
    description: 'Otomobil markaları, servisler, bayiler ve otomotiv hizmetleri için kullanıcı değerlendirmelerini ve güven puanlarını karşılaştırın.',
});

export default function GuvenmetreLayout({ children }: { children: React.ReactNode }) {
    return children;
}
