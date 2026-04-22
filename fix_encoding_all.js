const fs = require('fs');
const path = require('path');

// ─── Mojibake map: Windows-1252 misread bytes → correct UTF-8 character ───────
// Each entry: [broken_string, correct_unicode]
// Order matters: longer sequences first to avoid partial replacements
const FIXES = [
  // Turkish Lira sign ₺ (U+20BA) → most common issue
  ['₺',  '₺'],
  // Curly quotes & special punctuation
  ['’',  '\u2019'], // '
  ['‘',  '\u2018'], // '
  ['“',  '\u201C'], // "
  ['â€\u009d', '\u201D'], // "  (right double quotation)
  ['â€\u009c', '\u201C'], // "  (left double quotation)
  ['—',  '\u2013'], // —  en dash
  ['—',  '\u2014'], // —  em dash
  ['…',  '\u2026'], // …  ellipsis
  ['•',  '\u2022'], // •  bullet
  ['™',  '\u2122'], // ™  trademark
  ['©',   '\u00A9'], // ©  copyright
  ['®',   '\u00AE'], // ®  registered
  ['°',   '\u00B0'], // °  degree
  ['½',   '\u00BD'], // ½
  ['¼',   '\u00BC'], // ¼
  ['¾',   '\u00BE'], // ¾
  ['·',   '\u00B7'], // ·  middle dot
  // Turkish specific characters
  ['ı',   '\u0131'], // ı  (dotless i)
  ['İ',   '\u0130'], // İ  (dotted I)
  ['ş',   '\u015F'], // ş
  ['Ş',   '\u015E'], // Ş
  ['Ä\u009f', '\u011F'], // ğ
  ['Ä\u009e', '\u011E'], // Ğ
  // NOTE: àsequences — must come after longer matches
  ['ç',   '\u00E7'], // ç
  ['Ç',   '\u00C7'], // Ç
  ['ö',   '\u00F6'], // ö
  ['Ö',   '\u00D6'], // Ö
  ['ü',   '\u00FC'], // ü
  ['Ü',   '\u00DC'], // Ü
  ['ä',   '\u00E4'], // ä
  ['â',   '\u00E2'], // â
  ['é',   '\u00E9'], // é
  ['è',   '\u00E8'], // è
  ['ë',   '\u00EB'], // ë
  ['î',   '\u00EE'], // î
  ['ï',   '\u00EF'], // ï
  ['ô',   '\u00F4'], // ô
  ['û',   '\u00FB'], // û
  ['à',   '\u00E0'], // à
  ['á',   '\u00E1'], // á
  ['ã',   '\u00E3'], // ã
  ['ú',   '\u00FA'], // ú
  ['ù',   '\u00F9'], // ù
  ['ý',   '\u00FD'], // ý
  ['Ã\u0081', '\u00C1'], // Á
  ['Ã\u0089', '\u00C9'], // É
  // Leftover bare  (non-breaking space artefacts)
  [' ',   ' '],
  ['Â\u00A0', '\u00A0'],
];

const EXTENSIONS = ['.tsx', '.ts', '.js', '.json', '.css', '.md', '.txt'];
const SKIP_DIRS  = ['node_modules', '.next', '.git', 'public'];

function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(entry.name)) results.push(...walkDir(path.join(dir, entry.name)));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.includes(ext)) results.push(path.join(dir, entry.name));
    }
  }
  return results;
}

const root = process.cwd();
const files = walkDir(root);
let totalFixed = 0;
let filesFixed = 0;

for (const file of files) {
  let content;
  try { content = fs.readFileSync(file, 'utf8'); } catch { continue; }

  const original = content;
  for (const [bad, good] of FIXES) {
    if (content.includes(bad)) content = content.split(bad).join(good);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    const rel = path.relative(root, file);
    // Count occurrences changed
    let n = 0;
    for (const [bad] of FIXES) n += (original.split(bad).length - 1);
    console.log(`  ✓ ${rel}  (${n} fix${n!==1?'es':''})`);
    filesFixed++;
    totalFixed += n;
  }
}

console.log(`\nDone. Fixed ${totalFixed} encoding errors across ${filesFixed} files.`);
