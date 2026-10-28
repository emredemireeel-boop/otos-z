# İndeks kalite kapısı

Kararlar `lib/indexability.ts` içindeki saf fonksiyonlardan gelir. Sitemap'in son
filtresi `lib/seo-index-catalog.ts`, metadata ve öne çıkarılan iç bağlantılar aynı
fonksiyonları kullanır. Bilinmeyen içerik ve destek şablonları varsayılan olarak
noindex,follow alır. Bir kaydın noindex olması HTTP 404 anlamına gelmez.

29 Ekim ölçümünde önceki yerel sitemap'teki 2.315 URL'den 689'u korundu.
Önce gösterilen 691 tahmininden kişisel ajanda ve gösterge kategorisi de çıkarıldı.
Ön ölçüm `quality-audit-20261029.json`, uygulanan kuralların ölçümü
`quality-audit-applied-20261029.json` dosyasındadır. Katalog kayıt sayıları ile URL
sayıları farklıdır: marka, model, motor ve sekmeler ayrı URL olabilir.

## Eşiklerin gerekçesi

- OBD: kaynaklı/editoryal 5 kayıt korundu. Kaynaksız generic kayıtlar için 300
  görünür karakter, en az üç kod özelinde neden ve üç kontrol, %50'nin altında
  altı kelimelik Jaccard benzerliği aranır. Aynı öneri en fazla üç kodda geçiyorsa
  kod özelinde sayılır. Mevcut kaynaksız veride bütün koşulları sağlayan kayıt yok.
- Model: mevcut editoryal katalog seçimi ve dolu sorun/avantaj verisi gerekir.
  Bu seçim yeni bir uzman onayı veya kaynak doğrulaması iddiası değildir.
  Kronik sorun sekmesi en az üç açıklamalı madde; güçlü/zayıf yönler ikişer madde;
  deneyimler yazarı bulunan iki adet 100 karakterlik metin; paketler iki kayıt ister.
- Motor: en az iki benzersiz sorun veya iki benzersiz artı/eksi maddesi gerekir.
  Benzersiz madde diğer motorlarda tekrarlanmamalı ve modelden kopyalanmamalıdır.
  Kronik ve artı/eksi sekmeleri kendi ölçümlerinden geçer. Zayıf motorlar 200 +
  noindex,follow ve modele canonical ile korunur. Uzun motor son eki değiştirilmedi;
  bu adımda URL taşımasının ek faydası sınırlı, geçiş riski gereksiz bulundu.
- Sözlük: 250 görünür karakter ve %85'in altında benzerlik gerekir. 186 canonical
  tanımın hiçbiri uzunluk eşiğine ulaşmıyor; arama yoluyla erişilebilirler.
- Makale: 600 görünür karakter, diğer rehberler 300 karakter ve %85 benzerlik
  sınırı kullanır. %93,3 benzer muayene makalelerinde daha uzun mevcut metin
  temsilci seçildi. Kullanıcı diğer URL için yalnızca noindex istedi; yönlendirme yok.
- Forum: mevcut görünür içerik/spam kuralları taşındı; 200 karakter eşiği ve kategori
  için beş görünür başlık koşulu korunur. Veri tabanına içerik eklenmedi.

Benzerlik ölçümü teknik iddiaların doğruluğunu kanıtlamaz. Performans CSV'sindeki
236 tıklamalı OBD adresi editoryal inceleme kuyruğundadır; trafik geçmişi kaynak
koşulunu kaldırmaz. Geçerli kayıtların erişimi korunur. Veri setinde zaten olmayan
eski kodlar yeni içerik üretilerek doldurulmaz. Farklı OBD kodları aynı açıklamayı
taşısa da farklı kimliklerdir; bu yüzden toplu 308/404 önerilmedi. Uygulanan yeni
404/410/308 yoktur.

## Veri değiştiğinde

Ölçümler `data/seo-quality/` altında kaynak hash'leriyle saklanır. Kod, içerik veya
eşik değişikliğinde audit'i tekrar çalıştırın; eksik metni otomatik üretmeyin.

```powershell
node scripts/seo-quality-audit.mjs docs/seo/quality-audit-applied-20261029.json --applied --write-signals --check-signals
node --test tests/indexability.test.mjs tests/forum-index-policy.test.mjs tests/forum-pagination.test.mjs
npx tsc --noEmit
npm run build
npm start
```

Ayrı terminalde:

```powershell
node scripts/seo-indexability-check.mjs --base http://127.0.0.1:3000
node scripts/seo-status-check.mjs --base http://127.0.0.1:3000 --sitemap
```

Sadece ölçümlerin güncelliğini doğrulamak için `--write-signals` kullanmadan
`--check-signals` çalıştırın. Performans CSV'si yoksa kaydedilmiş ön audit'in
performans satırları kullanılır. Forum audit'i önceki adımın zaman damgalı veri
fotoğrafıdır; canlı yeni başlıklar sunucu katalog sorgusuyla değerlendirilir.

`obd-directory-codes.json` kalite allowlist'i değildir: eski 13 dizin sayfasının
200 kalması için sabit gezinme sırasını saklar. `link-candidates.json` yalnızca
uygun kodları otomatik metin bağlantıları için taşır; bağlantı oluşturulurken
kalite kapısı yine çağrılır. Kaynaksız neden/kontrol metinleri genel bilgi olarak
etiketlenir. Tahmini onarım maliyeti bölümü mevcut kaynakta bulunmuyor.

Yerel ölçüm raporları üretim sunucusuna dağıtım yapıldığını göstermez. Dağıtım
sonrasında aynı kontroller canlı tabanla tekrarlanmalıdır.
