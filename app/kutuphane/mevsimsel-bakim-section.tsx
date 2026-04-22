"use client";

import { useState } from "react";
import { Snowflake, Sun, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface SeasonItem {
  kategori: string;
  icon: string;
  kis: { durum: "yap" | "yapma" | "kontrol"; text: string }[];
  yaz: { durum: "yap" | "yapma" | "kontrol"; text: string }[];
}

const MEVSIM_DATA: SeasonItem[] = [
  {
    kategori: "Lastikler",
    icon: "🔵",
    kis: [
      { durum: "yap", text: "Kış lastiği tak (7°C altında)" },
      { durum: "yap", text: "Diş derinliğini kontrol et (min 4 mm)" },
      { durum: "yap", text: "Basıncı soğuk havada kontrol et (soğukta düşer)" },
      { durum: "yapma", text: "Yaz lastiğiyle kar/buz yoluna çıkma" },
    ],
    yaz: [
      { durum: "yap", text: "Yaz lastiğine geç (7°C üstünde)" },
      { durum: "yap", text: "Tüm lastiklerde basınç dengeli mi?" },
      { durum: "kontrol", text: "Sıcakta lastik basıncı artar — aşırı şişme riski" },
      { durum: "yapma", text: "Kış lastiğiyle sıcak asfalt — aşınır ve tutunma azalır" },
    ],
  },
  {
    kategori: "Motor & Soğutma",
    icon: "⚙️",
    kis: [
      { durum: "yap", text: "Antifriz oranını kontrol et / ölç (-30°C'ye göre)" },
      { durum: "yap", text: "Soğuk havalarda motoru 30–60 saniye ısıt" },
      { durum: "kontrol", text: "Akü voltajını ölç (soğuk havada akü zayıflar)" },
      { durum: "yapma", text: "Kapalı garajda motoru çalıştırıp bekleme" },
    ],
    yaz: [
      { durum: "yap", text: "Soğutma suyunu kontrol et (seviye + renk)" },
      { durum: "yap", text: "Radyatörü ve fanı kontrol et" },
      { durum: "yapma", text: "Araç ısınınca soğutma suyu kapağını açma" },
      { durum: "kontrol", text: "Motor ısısı göstergesi orta seviyede kalmalı" },
    ],
  },
  {
    kategori: "Fren Sistemi",
    icon: "🔴",
    kis: [
      { durum: "yap", text: "Buz ve karda fren mesafesi artar — ihtiyatlı sür" },
      { durum: "yap", text: "ABS'siz araçlarda kademeli fren kullan" },
      { durum: "kontrol", text: "El frenini ıslak/soğuk havalarda sıkma (donar)" },
      { durum: "yapma", text: "Buz üzerinde aniden frenleme — çak kayar" },
    ],
    yaz: [
      { durum: "yap", text: "Fren balatalarını yaz başında kontrol et" },
      { durum: "kontrol", text: "Uzun iniş yollarında motorla fren (ısınma riski)" },
      { durum: "yapma", text: "Çok sıcak diskli frenleri soğuk suyla dondurma" },
    ],
  },
  {
    kategori: "Klima & Isıtma",
    icon: "❄️",
    kis: [
      { durum: "yap", text: "Kaloriferi test et — soğukta çalışıyor mu?" },
      { durum: "yap", text: "Cam buğu çözücüyü test et (ön ve arka)" },
      { durum: "kontrol", text: "Klima yazın da çalışmalıydı — kışa girmeden test et" },
      { durum: "yap", text: "Silecekleri kış modeli ile değiştir" },
    ],
    yaz: [
      { durum: "yap", text: "Klimayı mevsim başında çalıştır — gaz kontrolü" },
      { durum: "yap", text: "Filtreli modellerde klima poleni temizle" },
      { durum: "kontrol", text: "Kötü klima kokusu — içerde bakteri üremesi olabilir" },
      { durum: "yapma", text: "Arabayı kapalı güneşte bırakıp klimayı maxlama" },
    ],
  },
  {
    kategori: "Cam & Görüş",
    icon: "🔍",
    kis: [
      { durum: "yap", text: "Cam suyuna antifriz katkı ekle (-20°C)" },
      { durum: "yap", text: "Silecekleri ve lastiklerini kontrol et" },
      { durum: "yapma", text: "Buz eritici spreyi yakıt deposuna dökme" },
      { durum: "yap", text: "Arabayı dışarıda bırakıyorsan silecekleri kaldır" },
    ],
    yaz: [
      { durum: "yap", text: "Cam suyunu böcek önleyici ile doldur" },
      { durum: "kontrol", text: "Güneş kremi camı bulanıklaştırabilir — temizle" },
      { durum: "yap", text: "Güneşlik kullan — iç ısıyı ciddi düşürür" },
    ],
  },
];

const RenkIcon = ({ durum }: { durum: "yap" | "yapma" | "kontrol" }) => {
  if (durum === "yap") return <CheckCircle size={14} color="#10B981" style={{ flexShrink: 0 }} />;
  if (durum === "yapma") return <XCircle size={14} color="#EF4444" style={{ flexShrink: 0 }} />;
  return <AlertTriangle size={14} color="#F59E0B" style={{ flexShrink: 0 }} />;
};

const renkMap = {
  yap: "#10B981",
  yapma: "#EF4444",
  kontrol: "#F59E0B",
};

export default function MevsimselBakimSection() {
  const [aktif, setAktif] = useState<"kis" | "yaz">("kis");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "14px",
          background: aktif === "kis"
            ? "linear-gradient(135deg, #3B82F6, #06B6D4)"
            : "linear-gradient(135deg, #F59E0B, #EF4444)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.4s",
        }}>
          {aktif === "kis" ? <Snowflake size={28} color="white" /> : <Sun size={28} color="white" />}
        </div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>Mevsimsel Bakım Rehberi</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Kış ve yaz koşullarına göre araç hazırlığı — neyi yapmalı, neyi yapmamalısınız?
          </p>
        </div>
      </div>

      {/* Season Toggle */}
      <div style={{
        display: "flex", gap: "0", background: "var(--secondary)",
        borderRadius: "14px", padding: "4px", border: "1px solid var(--card-border)",
        width: "fit-content"
      }}>
        {[
          { key: "kis", label: "❄️ Kış Hazırlığı", color: "#3B82F6" },
          { key: "yaz", label: "☀️ Yaz Hazırlığı", color: "#F59E0B" },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setAktif(key as "kis" | "yaz")}
            style={{
              padding: "12px 28px", borderRadius: "10px", border: "none", cursor: "pointer",
              background: aktif === key ? color : "transparent",
              color: aktif === key ? "white" : "var(--text-muted)",
              fontSize: "14px", fontWeight: "700",
              transition: "all 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {[
          { icon: <CheckCircle size={14} color="#10B981" />, label: "Yapılması Önerilen", color: "#10B981" },
          { icon: <XCircle size={14} color="#EF4444" />, label: "Yapılmaması Gereken", color: "#EF4444" },
          { icon: <AlertTriangle size={14} color="#F59E0B" />, label: "Dikkat Edilecekler", color: "#F59E0B" },
        ].map(({ icon, label, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {icon}
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {MEVSIM_DATA.map((cat) => {
          const items = aktif === "kis" ? cat.kis : cat.yaz;
          const activeColor = aktif === "kis" ? "#3B82F6" : "#F59E0B";
          return (
            <div key={cat.kategori} style={{
              background: "var(--card-bg)", border: "1px solid var(--card-border)",
              borderRadius: "16px", overflow: "hidden"
            }}>
              <div style={{
                padding: "14px 20px",
                background: `${activeColor}0a`,
                borderBottom: `1px solid ${activeColor}20`,
                display: "flex", alignItems: "center", gap: "10px"
              }}>
                <span style={{ fontSize: "20px" }}>{cat.icon}</span>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>{cat.kategori}</h3>
                <span style={{ marginLeft: "auto", padding: "2px 8px", background: `${activeColor}15`, color: activeColor, fontSize: "11px", fontWeight: "700", borderRadius: "6px" }}>
                  {items.length} madde
                </span>
              </div>
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <div style={{ marginTop: "2px" }}>
                      <RenkIcon durum={item.durum} />
                    </div>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                      <span style={{ fontWeight: "600", color: renkMap[item.durum] }}>
                        {item.durum === "yap" ? "✓ " : item.durum === "yapma" ? "✗ " : "⚠ "}
                      </span>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Seasonal tip */}
      <div style={{
        display: "flex", gap: "12px", padding: "16px 20px",
        background: aktif === "kis" ? "rgba(59,130,246,0.07)" : "rgba(245,158,11,0.07)",
        border: `1px solid ${aktif === "kis" ? "rgba(59,130,246,0.2)" : "rgba(245,158,11,0.2)"}`,
        borderRadius: "12px"
      }}>
        {aktif === "kis" ? <Snowflake size={18} color="#3B82F6" style={{ flexShrink: 0 }} /> : <Sun size={18} color="#F59E0B" style={{ flexShrink: 0 }} />}
        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
          {aktif === "kis"
            ? "❄️ Kış bakımı için en kritik noktalar: antifriz oranı, kış lastiği ve akü durumu. Bu üçü olmadan karlı yola çıkmayın."
            : "☀️ Yaz aylarında motor ısınma sorunları en sık karşılaşılan problemdir. Soğutma sisteminizi mevsim başında mutlaka kontrol ettirin."}
        </p>
      </div>
    </div>
  );
}
