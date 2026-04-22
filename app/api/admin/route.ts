import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
    collection, getDocs, doc, updateDoc, deleteDoc, addDoc,
    query, orderBy, limit, where, serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { requireAdmin, type AuthResult } from '@/lib/authGuard';
import { checkRateLimit, RATE_LIMITS, getClientIP } from '@/lib/rateLimit';
import { sanitizeText, isValidDocId } from '@/lib/validation';

/**
 * Admin API - Firestore uzerinden gercek platform verilerini yonetir
 * GET /api/admin?section=stats|threads|users|logs|dictionary
 * POST /api/admin -> action islemleri
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
    const adminUser = authResult as AuthResult;

    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'stats';

    try {
        if (section === 'stats') {
            // Gercek Firestore istatistikleri
            const threadsDocs = await getDocs(collection(db, 'threads'));
            const usersSnap = await getDocs(collection(db, 'users'));
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

            // Son admin loglari
            const logsQuery = query(collection(db, 'admin_logs'), orderBy('createdAt', 'desc'), limit(8));
            const logsDocs = await getDocs(logsQuery);
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
            const threadsDocs = await getDocs(query(collection(db, 'threads'), orderBy('createdAt', 'desc'), limit(100)));
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
            const search = searchParams.get('q') || '';
            const usersDocs = await getDocs(query(collection(db, 'users'), limit(200)));
            const users = usersDocs.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    username: data.username || '',
                    displayName: data.displayName || '',
                    email: data.email || '',
                    role: data.role || 'standard',
                    city: data.city || '',
                    level: data.level || 'Yeni Uye',
                    banned: data.banned || false,
                    createdAt: tsToStr(data.createdAt),
                };
            }).filter(u => !search || u.username.toLowerCase().includes(search.toLowerCase()) || u.displayName.toLowerCase().includes(search.toLowerCase()));

            return NextResponse.json({ success: true, users, total: users.length });
        }

        if (section === 'logs') {
            const logsQuery = query(collection(db, 'admin_logs'), orderBy('createdAt', 'desc'), limit(50));
            const logsDocs = await getDocs(logsQuery);
            const logs = logsDocs.docs.map(d => {
                const data = d.data();
                return { action: data.action, target: data.target, admin: data.admin || 'Admin', detail: data.detail, time: tsToStr(data.createdAt) };
            });
            return NextResponse.json({ success: true, logs });
        }

        if (section === 'dictionary') {
            const dictDocs = await getDocs(query(collection(db, 'dictionary'), orderBy('term')));
            const terms = dictDocs.docs.map(d => ({ id: d.id, ...d.data() }));
            return NextResponse.json({ success: true, terms });
        }

        if (section === 'advertisements') {
            const search = searchParams.get('q') || '';
            const adsDocs = await getDocs(query(collection(db, 'advertisements'), orderBy('createdAt', 'desc')));
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
            const reportsRef = collection(db, 'reports');
            const reportsQuery = statusFilter === 'all'
                ? query(reportsRef, orderBy('createdAt', 'desc'))
                : query(reportsRef, where('status', '==', statusFilter), orderBy('createdAt', 'desc'));
            const reportsDocs = await getDocs(reportsQuery);
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

    try {
        const body = await request.json();
        const { action, target, detail } = body;

        // Input dogrulama: target bir document ID ise kontrol et
        if (target && !isValidDocId(target)) {
            return NextResponse.json({ success: false, message: 'Geçersiz hedef ID formatı.' }, { status: 400 });
        }

        // Actor bilgisi artik token'dan geliyor, client'a guvenme
        const logActor = adminUser.email || adminUser.uid || 'Admin';

        // Log yaz helper
        async function writeLog(act: string, tgt: string, det: string) {
            await addDoc(collection(db, 'admin_logs'), {
                action: act, target: tgt, detail: det, admin: logActor,
                createdAt: serverTimestamp(),
            });
        }

        switch (action) {
            // Thread islemleri
            case 'pin_thread':
                await updateDoc(doc(db, 'threads', target), { pinned: true });
                await writeLog('PIN', target, 'Sabitlendi');
                return NextResponse.json({ success: true });

            case 'unpin_thread':
                await updateDoc(doc(db, 'threads', target), { pinned: false });
                await writeLog('UNPIN', target, 'Sabitleme kaldirildi');
                return NextResponse.json({ success: true });

            case 'lock_thread':
                await updateDoc(doc(db, 'threads', target), { locked: true });
                await writeLog('LOCK', target, detail || 'Kilitlendi');
                return NextResponse.json({ success: true });

            case 'unlock_thread':
                await updateDoc(doc(db, 'threads', target), { locked: false });
                await writeLog('UNLOCK', target, 'Kilit acildi');
                return NextResponse.json({ success: true });

            case 'delete_thread':
                await deleteDoc(doc(db, 'threads', target));
                await writeLog('DELETE_THREAD', target, 'Kalici silindi');
                return NextResponse.json({ success: true });

            case 'change_category':
                await updateDoc(doc(db, 'threads', target), { category: detail });
                await writeLog('CHANGE_CAT', target, `Kategori -> ${detail}`);
                return NextResponse.json({ success: true });

            // Kullanici islemleri
            case 'ban_user':
                await updateDoc(doc(db, 'users', target), { banned: true, role: 'banned' });
                await writeLog('BAN', target, detail || 'Ban uygulandi');
                return NextResponse.json({ success: true });

            case 'unban_user':
                await updateDoc(doc(db, 'users', target), { banned: false, role: 'standard' });
                await writeLog('UNBAN', target, 'Ban kaldirildi');
                return NextResponse.json({ success: true });

            case 'set_role':
                await updateDoc(doc(db, 'users', target), { role: detail });
                await writeLog('ROLE', target, `Rol -> ${detail}`);
                return NextResponse.json({ success: true });

            // Sozluk islemleri
            case 'add_term': {
                const termData = JSON.parse(detail);
                const ref = await addDoc(collection(db, 'dictionary'), {
                    ...termData, createdAt: serverTimestamp(),
                });
                await writeLog('DICT_ADD', termData.term, 'Sozluk terimi eklendi');
                return NextResponse.json({ success: true, id: ref.id });
            }

            case 'update_term': {
                const updateData = JSON.parse(detail);
                await updateDoc(doc(db, 'dictionary', target), updateData);
                await writeLog('DICT_UPDATE', target, 'Sozluk terimi guncellendi');
                return NextResponse.json({ success: true });
            }

            case 'delete_term':
                await deleteDoc(doc(db, 'dictionary', target));
                await writeLog('DICT_DELETE', target, 'Sozluk terimi silindi');
                return NextResponse.json({ success: true });

            // Sikayet / Rapor islemleri
            case 'submit_report': {
                const reportData = JSON.parse(detail);
                await addDoc(collection(db, 'reports'), {
                    ...reportData,
                    status: 'bekliyor',
                    priority: reportData.category === 'yasadisi' ? 'kritik' : reportData.category === 'taciz' || reportData.category === 'spam' ? 'yuksek' : 'orta',
                    notes: '',
                    adminNote: '',
                    count: 1,
                    createdAt: serverTimestamp(),
                });
                return NextResponse.json({ success: true });
            }

            case 'update_report_status':
                await updateDoc(doc(db, 'reports', target), { status: detail, updatedAt: serverTimestamp() });
                await writeLog('REPORT_STATUS', target, `Rapor durumu -> ${detail}`);
                return NextResponse.json({ success: true });

            case 'resolve_report': {
                const resolveData = JSON.parse(detail);
                await updateDoc(doc(db, 'reports', target), {
                    status: resolveData.status,
                    adminNote: resolveData.note || '',
                    resolvedAt: serverTimestamp(),
                });
                await writeLog('REPORT_RESOLVE', target, `Rapor cozumlendi: ${resolveData.status}`);
                return NextResponse.json({ success: true });
            }

            case 'delete_report':
                await deleteDoc(doc(db, 'reports', target));
                await writeLog('REPORT_DELETE', target, 'Rapor silindi');
                return NextResponse.json({ success: true });

            // Reklam islemleri
            case 'create_ad': {
                const adData = JSON.parse(detail);
                const ref = await addDoc(collection(db, 'advertisements'), {
                    ...adData, status: 'active', impressions: 0, clicks: 0, createdAt: serverTimestamp(),
                });
                await writeLog('AD_CREATE', adData.title, 'Yeni reklam kampanyasi eklendi');
                return NextResponse.json({ success: true, id: ref.id });
            }

            case 'update_ad_status':
                await updateDoc(doc(db, 'advertisements', target), { status: detail });
                await writeLog('AD_STATUS', target, `Reklam durumu -> ${detail}`);
                return NextResponse.json({ success: true });

            case 'delete_ad':
                await deleteDoc(doc(db, 'advertisements', target));
                await writeLog('AD_DELETE', target, 'Reklam silindi');
                return NextResponse.json({ success: true });

            case 'simulate_impression': {
                const adRef = doc(db, 'advertisements', target);
                const adDoc = await getDocs(query(collection(db, 'advertisements')));
                const ad = adDoc.docs.find(d => d.id === target)?.data();
                if (ad) {
                    const newImp = (ad.impressions || 0) + Math.floor(Math.random() * 500) + 100;
                    const newClicks = (ad.clicks || 0) + Math.floor(Math.random() * 15) + 2;
                    await updateDoc(adRef, { impressions: newImp, clicks: newClicks });
                }
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
