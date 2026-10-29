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

const engineDB = {
    "Renault": [
        { name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, issues: ["Erken debriyaj aşınması", "Turbo valfi sesi"] },
        { name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, issues: ["EGR valfi tıkanıklığı", "Partikül filtresi dolumu"] },
        { name: "1.3 TCe 140 HP", fuelType: "Benzin", transmission: "EDC", score: 88, issues: ["Kavrama ısınması (Şehir içi)", "Yağ eksiltme"] },
        { name: "1.6 E-Tech 140 HP", fuelType: "Hibrit", transmission: "Otomatik", score: 90, issues: ["Yazılım güncellemeleri gereksinimi", "Vites geçişlerinde kararsızlık"] }
    ],
    "Fiat": [
        { name: "1.4 Fire 95 HP", fuelType: "Benzin", transmission: "Manuel", score: 90, issues: ["Yüksek yağ tüketimi", "Performans eksikliği"] },
        { name: "1.3 Multijet 95 HP", fuelType: "Dizel", transmission: "Manuel", score: 95, issues: ["EGR tıkanması", "Baskı balata ömrü"] },
        { name: "1.6 Multijet 120 HP", fuelType: "Dizel", transmission: "Manuel / DCT", score: 85, issues: ["Volant arızası", "DCT kavrama ısınması"] },
        { name: "1.5 T4 Hibrit 130 HP", fuelType: "Hibrit", transmission: "DCT", score: 87, issues: ["Elektrik motoru geçiş sarsıntısı"] }
    ],
    "Toyota": [
        { name: "1.5 Dynamic Force 125 HP", fuelType: "Benzin", transmission: "Multidrive S", score: 94, issues: ["CVT şanzıman ısınması", "Yüksek devirde ses"] },
        { name: "1.8 Hybrid 122 HP", fuelType: "Hibrit", transmission: "e-CVT", score: 98, issues: ["Batarya kapasite düşüşü (Uzun vadede)", "EGR valfi kirlenmesi"] },
        { name: "1.6 Valvematic 132 HP", fuelType: "Benzin", transmission: "Manuel / Multidrive S", score: 96, issues: ["Krank keçesi terlemesi"] }
    ],
    "Hyundai": [
        { name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, issues: ["Katalitik konvertör hassasiyeti", "Performans eksikliği"] },
        { name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, issues: ["Kuru tip DCT kavrama titremesi", "Turbo selenoid valfi"] },
        { name: "1.4 CRDi 90 HP", fuelType: "Dizel", transmission: "Manuel", score: 92, issues: ["DPF rejenerasyon sıklığı", "Enjektör kirlenmesi"] },
        { name: "1.6 T-GDI 177 HP", fuelType: "Benzin", transmission: "DCT", score: 84, issues: ["Şanzıman aşırı ısınma uyarısı", "Kavrama ömrü"] }
    ],
    "Volkswagen": [
        { name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, issues: ["Kavrama titremesi (DSG)", "Mekatronik arızası"] },
        { name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, issues: ["Soğuk marşta titreme", "DSG mekatronik basınç tüpü"] },
        { name: "1.6 TDI 120 HP", fuelType: "Dizel", transmission: "DSG", score: 85, issues: ["EGR valfi arızası", "Su pompası sızıntısı", "Enjektör arızası"] },
        { name: "2.0 TDI 150 HP", fuelType: "Dizel", transmission: "DSG", score: 91, issues: ["DPF dolumu", "AdBlue sistemi sorunları"] }
    ],
    "Tesla": [
        { name: "RWD", fuelType: "Elektrik", transmission: "Tek Vites", score: 92, issues: ["Boya kalitesi problemleri", "Ekran donmaları", "Süspansiyon burçları"] },
        { name: "Long Range Dual Motor", fuelType: "Elektrik", transmission: "Tek Vites", score: 90, issues: ["Şarj kapağı sensörü", "Isı pompası arızası (Soğuk havada)"] },
        { name: "Performance", fuelType: "Elektrik", transmission: "Tek Vites", score: 88, issues: ["Lastik aşınması", "Fren diski eğrilmesi"] }
    ],
    "Chery": [
        { name: "1.6 TGDI 183 HP", fuelType: "Benzin", transmission: "7-DCT", score: 82, issues: ["Şanzıman kararsızlığı", "Yüksek yakıt tüketimi", "Yazılım hataları"] },
        { name: "PHEV Hibrit", fuelType: "Hibrit", transmission: "DHT", score: 85, issues: ["Batarya menzil tutarsızlığı", "Şarj uyumluluğu"] }
    ],
    "Togg": [
        { name: "V1 Standart Menzil", fuelType: "Elektrik", transmission: "Tek Vites", score: 87, issues: ["Ekran arayüzü donmaları", "Mobil uygulama senkronizasyonu", "Şarj istasyonu tanıma hataları"] },
        { name: "V2 Uzun Menzil", fuelType: "Elektrik", transmission: "Tek Vites", score: 88, issues: ["Yazılımsal hatalar", "Kamera sensör buğulanması"] }
    ],
    "Honda": [
        { name: "1.5 VTEC Turbo 182 HP", fuelType: "Benzin", transmission: "CVT", score: 94, issues: ["Yağa benzin karışması (Bazı seriler)", "Direksiyon kutusu tıkırtısı"] },
        { name: "1.6 i-DTEC 120 HP", fuelType: "Dizel", transmission: "Otomatik", score: 93, issues: ["DPF dolumu", "Şanzıman yağı değişim hassasiyeti"] },
        { name: "1.5 e:HEV Hibrit", fuelType: "Hibrit", transmission: "e-CVT", score: 95, issues: ["Akü ömrü kısallığı", "Kış aylarında düşük yakıt verimliliği"] }
    ],
    "Peugeot": [
        { name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, issues: ["Triger kayışı parçalanması", "Yüksek yağ tüketimi", "Vakum pompası tıkanması"] },
        { name: "1.5 BlueHDi 130 HP", fuelType: "Dizel", transmission: "EAT8", score: 82, issues: ["AdBlue deposu arızası", "EGR valfi tıkanması", "AdBlue pompası"] }
    ]
};

