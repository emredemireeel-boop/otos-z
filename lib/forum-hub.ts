import { getForumCategories } from '../data/forum-threads';
import { createSeoSlug } from './slug';

export { FORUM_PAGE_SIZE } from './forum-pagination';
export const forumCategories = getForumCategories().map(name => ({ name, slug: createSeoSlug(name) }));
const categoryAliases: Record<string, string> = {
    'Tümü': 'Genel',
    'Teknik': 'Teknik & Arıza',
    'Deneyim': 'Deneyim & İnceleme',
};

export function normalizeForumCategory(name: string): string {
    const slug = createSeoSlug(name);
    const alias = Object.entries(categoryAliases).find(([key]) => createSeoSlug(key) === slug)?.[1];
    return alias || forumCategories.find(category => category.slug === slug)?.name || name;
}

export function forumHubPath(page = 1, categorySlug?: string): string {
    const root = categorySlug ? `/forum/kategori/${categorySlug}` : '/forum';
    return page > 1 ? `${root}/sayfa/${page}` : root;
}

export function parseForumPage(value: string): number | null {
    if (!/^[1-9]\d*$/.test(value)) return null;
    const page = Number(value);
    return Number.isSafeInteger(page) ? page : null;
}
