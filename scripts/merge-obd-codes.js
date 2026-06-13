const fs = require('fs');
const path = require('path');

const otoasfaltPath = path.join(__dirname, '../data/obd-codes.json');
const obdkoduPath = 'C:/Users/GAMER/Desktop/Projelerim/obdkodu-web/data/obd-codes.json';

const otoasfaltData = JSON.parse(fs.readFileSync(otoasfaltPath, 'utf8'));
const obdkoduData = JSON.parse(fs.readFileSync(obdkoduPath, 'utf8'));

const existingCodes = new Set(otoasfaltData.map(item => item.code.toUpperCase()));

let addedCount = 0;

function mapSeverity(sev) {
  if (!sev) return "Değişken";
  const s = sev.toLowerCase();
  if (s === "high" || s === "yüksek") return "Yüksek";
  if (s === "orta" || s === "medium") return "Orta";
  if (s === "low" || s === "düşük") return "Düşük";
  return "Değişken";
}

for (const item of obdkoduData) {
  const code = item.code?.toUpperCase();
  if (!code) continue;

  if (!existingCodes.has(code)) {
    const isGeneric = code.length > 1 && code[1] === '0';
    
    const mapped = {
      code: code,
      title: item.name || "",
      description: item.description || "",
      type: item.category || code[0] || "",
      isGeneric: isGeneric,
      severity: mapSeverity(item.severity),
      systems: item.affectedSystem ? [item.affectedSystem] : [],
      symptoms: item.symptoms || [],
      causes: item.causes || [],
      fixes: item.solutions || []
    };
    
    otoasfaltData.push(mapped);
    existingCodes.add(code);
    addedCount++;
  }
}

otoasfaltData.sort((a, b) => a.code.localeCompare(b.code));

fs.writeFileSync(otoasfaltPath, JSON.stringify(otoasfaltData, null, 2));

console.log(`Successfully merged codes. Added ${addedCount} new codes. Total codes now: ${otoasfaltData.length}`);
