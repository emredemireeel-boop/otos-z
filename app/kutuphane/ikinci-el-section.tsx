"use client";

import { useState } from "react";
import { ClipboardCheck, CheckCircle, RotateCcw, AlertTriangle, ShieldAlert, Check, X, AlertCircle } from "lucide-react";

interface CheckItem {
  id: string;
  text: string;
  aciklama: string;
  oncelik: "kritik" | "onemli" | "rutin";
  hataDetayi?: string;
  maliyet?: string;
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
      { id: "d1", text: "Kaporta boyası & çizikler", aciklama: "Orijinal boyadan farklı tonlar boya yapıldığına işaret eder.", oncelik: "onemli", hataDetayi: "Araç daha önce hasar almış ve onarılmış olabilir. Lokal boya sorun olmayabilir ancak tavan ve direklerdeki boya büyük bir kazanın işaretidir.", maliyet: "Orta / Yüksek Değer Kaybı" },
      { id: "d2", text: "Panel birleşim aralıkları", aciklama: "Eşit aralıklar araçta kaza şüphesi olup olmadığını gösterir.", oncelik: "kritik", hataDetayi: "Kaput, kapılar veya çamurluklar arasındaki boşluklar eşit değilse, şasede kayma veya düzgün onarılmamış büyük bir kaza mevcuttur.", maliyet: "Çok Yüksek Risk" },
      { id: "d3", text: "Çamurluklar & eşikler", aciklama: "Pas başlangıcı veya kalın boya gizlenmiş hasar işareti olabilir.", oncelik: "onemli", hataDetayi: "Paslanma yapısal zayıflığa yol açar. Macun tabakası altındaki pas zamanla yüzeye çıkar ve onarımı çok zordur.", maliyet: "Yüksek" },
      { id: "d4", text: "Cam ve aynalar", aciklama: "Çatlak, taşlanmış ya da yenilenmiş cam var mı kontrol edin.", oncelik: "rutin", hataDetayi: "Görüşü engelleyen çatlaklar muayeneden geçmez. Orijinal olmayan logolu camlar kaza sonrası değişime işaret edebilir.", maliyet: "Düşük / Orta" },
      { id: "d5", text: "Lastikler (diş & hasar)", aciklama: "4 lastik aynı kalıp mı? Diş derinlikleri eşit mi?", oncelik: "onemli", hataDetayi: "Farklı marka/desen lastikler yol tutuşunu tehlikeye atar. Düzensiz aşınma varsa rot/balans veya süspansiyon arızası vardır.", maliyet: "Orta" },
      { id: "d6", text: "Jantlar (çarpma izi)", aciklama: "Deformasyonlar dengesizliğe, titreşime yol açar.", oncelik: "rutin", hataDetayi: "Eğik jantlar yüksek hızda titreme yapar ve tekerlek bilyalarını erken bozar.", maliyet: "Düşük / Orta" },
      { id: "d7", text: "Far, stop ve sinyal lambalar", aciklama: "Tüm lambalar çalışıyor mu? Çatlak veya nem var mı?", oncelik: "rutin", hataDetayi: "Su almış farlar içeriden oksitlenme yapar, elektrik tesisatında kısa devreye sebep olabilir.", maliyet: "Orta" },
    ],
  },
  {
    label: "Motor Bölmesi",
    emoji: "⚙️",
    color: "#EF4444",
    items: [
      { id: "m1", text: "Motor yağı rengi ve seviyesi", aciklama: "Süt rengi veya köpük var mı?", oncelik: "kritik", hataDetayi: "Eğer yağ kapağında veya çubuğunda tahin/süt köpüğü rengi kıvam varsa silindir kapak contası yanıktır. Motora su karışıyordur.", maliyet: "Çok Yüksek (Motor Revizyonu)" },
      { id: "m2", text: "Soğutma suyu rengi", aciklama: "Berrak yeşil/kırmızı/mavi olmalı.", oncelik: "kritik", hataDetayi: "Suda yağ tabakası varsa veya kahverengi çamur şeklindeyse motor içi aşırı paslanmıştır ya da motor bloğu çatlamıştır.", maliyet: "Çok Yüksek" },
      { id: "m3", text: "Valf kapağı altı yağ sızıntısı", aciklama: "Motor etrafında ıslak yağ var mı?", oncelik: "onemli", hataDetayi: "Motorda yağ sızıntıları hem yağ eksiltmesine hem de sıcak egzoz parçalarına damlayıp yangın riskine veya pis kokuya sebep olur.", maliyet: "Orta" },
      { id: "m4", text: "Akü terminalleri ve yaşı", aciklama: "Korozyon veya üretim tarihi eskiliği.", oncelik: "onemli", hataDetayi: "Oksitlenmiş terminaller şarjı engeller. 4-5 yıldan eski akülerin değişimi yakındır.", maliyet: "Düşük" },
      { id: "m5", text: "Hortumlar ve kayışlar", aciklama: "Çatlak, sertleşme var mı?", oncelik: "onemli", hataDetayi: "V kayışındaki çatlaklar yolda kalmanıza, su hortumlarındaki sertleşmeler motorun suyu boşaltıp hararet yapmasına sebep olur.", maliyet: "Orta" },
      { id: "m6", text: "Şase & taşıyıcı profil kaynakları", aciklama: "Yeniden kaynaklama (işlem) var mı?", oncelik: "kritik", hataDetayi: "Şase uçlarındaki bükülmeler, çekiç izleri veya sonradan atılmış kaynaklar, aracın ölümcül bir kaza atlatıp düzeltildiğini kanıtlar.", maliyet: "Araç Alınmaz" },
    ],
  },
  {
    label: "İç Mekan & Elektrik",
    emoji: "🪑",
    color: "#8B5CF6",
    items: [
      { id: "i1", text: "Kontrol paneli uyarı lambalar", aciklama: "Kontağı açınca yanıp, motor çalışınca sönmeli.", oncelik: "kritik", hataDetayi: "Motor çalıştıktan sonra sönmeyen Check Engine, Airbag veya ABS ışıkları gizli ve pahalı elektronik/mekanik sorunları işaret eder. Işığın sökülmüş olma ihtimaline karşı kontağı ilk açtığınızda yanıyor mu teyit edin.", maliyet: "Yüksek / Çok Yüksek" },
      { id: "i2", text: "Klima soğutma & ısıtma", aciklama: "Soğuk/sıcak ayarını tam güçte test edin.", oncelik: "onemli", hataDetayi: "Klima soğutmuyorsa 'Sadece gazı eksik' lafına inanmayın. Genellikle kompresör arızası veya petek kaçağı vardır.", maliyet: "Orta / Yüksek" },
      { id: "i3", text: "Silecekler ve cam rezistansı", aciklama: "Arka cam ısıtması ve silecekler.", oncelik: "rutin", hataDetayi: "Kış aylarında arka cam rezistansının çalışmaması büyük görüş engeli yaratır. Silecek motoru arızası görüşü kısıtlar.", maliyet: "Düşük" },
      { id: "i4", text: "Koltuk, kemer ve düzenekler", aciklama: "Emniyet kemerlerini sertçe çekip test edin.", oncelik: "rutin", hataDetayi: "Direnç gösteren veya hızlı çekince kilitlenmeyen emniyet kemerleri, daha önce kaza anında patlamış ve direnç atılarak kandırılmış olabilir.", maliyet: "Yüksek Risk" },
      { id: "i5", text: "Ses sistemi & Multimedya", aciklama: "Hoparlörler ve Bluetooth.", oncelik: "rutin", hataDetayi: "Patlak hoparlörler veya dokunmatiği bozuk multimedya ünitelerinin onarımı zahmetlidir.", maliyet: "Düşük / Orta" },
      { id: "i6", text: "Cam krikoları", aciklama: "Tüm camları tek tek açıp kapatın.", oncelik: "rutin", hataDetayi: "Tekleyen veya yavaş inip kalkan camlarda krikonun telleri kopmak üzeredir, kapı döşemesi sökülmelidir.", maliyet: "Orta" },
    ],
  },
  {
    label: "Test Sürüşü",
    emoji: "🚗",
    color: "#10B981",
    items: [
      { id: "t1", text: "Motor soğukken çalışması", aciklama: "Marş süresi ve titreşim.", oncelik: "kritik", hataDetayi: "Geç çalışma, rölantide dalgalanma veya stop etme; enjektör, mazot pompası (dizel) veya rölanti valfi arızalarına işarettir.", maliyet: "Yüksek" },
      { id: "t2", text: "Vites geçişleri", aciklama: "Vuruntu, kaçırma, silkeleme.", oncelik: "kritik", hataDetayi: "Otomatik viteslerdeki vuruntu veya yokuşta kaçırma hissi, şanzıman beyni (mekatronik) veya kavrama setinin bittiğini gösterir. Otomobillerdeki en masraflı onarımdır.", maliyet: "Çok Yüksek" },
      { id: "t3", text: "Fren performansı", aciklama: "Titreme ve sağa/sola sapma.", oncelik: "kritik", hataDetayi: "Frene basınca direksiyon titriyorsa diskler yamulmuştur. Araç sağa veya sola asılıyorsa kaliper kilitlenmiş veya fren hortumları tıkanmıştır.", maliyet: "Orta / Yüksek" },
      { id: "t4", text: "Direksiyon ve Ön Düzen", aciklama: "Sallanma ve merkezleme boşluğu.", oncelik: "onemli", hataDetayi: "Düz yolda direksiyonu bıraktığınızda araç sapıyorsa; rot ayarı bozuktur veya araç kaza sonrası şase geometrisini kaybetmiştir.", maliyet: "Orta / Yüksek" },
      { id: "t5", text: "Süspansiyon tıkırtıları", aciklama: "Bozuk yoldaki sesler.", oncelik: "onemli", hataDetayi: "Lok-lok sesleri Z rotları veya amortisör takozlarının bozukluğunu, aracın beşik gibi sallanması ise amortisörlerin patlak olduğunu gösterir.", maliyet: "Orta" },
      { id: "t6", text: "Klima kompresörü yükü", aciklama: "Klima açıkken araç bayılıyor mu?", oncelik: "rutin", hataDetayi: "Aşırı sürtünme (uğultu) sesi veya motorun stop etmeye yüz tutması, klima kompresörünün yatak sardığına işarettir.", maliyet: "Yüksek" },
    ],
  },
  {
    label: "Belgeler & Geçmiş",
    emoji: "📋",
    color: "#F59E0B",
    items: [
      { id: "b1", text: "Ruhsat & tescil eşleşmesi", aciklama: "Motor ve şase numarası kontrolü.", oncelik: "kritik", hataDetayi: "Şase no ruhsatla uyuşmuyorsa araç çalıntı olabilir veya yasa dışı işlem görmüştür. Noterde alım-satım kesinlikle yapılamaz.", maliyet: "Araç Alınmaz" },
      { id: "b2", text: "Şase no orijinalliği", aciklama: "Numara üzerinde kazıma, boyama.", oncelik: "kritik", hataDetayi: "Oynanmış veya yeniden kaynaklanmış şase no, genellikle ağır hasarlı bir aracın kimliğinin ('change' işlemi) çalıntı veya hurda bir araca geçirilmesi durumudur.", maliyet: "Araç Alınmaz (Yasadışı)" },
      { id: "b3", text: "Bakım geçmişi", aciklama: "Kayıtlar, faturalar, km kontrolü.", oncelik: "onemli", hataDetayi: "Belgesi olmayan araçların kilometresi düşürülmüş olabilir veya periyodik bakımları (triger vb.) zamanında yapılmamış olabilir. Risk barındırır.", maliyet: "Belirsiz / Yüksek Risk" },
      { id: "b4", text: "Hasar (TRAMER) kaydı", aciklama: "Plaka veya şase no ile SMS sorgusu.", oncelik: "kritik", hataDetayi: "'Ağır Hasar Kayıtlı' (Pert) araçlar şase, direk ve airbag işlemi görmüştür. Yapısal güvenliği düşüktür ve kasko firmaları kasko yapmayı reddedebilir.", maliyet: "Aşırı Değer Kaybı" },
      { id: "b5", text: "Rehin / Haciz / Borç", aciklama: "e-Devlet sorgusu.", oncelik: "onemli", hataDetayi: "Aracın üzerinde banka rehni veya hak mahrumiyeti varsa noter devri yapılamaz. MTV borcu alıcıya geçmez ama satışı engeller.", maliyet: "Borç Miktarı Kadar" },
    ],
  },
];

