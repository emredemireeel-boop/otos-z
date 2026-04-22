"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { Shield, FileText, AlertTriangle, Scale, Users, Globe, Lock, ChevronRight, ArrowUp } from "lucide-react";

export default function KullanimSartlariPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
            // Track active section
            const sections = document.querySelectorAll('[data-section]');
            let current = '';
            sections.forEach((section) => {
                const el = section as HTMLElement;
                if (el.offsetTop - 200 <= window.scrollY) {
                    current = el.getAttribute('data-section') || '';
                }
            });
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const tocItems = [
        { id: 'taraflar', label: '1. Taraflar ve Tanımlar', icon: <Users size={15} /> },
        { id: 'konu', label: '2. Sözleşmenin Konusu', icon: <FileText size={15} /> },
        { id: 'hizmetler', label: '3. Hizmetlerin Kapsamı', icon: <Globe size={15} /> },
        { id: 'uyelik', label: '4. Üyelik Şartları', icon: <Shield size={15} /> },
        { id: 'yukumlulukler', label: '5. Kullanıcı Yükümlülükleri', icon: <Scale size={15} /> },
        { id: 'icerik', label: '6. İçerik Politikası', icon: <FileText size={15} /> },
        { id: 'pazar', label: '7. Pazaryeri Kuralları', icon: <Globe size={15} /> },
        { id: 'fikri', label: '8. Fikri Mülkiyet Hakları', icon: <Lock size={15} /> },
        { id: 'sorumluluk', label: '9. Sorumluluk Sınırları', icon: <AlertTriangle size={15} /> },
        { id: 'fesih', label: '10. Üyelik Feshi', icon: <Shield size={15} /> },
        { id: 'degisiklik', label: '11. Değişiklik Hakkı', icon: <FileText size={15} /> },
        { id: 'uyusmazlik', label: '12. Uyuşmazlık Çözümü', icon: <Scale size={15} /> },
        { id: 'yururluk', label: '13. Yürürlük', icon: <Shield size={15} /> },
    ];

    const scrollToSection = (id: string) => {
        const el = document.querySelector(`[data-section="${id}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .legal-section {
                    scroll-margin-top: 100px;
                }
                .toc-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 16px;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                    background: none;
                    width: 100%;
                    text-align: left;
                    font-family: inherit;
                }
                .toc-item:hover {
                    background: var(--hover-primary);
                    color: var(--primary);
                }
                .toc-item.active {
                    background: var(--hover-primary);
                    color: var(--primary);
                    font-weight: 700;
                }
                .legal-h2 {
                    font-size: 22px;
                    font-weight: 800;
                    color: var(--foreground);
                    margin-bottom: 16px;
                    padding-top: 32px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    letter-spacing: -0.3px;
                }
                .legal-h3 {
                    font-size: 17px;
                    font-weight: 700;
                    color: var(--foreground);
                    margin: 20px 0 10px;
                }
                .legal-p {
                    color: var(--text-muted);
                    line-height: 1.85;
                    font-size: 15px;
                    margin-bottom: 16px;
                }
                .legal-list {
                    color: var(--text-muted);
                    line-height: 1.85;
                    font-size: 15px;
                    margin: 12px 0 16px 20px;
                    list-style: none;
                }
                .legal-list li {
                    position: relative;
                    padding-left: 20px;
                    margin-bottom: 8px;
                }
                .legal-list li::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 10px;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--primary);
                }
                .legal-highlight {
                    padding: 16px 20px;
                    border-radius: 12px;
                    margin: 16px 0;
                    font-size: 14px;
                    line-height: 1.7;
                }
                .back-to-top {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: var(--primary);
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 20px var(--primary-glow);
                    transition: all 0.3s;
                    z-index: 99;
                }
                .back-to-top:hover {
                    transform: translateY(-3px);
                }
            `}</style>

            <main style={{
                padding: '40px 24px 80px',
                minHeight: '80vh',
                animation: mounted ? 'fadeIn 0.6s ease' : 'none',
            }}>
                {/* Hero */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '48px',
                    padding: '48px 0',
                }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '18px',
                        background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px', color: 'var(--primary)',
                    }}>
                        <Scale size={28} />
                    </div>
                    <h1 style={{
                        fontSize: '44px', fontWeight: '900', color: 'var(--foreground)',
                        marginBottom: '12px', letterSpacing: '-1.5px',
                    }}>
                        Kullanım Şartları
                    </h1>
                    <p style={{ fontSize: '17px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                        Otosöz platformunu kullanmadan önce lütfen bu sözleşmeyi dikkatle okuyunuz.
                    </p>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '16px',
                        marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)',
                    }}>
                        <span>📅 Son Güncelleme: 1 Nisan 2026</span>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                        <span>⏱️ Okuma Süresi: ~10 dakika</span>
                    </div>
                </div>

                <div style={{
                    maxWidth: '1200px', margin: '0 auto',
                    display: 'flex', gap: '40px', alignItems: 'flex-start',
                }}>
                    {/* TOC Sidebar */}
                    <aside style={{
                        width: '280px', flexShrink: 0,
                        position: 'sticky', top: '100px',
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '20px', padding: '20px',
                        boxShadow: 'var(--card-shadow)',
                    }}>
                        <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', padding: '0 16px', letterSpacing: '1px' }}>
                            İÇİNDEKİLER
                        </h3>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {tocItems.map((item) => (
                                <button
                                    key={item.id}
                                    className={`toc-item ${activeSection === item.id ? 'active' : ''}`}
                                    onClick={() => scrollToSection(item.id)}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <article style={{
                        flex: 1, background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '24px', padding: '48px',
                        boxShadow: 'var(--card-shadow)',
                    }}>
                        {/* Intro */}
                        <div className="legal-highlight" style={{
                            background: isDark ? 'rgba(255,107,0,0.06)' : 'rgba(0,90,226,0.04)',
                            border: `1px solid ${isDark ? 'rgba(255,107,0,0.12)' : 'rgba(0,90,226,0.08)'}`,
                        }}>
                            <strong style={{ color: 'var(--foreground)' }}>⚠️� Önemli Bilgilendirme:</strong>{' '}
                            <span style={{ color: 'var(--text-muted)' }}>
                                Bu Kullanım Şartları Sözleşmesi, 6098 Sayılı Türk Borçlar Kanunu, 5651 Sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi Kanunu,
                                6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve 6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) çerçevesinde hazırlanmıştır.
                            </span>
                        </div>

                        {/* 1. Taraflar */}
                        <div data-section="taraflar" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>1</span>
                                Taraflar ve Tanımlar
                            </h2>
                            <p className="legal-p">
                                İŞbu Kullanım Şartları Sözleşmesi (&quot;Sözleşme&quot;), bir tarafta <strong style={{ color: 'var(--foreground)' }}>Otosöz İnternet Hizmetleri</strong> (&quot;Platform&quot;, &quot;Biz&quot;, &quot;Şirket&quot;) ile diğer tarafta platforma erişen ve/veya üye olan gerçek ya da tüzel kişi (&quot;Kullanıcı&quot;, &quot;Üye&quot;, &quot;Siz&quot;) arasında, elektronik ortamda akdedilmiştir.
                            </p>
                            <h3 className="legal-h3">1.1 Tanımlar</h3>
                            <ul className="legal-list">
                                <li><strong style={{ color: 'var(--foreground)' }}>Platform:</strong> www.Otosöz.com alan adı üzerinden erişilebilen web sitesi, mobil uygulama ve tüm dijital uzantılar.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Üye:</strong> Platformda kayıt işlemini tamamlayarak hesap oluşturan gerçek veya tüzel kişi.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Ziyaretçi:</strong> Platform&#39;a üye olmaksızın erişim saÃ„şlayan kişi.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>İçerik:</strong> Kullanıcılar tarafından paylaşılan yazı, yorum, fotoÃ„şraf, video, ilan ve benzeri her türlü materyal.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Hizmet:</strong> Platform aracılıÃ„şıyla sunulan forum, pazar yeri, araç karşılaştırma, fiyat analizi ve diğer tüm fonksiyonlar.</li>
                            </ul>
                        </div>

                        {/* 2. Konu */}
                        <div data-section="konu" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>2</span>
                                Sözleşmenin Konusu
                            </h2>
                            <p className="legal-p">
                                İŞbu Sözleşme&#39;nin konusu, Platform üzerinden sunulan hizmetlerden yararlanma koşullarının ve tarafların hak ve yükümlülüklerinin, 6098 Sayılı Türk Borçlar Kanunu ve ilgili mevzuat hükümleri çerçevesinde belirlenmesidir.
                            </p>
                            <p className="legal-p">
                                Kullanıcı, Platform&#39;a erişim saÃ„şladıÃ„şı veya üyelik oluşturduÃ„şu andan itibaren işbu Sözleşme&#39;nin tüm hükümlerini okumuş, anlamış ve kabul etmiş sayılır. Bu Sözleşme, Kullanıcı ile Platform arasında baÃ„şlayıcı bir hukuki ilişki tesis eder.
                            </p>
                        </div>

                        {/* 3. Hizmetler */}
                        <div data-section="hizmetler" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>3</span>
                                Hizmetlerin Kapsamı
                            </h2>
                            <p className="legal-p">Platform, aşaÃ„şıdaki hizmetleri sunmaktadır:</p>
                            <ul className="legal-list">
                                <li><strong style={{ color: 'var(--foreground)' }}>Forum ve Topluluk:</strong> Otomobil tutkunlarının deneyim paylaşımı, teknik tartışma ve bilgi alışverişi yapabildiği topluluk alanı.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Pazaryeri:</strong> Kullanıcılar arası araç ve yedek parça alım-satım ilanlarının yayınlandıÃ„şı alan.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Araç Karşılaştırma:</strong> Farklı marka ve modellerin teknik özelliklerinin karşılaştırılması.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Piyasa Analizi:</strong> Yakıt fiyatları, araç değerleme ve piyasa trendlerinin takibi.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Araç DNA:</strong> Araç geçmişi sorgulama ve güvenilirlik değerlendirmesi.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Uzman Görüşleri:</strong> Otomotiv alanında uzman kişilerin değerlendirme ve analizleri.</li>
                            </ul>
                            <p className="legal-p">
                                Platform, sunduÃ„şu hizmetlerin kapsamını, özelliklerini ve fiyatlandırmasını önceden bildirimde bulunmaksızın değiştirme, askıya alma veya sona erdirme hakkını saklı tutar.
                            </p>
                        </div>

                        {/* 4. Üyelik */}
                        <div data-section="uyelik" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>4</span>
                                Üyelik Şartları
                            </h2>
                            <h3 className="legal-h3">4.1 Üyelik Koşulları</h3>
                            <ul className="legal-list">
                                <li>Platform&#39;a üye olabilmek için 18 yaşını doldurmuş olmak veya 18 yaşından küçükler için yasal vasinin onayı gerekmektedir (4721 Sayılı Türk Medeni Kanunu m.11).</li>
                                <li>Üyelik başvurusunda doÃ„şru, eksiksiz ve güncel bilgiler verilmelidir.</li>
                                <li>Her gerçek veya tüzel kişi yalnızca bir (1) hesap açabilir. Çoklu hesap kullanımı tespit edildiğinde tüm hesaplar kapatılabilir.</li>
                                <li>Üyelik bilgileri ile hesap güvenliÃ„şi tamamen Kullanıcı&#39;nın sorumluluÃ„şundadır.</li>
                            </ul>
                            <h3 className="legal-h3">4.2 Hesap GüvenliÃ„şi</h3>
                            <p className="legal-p">
                                Kullanıcı, hesap bilgilerini (kullanıcı adı, Şifre vb.) gizli tutmakla yükümlüdür. Hesabın yetkisiz kullanımından doÃ„şabilecek her türlü zarar Kullanıcı&#39;ya aittir. Şüpheli bir erişim tespit edilmesi halinde derhal Platform&#39;a bildirimde bulunulmalıdır.
                            </p>
                        </div>

                        {/* 5. Yükümlülükler */}
                        <div data-section="yukumlulukler" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>5</span>
                                Kullanıcı Yükümlülükleri
                            </h2>
                            <p className="legal-p">Kullanıcı, Platform&#39;u kullanırken aşaÃ„şıdaki kurallara uymayı kabul ve taahhüt eder:</p>
                            <ul className="legal-list">
                                <li>Türkiye Cumhuriyeti kanunlarına, uluslararası anlaşmalara ve genel ahlak kurallarına aykırı davranışlarda bulunmamak.</li>
                                <li>5237 Sayılı Türk Ceza Kanunu kapsamında suç teşkil eden eylem ve içeriklerden kaçınmak.</li>
                                <li>Diğer kullanıcılara karşı hakaret, tehdit, ayrımcılık veya mobbing içeren davranışlarda bulunmamak.</li>
                                <li>Yanlış, yanıltıcı veya aldatıcı bilgi paylaşmamak.</li>
                                <li>Platform&#39;un teknik altyapısına zarar verecek (DDoS, SQL injection, brute force vb.) her türlü siber saldırı girişiminden kaçınmak (5651 Sayılı Kanun m.8).</li>
                                <li>Spam, istenmeyen reklam veya zincir mesaj göndermemek.</li>
                                <li>Başkalarının kişisel verilerini izinsiz olarak toplamak, işlemek veya paylaşmamak (KVKK m.12).</li>
                                <li>Üçüncü kişilerin fikri ve sınai mülkiyet haklarını ihlal etmemek (5846 Sayılı FSEK).</li>
                            </ul>

                            <div className="legal-highlight" style={{
                                background: 'rgba(239, 68, 68, 0.06)',
                                border: '1px solid rgba(239, 68, 68, 0.12)',
                            }}>
                                <strong style={{ color: '#EF4444' }}>⚠️� Uyarı:</strong>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>
                                    Yukarıdaki kurallara aykırı hareket eden kullanıcıların hesapları derhal ve süresiz olarak askıya alınır. Platform, gerekli gördüÃ„şü hallerde konuyu yetkili adli makamlara bildirir ve yasal süreç başlatır.
                                </span>
                            </div>
                        </div>

                        {/* 6. İçerik */}
                        <div data-section="icerik" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>6</span>
                                İçerik Politikası
                            </h2>
                            <h3 className="legal-h3">6.1 Kullanıcı Tarafından Üretilen İçerik</h3>
                            <p className="legal-p">
                                Kullanıcılar tarafından paylaşılan her türlü içeriÃ„şin (forum yazıları, yorumlar, ilanlar, görseller) hukuki sorumluluÃ„şu paylaşan kişiye aittir. 5651 Sayılı Kanun m.5 uyarınca Platform, yer saÃ„şlayıcı konumundadır ve içeriklerden doÃ„şrudan sorumlu değildir; ancak hukuka aykırı içeriÃ„şin kendisine bildirilmesi halinde erişimi engellemekle yükümlüdür.
                            </p>
                            <h3 className="legal-h3">6.2 İçerik Lisansı</h3>
                            <p className="legal-p">
                                Kullanıcı, Platform&#39;da paylaştıÃ„şı içerikler üzerindeki telif haklarını muhafaza eder. Ancak içeriÃ„şi paylaşmakla, Platform&#39;a söz konusu içeriÃ„şi düzenleme, çoÃ„şaltma ve Platform hizmetleri kapsamında kullanma konusunda münhasır olmayan, dünya çapında geçerli, bedelsiz bir lisans vermiş sayılır.
                            </p>
                            <h3 className="legal-h3">6.3 Yasak İçerikler</h3>
                            <ul className="legal-list">
                                <li>Terörü, Şiddeti veya nefret söylemini destekleyen içerikler.</li>
                                <li>Pornografik veya müstehcen materyal.</li>
                                <li>Kişisel verilerin izinsiz paylaşımı (doxxing).</li>
                                <li>Yanıltıcı veya sahte haberler.</li>
                                <li>Kumar, bahis veya yasadışı faaliyetlerin teşviki.</li>
                                <li>Telif hakkı ihlali içeren içerikler (5846 Sayılı FSEK kapsamında).</li>
                            </ul>
                        </div>

                        {/* 7. Pazar */}
                        <div data-section="pazar" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>7</span>
                                Pazaryeri Kuralları
                            </h2>
                            <p className="legal-p">
                                Platform&#39;un pazaryeri bölümü, kullanıcılar arası araç ve yedek parça alım-satım ilanlarının yayınlanmasına aracılık eder. Platform, 6563 Sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun uyarınca yalnızca aracı hizmet saÃ„şlayıcıdır.
                            </p>
                            <ul className="legal-list">
                                <li>İlan veren, ilanda belirtilen bilgilerin doÃ„şruluÃ„şundan ve güncelliÃ„şinden tamamen sorumludur.</li>
                                <li>Çalıntı, hacizli veya hukuki ihtilaf altındaki araçların ilanı kesinlikle yasaktır.</li>
                                <li>Araç satış işlemlerinde tüm yasal prosedürler (noter devir, MTBS kaydı vb.) tarafların sorumluluÃ„şundadır.</li>
                                <li>Platform, alıcı ile satıcı arasındaki ticari anlaşmazlıklarda taraf değildir.</li>
                                <li>Güven Metre™ sistemi bilgilendirme amaçlıdır ve hukuki taahhüt niteliÃ„şi taşımaz.</li>
                            </ul>
                        </div>

                        {/* 8. Fikri Mülkiyet */}
                        <div data-section="fikri" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>8</span>
                                Fikri Mülkiyet Hakları
                            </h2>
                            <p className="legal-p">
                                Platform&#39;a ait tüm içerikler (yazılım kaynak kodu, tasarımlar, logolar, &quot;Otosöz&quot;, &quot;Güven Metre&quot;, &quot;Araç DNA&quot; gibi marka ve hizmet adları, algoritmalar, veritabanları ve benzeri tüm unsurlar) 5846 Sayılı Fikir ve Sanat Eserleri Kanunu, 6769 Sayılı Sınai Mülkiyet Kanunu ve ilgili uluslararası anlaşmalar kapsamında korunmaktadır.
                            </p>
                            <p className="legal-p">
                                Bu içeriklerin önceden yazılı izin alınmaksızın kopyalanması, çoÃ„şaltılması, daÃ„şıtılması, işlenmesi veya herhangi bir Şekilde ticari amaçla kullanılması kesinlikle yasaktır ve hukuki/cezai yaptırıma tabidir.
                            </p>
                        </div>

                        {/* 9. Sorumluluk */}
                        <div data-section="sorumluluk" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>9</span>
                                Sorumluluk Sınırları
                            </h2>
                            <ul className="legal-list">
                                <li>Platform üzerinde sunulan araç teknik verileri, fiyat analizleri, piyasa tahminleri ve benzeri içerikler yalnızca bilgilendirme amaçlıdır. Bu bilgilere dayanılarak yapılan alım-satım kararlarından Platform sorumlu tutulamaz.</li>
                                <li>Platform, teknik arızalar, bakım çalışmaları veya mücbir sebeplerden (doÃ„şal afet, siber saldırı, yasal düzenleme vb.) kaynaklanan hizmet kesintilerinden sorumlu değildir.</li>
                                <li>Kullanıcılar arası iletişim ve ticari işlemlerden doÃ„şan uyuşmazlıklarda Platform taraf değildir.</li>
                                <li>Platform, üçüncü taraf web sitelerine verilen baÃ„şlantıların içeriÃ„şinden sorumlu değildir.</li>
                            </ul>
                        </div>

                        {/* 10. Fesih */}
                        <div data-section="fesih" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>10</span>
                                Üyelik Feshi ve Hesap Kapatma
                            </h2>
                            <h3 className="legal-h3">10.1 Kullanıcı Tarafından Fesih</h3>
                            <p className="legal-p">
                                Kullanıcı, dilediği zaman hesap ayarları üzerinden veya otosoz.destek@gmail.com adresine yazılı başvuruda bulunarak üyeliğini sonlandırabilir. Hesap kapanması ile birlikte kullanıcı verileri KVKK m.7 uyarınca makul sürede silinir veya anonim hale getirilir.
                            </p>
                            <h3 className="legal-h3">10.2 Platform Tarafından Fesih</h3>
                            <p className="legal-p">
                                Platform, işbu Sözleşme hükümlerine aykırı davranan, yasadışı faaliyetlerde bulunan veya diğer kullanıcıların haklarını ihlal eden üyelerin hesaplarını önceden bildirimde bulunmaksızın askıya alabilir veya kalıcı olarak kapatabilir.
                            </p>
                        </div>

                        {/* 11. Değişiklik */}
                        <div data-section="degisiklik" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>11</span>
                                Sözleşme Değişiklik Hakkı
                            </h2>
                            <p className="legal-p">
                                Platform, işbu Sözleşme&#39;nin herhangi bir maddesini, dilediği zaman, tek taraflı olarak değiştirme, güncelleme veya kaldırma hakkını saklı tutar. Değişiklikler, Platform&#39;da yayımlandıÃ„şı tarihte yürürlüÃ„şe girer. Esaslı değişiklikler durumunda kullanıcılara e-posta ve/veya platform içi bildirim yoluyla bilgilendirme yapılır.
                            </p>
                            <p className="legal-p">
                                Değişiklik sonrasında Platform&#39;u kullanmaya devam eden Kullanıcı, yeni koşulları kabul etmiş sayılır.
                            </p>
                        </div>

                        {/* 12. Uyuşmazlık */}
                        <div data-section="uyusmazlik" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>12</span>
                                Uyuşmazlık Çözümü
                            </h2>
                            <p className="legal-p">
                                İŞbu Sözleşme&#39;den doÃ„şan veya Sözleşme ile baÃ„şlantılı her türlü uyuşmazlıÃ„şın çözümünde <strong style={{ color: 'var(--foreground)' }}>Türkiye Cumhuriyeti hukuku</strong> uygulanır.
                            </p>
                            <p className="legal-p">
                                Taraflar, aralarındaki uyuşmazlıkları öncelikle müzakere ve uzlaşma yoluyla çözmeye çalışacaklardır. Uzlaşma saÃ„şlanamaması halinde, 6100 Sayılı Hukuk Muhakemeleri Kanunu uyarınca <strong style={{ color: 'var(--foreground)' }}>İstanbul (ÇaÃ„şlayan) Mahkemeleri ve İcra Daireleri</strong> münhasır yetkilidir.
                            </p>
                            <p className="legal-p">
                                Tüketici işlemleri açısından, 6502 Sayılı Kanun kapsamında il ve ilçe tüketici hakem heyetlerine başvuru hakkı saklıdır.
                            </p>
                        </div>

                        {/* 13. Yürürlük */}
                        <div data-section="yururluk" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>13</span>
                                Yürürlük
                            </h2>
                            <p className="legal-p">
                                İŞbu Sözleşme, toplam 13 (on üç) maddeden oluşmakta olup, Kullanıcı&#39;nın Platform&#39;a erişim saÃ„şladıÃ„şı veya üyelik oluşturduÃ„şu tarih itibarıyla yürürlüÃ„şe girer ve üyelik devam ettiÃ„şi sürece geçerliliÃ„şini korur.
                            </p>
                            <div className="legal-highlight" style={{
                                background: isDark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.04)',
                                border: `1px solid ${isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)'}`,
                                marginTop: '24px',
                            }}>
                                <strong style={{ color: '#22c55e' }}>✅ Onay:</strong>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>
                                    Platform&#39;a kayıt olarak veya Platform&#39;u kullanarak işbu Kullanım Şartları Sözleşmesi&#39;nin tüm hükümlerini okuduÃ„şunuzu, anladıÃ„şınızı ve kabul ettiÃ„şinizi beyan etmektesiniz.
                                </span>
                            </div>
                            <p className="legal-p" style={{ marginTop: '24px', fontSize: '13px', opacity: 0.7 }}>
                                Son güncelleme tarihi: 1 Nisan 2026 | Yürürlük tarihi: 1 Nisan 2026
                            </p>
                        </div>
                    </article>
                </div>
            </main>

            {/* Back to top */}
            {showBackToTop && (
                <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <ArrowUp size={20} />
                </button>
            )}

            <Footer />
        </div>
    );
}
