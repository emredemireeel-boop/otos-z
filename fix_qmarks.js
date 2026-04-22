const fs = require('fs');

function fixQuestionMarks(filepath) {
    if (!fs.existsSync(filepath)) return;
    let c = fs.readFileSync(filepath, 'utf8');
    const start = c;

    c = c.replace(/\?🟢/g, '🟢');
    c = c.replace(/\?🔴/g, '🔴');
    c = c.replace(/\?⚠️/g, '⚠️');

    if (c !== start) {
        fs.writeFileSync(filepath, c, 'utf8');
        console.log('[FIXED] ' + filepath);
    }
}

fixQuestionMarks('components/admin/AdminSidebar.tsx');
fixQuestionMarks('app/admin/yayin/page.tsx');
fixQuestionMarks('app/admin/reklamlar/page.tsx');
fixQuestionMarks('app/admin/moderatorler/page.tsx');
