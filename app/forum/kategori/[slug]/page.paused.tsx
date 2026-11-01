import ForumHub, { forumHubMetadata } from '../../ForumHub';
import { forumCategories } from '@/lib/forum-hub';

export const revalidate = 900;
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
    return forumCategories.map(category => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props) {
    return forumHubMetadata(1, (await params).slug);
}

export default async function ForumCategoryPage({ params }: Props) {
    return <ForumHub categorySlug={(await params).slug} />;
}
