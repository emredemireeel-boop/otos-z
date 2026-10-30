import fs from 'node:fs';
import crypto from 'node:crypto';
const stage=process.argv[2]||'live-idle';
if(!/^[a-z0-9-]+$/.test(stage))throw Error('Invalid report stage');
const input=JSON.parse(fs.readFileSync(`docs/seo/step09-${stage}.json`));
const local=JSON.parse(fs.readFileSync('docs/seo/step09-comparison.json'));
const expected=['home','obd','dna-model','dna-chronic','library-category','forum-thread'];
const rows=[],errors=[];
const marker=/@firebase\/|firestore\.googleapis\.com|firebase-heartbeat|auth\/argument-error/;
const chunks=new Map();
for(const type of expected){
  const measured=input.results.find(x=>x.type===type);
  if(!measured){errors.push(`${type}: missing live measurement`);continue;}
  const raw=JSON.parse(fs.readFileSync(`docs/seo/lighthouse-${stage}/${type}.json`));
  const requests=raw.audits['network-requests']?.details?.items||[];
  const scripts=requests.filter(x=>x.resourceType==='Script');
  const sdkRequests=requests.filter(x=>/(?:firestore|identitytoolkit|securetoken)\.googleapis\.com|firebaseapp\.com\/__\/auth/.test(x.url)).map(x=>x.url);
  const loadedChunks=[];
  for(const item of scripts){
    const url=new URL(item.url);
    if(url.origin!==new URL(input.base).origin||!url.pathname.startsWith('/_next/static/chunks/'))continue;
    if(!chunks.has(item.url)){
      const response=await fetch(item.url,{signal:AbortSignal.timeout(30000)});
      if(response.status!==200){errors.push(`Loaded chunk unavailable: ${url.pathname}`);continue;}
      const content=Buffer.from(await response.arrayBuffer());
      chunks.set(item.url,{url:item.url,sha256:crypto.createHash('sha256').update(content).digest('hex'),firebase:marker.test(content.toString())});
    }
    loadedChunks.push(chunks.get(item.url));
  }
  const cloudflare=(raw.audits['bootup-time']?.details?.items||[]).filter(x=>x.url?.includes('/cdn-cgi/challenge-platform/')).map(x=>({url:x.url,totalCpuMs:x.total,scriptingMs:x.scripting}));
  const firebaseChunks=loadedChunks.filter(x=>x?.firebase).map(x=>x.url);
  const previous=local.rows.find(x=>x.type===type);
  const row={type,route:measured.route,localScore:previous?.afterScore,liveScore:measured.score,lcpMs:measured.lcpMs,tbtMs:measured.tbtMs,cls:measured.cls,jsTransferBytes:measured.jsTransferBytes,serverResponseMs:raw.audits['server-response-time']?.numericValue,cloudflare,firebaseChunks,sdkRequests,loadedChunks,fetchTime:raw.fetchTime};
  row.targetsMet=row.liveScore>=85&&row.lcpMs<2500&&row.cls<0.1&&!firebaseChunks.length&&!sdkRequests.length&&!measured.errors?.length;
  rows.push(row);
}
const report={checkedAt:new Date().toISOString(),base:input.base,stage,conditions:'Three consecutive valid mobile Lighthouse runs per template, median performance run retained. Full SEO/BFS crawls had completed before these measurements started. Earlier measurement during crawls is retained separately as step09-live.json.',publicTargetsMet:rows.length===expected.length&&rows.every(x=>x.targetsMet)&&!errors.length,errors,rows,inp:'INP not measured by navigation Lighthouse. TBT is a separate lab metric.',cloudflareDocumentation:'https://developers.cloudflare.com/cloudflare-challenges/challenge-types/javascript-detections/'};
fs.writeFileSync('docs/seo/step09-public-performance.json',JSON.stringify(report,null,2)+'\n');
const table=['# Canlı mobil performans — 30.10.2026','','Yerel sonuçlar ile Cloudflare üzerinden canlı sonuçlar ayrı tutulur. Her şablonun üç geçerli ölçümünde ortanca performans çalıştırması kullanılır. Önceki tek ölçüm ve tüm tekrarlar korunur.','','| Şablon | Yerel puan | Canlı puan | Canlı LCP sn | Canlı TBT ms | CLS | Hedef |','|---|---:|---:|---:|---:|---:|---|',...rows.map(x=>`| ${x.type} | ${x.localScore} | ${x.liveScore} | ${(x.lcpMs/1000).toFixed(2)} | ${Math.round(x.tbtMs)} | ${x.cls.toFixed(4)} | ${x.targetsMet?'Geçti':'Karşılanmadı'} |`),'','Canlı kabul: '+(report.publicTargetsMet?'geçti.':'henüz karşılanmadı. Yerel yeşil sonuç, canlı hedefin geçtiği anlamına gelmez.'),'','Cloudflare tarafından eklenen doğrulama betiğinin CPU ölçümü ve yüklenen uygulama dosyalarının SHA-256 kanıtı JSON raporundadır. Bu betik tüm farkın nedeni olarak gösterilmez. Güvenlik ayarı bu çalışma sırasında değiştirilmedi. [Cloudflare JavaScript Detections belgesi]('+report.cloudflareDocumentation+').','','TBT, gerçek kullanıcı INP değeri değildir. Alan INP doğrulaması yayından sonra gerekir.',''];
fs.writeFileSync('docs/seo/step09-public-performance.md',table.join('\n'));
console.log(JSON.stringify({...report,rows:rows.map(({loadedChunks,...x})=>x)},null,2));
if(!report.publicTargetsMet)process.exitCode=1;
