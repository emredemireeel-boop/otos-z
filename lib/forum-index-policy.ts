export interface ForumIndexInput {
    title: string;
    visibleEntryCount: number;
    content: string;
    data: Record<string, unknown>;
}

/** Meta robots ve sitemap aynı görünür içerik/moderasyon kararını kullanır. */
export function getForumIndexDecision({ title, visibleEntryCount, content, data }: ForumIndexInput) {
    const reasons: string[] = [];
    if (title.trim().length < 5) reasons.push('short-title');
    if (visibleEntryCount < 1) reasons.push('no-visible-entry');
    const text = content.replace(/<[^>]*>/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[*_#>`~]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length < 200) reasons.push('content-under-200-characters');
    const moderation = String(data.moderationStatus || data.status || '').toLowerCase();
    if (data.spam === true || data.isSpam === true || data.spamSuspected === true
        || data.reportedAsSpam === true
        || ['spam', 'suspected_spam', 'spam_suspected', 'suspected-spam', 'flagged_spam'].includes(moderation)) {
        reasons.push('spam-moderation-signal');
    }
    return { indexable: reasons.length === 0, reasons };
}
