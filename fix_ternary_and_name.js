const fs = require('fs');
const path = require('path');

function getAllFiles(dir, exts = ['.tsx', '.ts', '.js']) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git', 'public'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllFiles(fullPath, exts));
    else if (exts.some(e => entry.name.endsWith(e))) results.push(fullPath);
  }
  return results;
}

const root = process.cwd();
const files = getAllFiles(root);

for (const filepath of files) {
  let c;
  try { c = fs.readFileSync(filepath, 'utf8'); } catch { continue; }
  const orig = c;

  // Fix broken ternary operators from encoding corruption
  // Pattern: 'value1' : 'value2'  → 'value1' : 'value2'
  // This happened in style objects like: isActive ? 'color1' : 'color2'
  c = c.replace(/'([^']*)' : '([^']*)'(?!\s*:)/g, "'$1' : '$2'");
  c = c.replace(/`([^`]*)` : `([^`]*)`/g, '`$1` : `$2`');
  // Also clean up any remaining orphan  sequences
  c = c.replace(//g, '');

  // Text replacement: Otosöz → Otosöz (text only, not in alt attributes or variable names that matter)
  c = c.replace(/Otosöz/g, 'Otosöz');
  c = c.replace(/Otosöz/g, 'Otosöz');

  if (c !== orig) {
    fs.writeFileSync(filepath, c, 'utf8');
    console.log('✓ ' + path.relative(root, filepath));
  }
}

console.log('\nDone!');
