import {createPageMetadata} from '@/lib/seo';
import type { Metadata } from 'next';
import { SAMPLE_COMPARISONS, getSampleComparison } from '@/data/showcase-content';
import { notFound } from 'next/navigation';
import { getPublicContentDocument, isHiddenContent } from '@/lib/public-content-server';

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
        return createPageMetadata({
        title: 'Araç Karşılaştırması | OtoSöz',
        index: false
    });
    }

    const description = `${comparison.description} Bu içerik örnektir.`;
    const canonical = `https://otosoz.com/karsilastirma/${comparison.id}`;
    const ogImage = `/api/og?title=${encodeURIComponent(comparison.title)}&desc=${encodeURIComponent('OtoSöz örnek araç karşılaştırması')}`;

    return createPageMetadata({
        title: `${comparison.title} | Örnek Karşılaştırma | OtoSöz`,
        description,
        path: canonical,
        index: false
    });
}

export default async function ComparisonDetailLayout({ children, params }: ComparisonLayoutProps) {
    const { id } = await params;
    if (!getSampleComparison(id)) {
        const thread = await getPublicContentDocument('threads', id);
        if (!thread || isHiddenContent(thread.data)) notFound();
    }
    return children;
}