// Generic fallback mappings
const fallbackEngines = {
    "Benzin": { name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, issues: ["Yakıt pompası", "Ateşleme bobini"] },
    "Dizel": { name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, issues: ["DPF rejenerasyonu", "Enjektörler"] },
    "Hibrit": { name: "1.5 Hibrit", fuelType: "Hibrit", transmission: "Otomatik", score: 92, issues: ["Batarya performansı"] },
    "Elektrik": { name: "150 kW Elektrik", fuelType: "Elektrik", transmission: "Tek Vites", score: 90, issues: ["Şarj soketi arızası", "Menzil dalgalanması"] }
};

let output = `export interface EngineOption {
    id: string;
    name: string;
    fuelType: 'Benzin' | 'Dizel' | 'Elektrik' | 'Hibrit';
    transmission: string;
    score: number;
    issues: string[];
}

export interface VehicleEngineData {
    vehicleId: number;
    engines: EngineOption[];
}

// Helper to generate IDs
const generateId = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

export const engineDNAData: VehicleEngineData[] = [\n`;

vehicles.forEach(v => {
    // Determine which brands to copy
    let engines = [];
    if (engineDB[v.brand]) {
        engines = engineDB[v.brand];
    } else if (["Citroen", "Opel"].includes(v.brand)) {
        engines = engineDB["Peugeot"]; // PSA Group
    } else if (["Skoda", "Seat", "Audi"].includes(v.brand)) {
        engines = engineDB["Volkswagen"]; // VAG Group
    } else if (v.brand === "Dacia") {
        engines = engineDB["Renault"]; // Renault Group
    } else if (v.brand === "Kia") {
        engines = engineDB["Hyundai"]; // Hyundai-Kia Group
    } else {
        // Fallbacks
        engines = [fallbackEngines["Benzin"], fallbackEngines["Dizel"]];
    }

    // specific rules for pure EVs
    if (v.brand === "Tesla" || v.brand === "Togg") {
        engines = engineDB[v.brand];
    } else if (v.model.includes("Model Y")) {
        engines = engineDB["Tesla"];
    }

    let engineStr = `        engines: [\n`;
    engines.forEach(e => {
        engineStr += `            { id: "\${generateId(e.name)}", name: "${e.name}", fuelType: "${e.fuelType}", transmission: "${e.transmission}", score: ${e.score}, issues: ${JSON.stringify(e.issues)} },\n`;
    });
    engineStr += `        ]\n`;

    output += `    {
        vehicleId: ${v.id},
${engineStr}    },\n`;
});

output += `];\n`;

// Make sure output is clean for JS interpolation
output = output.replace(/\$\{generateId\((.*?)\)\}/g, (match, p1) => {
    return p1.replace(/["']/g, '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
});

fs.writeFileSync('data/engine-dna.ts', output, 'utf8');
console.log("Successfully wrote data/engine-dna.ts");
