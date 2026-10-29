const fs = require('fs');

const rawText = fs.readFileSync('all_tool_calls_text.txt', 'utf8');

// The regex will find all car blocks.
// They look like:
// {
//    id: "...",
//    marka: "...",
//    model: "...",
//    yilAraligi: "...",
//    yakitTipi: "...",
//    sanziman: "...",
//    aciklama: "...",
//    ortalamaFiyat: ...
// }
// Some might not have yilAraligi if it was the version where I removed them.
// But we want to grab the most recent valid car definition for each id.

const carRegex = /\{\s*id:\s*"([^"]+)",\s*marka:\s*"([^"]*)",\s*model:\s*"([^"]*)",\s*(?:yilAraligi:\s*"([^"]*)",\s*)?yakitTipi:\s*"([^"]*)",\s*sanziman:\s*"([^"]*)",\s*aciklama:\s*(?:"([^"]*)"|`([^`]*)`),\s*(?:imageUrl:\s*[^,]+,\s*)?ortalamaFiyat:\s*(\d+)\s*\}/g;

const carsMap = {};
let match;
while ((match = carRegex.exec(rawText)) !== null) {
    const id = match[1];
    // Keep overwriting so we get the latest
    carsMap[id] = {
        id: id,
        marka: match[2],
        model: match[3],
        yilAraligi: match[4] || '2015 - 2024',
        yakitTipi: match[5],
        sanziman: match[6],
        aciklama: match[7] || match[8] || '',
        ortalamaFiyat: Number(match[9])
    };
}

console.log(`Found ${Object.keys(carsMap).length} unique cars in transcript.`);

// Now we need to put them into their respective categories.
// We can use the existing categories in data/otobutce-data.ts
const dataPath = 'data/otobutce-data.ts';
let dataContent = fs.readFileSync(dataPath, 'utf8');

// I will just iterate through the current otobutce-data.ts, find each category, and repopulate its `cars` array!
// Wait, the `id` of the category is like "0-150k" or "1450-1550k".
// The car ids are like "c-X-Y". The X is the index of the category!
// Let's print out the car IDs we found.
console.log('Car IDs:', Object.keys(carsMap).join(', '));

