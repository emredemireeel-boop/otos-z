/**
 * Bu araç bilinçli olarak devre dışıdır.
 * Google Indexing API normal forum, OBD, sözlük veya Araç DNA sayfalarını
 * desteklemez; yalnızca JobPosting ve VideoObject içindeki BroadcastEvent
 * sayfaları için kullanılabilir. Yeni içerik keşfi sitemap.xml, forum RSS akışı
 * ve Search Console üzerinden yürütülür.
 */
console.error('Genel URL’ler için Google Indexing API kullanımı devre dışı. sitemap.xml ve forum/feed.xml kullanılıyor.');
process.exitCode = 1;