const fs = require('fs');
const filePath = 'C:/Users/GAMER/Desktop/otoasfalt-web/data/engine-dna.ts';
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  if (line.includes('reportCount:')) {
    // If it ends with just a number
    if (/reportCount:\s*\d+\s*$/.test(line)) {
      lines[i] = line.replace(/(reportCount:\s*\d+)\s*$/, '$1 }');
    }
    // If it ends with a number followed by a comma
    else if (/reportCount:\s*\d+\s*,$/.test(line)) {
      lines[i] = line.replace(/(reportCount:\s*\d+)\s*,$/, '$1 },');
    }
  }
}

fs.writeFileSync(filePath, lines.join('\n'));
console.log('Fixed engine-dna.ts');
