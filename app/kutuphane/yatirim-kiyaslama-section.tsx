"use client";

import { useState, useMemo } from "react";
import { LineChart, DollarSign, Coins, Car, ExternalLink, ArrowRight, Trophy, TrendingUp, HelpCircle } from "lucide-react";

/* ── Accent Colors ── */
const AC = "#EAB308"; // Gold for Investment
const AC_L = "rgba(234,179,8,0.08)";
const AC_B = "rgba(234,179,8,0.20)";
const AC_BG = "rgba(234,179,8,0.04)";

export default function YatirimKiyaslamaSection() {
  const [aracAlisFiyati, setAracAlisFiyati] = useState<number>(1000000);
  const [aracGuncelFiyati, setAracGuncelFiyati] = useState<number>(1800000);

  const [eskiDolar, setEskiDolar] = useState<number>(18.50);
  const [guncelDolar, setGuncelDolar] = useState<number>(45);

  const [eskiAltin, setEskiAltin] = useState<number>(1050);
  const [guncelAltin, setGuncelAltin] = useState<number>(7000);

  const results = useMemo(() => {
    // 1. Araç Getirisi
    const aracKar = aracGuncelFiyati - aracAlisFiyati;
    const aracYuzde = (aracKar / aracAlisFiyati) * 100;

    // 2. Dolar Getirisi (Eğer arabaya yatırılan parayla Dolar alınsaydı)
    const alinabilecekDolar = eskiDolar > 0 ? aracAlisFiyati / eskiDolar : 0;
    const dolarBugunkuTL = alinabilecekDolar * guncelDolar;
    const dolarKar = dolarBugunkuTL - aracAlisFiyati;
    const dolarYuzde = (dolarKar / aracAlisFiyati) * 100;

    // 3. Altın Getirisi (Eğer arabaya yatırılan parayla Gram Altın alınsaydı)
    const alinabilecekAltin = eskiAltin > 0 ? aracAlisFiyati / eskiAltin : 0;
    const altinBugunkuTL = alinabilecekAltin * guncelAltin;
    const altinKar = altinBugunkuTL - aracAlisFiyati;
    const altinYuzde = (altinKar / aracAlisFiyati) * 100;

    // Şampiyonu Belirle
    const yatirimlar = [
      { id: 'arac', isim: 'Otomobil', icon: Car, renk: '#3B82F6', deger: aracGuncelFiyati, kar: aracKar, yuzde: aracYuzde },
      { id: 'dolar', isim: 'Dolar (USD)', icon: DollarSign, renk: '#10B981', deger: dolarBugunkuTL, kar: dolarKar, yuzde: dolarYuzde },
      { id: 'altin', isim: 'Gram Altın', icon: Coins, renk: '#EAB308', deger: altinBugunkuTL, kar: altinKar, yuzde: altinYuzde },
    ];

    // En yüksek değere sahip olanı bul (Sort descending)
    yatirimlar.sort((a, b) => b.deger - a.deger);
    const sampiyon = yatirimlar[0];

    return {
      arac: yatirimlar.find(y => y.id === 'arac'),
      dolar: yatirimlar.find(y => y.id === 'dolar'),
      altin: yatirimlar.find(y => y.id === 'altin'),
      alinabilecekDolar,
      alinabilecekAltin,
      yatirimlar,
      sampiyon
    };
  }, [aracAlisFiyati, aracGuncelFiyati, eskiDolar, guncelDolar, eskiAltin, guncelAltin]);

  const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" };
  const secTitle: React.CSSProperties = { fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" };

  return (
    <div className="yatirim-kiyaslama-container">
      {/* ── Intro ── */}
      <div style={{ ...card, marginBottom: "16px", background: `linear-gradient(135deg, var(--card-bg) 0%, ${AC_BG} 100%)`, border: `1px solid ${AC_B}` }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: AC_L, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <LineChart size={24} color={AC} />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", margin: "0 0 6px 0" }}>
              Otomobil vs Altın & Dolar
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
              Aracınızı aldığınız gün o parayla altın veya dolar alsaydınız bugün ne kadarınız olurdu? Kendi kurlarınızı girerek arabanızın ne kadar iyi bir yatırım olduğunu test edin.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "16px" }}>
        
        {/* ── Araç Verileri ── */}
        <div style={{ ...card, padding: "20px" }}>
          <div style={secTitle}><Car size={13} color="#3B82F6" /> Otomobil Yatırımı</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>Aracı Alırken Ödenen (Sermaye)</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "600" }}>₺</span>
                <input type="number" min="0" value={aracAlisFiyati || ""} onChange={e => setAracAlisFiyati(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px 12px 12px 30px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "15px", fontWeight: "600" }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>Aracın Bugünkü Piyasa Değeri</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "600" }}>₺</span>
                <input type="number" min="0" value={aracGuncelFiyati || ""} onChange={e => setAracGuncelFiyati(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px 12px 12px 30px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "15px", fontWeight: "600" }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Kur Verileri ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          
          {/* Dolar */}
          <div style={{ ...card, padding: "20px" }}>
            <div style={{ ...secTitle, color: "#10B981" }}>
              <DollarSign size={13} color="#10B981" /> Dolar (USD)
              <a href="https://www.tcmb.gov.tr/wps/wcm/connect/TR/TCMB+TR/Main+Menu/Istatistikler/Doviz+Kurlari" target="_blank" rel="noreferrer" style={{ marginLeft: "auto", fontSize: "10px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
                Kurlara Bak <ExternalLink size={10} />
              </a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>Alım Tarihindeki Dolar Kuru</label>
                <input type="number" step="0.01" min="0" value={eskiDolar || ""} onChange={e => setEskiDolar(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--foreground)", fontSize: "14px", fontWeight: "600" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>Güncel Dolar Kuru</label>
                <input type="number" step="0.01" min="0" value={guncelDolar || ""} onChange={e => setGuncelDolar(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px", color: "#10B981", fontSize: "14px", fontWeight: "700" }} />
              </div>
            </div>
          </div>

          {/* Altın */}
          <div style={{ ...card, padding: "20px" }}>
            <div style={{ ...secTitle, color: "#EAB308" }}>
              <Coins size={13} color="#EAB308" /> Gram Altın
              <a href="https://www.haremaltin.com/canli-piyasalar/arsiv" target="_blank" rel="noreferrer" style={{ marginLeft: "auto", fontSize: "10px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
                Arşive Bak <ExternalLink size={10} />
              </a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>Alım Tarihindeki Gram Altın (₺)</label>
                <input type="number" min="0" value={eskiAltin || ""} onChange={e => setEskiAltin(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--foreground)", fontSize: "14px", fontWeight: "600" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>Güncel Gram Altın (₺)</label>
                <input type="number" min="0" value={guncelAltin || ""} onChange={e => setGuncelAltin(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px", background: "rgba(234, 179, 8, 0.05)", border: "1px solid rgba(234, 179, 8, 0.2)", borderRadius: "8px", color: "#EAB308", fontSize: "14px", fontWeight: "700" }} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Results ── */}
      {aracAlisFiyati > 0 && eskiDolar > 0 && eskiAltin > 0 && (
        <div style={{ ...card, border: `2px solid ${results.sampiyon.renk}`, background: "var(--card-bg)", position: "relative", overflow: "hidden" }}>
          
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "8px", background: `${results.sampiyon.renk}15`, borderBottom: `1px solid ${results.sampiyon.renk}30`, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
            <Trophy size={16} color={results.sampiyon.renk} />
            <span style={{ fontSize: "12px", fontWeight: "700", color: results.sampiyon.renk, textTransform: "uppercase" }}>
              Kazanan Yatırım Aracı: {results.sampiyon.isim}
            </span>
          </div>

          <div style={{ marginTop: "40px", marginBottom: "30px" }}>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6", textAlign: "center", marginBottom: "20px" }}>
              Geçmişteki <strong>{"\u20BA"}{aracAlisFiyati.toLocaleString("tr-TR")}</strong> tutarındaki sermayeniz ile tam olarak <strong>{results.alinabilecekDolar.toLocaleString("tr-TR", {maximumFractionDigits:0})} Dolar</strong> veya <strong>{results.alinabilecekAltin.toLocaleString("tr-TR", {maximumFractionDigits:0})} Gram Altın</strong> alabiliyordunuz. İşte bugünkü karşılıkları:
            </div>

            {/* Yatırım Bar Grafiği Görünümü */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {results.yatirimlar.map((yatirim, index) => {
                const Icon = yatirim.icon;
                const isWinner = yatirim.id === results.sampiyon.id;
                // Maksimum değere göre genişlik ayarı
                const widthPercent = (yatirim.deger / results.sampiyon.deger) * 100;

                return (
                  <div key={yatirim.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", alignItems: "flex-end" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "700", color: "var(--foreground)" }}>
                        <Icon size={16} color={yatirim.renk} /> {yatirim.isim}
                        {isWinner && <Trophy size={14} color="#EAB308" style={{ marginLeft: "4px" }} />}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "18px", fontWeight: "900", color: yatirim.renk }}>{"\u20BA"}{yatirim.deger.toLocaleString("tr-TR", {maximumFractionDigits:0})}</div>
                        <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)" }}>
                          {yatirim.kar > 0 ? "+" : ""}{"\u20BA"}{yatirim.kar.toLocaleString("tr-TR", {maximumFractionDigits:0})} (%{yatirim.yuzde.toFixed(1)})
                        </div>
                      </div>
                    </div>
                    <div style={{ width: "100%", height: "12px", background: "var(--secondary)", borderRadius: "6px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${widthPercent}%`, background: yatirim.renk, borderRadius: "6px", transition: "width 1s ease-in-out" }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "var(--secondary)", padding: "16px", borderRadius: "12px", border: "1px dashed var(--card-border)" }}>
            <TrendingUp size={20} color={AC} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)", marginBottom: "4px" }}>
                En Kârlı Seçim Analizi
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                {results.sampiyon.id === 'arac' ? (
                  <>Sermayenizi <strong>Otomobile</strong> yatırarak doğru kararı vermişsiniz. Araç, Altın ve Dolar'ı geride bırakarak size en yüksek getiriyi sağlamış.</>
                ) : (
                  <>Eğer aracınızı almak yerine paranızı <strong>{results.sampiyon.isim}</strong>'a yatırsaydınız, bugün araba değerinden <strong>{"\u20BA"}{(results.sampiyon.deger - (results.arac?.deger || 0)).toLocaleString("tr-TR", {maximumFractionDigits:0})}</strong> daha fazla paranız olacaktı.</>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
