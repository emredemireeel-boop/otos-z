const fs = require('fs');
let content = fs.readFileSync('data/otobutce-data.ts', 'utf8');
const catRegex = /title:\s*"([^"]+)"[\s\S]*?cars:\s*\[([\s\S]*?)\]\s*\}/g;
let match;
while((match = catRegex.exec(content)) !== null) {
   const cars = match[2].split('id:').length - 1;
   console.log(match[1].substring(0, 30) + ' => ' + cars + ' cars');
}
