"use client";

import { useState, useMemo, useEffect } from "react";
import { Car, Route, BadgePercent, Coins, Info, CheckCircle, AlertCircle, ToggleLeft, ToggleRight, Banknote, RefreshCw } from "lucide-react";

/* ── Accent Colors ── */
const AC = "#6366F1"; // Indigo
const AC_L = "rgba(99,102,241,0.08)";
const AC_B = "rgba(99,102,241,0.20)";
const AC_BG = "rgba(99,102,241,0.04)";

export default function AracVsTaksiSection() {
  // Ortak Girdi
  const [yillikKm, setYillikKm] = useState<number>(10000);

  // Senaryo A: Araç Sahibi Olmak
  const [aracDegeri, setAracDegeri] = useState<number>(1200000);
  const [sabitMasraflar, setSabitMasraflar] = useState<number>(45000); // Kasko, Sigorta, Bakım, MTV
  const [yakitTuketimi, setYakitTuketimi] = useState<number>(7.5); // lt/100km
  const [yakitFiyati, setYakitFiyati] = useState<number>(42.50); // TL/lt
  const [degerKaybiYuzdesi, setDegerKaybiYuzdesi] = useState<number>(3); // %
  const [loadingYakit, setLoadingYakit] = useState<boolean>(true);

  // Yakıt fiyatını API'den çek
  useEffect(() => {
    fetch('/api/fiyatlar/istanbul')
      .then(res => res.json())
      .then(data => {
        if (data && data.veriler && data.veriler.length > 0) {
          const fiyatlar = data.veriler[0].fiyatlar;
          if (fiyatlar && fiyatlar.benzin_95 && fiyatlar.benzin_95.fiyat) {
            const benzinFiyat = parseFloat(fiyatlar.benzin_95.fiyat.toString().replace(',', '.'));
            if (!isNaN(benzinFiyat)) {
              setYakitFiyati(benzinFiyat);
            }
          }
        }
      })
      .catch(err => console.error("Yakıt fiyatı çekilemedi", err))
      .finally(() => setLoadingYakit(false));
  }, []);
  
  // Fırsat Maliyeti
  const [firsatMaliyetiAktif, setFirsatMaliyetiAktif] = useState<boolean>(true);
  const [mevduatFaizi, setMevduatFaizi] = useState<number>(45); // Yıllık brüt %

  // Senaryo B: Alternatif Ulaşım (Taksi, Araç Kiralama)
  const [taksiKmMaliyeti, setTaksiKmMaliyeti] = useState<number>(35); // TL/km

  const results = useMemo(() => {
    // ── ARAÇ MALİYETLERİ ──
    const yakitMaliyeti = (yillikKm / 100) * yakitTuketimi * yakitFiyati;
    const degerKaybiMaliyeti = aracDegeri * (degerKaybiYuzdesi / 100);
    
    // Fırsat Maliyeti Hesabı (Net Faiz: Brüt - %7.5 stopaj)
    const netFaizOrani = mevduatFaizi * 0.925;
    const firsatMaliyeti = firsatMaliyetiAktif ? (aracDegeri * (netFaizOrani / 100)) : 0;

    const aracToplamMaliyet = yakitMaliyeti + sabitMasraflar + degerKaybiMaliyeti + firsatMaliyeti;

    // ── TAKSİ/KİRALAMA MALİYETİ ──
    const taksiToplamMaliyet = yillikKm * taksiKmMaliyeti;

    // ── KIYASLAMA ──
    const fark = aracToplamMaliyet - taksiToplamMaliyet;
    const taksiDahaKarli = fark > 0;
    
    // Başa baş noktası (Hangi kilometrede maliyetler eşitlenir?)
    // arac_sabit + arac_km_maliyeti * X = taksi_km_maliyeti * X
    // X = arac_sabit / (taksi_km_maliyeti - arac_km_maliyeti)
    
    const aracKmMaliyeti = (yakitTuketimi * yakitFiyati) / 100;
    const toplamSabitler = sabitMasraflar + degerKaybiMaliyeti + firsatMaliyeti;
    
    let basaBasKm = 0;
    if (taksiKmMaliyeti > aracKmMaliyeti) {
      basaBasKm = toplamSabitler / (taksiKmMaliyeti - aracKmMaliyeti);
    }

    return {
      yakitMaliyeti,
      degerKaybiMaliyeti,
      firsatMaliyeti,
      aracToplamMaliyet,
      taksiToplamMaliyet,
      fark: Math.abs(fark),
      taksiDahaKarli,
      basaBasKm: basaBasKm > 0 ? Math.round(basaBasKm) : 0,
      aracKmMaliyeti
    };
  }, [yillikKm, aracDegeri, sabitMasraflar, yakitTuketimi, yakitFiyati, degerKaybiYuzdesi, firsatMaliyetiAktif, mevduatFaizi, taksiKmMaliyeti]);

  const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px", marginBottom: "16px" };
  const secTitle: React.CSSProperties = { fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" };
  const labelStyle: React.CSSProperties = { fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "6px", display: "block" };

  return (
    <div className="arac-vs-taksi-container">
      {/* ── Intro ── */}
      <div style={{ ...card, background: `linear-gradient(135deg, var(--card-bg) 0%, ${AC_BG} 100%)`, border: `1px solid ${AC_B}` }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: AC_L, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Route size={24} color={AC} />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", margin: "0 0 6px 0" }}>
              Araç Almak mı, Taksi / Kiralama mı?
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
              Yıllık kilometre ihtiyacınıza göre; bir otomobilin tüm gizli masraflarını ödemek mi, yoksa sadece ihtiyaç anında taksi, Uber veya TikTak gibi araç paylaşım uygulamalarını kullanmak mı daha mantıklı?
            </p>
          </div>
        </div>
      </div>

      {/* ── Yıllık Kilometre (Ana Değişken) ── */}
      <div style={{ ...card, border: `2px solid ${AC}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: AC }} />
        <div style={secTitle}><Route size={13} color={AC} /> Yıllık Tahmini Kilometreniz</div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "10px" }}>
          <input type="range" min="1000" max="35000" step="500" value={yillikKm} onChange={e => setYillikKm(Number(e.target.value))}
            style={{ flex: 1, accentColor: AC, height: "8px", cursor: "pointer" }} />
          <div style={{ minWidth: "120px", padding: "10px 16px", background: AC_L, border: `1.5px solid ${AC_B}`, borderRadius: "12px", textAlign: "center" }}>
            <span style={{ fontSize: "20px", fontWeight: "800", color: AC }}>{yillikKm.toLocaleString("tr-TR")}</span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", marginLeft: "4px" }}>km</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", padding: "0 5px" }}>
          <span>1.000 km</span>
          <span>Ortalama (15.000)</span>
          <span>35.000 km</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        {/* ── Araç Sahibi Olma Girdileri ── */}
        <div style={{ ...card, marginBottom: 0 }}>
          <div style={secTitle}><Car size={13} color="#3B82F6" /> Araç Sahibi Olma Senaryosu</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Araç Değeri (Sermaye)</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>₺</span>
                <input type="number" min="0" value={aracDegeri || ""} onChange={e => setAracDegeri(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px 12px 10px 30px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--foreground)", fontSize: "14px", fontWeight: "600" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "4px" }}>
                  Yakıt Fiyatı (TL/lt)
                  {loadingYakit && <RefreshCw size={10} style={{ animation: "spin 1s linear infinite", color: "#3B82F6" }} />}
                  {!loadingYakit && <span style={{ fontSize: "9px", background: "rgba(59, 130, 246, 0.15)", padding: "2px 4px", borderRadius: "4px", color: "#3B82F6" }}>Canlı</span>}
                </label>
                <input type="number" step="0.5" value={yakitFiyati || ""} onChange={e => setYakitFiyati(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--foreground)", fontSize: "14px", fontWeight: "600" }} />
              </div>
              <div>
                <label style={labelStyle}>Tüketim (lt/100km)</label>
                <input type="number" step="0.5" value={yakitTuketimi || ""} onChange={e => setYakitTuketimi(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--foreground)", fontSize: "14px", fontWeight: "600" }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Yıllık Sabit Masraflar (Kasko, Trafik, MTV, Bakım)</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>₺</span>
                <input type="number" min="0" value={sabitMasraflar || ""} onChange={e => setSabitMasraflar(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px 12px 10px 30px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--foreground)", fontSize: "14px", fontWeight: "600" }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Yıllık Değer Kaybı / Yıpranma (%)</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>%</span>
                <input type="number" step="0.5" min="0" value={degerKaybiYuzdesi || ""} onChange={e => setDegerKaybiYuzdesi(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px 12px 10px 30px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--foreground)", fontSize: "14px", fontWeight: "600" }} />
              </div>
            </div>

            <div style={{ background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "10px", padding: "12px", marginTop: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#F59E0B", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Banknote size={14} /> Fırsat Maliyeti (Faiz)
                </span>
                <button onClick={() => setFirsatMaliyetiAktif(!firsatMaliyetiAktif)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
                  {firsatMaliyetiAktif ? <ToggleRight size={28} color="#F59E0B" /> : <ToggleLeft size={28} color="var(--text-muted)" />}
                </button>
              </div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "0 0 10px 0", lineHeight: "1.4" }}>Araca bağladığınız nakit paranın banka mevduat getirisinden mahrum kalması bir gizli maliyettir. Hesaba katılsın mı?</p>
              
              {firsatMaliyetiAktif && (
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>Yıllık Brüt Faiz (%)</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>%</span>
                    <input type="number" step="1" min="0" value={mevduatFaizi || ""} onChange={e => setMevduatFaizi(Number(e.target.value))}
                      style={{ width: "100%", padding: "8px 10px 8px 26px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", color: "var(--foreground)", fontSize: "13px", fontWeight: "600" }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Taksi/Kiralama Girdileri ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ ...card, marginBottom: 0, flex: 1 }}>
            <div style={secTitle}><Route size={13} color="#10B981" /> Alternatif Ulaşım (Taksi vs.)</div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={labelStyle}>Ortalama KM Başı Maliyet (TL)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>₺</span>
                  <input type="number" min="0" value={taksiKmMaliyeti || ""} onChange={e => setTaksiKmMaliyeti(Number(e.target.value))}
                    style={{ width: "100%", padding: "12px 12px 12px 30px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "8px", color: "#10B981", fontSize: "18px", fontWeight: "700" }} />
                </div>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px", lineHeight: "1.5" }}>
                  Taksi açılış ücreti, bekleme süresi veya saatlik/dakikalık araç kiralama bedellerini ortalayarak 1 kilometrenin size ortalama kaça mal olduğunu buraya girin. 
                </p>
              </div>

              <div style={{ background: "var(--secondary)", padding: "16px", borderRadius: "10px", marginTop: "auto", border: "1px dashed var(--card-border)" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--foreground)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Info size={14} color="var(--text-muted)" /> Nasıl Hesaplanır?
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                  Örneğin; her gün işe taksiyle gidip geliyorsanız (günde 20 km) ve taksiye günlük 700 TL ödüyorsanız, km maliyetiniz 35 TL'dir. TikTak, Moov gibi araçlarda dakika bazlı ücretlendirilirsiniz, ortalama rotanızı hesaplayıp km'ye bölebilirsiniz.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SONUÇLAR ── */}
      <div style={{ ...card, border: `2px solid ${results.taksiDahaKarli ? "#10B981" : "#3B82F6"}`, padding: "30px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "8px", background: results.taksiDahaKarli ? "rgba(16, 185, 129, 0.1)" : "rgba(59, 130, 246, 0.1)", textAlign: "center", borderBottom: `1px solid ${results.taksiDahaKarli ? "rgba(16, 185, 129, 0.2)" : "rgba(59, 130, 246, 0.2)"}` }}>
          <span style={{ fontSize: "13px", fontWeight: "800", color: results.taksiDahaKarli ? "#10B981" : "#3B82F6", textTransform: "uppercase", letterSpacing: "1px" }}>
            {results.taksiDahaKarli ? "Taksi / Kiralama Kullanmak Daha Mantıklı" : "Araç Satın Almak Daha Mantıklı"}
          </span>
        </div>

        <div style={{ marginTop: "30px", marginBottom: "30px", textAlign: "center" }}>
          <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>
            {yillikKm.toLocaleString("tr-TR")} km yıllık kullanım için <strong>yıllık toplam maliyetler:</strong>
          </div>
          
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "40px", marginTop: "24px" }}>
            {/* Araba İbresi */}
            <div style={{ textAlign: "center", width: "180px", opacity: results.taksiDahaKarli ? 0.6 : 1, transition: "all 0.3s" }}>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#3B82F6", lineHeight: 1, marginBottom: "8px" }}>
                {"\u20BA"}{results.aracToplamMaliyet.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>Araç Sahibi Olmak</div>
            </div>

            {/* VS */}
            <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-muted)", paddingBottom: "16px" }}>VS</div>

            {/* Taksi İbresi */}
            <div style={{ textAlign: "center", width: "180px", opacity: !results.taksiDahaKarli ? 0.6 : 1, transition: "all 0.3s" }}>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#10B981", lineHeight: 1, marginBottom: "8px" }}>
                {"\u20BA"}{results.taksiToplamMaliyet.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>Taksi / Kiralama</div>
            </div>
          </div>
          
          <div style={{ marginTop: "24px", display: "inline-block", background: "var(--secondary)", padding: "10px 20px", borderRadius: "20px", border: "1px solid var(--card-border)" }}>
            <span style={{ fontSize: "14px", color: "var(--foreground)" }}>
              Fark: <strong style={{ color: results.taksiDahaKarli ? "#10B981" : "#3B82F6" }}>Yıllık {"\u20BA"}{results.fark.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}</strong> {results.taksiDahaKarli ? "Taksi avantajlı" : "Araç avantajlı"}
            </span>
          </div>
        </div>

        {/* Araç Maliyeti Kırılımı */}
        <div style={{ background: "var(--secondary)", borderRadius: "12px", padding: "20px", border: "1px solid var(--card-border)" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--foreground)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid var(--card-border)", paddingBottom: "8px" }}>
            Araç Maliyeti Detaylı Kırılımı (Yıllık)
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "var(--text-muted)" }}>🚗 Yakıt Maliyeti</span>
              <span style={{ fontWeight: "700" }}>{"\u20BA"}{results.yakitMaliyeti.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "var(--text-muted)" }}>📄 Sabit Giderler (MTV vb.)</span>
              <span style={{ fontWeight: "700" }}>{"\u20BA"}{sabitMasraflar.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "var(--text-muted)" }}>📉 Değer Kaybı / Yıpranma</span>
              <span style={{ fontWeight: "700" }}>{"\u20BA"}{results.degerKaybiMaliyeti.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}</span>
            </div>
            {firsatMaliyetiAktif && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "var(--text-muted)" }}>🏦 Fırsat Maliyeti (Kayıp Faiz)</span>
                <span style={{ fontWeight: "700", color: "#F59E0B" }}>{"\u20BA"}{results.firsatMaliyeti.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Başa Baş Noktası */}
        {results.basaBasKm > 0 && (
          <div style={{ marginTop: "16px", display: "flex", alignItems: "flex-start", gap: "12px", background: "rgba(99, 102, 241, 0.1)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
            <CheckCircle size={24} color="#6366F1" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#6366F1", marginBottom: "4px" }}>
                Başa Baş Noktası: {results.basaBasKm.toLocaleString("tr-TR")} km
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                Girdiğiniz değerlere göre araç satın almanın taksiden daha mantıklı olmaya başladığı kilometre sınırı yıllık <strong>{results.basaBasKm.toLocaleString("tr-TR")} km</strong>&apos;dir. Bu kilometrenin altında kalıyorsanız, sadece taksi/kiralama kullanmak ekonomik olarak her zaman daha mantıklıdır.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
