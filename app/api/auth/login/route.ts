import { NextResponse } from 'next/server';

/**
 * Legacy Login API - Artik tum authentication Firebase Auth uzerinden yapiliyor.
 * Bu endpoint sadece geriye uyumluluk icin korunuyor.
 * Admin/Moderator rolleri Firestore users koleksiyonundaki 'role' alaninda tanimli.
 */
export async function POST() {
    return NextResponse.json(
        {
            success: false,
            message: 'Bu login endpoint kullanim disi. Lutfen Firebase Auth ile giris yapin.',
            redirect: '/giris'
        },
        { status: 410 }
    );
}
