

export interface TrustCategory {
    id: string;
    title: string;
    description: string;
    icon: string;
    colors: string[];
    stats: string;
}

export interface BrandRating {
    id: string;
    name: string;
    rating: number;
    totalReviews: number;
    logoEmoji: string;
    trend: "up" | "stable" | "down";
}

export interface UserReview {
    id: string;
    userName: string;
    userAvatar: string;
    rating: number;
    comment: string;
    timeAgo: string;
    likes: number;
    isVerified: boolean;
}

// Categories Data
export const categories: TrustCategory[] = [
    {
        id: "fuel_stations",
        title: "Yakıt İstasyonları",
        description: "Puanları, yorumları ve hizmetleri görüntüleyin.",
        icon: "Fuel",
        colors: ["#1A237E", "#0D47A1", "#01579B"],
        stats: "15+ işletme"
    },
    {
        id: "expertise",
        title: "Ekspertiz Firmaları",
        description: "Tarafsız ekspertiz noktalarını bulun ve puanlayın.",
        icon: "ShieldCheck",
        colors: ["#4A148C", "#6A1B9A", "#7B1FA2"],
        stats: "20+ firma"
    },
    {
        id: "private_service",
        title: "Özel Servis / Usta",
        description: "Güvenilir tamircileri ve ustaları keşfedin.",
        icon: "Wrench",
        colors: ["#BF360C", "#D84315", "#E64A19"],
        stats: "45+ usta"
    },
    {
        id: "authorized_service",
        title: "Yetkili Bayi ve Servis",
        description: "Markanızın resmi noktalarını görüntüleyin.",
        icon: "Building2",
        colors: ["#004D40", "#00695C", "#00796B"],
        stats: "12+ nokta"
    },
    {
        id: "dealers",
        title: "Galericiler",
        description: "Bölgenizdeki alım-satım galerilerini puanlayın.",
        icon: "Store",
        colors: ["#1B5E20", "#2E7D32", "#388E3C"],
        stats: "30+ galeri"
    },
    {
        id: "spare_parts",
        title: "Yedek Parçacılar",
        description: "Orijinal ve yan sanayi parça tedarikçileri.",
        icon: "PackageOpen",
        colors: ["#263238", "#37474F", "#455A64"],
        stats: "25+ tedarikçi"
    },
    {
        id: "accessories",
        title: "Oto Aksesuarcılar",
        description: "Modifikasyon ve aksesuar mağazaları.",
        icon: "ShoppingBag",
        colors: ["#880E4F", "#C2185B", "#D81B60"],
        stats: "18+ mağaza"
    },
    {
        id: "car_wash",
        title: "Oto Yıkama & Detailing",
        description: "Detaylı temizlik ve kuaför hizmetleri.",
        icon: "Droplets",
        colors: ["#006064", "#00838F", "#0097A7"],
        stats: "35+ işletme"
    },
    {
        id: "car_brands",
        title: "Araç Markaları",
        description: "Kalite, güvenilirlik ve kullanıcı deneyimi.",
        icon: "Car",
        colors: ["#E65100", "#EF6C00", "#F57C00"],
        stats: "75+ marka"
    }
];


