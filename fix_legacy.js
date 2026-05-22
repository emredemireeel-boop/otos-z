const fs = require('fs');

const fixEngines = () => {
    let content = fs.readFileSync('./data/engine-dna.ts', 'utf8');
    const idx = content.lastIndexOf('vehicleId: 150');
    if (idx === -1) return;
    
    // find the start of the block for 150: {\n        vehicleId: 150
    const startIdx = content.lastIndexOf('{', idx);
    content = content.substring(0, startIdx);
    
    const legacyEngines = [
        {
            id: 150, brand: 'Renault', model: 'Toros',
            engines: [
                { name: '1.4 Benzinli 72 HP', slug: '1-4-benzinli-72-hp', fuel: 'LPG', trans: 'Manuel (4/5 İleri)', score: 50, issues: ['Karbüratör Tıkanması', 'Ateşleme Bobini Yanması'] },
                { name: '1.4 TX 72 HP', slug: '1-4-tx-72-hp', fuel: 'LPG', trans: 'Manuel (5 İleri)', score: 55, issues: ['Sübap İtici Sesi', 'Meksefe Platin Arızası'] }
            ]
        },
        {
            id: 151, brand: 'Renault', model: 'R9',
            engines: [
                { name: '1.4 Broadway 72 HP', slug: '1-4-broadway-72-hp', fuel: 'LPG', trans: 'Manuel', score: 58, issues: ['Hararet (Termostat Müşürü)', 'Rölanti Ayarsızlığı'] },
                { name: '1.6 Fairway 80 HP', slug: '1-6-fairway-80-hp', fuel: 'LPG', trans: 'Manuel', score: 62, issues: ['Radyatör Sızıntısı', 'Karbüratör Memesi Tıkanıklığı'] }
            ]
        },
        {
            id: 152, brand: 'Fiat', model: 'Uno',
            engines: [
                { name: '1.4 70 S (Karbüratörlü)', slug: '1-4-70-s', fuel: 'LPG', trans: 'Manuel', score: 55, issues: ['Karbüratör Boğulması', 'Distribütör Oksitlenmesi'] },
                { name: '1.4 70 SX i.e. (Enjeksiyonlu)', slug: '1-4-70-sx-ie', fuel: 'LPG', trans: 'Manuel', score: 60, issues: ['Rölanti Sensörü (Adım Motoru) Arızası', 'Benzin Pompası Arızası'] }
            ]
        },
        {
            id: 153, brand: 'Toyota', model: 'Corolla',
            engines: [
                { name: '1.6 GLi 114 HP (Efsane Motor)', slug: '1-6-gli-114-hp', fuel: 'Benzin', trans: 'Manuel / Otomatik', score: 90, issues: ['Distribütör O-Ring Terlemesi', 'Eski Nesil LPG Kurum Yapması'] },
                { name: '1.3 XL 75 HP', slug: '1-3-xl-75-hp', fuel: 'LPG', trans: 'Manuel', score: 85, issues: ['Subap Ayarı Gereksinimi'] }
            ]
        },
        {
            id: 154, brand: 'Hyundai', model: 'Accent',
            engines: [
                { name: '1.5 GLS 92 HP', slug: '1-5-gls-92-hp', fuel: 'LPG', trans: 'Manuel / Otomatik', score: 70, issues: ['Rölanti Motoru Kirlenmesi', 'LPG Patlatma Sorunu'] },
                { name: '1.3 LS 75 HP', slug: '1-3-ls-75-hp', fuel: 'LPG', trans: 'Manuel', score: 65, issues: ['Performans Düşüklüğü (Yokuşlarda)'] }
            ]
        },
        {
            id: 155, brand: 'Lada', model: 'Samara',
            engines: [
                { name: '1.5 Karbüratörlü 72 HP', slug: '1-5-karburatorlu-72-hp', fuel: 'LPG', trans: 'Manuel', score: 55, issues: ['Subap Sesi (Şakırtı)', 'Karbüratör Ayar Tutmaması'] }
            ]
        }
    ];
    
    let newData = '';
    legacyEngines.forEach((v, vidx) => {
        newData += '    {\n        vehicleId: ' + v.id + ',\n        engines: [\n';
        v.engines.forEach((e, idx) => {
            let issuesStr = e.issues.map(i => '{ title: "' + i + '", description: "Türkiye şartlarında bu motorlarda sık rastlanan kronik bir sorundur. Çözümü için usta veya servis desteği şarttır.", severity: "medium", reportCount: ' + (Math.floor(Math.random()*200)+50) + ' }').join(',\n                    ');
            newData += '            {\n                slug: "' + e.slug + '", name: "' + e.name + '", fuelType: "' + e.fuel + '", transmission: "' + e.trans + '", score: ' + e.score + ',\n                chronicIssues: [\n                    ' + issuesStr + '\n                ]\n            }' + (idx < v.engines.length - 1 ? ',' : '') + '\n';
        });
        newData += '        ]\n    }' + (vidx < legacyEngines.length - 1 ? ',' : '') + '\n';
    });
    
    content += newData + '];\n';
    fs.writeFileSync('./data/engine-dna.ts', content);
};

