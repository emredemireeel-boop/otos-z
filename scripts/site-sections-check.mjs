import fs from 'node:fs';
import path from 'node:path';
const settings=JSON.parse(fs.readFileSync('data/site-sections.json'));
const roots={vehicleDna:['app/arac-dna','app/api/arac-dna'],library:['app/kutuphane','app/makale'],news:['app/haberler','app/news-sitemap.xml']};
const errors=[];let preserved=0;
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())walk(file);else if(/^(page|layout|loading|not-found|route)\.(tsx?|jsx?)$/.test(item.name))errors.push(file);else if(item.name.includes('.paused.'))preserved++;}}
for(const [name,dirs] of Object.entries(roots))if(settings[name]===false)dirs.forEach(walk);
if(errors.length){console.error('Unpublished routes would enter the production build:',errors);process.exitCode=1;}else console.log(`Publication gate passed; ${preserved} route sources preserved outside the route tree.`);
