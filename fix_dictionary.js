const fs = require('fs');
const filepath = 'data/dictionary.ts';
let content = fs.readFileSync(filepath, 'utf8');

const replacements = [
    ['Ã„ş', 'ğ'],
    ['Ã„Ÿ', 'Ğ'],
    ['Ã§', 'ç'],
    ['Ã‡', 'Ç'],
    ['Ã¶', 'ö'],
    ['Ã–', 'Ö'],
    ['Ã¼', 'ü'],
    ['Ãœ', 'Ü'],
    ['Ã½', 'ı'],
    ['Ã ', 'İ'],
    ['ÅŸ', 'ş'],
    ['Åž', 'Ş']
];

for (const [bad, good] of replacements) {
    content = content.split(bad).join(good);
}

fs.writeFileSync(filepath, content, 'utf8');
console.log('Fixed dictionary.ts');