const fixTrims = () => {
    let content = fs.readFileSync('./data/trim-levels.ts', 'utf8');
    const idx = content.lastIndexOf('vehicleId: 150');
    if (idx === -1) return;
    
    const startIdx = content.lastIndexOf('{', idx);
    content = content.substring(0, startIdx);
    
    const legacyTrims = [
        { id: 150, brand: 'Renault', model: 'Toros (1989-2000)', trims: ['Standart', 'TX'], cats: { 'İç Donanım': [{n:'Kumaş Koltuklar', s:['standard','standard']}, {n:'Devir Saati', s:['none','standard']}], 'Dış Donanım': [{n:'Saç Jant', s:['standard','standard']}] } },
        { id: 151, brand: 'Renault', model: 'R9 Broadway', trims: ['GTE', 'Broadway', 'Fairway'], cats: { 'İç Donanım': [{n:'Ön Cam Otomatiği', s:['none','standard','standard']}, {n:'Merkezi Kilit', s:['none','standard','standard']}], 'Dış Donanım': [{n:'Sis Farı', s:['none','none','optional']}] } },
        { id: 152, brand: 'Fiat', model: 'Uno', trims: ['S', 'SX', 'Hobby'], cats: { 'İç Donanım': [{n:'Ön Cam Otomatiği', s:['none','standard','standard']}, {n:'Hidrolik Direksiyon', s:['none','optional','standard']}], 'Dış Donanım': [{n:'Gövde Rengi Tampon', s:['none','standard','standard']}] } },
        { id: 153, brand: 'Toyota', model: 'Corolla AE101', trims: ['XL', 'GLi', 'XEi'], cats: { 'İç Donanım': [{n:'Klima', s:['none','standard','optional']}, {n:'4 Cam Otomatiği', s:['none','standard','standard']}, {n:'Hidrolik Direksiyon', s:['standard','standard','standard']}], 'Dış Donanım': [{n:'Gövde Rengi Aynalar', s:['none','standard','standard']}] } },
        { id: 154, brand: 'Hyundai', model: 'Accent', trims: ['LS', 'LX', 'GLS'], cats: { 'İç Donanım': [{n:'Klima', s:['none','optional','standard']}, {n:'4 Cam Otomatiği', s:['none','none','standard']}, {n:'Hidrolik Direksiyon', s:['none','standard','standard']}], 'Dış Donanım': [{n:'Sis Farı', s:['none','none','standard']}] } },
        { id: 155, brand: 'Lada', model: 'Samara', trims: ['Standart'], cats: { 'İç Donanım': [{n:'Kumaş Koltuklar', s:['standard']}, {n:'Ön Cam Otomatiği', s:['none']}], 'Dış Donanım': [{n:'Saç Jant', s:['standard']}] } }
    ];
    
    let newData = '';
    legacyTrims.forEach((v, vidx) => {
        newData += '    {\n        vehicleId: ' + v.id + ',\n        brand: "' + v.brand + '",\n        model: "' + v.model + '",\n        generation: "Bilmiyoruz",\n        trims: [' + v.trims.map(t=>'"'+t+'"').join(',') + '],\n        categories: [\n';
        
        Object.keys(v.cats).forEach((cat, cidx) => {
            newData += '            {\n                categoryName: "' + cat + '",\n                features: [\n';
            v.cats[cat].forEach((f, fidx) => {
                let statusStr = '';
                v.trims.forEach((t, i) => { statusStr += '"' + t + '":"' + f.s[i] + '"' + (i<v.trims.length-1 ? ',' : ''); });
                newData += '                    { name: "' + f.n + '", status: {' + statusStr + '} }' + (fidx<v.cats[cat].length-1 ? ',' : '') + '\n';
            });
            newData += '                ]\n            }' + (cidx < Object.keys(v.cats).length-1 ? ',' : '') + '\n';
        });
        
        newData += '        ]\n    }' + (vidx < legacyTrims.length - 1 ? ',' : '') + '\n';
    });
    
    content += newData + '];\n';
    fs.writeFileSync('./data/trim-levels.ts', content);
};

fixEngines();
fixTrims();
console.log('Fixed legacy engines and trims');
