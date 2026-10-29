import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const args=process.argv.slice(2),value=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const cli=value('--cli',process.env.LIGHTHOUSE_CLI),base=value('--base','http://127.0.0.1:3010');
if(!cli)throw Error('Supply --cli pointing to lighthouse/cli/index.js');
const types=['home','obd','dna-model','dna-chronic','library-category','forum-thread'];
const selected=[],samples=[];
for(const type of types){
    const trials=[];
    for(let run=1;run<=3;run++){
        console.log(`Mobile measurement ${type}, repeat ${run}/3`);
        const folder=path.join('docs/seo/lighthouse-after/trials',type,String(run));fs.mkdirSync(folder,{recursive:true});
        const child=spawnSync(process.execPath,['scripts/seo-lighthouse.mjs','--stage','after','--only',type,'--base',base,'--cli',cli],{encoding:'utf8',timeout:600000});
        fs.writeFileSync(path.join(folder,'run.log'),(child.stdout||'')+'\n'+(child.stderr||''));
        const report=JSON.parse(fs.readFileSync(`docs/seo/lighthouse-after/${type}.json`));
        if(child.error||report.runtimeError)throw Error(`${type}: invalid measurement, see ${folder}/run.log`);
        for(const file of fs.readdirSync('docs/seo/lighthouse-after').filter(name=>name===type+'.json'||name.startsWith(type+'-0.')))fs.copyFileSync(path.join('docs/seo/lighthouse-after',file),path.join(folder,file));
        const row=JSON.parse(fs.readFileSync('docs/seo/step09-after.json')).results.find(r=>r.type===type);
        trials.push({run,folder,row});console.log(JSON.stringify({type,run,score:row.score,lcpMs:row.lcpMs,tbtMs:row.tbtMs,cls:row.cls}));
    }
    // Use the middle performance run, never the best run. Keep all three.
    const middle=[...trials].sort((a,b)=>a.row.score-b.row.score||a.run-b.run)[1];
    for(const file of fs.readdirSync(middle.folder).filter(name=>name!== 'run.log'))fs.copyFileSync(path.join(middle.folder,file),path.join('docs/seo/lighthouse-after',file));
    selected.push({...middle.row,selectedRun:middle.run,selection:'Median performance score of three consecutive valid runs'});
    samples.push({type,selectedRun:middle.run,runs:trials.map(({run,row})=>({run,score:row.score,lcpMs:row.lcpMs,tbtMs:row.tbtMs,cls:row.cls,jsTransferBytes:row.jsTransferBytes}))});
    const result={measuredAt:new Date().toISOString(),stage:'after',base,mode:'Lighthouse mobile navigation; median performance run of 3 per template. All repeats retained. TBT is not field INP.',results:selected};
    fs.writeFileSync('docs/seo/step09-after-median.json',JSON.stringify(result,null,2)+'\n');
    fs.writeFileSync('docs/seo/step09-repeatability.json',JSON.stringify({method:'Middle performance score, three consecutive runs per template; no best-run selection',samples},null,2)+'\n');
}
fs.copyFileSync('docs/seo/step09-after-median.json','docs/seo/step09-after.json');
