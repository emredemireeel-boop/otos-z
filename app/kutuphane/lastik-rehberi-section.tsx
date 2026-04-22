"use client";

import { useState } from "react";
import { Circle, Info, Thermometer, AlertTriangle } from "lucide-react";

interface TireSize {
  genislik: number;
  profil: number;
  cap: number;
}

function parseTireSize(input: string): TireSize | null {
  const m = input.replace(/\s/g, "").match(/^(\d{3})\/?(\d{2})[Rr](\d{2})$/);
  if (!m) return null;
  return { genislik: parseInt(m[1]), profil: parseInt(m[2]), cap: parseInt(m[3]) };
}

const PRESSURE_GUIDE = [
  { tip: "Binek Araç (küçük)", on: "29–32 psi", arka: "28–30 psi", icon: "🚗" },
  { tip: "Binek Araç (orta/büyük)", on: "32–36 psi", arka: "30–35 psi", icon: "🚙" },
  { tip: "SUV / Crossover", on: "35–41 psi", arka: "33–39 psi", icon: "🚐" },
  { tip: "Minivan / Van", on: "38–44 psi", arka: "44–51 psi", icon: "🚌" },
  { tip: "Pikap / 4x4", on: "32–41 psi", arka: "35–46 psi (yüke göre)", icon: "🛻" },
];

const SEASON_DATA = [
  {
    label: "Kış Lastiği",
    color: "#3B82F6",
    icon: "❄️",
    when: "Kasım – Mart arası veya sürekli sıcaklık 7°C altında",
    pros: ["Kar ve buzda kısa fren mesafesi", "Islak/soğuk zeminde üstün tutuş", "Sert lastik bileşiği düşük sıcaklıkta esnek kalır"],
    cons: ["Sıcak havalarda hızlı aşınır", "Yüksek hızda sürüş konforu azalır", "Yakıt tüketimi hafif artar"],
    yasal: "Türkiye'de yasal zorunluluk yoktur ama şiddetle tavsiye edilir.",
  },
  {
    label: "Yaz Lastiği",
    color: "#F59E0B",
    icon: "☀️",
    when: "Nisan – Ekim arası, sıcaklık sürekli 7°C üstü",
    pros: ["Sıcak zeminde mükemmel tutuş", "Düşük yakıt tüketimi", "Yüksek hız performansı"],
    cons: ["Soğukta sertleşir, yol tutuşu düşer", "Kar ve buzda tehlikelidir", "Islak soğuk zeminde fren yolu uzar"],
    yasal: "Yazın kış lastiği kullanmak yasak değil ama pratik değil.",
  },
  {
    label: "4 Mevsim Lastik",
    color: "#10B981",
    icon: "🔄",
    when: "Ilıman iklimlerde, kar nadiren düşen şehirlerde",
    pros: ["Yıl boyu tek lastik", "Değişim maliyeti yok", "Hafif kar/soğukta kabul edilebilir performans"],
    cons: ["Kışta kış lastiği kadar iyi değil", "Yazın yaz lastiği kadar iyi değil", "Her iki koşulda da uzlaşı sunar"],
    yasal: "Her iki mevsim için yasaldır.",
  },
];

const TREAD_DEPTH = [
  { mm: "8+ mm", durum: "Yeni", color: "#10B981", aciklama: "Mükemmel tüm hava koşulları performansı" },
  { mm: "4–8 mm", durum: "İyi", color: "#3B82F6", aciklama: "Normal performans, koşulları izleyin" },
  { mm: "2–4 mm", durum: "Değiştirin", color: "#F59E0B", aciklama: "Islak performans azalıyor, kış lastiği olarak kullanmayın" },
  { mm: "< 2 mm", durum: "TEHLİKELİ", color: "#EF4444", aciklama: "Yasal sınır 1.6 mm — acil değişim gerekiyor!" },
];

