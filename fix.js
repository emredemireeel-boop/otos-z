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

fixFile('app/admin/hesap/page.tsx', c => c
  .replace(/{ icon: " title: "E-posta Do[^\"]*rulama", desc: "admin@Otosöz.com", active: false },/g, '{ icon: "📧", title: "E-posta Doğrulama", desc: "admin@Otosöz.com", active: false },')
  .replace(/{ icon: " title: "Güvenlik Anahtarı \(FIDO2\)/g, '{ icon: "🔑", title: "Güvenlik Anahtarı (FIDO2)')
);

fixFile('app/admin/moderatorler/page.tsx', c => c
  .replace(/<ModalHeader icon=\{modal === "ekle" \? " : " title=\{modal/g, '<ModalHeader icon={modal === "ekle" ? "➕" : "✏️"} title={modal')
);

fixFile('app/admin/reklamlar/page.tsx', c => c
  .replace(/{ key: 'sidebar', label: 'Sa[^']*Kenar Çubu[^']*', page: 'Forum \/ Sözlük', desc: 'Sabit pozisyonlu, kullanıcı scroll\\'larken takip eden', size: '300[^']*250', traffic: 'Orta', icon: ' },/g, "{ key: 'sidebar', label: 'Sağ Kenar Çubuğu', page: 'Forum / Sözlük', desc: 'Sabit pozisyonlu, kullanıcı scroll\\'larken takip eden', size: '300x250', traffic: 'Orta', icon: '📌' },")
  .replace(/icon: ' },/g, "icon: '🏎️' },")
  .replace(/300[^']*250/g, '300x250')
  .replace(/728[^']*90/g, '728x90')
);

fixFile('app/admin/rozetler/page.tsx', c => c
  .replace(/{ id: "b1", name: "OtoExpert", emoji: " description: "Teknik/g, '{ id: "b1", name: "OtoExpert", emoji: "🏆", description: "Teknik')
  .replace(/{ id: "b3", name: "Trend Yapıcı", emoji: " description: "Siteye/g, '{ id: "b3", name: "Trend Yapıcı", emoji: "📈", description: "Siteye')
);

fixFile('app/admin/yayin/page.tsx', c => c
  .replace(/emoji: " },/g, 'emoji: "🔔" },')
);
