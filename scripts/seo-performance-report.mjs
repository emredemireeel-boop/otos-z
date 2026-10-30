import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const args=process.argv.slice(2),option=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const stage=option('--stage','after'),dist=option('--dist','.next'),output=option('--output','docs/seo/step09-comparison');
if(!/^[a-z0-9-]+$/.test(stage))throw Error('Invalid report stage');
const before=JSON.parse(fs.readFileSync('docs/seo/step09-before.json'));
const after=JSON.parse(fs.readFileSync(`docs/seo/step09-${stage}.json`));
const rows=[],failures=[];
const marker=/@firebase\/|firestore\.googleapis\.com|firebase-heartbeat|auth\/argument-error/;
const buildTime=fs.statSync(path.join(dist,'BUILD_ID')).mtimeMs;
for(const previous of before.results){
    const current=after.results.find(row=>row.type===previous.type);
    if(!current){failures.push(`${previous.type}: missing after result`);continue;}
    const file=path.join(`docs/seo/lighthouse-${stage}`,current.type+'.json');
    const raw=JSON.parse(fs.readFileSync(file));
    if(new Date(raw.fetchTime).getTime()<buildTime)failures.push(`${current.type}: measurement predates current build`);
    const firebaseChunks=[],network=[];
    for(const item of raw.audits['network-requests']?.details?.items||[]){
        if(/(?:firestore|identitytoolkit|securetoken)\.googleapis\.com|firebaseapp\.com\/__\/auth/.test(item.url))firebaseChunks.push({url:item.url,reason:'Firebase browser request'});
        if(item.resourceType!=='Script')continue;
        const url=new URL(item.url),local=url.pathname.startsWith('/_next/static/chunks/')?path.join(dist,url.pathname.slice('/_next/'.length)):null;
        if(local&&!fs.existsSync(local)){failures.push(`${current.type}: loaded chunk is missing from the audited build (${url.pathname})`);continue;}
        if(local&&fs.existsSync(local)){
            const content=fs.readFileSync(local);
            network.push({url:item.url,bytes:item.transferSize,sha256:crypto.createHash('sha256').update(content).digest('hex')});
            if(marker.test(content.toString()))firebaseChunks.push({url:item.url,reason:'Firebase SDK implementation marker in loaded chunk'});
        }
    }
    const row={type:current.type,route:current.route,beforeScore:previous.score,afterScore:current.score,beforeJsTransferBytes:previous.jsTransferBytes,afterJsTransferBytes:current.jsTransferBytes,jsReductionPercent:Number((100*(1-current.jsTransferBytes/previous.jsTransferBytes)).toFixed(2)),lcpMs:current.lcpMs,tbtMs:current.tbtMs,cls:current.cls,firebaseChunks,network,fetchTime:raw.fetchTime};
    rows.push(row);
    if(current.score<85||current.lcpMs>=2500||current.cls>=0.1||firebaseChunks.length||current.errors?.length)failures.push(`${current.type}: mobile performance/network acceptance failed`);
}
const summary={checkedAt:new Date().toISOString(),buildId:fs.readFileSync(path.join(dist,'BUILD_ID'),'utf8').trim(),dist,stage,base:after.base,passed:rows.length===6&&!failures.length,failures,rows,inp:'Not measured by navigation Lighthouse. TBT is reported separately and is not claimed as INP. Field INP <200ms needs real-user/CrUX data after deployment.'};
fs.writeFileSync(output+'.json',JSON.stringify(summary,null,2)+'\n');
const lines=['# Mobil performans','','Aynı yerel production sunucusunda Lighthouse 13.6 mobil gezinme ölçümü. TBT laboratuvar metriğidir; INP sonucu değildir. JavaScript aktarımı sıkıştırılmış ağ boyutudur.','','| Şablon | Önce puan | Sonra puan | JS önce KB | JS sonra KB | Azalma | LCP sn | CLS |','|---|---:|---:|---:|---:|---:|---:|---:|',...rows.map(r=>`| ${r.type} | ${r.beforeScore} | ${r.afterScore} | ${(r.beforeJsTransferBytes/1000).toFixed(1)} | ${(r.afterJsTransferBytes/1000).toFixed(1)} | %${r.jsReductionPercent} | ${(r.lcpMs/1000).toFixed(2)} | ${r.cls.toFixed(4)} |`),'','Altı şablonun anonim ağ kayıtlarında yüklenen Firebase SDK ve tarayıcı Firebase isteği sayısı: '+rows.reduce((n,r)=>n+r.firebaseChunks.length,0)+'. İstek URLleri ve yüklenen yerel chunk SHA-256 değerleri JSON karşılaştırma raporunda saklanır.','','INP için yayından sonra gerçek kullanıcı verisi gerekir; bu rapor INP <200 ms kanıtı olarak kullanılamaz.',''];
fs.writeFileSync(output+'.md',lines.join('\n'));
console.log(JSON.stringify({...summary,rows:rows.map(({network,...row})=>row)},null,2));
if(!summary.passed)process.exitCode=1;
