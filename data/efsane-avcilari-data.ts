export interface Myth {
    id: number;
    slug: string;
    category: 'fuel' | 'engine' | 'safety' | 'tire' | 'electric' | 'general';
    myth: string;
    reality: string;
    explanation: string;
    seoTitle: string;
    seoDescription: string;
}

export const mythsData: Myth[] = [
    // YAKIT TÜKETİMİ
    {
        id: 1,
        slug: "yokus-asagi-bosa-atmak",
        category: 'fuel',
        myth: "Yokuş aşağı inerken vitesi boşa almak yakıt tasarrufu sağlar.",
        reality: "Yanlış! Aksine daha fazla yakıt harcatır ve frenlerinizi tehlikeye atar.",
        explanation: "Modern enjeksiyonlu araçlarda (1990'lardan bu yana) yokuş aşağı viteste ve gazdan ayak çekili şekilde inildiğinde sistem 'Cut-Off' (yakıt kesme) moduna geçer ve motora giden yakıt damlasını SIFIRA indirir. Vitesi boşa alırsanız, motor stop etmemek için rölanti yakıtı (saatte yaklaşık 0.5 - 1 Litre) harcamaya devam eder. Ayrıca motor frenini kaybettiğiniz için tüm yük fren balatalarına biner, ısınma ve fren şişmesi (tutmaması) riski oluşur.",
        seoTitle: "Yokuş Aşağı Vitesi Boşa Almak Yakıt Tasarrufu Sağlar Mı?",
        seoDescription: "Yokuş aşağı inerken vitesi boşa atmak yakıt yaktırır mı? Cut-Off sistemi nedir ve yokuş inerken neden vites küçültülmeli detaylı mühendislik açıklaması."
    },
    {
        id: 2,
        slug: "klima-yerine-cam-acmak",
        category: 'fuel',
        myth: "Klimayı kapatıp camları açmak her zaman daha ekonomiktir.",
        reality: "Sadece şehir içi düşük hızlarda doğrudur. Yüksek hızlarda felakettir.",
        explanation: "80 km/s hızın üzerine çıktığınızda açık camların içeri aldığı rüzgar, aracın aerodinamik yapısını bozar (paraşüt etkisi yaratır). Bu rüzgar direnci (drag) sebebiyle motor aracı ileri itmek için klimanın harcayacağı güçten çok daha fazlasını harcar. Otoyolda klima açmak, cam açmaktan kesinlikle daha az yaktırır.",
        seoTitle: "Klima Açmak Mı Cam Açmak Mı Daha Çok Yakar?",
        seoDescription: "Araçta klima mı daha çok yakar cam açmak mı? Yüksek hızlarda açık camın yarattığı aerodinamik direnç (drag) ve yakıt tüketimi üzerindeki şok edici etkisi."
    },
    {
        id: 3,
        slug: "benzin-deposunu-fullemek",
        category: 'fuel',
        myth: "Benzin deposunu tamamen doldurmak aracı ağırlaştırır ve çok yaktırır.",
        reality: "Teorik olarak ufak bir ağırlık yapsa da pratikte önemsizdir ve yararı daha fazladır.",
        explanation: "Yarım depo ile tam depo arasındaki benzin ağırlık farkı ortalama 20-30 kg'dır. Bu bir çocuğun ağırlığı kadardır ve yakıt tüketimine etkisi ölçülemeyecek kadar azdır. Aksine, depoyu sürekli çeyreğin altında kullanmak, depo içindeki yakıt pompasının (yakıtla soğuduğu için) aşırı ısınmasına ve zamanla yanmasına sebep olur.",
        seoTitle: "Depoyu Fullemek Çok Yaktırır Mı?",
        seoDescription: "Arabanın deposunu fullemek ağırlık yapıp yakıtı artırır mı? Yakıt pompasının sağlığı için depoyu neden çeyreğin altında bırakmamalısınız."
    },

    // MOTOR & BAKIM
    {
        id: 4,
        slug: "sabah-motoru-isitmak",
        category: 'engine',
        myth: "Sabah motoru ısıtmak için 5-10 dakika rölantide beklemek gerekir.",
        reality: "Eski karbüratörlü araçlar için doğruydu. Yeni nesil araçlar için zararlıdır.",
        explanation: "Yeni nesil motorlar 30-60 saniye içinde yağlamayı tamamlar. Uzun süre rölantide beklemek, motorun geç ısınmasına sebep olur. Soğuk çalışan motor zengin karışım (bol yakıt) püskürtür. Bu fazla yakıt tam yanamaz, silindir duvarındaki yağı yıkayarak aşınmayı artırır ve supaplarda karbon birikimi (kurum) yapar. Doğrusu: Çalıştırıp 30 sn sonra düşük devirde ilerleyerek motoru yolda ısıtmaktır.",
        seoTitle: "Sabah Arabayı Çalıştırıp Beklemek Gerekir Mi?",
        seoDescription: "Kışın araba nasıl ısıtılır? Rölantide motor ısıtmanın zararları, silindir yıkanması ve yeni nesil motorların doğru ısıtılma yöntemi."
    },
    {
        id: 5,
        slug: "yuksek-oktanli-benzin-performansi",
        category: 'engine',
        myth: "Yüksek oktanlı benzin (97-98) arabanın performansını uçurur.",
        reality: "Aracınızın motoru 95 oktan için üretildiyse hiçbir işe yaramaz.",
        explanation: "Oktan, benzinin yanma gücü veya 'kalitesi' değildir. Oktan, benzinin 'basınca karşı erken patlamama' (vuruntu direnci) yeteneğidir. Eğer aracınız yüksek sıkıştırma oranlı bir spor otomobil değilse, 98 oktan almak performansınızı artırmaz, sadece cüzdanınızı boşaltır. Fabrika verisi neyse onu kullanın.",
        seoTitle: "Yüksek Oktanlı Benzin Performansı Artırır Mı?",
        seoDescription: "95 oktan ve 98 oktan benzin arasındaki fark nedir? Yüksek oktanlı benzin almak arabanın çekişini ve performansını artırır mı efsanesi."
    },
    {
        id: 6,
        slug: "kalin-yag-motoru-korur",
        category: 'engine',
        myth: "Kalın yağ motoru daha iyi korur, sesi keser.",
        reality: "Kalın yağ yeni nesil dar toleranslı motorların katilidir.",
        explanation: "Eski nesil 'Şahin/Toros' motorlarında boşluklar fazla olduğu için kalın yağ işe yarardı. Ancak modern motorlarda (özellikle turbolu araçlarda) yağ kanalları kılcal damar gibidir. 5W-30 önerilen motora 10W-40 veya 20W-50 koyarsanız, yağ ilk çalıştırmada turboya ve üst kapağa saniyelerce ulaşamaz, metali metale sürttürerek motoru yersiniz.",
        seoTitle: "Kalın Motor Yağı Arabayı Korur Mu?",
        seoDescription: "Motora kalın yağ koymak sesi keser mi? Turbo motorlarda yanlış viskozite (10W-40 yerine 5W-30) kullanımının yıkıcı zararları."
    },
    {
        id: 7,
        slug: "motor-yikanmaz",
        category: 'engine',
        myth: "Araç düzenli olarak sanayide yıkanıyorsa alt yıkama (motor yıkama) da tazyikli suyla yapılmalıdır.",
        reality: "Modern araçlarda tazyikli suyla motor yıkamak elektronik beyin (ECU) arızalarına yol açar.",
        explanation: "Eski araçlarda elektronik beyin ve sensör az olduğu için tazyikli suyla motor yıkanabilirdi. Günümüz araçları adeta tekerlekli bilgisayarlardır. Tazyikli su, bobinlerin, beyin soketlerinin ve ABS sensörlerinin içine sızarak oksitlenmeye ve on binlerce liralık elektrik arızalarına sebep olur. Motor sadece nemli bez ve özel temizleyici spreylerle silinmelidir.",
        seoTitle: "Araba Motoru Yıkanır Mı?",
        seoDescription: "Tazyikli su ile araba motoru yıkanır mı? Elektronik beyin (ECU), bobin ve sensör arızalarının en büyük sebebi olan motor yıkama hatası."
    },
    {
        id: 8,
        slug: "farkli-antifriz-karisimi",
        category: 'engine',
        myth: "Premium (Pahalı) antifriz her zaman daha iyidir, renkleri karıştırılabilir.",
        reality: "Farklı renk ve özellikteki antifrizleri karıştırmak sistemi tıkar.",
        explanation: "Mavi (Silikatlı) ve Kırmızı/Organik (OAT) antifrizler farklı kimyasal yapılara sahiptir. İkisini karıştırırsanız kimyasal tepkimeye girerek jel kıvamına gelir ve motorun su kanallarını, radyatörü tıkayarak hararete sebep olur. Aracın fabrika çıkış rengi neyse her zaman o renk ile devam edilmelidir.",
        seoTitle: "Mavi ve Kırmızı Antifriz Karıştırılır Mı?",
        seoDescription: "Kırmızı organik antifriz mi daha iyi mavi mi? Farklı renk antifriz karıştırmanın radyatör tıkanmasına ve hararete yol açtığı gerçeği."
    },
    {
        id: 9,
        slug: "lpg-motoru-kurutur",
        category: 'engine',
        myth: "LPG (Otogaz) sistemi motoru kurutur ve ömrünü bitirir.",
        reality: "LPG motoru 'kurutmaz', ancak yanma odası sıcaklığını artırdığı için supapları eritme riski vardır.",
        explanation: "Motorun içinin 'kuruması' diye bir fiziksel terim yoktur. Motor yağı her halükarda silindirleri yağlar. Ancak LPG, benzine göre daha yüksek sıcaklıklarda yanar ve benzindeki yağlayıcı/soğutucu katkı maddelerini içermez. Bu sebeple magnezyum alaşımlı supaplara sahip motorlarda zamanla 'supap erimesi' (supap uzaması) dediğimiz yüksek ısı hasarı oluşur. Doğru ayar ve çelik supaplarla bu sorun aşılır.",
        seoTitle: "LPG Motoru Kurutur Mu?",
        seoDescription: "Otogaz (LPG) motorun ömrünü kısaltır mı? Supap erimesi neden olur ve LPG'nin motor iç sıcaklığına olan etkisinin mühendislik açıklaması."
    },
    {
        id: 10,
        slug: "siyah-motor-yagi-arizasi",
        category: 'engine',
        myth: "Dizel araçlarda motor yağının çubuğunu çekince simsiyah olması motorun bitik olduğunu gösterir.",
        reality: "Tamamen yanlıştır. Dizel motorlarda yağ değiştiği an bile siyahlaşır, bu yağın görevini iyi yaptığını gösterir.",
        explanation: "Motor yağının görevlerinden biri de yanma sonucu oluşan kurum ve kirleri kendi içinde hapsederek (deterjan/dispersan özelliği) motorun içini temiz tutmaktır. Dizel motorlar yapısı gereği yüksek kurum (is) üretir. Yağ, bu kurumu temizlediği için saniyeler içinde kararır. Yağın ömrü rengine bakılarak değil, kilometre ve vizkozite testleriyle anlaşılır.",
        seoTitle: "Dizel Araçta Yağın Siyah Olması",
        seoDescription: "Dizel motor yağının rengi neden hemen siyah olur? Siyah motor yağı motorun arızalı olduğu veya yağın bozulduğu anlamına mı gelir?"
    },

    // GÜVENLİK
    {
        id: 11,
        slug: "abs-fren-mesafesini-kisaltir",
        category: 'safety',
        myth: "ABS sistemi aracın fren mesafesini her şartta kısaltır.",
        reality: "ABS'nin asıl amacı mesafeyi kısaltmak değil, direksiyon hakimiyetini korumaktır.",
        explanation: "ABS (Anti-Lock Braking System), tekerleklerin kilitlenmesini önler. Asfalt gibi kuru ve sert zeminlerde mesafeyi kısaltabilir. Ancak taze kar veya çakıllı yollarda, kilitlenen tekerlek önünde bir kar/çakıl tümseği oluşturarak daha çabuk durur. ABS bu zeminlerde devreye girerek kilitlenmeyi engellediği için fren mesafesini UZATABİLİR. Buna rağmen direksiyonla kaçış manevrası yapmanızı sağladığı için hayat kurtarır.",
        seoTitle: "ABS Fren Mesafesini Kısaltır Mı?",
        seoDescription: "ABS sistemi ne işe yarar? Karda, kumda veya mıcırda ABS fren mesafesini neden uzatır? ABS'nin temel amacı olan direksiyon hakimiyeti."
    },
    {
        id: 12,
        slug: "emniyet-kemersiz-hava-yastigi",
        category: 'safety',
        myth: "Emniyet kemeri takmazsam sadece hava yastıkları beni korur.",
        reality: "Emniyet kemeri takılı değilken patlayan hava yastığı ölümcüldür.",
        explanation: "Hava yastıkları 300 km/s hızla, saniyenin onda biri sürede patlayan ufak bir patlayıcı mekanizmadır. Eğer emniyet kemeriniz takılı değilse, kaza anında öne doğru fırlarsınız ve size 300 km/s hızla çarpan hava yastığı boynunuzu kırabilir veya ciddi yüz tramvalarına neden olabilir. Hava yastığı 'Yardımcı' (SRS) bir sistemdir, ana koruma kemerdir.",
        seoTitle: "Emniyet Kemeri Takmadan Hava Yastığı Korur Mu?",
        seoDescription: "Kemer takılı değilken hava yastığı açılırsa ne olur? 300 km/s hızla patlayan SRS hava yastığının ölümcül tehlikesi."
    },
    {
        id: 13,
        slug: "arka-koltuktaki-esyalar",
        category: 'safety',
        myth: "Kaza anında arka koltuktaki eşyaların veya küçük evcil hayvanların zararı olmaz.",
        reality: "Arka koltuktaki serbest bir su şişesi bile mermiye dönüşebilir.",
        explanation: "Fizik kurallarına göre (F=m*a), 90 km/s hızla giderken aniden durduğunuzda (çarpışma), arka koltuktaki 1 litrelik bir su şişesi 30-40 kg'lık bir ağırlık kuvvetiyle öne fırlar. Sürücünün veya yolcunun kafasına çarpması ölümcül sonuçlar doğurabilir. Tüm sert eşyalar bagajda veya kapalı gözlerde taşınmalıdır.",
        seoTitle: "Kaza Anında Arka Koltuktaki Eşyaların Tehlikesi",
        seoDescription: "Ani fren ve kaza anında arkada duran su şişesi, tablet veya sabitlenmemiş eşyalar ne kadar tehlikelidir? Atalet kuvveti gerçeği."
    },
    {
        id: 14,
        slug: "eski-arabalarin-kaportasi-kalindir",
        category: 'safety',
        myth: "Eski arabalar tank gibidir, sacı kalındır. Yeni arabalar plastik gibi, kaza anında hemen paramparça oluyorlar, hiç güvenli değiller.",
        reality: "Yeni araçların kaza anında parçalanması bir tasarım hatası değil, planlanmış bir mühendislik harikasıdır.",
        explanation: "Yeni araçlar 'Programlanmış Deformasyon' (Crumple Zone) mühendisliğine sahiptir. Kaza anında kaporta bilerek katlanıp parçalanarak darbe enerjisini (kinetik enerjiyi) kendi üzerinde sönümler, böylece yaşam alanını (kabini) korur. Eski, esnemeyen 'tank gibi' araçlar ise hiç parçalanmaz ama çarpışmanın milyonlarca joule'lük tüm şok dalgasını doğrudan içerideki insanın iç organlarına ileterek iç kanamaya yol açar.",
        seoTitle: "Eski Arabalar Daha Mı Sağlam? Kaporta Kalınlığı",
        seoDescription: "Eski demir arabalar yeni araçlardan daha mı güvenli? Programlanmış deformasyon (Crumple Zone) nedir ve kaportanın parçalanması neden hayat kurtarır?"
    },

    // LASTİK & YÜRÜYEN
    {
        id: 15,
        slug: "kisin-lastik-havasini-indirmek",
        category: 'tire',
        myth: "Kışın karda daha iyi tutunması için lastik havaları indirilmelidir.",
        reality: "Tamamen yanlıştır. Lastik havasını indirmek karı ezmesini engeller ve kızaklatır.",
        explanation: "Karlı zeminde aracın yola tutunması için lastiğin karlı yüzeyi 'yarması' ve altındaki asfalta ulaşması gerekir. Havası indirilmiş lastiğin tabanı genişler ve balonlaşır. Bu durum basıncı yüzeye yayarak lastiğin kar üzerinde kayak yapmasına (kızaklamaya) neden olur. Kışın lastik havaları tam tersine 1-2 PSI yüksek bile basılabilir.",
        seoTitle: "Karda Lastik Havası İndirilir Mi?",
        seoDescription: "Kışın karda araç kullanırken lastik havalarını indirmek yol tutuşunu artırır mı? Karda kızaklama ve yere basma basıncı gerçeği."
    },
    {
        id: 16,
        slug: "genis-lastik-daha-iyi-tutar",
        category: 'tire',
        myth: "Daha geniş lastik takmak, arabanın yol tutuşunu her şartta artırır.",
        reality: "Kuru havada doğru olsa da, yağmurlu havada kazaya davetiyedir.",
        explanation: "Geniş lastik kuru asfaltta temas yüzeyini artırdığı için tutuşu artırır. Ancak yağmurlu havalarda (Aquaplaning - Suda Kızaklama riski), geniş yüzey lastiğin altındaki suyu tahliye etmesini zorlaştırır. Tıpkı geniş bir sörf tahtası gibi suyun üstüne çıkar. Kış rallilerinde araçların incecik lastik kullanmasının sebebi suyu ve karı yarıp asfalta tutunabilmektir.",
        seoTitle: "Geniş Lastik Daha Mı İyi Yol Tutar?",
        seoDescription: "Araca daha geniş ebat lastik takmak yol tutuşunu artırır mı? Yağmurlu havada geniş lastiğin suda kızaklama (Aquaplaning) riski."
    },
    {
        id: 17,
        slug: "4x4-araclar-karda-kaymaz",
        category: 'tire',
        myth: "4 Çeker (4x4) SUV araçlar kışın karda kesinlikle kaymaz ve her türlü durur.",
        reality: "4x4 sistemleri sadece 'kalkışı' (çekişi) kolaylaştırır, 'durmayı' (frenlemeyi) etkilemez.",
        explanation: "Tüm araçların 4 tekerleğinde fren vardır. Kar üzerinde 100 km hızla giderken frene bastığınızda, aracınızın 4x4 veya önden çekişli olmasının durma mesafesine hiçbir fiziki katkısı yoktur. Kış lastiği takılmamış bir 4x4 cip, kış lastikli önden çekişli standart bir otomobilden (daha ağır olduğu için) çok daha tehlikeli şekilde kayar ve daha geç durur.",
        seoTitle: "4x4 Araçlar Karda Kayar Mı?",
        seoDescription: "Dört çeker (AWD/4x4) araçların kışın kar üstünde durma performansı. Kış lastiği olmayan 4x4 bir araç neden tehlikelidir?"
    },
    {
        id: 18,
        slug: "eski-lastik-disleri-derin",
        category: 'tire',
        myth: "Lastik üretim tarihi (DOT) 5 yılı geçse de dişleri derin ise gönül rahatlığıyla kullanılabilir.",
        reality: "Dişleri yepyeni olsa bile 5 yıllık lastik betonlaşmıştır, yola tutunmaz.",
        explanation: "Lastiğin ana maddesi kauçuktur ve kauçuk zamanla güneşe (UV ışınları) ve oksijene maruz kalarak kimyasal olarak sertleşir. 5-6 yaşını geçmiş bir lastik (hiç kullanılmamış, depoda yatmış olsa bile) esnekliğini yitirir, sert bir plastiğe dönüşür. Islak zeminde veya acil frende kızak gibi kayar. Diş derinliğinin bir önemi kalmaz.",
        seoTitle: "Dişi İyi Olan Eski Lastik Kullanılır Mı?",
        seoDescription: "Üretim yılı 5 yıldan eski lastik (DOT) dişleri derin olsa bile kullanılmalı mıdır? Lastik kauçuğunun yaşlanması ve sertleşmesi."
    },
    {
        id: 19,
        slug: "buyuk-jant-arabayi-hizlandirir",
        category: 'tire',
        myth: "Arabaya fabrikasyon olandan daha büyük (örneğin 16 inç yerine 18 inç) çelik jant takmak arabanın hızını ve performansını artırır.",
        reality: "Performansı artırmak yerine aracı hantallaştırır, yakıtı artırır ve konforu yok eder.",
        explanation: "Büyük jant, tekerlek grubunun ağırlığını (Unsprung Mass - Süspansiyonsuz Kütle) artırır. Motor, daha ağır dönen bu kütleyi çevirmekte zorlanır. Bu durum aktarma oranını bozduğu için ilk hızlanma hantallaşır, fren mesafesi uzayabilir ve ince yanak lastik kullanılması zorunlu olduğu için yoldaki her çukur doğrudan direksiyonda hissedilir.",
        seoTitle: "Büyük Jant Arabayı Hızlandırır Mı?",
        seoDescription: "Araca daha büyük ve geniş jant takmanın dezavantajları. Süspansiyonsuz kütle (Unsprung mass) artışı yakıtı ve performansı nasıl etkiler?"
    },

    // DİĞER (ELEKTRİK / ŞANZIMAN / GENEL)
    {
        id: 20,
        slug: "otomatik-viteste-n-konumu",
        category: 'general',
        myth: "Otomatik vitesli araçlarda kırmızı ışıkta beklerken vitesi N (Boş) konumuna almak şanzımanı rahatlatır.",
        reality: "Modern şanzımanlarda gereksizdir ve D-N arası sürekli geçiş yapmak şanzıman valflerini aşındırır.",
        explanation: "Eski tork konvertörlü şanzımanlarda ışıkta D'de beklemek titreme yapardı. Ancak yeni nesil tork konvertörlü ve çift kavramalı (DSG, EDC) şanzımanlar, frene tam bastığınızda sistemi zaten boşa ayırır. Sizin vitesi D'den N'ye, kalkarken tekrar D'ye almanız, şanzımanın içindeki elektro-hidrolik valfleri sürekli aç-kapa yapmaya zorlar ve ömrünü kısaltır. Sadece 2-3 dakikayı aşan uzun beklemelerde P'ye veya N'ye almak mantıklıdır.",
        seoTitle: "Kırmızı Işıkta Vitesi N'ye Almak Gerekir Mi?",
        seoDescription: "Otomatik vitesli arabalarda kırmızı ışıkta beklerken vitesi boşa (N) atmak şanzımana zarar verir mi? DSG ve Tork konvertörü çalışma prensibi."
    },
    {
        id: 21,
        slug: "aku-aspirin-efsanesi",
        category: 'electric',
        myth: "Akü bittiğinde içine bir tablet aspirin veya karbonat atmak aküyü diriltir.",
        reality: "Kısa bir süreliğine kimyasal tepkime yaratsa da, akünün kurşun plakalarını tamamen çürütür ve geri dönüşümsüz olarak bozar.",
        explanation: "Aspirinin etken maddesi asetilsalisilik asittir. Bunu sülfürik asit ve saf su dolu aküye attığınızda, mevcut asitle tepkimeye girerek anlık ufak bir voltaj sıçraması yapabilir. Ancak bu tepkime, kurşun plakaların üzerindeki sülfatları eritmek yerine plakanın ta kendisini eritmeye başlar. O akü artık şarj tutmaz hale gelir ve çöpe gider. Sadece saf su eklenmeli ve şarja bağlanmalıdır.",
        seoTitle: "Aküye Aspirin Atmak Aküyü Canlandırır Mı?",
        seoDescription: "Biten aküye karbonat veya aspirin atmak aküyü şarj eder mi? Akü içerisindeki kimyasal tepkime ve kurşun plakaların erimesi."
    },
    {
        id: 22,
        slug: "cruise-control-yakit-tasarrufu",
        category: 'general',
        myth: "Hız sabitleyici (Cruise Control) kullanmak her yolda kesinlikle yakıt tasarrufu sağlar.",
        reality: "Düz yolda tasarruf sağlar ancak yokuşlu ve dağlık yollarda tüketimi felaket seviyeye çıkarır.",
        explanation: "Cruise Control'ün tek bir görevi vardır: Ayarladığınız hızı (örn: 100 km/s) ne pahasına olursa olsun tutturmak. Düz yolda gaz kelebeğini sabit tuttuğu için çok ekonomiktir. Ancak rampaya geldiğinizde, araç 95 km/s'ye düştüğü an sistem panikle vites küçültür ve gaza sonuna kadar (Kick-down) basar. İnsan ayağı ise rampada hızı 90'a düşürerek yakıtı koruyabilen organik bir sensördür.",
        seoTitle: "Hız Sabitleyici (Cruise Control) Yakıtı Düşürür Mü?",
        seoDescription: "Cruise control her zaman yakıt tasarrufu sağlar mı? Yokuşlu yollarda hız sabitleyicinin vites küçültme ve kick-down etkisiyle artan yakıt tüketimi."
    },
    {
        id: 23,
        slug: "arabaya-spoiler-takmak",
        category: 'general',
        myth: "Arabanın arkasına rüzgarlık (spoiler) takmak aerodinamiği iyileştirir ve aracı hızlandırır.",
        reality: "Aksine hava direncini artırarak son hızı düşürür ve yakıt tüketimini artırır.",
        explanation: "Motorsporlarında kullanılan Spoiler/Kanat sistemlerinin amacı aracı hızlandırmak değil, üzerinden akan havayı engelleyerek aracı yere doğru bastırmaktır (Downforce). Bu bastırma gücü aracın virajları daha hızlı ve savrulmadan dönmesini sağlar. Ancak bu kuvvet aracın ileri doğru gidişine karşı bir direnç (Drag) oluşturur. Standart bir şehir aracına devasa spoiler takmak, arabanın arkasına paraşüt açmaktan farksızdır.",
        seoTitle: "Arabaya Rüzgarlık (Spoiler) Takmak Hızlandırır Mı?",
        seoDescription: "Araç arkasına takılan rüzgarlık aerodinamiği nasıl etkiler? Downforce (yere basma kuvveti) ve Drag (hava direnci) fiziki gerçekleri."
    },
    {
        id: 24,
        slug: "start-stop-aku-mars-motoru",
        category: 'electric',
        myth: "Trafikte sürekli çalışan Start-Stop sistemi, marş motorunu bozar ve aküyü çok çabuk bitirir.",
        reality: "Start-Stop özelliğine sahip araçların marş motorları ve aküleri sıradan araçlara göre çok daha farklı ve dayanıklıdır.",
        explanation: "Bu araçlarda eski tip sulu aküler değil, yüz binlerce kez derin deşarja dayanıklı AGM (Absorbent Glass Mat) veya EFB aküler kullanılır. Marş sistemleri de klasik bir dişliden ziyade, kayış üzerinden çalışan entegre alternatör-marş jeneratörleridir (ISG). Yani motor durduğunda ve tekrar çalıştığında eski araçlardaki o yıkıcı mekanik aşınma yaşanmaz. Sistem şehir içi trafikte %10-15 tasarruf sağlar.",
        seoTitle: "Start Stop Sistemi Marş Motorunu Bozar Mı?",
        seoDescription: "Sürekli devreye giren Start-Stop aküyü bitirir mi? AGM akü nedir ve güçlendirilmiş entegre marş sistemlerinin uzun ömrü."
    },
    {
        id: 25,
        slug: "kirmizi-araba-boyasi-solar",
        category: 'general',
        myth: "Kırmızı renkli arabaların boyası güneşte çok daha çabuk solar ve matlaşır.",
        reality: "Eskiden doğruydu, günümüzdeki 'Clear Coat' (vernik) teknolojisi sayesinde artık tamamen bir efsanedir.",
        explanation: "1990'lardan önceki araçlarda akrilik bazlı tek katman boyalar kullanılırdı ve kırmızı pigment, güneşin ultraviyole (UV) ışınlarına karşı en zayıf pigment olduğu için pembeye dönerdi. Günümüz otomobillerinde ise boyanın üzerine, onu UV ışınlarından tamamen koruyan şeffaf ve çok sert bir vernik katmanı atılır. Vernik bakımlı olduğu (pasta-cila) sürece kırmızı araç güneşten etkilenmez.",
        seoTitle: "Kırmızı Araba Boyası Güneşte Solar Mı?",
        seoDescription: "Hangi renk arabanın boyası güneşte solar? Eski kırmızı arabalar neden pembeye dönerdi ve modern vernik (Clear coat) teknolojisinin koruması."
    },

    // YENİ EKLENEN 14 DEV EFSANE
    {
        id: 26,
        slug: "fren-hidroligine-su-karismasi",
        category: 'safety',
        myth: "Fren hidroliği yıllarca değişmese de olur, fren tutuyorsa sorun yoktur.",
        reality: "Fren hidroliği havadaki nemi emer, içine su karışan hidrolik dağdan inerken kaynar ve fren patlar.",
        explanation: "Fren hidroliği higroskopiktir, yani havadaki nemi sünger gibi çeker. Yeni bir hidroliğin kaynama noktası 250 derecedir. İçine sadece %3 su karıştığında bu nokta 150 dereceye düşer. Dik bir yokuş inerken frene bastığınızda disklerdeki ısı hidroliğe geçer, su kaynayarak buharlaşır ve gaz balonu oluşturur. Sıvılar sıkıştırılamaz ama gazlar sıkıştırılır, bu yüzden fren pedalınız boşa düşer (fren patlar). 2 yılda bir değişimi şarttır.",
        seoTitle: "Fren Hidroliği Neden Değişir? Su Karışması",
        seoDescription: "Fren hidroliği değişmezse ne olur? Fren hidroliğinin nem (su) emmesi, kaynaması ve fren patlaması (boşa düşmesi) tehlikesi."
    },
    {
        id: 27,
        slug: "turbolu-araci-stop-etmeden-beklemek",
        category: 'engine',
        myth: "Turbolu arabayı stop etmeden önce her zaman 1 dakika rölantide beklemek gerekir.",
        reality: "Sadece uzun yoldan veya sert kullanımdan sonra gereklidir, şehir içinde park ederken ekstra beklemeye gerek yoktur.",
        explanation: "Turboşarj cihazı egzoz gazıyla 150.000 devir/dakika hızda döner ve çok ısınır. Uzun yolda yüksek hızla gittikten hemen sonra motoru kapatırsanız, yağ pompası durur ama turbo kendi ataletiyle dönmeye devam eder. Yağsız dönen turbo mili kavrulur. Ancak şehir içi hızlarda evinize veya otoparka yanaşana kadar geçen sürede turbo çoktan rölanti devrine inmiş ve soğumuştur. Fazladan 1 dk beklemek sadece yakıt israfıdır.",
        seoTitle: "Turbolu Aracı Stop Etmeden Önce Beklemek Gerekir Mi?",
        seoDescription: "Turbo motorlu arabayı stop etmeden önce rölantide kaç saniye beklenmeli? Turbonun yağlanması ve mil kesmesi arızası."
    },
    {
        id: 28,
        slug: "egzozdan-su-damlamasi-motorun-sagligi",
        category: 'engine',
        myth: "Arabanın egzozundan su damlıyorsa motor harika durumdadır ve saat gibi çalışıyordur.",
        reality: "Motorun harika olduğunu değil, sadece kimyasal yanmanın tam gerçekleştiğini gösterir.",
        explanation: "Benzin ve LPG hidrokarbon bileşikleridir. Yanma reaksiyonu sonucu hidrojen ve oksijen birleşerek H2O (su) oluşturur. Bu buhar halindedir ancak soğuk egzoz borusuna çarpınca yoğuşarak su damlası halinde yere düşer. Bu durum motorun gücünü, kompresyonunu veya sağlığını göstermez, sadece katalitik konvertörün görevini yaptığını ve standart bir kimyasal tepkimenin oluştuğunu gösterir.",
        seoTitle: "Egzozdan Su Gelmesi Motorun İyi Olduğunu Mu Gösterir?",
        seoDescription: "Arabanın egzozundan su damlaması veya su atması ne anlama gelir? Motorun harika çalıştığının bir kanıtı mıdır?"
    },
    {
        id: 29,
        slug: "klima-gazi-her-sene-basilir-mi",
        category: 'general',
        myth: "Arabanın klima gazı zamanla biter, bu yüzden her yaza girerken gaz bastırmak gerekir.",
        reality: "Klima tamamen kapalı bir sistemdir, gaz eksiliyorsa kesinlikle bir yerde kaçak vardır.",
        explanation: "Otomobil kliması tıpkı evinizdeki buzdolabı gibi kapalı devre çalışan bir sistemdir. Buzdolabınıza her yaz gaz bastırmadığınız gibi arabanıza da bastırmamalısınız. Eğer soğutma azaldıysa, borularda, kompresörde veya radyatörde kılcal bir delik (kaçak) vardır. Kaçak bulunup onarılmadan basılan gaz, birkaç ay içinde tekrar atmosfere karışarak hem doğaya hem de cüzdanınıza zarar verir.",
        seoTitle: "Araba Klima Gazı Biter Mi? Her Yıl Basılır Mı?",
        seoDescription: "Otomobil klimasının gazı zamanla neden biter? Kaçak tespiti yapılmadan klima gazı doldurmanın zararları."
    },
    {
        id: 30,
        slug: "el-freni-cekmek-teli-koparir",
        category: 'general',
        myth: "Araç park halindeyken el frenini çekmek telini koparır veya dondurur, vitese takıp bırakmak daha iyidir.",
        reality: "Vitese takıp bırakmak aracın tüm tonajını şanzıman dişlilerine bindirerek dişlileri kırar.",
        explanation: "Özellikle otomatik vitesli araçlarda yokuşta durup doğrudan 'P' konumuna alıp ayağınızı frenden çekerseniz, aracın tüm ağırlığı şanzımanın içindeki serçe parmağı büyüklüğündeki park pimine biner. Ertesi gün vitesi P'den D'ye alırken o korkunç 'tak' sesini duyarsınız. Doğru sıralama: Önce ayak frenine bas, vitesi N'ye (boşa) al, el frenini çek, ayak frenini bırak (yükü el frenine ver) ve en son P'ye al.",
        seoTitle: "El Freni Çekmek Mi Vitese Takmak Mı?",
        seoDescription: "Otomatik vites park ederken önce el freni mi çekilir P'ye mi alınır? Şanzıman pimini kırmamak için doğru park sıralaması."
    },
    {
        id: 31,
        slug: "disk-fren-torna-islemi",
        category: 'safety',
        myth: "Balatalar bittiğinde veya diskler çizildiğinde her zaman diskleri torna yaptırmak en mantıklı ve ucuz yoldur.",
        reality: "Torna diski inceltir, incelen disk aşırı ısınarak yamulur ve hayati risk taşır.",
        explanation: "Fren disklerinin üzerinde üretici tarafından belirlenmiş 'Minimum Kalınlık' (Min. TH) ölçüsü yazar. Tornalama işlemi diskten talaş kaldırarak onu inceltir. İncelen disk, frenleme anında ortaya çıkan muazzam ısıyı tahliye edemez ve saniyeler içinde kızarır. Su birikintisine girdiğiniz anda termal şok ile anında yamulur. Yamuk disk, yüksek hızda frene bastığınızda direksiyonu şiddetle titretir ve fren mesafesini metrelerce uzatır.",
        seoTitle: "Fren Diski Tornalatmak Zararlı Mı?",
        seoDescription: "Fren diski ne zaman torna yapılır? İncelen fren diskinin ısınması, yamulması ve yüksek hızda direksiyon titremesine yol açması."
    },
    {
        id: 32,
        slug: "cam-suyuna-deterjan-veya-antifriz",
        category: 'general',
        myth: "Cam suyuna antifriz yerine bulaşık deterjanı veya mavi motor antifrizi koymak camı mükemmel temizler.",
        reality: "Bulaşık deterjanı kireçlenme yapar, motor antifrizi ise boyayı ve plastik silecekleri asit gibi eritir.",
        explanation: "Bulaşık deterjanları bol miktarda tuz ve sodyum içerir. Zamanla cam suyu pompasını ve ince fıskiye uçlarını kireçlendirip tamamen tıkar. Motor suyunun donmasını engelleyen kimyasal antifrizleri cama sıkarsanız, kaportaya süzülen damlalar zamanla araç boyasının verniğini yakar ve silecek lastiklerini sertleştirerek parçalar. Sadece özel üretilmiş izopropil alkol bazlı oto cam suları kullanılmalıdır.",
        seoTitle: "Cam Suyuna Bulaşık Deterjanı Konur Mu?",
        seoDescription: "Araba cam suyuna motor antifrizi veya bulaşık deterjanı eklemek zararlı mı? Fıskiye tıkanması ve araç boyasına olan asidik etkiler."
    },
    {
        id: 33,
        slug: "yarim-debriyaj-ile-gitmek",
        category: 'general',
        myth: "Araç seyir halindeyken (özellikle yokuş aşağı veya virajda) debriyaja basılı tutarak gitmek güvenlidir ve yakıtı düşürür.",
        reality: "Baskı balatayı yakar ve motor frenini devre dışı bırakarak frenleri aşırı ısıtır.",
        explanation: "Debriyaj pedalına yarım veya tam basılı tutarak gitmek, motor ile tekerlekler arasındaki bağı keser. Aracın ağırlığı tamamen tekerleklere ve dolayısıyla fren balatalarına kalır. Virajlarda araç serbest salınıma geçer ve savrulma riski doğar. Ayrıca debriyaj bilyası (rulmanı) sürekli baskı altında kalacağı için ömrü onda birine düşer ve 'baskı balata sıyırması' dediğimiz on binlerce liralık masraf açar.",
        seoTitle: "Debriyaja Basarak Gitmek Zararlı Mı?",
        seoDescription: "Yokuş inerken veya viraja girerken debriyaja basmak yakıtı düşürür mü? Baskı balata sıyırması ve motor frenini kaybetmenin riskleri."
    },
    {
        id: 34,
        slug: "manuel-viteste-ara-gaz-vermek",
        category: 'general',
        myth: "Manuel viteste vites küçültürken mutlaka 'ara gaz' (çift debriyaj) vermek gerekir.",
        reality: "Eski kamyonlarda doğruydu, günümüzdeki senkromeçli şanzımanlarda tamamen gereksizdir.",
        explanation: "Eski tip şanzımanlarda dişlilerin dönüş hızını eşitleyen 'senkromeç' adı verilen mekanizmalar yoktu. Vitesin 'cıırt' etmeden geçmesi için şoförler boşa alıp gaz vererek motor ve şanzıman devrini manuel olarak eşitlerdi. Yeni nesil araçlarda senkromeçler bu işi kusursuz yapar. Günümüzde ara gaz vermek sadece debriyaj diskinin ömrünü kısaltır ve yakıt israfıdır (Motorsporlarındaki profesyonel Heel-and-Toe tekniği hariç).",
        seoTitle: "Vites Değiştirirken Ara Gaz Vermek Gerekir Mi?",
        seoDescription: "Manuel viteste vites küçültürken ara gaz (çift debriyaj) ne işe yarar? Senkromeçli modern şanzımanlarda bu uygulamanın gereksizliği."
    },
    {
        id: 35,
        slug: "arap-sabunu-ve-kola-ile-lastik-parlatmak",
        category: 'tire',
        myth: "Arap sabunu veya kola ile lastik parlatmak lastiği korur ve siyah kalmasını sağlar.",
        reality: "Kola içindeki asit ve şeker lastik kauçuğunu kurutarak derin çatlaklara yol açar.",
        explanation: "Kola, içeriğinde yüksek oranda fosforik asit ve şeker barındırır. Bu maddeler lastiğin yanak kısmındaki koruyucu balmumu tabakasını çözer ve kauçuğu güneşe karşı tamamen savunmasız bırakır. İlk başta parlak görünse de birkaç hafta içinde lastik yanaklarında tehlikeli 'kılcal çatlaklar' oluşmaya başlar. Lastikler sadece pH nötr, su bazlı ve silikonsuz özel temizleyicilerle parlatılmalıdır.",
        seoTitle: "Kola İle Lastik Parlatmak Zararlı Mı?",
        seoDescription: "Arap sabunu veya şekerli kola ile araç lastiği parlatmanın zararları. Asit ve şekerin lastik yanaklarında oluşturduğu kılcal çatlaklar."
    },
    {
        id: 36,
        slug: "airbag-lambasi-yanarken-kaza-yapmak",
        category: 'safety',
        myth: "Göstergede Airbag (Hava Yastığı) arıza lambası yanıyorsa kaza anında hiçbir hava yastığı açılmaz.",
        reality: "Sistem tüm hava yastıklarını kapatmaz, hata tespit edilmeyen diğer yastıklar hayat kurtarmak için açılabilir.",
        explanation: "Airbag beyni (SRS) akıllı bir sistemdir. Lamba, sistemdeki bir sensör, kablo veya sokette hata olduğunda yanar (Örneğin sadece yolcu koltuğu altındaki ağırlık sensörü bozuktur). Beyin, arızalı olduğunu bildiği bölgeyi devreden çıkarır, ancak kaza anında sağlam olan (örneğin sürücü tarafı) hava yastıklarını yine de tetikler. Tabii ki risk alınmamalı ve arıza derhal onarılmalıdır.",
        seoTitle: "Airbag Lambası Yanarken Hava Yastığı Açılır Mı?",
        seoDescription: "Gösterge panelinde airbag arıza lambası yanıyorsa kaza anında hava yastıkları patlar mı? SRS beyninin arıza tolerans sistemi."
    },
    {
        id: 37,
        slug: "sicak-arabada-klimayi-son-guc-acmak",
        category: 'general',
        myth: "Güneşte uzun süre kalan arabanın içi fırın gibiyken, klimayı aniden en soğukta cama vermek ön camı patlatır.",
        reality: "Termal şok nedeniyle kısmen doğru olsa da, cam sağlam ise patlamaz, ancak mikro çatlak varsa paramparça eder.",
        explanation: "Otomobil camları yüksek sıcaklık değişimlerine dayanıklı temperli ve lamine yapılardır. Ancak camınızda önceden yoldan sıçrayan minik bir taş izi veya gözle görülmeyen bir mikro çatlak varsa işler değişir. 60 dereceye kadar ısınmış bir cama aniden 5 derecelik buz gibi hava üfletildiğinde 'Termal Şok' (ani büzülme) yaşanır. O minik taş izi saniyeler içinde boydan boya devasa bir çatağa dönüşür.",
        seoTitle: "Sıcak Arabada Klima Açmak Camı Çatlatır Mı?",
        seoDescription: "Güneşte ısınmış araba camına aniden soğuk klima üfletmek (termal şok) camı kırar mı? Taş izi olan camlardaki genleşme riski."
    },
    {
        id: 38,
        slug: "motora-sadece-cesme-suyu-koymak",
        category: 'engine',
        myth: "Yaz aylarında motor soğutma suyuna antifriz koymaya gerek yoktur, çeşme suyu da aynı işi görür.",
        reality: "Çeşme suyu kireç ve mineral doludur, motorun kılcal su kanallarını tıkayarak paslandırır ve hararete yol açar.",
        explanation: "Antifriz sadece suyun donmasını engellemez. İçindeki korozyon önleyiciler (inhibitörler) sayesinde su devridaim pompasını yağlar, motor bloğunun içten paslanmasını ve çürümesini engeller. Çeşme suyu 100 derecede kaynarken, antifriz+saf su karışımı basınç altında 120-130 derecelere kadar kaynamadan durabilir. Antifriz yaz-kış 365 gün motorda kalması gereken hayati bir sıvıdır.",
        seoTitle: "Motor Suyuna Antifriz Yerine Çeşme Suyu Konur Mu?",
        seoDescription: "Yazın antifriz yerine normal kireçli çeşme suyu kullanmanın zararları. Motor bloğunda paslanma, devridaim çürümesi ve hararet efsanesi."
    },
    {
        id: 39,
        slug: "kasislerden-hizli-gecmek",
        category: 'tire',
        myth: "Bozuk yollarda veya kasislerde hızlı geçmek amortisöre zarar vermez, yavaş geçince araba daha çok sallanır.",
        reality: "Hızlı geçmek süspansiyon kulelerine tonlarca anlık darbe yükler ve alt takımı paramparça eder.",
        explanation: "Hızlı geçtiğinizde kabin içinde sarsıntıyı daha az hissedebilirsiniz çünkü süspansiyon darbeyi aniden emer ve tekerlek havada asılı kalarak zemine uyum sağlar. Ancak fizik kanunları gereği (Momentum), 1.5 tonluk aracın tüm kinetik enerjisi anlık olarak amortisör kulelerine, rot başlarına ve salıncak burçlarına biner. Bu şok darbesi zamanla kule sacını yırtar, amortisör milini eğer ve tekerlek bilyasını dağıtır.",
        seoTitle: "Kasislerden Hızlı Geçmek Arabaya Zarar Verir Mi?",
        seoDescription: "Bozuk yolda veya çukurda hızlı gitmek mi yavaş gitmek mi arabayı daha çok bozar? Süspansiyon şoku ve ön takım (rot-balans) parçalanması."
    }
];
