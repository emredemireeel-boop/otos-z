import 'server-only';
import {getIndexableUrls} from '@/lib/seoRoutes';
import {getRecentForumThreadSummaries} from '@/lib/forumDataServer';
import {vehicleDNAData,createSlug} from '@/data/vehicle-dna';
import {obdCodes,POPULAR_OBD_CODES} from '@/lib/obd-catalog';
import discovery from '@/data/seo-discovery.json';
export default async function HomeDiscovery(){
    const qualified=new Set((await getIndexableUrls()).map(r=>r.url));
    const codes=discovery.obd.map(r=>new URL(r.url).pathname.split('/').at(-1)!.toUpperCase());
    const popularCodes=[...new Set([...codes,...POPULAR_OBD_CODES,...obdCodes.filter(c=>qualified.has(`https://otosoz.com/obd/${c.code.toLowerCase()}`)).map(c=>c.code)])].map(code=>obdCodes.find(c=>c.code===code)).filter(code=>code&&qualified.has(`https://otosoz.com/obd/${code.code.toLowerCase()}`)).slice(0,10);
    const vehicleVisits=new Map(discovery.models.map((r,index)=>[r.url,index]));
    const vehicles=[...vehicleDNAData].filter(v=>qualified.has(`https://otosoz.com/arac-dna/${createSlug(v.brand)}/${createSlug(v.model)}`)&&vehicleVisits.has(`https://otosoz.com/arac-dna/${createSlug(v.brand)}/${createSlug(v.model)}`)).sort((a,b)=>vehicleVisits.get(`https://otosoz.com/arac-dna/${createSlug(a.brand)}/${createSlug(a.model)}`)!-vehicleVisits.get(`https://otosoz.com/arac-dna/${createSlug(b.brand)}/${createSlug(b.model)}`)!).slice(0,10);
    const threads=await getRecentForumThreadSummaries(6);
    return <section style={{maxWidth:1200,margin:'24px auto',padding:24,lineHeight:1.7}} aria-label="İçerikleri keşfet"><h2>İçerikleri keşfet</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:24}}>
        <div><h3>Kaynaklı OBD arıza kodu rehberleri</h3><ul>{popularCodes.map(code=><li key={code!.code}><a href={`/obd/${code!.code.toLowerCase()}`}>{code!.code} — {code!.title}</a></li>)}</ul><a href="/obd">Tüm kaynaklı OBD rehberleri</a></div>
        <div><h3>Arama gösterimlerinde öne çıkan 10 model</h3><p>Geçmiş gösterimlere göre motor, kronik sorun ve donanım dosyaları.</p><ul>{vehicles.map(v=><li key={v.id}><a href={`/arac-dna/${createSlug(v.brand)}/${createSlug(v.model)}`}>{v.brand} {v.model}</a></li>)}</ul><a href="/arac-dna">Tüm model dosyaları</a></div>
        <div><h3>Açık oto pazarları</h3><p>İllere göre pazarları ve kayıtlı resmî kaynaklarını inceleyin.</p><a href="/acik-oto-pazari">Türkiye açık oto pazarı il dizini</a><h3>Son forum başlıkları</h3><ul>{threads.map(t=><li key={t.id}><a href={`/forum/${t.slug}`}>{t.title}</a></li>)}</ul><a href="/forum">Tüm forum başlıkları</a></div>
    </div></section>;
}
