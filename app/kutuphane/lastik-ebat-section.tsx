"use client";

import { useState, useMemo } from "react";
import { Circle, Settings2, AlertTriangle, CheckCircle, Info } from "lucide-react";

/* ── Accent Colors ── */
const AC = "#EC4899"; // Pink for Tire Calculator
const AC_L = "rgba(236,72,153,0.08)";
const AC_B = "rgba(236,72,153,0.20)";
const AC_BG = "rgba(236,72,153,0.04)";

export default function LastikEbatSection() {
  // Orijinal Lastik
  const [eskiTaban, setEskiTaban] = useState<number>(205);
  const [eskiYanak, setEskiYanak] = useState<number>(55);
  const [eskiJant, setEskiJant] = useState<number>(16);

  // Yeni Lastik
  const [yeniTaban, setYeniTaban] = useState<number>(225);
  const [yeniYanak, setYeniYanak] = useState<number>(45);
  const [yeniJant, setYeniJant] = useState<number>(17);

  const results = useMemo(() => {
    // Çap Hesaplama Formülü (mm): (Taban * (Yanak / 100) * 2) + (Jant * 25.4)
    const eskiCap = (eskiTaban * (eskiYanak / 100) * 2) + (eskiJant * 25.4);
    const yeniCap = (yeniTaban * (yeniYanak / 100) * 2) + (yeniJant * 25.4);

    const farkMm = yeniCap - eskiCap;
    const farkYuzde = (farkMm / eskiCap) * 100;

    // Hız Sapması (Gerçek Hız / Gösterge) -> Yeni lastik büyükse araç daha hızlı gider
    const hizSapmasi = (yeniCap / eskiCap) * 100; // Örn: 100 km/h kadranda aslında kaçla gidiyor?

    // Güvenlik kuralı: Çap farkı +-%3'ü geçmemelidir.
    const isSafe = Math.abs(farkYuzde) <= 3;

    return {
      eskiCap,
      yeniCap,
      farkMm,
      farkYuzde,
      hizSapmasi,
      isSafe
    };
  }, [eskiTaban, eskiYanak, eskiJant, yeniTaban, yeniYanak, yeniJant]);

  const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" };
  const secTitle: React.CSSProperties = { fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" };

  return (
    <div className="lastik-ebat-container">
      {/* ── Intro ── */}
      <div style={{ ...card, marginBottom: "16px", background: `linear-gradient(135deg, var(--card-bg) 0%, ${AC_BG} 100%)`, border: `1px solid ${AC_B}` }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: AC_L, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Circle size={24} color={AC} />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", margin: "0 0 6px 0" }}>
              Lastik Ebat ve Çap Hesaplama
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
              Orijinal lastiğiniz ile takmak istediğiniz yeni lastiğin çap farkını ve hız göstergesindeki sapmayı hesaplayın. <strong>Değişim oranının %3'ü geçmemesi</strong> sürüş güvenliği için tavsiye edilir.
            </p>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        
        {/* Orijinal Lastik */}
        <div style={{ ...card, padding: "20px" }}>
          <div style={secTitle}><Settings2 size={13} color="var(--text-muted)" /> Mevcut (Orijinal) Lastik</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Taban Genişliği (mm)</span>
                <span style={{ color: "var(--foreground)", fontWeight: "700" }}>{eskiTaban}</span>
              </label>
              <input type="range" min={125} max={335} step={10} value={eskiTaban} onChange={e => setEskiTaban(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--foreground)", height: "6px", cursor: "pointer" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Yanak Oranı (%)</span>
                <span style={{ color: "var(--foreground)", fontWeight: "700" }}>{eskiYanak}</span>
              </label>
              <input type="range" min={25} max={85} step={5} value={eskiYanak} onChange={e => setEskiYanak(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--foreground)", height: "6px", cursor: "pointer" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Jant Çapı (İnç)</span>
                <span style={{ color: "var(--foreground)", fontWeight: "700" }}>R{eskiJant}</span>
              </label>
              <input type="range" min={12} max={24} step={1} value={eskiJant} onChange={e => setEskiJant(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--foreground)", height: "6px", cursor: "pointer" }} />
            </div>
            <div style={{ textAlign: "center", padding: "10px", background: "var(--secondary)", borderRadius: "8px", fontSize: "16px", fontWeight: "800", letterSpacing: "1px" }}>
              {eskiTaban} / {eskiYanak} R{eskiJant}
            </div>
          </div>
        </div>

        {/* Yeni Lastik */}
        <div style={{ ...card, padding: "20px", border: `1.5px solid ${AC_B}`, background: AC_BG }}>
          <div style={{ ...secTitle, color: AC }}><Settings2 size={13} color={AC} /> Hedef (Yeni) Lastik</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Taban Genişliği (mm)</span>
                <span style={{ color: AC, fontWeight: "700" }}>{yeniTaban}</span>
              </label>
              <input type="range" min={125} max={335} step={10} value={yeniTaban} onChange={e => setYeniTaban(Number(e.target.value))}
                style={{ width: "100%", accentColor: AC, height: "6px", cursor: "pointer" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Yanak Oranı (%)</span>
                <span style={{ color: AC, fontWeight: "700" }}>{yeniYanak}</span>
              </label>
              <input type="range" min={25} max={85} step={5} value={yeniYanak} onChange={e => setYeniYanak(Number(e.target.value))}
                style={{ width: "100%", accentColor: AC, height: "6px", cursor: "pointer" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Jant Çapı (İnç)</span>
                <span style={{ color: AC, fontWeight: "700" }}>R{yeniJant}</span>
              </label>
              <input type="range" min={12} max={24} step={1} value={yeniJant} onChange={e => setYeniJant(Number(e.target.value))}
                style={{ width: "100%", accentColor: AC, height: "6px", cursor: "pointer" }} />
            </div>
            <div style={{ textAlign: "center", padding: "10px", background: AC_L, color: AC, borderRadius: "8px", fontSize: "16px", fontWeight: "800", letterSpacing: "1px" }}>
              {yeniTaban} / {yeniYanak} R{yeniJant}
            </div>
          </div>
        </div>

      </div>

      {/* ── Results ── */}
      <div style={{ ...card, border: `2px solid ${results.isSafe ? "#10B981" : "#EF4444"}`, background: "var(--card-bg)", position: "relative", overflow: "hidden" }}>
        
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "8px", background: results.isSafe ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", borderBottom: `1px solid ${results.isSafe ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
          {results.isSafe ? <CheckCircle size={16} color="#10B981" /> : <AlertTriangle size={16} color="#EF4444" />}
          <span style={{ fontSize: "12px", fontWeight: "700", color: results.isSafe ? "#10B981" : "#EF4444", textTransform: "uppercase" }}>
            {results.isSafe ? "Değişim Uygun (%3 Sınırı İçinde)" : "Değişim Önerilmez (%3 Sınırını Aşıyor)"}
          </span>
        </div>

        <div style={{ marginTop: "32px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px" }}>Orijinal Çap</div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--foreground)" }}>{results.eskiCap.toFixed(1)} <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>mm</span></div>
          </div>
          <div style={{ textAlign: "center", borderLeft: "1px solid var(--card-border)", borderRight: "1px solid var(--card-border)" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px" }}>Çap Farkı</div>
            <div style={{ fontSize: "24px", fontWeight: "900", color: results.isSafe ? "#10B981" : "#EF4444" }}>
              {results.farkYuzde > 0 ? "+" : ""}{results.farkYuzde.toFixed(2)}%
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>({results.farkMm > 0 ? "+" : ""}{results.farkMm.toFixed(1)} mm)</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px" }}>Yeni Çap</div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: AC }}>{results.yeniCap.toFixed(1)} <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>mm</span></div>
          </div>
        </div>

        <div style={{ marginTop: "24px", padding: "16px", background: "var(--secondary)", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "6px" }}>
            <Settings2 size={14} color={AC} /> Hız Göstergesi Sapması
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5" }}>
            Kadranınız <strong>100 km/s</strong> gösterdiğinde, yeni lastiklerle gerçek hızınız <strong>{results.hizSapmasi.toFixed(1)} km/s</strong> olacaktır.
            {results.hizSapmasi > 100 && " (Radarlara dikkat!)"}
            {results.hizSapmasi < 100 && " (Aracınız daha yavaş gidecektir.)"}
          </div>
        </div>

        <div style={{ marginTop: "12px", padding: "12px", background: AC_L, borderRadius: "10px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <Info size={16} color={AC} style={{ flexShrink: 0, marginTop: "2px" }} />
          <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.5" }}>
            <strong>Uyarı:</strong> Çap farkı %3'ten büyük olan lastik değişimleri; aracın ön düzenine zarar verebilir, yakıt tüketimini artırabilir, ABS ve ESP sistemlerinin hatalı çalışmasına neden olabilir.
          </div>
        </div>

      </div>
    </div>
  );
}
