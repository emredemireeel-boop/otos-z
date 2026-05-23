const fs = require('fs');
const dataPath = 'data/otobutce-data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

const carRegex = /\{\s*id:\s*"c-[\s\S]*?ortalamaFiyat:\s*\d+\s*\}/g;
let newContent = '';
let lastIndex = 0;
let match;
while ((match = carRegex.exec(content)) !== null) {
    newContent += content.substring(lastIndex, match.index);
    let carStr = match[0];
    
    // Fix duplicates: keep only the first yilAraligi
    const parts = carStr.split('yilAraligi:');
    if (parts.length > 2) {
        // It has duplicates. 
        // We take the first part, "yilAraligi:" then extract the value up to the comma, then append the rest without yilAraligi
        let newCarStr = parts[0] + 'yilAraligi:';
        let rest = parts.slice(1).join('yilAraligi:');
        
        // Find the first value
        const valMatch = rest.match(/^\s*"[^"]*",/);
        if (valMatch) {
            newCarStr += valMatch[0];
            let afterFirst = rest.substring(valMatch[0].length);
            // remove any other yilAraligi occurrences
            afterFirst = afterFirst.replace(/yilAraligi:\s*"[^"]*",/g, '');
            newCarStr += afterFirst;
        } else {
            // fallback
            newCarStr = carStr;
        }
        carStr = newCarStr;
    }
    
    // Add if missing
    if (!carStr.includes('yilAraligi:')) {
        carStr = carStr.replace(/(model:\s*"[^"]*",)/, '$1\n        yilAraligi: "2015 - 2024",');
    }
    
    newContent += carStr;
    lastIndex = match.index + carStr.length;
}
newContent += content.substring(lastIndex);

fs.writeFileSync(dataPath, newContent);
console.log('Fixed missing/duplicate yilAraligi');
