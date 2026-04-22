const fs = require('fs');

// Find the notification text position in Navbar
const raw = fs.readFileSync('components/Navbar.tsx');

// Search for the notification strings (around line 35)
// "Be" in the notification data
let found = false;
for (let i = 1000; i < 3000; i++) {
  if (raw[i] === 0x42 && raw[i+1] === 0x65) { // "Be"
    const ctx = raw.slice(i-3, i+20);
    if (ctx.includes(0x61) || ctx.includes(0x6C)) { // 'a' or 'l'
      console.log('Found at pos', i, ':', ctx.toString('hex'));
      console.log('  As latin1:', ctx.toString('latin1'));
      found = true;
      break;
    }
  }
}

// Look at the raw hex around what should be the notification strings
// The file was 47803 bytes (original Navbar), now 47944 bytes (after fix_iconv)
// The iconv encode added bytes

// Let's look at bytes 1400-1700 (approx where notifications data would be)
console.log('\nBytes 1400-1500:');
const chunk = raw.slice(1400, 1500);
console.log('Hex:', chunk.toString('hex'));  
console.log('Utf8:', chunk.toString('utf8').replace(/\n/g, '\\n'));

// The question: what encoding is this file in NOW?
// The iconv.decode(raw, 'win1252') would have produced Unicode string
// then fs.writeFileSync with utf8 encoding would have written UTF-8 bytes
// So what we have NOW is UTF-8 encoded properly

// The C1 "issue" in our check - let's check what 0x84 followed by 0xC2 0xB1 means
// 0xC2 0xB1 = ± in UTF-8
// But before that there's 0x84 - what is it?
// If it's UTF-8: 0x84 is invalid as a start byte (it's in the 80-BF continuation range)
// But 0x84 is also Win1252 „ (double low quotation mark)

// Check: after iconv.decode(win1252) then write as UTF-8:
// Win1252 0x84 -> Unicode U+201E (double low quote) -> UTF-8: E2 80 9E
// Not 0x84! So the 0x84 must come from something else

// Actually after iconv ran: the file FIRST had C4 9F in it (= ğ in UTF-8)
// iconv reads C4 as Ä (Latin capital a uml) and 9F as Ÿ (Win1252)
// Then writes Ä as E2 80 94 ?? No...
// Ä = U+00C4, written as UTF-8 = C3 84
// Ÿ = U+0178 (Win1252 0x9F), written as UTF-8 = C5 B8
// So ğ (C4 9F) -> after win1252 decode -> "ÄŸ" -> after UTF-8 write -> C3 84 C5 B8
// The C3 84 C5 B8 has NO C1 bytes! Both bytes are valid UTF-8 parts!

// So why does our check find C1 bytes??
// Let's scan for ACTUAL standalone C1 bytes (not as parts of valid UTF-8 sequences)
let standalone_c1 = 0;
for (let i = 0; i < raw.length; i++) {
  const b = raw[i];
  if (b >= 0x80 && b <= 0x9F) {
    // Check if this is a continuation byte of a multi-byte sequence
    // A continuation byte must follow a leading byte
    const prev = i > 0 ? raw[i-1] : 0;
    const isValidContinuation = (prev >= 0xC0);  // simplified
    if (!isValidContinuation) {
      console.log(`Standalone C1 at ${i}: 0x${b.toString(16)}, prev: 0x${prev.toString(16)}`);
      standalone_c1++;
      if (standalone_c1 > 3) break;
    }
  }
}
console.log('Standalone C1 bytes:', standalone_c1);
