import fs from 'node:fs';
import path from 'node:path';
import {load} from 'cheerio';

const args=process.argv.slice(2);
const option=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const base=option('--base','http://127.0.0.1:3010');
const report=option('--report','docs/seo/internal-links.json');
const headers={'User-Agent':'Googlebot'};
async function request(path){const r=await fetch(new URL(path,base),{headers,redirect:'manual',signal:AbortSignal.timeout(45000)});return {r,text:await r.text()};}
async function sitemap(path){const {r,text}=await request(path);if(r.status!==200)throw Error(`Sitemap HTTP ${r.status}`);const $=load(text,{xmlMode:true}),children=$('sitemap > loc').map((_,n)=>$(n).text()).get();return children.length?(await Promise.all(children.map(url=>sitemap(new URL(url).pathname)))).flat():$('url > loc').map((_,n)=>$(n).text()).get();}
const pages=await sitemap('/sitemap.xml'),references=new Map(),responses=new Map(),pageErrors=[];
async function pool(values,fn){let i=0;await Promise.all(Array.from({length:6},async()=>{while(i<values.length)await fn(values[i++]);}));}
await pool(pages,async url=>{const u=new URL(url),path=u.pathname+u.search;try{const {r,text}=await request(path);responses.set(path,{status:r.status,location:r.headers.get('location')});if(r.status!==200){pageErrors.push({url,status:r.status});return;}const $=load(text);for(const a of $('a[href]').toArray()){const raw=$(a).attr('href');if(!raw||raw.startsWith('#'))continue;let target;try{target=new URL(raw,url);}catch{continue;}if(!['https://otosoz.com',new URL(base).origin].includes(target.origin))continue;if(!['http:','https:'].includes(target.protocol))continue;const path=target.pathname+target.search;if(!references.has(path))references.set(path,[]);const refs=references.get(path);if(refs.length<8)refs.push({page:url,anchor:$(a).text().trim().slice(0,120)});}}catch(e){pageErrors.push({url,error:e.message});}});
await pool([...references.keys()].filter(path=>!responses.has(path)),async path=>{try{const {r}=await request(path);responses.set(path,{status:r.status,location:r.headers.get('location')});}catch(e){responses.set(path,{status:null,error:e.message});}});
const failures=[...references].filter(([path])=>responses.get(path)?.status!==200).map(([path,from])=>({path,...responses.get(path),from})).sort((a,b)=>a.path.localeCompare(b.path));
const out={checkedAt:new Date().toISOString(),base,pages:pages.length,uniqueTargets:references.size,broken:failures.filter(x=>!x.status||x.status>=400).length,redirects:failures.filter(x=>x.status>=300&&x.status<400).length,pageErrors,failures};
fs.mkdirSync(path.dirname(report),{recursive:true});
fs.writeFileSync(report,JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({...out,failures:failures.slice(0,20)},null,2));process.exitCode=failures.length||pageErrors.length?1:0;
