import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
    collection, doc, getDocs, deleteDoc, updateDoc, addDoc,
    serverTimestamp, increment,
} from 'firebase/firestore';

/**
 * Admin Entry/Thread Delete API (Client SDK — Firestore rules ile yetkilendirilir)
 * POST /api/admin/delete-content
 * Body: { action: 'delete_entry'|'delete_thread', threadId, entryId? }
 * 
 * Bu endpoint admin panelinden gelecek silme isteklerini
 * Client-side Firestore SDK ile isler.
 * Firestore rules'da authenticated user'a delete izni verilmis oldugu icin calısır.
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

            // Entry'yi sil
            await deleteDoc(doc(db, 'threads', threadId, 'entries', entryId));

            // Thread'in entryCount'unu azalt
            try {
                await updateDoc(doc(db, 'threads', threadId), {
                    entryCount: increment(-1),
                });
            } catch (_) {}

            // Log
            try {
                await addDoc(collection(db, 'admin_logs'), {
                    action: 'DELETE_ENTRY',
                    target: entryId,
                    detail: `Thread: ${threadId}`,
                    admin: 'admin-panel',
                    createdAt: serverTimestamp(),
                });
            } catch (_) {}

            return NextResponse.json({ success: true, message: 'Entry silindi.' });
        }

        if (action === 'delete_thread') {
            // Alt koleksiyon (entries) önce sil
            const entriesRef = collection(db, 'threads', threadId, 'entries');
            const snap = await getDocs(entriesRef);
            const deletePromises = snap.docs.map(d => deleteDoc(d.ref));
            if (deletePromises.length > 0) {
                await Promise.all(deletePromises);
            }

            // Thread'i sil
            await deleteDoc(doc(db, 'threads', threadId));

            // Log
            try {
                await addDoc(collection(db, 'admin_logs'), {
                    action: 'DELETE_THREAD',
                    target: threadId,
                    detail: `Başlık ve ${snap.size} entry silindi`,
                    admin: 'admin-panel',
                    createdAt: serverTimestamp(),
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
