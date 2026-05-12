"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fuel, MapPin, ArrowRightLeft, Search, Navigation, ChevronDown, X, Info, ChevronRight, RefreshCw, Clock, Map as MapIcon, Calculator, CreditCard, Wallet, FileText, Banknote, Shield, Zap, Activity, Circle, Wrench, BadgePercent, TrendingUp, LineChart, Printer, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import citiesRaw from "@/data/cities.json";
import districtCoordsRaw from "@/data/district-coords.json";
import KrediKartiAracSection from "@/app/kutuphane/kredi-karti-arac-section";
import AracAlimHesapSection from "@/app/kutuphane/arac-alim-hesap-section";
import DijitalSenetHesapSection from "@/app/kutuphane/dijital-senet-hesap-section";
import MtvHesaplamaSection from "@/app/kutuphane/mtv-hesaplama-section";
import KaskoDegerSection from "@/app/kutuphane/kasko-deger-section";
import EvMaliyetSection from "@/app/kutuphane/ev-maliyet-section";
import DegerKaybiSection from "@/app/kutuphane/deger-kaybi-section";
import TasitKredisiSection from "@/app/kutuphane/tasit-kredisi-section";
import AracBakimSection from "@/app/kutuphane/arac-bakim-section";
import LastikEbatSection from "@/app/kutuphane/lastik-ebat-section";
import OtvMuafiyetSection from "@/app/kutuphane/otv-muafiyet-section";
import AlSatKarMarjiSection from "@/app/kutuphane/al-sat-karmarji-section";
import YatirimKiyaslamaSection from "@/app/kutuphane/yatirim-kiyaslama-section";
import AracIthalatSection from "@/app/kutuphane/arac-ithalat-section";

const RouteMap = dynamic(() => import("@/components/RouteMap"), { ssr: false });

/* ═══════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════ */

type CitiesData = Record<string, Record<string, string[]>>;
const citiesData = citiesRaw as CitiesData;
const districtCoords = districtCoordsRaw as unknown as Record<string, Record<string, [number, number]>>;

/* ── Accent ── */
const AC = "#2563EB";
const AC_L = "rgba(37,99,235,0.08)";
const AC_B = "rgba(37,99,235,0.20)";
const AC_BG = "rgba(37,99,235,0.04)";

