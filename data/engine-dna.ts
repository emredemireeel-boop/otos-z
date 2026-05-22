export interface EngineChronicIssue {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    reportCount: number;
}

export interface EngineOption {
    slug: string;
    name: string;
    fuelType: 'Benzin' | 'Dizel' | 'Elektrik' | 'Hibrit' | 'LPG';
    transmission: string;
    score: number;
    chronicIssues: EngineChronicIssue[];
}

export interface VehicleEngineData {
    vehicleId: number;
    engines: EngineOption[];
}

// Helper to generate IDs
const generateId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

export const engineDNAData: VehicleEngineData[] = [
    {
        vehicleId: 1,
        engines: [
            { slug: "10-tce-90-hp-benzin-manuel-x-tronic", name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, chronicIssues: [
{ title: "Erken debriyaj aşınması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 68 },
{ title: "Turbo valfi sesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 163 }
] },
            { slug: "15-dci-110-hp-dizel-manuel-edc", name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, chronicIssues: [
{ title: "EGR valfi tıkanıklığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 116 },
{ title: "Partikül filtresi dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 182 }
] },
            { slug: "13-tce-140-hp-benzin-edc", name: "1.3 TCe 140 HP", fuelType: "Benzin", transmission: "EDC", score: 88, chronicIssues: [
{ title: "Kavrama ısınması (Şehir içi)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 183 },
{ title: "Yağ eksiltme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 220 }
] },
            { slug: "16-e-tech-140-hp-hibrit-otomatik", name: "1.6 E-Tech 140 HP", fuelType: "Hibrit", transmission: "Otomatik", score: 90, chronicIssues: [
{ title: "Yazılım güncellemeleri gereksinimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 163 },
{ title: "Vites geçişlerinde kararsızlık", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 59 }
] },
        ]
    },
    {
        vehicleId: 2,
        engines: [
            { slug: "14-fire-95-hp-benzin-manuel", name: "1.4 Fire 95 HP", fuelType: "Benzin", transmission: "Manuel", score: 90, chronicIssues: [
{ title: "Yüksek yağ tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 102 },
{ title: "Performans eksikliği", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 61 }
] },
            { slug: "13-multijet-95-hp-dizel-manuel", name: "1.3 Multijet 95 HP", fuelType: "Dizel", transmission: "Manuel", score: 95, chronicIssues: [
{ title: "EGR tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 232 },
{ title: "Baskı balata ömrü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 122 }
] },
            { slug: "16-multijet-120-hp-dizel-manuel-dct", name: "1.6 Multijet 120 HP", fuelType: "Dizel", transmission: "Manuel / DCT", score: 85, chronicIssues: [
{ title: "Volant arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 214 },
{ title: "DCT kavrama ısınması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 240 }
] },
            { slug: "15-t4-hibrit-130-hp-hibrit-dct", name: "1.5 T4 Hibrit 130 HP", fuelType: "Hibrit", transmission: "DCT", score: 87, chronicIssues: [
{ title: "Elektrik motoru geçiş sarsıntısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 67 }
] },
        ]
    },
    {
        vehicleId: 3,
        engines: [
            { slug: "15-dynamic-force-125-hp-benzin-multidrive-s", name: "1.5 Dynamic Force 125 HP", fuelType: "Benzin", transmission: "Multidrive S", score: 94, chronicIssues: [
{ title: "CVT şanzıman ısınması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 95 },
{ title: "Yüksek devirde ses", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 71 }
] },
            { slug: "18-hybrid-122-hp-hibrit-e-cvt", name: "1.8 Hybrid 122 HP", fuelType: "Hibrit", transmission: "e-CVT", score: 98, chronicIssues: [
{ title: "Batarya kapasite düşüşü (Uzun vadede)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 54 },
{ title: "EGR valfi kirlenmesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 51 }
] },
            { slug: "16-valvematic-132-hp-benzin-manuel-multidrive-s", name: "1.6 Valvematic 132 HP", fuelType: "Benzin", transmission: "Manuel / Multidrive S", score: 96, chronicIssues: [
{ title: "Krank keçesi terlemesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 212 }
] },
        ]
    },
    {
        vehicleId: 4,
        engines: [
            { slug: "10-tce-90-hp-benzin-manuel-x-tronic", name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, chronicIssues: [
{ title: "Erken debriyaj aşınması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 204 },
{ title: "Turbo valfi sesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 201 }
] },
            { slug: "15-dci-110-hp-dizel-manuel-edc", name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, chronicIssues: [
{ title: "EGR valfi tıkanıklığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 102 },
{ title: "Partikül filtresi dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 72 }
] },
            { slug: "13-tce-140-hp-benzin-edc", name: "1.3 TCe 140 HP", fuelType: "Benzin", transmission: "EDC", score: 88, chronicIssues: [
{ title: "Kavrama ısınması (Şehir içi)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 189 },
{ title: "Yağ eksiltme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 234 }
] },
            { slug: "16-e-tech-140-hp-hibrit-otomatik", name: "1.6 E-Tech 140 HP", fuelType: "Hibrit", transmission: "Otomatik", score: 90, chronicIssues: [
{ title: "Yazılım güncellemeleri gereksinimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 50 },
{ title: "Vites geçişlerinde kararsızlık", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 190 }
] },
        ]
    },
    {
        vehicleId: 5,
        engines: [
            { slug: "15-vtec-turbo-182-hp-benzin-cvt", name: "1.5 VTEC Turbo 182 HP", fuelType: "Benzin", transmission: "CVT", score: 94, chronicIssues: [
{ title: "Yağa benzin karışması (Bazı seriler)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 50 },
{ title: "Direksiyon kutusu tıkırtısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 64 }
] },
            { slug: "16-i-dtec-120-hp-dizel-otomatik", name: "1.6 i-DTEC 120 HP", fuelType: "Dizel", transmission: "Otomatik", score: 93, chronicIssues: [
{ title: "DPF dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 246 },
{ title: "Şanzıman yağı değişim hassasiyeti", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 152 }
] },
            { slug: "15-ehev-hibrit-hibrit-e-cvt", name: "1.5 e:HEV Hibrit", fuelType: "Hibrit", transmission: "e-CVT", score: 95, chronicIssues: [
{ title: "Akü ömrü kısallığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 90 },
{ title: "Kış aylarında düşük yakıt verimliliği", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 124 }
] },
        ]
    },
    {
        vehicleId: 6,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, chronicIssues: [
{ title: "Kavrama titremesi (DSG)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 220 },
{ title: "Mekatronik arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 169 }
] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, chronicIssues: [
{ title: "Soğuk marşta titreme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 237 },
{ title: "DSG mekatronik basınç tüpü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 103 }
] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, chronicIssues: [
{ title: "EGR valfi arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 80 },
{ title: "Su pompası sızıntısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 87 },
{ title: "Enjektör arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 168 }
] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, chronicIssues: [
{ title: "DPF dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 179 },
{ title: "AdBlue sistemi sorunları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 97 }
] },
        ]
    },
    {
        vehicleId: 7,
        engines: [
            { slug: "10-tce-90-hp-benzin-manuel-x-tronic", name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, chronicIssues: [
{ title: "Erken debriyaj aşınması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 87 },
{ title: "Turbo valfi sesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 212 }
] },
            { slug: "15-dci-110-hp-dizel-manuel-edc", name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, chronicIssues: [
{ title: "EGR valfi tıkanıklığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 70 },
{ title: "Partikül filtresi dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 151 }
] },
            { slug: "13-tce-140-hp-benzin-edc", name: "1.3 TCe 140 HP", fuelType: "Benzin", transmission: "EDC", score: 88, chronicIssues: [
{ title: "Kavrama ısınması (Şehir içi)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 136 },
{ title: "Yağ eksiltme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 174 }
] },
            { slug: "16-e-tech-140-hp-hibrit-otomatik", name: "1.6 E-Tech 140 HP", fuelType: "Hibrit", transmission: "Otomatik", score: 90, chronicIssues: [
{ title: "Yazılım güncellemeleri gereksinimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 60 },
{ title: "Vites geçişlerinde kararsızlık", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 216 }
] },
        ]
    },
    {
        vehicleId: 8,
        engines: [
            { slug: "14-mpi-100-hp-benzin-manuel-otomatik", name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, chronicIssues: [
{ title: "Katalitik konvertör hassasiyeti", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 231 },
{ title: "Performans eksikliği", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 104 }
] },
            { slug: "10-t-gdi-100-hp-benzin-dct", name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, chronicIssues: [
{ title: "Kuru tip DCT kavrama titremesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 249 },
{ title: "Turbo selenoid valfi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 106 }
] },
            { slug: "14-crdi-90-hp-dizel-manuel", name: "1.4 CRDi 90 HP", fuelType: "Dizel", transmission: "Manuel", score: 92, chronicIssues: [
{ title: "DPF rejenerasyon sıklığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 185 },
{ title: "Enjektör kirlenmesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 54 }
] },
            { slug: "16-t-gdi-177-hp-benzin-dct", name: "1.6 T-GDI 177 HP", fuelType: "Benzin", transmission: "DCT", score: 84, chronicIssues: [
{ title: "Şanzıman aşırı ısınma uyarısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 243 },
{ title: "Kavrama ömrü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 92 }
] },
        ]
    },
    {
        vehicleId: 901,
        engines: [
            { slug: "12-puretech-130-hp-benzin-eat8", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, chronicIssues: [
{ title: "Triger kayışı parçalanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 169 },
{ title: "Yüksek yağ tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 53 },
{ title: "Vakum pompası tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 242 }
] },
            { slug: "15-bluehdi-130-hp-dizel-eat8", name: "1.5 BlueHDi 130 HP", fuelType: "Dizel", transmission: "EAT8", score: 82, chronicIssues: [
{ title: "AdBlue deposu arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 126 },
{ title: "EGR valfi tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 113 },
{ title: "AdBlue pompası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 137 }
] },
        ]
    },
    {
        vehicleId: 902,
        engines: [
            { slug: "12-puretech-130-hp-benzin-eat8", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, chronicIssues: [
{ title: "Triger kayışı parçalanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 234 },
{ title: "Yüksek yağ tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 93 },
{ title: "Vakum pompası tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 167 }
] },
            { slug: "15-bluehdi-130-hp-dizel-eat8", name: "1.5 BlueHDi 130 HP", fuelType: "Dizel", transmission: "EAT8", score: 82, chronicIssues: [
{ title: "AdBlue deposu arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 196 },
{ title: "EGR valfi tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 159 },
{ title: "AdBlue pompası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 66 }
] },
        ]
    },
    {
        vehicleId: 10,
        engines: [
            { slug: "12-puretech-130-hp-benzin-eat8", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, chronicIssues: [
{ title: "Triger kayışı parçalanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 109 },
{ title: "Yüksek yağ tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 86 },
{ title: "Vakum pompası tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 128 }
] },
            { slug: "15-bluehdi-130-hp-dizel-eat8", name: "1.5 BlueHDi 130 HP", fuelType: "Dizel", transmission: "EAT8", score: 82, chronicIssues: [
{ title: "AdBlue deposu arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 66 },
{ title: "EGR valfi tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 240 },
{ title: "AdBlue pompası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 66 }
] },
        ]
    },
    {
        vehicleId: 11,
        engines: [
            { slug: "v1-standart-menzil-elektrik-tek-vites", name: "V1 Standart Menzil", fuelType: "Elektrik", transmission: "Tek Vites", score: 87, chronicIssues: [
{ title: "Ekran arayüzü donmaları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 143 },
{ title: "Mobil uygulama senkronizasyonu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 242 },
{ title: "Şarj istasyonu tanıma hataları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 114 }
] },
            { slug: "v2-uzun-menzil-elektrik-tek-vites", name: "V2 Uzun Menzil", fuelType: "Elektrik", transmission: "Tek Vites", score: 88, chronicIssues: [
{ title: "Yazılımsal hatalar", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 88 },
{ title: "Kamera sensör buğulanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 70 }
] },
        ]
    },
    {
        vehicleId: 12,
        engines: [
            { slug: "16-tgdi-183-hp-benzin-7-dct", name: "1.6 TGDI 183 HP", fuelType: "Benzin", transmission: "7-DCT", score: 82, chronicIssues: [
{ title: "Şanzıman kararsızlığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 165 },
{ title: "Yüksek yakıt tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 61 },
{ title: "Yazılım hataları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 228 }
] },
            { slug: "phev-hibrit-hibrit-dht", name: "PHEV Hibrit", fuelType: "Hibrit", transmission: "DHT", score: 85, chronicIssues: [
{ title: "Batarya menzil tutarsızlığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 148 },
{ title: "Şarj uyumluluğu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 139 }
] },
        ]
    },
    {
        vehicleId: 13,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, chronicIssues: [
{ title: "Kavrama titremesi (DSG)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 202 },
{ title: "Mekatronik arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 117 }
] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, chronicIssues: [
{ title: "Soğuk marşta titreme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 145 },
{ title: "DSG mekatronik basınç tüpü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 64 }
] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, chronicIssues: [
{ title: "EGR valfi arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 169 },
{ title: "Su pompası sızıntısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 227 },
{ title: "Enjektör arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 129 }
] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, chronicIssues: [
{ title: "DPF dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 147 },
{ title: "AdBlue sistemi sorunları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 104 }
] },
        ]
    },
    {
        vehicleId: 14,
        engines: [
            { slug: "14-benzinli-benzin-otomatik", name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, chronicIssues: [
{ title: "Yakıt pompası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 236 },
{ title: "Ateşleme bobini", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 241 }
] },
            { slug: "16-dizel-dizel-manuel", name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, chronicIssues: [
{ title: "DPF rejenerasyonu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 115 },
{ title: "Enjektörler", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 245 }
] },
        ]
    },
    {
        vehicleId: 15,
        engines: [
            { slug: "14-benzinli-benzin-otomatik", name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, chronicIssues: [
{ title: "Yakıt pompası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 132 },
{ title: "Ateşleme bobini", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 240 }
] },
            { slug: "16-dizel-dizel-manuel", name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, chronicIssues: [
{ title: "DPF rejenerasyonu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 82 },
{ title: "Enjektörler", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 235 }
] },
        ]
    },
    {
        vehicleId: 16,
        engines: [
            { slug: "14-benzinli-benzin-otomatik", name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, chronicIssues: [
{ title: "Yakıt pompası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 74 },
{ title: "Ateşleme bobini", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 103 }
] },
            { slug: "16-dizel-dizel-manuel", name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, chronicIssues: [
{ title: "DPF rejenerasyonu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 140 },
{ title: "Enjektörler", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 186 }
] },
        ]
    },
    {
        vehicleId: 17,
        engines: [
            { slug: "16-tgdi-183-hp-benzin-7-dct", name: "1.6 TGDI 183 HP", fuelType: "Benzin", transmission: "7-DCT", score: 82, chronicIssues: [
{ title: "Şanzıman kararsızlığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 164 },
{ title: "Yüksek yakıt tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 154 },
{ title: "Yazılım hataları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 121 }
] },
            { slug: "phev-hibrit-hibrit-dht", name: "PHEV Hibrit", fuelType: "Hibrit", transmission: "DHT", score: 85, chronicIssues: [
{ title: "Batarya menzil tutarsızlığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 52 },
{ title: "Şarj uyumluluğu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 93 }
] },
        ]
    },
    {
        vehicleId: 18,
        engines: [
            { slug: "14-benzinli-benzin-otomatik", name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, chronicIssues: [
{ title: "Yakıt pompası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 175 },
{ title: "Ateşleme bobini", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 114 }
] },
            { slug: "16-dizel-dizel-manuel", name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, chronicIssues: [
{ title: "DPF rejenerasyonu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 63 },
{ title: "Enjektörler", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 185 }
] },
        ]
    },
    {
        vehicleId: 19,
        engines: [
            { slug: "14-mpi-100-hp-benzin-manuel-otomatik", name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, chronicIssues: [
{ title: "Katalitik konvertör hassasiyeti", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 61 },
{ title: "Performans eksikliği", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 127 }
] },
            { slug: "10-t-gdi-100-hp-benzin-dct", name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, chronicIssues: [
{ title: "Kuru tip DCT kavrama titremesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 204 },
{ title: "Turbo selenoid valfi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 114 }
] },
            { slug: "14-crdi-90-hp-dizel-manuel", name: "1.4 CRDi 90 HP", fuelType: "Dizel", transmission: "Manuel", score: 92, chronicIssues: [
{ title: "DPF rejenerasyon sıklığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 85 },
{ title: "Enjektör kirlenmesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 80 }
] },
            { slug: "16-t-gdi-177-hp-benzin-dct", name: "1.6 T-GDI 177 HP", fuelType: "Benzin", transmission: "DCT", score: 84, chronicIssues: [
{ title: "Şanzıman aşırı ısınma uyarısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 161 },
{ title: "Kavrama ömrü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 244 }
] },
        ]
    },
    {
        vehicleId: 20,
        engines: [
            { slug: "14-mpi-100-hp-benzin-manuel-otomatik", name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, chronicIssues: [
{ title: "Katalitik konvertör hassasiyeti", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 222 },
{ title: "Performans eksikliği", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 80 }
] },
            { slug: "10-t-gdi-100-hp-benzin-dct", name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, chronicIssues: [
{ title: "Kuru tip DCT kavrama titremesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 131 },
{ title: "Turbo selenoid valfi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 248 }
] },
            { slug: "14-crdi-90-hp-dizel-manuel", name: "1.4 CRDi 90 HP", fuelType: "Dizel", transmission: "Manuel", score: 92, chronicIssues: [
{ title: "DPF rejenerasyon sıklığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 58 },
{ title: "Enjektör kirlenmesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 148 }
] },
            { slug: "16-t-gdi-177-hp-benzin-dct", name: "1.6 T-GDI 177 HP", fuelType: "Benzin", transmission: "DCT", score: 84, chronicIssues: [
{ title: "Şanzıman aşırı ısınma uyarısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 124 },
{ title: "Kavrama ömrü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 95 }
] },
        ]
    },
    {
        vehicleId: 21,
        engines: [
            { slug: "12-puretech-130-hp-benzin-eat8", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, chronicIssues: [
{ title: "Triger kayışı parçalanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 190 },
{ title: "Yüksek yağ tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 161 },
{ title: "Vakum pompası tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 201 }
] },
            { slug: "15-bluehdi-130-hp-dizel-eat8", name: "1.5 BlueHDi 130 HP", fuelType: "Dizel", transmission: "EAT8", score: 82, chronicIssues: [
{ title: "AdBlue deposu arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 169 },
{ title: "EGR valfi tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 65 },
{ title: "AdBlue pompası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 210 }
] },
        ]
    },
    {
        vehicleId: 22,
        engines: [
            { slug: "12-puretech-130-hp-benzin-eat8", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, chronicIssues: [
{ title: "Triger kayışı parçalanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 88 },
{ title: "Yüksek yağ tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 60 },
{ title: "Vakum pompası tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 216 }
] },
            { slug: "15-bluehdi-130-hp-dizel-eat8", name: "1.5 BlueHDi 130 HP", fuelType: "Dizel", transmission: "EAT8", score: 82, chronicIssues: [
{ title: "AdBlue deposu arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 118 },
{ title: "EGR valfi tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 132 },
{ title: "AdBlue pompası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 180 }
] },
        ]
    },
    {
        vehicleId: 23,
        engines: [
            { slug: "15-vtec-turbo-182-hp-benzin-cvt", name: "1.5 VTEC Turbo 182 HP", fuelType: "Benzin", transmission: "CVT", score: 94, chronicIssues: [
{ title: "Yağa benzin karışması (Bazı seriler)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 115 },
{ title: "Direksiyon kutusu tıkırtısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 202 }
] },
            { slug: "16-i-dtec-120-hp-dizel-otomatik", name: "1.6 i-DTEC 120 HP", fuelType: "Dizel", transmission: "Otomatik", score: 93, chronicIssues: [
{ title: "DPF dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 51 },
{ title: "Şanzıman yağı değişim hassasiyeti", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 80 }
] },
            { slug: "15-ehev-hibrit-hibrit-e-cvt", name: "1.5 e:HEV Hibrit", fuelType: "Hibrit", transmission: "e-CVT", score: 95, chronicIssues: [
{ title: "Akü ömrü kısallığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 244 },
{ title: "Kış aylarında düşük yakıt verimliliği", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 95 }
] },
        ]
    },
    {
        vehicleId: 24,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, chronicIssues: [
{ title: "Kavrama titremesi (DSG)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 181 },
{ title: "Mekatronik arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 142 }
] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, chronicIssues: [
{ title: "Soğuk marşta titreme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 99 },
{ title: "DSG mekatronik basınç tüpü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 173 }
] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, chronicIssues: [
{ title: "EGR valfi arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 55 },
{ title: "Su pompası sızıntısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 129 },
{ title: "Enjektör arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 181 }
] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, chronicIssues: [
{ title: "DPF dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 239 },
{ title: "AdBlue sistemi sorunları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 80 }
] },
        ]
    },
    {
        vehicleId: 25,
        engines: [
            { slug: "12-puretech-130-hp-benzin-eat8", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, chronicIssues: [
{ title: "Triger kayışı parçalanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 179 },
{ title: "Yüksek yağ tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 139 },
{ title: "Vakum pompası tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 98 }
] },
            { slug: "15-bluehdi-130-hp-dizel-eat8", name: "1.5 BlueHDi 130 HP", fuelType: "Dizel", transmission: "EAT8", score: 82, chronicIssues: [
{ title: "AdBlue deposu arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 62 },
{ title: "EGR valfi tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 231 },
{ title: "AdBlue pompası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 96 }
] },
        ]
    },
    {
        vehicleId: 26,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, chronicIssues: [
{ title: "Kavrama titremesi (DSG)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 157 },
{ title: "Mekatronik arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 52 }
] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, chronicIssues: [
{ title: "Soğuk marşta titreme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 191 },
{ title: "DSG mekatronik basınç tüpü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 54 }
] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, chronicIssues: [
{ title: "EGR valfi arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 206 },
{ title: "Su pompası sızıntısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 88 },
{ title: "Enjektör arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 137 }
] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, chronicIssues: [
{ title: "DPF dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 176 },
{ title: "AdBlue sistemi sorunları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 92 }
] },
        ]
    },
    {
        vehicleId: 27,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, chronicIssues: [
{ title: "Kavrama titremesi (DSG)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 162 },
{ title: "Mekatronik arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 199 }
] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, chronicIssues: [
{ title: "Soğuk marşta titreme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 154 },
{ title: "DSG mekatronik basınç tüpü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 148 }
] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, chronicIssues: [
{ title: "EGR valfi arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 164 },
{ title: "Su pompası sızıntısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 171 },
{ title: "Enjektör arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 98 }
] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, chronicIssues: [
{ title: "DPF dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 239 },
{ title: "AdBlue sistemi sorunları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 165 }
] },
        ]
    },
    {
        vehicleId: 28,
        engines: [
            { slug: "16-tgdi-183-hp-benzin-7-dct", name: "1.6 TGDI 183 HP", fuelType: "Benzin", transmission: "7-DCT", score: 82, chronicIssues: [
{ title: "Şanzıman kararsızlığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 175 },
{ title: "Yüksek yakıt tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 154 },
{ title: "Yazılım hataları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 70 }
] },
            { slug: "phev-hibrit-hibrit-dht", name: "PHEV Hibrit", fuelType: "Hibrit", transmission: "DHT", score: 85, chronicIssues: [
{ title: "Batarya menzil tutarsızlığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 108 },
{ title: "Şarj uyumluluğu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 237 }
] },
        ]
    },
    {
        vehicleId: 29,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, chronicIssues: [
{ title: "Kavrama titremesi (DSG)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 99 },
{ title: "Mekatronik arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 67 }
] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, chronicIssues: [
{ title: "Soğuk marşta titreme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 221 },
{ title: "DSG mekatronik basınç tüpü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 112 }
] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, chronicIssues: [
{ title: "EGR valfi arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 175 },
{ title: "Su pompası sızıntısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 239 },
{ title: "Enjektör arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 57 }
] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, chronicIssues: [
{ title: "DPF dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 123 },
{ title: "AdBlue sistemi sorunları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 177 }
] },
        ]
    },
    {
        vehicleId: 30,
        engines: [
            { slug: "rwd-elektrik-tek-vites", name: "RWD", fuelType: "Elektrik", transmission: "Tek Vites", score: 92, chronicIssues: [
{ title: "Boya kalitesi problemleri", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 99 },
{ title: "Ekran donmaları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 221 },
{ title: "Süspansiyon burçları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 225 }
] },
            { slug: "long-range-dual-motor-elektrik-tek-vites", name: "Long Range Dual Motor", fuelType: "Elektrik", transmission: "Tek Vites", score: 90, chronicIssues: [
{ title: "Şarj kapağı sensörü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 193 },
{ title: "Isı pompası arızası (Soğuk havada)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 249 }
] },
            { slug: "performance-elektrik-tek-vites", name: "Performance", fuelType: "Elektrik", transmission: "Tek Vites", score: 88, chronicIssues: [
{ title: "Lastik aşınması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 120 },
{ title: "Fren diski eğrilmesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 168 }
] },
        ]
    },
    {
        vehicleId: 31,
        engines: [
            { slug: "14-mpi-100-hp-benzin-manuel-otomatik", name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, chronicIssues: [
{ title: "Katalitik konvertör hassasiyeti", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 126 },
{ title: "Performans eksikliği", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 75 }
] },
            { slug: "10-t-gdi-100-hp-benzin-dct", name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, chronicIssues: [
{ title: "Kuru tip DCT kavrama titremesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 121 },
{ title: "Turbo selenoid valfi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 153 }
] },
            { slug: "14-crdi-90-hp-dizel-manuel", name: "1.4 CRDi 90 HP", fuelType: "Dizel", transmission: "Manuel", score: 92, chronicIssues: [
{ title: "DPF rejenerasyon sıklığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 226 },
{ title: "Enjektör kirlenmesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 179 }
] },
            { slug: "16-t-gdi-177-hp-benzin-dct", name: "1.6 T-GDI 177 HP", fuelType: "Benzin", transmission: "DCT", score: 84, chronicIssues: [
{ title: "Şanzıman aşırı ısınma uyarısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 79 },
{ title: "Kavrama ömrü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 205 }
] },
        ]
    },
    {
        vehicleId: 32,
        engines: [
            { slug: "14-mpi-100-hp-benzin-manuel-otomatik", name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, chronicIssues: [
{ title: "Katalitik konvertör hassasiyeti", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 230 },
{ title: "Performans eksikliği", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 225 }
] },
            { slug: "10-t-gdi-100-hp-benzin-dct", name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, chronicIssues: [
{ title: "Kuru tip DCT kavrama titremesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 189 },
{ title: "Turbo selenoid valfi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 121 }
] },
            { slug: "14-crdi-90-hp-dizel-manuel", name: "1.4 CRDi 90 HP", fuelType: "Dizel", transmission: "Manuel", score: 92, chronicIssues: [
{ title: "DPF rejenerasyon sıklığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 98 },
{ title: "Enjektör kirlenmesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 188 }
] },
            { slug: "16-t-gdi-177-hp-benzin-dct", name: "1.6 T-GDI 177 HP", fuelType: "Benzin", transmission: "DCT", score: 84, chronicIssues: [
{ title: "Şanzıman aşırı ısınma uyarısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 209 },
{ title: "Kavrama ömrü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 160 }
] },
        ]
    },
    {
        vehicleId: 33,
        engines: [
            { slug: "10-tsi-110-hp-benzin-dsg", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, chronicIssues: [
{ title: "Kavrama titremesi (DSG)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 111 },
{ title: "Mekatronik arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 107 }
] },
            { slug: "15-tsi-150-hp-benzin-dsg", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, chronicIssues: [
{ title: "Soğuk marşta titreme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 175 },
{ title: "DSG mekatronik basınç tüpü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 87 }
] },
            { slug: "16-tdi-120-hp-dizel-dsg", name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, chronicIssues: [
{ title: "EGR valfi arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 106 },
{ title: "Su pompası sızıntısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 115 },
{ title: "Enjektör arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 134 }
] },
            { slug: "20-tdi-150-hp-dizel-dsg", name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, chronicIssues: [
{ title: "DPF dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 71 },
{ title: "AdBlue sistemi sorunları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 176 }
] },
        ]
    },
    {
        vehicleId: 34,
        engines: [
            { slug: "10-tce-90-hp-benzin-manuel-x-tronic", name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, chronicIssues: [
{ title: "Erken debriyaj aşınması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 117 },
{ title: "Turbo valfi sesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 100 }
] },
            { slug: "15-dci-110-hp-dizel-manuel-edc", name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, chronicIssues: [
{ title: "EGR valfi tıkanıklığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 63 },
{ title: "Partikül filtresi dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 160 }
] },
            { slug: "13-tce-140-hp-benzin-edc", name: "1.3 TCe 140 HP", fuelType: "Benzin", transmission: "EDC", score: 88, chronicIssues: [
{ title: "Kavrama ısınması (Şehir içi)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 232 },
{ title: "Yağ eksiltme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 185 }
] },
            { slug: "16-e-tech-140-hp-hibrit-otomatik", name: "1.6 E-Tech 140 HP", fuelType: "Hibrit", transmission: "Otomatik", score: 90, chronicIssues: [
{ title: "Yazılım güncellemeleri gereksinimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 247 },
{ title: "Vites geçişlerinde kararsızlık", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 121 }
] },
        ]
    },
    {
        vehicleId: 101,
        engines: [
            { 
                slug: "1-6-karb-rat-rl-80-hp", name: "1.6 Karbüratörlü 80 HP", fuelType: "LPG", transmission: "Manuel", score: 65, 
                chronicIssues: [
                    { title: "Karbüratör Ayarsızlığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 118 },
                    { title: "Yağ Yakma ve Üfleme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 52 }
                ] 
            },
            { 
                slug: "1-4-i-e-71-hp", name: "1.4 i.e. 71 HP", fuelType: "LPG", transmission: "Manuel", score: 68, 
                chronicIssues: [
                    { title: "Rölanti Motoru Arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 70 }
                ] 
            },
            { 
                slug: "1-6-i-e-96-hp", name: "1.6 i.e. 96 HP", fuelType: "LPG", transmission: "Manuel", score: 70, 
                chronicIssues: [
                    { title: "Rölanti Dalgalanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 219 }
                ] 
            }
        ]
    },
    {
        vehicleId: 102,
        engines: [
            { 
                slug: "1-4-fire-95-hp", name: "1.4 Fire 95 HP", fuelType: "Benzin", transmission: "Manuel", score: 90, 
                chronicIssues: [
                    { title: "Yüksek yağ tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 346 },
                    { title: "Performans eksikliği", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 54 }
                ] 
            },
            { 
                slug: "1-3-multijet-95-hp", name: "1.3 Multijet 95 HP", fuelType: "Dizel", transmission: "Manuel", score: 95, 
                chronicIssues: [
                    { title: "EGR tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 166 },
                    { title: "Baskı balata ömrü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 208 }
                ] 
            }
        ]
    },
    {
        vehicleId: 103,
        engines: [
            { 
                slug: "1-0-tce-90-hp", name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, 
                chronicIssues: [
                    { title: "Erken debriyaj aşınması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 90 },
                    { title: "Turbo valfi sesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 58 }
                ] 
            },
            { 
                slug: "1-5-dci-110-hp", name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, 
                chronicIssues: [
                    { title: "EGR valfi tıkanıklığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 109 },
                    { title: "Partikül filtresi dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 71 }
                ] 
            }
        ]
    },
    {
        vehicleId: 104,
        engines: [
            { 
                slug: "1-4-mpi-100-hp", name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, 
                chronicIssues: [
                    { title: "Katalitik konvertör hassasiyeti", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 210 }
                ] 
            },
            { 
                slug: "1-0-t-gdi-100-hp", name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, 
                chronicIssues: [
                    { title: "Kuru tip DCT kavrama titremesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 124 }
                ] 
            }
        ]
    },
    {
        vehicleId: 105,
        engines: [
            { 
                slug: "1-5-vtec-turbo-182-hp", name: "1.5 VTEC Turbo 182 HP", fuelType: "Benzin", transmission: "CVT", score: 94, 
                chronicIssues: [
                    { title: "Direksiyon kutusu tıkırtısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 282 }
                ] 
            }
        ]
    },
    {
        vehicleId: 106,
        engines: [
            { 
                slug: "1-4-fire-95-hp", name: "1.4 Fire 95 HP", fuelType: "Benzin", transmission: "Manuel", score: 90, 
                chronicIssues: [
                    { title: "Yüksek yağ tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 280 },
                    { title: "Performans eksikliği", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 104 }
                ] 
            },
            { 
                slug: "1-3-multijet-95-hp", name: "1.3 Multijet 95 HP", fuelType: "Dizel", transmission: "Manuel", score: 95, 
                chronicIssues: [
                    { title: "EGR tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 75 },
                    { title: "Baskı balata ömrü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 125 }
                ] 
            }
        ]
    },
    {
        vehicleId: 107,
        engines: [
            { 
                slug: "1-0-tce-90-hp", name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, 
                chronicIssues: [
                    { title: "Erken debriyaj aşınması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 207 },
                    { title: "Turbo valfi sesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 66 }
                ] 
            },
            { 
                slug: "1-5-dci-110-hp", name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, 
                chronicIssues: [
                    { title: "EGR valfi tıkanıklığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 227 },
                    { title: "Partikül filtresi dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 213 }
                ] 
            }
        ]
    },
    {
        vehicleId: 108,
        engines: [
            { 
                slug: "1-4-benzinli", name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, 
                chronicIssues: [
                    { title: "Ateşleme bobini", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 211 }
                ] 
            },
            { 
                slug: "1-6-dizel", name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, 
                chronicIssues: [
                    { title: "DPF rejenerasyonu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 270 }
                ] 
            }
        ]
    },
    {
        vehicleId: 109,
        engines: [
            { 
                slug: "1-4-benzinli", name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, 
                chronicIssues: [
                    { title: "Ateşleme bobini", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 158 }
                ] 
            },
            { 
                slug: "1-6-dizel", name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, 
                chronicIssues: [
                    { title: "DPF rejenerasyonu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 71 }
                ] 
            }
        ]
    },
    {
        vehicleId: 110,
        engines: [
            { 
                slug: "1-0-tsi-110-hp", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, 
                chronicIssues: [
                    { title: "DSG Kavrama", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 258 },
                    { title: "Mekatronik", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 319 }
                ] 
            },
            { 
                slug: "1-5-tsi-150-hp", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, 
                chronicIssues: [
                    { title: "DSG Kavrama", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 285 },
                    { title: "ACT Sistem sarsıntısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 268 }
                ] 
            }
        ]
    },
    {
        vehicleId: 111,
        engines: [
            { 
                slug: "1-0-tsi-110-hp", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, 
                chronicIssues: [
                    { title: "Kavrama titremesi (DSG)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 126 }
                ] 
            },
            { 
                slug: "1-5-tsi-150-hp", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, 
                chronicIssues: [
                    { title: "Soğuk marşta titreme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 114 }
                ] 
            }
        ]
    },
    {
        vehicleId: 112,
        engines: [
            { 
                slug: "1-4-benzinli", name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, 
                chronicIssues: [
                    { title: "Ateşleme bobini", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 185 }
                ] 
            },
            { 
                slug: "1-6-dizel", name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, 
                chronicIssues: [
                    { title: "DPF rejenerasyonu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 84 }
                ] 
            }
        ]
    },
    {
        vehicleId: 113,
        engines: [
            { 
                slug: "1-2-dig-t-115-hp", name: "1.2 DIG-T 115 HP", fuelType: "Benzin", transmission: "X-Tronic", score: 78, 
                chronicIssues: [
                    { title: "Aşırı yağ eksiltme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 71 },
                    { title: "Motor revizyon ihtiyacı (Sekman kırma)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 89 }
                ] 
            },
            { 
                slug: "1-5-dci-110-hp", name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel", score: 90, 
                chronicIssues: [
                    { title: "Partikül filtresi tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 71 }
                ] 
            }
        ]
    },
    {
        vehicleId: 114,
        engines: [
            { 
                slug: "1-2-puretech-130-hp", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, 
                chronicIssues: [
                    { title: "Triger kayışı parçalanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 148 },
                    { title: "Yüksek yağ tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 92 }
                ] 
            }
        ]
    },
    {
        vehicleId: 115,
        engines: [
            { 
                slug: "1-5-dynamic-force-125-hp", name: "1.5 Dynamic Force 125 HP", fuelType: "Benzin", transmission: "Multidrive S", score: 94, 
                chronicIssues: [
                    { title: "CVT şanzıman ısınması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 323 },
                    { title: "Yüksek devirde ses", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 165 }
                ] 
            },
            { 
                slug: "1-8-hybrid-122-hp", name: "1.8 Hybrid 122 HP", fuelType: "Hibrit", transmission: "e-CVT", score: 98, 
                chronicIssues: [
                    { title: "Batarya kapasite düşüşü (Uzun vadede)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 144 }
                ] 
            }
        ]
    },
    {
        vehicleId: 116,
        engines: [
            { 
                slug: "1-6-karb-rat-rl-80-hp", name: "1.6 Karbüratörlü 80 HP", fuelType: "LPG", transmission: "Manuel", score: 64, 
                chronicIssues: [
                    { title: "Hararet (Ağır Yük)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 67 }
                ] 
            },
            { 
                slug: "1-6-i-e-96-hp", name: "1.6 i.e. 96 HP", fuelType: "LPG", transmission: "Manuel", score: 69, 
                chronicIssues: [
                    { title: "Rölanti Dalgalanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 186 }
                ] 
            }
        ]
    },
    {
        vehicleId: 117,
        engines: [
            { 
                slug: "1-3-karb-rat-rl-65-hp", name: "1.3 Karbüratörlü 65 HP", fuelType: "LPG", transmission: "Manuel", score: 60, 
                chronicIssues: [
                    { title: "Yağ Kaçakları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 197 }
                ] 
            }
        ]
    },
    {
        vehicleId: 118,
        engines: [
            { 
                slug: "1-5-vtec-turbo-182-hp", name: "1.5 VTEC Turbo 182 HP", fuelType: "Benzin", transmission: "CVT", score: 94, 
                chronicIssues: [
                    { title: "Direksiyon kutusu tıkırtısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 162 }
                ] 
            }
        ]
    },
    {
        vehicleId: 119,
        engines: [
            { 
                slug: "1-5-vtec-turbo-182-hp", name: "1.5 VTEC Turbo 182 HP", fuelType: "Benzin", transmission: "CVT", score: 94, 
                chronicIssues: [
                    { title: "Direksiyon kutusu tıkırtısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 322 }
                ] 
            }
        ]
    },
    {
        vehicleId: 120,
        engines: [
            { 
                slug: "1-0-tce-90-hp", name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, 
                chronicIssues: [
                    { title: "Erken debriyaj aşınması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 62 },
                    { title: "Turbo valfi sesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 78 }
                ] 
            },
            { 
                slug: "1-5-dci-110-hp", name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, 
                chronicIssues: [
                    { title: "EGR valfi tıkanıklığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 86 },
                    { title: "Partikül filtresi dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 172 }
                ] 
            }
        ]
    },
    {
        vehicleId: 121,
        engines: [
            { 
                slug: "1-4-t-150-hp", name: "1.4 T 150 HP", fuelType: "Benzin", transmission: "Otomatik", score: 82, 
                chronicIssues: [
                    { title: "Sekman kırma", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 215 },
                    { title: "Piston çatlatma", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 224 }
                ] 
            },
            { 
                slug: "1-6-cdti-136-hp", name: "1.6 CDTI 136 HP", fuelType: "Dizel", transmission: "Otomatik", score: 85, 
                chronicIssues: [
                    { title: "Zincir sesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 145 }
                ] 
            }
        ]
    },
    {
        vehicleId: 122,
        engines: [
            { 
                slug: "1-0-tsi-110-hp", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, 
                chronicIssues: [
                    { title: "Kavrama titremesi (DSG)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 128 }
                ] 
            },
            { 
                slug: "1-5-tsi-150-hp", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, 
                chronicIssues: [
                    { title: "Soğuk marşta titreme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 50 }
                ] 
            }
        ]
    },
    {
        vehicleId: 123,
        engines: [
            { 
                slug: "1-4-benzinli", name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, 
                chronicIssues: [
                    { title: "Ateşleme bobini", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 328 }
                ] 
            },
            { 
                slug: "1-6-dizel", name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, 
                chronicIssues: [
                    { title: "DPF rejenerasyonu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 55 }
                ] 
            }
        ]
    },
    {
        vehicleId: 124,
        engines: [
            { 
                slug: "1-2-puretech-130-hp", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, 
                chronicIssues: [
                    { title: "Triger kayışı parçalanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 245 },
                    { title: "Yüksek yağ tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 161 }
                ] 
            }
        ]
    },
    {
        vehicleId: 125,
        engines: [
            { 
                slug: "1-4-benzinli", name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, 
                chronicIssues: [
                    { title: "Ateşleme bobini", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 203 }
                ] 
            },
            { 
                slug: "1-6-dizel", name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, 
                chronicIssues: [
                    { title: "DPF rejenerasyonu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 333 }
                ] 
            }
        ]
    },
    {
        vehicleId: 126,
        engines: [
            { 
                slug: "1-0-tsi-110-hp", name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, 
                chronicIssues: [
                    { title: "Kavrama titremesi (DSG)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 218 }
                ] 
            },
            { 
                slug: "1-5-tsi-150-hp", name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, 
                chronicIssues: [
                    { title: "Soğuk marşta titreme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 284 }
                ] 
            }
        ]
    },
    {
        vehicleId: 127,
        engines: [
            { 
                slug: "1-4-mpi-100-hp", name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, 
                chronicIssues: [
                    { title: "Katalitik konvertör hassasiyeti", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 309 }
                ] 
            },
            { 
                slug: "1-0-t-gdi-100-hp", name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, 
                chronicIssues: [
                    { title: "Kuru tip DCT kavrama titremesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 102 }
                ] 
            }
        ]
    },
    {
        vehicleId: 101,
        engines: [
            { 
                slug: "1-6-karb-rat-rl-80-hp", name: "1.6 Karbüratörlü 80 HP", fuelType: "LPG", transmission: "Manuel", score: 65, 
                chronicIssues: [
                    { title: "Karbüratör Ayarsızlığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 80 },
                    { title: "Yağ Yakma ve Üfleme", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 281 }
                ] 
            },
            { 
                slug: "1-4-i-e-71-hp", name: "1.4 i.e. 71 HP", fuelType: "LPG", transmission: "Manuel", score: 68, 
                chronicIssues: [
                    { title: "Rölanti Motoru Arızası", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 124 }
                ] 
            },
            { 
                slug: "1-6-i-e-96-hp", name: "1.6 i.e. 96 HP", fuelType: "LPG", transmission: "Manuel", score: 70, 
                chronicIssues: [
                    { title: "Rölanti Dalgalanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 130 }
                ] 
            }
        ]
    },
    {
        vehicleId: 102,
        engines: [
            { 
                slug: "1-6-karb-rat-rl-80-hp", name: "1.6 Karbüratörlü 80 HP", fuelType: "LPG", transmission: "Manuel", score: 65, 
                chronicIssues: [
                    { title: "Karbüratör Ayarsızlığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 265 }
                ] 
            },
            { 
                slug: "1-6-i-e-96-hp", name: "1.6 i.e. 96 HP", fuelType: "LPG", transmission: "Manuel", score: 70, 
                chronicIssues: [
                    { title: "Rölanti Motoru ve Kelebek Sensörü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 293 }
                ] 
            }
        ]
    },
    {
        vehicleId: 103,
        engines: [
            { 
                slug: "1-6-karb-rat-rl-80-hp", name: "1.6 Karbüratörlü 80 HP", fuelType: "LPG", transmission: "Manuel", score: 64, 
                chronicIssues: [
                    { title: "Hararet (Ağır Yük)", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 129 }
                ] 
            },
            { 
                slug: "1-6-i-e-96-hp", name: "1.6 i.e. 96 HP", fuelType: "LPG", transmission: "Manuel", score: 69, 
                chronicIssues: [
                    { title: "Rölanti Dalgalanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 151 }
                ] 
            }
        ]
    },
    {
        vehicleId: 104,
        engines: [
            { 
                slug: "1-3-karb-rat-rl-65-hp", name: "1.3 Karbüratörlü 65 HP", fuelType: "LPG", transmission: "Manuel", score: 60, 
                chronicIssues: [
                    { title: "Yağ Kaçakları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 191 }
                ] 
            }
        ]
    },
        {
        vehicleId: 150,
        engines: [
            {
                slug: "1-4-benzinli-72-hp", name: "1.4 Benzinli 72 HP", fuelType: "LPG", transmission: "Manuel (4/5 İleri)", score: 50,
                chronicIssues: [
                    { title: "Karbüratör Tıkanması", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 181 },
                    { title: "Ateşleme Bobini Yanması", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 125 }
                ]
            },
            {
                slug: "1-4-tx-72-hp", name: "1.4 TX 72 HP", fuelType: "LPG", transmission: "Manuel (5 İleri)", score: 55,
                chronicIssues: [
                    { title: "Sübap İtici Sesi", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 171 },
                    { title: "Meksefe Platin Arızası", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 107 }
                ]
            }
        ]
    },
    {
        vehicleId: 151,
        engines: [
            {
                slug: "1-4-broadway-72-hp", name: "1.4 Broadway 72 HP", fuelType: "LPG", transmission: "Manuel", score: 58,
                chronicIssues: [
                    { title: "Hararet (Termostat Müşürü)", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 94 },
                    { title: "Rölanti Ayarsızlığı", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 59 }
                ]
            },
            {
                slug: "1-6-fairway-80-hp", name: "1.6 Fairway 80 HP", fuelType: "LPG", transmission: "Manuel", score: 62,
                chronicIssues: [
                    { title: "Radyatör Sızıntısı", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 207 },
                    { title: "Karbüratör Memesi Tıkanıklığı", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 129 }
                ]
            }
        ]
    },
    {
        vehicleId: 152,
        engines: [
            {
                slug: "1-4-70-s", name: "1.4 70 S (Karbüratörlü)", fuelType: "LPG", transmission: "Manuel", score: 55,
                chronicIssues: [
                    { title: "Karbüratör Boğulması", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 132 },
                    { title: "Distribütör Oksitlenmesi", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 71 }
                ]
            },
            {
                slug: "1-4-70-sx-ie", name: "1.4 70 SX i.e. (Enjeksiyonlu)", fuelType: "LPG", transmission: "Manuel", score: 60,
                chronicIssues: [
                    { title: "Rölanti Sensörü (Adım Motoru) Arızası", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 84 },
                    { title: "Benzin Pompası Arızası", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 153 }
                ]
            }
        ]
    },
    {
        vehicleId: 153,
        engines: [
            {
                slug: "1-6-gli-114-hp", name: "1.6 GLi 114 HP (Efsane Motor)", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 90,
                chronicIssues: [
                    { title: "Distribütör O-Ring Terlemesi", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 102 },
                    { title: "Eski Nesil LPG Kurum Yapması", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 200 }
                ]
            },
            {
                slug: "1-3-xl-75-hp", name: "1.3 XL 75 HP", fuelType: "LPG", transmission: "Manuel", score: 85,
                chronicIssues: [
                    { title: "Subap Ayarı Gereksinimi", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 229 }
                ]
            }
        ]
    },
    {
        vehicleId: 154,
        engines: [
            {
                slug: "1-5-gls-92-hp", name: "1.5 GLS 92 HP", fuelType: "LPG", transmission: "Manuel / Otomatik", score: 70,
                chronicIssues: [
                    { title: "Rölanti Motoru Kirlenmesi", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 178 },
                    { title: "LPG Patlatma Sorunu", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 56 }
                ]
            },
            {
                slug: "1-3-ls-75-hp", name: "1.3 LS 75 HP", fuelType: "LPG", transmission: "Manuel", score: 65,
                chronicIssues: [
                    { title: "Performans Düşüklüğü (Yokuşlarda)", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 202 }
                ]
            }
        ]
    },
    {
        vehicleId: 155,
        engines: [
            {
                slug: "1-5-karburatorlu-72-hp", name: "1.5 Karbüratörlü 72 HP", fuelType: "LPG", transmission: "Manuel", score: 55,
                chronicIssues: [
                    { title: "Subap Sesi (Şakırtı)", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 210 },
                    { title: "Karbüratör Ayar Tutmaması", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: 197 }
                ]
            }
        ]
    },
    {
        vehicleId: 156,
        engines: [
            { 
                slug: "1-0-tce-90-hp", name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, 
                chronicIssues: [
                    { title: "Erken debriyaj aşınması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 313 },
                    { title: "Turbo valfi sesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 321 }
                ] 
            },
            { 
                slug: "1-5-dci-110-hp", name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, 
                chronicIssues: [
                    { title: "EGR valfi tıkanıklığı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 85 },
                    { title: "Partikül filtresi dolumu", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 176 }
                ] 
            }
        ]
    },
    {
        vehicleId: 157,
        engines: [
            { 
                slug: "1-4-fire-95-hp", name: "1.4 Fire 95 HP", fuelType: "Benzin", transmission: "Manuel", score: 90, 
                chronicIssues: [
                    { title: "Yüksek yağ tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 120 },
                    { title: "Performans eksikliği", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 224 }
                ] 
            },
            { 
                slug: "1-3-multijet-95-hp", name: "1.3 Multijet 95 HP", fuelType: "Dizel", transmission: "Manuel", score: 95, 
                chronicIssues: [
                    { title: "EGR tıkanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 192 },
                    { title: "Baskı balata ömrü", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 184 }
                ] 
            }
        ]
    },
    {
        vehicleId: 158,
        engines: [
            { 
                slug: "1-2-puretech-130-hp", name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, 
                chronicIssues: [
                    { title: "Triger kayışı parçalanması", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 332 },
                    { title: "Yüksek yağ tüketimi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 167 }
                ] 
            }
        ]
    },
    {
        vehicleId: 159,
        engines: [
            { 
                slug: "1-5-vtec-turbo-182-hp", name: "1.5 VTEC Turbo 182 HP", fuelType: "Benzin", transmission: "CVT", score: 94, 
                chronicIssues: [
                    { title: "Direksiyon kutusu tıkırtısı", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 243 }
                ] 
            }
        ]
    },
    {
        vehicleId: 160,
        engines: [
            { 
                slug: "1-4-t-150-hp", name: "1.4 T 150 HP", fuelType: "Benzin", transmission: "Otomatik", score: 82, 
                chronicIssues: [
                    { title: "Sekman kırma", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 135 },
                    { title: "Piston çatlatma", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 195 }
                ] 
            },
            { 
                slug: "1-6-cdti-136-hp", name: "1.6 CDTI 136 HP", fuelType: "Dizel", transmission: "Otomatik", score: 85, 
                chronicIssues: [
                    { title: "Zincir sesi", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 227 }
                ] 
            }
        ]
    },
    {
        vehicleId: 161,
        engines: [
            { 
                slug: "1-3-karb-rat-rl-65-hp", name: "1.3 Karbüratörlü 65 HP", fuelType: "LPG", transmission: "Manuel", score: 60, 
                chronicIssues: [
                    { title: "Yağ Kaçakları", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: 265 }
                ] 
            }
        ]
    },
    {
        vehicleId: 1001,
        engines: [
            { 
                slug: "1-5-tfsi-150-hp", name: "1.5 TFSI 150 HP", fuelType: "Benzin", transmission: "S tronic", score: 85, 
                chronicIssues: [
                    { title: "Kavrama ısınması", description: "Sıkışık trafikte kavrama ısınması uyarısı.", severity: "medium", reportCount: 15 }
                ] 
            }
        ]
    }
,
    {
        vehicleId: 1002,
        engines: [
            {
                slug: "10-sce-73-hp-benzin-manuel",
                name: "1.0 SCe 73 HP",
                fuelType: "Benzin",
                transmission: "Manuel",
                score: 75,
                chronicIssues: [
                    { title: "Rölanti Dalgalanması", description: "Boğaz kelebeği kirliliği kaynaklı titreme.", severity: "medium", reportCount: 145 },
                    { title: "Yağ Eksiltme (Yüksek KM)", description: "Bazı yüksek kilometreli araçlarda periyodik yağ eksiltmesi gözlemlenmiştir.", severity: "low", reportCount: 92 }
                ]
            }
        ]
    }
,
    {
        vehicleId: 1003,
        engines: [
            {
                slug: "14-mpi-100-hp-benzin-otomatik",
                name: "1.4 MPI 100 HP",
                fuelType: "Benzin",
                transmission: "Tam Otomatik",
                score: 82,
                chronicIssues: [
                    { title: "Ateşleme Bobini Hassasiyeti", description: "Özellikle LPG'li kullanımlarda bobin ömrü kısalabilmektedir.", severity: "low", reportCount: 65 }
                ]
            },
            {
                slug: "125-mpi-84-hp-benzin-manuel",
                name: "1.25 MPI 84 HP",
                fuelType: "Benzin",
                transmission: "Manuel",
                score: 75,
                chronicIssues: [
                    { title: "Debriyaj Kavrama Titremesi", description: "Yoğun trafikte ısınan debriyaj balatası ilk kalkışlarda hafif titreme yapabilir.", severity: "low", reportCount: 110 }
                ]
            }
        ]
    }
,
    {
        vehicleId: 1004,
        engines: [
            {
                slug: "14-mpi-100-hp-benzin-otomatik",
                name: "1.4 MPI 100 HP",
                fuelType: "Benzin",
                transmission: "Tam Otomatik (6AT)",
                score: 84,
                chronicIssues: [
                    { title: "Yüksek Yakıt Tüketimi", description: "Atmosferik motor ve tork konvertör sebebiyle yoğun trafikte sarfiyat fazladır.", severity: "low", reportCount: 300 }
                ]
            },
            {
                slug: "10-tgdi-100-hp-benzin-dct",
                name: "1.0 T-GDI 100 HP",
                fuelType: "Benzin",
                transmission: "Çift Kavrama (DCT)",
                score: 80,
                chronicIssues: [
                    { title: "DCT Kavrama Titremesi", description: "Düşük hızlarda veya dur-kalk trafikte kavramada hafif sarsıntılar hissedilebilir.", severity: "medium", reportCount: 150 }
                ]
            }
        ]
    },
    {
        vehicleId: 1005,
        engines: [
            {
                slug: "16-tgdi-180-hp-benzin-dct",
                name: "1.6 T-GDI 180 HP",
                fuelType: "Benzin",
                transmission: "Çift Kavrama (DCT)",
                score: 85,
                chronicIssues: [
                    { title: "Şanzıman Isınması", description: "Uzun süreli yokuş kalkışlarında ve trafikte kavrama ısınma uyarısı verebilir.", severity: "high", reportCount: 310 }
                ]
            },
            {
                slug: "16-crdi-136-hp-dizel-dct",
                name: "1.6 CRDi 136 HP",
                fuelType: "Dizel",
                transmission: "Çift Kavrama (DCT)",
                score: 88,
                chronicIssues: [
                    { title: "EGR / DPF Tıkanıklığı", description: "Sürekli şehir içi kullanımlarda dizel partikül filtresi dolabilmektedir.", severity: "medium", reportCount: 180 }
                ]
            }
        ]
    }
];
