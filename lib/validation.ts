/**
 * Input Validation & Sanitization Utility
 * 
 * Forum entry, baslik, kullanici adi gibi tum kullanici girdilerini
 * dogrulama ve temizleme islemlerini yapar.
 */

// ── Tehlikeli karakterleri temizle ──
export function sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
        // Script tag'lerini kaldir
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // HTML tag'lerini kaldir (sadece metin birakir)
        .replace(/<[^>]*>/g, '')
        // JavaScript event handler'larini kaldir
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        // javascript: protokolunu kaldir
        .replace(/javascript\s*:/gi, '')
        // data: protokolunu kaldir (base64 injection)
        .replace(/data\s*:/gi, '')
        // Null byte'lari kaldir
        .replace(/\0/g, '')
        // Gereksiz bosluk temizle
        .trim();
}

// ── Kullanici adi dogrulama ──
export function validateUsername(username: string): { valid: boolean; error?: string } {
    if (!username || username.length < 3) {
        return { valid: false, error: 'Kullanıcı adı en az 3 karakter olmalıdır.' };
    }
    if (username.length > 30) {
        return { valid: false, error: 'Kullanıcı adı en fazla 30 karakter olabilir.' };
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
        return { valid: false, error: 'Kullanıcı adı sadece küçük harf, rakam ve alt çizgi içerebilir.' };
    }
    // Yasakli kelimeler
    const forbidden = ['admin', 'moderator', 'otosoz', 'sistem', 'system', 'root', 'support'];
    if (forbidden.some(word => username.toLowerCase().includes(word))) {
        return { valid: false, error: 'Bu kullanıcı adı kullanılamaz.' };
    }
    return { valid: true };
}

// ── Forum basligi dogrulama ──
export function validateThreadTitle(title: string): { valid: boolean; error?: string; sanitized: string } {
    const sanitized = sanitizeText(title);

    const hasEmoji = /\p{Extended_Pictographic}/gu.test(title);
    if (hasEmoji) {
        return { valid: false, error: 'Başlıklarda emoji kullanımı yasaktır.', sanitized };
    }

    if (!sanitized || sanitized.length < 5) {
        return { valid: false, error: 'Başlık en az 5 karakter olmalıdır.', sanitized };
    }
    if (sanitized.length > 200) {
        return { valid: false, error: 'Başlık en fazla 200 karakter olabilir.', sanitized };
    }
    return { valid: true, sanitized };
}

// ── Forum entry icerigi dogrulama ──
export function validateEntryContent(content: string): { valid: boolean; error?: string; sanitized: string } {
    const sanitized = sanitizeText(content);

    const hasEmoji = /\p{Extended_Pictographic}/gu.test(content);
    if (hasEmoji) {
        return { valid: false, error: 'Entry içeriklerinde emoji kullanımı yasaktır.', sanitized };
    }

    // Ham link kontrolü (Reddit kuralları)
    // Önce geçerli Markdown linkleri temizleyelim: [Köprü](https://...)
    const textWithoutMarkdownLinks = content.replace(/\[[^\]]+\]\((https?:\/\/[^\s\)]+)\)/g, '');
    
    // Geriye kalan metinde hala http:// veya https:// varsa bu ham bir linktir!
    const rawLinkRegex = /(https?:\/\/[^\s]+)/gi;
    if (rawLinkRegex.test(textWithoutMarkdownLinks)) {
        return { 
            valid: false, 
            error: 'Lütfen linkleri ham olarak (https://...) paylaşmayın. Editördeki 🔗 (Link) butonunu kullanarak köprü ekleyin.', 
            sanitized 
        };
    }

    if (!sanitized || sanitized.length < 3) {
        return { valid: false, error: 'İçerik en az 3 karakter olmalıdır.', sanitized };
    }
    if (sanitized.length > 10000) {
        return { valid: false, error: 'İçerik en fazla 10.000 karakter olabilir.', sanitized };
    }
    return { valid: true, sanitized };
}

// ── Email dogrulama ──
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

// ── Sifre gucu dogrulama ──
// En az 8 karakter, en az bir harf ve bir rakam icermeli.
export function validatePassword(password: string): { valid: boolean; error?: string } {
    if (!password || password.length < 8) {
        return { valid: false, error: 'Şifre en az 8 karakter olmalıdır.' };
    }
    if (password.length > 128) {
        return { valid: false, error: 'Şifre en fazla 128 karakter olabilir.' };
    }
    if (!/[A-Za-zçğıöşüÇĞİÖŞÜ]/.test(password)) {
        return { valid: false, error: 'Şifre en az bir harf içermelidir.' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, error: 'Şifre en az bir rakam içermelidir.' };
    }
    return { valid: true };
}

// ── Tag'leri dogrula ve temizle ──
export function validateTags(tags: string[]): string[] {
    return tags
        .map(tag => sanitizeText(tag))
        .filter(tag => tag.length >= 2 && tag.length <= 30)
        .slice(0, 10); // Max 10 tag
}

// ── Firestore document ID dogrulama (injection onleme) ──
export function isValidDocId(id: string): boolean {
    if (!id || typeof id !== 'string') return false;
    // Firestore doc ID'leri: alfanumeric, tire, alt cizgi
    return /^[a-zA-Z0-9_-]{1,128}$/.test(id);
}
