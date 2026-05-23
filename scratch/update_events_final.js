const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'events.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all instances of 'otopazari_gen_' with 'otopazari_final_'
content = content.replace(/otopazari_gen_/g, 'otopazari_final_');

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Updated events.ts successfully to use otopazari_final_ prefix!");
