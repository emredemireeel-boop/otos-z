"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Fuel, MapPin, ArrowRightLeft, Search, Navigation, ChevronDown, X, Info, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import citiesRaw from "@/data/cities.json";

/* ═══════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════ */

type CitiesData = Record<string, Record<string, string[]>>;
const citiesData = citiesRaw as CitiesData;

/* ── Accent ── */
const AC = "#2563EB";
const AC_L = "rgba(37,99,235,0.08)";
const AC_B = "rgba(37,99,235,0.20)";
const AC_BG = "rgba(37,99,235,0.04)";

/* ── Fuel types & prices (cetvel) ── */
const FUEL_TYPES = [
  { key: "benzin", label: "Benzin", price: 42.50 },
  { key: "dizel", label: "Dizel", price: 40.80 },
  { key: "lpg", label: "LPG", price: 21.00 },
];
const DEF_CONS: Record<string, number> = { benzin: 7.5, dizel: 6.0, lpg: 10.0 };

/* ── Normalize for coord lookup ── */
function norm(s: string): string {
  return s.toUpperCase()
    .replace(/İ/g,"I").replace(/ı/g,"I")
    .replace(/\u011E/g,"G").replace(/\u011F/g,"G")
    .replace(/\u00DC/g,"U").replace(/\u00FC/g,"U")
    .replace(/\u015E/g,"S").replace(/\u015F/g,"S")
    .replace(/\u00D6/g,"O").replace(/\u00F6/g,"O")
    .replace(/\u00C7/g,"C").replace(/\u00E7/g,"C");
}

/* ── Province coordinates (81 il) ── */
const PC: Record<string, [number, number]> = {
  ADANA:[37,35.33],ADIYAMAN:[37.76,38.28],AFYONKARAHISAR:[38.74,30.54],
  AGRI:[39.72,43.05],AKSARAY:[38.37,34.03],AMASYA:[40.65,35.83],
  ANKARA:[39.93,32.86],ANTALYA:[36.88,30.71],ARDAHAN:[41.11,42.7],
  ARTVIN:[41.18,41.82],AYDIN:[37.85,27.85],BALIKESIR:[39.65,27.88],
  BARTIN:[41.63,32.34],BATMAN:[37.88,41.13],BAYBURT:[40.26,40.23],
  BILECIK:[40.05,30],BINGOL:[38.88,40.5],BITLIS:[38.4,42.11],
  BOLU:[40.73,31.61],BURDUR:[37.72,30.29],BURSA:[40.19,29.06],
  CANAKKALE:[40.15,26.41],CANKIRI:[40.6,33.62],CORUM:[40.55,34.96],
  DENIZLI:[37.78,29.09],DIYARBAKIR:[37.91,40.24],DUZCE:[40.84,31.17],
  EDIRNE:[41.67,26.56],ELAZIG:[38.67,39.22],ERZINCAN:[39.75,39.49],
  ERZURUM:[39.9,41.27],ESKISEHIR:[39.77,30.52],GAZIANTEP:[37.06,37.38],
  GIRESUN:[40.91,38.39],GUMUSHANE:[40.46,39.48],HAKKARI:[37.58,43.74],
  HATAY:[36.2,36.16],IGDIR:[39.92,44.05],ISPARTA:[37.76,30.56],
  ISTANBUL:[41.01,28.98],IZMIR:[38.42,27.13],KAHRAMANMARAS:[37.59,36.93],
  KARABUK:[41.2,32.62],KARAMAN:[37.18,33.23],KARS:[40.6,43.1],
  KASTAMONU:[41.38,33.78],KAYSERI:[38.73,35.48],KILIS:[36.72,37.12],
  KIRIKKALE:[39.85,33.51],KIRKLARELI:[41.74,27.23],KIRSEHIR:[39.15,34.17],
  KOCAELI:[40.76,29.92],KONYA:[37.87,32.48],KUTAHYA:[39.42,29.98],
  MALATYA:[38.35,38.32],MANISA:[38.61,27.43],MARDIN:[37.31,40.74],
  MERSIN:[36.8,34.63],MUGLA:[37.22,28.36],MUS:[38.74,41.49],
  NEVSEHIR:[38.62,34.72],NIGDE:[37.97,34.68],ORDU:[40.98,37.88],
  OSMANIYE:[37.07,36.25],RIZE:[41.02,40.52],SAKARYA:[40.69,30.4],
  SAMSUN:[41.29,36.33],SANLIURFA:[37.17,38.79],SIIRT:[37.93,41.94],
  SINOP:[42.03,35.15],SIRNAK:[37.42,42.46],SIVAS:[39.75,37.02],
  TEKIRDAG:[41,27.52],TOKAT:[40.31,36.55],TRABZON:[41,39.72],
  TUNCELI:[39.11,39.55],USAK:[38.67,29.41],VAN:[38.49,43.38],
  YALOVA:[40.66,29.27],YOZGAT:[39.82,34.8],ZONGULDAK:[41.45,31.79],
};

