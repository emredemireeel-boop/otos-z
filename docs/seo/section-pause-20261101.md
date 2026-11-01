# Forum odaklı yayın düzeni — 01.11.2026

Araç DNA, OtoKütüphane (makale arşivi dahil) ve Haberler yayından kaldırıldı. Veri silinmedi. Bu işlem kalıcı içerik silme veya alan adı taşıması değildir.

- 42 Next route kaynağı `page.paused.tsx`, `layout.paused.tsx`, `route.paused.ts` gibi dosyalara taşındı. Next bu dosyaları sayfa olarak derlemez. Ortak hesaplayıcı bileşenleri çalışmaya devam eder.
- `data/site-sections.json`, navigasyon, HTTP kapısı, metadata ve sitemap için ortak yayın ayarıdır.
- Menüde Araç DNA yerine doğrudan `https://otokusur.com/` bağlantısı bulunur. `/arac-dna` giriş adresi HTTP 307 ile aynı adrese gider. Geri dönüş istendiği için kalıcı 308 kullanılmadı.
- DNA detayları, kütüphane/makale ve haber adresleri gerçek HTTP 404 döndürür. Bilinmeyen model adresleri başka sitenin ana sayfasına topluca yönlendirilmez.
- Kaldırılan bölümler sitemap'te, ana sayfa tanıtımlarında, yan kartlarda, alt menüde veya llms.txt keşif listesinde bulunmaz. Robots.txt ile 404 yanıtlarını taramaktan kaçırmıyoruz.
- Haber sitemap'i ve bölümlerin doğrudan veri/API girişleri de kapalıdır. Yönetim verileri ve Firestore kayıtları silinmedi.
- Bağımsız OBD, forum, oto pazarı, hesaplayıcı ve trafik cezası sayfaları korunur. Gösterge/Nasıl Yapılır gibi açık kalan bağımsız rehberler `sitemaps/rehberler.xml` altında bildirilir.
- Trafik Cezaları artık gizlenen kütüphane portalını yüklemez. Görünür breadcrumb ile JSON-LD aynı açık URL'leri kullanır.

## Geri getirme

Yalnız istenen bölüm için:

```powershell
node scripts/site-sections.mjs restore vehicleDna
node scripts/site-sections.mjs restore library
node scripts/site-sections.mjs restore news
```

Hepsini geri getirmek için `node scripts/site-sections.mjs restore all` kullanılır. Komut hem dosya adlarını hem yayın ayarını geri alır. Ardından `npx tsc --noEmit`, `npm run build`, `npm run seo:check` ve doğrulanmış yayın akışı gerekir. Eski kalıcı yönlendirme tanımları kaynakta korundu; bölüm açıldığında tekrar etkinleşir. llms.txt tanıtım metni editoryal olarak yeniden eklenmelidir. Forum odaklı ana sayfa başlığı ve bağımsız trafik cezası dizini kendiliğinden eski portal görünümüne dönmez.

## Regresyon koruması

- Build öncesinde `scripts/site-sections-check.mjs`, kapalı bölümde yeniden etkin route dosyası oluşursa build'i durdurur.
- `seo:check`, mevcut altı aşamaya ek olarak yayın kapısı HTTP testlerini çalıştırır.
- Geri yükleme ve tekrar gizleme işlemi geçici test projesinde kaynak baytları korunarak doğrulanır.

## Açık sınırlar

Google'ın eski sonuçları kaldırması yeniden tarama gerektirir; anlık silinme garantisi verilmez. Saklanan kaynaklar bir güvenlik kasası değildir; Git ve sunucu erişimi olan yöneticilerde kalır. Cloudflare güvenlik ayarları değiştirilmez. Önceki GSC API 403 ve HTTP www ek yönlendirme takibi ayrı konulardır.

Yerel tam HTML taraması diskte yer kalmadığı için tamamlanmış sayılmadı. Bu çalışmada üretilen derleme önbelleği ve test build'i E: arşivine taşındı; canlı sunucu etkilenmedi. Son doğrulama sonuçları eşlik eden JSON raporunda tutulur.
