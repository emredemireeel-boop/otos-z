// Use Wikimedia API to find actual filenames for Turkish road signs
const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'OtoAsfaltBot/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch(e) { reject(e); }
            });
        }).on('error', reject);
    });
}

async function listFiles(category, cmcontinue) {
    let url = `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtype=file&cmtitle=Category:${encodeURIComponent(category)}&cmlimit=500&format=json`;
    if (cmcontinue) url += `&cmcontinue=${cmcontinue}`;
    const data = await fetchJSON(url);
    const files = (data.query?.categorymembers || []).map(f => f.title);
    if (data.continue?.cmcontinue) {
        const more = await listFiles(category, data.continue.cmcontinue);
        return files.concat(more);
    }
    return files;
}

async function listSubcategories(category) {
    let url = `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtype=subcat&cmtitle=Category:${encodeURIComponent(category)}&cmlimit=500&format=json`;
    const data = await fetchJSON(url);
    return (data.query?.categorymembers || []).map(c => c.title.replace('Category:', ''));
}

async function main() {
    console.log('Fetching subcategories of "Diagrams of road signs of Turkey"...');
    const subcats = await listSubcategories('Diagrams of road signs of Turkey');
    console.log('Subcategories:', subcats);

    let allFiles = [];

    // Also get files directly in the main category
    const mainFiles = await listFiles('Diagrams of road signs of Turkey');
    allFiles = allFiles.concat(mainFiles);
    console.log(`Main category: ${mainFiles.length} files`);

    for (const sub of subcats) {
        console.log(`Fetching files from "${sub}"...`);
        const files = await listFiles(sub);
        allFiles = allFiles.concat(files);
        console.log(`  -> ${files.length} files`);
    }

    // Filter for Turkey road sign files
    const turkeyFiles = allFiles.filter(f => 
        f.toLowerCase().includes('turkey') && f.toLowerCase().includes('.svg')
    );

    console.log(`\nTotal Turkey SVG files found: ${turkeyFiles.length}`);
    
    // Save to file for inspection
    const outPath = path.join(__dirname, 'turkey_sign_files.json');
    fs.writeFileSync(outPath, JSON.stringify(turkeyFiles, null, 2));
    console.log(`Saved to ${outPath}`);
    
    // Print first 30
    turkeyFiles.slice(0, 30).forEach(f => console.log(f));
}

main().catch(console.error);
