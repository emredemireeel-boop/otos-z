import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Database,
    MessageSquare,
    SearchCheck,
    ShieldCheck,
    Users,
    Wrench,
} from "lucide-react";

const PRINCIPLES = [
    {
        icon: SearchCheck,
        title: "Karar odaklı bilgi",
        description: "Teknik veriyi, kullanıcı deneyimini ve uygulanabilir kontrol adımlarını anlaşılır bir bütün hâline getiriyoruz.",
    },
    {
        icon: Users,
        title: "Topluluk deneyimi",
        description: "Sürücülerin gerçek kullanım tecrübelerini görünür kılarak aynı sorunu yaşayan insanları bir araya getiriyoruz.",
    },
    {
        icon: ShieldCheck,
        title: "Şeffaf yaklaşım",
        description: "Kesin olmayan bilgiyi kesinmiş gibi sunmuyor; araştırma, karşılaştırma ve bağımsız kontrolü birlikte öneriyoruz.",
    },
];

const PROJECTS = [
    {
        name: "OBDKodu",
        domain: "obdkodu.com",
        href: "https://www.obdkodu.com/",
        icon: Wrench,
        eyebrow: "Arızayı tanı",
        title: "Türkçe OBD-II arıza kodu kütüphanesi",
        description: "P, B, C ve U sınıfındaki arıza kodlarını; olası nedenler, belirtiler, kontrol sırası ve sistem rehberleriyle birlikte araştırın.",
        features: ["Arıza kodu sorgulama", "Sistem bazlı teşhis rehberleri", "Gösterge işaretleri"],
    },
    {
        name: "OtoKusur",
        domain: "otokusur.com",
        href: "https://otokusur.com/",
        icon: Database,
        eyebrow: "Almadan önce araştır",
        title: "Araç kronik arıza ve kusur veritabanı",
        description: "Marka, model, nesil ve motor bazında kronik kusurları, risk profilini ve ekspertizde kontrol edilmesi gereken noktaları inceleyin.",
        features: ["Motor bazlı kusur analizi", "Risk skoru", "Ekspertiz kontrol odağı"],
    },
];

export default function AboutPageContent() {
    return (
        <main className="about-page">
            <section className="about-hero" aria-labelledby="about-title">
                <span className="about-eyebrow">Türkiye&apos;nin otomobil bilgi ekosistemi</span>
                <h1 id="about-title">Aracını tanı, doğru kararı ver.</h1>
                <p>
                    OtoSöz; sürücü deneyimini, teknik bilgiyi ve gerçek karar araçlarını tek çatı altında buluşturur.
                    Amacımız daha çok içerik göstermek değil, doğru anda işe yarayan bilgiyi sunmaktır.
                </p>
                <div className="about-hero-actions">
                    <Link href="/forum" className="about-button about-button-primary">
                        Topluluğu keşfet <ArrowRight size={16} />
                    </Link>
                    <Link href="/kutuphane" className="about-button about-button-secondary">
                        Kütüphaneye git <BookOpen size={16} />
                    </Link>
                </div>
            </section>

            <section className="about-story-grid" aria-label="OtoSöz yaklaşımı">
                <article className="about-story-card about-story-main">
                    <span className="about-section-label">Biz kimiz?</span>
                    <h2>Otomobil bilgisini herkes için anlaşılır hâle getiriyoruz.</h2>
                    <p>
                        Bir arıza ışığını anlamaktan ikinci el araç seçmeye, yakıt maliyetini hesaplamaktan gerçek kullanıcı
                        deneyimlerine ulaşmaya kadar otomobil sahipliğinin her aşamasında güvenilir bir başlangıç noktası oluşturuyoruz.
                    </p>
                    <p>
                        OtoSöz bir servis veya ekspertiz yerine geçmez. Kullanıcının doğru soruları sormasını, seçenekleri
                        karşılaştırmasını ve profesyonel kontrole daha hazırlıklı gitmesini sağlayan bağımsız bir araştırma ve topluluk platformudur.
                    </p>
                </article>

                <aside className="about-story-card about-purpose-card">
                    <span className="about-section-label">Ortak amaç</span>
                    <h2>Belirsizliği azaltmak</h2>
                    <ul>
                        <li><MessageSquare size={16} /> Deneyimi paylaşılabilir kılmak</li>
                        <li><Wrench size={16} /> Teknik bilgiyi sadeleştirmek</li>
                        <li><Database size={16} /> Dağınık veriyi düzenlemek</li>
                        <li><ShieldCheck size={16} /> Daha bilinçli kararları desteklemek</li>
                    </ul>
                </aside>
            </section>

            <section className="about-section" aria-labelledby="principles-title">
                <div className="about-section-heading">
                    <span className="about-section-label">Nasıl çalışıyoruz?</span>
                    <h2 id="principles-title">Üç temel ilke</h2>
                    <p>Ürettiğimiz her özellikte bilgi kalitesi, kullanılabilirlik ve şeffaflık aynı öneme sahiptir.</p>
                </div>
                <div className="about-principles-grid">
                    {PRINCIPLES.map(({ icon: Icon, title, description }) => (
                        <article key={title} className="about-principle-card">
                            <span className="about-card-icon"><Icon size={20} /></span>
                            <h3>{title}</h3>
                            <p>{description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="about-section about-projects-section" aria-labelledby="projects-title">
                <div className="about-section-heading">
                    <span className="about-section-label">Bize ait projeler</span>
                    <h2 id="projects-title">Aynı hedefe çalışan uzman platformlar</h2>
                    <p>OtoSöz topluluğu, iki odaklı araştırma projesiyle birlikte daha geniş bir otomobil bilgi ağı oluşturur.</p>
                </div>

                <div className="about-projects-grid">
                    {PROJECTS.map(({ name, domain, href, icon: Icon, eyebrow, title, description, features }) => (
                        <article key={name} className="about-project-card">
                            <div className="about-project-topline">
                                <span className="about-project-icon"><Icon size={22} /></span>
                                <span className="about-project-domain">{domain}</span>
                            </div>
                            <span className="about-project-eyebrow">{eyebrow}</span>
                            <h3>{title}</h3>
                            <p>{description}</p>
                            <ul>
                                {features.map((feature) => <li key={feature}>{feature}</li>)}
                            </ul>
                            <a href={href} target="_blank" rel="noopener noreferrer" className="about-project-link">
                                {name}&apos;yu ziyaret et <ArrowUpRight size={15} />
                            </a>
                        </article>
                    ))}
                </div>
            </section>

            <section className="about-ecosystem" aria-labelledby="ecosystem-title">
                <div>
                    <span className="about-section-label">OtoSöz ekosistemi</span>
                    <h2 id="ecosystem-title">Sorundan karara uzanan tek bilgi zinciri</h2>
                    <p>Arıza kodunu tanıyın, aracın bilinen risklerini araştırın, gerçek sürücü deneyimleriyle kararınızı güçlendirin.</p>
                </div>
                <div className="about-ecosystem-steps" aria-label="OtoSöz proje akışı">
                    <span><strong>01</strong> OBDKodu ile arızayı tanı</span>
                    <span><strong>02</strong> OtoKusur ile aracı araştır</span>
                    <span><strong>03</strong> OtoSöz ile deneyimi paylaş</span>
                </div>
            </section>
        </main>
    );
}
