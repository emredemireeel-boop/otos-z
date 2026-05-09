"use client";
import { useState, useMemo } from "react";
import { FileText, AlertTriangle, TrendingUp, ShieldAlert, HelpCircle, ChevronDown, ChevronUp, Calculator } from "lucide-react";

const fmt = (n: number) => Math.round(n).toLocaleString("tr-TR");
const fmtP = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const parseN = (v: string) => parseFloat(v.replace(/\./g, "").replace(",", ".")) || 0;
const fmtI = (v: string) => { const r = v.replace(/[^0-9]/g, ""); return r ? parseInt(r).toLocaleString("tr-TR") : ""; };

export default function DijitalSenetHesapSection() {
  const [aracFiyat, setAracFiyat] = useState("");
  const [cekilenTutar, setCekilenTutar] = useState("");
  const [dosyaMasrafi, setDosyaMasrafi] = useState("");
  const [taksitSayisi, setTaksitSayisi] = useState("12");
  const [taksitTutar, setTaksitTutar] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const hesap = useMemo(() => {
    const fiyat = parseN(aracFiyat);
    const cekim = parseN(cekilenTutar);
    const dosya = parseN(dosyaMasrafi);
    const tSayisi = parseInt(taksitSayisi) || 12;
    const tTutar = parseN(taksitTutar);
    if (fiyat <= 0 && cekim <= 0) return null;

    const toplamOdeme = (tTutar > 0 ? tTutar * tSayisi : cekim) + dosya;
    const nakitFiyat = fiyat > 0 ? fiyat : (cekim > 0 ? cekim - dosya : 0);
    const toplamFark = toplamOdeme - nakitFiyat;
    const reelFaiz = nakitFiyat > 0 ? ((toplamOdeme / nakitFiyat - 1) * 100) : 0;
    const aylikReelFaiz = tSayisi > 0 ? (Math.pow(toplamOdeme / nakitFiyat, 1 / tSayisi) - 1) * 100 : 0;
    const aylikTaksit = tTutar > 0 ? tTutar : (cekim > 0 ? cekim / tSayisi : 0);

    const tablo = [];
    let kalan = tTutar > 0 ? tTutar * tSayisi : cekim;
    for (let i = 1; i <= tSayisi; i++) {
      kalan -= aylikTaksit;
      tablo.push({ ay: i, taksit: aylikTaksit, kalan: Math.max(kalan, 0) });
    }

    return { fiyat, nakitFiyat, cekim, dosya, toplamOdeme, toplamFark, reelFaiz, aylikReelFaiz, aylikTaksit, tSayisi, tablo };
  }, [aracFiyat, cekilenTutar, dosyaMasrafi, taksitSayisi, taksitTutar]);

  const faqItems = [
    { q: "Dijital senet yasal mı?", a: "Evet, dijital senet Türk hukukunda geçerlidir. Ancak noterden onaylı olmayan senetlerde ispat yükü değişebilir." },
    { q: "Senet ödemesini aksatırsam ne olur?", a: "Tek bir senedin ödenmemesi durumunda firma araç üzerine haciz başlatabilir. Araç rehinli olduğu için icra yoluyla el konulabilir." },
    { q: "Dijital senet mi, taşıt kredisi mi?", a: "Banka taşıt kredileri genellikle daha düşük maliyetlidir. Dijital senet kredi alamayanlar için son çare olarak değerlendirilmelidir." },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444, #F87171)', borderRadius: '20px', padding: '28px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px', boxShadow: '0 10px 40px rgba(220,38,38,0.25)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', filter: 'blur(25px)' }} />
        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FileText size={28} color="white" />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Dijital Senet Hesaplayıcı</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', margin: 0 }}>
            Dijital senet ile araç alımının gerçek maliyetini hesaplayın. Dosya masrafı dahil <strong style={{ color: '#FDE68A' }}>reel faiz oranını</strong> görün.
          </p>
        </div>
      </div>

      {/* Uyarı */}
      <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '14px', padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
          Dijital senet sisteminde araç tüm ödemeler bitene kadar <strong style={{ color: '#EF4444' }}>rehinli</strong> kalır. Tek bir ödeme aksamasında araç <strong style={{ color: '#EF4444' }}>icra yoluyla satışa çıkarılabilir</strong>. Dosya masrafları genellikle araç değerinin %3-8&apos;i arasındadır.
        </p>
      </div>

      {/* Hesaplayıcı */}
      <div style={{ background: 'var(--card-bg)', border: '2px solid rgba(220,38,38,0.3)', borderRadius: '18px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 20px rgba(220,38,38,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #DC2626, #EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={20} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>Maliyet Hesaplama</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Dosya masrafı dahil gerçek maliyetinizi görün</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          {[
            { label: 'Aracın Nakit Fiyatı (₺)', value: aracFiyat, set: setAracFiyat, ph: '500.000' },
            { label: 'Senetle Çekilen Toplam (₺)', value: cekilenTutar, set: setCekilenTutar, ph: '750.000' },
            { label: 'Dosya Masrafı (₺)', value: dosyaMasrafi, set: setDosyaMasrafi, ph: '25.000' },
            { label: 'Aylık Taksit Tutarı (₺)', value: taksitTutar, set: setTaksitTutar, ph: '62.500' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{f.label}</label>
              <input type="text" value={f.value} onChange={e => f.set(fmtI(e.target.value))} placeholder={f.ph}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '15px', fontWeight: '700', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>

        {/* Taksit Sayısı */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Taksit Sayısı</label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[6, 12, 18, 24, 36, 48].map(v => (
              <button key={v} onClick={() => setTaksitSayisi(String(v))} style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: `1px solid ${taksitSayisi === String(v) ? '#DC2626' : 'var(--card-border)'}`, background: taksitSayisi === String(v) ? 'rgba(220,38,38,0.1)' : 'var(--secondary)', color: taksitSayisi === String(v) ? '#DC2626' : 'var(--foreground)' }}>
                {v} Ay
              </button>
            ))}
          </div>
        </div>

        {/* Sonuç */}
        {hesap && (
          <div style={{ padding: '20px', background: 'var(--background)', borderRadius: '14px', border: '1px solid var(--card-border)', animation: 'fadeIn 0.3s ease' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} color="#DC2626" /> Hesaplama Sonucu
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
              {[
                ['Nakit Fiyat', `${fmt(hesap.nakitFiyat)} ₺`, '#10B981'],
                ['Toplam Ödeme', `${fmt(hesap.toplamOdeme)} ₺`, '#EF4444'],
                ['Dosya Masrafı', `+${fmt(hesap.dosya)} ₺`, '#F59E0B'],
                ['Fark (Ek Maliyet)', `+${fmt(hesap.toplamFark)} ₺`, '#EF4444'],
                ['Aylık Taksit', `${fmtP(hesap.aylikTaksit)} ₺`, '#7C3AED'],
                ['Taksit Sayısı', `${hesap.tSayisi} Ay`, '#3B82F6'],
              ].map(([l, v, c]) => (
                <div key={l as string} style={{ padding: '12px', background: 'var(--card-bg)', borderRadius: '10px', border: '1px solid var(--card-border)', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>{l}</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: c as string }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Reel Faiz */}
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(220,38,38,0.06), rgba(239,68,68,0.03))', borderRadius: '12px', border: '2px solid rgba(220,38,38,0.25)', textAlign: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reel Faiz Oranı (Dosya Masrafı Dahil)</span>
              <span style={{ fontSize: '36px', fontWeight: '900', color: '#DC2626' }}>%{hesap.reelFaiz.toFixed(1)}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Aylık: %{hesap.aylikReelFaiz.toFixed(2)}</span>
              <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(220,38,38,0.06)', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: '700', margin: 0, lineHeight: '1.6' }}>
                  ⚠️ Bu reel faiz dosya masrafı dahildir — size yansıtılan gerçek faiz budur!
                </p>
              </div>
            </div>

            {/* Ödeme Tablosu */}
            {hesap.tablo.length > 0 && hesap.aylikTaksit > 0 && (
              <div style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px', background: 'var(--secondary)', borderBottom: '1px solid var(--card-border)' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aylık Ödeme Tablosu</span>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--card-border)', position: 'sticky', top: 0, background: 'var(--card-bg)' }}>
                        <th style={{ padding: '8px 12px', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'left', textTransform: 'uppercase' }}>Ay</th>
                        <th style={{ padding: '8px 12px', fontSize: '10px', fontWeight: '700', color: '#DC2626', textAlign: 'right', textTransform: 'uppercase' }}>Taksit</th>
                        <th style={{ padding: '8px 12px', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'right', textTransform: 'uppercase' }}>Kalan Borç</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hesap.tablo.map(r => (
                        <tr key={r.ay} style={{ borderBottom: '1px solid var(--card-border)', background: r.kalan === 0 ? 'rgba(16,185,129,0.04)' : 'transparent' }}>
                          <td style={{ padding: '8px 12px', fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>{r.ay}. ay</td>
                          <td style={{ padding: '8px 12px', fontSize: '13px', fontWeight: '700', color: '#DC2626', textAlign: 'right' }}>{fmtP(r.taksit)} ₺</td>
                          <td style={{ padding: '8px 12px', fontSize: '13px', fontWeight: '600', color: r.kalan === 0 ? '#10B981' : 'var(--text-muted)', textAlign: 'right' }}>{r.kalan === 0 ? '✓ Bitti' : `${fmt(r.kalan)} ₺`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SSS */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={18} color="var(--primary)" /> Sıkça Sorulan Sorular
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {faqItems.map((item, i) => (
            <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', overflow: 'hidden' }}>
              <div onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)' }}>{item.q}</span>
                {expandedFaq === i ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
              </div>
              {expandedFaq === i && (
                <div style={{ padding: '0 16px 14px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <ShieldAlert size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
          <strong style={{ color: 'var(--foreground)' }}>OtoSöz bir araç satış platformu değildir</strong>; yalnızca ilan yayınlama alanı sunmaktadır. Dijital senet ile araç alım-satımı konusunda herhangi bir tavsiye veya yönlendirmemiz bulunmamaktadır. Bu hesaplayıcı yalnızca bilgilendirme amaçlıdır.
        </p>
      </div>
    </div>
  );
}
