"use client";
import { useState, useMemo } from "react";
import { Calculator, Car, Calendar, ChevronDown, ChevronUp, HelpCircle, Info, ExternalLink, Banknote } from "lucide-react";

const fmt = (n: number) => Math.round(n).toLocaleString("tr-TR");
const fmtD = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const parseN = (v: string) => parseFloat(v.replace(/\./g, "").replace(",", ".")) || 0;
const fmtI = (v: string) => { const r = v.replace(/[^0-9]/g, ""); return r ? parseInt(r).toLocaleString("tr-TR") : ""; };

// 2026 MTV — 2018 ÖNCESİ tescil (I/A Sayılı Tarife)
// [1-3 yaş, 4-6 yaş, 7-11 yaş, 12-15 yaş, 16+ yaş]
const PRE_2018: Record<string, number[]> = {
  "1300":   [5750, 4010, 2238, 1689, 593],
  "1600":   [10016, 7510, 4354, 3077, 1181],
  "1800":   [17705, 13829, 8145, 4957, 1917],
  "2000":   [27898, 21478, 12624, 7510, 2958],
  "2500":   [41840, 30372, 18977, 11333, 4479],
  "3000":   [58347, 50754, 31704, 17044, 6255],
  "3500":   [88859, 79955, 48158, 24031, 8813],
  "4000":   [139721, 120647, 71048, 31704, 12624],
  "4001":   [228681, 171485, 101555, 45632, 17705],
};

// 2026 MTV — 2018 SONRASI tescil (I Sayılı Tarife)
// Her motor hacmi için 3 matrah kademesi: [düşük, orta, yüksek]
// Her kademe: [1-3 yaş, 4-6 yaş, 7-11 yaş, 12-15 yaş, 16+ yaş]
const POST_2018: Record<string, { limit: number[]; rates: number[][] }> = {
  "1300": {
    limit: [193000, 330000], // matrah sınırları
    rates: [
      [6066, 4230, 2370, 1784, 627],
      [6667, 4653, 2603, 1965, 689],
      [7282, 5084, 2845, 2144, 753],
    ],
  },
  "1600": {
    limit: [330000, 540000],
    rates: [
      [10568, 7920, 4600, 3245, 1247],
      [11629, 8717, 5060, 3570, 1371],
      [12690, 9512, 5520, 3895, 1496],
    ],
  },
  "1800": {
    limit: [540000, 810000],
    rates: [
      [18679, 14600, 8595, 5233, 2024],
      [20543, 16060, 9455, 5756, 2226],
      [22406, 17520, 10315, 6280, 2428],
    ],
  },
  "2000": {
    limit: [810000, 1350000],
    rates: [
      [29458, 22682, 13332, 7928, 3125],
      [32404, 24950, 14665, 8721, 3438],
      [35350, 27218, 15998, 9514, 3750],
    ],
  },
  "2500": {
    limit: [1350000, 2150000],
    rates: [
      [44192, 32069, 20040, 11967, 4730],
      [48611, 35276, 22044, 13164, 5203],
      [53030, 38483, 24048, 14361, 5676],
    ],
  },
  "3000": {
    limit: [2150000, 3400000],
    rates: [
      [61625, 53602, 33484, 17999, 6607],
      [67788, 58962, 36832, 19799, 7268],
      [73950, 64322, 40181, 21599, 7928],
    ],
  },
  "3500": {
    limit: [3400000, 5000000],
    rates: [
      [93852, 84454, 50847, 25385, 9310],
      [103237, 92899, 55932, 27924, 10241],
      [112622, 101345, 61017, 30462, 11172],
    ],
  },
  "4000": {
    limit: [5000000, 8000000],
    rates: [
      [147575, 127404, 75020, 33484, 13332],
      [162333, 140144, 82522, 36832, 14665],
      [177090, 152885, 90024, 40181, 15998],
    ],
  },
  "4001": {
    limit: [8000000, 15000000],
    rates: [
      [241620, 181202, 107243, 48202, 18697],
      [265782, 199322, 117967, 53022, 20567],
      [289944, 217442, 128692, 57842, 22437],
    ],
  },
};

