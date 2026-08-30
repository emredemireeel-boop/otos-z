/**
 * Moderatör yetki anahtarları.
 *
 * Hesaplar ve kimlik bilgileri yalnızca Firebase Auth/Firestore üzerinden
 * yönetilir. Kaynak kodda kullanıcı adı, parola veya örnek hesap tutulmaz.
 */
export type ModPermission =
    | "rapor_kuyruğu"
    | "kullanici_yonetim"
    | "icerik_moderasyon"
    | "pazar_kontrol"
    | "guvenmetre"
    | "duyuru"
    | "kelime_filtresi"
    | "loglar"
    | "rozet_atama"
    | "toplu_yayin";
