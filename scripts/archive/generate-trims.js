const fs = require('fs');

const vehicles = [
  { id: 1, brand: "Renault", model: "Clio 5. Nesil (2020-2025)", generation: "2020-2025" },
  { id: 2, brand: "Fiat", model: "Egea 1. Nesil (2015-2025)", generation: "2015-2025" },
  { id: 3, brand: "Toyota", model: "Corolla 12. Nesil (2019-2025)", generation: "2019-2025" },
  { id: 4, brand: "Renault", model: "Megane 4. Nesil (2016-2025)", generation: "2016-2025" },
  { id: 5, brand: "Honda", model: "Civic 11. Nesil FE1 (2021-2025)", generation: "2021-2025" },
  { id: 6, brand: "Volkswagen", model: "Passat B8 (2015-2023)", generation: "2015-2023" },
  { id: 7, brand: "Dacia", model: "Duster 2. Nesil (2018-2024)", generation: "2018-2025" },
  { id: 8, brand: "Hyundai", model: "i20 3. Nesil BC3 (2020-2025)", generation: "2020-2025" },
  { id: 901, brand: "Peugeot", model: "3008 (1. Nesil 2009-2016)", generation: "2009-2016" },
  { id: 902, brand: "Peugeot", model: "3008 (2. Nesil 2016-2023)", generation: "2016-2023" },
  { id: 10, brand: "Opel", model: "Corsa F (2020-2025)", generation: "2020-2025" },
  { id: 11, brand: "Togg", model: "T10X 1. Nesil (2023-2025)", generation: "2023-2025" },
  { id: 12, brand: "Chery", model: "Tiggo 8 Pro 1. Nesil (2023-2025)", generation: "2023-2025" },
  { id: 13, brand: "Volkswagen", model: "Golf 8. Nesil (2020-2025)", generation: "2020-2025" },
  { id: 14, brand: "Ford", model: "Focus 4. Nesil Mk4 (2018-2025)", generation: "2018-2025" },
  { id: 15, brand: "BMW", model: "320i F30 (2012-2019)", generation: "2019-2025" },
  { id: 16, brand: "Mercedes-Benz", model: "C180 W205 (2014-2021)", generation: "2021-2025" },
  { id: 17, brand: "Chery", model: "Omoda 5 1. Nesil (2023-2025)", generation: "2023-2025" },
  { id: 18, brand: "Nissan", model: "Qashqai J11 (2014-2021)", generation: "2021-2025" },
  { id: 19, brand: "Hyundai", model: "Tucson NX4 4. Nesil (2020-2025)", generation: "2021-2025" },
  { id: 20, brand: "Kia", model: "Sportage NQ5 5. Nesil (2021-2025)", generation: "2022-2025" },
  { id: 21, brand: "Peugeot", model: "2008 2. Nesil P24 (2019-2025)", generation: "2020-2025" },
  { id: 22, brand: "Opel", model: "Astra K (2015-2021)", generation: "2022-2025" },
  { id: 23, brand: "Honda", model: "City 7. Nesil GN (2021-2025)", generation: "2021-2025" },
  { id: 24, brand: "Volkswagen", model: "Polo AW 6. Nesil (2017-2025)", generation: "2018-2025" },
  { id: 25, brand: "Citroen", model: "C4 X 1. Nesil (2022-2025)", generation: "2023-2025" },
  { id: 26, brand: "Skoda", model: "Octavia NX 4. Nesil (2020-2025)", generation: "2020-2025" },
  { id: 27, brand: "Skoda", model: "Superb B8 3. Nesil (2015-2023)", generation: "2015-2025" },
  { id: 28, brand: "Chery", model: "Tiggo 7 Pro 1. Nesil (2023-2025)", generation: "2023-2025" },
  { id: 29, brand: "Seat", model: "Leon KL 4. Nesil (2020-2025)", generation: "2020-2025" },
  { id: 30, brand: "Tesla", model: "Model Y 1. Nesil (2020-2025)", generation: "2022-2025" },
  { id: 31, brand: "Hyundai", model: "i20 2. Nesil GB (2014-2020)", generation: "2014-2020" },
  { id: 32, brand: "Hyundai", model: "i30 2. Nesil GD (2012-2017)", generation: "2012-2017" },
  { id: 33, brand: "Audi", model: "TT 2. Nesil Mk2 (2006-2014)", generation: "2006-2014" },
  { id: 34, brand: "Renault", model: "Clio 4. Nesil (2012-2019)", generation: "2012-2019" }
];

