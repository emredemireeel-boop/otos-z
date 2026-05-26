const fs = require('fs');
const path = require('path');

const signsDir = path.join(__dirname, '../public/signs');
const dataFile = path.join(__dirname, '../data/trafik_isaretleri.json');

const newSvgs = {
  'TT-40': '<?xml version="1.0" encoding="utf-8"?>\\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="100" fill="#003e8d" stroke="#ef2028" stroke-width="24" /><path d="M 50,50 L 190,190" stroke="#ef2028" stroke-width="24" stroke-linecap="round" /></svg>',
  'TT-41': '<?xml version="1.0" encoding="utf-8"?>\\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="100" fill="#003e8d" stroke="#ef2028" stroke-width="24" /><path d="M 50,50 L 190,190 M 190,50 L 50,190" stroke="#ef2028" stroke-width="24" stroke-linecap="round" /></svg>',
  'TT-33': '<?xml version="1.0" encoding="utf-8"?>\\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="110" fill="#003e8d" /><path d="M 60,120 H 160 M 130,90 L 160,120 L 130,150" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" /></svg>',
  'TT-33a': '<?xml version="1.0" encoding="utf-8"?>\\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="110" fill="#003e8d" /><path d="M 180,120 H 80 M 110,90 L 80,120 L 110,150" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" /></svg>',
  'B-11': '<?xml version="1.0" encoding="utf-8"?>\\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect x="10" y="10" width="220" height="220" rx="20" fill="#003e8d" /><path d="M 120,40 L 200,180 H 40 Z" fill="#fff" /><path d="M 110,130 L 100,160 M 110,130 L 120,160 M 110,130 V 100 M 110,100 L 90,110 M 110,100 L 130,110" fill="none" stroke="#000" stroke-width="10" stroke-linecap="round" /><circle cx="110" cy="80" r="10" fill="#000" /><path d="M 70,170 H 150 M 60,180 H 160" stroke="#000" stroke-width="8" /></svg>'
};

for (const [id, svg] of Object.entries(newSvgs)) {
  fs.writeFileSync(path.join(signsDir, id + '.svg'), svg);
  console.log('Created ' + id + '.svg');
}

// Update JSON
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// Add to trafik_tanzim
const tanzimCat = data.categories.find(c => c.id === 'trafik_tanzim');
if (tanzimCat) {
  tanzimCat.signs.push(
    { "id": "TT-40", "name": "Park Yasaktır", "image": "/signs/TT-40.svg", "description": "Tabelanın bulunduğu yere park etmenin yasak olduğunu bildirir. Ancak yolcu indirme/bindirme gibi kısa süreli duraklamalara izin verilir." },
    { "id": "TT-41", "name": "Duraklamak ve Park Etmek Yasaktır", "image": "/signs/TT-41.svg", "description": "Tabelanın bulunduğu yerde her türlü duraklama (yolcu indirme/bindirme dahi) ve park etmenin kesinlikle yasak olduğunu bildirir." },
    { "id": "TT-33", "name": "Sağa Mecburi Yön", "image": "/signs/TT-33.svg", "description": "Kavşakta araçların sadece sağa dönebileceğini bildirir." },
    { "id": "TT-33a", "name": "Sola Mecburi Yön", "image": "/signs/TT-33a.svg", "description": "Kavşakta araçların sadece sola dönebileceğini bildirir." }
  );
}

// Add to bilgi_isaretleri
const bilgiCat = data.categories.find(c => c.id === 'bilgi_isaretleri');
if (bilgiCat) {
  bilgiCat.signs.push(
    { "id": "B-11", "name": "Yaya Geçidi", "image": "/signs/B-11.svg", "description": "Yayaların karşıdan karşıya geçebilmesi için ayrılmış alanı gösterir. Sürücüler yavaşlamalı ve yayalara ilk geçiş hakkını vermelidir." }
  );
}

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
console.log('Added 5 new signs to JSON!');
