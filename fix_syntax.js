const fs = require('fs');

const filesToFix = [
  'app/admin/hesap/page.tsx',
  'app/admin/moderasyon/page.tsx',
  'app/admin/moderatorler/page.tsx',
  'app/admin/reklamlar/page.tsx',
  'app/admin/rozetler/page.tsx',
  'app/admin/yayin/page.tsx',
  'app/kutuphane/[guideId]/page.tsx',
  'app/profil/[userId]/page.tsx',
  'app/uzmana-sor/[id]/page.tsx',
  'data/fake-users.ts',
  'data/markets.ts'
];

filesToFix.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    
    // Some lines ended up like: avatar: "
    // We want to restore them to: avatar: "",
    content = content.replace(/avatar: "[ \t]*\n/g, 'avatar: "",\n');
    content = content.replace(/icon: "[ \t]*\n/g, 'icon: "",\n');
    content = content.replace(/icon: "[ \t]*\,/g, 'icon: "",');
    
    // For uzmana-sor and kutuphane, maybe a simple string was opened and not closed:
    content = content.replace(/label: "[ \t]*\n/g, 'label: "",\n');
    content = content.replace(/target: '"[ \t]*\n/g, 'target: \'",\n');
    content = content.replace(/target: "[ \t]*\n/g, 'target: "",\n');
    content = content.replace(/\|\| "[ \t]*;/g, '|| "";');
    
    // data/markets.ts:45
    content = content.replace(/flags\[country\] \|\| "[ \t]*;/g, 'flags[country] || "";');

    fs.writeFileSync(f, content, 'utf8');
    console.log('Processed ' + f);
  }
});
