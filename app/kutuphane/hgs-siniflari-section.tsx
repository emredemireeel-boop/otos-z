"use client";

import { useState } from "react";
import { CreditCard, Info, Smartphone, ChevronDown, ChevronUp, AlertCircle, ExternalLink, Car, Truck, Bus, Bike } from "lucide-react";

const hgsSiniflari = [
    {
        sinif: 1, baslik: "1. Sınıf Araçlar",
        tanim: "Aks aralığı (dingil mesafesi) 3.20 metre altında olan 2 akslı araçlar",
        araclar: ["Otomobil", "Motosiklet", "Kamyonet", "Minibüs", "Arazi Taşıtı"],
        detay: "Günlük hayatta en sık kullanılan araç sınıfıdır. Binek otomobiller, SUV'lar, hafif ticari araçlar ve motosikletler bu kategoriye girer. İki aks (dingil) bulunur ve aks aralığı 3.20 metreden kısadır.",
        aksAraligi: "< 3.20 m", aksSayisi: 2, gradient: ["#3B82F6", "#1D4ED8"],
        icon: Car,
    },
    {
        sinif: 2, baslik: "2. Sınıf Araçlar",
        tanim: "Aks aralığı 3.20 metre ve üzerinde olan her türlü 2 akslı araçlar",
        araclar: ["Minibüs", "Kamyonet", "Otobüs (2 akslı)", "Büyük Kamyon"],
        detay: "1. sınıftan farkı aks aralığının 3.20 metre ve üzerinde olmasıdır. Daha uzun şasili kamyonetler, 2 akslı otobüsler ve büyük panelvanlar bu sınıfa dahildir.",
        aksAraligi: "≥ 3.20 m", aksSayisi: 2, gradient: ["#F59E0B", "#D97706"],
        icon: Truck,
    },
    {
        sinif: 3, baslik: "3. Sınıf Araçlar",
        tanim: "Aks adedi (dingil sayısı) 3 tane olan her türlü araçlar",
        araclar: ["3 Akslı Otobüs", "3 Akslı Kamyon", "Çekici"],
        detay: "Üç dingile sahip araçlardır. Şehirlerarası yolcu taşımacılığında kullanılan büyük otobüsler ve orta tonajlı kamyonlar genellikle bu sınıftadır.",
        aksAraligi: "Değişken", aksSayisi: 3, gradient: ["#10B981", "#059669"],
        icon: Bus,
    },
    {
        sinif: 4, baslik: "4. Sınıf Araçlar",
        tanim: "Dingil sayısı 4 ve 5 adet olan her türlü araçlar",
        araclar: ["4-5 Akslı TIR", "Ağır Kamyon", "Dorse + Çekici"],
        detay: "Ağır tonajlı taşımacılık araçlarıdır. Genellikle çekici + dorse kombinasyonlarından oluşur. İnşaat malzemesi, akaryakıt ve ağır yük taşımacılığında kullanılır.",
        aksAraligi: "Değişken", aksSayisi: "4-5", gradient: ["#EF4444", "#DC2626"],
        icon: Truck,
    },
    {
        sinif: 5, baslik: "5. Sınıf Araçlar",
        tanim: "Dingil sayısı 6 ve daha fazla olan kamyon, TIR ve treyler araçlar",
        araclar: ["6+ Akslı TIR", "Kamyon + Treyler", "Özel Ağır Nakliye"],
        detay: "En ağır ve en uzun araç sınıfıdır. Çok akslı TIR'lar, treylerler ve özel nakliye araçları bu kategoridedir. Otoyol geçiş ücretleri en yüksek olan sınıftır.",
        aksAraligi: "Değişken", aksSayisi: "6+", gradient: ["#8B5CF6", "#7C3AED"],
        icon: Truck,
    },
    {
        sinif: 6, baslik: "6. Sınıf – Motosiklet",
        tanim: "Motosikletler (bazı otoyollarda ayrı sınıflandırma)",
        araclar: ["Motosiklet", "Scooter"],
        detay: "Bazı otoyol ve köprü geçişlerinde motosikletler ayrı bir sınıf olarak değerlendirilir ve genellikle en düşük geçiş ücretini öderler. Tüm otoyollarda motosiklet geçişine izin verilmez.",
        aksAraligi: "-", aksSayisi: 2, gradient: ["#EC4899", "#DB2777"],
        icon: Bike,
    },
];

