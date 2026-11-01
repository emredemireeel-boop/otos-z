# OtoSöz: tek topluluk ana sayfası

1 Kasım 2026: Forum, Anket ve Uzmana Sor ayrı liste ekranlarından ana sayfaya taşındı. Gerçek `/forum/slug--id` başlıkları, içerikleri ve canonical adresleri korundu.

- `/forum` → HTTP 308 `/`; `/anket` → 308 `/#anket`; `/uzmana-sor` → 308 `/#uzmana-sor`.
- Bilinen kategori merkezleri tek adımda ana sayfadaki kategori seçimine gider. Geçersiz sayfalama 404 kalır.
- Gerçek eski anket adresleri, varlık kontrolünden sonra `/#anket-{id}` bölümüne gider. Oylama ana sayfada yapılır; örnek ve olmayan kayıtlar 404 döner.
- Uzmana Sor önce “Foruma Sor” ve “Profesyonel Destek Al” seçimini gösterir. Ücretsiz seçenek normal forum sorusu oluşturur. Premium yalnızca pasif “Yakında” kartıdır; ücret veya özel hizmet talebi alınmaz.
- 10 hazır anketin uydurma oyları ve 3 örnek uzman sorusu kaynak dizilerinden kaldırıldı. Firestore'da silme, sıfırlama veya örnek kayıt ekleme yapılmadı. Gerçek 2 anket ve 13 forum başlığı korunur.
- Oy yazımı transaction kullanır; güncelleme başarılı olmadan oy sayısı değiştirilmez. Anonim ziyaretçi oy vermek için giriş yapar. Sunucudan tarayıcıya seçmen kimlikleri gönderilmez.
- Ana sayfadaki karar rehberi ve düz keşif listesi kaldırıldı. Geçmiş tarihli sabit etkinlik kartı kaldırıldı. Üst menü 6 bağlantıya indirildi; diğer açık ekranlar footer'dan keşfedilir.

Araç DNA, kütüphane ve haberlerin kapatılmasına ilişkin geri getirme yöntemi `section-pause-20261101.md` içindedir. Kaynakları `.paused.tsx`/`.paused.ts` olarak korunur. Forumun eski liste ekranları da `.paused.tsx` olarak saklanır; yeni ana sayfa akışını geri almak bu değişikliğin ayrı commit'ini geri almayı gerektirir. Örnek verilerin yeniden yayımlanması önerilmez.

SEO kapısı; durum kodları, sitemap/canonical/robots, JSON-LD, metadata tekrarları, iç linkler, ilk HTML stilleri ve yayın durumunu birlikte denetler. Bir alt kontrol başarısızsa dağıtım durur. Önizleme portu doluysa dağıtım farklı bir build'i yanlışlıkla doğrulamamak için de durur. Yayına geçiş yalnızca PM2 `otosoz` uygulamasını etkiler; önceki build geri dönüş için tutulur.

Doğrulama çıktıları ve canlı dağıtım bilgileri `community-20261101/` klasöründe ve `step11-20261101.json` raporundadır. Giriş gerektiren gerçek oy/soru gönderimleri, kullanıcı verisine test kaydı eklememek için tarayıcı kontrolünde gönderilmez. GSC API erişimi ve alan adı dışındaki güvenlik/önbellek ayarları bu değişiklikle açılmaz veya değiştirilmez.
