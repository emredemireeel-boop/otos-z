import Link from "next/link";
import EditorialEmailLink from './EditorialEmailLink';
export default function AboutPageContent({breadcrumbs}:{breadcrumbs?:React.ReactNode}) {
    return <main className="about-page">{breadcrumbs}
        <section className="about-hero"><h1>OtoSöz Hakkında</h1><p>OtoSöz; araç seçimi, arıza araştırması, bakım ve ikinci el alım satım hakkında içerikler ile otomobil topluluğunun paylaşımlarını bir araya getirir.</p></section>
        <section className="about-story-grid">
            <article className="about-story-card"><h2>Kim olduğumuz</h2><p>Site sorumlusu: <strong>Emre Demirel</strong>.</p><p>OtoSöz adı altında araç dosyaları, OBD açıklamaları, rehberler ve forum başlıkları yayımlıyoruz. İçeriklerin amacı, okuyucunun araştırmasını kolaylaştırmak ve kontrol edilmesi gereken noktaları görünür kılmaktır.</p></article>
            <article className="about-story-card"><h2>Nasıl çalışıyoruz?</h2><p>Kaynağı bulunan açıklamalarda kaynak bağlantısını gösteririz. Topluluk paylaşımlarını kullanıcı deneyimi olarak sunarız. Tarih veya kaynak kaydı bulunmadığında bunu açıkça belirtiriz.</p><p><Link href="/editoryal-politika">Editoryal politika</Link>, kaynak kullanımı, Araç DNA puanlarının sınırları ve düzeltme sürecini açıklar. <Link href="/kaynaklar">Kaynaklar sayfası</Link>, içeriklerde kayıtlı başvuru bağlantılarını bir araya getirir.</p></article>
        </section>
        <section className="about-section"><h2>İletişim ve düzeltme talepleri</h2><p>Bir bilgiyi düzeltmek veya kaynak iletmek için <EditorialEmailLink/> adresine sayfanın bağlantısını, ilgili ifadeyi ve varsa doğrulanabilir kaynağı gönderebilirsiniz.</p><p><Link href="/iletisim">İletişim sayfası</Link> üzerinden de bize ulaşabilirsiniz. Araç güvenliği veya arıza teşhisi için aracınızı inceleyebilen yetkili bir servisten destek alın.</p></section>
    </main>;
}
