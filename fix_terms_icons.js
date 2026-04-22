const fs = require('fs');
const path = 'app/kullanim-sartlari/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
    { num: '1', icon: '<Users size={18} />' },
    { num: '2', icon: '<FileText size={18} />' },
    { num: '3', icon: '<Globe size={18} />' },
    { num: '4', icon: '<Shield size={18} />' },
    { num: '5', icon: '<Scale size={18} />' },
    { num: '6', icon: '<FileText size={18} />' },
    { num: '7', icon: '<Globe size={18} />' },
    { num: '8', icon: '<Lock size={18} />' },
    { num: '9', icon: '<AlertTriangle size={18} />' },
    { num: '10', icon: '<Shield size={18} />' },
    { num: '11', icon: '<FileText size={18} />' },
    { num: '12', icon: '<Scale size={18} />' },
    { num: '13', icon: '<Shield size={18} />' }
];

replacements.forEach(({ num, icon }) => {
    const regex = new RegExp(`<span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark \\? 'rgba\\(255,107,0,0.1\\)' : 'rgba\\(0,90,226,0.06\\)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var\\(--primary\\)', fontSize: '14px', fontWeight: '800' }}>${num}</span>`, 'g');
    
    // Replace with a slightly larger span to accommodate both or just the icon
    const replacement = `<span style={{ width: '36px', height: '36px', borderRadius: '10px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                                    ${icon}
                                </span>`;
    
    content = content.replace(regex, replacement);
});

// Also there's one weird character in line 248: ⚠️
content = content.replace(/⚠️/g, '⚠️');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed icons in Kullanım Şartları.');
