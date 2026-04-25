
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
        model: "Clio",
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
                id: 1,
                title: "1.0 TCe & X-Tronic Silkeleme",
                severity: "medium",
                reportCount: 450,
                description: "Özellikle sıkışık trafikte ve düşük hızlarda (10-20 km/s) gazdan ayak çekildiğinde araçta belirgin bir yığılma ve tekrar gaza basıldığında silkeleme/vuruntu hissediliyor. Yazılım güncellemesi kısmen çözüyor."
            },
            {
                id: 2,
                title: "Enjeksiyon & 'Motor Hasar Riski' Uyarısı",
                severity: "high",
                reportCount: 320,
                description: "1.0 TCe motorlarda sebepsiz yere 'Enjeksiyonu Kontrol Ettirin' veya 'Motor Hasar Riski' uyarısı çıkabiliyor. Genellikle sensör kaynaklı veya yazılımsal olsa da kullanıcıyı tedirgin ediyor. Bazı vakalarda bobin değişimi gerekiyor."
            },
            {
                id: 3,
                title: "Trim Sesleri (B Sütunu & Kemer)",
                severity: "low",
                reportCount: 580,
                description: "Kullanıcıların %80'i emniyet kemeri mekanizmasından (B sütunu) gelen tıkırtı sesinden Şikayetçi. Servislerde izolasyon bandı uygulaması yapılıyor."
            },
            {
                id: 4,
                title: "Akü Zayıflığı ve Start-Stop Hatası",
                severity: "medium",
                reportCount: 410,
                description: "Fabrikasyon akülerin (EFB) ömrü kısa olabiliyor. Akü voltajı düştüğünde araç 'Start-Stop Arızası' veya 'Akü Şarj oluyor' uyarısı verip sistemi devre dışı bırakıyor."
            }
        ],
        userExperiences: [],
        totalReports: 2100
    },
    {
        id: 2,
        brand: "Fiat",
        model: "Egea",
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
                id: 1,
                title: "1.4 Fire Motor Yağ Eksiltme",
                severity: "medium",
                reportCount: 1250,
                description: "Kronik bir durumdur; 1.4 Fire motorlar 5.000-8.000 km'de ortalama 1 litre yağ eksiltebilir. Kullanıcının bagajında 1L yağ taşıması ve sık sık çubuğu kontrol etmesi önerilir."
            },
            {
                id: 2,
                title: "Amortisör Takozu ve Z-Rot Sesi",
                severity: "low",
                reportCount: 890,
                description: "Ön takımdan, özellikle direksiyonu kırarken veya tümseklerde 'lok lok' veya 'gıcırtı' Şeklinde sesler gelir. Amortisör takozları ve bilyaları çabuk deforme olur."
            },
            {
                id: 3,
                title: "Partikül Filtresi (DPF) Tıkanıklığı",
                severity: "high",
                reportCount: 640,
                description: "Dizel (1.3/1.6 MJT) modelleri sürekli Şehir içi kullanıldığında DPF tıkanır. Araç 'Motoru Kontrol Ettirin' uyarısı verir. Yüksek devirli kullanımda (otoban) temizlenmesi gerekir."
            },
            {
                id: 4,
                title: "Krom Parça Soyulmaları",
                severity: "low",
                reportCount: 320,
                description: "Dış kapı kollarındaki ve ön panjurda bulunan krom kaplamalar zamanla kabarabilir veya soyulabilir."
            }
        ],
        userExperiences: [],
        totalReports: 3200
    },
    {
        id: 3,
        brand: "Toyota",
        model: "Corolla",
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
                reportCount: 520,
                description: "Özellikle inci beyazı renkli modellerde, basınçlı yıkama sonrası tampon köşelerinde ve tavan rayı kenarlarında boya kalkması sorunu yaşanabiliyor. Servisler lokal boya ile onarım öneriyor."
            },
            {
                id: 2,
                title: "Rüzgar Sesi (A Sütunu)",
                severity: "low",
                reportCount: 950,
                description: "Araç 100-110 km/s hızı geçince kapı fitillerinden ve aynalardan rüzgar sesi almaya başlıyor. Yalıtım zayıflığı kullanıcıların en sık Şikayet ettiği konu."
            },
            {
                id: 3,
                title: "Balata ve Fren Islık Sesi",
                severity: "low",
                reportCount: 340,
                description: "Geri manevrada veya düşük hızda fren yaparken balatalardan gelen tiz ıslık sesi. Serviste temizlik veya değişim yapılmasına rağmen tekrarlayabiliyor."
            },
            {
                id: 4,
                title: "Multimedya Sorunları",
                severity: "low",
                reportCount: 180,
                description: "Ekranın güneşte parlaması, dokunmatiğin geç algılaması ve Apple CarPlay bağlantısının bazen kopması gibi teknolojik sorunlar."
            }
        ],
        userExperiences: [],
        totalReports: 1250
    },
    {
        id: 4,
        brand: "Renault",
        model: "Megane",
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
                id: 1,
                title: "AdBlue Depo/Enjektör Arızası",
                severity: "high",
                reportCount: 380,
                description: "1.5 BluedCi motorlarda AdBlue deposunun deforme olması veya enjektörün tıkanması sonucu 'Egzoz Emisyon Kontrol Ettirin' uyarısı ve yüksek onarım maliyeti."
            },
            {
                id: 2,
                title: "EDC Şanzıman 'Vites Kutusunu Kontrol Ettirin'",
                severity: "medium",
                reportCount: 420,
                description: "Özellikle 2016-2018 modellerde Şanzıman beyni veya kavrama sorunları nedeniyle uyarı verip vites geçişlerini devre dışı bırakabiliyor."
            },
            {
                id: 3,
                title: "Trim ve Amortisör Sesi",
                severity: "low",
                reportCount: 550,
                description: "Soğuk havalarda ön amortisörlerden gelen gıcırtı ve bozuk yollarda B sütunu/panoramik tavan fitillerinden gelen tıkırtı sesleri."
            },
            {
                id: 4,
                title: "R-Link Ekran Kararması",
                severity: "low",
                reportCount: 210,
                description: "Multimedya ekranının kendi kendine kapanıp açılması veya donması. Genellikle servis güncellemesi ile çözülüyor."
            }
        ],
        userExperiences: [],
        totalReports: 1100
    },
    {
        id: 5,
        brand: "Honda",
        model: "Civic",
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
                reportCount: 450,
                description: "Özellikle uzun yolda direksiyonda takılma/yapışma hissi oluşuyor. Honda bazı serilerde direksiyon kutusu değişimi veya yazılım güncellemesi ile çözüm sunuyor."
            },
            {
                id: 2,
                title: "Trim Sesleri (Emniyet Kemeri/A Sütunu)",
                severity: "low",
                reportCount: 380,
                description: "B sütunundan ve emniyet kemeri mekanizmasından tıkırtı sesleri gelmesi yaygın."
            },
            {
                id: 3,
                title: "İnce Kaporta Boyası",
                severity: "medium",
                reportCount: 520,
                description: "Özellikle kaput ve tamponda taş izleri çok çabuk oluşuyor. Kullanıcılar seramik kaplama veya PPF öneriyor."
            },
            {
                id: 4,
                title: "Yakıt Pompası Arızası",
                severity: "high",
                reportCount: 150,
                description: "Bazı modellerde yakıt pompası kaynaklı yolda kalma riski nedeniyle geri çağırma bültenleri yayınlandı."
            }
        ],
        userExperiences: [],
        totalReports: 1850
    },
    {
        id: 6,
        brand: "Volkswagen",
        model: "Passat",
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
                id: 1,
                title: "DSG Mekatronik ve Volant",
                severity: "high",
                reportCount: 850,
                description: "DSG Şanzımanın 'kral' ama 'nazlı' olduğu bilinir. Mekatronik kart arızası ve çift kütleli volanttan gelen 'takırtı' sesi en büyük korkulu rüyadır. Onarımı maliyetlidir."
            },
            {
                id: 2,
                title: "Devirdaim (Su Pompası) Kaçağı",
                severity: "medium",
                reportCount: 620,
                description: "Özellikle 1.4 TSI ve 1.6 TDI motorlarda devirdaim pompasından su kaçırma kroniktir. Triger seti değişirken mutlaka kontrol edilmeli ve değişmelidir."
            },
            {
                id: 3,
                title: "Cam Tavan Gıcırtısı",
                severity: "low",
                reportCount: 480,
                description: "Panoramik cam tavan kasislerde ve esnemelerde gıcırtı yapabilir. Serviste özel yağlama ile geçici çözüm sağlanır ama tekrarlayabilir."
            },
            {
                id: 4,
                title: "Kapı Kilit Mekanizması",
                severity: "low",
                reportCount: 250,
                description: "Soğuk havalarda kapıların kilitlenmemesi veya dışarıdan açılmaması sorunu yaşanabilir."
            }
        ],
        userExperiences: [],
        totalReports: 2100
    },
    {
        id: 7,
        brand: "Dacia",
        model: "Duster",
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
                reportCount: 380,
                description: "Manevralarda veya bozuk yolda direksiyondan gelen 'takırtı' veya inleme sesi. Genellikle direksiyon kutusu veya milindeki boşluktan kaynaklanıyor."
            },
            {
                id: 2,
                title: "Toz ve Su Alma Sorunu",
                severity: "low",
                reportCount: 450,
                description: "Bazı modellerde kapı fitillerinin yetersizliği nedeniyle araç içine, özellikle kapı eşiklerine toz ve yoğun yağmurda su girmesi Şikayetleri mevcut."
            },
            {
                id: 3,
                title: "AdBlue Sistemi Arızası",
                severity: "high",
                reportCount: 310,
                description: "Blue dCi motorlarda AdBlue pompası veya enjektör tıkanıklığı nedeniyle 'Egzoz Emisyon' uyarısı ve servis ihtiyacı."
            },
            {
                id: 4,
                title: "Yakıt Göstergesi Tutarsızlığı",
                severity: "low",
                reportCount: 220,
                description: "LPG'li modellerde benzin/LPG göstergesinin yanlış seviye göstermesi veya takılı kalması."
            }
        ],
        userExperiences: [],
        totalReports: 1400
    },
    {
        id: 8,
        brand: "Hyundai",
        model: "i20",
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
                reportCount: 500,
                description: "Pedaldan ayağı çekerken gelen 'guuuuğğkkk' veya gıcırtı sesi. Debriyaj müşürü veya aktüatör kaynaklı, sürüşe engel değil ama can sıkıcı."
            },
            {
                id: 2,
                title: "Vernik/Boya Atması",
                severity: "medium",
                reportCount: 280,
                description: "Özellikle kaput ve tavan bölgesinde erken vernik atması veya boya dökülmesi Şikayetleri (beyaz renklerde daha sık)."
            },
            {
                id: 3,
                title: "Rölanti Dalgalanması",
                severity: "low",
                reportCount: 350,
                description: "Rölantide devir saatinin kendi kendine inip kalkması. Genellikle LPG'li araçlarda veya debriyaj müşürü kaynaklı."
            },
            {
                id: 4,
                title: "Direksiyon Derisi Soyulması",
                severity: "medium",
                reportCount: 350,
                description: "Erken kilometrelerde direksiyon simidinde soyulma. Garanti kapsamında değişim yapılıyor."
            },
            {
                id: 5,
                title: "Benzin Pompası Sesi",
                severity: "low",
                reportCount: 200,
                description: "Arka koltuk altından gelen 'vınlama' veya 'vızzz' sesi. Depo azken artabilir."
            }
        ],
        userExperiences: [],
        totalReports: 1100
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
                id: 1,
                title: "1.6 THP Triger Zinciri Uzaması",
                severity: "high",
                reportCount: 350,
                description: "Erken dönem 1.6 THP benzinli motorlarda triger zincirinin erken uzaması ve sente atlaması sonucu motor arıza lambası yakması kroniktir."
            },
            {
                id: 2,
                title: "Auto6R Şanzıman Kavrama/Volan Arızası",
                severity: "high",
                reportCount: 520,
                description: "Yarı otomatik Auto6R şanzımanda kavrama (baskı balata) ve volan dişlisinin erken ömrünü tamamlaması, dur-kalklarda silkeleme yapması yaygındır."
            },
            {
                id: 3,
                title: "Amortisör Takozu Sesleri",
                severity: "low",
                reportCount: 410,
                description: "Ön süspansiyonlardan, özellikle kasis geçişlerinde lokurtu/gıcırtı sesleri gelmesi sık rastlanan bir montaj/parça zayıflığıdır."
            }
        ],
        userExperiences: [],
        totalReports: 1200
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
                id: 1,
                title: "1.5 BlueHDi AdBlue Sistemi Arızası",
                severity: "high",
                reportCount: 1250,
                description: "PSA grubunun kronik sorunudur. AdBlue deposu, pompası veya enjektörünün tıkanması sonucu 'Motor Arızası - Aracı Durdurun' veya 'Emisyon Hatası' vererek sistemin komple değişmesini gerektirebilir."
            },
            {
                id: 2,
                title: "1.2 PureTech Triger Kayışı Soyulması",
                severity: "high",
                reportCount: 890,
                description: "Yağ içinde çalışan triger kayışının erken yıpranarak (soyularak) partiküllerinin yağ süzgecini tıkaması ve motor yağ basıncı arızası vermesi durumudur. Erken bakım şarttır."
            },
            {
                id: 3,
                title: "EAT6/EAT8 Şanzıman Düşük Hız Vuruntusu",
                severity: "medium",
                reportCount: 560,
                description: "Özellikle 2. vitesten 1. vitese düşerken veya durmaya yakın hızlarda şanzımandan hafif bir vuruntu veya sarsıntı hissedilebilir. Yazılım güncellemesi ile büyük ölçüde çözülür."
            },
            {
                id: 4,
                title: "Multimedya (SMEG/NAC) Ekran Donması",
                severity: "low",
                reportCount: 730,
                description: "Orta ekranın kendi kendine kapanması, geri görüş kamerasının siyah ekranda kalması veya Bluetooth bağlantısının kopması sorunları yazılımsal olarak yaşanmaktadır."
            }
        ],
        userExperiences: [],
        totalReports: 3400
    },
    {
        id: 10,
        brand: "Opel",
        model: "Corsa",
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
                id: 1,
                title: "Triger Kayışı Soyulması (1.2 PureTech)",
                severity: "high",
                reportCount: 450,
                description: "Peugeot grubu motorlarda olduğu gibi, kayışın parçalanıp yağ süzgecini tıkaması riski. 'Yağ Basıncı Düşük' uyarısı alırsanız hemen durun."
            },
            {
                id: 2,
                title: "Multimedya Ekran Kararması",
                severity: "low",
                reportCount: 220,
                description: "Ekranın siyah olması veya dokunmatiğin tepki vermemesi. Genellikle akü kutup başı sök-tak veya güncelleme ile düzelir."
            },
            {
                id: 3,
                title: "Direksiyon Kutusu Sesi",
                severity: "medium",
                reportCount: 180,
                description: "Kasislerde direksiyondan gelen tıkırtı sesi."
            }
        ],
        userExperiences: [],
        totalReports: 950
    },
    {
        id: 11,
        brand: "Togg",
        model: "T10X",
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
                reportCount: 600,
                description: "Ana ekranın veya göstergelerin sürüş esnasında donması, kararması. Reset atılarak (iki tuşa basılı tutarak) çözülüyor ancak can sıkıcı."
            },
            {
                id: 2,
                title: "Şarj Başlatma Hatası",
                severity: "high",
                reportCount: 350,
                description: "Bazı DC istasyonlarda 'Şarj Başlatılamadı' hatası veya Şarjın yarıda kesilmesi. OBC (On-Board Charger) güncellemesi gerekebiliyor."
            },
            {
                id: 3,
                title: "SOS / eCall Hatası",
                severity: "low",
                reportCount: 420,
                description: "Tavandaki SOS modülünün yazılımsal olarak hata vermesi ve ekranda sürekli uyarı çıkması."
            }
        ],
        userExperiences: [],
        totalReports: 2200
    },
    {
        id: 12,
        brand: "Chery",
        model: "Tiggo 8 Pro",
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
                id: 1,
                title: "Yüksek Yakıt Tüketimi",
                severity: "medium",
                reportCount: 850,
                description: "Kullanıcıların en büyük Şikayeti. Fabrika verisinin çok üzerinde (11-12L) yakması. 'Tüp takılmaz mı?' sorusu çok yaygın."
            },
            {
                id: 2,
                title: "Şanzıman Kararsızlığı/Vuruntu",
                severity: "low",
                reportCount: 300,
                description: "Düşük hızlarda veya dur-kalk trafikte Şanzımanın vites geçişlerinde kararsız kalması veya hafif vuruntu yapması."
            },
            {
                id: 3,
                title: "Multimedya/Klima Ekran Donması",
                severity: "low",
                reportCount: 250,
                description: "Klima panelinin veya ana ekranın tepki vermemesi. Yazılım güncellemesi ile düzeliyor."
            }
        ],
        userExperiences: [],
        totalReports: 1200
    },
    {
        id: 13,
        brand: "Volkswagen",
        model: "Golf",
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
                reportCount: 550,
                description: "Golf 8'in en büyük baş belası. Ekranın donması, siyah ekran, asistan sistemlerin 'Şu an kullanılamıyor' uyarısı vermesi. Güncellemelerle çözülmeye çalışılıyor."
            },
            {
                id: 2,
                title: "SOS Acil Çağrı Hatası",
                severity: "low",
                reportCount: 320,
                description: "Tavandaki SOS modülünün arıza verip göstergede sürekli uyarı yakması. Parça değişimi gerekebiliyor."
            },
            {
                id: 3,
                title: "DSG Titreme ve Kararsızlık",
                severity: "medium",
                reportCount: 400,
                description: "Özellikle 1. vitesen 2'ye geçerken kararsızlık veya titreme yapması. Kavrama ömrünün habercisi olabilir."
            }
        ],
        userExperiences: [],
        totalReports: 1200
    },
    {
        id: 14,
        brand: "Ford",
        model: "Focus",
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
                id: 1,
                title: "8 İleri Şanzıman Titremesi",
                severity: "medium",
                reportCount: 380,
                description: "Düşük hızlarda veya dur-kalk trafikte Şanzımanın titreme (silkeleme) yapması. Yazılım güncellemesi veya valf gövdesi değişimi gerekebiliyor."
            },
            {
                id: 2,
                title: "Multimedya Ekran Donması",
                severity: "low",
                reportCount: 200,
                description: "Sync ekranının tepki vermemesi veya geri görüş kamerasının geç gelmesi."
            },
            {
                id: 3,
                title: "B Sütunu Trim Sesi",
                severity: "low",
                reportCount: 310,
                description: "Emniyet kemeri çıkışından gelen tıkırtı sesi, özellikle bozuk yolda belirginleşiyor."
            }
        ],
        userExperiences: [],
        totalReports: 850
    },
    {
        id: 15,
        brand: "BMW",
        model: "320i",
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
                reportCount: 250,
                description: "Genleşme kabı, devirdaim veya hortumlardan soğutma sıvısı kaçağı. 'Soğutma suyu seviyesi düşük' uyarısı dikkate alınmalı."
            },
            {
                id: 2,
                title: "Direksiyon Trim Sesi",
                severity: "low",
                reportCount: 300,
                description: "Direksiyon simidinden veya airbag sargısından gelen sürtünme/gıcırtı sesi."
            },
            {
                id: 3,
                title: "Klima Izgarası Kırılması",
                severity: "low",
                reportCount: 150,
                description: "Ön konsol havalandırma yönlendirme ızgaralarının hassas olması ve çabuk kırılması."
            }
        ],
        userExperiences: [],
        totalReports: 700
    },
    {
        id: 16,
        brand: "Mercedes-Benz",
        model: "C180",
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
                reportCount: 450,
                description: "Aracın çalışmamasına neden olan kronik bir sorun. '48V sistemi arızası' uyarısı verip yolda bırakabiliyor. Yazılım veya parça değişimi gerektirir."
            },
            {
                id: 2,
                title: "Fren Sesi ve Titreme",
                severity: "low",
                reportCount: 320,
                description: "Düşük hızlarda frenlerden gelen sürtünme sesi ve disklerin çabuk eğilmesi sonucu titreme."
            },
            {
                id: 3,
                title: "Trim Sesleri (Konsol)",
                severity: "low",
                reportCount: 280,
                description: "Özellikle orta konsol ve ekran çevresinden gelen gıcırtı sesleri (piyano siyahı parçalar)."
            }
        ],
        userExperiences: [],
        totalReports: 650
    },
    {
        id: 17,
        brand: "Chery",
        model: "Omoda 5",
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
                reportCount: 350,
                description: "Frenleme esnasında metalik sürtünme sesi ve disklerde erken eğilme sonucu titreme. Servislerde değişim yapılıyor."
            },
            {
                id: 2,
                title: "Yüksek Yakıt Tüketimi",
                severity: "medium",
                reportCount: 500,
                description: "Fabrika verisinin çok üzerinde, agresif kullanımda 12-13 litreleri görebilen tüketim."
            },
            {
                id: 3,
                title: "Ayna Titremesi",
                severity: "low",
                reportCount: 180,
                description: "Yüksek hızlarda yan aynaların rüzgar etkisiyle titremesi."
            }
        ],
        userExperiences: [],
        totalReports: 1100
    },
    {
        id: 18,
        brand: "Nissan",
        model: "Qashqai",
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
                reportCount: 420,
                description: "Aracın 'Sistem Hatası' verip çalışmaması veya yolda kalması. Genellikle jeneratör ünitesi veya inverter kaynaklı ciddi bir arıza."
            },
            {
                id: 2,
                title: "Ekran Donması ve Kararma",
                severity: "medium",
                reportCount: 310,
                description: "Multimedya ekranının tepki vermemesi, donması veya tamamen kararması. Yazılım güncellemesi ile bazen çözülüyor."
            },
            {
                id: 3,
                title: "Akü Zayıflığı",
                severity: "low",
                reportCount: 220,
                description: "12V akünün çabuk bitmesi sonucu aracın sistemlerinin devreye girmemesi."
            }
        ],
        userExperiences: [],
        totalReports: 1300
    },
    {
        id: 19,
        brand: "Hyundai",
        model: "Tucson",
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
                reportCount: 450,
                description: "Egzoz sistemi uyarısı olarak çıkar. Özellikle sürekli kısa mesafe kullanımlarda partikül filtresi tıkanabilir. Uzun yolda yüksek devir çevirmek gerekebilir."
            },
            {
                id: 2,
                title: "Kalkışta Titreme",
                severity: "low",
                reportCount: 320,
                description: "DCT Şanzımanın kavraması kaynaklı, özellikle yokuş kalkışlarında veya 1-2 vites geçişlerinde titreme."
            },
            {
                id: 3,
                title: "Multimedya Reset",
                severity: "low",
                reportCount: 150,
                description: "Ekranın nadiren donması ve resetleme gerektirmesi."
            }
        ],
        userExperiences: [],
        totalReports: 1250
    },
    {
        id: 20,
        brand: "Kia",
        model: "Sportage",
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
                reportCount: 280,
                description: "Yoğun dur-kalk trafikte Şanzıman sıcaklık uyarısı verip kenara çekmenizi isteyebilir. Kuru kavrama handikapı."
            },
            {
                id: 2,
                title: "Sunroof Sesi",
                severity: "low",
                reportCount: 190,
                description: "Cam tavan mekanizmasından veya fitillerinden gelen tıkırtı/gıcırtı sesleri."
            },
            {
                id: 3,
                title: "PPF (Partikül Filtresi) Sorunu",
                severity: "medium",
                reportCount: 250,
                description: "Benzinli modellerde partikül filtresi tıkanıklığı uyarısı (Tucson ile ortak sorun)."
            }
        ],
        userExperiences: [],
        totalReports: 980
    },
    {
        id: 21,
        brand: "Peugeot",
        model: "2008",
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
                reportCount: 550,
                description: "Kayışın parçalanıp yağ kanalını tıkaması sonucu 'Yağ Basıncı Arızası'. Motor yatak sarmasına kadar gidebilir. Periyodik kontrol Şart."
            },
            {
                id: 2,
                title: "Yağ Eksiltme",
                severity: "medium",
                reportCount: 380,
                description: "1.2 Turbo benzinli motorlarda yağ yakma/eksiltme sorunu."
            },
            {
                id: 3,
                title: "AdBlue Depo Sorunu (Dizel)",
                severity: "high",
                reportCount: 220,
                description: "Dizel versiyonlarda AdBlue deposu/pompası arızası."
            }
        ],
        userExperiences: [],
        totalReports: 1400
    },
    {
        id: 22,
        brand: "Opel",
        model: "Astra",
        year: "2022-2025",
        ncapStars: 4,
        ncapYear: "2022",
        dnaScore: 78,
        strengths: ["Keskin tasarım (Vizor)", "Alman ergonomisi", "Yol tutuş"],
        weaknesses: ["Multimedya hızı", "Sert koltuklar", "Vasat arka görüş"],
        chronicIssues: [
            { id: 1, title: "Ekran Kararması", severity: "low", reportCount: 150, description: "Pure Panel ekran sorunları." }
        ],
        userExperiences: [],
        totalReports: 800
    },
    {
        id: 23,
        brand: "Honda",
        model: "City",
        year: "2021-2025",
        ncapStars: 4, // ASEAN NCAP 5 stars
        ncapYear: "2020",
        dnaScore: 74,
        strengths: ["Geniş iç hacim", "Ekonomik motor", "Sorunsuzluk"],
        weaknesses: ["Yalıtım zayıf", "Dar lastikler", "Bazı donanımlar eksik"],
        chronicIssues: [
            { id: 1, title: "Boya Kalitesi", severity: "medium", reportCount: 110, description: "İnce boya katmanı." }
        ],
        userExperiences: [],
        totalReports: 600
    },
    {
        id: 24,
        brand: "Volkswagen",
        model: "Polo",
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
                reportCount: 350,
                description: "Özellikle 2. vites geçişlerinde kararsızlık ve titreme. Yoğun trafikte manüel modda kullanılması önerilir."
            },
            {
                id: 2,
                title: "Klima Kompresör Sesi",
                severity: "low",
                reportCount: 180,
                description: "Klima açıldığında motordan gelen uğultu veya vınlama sesi."
            },
            {
                id: 3,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 220,
                description: "Sert süspansiyon nedeniyle bozuk yollarda B sütunu ve konsoldan gelen tıkırtılar."
            }
        ],
        userExperiences: [],
        totalReports: 1150
    },
    {
        id: 25,
        brand: "Citroen",
        model: "C4 X",
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
                reportCount: 350,
                description: "Multimedya ekranının sürüş esnasında siyah olması, donması veya 'Hello Citroen' asistanının çalışmaması. Yazılım güncellemesi ile düzeliyor."
            },
            {
                id: 2,
                title: "Süspansiyon Sesi (Lokurtu)",
                severity: "low",
                reportCount: 420,
                description: "Özellikle tümsek geçişlerinde arka süspansiyondan gelen tok 'lok lok' sesi. Amortisör yapısı kaynaklı karakteristik bir durum."
            },
            {
                id: 3,
                title: "AdBlue Uyarısı",
                severity: "medium",
                reportCount: 180,
                description: "Dizel versiyonlarda AdBlue sistemi arızası veya yanlış seviye uyarısı."
            }
        ],
        userExperiences: [],
        totalReports: 500
    },
    {
        id: 26,
        brand: "Skoda",
        model: "Octavia",
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
                reportCount: 550,
                description: "Golf 8 ile benzer platformu paylaştığı için yazılım hataları (ekran donması, asistan hataları) ve 'SOS arızası' uyarısı yaygındır."
            },
            {
                id: 2,
                title: "Vites Seçici (Shift-by-wire) Hatası",
                severity: "low",
                reportCount: 220,
                description: "Küçük vites mandalının bazen tepki vermemesi veya 'Aracı P konumuna alın' uyarısı."
            },
            {
                id: 3,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 300,
                description: "Özellikle kapı tutamaklarından ve B sütunundan gelen gıcırtı sesleri."
            }
        ],
        userExperiences: [],
        totalReports: 1600
    },
    {
        id: 27,
        brand: "Skoda",
        model: "Superb",
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
                reportCount: 420,
                description: "Cam çevresindeki krom çıtaların zamanla matlaşması ve lekelenmesi. Garantiden değişim zor olabiliyor."
            },
            {
                id: 2,
                title: "DSG Mekatronik Arızası",
                severity: "high",
                reportCount: 350,
                description: "Volkswagen grubunun klasik sorunu. Vites geçişlerinde vuruntu veya 'Şanzıman Hatası' uyarısı. Maliyetli olabilir."
            },
            {
                id: 3,
                title: "Amortisör Takoz Sesi",
                severity: "low",
                reportCount: 280,
                description: "Kasis geçişlerinde ön takımdan gelen gıcırtı sesi."
            }
        ],
        userExperiences: [],
        totalReports: 1800
    },
    {
        id: 28,
        brand: "Chery",
        model: "Tiggo 7 Pro",
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
                reportCount: 450,
                description: "Kullanıcıların en büyük Şikayeti. Fabrika verisinin üzerinde, agresif kullanımda 12 litreleri görebiliyor."
            },
            {
                id: 2,
                title: "Şanzıman Isınması/Vuruntu",
                severity: "low",
                reportCount: 280,
                description: "Yoğun trafikte Şanzıman ısınma uyarısı veya vites geçişlerinde (özellikle 1-2) sarsıntı."
            },
            {
                id: 3,
                title: "Multimedya Donması",
                severity: "low",
                reportCount: 200,
                description: "Apple CarPlay bağlantı kopması veya ekranın tamamen donması."
            }
        ],
        userExperiences: [],
        totalReports: 900
    },
    {
        id: 29,
        brand: "Seat",
        model: "Leon",
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
                reportCount: 420,
                description: "Gösterge panelinde sürekli yanan 'SOS Arızası' uyarısı. Golf 8 ile ortak kronik sorun. Yazılım veya modül değişimi gerekiyor."
            },
            {
                id: 2,
                title: "Multimedya Resetleme",
                severity: "medium",
                reportCount: 310,
                description: "Ekranın kendi kendine kapanıp açılması, donması. Yazılım güncellemesi ile düzelme ihtimali var."
            },
            {
                id: 3,
                title: "Arka Stop Çatlaması",
                severity: "low",
                reportCount: 150,
                description: "Boydan boya uzanan arka led stop lambasında kılcal çatlamalar oluşması."
            }
        ],
        userExperiences: [],
        totalReports: 1300
    },
    {
        id: 30,
        brand: "Tesla",
        model: "Model Y",
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
                reportCount: 650,
                description: "Otopilot veya hız sabitleyici açıkken, araç gölgeyi veya tünel girişini engel sanıp aniden sert fren yapabiliyor. Arkadan gelen araç için risk oluşturabilir."
            },
            {
                id: 2,
                title: "Montaj ve Panel Açıklıkları",
                severity: "low",
                reportCount: 520,
                description: "Kapı, bagaj veya kaput aralıklarının eşit olmaması (Panel Gaps). Berlin üretimi araçlarda azalsa da hala görülebiliyor."
            },
            {
                id: 3,
                title: "Trim Sesleri",
                severity: "low",
                reportCount: 480,
                description: "Sessiz elektrik motoru nedeniyle kabin içindeki en ufak tıkırtı (emniyet kemeri, koltuk kızakları) duyulabiliyor."
            },
            {
                id: 4,
                title: "Süspansiyon Sertliği",
                severity: "medium",
                reportCount: 750,
                description: "Özellikle 2022-2023 modellerde süspansiyon oldukça sert. 20 cm jantlı Performance modellerde konfor daha da azalıyor."
            }
        ],
        userExperiences: [],
        totalReports: 2000
    },
    {
        id: 31,
        brand: "Hyundai",
        model: "i20 (2014-2019 Orta Kasa)",
        year: "2014-2019 Orta Kasa",
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
                reportCount: 420,
                description: "Sürekli şehir içi ve düşük devir kullanımında DPF'nin kurum bağlaması. Çekiş düşüklüğü, artan yakıt tüketimi ve motor arıza lambasıyla kendini belli eder. Yüksek devirli uzun yol kullanımı ile temizlenmesi gerekir."
            },
            {
                id: 2,
                title: "Direksiyon Derisi Soyulması",
                severity: "medium",
                reportCount: 350,
                description: "Düşük kilometrelerde bile direksiyon simidinde erken aşınma ve bölgesel soyulmaların başlaması. Özellikle güneşe maruz kalan araçlarda daha sık görülür."
            },
            {
                id: 3,
                title: "Motor Kulağı Yıpranması / Kabin Titreşimi",
                severity: "medium",
                reportCount: 280,
                description: "Kilometre ilerledikçe motor takozlarının özelliğini yitirmesi sonucu rölantideyken dizel motorun titreşiminin kabin içine, direksiyona ve pedallara fazlaca yansıması."
            },
            {
                id: 4,
                title: "Turbo Hortumu Terlemesi",
                severity: "low",
                reportCount: 150,
                description: "Yüksek kilometreli araçlarda turbo borularında yağ terlemesi veya ufak basınç kaçakları oluşması. İvmelenme esnasında ekstra ıslık sesiyle fark edilebilir."
            }
        ],
        userExperiences: [],
        totalReports: 1200
    },
    {
        id: 32,
        brand: "Hyundai",
        model: "i30 (2012-2017 GD Kasa)",
        year: "2012-2017 GD Kasa",
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
                reportCount: 580,
                description: "Elektrikli direksiyon motorunun (EPS) içindeki plastik yıldız burcun zamanla aşınıp ufalanması sonucu, bozuk yollarda direksiyon kutusundan kabine belirgin bir 'tık tık tık' ses gelmesi. Uygun maliyetli burç değişimiyle çözülür."
            },
            {
                id: 2,
                title: "DCT Şanzıman Titremesi (2015 Sonrası)",
                severity: "medium",
                reportCount: 420,
                description: "2015 yılı makyajıyla gelen 7 ileri DCT şanzımanlarda, yoğun dur-kalk trafiğinde kavramanın ısınıp uyarı vermesi veya yokuşlarda 1'den 2'ye geçerken kavrama titremesi."
            },
            {
                id: 3,
                title: "Geri Görüş Kamerası Mekanizma Takılması",
                severity: "medium",
                reportCount: 310,
                description: "Bagaj kapağındaki Hyundai logosunun arkasında gizli kameranın, toz/pislik girmesi veya mekanik dişli sıyırması sebebiyle takılı kalıp açılmaması ya da kapanmaması durumu."
            },
            {
                id: 4,
                title: "Panoramik Cam Tavan Esneme Sesi",
                severity: "medium",
                reportCount: 450,
                description: "Elite paketlerdeki büyük cam tavanın fitillerinin kuruması veya ağır kasanın esnemesi sebebiyle çapraz kasis geçişlerinde tavandan gıcırtı ve çıtırtı sesleri gelmesi. Silikon spreyi ile çözülebilir."
            },
            {
                id: 5,
                title: "Direksiyon Derisi Soyulması",
                severity: "low",
                reportCount: 350,
                description: "Araç kapalı garajda muhafaza edilmediyse, direksiyon simidindeki suni deri kaplamanın el teri ve güneşe bağlı olarak erken kilometrelerde soyulmaya ve matlaşmaya başlaması."
            }
        ],
        userExperiences: [],
        totalReports: 1400
    },
    {
        id: 33,
        brand: "Audi",
        model: "TT (2006-2014 Mk2)",
        year: "2009-2011 Dönemi Odaklı",
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
                reportCount: 850,
                description: "Özellikle 2009-2011 arası üretilen 1.8 ve 2.0 TFSI (EA888 kodlu) motorların hatalı tasarlanan yağ segmanları nedeniyle 1000 kilometrede 1 litreye varan yağ eksiltmesi. Genellikle motorun açılıp revize edilmiş segman ve pistonlarla toplanması gerekir."
            },
            {
                id: 2,
                title: "S tronic (DSG) Mekatronik ve Kavrama Yıpranması",
                severity: "high",
                reportCount: 620,
                description: "Hor kullanılmış veya yazılımla torku yükseltilmiş araçlarda çift kavramanın erken bitmesi veya mekatronik beyninin arıza vermesi. Vites geçişlerinde kararsızlık, vuruntu ve silkeleme ile kendini belli eder."
            },
            {
                id: 3,
                title: "PCV Valfi ve Bobin Arızaları",
                severity: "medium",
                reportCount: 410,
                description: "Karter havalandırma (PCV) valfinin içindeki diyaframın zamanla yırtılması sonucu aracın rölantisinin dalgalanması, ıslık sesi çıkarması ve yağ yakımının artması."
            },
            {
                id: 4,
                title: "Arka Stop Lambası Şasi Problemi",
                severity: "low",
                reportCount: 290,
                description: "Arka stop lambalarının duy soketlerindeki toprak (şasi) hattının zayıf olması sebebiyle zamanla ısınarak soketin erimesi. Genelde ek bir şasi kablosu çekilerek ucuza çözülür."
            },
            {
                id: 5,
                title: "Cam Krikosu ve Şalter Arızaları",
                severity: "low",
                reportCount: 210,
                description: "Kapı açıldığında camı bir miktar aşağı indiren mekanizmanın zamanla bozulması veya cam krikosu tellerinin koparak camın kapı içinde düşmesi."
            }
        ],
        userExperiences: [],
        totalReports: 1800
    },
    {
        id: 34,
        brand: "Renault",
        model: "Clio 4 (2012-2019 4. Jenerasyon)",
        year: "2012-2019 Dördüncü Jenerasyon",
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
                reportCount: 1250,
                description: "Clio 4'ün en meşhur kronik sorunudur. Ön kelebek camlarından, ayna diplerinden ve kapı fitillerinden 90 km/s hızdan itibaren kabine belirgin ıslık/rüzgar sesi girmesi. Genelde ekstra fitil uygulaması ile çözülür."
            },
            {
                id: 2,
                title: "EDC Şanzıman Beyni ve Kavrama Sorunları",
                severity: "high",
                reportCount: 890,
                description: "Otomatik vitesli (EDC çift kavrama) versiyonlarda, yoğun dur-kalk trafikte kavramanın çabuk ısınarak silkeleme yapması ve şanzıman beyninin (TCM) lehim atarak arıza vermesi durumu."
            },
            {
                id: 3,
                title: "Ön Takım ve Süspansiyon Sesleri",
                severity: "medium",
                reportCount: 760,
                description: "Süspansiyonların sertliği sebebiyle viraj demir uç lastikleri, Z rotlar ve amortisör takozlarının erken yıpranması, çukurlarda ön takımdan lok lok vuruntu sesleri gelmesi."
            },
            {
                id: 4,
                title: "Direksiyon ve Vites Topuzu Soyulması",
                severity: "medium",
                reportCount: 650,
                description: "Özellikle Touch ve Joy paketlerde kullanılan suni deri direksiyon simidinin ve vites topuzu nikelajının el terine dayanamayıp 40-50 bin kilometrelerde soyulup dökülmeye başlaması."
            },
            {
                id: 5,
                title: "MediaNav Multimedya Çökmeleri",
                severity: "low",
                reportCount: 420,
                description: "Dokunmatik ekranlı MediaNav sisteminin ara sıra logoda takılı kalması, donması veya Bluetooth bağlantısının kopması. Çoğu zaman yazılım güncellemesi ile düzeltilebilmektedir."
            }
        ],
        userExperiences: [],
        totalReports: 2100
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
