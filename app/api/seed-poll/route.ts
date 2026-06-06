import { NextResponse } from 'next/server';
import { getAdminDb, FieldValue } from '@/lib/firebaseAdmin';
import { requireAdmin, type AuthResult } from '@/lib/authGuard';
import { checkRateLimit, RATE_LIMITS, getClientIP } from '@/lib/rateLimit';

/**
 * Anket seed endpoint'i — yalnızca admin.
 * ✅ GÜVENLİK: Eskiden herkesin GET ile anket oluşturabildiği bir açıktı.
 *    Artık Admin SDK + kimlik doğrulaması + admin rolü gerektiren POST.
 */
export async function POST(request: Request) {
    const ip = getClientIP(request);
    const rl = checkRateLimit(`seed-poll:${ip}`, RATE_LIMITS.admin);
    if (!rl.allowed) {
        return NextResponse.json(
            { success: false, message: 'Çok fazla istek. Lütfen bekleyin.' },
            { status: 429 }
        );
    }

    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;
    const admin = authResult as AuthResult;

    const db = getAdminDb();

    try {
        const docRef = await db.collection('surveys').add({
            title: "Benzin mi, Dizel mi, Elektrik mi?",
            description: "Yeni nesil otomotiv dünyasında tercihiniz hangi motor tipinden yana? Performans, ekonomi ve gelecek vizyonu açısından en doğru seçim hangisi?",
            category: "Genel",
            iconName: "none",
            status: "active",
            totalVotes: 0,
            nominees: [
                { id: 1, name: "Benzin", votes: 0 },
                { id: 2, name: "Dizel", votes: 0 },
                { id: 3, name: "Elektrik", votes: 0 }
            ],
            voters: {},
            createdBy: admin.email || admin.uid || "admin",
            createdAt: FieldValue.serverTimestamp(),
        });
        return NextResponse.json({ success: true, id: docRef.id });
    } catch (e: any) {
        console.error('seed-poll error:', e?.message || e);
        return NextResponse.json({ success: false, message: 'Anket oluşturulamadı.' }, { status: 500 });
    }
}
