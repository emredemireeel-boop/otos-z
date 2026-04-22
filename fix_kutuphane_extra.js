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

// FIX PAGE
fixFile('app/page.tsx', [
    ['İİstatistikler', 'İstatistikler'],
    ['TopluluÃ„şumuzun', 'Topluluğumuzun'],
    ['TopluluÃ„', 'Topluluğ'],
]);

// FIX KUTUPHANE
fixFile('app/kutuphane/page.tsx', [
    ['İİstatistikler', 'İstatistikler'],
    ['TopluluÃ„şumuzun', 'Topluluğumuzun'],
    ['icon="??"', 'icon="🌟"'], // Default generic fallback for ?? in icon
    ['icon="?"', 'icon="⚡"'], // Default for ?
    ['tutarlar?', 'tutarları,'],
    ['tutarlar?', 'tutarları,'],
    ['?? Otosöz', '© Otosöz'], // The watermark symbol was ??
    ['?? Otosöz  Kopyalanamaz', '© Otosöz • Kopyalanamaz'],
    ['? Otosöz', '© Otosöz'],
    ['men yedek yok', 'Men (Yedek yok)'], 
    ['Men (oftor yok)', 'Araçtan Men'],
    ['Men (Şoftor yok)', 'Araçtan Men'],
    ['(Şoför yok)', 'Araçtan Men'], 
    ['(Şoftor yok)', 'Araçtan Men'], 
    ['?? bu tablo', 'Bu tablo'], 
    ['?? Bu tablo', 'Bu tablo'], 
    ['??', '•'], // Replace any remaining stray double question marks with bullet or dash
    ['', '-'], // Just in case any replacement char was missed
    ['kopyalanamz', 'kopyalanamaz'],
    ['Otosöz  Kopyalanamaz', 'Otosöz • Kopyalanamaz']
]);
