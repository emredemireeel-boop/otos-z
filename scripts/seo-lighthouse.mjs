import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
const args=process.argv.slice(2),option=(n,d)=>args.includes(n)?args[args.indexOf(n)+1]:d;
const stage=option('--stage','before'),base=option('--base','http://127.0.0.1:3010');
const chrome=process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const cli=option('--cli',process.env.LIGHTHOUSE_CLI);
if(!cli||!fs.existsSync(cli))throw Error('Provide --cli /path/to/lighthouse/cli/index.js (installed with npm exec --package lighthouse)');
const reports=path.resolve(`docs/seo/lighthouse-${stage}`);fs.mkdirSync(reports,{recursive:true});
const thread=JSON.parse(fs.readFileSync('docs/seo/step07-after.json')).results.find(r=>new URL(r.url).pathname.startsWith('/forum/')&&!r.url.includes('/kategori/')).url;
const routes=[['home','/'],['obd','/obd/p0420'],['dna-model','/arac-dna/renault/clio-5-nesil-2020-2025'],['dna-chronic','/arac-dna/renault/clio-5-nesil-2020-2025/kronik-sorunlar'],['library-category','/kutuphane/kategori/ikinci-el-rehberi'],['forum-thread',new URL(thread).pathname]];
const only=option('--only','').split(',').filter(Boolean),summaryFile=`docs/seo/step09-${stage}.json`;
const results=only.length&&fs.existsSync(summaryFile)?JSON.parse(fs.readFileSync(summaryFile)).results.filter(row=>!only.includes(row.type)):[];
for(const [type,route] of routes.filter(([type])=>!only.length||only.includes(type))){
    const report=path.join(reports,type+'.json'),log=fs.openSync(path.join(reports,type+'.log'),'w');
    const flags=['--preset=perf','--form-factor=mobile','--screenEmulation.mobile=true','--chrome-flags=--headless=new --no-sandbox --disable-gpu','--output=json',`--output-path=${report}`,'--save-assets','--quiet'];
    console.log(`Lighthouse mobile ${stage}: ${type}`);
    let exit=1;
    for(let attempt=1;attempt<=3;attempt++){
        exit=await new Promise((resolve,reject)=>{const p=spawn(process.execPath,[cli,new URL(route,base).href,...flags],{stdio:['ignore',log,log],env:{...process.env,CHROME_PATH:chrome}});p.on('error',reject);p.on('exit',code=>resolve(code));});
        if(!fs.existsSync(report))continue;
        const trial=JSON.parse(fs.readFileSync(report));
        if(!trial.runtimeError)break;
        fs.copyFileSync(report,path.join(reports,`${type}.failed-attempt-${attempt}.json`));
        console.log(`${type}: retrying invalid Lighthouse trace (${trial.runtimeError.code}), attempt ${attempt}/3`);
    }
    fs.closeSync(log);
    if(!fs.existsSync(report)){results.push({type,route,error:'Lighthouse failed',exit});continue;}
    const data=JSON.parse(fs.readFileSync(report)),audits=data.audits,requests=audits['network-requests']?.details?.items||[],scripts=requests.filter(r=>r.resourceType==='Script');
    results.push({type,route,score:Math.round((data.categories?.performance?.score||0)*100),lcpMs:audits['largest-contentful-paint']?.numericValue,tbtMs:audits['total-blocking-time']?.numericValue,cls:audits['cumulative-layout-shift']?.numericValue,jsTransferBytes:scripts.reduce((n,r)=>n+(r.transferSize||0),0),jsResourceBytes:scripts.reduce((n,r)=>n+(r.resourceSize||0),0),scripts:scripts.map(r=>({url:r.url,transferSize:r.transferSize,resourceSize:r.resourceSize})),errors:data.runtimeError?[data.runtimeError]:[],report});
    fs.writeFileSync(summaryFile,JSON.stringify({measuredAt:new Date().toISOString(),stage,base,chrome,mode:'Lighthouse mobile navigation (simulated throttling); TBT is a lab proxy, not a measured field INP.',results},null,2)+'\n');
    console.log(JSON.stringify(results.at(-1),(k,v)=>k==='scripts'?undefined:v));
}
process.exitCode=results.some(r=>r.error||r.errors?.length)?1:0;
