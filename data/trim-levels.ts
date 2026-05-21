export type FeatureStatus = 'standard' | 'optional' | 'none';

export interface TrimFeature {
    name: string;
    status: Record<string, FeatureStatus>;
}

export interface TrimCategory {
    categoryName: string;
    features: TrimFeature[];
}

export interface TrimLevelData {
    vehicleId: number;
    brand: string;
    model: string;
    generation: string;
    trims: string[];
    categories: TrimCategory[];
}

// Helper functions
export const createSlug = (text: string) => {
    const trMap: { [key: string]: string } = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
    };
    return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, m => trMap[m] || m)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

export const trimLevelsData: TrimLevelData[] = [
    {
        vehicleId: 1,
        brand: "Renault",
        model: "Clio 5. Nesil (2020-2025)",
        generation: "2020-2025",
        trims: ["Joy","Touch","Icon"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "LED Ön Farlar", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Joy":"none","Touch":"optional","Icon":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Deri Direksiyon", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Joy":"none","Touch":"none","Icon":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Joy":"none","Touch":"none","Icon":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Joy":"none","Touch":"none","Icon":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Joy":"optional","Touch":"standard","Icon":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 2,
        brand: "Fiat",
        model: "Egea 1. Nesil (2015-2025)",
        generation: "2015-2025",
        trims: ["Easy","Urban","Lounge"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Easy":"none","Urban":"standard","Lounge":"standard"} },
                    { name: "LED Ön Farlar", status: {"Easy":"none","Urban":"standard","Lounge":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Easy":"none","Urban":"standard","Lounge":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Easy":"none","Urban":"optional","Lounge":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Easy":"none","Urban":"standard","Lounge":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Easy":"none","Urban":"standard","Lounge":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Easy":"none","Urban":"standard","Lounge":"standard"} },
                    { name: "Deri Direksiyon", status: {"Easy":"none","Urban":"standard","Lounge":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Easy":"none","Urban":"none","Lounge":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Easy":"none","Urban":"standard","Lounge":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Easy":"none","Urban":"standard","Lounge":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Easy":"none","Urban":"standard","Lounge":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Easy":"none","Urban":"standard","Lounge":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Easy":"none","Urban":"none","Lounge":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Easy":"none","Urban":"standard","Lounge":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Easy":"none","Urban":"standard","Lounge":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Easy":"none","Urban":"none","Lounge":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Easy":"optional","Urban":"standard","Lounge":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 3,
        brand: "Toyota",
        model: "Corolla 12. Nesil (2019-2025)",
        generation: "2019-2025",
        trims: ["Vision","Dream","Flame","Passion"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Vision":"none","Dream":"standard","Flame":"standard","Passion":"standard"} },
                    { name: "LED Ön Farlar", status: {"Vision":"none","Dream":"none","Flame":"standard","Passion":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Vision":"none","Dream":"standard","Flame":"standard","Passion":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Vision":"none","Dream":"optional","Flame":"standard","Passion":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Vision":"none","Dream":"standard","Flame":"standard","Passion":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Vision":"none","Dream":"standard","Flame":"standard","Passion":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Vision":"none","Dream":"none","Flame":"standard","Passion":"standard"} },
                    { name: "Deri Direksiyon", status: {"Vision":"none","Dream":"standard","Flame":"standard","Passion":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Vision":"none","Dream":"none","Flame":"none","Passion":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Vision":"none","Dream":"standard","Flame":"standard","Passion":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Vision":"none","Dream":"standard","Flame":"standard","Passion":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Vision":"none","Dream":"none","Flame":"standard","Passion":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Vision":"none","Dream":"standard","Flame":"standard","Passion":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Vision":"none","Dream":"none","Flame":"none","Passion":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Vision":"none","Dream":"standard","Flame":"standard","Passion":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Vision":"none","Dream":"none","Flame":"standard","Passion":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Vision":"none","Dream":"none","Flame":"none","Passion":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Vision":"optional","Dream":"standard","Flame":"standard","Passion":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 4,
        brand: "Renault",
        model: "Megane 4. Nesil (2016-2025)",
        generation: "2016-2025",
        trims: ["Joy","Touch","Icon"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "LED Ön Farlar", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Joy":"none","Touch":"optional","Icon":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Deri Direksiyon", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Joy":"none","Touch":"none","Icon":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Joy":"none","Touch":"none","Icon":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Joy":"none","Touch":"none","Icon":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Joy":"optional","Touch":"standard","Icon":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 5,
        brand: "Honda",
        model: "Civic 11. Nesil FE1 (2021-2025)",
        generation: "2021-2025",
        trims: ["Elegance","Executive","Executive+"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "LED Ön Farlar", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Elegance":"none","Executive":"optional","Executive+":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Deri Direksiyon", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Elegance":"none","Executive":"none","Executive+":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Elegance":"none","Executive":"none","Executive+":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Elegance":"none","Executive":"none","Executive+":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Elegance":"optional","Executive":"standard","Executive+":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 6,
        brand: "Volkswagen",
        model: "Passat B8 (2015-2023)",
        generation: "2015-2023",
        trims: ["Impression","Life","Style","R-Line"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "LED Ön Farlar", status: {"Impression":"none","Life":"none","Style":"standard","R-Line":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Impression":"none","Life":"optional","Style":"standard","R-Line":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Impression":"none","Life":"none","Style":"standard","R-Line":"standard"} },
                    { name: "Deri Direksiyon", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Impression":"none","Life":"none","Style":"none","R-Line":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Impression":"none","Life":"none","Style":"standard","R-Line":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Impression":"none","Life":"none","Style":"none","R-Line":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Impression":"none","Life":"none","Style":"standard","R-Line":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Impression":"none","Life":"none","Style":"none","R-Line":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Impression":"optional","Life":"standard","Style":"standard","R-Line":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 7,
        brand: "Dacia",
        model: "Duster 2. Nesil (2018-2024)",
        generation: "2018-2025",
        trims: ["Essential","Expression","Journey"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Essential":"none","Expression":"standard","Journey":"standard"} },
                    { name: "LED Ön Farlar", status: {"Essential":"none","Expression":"standard","Journey":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Essential":"none","Expression":"standard","Journey":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Essential":"none","Expression":"optional","Journey":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Essential":"none","Expression":"standard","Journey":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Essential":"none","Expression":"standard","Journey":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Essential":"none","Expression":"standard","Journey":"standard"} },
                    { name: "Deri Direksiyon", status: {"Essential":"none","Expression":"standard","Journey":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Essential":"none","Expression":"none","Journey":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Essential":"none","Expression":"standard","Journey":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Essential":"none","Expression":"standard","Journey":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Essential":"none","Expression":"standard","Journey":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Essential":"none","Expression":"standard","Journey":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Essential":"none","Expression":"none","Journey":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Essential":"none","Expression":"standard","Journey":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Essential":"none","Expression":"standard","Journey":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Essential":"none","Expression":"none","Journey":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Essential":"optional","Expression":"standard","Journey":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 8,
        brand: "Hyundai",
        model: "i20 3. Nesil BC3 (2020-2025)",
        generation: "2020-2025",
        trims: ["Jump","Style","Elite","Elite Plus"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "LED Ön Farlar", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Jump":"none","Style":"optional","Elite":"standard","Elite Plus":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Deri Direksiyon", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Jump":"none","Style":"none","Elite":"none","Elite Plus":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Jump":"none","Style":"none","Elite":"none","Elite Plus":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Jump":"none","Style":"none","Elite":"none","Elite Plus":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Jump":"optional","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 901,
        brand: "Peugeot",
        model: "3008 (1. Nesil 2009-2016)",
        generation: "2009-2016",
        trims: ["Active","Allure","GT"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "LED Ön Farlar", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Active":"none","Allure":"optional","GT":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Deri Direksiyon", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Active":"none","Allure":"none","GT":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Active":"none","Allure":"none","GT":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Active":"none","Allure":"none","GT":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Active":"optional","Allure":"standard","GT":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 902,
        brand: "Peugeot",
        model: "3008 (2. Nesil 2016-2023)",
        generation: "2016-2023",
        trims: ["Active","Allure","GT"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "LED Ön Farlar", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Active":"none","Allure":"optional","GT":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Deri Direksiyon", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Active":"none","Allure":"none","GT":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Active":"none","Allure":"none","GT":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Active":"none","Allure":"none","GT":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Active":"optional","Allure":"standard","GT":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 10,
        brand: "Opel",
        model: "Corsa F (2020-2025)",
        generation: "2020-2025",
        trims: ["Edition","Elegance","Ultimate"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "LED Ön Farlar", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Edition":"none","Elegance":"optional","Ultimate":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Deri Direksiyon", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Edition":"none","Elegance":"none","Ultimate":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Edition":"none","Elegance":"none","Ultimate":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Edition":"none","Elegance":"none","Ultimate":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Edition":"optional","Elegance":"standard","Ultimate":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 11,
        brand: "Togg",
        model: "T10X 1. Nesil (2023-2025)",
        generation: "2023-2025",
        trims: ["V1 Standart","V2 Uzun Menzil"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"V1 Standart":"none","V2 Uzun Menzil":"standard"} },
                    { name: "LED Ön Farlar", status: {"V1 Standart":"standard","V2 Uzun Menzil":"standard"} },
                    { name: "LED Arka Stoplar", status: {"V1 Standart":"none","V2 Uzun Menzil":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"V1 Standart":"none","V2 Uzun Menzil":"optional"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"V1 Standart":"none","V2 Uzun Menzil":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"V1 Standart":"none","V2 Uzun Menzil":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"V1 Standart":"standard","V2 Uzun Menzil":"standard"} },
                    { name: "Deri Direksiyon", status: {"V1 Standart":"none","V2 Uzun Menzil":"standard"} },
                    { name: "Koltuk Isıtma", status: {"V1 Standart":"none","V2 Uzun Menzil":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"V1 Standart":"none","V2 Uzun Menzil":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"V1 Standart":"none","V2 Uzun Menzil":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"V1 Standart":"standard","V2 Uzun Menzil":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"V1 Standart":"none","V2 Uzun Menzil":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"V1 Standart":"none","V2 Uzun Menzil":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"V1 Standart":"none","V2 Uzun Menzil":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"V1 Standart":"standard","V2 Uzun Menzil":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"V1 Standart":"none","V2 Uzun Menzil":"standard"} },
                    { name: "Arka Park Sensörü", status: {"V1 Standart":"optional","V2 Uzun Menzil":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 12,
        brand: "Chery",
        model: "Tiggo 8 Pro 1. Nesil (2023-2025)",
        generation: "2023-2025",
        trims: ["Comfort","Luxury","Excellent"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "LED Ön Farlar", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Comfort":"none","Luxury":"optional","Excellent":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Deri Direksiyon", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Comfort":"none","Luxury":"none","Excellent":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Comfort":"none","Luxury":"none","Excellent":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Comfort":"none","Luxury":"none","Excellent":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Comfort":"optional","Luxury":"standard","Excellent":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 13,
        brand: "Volkswagen",
        model: "Golf 8. Nesil (2020-2025)",
        generation: "2020-2025",
        trims: ["Impression","Life","Style","R-Line"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "LED Ön Farlar", status: {"Impression":"none","Life":"none","Style":"standard","R-Line":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Impression":"none","Life":"optional","Style":"standard","R-Line":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Impression":"none","Life":"none","Style":"standard","R-Line":"standard"} },
                    { name: "Deri Direksiyon", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Impression":"none","Life":"none","Style":"none","R-Line":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Impression":"none","Life":"none","Style":"standard","R-Line":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Impression":"none","Life":"none","Style":"none","R-Line":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Impression":"none","Life":"none","Style":"standard","R-Line":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Impression":"none","Life":"none","Style":"none","R-Line":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Impression":"optional","Life":"standard","Style":"standard","R-Line":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 14,
        brand: "Ford",
        model: "Focus 4. Nesil Mk4 (2018-2025)",
        generation: "2018-2025",
        trims: ["Trend X","Titanium","ST-Line"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Trend X":"none","Titanium":"standard","ST-Line":"standard"} },
                    { name: "LED Ön Farlar", status: {"Trend X":"none","Titanium":"standard","ST-Line":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Trend X":"none","Titanium":"standard","ST-Line":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Trend X":"none","Titanium":"optional","ST-Line":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Trend X":"none","Titanium":"standard","ST-Line":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Trend X":"none","Titanium":"standard","ST-Line":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Trend X":"none","Titanium":"standard","ST-Line":"standard"} },
                    { name: "Deri Direksiyon", status: {"Trend X":"none","Titanium":"standard","ST-Line":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Trend X":"none","Titanium":"none","ST-Line":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Trend X":"none","Titanium":"standard","ST-Line":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Trend X":"none","Titanium":"standard","ST-Line":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Trend X":"none","Titanium":"standard","ST-Line":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Trend X":"none","Titanium":"standard","ST-Line":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Trend X":"none","Titanium":"none","ST-Line":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Trend X":"none","Titanium":"standard","ST-Line":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Trend X":"none","Titanium":"standard","ST-Line":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Trend X":"none","Titanium":"none","ST-Line":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Trend X":"optional","Titanium":"standard","ST-Line":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 15,
        brand: "BMW",
        model: "320i F30 (2012-2019)",
        generation: "2019-2025",
        trims: ["Joy","M Sport","Sport Line"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Joy":"none","M Sport":"standard","Sport Line":"standard"} },
                    { name: "LED Ön Farlar", status: {"Joy":"none","M Sport":"standard","Sport Line":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Joy":"none","M Sport":"standard","Sport Line":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Joy":"none","M Sport":"optional","Sport Line":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Joy":"none","M Sport":"standard","Sport Line":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Joy":"none","M Sport":"standard","Sport Line":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Joy":"none","M Sport":"standard","Sport Line":"standard"} },
                    { name: "Deri Direksiyon", status: {"Joy":"none","M Sport":"standard","Sport Line":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Joy":"none","M Sport":"none","Sport Line":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Joy":"none","M Sport":"standard","Sport Line":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Joy":"none","M Sport":"standard","Sport Line":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Joy":"none","M Sport":"standard","Sport Line":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Joy":"none","M Sport":"standard","Sport Line":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Joy":"none","M Sport":"none","Sport Line":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Joy":"none","M Sport":"standard","Sport Line":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Joy":"none","M Sport":"standard","Sport Line":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Joy":"none","M Sport":"none","Sport Line":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Joy":"optional","M Sport":"standard","Sport Line":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 16,
        brand: "Mercedes-Benz",
        model: "C180 W205 (2014-2021)",
        generation: "2021-2025",
        trims: ["Fascination","AMG","Exclusive"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Fascination":"none","AMG":"standard","Exclusive":"standard"} },
                    { name: "LED Ön Farlar", status: {"Fascination":"none","AMG":"standard","Exclusive":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Fascination":"none","AMG":"standard","Exclusive":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Fascination":"none","AMG":"optional","Exclusive":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Fascination":"none","AMG":"standard","Exclusive":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Fascination":"none","AMG":"standard","Exclusive":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Fascination":"none","AMG":"standard","Exclusive":"standard"} },
                    { name: "Deri Direksiyon", status: {"Fascination":"none","AMG":"standard","Exclusive":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Fascination":"none","AMG":"none","Exclusive":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Fascination":"none","AMG":"standard","Exclusive":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Fascination":"none","AMG":"standard","Exclusive":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Fascination":"none","AMG":"standard","Exclusive":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Fascination":"none","AMG":"standard","Exclusive":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Fascination":"none","AMG":"none","Exclusive":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Fascination":"none","AMG":"standard","Exclusive":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Fascination":"none","AMG":"standard","Exclusive":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Fascination":"none","AMG":"none","Exclusive":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Fascination":"optional","AMG":"standard","Exclusive":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 17,
        brand: "Chery",
        model: "Omoda 5 1. Nesil (2023-2025)",
        generation: "2023-2025",
        trims: ["Comfort","Luxury","Excellent"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "LED Ön Farlar", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Comfort":"none","Luxury":"optional","Excellent":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Deri Direksiyon", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Comfort":"none","Luxury":"none","Excellent":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Comfort":"none","Luxury":"none","Excellent":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Comfort":"none","Luxury":"none","Excellent":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Comfort":"optional","Luxury":"standard","Excellent":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 18,
        brand: "Nissan",
        model: "Qashqai J11 (2014-2021)",
        generation: "2021-2025",
        trims: ["Visia","Tekna","Platinum Premium"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Visia":"none","Tekna":"standard","Platinum Premium":"standard"} },
                    { name: "LED Ön Farlar", status: {"Visia":"none","Tekna":"standard","Platinum Premium":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Visia":"none","Tekna":"standard","Platinum Premium":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Visia":"none","Tekna":"optional","Platinum Premium":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Visia":"none","Tekna":"standard","Platinum Premium":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Visia":"none","Tekna":"standard","Platinum Premium":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Visia":"none","Tekna":"standard","Platinum Premium":"standard"} },
                    { name: "Deri Direksiyon", status: {"Visia":"none","Tekna":"standard","Platinum Premium":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Visia":"none","Tekna":"none","Platinum Premium":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Visia":"none","Tekna":"standard","Platinum Premium":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Visia":"none","Tekna":"standard","Platinum Premium":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Visia":"none","Tekna":"standard","Platinum Premium":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Visia":"none","Tekna":"standard","Platinum Premium":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Visia":"none","Tekna":"none","Platinum Premium":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Visia":"none","Tekna":"standard","Platinum Premium":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Visia":"none","Tekna":"standard","Platinum Premium":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Visia":"none","Tekna":"none","Platinum Premium":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Visia":"optional","Tekna":"standard","Platinum Premium":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 19,
        brand: "Hyundai",
        model: "Tucson NX4 4. Nesil (2020-2025)",
        generation: "2021-2025",
        trims: ["Jump","Style","Elite","Elite Plus"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "LED Ön Farlar", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Jump":"none","Style":"optional","Elite":"standard","Elite Plus":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Deri Direksiyon", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Jump":"none","Style":"none","Elite":"none","Elite Plus":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Jump":"none","Style":"none","Elite":"none","Elite Plus":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Jump":"none","Style":"none","Elite":"none","Elite Plus":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Jump":"optional","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 20,
        brand: "Kia",
        model: "Sportage NQ5 5. Nesil (2021-2025)",
        generation: "2022-2025",
        trims: ["Cool","Elegance","Prestige"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Cool":"none","Elegance":"standard","Prestige":"standard"} },
                    { name: "LED Ön Farlar", status: {"Cool":"none","Elegance":"standard","Prestige":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Cool":"none","Elegance":"standard","Prestige":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Cool":"none","Elegance":"optional","Prestige":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Cool":"none","Elegance":"standard","Prestige":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Cool":"none","Elegance":"standard","Prestige":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Cool":"none","Elegance":"standard","Prestige":"standard"} },
                    { name: "Deri Direksiyon", status: {"Cool":"none","Elegance":"standard","Prestige":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Cool":"none","Elegance":"none","Prestige":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Cool":"none","Elegance":"standard","Prestige":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Cool":"none","Elegance":"standard","Prestige":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Cool":"none","Elegance":"standard","Prestige":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Cool":"none","Elegance":"standard","Prestige":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Cool":"none","Elegance":"none","Prestige":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Cool":"none","Elegance":"standard","Prestige":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Cool":"none","Elegance":"standard","Prestige":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Cool":"none","Elegance":"none","Prestige":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Cool":"optional","Elegance":"standard","Prestige":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 21,
        brand: "Peugeot",
        model: "2008 2. Nesil P24 (2019-2025)",
        generation: "2020-2025",
        trims: ["Active","Allure","GT"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "LED Ön Farlar", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Active":"none","Allure":"optional","GT":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Deri Direksiyon", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Active":"none","Allure":"none","GT":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Active":"none","Allure":"none","GT":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Active":"none","Allure":"standard","GT":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Active":"none","Allure":"none","GT":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Active":"optional","Allure":"standard","GT":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 22,
        brand: "Opel",
        model: "Astra K (2015-2021)",
        generation: "2022-2025",
        trims: ["Edition","Elegance","Ultimate"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "LED Ön Farlar", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Edition":"none","Elegance":"optional","Ultimate":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Deri Direksiyon", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Edition":"none","Elegance":"none","Ultimate":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Edition":"none","Elegance":"none","Ultimate":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Edition":"none","Elegance":"standard","Ultimate":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Edition":"none","Elegance":"none","Ultimate":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Edition":"optional","Elegance":"standard","Ultimate":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 23,
        brand: "Honda",
        model: "City 7. Nesil GN (2021-2025)",
        generation: "2021-2025",
        trims: ["Elegance","Executive","Executive+"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "LED Ön Farlar", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Elegance":"none","Executive":"optional","Executive+":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Deri Direksiyon", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Elegance":"none","Executive":"none","Executive+":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Elegance":"none","Executive":"none","Executive+":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Elegance":"none","Executive":"standard","Executive+":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Elegance":"none","Executive":"none","Executive+":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Elegance":"optional","Executive":"standard","Executive+":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 24,
        brand: "Volkswagen",
        model: "Polo AW 6. Nesil (2017-2025)",
        generation: "2018-2025",
        trims: ["Impression","Life","Style","R-Line"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "LED Ön Farlar", status: {"Impression":"none","Life":"none","Style":"standard","R-Line":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Impression":"none","Life":"optional","Style":"standard","R-Line":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Impression":"none","Life":"none","Style":"standard","R-Line":"standard"} },
                    { name: "Deri Direksiyon", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Impression":"none","Life":"none","Style":"none","R-Line":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Impression":"none","Life":"none","Style":"standard","R-Line":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Impression":"none","Life":"none","Style":"none","R-Line":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Impression":"none","Life":"standard","Style":"standard","R-Line":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Impression":"none","Life":"none","Style":"standard","R-Line":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Impression":"none","Life":"none","Style":"none","R-Line":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Impression":"optional","Life":"standard","Style":"standard","R-Line":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 25,
        brand: "Citroen",
        model: "C4 X 1. Nesil (2022-2025)",
        generation: "2023-2025",
        trims: ["Feel","Shine","Shine Bold"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Feel":"none","Shine":"standard","Shine Bold":"standard"} },
                    { name: "LED Ön Farlar", status: {"Feel":"none","Shine":"standard","Shine Bold":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Feel":"none","Shine":"standard","Shine Bold":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Feel":"none","Shine":"optional","Shine Bold":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Feel":"none","Shine":"standard","Shine Bold":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Feel":"none","Shine":"standard","Shine Bold":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Feel":"none","Shine":"standard","Shine Bold":"standard"} },
                    { name: "Deri Direksiyon", status: {"Feel":"none","Shine":"standard","Shine Bold":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Feel":"none","Shine":"none","Shine Bold":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Feel":"none","Shine":"standard","Shine Bold":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Feel":"none","Shine":"standard","Shine Bold":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Feel":"none","Shine":"standard","Shine Bold":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Feel":"none","Shine":"standard","Shine Bold":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Feel":"none","Shine":"none","Shine Bold":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Feel":"none","Shine":"standard","Shine Bold":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Feel":"none","Shine":"standard","Shine Bold":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Feel":"none","Shine":"none","Shine Bold":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Feel":"optional","Shine":"standard","Shine Bold":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 26,
        brand: "Skoda",
        model: "Octavia NX 4. Nesil (2020-2025)",
        generation: "2020-2025",
        trims: ["Elite","Premium","Prestige","Sportline"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "LED Ön Farlar", status: {"Elite":"none","Premium":"none","Prestige":"standard","Sportline":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Elite":"none","Premium":"optional","Prestige":"standard","Sportline":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Elite":"none","Premium":"none","Prestige":"standard","Sportline":"standard"} },
                    { name: "Deri Direksiyon", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Elite":"none","Premium":"none","Prestige":"none","Sportline":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Elite":"none","Premium":"none","Prestige":"standard","Sportline":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Elite":"none","Premium":"none","Prestige":"none","Sportline":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Elite":"none","Premium":"none","Prestige":"standard","Sportline":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Elite":"none","Premium":"none","Prestige":"none","Sportline":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Elite":"optional","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 27,
        brand: "Skoda",
        model: "Superb B8 3. Nesil (2015-2023)",
        generation: "2015-2025",
        trims: ["Elite","Premium","Prestige","Sportline"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "LED Ön Farlar", status: {"Elite":"none","Premium":"none","Prestige":"standard","Sportline":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Elite":"none","Premium":"optional","Prestige":"standard","Sportline":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Elite":"none","Premium":"none","Prestige":"standard","Sportline":"standard"} },
                    { name: "Deri Direksiyon", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Elite":"none","Premium":"none","Prestige":"none","Sportline":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Elite":"none","Premium":"none","Prestige":"standard","Sportline":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Elite":"none","Premium":"none","Prestige":"none","Sportline":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Elite":"none","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Elite":"none","Premium":"none","Prestige":"standard","Sportline":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Elite":"none","Premium":"none","Prestige":"none","Sportline":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Elite":"optional","Premium":"standard","Prestige":"standard","Sportline":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 28,
        brand: "Chery",
        model: "Tiggo 7 Pro 1. Nesil (2023-2025)",
        generation: "2023-2025",
        trims: ["Comfort","Luxury","Excellent"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "LED Ön Farlar", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Comfort":"none","Luxury":"optional","Excellent":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Deri Direksiyon", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Comfort":"none","Luxury":"none","Excellent":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Comfort":"none","Luxury":"none","Excellent":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Comfort":"none","Luxury":"standard","Excellent":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Comfort":"none","Luxury":"none","Excellent":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Comfort":"optional","Luxury":"standard","Excellent":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 29,
        brand: "Seat",
        model: "Leon KL 4. Nesil (2020-2025)",
        generation: "2020-2025",
        trims: ["Style","Xcellence","FR"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Style":"none","Xcellence":"standard","FR":"standard"} },
                    { name: "LED Ön Farlar", status: {"Style":"none","Xcellence":"standard","FR":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Style":"none","Xcellence":"standard","FR":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Style":"none","Xcellence":"optional","FR":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Style":"none","Xcellence":"standard","FR":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Style":"none","Xcellence":"standard","FR":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Style":"none","Xcellence":"standard","FR":"standard"} },
                    { name: "Deri Direksiyon", status: {"Style":"none","Xcellence":"standard","FR":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Style":"none","Xcellence":"none","FR":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Style":"none","Xcellence":"standard","FR":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Style":"none","Xcellence":"standard","FR":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Style":"none","Xcellence":"standard","FR":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Style":"none","Xcellence":"standard","FR":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Style":"none","Xcellence":"none","FR":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Style":"none","Xcellence":"standard","FR":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Style":"none","Xcellence":"standard","FR":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Style":"none","Xcellence":"none","FR":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Style":"optional","Xcellence":"standard","FR":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 30,
        brand: "Tesla",
        model: "Model Y 1. Nesil (2020-2025)",
        generation: "2022-2025",
        trims: ["RWD","Long Range","Performance"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"RWD":"none","Long Range":"standard","Performance":"standard"} },
                    { name: "LED Ön Farlar", status: {"RWD":"none","Long Range":"standard","Performance":"standard"} },
                    { name: "LED Arka Stoplar", status: {"RWD":"none","Long Range":"standard","Performance":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"RWD":"none","Long Range":"optional","Performance":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"RWD":"none","Long Range":"standard","Performance":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"RWD":"none","Long Range":"standard","Performance":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"RWD":"none","Long Range":"standard","Performance":"standard"} },
                    { name: "Deri Direksiyon", status: {"RWD":"none","Long Range":"standard","Performance":"standard"} },
                    { name: "Koltuk Isıtma", status: {"RWD":"none","Long Range":"none","Performance":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"RWD":"none","Long Range":"standard","Performance":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"RWD":"none","Long Range":"standard","Performance":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"RWD":"none","Long Range":"standard","Performance":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"RWD":"none","Long Range":"standard","Performance":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"RWD":"none","Long Range":"none","Performance":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"RWD":"none","Long Range":"standard","Performance":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"RWD":"none","Long Range":"standard","Performance":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"RWD":"none","Long Range":"none","Performance":"standard"} },
                    { name: "Arka Park Sensörü", status: {"RWD":"optional","Long Range":"standard","Performance":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 31,
        brand: "Hyundai",
        model: "i20 2. Nesil GB (2014-2020)",
        generation: "2014-2020",
        trims: ["Jump","Style","Elite","Elite Plus"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "LED Ön Farlar", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Jump":"none","Style":"optional","Elite":"standard","Elite Plus":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Deri Direksiyon", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Jump":"none","Style":"none","Elite":"none","Elite Plus":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Jump":"none","Style":"none","Elite":"none","Elite Plus":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Jump":"none","Style":"none","Elite":"none","Elite Plus":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Jump":"optional","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 32,
        brand: "Hyundai",
        model: "i30 2. Nesil GD (2012-2017)",
        generation: "2012-2017",
        trims: ["Jump","Style","Elite","Elite Plus"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "LED Ön Farlar", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Jump":"none","Style":"optional","Elite":"standard","Elite Plus":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Deri Direksiyon", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Jump":"none","Style":"none","Elite":"none","Elite Plus":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Jump":"none","Style":"none","Elite":"none","Elite Plus":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Jump":"none","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Jump":"none","Style":"none","Elite":"standard","Elite Plus":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Jump":"none","Style":"none","Elite":"none","Elite Plus":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Jump":"optional","Style":"standard","Elite":"standard","Elite Plus":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 33,
        brand: "Audi",
        model: "TT 2. Nesil Mk2 (2006-2014)",
        generation: "2006-2014",
        trims: ["Advanced","S line"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Advanced":"none","S line":"standard"} },
                    { name: "LED Ön Farlar", status: {"Advanced":"standard","S line":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Advanced":"none","S line":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Advanced":"none","S line":"optional"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Advanced":"none","S line":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Advanced":"none","S line":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Advanced":"standard","S line":"standard"} },
                    { name: "Deri Direksiyon", status: {"Advanced":"none","S line":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Advanced":"none","S line":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Advanced":"none","S line":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Advanced":"none","S line":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Advanced":"standard","S line":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Advanced":"none","S line":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Advanced":"none","S line":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Advanced":"none","S line":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Advanced":"standard","S line":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Advanced":"none","S line":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Advanced":"optional","S line":"standard"} },
                ]
            },
        ]
    },
    {
        vehicleId: 34,
        brand: "Renault",
        model: "Clio 4. Nesil (2012-2019)",
        generation: "2012-2019",
        trims: ["Joy","Touch","Icon"],
        categories:         [
            {
                categoryName: "Dış Donanım ve Tasarım",
                features: [
                    { name: "Alaşımlı Jantlar", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "LED Ön Farlar", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "LED Arka Stoplar", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Açılabilir Cam Tavan (Sunroof)", status: {"Joy":"none","Touch":"optional","Icon":"standard"} },
                ]
            },
            {
                categoryName: "İç Donanım ve Konfor",
                features: [
                    { name: "Dijital Klima", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Anahtarsız Giriş ve Çalıştırma", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Ambiyans Aydınlatma", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Deri Direksiyon", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Koltuk Isıtma", status: {"Joy":"none","Touch":"none","Icon":"standard"} },
                ]
            },
            {
                categoryName: "Multimedya ve Teknoloji",
                features: [
                    { name: "Dokunmatik Ekran", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Apple CarPlay & Android Auto", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Dijital Gösterge Paneli", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Geri Görüş Kamerası", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Premium Ses Sistemi", status: {"Joy":"none","Touch":"none","Icon":"standard"} },
                ]
            },
            {
                categoryName: "Güvenlik ve Sürüş Asistanları",
                features: [
                    { name: "Hız Sabitleyici (Cruise Control)", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Şerit Takip Asistanı", status: {"Joy":"none","Touch":"standard","Icon":"standard"} },
                    { name: "Ön Çarpışma Önleme", status: {"Joy":"none","Touch":"none","Icon":"standard"} },
                    { name: "Arka Park Sensörü", status: {"Joy":"optional","Touch":"standard","Icon":"standard"} },
                ]
            },
        ]
    },
];
