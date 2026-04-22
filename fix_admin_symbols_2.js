const fs = require('fs');

function fixFile(filepath, replacements) {
    if (!fs.existsSync(filepath)) return;
    let content = fs.readFileSync(filepath, 'utf8');
    const startContent = content;

    for (const [bad, good] of replacements) {
        content = content.replace(new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), good);
    }

    if (content !== startContent) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`[FIXED] ${filepath}`);
    } else {
        console.log(`[NO CHANGES] ${filepath}`);
    }
}

const R = '\uFFFD';

const yayinReklamFixes = [
    // Broken warning (often âš ï¸ or similar byte sequence depending on file encoding)
    ['âš ï¸', '⚠️'],
    ['', ''], // In case there are stray replacement characters, though dangerous. Let's do specific ones:
    [R + 'Sistem Bakımı', '⚠️ Sistem Bakımı'],
    ['🟢Â' + R, '🟢'],
    ['🟢Â', '🟢'],
    ['🟢' + R + 'Â' + R, '🟢'],
    ['🟢' + R + 'Â', '🟢'],
    ['🟢¼', '🔴'],
    ['🟢' + R + '¼', '🔴'],
    ['📑' + R, '📑'],
    ['ðŸ“¡', '📡'],
    ['—' + R, '—'],
    ['🟢Â Yayında', '🟢 Yayında'],
    ['🟢¼ Bitti', '🔴 Bitti'],
    // User requested "🟢Â Yayında -> 🟢 Yayında" "🟢¼ Bitti -> 🔴 Bitti"
    ['🟢Â\u00A0Yayında', '🟢 Yayında'],
    ['🟢¼\u00A0Bitti', '🔴 Bitti'],
    ['👔˜', '👔'],
];

fixFile('app/admin/yayin/page.tsx', yayinReklamFixes);
fixFile('app/admin/reklamlar/page.tsx', yayinReklamFixes);
fixFile('app/admin/moderatorler/page.tsx', yayinReklamFixes);
