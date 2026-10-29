import 'server-only';
import {getIndexableUrls} from '@/lib/seoRoutes';
import {vehicleDNAData,createSlug} from '@/data/vehicle-dna';
import {obdCodes} from '@/lib/obd-catalog';
import {getForumHubThreadSummaries} from '@/lib/forumDataServer';
import {createSeoSlug} from '@/lib/slug';
import library from '@/public/data/library_guides.json';
const calculators=[{words:/yakıt|yakit|tüketim/i,path:'/otohesap/yakit-hesaplama',label:'Yakıt tüketimi ve yolculuk maliyeti hesaplama'},{words:/lastik/i,path:'/otohesap/lastik-ebat',label:'Lastik ebat karşılaştırma'},{words:/bakım|motor yağı/i,path:'/otohesap/arac-bakim',label:'Araç bakım maliyeti hesaplama'},{words:/kredi|finansman/i,path:'/otohesap/tasit-kredisi',label:'Taşıt kredisi hesaplama'},{words:/mtv|motorlu taşıt/i,path:'/otohesap/mtv-hesaplama',label:'MTV hesaplama'}];
export default async function ContentConnections({url}:{url:string}){
    const path=new URL(url,'https://otosoz.com').pathname,qualified=new Set((await getIndexableUrls()).map(r=>new URL(r.url).pathname)),links:{path:string;label:string}[]=[];
    const add=(path:string,label:string)=>{if(qualified.has(path)&&!links.some(l=>l.path===path))links.push({path,label});};
    if(path.startsWith('/arac-dna/')){
        const parts=path.split('/').filter(Boolean),vehicle=vehicleDNAData.find(v=>createSlug(v.brand)===parts[1]&&createSlug(v.model)===parts[2]);
        if(vehicle){const text=vehicle.chronicIssues.map(i=>i.title+' '+i.description).join(' ');for(const code of [...new Set(text.match(/\b[PBCU][0-3][0-9A-F]{3}\b/gi)||[])]){const entry=obdCodes.find(c=>c.code===code.toUpperCase());if(entry)add(`/obd/${entry.code.toLowerCase()}`,`${entry.code} — ${entry.title}`);}
            const model=createSeoSlug(vehicle.model.replace(/\([^)]*\)/g,'').replace(/\d+\.?\s*nesil/gi,'')).split('-')[0],brand=createSeoSlug(vehicle.brand);
            const threads=await getForumHubThreadSummaries(null);for(const t of threads.filter(t=>{const title=createSeoSlug(t.title);return title.split('-').includes(brand)&&title.split('-').includes(model);} ).slice(0,3))add(`/forum/${t.slug}`,t.title);
        }
    }else if(path.startsWith('/obd/')){
        const code=path.split('/').at(-1)!.toUpperCase();
        for(const v of vehicleDNAData.filter(v=>v.chronicIssues.some(i=>new RegExp(`\\b${code}\\b`,'i').test(i.title+' '+i.description))).slice(0,4))add(`/arac-dna/${createSlug(v.brand)}/${createSlug(v.model)}/kronik-sorunlar`,`${v.brand} ${v.model} kronik sorunları`);
        add('/kutuphane/kategori/gosterge-isiklari','Gösterge uyarıları ve anlamları');add('/kutuphane/kategori/nereye-gitmeli','Arıza için hangi servise gitmeli?');
    }else if(path.startsWith('/makale/')){
        const article=library.guides.find(g=>String(g.urlId||g.id)===path.split('--').at(-1));if(article){const text=article.title+' '+article.tags.join(' ');for(const item of calculators)if(item.words.test(text))add(item.path,item.label);}
    }
    if(!links.length)return null;
    return <aside style={{maxWidth:1100,margin:'24px auto',padding:24,border:'1px solid var(--card-border)',borderRadius:16}} aria-label="İlgili içerikler"><h2>İlgili rehberler ve tartışmalar</h2><ul>{links.map(l=><li key={l.path}><a href={l.path}>{l.label}</a></li>)}</ul></aside>;
}