/* ── Fuel types & prices (cetvel) ── */
const DEFAULT_FUEL_TYPES = [
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

function getDistrictCoords(province: string, district: string): [number, number] | null {
  const prov = districtCoords[norm(province)];
  if (!prov) return null;
  return prov[norm(district)] || null;
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
function LocationSelector({ label, il, ilce, mahalle, onIl, onIlce, onMahalle, excludeIlce }: {
  label: string; il: string; ilce: string; mahalle: string;
  onIl: (v: string) => void; onIlce: (v: string) => void; onMahalle: (v: string) => void;
  excludeIlce?: string;
}) {
  const provinces = useMemo(() => {
    return Object.keys(citiesData).sort((a, b) => a.localeCompare(b, "tr"));
  }, []);

  const districts = useMemo(() => {
    if (!il || !citiesData[il]) return [];
    return Object.keys(citiesData[il]).filter(d => d !== excludeIlce).sort((a, b) => a.localeCompare(b, "tr"));
  }, [il, excludeIlce]);

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
export default function OtoHesapClient({ activeModule }: { activeModule: string }) {
  const { user } = useAuth();
  const [fromIl, setFromIl] = useState("");
  const [fromIlce, setFromIlce] = useState("");
  const [fromMah, setFromMah] = useState("");
  const [toIl, setToIl] = useState("");
  const [toIlce, setToIlce] = useState("");
  const [toMah, setToMah] = useState("");
  const [yakit, setYakit] = useState("benzin");
  const [tuketim, setTuketim] = useState(7.5);
  const [gidisDon, setGidisDon] = useState(false);
  const [fuelTypes, setFuelTypes] = useState(DEFAULT_FUEL_TYPES);
  const [fuelDataCity, setFuelDataCity] = useState("");
  const [fuelUpdateTime, setFuelUpdateTime] = useState("");
  const [allDistrictPrices, setAllDistrictPrices] = useState<any[]>([]);
  const [fuelLoading, setFuelLoading] = useState(false);

  const parsePrice = useCallback((p: any): number | null => {
      if (!p) return null;
      const parsed = parseFloat(p.toString().replace(',', '.'));
      return isNaN(parsed) ? null : parsed;
  }, []);

  const applyPricesFromFiyatlar = useCallback((f: any) => {
      if (!f) return;
      setFuelTypes([
          { key: "benzin", label: "Benzin", price: parsePrice(f.benzin_95?.fiyat) || 42.50 },
          { key: "dizel", label: "Dizel", price: parsePrice(f.motorin?.fiyat) || 40.80 },
          { key: "lpg", label: "LPG", price: parsePrice(f.lpg_otogaz?.fiyat) || 21.00 },
      ]);
  }, [parsePrice]);

  // Ana sayfa cetveli ile aynı kaynaktan şehre göre fiyat çek
  useEffect(() => {
    // Şehir önceliği: 1) Seçilen kalkış ili, 2) Kullanıcı profili, 3) localStorage, 4) İstanbul
    const localCity = typeof window !== 'undefined' ? localStorage.getItem('oto_user_city') : null;
    const rawCity = fromIl || user?.city || localCity || 'İstanbul';
    const citySlug = rawCity.replace(/İ/g, 'i').replace(/I/g, 'i')
      .toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
      .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
      .replace(/â/g,'a').replace(/î/g,'i').replace(/û/g,'u').replace(/\s+/g,'');

    setFuelLoading(true);
    fetch(`/api/fiyatlar/${citySlug}`)
        .then(res => res.json())
        .then(data => {
            if (!data.veriler || data.veriler.length === 0) return;
            setAllDistrictPrices(data.veriler);
            setFuelDataCity(data.sehir || rawCity);
            setFuelUpdateTime(data.tarih || new Date().toLocaleString('tr-TR'));

            // İlçe seçiliyse o ilçenin fiyatını bul, yoksa ilk ilçeyi kullan
            let match = data.veriler[0];
            if (fromIlce) {
                const ilceNorm = norm(fromIlce);
                const found = data.veriler.find((v: any) => norm(v.ilce) === ilceNorm);
                if (found) match = found;
            }
            applyPricesFromFiyatlar(match.fiyatlar);
        })
        .catch(err => console.warn('Yakıt API hatası:', err))
        .finally(() => setFuelLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromIl, user?.city]);

  // İlçe değiştiğinde mevcut veri içinden doğru ilçeyi seç
  useEffect(() => {
    if (!fromIlce || allDistrictPrices.length === 0) return;
    const ilceNorm = norm(fromIlce);
    const found = allDistrictPrices.find((v: any) => norm(v.ilce) === ilceNorm);
    if (found) applyPricesFromFiyatlar(found.fiyatlar);
  }, [fromIlce, allDistrictPrices, applyPricesFromFiyatlar]);

  const handleFuel = (k: string) => { setYakit(k); setTuketim(DEF_CONS[k]); };
  const swap = () => {
    const [a,b,c] = [fromIl, fromIlce, fromMah];
    setFromIl(toIl); setFromIlce(toIlce); setFromMah(toMah);
    setToIl(a); setToIlce(b); setToMah(c);
  };

  // OSRM gerçek yol mesafesi + rota geometrisi
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<[number,number][]>([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeFromCoord, setRouteFromCoord] = useState<[number,number] | null>(null);
  const [routeToCoord, setRouteToCoord] = useState<[number,number] | null>(null);

  useEffect(() => {
    if (!fromIl || !toIl) { setRouteDistance(null); setRouteGeometry([]); return; }
    
    let c1: [number,number] | null = null;
    let c2: [number,number] | null = null;
    
    if (fromIl === toIl) {
        if (!fromIlce || !toIlce || fromIlce === toIlce) { setRouteDistance(null); setRouteGeometry([]); return; }
        c1 = getDistrictCoords(fromIl, fromIlce);
        c2 = getDistrictCoords(toIl, toIlce);
    } else {
        if (fromIlce) c1 = getDistrictCoords(fromIl, fromIlce);
        if (!c1) c1 = getCoords(fromIl);
        if (toIlce) c2 = getDistrictCoords(toIl, toIlce);
        if (!c2) c2 = getCoords(toIl);
    }
    
    if (!c1 || !c2) { setRouteDistance(null); setRouteGeometry([]); return; }
    
    setRouteFromCoord(c1);
    setRouteToCoord(c2);
    setRouteLoading(true);
    
    // OSRM ücretsiz API — gerçek karayolu mesafesi
    fetch(`https://router.project-osrm.org/route/v1/driving/${c1[1]},${c1[0]};${c2[1]},${c2[0]}?overview=full&geometries=geojson`)
        .then(r => r.json())
        .then(data => {
            if (data.routes && data.routes[0]) {
                const route = data.routes[0];
                const distKm = Math.round(route.distance / 1000);
                setRouteDistance(distKm);
                // GeoJSON coords [lon,lat] -> Leaflet [lat,lon]
                const coords: [number,number][] = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
                setRouteGeometry(coords);
            } else {
                // Fallback: Haversine
                setRouteDistance(roadKm(c1!, c2!));
                setRouteGeometry([]);
            }
        })
        .catch(() => {
            setRouteDistance(roadKm(c1!, c2!));
            setRouteGeometry([]);
        })
        .finally(() => setRouteLoading(false));
  }, [fromIl, toIl, fromIlce, toIlce]);

  const results = useMemo(() => {
    if (!routeDistance || routeDistance <= 0) return null;
    const tek = routeDistance;
    const total = gidisDon ? tek * 2 : tek;
    const fuel = fuelTypes.find(f => f.key === yakit)!;
    const lt = (total * tuketim) / 100;
    const cost = lt * fuel.price;
    const perKm = (tuketim / 100) * fuel.price;
    return { tek, total, lt, cost, perKm, price: fuel.price };
  }, [routeDistance, yakit, tuketim, gidisDon, fuelTypes]);

  const curFuel = fuelTypes.find(f => f.key === yakit) || fuelTypes[0];

  const fromLabel = [fromIl && fmt(fromIl), fromIlce && fmt(fromIlce), fromMah && fmt(fromMah)].filter(Boolean).join(", ");
  const toLabel = [toIl && fmt(toIl), toIlce && fmt(toIlce), toMah && fmt(toMah)].filter(Boolean).join(", ");

  const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" };
  const secTitle: React.CSSProperties = { fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" };

  const TOOLS = [
    { key: 'yakit-hesaplama' as const, label: 'Yakıt Hesaplama', desc: 'Şehirler arası yakıt maliyeti', icon: Fuel, color: '#2563EB', href: '/yakit-hesaplama' },
    { key: 'yatirim-kiyaslama' as const, label: 'Yatırım Kıyasla', desc: 'Araç, Dolar, Altın Analizi', icon: LineChart, color: '#EAB308', href: '/yakit-hesaplama/yatirim-kiyaslama' },
    { key: 'al-sat-analizi' as const, label: 'Al-Sat Analizi', desc: 'Galeri kâr ve yatırım hesabı', icon: TrendingUp, color: '#F97316', href: '/yakit-hesaplama/al-sat-analizi' },
    { key: 'otv-muafiyeti' as const, label: 'ÖTV Muafiyeti', desc: 'Engelli araç indirimi', icon: BadgePercent, color: '#8B5CF6', href: '/yakit-hesaplama/otv-muafiyeti' },
    { key: 'deger-kaybi' as const, label: 'Değer Kaybı', desc: 'Kaza sonrası değer kaybı', icon: Activity, color: '#F59E0B', href: '/yakit-hesaplama/deger-kaybi' },
    { key: 'tasit-kredisi' as const, label: 'Taşıt Kredisi', desc: 'Aylık taksit ve faiz hesabı', icon: Banknote, color: '#10B981', href: '/yakit-hesaplama/tasit-kredisi' },
    { key: 'arac-bakim' as const, label: 'Bakım Maliyeti', desc: 'Periyodik servis ücreti', icon: Wrench, color: '#6366F1', href: '/yakit-hesaplama/arac-bakim' },
    { key: 'lastik-ebat' as const, label: 'Lastik Ebat', desc: 'Çap ve hız sapması hesabı', icon: Circle, color: '#EC4899', href: '/yakit-hesaplama/lastik-ebat' },
    { key: 'kredi-karti-hesaplama' as const, label: 'Kredi Kartı', desc: 'Komisyon ve taksit hesaplama', icon: CreditCard, color: '#7C3AED', href: '/yakit-hesaplama/kredi-karti-hesaplama' },
    { key: 'butce-planlama' as const, label: 'Bütçe Planla', desc: 'Nakit, kredi, ek giderler', icon: Wallet, color: '#059669', href: '/yakit-hesaplama/butce-planlama' },
    { key: 'dijital-senet-hesaplama' as const, label: 'Dijital Senet', desc: 'Reel faiz ve maliyet analizi', icon: FileText, color: '#DC2626', href: '/yakit-hesaplama/dijital-senet-hesaplama' },
    { key: 'mtv-hesaplama' as const, label: 'MTV Hesaplama', desc: '2026 Motorlu Taşıtlar Vergisi', icon: Banknote, color: '#7C3AED', href: '/yakit-hesaplama/mtv-hesaplama' },
    { key: 'kasko-deger-sorgulama' as const, label: 'Kasko Değer', desc: 'TSB kasko bedeli sorgulama', icon: Shield, color: '#0EA5E9', href: '/yakit-hesaplama/kasko-deger-sorgulama' },
    { key: 'elektrikli-arac-sarj-maliyeti' as const, label: 'Elektrikli Araç', desc: 'Şarj maliyeti ve karşılaştırma', icon: Zap, color: '#10B981', href: '/yakit-hesaplama/elektrikli-arac-sarj-maliyeti' },
    { key: 'arac-ithalat-vergisi' as const, label: 'Yurtdışı İthalat', desc: 'Gümrük ve ÖTV maliyeti', icon: MapIcon, color: '#0EA5E9', href: '/yakit-hesaplama/arac-ithalat-vergisi' },
  ];

  return (
    <div>
      <Navbar />

      <main style={{ minHeight: "100vh", background: "var(--background)" }}>
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            .no-print, nav, footer { display: none !important; }
            body { background: white !important; color: black !important; }
            main { padding: 0 !important; background: white !important; }
          }
        `}} />
        {/* Premium Hero */}
        <div className="no-print" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #2563EB 100%)', padding: "48px 24px 44px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%, rgba(37,99,235,0.3) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 80%, rgba(124,58,237,0.2) 0%, transparent 50%)" }} />
          <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "20px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", marginBottom: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
              <Calculator size={32} color="white" />
            </div>
            <h1 style={{ fontSize: "34px", fontWeight: "900", color: "white", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
              OtoHesap
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", margin: "0 0 24px 0", lineHeight: "1.6" }}>
              Türkiye&apos;nin en kapsamlı otomotiv hesaplama platformu
            </p>
            {/* Quick stat badges */}
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              {[["7 Hesaplayıcı", "🧮"], ["2026 Güncel", "📅"], ["Ücretsiz", "✨"]].map(([t, i]) => (
                <span key={t} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "6px" }}>
                  {i} {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tool Cards Hub */}
        <div className="no-print" style={{ maxWidth: "900px", margin: "-24px auto 0", padding: "0 20px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            {TOOLS.map(tool => {
              const Icon = tool.icon;
              const active = activeModule === tool.key;
              return (
                <Link key={tool.key} href={`/otohesap/${tool.key}`}
                  style={{
                    padding: "18px 16px", borderRadius: "16px", cursor: "pointer", textAlign: "left", textDecoration: "none",
                    background: active ? "var(--card-bg)" : "var(--card-bg)",
                    border: `2px solid ${active ? tool.color : "var(--card-border)"}`,
                    boxShadow: active ? `0 4px 20px ${tool.color}25` : "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "all 0.25s ease", display: "flex", alignItems: "flex-start", gap: "12px",
                    transform: active ? "translateY(-2px)" : "none",
                  }}
                  onMouseEnter={e => { if(!active) { e.currentTarget.style.borderColor = tool.color; e.currentTarget.style.transform = "translateY(-2px)"; }}}
                  onMouseLeave={e => { if(!active) { e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.transform = "none"; }}}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${tool.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={20} color={tool.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: active ? tool.color : "var(--foreground)", marginBottom: "2px" }}>{tool.label}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.4" }}>{tool.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="no-print" style={{ maxWidth: "720px", margin: "20px auto 0", display: "flex", justifyContent: "flex-end", gap: "10px", padding: "0 20px" }}>
          <button onClick={() => window.print()} style={{ padding: "10px 16px", borderRadius: "10px", background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = "var(--text-muted)"} onMouseOut={e => e.currentTarget.style.borderColor = "var(--card-border)"}>
            <Printer size={16} /> PDF / Yazdır
          </button>
          <button onClick={() => {
            const activeTool = TOOLS.find(t => t.key === activeModule);
            const text = `OtoSöz'de ücretsiz "${activeTool?.label}" aracını kullanarak kendi hesaplamamı yaptım! Sen de hemen dene: https://www.otosoz.com/otohesap/${activeModule}`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
          }} style={{ padding: "10px 16px", borderRadius: "10px", background: "#25D366", border: "none", color: "white", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
            <MessageCircle size={16} /> WhatsApp'ta Paylaş
          </button>
        </div>

        {/* Content */}
        {activeModule === 'yakit-hesaplama' && (
        <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px", position: "relative", zIndex: 1 }}>

          {/* ── Route ── */}
          <div style={{ ...card, marginBottom: "16px" }}>
            <div style={secTitle}><Navigation size={13} color={AC} /> {"Güzergah"}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "12px", alignItems: "start" }}>
              <LocationSelector label="Nereden" il={fromIl} ilce={fromIlce} mahalle={fromMah}
                onIl={setFromIl} onIlce={setFromIlce} onMahalle={setFromMah} excludeIlce={fromIl === toIl ? toIlce : undefined} />

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
                onIl={setToIl} onIlce={setToIlce} onMahalle={setToMah} excludeIlce={fromIl === toIl ? fromIlce : undefined} />
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={secTitle}><Fuel size={13} color={AC} /> {"Yakıt Türü & Fiyat Cetveli"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {fuelLoading && <RefreshCw size={12} color={AC} style={{ animation: "spin 1s linear infinite" }} />}
                {fuelDataCity && (
                  <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "6px", background: AC_L, color: AC, border: `1px solid ${AC_B}` }}>
                    📍 {fuelDataCity}
                  </span>
                )}
                {fuelUpdateTime && (
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={10} /> {fuelUpdateTime}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {fuelTypes.map(f => {
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
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
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

              {/* Harita */}
              {routeFromCoord && routeToCoord && (
                <div style={{ marginTop: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <MapIcon size={13} color={AC} />
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Güzergah Haritası</span>
                  </div>
                  <RouteMap from={routeFromCoord} to={routeToCoord} routeGeometry={routeGeometry} />
                </div>
              )}

              {/* Info */}
              <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: "var(--card-bg)", borderRadius: "8px", border: "1px solid var(--card-border)" }}>
                <Info size={13} color="var(--text-muted)" />
                <span style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--foreground)" }}>{curFuel.label}</strong> fiyatı <strong style={{ color: AC }}>{curFuel.price.toFixed(2)} TL/lt</strong>
                  {fuelDataCity ? ` (${fuelDataCity}${fromIlce ? ` / ${fmt(fromIlce)}` : ""})` : ""}
                  {" • Karayolu mesafesi OSRM verileri ile hesaplanmıştır."}
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
        )}

        {/* Kredi Kartı Tab */}
        {activeModule === 'kredi-karti-hesaplama' && (
          <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <KrediKartiAracSection />
          </div>
        )}

        {/* Bütçe Planla Tab */}
        {activeModule === 'butce-planlama' && (
          <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <AracAlimHesapSection />
          </div>
        )}

        {/* Dijital Senet Tab */}
        {activeModule === 'dijital-senet-hesaplama' && (
          <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <DijitalSenetHesapSection />
          </div>
        )}

        {/* MTV Hesaplama Tab */}
        {activeModule === 'mtv-hesaplama' && (
          <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <MtvHesaplamaSection />
          </div>
        )}

        {/* Kasko Değer Tab */}
        {activeModule === 'kasko-deger-sorgulama' && (
          <div style={{ maxWidth: "900px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <KaskoDegerSection />
          </div>
        )}

        {/* Elektrikli Araç Tab */}
        {activeModule === 'elektrikli-arac-sarj-maliyeti' && (
          <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <EvMaliyetSection />
          </div>
        )}

        {/* Değer Kaybı Tab */}
        {activeModule === 'deger-kaybi' && (
          <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <DegerKaybiSection />
          </div>
        )}

        {/* Taşıt Kredisi Tab */}
        {activeModule === 'tasit-kredisi' && (
          <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <TasitKredisiSection />
          </div>
        )}

        {/* Araç Bakım Tab */}
        {activeModule === 'arac-bakim' && (
          <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <AracBakimSection />
          </div>
        )}

        {/* Lastik Ebat Tab */}
        {activeModule === 'lastik-ebat' && (
          <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <LastikEbatSection />
          </div>
        )}

        {/* ÖTV Muafiyet Tab */}
        {activeModule === 'otv-muafiyeti' && (
          <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <OtvMuafiyetSection />
          </div>
        )}

        {/* Al-Sat Kâr Analizi Tab */}
        {activeModule === 'al-sat-analizi' && (
          <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <AlSatKarMarjiSection />
          </div>
        )}

        {/* Yatırım Kıyaslama Tab */}
        {activeModule === 'yatirim-kiyaslama' && (
          <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <YatirimKiyaslamaSection />
          </div>
        )}

        {/* Araç İthalat Vergisi Tab */}
        {activeModule === 'arac-ithalat-vergisi' && (
          <div style={{ maxWidth: "720px", margin: "20px auto 0", padding: "0 20px 60px" }}>
            <AracIthalatSection />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
