import fs from 'node:fs';
import path from 'node:path';
import {load} from 'cheerio';

const args=process.argv.slice(2), option=(name, fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const base=option('--base','http://127.0.0.1:3010'), report=option('--report','docs/seo/publication-check.json');
const sections=JSON.parse(fs.readFileSync('data/site-sections.json'));
// These expectations are deliberately independent of the publication resolver.
const cases=[
    ['/arac-dna',307,'https://otokusur.com/'],
    ['/arac-dna/renault/clio',404], ['/arac-dna/Renault/clio-5-nesil-2020-2025',404],
    ['/arac-dna/renault/clio-5-nesil-2020-2025/kronik-sorunlar',404],
    ['/kutuphane',404], ['/kutuphane?kategori=bilinmeyen',404], ['/kutuphane/kategori/ikinci-el-rehberi',404],
    ['/makale',404], ['/haberler',404], ['/haberler/olmayan-haber',404], ['/news-sitemap.xml',404],
    ['/api/arac-dna?ids=1',404], ['/api/mobile/content?module=news',404], ['/api/mobile/content?module=vehicle-dna',404],
    ['/data/news_posts.json',404], ['/data/library_guides.json',404],
    ['/',200], ['/forum',200], ['/obd/p0420',200], ['/otohesap',200], ['/acik-oto-pazari',200],
    ['/nasil-yapilir/patlak-lastik-nasil-degistirilir',200],
];
const checks=[];
for(const [url,status,location] of cases) {
    if(status!==200){const key=/arac-dna/i.test(url)||url.includes('vehicle-dna')?'vehicleDna':/haberler|news/.test(url)?'news':'library';if(sections[key])continue;}
    const r=await fetch(new URL(url,base),{redirect:'manual',signal:AbortSignal.timeout(45000)}),html=await r.text(),errors=[];
    if(r.status!==status)errors.push(`HTTP ${r.status}, expected ${status}`);
    if((r.headers.get('location')||undefined)!==location)errors.push('Unexpected Location');
    if(/<meta\b[^>]*http-equiv\s*=\s*["']?refresh/i.test(html))errors.push('Meta refresh');
    if(url.startsWith('/nasil-yapilir/') && !sections.library){
        const $=load(html);
        if(!$('meta[name="robots"]').attr('content')?.includes('noindex'))errors.push('Disconnected helper must be noindex');
        if(/"@type"\s*:\s*"(?:Article|FAQPage)"/.test($('script[type="application/ld+json"]').text()))errors.push('Noindex helper must not emit Article/FAQ');
    }
    if(url==='/') {
        const $=load(html);$('script,style,template').remove();
        if($('h1').length!==1)errors.push('Homepage H1 count');
        if(!/otomobil forumu/i.test($('h1').text()))errors.push('Homepage must focus on the forum');
        if(!Object.values(sections).some(Boolean)&&/Araç DNA|Kütüphaneden|Son haberler/.test($('body').text()))errors.push('Retired homepage promotion remains');
        if(!sections.vehicleDna&&!$('a[href="https://otokusur.com/"]').length)errors.push('Missing OtoKusur link');
    }
    checks.push({url,status:r.status,location:r.headers.get('location'),errors});
}
const out={checkedAt:new Date().toISOString(),base,total:checks.length,failed:checks.filter(row=>row.errors.length).length,checks};
fs.mkdirSync(path.dirname(report),{recursive:true});fs.writeFileSync(report,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));process.exitCode=out.failed?1:0;
