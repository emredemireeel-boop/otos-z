"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Fuel, MapPin, ArrowRightLeft, Search, Navigation, ChevronDown, X, ToggleLeft, ToggleRight, Info } from "lucide-react";

/* ─── 81 Turkish Provinces (lat, lng) ─── */
const CITIES: { name: string; lat: number; lng: number }[] = [
  { name: "Adana", lat: 37.00, lng: 35.33 },
  { name: "Adıyaman", lat: 37.76, lng: 38.28 },
  { name: "Afyonkarahisar", lat: 38.74, lng: 30.54 },
  { name: "Ağrı", lat: 39.72, lng: 43.05 },
  { name: "Aksaray", lat: 38.37, lng: 34.03 },
  { name: "Amasya", lat: 40.65, lng: 35.83 },
  { name: "Ankara", lat: 39.93, lng: 32.86 },
  { name: "Antalya", lat: 36.88, lng: 30.71 },
  { name: "Ardahan", lat: 41.11, lng: 42.70 },
  { name: "Artvin", lat: 41.18, lng: 41.82 },
  { name: "Aydın", lat: 37.85, lng: 27.85 },
  { name: "Balıkesir", lat: 39.65, lng: 27.88 },
  { name: "Bartın", lat: 41.63, lng: 32.34 },
  { name: "Batman", lat: 37.88, lng: 41.13 },
  { name: "Bayburt", lat: 40.26, lng: 40.23 },
  { name: "Bilecik", lat: 40.05, lng: 30.00 },
  { name: "Bingöl", lat: 38.88, lng: 40.50 },
  { name: "Bitlis", lat: 38.40, lng: 42.11 },
  { name: "Bolu", lat: 40.73, lng: 31.61 },
  { name: "Burdur", lat: 37.72, lng: 30.29 },
  { name: "Bursa", lat: 40.19, lng: 29.06 },
  { name: "Çanakkale", lat: 40.15, lng: 26.41 },
  { name: "Çankırı", lat: 40.60, lng: 33.62 },
  { name: "Çorum", lat: 40.55, lng: 34.96 },
  { name: "Denizli", lat: 37.78, lng: 29.09 },
  { name: "Diyarbakır", lat: 37.91, lng: 40.24 },
  { name: "Düzce", lat: 40.84, lng: 31.17 },
  { name: "Edirne", lat: 41.67, lng: 26.56 },
  { name: "Elazığ", lat: 38.67, lng: 39.22 },
  { name: "Erzincan", lat: 39.75, lng: 39.49 },
  { name: "Erzurum", lat: 39.90, lng: 41.27 },
  { name: "Eskişehir", lat: 39.77, lng: 30.52 },
  { name: "Gaziantep", lat: 37.06, lng: 37.38 },
  { name: "Giresun", lat: 40.91, lng: 38.39 },
  { name: "Gümüşhane", lat: 40.46, lng: 39.48 },
  { name: "Hakkari", lat: 37.58, lng: 43.74 },
  { name: "Hatay", lat: 36.20, lng: 36.16 },
  { name: "Iğdır", lat: 39.92, lng: 44.05 },
  { name: "Isparta", lat: 37.76, lng: 30.56 },
  { name: "İstanbul", lat: 41.01, lng: 28.98 },
  { name: "İzmir", lat: 38.42, lng: 27.13 },
  { name: "Kahramanmaraş", lat: 37.59, lng: 36.93 },
  { name: "Karabük", lat: 41.20, lng: 32.62 },
  { name: "Karaman", lat: 37.18, lng: 33.23 },
  { name: "Kars", lat: 40.60, lng: 43.10 },
  { name: "Kastamonu", lat: 41.38, lng: 33.78 },
  { name: "Kayseri", lat: 38.73, lng: 35.48 },
  { name: "Kilis", lat: 36.72, lng: 37.12 },
  { name: "Kırıkkale", lat: 39.85, lng: 33.51 },
  { name: "Kırklareli", lat: 41.74, lng: 27.23 },
  { name: "Kırşehir", lat: 39.15, lng: 34.17 },
  { name: "Kocaeli", lat: 40.76, lng: 29.92 },
  { name: "Konya", lat: 37.87, lng: 32.48 },
  { name: "Kütahya", lat: 39.42, lng: 29.98 },
  { name: "Malatya", lat: 38.35, lng: 38.32 },
  { name: "Manisa", lat: 38.61, lng: 27.43 },
  { name: "Mardin", lat: 37.31, lng: 40.74 },
  { name: "Mersin", lat: 36.80, lng: 34.63 },
  { name: "Muğla", lat: 37.22, lng: 28.36 },
  { name: "Muş", lat: 38.74, lng: 41.49 },
  { name: "Nevşehir", lat: 38.62, lng: 34.72 },
  { name: "Niğde", lat: 37.97, lng: 34.68 },
  { name: "Ordu", lat: 40.98, lng: 37.88 },
  { name: "Osmaniye", lat: 37.07, lng: 36.25 },
  { name: "Rize", lat: 41.02, lng: 40.52 },
  { name: "Sakarya", lat: 40.69, lng: 30.40 },
  { name: "Samsun", lat: 41.29, lng: 36.33 },
  { name: "Şanlıurfa", lat: 37.17, lng: 38.79 },
  { name: "Siirt", lat: 37.93, lng: 41.94 },
  { name: "Sinop", lat: 42.03, lng: 35.15 },
  { name: "Şırnak", lat: 37.42, lng: 42.46 },
  { name: "Sivas", lat: 39.75, lng: 37.02 },
  { name: "Tekirdağ", lat: 41.00, lng: 27.52 },
  { name: "Tokat", lat: 40.31, lng: 36.55 },
  { name: "Trabzon", lat: 41.00, lng: 39.72 },
  { name: "Tunceli", lat: 39.11, lng: 39.55 },
  { name: "Uşak", lat: 38.67, lng: 29.41 },
  { name: "Van", lat: 38.49, lng: 43.38 },
  { name: "Yalova", lat: 40.66, lng: 29.27 },
  { name: "Yozgat", lat: 39.82, lng: 34.80 },
  { name: "Zonguldak", lat: 41.45, lng: 31.79 },
].sort((a, b) => a.name.localeCompare(b.name, "tr"));

