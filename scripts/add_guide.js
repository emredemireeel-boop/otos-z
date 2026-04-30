const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'public', 'data', 'library_guides.json');
const newGuidePath = path.join(__dirname, 'new_guide.json');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const newGuide = JSON.parse(fs.readFileSync(newGuidePath, 'utf8'));

data.guides.push(newGuide);
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Guide added! Total guides:', data.guides.length);