function getCoords(province: string): [number, number] | null {
  return PC[norm(province)] || null;
}

/* ── Haversine ── */
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371, dLat = ((lat2-lat1)*Math.PI)/180, dLon = ((lon2-lon1)*Math.PI)/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function roadKm(c1: [number,number], c2: [number,number]): number {
  return Math.round(haversine(c1[0],c1[1],c2[0],c2[1]) * 1.4);
}

/* ── Format display name ── */
function fmt(s: string): string {
  if (!s) return "";
  return s.split(/\s+/).filter(Boolean).map(w =>
    w.charAt(0).toLocaleUpperCase("tr") + w.slice(1).toLocaleLowerCase("tr")
  ).join(" ");
}

/* ═══════════════════════════════════════════
   SEARCHABLE DROPDOWN
   ═══════════════════════════════════════════ */
function Dropdown({ value, onChange, options, placeholder, disabled }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder: string; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const iRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!q) return options;
    const lq = q.toLocaleLowerCase("tr");
    return options.filter(o => o.toLocaleLowerCase("tr").includes(lq) || fmt(o).toLocaleLowerCase("tr").includes(lq));
  }, [q, options]);

  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQ(""); } }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(!open); if (!open) setTimeout(() => iRef.current?.focus(), 50); } }}
        style={{
          width: "100%", padding: "12px 14px", background: disabled ? "var(--secondary)" : "var(--secondary)",
          border: `1.5px solid ${open ? AC : "var(--card-border)"}`, borderRadius: "10px",
          color: value ? "var(--foreground)" : "var(--text-muted)", fontSize: "14px",
          fontWeight: value ? "600" : "400", cursor: disabled ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px",
          opacity: disabled ? 0.5 : 1, textAlign: "left", boxSizing: "border-box",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value ? fmt(value) : placeholder}
        </span>
        {value ? (
          <X size={14} color="var(--text-muted)" onClick={(e) => { e.stopPropagation(); onChange(""); setQ(""); }} style={{ cursor: "pointer", flexShrink: 0 }} />
        ) : (
          <ChevronDown size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        )}
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "var(--card-bg)", border: `1.5px solid ${AC_B}`, borderRadius: "10px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)", zIndex: 200, maxHeight: "240px",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--card-border)", display: "flex", alignItems: "center", gap: "6px" }}>
            <Search size={13} color="var(--text-muted)" />
            <input ref={iRef} type="text" value={q} onChange={e => setQ(e.target.value)}
              placeholder="Ara..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--foreground)", fontSize: "13px" }} />
          </div>
          <div style={{ overflowY: "auto", flex: 1, scrollbarWidth: "thin" }}>
            {filtered.length === 0 && <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px" }}>Sonuç bulunamadı</div>}
            {filtered.map(opt => (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); setQ(""); }}
                style={{
                  width: "100%", padding: "9px 14px", background: value === opt ? AC_L : "transparent",
                  border: "none", borderBottom: "1px solid var(--card-border)",
                  color: value === opt ? AC : "var(--foreground)", fontWeight: value === opt ? "600" : "400",
                  fontSize: "13px", cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={e => e.currentTarget.style.background = AC_L}
                onMouseLeave={e => e.currentTarget.style.background = value === opt ? AC_L : "transparent"}
              >{fmt(opt)}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   LOCATION SELECTOR (il > ilçe > mahalle)
   ═══════════════════════════════════════════ */
function LocationSelector({ label, il, ilce, mahalle, onIl, onIlce, onMahalle, excludeIl }: {
  label: string; il: string; ilce: string; mahalle: string;
  onIl: (v: string) => void; onIlce: (v: string) => void; onMahalle: (v: string) => void;
  excludeIl?: string;
}) {
  const provinces = useMemo(() => {
    return Object.keys(citiesData).filter(p => p !== excludeIl).sort((a, b) => a.localeCompare(b, "tr"));
  }, [excludeIl]);

  const districts = useMemo(() => {
    if (!il || !citiesData[il]) return [];
    return Object.keys(citiesData[il]).sort((a, b) => a.localeCompare(b, "tr"));
  }, [il]);

  const neighborhoods = useMemo(() => {
    if (!il || !ilce || !citiesData[il]?.[ilce]) return [];
    return citiesData[il][ilce].sort((a, b) => a.localeCompare(b, "tr"));
  }, [il, ilce]);

  return (
    <div>
      <label style={{ fontSize: "11px", fontWeight: "700", color: AC, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", display: "block" }}>
        {label}
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Dropdown value={il} onChange={v => { onIl(v); onIlce(""); onMahalle(""); }} options={provinces} placeholder="İl seçin" />
        {il && districts.length > 0 && (
          <Dropdown value={ilce} onChange={v => { onIlce(v); onMahalle(""); }} options={districts} placeholder="İlçe (opsiyonel)" />
        )}
        {ilce && neighborhoods.length > 0 && (
          <Dropdown value={mahalle} onChange={onMahalle} options={neighborhoods} placeholder="Mahalle (opsiyonel)" />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function YakitHesaplamaPage() {
  const [fromIl, setFromIl] = useState("");
  const [fromIlce, setFromIlce] = useState("");
  const [fromMah, setFromMah] = useState("");
  const [toIl, setToIl] = useState("");
  const [toIlce, setToIlce] = useState("");
  const [toMah, setToMah] = useState("");
  const [yakit, setYakit] = useState("benzin");
  const [tuketim, setTuketim] = useState(7.5);
  const [gidisDon, setGidisDon] = useState(false);

  const handleFuel = (k: string) => { setYakit(k); setTuketim(DEF_CONS[k]); };
  const swap = () => {
    const [a,b,c] = [fromIl, fromIlce, fromMah];
    setFromIl(toIl); setFromIlce(toIlce); setFromMah(toMah);
    setToIl(a); setToIlce(b); setToMah(c);
  };

  const results = useMemo(() => {
    if (!fromIl || !toIl) return null;
    const c1 = getCoords(fromIl), c2 = getCoords(toIl);
    if (!c1 || !c2) return null;
    const tek = roadKm(c1, c2);
    const total = gidisDon ? tek * 2 : tek;
    const fuel = FUEL_TYPES.find(f => f.key === yakit)!;
    const lt = (total * tuketim) / 100;
    const cost = lt * fuel.price;
    const perKm = (tuketim / 100) * fuel.price;
    return { tek, total, lt, cost, perKm, price: fuel.price };
  }, [fromIl, toIl, yakit, tuketim, gidisDon]);

  const curFuel = FUEL_TYPES.find(f => f.key === yakit)!;

  const fromLabel = [fromIl && fmt(fromIl), fromIlce && fmt(fromIlce), fromMah && fmt(fromMah)].filter(Boolean).join(", ");
  const toLabel = [toIl && fmt(toIl), toIlce && fmt(toIlce), toMah && fmt(toMah)].filter(Boolean).join(", ");

  const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" };
  const secTitle: React.CSSProperties = { fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" };

  return (
    <div>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--background)" }}>
        {/* Hero */}
        <div style={{ background: AC, padding: "40px 24px 36px", textAlign: "center" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", marginBottom: "16px" }}>
              <Fuel size={28} color="white" />
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: "900", color: "white", margin: "0 0 8px 0" }}>
              {"Yakıt Hesaplama"}
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", margin: 0 }}>
              {"Şehirler arası yakıt maliyetinizi hesaplayın \u2022 Güncel fiyatlar \u2022 Tüm iller"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: "720px", margin: "-24px auto 0", padding: "0 20px 60px", position: "relative", zIndex: 1 }}>

          {/* ── Route ── */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={secTitle}><Navigation size={13} color={AC} /> {"Güzergah"}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "12px", alignItems: "start" }}>
              <LocationSelector label="Nereden" il={fromIl} ilce={fromIlce} mahalle={fromMah}
                onIl={setFromIl} onIlce={setFromIlce} onMahalle={setFromMah} excludeIl={toIl} />

              <button onClick={swap} style={{
                width: "38px", height: "38px", borderRadius: "10px", border: `1.5px solid ${AC_B}`,
                background: AC_BG, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", marginTop: "28px", flexShrink: 0, transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = AC; const svg = e.currentTarget.querySelector("svg"); if(svg) (svg as any).style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.background = AC_BG; const svg = e.currentTarget.querySelector("svg"); if(svg) (svg as any).style.color = AC; }}
              >
                <ArrowRightLeft size={16} color={AC} />
              </button>

              <LocationSelector label="Nereye" il={toIl} ilce={toIlce} mahalle={toMah}
                onIl={setToIl} onIlce={setToIlce} onMahalle={setToMah} excludeIl={fromIl} />
            </div>

            {/* Round trip */}
            <div onClick={() => setGidisDon(!gidisDon)} style={{
              marginTop: "14px", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "11px 14px", background: gidisDon ? AC_L : "var(--secondary)",
              border: `1px solid ${gidisDon ? AC_B : "var(--card-border)"}`, borderRadius: "10px",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: gidisDon ? AC : "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px" }}>
                <ArrowRightLeft size={14} /> {"Gidiş - Dönüş"}
              </span>
              <div style={{ width: "36px", height: "20px", borderRadius: "10px", background: gidisDon ? AC : "var(--card-border)", position: "relative", transition: "background 0.2s" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: gidisDon ? "18px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </div>
            </div>
          </div>

          {/* ── Fuel Type ── */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={secTitle}><Fuel size={13} color={AC} /> {"Yakıt Türü & Fiyat Cetveli"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {FUEL_TYPES.map(f => {
                const on = yakit === f.key;
                return (
                  <button key={f.key} onClick={() => handleFuel(f.key)} style={{
                    padding: "14px 10px", borderRadius: "12px",
                    border: `2px solid ${on ? AC : "var(--card-border)"}`,
                    background: on ? AC_L : "var(--secondary)", cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: on ? AC : "var(--foreground)", marginBottom: "2px" }}>{f.label}</div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: on ? AC : "var(--text-muted)" }}>{f.price.toFixed(2)} TL/lt</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Consumption ── */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={secTitle}><Fuel size={13} color={AC} /> {"Ortalama Tüketim"}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <input type="range" min={3} max={25} step={0.5} value={tuketim} onChange={e => setTuketim(Number(e.target.value))}
                style={{ flex: 1, accentColor: AC, height: "6px", cursor: "pointer" }} />
              <div style={{ minWidth: "80px", padding: "8px 12px", background: AC_L, border: `1.5px solid ${AC_B}`, borderRadius: "10px", textAlign: "center" }}>
                <span style={{ fontSize: "17px", fontWeight: "800", color: AC }}>{tuketim.toFixed(1)}</span>
                <span style={{ fontSize: "10px", fontWeight: "600", color: "var(--text-muted)", marginLeft: "3px" }}>lt/100km</span>
              </div>
            </div>
            <div style={{ marginTop: "8px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {[5, 6, 7.5, 8, 10, 12, 15].map(v => (
                <button key={v} onClick={() => setTuketim(v)} style={{
                  padding: "4px 10px", borderRadius: "7px",
                  border: `1px solid ${tuketim === v ? AC : "var(--card-border)"}`,
                  background: tuketim === v ? AC_L : "transparent",
                  color: tuketim === v ? AC : "var(--text-muted)", fontSize: "11px", fontWeight: "600", cursor: "pointer",
                }}>{v}</button>
              ))}
            </div>
          </div>

          {/* ── Results ── */}
          {results && (
            <div style={{ ...card, border: `1.5px solid ${AC_B}`, background: AC_BG, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: AC }} />

              {/* Route label */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "18px", paddingTop: "4px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: AC }}>{fromLabel}</span>
                <ChevronRight size={14} color={AC} />
                <span style={{ fontSize: "13px", fontWeight: "700", color: AC }}>{toLabel}</span>
                {gidisDon && (
                  <span style={{ padding: "2px 8px", background: AC, color: "white", fontSize: "9px", fontWeight: "700", borderRadius: "5px", textTransform: "uppercase" }}>
                    {"Gidiş-Dönüş"}
                  </span>
                )}
              </div>

              {/* Cost */}
              <div style={{ textAlign: "center", padding: "22px", background: "var(--card-bg)", borderRadius: "14px", border: "1px solid var(--card-border)", marginBottom: "14px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                  {"Toplam Yakıt Maliyeti"}
                </div>
                <div style={{ fontSize: "44px", fontWeight: "900", color: AC, lineHeight: 1 }}>
                  {"\u20BA"}{results.cost.toFixed(0)}
                </div>
              </div>

              {/* Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {[
                  ["Toplam Mesafe", `${results.total.toLocaleString("tr-TR")}`, "km"],
                  ["Gerekli Yakıt", results.lt.toFixed(1), "litre"],
                  ["Km Başına", results.perKm.toFixed(2), "TL/km"],
                ].map(([l, v, u]) => (
                  <div key={l} style={{ padding: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "9px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{l}</div>
                    <div style={{ fontSize: "20px", fontWeight: "800", color: AC, lineHeight: 1 }}>
                      {v}<span style={{ fontSize: "10px", fontWeight: "600", color: "var(--text-muted)", marginLeft: "2px" }}>{u}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info */}
              <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: "var(--card-bg)", borderRadius: "8px", border: "1px solid var(--card-border)" }}>
                <Info size={13} color="var(--text-muted)" />
                <span style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--foreground)" }}>{curFuel.label}</strong> fiyatı <strong style={{ color: AC }}>{curFuel.price.toFixed(2)} TL/lt</strong> {"cetvelden alınmıştır. Mesafe tahminidir."}
                </span>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!results && (
            <div style={{ ...card, textAlign: "center", padding: "44px 24px", border: "1px dashed var(--card-border)", background: "transparent" }}>
              <MapPin size={36} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: "10px" }} />
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
                {"Kalkış ve varış şehrinizi seçerek yakıt maliyetinizi hesaplayın"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