/* ─── Fuel Types ─── */
const FUEL_TYPES = [
  { key: "benzin", label: "Benzin", price: 42.50 },
  { key: "dizel", label: "Dizel", price: 40.80 },
  { key: "lpg", label: "LPG", price: 21.00 },
];

const DEFAULT_CONSUMPTION: Record<string, number> = {
  benzin: 7.5,
  dizel: 6.0,
  lpg: 10.0,
};

/* ─── Haversine Distance ─── */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateRoadKm(c1: { lat: number; lng: number }, c2: { lat: number; lng: number }): number {
  const straight = haversineKm(c1.lat, c1.lng, c2.lat, c2.lng);
  return Math.round(straight * 1.4);
}

/* ─── Accent Color ─── */
const ACCENT = "#2563EB";
const ACCENT_LIGHT = "rgba(37, 99, 235, 0.08)";
const ACCENT_BORDER = "rgba(37, 99, 235, 0.20)";
const ACCENT_BG = "rgba(37, 99, 235, 0.05)";

/* ─── Searchable City Dropdown ─── */
function CitySelector({
  value,
  onChange,
  placeholder,
  excludeCity,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  excludeCity?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return CITIES.filter(
      (c) => c.name !== excludeCity && c.name.toLowerCase().includes(q)
    );
  }, [search, excludeCity]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) setTimeout(() => inputRef.current?.focus(), 50);
        }}
        style={{
          width: "100%",
          padding: "14px 16px",
          background: "var(--secondary)",
          border: `1.5px solid ${open ? ACCENT : "var(--card-border)"}`,
          borderRadius: "12px",
          color: value ? "var(--foreground)" : "var(--text-muted)",
          fontSize: "15px",
          fontWeight: value ? "700" : "500",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          transition: "border-color 0.2s",
          textAlign: "left",
          boxSizing: "border-box",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <MapPin size={16} color={value ? ACCENT : "var(--text-muted)"} />
          {value || placeholder}
        </span>
        {value ? (
          <X
            size={16}
            color="var(--text-muted)"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setSearch("");
            }}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <ChevronDown size={16} color="var(--text-muted)" />
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "var(--card-bg)",
            border: `1.5px solid ${ACCENT_BORDER}`,
            borderRadius: "12px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
            zIndex: 100,
            maxHeight: "280px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Search input */}
          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid var(--card-border)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Search size={14} color="var(--text-muted)" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Şehir ara..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--foreground)",
                fontSize: "14px",
              }}
            />
          </div>

          {/* City list */}
          <div
            style={{
              overflowY: "auto",
              flex: 1,
              scrollbarWidth: "thin",
            }}
          >
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "13px",
                }}
              >
                Sonuç bulunamadı
              </div>
            )}
            {filtered.map((city) => (
              <button
                key={city.name}
                onClick={() => {
                  onChange(city.name);
                  setOpen(false);
                  setSearch("");
                }}
                style={{
                  width: "100%",
                  padding: "11px 16px",
                  background:
                    value === city.name ? ACCENT_LIGHT : "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--card-border)",
                  color:
                    value === city.name ? ACCENT : "var(--foreground)",
                  fontWeight: value === city.name ? "700" : "500",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = ACCENT_LIGHT)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    value === city.name ? ACCENT_LIGHT : "transparent")
                }
              >
                <MapPin size={13} color={value === city.name ? ACCENT : "var(--text-muted)"} />
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export default function YakitHesaplamaSection() {
  const [nereden, setNereden] = useState("");
  const [nereye, setNereye] = useState("");
  const [yakitTuru, setYakitTuru] = useState("benzin");
  const [tuketim, setTuketim] = useState(7.5);
  const [gidisDonusu, setGidisDonusu] = useState(false);

  // When fuel type changes, set default consumption
  const handleFuelChange = useCallback((key: string) => {
    setYakitTuru(key);
    setTuketim(DEFAULT_CONSUMPTION[key]);
  }, []);

  // Swap cities
  const swapCities = useCallback(() => {
    setNereden(nereye);
    setNereye(nereden);
  }, [nereden, nereye]);

  // Calculate results
  const results = useMemo(() => {
    if (!nereden || !nereye) return null;
    const c1 = CITIES.find((c) => c.name === nereden);
    const c2 = CITIES.find((c) => c.name === nereye);
    if (!c1 || !c2) return null;

    const tekYonKm = estimateRoadKm(c1, c2);
    const totalKm = gidisDonusu ? tekYonKm * 2 : tekYonKm;
    const fuelType = FUEL_TYPES.find((f) => f.key === yakitTuru)!;
    const yakitLitre = (totalKm * tuketim) / 100;
    const toplamMaliyet = yakitLitre * fuelType.price;
    const kmBasinaMaliyet = (tuketim / 100) * fuelType.price;

    return {
      tekYonKm,
      totalKm,
      yakitLitre,
      toplamMaliyet,
      kmBasinaMaliyet,
      yakitFiyati: fuelType.price,
    };
  }, [nereden, nereye, yakitTuru, tuketim, gidisDonusu]);

  const currentFuel = FUEL_TYPES.find((f) => f.key === yakitTuru)!;

  /* ─── Styles ─── */
  const cardStyle: React.CSSProperties = {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: "16px",
    padding: "24px",
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "700",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "680px", margin: "0 auto" }}>
      {/* ─── Header ─── */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "4px" }}>
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: ACCENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(37, 99, 235, 0.35)",
          }}
        >
          <Fuel size={26} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>
            Şehirler Arası Yakıt Hesaplama
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Gideceğiniz şehri seçin, yakıt türünüzü belirleyin, maliyetinizi görün
          </p>
        </div>
      </div>

      {/* ─── Route Selection ─── */}
      <div style={cardStyle}>
        <div style={sectionTitle}>
          <Navigation size={13} color={ACCENT} />
          Güzergah
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* From */}
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "var(--text-muted)",
                marginBottom: "6px",
                display: "block",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Nereden
            </label>
            <CitySelector
              value={nereden}
              onChange={setNereden}
              placeholder="Kalkış şehri"
              excludeCity={nereye}
            />
          </div>

          {/* Swap Button */}
          <button
            onClick={swapCities}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              border: `1.5px solid ${ACCENT_BORDER}`,
              background: ACCENT_BG,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginTop: "20px",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = ACCENT;
              (e.currentTarget.querySelector("svg") as SVGElement).style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = ACCENT_BG;
              (e.currentTarget.querySelector("svg") as SVGElement).style.color = ACCENT;
            }}
            title="Şehirleri değiştir"
          >
            <ArrowRightLeft size={18} color={ACCENT} />
          </button>

          {/* To */}
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "var(--text-muted)",
                marginBottom: "6px",
                display: "block",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Nereye
            </label>
            <CitySelector
              value={nereye}
              onChange={setNereye}
              placeholder="Varış şehri"
              excludeCity={nereden}
            />
          </div>
        </div>

        {/* Round-trip toggle */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: gidisDonusu ? ACCENT_LIGHT : "var(--secondary)",
            border: `1px solid ${gidisDonusu ? ACCENT_BORDER : "var(--card-border)"}`,
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onClick={() => setGidisDonusu(!gidisDonusu)}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: gidisDonusu ? ACCENT : "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ArrowRightLeft size={15} />
            Gidiş - Dönüş
          </span>
          {gidisDonusu ? (
            <ToggleRight size={28} color={ACCENT} />
          ) : (
            <ToggleLeft size={28} color="var(--text-muted)" />
          )}
        </div>
      </div>

      {/* ─── Fuel Type ─── */}
      <div style={cardStyle}>
        <div style={sectionTitle}>
          <Fuel size={13} color={ACCENT} />
          Yakıt Türü
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {FUEL_TYPES.map((fuel) => {
            const active = yakitTuru === fuel.key;
            return (
              <button
                key={fuel.key}
                onClick={() => handleFuelChange(fuel.key)}
                style={{
                  padding: "16px 12px",
                  borderRadius: "12px",
                  border: `2px solid ${active ? ACCENT : "var(--card-border)"}`,
                  background: active ? ACCENT_LIGHT : "var(--secondary)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: active ? ACCENT : "var(--foreground)",
                    marginBottom: "4px",
                  }}
                >
                  {fuel.label}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: active ? ACCENT : "var(--text-muted)",
                  }}
                >
                  {fuel.price.toFixed(2)} TL/lt
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Consumption ─── */}
      <div style={cardStyle}>
        <div style={sectionTitle}>
          <Fuel size={13} color={ACCENT} />
          Ortalama Tüketim
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <input
            type="range"
            min={3}
            max={25}
            step={0.5}
            value={tuketim}
            onChange={(e) => setTuketim(Number(e.target.value))}
            style={{
              flex: 1,
              accentColor: ACCENT,
              height: "6px",
              cursor: "pointer",
            }}
          />
          <div
            style={{
              minWidth: "90px",
              padding: "10px 14px",
              background: ACCENT_LIGHT,
              border: `1.5px solid ${ACCENT_BORDER}`,
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "800", color: ACCENT }}>
              {tuketim.toFixed(1)}
            </span>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginLeft: "4px" }}>
              lt/100km
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: "10px",
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          {[5, 6, 7.5, 8, 10, 12, 15].map((v) => (
            <button
              key={v}
              onClick={() => setTuketim(v)}
              style={{
                padding: "5px 12px",
                borderRadius: "8px",
                border: `1px solid ${tuketim === v ? ACCENT : "var(--card-border)"}`,
                background: tuketim === v ? ACCENT_LIGHT : "transparent",
                color: tuketim === v ? ACCENT : "var(--text-muted)",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Results ─── */}
      {results && (
        <div
          style={{
            ...cardStyle,
            border: `1.5px solid ${ACCENT_BORDER}`,
            background: ACCENT_BG,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: ACCENT,
            }}
          />

          {/* Route info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "20px",
              paddingTop: "4px",
            }}
          >
            <span style={{ fontSize: "15px", fontWeight: "700", color: ACCENT }}>{nereden}</span>
            <ArrowRightLeft size={16} color={ACCENT} />
            <span style={{ fontSize: "15px", fontWeight: "700", color: ACCENT }}>{nereye}</span>
            {gidisDonusu && (
              <span
                style={{
                  padding: "3px 10px",
                  background: ACCENT,
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "700",
                  borderRadius: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Gidiş-Dönüş
              </span>
            )}
          </div>

          {/* Main result: Total Cost */}
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              background: "var(--card-bg)",
              borderRadius: "14px",
              border: `1px solid var(--card-border)`,
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "8px",
              }}
            >
              Toplam Yakıt Maliyeti
            </div>
            <div style={{ fontSize: "42px", fontWeight: "900", color: ACCENT, lineHeight: 1 }}>
              {results.toplamMaliyet.toFixed(0)}
              <span style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-muted)", marginLeft: "4px" }}>
                TL
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            <DetailCard
              label="Toplam Mesafe"
              value={`${results.totalKm.toLocaleString("tr-TR")}`}
              unit="km"
            />
            <DetailCard
              label="Gerekli Yakıt"
              value={results.yakitLitre.toFixed(1)}
              unit="litre"
            />
            <DetailCard
              label="Km Başına"
              value={results.kmBasinaMaliyet.toFixed(2)}
              unit="TL/km"
            />
          </div>

          {/* Fuel price info */}
          <div
            style={{
              marginTop: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              background: "var(--card-bg)",
              borderRadius: "10px",
              border: "1px solid var(--card-border)",
            }}
          >
            <Info size={14} color="var(--text-muted)" />
            <span style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--foreground)" }}>{currentFuel.label}</strong> fiyatı{" "}
              <strong style={{ color: ACCENT }}>{currentFuel.price.toFixed(2)} TL/lt</strong> üzerinden hesaplandı.
              Mesafe tahminidir, gerçek yol koşullarına göre değişebilir.
            </span>
          </div>
        </div>
      )}

      {/* ─── Empty State ─── */}
      {!results && (
        <div
          style={{
            ...cardStyle,
            textAlign: "center",
            padding: "48px 24px",
            border: `1px dashed var(--card-border)`,
            background: "transparent",
          }}
        >
          <Navigation size={36} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: "12px" }} />
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
            Kalkış ve varış şehrinizi seçerek
            <br />
            yakıt maliyetinizi hesaplayın
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Detail Card ─── */
function DetailCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div
      style={{
        padding: "14px",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "12px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: "700",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "22px", fontWeight: "800", color: ACCENT, lineHeight: 1 }}>
        {value}
        <span
          style={{
            fontSize: "11px",
            fontWeight: "600",
            color: "var(--text-muted)",
            marginLeft: "3px",
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}
