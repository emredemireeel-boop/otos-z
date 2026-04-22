const fs = require('fs');

const files = [
  'app/admin/moderatorler/page.tsx',
  'app/moderator/page.tsx',
  'app/moderator/raporlar/page.tsx',
  'app/api/admin/route.ts',
];

for (const filepath of files) {
  if (!fs.existsSync(filepath)) continue;
  let c = fs.readFileSync(filepath, 'utf8');
  
  // Fix the permission key identifiers - these must be ASCII-compatible TypeScript strings
  // that match the ModPermission type definition
  // The double-encoded version of 'rapor_kuyruğu'
  c = c.replace(/rapor_kuyrua\u011eu/g, 'rapor_kuyruğu');
  c = c.replace(/rapor_kuyru\u00c4\u009eu/g, 'rapor_kuyruğu');
  c = c.replace(/rapor_kuyrua\u0308u/g, 'rapor_kuyruğu');
  c = c.replace(/"rapor_kuyru[^"]*"/g, '"rapor_kuyruğu"');
  
  // Check and show
  const hasIssue = c.includes('Ä') || c.includes('Ã');
  if (hasIssue) {
    console.log('Still has double-encoded chars in: ' + filepath);
    // Find them
    const lines = c.split('\n');
    lines.forEach((l, i) => {
      if ((l.includes('\u00C3') || l.includes('\u00C4') || l.includes('\u00C5')) && !l.trim().startsWith('//')) {
        console.log('  L' + (i+1) + ': ' + l.trim().substring(0, 80));
      }
    });
  } else {
    console.log('OK: ' + filepath);
  }
  
  fs.writeFileSync(filepath, c, 'utf8');
}
