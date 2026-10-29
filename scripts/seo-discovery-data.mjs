import fs from 'node:fs';
import {loadSource} from './seo-quality-loader.mjs';
const {vehicleDNAData,createSlug}=loadSource('data/vehicle-dna.ts'),{isVehicleIndexable}=loadSource('lib/indexability.ts'),{indexableObdCodes}=loadSource('lib/obd-catalog.ts');
const source='docs/seo/performance-20261022/Sayfa sayısı.csv';
const history=new Map(JSON.parse(fs.readFileSync('docs/seo/historical-landing-audit-20261022.json')).map(r=>[r.url,r.final]));
const models=vehicleDNAData.filter(isVehicleIndexable).map(v=>({url:`https://otosoz.com/arac-dna/${createSlug(v.brand)}/${createSlug(v.model)}`,title:v.brand+' '+v.model,clicks:0,impressions:0}));
const codes=indexableObdCodes.map(c=>({url:`https://otosoz.com/obd/${c.code.toLowerCase()}`,title:c.code+' — '+c.title,clicks:0,impressions:0}));
// This export contains only URL/numeric fields; commas are never embedded in URLs.
for(const line of fs.readFileSync(source,'utf8').trim().split(/\r?\n/).slice(1)){
    const [raw,clicks,impressions]=line.split(','),u=new URL(history.get(raw)||raw);u.hostname='otosoz.com';u.protocol='https:';
    const model=models.find(row=>u.pathname===new URL(row.url).pathname||u.pathname.startsWith(new URL(row.url).pathname+'/'));
    const code=codes.find(row=>u.pathname===new URL(row.url).pathname);
    for(const row of [model,code].filter(Boolean)){row.clicks+=Number(clicks);row.impressions+=Number(impressions);}
}
const rank=rows=>rows.filter(r=>r.impressions>0).sort((a,b)=>b.impressions-a.impressions||b.clicks-a.clicks);
const report={source,exportDate:'2026-10-22',metric:'Historical page impressions in the supplied export, aggregated by canonical model. Not sales, live search volume or total popularity.',models:rank(models).slice(0,10),obd:rank(codes).slice(0,10)};
fs.writeFileSync('data/seo-discovery.json',JSON.stringify(report,null,2)+'\n');console.log({models:report.models.length,obd:report.obd.length});
