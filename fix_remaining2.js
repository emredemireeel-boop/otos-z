const fs = require('fs');

// A targeted fixer for remaining double-encoded sequences
// Pattern: C3xx, C4xx, C5xx are multi-byte UTF-8 for Latin chars that got double-encoded

// Build a comprehensive lookup of common broken sequences -> correct string
const FIXES = new Map([
  // Turkish chars double-encoded forms
  ['değerlendir', 'değerlendir'],
  ['Değerlendir', 'Değerlendir'],
  ['değiştir', 'değiştir'],
  ['Değiştir', 'Değiştir'],
  ['değiştirildi', 'değiştirildi'],
  ['başlığında', 'başlığında'],
  ['başlık', 'başlık'],
  ['Başlık', 'Başlık'],
  ['şifresi', 'şifresi'],
  ['Şifre', 'Şifre'],
  ['şifre', 'şifre'],
  ['değişik', 'değişik'],
]);

// Actually let's just re-run the C1 byte fixer on remaining problem files
function hasC1Bytes(raw) {
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] >= 0x80 && raw[i] <= 0x9F) return true;
  }
  return false;
}

// Check if file has visible Latin-extended chars that are from double-encoding
function hasDoubleEncoded(content) {
  // Check for sequences like Ä\x9F (which is U+00C4 followed by U+009F) 
  // This represents bytes C4 9F which is 'ğ' in UTF-8
  // When read as Latin-1 and stored in UTF-8, they appear as Ä\x9F
  return /[\u00C3-\u00C5][\u0080-\u00BF]/.test(content);
}

// Decode double-encoded content back to proper UTF-8
function fixDoubleEncoded(content) {
  // Replace ü -> ü, etc by re-encoding through Latin-1
  // The content has chars like U+00C3 U+00BC = ü which represents ü
  // We need to take the codepoints, write them as bytes (Latin-1), then re-read as UTF-8
  const bytes = [];
  for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);
    if (code > 0xFF) {
      // Real Unicode char (emoji, etc.) - encode as UTF-8
      const encoded = Buffer.from(content[i], 'utf8');
      for (const b of encoded) bytes.push(b);
    } else {
      bytes.push(code);
    }
  }
  const buf = Buffer.from(bytes);
  try {
    return buf.toString('utf8');
  } catch(e) {
    return content; // fallback
  }
}

const files = [
  'app/admin/moderatorler/page.tsx',
  'app/moderator/page.tsx',
];

for (const filepath of files) {
  if (!fs.existsSync(filepath)) continue;
  let content = fs.readFileSync(filepath, 'utf8');
  
  if (hasDoubleEncoded(content)) {
    console.log('Fixing double-encoded: ' + filepath);
    content = fixDoubleEncoded(content);
    fs.writeFileSync(filepath, content, 'utf8');
    
    // Verify
    const still = hasDoubleEncoded(content);
    console.log('  Still double-encoded: ' + still);
    
    // Show fixed lines
    const lines = content.split('\n');
    lines.forEach((l, i) => {
      if (/[^\x00-\x7E]/.test(l) && !l.trim().startsWith('//') && i < 50) {
        console.log('  L' + (i+1) + ': ' + l.trim().substring(0, 80));
      }
    });
  } else {
    console.log('Already OK: ' + filepath);
  }
}
