"use client";

import { useState, useMemo } from "react";
import { Calculator, AlertTriangle, CarFront, Info, Banknote, HelpCircle, Activity } from "lucide-react";

/* ── Accent Colors ── */
const AC = "#F59E0B"; // Amber for Depreciation
const AC_L = "rgba(245,158,11,0.08)";
const AC_B = "rgba(245,158,11,0.20)";
const AC_BG = "rgba(245,158,11,0.04)";

export default function DegerKaybiSection() {
  const [aracDegeri, setAracDegeri] = useState<number>(1000000);
  const [kilometre, setKilometre] = useState<number>(50000);
  const [hasarBoyutu, setHasarBoyutu] = useState<'hafif' | 'orta' | 'agir'>('hafif');
  const [parcaSayisi, setParcaSayisi] = useState<number>(1);

  const results = useMemo(() => {
    // Çok basit bir tahmini değer kaybı algoritması (Emsal niteliğinde)
    // Gerçek hesaplama Sigorta Bilgi Merkezi (SBM) kurallarına göre değişir.
    
    // Temel Katsayılar
    let kmKatsayisi = 1;
    if (kilometre > 150000) kmKatsayisi = 0.4;
    else if (kilometre > 100000) kmKatsayisi = 0.6;
    else if (kilometre > 50000) kmKatsayisi = 0.8;
    else kmKatsayisi = 1.0;

    let hasarKatsayisi = 0;
    if (hasarBoyutu === 'hafif') hasarKatsayisi = 0.02; // %2
    else if (hasarBoyutu === 'orta') hasarKatsayisi = 0.05; // %5
    else if (hasarBoyutu === 'agir') hasarKatsayisi = 0.09; // %9

    // Parça sayısı çarpanı
    const parcaCarpani = 1 + (parcaSayisi - 1) * 0.15; // Her ek parça %15 artırır

    let hesaplananDegerKaybi = aracDegeri * hasarKatsayisi * kmKatsayisi * parcaCarpani;

    // Maksimum sınır (Aracın %15'ini geçemez gibi bir kural koyalım)
    const maxDegerKaybi = aracDegeri * 0.15;
    if (hesaplananDegerKaybi > maxDegerKaybi) hesaplananDegerKaybi = maxDegerKaybi;
    
    // Minimum sınır
    if (hesaplananDegerKaybi < 1000) hesaplananDegerKaybi = 1000;

    const yeniDeger = aracDegeri - hesaplananDegerKaybi;

    return {
      degerKaybi: hesaplananDegerKaybi,
      yeniDeger: yeniDeger,
      oran: (hesaplananDegerKaybi / aracDegeri) * 100
    };
  }, [aracDegeri, kilometre, hasarBoyutu, parcaSayisi]);

  const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" };
  const secTitle: React.CSSProperties = { fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" };

  return (
    <div className="deger-kaybi-container">
      {/* ── Intro ── */}
      <div style={{ ...card, marginBottom: "16px", background: `linear-gradient(135deg, var(--card-bg) 0%, ${AC_BG} 100%)`, border: `1px solid ${AC_B}` }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: AC_L, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Activity size={24} color={AC} />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", margin: "0 0 6px 0" }}>
              Araç Değer Kaybı Hesaplama
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
              Kaza sonrasında aracınızda oluşan tahmini değer kaybını hesaplayın. Bu hesaplama sektörel ortalamalara dayalı <strong>tahmini</strong> bir sonuç verir; kesin sonuç için sigorta eksperi raporu gereklidir.
            </p>
          </div>
        </div>
      </div>

      {/* ── Calculator Form ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ ...card, padding: "20px" }}>
          <div style={secTitle}><CarFront size={13} color={AC} /> Kaza Öncesi Araç Bilgileri</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                Kaza Anındaki Araç Değeri (TL)
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "600" }}>₺</span>
                <input type="number" value={aracDegeri} onChange={e => setAracDegeri(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px 12px 12px 30px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "15px", fontWeight: "600" }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                Kaza Anındaki Kilometre
              </label>
              <div style={{ position: "relative" }}>
                <input type="number" value={kilometre} onChange={e => setKilometre(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px 35px 12px 12px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "15px", fontWeight: "600" }} />
                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "12px", fontWeight: "600" }}>KM</span>
              </div>
            </div>
          </div>

          <div style={secTitle}><AlertTriangle size={13} color={AC} /> Hasar Detayları</div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
              Hasar Boyutu
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {[
                { id: 'hafif', label: 'Hafif Hasar', desc: 'Sürtme, çizik, küçük göçükler' },
                { id: 'orta', label: 'Orta Hasar', desc: 'Kaporta düzeltme, lokal boya' },
                { id: 'agir', label: 'Ağır Hasar', desc: 'Parça değişimi, şasi işlemi' },
              ].map(opt => {
                const on = hasarBoyutu === opt.id;
                return (
                  <button key={opt.id} onClick={() => setHasarBoyutu(opt.id as any)}
                    style={{
                      padding: "12px", borderRadius: "10px", border: `2px solid ${on ? AC : "var(--card-border)"}`,
                      background: on ? AC_L : "var(--secondary)", cursor: "pointer", textAlign: "left", transition: "all 0.2s"
                    }}>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: on ? AC : "var(--foreground)", marginBottom: "4px" }}>{opt.label}</div>
                    <div style={{ fontSize: "10px", color: on ? AC : "var(--text-muted)", lineHeight: "1.3" }}>{opt.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
              <span>Hasar Gören/Değişen Parça Sayısı</span>
              <span style={{ color: AC, fontSize: "14px" }}>{parcaSayisi} Adet</span>
            </label>
            <input type="range" min={1} max={10} step={1} value={parcaSayisi} onChange={e => setParcaSayisi(Number(e.target.value))}
              style={{ width: "100%", accentColor: AC, height: "6px", cursor: "pointer" }} />
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      {aracDegeri > 0 && kilometre >= 0 && (
        <div style={{ ...card, border: `2px solid ${AC}`, background: "var(--card-bg)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "150px", height: "150px", background: `radial-gradient(circle, ${AC_L} 0%, transparent 70%)`, transform: "translate(30%, -30%)", pointerEvents: "none" }} />
          
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              Tahmini Değer Kaybı Tutarı
            </div>
            <div style={{ fontSize: "48px", fontWeight: "900", color: AC, lineHeight: 1 }}>
              {"\u20BA"}{results.degerKaybi.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", marginTop: "8px" }}>
              Aracın güncel değerinin yaklaşık <strong style={{ color: AC }}>%{results.oran.toFixed(1)}</strong>'i oranında değer kaybı hesaplandı.
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderTop: "1px solid var(--card-border)", paddingTop: "20px" }}>
            <div style={{ background: "var(--secondary)", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px" }}>Kaza Öncesi Değer</div>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--foreground)" }}>{"\u20BA"}{aracDegeri.toLocaleString("tr-TR")}</div>
            </div>
            <div style={{ background: AC_L, border: `1px solid ${AC_B}`, padding: "16px", borderRadius: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: AC, marginBottom: "4px" }}>Kaza Sonrası Yeni Değer</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: AC }}>{"\u20BA"}{results.yeniDeger.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}</div>
            </div>
          </div>
          
          <div style={{ marginTop: "20px", padding: "12px", background: "rgba(245, 158, 11, 0.05)", borderRadius: "10px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <HelpCircle size={16} color={AC} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.5" }}>
              <strong>Biliyor muydunuz?</strong> Değer kaybı tazminatını, kazada <u>%100 kusurlu olmamanız</u> ve aracınızın km'sinin 160.000'i geçmemiş olması (standart şartlarda) durumunda karşı tarafın trafik sigortasından talep edebilirsiniz. Plastik tampon parçaları değer kaybına dahil edilmez.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
