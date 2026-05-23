const fs = require('fs');
const path = require('path');

// Replicate createSlug from vehicle-dna.ts
function createSlug(text) {
    if (!text) return '';
    const trMap = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
    };
    return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, m => trMap[m] || m)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function loadOtobutceCars() {
    const filePath = path.join(__dirname, '../data/otobutce-data.ts');
    const content = fs.readFileSync(filePath, 'utf8');
    
    let jsContent = content
        .replace(/export interface [^{]*{[^}]*}/g, '')
        .replace(/export const OTOBUTCE_CATEGORIES:[\s\S]*?=/, 'const OTOBUTCE_CATEGORIES =')
        .replace(/export/g, '');
    
    // Evaluate in a sandbox
    const sandbox = {};
    eval(jsContent + '\nmodule.exports = OTOBUTCE_CATEGORIES;');
    return module.exports;
}

function loadVehicleDNA() {
    const filePath = path.join(__dirname, '../data/vehicle-dna.ts');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract array starting from vehicleDNAData
    const startIndex = content.indexOf('export const vehicleDNAData');
    if (startIndex === -1) throw new Error('Could not find vehicleDNAData');
    
    const arrayStart = content.indexOf('[', startIndex);
    const fnStart = content.indexOf('export function', arrayStart);
    
    // The array ends at the last ']' before the export functions
    const arrayEnd = content.lastIndexOf(']', fnStart);
    
    const arrayString = content.substring(arrayStart, arrayEnd + 1);
    
    // Evaluate the array string
    let jsContent = 'const data = ' + arrayString + ';\nmodule.exports = data;';
    
    // Strip simple TS notations like `as 'low'` or Type assertions
    jsContent = jsContent
        .replace(/\s+as\s+['a-zA-Z]+/g, '')
        .replace(/: [a-zA-Z_]+/g, '');
        
    eval(jsContent);
    return module.exports;
}

try {
    const categories = loadOtobutceCars();
    const dnaVehicles = loadVehicleDNA();
    
    const otobutceCars = [];
    categories.forEach(cat => {
        cat.cars.forEach(car => {
            otobutceCars.push({
                marka: car.marka,
                model: car.model,
                yilAraligi: car.yilAraligi,
                yakitTipi: car.yakitTipi,
                sanziman: car.sanziman,
                aciklama: car.aciklama,
                ortalamaFiyat: car.ortalamaFiyat,
                category: cat.title
            });
        });
    });
    
    // Group by unique (markaSlug, modelSlug)
    const uniqueBudgetMap = new Map();
    otobutceCars.forEach(car => {
        const cBrandSlug = createSlug(car.marka);
        const cModelSlug = createSlug(car.model);
        const key = `${cBrandSlug}/${cModelSlug}`;
        if (!uniqueBudgetMap.has(key)) {
            uniqueBudgetMap.set(key, car);
        }
    });
    
    console.log(`Loaded ${otobutceCars.length} cars from Oto Butce, grouped into ${uniqueBudgetMap.size} unique vehicles.`);
    console.log(`Loaded ${dnaVehicles.length} vehicles from Vehicle DNA.`);
    
    const missing = [];
    const matched = [];
    
    for (const [key, car] of uniqueBudgetMap.entries()) {
        const cBrandSlug = createSlug(car.marka);
        const cModelSlug = createSlug(car.model);
        
        const found = dnaVehicles.find(v => {
            const vBrandSlug = createSlug(v.brand);
            const vModelSlug = createSlug(v.model);
            return vBrandSlug === cBrandSlug && vModelSlug === cModelSlug;
        });
        
        if (found) {
            matched.push({ car, dna: found });
        } else {
            missing.push(car);
        }
    }
    
    console.log(`\nUnique Matched: ${matched.length}`);
    console.log(`Unique Missing: ${missing.length}`);
    
    console.log('\n--- UNIQUE MISSING CARS ---');
    missing.forEach((c, idx) => {
        console.log(`${idx + 1}. ${c.marka} ${c.model} (${c.yilAraligi})`);
    });
    
} catch (err) {
    console.error('Error running analysis:', err);
}
