"use client";

import { useState } from "react";
import { Wrench, CheckCircle, AlertTriangle, Clock, ChevronDown, ChevronUp, Gauge, Car, Zap, Fuel } from "lucide-react";

/* ══════════════════════════════════════
   VEHICLE TYPES
   ══════════════════════════════════════ */
type AracTuru = "benzinli" | "dizel" | "lpg" | "elektrik";

const ARAC_TURLERI: { key: AracTuru; label: string; icon: typeof Car; color: string; gradient: [string, string] }[] = [
  { key: "benzinli", label: "Benzinli", icon: Fuel, color: "#3B82F6", gradient: ["#3B82F6", "#2563EB"] },
  { key: "dizel", label: "Dizel", icon: Fuel, color: "#F59E0B", gradient: ["#F59E0B", "#D97706"] },
  { key: "lpg", label: "LPG / Tüplü", icon: Fuel, color: "#10B981", gradient: ["#10B981", "#059669"] },
  { key: "elektrik", label: "Elektrikli", icon: Zap, color: "#8B5CF6", gradient: ["#8B5CF6", "#7C3AED"] },
];

interface BakimItem {
  islem: string;
  aciklama: string;
  oncelik: "kritik" | "onemli" | "rutin";
}

interface BakimAraligi {
  km: number;
  label: string;
  color: string;
  gradient: string[];
  items: BakimItem[];
}

/* ══════════════════════════════════════
   MAINTENANCE DATA BY TYPE
   ══════════════════════════════════════ */
