const fs = require('fs');
const c = fs.readFileSync('app/kutuphane/page.tsx', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('?')) {
    // Check if line has JSX text with ?
    const hasJsxQ = />([^<]*\?[^<]*)</.test(l);
    const hasStrQ = /['"]([^'"]*\?[^'"]*)['"]\s*[,}]/.test(l);
    if (hasJsxQ || hasStrQ) {
      console.log((i+1) + ': ' + l.trim().substring(0, 80));
    }
  }
});
