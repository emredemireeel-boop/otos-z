/** Shared, data-only rules for the community home and legacy entry points. */
export function communityHomeRedirect(path: string): string | null {
    if (path === '/forum') return '/';
    if (path === '/anket') return '/#anket';
    if (path === '/uzmana-sor') return '/#uzmana-sor';
    return null;
}

export interface CommunitySurvey {
    id: string;
    title: string;
    description: string;
    status: string;
    totalVotes: number;
    nominees: { id: number; name: string; votes: number }[];
}

export function communitySurvey(id: string, data: Record<string, any>): CommunitySurvey | null {
    if (!id || /^(?:curated-|ornek-|demo-)/.test(id) || data.source === 'curated' || data.demo === true || data.sample === true
        || data.hidden === true || data.deleted === true || ['hidden', 'deleted', 'spam', 'rejected'].includes(data.status)
        || typeof data.title !== 'string' || !data.title.trim() || !Array.isArray(data.nominees) || data.nominees.length < 2) return null;
    const nominees = data.nominees.map((item: any) => ({ id: Number(item.id), name: String(item.name || '').trim(), votes: Number(item.votes || 0) }));
    if (nominees.some(item => !Number.isSafeInteger(item.id) || !item.name || !Number.isSafeInteger(item.votes) || item.votes < 0)
        || new Set(nominees.map(item => item.id)).size !== nominees.length) return null;
    const totalVotes = Number(data.totalVotes || 0);
    if (!Number.isSafeInteger(totalVotes) || totalVotes < 0) return null;
    return { id, title: data.title.trim(), description: String(data.description || ''), status: String(data.status || 'active'), totalVotes, nominees };
}