export default function LastikRehberiSection() {
  const [tireInput, setTireInput] = useState("");
  const parsed = parseTireSize(tireInput);

  const sideWallMm = parsed ? (parsed.genislik * parsed.profil) / 100 : null;
  const disCapMm = parsed ? parsed.cap * 25.4 + (sideWallMm! * 2) : null;
  const circumMm = disCapMm ? Math.PI * disCapMm : null;
  const hizKm = circumMm ? ((circumMm * 1000) / 1000).toFixed(0) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "14px",
          background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Circle size={28} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>Lastik Rehberi</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Lastik kodu çözücü, mevsim seçimi, basınç tablosu ve diş derinliği rehberi
          </p>
        </div>
      </div>

      {/* Tire Code Decoder */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Info size={16} color="#6366F1" /> Lastik Kodu Çözücü
        </h3>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
          Örnek: <strong style={{ color: "var(--foreground)" }}>205/55R16</strong> — yan duvarınızdaki kodu girin
        </p>
        <input
          type="text"
          placeholder="205/55R16"
          value={tireInput}
          onChange={(e) => setTireInput(e.target.value.toUpperCase())}
          style={{
            padding: "12px 16px",
            background: "var(--secondary)",
            border: `2px solid ${parsed ? "#6366F1" : "var(--card-border)"}`,
            borderRadius: "12px",
            color: "var(--foreground)",
            fontSize: "18px",
            fontWeight: "700",
            outline: "none",
            width: "220px",
            letterSpacing: "2px",
          }}
        />

        {parsed && (
          <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {[
              { label: "Genişlik", value: `${parsed.genislik} mm`, sub: "lastik eni" },
              { label: "Profil / Kesit", value: `%${parsed.profil}`, sub: `= ${sideWallMm?.toFixed(0)} mm yan duvar` },
              { label: "Jant Çapı", value: `${parsed.cap}"`, sub: `= ${(parsed.cap * 25.4).toFixed(0)} mm` },
              { label: "Dış Çap", value: `${disCapMm?.toFixed(0)} mm`, sub: `≈ ${(disCapMm! / 10).toFixed(1)} cm` },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "16px", borderRadius: "12px",
                background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
              }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#6366F1", textTransform: "uppercase", marginBottom: "6px" }}>{item.label}</div>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--foreground)" }}>{item.value}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{item.sub}</div>
              </div>
            ))}
          </div>
        )}

        {tireInput.length > 2 && !parsed && (
          <div style={{ marginTop: "12px", display: "flex", gap: "8px", alignItems: "center" }}>
            <AlertTriangle size={14} color="#F59E0B" />
            <span style={{ fontSize: "12px", color: "#F59E0B" }}>Geçersiz format. 205/55R16 gibi girin.</span>
          </div>
        )}
      </div>

      {/* Pressure Guide */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Thermometer size={16} color="#F59E0B" /> Tavsiye Edilen Lastik Basınçları
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                {["Araç Tipi", "Ön Lastik", "Arka Lastik"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRESSURE_GUIDE.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < PRESSURE_GUIDE.length - 1 ? "1px solid var(--card-border)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px", fontSize: "14px", color: "var(--foreground)" }}>
                    <span style={{ marginRight: "8px" }}>{row.icon}</span>{row.tip}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#3B82F6" }}>{row.on}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#8B5CF6" }}>{row.arka}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(59,130,246,0.08)", borderRadius: "10px", fontSize: "12px", color: "var(--text-muted)", display: "flex", gap: "8px" }}>
          <Info size={14} color="#3B82F6" style={{ flexShrink: 0 }} />
          <span>Basıncı soğuk lastik üzerinde ölçün. Sıcak lastik ~4-5 psi daha yüksek gösterebilir. Üretici manuel değerlerine uyun.</span>
        </div>
      </div>

      {/* Season Guide */}
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Thermometer size={16} color="#F59E0B" /> Mevsimlik Lastik Seçim Rehberi
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {SEASON_DATA.map((s) => (
            <div key={s.label} style={{
              background: "var(--card-bg)", border: `1px solid ${s.color}30`,
              borderRadius: "16px", overflow: "hidden"
            }}>
              <div style={{
                padding: "16px 20px", background: `${s.color}12`,
                borderBottom: `1px solid ${s.color}20`
              }}>
                <div style={{ fontSize: "24px", marginBottom: "6px" }}>{s.icon}</div>
                <h4 style={{ fontSize: "16px", fontWeight: "800", color: s.color, margin: 0 }}>{s.label}</h4>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "4px 0 0 0", lineHeight: "1.4" }}>{s.when}</p>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#10B981", marginBottom: "6px", textTransform: "uppercase" }}>Avantajlar</div>
                  {s.pros.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
                      <span style={{ color: "#10B981", fontSize: "13px" }}>✓</span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>{p}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#EF4444", marginBottom: "6px", textTransform: "uppercase" }}>Dezavantajlar</div>
                  {s.cons.map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
                      <span style={{ color: "#EF4444", fontSize: "13px" }}>✗</span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>{c}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "12px", padding: "8px 10px", background: "var(--secondary)", borderRadius: "8px", fontSize: "11px", color: "var(--text-muted)" }}>
                  📋 {s.yasal}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tread Depth */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginBottom: "16px" }}>Diş Derinliği Rehberi</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {TREAD_DEPTH.map((t) => (
            <div key={t.mm} style={{
              padding: "16px", borderRadius: "12px",
              background: `${t.color}10`, border: `2px solid ${t.color}40`,
              textAlign: "center"
            }}>
              <div style={{ fontSize: "22px", fontWeight: "900", color: t.color, marginBottom: "6px" }}>{t.mm}</div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: t.color, marginBottom: "8px" }}>{t.durum}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.5" }}>{t.aciklama}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(239,68,68,0.08)", borderRadius: "10px", display: "flex", gap: "8px" }}>
          <AlertTriangle size={14} color="#EF4444" style={{ flexShrink: 0, marginTop: "1px" }} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Türkiye yasal minimumu: <strong style={{ color: "#EF4444" }}>1.6 mm</strong> (yük araçları 1 mm). Bu değerin altında araç trafiğe çıkarsa ceza uygulanır.</span>
        </div>
      </div>
    </div>
  );
}
