import { notFound } from 'next/navigation';
import ForumHub, { forumHubMetadata } from '../../ForumHub';
import { parseForumPage } from '@/lib/forum-hub';

export const revalidate = 900;
type Props = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Props) {
    const page = parseForumPage((await params).page);
    if (!page) notFound();
    return forumHubMetadata(page);
}

export default async function ForumPage({ params }: Props) {
    const page = parseForumPage((await params).page);
    if (!page) notFound();
    return <ForumHub page={page} />;
}
