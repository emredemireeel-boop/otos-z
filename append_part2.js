const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./public/data/library_guides.json', 'utf8'));

const newGuide = {
  "id": "guide_acemi_surucu_bolum_2",
  "title": "Yeni Başlayanlar İçin Sürüş Psikolojisi ve İleri Seviye Taktikler: Acemi Sürücü Rehberi Bölüm 2",
  "description": "Sadece direksiyon çevirmek yetmez. Yokuşta arkaya kaydırma korkusundan kurtulma, yağmurlu havada kızaklamayı önleme ve otoban girişlerindeki o meşhur panik anını ustaca atlatma rehberi. Artık bir adım öndesiniz.",
  "minutes": 15,
  "difficulty": "Başlangıç/Orta",
  "tags": [
    "Sürüş",
    "Acemi",
    "Psikoloji",
    "Güvenlik",
    "Rehber",
    "Otoban"
  ],
  "author": "OtoSöz Sürüş Eğitmeni",
  "sections": [
    {
      "type": "intro",
      "title": "Fiziksel Yetenek Değil, Zihinsel Hakimiyet",
      "content": "Acemi sürücülerin en büyük yanılgısı, iyi araç kullanmanın sadece reflekslerden ibaret olduğunu düşünmektir. Oysa trafiğin %80'i psikolojidir. Arkadan korna çalan bir taksiciye sinirlenip debriyajı aniden bırakmak refleks değil, zihinsel bir yenilgidir. Bu ikinci bölümde, sadece araca değil, kendi zihninize ve etrafınızdaki kaosa nasıl hükmedeceğinizi öğreneceğiz."
    },
    {
      "type": "step",
      "title": "1. Yokuş Kalkış Fobisine Son (El Freni Utanç Verici Değildir!)",
      "content": "Manuel vitesli araçlarda en büyük korku yokuşta kalkmaktır. Arkaya kaydırma korkusu yüzünden gereksiz yere gaza yüklenip debriyajı yakmak, her aceminin yaşadığı bir süreçtir. Eğer yokuş kalkış desteğiniz yoksa, el frenini kullanmaktan asla utanmayın! Yarım debriyajı bulduğunuzda el frenini yumuşakça indirmek, size arkaya milim kaymadan kalkış garantisi verir. Sanayide debriyaj balatası değiştirmek, trafikte iki saniye geç kalkmaktan çok daha utanç verici ve masraflıdır."
    },
    {
      "type": "info",
      "title": "Kör Nokta Uyarısı Yoksa Boynunuz Var",
      "content": "Teknolojiye fazla güvenmeyin. Eğer aracınızda kör nokta uyarı sistemi yoksa, şerit değiştirirken aynalara bakmak yetmez. Omzunuzun üzerinden omuz hizasındaki yan camlara (hızlıca, yarım saniyeliğine) bakmak hayat kurtarır. Aynalarda görünmeyen ve tam çaprazınızda sizinle aynı hızda ilerleyen bir motosiklet veya alçak bir spor araba, sadece bu \"omuz bakışı\" ile fark edilebilir."
    },
    {
      "type": "step",
      "title": "2. Otoban Katılım Şeridinde Ölüm Kalım Savaşı",
      "content": "Otobana veya ana yola bağlanırken yapılan en büyük hata, yavaşlayıp hatta durarak trafiğin içine girmeye çalışmaktır. Hızlanma (katılım) şeridinin amacı, ana yoldaki araçların hızına (örneğin 90-100 km/s) ulaşmanızdır. Aynayı kontrol edin, gaza cesurca basın ve trafikle aynı hıza ulaştığınızda aralara fermuar gibi sızın. Sinyal verip yavaşlamak, arkadan 120 ile gelen bir kamyon için intihar demektir."
    },
    {
      "type": "step",
      "title": "3. Yağmur Sürüşü ve Aquaplaning (Kızaklama) Kâbusu",
      "content": "Yağmur yeni çiselemeye başladığında, asfalttaki yağ ve toz suyla birleşip yolu buz pistine çevirir. İlk 15 dakika en tehlikeli zamandır. Ayrıca şiddetli yağmurda yoldaki su birikintilerine hızlı girerseniz, lastik suyu tahliye edemez ve aracınız suyun üzerinde sörf yapmaya başlar (Kızaklama). Bu durumda panik yapıp frene asılırsanız takla atarsınız. Yapmanız gereken tek şey: Ayağınızı gazdan çekin, direksiyonu düz tutun ve lastiklerin tekrar asfalta temas etmesini bekleyin."
    },
    {
      "type": "info",
      "title": "Park Ederken Müziğin Sesini Kısmak Bilimseldir",
      "content": "Geri geri park ederken veya dar bir sokaktan geçerken teybin sesini kısma ihtiyacı hissettiniz mi? Bu komik bir alışkanlık değil, nörolojik bir gerçektir. Beyniniz görsel olarak yoğun bir konsantrasyon gerektiren yeni bir görevle (park etme) meşgulken, işitsel uyarıcılar (yüksek sesli müzik) bilişsel yükü artırır. O sesi kısmak, beyninizin görsel işleme kapasitesini artırır. Kendinizle dalga geçmeyin, sesi kısın ve park edin."
    },
    {
      "type": "conclusion",
      "title": "Sonuç: Deneyim, Yapılan Hataların Toplamıdır",
      "content": "Kimse anasının karnından ralli pilotu olarak doğmaz. Yanlış şeride girip yolu uzatabilirsiniz, ışıklarda aracı stop ettirebilirsiniz, paralel parkı üç seferde yapabilirsiniz. Bunların hiçbiri sizi kötü bir sürücü yapmaz. Asıl kötü sürücü, hata yaptığında sinirlenip tehlikeli hamleler yapan kişidir. Derin bir nefes alın, sinyalinizi verin ve kendi ritminizde sürmeye devam edin. Yollar bir yarış pisti değil, herkesin ulaşmak istediği bir evi var.",
      "finalChecklist": [
        "Otoban girişlerinde duraklamadan, trafiğin hızına çıkılarak katılındı mı?",
        "Şerit değiştirmeden önce kör noktalar için 'omuz bakışı' yapıldı mı?",
        "İlk yağmur damlalarında hız %30 oranında düşürüldü mü?"
      ]
    }
  ],
  "urlId": 10038
};

// Insert at the beginning of the guides array so it shows up first
data.guides.unshift(newGuide);

fs.writeFileSync('./public/data/library_guides.json', JSON.stringify(data, null, 2));
console.log('Successfully appended Part 2 to library_guides.json!');
