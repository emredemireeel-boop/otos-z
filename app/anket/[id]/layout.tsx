import { notFound } from 'next/navigation';
import { getPublicContentDocument, isHiddenContent } from '@/lib/public-content-server';

export default async function SurveyLayout({ children, params }: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const survey = await getPublicContentDocument('surveys', id);
    if (!survey || isHiddenContent(survey.data)) notFound();
    return children;
}
