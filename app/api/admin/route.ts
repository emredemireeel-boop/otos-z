import { NextResponse } from 'next/server';
import { getAdminDb, FieldValue } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { requireAdmin, type AuthResult } from '@/lib/authGuard';
import { checkRateLimit, RATE_LIMITS, getClientIP } from '@/lib/rateLimit';
import { isValidDocId } from '@/lib/validation';

/**
 * Admin API - Firestore uzerinden gercek platform verilerini yonetir
 * GET /api/admin?section=stats|threads|users|logs|dictionary
 * POST /api/admin -> action islemleri
 *
 * ✅ GÜVENLİK: Firebase Admin SDK (server-side, tam yetki) kullanir.
 *    Erisim requireAdmin token dogrulamasi ile kontrol edilir.
 *    Firestore kurallari bypass edilir cunku kimlik sunucuda dogrulanmistir.
 */

// Helper: Firestore timestamp'i string'e cevir (guvenli)
function tsToStr(ts: any): string {
    if (!ts) return '-';
    if (ts instanceof Timestamp) return ts.toDate().toLocaleString('tr-TR');
    if (ts.toDate && typeof ts.toDate === 'function') return ts.toDate().toLocaleString('tr-TR');
    if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString('tr-TR');
    if (typeof ts === 'string') return ts;
    return '-';
}

