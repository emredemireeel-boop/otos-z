import {communityTimestamp, type CommunitySurvey} from './community';
import {forumCategories, normalizeForumCategory} from './forum-hub';
import {getThreadSlugUrl} from './forum-presentation';

export interface FeedThread {
    id: string; title: string; category: string; type?: string; urlId?: number;
    authorUsername: string; entryCount: number; views: number;
    createdAt: unknown; lastEntryAt: unknown;
}
function categoryName(value: string) {
    const name = normalizeForumCategory(value);
    return forumCategories.some(category => category.name === name) ? name : 'Genel';
}
export function createCommunityFeed(threads: FeedThread[], surveys: CommunitySurvey[]) {
    return [
        ...threads.map(thread => ({
            id: 'thread-' + thread.id, title: thread.title,
            category: categoryName(thread.category),
            type: (thread.type === 'expert' || thread.category === 'Uzmana Sor' ? 'expert' : 'topic') as 'expert' | 'topic' | 'survey',
            entryCount: Math.max(0, thread.entryCount - 1), countLabel: 'yanıt',
            isHot: thread.views > 50, rawActivityAt: communityTimestamp(thread.lastEntryAt || thread.createdAt),
            lastAuthor: thread.authorUsername, slugUrl: getThreadSlugUrl(thread), poll: undefined as CommunitySurvey | undefined,
        })),
        ...surveys.map(poll => ({
            id: 'survey-' + poll.id, title: poll.title, category: categoryName(poll.category), type: 'survey' as const,
            entryCount: poll.totalVotes, countLabel: 'oy', isHot: false, rawActivityAt: poll.createdAt,
            lastAuthor: poll.authorUsername, slugUrl: '/#anket-' + poll.id, poll,
        })),
    ];
}
