// Dictionary (Sözlük) Data Model

export type DictionaryCategory =
    | 'Mekanik'
    | 'Elektrik'
    | 'Lastik/Jant'
    | 'Sürüş'
    | 'Sıvılar'
    | 'Sigorta/Resmi'
    | 'Elektronik/OBD';

export interface DictionaryTerm {
    id: string;
    term: string;
    description: string;
    why: string;
    category: DictionaryCategory;
    letter: string;
}

// Category Colors
export const categoryColors: Record<DictionaryCategory, string> = {
    'Mekanik': '#667EEA',
    'Elektrik': '#F093FB',
    'Lastik/Jant': '#4FACFE',
    'Sürüş': '#43E97B',
    'Sıvılar': '#FA709A',
    'Sigorta/Resmi': '#FF9A56',
    'Elektronik/OBD': '#7F7FD5'
};

// Dictionary Terms (A-Z)
export const dictionaryTerms: DictionaryTerm[] = [
    {
        id: 'abs',
        term: 'ABS (Anti-lock Braking System)',
        description: 'Fren yaparken tekerleklerin kilitlenmesini önleyen elektronik güvenlik sistemi. Fren pedalına basıldıÃ„şında, sistem saniyede onlarca kez fren gücünü ayarlayarak tekerleklerin dönmeye devam etmesini saÃ„şlar.',
        why: 'Kilitlenmiş tekerlekler yönlendirilemez. ABS sayesinde fren yaparken bile direksiyonla manevra yapabilirsiniz. Özellikle ıslak ve buzlu zeminde hayat kurtarıcıdır.',
        category: 'Elektronik/OBD',
        letter: 'A'
    },
    {
        id: 'acc',
        term: 'ACC (Adaptive Cruise Control)',
        description: 'Önündeki aracı radar veya kamera ile tespit ederek otomatik olarak mesafe tutan adaptif hız sabitleyici. Önünüzdeki araç yavaşlarsa sizin aracınız da yavaşlar, hızlanırsa belirlenen hıza kadar hızlanır.',
        why: 'Uzun yolculuklarda sürücü yorgunluÃ„şunu azaltır ve güvenli takip mesafesi saÃ„şlar. Trafikteki ani fren durumlarına daha hızlı tepki verebilir.',
        category: 'Elektronik/OBD',
        letter: 'A'
    },
    {
        id: 'airbag',
        term: 'Airbag (Hava YastıÃ„şı)',
        description: 'Çarpışma anında milisaniyeler içinde şişerek sürücü ve yolcuları korumak için tasarlanmış güvenlik yastıkları. Kaza sensörleri çarpışmayı algıladıÃ„şında gaz jeneratörü devreye girer ve yastık şişer.',
        why: 'Emniyet kemeri ile birlikte kullanıldıÃ„şında ölüm riskini %50\'ye kadar azaltır. Baş ve göÃ„şüs bölgesine gelen darbeyi yumuşatarak ciddi yaralanmaları önler.',
        category: 'Elektronik/OBD',
        letter: 'A'
    },
    {
        id: 'beygir_gucu',
        term: 'Beygir Gücü (HP / BG)',
        description: 'Motorun ürettiÃ„şi maksimum gücü ifade eden birim. 1 beygir gücü = 735.5 Watt\'a eşittir. Genellikle motor devrinin yüksek olduÃ„şu bir noktada (örn: 5500 RPM) ölçülür.',
        why: 'Aracın ne kadar hızlı maksimum hıza ulaşacaÃ„şını belirler. Ancak tek başına performans göstergesi değildir; tork ve aÃ„şırlık da önemlidir.',
        category: 'Mekanik',
        letter: 'B'
    },
    {
        id: 'catalytic_converter',
        term: 'Katalitik Konvertör',
        description: 'Egzoz gazlarındaki zararlı maddeleri (karbon monoksit, azot oksitler, hidrokarbonlar) kimyasal reaksiyon ile zararsız hale getiren egzoz sistemi parçası. İçinde platin, rodyum ve paladyum gibi değerli metaller bulunur.',
        why: 'Emisyon değerlerini düşürerek çevreyi korur ve aracın muayeneden geçmesi için Şarttır. BozulduÃ„şunda araç güç kaybeder ve yakıt tüketimi artar.',
        category: 'Mekanik',
        letter: 'C'
    },
    {
        id: 'clutch',
        term: 'Debriyaj (Kavrama)',
        description: 'Motor ile Şanzıman arasındaki güç aktarımını kontrol eden mekanik sistem. Pedala basıldıÃ„şında motor ile vites kutusu birbirinden ayrılır, vites değişimi yapılabilir.',
        why: 'Yumuşak kalkış ve vites değişimi için zorunludur. Aşınmış debriyaj patinaj yapar, güç kaybına ve yakıt israfına neden olur.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'dpf',
        term: 'DPF (Dizel Partikül Filtresi)',
        description: 'Dizel motorlardan çıkan is ve partikül maddeleri filtreleyen sistem. Belli aralıklarla yüksek ısıda kendini temizler (rejenerasyon).',
        why: 'Dizel araçların emisyon standartlarına uymasını saÃ„şlar. Tıkalı DPF motor performansını düşürür, yakıt tüketimini artırır ve araca zarar verebilir.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'egr',
        term: 'EGR Valfi (Egzoz Gazı Resirkülasyonu)',
        description: 'Egzoz gazlarının bir kısmını tekrar emişe göndererek yanma sıcaklıÃ„şını düşüren ve emisyonu azaltan valf.',
        why: 'Azot oksit emisyonunu düşürür. Ancak tıkanması motor performansını olumsuz etkiler ve hata kodlarına neden olur.',
        category: 'Mekanik',
        letter: 'E'
    },
    {
        id: 'esp',
        term: 'ESP (Elektronik Stabilite Programı)',
        description: 'Aracın savrulmasını ve kontrolden çıkmasını önleyen aktif güvenlik sistemi. Sensörler aracın yönünü sürekli izler, eÃ„şer sürücü istediği yöne gidemiyorsa sistem tek tek tekerleklere fren uygular.',
        why: 'Özellikle ıslak ve buzlu zeminde, ani manevralarda hayat kurtarır. Kaza riskini %25-30 oranında azaltır.',
        category: 'Elektronik/OBD',
        letter: 'E'
    },
    {
        id: 'horsepower',
        term: 'Hidrolik Direksiyon',
        description: 'Direksiyon çarkını döndürmeyi kolaylaştıran, hidrolik pompa ve silindir kullanarak güç desteÃ„şi saÃ„şlayan sistem.',
        why: 'Park manevralarını kolaylaştırır ve sürücü yorgunluÃ„şunu azaltır. Hidrolik sızıntısı direksiyonun aÃ„şırlaşmasına neden olur.',
        category: 'Sürüş',
        letter: 'H'
    },
    {
        id: 'km_counter',
        term: 'Kilometre Saatı (Km Sayacı)',
        description: 'Aracın toplam ne kadar yol kat ettiÃ„şini gösteren elektronik veya mekanik gösterge. Dijital sayaçlar yazılımla geri çevrilebilir.',
        why: 'Aracın değerini ve bakım geçmişini belirlemede kritiktir. Manipüle edilmiş kilometre ikinci el alıcıları yanıltır.',
        category: 'Sigorta/Resmi',
        letter: 'K'
    },
    {
        id: 'mass_air_flow',
        term: 'MAF Sensörü (Hava Akış Sensörü)',
        description: 'Motora giren hava miktarını ölçen sensör. Bu veriye göre motor beyni yakıt miktarını ayarlar.',
        why: 'Bozuk MAF sensörü hatalı hava-yakıt karışımı yaratır, rölanti düzensizliÃ„şi ve yüksek yakıt tüketimine neden olur.',
        category: 'Elektronik/OBD',
        letter: 'M'
    },
    {
        id: 'obd',
        term: 'OBD (On-Board Diagnostics)',
        description: 'Aracın elektronik sistemlerini izleyen ve hata kodları kaydeden teşhis sistemi. OBD soketi üzerinden tarayıcı ile okunabilir.',
        why: 'Arızaların erken tespiti için kritiktir. Motor ışıÃ„şı yandıÃ„şında OBD taraması sorunu net olarak gösterir.',
        category: 'Elektronik/OBD',
        letter: 'O'
    },
    {
        id: 'piston',
        term: 'Piston',
        description: 'Silindir içinde yukarı aşaÃ„şı hareket eden, yanma basıncını krank miline ileten motor parçası. Segmanlar ile silindir duvarına sızdırmaz Şekilde oturur.',
        why: 'Motorun kalbini oluşturur. Aşınmış piston veya segmanlar yaÃ„ş yakmasına, güç kaybına ve sonunda motor arızasına yol açar.',
        category: 'Mekanik',
        letter: 'P'
    },
    {
        id: 'radiator',
        term: 'Radyatör',
        description: 'Motor soÃ„şutma sıvısını hava ile temas ettirerek soÃ„şutan ısı eşanjörü. İçinden geçen antifriz, motordan aldıÃ„şı ısıyı havaya verir.',
        why: 'Motor aşırı ısınmasını önler. Tıkalı veya sızdıran radyatör motor hararetine ve silindir kapak contası yanmasına neden olur.',
        category: 'Sıvılar',
        letter: 'R'
    },
    {
        id: 'shock_absorber',
        term: 'Amortisör',
        description: 'Süspansiyon yaylarının titreşimlerini sönümleyen hidrolik veya gazlı parça. Aracın yol tutuşunu ve konforunu saÃ„şlar.',
        why: 'Bozuk amortisör fren mesafesini uzatır, lastik ömrünü kısaltır ve viraj stabilitesini bozar. Her 80-100 bin km\'de değiştirilmelidir.',
        category: 'Mekanik',
        letter: 'A'
    },
    {
        id: 'timing_belt',
        term: 'Triger Kayışı (Zamanlama Kayışı)',
        description: 'Krank mili ile eksantrik mili senkronize eden, supapların doÃ„şru zamanda açılıp kapanmasını saÃ„şlayan kayış. Belli kilometre aralıklarında değiştirilmesi zorunludur.',
        why: 'Kopan triger kayışı supapların pistonlara çarpmasına (motor vurması) ve binlerce liralık hasara neden olur. Değişim aralıÃ„şını ihmal etmek felaket getirir.',
        category: 'Mekanik',
        letter: 'T'
    },
    {
        id: 'turbo',
        term: 'Turboşarj',
        description: 'Egzoz gazlarının enerjisiyle dönen türbin sayesinde motora daha fazla hava pompalayan süperşarj sistemi. Daha fazla hava = daha fazla yakıt = daha fazla güç.',
        why: 'Küçük motorlardan yüksek performans alınmasını saÃ„şlar. Turbo arızası ciddi güç kaybı ve kara duman demektir.',
        category: 'Mekanik',
        letter: 'T'
    },
    {
        id: 'tire_pressure',
        term: 'Lastik Basıncı',
        description: 'LastiÃ„şin içindeki havanın PSI veya Bar cinsinden ölçülen basıncı. Her araç için önerilen basınç değeri kapı iç etiketinde yazar.',
        why: 'Düşük basınç yakıt tüketimini artırır ve lastiÃ„şi aşındırır. Yüksek basınç konfor kaybı ve patlama riski yaratır. Ayda bir kontrol Şarttır.',
        category: 'Lastik/Jant',
        letter: 'L'
    },
    {
        id: 'traction_control',
        term: 'ASR/TCS (Çekiş Kontrolü)',
        description: 'Hızlanma sırasında tekerleklerin boşta dönmesini (patinaj) önleyen sistem. Motor gücünü ve frenleri kontrol ederek çekişi optimize eder.',
        why: 'Kaygan zeminde (kar, buz, çamur) kalkışı kolaylaştırır. KapandıÃ„şında tekerlekler boşa döner ve kontrol kaybı riski artar.',
        category: 'Elektronik/OBD',
        letter: 'A'
    },
    {
        id: 'alternator',
        term: 'Alternatör (Dinamo)',
        description: 'Motor çalışırken elektrik üreten ve aküyü Şarj eden jeneratör. Kayış ile motora baÃ„şlıdır.',
        why: 'Arızalı alternatör aküyü boşaltır ve araç durur. Gösterge panelindeki pil ışıÃ„şı alternatör arızasına işaret eder.',
        category: 'Elektrik',
        letter: 'A'
    },
    {
        id: 'brake_fluid',
        term: 'Fren HidroliÃ„şi (Fren Sıvısı)',
        description: 'Fren pedalındaki kuvveti hidrolik basınca çevirerek fren kaliperine ileten özel sıvııvı. Nemli ortamlarda su emer, bu yüzden periyodik değişim gerekir.',
        why: 'Eski fren hidroliÃ„şi su emdiğinde kaynama noktası düşer, frenler sıcakken tutmayabilir. 2 yılda bir değiştirilmelidir.',
        category: 'Sıvılar',
        letter: 'F'
    },
    {
        id: 'lambda',
        term: 'Lambda (Oksijen) Sensörü',
        description: 'Egzoz gazlarındaki oksijen oranını ölçerek yakıt-hava karışımını optimize eden sensör.',
        why: 'Bozuk lambda sensörü yüksek yakıt tüketimi, güç kaybı ve emisyon artışına neden olur. Katalitik konvertörü de zarar görebilir.',
        category: 'Elektronik/OBD',
        letter: 'L'
    },
    {
        id: 'cv_joint',
        term: 'Aks Kafası (Homokinetik Mafsal)',
        description: 'Şanzımandan tekerleklere güç aktaran aksların uçlarındaki döner mafsallar. Lastik çevresini korumak için körüklerle kaplanır.',
        why: 'Yırtık körük içeri kir alır, aks kafası bozulur. Virajlarda "tak tak" sesi aks kafası arızasına işaret eder.',
        category: 'Mekanik',
        letter: 'A'
    },
    {
        id: 'wheel_bearing',
        term: 'Porya (Tekerlek Bilyası)',
        description: 'TekerleÃ„şin aksa sorunsuz dönmesini saÃ„şlayan rulman sistemi.',
        why: 'Bozuk porya uÃ„şultu sesi yapar, aşırı ısınır ve en kötü senaryoda tekerlek kilitlenebilir. Yüksek hızda tehlikelidir.',
        category: 'Mekanik',
        letter: 'P'
    },
    {
        id: 'injector',
        term: 'Enjektör',
        description: 'Yakıtı yüksek basınçla sis halinde püskürterek yanma odasına enjekte eden nozul.',
        why: 'Tıkalı enjektör düzensiz yanmaya, titreşime ve güç kaybına neden olur. Kaliteli yakıt kullanımı ve periyodik temizlik gerekir.',
        category: 'Mekanik',
        letter: 'E'
    },
    {
        id: 'coolant',
        term: 'Antifriz (SoÃ„şutma Suyu)',
        description: 'Motorun aşırı ısınmasını önleyen ve kışın donmayı engelleyen özel sıvıoÃ„şutma sıvısı. İçindeëÂ¶â‚¬ëÂ�™Ã¬•Â¡ ve korozyon önleyici katkılar bulunur.',
        why: 'Suyun donması motor bloÃ„şunu çatlatabilir. Antifriz aynı zamanda pas ve korozyonu da önler.',
        category: 'Sıvılar',
        letter: 'A'
    },
    {
        id: 'serpentine_belt',
        term: 'V-Kayışı (Kanallı Kayış)',
        description: 'Alternatör, klima kompresörü, hidrolik pompası gibi yan aksamları döndüren kayış.',
        why: 'Kopan kayış tüm bu sistemleri durdurur. Araç hareket edebilir ama Şarj olmaz, klima çalışmaz, direksiyon aÃ„şırlaşır.',
        category: 'Mekanik',
        letter: 'V'
    },
    {
        id: 'brake_pads',
        term: 'Fren Balatası',
        description: 'Fren diskine sürtünerek aracı yavaşlatan sürtünme malzemesi.',
        why: 'Aşınmış balata disk yüzeyini çizer (oluk atar), fren mesafesi uzar. Metal sesi geliyorsa balata tamamen bitmiş demektir.',
        category: 'Mekanik',
        letter: 'F'
    },
    {
        id: 'tire_tread',
        term: 'Lastik Diş DerinliÃ„şi',
        description: 'LastiÃ„şin yol tutuş yüzeyindeki olukların derinliÃ„şi. Yasal minimum 1.6mm olsa da güvenlik için 3-4mm altına düşmemelidir.',
        why: 'Aşınmış lastik yaÃ„şmurlu havada suda kızaklama (aquaplaning) riskini artırır. Fren mesafesi uzar.',
        category: 'Lastik/Jant',
        letter: 'L'
    },
    {
        id: 'adblue',
        term: 'AdBlue',
        description: 'Dizel motorlarda egzoz emisyonunu düşürmek için SCR katalizörüne püskürtülen üre bazlı sıvı.',
        why: 'Euro 6 emisyon standartlarını karşılamak için zorunludur. AdBlue biterse araç çalışmayabilir.',
        category: 'Sıvılar',
        letter: 'A'
    },
    {
        id: 'agir_hasar',
        term: 'Ağır Hasar Kayıtlı (Pert)',
        description: 'Aracın kaza sonucu onarım masraflarının piyasa değerine yaklaşması veya geçmesi durumu. Sigorta Şirketi aracı "pert"e ayırır.',
        why: 'İkinci el alımında en büyük risk faktörüdür. Aracın güvenlik Şasi bütünlüÃ„şü bozulmuş olabilir, değeri düşüktür.',
        category: 'Sigorta/Resmi',
        letter: 'A'
    },
    {
        id: 'chip_tuning',
        term: 'Chip Tuning (Yazılım)',
        description: 'Motor kontrol ünitesinin (ECU) yazılımını değiştirerek daha fazla güç veya yakıt tasarrufu elde etme işlemi. "Stage 1", "Stage 2" gibi seviyeleri vardır.',
        why: 'Düşük maliyetle yüksek performans artışı saÃ„şlar ancak motor ömrünü kısaltabilir ve garanti dışı bırakabilir.',
        category: 'Elektronik/OBD',
        letter: 'C'
    },
    {
        id: 'coilover',
        term: 'Coilover',
        description: 'YüksekliÃ„şi ve sertliÃ„şi ayarlanabilen spor süspansiyon sistemi. Yay ve amortisör tek bir ünite halindedir.',
        why: 'Yol tutuşu artırır ve aracı alçaltarak sportif görünüm saÃ„şlar. Konforu azaltabilir.',
        category: 'Mekanik',
        letter: 'C'
    },
    {
        id: 'dsg',
        term: 'DSG (Direct Shift Gearbox)',
        description: 'Volkswagen grubunun geliştirdiği çift kavramalı otomatik Şanzıman teknolojisi. İki ayrı Şaft ve debriyaj seti kullanır.',
        why: 'Vites geçişleri milisaniyeler sürer, güç kaybı yaşanmaz ve yakıt tüketimi düşüktür. Ancak karmaşık yapısı onarım maliyetlerini artırır.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'ekspertiz',
        term: 'Ekspertiz (Oto Check-Up)',
        description: 'İkinci el araç alım satımında, baÃ„şımsız uzmanlar tarafından aracın kaza, boya, motor ve mekanik durumunun detaylı incelenmesi.',
        why: 'Satıcının beyanına güvenmek yerine aracın gerçek durumunu belgelendirir. Sürpriz masraflardan ve dolandırıcılıktan korur.',
        category: 'Sigorta/Resmi',
        letter: 'E'
    },
    {
        id: 'reaktefiye',
        term: 'Rektifiye (Motor Yenileme)',
        description: 'Aşınmış veya arızalanmış motorun sökülerek silindir, piston, yatak gibi parçalarının taşlanması veya değiştirilmesi işlemi.',
        why: 'Ömrünü tamamlamış motoru fabrika ayarlarına yakın performansa döndürür. Yeni motor almaktan daha ekonomiktir.',
        category: 'Mekanik',
        letter: 'R'
    },
    {
        id: 'sandik_motor',
        term: 'Sandık Motor',
        description: 'Fabrikadan tamamen montajlı, sıfır ve çalışmaya hazır halde kutusunda (sandıkta) gelen motor ünitesi.',
        why: 'Rektifiye tutmayacak kadar hasarlı motorlarda en temiz çözümdür. Garanti kapsamında olması büyük avantajdır.',
        category: 'Mekanik',
        letter: 'S'
    },
    {
        id: 'start_stop',
        term: 'Start-Stop Sistemi',
        description: 'Araç durduÃ„şunda (ışıklarda, trafikte) motoru otomatik kapatıp, debriyaja veya gaza basıldıÃ„şında tekrar çalıştıran sistem.',
        why: 'Rölantideki gereksiz yakıt tüketimini ve emisyonu önler. Şehir içi trafikte %15\'e varan tasarruf saÃ„şlar.',
        category: 'Elektronik/OBD',
        letter: 'S'
    },
    {
        id: 'tramer',
        term: 'Tramer (Hasar Kaydı)',
        description: 'Trafik Sigortaları Bilgi Merkezi\'nin kısaltması. Aracın geçmişteki sigorta hasar kayıtlarının (tutar, tarih, neden) sorgulandıÃ„şı sistem.',
        why: '5664\'e SMS atarak aracın "sicili" öÃ„şrenilebilir. Temiz bir geçmiş, aracın değerini korur.',
        category: 'Sigorta/Resmi',
        letter: 'T'
    },
    {
        id: 'conta_yakmak',
        term: 'Conta Yakmak (Silindir Kapak Contası)',
        description: 'Motorun aşırı ısınması sonucu (hararet), motor bloÃ„şu ile silindir kapaÃ„şı arasındaki sızdırmazlık contasının erimesi veya deforme olması.',
        why: 'Motor yaÃ„şı ve suyu birbirine karışır. Ciddi motor hasarına yol açar, motorun yenilenmesi gerekebilir.',
        category: 'Mekanik',
        letter: 'C'
    },
    {
        id: 'cvt',
        term: 'CVT Şanzıman (Sürekli Değişken)',
        description: 'Dişli çarklar yerine kasnak ve kayış sistemi kullanan, sonsuz vites oranına sahip otomatik Şanzıman türü. Vites geçişi hissedilmez.',
        why: 'Motoru sürekli en verimli devirde tutarak yakıt tasarrufu saÃ„şlar ve pürüzsüz bir sürüş sunar. Japon araçlarında yaygındır.',
        category: 'Mekanik',
        letter: 'C'
    },
    {
        id: 'immobilizer',
        term: 'Immobilizer',
        description: 'Aracın anahtarındaki çip ile motor beyninin eşleşmemesi durumunda motorun çalışmasını engelleyen elektronik hırsızlık önleme sistemi.',
        why: 'Düz kontak yapılarak aracın çalınmasını imkansız hale getirir. Güvenlik için standarttır.',
        category: 'Elektronik/OBD',
        letter: 'I'
    },
    {
        id: 'intercooler',
        term: 'Intercooler (Ara SoÃ„şutucu)',
        description: 'Turbo beslemeli araçlarda, turbonun sıkıştırdıÃ„şı ve ısınan havayı soÃ„şutarak motora gönderen radyatör benzeri parça.',
        why: 'SoÃ„şuk hava daha yoÃ„şundur ve daha fazla oksijen içerir. Bu sayede motor performansı artar ve yanma verimliliÃ„şi yükselir.',
        category: 'Mekanik',
        letter: 'I'
    },
    {
        id: 'isofix',
        term: 'Isofix',
        description: 'Çocuk güvenlik koltuklarının doÃ„şrudan aracın Şasisine monte edilmesini saÃ„şlayan uluslararası standart baÃ„şlantı noktaları.',
        why: 'Emniyet kemeri ile baÃ„şlamaya göre çok daha güvenli ve pratik bir montaj saÃ„şlar. Kaza anında koltuÃ„şun savrulmasını önler.',
        category: 'Sigorta/Resmi',
        letter: 'I'
    },
    {
        id: 'lpg',
        term: 'LPG (Otogaz)',
        description: 'Sıvılaştırılmış Petrol Gazı. Benzinli araçlara sonradan takılabilen veya fabrika çıkışlı olabilen ekonomik alternatif yakıt sistemi.',
        why: 'Benzine göre %40-50 yakıt tasarrufu saÃ„şlar. Ancak motoru daha sıcak çalıştırabilir ve bagaj hacminden çalabilir.',
        category: 'Sıvılar',
        letter: 'L'
    },
    {
        id: 'podye',
        term: 'Podye (Şase Ucu)',
        description: 'Aracın ön tekerleklerinin baÃ„şlandıÃ„şı, motoru taşıyan ve kaza anında darbeyi emen Şasinin en önemli güçlendirilmiş uç kısmı.',
        why: 'Ekspertizde "Podye işlemli" denmesi, aracın daha önce çok aÃ„şır bir önden kaza geçirdiğini ve güvenlik yapısının bozulduÃ„şunu gösterir.',
        category: 'Mekanik',
        letter: 'P'
    },
    {
        id: 'ppf',
        term: 'PPF Kaplama (Boya Koruma Filmi)',
        description: 'Aracın boyasını taş vurukları, çizikler ve kuş pisliÃ„şi gibi dış etkenlerden koruyan Şeffaf poliüretan film tabakası.',
        why: 'Aracın boyasını ilk günkü gibi korur. Kaliteli PPF kendini ısı ile onarabilir. İkinci el değerini korumak için yapılır.',
        category: 'Lastik/Jant', // Kategori tam uymasa da dış koruma
        letter: 'P'
    },
    {
        id: 'rot_balans',
        term: 'Rot-Balans Ayarı',
        description: 'Tekerleklerin yere basma açılarının (Rot) ve aÃ„şırlık daÃ„şılımının (Balans) ayarlanması işlemi.',
        why: 'Bozuk ayar lastikleri düzensiz aşındırır, direksiyon titrer ve araç saÃ„şa-sola çeker. Güvenli sürüş için periyodik yapılmalıdır.',
        category: 'Lastik/Jant',
        letter: 'R'
    },
    {
        id: 'tork',
        term: 'Tork (Çekiş Gücü)',
        description: 'Motorun krank milini döndürme kuvveti. Özellikle kalkışlarda, yokuş çıkarken ve yük taşırken hissedilen "koltuÃ„şa yapıştırma" gücüdür.',
        why: 'Beygir gücü son hızı, tork ise ara hızlanmayı ve çekişi belirler. Dizel ve elektrikli araçlarda tork yüksektir.',
        category: 'Mekanik',
        letter: 'T'
    },
    {
        id: 'buji',
        term: 'Buji (Ateşleme)',
        description: 'Benzinli motorlarda sıkışmış yakıt-hava karışımını elektrik kıvılcımı ile ateşleyen parça. Dizel motorlarda bulunmaz (Kızdırma bujisi hariç).',
        why: 'Eskiyen buji ateşlemeyi zayıflatır; araç tekler, yakıt tüketimi artar ve çekiş düşer. Periyodik değişimi ucuz ve hayatidir.',
        category: 'Mekanik',
        letter: 'B'
    },
    {
        id: 'head_up',
        term: 'Head-up Display (HUD)',
        description: 'Hız, navigasyon gibi kritik sürüş verilerini ön cama veya Şeffaf bir panele yansıtan sanal gösterge teknolojisi.',
        why: 'Sürücünün gözünü yoldan ayırmadan bilgi almasını saÃ„şlar. Savaş uçaklarından otomobillere geçmiş bir güvenlik teknolojisidir.',
        category: 'Elektronik/OBD',
        letter: 'H'
    },
    {
        id: 'hibrit',
        term: 'Hibrit Motor (Melez)',
        description: 'Aracın hem içten yanmalı (benzin/dizel) hem de elektrikli motora sahip olması. Şarj edilebilir (PHEV) veya kendi kendini Şarj eden türleri vardır.',
        why: 'Özellikle Şehir içi dur-kalk trafikte elektrikli motoru kullanarak yakıt tüketimini ve emisyonu ciddi oranda düşürür.',
        category: 'Mekanik',
        letter: 'H'
    },
    {
        id: 'karter',
        term: 'Karter (YaÃ„ş Haznesi)',
        description: 'Motorun en alt kısmında bulunan, motor yaÃ„şının toplandıÃ„şı ve soÃ„şuduÃ„şu metal kapak/hazne.',
        why: 'Aracın altını vurursanız karter delinip yaÃ„ş boşalabilir. YaÃ„şsız kalan motor saniyeler içinde kilitlenir (yatak sarar).',
        category: 'Mekanik',
        letter: 'K'
    },
    {
        id: 'kor_nokta',
        term: 'Kör Nokta Uyarı Sistemi',
        description: 'Yan aynaların görüş açısına girmeyen (kör nokta) araçları radarla tespit edip aynada ışıkla sürücüyü uyaran güvenlik asistanı.',
        why: 'Şerit değiştirirken yaşanabilecek kazaları önler. Omuz üstü bakışa gerek kalmadan güvenli manevra saÃ„şlar.',
        category: 'Sürüş',
        letter: 'K'
    },
    {
        id: 'mars_motoru',
        term: 'Marş Motoru',
        description: 'Kontak anahtarı çevrildiğinde motora ilk hareketi veren güçlü elektrik motoru. Aküden aldıÃ„şı enerjiyle volan dişlisini döndürür.',
        why: 'Marş basmıyorsa sorun genellikle aküde veya marş motorundadır. "Tık" sesi gelip çalışmıyorsa marş motoru kömürü bitmiş olabilir.',
        category: 'Elektrik',
        letter: 'M'
    },
    {
        id: 'run_flat',
        term: 'Run-Flat Lastik (Patlamayan)',
        description: 'Patlasa veya hava basıncı tamamen bitse bile güçlendirilmiş yanakları sayesinde 80 km/s hızla yaklaşık 80 km yol gidebilen lastik.',
        why: 'Issız bir yolda lastik değiştirme derdini ortadan kaldırır. Ancak konforu biraz daha serttir.',
        category: 'Lastik/Jant',
        letter: 'R'
    },
    {
        id: 'seramik_kaplama',
        term: 'Seramik Kaplama',
        description: 'Araç boyasının üzerine uygulanan, cam tozu ve kimyasallar içeren, sertleşince boyayı koruyan Şeffaf katman.',
        why: 'Boyayı güneş yanıÃ„şından, kuş pisliÃ„şinden ve ince çiziklerden korur. Araca derin bir parlaklık verir ve su tutmaz (hidrofobik).',
        category: 'Lastik/Jant',
        letter: 'S'
    },
    {
        id: 'serit_takip',
        term: 'Şerit Takip Sistemi',
        description: 'Ön camdaki kamera ile yol çizgilerini izleyen, araç Şeritten çıkarsa direksiyonu titreten veya otomatik düzelten asistan.',
        why: 'Dalgınlık veya uyku hali kaynaklı kazaları (yoldan çıkma) engeller. Otonom sürüşün temel taşlarından biridir.',
        category: 'Sürüş',
        letter: 'S'
    },
    {
        id: 'termostat',
        term: 'Termostat',
        description: 'Motor sıcaklıÃ„şını ideal seviyede (genellikle 90Ã‚°C) tutmak için soÃ„şutma suyu akışını açıp kapatan valf.',
        why: 'Termostat açık kalırsa motor ısınmaz (yakıt artar), kapalı kalırsa motor aşırı ısınır (hararet yapar, conta yakar).',
        category: 'Mekanik',
        letter: 'T'
    },
    {
        id: 'baski_balata',
        term: 'Baskı Balata (Debriyaj Seti)',
        description: 'Manuel vitesli araçlarda motor ile vites kutusu arasındaki baÃ„şlantıyı kesip saÃ„şlayan sürtünme sistemi. "Debriyaj bitmesi" aslında balatanın incelmesidir.',
        why: 'Biten balata kaçırır, araç baÃ„şırır ama gitmez. Yokuşta kalkış zorlaşır. Değişimi işçilikli ve maliyetlidir.',
        category: 'Mekanik',
        letter: 'B'
    },
    {
        id: 'devirdaim',
        term: 'Devirdaim Pompası (Su Pompası)',
        description: 'Motorun soÃ„şutma suyunu radyatör ve motor bloÃ„şu arasında sürekli döndüren pompa. Genellikle triger kayışından güç alır.',
        why: 'Arızalanırsa motor suyu dönmez ve dakikalar içinde hararet yapar. Triger seti değişirken mutlaka yenilenmelidir.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'diferansiyel',
        term: 'Diferansiyel',
        description: 'Motor gücünü tekerleklere ileten ve virajlarda iki tekerleÃ„şin farklı hızlarda dönmesini saÃ„şlayan dişli kutusu.',
        why: 'Diferansiyel olmasa araç viraj dönemez, lastikler sürüklenirdi. İç tekerlek yavaş, dış tekerlek hızlı dönmelidir.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'eksantrik',
        term: 'Eksantrik Mili (Kam Mili)',
        description: 'Motor supaplarının ne zaman açılıp kapanacaÃ„şını ayarlayan mil. Krank miline baÃ„şlı olarak döner.',
        why: 'Supap zamanlaması motorun nefes alıp vermesidir. Eksantrik sensörü arızası motorun çalışmasını engeller.',
        category: 'Mekanik',
        letter: 'E'
    },
    {
        id: 'krank',
        term: 'Krank Mili',
        description: 'Pistonların aşaÃ„şı-yukarı hareketini dairesel dönme hareketine çeviren, motorun omurgası sayılan dev metal mil.',
        why: 'Motorun ürettiÃ„şi tüm güç bu mil üzerinden Şanzımana aktarılır. Kırılması motorun tamamen iflas etmesi demektir.',
        category: 'Mekanik',
        letter: 'K'
    },
    {
        id: 'manifold',
        term: 'Manifold (Emme/Egzoz)',
        description: 'Motorun nefes borularıdır. Emme manifoldu temiz havayı silindirlere daÃ„şıtır, egzoz manifoldu yanmış gazı atar.',
        why: 'Manifold çatlaÃ„şı hava kaçaÃ„şına, güç kaybına ve içeri egzoz kokusu girmesine neden olur.',
        category: 'Mekanik',
        letter: 'M'
    },
    {
        id: 'salincak',
        term: 'Salıncak (Tabla)',
        description: 'TekerleÃ„şi Şasiye baÃ„şlayan, aşaÃ„şı yukarı esnemesini saÃ„şlayan metal kol. Ucunda hareketli rotil bulunur.',
        why: 'Çukura sert girince eÃ„şilebilir. EÃ„şik salıncak tekerleÃ„şin duruşunu bozar, araç yolda gezer ve lastik yer.',
        category: 'Mekanik',
        letter: 'S'
    },
    {
        id: 'saft',
        term: 'Şaft (Kardan Mili)',
        description: 'Arkadan itişli veya 4 çeker araçlarda, öndeki Şanzımandan aldıÃ„şı gücü arkadaki diferansiyele ileten uzun demir mil.',
        why: 'Dengesiz Şaft titreşim yapar, "uÃ„şultu" sesi çıkarır. Mafsalları bozulursa yolda bırakabilir.',
        category: 'Mekanik',
        letter: 'Ş' // "Ş" harfi olarak ekledik, sıralamada S'den sonra gelmeli
    },
    {
        id: 'volan',
        term: 'Volan (Oynar Göbek)',
        description: 'Krank miline baÃ„şlı, motorun titreşimini alan ve ilk hareketi marş motorundan kapan büyük dişli disk.',
        why: 'Bozuk volan stop ederken "lak luk" sesi yapar ve titreme yaratır. Değişimi pahalıdır.',
        category: 'Mekanik',
        letter: 'V'
    },
    {
        id: 'z_rot',
        term: 'Z-Rot (Askı Rotu)',
        description: 'Amortisör ile viraj demirini birbirine baÃ„şlayan, süspansiyonun en zayıf halkası sayılan parça.',
        why: 'Bozuk yolda "lok lok" sesi geliyorsa %90 Z-Rot bozulmuştur. Ucuz ve değişimi kolaydır.',
        category: 'Mekanik',
        letter: 'Z'
    },
    {
        id: 'aku',
        term: 'Akü (Batarya)',
        description: 'Aracın elektrik enerjisini depolayan, motor çalışmazken aydınlatma ve müzik sistemini besleyen, en önemlisi marş motorunu çalıştıran parça.',
        why: 'Biten akü ile araç çalışmaz (vurdurmak yeni araçlarda zararlıdır). SoÃ„şuk havalarda performansı düşer.',
        category: 'Elektrik',
        letter: 'A'
    },
    {
        id: 'bobin',
        term: 'Ateşleme Bobini',
        description: 'Aküden gelen 12 volt elektriÃ„şi binlerce volta yükselterek bujilere gönderen ve kıvılcım oluşmasını saÃ„şlayan trafo.',
        why: 'Bobin arızasında silindirlerden biri çalışmaz (tekler), araç titrer ve çekişten düşer.',
        category: 'Elektrik',
        letter: 'A' // "Ateşleme" ile başladıÃ„şı için A
    },
    {
        id: 'fren_diski',
        term: 'Fren Diski (Ayna)',
        description: 'Tekerlekle birlikte dönen, frene basınca balatanın üzerine baskı yaparak aracı durdurduÃ„şu metal plaka.',
        why: 'İncelen disk kırılabilir veya eÃ„şilerek titreme yapar. Balata ile birlikte periyodik kontrol edilmelidir.',
        category: 'Mekanik',
        letter: 'F'
    },
    {
        id: 'hava_filtresi',
        term: 'Hava Filtresi',
        description: 'Motorun emdiği havayı toz ve pislikten arındıran süzgeç. Motorun ciÃ„şeridir.',
        why: 'Tıkalı filtre ile motor nefes alamaz, çekiş düşer ve yakıt tüketimi artar.',
        category: 'Mekanik',
        letter: 'H'
    },
    {
        id: 'polen_filtresi',
        term: 'Polen Filtresi (Kabin)',
        description: 'Dışarıdan araç içine giren havayı süzen filtre. Klima sisteminin bir parçasıdır.',
        why: 'Değişmezse camlar çabuk buÃ„şulanır, içeride kötü koku oluşur ve alerjik reaksiyonlara neden olabilir.',
        category: 'Sıvılar', // Aslında filtre ama sarf malzeme mantıÃ„şında
        letter: 'P'
    },
    {
        id: 'rotil',
        term: 'Rotil (Küresel Mafsal)',
        description: 'TekerleÃ„şin hem dönmesini hem de esnemesini saÃ„şlayan, insan vücudundaki omuz/kalça eklemine benzeyen parça.',
        why: 'Rotil koparsa tekerlek yerinden çıkar ve araç yere kapaklanır. Çok tehlikeli bir arızadır.',
        category: 'Mekanik',
        letter: 'R'
    },
    {
        id: 'segman',
        term: 'Segman (Piston YüzüÃ„şü)',
        description: 'Pistonun üzerine takılan, yanma odasındaki basıncın aşaÃ„şı kaçmasını ve karterdeki yaÃ„şın yukarı çıkmasını önleyen halkalar.',
        why: 'Aşınmış segman "motor üflemesi" yapar, araç yaÃ„ş yakar (mavi duman) ve gücü düşer.',
        category: 'Mekanik',
        letter: 'S'
    },
    {
        id: 'supap',
        term: 'Supap (Valf)',
        description: 'Motor silindirlerine hava girişini (emme) ve egzoz çıkışını yöneten, mekanik zamanlamayla açılıp kapanan kapaklar.',
        why: 'Supap ayarı bozuksa motordan "Şık Şık" sesi gelir. Supap yanarsa (LPG kaynaklı) motor rektifiye ister.',
        category: 'Mekanik',
        letter: 'S'
    },
    {
        id: 'yakit_filtresi',
        term: 'Yakıt Filtresi',
        description: 'Depodan gelen yakıtı (benzin/dizel) enjektörlere gitmeden önce süzen hassas filtre. Özellikle dizel araçlarda kritiktir.',
        why: 'Kirli yakıt veya tıkalı filtre enjektörleri bozar. Dizel enjektör tamiri çok maliyetlidir.',
        category: 'Sıvılar',
        letter: 'Y'
    },
    {
        id: 'yatak_sarma',
        term: 'Yatak Sarma',
        description: 'Motorun yaÃ„şsız kalması veya aşırı ısınması sonucu krank mili ile yatakların birbirine kaynaması ve motorun kilitlenmesi.',
        why: 'Motorun "iflas etmesi"dir. Genellikle sandık motor veya komple rektifiye gerektirir.',
        category: 'Mekanik',
        letter: 'Y'
    },
    {
        id: 'elektronik_park_freni',
        term: 'Elektronik Park Freni (EPB)',
        description: 'Klasik el freni kolunun yerini alan, bir düÃ„şme ile arka frenleri kilitleyip serbest bırakan elektrikli sistem.',
        why: 'Yokuş kalkış desteÃ„şi ile entegre çalışır. El frenini indirmeyi unutma derdini bitirir.',
        category: 'Elektronik/OBD',
        letter: 'E'
    },
    {
        id: 'helezon_yay',
        term: 'Helezon Yay',
        description: 'Amortisörün etrafında bulunan, aracın aÃ„şırlıÃ„şını taşıyan ve darbeleri emen spiral metal yay.',
        why: 'Yaylar kesilip araç basılırsa konfor biter, Şasiye zarar verir. Kırık yay lastiÃ„şi patlatabilir.',
        category: 'Mekanik',
        letter: 'H'
    },
    {
        id: 'hiz_sabitleyici',
        term: 'Hız Sabitleyici (Cruise Control)',
        description: 'Uzun yolda gaz pedalına basmadan aracı belirlenen hızda tutan sistem.',
        why: 'Sürücü yorgunluÃ„şunu azaltır ve yakıt tasarrufu saÃ„şlar. Şehir içinde kullanımı önerilmez.',
        category: 'Sürüş',
        letter: 'H'
    },
    {
        id: 'kaliper',
        term: 'Fren Kaliperi',
        description: 'Disk fren sisteminde balataları tutan ve frene basınca diski sıkan hidrolik kıskaç.',
        why: 'Kaliper pimleri sıkışırsa fren takılı kalır, balata yanar ve araç gitmez.',
        category: 'Mekanik',
        letter: 'K' // Kaliper daha yaygın kullanım, K altında olabilir veya F altında
    },
    {
        id: 'kampana',
        term: 'Kampana Fren',
        description: 'Genellikle uygun fiyatlı araçların arka tekerleklerinde kullanılan, içinde balataların dışa doÃ„şru açılarak sürtündüÃ„şü kapalı fren sistemi.',
        why: 'Disk frene göre daha geç soÃ„şur ve performansı bir tık düşüktür. Bakımı daha zordur.',
        category: 'Mekanik',
        letter: 'K'
    },
    {
        id: 'marspiyel',
        term: 'Marşpiyel',
        description: 'Aracın kapılarının altında, ön ve arka çamurluk arasında uzanan metal veya plastik gövde parçası.',
        why: 'Kaldırıma sürtme veya taş vuruklarına en çok maruz kalan yerdir. Ezik marşpiyel aracın değerini düşürür.',
        category: 'Sigorta/Resmi', // Kaporta/Gövde kategorisi olmadıÃ„şı için buraya veya mekaniÃ„şe
        letter: 'M'
    },
    {
        id: 'motor_blogu',
        term: 'Motor BloÃ„şu',
        description: 'Pistonların içinde hareket ettiÃ„şi, motorun ana gövdesini oluşturan dev döküm parça.',
        why: 'Motorun iskeletidir. BloÃ„şun çatlaması motorun "çöp" olması demektir.',
        category: 'Mekanik',
        letter: 'M'
    },
    {
        id: 'sasi',
        term: 'Şasi (Şase)',
        description: 'Aracın motor, kaporta ve yürüyen aksamının monte edildiği ana iskelet yapısı.',
        why: 'Kaza anında yaşam alanını koruyan en önemli yapıdır. "Şasiden hasarlı" araç güvenlik riski taşır.',
        category: 'Sigorta/Resmi',
        letter: 'Ş'
    },
    {
        id: 'silindir_kapagi',
        term: 'Silindir KapaÃ„şı',
        description: 'Motor bloÃ„şunun üzerini kapatan, supapları ve eksantrik milini taşıyan parça. Yanma odasının tavanıdır.',
        why: 'Contası yanarsa veya çatlarsa motor su eksiltir, hararet yapar. Tamiri maliyetlidir.',
        category: 'Mekanik',
        letter: 'S'
    },
    {
        id: 'tork_konvertoru',
        term: 'Tork Konvertörü',
        description: 'Tam otomatik vitesli araçlarda motor ile Şanzıman arasındaki güç aktarımını saÃ„şlayan hidrolik türbin.',
        why: 'Manueldeki debriyajın görevi görür ama balata yoktur, yaÃ„ş ile çalışır. Yokuşta geri kaydırmaz.',
        category: 'Mekanik',
        letter: 'T'
    }
];

// Helper function to get terms by letter
export const getTermsByLetter = (letter: string): DictionaryTerm[] => {
    return dictionaryTerms.filter(term => term.letter === letter);
};

// Get all unique letters
export const getAllLetters = (): string[] => {
    const letters = new Set(dictionaryTerms.map(term => term.letter));
    return Array.from(letters).sort();
};

// Get terms by category
export const getTermsByCategory = (category: DictionaryCategory): DictionaryTerm[] => {
    return dictionaryTerms.filter(term => term.category === category);
};
