"use client";

import { useState, useMemo } from "react";
import { Wrench, Settings, Droplet, Filter, Zap, Disc, Trash2, Plus, Calculator, Banknote, HelpCircle } from "lucide-react";

/* ── Accent Colors ── */
const AC = "#6366F1"; // Indigo for Maintenance
const AC_L = "rgba(99,102,241,0.08)";
const AC_B = "rgba(99,102,241,0.20)";
const AC_BG = "rgba(99,102,241,0.04)";

const COMMON_ITEMS = [
  { id: "yag", label: "Motor Yağı", icon: Droplet },
  { id: "yag_filtre", label: "Yağ Filtresi", icon: Filter },
  { id: "hava_filtre", label: "Hava Filtresi", icon: Filter },
  { id: "polen_filtre", label: "Polen Filtresi", icon: Filter },
  { id: "yakit_filtre", label: "Yakıt / Mazot Filtresi", icon: Filter },
  { id: "buji", label: "Buji Takımı", icon: Zap },
  { id: "balata_on", label: "Ön Fren Balatası", icon: Disc },
  { id: "balata_arka", label: "Arka Fren Balatası", icon: Disc },
  { id: "triger", label: "Triger Seti", icon: Settings },
  { id: "sivi", label: "Antifriz / Soğutma Sıvısı", icon: Droplet },
];

type AddedItem = {
  id: string;
  label: string;
  cost: number;
  icon: any;
};

