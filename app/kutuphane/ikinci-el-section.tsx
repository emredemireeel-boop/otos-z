"use client";

import { useState } from "react";
import { ClipboardCheck, CheckCircle, Circle, RotateCcw, AlertTriangle } from "lucide-react";

interface CheckItem {
  id: string;
  text: string;
  aciklama: string;
  oncelik: "kritik" | "onemli" | "rutin";
}

interface CheckCategory {
  label: string;
  emoji: string;
  color: string;
  items: CheckItem[];
}

const CATEGORIES: CheckCategory[] = [
  {
    label: "Dış Kontroller",
    emoji: "🔍",
    color: "#3B82F6",
    items: [
      { id: "d1", text: "Kaporta boyası & çizikler", aciklama: "Orijinal boyadan farklı tonlar boya yapıldığına işaret eder.", oncelik: "onemli" },
      { id: "d2", text: "Panel birleşim aralıkları", aciklama: "Eşit aralıklar araçta kaza şüphesi olup olmadığını gösterir.", oncelik: "kritik" },
      { id: "d3", text: "Çamurluklar & eşikler", aciklama: "Pas başlangıcı veya kalın boya gizlenmiş hasar işareti olabilir.", oncelik: "onemli" },
      { id: "d4", text: "Cam ve aynalar", aciklama: "Çatlak, taşlanmış ya da yenilenmiş cam var mı kontrol edin.", oncelik: "rutin" },
      { id: "d5", text: "Lastikler (diş & hasar)", aciklama: "4 lastik aynı kalıp mı? Diş derinlikleri eşit mi?", oncelik: "onemli" },
      { id: "d6", text: "Jantlar (çarpma izi)", aciklama: "Deformasyonlar dengesizliğe, titreşime yol açar.", oncelik: "rutin" },
      { id: "d7", text: "Far, stop ve sinyal lambalar", aciklama: "Tüm lambalar çalışıyor mu? Çatlak veya nem var mı?", oncelik: "rutin" },
    ],
  },
  {
    label: "Motor Bölmesi",
    emoji: "⚙️",
    color: "#EF4444",
    items: [
      { id: "m1", text: "Motor yağı rengi ve seviyesi", aciklama: "Kahverengi ya da koyu siyah renk yağ bakımının ihmal edildiğini gösterir. Süt rengi antifrizi işaret eder.", oncelik: "kritik" },
      { id: "m2", text: "Soğutma suyu rengi", aciklama: "Berrak yeşil/kırmızı olmalı. Kahverengi = pas; süt rengi = conta arızası.", oncelik: "kritik" },
      { id: "m3", text: "Valf kapağı altı (conta yağ sızıntısı)", aciklama: "Yağ birikimi varsa conta yenilenmesi gerekebilir.", oncelik: "onemli" },
      { id: "m4", text: "Akü terminalleri ve akü yaşı", aciklama: "Korozyon, kireç birikimi ve akü üzerindeki üretim tarihi.", oncelik: "onemli" },
      { id: "m5", text: "Hortumlar ve kayışlar", aciklama: "Çatlak, sertleşme veya sızdırma belirtisi var mı?", oncelik: "onemli" },
      { id: "m6", text: "Şase & taşıyıcı profil kaynakları", aciklama: "Yeniden kaynaklama ciddi kaza geçirildiğinin işareti.", oncelik: "kritik" },
    ],
  },
  {
    label: "İç Mekan & Elektrik",
    emoji: "🪑",
    color: "#8B5CF6",
    items: [
      { id: "i1", text: "Kontrol paneli uyarı lambalar", aciklama: "Kontak açıkken tüm lambalar yanmalı; motor açıkken sönmeli. Kalan lamba sorunludur.", oncelik: "kritik" },
      { id: "i2", text: "Klima soğutma & ısıtma", aciklama: "Tüm kademelerde test edin. Ekstra gaz ihtiyacı var mı?", oncelik: "onemli" },
      { id: "i3", text: "Silecekler ve camlar", aciklama: "Silecekler tüm camı temizliyor mu? Isıtmalı arka cam çalışıyor mu?", oncelik: "rutin" },
      { id: "i4", text: "Koltuk, kemer ve düzenekler", aciklama: "Koltuk mekanizması, emniyet kemeri kilidi ve arka koltuk katlanma.", oncelik: "rutin" },
      { id: "i5", text: "Ses sistemi & USB", aciklama: "Tüm hoparlörler çalışıyor mu? Bluetooth pairing sorunsuz mu?", oncelik: "rutin" },
      { id: "i6", text: "Camların elektrikli mekanizmaları", aciklama: "Her kapıdan test edin. Tek seferde tam açılıp kapanmalıdır.", oncelik: "rutin" },
    ],
  },
  {
    label: "Test Sürüşü",
    emoji: "🚗",
    color: "#10B981",
    items: [
      { id: "t1", text: "Motor soğukken çalışması", aciklama: "Soğuk motorla da düzgün çalışmalı, ısınma süresi aşırı uzun olmamalı.", oncelik: "kritik" },
      { id: "t2", text: "Vites geçişleri (ATM: Kick-down)", aciklama: "Manuel: geçişler sert mi? ATM: gecikmeli ya da sarsıntılı mı?", oncelik: "kritik" },
      { id: "t3", text: "Frenler (düzlük ve eğimde)", aciklama: "Fren basınç hissi, titreşim, çekilme var mı? El freni eğimde tutuyor mu?", oncelik: "kritik" },
      { id: "t4", text: "Direksiyon (sallanma, çekme)", aciklama: "Düz yolda araç bir yana çekiyor mu? Direksiyon sallanıyor mu?", oncelik: "onemli" },
      { id: "t5", text: "Süspansiyon (yol sesi)", aciklama: "Bozuk yolda vuruntu, tık-tık sesi, titreşim var mı?", oncelik: "onemli" },
      { id: "t6", text: "Klima kompresörü", aciklama: "Klima açıkken motor revü değişiyor mu? Ses çıkıyor mu?", oncelik: "rutin" },
    ],
  },
  {
    label: "Belgeler & Geçmiş",
    emoji: "📋",
    color: "#F59E0B",
    items: [
      { id: "b1", text: "Ruhsat & tescil bilgileri eşleşmesi", aciklama: "Plaka, şase numarası ve motor numarası ruhsatla örtüşmeli.", oncelik: "kritik" },
      { id: "b2", text: "Şase numarası görsel kontrolü", aciklama: "Şase numarasının kazınmamış/değiştirilmemiş olduğundan emin olun.", oncelik: "kritik" },
      { id: "b3", text: "Servis geçmişi / bakım defteri", aciklama: "Düzenli aralıklarla yetkili servis veya kayıtlı bağımsız servis.", oncelik: "onemli" },
      { id: "b4", text: "Sigorta & kasko geçmişi", aciklama: "Hasar geçmişini sigorta şirketinden teyit ettirin.", oncelik: "onemli" },
      { id: "b5", text: "TRAMER raporu", aciklama: "Trafik kazaları kayıt merkezi raporu hasar geçmişini gösterir.", oncelik: "kritik" },
      { id: "b6", text: "Vergi & trafik borcu yok", aciklama: "e-Devlet veya ilgili kurum üzerinden sorgulayın.", oncelik: "onemli" },
    ],
  },
];

