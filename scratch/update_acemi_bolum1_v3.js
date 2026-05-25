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
  "minutes": 25,
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
      "content": "Direksiyon sınavını ilk girişte geçmiş olabilirsiniz. Dubaların arasına kusursuzca park etmiş, sinyallerinizi saniyesi saniyesine vermiş, rampada aracı milim bile geri kaydırmamış olabilirsiniz. Ancak yanınızda o güven verici eğitmeniniz, sağ alt köşede acil durumlar için bekleyen yedek pedallar olmadan tek başınıza trafiğe çıktığınız o ilk gün, yolda hiçbir şeyin kitapta yazdığı gibi olmadığını iliklerinize kadar hissedeceksiniz.\n\nTürkiye trafiği, yazılı kurallardan çok **\"yazılı olmayan kuralların\"**, anlık reflekslerin ve çok karmaşık bir sürücü psikolojisinin işlediği, adeta bir hayatta kalma arenasıdır. Eğitimde size sadece \"araba kullanmayı\" ve sınavı geçmeyi öğretirler; bu rehber ise size trafikte **gerçek anlamda hayatta kalmayı, ezilmemeyi, kriz anlarını yönetmeyi ve kaza yapmadan evinize dönmeyi** öğretecek. İşte kurslarda asla üzerinde durulmayan, tecrübeyle, hasar kayıtlarıyla ve bazen acı bedellerle öğrenilen 8 altın kural."
    },
    {
      "type": "section",
      "title": "1. Selektör Terörü ve Panik Yönetimi (Arkadaki Canavar)",
      "content": "Otoyoldasınız. Sol veya orta şeritte, tamamen yasal hız sınırları dahilinde (örneğin 110 km/s) nizami bir şekilde ilerliyorsunuz. Her şey yolunda giderken birden dikiz aynanızda bir flaş patlaması oluyor. Arkanızda aniden beliren bir araç deli gibi selektör yapıyor ve tamponunuza kelimenin tam anlamıyla santimler kalana kadar giriyor.",
      "subsections": [
        {
          "subtitle": "Paniğe Kapılıp Direksiyonu Kırmak Ölümcüldür",
          "text": "Acemi sürücülerin en çok yaptığı ve maalesef en ölümcül sonuçlar doğuran hata, arkadaki tacizci araçtan bir an önce kurtulmak için paniğe kapılıp, sağ aynayı ve kör noktayı kontrol bile etmeden aniden sağa kırmaktır. Unutmayın: Sağınızdaki kör noktada ilerleyen bir araca veya ağır tonajlı bir tıra çarparsanız, arkadaki selektör yapan maganda frene bile basmadan basıp gider. **Kaza raporunda %100 kusurlu olan siz olursunuz.**",
          "points": [
            "**Derin bir nefes alın ve vizyonunuzu daraltmayın:** Arkanızdaki kişinin acelesi, hastası, siniri veya saldırganlığı tamamen onun problemidir, sizin değil. Siz sadece önünüze, yola ve kendi güvenliğinize odaklanın. Aynaya bakarak strese girmeyin.",
            "**Fren YAPMAYIN (Brake-Checking):** Asla arkadakine ders vermek veya onu korkutmak için aniden frene basmayın. Saniyelik bir reaksiyon gecikmesi, bagajınızın paramparça olmasına ve zincirleme bir faciaya yol açar.",
            "**Şeridinizde sabit kalın:** Sağ şeridiniz tamamen ve güvenli bir şekilde boşalana kadar hızınızı değiştirmeden kendi şeridinizde rotanızı koruyun.",
            "**Sinyal verip güvenle çekilin:** Müsait olduğunuz an sağ sinyalinizi verin, aynanızı kontrol edin, başınızı hafifçe çevirip kör noktanıza bakın ve yavaşça sağa geçin. Bırakın geçip gitsin, ego savaşına veya kim haklı yarışına girmeyin."
          ]
        },
        {
          "subtitle": "Psikolojik Arka Plan: Uçuş veya Savaş Tepkisi",
          "text": "Arkanızdan gelen şiddetli ışık selektörü, insan beynindeki ilkel 'tehdit' algısını tetikler. Vücudunuz adrenalin salgılar ve beyniniz ya kaçmanızı (sağa kırmanızı) ya da savaşmanızı (fren yapmanızı) emreder. Profesyonel sürücüler bu ilkel dürtüyü bastırmayı öğrenenlerdir. Soğukkanlılık, trafikteki en büyük kalkanınızdır."
        }
      ]
    },
    {
      "type": "section",
      "title": "2. Haklı Olmak Kazayı Engellemez (Mezarlıklar Haklı Sürücülerle Dolu)",
      "content": "Kavşaktasınız, ışık size yeşil yanıyor veya geçiş üstünlüğünü belirten ana yol tabelası kesinlikle sizde. Hızınızı hiç kesmeden, kendinizden emin bir şekilde kavşağa giriyorsunuz çünkü \"haklısınız\". Tam o anda ara sokaktan veya kırmızı ışıktan bir araç burnunu hızla çıkarıyor...",
      "subsections": [
        {
          "subtitle": "Defansif Sürüşün 1 Numaralı Yasası",
          "text": "Trafikte **\"O durmak zorunda, trafik kuralları böyle\"** diye düşünmek, bir aceminin yapabileceği en büyük hatadır. Kaza tespit tutanağında %100 haklı çıkmanız; arabanızın haftalarca sanayide yatmasını, onarım sürecinde çekeceğiniz stresi, aracınızın uğrayacağı on binlerce liralık değer kaybını veya daha kötüsü sizin bir hastane odasında uyanmanızı engellemez. Haklılık, fiziki çarpışmayı durduran sihirli bir bariyer değildir.",
          "points": [
            "**Hazırda bekleyen ayak (Hovering):** Geçiş üstünlüğü sizde olsa dahi, görüş açısı kısıtlı kör bir kavşağa veya sokağa yaklaşırken ayağınızı gaz pedalından çekin ve fren pedalının hemen üzerine konumlandırın (basmayın, sadece üstünde milisaniyelik tepki için bekletin).",
            "**Göz temasını arayın:** Karşıdaki veya yandan gelen sürücünün yavaşladığından, duracağından ve en önemlisi **sizi gördüğünden** emin olmadan asla burnunuzu yola sokmayın. Araçların tekerlek jantlarına bakın; tekerlek dönmeyi bırakmıyorsa, araç durmuyor demektir.",
            "**Kötümser varsayım ilkesi:** Trafikte her zaman etrafınızdaki herkesin o an cep telefonuyla mesajlaştığını, alkollü olduğunu, kural bilmediğini veya aracının freninin patladığını varsayarak sürüşünüzü planlayın. Bu gereksiz bir paranoya değil, hayat kurtaran defansif sürüşün temelidir."
          ]
        }
      ],
      "warning": {
        "title": "⚠️ Hukuk Sizi Sonra, Fizik Sizi Hemen Yargılar",
        "text": "Kanunlar kaza sonrasında kimin haklı olduğunu belirler. Ancak fizik kuralları, kaza anında 1.5 tonluk iki metal yığınının çarpışmasıyla ilgilenir. Önceliğiniz mahkemede kazanmak değil, çarpışmadan kaçınmak olmalıdır."
      }
    },
    {
      "type": "section",
      "title": "3. Bakmak ile Görmek Arasındaki İnce Çizgi: \"Kör Nokta\"",
      "content": "Yan aynalarınız ve dikiz aynanız mükemmel ayarlanmış durumda. Sol şeride geçmek için sinyal verdiniz, aynaya dikkatlice baktınız, arkanız bomboş görünüyor! Güvenle direksiyonu sola kırdınız ve bir anda kulağınızı sağır eden acı bir korna sesi duyuldu. Nereden çıktı bu araba?",
      "subsections": [
        {
          "subtitle": "Omuz Üstü Bakış (Shoulder Check) Hayat Kurtarır",
          "text": "Modern otomobillerin devrilme testlerini (Euro NCAP) geçebilmesi için kapı direkleri (B ve C sütunları) eskiye göre çok daha kalın tasarlanmaktadır. Bu güvenlik unsuru, yan aynaların açısının tamamen dışında kalan devasa **kör noktalar** yaratır. Yan aynanızda hiçbir şey görmeseniz bile, tam sol veya sağ çaprazınızda koca bir SUV, hızla yaklaşan bir araç veya sessizce gelen bir motosiklet tamamen saklanıyor olabilir.",
          "points": [
            "**Omuz Üstü Bakış Rutini:** Şerit değiştirmeden hemen önce, sinyalinizi verdikten sonra çenenizi omuzunuza doğru hızlıca çevirip göz ucuyla camdan dışarı (kör noktaya) saniyelik, çok kısa bir bakış atın.",
            "**Sağa dönüşlere ve bisikletlilere dikkat:** Özellikle şehir içindeki dar sağa dönüşlerde, sağ aynanız ile aracınızın kaportası arasında kalan o daracık kör noktada kuryeler, bisikletliler veya e-scooter sürücüleri sıkça pusuya yatar. Sağa dönmeden önce sağ omuzunuzun üstünden mutlaka arka çaprazı kontrol edin.",
            "**Refleks haline getirin:** Omuz üstü bakış ekstra bir güvenlik önlemi değil, güvenli şerit değiştirmenin zorunlu bir parçasıdır. Bu hareketi kas hafızanıza kazıyana kadar her şerit değişiminde bilinçli olarak tekrar edin."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "4. Fren Yapmayı Aslında (Hâlâ) Bilmiyorsunuz",
      "content": "Araştırmalara göre, sürücülerin yaklaşık %80'i hayatı boyunca **ABS'yi (Kilitlenmeyi Önleyici Fren Sistemi)** devreye sokacak kadar acil ve tam güce ulaşan sert bir panik fren yapmamıştır. Çoğu acemi sürücü, ilk gerçek tehlike anında aracın fren pedalının verdiği o korkunç mekanik tepkiden ürkerek ayağını frenden çeker ve kazaya davetiye çıkarır.",
      "subsections": [
        {
          "subtitle": "Panik Frenindeki Titreyen Pedal ve Kırılma Sesi",
          "text": "Önünüze aniden bir çocuk atladığında, bir hayvan yola çıktığında veya otoyolda öndeki araçlar zincirleme kazaya karıştığında, fren pedalına var gücünüzle basarsınız. Tam o saniye, fren pedalı ayağınızın altında **şiddetle titremeye, geriye doğru vurmaya** başlar ve tekerleklerden, alt takımdan sanki araba parçalanıyormuş gibi metalik sürtünme ve \"tak-tak-tak\" vuruntu sesleri gelir.",
          "points": [
            "**Freni Asla Bırakmayın:** Bu yüksek ses ve titreme, ABS'nin kusursuz çalıştığını, tekerleklerin kızaklamasını engellemek için fren disklerini saniyede 15-20 kez bırakıp sıktığını gösterir. Araba kırılmıyor, teknoloji hayatınızı kurtarıyor! Ne olursa olsun korkup ayağınızı frenden çekmeyin, sonuna kadar basmaya devam edin.",
            "**ABS'nin Asıl Amacı: Direksiyon Hakimiyeti:** ABS'nin icat edilme amacı iddia edildiği gibi arabayı sadece daha kısa sürede durdurmak değildir; asıl devrim, tekerlekler kilitlenmediği için **tam güç fren yaparken aynı zamanda direksiyonu çevirip engelden güvenle kaçabilmenizi** sağlamasıdır. Eski arabalarda tam fren yapıldığında kızaklayan araç, direksiyonu nereye çevirirseniz çevirin dümdüz engele kayardı.",
            "**Simülasyon Pratiği Yapın:** Boş, trafiğe kapalı, güvenli ve geniş bir alanda (örneğin pazar günleri boş bir dev otoparkta) 40-50 km/s hızla giderken tüm gücünüzle frene basıp ABS'yi hissetmeyi deneyin. Acil bir durumda beyninizin bu şiddetli sese ve titreşime yabancı kalmaması şarttır."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "5. Yeşil Işık Tuzakları ve Kırmızı Işık Korsanları",
      "content": "Kırmızı ışıkta bekliyorsunuz ve radyonuzda bir şarkı çalıyor. Işık nihayet sarıdan yeşile döndü. Tam o saniyede, arkanızdaki sabırsız sürücüler daha siz vitesi bire takmadan kornaya basmaya başladı. Refleks olarak ve mahcup olma duygusuyla aniden gaza yüklenip fırladınız...",
      "subsections": [
        {
          "subtitle": "Yeşil Yanar Yanmaz Kalkma Hastalığı",
          "text": "Trafikte yeşil ışık, **\"Yol senin mülkün, körü körüne ve hızla git\"** demek değildir. Yeşil ışık, yasal olarak **\"Eğer kavşak ve bağlantı yolları güvenliyse ilerleyebilirsin\"** anlamına gelir. Işığın yeni yeşile döndüğü o kritik ilk 2 saniye, trafik kazası istatistiklerinde en çok ölümcül \"T-Bone (tam yandan çarpma)\" kazasının yaşandığı anlardır.",
          "points": [
            "**Kırmızı Işık İhlalcileri ve Tır Faktörü:** Diğer yönden gelen yolda sarı ışığı görüp \"kesin yetişirim\" diye hızlanan, ancak ışık kırmızıya dönmesine rağmen duramayan ağır tonajlı bir harfiyat kamyonu veya kural tanımaz bir sürücü her zaman olabilir. Kamyonların durma mesafesi otomobillere göre devasadır.",
            "**Sola ve Sağa Güvenlik Bakışı:** Kendi yönünüze yeşil yandığında, arkanızdaki korna çalanları tamamen duymazdan gelin. Hızlıca başınızı sola ve sağa çevirip kavşağın fiziki olarak boş olduğundan, duramayan bir araç gelmediğinden emin olduktan sonra hareket edin.",
            "**Korna Korkusunu Yenin:** Arkanızdaki kişinin sizin güvenliği kontrol ettiğiniz o 1.5 saniyeyi beklemesi onu öldürmez, hayatından hiçbir şey eksiltmez. Ancak sizin arkadakine yaranmak için körü körüne kavşağa atlamanız telafisi imkansız sonuçlar doğurabilir."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "6. \"Öndeki Geçtiyse Ben De Geçerim\" Yanılgısı",
      "content": "Yoğun ve hızlı akan bir trafikte, yolda oluşan bir daralmayı geçmeye çalışıyorsunuz veya seri bir şekilde şerit değiştiren öndeki aracı takip ediyorsunuz. Öndeki araç daracık bir boşluktan makas atıyor, siz de peşinden gidiyorsunuz. O son saniyede sarıda geçiyor, siz de \"ben de yetişirim\" diyerek onun rüzgarına takılıyorsunuz.",
      "subsections": [
        {
          "subtitle": "Koyun Sürüsü Psikolojisi ve Kalkan Etkisi",
          "text": "Öndeki aracın yaptığı her hamlenin doğru ve güvenli olduğunu varsaymak, acemi sürücülerin düştüğü en büyük ve en sinsi psikolojik tuzaktır. Sürücüler, özellikle bilmedikleri bir yolda veya yoğun stres altında, önlerindeki aracı kendilerine bir \"görünmez kalkan\" ve rehber olarak kullanma eğilimine girerler.",
          "points": [
            "**Görüş Açısı Farkı Gerçeği:** Öndeki sürücünün gördüğü yol, engel, devasa çukur veya kaza ile sizin doğrudan onun tamponunun arkasından sahip olduğunuz görüş açısı tamamen farklıdır. O, engeli 5 saniye önceden görüp son saniyede direksiyonu kırarak kurtarabilir; siz ise öndeki aracın arkasına gizlenmiş olan o engele (veya yola fırlayan yayaya) hiçbir tepki veremeden doğrudan çarpabilirsiniz.",
            "**Takip Mesafesi İllüzyonu:** Özellikle çevre yollarında hız 80-90 km/s iken öndeki araca 2-3 metre yaklaşmak adeta rus ruletidir. Öndeki araç aniden duran trafiği görüp acil fren yaptığında, insan beyninin reaksiyon süresi (yaklaşık 1 saniye) sizin frene dokunmanıza bile fırsat vermeden çarpışmaya neden olacaktır.",
            "**Kendi Kararınızın Kaptanı Olun:** Asla ama asla önünüzdeki aracın kararlarına güvenerek (kör noktaya giriş yapmak, sarı ışıkta gaza basıp geçmek, hatalı sollamaya çıkmak) hamle yapmayın. Kendi rotanızı kendi gözlerinizle teyit edin."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "7. Sinyal Bir İzin İsteme Aracıdır, Geçiş Hakkı Değil",
      "content": "Sola dönmeniz veya şerit değiştirmeniz gerekiyor. Trafik kurallarına uygun olarak sinyalinizi yaktınız ve anında (hiç beklemeden) direksiyonu sola doğru kırdınız. Yan şeritten hızla gelen araç acı bir fren sesiyle kıl payı durabildi ve sürücü camdan size haklı olarak tepki gösteriyor: \"Sinyal yaktın diye hemen yola mı atlanır!\"",
      "subsections": [
        {
          "subtitle": "Sinyal Sihirli Bir Boşluk Yaratma Kalkanı Değildir",
          "text": "Sinyal kolunu aşağı indirdiğiniz an yan şeritteki arabaların sihirli bir şekilde buharlaştığını, size otomatik bir saygıyla anında yol vermek zorunda olduğunu zannetmek ciddi bir trafik okuryazarlığı eksikliğidir. Sinyal sadece ama sadece **\"Ben ilerideki saniyelerde şerit değiştirmek niyetindeyim, lütfen bana güvenli bir alan açın\"** anlamına gelen nazik bir iletişim aracıdır.",
          "points": [
            "**Erken Niyet Belirtme:** Şerit değiştirmeden en az 3-4 saniye önce sinyalinizi yakın. Bu süre, arkanızdaki ve yanınızdaki sürücülerin sizin niyetinizi beyinlerinde algılayıp, kendi hızlarını buna göre ayarlamaları (gazdan ayak çekmeleri) için gereken minimum süredir.",
            "**Göz Teması, Ayna ve Teyit:** Sinyali yaktıktan sonra iş bitmez. Yan şeritteki aracın sizin sinyalinizi gördüğünden, hızını kestiğinden ve size girmek için yeterli fiziksel bir boşluk (yol) bıraktığından %100 emin olana kadar şeridinizde kalın.",
            "**Zorlama ve İnatlaşma Yapmayın:** Eğer yan şeritteki sürücü hızlanıp o alanı kapatıyorsa (Türkiye trafiğinde ne yazık ki sıkça görülen bir durumdur), sinyali kapatın veya o aracın geçip gitmesini sabırla bekleyin. 2 tonluk makinelerle inatlaşmak ve şerit kapmaca oynamak her zaman kaporta masrafı ve kaza tutanağıyla sonuçlanır."
          ]
        }
      ]
    },
    {
      "type": "section",
      "title": "8. Hedefe Kilitlenme (Target Fixation) Tuzağı",
      "content": "Dar bir virajı dönüyorsunuz veya düz bir yolda hızla ilerliyorsunuz. Karşınıza aniden bir köpek fırladı, yola devasa bir kaya parçası yuvarlandı veya kaza yapmış bir araba belirdi. Tüm vücudunuz kasılıyor, gözlerinizi fal taşı gibi açıp doğrudan o tehlikeye kilitleniyorsunuz ve ne yaparsanız yapın, elleriniz direksiyonu doğrudan çarpmak istemediğiniz o tehlikenin üzerine doğru çeviriyor. Güm!",
      "subsections": [
        {
          "subtitle": "Araba, Gözünüzün Baktığı ve Kilitlendiği Yere Gider",
          "text": "**\"Target Fixation\" (Hedefe Kilitlenme)**, panik anında insan beyninin sadece mevcut tehdide (engel) odaklanması ve ellerinizin bilinçsizce (otonom sinir sistemiyle) aracı o tehdide doğru yönlendirmesi durumudur. Yarış pilotlarına ve ileri sürüş teknikleri eğitimlerinde öğrencilere öğretilen ilk altın kural şudur: **\"Duvara bakarsan, duvara çarparsın.\"**",
          "points": [
            "**Boşluğa Bakmayı Öğrenin (Kaçış Rotası):** Panik anında engele (yola fırlayan araca, çukura, yayaya, hayvana) bakmak yerine, beyninizi zorlayıp **kaçabileceğiniz boşluğa (güvenli asfalt rotasına)** bakmalısınız.",
            "**Görsel Odak Bedeni Yönetir:** İnsan fizyolojisinde beyin nereye odaklanırsa, kollar ve omuzlar direksiyonu milimetrik olarak o yöne doğru çevirir. Bir tehlike sezinlediğiniz an, gözlerinizi adeta mıknatıstan koparırcasına tehlikeden ayırıp, aracın tekerleklerinin güvenle basıp geçebileceği asfalt boşluğuna odaklayın. Araç sizin gözlerinizi takip edecektir.",
            "**Geniş Vizyon (Periferik Görüş):** Sürüş esnasında bakışlarınızı sadece önünüzdeki arabanın tamponuna veya kaputun ucuna sabitlemeyin. Her zaman 3-4 araba ötesine, virajın çıkış noktasına ve ufka doğru bakarak vizyonunuzu geniş tutun. Geniş bakmak, tehlikeleri çok önceden görüp hedefe kilitlenme paniğini yaşamadan yumuşak fren yapmanızı sağlar."
          ]
        }
      ],
      "warning": {
        "title": "⚠️ Hayati Önemde Formül",
        "text": "Pilot eğitimlerinde her gün tekrar edilen o sözü aklınızdan çıkarmayın: \"Çarpmak istemediğin şeye sakın bakma, sadece ama sadece gitmek istediğin güvenli yere bak.\""
      }
    },
    {
      "type": "conclusion",
      "title": "Sonuç: Trafik Bir Savaş Alanı Değil, Bir Ortak Yaşam Alanıdır",
      "content": "Yollarda yanınızdan geçen her aracın içinde bambaşka bir hayat, bambaşka bir ruh hali vardır. Herkesin bir acelesi, yetişmesi gereken bir uçağı, evde bekleyen hasta bir çocuğu, büyük bir borç derdi veya bastırılmış bir öfkesi olabilir. Acemi (veya yılların tecrübeli ustası) bir sürücü olarak sizin temel göreviniz onlara ayak uydurmak, hatalarını yüzlerine vurarak onlara trafik dersi vermek veya onlarla anlamsız yarışlara girmek değildir.\n\nSizin trafikteki tek gerçek göreviniz, kendi güvenli metal balonunuzun (aracınızın) içinde, siz ve sevdiklerinizi A noktasından B noktasına tek parça halinde, huzurla ve sağlıkla vardırmaktır.\n\nZamanla, yollarda binlerce kilometre devirdikçe, sayısız tehlike atlatıp deneyim kazandıkça bu bahsettiğimiz 8 kural sizin için üzerinde düşünmediğiniz, nefes almak kadar doğal refleksler haline gelecek. O gün gelene kadar; her zaman sağduyunuzu koruyun, egonuzu kontağı çevirmeden önce torpido gözüne kilitleyin, hız sınırlarına uyun ve **emniyet kemerinizi arka koltukta dahi olsanız asla çıkarmayın.** (Bölüm 2'de ileri sürüş psikolojisi, yağmurlu zemin dinamikleri ve gece sürüşünde hayatta kalma taktiklerini incelemeye devam edeceğiz. Güvenli sürüşler!)",
      "finalChecklist": [
        "Aynalar kontrol edildikten sonra **Omuz Üstü Bakış (Kör Nokta)** rutini kemikleşti mi?",
        "Arkadaki magandalara (selektör terörüne) karşı egoya yenik düşmeden sakinlik korunuyor mu?",
        "Kavşaklarda \"Yol benim hakkım\" duygusuna kapılmak yerine, kötümser ve defansif duruş sergileniyor mu?",
        "Yeşil ışık yandığında kornalara aldırış etmeden 2 saniye bekleyip sağa/sola fiziki güvenlik bakışı atma alışkanlığı kazanıldı mı?",
        "Panik anında engele kilitlenmek yerine, **güvenli kaçış boşluğuna bakma** ve ABS titreşiminden korkmama prensibi kavrandı mı?"
      ]
    }
  ]
};

data.guides[guideIndex] = updatedGuide;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Update successful');