export default function HgsSiniflariSection() {
    const [expandedCard, setExpandedCard] = useState<number | null>(null);

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A5F, #0EA5E9)', borderRadius: '20px', padding: '32px', marginBottom: '32px', display: 'flex', alignItems: 'flex-start', gap: '20px', boxShadow: '0 10px 40px rgba(14,165,233,0.25)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(14,165,233,0.15)', filter: 'blur(40px)' }} />
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.25)' }}>
                    <CreditCard size={32} color="#38BDF8" />
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'white', marginBottom: '10px' }}>HGS Araç Sınıfları Rehberi</h2>
                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7' }}>
                        Hızlı Geçiş Sistemi (HGS), Türkiye&apos;deki otoyol ve köprü geçişlerinde kullanılan elektronik ücret toplama sistemidir. Araçlar <strong style={{ color: '#38BDF8' }}>aks sayısı</strong> ve <strong style={{ color: '#38BDF8' }}>aks aralığına</strong> göre 5 (bazı otoyollarda 6) sınıfa ayrılır.
                    </p>
                </div>
            </div>

            {/* Sınıf Açıklama */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '20px', marginBottom: '28px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <Info size={22} color="#0EA5E9" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>Sınıf Ne Demek?</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
                        Araç sınıfı, otoyol ve köprü gişelerinde <strong style={{ color: 'var(--foreground)' }}>aracınızın kaç dingile (aks) sahip olduğuna</strong> ve <strong style={{ color: 'var(--foreground)' }}>dingiller arası mesafeye</strong> göre belirlenir. Sınıf numarası büyüdükçe araç boyutu ve geçiş ücreti artar.
                    </p>
                </div>
            </div>

            {/* Kartlar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {hgsSiniflari.map((sinif) => {
                    const isExpanded = expandedCard === sinif.sinif;
                    const Icon = sinif.icon;
                    return (
                        <div key={sinif.sinif} style={{ background: 'var(--card-bg)', border: `1px solid ${isExpanded ? sinif.gradient[0] + '60' : 'var(--card-border)'}`, borderRadius: '18px', overflow: 'hidden', transition: 'all 0.3s', boxShadow: isExpanded ? `0 8px 30px ${sinif.gradient[0]}15` : 'none' }}>
                            <div onClick={() => setExpandedCard(isExpanded ? null : sinif.sinif)} style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '18px', transition: 'background 0.2s' }}>
                                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `linear-gradient(135deg, ${sinif.gradient[0]}, ${sinif.gradient[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '22px', fontWeight: '900', color: 'white', boxShadow: `0 4px 15px ${sinif.gradient[0]}40` }}>
                                    {sinif.sinif}
                                </div>
                                <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: `${sinif.gradient[0]}10`, border: `1px solid ${sinif.gradient[0]}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={30} color={sinif.gradient[0]} strokeWidth={1.5} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px' }}>{sinif.baslik}</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>{sinif.tanim}</p>
                                </div>
                                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>AKS</span>
                                    <div style={{ fontSize: '22px', fontWeight: '900', color: sinif.gradient[0] }}>{sinif.aksSayisi}</div>
                                </div>
                                <div style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>
                            {isExpanded && (
                                <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--card-border)', animation: 'fadeIn 0.3s ease' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', paddingTop: '20px' }}>
                                        <div>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detaylı Açıklama</span>
                                            <p style={{ fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.7', marginTop: '8px' }}>{sinif.detay}</p>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Aks Aralığı</span>
                                            <p style={{ fontSize: '16px', fontWeight: '700', color: sinif.gradient[0], marginTop: '6px' }}>{sinif.aksAraligi}</p>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Bu Sınıftaki Araçlar</span>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                                {sinif.araclar.map((arac, i) => (
                                                    <span key={i} style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', background: `${sinif.gradient[0]}15`, color: sinif.gradient[0], border: `1px solid ${sinif.gradient[0]}30` }}>{arac}</span>
                                                ))}
                                            </div>
                                            <div style={{ width: '100%', height: '100px', borderRadius: '12px', marginTop: '16px', background: `${sinif.gradient[0]}08`, border: `1px solid ${sinif.gradient[0]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icon size={56} color={sinif.gradient[0]} strokeWidth={1.2} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mobil Bankacılık */}
            <div style={{ background: 'linear-gradient(135deg, #059669, #10B981)', borderRadius: '18px', padding: '28px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.15)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Smartphone size={28} color="white" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '10px' }}>HGS Başvurusu Nasıl Yapılır?</h3>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.7', marginBottom: '16px' }}>
                            HGS başvurusu <strong>mobil bankacılık uygulamaları</strong> üzerinden hızlı ve kolay şekilde yapılabilir. Ziraat Bankası, Vakıfbank, Halkbank gibi kamu bankalarının yanı sıra tüm özel bankaların mobil uygulamalarından başvuru yapabilirsiniz.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {["Mobil bankacılık uygulamanızı açın → Ödemeler / HGS İşlemleri bölümüne gidin", "\"Yeni HGS Etiketi Başvurusu\" seçeneğini tıklayın ve plaka bilgilerinizi girin", "Etiket ücreti hesabınızdan tahsil edilir; etiket adresinize kargo ile gönderilir", "Etiket gelince cam iç yüzeyine (ayna arkasına) yapıştırın — hemen kullanıma hazır!"].map((step, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: '800', color: 'white' }}>{i + 1}</span>
                                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.95)', margin: 0, lineHeight: '1.5' }}>{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ek Bilgiler */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '20px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '10px' }}>💳 HGS Bakiye Yükleme</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>Mobil bankacılık, internet bankacılığı, ATM ve PTT şubelerinden HGS bakiyenizi yükleyebilirsiniz. Otomatik bakiye yükleme talimatı vererek bakiyenizin bitmesini önleyebilirsiniz.</p>
                </div>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '20px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '10px' }}>⚠️ İhlalli Geçiş Cezası</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>HGS bakiyesi yetersizken geçiş yaparsanız &quot;ihlalli geçiş&quot; olur. Normal ücretin <strong style={{ color: '#EF4444' }}>4 katı</strong> idari para cezası uygulanır. 15 gün içinde ödeme yapılmazsa gecikme faizi işler.</p>
                </div>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '20px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '10px' }}>🔄 HGS vs OGS Farkı</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}><strong>HGS</strong> (Hızlı Geçiş): Bariyerli gişeden yavaşlayarak geçiş. <strong>OGS</strong> (Otomatik Geçiş): Bariyersiz gişeden durmadan geçiş. OGS etiketi olan araçlar HGS gişelerinden de geçebilir.</p>
                </div>
            </div>

            <a href="https://www.turkiye.gov.tr" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 24px', background: 'var(--primary)', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 15px rgba(37,99,235,0.2)' }}>
                <ExternalLink size={18} /> e-Devlet HGS Sorgulama
            </a>

            <div style={{ marginTop: '20px', padding: '14px 18px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <AlertCircle size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>Bu rehber <strong style={{ color: 'var(--foreground)' }}>Otosöz</strong> tarafından KGM verileri doğrultusunda hazırlanmıştır.</p>
            </div>
        </div>
    );
}
