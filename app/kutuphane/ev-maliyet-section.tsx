"use client";
import { useState, useMemo } from "react";
import { Zap, Battery, Leaf, TrendingDown, Info, ChevronDown, ChevronUp, HelpCircle, Gauge, PlugZap } from "lucide-react";

const fmt = (n: number) => Math.round(n).toLocaleString("tr-TR");
const fmtD = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const MODELS = [
  { n: "Togg T10X", b: 88.5, r: 523, c: 16.9 },
  { n: "Togg T10F", b: 52.4, r: 314, c: 16.7 },
  { n: "Tesla Model Y", b: 75, r: 455, c: 16.5 },
  { n: "Tesla Model 3", b: 60, r: 491, c: 12.2 },
  { n: "BYD Atto 3", b: 60.5, r: 420, c: 14.4 },
  { n: "BYD Seal", b: 82.5, r: 570, c: 14.5 },
  { n: "MG4 Electric", b: 64, r: 435, c: 14.7 },
  { n: "Renault Megane E-Tech", b: 60, r: 450, c: 13.3 },
  { n: "Volvo EX30", b: 69, r: 476, c: 14.5 },
  { n: "BMW iX1", b: 64.7, r: 440, c: 14.7 },
  { n: "Mercedes EQA", b: 66.5, r: 426, c: 15.6 },
  { n: "VW ID.4", b: 77, r: 520, c: 14.8 },
  { n: "Hyundai Ioniq 5", b: 77.4, r: 481, c: 16.1 },
  { n: "Kia EV6", b: 77.4, r: 528, c: 14.7 },
  { n: "Cupra Born", b: 58, r: 424, c: 13.7 },
  { n: "Manuel Giriş", b: 60, r: 400, c: 15.0 },
];

const TARIFFS = [
  { k: "ev_gece", l: "Ev Şarjı (Gece)", i: "🌙", p: 4.96, d: "22:00–06:00 gece tarifesi", s: "7 kW", clr: "#10B981" },
  { k: "ev_gunduz", l: "Ev Şarjı (Gündüz)", i: "☀️", p: 7.44, d: "06:00–22:00 gündüz tarifesi", s: "7 kW", clr: "#3B82F6" },
  { k: "ac_public", l: "Halka Açık AC", i: "🔌", p: 9.50, d: "Kamu AC istasyonu", s: "22 kW", clr: "#6366F1" },
  { k: "dc_fast", l: "DC Hızlı Şarj", i: "⚡", p: 13.50, d: "50 kW DC şarj", s: "50 kW", clr: "#F59E0B" },
  { k: "dc_ultra", l: "Ultra Hızlı DC", i: "🚀", p: 15.90, d: "150+ kW ultra hızlı", s: "150+ kW", clr: "#EF4444" },
];

const FUELS = [
  { k: "benzin", l: "Benzin", p: 42.50, c: 7.5 },
  { k: "dizel", l: "Dizel", p: 40.80, c: 6.0 },
  { k: "lpg", l: "LPG", p: 21.00, c: 10.0 },
];

