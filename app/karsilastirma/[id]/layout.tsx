import type { Metadata } from 'next';
import { SAMPLE_COMPARISONS, getSampleComparison } from '@/data/showcase-content';

interface ComparisonLayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

export function generateStaticParams() {
    return SAMPLE_COMPARISONS.map(comparison => ({ id: comparison.id }));
}

export async function generateMetadata({ params }: ComparisonLayoutProps): Promise<Metadata> {
    const { id } = await params;
    const comparison = getSampleComparison(id);

    if (!comparison) {
        return {
            title: 'Araç Karşılaştırması | OtoSöz',
            robots: { index: false, follow: true },
        };
    }

    const description = `${comparison.description} Bu içerik örnektir.`;
    const canonical = `https://otosoz.com/karsilastirma/${comparison.id}`;
    const ogImage = `/api/og?title=${encodeURIComponent(comparison.title)}&desc=${encodeURIComponent('OtoSöz örnek araç karşılaştırması')}`;

    return {
        title: `${comparison.title} | Örnek Karşılaştırma | OtoSöz`,
        description,
        robots: { index: false, follow: true },
        alternates: { canonical },
        openGraph: {
            title: `${comparison.title} | Örnek içerik`,
            description,
            type: 'article',
            url: canonical,
            images: [{ url: ogImage, width: 1200, height: 630, alt: comparison.title }],
        },
    };
}

export default function ComparisonDetailLayout({ children }: ComparisonLayoutProps) {
    return children;
}
