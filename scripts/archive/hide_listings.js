const fs = require('fs');

const files = [
    'app/karsilastirma/[id]/page.tsx',
    'app/karsilastirma/page.tsx',
    'app/forum/[id]/ForumThreadClient.tsx',
    'app/guvenmetre/[categoryId]/page.tsx',
    'app/guvenmetre/page.tsx',
    'app/etkinlikler/page.tsx',
    'app/anket/page.tsx',
    'app/uzmana-sor/page.tsx'
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // This regex looks for randomListings.map or sampleListings.slice down to the closing Link or div.
    // It is specific to the remaining BMW M3 block and the "Tüm İlanları Gör" link.
    
    // Replace the randomListings.map container and the following Link
    content = content.replace(/<div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>\s*\{randomListings\.map[^]*?<\/Link>/, '{/* Pazar Icerikleri Gizlendi */}');
    
    // Replace sampleListings.slice container
    content = content.replace(/<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>\s*\{sampleListings\.slice[^]*?<\/div>\s*<\/div>/, '{/* Pazar Icerikleri Gizlendi */}</div>');
    
    // Replace the "Tüm İlanları Gör" link alone if it exists without the map
    content = content.replace(/<Link href="\/pazar" style={{ display: 'block', padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: 'var\(--primary\)', borderTop: '1px solid var\(--card-border\)', textDecoration: 'none', background: 'var\(--secondary\)' }}>\s*Tüm İlanları Gör\s*<\/Link>/, '{/* Tüm İlanları Gör Gizlendi */}');

    fs.writeFileSync(file, content);
    console.log('Processed ' + file);
}
