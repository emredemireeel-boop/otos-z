const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '202604R3.xlsx');
const wb = XLSX.readFile(filePath);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Row 1 is header: Marka Kodu, Tip Kodu, Marka Adı, Tip Adı, 2026, 2025, ..., 2012
const header = rows[1];
const yillar = [];
for (let i = 4; i < header.length; i++) {
    yillar.push(header[i]);
}

const araclar = [];

for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[2] || !row[3]) continue;

    const marka = String(row[2]).trim();
    const model = String(row[3]).trim();

    for (let j = 0; j < yillar.length; j++) {
        const yil = yillar[j];
        const deger = row[4 + j];
        if (deger && deger > 0) {
            araclar.push({ marka, model, yil, deger: Math.round(deger) });
        }
    }
}

console.log(`Toplam araç kaydı: ${araclar.length}`);
console.log(`Toplam marka: ${new Set(araclar.map(a => a.marka)).size}`);
console.log(`Yıl aralığı: ${Math.min(...araclar.map(a => a.yil))} - ${Math.max(...araclar.map(a => a.yil))}`);

// Markaları say
const markaSayilari = {};
araclar.forEach(a => { markaSayilari[a.marka] = (markaSayilari[a.marka] || 0) + 1; });
const sirali = Object.entries(markaSayilari).sort((a, b) => b[1] - a[1]).slice(0, 20);
console.log('\nEn çok kayıt olan ilk 20 marka:');
sirali.forEach(([m, c]) => console.log(`  ${m}: ${c}`));

const output = {
    guncellenmeTarihi: "2026-04-01",
    kaynak: "TSB Kasko Değer Listesi - Nisan 2026",
    toplamKayit: araclar.length,
    araclar
};

const outputPath = path.join(__dirname, '..', 'data', 'kasko_deger.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 0));
console.log(`\n✅ ${outputPath} dosyasına yazıldı`);
console.log(`Dosya boyutu: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
