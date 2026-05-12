"use client";

import { useState, useMemo } from "react";
import { Calculator, Info, Car, Globe, Zap, Fuel, AlertCircle, Euro, Banknote, MapIcon, ChevronRight } from "lucide-react";

export default function AracIthalatSection() {
  const [fiyatEuro, setFiyatEuro] = useState<number>(25000);
  const [navlunEuro, setNavlunEuro] = useState<number>(1500);
  const [kur, setKur] = useState<number>(36.50);
  
  const [mensei, setMensei] = useState<"ab" | "diger" | "cin">("ab");
  const [aracTipi, setAracTipi] = useState<"ice" | "ev">("ice");
  
  // İçten yanmalı için hacim, elektrikli için güç
  const [motorIce, setMotorIce] = useState<"1600" | "2000" | "2001">("1600");
  const [motorEv, setMotorEv] = useState<"160" | "161">("160");

  const results = useMemo(() => {
    // 1. CIF Bedeli (Araç + Sigorta/Navlun)
    const cifEuro = fiyatEuro + navlunEuro;
    const cifTl = cifEuro * kur;

    // 2. Gümrük Vergisi
    let gumrukOrani = 0;
    if (mensei === "diger") gumrukOrani = 0.10;
    if (mensei === "cin") gumrukOrani = 0.50; // %10 standart + %40 ilave = %50 (veya sadece %40 ilave)
    
    const gumrukTl = cifTl * gumrukOrani;

    // 3. ÖTV Matrahı
    const otvMatrahi = cifTl + gumrukTl;

    // 4. ÖTV Oranı Belirleme
    let otvOrani = 0;
    if (aracTipi === "ice") {
      if (motorIce === "1600") {
        if (otvMatrahi <= 184000) otvOrani = 0.45;
        else if (otvMatrahi <= 220000) otvOrani = 0.50;
        else if (otvMatrahi <= 250000) otvOrani = 0.60;
        else if (otvMatrahi <= 280000) otvOrani = 0.70;
        else otvOrani = 0.80;
      } else if (motorIce === "2000") {
        if (otvMatrahi <= 170000) otvOrani = 1.30;
        else otvOrani = 1.50;
      } else {
        otvOrani = 2.20;
      }
    } else {
      // Elektrikli
      if (motorEv === "160") {
        if (otvMatrahi <= 1450000) otvOrani = 0.10;
        else otvOrani = 0.40;
      } else {
        if (otvMatrahi <= 1350000) otvOrani = 0.50;
        else otvOrani = 0.60;
      }
    }

    const otvTl = otvMatrahi * otvOrani;

    // 5. KDV Hesaplama (%20)
    // KDV = (Matrah + ÖTV) * 0.20
    const kdvMatrahi = otvMatrahi + otvTl;
    const kdvTl = kdvMatrahi * 0.20;

    // 6. Toplam Maliyet
    const toplamMaliyetTl = cifTl + gumrukTl + otvTl + kdvTl;
    const toplamMaliyetEuro = toplamMaliyetTl / kur;

    // Vergi Yükü Özeti
    const toplamVergiTl = gumrukTl + otvTl + kdvTl;
    const vergiOrani = (toplamVergiTl / cifTl) * 100;

    return {
      cifTl,
      gumrukOrani: gumrukOrani * 100,
      gumrukTl,
      otvMatrahi,
      otvOrani: otvOrani * 100,
      otvTl,
      kdvTl,
      toplamVergiTl,
      toplamMaliyetTl,
      toplamMaliyetEuro,
      vergiOrani
    };
  }, [fiyatEuro, navlunEuro, kur, mensei, aracTipi, motorIce, motorEv]);

  const cardStyle: React.CSSProperties = {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "16px"
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--text-muted)",
    marginBottom: "6px",
    display: "block"
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid var(--card-border)",
    background: "var(--background)",
    color: "var(--foreground)",
    fontSize: "14px",
    fontWeight: "500"
  };

  const btnStyle = (active: boolean) => ({
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: `1.5px solid ${active ? "#0EA5E9" : "var(--card-border)"}`,
    background: active ? "rgba(14, 165, 233, 0.1)" : "var(--secondary)",
    color: active ? "#0EA5E9" : "var(--foreground)",
    fontSize: "13px",
    fontWeight: active ? "700" : "500",
    cursor: "pointer",
    transition: "all 0.2s"
  });

  return (
    <div style={{ paddingBottom: "40px" }}>
      {/* ── HEADER ── */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", padding: "12px", background: "rgba(14, 165, 233, 0.1)", borderRadius: "16px", marginBottom: "16px" }}>
          <MapIcon size={32} color="#0EA5E9" />
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 8px 0", color: "var(--foreground)" }}>
          Araç İthalat Vergisi Hesaplayıcı
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>
          Yurtdışından Türkiye&apos;ye kesin dönüş veya ithalat yoluyla araç getirirken ödeyeceğiniz Gümrük Vergisi, ÖTV ve KDV tutarlarını hesaplayın.
        </p>
      </div>

      {/* ── ARACIN DEĞERİ ── */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Euro size={16} color="#0EA5E9" />
          <h3 style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>Araç Bedeli ve Kur</h3>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Aracın Fiyatı (Euro)</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>€</span>
              <input type="number" value={fiyatEuro} onChange={(e) => setFiyatEuro(Number(e.target.value))} style={{ ...inputStyle, paddingLeft: "28px" }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Navlun & Sigorta (Euro)</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>€</span>
              <input type="number" value={navlunEuro} onChange={(e) => setNavlunEuro(Number(e.target.value))} style={{ ...inputStyle, paddingLeft: "28px" }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <label style={labelStyle}>Euro Kuru (1 € = X TL)</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>₺</span>
            <input type="number" step="0.01" value={kur} onChange={(e) => setKur(Number(e.target.value))} style={{ ...inputStyle, paddingLeft: "28px" }} />
          </div>
        </div>
      </div>

      {/* ── ARAÇ ÖZELLİKLERİ VE MENŞEİ ── */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Globe size={16} color="#0EA5E9" />
          <h3 style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>Menşei ve Motor Tipi</h3>
        </div>

        <label style={labelStyle}>Aracın Üretildiği Ülke (Menşei)</label>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button style={btnStyle(mensei === "ab")} onClick={() => setMensei("ab")}>🇪🇺 AB Ülkeleri (%0 Gümrük)</button>
          <button style={btnStyle(mensei === "diger")} onClick={() => setMensei("diger")}>🌐 Diğer Ülkeler (%10)</button>
          <button style={btnStyle(mensei === "cin")} onClick={() => setMensei("cin")}>🇨🇳 Çin (%50 Gümrük)</button>
        </div>

        <label style={labelStyle}>Araç Türü</label>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button style={{ ...btnStyle(aracTipi === "ice"), display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }} onClick={() => setAracTipi("ice")}>
            <Fuel size={14} /> İçten Yanmalı (Benzin/Dizel)
          </button>
          <button style={{ ...btnStyle(aracTipi === "ev"), display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }} onClick={() => setAracTipi("ev")}>
            <Zap size={14} /> Tam Elektrikli (EV)
          </button>
        </div>

        {aracTipi === "ice" ? (
          <div>
            <label style={labelStyle}>Motor Hacmi</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button style={btnStyle(motorIce === "1600")} onClick={() => setMotorIce("1600")}>1600cc ve altı</button>
              <button style={btnStyle(motorIce === "2000")} onClick={() => setMotorIce("2000")}>1601 - 2000cc arası</button>
              <button style={btnStyle(motorIce === "2001")} onClick={() => setMotorIce("2001")}>2000cc üzeri</button>
            </div>
          </div>
        ) : (
          <div>
            <label style={labelStyle}>Motor Gücü (kW)</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={btnStyle(motorEv === "160")} onClick={() => setMotorEv("160")}>160 kW ve altı</button>
              <button style={btnStyle(motorEv === "161")} onClick={() => setMotorEv("161")}>160 kW üzeri</button>
            </div>
          </div>
        )}
      </div>

      {/* ── SONUÇLAR ── */}
      <div style={{ ...cardStyle, border: "2px solid rgba(14, 165, 233, 0.3)", background: "rgba(14, 165, 233, 0.03)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "#0EA5E9" }} />
        
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
            Türkiye Anahtar Teslim Maliyeti
          </div>
          <div style={{ fontSize: "42px", fontWeight: "900", color: "#0EA5E9", lineHeight: 1 }}>
            {results.toplamMaliyetTl.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
          </div>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-muted)", marginTop: "6px" }}>
            ~ {results.toplamMaliyetEuro.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} €
          </div>
        </div>

        {/* Vergi Kırılımı (Şelale Modeli) */}
        <div style={{ background: "var(--background)", borderRadius: "12px", padding: "16px", border: "1px solid var(--card-border)" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "12px", color: "var(--foreground)", borderBottom: "1px solid var(--card-border)", paddingBottom: "8px" }}>
            Maliyet & Vergi Kırılımı (Kümülatif)
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
            <span style={{ color: "var(--text-muted)" }}>Araç Bedeli + Navlun (CIF)</span>
            <span style={{ fontWeight: "600" }}>{results.cifTl.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
            <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              Gümrük Vergisi <span style={{ fontSize: "10px", background: "var(--secondary)", padding: "2px 6px", borderRadius: "4px" }}>%{results.gumrukOrani}</span>
            </span>
            <span style={{ fontWeight: "600", color: "#F59E0B" }}>+ {results.gumrukTl.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
            <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              ÖTV <span style={{ fontSize: "10px", background: "var(--secondary)", padding: "2px 6px", borderRadius: "4px" }}>%{results.otvOrani}</span>
            </span>
            <span style={{ fontWeight: "600", color: "#EF4444" }}>+ {results.otvTl.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "14px" }}>
            <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              KDV <span style={{ fontSize: "10px", background: "var(--secondary)", padding: "2px 6px", borderRadius: "4px" }}>%20</span>
            </span>
            <span style={{ fontWeight: "600", color: "#EF4444" }}>+ {results.kdvTl.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px dashed var(--card-border)", fontSize: "15px" }}>
            <span style={{ fontWeight: "700", color: "var(--foreground)" }}>Sadece Vergi Yükü</span>
            <span style={{ fontWeight: "800", color: "#EF4444" }}>{results.toplamVergiTl.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺</span>
          </div>
        </div>

        {/* Vergi Oranı Rozeti */}
        <div style={{ marginTop: "16px", display: "flex", alignItems: "flex-start", gap: "12px", background: "rgba(245, 158, 11, 0.1)", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
          <AlertCircle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div style={{ fontSize: "13px", color: "var(--foreground)", lineHeight: "1.5" }}>
            Türkiye&apos;de bu aracı ithal ettiğinizde, aracın net çıplak fiyatının <strong>%{results.vergiOrani.toFixed(1)}</strong>&apos;i kadar fazladan vergi ödersiniz. <br />
            <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>Not: Plaka tescil, noter ve tse/uygunluk belgesi harçları bu hesaba dahil değildir.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
