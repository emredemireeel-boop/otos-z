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
    
    // Fix multi-line trailing open quotes
    content = content.replace(/avatar: "[\r\n\s]+badges:/g, 'avatar: "",\n        badges:');
    
    // data/markets.ts fix
    content = content.replace(/flags\[country\] \|\| "[\r\n\s]+\};/g, 'flags[country] || "";\n};');
    
    // Some TSX files might have broken objects or props.
    // E.g., `icon: "\n` where `icon: ""` is expected.
    // Try to safely close `icon: "` appearing right before `}` or a newline.
    // If it's something like `icon: "\n}` it means `icon: ""`
    content = content.replace(/icon: "[\r\n\s]+\}/g, 'icon: "" }');
    content = content.replace(/icon: "[\r\n\s]+\,/g, 'icon: "",');
    
    // specific file fixes
    // uzmana-sor: maybe label: "
    content = content.replace(/label: "[\r\n\s]+\,/g, 'label: "",');
    // moderator/page or admin pages targets
    content = content.replace(/target: '"[\r\n\s]+\,/g, 'target: \'",');
    content = content.replace(/target: '[\r\n\s]+\,/g, 'target: \'\',');
    content = content.replace(/target: "[\r\n\s]+\,/g, 'target: "",');
    content = content.replace(/desc: "[\r\n\s]+\}/g, 'desc: "" }');
    content = content.replace(/desc: '[\r\n\s]+\}/g, 'desc: \'\' }');
    
    // Any stray `"` followed directly by `\n` or `\r` can be problematic if unclosed, but we rely on exact regex patterns.
    
    fs.writeFileSync(f, content, 'utf8');
  }
});
