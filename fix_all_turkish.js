const fs = require('fs');
const path = require('path');

// Full mapping from CP1252/latin1 byte sequences to correct Turkish UTF-8
// When a UTF-8 file was read as latin1, multi-byte sequences become multiple single chars
// We need to reverse this by reading as latin1 and letting Buffer handle the re-encoding

function getAllFiles(dir, exts = ['.tsx', '.ts', '.js', '.json', '.css']) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git', 'public'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, exts));
    } else if (exts.some(e => entry.name.endsWith(e))) {
      results.push(fullPath);
    }
  }
  return results;
}

// This is the core: read raw bytes, try to decode as latin1-encoded UTF-8
// i.e. the file was ORIGINALLY UTF-8 but got saved as if latin1
function recoverUtf8FromLatin1(raw) {
  // The raw buffer contains bytes that are a latin1 representation of UTF-8 text
  // Convert Buffer -> latin1 string -> Buffer (treating latin1 chars as byte values) -> utf8
  const latin1str = raw.toString('latin1');
  // Each char code in latin1str IS the original byte value
  const bytes = Buffer.from(latin1str, 'latin1');
  return bytes.toString('utf8');
}

// Check if file has C1 control bytes (0x80-0x9F) which indicate latin1/Win1252 encoding
function hasNonUtf8Bytes(raw) {
  // Check for byte sequences that are invalid in UTF-8
  for (let i = 0; i < raw.length; i++) {
    const b = raw[i];
    if (b >= 0x80 && b <= 0x9F) return true; // C1 control area (Windows-1252 special chars)
  }
  return false;
}

// Check if UTF-8 decode has replacement chars
function hasReplacementChars(raw) {
  return raw.toString('utf8').includes('\uFFFD');
}

// Manual Turkish text fix as fallback for files where encoding recovery doesn't work
// Maps broken text patterns (with ? as replacement) to correct text
const CONTEXT_FIXES = [
  // Navbar nav links
  ['KARŞILAŞTIRMA', 'KARŞILAŞTIRMA'],
  ['KAR\\u{15E}\\u{130}LA\\u{15E}TIRMA', 'KARŞILAŞTIRMA'],
  ['ARAÇ DNA', 'ARAÇ DNA'],
  ['KÜTÜPHANE', 'KÜTÜPHANE'],
  ['ETKİNLİKLER', 'ETKİNLİKLER'],
  ['GÜVENMETRE', 'GÜVENMETRE'],
  ['PİYASALAR', 'PİYASALAR'],
  // Navbar buttons
  ['PREMİUM', 'PREMİUM'],
  ["GİRİŞ", 'GİRİŞ'],
  // Logout
  ['Çıkış Yap', 'Çıkış Yap'],
  ['?Çıkış Yap', 'Çıkış Yap'],
  // Notifications
  ['Beğeni aldınız', 'Beğeni aldınız'],
  ['yorumunuzu beğendi', 'yorumunuzu beğendi'],
  ['Yeni yanıt', 'Yeni yanıt'],
  ['yorumunuza yanıt verdi', 'yorumunuza yanıt verdi'],
  ['Yeni takipçi', 'Yeni takipçi'],
  ['sizi takip etmeye başladı', 'sizi takip etmeye başladı'],
  ['Uzman Sürücü', 'Uzman Sürücü'],
  ['rozetini kazandınız', 'rozetini kazandınız'],
  ['Hoş geldiniz!', 'Hoş geldiniz!'],
  ['topluluğuna katıldınız', 'topluluğuna katıldınız'],
  // Messages
  ['hakkında ne düşünüyorsun?', 'hakkında ne düşünüyorsun?'],
  ['Görüşebiliriz mi?', 'Görüşebiliriz mi?'],
  ['sonuçları çok ilginç', 'sonuçları çok ilginç'],
  ['Bilgi için teşekkürler!', 'Bilgi için teşekkürler!'],
  ['Şimdi', 'Şimdi'],
  ["'1 gün'", "'1 gün'"],
  // Mobile menu
  ["{isMenuOpen ? ' : '}", "{isMenuOpen ? ''}"],
  ["isMenuOpen ? ' : '", "isMenuOpen ? ''"],
  ["? '✕' :", "? '✕' :"],
  // Admin panel
  ['İstatistik', 'İstatistik'],
  ['İstatistikler', 'İİstatistikler'],
  ['Kılavuz', 'Kılavuz'],
  ['Güncel', 'Güncel'],
  ['Önceki', 'Önceki'],
  ['Özet', 'Özet'],
  ['Önce', 'Önce'],
  ['Önerilen', 'Önerilen'],
  ['Gönder', 'Gönder'],
  ['Ödemek', 'Ödemek'],
  ['Araştır', 'Araştır'],
  ['araştır', 'araştır'],
  ['Özet', 'Özet'],
  ['Kullanıcı', 'Kullanıcı'],
  ['kullanıcı', 'kullanıcı'],
  ['Başarı', 'Başarı'],
  ['başarı', 'başarı'],
  ['yapılandır', 'yapılandır'],
  ['Yapılandır', 'Yapılandır'],
  ['Güncellemeler', 'Güncellemeler'],
  ['gÖncellemeler', 'güncellemeler'],
  ['Kayıt', 'Kayıt'],
  ['kayıt', 'kayıt'],
  ['Topluluğu', 'Topluluğu'],
  ['topluluğu', 'topluluğu'],
];

const root = process.cwd();
const files = getAllFiles(root);
let fixedCount = 0;
let unchangedCount = 0;

for (const filepath of files) {
  let raw;
  try {
    raw = fs.readFileSync(filepath);
  } catch (e) {
    continue;
  }

  // Strategy 1: Try to recover by re-reading as latin1 → UTF-8
  let content = raw.toString('utf8');
  let fixed = content;
  let strategy = 'none';

  if (hasNonUtf8Bytes(raw) || hasReplacementChars(raw)) {
    try {
      const recovered = recoverUtf8FromLatin1(raw);
      if (!recovered.includes('\uFFFD') && recovered.length > 0) {
        fixed = recovered;
        strategy = 'latin1-recovery';
      }
    } catch (e) {
      // fallback
    }
  }

  // Strategy 2: Context-based replacement of ? patterns
  // Always apply this as a second pass
  for (const [bad, good] of CONTEXT_FIXES) {
    if (fixed.includes(bad)) {
      fixed = fixed.split(bad).join(good);
      strategy = strategy === 'none' ? 'context-fix' : strategy + '+context';
    }
  }

  // Strategy 3: Replace remaining \uFFFD replacement chars in known contexts
  // These appear as ? in the browser
  if (fixed.includes('\uFFFD')) {
    // Cannot safely replace without knowing context - log it
    console.log(`  ⚠ Still has replacement chars: ${path.relative(root, filepath)}`);
  }

  if (fixed !== content) {
    fs.writeFileSync(filepath, fixed, 'utf8');
    fixedCount++;
    console.log(`  ✓ [${strategy}] ${path.relative(root, filepath)}`);
  } else {
    unchangedCount++;
  }
}

console.log(`\n✅ Fixed ${fixedCount} files. ${unchangedCount} files unchanged.`);
