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
    }
}

const R = '\uFFFD';

/* Moderators Context / Page */
const modFixes = [
    ['AtanmıŞ', 'Atanmış'],
    ['giriŞ', 'giriş'],
    ['ðŸš©', '🚩'],
    ['ðŸ‘¤', '👤'],
    ['ðŸ“\u009d', '📝'], // İçerik Moderasyonu
    ['ðŸ›’', '🛒'],
    ['ðŸ”°', '🛡️'],
    ['ðŸ“¢', '📢'],
    ['ðŸ“‹', '📋'],
    ['ðŸ…', '🏅'],
    ['ðŸ“¡', '📡'],
    ['👔˜', '👔'],
    ['—', '—'],
    ['🟢Â', '•'],
    ['🟢' + R + 'Â' + R, '•'],
    ['📑', '📑'],
    ['🛠️', '🛠️'],
    ['ðŸ›¡ï¸', '🛡️'],
    ['ðŸ›¡ï¸' + R, '🛡️'],
    // Sometimes emojis come out totally broken
    ['ðŸ‘¤', '👤'],
];

fixFile('app/admin/moderatorler/page.tsx', modFixes);
fixFile('data/moderators.ts', modFixes);
fixFile('app/moderator/page.tsx', modFixes);
fixFile('components/moderator/ModeratorSidebar.tsx', modFixes);

/* Yayin (Duyuru) & Reklamlar */
const yayinReklamFixes = [
    ['⚠️', '⚠️'],
    ['🟢Â', '🟢'],
    ['🟢' + R + 'Â' + R, '🟢'],
    ['🟢¼', '🔴'],
    ['🟢' + R + '¼', '🔴'],
    ['📑', '📑'],
    ['💬', '💬'],
    ['📌', '📌'],
    ['🚗', '🚗'],
    ['⏸️', '⏸️'],
    ['—', '—'],
    ['giriŞ', 'giriş'],
    ['yayn', 'yayın'],
    ['Yayn', 'Yayın']
];

fixFile('app/admin/yayin/page.tsx', yayinReklamFixes);
fixFile('app/admin/reklamlar/page.tsx', yayinReklamFixes);
fixFile('app/admin/page.tsx', yayinReklamFixes);
