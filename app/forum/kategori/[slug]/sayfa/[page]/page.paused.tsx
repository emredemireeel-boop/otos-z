import { notFound } from 'next/navigation';
import ForumHub, { forumHubMetadata } from '../../../../ForumHub';
import { parseForumPage } from '@/lib/forum-hub';

export const revalidate = 900;
type Props = { params: Promise<{ slug: string; page: string }> };

export async function generateMetadata({ params }: Props) {
    const { slug, page: value } = await params;
    const page = parseForumPage(value);
    if (!page) notFound();
    return forumHubMetadata(page, slug);
}

export default async function ForumCategoryPage({ params }: Props) {
    const { slug, page: value } = await params;
    const page = parseForumPage(value);
    if (!page) notFound();
    return <ForumHub categorySlug={slug} page={page} />;
}