const ONCELIK = {
  kritik: { color: "#F87171", label: "KRİTİK" },
  onemli: { color: "#FBBF24", label: "ÖNEMLİ" },
  rutin: { color: "#34D399", label: "RUTİN" },
};

export default function IkinciElSection() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const s = new Set(checked);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setChecked(s);
  };

  const totalItems = CATEGORIES.reduce((acc, c) => acc + c.items.length, 0);
  const pct = Math.round((checked.size / totalItems) * 100);

  const kritikItems = CATEGORIES.flatMap(c => c.items.filter(i => i.oncelik === "kritik"));
  const kritikDone = kritikItems.filter(i => checked.has(i.id)).length;

  const reset = () => setChecked(new Set());

  const scoreColor = pct < 40 ? "#EF4444" : pct < 70 ? "#F59E0B" : "#10B981";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "14px",
          background: "linear-gradient(135deg, #F59E0B, #10B981)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <ClipboardCheck size={28} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>İkinci El Satın Alma Kontrol Listesi</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Görüntülemeye gitmeden önce bu listeyi indirin veya kaydedin
          </p>
        </div>
      </div>

      {/* Progress Dashboard */}
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--card-border)",
        borderRadius: "16px", padding: "24px"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>İlerleme Durumu</h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
              {checked.size}/{totalItems} madde kontrol edildi
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "900", color: scoreColor }}>{pct}%</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Tamamlandı</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#EF4444" }}>{kritikDone}/{kritikItems.length}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Kritik</div>
            </div>
            <button
              onClick={reset}
              style={{
                padding: "8px 14px", borderRadius: "10px",
                background: "var(--secondary)", border: "1px solid var(--card-border)",
                cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px"
              }}
            >
              <RotateCcw size={14} /> Sıfırla
            </button>
          </div>
        </div>
        <div style={{ height: "8px", background: "var(--secondary)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}aa)`, borderRadius: "4px", transition: "width 0.3s ease" }} />
        </div>
      </div>

      {/* Categories */}
      {CATEGORIES.map((cat) => {
        const catDone = cat.items.filter(i => checked.has(i.id)).length;
        return (
          <div key={cat.label} style={{
            background: "var(--card-bg)", border: "1px solid var(--card-border)",
            borderRadius: "16px", overflow: "hidden"
          }}>
            <div style={{
              padding: "16px 24px",
              background: `${cat.color}08`,
              borderBottom: "1px solid var(--card-border)",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "22px" }}>{cat.emoji}</span>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>{cat.label}</h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{catDone}/{cat.items.length}</div>
                <div style={{
                  width: "80px", height: "6px", background: "var(--secondary)", borderRadius: "3px", overflow: "hidden"
                }}>
                  <div style={{ width: `${(catDone / cat.items.length) * 100}%`, height: "100%", background: cat.color, borderRadius: "3px", transition: "width 0.3s" }} />
                </div>
              </div>
            </div>
            <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {cat.items.map((item) => {
                const isDone = checked.has(item.id);
                const cfg = ONCELIK[item.oncelik];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "12px",
                      padding: "12px 14px", borderRadius: "12px", cursor: "pointer",
                      background: isDone ? "rgba(16,185,129,0.08)" : "var(--secondary)",
                      border: `1px solid ${isDone ? "#10B98140" : "var(--card-border)"}`,
                      transition: "all 0.15s",
                    }}
                  >
                    {isDone
                      ? <CheckCircle size={20} color="#10B981" style={{ flexShrink: 0, marginTop: "1px" }} />
                      : <Circle size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: "1px" }} />
                    }
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: isDone ? "var(--text-muted)" : "var(--foreground)", textDecoration: isDone ? "line-through" : "none" }}>
                          {item.text}
                        </span>
                        <span style={{ padding: "2px 6px", borderRadius: "5px", fontSize: "10px", fontWeight: "800", color: cfg.color, background: `${cfg.color}15` }}>
                          {cfg.label}
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
                        {item.aciklama}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* TRAMER Note */}
      <div style={{ display: "flex", gap: "10px", padding: "16px", background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "12px" }}>
        <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: "1px" }} />
        <div>
          <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)", margin: "0 0 4px 0" }}>TRAMER Sorgulama</p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
            TRAMER raporu için sgk.gov.tr ya da sigorta şirketinizin web sitesi üzerinden şase numarasını sorgulayabilirsiniz.
            Raporun boş olması her şeyin yolunda demek değildir; bazı kaza kayıtları sisteme girilmemiş olabilir.
          </p>
        </div>
      </div>
    </div>
  );
}
