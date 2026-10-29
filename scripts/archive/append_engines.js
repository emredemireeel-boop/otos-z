const fs = require('fs');

const vContent = fs.readFileSync('./data/vehicle-dna.ts', 'utf8');

const vehicles = [];
const vRegex = /id:\s*(\d+)\s*,\s*brand:\s*"(.*?)"\s*,\s*model:\s*"(.*?)"/g;
let match;
while ((match = vRegex.exec(vContent)) !== null) {
    vehicles.push({
        id: parseInt(match[1]),
        brand: match[2],
        model: match[3]
    });
}

const eContent = fs.readFileSync('./data/engine-dna.ts', 'utf8');
const eIds = [...eContent.matchAll(/vehicleId:\s*(\d+)/g)].map(m => parseInt(m[1]));

const missingEngines = vehicles.filter(v => !eIds.includes(v.id));

const engineDB = {
    "Renault": [
        { name: "1.0 TCe 90 HP", fuelType: "Benzin", transmission: "Manuel / X-Tronic", score: 85, issues: ["Erken debriyaj aşınması", "Turbo valfi sesi"] },
        { name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel / EDC", score: 92, issues: ["EGR valfi tıkanıklığı", "Partikül filtresi dolumu"] }
    ],
    "Fiat": [
        { name: "1.4 Fire 95 HP", fuelType: "Benzin", transmission: "Manuel", score: 90, issues: ["Yüksek yağ tüketimi", "Performans eksikliği"] },
        { name: "1.3 Multijet 95 HP", fuelType: "Dizel", transmission: "Manuel", score: 95, issues: ["EGR tıkanması", "Baskı balata ömrü"] }
    ],
    "Toyota": [
        { name: "1.5 Dynamic Force 125 HP", fuelType: "Benzin", transmission: "Multidrive S", score: 94, issues: ["CVT şanzıman ısınması", "Yüksek devirde ses"] },
        { name: "1.8 Hybrid 122 HP", fuelType: "Hibrit", transmission: "e-CVT", score: 98, issues: ["Batarya kapasite düşüşü (Uzun vadede)"] }
    ],
    "Hyundai": [
        { name: "1.4 MPI 100 HP", fuelType: "Benzin", transmission: "Manuel / Otomatik", score: 93, issues: ["Katalitik konvertör hassasiyeti"] },
        { name: "1.0 T-GDI 100 HP", fuelType: "Benzin", transmission: "DCT", score: 86, issues: ["Kuru tip DCT kavrama titremesi"] }
    ],
    "Volkswagen": [
        { name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, issues: ["Kavrama titremesi (DSG)"] },
        { name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, issues: ["Soğuk marşta titreme"] }
    ],
    "Tesla": [
        { name: "Long Range Dual Motor", fuelType: "Elektrik", transmission: "Tek Vites", score: 90, issues: ["Şarj kapağı sensörü", "Isı pompası arızası (Soğuk havada)"] }
    ],
    "Chery": [
        { name: "1.6 TGDI 183 HP", fuelType: "Benzin", transmission: "7-DCT", score: 82, issues: ["Şanzıman kararsızlığı", "Yüksek yakıt tüketimi"] }
    ],
    "Togg": [
        { name: "V1 Standart Menzil", fuelType: "Elektrik", transmission: "Tek Vites", score: 87, issues: ["Ekran arayüzü donmaları"] }
    ],
    "Honda": [
        { name: "1.5 VTEC Turbo 182 HP", fuelType: "Benzin", transmission: "CVT", score: 94, issues: ["Direksiyon kutusu tıkırtısı"] }
    ],
    "Peugeot": [
        { name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, issues: ["Triger kayışı parçalanması", "Yüksek yağ tüketimi"] }
    ],
    "BMW": [
        { name: "1.6 N13 136/170 HP", fuelType: "Benzin", transmission: "ZF 8 İleri", score: 82, issues: ["Tahrik uyarısı (Buji/Bobin)", "Soğutma suyu eksiltme"] },
        { name: "2.0 B48 184 HP", fuelType: "Benzin", transmission: "ZF 8 İleri", score: 89, issues: ["Su pompası arızası"] }
    ],
    "Mercedes-Benz": [
        { name: "1.6 M274 156 HP", fuelType: "Benzin", transmission: "7G-Tronic / 9G-Tronic", score: 84, issues: ["Termostat arızası", "Egzantrik dişlisi sesi"] }
    ],
    "Nissan": [
        { name: "1.2 DIG-T 115 HP", fuelType: "Benzin", transmission: "X-Tronic", score: 78, issues: ["Aşırı yağ eksiltme", "Motor revizyon ihtiyacı (Sekman kırma)"] },
        { name: "1.5 dCi 110 HP", fuelType: "Dizel", transmission: "Manuel", score: 90, issues: ["Partikül filtresi tıkanması"] }
    ],
    "Kia": [
        { name: "1.6 T-GDI 150 HP", fuelType: "Benzin", transmission: "DCT", score: 85, issues: ["DCT ısınması", "Kavrama bitmesi"] }
    ],
    "Opel": [
        { name: "1.4 T 150 HP", fuelType: "Benzin", transmission: "Otomatik", score: 82, issues: ["Sekman kırma", "Piston çatlatma"] },
        { name: "1.6 CDTI 136 HP", fuelType: "Dizel", transmission: "Otomatik", score: 85, issues: ["Zincir sesi"] }
    ],
    "Citroen": [
        { name: "1.2 PureTech 130 HP", fuelType: "Benzin", transmission: "EAT8", score: 80, issues: ["Triger kayışı döküntüsü", "Vakum pompası"] }
    ],
    "Skoda": [
        { name: "1.0 TSI 110 HP", fuelType: "Benzin", transmission: "DSG", score: 88, issues: ["DSG Kavrama", "Mekatronik"] },
        { name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, issues: ["DSG Kavrama", "ACT Sistem sarsıntısı"] }
    ],
    "Seat": [
        { name: "1.5 TSI 150 HP", fuelType: "Benzin", transmission: "DSG", score: 89, issues: ["Kavrama titremesi"] }
    ],
    "Audi": [
        { name: "2.0 TFSI 200/211 HP", fuelType: "Benzin", transmission: "S-Tronic", score: 75, issues: ["Aşırı yağ tüketimi", "Zincir atlama"] }
    ]
};

const fallbackEngines = {
    "Benzin": { name: "1.4 Benzinli", fuelType: "Benzin", transmission: "Otomatik", score: 85, issues: ["Ateşleme bobini"] },
    "Dizel": { name: "1.6 Dizel", fuelType: "Dizel", transmission: "Manuel", score: 88, issues: ["DPF rejenerasyonu"] }
};

const tofasEngines = {
    "Şahin": [
        { name: "1.6 Karbüratörlü 80 HP", fuelType: "LPG", transmission: "Manuel", score: 65, issues: ["Karbüratör Ayarsızlığı", "Yağ Yakma ve Üfleme"] },
        { name: "1.4 i.e. 71 HP", fuelType: "LPG", transmission: "Manuel", score: 68, issues: ["Rölanti Motoru Arızası"] },
        { name: "1.6 i.e. 96 HP", fuelType: "LPG", transmission: "Manuel", score: 70, issues: ["Rölanti Dalgalanması"] }
    ],
    "Doğan": [
        { name: "1.6 Karbüratörlü 80 HP", fuelType: "LPG", transmission: "Manuel", score: 65, issues: ["Karbüratör Ayarsızlığı"] },
        { name: "1.6 i.e. 96 HP", fuelType: "LPG", transmission: "Manuel", score: 70, issues: ["Rölanti Motoru ve Kelebek Sensörü"] }
    ],
    "Kartal": [
        { name: "1.6 Karbüratörlü 80 HP", fuelType: "LPG", transmission: "Manuel", score: 64, issues: ["Hararet (Ağır Yük)"] },
        { name: "1.6 i.e. 96 HP", fuelType: "LPG", transmission: "Manuel", score: 69, issues: ["Rölanti Dalgalanması"] }
    ],
    "Serçe": [
        { name: "1.3 Karbüratörlü 65 HP", fuelType: "LPG", transmission: "Manuel", score: 60, issues: ["Yağ Kaçakları"] }
    ]
};


const createSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

let newEnginesData = "";

missingEngines.forEach(vehicle => {
    let engines = [];
    if (vehicle.brand === "Tofaş") {
        if (vehicle.model.includes("Şahin")) engines = tofasEngines["Şahin"];
        else if (vehicle.model.includes("Doğan")) engines = tofasEngines["Doğan"];
        else if (vehicle.model.includes("Kartal")) engines = tofasEngines["Kartal"];
        else engines = tofasEngines["Serçe"];
    } else {
        engines = engineDB[vehicle.brand];
        if (!engines || engines.length === 0) {
            engines = [fallbackEngines["Benzin"], fallbackEngines["Dizel"]];
        }
    }
    
    let engineBlock = `    {\n        vehicleId: ${vehicle.id},\n        engines: [\n`;
    engines.forEach((e, idx) => {
        let chronicIssuesBlock = "";
        e.issues.forEach(i => {
            chronicIssuesBlock += `                    { title: "${i}", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: ${Math.floor(Math.random() * 300) + 50} },\n`;
        });
        
        engineBlock += `            { \n                slug: "${createSlug(e.name)}", name: "${e.name}", fuelType: "${e.fuelType}", transmission: "${e.transmission}", score: ${e.score}, \n                chronicIssues: [\n${chronicIssuesBlock.slice(0, -2)}\n                ] \n            }${idx < engines.length - 1 ? ',' : ''}\n`;
    });
    engineBlock += `        ]\n    },\n`;
    
    newEnginesData += engineBlock;
});

if (newEnginesData.length > 0) {
    const lastIndex = eContent.lastIndexOf('];');
    if (lastIndex !== -1) {
        let updatedEContent = eContent.substring(0, lastIndex) + newEnginesData + eContent.substring(lastIndex);
        fs.writeFileSync('./data/engine-dna.ts', updatedEContent);
        console.log('Added ' + missingEngines.length + ' engines.');
    } else {
        console.log('Could not find ];');
    }
} else {
    console.log('No missing engines.');
}
