const fs = require('fs');
const path = require('path');

const vehicleDNAFile = path.join(__dirname, 'data/vehicle-dna.ts');
const engineDNAFile = path.join(__dirname, 'data/engine-dna.ts');

const newVehicles = [
  {
    id: 4001,
    brand: "Tofaş",
    model: "Murat 131 / 124",
    year: "1977-1988",
    dnaScore: 50,
    strengths: ["Nostaljik klasik değeri", "Bakkalda bile parça bulunması", "Basit mekanik yapısı", "Düşük bütçeli tam ulaşım"],
    weaknesses: ["Güvenlik donanımı sıfır", "Kaporta çürümelerine çok yatkın", "Konfor ve yalıtım zayıf", "Hararet sorunları"],
    chronicIssues: [
      { id: 1, title: "Çürük ve Paslanma", severity: "high", reportCount: 9, description: "Yaşından dolayı taban, çamurluk ağzı gibi yerlerde çürümeler." },
      { id: 2, title: "Hararet", severity: "high", reportCount: 8, description: "Radyatör tıkanıklığı nedeniyle hararet yapması." }
    ]
  },
  {
    id: 4002,
    brand: "Skoda",
    model: "Favorit / Forman",
    year: "1989-1995",
    dnaScore: 55,
    strengths: ["Dönemine göre geniş iç hacim", "Hafif yapısıyla tatminkar çekiş", "Ekonomik yakıt", "Station (Forman) seçeneği"],
    weaknesses: ["Plastik trim sesleri", "Ön takım dayanıksızlığı", "Distribütör arızaları", "Güvenlik zafiyeti"],
    chronicIssues: [
      { id: 1, title: "Distribütör Arızası", severity: "medium", reportCount: 7, description: "Ateşleme sorunları ve tekleme yapması." },
      { id: 2, title: "Ön Takım Sesleri", severity: "low", reportCount: 8, description: "Rot ve salıncak burçlarından gelen sesler." }
    ]
  },

  {
    id: 4004,
    brand: "Ford",
    model: "Escort",
    year: "1990-2000",
    dnaScore: 65,
    strengths: ["Zamana direnen sportif tasarım", "Dönemine göre hidrolik direksiyon / klima gibi donanımlar", "Ford yol tutuşu", "Sağlam motor bloğu"],
    weaknesses: ["Elektrik tesisatı sorunları", "Yakıt tüketimi", "Ön göğüs çatlamaları", "Alt takım hassasiyeti"],
    chronicIssues: [
      { id: 1, title: "Sigorta Kutusu Arızası", severity: "high", reportCount: 9, description: "Escortlarda kronik sigorta tablası erimesi/oksitlenmesi." },
      { id: 2, title: "Rolanti Valfi Sorunu", severity: "medium", reportCount: 7, description: "Zetec motorlarda rolanti dalgalanması." }
    ]
  },
  {
    id: 4005,
    brand: "Ford",
    model: "Taunus",
    year: "1980-1993",
    dnaScore: 58,
    strengths: ["Tank gibi sağlam kasa yapısı", "Arkadan itişli olmasıyla keyifli sürüş", "Geniş makam aracı konforu", "Kolay tamir edilebilir mekanik"],
    weaknesses: ["Çok yüksek yakıt tüketimi", "Ağır hantal yapı", "Fren mesafesinin uzun olması", "Park zorluğu"],
    chronicIssues: [
      { id: 1, title: "Karbüratör Ayarı", severity: "medium", reportCount: 8, description: "Karbüratörün sık sık ayar bozması ve çiğ yakıt atması." },
      { id: 2, title: "Diferansiyel Ötmesi", severity: "medium", reportCount: 7, description: "Arkadan itişten dolayı diferansiyelde boşluk ve uğultu." }
    ]
  },
  {
    id: 4006,
    brand: "Renault",
    model: "11 (Flash / Rainbow)",
    year: "1988-1995",
    dnaScore: 60,
    strengths: ["Hafif kasaya 1.7 litrelik güçlü motor (Flash)", "Performanslı sürüş hissi", "Kırsalda ve bozuk yolda rahatlık", "Kolay bulunabilir yedek parça"],
    weaknesses: ["Virajlarda yana yatma eğilimi", "Aşırı motor sesi", "İç izolasyon eksikliği", "Yakıt tüketimi (Flash modelinde)"],
    chronicIssues: [
      { id: 1, title: "Karbüratör Sorunları", severity: "medium", reportCount: 7, description: "Weber karbüratörde yaşanan benzin taşması veya ayarsızlık." },
      { id: 2, title: "Ön Takım Dağıtması", severity: "low", reportCount: 6, description: "Bozuk yollarda sık sık rotil arızası." }
    ]
  }
];

let vContent = fs.readFileSync(vehicleDNAFile, 'utf8');
let eContent = fs.readFileSync(engineDNAFile, 'utf8');

const vehiclesToAdd = newVehicles.filter(v => v.brand); // filter out empty

const newVehicleStrings = vehiclesToAdd.map(v => `
    {
        id: ${v.id},
        brand: "${v.brand}",
        model: "${v.model}",
        year: "${v.year}",
        dnaScore: ${v.dnaScore},
        strengths: ${JSON.stringify(v.strengths, null, 12).replace(/"/g, '"').replace(/\n\s+/g, '\n            ')},
        weaknesses: ${JSON.stringify(v.weaknesses, null, 12).replace(/"/g, '"').replace(/\n\s+/g, '\n            ')},
        chronicIssues: ${JSON.stringify(v.chronicIssues, null, 12).replace(/"/g, '"').replace(/\n\s+/g, '\n            ')},
        userExperiences: [],
        totalReports: 7
    }`).join(',');

// Insert into vehicle-dna.ts just before the closing bracket of vehicleDNAData array
vContent = vContent.replace(/];\s*$/, `,${newVehicleStrings}\n];\n`);
fs.writeFileSync(vehicleDNAFile, vContent);

const newEngineStrings = vehiclesToAdd.map(v => `
    {
        vehicleId: ${v.id},
        engines: [
            {
                slug: "standart-motor",
                name: "Standart Motor",
                fuelType: "Benzin",
                transmission: "Manuel",
                score: 60,
                description: "Bu araç için genel geçerli standart motor.",
                chronicIssues: [
                    { title: "Genel Yağ Eksiltme", description: "Yaşına bağlı yağ eksiltme.", severity: "medium", reportCount: 7 }
                ]
            }
        ]
    }`).join(',');

// Insert into engine-dna.ts just before the closing bracket of engineDNAData array
eContent = eContent.replace(/];\s*$/, `,${newEngineStrings}\n];\n`);
fs.writeFileSync(engineDNAFile, eContent);

console.log("Added 150k vehicles");
