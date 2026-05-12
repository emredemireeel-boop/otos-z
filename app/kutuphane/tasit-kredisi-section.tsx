"use client";

import { useState, useMemo } from "react";
import { Calculator, Banknote, CalendarDays, TrendingUp, PieChart, Info, HelpCircle } from "lucide-react";

/* ── Accent Colors ── */
const AC = "#10B981"; // Emerald for Finance/Loan
const AC_L = "rgba(16,185,129,0.08)";
const AC_B = "rgba(16,185,129,0.20)";
const AC_BG = "rgba(16,185,129,0.04)";

export default function TasitKredisiSection() {
  const [krediTutari, setKrediTutari] = useState<number>(500000);
  const [vade, setVade] = useState<number>(36);
  const [faizOrani, setFaizOrani] = useState<number>(3.50);

  const results = useMemo(() => {
    // Aylık Faiz Oranı hesaplaması
    const r = faizOrani / 100;
    
    // Taksit Hesaplama Formülü: P * r * (1+r)^n / ((1+r)^n - 1)
    let taksit = 0;
    let toplamGeriOdeme = 0;
    let toplamFaiz = 0;

    if (faizOrani === 0) {
      taksit = krediTutari / vade;
      toplamGeriOdeme = krediTutari;
    } else {
      const pay = krediTutari * r * Math.pow(1 + r, vade);
      const fayda = Math.pow(1 + r, vade) - 1;
      taksit = pay / fayda;
      toplamGeriOdeme = taksit * vade;
      toplamFaiz = toplamGeriOdeme - krediTutari;
    }

    // Ek masraflar eklenebilir (KKDF, BSMV vb. basite indirgenerek dahil edilmiyor, faiz oranı net farz ediliyor)

    return {
      taksit,
      toplamGeriOdeme,
      toplamFaiz
    };
  }, [krediTutari, vade, faizOrani]);

  const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" };
  const secTitle: React.CSSProperties = { fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" };

  return (
    <div className="tasit-kredisi-container">
      {/* ── Intro ── */}
      <div style={{ ...card, marginBottom: "16px", background: `linear-gradient(135deg, var(--card-bg) 0%, ${AC_BG} 100%)`, border: `1px solid ${AC_B}` }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: AC_L, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Banknote size={24} color={AC} />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", margin: "0 0 6px 0" }}>
              Taşıt Kredisi Hesaplama
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
              Araç alırken kullanacağınız kredinin aylık taksit tutarını, toplam geri ödemesini ve ödeyeceğiniz toplam faiz miktarını detaylı olarak görün.
            </p>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ ...card, padding: "20px" }}>
          <div style={secTitle}><Calculator size={13} color={AC} /> Kredi Detayları</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", marginBottom: "20px" }}>
            
            {/* Kredi Tutarı */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Kredi Tutarı</span>
                <span style={{ color: AC, fontWeight: "700" }}>{"\u20BA"}{krediTutari.toLocaleString("tr-TR")}</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
                <input type="range" min={50000} max={3000000} step={10000} value={krediTutari} onChange={e => setKrediTutari(Number(e.target.value))}
                  style={{ flex: 1, accentColor: AC, height: "6px", cursor: "pointer" }} />
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[100000, 300000, 500000, 1000000].map(v => (
                  <button key={v} onClick={() => setKrediTutari(v)} style={{
                    padding: "6px 12px", borderRadius: "8px", border: `1px solid ${krediTutari === v ? AC : "var(--card-border)"}`,
                    background: krediTutari === v ? AC_L : "transparent", color: krediTutari === v ? AC : "var(--text-muted)",
                    fontSize: "11px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s"
                  }}>
                    {v / 1000}K
                  </button>
                ))}
              </div>
            </div>

            {/* Vade */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Vade (Ay)</span>
                <span style={{ color: AC, fontWeight: "700" }}>{vade} Ay</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px" }}>
                {[12, 18, 24, 36, 48, 60].map(m => {
                  const on = vade === m;
                  return (
                    <button key={m} onClick={() => setVade(m)} style={{
                      padding: "10px", borderRadius: "8px", border: `1.5px solid ${on ? AC : "var(--card-border)"}`,
                      background: on ? AC_L : "var(--secondary)", color: on ? AC : "var(--foreground)",
                      fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s"
                    }}>
                      {m}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Faiz Oranı */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                Aylık Faiz Oranı (%)
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ position: "relative", width: "150px" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "600" }}>%</span>
                  <input type="number" step="0.01" min="0" value={faizOrani} onChange={e => setFaizOrani(Number(e.target.value))}
                    style={{ width: "100%", padding: "12px 12px 12px 30px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "15px", fontWeight: "600" }} />
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", flex: 1 }}>
                  {[1.99, 2.99, 3.50, 4.49].map(f => (
                    <button key={f} onClick={() => setFaizOrani(f)} style={{
                      padding: "8px 12px", borderRadius: "8px", border: `1px solid ${faizOrani === f ? AC : "var(--card-border)"}`,
                      background: faizOrani === f ? AC_L : "transparent", color: faizOrani === f ? AC : "var(--text-muted)",
                      fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s"
                    }}>
                      %{f.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Results ── */}
      {krediTutari > 0 && vade > 0 && (
        <div style={{ ...card, border: `2px solid ${AC}`, background: "var(--card-bg)", position: "relative", overflow: "hidden" }}>
          
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              Aylık Taksit Tutarı
            </div>
            <div style={{ fontSize: "56px", fontWeight: "900", color: AC, lineHeight: 1 }}>
              {"\u20BA"}{results.taksit.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderTop: "1px solid var(--card-border)", paddingTop: "20px" }}>
            <div style={{ background: "var(--secondary)", border: "1px solid var(--card-border)", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}><PieChart size={18} color="var(--text-muted)" /></div>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px" }}>Kredi Ana Para</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)" }}>{"\u20BA"}{krediTutari.toLocaleString("tr-TR")}</div>
            </div>
            <div style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}><TrendingUp size={18} color="#EF4444" /></div>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#EF4444", marginBottom: "4px" }}>Toplam Faiz Tutarı</div>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#EF4444" }}>{"\u20BA"}{results.toplamFaiz.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}</div>
            </div>
          </div>
          
          <div style={{ marginTop: "12px", background: AC_L, border: `1px solid ${AC_B}`, padding: "16px", borderRadius: "12px", textAlign: "center", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: AC, textTransform: "uppercase" }}>Toplam Geri Ödeme:</div>
            <div style={{ fontSize: "22px", fontWeight: "900", color: AC }}>{"\u20BA"}{results.toplamGeriOdeme.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}</div>
          </div>

          <div style={{ marginTop: "16px", padding: "12px", background: "var(--secondary)", borderRadius: "10px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Info size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.5" }}>
              Hesaplama yalnızca anapara ve faiz oranını kapsar. Bankaların talep edebileceği BSMV, KKDF, kredi tahsis ücreti (dosya masrafı) ve sigorta primleri gibi ek vergiler/kesintiler dahil edilmemiştir. Kesin ödeme planı bankadan alınmalıdır.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
