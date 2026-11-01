import { NextRequest, NextResponse } from 'next/server';
import { searchObdCodes } from '@/lib/obd-catalog';

/** Paginated search. The initial server list uses the same catalogue order. */
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10) || 0);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '30', 10) || 30));
    const result = searchObdCodes(searchParams.get('q') || '', searchParams.get('type') || '');
    return NextResponse.json({ items: result.slice(offset, offset + limit), total: result.length, offset, limit, hasMore: offset + limit < result.length }, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
}
