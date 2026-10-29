import fs from 'node:fs';
import path from 'node:path';
import {google} from 'googleapis';
const args=process.argv.slice(2),option=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const today=option('--date',new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Istanbul'}).format(new Date()));
const subtract=(date,days)=>{const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-days);return d.toISOString().slice(0,10);};
const endDate=option('--end-date',subtract(today,3)),startDate=subtract(endDate,6);
function isoWeek(date){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7));const year=d.getUTCFullYear(),start=new Date(Date.UTC(year,0,1));return `${year}-${String(Math.ceil(((d-start)/86400000+1)/7)).padStart(2,'0')}`;}
const week=isoWeek(today),output=option('--output',`docs/seo/weekly/${week}.json`);
const key=option('--key',process.env.GOOGLE_APPLICATION_CREDENTIALS||fs.readdirSync('.').find(f=>/^otosozindex-.*\.json$/.test(f)));
const critical=JSON.parse(fs.readFileSync(option('--urls','docs/seo/critical-urls.json'),'utf8')).slice(0,50);
if(critical.length!==50||new Set(critical).size!==50)throw Error('Exactly 50 unique critical URLs required');
const report={generatedAt:new Date().toISOString(),week,reportDate:today,range:{startDate,endDate,dataState:'final',lagDays:3},scope:'https://www.googleapis.com/auth/webmasters.readonly',site:option('--site','sc-domain:otosoz.com'),readOnly:true,analytics:null,previousAnalytics:null,pages:[],inspections:[],errors:[]};
const error=e=>({status:e.response?.status||e.code||null,message:e.response?.data?.error?.message||e.message||String(e)});
try{
    if(!key)throw Error('Search Console service account file missing; use --key or GOOGLE_APPLICATION_CREDENTIALS');
    const auth=new google.auth.GoogleAuth({keyFile:key,scopes:[report.scope]}),api=google.searchconsole({version:'v1',auth});
    const query=async(body)=>{const {data}=await api.searchanalytics.query({siteUrl:report.site,requestBody:body},{timeout:30000});return data.rows||[];};
    try{report.analytics=(await query({startDate,endDate,dataState:'final'}))[0]||{clicks:0,impressions:0,ctr:0,position:0};}
    catch(e){if(e.response?.status===403&&report.site==='sc-domain:otosoz.com'){report.site='https://otosoz.com/';report.analytics=(await query({startDate,endDate,dataState:'final'}))[0]||{clicks:0,impressions:0,ctr:0,position:0};}else throw e;}
    report.previousAnalytics=(await query({startDate:subtract(startDate,7),endDate:subtract(endDate,7),dataState:'final'}))[0]||{clicks:0,impressions:0,ctr:0,position:0};
    report.pages=await query({startDate,endDate,dataState:'final',dimensions:['page'],rowLimit:25000});
    // Only query and index.inspect are called; no sitemap submission or indexing API.
    let denied=null;
    for(const url of critical){
        if(denied){report.inspections.push({url,error:{message:'Not attempted after authorization failure',status:denied}});continue;}
        try{const {data}=await api.urlInspection.index.inspect({requestBody:{siteUrl:report.site,inspectionUrl:url,languageCode:'tr-TR'}},{timeout:30000});const result=data.inspectionResult||{};report.inspections.push({url,...result.indexStatusResult,inspectionResultLink:result.inspectionResultLink});}
        catch(e){const failure=error(e);report.inspections.push({url,error:failure});if([401,403].includes(failure.status))denied=failure.status;}
    }
}catch(e){report.errors.push(error(e));report.inspections=critical.map(url=>({url,error:{message:'Inspection unavailable because report authorization/query failed'}}));}
report.status=report.errors.length||report.inspections.some(r=>r.error)?'incomplete':'complete';
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output,status:report.status,site:report.site,range:report.range,analytics:report.analytics,inspections:report.inspections.length,inspectionErrors:report.inspections.filter(r=>r.error).length,errors:report.errors},null,2));
process.exitCode=report.status==='complete'?0:1;
