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

const MAP = {
    // Currencies & common symbols
    'ââ€šÂº': '₺',
    'ââ€ Â': '←',
    'ââ€ ’': '→',
    'âÅ““': '✓',
    'âÅ“…': '✅',
    'âÂÅ’': '❌',
    'ââ€“Â²': '▲',
    'ââ€“¼': '▼',
    'ââ€“Â¬': '▬',
    'ââ‚¬“': '—', // en-dash
    'ââ‚¬Â¢': '•',
    'âÅ¡ ïÂ¸Â': '⚠️',
    'âÅ“•': '✤',
    
    // Custom emojis found
    'ââ€º½': '⛽',
    'Ã°ş“Å ': '📊',
    'Ã°şâ€ºÅ¾': '🛞',
    'ÃÂÂ³': '⏳',
    'âÂÂ³': '⏳',
    'Ã°şÅ½©': '🎩',
    'âËœ…': '★',
    'Ã°şÅ½â€°': '🎉',
    'Ã°şËœÅ¾': '😞',
    'ââ€ºâ€': '⛔',
    'Ã°ş“Â¬': '📫',
    'Ã°ş“Â§': '📦',
    'Ã°şÅ’Â': '🌍',
    'âÂ­Â': '⭐',
    'Ã°şâ€â€”': '🚘',
    'ââ€žÂ¢': '™',
    'Ã°ş‘Â¨ââ‚¬ÂÃ°şâ€Â§': '👨‍🔧',
    
    // Footer social icons
    'Ã°Â•Â': '𝕏', // X
    'Ã°ş“Ëœ': '📱', // Smartphone/FB etc
    'Ã°ş“Â¸': '📸', // Camera
    'ââ€“Â¶ïÂ¸Â': '▶️', // YouTube
    'Ã°şÂ¤â€': '🤔',

    // Specific text misspellings from artifacts
    'AÃ„şır': 'Ağır',
    'deÃ„şiŞebilir': 'değişebilir',
    'olduÃ„şunu': 'olduğunu',
    'VİTRİN İFİYAT': 'VİTRİN FİYAT',
    'İLAN İNCLE': 'İLAN İNCELE',
    'İSTASTİKLER': 'İSTATİSTİKLER',
    'ÇEVİRİM İÇİ': 'ÇEVRİMİÇİ',
    'BAŞLLIK': 'BAŞLIK',
    'BAŞŞLIK': 'BAŞLIK',
    'KATEGOİRLER': 'KATEGORİLER',
    'TÜMĞÜÜ': 'TÜMÜ',
    
    // Other fake-users and market emojis mappings generically to cars or people
    'Ã°şÂÅ½ïÂ¸Â': '🏎️',
    'Ã°şÅ¡â€”': '🚗',
    'âÅ¡™ïÂ¸Â': '⚙️',
    'Ã°şÅ¡™': '🛣️',
    'Ã°şÅ½®': '🎮',
    'âÅ¡Â¡': '⚡',
    'Ã°ş‘Â¨ââ‚¬ÂÃ°ş‘©ââ‚¬ÂÃ°ş‘Â§ââ‚¬ÂÃ°ş‘Â¦': '👨‍👩‍👧‍👦',
    'âÂâ€žïÂ¸Â': '❄️',
    'Ã°şÅ¡Â': '🛑',
    'Ã°ş’Âª': '💪',
    'Ã°ş’Â³': '💳',
    'Ã°ş’Â¡': '💡',
    'Ã°ş‘Â¥': '👥',
    'Ã°şâ€ºÂ\x8d': '🛠️', // maybe slightly truncated
    'Ã°şâ€ºÂ': '🛠️',
    'Ã°ş’Â¨': '💨',
    'Ã°ş’°': '💰',
    'Ã°şÂâ€ïÂ¸Â': '🏁',
    'Ã°ş‘â€': '👔',
    'Ã°şâ€â€¹': '🚙',
    'Ã°şâ€ºÂ»': '🛻',
    'Ã°şÂÂ': '🏠',
    'Ã°ş•°ïÂ¸Â': '🕰️',
    'Ã°şâ€ºÂ£ïÂ¸Â': '🛡️',
    'Ã°şÂ©': '🎫',
    
    // Market flags replacement to avoid obscure codes
    'Ã°şâ€¡©Ã°şâ€¡Âª': '🇩🇪',
    'Ã°şâ€¡Â¯Ã°şâ€¡Âµ': '🇯🇵',
    'Ã°şâ€¡°Ã°şâ€¡·': '🇰🇷',
    'Ã°şâ€¡Â«Ã°şâ€¡·': '🇫🇷',
    'Ã°şâ€¡Â¹Ã°şâ€¡·': '🇹🇷',
    'Ã°şâ€¡ÂºÃ°şâ€¡Â¸': '🇺🇸',
    'Ã°şâ€¡®Ã°şâ€¡Â¹': '🇮🇹',
    'Ã°şâ€¡Â¬Ã°şâ€¡Â§': '🇬🇧',
    'Ã°şâ€¡Â¸Ã°şâ€¡Âª': '🇸🇪',
    'Ã°şâ€¡Â¨Ã°şâ€¡Â¿': '🇨🇿',
    'Ã°şâ€¡·Ã°şâ€¡Â´': '🇷🇴',
    'Ã°şâ€¡ÂªÃ°şâ€¡Â¸': '🇪🇸',
    'Ã°şâ€¡Â¨Ã°şâ€¡Â³': '🇨🇳',
    'Ã°şÂÂ³ïÂ¸Â': '🏁',
};

let totalChanges = 0;
let filesChangedCount = 0;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;

    // Apply strict string mapping
    for (let key in MAP) {
        if (content.includes(key)) {
            content = content.split(key).join(MAP[key]);
        }
    }

    // Fix uppercase Ş trapped between lowercase letters
    content = content.replace(/([a-zıiöüçğ])Ş([a-zıiöüçğ])/g, '$1ş$2');
    content = content.replace(/([a-zıiöüçğ])Ş([a-zıiöüçğ])/gi, '$1ş$2');

    // Make sure we didn't miss typical string mappings
    content = content.replace(/AÃ„şır/g, 'Ağır');
    content = content.replace(/deÃ„şiŞebilir/g, 'değişebilir');
    content = content.replace(/olduÃ„şunu/g, 'olduğunu');

    if (content !== original) {
        fs.writeFileSync(f, content, 'utf8');
        filesChangedCount++;
        console.log(`Updated ${f}`);
    }
});

console.log(`Finished processing. Updated ${filesChangedCount} files.`);
