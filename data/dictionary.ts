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
    'Mekanik': '#2563eb',
    'Elektrik': '#4f46e5',
    'Lastik/Jant': '#0284c7',
    'Sürüş': '#0891b2',
    'Sıvılar': '#0d9488',
    'Sigorta/Resmi': '#3b82f6',
    'Elektronik/OBD': '#6366f1'
};

// Dictionary Terms (A-Z)
export const dictionaryTerms: DictionaryTerm[] = [
    {
        id: 'abs',
        term: 'ABS (Anti-lock Braking System)',
        description: 'Fren yaparken tekerleklerin kilitlenmesini önleyen elektronik güvenlik sistemi. Fren pedalına basıldığında, sistem saniyede onlarca kez fren gücünü ayarlayarak tekerleklerin dönmeye devam etmesini sağlar.',
        why: 'Kilitlenmiş tekerlekler yönlendirilemez. ABS sayesinde fren yaparken bile direksiyonla manevra yapabilirsiniz. Özellikle ıslak ve buzlu zeminde hayat kurtarıcıdır.',
        category: 'Elektronik/OBD',
        letter: 'A'
    },
    {
        id: 'acc',
        term: 'ACC (Adaptive Cruise Control)',
        description: 'Önündeki aracı radar veya kamera ile tespit ederek otomatik olarak mesafe tutan adaptif hız sabitleyici. Önünüzdeki araç yavaşlarsa sizin aracınız da yavaşlar, hızlanırsa belirlenen hıza kadar hızlanır.',
        why: 'Uzun yolculuklarda sürücü yorgunluğunu azaltır ve güvenli takip mesafesi sağlar. Trafikteki ani fren durumlarına daha hızlı tepki verebilir.',
        category: 'Elektronik/OBD',
        letter: 'A'
    },
    {
        id: 'airbag',
        term: 'Airbag (Hava Yastığı)',
        description: 'Çarpışma anında milisaniyeler içinde şişerek sürücü ve yolcuları korumak için tasarlanmış güvenlik yastıkları. Kaza sensörleri çarpışmayı algıladığında gaz jeneratörü devreye girer ve yastık şişer.',
        why: 'Emniyet kemeri ile birlikte kullanıldığında ölüm riskini %50\'ye kadar azaltır. Baş ve göğüs bölgesine gelen darbeyi yumuşatarak ciddi yaralanmaları önler.',
        category: 'Elektronik/OBD',
        letter: 'A'
    },
    {
        id: 'beygir_gucu',
        term: 'Beygir Gücü (HP / BG)',
        description: 'Motorun ürettiği maksimum gücü ifade eden birim. 1 beygir gücü = 735.5 Watt\'a eşittir. Genellikle motor devrinin yüksek olduğu bir noktada (örn: 5500 RPM) ölçülür.',
        why: 'Aracın ne kadar hızlı maksimum hıza ulaşacağını belirler. Ancak tek başına performans göstergesi değildir; tork ve ağırlık da önemlidir.',
        category: 'Mekanik',
        letter: 'B'
    },
    {
        id: 'catalytic_converter',
        term: 'Katalitik Konvertör',
        description: 'Egzoz gazlarındaki zararlı maddeleri (karbon monoksit, azot oksitler, hidrokarbonlar) kimyasal reaksiyon ile zararsız hale getiren egzoz sistemi parçası. İçinde platin, rodyum ve paladyum gibi değerli metaller bulunur.',
        why: 'Emisyon değerlerini düşürerek çevreyi korur ve aracın muayeneden geçmesi için Şarttır. Bozulduğunda araç güç kaybeder ve yakıt tüketimi artar.',
        category: 'Mekanik',
        letter: 'C'
    },
    {
        id: 'clutch',
        term: 'Debriyaj (Kavrama)',
        description: 'Motor ile Şanzıman arasındaki güç aktarımını kontrol eden mekanik sistem. Pedala basıldığında motor ile vites kutusu birbirinden ayrılır, vites değişimi yapılabilir.',
        why: 'Yumuşak kalkış ve vites değişimi için zorunludur. Aşınmış debriyaj patinaj yapar, güç kaybına ve yakıt israfına neden olur.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'dpf',
        term: 'DPF (Dizel Partikül Filtresi)',
        description: 'Dizel motorlardan çıkan is ve partikül maddeleri filtreleyen sistem. Belli aralıklarla yüksek ısıda kendini temizler (rejenerasyon).',
        why: 'Dizel araçların emisyon standartlarına uymasını sağlar. Tıkalı DPF motor performansını düşürür, yakıt tüketimini artırır ve araca zarar verebilir.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'egr',
        term: 'EGR Valfi (Egzoz Gazı Resirkülasyonu)',
        description: 'Egzoz gazlarının bir kısmını tekrar emişe göndererek yanma sıcaklığını düşüren ve emisyonu azaltan valf.',
        why: 'Azot oksit emisyonunu düşürür. Ancak tıkanması motor performansını olumsuz etkiler ve hata kodlarına neden olur.',
        category: 'Mekanik',
        letter: 'E'
    },
    {
        id: 'esp',
        term: 'ESP (Elektronik Stabilite Programı)',
        description: 'Aracın savrulmasını ve kontrolden çıkmasını önleyen aktif güvenlik sistemi. Sensörler aracın yönünü sürekli izler, eğer sürücü istediği yöne gidemiyorsa sistem tek tek tekerleklere fren uygular.',
        why: 'Özellikle ıslak ve buzlu zeminde, ani manevralarda hayat kurtarır. Kaza riskini %25-30 oranında azaltır.',
        category: 'Elektronik/OBD',
        letter: 'E'
    },
    {
        id: 'horsepower',
        term: 'Hidrolik Direksiyon',
        description: 'Direksiyon çarkını döndürmeyi kolaylaştıran, hidrolik pompa ve silindir kullanarak güç desteği sağlayan sistem.',
        why: 'Park manevralarını kolaylaştırır ve sürücü yorgunluğunu azaltır. Hidrolik sızıntısı direksiyonun ağırlaşmasına neden olur.',
        category: 'Sürüş',
        letter: 'H'
    },
    {
        id: 'km_counter',
        term: 'Kilometre Saatı (Km Sayacı)',
        description: 'Aracın toplam ne kadar yol kat ettiğini gösteren elektronik veya mekanik gösterge. Dijital sayaçlar yazılımla geri çevrilebilir.',
        why: 'Aracın değerini ve bakım geçmişini belirlemede kritiktir. Manipüle edilmiş kilometre ikinci el alıcıları yanıltır.',
        category: 'Sigorta/Resmi',
        letter: 'K'
    },
    {
        id: 'mass_air_flow',
        term: 'MAF Sensörü (Hava Akış Sensörü)',
        description: 'Motora giren hava miktarını ölçen sensör. Bu veriye göre motor beyni yakıt miktarını ayarlar.',
        why: 'Bozuk MAF sensörü hatalı hava-yakıt karışımı yaratır, rölanti düzensizliği ve yüksek yakıt tüketimine neden olur.',
        category: 'Elektronik/OBD',
        letter: 'M'
    },
    {
        id: 'obd',
        term: 'OBD (On-Board Diagnostics)',
        description: 'Aracın elektronik sistemlerini izleyen ve hata kodları kaydeden teşhis sistemi. OBD soketi üzerinden tarayıcı ile okunabilir.',
        why: 'Arızaların erken tespiti için kritiktir. Motor ışığı yandığında OBD taraması sorunu net olarak gösterir.',
        category: 'Elektronik/OBD',
        letter: 'O'
    },
    {
        id: 'piston',
        term: 'Piston',
        description: 'Silindir içinde yukarı aşağı hareket eden, yanma basıncını krank miline ileten motor parçası. Segmanlar ile silindir duvarına sızdırmaz Şekilde oturur.',
        why: 'Motorun kalbini oluşturur. Aşınmış piston veya segmanlar yağ yakmasına, güç kaybına ve sonunda motor arızasına yol açar.',
        category: 'Mekanik',
        letter: 'P'
    },
    {
        id: 'radiator',
        term: 'Radyatör',
        description: 'Motor soğutma sıvısını hava ile temas ettirerek soğutan ısı eşanjörü. İçinden geçen antifriz, motordan aldığı ısıyı havaya verir.',
        why: 'Motor aşırı ısınmasını önler. Tıkalı veya sızdıran radyatör motor hararetine ve silindir kapak contası yanmasına neden olur.',
        category: 'Sıvılar',
        letter: 'R'
    },
    {
        id: 'shock_absorber',
        term: 'Amortisör',
        description: 'Süspansiyon yaylarının titreşimlerini sönümleyen hidrolik veya gazlı parça. Aracın yol tutuşunu ve konforunu sağlar.',
        why: 'Bozuk amortisör fren mesafesini uzatır, lastik ömrünü kısaltır ve viraj stabilitesini bozar. Her 80-100 bin km\'de değiştirilmelidir.',
        category: 'Mekanik',
        letter: 'A'
    },
    {
        id: 'timing_belt',
        term: 'Triger Kayışı (Zamanlama Kayışı)',
        description: 'Krank mili ile eksantrik mili senkronize eden, supapların doğru zamanda açılıp kapanmasını sağlayan kayış. Belli kilometre aralıklarında değiştirilmesi zorunludur.',
        why: 'Kopan triger kayışı supapların pistonlara çarpmasına (motor vurması) ve binlerce liralık hasara neden olur. Değişim aralığını ihmal etmek felaket getirir.',
        category: 'Mekanik',
        letter: 'T'
    },
    {
        id: 'turbo',
        term: 'Turboşarj',
        description: 'Egzoz gazlarının enerjisiyle dönen türbin sayesinde motora daha fazla hava pompalayan süperşarj sistemi. Daha fazla hava = daha fazla yakıt = daha fazla güç.',
        why: 'Küçük motorlardan yüksek performans alınmasını sağlar. Turbo arızası ciddi güç kaybı ve kara duman demektir.',
        category: 'Mekanik',
        letter: 'T'
    },
    {
        id: 'tire_pressure',
        term: 'Lastik Basıncı',
        description: 'Lastiğin içindeki havanın PSI veya Bar cinsinden ölçülen basıncı. Her araç için önerilen basınç değeri kapı iç etiketinde yazar.',
        why: 'Düşük basınç yakıt tüketimini artırır ve lastiği aşındırır. Yüksek basınç konfor kaybı ve patlama riski yaratır. Ayda bir kontrol Şarttır.',
        category: 'Lastik/Jant',
        letter: 'L'
    },
    {
        id: 'traction_control',
        term: 'ASR/TCS (Çekiş Kontrolü)',
        description: 'Hızlanma sırasında tekerleklerin boşta dönmesini (patinaj) önleyen sistem. Motor gücünü ve frenleri kontrol ederek çekişi optimize eder.',
        why: 'Kaygan zeminde (kar, buz, çamur) kalkışı kolaylaştırır. Kapandığında tekerlekler boşa döner ve kontrol kaybı riski artar.',
        category: 'Elektronik/OBD',
        letter: 'A'
    },
    {
        id: 'alternator',
        term: 'Alternatör (Dinamo)',
        description: 'Motor çalışırken elektrik üreten ve aküyü Şarj eden jeneratör. Kayış ile motora bağlıdır.',
        why: 'Arızalı alternatör aküyü boşaltır ve araç durur. Gösterge panelindeki pil ışığı alternatör arızasına işaret eder.',
        category: 'Elektrik',
        letter: 'A'
    },
    {
        id: 'brake_fluid',
        term: 'Fren Hidroliği (Fren Sıvısı)',
        description: 'Fren pedalındaki kuvveti hidrolik basınca çevirerek fren kaliperine ileten özel sıvııvı. Nemli ortamlarda su emer, bu yüzden periyodik değişim gerekir.',
        why: 'Eski fren hidroliği su emdiğinde kaynama noktası düşer, frenler sıcakken tutmayabilir. 2 yılda bir değiştirilmelidir.',
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
        description: 'Tekerleğin aksa sorunsuz dönmesini sağlayan rulman sistemi.',
        why: 'Bozuk porya uğultu sesi yapar, aşırı ısınır ve en kötü senaryoda tekerlek kilitlenebilir. Yüksek hızda tehlikelidir.',
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
        term: 'Antifriz (Soğutma Suyu)',
        description: 'Motorun aşırı ısınmasını önleyen ve kışın donmayı engelleyen özel sıvıoğutma sıvısı. İçindeëÂ¶â‚¬ëÂ�™Ã¬•Â¡ ve korozyon önleyici katkılar bulunur.',
        why: 'Suyun donması motor bloğunu çatlatabilir. Antifriz aynı zamanda pas ve korozyonu da önler.',
        category: 'Sıvılar',
        letter: 'A'
    },
    {
        id: 'serpentine_belt',
        term: 'V-Kayışı (Kanallı Kayış)',
        description: 'Alternatör, klima kompresörü, hidrolik pompası gibi yan aksamları döndüren kayış.',
        why: 'Kopan kayış tüm bu sistemleri durdurur. Araç hareket edebilir ama Şarj olmaz, klima çalışmaz, direksiyon ağırlaşır.',
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
        term: 'Lastik Diş Derinliği',
        description: 'Lastiğin yol tutuş yüzeyindeki olukların derinliği. Yasal minimum 1.6mm olsa da güvenlik için 3-4mm altına düşmemelidir.',
        why: 'Aşınmış lastik yağmurlu havada suda kızaklama (aquaplaning) riskini artırır. Fren mesafesi uzar.',
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
        why: 'İkinci el alımında en büyük risk faktörüdür. Aracın güvenlik Şasi bütünlüğü bozulmuş olabilir, değeri düşüktür.',
        category: 'Sigorta/Resmi',
        letter: 'A'
    },
    {
        id: 'chip_tuning',
        term: 'Chip Tuning (Yazılım)',
        description: 'Motor kontrol ünitesinin (ECU) yazılımını değiştirerek daha fazla güç veya yakıt tasarrufu elde etme işlemi. "Stage 1", "Stage 2" gibi seviyeleri vardır.',
        why: 'Düşük maliyetle yüksek performans artışı sağlar ancak motor ömrünü kısaltabilir ve garanti dışı bırakabilir.',
        category: 'Elektronik/OBD',
        letter: 'C'
    },
    {
        id: 'coilover',
        term: 'Coilover',
        description: 'Yüksekliği ve sertliği ayarlanabilen spor süspansiyon sistemi. Yay ve amortisör tek bir ünite halindedir.',
        why: 'Yol tutuşu artırır ve aracı alçaltarak sportif görünüm sağlar. Konforu azaltabilir.',
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
        description: 'İkinci el araç alım satımında, bağımsız uzmanlar tarafından aracın kaza, boya, motor ve mekanik durumunun detaylı incelenmesi.',
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
        description: 'Araç durduğunda (ışıklarda, trafikte) motoru otomatik kapatıp, debriyaja veya gaza basıldığında tekrar çalıştıran sistem.',
        why: 'Rölantideki gereksiz yakıt tüketimini ve emisyonu önler. Şehir içi trafikte %15\'e varan tasarruf sağlar.',
        category: 'Elektronik/OBD',
        letter: 'S'
    },
    {
        id: 'tramer',
        term: 'Tramer (Hasar Kaydı)',
        description: 'Trafik Sigortaları Bilgi Merkezi\'nin kısaltması. Aracın geçmişteki sigorta hasar kayıtlarının (tutar, tarih, neden) sorgulandığı sistem.',
        why: '5664\'e SMS atarak aracın "sicili" öğrenilebilir. Temiz bir geçmiş, aracın değerini korur.',
        category: 'Sigorta/Resmi',
        letter: 'T'
    },
    {
        id: 'conta_yakmak',
        term: 'Conta Yakmak (Silindir Kapak Contası)',
        description: 'Motorun aşırı ısınması sonucu (hararet), motor bloğu ile silindir kapağı arasındaki sızdırmazlık contasının erimesi veya deforme olması.',
        why: 'Motor yağı ve suyu birbirine karışır. Ciddi motor hasarına yol açar, motorun yenilenmesi gerekebilir.',
        category: 'Mekanik',
        letter: 'C'
    },
    {
        id: 'cvt',
        term: 'CVT Şanzıman (Sürekli Değişken)',
        description: 'Dişli çarklar yerine kasnak ve kayış sistemi kullanan, sonsuz vites oranına sahip otomatik Şanzıman türü. Vites geçişi hissedilmez.',
        why: 'Motoru sürekli en verimli devirde tutarak yakıt tasarrufu sağlar ve pürüzsüz bir sürüş sunar. Japon araçlarında yaygındır.',
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
        term: 'Intercooler (Ara Soğutucu)',
        description: 'Turbo beslemeli araçlarda, turbonun sıkıştırdığı ve ısınan havayı soğutarak motora gönderen radyatör benzeri parça.',
        why: 'Soğuk hava daha yoğundur ve daha fazla oksijen içerir. Bu sayede motor performansı artar ve yanma verimliliği yükselir.',
        category: 'Mekanik',
        letter: 'I'
    },
    {
        id: 'isofix',
        term: 'Isofix',
        description: 'Çocuk güvenlik koltuklarının doğrudan aracın Şasisine monte edilmesini sağlayan uluslararası standart bağlantı noktaları.',
        why: 'Emniyet kemeri ile bağlamaya göre çok daha güvenli ve pratik bir montaj sağlar. Kaza anında koltuğun savrulmasını önler.',
        category: 'Sigorta/Resmi',
        letter: 'I'
    },
    {
        id: 'lpg',
        term: 'LPG (Otogaz)',
        description: 'Sıvılaştırılmış Petrol Gazı. Benzinli araçlara sonradan takılabilen veya fabrika çıkışlı olabilen ekonomik alternatif yakıt sistemi.',
        why: 'Benzine göre %40-50 yakıt tasarrufu sağlar. Ancak motoru daha sıcak çalıştırabilir ve bagaj hacminden çalabilir.',
        category: 'Sıvılar',
        letter: 'L'
    },
    {
        id: 'podye',
        term: 'Podye (Şase Ucu)',
        description: 'Aracın ön tekerleklerinin bağlandığı, motoru taşıyan ve kaza anında darbeyi emen Şasinin en önemli güçlendirilmiş uç kısmı.',
        why: 'Ekspertizde "Podye işlemli" denmesi, aracın daha önce çok ağır bir önden kaza geçirdiğini ve güvenlik yapısının bozulduğunu gösterir.',
        category: 'Mekanik',
        letter: 'P'
    },
    {
        id: 'ppf',
        term: 'PPF Kaplama (Boya Koruma Filmi)',
        description: 'Aracın boyasını taş vurukları, çizikler ve kuş pisliği gibi dış etkenlerden koruyan Şeffaf poliüretan film tabakası.',
        why: 'Aracın boyasını ilk günkü gibi korur. Kaliteli PPF kendini ısı ile onarabilir. İkinci el değerini korumak için yapılır.',
        category: 'Lastik/Jant', // Kategori tam uymasa da dış koruma
        letter: 'P'
    },
    {
        id: 'rot_balans',
        term: 'Rot-Balans Ayarı',
        description: 'Tekerleklerin yere basma açılarının (Rot) ve ağırlık dağılımının (Balans) ayarlanması işlemi.',
        why: 'Bozuk ayar lastikleri düzensiz aşındırır, direksiyon titrer ve araç sağa-sola çeker. Güvenli sürüş için periyodik yapılmalıdır.',
        category: 'Lastik/Jant',
        letter: 'R'
    },
    {
        id: 'tork',
        term: 'Tork (Çekiş Gücü)',
        description: 'Motorun krank milini döndürme kuvveti. Özellikle kalkışlarda, yokuş çıkarken ve yük taşırken hissedilen "koltuğa yapıştırma" gücüdür.',
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
        why: 'Sürücünün gözünü yoldan ayırmadan bilgi almasını sağlar. Savaş uçaklarından otomobillere geçmiş bir güvenlik teknolojisidir.',
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
        term: 'Karter (Yağ Haznesi)',
        description: 'Motorun en alt kısmında bulunan, motor yağının toplandığı ve soğuduğu metal kapak/hazne.',
        why: 'Aracın altını vurursanız karter delinip yağ boşalabilir. Yağsız kalan motor saniyeler içinde kilitlenir (yatak sarar).',
        category: 'Mekanik',
        letter: 'K'
    },
    {
        id: 'kor_nokta',
        term: 'Kör Nokta Uyarı Sistemi',
        description: 'Yan aynaların görüş açısına girmeyen (kör nokta) araçları radarla tespit edip aynada ışıkla sürücüyü uyaran güvenlik asistanı.',
        why: 'Şerit değiştirirken yaşanabilecek kazaları önler. Omuz üstü bakışa gerek kalmadan güvenli manevra sağlar.',
        category: 'Sürüş',
        letter: 'K'
    },
    {
        id: 'mars_motoru',
        term: 'Marş Motoru',
        description: 'Kontak anahtarı çevrildiğinde motora ilk hareketi veren güçlü elektrik motoru. Aküden aldığı enerjiyle volan dişlisini döndürür.',
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
        why: 'Boyayı güneş yanığından, kuş pisliğinden ve ince çiziklerden korur. Araca derin bir parlaklık verir ve su tutmaz (hidrofobik).',
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
        description: 'Motor sıcaklığını ideal seviyede (genellikle 90Ã‚°C) tutmak için soğutma suyu akışını açıp kapatan valf.',
        why: 'Termostat açık kalırsa motor ısınmaz (yakıt artar), kapalı kalırsa motor aşırı ısınır (hararet yapar, conta yakar).',
        category: 'Mekanik',
        letter: 'T'
    },
    {
        id: 'baski_balata',
        term: 'Baskı Balata (Debriyaj Seti)',
        description: 'Manuel vitesli araçlarda motor ile vites kutusu arasındaki bağlantıyı kesip sağlayan sürtünme sistemi. "Debriyaj bitmesi" aslında balatanın incelmesidir.',
        why: 'Biten balata kaçırır, araç bağırır ama gitmez. Yokuşta kalkış zorlaşır. Değişimi işçilikli ve maliyetlidir.',
        category: 'Mekanik',
        letter: 'B'
    },
    {
        id: 'devirdaim',
        term: 'Devirdaim Pompası (Su Pompası)',
        description: 'Motorun soğutma suyunu radyatör ve motor bloğu arasında sürekli döndüren pompa. Genellikle triger kayışından güç alır.',
        why: 'Arızalanırsa motor suyu dönmez ve dakikalar içinde hararet yapar. Triger seti değişirken mutlaka yenilenmelidir.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'diferansiyel',
        term: 'Diferansiyel',
        description: 'Motor gücünü tekerleklere ileten ve virajlarda iki tekerleğin farklı hızlarda dönmesini sağlayan dişli kutusu.',
        why: 'Diferansiyel olmasa araç viraj dönemez, lastikler sürüklenirdi. İç tekerlek yavaş, dış tekerlek hızlı dönmelidir.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'eksantrik',
        term: 'Eksantrik Mili (Kam Mili)',
        description: 'Motor supaplarının ne zaman açılıp kapanacağını ayarlayan mil. Krank miline bağlı olarak döner.',
        why: 'Supap zamanlaması motorun nefes alıp vermesidir. Eksantrik sensörü arızası motorun çalışmasını engeller.',
        category: 'Mekanik',
        letter: 'E'
    },
    {
        id: 'krank',
        term: 'Krank Mili',
        description: 'Pistonların aşağı-yukarı hareketini dairesel dönme hareketine çeviren, motorun omurgası sayılan dev metal mil.',
        why: 'Motorun ürettiği tüm güç bu mil üzerinden Şanzımana aktarılır. Kırılması motorun tamamen iflas etmesi demektir.',
        category: 'Mekanik',
        letter: 'K'
    },
    {
        id: 'manifold',
        term: 'Manifold (Emme/Egzoz)',
        description: 'Motorun nefes borularıdır. Emme manifoldu temiz havayı silindirlere dağıtır, egzoz manifoldu yanmış gazı atar.',
        why: 'Manifold çatlağı hava kaçağına, güç kaybına ve içeri egzoz kokusu girmesine neden olur.',
        category: 'Mekanik',
        letter: 'M'
    },
    {
        id: 'salincak',
        term: 'Salıncak (Tabla)',
        description: 'Tekerleği Şasiye bağlayan, aşağı yukarı esnemesini sağlayan metal kol. Ucunda hareketli rotil bulunur.',
        why: 'Çukura sert girince eğilebilir. Eğik salıncak tekerleğin duruşunu bozar, araç yolda gezer ve lastik yer.',
        category: 'Mekanik',
        letter: 'S'
    },
    {
        id: 'saft',
        term: 'Şaft (Kardan Mili)',
        description: 'Arkadan itişli veya 4 çeker araçlarda, öndeki Şanzımandan aldığı gücü arkadaki diferansiyele ileten uzun demir mil.',
        why: 'Dengesiz Şaft titreşim yapar, "uğultu" sesi çıkarır. Mafsalları bozulursa yolda bırakabilir.',
        category: 'Mekanik',
        letter: 'Ş' // "Ş" harfi olarak ekledik, sıralamada S'den sonra gelmeli
    },
    {
        id: 'volan',
        term: 'Volan (Oynar Göbek)',
        description: 'Krank miline bağlı, motorun titreşimini alan ve ilk hareketi marş motorundan kapan büyük dişli disk.',
        why: 'Bozuk volan stop ederken "lak luk" sesi yapar ve titreme yaratır. Değişimi pahalıdır.',
        category: 'Mekanik',
        letter: 'V'
    },
    {
        id: 'z_rot',
        term: 'Z-Rot (Askı Rotu)',
        description: 'Amortisör ile viraj demirini birbirine bağlayan, süspansiyonun en zayıf halkası sayılan parça.',
        why: 'Bozuk yolda "lok lok" sesi geliyorsa %90 Z-Rot bozulmuştur. Ucuz ve değişimi kolaydır.',
        category: 'Mekanik',
        letter: 'Z'
    },
    {
        id: 'aku',
        term: 'Akü (Batarya)',
        description: 'Aracın elektrik enerjisini depolayan, motor çalışmazken aydınlatma ve müzik sistemini besleyen, en önemlisi marş motorunu çalıştıran parça.',
        why: 'Biten akü ile araç çalışmaz (vurdurmak yeni araçlarda zararlıdır). Soğuk havalarda performansı düşer.',
        category: 'Elektrik',
        letter: 'A'
    },
    {
        id: 'bobin',
        term: 'Ateşleme Bobini',
        description: 'Aküden gelen 12 volt elektriği binlerce volta yükselterek bujilere gönderen ve kıvılcım oluşmasını sağlayan trafo.',
        why: 'Bobin arızasında silindirlerden biri çalışmaz (tekler), araç titrer ve çekişten düşer.',
        category: 'Elektrik',
        letter: 'A' // "Ateşleme" ile başladığı için A
    },
    {
        id: 'fren_diski',
        term: 'Fren Diski (Ayna)',
        description: 'Tekerlekle birlikte dönen, frene basınca balatanın üzerine baskı yaparak aracı durdurduğu metal plaka.',
        why: 'İncelen disk kırılabilir veya eğilerek titreme yapar. Balata ile birlikte periyodik kontrol edilmelidir.',
        category: 'Mekanik',
        letter: 'F'
    },
    {
        id: 'hava_filtresi',
        term: 'Hava Filtresi',
        description: 'Motorun emdiği havayı toz ve pislikten arındıran süzgeç. Motorun ciğeridir.',
        why: 'Tıkalı filtre ile motor nefes alamaz, çekiş düşer ve yakıt tüketimi artar.',
        category: 'Mekanik',
        letter: 'H'
    },
    {
        id: 'polen_filtresi',
        term: 'Polen Filtresi (Kabin)',
        description: 'Dışarıdan araç içine giren havayı süzen filtre. Klima sisteminin bir parçasıdır.',
        why: 'Değişmezse camlar çabuk buğulanır, içeride kötü koku oluşur ve alerjik reaksiyonlara neden olabilir.',
        category: 'Sıvılar', // Aslında filtre ama sarf malzeme mantığında
        letter: 'P'
    },
    {
        id: 'rotil',
        term: 'Rotil (Küresel Mafsal)',
        description: 'Tekerleğin hem dönmesini hem de esnemesini sağlayan, insan vücudundaki omuz/kalça eklemine benzeyen parça.',
        why: 'Rotil koparsa tekerlek yerinden çıkar ve araç yere kapaklanır. Çok tehlikeli bir arızadır.',
        category: 'Mekanik',
        letter: 'R'
    },
    {
        id: 'segman',
        term: 'Segman (Piston Yüzüğü)',
        description: 'Pistonun üzerine takılan, yanma odasındaki basıncın aşağı kaçmasını ve karterdeki yağın yukarı çıkmasını önleyen halkalar.',
        why: 'Aşınmış segman "motor üflemesi" yapar, araç yağ yakar (mavi duman) ve gücü düşer.',
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
        description: 'Motorun yağsız kalması veya aşırı ısınması sonucu krank mili ile yatakların birbirine kaynaması ve motorun kilitlenmesi.',
        why: 'Motorun "iflas etmesi"dir. Genellikle sandık motor veya komple rektifiye gerektirir.',
        category: 'Mekanik',
        letter: 'Y'
    },
    {
        id: 'elektronik_park_freni',
        term: 'Elektronik Park Freni (EPB)',
        description: 'Klasik el freni kolunun yerini alan, bir düğme ile arka frenleri kilitleyip serbest bırakan elektrikli sistem.',
        why: 'Yokuş kalkış desteği ile entegre çalışır. El frenini indirmeyi unutma derdini bitirir.',
        category: 'Elektronik/OBD',
        letter: 'E'
    },
    {
        id: 'helezon_yay',
        term: 'Helezon Yay',
        description: 'Amortisörün etrafında bulunan, aracın ağırlığını taşıyan ve darbeleri emen spiral metal yay.',
        why: 'Yaylar kesilip araç basılırsa konfor biter, Şasiye zarar verir. Kırık yay lastiği patlatabilir.',
        category: 'Mekanik',
        letter: 'H'
    },
    {
        id: 'hiz_sabitleyici',
        term: 'Hız Sabitleyici (Cruise Control)',
        description: 'Uzun yolda gaz pedalına basmadan aracı belirlenen hızda tutan sistem.',
        why: 'Sürücü yorgunluğunu azaltır ve yakıt tasarrufu sağlar. Şehir içinde kullanımı önerilmez.',
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
        description: 'Genellikle uygun fiyatlı araçların arka tekerleklerinde kullanılan, içinde balataların dışa doğru açılarak sürtündüğü kapalı fren sistemi.',
        why: 'Disk frene göre daha geç soğur ve performansı bir tık düşüktür. Bakımı daha zordur.',
        category: 'Mekanik',
        letter: 'K'
    },
    {
        id: 'marspiyel',
        term: 'Marşpiyel',
        description: 'Aracın kapılarının altında, ön ve arka çamurluk arasında uzanan metal veya plastik gövde parçası.',
        why: 'Kaldırıma sürtme veya taş vuruklarına en çok maruz kalan yerdir. Ezik marşpiyel aracın değerini düşürür.',
        category: 'Sigorta/Resmi', // Kaporta/Gövde kategorisi olmadığı için buraya veya mekaniğe
        letter: 'M'
    },
    {
        id: 'motor_blogu',
        term: 'Motor Bloğu',
        description: 'Pistonların içinde hareket ettiği, motorun ana gövdesini oluşturan dev döküm parça.',
        why: 'Motorun iskeletidir. Bloğun çatlaması motorun "çöp" olması demektir.',
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
        term: 'Silindir Kapağı',
        description: 'Motor bloğunun üzerini kapatan, supapları ve eksantrik milini taşıyan parça. Yanma odasının tavanıdır.',
        why: 'Contası yanarsa veya çatlarsa motor su eksiltir, hararet yapar. Tamiri maliyetlidir.',
        category: 'Mekanik',
        letter: 'S'
    },
    {
        id: 'tork_konvertoru',
        term: 'Tork Konvertörü',
        description: 'Tam otomatik vitesli araçlarda motor ile Şanzıman arasındaki güç aktarımını sağlayan hidrolik türbin.',
        why: 'Manueldeki debriyajın görevi görür ama balata yoktur, yağ ile çalışır. Yokuşta geri kaydırmaz.',
        category: 'Mekanik',
        letter: 'T'
    },
    {
        id: 'karburator',
        term: 'Karbüratör',
        description: 'Eski nesil benzinli motorlarda yakıt ile havayı karıştırarak yanma odasına gönderen mekanik cihaz. Günümüzde yerini elektronik enjeksiyon sistemlerine bırakmıştır.',
        why: 'Yakıt-hava karışım oranını ayarlayarak motorun düzenli çalışmasını sağlar. Ayarı bozuksa araç fazla yakar veya rölantide stop eder.',
        category: 'Mekanik',
        letter: 'K'
    },
    {
        id: 'sanziman',
        term: 'Şanzıman (Vites Kutusu)',
        description: 'Motordan gelen gücü tekerleklere farklı tork ve hız oranlarında ileten dişli sistemi. Manuel, tam otomatik, yarı otomatik veya CVT çeşitleri vardır.',
        why: 'Motor devrini her hızda en verimli noktada tutmayı sağlar. Şanzıman arızaları aracın hareket etmesini engeller veya vites geçişlerini bozar.',
        category: 'Mekanik',
        letter: 'Ş'
    },
    {
        id: 'motor_kulagi',
        term: 'Motor Kulağı (Takozu)',
        description: 'Motoru Şasiye bağlayan ve motorun çalışmasından kaynaklanan titreşimleri emen kauçuk/metal sönümleyici parça.',
        why: 'Kopuk veya yırtık motor kulağı, gaza veya frene basıldığında motorun sarsılmasına, "küt" sesine ve kabin içinde aşırı titreşime neden olur.',
        category: 'Mekanik',
        letter: 'M'
    },
    {
        id: 'direksiyon_kutusu',
        term: 'Direksiyon Kutusu',
        description: 'Direksiyon simidinden gelen dairesel dönme hareketini doğrusal harekete çevirerek tekerlekleri sağa ve sola yönlendiren ana mekanizma.',
        why: 'Boşluk yaparsa direksiyonda hassasiyet kaybı, yolda gezinme ve kasislerde "tıkırtı" başlar. Güvenli sürüş ve yol tutuş için kritik bir bileşendir.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'rot_basi',
        term: 'Rot Başı',
        description: 'Direksiyon kutusundan çıkan kolları tekerlek poryasına bağlayan hareketli küresel mafsal.',
        why: 'Boşluk veya arıza durumunda direksiyon hakimiyeti zayıflar, lastiklerde içten/dıştan düzensiz aşınma ve yolda gezinme hissi yaşanır.',
        category: 'Mekanik',
        letter: 'R'
    },
    {
        id: 'sigorta_kutusu',
        term: 'Sigorta Kutusu',
        description: 'Aracın elektriksel donanımlarını aşırı akım veya kısa devre tehlikesine karşı koruyan eriyen telli sigortaların bulunduğu elektrik panosu.',
        why: 'Farlar, radyo, silecek veya kornanın aniden çalışmaması durumunda ilk kontrol edilmesi gereken yerdir. Patlak bir sigorta tesisatın yanmasını önlemiştir.',
        category: 'Elektrik',
        letter: 'S'
    },
    {
        id: 'fren_merkezi',
        term: 'Ana Fren Merkezi',
        description: 'Fren pedalına basıldığında ayak kuvvetini hidrolik basınca çevirerek borular üzerinden tüm tekerleklere fren sıvısını pompalayan silindirik merkez.',
        why: 'Contaları arızalanırsa veya hidrolik kaçırırsa fren pedalı yumuşar, tabana kadar iner ve aracın durma mesafesi tehlikeli derecede uzar.',
        category: 'Mekanik',
        letter: 'F'
    },
    {
        id: 'eksantrik_mili_sensoru',
        term: 'Eksantrik Mili Sensörü',
        description: 'Eksantrik milinin o anki açısal pozisyonunu motor kontrol ünitesine (ECU) saniyesinde bildiren elektronik parça.',
        why: 'Arızasında beyin enjektörlerin zamanlamasını yapamaz; motor zor çalışır, performans düşer, yakıt artar ve motor arıza lambası yanar.',
        category: 'Elektronik/OBD',
        letter: 'E'
    },
    {
        id: 'aks_mili',
        term: 'Aks Mili',
        description: 'Diferansiyelden veya Şanzımandan aldığı dönme kuvvetini doğrudan çekiş sağlayan tekerleklere aktaran güçlü çelik miller.',
        why: 'Eğilmesi veya balansının bozulması durumunda hızlandıkça artan şiddetli titreşimlere neden olur. Kırılırsa araç güç üretebilir ama hareket edemez.',
        category: 'Mekanik',
        letter: 'A'
    },
    {
        id: 'rolanti_motoru',
        term: 'Rölanti Motoru',
        description: 'Sürücü gaza basmadığında (araç boşta veya dururken) motorun stop etmemesi için gerekli minimum hava akışını sağlayan elektronik valf.',
        why: 'Kirlendiğinde veya bozulduğunda motor rölantideyken titrer, devir saati sürekli dalgalanır veya debriyaja basıldığında motor stop eder.',
        category: 'Elektronik/OBD',
        letter: 'R'
    },
    {
        id: 'kamber',
        term: 'Kamber Ayarı (Camber)',
        description: 'Tekerleğin yere dikey eksende yaptığı içe veya dışa doğru eğim açısıdır. Spor araçlarda negatif kamber kullanılarak viraj performansı artırılır.',
        why: 'Hatalı kamber ayarı, lastiklerin sadece iç veya dış kısımlarının hızlıca erimesine ve aracın düz yolda gezinmesine neden olur.',
        category: 'Lastik/Jant',
        letter: 'K'
    },
    {
        id: 'kaster',
        term: 'Kaster Ayarı (Caster)',
        description: 'Tekerleğin direksiyon ekseninin öne veya arkaya doğru olan eğimidir. Aracın düz gidiş kararlılığını ve direksiyonun dönüşten sonra kendini toplamada hızını belirler.',
        why: 'Doğru kaster ayarı, yüksek hızlarda aracın stabil kalmasını sağlar ve direksiyonun ağırlığını dengeler.',
        category: 'Lastik/Jant',
        letter: 'K'
    },
    {
        id: 'pcv_valfi',
        term: 'PCV Valfi (Karter Havalandırma)',
        description: 'Motor karterinde biriken yanıcı gazların basıncını düşürmek için bu gazları tekrar emme manifolduna yönlendirerek yakılmasını sağlayan tek yönlü valftir.',
        why: 'Tıkanması durumunda karterdeki basınç artar, motor contalarından yağ kaçakları başlar ve motor rölantisi düzensizleşir.',
        category: 'Mekanik',
        letter: 'P'
    },
    {
        id: 'bogaz_kelebegi',
        term: 'Boğaz Kelebeği (Gaz Kelebeği)',
        description: 'Sürücünün gaz pedalına basma şiddetine göre motorun emme manifolduna giren hava miktarını ayarlayan mekanik veya elektronik kapakçıktır.',
        why: 'Kirlendiğinde veya kurum bağladığında motor rölantisi dalgalanır, geç çalışma veya gaz yememe gibi sorunlara neden olur.',
        category: 'Mekanik',
        letter: 'B'
    },
    {
        id: 'map_sensoru',
        term: 'MAP Sensörü (Manifold Basınç)',
        description: 'Emme manifoldunun içindeki basıncı ölçerek motor beynine ileten ve ne kadar yakıt püskürtüleceğinin hesaplanmasını sağlayan kritik sensördür.',
        why: 'Arızalanması durumunda hatalı yakıt karışımı oluşur; siyah duman atma, aşırı yakıt tüketimi ve tekleme sorunları görülür.',
        category: 'Elektronik/OBD',
        letter: 'M'
    },
    {
        id: 'eksantrik_sensoru',
        term: 'Eksantrik Konum Sensörü',
        description: 'Eksantrik milinin o anki açısını ve konumunu ölçerek pistonların nerede olduğunu motor beynine bildirir. Yakıt enjeksiyonu ve ateşleme zamanlaması buna göre yapılır.',
        why: 'Bu sensör bozulursa motor hangi pistona ne zaman yakıt vereceğini bilemez, araç geç çalışır veya hiç çalışmayabilir.',
        category: 'Elektronik/OBD',
        letter: 'E'
    },
    {
        id: 'krank_sensoru',
        term: 'Krank Devir Sensörü',
        description: 'Krank milinin dönüş hızını ve pozisyonunu anlık olarak okuyan sensördür. Motor devrini (RPM) doğrudan bu sensör hesaplar.',
        why: 'Krank sensörü sinyal keserse, motor anında stop eder. Yolda giderken aniden motorun durmasına sebep olan en yaygın elektronik arızadır.',
        category: 'Elektronik/OBD',
        letter: 'K'
    },
    {
        id: 'debriyaj_bilyasi',
        term: 'Debriyaj Bilyası (Baskı Rulmanı)',
        description: 'Sürücü debriyaj pedalına bastığında baskı yaylarına baskı uygulayarak motor ile şanzımanın ayrılmasını sağlayan hareketli rulmandır.',
        why: 'Aşındığında, debriyaja basınca veya debriyajdan ayak çekildiğinde uğultu veya "vınlama" sesi yapar. Dağılırsa viteslere geçiş imkansızlaşır.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'samandira',
        term: 'Yakıt Şamandırası',
        description: 'Yakıt deposunun içindeki yakıt seviyesini mekanik bir kol ve elektronik direnç sistemiyle ölçerek gösterge paneline ileten parçadır.',
        why: 'Arızalanması durumunda yakıt göstergesi yanlış bilgi verir, depoda benzin var görünürken araç yolda kalabilir veya sürekli boş uyarısı verebilir.',
        category: 'Elektrik',
        letter: 'Ş'
    },
    {
        id: 'subap_itici',
        term: 'Subap Fincanı (Lifter/İtici)',
        description: 'Eksantrik milinin hareketini subaplara ileten ve yağ basıncı ile otomatik boşluk ayarı yapan minik hidrolik veya mekanik parçalardır.',
        why: 'Yağsızlık veya aşınma durumunda ilk çalıştırmada veya sürekli olarak motordan belirgin bir "şık şık şık" dikiş makinesi sesi gelmesine neden olur.',
        category: 'Mekanik',
        letter: 'S'
    },
    {
        id: 'on_duzen',
        term: 'Ön Düzen (Yürüyen Aksam)',
        description: 'Aracın direksiyon hakimiyetini, süspansiyonunu ve tekerlek bağlantılarını içeren; rot, rotil, salıncak ve amortisörlerin tamamına verilen genel addır.',
        why: 'Ön düzendeki herhangi bir parçanın bozulması, sürüş güvenliğini tehlikeye atar, lastiklerin dengesiz aşınmasına ve kasislerde vuruntu seslerine yol açar.',
        category: 'Mekanik',
        letter: 'Ö'
    },
    {
        id: 'camurluk',
        term: 'Çamurluk',
        description: 'Aracın tekerleklerinin üzerini kapatan, yoldan sıçrayan su, çamur ve taşların etrafa veya aracın gövdesine gelmesini engelleyen kaporta parçasıdır.',
        why: 'Küçük kazalarda en çok hasar gören parçalardandır. Plastik olanları boyansa da ekspertizde değer kaybı yaratmazken, sac olanların değişimi değer düşürür.',
        category: 'Sigorta/Resmi',
        letter: 'Ç'
    },
    {
        id: 'a_sutunu',
        term: 'A Sütunu (Direk)',
        description: 'Aracın tavanını taşıyan, ön camın sağında ve solunda yer alan, aynı zamanda ön kapıların menteşelerinin bağlandığı güvenlik için kritik dikey taşıyıcılardır.',
        why: 'Olası bir devrilme anında tavanın çökmesini engeller. İkinci el alımında A sütununda işlem/boya olması aracın çok büyük bir taklalı kaza geçirdiğinin işaretidir.',
        category: 'Sigorta/Resmi',
        letter: 'A'
    },
    {
        id: 'vantilator_kayisi',
        term: 'Vantilatör Kayışı',
        description: 'Krank milinden aldığı dönüş gücü ile su pompası, alternatör ve eski araçlarda soğutma fanını çeviren dış kayış sistemidir.',
        why: 'Eskiyip çatladığında özellikle soğuk havalarda rahatsız edici bir "cıyaklama" sesi çıkarır. Kopması durumunda hararet hızla yükselir.',
        category: 'Mekanik',
        letter: 'V'
    },
    {
        id: 'vtec_vanos',
        term: 'VTEC / VANOS / VVT-i',
        description: 'Motor devrine ve yük durumuna göre subapların açılma süresini ve zamanlamasını değiştiren değişken subap zamanlama sistemlerinin markalara göre adlarıdır.',
        why: 'Alt devirlerde yakıt ekonomisi sağlarken, üst devirlerde subapları daha uzun açık tutarak motora ekstra bir güç patlaması (performans) yaşatır.',
        category: 'Mekanik',
        letter: 'V'
    },
    {
        id: 'aerodinamik',
        term: 'Aerodinamik Sürtünme (Cd)',
        description: 'Aracın havayı yararak ne kadar kolay ilerleyebildiğini gösteren değerdir. Düşük değer hava direncinin az olduğunu gösterir.',
        why: 'Düşük hava sürtünmesi yüksek hızlarda hem rüzgar sesini azaltır hem de yakıt tüketimini ciddi oranda düşürür. Elektrikli araçlarda menzili en çok etkileyen faktördür.',
        category: 'Sürüş',
        letter: 'A'
    },
    {
        id: 'macpherson',
        term: 'MacPherson Süspansiyon',
        description: 'Günümüz otomobillerinin çoğunda ön tekerleklerde kullanılan, helezon yay ile amortisörün iç içe tek bir yapı olarak tasarlandığı bağımsız süspansiyon türüdür.',
        why: 'Hem kompakt yapısıyla az yer kaplar hem de maliyeti düşüktür. Sürüş dinamiklerini ve konforu başarılı bir şekilde dengeler.',
        category: 'Mekanik',
        letter: 'M'
    },
    {
        id: 'aeb',
        term: 'AEB (Acil Fren Sistemi)',
        description: 'Öndeki araç, yaya veya engeli radar/kamera ile tespit edip sürücü tepki vermezse çarpışmayı önlemek için araca otomatik fren yaptıran sistemdir.',
        why: 'Şehir içi dikkatsizlik kazalarını %50\'ye varan oranda engeller. Yeni nesil araçların güvenlik testinden 5 yıldız alması için zorunludur.',
        category: 'Elektronik/OBD',
        letter: 'A'
    },
    {
        id: 'karter_muhafazasi',
        term: 'Karter Muhafazası',
        description: 'Aracın alt kısmında, motor karterini ve şanzımanı yoldan sıçrayan taşlardan, çukurlardan ve tümsek darbelerinden koruyan metal veya plastik zırhtır.',
        why: 'Araç altını vurduğunuzda karterin delinip yağın boşalmasını (bunun sonucunda motorun yatak sarmasını) engelleyen ilk savunma hattıdır.',
        category: 'Mekanik',
        letter: 'K'
    },
    {
        id: 'cekis_sistemi',
        term: 'Çekiş Sistemi (FWD / RWD)',
        description: 'Motorun gücünü yola aktaran tekerleklerin konumudur. FWD önden çekişli, RWD ise arkadan itişli araçları temsil eder.',
        why: 'Önden çekerler kışın karda daha rahat ilerler ve iç hacimleri geniştir. Arkadan itişli araçlar ise sportif kalkış ve drift kabiliyeti sunar.',
        category: 'Mekanik',
        letter: 'Ç'
    },
    {
        id: 'dpf_sensoru',
        term: 'DPF Fark Basınç Sensörü',
        description: 'Dizel partikül filtresinin (DPF) girişindeki ve çıkışındaki egzoz gazı basıncını ölçerek filtrenin ne kadar tıkalı olduğunu motor beynine ileten sensördür.',
        why: 'Bu sensör bozulursa, sistem DPF\'nin tıkandığını zannederek aracı koruma moduna alır, motor gücünü keser ve göstergede motor arıza ışığı yanar.',
        category: 'Elektronik/OBD',
        letter: 'D'
    },
    {
        id: 'downpipe',
        term: 'Downpipe (Katalizör İptali)',
        description: 'Turbo beslemeli araçlarda egzoz gazının turbodan çıktıktan sonra geçtiği ilk borudur. Modifiye dünyasında, performans artışı için katalizör iptal edilerek düz boru (downpipe) takılır.',
        why: 'Egzoz gazının daha rahat çıkmasını sağlayarak turbonun daha çabuk dolmasına (spool) ve motorun rahatlamasına olanak tanır. Ancak emisyon kurallarına aykırıdır.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'blow_off',
        term: 'Blow-Off Valfi (BOV)',
        description: 'Turbo araçlarda gazdan ayak çekildiğinde içeride sıkışan yüksek basınçlı havayı atmosfere "çuff" sesiyle tahliye eden mekanik valftir.',
        why: 'Sıkışan havanın turbo pervanesine geri dönerek turboyu yavaşlatmasını veya kırmasını engeller. Modifiyeli araçlardaki o meşhur sesin kaynağıdır.',
        category: 'Mekanik',
        letter: 'B'
    },
    {
        id: 'wastegate',
        term: 'Wastegate',
        description: 'Turbonun gereğinden fazla hızlanmasını ve aşırı basınç üretmesini engellemek için, fazla egzoz gazını turboya girmeden doğrudan egzoz borusuna yönlendiren tahliye kapağıdır.',
        why: 'Aşırı turbo basıncı motor kollarını eğebilir veya piston eritebilir. Wastegate motoru bu tehlikeden koruyan kritik bir kapakçıktır.',
        category: 'Mekanik',
        letter: 'W'
    },
    {
        id: 'turbo_lag',
        term: 'Turbo Gecikmesi (Turbo Lag)',
        description: 'Gaza basıldığı an ile turbonun tam kapasiteyle devreye girip beklenen gücü ürettiği an arasında geçen zaman gecikmesidir.',
        why: 'Özellikle büyük turbolu veya eski nesil araçlarda belirgindir. Sürücü gaza basar ancak araç 1-2 saniye sonra aniden öne atılır.',
        category: 'Sürüş',
        letter: 'T'
    },
    {
        id: 'snorkel',
        term: 'Şnorkel',
        description: 'Off-road (arazi) araçlarında motor hava emişini tavan seviyesine kadar yükselten, suya girildiğinde motorun su yutmasını engelleyen harici boru sistemidir.',
        why: 'Motor hava filtresinden su çekerse "Hydrolock" denilen olay yaşanır ve motor tamamen kilitlenip pert olur. Şnorkel derin sulardan geçişi sağlar.',
        category: 'Sigorta/Resmi',
        letter: 'Ş'
    },
    {
        id: 'diferansiyel_kilidi',
        term: 'Diferansiyel Kilidi',
        description: 'Virajlarda lastiklerin farklı hızda dönmesini sağlayan diferansiyel sistemini geçici olarak kitleyip, iki tekerleğin de aynı hızda ve aynı güçte dönmesini sağlayan mekanizmadır.',
        why: 'Çamurda veya karda bir tekerlek boşa döndüğünde araç yolda kalır. Kilit devreye girince gücü yere basan tekerleğe ileterek aracı saplandığı yerden kurtarır.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'kupa',
        term: 'Kupa (Karoser / Kabin)',
        description: 'Özellikle pick-up ve SUV gibi merdiven şasili araçlarda, şasinin üzerine oturtulan ve yolcuların bulunduğu dış gövde kabinidir.',
        why: 'Bazen aracı yükseltmek (kupa yükseltme) veya ağır kazalarda şasi ile kupanın ayrılıp ayrılmadığına bakmak için bu terim sıkça kullanılır.',
        category: 'Sigorta/Resmi',
        letter: 'K'
    },
    {
        id: 'karter_tapasi',
        term: 'Karter Tapası',
        description: 'Motor yağının boşaltılması için karterin en altında bulunan vidalı tapadır. Yağ bakımlarında bu tapa sökülerek kirli yağ dışarı alınır.',
        why: 'Diş kaptırılırsa veya pulu değiştirilmezse motor alttan sürekli yağ damlatır. Basit ama çok hayati bir vidadır.',
        category: 'Mekanik',
        letter: 'K'
    },
    {
        id: 'triger_zinciri',
        term: 'Triger Zinciri',
        description: 'Kauçuk triger kayışının aksine, motorun içinde yağ ile çalışan ve eksantrik mili ile krank milini senkronize eden çelik zincir sistemidir.',
        why: 'Kayış gibi kopma riski çok düşüktür ve genellikle motor ömrü kadar dayanır. Ancak zamanla uzama yaparsa şıkırtılı çalışmaya ve sente atlamasına yol açar.',
        category: 'Mekanik',
        letter: 'T'
    },
    {
        id: 'bilya_rulman',
        term: 'Bilya / Rulman (Gergiler)',
        description: 'Kayışların gergin durmasını veya porya, şarj dinamosu gibi dönen mekanizmaların sürtünmesiz dönmesini sağlayan içi bilyalı metal halkalardır.',
        why: 'Bozulduğunda motordan ıslık, uğultu veya viyaklama şeklinde sürekli bir ses gelir. Koparsa bağlı olduğu kayışı da kopartır.',
        category: 'Mekanik',
        letter: 'B'
    },
    {
        id: 'buji_kablosu',
        term: 'Buji Kablosu (Ateşleme)',
        description: 'Bobinden çıkan binlerce voltluk yüksek gerilim elektriğini bujilere taşıyan çok kalın yalıtımlı özel kablolardır.',
        why: 'Kablolarda çatlak veya kaçak varsa araç tekleme yapar, yağmurlu havada veya motor yıkandığında araç çalışmayabilir.',
        category: 'Elektrik',
        letter: 'B'
    },
    {
        id: 'subap_kecesi',
        term: 'Subap Lastiği (Keçesi)',
        description: 'Silindir kapağındaki yağın, subap saplarından sızarak yanma odasına girmesini engelleyen minik kauçuk contalardır.',
        why: 'Eskiyip sertleştiğinde motor yağı silindirlere sızar. Araç özellikle ilk çalıştırmada veya vites küçültmelerde egzozdan mavi duman atar (yağ yakar).',
        category: 'Mekanik',
        letter: 'S'
    },
    {
        id: 'sanziman_kulagi',
        term: 'Şanzıman Kulağı (Takozu)',
        description: 'Vites kutusunu (şanzımanı) şasiye bağlayan, motor kulağına benzeyen ve vites değişimlerindeki vuruntuyu emen kauçuk/metal sönümleyicidir.',
        why: 'Koptuğunda vites geçişlerinde "küt küt" vuruntu sesi duyulur ve vites kolu gaza basıldığında ileri-geri çok fazla hareket eder.',
        category: 'Mekanik',
        letter: 'Ş'
    },
    {
        id: 'torque_steer',
        term: 'Torque Steer (Tork Yönlendirmesi)',
        description: 'Yüksek güçlü önden çekişli (FWD) araçlarda, gaza aniden tam basıldığında motor torkunun direksiyonu sağa veya sola doğru şiddetle çekme eğilimidir.',
        why: 'Sürücü direksiyonu sıkı tutmazsa araç aniden şerit değiştirebilir. Aks uzunluklarının veya tork dağılımının dengesizliğinden kaynaklanır.',
        category: 'Sürüş',
        letter: 'T'
    },
    {
        id: 'oversteer',
        term: 'Oversteer (Arkadan Kayma)',
        description: 'Aracın viraj dönerken arka lastiklerinin yol tutuşunu kaybederek, aracın burnunun virajın içine doğru fazlaca dönmesi durumudur (Arkanın savrulması).',
        why: 'Drift sporunun temelidir ancak trafikte yaşanırsa aracın kendi etrafında dönmesine (spin atmasına) neden olabilir. Özellikle arkadan itişli araçlarda sık görülür.',
        category: 'Sürüş',
        letter: 'O'
    },
    {
        id: 'understeer',
        term: 'Understeer (Önden Kayma)',
        description: 'Aracın viraj dönerken direksiyon ne kadar çevrilirse çevrilsin ön lastiklerin tutunamayıp aracın virajın dışına doğru düz gitme eğilimidir.',
        why: 'Sürücü için en çaresiz anlardan biridir, direksiyon komut dinlemez. Genellikle viraja çok hızlı girildiğinde önden çeker araçlarda görülür.',
        category: 'Sürüş',
        letter: 'U'
    },
    {
        id: 'torsiyon_cubugu',
        term: 'Torsiyon Çubuğu (Dingil)',
        description: 'Özellikle hatchback ve hafif ticari araçların arka süspansiyonunda kullanılan, burularak esneyen kalın U şeklindeki metal köprüdür.',
        why: 'Bağımsız süspansiyona göre çok daha ucuz ve bagaj hacminden tasarruf sağlar ancak yol tutuşu ve konforu belirgin şekilde düşüktür.',
        category: 'Mekanik',
        letter: 'T'
    },
    {
        id: 'abs_beyni',
        term: 'ABS Beyni',
        description: 'Fren kilitlenmesini engelleyen elektronik ABS modülüdür. Tekerleklerdeki sensörlerden aldığı hızı işleyip fren valflerini milisaniyeler içinde kontrol eder.',
        why: 'Bozulduğunda ABS lambası yanar ve frenler eski düz sisteme (kızaklayan sisteme) geri döner. Tamiri ve değişimi çok yüksek maliyetlidir.',
        category: 'Elektronik/OBD',
        letter: 'A'
    },
    {
        id: 'sekman_atmak',
        term: 'Sekman Atmak (Yarım Rektifiye)',
        description: 'Motor tamamen sökülüp rektifiye edilmeden, sadece pistonların üzerindeki aşınmış sekmanların ve contaların yenilenmesi işlemidir.',
        why: 'Motor yağ yakıyorsa ancak silindir duvarlarında büyük bir aşınma yoksa uygulanan, komple motor yaptırmaktan çok daha ucuz olan kurtarma operasyonudur.',
        category: 'Mekanik',
        letter: 'S'
    },
    {
        id: 'hararet_musuru',
        term: 'Hararet Müşürü (Sıcaklık Sensörü)',
        description: 'Motor soğutma suyunun sıcaklığını ölçerek gösterge paneline ve motor beynine (ECU) bildiren elektronik parçadır.',
        why: 'Arızalanırsa motorun hararet yaptığını göremezsiniz veya beyin yanlış bilgi alarak aracı zengin karışımda çalıştırıp yakıtı artırır.',
        category: 'Elektronik/OBD',
        letter: 'H'
    },
    {
        id: 'fan_motoru',
        term: 'Radyatör Fanı',
        description: 'Motor ısındığında veya klima açıldığında devreye girerek radyatördeki suyu hava akımıyla hızla soğutan pervaneli elektrik motorudur.',
        why: 'Fanın devreye girmemesi trafiğin durduğu anlarda motorun anında hararet yapıp conta yakmasına neden olur.',
        category: 'Elektrik',
        letter: 'R'
    },
    {
        id: 'sente_atlamasi',
        term: 'Sente Atlaması',
        description: 'Triger kayışının veya zincirinin gevşeyip diş atlaması sonucu krank mili ile eksantrik milinin senkronizasyonunun bozulmasıdır.',
        why: 'Motorun ateşleme ve nefes alma zamanlaması bozulur. Araç çekişten düşer, patlatma yapar veya supaplar pistonlara çarparak motoru kırabilir.',
        category: 'Mekanik',
        letter: 'S'
    },
    {
        id: 'vites_halati',
        term: 'Vites Halatı (Çubuğu)',
        description: 'Vites kolunun hareketini şanzımana ileten kalın çelik telli halatlardır (eski araçlarda metal çubuk).',
        why: 'Halat koparsa vites kolu tamamen boşa çıkar ve aracı viteste takılı kaldığı için hareket ettiremez veya vites değiştiremezsiniz.',
        category: 'Mekanik',
        letter: 'V'
    },
    {
        id: 'senkromec',
        term: 'Senkromeç',
        description: 'Manuel şanzımanda vites değiştirirken, dönmekte olan iki dişlinin hızlarını eşitleyerek sürtünmesiz, "cırt" sesi olmadan geçmelerini sağlayan bronz bileziktir.',
        why: 'Aşındığında vites geçişleri zorlaşır, özellikle 2. veya 3. vitese atarken metalin metale sürtünme (cırtlama) sesi gelir.',
        category: 'Mekanik',
        letter: 'S'
    },
    {
        id: 'krank_kasnagi',
        term: 'Krank Kasnağı (Titreşim Sönümleyici)',
        description: 'Krank milinin ucunda bulunan, V-kayışını döndüren ve üzerinde motorun titreşimini emen kauçuk bir katman bulunduran büyük kasnaktır.',
        why: 'İçindeki kauçuk koptuğunda rölantide çok yüksek bir şıkırtı/çarpma sesi yapar, kayışın fırlamasına sebep olabilir.',
        category: 'Mekanik',
        letter: 'K'
    },
    {
        id: 'egr_iptali',
        term: 'EGR İptali',
        description: 'Sürekli kurum bağlayıp arıza veren EGR valfinin yazılımsal ve donanımsal olarak devreden çıkarılıp, motorun sadece temiz hava emmesinin sağlanmasıdır.',
        why: 'Performansı bir miktar artırır ve motorun kurum bağlamasını önler ancak aracın doğaya saldığı zararlı azot oksit (NOx) gazlarını fırlatır.',
        category: 'Mekanik',
        letter: 'E'
    },
    {
        id: 'aks_korugu',
        term: 'Aks Körüğü',
        description: 'Aks kafasını çevreleyen ve içindeki gres yağını muhafaza edip dışarıdan su, toz ve çamur girmesini engelleyen akordeon şeklindeki kauçuk kılıftır.',
        why: 'Körük yırtıldığında gres yağı janta savrulur ve içeri dolan kum/su aks kafasını (mafsalı) kısa sürede bozar.',
        category: 'Lastik/Jant',
        letter: 'A'
    },
    {
        id: 'direksiyon_pompasi',
        term: 'Direksiyon Pompası',
        description: 'Hidrolik direksiyonlu araçlarda direksiyon sıvısına (ATF) basınç uygulayarak sürücünün direksiyonu serçe parmağıyla bile çevirebilmesini sağlayan pompadır.',
        why: 'Pompa arızalandığında direksiyon kara düzene döner ve taş gibi sertleşir. Ayrıca park manevralarında ağlama/inleme sesi yapabilir.',
        category: 'Sürüş',
        letter: 'D'
    },
    {
        id: 'sarj_komuru',
        term: 'Şarj Dinamosu Kömürü (Fırçası)',
        description: 'Alternatörün içinde elektrik akımını dönen rotora ileten grafit tabanlı karbon parçalardır.',
        why: 'Kömürler sürtünmeden dolayı bittiğinde şarj dinamosu elektrik üretemez, akü lambası yanar ve araç aküdeki elektrik bitene kadar gidebilir.',
        category: 'Elektrik',
        letter: 'Ş'
    },
    {
        id: 'geri_vites_musuru',
        term: 'Geri Vites Müşürü',
        description: 'Şanzımanın üzerinde bulunan, araç geri vitese takıldığında arkadaki beyaz geri vites lambalarını yakan ve park sensörünü devreye sokan şalterdir.',
        why: 'Bozulduğunda geri vites lambaları yanmaz, muayeneden (TÜVTÜRK) hafif değil "Ağır Kusur" olarak kalmanıza neden olur.',
        category: 'Elektrik',
        letter: 'G'
    },
    {
        id: 'fren_limitoru',
        term: 'Fren Limitörü (Kantar)',
        description: 'Eski ve ABS olmayan araçlarda, aracın arka kısmındaki yüke göre arka tekerleklere giden fren basıncını ayarlayan valftir.',
        why: 'Bagaj boşken arkaya tam fren basıncı gitmesini engelleyerek, arka tekerleklerin kilitlenip aracın kendi etrafında dönmesini önler.',
        category: 'Mekanik',
        letter: 'F'
    },
    {
        id: 'disk_torna',
        term: 'Disk Tornalatmak',
        description: 'Eğilmiş veya çizilmiş fren disklerinin yüzeyinden milimetrik bir talaş alınarak diskin fabrikasyon düzlüğüne getirilmesi işlemidir.',
        why: 'Yüksek hızda frene basınca direksiyonda yaşanan titremeyi (balans) çözer. Ancak disk çok inceldiyse torna yapılamaz, değiştirilmesi gerekir.',
        category: 'Mekanik',
        letter: 'D'
    },
    {
        id: 'airbag_sargisi',
        term: 'Airbag Zembereği (Sargısı)',
        description: 'Direksiyon simidinin altında yer alan, direksiyon dönerken kornanın ve direksiyon airbag\'inin elektrik bağlantısının kopmamasını sağlayan esnek kablo sargısıdır.',
        why: 'Koptuğunda direksiyondan sürtünme sesi gelir, airbag ışığı yanar ve korna basmaz. Kaza anında sürücü hava yastığı açılmaz.',
        category: 'Elektronik/OBD',
        letter: 'A'
    },
    {
        id: 'torsen',
        term: 'Torsen Diferansiyel',
        description: 'Audi\'nin Quattro sistemlerinde sıkça kullandığı, patinaja düşen tekerleğin gücünü anında ve tamamen mekanik olarak yola tutunan tekerleğe aktaran torka duyarlı diferansiyel.',
        why: 'Elektronik sistemlerin aksine gecikmesiz çalışır ve kaygan zeminlerde araca mükemmel bir yol tutuşu sağlar.',
        category: 'Mekanik',
        letter: 'T'
    },
    {
        id: 'haldex',
        term: 'Haldex Kavrama',
        description: 'Volkswagen, Skoda, Seat (4Motion) araçlarında önden çekişli aracı ihtiyaç halinde saniyeler içinde 4 çeker (AWD) yapan hidrolik/elektronik çoklu kavrama sistemidir.',
        why: 'Normal yolda önden çeker gibi davranıp yakıt tasarrufu sağlar, kar veya çamurda arka tekerlekleri devreye sokarak çekişi artırır.',
        category: 'Mekanik',
        letter: 'H'
    },
    {
        id: 'airmatic',
        term: 'Airmatic (Havalı Süspansiyon)',
        description: 'Çelik helezon yaylar yerine, basınçlı hava ile doldurulmuş körükler kullanan üst segment (örneğin Mercedes S Serisi) süspansiyon sistemidir.',
        why: 'Kusursuz bir "uçan halı" konforu sunar. Aracın yüksekliği ayarlanabilir. Ancak patlarsa araç yere çöker ve tamiri çok pahalıdır.',
        category: 'Mekanik',
        letter: 'A'
    },
    {
        id: 'rodaj',
        term: 'Rodaj (Motor Alıştırma)',
        description: 'Sıfır alınan veya rektifiye edilen bir motorun parçalarının (piston, segman vb.) birbirine alışması için ilk 1.000-2.000 km boyunca aracı zorlamadan kullanma evresidir.',
        why: 'İyi yapılmış bir rodaj, motorun uzun vadede daha az yağ yakmasını, daha uzun ömürlü olmasını ve daha iyi performans vermesini sağlar.',
        category: 'Sürüş',
        letter: 'R'
    },
    {
        id: 'kesici',
        term: 'Kesiciye Girmek (Rev Limiter)',
        description: 'Motorun üretebileceği maksimum güvenli devri aştığınızda, motor beyninin zarar görmemesi için yakıtı veya ateşlemeyi anlık olarak kesip geri vermesi (tatatata sesi) olayıdır.',
        why: 'Motor kollarının kopmasını veya subapların pistonu delmesini engelleyen bir güvenlik önlemidir.',
        category: 'Sürüş',
        letter: 'K'
    },
    {
        id: 'amortisör_takozu',
        term: 'Amortisör Takozu (Bilyası)',
        description: 'Ön amortisörlerin şasiye bağlandığı tepe noktasında yer alan, içinde direksiyon döndükçe amortisörün de dönmesini sağlayan bilya bulunan kauçuk takoz.',
        why: 'Bozulduğunda direksiyonu sağa sola çevirirken "gırç gırç" kauçuk sesi veya yay atma sesi (tık) duyulur. Kasislerde lok lok vurur.',
        category: 'Mekanik',
        letter: 'A'
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
