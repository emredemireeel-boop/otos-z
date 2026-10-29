import fs from 'node:fs';
import path from 'node:path';
import {load} from 'cheerio';
import {breadthFirstDepth} from './seo-html-graph.mjs';
const args=process.argv.slice(2),option=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const base=option('--base','http://127.0.0.1:3010'),output=option('--report','docs/seo/step08-links.json'),limit=Number(option('--max-pages','7000'));
const origin=new URL(base).origin,site='https://otosoz.com';
async function request(target){return fetch(new URL(target,base),{redirect:'manual',headers:{'User-Agent':'Googlebot'},signal:AbortSignal.timeout(45000)});}
async function sitemap(target,seen=new Set()){
    if(seen.has(target))throw Error('Sitemap cycle');seen.add(target);
    const r=await request(target);if(r.status!==200)throw Error(`Sitemap ${target}: HTTP ${r.status}`);
    const $=load(await r.text(),{xmlMode:true}),children=$('sitemap > loc').map((_,n)=>$(n).text()).get();
    return children.length?(await Promise.all(children.map(u=>sitemap(new URL(u).pathname,seen)))).flat():$('url > loc').map((_,n)=>new URL($(n).text()).pathname).get();
}
const indexable=new Set(await sitemap('/sitemap.xml')),queue=[...new Set(['/',...indexable])],queued=new Set(queue),graph=new Map(),statuses=new Map(),inbound=new Map(),aliasLinks=[],failures=[];
let cursor=0,completed=0,exceeded=false;
// Seed every indexable URL to identify genuinely unlinked pages; BFS itself
// starts only at /. Discoveries come exclusively from literal HTML a[href].
await Promise.all(Array.from({length:6},async()=>{
    while(true){
        if(cursor>=queue.length)return;
        if(cursor>=limit){exceeded=true;return;}
        const source=queue[cursor++];
        try{
            const r=await request(source);statuses.set(source,{status:r.status,location:r.headers.get('location')});
            const text=await r.text(),targets=new Set();graph.set(source,targets);
            if(r.status!==200){failures.push({path:source,status:r.status,location:r.headers.get('location')});continue;}
            if(!/text\/html/i.test(r.headers.get('content-type')||''))continue;
            const $=load(text);
            for(const node of $('a[href]').toArray()){
                const raw=$(node).attr('href');if(!raw||raw.startsWith('#'))continue;
                let url;try{url=new URL(raw,new URL(source,site));}catch{continue;}
                if(![new URL(site).hostname,'www.otosoz.com',new URL(base).hostname].includes(url.hostname)||!['http:','https:'].includes(url.protocol))continue;
                if(url.origin!==site&&url.origin!==origin)aliasLinks.push({source,href:raw});
                const target=url.pathname+url.search;if(target===source)continue;
                targets.add(target);if(!inbound.has(target))inbound.set(target,new Set());inbound.get(target).add(source);
                if(!queued.has(target)){queued.add(target);queue.push(target);}
            }
        }catch(e){statuses.set(source,{status:null});failures.push({path:source,error:e.message});}
        finally{completed++;if(completed%500===0)console.log(`HTML crawl: ${completed} fetched, ${queue.length} discovered`);}
    }
}));
const depth=breadthFirstDepth(graph);
const pages=[...indexable].map(url=>({url:site+(url==='/'?'/':url),path:url,depth:depth.get(url)??null,inbound:inbound.get(url)?.size||0}));
const orphans=pages.filter(r=>r.path!=='/'&&r.inbound===0),deep=pages.filter(r=>r.depth===null||r.depth>3),unreachable=pages.filter(r=>r.depth===null);
const counts={};for(const row of pages){const key=row.depth??'unreachable';counts[key]=(counts[key]||0)+1;}
const linkedFailures=failures.filter(r=>inbound.has(r.path)||indexable.has(r.path));
const report={checkedAt:new Date().toISOString(),base,definition:'Complete HTML a[href] graph; sitemap seeds identify orphans, only / seeds shortest-path BFS. Redirects are not followed. No script/RSC/onClick links are counted.',indexable:indexable.size,crawled:statuses.size,discovered:queue.length,limit,exceeded,orphans:orphans.length,unreachable:unreachable.length,deep:deep.length,deepPercent:100*deep.length/indexable.size,depthCounts:counts,aliasLinks,brokenLinks:linkedFailures.filter(r=>!r.status||r.status>=400),redirectLinks:linkedFailures.filter(r=>r.status>=300&&r.status<400),orphanPages:orphans,deepPages:deep,pages};
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,pages:undefined,deepPages:deep.slice(0,15)},null,2));
if(!args.includes('--observe'))process.exitCode=exceeded||orphans.length||report.deepPercent>=5||report.brokenLinks.length||report.redirectLinks.length||aliasLinks.length?1:0;
