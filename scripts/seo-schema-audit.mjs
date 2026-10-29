import fs from 'node:fs';
import ts from 'typescript';
import {load} from 'cheerio';
const args=process.argv.slice(2),base=args.find(value=>value.startsWith('http'))||'http://127.0.0.1:3010';
const report=args.find(value=>value.endsWith('.json'))||'docs/seo/step06-schema-audit.json';
const all=args.includes('--all');
const plain=value=>load(String(value||''),null,false).text().normalize('NFC').replace(/\s+/g,' ').trim();
async function list(path,seen=new Set()){
 if(seen.has(path))throw Error('Sitemap cycle');seen.add(path);
 const r=await fetch(new URL(path,base),{redirect:'manual',signal:AbortSignal.timeout(45000)});if(r.status!==200)throw Error('Sitemap '+r.status);
 const $=load(await r.text(),{xmlMode:true});const nested=$('sitemap > loc').map((_,n)=>$(n).text()).get();
 return nested.length?(await Promise.all(nested.map(u=>list(new URL(u).pathname,seen)))).flat():$('url > loc').map((_,n)=>$(n).text()).get();
}
function routeType(url){const p=new URL(url).pathname.split('/').filter(Boolean);if(p[0]==='arac-dna')return p.length<3?'dna-hub':p.length===3?'dna-model':['kronik-sorunlar','neden-alinir','arac-paketleri','kullanici-deneyimleri'].includes(p[3])?'dna-'+p[3]:'dna-engine';if(p[0]==='kutuphane')return p[1]||'library-hub';return p[0]||'home';}
const sitemap=await list('/sitemap.xml'),groups=new Map();for(const url of sitemap){const type=routeType(url);if(!groups.has(type))groups.set(type,[]);groups.get(type).push(url);}
const targets=all?sitemap:[...groups.values()].flatMap(urls=>urls.slice(0,3));
const results=[];let cursor=0;
await Promise.all(Array.from({length:6},async()=>{while(cursor<targets.length){const url=targets[cursor++],path=new URL(url).pathname;try{
 const response=await fetch(new URL(path,base),{redirect:'manual',headers:{'User-Agent':'Googlebot'},signal:AbortSignal.timeout(45000)}),$=load(await response.text());const errors=[],gaps=[],nodes=[],parseErrors=[];
 function visit(n){if(!n||typeof n!=='object')return;if(n['@type'])nodes.push(n);Object.values(n).forEach(v=>Array.isArray(v)?v.forEach(visit):visit(v));}
 $('script[type="application/ld+json"]').each((_,el)=>{try{visit(JSON.parse($(el).text()));}catch(error){parseErrors.push(error.message);}});
 if(response.status!==200)errors.push('HTTP '+response.status);errors.push(...parseErrors.map(value=>'JSON parse: '+value));
 $('script,style,template').remove();$('p,li,summary,h1,h2,h3,br').append(' ');const text=($('main').length?$('main').text():$('body').text()).normalize('NFC').replace(/\s+/g,' ').trim();
 const crumbs=nodes.filter(n=>n['@type']==='BreadcrumbList');
 const visible=$('[data-seo-breadcrumb] [data-breadcrumb-name]').map((_,el)=>({name:$(el).attr('data-breadcrumb-name'),item:$(el).attr('data-breadcrumb-url')})).get();
 if(path!=='/'){
  if(crumbs.length!==1)errors.push(`Expected one BreadcrumbList, found ${crumbs.length}`);
  if(!visible.length)errors.push('Missing server-rendered visible breadcrumb');
  if(crumbs[0]){const items=crumbs[0].itemListElement||[],expected=items.map((n,i)=>({name:n.name,item:typeof n.item==='string'?n.item:n.item?.['@id']}));
   if(JSON.stringify(expected)!==JSON.stringify(visible))errors.push('Visible breadcrumb differs from JSON-LD');
   if(items.some((item,i)=>item.position!==i+1))errors.push('Breadcrumb positions invalid');
   if(crumbs[0]['@id']!==url+'#breadcrumb')errors.push('Breadcrumb ID differs from canonical URL');
   if(expected.at(-1)?.item!==url)errors.push('Last breadcrumb item differs from canonical URL');
  }
 }
 let faqQuestions=0;
 for(const n of nodes){const type=n['@type'];
  if(['Article','NewsArticle'].includes(type)){
   for(const field of ['headline','description','image','publisher','mainEntityOfPage','author'])if(!n[field])errors.push(`${type} missing ${field}`);
   for(const field of ['datePublished','dateModified'])if(!n[field])gaps.push(`${type} unavailable ${field}`);
   for(const field of ['datePublished','dateModified'])if(n[field]&&(!Number.isFinite(Date.parse(n[field]))||Date.parse(n[field])>Date.now()))errors.push('Invalid/future '+field);
   if(n.headline?.length>110)errors.push('Headline >110');
   if(n.author?.['@type']!=='Organization'||n.author?.['@id']!=='https://otosoz.com/#organization')errors.push('Article publisher/author identity is not the organization');
   if(n.publisher?.['@id']!=='https://otosoz.com/#organization')errors.push('Publisher reference missing');
   if(n.image?.width<1200)errors.push('Article image narrower than 1200');
   if(n.mainEntityOfPage?.['@id']!==url+'#webpage')errors.push('Article mainEntityOfPage differs from canonical');
  }
  if(type==='FAQPage')for(const question of n.mainEntity||[]){faqQuestions++;const q=plain(question.name),answer=plain(question.acceptedAnswer?.text);if(!q||!answer||!text.includes(q)||!text.includes(answer))errors.push('FAQ not present in body: '+q);}
  if(type==='HowTo')errors.push('Unsupported HowTo remains');
  if(type==='QAPage'&&!(n.mainEntity?.acceptedAnswer||n.mainEntity?.suggestedAnswer?.length))errors.push('QAPage has no real answers');
  if(type==='DiscussionForumPosting'){
   for(const field of ['text','author','datePublished','interactionStatistic'])if(!n[field])errors.push('Discussion missing '+field);
   for(const comment of n.comment||[])if(!text.includes(plain(comment.text)))errors.push('Discussion comment not in first HTML');
  }
 }
 results.push({type:routeType(url),url,status:response.status,nodes:nodes.map(n=>n['@type']),faqQuestions,breadcrumbItems:visible.length,parseErrors,errors,gaps});
 }catch(error){results.push({type:routeType(url),url,errors:[error.message],gaps:[],parseErrors:[]});}
}}));
const sourceFiles=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(p.endsWith('.tsx'))sourceFiles.push(p);}}walk('app');walk('components');
const clientEmitters=sourceFiles.filter(file=>{const text=fs.readFileSync(file,'utf8'),tree=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);return tree.statements.some(n=>ts.isExpressionStatement(n)&&n.expression.text==='use client')&&text.includes('application/ld+json');});
const failures=results.filter(row=>row.errors.length);
const out={checkedAt:new Date().toISOString(),base,mode:all?'all-indexable':'up-to-three-per-route-type',sitemapCount:sitemap.length,sampled:results.length,types:groups.size,parseErrors:results.reduce((s,r)=>s+(r.parseErrors?.length||0),0),errors:results.reduce((s,r)=>s+r.errors.length,0),missingRecordDates:results.reduce((s,r)=>s+r.gaps.length,0),clientEmitters,byType:Object.fromEntries([...groups].map(([type,urls])=>[type,{available:urls.length,sampled:results.filter(row=>row.type===type).length}])),results:results.sort((a,b)=>a.url.localeCompare(b.url))};
fs.writeFileSync(report,JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({...out,results:failures.slice(0,25)},null,2));process.exitCode=out.errors||clientEmitters.length?1:0;
