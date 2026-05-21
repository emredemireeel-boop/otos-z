const fs = require('fs');
const path = require('path');

function createSlug(text) {
    let trMap = {
        'çÇ': 'c', 'ğĞ': 'g', 'şŞ': 's', 'üÜ': 'u', 'ıİ': 'i', 'öÖ': 'o'
    };
    for (let key in trMap) {
        text = text.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
    }
    return text.replace(/[^-a-zA-Z0-9\s]+/ig, '')
        .replace(/\s/gi, "-")
        .replace(/[-]+/gi, "-")
        .toLowerCase();
}

const filePath = path.join(__dirname, '..', 'data', 'engine-dna.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The regex will find { id: "e-name", name: "...", fuelType: "...", transmission: "..." }
// and we will replace id: "e-name" with slug: "..."
content = content.replace(/{ id: "e-name", name: "([^"]+)", fuelType: "([^"]+)", transmission: "([^"]+)"/g, (match, name, fuelType, transmission) => {
    // Generate a unique slug based on name, fuel, and transmission
    const combined = `${name} ${fuelType} ${transmission}`;
    const slug = createSlug(combined);
    return `{ slug: "${slug}", name: "${name}", fuelType: "${fuelType}", transmission: "${transmission}"`;
});

// Also update the interface
content = content.replace(/id: string;/, 'slug: string;');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated engine-dna.ts slugs.");
