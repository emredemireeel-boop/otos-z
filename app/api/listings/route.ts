import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get('limit');
        const sortParam = searchParams.get('sort');

        // İlan verileri artık Firestore üzerinden yönetilmektedir.
        // Bu endpoint ileride Firestore Admin SDK ile entegre edilecektir.
        const results: unknown[] = [];

        return NextResponse.json({
            success: true,
            totalCount: 0,
            count: results.length,
            listings: results
        });

    } catch (error) {
        console.error('Listings API error:', error);
        return NextResponse.json(
            { success: false, message: 'Sunucu hatası.' },
            { status: 500 }
        );
    }
}
