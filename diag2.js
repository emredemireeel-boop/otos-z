const fs = require('fs');
const iconv = require('iconv-lite');

// Let's look at what the C1 bytes are in a simple file
const raw = fs.readFileSync('components/Navbar.tsx');

let c1found = [];
for (let i = 0; i < raw.length; i++) {
  if (raw[i] >= 0x80 && raw[i] <= 0x9F) {
    const ctx = raw.slice(Math.max(0, i-8), Math.min(raw.length, i+12));
    c1found.push({
      pos: i,
      byte: raw[i],
      ctxHex: ctx.toString('hex'),
      ctxLatin: ctx.toString('latin1'),
      prevBytes: raw.slice(Math.max(0, i-3), i).toString('hex'),
      nextBytes: raw.slice(i+1, Math.min(raw.length, i+5)).toString('hex'),
    });
    if (c1found.length >= 3) break;
  }
}

console.log('C1 bytes in Navbar.tsx:');
c1found.forEach(b => {
  console.log(`  Byte: 0x${b.byte.toString(16)}`);
  console.log(`  Context hex: ${b.ctxHex}`);
  console.log(`  Context latin1: ${JSON.stringify(b.ctxLatin)}`);
  console.log(`  Prev bytes: ${b.prevBytes}`);
  console.log(`  Next bytes: ${b.nextBytes}`);
  console.log();
});

// What is the byte sequence?
// If we see e.g. 0x81 0x9D 0x82 it might represent something specific
// Let's check if these are just proper UTF-8 chars that we're misidentifying

// UTF-8 for Turkish chars:
// ı = 0xC4 0xB1
// İ = 0xC4 0xB0  
// ş = 0xC5 0x9F  <-- 0x9F is here! 0x9F in UTF-8 continuation would be special
// Ş = 0xC5 0x9E
// ğ = 0xC4 0x9F  <-- 0x9F again!
// Ğ = 0xC4 0x9E
// ö = 0xC3 0xB6
// ü = 0xC3 0xBC
// ç = 0xC3 0xA7

// So 0x9F is a CONTINUATION BYTE in UTF-8 sequences for ş and ğ!
// Our hasC1Bytes function is WRONG - it's flagging valid UTF-8 continuation bytes!

console.log('\n=== DIAGNOSIS ===');
console.log('0x9F is a continuation byte in utf-8 for Turkish chars like ş and ğ');
console.log('0x80 is start of UTF-8 multibyte for some chars');
console.log('These are NOT Win1252 chars - they are VALID UTF-8 continuation bytes!');
console.log('\nThe files are actually FINE - they are proper UTF-8!');
console.log('\nLet us verify by reading Navbar.tsx content:');
const content = fs.readFileSync('components/Navbar.tsx', 'utf8');
console.log('Has ş:', content.includes('\u015F'));
console.log('Has ğ:', content.includes('\u011F'));
console.log('Has ı:', content.includes('\u0131'));
console.log('Has İ:', content.includes('\u0130'));
