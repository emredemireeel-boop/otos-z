const fs = require('fs');
const path = require('path');

const files = [
    'app/page.tsx',
    'app/uzmana-sor/page.tsx',
    'app/guvenmetre/[categoryId]/page.tsx',
    'app/guvenmetre/page.tsx',
    'app/karsilastirma/[id]/page.tsx',
    'app/karsilastirma/page.tsx',
    'app/forum/[id]/ForumThreadClient.tsx',
    'app/etkinlikler/page.tsx',
    'app/anket/page.tsx'
];

for (const file of files) {
    const fullPath = path.join('c:\\Users\\GAMER\\Desktop\\otoasfalt-web', file);
    if (!fs.existsSync(fullPath)) {
        console.log(`File not found: ${fullPath}`);
        continue;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    let startIdx = content.indexOf('{/* Pazar Vitrini */}');
    if (startIdx === -1) {
        startIdx = content.indexOf('<h3>Pazar Vitrini</h3>');
        if (startIdx === -1) {
            startIdx = content.indexOf('<h3 style={{ fontSize: \'16px\', fontWeight: \'700\', color: \'var(--foreground)\' }}>Pazar Vitrini</h3>');
            if (startIdx === -1) {
                console.log(`Could not find Pazar Vitrini in ${file}`);
                continue;
            } else {
                startIdx = content.lastIndexOf('<div', startIdx);
            }
        } else {
            startIdx = content.lastIndexOf('<div', startIdx);
        }
    }

    const lineStart = content.lastIndexOf('\n', startIdx);
    if (lineStart !== -1) {
        startIdx = lineStart + 1;
    }

    const divStart = content.indexOf('<div', startIdx);
    let count = 0;
    let i = divStart;

    while (i < content.length) {
        const nextOpen = content.indexOf('<div', i);
        const nextClose = content.indexOf('</div', i);

        if (nextOpen !== -1 && nextOpen < nextClose) {
            count++;
            i = nextOpen + 4;
        } else if (nextClose !== -1) {
            count--;
            i = nextClose + 5;
            if (count === 0) break;
        } else {
            break;
        }
    }

    const endIdx = i + 1;

    if (count === 0) {
        const indentMatch = content.substring(startIdx, divStart).match(/^\s*/);
        const indent = indentMatch ? indentMatch[0] : '';
        const replacement = indent + '{/* Pazar Vitrini (Gizlendi) */}\n' + indent + '<LatestThreadsWidget />\n';
        
        let newContent = content.substring(0, startIdx) + replacement + content.substring(endIdx);

        if (!newContent.substring(0, startIdx).includes('LatestThreadsWidget')) {
            const importStatement = 'import LatestThreadsWidget from "@/components/LatestThreadsWidget";\n';
            const lastImport = newContent.lastIndexOf('import ');
            if (lastImport !== -1) {
                const importEnd = newContent.indexOf('\n', lastImport) + 1;
                newContent = newContent.substring(0, importEnd) + importStatement + newContent.substring(importEnd);
            } else {
                newContent = importStatement + newContent;
            }
        }

        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Replaced in ${file}`);
    } else {
        console.log(`Failed to parse divs in ${file}`);
    }
}
