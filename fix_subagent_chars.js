const fs = require('fs');

function fixFile(filepath, replacements) {
    if (!fs.existsSync(filepath)) return;
    let content = fs.readFileSync(filepath, 'utf8');
    const startContent = content;

    for (const [bad, good] of replacements) {
        content = content.split(bad).join(good);
    }

    if (content !== startContent) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`[FIXED] ${filepath}`);
    } else {
        console.log(`[NO CHANGES] ${filepath}`);
    }
}

const R = '\uFFFD';

// Fixes for Kutuphane Page
fixFile('app/kutuphane/page.tsx', [
    ['İİlginçç', 'İlginç'],
    ['İİlginç', 'İlginç'],
    ['Güncel ceza tutarlar, ehliyet yaptrmlr ve ara men durumlar', 'Güncel ceza tutarları, ehliyet yaptırımları ve araç men durumları'],
    ['Men (Yedek ofr yok)', 'Men (Yedek şoför yok)'],
    ['Men Araçtan Men', 'Araçtan Men'],
    ['tarafındann', 'tarafından'],
    ['yl gncel', 'yılı güncel'],
    ['kapsamnda', 'kapsamında'],
    ['hazrlanmtr', 'hazırlanmıştır'],
    ['bavurunuz', 'başvurunuz'],
    // Fixing Ehliyet / Puan empty cell that has a missing dash or something
    [`ehliyet: '${R}'`, `ehliyet: '-'`],
    [`ehliyet: '—'`, `ehliyet: '-'`],
    [`ehliyet: ''`, `ehliyet: '-'`], 
    [`arac: 'zin`, `arac: 'İzin`],
    [`arac: 'ek`, `arac: 'Çek`]
]);

// Fixes for Footer
fixFile('components/Footer.tsx', [
    ['İİstatistikler', 'İstatistikler'],
    ['𝕏Â•Â', '𝕏'],
    ['𝕏Â', '𝕏'],
    ['İİ', 'İ']
]);
