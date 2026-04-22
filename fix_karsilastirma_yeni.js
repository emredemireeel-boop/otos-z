const fs = require('fs');

try {
    let content = fs.readFileSync('app/karsilastirma/yeni/page.tsx', 'utf8');

    // Replace orange gradients and colors with primary
    content = content.replace(/linear-gradient\(135deg,\s*#FF6B35,\s*#FF8E53,\s*#FFA500\)/g, 'var(--primary)');
    content = content.replace(/linear-gradient\(135deg,\s*#FF6B35,\s*#FF8E53\)/g, 'var(--primary)');
    content = content.replace(/linear-gradient\(135deg,\s*#FFC107,\s*#FFD54F\)/g, 'var(--primary)');
    content = content.replace(/linear-gradient\(135deg,\s*#FF6B35,\s*#FF8E53,\s*#FFC107,\s*#FFA500\)/g, 'var(--primary)');

    // Color resets
    content = content.replace(/#FF6B35/g, 'var(--primary)');
    content = content.replace(/#FF8E53/g, 'var(--primary)');
    content = content.replace(/color:\s*'#B0B0B0'/g, "color: 'var(--text-muted)'");
    content = content.replace(/color:\s*'white',\s*margin:\s*0/g, "color: 'var(--foreground)', margin: 0");
    content = content.replace(/color:\s*'white',\s*marginBottom:\s*'4px'/g, "color: 'var(--foreground)', marginBottom: '4px'");
    
    // Selectively fix "color: 'white'" to "color: 'var(--foreground)'" inside inputs and normal text wrappers.
    content = content.replace(/color:\s*'white',\s*fontSize:\s*'14px',\s*fontFamily:\s*'inherit'/g, "color: 'var(--foreground)',\\n                                        fontSize: '14px',\\n                                        fontFamily: 'inherit'");
    content = content.replace(/background:\s*'#242424'/g, "background: 'var(--secondary)'");
    content = content.replace(/border:\s*'1px solid #2A2A2A'/g, "border: '1px solid var(--card-border)'");
    content = content.replace(/background:\s*'#2A2A2A'/g, "background: 'var(--card-bg)'");
    
    // Premium Hero Section text resets
    content = content.replace(/color:\s*'rgba\\(255,255,255,0\\.7\\)'/g, "color: 'var(--text-muted)'");
    content = content.replace(/color:\s*'rgba\\(255,255,255,0\\.6\\)'/g, "color: 'var(--text-muted)'");
    content = content.replace(/background:\s*'rgba\\(255,255,255,0\\.05\\)'/g, "background: 'var(--secondary)'");
    content = content.replace(/color:\s*count === num \? 'white' : '#B0B0B0'/g, "color: count === num ? 'white' : 'var(--text-muted)'");

    fs.writeFileSync('app/karsilastirma/yeni/page.tsx', content);
    console.log('Fixed karsilastirma/yeni/page.tsx');

} catch(e) {
    console.error(e);
}

try {
    // Also fix uzmana-sor tip card
    let uContent = fs.readFileSync('app/uzmana-sor/page.tsx', 'utf8');
    uContent = uContent.replace(/background: 'linear-gradient\\(135deg, rgba\\(59, 130, 246, 0\\.1\\), rgba\\(147, 51, 234, 0\\.1\\)\\)',/, "background: 'var(--secondary)',");
    uContent = uContent.replace(/border: '1px solid rgba\\(59, 130, 246, 0\\.2\\)',/, "border: '1px solid var(--card-border)',");
    fs.writeFileSync('app/uzmana-sor/page.tsx', uContent);
    console.log('Fixed uzmana-sor/page.tsx');
} catch(e) {
    console.error(e);
}