// -- GET --
export async function GET(request: Request) {
    // ── Rate limit kontrolu ──
    const ip = getClientIP(request);
    const rl = checkRateLimit(`admin-get:${ip}`, RATE_LIMITS.admin);
    if (!rl.allowed) {
        return NextResponse.json(
            { success: false, message: 'Çok fazla istek. Lütfen bekleyin.' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.retryAfterMs || 60000) / 1000)) } }
        );
    }

    // ── Yetkilendirme kontrolu ──
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const db = getAdminDb();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'stats';

    try {
        if (section === 'stats') {
            const threadsDocs = await db.collection('threads').get();
            const usersSnap = await db.collection('users').get();
            let totalEntries = 0;
            let pinnedThreads = 0;
            let lockedThreads = 0;
            const categoryMap = new Map<string, number>();

            threadsDocs.forEach(d => {
                const data = d.data();
                totalEntries += data.entryCount || 0;
                if (data.pinned) pinnedThreads++;
                if (data.locked) lockedThreads++;
                const cat = data.category || 'Genel';
                categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
            });

            const logsDocs = await db.collection('admin_logs').orderBy('createdAt', 'desc').limit(8).get();
            const recentLogs = logsDocs.docs.map(d => {
                const data = d.data();
                return {
                    action: data.action || '',
                    target: data.target || '',
                    detail: data.detail || '',
                    time: tsToStr(data.createdAt),
                };
            });

            return NextResponse.json({
                success: true,
                stats: {
                    totalUsers: usersSnap.size,
                    bannedUsers: 0,
                    totalThreads: threadsDocs.size,
                    deletedThreads: 0,
                    pinnedThreads,
                    lockedThreads,
                    trendingCount: 0,
                    totalListings: 0,
                    pendingListings: 0,
                    approvedListings: 0,
                    rejectedListings: 0,
                    totalEntries,
                    pendingGuvenmetre: 0,
                    announcementCount: 0,
                    recentLogs,
                    categories: Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count })),
                }
            });
        }

        if (section === 'threads') {
            const search = searchParams.get('q') || '';
            const threadsDocs = await db.collection('threads').orderBy('createdAt', 'desc').limit(100).get();
            const threads = threadsDocs.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    title: data.title || '',
                    category: data.category || 'Genel',
                    authorUsername: data.authorUsername || '',
                    createdAt: tsToStr(data.createdAt),
                    views: data.views || 0,
                    entryCount: data.entryCount || 0,
                    tags: data.tags || [],
                    pinned: data.pinned || false,
                    locked: data.locked || false,
                    description: data.description || '',
                };
            }).filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.authorUsername.toLowerCase().includes(search.toLowerCase()));

            return NextResponse.json({ success: true, threads, total: threads.length });
        }

        if (section === 'users') {
            const search = (searchParams.get('q') || '').trim().slice(0, 80);
            const usersDocs = await db.collection('users').limit(200).get();
            const privateDocs = usersDocs.empty
                ? []
                : await db.getAll(...usersDocs.docs.map(d => db.collection('user_private').doc(d.id)));
            const emailById = new Map(privateDocs.map(d => [d.id, d.data()?.email || '']));
            const users = usersDocs.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    username: data.username || '',
                    displayName: data.displayName || '',
                    email: emailById.get(d.id) || '',
                    role: data.role || 'standard',
                    city: data.city || '',
                    level: data.level || 'Yeni Üye',
                    bio: data.bio || '',
                    carBrand: data.carBrand || '',
                    carModel: data.carModel || '',
                    badges: Array.isArray(data.badges) ? data.badges : [],
                    reputation: Number(data.ratingTotalScore || data.reputation || 0),
                    warnings: Number(data.warnings || 0),
                    banned: data.banned === true,
                    createdAt: tsToStr(data.createdAt),
                };
            }).filter(u => !search || u.username.toLowerCase().includes(search.toLowerCase()) || u.displayName.toLowerCase().includes(search.toLowerCase()));

            return NextResponse.json({ success: true, users, total: users.length });
        }

        if (section === 'logs') {
            const logsDocs = await db.collection('admin_logs').orderBy('createdAt', 'desc').limit(50).get();
            const logs = logsDocs.docs.map(d => {
                const data = d.data();
                return { action: data.action, target: data.target, admin: data.admin || 'Admin', detail: data.detail, time: tsToStr(data.createdAt) };
            });
            return NextResponse.json({ success: true, logs });
        }

        if (section === 'dictionary') {
            const dictDocs = await db.collection('dictionary').orderBy('term').get();
            const terms = dictDocs.docs.map(d => ({ id: d.id, ...d.data() }));
            return NextResponse.json({ success: true, terms });
        }

        if (section === 'guvenmetre_reviews') {
            const search = searchParams.get('q') || '';
            const reviewsDocs = await db.collection('guvenmetre_reviews').orderBy('createdAt', 'desc').limit(100).get();
            const reviews = reviewsDocs.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    userName: data.userName || 'Anonim',
                    userEmail: data.userEmail || '',
                    userId: data.userId || '',
                    categoryId: data.categoryId || '',
                    brandId: data.brandId || '',
                    rating: data.rating || 0,
                    comment: data.comment || '',
                    status: data.status || 'approved',
                    createdAt: tsToStr(data.createdAt),
                };
            }).filter(r => !search || r.userName.toLowerCase().includes(search.toLowerCase()) || r.brandId.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase()));

            const stats = {
                total: reviewsDocs.size,
                approved: reviewsDocs.docs.filter(d => d.data().status === 'approved').length,
                pending: reviewsDocs.docs.filter(d => d.data().status === 'pending').length,
            };

            return NextResponse.json({ success: true, reviews, stats });
        }

        if (section === 'advertisements') {
            const search = searchParams.get('q') || '';
            const adsDocs = await db.collection('advertisements').orderBy('createdAt', 'desc').get();
            const ads = adsDocs.docs.map(d => ({ id: d.id, ...d.data() })).filter((a: any) => !search || a.title?.toLowerCase().includes(search.toLowerCase()) || a.advertiser?.toLowerCase().includes(search.toLowerCase()));

            let active = 0, paused = 0, ended = 0, totalImpressions = 0, totalClicks = 0, totalBudget = 0;
            ads.forEach((a: any) => {
                if (a.status === 'active') active++;
                if (a.status === 'paused') paused++;
                if (a.status === 'ended') ended++;
                totalImpressions += a.impressions || 0;
                totalClicks += a.clicks || 0;
                totalBudget += a.budget || 0;
            });
            const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

            return NextResponse.json({
                success: true,
                ads,
                summary: { total: ads.length, active, paused, ended, totalImpressions, totalClicks, totalBudget, avgCtr }
            });
        }

        if (section === 'reports') {
            const statusFilter = searchParams.get('status') || 'all';
            const reportsRef = db.collection('reports');
            const reportsQuery = statusFilter === 'all'
                ? reportsRef.orderBy('createdAt', 'desc')
                : reportsRef.where('status', '==', statusFilter).orderBy('createdAt', 'desc');
            const reportsDocs = await reportsQuery.get();
            const reports = reportsDocs.docs.map(d => ({ id: d.id, ...d.data(), createdAt: tsToStr(d.data().createdAt) }));
            const counts = {
                total: reports.length,
                bekliyor: reports.filter((r: any) => r.status === 'bekliyor').length,
                incelendi: reports.filter((r: any) => r.status === 'incelendi').length,
                islendi: reports.filter((r: any) => r.status === 'islendi').length,
                reddedildi: reports.filter((r: any) => r.status === 'reddedildi').length,
            };
            return NextResponse.json({ success: true, reports, counts });
        }

        if (section === 'listings') {
            const search = searchParams.get('q') || '';
            const listingsDocs = await db.collection('listings').orderBy('createdAt', 'desc').get();
            const listings = listingsDocs.docs.map(d => ({ id: d.id, ...d.data(), createdAt: tsToStr(d.data().createdAt) }))
                .filter((l: any) => !search || l.brand?.toLowerCase().includes(search.toLowerCase()) || l.model?.toLowerCase().includes(search.toLowerCase()) || l.userName?.toLowerCase().includes(search.toLowerCase()));
            return NextResponse.json({ success: true, listings });
        }

        if (section === 'guvenmetre') {
            const search = searchParams.get('q') || '';
            const docs = await db.collection('guvenmetre').orderBy('createdAt', 'desc').get();
            const requests = docs.docs.map(d => ({ id: d.id, ...d.data(), createdAt: tsToStr(d.data().createdAt) }))
                .filter((r: any) => !search || r.userName?.toLowerCase().includes(search.toLowerCase()) || r.plateNumber?.toLowerCase().includes(search.toLowerCase()));
            return NextResponse.json({ success: true, requests });
        }

        if (section === 'trending') {
            const docs = await db.collection('threads').where('trending', '==', true).get();
            const trendingThreads = docs.docs.map(d => ({ id: d.id, ...d.data() }));
            return NextResponse.json({ success: true, trendingThreads });
        }

        if (section === 'announcements') {
            const docs = await db.collection('announcements').orderBy('createdAt', 'desc').get();
            const announcements = docs.docs.map(d => ({ id: d.id, ...d.data(), createdAt: tsToStr(d.data().createdAt) }));
            return NextResponse.json({ success: true, announcements });
        }

        if (section === 'finances') {
            const search = searchParams.get('q') || '';
            const txDocs = await db.collection('transactions').orderBy('createdAt', 'desc').get();
            const transactions = txDocs.docs.map(d => ({ id: d.id, ...d.data(), date: tsToStr(d.data().createdAt) }))
                .filter((t: any) => !search || t.user?.toLowerCase().includes(search.toLowerCase()) || t.displayName?.toLowerCase().includes(search.toLowerCase()));

            const usersDocs = await db.collection('users').get();
            const premiumUsers = usersDocs.docs.map(d => {
                const u = d.data();
                return {
                    username: u.username || d.id,
                    displayName: u.displayName || 'İsimsiz Üye',
                    city: u.city || 'Belirtilmemiş',
                    carBrand: u.carBrand || 'Belirtilmemiş',
                    plan: u.plan || 'Aylık',
                    renewDate: tsToStr(u.renewDate || u.createdAt),
                    amount: u.premiumAmount || 299,
                    active: u.role === 'premium' || u.isPremium || false,
                };
            }).filter((u: any) => u.active);

            return NextResponse.json({ success: true, transactions, premiumUsers });
        }

        if (section === 'bad_words') {
            const docs = await db.collection('bad_words').orderBy('createdAt', 'desc').get();
            const words = docs.docs.map(d => ({ id: d.id, ...d.data(), addedAt: tsToStr(d.data().createdAt) }));
            return NextResponse.json({ success: true, words });
        }

        if (section === 'settings') {
            const snap = await db.collection('settings').doc('platform').get();
            const settings = snap.exists ? snap.data() : null;
            return NextResponse.json({ success: true, settings });
        }

        if (section === 'badges') {
            const docs = await db.collection('badges').orderBy('createdAt', 'desc').get();
            const badges = docs.docs.map(d => ({ id: d.id, ...d.data() }));
            return NextResponse.json({ success: true, badges });
        }

        if (section === 'broadcasts') {
            const docs = await db.collection('broadcasts').orderBy('createdAt', 'desc').limit(100).get();
            const broadcasts = docs.docs.map(d => ({ id: d.id, ...d.data(), createdAt: tsToStr(d.data().createdAt) }));
            return NextResponse.json({ success: true, broadcasts });
        }

        if (section === 'expert_applications') {
            const statusFilter = searchParams.get('status') || 'all';
            const appsRef = db.collection('expert_applications');
            const appsQuery = statusFilter === 'all'
                ? appsRef.orderBy('createdAt', 'desc')
                : appsRef.where('status', '==', statusFilter).orderBy('createdAt', 'desc');
            const appsDocs = await appsQuery.get();
            const applications = appsDocs.docs.map(d => ({ id: d.id, ...d.data(), createdAt: tsToStr(d.data().createdAt) }));
            const counts = {
                total: applications.length,
                bekliyor: applications.filter((a: any) => a.status === 'bekliyor').length,
                onaylandi: applications.filter((a: any) => a.status === 'onaylandi').length,
                reddedildi: applications.filter((a: any) => a.status === 'reddedildi').length,
            };
            return NextResponse.json({ success: true, applications, counts });
        }

        if (section === 'moderators') {
            const docs = await db.collection('users').where('role', 'in', ['moderator', 'admin']).get();
            const privateDocs = docs.empty
                ? []
                : await db.getAll(...docs.docs.map(d => db.collection('user_private').doc(d.id)));
            const emailById = new Map(privateDocs.map(d => [d.id, d.data()?.email || '']));
            const moderators = docs.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    username: data.username || '',
                    displayName: data.displayName || '',
                    email: emailById.get(d.id) || '',
                    role: data.role || 'moderator',
                    banned: data.banned === true,
                    createdAt: tsToStr(data.createdAt),
                };
            });
            return NextResponse.json({ success: true, moderators });
        }

        if (section === 'badge_users') {
            // Rozet yönetimi için kullanıcı listesi (rozetler + seviye dahil)
            const search = searchParams.get('q') || '';
            const usersDocs = await db.collection('users').limit(300).get();
            const users = usersDocs.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    username: data.username || '',
                    displayName: data.displayName || data.username || 'İsimsiz',
                    city: data.city || '',
                    carBrand: data.carBrand || '',
                    level: data.level || 'Çaylak',
                    role: data.role || 'standard',
                    xp: data.xp || 0,
                    reputation: data.ratingTotalScore || 0,
                    entryCount: data.entryCount || 0,
                    badges: Array.isArray(data.badges) ? data.badges : [],
                };
            }).filter(u => !search || u.username.toLowerCase().includes(search.toLowerCase()) || u.displayName.toLowerCase().includes(search.toLowerCase()));
            return NextResponse.json({ success: true, users });
        }

        return NextResponse.json({ success: false, message: 'Gecersiz section.' }, { status: 400 });
    } catch (err) {
        console.error('Admin API GET error:', err);
        return NextResponse.json({ success: false, message: 'Sunucu hatasi.' }, { status: 500 });
    }
}

