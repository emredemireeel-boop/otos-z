const fs = require('fs');

function replaceFileContents(path, dict) {
  if (!fs.existsSync(path)) return;
  let text = fs.readFileSync(path, 'utf8');
  let original = text;
  
  for(let key in dict) {
    if(key instanceof RegExp) {
       text = text.replace(key, dict[key]);
    } else {
       text = text.split(key).join(dict[key]);
    }
  }

  if(original !== text) {
    fs.writeFileSync(path, text, 'utf8');
    console.log("Fixed text in", path);
  }
}

replaceFileContents('app/admin/reklamlar/page.tsx', {
  '●Â': '●',
  '●¼': '●',
  '● ': '● ',
  '●¼ ': '● ',
  'Ã„ş': 'ğ'
});

replaceFileContents('app/profil/[userId]/page.tsx', {
  'BeÃ„şeni': 'Beğeni',
  'KARşILAşTIRMA': 'KARŞILAŞTIRMA',
  'KARşILAşTIRILDI': 'KARŞILAŞTIRILDI',
  'sürüŞ': 'sürüş',
  'görüŞ': 'görüş',
  'AÃ„şustos': 'Ağustos',
  'tavsiye ediliŞ': 'tavsiye ediliş'
});

replaceFileContents('app/admin/moderatorler/page.tsx', {
  'Seviye DeÃ„şiştir': 'Seviye Değiştir',
  'Şifre DeÃ„şiştir': 'Şifre Değiştir',
  'Yazar & Şaylaklar': 'Yazar & Çaylaklar',
  'banlandıÃ„şını': 'banlandığını'
});

replaceFileContents('components/Navbar.tsx', {
  'sürüŞ': 'sürüş'
});
