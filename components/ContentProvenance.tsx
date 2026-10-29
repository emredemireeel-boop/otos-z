import 'server-only';
import {contentProvenance} from '@/lib/content-provenance';
export default async function ContentProvenance({url}:{url:string}) {
    const {detail,date,sources}=await contentProvenance(url);
    if(!detail)return null;
    return <aside data-content-provenance style={{fontSize:13,lineHeight:1.7,marginTop:12}} aria-label="İçeriğin tarihi ve kaynakları">
        <p style={{margin:'4px 0'}}>{date?<>Son güncelleme: <time dateTime={date}>{new Intl.DateTimeFormat('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Europe/Istanbul'}).format(new Date(date))}</time></>:'Son güncelleme tarihi kayıtta belirtilmemiş.'}</p>
        {sources.length>0&&<details><summary>Kaynaklar ({sources.length})</summary><ul>{sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul></details>}
        <a href="/editoryal-politika">Editoryal politika ve düzeltme süreci</a>
    </aside>;
}
