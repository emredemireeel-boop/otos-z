import { NextResponse } from 'next/server';
import { forumThreads, getForumCategories } from '@/data/forum-threads';
import surveysData from '@/data/surveys.json';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'all'; // 'threads', 'surveys', 'categories', 'all'
        
        let responseData: any = { success: true };

        // 500ms delay simülasyonu
        await new Promise(resolve => setTimeout(resolve, 500));

        if (type === 'categories') {
            responseData.categories = getForumCategories();
        } else if (type === 'surveys') {
            responseData.surveys = surveysData;
            responseData.totalCount = surveysData.length;
        } else if (type === 'threads') {
            responseData.threads = forumThreads;
            responseData.totalCount = forumThreads.length;
        } else {
            // all
            responseData.categories = getForumCategories();
            responseData.surveys = surveysData;
            responseData.threads = forumThreads;
        }

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Forum API error:', error);
        return NextResponse.json(
            { success: false, message: 'Sunucu hatası.' },
            { status: 500 }
        );
    }
}
