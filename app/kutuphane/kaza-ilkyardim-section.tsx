"use client";

import { useState } from "react";
import { Phone, AlertTriangle, FileText, CheckCircle, Heart, Shield, Clock, ChevronDown, ChevronUp, Car, Activity, Download } from "lucide-react";

/* ══════════════════════════════════════
   DATA
   ══════════════════════════════════════ */
const STEPS = [
  {
    no: 1, baslik: "Güvende Misiniz?", color: "#EF4444", icon: AlertTriangle,
    adimlar: [
      "Önce kendinizin güvende olduğundan emin olun.",
      "Aracın kontağını kapatın, dörtlü flaşörü açın.",
      "Reflektif yelek giyip araçtan güvenli şekilde çıkın.",
      "Yakıt sızıntısı varsa hemen uzaklaşın.",
      "Üçgen reflektörü aracın 30m (otoyolda 150m) gerisine yerleştirin.",
    ],
  },
  {
    no: 2, baslik: "İlk Aramalar", color: "#3B82F6", icon: Phone,
    adimlar: [
      "155 \u2014 Trafik Polisi (mutlaka arayın)",
      "112 \u2014 Acil Yardım (yaralı varsa)",
      "122 \u2014 İtfaiye (yangın / sıkışma varsa)",
      "İkinci araç sürücüsüyle iletişime geçin.",
      "Sigorta şirketinizin 7/24 ihbar hattını arayın.",
    ],
  },
  {
    no: 3, baslik: "Belge & Fotoğraf", color: "#F59E0B", icon: FileText,
    adimlar: [
      "Her iki aracın plakasını fotoğraflayın.",
      "Diğer sürücünün ehliyeti ve ruhsatını fotoğraflayın.",
      "Kaza yerini, araçları ve hasar noktalarını 4 yönden çekin.",
      "Mümkünse tanıkların iletişim bilgilerini alın.",
      "Trafik kamerası veya işyeri camerası olup olmadığını not edin.",
      "Yere kaçak iz veya fren izleri varsa fotoğraflayın.",
    ],
  },
  {
    no: 4, baslik: "Kaza Tespit Tutanağı", color: "#8B5CF6", icon: FileText,
    adimlar: [
      "Polis gelene kadar araçları hareket ettirmeyin.",
      "Polis gelmeyecekse: Anlaşmalı kaza tutanağını karşılıklı doldurun ve imzalayın.",
      "Tutanakta kusur oranı belirtiliyorsa dikkatli okuyun.",
      "Karşı tarafın sizi yıldırmasına izin vermeyin, her şeyi kayıt altına alın.",
      "Tutanağın her iki kopyasını da alın.",
    ],
  },
  {
    no: 5, baslik: "Sigorta Bildirimi", color: "#10B981", icon: Shield,
    adimlar: [
      "Tutanak, fotoğraflar, kimlik, ehliyet, ruhsatla sigorta şirketinize 48 saat içinde başvurun.",
      "Kaskolu araçlarda kasko şirketinizi arayın.",
      "Ekspertiz randevusu alın ve araçta değişiklik yapmayın.",
      "Hasara uğrayan eşyalarınız için belgeler hazırlayın.",
      "Onarım faturasını sigorta şirketine iletin.",
    ],
  },
];

const EMERGENCY_NUMBERS = [
  { no: "112", label: "Acil Yardım", color: "#EF4444", desc: "Tüm acil durumlar" },
  { no: "155", label: "Trafik Polisi", color: "#3B82F6", desc: "Kaza ihbarı" },
  { no: "156", label: "Jandarma", color: "#10B981", desc: "Kırsal bölge" },
];

const BELGELER = [
  { ad: "Sürücü Ehliyeti", zorunlu: true },
  { ad: "Araç Ruhsatı", zorunlu: true },
  { ad: "Trafik Sigorta Poliçesi", zorunlu: true },
  { ad: "Kimlik / Pasaport", zorunlu: true },
  { ad: "Kasko Poliçesi (varsa)", zorunlu: false },
  { ad: "Sigorta İhbar Hattı No", zorunlu: false },
];