// ── POST ──
export async function POST(request: Request) {
    // ── Rate limit kontrolu ──
    const ip = getClientIP(request);
    const rl = checkRateLimit(`admin-post:${ip}`, RATE_LIMITS.admin);
    if (!rl.allowed) {
        return NextResponse.json(
            { success: false, message: 'Çok fazla istek. Lütfen bekleyin.' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.retryAfterMs || 60000) / 1000)) } }
        );
    }

    // ── Yetkilendirme kontrolu ──
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;
    const adminUser = authResult as AuthResult;

    const db = getAdminDb();

    try {
        const body = await request.json();
        const action = typeof body?.action === 'string' ? body.action.trim() : '';
        const target = typeof body?.target === 'string' ? body.target.trim() : '';
        const detail = typeof body?.detail === 'string' ? body.detail : '';

        if (!action || action.length > 80 || detail.length > 100_000) {
            return NextResponse.json({ success: false, message: 'Geçersiz istek.' }, { status: 400 });
        }
        const usernameTarget = action === 'ban_user' && /^@?[a-z0-9_.-]{3,30}$/i.test(target);
        if (target && !isValidDocId(target) && !usernameTarget) {
            return NextResponse.json({ success: false, message: 'Geçersiz hedef ID formatı.' }, { status: 400 });
        }

        // Actor bilgisi token'dan geliyor, client'a guvenme
        const logActor = adminUser.email || adminUser.uid || 'Admin';

        // Log yaz helper
        async function writeLog(act: string, tgt: string, det: string) {
            await db.collection('admin_logs').add({
                action: act.slice(0, 80), target: tgt.slice(0, 128), detail: det.slice(0, 1000), admin: logActor,
                createdAt: FieldValue.serverTimestamp(),
            });
        }

        async function protectedUser(uid: string) {
            const snapshot = await db.collection('users').doc(uid).get();
            if (!snapshot.exists) return { error: NextResponse.json({ success: false, message: 'Kullanıcı bulunamadı.' }, { status: 404 }) };
            if (uid === adminUser.uid || snapshot.data()?.role === 'admin') {
                return { error: NextResponse.json({ success: false, message: 'Admin hesapları bu işlemle değiştirilemez.' }, { status: 403 }) };
            }
            return { snapshot };
        }

        switch (action) {
            // Thread islemleri
            case 'pin_thread':
                await db.collection('threads').doc(target).update({ pinned: true });
                await writeLog('PIN', target, 'Sabitlendi');
                return NextResponse.json({ success: true });

            case 'unpin_thread':
                await db.collection('threads').doc(target).update({ pinned: false });
                await writeLog('UNPIN', target, 'Sabitleme kaldirildi');
                return NextResponse.json({ success: true });

            case 'lock_thread':
                await db.collection('threads').doc(target).update({ locked: true });
                await writeLog('LOCK', target, detail || 'Kilitlendi');
                return NextResponse.json({ success: true });

            case 'unlock_thread':
                await db.collection('threads').doc(target).update({ locked: false });
                await writeLog('UNLOCK', target, 'Kilit acildi');
                return NextResponse.json({ success: true });

            case 'delete_thread':
            case 'delete_thread_with_entries': {
                const entriesSnap = await db.collection('threads').doc(target).collection('entries').get();
                const delPromises = entriesSnap.docs.map(e => e.ref.delete());
                await Promise.all(delPromises);
                await db.collection('threads').doc(target).delete();
                await writeLog('DELETE_THREAD', target, `Baslik ve ${entriesSnap.size} entry silindi`);
                return NextResponse.json({ success: true });
            }

            case 'delete_entry': {
                // detail = JSON { threadId, entryId }
                const { threadId, entryId } = JSON.parse(detail);
                if (!isValidDocId(threadId) || !isValidDocId(entryId)) {
                    return NextResponse.json({ success: false, message: 'Geçersiz ID.' }, { status: 400 });
                }
                await db.collection('threads').doc(threadId).collection('entries').doc(entryId).delete();
                try {
                    await db.collection('threads').doc(threadId).update({ entryCount: FieldValue.increment(-1) });
                } catch (_) {}
                await writeLog('DELETE_ENTRY', entryId, `Thread: ${threadId}`);
                return NextResponse.json({ success: true });
            }

            case 'change_category':
                await db.collection('threads').doc(target).update({ category: detail });
                await writeLog('CHANGE_CAT', target, `Kategori -> ${detail}`);
                return NextResponse.json({ success: true });

            // Kullanici islemleri
            case 'ban_user': {
                let banUid = target;
                let directSnap = await db.collection('users').doc(target).get();
                if (!directSnap.exists) {
                    const users = await db.collection('users')
                        .where('username', '==', target.replace('@', '').toLowerCase()).limit(1).get();
                    if (users.empty) return NextResponse.json({ success: false, message: 'Kullanıcı bulunamadı.' }, { status: 404 });
                    banUid = users.docs[0].id;
                    directSnap = users.docs[0];
                }
                if (banUid === adminUser.uid || directSnap.data()?.role === 'admin') {
                    return NextResponse.json({ success: false, message: 'Admin hesabı banlanamaz.' }, { status: 403 });
                }
                let reason = detail;
                let duration = 'kalici';
                try {
                    const parsed = JSON.parse(detail);
                    reason = typeof parsed.reason === 'string' ? parsed.reason : '';
                    duration = typeof parsed.duration === 'string' ? parsed.duration : 'kalici';
                } catch { /* eski istemciler düz metin neden gönderebilir */ }
                const durations: Record<string, number> = {
                    '1g': 86_400_000, '3g': 259_200_000, '1h': 604_800_000,
                    '1ay': 2_592_000_000, '3ay': 7_776_000_000,
                };
                if (duration !== 'kalici' && !durations[duration]) {
                    return NextResponse.json({ success: false, message: 'Geçersiz ban süresi.' }, { status: 400 });
                }
                await db.collection('users').doc(banUid).update({
                    banned: true,
                    bannedAt: FieldValue.serverTimestamp(),
                    bannedUntil: duration === 'kalici' ? null : Timestamp.fromMillis(Date.now() + durations[duration]),
                    banReason: reason.trim().slice(0, 500),
                });
                await writeLog('BAN', banUid, reason || 'Ban uygulandı');
                return NextResponse.json({ success: true });
            }

            case 'unban_user': {
                const checked = await protectedUser(target);
                if (checked.error) return checked.error;
                await db.collection('users').doc(target).update({
                    banned: false,
                    bannedAt: FieldValue.delete(),
                    bannedUntil: FieldValue.delete(),
                    banReason: FieldValue.delete(),
                });
                await writeLog('UNBAN', target, 'Ban kaldırıldı');
                return NextResponse.json({ success: true });
            }

            case 'set_role': {
                const allowedRoles = new Set(['caylak', 'standard', 'usta', 'uzman', 'moderator']);
                if (!allowedRoles.has(detail)) {
                    return NextResponse.json({ success: false, message: 'Geçersiz rol.' }, { status: 400 });
                }
                const checked = await protectedUser(target);
                if (checked.error) return checked.error;
                await db.collection('users').doc(target).update({ role: detail });
                await writeLog('ROLE', target, `Rol -> ${detail}`);
                return NextResponse.json({ success: true });
            }

            // GüvenMetre yorum islemleri
            case 'delete_review':
                await db.collection('guvenmetre_reviews').doc(target).delete();
                await writeLog('DELETE_REVIEW', target, 'GüvenMetre yorumu silindi');
                return NextResponse.json({ success: true });

            case 'approve_review':
                await db.collection('guvenmetre_reviews').doc(target).update({ status: 'approved' });
                await writeLog('APPROVE_REVIEW', target, 'GüvenMetre yorumu onaylandı');
                return NextResponse.json({ success: true });

            case 'reject_review':
                await db.collection('guvenmetre_reviews').doc(target).update({ status: 'rejected' });
                await writeLog('REJECT_REVIEW', target, 'GüvenMetre yorumu reddedildi');
                return NextResponse.json({ success: true });

            // Sozluk islemleri
            case 'add_term': {
                const termData = JSON.parse(detail);
                const ref = await db.collection('dictionary').add({
                    ...termData, createdAt: FieldValue.serverTimestamp(),
                });
                await writeLog('DICT_ADD', termData.term, 'Sozluk terimi eklendi');
                return NextResponse.json({ success: true, id: ref.id });
            }

            case 'update_term': {
                const updateData = JSON.parse(detail);
                await db.collection('dictionary').doc(target).update(updateData);
                await writeLog('DICT_UPDATE', target, 'Sozluk terimi guncellendi');
                return NextResponse.json({ success: true });
            }

            case 'delete_term':
                await db.collection('dictionary').doc(target).delete();
                await writeLog('DICT_DELETE', target, 'Sozluk terimi silindi');
                return NextResponse.json({ success: true });

            // Sikayet / Rapor islemleri
            case 'submit_report': {
                const reportData = JSON.parse(detail);
                await db.collection('reports').add({
                    ...reportData,
                    status: 'bekliyor',
                    priority: reportData.category === 'yasadisi' ? 'kritik' : reportData.category === 'taciz' || reportData.category === 'spam' ? 'yuksek' : 'orta',
                    notes: '',
                    adminNote: '',
                    count: 1,
                    createdAt: FieldValue.serverTimestamp(),
                });
                return NextResponse.json({ success: true });
            }

            case 'update_report_status':
                await db.collection('reports').doc(target).update({ status: detail, updatedAt: FieldValue.serverTimestamp() });
                await writeLog('REPORT_STATUS', target, `Rapor durumu -> ${detail}`);
                return NextResponse.json({ success: true });

            case 'resolve_report': {
                const resolveData = JSON.parse(detail);
                await db.collection('reports').doc(target).update({
                    status: resolveData.status,
                    adminNote: resolveData.note || '',
                    resolvedAt: FieldValue.serverTimestamp(),
                });
                await writeLog('REPORT_RESOLVE', target, `Rapor cozumlendi: ${resolveData.status}`);
                return NextResponse.json({ success: true });
            }

            case 'delete_report':
                await db.collection('reports').doc(target).delete();
                await writeLog('REPORT_DELETE', target, 'Rapor silindi');
                return NextResponse.json({ success: true });

            // Reklam islemleri
            case 'create_ad': {
                const adData = JSON.parse(detail);
                const ref = await db.collection('advertisements').add({
                    ...adData, status: 'active', impressions: 0, clicks: 0, createdAt: FieldValue.serverTimestamp(),
                });
                await writeLog('AD_CREATE', adData.title, 'Yeni reklam kampanyasi eklendi');
                return NextResponse.json({ success: true, id: ref.id });
            }

            case 'update_ad_status':
                await db.collection('advertisements').doc(target).update({ status: detail });
                await writeLog('AD_STATUS', target, `Reklam durumu -> ${detail}`);
                return NextResponse.json({ success: true });

            case 'delete_ad':
                await db.collection('advertisements').doc(target).delete();
                await writeLog('AD_DELETE', target, 'Reklam silindi');
                return NextResponse.json({ success: true });

            case 'simulate_impression': {
                const adSnap = await db.collection('advertisements').doc(target).get();
                const ad = adSnap.data();
                if (ad) {
                    const newImp = (ad.impressions || 0) + Math.floor(Math.random() * 500) + 100;
                    const newClicks = (ad.clicks || 0) + Math.floor(Math.random() * 15) + 2;
                    await db.collection('advertisements').doc(target).update({ impressions: newImp, clicks: newClicks });
                }
                return NextResponse.json({ success: true });
            }

            case 'save_altin_anahtar': {
                const fs = await import('fs');
                const path = await import('path');
                const filePath = path.join(process.cwd(), 'public', 'data', 'altin_anahtar.json');
                fs.writeFileSync(filePath, JSON.stringify(body.data, null, 2), 'utf-8');
                await writeLog('ALTIN_ANAHTAR', 'save', `Usta verileri güncellendi (${body.data?.masters?.length || 0} kayıt)`);
                return NextResponse.json({ success: true });
            }

            // Pazar Ilan
            case 'approve_listing':
                await db.collection('listings').doc(target).update({ status: 'approved' });
                await writeLog('APPROVE_LISTING', target, 'Ilan onaylandi');
                return NextResponse.json({ success: true });

            case 'reject_listing':
                await db.collection('listings').doc(target).update({ status: 'rejected', rejectReason: detail });
                await writeLog('REJECT_LISTING', target, `Ilan reddedildi: ${detail}`);
                return NextResponse.json({ success: true });

            // Guvenmetre
            case 'approve_guvenmetre':
                await db.collection('guvenmetre').doc(target).update({ status: 'approved' });
                await writeLog('GUVENMETRE_APPROVE', target, 'Guvenmetre istegi onaylandi');
                return NextResponse.json({ success: true });

            case 'reject_guvenmetre':
                await db.collection('guvenmetre').doc(target).update({ status: 'rejected', rejectReason: detail });
                await writeLog('GUVENMETRE_REJECT', target, 'Guvenmetre istegi reddedildi');
                return NextResponse.json({ success: true });

            // Trending & Icerik
            case 'set_trending':
                await db.collection('threads').doc(target).update({ trending: true });
                await writeLog('TRENDING_ADD', target, 'Trendlere eklendi');
                return NextResponse.json({ success: true });

            case 'remove_trending':
                await db.collection('threads').doc(target).update({ trending: false });
                await writeLog('TRENDING_REMOVE', target, 'Trendlerden kaldirildi');
                return NextResponse.json({ success: true });

            case 'add_announcement': {
                const annData = JSON.parse(detail);
                await db.collection('announcements').add({
                    ...annData, author: logActor, createdAt: FieldValue.serverTimestamp(),
                });
                await writeLog('ANNOUNCE', annData.title, 'Duyuru eklendi');
                return NextResponse.json({ success: true });
            }

            case 'delete_announcement':
                await db.collection('announcements').doc(target).delete();
                await writeLog('ANNOUNCE', target, 'Duyuru silindi');
                return NextResponse.json({ success: true });

            case 'toggle_announcement_pin': {
                const annSnap = await db.collection('announcements').doc(target).get();
                if (annSnap.exists) {
                    await db.collection('announcements').doc(target).update({ pinned: !annSnap.data()?.pinned });
                }
                return NextResponse.json({ success: true });
            }

            // ── Kullanıcı uyarısı (warn) ──
            case 'warn_user': {
                const userSnap = await db.collection('users').doc(target).get();
                const current = userSnap.exists ? (userSnap.data()?.warnings || 0) : 0;
                await db.collection('users').doc(target).update({ warnings: current + 1 });
                await writeLog('WARN', target, detail || 'Kullanıcı uyarıldı');
                return NextResponse.json({ success: true, warnings: current + 1 });
            }

            // ── Kelime Filtresi (bad_words) ──
            case 'add_bad_word': {
                const wordData = JSON.parse(detail);
                if (!wordData.word || typeof wordData.word !== 'string') {
                    return NextResponse.json({ success: false, message: 'Kelime gerekli.' }, { status: 400 });
                }
                const ref = await db.collection('bad_words').add({
                    word: String(wordData.word).trim(),
                    mode: wordData.mode || 'yildizla',
                    category: wordData.category || 'hakaret',
                    regex: !!wordData.regex,
                    whitelist: Array.isArray(wordData.whitelist) ? wordData.whitelist : [],
                    active: true,
                    matchCount: 0,
                    addedBy: logActor,
                    createdAt: FieldValue.serverTimestamp(),
                });
                await writeLog('WORD_ADD', wordData.word, 'Yasaklı kelime eklendi');
                return NextResponse.json({ success: true, id: ref.id });
            }

            case 'update_bad_word': {
                const updateData = JSON.parse(detail);
                await db.collection('bad_words').doc(target).update(updateData);
                await writeLog('WORD_UPDATE', target, 'Yasaklı kelime güncellendi');
                return NextResponse.json({ success: true });
            }

            case 'delete_bad_word':
                await db.collection('bad_words').doc(target).delete();
                await writeLog('WORD_DELETE', target, 'Yasaklı kelime silindi');
                return NextResponse.json({ success: true });

            // ── Sistem Ayarları (settings/platform) ──
            case 'save_settings': {
                const settingsData = JSON.parse(detail);
                await db.collection('settings').doc('platform').set({
                    ...settingsData,
                    updatedAt: FieldValue.serverTimestamp(),
                    updatedBy: logActor,
                }, { merge: true });
                await writeLog('SETTINGS', 'platform', 'Sistem ayarları güncellendi');
                return NextResponse.json({ success: true });
            }

            // ── Rozetler (badges) ──
            case 'create_badge': {
                const badgeData = JSON.parse(detail);
                const ref = await db.collection('badges').add({
                    name: badgeData.name,
                    emoji: badgeData.emoji || '🏆',
                    description: badgeData.description || '',
                    color: badgeData.color || '#3B82F6',
                    type: badgeData.type || 'manuel',
                    createdAt: FieldValue.serverTimestamp(),
                });
                await writeLog('BADGE_CREATE', badgeData.name, 'Yeni rozet oluşturuldu');
                return NextResponse.json({ success: true, id: ref.id });
            }

            case 'delete_badge':
                await db.collection('badges').doc(target).delete();
                await writeLog('BADGE_DELETE', target, 'Rozet silindi');
                return NextResponse.json({ success: true });

            case 'assign_badge': {
                // detail = JSON { badgeName }
                const { badgeName } = JSON.parse(detail);
                await db.collection('users').doc(target).update({
                    badges: FieldValue.arrayUnion(badgeName),
                });
                await writeLog('BADGE_ASSIGN', target, `Rozet verildi: ${badgeName}`);
                return NextResponse.json({ success: true });
            }

            case 'remove_badge': {
                const { badgeName } = JSON.parse(detail);
                await db.collection('users').doc(target).update({
                    badges: FieldValue.arrayRemove(badgeName),
                });
                await writeLog('BADGE_REMOVE', target, `Rozet kaldırıldı: ${badgeName}`);
                return NextResponse.json({ success: true });
            }

            case 'set_level':
                await db.collection('users').doc(target).update({ level: detail });
                await writeLog('LEVEL', target, `Seviye -> ${detail}`);
                return NextResponse.json({ success: true });

            // ── Moderatör Yönetimi ──
            case 'add_moderator': {
                const checked = await protectedUser(target);
                if (checked.error) return checked.error;
                await db.collection('users').doc(target).update({ role: 'moderator' });
                await writeLog('MOD_ADD', target, 'Moderatör atandı');
                return NextResponse.json({ success: true });
            }

            case 'remove_moderator': {
                const checked = await protectedUser(target);
                if (checked.error) return checked.error;
                if (checked.snapshot?.data()?.role !== 'moderator') {
                    return NextResponse.json({ success: false, message: 'Hedef moderatör değil.' }, { status: 409 });
                }
                await db.collection('users').doc(target).update({ role: 'standard' });
                await writeLog('MOD_REMOVE', target, 'Moderatörlük kaldırıldı');
                return NextResponse.json({ success: true });
            }

            // ── Toplu Mesaj / Bildirim Yayını ──
            case 'send_broadcast': {
                const bc = JSON.parse(detail);
                const { title, body: msgBody, target: audience, type, targetUsername } = bc;
                if (!title || !msgBody) {
                    return NextResponse.json({ success: false, message: 'Başlık ve mesaj gerekli.' }, { status: 400 });
                }

                // Hedef kullanıcıları belirle
                let recipients: string[] = [];
                if (audience === 'tek_kullanici' && targetUsername) {
                    const uq = await db.collection('users').where('username', '==', String(targetUsername).replace('@', '').toLowerCase()).limit(1).get();
                    recipients = uq.docs.map(d => d.id);
                } else {
                    let q: FirebaseFirestore.Query = db.collection('users');
                    if (audience === 'premium') {
                        q = q.where('role', '==', 'premium');
                    } else if (audience === 'yazarlar') {
                        q = q.where('role', 'in', ['usta', 'yazar']);
                    } else if (audience === 'caylakar') {
                        q = q.where('role', '==', 'caylak');
                    }
                    const usnap = await q.get();
                    recipients = usnap.docs.map(d => d.id);
                }

                // Broadcast kaydı
                const bcRef = await db.collection('broadcasts').add({
                    title, body: msgBody, target: audience, type: type || 'duyuru',
                    status: 'gonderildi', recipientCount: recipients.length,
                    sentBy: logActor, createdAt: FieldValue.serverTimestamp(),
                });

                // Her alıcıya bildirim oluştur (batch ile, 450'lik gruplar)
                const typeMap: Record<string, string> = { bilgi: 'info', uyari: 'warning', duyuru: 'system', odul: 'achievement' };
                let written = 0;
                for (let i = 0; i < recipients.length; i += 450) {
                    const batch = db.batch();
                    const slice = recipients.slice(i, i + 450);
                    slice.forEach(uid => {
                        const nRef = db.collection('notifications').doc();
                        batch.set(nRef, {
                            userId: uid,
                            fromUserId: 'system',
                            type: typeMap[type] || 'system',
                            title,
                            message: msgBody,
                            read: false,
                            broadcastId: bcRef.id,
                            createdAt: FieldValue.serverTimestamp(),
                        });
                    });
                    await batch.commit();
                    written += slice.length;
                }

                await writeLog('BROADCAST', title, `${written} kullanıcıya gönderildi`);
                return NextResponse.json({ success: true, id: bcRef.id, recipientCount: written });
            }

            case 'save_broadcast_draft': {
                const bc = JSON.parse(detail);
                const ref = await db.collection('broadcasts').add({
                    title: bc.title || '', body: bc.body || '', target: bc.target || 'hepsi',
                    type: bc.type || 'duyuru', status: 'taslak', recipientCount: 0,
                    sentBy: logActor, createdAt: FieldValue.serverTimestamp(),
                });
                return NextResponse.json({ success: true, id: ref.id });
            }

            case 'delete_broadcast':
                await db.collection('broadcasts').doc(target).delete();
                await writeLog('BROADCAST_DELETE', target, 'Mesaj silindi');
                return NextResponse.json({ success: true });

            // ── Uzman Başvuruları ──
            case 'approve_expert': {
                // detail = JSON { userId, note? }
                const ex = JSON.parse(detail);
                if (!ex.userId || !isValidDocId(ex.userId)) {
                    return NextResponse.json({ success: false, message: 'Geçersiz kullanıcı.' }, { status: 400 });
                }
                // Başvuruyu onayla
                await db.collection('expert_applications').doc(target).update({
                    status: 'onaylandi',
                    adminNote: ex.note || '',
                    resolvedAt: FieldValue.serverTimestamp(),
                });
                // Kullanıcıyı uzman yap
                await db.collection('users').doc(ex.userId).update({
                    role: 'uzman',
                    level: 'Uzman',
                    expertVerifiedAt: FieldValue.serverTimestamp(),
                });
                // Kullanıcıya bildirim
                await db.collection('notifications').add({
                    userId: ex.userId,
                    fromUserId: 'system',
                    type: 'achievement',
                    title: 'Tebrikler! Uzman Oldunuz',
                    message: 'Uzman başvurunuz onaylandı. Artık Onaylı Uzman rozetine sahipsiniz!',
                    read: false,
                    createdAt: FieldValue.serverTimestamp(),
                });
                await writeLog('EXPERT_APPROVE', ex.userId, 'Uzman başvurusu onaylandı');
                return NextResponse.json({ success: true });
            }

            case 'reject_expert': {
                const ex = JSON.parse(detail);
                await db.collection('expert_applications').doc(target).update({
                    status: 'reddedildi',
                    adminNote: ex.note || '',
                    resolvedAt: FieldValue.serverTimestamp(),
                });
                if (ex.userId && isValidDocId(ex.userId)) {
                    await db.collection('notifications').add({
                        userId: ex.userId,
                        fromUserId: 'system',
                        type: 'warning',
                        title: 'Uzman Başvurusu Sonucu',
                        message: ex.note
                            ? `Uzman başvurunuz onaylanmadı: ${ex.note}`
                            : 'Uzman başvurunuz bu sefer onaylanmadı. Daha sonra tekrar başvurabilirsiniz.',
                        read: false,
                        createdAt: FieldValue.serverTimestamp(),
                    });
                }
                await writeLog('EXPERT_REJECT', target, 'Uzman başvurusu reddedildi');
                return NextResponse.json({ success: true });
            }

            default:
                return NextResponse.json({ success: false, message: `Bilinmeyen action: ${action}` }, { status: 400 });
        }
    } catch (err) {
        console.error('Admin API POST error:', err);
        return NextResponse.json({ success: false, message: 'Sunucu hatasi.' }, { status: 500 });
    }
}