export default function AracBakimSection() {
  const [items, setItems] = useState<AddedItem[]>([]);
  const [iscilik, setIscilik] = useState<number>(0);
  const [kdvDahil, setKdvDahil] = useState<boolean>(true);
  
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  const handleAddItem = (itemInfo: typeof COMMON_ITEMS[0]) => {
    if (items.find(i => i.id === itemInfo.id)) return;
    setItems([...items, { ...itemInfo, cost: 0 }]);
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    setItems([...items, { 
      id: "custom_" + Date.now(), 
      label: customName, 
      cost: Number(customPrice) || 0, 
      icon: Wrench 
    }]);
    setCustomName("");
    setCustomPrice("");
  };

  const updateCost = (id: string, newCost: number) => {
    setItems(items.map(i => i.id === id ? { ...i, cost: newCost } : i));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const results = useMemo(() => {
    const parcaToplami = items.reduce((acc, curr) => acc + (curr.cost || 0), 0);
    const guncelIscilik = iscilik || 0;
    const araToplam = parcaToplami + guncelIscilik;
    
    // Eğer girilen fiyatlara KDV dahil değilse %20 ekle
    const kdvTutari = kdvDahil ? 0 : araToplam * 0.20;
    const genelToplam = araToplam + kdvTutari;

    return { parcaToplami, araToplam, kdvTutari, genelToplam };
  }, [items, iscilik, kdvDahil]);

  const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" };
  const secTitle: React.CSSProperties = { fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" };

  return (
    <div className="arac-bakim-container">
      {/* ── Intro ── */}
      <div style={{ ...card, marginBottom: "16px", background: `linear-gradient(135deg, var(--card-bg) 0%, ${AC_BG} 100%)`, border: `1px solid ${AC_B}` }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: AC_L, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Wrench size={24} color={AC} />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", margin: "0 0 6px 0" }}>
              Araç Bakım Maliyeti Hesaplama
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
              Servisten aldığınız fiyat tekliflerini veya değiştireceğiniz parçaların tutarlarını girerek kendi bakım maliyeti tablonuzu oluşturun.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "16px" }}>
        
        {/* ── Parça Ekleme Alanı ── */}
        <div style={{ ...card, padding: "20px" }}>
          <div style={secTitle}><Plus size={13} color={AC} /> Listeye Parça / İşlem Ekle</div>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
            {COMMON_ITEMS.map(item => {
              const isAdded = items.some(i => i.id === item.id);
              const Icon = item.icon;
              return (
                <button 
                  key={item.id} 
                  onClick={() => handleAddItem(item)}
                  disabled={isAdded}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "8px 12px", borderRadius: "20px", 
                    border: `1px solid ${isAdded ? "transparent" : "var(--card-border)"}`,
                    background: isAdded ? "var(--secondary)" : "transparent", 
                    color: isAdded ? "var(--text-muted)" : "var(--foreground)",
                    opacity: isAdded ? 0.6 : 1,
                    fontSize: "12px", fontWeight: "600", cursor: isAdded ? "not-allowed" : "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { if(!isAdded) { e.currentTarget.style.background = AC_L; e.currentTarget.style.borderColor = AC_B; e.currentTarget.style.color = AC; }}}
                  onMouseLeave={e => { if(!isAdded) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.color = "var(--foreground)"; }}}
                >
                  <Icon size={14} /> {item.label} {isAdded ? "Eklendi" : "+"}
                </button>
              )
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: "8px", alignItems: "end", background: "var(--secondary)", padding: "12px", borderRadius: "12px", border: "1px dashed var(--card-border)" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>Özel İşlem Adı (Örn: Rot Ayarı)</label>
              <input type="text" placeholder="İşlem adı girin" value={customName} onChange={e => setCustomName(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--foreground)", fontSize: "13px" }} />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>Tutar (TL)</label>
              <input type="number" placeholder="0" value={customPrice} onChange={e => setCustomPrice(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--foreground)", fontSize: "13px" }} />
            </div>
            <button onClick={handleAddCustom} disabled={!customName.trim()} style={{
              padding: "10px 16px", background: customName.trim() ? AC : "var(--card-border)", color: "white", 
              borderRadius: "8px", border: "none", fontWeight: "600", cursor: customName.trim() ? "pointer" : "not-allowed"
            }}>
              Ekle
            </button>
          </div>
        </div>

        {/* ── Fiyatlandırma Tablosu ── */}
        <div style={{ ...card, padding: "20px" }}>
          <div style={secTitle}><Calculator size={13} color={AC} /> Bakım Listesi & Ücretler</div>
          
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", border: "1px dashed var(--card-border)", borderRadius: "12px", color: "var(--text-muted)", fontSize: "13px" }}>
              Yukarıdan bakım yapılacak parçaları ekleyerek fiyatlarını girmeye başlayın.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "12px", alignItems: "center", background: "var(--secondary)", padding: "12px 16px", borderRadius: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ background: AC_L, padding: "6px", borderRadius: "8px" }}><Icon size={16} color={AC} /></div>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--foreground)" }}>{item.label}</span>
                    </div>
                    <div style={{ position: "relative", width: "130px" }}>
                      <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "600", fontSize: "13px" }}>₺</span>
                      <input 
                        type="number" min="0" value={item.cost || ""} 
                        onChange={e => updateCost(item.id, Number(e.target.value))}
                        placeholder="Fiyat girin"
                        style={{ width: "100%", padding: "10px 10px 10px 24px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--foreground)", fontSize: "14px", fontWeight: "600" }} 
                      />
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ padding: "8px", background: "rgba(239, 68, 68, 0.1)", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Trash2 size={16} color="#EF4444" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* İşçilik & KDV Ayarları */}
          <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderTop: "1px solid var(--card-border)", paddingTop: "20px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                Toplam İşçilik Ücreti
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: "600" }}>₺</span>
                <input type="number" min="0" value={iscilik || ""} onChange={e => setIscilik(Number(e.target.value))} placeholder="0"
                  style={{ width: "100%", padding: "12px 12px 12px 30px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "15px", fontWeight: "600" }} />
              </div>
            </div>
            
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                Girilen Fiyatlara KDV Dahil mi?
              </label>
              <div style={{ display: "flex", gap: "8px", height: "45px" }}>
                <button onClick={() => setKdvDahil(true)} style={{
                  flex: 1, borderRadius: "10px", border: `1.5px solid ${kdvDahil ? AC : "var(--card-border)"}`,
                  background: kdvDahil ? AC_L : "var(--secondary)", color: kdvDahil ? AC : "var(--text-muted)",
                  fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s"
                }}>Dahil</button>
                <button onClick={() => setKdvDahil(false)} style={{
                  flex: 1, borderRadius: "10px", border: `1.5px solid ${!kdvDahil ? AC : "var(--card-border)"}`,
                  background: !kdvDahil ? AC_L : "var(--secondary)", color: !kdvDahil ? AC : "var(--text-muted)",
                  fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s"
                }}>Hariç (+%20)</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Results ── */}
      <div style={{ ...card, border: `2px solid ${AC}`, background: "var(--card-bg)", position: "relative", overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
            Genel Toplam Tutar
          </div>
          <div style={{ fontSize: "48px", fontWeight: "900", color: AC, lineHeight: 1 }}>
            {"\u20BA"}{results.genelToplam.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
          </div>
        </div>

        {/* Özet Tablo */}
        <div style={{ background: AC_L, border: `1px solid ${AC_B}`, padding: "16px", borderRadius: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
            <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>Parça Toplamı:</span>
            <span style={{ color: "var(--foreground)", fontWeight: "700" }}>{"\u20BA"}{results.parcaToplami.toLocaleString("tr-TR")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
            <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>İşçilik Ücreti:</span>
            <span style={{ color: "var(--foreground)", fontWeight: "700" }}>{"\u20BA"}{(iscilik||0).toLocaleString("tr-TR")}</span>
          </div>
          {!kdvDahil && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
              <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>KDV Eklenmesi (%20):</span>
              <span style={{ color: "var(--foreground)", fontWeight: "700" }}>+ {"\u20BA"}{results.kdvTutari.toLocaleString("tr-TR", {maximumFractionDigits:0})}</span>
            </div>
          )}
          <div style={{ borderTop: `1px dashed ${AC_B}`, margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px" }}>
            <span style={{ color: AC, fontWeight: "800" }}>Ödenecek Tutar:</span>
            <span style={{ color: AC, fontWeight: "900" }}>{"\u20BA"}{results.genelToplam.toLocaleString("tr-TR", {maximumFractionDigits:0})}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
