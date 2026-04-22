const fs = require('fs');

let content = fs.readFileSync('app/uzmana-sor/page.tsx', 'utf8');

if (content.includes('❓ Nasıl Çalışır?')) {
    // If it's already there (it shouldn't be, because I deleted it), just fix it.
    // But it was deleted! Let's check git checkout or just rewrite it line by line.
    const lines = content.split('\n');
    const fixedLines = [];
    for (let i = 0; i < lines.length; i++) {
        fixedLines.push(lines[i]);
        if (lines[i].includes('{expert.answers} yanıt')) {
            // Restore missing lines right after this
            if (lines[i+1] && lines[i+1].includes('</div>')) i++;
            if (lines[i+1] && lines[i+1].includes('</div>')) i++;
            if (lines[i+1] && lines[i+1].includes('))}')) i++;
            if (lines[i+1] && lines[i+1].includes('</div>')) i++;
            if (lines[i+1] && lines[i+1].includes('</div>')) i++;
            
            // Add the missing lines back
            fixedLines.push('                                                </div>');
            fixedLines.push('                                            </div>');
            fixedLines.push('                                        ))}');
            fixedLines.push('                                    </div>');
            fixedLines.push('                                </div>');
            fixedLines.push('');
            fixedLines.push('                                {/* Info Box */}');
            fixedLines.push('                                <div style={{');
            fixedLines.push(`                                    background: 'var(--secondary)',`);
            fixedLines.push(`                                    border: '1px solid var(--card-border)',`);
            fixedLines.push(`                                    borderRadius: '16px',`);
            fixedLines.push(`                                    padding: '16px',`);
            fixedLines.push('                                }}>');
            fixedLines.push(`                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>`);
            fixedLines.push('                                        ❓ Nasıl Çalışır?');
            fixedLines.push('                                    </h3>');
        }
    }
    fs.writeFileSync('app/uzmana-sor/page.tsx', fixedLines.join('\n'));
}

console.log('Restoration complete.');
