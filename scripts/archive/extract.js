const fs = require('fs');

const content = fs.readFileSync('data/vehicle-dna.ts', 'utf8');
const regex = /id:\s*(\d+),\s*brand:\s*\"([^\"]+)\",\s*model:\s*\"([^\"]+)\",\s*year:\s*\"([^\"]+)\"/g;
let match;
const vehicles = [];
while ((match = regex.exec(content)) !== null) {
  vehicles.push({ id: parseInt(match[1]), brand: match[2], model: match[3], generation: match[4] });
}

console.log(JSON.stringify(vehicles, null, 2));
