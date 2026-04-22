const fs = require('fs');
const c = fs.readFileSync('app/admin/kullanicilar/page.tsx', 'utf8');
// Check first 10 lines that have Turkish chars
const lines = c.split('\n').slice(0, 150);
lines.forEach((l, i) => {
  // Check for any non-ASCII chars
  if (/[^\x00-\x7E]/.test(l)) {
    console.log((i+1) + ': ' + l.trim().substring(0, 90));
  }
});
console.log('---');
// Check has proper Turkish chars
console.log('Has ı:', c.includes('\u0131'));
console.log('Has ü:', c.includes('\u00FC'));
console.log('Has ğ:', c.includes('\u011F'));
console.log('Has ş:', c.includes('\u015F'));
console.log('Has BAN_DURATIONS Gün:', c.includes('G\u00FCn'));
