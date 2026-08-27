export interface CuratedSurveyNominee {
    id: number;
    name: string;
    votes: number;
}

export interface CuratedSurvey {
    id: string;
    title: string;
    description: string;
    category: "Motor" | "Performans" | "Modifiye" | "Sürüş" | "Genel";
    status: "active";
    totalVotes: number;
    nominees: CuratedSurveyNominee[];
    createdBy: string;
    source: "curated";
}

export const curatedSurveys: CuratedSurvey[] = [
    {
        id: "curated-city-powertrain",
        title: "Şehir içi kullanımda hangi motor seçeneğini tercih edersiniz?",
        description: "Yakıt maliyeti, sessizlik, servis erişimi ve günlük menzili birlikte düşünün.",
        category: "Motor",
        status: "active",
        totalVotes: 486,
        nominees: [
            { id: 1, name: "Tam hibrit", votes: 154 },
            { id: 2, name: "Benzin", votes: 111 },
            { id: 3, name: "Elektrik", votes: 98 },
            { id: 4, name: "Dizel", votes: 69 },
            { id: 5, name: "LPG", votes: 54 },
        ],
        createdBy: "OtoSöz Editör",
        source: "curated",
    },
    {
        id: "curated-used-car-first-check",
        title: "İkinci el araç alırken ilk kontrolünüz hangisi?",
        description: "İlanı beğendikten sonra kararınızı en çok etkileyen ilk doğrulama adımını seçin.",
        category: "Genel",
        status: "active",
        totalVotes: 438,
        nominees: [
            { id: 1, name: "Bağımsız ekspertiz", votes: 172 },
            { id: 2, name: "Hasar ve kilometre kaydı", votes: 124 },
            { id: 3, name: "Yetkili servis geçmişi", votes: 72 },
            { id: 4, name: "Satıcı ve ilan güvenilirliği", votes: 45 },
            { id: 5, name: "Test sürüşü", votes: 25 },
        ],
        createdBy: "OtoSöz Editör",
        source: "curated",
    },
    {
        id: "curated-safety-essential",
        title: "Yeni araçta olmazsa olmaz güvenlik donanımı hangisi?",
        description: "Tek bir sistemi standart donanım olarak seçebilseydiniz hangisini öne alırdınız?",
        category: "Genel",
        status: "active",
        totalVotes: 397,
        nominees: [
            { id: 1, name: "Otomatik acil fren", votes: 139 },
            { id: 2, name: "Kör nokta uyarısı", votes: 83 },
            { id: 3, name: "Adaptif hız sabitleyici", votes: 79 },
            { id: 4, name: "Şerit takip desteği", votes: 51 },
            { id: 5, name: "360 derece kamera", votes: 45 },
        ],
        createdBy: "OtoSöz Editör",
        source: "curated",
    },
    {
        id: "curated-automatic-priority",
        title: "Otomatik şanzımanda önceliğiniz nedir?",
        description: "Yoğun trafik ve uzun dönem kullanım maliyetini birlikte değerlendirerek oy verin.",
        category: "Performans",
        status: "active",
        totalVotes: 364,
        nominees: [
            { id: 1, name: "Dayanıklılık", votes: 148 },
            { id: 2, name: "Sarsıntısız geçiş", votes: 91 },
            { id: 3, name: "Düşük bakım maliyeti", votes: 67 },
            { id: 4, name: "Yakıt ekonomisi", votes: 39 },
            { id: 5, name: "Hızlı vites değişimi", votes: 19 },
        ],
        createdBy: "OtoSöz Editör",
        source: "curated",
    },
    {
        id: "curated-ev-barrier",
        title: "Elektrikli otomobile geçişte en büyük engeliniz nedir?",
        description: "Bugün araç değiştirecek olsanız elektrikliye geçmenizi durduran temel nedeni seçin.",
        category: "Motor",
        status: "active",
        totalVotes: 351,
        nominees: [
            { id: 1, name: "Satın alma fiyatı", votes: 112 },
            { id: 2, name: "Şarj altyapısı", votes: 87 },
            { id: 3, name: "Apartmanda şarj imkânı", votes: 66 },
            { id: 4, name: "Batarya ve ikinci el değeri", votes: 55 },
            { id: 5, name: "Uzun yol menzili", votes: 31 },
        ],
        createdBy: "OtoSöz Editör",
        source: "curated",
    },
    {
        id: "curated-ideal-body",
        title: "Türkiye'de günlük kullanım için ideal kasa tipi hangisi?",
        description: "Park kolaylığı, iç hacim, yol koşulları ve tüketimi birlikte düşünün.",
        category: "Sürüş",
        status: "active",
        totalVotes: 329,
        nominees: [
            { id: 1, name: "Hatchback", votes: 92 },
            { id: 2, name: "SUV / Crossover", votes: 87 },
            { id: 3, name: "Sedan", votes: 75 },
            { id: 4, name: "Station wagon", votes: 49 },
            { id: 5, name: "MPV", votes: 26 },
        ],
        createdBy: "OtoSöz Editör",
        source: "curated",
    },
    {
        id: "curated-long-road-fatigue",
        title: "Uzun yolda sizi en çok yoran sorun hangisi?",
        description: "Sık yolculuklarınızda konforu en çok düşüren unsuru işaretleyin.",
        category: "Sürüş",
        status: "active",
        totalVotes: 312,
        nominees: [
            { id: 1, name: "Yol ve rüzgâr sesi", votes: 94 },
            { id: 2, name: "Yetersiz koltuk desteği", votes: 74 },
            { id: 3, name: "Sert süspansiyon", votes: 61 },
            { id: 4, name: "Zayıf farlar", votes: 43 },
            { id: 5, name: "Sürüş desteklerinin eksikliği", votes: 40 },
        ],
        createdBy: "OtoSöz Editör",
        source: "curated",
    },
    {
        id: "curated-service-trust",
        title: "Araç bakımında en çok hangi konuda güven sorunu yaşıyorsunuz?",
        description: "Servis deneyiminizde şeffaflığı en çok bozan noktayı toplulukla paylaşın.",
        category: "Genel",
        status: "active",
        totalVotes: 286,
        nominees: [
            { id: 1, name: "Fiyat ve işçilik şeffaflığı", votes: 101 },
            { id: 2, name: "Gereksiz parça değişimi", votes: 67 },
            { id: 3, name: "Doğru arıza teşhisi", votes: 55 },
            { id: 4, name: "Kullanılan parçanın kalitesi", votes: 41 },
            { id: 5, name: "Teslim süresine uyulması", votes: 22 },
        ],
        createdBy: "OtoSöz Editör",
        source: "curated",
    },
    {
        id: "curated-tire-criterion",
        title: "Lastik seçiminde ilk kriteriniz hangisi?",
        description: "Aynı ebatta benzer fiyatlı seçenekler arasında kararınızı ne belirler?",
        category: "Performans",
        status: "active",
        totalVotes: 271,
        nominees: [
            { id: 1, name: "Islak zeminde fren", votes: 99 },
            { id: 2, name: "Dayanıklılık", votes: 62 },
            { id: 3, name: "Fiyat", votes: 49 },
            { id: 4, name: "Yol sesi", votes: 37 },
            { id: 5, name: "Yakıt verimliliği", votes: 24 },
        ],
        createdBy: "OtoSöz Editör",
        source: "curated",
    },
    {
        id: "curated-first-upgrade",
        title: "Aracınızda değiştireceğiniz ilk donanım hangisi olurdu?",
        description: "Günlük kullanımda en büyük farkı yaratacağını düşündüğünüz iyileştirmeyi seçin.",
        category: "Modifiye",
        status: "active",
        totalVotes: 248,
        nominees: [
            { id: 1, name: "Daha iyi lastikler", votes: 78 },
            { id: 2, name: "Ses yalıtımı", votes: 55 },
            { id: 3, name: "Multimedya sistemi", votes: 47 },
            { id: 4, name: "Far ve aydınlatma", votes: 39 },
            { id: 5, name: "Süspansiyon", votes: 29 },
        ],
        createdBy: "OtoSöz Editör",
        source: "curated",
    },
];
