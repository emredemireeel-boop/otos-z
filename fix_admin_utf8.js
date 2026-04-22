const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            if(fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walk('app/admin');
const fixes = [
    { bad: 'DoÃ„şrulama', good: 'Doğrulama' },
    { bad: 'doÃ„şum', good: 'doğum' },
    { bad: 'DeÃ„şiştir', good: 'Değiştir' },
    { bad: 'Ã„şiştir', good: 'ğiştir' }, // just in case
    { bad: 'â—', good: '🟢' },
    { bad: '● Çevrimiçi', good: '🟢 Çevrimiçi' },
    { bad: '●', good: '🟢' }, 
    { bad: '🛠️¡ïÂ¸Â', good: '🛠️' },
    { bad: '●Â', good: '🟢' },
    { bad: '●¼', good: '🔴' },
    { bad: 'sabitlenmiŞ', good: 'sabitlenmiş' }
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;
    fixes.forEach(fix => {
        if(content.includes(fix.bad)) {
            content = content.split(fix.bad).join(fix.good);
            console.log('Fixed', fix.bad, 'in', f);
        }
    });
    if(content !== original) {
        fs.writeFileSync(f, content);
    }
});
