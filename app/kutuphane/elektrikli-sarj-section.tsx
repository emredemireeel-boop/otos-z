"use client";
import { useState, useMemo } from "react";
import { Zap, Battery, BatteryCharging, Leaf, TrendingDown, Info, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const fmt = (n: number) => Math.round(n).toLocaleString("tr-TR");
const fmtD = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const EV_MODELS = [
  { name: "Togg T10X", battery: 88.5, range: 523, consumption: 16.9 },
  { name: "Togg T10F", battery: 52.4, range: 314, consumption: 16.7 },
  { name: "Tesla Model Y", battery: 75, range: 455, consumption: 16.5 },
  { name: "Tesla Model 3", battery: 60, range: 491, consumption: 12.2 },
  { name: "BYD Atto 3", battery: 60.5, range: 420, consumption: 14.4 },
  { name: "BYD Seal", battery: 82.5, range: 570, consumption: 14.5 },
  { name: "BYD Han", battery: 85.4, range: 521, consumption: 16.4 },
  { name: "MG4 Electric", battery: 64, range: 435, consumption: 14.7 },
  { name: "Renault Megane E-Tech", battery: 60, range: 450, consumption: 13.3 },
  { name: "Volvo EX30", battery: 69, range: 476, consumption: 14.5 },
  { name: "BMW iX1", battery: 64.7, range: 440, consumption: 14.7 },
  { name: "Mercedes EQA", battery: 66.5, range: 426, consumption: 15.6 },
  { name: "VW ID.4", battery: 77, range: 520, consumption: 14.8 },
  { name: "Hyundai Ioniq 5", battery: 77.4, range: 481, consumption: 16.1 },
  { name: "Kia EV6", battery: 77.4, range: 528, consumption: 14.7 },
  { name: "Cupra Born", battery: 58, range: 424, consumption: 13.7 },
  { name: "Skoda Enyaq", battery: 77, range: 510, consumption: 15.1 },
];

const CHARGE_TYPES = [
  { key: "ev", label: "Ev Şarjı (AC)", icon: "🏠", kwPrice: 4.96, desc: "Gece tarifesi ~4.96 TL/kWh", speed: "7 kW", color: "#10B981" },
  { key: "ac_public", label: "Halka Açık AC", icon: "🔌", kwPrice: 9.50, desc: "Kamu AC istasyonu", speed: "22 kW", color: "#3B82F6" },
  { key: "dc_fast", label: "DC Hızlı Şarj", icon: "⚡", kwPrice: 13.50, desc: "50 kW DC şarj", speed: "50 kW", color: "#F59E0B" },
  { key: "dc_ultra", label: "Ultra Hızlı DC", icon: "🚀", kwPrice: 15.90, desc: "150+ kW ultra hızlı", speed: "150+ kW", color: "#EF4444" },
];

const FUEL_COMPARE = [
  { key: "benzin", label: "Benzin", price: 42.50, consumption: 7.5 },
  { key: "dizel", label: "Dizel", price: 40.80, consumption: 6.0 },
  { key: "lpg", label: "LPG", price: 21.00, consumption: 10.0 },
];

const GRN = "#10B981";
const GRN_L = "rgba(16,185,129,0.08)";
const GRN_B = "rgba(16,185,129,0.25)";
const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px", marginBottom: "16px" };
const secT: React.CSSProperties = { fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" };

export default function ElektrikliSarjSection() {
  const [selectedModel, setSelectedModel] = useState(0);
  const [mesafe, setMesafe] = useState("1000");
  const [chargeType, setChargeType] = useState("ev");
  const [customKw, setCustomKw] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const model = EV_MODELS[selectedModel];
  const charge = CHARGE_TYPES.find(c => c.key === chargeType)!;
  const kwPrice = customKw ? parseFloat(customKw.replace(",", ".")) || charge.kwPrice : charge.kwPrice;
  const km = parseFloat(mesafe.replace(/\./g, "").replace(",", ".")) || 0;

  const results = useMemo(() => {
    if (km <= 0) return null;
    const kwNeeded = (km * model.consumption) / 100;
    const evCost = kwNeeded * kwPrice;
    const costPerKm = evCost / km;
    const fullChargeCost = model.battery * kwPrice;
    const chargeCount = kwNeeded / model.battery;
    const co2Saved = km * 0.12;
    const fuelComparisons = FUEL_COMPARE.map(f => {
      const fuelLiters = (km * f.consumption) / 100;
      const fuelCost = fuelLiters * f.price;
      const saving = fuelCost - evCost;
      const savingPct = (saving / fuelCost) * 100;
      return { ...f, fuelLiters, fuelCost, saving, savingPct };
    });
    return { kwNeeded, evCost, costPerKm, fullChargeCost, chargeCount, co2Saved, fuelComparisons };
  }, [km, model, kwPrice]);

  const faqs = [
    { q: "Evde şarj ne kadar sürer?", a: "7 kW'lık ev tipi şarj cihazıyla ortalama bir EV'yi (60 kWh batarya) %10'dan %100'e yaklaşık 8-9 saatte şarj edebilirsiniz. Gece yatarken takıp sabah dolu bataryayla çıkabilirsiniz." },
    { q: "DC hızlı şarj bataryaya zarar verir mi?", a: "Sürekli DC hızlı şarj kullanımı batarya ömrünü kısaltabilir. İdeal olan günlük kullanımda AC ev şarjı, uzun yolda DC hızlı şarj tercih etmektir. Çoğu üretici %80'e kadar hızlı şarj önermektedir." },
    { q: "Kışın menzil ne kadar düşer?", a: "Soğuk havalarda batarya performansı düşer. Ortalama %15-30 menzil kaybı yaşanabilir. Kabin ısıtması ve batarya ısıtma sistemi enerji tüketir." },
    { q: "Elektrikli araç bakım maliyeti nasıl?", a: "Motor yağı, filtre, kayış gibi giderler yoktur. Fren balataları rejeneratif fren sayesinde çok daha uzun ömürlüdür. Yıllık bakım maliyeti benzinli araçlara göre %40-60 daha düşüktür." },
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
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "white", marginBottom: "8px" }}>Elektrikli Araç Şarj Maliyeti</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)", lineHeight: "1.6", margin: 0 }}>
            Aracınızı seçin, mesafe girin — ev şarjı, DC hızlı şarj ve benzinli araçlarla karşılaştırın.
          </p>
        </div>
      </div>

      {/* Araç Seçimi */}
      <div style={card}>
        <div style={secT}><BatteryCharging size={13} color={GRN} /> Araç Modeli</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "8px" }}>
          {EV_MODELS.map((m, i) => (
            <button key={m.name} onClick={() => setSelectedModel(i)} style={{
              padding: "12px", borderRadius: "12px", cursor: "pointer", textAlign: "left",
              border: `2px solid ${selectedModel === i ? GRN : "var(--card-border)"}`,
              background: selectedModel === i ? GRN_L : "var(--secondary)",
              transition: "all 0.2s",
            }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: selectedModel === i ? GRN : "var(--foreground)", marginBottom: "4px" }}>{m.name}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.battery} kWh · {m.range} km</div>
            </button>
          ))}
        </div>
        {/* Seçili araç detay */}
        <div style={{ marginTop: "16px", padding: "16px", background: GRN_L, border: `1px solid ${GRN_B}`, borderRadius: "12px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {[
            ["Batarya", `${model.battery} kWh`],
            ["Menzil (WLTP)", `${model.range} km`],
            ["Tüketim", `${model.consumption} kWh/100km`],
          ].map(([l, v]) => (
            <div key={l} style={{ flex: "1", minWidth: "120px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "4px" }}>{l}</div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: GRN }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mesafe */}
      <div style={card}>
        <div style={secT}><TrendingDown size={13} color={GRN} /> Aylık Mesafe (km)</div>
        <input type="text" value={mesafe} onChange={e => setMesafe(e.target.value.replace(/[^0-9.,]/g, ""))}
          placeholder="1000" style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--background)", color: "var(--foreground)", fontSize: "18px", fontWeight: "700", outline: "none", boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
          {["500", "1000", "1500", "2000", "3000", "5000"].map(v => (
            <button key={v} onClick={() => setMesafe(v)} style={{
              padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
              border: `1px solid ${mesafe === v ? GRN : "var(--card-border)"}`,
              background: mesafe === v ? GRN_L : "transparent",
              color: mesafe === v ? GRN : "var(--text-muted)",
            }}>{parseInt(v).toLocaleString("tr-TR")} km</button>
          ))}
        </div>
      </div>

      {/* Şarj Tipi */}
      <div style={card}>
        <div style={secT}><Zap size={13} color={GRN} /> Şarj Tipi</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {CHARGE_TYPES.map(ct => {
            const active = chargeType === ct.key;
            return (
              <button key={ct.key} onClick={() => setChargeType(ct.key)} style={{
                padding: "16px", borderRadius: "14px", cursor: "pointer", textAlign: "left",
                border: `2px solid ${active ? ct.color : "var(--card-border)"}`,
                background: active ? `${ct.color}10` : "var(--secondary)",
                transition: "all 0.2s",
              }}>
                <div style={{ fontSize: "20px", marginBottom: "6px" }}>{ct.icon}</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: active ? ct.color : "var(--foreground)", marginBottom: "2px" }}>{ct.label}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{ct.desc}</div>
                <div style={{ marginTop: "6px", fontSize: "14px", fontWeight: "800", color: ct.color }}>{fmtD(ct.kwPrice)} TL/kWh</div>
              </button>
            );
          })}
        </div>
        {/* Özel fiyat */}
        <div style={{ marginTop: "14px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Özel kWh Fiyatı (opsiyonel)</label>
          <input type="text" value={customKw} onChange={e => setCustomKw(e.target.value.replace(/[^0-9.,]/g, ""))}
            placeholder={`Varsayılan: ${fmtD(charge.kwPrice)} TL`}
            style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--card-border)", background: "var(--background)", color: "var(--foreground)", fontSize: "15px", fontWeight: "700", outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* SONUÇLAR */}
      {results && (
        <div style={{ ...card, border: `2px solid ${GRN_B}`, background: GRN_L, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: `linear-gradient(90deg, #059669, #10B981, #34D399)` }} />

          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", marginBottom: "20px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Zap size={20} color={GRN} /> Şarj Maliyeti Sonuçları
          </h3>

          {/* Ana sonuç */}
          <div style={{ padding: "24px", background: "var(--card-bg)", borderRadius: "14px", border: "1px solid var(--card-border)", textAlign: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              {fmt(km)} km İçin Elektrik Maliyeti
            </div>
            <div style={{ fontSize: "42px", fontWeight: "900", color: GRN, lineHeight: 1 }}>
              {fmt(results.evCost)}<span style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-muted)", marginLeft: "4px" }}>TL</span>
            </div>
          </div>

          {/* Detay grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
            {[
              ["Gerekli Enerji", `${fmtD(results.kwNeeded)} kWh`],
              ["km Başına", `${fmtD(results.costPerKm)} TL`],
              ["Tam Şarj", `${fmt(results.fullChargeCost)} TL`],
            ].map(([l, v]) => (
              <div key={l} style={{ padding: "14px", background: "var(--card-bg)", borderRadius: "10px", border: "1px solid var(--card-border)", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "4px" }}>{l}</div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: GRN }}>{v}</div>
              </div>
            ))}
          </div>

          {/* CO2 bilgi */}
          <div style={{ padding: "14px", background: "rgba(16,185,129,0.12)", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Leaf size={20} color={GRN} />
            <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: "600" }}>
              Benzinli araca göre ~<strong style={{ color: GRN }}>{fmtD(results.co2Saved)} kg</strong> daha az CO₂ emisyonu
            </span>
          </div>

          {/* Benzinli karşılaştırma */}
          <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--foreground)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <TrendingDown size={16} color={GRN} /> Benzinli Araçlarla Karşılaştırma
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
                {results.fuelComparisons.map(fc => (
                  <tr key={fc.key} style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td style={{ padding: "12px 14px", fontSize: "14px", fontWeight: "700", color: "var(--foreground)" }}>{fc.label}</td>
                    <td style={{ padding: "12px 14px", fontSize: "13px", color: "var(--text-muted)" }}>{fmtD(fc.fuelLiters)} lt</td>
                    <td style={{ padding: "12px 14px", fontSize: "14px", fontWeight: "700", color: "#EF4444" }}>{fmt(fc.fuelCost)} ₺</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", background: GRN_L, color: GRN, border: `1px solid ${GRN_B}` }}>
                        {fc.saving > 0 ? `+${fmt(fc.saving)} ₺` : `${fmt(fc.saving)} ₺`} ({fc.savingPct > 0 ? "%" + Math.round(fc.savingPct) : "—"})
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Elektrikli satırı */}
                <tr style={{ background: GRN_L }}>
                  <td style={{ padding: "12px 14px", fontSize: "14px", fontWeight: "800", color: GRN }}>⚡ Elektrikli</td>
                  <td style={{ padding: "12px 14px", fontSize: "13px", color: GRN, fontWeight: "700" }}>{fmtD(results.kwNeeded)} kWh</td>
                  <td style={{ padding: "12px 14px", fontSize: "14px", fontWeight: "800", color: GRN }}>{fmt(results.evCost)} ₺</td>
                  <td style={{ padding: "12px 14px", fontSize: "13px", fontWeight: "700", color: GRN }}>En Ucuz ✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SSS */}
      <div style={{ marginTop: "8px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <HelpCircle size={20} color={GRN} /> Sıkça Sorulan Sorular
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {faqs.map((item, i) => (
            <div key={i} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", overflow: "hidden" }}>
              <div onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "15px", fontWeight: "600", color: "var(--foreground)" }}>{item.q}</span>
                {expandedFaq === i ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
              </div>
              {expandedFaq === i && (
                <div style={{ padding: "0 20px 16px", animation: "fadeIn 0.2s ease" }}>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.7", margin: 0 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ marginTop: "16px", background: "rgba(16,185,129,0.06)", border: `1px solid ${GRN_B}`, borderRadius: "14px", padding: "16px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <Info size={18} color={GRN} style={{ flexShrink: 0, marginTop: "2px" }} />
        <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
          Hesaplamalar WLTP tüketim verilerine dayanmaktadır. Gerçek tüketim sürüş koşullarına, hava sıcaklığına ve sürüş stiline göre değişiklik gösterebilir. Elektrik fiyatları Mayıs 2026 mesken tarifesi baz alınmıştır.
        </p>
      </div>
    </div>
  );
}
