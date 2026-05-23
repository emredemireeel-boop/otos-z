const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'app', 'page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

const badBlock = `                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {topUsers.map((u, i) => (
                                            ))}
                                        </div>
                                    )}`;

const goodBlock = `                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {topUsers.map((u, i) => (
                                                <li key={\`\${u.username}-\${i}\`}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: '10px',
                                                        padding: '10px 8px',
                                                        borderRadius: '8px',
                                                        background: 'transparent'
                                                    }}>
                                                        <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>{i + 1}</span>
                                                        <div style={{ flex: 1 }}>
                                                            <span style={{ color: 'var(--foreground)', fontSize: '13px', lineHeight: 1.4, display: 'block' }}>@{u.username}</span>
                                                            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{u.role === 'usta' ? 'Usta' : 'Çırak'}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}`;

if (content.includes(badBlock)) {
    content = content.replace(badBlock, goodBlock);
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log('Fixed Top Yazarlar styling successfully.');
} else {
    console.log('Block not found, trying regex fallback...');
    // Fallback regex if spacing is slightly off
    const regex = /<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>\s*{topUsers\.map\(\(u, i\) => \(\s*\)\)}\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/; // not going to use a massive regex
    
    // Just a substring replacement of the immediate area
    let startIdx = content.indexOf('                                    {topUsers.length === 0 ? (');
    let endIdx = content.indexOf('                                {/* İstatistikler */}');
    
    if (startIdx !== -1 && endIdx !== -1) {
        const replacePortion = content.substring(startIdx, endIdx);
        
        const correctFullBlock = `                                    {topUsers.length === 0 ? (
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>Henüz yazar yok</p>
                                    ) : (
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {topUsers.map((u, i) => (
                                                <li key={\`\${u.username}-\${i}\`}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: '10px',
                                                        padding: '10px 8px',
                                                        borderRadius: '8px',
                                                        background: 'transparent'
                                                    }}>
                                                        <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>{i + 1}</span>
                                                        <div style={{ flex: 1 }}>
                                                            <span style={{ color: 'var(--foreground)', fontSize: '13px', lineHeight: 1.4, display: 'block' }}>@{u.username}</span>
                                                            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{u.role === 'usta' ? 'Usta' : 'Çırak'}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

`;
        content = content.replace(replacePortion, correctFullBlock);
        fs.writeFileSync(targetPath, content, 'utf8');
        console.log('Fixed using fallback.');
    } else {
        console.log('Could not find boundaries.');
    }
}
