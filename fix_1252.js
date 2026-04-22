const fs = require('fs');
const path = require('path');

function getAllFiles(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllFiles(fullPath, exts));
    else if (exts.some(ext => entry.name.endsWith(ext))) results.push(fullPath);
  }
  return results;
}

// Detect broken encoding: bytes 0x80-0x9F in file (Windows-1252 region)
function hasC1Bytes(raw) {
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] >= 0x80 && raw[i] <= 0x9F) return true;
  }
  return false;
}

// Windows-1252 to Unicode codepoint mapping for 0x80-0x9F
const WIN1252 = new Map([
  [0x80, 0x20AC], [0x82, 0x201A], [0x83, 0x0192], [0x84, 0x201E],
  [0x85, 0x2026], [0x86, 0x2020], [0x87, 0x2021], [0x88, 0x02C6],
  [0x89, 0x2030], [0x8A, 0x0160], [0x8B, 0x2039], [0x8C, 0x0152],
  [0x8E, 0x017D], [0x91, 0x2018], [0x92, 0x2019], [0x93, 0x201C],
  [0x94, 0x201D], [0x95, 0x2022], [0x96, 0x2013], [0x97, 0x2014],
  [0x98, 0x02DC], [0x99, 0x2122], [0x9A, 0x0161], [0x9B, 0x203A],
  [0x9C, 0x0153], [0x9E, 0x017E], [0x9F, 0x0178],
]);

// Decode a raw Buffer treating it as Windows-1252
function decodeWin1252(raw) {
  let result = '';
  let i = 0;
  while (i < raw.length) {
    const b = raw[i];
    if (b < 0x80) {
      result += String.fromCharCode(b);
      i++;
    } else if (b <= 0x9F) {
      // Windows-1252 special zone
      if (WIN1252.has(b)) {
        result += String.fromCodePoint(WIN1252.get(b));
      } else {
        // C1 control code - skip or replace
        result += ' ';
      }
      i++;
    } else if (b <= 0xBF) {
      // Latin-1 supplement continuation byte (could be part of UTF-8 or standalone CP1252)
      // Check if previous byte was a UTF-8 leading byte
      result += String.fromCodePoint(b); // treat as Latin-1 char
      i++;
    } else if (b < 0xC0) {
      result += String.fromCodePoint(b);
      i++;
    } else {
      // Multi-byte UTF-8 sequence
      const seqLen = b < 0xE0 ? 2 : b < 0xF0 ? 3 : 4;
      if (i + seqLen <= raw.length) {
        const slice = raw.slice(i, i + seqLen);
        // Validate it's a real UTF-8 sequence
        let valid = true;
        for (let j = 1; j < seqLen; j++) {
          if ((slice[j] & 0xC0) !== 0x80) { valid = false; break; }
        }
        if (valid) {
          try {
            result += slice.toString('utf8');
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

const files = [
  ...getAllFiles('app', ['.tsx', '.ts', '.json']),
  ...getAllFiles('components', ['.tsx', '.ts']),
  ...getAllFiles('data', ['.tsx', '.ts', '.json']),
];

let fixed = 0;
for (const filepath of files) {
  const raw = fs.readFileSync(filepath);
  
  if (hasC1Bytes(raw)) {
    const decoded = decodeWin1252(raw);
    fs.writeFileSync(filepath, decoded, 'utf8');
    fixed++;
    console.log('FIXED: ' + filepath);
  }
}

console.log('\nFixed ' + fixed + ' files with C1 byte sequences');
