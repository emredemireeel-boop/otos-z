import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        // Kullanıcı verileri Firestore üzerinden yönetilmektedir.
        // Bu endpoint ileride Firestore Admin SDK ile entegre edilecektir.

        if (username) {
            return NextResponse.json(
                { success: false, message: 'Kullanıcı bulunamadı.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            totalCount: 0,
            users: []
        });

    } catch (error) {
        console.error('Users API error:', error);
        return NextResponse.json(
            { success: false, message: 'Sunucu hatası.' },
            { status: 500 }
        );
    }
}