const ARACTA_BULUNMASI = [
  { ad: "İlk Yardım Çantası", zorunlu: true, icon: Heart },
  { ad: "Yangın Söndürücü", zorunlu: true, icon: AlertTriangle },
  { ad: "Reflektif Yelek (2 adet)", zorunlu: true, icon: Shield },
  { ad: "Üçgen Reflektör", zorunlu: true, icon: AlertTriangle },
  { ad: "Çekme Halatı", zorunlu: false, icon: Car },
  { ad: "Takviye Kablosu", zorunlu: false, icon: Activity },
  { ad: "El Feneri", zorunlu: false, icon: Activity },
  { ad: "Kaza Tespit Tutanağı Formu", zorunlu: true, icon: FileText },
];

const ILKYARDIM = [
  {
    baslik: "Bilinç Kontrolü",
    color: "#EF4444",
    adimlar: [
      "Yaralıya yaklaşın, omzuna dokunup 'İyi misiniz?' diye seslenin.",
      "Yanıt vermiyorsa derhal 112'yi arayın veya etraftaki birine aratın.",
      "Nefes alıp almadığını kontrol edin (Vaktinizi kaybetmeden göğüs hareketlerini 10 saniye dinleyin).",
      "Solunum yoksa ve eğitiminiz varsa Temel Yaşam Desteğine (Kalp Masajı) başlayın.",
    ],
  },
  {
    baslik: "Kanama Durdurma",
    color: "#F97316",
    adimlar: [
      "Temiz bez veya gaz bezini yaranın üzerine kuvvetlice bastırın.",
      "Basıncı en az 10-15 dakika hiç kaldırmadan sürdürün.",
      "Kanama durmuyorsa ilk bezin üzerine ikinci bir bez koyarak basınca devam edin.",
      "Yaralı uzvu (kol/bacak) kalp seviyesinin üstüne kaldırın.",
      "Turnike sadece uzuv kopması veya durdurulamayan hayati kanamalarda, son çare olarak kullanın.",
    ],
  },
  {
    baslik: "Kırık & Burkulma",
    color: "#3B82F6",
    adimlar: [
      "Kırık şüphesi olan bölgeyi kesinlikle hareket ettirmeyin ve düzeltmeye çalışmayın.",
      "Bulduğunuz sert bir cisimle (tahta, kalın karton) eklemleri içine alacak şekilde sabitleyin.",
      "Soğuk kompres uygulayın (Buzu direkt deriye değil, bir beze sararak uygulayın).",
      "Boyun/sırt/omurga yaralanması şüphesinde yaralıyı KESİNLİKLE yerinden oynatmayın.",
    ],
  },
  {
    baslik: "Yanık",
    color: "#10B981",
    adimlar: [
      "Yanık bölgeyi tazyiksiz, akan soğuk (buzlu olmayan) su altında 15-20 dk tutun.",
      "Asla buz, diş macunu, yoğurt veya krem sürmeyin.",
      "Yanığın üzerindeki giysileri çıkarmaya çalışmayın, yapışmışsa etrafından kesin.",
      "Yanığı temiz ve nemli bir bezle veya streç filmle gevşekçe örtün.",
    ],
  },
  {
    baslik: "Şok Pozisyonu",
    color: "#8B5CF6",
    adimlar: [
      "Yaralıyı sırtüstü düz bir zemine yatırın.",
      "Bacaklarını 30 cm kadar yukarı kaldırıp destekleyin.",
      "Üzerini battaniye veya mont ile örterek vücut ısısını koruyun.",
      "Bilinci kapalıysa ağızdan kesinlikle yiyecek/içecek vermeyin.",
    ]
  }
];

const SURUCU_HAKLARI = [
  "Polis gelmese de kaza tutanağı doldurma hakkınız vardır.",
  "Karşı tarafın suçunu kabul etmesi gerekmez, tutanak yeterlidir.",
  "Alkol testi yaptırmak zorunlu değildir ancak reddetmek aleyhiniize kullanılabilir.",
  "Avukat çağırma hakkınız her zaman vardır.",
  "Kaza yerinde ödeme taahhut belgesi imzalamayın.",
  "Sigorta şirketi ekspertiz öncesi onarım talep edemez.",
  "Hasarınız için değer kaybı tazminatı talep edebilirsiniz.",
];

