const fs = require('fs');
const vContent = fs.readFileSync('./data/vehicle-dna.ts', 'utf8');

const missingEngines = [15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34];
const missingTrims = [105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127];

const getBrandModel = (id) => {
    const idRegex = new RegExp('id:\\s*' + id + '\\s*,[\\s\\S]*?brand:\\s*"(.*?)"[\\s\\S]*?model:\\s*"(.*?)"');
    const match = vContent.match(idRegex);
    if(match) return match[1] + ' ' + match[2];
    return 'Unknown';
}

console.log('Vehicles missing Engines:');
missingEngines.forEach(id => console.log(id + ': ' + getBrandModel(id)));

console.log('\nVehicles missing Trims:');
missingTrims.forEach(id => console.log(id + ': ' + getBrandModel(id)));
