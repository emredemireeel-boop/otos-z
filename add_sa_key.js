const fs = require('fs');

// Service account JSON'u oku ve tek satira cevirip .env.local'e ekle
const saJson = fs.readFileSync('otosozindex-7a4ca5cb2331.json', 'utf8');
const saSingleLine = JSON.stringify(JSON.parse(saJson));

let envContent = fs.readFileSync('.env.local', 'utf8');

if (!envContent.includes('FIREBASE_SERVICE_ACCOUNT_KEY')) {
    envContent += `\n# Firebase Admin SDK Service Account Key\nFIREBASE_SERVICE_ACCOUNT_KEY=${saSingleLine}\n`;
    fs.writeFileSync('.env.local', envContent, 'utf8');
    console.log('Service account key .env.local dosyasina eklendi.');
} else {
    console.log('Service account key zaten mevcut.');
}
