import 'server-only';
import {provinceNeighbors} from '@/data/province-neighbors';
import {TURKEY_PROVINCES} from '@/data/open-car-markets';
import {getIndexableUrls} from '@/lib/seoRoutes';
export default async function MarketConnections({city}:{city:string}){
    const qualified=new Set((await getIndexableUrls()).map(r=>new URL(r.url).pathname));
    const neighbors=provinceNeighbors(city).map(slug=>TURKEY_PROVINCES.find(p=>p.slug===slug)).filter(p=>p&&qualified.has('/acik-oto-pazari/'+p.slug));
    const links=[{path:'/kutuphane/kategori/ikinci-el-rehberi',label:'İkinci el araç alırken kontrol listesi'},{path:'/kutuphane/kategori/hasar-sorgulama',label:'Hasar ve tramer sorgulama rehberi'},{path:'/kutuphane/kategori/nereye-gitmeli',label:'Bağımsız ekspertiz ve servis seçimi'}].filter(l=>qualified.has(l.path));
    return <aside style={{margin:'24px auto',padding:24,maxWidth:1100,lineHeight:1.8}}><h2>Alım öncesi araştırma</h2><ul>{links.map(l=><li key={l.path}><a href={l.path}>{l.label}</a></li>)}</ul>{neighbors.length>0&&<><h3>Komşu illerdeki pazar rehberleri</h3><ul>{neighbors.map(p=><li key={p!.slug}><a href={`/acik-oto-pazari/${p!.slug}`}>{p!.name} açık oto pazarları</a></li>)}</ul></>}<a href="/acik-oto-pazari">Türkiye açık oto pazarı il dizini</a></aside>;
}
