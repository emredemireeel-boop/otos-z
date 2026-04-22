const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.next')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.json')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('app').concat(walk('components')).concat(walk('data'));

let brokenStrings = new Map();

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Look for àfollowed by 1 to 10 non-whitespace/non-standard chars (usually corrupt emojis)
    const matches = content.match(/Ã[¢°Ä][^\s"'<>\{\}\\\]\)\(\,\.]+/g);
    
    if (matches) {
        matches.forEach(m => {
            if (!brokenStrings.has(m)) {
                brokenStrings.set(m, new Set());
            }
            brokenStrings.get(m).add(f);
        });
    }
    
    // Check specific known spelling errors from the prompt
    const typos = [
        'AÃ„şır', 'deÃ„şiŞebilir', 'olduÃ„şunu',
        'VİTRİN İFİYAT', 'İLAN İNCLE', 'İSTASTİKLER',
        'ÇEVİRİM İÇİ', 'BAŞLLIK', 'BAŞŞLIK', 'KATEGOİRLER', 'TÜMĞÜÜ'
    ];
    
    typos.forEach(t => {
        if (content.includes(t)) {
            if (!brokenStrings.has(t)) brokenStrings.set(t, new Set());
            brokenStrings.get(t).add(f);
        }
    });

    // Check lowercase/uppercase Ş errors like baŞladı
    const wordsWithBigS = content.match(/[a-zıöüçğ]Ş[a-zıöüçğ]/g);
    if (wordsWithBigS) {
        wordsWithBigS.forEach(w => {
            if (!brokenStrings.has(w)) brokenStrings.set(w, new Set());
            brokenStrings.get(w).add(f);
        });
    }
});

for (let [pattern, fileSet] of brokenStrings.entries()) {
    console.log(`${pattern} -> found in ${fileSet.size} files`);
    if (fileSet.size <= 5) {
        console.log(`   Files: ${Array.from(fileSet).join(', ')}`);
    } else {
        console.log(`   Files: ${Array.from(fileSet).slice(0, 5).join(', ')} and ${fileSet.size - 5} more...`);
    }
}
