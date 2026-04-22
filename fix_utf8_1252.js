const fs = require('fs');

function replaceDict(path, changes) {
    if(!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');
    let modified = content;
    
    for(const key of Object.keys(changes)) {
        modified = modified.split(key).join(changes[key]);
    }
    
    if(modified !== content) {
        fs.writeFileSync(path, modified, 'utf-8');
        console.log(`Updated ${path}`);
    }
}

// 1. Fix data/surveys.json bad icon strings
replaceDict('data/surveys.json', {
    '"icon": "settings"': '"icon": "⚙️"',
    '"icon": "fuel"': '"icon": "⛽"',
    '"icon": "car"': '"icon": "🚗"',
    '"icon": "zap"': '"icon": "⚡"',
    '"icon": "trophy"': '"icon": "🏆"'
});

// 2. Fix the specific exact strings discovered in grep
replaceDict('app/uzmana-sor/page.tsx', {
    "ðŸ’¡ ": "💡 ",
    "ðŸ”§": "🔧",
    "ðŸ‘ ": "👍 ",
    "ðŸ’¬": "💬",
    "ðŸ’°": "💰"
});

replaceDict('app/para-kazan/page.tsx', {
    "ðŸŽ‰": "🎉"
});

replaceDict('app/obd/page.tsx', {
    "ðŸ“Š": "📊",
    "ðŸ’¡": "💡"
});

replaceDict('app/kutuphane/page.tsx', {
    "ðŸ“š": "📚"
});

replaceDict('app/kayit/page.tsx', {
    "ðŸŽ‰": "🎉"
});

replaceDict('app/karsilastirma/page.tsx', {
    "ðŸ‘ ": "👍 ",
    "ðŸ’¬": "💬",
    "ðŸ“Š": "📊",
    "ðŸ” ": "❓ "
});

replaceDict('app/gosterge-paneli/page.tsx', {
    "ðŸ“Š": "📊"
});

replaceDict('app/forum/page.tsx', {
    "ðŸ’¬": "💬"
});

replaceDict('app/arac-dna/[brand]/[model]/page.tsx', {
    "ðŸ“Š": "📊"
});

replaceDict('app/api/auth/login/route.ts', {
    "ðŸ‘‘": "👑"
});

replaceDict('app/anket/page.tsx', {
    "ðŸ”¥": "🔥"
});

replaceDict('app/admin/page.tsx', {
    "ðŸ“Œ": "📌",
    "ðŸ‘¥": "👥",
    "ðŸš—": "🚗",
    "ðŸ“¢": "📢"
});

replaceDict('app/admin/icerik/page.tsx', {
    "ðŸ”¥": "🔥",
    "ðŸ“¢": "📢",
    "ðŸ“Œ": "📌"
});

replaceDict('app/admin/finans/page.tsx', {
    "ðŸ“Š": "📊",
    "ðŸ’³": "💳",
    "ðŸ‘‘": "👑"
});

replaceDict('app/kutuphane/obd-section.tsx', {
    "ðŸ“Š": "📊",
    "ðŸ’¡": "💡"
});

replaceDict('app/kutuphane/gosterge-section.tsx', {
    "ðŸ“Š": "📊"
});
