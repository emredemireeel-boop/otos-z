"use client";

import { useState } from "react";
import { FileText, ShieldAlert, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, HelpCircle, Building2, Scale } from "lucide-react";

export default function DijitalSenetSection() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const avantajlar = [
        "Nakit paranız olmasa bile araç sahibi olabilirsiniz",
        "Banka kredisi başvurusu veya kredi notu gerektirmez",
        "İşlemler nispeten hızlı tamamlanabilir",
        "Esnaf ve serbest meslek sahipleri için alternatif finansman",
    ];

    const dezavantajlar = [
        "En küçük ödeme aksamasında bile araca rehin konulabilir",
        "Yüksek dosya masrafı ve işlem ücretleri uygulanır",
        "Güven problemi: Taraflar arasında anlaşmazlık riski yüksektir",
        "Araç üzerinde haciz ve satış engeli oluşabilir",
        "Noterden yapılmayan senetler hukuki açıdan zayıf kalabilir",
        "Toplam maliyet, taşıt kredisine göre çok daha yüksek olabilir",
        "Araç değerinin düşmesi durumunda kalan borç aracın değerini aşabilir",
    ];

    const firmaBilgi = [
        { baslik: "Araç Alım-Satım Aracı Firmalar", aciklama: "Piyasada dijital senet ile araç alım-satımına aracılık eden çok sayıda firma bulunmaktadır. Bu firmalar genellikle alıcı ile satıcı arasında köprü görevi görür ve senet işlemlerini dijital ortamda yönetir." },
        { baslik: "Nasıl Çalışır?", aciklama: "Alıcı, aracın bedelini belirli vadelerle senet olarak taahhüt eder. Firma, satıcıya ödemeyi garanti altına alırken araç üzerine rehin koyar. Alıcı tüm senetleri ödediğinde rehin kaldırılır ve araç tam mülkiyet olarak devredilir." },
        { baslik: "Dosya Masrafı", aciklama: "Firmalar genellikle aracın değerinin %3-8'i arasında dosya masrafı + işlem ücreti talep eder. 500.000 TL değerindeki bir araç için 15.000-40.000 TL arası ek maliyet söz konusu olabilir." },
    ];

    const faqItems = [
        { q: "Dijital senet yasal mı?", a: "Evet, dijital senet Türk hukukunda geçerlidir. Ancak noterden onaylı olmayan senetlerde ispat yükü değişebilir. İcra takibi başlatılabilir ancak süreç uzun ve maliyetli olabilir." },
        { q: "Senet ödemesini aksatırsam ne olur?", a: "Bir tek senedin bile vadesinde ödenmemesi durumunda firma, araç üzerine haciz ve satış işlemi başlatabilir. Araç rehinli olduğu için satışı engellenebilir ve icra yoluyla el konulabilir." },
        { q: "Dijital senet mi, taşıt kredisi mi?", a: "Banka taşıt kredileri genellikle daha düşük maliyetlidir ve yasal güvenceleri daha fazladır. Dijital senet, kredi alamayan kişiler için son çare olarak değerlendirilmelidir. Toplam maliyetleri mutlaka karşılaştırın." },
        { q: "Araç üzerindeki rehin ne zaman kalkar?", a: "Tüm senetler eksiksiz ve zamanında ödendiğinde firma rehin kaldırma işlemini başlatır. Bu süreç birkaç gün ile birkaç hafta arasında değişebilir." },
    ];

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444, #F87171)', borderRadius: '20px', padding: '32px', marginBottom: '28px', display: 'flex', alignItems: 'flex-start', gap: '20px', boxShadow: '0 10px 40px rgba(220,38,38,0.25)', border: '1px solid rgba(255,255,255,0.15)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', filter: 'blur(30px)' }} />
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.3)' }}>
                    <FileText size={32} color="white" />
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'white', marginBottom: '10px' }}>Dijital Senet Sistemi Rehberi</h2>
                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.7' }}>
                        Dijital senet ile araç alımı, <strong style={{ color: '#FDE68A' }}>düşük nakit ile araç sahibi olma</strong> imkânı sunsa da ciddi riskler barındırır. Bu rehberde avantajları, dezavantajları ve dikkat edilmesi gereken noktaları detaylıca ele alıyoruz.
                    </p>
                </div>
            </div>

            {/* Nasıl Çalışır */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                {firmaBilgi.map((item, i) => (
                    <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {i === 0 ? <Building2 size={22} color="#3B82F6" /> : i === 1 ? <Scale size={22} color="#3B82F6" /> : <FileText size={22} color="#3B82F6" />}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>{item.baslik}</h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>{item.aciklama}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Avantaj / Dezavantaj */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '18px', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <CheckCircle size={22} color="#10B981" />
                        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#10B981' }}>Avantajlar</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {avantajlar.map((a, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <span style={{ color: '#10B981', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>✓</span>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>{a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '18px', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <XCircle size={22} color="#EF4444" />
                        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#EF4444' }}>Dezavantajlar ve Riskler</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {dezavantajlar.map((d, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <span style={{ color: '#EF4444', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>✗</span>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>{d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dikkat Uyarısı */}
            <div style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(245,158,11,0.04))', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <AlertTriangle size={24} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '10px' }}>⚠️ Rehin Riski Hakkında</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.8', margin: 0 }}>
                            Dijital senet sisteminde araç, tüm senetler ödenene kadar <strong style={{ color: '#EF4444' }}>rehinli</strong> kalır. Tek bir senedin bile ödenmemesi durumunda firma, aracı <strong style={{ color: '#EF4444' }}>icra yoluyla satışa çıkarabilir</strong>. Ayrıca güven sorunu da ciddi bir risktir — firmalar kapanabilir, tasfiye süreçleri uzayabilir veya taraflar arasında anlaşmazlıklar doğabilir. Her zaman noter onaylı senet tercih ediniz.
                        </p>
                    </div>
                </div>
            </div>

            {/* SSS */}
            <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <HelpCircle size={20} color="var(--primary)" /> Sıkça Sorulan Sorular
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {faqItems.map((item, i) => (
                        <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', overflow: 'hidden' }}>
                            <div onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--foreground)' }}>{item.q}</span>
                                {expandedFaq === i ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                            </div>
                            {expandedFaq === i && (
                                <div style={{ padding: '0 20px 16px', animation: 'fadeIn 0.2s ease' }}>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>{item.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Disclaimer */}
            <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(220,38,38,0.03))', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <ShieldAlert size={22} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#EF4444', marginBottom: '8px' }}>Önemli Uyarı</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
                        <strong style={{ color: 'var(--foreground)' }}>OtoSöz bir araç satış platformu değildir</strong>; yalnızca ilan yayınlama alanı sunmaktadır. Araç alım-satımında tek başına bir pazar oluşturulamaz. Dijital senet ile araç alım-satımı konusunda herhangi bir tavsiye veya yönlendirmemiz bulunmamaktadır. Bu rehber yalnızca bilgilendirme amaçlıdır. Finansal kararlarınızda mutlaka uzman hukuki danışmanlık alınız.
                    </p>
                </div>
            </div>
        </div>
    );
}
