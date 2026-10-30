import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const args=process.argv.slice(2),value=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const cli=value('--cli',process.env.LIGHTHOUSE_CLI),base=value('--base','http://127.0.0.1:3010');
const stage=value('--stage','after');
if(!/^[a-z0-9-]+$/.test(stage))throw Error('Stage must contain only lowercase letters, digits and hyphens');
const reports=`docs/seo/lighthouse-${stage}`,summary=`docs/seo/step09-${stage}`;
const trialRoot=value('--artifact-root',path.join(reports,'trials'));
if(!cli)throw Error('Supply --cli pointing to lighthouse/cli/index.js');
const types=['home','obd','dna-model','dna-chronic','library-category','forum-thread'];
const selected=[],samples=[];
for(const type of types){
    const trials=[];
    for(let run=1;run<=3;run++){
        console.log(`Mobile measurement ${type}, repeat ${run}/3`);
        const folder=path.join(trialRoot,type,String(run));fs.mkdirSync(folder,{recursive:true});
        const child=spawnSync(process.execPath,['scripts/seo-lighthouse.mjs','--stage',stage,'--only',type,'--base',base,'--cli',cli],{encoding:'utf8',timeout:600000});
        fs.writeFileSync(path.join(folder,'run.log'),(child.stdout||'')+'\n'+(child.stderr||''));
        const report=JSON.parse(fs.readFileSync(path.join(reports,type+'.json')));
        if(child.error||report.runtimeError)throw Error(`${type}: invalid measurement, see ${folder}/run.log`);
        for(const file of fs.readdirSync(reports).filter(name=>name===type+'.json'||name.startsWith(type+'-0.')))fs.copyFileSync(path.join(reports,file),path.join(folder,file));
        const row=JSON.parse(fs.readFileSync(summary+'.json')).results.find(r=>r.type===type);
        trials.push({run,folder,row});console.log(JSON.stringify({type,run,score:row.score,lcpMs:row.lcpMs,tbtMs:row.tbtMs,cls:row.cls}));
    }
    // Use the middle performance run, never the best run. Keep all three.
    const middle=[...trials].sort((a,b)=>a.row.score-b.row.score||a.run-b.run)[1];
    for(const file of fs.readdirSync(middle.folder).filter(name=>name!== 'run.log'))fs.copyFileSync(path.join(middle.folder,file),path.join(reports,file));
    selected.push({...middle.row,selectedRun:middle.run,selection:'Median performance score of three consecutive valid runs'});
    samples.push({type,selectedRun:middle.run,runs:trials.map(({run,row})=>({run,score:row.score,lcpMs:row.lcpMs,tbtMs:row.tbtMs,cls:row.cls,jsTransferBytes:row.jsTransferBytes}))});
    const result={measuredAt:new Date().toISOString(),stage,base,rawArtifactRoot:trialRoot,mode:'Lighthouse mobile navigation; median performance run of 3 per template. All repeats retained. TBT is not field INP.',results:selected};
    fs.writeFileSync(summary+'-median.json',JSON.stringify(result,null,2)+'\n');
    fs.writeFileSync(stage==='after'?'docs/seo/step09-repeatability.json':summary+'-repeatability.json',JSON.stringify({method:'Middle performance score, three consecutive runs per template; no best-run selection',rawArtifactRoot:trialRoot,samples},null,2)+'\n');
}
fs.copyFileSync(summary+'-median.json',summary+'.json');
