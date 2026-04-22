const fs = require('fs');

// Check specific file for raw bytes
const filepath = 'app/admin/moderatorler/page.tsx';
const raw = fs.readFileSync(filepath);

// Find C1 bytes and their positions
let found = 0;
for (let i = 0; i < raw.length; i++) {
  if (raw[i] >= 0x80 && raw[i] <= 0x9F) {
    const around = raw.slice(Math.max(0, i-5), Math.min(raw.length, i+10)).toString('utf8');
    console.log(`Byte 0x${raw[i].toString(16)} at pos ${i}: ...${JSON.stringify(around)}...`);
    found++;
    if (found > 5) break;
  }
}
console.log('Total C1 bytes found (first 5 shown):', found > 0 ? '5+' : '0');

// Also verify the fix is idempotent
const utf8content = raw.toString('utf8');
const hasDoubleEnc = /[\u00C3-\u00C5][\u0080-\u00BF]/.test(utf8content);
const hasC1 = [...utf8content].some(c => c.charCodeAt(0) >= 0x80 && c.charCodeAt(0) <= 0x9F);
console.log('UTF-8 content has double-encoded sequences:', hasDoubleEnc);
console.log('UTF-8 content has C1 control chars:', hasC1);
