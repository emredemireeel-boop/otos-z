const fs = require('fs');
function fixFile(path, replacer) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    let fixed = replacer(content);
    if(content !== fixed) {
      fs.writeFileSync(path, fixed, 'utf8');
      console.log('Fixed', path);
    }
  }
}

fixFile('app/admin/moderatorler/page.tsx', c => c
  .replace(/{\["🛠️¡ïÂ¸Â", "⚡", " " " " " " " "🤔“"\]/g, '{["🛠️", "⚡", "🚗", "⚙️", "💬", "🛡️", "🤔"]')
);

fixFile('app/admin/reklamlar/page.tsx', c => c
  .replace(/paused: \{ bg: 'rgba\(245,158,11,0\.12\)', color: '#F59E0B', label: 'Duraklatıldı', dot: ' },/g, "paused: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', label: 'Duraklatıldı', dot: '⏸️' },")
);

fixFile('app/admin/rozetler/page.tsx', c => c
  .replace(/{ id: "b5", name: "Editör Seçimi", emoji: " description: "Yönetici/g, '{ id: "b5", name: "Editör Seçimi", emoji: "🌟", description: "Yönetici')
  .replace(/{ id: "b7", name: "Süvari", emoji: " description: "10,000\+ be[^"]*eni almıŞ",/g, '{ id: "b7", name: "Süvari", emoji: "🐎", description: "10,000+ beğeni almış",')
  .replace(/{ id: "b8", name: "Garaj Do[^"]*rulandı", emoji: " description: "Güvenmetre ile araç sahipli[^"]*i do[^"]*rulanmıŞ",/g, '{ id: "b8", name: "Garaj Doğrulandı", emoji: "🛡️", description: "Güvenmetre ile araç sahipliği doğrulanmış",')
);