const G = "#10B981"; const GL = "rgba(16,185,129,0.08)"; const GB = "rgba(16,185,129,0.25)";
const cs: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px", marginBottom: "16px" };
const st: React.CSSProperties = { fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" };

export default function EvMaliyetSection() {
  const [mi, setMi] = useState(0);
  const [km, setKm] = useState("1000");
  const [ti, setTi] = useState("ev_gece");
  const [customKw, setCustomKw] = useState("");
  const [customCons, setCustomCons] = useState("");
  const [faq, setFaq] = useState<number|null>(null);

  const m = MODELS[mi];
  const t = TARIFFS.find(x => x.k === ti)!;
  const cons = customCons ? parseFloat(customCons.replace(",",".")) || m.c : m.c;
  const kwP = customKw ? parseFloat(customKw.replace(",",".")) || t.p : t.p;
  const mesafe = parseFloat(km.replace(/\./g,"").replace(",",".")) || 0;
  const isManual = mi === MODELS.length - 1;

  const r = useMemo(() => {
    if (mesafe <= 0) return null;
    const kwNeeded = (mesafe * cons) / 100;
    const evCost = kwNeeded * kwP;
    const costKm = evCost / mesafe;
    const fullCharge = m.b * kwP;
    const chargeCount = kwNeeded / m.b;
    const chargeTime = m.b / (ti.includes("dc_ultra") ? 150 : ti.includes("dc_fast") ? 50 : ti.includes("ac_public") ? 22 : 7);
    const co2 = mesafe * 0.12;
    const treeSaved = co2 / 22;
    const fc = FUELS.map(f => {
      const lt = (mesafe * f.c) / 100;
      const cost = lt * f.p;
      const sav = cost - evCost;
      const pct = (sav / cost) * 100;
      return { ...f, lt, cost, sav, pct };
    });
    // Tüm şarj tipleri karşılaştırma
    const allCharges = TARIFFS.map(tr => ({
      ...tr, total: ((mesafe * cons) / 100) * tr.p
    }));
    return { kwNeeded, evCost, costKm, fullCharge, chargeCount, chargeTime, co2, treeSaved, fc, allCharges };
  }, [mesafe, cons, kwP, m, ti]);

  const faqs = [
    { q: "Evde şarj ne kadar sürer?", a: "7 kW ev şarj cihazıyla 60 kWh bataryayı yaklaşık 8-9 saatte doldurabilirsiniz. Gece takıp sabah dolu kullanabilirsiniz." },
    { q: "Gece tarifesi nasıl uygulanır?", a: "Çok zamanlı (3 zamanlı) sayaç kullanan abonelerde 22:00-06:00 arası düşük tarife uygulanır. Ev şarjı için en ekonomik seçenektir." },
    { q: "DC hızlı şarj bataryaya zarar verir mi?", a: "Sürekli DC kullanımı batarya ömrünü kısaltabilir. Günlük kullanımda AC ev şarjı, uzun yolda DC hızlı şarj önerilir." },
    { q: "Kışın menzil ne kadar düşer?", a: "Soğuk havalarda %15-30 menzil kaybı olabilir. Kabin ve batarya ısıtması enerji tüketir." },
    { q: "Bakım maliyeti ne kadar?", a: "Motor yağı, filtre, kayış gibi giderler yoktur. Yıllık bakım maliyeti benzinli araçlara göre %40-60 daha düşüktür." },
  ];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #059669, #10B981, #34D399)", borderRadius: "20px", padding: "28px", marginBottom: "24px", display: "flex", alignItems: "flex-start", gap: "16px", boxShadow: "0 10px 40px rgba(5,150,105,0.3)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", filter: "blur(30px)" }} />
        <div style={{ position: "absolute", bottom: "-20px", left: "30%", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", filter: "blur(20px)" }} />
        <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(255,255,255,0.3)" }}>
          <Zap size={28} color="white" />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "white", marginBottom: "8px" }}>Elektrikli Araç Maliyet Hesaplayıcı</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)", lineHeight: "1.6", margin: 0 }}>
            Aracınızı seçin veya tüketim girin — <strong style={{ color: "#FDE68A" }}>ev şarjı, gece/gündüz tarife</strong> farkını ve benzinli araçlara göre tasarrufunuzu görün.
          </p>
        </div>
      </div>

      {/* Araç Seçimi */}
      <div style={cs}>
        <div style={st}><PlugZap size={13} color={G} /> Araç Seçimi</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: "8px" }}>
          {MODELS.map((x, i) => (
            <button key={x.n} onClick={() => setMi(i)} style={{
              padding: "12px", borderRadius: "12px", cursor: "pointer", textAlign: "left",
              border: `2px solid ${mi === i ? G : "var(--card-border)"}`,
              background: mi === i ? GL : "var(--secondary)", transition: "all 0.2s",
            }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: mi === i ? G : "var(--foreground)", marginBottom: "4px" }}>{x.n}</div>
              {i < MODELS.length - 1 && <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{x.b} kWh · {x.r} km</div>}
              {i === MODELS.length - 1 && <div style={{ fontSize: "11px", color: G }}>Değerleri kendin gir</div>}
            </button>
          ))}
        </div>
        {/* Seçili araç detay */}
        <div style={{ marginTop: "16px", padding: "14px", background: GL, border: `1px solid ${GB}`, borderRadius: "12px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {[["Batarya", `${m.b} kWh`], ["Menzil (WLTP)", `${m.r} km`], ["Tüketim", `${m.c} kWh/100km`]].map(([l, v]) => (
            <div key={l} style={{ flex: "1", minWidth: "100px", textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "3px" }}>{l}</div>
              <div style={{ fontSize: "15px", fontWeight: "800", color: G }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Manuel tüketim */}
      {isManual && (
        <div style={cs}>
          <div style={st}><Gauge size={13} color={G} /> Manuel Tüketim Değeri</div>
          <input type="text" value={customCons} onChange={e => setCustomCons(e.target.value.replace(/[^0-9.,]/g, ""))}
            placeholder={`Varsayılan: ${m.c} kWh/100km`}
            style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--card-border)", background: "var(--background)", color: "var(--foreground)", fontSize: "15px", fontWeight: "700", outline: "none", boxSizing: "border-box" }} />
          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px", lineHeight: "1.5" }}>Aracınızın 100 km&apos;de tükettiği kWh miktarını girin. Genelde 12-20 kWh arasındadır.</p>
        </div>
      )}

      {/* Mesafe */}
      <div style={cs}>
        <div style={st}><TrendingDown size={13} color={G} /> Aylık Mesafe (km)</div>
        <input type="text" value={km} onChange={e => setKm(e.target.value.replace(/[^0-9.,]/g, ""))}
          placeholder="1000" style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--background)", color: "var(--foreground)", fontSize: "18px", fontWeight: "700", outline: "none", boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
          {["500", "1000", "1500", "2000", "3000", "5000"].map(v => (
            <button key={v} onClick={() => setKm(v)} style={{
              padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
              border: `1px solid ${km === v ? G : "var(--card-border)"}`,
              background: km === v ? GL : "transparent", color: km === v ? G : "var(--text-muted)",
            }}>{parseInt(v).toLocaleString("tr-TR")} km</button>
          ))}
        </div>
      </div>

      {/* Şarj Tipi */}
      <div style={cs}>
        <div style={st}><Zap size={13} color={G} /> Şarj Tipi &amp; Elektrik Tarifesi</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {TARIFFS.map(ct => {
            const a = ti === ct.k;
            return (
              <button key={ct.k} onClick={() => setTi(ct.k)} style={{
                padding: "14px", borderRadius: "14px", cursor: "pointer", textAlign: "left",
                border: `2px solid ${a ? ct.clr : "var(--card-border)"}`,
                background: a ? `${ct.clr}10` : "var(--secondary)", transition: "all 0.2s",
              }}>
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>{ct.i}</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: a ? ct.clr : "var(--foreground)", marginBottom: "2px" }}>{ct.l}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{ct.d}</div>
                <div style={{ marginTop: "4px", fontSize: "14px", fontWeight: "800", color: ct.clr }}>{fmtD(ct.p)} TL/kWh</div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: "14px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Özel kWh Fiyatı (opsiyonel)</label>
          <input type="text" value={customKw} onChange={e => setCustomKw(e.target.value.replace(/[^0-9.,]/g, ""))}
            placeholder={`Varsayılan: ${fmtD(t.p)} TL`}
            style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--card-border)", background: "var(--background)", color: "var(--foreground)", fontSize: "15px", fontWeight: "700", outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* SONUÇLAR */}
      {r && (
        <div style={{ ...cs, border: `2px solid ${GB}`, background: GL, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: `linear-gradient(90deg, #059669, #10B981, #34D399)` }} />
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", marginBottom: "20px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Zap size={20} color={G} /> Şarj Maliyeti Sonuçları
          </h3>

          {/* Ana sonuç */}
          <div style={{ padding: "24px", background: "var(--card-bg)", borderRadius: "14px", border: "1px solid var(--card-border)", textAlign: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              {fmt(mesafe)} km İçin Elektrik Maliyeti ({t.l})
            </div>
            <div style={{ fontSize: "42px", fontWeight: "900", color: G, lineHeight: 1 }}>
              {fmt(r.evCost)}<span style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-muted)", marginLeft: "4px" }}>TL</span>
            </div>
          </div>

          {/* Detay grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
            {[["Gerekli Enerji", `${fmtD(r.kwNeeded)} kWh`], ["km Başına", `${fmtD(r.costKm)} TL`], ["Tam Şarj", `${fmt(r.fullCharge)} TL`]].map(([l, v]) => (
              <div key={l} style={{ padding: "14px", background: "var(--card-bg)", borderRadius: "10px", border: "1px solid var(--card-border)", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "4px" }}>{l}</div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: G }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Tüm şarj tipleri karşılaştırma */}
          <h4 style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Battery size={14} color={G} /> Şarj Tipi Karşılaştırması ({fmt(mesafe)} km)
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", marginBottom: "16px" }}>
            {r.allCharges.map(ac => (
              <div key={ac.k} style={{ padding: "10px 8px", background: ti === ac.k ? `${ac.clr}15` : "var(--card-bg)", borderRadius: "10px", border: `1.5px solid ${ti === ac.k ? ac.clr : "var(--card-border)"}`, textAlign: "center" }}>
                <div style={{ fontSize: "14px", marginBottom: "4px" }}>{ac.i}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "4px" }}>{ac.l}</div>
                <div style={{ fontSize: "14px", fontWeight: "800", color: ac.clr }}>{fmt(ac.total)} ₺</div>
              </div>
            ))}
          </div>

          {/* CO2 + Ağaç */}
          <div style={{ padding: "14px", background: "rgba(16,185,129,0.12)", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <Leaf size={20} color={G} />
            <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: "600" }}>
              Benzinli araca göre ~<strong style={{ color: G }}>{fmtD(r.co2)} kg</strong> daha az CO₂ · 🌳 <strong style={{ color: G }}>{r.treeSaved.toFixed(1)}</strong> ağaca eşdeğer
            </span>
          </div>

          {/* Benzinli karşılaştırma */}
          <h4 style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            <TrendingDown size={14} color={G} /> Benzinli Araçlarla Karşılaştırma
          </h4>
          <div style={{ background: "var(--card-bg)", borderRadius: "12px", border: "1px solid var(--card-border)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  {["Yakıt", "Tüketim", "Maliyet", "Tasarruf"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.fc.map(fc => (
                  <tr key={fc.k} style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td style={{ padding: "12px 14px", fontSize: "14px", fontWeight: "700", color: "var(--foreground)" }}>{fc.l}</td>
                    <td style={{ padding: "12px 14px", fontSize: "13px", color: "var(--text-muted)" }}>{fmtD(fc.lt)} lt</td>
                    <td style={{ padding: "12px 14px", fontSize: "14px", fontWeight: "700", color: "#EF4444" }}>{fmt(fc.cost)} ₺</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", background: GL, color: G, border: `1px solid ${GB}` }}>
                        +{fmt(fc.sav)} ₺ (%{Math.round(fc.pct)})
                      </span>
                    </td>
                  </tr>
                ))}
                <tr style={{ background: GL }}>
                  <td style={{ padding: "12px 14px", fontSize: "14px", fontWeight: "800", color: G }}>⚡ Elektrikli</td>
                  <td style={{ padding: "12px 14px", fontSize: "13px", color: G, fontWeight: "700" }}>{fmtD(r.kwNeeded)} kWh</td>
                  <td style={{ padding: "12px 14px", fontSize: "14px", fontWeight: "800", color: G }}>{fmt(r.evCost)} ₺</td>
                  <td style={{ padding: "12px 14px", fontSize: "13px", fontWeight: "700", color: G }}>En Ucuz ✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SSS */}
      <div style={{ marginTop: "8px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <HelpCircle size={20} color={G} /> Sıkça Sorulan Sorular
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {faqs.map((item, i) => (
            <div key={i} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", overflow: "hidden" }}>
              <div onClick={() => setFaq(faq === i ? null : i)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "15px", fontWeight: "600", color: "var(--foreground)" }}>{item.q}</span>
                {faq === i ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
              </div>
              {faq === i && (
                <div style={{ padding: "0 20px 16px", animation: "fadeIn 0.2s ease" }}>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.7", margin: 0 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ marginTop: "16px", background: "rgba(16,185,129,0.06)", border: `1px solid ${GB}`, borderRadius: "14px", padding: "16px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <Info size={18} color={G} style={{ flexShrink: 0, marginTop: "2px" }} />
        <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
          Hesaplamalar WLTP tüketim verilerine dayanmaktadır. Gerçek tüketim sürüş koşullarına, hava sıcaklığına ve sürüş stiline göre değişebilir. Elektrik fiyatları Mayıs 2026 EPDK tarifesi baz alınmıştır.
        </p>
      </div>
    </div>
  );
}