const ONCELIK = {
  kritik: { color: "#dc2626", bg: "rgba(220,38,38,0.08)", label: "KRİTİK" },
  onemli: { color: "#d97706", bg: "rgba(217,119,6,0.08)", label: "ÖNEMLİ" },
  rutin: { color: "#6b7280", bg: "rgba(107,114,128,0.08)", label: "RUTİN" },
};

export default function IkinciElSection() {
  const [statusMap, setStatusMap] = useState<Record<string, "pass" | "fail">>({});

  const markStatus = (id: string, status: "pass" | "fail") => {
    setStatusMap(prev => ({ ...prev, [id]: status }));
  };

  const totalItems = CATEGORIES.reduce((acc, c) => acc + c.items.length, 0);
  const evaluatedCount = Object.keys(statusMap).length;
  const passCount = Object.values(statusMap).filter(s => s === "pass").length;
  const failCount = Object.values(statusMap).filter(s => s === "fail").length;
  const pct = evaluatedCount === 0 ? 0 : Math.round((passCount / totalItems) * 100);

  const kritikItems = CATEGORIES.flatMap(c => c.items.filter(i => i.oncelik === "kritik"));
  const kritikFails = kritikItems.filter(i => statusMap[i.id] === "fail");
  
  const reset = () => setStatusMap({});

  const scoreColor = pct < 40 ? "#EF4444" : pct < 80 ? "#F59E0B" : "#10B981";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "14px",
          background: "var(--secondary)",
          border: "1px solid var(--card-border)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <ClipboardCheck size={28} color="var(--primary)" />
        </div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>İkinci El Satın Alma Kontrol Listesi</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Alacağınız aracı baştan sona ekspertiz detayında kendiniz kontrol edin
          </p>
        </div>
      </div>

      {/* Progress Dashboard */}
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--card-border)",
        borderRadius: "16px", padding: "24px"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>Araç Sağlık Skoru</h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
              {evaluatedCount}/{totalItems} madde kontrol edildi
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "900", color: scoreColor }}>{pct}%</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Güven Skoru</div>
            </div>
            <div style={{ width: "1px", height: "30px", background: "var(--card-border)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#10B981" }}>{passCount}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Geçti</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#EF4444" }}>{failCount}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Sorunlu</div>
            </div>
            <div style={{ width: "1px", height: "30px", background: "var(--card-border)" }} />
            <button
              onClick={reset}
              style={{
                padding: "8px 14px", borderRadius: "10px",
                background: "var(--secondary)", border: "1px solid var(--card-border)",
                cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600"
              }}
            >
              <RotateCcw size={14} /> Sıfırlayıp Yeniden Başla
            </button>
          </div>
        </div>
        <div style={{ height: "8px", background: "var(--secondary)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}aa)`, borderRadius: "4px", transition: "width 0.4s ease, background 0.4s ease" }} />
        </div>
      </div>

      {/* Critical Fails Warning */}
      {kritikFails.length > 0 && (
        <div style={{ padding: "20px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <ShieldAlert size={24} color="#EF4444" />
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#EF4444", margin: 0 }}>Ciddi Risk Tespit Edildi</h3>
          </div>
          <p style={{ fontSize: "13px", color: "var(--foreground)", margin: "0 0 12px 0" }}>
            Aracı almaktan vazgeçmenize sebep olabilecek düzeyde kritik sorunlar işaretlediniz:
          </p>
          <ul style={{ paddingLeft: "20px", margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
            {kritikFails.map(fail => (
              <li key={fail.id} style={{ marginBottom: "6px" }}>
                <strong style={{ color: "var(--foreground)" }}>{fail.text}:</strong> {fail.hataDetayi}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Categories */}
      {CATEGORIES.map((cat) => {
        const catTotal = cat.items.length;
        const catEvaluated = cat.items.filter(i => statusMap[i.id]).length;
        const catProgress = Math.round((catEvaluated / catTotal) * 100);

        return (
          <div key={cat.label} style={{
            background: "var(--card-bg)", border: "1px solid var(--card-border)",
            borderRadius: "16px", overflow: "hidden"
          }}>
            <div style={{
              padding: "16px 24px",
              background: `${cat.color}08`,
              borderBottom: "1px solid var(--card-border)",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "22px" }}>{cat.emoji}</span>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>{cat.label}</h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: catProgress === 100 ? "#10B981" : "var(--text-muted)" }}>
                  {catEvaluated}/{catTotal}
                </div>
                <div style={{
                  width: "100px", height: "6px", background: "var(--secondary)", borderRadius: "3px", overflow: "hidden"
                }}>
                  <div style={{ width: `${catProgress}%`, height: "100%", background: catProgress === 100 ? "#10B981" : cat.color, borderRadius: "3px", transition: "width 0.3s" }} />
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column" }}>
              {cat.items.map((item, index) => {
                const status = statusMap[item.id];
                const cfg = ONCELIK[item.oncelik];
                const isFail = status === "fail";
                const isPass = status === "pass";

                return (
                  <div key={item.id} style={{
                    padding: "16px 24px",
                    borderBottom: index < cat.items.length - 1 ? "1px solid var(--card-border)" : "none",
                    background: isFail ? "rgba(239, 68, 68, 0.03)" : isPass ? "rgba(16, 185, 129, 0.03)" : "transparent",
                    transition: "background 0.2s"
                  }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div style={{ flex: 1, minWidth: "250px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)" }}>
                            {item.text}
                          </span>
                          <span style={{ padding: "2px 6px", borderRadius: "6px", fontSize: "10px", fontWeight: "800", color: cfg.color, background: cfg.bg }}>
                            {cfg.label}
                          </span>
                        </div>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
                          {item.aciklama}
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => markStatus(item.id, "pass")}
                          style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            padding: "8px 14px", borderRadius: "10px",
                            border: `1px solid ${isPass ? "#10B981" : "var(--card-border)"}`,
                            background: isPass ? "rgba(16, 185, 129, 0.1)" : "var(--secondary)",
                            color: isPass ? "#10B981" : "var(--text-muted)",
                            cursor: "pointer", fontWeight: "600", fontSize: "12px", transition: "all 0.2s"
                          }}
                        >
                          <Check size={16} /> Geçti
                        </button>
                        <button
                          onClick={() => markStatus(item.id, "fail")}
                          style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            padding: "8px 14px", borderRadius: "10px",
                            border: `1px solid ${isFail ? "#EF4444" : "var(--card-border)"}`,
                            background: isFail ? "rgba(239, 68, 68, 0.1)" : "var(--secondary)",
                            color: isFail ? "#EF4444" : "var(--text-muted)",
                            cursor: "pointer", fontWeight: "600", fontSize: "12px", transition: "all 0.2s"
                          }}
                        >
                          <X size={16} /> Sorunlu
                        </button>
                      </div>
                    </div>

                    {/* Expandable Error Detail if Fail */}
                    {isFail && item.hataDetayi && (
                      <div style={{ 
                        marginTop: "16px", padding: "16px", 
                        background: "var(--secondary)", borderRadius: "12px",
                        borderLeft: `4px solid ${cfg.color}`,
                        animation: "fadeIn 0.3s ease-out"
                      }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                          <AlertCircle size={18} color={cfg.color} style={{ marginTop: "2px", flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)", marginBottom: "4px" }}>Bu Ne Anlama Gelir?</div>
                            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5", margin: 0 }}>
                              {item.hataDetayi}
                            </p>
                            
                            {item.maliyet && (
                              <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", background: "var(--card-bg)", borderRadius: "6px", border: "1px solid var(--card-border)" }}>
                                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Olası Etki / Masraf:</span>
                                <span style={{ fontSize: "12px", fontWeight: "800", color: item.maliyet.includes("Çok Yüksek") || item.maliyet.includes("Alınmaz") ? "#EF4444" : item.maliyet.includes("Yüksek") ? "#F59E0B" : "#3B82F6" }}>
                                  {item.maliyet}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* TRAMER Note */}
      <div style={{ display: "flex", gap: "10px", padding: "16px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "12px" }}>
        <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: "1px" }} />
        <div>
          <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)", margin: "0 0 4px 0" }}>Noter Öncesi Son Kontroller</p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
            Yukarıdaki listede aracın genel mekanik ve kaporta sağlığını kontrol ettiniz. TRAMER raporunu (Şase no ile) mutlaka sorgulayın. Noter satışı öncesi e-Devlet veya banka sisteminden HGS/OGS borcu, Trafik Cezası ve Rehin durumu olup olmadığını teyit etmeyi unutmayın.
          </p>
        </div>
      </div>
    </div>
  );
}
