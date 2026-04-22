const fs = require('fs');

const filepath = 'app/admin/moderatorler/page.tsx';
let c = fs.readFileSync(filepath, 'utf8');

// Fix using Buffer-based approach to avoid encoding issues in this file
// Read file as latin1 to see all bytes
const raw = fs.readFileSync(filepath);

// Check raw bytes 
let brokenPositions = [];
for (let i = 0; i < raw.length; i++) {
  if (raw[i] >= 0x80 && raw[i] <= 0x9F) {
    brokenPositions.push({ pos: i, byte: raw[i] });
  }
}
console.log('Broken byte positions:', brokenPositions.length);
if (brokenPositions.length > 0) {
  brokenPositions.slice(0, 3).forEach(b => {
    const ctx = raw.slice(Math.max(0, b.pos - 10), Math.min(raw.length, b.pos + 20));
    console.log(`  0x${b.byte.toString(16)} at ${b.pos}: ${ctx.toString('latin1')}`);
  });
}

// The problem: moderatorler file has raw C1 bytes embedded due to emoji sequences
// Strategy: Use our robust Win1252 decoding function but ONLY on remaining bad sections

// Windows-1252 mapping
const WIN1252 = new Map([
  [0x80, 0x20AC], [0x82, 0x201A], [0x83, 0x0192], [0x84, 0x201E],
  [0x85, 0x2026], [0x86, 0x2020], [0x87, 0x2021], [0x88, 0x02C6],
  [0x89, 0x2030], [0x8A, 0x0160], [0x8B, 0x2039], [0x8C, 0x0152],
  [0x8E, 0x017D], [0x91, 0x2018], [0x92, 0x2019], [0x93, 0x201C],
  [0x94, 0x201D], [0x95, 0x2022], [0x96, 0x2013], [0x97, 0x2014],
  [0x98, 0x02DC], [0x99, 0x2122], [0x9A, 0x0161], [0x9B, 0x203A],
  [0x9C, 0x0153], [0x9E, 0x017E], [0x9F, 0x0178],
]);

function decodeWin1252(raw) {
  let result = '';
  let i = 0;
  while (i < raw.length) {
    const b = raw[i];
    if (b < 0x80) {
      result += String.fromCharCode(b);
      i++;
    } else if (b <= 0x9F) {
      if (WIN1252.has(b)) {
        result += String.fromCodePoint(WIN1252.get(b));
      } else {
        result += ' ';
      }
      i++;
    } else {
      const seqLen = b < 0xE0 ? 2 : b < 0xF0 ? 3 : 4;
      if (i + seqLen <= raw.length) {
        let valid = true;
        for (let j = 1; j < seqLen; j++) {
          if ((raw[i+j] & 0xC0) !== 0x80) { valid = false; break; }
        }
        if (valid) {
          try {
            result += raw.slice(i, i + seqLen).toString('utf8');
            i += seqLen;
          } catch(e) {
            result += String.fromCodePoint(b);
            i++;
          }
        } else {
          result += String.fromCodePoint(b);
          i++;
        }
      } else {
        result += String.fromCodePoint(b);
        i++;
      }
    }
  }
  return result;
}

const decoded = decodeWin1252(raw);
fs.writeFileSync(filepath, decoded, 'utf8');
console.log('Decoded and saved.');

// Verify
const raw2 = fs.readFileSync(filepath);
let remaining = 0;
for (let i = 0; i < raw2.length; i++) {
  if (raw2[i] >= 0x80 && raw2[i] <= 0x9F) remaining++;
}
console.log('Remaining C1 bytes after decode:', remaining);
