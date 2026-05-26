const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/data/library_guides.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const guideIndex = data.guides.findIndex(g => g.id === "guide_sanayi_ustalari_sirlar");

if (guideIndex !== -1) {
  const guide = data.guides[guideIndex];
  
  // Make the title more epic
  guide.title = "Sanayide Ustaların Gizlediği 7 Kritik Sır: Aracınızın Ömrünü ve Cüzdanınızı Nasıl Kurtarırsınız? (Derin Analiz)";
  guide.description = "Sanayi sitelerinde ve yetkili servislerde size söylenmeyen acı gerçekler. Parça değiştiriciliğinden sensör sömürüsüne, 'ömür boyu' yağ efsanesinden klima gazı yalanına kadar cebinizi boşaltan 7 büyük sırrın mühendislik düzeyinde ifşası.";
  guide.minutes = 45;
  guide.difficulty = "İleri Düzey";
  
  guide.sections = [
    {
      "type": "intro",
      "content": "Otomobil endüstrisi ve satış sonrası servis (aftermarket) sektörü, araç sahiplerinin bilgi asimetrisinden (teknik bilgisizliğinden) beslenen devasa bir ekosistemdir. Aracınız arıza yaptığında veya periyodik bakıma girdiğinde, kaputun altında dönen fiziksel ve kimyasal gerçekler ile size kesilen faturadaki hikaye çoğu zaman birbirini tutmaz. Ustaların veya yetkili servis danışmanlarının size kötü niyetle yaklaştığını iddia etmek yanlış olur; ancak otomotiv sektörünün 'tamir etmek' yerine 'parça değiştirmek' (parts replacer) üzerine evrildiği bir çağda yaşıyoruz. Çünkü parça değiştirmek ustaya hem yedek parçadan komisyon kazandırır hem de zaman kazandırır. Sizin cüzdanınızdaki erimenin ise onlar için bir önemi yoktur. Bu kapsamlı analizde, sektörün perde arkasında konuşulmayan 7 kritik sırrı, termodinamik, mekanik ve ekonomik veriler ışığında masaya yatırıyoruz.",
      "warning": {
        "title": "Altın Kural: Elçiyi Vurmayın",
        "text": "Ustaların en çok sevdiği şey bilgisayarın gösterdiği arızalı sensörü hemen yenisiyle değiştirmektir. Unutmayın: Sensörler genelde arıza yapmaz, sadece sistemdeki başka bir mekanik kaçaktan dolayı 'yanlış değerler' okuyarak sizi uyarır. Sensör, kötülüğü haber veren elçidir!"
      }
    },
    {
      "type": "step",
      "title": "Sır 1: Periyodik Bakım ve '15.000 km' Yanılgısı",
      "content": "Üreticiler araçlarını satarken, işletme maliyetini düşük göstermek ve filolara cazip kılmak için periyodik bakım aralığını (Long-Life yağlarla birlikte) 15.000 km, hatta bazı markalarda 30.000 km veya 1 yıl olarak sunarlar.",
      "subsections": [
        {
          "subtitle": "Motor Saati (Engine Hours) Gerçeği",
          "text": "Motor yağının ömrü, aracın tekerleğinin döndüğü 'kilometre' ile değil, motorun çalıştığı 'saat' ve maruz kaldığı 'ısı döngüsü' (heat cycle) ile ölçülür. İstanbul veya Ankara gibi büyükşehirlerin dur-kalk (stop & go) trafiğinde her gün 2 saat geçiren bir araç, kilometre yapmasa bile motor yağı rölantide kavrulmaya devam eder. Rölanti, yağ basıncının en düşük olduğu ve motorun en çok aşındığı andır. Trafikte 15.000 km yapan bir araç, aslında otobanda 45.000 km yapmış bir araçla aynı motor saatine ulaşır."
        },
        {
          "subtitle": "Kritik Müdahale",
          "text": "Eğer aracınızı yoğun şehir içi trafiğinde kullanıyorsanız, 15.000 km kuralını çöpe atın. Motor bloğunuzun, turboşarj ünitenizin (çok yüksek ısı ve devir) ve eksantrik zincirinizin uzun yıllar dayanmasını istiyorsanız yağı en geç 7.500 km ile 10.000 km arasında mutlaka tam sentetik kaliteli bir yağ ile değiştirin. Senede vereceğiniz ekstra 2.000 TL bakım parası, sizi 100.000 TL'lik motor revizyonundan kurtarır."
        }
      ]
    },
    {
      "type": "step",
      "title": "Sır 2: 'Parça Değiştiricilik' Hastalığı vs Gerçek Tamir",
      "content": "Eskiden sanayideki ustalar alternatör (şarj dinamosu), marş motoru veya direksiyon pompası bozulduğunda içini açar, sargıları yeniler ve küçük parçaları tamir ederlerdi. Bugün ise tablo tamamen değişti.",
      "subsections": [
        {
          "subtitle": "Modüler Sömürü Sistemi",
          "text": "Aracınızın alternatörü aküyü şarj etmeyi kestiğinde, servis size 'Alternatör ölmüş, yenisi takılacak, 15.000 TL' der. Oysa alternatörün bozulması demek, genellikle sadece içinde bulunan ve rotora sürten 100 TL'lik karbon fırçaların (kömürlerin) bitmesi veya voltaj regülatörü diyotunun yanması demektir. Aynı durum elektrikli direksiyon (EPS) kutularında da geçerlidir; sistemin içindeki 1 dolarlık plastik burç aşındığında usta tüm kutuyu 25.000 TL'ye değiştirmek ister, çünkü içiyle uğraşmak ona 'hamallık' gibi gelir ve parça karı alamaz."
        },
        {
          "subtitle": "Kritik Müdahale",
          "text": "Pahalı ve büyük bir mekanik ünite (şanzıman beyni (mekatronik), direksiyon kutusu, marş motoru, alternatör vb.) için değişim kararı verildiğinde asla ilk ustada aracı bırakmayın. Sadece o ünite üzerine uzmanlaşmış 'revizyon/tamir' servislerine gidin. Çoğu devasa parça, içindeki ufak bir milin veya sensörün değişimiyle orijinal haliyle kurtarılabilir."
        }
      ]
    },
    {
      "type": "step",
      "title": "Sır 3: Fren Balataları ve Disklerindeki Psikolojik Oyun",
      "content": "Fren sistemi aracın en kritik güvenlik ekipmanıdır ve ustalar bu argümanı 'psikolojik bir baskı' aracı olarak kullanmaya bayılırlar.",
      "subsections": [
        {
          "subtitle": "Akustik İkaz ve Balata Sensörü",
          "text": "Frenlere bastığınızda ince bir 'ciyaklama' (squeal) sesi duyarsanız ustaya gidersiniz. Usta 'Balata tamamen bitmiş, demire sürtmüş, diskleri de mahvetmiş komple değişecek' der. Oysa fren balatalarının üzerinde 'Wear Indicator' (Aşınma Göstergesi) adı verilen küçük metal bir pim vardır. Balatanın ömrü %15-20'ye düştüğünde bu pim bilerek diske hafifçe sürter ve sadece sizi uyarmak için o sinir bozucu ince sesi çıkarır. Yani balata aslında bitmemiş, demire sürtmemiştir; sizi zamanında uyaran bir güvenlik mekanizması devreye girmiştir."
        },
        {
          "subtitle": "Disk Değişim Yanılgısı",
          "text": "Modern fren diskleri devasa termal toleranslara sahip karbon-döküm demirlerden üretilir. Çoğu disk 2 veya 3 takım balata eskitecek kadar kalınlığa (minimum thickness toleransına) sahiptir. Usta ufak bir çizik gördüğü için diski değiştirmek isterse reddedin, diskin milimetrik ölçümünü (kumpasla) isteyin. Gerekiyorsa tornada (resurfacing) yüzeyi saniyeler içinde sıfırlanabilir."
        }
      ]
    },
    {
      "type": "step",
      "title": "Sır 4: Şanzıman Yağı 'Ömür Boyudur' (Sealed for Life) Efsanesi",
      "content": "Birçok Alman (BMW, Audi) ve Japon (Toyota, Honda) otomobil üreticisi, araçların kullanım kılavuzlarına otomatik şanzıman sıvısının (ATF) 'Ömür Boyu' (Lifetime) dolum olduğunu ve değiştirilmesine gerek olmadığını yazar. Yetkili servise gidersiniz, 'Buna dokunmuyoruz, ömür boyu yağdır' derler.",
      "subsections": [
        {
          "subtitle": "Pazarlama Stratejisi ve Gerçek 'Ömür'",
          "text": "Mühendislik yasalarında sıvı olan, 120°C ısıya çıkan, binlerce metal dişlinin arasından sürtünmeyle geçen hiçbir sıvı 'ömür boyu' kalamaz. Sıvının vizkozitesi (akışkanlığı) bozulur, balata tozları sıvıyı çamurlaştırır. Üreticilerin 'Ömür Boyu' dediği şey aslında aracın garanti süresi veya tahmini ilk sahibindeki süresidir (Yani 5 yıl veya 100.000 km). Araç garantiyi bitirip 150.000 km'de şanzıman beynini patlattığında (yaklaşık 100.000 TL masraf) üretici veya servis bu faturayı size seve seve çıkaracaktır."
        },
        {
          "subtitle": "Kritik Müdahale",
          "text": "Eğer tam otomatik (Tork konvertörlü), CVT veya çift kavramalı (DSG, EDC) bir şanzımanınız varsa, üretici ne derse desin sıvı (yağ) ve filtre değişimini her 60.000 km veya 80.000 km'de bir (maksimum 4-5 yıl) mutlak suretle yetkili şanzımancılarda makine ile yaptırın. Eski yağı temizlemek şanzımanınızın ömrünü yüzbinlerce kilometre uzatır."
        }
      ]
    },
    {
      "type": "step",
      "title": "Sır 5: Klima Gazı 'Bitiyor' Yalanı (Haraca Bağlanmak)",
      "content": "Yaz aylarında klimanız soğutmamaya başladığında sanayiye gidersiniz. Ustanın ilk cümlesi şudur: 'Klima gazı bitmiş abi, hemen 500 gram gaz basıp hallediyorum.' Siz serin serin eve dönersiniz, ancak 8 ay sonra sonraki yaz başı klima yine sıcak üfler.",
      "subsections": [
        {
          "subtitle": "Sistem Kapalı Devredir",
          "text": "Otomobillerin iklimlendirme (klima/A-C) sistemleri tıpkı evinizdeki buzdolapları gibi 'tamamen kapalı devre' (hermetically sealed) bir sistemdir. Klima gazı (freon) araba çalıştıkça motor yağı veya benzin gibi yanarak 'biten' veya tükenen bir şey değildir. Eğer klima gazı sistemden eksiliyorsa, sistemde kesinlikle fiziksel bir kaçak (delik, yırtık O-ring, çatlak hortum, patlak kondansatör) var demektir."
        },
        {
          "subtitle": "Kritik Müdahale",
          "text": "Sistemin neresinden kaçırdığını bulmadan (ki bu zahmetli bir iştir) sadece gaz basıp yollayan usta, aslında kaçağı bildiği halde sizi her yaz kendisine gelmeye mecbur bırakır (haraca bağlar). Ustanıza gaz basarken sisteme 'UV Boya' (Fosforlu Kaçak Tespit Boyası) eklemesini ve bir hafta sonra UV feneriyle kaçak noktasını (O-ring contaları, radyatör petekleri) tespit edip asıl onarımı yapmasını emredin."
        }
      ]
    },
    {
      "type": "step",
      "title": "Sır 6: Akü Testleri ve Sülfatlaşma Tuzağı",
      "content": "Sabah marşa bastınız, araba 'tık' edip kaldı ve çalışmadı. Oto elektrikçiye gittiniz, akü test cihazını bağladı. Ekranda 'Değiştir (Replace)' veya kırmızı bir ışık yandı. Anında 3.000 TL verip yeni akü alırsınız.",
      "subsections": [
        {
          "subtitle": "Kaçak Akım (Parasitic Draw) ve Sülfatlaşma",
          "text": "Akünün marş basmaması her zaman akünün tamamen öldüğü (plakaların eridiği) anlamına gelmez. Akü sadece 'derin deşarj' olmuş olabilir. Siz uyurken aracın içindeki sonradan takılan bir multimedya ekranı, kısa devre yapan bir bagaj lambası veya hatalı takılmış bir araç kamerası sürekli düşük amper çekerek (parasitic draw) aküyü bitirmiş olabilir. Veya kutup başlarındaki (terminallerdeki) beyaz oksitlenme akımın marş motoruna geçmesini engelliyordur."
        },
        {
          "subtitle": "Kritik Müdahale",
          "text": "Akü test cihazları akü derin deşarj olduğunda iç direnci yüksek okuduğu için 'Değiştir' uyarısı verir. Yeni akü almadan önce akünüzün saf dışarıdan profesyonel bir akü şarj aletiyle (desülfatör özellikli) yavaş (trickle) şarj edilmesini isteyin. Akünüz büyük ihtimalle dirilecektir. Daha önemlisi, aracı kapattıktan sonra multimetre ile 'Kaçak Akım' testi yaptırıp aküyü boşaltan asıl paraziti bulun; yoksa yeni aldığınız akü de bir hafta içinde yine bitecektir."
        }
      ]
    },
    {
      "type": "step",
      "title": "Sır 7: Arıza Tespit Cihazı (OBD) Sömürüsü (Elçiyi Öldürmek)",
      "content": "Gösterge panelinde Sarı Motor Arıza Lambası (Check Engine Light) yandığında usta bilgisayara (OBD tarayıcıya) bağlar. Ekranda örneğin 'P0420 - Katalizör Sistemi Verimi Eşik Değerin Altında' veya 'P0171 - Sistem Çok Fakir' gibi kodlar çıkar. Usta kodu gördüğü an 'Katalizörü değiştireceğiz (30.000 TL)' veya 'Oksijen Sensörü bozuk, değişecek (5.000 TL)' der.",
      "subsections": [
        {
          "subtitle": "Teşhis Bilgisizliği",
          "text": "En büyük ustalık hatası (veya hilesi) bilgisayarın ekrana yansıttığı parçayı 'bozuk parça' sanmaktır. Oysa Oksijen (Lambda) sensörü veya MAP/MAF sensörleri birer 'haberci/ölçümcü'dür. Eğer hava emiş hortumunda parmak ucu kadar bir delik varsa (vakum kaçağı), motora ölçülmemiş fazla hava girer. Oksijen sensörü bu fazla havayı egzozda okur ve beyne 'Sistem çok fakir yanıyor!' diye hata kodu gönderir. Burada oksijen sensörü bozuk değildir, görevini mükemmel yapıyordur!"
        },
        {
          "subtitle": "Kritik Müdahale",
          "text": "Kodu okuyup sensörü veya katalizörü doğrudan çöpe atan ustalardan uzak durun. Arızanın kaynağı genellikle motorun dış çevresindeki çok daha ucuz mekanik bir sorundur (Kirli hava filtresi, yırtık vakum hortumu, tıkanmış yakıt enjektörü, kaçıran bir conta). Bilgisayar size sorunun 'nerede' olduğunu değil, sorunun 'hangi sistemde yankılandığını' söyler. Doğru teşhis, duman testi (smoke test) ve canlı veri okumasıyla (live data analysis) yapılır. Elçiyi vurmalarına asla izin vermeyin!"
        }
      ]
    }
  ];

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Expanded mechanic secrets guide successfully!');
} else {
  console.log('Guide not found.');
}
