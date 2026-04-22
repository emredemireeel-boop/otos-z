const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if(!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    for (let file of list) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    }
    return results;
}

const files = [...walk('app'), ...walk('components')];

for(const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Remove primary/orange gradients across TSX
    content = content.replace(/linear-gradient\([^,]+,\s*(?:var\(--primary\)|#FF6B00|#ff6b00)\s*(?:0%)?,\s*#ff8533\s*(?:100%)?\)/g, 'var(--primary)');
    // Some buttons use 'linear-gradient(135deg, #EF4444, #ff8533)' (e.g. Admin Sidebar) -> make them primary
    content = content.replace(/linear-gradient\([^,]+,\s*#[a-fA-F0-9]{6}\s*,\s*#ff8533\)/g, 'var(--primary)');
    // Special case for 'kayıt' page gradient glow 'linear-gradient(135deg, #ff6b00, #ff8533, #00d4ff)'
    content = content.replace(/linear-gradient\([^,]+,\s*#ff6b00,\s*#ff8533,\s*#00d4ff\)/g, 'var(--primary)');
    // Fix #FF6B35 in karsilastirma
    content = content.replace(/linear-gradient\([^,]+,\s*#FF6B35,\s*#ff8533\)/g, 'var(--primary)');

    // For globals.css
    if(file.endsWith('globals.css')) {
        content = content.replace(/--primary: #ff6b00;/g, '--primary: #3b82f6;');
        content = content.replace(/--primary-glow: rgba\(255, 107, 0, 0\.4\);/g, '--primary-glow: rgba(59, 130, 246, 0.4);');
        content = content.replace(/--hover-primary: rgba\(255, 107, 0, 0\.1\);/g, '--hover-primary: rgba(59, 130, 246, 0.1);');
        content = content.replace(/background: linear-gradient\(135deg, #ff6b00 0%, #ff8533 100%\);/g, 'background: var(--primary);');
        content = content.replace(/background: linear-gradient\(135deg, var\(--primary\) 0%, #3b82f6 100%\);/g, 'background: var(--primary);');
    }

    if(original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
}