const ENGINE_RANGES = [
  { key: "1300", label: "1300 cc ve altı" },
  { key: "1600", label: "1301 - 1600 cc" },
  { key: "1800", label: "1601 - 1800 cc" },
  { key: "2000", label: "1801 - 2000 cc" },
  { key: "2500", label: "2001 - 2500 cc" },
  { key: "3000", label: "2501 - 3000 cc" },
  { key: "3500", label: "3001 - 3500 cc" },
  { key: "4000", label: "3501 - 4000 cc" },
  { key: "4001", label: "4001 cc ve üzeri" },
];

const AGE_GROUPS = [
  { key: 0, label: "1 - 3 Yaş" },
  { key: 1, label: "4 - 6 Yaş" },
  { key: 2, label: "7 - 11 Yaş" },
  { key: 3, label: "12 - 15 Yaş" },
  { key: 4, label: "16 Yaş ve Üzeri" },
];

const AC = "#7C3AED";
const AC_L = "rgba(124,58,237,0.08)";
const AC_B = "rgba(124,58,237,0.25)";
const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px", marginBottom: "16px" };
const secT: React.CSSProperties = { fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" };

export default function MtvHesaplamaSection() {
  const [tescilSonrasi, setTescilSonrasi] = useState(true); // true = 2018 sonrası
  const [engineKey, setEngineKey] = useState("1600");
  const [ageIndex, setAgeIndex] = useState(0);
  const [tasitDeger, setTasitDeger] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const result = useMemo(() => {
    if (!tescilSonrasi) {
      // 2018 öncesi — doğrudan tablo
      const row = PRE_2018[engineKey];
      if (!row) return null;
      const yillik = row[ageIndex];
      return { yillik, taksit: yillik / 2, matrahInfo: null };
    }

    // 2018 sonrası — matrah bazlı
    const data = POST_2018[engineKey];
    if (!data) return null;
    const deger = parseN(tasitDeger);

    let tier = 0; // düşük matrah
    let matrahInfo = `${fmt(0)} - ${fmt(data.limit[0])} ₺ arası (Düşük Matrah)`;
    if (deger > data.limit[1]) {
      tier = 2;
      matrahInfo = `${fmt(data.limit[1])} ₺ üzeri (Yüksek Matrah)`;
    } else if (deger > data.limit[0]) {
      tier = 1;
      matrahInfo = `${fmt(data.limit[0])} - ${fmt(data.limit[1])} ₺ arası (Orta Matrah)`;
    }

    const yillik = data.rates[tier][ageIndex];
    return { yillik, taksit: yillik / 2, matrahInfo };
  }, [tescilSonrasi, engineKey, ageIndex, tasitDeger]);

  const faqs = [
    { q: "MTV ne zaman ödenir?", a: "MTV her yıl Ocak ve Temmuz aylarında iki eşit taksitte ödenir. Ocak ayında yılın ilk yarısının vergisi, Temmuz ayında ikinci yarısının vergisi tahsil edilir." },
    { q: "Araç yaşı nasıl hesaplanır?", a: "Araç yaşı, aracın model yılı ile içinde bulunulan yılın farkı üzerinden hesaplanır. Örneğin 2024 model bir araç, 2026 yılında 2 yaşında sayılır (1-3 yaş grubunda)." },
    { q: "Taşıt değeri (matrah) nedir?", a: "1 Ocak 2018'den sonra tescil edilen araçlar için kasko değer listesindeki vergisiz fiyat esas alınır. Aracın kasko değeri arttıkça MTV tutarı yükselebilir." },
    { q: "Elektrikli araçlarda MTV nasıl hesaplanır?", a: "Elektrikli araçlar için MTV, benzer güçteki içten yanmalı motorlu araçlara göre daha düşük uygulanmaktadır. Motor hacmi yerine motor gücü (kW) baz alınır." },
    { q: "MTV ödemezsem ne olur?", a: "Süresinde ödenmeyen MTV'ye gecikme zammı uygulanır. Ayrıca aracın satışı veya devri yapılamaz, araç muayenesi geçilemez." },
  ];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #5B21B6, #7C3AED, #A78BFA)", borderRadius: "20px", padding: "28px", marginBottom: "24px", display: "flex", alignItems: "flex-start", gap: "16px", boxShadow: "0 10px 40px rgba(124,58,237,0.3)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", filter: "blur(30px)" }} />
        <div style={{ position: "absolute", bottom: "-20px", left: "30%", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", filter: "blur(20px)" }} />
        <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(255,255,255,0.3)" }}>
          <Banknote size={28} color="white" />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "white", marginBottom: "8px" }}>MTV Hesaplayıcı 2026</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)", lineHeight: "1.6", margin: 0 }}>
            Aracınızın motor hacmi, yaşı ve tescil tarihine göre <strong style={{ color: "#FDE68A" }}>Motorlu Taşıtlar Vergisi</strong> tutarını hesaplayın.
          </p>
        </div>
      </div>

      {/* Tescil Tarihi */}
      <div style={card}>
        <div style={secT}><Calendar size={13} color={AC} /> Tescil Dönemi</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { val: true, label: "2018 Sonrası", desc: "01.01.2018 ve sonrası tescil", icon: "🆕" },
            { val: false, label: "2018 Öncesi", desc: "31.12.2017 ve öncesi tescil", icon: "📋" },
          ].map(opt => {
            const active = tescilSonrasi === opt.val;
            return (
              <button key={String(opt.val)} onClick={() => setTescilSonrasi(opt.val)} style={{
                padding: "16px", borderRadius: "14px", cursor: "pointer", textAlign: "left",
                border: `2px solid ${active ? AC : "var(--card-border)"}`,
                background: active ? AC_L : "var(--secondary)",
                transition: "all 0.2s",
              }}>
                <div style={{ fontSize: "20px", marginBottom: "6px" }}>{opt.icon}</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: active ? AC : "var(--foreground)", marginBottom: "2px" }}>{opt.label}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Motor Silindir Hacmi */}
      <div style={card}>
        <div style={secT}><Car size={13} color={AC} /> Motor Silindir Hacmi</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {ENGINE_RANGES.map(e => {
            const active = engineKey === e.key;
            return (
              <button key={e.key} onClick={() => setEngineKey(e.key)} style={{
                padding: "12px", borderRadius: "12px", cursor: "pointer", textAlign: "center",
                border: `2px solid ${active ? AC : "var(--card-border)"}`,
                background: active ? AC_L : "var(--secondary)",
                transition: "all 0.2s",
              }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: active ? AC : "var(--foreground)" }}>{e.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Araç Yaşı */}
      <div style={card}>
        <div style={secT}><Calendar size={13} color={AC} /> Araç Yaşı</div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {AGE_GROUPS.map(a => {
            const active = ageIndex === a.key;
            return (
              <button key={a.key} onClick={() => setAgeIndex(a.key)} style={{
                padding: "10px 18px", borderRadius: "10px", cursor: "pointer",
                border: `2px solid ${active ? AC : "var(--card-border)"}`,
                background: active ? AC_L : "var(--secondary)",
                fontWeight: "700", fontSize: "13px",
                color: active ? AC : "var(--foreground)",
                transition: "all 0.2s", flex: "1", minWidth: "120px", textAlign: "center",
              }}>
                {a.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Taşıt Değeri (sadece 2018 sonrası) */}
      {tescilSonrasi && (
        <div style={card}>
          <div style={secT}><Banknote size={13} color={AC} /> Taşıt Değeri (Matrah)</div>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px", lineHeight: "1.6" }}>
            Aracınızın kasko değer listesindeki vergisiz fiyatını girin. Matrah dilimine göre vergi tutarı değişir. Boş bırakırsanız en düşük matrah dilimi uygulanır.
          </p>
          <input
            type="text"
            value={tasitDeger}
            onChange={e => setTasitDeger(fmtI(e.target.value))}
            placeholder="Örn: 850.000"
            style={{
              width: "100%", padding: "14px 16px", borderRadius: "12px",
              border: `1px solid var(--card-border)`, background: "var(--background)",
              color: "var(--foreground)", fontSize: "18px", fontWeight: "700",
              outline: "none", boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
            {["200.000", "400.000", "700.000", "1.000.000", "2.000.000", "5.000.000"].map(v => (
              <button key={v} onClick={() => setTasitDeger(v)} style={{
                padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
                border: `1px solid ${tasitDeger === v ? AC : "var(--card-border)"}`,
                background: tasitDeger === v ? AC_L : "transparent",
                color: tasitDeger === v ? AC : "var(--text-muted)",
              }}>{v} ₺</button>
            ))}
          </div>
        </div>
      )}

      {/* SONUÇLAR */}
      {result && (
        <div style={{ ...card, border: `2px solid ${AC_B}`, background: AC_L, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: `linear-gradient(90deg, #5B21B6, #7C3AED, #A78BFA)` }} />

          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", marginBottom: "20px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Banknote size={20} color={AC} /> MTV Hesaplama Sonucu
          </h3>

          {/* Ana sonuç */}
          <div style={{ padding: "24px", background: "var(--card-bg)", borderRadius: "14px", border: "1px solid var(--card-border)", textAlign: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              2026 Yıllık MTV Tutarı
            </div>
            <div style={{ fontSize: "42px", fontWeight: "900", color: AC, lineHeight: 1 }}>
              {fmt(result.yillik)}<span style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-muted)", marginLeft: "4px" }}>TL</span>
            </div>
          </div>

          {/* Taksit detay */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
            {[
              ["Ocak Taksiti", `${fmtD(result.taksit)} ₺`],
              ["Temmuz Taksiti", `${fmtD(result.taksit)} ₺`],
            ].map(([l, v]) => (
              <div key={l} style={{ padding: "16px", background: "var(--card-bg)", borderRadius: "12px", border: "1px solid var(--card-border)", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px" }}>{l}</div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: AC }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Matrah bilgisi */}
          {result.matrahInfo && (
            <div style={{ padding: "14px", background: "rgba(124,58,237,0.12)", borderRadius: "10px", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <Info size={18} color={AC} />
              <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: "600" }}>
                Matrah Dilimi: <strong style={{ color: AC }}>{result.matrahInfo}</strong>
              </span>
            </div>
          )}

          {/* Araç bilgileri */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {[
              ["Tescil", tescilSonrasi ? "2018 Sonrası" : "2018 Öncesi"],
              ["Motor Hacmi", ENGINE_RANGES.find(e => e.key === engineKey)?.label || ""],
              ["Araç Yaşı", AGE_GROUPS[ageIndex]?.label || ""],
            ].map(([l, v]) => (
              <div key={l} style={{ padding: "12px", background: "var(--card-bg)", borderRadius: "10px", border: "1px solid var(--card-border)", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "4px", textTransform: "uppercase" }}>{l}</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>{v}</div>
              </div>
            ))}
          </div>

          {/* GİB Link */}
          <a href="https://ivd.gib.gov.tr/" target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            marginTop: "16px", padding: "14px", background: AC, color: "white",
            borderRadius: "12px", textDecoration: "none", fontWeight: "700", fontSize: "14px",
            boxShadow: "0 4px 15px rgba(124,58,237,0.3)", transition: "opacity 0.2s",
          }}>
            <ExternalLink size={18} /> GİB İnteraktif Vergi Dairesi&apos;nden Sorgula
          </a>
        </div>
      )}

      {/* SSS */}
      <div style={{ marginTop: "8px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <HelpCircle size={20} color={AC} /> Sıkça Sorulan Sorular
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
      <div style={{ marginTop: "16px", background: "rgba(124,58,237,0.06)", border: `1px solid ${AC_B}`, borderRadius: "14px", padding: "16px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <Info size={18} color={AC} style={{ flexShrink: 0, marginTop: "2px" }} />
        <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
          Bu hesaplama 2026 yılı güncel MTV tarifelerine dayanmaktadır. Kesin vergi tutarı için <strong>Gelir İdaresi Başkanlığı</strong> İnteraktif Vergi Dairesi üzerinden sorgulama yapmanız önerilir. Elektrikli araçlar için farklı tarife uygulanmaktadır.
        </p>
      </div>
    </div>
  );
}
