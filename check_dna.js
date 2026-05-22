const fs = require('fs');
const content = fs.readFileSync('./data/vehicle-dna.ts', 'utf8');

const regex = /id:\s*(\d+)(?:(?!id:).)*?brand:\s*"([^"]+)"(?:(?!id:).)*?model:\s*"([^"]+)"(?:(?!id:).)*?strengths:\s*\[([^\]]*)\](?:(?!id:).)*?weaknesses:\s*\[([^\]]*)\](?:(?!id:).)*?chronicIssues:\s*\[(.*?)\]/gs;

let match;
const missingStrengths = [];
const missingWeaknesses = [];
const missingChronicIssues = [];

while ((match = regex.exec(content)) !== null) {
    const brandModel = match[2] + ' ' + match[3];
    if (match[4].trim() === '') missingStrengths.push(brandModel);
    if (match[5].trim() === '') missingWeaknesses.push(brandModel);
    // check if chronicIssues array is empty (just whitespace or nothing between brackets)
    const chronicContent = match[6].trim();
    if (chronicContent === '' || !chronicContent.includes('{')) missingChronicIssues.push(brandModel);
}

console.log('Missing Strengths:', missingStrengths.length);
console.log('Missing Weaknesses:', missingWeaknesses.length);
console.log('Missing Chronic Issues:', missingChronicIssues.length);
if (missingChronicIssues.length > 0) {
    console.log('Sample missing chronic issues:', missingChronicIssues.slice(0, 10));
}
