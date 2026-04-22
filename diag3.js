const fs = require('fs');
const iconv = require('iconv-lite');

// fix_iconv.js ran decodeWin1252 on ALL files including ones that were ALREADY clean UTF-8
// This BROKE them because Win1252 read of valid UTF-8 multi-byte sequences reinterprets them

// Strategy: We need to RE-FIX only the files that fix_iconv broke
// These files were fine after fix_1252.js but broken by fix_iconv.js

// The pattern: fix_iconv.js decoded valid UTF-8 as Win1252
// For example, 'ş' = 0xC5 0x9F in UTF-8
// When read as Win1252: C5='Å', 9F='Ÿ' -> "ŸÅ" ... no wait
// Actually iconv.decode(buffer, 'win1252') maps:
//  0xC5 -> Å  (Latin Extended A)
//  0x9F -> Ÿ  (Win1252 specific)
// So 'ş' (C5 9F) becomes 'Å\u009F' which when written to UTF-8 file is Å followed by U+009F
// This is why we still see C1 bytes - iconv wrote the raw Win1252 values as-is!

// The correct "reverse Win1252" step:
// Take content that was decoded by iconv-lite win1252
// The chars are now Unicode codepoints that map to Win1252 bytes
// We need to turn them BACK to UTF-8 by re-encoding as UTF-8

// Actually the real fix is simpler:
// The files BEFORE fix_iconv ran were either:
// 1. Already proper UTF-8 (most files after fix_1252.js) 
// 2. Had C1 bytes that are continuation bytes of UTF-8 multi-byte sequences

// After fix_iconv.js ran:
// - Files that were already UTF-8 got corrupted 
// - Files that had real Win1252 are now (re)decoded

// We need to detect which state files are currently in
// If file has NO C1 bytes -> it was converted correctly or was already fine
// If file HAS C1 bytes -> fix_iconv broke it

// Actually the correct fix for the Navbar test:
// Context: "BeÃÅ¸eni" should be "Beğeni"
// Beğ in UTF-8: 42 65 C4 9F
// After fix_iconv (read as Win1252): C4='Ä', 9F='Ÿ' -> BÄ\u009Fe (still a C1 char 9F)
// After WRITING as UTF-8: B, e, Ä (C3 84), \u009F appears literally

// This is a mess. The real solution: detect the encoding pattern

// The current Navbar state: C3 84 C5 B8 = "Ä Å¸" which in Win1252 reading gives Å¸ = ş
// So the file was UTF-8 encoded Win1252 text... Let me check

const raw = fs.readFileSync('components/Navbar.tsx');
console.log('File size:', raw.length);

// Find "Beğeni" pattern - in proper UTF-8 it's 42 65 c4 9f 65 6e69
// Let's look for 42 65 (Be) and check what follows
for (let i = 0; i < Math.min(raw.length, 500); i++) {
  if (raw[i] === 0x42 && raw[i+1] === 0x65) { // "Be"
    console.log('Found "Be" at pos', i);
    console.log('Next bytes:', raw.slice(i, i+15).toString('hex'));
    console.log('As latin1:', raw.slice(i, i+15).toString('latin1'));
    break;
  }
}

// Try reading the file as Latin-1 and get the "plain text" version
const asLatin1 = raw.toString('latin1');
// Then encode as UTF-8 bytes
const reencoded = Buffer.from(asLatin1, 'latin1');
console.log('\nLatin1 -> buffer size:', reencoded.length);
// Check if this gives valid Turkish
const asUtf8 = reencoded.toString('utf8');
const hasTurkish = asUtf8.includes('\u015F') || asUtf8.includes('\u011F') || asUtf8.includes('\u0131');
console.log('Has Turkish chars after latin1 re-read:', hasTurkish);
if (hasTurkish) {
  const lines = asUtf8.split('\n').slice(34, 47);
  lines.forEach((l, i) => console.log((34+i) + ': ' + l.substring(0, 80)));
}
