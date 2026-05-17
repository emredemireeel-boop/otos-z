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
    logoUrl?: string;
    brandColor?: string;
    youtubeUrl?: string;
    trend: "up" | "stable" | "down";
    bio?: string;
    birthYear?: number;
    followers?: string;
    realName?: string;
    location?: string;
    business?: string;
    instagramUrl?: string;
    specialties?: string[];
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
        stats: "18 firma"
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
    },
    {
        id: "auto_influencers",
        title: "Oto Ünlüler & Kanallar",
        description: "Otomobil odaklı en iyi içerik üreticileri ve kanallar.",
        icon: "Youtube",
        colors: ["#B71C1C", "#C62828", "#D32F2F"],
        stats: "10+ kanal"
    }
];

export const getBrandsForCategory = (categoryId: string): BrandRating[] => {
    const z = (
        id: string, name: string, emoji: string, logoUrl?: string, brandColor?: string, 
        youtubeUrl?: string, bio?: string, birthYear?: number, followers?: string
    ): BrandRating =>
        ({ id, name, rating: 0, totalReviews: 0, logoEmoji: emoji, logoUrl, brandColor, youtubeUrl, trend: "stable", bio, birthYear, followers });

    switch (categoryId) {
        /* ── Yakıt İstasyonları ── */
        case "fuel_stations": return [
            z("shell",        "Shell",           "P", "https://logo.clearbit.com/shell.com", "#FFD500"),
            z("opet",         "Opet",            "O", "https://logo.clearbit.com/opet.com.tr", "#004B87"),
            z("bp",           "BP",              "B", "https://logo.clearbit.com/bp.com", "#009900"),
            z("petrol_ofisi", "Petrol Ofisi",    "P", "https://logo.clearbit.com/petrolofisi.com.tr", "#E3000F"),
            z("total",        "TotalEnergies",   "T", "https://logo.clearbit.com/totalenergies.com", "#ED0000"),
            z("aytemiz",      "Aytemiz",         "A", "https://logo.clearbit.com/aytemiz.com.tr", "#00447C"),
            z("lukoil",       "Lukoil",          "L", "https://logo.clearbit.com/lukoil.com", "#E4002B"),
            z("alpet",        "Alpet",           "A", "https://logo.clearbit.com/alpet.com.tr", "#002E6D"),
            z("moil",         "M-Oil",           "M", "https://logo.clearbit.com/moil.com.tr", "#E3000F"),
            z("go",           "GO",              "G", "https://logo.clearbit.com/goyakit.com.tr", "#509E2F"),
        ];

        /* ── Ekspertiz Firmaları ── */
        case "expertise": return [
            z("pilot_garage", "Pilot Garage", "P", "https://logo.clearbit.com/pilotgarage.com", "#005B9A"),
            z("otorapor", "Otorapor", "O", "https://logo.clearbit.com/otorapor.com", "#E30613"),
            z("dynobil", "Dynobil", "D", "https://logo.clearbit.com/dynobil.com", "#F15A24"),
            z("yamanlar", "Yamanlar", "Y", "https://logo.clearbit.com/yamanlarotoekspertiz.com", "#1F3A93"),
            z("auto_king", "Auto King", "A", "https://logo.clearbit.com/autoking.com.tr", "#E60000"),
            z("computest", "Computest", "C", "https://logo.clearbit.com/computest.com.tr", "#004B87"),
            z("rs", "RS", "R", "https://logo.clearbit.com/rservis.com.tr", "#0A2A5E"),
            z("experix", "Experix", "E", "https://logo.clearbit.com/experix.com.tr", "#F58220"),
            z("otonu_tani", "Otonu Tanı", "O", "https://logo.clearbit.com/otonutani.com", "#18365D"),
            z("auto_kale", "AUTO KALE", "A", "https://logo.clearbit.com/autokale.com", "#E63946"),
            z("ekspertiz_360", "Ekspertiz 360", "E", "https://logo.clearbit.com/ekspertiz360.com", "#00A8E8"),
            z("tarcanlar", "Tarcanlar", "T", "https://logo.clearbit.com/tarcanlarotoekspertiz.com", "#C1121F"),
            z("oto_experim", "Oto Experim", "O", "https://logo.clearbit.com/otoexperim.com.tr", "#1D3557"),
            z("hospitacar", "Hospitacar", "H", "https://logo.clearbit.com/hospitacar.com", "#457B9D"),
            z("dynomoss", "DYNOMOSS", "D", "https://logo.clearbit.com/dynomoss.com.tr", "#E76F51"),
            z("vizyon_garage", "Vizyon Garage", "V", "https://logo.clearbit.com/vizyongarage.com", "#2A9D8F"),
            z("europe", "Europe", "E", "https://logo.clearbit.com/europeotoekspertiz.com", "#264653"),
            z("arabam_com", "Arabam.com", "A", "https://logo.clearbit.com/arabam.com", "#ED1C24"),
        ];

        /* ── Özel Servis ── */
        case "private_service": return [];

        /* ── Yetkili Bayi ve Servis ── */
        case "authorized_service": return [];

        /* ── Galericiler ── */
        case "dealers": return [
            z("arabam",    "Arabam.com Galeri",  "A", "https://logo.clearbit.com/arabam.com", "#ED1C24"),
            z("sahibinden","Sahibinden Galeri",  "S", "https://logo.clearbit.com/sahibinden.com", "#FFF000"),
            z("otokoc",    "Otokoç Galeri",      "O", "https://logo.clearbit.com/otokoc.com.tr", "#E30613"),
            z("vava",      "VavaCars",           "V", "https://logo.clearbit.com/vava.cars", "#FF385C"),
        ];

        /* ── Yedek Parçacılar ── */
        case "spare_parts": return [];

        /* ── Oto Aksesuarcılar ── */
        case "accessories": return [];

        /* ── Oto Yıkama & Detailing ── */
        case "car_wash": return [];

        /* ── Araç Markaları ── */
        case "car_brands": return [
            z("mercedes",    "Mercedes-Benz", "M", "https://logo.clearbit.com/mercedes-benz.com", "#000000"),
            z("bmw",         "BMW",           "B", "https://logo.clearbit.com/bmw.com", "#0066B1"),
            z("audi",        "Audi",          "A", "https://logo.clearbit.com/audi.com", "#BB0A30"),
            z("volkswagen",  "Volkswagen",    "V", "https://logo.clearbit.com/vw.com", "#001E50"),
            z("porsche",     "Porsche",       "P", "https://logo.clearbit.com/porsche.com", "#D32A20"),
            z("opel",        "Opel",          "O", "https://logo.clearbit.com/opel.com", "#F4D03F"),
            z("toyota",      "Toyota",        "T", "https://logo.clearbit.com/toyota.com", "#EB0A1E"),
            z("honda",       "Honda",         "H", "https://logo.clearbit.com/honda.com", "#E40521"),
            z("nissan",      "Nissan",        "N", "https://logo.clearbit.com/nissan.com", "#C3002F"),
            z("mazda",       "Mazda",         "M", "https://logo.clearbit.com/mazda.com", "#101010"),
            z("subaru",      "Subaru",        "S", "https://logo.clearbit.com/subaru.com", "#013C74"),
            z("ford",        "Ford",          "F", "https://logo.clearbit.com/ford.com", "#003478"),
            z("chevrolet",   "Chevrolet",     "C", "https://logo.clearbit.com/chevrolet.com", "#CDA434"),
            z("renault",     "Renault",       "R", "https://logo.clearbit.com/renault.com", "#F4D03F"),
            z("peugeot",     "Peugeot",       "P", "https://logo.clearbit.com/peugeot.com", "#00538A"),
            z("citroen",     "Citroën",       "C", "https://logo.clearbit.com/citroen.com", "#ED1C24"),
            z("fiat",        "Fiat",          "F", "https://logo.clearbit.com/fiat.com", "#900C3F"),
            z("volvo",       "Volvo",         "V", "https://logo.clearbit.com/volvocars.com", "#143A62"),
            z("hyundai",     "Hyundai",       "H", "https://logo.clearbit.com/hyundai.com", "#002C5F"),
            z("kia",         "Kia",           "K", "https://logo.clearbit.com/kia.com", "#BB162B"),
            z("skoda",       "Škoda",         "S", "https://logo.clearbit.com/skoda-auto.com", "#4BA82E"),
            z("seat",        "SEAT",          "S", "https://logo.clearbit.com/seat.com", "#E3000F"),
            z("togg",        "Togg",          "T", "https://logo.clearbit.com/togg.com.tr", "#000000"),
            z("dacia",       "Dacia",         "D", "https://logo.clearbit.com/dacia.com", "#52605E"),
            z("tesla",       "Tesla",         "T", "https://logo.clearbit.com/tesla.com", "#E31937"),
        ];
        /* ── Oto Ünlüler & İçerik Üreticileri ── */
        case "auto_influencers": return [
            { ...z("2crserhat", "Serhat İnci (2CR)", "🏎️", undefined, "#D32F2F", "https://www.youtube.com/@2crserhatinci",
                "Ankara merkezli 2CR Garage'ın kurucusu. Chip tuning, ECU yazılım ve yüksek performans modifikasyonları konusunda Türkiye'nin en bilinen isimlerinden. YouTube'da sahibinden.com ilanlarını canlı yayında yorumlayarak büyük kitle topladı. Aynı zamanda ikinci el piyasa analizleri ve modifiye süreçlerini detaylıca anlatıyor.",
                undefined, "340K"),
                realName: "Serhat İnci", location: "Ankara", business: "2CR Garage (Chip Tuning & ECU Yazılım)",
                instagramUrl: "https://www.instagram.com/2crserhatinci", specialties: ["Chip Tuning", "ECU Yazılım", "Modifiye", "Canlı Yayın"] },

            { ...z("pufidufi", "Pufidufi", "💨", undefined, "#FBC02D", "https://www.youtube.com/@Pufiduf",
                "Ankara merkezli otomobil içerik üreticisi. Samimi ve esprili üslubuyla araç incelemeleri, oto pazar turları ve ikinci el piyasa yorumları yapıyor. Yakın zamanda Ankara Otokent'in en üst katında kendi oto galerisini açarak içerik üreticiliğinin yanı sıra sektöre fiilen adım attı.",
                undefined, "550K"),
                realName: "Pufidufi", location: "Ankara", business: "Oto Galeri (Ankara Otokent, En Üst Kat)",
                instagramUrl: "https://www.instagram.com/pufiduf", specialties: ["Araç İnceleme", "Oto Pazar Turu", "Galeri", "İkinci El"] },

            { ...z("kucukburjuvazi", "Küçük Burjuvazi", "🎩", undefined, "#1976D2", "https://www.youtube.com/@K%C3%BC%C3%A7%C3%BCkBurjuvazi",
                "Kanalı Emirhan Şentürk (@emrhnsenturk) ve arkadaşı Ali (@alikty) birlikte yürütüyor. Premium ve lüks segment araçların detaylı incelemelerini, karşılaştırma testlerini ve yaşam tarzı içeriklerini yüksek prodüksiyon kalitesiyle sunuyorlar.",
                undefined, "420K"),
                realName: "Emirhan Şentürk & Ali", location: "İstanbul",
                instagramUrl: "https://www.instagram.com/emrhnsenturk", specialties: ["Lüks Araçlar", "Yaşam Tarzı", "Karşılaştırma", "Premium"] },

            { ...z("parababasasi", "Said Yalım (Para Babası)", "💸", undefined, "#388E3C", "https://www.youtube.com/@saidyalim",
                "Isparta'da yaşıyor ve otomobil alım-satımı ile uğraşıyor. Lüks ve spor araçların piyasa değerlerini, kazançlı alım-satım taktiklerini ve ikinci el pazarının bilinmeyenlerini cesur ve dobra üslubuyla paylaşıyor. Galeri dünyasının içinden gelen samimi bir bakış açısı sunuyor.",
                undefined, "438K"),
                realName: "Said Yalım", location: "Isparta", business: "Otomobil Alım-Satım",
                specialties: ["Alım-Satım", "Piyasa Analizi", "Lüks Araçlar", "Galeri"] },

            { ...z("dogankabak", "Doğan Kabak", "🚘", undefined, "#FF9800", "https://www.youtube.com/@dogankabak",
                "23 Nisan 1980 doğumlu. Eski ralli pilotu ve Türkiye'nin en tanınmış otomotiv gazetecilerinden biri. Araçları hem pistte hem günlük hayatta sınırlarına kadar zorlayarak esprili ve enerjik anlatımıyla milyonlara ulaşıyor. Geniş araç yelpazesiyle her bütçeye ve zevke hitap eden Türkiye'nin en çok abone olunan otomobil kanallarından.",
                1980, "2.79M"),
                realName: "Doğan Kabak", location: "İstanbul",
                instagramUrl: "https://www.instagram.com/dogankabak", specialties: ["Araç İnceleme", "Ralli", "Sürüş Testi", "Eğlence"] },

            { ...z("otoparkcom", "Sinan Koç (OTOPARK.com)", "🅿️", undefined, "#E53935", "https://www.youtube.com/@OTOPARKCOM",
                "4 Aralık doğumlu. Türkiye'nin en köklü bağımsız otomobil inceleme platformu OTOPARK.com'un kurucularından. Profesyonel sürüş testleri, viraj performans analizleri ve detaylı POV sürüş videoları ile sektörde objektif ve güvenilir bir referans noktası. Uzun yıllardır otomobil medyasında aktif.",
                undefined, "660K"),
                realName: "Sinan Koç", location: "İstanbul", business: "OTOPARK.com (Otomobil İnceleme Platformu)",
                instagramUrl: "https://www.instagram.com/sinankoc", specialties: ["POV Sürüş", "Viraj Testi", "Profesyonel İnceleme", "Platform"] },

            { ...z("benzintv", "Burak Ertem (Benzin TV)", "⛽", undefined, "#8E24AA", "https://www.youtube.com/@benzin-tv",
                "20 yılı aşkın otomotiv dergisi editörlüğü deneyimine sahip, sektörün en tecrübeli isimlerinden. Motor sporları, F1 dünyası, otomobil kültürü ve teknik mühendislik detayları üzerine vizyoner ve entelektüel içerikler üretiyor. Gerçek bir otomobil gazetecisi.",
                undefined, "383K"),
                realName: "Burak Ertem", location: "İstanbul", business: "Benzin TV (Otomobil Medya)",
                specialties: ["F1", "Motor Sporları", "Otomobil Kültürü", "Gazetecilik"] },

            { ...z("sekizsilindir", "Etem Güçlü Sayın (Sekizsilindir)", "8️⃣", undefined, "#455A64", "https://www.youtube.com/@sekizsilindir",
                "Makine yüksek mühendisi. V kayışından turboşarja, motor bloklarından diferansiyel kilitlerine kadar otomobil mekaniğini animasyonlar, şemalar ve gerçek parça görselleriyle en anlaşılır biçimde anlatan Türkiye'nin en değerli eğitici otomobil kanalı. sekizsilindir.com'un da kurucusu.",
                undefined, "829K"),
                realName: "Etem Güçlü Sayın", location: "İstanbul", business: "sekizsilindir.com (Eğitici Otomobil Platformu)",
                specialties: ["Teknik Eğitim", "Motor Mekaniği", "Mühendislik", "Animasyon"] },

            { ...z("tarcanlar", "Sami Tarcan (Tarcanlar Ekspertiz)", "🛡️", undefined, "#C2185B", "https://www.youtube.com/@tarcanlartuningekspertizkocael",
                "Babası Rıfat Tarcan'ın 1990'da kurduğu işletmeyi kardeşleri Oktay ve Serdar Tarcan ile birlikte sürdürüyor. Türkiye'de airbag ve plastik parça testlerini yapan öncü firmalardan. İkinci el araçlardaki gizli hasarları, boya ve şase hilelerini ifşa eden videoları milyonlarca izleniyor.",
                undefined, "418K"),
                realName: "Sami Tarcan", location: "Kocaeli / Başiskele", business: "Tarcanlar Oto Ekspertiz & Tuning (1990'dan beri)",
                instagramUrl: "https://www.instagram.com/tarcanlarekspertiz", specialties: ["Ekspertiz", "Boya Tespiti", "Şase Kontrolü", "İfşa"] },

            { ...z("anlatanadamlar", "Doğacan Kara & Tuğberk Keçecioğlu (Anlatan Adamlar)", "🎙️", undefined, "#0288D1", "https://www.youtube.com/@AnlatanAdamlar",
                "ODTÜ mezunu makine yüksek mühendisleri. Otomobil dünyasındaki güncel gelişmeleri, teknik yenilikleri ve piyasa analizlerini mühendislik bilgisi ve eğlenceli sohbet formatında sunuyorlar. anlatanadamlar.com web sitesi de aktif.",
                undefined, "712K"),
                realName: "Doğacan Kara & Tuğberk Keçecioğlu", location: "Ankara", business: "anlatanadamlar.com",
                instagramUrl: "https://www.instagram.com/anlatanadamlar", specialties: ["Teknik Analiz", "Piyasa Yorumu", "Mühendislik", "Sohbet"] },
        ];

        default: return [];
    }
};

export const getReviewsForBrand = (_brandId: string): UserReview[] => {
    return [];
};
