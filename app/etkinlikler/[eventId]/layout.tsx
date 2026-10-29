import {createPageMetadata} from '@/lib/seo';
import { indexabilityRobots, SUPPORTING_TEMPLATE_INDEXABLE } from '@/lib/indexability';
export const metadata = createPageMetadata({
        index: SUPPORTING_TEMPLATE_INDEXABLE
    });
import { notFound } from 'next/navigation';
import { getEventById } from '@/data/events';

export default async function EventDetailLayout({ children, params }: {
    children: React.ReactNode;
    params: Promise<{ eventId: string }>;
}) {
    const { eventId } = await params;
    if (!getEventById(eventId)) notFound();
    return children;
}
