const fs = require('fs');

const filePath = 'public/data/library_guides.json';
const fileContents = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(fileContents);

const guideIndex = data.guides.findIndex(g => g.id === 'guide_acemi_surucu_bolum_2');

if (guideIndex === -1) {
    console.error('Guide not found');
    process.exit(1);
}

const updatedGuide = {
  "id": "guide_acemi_surucu_bolum_2",
  "urlId": 10038,
  "title": "Yeni Başlayanlar İçin Sürüş Psikolojisi ve İleri Seviye Taktikler: Acemi Sürücü Rehberi (Bölüm 2)",
  "description": "Otoban katılım şeridinde yaşanan o ölümcül panik anı, yağmurlu havada aracın su üstünde kızaklaması (aquaplaning) ve gece sürüşünde göz alan farlar... Acemilikten ustalığa geçişin psikolojik eşiklerini atlamaya hazır mısınız?",
  "minutes": 25,
  "difficulty": "Başlangıç/Orta",
  "tags": [
    "Sürüş",
    "Acemi",
    "Psikoloji",
    "Güvenlik",
    "Rehber",
    "Otoban",
    "Gece Sürüşü",
    "Yağmur"
  ],
  "author": "OtoSöz Sürüş Eğitmeni",
  "sections": [
    {
      "type": "intro",
      "title": "Fiziksel Yetenek Değil, Zihinsel Hakimiyet",
      "content": "Bölüm 1'de trafikte nasıl hayatta kalacağımızı ve defansif sürüşün temel kurallarını (hedefe kilitlenmemek, kör noktalar, fren psikolojisi) işlemiştik. Artık aracı bir noktadan diğerine götürebiliyorsunuz. Ancak asıl ustalık, aracı fiziksel olarak kullanmak değil, **zorlu koşullar altında kendi zihninizi yönetebilmektir.**\n\nAcemi sürücülerin en büyük yanılgısı, iyi araç kullanmanın sadece kusursuz reflekslerden ibaret olduğunu düşünmektir. Oysa trafiğin %80'i psikolojidir. Yokuşta araba kaydığı için kornaya basan bir taksiciye sinirlenip debriyajı aniden bırakmak refleks eksikliği değil, zihinsel bir yenilgidir. Bu ikinci bölümde; otoban hızlarına çıkmayı, doğa koşullarına kafa tutmamayı ve sadece araca değil, kendi stresinize nasıl hükmedeceğinizi derinlemesine öğreneceğiz."
    },
    {
      "type": "section",
      "title": "1. Yokuş Kalkış Fobisine Son: El Freni Utanç Verici Değildir!",
      "content": "Manuel vitesli (veya eski nesil yarı otomatik) araçlarda en büyük korku yokuşta kalkmaktır. Trafik ışığı kırmızı yanmaktadır, arkanızdaki araç tamponunuza sıfır yanaşmıştır ve ışık yeşile döndüğünde o meşhur stres başlar: \"Ya arkaya kaydırırsam?\"",
      "subsections": [
        {
          "subtitle": "Korkunun Maliyeti: Kavrama (Baskı Balata) Yakmak",
          "text": "Arkaya kaydırma korkusu yüzünden gereksiz yere gaza sonuna kadar yüklenip, debriyajı tam bırakmadan aracı bağırtarak kaldırmak her aceminin yaşadığı bir süreçtir. Bu hareket, debriyaj balatasını (kavramayı) adeta bir zımpara kağıdı gibi eritir.",
          "points": [
            "**El Frenini Kullanın:** Eğer yokuş kalkış desteğiniz (Hill Holder) yoksa, el frenini kullanmaktan asla utanmayın! Bu \"acemilik\" değil, tam tersine aracı koruyan bir mühendislik kullanımıdır.",
            "**Titreme Noktası (Kavrama):** Debriyajı yavaşça kaldırıp arabanın burnunun hafifçe havaya kalktığı ve direksiyonda titremeyi hissettiğiniz o sihirli noktayı (kavrama noktası) bulduğunuzda ayaklarınızı sabitleyin.",
            "**Yumuşak Bırakış:** Motorun gücü tekerleklere iletildiği o an (titreme anı), el freni mandalına basarak yavaşça indirin ve çok hafif gaz verin. Aracınız arkaya bir milimetre bile kaymadan, sıfır stresle kalkacaktır.",
            "**Ego vs Cüzdan:** Usta şoförler el freni kullanmaz diye bir kural yoktur. Sanayide binlerce lira verip debriyaj balatası değiştirmek, trafikte el freniyle kalkmaktan çok daha utanç verici ve masraflıdır."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "2. Otoban Katılım Şeridinde Ölüm Kalım Savaşı",
      "content": "Şehir içi trafiğinden çıktınız ve otoyola/çevre yoluna bağlanacaksınız. Virajı döndünüz ve karşınızda 100-120 km/s hızla vızır vızır akan, devasa kamyonların ve hızlı araçların olduğu ana yol belirdi. Katılım şeridindesiniz ve şerit bitiyor!",
      "subsections": [
        {
          "subtitle": "Hızlanma Şeridinde Durmak İntihardır",
          "text": "Otobana bağlanırken yapılan en büyük ve en ölümcül hata, yan aynaya bakıp korkarak yavaşlamak ve hatta katılım şeridinin sonunda **durarak** ana yola girmeye çalışmaktır. Otoyola 10 km/s hızla sıfırdan girmek, arkanızdan 120 km/s hızla gelen bir otobüs için sizin aniden duvara dönüşmeniz demektir.",
          "points": [
            "**Katılım Şeridinin Amacı:** Adı üstünde, \"Hızlanma (İvmelenme) Şeridi\". Bu şeridin tek amacı, ana yoldaki araçların hızına (örneğin 90-100 km/s) ulaşmanız için size verilen bir pist olmasıdır.",
            "**Ayna ve Gaz Uyumu:** Virajı döndükten sonra ana yolu sol aynanızdan tarayın. Kendinize girmek için bir boşluk seçin ve **korkmadan gaza basın.** Akan trafiğin hızına ulaşın.",
            "**Fermuar Sistemi:** Araçlar akan trafikte aralarına girmek isteyen hızlanmış bir araca mutlaka (fermuar gibi) yol verecek bir boşluk bırakır. Yeter ki onlarla aynı hızda olun.",
            "**Asla Aniden Durmayın:** Eğer gerçekten girecek hiçbir boşluk bulamadıysanız bile aniden fren yapmayın, şeridin en sonuna (emniyet şeridine doğru) yavaşça süzülün."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "3. Yağmur Sürüşü ve Aquaplaning (Kızaklama) Kâbusu",
      "content": "Güneşli günlerde harika araç kullanıyorsunuz. Ancak yağmur damlaları cama ilk düştüğünde, altınızdaki makinenin fiziği ve zeminle olan ilişkisi tamamen değişir.",
      "subsections": [
        {
          "subtitle": "İlk 15 Dakika Tuzağı",
          "text": "Yağmur yeni çiselemeye başladığında, aylardır asfaltta biriken motor yağı, egzoz kurumları ve tozlar suyla birleşip yolu adeta bir buz pistine çevirir. Yağmurun ilk 15 dakikası, sağanak yağıştan çok daha kaygan ve tehlikelidir.",
          "points": [
            "**Hızınızı %30 Düşürün:** Yağmur başladığı an, hız tabelasında 80 yazsa bile hızınızı derhal 50-60 seviyelerine çekin. Lastiklerin tutunma katsayısı dramatik şekilde düşmüştür.",
            "**Aquaplaning (Su Üstünde Kayma):** Şiddetli yağmurda yoldaki su birikintilerine hızlı (örneğin 80 km/s üzeri) girerseniz, lastiğinizin kanalları suyu tahliye edemez. Aracınız asfalttan kopar ve tamamen suyun üzerinde sörf yapmaya başlar. Direksiyon hissi tamamen kaybolur (pamuk gibi olur).",
            "**Aquaplaning Anında Ne Yapmalı?** Direksiyon bir anda boşa çıktığında asla panik yapıp frene asılmayın! Frene basarsanız araç kilitlenir ve asfalta değdiği an takla atarsınız. Direksiyonu sağa sola kırmayın, **düz tutun**, ayağınızı gazdan yavaşça çekin ve lastiklerin suyu yararak asfalta tekrar temas etmesini bekleyin."
          ]
        }
      ],
      "warning": {
        "title": "⚠️ Lastik Derinliği Hayat Çizginizdir",
        "text": "Aquaplaning olayını engelleyen tek şey lastiğinizin diş derinliğidir. Kabak (aşınmış) lastiklerle yağmura yakalanmak, pimi çekilmiş bir bombanın üstünde oturmaktır."
      }
    },
    {
      "type": "section",
      "title": "4. Gece Sürüşü ve Kör Eden Farlar",
      "content": "Gündüz sürüşünde gözleriniz etrafı %100 kapasiteyle algılar. Ancak gece, sadece farlarınızın aydınlattığı o dar koninin içine hapsolursunuz. Karşıdan gelen, uzun farlarını yakmış bir araç sizi saniyelerce kör edebilir.",
      "subsections": [
        {
          "subtitle": "Işığa Bakma, Çizgiye Bak",
          "text": "Gece karşınıza uzun farlarını kısmayan, sonradan takılma kaçak LED farlı veya far ayarı bozuk bir araç çıktığında gözleriniz istemsizce o parlak ışığa çekilir.",
          "points": [
            "**Hedefe Kilitlenmeyin:** Işığa bakarsanız göz bebekleriniz küçülür ve araç geçtikten sonra 5-6 saniye boyunca yolda hiçbir şey (örneğin siyah giyimli bir yaya) göremezsiniz.",
            "**Referans Noktanız Çizgiler Olsun:** Karşıdan kör edici bir ışık geldiğinde, gözlerinizi hafifçe kısın ve bakışınızı yolun sağ tarafındaki beyaz şerit çizgisine (veya banket çizgisine) kilitleyin. Araç geçene kadar o beyaz çizgiyi takip ederek kendi şeridinizde güvenle kalın.",
            "**İç Dikiz Aynası Karartması:** Arkanızdan uzun farlarla gelen biri varsa, iç dikiz aynanızın altındaki küçük mandalı kendinize doğru çekin (veya aracınız otomatik karartmalıysa şanslısınız). Böylece aynadan yansıyan ışık gözünüzü almaz."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "5. Park Ederken Müziğin Sesini Kısmak (Bilişsel Yük)",
      "content": "Yoğun bir trafiğin ardından evinize geldiniz, radyoda en sevdiğiniz, hareketli bir şarkı çalıyor. Aracınızı dar ve zorlu bir yere paralel park edeceksiniz. Tam o an eliniz istemsizce teybin ses düğmesine gidiyor ve sesi kısıyorsunuz. Neden?",
      "subsections": [
        {
          "subtitle": "Kapasite Meselesi: Beyin ve İşlem Gücü",
          "text": "Geri geri park ederken teybin sesini kısma ihtiyacı komik bir alışkanlık değil, tamamen nörolojik ve bilimsel bir gerçektir.",
          "points": [
            "**Bilişsel Aşırı Yükleme:** İnsan beyninin aynı anda işleyebileceği veri miktarı sınırlıdır. Park etme eylemi, ayna kontrolü, mesafe algısı, direksiyon açısı ve pedalların milimetrik kullanımı gibi devasa bir görsel/motor işlem gücü gerektirir.",
            "**Dikkati Geri Kazanmak:** Yüksek sesli müzik, yanınızdaki kişinin konuşması veya telefonda çalmakta olan zil sesi, beynin sınırlı işlem gücünden çalan \"işitsel gürültülerdir\". Ses kısıldığında beyin tüm donanım kaynaklarını görsel işlemeye ve mekansal farkındalığa aktarır.",
            "**Utanmayın, Kapatın:** Zor bir manevra yapacağınız zaman (dar bir sokağa girmek, karmaşık bir kavşaktan geçmek veya park etmek) radyoyu tamamen kapatmaktan veya yanınızdakilere \"bir saniye susun\" demekten asla çekinmeyin."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "6. Direksiyon Tutuşu: 9 Çeyrek Efsanesi Gerçek Mi?",
      "content": "Eski filmlerde şoförler direksiyonu tek elle en tepeden tutar. Bazıları direksiyonu en alttan tutarak kucaklar. Peki acil bir panik manevrası yapmanız gerektiğinde o tek el sizi kurtarabilir mi?",
      "subsections": [
        {
          "subtitle": "Hava Yastığı ve 9-3 Pozisyonu",
          "text": "Direksiyonu doğru tutmak havalı görünmek için değil, kaza anında kollarınızın kırılmaması ve araca tam hükmetmeniz içindir.",
          "points": [
            "**9-3 vs 10-2:** Eskiden öğretilen 10'u 10 geçe (10-2) pozisyonu, hava yastıklarının yaygınlaşmasıyla tarih oldu. Çünkü kaza anında açılan hava yastığı 300 km/s hızla patlar; elleriniz direksiyonun üst kısımlarındaysa (10-2), kollarınız şiddetle suratınıza çarpar ve burnunuzu kırar.",
            "**Doğru Tutuş:** Direksiyon saat kadranı gibi düşünüldüğünde, sol el tam 9'da, sağ el tam 3'te olmalıdır. (9 çeyrek pozisyonu).",
            "**Avantajı:** Bu pozisyon hem kolların yorulmasını engeller hem de ellerinizi hiç kaldırmadan direksiyonu her iki yöne de tam 180 derece (yarım tur) anında çevirip engelden kaçabilmenizi (geyik testi manevrası) sağlar. Tek el tepedeyken aracı hızlıca toparlamanız fiziken imkansızdır."
          ]
        }
      ]
    },
    {
      "type": "conclusion",
      "title": "Sonuç: Deneyim, Güvenle Atlatılan Hataların Toplamıdır",
      "content": "Kimse anasının karnından ralli pilotu olarak doğmaz. Yanlış şeride girip yolu uzatabilirsiniz, trafik ışıklarında heyecandan aracı stop ettirebilirsiniz, paralel parkı üç seferde yapamayabilirsiniz. Sırf aracı stop ettirdiniz diye arkanızdaki korna korosunun çalması dünyanın sonu değildir.\n\nBunların hiçbiri sizi kötü bir sürücü yapmaz. Asıl kötü sürücü, hata yaptığında sinirlenip etrafındakilere tehlikeli hamleler yapan, egosuna yenik düşen veya aracı kontrol edebildiğini sanıp kuralları çiğneyen kişidir. \n\nBir hata yaptığınızda veya paniklediğinizde derin bir nefes alın, sağ sinyalinizi verin, gerekirse sağa çekip 5 dakika soluklanın. Yollar kimseye ispat yapacağınız bir yarış pisti değil; herkesin, tıpkı sizin gibi sevdiklerine ulaşmak istediği ortak bir alandır. Trafik bilinciyle ve zihinsel hakimiyetle güvenli sürüşler dileriz.",
      "finalChecklist": [
        "Yokuş kalkışlarında el freni desteği kullanmaktan utanma psikolojisi aşıldı mı?",
        "Otoban girişlerinde duraklamadan, cesurca trafiğin hızına çıkılarak ivmelenme sağlanıyor mu?",
        "İlk yağmur damlalarında hız %30 oranında düşürülüyor mu?",
        "Aquaplaning (kızaklama) anında frene DOKUNMAMAK gerektiği idrak edildi mi?",
        "Gece karşıdan gelen far ışığına bakmak yerine sağ şerit çizgisi referans alınıyor mu?",
        "Zorlu manevralarda (park vb.) radyo sesi kısılarak beynin bilişsel yükü hafifletiliyor mu?"
      ]
    }
  ]
};

data.guides[guideIndex] = updatedGuide;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Update successful');
