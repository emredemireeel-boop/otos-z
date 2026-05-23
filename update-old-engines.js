const fs = require('fs');
const path = require('path');

const engineDNAFile = path.join(__dirname, 'data/engine-dna.ts');
let eContent = fs.readFileSync(engineDNAFile, 'utf8');

// I will parse the engineDNAData array, find the ones with vehicleId 4001, 4002, 4004, 4005, 4006
// and replace their engines. 

const detailedEngines = {
    4001: [
        {
            slug: "1-3-ohv-benzin-manuel",
            name: "1.3 OHV 65 HP",
            fuelType: "Benzin",
            transmission: "Manuel",
            score: 55,
            description: "Murat 131'in en yaygın, en eski tip 1300 motoru. LPG ile tam uyumlu ama hararet sorunu yaygındır.",
            pros: ["Parçası bakkalda bile var", "LPG uyumu tam"],
            cons: ["Düşük performans", "Yüksek devirde ses"],
            chronicIssues: [
                { title: "Hararet (Conta Yakma)", description: "Yaz aylarında sıkışık trafikte radyatör suyu kaynatması.", severity: "high", reportCount: 9 },
                { title: "Yağ Yakma", description: "Sekman aşınmasından dolayı mavi duman atma.", severity: "medium", reportCount: 8 }
            ]
        },
        {
            slug: "1-6-ohv-benzin-manuel",
            name: "1.6 OHV 75 HP (Şahin Serisi)",
            fuelType: "Benzin",
            transmission: "Manuel",
            score: 60,
            description: "Daha çok çekiş isteyenlerin tercih ettiği, Tofaş'ın efsanevi 1.6 motor bloğu.",
            pros: ["Çekişi iyi", "Tamiri çok basit"],
            cons: ["Yakıt tüketimi 1.3'e göre fazla", "Subap ayarı sık bozulur"],
            chronicIssues: [
                { title: "Karbüratör Ayarsızlığı", description: "Rölanti dalgalanması ve çiğ yakıt atma sorunu.", severity: "high", reportCount: 8 },
                { title: "Distribütör Platin/Meksefe Arızası", description: "Eski tip ateşleme sisteminde sık parça değişimi.", severity: "medium", reportCount: 7 }
            ]
        }
    ],
    4002: [
        {
            slug: "1-3-karburatorlu-benzin-manuel",
            name: "1.3 Karbüratörlü 58 HP",
            fuelType: "Benzin",
            transmission: "Manuel",
            score: 60,
            description: "Skoda'nın Favorit serisindeki klasik, arkadan itişli motorlardan devşirme sağlam ama narin 1.3 motoru.",
            pros: ["Triger zincirlidir (kayış kopma derdi yok)", "Yakıtı ekonomiktir"],
            cons: ["Hararet yapmaya çok yatkın", "Performans düşük"],
            chronicIssues: [
                { title: "Silindir Kapak Contası Yakma", description: "Motor bloğu alüminyum olduğu için hararete dayanamaz, contayı hemen yakar.", severity: "high", reportCount: 9 },
                { title: "Distribütör Terlemesi", description: "Islak havalarda su alıp aracın çalışmaması.", severity: "high", reportCount: 8 }
            ]
        }
    ],
    4004: [
        {
            slug: "1-6-zetec-efi-16v-benzin-manuel",
            name: "1.6 Zetec 16V 90 HP",
            fuelType: "Benzin",
            transmission: "Manuel",
            score: 75,
            description: "Escort CLX serisinde kullanılan, dönemine göre oldukça teknolojik ve performanslı motor.",
            pros: ["Sessiz çalışma", "İyi hızlanma ve esneklik"],
            cons: ["Rolanti valfi problemleri", "Yağ seçiciliği"],
            chronicIssues: [
                { title: "Rolanti Motoru (Valfi) Kirlenmesi", description: "Işıklarda dururken veya boşa atınca devrin düşüp stop etmesi.", severity: "high", reportCount: 9 },
                { title: "Sigorta Tablası Arızası", description: "Direkt motor sorunu olmasa da fanı açmadığı için hararete yol açar.", severity: "high", reportCount: 8 }
            ]
        },
        {
            slug: "1-4-cl-karburatorlu-benzin-manuel",
            name: "1.4 CL 71 HP",
            fuelType: "Benzin",
            transmission: "Manuel",
            score: 60,
            description: "Escort'un daha alt donanım paketlerinde kullanılan eski nesil CVH motor.",
            pros: ["Zetec'e göre tamiri daha kolay", "Parça ucuzluğu"],
            cons: ["Zayıf performans", "Yüksek devirde titreme"],
            chronicIssues: [
                { title: "Karbüratör Kep Sorunları", description: "LPG montajından sonra hava alması ve tekleme.", severity: "medium", reportCount: 7 }
            ]
        }
    ],
    4005: [
        {
            slug: "1-6-ohc-pinto-benzin-manuel",
            name: "1.6 OHC Pinto 73 HP",
            fuelType: "Benzin",
            transmission: "Manuel",
            score: 55,
            description: "Ford Taunus GTS ve GL modellerinde kullanılan, çok sağlam ama ağır kasaya zayıf gelen motor.",
            pros: ["Milyon kilometre devirebilir", "Sağlam döküm blok"],
            cons: ["Ağır kasaya yetmiyor", "Aşırı yakıt tüketimi"],
            chronicIssues: [
                { title: "Eksantrik Aşınması", description: "Yağlamanın yetersiz kaldığı durumlarda eksantrik milinin çizilmesi.", severity: "medium", reportCount: 7 },
                { title: "Karbüratör Çekişten Düşme", description: "Weber karbüratörde jikle kelebeğinin takılı kalması.", severity: "medium", reportCount: 6 }
            ]
        },
        {
            slug: "2-0-ohc-benzin-manuel",
            name: "2.0 OHC 101 HP",
            fuelType: "Benzin",
            transmission: "Manuel",
            score: 65,
            description: "Taunus GTS/Ghia modellerinin efsaneleşen performanslı motoru.",
            pros: ["Torku çok yüksek", "Kasayı çok rahat kaldırıyor"],
            cons: ["Şehir içi 12-14 litre civarı tüketim", "Sesli çalışma"],
            chronicIssues: [
                { title: "Motor Takozu Kopartma", description: "Torktan dolayı takozların sık eskiyip kopması.", severity: "low", reportCount: 7 }
            ]
        }
    ],
    4006: [
        {
            slug: "1-7-tx-flash-benzin-manuel",
            name: "1.7 TX 90 HP (Flash)",
            fuelType: "Benzin",
            transmission: "Manuel",
            score: 70,
            description: "Renault 11 Flash efsanesini yaratan 1721 cc hacmindeki torklu Fransız motoru.",
            pros: ["Işıklarda güncel araçlara kök söktürür", "Mükemmel hızlanma"],
            cons: ["Karbüratör derdi bitmez", "Motor ısısı çok yüksek"],
            chronicIssues: [
                { title: "Karbüratör Benzin Taşması (Weber)", description: "Karbüratörün manifolt üzerine benzin sızdırması ve yangın riski.", severity: "high", reportCount: 9 },
                { title: "Ateşleme Modülü (Beyni) Yanması", description: "Motor içi sıcaktan dolayı ateşleme beyninin aniden bozulması.", severity: "high", reportCount: 8 }
            ]
        },
        {
            slug: "1-4-rainbow-benzin-manuel",
            name: "1.4 Rainbow 72 HP",
            fuelType: "Benzin",
            transmission: "Manuel",
            score: 65,
            description: "Flash'ın performansından ödün verip ekonomiye odaklanan Broadway motorlu versiyon.",
            pros: ["Flash'a göre yakıtı az", "Masrafsız"],
            cons: ["Çekiş zayıf", "Görünümü Flash gibi sportif değil"],
            chronicIssues: [
                { title: "Subap Ayarı Ses Yapması", description: "Şıkırtılı çalışma ve sık subap ayarı istemesi.", severity: "low", reportCount: 7 }
            ]
        }
    ]
};

