const fs = require('fs');

const path = './public/data/news_posts.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const newNews = {
  "id": "news_4",
  "slug": "2027-f1-yaris-takvimi-aciklandi",
  "title": "Resmileşti! 2027 Formula 1 Yarış Takvimi Açıklandı: Türkiye 19 Eylül'de Sahneye Çıkıyor",
  "description": "Motor sporları dünyasının kalbinin attığı Formula 1'in 2027 yarış takvimi nihayet resmi olarak duyuruldu. 24 yarışlık dev takvimde, Türkiye'nin efsanevi İstanbul Park pisti 19 Eylül'de yarış severleri ağırlayacak.",
  "content": "<p>Uluslararası Otomobil Federasyonu (FIA) ve Formula 1 yönetimi (FOM), aylardır heyecanla beklenen <strong>2027 Sezonu Yarış Takvimini</strong> tüm dünyaya resmi olarak ilan etti. Tam 24 yarıştan oluşan ve pilotların hem fiziksel hem de zihinsel sınırlarını zorlayacak olan bu devasa maratonda, bizleri en çok heyecanlandıran detay şüphesiz <strong>Türkiye Grand Prix'sinin (İstanbul Park)</strong> takvimdeki gurur verici yeri oldu.</p>\n\n<h3>Sezon Bahreyn'de Başlayıp, Abu Dabi'de Bitiyor</h3>\n<p>Her yıl olduğu gibi sezonun açılışı ve kapanışı Orta Doğu'nun büyüleyici gece yarışlarıyla yapılıyor. 14 Mart 2027'de Bahreyn GP'si ile start alacak olan şampiyona, kıta kıta dolaştıktan sonra 5 Aralık 2027'de geleneksel kapanış noktası olan Abu Dabi'nin Yas Marina pistinde son bulacak. Takvimdeki dikkat çekici detaylardan biri, Amerika pazarındaki büyümenin devam etmesi ve Miami, Las Vegas ve Teksas (Austin) yarışlarının takvimdeki sağlam yerlerini koruması oldu.</p>\n\n<h3>Gözler 19 Eylül'de İstanbul Park'ta Olacak!</h3>\n<p>Geçtiğimiz günlerde duyurulan 5 yıllık sözleşmenin ardından, Türkiye yarışının takvimin neresinde yer alacağı büyük bir merak konusuydu. Açıklanan takvime göre <strong>Türkiye Grand Prix'si, 19 Eylül 2027 tarihinde, sezonun 16. yarışı olarak</strong> koşulacak. <br><br>Bu tarih, Avrupa'daki sonbahar serinliğinin başladığı döneme denk geliyor ki bu durum İstanbul Park'ın meşhur 8. Virajında (Turn 8) araçların aerodinamik performansını ve lastik aşınmalarını maksimize edecek harika bir hava koşulu anlamına geliyor. Türkiye yarışından hemen bir hafta sonra (26 Eylül) komşu Azerbaycan GP'sinin (Bakü) yapılacak olması da lojistik açıdan takımları oldukça rahatlatacak bir strateji olarak öne çıkıyor.</p>\n\n<h3>2027 F1 Tam Yarış Takvimi</h3>\n<p>Tarihi not edin ve izinlerinizi ayarlayın! İşte 2027 sezonunun 24 yarışlık eksiksiz takvimi:</p>\n<ul>\n<li><strong>1. Bahreyn:</strong> 14 Mart</li>\n<li><strong>2. Suudi Arabistan:</strong> 21 Mart</li>\n<li><strong>3. Avustralya:</strong> 4 Nisan</li>\n<li><strong>4. Çin:</strong> 11 Nisan</li>\n<li><strong>5. Japonya:</strong> 25 Nisan</li>\n<li><strong>6. Miami (ABD):</strong> 9 Mayıs</li>\n<li><strong>7. Kanada:</strong> 23 Mayıs</li>\n<li><strong>8. Monako:</strong> 6 Haziran</li>\n<li><strong>9. Portekiz:</strong> 21 Haziran</li>\n<li><strong>10. Avusturya:</strong> 27 Haziran</li>\n<li><strong>11. Büyük Britanya:</strong> 4 Temmuz</li>\n<li><strong>12. Belçika:</strong> 18 Temmuz</li>\n<li><strong>13. Macaristan:</strong> 25 Temmuz</li>\n<li><strong>14. İspanya:</strong> 29 Ağustos</li>\n<li><strong>15. İtalya (Monza):</strong> 5 Eylül</li>\n<li><strong style=\"color: #ef4444;\">16. TÜRKİYE (İstanbul Park): 19 Eylül</strong></li>\n<li><strong>17. Azerbaycan:</strong> 26 Eylül</li>\n<li><strong>18. Singapur:</strong> 10 Ekim</li>\n<li><strong>19. ABD (Austin):</strong> 24 Ekim</li>\n<li><strong>20. Meksika:</strong> 31 Ekim</li>\n<li><strong>21. Brezilya (Sao Paulo):</strong> 7 Kasım</li>\n<li><strong>22. Las Vegas (ABD):</strong> 20 Kasım</li>\n<li><strong>23. Katar:</strong> 28 Kasım</li>\n<li><strong>24. Abu Dabi:</strong> 5 Aralık</li>\n</ul>\n\n<h3>Biletler Ne Zaman Satışa Çıkacak?</h3>\n<p>Takvimin resmiyet kazanmasının ardından gözler bilet satışlarına çevrildi. Dünyanın dört bir yanındaki F1 fanatikleri ve Türk yarış severler için Türkiye Grand Prix'si biletlerinin 2026 yılı sonbaharında, büyük ihtimalle Kasım ayı içerisinde ön satışa sunulması bekleniyor. 19 Eylül için şimdiden planlarınızı yapmaya başlayın; motorların çığlığı çok yakında İstanbul'da yankılanacak!</p>",
  "author": "OtoSöz Motorsporları",
  "authorRole": "Editör",
  "createdAt": "2026-05-25T10:00:00Z",
  "readTime": 4,
  "views": 8420,
  "tags": ["Formula 1", "Yarış Takvimi", "İstanbul Park", "F1 2027", "Gündem"],
  "image": "/images/haberler/formula1_takvim.png",
  "isFeatured": true
};

data.posts.unshift(newNews);

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Successfully appended 2027 F1 calendar news!');
