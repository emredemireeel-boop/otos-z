/**
 * adminFetch — Admin API çağrıları için Firebase ID token'ı otomatik ekler.
 * 
 * Bu utility'yi /api/admin endpoint'ine yapılan tüm fetch çağrılarında kullan.
 * Token alınamazsa isteği token olmadan gönderir (sunucu 401 dönecektir).
 */

import { auth } from './firebase';

/**
 * Firebase ID token'ı alır.
 * Token yoksa veya kullanıcı giriş yapmamışsa boş string döner.
 */
async function getIdToken(): Promise<string> {
    try {
        const user = auth.currentUser;
        if (!user) return '';
        return await user.getIdToken(/* forceRefresh= */ false);
    } catch (e) {
        console.warn('adminFetch: Token alınamadı', e);
        return '';
    }
}

/**
 * /api/admin endpoint'ine token ile GET isteği atar.
 */
export async function adminGet(section: string, extraParams?: Record<string, string>): Promise<any> {
    const token = await getIdToken();
    let url = `/api/admin?section=${section}`;
    if (extraParams) {
        Object.entries(extraParams).forEach(([k, v]) => {
            if (v) url += `&${k}=${encodeURIComponent(v)}`;
        });
    }
    const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.json();
}

/**
 * /api/admin endpoint'ine token ile POST isteği atar.
 */
export async function adminPost(body: {
    action: string;
    target?: string;
    detail?: string;
    [key: string]: any;
}): Promise<any> {
    const token = await getIdToken();
    const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
    });
    return res.json();
}
