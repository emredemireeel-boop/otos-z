import fs from 'node:fs';
import path from 'node:path';
import {load} from 'cheerio';

const args=process.argv.slice(2), option=(name, fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const base=option('--base','http://127.0.0.1:3010'), report=option('--report','docs/seo/publication-check.json');
const sections=JSON.parse(fs.readFileSync('data/site-sections.json'));
// These expectations are deliberately independent of the publication resolver.
const cases=[
    ['/arac-dna',404],
    ['/arac-dna/renault/clio',404], ['/arac-dna/Renault/clio-5-nesil-2020-2025',404],
    ['/arac-dna/renault/clio-5-nesil-2020-2025/kronik-sorunlar',404],
    ['/kutuphane',404], ['/kutuphane?kategori=bilinmeyen',404], ['/kutuphane/kategori/ikinci-el-rehberi',404],
    ['/makale',404], ['/haberler',404], ['/haberler/olmayan-haber',404], ['/news-sitemap.xml',404],
    ['/api/arac-dna?ids=1',404], ['/api/mobile/content?module=news',404], ['/api/mobile/content?module=vehicle-dna',404],
    ['/data/news_posts.json',404], ['/data/library_guides.json',404],
    ['/',200], ['/forum',308,'/'], ['/anket',308,'/'], ['/uzmana-sor',308,'/'], ['/hakkimizda',200],
    ['/forum/kategori/genel',308,'/#kategori-genel'],
    ['/uzmana-sor/ornek-dizel-arac-sogukta-beyaz-duman',404], ['/anket/curated-city-powertrain',404],
    ['/obd/p0420',200], ['/otohesap',200], ['/acik-oto-pazari',200],
    ['/nasil-yapilir/patlak-lastik-nasil-degistirilir',200],
];
const checks=[];
for(const [url,status,location] of cases) {
    const key=/arac-dna/i.test(url)||url.includes('vehicle-dna')?'vehicleDna':/haberler|news/.test(url)?'news':/^\/(?:kutuphane|makale|data\/library_guides)/.test(url)?'library':null;
    if(key && sections[key])continue;
    const r=await fetch(new URL(url,base),{redirect:'manual',signal:AbortSignal.timeout(45000)}),html=await r.text(),errors=[];
    if(r.status!==status)errors.push(`HTTP ${r.status}, expected ${status}`);
    const actualLocation=r.headers.get('location');
    if((actualLocation?new URL(actualLocation,base).href:undefined)!==(location?new URL(location,base).href:undefined))errors.push('Unexpected Location');
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
        if($('.home-seo-guide').length || /İçerikleri keşfet/.test($('body').text()))errors.push('Removed promotional home blocks remain');
        for(const old of ['/forum','/anket','/uzmana-sor'])if($(`a[href="${old}"]`).length)errors.push('Legacy listing link: '+old);
        if(!Object.values(sections).some(Boolean)&&/Araç DNA|Kütüphaneden|Son haberler/.test($('body').text()))errors.push('Retired homepage promotion remains');
        if($('a[href="https://otokusur.com/"],a[href="https://www.obdkodu.com/"],a[href="/#anket"],a[href="/#uzmana-sor"]').length)errors.push('Separate feature/project navigation remains on the home');
        if(/Aktif Anketler|Topluluk anketleri/.test($('body').text()))errors.push('Separate poll listing remains');
        for(const card of $('[data-community-type="survey"]').toArray())if(!$(card).find('a[aria-expanded="false"]').length || !$(card).find('.forum-topic-type-badge').text().includes('Anket'))errors.push('Poll is not a collapsed forum title');
    }
    if(url==='/hakkimizda') {
        const $=load(html),projects=$('#projelerimiz');
        if(!projects.text().includes('Emre Demirel'))errors.push('Project responsibility must be visible');
        for(const target of ['https://otokusur.com/','https://www.obdkodu.com/'])if(projects.find(`a[href="${target}"]`).length!==1)errors.push('Missing or repeated contextual project link');
        if($('link[rel="canonical"]').attr('href')!=='https://otosoz.com/hakkimizda')errors.push('About must retain its own canonical');
    }
    checks.push({url,status:r.status,location:r.headers.get('location'),errors});
}
const out={checkedAt:new Date().toISOString(),base,total:checks.length,failed:checks.filter(row=>row.errors.length).length,checks};
fs.mkdirSync(path.dirname(report),{recursive:true});fs.writeFileSync(report,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));process.exitCode=out.failed?1:0;
