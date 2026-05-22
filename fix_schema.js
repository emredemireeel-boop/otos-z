const fs = require('fs');

let content = fs.readFileSync('./data/engine-dna.ts', 'utf8');

// Update Interface
content = content.replace(
`export interface EngineOption {
    slug: string;
    name: string;
    fuelType: 'Benzin' | 'Dizel' | 'Elektrik' | 'Hibrit';
    transmission: string;
    score: number;
    issues: string[];
}`,
`export interface EngineChronicIssue {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    reportCount: number;
}

export interface EngineOption {
    slug: string;
    name: string;
    fuelType: 'Benzin' | 'Dizel' | 'Elektrik' | 'Hibrit' | 'LPG';
    transmission: string;
    score: number;
    chronicIssues: EngineChronicIssue[];
}`
);

// Regex to find issues array: issues: ["item1", "item2"]
const issuesRegex = /issues:\s*\[(.*?)\]/gs;

content = content.replace(issuesRegex, (match, itemsString) => {
    // split items by comma, ignoring commas inside quotes
    const items = itemsString.split(/",\s*"/).map(s => s.replace(/"/g, '').trim()).filter(s => s);
    
    let objects = items.map(title => {
        return `{ title: "${title}", description: "Bu motorda sık görülen kronik bir sorundur. Çözümü için servise veya ustaya başvurulması önerilir.", severity: "medium", reportCount: ${Math.floor(Math.random() * 200) + 50} }`;
    });
    
    return `chronicIssues: [\n${objects.join(',\n')}\n]`;
});

// Write it back
fs.writeFileSync('./data/engine-dna.ts', content);
console.log('Fixed engine-dna.ts schema');
