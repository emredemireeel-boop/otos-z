const fs = require('fs');
const path = require('path');

const dirPaths = ['./app', './components', './data'];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Fix unicode literals
      content = content.replace(/\\u0131/g, 'ı');
      content = content.replace(/\\u011f/g, 'ğ');
      content = content.replace(/\\u015f/g, 'ş');
      content = content.replace(/\\u00fc/g, 'ü');
      content = content.replace(/\\u00e7/g, 'ç');
      content = content.replace(/\\u00f6/g, 'ö');
      content = content.replace(/\\u0130/g, 'İ');
      content = content.replace(/\\u011e/g, 'Ğ');
      content = content.replace(/\\u015e/g, 'Ş');
      content = content.replace(/\\u00dc/g, 'Ü');
      content = content.replace(/\\u00c7/g, 'Ç');
      content = content.replace(/\\u00d6/g, 'Ö');
      content = content.replace(/\\u00e2/g, 'â');
      
      // Additional double slash escapes
      content = content.replace(/\\\\u0131/g, 'ı');
      content = content.replace(/\\\\u011f/g, 'ğ');
      content = content.replace(/\\\\u015f/g, 'ş');
      
      // Common typo fixing
      content = content.replace(/deÃ„ş/g, 'değ');
      content = content.replace(/diÃ„ş/g, 'diğ');
      content = content.replace(/DeÃ„ş/g, 'Değ');
      content = content.replace(/DiÃ„ş/g, 'Diğ');
      
      // Capital Ş issues
      content = content.replace(/([a-zğüşöçı])Ş/g, '$1ş');

      // "Şefaf" -> "Şeffaf" ? The user said "şefaf yazışı ve renkler çok kötü profesyonel bir sayfa değil profesyonel hala getir gemiş Ş büyük türkçe karakterleşri bozma"
      // Actually, user is referring to the "şeffaf yazısı" - maybe they mean transparent text / colors? Wait... "yukarıdkai şefaf yazışı ve renkler çok kötü".
      // Maybe I should look at `app/kutuphane/kaza-ilkyardim-section.tsx` or similar.

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed:', fullPath);
      }
    }
  }
}

dirPaths.forEach(processDir);
