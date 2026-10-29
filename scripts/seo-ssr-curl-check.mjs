import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {load} from 'cheerio';
import {loadSource} from './seo-quality-loader.mjs';
const base=process.argv[2] || 'http://127.0.0.1:3010';
const reportPath=process.argv[3] || 'docs/seo/step04-curl-content.json';
const observe=process.argv.includes('--observe');
const path='/arac-dna/renault/clio-5-nesil-2020-2025/kronik-sorunlar';
const vehicle=loadSource('data/vehicle-dna.ts').vehicleDNAData.find(vehicle=>vehicle.id===1);
const output=execFileSync(process.platform==='win32'?'curl.exe':'curl',
    ['-sS','--max-time','45','-A','Googlebot','-w','\n%{http_code}',new URL(path,base).href],{encoding:'utf8',maxBuffer:10*1024*1024});
const last=output.lastIndexOf('\n'),status=Number(output.slice(last+1));
const $=load(output.slice(0,last));$('script,style,template').remove();
const text=$('main').text().replace(/\s+/g,' '),checks=vehicle.chronicIssues.map(issue=>({title:issue.title,inFirstHtml:text.includes(issue.title)}));
const report={checkedAt:new Date().toISOString(),base,path,userAgent:'Googlebot',tool:'curl',scriptsExecuted:false,
    status,checks,passed:status===200&&checks.every(check=>check.inFirstHtml),observe};
fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
if(!observe&&!report.passed)process.exitCode=1;
