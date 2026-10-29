import fs from 'node:fs';
import {load} from 'cheerio';
import {loadSource} from './seo-quality-loader.mjs';

// Fetch-only checks: scripts and styles are discarded before inspecting text.
const base=process.argv[2] || 'http://127.0.0.1:3010';
const reportPath=process.argv[3] || 'docs/seo/step04-ssr-check.json';
const normalize=value=>String(value).replace(/\s+/g,' ').trim();
const {vehicleDNAData,createSlug}=loadSource('data/vehicle-dna.ts');
const {isVehicleIndexable}=loadSource('lib/indexability.ts');
const {engineDNAData}=loadSource('data/engine-dna.ts');
const models=['Renault','Fiat','Toyota'].map(brand=>vehicleDNAData.find(vehicle=>vehicle.brand===brand && isVehicleIndexable(vehicle)));
const pathFor=vehicle=>`/arac-dna/${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`;
const expected=new Map();
for(const vehicle of models){
    const path=pathFor(vehicle);
    expected.set(path,[vehicle.brand,vehicle.model,...vehicle.strengths.slice(0,4),...vehicle.weaknesses.slice(0,4)]);
    expected.set(`${path}/kronik-sorunlar`,vehicle.chronicIssues.flatMap(issue=>[issue.title,issue.description]));
    expected.set(`${path}/neden-alinir`,[...vehicle.strengths,...vehicle.weaknesses]);
}
for(const vehicle of models.slice(0,2)){
    const engine=engineDNAData.find(record=>record.vehicleId===vehicle.id)?.engines[0];
    if(engine)expected.set(`${pathFor(vehicle)}/${engine.slug}`,[engine.name,...(engine.pros||[]),...(engine.cons||[])]);
}
const sitemap=await fetch(new URL('/sitemap.xml',base)).then(response=>response.text());
const sitemapUrls=[...sitemap.matchAll(/<loc>\s*([^<]+)<\/loc>/g)].map(match=>match[1].replaceAll('&amp;','&'));
const htmlPaths=sitemapUrls.map(url=>new URL(url)).filter(url=>!url.pathname.endsWith('.xml')&&!url.pathname.startsWith('/api/')).map(url=>url.pathname+url.search);
const targets=[...new Set([...htmlPaths,...expected.keys(),...['kullanici-deneyimleri','arac-paketleri'].map(section=>`${pathFor(models[0])}/${section}`)])];
const results=[];let next=0;
await Promise.all(Array.from({length:6},async()=>{
    while(next<targets.length){
        const path=targets[next++];
        try{
            const response=await fetch(new URL(path,base),{redirect:'manual',signal:AbortSignal.timeout(45000)});
            const $=load(await response.text());$('script,style,template').remove();
            const main=$('main').length?$('main').text():$('body').clone().find('header,nav,footer').remove().end().text();
            const text=normalize(main),h1s=$('h1').map((_,element)=>normalize($(element).text())).get();
            const missing=(expected.get(path)||[]).filter(value=>!text.includes(normalize(value)));
            const errors=[];
            if(response.status!==200)errors.push(`HTTP ${response.status}`);
            if(h1s.length!==1)errors.push(`${h1s.length} H1`);
            if(text.length<100)errors.push(`Only ${text.length} main text characters`);
            if(missing.length)errors.push(`Missing ${missing.length} source text fields`);
            results.push({path,status:response.status,h1s,textCharacters:text.length,expectedFields:(expected.get(path)||[]).length,missing,errors});
        }catch(error){results.push({path,errors:[error.message]});}
    }
}));
const apiResults=[];
for(const [path,status,count] of [
    [`/api/arac-dna?ids=${models[0].id}`,200,1],
    [`/api/arac-dna?ids=${models.map(vehicle=>vehicle.id).join(',')}`,200,3],
    ['/api/arac-dna?ids=1,2,3,4',400],['/api/arac-dna?ids=invalid',400],['/api/arac-dna?ids=999999999',404],
    ['/api/car-options?brand=Renault',200],['/api/car-options?brand=invalid-brand',404],
    ['/api/advertisements?position=invalid!position',400]
]){
    const response=await fetch(new URL(path,base),{redirect:'manual'}),body=await response.json(),errors=[];
    if(response.status!==status)errors.push(`Expected ${status}, got ${response.status}`);
    if(count && body.records?.length!==count)errors.push('Selected record bound violated');
    if(path.includes('car-options?brand=Renault') && (!body.models?.includes('Clio') || Object.keys(body).join()!=='models'))errors.push('Brand projection invalid');
    apiResults.push({path,status:response.status,recordCount:body.records?.length,errors});
}
const before=JSON.parse(fs.readFileSync('docs/seo/step04-before.json','utf8'));
const after=JSON.parse(fs.readFileSync('docs/seo/step04-after.json','utf8'));
const comparisons=models.map(vehicle=>{
    const path=pathFor(vehicle),a=before.measurements.find(row=>row.route===path),b=after.measurements.find(row=>row.route===path);
    return {path,beforeRaw:a.firstLoadRawBytes,afterRaw:b.firstLoadRawBytes,rawReduction:1-b.firstLoadRawBytes/a.firstLoadRawBytes,
        beforeGzip:a.firstLoadGzipBytes,afterGzip:b.firstLoadGzipBytes,gzipReduction:1-b.firstLoadGzipBytes/a.firstLoadGzipBytes,
        mainTextBefore:a.textCharacters,mainTextAfter:b.textCharacters};
});
const failures=results.filter(row=>row.errors.length),apiFailures=apiResults.filter(row=>row.errors.length);
const report={checkedAt:new Date().toISOString(),base,scriptsExecuted:false,sitemapHtmlCount:htmlPaths.length,checked:results.length,
    failures:failures.length,apiFailures:apiFailures.length,comparisons,results:results.sort((a,b)=>a.path.localeCompare(b.path)),apiResults};
fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({checked:results.length,failures,apiFailures,comparisons},null,2));
process.exitCode=failures.length||apiFailures.length||comparisons.some(row=>row.rawReduction<0.5)?1:0;
