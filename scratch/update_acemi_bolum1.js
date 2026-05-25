const fs = require('fs');

const filePath = 'public/data/library_guides.json';
const fileContents = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(fileContents);

const guideIndex = data.guides.findIndex(g => g.id === 'guide_acemi_surucu_gercekler');

if (guideIndex === -1) {
    console.error('Guide not found');
    process.exit(1);
}

const updatedGuide = {
  "id": "guide_acemi_surucu_gercekler",
  "urlId": 10036,
  "title": "Ehliyet Kursunda Öğretilmeyen 8 Hayat Kurtaran Kural: Acemi Sürücü Rehberi (Bölüm 1)",
  "description": "Ayna kontrolü ve paralel parkı herkes öğretir. Peki ya arkanızdan deli gibi selektör yapan magandalarla başa çıkmayı, kör noktada gizlenen tehlikeleri ve panik frenindeki kilitlenmeyi kim öğretecek? İşte trafiğin acımasız ama yazılı olmayan kuralları.",
  "minutes": 15,
  "difficulty": "Başlangıç",
  "tags": [
    "Sürüş",
    "Acemi",
    "Trafik",
    "Güvenlik",
    "Rehber",
    "Defansif Sürüş",
    "Psikoloji"
  ],
  "author": "OtoSöz Sürüş Eğitmeni",
  "sections": [
    {
      "type": "intro",
      "title": "Ehliyeti Aldınız, Şimdi Gerçek Sınav Başlıyor",
      "content": "Direksiyon sınavını ilk girişte geçmiş olabilirsiniz. Dubaların arasına kusursuzca park etmiş, sinyallerinizi saniyesi saniyesine vermiş olabilirsiniz. Ancak yanınızda o güven verici eğitmeniniz, sağ alt köşede yedek pedallar olmadan tek başınıza trafiğe çıktığınız o ilk gün, yolda hiçbir şeyin kitapta yazdığı gibi olmadığını fark edeceksiniz.\n\nTürkiye trafiği, yazılı kurallardan çok **\"yazılı olmayan kuralların\"** ve sürücü psikolojisinin işlediği bir kurtlar sofrasıdır. Eğitimde size araba kullanmayı öğretirler; bu rehber ise size trafikte **hayatta kalmayı, ezilmemeyi ve kaza yapmadan eve dönmeyi** öğretecek. İşte kurslarda asla üzerinde durulmayan, tecrübeyle ve bazen acı bedellerle öğrenilen 8 altın kural."
    },
    {
      "type": "section",
      "title": "1. Selektör Terörü ve Panik Yönetimi (Arkadaki Canavar)",
      "content": "Otoyoldasınız. Sol veya orta şeritte hız sınırları dahilinde (örneğin 110 km/s) nizami bir şekilde ilerliyorsunuz. Birden dikiz aynanızda bir ışık patlaması oluyor. Arkanızda beliren bir araç deli gibi selektör yapıyor ve tamponunuza santimler kalana kadar giriyor.",
      "subsections": [
        {
          "subtitle": "Paniğe Kapılıp Direksiyonu Kırmak Ölümcüldür",
          "text": "Acemi sürücülerin en çok yaptığı ve en ölümcül sonuçlar doğuran hata, arkadaki tacizci araçtan kurtulmak için paniğe kapılıp, sağ aynayı kontrol bile etmeden aniden sağa kırmaktır. Unutmayın: Sağınızdaki kör noktada olan bir araca veya tıra çarparsanız, arkadaki selektör yapan maganda basıp gider, **suçlu siz olursunuz.**",
          "points": [
            "**Derin bir nefes alın ve vizyonunuzu daraltmayın:** Arkanızdaki kişinin acelesi veya saldırganlığı onun problemidir, sizin değil. Siz sadece önünüze ve kendi güvenliğinize odaklanın.",
            "**Fren YAPMAYIN:** Asla arkadakine ders vermek için aniden frene basmayın (brake-checking). Bu hem yasaktır hem de zincirleme bir faciaya yol açar.",
            "**Şeridinizde kalın:** Sağ şeridiniz tamamen boşalana kadar hızınızı değiştirmeden kendi şeridinizde sabit kalın.",
            "**Sinyal verip güvenle çekilin:** Müsait olduğunuzda sağ sinyalinizi verin, aynanızı kontrol edin ve yavaşça sağa geçin. Bırakın geçip gitsin, ego savaşına girmeyin."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "2. Haklı Olmak Kazayı Engellemez (Mezarlıklar Haklı Sürücülerle Dolu)",
      "content": "Kavşaktasınız, ışık size yeşil yanıyor veya geçiş üstünlüğü tabelası kesinlikle sizde. Hızınızı kesmeden kavşağa giriyorsunuz çünkü \"haklısınız\". Tam o anda yan yoldan bir araç burnunu çıkarıyor...",
      "subsections": [
        {
          "subtitle": "Defansif Sürüşün 1 Numaralı Yasası",
          "text": "Trafikte **\"O durmak zorunda, kural böyle\"** diye düşünmek yapılan en büyük hatadır. Kaza raporunda %100 haklı çıkmak; arabanızın haftalarca sanayide yatmasını, değer kaybetmesini veya sizin hastane odasında uyanmanızı engellemez. Haklılık sizi fiziksel olarak koruyan bir kalkan değildir.",
          "points": [
            "**Hazırda bekleyen ayak:** Geçiş üstünlüğü sizde olsa dahi, kör bir kavşağa veya sokağa yaklaşırken ayağınızı gazdan çekin ve fren pedalının üzerine koyun (basmayın, sadece üstünde bekletin).",
            "**Göz temasını arayın:** Karşıdaki sürücünün sizi gördüğünden ve yavaşladığından emin olmadan asla burnunuzu yola sokmayın.",
            "**Kötümser varsayım:** Trafikte her zaman etrafınızdaki herkesin o an telefona baktığını, sarhoş olduğunu, kural bilmediğini veya freninin patladığını varsayarak sürün. Bu paranoya değil, hayat kurtaran defansif sürüştür."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "3. Bakmak ile Görmek Arasındaki İnce Çizgi: \"Kör Nokta\"",
      "content": "Yan aynalarınız harika ayarlanmış durumda. Sol şeride geçmek için sinyal verdiniz, aynaya baktınız, arkanız bomboş! Direksiyonu sola kırdınız ve bir anda kulağınızı sağır eden acı bir korna sesi duyuldu.",
      "subsections": [
        {
          "subtitle": "Omuz Üstü Bakış (Shoulder Check) Hayat Kurtarır",
          "text": "Modern otomobillerin kalınlaşan B ve C sütunları (çarpışma güvenliği için), yan aynaların açısının dışında kalan devasa **kör noktalar** yaratır. Yan aynanızda hiçbir şey görmeseniz bile, tam sol çaprazınızda koca bir SUV veya hızlı gelen bir motosiklet saklanıyor olabilir.",
          "points": [
            "**Omuz Üstü Bakış:** Şerit değiştirmeden hemen önce, sinyalinizi verdikten sonra çenenizi omuzunuza doğru çevirip göz ucuyla camdan dışarı (kör noktaya) saniyelik, çok kısa bir bakış atın.",
            "**Sağa dönüşlere dikkat:** Özellikle şehir içindeki dar sağa dönüşlerde, sağ aynanız ile aracınızın kaportası arasında kalan dar kör noktada kuryeler, bisikletliler veya scooter sürücüleri sıkça bulunur.",
            "**Refleks haline getirin:** Omuz üstü bakış bir tercih değil, sürüşün zorunlu bir parçası olmalıdır. Kas hafızanıza kazıyana kadar bunu bilinçli olarak tekrar edin."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "4. Fren Yapmayı Aslında (Hâlâ) Bilmiyorsunuz",
      "content": "Sürücülerin %80'i hayatı boyunca **ABS'yi (Kilitlenmeyi Önleyici Fren Sistemi)** devreye sokacak kadar acil ve sert bir fren yapmamıştır. Çoğu acemi sürücü, ilk gerçek panik freninde aracın verdiği mekanik tepkiden korkarak kazaya sebep olur.",
      "subsections": [
        {
          "subtitle": "Panik Frenindeki Titreyen Pedal ve Kırılma Sesi",
          "text": "Önünüze aniden bir çocuk atladığında veya öndeki araç zincirleme kazaya karıştığında, fren pedalına tüm gücünüzle basarsınız. Tam o saniye, fren pedalı ayağınızın altında violently (şiddetle) titremeye, vurmaya ve tekerleklerden \"tak-tak-tak\" diye mekanik kırılma sesleri gelmeye başlar.",
          "points": [
            "**Freni Bırakmayın:** Bu ses ve titreme ABS'nin harika çalıştığını, tekerleklerin kilitlenmesini engellemek için saniyede 15-20 kez freni bırakıp sıktığını gösterir. Araba kırılmıyor! Sakın korkup ayağınızı frenden çekmeyin.",
            "**Direksiyonu Çevirin:** ABS'nin icat edilme amacı arabayı daha kısa sürede durdurmak değildir; tekerlekler kilitlenmediği için **fren yaparken aynı zamanda direksiyonu çevirip engelden kaçabilmenizi** sağlamaktır.",
            "**Pratik Yapın:** Boş, güvenli ve ıslak olmayan geniş bir alanda (örneğin boş bir otoparkta) 40-50 km/s hızla giderken tüm gücünüzle frene basıp ABS'yi hissetmeyi deneyin. Acil bir durumda bu hissin size yabancı gelmemesi şarttır."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "5. Yeşil Işık Tuzakları ve Kırmızı Işık Korsanları",
      "content": "Kırmızı ışıkta bekliyorsunuz. Işık nihayet sarıdan yeşile döndü. Arkanızdaki sabırsız sürücüler anında kornaya basmaya başladı. Refleks olarak gaza yüklenip fırladınız...",
      "subsections": [
        {
          "subtitle": "Yeşil Yanar Yanmaz Kalkma Hastalığı",
          "text": "Yeşil ışık, **\"Yol senin, körü körüne git\"** demek değildir. Yeşil ışık, **\"Eğer kavşak ve yol güvenliyse ilerleyebilirsin\"** demektir. Yeni yeşil yandığı o kritik 2 saniye, en çok ölümcül \"T-Bone (yandan çarpma)\" kazasının yaşandığı anlardır.",
          "points": [
            "**Kırmızı Işık İhlalcileri:** Diğer yönden sarı ışıkta \"yetişirim\" diye hızlanarak gelen ve kırmızı yandığı halde duramayan ağır tonajlı bir kamyon veya kural tanımaz bir sürücü her zaman olabilir.",
            "**Sola ve Sağa Bakış:** Yeşil yandığında, arkadaki kornaları tamamen duymazdan gelin. Hızlıca sola ve sağa bakıp kavşağın gerçekten boş olduğundan emin olduktan sonra hareket edin.",
            "**Korna Korkusu:** Arkanızdaki kişinin 1.5 saniye daha beklemesi onu öldürmez ama sizin körü körüne kavşağa atlamanız sizi öldürebilir."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "6. \"Öndeki Geçtiyse Ben De Geçerim\" Yanılgısı",
      "content": "Yoğun ve akan bir trafikte veya şerit daralması olan bir bölgede öndeki aracı takip ediyorsunuz. O bir makas atıyor, siz de peşinden gidiyorsunuz. O son anda sarıda geçiyor, siz kuyruğuna takılıyorsunuz.",
      "subsections": [
        {
          "subtitle": "Koyun Sürüsü Psikolojisi",
          "text": "Öndeki aracın yaptığı hamlenin güvenli olduğunu varsaymak, acemilerin düştüğü büyük bir psikolojik tuzaktır. Sürücüler genellikle önlerindeki aracı kendilerine kalkan olarak kullanma eğilimindedir.",
          "points": [
            "**Görüş Açısı Farkı:** Öndeki sürücünün gördüğü engel, çukur veya tehlike ile sizin arkanızdan gördüğünüz açı tamamen farklıdır. O son saniyede kurtarabilir, siz ise doğrudan engele veya yola fırlayan yayaya çarpabilirsiniz.",
            "**Takip Mesafesi İllüzyonu:** Özellikle şehir içi akan trafikte hız 70-80 km/s iken öndeki araca 2 metre yaklaşmak cinayete teşebbüstür. Öndeki araç acil fren yaptığında reaksiyon süreniz bile yetmeyecektir.",
            "**Kendi Kararınızı Verin:** Asla önünüzdeki aracın kararlarına güvenerek (kör noktaya giriş, sarı ışıkta geçiş, hatalı sollama) hamle yapmayın."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "7. Sinyal Bir İzin İsteme Aracıdır, Hak Değil",
      "content": "Sola geçmeniz gerekiyor. Sinyalinizi yaktınız ve anında direksiyonu sola kırdınız. Arkadan gelen araç acı bir fren sesiyle durabildi ve camdan size bağırıyor: \"Görmüyor musun geliyorum!\"",
      "subsections": [
        {
          "subtitle": "Sinyal Sihirli Bir Kalkan Değildir",
          "text": "Sinyal kolunu aşağı indirdiğiniz an yan şeritteki arabaların buharlaştığını veya size yol vermek zorunda olduğunu zannetmek büyük bir yanılgıdır. Sinyal sadece **\"Ben şerit değiştirmek niyetindeyim, lütfen bana alan açın\"** anlamına gelen bir iletişim aracıdır.",
          "points": [
            "**Niyet Belirtme:** Şerit değiştirmeden en az 3-4 saniye önce sinyalinizi yakın ki arkanızdaki ve yanınızdaki sürücüler niyetinizi anlayıp hızlarını buna göre ayarlasınlar.",
            "**Göz Teması ve Ayna:** Sinyali yaktıktan sonra yan şeritteki aracın hızını kesip size yol (boşluk) bıraktığından tamamen emin olana kadar bekleyin.",
            "**Zorlama Yapmayın:** Eğer yan şeritteki araç hızlanıp alanı kapatıyorsa, sinyali kapatıp o aracın geçmesini bekleyin. İnatlaşmak her zaman kazayla sonuçlanır."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "8. Hedefe Kilitlenme (Target Fixation) Tuzağı",
      "content": "Karşınıza aniden bir kedi, bir çukur veya yola fırlayan bir araba çıktı. Gözlerinizi fal taşı gibi açıp o tehlikeye kilitleniyorsunuz ve ne yaparsanız yapın direksiyonu da o tehlikenin üzerine doğru çeviriyorsunuz. Güm!",
      "subsections": [
        {
          "subtitle": "Araba, Gözünüzün Baktığı Yere Gider",
          "text": "**\"Target Fixation\" (Hedefe Kilitlenme)**, panik anında beynin sadece tehdide odaklanması ve ellerinizin bilinçsizce aracı o tehdide doğru yönlendirmesi durumudur. Yarış pilotlarına öğretilen ilk kural şudur: Duvara bakarsan, duvara çarparsın.",
          "points": [
            "**Boşluğa Bakmayı Öğrenin:** Panik anında engele (yola fırlayan araca, çukura, hayvana) bakmak yerine, **kaçabileceğiniz boşluğa (kaçış rotasına)** bakın.",
            "**Görsel Odak:** Beyin nereye odaklanırsa, kollar direksiyonu o yöne doğru çevirir. Bir tehlike sezinlediğiniz an, gözlerinizi tehlikeden koparıp aracın güvenle geçebileceği asfalt boşluğuna odaklayın.",
            "**Geniş Vizyon:** Sürüş esnasında sadece önünüzdeki arabanın tamponuna değil, 2-3 araba ötesine ve ufka doğru bakarak vizyonunuzu her zaman geniş tutun."
          ]
        }
      ],
      "warning": {
        "title": "⚠️ Hayati Önemde",
        "text": "Pilot eğitimlerinde söylendiği gibi: Çarpmak istemediğin şeye değil, gitmek istediğin yere bak."
      }
    },
    {
      "type": "conclusion",
      "title": "Sonuç: Trafik Bir Savaş Değil, Bir Akıştır",
      "content": "Yollarda herkesin bir acelesi, evde bekleyen bir hastası, büyük bir derdi veya bastırılmış bir öfkesi olabilir. Acemi (veya usta) bir sürücü olarak sizin göreviniz onlara ayak uydurmak, onlara ders vermek veya onlarla yarışmak değildir. Sizin tek göreviniz, kendi güvenli metal balonunuzun (aracınızın) içinde A noktasından B noktasına tek parça halinde varmaktır.\n\nZamanla, binlerce kilometre devirdikçe, bu kurallar sizin için nefes almak kadar doğal refleksler haline gelecek. O zamana kadar sağduyunuzu koruyun, egonuzu torpido gözüne kilitleyin ve emniyet kemerinizi asla çıkarmayın. (Bölüm 2'de ileri sürüş psikolojisi ve ıslak zemin dinamiklerini incelemeye devam edeceğiz.)",
      "finalChecklist": [
        "Aynalar kontrol edildikten sonra **Omuz Üstü Bakış (Kör Nokta)** rutini oturtuldu mu?",
        "Arkadaki magandalara (selektör terörüne) karşı sakinlik korunuyor mu?",
        "Kavşaklarda \"haklılık\" duygusuna kapılmak yerine, kötümser bir defansif duruş sergileniyor mu?",
        "Yeşil ışık yandığında 2 saniye bekleyip sağa/sola bakma alışkanlığı kazanıldı mı?",
        "Panik anında engele değil, **kaçış boşluğuna bakma** pratiği anlaşıldı mı?"
      ]
    }
  ]
};

data.guides[guideIndex] = updatedGuide;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Update successful');