const BAKIM_MAP: Record<AracTuru, BakimAraligi[]> = {
  benzinli: [
    {
      km: 5000, label: "Her 5.000 km", color: "#F59E0B", gradient: ["#F59E0B", "#F97316"],
      items: [
        { islem: "Motor Yağı Kontrolü", aciklama: "Yağ seviyesini çubuğu ile kontrol edin, renk ve kıvamına bakın.", oncelik: "kritik" },
        { islem: "Soğutma Suyu Kontrolü", aciklama: "Genleşme deposundaki seviyeyi min-max arasında tutun.", oncelik: "kritik" },
        { islem: "Silecek Suyu", aciklama: "Cam suyu deposunu doldurun, kışın antifrizli su kullanın.", oncelik: "rutin" },
        { islem: "Lastik Basıncı", aciklama: "Soğuk lastik basıncını üretici değerine göre ayarlayın (genellikle 2.2\u20132.5 bar).", oncelik: "onemli" },
      ],
    },
    {
      km: 10000, label: "Her 10.000 km", color: "#EF4444", gradient: ["#EF4444", "#DC2626"],
      items: [
        { islem: "Motor Yağı & Filtresi Değişimi", aciklama: "Sentetik yağda 10.000\u201315.000 km, mineral yağda 5.000 km aralığında değişin.", oncelik: "kritik" },
        { islem: "Hava Filtresi Kontrolü", aciklama: "Kirlenmiş hava filtresi tüketimi %10\u201315 artırır.", oncelik: "onemli" },
        { islem: "Ateşleme Bujileri Kontrolü", aciklama: "Bakır bujiler her 20.000 km'de, iridyum bujiler 60.000 km'de değişmeli.", oncelik: "onemli" },
        { islem: "Akü Kontrolü", aciklama: "Akü terminallerini temizleyin, yük testini yaptırın.", oncelik: "rutin" },
      ],
    },
    {
      km: 20000, label: "Her 20.000 km", color: "#3B82F6", gradient: ["#3B82F6", "#2563EB"],
      items: [
        { islem: "Fren Balataları Kontrolü", aciklama: "Aşınma sensörleri varsa uyarı verir; yoksa görsel kontrol yapın.", oncelik: "kritik" },
        { islem: "Polen Filtresi Değişimi", aciklama: "Kabin hava filtresi; iç mekan hava kalitesini doğrudan etkiler.", oncelik: "onemli" },
        { islem: "Yakıt Filtresi", aciklama: "Benzinli araçlarda yakit pompası enjektörü korur.", oncelik: "onemli" },
        { islem: "Süspansiyon Kontrolü", aciklama: "Amortisörler, rotlar ve taşıyıcı kollar kontrol edilmeli.", oncelik: "rutin" },
      ],
    },
    {
      km: 60000, label: "Her 60.000 km", color: "#10B981", gradient: ["#10B981", "#059669"],
      items: [
        { islem: "Triger Kayışı / Zincir", aciklama: "Kopmasi motoru siklet yapar. Kayış: 60\u201380.000 km'de mutlaka değiştirin.", oncelik: "kritik" },
        { islem: "Su Pompası Değişimi", aciklama: "Triger kayışı değişiminde genellikle birlikte yapılır.", oncelik: "kritik" },
        { islem: "Fren Hidroliği Değişimi", aciklama: "Fren sıvısı zamanla nem çeker ve kaynama noktası düşer.", oncelik: "onemli" },
        { islem: "Akü Değişimi", aciklama: "Ortalama akü ömrü 4\u20135 yıl ya da 60.000 km'dir.", oncelik: "onemli" },
      ],
    },
  ],

  dizel: [
    {
      km: 5000, label: "Her 5.000 km", color: "#F59E0B", gradient: ["#F59E0B", "#F97316"],
      items: [
        { islem: "Motor Yağı Kontrolü", aciklama: "Dizel motorlarda yağ daha hızlı kirlenir, sık kontrol edin.", oncelik: "kritik" },
        { islem: "Soğutma Suyu Kontrolü", aciklama: "Turbo motorlarda sıcaklık yönetimi kritiktir.", oncelik: "kritik" },
        { islem: "Lastik Basıncı", aciklama: "Dizel araçlar ağır olduğundan lastik basıncı daha önemlidir.", oncelik: "onemli" },
      ],
    },
    {
      km: 10000, label: "Her 10.000 km", color: "#EF4444", gradient: ["#EF4444", "#DC2626"],
      items: [
        { islem: "Motor Yağı & Filtresi Değişimi", aciklama: "Dizel motorlar için kritik. Kaliteli yağ kullanın.", oncelik: "kritik" },
        { islem: "Yakıt Filtresi Değişimi", aciklama: "Dizel yakıt filtresinin tıkanması pompa arızasına yol açar. Çok kritik!", oncelik: "kritik" },
        { islem: "Hava Filtresi", aciklama: "Turbo verimliliği için temiz hava filtresi şart.", oncelik: "onemli" },
        { islem: "Kızdırma Bujileri Kontrolü", aciklama: "Soğuk havada çalışmayı etkiler, arızalısı motor titreşimine neden olur.", oncelik: "onemli" },
      ],
    },
    {
      km: 20000, label: "Her 20.000 km", color: "#3B82F6", gradient: ["#3B82F6", "#2563EB"],
      items: [
        { islem: "Fren Balataları", aciklama: "Ağır dizel araçlarda balatalar daha hızlı aşınır.", oncelik: "kritik" },
        { islem: "Enjektör Bakımı", aciklama: "Enjektörlerin temizlenmesi yakıt tketimini iyileştirir.", oncelik: "onemli" },
        { islem: "Turbo Kontrolü", aciklama: "Yağ kaçağı, sızıntı ve performans kaybı kontrolü.", oncelik: "onemli" },
        { islem: "DPF Temizliği", aciklama: "Partikül filtresi tıkanması motor arızasına yol açar. Şehir içi kullanımda daha sık.", oncelik: "kritik" },
      ],
    },
    {
      km: 60000, label: "Her 60.000 km", color: "#10B981", gradient: ["#10B981", "#059669"],
      items: [
        { islem: "Triger Kayışı / Zincir", aciklama: "Dizel motorlarda yük fazla, kopma riski yüksek. Zamanında değiştirin.", oncelik: "kritik" },
        { islem: "Su Pompası", aciklama: "Triger ile birlikte değiştirmek ekonomik olur.", oncelik: "kritik" },
        { islem: "EGR Valfi Temizliği", aciklama: "Egzoz gazı geri dönüşüm valfi tıkanırsa performans düşer.", oncelik: "onemli" },
        { islem: "Şanzıman Yağı", aciklama: "Otomatik şanzımanlarda 60K'da değiştirin.", oncelik: "onemli" },
      ],
    },
  ],

  lpg: [
    {
      km: 5000, label: "Her 5.000 km", color: "#F59E0B", gradient: ["#F59E0B", "#F97316"],
      items: [
        { islem: "Motor Yağı Kontrolü", aciklama: "LPG'li araçlarda yağ daha hızlı bozulabilir, sık kontrol edin.", oncelik: "kritik" },
        { islem: "LPG Kaçak Kontrolü", aciklama: "Sabunlu su testi ile hortum bağlantılarını kontrol edin.", oncelik: "kritik" },
        { islem: "Soğutma Suyu", aciklama: "LPG'li motorlar daha sıcak çalışır, soğutma kritiktir.", oncelik: "onemli" },
      ],
    },
    {
      km: 10000, label: "Her 10.000 km", color: "#EF4444", gradient: ["#EF4444", "#DC2626"],
      items: [
        { islem: "Motor Yağı & Filtresi", aciklama: "LPG'li araçlarda 8.000\u201310.000 km aralığında değişin. LPG'ye uygun yağ seçin.", oncelik: "kritik" },
        { islem: "LPG Filtresi Değişimi", aciklama: "Sıvı ve buhar fazı filtreleri her 10K'da değişmeli.", oncelik: "kritik" },
        { islem: "Bujiler Kontrolü", aciklama: "LPG bujilere daha fazla yük bindirir, sık kontrol edin.", oncelik: "onemli" },
        { islem: "Hava Filtresi", aciklama: "Kirlenmiş hava filtresi gaz-hava karışımını bozar.", oncelik: "onemli" },
      ],
    },
    {
      km: 20000, label: "Her 20.000 km", color: "#3B82F6", gradient: ["#3B82F6", "#2563EB"],
      items: [
        { islem: "LPG Beyin Bakımı", aciklama: "ECU kalibrasyon kontrolü. Gaz ayıarı düzgün olmalı.", oncelik: "onemli" },
        { islem: "Regülatör (Vaporizatör) Bakımı", aciklama: "Sıvı LPG'yi gaza dönüştürür. Membran ve conta değişimi.", oncelik: "kritik" },
        { islem: "Enjektör Temizliği", aciklama: "LPG enjektörlerini ultrasonik temizleme ile bakım yapın.", oncelik: "onemli" },
        { islem: "Fren Balataları", aciklama: "Standart benzinli araç bakimi gibi kontrol edin.", oncelik: "onemli" },
      ],
    },
    {
      km: 60000, label: "Her 60.000 km", color: "#10B981", gradient: ["#10B981", "#059669"],
      items: [
        { islem: "LPG Tankı Muayenesi", aciklama: "10 yılda bir zorunlu muayene. Tarih geçmişse kesinlikle yaptırın!", oncelik: "kritik" },
        { islem: "Buharlaştırıcı Değişimi", aciklama: "60\u201380K km kullanımdan sonra performans düşüşü başlar.", oncelik: "onemli" },
        { islem: "Triger Kayışı", aciklama: "Benzinli motor bakımı ile aynı şekilde yapılmalı.", oncelik: "kritik" },
        { islem: "Supaplar & Supap Ayarı", aciklama: "LPG'li araçlarda supap yanması riski daha yüksek.", oncelik: "kritik" },
      ],
    },
  ],

  elektrik: [
    {
      km: 10000, label: "Her 10.000 km", color: "#F59E0B", gradient: ["#F59E0B", "#F97316"],
      items: [
        { islem: "Lastik Basıncı & Rotasyon", aciklama: "Elektrikli araçlar ağırdır, lastikler daha hızlı aşınır.", oncelik: "onemli" },
        { islem: "Silecek Sıvısı", aciklama: "Cam suyu deposunu doldurun.", oncelik: "rutin" },
        { islem: "Görsel Kontrol", aciklama: "Şarj kablosu, port ve gövde altı hasar kontrolü.", oncelik: "rutin" },
      ],
    },
    {
      km: 20000, label: "Her 20.000 km", color: "#3B82F6", gradient: ["#3B82F6", "#2563EB"],
      items: [
        { islem: "Kabin Filtresi (Polen)", aciklama: "Tek filtre değişimi. Motor yağı / hava filtresi yoktur.", oncelik: "onemli" },
        { islem: "Fren Sıvısı Kontrolü", aciklama: "Rejeneratif frenleme sayesinde balatalar az aşınır ama sıvı kontrolü gerekir.", oncelik: "onemli" },
        { islem: "Şarj Portu Temizliği", aciklama: "Şarj portunu kuru bez ile temizleyin, toz ve nem birikmesini önleyin.", oncelik: "rutin" },
      ],
    },
    {
      km: 40000, label: "Her 40.000 km", color: "#8B5CF6", gradient: ["#8B5CF6", "#7C3AED"],
      items: [
        { islem: "Fren Balataları", aciklama: "Rejeneratif frenleme sayesinde balatalar 80\u2013100K km dayanabilir.", oncelik: "onemli" },
        { islem: "Süspansiyon", aciklama: "Ağır batarya yükü nedeniyle süspansiyon daha sık kontrol edilmeli.", oncelik: "onemli" },
        { islem: "Soğutma Sistemi", aciklama: "Batarya termal yönetim sıvısı kontrolü.", oncelik: "onemli" },
      ],
    },
    {
      km: 80000, label: "Her 80.000 km", color: "#10B981", gradient: ["#10B981", "#059669"],
      items: [
        { islem: "Batarya Sağlık Raporu", aciklama: "SoH (State of Health) kontrolü yaptırın. %80'ın altına düşmemeli.", oncelik: "kritik" },
        { islem: "Termal Yönetim Sıvısı", aciklama: "Batarya soğutma sıvısını değiştirin.", oncelik: "onemli" },
        { islem: "Motor Rulmanları", aciklama: "Elektrik motoru rulmanlarının kontrolü.", oncelik: "rutin" },
      ],
    },
  ],
};

