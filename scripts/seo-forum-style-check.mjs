import fs from 'node:fs';
import {load} from 'cheerio';

export function forumStyleDecision(html,styles=[]){
    const $=load(html),button=$('button.forum-thread-action-primary');
    if(button.length!==1)return {passed:false,reason:'Forum reply action missing'};
    const matched=[];
    const delivered=[...styles,...$('style').map((_,node)=>$(node).text()).get()];
    for(const css of delivered)for(const [,selector,body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)){
        for(const candidate of selector.split(',')){
            try{if(button.is(candidate.trim()))matched.push(body);}catch{/* unrelated pseudo selectors */}
        }
    }
    const applied=matched.join(';');
    const background=/(?:^|;)\s*background(?:-color)?\s*:\s*(?:white|#fff(?:fff)?)(?:\s*[;!]|\s*$)/i.test(applied);
    const height=/(?:^|;)\s*min-height\s*:\s*40px(?:\s*[;!]|\s*$)/i.test(applied);
    return {passed:background&&height,replyButtonMatches:matched.length,backgroundApplied:background,minHeightApplied:height,reason:background&&height?null:'First HTML action lacks matching server-delivered CSS'};
}

if(process.argv[1]?.replaceAll('\\','/').endsWith('/seo-forum-style-check.mjs')){
    const base=process.argv[2]||'http://127.0.0.1:3010',output=process.argv[3]||'docs/seo/forum-style-check.json';
    const cases=JSON.parse(fs.readFileSync('scripts/seo-status-cases.json'));
    const route=cases.find(row=>row.status===200&&/^\/forum\/[^/]+$/.test(row.url)&&!row.url.includes('sayfa'))?.url;
    if(!route)throw Error('A real forum fixture is required');
    const response=await fetch(new URL(route,base)),html=await response.text(),$=load(html);
    const urls=$('link[rel="stylesheet"]').map((_,node)=>$(node).attr('href')).get();
    const styles=await Promise.all(urls.map(async url=>{const r=await fetch(new URL(url,base));if(r.status!==200)throw Error('Stylesheet unavailable');return r.text();}));
    const report={checkedAt:new Date().toISOString(),base,route,httpStatus:response.status,scriptsExecuted:false,...forumStyleDecision(html,styles)};
    report.passed=report.passed&&response.status===200;
    fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
    if(!report.passed)process.exitCode=1;
}
