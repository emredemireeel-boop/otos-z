import 'server-only';
import {getObdCode} from './obd-catalog';
import {OPEN_CAR_MARKETS,getMarketPath} from '../data/open-car-markets';
import library from '../public/data/library_guides.json';
import news from '../public/data/news_posts.json';
import howto from '../data/nasil-yapilir.json';
import lights from '../data/fault_lights.json';
import tolls from '../public/data/otoyol_ucretleri.json';
import {dictionaryTerms} from '../data/dictionary';
import {vehicleDNAData,createSlug} from '../data/vehicle-dna';
import {engineDNAData} from '../data/engine-dna';
import {mythsData} from '../data/efsane-avcilari-data';
import {getForumThreadSeo} from './forumDataServer';

export interface ContentSource {title:string;url:string}
export function provenanceFromRecord(record:Record<string,any>|null|undefined) {
    const raw=record?.updatedAt||record?.lastReviewed||record?.checkedAt||record?.lastEntryAt||record?.createdAt;
    const parsed=raw?new Date(raw):null;
    const date=parsed&&Number.isFinite(parsed.getTime())&&parsed.getTime()<=Date.now()?parsed.toISOString():null;
    const candidates=[...(Array.isArray(record?.sources)?record.sources:[]),...(record?.sourceUrl?[{url:record.sourceUrl,title:record.sourceName}]:[])];
    const sources:ContentSource[]=candidates.filter((s:any)=>/^https?:\/\//.test(s.url||'')).map((s:any)=>({url:s.url,title:s.title||s.label||s.publisher||new URL(s.url).hostname}));
    return {date,sources:[...new Map(sources.map(s=>[s.url,s])).values()]};
}
export async function contentProvenance(value:string) {
    const path=new URL(value,'https://otosoz.com').pathname,parts=path.split('/').filter(Boolean);
    let record:Record<string,any>|undefined|null;
    if(parts[0]==='obd'&&parts.length===2)record=getObdCode(parts[1]);
    else if(parts[0]==='makale'&&parts.length===2)record=library.guides.find(g=>String(g.urlId||g.id)===parts[1].split('--').at(-1));
    else if(parts[0]==='haberler'&&parts.length===2)record=news.posts.find(p=>p.slug===parts[1]);
    else if(parts[0]==='acik-oto-pazari'&&parts.length===3)record=OPEN_CAR_MARKETS.find(m=>getMarketPath(m)===path);
    else if(parts[0]==='forum'&&parts.length===2&&!['kategori','sayfa'].includes(parts[1]))record=await getForumThreadSeo(parts[1]);
    else if(parts[0]==='sozluk'&&parts.length===2)record=dictionaryTerms.find(t=>t.id===parts[1]);
    else if(parts[0]==='nasil-yapilir'&&parts.length===2)record=howto.categories.flatMap(c=>c.guides).find(g=>g.slug===parts[1]);
    else if(parts[0]==='gosterge'&&parts.length===2)record=lights.warningLights.find(l=>String(l.urlId)===parts[1].split('--').at(-1)||l.id===parts[1]);
    else if(parts[0]==='kutuphane'&&parts[1]==='otoyol-ucretleri'&&parts.length===3)record=tolls.find(t=>t.id===parts[2]);
    else if(parts[0]==='kutuphane'&&parts[1]==='efsane-avcilari'&&parts.length===3)record=mythsData.find(t=>t.slug===parts[2]);
    else if(parts[0]==='arac-dna'&&parts.length>=3){
        const vehicle=vehicleDNAData.find(v=>createSlug(v.brand)===parts[1]&&createSlug(v.model)===parts[2]);record=vehicle;
        if(vehicle&&parts[3]&&!['kronik-sorunlar','neden-alinir','arac-paketleri','kullanici-deneyimleri'].includes(parts[3]))record=engineDNAData.find(v=>v.vehicleId===vehicle.id)?.engines.find(e=>parts[3]===e.slug||parts[3].startsWith(e.slug+'-'));
    }
    const detail=Boolean(record)||parts.length>=2&&!['kategori','sayfa'].includes(parts[1]);
    return {detail,...provenanceFromRecord(record)};
}