// Instead of doing AST parsing, since the file is large and generated predictably, 
// I will just use regex to replace the specific blocks.
Object.keys(detailedEngines).forEach(vid => {
    const replacementEngines = detailedEngines[vid];
    const enginesStr = JSON.stringify(replacementEngines, null, 12).replace(/"/g, '"').replace(/\n/g, '\n            ');
    
    // The previous generation had:
    /*
    {
        vehicleId: 4001,
        engines: [
            {
                slug: "standart-motor",
                ...
                ]
            }
        ]
    }
    */
    // We will match regex: `vehicleId:\s*${vid},\s*engines:\s*\[[\s\S]*?(?=\}\s*,\s*\{\s*vehicleId|\}\s*\]\s*;)`
    // Actually simpler: Just string replace
    
    const regex = new RegExp('vehicleId:\\\\s*' + vid + ',\\\\s*engines:\\\\s*\\\\[[\\\\s\\\\S]*?\\\\n\\\\s*\\\\}\\\\s*\\\\]\\\\s*\\\\}', 'g');
    eContent = eContent.replace(regex, 'vehicleId: ' + vid + ',\n        engines: ' + enginesStr + '\n    }');
});

fs.writeFileSync(engineDNAFile, eContent);
console.log("Engines updated for old cars.");
