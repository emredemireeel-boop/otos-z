const fs = require('fs');
const transcript = fs.readFileSync('C:\\\\Users\\\\GAMER\\\\.gemini\\\\antigravity-ide\\\\brain\\\\87b599fc-ba68-4bde-ace1-2d59136796ce\\\\.system_generated\\\\logs\\\\transcript.jsonl', 'utf8');
const matches = [...transcript.matchAll(/id:\s*"(c-[^"]+)"[\s\S]*?yilAraligi:\s*"([^"]+)"/g)];
const map = {};
for(const match of matches) {
  map[match[1]] = match[2];
}
console.log(JSON.stringify(map, null, 2));

const dataPath = 'data/otobutce-data.ts';
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Insert it back
for(const [id, year] of Object.entries(map)) {
    const regex = new RegExp(`(id:\\s*"${id}"\\s*,\\s*marka:\\s*"[^"]*"\\s*,\\s*model:\\s*"[^"]*"\\s*,)`);
    dataContent = dataContent.replace(regex, `$1\n        yilAraligi: "${year}",`);
}

fs.writeFileSync(dataPath, dataContent);