const brandTrims = {
    "Renault": ["Joy", "Touch", "Icon"],
    "Fiat": ["Easy", "Urban", "Lounge"],
    "Toyota": ["Vision", "Dream", "Flame", "Passion"],
    "Honda": ["Elegance", "Executive", "Executive+"],
    "Volkswagen": ["Impression", "Life", "Style", "R-Line"],
    "Peugeot": ["Active", "Allure", "GT"],
    "Citroen": ["Feel", "Shine", "Shine Bold"],
    "Opel": ["Edition", "Elegance", "Ultimate"],
    "Hyundai": ["Jump", "Style", "Elite", "Elite Plus"],
    "Kia": ["Cool", "Elegance", "Prestige"],
    "Dacia": ["Essential", "Expression", "Journey"],
    "Chery": ["Comfort", "Luxury", "Excellent"],
    "Togg": ["V1 Standart", "V2 Uzun Menzil"],
    "Ford": ["Trend X", "Titanium", "ST-Line"],
    "BMW": ["Joy", "M Sport", "Sport Line"],
    "Mercedes-Benz": ["Fascination", "AMG", "Exclusive"],
    "Nissan": ["Visia", "Tekna", "Platinum Premium"],
    "Skoda": ["Elite", "Premium", "Prestige", "Sportline"],
    "Seat": ["Style", "Xcellence", "FR"],
    "Tesla": ["RWD", "Long Range", "Performance"],
    "Audi": ["Advanced", "S line"]
};

let output = `export type FeatureStatus = 'standard' | 'optional' | 'none';

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
        .replace(/[^a-z0-9\\s-]/g, '')
        .replace(/\\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

export const trimLevelsData: TrimLevelData[] = [\n`;

vehicles.forEach(v => {
    let trims = brandTrims[v.brand] || ["Standart", "Lüks", "Premium"];
    if (v.id === 8) trims = ["Jump", "Style", "Elite", "Elite Plus"]; // specific to match earlier definition

    const cats = [
        {
            categoryName: "Dış Donanım ve Tasarım",
            features: [
                { name: "Alaşımlı Jantlar", type: "ladder" },
                { name: "LED Ön Farlar", type: "high-only" },
                { name: "LED Arka Stoplar", type: "mid-up" },
                { name: "Açılabilir Cam Tavan (Sunroof)", type: "optional-low" }
            ]
        },
        {
            categoryName: "İç Donanım ve Konfor",
            features: [
                { name: "Dijital Klima", type: "mid-up" },
                { name: "Anahtarsız Giriş ve Çalıştırma", type: "mid-up" },
                { name: "Ambiyans Aydınlatma", type: "high-only" },
                { name: "Deri Direksiyon", type: "mid-up" },
                { name: "Koltuk Isıtma", type: "top-only" }
            ]
        },
        {
            categoryName: "Multimedya ve Teknoloji",
            features: [
                { name: "Dokunmatik Ekran", type: "mid-up" },
                { name: "Apple CarPlay & Android Auto", type: "mid-up" },
                { name: "Dijital Gösterge Paneli", type: "high-only" },
                { name: "Geri Görüş Kamerası", type: "mid-up" },
                { name: "Premium Ses Sistemi", type: "top-only" }
            ]
        },
        {
            categoryName: "Güvenlik ve Sürüş Asistanları",
            features: [
                { name: "Hız Sabitleyici (Cruise Control)", type: "mid-up" },
                { name: "Şerit Takip Asistanı", type: "high-only" },
                { name: "Ön Çarpışma Önleme", type: "top-only" },
                { name: "Arka Park Sensörü", type: "ladder-mid" }
            ]
        }
    ];

    let catString = `        [\n`;
    cats.forEach(c => {
        catString += `            {\n                categoryName: "${c.categoryName}",\n                features: [\n`;
        c.features.forEach(f => {
            let statusObj = {};
            trims.forEach((t, index) => {
                let status = 'none';
                if (f.type === 'ladder') {
                    status = index === 0 ? 'none' : 'standard';
                } else if (f.type === 'high-only') {
                    status = index >= trims.length - 2 ? 'standard' : 'none';
                } else if (f.type === 'mid-up') {
                    status = index >= 1 ? 'standard' : 'none';
                } else if (f.type === 'optional-low') {
                    status = index === 0 ? 'none' : (index === 1 ? 'optional' : 'standard');
                } else if (f.type === 'top-only') {
                    status = index === trims.length - 1 ? 'standard' : 'none';
                } else if (f.type === 'ladder-mid') {
                    status = index >= 1 ? 'standard' : 'optional';
                }
                
                // base rules just to make sure there's data
                if (status === 'none' && index === trims.length -1) status = 'standard';
                if (index === 0 && f.name === 'Dokunmatik Ekran') status = 'none';

                statusObj[t] = status;
            });

            catString += `                    { name: "${f.name}", status: ${JSON.stringify(statusObj)} },\n`;
        });
        catString += `                ]\n            },\n`;
    });
    catString += `        ]`;

    output += `    {
        vehicleId: ${v.id},
        brand: "${v.brand}",
        model: "${v.model}",
        generation: "${v.generation}",
        trims: ${JSON.stringify(trims)},
        categories: ${catString}
    },\n`;
});

output += `];\n`;

fs.writeFileSync('data/trim-levels.ts', output, 'utf8');
console.log("Successfully wrote data/trim-levels.ts");
