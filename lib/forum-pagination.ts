export const FORUM_PAGE_SIZE = 20;

export function forumPageWindow(total: number, page: number) {
    if (!Number.isSafeInteger(total) || total < 0 || !Number.isSafeInteger(page) || page < 1) return null;
    const pages = Math.max(1, Math.ceil(total / FORUM_PAGE_SIZE));
    if (page > pages) return null;
    return { pages, start: (page - 1) * FORUM_PAGE_SIZE, end: Math.min(page * FORUM_PAGE_SIZE, total) };
}

export function isForumCategoryIndexable(visibleThreads: number): boolean {
    return visibleThreads >= 5;
}