// Brands Data Functions â€” Tüm oylar sıfır, gerçek kullanıcı verileri geldiğinde dolacak
export const getBrandsForCategory = (categoryId: string): BrandRating[] => {
    const z = (id: string, name: string, emoji: string): BrandRating =>
        ({ id, name, rating: 0, totalReviews: 0, logoEmoji: emoji, trend: "stable" });

    switch (categoryId) {
        /* â”€â”€ Yakıt İstasyonları â€“ Türkiye'nin En Meşhur 10'u â”€â”€ */
        case "fuel_stations": return [
            z("shell",        "Shell",           "ðŸ”´"),
            z("opet",         "Opet",            "ðŸŸ¢"),
            z("bp",           "BP",              "ðŸŸ¡"),
            z("petrol_ofisi", "Petrol Ofisi",    "âšª"),
            z("total",        "TotalEnergies",   "ðŸ”´"),
            z("aytemiz",      "Aytemiz",         "ðŸ”µ"),
            z("lukoil",       "Lukoil",          "ðŸ”´"),
            z("alpet",        "Alpet",           "ðŸŸ "),
            z("moil",         "M-Oil",           "ðŸŸ£"),
            z("go",           "GO",              "ðŸŸ¤"),
        ];

        /* â”€â”€ Ekspertiz Firmaları â€“ 15 Firma â”€â”€ */
        case "expertise": return [
            z("dekra",          "DEKRA",                      "ðŸ”µ"),
            z("tuv_sud",        "TÜV SÜD",                    "ðŸ”µ"),
            z("ototest",        "OtoTest Ekspertiz",          "ðŸŸ¢"),
            z("ekspertime",     "EksperTime",                 "ðŸŸ "),
            z("aracsepeti",     "AraçSepeti Ekspertiz",       "ðŸ”´"),
            z("oguz",           "Oğuz Ekspertiz",             "âšª"),
            z("otohasar",       "OtoHasar Tespit",            "ðŸŸ¡"),
            z("netekspertiz",   "Net Ekspertiz",              "ðŸŸ¢"),
            z("proeksper",      "Pro Ekspertiz",              "ðŸ”µ"),
            z("turk_ekspertiz", "Türk Ekspertiz",             "ðŸ”´"),
            z("garage",         "Garage Ekspertiz",           "âš«"),
            z("mts",            "MTS Araç Değerleme",         "ðŸŸ£"),
            z("carcheck",       "CarCheck",                   "ðŸ”µ"),
            z("autoscan",       "AutoScan",                   "ðŸŸ¢"),
            z("eksperguven",    "EksperGüven",                "ðŸŸ "),
        ];

        /* â”€â”€ Özel Servis â”€â”€ */
        case "private_service": return [
            z("bosch",     "Bosch Car Service", "ðŸ”µ"),
            z("koc_oto",   "Koç Özel Servis",   "ðŸ”´"),
            z("euro_car",  "EuroCar Servis",    "ðŸŸ¢"),
            z("motul_srv", "Motul Servis",      "ðŸŸ "),
        ];

        /* â”€â”€ Yetkili Bayi ve Servis â”€â”€ */
        case "authorized_service": return [
            z("tofa_srv",  "Tofaş Yetkili",   "🔵"),
            z("renault",   "Renault Yetkili",  "ðŸŸ¡"),
            z("toyota_srv","Toyota Yetkili",   "ðŸ”´"),
            z("hyundai_srv","Hyundai Yetkili", "ðŸ”µ"),
            z("ford_srv",  "Ford Yetkili",     "ðŸ”µ"),
            z("fiat_srv",  "Fiat Yetkili",     "ðŸ”´"),
            z("vw_srv",    "VW Yetkili",       "âšª"),
        ];

        /* â”€â”€ Galericiler â”€â”€ */
        case "dealers": return [
            z("arabam",    "Arabam.com Galeri",  "ðŸŸ "),
            z("sahibinden","Sahibinden Galeri",  "ðŸ”µ"),
            z("otokoc",    "Otokoç Galeri",      "ðŸ”´"),
            z("dersa",     "Dersa Galericiler",  "ðŸŸ¢"),
        ];

        /* â”€â”€ Yedek Parçacılar â”€â”€ */
        case "spare_parts": return [
            z("bosch_parca", "Bosch Parça",         "ðŸ”µ"),
            z("valeo",       "Valeo",               "ðŸŸ¡"),
            z("continental", "Continental Parts",   "âšª"),
            z("oguz_parca",  "Oğuz Parça",          "ðŸŸ¢"),
            z("komponent",   "Komponent",           "ðŸ”´"),
        ];

        /* â”€â”€ Oto Aksesuarcılar â”€â”€ */
        case "accessories": return [
            z("motoline",  "Motoline",          "ðŸ”´"),
            z("osd",       "OSD Aksesuar",      "ðŸŸ¢"),
            z("superspeed","SuperSpeed",         "ðŸ”µ"),
        ];

        /* â”€â”€ Oto Yıkama & Detailing â”€â”€ */
        case "car_wash": return [
            z("detay",     "Detay Plus",        "ðŸ”µ"),
            z("carwiz",    "CarWiz",            "ðŸŸ¢"),
            z("mobiclean", "MobiClean",         "ðŸŸ "),
            z("prodetail", "Pro Detailing",     "ðŸ”´"),
        ];

        /* â”€â”€ Araç Markaları â€“ 60+ Marka â”€â”€ */
        case "car_brands": return [
            // Alman
            z("mercedes",    "Mercedes-Benz", "âšª"),
            z("bmw",         "BMW",           "ðŸ”µ"),
            z("audi",        "Audi",          "âšª"),
            z("volkswagen",  "Volkswagen",    "ðŸ”µ"),
            z("porsche",     "Porsche",       "ðŸŸ¡"),
            z("opel",        "Opel",          "ðŸŸ¡"),
            // Japon
            z("toyota",      "Toyota",        "ðŸ”´"),
            z("honda",       "Honda",         "ðŸ”´"),
            z("nissan",      "Nissan",        "âšª"),
            z("mazda",       "Mazda",         "ðŸ”´"),
            z("subaru",      "Subaru",        "ðŸ”µ"),
            z("mitsubishi",  "Mitsubishi",    "ðŸ”´"),
            z("suzuki",      "Suzuki",        "ðŸ”µ"),
            z("lexus",       "Lexus",         "âš«"),
            z("infiniti",    "Infiniti",      "âš«"),
            z("daihatsu",    "Daihatsu",      "ðŸ”´"),
            z("isuzu",       "Isuzu",         "âšª"),
            // Amerikan
            z("ford",        "Ford",          "ðŸ”µ"),
            z("chevrolet",   "Chevrolet",     "ðŸŸ¡"),
            z("jeep",        "Jeep",          "âš«"),
            z("dodge",       "Dodge",         "ðŸ”´"),
            z("cadillac",    "Cadillac",      "âšª"),
            z("lincoln",     "Lincoln",       "âš«"),
            z("gmc",         "GMC",           "ðŸ”´"),
            z("chrysler",    "Chrysler",      "ðŸ”µ"),
            // Fransız
            z("renault",     "Renault",       "ðŸŸ¡"),
            z("peugeot",     "Peugeot",       "ðŸ”µ"),
            z("citroen",     "Citroën",       "âšª"),
            z("ds",          "DS",            "âšª"),
            // İtalyan
            z("fiat",        "Fiat",          "ðŸ”´"),
            z("alfa_romeo",  "Alfa Romeo",    "ðŸ”´"),
            z("ferrari",     "Ferrari",       "ðŸ”´"),
            z("lamborghini", "Lamborghini",   "ðŸŸ¡"),
            z("maserati",    "Maserati",      "ðŸ”µ"),
            z("lancia",      "Lancia",        "ðŸ”µ"),
            // İngiliz
            z("land_rover",  "Land Rover",    "ðŸŸ¢"),
            z("jaguar",      "Jaguar",        "ðŸŸ¢"),
            z("bentley",     "Bentley",       "âšª"),
            z("rolls_royce", "Rolls-Royce",   "âšª"),
            z("mini",        "MINI",          "ðŸ”´"),
            z("aston_martin","Aston Martin",  "ðŸŸ¢"),
            z("mclaren",     "McLaren",       "ðŸŸ "),
            // İsveç
            z("volvo",       "Volvo",         "ðŸ”µ"),
            z("saab",        "Saab",          "âšª"),
            // Kore
            z("hyundai",     "Hyundai",       "ðŸ”µ"),
            z("kia",         "Kia",           "ðŸ”´"),
            z("genesis",     "Genesis",       "âš«"),
            z("ssangyong",   "SsangYong",     "âšª"),
            z("daewoo",      "Daewoo",        "ðŸ”µ"),
            // Çek-Slovak
            z("skoda",       "Å koda",         "ðŸŸ¢"),
            z("seat",        "SEAT",          "ðŸ”´"),
            z("cupra",       "CUPRA",         "ðŸ”´"),
            // Yerli
            z("togg",        "Togg",          "ðŸ”µ"),
            // Romanya
            z("dacia",       "Dacia",         "ðŸ”µ"),
            // Çin
            z("byd",         "BYD",           "ðŸ”µ"),
            z("chery",       "Chery",         "ðŸ”´"),
            z("haval",       "Haval",         "ðŸŸ¡"),
            z("MG",          "MG",            "ðŸ”´"),
            z("geely",       "Geely",         "ðŸ”µ"),
            z("dongfeng",    "Dongfeng",      "ðŸ”µ"),
            // Diğer
            z("tesla",       "Tesla",         "ðŸ”´"),
            z("smart",       "Smart",         "âšª"),
            z("hummer",      "Hummer",        "ðŸŸ¡"),
            z("pontiac",     "Pontiac",       "ðŸ”´"),
            z("buick",       "Buick",         "ðŸ”´"),
        ];

        default: return [];
    }
};

// Kullanıcı değerlendirmeleri sıfırlandı â€” gerçek oylar geldiğinde buraya eklenecek
export const getReviewsForBrand = (_brandId: string): UserReview[] => {
    return [];
};
