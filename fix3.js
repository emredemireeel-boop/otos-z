const fs = require('fs');

const dataPath = 'data/otobutce-data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

// Fix the duplicates. For each c-X-Y, we have something like:
// }{
//   id: "c-X-Y",
// {
//   id: "c-X-Y"

// We can just find all instances of `      }{\n        id: "c-X-Y",\n    {\n        id: "c-X-Y",`
// and replace it with `      },\n      {\n        id: "c-X-Y",`
content = content.replace(/      \}\{\s*id:\s*"([^"]+)",\s*\{\s*id:\s*"\1",/g, '      },\n      {\n        id: "$1",');

// Wait, the output was:
//       }{
//         id: "c-0-2",
//     {
//         id: "c-0-2",

content = content.replace(/\s*\}\{\s*id:\s*"([^"]+)",\s*\{\s*id:\s*"\1",/g, '\n      },\n      {\n        id: "$1",');

// There's also `data/otobutce-data.ts(1220,10): error TS1002: Unterminated string literal.`
// Let's print out around line 1220
const lines = content.split('\n');
console.log('Line 1215-1225:');
for(let i=1214; i<1225; i++) {
    if (lines[i] !== undefined) console.log(`${i+1}: ${lines[i]}`);
}

fs.writeFileSync(dataPath, content);
console.log('Applied first pass fix');
