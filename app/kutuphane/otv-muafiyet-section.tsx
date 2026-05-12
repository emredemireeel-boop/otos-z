"use client";

import { useState, useMemo } from "react";
import { Car, AlertTriangle, CheckCircle, Percent, PlusCircle, HelpCircle, BadgePercent } from "lucide-react";

/* ── Accent Colors ── */
const AC = "#8B5CF6"; // Violet for ÖTV
const AC_L = "rgba(139,92,246,0.08)";
const AC_B = "rgba(139,92,246,0.20)";
const AC_BG = "rgba(139,92,246,0.04)";

export default function OtvMuafiyetSection() {
  const [listeFiyati, setListeFiyati] = useState<number>(1850000);
  const [ustLimit, setUstLimit] = useState<number>(3300000);
  const [otvOrani, setOtvOrani] = useState<number>(80);
  const [bayiEkstra, setBayiEkstra] = useState<number>(150000);

  const results = useMemo(() => {
    // 1. Muafiyet kontrolü
    const isEligible = listeFiyati <= ustLimit;

    // 2. ÖTV indirimi hesaplama (Liste Fiyatı = Net * (1+ÖTV) * (1+KDV) -> Muafiyetli Fiyat = Liste / (1+ÖTV))
    const indirimliFiyat = isEligible ? (listeFiyati / (1 + (otvOrani / 100))) : 0;
    
    // 3. Toplam Kâr (Devlet İndirimi)
    const devletIndirimi = isEligible ? (listeFiyati - indirimliFiyat) : 0;

    // 4. Gerçekte Ödenecek Toplam Tutar (Bayi ekstrası eklenerek)
    const toplamOdenecek = isEligible ? (indirimliFiyat + bayiEkstra) : 0;

    return {
      isEligible,
      indirimliFiyat,
      devletIndirimi,
      toplamOdenecek
    };
  }, [listeFiyati, ustLimit, otvOrani, bayiEkstra]);

  const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" };
  const secTitle: React.CSSProperties = { fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" };

  return (
    <div className="otv-muafiyet-container">
      {/* ── Intro ── */}
      <div style={{ ...card, marginBottom: "16px", background: `linear-gradient(135deg, var(--card-bg) 0%, ${AC_BG} 100%)`, border: `1px solid ${AC_B}` }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: AC_L, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <BadgePercent size={24} color={AC} />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", margin: "0 0 6px 0" }}>
              ÖTV Muafiyetli Araç Alım Hesaplayıcı
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
              Engelli raporunuzla sıfır araç alırken yasal indirimli tutarı hesaplayın. Bayilerin talep ettiği aksesuar (elden ödeme) farklarını da hesaba katarak cebinizden çıkacak net parayı görün.
            </p>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ ...card, padding: "20px" }}>
          <div style={secTitle}><Car size={13} color={AC} /> Araç ve Limit Bilgileri</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            {/* Liste Fiyatı */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                Aracın Liste Fiyatı (TL)
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "600" }}>₺</span>
                <input type="number" min="0" value={listeFiyati || ""} onChange={e => setListeFiyati(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px 12px 12px 30px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "15px", fontWeight: "600" }} />
              </div>
            </div>

            {/* Üst Limit */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Güncel Üst Limit</span>
                <span style={{ color: AC }}>Yıllık Değişir</span>
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "600" }}>₺</span>
                <input type="number" min="0" value={ustLimit || ""} onChange={e => setUstLimit(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px 12px 12px 30px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "15px", fontWeight: "600" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <input type="range" min={500000} max={5000000} step={10000} value={listeFiyati} onChange={e => setListeFiyati(Number(e.target.value))}
              style={{ flex: 1, accentColor: AC, height: "6px", cursor: "pointer" }} />
            <div style={{ fontSize: "13px", fontWeight: "700", color: AC, width: "120px", textAlign: "right" }}>
              {"\u20BA"}{listeFiyati.toLocaleString("tr-TR")}
            </div>
          </div>

          <div style={secTitle}><Percent size={13} color={AC} /> Detaylar ve Ekstralar</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* ÖTV Oranı */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                Uygulanan ÖTV Oranı
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                {[50, 60, 80].map(m => {
                  const on = otvOrani === m;
                  return (
                    <button key={m} onClick={() => setOtvOrani(m)} style={{
                      padding: "10px", borderRadius: "8px", border: `1.5px solid ${on ? AC : "var(--card-border)"}`,
                      background: on ? AC_L : "var(--secondary)", color: on ? AC : "var(--text-muted)",
                      fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s"
                    }}>
                      %{m}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bayi Aksesuar (Elden) Tutarı */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                Bayi Ekstrası / Aksesuar (TL)
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "600" }}>₺</span>
                <input type="number" min="0" value={bayiEkstra || ""} onChange={e => setBayiEkstra(Number(e.target.value))} placeholder="0"
                  style={{ width: "100%", padding: "12px 12px 12px 30px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "15px", fontWeight: "600" }} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Results ── */}
      {listeFiyati > 0 && (
        <div style={{ ...card, border: `2px solid ${results.isEligible ? AC : "#EF4444"}`, background: "var(--card-bg)", position: "relative", overflow: "hidden" }}>
          
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "8px", background: results.isEligible ? AC_L : "rgba(239, 68, 68, 0.1)", borderBottom: `1px solid ${results.isEligible ? AC_B : "rgba(239, 68, 68, 0.2)"}`, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
            {results.isEligible ? <CheckCircle size={16} color={AC} /> : <AlertTriangle size={16} color="#EF4444" />}
            <span style={{ fontSize: "12px", fontWeight: "700", color: results.isEligible ? AC : "#EF4444", textTransform: "uppercase" }}>
              {results.isEligible ? "Araç Muafiyete Uygun" : "Limit Aşımı: Muafiyete Uygun Değil"}
            </span>
          </div>

          <div style={{ marginTop: "32px", textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              Gerçekte Ödenecek Toplam Tutar
            </div>
            <div style={{ fontSize: "48px", fontWeight: "900", color: results.isEligible ? AC : "var(--text-muted)", lineHeight: 1 }}>
              {results.isEligible ? `\u20BA${results.toplamOdenecek.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}` : "-"}
            </div>
            {bayiEkstra > 0 && results.isEligible && (
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
                (İndirimli Fiyat + Bayi Aksesuar Ücreti Dahil)
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderTop: "1px solid var(--card-border)", paddingTop: "20px" }}>
            <div style={{ background: "var(--secondary)", border: "1px solid var(--card-border)", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px" }}>Resmi İndirimli Fiyat</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--foreground)" }}>
                {results.isEligible ? `\u20BA${results.indirimliFiyat.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}` : "-"}
              </div>
            </div>
            <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#10B981", marginBottom: "4px" }}>Devlet Katkısı (ÖTV İndirimi)</div>
              <div style={{ fontSize: "20px", fontWeight: "900", color: "#10B981" }}>
                {results.isEligible ? `\u20BA${results.devletIndirimi.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}` : "-"}
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: "16px", padding: "12px", background: "var(--secondary)", borderRadius: "10px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <HelpCircle size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.5" }}>
              <strong>Not:</strong> Engelli muafiyetli araçlarda aracın net (vergisiz) fiyatı üzerinden sadece KDV ödenir, ÖTV tamamen sıfırlanır. Bayiler yasal fatura bedelinin (Resmi İndirimli Fiyat) üzerinde kalan aksesuar veya elden ücretleri bu kapsama dahil edemezler.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
