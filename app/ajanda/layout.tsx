import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Araç Ajandası: Bakım, Muayene ve Sigorta Takibi',
    description: 'Aracınızın bakım, muayene, trafik sigortası, kasko ve diğer önemli tarihlerini tek ajandada planlayın ve takip edin.',
    path: '/ajanda',
});

export default function AjandaLayout({ children }: { children: React.ReactNode }) {
    return children;
}
