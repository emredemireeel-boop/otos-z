import Navbar from './Navbar';
import Footer from './Footer';
import PageBreadcrumbs from './PageBreadcrumbs';
import Link from 'next/link';
import fines from '@/data/trafik_cezalari.json';

/** The remaining traffic directory must not mount the retired library portal. */
export default function TrafficDirectory() {
    return <><Navbar /><main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px', lineHeight: 1.7 }}>
        <PageBreadcrumbs url="/trafik-cezasi" />
        <h1>Trafik Cezaları</h1>
        <p>İhlal türüne göre kayıtlı açıklamaları ve ilgili maddeyi inceleyin. İşlem yapmadan önce resmî kayıtları ve tebliğ edilen ceza bilgisini kontrol edin.</p>
        {fines.categories.map(category => <section key={category.id}><h2>{category.kategori}</h2><ul>{category.rows.map(fine => <li key={fine.id}><Link href={`/trafik-cezasi/${fine.slug}`}>{fine.ihlal} — {fine.madde}</Link></li>)}</ul></section>)}
    </main><Footer /></>;
}
