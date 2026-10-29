import {createPageMetadata} from '@/lib/seo';
import { indexabilityRobots, SUPPORTING_TEMPLATE_INDEXABLE } from '@/lib/indexability';
export const metadata = createPageMetadata({
        index: SUPPORTING_TEMPLATE_INDEXABLE
    });
import { notFound } from 'next/navigation';
import library from '@/public/data/library_guides.json';

export default async function GuideLayout({ children, params }: {
    children: React.ReactNode;
    params: Promise<{ guideId: string }>;
}) {
    const { guideId } = await params;
    if (!library.guides.some(guide => String(guide.id) === guideId)) notFound();
    return children;
}
