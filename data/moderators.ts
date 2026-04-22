/**
 * Moderatör Global State
 * Tüm moderatör verilerini (kullanıcı adı, Şifre, yetkiler, durum) tutar.
 * Admin API ve Login API bu modülü import ederek paylaşımlı state kullanır.
 */

export type ModPermission =
    | "rapor_kuyruğu"       // Şikayet kuyruğunu görüp işleyebilir
    | "kullanici_yonetim"   // Kullanıcıları uyarabilir/banlayabilir
    | "icerik_moderasyon"   // Entry/başlıkları pinleyebilir/kilitleyebilir/silebilir
    | "pazar_kontrol"       // İlanları onaylayabilir/kaldırabilir
    | "guvenmetre"          // Güvenmetre taleplerini onaylayabilir/reddedebilir
    | "duyuru"              // Duyuru oluşturabilir/yayınlayabilir
    | "kelime_filtresi"     // Kelime filtresi ekleyebilir/kaldırabilir
    | "loglar"              // Sistem loglarını görüntüleyebilir
    | "rozet_atama"         // Kullanıcılara rozet atayabilir (sadece okuma değil)
    | "toplu_yayin";        // Toplu mesaj gönderebilir

export interface Moderator {
    id: string;
    username: string;
    displayName: string;
    password: string;
    email: string;
    avatar: string;
    createdAt: string;
    createdBy: string;
    status: "aktif" | "askida" | "banlandi";
    banReason?: string;
    permissions: ModPermission[];
    lastLogin?: string;
    actionCount: number; // toplam yapılan işlem sayısı
    notes: string;
}

// â”€â”€ Başlangıç moderatör listesi â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const moderatorStore: Moderator[] = [
    {
        id: "mod-001",
        username: "mod_ayse",
        displayName: "Ayşe Moderatör",
        password: "mod123",
        email: "ayse@Otosöz.com",
        avatar: "🛡️",
        createdAt: "01.03.2026",
        createdBy: "Admin",
        status: "aktif",
        permissions: ["rapor_kuyruğu", "kullanici_yonetim", "icerik_moderasyon", "pazar_kontrol", "guvenmetre"],
        lastLogin: "18.04.2026 - 11:00",
        actionCount: 142,
        notes: "Forum başlıkları ve kullanıcı yönetimi odaklı.",
    },
    {
        id: "mod-002",
        username: "mod_kemal",
        displayName: "Kemal Moderatör",
        password: "kemal456",
        email: "kemal@Otosöz.com",
        avatar: "âš¡",
        createdAt: "15.03.2026",
        createdBy: "Admin",
        status: "aktif",
        permissions: ["rapor_kuyruğu", "icerik_moderasyon", "duyuru", "kelime_filtresi"],
        lastLogin: "18.04.2026 - 09:30",
        actionCount: 87,
        notes: "İçerik kalitesi ve duyuru sorumlusu.",
    },
    {
        id: "mod-003",
        username: "mod_selin",
        displayName: "Selin Moderatör",
        password: "selin789",
        email: "selin@Otosöz.com",
        avatar: "ðŸŒŸ",
        createdAt: "01.04.2026",
        createdBy: "Admin",
        status: "askida",
        permissions: ["rapor_kuyruğu", "pazar_kontrol"],
        lastLogin: "15.04.2026 - 16:00",
        actionCount: 23,
        notes: "Pazar ilanları moderasyonu. Şu an askıda.",
    },
];

export const ALL_PERMISSIONS: { key: ModPermission; label: string; desc: string; icon: string; danger?: boolean }[] = [
    { key: "rapor_kuyruğu", label: "Şikayet Kuyruğu", desc: "Kullanıcı raporlarını görüp işleyebilir", icon: "🚩" },
    { key: "kullanici_yonetim", label: "Kullanıcı Yönetimi", desc: "Uyarı ve geçici ban uygulayabilir", icon: "👤", danger: true },
    { key: "icerik_moderasyon", label: "İçerik Moderasyonu", desc: "Entry & başlık pin/kilit/silme yetkisi", icon: "ðŸ“�" },
    { key: "pazar_kontrol", label: "Pazar Kontrolü", desc: "İlanları onaylayabilir ve kaldırabilir", icon: "🛒" },
    { key: "guvenmetre", label: "Güvenmetre Onayı", desc: "Araç doğrulama taleplerini onaylayabilir", icon: "🛡️" },
    { key: "duyuru", label: "Duyuru Yönetimi", desc: "Platform geneli duyuru oluşturabilir", icon: "📢" },
    { key: "kelime_filtresi", label: "Kelime Filtresi", desc: "Yasaklı kelime ekleyip kaldırabilir", icon: "🛡️" },
    { key: "loglar", label: "Logları Görüntüleme", desc: "Sistem ve admin loglarını okuyabilir", icon: "📋" },
    { key: "rozet_atama", label: "Rozet Atama", desc: "Kullanıcılara rozet verebilir", icon: "ðŸ�…" },
    { key: "toplu_yayin", label: "Toplu Yayın", desc: "Kullanıcılara toplu mesaj gönderebilir", icon: "📡", danger: true },
];

// Moderatörü adıyla bul (login için)
export function findModeratorByUsername(username: string): Moderator | undefined {
    return moderatorStore.find(m => m.username === username);
}
