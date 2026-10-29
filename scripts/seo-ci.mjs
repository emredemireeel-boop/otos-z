import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
const args=process.argv.slice(2),option=(n,d)=>args.includes(n)?args[args.indexOf(n)+1]:d;
const base=option('--base',process.env.SEO_BASE_URL||'http://127.0.0.1:3010'),out=option('--output','docs/seo/ci/latest');
fs.mkdirSync(out,{recursive:true});
let server=null;
const ready=async()=>{try{return (await fetch(new URL('/robots.txt',base),{signal:AbortSignal.timeout(2000)})).status===200;}catch{return false;}};
const results=[];
async function run(name,file,params){console.log(`SEO check: ${name}`);const log=fs.openSync(path.join(out,name+'.log'),'w');const exitCode=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[file,...params],{stdio:['ignore',log,log],env:process.env});child.on('error',reject);child.on('exit',code=>resolve(code??1));});fs.closeSync(log);results.push({name,exitCode,report:path.join(out,name+'.json')});if(exitCode!==0)throw Error(`${name} failed; see ${path.join(out,name+'.log')}`);}
try{
    if(!await ready()){
        const u=new URL(base);if(!['127.0.0.1','localhost'].includes(u.hostname))throw Error('Configured SEO base is unavailable');
        const log=fs.openSync(path.join(out,'server.log'),'w');server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','--port',u.port||'3010'],{stdio:['ignore',log,log],env:process.env});
        for(let i=0;i<50&&!await ready();i++)await new Promise(r=>setTimeout(r,300));
        if(!await ready())throw Error('Production build server did not start; run npm run build first');
    }
    await run('status','scripts/seo-status-check.mjs',['--base',base,'--report',path.join(out,'status.json')]);
    await run('sitemap','scripts/seo-sitemap-audit.mjs',[base,path.join(out,'sitemap.json')]);
    await run('schema','scripts/seo-schema-audit.mjs',['--all',base,path.join(out,'schema.json')]);
    await run('metadata','scripts/seo-metadata-audit.mjs',[base,path.join(out,'metadata.json')]);
    await run('links','scripts/seo-link-check.mjs',['--base',base,'--report',path.join(out,'links.json')]);
    console.log('SEO checks passed.');
}catch(e){console.error(e.message);process.exitCode=1;}
finally{if(server)server.kill();fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({checkedAt:new Date().toISOString(),base,passed:results.length===5&&results.every(r=>r.exitCode===0),results},null,2)+'\n');}
