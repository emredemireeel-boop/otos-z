"use client";
import { useState, useMemo } from "react";
import { Calculator, CreditCard, Building2, FileText, Shield, Search, Fuel, ChevronDown, ChevronUp } from "lucide-react";

const fmt = (n: number) => Math.round(n).toLocaleString("tr-TR");
const fmtP = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const parseN = (v: string) => parseFloat(v.replace(/\./g, "").replace(",", ".")) || 0;
const fmtI = (v: string) => { const r = v.replace(/[^0-9]/g, ""); return r ? parseInt(r).toLocaleString("tr-TR") : ""; };

type Field = { label: string; value: string; set: (v: string) => void; ph: string; suffix?: string; isPercent?: boolean };

function NumInput({ f }: { f: Field }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{f.label}</label>
      <div style={{ position: 'relative' }}>
        <input type="text" value={f.value}
          onChange={e => f.isPercent ? f.set(e.target.value.replace(/[^0-9.,]/g, "")) : f.set(fmtI(e.target.value))}
          placeholder={f.ph}
          style={{ width: '100%', padding: '12px 14px', paddingRight: f.suffix ? '40px' : '14px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '15px', fontWeight: '700', outline: 'none', boxSizing: 'border-box' }} />
        {f.suffix && <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>{f.suffix}</span>}
      </div>
    </div>
  );
}

export default function AracAlimHesapSection() {
  const [aracFiyat, setAracFiyat] = useState("");
  const [nakit, setNakit] = useState("");
  const [krediTutar, setKrediTutar] = useState("");
  const [krediFaiz, setKrediFaiz] = useState("");
  const [krediVade, setKrediVade] = useState("48");
  const [kartTutar, setKartTutar] = useState("");
  const [kartKomisyon, setKartKomisyon] = useState("");
  const [kartTaksit, setKartTaksit] = useState("12");
  const [noter, setNoter] = useState("8.000");
  const [sigorta, setSigorta] = useState("6.000");
  const [kasko, setKasko] = useState("15.000");
  const [ekspertiz, setEkspertiz] = useState("3.500");
  const [yakit, setYakit] = useState("2.000");
  const [plaka, setPlaka] = useState("1.500");
  const [diger, setDiger] = useState("");
  const [showTable, setShowTable] = useState(false);

  const h = useMemo(() => {
    const fiyat = parseN(aracFiyat); if (fiyat <= 0) return null;
    const nk = parseN(nakit);
    // Kredi
    const kTutar = parseN(krediTutar);
    const kFaiz = parseFloat(krediFaiz.replace(",", ".")) || 0;
    const kVade = parseInt(krediVade) || 48;
    let krediAylik = 0, krediToplam = 0;
    if (kTutar > 0 && kFaiz > 0) {
      const r = kFaiz / 100;
      krediAylik = kTutar * r * Math.pow(1 + r, kVade) / (Math.pow(1 + r, kVade) - 1);
      krediToplam = krediAylik * kVade;
    } else if (kTutar > 0) { krediAylik = kTutar / kVade; krediToplam = kTutar; }
    const krediFaizToplam = krediToplam - kTutar;
    const reelFaiz = kTutar > 0 ? ((krediToplam / kTutar - 1) * 100) : 0;

    // Kart
    const ktTutar = parseN(kartTutar);
    const ktKom = parseFloat(kartKomisyon.replace(",", ".")) || 0;
    const ktTaksitN = parseInt(kartTaksit) || 12;
    let kartCekim = 0, kartAylik = 0, kartKomTutar = 0;
    if (ktTutar > 0 && ktKom > 0 && ktKom < 100) {
      kartCekim = ktTutar / (1 - ktKom / 100);
      kartKomTutar = kartCekim - ktTutar;
    } else { kartCekim = ktTutar; }
    kartAylik = kartCekim / ktTaksitN;

    // Ek giderler
    const ekler = [parseN(noter), parseN(sigorta), parseN(kasko), parseN(ekspertiz), parseN(yakit), parseN(plaka), parseN(diger)];
    const eklerToplam = ekler.reduce((a, b) => a + b, 0);

    // Toplam
    const toplamOdeme = nk + krediToplam + kartCekim + eklerToplam;
    const kalanFark = fiyat - nk - kTutar - ktTutar;

    // Ödeme tablosu
    const maxAy = Math.max(kVade, ktTaksitN, 1);
    const tablo = [];
    for (let ay = 1; ay <= Math.min(maxAy, 60); ay++) {
      const kO = ay <= kVade ? krediAylik : 0;
      const ktO = ay <= ktTaksitN ? kartAylik : 0;
      tablo.push({ ay, kredi: kO, kart: ktO, toplam: kO + ktO });
    }

    return { fiyat, nk, kTutar, krediAylik, krediToplam, krediFaizToplam, reelFaiz, kVade,
      kartCekim, kartAylik, kartKomTutar, ktTaksitN, eklerToplam, toplamOdeme, kalanFark, tablo, ekler };
  }, [aracFiyat, nakit, krediTutar, krediFaiz, krediVade, kartTutar, kartKomisyon, kartTaksit, noter, sigorta, kasko, ekspertiz, yakit, plaka, diger]);

  const card = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' } as const;
  const sec = { fontSize: '13px', fontWeight: '700' as const, color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #059669, #10B981, #34D399)', borderRadius: '20px', padding: '28px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px', boxShadow: '0 10px 40px rgba(5,150,105,0.25)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', filter: 'blur(25px)' }} />
        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Calculator size={28} color="white" />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Araç Alım Bütçe Hesaplayıcı</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', margin: 0 }}>
            Nakit, kredi, kredi kartı ve tüm ek giderleri dahil ederek toplam araç alım maliyetinizi hesaplayın.
          </p>
        </div>
      </div>

      {/* Araç Fiyatı + Nakit */}
      <div style={card}>
        <div style={sec}><Search size={16} color="#059669" /> Araç & Nakit Bilgileri</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <NumInput f={{ label: 'Araç Fiyatı (₺)', value: aracFiyat, set: setAracFiyat, ph: '500.000' }} />
          <NumInput f={{ label: 'Nakit Tutarınız (₺)', value: nakit, set: setNakit, ph: '100.000' }} />
        </div>
      </div>

      {/* Banka Kredisi */}
      <div style={card}>
        <div style={sec}><Building2 size={16} color="#3B82F6" /> Banka Kredisi</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <NumInput f={{ label: 'Kredi Tutarı (₺)', value: krediTutar, set: setKrediTutar, ph: '300.000' }} />
          <NumInput f={{ label: 'Aylık Faiz Oranı', value: krediFaiz, set: setKrediFaiz, ph: '2.49', suffix: '%', isPercent: true }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Vade (Ay)</label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[12, 24, 36, 48, 60].map(v => (
              <button key={v} onClick={() => setKrediVade(String(v))} style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: `1px solid ${krediVade === String(v) ? '#3B82F6' : 'var(--card-border)'}`, background: krediVade === String(v) ? 'rgba(59,130,246,0.1)' : 'var(--secondary)', color: krediVade === String(v) ? '#3B82F6' : 'var(--foreground)' }}>
                {v} Ay
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kredi Kartı */}
      <div style={card}>
        <div style={sec}><CreditCard size={16} color="#7C3AED" /> Kredi Kartı ile Ödeme</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <NumInput f={{ label: 'Kart ile Ödenecek (₺)', value: kartTutar, set: setKartTutar, ph: '100.000' }} />
          <NumInput f={{ label: 'Komisyon Oranı', value: kartKomisyon, set: setKartKomisyon, ph: '33', suffix: '%', isPercent: true }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Taksit</label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[3, 6, 9, 12, 18, 24].map(v => (
              <button key={v} onClick={() => setKartTaksit(String(v))} style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: `1px solid ${kartTaksit === String(v) ? '#7C3AED' : 'var(--card-border)'}`, background: kartTaksit === String(v) ? 'rgba(124,58,237,0.1)' : 'var(--secondary)', color: kartTaksit === String(v) ? '#7C3AED' : 'var(--foreground)' }}>
                {v} Ay
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ek Giderler */}
      <div style={card}>
        <div style={sec}><FileText size={16} color="#F59E0B" /> Ek Giderler</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <NumInput f={{ label: 'Noter Ücreti (₺)', value: noter, set: setNoter, ph: '8.000' }} />
          <NumInput f={{ label: 'Trafik Sigortası (₺)', value: sigorta, set: setSigorta, ph: '6.000' }} />
          <NumInput f={{ label: 'Kasko (₺)', value: kasko, set: setKasko, ph: '15.000' }} />
          <NumInput f={{ label: 'Ekspertiz Ücreti (₺)', value: ekspertiz, set: setEkspertiz, ph: '3.500' }} />
          <NumInput f={{ label: 'Yakıt / Ulaşım (₺)', value: yakit, set: setYakit, ph: '2.000' }} />
          <NumInput f={{ label: 'Plaka / Tescil (₺)', value: plaka, set: setPlaka, ph: '1.500' }} />
          <NumInput f={{ label: 'Diğer Giderler (₺)', value: diger, set: setDiger, ph: '0' }} />
        </div>
      </div>

      {/* SONUÇ */}
      {h && (
        <div style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.06), rgba(16,185,129,0.03))', border: '2px solid rgba(5,150,105,0.3)', borderRadius: '20px', padding: '24px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '20px', textAlign: 'center' }}>📊 Bütçe Özeti</h3>

          {/* Kalan fark uyarı */}
          {h.kalanFark > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#EF4444' }}>⚠️ Eksik: {fmt(h.kalanFark)} ₺ — Nakit + Kredi + Kart araç fiyatını karşılamıyor</span>
            </div>
          )}
          {h.kalanFark <= 0 && h.kalanFark !== -h.fiyat && (
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#10B981' }}>✅ Bütçeniz araç fiyatını karşılıyor!</span>
            </div>
          )}

          {/* Özet Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
            {[
              ['Araç Fiyatı', fmt(h.fiyat), '#059669'],
              ['Nakit', fmt(h.nk), '#10B981'],
              ['Kredi Toplam', fmt(h.krediToplam), '#3B82F6'],
              ['Kredi Faiz Tutarı', `+${fmt(h.krediFaizToplam)}`, '#EF4444'],
              ['Reel Faiz Oranı', `%${h.reelFaiz.toFixed(1)}`, '#F59E0B'],
              ['Kredi Aylık Taksit', `${fmtP(h.krediAylik)} ₺/${h.kVade}ay`, '#3B82F6'],
              ['Kart Çekim Toplam', fmt(h.kartCekim), '#7C3AED'],
              ['Kart Komisyon Farkı', `+${fmt(h.kartKomTutar)}`, '#EF4444'],
              ['Kart Aylık Taksit', `${fmtP(h.kartAylik)} ₺/${h.ktTaksitN}ay`, '#7C3AED'],
              ['Ek Giderler Toplam', fmt(h.eklerToplam), '#F59E0B'],
            ].map(([label, val, color]) => (
              <div key={label as string} style={{ padding: '12px', background: 'var(--card-bg)', borderRadius: '10px', border: '1px solid var(--card-border)', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>{label}</span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: color as string }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Toplam */}
          <div style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '14px', border: '2px solid rgba(5,150,105,0.3)', textAlign: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Toplam Ödeyeceğiniz Tutar</span>
            <span style={{ fontSize: '36px', fontWeight: '900', color: '#059669' }}>{fmt(h.toplamOdeme)} ₺</span>
          </div>

          {/* Ek Gider Detay */}
          <div style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--card-border)', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ padding: '10px 14px', background: 'var(--secondary)', borderBottom: '1px solid var(--card-border)' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ek Gider Dağılımı</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[['Noter', noter], ['Sigorta', sigorta], ['Kasko', kasko], ['Ekspertiz', ekspertiz], ['Yakıt/Ulaşım', yakit], ['Plaka/Tescil', plaka], ['Diğer', diger]].map(([l, v]) => parseN(v as string) > 0 && (
                  <tr key={l as string} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '10px 14px', fontSize: '13px', color: 'var(--foreground)' }}>{l}</td>
                    <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', textAlign: 'right' }}>{fmtI(v as string)} ₺</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ödeme Tablosu Toggle */}
          <button onClick={() => setShowTable(!showTable)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid rgba(5,150,105,0.3)', background: 'var(--card-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '700', fontSize: '14px', color: '#059669' }}>
            {showTable ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            {showTable ? 'Ödeme Tablosunu Gizle' : 'Aylık Ödeme Tablosunu Göster'}
          </button>

          {showTable && h.tablo.length > 0 && (h.krediAylik > 0 || h.kartAylik > 0) && (
            <div style={{ marginTop: '12px', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', background: 'var(--secondary)', borderBottom: '1px solid var(--card-border)' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aylık Ödeme Planı</span>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--card-border)', position: 'sticky', top: 0, background: 'var(--card-bg)' }}>
                      <th style={{ padding: '8px 12px', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'left', textTransform: 'uppercase' }}>Ay</th>
                      {h.krediAylik > 0 && <th style={{ padding: '8px 12px', fontSize: '10px', fontWeight: '700', color: '#3B82F6', textAlign: 'right', textTransform: 'uppercase' }}>Kredi</th>}
                      {h.kartAylik > 0 && <th style={{ padding: '8px 12px', fontSize: '10px', fontWeight: '700', color: '#7C3AED', textAlign: 'right', textTransform: 'uppercase' }}>Kart</th>}
                      <th style={{ padding: '8px 12px', fontSize: '10px', fontWeight: '700', color: '#059669', textAlign: 'right', textTransform: 'uppercase' }}>Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {h.tablo.map(r => (
                      <tr key={r.ay} style={{ borderBottom: '1px solid var(--card-border)', background: r.toplam === 0 ? 'rgba(16,185,129,0.04)' : 'transparent' }}>
                        <td style={{ padding: '8px 12px', fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>{r.ay}. ay</td>
                        {h.krediAylik > 0 && <td style={{ padding: '8px 12px', fontSize: '13px', fontWeight: '600', color: r.kredi > 0 ? '#3B82F6' : 'var(--text-muted)', textAlign: 'right' }}>{r.kredi > 0 ? `${fmtP(r.kredi)} ₺` : '—'}</td>}
                        {h.kartAylik > 0 && <td style={{ padding: '8px 12px', fontSize: '13px', fontWeight: '600', color: r.kart > 0 ? '#7C3AED' : 'var(--text-muted)', textAlign: 'right' }}>{r.kart > 0 ? `${fmtP(r.kart)} ₺` : '✓ Bitti'}</td>}
                        <td style={{ padding: '8px 12px', fontSize: '13px', fontWeight: '800', color: r.toplam > 0 ? '#059669' : 'var(--text-muted)', textAlign: 'right' }}>{r.toplam > 0 ? `${fmtP(r.toplam)} ₺` : '—'}</td>
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
  );
}
