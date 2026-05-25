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
  "description": "Sollama yaparken neden vites küçültmek zorundasınız? Tırların yanından geçerken oluşan vakum etkisi nedir? Gece far körlüğünden nasıl kurtulunur? Direksiyon başında zihinsel ustalığa giden yolda bilmeniz gereken 9 ileri seviye taktik.",
  "minutes": 35,
  "difficulty": "Başlangıç/Orta",
  "tags": [
    "Sürüş",
    "Acemi",
    "Psikoloji",
    "Güvenlik",
    "Otoban",
    "Gece Sürüşü",
    "Yağmur",
    "Sollama"
  ],
  "author": "OtoSöz Sürüş Eğitmeni",
  "sections": [
    {
      "type": "intro",
      "title": "Fiziksel Yetenek Değil, Zihinsel Hakimiyet",
      "content": "Bölüm 1'de trafikte nasıl hayatta kalacağımızı ve defansif sürüşün temel kurallarını (hedefe kilitlenmemek, kör noktalar, fren psikolojisi) işlemiştik. Artık aracı bir noktadan diğerine götürebiliyorsunuz. Ancak asıl ustalık, aracı fiziksel olarak kullanmak değil, **zorlu doğa koşulları, otoyol fizikleri ve kriz anları altında kendi zihninizi yönetebilmektir.**\n\nAcemi sürücülerin en büyük yanılgısı, iyi araç kullanmanın sadece kusursuz el-ayak koordinasyonundan ibaret olduğunu düşünmektir. Oysa trafiğin %80'i psikoloji ve fizik kurallarıdır. Yağmurlu bir otobanda arabanın kontrolünü kaybetmek veya tek şeritli yolda yapılan hatalı bir sollama, basit bir refleks eksikliği değil; fiziği okuyamama ve zihinsel yenilgidir. Bu devasa ikinci bölümde; otoban hızlarına çıkmayı, doğa koşullarına kafa tutmamayı, ağır vasıta aerodinamiğini ve sadece araca değil, yola nasıl hükmedeceğinizi 9 altın kuralla derinlemesine öğreneceğiz."
    },
    {
      "type": "section",
      "title": "1. Yokuş Kalkış Fobisi: El Freni 'Acemilik' Değil, Mühendisliktir",
      "content": "Manuel vitesli (veya eski nesil yarı otomatik) araçlarda acemilerin en büyük kabusu dik bir yokuşta kalkmaktır. Trafik ışığı kırmızı yanmaktadır, arkanızdaki araç tamponunuza sıfır yanaşmıştır. Işık yeşile döndüğünde o meşhur stres başlar: \"Ya arkaya kaydırırsam da vurursam?\"",
      "subsections": [
        {
          "subtitle": "Korkunun Maliyeti: Kavrama (Baskı Balata) Yakmak",
          "text": "Arkaya kaydırma korkusu yüzünden beyniniz paniğe girer. Ayağınızı frenden çektiğiniz o salise içinde araç geriye gitmesin diye gereksiz yere gaza sonuna kadar yüklenirsiniz, ancak debriyajı tam bırakmaya da korktuğunuz için aracı 4000 devirde bağırtarak kaldırmaya çalışırsınız. Yanık kokusu kabini doldurur.",
          "points": [
            "**El Frenini Kullanın:** Eğer yokuş kalkış desteğiniz (Hill Holder) yoksa veya bozuksa, el frenini kullanmaktan asla utanmayın! El freni sadece park etmek için değil, yokuşta aracı sabitlemek için icat edilmiştir.",
            "**Titreme Noktası (Kavrama):** Sağ ayağınızla gaza hafifçe dokunurken, sol ayağınızla debriyajı yavaşça kaldırın. Arabanın burnunun hafifçe havaya kalktığını, gitmek için öne doğru şahlandığını ve direksiyonda titremeyi hissettiğiniz o sihirli noktayı (kavrama noktası) bulduğunuzda ayaklarınızı dondurun.",
            "**Yumuşak Bırakış:** Motorun gücü tekerleklere iletildiği o an (titreme anı), artık fren yapmanıza gerek yoktur çünkü motor gücü aracı tutuyordur. El freni mandalına basarak yavaşça indirin. Aracınız arkaya bir milimetre bile kaymadan kalkacaktır.",
            "**Ego vs Cüzdan:** Usta şoförler el freni kullanmaz diye bir efsane dolaşır. Sanayide 15-20 bin lira verip kavrama seti değiştirmek, trafikte el freniyle rahatça kalkmaktan çok daha utanç vericidir."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "2. Otoban Katılım Şeridinde Ölüm Kalım Savaşı",
      "content": "Şehir içi trafiğinin yavaşlığından çıktınız ve otoyola/çevre yoluna bağlanacaksınız. Virajı döndünüz ve karşınızda 100-120 km/s hızla vızır vızır akan, devasa tırların ve hızlı SUV'ların olduğu bir otoban belirdi. Katılım (hızlanma) şeridindesiniz ve şeridin bitmesine sadece 100 metre kaldı!",
      "subsections": [
        {
          "subtitle": "Hızlanma Şeridinde Durmak İntihardır",
          "text": "Acemilerin otobana bağlanırken yaptığı en büyük ve en ölümcül hata, yan aynaya bakıp gelen trafiğin hızından korkmak, yavaşlamak ve hatta şeridin sonunda **tamamen durarak** ana yola girmeye çalışmaktır.",
          "points": [
            "**Fizik Kuralı:** Otobana 20 km/s hızla sıfırdan girmek, arkanızdan 120 km/s hızla gelen bir otobüs için sizin otoyolun ortasına atılmış beton bir duvara dönüşmeniz demektir.",
            "**Katılım Şeridinin Amacı:** Bu şeridin resmi adı \"İvmelenme (Hızlanma) Şeridi\"dir. Tek amacı, direksiyonu düzeltir düzeltmez gaza köküne kadar basıp ana yoldaki araçların hızına (örneğin 90 km/s) ulaşmanız için size verilen bir kalkış pisti olmasıdır.",
            "**Fermuar Sistemi:** Aynanızı tarayın, bir boşluk seçin ve **korkmadan gaza basın.** Araçlar, akan trafikte kendileriyle aynı hıza ulaşmış bir araca mutlaka (fermuar dişlisi gibi) yol verecek bir boşluk bırakır.",
            "**Asla Aniden Durmayın:** Eğer gerçekten girecek hiçbir boşluk bulamadıysanız bile (ki nadirdir) aniden fren yapıp durmayın; şeridin en sonuna, yani emniyet şeridine doğru aynı hızda yavaşça süzülerek paralel ilerlemeye devam edin."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "3. İki Şeritli Yollarda Sollama: \"Vites Büyültülmez, Küçültülür\"",
      "content": "Gidiş-geliş tek şeritli (toplam iki şerit) bir şehirlerarası yoldasınız. Önünüzde 70 km/s hızla giden bir kamyon var. Karşıdan gelen trafiği kontrol ettiniz, ufukta boşluk var. Gaza basıyorsunuz ama araba bir türlü hızlanmıyor! Kamyonun yanındayken karşıdan gelen araç hızla yaklaşmaya başladı. Panik!",
      "subsections": [
        {
          "subtitle": "Maksimum Tork İçin Vites Düşürme Zorunluluğu",
          "text": "Acemi sürücüler, 80 km/s hızla 5. veya 6. viteste ilerlerken sollama yapacakları zaman sadece gaz pedalına basarlar. Ancak en üst vitesler (Overdrive) aracı hızlandırmak için değil, yakıt tasarrufu yapmak için tasarlanmıştır. Bu viteslerde motorun tekerleğe iletebileceği ivme (tork) neredeyse sıfırdır.",
          "points": [
            "**Vites Küçült (Kick-Down):** Sollamaya (karşı şeride) geçmeden hemen önce debriyaja basıp vitesi 5'ten 4'e, hatta hızınıza göre 3'e çekin. (Otomatik araçlarda gaz pedalının altındaki son noktaya kadar basarsanız -kick-down- araç bunu otomatik yapar).",
            "**Motoru Bağırtmaktan Korkmayın:** Vites küçülttüğünüzde motor devri aniden 4000-5000 RPM bandına çıkar ve motor bağırır. Bu ses motorun bozulduğu anlamına gelmez; tam tersine, **\"Sana tüm gücümü (maksimum beygir/tork) veriyorum, hadi fırla!\"** demektir.",
            "**Zamanla Yarış:** Sollama, sol şeritte keyifli bir yürüyüş değildir; sollama, karşı şeridi işgal ettiğiniz ölümcül bir zamanla yarış operasyonudur. Sollama anında amaç en kısa sürede, en hızlı ivmeyle kamyonu geçip sağa dönmektir. Asla kamyonla yan yana ağır ağır gitmeyin."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "4. Tır ve Kamyonların Aerodinamik Kabusu: \"Vakum Etkisi\"",
      "content": "Otobanda kendi halinizde 110 km/s hızla gidiyorsunuz. Sağ şeritteki devasa bir Tır'ı (veya otobüsü) sollarken, Tır'ın tam ortasına geldiğiniz an arabanızın Tır'a doğru şiddetle emildiğini, onu geçer geçmez de zıt yöne savrulduğunu hissedersiniz. Kalbiniz ağzınıza gelir.",
      "subsections": [
        {
          "subtitle": "Görünmez Rüzgar Duvarı",
          "text": "Ağır vasıtalar otobanda ilerlerken önlerinde devasa bir havayı yararlar. Bu hava, Tır'ın gövdesi boyunca yüksek hızlı bir rüzgar tüneli oluşturur. Tır'ın yan yüzeyinde alçak basınç, ön ve arka kısmında ise şiddetli hava girdapları (türbülans) oluşur.",
          "points": [
            "**Emilme (Vakum) Safhası:** Tır'ın veya otobüsün gövdesinin tam yanındayken oluşan alçak basınç, hafif arabanızı vakum gibi Tır'ın dorsesine doğru çeker. Direksiyonu iki elle sıkıca tutup çok hafif ters yöne (Tır'ın zıttına) güç uygulamanız gerekir.",
            "**İtilme (Rüzgar Tokadı) Safhası:** Tır'ın burun kısmını (şoför mahallini) tam geçtiğiniz o salise, Tır'ın önünden yayılan yüksek basınçlı hava dalgası arabanıza şiddetli bir rüzgar tokadı atar ve sizi Tır'dan uzağa, sol bariyere doğru savurur.",
            "**Önlem:** Ağır vasıtaları sollarken direksiyonu asla tek elle tutmayın. 9-3 pozisyonunda sıkıca kavrayın. Tır'ın yanından geçerken hızla ivmelenin (yanında oyalanmayın) ve savrulma etkisine hazırlıklı olun."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "5. Yağmur Sürüşü ve Aquaplaning (Kızaklama) Kâbusu",
      "content": "Güneşli yaz günlerinde harika ve güvenli bir şekilde araç kullanıyorsunuz. Ancak hava bozup, yağmur damlaları cama ilk düştüğünde, altınızdaki makinenin fiziği ve zeminle olan ölümcül ilişkisi saniyeler içinde tamamen değişir.",
      "subsections": [
        {
          "subtitle": "İlk 15 Dakika Tuzağı",
          "text": "Yağmur yeni çiselemeye başladığında, aylardır asfaltta biriken motor yağı sızıntıları, egzoz kurumları ve tozlar suyla birleşip yolu adeta siyah bir sabun tabakasına (veya buz pistine) çevirir. Yağmurun ilk 15 dakikası, bardaktan boşanırcasına yağan sağanak yağıştan çok daha kaygan ve tehlikelidir.",
          "points": [
            "**Hızınızı Derhal %30 Düşürün:** Yağmur başladığı an, hız tabelasında 100 yazsa bile hızınızı derhal 70 seviyelerine çekin. Lastiklerin sürtünme katsayısı dramatik şekilde düşmüştür.",
            "**Aquaplaning (Su Üstünde Sörf Yapma):** Şiddetli yağmurda otobandaki su birikintilerine (göllenmelere) hızlı (örneğin 90 km/s üzeri) girerseniz, lastiğinizin kanalları o suyu tahliye etmeye yetişemez. Aracınız asfalttan kopar, lastikle yol arasına su girer ve araba tamamen suyun üzerinde sörf yapmaya başlar. Direksiyon hissi bir saniyede tamamen kaybolur, direksiyon pamuk gibi hafifler.",
            "**Kızaklama Anında Ne Yapmalı?** Direksiyon bir anda boşa çıktığında asla panik yapıp frene asılmayın! Frene basarsanız tekerlekler kilitlenir, suyun üstünden çıkıp tekrar asfalta değdiği an araba spin atar ve takla atarsınız. Direksiyonu sağa sola kırmayın, **dümdüz tutun**, ayağınızı gazdan yavaşça çekin ve hız düşüp lastiklerin suyu yararak asfalta tekrar temas etmesini bekleyin."
          ]
        }
      ],
      "warning": {
        "title": "⚠️ Lastik Derinliği Hayat Çizginizdir",
        "text": "Aquaplaning (kızaklama) olayını engelleyen tek şey yeteneğiniz değil, lastiğinizin diş derinliğidir. Kanalları aşınmış 'kabak' lastiklerle yağmura yakalanmak, pimi çekilmiş bir bombanın üstünde saatte 100 kilometre hızla ilerlemektir."
      }
    },
    {
      "type": "section",
      "title": "6. Gece Sürüşü ve Kör Eden Farlar",
      "content": "Gündüz sürüşünde gözleriniz etrafı %100 kapasiteyle algılar, ufku görebilirsiniz. Ancak gece, sadece aracınızın farlarının aydınlattığı o dar koninin içine hapsolursunuz. İşin kötüsü, karşıdan gelen, uzun farlarını yakmış veya merceksiz farına kaçak LED taktırmış bir araç sizi saniyelerce kör edebilir.",
      "subsections": [
        {
          "subtitle": "Işığa Bakma, Çizgiye Bak (Moth Effect)",
          "text": "Gece karşınıza uzun farlarını kısmayan bir araç çıktığında, insan gözü tıpkı bir pervane böceği (moth) gibi istemsizce o parlak ışık kaynağına çekilir. Buna güvelerin ışığa uçma etkisi (Moth Effect) denir.",
          "points": [
            "**Geçici Körlük:** O şiddetli ışığa bakarsanız göz bebekleriniz aniden küçülür. Araç geçip gittikten sonra, göz bebeklerinizin tekrar karanlığa alışması için geçen 4-5 saniye boyunca karanlık yolda hiçbir şey (örneğin siyah giyimli bir yaya, bir köpek veya traktör) göremezsiniz.",
            "**Referans Noktanız Beyaz Çizgiler Olsun:** Karşıdan kör edici bir ışık geldiği an, gözlerinizi o araçtan koparın. Hafifçe gözünüzü kısın ve bakışınızı yolun en sağ tarafındaki beyaz şerit çizgisine (veya toprak banket çizgisine) kilitleyin. Araç geçene kadar o beyaz çizgiyi takip ederek kendi şeridinizde güvenle kalın.",
            "**İç Dikiz Aynası Karartması:** Arkanızdan sürekli selektör veya uzun farla gelen biri varsa strese girmeyin. İç dikiz aynanızın altındaki küçük siyah mandalı kendinize doğru tık diye çekin (otomatik karartmalıysa bunu kendisi yapar). Böylece aynadan yansıyan şiddetli ışık %90 oranında engellenir."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "7. Ayna Yanılsaması: \"Cisimler Göründüğünden Daha Yakındır\"",
      "content": "Sol veya sağ aynanıza bakıp şerit değiştirmeye karar verdiniz. Aynada arkadaki araç oldukça uzakta, küçük bir nokta gibi görünüyor. Şeride geçtiniz ve arkanızdan korkunç bir fren sesi koptu. Oysa uzaktaydı, nasıl bir anda dibinizde bitti?",
      "subsections": [
        {
          "subtitle": "Dışbükey (Konveks) Aynaların Yalanı",
          "text": "Otomobillerin yan aynaları düz ayna değildir; daha geniş bir görüş açısı sunmak ve kör noktayı küçültmek için dışa doğru kavislidir (dışbükey/konveks). Bu kavis, arkadan gelen araçları olduğundan çok daha küçük ve **çok daha uzaktaymış gibi** gösterir.",
          "points": [
            "**Hız Algısı Kaybı:** Aynadaki aracın size ne kadar hızlı yaklaştığını o küçük görüntüden algılamak zordur. Saniyenin onda biri kadar aynaya bakıp karar vermeyin.",
            "**Çift Kontrol Prensibi:** Şerit değiştirmeden önce aynaya bir kez bakın. İki saniye sonra ikinci kez bakın. O iki saniye içinde aynadaki araba aniden büyüdüyse, sizden çok daha hızlı geliyor demektir. Bekleyin, geçsin.",
            "**Gerçek Mesafe Dikiz Aynasındadır:** Aracın gerçek mesafesini anlamak istiyorsanız iç (orta) dikiz aynasına bakın. İç dikiz aynası düzdür ve gerçek mesafeyi gösterir. Eğer bir araç iç aynanızı tamamen kaplıyorsa, önünüze geçme hayalleri kurmayın."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "8. Park Ederken Müziğin Sesini Kısmak (Bilişsel Aşırı Yük)",
      "content": "Yoğun ve stresli bir trafiğin ardından evinize geldiniz, radyoda en sevdiğiniz, hareketli bir şarkı yüksek sesle çalıyor. Aracınızı dar, zorlu, iki araba arasına paralel park edeceksiniz. Tam o manevraya başlayacağınız an eliniz istemsizce teybin ses düğmesine gidiyor ve müziği kapatıyorsunuz. Hiç kendinize güldünüz mü?",
      "subsections": [
        {
          "subtitle": "Kapasite Meselesi: Beyin ve İşlem Gücü",
          "text": "Geri geri park ederken teybin sesini kısma ihtiyacı sizin acemiliğiniz veya komik bir takıntınız değil, tamamen nörolojik ve bilimsel bir savunma mekanizmasıdır.",
          "points": [
            "**Bilişsel Aşırı Yükleme (Cognitive Overload):** İnsan beyninin aynı anda işleyebileceği odaklanma kapasitesi sınırlıdır. Paralel park etme eylemi; aynaların çapraz kontrolü, uzamsal mesafe algısı, debriyaj/fren hassasiyeti ve direksiyonun ters dönüş açısı gibi devasa bir görsel/motor işlem gücü gerektirir.",
            "**İşitsel Gürültü:** Yüksek sesli müzik, hararetli bir radyo programı veya yanınızdaki kişinin durmadan konuşması, beynin sınırlı işlem gücünden çalan ve odaklanmayı bölen \"işitsel gürültülerdir\".",
            "**Sesi Kapatmak Güç Sağlar:** Ses kısıldığında, beyin o sesi işlemek için ayırdığı donanım kaynaklarını anında kapatır ve tüm nöronları görsel işlemeye, mekansal farkındalığa aktarır. Dar bir sokağa girerken veya zor bir park yaparken radyoyu kapatmaktan, yanınızdakilere \"bir saniye sessiz olun\" demekten asla çekinmeyin."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "9. Direksiyon Tutuşu: 9 Çeyrek Efsanesi Gerçek Mi?",
      "content": "Aksiyon filmlerinde veya sokaklarda havalı görünmek isteyen şoförler direksiyonu tek elle en tepeden (saat 12 yönünden) tutar. Bazıları direksiyonu en alttan tutarak kucaklar. Peki önünüze 100 km/s hızla giderken bir tır lastiği fırladığında, acil bir panik manevrası yapmanız gerektiğinde o tek el veya alttan tutuş sizi kurtarabilir mi?",
      "subsections": [
        {
          "subtitle": "Hava Yastığı Patlaması ve 9-3 Pozisyonu",
          "text": "Direksiyonu doğru pozisyonda tutmak direksiyon sınavını geçmek için ezberletilen bir ritüel değil, kaza anında kollarınızın kırılmaması ve araca fiziksel olarak tam hükmetmeniz için yaratılmış bir mekanik gerekliliktir.",
          "points": [
            "**10-2 Pozisyonu Neden Terk Edildi?** Eskiden ehliyet kurslarında öğretilen 10'u 10 geçe (10-2) tutuşu, hava yastıklarının yaygınlaşmasıyla tarih oldu. Çünkü kaza anında açılan hava yastığı, direksiyon göbeğinden saatte 300 km/s hızla patlar. Eğer elleriniz direksiyonun üst kısımlarındaysa (10-2 veya 12), patlayan yastık kollarınızı şiddetle suratınıza çarpar, hem kollarınızı hem de burnunuzu kırar.",
            "**Doğru Tutuş:** Direksiyon bir saat kadranı gibi düşünüldüğünde, sol el tam 9'da, sağ el tam 3'te olmalıdır. (Yani 9'u çeyrek geçe pozisyonu). Baş parmaklar direksiyonun iç kısımlarına (çentiklere) hafifçe dayanmalıdır.",
            "**Geyik Testi Avantajı:** Bu pozisyon hem uzun yolda omuzların yorulmasını engeller, hem hava yastığı açıldığında kolların dışa savrulmasını sağlar, hem de en önemlisi: Ellerinizi direksiyondan hiç kaldırmadan direksiyonu her iki yöne de tam 180 derece (yarım tur) anında çevirip engelden kaçabilmenizi sağlar. Tek el tepedeyken, aracı kırmanız ve hızlıca toparlamanız fiziken imkansızdır, düğüm olursunuz."
          ]
        }
      ]
    },
    {
      "type": "conclusion",
      "title": "Sonuç: Ustalık, Heyecanı Disiplinle Bastırmaktır",
      "content": "Bölüm 1 ve Bölüm 2 boyunca işlediğimiz toplam 17 kural, direksiyonu nasıl çevireceğinizi değil, zihninizi nasıl yöneteceğinizi anlattı. Kimse anasının karnından ralli pilotu olarak doğmaz. Yanlış şeride girip kilometrece yolu uzatabilirsiniz, otoyol çıkışını kaçırabilirsiniz, trafik ışıklarında heyecandan aracı stop ettirebilirsiniz, paralel parkı üç seferde ancak yapabilirsiniz.\n\nSırf aracı stop ettirdiniz diye arkanızdaki korna korosunun çalması veya size öfkeyle bakmaları dünyanın sonu değildir. Bunların hiçbiri sizi \"kötü bir sürücü\" yapmaz. Asıl kötü sürücü, hata yaptığında sinirlenip etrafındakilere tehlikeli hamleler yapan, egosuna yenik düşüp selektör yapanla inatlaşan veya fiziği yenebileceğini sanan kişidir.\n\nBir hata yaptığınızda, paniklediğinizde veya yorulduğunuzda derin bir nefes alın, sağ sinyalinizi verin, gerekirse benzinliğe çekip 5 dakika soluklanın. Yollar kimseye ispat yapacağınız, egonuzu tatmin edeceğiniz bir yarış pisti değil; herkesin, tıpkı sizin gibi sağ salim sevdiklerine ulaşmak istediği ortak bir yaşam alanıdır. Zihinsel donanımınız ve refleksleriniz artık yollara hazır. Şansınız bol, yolunuz açık olsun.",
      "finalChecklist": [
        "Yokuş kalkışlarında el freni desteği kullanmaktan utanma psikolojisi aşıldı mı?",
        "Otoban girişlerinde duraklamadan, cesurca trafiğin hızına ulaşılarak 'fermuar sistemi' uygulandı mı?",
        "Ağır vasıtaları sollarken vites küçültme ve aerodinamik vakum etkisine karşı direksiyona hakim olma bilinci oturdu mu?",
        "Yağmurlu havalarda hız %30 düşürülüp, Aquaplaning anında frene DOKUNMAMAK gerektiği idrak edildi mi?",
        "Gece sürüşlerinde karşıdan gelen ışığa kilitlenmek yerine beyaz şerit çizgisi referans alınıyor mu?",
        "Panik manevraları ve hava yastığı güvenliği için 9-3 direksiyon tutuşu alışkanlık haline getirildi mi?"
      ]
    }
  ]
};

data.guides[guideIndex] = updatedGuide;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Update successful');
