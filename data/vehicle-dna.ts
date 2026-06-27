export function createSlug(text: string): string {
    if (!text) return '';
    const trMap: Record<string, string> = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
    };
    return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, m => trMap[m] || m)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export interface ChronicIssue {
    id: number;
    title: string;
    severity: 'low' | 'medium' | 'high';
    reportCount: number;
    description: string;
}

export interface UserExperience {
    id: number;
    author: string;
    authorLevel: string;
    text: string;
    likes: number;
    replies: number;
    date: string;
    rating: number; // 1-5
}

export interface VehicleDNA {
    id: number;
    brand: string;
    model: string;
    year: string;
    dnaScore: number; // 0-100
    strengths: string[];
    weaknesses: string[];
    chronicIssues: ChronicIssue[];
    userExperiences: UserExperience[];
    totalReports: number;
    imageUrl?: string;
    ncapStars?: number;
    ncapYear?: string;
}

export const vehicleDNAData: VehicleDNA[] = [
    {
        id: 1,
        brand: "Renault",
        model: "Clio 5. Nesil (2020-2025)",
        year: "2020-2025",
        ncapStars: 5,
        ncapYear: "2019",
        dnaScore: 78,
        strengths: [
            "Mükemmel Yakıt Ekonomisi (Özellikle 1.5 dCi & E-Tech)",
            "5 Yıldız Euro NCAP Güvenlik (Sınıf lideri koruma)",
            "Modern ve Şık İç Mekan (Smart Cockpit)",
            "İkinci Elde 'Çeyrek Altın' Gibi Değer Koruma",
            "Yaygın Servis ve Uygun Yedek Parça",
            "Kablosuz CarPlay/Android Auto (Makyajlı kasalarda)"
        ],
        weaknesses: [
            "X-Tronic Şanzıman Kararsızlığı (Düşük hızda silkeleme)",
            "Start-Stop Sisteminin Kafasına Göre Çalışması",
            "Multimedya Ekran Donmaları ve Reset Atma",
            "Arka Diz Mesafesi Sınıf Ortalamasının Altında",
            "Zayıf Ses Yalıtımı (100 km/s üzeri rüzgar sesi)"
        ],
        chronicIssues: [
            {
                id: 3,
                title: "Trim Sesleri (B Sütunu & Kemer)",
                severity: "low",
                reportCount: 9,
                description: "Kullanıcıların %80'i emniyet kemeri mekanizmasından (B sütunu) gelen tıkırtı sesinden Şikayetçi. Servislerde izolasyon bandı uygulaması yapılıyor."
            },
            {
                id: 4,
                title: "Akü Zayıflığı ve Start-Stop Hatası",
                severity: "medium",
                reportCount: 6,
                description: "Fabrikasyon akülerin (EFB) ömrü kısa olabiliyor. Akü voltajı düştüğünde araç 'Start-Stop Arızası' veya 'Akü Şarj oluyor' uyarısı verip sistemi devre dışı bırakıyor."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 1001,
        brand: "Renault",
        model: "Clio 1. Nesil (1990-1998)",
        year: "1990-1998",
        ncapStars: 3,
        ncapYear: "1997",
        dnaScore: 58,
        strengths: [
            "Avrupa'da Yılın Otomobili Ödülü (1991 - Lansmanla gelen prestij)",
            "Kompakt Boyut ve Çevik Manevra Kabiliyeti (Şehir içi ideal)",
            "Basit Mekanik Yapı (Tamircide kolay ve ucuz tamir)",
            "Dönemine Göre Modern Tasarım (Süper 5'e kıyasla devrim)",
            "Hafif Kasa ile Düşük Yakıt Tüketimi"
        ],
        weaknesses: [
            "Güvenlik Donanımı Yok Denecek Kadar Az (Hava yastığı çoğu pakette yok)",
            "Kaporta Paslanmaya Çok Müsait (Özellikle çamurluk ve kapı altları)",
            "Plastik Tamponların Solması ve Kırılganlığı",
            "Yalıtım Sıfıra Yakın (Motor, yol ve rüzgar sesi direkt kabine girer)",
            "Klima Çoğu Modelde Bulunmaz"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Kaporta Çürümesi ve Paslanma",
                severity: "high",
                reportCount: 9,
                description: "Özellikle arka çamurluklar, kapı altları, şase kirişleri ve bagaj çevresi yoğun paslanmaya maruz kalır. Galvaniz kaplama olmadığı için nem ve tuz korozyona davetiye çıkarır."
            },
            {
                id: 2,
                title: "Elektrik Tesisatı Sorunları",
                severity: "high",
                reportCount: 8,
                description: "Kablo izolasyonlarının yaşla birlikte sertleşip çatlaması, sigorta kutusundaki oksitlenme ve topraklama hataları. Far, silecek veya sinyal arızaları genelde tesisat kaynaklıdır."
            },
            {
                id: 3,
                title: "Soğutma Sistemi Kaçakları",
                severity: "medium",
                reportCount: 8,
                description: "Genleşme kabı, alt hortumlar ve su pompası contasından su sızıntısı. Eski araçlarda antifriz yerine su kullanımı korozyonu hızlandırarak radyatör tıkanmasına yol açar."
            },
            {
                id: 4,
                title: "Gaz Teli ve Debriyaj Teli Kopması",
                severity: "medium",
                reportCount: 7,
                description: "Tel tahrikli gaz ve debriyaj mekanizmalarında tellerin zamanla uzaması veya kopması. Özellikle kış aylarında soğukta sertleşen teller kopma riski taşır."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 1002,
        brand: "Renault",
        model: "Clio 2. Nesil (1998-2012)",
        year: "1998-2012",
        ncapStars: 4,
        ncapYear: "2000",
        dnaScore: 68,
        strengths: [
            "Efsanevi 1.5 dCi Motorun İlk Kullanıldığı Kasa (K9K motor dünya çapında kanıtlanmış güvenilirlik)",
            "Kompakt Ama Şaşırtıcı Derecede Geniş İç Mekan",
            "Çok Uzun Üretim Ömrü (Campus olarak 2012'ye kadar - Parça bolluğu)",
            "Türkiye'de Çok Yaygın Servis ve Yedek Parça Ağı",
            "Clio V6 Sport Versiyonu ile Efsane Statüsü",
            "Düşük Sigorta ve İşletme Maliyetleri"
        ],
        weaknesses: [
            "Yaşlanan Kaporta (Özellikle 2005 öncesi modellerde pas riski)",
            "İç Mekan Malzeme Kalitesi (Sert ve çizilmeye müsait plastikler)",
            "Güvenlik Donanımı (Baz modellerde sadece sürücü airbag)",
            "Yalıtım Eksikliği (Motor ve yol sesi kabine fazla gelir)",
            "Otomatik Şanzıman Seçeneğinin Olmaması (Çoğu versiyonda)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Cam Kriko Motoru Arızası",
                severity: "high",
                reportCount: 9,
                description: "Clio 2'nin en meşhur kronik sorunudur. Özellikle ön kapı cam kriko motorlarının düzenli olarak yanması ve camın yarıda kalması. Piyasada muadil parçalar çok yaygın ve ucuzdur."
            },
            {
                id: 2,
                title: "Kapak Contası ve Yağ Sızıntısı",
                severity: "medium",
                reportCount: 9,
                description: "Üst kapak contası (kep contası) ve karter contasından yağ sızıntısı. Motor bloğu ile kapak arasından süzülen yağ, zamanla enjektör kuyularına da dolabilir."
            },
            {
                id: 3,
                title: "Arka Fren Kampana Problemi",
                severity: "medium",
                reportCount: 8,
                description: "Arka kampana fren balatalarının çabuk aşınması ve fren sıkıştığında ayar mekanizmasının kilitlenmesi. El freni ayarı sık sık yapılması gerekir."
            },
            {
                id: 4,
                title: "Klima Kompresörü ve Gaz Kaçağı",
                severity: "medium",
                reportCount: 7,
                description: "Klima sisteminde gaz kaçağı veya kompresör kavramasının tutmaması. Özellikle yüksek kilometreli araçlarda klimanın hiç soğutmaması şikayeti yaygın."
            },
            {
                id: 5,
                title: "Direksiyon Hidrolik Pompa Sızıntısı",
                severity: "medium",
                reportCount: 7,
                description: "Hidrolik direksiyonlu modellerde pompa keçelerinden sızıntı ve direksiyon ağırlaşması. Özellikle park manevralarında inleme sesi duyulur."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2,
        brand: "Fiat",
        model: "Egea 1. Nesil (2015-2025)",
        year: "2015-2025",
        ncapStars: 4, // Safety Pack ile
        ncapYear: "2016",
        dnaScore: 75,
        strengths: [
            "Fiyat/Performans Lideri (En ulaşılabilir C-Sedan)",
            "Geniş Bagaj Hacmi (520 Litre) ve Yaşam Alanı",
            "Parçası Bakkalda Bile Var (Çok ucuz bakım)",
            "1.3 & 1.6 Multijet Motorların Efsane Dayanıklılığı",
            "City Modu ile Şehir İçi Pamuk Gibi Direksiyon",
            "Türkiye Yol Şartlarına Uygun Yumuşak Süspansiyon"
        ],
        weaknesses: [
            "Düşük Güvenlik Donanımı (Baz paketlerde yetersiz)",
            "Yüksek Hızda Güven Vermeyen Yol Tutuş",
            "İç Mekan Malzeme Kalitesi (Sert plastikler)",
            "Yalıtım Zayıflığı (Rüzgar ve yol sesi)",
            "DCT Şanzıman Kararsızlığı (Özellikle 1.6 Dizel'de)"
        ],
        chronicIssues: [
            {
                id: 2,
                title: "Amortisör Takozu ve Z-Rot Sesi",
                severity: "low",
                reportCount: 9,
                description: "Ön takımdan, özellikle direksiyonu kırarken veya tümseklerde 'lok lok' veya 'gıcırtı' Şeklinde sesler gelir. Amortisör takozları ve bilyaları çabuk deforme olur."
            },
            {
                id: 4,
                title: "Krom Parça Soyulmaları",
                severity: "low",
                reportCount: 9,
                description: "Dış kapı kollarındaki ve ön panjurda bulunan krom kaplamalar zamanla kabarabilir veya soyulabilir."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3,
        brand: "Toyota",
        model: "Corolla 12. Nesil (2019-2025)",
        year: "2019-2025",
        ncapStars: 5,
        ncapYear: "2019",
        dnaScore: 85,
        strengths: [
            "Sorunsuzluk Abidesi (Sanayi yolunu unutturur)",
            "Hibrit Teknolojisi ile Şehir İçi Rakipsiz Tüketim",
            "Yüksek İkinci El Değeri (Çeyrek Altın)",
            "Konforlu Sürüş ve Yumuşak Süspansiyon",
            "Standart Güvenlik Donanımı (Safety Sense)",
            "Geniş İç Hacim ve Ferah Arka Koltuk"
        ],
        weaknesses: [
            "Rüzgar ve Yol Sesi (Özellikle 110 km/s üzeri)",
            "CVT Şanzıman Hissizliği (Motor bağırma efekti)",
            "Multimedya Ekranı Çağın Gerisinde (Grafikler eski)",
            "Boya Kalitesi (İnce ve çabuk çizilebilir)",
            "Bagaj Hacmi Rakiplere Göre Sınırlı (Özellikle Hibrit)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Boya Atması (Beyaz Renk)",
                severity: "medium",
                reportCount: 9,
                description: "Özellikle inci beyazı renkli modellerde, basınçlı yıkama sonrası tampon köşelerinde ve tavan rayı kenarlarında boya kalkması sorunu yaşanabiliyor. Servisler lokal boya ile onarım öneriyor."
            },
            {
                id: 2,
                title: "Rüzgar Sesi (A Sütunu)",
                severity: "low",
                reportCount: 8,
                description: "Araç 100-110 km/s hızı geçince kapı fitillerinden ve aynalardan rüzgar sesi almaya başlıyor. Yalıtım zayıflığı kullanıcıların en sık Şikayet ettiği konu."
            },
            {
                id: 3,
                title: "Balata ve Fren Islık Sesi",
                severity: "low",
                reportCount: 9,
                description: "Geri manevrada veya düşük hızda fren yaparken balatalardan gelen tiz ıslık sesi. Serviste temizlik veya değişim yapılmasına rağmen tekrarlayabiliyor."
            },
            {
                id: 4,
                title: "Multimedya Sorunları",
                severity: "low",
                reportCount: 7,
                description: "Ekranın güneşte parlaması, dokunmatiğin geç algılaması ve Apple CarPlay bağlantısının bazen kopması gibi teknolojik sorunlar."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 4,
        brand: "Renault",
        model: "Megane 4. Nesil (2016-2025)",
        year: "2016-2025",
        ncapStars: 5,
        ncapYear: "2015", // Test 2015 sonunda yapıldı, araç 2016 çıkışlı
        dnaScore: 76,
        strengths: [
            "Tesla Tipi Dikey Multimedya Ekranı (R-Link)",
            "C-Şekilli LED Farlar ve Etkileyici Tasarım",
            "Geniş İç Hacim ve Konforlu Koltuklar",
            "1.3 TCe Motorun Mercedes Ortaklığı ve Performansı",
            "Güçlü Yol Tutuş ve Sürüş Dinamikleri",
            "5 Yıldız Euro NCAP (2015 Testi)"
        ],
        weaknesses: [
            "EDC Şanzıman Isınması (Yoğun trafikte)",
            "Trim Sesleri (Özellikle Sunroof ve Konsol)",
            "Arka Görüş Açısı (Tasarım kaynaklı dar)",
            "R-Link Ekran Donmaları (Erken modellerde)",
            "Klimanın Soğutma Performansı (Bazı serilerde)"
        ],
        chronicIssues: [
            {
                id: 3,
                title: "Trim ve Amortisör Sesi",
                severity: "low",
                reportCount: 6,
                description: "Soğuk havalarda ön amortisörlerden gelen gıcırtı ve bozuk yollarda B sütunu/panoramik tavan fitillerinden gelen tıkırtı sesleri."
            },
            {
                id: 4,
                title: "R-Link Ekran Kararması",
                severity: "low",
                reportCount: 7,
                description: "Multimedya ekranının kendi kendine kapanıp açılması veya donması. Genellikle servis güncellemesi ile çözülüyor."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 5,
        brand: "Honda",
        model: "Civic 11. Nesil FE1 (2021-2025)",
        year: "2021-2025",
        ncapStars: 5,
        ncapYear: "2022",
        dnaScore: 82,
        strengths: [
            "Sürüş Dinamikleri ve Yol Tutuş (Sınıfının en iyilerinden)",
            "5 Yıl/150.000 KM Garantili LPG (Eco Elegance/Executive)",
            "Geniş ve Alçak Oturma Pozisyonu (Sportif his)",
            "İkinci Elde Hızlı Satış (Altın gibi)",
            "Sorunsuz VTEC Turbo Motor ve CVT Uyumu",
            "5 Yıldız Euro NCAP (2022 Testi - Güncel Kasa)"
        ],
        weaknesses: [
            "Yol ve Rüzgar Sesi (Sınıf standartlarının altında yalıtım)",
            "Boya Kalitesi (İnce, çabuk çiziliyor ve taş izi oluyor)",
            "Alçak Alt Yapı (Kasislerde dikkat gerektiriyor)",
            "Multimedya Kamera Çözünürlüğü Düşük",
            "Sticky Steering (Direksiyon yapışma hissi)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yapışkan Direksiyon (Sticky Steering)",
                severity: "medium",
                reportCount: 8,
                description: "Özellikle uzun yolda direksiyonda takılma/yapışma hissi oluşuyor. Honda bazı serilerde direksiyon kutusu değişimi veya yazılım güncellemesi ile çözüm sunuyor."
            },
            {
                id: 2,
                title: "Trim Sesleri (Emniyet Kemeri/A Sütunu)",
                severity: "low",
                reportCount: 6,
                description: "B sütunundan ve emniyet kemeri mekanizmasından tıkırtı sesleri gelmesi yaygın."
            },
            {
                id: 3,
                title: "İnce Kaporta Boyası",
                severity: "medium",
                reportCount: 6,
                description: "Özellikle kaput ve tamponda taş izleri çok çabuk oluşuyor. Kullanıcılar seramik kaplama veya PPF öneriyor."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 6,
        brand: "Volkswagen",
        model: "Passat B8 (2015-2023)",
        year: "2015-2023",
        ncapStars: 5,
        ncapYear: "2014",
        dnaScore: 84,
        strengths: [
            "Tartışmasız İkinci El Kralı (Altın Bilezik)",
            "Makam Aracı Konforu ve Yalıtımı (Sınıf Referansı)",
            "Geniş ve Ferah İç Mekan (Arka diz mesafesi)",
            "Yüksek Malzeme Kalitesi ve İŞçilik",
            "Güçlü ve Ekonomik TDI Motor Seçenekleri",
            "Şık ve Zamanız Tasarım (Highline/Elegance)"
        ],
        weaknesses: [
            "DSG Şanzıman Riski (Mekatronik ve Kavrama)",
            "Yüksek Bakım ve Onarım Maliyetleri",
            "AdBlue Sistemi Sorunları (TDI Motorlar)",
            "Cam Tavan Sesleri (Zamanla trim sesi yapar)",
            "Standart Donanım Zayıflığı (Baz paketler boş)"
        ],
        chronicIssues: [
            {
                id: 3,
                title: "Cam Tavan Gıcırtısı",
                severity: "low",
                reportCount: 7,
                description: "Panoramik cam tavan kasislerde ve esnemelerde gıcırtı yapabilir. Serviste özel yağlama ile geçici çözüm sağlanır ama tekrarlayabilir."
            },
            {
                id: 4,
                title: "Kapı Kilit Mekanizması",
                severity: "low",
                reportCount: 6,
                description: "Soğuk havalarda kapıların kilitlenmemesi veya dışarıdan açılmaması sorunu yaşanabilir."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 7,
        brand: "Dacia",
        model: "Duster 2. Nesil (2018-2024)",
        year: "2018-2025",
        ncapStars: 3,
        ncapYear: "2024", // Temmuz 2024 Testi (3. Nesil de 3 yıldız aldı)
        dnaScore: 73,
        strengths: [
            "Rakipsiz Fiyat/Performans SUV Deneyimi",
            "Gerçek 4x4 Arazi Kabiliyeti (Sınıfının en iyisi)",
            "Dayanıklı ve Basit Alt Yapı (Az sorun)",
            "LPG Fabrika Çıkışlı Seçenek (ECO-G)",
            "Geniş İç Hacim ve Pratik Kullanım",
            "Yüksek İkinci El Talebi ve Hızlı Satış"
        ],
        weaknesses: [
            "Düşük Euro NCAP Puanı (Güvenlik yardımcıları eksik)",
            "Yalıtım Zayıflığı (Rüzgar ve yol sesi yüksek)",
            "Sert Plastik Malzeme ve Basit İç Mekan",
            "Konforsuz Koltuklar (Uzun yolda yorabilir)",
            "Direksiyon Hissiyatı (Yapay ve geri bildirimsiz)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Direksiyon Kutusu Sesi",
                severity: "medium",
                reportCount: 8,
                description: "Manevralarda veya bozuk yolda direksiyondan gelen 'takırtı' veya inleme sesi. Genellikle direksiyon kutusu veya milindeki boşluktan kaynaklanıyor."
            },
            {
                id: 2,
                title: "Toz ve Su Alma Sorunu",
                severity: "low",
                reportCount: 9,
                description: "Bazı modellerde kapı fitillerinin yetersizliği nedeniyle araç içine, özellikle kapı eşiklerine toz ve yoğun yağmurda su girmesi Şikayetleri mevcut."
            },
            {
                id: 4,
                title: "Yakıt Göstergesi Tutarsızlığı",
                severity: "low",
                reportCount: 8,
                description: "LPG'li modellerde benzin/LPG göstergesinin yanlış seviye göstermesi veya takılı kalması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 8,
        brand: "Hyundai",
        model: "i20 3. Nesil BC3 (2020-2025)",
        year: "2020-2025",
        ncapStars: 4,
        ncapYear: "2020",
        dnaScore: 77,
        strengths: [
            "Çok Zengin Donanım (Elite/Style Paketlerde Sunroof, Dijital Kadran)",
            "Modern ve Agresif Dış Tasarım (Parametrik)",
            "Sınıfına Göre Geniş İç ve Bagaj Hacmi (352 Litre)",
            "5 Yıl Garanti Avantajı (Üretici Güveni)",
            "Sorunsuz Atmosferik Motor Seçeneği (1.4 MPI)",
            "Kablosuz Şarj ve Apple CarPlay Desteği"
        ],
        weaknesses: [
            "Sert Plastik Malzeme Kalitesi (Kapı içleri ve konsol)",
            "Yüksek Hızda Yol ve Rüzgar Sesi (Yalıtım zayıf)",
            "DCT Şanzıman Isınma Uyarısı (Yoğun dur-kalk trafikte)",
            "Şehir İçi Yüksek Yakıt Tüketimi (1.4 Otomatik 9-10L)",
            "Sert Sürüş Karakteri (Çukurları hissettiriyor)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Debriyaj Aktüatör Sesi (Gıcırtı)",
                severity: "low",
                reportCount: 8,
                description: "Pedaldan ayağı çekerken gelen 'guuuuğğkkk' veya gıcırtı sesi. Debriyaj müşürü veya aktüatör kaynaklı, sürüşe engel değil ama can sıkıcı."
            },
            {
                id: 2,
                title: "Vernik/Boya Atması",
                severity: "medium",
                reportCount: 8,
                description: "Özellikle kaput ve tavan bölgesinde erken vernik atması veya boya dökülmesi Şikayetleri (beyaz renklerde daha sık)."
            },
            {
                id: 3,
                title: "Rölanti Dalgalanması",
                severity: "low",
                reportCount: 8,
                description: "Rölantide devir saatinin kendi kendine inip kalkması. Genellikle LPG'li araçlarda veya debriyaj müşürü kaynaklı."
            },
            {
                id: 4,
                title: "Direksiyon Derisi Soyulması",
                severity: "medium",
                reportCount: 6,
                description: "Erken kilometrelerde direksiyon simidinde soyulma. Garanti kapsamında değişim yapılıyor."
            },
            {
                id: 5,
                title: "Benzin Pompası Sesi",
                severity: "low",
                reportCount: 7,
                description: "Arka koltuk altından gelen 'vınlama' veya 'vızzz' sesi. Depo azken artabilir."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 901,
        brand: "Peugeot",
        model: "3008 (1. Nesil 2009-2016)",
        year: "2009-2016",
        ncapStars: 5,
        ncapYear: "2009",
        dnaScore: 71,
        strengths: [
            "Ferah ve Geniş Cam Tavan (Cielo)",
            "Geniş Bagaj Hacmi (512 Litre)",
            "1.6 HDi Motorun Düşük Yakıt Tüketimi"
        ],
        weaknesses: [
            "Auto6R Yarı Otomatik Şanzımanın Sarsıntılı Geçişleri",
            "Süspansiyonların Sertliği ve Gelen Sesler",
            "Tasarımın MPV ile SUV Arasında Kalması"
        ],
        chronicIssues: [
            {
                id: 3,
                title: "Amortisör Takozu Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Ön süspansiyonlardan, özellikle kasis geçişlerinde lokurtu/gıcırtı sesleri gelmesi sık rastlanan bir montaj/parça zayıflığıdır."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 902,
        brand: "Peugeot",
        model: "3008 (2. Nesil 2016-2023)",
        year: "2016-2023",
        ncapStars: 5,
        ncapYear: "2016",
        dnaScore: 86,
        strengths: [
            "Göz Alıcı ve Modern i-Cockpit Tasarımı",
            "EAT8 Şanzımanın Kusursuz Geçişleri",
            "Yüksek İzolasyon ve Sürüş Konforu",
            "Agresif Dış Tasarım"
        ],
        weaknesses: [
            "Arka Diz Mesafesi Sınıf Rakiplerinden Dar",
            "Multimedya Ekranının Zaman Zaman Donması",
            "Yüksek Yedek Parça ve Servis Maliyetleri"
        ],
        chronicIssues: [
            {
                id: 4,
                title: "Multimedya (SMEG/NAC) Ekran Donması",
                severity: "low",
                reportCount: 7,
                description: "Orta ekranın kendi kendine kapanması, geri görüş kamerasının siyah ekranda kalması veya Bluetooth bağlantısının kopması sorunları yazılımsal olarak yaşanmaktadır."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 10,
        brand: "Opel",
        model: "Corsa F (2020-2025)",
        year: "2020-2025",
        ncapStars: 4,
        ncapYear: "2019",
        dnaScore: 76,
        strengths: [
            "Alman Sürüş Hissi (Sert ve Tok)",
            "EAT8 Şanzıman (Sınıfının en iyisi)",
            "Şık ve Sportif Tasarım (GS Line)",
            "Matriks LED Far Teknolojisi (Sınıfında nadir)",
            "Seri ve Atak Sürüş Karakteri"
        ],
        weaknesses: [
            "Dar Arka Yaşam Alanı ve Bagaj",
            "Sert Süspansiyon (Konforu düşürür)",
            "Baz Donanımlarda Halojen Far Utancı",
            "Triger Kayışı Riski (1.2 Motorlarda)",
            "Yol Sesi (Yüksek hızda)"
        ],
        chronicIssues: [
            {
                id: 2,
                title: "Multimedya Ekran Kararması",
                severity: "low",
                reportCount: 9,
                description: "Ekranın siyah olması veya dokunmatiğin tepki vermemesi. Genellikle akü kutup başı sök-tak veya güncelleme ile düzelir."
            },
            {
                id: 3,
                title: "Direksiyon Kutusu Sesi",
                severity: "medium",
                reportCount: 8,
                description: "Kasislerde direksiyondan gelen tıkırtı sesi."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 11,
        brand: "Togg",
        model: "T10X 1. Nesil (2023-2025)",
        year: "2023-2025",
        ncapStars: 4, // Tahmini
        ncapYear: "2024",
        dnaScore: 80,
        strengths: [
            "Yerli ve Milli Gurur (Servis/Muhatap avantajı)",
            "Geniş İç Hacim ve Devasa Bagaj",
            "Uçtan Uca Ekran Deneyimi (Dünyada nadir)",
            "Güçlü Motor ve Arkadan İtiş (Keyifli sürüş)",
            "Hızlı Şarj Desteği (Trugo)",
            "Ücretsiz Güncellemeler ve İyileştirmeler"
        ],
        weaknesses: [
            "Yazılım Hataları (Ekran donması, sensör hataları)",
            "Şarj İstasyonu Sorunları (Altyapı yetersizliği)",
            "Menzil Kaygısı (Kışın düşen menzil)",
            "Trim Sesleri ve Montaj Hataları",
            "Anahtar/Telefon Bağlantı Sorunları"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Ekran Donması ve Resetleme",
                severity: "medium",
                reportCount: 9,
                description: "Ana ekranın veya göstergelerin sürüş esnasında donması, kararması. Reset atılarak (iki tuşa basılı tutarak) çözülüyor ancak can sıkıcı."
            },
            {
                id: 2,
                title: "Şarj Başlatma Hatası",
                severity: "high",
                reportCount: 8,
                description: "Bazı DC istasyonlarda 'Şarj Başlatılamadı' hatası veya Şarjın yarıda kesilmesi. OBC (On-Board Charger) güncellemesi gerekebiliyor."
            },
            {
                id: 3,
                title: "SOS / eCall Hatası",
                severity: "low",
                reportCount: 7,
                description: "Tavandaki SOS modülünün yazılımsal olarak hata vermesi ve ekranda sürekli uyarı çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 12,
        brand: "Chery",
        model: "Tiggo 8 Pro 1. Nesil (2023-2025)",
        year: "2023-2025",
        ncapStars: 5, // C-NCAP
        ncapYear: "2023",
        dnaScore: 78,
        strengths: [
            "Fiyatına Göre İnanılmaz Donanım (Lüks hissiyatı)",
            "7 Koltuklu Geniş Aile Aracı",
            "Güçlü Motor (183 HP) ve Hızlanma",
            "Sony Ses Sistemi ve Kaliteli Deri Koltuklar",
            "Heybetli ve Prestijli Görünüm"
        ],
        weaknesses: [
            "Yüksek Yakıt Tüketimi (Şehir içi 10-12 Litre)",
            "Multimedya Çeviri Hataları ve Yavaşlık",
            "Servis ve Yedek Parça Bekleme Süreleri",
            "Yumuşak Süspansiyon (Virajda yatma)",
            "Lastik Kalitesi (Fabrika çıkışı lastikler vasat)"
        ],
        chronicIssues: [
            {
                id: 3,
                title: "Multimedya/Klima Ekran Donması",
                severity: "low",
                reportCount: 8,
                description: "Klima panelinin veya ana ekranın tepki vermemesi. Yazılım güncellemesi ile düzeliyor."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 13,
        brand: "Volkswagen",
        model: "Golf 8. Nesil (2020-2025)",
        year: "2020-2025",
        ncapStars: 5,
        ncapYear: "2019",
        dnaScore: 80,
        strengths: [
            "Sınıf Referansı Konfor ve Yalıtım (Hala kral)",
            "Tok Kapı Sesi ve Kalite Hissi",
            "Sade ve Modern Dijital Kokpit",
            "eTSI Hibrit Motor ile Düşük Tüketim",
            "İkinci Elde Değerini Koruma"
        ],
        weaknesses: [
            "Dokunmatik Tuş Ergonomisi (Direksiyon ve Klima zor)",
            "Yazılım ve Multimedya Hataları (Kronik)",
            "DSG Şanzıman Riski (Kavrama ve Mekatronik)",
            "Yüksek Fiyat Politikası",
            "Baz Paketlerin Çok Boş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yazılım ve Ekran Hataları",
                severity: "medium",
                reportCount: 6,
                description: "Golf 8'in en büyük baş belası. Ekranın donması, siyah ekran, asistan sistemlerin 'Şu an kullanılamıyor' uyarısı vermesi. Güncellemelerle çözülmeye çalışılıyor."
            },
            {
                id: 2,
                title: "SOS Acil Çağrı Hatası",
                severity: "low",
                reportCount: 8,
                description: "Tavandaki SOS modülünün arıza verip göstergede sürekli uyarı yakması. Parça değişimi gerekebiliyor."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 14,
        brand: "Ford",
        model: "Focus 4. Nesil Mk4 (2018-2025)",
        year: "2018-2025",
        ncapStars: 5,
        ncapYear: "2018",
        dnaScore: 81,
        strengths: [
            "Sınıfının En İyi Yol Tutuşu (Viraj ustası)",
            "Doğrudan ve Hissli Direksiyon Sistemi",
            "Sessiz Kabin Yalıtımı (Rüzgar ve yol sesi az)",
            "Sağlam Şasi ve Güvenlik Hissi",
            "Geniş İç Hacim (Dingil mesafesi avantajı)"
        ],
        weaknesses: [
            "8 İleri Otomatik Şanzıman Kararsızlığı",
            "Dar Arka Baş Mesafesi (Tasarım kaynaklı)",
            "Pahalı Servis ve Yedek Parça",
            "Bagaj Hacmi Rakiplerden Küçük (375 Litre)",
            "Trim Sesleri (B sütunu ve kapı içleri)"
        ],
        chronicIssues: [
            {
                id: 2,
                title: "Multimedya Ekran Donması",
                severity: "low",
                reportCount: 9,
                description: "Sync ekranının tepki vermemesi veya geri görüş kamerasının geç gelmesi."
            },
            {
                id: 3,
                title: "B Sütunu Trim Sesi",
                severity: "low",
                reportCount: 7,
                description: "Emniyet kemeri çıkışından gelen tıkırtı sesi, özellikle bozuk yolda belirginleşiyor."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 15,
        brand: "BMW",
        model: "320i F30 (2012-2019)",
        year: "2019-2025",
        ncapStars: 5,
        ncapYear: "2019",
        dnaScore: 83,
        strengths: [
            "Saf Sürüş Keyfi (Arkadan İtiş)",
            "Mükemmel ZF 8 İleri Şanzıman Uyumu",
            "Yüksek Prestij ve Marka İmajı",
            "Kaliteli ve Sürücü Odaklı İç Mekan",
            "Gelişmiş Teknoloji ve Multimedya (iDrive)"
        ],
        weaknesses: [
            "Yüksek İŞletme ve Bakım Maliyeti",
            "Sert Süspansiyon (Runflat lastikler ile)",
            "Arkada Şaft Tüneli (5. kişi için zor)",
            "Direksiyon Trim Sesleri",
            "Soğutma Sistemi Hassasiyeti"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Su Eksiltme / Soğutma Sızıntısı",
                severity: "medium",
                reportCount: 9,
                description: "Genleşme kabı, devirdaim veya hortumlardan soğutma sıvısı kaçağı. 'Soğutma suyu seviyesi düşük' uyarısı dikkate alınmalı."
            },
            {
                id: 2,
                title: "Direksiyon Trim Sesi",
                severity: "low",
                reportCount: 6,
                description: "Direksiyon simidinden veya airbag sargısından gelen sürtünme/gıcırtı sesi."
            },
            {
                id: 3,
                title: "Klima Izgarası Kırılması",
                severity: "low",
                reportCount: 6,
                description: "Ön konsol havalandırma yönlendirme ızgaralarının hassas olması ve çabuk kırılması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 16,
        brand: "Mercedes-Benz",
        model: "C180 W205 (2014-2021)",
        year: "2021-2025",
        ncapStars: 5,
        ncapYear: "2022",
        dnaScore: 79,
        strengths: [
            "Baby S-Class İç Mekan (Ambians aydınlatma kralı)",
            "Yüksek Sürüş Konforu ve Sessizlik",
            "Prestijli Yıldız Logosu",
            "9G-Tronic Şanzıman Pürüzsüzlüğü",
            "Gelişmiş MBUX Multimedya Sistemi"
        ],
        weaknesses: [
            "48V Hafif Hibrit Sistem Arızaları",
            "1.5 Motorun Yüksek Hızda Zorlanması",
            "Önceki Kasaya Göre Düşen Malzeme Kalitesi",
            "Yüksek Servis ve Yedek Parça Maliyetleri",
            "Arka Diz Mesafesi (Rakiplere göre dar)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "48V Akü Sistemi Arızası",
                severity: "high",
                reportCount: 7,
                description: "Aracın çalışmamasına neden olan kronik bir sorun. '48V sistemi arızası' uyarısı verip yolda bırakabiliyor. Yazılım veya parça değişimi gerektirir."
            },
            {
                id: 2,
                title: "Fren Sesi ve Titreme",
                severity: "low",
                reportCount: 9,
                description: "Düşük hızlarda frenlerden gelen sürtünme sesi ve disklerin çabuk eğilmesi sonucu titreme."
            },
            {
                id: 3,
                title: "Trim Sesleri (Konsol)",
                severity: "low",
                reportCount: 8,
                description: "Özellikle orta konsol ve ekran çevresinden gelen gıcırtı sesleri (piyano siyahı parçalar)."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 17,
        brand: "Chery",
        model: "Omoda 5 1. Nesil (2023-2025)",
        year: "2023-2025",
        ncapStars: 5,
        ncapYear: "2022",
        dnaScore: 76,
        strengths: [
            "Fütüristik ve Dikkat Çekici SUV Coupe Tasarımı",
            "Fiyat/Performans Şampiyonu",
            "Zengin Güvenlik Donanımı (Euro NCAP 5 Yıldız)",
            "Sesli Komut Sistemi ve Teknoloji",
            "Canlı ve Atak Motor (183 HP)"
        ],
        weaknesses: [
            "Vasat Yakıt Tüketimi (Şehir içi 10-11 Litre)",
            "Küçük Bagaj Hacmi (Tasarım kurbanı)",
            "Arka Görüş Açısı Kısıtlılığı",
            "Fren Pedal Hissiyatı ve Ses Problemleri",
            "Multimedya Çeviri Hataları"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Fren Sesi ve Disk Eğriliği",
                severity: "medium",
                reportCount: 6,
                description: "Frenleme esnasında metalik sürtünme sesi ve disklerde erken eğilme sonucu titreme. Servislerde değişim yapılıyor."
            },
            {
                id: 2,
                title: "Yüksek Yakıt Tüketimi",
                severity: "medium",
                reportCount: 9,
                description: "Fabrika verisinin çok üzerinde, agresif kullanımda 12-13 litreleri görebilen tüketim."
            },
            {
                id: 3,
                title: "Ayna Titremesi",
                severity: "low",
                reportCount: 6,
                description: "Yüksek hızlarda yan aynaların rüzgar etkisiyle titremesi."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 18,
        brand: "Nissan",
        model: "Qashqai J11 (2014-2021)",
        year: "2021-2025",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 78,
        strengths: [
            "e-Power Teknolojisi (Elektrikli sürüş hissi, benzinli menzili)",
            "Kaliteli ve Modern İç Mekan",
            "Sessiz Sürüş (Şehir içi elektrik modu)",
            "Gelişmiş ProPilot Güvenlik Sistemleri",
            "Konforlu Süspansiyon"
        ],
        weaknesses: [
            "e-Power Sistem Arızası (Kronik Risk)",
            "Arka Kapı Açılma Açısı (Giriş çıkış zorluğu)",
            "Multimedya Ekran Donmaları",
            "Yüksek Fiyat Etiketi",
            "Ortalama Bagaj Hacmi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "e-Power Sistem Hatası",
                severity: "high",
                reportCount: 8,
                description: "Aracın 'Sistem Hatası' verip çalışmaması veya yolda kalması. Genellikle jeneratör ünitesi veya inverter kaynaklı ciddi bir arıza."
            },
            {
                id: 2,
                title: "Ekran Donması ve Kararma",
                severity: "medium",
                reportCount: 9,
                description: "Multimedya ekranının tepki vermemesi, donması veya tamamen kararması. Yazılım güncellemesi ile bazen çözülüyor."
            },
            {
                id: 3,
                title: "Akü Zayıflığı",
                severity: "low",
                reportCount: 9,
                description: "12V akünün çabuk bitmesi sonucu aracın sistemlerinin devreye girmemesi."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 19,
        brand: "Hyundai",
        model: "Tucson NX4 4. Nesil (2020-2025)",
        year: "2021-2025",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 81,
        strengths: [
            "Cesur ve Fütüristik Tasarım (Parametrik farlar)",
            "Geniş ve Ferah İç Mekan (Aileler için ideal)",
            "Zengin Donanım (Soğutmalı koltuk, 360 kamera)",
            "Konforlu Sürüş Karakteri",
            "Güçlü Motor Seçenekleri (1.6 T-GDI 180 HP)"
        ],
        weaknesses: [
            "GPF (Benzin Partikül Filtresi) Tıkanıklığı",
            "Parlak Siyah (Piano Black) Plastikler Çabuk Çiziliyor",
            "Yüksek Yakıt Tüketimi (Benzinli versiyon)",
            "Kalkışta Titreme Sorunu (DCT)",
            "Bazı Trimlerden Gelen Sesler"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "GPF Tıkanıklığı Uyarısı",
                severity: "medium",
                reportCount: 6,
                description: "Egzoz sistemi uyarısı olarak çıkar. Özellikle sürekli kısa mesafe kullanımlarda partikül filtresi tıkanabilir. Uzun yolda yüksek devir çevirmek gerekebilir."
            },
            {
                id: 2,
                title: "Kalkışta Titreme",
                severity: "low",
                reportCount: 6,
                description: "DCT Şanzımanın kavraması kaynaklı, özellikle yokuş kalkışlarında veya 1-2 vites geçişlerinde titreme."
            },
            {
                id: 3,
                title: "Multimedya Reset",
                severity: "low",
                reportCount: 7,
                description: "Ekranın nadiren donması ve resetleme gerektirmesi."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 20,
        brand: "Kia",
        model: "Sportage NQ5 5. Nesil (2021-2025)",
        year: "2022-2025",
        ncapStars: 5,
        ncapYear: "2022",
        dnaScore: 82,
        strengths: [
            "Kavisli Dev Ekran Tasarımı (Premium his)",
            "Kaliteli Malzemeler ve İŞçilik",
            "Sessiz ve Konforlu Sürüş (Tucson'dan bir tık sert)",
            "Dikkat Çekici Dış Tasarım",
            "Geniş Arka Diz Mesafesi"
        ],
        weaknesses: [
            "DCT Şanzıman Isınma Uyarısı (Yoğun trafik)",
            "Arka Tasarımın Herkese Hitap Etmemesi",
            "Yüksek Yakıt Tüketimi (Hibrit olmayanlar)",
            "Sunroof Mekanizma Sesi",
            "Pahalı Periyodik Bakım"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DCT Şanzıman Isınması",
                severity: "medium",
                reportCount: 9,
                description: "Yoğun dur-kalk trafikte Şanzıman sıcaklık uyarısı verip kenara çekmenizi isteyebilir. Kuru kavrama handikapı."
            },
            {
                id: 2,
                title: "Sunroof Sesi",
                severity: "low",
                reportCount: 7,
                description: "Cam tavan mekanizmasından veya fitillerinden gelen tıkırtı/gıcırtı sesleri."
            },
            {
                id: 3,
                title: "PPF (Partikül Filtresi) Sorunu",
                severity: "medium",
                reportCount: 9,
                description: "Benzinli modellerde partikül filtresi tıkanıklığı uyarısı (Tucson ile ortak sorun)."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 21,
        brand: "Peugeot",
        model: "2008 2. Nesil P24 (2019-2025)",
        year: "2020-2025",
        ncapStars: 4,
        ncapYear: "2019",
        dnaScore: 77,
        strengths: [
            "Agresif 'Aslan Pençesi' Tasarım",
            "3D i-Cockpit Gösterge Paneli",
            "Kompakt Boyutlar ve Şehir İçi Pratiklik",
            "EAT8 Tam Otomatik Şanzıman (Sorunsuz)",
            "Düşük Yakıt Tüketimi (Özellikle Dizel)"
        ],
        weaknesses: [
            "Dar Arka Yaşam Alanı ve Baş Mesafesi",
            "Sert Süspansiyon (Konforu azaltıyor)",
            "Triger Kayışı Riski (1.2 PureTech)",
            "Küçük Direksiyonun Göstergeyi Perdelemesi",
            "Multimedya Ekranının Yavaşlığı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Triger Kayışı Soyulması (1.2 PureTech)",
                severity: "high",
                reportCount: 9,
                description: "Kayışın parçalanıp yağ kanalını tıkaması sonucu 'Yağ Basıncı Arızası'. Motor yatak sarmasına kadar gidebilir. Periyodik kontrol Şart."
            },
            {
                id: 2,
                title: "Yağ Eksiltme",
                severity: "medium",
                reportCount: 6,
                description: "1.2 Turbo benzinli motorlarda yağ yakma/eksiltme sorunu."
            },
            {
                id: 3,
                title: "AdBlue Depo Sorunu (Dizel)",
                severity: "high",
                reportCount: 7,
                description: "Dizel versiyonlarda AdBlue deposu/pompası arızası."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 22,
        brand: "Opel",
        model: "Astra K (2015-2021)",
        year: "2022-2025",
        ncapStars: 4,
        ncapYear: "2022",
        dnaScore: 78,
        strengths: ["Keskin tasarım (Vizor)", "Alman ergonomisi", "Yol tutuş"],
        weaknesses: ["Multimedya hızı", "Sert koltuklar", "Vasat arka görüş"],
        chronicIssues: [
            { id: 1, title: "Ekran Kararması", severity: "low", reportCount: 8, description: "Pure Panel ekran sorunları." }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 23,
        brand: "Honda",
        model: "City 7. Nesil GN (2021-2025)",
        year: "2021-2025",
        ncapStars: 4, // ASEAN NCAP 5 stars
        ncapYear: "2020",
        dnaScore: 74,
        strengths: ["Geniş iç hacim", "Ekonomik motor", "Sorunsuzluk"],
        weaknesses: ["Yalıtım zayıf", "Dar lastikler", "Bazı donanımlar eksik"],
        chronicIssues: [
            { id: 1, title: "Boya Kalitesi", severity: "medium", reportCount: 9, description: "İnce boya katmanı." }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 24,
        brand: "Volkswagen",
        model: "Polo AW 6. Nesil (2017-2025)",
        year: "2018-2025",
        ncapStars: 5,
        ncapYear: "2017",
        dnaScore: 79,
        strengths: [
            "Sınıfının En Olgun Sürüş Karakteri (Golf'e yakın)",
            "Yüksek Malzeme Kalitesi (Yumuşak ön konsol)",
            "İkinci Elde Altın Bilezik (Değer kaybetmez)",
            "Verimli ve Performanslı 1.0 TSI Motor",
            "Geniş İç Hacim (B segmenti liderlerinden)"
        ],
        weaknesses: [
            "DSG Şanzıman Riski (Kavrama titremesi)",
            "Yüksek Bakım ve Parça Maliyetleri",
            "Sert Süspansiyon (Trim sesine neden olabilir)",
            "Pahalı Opsiyon Listesi (Baz model boş)",
            "Start-Stop Sisteminin Sarsıntılı Çalışması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Kavrama Titremesi",
                severity: "medium",
                reportCount: 7,
                description: "Özellikle 2. vites geçişlerinde kararsızlık ve titreme. Yoğun trafikte manüel modda kullanılması önerilir."
            },
            {
                id: 2,
                title: "Klima Kompresör Sesi",
                severity: "low",
                reportCount: 7,
                description: "Klima açıldığında motordan gelen uğultu veya vınlama sesi."
            },
            {
                id: 3,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Sert süspansiyon nedeniyle bozuk yollarda B sütunu ve konsoldan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 25,
        brand: "Citroen",
        model: "C4 X 1. Nesil (2022-2025)",
        year: "2023-2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 75,
        strengths: [
            "Uçan Halı Konforu (Progressive Hydraulic Cushions)",
            "Geniş ve Derin Bagaj (Sedan Pratikliği)",
            "Özgün ve Dikkat Çekici Fastback Tasarım",
            "Yüksek Oturuş Pozisyonu (SUV Hissi)",
            "Ekonomik 1.2 PureTech ve Elektrikli (ë-C4 X) Seçenekleri"
        ],
        weaknesses: [
            "Tablet Ekran Sorunları (Yavaşlık ve donma)",
            "Yumuşak Fren Hissi (Dozajlama alışkanlık ister)",
            "Yatık Arka Cam Nedeniyle Kısıtlı Görüş",
            "Süspansiyon Çalışma Sesi (Lokurtu)",
            "Baz Paketlerdeki Malzeme Kalitesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Tablet Ekran Kararması",
                severity: "medium",
                reportCount: 8,
                description: "Multimedya ekranının sürüş esnasında siyah olması, donması veya 'Hello Citroen' asistanının çalışmaması. Yazılım güncellemesi ile düzeliyor."
            },
            {
                id: 2,
                title: "Süspansiyon Sesi (Lokurtu)",
                severity: "low",
                reportCount: 6,
                description: "Özellikle tümsek geçişlerinde arka süspansiyondan gelen tok 'lok lok' sesi. Amortisör yapısı kaynaklı karakteristik bir durum."
            },
            {
                id: 3,
                title: "AdBlue Uyarısı",
                severity: "medium",
                reportCount: 6,
                description: "Dizel versiyonlarda AdBlue sistemi arızası veya yanlış seviye uyarısı."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 26,
        brand: "Skoda",
        model: "Octavia NX 4. Nesil (2020-2025)",
        year: "2020-2025",
        ncapStars: 5,
        ncapYear: "2019",
        dnaScore: 83,
        strengths: [
            "Devasa Bagaj Hacmi (Liftback avantajı)",
            "Simply Clever Çözümler (Şemsiye, buz kazıyıcı)",
            "Ferah ve Geniş İç Mekan",
            "Kaliteli ve Modern Kokpit",
            "Düşük Yakıt Tüketimi (e-TEC Hibrit)"
        ],
        weaknesses: [
            "Yazılım ve Multimedya Hataları (Kronik)",
            "SOS Acil Çağrı Sistemi Arızası",
            "DSG Şanzıman Kararsızlığı (Düşük hızda)",
            "Süspansiyon Sesi (Torsion çubuklu modellerde)",
            "Yüksek Fiyat Politikası"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yazılım Hataları ve SOS Arızası",
                severity: "medium",
                reportCount: 6,
                description: "Golf 8 ile benzer platformu paylaştığı için yazılım hataları (ekran donması, asistan hataları) ve 'SOS arızası' uyarısı yaygındır."
            },
            {
                id: 2,
                title: "Vites Seçici (Shift-by-wire) Hatası",
                severity: "low",
                reportCount: 9,
                description: "Küçük vites mandalının bazen tepki vermemesi veya 'Aracı P konumuna alın' uyarısı."
            },
            {
                id: 3,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Özellikle kapı tutamaklarından ve B sütunundan gelen gıcırtı sesleri."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 27,
        brand: "Skoda",
        model: "Superb B8 3. Nesil (2015-2023)",
        year: "2015-2025",
        ncapStars: 5,
        ncapYear: "2015",
        dnaScore: 86,
        strengths: [
            "Makam Aracı Konforu ve Prestiji",
            "İnanılmaz Arka Diz Mesafesi (Bacak bacak üstüne atılır)",
            "Devasa Bagaj (Sınıf lideri)",
            "Tok ve Güvenli Sürüş Hissi",
            "Güçlü 1.5 TSI ve 2.0 TDI Motorlar"
        ],
        weaknesses: [
            "DSG Şanzıman Hassasiyeti (Mekatronik)",
            "Dış Krom Çıtaların Solması",
            "Süspansiyonun Kasislerde Ses Yapması",
            "Büyük Boyutlar Nedeniyle Park Sorunu",
            "Yüksek Bakım Maliyetleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Krom Çıta Solması",
                severity: "low",
                reportCount: 8,
                description: "Cam çevresindeki krom çıtaların zamanla matlaşması ve lekelenmesi. Garantiden değişim zor olabiliyor."
            },
            {
                id: 2,
                title: "DSG Mekatronik Arızası",
                severity: "high",
                reportCount: 9,
                description: "Volkswagen grubunun klasik sorunu. Vites geçişlerinde vuruntu veya 'Şanzıman Hatası' uyarısı. Maliyetli olabilir."
            },
            {
                id: 3,
                title: "Amortisör Takoz Sesi",
                severity: "low",
                reportCount: 8,
                description: "Kasis geçişlerinde ön takımdan gelen gıcırtı sesi."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 28,
        brand: "Chery",
        model: "Tiggo 7 Pro 1. Nesil (2023-2025)",
        year: "2023-2025",
        ncapStars: 5,
        ncapYear: "2023",
        dnaScore: 77,
        strengths: [
            "Fiyat/Performans Dengesi (C-SUV boyutunda B-SUV fiyatı)",
            "Zengin Donanım (Panoramik cam tavan standart)",
            "Şık ve Modern Tasarım",
            "360 Derece Kamera Kalitesi",
            "Geniş Arka Yaşam Alanı"
        ],
        weaknesses: [
            "Yüksek Yakıt Tüketimi (Şehir içi 10-11 Litre)",
            "Şanzıman Kararsızlığı (Düşük hızda vuruntu)",
            "Multimedya Donmaları ve Çeviri Hataları",
            "Yetersiz Servis Ağı",
            "Yumuşak Süspansiyon (Virajda yatma)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yüksek Yakıt Tüketimi",
                severity: "medium",
                reportCount: 8,
                description: "Kullanıcıların en büyük Şikayeti. Fabrika verisinin üzerinde, agresif kullanımda 12 litreleri görebiliyor."
            },
            {
                id: 2,
                title: "Şanzıman Isınması/Vuruntu",
                severity: "low",
                reportCount: 7,
                description: "Yoğun trafikte Şanzıman ısınma uyarısı veya vites geçişlerinde (özellikle 1-2) sarsıntı."
            },
            {
                id: 3,
                title: "Multimedya Donması",
                severity: "low",
                reportCount: 9,
                description: "Apple CarPlay bağlantı kopması veya ekranın tamamen donması."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 29,
        brand: "Seat",
        model: "Leon KL 4. Nesil (2020-2025)",
        year: "2020-2025",
        ncapStars: 5,
        ncapYear: "2020",
        dnaScore: 80,
        strengths: [
            "Genç ve Sportif Tasarım (Matrix LED)",
            "Dinamik Sürüş Karakteri (Sınıfının en iyisi)",
            "Geniş ve Modern İç Mekan",
            "Güçlü Motor Seçenekleri (eTSI)",
            "Yüksek Donanım Seviyesi (FR Paket)"
        ],
        weaknesses: [
            "Dokunmatik Klima Kontrolü (Ergonomi sorunu)",
            "Yazılım ve SOS Hataları (Kronik)",
            "Sert Plastik Malzeme (Alt kısımlar)",
            "DSG Şanzıman Hassasiyeti",
            "Yol Sesi (110 km/s üzeri)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "SOS Acil Çağrı Hatası",
                severity: "high",
                reportCount: 6,
                description: "Gösterge panelinde sürekli yanan 'SOS Arızası' uyarısı. Golf 8 ile ortak kronik sorun. Yazılım veya modül değişimi gerekiyor."
            },
            {
                id: 2,
                title: "Multimedya Resetleme",
                severity: "medium",
                reportCount: 8,
                description: "Ekranın kendi kendine kapanıp açılması, donması. Yazılım güncellemesi ile düzelme ihtimali var."
            },
            {
                id: 3,
                title: "Arka Stop Çatlaması",
                severity: "low",
                reportCount: 6,
                description: "Boydan boya uzanan arka led stop lambasında kılcal çatlamalar oluşması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 30,
        brand: "Tesla",
        model: "Model Y 1. Nesil (2020-2025)",
        year: "2022-2025",
        ncapStars: 5,
        ncapYear: "2022",
        dnaScore: 88,
        strengths: [
            "Rakipsiz Performans ve Hızlanma (Performance: 0-100 3.7sn)",
            "Dünyanın En Gelişmiş Şarj Ağı (Supercharger)",
            "Sürekli Güncellenen Yazılım (OTA) ile Yeni Özellikler",
            "Geniş İç Hacim ve Devasa Cam Tavan",
            "Minimalist ve Teknoloji Odaklı İç Mekan",
            "Sınıfının En Güvenli Araçlarından Biri (Euro NCAP)"
        ],
        weaknesses: [
            "Sert Süspansiyon (Arka yolcular için konforsuz olabilir)",
            "İŞçilik ve Montaj Hataları (Panel açıklıkları)",
            "Yetersiz Servis Ağı (İstanbul/Ankara dışında zorluk)",
            "Phantom Braking (Otopilotun gölgeye fren yapması)",
            "Cam Tavanın Yazın İçeriyi Fazla Isıtması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Phantom Braking (Hayalet Fren)",
                severity: "high",
                reportCount: 6,
                description: "Otopilot veya hız sabitleyici açıkken, araç gölgeyi veya tünel girişini engel sanıp aniden sert fren yapabiliyor. Arkadan gelen araç için risk oluşturabilir."
            },
            {
                id: 2,
                title: "Montaj ve Panel Açıklıkları",
                severity: "low",
                reportCount: 7,
                description: "Kapı, bagaj veya kaput aralıklarının eşit olmaması (Panel Gaps). Berlin üretimi araçlarda azalsa da hala görülebiliyor."
            },
            {
                id: 3,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Sessiz elektrik motoru nedeniyle kabin içindeki en ufak tıkırtı (emniyet kemeri, koltuk kızakları) duyulabiliyor."
            },
            {
                id: 4,
                title: "Süspansiyon Sertliği",
                severity: "medium",
                reportCount: 9,
                description: "Özellikle 2022-2023 modellerde süspansiyon oldukça sert. 20 cm jantlı Performance modellerde konfor daha da azalıyor."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 31,
        brand: "Hyundai",
        model: "i20 2. Nesil GB (2014-2020)",
        year: "2014-2020",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 77,
        strengths: [
            "Performanslı ve Dayanıklı Dizel Motor (90 Beygir, 240 Nm Tork)",
            "Uzun Ömürlü Mekanik Altyapı (Sanayi yüzü göstermeyen sorunsuzluk)",
            "Ferah İç Mekan ve Cam Tavan (Sınıf standartlarını aşan diz mesafesi)",
            "Sade ve Kullanışlı Yaşam Alanı (Geniş saklama alanları ve ergonomik dizayn)"
        ],
        weaknesses: [
            "Sert Süspansiyon Karakteri (Yol bozukluklarını net hissettiriyor)",
            "Yalıtım Zayıflığı (100 km/s üzeri yol ve rüzgar sesi)",
            "Sert Plastik Malzeme Kalitesi (Kapı içleri ve göğüste ekonomi sınıfı hissi)",
            "Ağır Kasa / Şehir İçi Tüketimi (1.4 CRDi yoğun trafikte emsallerine göre yüksek kalabiliyor)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DPF ve EGR Tıkanması",
                severity: "high",
                reportCount: 7,
                description: "Sürekli şehir içi ve düşük devir kullanımında DPF'nin kurum bağlaması. Çekiş düşüklüğü, artan yakıt tüketimi ve motor arıza lambasıyla kendini belli eder. Yüksek devirli uzun yol kullanımı ile temizlenmesi gerekir."
            },
            {
                id: 2,
                title: "Direksiyon Derisi Soyulması",
                severity: "medium",
                reportCount: 9,
                description: "Düşük kilometrelerde bile direksiyon simidinde erken aşınma ve bölgesel soyulmaların başlaması. Özellikle güneşe maruz kalan araçlarda daha sık görülür."
            },
            {
                id: 3,
                title: "Motor Kulağı Yıpranması / Kabin Titreşimi",
                severity: "medium",
                reportCount: 9,
                description: "Kilometre ilerledikçe motor takozlarının özelliğini yitirmesi sonucu rölantideyken dizel motorun titreşiminin kabin içine, direksiyona ve pedallara fazlaca yansıması."
            },
            {
                id: 4,
                title: "Turbo Hortumu Terlemesi",
                severity: "low",
                reportCount: 9,
                description: "Yüksek kilometreli araçlarda turbo borularında yağ terlemesi veya ufak basınç kaçakları oluşması. İvmelenme esnasında ekstra ıslık sesiyle fark edilebilir."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 32,
        brand: "Hyundai",
        model: "i30 2. Nesil GD (2012-2017)",
        year: "2012-2017",
        ncapStars: 5,
        ncapYear: "2012",
        dnaScore: 79,
        strengths: [
            "C Segmentinde Zirve Donanım (Elite pakette devasa panoramik cam tavan, anahtarsız çalıştırma, gizli kamera, viraj aydınlatma)",
            "Bağımsız Arka Süspansiyon (Multi-Link ile virajlarda üst düzey yol tutuş ve arka yolcular için harika konfor)",
            "Güçlü ve Çekişli Motor (128 HP / 260 Nm veya makyajlı kasada 136 HP / 300 Nm canlı performans)",
            "Ferah ve Kaliteli Yaşam Alanı (Yumuşak plastik dokusu, diz mesafesi genişliği ve sınıf üstü ses yalıtımı ile premium his)"
        ],
        weaknesses: [
            "Dizel İçin Yüksek Yakıt Tüketimi (1.4 ton kasa ve eski tip 6 ileri tam otomatik ile şehir içi 8-9 litre bandı; DCT'de 1-1.5L daha az)",
            "Alçak Karoser ve Alt Sürtme Riski (Ön yüzün ve karterin yere çok yakın tasarımı nedeniyle kasis ve otoparklarda sürtme riski)",
            "Ağır Kasa Hissiyatı (Motor güçlü olsa da ilk kalkış ve ani direksiyon tepkilerinde gemivari hantallık hissi)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Direksiyon Tıkırtı Burcu (Yıldız / EPS) Boşluğu",
                severity: "high",
                reportCount: 9,
                description: "Elektrikli direksiyon motorunun (EPS) içindeki plastik yıldız burcun zamanla aşınıp ufalanması sonucu, bozuk yollarda direksiyon kutusundan kabine belirgin bir 'tık tık tık' ses gelmesi. Uygun maliyetli burç değişimiyle çözülür."
            },
            {
                id: 2,
                title: "DCT Şanzıman Titremesi (2015 Sonrası)",
                severity: "medium",
                reportCount: 6,
                description: "2015 yılı makyajıyla gelen 7 ileri DCT şanzımanlarda, yoğun dur-kalk trafiğinde kavramanın ısınıp uyarı vermesi veya yokuşlarda 1'den 2'ye geçerken kavrama titremesi."
            },
            {
                id: 3,
                title: "Geri Görüş Kamerası Mekanizma Takılması",
                severity: "medium",
                reportCount: 6,
                description: "Bagaj kapağındaki Hyundai logosunun arkasında gizli kameranın, toz/pislik girmesi veya mekanik dişli sıyırması sebebiyle takılı kalıp açılmaması ya da kapanmaması durumu."
            },
            {
                id: 4,
                title: "Panoramik Cam Tavan Esneme Sesi",
                severity: "medium",
                reportCount: 8,
                description: "Elite paketlerdeki büyük cam tavanın fitillerinin kuruması veya ağır kasanın esnemesi sebebiyle çapraz kasis geçişlerinde tavandan gıcırtı ve çıtırtı sesleri gelmesi. Silikon spreyi ile çözülebilir."
            },
            {
                id: 5,
                title: "Direksiyon Derisi Soyulması",
                severity: "low",
                reportCount: 8,
                description: "Araç kapalı garajda muhafaza edilmediyse, direksiyon simidindeki suni deri kaplamanın el teri ve güneşe bağlı olarak erken kilometrelerde soyulmaya ve matlaşmaya başlaması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 33,
        brand: "Audi",
        model: "TT 2. Nesil Mk2 (2006-2014)",
        year: "2006-2014",
        dnaScore: 75,
        strengths: [
            "Zamana Meydan Okuyan Tasarım (Yuvarlak hatlar, agresif farlar ve aktif arka spoyler ile havalı duruş)",
            "Alüminyum Uzay Kafesi - ASF (Hafif, dengeli ve çok rijit gövde yapısı)",
            "Tatmin Edici Performans (2.0 TFSI 200 HP motor ve S tronic kombinasyonu ile muazzam ivmelenme)",
            "Dinamik Yol Tutuş (Özellikle Quattro versiyonlarında çok yüksek viraj limitleri)",
            "Sürücü Odaklı İç Mekan (Kesik spor direksiyon, deri/alcantara koltuklar ve premium his)"
        ],
        weaknesses: [
            "Korkutucu Yağ Tüketimi (TFSI motorların karakteristik bir özelliği olarak motorun fazla yağ yakması)",
            "Sert Sürüş Karakteri (İnce yanak lastikler ve spor süspansiyonlar sebebiyle konforun ikinci planda olması)",
            "İşlevsiz Arka Koltuklar (Arka bölümün bir yetişkinin sığması için imkansız, sadece eşya koymaya yarayan bir alan olması)",
            "Bilinçsiz Kullanıcı Faktörü (Türkiye'deki araçların hor kullanılmış, yazılım atılmış ve temizini bulmanın zorluğu)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Piston Segmanı / Aşırı Yağ Yakma Sorunu",
                severity: "high",
                reportCount: 9,
                description: "Özellikle 2009-2011 arası üretilen 1.8 ve 2.0 TFSI (EA888 kodlu) motorların hatalı tasarlanan yağ segmanları nedeniyle 1000 kilometrede 1 litreye varan yağ eksiltmesi. Genellikle motorun açılıp revize edilmiş segman ve pistonlarla toplanması gerekir."
            },
            {
                id: 2,
                title: "S tronic (DSG) Mekatronik ve Kavrama Yıpranması",
                severity: "high",
                reportCount: 9,
                description: "Hor kullanılmış veya yazılımla torku yükseltilmiş araçlarda çift kavramanın erken bitmesi veya mekatronik beyninin arıza vermesi. Vites geçişlerinde kararsızlık, vuruntu ve silkeleme ile kendini belli eder."
            },
            {
                id: 3,
                title: "PCV Valfi ve Bobin Arızaları",
                severity: "medium",
                reportCount: 7,
                description: "Karter havalandırma (PCV) valfinin içindeki diyaframın zamanla yırtılması sonucu aracın rölantisinin dalgalanması, ıslık sesi çıkarması ve yağ yakımının artması."
            },
            {
                id: 4,
                title: "Arka Stop Lambası Şasi Problemi",
                severity: "low",
                reportCount: 8,
                description: "Arka stop lambalarının duy soketlerindeki toprak (şasi) hattının zayıf olması sebebiyle zamanla ısınarak soketin erimesi. Genelde ek bir şasi kablosu çekilerek ucuza çözülür."
            },
            {
                id: 5,
                title: "Cam Krikosu ve Şalter Arızaları",
                severity: "low",
                reportCount: 6,
                description: "Kapı açıldığında camı bir miktar aşağı indiren mekanizmanın zamanla bozulması veya cam krikosu tellerinin koparak camın kapı içinde düşmesi."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 34,
        brand: "Renault",
        model: "Clio 4. Nesil (2012-2019)",
        year: "2012-2019",
        ncapStars: 5,
        ncapYear: "2012",
        dnaScore: 76,
        strengths: [
            "Sportif ve Zamansız Tasarım (Arka kapı kollarının C sütununa gizlenmesiyle tek kapı hissi ve kaslı görünüm)",
            "Rakipsiz Yakıt Ekonomisi (1.5 dCi motorun şehir içi 4.5-5L, uzun yolda 3.5-4L yakması)",
            "Yaygın Servis ve Yedek Parça Ağı (Türkiye üretimi avantajıyla çok uygun yürütme maliyeti ve bakkalda bile bulunabilen parçalar)",
            "İkinci El Değeri (Çok hızlı ve değer kaybetmeden aynı gün nakde çevrilebilen altın gibi piyasa)",
            "Bass Reflex Ses Sistemi (Segmentine göre oldukça başarılı akustik ve bas performansı)"
        ],
        weaknesses: [
            "Vasat Malzeme Kalitesi (Ön konsol ve kapı içlerinde çizilmeye çok müsait sert plastik malzeme kullanımı)",
            "Yalıtım Problemleri (İnce camlar ve zayıf yalıtım sebebiyle 90-100 km/s hızdan sonra kabine ciddi yol, lastik ve rüzgar sesi alması)",
            "Dar Arka Yaşam Alanı (Sportif tavan eğimi nedeniyle arka koltukların basık ve klostrofobik hissettirmesi)",
            "Zayıf Aydınlatma (Makyaj öncesi - Faz 1 modellerde halojen farların gece aydınlatma performansının yetersizliği)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Rüzgar Sesi ve Fitil Problemi",
                severity: "high",
                reportCount: 8,
                description: "Clio 4'ün en meşhur kronik sorunudur. Ön kelebek camlarından, ayna diplerinden ve kapı fitillerinden 90 km/s hızdan itibaren kabine belirgin ıslık/rüzgar sesi girmesi. Genelde ekstra fitil uygulaması ile çözülür."
            },
            {
                id: 2,
                title: "EDC Şanzıman Beyni ve Kavrama Sorunları",
                severity: "high",
                reportCount: 9,
                description: "Otomatik vitesli (EDC çift kavrama) versiyonlarda, yoğun dur-kalk trafikte kavramanın çabuk ısınarak silkeleme yapması ve şanzıman beyninin (TCM) lehim atarak arıza vermesi durumu."
            },
            {
                id: 3,
                title: "Ön Takım ve Süspansiyon Sesleri",
                severity: "medium",
                reportCount: 8,
                description: "Süspansiyonların sertliği sebebiyle viraj demir uç lastikleri, Z rotlar ve amortisör takozlarının erken yıpranması, çukurlarda ön takımdan lok lok vuruntu sesleri gelmesi."
            },
            {
                id: 4,
                title: "Direksiyon ve Vites Topuzu Soyulması",
                severity: "medium",
                reportCount: 9,
                description: "Özellikle Touch ve Joy paketlerde kullanılan suni deri direksiyon simidinin ve vites topuzu nikelajının el terine dayanamayıp 40-50 bin kilometrelerde soyulup dökülmeye başlaması."
            },
            {
                id: 5,
                title: "MediaNav Multimedya Çökmeleri",
                severity: "low",
                reportCount: 9,
                description: "Dokunmatik ekranlı MediaNav sisteminin ara sıra logoda takılı kalması, donması veya Bluetooth bağlantısının kopması. Çoğu zaman yazılım güncellemesi ile düzeltilebilmektedir."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 101,
        brand: "Tofaş",
        model: "Şahin / Doğan (1988-2002)",
        year: "1988-2002",
        dnaScore: 60,
        strengths: [
            "Türkiye Şartlarına Uygunluk (Her usta anlar, yedek parça bakkalda bile var)",
            "Ucuz Yürütme Maliyeti (Bakım ve parça fiyatları bedavadan hallice)",
            "Arkadan İtişli Sürüş Keyfi (Yanlama potansiyeli)",
            "Geniş İç Mekan ve Bagaj (Klasik sedan avantajı)"
        ],
        weaknesses: [
            "Güvenlik Zafiyeti (Hava yastığı yok, ABS yok, kaza anında katlanma riski yüksek)",
            "Konfor Eksikliği (Yol sesi, rüzgar sesi ve titreşim fazladır)",
            "Klima Eksikliği (Çoğu modelde klima bulunmaz, olanlar da pek soğutmaz)",
            "Korozyon / Çürüme Riski (Kaporta paslanmaya müsaittir)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Kaporta Çürümesi",
                severity: "high",
                reportCount: 8,
                description: "Özellikle kapı altları, çamurluk ağızları ve taban sacında paslanma ve çürüme sıklıkla görülür."
            },
            {
                id: 2,
                title: "Hararet Sorunu",
                severity: "high",
                reportCount: 6,
                description: "Soğutma sisteminin (radyatör, fan müşürü) zayıflığı nedeniyle özellikle yaz aylarında hararet yapma eğilimi yüksektir."
            },
            {
                id: 3,
                title: "Diferansiyel Ötmesi",
                severity: "medium",
                reportCount: 6,
                description: "Arkadan itişli sistemdeki diferansiyelden belirli bir hızdan sonra 'uğultu' şeklinde ses gelmesi."
            },
            {
                id: 4,
                title: "Torpido Çatlaması",
                severity: "low",
                reportCount: 7,
                description: "Güneşe maruz kalan ön göğüs (torpido) plastiğinin zamanla çatlaması kroniktir."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 102,
        brand: "Fiat",
        model: "Linea (2007-2015)",
        year: "2007-2015",
        dnaScore: 72,
        strengths: [
            "Piyasanın En Geniş Bagajlarından Biri (500 Litre)",
            "Çok Uygun Yedek Parça ve Servis Ağı",
            "1.3 Multijet Motorun Efsane Yakıt Ekonomisi",
            "İkinci Elde Anında Satılabilirlik"
        ],
        weaknesses: [
            "Güvenlik Zafiyeti ve Zayıf Şasi Hissi",
            "Malzeme Kalitesi (Ön konsol ve kapılarda sert/ucuz plastik)",
            "Süspansiyon Konforsuzluğu",
            "Yol Sesi ve Rüzgar Sesi Yalıtımı Yetersiz"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Ön Takım (Amortisör Takozu) Sesi",
                severity: "medium",
                reportCount: 8,
                description: "Ön takımdan esnemelerde ve tümseklerde lokurtu gelmesi Linea'nın en belirgin kroniklerinden biridir."
            },
            {
                id: 2,
                title: "Göğüs (Torpido) Çatlaması",
                severity: "high",
                reportCount: 9,
                description: "Özellikle yolcu hava yastığı bölgesinde güneşe maruz kalmaktan dolayı torpido plastiğinde boydan boya çatlak oluşması."
            },
            {
                id: 3,
                title: "Direksiyon Şehir Modu (City) Arızası",
                severity: "high",
                reportCount: 7,
                description: "City modunun devreden çıkıp direksiyonun aniden sertleşmesi ve direksiyon açı sensörü arızası vermesi."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 103,
        brand: "Renault",
        model: "Symbol (2013-2021)",
        year: "2013-2021",
        dnaScore: 74,
        strengths: [
            "Sınıf Lideri Yakıt Tüketimi (1.5 dCi ile Şehir içi 4.5-5L)",
            "Esnek ve Dayanıklı Alt Yapı (Köy yolları ve ticari kullanım için ideal)",
            "Devasa Bagaj Hacmi (510 Litre)",
            "İkinci El Piyasasında Tam Bir Nakit Karşılığı"
        ],
        weaknesses: [
            "Dacia Altyapısı Nedeniyle Düşük Malzeme Kalitesi",
            "Zayıf Ses Yalıtımı (Yüksek hızlarda aşırı gürültü)",
            "Koltuk Konforsuzluğu (Uzun yolda yorucu)",
            "Geri Görüş Açısının Zayıf Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Rüzgar ve Kapı Fitili Sesi",
                severity: "high",
                reportCount: 6,
                description: "Kapı fitillerinin zayıflığından dolayı 90 km/s hızdan sonra kabin içerisine şiddetli rüzgar sesi alması."
            },
            {
                id: 2,
                title: "Direksiyon Kutusu Tıkırtısı",
                severity: "medium",
                reportCount: 8,
                description: "Bozuk yollarda direksiyon milinden veya kutusundan gelen mekanik tıkırtı sesi."
            },
            {
                id: 3,
                title: "Korna Butonu Arızası",
                severity: "low",
                reportCount: 8,
                description: "Sinyal kolu üzerindeki korna butonunun içten kablo kopması nedeniyle çalışmaması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 104,
        brand: "Hyundai",
        model: "Accent Era (2006-2012)",
        year: "2006-2012",
        dnaScore: 76,
        strengths: [
            "1.5 CRDi Motorun İnanılmaz Çekişi (110 HP / 235 Nm)",
            "Taksi Çıkması Bile Çalışan Mükemmel Dayanıklılık",
            "Ferah ve Kullanışlı İç Mekan",
            "Sorunsuz Otomatik Şanzıman Seçeneği"
        ],
        weaknesses: [
            "Yüksek Yakıt Tüketimi (Otomatik ve Benzinli versiyonlarda)",
            "Güvenlik Donanımı Eksikliği (Çoğu pakette tek hava yastığı, ABS yokluğu)",
            "Yol Tutuş Zafiyeti (Hızlı virajlarda arkadan kayma eğilimi)",
            "İnce Boya ve Korozyona Yatkınlık"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "EPS (Elektrikli Direksiyon) Tıkırtısı",
                severity: "high",
                reportCount: 6,
                description: "Direksiyon motorunun içindeki plastik yıldız burcun parçalanarak direksiyonu çevirirken 'tık tık' etmesi."
            },
            {
                id: 2,
                title: "Amortisör Vuruntusu",
                severity: "medium",
                reportCount: 8,
                description: "Süspansiyon sisteminin kısa stroklu olmasından dolayı çukurlarda dibe vurup kütleme sesi yapması."
            },
            {
                id: 3,
                title: "Klima Yönlendirme Dişlisi Kırılması",
                severity: "low",
                reportCount: 7,
                description: "Hava yönünü öncama veya ayaklara ayarlayan mekanizmanın arkasındaki plastik dişlinin kırılıp takılı kalması."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 105,
        brand: "Honda",
        model: "Civic FD6 (2006-2012)",
        year: "2006-2012",
        dnaScore: 82,
        strengths: [
            "Zamana Meydan Okuyan Sportif ve Fütüristik Tasarım",
            "LPG'ye Tam Uyumlu Sorunsuz 1.6 i-VTEC Motor",
            "Sürüş Dinamikleri ve Harika Direksiyon Hissi",
            "İkinci El Piyasasında Üstün Değer Koruma"
        ],
        weaknesses: [
            "Yol ve Lastik Sesi (Kronik Honda yalıtım eksikliği)",
            "Sert Süspansiyon",
            "Arka Diz Mesafesinin Ortadaki Tümsek Olmamasına Rağmen Sınırlı Olması",
            "İnce Boya ve Vernik Atması Riski"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Direksiyon Kutusu Boşluğu ve Sesi",
                severity: "high",
                reportCount: 8,
                description: "Özellikle bozuk yollarda direksiyon kutusundan gelen lokurtu ve boşluk hissi. Tamir takımıyla onarılması gerekebilir."
            },
            {
                id: 2,
                title: "Motor Kulağı Çökmesi",
                severity: "medium",
                reportCount: 7,
                description: "Özellikle sağ hidrolik motor takozunun (kulağının) zamanla sönmesi/çökmesi ve motor titreşimini kasaya vermesi."
            },
            {
                id: 3,
                title: "Fren Balata/Disk Eğilmesi",
                severity: "medium",
                reportCount: 6,
                description: "Orijinal disklerin yapısı sebebiyle yüksek süratlerde fren yapıldığında direksiyonda titreme (disk yamulması)."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 106,
        brand: "Fiat",
        model: "Doblo 3. ve 4. Nesil (2010-2023)",
        year: "2010-2023",
        dnaScore: 78,
        strengths: [
            "Geniş Aileler ve Ticaret İçin Rakipsiz İç Hacim",
            "Bağımsız Arka Süspansiyon (Ticari araçlar içinde en iyi yol tutuş ve konfor)",
            "Güçlü ve Sorunsuz 1.6 Multijet (105 HP / 290 Nm veya 120 HP)",
            "Çok Fonksiyonlu Kullanım (Hem iş hem aile arabası)"
        ],
        weaknesses: [
            "Büyük Kasa Nedeniyle Yüksek Yakıt Tüketimi (Şehir içi)",
            "Rüzgar Sesi ve Kutu Tasarımdan Kaynaklı Aerodinamik Zayıflık",
            "Ağır Kasa Nedeniyle 1.3 Multijet Versiyonların Bayılması",
            "Ticari Ruhsatlıysa Her Yıl Muayene Derdi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Arka Kapı / Sürgülü Kapı Sesleri",
                severity: "medium",
                reportCount: 9,
                description: "Büyük sürgülü kapıların mekanizmalarının ve fitillerinin zamanla ayar kaçırması, kasislerde gacır gucur ses yapması."
            },
            {
                id: 2,
                title: "Boya Dökülmesi / Vernik Atması",
                severity: "high",
                reportCount: 6,
                description: "Bazı üretim yıllarında (özellikle beyaz ve gri) tavan ve kaput bölgelerinde durduk yere boya kabarması ve vernik atması."
            },
            {
                id: 3,
                title: "Amortisör Takozu Sesi",
                severity: "medium",
                reportCount: 7,
                description: "Ağır kasa sebebiyle ön amortisör takozlarının erken ömrünü tamamlayıp direksiyon çevirirken veya kasiste lokurtu yapması."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 107,
        brand: "Renault",
        model: "Megane 2 (2002-2008)",
        year: "2002-2008",
        dnaScore: 68,
        strengths: [
            "Döneminin Ötesinde Tasarım (Özellikle HB kasanın 'ütü' tasarımı)",
            "Mükemmel Süspansiyon Konforu (Pamuk gibi yolculuk)",
            "Kartlı Çalıştırma Sistemi (Dönemi için çok yenilikçi)",
            "Geniş İç Hacim ve Aileye Uygunluk"
        ],
        weaknesses: [
            "Elektronik Sistemlerin Fazla Narin Olması",
            "Yaşlanan Plastiklerin Çabuk Kırılması (Özellikle iç kapı kolları soyulması)",
            "Direksiyon Kutusunun Zayıflığı",
            "Cam Krikosu Mekanizmalarının Sık Bozulması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Kart Okunamadı Hatası",
                severity: "high",
                reportCount: 7,
                description: "Anahtar kartının içindeki lehimlerin zamanla kırılması sonucu aracın kartı tanımaması ve çalışmaması. Kartın tamiri veya yenilenmesi gerekir."
            },
            {
                id: 2,
                title: "Direksiyon Sargısı (Airbag Sargısı) Kopması",
                severity: "high",
                reportCount: 8,
                description: "Direksiyon çevirirken 'çıt çıt' ses gelmesi ve ardından airbag lambasının yanması. Sargının kopması kroniktir."
            },
            {
                id: 3,
                title: "Cam Krikosu Tel Kopması",
                severity: "medium",
                reportCount: 6,
                description: "Özellikle ön camların krikosundaki plastik makaranın veya telin koparak camın kapı içine düşmesi."
            },
            {
                id: 4,
                title: "Torpido ve Kapı İçi Soyulmaları",
                severity: "low",
                reportCount: 9,
                description: "Kapı tutamakları, teyp tuşları ve cam açma düğmelerindeki soft-touch (yumuşak) kaplamanın yapış yapış olup dökülmesi."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 108,
        brand: "Ford",
        model: "Tourneo Courier (2014-2023)",
        year: "2014-2023",
        dnaScore: 78,
        strengths: [
            "Binek Araç Konforunda Ticari Şasi (Fiesta altyapısı)",
            "Mükemmel Yol Tutuş ve Direksiyon Hissi",
            "Şehir İçi İçin Kompakt Boyutlar",
            "Düşük Yakıt Tüketimi (1.5 TDCi)"
        ],
        weaknesses: [
            "Rakiplerine Göre (Doblo/Caddy) Daha Dar Bagaj",
            "Arka Süspansiyonların Zıplama Yapması (Boşken)",
            "Sync Multimedya Sisteminin Yavaşlığı",
            "Ticari Ruhsat (Her yıl muayene)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Sync Ekran Donması / Bluetooth Kopması",
                severity: "low",
                reportCount: 8,
                description: "Orijinal teypte telefon görüşmesi sırasında sesin gitmemesi veya teybin kitlenip akü kutup başı sökülmeden düzelmemesi."
            },
            {
                id: 2,
                title: "Direksiyon Kutusu Tıkırtısı",
                severity: "medium",
                reportCount: 8,
                description: "Bozuk ve parke taşlı yollarda direksiyon milinden gelen mekanik tıkırtı/boşluk sesi."
            },
            {
                id: 3,
                title: "Kapı Kilit Mekanizması Tutukluğu",
                severity: "low",
                reportCount: 9,
                description: "Özellikle kış aylarında sürgülü kapıların veya ön kapıların merkezi kilitle tam kapanmaması veya açılmaması."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 109,
        brand: "Dacia",
        model: "Sandero Stepway (2021-2025)",
        year: "2021-2025",
        dnaScore: 74,
        strengths: [
            "Fiyat/Performans Oranı (En ucuz B-SUV alternatifi)",
            "Yerden Yüksek Yapı (Türkiye yolları için ideal)",
            "Fabrika Çıkışlı ECO-G (LPG) Seçeneği İle İnanılmaz Ekonomi",
            "Gelişmiş Dış Tasarım (Eski nesillere göre çok daha şık)"
        ],
        weaknesses: [
            "Yalıtım Eksikliği (Yüksek hızda rüzgar ve yol sesi)",
            "Sert Plastik Yoğunluğu (İç mekanda kalite hissi düşük)",
            "X-Tronic (CVT) Şanzımanın Performansı Törpülemesi",
            "Koltuğun Yanal Desteklerinin Zayıflığı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Medya Ekranı (Media Nav) Çökmesi",
                severity: "medium",
                reportCount: 8,
                description: "Ekranın durduk yere kararması veya Apple CarPlay bağlantısının sürekli kopması. Yazılım güncellemesi gerektirir."
            },
            {
                id: 2,
                title: "Kapı Fitillerinden Su/Rüzgar Alması",
                severity: "low",
                reportCount: 6,
                description: "Özellikle ön kapı üstlerinden 100 km/s hızın üzerinde ıslık sesi gelmesi."
            },
            {
                id: 3,
                title: "Wastegate (Turbo) Şıkırtısı",
                severity: "low",
                reportCount: 7,
                description: "1.0 TCe motorlarda gaza basıp çekerken turbonun wastegate çubuğundan gelen mekanik şıkırtı sesi. Yetkili servisler 'karakteristik özellik' demektedir."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 110,
        brand: "Skoda",
        model: "Octavia A7 (2013-2020)",
        year: "2013-2020",
        dnaScore: 83,
        strengths: [
            "Devasa Bagaj Hacmi (590 Litre) ve Liftback Kapak",
            "Arka Diz Mesafesi (D Segmentini kıskandıran genişlik)",
            "Volkswagen Altyapısı (MQB platformu kalitesi)",
            "Tasarruf ve Performans Dengesi (1.6 TDI & 1.4 TSI)"
        ],
        weaknesses: [
            "Yol Sesi Yalıtımı (Özellikle arka çamurluklardan gelen uğultu)",
            "DSG Şanzıman Endişesi",
            "Sert Süspansiyon (Özellikle 17 inç jantlarla)",
            "İç Mekanda Trim Sesleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri (Özellikle Gözlük Kabı ve Kapılar)",
                severity: "low",
                reportCount: 6,
                description: "İç mekanda tavan lambası civarından ve kapı içlerinden bozuk yolda gelen çıtırtılar."
            },
            {
                id: 2,
                title: "Su Pompası (Devirdaim) Su Kaçağı",
                severity: "medium",
                reportCount: 8,
                description: "Motor ayrımı olmaksızın su pompasının contadan antifriz sızdırması ve 'Soğutma Suyu Seviyesi Düşük' uyarısı."
            },
            {
                id: 3,
                title: "Cam Düğmeleri Kromlarının Soyulması",
                severity: "low",
                reportCount: 8,
                description: "Şoför tarafındaki cam açma kapama tuşlarının uçlarındaki krom kaplamaların el kesicek şekilde soyulması."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 111,
        brand: "Volkswagen",
        model: "Polo 5. Nesil (6R/6C) (2009-2017)",
        year: "2009-2017",
        dnaScore: 81,
        strengths: [
            "Zamansız Tasarım (Hala çok modern görünüyor)",
            "Yüksek İkinci El Değeri (Altın gibi değer korur)",
            "Kaliteli İç Mekan (B segmenti için referans malzeme kalitesi)",
            "Sınıfına Göre Çok İyi Yalıtım ve Tok Kapı Sesi"
        ],
        weaknesses: [
            "Donanım Fakirliği (Comfortline pakette bile sis farı, çelik jant olmaması)",
            "Dar Arka Diz Mesafesi",
            "DSG Şanzıman Korkusu (DQ200 kuru kavrama)",
            "Pahalı Yedek Parça ve Bakım"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Bagaj Kilidi (Mandalı) Arızası",
                severity: "medium",
                reportCount: 6,
                description: "Bagaj kapağındaki VW logolu açma mekanizmasının zamanla bozulması veya içine su alıp bagajın açılmaması."
            },
            {
                id: 2,
                title: "Ön Konsol (Havalandırma) Izgara Kırılması",
                severity: "low",
                reportCount: 9,
                description: "Ön konsoldaki havalandırma yönlendirici ızgaraların plastiklerinin çok hassas olup ufak bir temasta kırılması."
            },
            {
                id: 3,
                title: "Tavan Döşemesi Sarkması",
                severity: "low",
                reportCount: 9,
                description: "Özellikle sıcak iklimlerde 10 yaşını geçen modellerde tavan kumaşının süngerden ayrılıp sarkması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 112,
        brand: "Ford",
        model: "Fiesta 6. Nesil (Mk7) (2008-2017)",
        year: "2008-2017",
        dnaScore: 79,
        strengths: [
            "Sınıfının En İyi Yol Tutuşu (Virajlarda inanılmaz dengeli)",
            "Sportif ve Dinamik Dış Tasarım",
            "Direksiyon Hissiyatı (Yolla doğrudan bağlantı hissi)",
            "Sorunsuz ve Dayanıklı Şasi Yapısı"
        ],
        weaknesses: [
            "Çok Dar Arka Yaşam Alanı",
            "Karmaşık ve Düğme Dolu Orta Konsol (Teyp tasarımı cep telefonu gibi)",
            "Sert Süspansiyon Nedeniyle Konfor Eksikliği",
            "Powershift Şanzıman Problemleri (Otomatik versiyonlarda)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Direksiyon Kutusu Tıkırtısı",
                severity: "high",
                reportCount: 6,
                description: "Ford'un kronik sorunudur. Parke taşlı yollarda direksiyon milinden gelen mekanik lokurtu ve boşluk hissi."
            },
            {
                id: 2,
                title: "Teyp (Bluetooth/USB) Modülü Arızası",
                severity: "medium",
                reportCount: 9,
                description: "Orijinal teybin Bluetooth (Sync) modülünün yanması veya takılı kalması. Telefondan ses gitmemesi."
            },
            {
                id: 3,
                title: "Kapı Fitili ve Rüzgar Sesi",
                severity: "low",
                reportCount: 6,
                description: "Özellikle otoyol hızlarında kapı üst fitillerinden içeriye rüzgar ve ıslık sesi girmesi."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 113,
        brand: "Nissan",
        model: "Qashqai 2. Nesil (J11) (2014-2021)",
        year: "2014-2021",
        dnaScore: 76,
        strengths: [
            "Türkiye'nin En Çok Satan SUV'si (Piyasası çok hızlı)",
            "Cam Tavan ve Ferah İç Mekan (Donanımlı paketlerde)",
            "Konforlu Sürüş ve Yüksek Oturma Pozisyonu",
            "Yakıt Cimrisi 1.5 dCi Motor"
        ],
        weaknesses: [
            "Malzeme Kalitesi ve Trim Sesleri",
            "X-Tronic (CVT) Şanzıman Sorunları (Özellikle benzinli modellerde)",
            "Multimedya Sisteminin Çağ Dışı ve Yavaş Olması",
            "Yüksek Otoyol Hızlarında Rüzgar Sesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Ön Takım (Salıncak ve Rotil) Sesleri",
                severity: "medium",
                reportCount: 8,
                description: "Ağır kasa sebebiyle ön salıncak burçlarının erken yıpranması ve kasislerde gıcırtı/lokurtu yapması."
            },
            {
                id: 2,
                title: "Akü Erken Bitme Sorunu",
                severity: "medium",
                reportCount: 7,
                description: "Özellikle Start-Stop sistemli modellerde fabrika çıkışı akülerin 2 yıl bile dayanmadan ölmesi."
            },
            {
                id: 3,
                title: "Klima Kompresörü Sesi",
                severity: "low",
                reportCount: 8,
                description: "Klima açıkken motordan veya havalandırmadan gelen inleme (uğultu) sesi."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 114,
        brand: "Peugeot",
        model: "208 2. Nesil (2019-2025)",
        year: "2019-2025",
        dnaScore: 82,
        strengths: [
            "Göz Kamaştıran Tasarım (Aslan dişi gündüz farları)",
            "i-Cockpit 3D (Sınıfında benzersiz teknolojik gösterge)",
            "EAT8 Şanzıman Konforu",
            "Kaliteli ve Özgün İç Mekan (Piyano tuşları, karbon görünümlü detaylar)"
        ],
        weaknesses: [
            "Dar Arka Yaşam Alanı ve Küçük Arka Kapı Açıklığı",
            "Küçük Direksiyon Simidinin Göstergeyi Kapatması (Boyunuza bağlı)",
            "Klimanın Ekrana Gömülü Olması (Sürüş esnasında kullanımı zor)",
            "Sert Süspansiyon ve Büyük Jantlarla Gelen Konforsuzluk"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Multimedya Ekran Resetlemesi",
                severity: "low",
                reportCount: 9,
                description: "Orta ekranın sürüş esnasında siyah ekrana düşüp kendi kendine yeniden başlaması."
            },
            {
                id: 2,
                title: "Amortisör Takozu Gıcırtısı",
                severity: "medium",
                reportCount: 9,
                description: "Sabahları soğuk havalarda veya kasis geçişlerinde ön süspansiyondan gelen kauçuk gıcırtısı."
            },
            {
                id: 3,
                title: "Apple CarPlay/Android Auto Bağlantı Kopması",
                severity: "low",
                reportCount: 7,
                description: "Kablolu bağlantıda bile engebeli yollarda telefon bağlantısının aniden kopması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 115,
        brand: "Toyota",
        model: "Corolla E140/E150 (2007-2012)",
        year: "2007-2012",
        dnaScore: 84,
        strengths: [
            "Ölümsüz Motor Bloğu (Düzenli bakımla milyon km devirir)",
            "LPG'ye Tam Uyumlu 1.6 Dual VVT-i Motor",
            "Yumuşak Süspansiyon ile Yüksek Konfor",
            "Mükemmel İkinci El Değeri"
        ],
        weaknesses: [
            "M-MT (MultiMode) Şanzımanın Rezalet Performansı",
            "Tasarımın Çabuk Eskimesi ve Sıkıcı Olması",
            "Sınıfına Göre Zayıf Yol Tutuş (Yumuşak süspansiyon nedeniyle)",
            "Rüzgar ve Lastik Sesi Yalıtımı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Direksiyon Kolonu Tıkırtısı",
                severity: "high",
                reportCount: 6,
                description: "Parke taşlı yollarda direksiyon kutusu içindeki plastik burcun aşınmasından dolayı gelen tıkırtı."
            },
            {
                id: 2,
                title: "Ön Göğüs (Torpido) Tıkırtısı",
                severity: "low",
                reportCount: 7,
                description: "Kış aylarında veya bozuk yollarda ön cam ile torpido birleşim yerinden gelen plastik çıtırtıları."
            },
            {
                id: 3,
                title: "Fren Diski Eğilmesi",
                severity: "medium",
                reportCount: 8,
                description: "Özellikle sert frenlemelerde disklerin çabuk ısınıp yamulması ve direksiyonda titremeye sebep olması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 116,
        brand: "Tofaş",
        model: "Kartal (1988-2002)",
        year: "1988-2002",
        dnaScore: 62,
        strengths: [
            "Devasa Bagaj Hacmi (Esnafın, boyacının, pazarcının dostu)",
            "Yük Taşıma Kapasitesi (Makaslı arka süspansiyon benzeri dayanıklılık)",
            "Ucuz Yedek Parça ve Kolay Tamir",
            "LPG'ye Tam Uyumlu"
        ],
        weaknesses: [
            "Zayıf Aerodinamik (Rüzgar tutması çok fazladır)",
            "Konforsuz ve Zıplayan Arka Süspansiyon",
            "Güvenlik Donanımı Yok (ABS, Airbag bulunmaz)",
            "Korozyon ve Çürüme"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Bagaj Kapağı Çürümesi",
                severity: "high",
                reportCount: 6,
                description: "Kartal'a özel olarak dik inen bagaj kapağının alt kısımları ve cam kenarları çok hızlı çürür."
            },
            {
                id: 2,
                title: "Diferansiyel Ötmesi",
                severity: "medium",
                reportCount: 6,
                description: "Özellikle ağır yük taşıyan Kartal modellerinde diferansiyel dişlilerinden gelen yüksek uğultu."
            },
            {
                id: 3,
                title: "Arka Silecek Motoru Arızası",
                severity: "low",
                reportCount: 7,
                description: "Bagaj kapağındaki silecek motorunun su alıp kısa devre yapması veya mekanizmasının kilitlenmesi."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 117,
        brand: "Tofaş",
        model: "Serçe / Murat 131 (1977-1994)",
        year: "1977-1994",
        dnaScore: 55,
        strengths: [
            "Klasik Araç Statüsü (Temizleri koleksiyonluk)",
            "Saf Mekanik Sürüş Hissi (Elektronik hiçbir şey yok)",
            "Aşırı Ucuz Bakım",
            "Modifiyeye Açık Alt Yapı"
        ],
        weaknesses: [
            "Günümüz Trafiğinde Yetersiz Frenler",
            "Direksiyon Çok Ağır (Hidrolik yok)",
            "Küçük İç Hacim (Kuş serisine göre daha dardır)",
            "Yazın Hararet, Kışın Isıtmama Sorunu"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Hararet Sorunu",
                severity: "high",
                reportCount: 9,
                description: "Radyatör kapasitesinin zayıflığı sebebiyle yaz aylarında yokuş çıkarken hemen hararete kalması."
            },
            {
                id: 2,
                title: "Taban Sacı Çürümesi",
                severity: "high",
                reportCount: 8,
                description: "Yaşı gereği ve yalıtım eksikliğinden aracın şoför ve yolcu ayak basma yerlerinin (taban sacı) çürümesi."
            },
            {
                id: 3,
                title: "Karbüratör Tıkanması",
                severity: "medium",
                reportCount: 9,
                description: "Mekanik karbüratörün pis yakıt veya filtre bakım eksikliğinden meme tıkayıp aracın teklemesi."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 118,
        brand: "Honda",
        model: "Civic 10. Nesil (FC5) (2016-2021)",
        year: "2016-2021",
        dnaScore: 84,
        strengths: [
            "Agresif ve Sportif Tasarım (Gençlerin ve modifiyecilerin favorisi)",
            "LPG'ye %100 Uyum (Fabrika çıkışlı LPG seçeneği - Eco Serisi)",
            "Ferah İç Mekan ve Bağımsız Arka Süspansiyon",
            "Mükemmel İkinci El Piyasası (Nakit para gibi)"
        ],
        weaknesses: [
            "Kaporta Sacının İnce Olması",
            "Yol ve Lastik Sesini İçeri Fazla Alması",
            "CVT Şanzımanın Performans Hissini Törpülemesi",
            "Orijinal Multimedya Ekranının Çok Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "C Sütunu (Arka Direk) Göçmesi",
                severity: "high",
                reportCount: 8,
                description: "FC5 kasanın en meşhur kroniğidir. Arka camın yanındaki C sütununda durduk yere gamze (göçük) oluşması. Honda bu durumu köpük sıkarak çözmeye çalıştı."
            },
            {
                id: 2,
                title: "Direksiyon Kutusu Boşluğu ve Tıkırtı",
                severity: "medium",
                reportCount: 6,
                description: "Özellikle bozuk yollarda direksiyondan gelen tıkırtı ve zamanla oluşan boşluk hissi."
            },
            {
                id: 3,
                title: "Fren Diski Yamulması",
                severity: "medium",
                reportCount: 6,
                description: "120 km/s hızlardan sert frene basıldığında direksiyonun titremesi. Disklerin ısıdan çabuk çarpılması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 119,
        brand: "Honda",
        model: "Civic 9. Nesil (FB7) (2012-2016)",
        year: "2012-2016",
        dnaScore: 86,
        strengths: [
            "Ölümsüz i-VTEC Motor Bloğu (LPG ile kusursuz uyum)",
            "Sorunsuz Tam Otomatik Şanzıman (Tork konvertörlü)",
            "Sorunsuzluk ve Sanayi Yüzü Göstermeme",
            "Konforlu Sürüş Dinamikleri"
        ],
        weaknesses: [
            "Kaba ve Demode Arka Tasarım (Bir önceki efsane FD6'ya kıyasla sevilmedi)",
            "Küçük Bagaj Hacmi (LPG tankı da gelince iyice daralır)",
            "Rüzgar ve Yol Sesi Yalıtımı",
            "Sert Frenlemelerde Zayıf Fren Hissi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Boya Dökülmesi ve Vernik Atması",
                severity: "high",
                reportCount: 8,
                description: "Özellikle beyaz renk FB7'lerde tavan, kaput ve direklerdeki verniklerin durduk yere atıp boyanın dökülmesi."
            },
            {
                id: 2,
                title: "Akü Erken Bitme Sorunu",
                severity: "low",
                reportCount: 9,
                description: "Fabrika çıkışı akü kapasitesinin (45 Amper) küçük olması sebebiyle akünün çabuk bitmesi (Genelde 55-60A ile değiştirilir)."
            },
            {
                id: 3,
                title: "Ön Cam Fitili Ses Yapması",
                severity: "low",
                reportCount: 7,
                description: "Ön camın sağ veya sol köşesindeki fitillerin 100 km/s hızın üzerinde ıslık/rüzgar sesi yapması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 121,
        brand: "Opel",
        model: "Astra J Kasa (2009-2015)",
        year: "2009-2015",
        dnaScore: 78,
        strengths: [
            "Mükemmel Dış Tasarım (Hala C segmentinin en şıklarından)",
            "Tank Gibi Ağır Kasa ve Otoyol Stabilitesi",
            "Kaliteli Ön Konsol ve İç Mekan Ambiyansı (Kırmızı ışıklandırmalar)",
            "Fiyat/Performans Olarak Donanım Zenginliği (Cosmo paket)"
        ],
        weaknesses: [
            "Aşırı Ağır Kasa (Yakıt tüketimini artırır ve performansı törpüler)",
            "Orta Konsoldaki Düğme Karmaşası (Uçak kokpiti gibi)",
            "Elektronik Arızalara Yatkınlık",
            "Dizel Versiyonlarda Motor Sesi Yalıtımı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "1.4 Turbo Piston Kırma (Segman Kırılması)",
                severity: "high",
                reportCount: 7,
                description: "Astra J'nin en büyük kabusudur. 1.4 Turbo (A14NET/B14NET) motorlarda yanlış yağ kullanımı veya zorlama sonucu piston segmanlarının kırılması. Genelde çelik subap ve forged piston ile revize edilir."
            },
            {
                id: 2,
                title: "Bobin Arızası (Ateşleme Modülü)",
                severity: "medium",
                reportCount: 7,
                description: "Özellikle 1.6 atmosferik ve 1.4 Turbo motorlarda bobinlerin ömrünün çok kısa olması, teklemeye sebep olması (Mutlaka Delphi/GM marka takılmalı)."
            },
            {
                id: 3,
                title: "Su Deposu (Genleşme Kabı) Çatlaması",
                severity: "medium",
                reportCount: 7,
                description: "Antifriz genleşme kabının plastiğinin ısınıp çatlaması ve su sızdırarak 'Soğutma Sıvısı Seviyesi' uyarısı vermesi."
            },
            {
                id: 4,
                title: "Termostat Gövdesi Kaçağı",
                severity: "high",
                reportCount: 9,
                description: "Termostatın plastik gövdesinin çatlaması veya elektronik termostatın arızalanıp fan açtırması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 122,
        brand: "Volkswagen",
        model: "Golf 7 (2012-2020)",
        year: "2012-2020",
        dnaScore: 88,
        strengths: [
            "C Segmenti Hatchback Referans Noktası (Standart belirleyici)",
            "Mükemmel Malzeme Kalitesi ve İşçilik",
            "Çok İyi Yalıtım (Hem yol hem rüzgar sesi neredeyse yok)",
            "Yüksek Sürüş Dinamikleri ve Tokluk Hissi"
        ],
        weaknesses: [
            "Yüksek Fiyat ve İkinci Elde Fiyat Şişkinliği",
            "Sıkıcı ve Kutu Gibi Muhafazakar Tasarım",
            "DSG Şanzıman Riski (DQ200 kuru kavrama)",
            "Yedek Parça ve Yetkili Servis Ücretlerinin Yüksekliği"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Kavrama ve Mekatronik Arızası",
                severity: "high",
                reportCount: 7,
                description: "DQ200 7 ileri kuru kavrama şanzımanın 1'den 2'ye geçerken titremesi (kavrama bitmesi) veya aniden vitese geçmeyerek mekatronik tüpünün patlaması."
            },
            {
                id: 2,
                title: "Cam Tavan (Sunroof) Su Alma Sorunu",
                severity: "high",
                reportCount: 6,
                description: "Cam tavanın su tahliye kanallarının tıkanması veya fitilinin çatlaması sonucu A sütunundan ve tavan lambasından içeri su girmesi."
            },
            {
                id: 3,
                title: "Devirdaim Su Pompası Kaçağı",
                severity: "medium",
                reportCount: 8,
                description: "Hem 1.2/1.4 TSI hem de 1.6 TDI motorlarda su pompasının (devirdaim) O-ring kısmından pembe antifriz sızdırması."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 123,
        brand: "Dacia",
        model: "Duster (2010-2024)",
        year: "2010-2024",
        dnaScore: 75,
        strengths: [
            "Tam Bir Fiyat/Performans Canavarı",
            "Mükemmel Arazi ve Bozuk Yol Kabiliyeti (Özellikle 4x4 versiyonlar)",
            "Çok Ucuz Yedek Parça ve Yürütme Maliyeti",
            "1.5 dCi Motorun İnanılmaz Ekonomisi"
        ],
        weaknesses: [
            "İç Mekanda Yoğun Sert Plastik ve Kalitesizlik Hissi",
            "Otoyol Hızlarında Ciddi Rüzgar ve Yol Sesi (Yalıtım zayıf)",
            "Güvenlik Donanımı ve NCAP Puanlarının Düşüklüğü",
            "Koltukların Uzun Yolda Konforsuz Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yakıt Göstergesi Yanılgısı",
                severity: "low",
                reportCount: 6,
                description: "Özellikle LPG'li ve eski dizel modellerde yakıt şamandırasının takılı kalması veya yanlış seviye göstermesi."
            },
            {
                id: 2,
                title: "Klima Borusu / Yönlendirme Arızası",
                severity: "medium",
                reportCount: 9,
                description: "Klima yönlendirme halatının (telinin) takılması sonucu havanın istenilen yöne (örn: sadece cama) verilememesi."
            },
            {
                id: 3,
                title: "Kapı Fitillerinden Su Alması",
                severity: "medium",
                reportCount: 8,
                description: "Şiddetli yağmurlarda veya basınçlı yıkamada kapı üst fitillerinden kabin içine su sızması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 124,
        brand: "Peugeot",
        model: "3008 2. Nesil (2016-2023)",
        year: "2016-2023",
        dnaScore: 83,
        strengths: [
            "Uçak Kokpitini Andıran Muazzam İç Tasarım (i-Cockpit)",
            "Agresif ve Aslan Pençesi Dış Tasarım",
            "Sınıfının En İyi Yol Tutuş - Konfor Dengesinden Biri",
            "EAT8 Tam Otomatik Şanzımanın Kusursuzluğu"
        ],
        weaknesses: [
            "Fiziksel Klima Tuşlarının Olmaması (Ekrana gömülü olması sürüşte zorluyor)",
            "Dar Arka Cam ve Kısıtlı Geri Görüş",
            "Küçük Direksiyon Simidine Herkesin Alışamaması",
            "Süspansiyonların Biraz Sesli Çalışması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Multimedya Ekranının Donması/Kapanması",
                severity: "low",
                reportCount: 7,
                description: "Sürüş esnasında orta ekranın kendi kendine kapanıp yeniden başlaması. Genelde yazılım güncellemesiyle çözülür."
            },
            {
                id: 2,
                title: "Arka Amortisör Takozu Sesi",
                severity: "medium",
                reportCount: 8,
                description: "Özellikle kasislerden çapraz geçerken arka süspansiyondan gelen 'gırç gırç' burç/kauçuk sesi."
            },
            {
                id: 3,
                title: "Kapı İçi Trim ve Titreme Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle Focal ses sistemi olan araçlarda bas vurduğunda kapı döşemelerinin zırıldaması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 125,
        brand: "Ford",
        model: "Focus 3 & 3.5 (2011-2018)",
        year: "2011-2018",
        dnaScore: 81,
        strengths: [
            "C Segmentinin Açık Ara En İyi Yol Tutuşu",
            "Direksiyon Hissi ve Sürüş Dinamikleri",
            "Kaliteli Ön Konsol ve Tok Kapı Sesi",
            "Dayanıklı Şasi ve Güvenlik (Euro NCAP 5 Yıldız)"
        ],
        weaknesses: [
            "Sınıfının En Dar Arka Diz Mesafesi",
            "Özellikle Hatchback Modelde Çok Küçük Bagaj",
            "Powershift Şanzıman Fobisi",
            "Orta Konsolun Sürücünün Dizini Sıkıştırması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Direksiyon Kutusu Tıkırtısı (Tüm Ford'ların Kaderi)",
                severity: "high",
                reportCount: 6,
                description: "Elektrikli direksiyon (EPS) motorunun veya kutu içindeki burçların boşluk yapıp bozuk yolda tıkırtı yapması."
            },
            {
                id: 2,
                title: "Kapı Fitili Düşmesi",
                severity: "low",
                reportCount: 7,
                description: "Özellikle arka kapı fitillerinin yapışkanının özelliğini yitirip aşağı doğru sarkması."
            },
            {
                id: 3,
                title: "Gösterge Paneli (Sync) Ekran Kararması",
                severity: "medium",
                reportCount: 6,
                description: "Orijinal teybin veya bilgi ekranının yazılımsal olarak kitlenip akü sökülene kadar düzelmemesi."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 126,
        brand: "Volkswagen",
        model: "Passat B8 (2015-2023)",
        year: "2015-2023",
        dnaScore: 89,
        strengths: [
            "D Segmentinin Tartışmasız Lideri ve Statü Sembolü",
            "Muazzam Genişlikte Arka Diz Mesafesi ve Bagaj",
            "Mükemmel Otoyol Konforu ve Yalıtım",
            "İkinci Elde Cumhuriyet Altını Gibi Olması"
        ],
        weaknesses: [
            "Tasarımın Fazla Ağırbaşlı (Sıkıcı) Olması",
            "Donanımsız Paketlerde (Impression/Trendline) Boş Olması",
            "DSG Şanzımanın Getirdiği Potansiyel Riskler",
            "Yüksek Servis ve Kasko Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Mekatronik ve Kavrama Arızası (DSG)",
                severity: "high",
                reportCount: 8,
                description: "1.4/1.5 TSI ve 1.6 TDI motorlarla gelen 7 ileri kuru kavrama DSG'nin yoğun trafikte titremesi ve mekatronik kart yakması."
            },
            {
                id: 2,
                title: "ErgoComfort Koltuk Masaj Motoru Sesi",
                severity: "low",
                reportCount: 7,
                description: "Highline paketlerdeki sürücü koltuğu masaj özelliğinin zamanla çok gürültülü çalışmaya başlaması."
            },
            {
                id: 3,
                title: "Krom Çıtaların Kararması",
                severity: "low",
                reportCount: 7,
                description: "Dış trimlerde ve cam kenarlarında bulunan krom detayların kalitesiz yıkama köpüklerinden dolayı beyazlaması/kararması."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 127,
        brand: "Hyundai",
        model: "Tucson 3. Nesil (2015-2020)",
        year: "2015-2020",
        dnaScore: 82,
        strengths: [
            "Heybetli ve Kaslı Dış Tasarım",
            "Zengin Donanım Seviyesi (Elite Plus paketinde yok yok)",
            "1.6 T-GDI Motorun Yüksek Performansı (177 HP)",
            "Geniş ve Ferah İç Mekan, Sorunsuz Elektronik"
        ],
        weaknesses: [
            "Aşırı Yüksek Yakıt Tüketimi (1.6 T-GDI Şehir içi 10-12 Litre)",
            "Süspansiyonların Biraz Sert Olması (Büyük jantlarla beraber)",
            "Aracın Çok Ağır Olmasından Dolayı DCT Şanzımanın Zorlanması",
            "Rüzgar Sesi (110 km/s sonrası)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DCT (Çift Kavrama) Şanzıman Isınması",
                severity: "high",
                reportCount: 7,
                description: "Özellikle yokuş yukarı dur-kalk trafikte 'Şanzıman Isındı, Güvenli Bir Yerde Durun' uyarısı vermesi ve titremesi."
            },
            {
                id: 2,
                title: "Direksiyon Kutusu Tıkırtısı (Tık Sesi)",
                severity: "medium",
                reportCount: 6,
                description: "Direksiyonu sağa veya sola ilk çevirişte 'tık' diye mekanik bir burç/boşluk sesi gelmesi."
            },
            {
                id: 3,
                title: "Multimedya Navigasyon Çökmesi",
                severity: "low",
                reportCount: 8,
                description: "Orijinal ünitenin geri görüş kamerasına geçerken siyah ekranda kalması (Yazılım güncellemesi gerekir)."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 101,
        brand: "Tofaş",
        model: "Şahin (1988-2002)",
        year: "1988-2002",
        dnaScore: 55,
        strengths: [
            "İnanılmaz Ucuz ve Bol Yedek Parça",
            "Mekaniği Basit, Her Usta Anlar",
            "Arkadan İtişli Klasik Sürüş Hissi",
            "LPG ile Çok Ekonomik Kullanım",
            "Geniş Bagaj Hacmi",
            "İkinci Elde Hızlı Alım Satım"
        ],
        weaknesses: [
            "Çok Düşük Güvenlik Standartları (ABS/Airbag Yok)",
            "Kronik Kaporta Çürüme ve Paslanma Sorunları",
            "Düşük Ses Yalıtımı",
            "Zayıf Fren Performansı",
            "Yüksek Yakıt Tüketimi (Benzinde)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Şasi ve Kaporta Çürümeleri",
                severity: "high",
                reportCount: 7,
                description: "Özellikle arka çamurluk ağızları, kule dipleri, kriko vurma yerleri ve kapı altlarında kronik çürümeler başlar. İkinci el alırken en dikkat edilmesi gereken yerdir."
            },
            {
                id: 2,
                title: "Diferansiyel (Şaft) Ötmesi",
                severity: "medium",
                reportCount: 6,
                description: "Kronik diferansiyel uğultusu. Belirli hızlarda (özellikle 80-100 km/s arası) arka kısımdan gelen uğultu sesidir. Parça değişimi ya da ayar gerektirir."
            },
            {
                id: 3,
                title: "Hararet (Soğutma Sistemi) Sorunu",
                severity: "high",
                reportCount: 8,
                description: "Radyatör tıkanması, su pompası (devirdaim) arızası veya termostat sorunları yüzünden hararet yapma eğilimi yüksektir. Bakımlı soğutma sistemi şarttır."
            },
            {
                id: 4,
                title: "Elektrik ve Tesisat Oksitlenmesi",
                severity: "medium",
                reportCount: 9,
                description: "Sigorta tablası ve eskiyen kablolardan dolayı farların sönük yanması, gösterge panelinde tutarsızlıklar yaşanabilir."
            }
        ],
        userExperiences: [],
        totalReports: 6,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Tofa%C5%9F_%C5%9Eahin_1.6_ie.jpg/800px-Tofa%C5%9F_%C5%9Eahin_1.6_ie.jpg"
    },
    {
        id: 102,
        brand: "Tofaş",
        model: "Doğan (1988-2002)",
        year: "1988-2002",
        dnaScore: 58,
        strengths: [
            "Şahin'e Göre Daha Konforlu Donanım (SLX Paketler)",
            "Çelik Jant, Sis Farı, Otomatik Ön Camlar (SLX)",
            "Ucuz Yedek Parça ve Kolay Tamir",
            "Geniş İç Mekan ve Konforlu Koltuklar",
            "Modifiyeye Oldukça Uygun Altyapı",
            "LPG ile Uyumu"
        ],
        weaknesses: [
            "Kaporta Korozyon Eğilimi",
            "Zayıf Aerodinamik Yapı (Yüksek hızda güvensizlik)",
            "Yetersiz Fren Sistemi",
            "Kronik Elektrik Arızaları"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Kaporta ve Taban Çürümeleri",
                severity: "high",
                reportCount: 8,
                description: "Araç yaşına bağlı olarak şasi uçları, kuleler ve taban sacı su alarak çürüyebilir."
            },
            {
                id: 2,
                title: "Şanzıman ve Diferansiyel Uğultusu",
                severity: "medium",
                reportCount: 7,
                description: "Uzun kullanımlarda şanzımandan ve şafttan/diferansiyelden uğultu gelmesi oldukça yaygındır."
            },
            {
                id: 3,
                title: "Karbüratör / Enjeksiyon (ie) Ayarsızlığı",
                severity: "medium",
                reportCount: 8,
                description: "Düz motorlarda karbüratör ayarsızlığı, ie (enjeksiyonlu) modellerde rölanti dalgalanması ve rölanti motoru arızası sık görülür."
            }
        ],
        userExperiences: [],
        totalReports: 7,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Tofa%C5%9F_Do%C4%9Fan_1.6_ie.jpg/800px-Tofa%C5%9F_Do%C4%9Fan_1.6_ie.jpg"
    },
    {
        id: 103,
        brand: "Tofaş",
        model: "Kartal (1988-2002)",
        year: "1988-2002",
        dnaScore: 57,
        strengths: [
            "Devasa Bagaj Hacmi (Station Wagon)",
            "Ticari ve Aile Kullanımına Uygunluk",
            "Arka Süspansiyonun Yüke Dayanıklılığı",
            "Çok Ucuza Tamir Edilebilirlik",
            "Parça ve Usta Bulma Kolaylığı"
        ],
        weaknesses: [
            "Özellikle Arka Kısımda Daha Fazla Çürüme",
            "Yalıtımın Zayıf Olması Nedeniyle Bagaj Sesi",
            "Düşük Çarpışma Güvenliği",
            "Ağır Yük Altında Motorun (Özellikle 1.4'lerde) Zorlanması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Bagaj Kapağı ve Arka Çamurluk Çürümeleri",
                severity: "high",
                reportCount: 7,
                description: "Kartal modellerinde station wagon yapısı gereği arka bagaj kapağı dipleri ve cam altlarında çürüme ve paslanma kroniktir."
            },
            {
                id: 2,
                title: "Diferansiyel ve Şaft Ötmesi",
                severity: "medium",
                reportCount: 9,
                description: "Yük taşındığı için diferansiyel dişlilerinde daha çabuk aşınma ve ötme (uğultu) görülür."
            },
            {
                id: 3,
                title: "Hararet Sorunu",
                severity: "high",
                reportCount: 9,
                description: "Ağır yüklerle rampa çıkarken soğutma sistemi yetersiz kalabilir, devirdaim pompası ve radyatör temizliği hayati önem taşır."
            }
        ],
        userExperiences: [],
        totalReports: 6,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Tofa%C5%9F_Kartal_1.6_ie.jpg/800px-Tofa%C5%9F_Kartal_1.6_ie.jpg"
    },
    {
        id: 104,
        brand: "Tofaş",
        model: "Serçe (1984-1994)",
        year: "1984-1994",
        dnaScore: 50,
        strengths: [
            "Klasik Tasarım (Murat 124'ün Makyajlı Hali)",
            "Kuş Serisinin En Uygun Fiyatlı Aracı",
            "Dar Sokaklarda Şehir İçi Pratikliği",
            "Bakım Maliyetinin Yok Denecek Kadar Az Olması"
        ],
        weaknesses: [
            "İç Mekan Hacminin Çok Dar Olması",
            "Güvenlik Donanımı Bulunmaması",
            "Sürüş Konforunun Düşük Olması",
            "Bagaj Hacminin Yetersizliği"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Kaporta Paslanması",
                severity: "high",
                reportCount: 7,
                description: "Saç kalitesi ve yaşı gereği taban ve kapı içlerinde yoğun pas görülmesi."
            },
            {
                id: 2,
                title: "Fren Sistemi Yetersizliği",
                severity: "medium",
                reportCount: 8,
                description: "Fren disk ve kampanalarının çabuk aşınması ve zayıf tutması."
            }
        ],
        userExperiences: [],
        totalReports: 6,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Fiat_124.jpg/800px-Fiat_124.jpg"
    },
    {
        id: 150,
        brand: "Renault",
        model: "Toros (R12) (1989-2000)",
        year: "1989-2000",
        dnaScore: 48,
        strengths: [
            "Kırsal kesimde tartışmasız efsane",
            "Yerden yüksek yapısı ile dağ bayır dinlemez",
            "Tamiri bir tornavida ve pense ile yapılabilir",
            "Yedek parçası bakkalda bile bulunur"
        ],
        weaknesses: [
            "Sıfır güvenlik donanımı",
            "Ağır ve hidrolik olmayan direksiyon (çok serttir)",
            "Kötü aerodinamik ve yüksek yakıt tüketimi",
            "Konfor seviyesinin sıfıra yakın olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Kaporta Çürümeleri",
                severity: "high",
                reportCount: 7,
                description: "Özellikle kapı altları, çamurluk ağızları ve tabanda yoğun çürüme görülür."
            },
            {
                id: 2,
                title: "Karbüratör ve Distribütör Sorunları",
                severity: "medium",
                reportCount: 7,
                description: "Sık sık meksefe, platin ayarı ister. Rölanti tutturmak zordur."
            },
            {
                id: 3,
                title: "Aks Kafası Ötmesi",
                severity: "medium",
                reportCount: 9,
                description: "Dönüşlerde tekerlerden gelen 'tık tık tık' sesi kroniktir, aks kafası bozulur."
            }
        ],
        userExperiences: [],
        totalReports: 9,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Renault_12_Toros_1.4_TX.jpg/800px-Renault_12_Toros_1.4_TX.jpg"
    },
    {
        id: 151,
        brand: "Renault",
        model: "R9 Broadway (1985-2000)",
        year: "1985-2000",
        dnaScore: 54,
        strengths: [
            "Az yakar, çok kaçar efsanesi",
            "Muazzam ucuz yedek parça ve bakım maliyeti",
            "İkinci elde peynir ekmek gibi satılması",
            "Geniş bagajı ve hafif kasası"
        ],
        weaknesses: [
            "Yol tutuşunun zayıf olması",
            "Yüksek hızlarda savrulma eğilimi",
            "Ön cam otomatiklerinin sık bozulması",
            "Zayıf fren performansı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Hararet Sorunu",
                severity: "high",
                reportCount: 9,
                description: "Radyatör kapağı veya fan müşürü arızaları yüzünden yazın sık sık hararet yapar."
            },
            {
                id: 2,
                title: "Ön Takım Hassasiyeti",
                severity: "medium",
                reportCount: 8,
                description: "Rotil ve salıncak bozulmaları, ön takımdan gelen sesler."
            },
            {
                id: 3,
                title: "Kaporta Çürümesi",
                severity: "high",
                reportCount: 9,
                description: "Özellikle kule dipleri ve bagaj havuzunda su alma/çürüme problemleri."
            }
        ],
        userExperiences: [],
        totalReports: 7,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Renault_9_Broadway.jpg/800px-Renault_9_Broadway.jpg"
    },
    {
        id: 152,
        brand: "Fiat",
        model: "Uno (1995-2001)",
        year: "1995-2001",
        dnaScore: 56,
        strengths: [
            "Şehir içinde inanılmaz pratik ve atik",
            "Öğrenci ve ilk arabasını alanlar için ideal",
            "LPG ile mükemmel ekonomi",
            "Motorunun devirlenme isteği"
        ],
        weaknesses: [
            "Çok dar iç hacim",
            "Bagajın neredeyse yok denecek kadar küçük olması",
            "Güvenlik donanımının eksikliği",
            "Uzun yolda yorucu sürüş"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Karbüratör (70 S) ve Enjeksiyon (70 SX ie) Sorunları",
                severity: "high",
                reportCount: 9,
                description: "Rölanti dengesizliği, stop etme ve tek nokta enjeksiyonlu modellerde sensör arızaları."
            },
            {
                id: 2,
                title: "Elektrik Sistemi Arızaları",
                severity: "medium",
                reportCount: 9,
                description: "Şase kablolarının oksitlenmesi sonucu gösterge paneli ve sinyal kolları arızaları."
            },
            {
                id: 3,
                title: "Ön Takım ve Aks Körükleri",
                severity: "medium",
                reportCount: 9,
                description: "Aks körüklerinin çabuk yırtılıp aks kafasını bozması."
            }
        ],
        userExperiences: [],
        totalReports: 7,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Fiat_Uno.jpg/800px-Fiat_Uno.jpg"
    },
    {
        id: 153,
        brand: "Toyota",
        model: "Corolla AE101 (Efsane Kasa) (1993-1998)",
        year: "1993-1998",
        dnaScore: 72,
        strengths: [
            "Bozulmak nedir bilmeyen efsanevi Japon sağlamlığı",
            "1.6 GLi motorunun efsanevi performansı ve dayanıklılığı",
            "İç mekan kalitesi ve tıkırtı yapmayan konsol",
            "Klima (varsa) çok güçlü soğutur"
        ],
        weaknesses: [
            "Temizini bulmak günümüzde çok zor",
            "Yaşına rağmen ikinci el fiyatlarının çok abartılı olması",
            "Yol yalıtımı zayıftır, motor ve yol sesini içeri alır"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Distribütör O-Ring Yağ Kaçağı",
                severity: "low",
                reportCount: 6,
                description: "Distribütör dibinden yağ sızdırması en bilindik (ama çözümü basit) sorunudur."
            },
            {
                id: 2,
                title: "Direksiyon Kutusu Boşluğu",
                severity: "medium",
                reportCount: 6,
                description: "Yaşa bağlı olarak direksiyon kutusunda boşluk ve tıkırtı oluşması."
            },
            {
                id: 3,
                title: "Bagaj Su Alması",
                severity: "low",
                reportCount: 9,
                description: "Arka stop lambalarının contalarından bagaja su sızması."
            }
        ],
        userExperiences: [],
        totalReports: 7,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Toyota_Corolla_E100_front_20080112.jpg/800px-Toyota_Corolla_E100_front_20080112.jpg"
    },
    {
        id: 154,
        brand: "Hyundai",
        model: "Accent (Yumurta Kasa) (1995-2000)",
        year: "1995-2000",
        dnaScore: 62,
        strengths: [
            "1.5 GLS motoru inanılmaz atiktir",
            "Hidrolik direksiyon, 4 cam otomatik gibi dönemi için iyi donanım",
            "Parçası ucuz ve heryerde bulunur",
            "Kliması (GLS) çok başarılıdır"
        ],
        weaknesses: [
            "Torpido çatlaması kroniktir",
            "Süspansiyonlar çok yumuşaktır, virajda güvensiz hissettirir",
            "Fren mesafesi uzundur"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Torpido / Konsol Çatlaması",
                severity: "low",
                reportCount: 8,
                description: "Güneşe maruz kalan göğüs (torpido) plastiğinde ortadan çatlamalar oluşur, kroniktir."
            },
            {
                id: 2,
                title: "Rölanti Dalgalanması ve Step Motor Arızası",
                severity: "medium",
                reportCount: 7,
                description: "Rölanti adım motoru kirlenmesi kaynaklı stop etme sorunları."
            },
            {
                id: 3,
                title: "Amortisör ve Helezon Zayıflığı",
                severity: "medium",
                reportCount: 6,
                description: "Arka tarafın yüklendiğinde çok çökmesi ve amortisör patlatması."
            }
        ],
        userExperiences: [],
        totalReports: 6,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Hyundai_Accent_X3_1.5_GLS_front.JPG/800px-Hyundai_Accent_X3_1.5_GLS_front.JPG"
    },
    {
        id: 155,
        brand: "Lada",
        model: "Samara (1990-2004)",
        year: "1990-2004",
        dnaScore: 45,
        strengths: [
            "Rus tankı gibi dayanıklı alt takım",
            "1.5 motoru beklediğinizden çok daha iyi ivmelenir",
            "Tamponları demir gibidir, ufak kazalarda kırılmaz",
            "Kaloriferi cehennem sıcağı üfler"
        ],
        weaknesses: [
            "İç mekanda inanılmaz trim sesi vardır",
            "Frenler çok hissiz ve zayıftır",
            "Kapı kilitleri ve mekanizmaları çok sıkıntılıdır",
            "Ağır direksiyon"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Kapı İç Trimleri ve Göğüs Tıkırtıları",
                severity: "medium",
                reportCount: 9,
                description: "Kasislerde tüm plastik aksamdan yoğun ses gelmesi."
            },
            {
                id: 2,
                title: "Sigorta Tablası Arızaları",
                severity: "high",
                reportCount: 8,
                description: "Su alma sebebiyle sigorta tablası oksitlenir, farlar ve silecekler kafasına göre çalışır."
            },
            {
                id: 3,
                title: "Senkromeç ve Şanzıman Geçişleri",
                severity: "high",
                reportCount: 8,
                description: "Vites geçişleri, özellikle 2. vites cırtlaması ve sertliği kroniktir."
            }
        ],
        userExperiences: [],
        totalReports: 6,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Lada_Samara_front_20080220.jpg/800px-Lada_Samara_front_20080220.jpg"
    },

    {
        id: 156,
        brand: "Renault",
        model: "Symbol / Clio Symbol (2000-2012)",
        year: "2000-2012",
        dnaScore: 63,
        strengths: [
            "1.5 dCi Motorun Efsanevi Yakıt Cimriliği (Şehir içi 5L, uzun yol 3.8L)",
            "Sınıfının En Geniş Bagaj Hacmi (510 Litre - Sedan avantajı)",
            "Çok Düşük Bakım ve İşletme Maliyeti (Parça fiyatları çok ucuz)",
            "Şehir İçinde Kolay Park ve Manevra (Kompakt boyut)",
            "İkinci Elde Anında Nakite Çevrilebilme (Taksi/ticari talep)",
            "Türkiye'de Üretim Avantajı ile Her Yerde Servis Bulunabilirlik"
        ],
        weaknesses: [
            "Konfor Seviyesinin Çok Düşük Olması (Sert süspansiyon, ince koltuk)",
            "Yüksek Hızlarda Ciddi Rüzgar Sesi ve Savrulma Hissi",
            "Arka Diz Mesafesinin Yetersizliği (Uzun yolculuk zor)",
            "İç Mekan Malzeme Kalitesinin Çok Düşük Olması (Sert ve ucuz plastikler)",
            "Güvenlik Donanımının Yetersizliği (Baz paketlerde ABS bile opsiyonel)",
            "Otomatik Vites Seçeneğinin Bulunmaması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Enjektör ve Mazot Pompası Arızası (dCi)",
                severity: "high",
                reportCount: 9,
                description: "Kötü yakıt kullanımı veya yaşa bağlı olarak enjektörlerin tıkanması veya sızıntı yapması. Mazot pompası arızası ise aracı çalışmaz hale getirebilir. Kaliteli yakıt filtresi kullanımı önerilir."
            },
            {
                id: 2,
                title: "Klima Kompresörü Arızası",
                severity: "medium",
                reportCount: 8,
                description: "Klimanın yeterince soğutmaması veya hiç çalışmaması. Kompresör kavraması veya gaz kaçağı kaynaklı olabiliyor. Orijinal kompresör pahalıdır."
            },
            {
                id: 3,
                title: "Cam Kriko Motoru Bozulması",
                severity: "medium",
                reportCount: 8,
                description: "Clio/Symbol ailesinin ortak sorunu olan cam kriko motorunun yanması. Özellikle sürücü tarafı camın yarıda kalması veya hiç çalışmaması."
            },
            {
                id: 4,
                title: "Debriyaj Baskı ve Balata Erken Aşınması",
                severity: "medium",
                reportCount: 7,
                description: "Şehir içi yoğun trafikte debriyaj setinin 70.000-90.000 km'de değişim gerektirmesi. Debriyaj sertleşmesi veya kaçırması belirtileri verir."
            }
        ],
        userExperiences: [],
        totalReports: 8,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Renault_Symbol_front_20081206.jpg/800px-Renault_Symbol_front_20081206.jpg"
    },
    {
        id: 157,
        brand: "Fiat",
        model: "Linea",
        year: "2007-2018",
        dnaScore: 65,
        strengths: [
            "Tam bir aile arabası, bagajı devasadır",
            "1.3 Multijet motorun dayanıklılığı ve ekonomisi",
            "Bakım ve yedek parça maliyetlerinin çok düşük olması",
            "Türkiye şartlarına uygun yerden yüksek yapısı"
        ],
        weaknesses: [
            "Şehir içinde 1.3 motorun kalkışlarda hantal kalması",
            "Yol sesi yalıtımının zayıf olması",
            "İç mekanda sert plastik kullanımı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "EGR ve DPF Tıkanıklığı",
                severity: "medium",
                reportCount: 9,
                description: "Sürekli şehir içi kullanımda Partikül Filtresi ve EGR valfi dolar."
            },
            {
                id: 2,
                title: "Zincir Sesi (1.3 Multijet)",
                severity: "high",
                reportCount: 6,
                description: "100.000 km üzeri triger zincirinden ses gelmesi ve değişmesi gerekmesi."
            },
            {
                id: 3,
                title: "Direksiyon Kutusu Boşluğu",
                severity: "medium",
                reportCount: 7,
                description: "Tıkırtı burçlarının aşınması sonucu direksiyondan gelen boşluk ve tıkırtı."
            }
        ],
        userExperiences: [],
        totalReports: 6,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Fiat_Linea_front.JPG/800px-Fiat_Linea_front.JPG"
    },
    {
        id: 158,
        brand: "Peugeot",
        model: "206",
        year: "1998-2012",
        dnaScore: 58,
        strengths: [
            "Yıllara meydan okuyan muazzam tasarım",
            "Şehir içinde çok pratik ve çevik olması",
            "Özellikle 1.4 HDi ve LPG'li modellerinin çok az yakması"
        ],
        weaknesses: [
            "Elektronik sorunlara olan yatkınlığı",
            "Arka torsiyon sisteminin pahalı ve kronik arızası",
            "Arka yaşam alanının dar olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Arka Torsiyon (Dingil) Arızası",
                severity: "high",
                reportCount: 9,
                description: "Arka tekerleklerin içe doğru yatması ve kasislerde gıcırtı gelmesi, tamiri masraflıdır."
            },
            {
                id: 2,
                title: "Elektrik Sistemi ve Müşürler",
                severity: "high",
                reportCount: 9,
                description: "Sinyal kolu (COM2000) arızası, kendi kendine sinyal verme veya far açma kroniktir."
            },
            {
                id: 3,
                title: "Kalorifer Peteği Su Sızıntısı",
                severity: "medium",
                reportCount: 7,
                description: "Paspasların altının ıslanması, petek değişimi için göğsün sökülmesi gerekir."
            }
        ],
        userExperiences: [],
        totalReports: 7,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Peugeot_206_front_20080612.jpg/800px-Peugeot_206_front_20080612.jpg"
    },
    {
        id: 159,
        brand: "Honda",
        model: "Civic FD6",
        year: "2006-2012",
        dnaScore: 82,
        strengths: [
            "Uzay mekiği gibi dijital gösterge tablosu",
            "LPG ile mükemmel uyumlu 1.6 i-VTEC motoru",
            "Sorunsuz tam otomatik şanzımanı",
            "Tasarımının hala modern durması"
        ],
        weaknesses: [
            "Yol ve rüzgar sesini kabine fazlasıyla alması",
            "Bagaj hacminin rakiplerine göre küçük olması",
            "Süspansiyonların sert olması ve çukur hissettirmesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Direksiyon Kutusu Tıkırtısı",
                severity: "medium",
                reportCount: 9,
                description: "Parke taşlı veya bozuk yollarda direksiyon kutusundan gelen ses."
            },
            {
                id: 2,
                title: "Otomatik Cam Mekanizması Düşmesi",
                severity: "low",
                reportCount: 8,
                description: "Özellikle şoför camının yuvadan çıkarak çapraz kalkması/inmesi."
            },
            {
                id: 3,
                title: "Motor Takozu Çökmesi",
                severity: "medium",
                reportCount: 8,
                description: "Motor takozunun ezilerek rölantide kabin içine titreme vermesi."
            }
        ],
        userExperiences: [],
        totalReports: 6,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/2006-2008_Honda_Civic_VTi-L_sedan_01.jpg/800px-2006-2008_Honda_Civic_VTi-L_sedan_01.jpg"
    },
    {
        id: 160,
        brand: "Opel",
        model: "Vectra B",
        year: "1995-2002",
        dnaScore: 64,
        strengths: [
            "Dönemine göre çok yüksek donanım ve konfor",
            "Yol tutuşunun tank gibi güven vermesi",
            "Geniş iç hacim ve D segmenti hissi",
            "Aynalarla bütünleşen aerodinamik tasarım"
        ],
        weaknesses: [
            "Elektronik arıza verme potansiyeli yüksektir",
            "Yedek parçaları eski bir araca göre pahalıdır",
            "Şehir içi yakıt tüketimi fazladır (2.0 ve 1.6 motor)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Eksantrik ve Krank Devir Sensörü",
                severity: "medium",
                reportCount: 6,
                description: "Motorun birden stop etmesi veya geç çalışmasına sebep olur."
            },
            {
                id: 2,
                title: "EGR Valfi ve Rölanti Dalgalanması",
                severity: "medium",
                reportCount: 8,
                description: "Stop etme, rölantide devrin sürekli inip çıkması."
            },
            {
                id: 3,
                title: "Yol Bilgisayarı (TID/MID) Ekran Piksel Kaybı",
                severity: "low",
                reportCount: 6,
                description: "Ekranda çizgiler oluşması ve yazıların okunmaz hale gelmesi."
            }
        ],
        userExperiences: [],
        totalReports: 6,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Opel_Vectra_B_front_20080313.jpg/800px-Opel_Vectra_B_front_20080313.jpg"
    },
    {
        id: 161,
        brand: "Tofaş",
        model: "Murat 131",
        year: "1977-1988",
        dnaScore: 50,
        strengths: [
            "Türkiye otomotiv tarihinin ilk gözağrılarından",
            "Modifiyeye ve klasik restorasyona uygun altyapı",
            "Basit motor mimarisi",
            "Yedek parçasının çok ucuz olması"
        ],
        weaknesses: [
            "Paslanmaya aşırı müsait kaporta",
            "Güvenlik, konfor veya yalıtımın hiç olmaması",
            "Fren mesafesinin çok uzun olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yoğun Kaporta Çürümeleri",
                severity: "high",
                reportCount: 6,
                description: "Tavan hariç neredeyse tüm aksamlarda pas ve çürüme gözlemlenmesi."
            },
            {
                id: 2,
                title: "Karbüratör Karışım Sorunu",
                severity: "medium",
                reportCount: 9,
                description: "Karbüratörün sık sık ayar istemesi."
            },
            {
                id: 3,
                title: "Diferansiyel Ötmesi",
                severity: "medium",
                reportCount: 6,
                description: "Arka diferansiyelden özellikle hızlandıkça gelen uğultu."
            }
        ],
        userExperiences: [],
        totalReports: 7,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Fiat_124.jpg/800px-Fiat_124.jpg"
    },
    {
        id: 1001,
        brand: "Audi",
        model: "A3 (2020-2025)",
        year: "2020-2025",
        ncapStars: 5,
        ncapYear: "2020",
        dnaScore: 82,
        strengths: [
            "Premium iç mekan hissiyatı",
            "Güçlü teknolojik donanım",
            "Yüksek güvenlik standartları"
        ],
        weaknesses: [
            "Yüksek servis maliyetleri",
            "Sert süspansiyon"
        ],
        chronicIssues: [],
        userExperiences: [],
        totalReports: 9
    }
,
    {
        id: 1002,
        brand: "Renault",
        model: "Symbol 1.0 SCe",
        year: "2017-2021",
        ncapStars: 3,
        ncapYear: "2013",
        dnaScore: 68,
        strengths: [
            "Atmosferik motorun getirdiği sadelik ve düşük bakım maliyeti",
            "Şehir içi kullanıma uygun düşük yakıt tüketimi",
            "Sınıfına göre devasa bagaj hacmi (510 litre)",
            "LPG uyumu yüksek (atmosferik enjeksiyon)",
            "Yedek parça ucuzluğu ve servis ağının çok geniş olması"
        ],
        weaknesses: [
            "Düşük tork (97 Nm) sebebiyle yokuşlarda çekişten düşme",
            "Klima açıkken veya araç doluyken performans kaybı",
            "Yüksek hızlarda yetersiz ses yalıtımı",
            "Sert plastik ağırlıklı, basit iç mekan kalitesi",
            "Güvenlik donanımlarının sadece temel seviyede olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Rölanti dalgalanması",
                severity: "medium",
                reportCount: 9,
                description: "Boğaz kelebeğinin kirlenmesi veya ateşleme bobinlerindeki hassasiyet nedeniyle rölantide titreme ve dalgalanma yaşanabiliyor. Temizlik veya bobin değişimi ile çözülür."
            },
            {
                id: 2,
                title: "Triger kayışı ömrü",
                severity: "high",
                reportCount: 6,
                description: "1.0 SCe motorlarda triger seti değişim periyoduna çok dikkat edilmeli. Kayış kopması durumunda motorda ağır hasarlar oluşabilir."
            },
            {
                id: 3,
                title: "Amortisör ve alt takım sesleri",
                severity: "low",
                reportCount: 9,
                description: "Özellikle bozuk yollarda ön takımdan ve amortisör kulelerinden lokurtu şeklinde sesler gelmesi kronik sayılabilir."
            }
        ],
        userExperiences: [
            {
                id: 1,
                author: "Taksi_Cem",
                authorLevel: "Gümüş Üye",
                text: "Şehir içi taksi ve kurye işinde kullanıyoruz. Yakıtı kokluyor adeta. Ama uzun yola veya yokuşlu bölgelere pek gelmez. Düz yolda problemsiz.",
                likes: 42,
                replies: 5,
                date: "2024-03-12",
                rating: 4
            },
            {
                id: 2,
                author: "AileBabası",
                authorLevel: "Bronz Üye",
                text: "Bagajı puset ve valizler için harika. Fakat araç sollarken 2 kez düşünmek gerekiyor. Tork çok zayıf. LPG taktırdım, şu an bedavaya geziyorum resmen.",
                likes: 85,
                replies: 12,
                date: "2023-11-20",
                rating: 3
            }
        ],
        totalReports: 6,
        imageUrl: "https://images.unsplash.com/photo-1549314418-6c841bb749f7?q=80&w=2070&auto=format&fit=crop"
    }
,
    {
        id: 1003,
        brand: "Kia",
        model: "Rio 4. Nesil (2017-2023)",
        year: "2017-2023",
        ncapStars: 5,
        ncapYear: "2017",
        dnaScore: 79,
        strengths: [
            "1.4 MPI motorda sunulan tam otomatik şanzımanın yüksek dayanıklılığı ve sarsıntısız geçişleri",
            "B segmentine göre oldukça ferah ve ergonomik iç mekan tasarımı",
            "Hyundai i20 ile ortak parça kullanımı sayesinde ucuz ve kolay bulunabilen yedek parça",
            "Genel mekanik güvenilirliğinin sınıf standartlarının üzerinde olması",
            "Atmosferik motorların LPG uyumunun çok iyi olması"
        ],
        weaknesses: [
            "1.4 MPI otomatik versiyonun şehir içi yakıt tüketiminin rakiplerine göre yüksek olması",
            "1.25 MPI versiyonunda yüklüyken ve yokuşlarda belirgin çekiş düşüklüğü",
            "Süspansiyonların rakiplerine (örneğin Clio) göre daha sert olması",
            "Yüksek hızlarda kabin içine alınan yol ve rüzgar sesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Direksiyon Kutusu Tıkırtısı",
                severity: "medium",
                reportCount: 8,
                description: "Özellikle parke taşlı veya bozuk yollarda direksiyon kutusundan tıkırtı benzeri sesler gelmesi bilinen bir durumdur. Genellikle eps kaplini değişimi veya kutu revizyonu ile çözülür."
            },
            {
                id: 2,
                title: "Multimedya Ekran Donmaları",
                severity: "low",
                reportCount: 8,
                description: "Ara sıra multimedya sisteminin donması veya Apple CarPlay/Android Auto bağlantısının kopması yaşanabilir. Yazılım güncellemesi ile büyük ölçüde giderilir."
            }
        ],
        userExperiences: [
            {
                id: 1,
                author: "SehirIciSurucusu",
                authorLevel: "Altın Üye",
                text: "1.4 otomatik olanını 3 yıldır kullanıyorum. Vites geçişlerini hissetmiyorsunuz bile, DSG gibi sorun çıkarır mı korkusu yok. Tek derdim şehir içi 8.5-9 litreyi bulabilen yakıt tüketimi.",
                likes: 56,
                replies: 8,
                date: "2024-02-15",
                rating: 4
            },
            {
                id: 2,
                author: "RioMan",
                authorLevel: "Gümüş Üye",
                text: "Süspansiyonları bana biraz sert geldi, bozuk yollarda konfor düşüyor ama bunun karşılığında yol tutuşu sınıfına göre gayet güven veriyor. i20 yerine tercih ettim, daha sportif duruyor.",
                likes: 34,
                replies: 3,
                date: "2023-09-28",
                rating: 4
            }
        ],
        totalReports: 8,
        imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?q=80&w=2070&auto=format&fit=crop"
    }
,
    {
        id: 1004,
        brand: "Hyundai",
        model: "i20 3. Nesil (2020-Günümüz)",
        year: "2020-2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 82,
        strengths: [
            "Çok dikkat çekici, sportif ve yenilikçi dış tasarım",
            "1.4 MPI motor ve 6 ileri tork konvertörlü tam otomatik şanzımanın mükemmel uyumu ve arıza yapmama garantisi",
            "Sınıfına göre çok geniş arka diz mesafesi ve 352 litrelik büyük bagaj hacmi",
            "Apple CarPlay, kablosuz şarj ve dijital gösterge gibi teknolojik donanımların zenginliği",
            "İkinci el piyasasında çok hızlı alınıp satılabilmesi"
        ],
        weaknesses: [
            "1.4 MPI motorun ivmelenmede zayıf kalması ve şehir içi 9-10 litreleri bulan yüksek yakıt tüketimi",
            "Süspansiyonların sportif sürüş odaklı, yani biraz sert olması (çukurları hissettirmesi)",
            "Kabin içinde, özellikle kapı içlerinde ve konsolda kullanılan sert plastik malzemeler",
            "Yüksek hızlarda (110 km/s üzeri) kabin içine alınan yol ve rüzgar sesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "EPS Direksiyon Kaplini Tıkırtısı",
                severity: "medium",
                reportCount: 9,
                description: "Özellikle bozuk veya parke taşlı yollarda direksiyon kutusundan tıkırtı gelmesi kroniktir. EPS kaplini değişimi veya yağlanması ile çözülür, kronik bir Hyundai/Kia sorunudur."
            },
            {
                id: 2,
                title: "Trim (Plastik) Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Havaların soğumasıyla veya bozuk yollarda ön konsoldan ve kapı döşemelerinden tıkırtılar (trim sesi) gelebilir."
            }
        ],
        userExperiences: [
            {
                id: 1,
                author: "TasarimciKiz",
                authorLevel: "Gümüş Üye",
                text: "Tasarımına aşık olup 1.4 otomatiğini aldım. Çok havalı duruyor, içi çok geniş. Ama İstanbul trafiğinde su gibi benzin içiyor. LPG taktırmak şart oldu.",
                likes: 88,
                replies: 14,
                date: "2024-01-05",
                rating: 4
            },
            {
                id: 2,
                author: "HizliPilot",
                authorLevel: "Bronz Üye",
                text: "1.0 T-GDI DCT versiyonu uçak gibi kaçıyor. 1.4'teki o hantallık yok. Vites geçişleri efsane hızlı. Fakat süspansiyonlar belimi ağrıtıyor bozuk yollarda.",
                likes: 65,
                replies: 10,
                date: "2023-11-12",
                rating: 4
            }
        ],
        totalReports: 9,
        imageUrl: "https://images.unsplash.com/photo-1695420138139-448f22ed1525?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 1005,
        brand: "Hyundai",
        model: "Tucson 4. Nesil (2021-Günümüz)",
        year: "2021-2025",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 88,
        strengths: [
            "Parametrik gizli aydınlatmalı ızgarasıyla trafikte herkesin dönüp baktığı fütüristik tasarım",
            "C-SUV segmentinin en geniş iç hacimlerinden ve en büyük bagajlarından (620 litre) birini sunması",
            "Adaptif hız sabitleyici, şerit takip ve çarpışma önleme gibi güvenlik asistanlarının kusursuz çalışması",
            "Premium araç hissiyatı veren kaliteli iç mekan ve yüksek çözünürlüklü ekranlar",
            "Dört tekerlekten çekiş (HTRAC) opsiyonunun son derece başarılı olması"
        ],
        weaknesses: [
            "1.6 T-GDI benzinli motorun cüsseli kasada 10 litrenin altına düşmeyen yüksek yakıt tüketimi",
            "Konsoldaki parlak siyah (Piano Black) plastiklerin ve dokunmatik tuşların anında çizilmesi ve toz tutması",
            "Fiziksel tuş olmaması sebebiyle sürüş esnasında klima ayarı yapmanın dikkat dağıtması",
            "7 ileri DCT şanzımanın yoğun dur-kalk trafikte kararsızlık yaşaması ve ısınma eğilimi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DCT Şanzıman Isınma Uyarısı",
                severity: "high",
                reportCount: 8,
                description: "Özellikle çok dik yokuşlarda veya saatler süren dur-kalk trafiğinde, çift kavramalı (DCT) şanzıman ısınarak ekranda 'Şanzıman Isındı, Durun' uyarısı verebilir."
            },
            {
                id: 2,
                title: "Multimedya Yazılım Sorunları",
                severity: "low",
                reportCount: 9,
                description: "Zaman zaman geri görüş kamerasının siyah ekran vermesi veya Bluetooth bağlantısının kopması yaşanıyor. Serviste yapılan güncellemelerle çözülüyor."
            }
        ],
        userExperiences: [
            {
                id: 1,
                author: "SUV_Tutkunu",
                authorLevel: "Altın Üye",
                text: "Tasarımı hala ilk günkü gibi heyecan veriyor. Arka koltukta bacak bacak üstüne atılıyor. Bagaj devasa. 1.6 benzinli modelde performans müthiş ama yakıtı görünce insan bir ağlıyor.",
                likes: 145,
                replies: 22,
                date: "2024-04-10",
                rating: 5
            },
            {
                id: 2,
                author: "GezginBaba",
                authorLevel: "Gümüş Üye",
                text: "1.6 CRDi Dizel kullanıcısıyım. Tork efsane, rampa mampa dinlemiyor. Yakıtı da dizel olduğu için makul. Tek sıkıntım klima tuşlarını bulamamak, yola bakarken derece kısmak işkence.",
                likes: 92,
                replies: 15,
                date: "2023-12-05",
                rating: 4
            }
        ],
        totalReports: 6,
        imageUrl: "https://images.unsplash.com/photo-1629897048514-3dd741427cc7?q=80&w=2072&auto=format&fit=crop"
    },
    {
        id: 2001,
        brand: "Renault",
        model: "19 (Europa)",
        year: "1994 - 2001",
        ncapStars: 3,
        ncapYear: "1998",
        dnaScore: 74,
        strengths: [
            "Konforlu ve yumuşak süspansiyon sistemi",
            "Mekanik sadeliği sayesinde her sanayide kolayca tamir edilebilmesi",
            "Geniş iç hacmi ve tatminkar bagaj kapasitesi",
            "Yedek parça fiyatlarının çok uygun olması"
        ],
        weaknesses: [
            "Klima ve hidrolik direksiyon donanımlarının her modelde olmaması",
            "İzolasyon zayıflığı ve yüksek hızlarda içeri ses alması",
            "Yaşından dolayı kaporta çürümelerine yatkın olması",
            "Yakıt tüketiminin güncel modellere göre yüksek kalması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Karbüratör ve Rölanti Dalgalanması",
                severity: "medium",
                reportCount: 6,
                description: "Özellikle LPG'li kullanımlarda rölanti dalgalanması ve karbüratör ayarsızlığı kroniktir."
            },
            {
                id: 2,
                title: "Hararet Sorunları",
                severity: "high",
                reportCount: 6,
                description: "Soğutma sistemi eski olduğundan radyatör tıkanmaları ve hararet yapma eğilimi sık görülür."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2002,
        brand: "Renault",
        model: "9 (Spring / Broadway)",
        year: "1990 - 2000",
        ncapStars: 3,
        ncapYear: "1998",
        dnaScore: 76,
        strengths: [
            "İnanılmaz düşük bakım maliyetleri",
            "Hafif kasası sayesinde tatminkar çekiş gücü",
            "Şehir içi kullanıma uygun pratik boyutlar",
            "Hemen alıcı bulan hızlı ikinci el piyasası"
        ],
        weaknesses: [
            "Modern güvenlik donanımlarının (ABS, Airbag) hiçbirinin olmaması",
            "Sürüş dinamiklerinin ve yol tutuşunun çok zayıf olması",
            "Fren mesafesinin uzun olması",
            "Konfor anlamında oldukça geri kalması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Distribütör ve Ateşleme Arızaları",
                severity: "low",
                reportCount: 9,
                description: "Islak havalarda distribütör su alıp tekleme yapabilir."
            },
            {
                id: 2,
                title: "Ön Takım Hassasiyeti",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda ön takımdan (salıncak, rot) çabuk ses gelmesi."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2003,
        brand: "Renault",
        model: "Kangoo (Eski Kasa)",
        year: "1998 - 2003",
        ncapStars: 4,
        ncapYear: "2006",
        dnaScore: 78,
        strengths: [
            "Ticari araç genişliğini aile kullanımıyla birleştirmesi",
            "Devasa bagaj hacmi ve yüksek tavan",
            "1.5 dCi motorun efsanevi yakıt ekonomisi",
            "Pratik sürgülü kapılar"
        ],
        weaknesses: [
            "Yüksek hızlarda viraj kabiliyetinin zayıf olması",
            "Ticari araç statüsünde olduğu için her yıl muayene gerektirmesi",
            "İç mekanda bolca sert plastik kullanımı",
            "Yüksek hızlarda rüzgar sesi alması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "EGR Valfi Tıkanması",
                severity: "medium",
                reportCount: 6,
                description: "1.5 dCi motorlarda şehir içi kullanımda kurum bağlayıp çekişten düşme yapar."
            },
            {
                id: 2,
                title: "Sürgülü Kapı Mekanizması",
                severity: "low",
                reportCount: 7,
                description: "Zamanla raylarda biriken toz ve aşınma nedeniyle sürgülü kapıların zor kapanması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2004,
        brand: "Peugeot",
        model: "206 (1.4)",
        year: "1999 - 2008",
        ncapStars: 4,
        ncapYear: "2006",
        dnaScore: 72,
        strengths: [
            "Yıllara meydan okuyan, sportif ve şık tasarım",
            "Şehir içinde park kolaylığı ve çeviklik",
            "Genç kullanıcılar için modifiyeye uygun altyapı",
            "1.4 motorun makul yakıt tüketimi"
        ],
        weaknesses: [
            "Arka diz mesafesinin çok dar olması",
            "Torsiyon çubuğu arka süspansiyon sisteminin sert olması",
            "Elektronik donanımların zamanla arıza vermeye meyilli olması",
            "Vites geçişlerinin kemikli ve hissiz olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Arka Torsiyon Dingili Sorunu",
                severity: "high",
                reportCount: 7,
                description: "Arka tekerleklerin kamber açısının bozulması (  / şeklinde durması) ve arka takımdan gıcırtı gelmesi. Tamiri maliyetlidir."
            },
            {
                id: 2,
                title: "Silecek Kolu (COM2000) Arızası",
                severity: "medium",
                reportCount: 8,
                description: "Sinyal verildiğinde kendi kendine kapanması veya sileceklerin kafasına göre çalışması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2005,
        brand: "Ford",
        model: "Fiesta (Eski Kasa)",
        year: "2015 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 77,
        strengths: [
            "Sınıfına göre çok üstün direksiyon hissi ve yol tutuş",
            "Tok kapı sesi ve güven veren kasa yapısı",
            "Kliması ve ısıtma sisteminin çok başarılı olması",
            "Uzun ömürlü ve dayanıklı motor bloğu"
        ],
        weaknesses: [
            "İç mekanda kullanılan malzemelerin zamanla soyulması",
            "1.4 TDCi dizel motorların çok gürültülü çalışması",
            "Yakıt tüketiminin rakiplerine göre bir tık yüksek olması",
            "Bagaj hacminin dar olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Direksiyon Kutusu Tıkırtısı",
                severity: "medium",
                reportCount: 8,
                description: "Bozuk yollarda direksiyon kutusundan tıkırtı sesi gelmesi, Ford'larda genel bir kroniktir."
            },
            {
                id: 2,
                title: "Enjektör Pulu Kaçağı",
                severity: "high",
                reportCount: 7,
                description: "1.4 TDCi motorlarda enjektör diplerinden mazot veya kompresyon kaçağı yapıp içeri çiğ mazot kokusu vermesi."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2006,
        brand: "Renault",
        model: "12 Toros",
        year: "1990 - 2000",
        ncapStars: 3,
        ncapYear: "1998",
        dnaScore: 79,
        strengths: [
            "Kırsal kesimde ve bozuk yollarda SUV gibi ilerleyebilmesi",
            "Mekanik yapısının çok basit olması",
            "Arkası geniş station wagon kasa avantajı",
            "Türkiye yollarının efsanesi olarak yedek parça sorunu olmaması"
        ],
        weaknesses: [
            "Direksiyonun (hidrolik olmadığı için) aşırı ağır olması",
            "Konfor ve yalıtımın sıfıra yakın olması",
            "Yüksek hızlarda güvenlik zafiyeti",
            "Fren performansının zayıf kalması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Kaporta Çürümeleri",
                severity: "high",
                reportCount: 6,
                description: "Özellikle çamurluk ağızları ve taban sacında yoğun paslanma/çürüme sorunları."
            },
            {
                id: 2,
                title: "Vites Kolu Boşluğu",
                severity: "low",
                reportCount: 9,
                description: "Zamanla vites kolu burçlarının aşınıp vitesin çorba gibi olması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2007,
        brand: "Peugeot",
        model: "406 (2.0)",
        year: "1996 - 2004",
        ncapStars: 4,
        ncapYear: "2006",
        dnaScore: 73,
        strengths: [
            "D segmentine yakışır makam aracı konforu",
            "Film yıldızı (Taxi) karizması ve efsanevi tasarım",
            "Dönemine göre deri koltuk, ısıtma gibi premium donanımlar",
            "Yol tutuşu ve uzun yol rahatlığı"
        ],
        weaknesses: [
            "2.0 benzinli motorun şehir içi yüksek yakıt tüketimi",
            "Otomatik şanzıman arızalarının maliyetli olması",
            "İkinci el piyasasının yavaş ve nazlı olması",
            "Elektronik aksamlarının yaşa bağlı nazlanması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "AL4 Otomatik Şanzıman Arızası",
                severity: "high",
                reportCount: 6,
                description: "Şanzıman elektrovanalarının arızalanıp aracın korumaya geçmesi ve vuruntulu vites geçişleri."
            },
            {
                id: 2,
                title: "Gösterge Paneli Solması",
                severity: "low",
                reportCount: 9,
                description: "Gösterge paneli piksellerinin silinmesi ve kadran hataları."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2008,
        brand: "Opel",
        model: "Astra G (1.4 / 1.6)",
        year: "1998 - 2004",
        ncapStars: 4,
        ncapYear: "2006",
        dnaScore: 72,
        strengths: [
            "Zamansız ve hala çok sevilen dış tasarım",
            "Çok tok ve yola oturan sürüş hissi (Alman mühendisliği)",
            "İç malzeme kalitesinin ve dayanıklılığının yüksekliği",
            "Piyasada altın gibi hızlı alınıp satılabilmesi"
        ],
        weaknesses: [
            "1.4 motorun kasayı taşımakta zorlanması",
            "Süspansiyonların rakiplerine göre biraz sert hissettirmesi",
            "Klima kompresörü sorunları",
            "Bagaj hacminin aileler için sınırda kalması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "EGR Valfi ve Bobin Arızası",
                severity: "medium",
                reportCount: 8,
                description: "Ecotec motorlarda EGR valfi tıkanması ve ateşleme bobini yanması çok sıktır."
            },
            {
                id: 2,
                title: "Direksiyon Pompası Sesi",
                severity: "medium",
                reportCount: 6,
                description: "Elektro-hidrolik direksiyon pompasından direksiyon çevrildikçe gelen ıslık/uğultu sesi."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2009,
        brand: "Chevrolet",
        model: "Aveo (1.2)",
        year: "2006 - 2011",
        ncapStars: 3,
        ncapYear: "2006",
        dnaScore: 65,
        strengths: [
            "Bütçe dostu satın alma maliyeti",
            "Şehir içi kullanıma çok uygun boyutlar",
            "GM (Opel) altyapısı sayesinde motor parça uyumu",
            "1.2 motorun vergi avantajı"
        ],
        weaknesses: [
            "1.2 motorun rampalarda ve yüklü durumda bayılması",
            "Kabin içi ses yalıtımının zayıf olması",
            "Chevrolet'in Avrupa'dan çekilmiş olması nedeniyle bazı kaporta parçalarının zor bulunması",
            "Plastik aksam kalitesinin ucuz hissettirmesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Motor Yağ Kaçakları",
                severity: "medium",
                reportCount: 6,
                description: "Külbütör kapağından ve karterden terleme şeklinde yağ sızıntıları kroniktir."
            },
            {
                id: 2,
                title: "LPG Uyumu Sorunları",
                severity: "high",
                reportCount: 7,
                description: "Magnezyum alaşımlı sübaplar nedeniyle LPG'li kullanımda sübap erimesi yaşanması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2010,
        brand: "Fiat",
        model: "Linea (1.4 / 1.3 M.jet)",
        year: "2008 - 2012",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 73,
        strengths: [
            "Dünyanın en ucuz ve en kolay bulunan yedek parçası",
            "Devasa (500 litre) bagaj hacmi ile tam bir aile aracı",
            "1.3 Multijet motorun yakıt cimriliği ve dayanıklılığı",
            "Yerden yüksek yapısıyla Türkiye şartlarına tam uyum"
        ],
        weaknesses: [
            "İç mekanda çok fazla sert ve kalitesiz plastik kullanılması",
            "İzolasyon eksikliği ve içeri yoğun motor sesi alması",
            "Şirket veya taksi çıkması olma ihtimalinin çok yüksek olması",
            "1.4 Fire motorun rampalarda nefesinin kesilmesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Amortisör Takozu Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Ön amortisör takozlarından direksiyon çevrildikçe 'gırç gırç' sesi gelmesi."
            },
            {
                id: 2,
                title: "Göğüs (Konsol) Çatlaması",
                severity: "medium",
                reportCount: 6,
                description: "Özellikle güneş altında kalan Linea'larda yolcu havayastığı hizasında göğüs plastiğinin çatlaması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2011,
        brand: "Ford",
        model: "Fiesta (1.4)",
        year: "2015 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 78,
        strengths: [
            "Sınıfının En İyi Yol Tutuş Dinamikleri (Viraj Ustası)",
            "Hissiyatı ve Geri Bildirimi Çok Başarılı Direksiyon Kutusu",
            "Sağlam Gövde Yapısı ve Tok Süspansiyon Karakteri",
            "Dayanıklı ve Uzun Ömürlü Mekanik Altyapı"
        ],
        weaknesses: [
            "Arka Baş/Diz Mesafesinin Rakiplerinden Dar Olması (Tasarım Kaynaklı)",
            "Kabinde B Sütunundan ve Kapılardan Trim Sesi Gelmesi",
            "Otomatik Şanzımanların (Powershift) Düşük Hız Kararsızlığı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesi (B Sütunu ve Kapılar)",
                severity: "low",
                reportCount: 6,
                description: "Emniyet kemeri çıkışından ve kapı fitillerinden gıcırtılar duyulması."
            },
            {
                id: 2,
                title: "Powershift Şanzıman Silkelemesi",
                severity: "medium",
                reportCount: 6,
                description: "Çift kavramalı vites kutusunda düşük hız kalkışlarında sarsıntı hissedilmesi."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2012,
        brand: "Hyundai",
        model: "Accent Admire (1.3)",
        year: "2003 - 2006",
        ncapStars: 5,
        ncapYear: "2006",
        dnaScore: 78,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 9,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2013,
        brand: "Renault",
        model: "Symbol (1.5 dCi)",
        year: "2008 - 2012",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 73,
        strengths: [
            "Mükemmel Yakıt Ekonomisi (Özellikle dCi & TCe motorlar)",
            "Yaygın Servis Ağı ve Çok Uygun Yedek Parça Maliyeti",
            "Yüksek İkinci El Piyasası (Altın gibi kolay satılır)",
            "Pratik Kabin Kullanımı ve Geniş Bagaj Seçenekleri"
        ],
        weaknesses: [
            "Kabin İçi Sert Plastik Malzeme Yoğunluğu",
            "Yüksek Hızlarda Yol ve Rüzgar Sesi (Ortalama Yalıtım)",
            "Bozuk Yollarda Erken Başlayan Trim Sesleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri (Konsol ve Kapılar)",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda plastik parçaların esnemesiyle tıkırtılar gelebilir."
            },
            {
                id: 2,
                title: "Süspansiyon Gıcırtısı",
                severity: "low",
                reportCount: 9,
                description: "Soğuk havalarda ön amortisör takozlarından gıcırtı sesi duyulabilir."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2014,
        brand: "Honda",
        model: "Civic (VTEC 2)",
        year: "2001 - 2006",
        ncapStars: 4,
        ncapYear: "2006",
        dnaScore: 83,
        strengths: [
            "Sorunsuz VTEC Motor Teknolojisi",
            "Sportif Oturma Pozisyonu ve Keyifli Sürüş Dinamikleri",
            "Çok Geniş ve Kullanışlı İç Yaşam Alanı",
            "Fabrikasyon LPG Garantili Seçenekler (Eco paketler)"
        ],
        weaknesses: [
            "Kabin İçi Yol ve Lastik Sesinin Yüksek Olması",
            "İnce Kaporta Sacı ve Boya Katmanı",
            "Kasislerde ve Tümseklerde Alt Sürtme Hassasiyeti"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yol Sesi Alma",
                severity: "low",
                reportCount: 7,
                description: "Davlumbaz içi ve kapı fitillerinin zayıflığı sebebiyle yol gürültüsü kabine yansır."
            },
            {
                id: 2,
                title: "Direksiyon Kutusu Tıkırtısı",
                severity: "medium",
                reportCount: 6,
                description: "Özellikle bozuk yollarda direksiyon milinden gelen hafif tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2015,
        brand: "Opel",
        model: "Astra (H Kasa)",
        year: "2015 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 79,
        strengths: [
            "Alman Sürüş Karakteri ve Tok Kapı Hissiyatı",
            "Sınıfının En İyi Yol Tutuş Limitleri ve Sağlam Şasi",
            "AGR Sertifikalı Konforlu ve Ergonomik Koltuk Yapısı",
            "Yüksek Hızlarda Güven Veren Düz Hat Kararlılığı"
        ],
        weaknesses: [
            "Ağır Kasa Ağırlığı ve Buna Bağlı Yüksek Şehir İçi Tüketim",
            "Multimedya Arayüzünün Bazen Donma Yapması",
            "Yedek Parça Maliyetlerinin Fransız Rakiplerinden Yüksek Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Çelik Supap Gereksinimi (LPG'de)",
                severity: "medium",
                reportCount: 8,
                description: "LPG uyumunda supap erimesi yaşanabilir, çelik supap değişimi önerilir."
            },
            {
                id: 2,
                title: "Soğutma Suyu Hortum Terlemesi",
                severity: "low",
                reportCount: 6,
                description: "Genleşme kabı ve hortumlardan soğutma suyu sızıntısı riski."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2016,
        brand: "Ford",
        model: "Focus (MK2)",
        year: "2015 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 76,
        strengths: [
            "Sınıfının En İyi Yol Tutuş Dinamikleri (Viraj Ustası)",
            "Hissiyatı ve Geri Bildirimi Çok Başarılı Direksiyon Kutusu",
            "Sağlam Gövde Yapısı ve Tok Süspansiyon Karakteri",
            "Dayanıklı ve Uzun Ömürlü Mekanik Altyapı"
        ],
        weaknesses: [
            "Arka Baş/Diz Mesafesinin Rakiplerinden Dar Olması (Tasarım Kaynaklı)",
            "Kabinde B Sütunundan ve Kapılardan Trim Sesi Gelmesi",
            "Otomatik Şanzımanların (Powershift) Düşük Hız Kararsızlığı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesi (B Sütunu ve Kapılar)",
                severity: "low",
                reportCount: 8,
                description: "Emniyet kemeri çıkışından ve kapı fitillerinden gıcırtılar duyulması."
            },
            {
                id: 2,
                title: "Powershift Şanzıman Silkelemesi",
                severity: "medium",
                reportCount: 9,
                description: "Çift kavramalı vites kutusunda düşük hız kalkışlarında sarsıntı hissedilmesi."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2017,
        brand: "Renault",
        model: "Clio 3. Nesil (2005-2014)",
        year: "2005-2014",
        ncapStars: 5,
        ncapYear: "2005",
        dnaScore: 72,
        strengths: [
            "5 Yıldız Euro NCAP Güvenlik (2005 testi - Sınıfında ilklerden)",
            "1.5 dCi Motorun Olgunlaşmış ve Güvenilir Performansı (Ortalama 4.5L/100km)",
            "Clio RS 197/200 ile Sıcak Hatch Efsanesi (Nürburgring rekortmeni)",
            "Geniş Ön Yaşam Alanı ve Ergonomik Sürücü Pozisyonu",
            "Ucuz ve Kolay Bulunan Yedek Parça (Türkiye üretimi avantajı)",
            "Dönemine Göre Kaliteli İç Mekan Malzemeleri"
        ],
        weaknesses: [
            "Arka Koltuk ve Bagaj Hacminin Rakiplerine Göre Dar Olması",
            "Otomatik (EDC) Versiyonun Olmaması (Sadece robotize Quickshift var)",
            "Direksiyon Hissiyatının Yapay ve Hafif Olması",
            "Yüksek Hızlarda Rüzgar Sesi (Ayna diplerinden)",
            "Quickshift Robotize Şanzımanın Gecikmeli ve Sarsıntılı Vites Geçişleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Ön Yay ve Amortisör Takozu Çökmesi",
                severity: "medium",
                reportCount: 9,
                description: "Ön süspansiyon yaylarının kırılması ve amortisör takozlarının ezilmesi Clio 3'ün en sık karşılaşılan mekanik sorunudur. Bozuk yollarda tok vuruntu sesleri duyulur. Genelde 60.000-80.000 km civarında başlar."
            },
            {
                id: 2,
                title: "Turbo Hortumu Patlaması (1.5 dCi)",
                severity: "high",
                reportCount: 8,
                description: "Turbo intercooler hortumlarının ısı ve basınçla zamanla şişerek patlaması veya kelepçe yerinden çıkması. Araç ani güç kaybı yaşar ve motor arıza lambası yanar. Silikon hortuma geçiş önerilir."
            },
            {
                id: 3,
                title: "Kart Okuyucu ve İmmobilizer Arızası",
                severity: "high",
                reportCount: 8,
                description: "Anahtarsız giriş kartının algılanmaması veya 'Kart Algılanmadı' uyarısıyla aracın çalışmaması. Kart okuyucu modülü veya kartın pilinin bitmesi olabilir. Yedek kartla denenmelidir."
            },
            {
                id: 4,
                title: "Egzoz Esnek Boru Kopmesi",
                severity: "medium",
                reportCount: 7,
                description: "Egzoz manifoldu ile katalizör arasındaki esnek boru bağlantısının çürüyerek kopması. Motor altından gelen metalik ses ve egzoz kokusu belirtileridir."
            },
            {
                id: 5,
                title: "Gösterge Paneli Piksel Bozulması",
                severity: "low",
                reportCount: 8,
                description: "Gösterge panelindeki küçük LCD ekranda (kilometre sayacı, trip bilgisi) piksellerin kaybolması veya solması. Özellikle sıcak havalarda belirginleşir. Ekran modülü değişimi gerektirir."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2018,
        brand: "Fiat",
        model: "Linea (1.3 / 1.6 M.jet)",
        year: "2015 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 75,
        strengths: [
            "Fiyat/Performans Dengesinde Sınıf Liderliği",
            "Mekanik Sadeliği Sayesinde Masrafsız Kullanım",
            "Türkiye Yol Şartlarına Son Derece Uygun Yumuşak Süspansiyon",
            "Bakkalda Bile Bulunabilen Aşırı Ucuz Yedek Parça"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol Tutuş ve Güvenlik Hissi Eksikliği",
            "Zayıf Kabin Ses Yalıtımı",
            "Malzeme Kalitesinin Sınıf Standartlarının Altında Kalması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Amortisör Takozu Sesi",
                severity: "low",
                reportCount: 7,
                description: "Kasis geçişlerinde direksiyon kırıldığında 'lok lok' sesi duyulması yaygındır."
            },
            {
                id: 2,
                title: "Krom Detay Soyulması",
                severity: "low",
                reportCount: 8,
                description: "Dış kapı kollarındaki ve panjurdaki kromajların zamanla dökülmesi."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2019,
        brand: "Renault",
        model: "Megane 2",
        year: "2015 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 77,
        strengths: [
            "Mükemmel Yakıt Ekonomisi (Özellikle dCi & TCe motorlar)",
            "Yaygın Servis Ağı ve Çok Uygun Yedek Parça Maliyeti",
            "Yüksek İkinci El Piyasası (Altın gibi kolay satılır)",
            "Pratik Kabin Kullanımı ve Geniş Bagaj Seçenekleri"
        ],
        weaknesses: [
            "Kabin İçi Sert Plastik Malzeme Yoğunluğu",
            "Yüksek Hızlarda Yol ve Rüzgar Sesi (Ortalama Yalıtım)",
            "Bozuk Yollarda Erken Başlayan Trim Sesleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri (Konsol ve Kapılar)",
                severity: "low",
                reportCount: 7,
                description: "Bozuk yollarda plastik parçaların esnemesiyle tıkırtılar gelebilir."
            },
            {
                id: 2,
                title: "Süspansiyon Gıcırtısı",
                severity: "low",
                reportCount: 6,
                description: "Soğuk havalarda ön amortisör takozlarından gıcırtı sesi duyulabilir."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2020,
        brand: "Kia",
        model: "Rio",
        year: "2015 - 2024",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 79,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 9,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2021,
        brand: "Mitsubishi",
        model: "Colt (1.3)",
        year: "2005 - 2010",
        ncapStars: 4,
        ncapYear: "2006",
        dnaScore: 77,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 8,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2022,
        brand: "Peugeot",
        model: "207",
        year: "2007 - 2011",
        ncapStars: 4,
        ncapYear: "2006",
        dnaScore: 76,
        strengths: [
            "Sınıfının En Şık, Agresif ve Fütüristik Tasarımı",
            "i-Cockpit ile Teknolojik ve Benzersiz Sürüş Deneyimi",
            "EAT6 / EAT8 Şanzımanların Muazzam Vites Konforu ve Sorunsuzluğu",
            "Yumuşak ve Konforlu Süspansiyon Karakteri (Uçan Halı Konforu)"
        ],
        weaknesses: [
            "AdBlue Tank ve Emisyon Sistemi Hassasiyeti (Dizellerde)",
            "Triger Kayışının Yağ İçinde Aşınması Riski (1.2 PureTech)",
            "Bazı Elektronik Sensörlerin Ara Sıra Hata Vermesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "AdBlue Depo Arızası",
                severity: "high",
                reportCount: 9,
                description: "AdBlue pompası veya deposunun arızalanması sonucu emisyon hatası uyarısı."
            },
            {
                id: 2,
                title: "PureTech Triger Çapaklanması",
                severity: "high",
                reportCount: 6,
                description: "Yağ banyolu triger kayışının zamanla soyulup yağ pompasını tıkaması riski."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2023,
        brand: "Volkswagen",
        model: "Golf 4",
        year: "1998 - 2004",
        ncapStars: 4,
        ncapYear: "2006",
        dnaScore: 73,
        strengths: [
            "Sınıfının Referans Noktası Olan Konfor ve İzolasyon",
            "DSG Şanzımanın Kusursuz Hızlı Geçişleri ve Verimliliği",
            "Kabin İçi Malzeme Kalitesi ve Yüksek İŞçilik Standardı",
            "Yüksek İkinci El Değeri ve Çok Popüler Olması"
        ],
        weaknesses: [
            "Çift Kavramalı (DSG) Şanzımanın Mekatronik Arıza Riski",
            "Baz/Giriş Paketlerinin Çok Boş ve Donanımsız Olması",
            "Yüksek Periyodik Bakım ve Yetkili Servis Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Mekatronik/Kavrama Aşınması",
                severity: "high",
                reportCount: 8,
                description: "Yoğun trafikte şanzımanın ısınması veya kavrama titremesi yapması yaygındır."
            },
            {
                id: 2,
                title: "SOS / Yazılım Ekran Donması",
                severity: "medium",
                reportCount: 8,
                description: "Multimedya sisteminin ara sıra donması veya göstergede SOS arızası çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2024,
        brand: "Renault",
        model: "Fluence (1.5 dCi)",
        year: "2015 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 77,
        strengths: [
            "Mükemmel Yakıt Ekonomisi (Özellikle dCi & TCe motorlar)",
            "Yaygın Servis Ağı ve Çok Uygun Yedek Parça Maliyeti",
            "Yüksek İkinci El Piyasası (Altın gibi kolay satılır)",
            "Pratik Kabin Kullanımı ve Geniş Bagaj Seçenekleri"
        ],
        weaknesses: [
            "Kabin İçi Sert Plastik Malzeme Yoğunluğu",
            "Yüksek Hızlarda Yol ve Rüzgar Sesi (Ortalama Yalıtım)",
            "Bozuk Yollarda Erken Başlayan Trim Sesleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri (Konsol ve Kapılar)",
                severity: "low",
                reportCount: 8,
                description: "Bozuk yollarda plastik parçaların esnemesiyle tıkırtılar gelebilir."
            },
            {
                id: 2,
                title: "Süspansiyon Gıcırtısı",
                severity: "low",
                reportCount: 6,
                description: "Soğuk havalarda ön amortisör takozlarından gıcırtı sesi duyulabilir."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2025,
        brand: "Opel",
        model: "Astra J Kasa (1.3 Dizel)",
        year: "2015 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 72,
        strengths: [
            "Alman Sürüş Karakteri ve Tok Kapı Hissiyatı",
            "Sınıfının En İyi Yol Tutuş Limitleri ve Sağlam Şasi",
            "AGR Sertifikalı Konforlu ve Ergonomik Koltuk Yapısı",
            "Yüksek Hızlarda Güven Veren Düz Hat Kararlılığı"
        ],
        weaknesses: [
            "Ağır Kasa Ağırlığı ve Buna Bağlı Yüksek Şehir İçi Tüketim",
            "Multimedya Arayüzünün Bazen Donma Yapması",
            "Yedek Parça Maliyetlerinin Fransız Rakiplerinden Yüksek Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Çelik Supap Gereksinimi (LPG'de)",
                severity: "medium",
                reportCount: 6,
                description: "LPG uyumunda supap erimesi yaşanabilir, çelik supap değişimi önerilir."
            },
            {
                id: 2,
                title: "Soğutma Suyu Hortum Terlemesi",
                severity: "low",
                reportCount: 9,
                description: "Genleşme kabı ve hortumlardan soğutma suyu sızıntısı riski."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2026,
        brand: "Peugeot / Citroen",
        model: "301 / C-Elysee",
        year: "2015 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 79,
        strengths: [
            "Sınıfının En Şık, Agresif ve Fütüristik Tasarımı",
            "i-Cockpit ile Teknolojik ve Benzersiz Sürüş Deneyimi",
            "EAT6 / EAT8 Şanzımanların Muazzam Vites Konforu ve Sorunsuzluğu",
            "Yumuşak ve Konforlu Süspansiyon Karakteri (Uçan Halı Konforu)"
        ],
        weaknesses: [
            "AdBlue Tank ve Emisyon Sistemi Hassasiyeti (Dizellerde)",
            "Triger Kayışının Yağ İçinde Aşınması Riski (1.2 PureTech)",
            "Bazı Elektronik Sensörlerin Ara Sıra Hata Vermesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "AdBlue Depo Arızası",
                severity: "high",
                reportCount: 9,
                description: "AdBlue pompası veya deposunun arızalanması sonucu emisyon hatası uyarısı."
            },
            {
                id: 2,
                title: "PureTech Triger Çapaklanması",
                severity: "high",
                reportCount: 6,
                description: "Yağ banyolu triger kayışının zamanla soyulup yağ pompasını tıkaması riski."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2027,
        brand: "Volkswagen",
        model: "Golf 6 (BlueMotion)",
        year: "2010 - 2012",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 78,
        strengths: [
            "Sınıfının Referans Noktası Olan Konfor ve İzolasyon",
            "DSG Şanzımanın Kusursuz Hızlı Geçişleri ve Verimliliği",
            "Kabin İçi Malzeme Kalitesi ve Yüksek İŞçilik Standardı",
            "Yüksek İkinci El Değeri ve Çok Popüler Olması"
        ],
        weaknesses: [
            "Çift Kavramalı (DSG) Şanzımanın Mekatronik Arıza Riski",
            "Baz/Giriş Paketlerinin Çok Boş ve Donanımsız Olması",
            "Yüksek Periyodik Bakım ve Yetkili Servis Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Mekatronik/Kavrama Aşınması",
                severity: "high",
                reportCount: 8,
                description: "Yoğun trafikte şanzımanın ısınması veya kavrama titremesi yapması yaygındır."
            },
            {
                id: 2,
                title: "SOS / Yazılım Ekran Donması",
                severity: "medium",
                reportCount: 7,
                description: "Multimedya sisteminin ara sıra donması veya göstergede SOS arızası çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2028,
        brand: "Renault",
        model: "Grand Scenic (1.5 dCi)",
        year: "2011 - 2014",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 79,
        strengths: [
            "Mükemmel Yakıt Ekonomisi (Özellikle dCi & TCe motorlar)",
            "Yaygın Servis Ağı ve Çok Uygun Yedek Parça Maliyeti",
            "Yüksek İkinci El Piyasası (Altın gibi kolay satılır)",
            "Pratik Kabin Kullanımı ve Geniş Bagaj Seçenekleri"
        ],
        weaknesses: [
            "Kabin İçi Sert Plastik Malzeme Yoğunluğu",
            "Yüksek Hızlarda Yol ve Rüzgar Sesi (Ortalama Yalıtım)",
            "Bozuk Yollarda Erken Başlayan Trim Sesleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri (Konsol ve Kapılar)",
                severity: "low",
                reportCount: 8,
                description: "Bozuk yollarda plastik parçaların esnemesiyle tıkırtılar gelebilir."
            },
            {
                id: 2,
                title: "Süspansiyon Gıcırtısı",
                severity: "low",
                reportCount: 9,
                description: "Soğuk havalarda ön amortisör takozlarından gıcırtı sesi duyulabilir."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2029,
        brand: "Hyundai",
        model: "i20 1. Nesil PB (2008-2014)",
        year: "2008-2014",
        ncapStars: 5,
        ncapYear: "2009",
        dnaScore: 74,
        strengths: [
            "5 Yıl Fabrika Garantisi ile Gönül Rahatlığı",
            "Sınıfına Göre Geniş İç Mekan ve Bagaj Hacmi (295 Litre)",
            "Düşük Yakıt Tüketimi (1.4 CRDi ile 4.5L/100km)",
            "Sessiz ve Konforlu Kabin Yalıtımı (Sınıfının en iyilerinden)",
            "Sorunsuz ve Güvenilir 1.2/1.4 Atmosferik Benzinli Motorlar"
        ],
        weaknesses: [
            "Sönük ve Sıradan Dış Tasarım (Rakiplerine göre dikkat çekmiyor)",
            "Direksiyon Hissiyatının Çok Hafif ve Yapay Olması",
            "Otomatik Şanzıman Seçeneğinin Sınırlı Olması (4 ileri konvansiyonel)",
            "Düşük Donanımlı Paketlerin Çok Boş Kalması",
            "Sert Plastik İç Mekan Malzemeleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Direksiyon Kutusu Boşluğu ve Tıkırtı",
                severity: "medium",
                reportCount: 8,
                description: "Kasislerde direksiyondan gelen tıkırtı sesi ve direksiyondaki boşluk hissi. Genellikle direksiyon rot başı veya rotil bilyası kaynaklı."
            },
            {
                id: 2,
                title: "Arka Fren Kampana ve Balata Gıcırtısı",
                severity: "low",
                reportCount: 7,
                description: "Arka kampana frenlerde özellikle nemli havalarda veya sabah ilk kullanımda metal sürtünme sesi ve gıcırtı duyulması."
            },
            {
                id: 3,
                title: "Klima Kompresörü Kavrama Sesi",
                severity: "low",
                reportCount: 6,
                description: "Klima devreye girerken kompresör kavramasından gelen 'tık' sesi ve hafif sarsıntı. Normal çalışma sesi olup fazla belirginse kavrama kontrolü gerekebilir."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2030,
        brand: "Mercedes",
        model: "E Serisi (W210 Kompressor)",
        year: "1996 - 2001",
        ncapStars: 3,
        ncapYear: "1998",
        dnaScore: 87,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 7,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2031,
        brand: "Fiat",
        model: "Egea (1.3/1.6 M.jet, 1.4 Fire)",
        year: "2015 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 76,
        strengths: [
            "Fiyat/Performans Dengesinde Sınıf Liderliği",
            "Mekanik Sadeliği Sayesinde Masrafsız Kullanım",
            "Türkiye Yol Şartlarına Son Derece Uygun Yumuşak Süspansiyon",
            "Bakkalda Bile Bulunabilen Aşırı Ucuz Yedek Parça"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol Tutuş ve Güvenlik Hissi Eksikliği",
            "Zayıf Kabin Ses Yalıtımı",
            "Malzeme Kalitesinin Sınıf Standartlarının Altında Kalması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Amortisör Takozu Sesi",
                severity: "low",
                reportCount: 7,
                description: "Kasis geçişlerinde direksiyon kırıldığında 'lok lok' sesi duyulması yaygındır."
            },
            {
                id: 2,
                title: "Krom Detay Soyulması",
                severity: "low",
                reportCount: 6,
                description: "Dış kapı kollarındaki ve panjurdaki kromajların zamanla dökülmesi."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2032,
        brand: "Renault",
        model: "Megane 4 (Joy Paket)",
        year: "2015 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 77,
        strengths: [
            "Mükemmel Yakıt Ekonomisi (Özellikle dCi & TCe motorlar)",
            "Yaygın Servis Ağı ve Çok Uygun Yedek Parça Maliyeti",
            "Yüksek İkinci El Piyasası (Altın gibi kolay satılır)",
            "Pratik Kabin Kullanımı ve Geniş Bagaj Seçenekleri"
        ],
        weaknesses: [
            "Kabin İçi Sert Plastik Malzeme Yoğunluğu",
            "Yüksek Hızlarda Yol ve Rüzgar Sesi (Ortalama Yalıtım)",
            "Bozuk Yollarda Erken Başlayan Trim Sesleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri (Konsol ve Kapılar)",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda plastik parçaların esnemesiyle tıkırtılar gelebilir."
            },
            {
                id: 2,
                title: "Süspansiyon Gıcırtısı",
                severity: "low",
                reportCount: 7,
                description: "Soğuk havalarda ön amortisör takozlarından gıcırtı sesi duyulabilir."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2033,
        brand: "Ford",
        model: "Focus MK3 (1.6 TDCi)",
        year: "2015 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 77,
        strengths: [
            "Sınıfının En İyi Yol Tutuş Dinamikleri (Viraj Ustası)",
            "Hissiyatı ve Geri Bildirimi Çok Başarılı Direksiyon Kutusu",
            "Sağlam Gövde Yapısı ve Tok Süspansiyon Karakteri",
            "Dayanıklı ve Uzun Ömürlü Mekanik Altyapı"
        ],
        weaknesses: [
            "Arka Baş/Diz Mesafesinin Rakiplerinden Dar Olması (Tasarım Kaynaklı)",
            "Kabinde B Sütunundan ve Kapılardan Trim Sesi Gelmesi",
            "Otomatik Şanzımanların (Powershift) Düşük Hız Kararsızlığı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesi (B Sütunu ve Kapılar)",
                severity: "low",
                reportCount: 9,
                description: "Emniyet kemeri çıkışından ve kapı fitillerinden gıcırtılar duyulması."
            },
            {
                id: 2,
                title: "Powershift Şanzıman Silkelemesi",
                severity: "medium",
                reportCount: 9,
                description: "Çift kavramalı vites kutusunda düşük hız kalkışlarında sarsıntı hissedilmesi."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2034,
        brand: "Volkswagen",
        model: "Jetta & Golf 6",
        year: "2015 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 73,
        strengths: [
            "Sınıfının Referans Noktası Olan Konfor ve İzolasyon",
            "DSG Şanzımanın Kusursuz Hızlı Geçişleri ve Verimliliği",
            "Kabin İçi Malzeme Kalitesi ve Yüksek İŞçilik Standardı",
            "Yüksek İkinci El Değeri ve Çok Popüler Olması"
        ],
        weaknesses: [
            "Çift Kavramalı (DSG) Şanzımanın Mekatronik Arıza Riski",
            "Baz/Giriş Paketlerinin Çok Boş ve Donanımsız Olması",
            "Yüksek Periyodik Bakım ve Yetkili Servis Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Mekatronik/Kavrama Aşınması",
                severity: "high",
                reportCount: 6,
                description: "Yoğun trafikte şanzımanın ısınması veya kavrama titremesi yapması yaygındır."
            },
            {
                id: 2,
                title: "SOS / Yazılım Ekran Donması",
                severity: "medium",
                reportCount: 9,
                description: "Multimedya sisteminin ara sıra donması veya göstergede SOS arızası çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2035,
        brand: "Hyundai",
        model: "Accent Blue",
        year: "2013 - 2017",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 82,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 9,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2036,
        brand: "Honda",
        model: "Civic FB7",
        year: "2012 - 2016",
        ncapStars: 5,
        ncapYear: "2015",
        dnaScore: 79,
        strengths: [
            "Sorunsuz VTEC Motor Teknolojisi",
            "Sportif Oturma Pozisyonu ve Keyifli Sürüş Dinamikleri",
            "Çok Geniş ve Kullanışlı İç Yaşam Alanı",
            "Fabrikasyon LPG Garantili Seçenekler (Eco paketler)"
        ],
        weaknesses: [
            "Kabin İçi Yol ve Lastik Sesinin Yüksek Olması",
            "İnce Kaporta Sacı ve Boya Katmanı",
            "Kasislerde ve Tümseklerde Alt Sürtme Hassasiyeti"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yol Sesi Alma",
                severity: "low",
                reportCount: 9,
                description: "Davlumbaz içi ve kapı fitillerinin zayıflığı sebebiyle yol gürültüsü kabine yansır."
            },
            {
                id: 2,
                title: "Direksiyon Kutusu Tıkırtısı",
                severity: "medium",
                reportCount: 6,
                description: "Özellikle bozuk yollarda direksiyon milinden gelen hafif tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2037,
        brand: "Toyota",
        model: "Corolla (E150 Kasa)",
        year: "2007 - 2012",
        ncapStars: 5,
        ncapYear: "2006",
        dnaScore: 85,
        strengths: [
            "Efsanevi Japon Mekanik Dayanıklılığı ve Arıza Yapmama",
            "Son Derece Düşük Yakıt Tüketimi (Hibrit modellerinde)",
            "Çok Hızlı El Değiştiren Güçlü İkinci El Piyasası",
            "LPG Uyumu Mükemmel Atmosferik Motorlar"
        ],
        weaknesses: [
            "Yüksek Hızlarda Rüzgar ve Yol Sesi (Yalıtım eksikliği)",
            "Multimedya Sisteminin Grafik ve Teknolojik Olarak Geri Kalması",
            "İnce Boya Kalitesi (Çizilmeye ve taş izlerine hassas)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "İnce Boya Katmanı",
                severity: "medium",
                reportCount: 9,
                description: "Kaportanın taş izlerine ve çizilmelere karşı hassas olması boya atmasına yol açabilir."
            },
            {
                id: 2,
                title: "Direksiyon Derisi Aşınması",
                severity: "low",
                reportCount: 7,
                description: "Direksiyon simidi derisinin erken kilometrelerde yıpranması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2038,
        brand: "Opel",
        model: "Astra J Kasa",
        year: "2013 - 2017",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 72,
        strengths: [
            "Alman Sürüş Karakteri ve Tok Kapı Hissiyatı",
            "Sınıfının En İyi Yol Tutuş Limitleri ve Sağlam Şasi",
            "AGR Sertifikalı Konforlu ve Ergonomik Koltuk Yapısı",
            "Yüksek Hızlarda Güven Veren Düz Hat Kararlılığı"
        ],
        weaknesses: [
            "Ağır Kasa Ağırlığı ve Buna Bağlı Yüksek Şehir İçi Tüketim",
            "Multimedya Arayüzünün Bazen Donma Yapması",
            "Yedek Parça Maliyetlerinin Fransız Rakiplerinden Yüksek Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Çelik Supap Gereksinimi (LPG'de)",
                severity: "medium",
                reportCount: 9,
                description: "LPG uyumunda supap erimesi yaşanabilir, çelik supap değişimi önerilir."
            },
            {
                id: 2,
                title: "Soğutma Suyu Hortum Terlemesi",
                severity: "low",
                reportCount: 6,
                description: "Genleşme kabı ve hortumlardan soğutma suyu sızıntısı riski."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2039,
        brand: "Citroen",
        model: "C4 (1.6 BlueHDi)",
        year: "2015 - 2016",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 76,
        strengths: [
            "Sınıfının En Şık, Agresif ve Fütüristik Tasarımı",
            "i-Cockpit ile Teknolojik ve Benzersiz Sürüş Deneyimi",
            "EAT6 / EAT8 Şanzımanların Muazzam Vites Konforu ve Sorunsuzluğu",
            "Yumuşak ve Konforlu Süspansiyon Karakteri (Uçan Halı Konforu)"
        ],
        weaknesses: [
            "AdBlue Tank ve Emisyon Sistemi Hassasiyeti (Dizellerde)",
            "Triger Kayışının Yağ İçinde Aşınması Riski (1.2 PureTech)",
            "Bazı Elektronik Sensörlerin Ara Sıra Hata Vermesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "AdBlue Depo Arızası",
                severity: "high",
                reportCount: 6,
                description: "AdBlue pompası veya deposunun arızalanması sonucu emisyon hatası uyarısı."
            },
            {
                id: 2,
                title: "PureTech Triger Çapaklanması",
                severity: "high",
                reportCount: 7,
                description: "Yağ banyolu triger kayışının zamanla soyulup yağ pompasını tıkaması riski."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2040,
        brand: "Citroen",
        model: "C3 (1.2 Puretech)",
        year: "2020 - 2021",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 77,
        strengths: [
            "Sınıfının En Şık, Agresif ve Fütüristik Tasarımı",
            "i-Cockpit ile Teknolojik ve Benzersiz Sürüş Deneyimi",
            "EAT6 / EAT8 Şanzımanların Muazzam Vites Konforu ve Sorunsuzluğu",
            "Yumuşak ve Konforlu Süspansiyon Karakteri (Uçan Halı Konforu)"
        ],
        weaknesses: [
            "AdBlue Tank ve Emisyon Sistemi Hassasiyeti (Dizellerde)",
            "Triger Kayışının Yağ İçinde Aşınması Riski (1.2 PureTech)",
            "Bazı Elektronik Sensörlerin Ara Sıra Hata Vermesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "AdBlue Depo Arızası",
                severity: "high",
                reportCount: 6,
                description: "AdBlue pompası veya deposunun arızalanması sonucu emisyon hatası uyarısı."
            },
            {
                id: 2,
                title: "PureTech Triger Çapaklanması",
                severity: "high",
                reportCount: 7,
                description: "Yağ banyolu triger kayışının zamanla soyulup yağ pompasını tıkaması riski."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2041,
        brand: "Fiat",
        model: "Doblo (1.6 M.jet)",
        year: "2022 - 2023",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 73,
        strengths: [
            "Fiyat/Performans Dengesinde Sınıf Liderliği",
            "Mekanik Sadeliği Sayesinde Masrafsız Kullanım",
            "Türkiye Yol Şartlarına Son Derece Uygun Yumuşak Süspansiyon",
            "Bakkalda Bile Bulunabilen Aşırı Ucuz Yedek Parça"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol Tutuş ve Güvenlik Hissi Eksikliği",
            "Zayıf Kabin Ses Yalıtımı",
            "Malzeme Kalitesinin Sınıf Standartlarının Altında Kalması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Amortisör Takozu Sesi",
                severity: "low",
                reportCount: 9,
                description: "Kasis geçişlerinde direksiyon kırıldığında 'lok lok' sesi duyulması yaygındır."
            },
            {
                id: 2,
                title: "Krom Detay Soyulması",
                severity: "low",
                reportCount: 7,
                description: "Dış kapı kollarındaki ve panjurdaki kromajların zamanla dökülmesi."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2042,
        brand: "Toyota / Honda",
        model: "Auris vb. (CVT)",
        year: "2014 - 2017",
        ncapStars: 5,
        ncapYear: "2015",
        dnaScore: 87,
        strengths: [
            "Efsanevi Japon Mekanik Dayanıklılığı ve Arıza Yapmama",
            "Son Derece Düşük Yakıt Tüketimi (Hibrit modellerinde)",
            "Çok Hızlı El Değiştiren Güçlü İkinci El Piyasası",
            "LPG Uyumu Mükemmel Atmosferik Motorlar"
        ],
        weaknesses: [
            "Yüksek Hızlarda Rüzgar ve Yol Sesi (Yalıtım eksikliği)",
            "Multimedya Sisteminin Grafik ve Teknolojik Olarak Geri Kalması",
            "İnce Boya Kalitesi (Çizilmeye ve taş izlerine hassas)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "İnce Boya Katmanı",
                severity: "medium",
                reportCount: 8,
                description: "Kaportanın taş izlerine ve çizilmelere karşı hassas olması boya atmasına yol açabilir."
            },
            {
                id: 2,
                title: "Direksiyon Derisi Aşınması",
                severity: "low",
                reportCount: 8,
                description: "Direksiyon simidi derisinin erken kilometrelerde yıpranması."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2043,
        brand: "Renault",
        model: "Megane 4 (1.5 dCi)",
        year: "2016 - 2018",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 79,
        strengths: [
            "Mükemmel Yakıt Ekonomisi (Özellikle dCi & TCe motorlar)",
            "Yaygın Servis Ağı ve Çok Uygun Yedek Parça Maliyeti",
            "Yüksek İkinci El Piyasası (Altın gibi kolay satılır)",
            "Pratik Kabin Kullanımı ve Geniş Bagaj Seçenekleri"
        ],
        weaknesses: [
            "Kabin İçi Sert Plastik Malzeme Yoğunluğu",
            "Yüksek Hızlarda Yol ve Rüzgar Sesi (Ortalama Yalıtım)",
            "Bozuk Yollarda Erken Başlayan Trim Sesleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri (Konsol ve Kapılar)",
                severity: "low",
                reportCount: 7,
                description: "Bozuk yollarda plastik parçaların esnemesiyle tıkırtılar gelebilir."
            },
            {
                id: 2,
                title: "Süspansiyon Gıcırtısı",
                severity: "low",
                reportCount: 9,
                description: "Soğuk havalarda ön amortisör takozlarından gıcırtı sesi duyulabilir."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2044,
        brand: "Skoda / VW",
        model: "Scala / Jetta",
        year: "2015 - 2020",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 73,
        strengths: [
            "Sınıfının Referans Noktası Olan Konfor ve İzolasyon",
            "DSG Şanzımanın Kusursuz Hızlı Geçişleri ve Verimliliği",
            "Kabin İçi Malzeme Kalitesi ve Yüksek İŞçilik Standardı",
            "Yüksek İkinci El Değeri ve Çok Popüler Olması"
        ],
        weaknesses: [
            "Çift Kavramalı (DSG) Şanzımanın Mekatronik Arıza Riski",
            "Baz/Giriş Paketlerinin Çok Boş ve Donanımsız Olması",
            "Yüksek Periyodik Bakım ve Yetkili Servis Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Mekatronik/Kavrama Aşınması",
                severity: "high",
                reportCount: 6,
                description: "Yoğun trafikte şanzımanın ısınması veya kavrama titremesi yapması yaygındır."
            },
            {
                id: 2,
                title: "SOS / Yazılım Ekran Donması",
                severity: "medium",
                reportCount: 8,
                description: "Multimedya sisteminin ara sıra donması veya göstergede SOS arızası çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2045,
        brand: "Dacia",
        model: "Sandero (2022+)",
        year: "2022 - 2024",
        ncapStars: 3,
        ncapYear: "2021",
        dnaScore: 69,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 6,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2046,
        brand: "Renault",
        model: "Clio 5 (1.0 TCe - Icon Paket)",
        year: "2020-2025",
        ncapStars: 5,
        ncapYear: "2019",
        dnaScore: 77,
        strengths: [
            "100 HP TCe Motor ile Şehir İçi Yeterli Performans (0-100: 11.8 sn)",
            "Icon Paket ile Zengin Donanım (7'' Ekran, Geri Görüş Kamerası, Otomatik Klima)",
            "Mükemmel Yakıt Ekonomisi (Şehir içi 5.5-6L, uzun yol 4.5L)",
            "5 Yıldız Euro NCAP (Sınıfının en güvenlilerinden)",
            "İkinci Elde Çok Hızlı Satış (En çok aranan B segmenti)"
        ],
        weaknesses: [
            "1.0 TCe Motorun Otoyolda Zorlanması (Sollama için aşağı vites gerekli)",
            "X-Tronic CVT ile Motor Gürültüsü (Tam gaza basınca motor bağırır)",
            "Icon Pakette LED Far Olmaması (Halojen standart)",
            "Arka Koltuk Diz Mesafesi Dar (Uzun yolculuklar için ideal değil)",
            "Start-Stop Sisteminin Sık Arıza Vermesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "X-Tronic CVT Düşük Hız Silkelenmesi",
                severity: "medium",
                reportCount: 8,
                description: "X-Tronic şanzımanlı versiyonlarda özellikle 20-40 km/s aralığında ve yokuş çıkışlarda silkelenme/titreme hissedilmesi. Yazılım güncellemesi kısmen çözer."
            },
            {
                id: 2,
                title: "Multimedya Ekranı Donma ve Resetleme",
                severity: "low",
                reportCount: 7,
                description: "Easy Link multimedya sisteminin kendi kendine kapanıp yeniden başlaması veya dokunmatik ekranın yanıt vermemesi. Yazılım güncellemesi ile düzelir."
            },
            {
                id: 3,
                title: "Emniyet Kemeri B Sütunu Tıkırtısı",
                severity: "low",
                reportCount: 9,
                description: "B sütunundan gelen ritmik tıkırtı sesi. Emniyet kemeri mekanizmasının plastik kılıfıyla B sütunu arasında boşluk oluşmasından kaynaklanır."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2047,
        brand: "Opel",
        model: "Insignia (1.6 Dizel)",
        year: "2016",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 79,
        strengths: [
            "Alman Sürüş Karakteri ve Tok Kapı Hissiyatı",
            "Sınıfının En İyi Yol Tutuş Limitleri ve Sağlam Şasi",
            "AGR Sertifikalı Konforlu ve Ergonomik Koltuk Yapısı",
            "Yüksek Hızlarda Güven Veren Düz Hat Kararlılığı"
        ],
        weaknesses: [
            "Ağır Kasa Ağırlığı ve Buna Bağlı Yüksek Şehir İçi Tüketim",
            "Multimedya Arayüzünün Bazen Donma Yapması",
            "Yedek Parça Maliyetlerinin Fransız Rakiplerinden Yüksek Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Çelik Supap Gereksinimi (LPG'de)",
                severity: "medium",
                reportCount: 7,
                description: "LPG uyumunda supap erimesi yaşanabilir, çelik supap değişimi önerilir."
            },
            {
                id: 2,
                title: "Soğutma Suyu Hortum Terlemesi",
                severity: "low",
                reportCount: 6,
                description: "Genleşme kabı ve hortumlardan soğutma suyu sızıntısı riski."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2048,
        brand: "Seat",
        model: "Leon (1.6 TDI)",
        year: "2017",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 74,
        strengths: [
            "Sınıfının Referans Noktası Olan Konfor ve İzolasyon",
            "DSG Şanzımanın Kusursuz Hızlı Geçişleri ve Verimliliği",
            "Kabin İçi Malzeme Kalitesi ve Yüksek İŞçilik Standardı",
            "Yüksek İkinci El Değeri ve Çok Popüler Olması"
        ],
        weaknesses: [
            "Çift Kavramalı (DSG) Şanzımanın Mekatronik Arıza Riski",
            "Baz/Giriş Paketlerinin Çok Boş ve Donanımsız Olması",
            "Yüksek Periyodik Bakım ve Yetkili Servis Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Mekatronik/Kavrama Aşınması",
                severity: "high",
                reportCount: 9,
                description: "Yoğun trafikte şanzımanın ısınması veya kavrama titremesi yapması yaygındır."
            },
            {
                id: 2,
                title: "SOS / Yazılım Ekran Donması",
                severity: "medium",
                reportCount: 8,
                description: "Multimedya sisteminin ara sıra donması veya göstergede SOS arızası çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2049,
        brand: "Fiat",
        model: "Egea Sedan (1.6 Multijet Lounge)",
        year: "2022",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 72,
        strengths: [
            "Fiyat/Performans Dengesinde Sınıf Liderliği",
            "Mekanik Sadeliği Sayesinde Masrafsız Kullanım",
            "Türkiye Yol Şartlarına Son Derece Uygun Yumuşak Süspansiyon",
            "Bakkalda Bile Bulunabilen Aşırı Ucuz Yedek Parça"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol Tutuş ve Güvenlik Hissi Eksikliği",
            "Zayıf Kabin Ses Yalıtımı",
            "Malzeme Kalitesinin Sınıf Standartlarının Altında Kalması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Amortisör Takozu Sesi",
                severity: "low",
                reportCount: 7,
                description: "Kasis geçişlerinde direksiyon kırıldığında 'lok lok' sesi duyulması yaygındır."
            },
            {
                id: 2,
                title: "Krom Detay Soyulması",
                severity: "low",
                reportCount: 6,
                description: "Dış kapı kollarındaki ve panjurdaki kromajların zamanla dökülmesi."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2050,
        brand: "Honda",
        model: "City (1.5 Executive)",
        year: "2023",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 80,
        strengths: [
            "Sorunsuz VTEC Motor Teknolojisi",
            "Sportif Oturma Pozisyonu ve Keyifli Sürüş Dinamikleri",
            "Çok Geniş ve Kullanışlı İç Yaşam Alanı",
            "Fabrikasyon LPG Garantili Seçenekler (Eco paketler)"
        ],
        weaknesses: [
            "Kabin İçi Yol ve Lastik Sesinin Yüksek Olması",
            "İnce Kaporta Sacı ve Boya Katmanı",
            "Kasislerde ve Tümseklerde Alt Sürtme Hassasiyeti"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yol Sesi Alma",
                severity: "low",
                reportCount: 6,
                description: "Davlumbaz içi ve kapı fitillerinin zayıflığı sebebiyle yol gürültüsü kabine yansır."
            },
            {
                id: 2,
                title: "Direksiyon Kutusu Tıkırtısı",
                severity: "medium",
                reportCount: 6,
                description: "Özellikle bozuk yollarda direksiyon milinden gelen hafif tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2051,
        brand: "Opel / Hyundai",
        model: "Corsa / i20 (1.2T / 1.0T)",
        year: "2022 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 80,
        strengths: [
            "Alman Sürüş Karakteri ve Tok Kapı Hissiyatı",
            "Sınıfının En İyi Yol Tutuş Limitleri ve Sağlam Şasi",
            "AGR Sertifikalı Konforlu ve Ergonomik Koltuk Yapısı",
            "Yüksek Hızlarda Güven Veren Düz Hat Kararlılığı"
        ],
        weaknesses: [
            "Ağır Kasa Ağırlığı ve Buna Bağlı Yüksek Şehir İçi Tüketim",
            "Multimedya Arayüzünün Bazen Donma Yapması",
            "Yedek Parça Maliyetlerinin Fransız Rakiplerinden Yüksek Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Çelik Supap Gereksinimi (LPG'de)",
                severity: "medium",
                reportCount: 6,
                description: "LPG uyumunda supap erimesi yaşanabilir, çelik supap değişimi önerilir."
            },
            {
                id: 2,
                title: "Soğutma Suyu Hortum Terlemesi",
                severity: "low",
                reportCount: 8,
                description: "Genleşme kabı ve hortumlardan soğutma suyu sızıntısı riski."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2052,
        brand: "Fiat",
        model: "Egea Cross (1.6 Multijet Otomatik)",
        year: "2022 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 77,
        strengths: [
            "Fiyat/Performans Dengesinde Sınıf Liderliği",
            "Mekanik Sadeliği Sayesinde Masrafsız Kullanım",
            "Türkiye Yol Şartlarına Son Derece Uygun Yumuşak Süspansiyon",
            "Bakkalda Bile Bulunabilen Aşırı Ucuz Yedek Parça"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol Tutuş ve Güvenlik Hissi Eksikliği",
            "Zayıf Kabin Ses Yalıtımı",
            "Malzeme Kalitesinin Sınıf Standartlarının Altında Kalması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Amortisör Takozu Sesi",
                severity: "low",
                reportCount: 6,
                description: "Kasis geçişlerinde direksiyon kırıldığında 'lok lok' sesi duyulması yaygındır."
            },
            {
                id: 2,
                title: "Krom Detay Soyulması",
                severity: "low",
                reportCount: 6,
                description: "Dış kapı kollarındaki ve panjurdaki kromajların zamanla dökülmesi."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2053,
        brand: "Opel",
        model: "Astra K Kasa (1.6 Dizel Otomatik)",
        year: "2018 - 2020",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 79,
        strengths: [
            "Alman Sürüş Karakteri ve Tok Kapı Hissiyatı",
            "Sınıfının En İyi Yol Tutuş Limitleri ve Sağlam Şasi",
            "AGR Sertifikalı Konforlu ve Ergonomik Koltuk Yapısı",
            "Yüksek Hızlarda Güven Veren Düz Hat Kararlılığı"
        ],
        weaknesses: [
            "Ağır Kasa Ağırlığı ve Buna Bağlı Yüksek Şehir İçi Tüketim",
            "Multimedya Arayüzünün Bazen Donma Yapması",
            "Yedek Parça Maliyetlerinin Fransız Rakiplerinden Yüksek Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Çelik Supap Gereksinimi (LPG'de)",
                severity: "medium",
                reportCount: 8,
                description: "LPG uyumunda supap erimesi yaşanabilir, çelik supap değişimi önerilir."
            },
            {
                id: 2,
                title: "Soğutma Suyu Hortum Terlemesi",
                severity: "low",
                reportCount: 8,
                description: "Genleşme kabı ve hortumlardan soğutma suyu sızıntısı riski."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2054,
        brand: "Opel",
        model: "Corsa (1.2 Turbo Otomatik)",
        year: "2021 - 2023",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 72,
        strengths: [
            "Alman Sürüş Karakteri ve Tok Kapı Hissiyatı",
            "Sınıfının En İyi Yol Tutuş Limitleri ve Sağlam Şasi",
            "AGR Sertifikalı Konforlu ve Ergonomik Koltuk Yapısı",
            "Yüksek Hızlarda Güven Veren Düz Hat Kararlılığı"
        ],
        weaknesses: [
            "Ağır Kasa Ağırlığı ve Buna Bağlı Yüksek Şehir İçi Tüketim",
            "Multimedya Arayüzünün Bazen Donma Yapması",
            "Yedek Parça Maliyetlerinin Fransız Rakiplerinden Yüksek Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Çelik Supap Gereksinimi (LPG'de)",
                severity: "medium",
                reportCount: 6,
                description: "LPG uyumunda supap erimesi yaşanabilir, çelik supap değişimi önerilir."
            },
            {
                id: 2,
                title: "Soğutma Suyu Hortum Terlemesi",
                severity: "low",
                reportCount: 9,
                description: "Genleşme kabı ve hortumlardan soğutma suyu sızıntısı riski."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2055,
        brand: "Volkswagen",
        model: "Golf / Polo",
        year: "2015 - 2018",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 75,
        strengths: [
            "Sınıfının Referans Noktası Olan Konfor ve İzolasyon",
            "DSG Şanzımanın Kusursuz Hızlı Geçişleri ve Verimliliği",
            "Kabin İçi Malzeme Kalitesi ve Yüksek İŞçilik Standardı",
            "Yüksek İkinci El Değeri ve Çok Popüler Olması"
        ],
        weaknesses: [
            "Çift Kavramalı (DSG) Şanzımanın Mekatronik Arıza Riski",
            "Baz/Giriş Paketlerinin Çok Boş ve Donanımsız Olması",
            "Yüksek Periyodik Bakım ve Yetkili Servis Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Mekatronik/Kavrama Aşınması",
                severity: "high",
                reportCount: 9,
                description: "Yoğun trafikte şanzımanın ısınması veya kavrama titremesi yapması yaygındır."
            },
            {
                id: 2,
                title: "SOS / Yazılım Ekran Donması",
                severity: "medium",
                reportCount: 8,
                description: "Multimedya sisteminin ara sıra donması veya göstergede SOS arızası çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2056,
        brand: "Ford",
        model: "Focus (Hatchback)",
        year: "2016 - 2018",
        ncapStars: 4,
        ncapYear: "2015",
        dnaScore: 77,
        strengths: [
            "Sınıfının En İyi Yol Tutuş Dinamikleri (Viraj Ustası)",
            "Hissiyatı ve Geri Bildirimi Çok Başarılı Direksiyon Kutusu",
            "Sağlam Gövde Yapısı ve Tok Süspansiyon Karakteri",
            "Dayanıklı ve Uzun Ömürlü Mekanik Altyapı"
        ],
        weaknesses: [
            "Arka Baş/Diz Mesafesinin Rakiplerinden Dar Olması (Tasarım Kaynaklı)",
            "Kabinde B Sütunundan ve Kapılardan Trim Sesi Gelmesi",
            "Otomatik Şanzımanların (Powershift) Düşük Hız Kararsızlığı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesi (B Sütunu ve Kapılar)",
                severity: "low",
                reportCount: 6,
                description: "Emniyet kemeri çıkışından ve kapı fitillerinden gıcırtılar duyulması."
            },
            {
                id: 2,
                title: "Powershift Şanzıman Silkelemesi",
                severity: "medium",
                reportCount: 8,
                description: "Çift kavramalı vites kutusunda düşük hız kalkışlarında sarsıntı hissedilmesi."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2057,
        brand: "Opel / Peugeot",
        model: "Astra / 308 (1.2 Puretech)",
        year: "2022 - 2023",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 79,
        strengths: [
            "Sınıfının En Şık, Agresif ve Fütüristik Tasarımı",
            "i-Cockpit ile Teknolojik ve Benzersiz Sürüş Deneyimi",
            "EAT6 / EAT8 Şanzımanların Muazzam Vites Konforu ve Sorunsuzluğu",
            "Yumuşak ve Konforlu Süspansiyon Karakteri (Uçan Halı Konforu)"
        ],
        weaknesses: [
            "AdBlue Tank ve Emisyon Sistemi Hassasiyeti (Dizellerde)",
            "Triger Kayışının Yağ İçinde Aşınması Riski (1.2 PureTech)",
            "Bazı Elektronik Sensörlerin Ara Sıra Hata Vermesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "AdBlue Depo Arızası",
                severity: "high",
                reportCount: 6,
                description: "AdBlue pompası veya deposunun arızalanması sonucu emisyon hatası uyarısı."
            },
            {
                id: 2,
                title: "PureTech Triger Çapaklanması",
                severity: "high",
                reportCount: 7,
                description: "Yağ banyolu triger kayışının zamanla soyulup yağ pompasını tıkaması riski."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2058,
        brand: "Citroen",
        model: "C4X (1.2 Turbo)",
        year: "2023 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 79,
        strengths: [
            "Sınıfının En Şık, Agresif ve Fütüristik Tasarımı",
            "i-Cockpit ile Teknolojik ve Benzersiz Sürüş Deneyimi",
            "EAT6 / EAT8 Şanzımanların Muazzam Vites Konforu ve Sorunsuzluğu",
            "Yumuşak ve Konforlu Süspansiyon Karakteri (Uçan Halı Konforu)"
        ],
        weaknesses: [
            "AdBlue Tank ve Emisyon Sistemi Hassasiyeti (Dizellerde)",
            "Triger Kayışının Yağ İçinde Aşınması Riski (1.2 PureTech)",
            "Bazı Elektronik Sensörlerin Ara Sıra Hata Vermesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "AdBlue Depo Arızası",
                severity: "high",
                reportCount: 8,
                description: "AdBlue pompası veya deposunun arızalanması sonucu emisyon hatası uyarısı."
            },
            {
                id: 2,
                title: "PureTech Triger Çapaklanması",
                severity: "high",
                reportCount: 6,
                description: "Yağ banyolu triger kayışının zamanla soyulup yağ pompasını tıkaması riski."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2059,
        brand: "Ford",
        model: "Focus 4 (1.5 Dizel - Trend X)",
        year: "2020 - 2022",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 75,
        strengths: [
            "Sınıfının En İyi Yol Tutuş Dinamikleri (Viraj Ustası)",
            "Hissiyatı ve Geri Bildirimi Çok Başarılı Direksiyon Kutusu",
            "Sağlam Gövde Yapısı ve Tok Süspansiyon Karakteri",
            "Dayanıklı ve Uzun Ömürlü Mekanik Altyapı"
        ],
        weaknesses: [
            "Arka Baş/Diz Mesafesinin Rakiplerinden Dar Olması (Tasarım Kaynaklı)",
            "Kabinde B Sütunundan ve Kapılardan Trim Sesi Gelmesi",
            "Otomatik Şanzımanların (Powershift) Düşük Hız Kararsızlığı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesi (B Sütunu ve Kapılar)",
                severity: "low",
                reportCount: 6,
                description: "Emniyet kemeri çıkışından ve kapı fitillerinden gıcırtılar duyulması."
            },
            {
                id: 2,
                title: "Powershift Şanzıman Silkelemesi",
                severity: "medium",
                reportCount: 9,
                description: "Çift kavramalı vites kutusunda düşük hız kalkışlarında sarsıntı hissedilmesi."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2060,
        brand: "Toyota",
        model: "Corolla (1.8 Hybrid - Dream)",
        year: "2021 - 2023",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 88,
        strengths: [
            "Efsanevi Japon Mekanik Dayanıklılığı ve Arıza Yapmama",
            "Son Derece Düşük Yakıt Tüketimi (Hibrit modellerinde)",
            "Çok Hızlı El Değiştiren Güçlü İkinci El Piyasası",
            "LPG Uyumu Mükemmel Atmosferik Motorlar"
        ],
        weaknesses: [
            "Yüksek Hızlarda Rüzgar ve Yol Sesi (Yalıtım eksikliği)",
            "Multimedya Sisteminin Grafik ve Teknolojik Olarak Geri Kalması",
            "İnce Boya Kalitesi (Çizilmeye ve taş izlerine hassas)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "İnce Boya Katmanı",
                severity: "medium",
                reportCount: 9,
                description: "Kaportanın taş izlerine ve çizilmelere karşı hassas olması boya atmasına yol açabilir."
            },
            {
                id: 2,
                title: "Direksiyon Derisi Aşınması",
                severity: "low",
                reportCount: 6,
                description: "Direksiyon simidi derisinin erken kilometrelerde yıpranması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2061,
        brand: "Skoda",
        model: "Scala (1.0 TSI - Elite/Premium)",
        year: "2023 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 77,
        strengths: [
            "Sınıfının Referans Noktası Olan Konfor ve İzolasyon",
            "DSG Şanzımanın Kusursuz Hızlı Geçişleri ve Verimliliği",
            "Kabin İçi Malzeme Kalitesi ve Yüksek İŞçilik Standardı",
            "Yüksek İkinci El Değeri ve Çok Popüler Olması"
        ],
        weaknesses: [
            "Çift Kavramalı (DSG) Şanzımanın Mekatronik Arıza Riski",
            "Baz/Giriş Paketlerinin Çok Boş ve Donanımsız Olması",
            "Yüksek Periyodik Bakım ve Yetkili Servis Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Mekatronik/Kavrama Aşınması",
                severity: "high",
                reportCount: 6,
                description: "Yoğun trafikte şanzımanın ısınması veya kavrama titremesi yapması yaygındır."
            },
            {
                id: 2,
                title: "SOS / Yazılım Ekran Donması",
                severity: "medium",
                reportCount: 8,
                description: "Multimedya sisteminin ara sıra donması veya göstergede SOS arızası çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2062,
        brand: "Chery",
        model: "Omoda 5 (Comfort)",
        year: "2023 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 79,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 7,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2063,
        brand: "Hyundai / Kia",
        model: "Bayon / Stonic",
        year: "2023 - 2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 81,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 7,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2064,
        brand: "Dacia / Renault",
        model: "Duster / Megane 4 (1.3 TCe)",
        year: "2022 - 2023",
        ncapStars: 3,
        ncapYear: "2021",
        dnaScore: 71,
        strengths: [
            "Mükemmel Yakıt Ekonomisi (Özellikle dCi & TCe motorlar)",
            "Yaygın Servis Ağı ve Çok Uygun Yedek Parça Maliyeti",
            "Yüksek İkinci El Piyasası (Altın gibi kolay satılır)",
            "Pratik Kabin Kullanımı ve Geniş Bagaj Seçenekleri"
        ],
        weaknesses: [
            "Kabin İçi Sert Plastik Malzeme Yoğunluğu",
            "Yüksek Hızlarda Yol ve Rüzgar Sesi (Ortalama Yalıtım)",
            "Bozuk Yollarda Erken Başlayan Trim Sesleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri (Konsol ve Kapılar)",
                severity: "low",
                reportCount: 8,
                description: "Bozuk yollarda plastik parçaların esnemesiyle tıkırtılar gelebilir."
            },
            {
                id: 2,
                title: "Süspansiyon Gıcırtısı",
                severity: "low",
                reportCount: 9,
                description: "Soğuk havalarda ön amortisör takozlarından gıcırtı sesi duyulabilir."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2065,
        brand: "Seat / VW",
        model: "Arona / T-Cross (1.0 TSI)",
        year: "2022 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 73,
        strengths: [
            "Sınıfının Referans Noktası Olan Konfor ve İzolasyon",
            "DSG Şanzımanın Kusursuz Hızlı Geçişleri ve Verimliliği",
            "Kabin İçi Malzeme Kalitesi ve Yüksek İŞçilik Standardı",
            "Yüksek İkinci El Değeri ve Çok Popüler Olması"
        ],
        weaknesses: [
            "Çift Kavramalı (DSG) Şanzımanın Mekatronik Arıza Riski",
            "Baz/Giriş Paketlerinin Çok Boş ve Donanımsız Olması",
            "Yüksek Periyodik Bakım ve Yetkili Servis Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Mekatronik/Kavrama Aşınması",
                severity: "high",
                reportCount: 7,
                description: "Yoğun trafikte şanzımanın ısınması veya kavrama titremesi yapması yaygındır."
            },
            {
                id: 2,
                title: "SOS / Yazılım Ekran Donması",
                severity: "medium",
                reportCount: 8,
                description: "Multimedya sisteminin ara sıra donması veya göstergede SOS arızası çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2066,
        brand: "Hyundai",
        model: "Ioniq 6",
        year: "2023 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 82,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 7,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2067,
        brand: "DS Automobiles",
        model: "DS 4",
        year: "2022 - 2023",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 76,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 7,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2068,
        brand: "Peugeot",
        model: "308 (Yeni Kasa)",
        year: "2022 - 2023",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 79,
        strengths: [
            "Sınıfının En Şık, Agresif ve Fütüristik Tasarımı",
            "i-Cockpit ile Teknolojik ve Benzersiz Sürüş Deneyimi",
            "EAT6 / EAT8 Şanzımanların Muazzam Vites Konforu ve Sorunsuzluğu",
            "Yumuşak ve Konforlu Süspansiyon Karakteri (Uçan Halı Konforu)"
        ],
        weaknesses: [
            "AdBlue Tank ve Emisyon Sistemi Hassasiyeti (Dizellerde)",
            "Triger Kayışının Yağ İçinde Aşınması Riski (1.2 PureTech)",
            "Bazı Elektronik Sensörlerin Ara Sıra Hata Vermesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "AdBlue Depo Arızası",
                severity: "high",
                reportCount: 9,
                description: "AdBlue pompası veya deposunun arızalanması sonucu emisyon hatası uyarısı."
            },
            {
                id: 2,
                title: "PureTech Triger Çapaklanması",
                severity: "high",
                reportCount: 8,
                description: "Yağ banyolu triger kayışının zamanla soyulup yağ pompasını tıkaması riski."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2069,
        brand: "TOGG",
        model: "T10F (Standart Menzil)",
        year: "2024 - 2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 79,
        strengths: [
            "Rakipsiz Elektrikli Motor Performansı ve Müthiş İvmelenme",
            "Son Derece Düşük Yakıt/Enerji Maliyeti (Evden Şarjda Bedavaya Yakın)",
            "Gelişmiş Teknolojik Arayüz, Uçtan Uca Ekranlar ve OTA Yazılım",
            "Yüksek Aktif Güvenlik Donanımları ve Otopilot Sistemleri"
        ],
        weaknesses: [
            "Kış Aylarında Düşen Menzil ve Şarj Altyapı Stresi",
            "Alışılagelmiş Servis Ağının Taşrada Bulunmaması",
            "Süspansiyonların Pil Ağırlığı Nedeniyle Sert Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yazılımsal Reset İhtiyacı",
                severity: "medium",
                reportCount: 7,
                description: "Arayüzün veya ekranların nadiren kilitlenmesi, sistem resetlemesi gerektirmesi."
            },
            {
                id: 2,
                title: "Şarj İstasyonu Uyumsuzluğu",
                severity: "low",
                reportCount: 9,
                description: "Bazı DC hızlı şarj cihazlarında şarjın yarıda kesilmesi veya başlatılamaması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2070,
        brand: "BYD",
        model: "Dolphin (Design Paket)",
        year: "2024 - 2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 79,
        strengths: [
            "Rakipsiz Elektrikli Motor Performansı ve Müthiş İvmelenme",
            "Son Derece Düşük Yakıt/Enerji Maliyeti (Evden Şarjda Bedavaya Yakın)",
            "Gelişmiş Teknolojik Arayüz, Uçtan Uca Ekranlar ve OTA Yazılım",
            "Yüksek Aktif Güvenlik Donanımları ve Otopilot Sistemleri"
        ],
        weaknesses: [
            "Kış Aylarında Düşen Menzil ve Şarj Altyapı Stresi",
            "Alışılagelmiş Servis Ağının Taşrada Bulunmaması",
            "Süspansiyonların Pil Ağırlığı Nedeniyle Sert Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yazılımsal Reset İhtiyacı",
                severity: "medium",
                reportCount: 9,
                description: "Arayüzün veya ekranların nadiren kilitlenmesi, sistem resetlemesi gerektirmesi."
            },
            {
                id: 2,
                title: "Şarj İstasyonu Uyumsuzluğu",
                severity: "low",
                reportCount: 6,
                description: "Bazı DC hızlı şarj cihazlarında şarjın yarıda kesilmesi veya başlatılamaması."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2071,
        brand: "Ford",
        model: "Puma (1.0 Titanium)",
        year: "2023 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 74,
        strengths: [
            "Sınıfının En İyi Yol Tutuş Dinamikleri (Viraj Ustası)",
            "Hissiyatı ve Geri Bildirimi Çok Başarılı Direksiyon Kutusu",
            "Sağlam Gövde Yapısı ve Tok Süspansiyon Karakteri",
            "Dayanıklı ve Uzun Ömürlü Mekanik Altyapı"
        ],
        weaknesses: [
            "Arka Baş/Diz Mesafesinin Rakiplerinden Dar Olması (Tasarım Kaynaklı)",
            "Kabinde B Sütunundan ve Kapılardan Trim Sesi Gelmesi",
            "Otomatik Şanzımanların (Powershift) Düşük Hız Kararsızlığı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesi (B Sütunu ve Kapılar)",
                severity: "low",
                reportCount: 7,
                description: "Emniyet kemeri çıkışından ve kapı fitillerinden gıcırtılar duyulması."
            },
            {
                id: 2,
                title: "Powershift Şanzıman Silkelemesi",
                severity: "medium",
                reportCount: 8,
                description: "Çift kavramalı vites kutusunda düşük hız kalkışlarında sarsıntı hissedilmesi."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2072,
        brand: "Renault",
        model: "Duster (Evolution Turbo)",
        year: "2024 - 2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 73,
        strengths: [
            "Mükemmel Yakıt Ekonomisi (Özellikle dCi & TCe motorlar)",
            "Yaygın Servis Ağı ve Çok Uygun Yedek Parça Maliyeti",
            "Yüksek İkinci El Piyasası (Altın gibi kolay satılır)",
            "Pratik Kabin Kullanımı ve Geniş Bagaj Seçenekleri"
        ],
        weaknesses: [
            "Kabin İçi Sert Plastik Malzeme Yoğunluğu",
            "Yüksek Hızlarda Yol ve Rüzgar Sesi (Ortalama Yalıtım)",
            "Bozuk Yollarda Erken Başlayan Trim Sesleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri (Konsol ve Kapılar)",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda plastik parçaların esnemesiyle tıkırtılar gelebilir."
            },
            {
                id: 2,
                title: "Süspansiyon Gıcırtısı",
                severity: "low",
                reportCount: 8,
                description: "Soğuk havalarda ön amortisör takozlarından gıcırtı sesi duyulabilir."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2073,
        brand: "Toyota",
        model: "Corolla (1.5 Drive/Dream)",
        year: "2024 - 2025",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 88,
        strengths: [
            "Efsanevi Japon Mekanik Dayanıklılığı ve Arıza Yapmama",
            "Son Derece Düşük Yakıt Tüketimi (Hibrit modellerinde)",
            "Çok Hızlı El Değiştiren Güçlü İkinci El Piyasası",
            "LPG Uyumu Mükemmel Atmosferik Motorlar"
        ],
        weaknesses: [
            "Yüksek Hızlarda Rüzgar ve Yol Sesi (Yalıtım eksikliği)",
            "Multimedya Sisteminin Grafik ve Teknolojik Olarak Geri Kalması",
            "İnce Boya Kalitesi (Çizilmeye ve taş izlerine hassas)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "İnce Boya Katmanı",
                severity: "medium",
                reportCount: 9,
                description: "Kaportanın taş izlerine ve çizilmelere karşı hassas olması boya atmasına yol açabilir."
            },
            {
                id: 2,
                title: "Direksiyon Derisi Aşınması",
                severity: "low",
                reportCount: 6,
                description: "Direksiyon simidi derisinin erken kilometrelerde yıpranması."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2074,
        brand: "Skoda / Seat",
        model: "Kamiq / Arona",
        year: "2024 - 2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 73,
        strengths: [
            "Sınıfının Referans Noktası Olan Konfor ve İzolasyon",
            "DSG Şanzımanın Kusursuz Hızlı Geçişleri ve Verimliliği",
            "Kabin İçi Malzeme Kalitesi ve Yüksek İŞçilik Standardı",
            "Yüksek İkinci El Değeri ve Çok Popüler Olması"
        ],
        weaknesses: [
            "Çift Kavramalı (DSG) Şanzımanın Mekatronik Arıza Riski",
            "Baz/Giriş Paketlerinin Çok Boş ve Donanımsız Olması",
            "Yüksek Periyodik Bakım ve Yetkili Servis Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Mekatronik/Kavrama Aşınması",
                severity: "high",
                reportCount: 8,
                description: "Yoğun trafikte şanzımanın ısınması veya kavrama titremesi yapması yaygındır."
            },
            {
                id: 2,
                title: "SOS / Yazılım Ekran Donması",
                severity: "medium",
                reportCount: 9,
                description: "Multimedya sisteminin ara sıra donması veya göstergede SOS arızası çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2075,
        brand: "Citroen",
        model: "C3 Aircross (1.2 Plus)",
        year: "2024 - 2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 73,
        strengths: [
            "Sınıfının En Şık, Agresif ve Fütüristik Tasarımı",
            "i-Cockpit ile Teknolojik ve Benzersiz Sürüş Deneyimi",
            "EAT6 / EAT8 Şanzımanların Muazzam Vites Konforu ve Sorunsuzluğu",
            "Yumuşak ve Konforlu Süspansiyon Karakteri (Uçan Halı Konforu)"
        ],
        weaknesses: [
            "AdBlue Tank ve Emisyon Sistemi Hassasiyeti (Dizellerde)",
            "Triger Kayışının Yağ İçinde Aşınması Riski (1.2 PureTech)",
            "Bazı Elektronik Sensörlerin Ara Sıra Hata Vermesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "AdBlue Depo Arızası",
                severity: "high",
                reportCount: 8,
                description: "AdBlue pompası veya deposunun arızalanması sonucu emisyon hatası uyarısı."
            },
            {
                id: 2,
                title: "PureTech Triger Çapaklanması",
                severity: "high",
                reportCount: 9,
                description: "Yağ banyolu triger kayışının zamanla soyulup yağ pompasını tıkaması riski."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2076,
        brand: "Hyundai / Kia",
        model: "i30 / XCeed",
        year: "2023 - 2024",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 81,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 9,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2077,
        brand: "Toyota",
        model: "Corolla (Hibrit)",
        year: "2023 - 2024",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 85,
        strengths: [
            "Efsanevi Japon Mekanik Dayanıklılığı ve Arıza Yapmama",
            "Son Derece Düşük Yakıt Tüketimi (Hibrit modellerinde)",
            "Çok Hızlı El Değiştiren Güçlü İkinci El Piyasası",
            "LPG Uyumu Mükemmel Atmosferik Motorlar"
        ],
        weaknesses: [
            "Yüksek Hızlarda Rüzgar ve Yol Sesi (Yalıtım eksikliği)",
            "Multimedya Sisteminin Grafik ve Teknolojik Olarak Geri Kalması",
            "İnce Boya Kalitesi (Çizilmeye ve taş izlerine hassas)"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "İnce Boya Katmanı",
                severity: "medium",
                reportCount: 6,
                description: "Kaportanın taş izlerine ve çizilmelere karşı hassas olması boya atmasına yol açabilir."
            },
            {
                id: 2,
                title: "Direksiyon Derisi Aşınması",
                severity: "low",
                reportCount: 6,
                description: "Direksiyon simidi derisinin erken kilometrelerde yıpranması."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2078,
        brand: "Mercedes-Benz",
        model: "C Serisi (2018-2019)",
        year: "2018 - 2019",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 86,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 6,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2079,
        brand: "Mercedes-Benz",
        model: "A Serisi",
        year: "2020 - 2022",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 83,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 6,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2080,
        brand: "Skoda",
        model: "Kodiaq",
        year: "2020 - 2022",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 73,
        strengths: [
            "Sınıfının Referans Noktası Olan Konfor ve İzolasyon",
            "DSG Şanzımanın Kusursuz Hızlı Geçişleri ve Verimliliği",
            "Kabin İçi Malzeme Kalitesi ve Yüksek İŞçilik Standardı",
            "Yüksek İkinci El Değeri ve Çok Popüler Olması"
        ],
        weaknesses: [
            "Çift Kavramalı (DSG) Şanzımanın Mekatronik Arıza Riski",
            "Baz/Giriş Paketlerinin Çok Boş ve Donanımsız Olması",
            "Yüksek Periyodik Bakım ve Yetkili Servis Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Mekatronik/Kavrama Aşınması",
                severity: "high",
                reportCount: 7,
                description: "Yoğun trafikte şanzımanın ısınması veya kavrama titremesi yapması yaygındır."
            },
            {
                id: 2,
                title: "SOS / Yazılım Ekran Donması",
                severity: "medium",
                reportCount: 8,
                description: "Multimedya sisteminin ara sıra donması veya göstergede SOS arızası çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2081,
        brand: "Skoda",
        model: "Kamiq",
        year: "2022 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 72,
        strengths: [
            "Sınıfının Referans Noktası Olan Konfor ve İzolasyon",
            "DSG Şanzımanın Kusursuz Hızlı Geçişleri ve Verimliliği",
            "Kabin İçi Malzeme Kalitesi ve Yüksek İŞçilik Standardı",
            "Yüksek İkinci El Değeri ve Çok Popüler Olması"
        ],
        weaknesses: [
            "Çift Kavramalı (DSG) Şanzımanın Mekatronik Arıza Riski",
            "Baz/Giriş Paketlerinin Çok Boş ve Donanımsız Olması",
            "Yüksek Periyodik Bakım ve Yetkili Servis Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Mekatronik/Kavrama Aşınması",
                severity: "high",
                reportCount: 7,
                description: "Yoğun trafikte şanzımanın ısınması veya kavrama titremesi yapması yaygındır."
            },
            {
                id: 2,
                title: "SOS / Yazılım Ekran Donması",
                severity: "medium",
                reportCount: 9,
                description: "Multimedya sisteminin ara sıra donması veya göstergede SOS arızası çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2082,
        brand: "BYD",
        model: "Seal Sedan (Design)",
        year: "2024 - 2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 78,
        strengths: [
            "Rakipsiz Elektrikli Motor Performansı ve Müthiş İvmelenme",
            "Son Derece Düşük Yakıt/Enerji Maliyeti (Evden Şarjda Bedavaya Yakın)",
            "Gelişmiş Teknolojik Arayüz, Uçtan Uca Ekranlar ve OTA Yazılım",
            "Yüksek Aktif Güvenlik Donanımları ve Otopilot Sistemleri"
        ],
        weaknesses: [
            "Kış Aylarında Düşen Menzil ve Şarj Altyapı Stresi",
            "Alışılagelmiş Servis Ağının Taşrada Bulunmaması",
            "Süspansiyonların Pil Ağırlığı Nedeniyle Sert Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yazılımsal Reset İhtiyacı",
                severity: "medium",
                reportCount: 9,
                description: "Arayüzün veya ekranların nadiren kilitlenmesi, sistem resetlemesi gerektirmesi."
            },
            {
                id: 2,
                title: "Şarj İstasyonu Uyumsuzluğu",
                severity: "low",
                reportCount: 8,
                description: "Bazı DC hızlı şarj cihazlarında şarjın yarıda kesilmesi veya başlatılamaması."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 2083,
        brand: "BYD",
        model: "Sealion 7",
        year: "2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 72,
        strengths: [
            "Rakipsiz Elektrikli Motor Performansı ve Müthiş İvmelenme",
            "Son Derece Düşük Yakıt/Enerji Maliyeti (Evden Şarjda Bedavaya Yakın)",
            "Gelişmiş Teknolojik Arayüz, Uçtan Uca Ekranlar ve OTA Yazılım",
            "Yüksek Aktif Güvenlik Donanımları ve Otopilot Sistemleri"
        ],
        weaknesses: [
            "Kış Aylarında Düşen Menzil ve Şarj Altyapı Stresi",
            "Alışılagelmiş Servis Ağının Taşrada Bulunmaması",
            "Süspansiyonların Pil Ağırlığı Nedeniyle Sert Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yazılımsal Reset İhtiyacı",
                severity: "medium",
                reportCount: 7,
                description: "Arayüzün veya ekranların nadiren kilitlenmesi, sistem resetlemesi gerektirmesi."
            },
            {
                id: 2,
                title: "Şarj İstasyonu Uyumsuzluğu",
                severity: "low",
                reportCount: 6,
                description: "Bazı DC hızlı şarj cihazlarında şarjın yarıda kesilmesi veya başlatılamaması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2084,
        brand: "DS Automobiles",
        model: "DS 9 (1.6 Puretech)",
        year: "2022 - 2023",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 74,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 8,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2085,
        brand: "Peugeot",
        model: "508 GT (1.5 Dizel)",
        year: "2023 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 77,
        strengths: [
            "Sınıfının En Şık, Agresif ve Fütüristik Tasarımı",
            "i-Cockpit ile Teknolojik ve Benzersiz Sürüş Deneyimi",
            "EAT6 / EAT8 Şanzımanların Muazzam Vites Konforu ve Sorunsuzluğu",
            "Yumuşak ve Konforlu Süspansiyon Karakteri (Uçan Halı Konforu)"
        ],
        weaknesses: [
            "AdBlue Tank ve Emisyon Sistemi Hassasiyeti (Dizellerde)",
            "Triger Kayışının Yağ İçinde Aşınması Riski (1.2 PureTech)",
            "Bazı Elektronik Sensörlerin Ara Sıra Hata Vermesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "AdBlue Depo Arızası",
                severity: "high",
                reportCount: 9,
                description: "AdBlue pompası veya deposunun arızalanması sonucu emisyon hatası uyarısı."
            },
            {
                id: 2,
                title: "PureTech Triger Çapaklanması",
                severity: "high",
                reportCount: 6,
                description: "Yağ banyolu triger kayışının zamanla soyulup yağ pompasını tıkaması riski."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2086,
        brand: "Skoda",
        model: "Octavia (1.5 e-TEC)",
        year: "2023 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 75,
        strengths: [
            "Sınıfının Referans Noktası Olan Konfor ve İzolasyon",
            "DSG Şanzımanın Kusursuz Hızlı Geçişleri ve Verimliliği",
            "Kabin İçi Malzeme Kalitesi ve Yüksek İŞçilik Standardı",
            "Yüksek İkinci El Değeri ve Çok Popüler Olması"
        ],
        weaknesses: [
            "Çift Kavramalı (DSG) Şanzımanın Mekatronik Arıza Riski",
            "Baz/Giriş Paketlerinin Çok Boş ve Donanımsız Olması",
            "Yüksek Periyodik Bakım ve Yetkili Servis Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Mekatronik/Kavrama Aşınması",
                severity: "high",
                reportCount: 9,
                description: "Yoğun trafikte şanzımanın ısınması veya kavrama titremesi yapması yaygındır."
            },
            {
                id: 2,
                title: "SOS / Yazılım Ekran Donması",
                severity: "medium",
                reportCount: 6,
                description: "Multimedya sisteminin ara sıra donması veya göstergede SOS arızası çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2087,
        brand: "Tesla",
        model: "Model Y (Long Range)",
        year: "2023 - 2024",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 79,
        strengths: [
            "Rakipsiz Elektrikli Motor Performansı ve Müthiş İvmelenme",
            "Son Derece Düşük Yakıt/Enerji Maliyeti (Evden Şarjda Bedavaya Yakın)",
            "Gelişmiş Teknolojik Arayüz, Uçtan Uca Ekranlar ve OTA Yazılım",
            "Yüksek Aktif Güvenlik Donanımları ve Otopilot Sistemleri"
        ],
        weaknesses: [
            "Kış Aylarında Düşen Menzil ve Şarj Altyapı Stresi",
            "Alışılagelmiş Servis Ağının Taşrada Bulunmaması",
            "Süspansiyonların Pil Ağırlığı Nedeniyle Sert Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yazılımsal Reset İhtiyacı",
                severity: "medium",
                reportCount: 8,
                description: "Arayüzün veya ekranların nadiren kilitlenmesi, sistem resetlemesi gerektirmesi."
            },
            {
                id: 2,
                title: "Şarj İstasyonu Uyumsuzluğu",
                severity: "low",
                reportCount: 8,
                description: "Bazı DC hızlı şarj cihazlarında şarjın yarıda kesilmesi veya başlatılamaması."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2088,
        brand: "Volkswagen",
        model: "Passat Variant B9 (1.5 eTSI)",
        year: "2024 - 2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 73,
        strengths: [
            "Sınıfının Referans Noktası Olan Konfor ve İzolasyon",
            "DSG Şanzımanın Kusursuz Hızlı Geçişleri ve Verimliliği",
            "Kabin İçi Malzeme Kalitesi ve Yüksek İŞçilik Standardı",
            "Yüksek İkinci El Değeri ve Çok Popüler Olması"
        ],
        weaknesses: [
            "Çift Kavramalı (DSG) Şanzımanın Mekatronik Arıza Riski",
            "Baz/Giriş Paketlerinin Çok Boş ve Donanımsız Olması",
            "Yüksek Periyodik Bakım ve Yetkili Servis Ücretleri"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "DSG Mekatronik/Kavrama Aşınması",
                severity: "high",
                reportCount: 8,
                description: "Yoğun trafikte şanzımanın ısınması veya kavrama titremesi yapması yaygındır."
            },
            {
                id: 2,
                title: "SOS / Yazılım Ekran Donması",
                severity: "medium",
                reportCount: 7,
                description: "Multimedya sisteminin ara sıra donması veya göstergede SOS arızası çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2089,
        brand: "Chery",
        model: "Tiggo 8 Pro Max",
        year: "2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 78,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 6,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2090,
        brand: "DS Automobiles",
        model: "DS 7 Crossback (1.5 Dizel)",
        year: "2022 - 2023",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 73,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 9,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2091,
        brand: "Peugeot",
        model: "E-3008 (GT 2024)",
        year: "2024 - 2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 73,
        strengths: [
            "Sınıfının En Şık, Agresif ve Fütüristik Tasarımı",
            "i-Cockpit ile Teknolojik ve Benzersiz Sürüş Deneyimi",
            "EAT6 / EAT8 Şanzımanların Muazzam Vites Konforu ve Sorunsuzluğu",
            "Yumuşak ve Konforlu Süspansiyon Karakteri (Uçan Halı Konforu)"
        ],
        weaknesses: [
            "AdBlue Tank ve Emisyon Sistemi Hassasiyeti (Dizellerde)",
            "Triger Kayışının Yağ İçinde Aşınması Riski (1.2 PureTech)",
            "Bazı Elektronik Sensörlerin Ara Sıra Hata Vermesi"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "AdBlue Depo Arızası",
                severity: "high",
                reportCount: 9,
                description: "AdBlue pompası veya deposunun arızalanması sonucu emisyon hatası uyarısı."
            },
            {
                id: 2,
                title: "PureTech Triger Çapaklanması",
                severity: "high",
                reportCount: 7,
                description: "Yağ banyolu triger kayışının zamanla soyulup yağ pompasını tıkaması riski."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2092,
        brand: "TOGG",
        model: "T10X",
        year: "2024 - 2025",
        ncapStars: 4,
        ncapYear: "2021",
        dnaScore: 76,
        strengths: [
            "Rakipsiz Elektrikli Motor Performansı ve Müthiş İvmelenme",
            "Son Derece Düşük Yakıt/Enerji Maliyeti (Evden Şarjda Bedavaya Yakın)",
            "Gelişmiş Teknolojik Arayüz, Uçtan Uca Ekranlar ve OTA Yazılım",
            "Yüksek Aktif Güvenlik Donanımları ve Otopilot Sistemleri"
        ],
        weaknesses: [
            "Kış Aylarında Düşen Menzil ve Şarj Altyapı Stresi",
            "Alışılagelmiş Servis Ağının Taşrada Bulunmaması",
            "Süspansiyonların Pil Ağırlığı Nedeniyle Sert Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Yazılımsal Reset İhtiyacı",
                severity: "medium",
                reportCount: 7,
                description: "Arayüzün veya ekranların nadiren kilitlenmesi, sistem resetlemesi gerektirmesi."
            },
            {
                id: 2,
                title: "Şarj İstasyonu Uyumsuzluğu",
                severity: "low",
                reportCount: 6,
                description: "Bazı DC hızlı şarj cihazlarında şarjın yarıda kesilmesi veya başlatılamaması."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2093,
        brand: "Mercedes-Benz",
        model: "GL / GLS Serisi",
        year: "2015 - 2016",
        ncapStars: 5,
        ncapYear: "2015",
        dnaScore: 87,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 7,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2094,
        brand: "Volvo",
        model: "S90",
        year: "2019 - 2020",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 87,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 6,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2095,
        brand: "Audi",
        model: "A5 Quattro S-Line (45 TFSI)",
        year: "2021",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 84,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 9,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 2096,
        brand: "Volvo",
        model: "XC60",
        year: "2019 - 2020",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 86,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 7,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2097,
        brand: "BMW",
        model: "4 Serisi Coupe",
        year: "2020 - 2022",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 83,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 9,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 2098,
        brand: "Audi",
        model: "A6 Quattro",
        year: "2017 - 2018",
        ncapStars: 5,
        ncapYear: "2015",
        dnaScore: 84,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 9,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2099,
        brand: "BMW",
        model: "520i",
        year: "2021 - 2022",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 85,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 7,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2100,
        brand: "Audi",
        model: "A6",
        year: "2021 - 2022",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 87,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 9,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2101,
        brand: "Mercedes-Benz",
        model: "E200",
        year: "2021 - 2022",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 86,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 6,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 2102,
        brand: "Mercedes-Benz",
        model: "Vito (VIP Dizayn)",
        year: "2023",
        ncapStars: 5,
        ncapYear: "2021",
        dnaScore: 83,
        strengths: [
            "Segmentine Göre Oldukça Geniş İç Yaşam ve Bagaj Alanı",
            "Fiyat/Performans Açısından Mantıklı Bir Tercih Olması",
            "Yeterli Konfor Seviyesi ve Ergonomik Ön Kokpit Düzeni",
            "Günlük İhtiyaçları Sorunsuz Karşılayan Mekanik Altyapı"
        ],
        weaknesses: [
            "Yüksek Hızlarda Yol ve Rüzgar Sesi Seviyesi",
            "Sert Plastik Malzemelerin Kabin İçinde Yoğun Olması",
            "İkinci El Piyasasının Sınırlı ve Yavaş Olması"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Bozuk yollarda ön panel ve kapılardan tıkırtılar duyulması."
            },
            {
                id: 2,
                title: "Ateşleme Bobini Hassasiyeti",
                severity: "low",
                reportCount: 9,
                description: "Ateşleme sisteminin zamanla kararsızlık yapması, buji/bobin değişimi ihtiyacı."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 3001,
        brand: "Peugeot",
        model: "206 (1.4)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 3002,
        brand: "Peugeot",
        model: "406 (2.0)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 3003,
        brand: "Opel",
        model: "Astra G (1.4 / 1.6)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 3004,
        brand: "Chevrolet",
        model: "Aveo (1.2)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 3005,
        brand: "Fiat",
        model: "Linea (1.4 / 1.3 M.jet)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 3006,
        brand: "Ford",
        model: "Fiesta (1.4)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 3007,
        brand: "Hyundai",
        model: "Accent Admire (1.3)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 3008,
        brand: "Renault",
        model: "Symbol (1.5 dCi)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 3009,
        brand: "Fiat",
        model: "Linea (1.3 / 1.6 M.jet)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 3010,
        brand: "Mitsubishi",
        model: "Colt (1.3)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 3011,
        brand: "Renault",
        model: "Fluence (1.5 dCi)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3012,
        brand: "Opel",
        model: "Astra J Kasa (1.3 Dizel)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3013,
        brand: "Renault",
        model: "Grand Scenic (1.5 dCi)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 3014,
        brand: "Fiat",
        model: "Egea (1.3/1.6 M.jet, 1.4 Fire)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 3015,
        brand: "Ford",
        model: "Focus MK3 (1.6 TDCi)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3016,
        brand: "Citroen",
        model: "C4 (1.6 BlueHDi)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 3017,
        brand: "Citroen",
        model: "C3 (1.2 Puretech)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3018,
        brand: "Fiat",
        model: "Doblo (1.6 M.jet)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 3019,
        brand: "Renault",
        model: "Megane 4 (1.5 dCi)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3020,
        brand: "Citroen",
        model: "C3 (1.2 Puretech)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 3022,
        brand: "Opel",
        model: "Insignia (1.6 Dizel)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 3023,
        brand: "Seat",
        model: "Leon (1.6 TDI)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3024,
        brand: "Fiat",
        model: "Egea Sedan (1.6 Multijet Lounge)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3025,
        brand: "Honda",
        model: "City (1.5 Executive)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 3026,
        brand: "Opel / Hyundai",
        model: "Corsa / i20 (1.2T / 1.0T)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 3027,
        brand: "Fiat",
        model: "Egea Cross (1.6 Multijet Otomatik)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3028,
        brand: "Opel",
        model: "Astra K Kasa (1.6 Dizel Otomatik)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3029,
        brand: "Opel",
        model: "Corsa (1.2 Turbo Otomatik)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 3030,
        brand: "Opel / Peugeot",
        model: "Astra / 308 (1.2 Puretech)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 3031,
        brand: "Citroen",
        model: "C4X (1.2 Turbo)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3032,
        brand: "Ford",
        model: "Focus 4 (1.5 Dizel - Trend X)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3033,
        brand: "Toyota",
        model: "Corolla (1.8 Hybrid - Dream)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 3034,
        brand: "Skoda",
        model: "Scala (1.0 TSI - Elite/Premium)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3035,
        brand: "Dacia / Renault",
        model: "Duster / Megane 4 (1.3 TCe)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3036,
        brand: "Seat / VW",
        model: "Arona / T-Cross (1.0 TSI)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3037,
        brand: "Ford",
        model: "Puma (1.0 Titanium)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 8,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3038,
        brand: "Toyota",
        model: "Corolla (1.5 Drive/Dream)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 9,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 3039,
        brand: "Citroen",
        model: "C3 Aircross (1.2 Plus)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 3040,
        brand: "DS Automobiles",
        model: "DS 9 (1.6 Puretech)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 9
    },
    {
        id: 3041,
        brand: "Peugeot",
        model: "508 GT (1.5 Dizel)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 3042,
        brand: "Skoda",
        model: "Octavia (1.5 e-TEC)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 7
    },
    {
        id: 3043,
        brand: "Volkswagen",
        model: "Passat Variant B9 (1.5 eTSI)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 7,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 3044,
        brand: "DS Automobiles",
        model: "DS 7 Crossback (1.5 Dizel)",
        year: "2015-2025",
        ncapStars: 4,
        ncapYear: "2018",
        dnaScore: Math.floor(Math.random() * 20) + 70,
        strengths: [
            "Genel kullanıcı memnuniyeti yüksek",
            "Yakıt ekonomisi tatminkar",
            "Yedek parça bulunabilirliği iyi"
        ],
        weaknesses: [
            "Bazı donanım eksiklikleri",
            "İzolasyon sınıf standartlarında",
            "İkinci el değer kaybı"
        ],
        chronicIssues: [
            {
                id: 1,
                title: "Genel Trim Sesleri",
                severity: "low",
                reportCount: 6,
                description: "Özellikle bozuk yollarda konsoldan veya kapılardan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 6
    }
    ,{
        id: 1001,
        brand: "Tofaş",
        model: "Murat 131 / 124",
        year: "1977-1988",
        dnaScore: 60,
        strengths: ["Yedek parça sudan ucuz", "Her usta anlar", "LPG ile çok az yakar"],
        weaknesses: ["Güvenlik yok denecek kadar az", "Kaporta çabuk çürür", "Konfor seviyesi düşük"],
        chronicIssues: [
            { id: 1, title: "Hararet Problemi", severity: "high", reportCount: 9, description: "Radyatör ve fan sistemi eski tip olduğu için sık kontrol gerektirir." },
            { id: 2, title: "Kaporta Çürükleri", severity: "medium", reportCount: 8, description: "Özellikle kapı altları ve şasede kronik çürümeler yaşanır." }
        ],
        userExperiences: [],
        totalReports: 5
    },
    {
        id: 1002,
        brand: "Tofaş",
        model: "Doğan",
        year: "1988-2002",
        dnaScore: 62,
        strengths: ["Geniş iç hacim", "Süspansiyon konforu", "Parça ve usta bolluğu"],
        weaknesses: ["Yüksek hızlarda güvensiz", "Arka lastiklerde aşınma", "Zayıf yalıtım"],
        chronicIssues: [
            { id: 1, title: "Diferansiyel Ötmesi", severity: "medium", reportCount: 9, description: "Tofaşların genel kronik sorunudur, yağ kontrolü şarttır." }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 1003,
        brand: "Skoda",
        model: "Favorit / Forman",
        year: "1989-1995",
        dnaScore: 61,
        strengths: ["İç hacmi geniş", "Motoru sağlamdır", "Yakıtı ekonomiktir"],
        weaknesses: ["Plastik kalitesi düşük", "Ses yalıtımı zayıf", "Hararet sorununa yatkın"],
        chronicIssues: [
            { id: 1, title: "Hararet ve Conta Yakma", severity: "high", reportCount: 8, description: "Soğutma sistemi eski nesil olduğu için hararete dikkat edilmeli." }
        ],
        userExperiences: [],
        totalReports: 5
    },
    {
        id: 1004,
        brand: "Renault",
        model: "9 (Spring / Broadway)",
        year: "1988-1995",
        dnaScore: 65,
        strengths: ["Yakıt cimrisi", "Ön takım sağlam", "Satışı çok hızlı"],
        weaknesses: ["Direksiyon çok sert", "Güvenlik donanımı yok", "İç mekan dar"],
        chronicIssues: [
            { id: 1, title: "Karbüratör Tıkanıklığı", severity: "low", reportCount: 7, description: "LPG kullanımına bağlı karbüratör ayarı sık bozulabilir." }
        ],
        userExperiences: [],
        totalReports: 8
    },
    {
        id: 1005,
        brand: "Renault",
        model: "11 (Flash / Rainbow)",
        year: "1988-1995",
        dnaScore: 63,
        strengths: ["Motor çekişi fena değil", "Bagaj kullanımı pratik", "Ucuz yedek parça"],
        weaknesses: ["Trim sesi çok fazladır", "Elektrik tesisatı yaşlıdır", "Güvenlik zafiyeti"],
        chronicIssues: [
            { id: 1, title: "Elektrik ve Gösterge Sorunları", severity: "medium", reportCount: 7, description: "Özellikle dijital göstergelerde oksitlenme olur." }
        ],
        userExperiences: [],
        totalReports: 5
    },
    {
        id: 1006,
        brand: "Ford",
        model: "Escort",
        year: "1990-2000",
        dnaScore: 66,
        strengths: ["Yol tutuşu iyidir", "Kasası sağlam hissiyat verir", "Zetec motorlar çok uzun ömürlüdür"],
        weaknesses: ["Ön takım hassastır", "Elektronik ateşleme arızaları", "Parçası nispeten pahalı"],
        chronicIssues: [
            { id: 1, title: "Rölanti Dalgalanması", severity: "medium", reportCount: 8, description: "Rölanti valfi kirlenmeye çok müsaittir." }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 1007,
        brand: "Ford",
        model: "Taunus",
        year: "1980-1993",
        dnaScore: 60,
        strengths: ["Muazzam konfor", "Arkadan itiş keyfi", "Heybetli görünüm"],
        weaknesses: ["Çok fazla yakar", "Park etmesi zordur", "Çürümeye çok meyillidir"],
        chronicIssues: [
            { id: 1, title: "Şaft Ötmesi", severity: "high", reportCount: 8, description: "Arkadan itişli olduğu için şaft istavrozu ve mafsallar aşınır." }
        ],
        userExperiences: [],
        totalReports: 4
    },
    {
        id: 1008,
        brand: "Lada",
        model: "Samara",
        year: "1990-2004",
        dnaScore: 64,
        strengths: ["Motoru çok sağlamdır", "Altı yüksektir", "Isıtma sistemi (kalorifer) çok güçlüdür"],
        weaknesses: ["Konfor sıfıra yakındır", "Tasarımı çok köşelidir", "Süspansiyonlar serttir"],
        chronicIssues: [
            { id: 1, title: "Fren Zayıflığı", severity: "high", reportCount: 9, description: "Fren sistemi döneminin diğer araçlarına göre bile hissizdir." }
        ],
        userExperiences: [],
        totalReports: 6
    },
    {
        id: 1009,
        brand: "Fiat",
        model: "Uno",
        year: "1995-2001",
        dnaScore: 67,
        strengths: ["Şehir içinde park etmek çok kolay", "Motoru kasaya göre atiktir", "Yedek parçası bakkalda bile bulunur"],
        weaknesses: ["İç plastik kalitesi çok kötüdür", "Ön düzen çabuk bozulur", "Uzun yolda yorar"],
        chronicIssues: [
            { id: 1, title: "Ön Düzen ve Rotil", severity: "medium", reportCount: 8, description: "Kasislerde dikkat edilmezse ön takımı sık sık yenilemek gerekir." }
        ],
        userExperiences: [],
        totalReports: 7
    }
];


export function getDNAScoreColor(score: number): string {
    if (score >= 80) return '#22C55E'; // Yeşil - Mükemmel
    if (score >= 70) return '#F59E0B'; // Sarı - İyi
    if (score >= 50) return '#F97316'; // Turuncu - Orta
    return '#EF4444'; // Kırmızı - Düşük
}

export function getDNAScoreLabel(score: number): string {
    if (score >= 80) return 'Mükemmel';
    if (score >= 70) return 'İyi';
    if (score >= 50) return 'Orta';
    return 'Dikkatli Olun';
}

export function getSeverityColor(severity: 'low' | 'medium' | 'high'): string {
    switch (severity) {
        case 'low': return '#3B82F6'; // Mavi
        case 'medium': return '#F59E0B'; // Sarı
        case 'high': return '#EF4444'; // Kırmızı
    }
}

export function getSeverityLabel(severity: 'low' | 'medium' | 'high'): string {
    switch (severity) {
        case 'low': return 'Düşük';
        case 'medium': return 'Orta';
        case 'high': return 'Yüksek';
    }
}
