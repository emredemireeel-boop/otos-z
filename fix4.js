const fs = require('fs');

let content = fs.readFileSync('data/otobutce-data.ts', 'utf8');

// There are corrupted bits like `}lamaFiyat: 1820000`
content = content.replace(/\}[a-zA-Z]+Fiyat:\s*\d+/g, '}');

// We have duplicates `      },\n      {\n        id: "c-0-2",`
// Let's just evaluate the file as JS. It will syntax error.
// We can use regex to extract everything.
let categories = [];
let catMatches = [...content.matchAll(/id:\s*"([\d-kK]+)",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*minPrice:\s*(\d+),\s*maxPrice:\s*(\d+),\s*seoTitle:\s*"([^"]+)",\s*seoDesc:\s*"([^"]+)",(?:[\s\S]*?introText:\s*`([^`]*)`,)?(?:[\s\S]*?tavsiyeText:\s*`([^`]*)`,)?\s*cars:\s*\[([\s\S]*?)\]\s*\}/g)];

for (const catMatch of catMatches) {
    const cat = {
        id: catMatch[1],
        slug: catMatch[2],
        title: catMatch[3],
        minPrice: Number(catMatch[4]),
        maxPrice: Number(catMatch[5]),
        seoTitle: catMatch[6],
        seoDesc: catMatch[7],
        introText: catMatch[8] || '',
        tavsiyeText: catMatch[9] || '',
        carsStr: catMatch[10]
    };
    
    // Parse cars
    const cars = [];
    const carRegex = /id:\s*"([^"]+)",\s*marka:\s*"([^"]*)",\s*model:\s*"([^"]*)",\s*(?:yilAraligi:\s*"([^"]*)",\s*)?yakitTipi:\s*"([^"]*)",\s*sanziman:\s*"([^"]*)",\s*aciklama:\s*"([^"]*)",\s*ortalamaFiyat:\s*(\d+)/g;
    
    let carMatch;
    // To prevent duplicates, we use a Set for IDs
    const seenIds = new Set();
    while ((carMatch = carRegex.exec(cat.carsStr)) !== null) {
        if (seenIds.has(carMatch[1])) continue;
        seenIds.add(carMatch[1]);
        cars.push({
            id: carMatch[1],
            marka: carMatch[2],
            model: carMatch[3],
            yilAraligi: carMatch[4] || '2015 - 2024',
            yakitTipi: carMatch[5],
            sanziman: carMatch[6],
            aciklama: carMatch[7],
            ortalamaFiyat: Number(carMatch[8])
        });
    }
    cat.cars = cars;
    categories.push(cat);
}

// Rebuild the file
let newFile = `export interface OtoButceCar {
  id: string;
  marka: string;
  model: string;
  yilAraligi: string;
  yakitTipi: string;
  sanziman: string;
  aciklama: string;
  imageUrl?: string;
  ortalamaFiyat: number;
}

export interface OtoButceCategory {
  id: string;
  slug: string;
  title: string;
  minPrice: number;
  maxPrice: number;
  seoTitle: string;
  seoDesc: string;
  introText?: string;
  tavsiyeText?: string;
  cars: OtoButceCar[];
}

export const OTOBUTCE_CATEGORIES: OtoButceCategory[] = [
`;

for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    newFile += `  {
    id: "${cat.id}",
    slug: "${cat.slug}",
    title: "${cat.title}",
    minPrice: ${cat.minPrice},
    maxPrice: ${cat.maxPrice},
    seoTitle: "${cat.seoTitle}",
    seoDesc: "${cat.seoDesc}",\n`;
    if (cat.introText) newFile += `    introText: \`${cat.introText}\`,\n`;
    if (cat.tavsiyeText) newFile += `    tavsiyeText: \`${cat.tavsiyeText}\`,\n`;
    
    newFile += `    cars: [\n`;
    for (let j = 0; j < cat.cars.length; j++) {
        const car = cat.cars[j];
        newFile += `      {
        id: "${car.id}",
        marka: "${car.marka}",
        model: "${car.model}",
        yilAraligi: "${car.yilAraligi}",
        yakitTipi: "${car.yakitTipi}",
        sanziman: "${car.sanziman}",
        aciklama: "${car.aciklama}",
        ortalamaFiyat: ${car.ortalamaFiyat}
      }${j === cat.cars.length - 1 ? '' : ','}\n`;
    }
    newFile += `    ]\n  }${i === categories.length - 1 ? '' : ','}\n`;
}

newFile += `];\n`;

fs.writeFileSync('data/otobutce-data.ts', newFile);
console.log('Successfully completely rebuilt the data file!');
