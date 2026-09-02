import Link from "next/link";
import {
    BarChart3,
    CheckCircle2,
    Cookie,
    Database,
    ExternalLink,
    LockKeyhole,
    Megaphone,
    RefreshCcw,
    ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieSettingsTrigger from "@/components/CookieSettingsTrigger";
import "./cerez-politikasi.css";

const COOKIE_ROWS = [
    {
        name: "otosoz_cookie_consent",
        category: "Zorunlu",
        provider: "OtoSöz",
        purpose: "Çerez tercihlerinizi hatırlar ve izin ekranının her ziyarette tekrar gösterilmesini önler.",
        duration: "180 gün",
    },
    {
        name: "auth_token",
        category: "Zorunlu",
        provider: "OtoSöz",
        purpose: "Giriş yapan kullanıcının sunucu oturumunu güvenli biçimde doğrular. JavaScript tarafından okunamaz.",
        duration: "En fazla 1 saat",
    },
    {
        name: "user_role",
        category: "Zorunlu",
        provider: "OtoSöz",
        purpose: "Yetkili sayfalarda rol kontrolüne yardımcı olur. JavaScript tarafından okunamaz.",
        duration: "En fazla 1 saat",
    },
    {
        name: "_ga",
        category: "Analiz — izne bağlı",
        provider: "Google Analytics",
        purpose: "Ziyaretçileri birbirinden ayıran rastgele bir tanımlayıcıyla toplu kullanım istatistikleri üretir.",
        duration: "En fazla 2 yıl",
    },
    {
        name: "_ga_<ölçüm_kodu>",
        category: "Analiz — izne bağlı",
        provider: "Google Analytics",
        purpose: "Oturum durumunu ve site kullanım ölçümlerini sürdürür.",
        duration: "En fazla 2 yıl",
    },
];

const CATEGORIES = [
    {
        icon: LockKeyhole,
        title: "Kesinlikle gerekli",
        status: "Her zaman açık",
        description: "Güvenlik, oturum açma, izin tercihini saklama ve açıkça talep ettiğiniz özellikleri sunma amaçlarıyla kullanılır.",
    },
    {
        icon: BarChart3,
        title: "Analiz ve performans",
        status: "Varsayılan kapalı",
        description: "Google Analytics yalnızca açıkça izin verdiğinizde yüklenir. İzin yoksa analiz etiketi ve ilgili çerezler çalıştırılmaz.",
    },
    {
        icon: Megaphone,
        title: "Reklam ve kişiselleştirme",
        status: "Varsayılan kapalı",
        description: "Google reklam sinyalleri ve kişiselleştirme izinlerini kapsar. OtoSöz'deki bağlamsal reklam kutuları kişisel takip yapmadan gösterilebilir.",
    },
];

export default function CookiePolicyPage() {
    return (
        <div className="cookie-policy-page-shell">
            <Navbar />
            <main className="cookie-policy-page">
                <header className="cookie-policy-hero">
                    <span className="cookie-policy-eyebrow"><ShieldCheck size={14} /> Gizlilik merkezi</span>
                    <h1>Çerez politikası</h1>
                    <p>
                        Bu sayfa, OtoSöz&apos;ün hangi çerezleri neden kullandığını, hangi teknolojilerin izninize bağlı olduğunu
                        ve kararınızı nasıl değiştirebileceğinizi açık biçimde anlatır.
                    </p>
                    <div className="cookie-policy-hero-actions">
                        <CookieSettingsTrigger className="cookie-policy-primary-action">
                            <Cookie size={16} /> Tercihlerimi yönet
                        </CookieSettingsTrigger>
                        <Link href="/gizlilik-politikasi" className="cookie-policy-secondary-action">
                            Gizlilik politikasını aç <ExternalLink size={14} />
                        </Link>
                    </div>
                    <div className="cookie-policy-summary">
                        <span><CheckCircle2 size={15} /> Önceden işaretli rıza yok</span>
                        <span><CheckCircle2 size={15} /> Reddetmek kabul etmek kadar kolay</span>
                        <span><CheckCircle2 size={15} /> Tercihler her zaman değiştirilebilir</span>
                    </div>
                </header>

                <section className="cookie-policy-section" aria-labelledby="categories-title">
                    <div className="cookie-policy-heading">
                        <span>01 / Kategoriler</span>
                        <h2 id="categories-title">Kontrolün kapsamı</h2>
                        <p>İsteğe bağlı kategoriler ilk ziyarette kapalıdır; yalnızca aktif seçiminizle açılır.</p>
                    </div>
                    <div className="cookie-policy-category-grid">
                        {CATEGORIES.map(({ icon: Icon, title, status, description }) => (
                            <article key={title} className="cookie-policy-category-card">
                                <span className="cookie-policy-card-icon"><Icon size={19} /></span>
                                <div>
                                    <span className="cookie-policy-card-status">{status}</span>
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="cookie-policy-section" aria-labelledby="inventory-title">
                    <div className="cookie-policy-heading">
                        <span>02 / Envanter</span>
                        <h2 id="inventory-title">Kullanılan çerezler</h2>
                        <p>Çerez adı, amaç, sağlayıcı ve azami saklama süresi aşağıda birlikte gösterilir.</p>
                    </div>
                    <div className="cookie-policy-table-wrap">
                        <table className="cookie-policy-table">
                            <thead>
                                <tr>
                                    <th>Çerez</th>
                                    <th>Kategori</th>
                                    <th>Sağlayıcı</th>
                                    <th>Amaç</th>
                                    <th>Süre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COOKIE_ROWS.map((row) => (
                                    <tr key={row.name}>
                                        <td><code>{row.name}</code></td>
                                        <td>{row.category}</td>
                                        <td>{row.provider}</td>
                                        <td>{row.purpose}</td>
                                        <td>{row.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="cookie-policy-section cookie-policy-details-grid" aria-label="Ek saklama ve aktarım bilgileri">
                    <article className="cookie-policy-detail-card">
                        <span className="cookie-policy-card-icon"><Database size={19} /></span>
                        <h2>Tarayıcı depolaması</h2>
                        <p>
                            Tema, taslak başlık, bakım ajandası ve anket tercihi gibi bazı özellikler çerez yerine tarayıcınızın
                            yerel depolama alanını kullanabilir. Bu kayıtlar cihazınızda kalır ve ilgili özelliği çalıştırmak için kullanılır.
                        </p>
                    </article>
                    <article className="cookie-policy-detail-card">
                        <span className="cookie-policy-card-icon"><BarChart3 size={19} /></span>
                        <h2>Google Analytics</h2>
                        <p>
                            Analiz izni vermediğiniz sürece Google Analytics dosyası yüklenmez. İzin verirseniz anonimleştirilmiş
                            ve toplulaştırılmış kullanım ölçümleri için Google hizmetlerinden yararlanılır.
                        </p>
                    </article>
                    <article className="cookie-policy-detail-card">
                        <span className="cookie-policy-card-icon"><RefreshCcw size={19} /></span>
                        <h2>Rızayı geri çekme</h2>
                        <p>
                            Sayfanın sol altındaki “Çerez tercihleri” düğmesini veya bu sayfadaki yönetim düğmesini kullanabilirsiniz.
                            Analiz izni kapatıldığında erişilebilen Google Analytics çerezleri silinir ve gelecekteki ölçüm durdurulur.
                        </p>
                    </article>
                </section>

                <section className="cookie-policy-note">
                    <div>
                        <span>Güncellik</span>
                        <h2>Değişiklikleri açıkça yayımlarız.</h2>
                        <p>
                            Yeni bir çerez veya farklı bir kullanım amacı eklenirse bu envanter güncellenir. Rızanın kapsamını
                            etkileyen önemli değişikliklerde yeniden tercih yapmanız istenebilir.
                        </p>
                    </div>
                    <div className="cookie-policy-date">
                        <strong>Son güncelleme</strong>
                        <span>2 Eylül 2026</span>
                        <Link href="/iletisim">Sorunuz mu var?</Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
