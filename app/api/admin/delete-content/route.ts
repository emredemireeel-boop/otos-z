import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Admin Entry/Thread Delete API (Admin SDK - Firestore rules bypass)
 * POST /api/admin/delete-content
 * Body: { action: 'delete_entry'|'delete_thread', threadId, entryId? }
 * 
 * Bu endpoint admin panelinden gelecek silme isteklerini
 * Firebase Admin SDK ile isler - rules'a takilmaz.
 */

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, threadId, entryId } = body;

        if (!threadId || typeof threadId !== 'string' || threadId.length > 200) {
            return NextResponse.json({ success: false, message: 'Geçersiz threadId.' }, { status: 400 });
        }

        if (action === 'delete_entry') {
            if (!entryId || typeof entryId !== 'string') {
                return NextResponse.json({ success: false, message: 'Geçersiz entryId.' }, { status: 400 });
            }

            // Entry'yi sil (Admin SDK)
            await adminDb
                .collection('threads')
                .doc(threadId)
                .collection('entries')
                .doc(entryId)
                .delete();

            // Thread'in entryCount'unu azalt
            try {
                await adminDb.collection('threads').doc(threadId).update({
                    entryCount: FieldValue.increment(-1),
                });
            } catch (_) {}

            // Log
            try {
                await adminDb.collection('admin_logs').add({
                    action: 'DELETE_ENTRY',
                    target: entryId,
                    detail: `Thread: ${threadId}`,
                    admin: 'admin-panel',
                    createdAt: FieldValue.serverTimestamp(),
                });
            } catch (_) {}

            return NextResponse.json({ success: true, message: 'Entry silindi.' });
        }

        if (action === 'delete_thread') {
            // Alt koleksiyon (entries) önce sil
            const entriesRef = adminDb.collection('threads').doc(threadId).collection('entries');
            const snap = await entriesRef.get();
            const batch = adminDb.batch();
            snap.docs.forEach(d => batch.delete(d.ref));
            if (snap.docs.length > 0) await batch.commit();

            // Thread'i sil
            await adminDb.collection('threads').doc(threadId).delete();

            // Log
            try {
                await adminDb.collection('admin_logs').add({
                    action: 'DELETE_THREAD',
                    target: threadId,
                    detail: `Başlık ve ${snap.size} entry silindi`,
                    admin: 'admin-panel',
                    createdAt: FieldValue.serverTimestamp(),
                });
            } catch (_) {}

            return NextResponse.json({ success: true, message: 'Başlık silindi.' });
        }

        return NextResponse.json({ success: false, message: 'Geçersiz action.' }, { status: 400 });
    } catch (err: any) {
        console.error('Delete content error:', err?.message || err);
        return NextResponse.json(
            { success: false, message: err?.message || 'Silme işlemi başarısız.' },
            { status: 500 }
        );
    }
}