const ONCELIK_CONFIG = {
  kritik: { label: "Kritik", color: "#F87171", bg: "rgba(248,113,113,0.08)" },
  onemli: { label: "Önemli", color: "#FBBF24", bg: "rgba(251,191,36,0.08)" },
  rutin: { label: "Rutin", color: "#34D399", bg: "rgba(52,211,153,0.08)" },
};

/* ══════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════ */
export default function BakimTakvimiSection() {
  const [aracTuru, setAracTuru] = useState<AracTuru>("benzinli");
  const [currentKm, setCurrentKm] = useState(0);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const data = BAKIM_MAP[aracTuru];
  const turuConfig = ARAC_TURLERI.find(t => t.key === aracTuru)!;

  const toggle = (km: number) => {
    const s = new Set(expanded);
    if (s.has(km)) s.delete(km); else s.add(km);
    setExpanded(s);
  };

  const isDue = (km: number) => currentKm > 0 && currentKm >= km;
  const isUpcoming = (km: number) => {
    if (currentKm <= 0) return false;
    const rem = km - (currentKm % km);
    return rem > 0 && rem <= km * 0.15;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "14px",
          background: `linear-gradient(135deg, ${turuConfig.gradient[0]}, ${turuConfig.gradient[1]})`,
          display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s"
        }}>
          <Wrench size={28} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>Bakım Takvimi</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Araç türüne göre özelleştirilmiş kapsamlı bakım rehberi
          </p>
        </div>
      </div>

      {/* Vehicle Type Selector */}
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--card-border)",
        borderRadius: "16px", padding: "20px"
      }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Car size={13} color="var(--text-muted)" /> Araç Türü
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px" }}>
          {ARAC_TURLERI.map(t => {
            const on = aracTuru === t.key;
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => { setAracTuru(t.key); setExpanded(new Set([0])); }}
                style={{
                  padding: "14px 10px", borderRadius: "12px",
                  border: `2px solid ${on ? t.color : "var(--card-border)"}`,
                  background: on ? `${t.color}12` : "var(--secondary)",
                  cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                }}>
                <Icon size={18} color={on ? t.color : "var(--text-muted)"} style={{ marginBottom: "4px" }} />
                <div style={{ fontSize: "12px", fontWeight: "700", color: on ? t.color : "var(--foreground)" }}>{t.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Km Input */}
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--card-border)",
        borderRadius: "16px", padding: "24px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <Gauge size={20} color={turuConfig.color} />
          <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)" }}>
            Mevcut kilometre:
          </span>
          <input
            type="number" placeholder="örn: 85000" min={0}
            onChange={(e) => setCurrentKm(Number(e.target.value))}
            style={{
              padding: "8px 14px", background: "var(--secondary)",
              border: "1px solid var(--card-border)", borderRadius: "10px",
              color: "var(--foreground)", fontSize: "15px", fontWeight: "600",
              outline: "none", width: "160px",
            }}
          />
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {currentKm > 0 ? `${currentKm.toLocaleString("tr-TR")} km girildi` : "Girerek yaklaşan bakımları görün"}
          </span>
        </div>

        {currentKm > 0 && (
          <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
            {data.map(({ km, color, label }) => {
              const dueCount = Math.floor(currentKm / km);
              const nextAt = (dueCount + 1) * km;
              const rem = nextAt - currentKm;
              const pct = ((km - rem) / km) * 100;
              return (
                <div key={km} style={{
                  flex: "1", minWidth: "130px", padding: "12px", borderRadius: "12px",
                  background: isDue(nextAt - km) ? `${color}12` : "var(--secondary)",
                  border: `1px solid ${color}40`,
                }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color, marginBottom: "6px", textTransform: "uppercase" }}>{label}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Sonraki: <strong style={{ color: "var(--foreground)" }}>{nextAt.toLocaleString("tr-TR")} km</strong></div>
                  <div style={{ marginTop: "8px", height: "4px", background: "var(--card-border)", borderRadius: "2px" }}>
                    <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: color, borderRadius: "2px", transition: "width 0.4s" }} />
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{rem.toLocaleString("tr-TR")} km kaldı</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Maintenance List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {data.map(({ km, label, color, gradient, items }) => {
          const isOpen = expanded.has(km);
          const kritikSayisi = items.filter(i => i.oncelik === "kritik").length;
          return (
            <div key={km} style={{
              background: "var(--card-bg)",
              border: `1px solid ${isDue(km) ? color : "var(--card-border)"}`,
              borderRadius: "16px", overflow: "hidden", transition: "border-color 0.2s",
            }}>
              <button onClick={() => toggle(km)} style={{
                width: "100%", padding: "20px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "transparent", border: "none", cursor: "pointer", color: "var(--foreground)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <Clock size={20} color="white" />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h3 style={{ fontSize: "17px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>{label}</h3>
                      {isDue(km) && (
                        <span style={{ padding: "2px 8px", background: `${color}20`, color, fontSize: "11px", fontWeight: "700", borderRadius: "6px" }}>ZAMANI GELDİ</span>
                      )}
                      {isUpcoming(km) && !isDue(km) && (
                        <span style={{ padding: "2px 8px", background: "rgba(245,158,11,0.15)", color: "#F59E0B", fontSize: "11px", fontWeight: "700", borderRadius: "6px" }}>YAKLAŞIYOR</span>
                      )}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {items.length} bakım işlemi {kritikSayisi > 0 && <>&bull; <span style={{ color: "#EF4444" }}>{kritikSayisi} kritik</span></>}
                    </div>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
              </button>

              {isOpen && (
                <div style={{ padding: "0 24px 24px 24px", borderTop: "1px solid var(--card-border)" }}>
                  <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {items.map((item, idx) => {
                      const cfg = ONCELIK_CONFIG[item.oncelik];
                      return (
                        <div key={idx} style={{
                          display: "flex", alignItems: "flex-start", gap: "14px",
                          padding: "14px", borderRadius: "12px",
                          background: cfg.bg, border: `1px solid ${cfg.color}25`,
                        }}>
                          <div style={{
                            padding: "2px 8px", borderRadius: "6px",
                            background: `${cfg.color}20`, color: cfg.color,
                            fontSize: "10px", fontWeight: "800", textTransform: "uppercase",
                            whiteSpace: "nowrap", flexShrink: 0, marginTop: "1px"
                          }}>{cfg.label}</div>
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--foreground)", marginBottom: "4px" }}>{item.islem}</div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>{item.aciklama}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info */}
      {aracTuru === "elektrik" && (
        <div style={{ display: "flex", gap: "10px", padding: "14px 18px", background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "12px" }}>
          <Zap size={16} color="#8B5CF6" style={{ flexShrink: 0, marginTop: "1px" }} />
          <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
            Elektrikli araçlarda motor yağı, buji, triger kayışı gibi geleneksel bakım kalemleri <strong style={{ color: "var(--foreground)" }}>bulunmaz</strong>. Bakım maliyetleri içten yanmalı motorlara göre %30\u201350 daha düşüktür.
          </p>
        </div>
      )}

      <div style={{
        display: "flex", gap: "10px", padding: "14px 18px",
        background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "12px"
      }}>
        <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: "1px" }} />
        <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
          Bu takvim genel bir rehber niteliğindedir. Aracınızın kullanım kılavuzunu ve yetkili servis önerilerini öncelikle dikkate alın.
        </p>
      </div>
    </div>
  );
}