const SIGORTA_TIMELINE = [
  { zaman: "0\u201324 saat", baslik: "Kaza Anı", aciklama: "Tutanak, fotoğraf, belgeleri hazırlayın", color: "#EF4444" },
  { zaman: "24\u201348 saat", baslik: "Bildirim", aciklama: "Sigorta şirketine bildirim yapın", color: "#F59E0B" },
  { zaman: "3\u20137 gün", baslik: "Ekspertiz", aciklama: "Eksper aracı inceler, rapor hazırlar", color: "#3B82F6" },
  { zaman: "7\u201315 gün", baslik: "Onarım", aciklama: "Anlaşmalı serviste onarım başlar", color: "#8B5CF6" },
  { zaman: "15\u201330 gün", baslik: "Ödeme", aciklama: "Sigorta ödemesi hesabınıza yapılır", color: "#10B981" },
];

/* ══════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════ */
export default function KazaIlkYardimSection() {
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set([0]));
  const [showIlkYardim, setShowIlkYardim] = useState(false);
  const [showHaklar, setShowHaklar] = useState(false);

  const toggleStep = (n: number) => {
    const s = new Set(openSteps);
    if (s.has(n)) s.delete(n); else s.add(n);
    setOpenSteps(s);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "14px",
          background: "linear-gradient(135deg, #EF4444, #F97316)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <AlertTriangle size={28} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>Kaza Anı &amp; İlk Yardım Rehberi</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Trafik kazasında adım adım ne yapmalısınız? Telaşlanmayın, bu rehberi takip edin.
          </p>
        </div>
      </div>

      {/* Tutanak Download Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--primary)" />
            Maddi Hasarlı Trafik Kazası Tespit Tutanağı
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, maxWidth: '500px' }}>
            Kaza anında torpidonuzda mutlaka bulunması gereken resmi kaza tespit tutanağını PDF olarak indirebilir ve çıktısını alabilirsiniz.
          </p>
        </div>
        <a href="/Otosöz_kazatespit.pdf" download="Maddi_Hasarli_Kaza_Tespit_Tutanagi.pdf" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--primary)', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <Download size={18} />
          Tutanağı İndir (PDF)
        </a>
      </div>

      {/* Emergency Numbers */}
      <div style={{ background: "var(--card-bg)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--foreground)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Phone size={16} color="#EF4444" /> Acil Numaralar
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {EMERGENCY_NUMBERS.map((n) => (
            <div key={n.no} style={{
              padding: "14px", borderRadius: "12px",
              background: `${n.color}08`, border: `1px solid ${n.color}25`,
              textAlign: "center",
            }}>
              <div style={{ fontSize: "28px", fontWeight: "900", color: n.color, lineHeight: 1, marginBottom: "4px" }}>{n.no}</div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--foreground)" }}>{n.label}</div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{n.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Steps (collapsible) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {STEPS.map((step, idx) => {
          const isOpen = openSteps.has(idx);
          const Icon = step.icon;
          return (
            <div key={step.no} style={{
              background: "var(--card-bg)", border: "1px solid var(--card-border)",
              borderRadius: "14px", overflow: "hidden",
            }}>
              <button onClick={() => toggleStep(idx)} style={{
                width: "100%", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "transparent", border: "none", cursor: "pointer", color: "var(--foreground)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "12px", flexShrink: 0,
                    background: `linear-gradient(135deg, ${step.color}, ${step.color}aa)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={18} color="white" />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ padding: "2px 8px", background: `${step.color}15`, color: step.color, fontSize: "10px", fontWeight: "800", borderRadius: "5px" }}>
                        ADIM {step.no}
                      </span>
                      <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>{step.baslik}</h3>
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{step.adimlar.length} madde</div>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
              </button>

              {isOpen && (
                <div style={{ padding: "0 20px 16px 20px", borderTop: "1px solid var(--card-border)" }}>
                  <div style={{ paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {step.adimlar.map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <div style={{
                          width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                          background: `${step.color}15`, color: step.color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: "800",
                        }}>{i + 1}</div>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* First Aid Section */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden" }}>
        <button onClick={() => setShowIlkYardim(!showIlkYardim)} style={{
          width: "100%", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "transparent", border: "none", cursor: "pointer", color: "var(--foreground)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #EF4444, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={18} color="white" />
            </div>
            <div style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>Temel İlk Yardım Bilgileri</h3>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>Bilinç kontrolü, kanama, kırık, yanık</div>
            </div>
          </div>
          {showIlkYardim ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
        </button>

        {showIlkYardim && (
          <div style={{ padding: "0 24px 24px", borderTop: "1px solid var(--card-border)" }}>
            <div style={{ paddingTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {ILKYARDIM.map((item) => (
                <div key={item.baslik} style={{
                  padding: "16px", borderRadius: "12px",
                  background: `${item.color}08`, border: `1px solid ${item.color}20`,
                }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: item.color, marginBottom: "8px", margin: "0 0 8px 0" }}>{item.baslik}</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {item.adimlar.map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: "6px" }} />
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5 }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Items to keep in car */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--foreground)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Car size={16} color="#3B82F6" /> Araçta Bulundurmanız Gerekenler
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {ARACTA_BULUNMASI.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.ad} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 14px", borderRadius: "10px",
                background: b.zorunlu ? "rgba(16,185,129,0.08)" : "var(--secondary)",
                border: `1px solid ${b.zorunlu ? "#10B98130" : "var(--card-border)"}`,
              }}>
                <Icon size={14} color={b.zorunlu ? "#10B981" : "var(--text-muted)"} />
                <div>
                  <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: "600" }}>{b.ad}</span>
                  {b.zorunlu && (
                    <span style={{ marginLeft: "6px", padding: "1px 6px", background: "rgba(16,185,129,0.15)", color: "#10B981", fontSize: "10px", fontWeight: "700", borderRadius: "4px" }}>
                      ZORUNLU
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Documents */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--foreground)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <FileText size={16} color="#8B5CF6" /> Belge Kontrol Listesi
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {BELGELER.map((b) => (
            <div key={b.ad} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 14px", borderRadius: "10px",
              background: b.zorunlu ? "rgba(59,130,246,0.06)" : "var(--secondary)",
              border: `1px solid ${b.zorunlu ? "rgba(59,130,246,0.2)" : "var(--card-border)"}`,
            }}>
              <CheckCircle size={14} color={b.zorunlu ? "#3B82F6" : "var(--text-muted)"} />
              <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: b.zorunlu ? "600" : "400" }}>{b.ad}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Driver Rights */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden" }}>
        <button onClick={() => setShowHaklar(!showHaklar)} style={{
          width: "100%", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "transparent", border: "none", cursor: "pointer", color: "var(--foreground)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={18} color="white" />
            </div>
            <div style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>Sürücü Haklarınız</h3>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>Kazada bilmeniz gereken yasal haklar</div>
            </div>
          </div>
          {showHaklar ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
        </button>

        {showHaklar && (
          <div style={{ padding: "0 24px 20px", borderTop: "1px solid var(--card-border)" }}>
            <div style={{ paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {SURUCU_HAKLARI.map((hak, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "8px 12px", background: "rgba(59,130,246,0.05)", borderRadius: "8px", border: "1px solid rgba(59,130,246,0.1)" }}>
                  <Shield size={14} color="#3B82F6" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>{hak}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Insurance Timeline */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--foreground)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Clock size={16} color="#F59E0B" /> Sigorta Süreci Zaman Çizelgesi
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
          {SIGORTA_TIMELINE.map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: "16px", position: "relative" }}>
              {/* Timeline line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: item.color, flexShrink: 0, zIndex: 1 }} />
                {idx < SIGORTA_TIMELINE.length - 1 && (
                  <div style={{ width: "2px", flex: 1, background: "var(--card-border)", minHeight: "30px" }} />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingBottom: idx < SIGORTA_TIMELINE.length - 1 ? "16px" : "0", flex: 1 }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: item.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.zaman}</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--foreground)", marginTop: "2px" }}>{item.baslik}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{item.aciklama}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ display: "flex", gap: "10px", padding: "14px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px" }}>
        <AlertTriangle size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: "1px" }} />
        <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
          Bu içerik genel bilgilendirme amaçlıdır. İlk yardım bilgileri profesyonel eğitimin yerine geçmez. Hukuki sorumluluklar için yetkili bir avukata danışın.
        </p>
      </div>
    </div>
  );
}
