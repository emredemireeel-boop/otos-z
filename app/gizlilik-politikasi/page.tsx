"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { Shield, Eye, Database, Lock, Globe, Bell, UserCheck, FileText, ArrowUp, Mail } from "lucide-react";

export default function GizlilikPolitikasiPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
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
        { id: 'veri-sorumlusu', label: '1. Veri Sorumlusu', icon: <UserCheck size={15} /> },
        { id: 'kapsam', label: '2. Politika Kapsamı', icon: <FileText size={15} /> },
        { id: 'toplanan-veriler', label: '3. Toplanan Kişisel Veriler', icon: <Database size={15} /> },
        { id: 'isleme-amaci', label: '4. İŞleme Amaçları', icon: <Eye size={15} /> },
        { id: 'hukuki-sebepler', label: '5. Hukuki Sebepler', icon: <Shield size={15} /> },
        { id: 'veri-paylasimi', label: '6. Veri Paylaşımı', icon: <Globe size={15} /> },
        { id: 'cerezler', label: '7. Çerezler (Cookies)', icon: <Database size={15} /> },
        { id: 'veri-guvenligi', label: '8. Veri Güvenliği', icon: <Lock size={15} /> },
        { id: 'saklama-suresi', label: '9. Saklama Süreleri', icon: <FileText size={15} /> },
        { id: 'ilgili-haklari', label: '10. İlgili Kişi Hakları', icon: <UserCheck size={15} /> },
        { id: 'cocuk-gizlilik', label: '11. Çocukların Gizliliği', icon: <Shield size={15} /> },
        { id: 'degisiklikler', label: '12. Politika Değişiklikleri', icon: <Bell size={15} /> },
        { id: 'iletisim', label: '13. İletişim', icon: <Mail size={15} /> },
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
                .data-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    margin: 16px 0;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid var(--card-border);
                }
                .data-table th {
                    background: var(--hover-primary);
                    color: var(--foreground);
                    font-weight: 700;
                    font-size: 13px;
                    padding: 14px 16px;
                    text-align: left;
                    letter-spacing: 0.3px;
                }
                .data-table td {
                    padding: 12px 16px;
                    font-size: 14px;
                    color: var(--text-muted);
                    border-top: 1px solid var(--card-border);
                    line-height: 1.6;
                }
                .data-table tr:hover td {
                    background: var(--hover-primary);
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
                        <Shield size={28} />
                    </div>
                    <h1 style={{
                        fontSize: '44px', fontWeight: '900', color: 'var(--foreground)',
                        marginBottom: '12px', letterSpacing: '-1.5px',
                    }}>
                        Gizlilik Politikası
                    </h1>
                    <p style={{ fontSize: '17px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                        Kişisel verilerinizin korunması bizim en önemli önceliğimizdir.
                        KVKK ve GDPR standartlarına tam uyumluluk.
                    </p>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '16px',
                        marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)',
                    }}>
                        <span>📅 Son Güncelleme: 1 Nisan 2026</span>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                        <span> KVKK Uyumlu</span>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                        <span>⏱️ ~12 dakika okuma</span>
                    </div>
                </div>

                <div style={{
                    maxWidth: '1200px', margin: '0 auto',
                    display: 'flex', gap: '40px', alignItems: 'flex-start',
                }}>
                    {/* TOC */}
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
                        {/* KVKK Notice */}
                        <div className="legal-highlight" style={{
                            background: isDark ? 'rgba(255,107,0,0.06)' : 'rgba(0,90,226,0.04)',
                            border: `1px solid ${isDark ? 'rgba(255,107,0,0.12)' : 'rgba(0,90,226,0.08)'}`,
                        }}>
                            <strong style={{ color: 'var(--foreground)' }}> KVKK Aydınlatma Metni:</strong>{' '}
                            <span style={{ color: 'var(--text-muted)' }}>
                                Bu Gizlilik Politikası, 6698 Sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) m.10 uyarınca hazırlanan aydınlatma yükümlülüğünü yerine getirmektedir.
                                Ayrıca AB Genel Veri Koruma Tüzüğü (GDPR) ilkelerine de uyum sağlamaktadır.
                            </span>
                        </div>

                        {/* 1. Veri Sorumlusu */}
                        <div data-section="veri-sorumlusu" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>1</span>
                                Veri Sorumlusu
                            </h2>
                            <p className="legal-p">
                                KVKK m.3/ı uyarınca, kişisel verilerinizin işlenmesine ilişkin amaç ve vasıtaları belirleyen veri sorumlusu sıfatıyla hareket eden tüzel kişi bilgileri aşağıda sunulmaktadır:
                            </p>
                            <div style={{
                                padding: '20px 24px', borderRadius: '14px',
                                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                                border: '1px solid var(--card-border)', margin: '16px 0',
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '10px', fontSize: '14px' }}>
                                    <strong style={{ color: 'var(--foreground)' }}>Unvan:</strong> <span style={{ color: 'var(--text-muted)' }}>Otosöz İnternet Hizmetleri</span>
                                    <strong style={{ color: 'var(--foreground)' }}>Adres:</strong> <span style={{ color: 'var(--text-muted)' }}>İstanbul, Türkiye</span>
                                    <strong style={{ color: 'var(--foreground)' }}>E-posta:</strong> <span style={{ color: 'var(--text-muted)' }}>kvkk@Otosöz.com</span>
                                    <strong style={{ color: 'var(--foreground)' }}>Web:</strong> <span style={{ color: 'var(--text-muted)' }}>www.Otosöz.com</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Kapsam */}
                        <div data-section="kapsam" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>2</span>
                                Politika Kapsamı
                            </h2>
                            <p className="legal-p">
                                Bu Gizlilik Politikası, www.Otosöz.com web sitesi, mobil uygulamaları ve tüm dijital uzantıları aracılığıyla toplanan kişisel verilerin; nasıl toplandığını, hangi amaçlarla işlendiğini, kimlere ve hangi koşullarla aktarılabileceğini ve veri sahiplerinin KVKK kapsamındaki haklarını düzenler.
                            </p>
                            <p className="legal-p">
                                Politika; Platform&#39;a üye olan, ziyaret eden veya herhangi bir Şekilde hizmetlerinden yararlanan tüm gerçek kişilere uygulanır.
                            </p>
                        </div>

                        {/* 3. Toplanan Veriler */}
                        <div data-section="toplanan-veriler" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>3</span>
                                Toplanan Kişisel Veriler
                            </h2>
                            <p className="legal-p">KVKK m.3/d tanımına istinaden, aşağıdaki kategorilerdeki kişisel veriler işlenmektedir:</p>

                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Veri Kategorisi</th>
                                        <th>Veri Türleri</th>
                                        <th>Toplama Yöntemi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>Kimlik Bilgileri</strong></td>
                                        <td>Kullanıcı adı, e-posta adresi</td>
                                        <td>Üyelik formu</td>
                                    </tr>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>İletişim Bilgileri</strong></td>
                                        <td>E-posta adresi, iletişim formu verileri</td>
                                        <td>Üyelik / İletişim formu</td>
                                    </tr>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>Dijital İz Verileri</strong></td>
                                        <td>IP adresi, tarayıcı türü/versiyonu, işletim sistemi, cihaz bilgileri</td>
                                        <td>Otomatik (sunucu logları)</td>
                                    </tr>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>Kullanım Verileri</strong></td>
                                        <td>Sayfa görüntüleme, arama sorguları, tıklama davranışları, oturum süresi</td>
                                        <td>Otomatik (analitik araçları)</td>
                                    </tr>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>Tercih Verileri</strong></td>
                                        <td>Tema tercihi, dil ayarları, bildirim tercihleri</td>
                                        <td>Çerezler / Kullanıcı ayarları</td>
                                    </tr>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>İçerik Verileri</strong></td>
                                        <td>Forum paylaşımları, yorumlar, ilan bilgileri, yüklenen görseller</td>
                                        <td>Kullanıcı tarafından gönüllü</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="legal-highlight" style={{
                                background: isDark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.04)',
                                border: `1px solid ${isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)'}`,
                            }}>
                                <strong style={{ color: '#22c55e' }}>✅ Özel Nitelikli Kişisel Veri:</strong>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>
                                    KVKK m.6 kapsamında tanımlanan özel nitelikli kişisel veriler (ırk, sağlık, biyometrik vb.) Platform tarafından hiçbir koşulda toplanmaz ve işlenmez.
                                </span>
                            </div>
                        </div>

                        {/* 4. İŞleme Amaçları */}
                        <div data-section="isleme-amaci" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>4</span>
                                Kişisel Verilerin İŞlenme Amaçları
                            </h2>
                            <p className="legal-p">KVKK m.5 ve m.6 çerçevesinde kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
                            <ul className="legal-list">
                                <li><strong style={{ color: 'var(--foreground)' }}>Üyelik İŞlemleri:</strong> Hesap oluşturma, kimlik doğrulama ve oturum yönetimi.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Hizmet Sunumu:</strong> Platform hizmetlerinin (forum, pazar, karşılaştırma vb.) sağlanması ve kişiselleştirilmesi.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>İletişim:</strong> Bildirimler, duyurular ve destek taleplerinin yönetimi.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Güvenlik:</strong> Platform güvenliğinin sağlanması, kötüye kullanımın ve yetkisiz erişimin önlenmesi.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Analiz:</strong> Anonim kullanım iİstatistikleri üretme, hizmet kalitesini artırma ve kullanıcı deneyimini iyileştirme.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Hukuki Yükümlülük:</strong> Yasal düzenlemeler ve yetkili makam taleplerine uyum (5651 Sayılı Kanun, CMK vb.).</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Meşru Menfaat:</strong> Dolandırıcılık tespiti, sistem sağlığı izleme ve hizmet iyileştirme.</li>
                            </ul>
                        </div>

                        {/* 5. Hukuki Sebepler */}
                        <div data-section="hukuki-sebepler" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>5</span>
                                Kişisel Verilerin İŞlenmesinin Hukuki Sebepleri
                            </h2>
                            <p className="legal-p">Kişisel verileriniz KVKK m.5/2 kapsamında aşağıdaki hukuki sebeplere dayanarak işlenmektedir:</p>
                            <ul className="legal-list">
                                <li><strong style={{ color: 'var(--foreground)' }}>m.5/2-a:</strong> Kanunlarda açıkça öngörülmesi (5651 Sayılı Kanun uyarınca trafik log kayıtlarının tutulması).</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>m.5/2-c:</strong> Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (üyelik sözleşmesi kapsamındaki hizmetlerin sunulması).</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>m.5/2-ç:</strong> Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>m.5/2-e:</strong> Bir hakkın tesisi, kullanılması veya korunması.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>m.5/2-f:</strong> İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>m.5/1:</strong> Belirtilen sebeplerin mevcut olmadığı hallerde, açık rızanızın alınması.</li>
                            </ul>
                        </div>

                        {/* 6. Veri Paylaşımı */}
                        <div data-section="veri-paylasimi" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>6</span>
                                Kişisel Verilerin Aktarılması
                            </h2>
                            <p className="legal-p">
                                Kişisel verileriniz, KVKK m.8 ve m.9 hükümleri çerçevesinde ve yalnızca aşağıda belirtilen taraflarla, belirtilen amaçlarla sınırlı olarak paylaşılabilir:
                            </p>
                            <ul className="legal-list">
                                <li><strong style={{ color: 'var(--foreground)' }}>Yetkili Kamu Kurum ve Kuruluşları:</strong> Yasal yükümlülükler kapsamında (mahkeme kararları, savcılık talepleri vb.).</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Teknik Hizmet Sağlayıcıları:</strong> Sunucu barındırma, CDN ve analitik hizmetleri sunan iş ortakları (veri işleyen sıfatıyla, veri işleme sözleşmesi kapsamında).</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Hukuki Danışmanlar:</strong> Hukuki uyuşmazlıkların çözümünde.</li>
                            </ul>
                            <div className="legal-highlight" style={{
                                background: 'rgba(239, 68, 68, 0.06)',
                                border: '1px solid rgba(239, 68, 68, 0.12)',
                            }}>
                                <strong style={{ color: '#EF4444' }}>⛔ Kesin Taahhüt:</strong>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>
                                    Kişisel verileriniz hiçbir koşulda üçüncü taraf reklam Şirketlerine satılmaz, kiralanmaz veya ticari amaçla paylaşılmaz. Yurt dışına veri aktarımı yapılması halinde KVKK m.9 hükümlerine tam uyum sağlanır.
                                </span>
                            </div>
                        </div>

                        {/* 7. Çerezler */}
                        <div data-section="cerezler" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>7</span>
                                Çerezler (Cookies)
                            </h2>
                            <p className="legal-p">
                                Platform, 5809 Sayılı Elektronik Haberleşme Kanunu m.51/4 ve ilgili ikincil mevzuat uyarınca çerez teknolojilerini kullanmaktadır.
                            </p>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Çerez Türü</th>
                                        <th>Amacı</th>
                                        <th>Süre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>Zorunlu Çerezler</strong></td>
                                        <td>Oturum yönetimi, güvenlik, temel platform işlevleri</td>
                                        <td>Oturum süresi</td>
                                    </tr>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>İŞlevsel Çerezler</strong></td>
                                        <td>Tema tercihi (açık/koyu mod), dil ayarları, kullanıcı tercihlerinin hatırlanması</td>
                                        <td>1 yıl</td>
                                    </tr>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>Analitik Çerezler</strong></td>
                                        <td>Anonim ziyaret iİstatistikleri, sayfa görüntüleme ölçümü, performans analizi</td>
                                        <td>6 ay</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="legal-p">
                                Tarayıcınızın ayarlarını değiştirerek çerezleri devre dışı bırakabilirsiniz. Ancak bu durumda Platform&#39;un bazı işlevleri düzgün çalışmayabilir. Zorunlu çerezler Platform&#39;un temel işleyişi için gerekli olup, devre dışı bırakılması halinde hizmetlerden yararlanamayabilirsiniz.
                            </p>
                        </div>

                        {/* 8. Güvenlik */}
                        <div data-section="veri-guvenligi" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>8</span>
                                Veri Güvenliği Tedbirleri
                            </h2>
                            <p className="legal-p">
                                KVKK m.12 uyarınca kişisel verilerinizin güvenliği için aşağıdaki idari ve teknik tedbirler uygulanmaktadır:
                            </p>
                            <h3 className="legal-h3">8.1 Teknik Tedbirler</h3>
                            <ul className="legal-list">
                                <li><strong style={{ color: 'var(--foreground)' }}>SSL/TLS Şifreleme:</strong> Tüm veri iletişimi 256-bit AES Şifreleme ile korunur.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Güvenlik Duvarı (WAF):</strong> Web uygulaması güvenlik duvarı ile siber saldırılara karşı koruma.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Şifreli Depolama:</strong> Kullanıcı Şifreleri bcrypt algoritması ile hash&#39;lenerek saklanır; düz metin olarak hiçbir yerde tutulmaz.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Penetrasyon Testleri:</strong> Periyodik güvenlik taramaları ve zafiyet testleri uygulanır.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Yedekleme:</strong> Düzenli, Şifreli yedekler coğrafi olarak ayrılmış sunucularda saklanır.</li>
                            </ul>
                            <h3 className="legal-h3">8.2 İdari Tedbirler</h3>
                            <ul className="legal-list">
                                <li>Erişim yetkilendirme matrisi (en az yetki prensibi).</li>
                                <li>Çalışan gizlilik sözleşmeleri ve düzenli veri koruma eğitimleri.</li>
                                <li>Veri ihlali müdahale planı ve 72 saat içinde KVKK Kurulu&#39;na bildirim prosedürü.</li>
                                <li>Periyodik iç denetim ve uyumluluk kontrolleri.</li>
                            </ul>
                        </div>

                        {/* 9. Saklama Süresi */}
                        <div data-section="saklama-suresi" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>9</span>
                                Kişisel Verilerin Saklama Süreleri
                            </h2>
                            <p className="legal-p">
                                Kişisel verileriniz, KVKK m.7 ve Kişisel Verilerin Silinmesi, Yok Edilmesi veya Anonim Hale Getirilmesi Hakkında Yönetmelik uyarınca, işlenme amacının gerektirdiği süre boyunca saklanır.
                            </p>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Veri Türü</th>
                                        <th>Saklama Süresi</th>
                                        <th>Hukuki Dayanak</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>Üyelik Bilgileri</strong></td>
                                        <td>Üyelik boyunca + hesap kapatmadan sonra 3 yıl</td>
                                        <td>TBK m.146 (Genel zamanaşımı)</td>
                                    </tr>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>Trafik Logları (IP vb.)</strong></td>
                                        <td>2 yıl</td>
                                        <td>5651 Sayılı Kanun m.5/4</td>
                                    </tr>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>İŞlem Logları</strong></td>
                                        <td>10 yıl</td>
                                        <td>TTK m.82 (Ticari defterlerin saklanması)</td>
                                    </tr>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>Analitik Veriler</strong></td>
                                        <td>Anonim hale getirilerek süresiz</td>
                                        <td>KVKK m.7/4</td>
                                    </tr>
                                    <tr>
                                        <td><strong style={{ color: 'var(--foreground)' }}>Çerez Verileri</strong></td>
                                        <td>Çerez türüne göre (oturum - 1 yıl)</td>
                                        <td>Elektronik Haberleşme Kanunu</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="legal-p">
                                Saklama süresinin dolması veya işleme amacının ortadan kalkması halinde, kişisel verileriniz KVKK m.7 uyarınca en geç 180 gün içinde silinir, yok edilir veya anonim hale getirilir.
                            </p>
                        </div>

                        {/* 10. İlgili Kişi Hakları */}
                        <div data-section="ilgili-haklari" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>10</span>
                                İlgili Kişi Hakları (KVKK m.11)
                            </h2>
                            <p className="legal-p">KVKK m.11 uyarınca, kişisel veri sahibi olarak aşağıdaki haklara sahipsiniz:</p>
                            <ul className="legal-list">
                                <li><strong style={{ color: 'var(--foreground)' }}>Bilgi Talep Hakkı:</strong> Kişisel verilerinizin işlenip işlenmediğini öğrenme.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Bilgi Edinme Hakkı:</strong> İŞlenmişse buna ilişkin bilgi talep etme.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Amaç Öğrenme Hakkı:</strong> İŞlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Aktarım Bilgisi Hakkı:</strong> Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Düzeltme Hakkı:</strong> Eksik veya yanlış işlenmiş ise düzeltilmesini isteme.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Silme/Yok Etme Hakkı:</strong> KVKK m.7 kapsamında silinmesini veya yok edilmesini isteme.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>İtiraz Hakkı:</strong> Münhasıran otomatik sistemler vasıtasıyla analiz sonucu aleyhinize bir sonuç çıkmasına itiraz etme.</li>
                                <li><strong style={{ color: 'var(--foreground)' }}>Tazminat Hakkı:</strong> Kanuna aykırı işleme nedeniyle zarara uğranması halinde zararın giderilmesini talep etme.</li>
                            </ul>

                            <div className="legal-highlight" style={{
                                background: isDark ? 'rgba(255,107,0,0.06)' : 'rgba(0,90,226,0.04)',
                                border: `1px solid ${isDark ? 'rgba(255,107,0,0.12)' : 'rgba(0,90,226,0.08)'}`,
                            }}>
                                <strong style={{ color: 'var(--foreground)' }}>📫 Başvuru Yöntemi:</strong>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>
                                    Haklarınıza ilişkin başvurularınızı <strong>kvkk@Otosöz.com</strong> e-posta adresine veya noter kanalıyla yazılı olarak iletebilirsiniz.
                                    Başvurularınız KVKK m.13 uyarınca en geç <strong>30 (otuz) gün</strong> içinde ücretsiz olarak sonuçlandırılacaktır.
                                    Başvurunun reddedilmesi halinde, Kişisel Verileri Koruma Kurulu&#39;na Şikayette bulunma hakkınız saklıdır (KVKK m.14).
                                </span>
                            </div>
                        </div>

                        {/* 11. Çocukların Gizliliği */}
                        <div data-section="cocuk-gizlilik" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>11</span>
                                Çocukların Gizliliği
                            </h2>
                            <p className="legal-p">
                                Platform hizmetleri 18 yaşın üzerindeki bireylere yöneliktir. 18 yaşından küçük bireylerin kişisel verilerinin işlenmesi, yalnızca yasal vasi/velinin açık rızası ile mümkündür (TMK m.11, KVKK m.6). Ebeveynlerin, çocuklarının bilgilerinin rızaları dışında toplandığını fark etmeleri halinde derhal kvkk@Otosöz.com adresine bildirimde bulunmaları gerekmektedir.
                            </p>
                        </div>

                        {/* 12. Değişiklikler */}
                        <div data-section="degisiklikler" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>12</span>
                                Politika Değişiklikleri
                            </h2>
                            <p className="legal-p">
                                Platform, bu Gizlilik Politikası&#39;nı yasal düzenlemelerdeki değişikliklere, teknolojik gelişmelere veya iç politika güncellemelerine bağlı olarak güncelleme hakkını saklı tutar. Esaslı değişikliklerde kullanıcılara e-posta ve platform içi bildirim yoluyla bilgilendirme yapılır.
                            </p>
                            <p className="legal-p">
                                Güncel Gizlilik Politikası her zaman bu sayfada yayımlanır. Politikayı periyodik olarak gözden geçirmenizi öneririz.
                            </p>
                        </div>

                        {/* 13. İletişim */}
                        <div data-section="iletisim" className="legal-section">
                            <h2 className="legal-h2">
                                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(255,107,0,0.1)' : 'rgba(0,90,226,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}>13</span>
                                İletişim
                            </h2>
                            <p className="legal-p">
                                Gizlilik Politikası hakkındaki sorularınız, veri koruma haklarınıza ilişkin başvurularınız veya Şikayetleriniz için:
                            </p>
                            <div style={{
                                padding: '24px', borderRadius: '14px',
                                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                                border: '1px solid var(--card-border)', margin: '16px 0',
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '12px', fontSize: '14px' }}>
                                    <strong style={{ color: 'var(--foreground)' }}>📦 KVKK Başvuru:</strong> <span style={{ color: 'var(--text-muted)' }}>kvkk@Otosöz.com</span>
                                    <strong style={{ color: 'var(--foreground)' }}>📦 Genel İletişim:</strong> <span style={{ color: 'var(--text-muted)' }}>otosoz.destek@gmail.com</span>
                                    <strong style={{ color: 'var(--foreground)' }}>🌍 Web:</strong> <span style={{ color: 'var(--text-muted)' }}>www.Otosöz.com/iletisim</span>
                                </div>
                            </div>

                            <div className="legal-highlight" style={{
                                background: isDark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.04)',
                                border: `1px solid ${isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)'}`,
                                marginTop: '24px',
                            }}>
                                <strong style={{ color: '#22c55e' }}>✅ Taahhüt:</strong>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>
                                    Otosöz olarak, kişisel verilerinizin korunması konusundaki sorumluluğumuzu en üst düzeyde tutuyoruz.
                                    KVKK ve ilgili mevzuata tam uyum sağlamayı ve veri güvenliği standartlarımızı sürekli iyileştirmeyi taahhüt ediyoruz.
                                </span>
                            </div>

                            <p className="legal-p" style={{ marginTop: '24px', fontSize: '13px', opacity: 0.7 }}>
                                Son güncelleme tarihi: 1 Nisan 2026 | Yürürlük tarihi: 1 Nisan 2026
                            </p>
                        </div>
                    </article>
                </div>
            </main>

            {showBackToTop && (
                <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <ArrowUp size={20} />
                </button>
            )}

            <Footer />
        </div>
    );
}
