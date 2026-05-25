const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  // We will rebuild the entire sections array to ensure no data is lost and all new dense data is added perfectly.
  const newSections = [
    {
      "type": "intro",
      "content": "Oto galericilik, dışarıdan bakıldığında lüks arabalara binip, takım elbiseyle çay içerek, oturduğu yerden sadece telefon görüşmeleriyle on binlerce lira kazanılan kolay, havalı ve zahmetsiz bir meslek gibi görünebilir. Özellikle sosyal medyada pompalanan 'genç yaşta premium araçlarla gezen galerici' imajı, dışarıdaki birçok insanı bu sektöre heveslendirmektedir.\n\nOysa madalyonun diğer yüzü, dışarıdan görünen o şatafatlı vitrinden çok ama çok farklıdır! İkinci el motorlu kara taşıtı ticareti, modern ekonomilerde otomotiv perakendeciliğinin en dinamik, en yüksek işlem hacmine sahip ve çarpan etkisi en geniş alt sektörlerinden birini temsil etmektedir.\n\nTürkiye makroekonomik konjonktürü içerisinde değerlendirildiğinde, otomobillerin salt bir ulaşım aracı olma vasfından çıkarak, yüksek enflasyonist dönemlerde değer koruma ve yatırım aracına dönüşmesi, bu sektöre yönelik ilgiyi ve sermaye akışını eksponansiyel biçimde artırmıştır. Geçmiş yıllarda 'ayaklı galericilik' olarak tabir edilen, herhangi bir mesleki yeterliliğe, fiziki standarda veya mali sorumluluğa dayanmayan kayıt dışı alım-satım işlemleri, piyasada ciddi asimetrik bilgi problemlerine, vergi kayıplarına ve tüketici mağduriyetlerine yol açmıştır.\n\nBu yapısal sorunların çözümü, haksız rekabetin ortadan kaldırılması ve sektörün tamamen kurumsal bir ekosisteme entegre edilmesi amacıyla Ticaret Bakanlığı, Çevre ve Şehircilik Bakanlığı ile İçişleri Bakanlığı koordinasyonunda devasa bir hukuki regülasyon süreci başlatılmıştır. İkinci El Motorlu Kara Taşıtlarının Ticareti Hakkında Yönetmelik ve İşyeri Açma ve Çalışma Ruhsatlarına İlişkin Yönetmelik ekseninde şekillenen bu yeni dönem, oto galeri işletmeciliğini vizyonsuz bir ticari faaliyet olmaktan çıkarıp, çok sıkı denetim mekanizmalarına, yüksek asgari sermaye gereksinimlerine ve ağır yasal garanti sorumluluklarına sahip saygın bir kurumsal finansal perakendecilik modeline dönüştürmüştür.\n\nİşte tam da bu yüzden hazırladığımız bu mega rehberde, kulaktan dolma kahvehane efsanelerini bir kenara bırakıyoruz. Hayallerinizdeki oto galeriyi sıfırdan kurup, sadece araba heveslisi olan sıradan birinden, piyasanın yönünü tayin eden saygın bir ticaret kurduna dönüşmeniz için gereken tüm bürokratik, finansal ve psikolojik adımları en ince ayrıntılarıyla masaya yatırıyoruz.",
      "warning": {
        "title": "Piyasa Kulağı",
        "text": "Asla 'Ben bu arabayı ucuza aldım, her türlü kâr ederim' yanılgısına düşmeyin. Bazen ucuza alınan arabanın arkasında, o arabanın piyasasının tamamen durmuş olması veya kronik bir motor arızasının gizlenmiş olması gerçeği yatar."
      },
      "tip": {
        "title": "Altın Kural",
        "text": "Günümüzde yasal ve tam yetkili bir işletme kurmak; imar hukukundan iş sağlığı ve güvenliğine, bankacılık regülasyonlarından tüketici haklarına kadar uzanan geniş bir yelpazede multidisipliner bir uyum sürecini zorunlu kılmaktadır."
      }
    },
    // STEP 1
    {
      "type": "step",
      "title": "Adım 1: Psikolojik Hazırlık ve Ticaret Zekası",
      "content": "Bir araca aşık olabilirsiniz, küçüklüğünüzden beri hayalini kurduğunuz o markayı sürmek için yanıp tutuşabilirsiniz, ancak ticarette 'duygulara' yer yoktur. Eğer galerinizdeki bir arabayı kendinize aitmiş gibi benimser ve onunla duygusal bir bağ kurarsanız, satma vakti geldiğinde gerçekçi bir fiyat koyamazsınız veya satmak istemezsiniz; bu da paranın dönüşünü (sirkülasyonu) durdurur. İkinci el otomobil ticareti vahşi bir ormandır ve bu ormanda hayatta kalmak istiyorsanız, kapıdan içeri giren her araca bir metal yığını ve potansiyel bir kar marjı olarak bakmalısınız. Ticaret zekası dediğimiz şey; piyasanın o anki ateşini ölçebilmek, panik satışlarında arabayı dipten toplamak ve herkes arabaya saldırırken zirveden satıp nakde geçebilmektir.",
      "subsections": [
        {
          "subtitle": "Duygusal Bağ Kurmamak",
          "text": "Galericilikteki ilk altın kural şudur: Sattığınız hiçbir araç sizin şahsi aracınız değildir, hepsi sadece birer 'ticari metadır'. Çoğu hevesli galerici, kendi beğendiği ve zevkine uygun, özel renkli veya çok dolu donanımlı (fakat piyasası yavaş) araçları alır. Ancak sizin çok sevdiğiniz o elektrik kırmızısı, 3.0 motor coupe araç, piyasada alıcı bulamayan niş bir model olabilir. Piyasada ne hızlı dönüyorsa, beyaz renkli sıradan, manuel vitesli, kapak jantlı bir sedan dahi olsa onu almalısınız. Arabayı alırken 'Bunu ben hafta sonu binerim, eşim dostum görür' diye düşünüyorsanız, zaten o ticarete 1-0 yenik başlamışsınız demektir. Sizin göreviniz o metal yığınını en hızlı şekilde nakde çevirmektir. Duygusal zayıflık gösterip araca bağlanırsanız, müşterinin yaptığı makul bir fiyat kırma teklifini gurur meselesi yapar, ticareti kilitler ve paranızı o araca aylarca hapsedersiniz.",
          "points": [
            "Galerinizdeki arabalar oyuncak değil, banknottur. Onlara obje gözüyle bakın.",
            "Özel zevklerinizle piyasa gerçeklerini birbirine karıştırmayın.",
            "Müşterinin arabayı eleştirmesini (çizik var, boya solmuş) kişisel algılamayın; bu sadece bir pazarlık argümanıdır."
          ]
        },
        {
          "subtitle": "Kurtlar Sofrasına Girmek ve Yalan Dedektörü Olmak",
          "text": "Bu piyasa dürüst insanların olduğu kadar, dolandırıcıların, kurnazların, kilometreyi düşürenlerin ve merdiven altı tamircilerin de kol gezdiği acımasız bir ekosistemdir. 'Abi araç ilk elden, hatasız, doktordan' diyen bir satıcının gözünün içine bakarken, onun beden dilini okumalı, aynı zamanda profesyonelce yalan söylüyor olabileceği ihtimalini %100 cebinizde tutmalısınız. Herkesle tokalaşacak kadar sıcak, ama kimsenin sözüne ekspertiz raporu olmadan inanmayacak kadar soğuk ve şüpheci olmalısınız. Kriz yönetimi bu işin bel kemiğidir. Örneğin, kapora verdiğiniz araçta devir esnasında noter ekranında haciz çıkarsa veya eksperde motor blokunda gizlenmiş büyük bir kaynak izi fark ederseniz sinir krizi geçirmek yerine, hızlıca masadan kalkmayı ve o kaporayı/zamanı başka bir ticarette nasıl çıkaracağınızı saniyeler içinde planlamalısınız."
        }
      ]
    },
    // STEP 2
    {
      "type": "step",
      "title": "Adım 2: Hukuki Statü, Yasal Zorunluluklar ve İETTS Regülasyonları",
      "content": "Eskiden bir dükkan kiralayıp camına 'Oto Galeri' yazmak ve birkaç araba çekmek bu işe başlamak için yeterliydi. Ancak günümüzde Ticaret Bakanlığı'nın getirdiği devasa hukuki regülasyonlar sayesinde galericilik çok sıkı bir bürokratik zemine oturtuldu. Yasal zorunlulukları yerine getirmeden satacağınız her araç, kapınıza dayanacak devasa maliye cezaları ve noter engelleri anlamına gelir.",
      "subsections": [
        {
          "subtitle": "1. Şirket Türleri ve Asgari Sermaye Regülasyonları",
          "text": "İkinci el motorlu kara taşıtı ticaretine giriş yapacak bir yatırımcının atması gereken ilk stratejik adım, işletmenin hukuki statüsünün belirlenmesidir. Ticari faaliyetler şahıs işletmesi statüsünde yürütülebilse de, sektörün barındırdığı yüksek finansal riskler ve ticari kredibilite açısından sermaye şirketleri (Limited veya Anonim) açık ara en rasyonel tercihtir.\n\nTicaret Bakanlığı'nın 1 Ocak 2024 tarihinden itibaren geçerli olan düzenlemeleri (7887 Sayılı Karar) uyarınca, yeni kurulacak limited şirketler (Ltd. Şti.) için asgari sermaye tutarı 50.000 Türk Lirasına yükseltilmiştir. Anonim şirketler (A.Ş.) söz konusu olduğunda ise başlangıç sermayesi alt sınırı 250.000 TL'ye; kayıtlı sermaye sistemini kabul etmiş olanlar içinse 500.000 TL'ye sabitlenmiştir. Bu, tabela şirketlerinin ve finansal derinliği olmayan spekülatif aktörlerin piyasaya girişini engellemeyi amaçlayan makro ihtiyati bir tedbirdir."
        },
        {
          "subtitle": "2. Oda Kaydı, Mesken Altı Yasağı ve Tapu Kütüğü",
          "text": "Şirket kurulumu sonrası, bulunduğunuz ilin Ticaret Odasına veya Esnaf ve Sanatkarlar Odasına müracaat etmeniz yasal mecburiyettir (Örneğin İzmir'de İzmir Şoförler ve Otomobilciler Esnaf Odası'na bağlı Oto Galericiler Odası).\n\nİş yeri kiralarken dikkat edilecek en mutlak kural 'mesken altı yasağı'dır. Tapu kütüğünde, 'mesken' (konut) olarak tescil edilmiş tek bir bağımsız bölüm dahi bulunan binalarda (zemin kat dükkan bile olsa) oto galeri işletilmesine müsaade edilmemektedir. İşletmenin açılabilmesi için binanın imar planında mutlak surette 'ticaret' veya 'karma kullanım' fonksiyonuna sahip olması gerekmektedir."
        },
        {
          "subtitle": "3. Mesleki Yeterlilik (MYK Seviye 5) ve Eğitim İstisnaları",
          "text": "İşletmeyi temsil ve ilzama yetkili yöneticinin 'Motorlu Kara Taşıtları Alım Satım Sorumlusu (Seviye 5)' belgesini alması şarttır. Bu sınavlar otomotiv mevzuatı, tüketici kanunu (yazılı test) ve doğrudan araç başında ekspertiz yeteneğini ölçen (uygulamalı test) 10 günlük bir süreci kapsar.\n\n29 Nisan 2026 tarihli devrim niteliğindeki mevzuat değişikliği ile 'en az lise mezunu olma' şartı kaldırılmış, ilköğretim (ilkokul) diploması yeterli hale getirilmiştir. Ayrıca 15 Ağustos 2020 öncesi gelir vergisi mükellefiyeti olanlar bu şarttan tamamen muaf tutulmuştur. Başvuranların sabıka kaydı temiz olmalı, iflas geçmişleri varsa yasal iade-i itibar kararı almış olmaları gerekmektedir."
        },
        {
          "subtitle": "4. İETTS Sistemi, Yetki Belgesi ve 2026 Harç Tutarları",
          "text": "Fiziki ruhsatlandırma bittiğinde, noter satış engelini kaldırmak için e-Devlet entegreli İETTS (ietts.ticaret.gov.tr) portalı üzerinden 'Yetki Belgesi' başvurusu yapılmalıdır. Sisteme yüklenmesi gereken evraklar; Oda Kayıt Belgesi, Vergi Levhası, MYK Belgesi, Öğrenim Durumu, Adli Sicil Kaydı, İmza Sirküleri, İşyeri Ruhsatı ve Mali Sorumluluk Sigorta Poliçesidir.\n\n2026 yılında yürürlüğe konan sistemle yetki belgeleri harca bağlanmıştır:\n- Nüfusu 30.000'in altında olan ilçeler ve Büyükşehir olmayan iller: 20.000 TL\n- Büyükşehir Belediyesi sınırları ve metropol ilçeler: 40.000 TL\nBu asgari harç tutarları Dijital Vergi Dairesi üzerinden ödenerek makbuzu sisteme yüklenir."
        }
      ],
      "warning": {
        "title": "Noter Sistem Engeli",
        "text": "İkinci El Motorlu Kara Taşıtı Ticareti Yetki Belgesi olmayan işletmeler, noter sistemi (ARTES) üzerinden vekaletle bile olsa ticari satış yapamazlar. Sistemi kandırmaya çalışıp eş/dost üzerine yapılan satışlar Maliye tarafından tespit edildiğinde geriye dönük devasa usulsüzlük cezaları kesilmektedir."
      }
    },
    // STEP 3
    {
      "type": "step",
      "title": "Adım 3: Sermaye Yönetimi, BDDK Kredileri ve Asgari Bütçe Planlaması",
      "content": "Otomobil ticareti, dışarıdan bakıldığında nakit paranın su gibi aktığı bir okyanus gibi görünse de; yanlış bütçe yönetimi yapıldığında o okyanusta boğulmanız an meselesidir. Oto galeri açmak, hukuki bariyerlerin ötesinde olağanüstü bir finansal planlama ve likidite yönetimi gerektirir.",
      "subsections": [
        {
          "subtitle": "1. BDDK Makro İhtiyati Tedbirleri ve Taşıt Kredileri (LTV Oranları)",
          "text": "Galerilerin satış hızını belirleyen en yaşamsal faktör, tüketicinin taşıt kredisine erişimidir. BDDK'nın güncel Kredi Değer Oranı (Loan-to-Value) kurallarına göre:\n- Değeri 700.000 TL ve altında olan araçlar için en fazla %50 kredi kullandırılır (Maks. 350.000 TL) ve vade 48 aydır.\n- 700.000 TL ile 1.100.000 TL arası araçlarda kredi %30'a düşer ve vade daralır.\n- 1.100.000 TL'yi aşan premium araçlarda kredi muslukları kapanır (aracın değerine oranla marjinal bir kredi çıkar).\nAyrıca bankalar krediye konu edilecek ikinci el araçlarda en fazla 8 yaş sınırı uygular. Aylık kredi faizlerinin %3,84 seviyelerinde olduğu bir ortamda sermayeyi 10 yaş üstü, yavaş devreden araçlar yerine, BDDK kredilerine uygun, 8 yaş altı (700k-1.1M bandındaki) 'hızlı döner' araçlara yatırmak hayati önem taşır."
        },
        {
          "subtitle": "2. Sabit Giderler ve 'Operasyonel Bütçe Kalkanı'",
          "text": "Sermayenizin tamamını arabalara bağlamadan önce, dükkanınızın en az 6 aylık sabit giderini (Operasyonel Bütçe Kalkanı) likit olarak hazır tutmalısınız. Piyasaların tamamen durduğu, kredi faizlerinin tavan yaptığı dönemlerde elinde 10 tane arabası olup kamerasının veya personelinin parasını ödeyemediği için elindeki arabayı %20 zararına (ölü fiyata) satmak zorunda kalan galericiler, işte bu kalkanı oluşturmayanlardır."
        },
        {
          "subtitle": "3. Revizyon ve Sürpriz Masraf Bütçesi",
          "text": "Bir aracı noterde üstünüze aldığınızda iş bitmez. O aracın vitrine çıkıp (showroom kondisyonuna) satılmaya hazır hale gelmesi için mutlaka önceden ayrılmış bir revizyon bütçesi olmalıdır (Kuaför, boyasız göçük, rötüş). Ayrıca motor revizyonları veya sonradan ortaya çıkabilecek gizli arızalar için mutlaka kasanızda bir 'Sürpriz Masraf' (Amortisman) fonu olmalıdır."
        }
      ],
      "table": {
        "headers": ["Maliyet Kalemi / Harcama Türü", "Açıklama ve Detaylar", "Tahmini Ortalama Tutar"],
        "rows": [
          ["Dükkan Kirası ve Depozito", "Metropollerde 80m² asgari ticari alanın ilk ay kirası ve yasal teminatı", "20.000 TL (Minimum)"],
          ["MYK Seviye 5 Belge Ücreti", "Eğitim, yetkili kuruma ödenen sınav ve sertifikasyon harcı", "14.500 TL"],
          ["Meslek Odası ve Şirket Kuruluşu", "Ticaret odası kayıt harçları, mali müşavirlik açılış masrafları", "7.000 TL"],
          ["Ofis ve Güvenlik Altyapısı", "Müşteri bekleme salonu, donanımlar, 7/24 gece görüşlü kameralar", "80.000 TL"],
          ["Dijital İlan Platformu Üyeliği", "İlan sitelerinde kurumsal mağaza aktivasyon bedelleri", "16.000 TL"],
          ["Yetki Belgesi Harcı (Devlet)", "Büyükşehir sınırları içerisinde yer alan işletmeler için uygulanan tarife", "40.000 TL"],
          ["Başlangıç Araç Envanteri", "Adet fiyatı ortalama 500k TL olan 3 adet alt-orta segment ikinci el stok", "1.500.000 TL"],
          ["TOPLAM ASGARİ SERMAYE", "Operasyonlara sorunsuz başlayabilmek için gereken tahmini bütçe", "~1.677.500 TL"]
        ]
      },
      "warning": {
        "title": "Kar Marjı Yanılgısı",
        "text": "Satıştan elde ettiğiniz brüt kârın tamamı sizin değildir! Bu asgari kurulum maliyetlerini, ilan masrafını ve vergiyi düştüğünüzde cebinize kalan 'net kâr' gerçek bütçenizi oluşturur."
      }
    },
    // STEP 4
    {
      "type": "step",
      "title": "Adım 4: Fiziki İş Yeri Standartları, İmar ve Gayrimenkul Seçimi",
      "content": "Bir oto galeri açarken yapılan en büyük stratejik hatalardan biri, 'kirası çok ucuz' diye şehrin ücra bir köşesinde, ayak altı olmayan veya otomobil ekosisteminden tamamen uzak rastgele bir dükkan tutmaktır. Hukuki olarak 'Üçüncü Sınıf Gayrisıhhi Müesseseler' statüsünde sınıflandırılan oto galeri iş yerleri, ruhsat alabilmek için İşyeri Açma ve Çalışma Ruhsatlarına İlişkin Yönetmeliğin 8.14 maddesindeki iç mimari koşulları harfiyen yerine getirmek mecburiyetindedir.",
      "subsections": [
        {
          "subtitle": "1. 80 Metrekare Kuralı ve Ortak İş Yeri",
          "text": "Tek bir tacir tarafından işletilecek olan bir oto galerinin kapalı ve açık faaliyet alanlarının toplamı en az 80 metrekare olmak zorundadır. Bu alanın en az 60 metrekaresi idari ofislerden izole edilerek doğrudan araç teşhir alanı yapılmalıdır. Regülasyonlar 'ortak iş yeri' kavramına (aynı adreste en fazla 2 tacir) müsaade eder; ancak bu durumda asgari alan iki katına çıkar (Toplam 160m², teşhir 120m²)."
        },
        {
          "subtitle": "2. Tavan Yüksekliği, LPG Yasağı ve Kaldırım İşgali",
          "text": "Teşhir alanlarının net tavan yüksekliğinin en az 3 metre olması zorunludur. Bu, kapalı alanlardaki egzoz emisyon tahliyesi ve karbonmonoksit birikimini engellemek için hayati bir standarttır.\n\nGüvenlik bağlamında sıvılaştırılmış petrol gazı (LPG) veya doğalgaz (CNG/LNG) ile çalışan araçların kapalı teşhir alanlarında sergilenmesi infilak riski sebebiyle kesinlikle yasaktır; bu araçlar açık hava alanında sergilenmelidir. Ayrıca geçmişte yaya trafiğini felç eden kaldırım işgalleri tamamen yasaklanmış olup, araçlar kamusal yollarda veya apartman ortak bahçelerinde sergilenemez."
        },
        {
          "subtitle": "3. Toplu İş Yerleri ve İkinci Sınıf Gayrisıhhi Pazar Alanları",
          "text": "Devletin temel stratejisi, münferit galerilerindense Otokent, Otonomi gibi 'toplu iş yerlerini' teşvik etmektir. Müstakil galerilerin ötesinde, devasa 'İkinci El Motorlu Kara Taşıtı Pazarları' kurmak isterseniz, nüfusu 10.000'in altındaki yerlerde en az 5.000 metrekare, aşan yerlerde ise en az 10.000 metrekarelik devasa asfalta/betona ihtiyacınız vardır. Bu pazarlarda anons sistemi, oto yıkama, zabıta bürosu, ibadethane ve 3-5 adet devasa tahliye kapısı yasal zorunluluktur."
        },
        {
          "subtitle": "4. Showroom İçi Tasarım ve Psikolojik Aydınlatma Hileleri",
          "text": "Müşteri kapıdan içeri ilk adımını attığında hissettiği kalite algısı, masaya oturduğunda yapacağınız pazarlığın sınırlarını çizer. Loş, dağınık bir dükkanda yüksek bütçeli bir araç satamazsınız. Showroom tavanınızda, araçların kaput ve omuz çizgisine vuracak şekilde ayarlanmış güçlü beyaz/gün ışığı LED spotlar olmalıdır. Bu spot ışıklar, aracın kaportasına yapılan en ufak bir temizlik cilasını bile devasa bir parlamaya dönüştürür."
        }
      ],
      "tip": {
        "title": "İlk İzlenim Asla Unutulmaz",
        "text": "Dükkanınızın zemininde epoksi veya şık seramik kaplamalar kullanılması, araçların yere yansıyan silüetiyle birlikte mekana premium bir galeri havası katar. Ortam kokusu (bambu/sandal ağacı) satış psikolojisinde fiyatın kendisi kadar etkilidir."
      }
    },
    // STEP 5 (Preserved mostly as is)
    {
      "type": "step",
      "title": "Adım 5: Doğru Araç Tedariği - Nereden, Nasıl Araç Bulunur?",
      "content": "Parayı bastırıp satılacak rastgele bir araba bulmak dünyanın en kolay işidir. Asıl marifet; 'satarken size para kazandıracak' o dip fiyatlı (kelepir) aracı daha satın alma aşamasındayken bulmaktır. Eğer sadece ilan sitelerine girip, perakende (binici) fiyatlarından araç alıp üzerine kâr koyarak satmayı umuyorsanız, çok kısa sürede sermayenizi eritirsiniz.",
      "subsections": [
        {
          "subtitle": "1. Kurumsal Filo İhaleleri (Auction) ve Kiralama Dönüşleri",
          "text": "İkinci el piyasasının en büyük 'gizli toptancıları' operasyonel kiralama ve dev filo şirketleridir. 3 veya 4 yıllık kiralama süresi dolan yüzlerce aracı devasa B2B kapalı ihalelerle doğrudan galericilere satarlar. Bu ihalelere girebilmek için resmi şirketiniz ve Yetki Belgeniz olmak zorundadır. Avantajı, piyasanın (perakende vitrin fiyatının) %10 ila %15 altına şeffaf ekspertizli araç kapatabilme şansıdır."
        },
        {
          "subtitle": "2. Eş-Dost Çevresi (Network) ve Kapı Müşterisi",
          "text": "Araba satmak isteyen normal bir binici, ilan sitelerinin o yorucu telefon trafiğiyle uğraşmak istemez. Aracı doğrudan güvendiği galeriye (size) getirdiğinde, hızlıca nakde dönmenin rahatlığı karşılığında fiyatta esnemeye her zaman hazırdır. Kapı müşterileri en temiz alışları yapacağınız sıcak kaynaktır."
        },
        {
          "subtitle": "3. İlan Sitelerinde Pusuya Yatmak (Acil Nakit Arayanlar)",
          "text": "Sarı site gibi platformlarda işin sırrı tam anlamıyla pusuda beklemektir. İlanları düşük fiyata göre değil, 'İlan Tarihine (En Yeniler)' göre sıralamalı ve gün boyu sürekli F5 yapmalısınız. Ticari bir senedini ödemek için piyasanın 50.000 TL altına 'Acil' ilanı giren vatandaşı ilk 3 dakika içinde arayıp kaporayı anında atarak aracı bağlamalısınız."
        }
      ],
      "tip": {
        "title": "Takasın Gizli Gücü",
        "text": "Müşterinin getirdiği takas aracı, aslında sizin 'bedavaya' (çok ucuz bir maliyetle) tedarik ettiğiniz yeni bir sermayedir. Kendi aracınızdan fiyat kırmayın, ancak müşterinin aracını pazar fiyatının %10-%15 altından sayarak içeri alın."
      }
    },
    // STEP 6 (Preserved completely as requested earlier)
    {
      "type": "step",
      "title": "Adım 6: Şahin Gözü Ekspertiz (Kazalı Aracı Koklamak)",
      "content": "İkinci el araç piyasasında satıcıların meşhur 'Sadece ufak bir sürtmeden dolayı kapıda ince temizlik boyası var' yalanları, bu sektörün adeta milli marşıdır. İlgilendiğiniz her aracı doğrudan bilgisayarlı ekspertize sokma lüksünüz yoktur. Sizin göreviniz, araca ilk baktığınız o 3 dakika içinde aracın ağır kazalı olup olmadığını koklayarak anlamaktır.",
      "subsections": [
        {
          "subtitle": "1. Kaporta ve Boya Dedektifliği (Işık ve Yansıma Hileleri)",
          "text": "Bir araca asla tam karşıdan veya dik bir açıyla bakmayın. Aracın farından arka stop lambasına doğru uzanan o yan omuz çizgisine paralel (çapraz) ve hafif eğilerek bakın. Orijinal boya cam gibi düzken, sonradan atılmış boya 'portakal kabuğu' dalgalı yansıma yapar. Parçalar arasındaki derz boşlukları milimetrik olarak farklıysa o parça sökülüp takılmıştır."
        },
        {
          "subtitle": "2. Şase, Podye ve Direklerin Gizli Şifresi",
          "text": "Kaputu açtığınızda doğrudan çamurlukları kasaya bağlayan somun/cıvatalara odaklanın. Fabrika çıkışı cıvatalarda anahtar izi, çizik veya boya atması olamaz. En hayati nokta şase uçlarındaki fabrika puntolarıdır. Erimiş metal görüntüsü düzensizse veya kalın siyah Dayson silikon çekilmişse araç ağır kazalıdır."
        },
        {
          "subtitle": "3. Airbag (Hava Yastığı) ve Emniyet Kemeri Hileleri",
          "text": "Patlamış airbagleri orijinaliyle değiştirmek pahalı olduğu için direnç atılır. Bunu anlamanın ücretsiz yolu Emniyet Kemerleridir. Kemerin en alt/dip kısmında beyaz bir fabrika üretim etiketi bulunur. O etikette yazan üretim yılı ile aracın ruhsattaki model yılı mutlaka aynı olmalıdır (veya 1 yıl öncesi). Etiket farklıysa kemerler ve airbagler patlamış demektir."
        }
      ],
      "warning": {
        "title": "Mikron Cihazı Her Şey Değildir",
        "text": "Acemi galericiler boya ölçüm cihazına körü körüne güvenir. Cihaz tavanı 100 mikron orijinal gösterebilir. Ancak uyanık bir kaportacı, ağır kazalı arabanın tavanını direklerden kesip, hurdacıdan aldığı aynı renk orjinal tavanı kaynakla oturtmuş (ekleme/kaynak araç) olabilir."
      }
    },
    // STEP 7 (Preserved completely as requested earlier)
    {
      "type": "step",
      "title": "Adım 7: Fiyatlandırma Stratejisi: 3'lü Matematik Sistemi",
      "content": "İkinci el araç alım-satımında yapılan en ölümcül hata, aracın fiyatını ilan sitelerindeki en yüksek fiyatlı emsallerine bakarak hayalperest bir ruh haliyle belirlemektir. Gerçek piyasa fiyatı, sitede aylarca asılı kalan rakam değil, 'aracın gerçekten noterde el değiştirdiği' rakamdır.",
      "subsections": [
        {
          "subtitle": "1. Kör Alış Fiyatı (Acil Nakde Dönüş / Taban Fiyat)",
          "text": "Kredi faizleri fırlar veya acil nakde sıkışırsanız, aracı hemen o gün diğer galericilere ('esnaf/ölücü' piyasasına) kaça satabileceğinizin hesaplanmasıdır. Bu aracın mutlak dip/taban fiyatıdır. O aracı satın alırken ödediğiniz rakam, hiçbir koşulda bu Kör Alış Fiyatı'nın çok üzerine çıkmamalıdır."
        },
        {
          "subtitle": "2. Pazar Fiyatı ve Emsal Temizliği (Gerçek Değer)",
          "text": "Pazar fiyatını belirlemek için ilan sitelerinde birebir kendi aracınızın emsallerini fiyata göre sıralayın. En baştaki 3 'ağır hasarlı/sorunlu' ilanı ve en sondaki 5 'hayalperest' ilanı silin. Ortada kalan homojen yığın, aracın gerçek Pazar Fiyatıdır. Net satış fiyatınızı buraya konumlandırın."
        },
        {
          "subtitle": "3. Vitrin (İlan) Fiyatı ve Psikolojik Pazarlık Marjı",
          "text": "Türk insanı pazarlık yapmadan araba almaz! Pazar fiyatının (Gerçek Değer) üzerine %2 ila %4 oranında 'pazarlık marjı' ekleyerek İlan Fiyatınızı oluşturun. Müşteri geldiğinde fiyattan kıran kırana 25.000 TL ikram yaptığınızda müşteri zafer kazandığını düşünürken siz de hedefe 12'den vurmuş olursunuz."
        },
        {
          "subtitle": "4. OtoSöz'ün Teknolojik Gücü: OtoHesap Al-Sat Analizi",
          "text": "Tüm bu komisyon, vergi, noter, ekspertiz ve yatırım getirisini (ROI) manuel hesaplamak hata yapmaya açıktır. Mutlaka sitemizdeki **[OtoHesap Al-Sat Kâr/Zarar Hesaplama](/otohesap/al-sat)** aracını kullanın! Net nakdinizi saniyeler içinde çıkaran bu aracı kullanmadan hiçbir ticaret masasına oturmayın."
        }
      ],
      "tip": {
        "title": "Veri Odaklı Karar",
        "text": "Zarar ettiğinizi gösteren hiçbir pazarlık masasında 'müşteriyi kaçırmayayım' diyerek oturmaya devam etmeyin. Sayılara güvenin."
      }
    },
    // STEP 8
    {
      "type": "step",
      "title": "Adım 8: Dijital Pazarlama, Vitrin Stratejileri ve Fiyatlama Regülasyonları",
      "content": "Fiziksel teşhir alanlarının kusursuzluğu kadar, günümüz tüketici alışkanlıkları ekseninde araçların dijital ilan platformlarında nasıl konumlandırıldığı da galerinin karlılığını doğrudan etkilemektedir. Tüketicilerin %90'ından fazlası, fiziki olarak bir oto galeriye adım atmadan aylar önce, pazar araştırmasını ana akım ilan platformları (Sarı site vb.) üzerinden yürütmektedir.",
      "subsections": [
        {
          "subtitle": "1. Kurumsal Hesap (Mağaza) Açılışı",
          "text": "Kurumsal bir imaj çizebilmek ve algı yönetimini optimize edebilmek için oto galerilerin bu platformlarda bireysel üyelikler yerine, yıllık ciddi maliyetlere (ortalama 16.000 TL ve üzeri) katlanarak 'Kurumsal Hesap' (Mağaza) statüsünde yer almaları yasal ve ticari bir zorunluluktur."
        },
        {
          "subtitle": "2. HTML Optimizasyonu ve Açıklama Disiplini",
          "text": "İlan açıklamalarının rengarenk, göz yoran, büyük puntolu karmaşık fontlardan arındırılması elzemdir. Bilgi verici, aracın bakım geçmişini, ekspertiz durumunu (boyalı/değişen parçalar) şeffafça ortaya koyan, HTML formatının imkan tanıdığı kalın (bold) metinler ve renkli çerçevelerle hiyerarşik bir düzene oturtulmuş içerikler, alıcının karar verme sürecini hızlandırır."
        },
        {
          "subtitle": "3. İlan Fiyatı Sınırlamaları ve Ticaret Bakanlığı Denetimi",
          "text": "Dijital pazarlama artık serbest piyasa anarşisinden çıkıp yasal sınırlara tabi olmuştur. Ticaret Bakanlığı'nın yönetmeliği uyarınca, ilan platformlarına girilen ikinci el araç satış fiyatları, ilgili markanın ve modelin sıfır kilometre (distribütör tavsiye edilen) perakende liste fiyatını kesinlikle aşamaz. Bu kuralı ihlal eden hesap sahiplerinin bilgileri devasa idari para cezaları uygulanmak üzere doğrudan Ticaret Bakanlığı'na raporlanmaktadır."
        }
      ],
      "tip": {
        "title": "Detaylı Arama Vitrini (Doping)",
        "text": "Platformların sunduğu 'Detaylı Arama Vitrini' gibi doping araçları, standart aramalardan ziyade spesifik, niş ve yüksek katma değerli (örneğin cabriolet spor veya premium SUV'lar) araçları hedefleyen alıcı kitlesine nokta atışı ulaşmak için stratejik olarak kullanılmalıdır."
      }
    },
    // STEP 9
    {
      "type": "step",
      "title": "Adım 9: Satış, Noter Operasyonları, Garanti ve Güvenli Ödeme Sistemi",
      "content": "Oto galeri açılış sürecinin tamamlanması ve aracın satılması, yasal yükümlülüklerin bittiği değil, aksine en ağır sorumlulukların başladığı andır. Ticaret Bakanlığı'nın regülasyonları, galericileri sıradan bir aracı olmaktan çıkarıp, sattığı ürünün arkasında durmak zorunda olan yasal bir 'garantör' konumuna yerleştirmiştir.",
      "subsections": [
        {
          "subtitle": "1. Güvenli Ödeme Sistemi (Escrow Emanet Hesabı)",
          "text": "Ticaret Bakanlığı ve Türkiye Noterler Birliği (TNB) iş birliğiyle, 27 Eylül 2024 tarihi itibarıyla Türkiye'deki tüm ikinci el motorlu kara taşıtı işlemlerinde 'Güvenli Ödeme Sistemi' zorunlu hale gelmiştir. Satıcı bilgileri banka sistemine girer, alıcıya bir referans kodu gider. Alıcı parayı özel bir 'takas havuzu (escrow)' hesabına gönderir. Noterde imzalar atılıp ruhsat tescili yapıldığı saniye, API entegrasyonu tetiklenir ve havuzda bloke bekleyen para saliseler içinde otomatik olarak galerinin hesabına geçer. Nakit taşıma riski, sahte para ve dolandırıcılık tamamen bitmiştir."
        },
        {
          "subtitle": "2. Zorunlu Ekspertiz Raporu ve İstisnalar",
          "text": "Yetki belgesine sahip bir oto galeri, aracı satmadan azami 3 gün önce, TSE hizmet yeterlilik belgesine sahip bağımsız bir oto ekspertiz merkezinden onaylı bir rapor almak zorundadır. Bu rapor noterlikteki devir işlemi sırasında ibraz edilip sisteme işlenir. Ancak bu zorunluluğun iki büyük istisnası vardır: Satışa konu araç 8 yaşın üzerinde VEYA kilometresi 160.000 kilometreyi aşmış durumdaysa, galeri zorunlu ekspertizden muaftır."
        },
        {
          "subtitle": "3. Yasal Garanti Yükümlülüğü (6 Ay / 6.000 Km)",
          "text": "Yetki belgeli bir galeri tarafından satılan ikinci el araçlar, satış tarihinden itibaren 6 ay veya 6.000 kilometre boyunca galerinin yasal garantisi altındadır. Bu garanti çizik/balata gibi kozmetik/periyodik parçaları değil; Motor, Şanzıman, Tork Konvertörü, Diferansiyel ve Elektrik sistemini kapsar. Arıza çıkarsa galeri azami 3 ay (90 gün) içerisinde hiçbir ücret talep etmeksizin tamir ettirmek zorundadır. Bu kural 'toplama araç' (pert kayıtlı makyajlı araç) dönemini fiilen bitirmiştir."
        },
        {
          "subtitle": "4. Piyasa Müdahalesi: '6 Ay ve 6 Bin Kilometre' Kuralı",
          "text": "Sıfır araçların galericiler tarafından stoklanıp karaborsada fahiş fiyatla satılmasını engellemek için kurulan bu sistemde; işletmeler kendi adlarına ilk tescilini aldıkları araçları, üzerinden 6 ay geçmedikçe ve en az 6.000 kilometre yapmadıkça satamazlar. 1 Temmuz 2026 tarihine kadar uzatılan bu devasa piyasa müdahale kuralı, noter sistemi üzerinden otomatik blokajla korunmaktadır."
        }
      ]
    },
    // STEP 10 (Preserved completely)
    {
      "type": "step",
      "title": "Adım 10: Satış Sonrası Hizmet ve Kalıcı Güven İnşası",
      "content": "Gerçek servet, bir müşteriye tek bir araba satıp 50 bin TL kazanmaktan değil; o müşterinin güvenini kazanıp onun kardeşine, babasına, komşusuna ve ofis arkadaşlarına da yıllar içinde onlarca araba satabilmekten (sadakat ağından) gelir. Satış sonrası (after-sales) sunduğunuz destek ve şeffaflık, Google reklamlarına veya billboardlara harcayacağınız milyonlarca liradan çok daha etkili bir pazarlama stratejisidir.",
      "subsections": [
        {
          "subtitle": "1. İlk 72 Saat Kuralı ve Proaktif İletişim Şoku",
          "text": "Fark yaratmanın altın kuralı 'İlk 72 Saat' kuralıdır. Aracı teslim ettikten tam 2 gün sonra müşterinizi telefonla arayıp 'Sormak istediğiniz bir şey var mı?' demek, müşterinin bilinçaltında 'Bu adam sattığı malın sonuna kadar arkasında duruyor' hissini çelik gibi sağlamlaştırır."
        },
        {
          "subtitle": "2. Kriz Anında Sorumluluk Almak (Zararı Satın Almak)",
          "text": "Müşteri arabayı aldıktan 2 hafta sonra mekanik bir arızayla sizi panikle aradığında telefonu meşgule atmayın! Çekiciyi yollayın ve masrafın örneğin yarısını veya işçiliğini cebinizden karşılayın (Zararı Satın Almak). Kasanızdan çıkacak o masraf, o mutlu müşterinin sırf bu dürüstlüğünüz yüzünden size ileride getireceği 3 yeni müşterinin kârının yanında bir hiçtir."
        },
        {
          "subtitle": "3. CRM Mantığı, Yıllık Hatırlatmalar ve VİP (Sadakat) Hizmetleri",
          "text": "Müşterilerinizin satış kayıtlarını (muayene tarihi vb.) CRM'de tutun. 10.000 km periyodik yağ bakım tarihi geldiğinde müşterinize indirimli servis randevusu öneren bir mesaj atın. Bu VİP dokunuşlar, o müşteri 2 yıl sonra model yükseltmek istediğinde anahtarı doğrudan sizin masanıza bırakmasını garanti altına alır."
        }
      ],
      "tip": {
        "title": "Mutlu Müşteri Portföyü (Referans Duvarı)",
        "text": "Araç teslimi yaparken müşterilerinizle fotoğraf çekilip sosyal medyada 'Mutlu Teslimatlarımız' serisi olarak paylaşın. İnsanlar başkalarının da sizden güvenle araç aldığını gördükçe önyargılarını daha hızlı yıkacaktır."
      }
    }
  ];

  guide.sections = newSections;

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log('Successfully applied MEGA UPDATE retaining ALL data and inserting dense regulatory information into appropriate steps!');
} else {
  console.log('Guide not found!');
}
