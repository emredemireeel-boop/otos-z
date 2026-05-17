import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
    collection, getDocs, addDoc, query, orderBy, where, limit,
    serverTimestamp, Timestamp, doc, updateDoc, deleteDoc, getDoc
} from 'firebase/firestore';
import { requireAuth, type AuthResult } from '@/lib/authGuard';
import { checkRateLimit, RATE_LIMITS, getClientIP } from '@/lib/rateLimit';

/**
 * GüvenMetre Reviews API
 * GET  /api/guvenmetre/reviews?brandId=xxx&categoryId=yyy
 * POST /api/guvenmetre/reviews  { categoryId, brandId, rating, comment }
 */

// GET — Belirli bir marka/kişi için yorumları getir
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    const categoryId = searchParams.get('categoryId');

    if (!brandId || !categoryId) {
        return NextResponse.json({ success: false, message: 'brandId ve categoryId gerekli.' }, { status: 400 });
    }

    try {
        const reviewsQuery = query(
            collection(db, 'guvenmetre_reviews'),
            where('categoryId', '==', categoryId),
            where('brandId', '==', brandId),
            where('status', '==', 'approved'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        const snap = await getDocs(reviewsQuery);
        const reviews = snap.docs.map(d => {
            const data = d.data();
            return {
                id: d.id,
                userName: data.userName || 'Anonim',
                userAvatar: data.userAvatar || '',
                userId: data.userId || '',
                rating: data.rating || 0,
                comment: data.comment || '',
                timeAgo: formatTimeAgo(data.createdAt),
                likes: data.likes || 0,
                isVerified: data.isVerified || false,
            };
        });

        return NextResponse.json({ success: true, reviews });
    } catch (err) {
        console.error('GüvenMetre reviews GET error:', err);
        return NextResponse.json({ success: false, message: 'Yorumlar yüklenemedi.' }, { status: 500 });
    }
}

// POST — Yeni değerlendirme gönder (üye olmalı)
export async function POST(request: Request) {
    // Rate limit
    const ip = getClientIP(request);
    const rl = checkRateLimit(`guvenmetre-review:${ip}`, { maxRequests: 5, windowMs: 60 * 60 * 1000 });
    if (!rl.allowed) {
        return NextResponse.json(
            { success: false, message: 'Çok fazla değerlendirme gönderdiniz. Lütfen bir süre bekleyin.' },
            { status: 429 }
        );
    }

    // Auth kontrolü — sadece giriş yapmış kullanıcılar
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const authedUser = authResult as AuthResult;

    try {
        const body = await request.json();
        const { categoryId, brandId, rating, comment } = body;

        // Validasyon
        if (!categoryId || !brandId) {
            return NextResponse.json({ success: false, message: 'Kategori ve marka gerekli.' }, { status: 400 });
        }
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ success: false, message: 'Puan 1-5 arası olmalıdır.' }, { status: 400 });
        }
        const cleanComment = (comment || '').trim().slice(0, 500);

        // Aynı kullanıcının aynı markayı tekrar değerlendirmesini engelle
        const existingQuery = query(
            collection(db, 'guvenmetre_reviews'),
            where('userId', '==', authedUser.uid),
            where('categoryId', '==', categoryId),
            where('brandId', '==', brandId)
        );
        const existingSnap = await getDocs(existingQuery);
        if (!existingSnap.empty) {
            return NextResponse.json(
                { success: false, message: 'Bu marka/kişi için zaten bir değerlendirmeniz mevcut.' },
                { status: 409 }
            );
        }

        // Kullanıcı bilgilerini al
        let userName = 'Anonim';
        let userAvatar = '';
        try {
            const userDoc = await getDoc(doc(db, 'users', authedUser.uid!));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                userName = userData.username || userData.displayName || 'Anonim';
                userAvatar = userData.avatar || userData.photoURL || '';
            }
        } catch { /* fallback to default */ }

        // Kaydet
        const reviewRef = await addDoc(collection(db, 'guvenmetre_reviews'), {
            categoryId,
            brandId,
            userId: authedUser.uid,
            userEmail: authedUser.email || '',
            userName,
            userAvatar,
            rating: Number(rating),
            comment: cleanComment,
            status: 'approved', // otomatik onay (admin isterse pending yapabilir)
            likes: 0,
            isVerified: false,
            createdAt: serverTimestamp(),
        });

        // 🚀 Google'a güncelleme bildirimi (GüvenMetre marka sayfası güncellendi)
        try {
            const { google } = await import('googleapis');
            const path = await import('path');
            const KEY_FILE = 'otosozindex-7a4ca5cb2331.json';
            const keyFilePath = path.join(process.cwd(), KEY_FILE);
            const auth = new google.auth.GoogleAuth({
                keyFile: keyFilePath,
                scopes: ['https://www.googleapis.com/auth/indexing'],
            });
            const client = await auth.getClient();
            const indexing = google.indexing({ version: 'v3', auth: client as any });
            await indexing.urlNotifications.publish({
                requestBody: {
                    url: `https://www.otosoz.com/guvenmetre/${categoryId}/${brandId}`,
                    type: 'URL_UPDATED',
                },
            });
            console.log(`✅ SEO Ping: /guvenmetre/${categoryId}/${brandId}`);
        } catch (seoErr) {
            console.warn('SEO ping başarısız (devam ediliyor):', seoErr);
        }

        return NextResponse.json({
            success: true,
            message: 'Değerlendirmeniz başarıyla kaydedildi!',
            reviewId: reviewRef.id
        });

    } catch (err) {
        console.error('GüvenMetre review POST error:', err);
        return NextResponse.json({ success: false, message: 'Değerlendirme kaydedilemedi.' }, { status: 500 });
    }
}

// Helper: Firestore timestamp'i "X önce" formatına çevir
function formatTimeAgo(ts: any): string {
    if (!ts) return 'Az önce';
    let date: Date;
    if (ts instanceof Timestamp) {
        date = ts.toDate();
    } else if (ts?.seconds) {
        date = new Date(ts.seconds * 1000);
    } else {
        return 'Az önce';
    }
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Az önce';
    if (diffMin < 60) return `${diffMin} dk önce`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} saat önce`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) return `${diffDay} gün önce`;
    const diffMonth = Math.floor(diffDay / 30);
    if (diffMonth < 12) return `${diffMonth} ay önce`;
    return `${Math.floor(diffMonth / 12)} yıl önce`;
}
