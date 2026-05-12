"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Plus, Trash2, Wallet, Car, Scale, AlertCircle, HelpCircle, CheckCircle, ArrowRightLeft } from "lucide-react";

/* ── Accent Colors ── */
const AC = "#F97316"; // Orange for Trading / Profit
const AC_L = "rgba(249,115,22,0.08)";
const AC_B = "rgba(249,115,22,0.20)";
const AC_BG = "rgba(249,115,22,0.04)";

type Masraf = {
  id: string;
  isim: string;
  tutar: number;
};

const DEFAULT_MASRAFLAR: Masraf[] = [
  { id: "noter", isim: "Noter / Devir Ücreti", tutar: 1500 },
  { id: "exper", isim: "Ekspertiz Ücreti", tutar: 4000 },
  { id: "sigorta", isim: "Trafik Sigortası", tutar: 5000 },
  { id: "kozmetik", isim: "Kuaför / Pasta Cila", tutar: 3500 },
  { id: "tamir", isim: "Mekanik Bakım / Onarım", tutar: 0 },
  { id: "ilan", isim: "İlan Platformu Ücreti", tutar: 1200 },
];

export default function AlSatKarMarjiSection() {
  const [alisFiyati, setAlisFiyati] = useState<number>(1200000);
  const [satisFiyati, setSatisFiyati] = useState<number>(1350000);
  const [beklemeSuresi, setBeklemeSuresi] = useState<number>(30); // Gün
  const [mevduatFaizi, setMevduatFaizi] = useState<number>(45); // Yıllık brüt %
  
  const [masraflar, setMasraflar] = useState<Masraf[]>(DEFAULT_MASRAFLAR);
  const [customIsim, setCustomIsim] = useState("");
  const [customTutar, setCustomTutar] = useState("");

  const handleAddMasraf = () => {
    if (!customIsim.trim()) return;
    setMasraflar([...masraflar, { 
      id: "custom_" + Date.now(), 
      isim: customIsim, 
      tutar: Number(customTutar) || 0
    }]);
    setCustomIsim("");
    setCustomTutar("");
  };

  const updateMasraf = (id: string, newTutar: number) => {
    setMasraflar(masraflar.map(m => m.id === id ? { ...m, tutar: newTutar } : m));
  };

  const removeMasraf = (id: string) => {
    setMasraflar(masraflar.filter(m => m.id !== id));
  };

  const results = useMemo(() => {
    const toplamMasraf = masraflar.reduce((acc, curr) => acc + (curr.tutar || 0), 0);
    const toplamMaliyet = alisFiyati + toplamMasraf;
    
    const brutKar = satisFiyati - alisFiyati;
    const netKar = satisFiyati - toplamMaliyet;
    const netKarMarji = toplamMaliyet > 0 ? (netKar / toplamMaliyet) * 100 : 0;

    // Mevduat hesaplaması: (Anapara * Gün * Net Faiz) / 36500
    // Brüt faiz üzerinden %7.5 stopaj kesintisi farz ediyoruz (güncel standartlar)
    const netFaizOrani = mevduatFaizi * 0.925; 
    // Faize konacak para = Aracın maliyeti (Sermaye)
    const faizGetirisi = (toplamMaliyet * beklemeSuresi * netFaizOrani) / 36500;

    const firsatFarki = netKar - faizGetirisi;
    const isProfitableVsBank = firsatFarki > 0;

    return {
      toplamMasraf,
      toplamMaliyet,
      brutKar,
      netKar,
      netKarMarji,
      faizGetirisi,
      firsatFarki,
      isProfitableVsBank
    };
  }, [alisFiyati, satisFiyati, beklemeSuresi, mevduatFaizi, masraflar]);

  const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" };
  const secTitle: React.CSSProperties = { fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" };

  return (
    <div className="al-sat-container">
      {/* ── Intro ── */}
      <div style={{ ...card, marginBottom: "16px", background: `linear-gradient(135deg, var(--card-bg) 0%, ${AC_BG} 100%)`, border: `1px solid ${AC_B}` }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: AC_L, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <TrendingUp size={24} color={AC} />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", margin: "0 0 6px 0" }}>
              Araç Al-Sat Yatırım ve Kâr Analizi
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
              Araç alım satımında tüm gizli masrafları hesaplayın, gerçek kârınızı görün ve paranızı banka mevduatına koysaydınız ne olacağı ile kıyaslayarak (Fırsat Maliyeti) doğru kararı verin.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "16px" }}>
        
        {/* ── Temel Girdiler ── */}
        <div style={{ ...card, padding: "20px" }}>
          <div style={secTitle}><ArrowRightLeft size={13} color={AC} /> Alış - Satış ve Süre</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                Araç Alış Fiyatı (TL)
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "600" }}>₺</span>
                <input type="number" min="0" value={alisFiyati || ""} onChange={e => setAlisFiyati(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px 12px 12px 30px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "15px", fontWeight: "600" }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                Tahmini Satış Fiyatı (TL)
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "600" }}>₺</span>
                <input type="number" min="0" value={satisFiyati || ""} onChange={e => setSatisFiyati(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px 12px 12px 30px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "10px", color: "#10B981", fontSize: "15px", fontWeight: "700" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                Tahmini Elde Tutma Süresi
              </label>
              <div style={{ position: "relative" }}>
                <input type="number" min="1" value={beklemeSuresi || ""} onChange={e => setBeklemeSuresi(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px 40px 12px 12px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "15px", fontWeight: "600" }} />
                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "12px", fontWeight: "600" }}>GÜN</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                Alternatif Mevduat Faizi (Yıllık Brüt)
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "600" }}>%</span>
                <input type="number" min="0" step="0.5" value={mevduatFaizi || ""} onChange={e => setMevduatFaizi(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px 12px 12px 30px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "15px", fontWeight: "600" }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Masraflar Tablosu ── */}
        <div style={{ ...card, padding: "20px" }}>
          <div style={secTitle}><Wallet size={13} color={AC} /> Araç Üzerindeki Masraflar</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            {masraflar.map(m => (
              <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "12px", alignItems: "center", background: "var(--secondary)", padding: "10px 16px", borderRadius: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>{m.isim}</span>
                <div style={{ position: "relative", width: "120px" }}>
                  <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "600", fontSize: "12px" }}>₺</span>
                  <input 
                    type="number" min="0" value={m.tutar === 0 ? "" : m.tutar} 
                    onChange={e => updateMasraf(m.id, Number(e.target.value))}
                    placeholder="0"
                    style={{ width: "100%", padding: "8px 8px 8px 24px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", color: "var(--foreground)", fontSize: "13px", fontWeight: "600" }} 
                  />
                </div>
                <button onClick={() => removeMasraf(m.id)} style={{ padding: "6px", background: "rgba(239, 68, 68, 0.1)", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex" }}>
                  <Trash2 size={14} color="#EF4444" />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: "8px", alignItems: "end", background: "var(--card-bg)", padding: "12px", borderRadius: "10px", border: `1px dashed ${AC_B}` }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>Ek Masraf Adı</label>
              <input type="text" placeholder="Örn: Nakliye, Komisyon" value={customIsim} onChange={e => setCustomIsim(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "6px", color: "var(--foreground)", fontSize: "12px" }} />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>Tutar (TL)</label>
              <input type="number" placeholder="0" value={customTutar} onChange={e => setCustomTutar(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "6px", color: "var(--foreground)", fontSize: "12px" }} />
            </div>
            <button onClick={handleAddMasraf} disabled={!customIsim.trim()} style={{
              padding: "8px 12px", background: customIsim.trim() ? AC : "var(--card-border)", color: "white", 
              borderRadius: "6px", border: "none", fontWeight: "600", cursor: customIsim.trim() ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: "4px", fontSize: "12px"
            }}>
              <Plus size={14} /> Ekle
            </button>
          </div>
        </div>

      </div>

      {/* ── Results ── */}
      <div style={{ ...card, border: `2px solid ${AC}`, background: "var(--card-bg)", position: "relative", overflow: "hidden" }}>
        
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
            Net Kâr Tutarı
          </div>
          <div style={{ fontSize: "48px", fontWeight: "900", color: results.netKar > 0 ? "#10B981" : "#EF4444", lineHeight: 1 }}>
            {results.netKar > 0 ? "+" : ""}{"\u20BA"}{results.netKar.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
          </div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", marginTop: "8px" }}>
            Maliyet Üzerinden Net Kâr Marjı: <span style={{ color: results.netKar > 0 ? "#10B981" : "#EF4444" }}>%{results.netKarMarji.toFixed(1)}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderTop: "1px solid var(--card-border)", paddingTop: "20px", marginBottom: "20px" }}>
          <div style={{ background: "var(--secondary)", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Araç Alış Fiyatı:</span>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)" }}>{"\u20BA"}{alisFiyati.toLocaleString("tr-TR")}</span>
          </div>
          <div style={{ background: "var(--secondary)", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Toplam Masraf:</span>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#EF4444" }}>+ {"\u20BA"}{results.toplamMasraf.toLocaleString("tr-TR")}</span>
          </div>
        </div>

        <div style={{ background: "var(--secondary)", border: "1px solid var(--card-border)", padding: "16px", borderRadius: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Sermaye (Toplam Maliyet):</span>
          <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--foreground)" }}>{"\u20BA"}{results.toplamMaliyet.toLocaleString("tr-TR")}</span>
        </div>

        {/* ── Fırsat Maliyeti Analizi (Opportunity Cost) ── */}
        <div style={{ background: results.isProfitableVsBank ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)", border: `1px solid ${results.isProfitableVsBank ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`, borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Scale size={18} color={results.isProfitableVsBank ? "#10B981" : "#EF4444"} />
            <h3 style={{ fontSize: "14px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>Banka Mevduat Faizi Kıyaslaması (Fırsat Maliyeti)</h3>
          </div>

          <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "16px" }}>
            Toplam <strong>{"\u20BA"}{results.toplamMaliyet.toLocaleString("tr-TR")}</strong> sermayenizi {beklemeSuresi} gün boyunca arabaya bağlamak yerine brüt <strong>%{mevduatFaizi}</strong> (%7.5 stopaj kesintili) faizle mevduata koysaydınız:
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div style={{ background: "var(--card-bg)", padding: "12px", borderRadius: "10px", border: "1px solid var(--card-border)" }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px" }}>Araç Al-Sat Net Kârınız</div>
              <div style={{ fontSize: "18px", fontWeight: "800", color: results.netKar > 0 ? "#10B981" : "#EF4444" }}>{"\u20BA"}{results.netKar.toLocaleString("tr-TR", {maximumFractionDigits:0})}</div>
            </div>
            <div style={{ background: "var(--card-bg)", padding: "12px", borderRadius: "10px", border: "1px solid var(--card-border)" }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px" }}>Banka Mevduat Getirisi</div>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)" }}>{"\u20BA"}{results.faizGetirisi.toLocaleString("tr-TR", {maximumFractionDigits:0})}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: results.isProfitableVsBank ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", padding: "12px", borderRadius: "10px" }}>
            {results.isProfitableVsBank ? <CheckCircle size={20} color="#10B981" style={{ flexShrink: 0 }} /> : <AlertCircle size={20} color="#EF4444" style={{ flexShrink: 0 }} />}
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: results.isProfitableVsBank ? "#10B981" : "#EF4444", marginBottom: "4px" }}>
                {results.isProfitableVsBank ? "Araç al-sat işlemi daha kârlı." : "Sermayeyi faizde tutmak daha kârlı."}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.4" }}>
                Bu yatırımı yaparak risksiz faiz getirisine kıyasla <strong>{"\u20BA"}{Math.abs(results.firsatFarki).toLocaleString("tr-TR", {maximumFractionDigits:0})}</strong> daha {results.isProfitableVsBank ? "fazla kazandınız." : "az kazandınız (zarar ettiniz). İşlem eforunuza değmeyebilir."}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
