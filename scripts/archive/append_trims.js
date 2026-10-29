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

const tContent = fs.readFileSync('./data/trim-levels.ts', 'utf8');
const tIds = [...tContent.matchAll(/vehicleId:\s*(\d+)/g)].map(m => parseInt(m[1]));

const missingTrims = vehicles.filter(v => !tIds.includes(v.id));

let newTrimsData = "";

missingTrims.forEach(vehicle => {
    let trims = [];
    let features = {};
    
    if (vehicle.brand === "Tofaş") {
        if (vehicle.model.includes("Şahin")) {
            trims = ["1.6", "S", "1.6 i.e."];
            features = {
                "İç Donanım ve Konfor": [
                    { name: "Kumaş Koltuklar", s1: "standard", s2: "standard", s3: "standard", s4: "standard" },
                    { name: "Ön Cam Otomatiği", s1: "none", s2: "none", s3: "none", s4: "none" },
                    { name: "Hidrolik Direksiyon", s1: "none", s2: "optional", s3: "standard", s4: "standard" }
                ],
                "Dış Donanım": [
                    { name: "Çelik Jant", s1: "none", s2: "none", s3: "none", s4: "none" },
                    { name: "Sis Farı", s1: "none", s2: "none", s3: "none", s4: "none" }
                ]
            };
        } else if (vehicle.model.includes("Doğan")) {
            trims = ["L", "SL", "SLX", "SLX i.e."];
            features = {
                "İç Donanım ve Konfor": [
                    { name: "Ön Cam Otomatiği", s1: "standard", s2: "standard", s3: "standard", s4: "standard" },
                    { name: "Merkezi Kilit", s1: "standard", s2: "standard", s3: "standard", s4: "standard" },
                    { name: "Hidrolik Direksiyon", s1: "none", s2: "none", s3: "standard", s4: "standard" }
                ],
                "Dış Donanım": [
                    { name: "Çelik Jant", s1: "none", s2: "none", s3: "standard", s4: "standard" },
                    { name: "Sis Farı", s1: "none", s2: "standard", s3: "standard", s4: "standard" }
                ]
            };
        } else if (vehicle.model.includes("Kartal")) {
            trims = ["L", "SL", "SLX", "1.6 i.e."];
            features = {
                "İç Donanım ve Konfor": [
                    { name: "Ön Cam Otomatiği", s1: "none", s2: "standard", s3: "standard", s4: "standard" },
                    { name: "Geniş Bagaj Hacmi", s1: "standard", s2: "standard", s3: "standard", s4: "standard" }
                ],
                "Dış Donanım": [
                    { name: "Tavan Çıtası", s1: "standard", s2: "standard", s3: "standard", s4: "standard" },
                    { name: "Çelik Jant", s1: "none", s2: "none", s3: "standard", s4: "none" }
                ]
            };
        } else {
            trims = ["Standart"];
            features = {
                "İç Donanım ve Konfor": [
                    { name: "Kumaş Koltuklar", s1: "standard", s2: "standard", s3: "standard", s4: "standard" }
                ],
                "Dış Donanım": [
                    { name: "Yuvarlak Çift Far", s1: "standard", s2: "standard", s3: "standard", s4: "standard" }
                ]
            };
        }
    } else {
        const isPremium = ["BMW", "Mercedes-Benz", "Audi", "Tesla"].includes(vehicle.brand);
        trims = isPremium ? ["Standart", "Luxury / AMG / M Sport"] : ["Giriş (Joy/Easy)", "Orta (Touch/Urban)", "Üst (Icon/Lounge)"];
        features = isPremium ? {
            "Dış Donanım": [
                { name: "18 İnç Alaşımlı Jantlar", s1: "standard", s2: "standard", s3: "standard", s4: "standard" },
                { name: "LED Farlar", s1: "standard", s2: "standard", s3: "standard", s4: "standard" },
                { name: "Sunroof / Cam Tavan", s1: "optional", s2: "standard", s3: "standard", s4: "standard" }
            ],
            "İç Donanım": [
                { name: "Deri Koltuklar", s1: "optional", s2: "standard", s3: "standard", s4: "standard" },
                { name: "Elektrikli ve Hafızalı Koltuklar", s1: "optional", s2: "standard", s3: "standard", s4: "standard" }
            ]
        } : {
            "Dış Donanım": [
                { name: "Çelik Jant", s1: "none", s2: "standard", s3: "standard", s4: "standard" },
                { name: "Sis Farı", s1: "none", s2: "standard", s3: "standard", s4: "standard" }
            ],
            "İç Donanım": [
                { name: "Otomatik Klima", s1: "none", s2: "standard", s3: "standard", s4: "standard" },
                { name: "Geri Görüş Kamerası", s1: "none", s2: "standard", s3: "standard", s4: "standard" }
            ]
        };
    }
    
    let trimBlock = `    {\n        vehicleId: ${vehicle.id},\n        brand: "${vehicle.brand}",\n        model: "${vehicle.model}",\n        generation: "Bilmiyoruz",\n        trims: [${trims.map(t => '"'+t+'"').join(", ")}],\n        categories: [\n`;
    
    Object.keys(features).forEach((cat, idxCat) => {
        trimBlock += `            {\n                categoryName: "${cat}",\n                features: [\n`;
        features[cat].forEach((f, idxF) => {
            let statusObj = "";
            trims.forEach((t, i) => {
                let stat = i === 0 ? f.s1 : (i === 1 ? f.s2 : (i === 2 ? f.s3 : f.s4));
                statusObj += `"${t}":"${stat}"${i < trims.length-1 ? ',' : ''}`;
            });
            trimBlock += `                    { name: "${f.name}", status: {${statusObj}} }${idxF < features[cat].length - 1 ? ',' : ''}\n`;
        });
        trimBlock += `                ]\n            }${idxCat < Object.keys(features).length - 1 ? ',' : ''}\n`;
    });
    
    trimBlock += `        ]\n    },\n`;
    newTrimsData += trimBlock;
});

if (newTrimsData.length > 0) {
    // Find the last occurrence of ];
    const lastIndex = tContent.lastIndexOf('];');
    if (lastIndex !== -1) {
        let updatedTContent = tContent.substring(0, lastIndex) + newTrimsData + tContent.substring(lastIndex);
        fs.writeFileSync('./data/trim-levels.ts', updatedTContent);
        console.log('Added ' + missingTrims.length + ' trim levels.');
    } else {
        console.log('Could not find ];');
    }
} else {
    console.log('No missing trims.');
}
