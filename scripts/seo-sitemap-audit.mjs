import fs from 'node:fs';
import {load} from 'cheerio';
import {robotsAllows} from './seo-robots.mjs';
const base=process.argv[2]||'http://127.0.0.1:3010';
const report=process.argv[3]||'docs/seo/step05-sitemap-audit.json';
const fetchXml=async path=>{const r=await fetch(new URL(path,base),{redirect:'manual',signal:AbortSignal.timeout(60000)});if(r.status!==200)throw Error(`${path}: ${r.status}`);const text=await r.text();return {text,$:load(text,{xmlMode:true}),bytes:Buffer.byteLength(text)};};
const root=await fetchXml('/sitemap.xml');if(!root.$('sitemapindex').length)throw Error('Not a sitemap index');
const robotsResponse=await fetch(new URL('/robots.txt',base));if(robotsResponse.status!==200)throw Error('robots.txt is unavailable');const robotsText=await robotsResponse.text();
const files=[],urls=[];
for(const path of root.$('sitemap > loc').map((_,el)=>root.$(el).text()).get()){
 const child=await fetchXml(new URL(path).pathname);const entries=child.$('url').map((_,el)=>({url:child.$(el).find('loc').text(),lastmod:child.$(el).find('lastmod').text()||null})).get();
 files.push({url:path,count:entries.length,bytes:child.bytes,errors:[...(child.$('priority,changefreq').length?['Obsolete attributes']:[]),...(entries.length>=50000||child.bytes>=50*1024*1024?['Size limit']:[])]});urls.push(...entries);
}
const checks=[];let i=0;await Promise.all(Array.from({length:6},async()=>{while(i<urls.length){const row=urls[i++],u=new URL(row.url);try{const r=await fetch(new URL(u.pathname+u.search,base),{redirect:'manual',signal:AbortSignal.timeout(45000),headers:{'User-Agent':'Googlebot'}}),$=load(await r.text());const errors=[];if(r.status!==200)errors.push(`HTTP ${r.status}`);if($('meta[name=robots],meta[name=googlebot]').toArray().some(el=>/noindex/.test($(el).attr('content')||'')))errors.push('noindex');if($('link[rel=canonical]').attr('href')!==row.url)errors.push('canonical');if(row.lastmod&&(!Number.isFinite(Date.parse(row.lastmod))||Date.parse(row.lastmod)>Date.now()))errors.push('Invalid lastmod');checks.push({...row,status:r.status,errors});}catch(e){checks.push({...row,errors:[e.message]});}}}));
const duplicates=urls.length-new Set(urls.map(row=>row.url)).size;
for(const check of checks){const u=new URL(check.url);if(!robotsAllows(robotsText,u.pathname+u.search))check.errors.push('robots.txt disallow');}
const failures=checks.filter(row=>row.errors.length);const out={checkedAt:new Date().toISOString(),base,files,total:urls.length,duplicates,failures:failures.length,lastmodPresent:urls.filter(row=>row.lastmod).length,checks};fs.writeFileSync(report,JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({...out,checks:undefined,failureExamples:failures.slice(0,15)},null,2));process.exitCode=duplicates||failures.length||files.some(row=>row.errors.length)?1:0;
