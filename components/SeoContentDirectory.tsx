import 'server-only';
import {getIndexableUrls,type SitemapType} from '@/lib/seoRoutes';
import {pageBreadcrumbItems} from '@/lib/page-breadcrumbs';

export default async function SeoContentDirectory({type,title,modelsOnly=false}:{type:SitemapType;title:string;modelsOnly?:boolean}){
    const entries=(await getIndexableUrls(type)).filter(entry=>!modelsOnly||new URL(entry.url).pathname.split('/').filter(Boolean).length===3);
    return <section style={{maxWidth:1200,margin:'24px auto',padding:'24px',border:'1px solid var(--card-border)',borderRadius:16}} aria-label={title}>
        <h2 style={{fontSize:22,marginBottom:14}}>{title}</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:'12px 24px'}}>{entries.map(entry=>{const trail=pageBreadcrumbItems(entry.url),last=trail.at(-1)!;return <a href={new URL(entry.url).pathname} key={entry.url} style={{color:'var(--primary)',lineHeight:1.6}}>{modelsOnly?`${trail.at(-2)?.name} ${last.name}`:last.name}</a>;})}</div>
    </section>;
}
