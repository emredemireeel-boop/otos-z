"use client";

import { useState, useMemo } from "react";
import { CreditCard, Calculator, AlertTriangle, Info, TrendingUp, ShieldAlert, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

// Binlik ayracı ile formatlama (500000 → 500.000)
const fmtNum = (n: number) => {
    if (!n && n !== 0) return "0";
    return Math.round(n).toLocaleString("tr-TR");
};

// Ondalıklı formatlama (54166.67 → 54.166,67)
const fmtPara = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Input'taki rakam dışı karakterleri temizle
const parseNum = (v: string) => parseFloat(v.replace(/\./g, "").replace(",", ".")) || 0;

// Input'a binlik ayracı koy
const formatInput = (v: string) => {
    const raw = v.replace(/[^0-9]/g, "");
    if (!raw) return "";
    return parseInt(raw).toLocaleString("tr-TR");
};

export default function KrediKartiAracSection() {
    const [aracFiyatiRaw, setAracFiyatiRaw] = useState("");
    const [komisyonOrani, setKomisyonOrani] = useState("");
    const [taksitSayisi, setTaksitSayisi] = useState<number>(12);
    const [aylikOdemeRaw, setAylikOdemeRaw] = useState("");
    const [hesapModu, setHesapModu] = useState<'taksit' | 'aylik'>('taksit');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const fiyat = parseNum(aracFiyatiRaw);
    const oran = parseFloat(komisyonOrani.replace(",", ".")) || 0;
    const aylikGirilen = parseNum(aylikOdemeRaw);

    // Doğru formül: Komisyon toplam tutardan kesiliyor
    // toplamCekim = nakitFiyat / (1 - komisyon/100)
    const hesap = useMemo(() => {
        if (fiyat <= 0 || oran <= 0 || oran >= 100) return null;
        const toplamCekim = fiyat / (1 - oran / 100);
        const komisyonTutar = toplamCekim - fiyat;
        const aylikOdeme = toplamCekim / taksitSayisi;
        // Aylık ödeme modunda: kullanıcının girdiği aylık ödemeye göre kaç ay süreceğini hesapla
        const aylikModAy = aylikGirilen > 0 ? Math.ceil(toplamCekim / aylikGirilen) : 0;
        const aylikModToplamAy = aylikGirilen > 0 ? toplamCekim / aylikGirilen : 0;
        return { komisyonTutar, toplamCekim, aylikOdeme, aylikModAy, aylikModToplamAy };
    }, [fiyat, oran, taksitSayisi, aylikGirilen]);

    const taksitSecenekleri = [3, 6, 9, 12, 18, 24, 36];

    const faqItems = [
        { q: "Komisyon neden toplam tutardan kesiliyor?", a: "POS cihazı üzerinden yapılan çekimlerde, banka komisyonu toplam çekilen tutardan kesilir ve satıcıya kalan tutar aktarılır. Bu yüzden satıcı, eline geçecek net tutarı (aracın nakit fiyatı) garantilemek için toplam çekim tutarını yükseltir. Örneğin %33 komisyonda 170.000 ₺ net almak isteyen satıcı, 170.000 / (1 - 0.33) ≈ 253.731 ₺ çeker. Bankaya %33 = ~83.731 ₺ gider, satıcıya 170.000 ₺ kalır." },
        { q: "Komisyon farkı nedir, faiz mi?", a: "Hayır, bu bir banka faizi değildir. POS komisyonu satıcıdan kesilir ama satıcı bunu alıcıya yansıtır. Bu yüzden kredi kartıyla yapılan çekim tutarı nakit fiyattan çok daha yüksektir." },
        { q: "Taksit seçenekleri nasıl belirlenir?", a: "Banka, kart limitinize ve anlaşmalı POS'a göre taksit seçenekleri sunar. Ancak satıcı hangi taksit sayısını kabul edeceğini belirler. Genelde 3-12 arası taksit yaygındır." },
        { q: "Kredi kartıyla araç almak güvenli mi?", a: "Kredi kartı işlemi banka güvencesindedir, ancak yüksek komisyon farkları toplam maliyeti ciddi şekilde artırır. Nakit fiyat ile kart fiyatı arasındaki farkı mutlaka hesaplayın ve taşıt kredisi ile karşılaştırın." },
    ];

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7, #C084FC)', borderRadius: '20px', padding: '32px', marginBottom: '28px', display: 'flex', alignItems: 'flex-start', gap: '20px', boxShadow: '0 10px 40px rgba(124,58,237,0.25)', border: '1px solid rgba(255,255,255,0.15)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(30px)' }} />
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.3)' }}>
                    <CreditCard size={32} color="white" />
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'white', marginBottom: '10px' }}>Kredi Kartıyla Araç Alma Rehberi</h2>
                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.7' }}>
                        Kredi kartıyla araç alımında satıcılar genellikle <strong style={{ color: '#FDE68A' }}>komisyon farkını toplam fiyata ekleyerek</strong> POS çekimi yapar. Bu bir banka faizi değildir — satıcının uyguladığı ek maliyettir.
                    </p>
                </div>
            </div>

            {/* Komisyon Açıklama */}
            <div style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(245,158,11,0.04))', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <AlertTriangle size={24} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '10px' }}>⚠️ Komisyon Farkı = Faiz Değil, Ek Maliyet!</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.8', margin: 0 }}>
                        Araç satıcıları kredi kartıyla satış yaptığında, komisyon <strong style={{ color: 'var(--foreground)' }}>toplam çekilen tutardan kesilir</strong>. Satıcı eline net nakit fiyatı alabilmek için çekim tutarını yükseltir. Örneğin %33 komisyonla nakit fiyatı <strong style={{ color: '#EF4444' }}>170.000 ₺</strong> olan araç için karttan <strong style={{ color: '#EF4444' }}>170.000 / (1 − 0.33) ≈ 253.731 ₺</strong> çekilir. Bankaya ~83.731 ₺ komisyon gider, satıcıya 170.000 ₺ kalır. Bu fark banka faizi değil, POS komisyon yapısıdır.
                        </p>
                    </div>
                </div>
            </div>

            {/* Hesaplayıcı */}
            <div style={{ background: 'var(--card-bg)', border: '2px solid var(--primary)', borderRadius: '20px', padding: '28px', marginBottom: '28px', boxShadow: '0 8px 30px rgba(37,99,235,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calculator size={24} color="white" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)' }}>Komisyon Farkı Hesaplayıcı</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Araç fiyatını ve komisyon oranını girin, toplam maliyetinizi görün</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Aracın Nakit Fiyatı (₺)</label>
                        <input
                            type="text"
                            value={aracFiyatiRaw}
                            onChange={(e) => setAracFiyatiRaw(formatInput(e.target.value))}
                            placeholder="Örn: 500.000"
                            style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '18px', fontWeight: '700', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Komisyon Farkı Oranı (%)</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={komisyonOrani}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/[^0-9.,]/g, "");
                                    setKomisyonOrani(v);
                                }}
                                placeholder="Örn: 32"
                                style={{ width: '100%', padding: '14px 16px', paddingRight: '40px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '18px', fontWeight: '700', outline: 'none', boxSizing: 'border-box' }}
                            />
                            <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', fontWeight: '800', color: 'var(--text-muted)' }}>%</span>
                        </div>
                    </div>
                </div>

                {/* Taksit Seçimi */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>Taksit Sayısı</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {taksitSecenekleri.map((t) => (
                            <button key={t} onClick={() => setTaksitSayisi(t)} style={{ padding: '10px 18px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', border: `1px solid ${taksitSayisi === t ? '#7C3AED' : 'var(--card-border)'}`, background: taksitSayisi === t ? 'linear-gradient(135deg, #7C3AED, #A855F7)' : 'var(--secondary)', color: taksitSayisi === t ? 'white' : 'var(--foreground)', transition: 'all 0.2s' }}>
                                {t} Ay
                            </button>
                        ))}
                    </div>
                </div>


                {/* Sonuç */}
                {hesap && (
                    <div style={{ marginTop: '8px', padding: '24px', background: 'var(--background)', borderRadius: '16px', border: '1px solid var(--card-border)', animation: 'fadeIn 0.3s ease' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingUp size={18} color="#3B82F6" /> Hesaplama Sonucu
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ padding: '16px', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--card-border)', textAlign: 'center' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Nakit Fiyat</span>
                                <span style={{ fontSize: '22px', fontWeight: '800', color: '#10B981' }}>{fmtNum(fiyat)} ₺</span>
                            </div>
                            <div style={{ padding: '16px', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--card-border)', textAlign: 'center' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Karttan Çekilecek Toplam</span>
                                <span style={{ fontSize: '22px', fontWeight: '800', color: '#EF4444' }}>{fmtNum(hesap.toplamCekim)} ₺</span>
                            </div>
                            <div style={{ padding: '16px', background: 'rgba(239,68,68,0.06)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Komisyon Farkı</span>
                                <span style={{ fontSize: '22px', fontWeight: '800', color: '#EF4444' }}>+{fmtNum(hesap.komisyonTutar)} ₺</span>
                                <span style={{ fontSize: '13px', color: '#F59E0B', fontWeight: '700', display: 'block', marginTop: '4px' }}>(%{oran} fark)</span>
                            </div>
                            <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(168,85,247,0.04))', borderRadius: '12px', border: '1px solid rgba(124,58,237,0.25)', textAlign: 'center' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Aylık Taksit ({taksitSayisi} Ay)</span>
                                <span style={{ fontSize: '24px', fontWeight: '900', color: '#7C3AED' }}>{fmtPara(hesap.aylikOdeme)} ₺</span>
                            </div>
                        </div>

                        {/* Tüm taksit tablosu */}
                        <div style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
                            <div style={{ padding: '12px 16px', background: 'var(--secondary)', borderBottom: '1px solid var(--card-border)' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tüm Taksit Seçenekleri Karşılaştırma</span>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                                        {['Taksit', 'Aylık Ödeme', 'Toplam Ödeme', 'Komisyon'].map((h) => (
                                            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {taksitSecenekleri.map((t) => {
                                        const aylik = hesap.toplamCekim / t;
                                        return (
                                            <tr key={t} style={{ borderBottom: '1px solid var(--card-border)', background: t === taksitSayisi ? 'rgba(124,58,237,0.06)' : 'transparent' }}>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: t === taksitSayisi ? '800' : '600', color: t === taksitSayisi ? '#7C3AED' : 'var(--foreground)' }}>{t} Ay {t === taksitSayisi && '✓'}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)' }}>{fmtPara(aylik)} ₺</td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--text-muted)' }}>{fmtNum(hesap.toplamCekim)} ₺</td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>+{fmtNum(hesap.komisyonTutar)} ₺</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
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
                        <strong style={{ color: 'var(--foreground)' }}>OtoSöz bir araç satış platformu değildir</strong>; yalnızca ilan yayınlama alanı sunmaktadır. Kredi kartı ile araç alım-satımı konusunda herhangi bir tavsiye veya yönlendirmemiz bulunmamaktadır. Bu rehber yalnızca bilgilendirme amaçlıdır.
                    </p>
                </div>
            </div>
        </div>
    );
}
