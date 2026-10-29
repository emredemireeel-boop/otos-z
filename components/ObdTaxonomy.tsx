import 'server-only';
import {getIndexableUrls} from '@/lib/seoRoutes';
import {obdCodes} from '@/lib/obd-catalog';
import {createSeoSlug} from '@/lib/slug';
const types={P:'Motor ve şanzıman',B:'Gövde ve konfor',C:'Şasi, fren ve süspansiyon',U:'Araç iletişim ağı'};
export default async function ObdTaxonomy(){
    const urls=new Set((await getIndexableUrls('obd')).map(r=>r.url));
    const codes=obdCodes.filter(c=>urls.has(`https://otosoz.com/obd/${c.code.toLowerCase()}`));
    return <section style={{maxWidth:1100,margin:'24px auto',padding:24,lineHeight:1.7}}><h2>Sistemlere göre arıza kodları</h2><nav aria-label="OBD kod türleri">{Object.entries(types).map(([type,label])=><a key={type} href={`#obd-type-${type.toLowerCase()}`} style={{marginRight:18}}>{type} — {label}</a>)}</nav>{Object.entries(types).map(([type,label])=>{const matches=codes.filter(c=>c.type===type),systems=[...new Set(matches.flatMap(c=>c.systems))];return <section key={type} id={`obd-type-${type.toLowerCase()}`}><h3>{type} — {label}</h3>{systems.length?systems.map(system=><div key={system} id={`obd-system-${createSeoSlug(system)}`}><h4>{system}</h4><ul>{matches.filter(c=>c.systems.includes(system)).map(c=><li key={c.code}><a href={`/obd/${c.code.toLowerCase()}`}>{c.code} — {c.title}</a></li>)}</ul></div>):<p>Bu türdeki kodların genel açıklamalarını <a href="/obd-kodlari/1">tam OBD kod kataloğunda</a> kod numarasıyla araştırabilirsiniz.</p>}</section>;})}</section>;
}
