const fs = require('fs');

// Read current file content
let content = fs.readFileSync('app/karsilastirma/page.tsx', 'utf8');

// Replace all known Turkish strings that have ? placeholders
// Pattern: look at surrounding context to determine correct replacement

const replacements = [
  // Title
  ['Kar??la?t?rmalar', 'Karşılaştırmalar'],
  ['Kar??la?t?rma', 'Karşılaştırma'],
  ['kar??la?t?rma', 'karşılaştırma'],
  // Category labels
  ['Ara? Say?s?', 'Araç Sayısı'],
  ['2 Ara?', '2 Araç'],
  ['3 Ara?', '3 Araç'],
  ['4 Ara?', '4 Araç'],
  ['5 Ara?', '5 Araç'],
  // Sort/filter
  ['Pop?ler', 'Popüler'],
  ['T?m?', 'Tümü'],
  // Stats box
  ['İİstatistikler', 'İİstatistikler'],
  ['Toplam Kar??la?t?rma', 'Toplam Karşılaştırma'],
  ['Toplam G?r?nt?lenme', 'Toplam Görüntülenme'],
  // How it works box
  ['Nas?l ?al???r?', 'Nasıl Çalışır?'],
  ['Ara?lar? kar??la?t?rarak toplulukla payla??n. Di?er kullanıcılar yorumlar?yla katk?da bulunabilir.', 'Araçları karşılaştırarak toplulukla paylaşın. Diğer kullanıcılar yorumlarıyla katkıda bulunabilir.'],
  ['Hemen Ba?la', 'Hemen Başla'],
  // Level names
  ['?aylak', 'Şaylak'],
  ['S?r?c?', 'Sürücü'],
  // Card metadata
  ['g?r?nt?lenme', 'görüntülenme'],
  ['yorum', 'yorum'],
  // Generic
  ['kat i?in', 'kat için'],
  ['be?eni', 'beğeni'],
  ['ara?', 'araç'],
  ['Ara?', 'Araç'],
];

for (const [bad, good] of replacements) {
  content = content.split(bad).join(good);
}

fs.writeFileSync('app/karsilastirma/page.tsx', content, 'utf8');
console.log('Fixed karsilastirma/page.tsx');

// Show remaining ? chars in context
const lines = content.split('\n');
let count = 0;
lines.forEach((line, i) => {
  // Only show lines with ? that are inside JSX text (between > and <) or strings
  if (line.includes('?') && !line.trim().startsWith('//') && count < 20) {
    // Find ? in string contexts
    const stripped = line.replace(/[A-Za-z0-9\s{}\[\]()=<>"'\/\\.,:;|&!@#$%^*+\-_~`]/g, '');
    if (stripped.includes('?')) {
      console.log(`Line ${i+1}: ${line.trim().substring(0, 80)}`);
      count++;
    }
  }
});
