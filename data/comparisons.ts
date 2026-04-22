export interface Vote {
    vehicleIndex: number;
    count: number;
}

export interface Comment {
    id: number;
    author: string;
    authorLevel: string;
    isExpert: boolean;
    text: string;
    likes: number;
    replies: number;
    date: string;
}

export interface Comparison {
    id: number;
    title: string;
    vehicles: string[];
    vehicleCount: number;
    author: string;
    authorLevel: string;
    date: string;
    views: number;
    comments: number;
    category: string;
    description?: string;
    votes: Vote[];
    commentsList: Comment[];
    vehicleUrls?: string[]; // Optional URLs for each vehicle
}

export const mockComparisons: Comparison[] = [
    {
        id: 1,
        title: "Ford Focus Otomatik Seçimi - Style vs Trend X",
        vehicles: ["Ford Focus 1.6 Ti-VCT Style", "Ford Focus 1.6 TDCi Trend X"],
        vehicleCount: 2,
        author: "motor_ustasi_ali",
        authorLevel: "Efsane",
        date: "2 saat önce",
        views: 68,
        comments: 6,
        category: "Sedan",
        description: "İki temiz Ford Focus arasında kaldım. Biri benzinli lpg uyumlu, diğeri dizel. Sizce hangisi?",
        votes: [
            { vehicleIndex: 0, count: 11 },
            { vehicleIndex: 1, count: 7 }
        ],
        commentsList: [
            {
                id: 1,
                author: "yolcanavari",
                authorLevel: "Efsane",
                isExpert: false,
                text: "Benzinli olanın motoru daha sessizdir ama dizelin torku yokuşlarda iyi hissettirir. Şehiriçi çok kullanacaksan benzin+lpg mantıklı.",
                likes: 4,
                replies: 1,
                date: "1 saat önce"
            }
        ],
        vehicleUrls: [
            "https://www.sahibinden.com/ilan/vasita-otomobil-ford-sd-auto-dan-kaput-tavn-bagaj-orj-degisensz-otomatik-double-ekran-1282025225/detay",
            "https://www.sahibinden.com/ilan/vasita-otomobil-ford-x-oto-gld-group-hatasiz-boyasiz-otomatik-takas-kredi_k.karti-1293234743/detay"
        ]
    },
    {
        id: 2,
        title: "Renault Talisman Icon Karşılaştırması",
        vehicles: ["Talisman Icon 2017 (Masajlı)", "Talisman Icon Cam Tavan", "Talisman Icon Full Paket"],
        vehicleCount: 3,
        author: "fransizstili",
        authorLevel: "Sürücü",
        date: "5 saat önce",
        views: 60,
        comments: 4,
        category: "Premium Sedan",
        description: "D segmentinin konfor kralı Talisman için 3 ilan arasında kaldım. Donanım farklarına değer mi?",
        votes: [
            { vehicleIndex: 0, count: 5 },
            { vehicleIndex: 1, count: 8 },
            { vehicleIndex: 2, count: 4 }
        ],
        commentsList: [
            {
                id: 1,
                author: "mekanikcerrah",
                authorLevel: "Efsane",
                isExpert: true,
                text: "Cam tavan Talisman'da çok hava katıyor ama rüzgar sesi yapıp yapmadığına dikkat et. Masajlı koltuk uzun yolda hayat kurtarır.",
                likes: 3,
                replies: 0,
                date: "3 saat önce"
            }
        ],
        vehicleUrls: [
            "https://www.sahibinden.com/ilan/vasita-otomobil-renault-2017-cikis-head-up-isitma-sogutma-masaj-210-bin-km-boyasiz-1295766267/detay",
            "https://www.sahibinden.com/ilan/vasita-otomobil-renault-renault-talisman-icon-cam-tavan-1.6-dci-130-edc-1295244718/detay",
            "https://www.sahibinden.com/ilan/vasita-otomobil-renault-350bin-pesin-48ay-kredi-vade-imkaniyla-icon-full-donanim-1272071506/detay"
        ]
    }
];

export const comparisonCategories = [
    "Tümü",
    "2 Araç",
    "3 Araç",
    "4 Araç",
    "5 Araç"
];
