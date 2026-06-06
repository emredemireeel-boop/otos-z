import { NextResponse } from 'next/server';
import { getAdminDb, FieldValue } from '@/lib/firebaseAdmin';
import { requireModOrAdmin, type AuthResult } from '@/lib/authGuard';
import { checkRateLimit, RATE_LIMITS, getClientIP } from '@/lib/rateLimit';
import { isValidDocId } from '@/lib/validation';

/**
 * Admin Entry/Thread Delete API
 * POST /api/admin/delete-content
 * Body: { action: 'delete_entry'|'delete_thread', threadId, entryId? }
 *
 * ✅ GÜVENLİK: Firebase Admin SDK (server-side) + requireModOrAdmin token dogrulamasi.
 *    Yalnizca admin/moderator rolune sahip dogrulanmis kullanicilar erisebilir.
 */

export async function POST(request: Request) {
    // ── Rate limit ──
    const ip = getClientIP(request);
    const rl = checkRateLimit(`delete-content:${ip}`, RATE_LIMITS.admin);
    if (!rl.allowed) {
        return NextResponse.json(
            { success: false, message: 'Çok fazla istek. Lütfen bekleyin.' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.retryAfterMs || 60000) / 1000)) } }
        );
    }

    // ── Yetkilendirme ──
    const authResult = await requireModOrAdmin(request);
    if (authResult instanceof NextResponse) return authResult;
    const actor = authResult as AuthResult;
    const logActor = actor.email || actor.uid || 'admin-panel';

    const db = getAdminDb();

    try {
        const body = await request.json();
        const { action, threadId, entryId } = body;

        if (!threadId || !isValidDocId(threadId)) {
            return NextResponse.json({ success: false, message: 'Geçersiz threadId.' }, { status: 400 });
        }

        if (action === 'delete_entry') {
            if (!entryId || !isValidDocId(entryId)) {
                return NextResponse.json({ success: false, message: 'Geçersiz entryId.' }, { status: 400 });
            }

            await db.collection('threads').doc(threadId).collection('entries').doc(entryId).delete();

            try {
                await db.collection('threads').doc(threadId).update({ entryCount: FieldValue.increment(-1) });
            } catch (_) {}

            try {
                await db.collection('admin_logs').add({
                    action: 'DELETE_ENTRY',
                    target: entryId,
                    detail: `Thread: ${threadId}`,
                    admin: logActor,
                    createdAt: FieldValue.serverTimestamp(),
                });
            } catch (_) {}

            return NextResponse.json({ success: true, message: 'Entry silindi.' });
        }

        if (action === 'delete_thread') {
            const entriesSnap = await db.collection('threads').doc(threadId).collection('entries').get();
            const deletePromises = entriesSnap.docs.map(d => d.ref.delete());
            if (deletePromises.length > 0) {
                await Promise.all(deletePromises);
            }

            await db.collection('threads').doc(threadId).delete();

            try {
                await db.collection('admin_logs').add({
                    action: 'DELETE_THREAD',
                    target: threadId,
                    detail: `Başlık ve ${entriesSnap.size} entry silindi`,
                    admin: logActor,
                    createdAt: FieldValue.serverTimestamp(),
                });
            } catch (_) {}

            return NextResponse.json({ success: true, message: 'Başlık silindi.' });
        }

        return NextResponse.json({ success: false, message: 'Geçersiz action.' }, { status: 400 });
    } catch (err: any) {
        console.error('Delete content error:', err?.message || err);
        return NextResponse.json(
            { success: false, message: 'Silme işlemi başarısız.' },
            { status: 500 }
        );
    }
}
