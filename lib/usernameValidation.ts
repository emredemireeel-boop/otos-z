// ═══════════════════════════════════════════════════════════════
// OtoSöz — Kullanıcı Adı Doğrulama Standartları
// GitHub benzeri profesyonel kurallar
// ═══════════════════════════════════════════════════════════════

export const USERNAME_RULES = {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    // Sadece küçük harf (a-z), rakam (0-9) ve alt çizgi (_)
    ALLOWED_CHARS: /^[a-z0-9_]+$/,
    // Harf ile başlamalı
    STARTS_WITH_LETTER: /^[a-z]/,
    // Alt çizgi ile bitmemeli
    ENDS_WITH_UNDERSCORE: /_$/,
    // Ardışık alt çizgi olmamalı
    CONSECUTIVE_UNDERSCORES: /__/,
    // Sadece rakamlardan oluşmamalı
    ONLY_NUMBERS: /^[0-9]+$/,
} as const;

// Yasaklı / ayrılmış kullanıcı adları
const RESERVED_USERNAMES = new Set([
    // Platform sayfaları
    "admin", "administrator", "mod", "moderator", "moderatör",
    "root", "system", "sistem", "bot", "otosoz", "oto_soz",
    "support", "destek", "yardim", "help", "info", "bilgi",
    "api", "www", "mail", "email", "ftp", "ssh", "test",
    "demo", "null", "undefined", "true", "false",
    // Platform rotaları
    "forum", "pazar", "kutuphane", "sozluk", "anket", "ajanda",
    "haberler", "profil", "ayarlar", "mesajlar", "giris", "kayit",
    "cikis", "arac", "obd", "makale", "etkinlikler", "premium",
    "uzmana_sor", "arac_dna", "karsilastirma", "piyasalar",
    "gosterge", "gosterge_paneli", "yakit_hesaplama", "para_kazan",
    "hakkimizda", "iletisim", "gizlilik", "kullanim",
    // Uygunsuz / ofansif kelimeler
    "fuck", "shit", "ass", "dick", "porn", "sex", "nazi",
    "bok", "sik", "got", "amk", "orospu", "piç", "pic",
    "yarak", "yarrak", "meme", "kaltak", "fahise",
    "hacker", "hack", "exploit", "spam", "scam",
]);

export interface UsernameValidationResult {
    isValid: boolean;
    errors: string[];
    /** Kullanıcıya gösterilecek tek satırlık mesaj */
    message: string;
    /** Renk kodu: "error" | "warning" | "success" | "idle" */
    severity: "error" | "warning" | "success" | "idle";
}

/**
 * Kullanıcı adını tüm kurallara göre doğrular.
 * Her tuş vuruşunda çağrılabilir (lightweight).
 */
export function validateUsername(raw: string): UsernameValidationResult {
    const username = raw.trim().toLowerCase();
    const errors: string[] = [];

    // ─── Boş kontrol ───
    if (username.length === 0) {
        return {
            isValid: false,
            errors: [],
            message: `${USERNAME_RULES.MIN_LENGTH}-${USERNAME_RULES.MAX_LENGTH} karakter, harf ile başlamalı`,
            severity: "idle",
        };
    }

    // ─── Minimum uzunluk ───
    if (username.length < USERNAME_RULES.MIN_LENGTH) {
        errors.push(`En az ${USERNAME_RULES.MIN_LENGTH} karakter olmalı`);
    }

    // ─── Maksimum uzunluk ───
    if (username.length > USERNAME_RULES.MAX_LENGTH) {
        errors.push(`En fazla ${USERNAME_RULES.MAX_LENGTH} karakter olabilir`);
    }

    // ─── Geçersiz karakter kontrolü ───
    if (!USERNAME_RULES.ALLOWED_CHARS.test(username)) {
        errors.push("Sadece küçük harf (a-z), rakam (0-9) ve alt çizgi (_) kullanılabilir");
    }

    // ─── Harf ile başlamalı ───
    if (username.length > 0 && !USERNAME_RULES.STARTS_WITH_LETTER.test(username)) {
        errors.push("Harf ile başlamalı");
    }

    // ─── Alt çizgi ile bitmemeli ───
    if (USERNAME_RULES.ENDS_WITH_UNDERSCORE.test(username)) {
        errors.push("Alt çizgi (_) ile bitemez");
    }

    // ─── Ardışık alt çizgi ───
    if (USERNAME_RULES.CONSECUTIVE_UNDERSCORES.test(username)) {
        errors.push("Ardışık alt çizgi (__) kullanılamaz");
    }

    // ─── Sadece rakam ───
    if (USERNAME_RULES.ONLY_NUMBERS.test(username)) {
        errors.push("Sadece rakamlardan oluşamaz");
    }

    // ─── Yasaklı kullanıcı adları ───
    if (RESERVED_USERNAMES.has(username)) {
        errors.push("Bu kullanıcı adı ayrılmış ve kullanılamaz");
    }

    // ─── Kısmen yasaklı pattern kontrolü (admin123 gibi) ───
    const partialBanPatterns = ["admin", "moderator", "otosoz", "support", "system"];
    for (const pattern of partialBanPatterns) {
        if (username.includes(pattern) && username !== pattern) {
            errors.push(`"${pattern}" içeren kullanıcı adları kullanılamaz`);
            break;
        }
    }

    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            message: errors[0], // İlk hatayı göster
            severity: "error",
        };
    }

    return {
        isValid: true,
        errors: [],
        message: "",
        severity: "success",
    };
}

/**
 * Girilen değeri sanitize eder — kullanıcı adı kurallarına uygun hale getirir.
 * Input onChange'de kullanılır, sadece izinli karakterleri bırakır ve max uzunluğu keser.
 */
export function sanitizeUsername(raw: string): string {
    return raw
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, USERNAME_RULES.MAX_LENGTH);
}

/**
 * Kullanıcı adı kural özetini döner — form altında tooltip/helper olarak gösterilir.
 */
export function getUsernameRulesText(): string[] {
    return [
        `${USERNAME_RULES.MIN_LENGTH}–${USERNAME_RULES.MAX_LENGTH} karakter uzunluğunda`,
        "Sadece küçük harf (a-z), rakam (0-9) ve alt çizgi (_)",
        "Harf ile başlamalı",
        "Alt çizgi ile bitmemeli",
        "Ardışık alt çizgi (__) kullanılamaz",
        "Sadece rakamlardan oluşamaz",
    ];
}
