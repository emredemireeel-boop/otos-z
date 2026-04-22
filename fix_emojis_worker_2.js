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

let filesChangedCount = 0;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;

    // specific remaining mappings
    const specificMaps = {
        'ââ€ ‘': '↑',
        'ââ€ “': '↓',
        'ââ‚¬â€': '—',
        'ââ‚¬â€': '—',
        'Ã°ş‘ÂïÂ¸Â': '👁️',
        'Ã°ş’Â¬': '💬',
        'Ã°şâ€â€”': '🔗',
        'Ã°ş“…': '📅',
        'Ã°şâ€’': '🛡️',
        'Ã°ş“â€“': '⏱️',
        'Ã°şâ€Â': '📜',
        'Ã°şÂâ€ ': '🏆',
        'Ã°ş“â€¹': '📋',
        'Ã°ş‘Â': '👍',
        'Ã°ş‘Â¨ââ‚¬ÂÃ°şâ€Â§': '👨‍🔧',
        'Ã°şâ€Â§': '⚙️',
        'Ã°şÂâ€ïÂ¸Â': '🏅',
        'Ã°şâ€â€¹': '🚙',
        'Ã°şÂÂ': '🏠',
        'Ã°şâ‚‚Â»': '🛻',
        'Ã°ş‘Â¨ââ‚¬ÂÃ°ş‘©ââ‚¬ÂÃ°ş‘Â§ââ‚¬ÂÃ°ş‘Â¦': '👨‍👩‍👧‍👦',
        'âÂâ€žïÂ¸Â': '❄️',
        'Ã°şÂÅ½ïÂ¸Â': '🏎️',
        'Ã°şâ€Â§': '🔧',
        'Ã°ş’Â»': '💻',
        'Ã°şÂ©': '🎫',
        'ââ€ºâ€': '⛔',
        'Ã°ş“Â¬': '📫',
        'Ã°ş“Â§': '📦',
        'Ã°şÅ’Â': '🌍',
        'âÂ­Â': '⭐',
        'âÅ¡â€“ïÂ¸Â': '⚠️',
        'ââ€žÂ¢': '™',
        'Ã°şâ€”‘ïÂ¸Â': '🗑️',
        'Ã°şâ€Â¥': '🔥',
        'Ã°ş“Â': '📑',
        'Ã°şâ€Â': '📰'
    };

    for (let key in specificMaps) {
        if (content.includes(key)) {
            content = content.split(key).join(specificMaps[key]);
        }
    }

    // Now for any remaining broken "Ã°ş..." sequences, we will just strip them out
    // because they are broken emojis decorating strings.
    // The regex targets validly matched segments but leaves normal characters alone.
    // This removes sequences starting with Ã°ş or â followed by weird text
    content = content.replace(/Ã°ş[\S]*/g, '');
    content = content.replace(/â[ÂÅ\[\]\x80-\xFF][\S]*/g, '');

    if (content !== original) {
        fs.writeFileSync(f, content, 'utf8');
        filesChangedCount++;
        console.log(`Updated ${f}`);
    }
});

console.log(`Finished processing second pass. Updated ${filesChangedCount} files.`);
