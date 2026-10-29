const fs = require('fs');
const transcript = fs.readFileSync('C:\\\\Users\\\\GAMER\\\\.gemini\\\\antigravity-ide\\\\brain\\\\87b599fc-ba68-4bde-ace1-2d59136796ce\\\\.system_generated\\\\logs\\\\transcript.jsonl', 'utf8');

// The transcript has things like "id": "c-1-1", "marka": "Renault", "model": "19 (Europa)", "yilAraligi": "1994 - 2001"
// But it might be escaped differently. Let's just find all "c-X-Y" and the nearest "yilAraligi".

const map = {};
const idRegex = /c-\d+-\d+/g;
let match;

// split into small chunks
const chunks = transcript.split('id:');
for (const chunk of chunks) {
    const m1 = chunk.match(/^\s*\\?"(c-\d+-\d+)\\?"/);
    if(m1) {
        const id = m1[1];
        const m2 = chunk.match(/yilAraligi:\s*\\?"([^\\"]+)\\?"/);
        if(m2) {
            map[id] = m2[1];
        } else {
            // maybe without quotes
            const m3 = chunk.match(/yilAraligi:\s*"([^"]+)"/);
            if(m3) map[id] = m3[1];
        }
    } else {
        const m4 = chunk.match(/^\s*"(c-\d+-\d+)"/);
        if(m4) {
            const id = m4[1];
            const m5 = chunk.match(/yilAraligi:\s*"([^"]+)"/);
            if(m5) map[id] = m5[1];
        }
    }
}

console.log('Found cars:', Object.keys(map).length);

const dataPath = 'data/otobutce-data.ts';
let dataContent = fs.readFileSync(dataPath, 'utf8');

for (const [id, year] of Object.entries(map)) {
    const replaceRegex = new RegExp(`(id:\\s*"${id}",\\s*marka:\\s*"[^"]*",\\s*model:\\s*"[^"]*",)`);
    dataContent = dataContent.replace(replaceRegex, `$1\n        yilAraligi: "${year}",`);
}

if (!dataContent.includes('yilAraligi: string;')) {
    dataContent = dataContent.replace(/(export interface OtoButceCar \{\s*id: string;\s*marka: string;\s*model: string;)/, '$1\n  yilAraligi: string;');
}

fs.writeFileSync(dataPath, dataContent);
console.log('Done restoring');
