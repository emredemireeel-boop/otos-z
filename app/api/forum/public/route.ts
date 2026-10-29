import {getRecentForumThreadSummaries} from '@/lib/forumDataServer';
export const revalidate=900;
export async function GET(){
    const threads=await getRecentForumThreadSummaries(100);
    return Response.json({threads},{headers:{'Cache-Control':'public, s-maxage=900, stale-while-revalidate=1800','X-Robots-Tag':'noindex, follow'}});
}
