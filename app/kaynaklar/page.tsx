import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import {createPageMetadata} from '@/lib/seo';
import {reviewedObdCodes} from '@/data/obd-reviewed';
import {OPEN_CAR_MARKETS} from '@/data/open-car-markets';
import news from '@/public/data/news_posts.json';
import styles from '../hubs.module.css';
export const metadata=createPageMetadata({title:'İçerik Kaynakları ve Başvuru Belgeleri',description:'OtoSöz OBD açıklamalarında, haberlerde ve açık oto pazarı rehberlerinde kayıtlı üretici belgeleri ile resmî başvuru kaynaklarına ulaşın.',path:'/kaynaklar'});
export default function Sources(){
    const groups=[{title:'OBD üretici belgeleri ve teknik bültenler',items:Object.values(reviewedObdCodes).flatMap(r=>r.sources||[]).map(s=>({title:s.title,url:s.url}))},{title:'Açık oto pazarı başvuru kaynakları',items:OPEN_CAR_MARKETS.flatMap(m=>m.sources).map(s=>({title:s.label,url:s.url}))},{title:'Haber kaynakları',items:news.posts.filter(p=>p.sourceUrl).map(p=>({title:p.sourceName||p.title,url:String(p.sourceUrl)}))}];
    return <><Navbar/><main className={styles.page}><PageBreadcrumbs url="/kaynaklar"/><article className={styles.container} style={{lineHeight:1.8,maxWidth:900}}><h1>Kaynaklar</h1><p>Bu liste içerik kayıtlarında bulunan bağlantılardan oluşur. Bir belgenin kapsamını, yayımlanma tarihini ve ilgili araç veya bölgeyi kontrol edin. Kaynağın listelenmesi, bütün katalog kayıtlarının o belgeyle doğrulandığı anlamına gelmez.</p>{groups.map(group=><section key={group.title}><h2>{group.title}</h2><ul>{[...new Map(group.items.filter(s=>/^https?:\/\//.test(s.url)).map(s=>[s.url,s])).values()].map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title||new URL(s.url).hostname}</a></li>)}</ul></section>)}<h2>Kaynağı olmayan bilgiler</h2><p>Kaynak bağlantısı bulunmayan araç ve rehber kayıtları için doğrulanmış kaynak iddiasında bulunmayız. Tarihi olmayan içeriklere yeni tarih eklemeyiz. Doğrulanabilir bir kaynak veya düzeltme paylaşmak için <a href="/iletisim">iletişim sayfasını</a> kullanabilirsiniz.</p><p><a href="/editoryal-politika">Editoryal politika ve kaynak değerlendirme süreci</a></p></article></main><Footer/></>;
}
