import Link from "next/link";
import EditorialEmailLink from './EditorialEmailLink';
import {OWNED_PROJECTS} from '@/data/owned-projects';
export default function AboutPageContent({breadcrumbs}:{breadcrumbs?:React.ReactNode}) {
    return <main className="about-page">{breadcrumbs}
        <section className="about-hero"><h1>OtoSöz Hakkında</h1><p>Otomobiller hakkında bilgi ve deneyim paylaşımını kolaylaştıran bir otomotiv platformuyuz. OtoSöz’de sorular, sürücü deneyimleri ve anketler aynı forumda, başlıklar etrafında buluşur.</p></section>
        <section className="about-story-grid">
            <article className="about-story-card"><h2>Kim olduğumuz</h2><p>Site sorumlusu: <strong>Emre Demirel</strong>.</p><p>OtoSöz adı altında otomobil soruları, sürücü deneyimleri ve forum başlıkları yayımlıyoruz. İçeriklerin amacı, okuyucunun araştırmasını kolaylaştırmak ve kontrol edilmesi gereken noktaları görünür kılmaktır.</p></article>
            <article className="about-story-card"><h2>Nasıl çalışıyoruz?</h2><p>Kaynağı bulunan açıklamalarda kaynak bağlantısını gösteririz. Topluluk paylaşımlarını kullanıcı deneyimi olarak sunarız. Tarih veya kaynak kaydı bulunmadığında bunu açıkça belirtiriz.</p><p><Link href="/editoryal-politika">Editoryal politika</Link>, kaynak kullanımı, topluluk paylaşımlarının sınırları ve düzeltme sürecini açıklar. <Link href="/kaynaklar">Kaynaklar sayfası</Link>, içeriklerde kayıtlı başvuru bağlantılarını bir araya getirir.</p></article>
        </section>
        <section className="about-section" id="projelerimiz"><h2>Otomotiv platformumuzun projeleri</h2><p>OtoSöz, OtoKusur ve OBDKodu bize ait, aynı sorumluluk altında yürütülen otomotiv projeleridir. Projelerin sorumlusu Emre Demirel’dir. Her biri farklı bir ihtiyaca odaklanır:</p>
            <div className="about-story-grid">{OWNED_PROJECTS.map(project => <article className="about-story-card" key={project.name}><h3>{project.name}</h3><p>{project.description}</p><a href={project.url}>{project.name} sitesini inceleyin</a></article>)}</div>
            <p>OtoSöz’de topluluğa danışabilir, model araştırmanızı OtoKusur’da ve arıza kodu araştırmanızı OBDKodu’nda sürdürebilirsiniz. Topluluk paylaşımları kişisel deneyimlerdir; aracın yerinde kontrolünün ve servis teşhisinin yerini tutmaz.</p>
        </section>
        <section className="about-section"><h2>İletişim ve düzeltme talepleri</h2><p>Bir bilgiyi düzeltmek veya kaynak iletmek için <EditorialEmailLink/> adresine sayfanın bağlantısını, ilgili ifadeyi ve varsa doğrulanabilir kaynağı gönderebilirsiniz.</p><p><Link href="/iletisim">İletişim sayfası</Link> üzerinden de bize ulaşabilirsiniz. Araç güvenliği veya arıza teşhisi için aracınızı inceleyebilen yetkili bir servisten destek alın.</p></section>
    </main>;
}
