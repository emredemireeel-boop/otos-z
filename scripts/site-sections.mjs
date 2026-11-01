import fs from 'node:fs';
import path from 'node:path';

const [action, selection = 'all'] = process.argv.slice(2);
if (!['hide', 'restore'].includes(action)) throw Error('Usage: node scripts/site-sections.mjs hide|restore [all|vehicleDna|library|news]');
const roots = { vehicleDna: ['app/arac-dna', 'app/api/arac-dna'], library: ['app/kutuphane', 'app/makale'], news: ['app/haberler', 'app/news-sitemap.xml'] };
if (selection !== 'all' && !Object.hasOwn(roots, selection)) throw Error('Unknown section');
const settingsPath = 'data/site-sections.json', settings = JSON.parse(fs.readFileSync(settingsPath));
const names = selection === 'all' ? Object.keys(roots) : [selection];
const changes = [];
function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) visit(file);
        else {
            const pattern = action === 'hide' ? /^(page|layout|loading|not-found|route)\.(tsx?|jsx?)$/ : /^(page|layout|loading|not-found|route)\.paused\.(tsx?|jsx?)$/;
            if (!pattern.test(entry.name)) continue;
            const target = action === 'hide' ? file.replace(/\.(tsx?|jsx?)$/, '.paused.$1') : file.replace('.paused.', '.');
            if (fs.existsSync(target)) throw Error(`Refusing to overwrite ${target}`);
            fs.renameSync(file, target); changes.push({ from: file, to: target });
        }
    }
}
for (const name of names) { for (const root of roots[name]) visit(root); settings[name] = action === 'restore'; }
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
console.log(JSON.stringify({ action, sections: names, count: changes.length, changes }, null, 2));
