/**
 * Bu script turkey-geo.json dosyasından ilçe koordinatlarını çıkarır
 * ve data/district-coords.json dosyasına yazar.
 * Yapı: { "NORMALIZED_IL": { "NORMALIZED_ILCE": [lat, lng] } }
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const URL = 'https://raw.githubusercontent.com/caglarsarikaya/turkey-geolocations/main/turkey-geo.json';

function normalize(s) {
  return s.toUpperCase()
    .replace(/İ/g, 'I').replace(/ı/g, 'I')
    .replace(/Ğ/g, 'G').replace(/ğ/g, 'G')
    .replace(/Ü/g, 'U').replace(/ü/g, 'U')
    .replace(/Ş/g, 'S').replace(/ş/g, 'S')
    .replace(/Ö/g, 'O').replace(/ö/g, 'O')
    .replace(/Ç/g, 'C').replace(/ç/g, 'C')
    .replace(/Â/g, 'A').replace(/â/g, 'A')
    .replace(/Î/g, 'I').replace(/î/g, 'I')
    .replace(/Û/g, 'U').replace(/û/g, 'U');
}

https.get(URL, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Remove BOM if present
    if (data.charCodeAt(0) === 0xFEFF) data = data.slice(1);
    
    const provinces = JSON.parse(data);
    const result = {};
    let totalDistricts = 0;

    for (const prov of provinces) {
      const provKey = normalize(prov.Province);
      result[provKey] = {};
      
      for (const dist of prov.Districts) {
        if (!dist.Coordinates) continue;
        const coords = dist.Coordinates.split(',').map(s => parseFloat(s.trim()));
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          const distKey = normalize(dist.District);
          result[provKey][distKey] = [coords[0], coords[1]];
          totalDistricts++;
        }
      }
    }

    const outPath = path.join(__dirname, '..', 'data', 'district-coords.json');
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`✅ ${Object.keys(result).length} il, ${totalDistricts} ilçe koordinatı yazıldı: ${outPath}`);
  });
}).on('error', (err) => {
  console.error('Hata:', err.message);
});
