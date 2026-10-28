import { notFound } from 'next/navigation';
import { getSampleExpertQuestion } from '@/data/showcase-content';
import { getPublicContentDocument, isHiddenContent } from '@/lib/public-content-server';

export default async function QuestionLayout({ children, params }: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    if (!getSampleExpertQuestion(id)) {
        const thread = await getPublicContentDocument('threads', id);
        if (!thread || isHiddenContent(thread.data)) notFound();
    }
    return children;
}
