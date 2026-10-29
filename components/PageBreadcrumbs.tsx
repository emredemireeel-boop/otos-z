import 'server-only';
import {pageBreadcrumbItems} from '@/lib/page-breadcrumbs';
import {breadcrumb,schemaGraph,schemaJson,type BreadcrumbItem} from '@/lib/schema';
import styles from './PageBreadcrumbs.module.css';
export default function PageBreadcrumbs({url,label,items}:{url:string;label?:string;items?:BreadcrumbItem[]}){
 const canonical=new URL(url,'https://otosoz.com').href;
 const trail=items||pageBreadcrumbItems(canonical,label);if(trail.length<2)return null;
 return <div className={styles.container}><nav aria-label="İçerik yolu" data-seo-breadcrumb><ol>{trail.map((item,index)=><li key={item.url} data-breadcrumb-name={item.name} data-breadcrumb-url={item.url}>{index<trail.length-1?<a href={new URL(item.url).pathname}>{item.name}</a>:<span aria-current="page">{item.name}</span>}</li>)}</ol></nav><script type="application/ld+json" dangerouslySetInnerHTML={{__html:schemaJson(schemaGraph([breadcrumb(trail,canonical)]),{breadcrumbs:true})}}/></div>;
}
