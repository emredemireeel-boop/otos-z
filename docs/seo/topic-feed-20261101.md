# Tek başlık akışı ve ortak projeler

Bu değişiklik, aynı günkü `community-home-20261101.md` tasarımını günceller: Anket ve Uzmana Sor için ayrı liste, sekme veya menü bağlantısı yoktur. Başlıklar normal konu kategorileri altında birlikte gösterilir. “Anket” ve “Uzmana Sor” başlığın tür etiketidir; “Genel” veya “Teknik & Arıza” kategorisinden ayrıdır.

Mevcut 13 forum kaydı ve 2 Firestore anketi taşınmadı veya yeniden oluşturulmadı; oylar ve kimlikler korunur. Ortak liste bu iki veri kaynağını birleştirir. Anket başlığı aynı akışta oylamayı açar; eski anket adresi aynı başlık çapasına gider. Gerçek forum konuları kendi canonical adresinde açılır. Yeni uzman sorusu bir forum başlığıdır ve `type: expert` bilgisi kategori alanından ayrı saklanır. Eski “Uzmana Sor” kategorisi de geriye uyumlu tanınır. Ücretsiz forum / pasif “Premium — Yakında” seçimi, soru oluşturma akışında korunur.

`/anket` ve `/uzmana-sor` doğrudan HTTP 308 ile `/` adresine gider. Kapalı Araç DNA ana girişi de artık 404'tür; başka projeye otomatik atlama yapılmaz. Kütüphane, haberler ve DNA kaynakları saklıdır. Diğer sitelerin tanıtımı Hakkımızda'daki `#projelerimiz` bölümüne taşınmıştır. Yayın anahtarları tekrar açılırsa DNA menüsü kendi site içi adresiyle geri gelebilir; dış siteye yedek menü bağlantısı yoktur.

## Üç site için SEO kararı

- OtoSöz: topluluk, kullanıcı deneyimleri ve sorular.
- OtoKusur: model/motor ve kronik sorun araştırması.
- OBDKodu: arıza kodları ve kontrol rehberleri; doğrulanan nihai alan adı `https://www.obdkodu.com/`.

Ortak sorumlu, kullanıcının verdiği gerçek bilgiye dayanarak Emre Demirel olarak açıklanır. Şirket, mesleki unvan veya ayrı kişiler uydurulmaz. Hakkımızda'da her proje bir kez, kendi amacı açıklanarak bağlanır. Bağlantılar normal taranabilir bağlantılardır. Bu bir reklam anlaşması veya sıralama amacıyla otomatik karşılıklı bağlantı ağı değildir. Her site kendi canonical'ını ve özgün içeriğini korur; farklı içerikler diğer alan adına canonical yapılmaz ve topluca yönlendirilmez. Diğer iki projenin deposu bu değişiklikte düzenlenmez.

Karar, Google'ın [bağlamlı dış bağlantı rehberine](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [bağlantı spam politikalarına](https://developers.google.com/search/docs/essentials/spam-policies#link-spam) ve [canonical rehberine](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) dayanır. Ortak sahiplik tek başına sıralama artışı vaadi değildir.

Doğrulama çıktıları `topic-feed-20261101/`, sonuç raporu `step12-20261101.json` altındadır. Üretim verisine test oyu veya soru eklenmez. Önceki sürüm, veri silmeden geri dönüş için tutulur.
