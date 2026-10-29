const fs = require('fs');

const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const megaGuide = {
  "id": "guide_nasil_galerici_olunur",
  "title": "Sıfırdan Zirveye: Nasıl Profesyonel Bir Galerici (Oto Alım-Satım Uzmanı) Olunur? (10 Adımlık Mega Rehber)",
  "description": "Sadece araba sevgisiyle galerici olunmaz! Ticaret zekası, yasal prosedürler, ekspertiz hileleri ve ikna sanatını kapsayan, sıfırdan kendi oto galerinizi kurmanın 10 altın kuralı. Bu rehber her adımda sizi profesyonelliğe taşıyacak detaylarla doludur.",
  "minutes": 25,
  "difficulty": "Uzman",
  "tags": [
    "Oto Galeri",
    "Ticaret",
    "Meslek Rehberi",
    "Girişimcilik",
    "Satış",
    "Sermaye"
  ],
  "author": "OtoSöz Ticaret Uzmanı",
  "sections": [
    {
      "type": "intro",
      "title": "Başlamadan Önce: Araba Sevgisi Karın Doyurmaz",
      "content": "Oto galericilik, dışarıdan bakıldığında lüks arabalara binip, takım elbiseyle çay içerek para kazanılan kolay bir meslek gibi görünebilir. Oysa gerçekler çok farklıdır! İyi bir galerici olmak; sadece motor sesinden anlamayı değil, derin bir ticaret zekasını, insan psikolojisi okumayı, yasal mevzuatlara hakimiyeti ve en önemlisi 'kriz anında soğukkanlı kalmayı' gerektirir. Bir aracı çok iyi tanıyabilirsiniz, vites geçişlerindeki milisaniyelik gecikmeyi hissedebilirsiniz ama o aracı doğru fiyata alamıyorsanız, elinizde kalır. Piyasada batan yüzlerce galerici, arabaları çok iyi bildiği için değil, ticareti ve insanları yönetemediği için batmıştır. Bu mega rehberde, hayallerinizdeki oto galeriyi sıfırdan kurup, piyasanın kurdu haline gelmeniz için gereken 10 hayati adımı detaylarıyla, alt başlıklarıyla ve yaşanmış piyasa gerçekleriyle inceleyeceğiz."
    },
    {
      "type": "step",
      "title": "Adım 1: Psikolojik Hazırlık ve Ticaret Zekası",
      "content": "Galericilik bir 'al-sat' mesleği değil, bir 'risk yönetimi' mesleğidir. İlk kural: Duygularınızı bagaja kilitleyin. Bu sektöre giren birçok aceminin yaptığı en büyük hata, kendi beğendiği, kendi binmek istediği lüks veya modifiyeli araçları alıp sermayeyi bağlamaktır. Aldığınız araç sadece bir 'satılacak meta'dır.",
      "subsections": [
        {
          "subtitle": "Duygusal Bağ Kurmamak",
          "text": "Bir arabaya aşık olarak ticaret yapılmaz. Çok beğendiğiniz, rengine ve donanımına vurulduğunuz bir aracı alırken piyasa değerinin üstünde para öderseniz, satarken aylarca beklersiniz. Ticaretin temeli matematiğe dayanır, estetiğe değil. Bir Egea veya Symbol size çekici gelmeyebilir ama piyasanın peynir ekmeğidir."
        },
        {
          "subtitle": "Kurtlar Sofrasına Girmek",
          "text": "Yalanın, dolanın ve dolandırıcılığın çok olduğu bir piyasaya giriyorsunuz. Herkese güvenmeyi bırakıp, paranoyak seviyesinde dikkatli olmalısınız. Size araba getiren en yakın dostunuz bile aracının gizli bir kusurunu (örneğin yağ yakmasını) sizden saklayabilir. Ticarette 'kardeşlik' değil 'ekspertiz' geçerlidir."
        },
        {
          "subtitle": "Zarar Etmeyi Öğrenmek",
          "text": "Bazen piyasa aniden düşer, bazen de gözden kaçırdığınız ağır bir kusur nedeniyle aracı zararına satmak zorunda kalırsınız. Kötü bir araç alıp binlerce lira zarar ettiğinizde gece rahat uyuyabilecek psikolojik dirence sahip değilseniz, ertesi sabah dükkanı açacak enerjiyi bulamazsınız. Zarar etmek ticaretin vergisidir, önemli olan totalde karda kalmaktır."
        }
      ],
      "warning": {
        "title": "Stres Yönetimi Uyarısı",
        "text": "Elinizde satılamayan 5 araç varken ve ay sonu çeklerin ödemesi yaklaşırken panik yapıp araçları yok pahasına satarsanız batarsınız. Kriz anında sakin kalmak bu işin ilk şartıdır."
      }
    },
    {
      "type": "step",
      "title": "Adım 2: Yasal Zorunluluklar ve İzinler (Bürokraside Boğulmamak)",
      "content": "Eskiden bir dükkan kiralayıp camına 'Oto Galeri' yazan herkes bu işi yapabiliyordu. Artık 'ben galericiyim' diyerek dükkan açma devri tamamen kapandı. Ticaret Bakanlığı, sektörü regüle etmek ve dolandırıcılıkların önüne geçmek için çok sert kurallar getirdi. Yasal altyapınızı kurmadan araç alım satımına başlarsanız, keseceğiniz faturalar bile yasadışı sayılır ve devasa cezalarla karşılaşırsınız.",
      "subsections": [
        {
          "subtitle": "Mesleki Yeterlilik Belgesi (Seviye 5)",
          "text": "Bu işi yapacak olan kişinin mutlaka devlet onaylı kurumlardan sınava girip 'İkinci El Motorlu Kara Taşıtları Alım Satım Danışmanı' belgesini alması gerekir. Bu sınav; ticaret hukuku, ekspertiz kuralları ve müşteri hakları gibi konulardan oluşur."
        },
        {
          "subtitle": "İkinci El Motorlu Kara Taşıtı Ticareti Yetki Belgesi",
          "text": "İşletmenizin bu belgeye sahip olması yasal bir zorunluluktur. Bu belgeyi alabilmek için işletme sahibinin en az lise mezunu olması, iflas etmemiş olması ve yüz kızartıcı bir suçtan hüküm giymemiş olması gerekmektedir."
        },
        {
          "subtitle": "Şirket Kurulumu ve Ruhsat İşlemleri",
          "text": "Oto galeri açmak için bir şirket (Şahıs, Limited veya Anonim) kurmalısınız. Ardından vergi dairesine kayıt olup vergi levhanızı almalısınız. En kritik ve zor olan aşama ise belediyeden alınacak 'İş Yeri Açma ve Çalışma Ruhsatı'dır. Galeri olarak kullanılacak dükkanın apartman altında olmaması (belirli bölgelerde yasaktır), belirli bir metrekare şartını sağlaması ve giriş-çıkış standartlarına uygun olması istenir."
        }
      ],
      "tip": {
        "title": "Mali Müşavir Seçimi",
        "text": "Oto alım satımındaki KDV oranları (%1 ve %18 veya yeni oranlar %20 vs.) araç türüne (binek/ticari) ve fatura kesim şekline göre sürekli değişir. Sektörü bilen iyi bir mali müşavir sizi milyonluk vergi cezalarından kurtarır."
      }
    },
    {
      "type": "step",
      "title": "Adım 3: Sermaye Yönetimi ve Bütçe Planlaması",
      "content": "Bir galeri açmak için ne kadar paraya ihtiyacınız var? Çoğu girişimci sadece alacağı 3-5 arabanın parasını hesaplayarak yola çıkar ve ilk 3 ay içinde nakit sıkıntısından batar. Sermaye sadece araç almak için değildir; görünmez giderler ve işletme sermayesi (can suyu) hayati önem taşır.",
      "subsections": [
        {
          "subtitle": "Sabit ve İşletme Giderleri",
          "text": "Dükkanı açarken ödeyeceğiniz depozito, peşin kira, dekorasyon, ışıklandırma, kurumsal kimlik (tabela), ofis mobilyaları ve bilgisayar sistemleri ilk sabit giderlerdir. Bunun yanında, aylık stopaj, personel maaşı, ilan sitelerine (sahibinden.com vb.) ödenecek devasa kurumsal üyelik aidatları ve muhasebe giderleri için kenarda en az 6 aylık işletme bütçeniz nakit olarak durmalıdır."
        },
        {
          "subtitle": "Portföy Dağıtımı (Sepet Mantığı)",
          "text": "Altın Kural: Asla tüm sermayenizi tek veya iki adet lüks araca bağlamayın. Örneğin 3 Milyon TL sermayeniz var. Bu parayla gidip tek bir Mercedes E-Serisi alıp aylarca satılmasını beklerseniz, o 6 ay boyunca cebinizden kira ve gider öderken erirsiniz. Bunun yerine, o paraya hızlı sirkülasyonu olan, piyasası canlı, alt-orta segment (Clio, Egea, Megane, Focus, i20 vb.) 4-5 araç alın. Biri satılırken diğeri vitrinde durur, sürekli bir sıcak para girişi olur."
        },
        {
          "subtitle": "Nakit Akışı (Cash Flow)",
          "text": "Ticarette 'kar etmek' sizi zengin eder ama 'nakit akışı' sizi hayatta tutar. Çok karlı bir takas teklifi gelebilir ama eğer kasada acil ihtiyaçlar için nakdiniz yoksa, o karlı ticarete giremezsiniz. Nakit akışını sağlamak için bazen bir aracı maliyetine hatta çok cüzi bir karla elden çıkarıp sıcak paraya geçmek, ticari bir taktiktir."
        }
      ]
    },
    {
      "type": "step",
      "title": "Adım 4: Lokasyon Seçimi ve Fiziksel Mağaza (Showroom) Kurulumu",
      "content": "Dükkanınızın bulunduğu yer, kapıdan içeri girecek müşterinin sosyo-ekonomik profilini ve dolayısıyla satacağınız araçların segmentini doğrudan belirler. Kötü bir lokasyonda premium araç satamazsınız, lüks bir semtte de eski model şahin satmak zordur.",
      "subsections": [
        {
          "subtitle": "Oto Center'lar vs Cadde Üstü Mağazalar",
          "text": "Bir oto center'da (Oto Galericiler Sitesi, Otonomi vb.) dükkan açmanın en büyük avantajı hazır müşteri trafiğidir. İnsanlar araba almak için oraya gelir. Ancak dezavantajı, sağınızda ve solunuzdaki onlarca galeriyle kıyasıya bir fiyat rekabetine girmenizdir. Cadde üstü bağımsız bir mağaza açarsanız marka değerinizi daha çok öne çıkarabilirsiniz ancak müşteriyi oraya çekmek için reklama ciddi bütçe ayırmanız gerekir."
        },
        {
          "subtitle": "Aydınlatma ve Zemin (Vitrin İllüzyonu)",
          "text": "Bir aracın ne kadar iyi göründüğü, üzerine düşen ışıkla ilgilidir. Mükemmel pasta cila yapılmış bir araç, loş bir dükkanda çöp gibi görünürken; doğru açılarla yerleştirilmiş profesyonel gün ışığı (4000K-5000K) spot aydınlatmalar altında büyüleyici görünür. Zemin genellikle yansıtmalı epoksi veya temiz granit olmalıdır. Yerdeki yansıma aracı daha yüksek ve heybetli gösterir."
        },
        {
          "subtitle": "Kurumsal Kimlik ve Güven Veren Ofis",
          "text": "Müşterinin oturduğu koltuk, içtiği kahvenin kalitesi ve ofisteki düzen, satacağınız arabanın 'güvenilir' olup olmadığına dair bilinçaltı mesajlar verir. Dağınık, sigara kokan, karanlık bir ofis direkt olarak 'bu adamlar dolandırıcı olabilir' hissi uyandırır. Her zaman temiz, mis gibi 'yeni araç' veya kahve kokan, aydınlık bir ortam yaratın."
        }
      ]
    },
    {
      "type": "step",
      "title": "Adım 5: Doğru Araç Tedariği - Nereden, Nasıl Araç Bulunur?",
      "content": "Ticareti bilen herkes şu kuralı ezbere bilir: 'Galerici parayı satarken değil, alırken kazanır.' Aracı piyasa fiyatının altında bulup alamıyorsanız, dükkanı açık tutmanızın bir anlamı kalmaz. Peki bu uygun araçlar nereden bulunur?",
      "subsections": [
        {
          "subtitle": "İnternet İlanları (Ekran Düşürmek)",
          "text": "Sahibinden ve benzeri platformlarda sürekli (dakika dakika) güncel ilanları takip etmelisiniz. Acil nakde sıkışan, borcu olan veya piyasayı bilmeyip aracını ucuz yazan kullanıcıların ilanları saniyeler içinde yayına düşer. Buna 'ekran düşürmek' denir. O aracı ilk arayan ve anında kapora gönderip bağlayan siz olmalısınız. Bunun için ekibinizde sadece ekran takip edecek bir personel bile olabilir."
        },
        {
          "subtitle": "Filo Kiralama Şirketleri",
          "text": "Büyük kurumsal kiralama şirketleri (Avis, Garenta, Hedef Filo vb.) araçlarını 2-3 yılda bir topluca yenilerler. Bu ihalelere katılıp aynı marka/modelden 10 adet aracı toptan fiyatına uygun bir bedelle alabilirsiniz. Genelde kaporta kusurları (çizik, göçük) çok olur ama bunları kendi anlaşmalı ustanızda ucuza yaptırıp perakende de ciddi karlar elde edebilirsiniz."
        },
        {
          "subtitle": "Takas Ağı ve Çevre",
          "text": "Satış yaptığınız müşterinin eski aracını takasa saymak, en tatlı kar kapılarından biridir. Müşteri yeni aracı almak için heyecanlı olduğundan, eski aracını 'binici alış fiyatının' da bir tık altına galeriye bırakmaya meyillidir. Ayrıca sanayi ustalarıyla (motorcu, kaportacı) sıkı dostluklar kurun. Onlara tamire gelen ama müşterinin masraf etmek istemeyip satmak istediği araçları ilk size haber vermelerini sağlayın."
        }
      ]
    },
    {
      "type": "step",
      "title": "Adım 6: Şahin Gözü Ekspertiz (Kazalı Aracı Koklamak)",
      "content": "Aracı alırken müşterinin veya başka bir galerinin size sunduğu ekspertiz raporuna asla %100 güvenerek ticaret yapmayın! Profesyonel bir galerici, kendi dükkanının ekspertizidir.",
      "subsections": [
        {
          "subtitle": "Fiziksel İpuçlarını Okumak",
          "text": "Araca dışarıdan baktığınızda farların birinin yeni (berrak) diğerinin eski (sararmış) olması doğrudan o köşeden bir hasar alındığının kanıtıdır. Tavan sacına eğilip baktığınızda göreceğiniz ufak dalgalanmalar, kapı fitillerini (lastikleri) kaldırdığınızda altındaki fabrika punto izlerinin yerini silikon veya macun izlerinin almış olması size aracın geçmişini anlatır."
        },
        {
          "subtitle": "İki Parçadan Eklenmiş (Kesme) Araçlar",
          "text": "Piyasada sizi iflasa sürükleyecek en büyük tehlike 'kesme' veya 'ekleme' araçlardır. Ağır hasarlı iki farklı aracın sağlam kısımlarını (Örn: birinin önü, diğerinin arkası) ortadan kaynatarak tek bir araç yaparlar. Bunu anlamak için kapı eşiklerindeki döşemeleri hafifçe aralayıp şase birleşim yerlerindeki kaynak veya işlem izlerini aramalısınız."
        },
        {
          "subtitle": "Motor ve Şanzıman Sesleri",
          "text": "Motor soğukken (ilk marşta) duyulan zincir şıkırtısı veya itici sesleri, ısındıktan sonra duyulmayabilir. Satıcı aracı size getirmeden önce iyice ısıtmış olabilir. Otomatik viteslerde 'D'den 'R'ye alırken yaşanan vuruntu (vurma hissi) veya yokuşta geri kaydırma, şanzıman beyni veya kavrama arızasının habercisidir. Bunlar binlerce liralık görünmez masraflardır."
        }
      ],
      "warning": {
        "title": "Dolandırıcılık Uyarısı",
        "text": "Satıcı ile anlaştığınız araç farklı, noterde devrini alacağınız aracın şase numarası farklı (change) olabilir. Notere gitmeden önce aracın motor ve şase numarasını ruhsatla mutlaka bizzat eşleştirin."
      }
    },
    {
      "type": "step",
      "title": "Adım 7: Fiyatlandırma Stratejisi: 3'lü Matematik Sistemi",
      "content": "Aldığınız aracı kaça satacaksınız? Bir aracı ne kadara almanız gerektiğini hesaplarken sadece 'internetteki en düşük fiyata bakmak' sizi yanıltır.",
      "subsections": [
        {
          "subtitle": "1. Kör Alış Fiyatı (Hemen Satış Fiyatı)",
          "text": "Aracı aldığınız günün akşamında, aniden nakde ihtiyacınız olsa, bu aracı başka bir galericiye veya Vavacars/Letgo gibi nakit alım yapan kurumsal firmalara 'anında ve nakit' olarak verebileceğiniz ölü fiyattır. Alım yaparken aracın bu rakamın çok üzerinde olmamasına dikkat etmelisiniz."
        },
        {
          "subtitle": "2. Binici Alış (Maksimum Alış) Fiyatı",
          "text": "Aracın temizliğine, donanımına, boyasız veya düşük kilometrede olmasına bağlı olarak, o araç için cebinizden çıkabilecek maksimum rakamdır. Eğer çok temiz bir araç bulduysanız, piyasanın 10 bin TL üzerinde bile alsanız satarsınız, ancak bu riski sadece 'kusursuz' araçlar için almalısınız."
        },
        {
          "subtitle": "3. Vitrin (İlan) Fiyatı",
          "text": "Aracın tüm masrafları (noter, yıkama, pasta cila) düşüldükten sonra, üzerine hedeflenen kar marjı ve 'müşteri pazarlık payı' eklenerek internete girilen fiyattır. Türkiye pazarında müşteri pazarlık yapmadan araç almaz. İlan fiyatını yazarken, müşterinin 'Abi son ne olur?' sorusuna vereceğiniz cevapta düşeceğiniz 15-20 bin TL'lik payı önceden eklemelisiniz."
        }
      ]
    },
    {
      "type": "step",
      "title": "Adım 8: Dijital Vitrin ve Kusursuz İlan Yönetimi",
      "content": "Müşterilerin %95'i galeriye gelmeden önce aracı internet ilanlarında görür, inceler ve aslında satın alma kararını ekran başında verir. Dükkanınız ne kadar lüks olursa olsun, fotoğraflarınız kötüyse o araç satılmaz.",
      "subsections": [
        {
          "subtitle": "Fotoğraf Çekimi Bir Sanattır",
          "text": "Cep telefonuyla, güneşin en tepede olduğu öğle saatlerinde, araba yıkanmadan çekilen fotoğraflar amatörlüktür. Çekimler ya profesyonel bir ışık stüdyosunda (artık birçok galeride var) ya da gün batımı/gün doğumu gibi yumuşak ışık saatlerinde dış mekanda yapılmalıdır. Fotoğrafların arka planında karmaşık yapılar, çöpler veya başka tabelalar olmamalıdır. Geniş açı lens kullanarak iç mekanı daha ferah gösterebilirsiniz."
        },
        {
          "subtitle": "Plaka Gizleme Hatası",
          "text": "Piyasada plakasını kapatarak ilan giren galeriler müşteride doğrudan 'Bu aracın saklanan bir trameri (hasar kaydı) veya kiralık geçmişi var' hissi uyandırır. Kendinize güveniyorsanız plakayı açık bırakın, şeffaflık her zaman güven kazandırır."
        },
        {
          "subtitle": "İlan Açıklaması Kuralı",
          "text": "İlan açıklaması destan olmamalı, ancak eksik de olmamalıdır. 'Gelen üzülmez, dosta gider, hatasız boyasız (ama tavan hariç)' gibi mahalle ağzı ifadeler kurumsal imajınızı yok eder. Madde madde; Aracın ekspertiz durumu, Tramer kaydı miktarı, Yedek anahtar/kitapçık durumu, Bakım geçmişi ve Ekstra donanımları net bir Türkçe ile yazılmalıdır."
        }
      ]
    },
    {
      "type": "step",
      "title": "Adım 9: İkna Sanatı ve Müşteri İletişimi (Krizi Fırsata Çevirmek)",
      "content": "Müşteri kapıdan içeri girdiği an oyun başlar. İyi bir galerici, 30 saniye içinde müşterinin profilini çıkarır.",
      "subsections": [
        {
          "subtitle": "Müşteri İhtiyacını Okumak",
          "text": "Ailesiyle gelen bir adama aracın ne kadar hızlı kalktığını veya egzoz sesini anlatmak vakit kaybıdır; ona bagaj hacminden, arka koltuk ISOFIX bağlantılarından ve sorunsuz motorundan bahsetmelisiniz. Genç ve tek başına gelen bir müşteriye ise jantlardan, ses sisteminden ve aracın yoldaki duruşundan dem vurmalısınız."
        },
        {
          "subtitle": "Defansif Olmamak",
          "text": "Müşteri aracı incelerken doğal olarak kusur bulmaya ve fiyat kırmaya çalışacaktır. 'Abi bunun sağ kapısında çizik var' dediğinde, 'Ne olacak abi ikinci el araba bu' demek yerine, 'Evet beyefendi haklısınız, zaten fiyatını belirlerken o çiziği göz önüne alıp emsallerinden 30 bin TL aşağıda yazdık. Dilerseniz kendi kaportacımızda orijinaline sadık kalarak rötüşlatıp size o şekilde teslim edebilirim' diyerek olumsuzluğu anında bir satış gücüne ve hizmete dönüştürmelisiniz."
        },
        {
          "subtitle": "Deneme Sürüşü (Test Drive) Taktiği",
          "text": "Araç ne kadar anlatılırsa anlatılsın, müşteri o direksiyonun başına geçip aracın kokusunu aldığında satın alma oranı %70 artar. Temizlenmiş, deposunda çeyrek depo yakıtı bulunan ve güzel kokan bir araçla yaptıracağınız kısa bir deneme sürüşü, pazarlık sürecini sizin lehinize çevirir."
        }
      ]
    },
    {
      "type": "conclusion",
      "title": "Adım 10: Satış Sonrası Hizmet ve Kalıcı Güven İnşası",
      "content": "Kısa vadeli düşünen galericiler, aracın noterde satışını verip parayı cebine koyduğu an müşteriyle ilişkisini keser. Oysa gerçek imparatorluklar 'satış sonrası' ile kurulur.\n\nEğer sattığınız araçta 3 gün sonra öngörülemeyen bir arıza çıkarsa (örneğin akü bitmesi, şarj dinamosu arızası veya termostat patlaması) müşteriye 'İkinci el araba aldın kardeşim, bana ne' derseniz, o müşteriyi ve onun çevresindeki 10 kişiyi kaybedersiniz. Hatta internette yazacağı bir şikayet, size onlarca müşteri kaybettirir.\n\nBunun yerine müşteriyi arayıp 'Hiç canınızı sıkmayın, hemen ustama yönlendiriyorum, masrafı benden' diyerek cebinizden 3.000 TL, 5.000 TL harcamak size uzun vadede 3 yeni müşteri, muazzam bir itibar ve 'dürüst galerici' unvanı kazandırır. Bu unvan, Google'a vereceğiniz yüz binlerce liralık reklamdan daha değerlidir.\n\nOto galericilik, dışarıdan sadece demir yığını alıp satmak gibi görünse de, özünde 'güven ve itibar' inşa etme sanatıdır. Piyasada kurnazlar sadece 1 yıl kazanır, parlar ve batarlar; dürüst tüccarlar ise nesiller boyu ayakta kalır. Artık tüm sırlar elinizde! Takım elbisenizi giyin, mikron makinenizi cebinize koyun ve ticaretin acımasız ama bir o kadar da keyifli dünyasına adım atın!",
      "finalChecklist": [
        "Sermayenizi hesaplarken, 6 aylık görünmez giderleri ve işletme can suyunu kenara ayırdınız mı?",
        "Ekspertizleri sadece rapora bakarak değil, aracın ruhunu (çizgiler, kapı içleri, sesler) okuyarak yapabilecek tecrübeye ulaştınız mı?",
        "Müşteri şikayetini bir yük olarak değil, kalıcı bir bağ ve güven kurma fırsatı olarak görüyor musunuz?",
        "İlanlarınızdaki şeffaflık (açık plaka, detaylı kusur beyanı) sizi mahalle galericisinden kurumsal bir firmaya taşıyacak seviyede mi?"
      ]
    }
  ]
};

// Replace the specific guide
const guideIndex = data.guides.findIndex(g => g.id === "guide_nasil_galerici_olunur");

if (guideIndex !== -1) {
  data.guides[guideIndex] = megaGuide;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log('Successfully updated Galericilik guide with MEGA details!');
} else {
  console.log('Guide not found! Maybe ID is different?');
}
