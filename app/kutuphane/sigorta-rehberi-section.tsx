"use client";

import { Shield, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

const KARSILASTIRMA = [
  { ozellik: "Zorunlu mu?", trafik: "✅ Evet — yasaldır", kasko: "❌ İsteğe bağlı" },
  { ozellik: "Kapsam", trafik: "3. şahıslara verilen hasar (kişi + araç)", kasko: "Kendi aracınızın hasarı (kaza, hırsızlık, yangın...)" },
  { ozellik: "Kendinizin hasarı karşılar mı?", trafik: "❌ Karşılamaz", kasko: "✅ Karşılar" },
  { ozellik: "Hırsızlık", trafik: "❌", kasko: "✅ (kasko türüne göre)" },
  { ozellik: "Doğal afet (dolu, sel)", trafik: "❌", kasko: "✅ (geniş kapsamlı kaskolarda)" },
  { ozellik: "Cam hasarı", trafik: "❌", kasko: "✅ (cam muafiyeti düşük ise)" },
  { ozellik: "İkame araç", trafik: "❌", kasko: "✅ (ek paket ile)" },
  { ozellik: "Ortalama yıllık prim (binek)", trafik: "1.200 – 6.000 TL", kasko: "4.000 – 40.000 TL" },
];

const HASAR_ADIMLARI = [
  { no: 1, baslik: "Anında bildirin", aciklama: "Kaza anında veya en geç 48 saat içinde sigorta şirketinizi arayın. Gecikme hak kaybına yol açabilir.", color: "#3B82F6" },
  { no: 2, baslik: "Belgeleri hazırlayın", aciklama: "Kaza tutanağı, fotoğraflar, ehliyet, ruhsat, sigorta poliçeniz ve kimlik/pasaport.", color: "#8B5CF6" },
  { no: 3, baslik: "Eksper randevusu", aciklama: "Sigorta şirketi eksper gönderir; eksper gelmeden araca tamir yaptırmayın.", color: "#F59E0B" },
  { no: 4, baslik: "Anlaşmalı servis", aciklama: "Kasko için anlaşmalı servise götürün — işlem çok daha hızlı tamamlanır.", color: "#10B981" },
  { no: 5, baslik: "Muafiyet ödemesi", aciklama: "Polçenizde muafiyet varsa kendi payınız kadar ödeme yaparsınız; geri kalanı sigorta karşılar.", color: "#EF4444" },
];

const TASARRUF_IPUCLARI = [
  { tip: "Hasarsızlık indirimi", aciklama: "Her hasarsız yılda %10–20 indirim kazanırsınız. Küçük hasarları bildirmeyin." },
  { tip: "Yüksek muafiyet seç", aciklama: "Poliçede muafiyeti artırırsanız primin önemli ölçüde düşer." },
  { tip: "Araç değeri ile prim dengesi", aciklama: "Eski araçlarda kasko değeri düşük olabilir; bazen mantıklı olmayabilir." },
  { tip: "Öğrenci / genç sürücü", aciklama: "Bazı şirketler araç kilitli kalıntay sensörü veya kuplörlü araçlara indirim yapar." },
  { tip: "Yıllık ödeme", aciklama: "Taksitli yerine yıllık ödeme yaparsanız %5–10 tasarruf edebilirsiniz." },
  { tip: "Rekabetçi teklif alın", aciklama: "Her yıl en az 3 firmadan teklif alın — fiyatlar ciddi şekilde farklılaşabilir." },
];

export default function SigortaRehberiSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "14px",
          background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Shield size={28} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>Sigorta Rehberi</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Kasko vs zorunlu trafik sigortası, hasar bildirimi ve prim düşürme ipuçları
          </p>
        </div>
      </div>

      {/* Kasko vs Trafik - Comparison Table */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))", borderBottom: "1px solid var(--card-border)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>
            Kasko vs Zorunlu Trafik Sigortası — Karşılaştırma
          </h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", width: "30%" }}>
                  Özellik
                </th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#3B82F6", textTransform: "uppercase", letterSpacing: "0.5px", width: "35%" }}>
                  🛡️ Zorunlu Trafik
                </th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#8B5CF6", textTransform: "uppercase", letterSpacing: "0.5px", width: "35%" }}>
                  🔒 Kasko
                </th>
              </tr>
            </thead>
            <tbody>
              {KARSILASTIRMA.map((row, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: i < KARSILASTIRMA.length - 1 ? "1px solid var(--card-border)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 20px", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>{row.ozellik}</td>
                  <td style={{ padding: "12px 20px", fontSize: "13px", color: "var(--text-muted)" }}>{row.trafik}</td>
                  <td style={{ padding: "12px 20px", fontSize: "13px", color: "var(--text-muted)" }}>{row.kasko}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hasar Bildirimi */}
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Info size={16} color="#3B82F6" /> Hasar Bildirim Süreci
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {HASAR_ADIMLARI.map((adim) => (
            <div key={adim.no} style={{
              display: "flex", gap: "16px", alignItems: "flex-start",
              padding: "16px 20px", background: "var(--card-bg)",
              border: "1px solid var(--card-border)", borderRadius: "14px"
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                background: `${adim.color}15`, border: `1px solid ${adim.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "15px", fontWeight: "800", color: adim.color
              }}>
                {adim.no}
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--foreground)", margin: "0 0 4px 0" }}>{adim.baslik}</h4>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>{adim.aciklama}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasarruf İpuçları */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          💡 Sigorta Primini Düşürme İpuçları
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {TASARRUF_IPUCLARI.map((tip, i) => (
            <div key={i} style={{
              padding: "16px", borderRadius: "12px",
              background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)"
            }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <CheckCircle size={15} color="#10B981" style={{ flexShrink: 0, marginTop: "1px" }} />
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)", margin: "0 0 4px 0" }}>{tip.tip}</h4>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5", margin: 0 }}>{tip.aciklama}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={{ padding: "16px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", display: "flex", gap: "10px" }}>
          <XCircle size={15} color="#EF4444" style={{ flexShrink: 0, marginTop: "1px" }} />
          <div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)", margin: "0 0 4px 0" }}>Kapsam Dışı Durumlar</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5", margin: 0 }}>
              Alkollü sürüş, ehliyetsiz araç, muayenesiz araç hasarları çoğunlukla sigorta kapsamı dışındadır.
            </p>
          </div>
        </div>
        <div style={{ padding: "16px", background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "12px", display: "flex", gap: "10px" }}>
          <AlertTriangle size={15} color="#F59E0B" style={{ flexShrink: 0, marginTop: "1px" }} />
          <div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)", margin: "0 0 4px 0" }}>Sürüm Değeri & Piyasa Değeri</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5", margin: 0 }}>
              Kasko ödemesi gerçek piyasa değeri üzerinden değil, poliçenizdeki bedellerden hesaplanır. Güncellemeyi unutmayın.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", padding: "14px", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "12px" }}>
        <Info size={15} color="#6366F1" style={{ flexShrink: 0, marginTop: "1px" }} />
        <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
          Bu içerik genel bilgilendirme amaçlıdır. Poliçe detayları şirketten şirkete değişir. Kesin bilgi için sigorta şirketinize veya yetkili bir acenteye danışın.
        </p>
      </div>
    </div>
  );
}
