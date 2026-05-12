"use client";

import { MessageSquare, AlertTriangle, ShieldAlert, CheckCircle, Info, Smartphone, FileText, XCircle, Clock } from "lucide-react";

export default function HasarSorgulamaSection() {
  return (
    <div style={{ animation: "fadeIn 0.3s ease", paddingBottom: "40px" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", borderRadius: "24px", padding: "36px", marginBottom: "32px", position: "relative", overflow: "hidden", border: "1px solid rgba(59,130,246,0.3)", boxShadow: "0 20px 60px rgba(59,130,246,0.2)" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "250px", height: "250px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent)", filter: "blur(40px)" }} />
        
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", position: "relative", zIndex: 1 }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(255,255,255,0.2)" }}>
            <MessageSquare size={36} color="white" />
          </div>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", background: "rgba(255,255,255,0.2)", borderRadius: "20px", marginBottom: "12px" }}>
              <ShieldAlert size={12} color="white" />
              <span style={{ fontSize: "11px", fontWeight: "700", color: "white", textTransform: "uppercase", letterSpacing: "1px" }}>Resmi SBM Hizmeti</span>
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: "900", color: "white", margin: "0 0 8px 0", lineHeight: "1.3" }}>
              5664 SMS Hasar (Tramer) Sorgulama
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: "1.6", maxWidth: "600px" }}>
              İkinci el araç almadan önce aracın kaza geçmişini, tramer tutarını ve değişen parçalarını SMS ile anında öğrenin.
            </p>
          </div>
        </div>
      </div>

      {/* Adım Adım Sorgulama */}
      <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--foreground)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <Smartphone size={22} color="#3B82F6" /> Nasıl Sorgulama Yapılır?
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
        {/* Adım 1 */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px", position: "relative" }}>
          <div style={{ position: "absolute", top: "24px", right: "24px", opacity: 0.1 }}>
            <MessageSquare size={48} />
          </div>
          <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(59,130,246,0.1)", color: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "16px", marginBottom: "16px" }}>1</div>
          <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>Plaka ile Sorgulama</h4>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px", lineHeight: "1.6" }}>
            Telefonunuzun mesajlar bölümüne girin. Boşluk bırakmadan <strong>HASAR</strong> yazıp bir boşluk bırakarak aracın <strong>plakasını</strong> yazın.
          </p>
          <div style={{ padding: "16px", background: "var(--secondary)", borderRadius: "12px", border: "1px dashed var(--card-border)", textAlign: "center", fontSize: "18px", fontWeight: "800", letterSpacing: "1px" }}>
            HASAR 35OTO999 <br />
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500", letterSpacing: "normal" }}>yazıp <strong>5664</strong>&apos;e gönderin</span>
          </div>
        </div>

        {/* Adım 2 (Şasi) */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px", position: "relative" }}>
          <div style={{ position: "absolute", top: "24px", right: "24px", opacity: 0.1 }}>
            <FileText size={48} />
          </div>
          <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(59,130,246,0.1)", color: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "16px", marginBottom: "16px" }}>2</div>
          <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>Şasi Numarası ile Sorgulama</h4>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px", lineHeight: "1.6" }}>
            Plaka değişmiş olsa bile hasar kaydını net görmek için her zaman Şasi (S) numarasıyla ikinci bir sorgulama yapın.
          </p>
          <div style={{ padding: "16px", background: "var(--secondary)", borderRadius: "12px", border: "1px dashed var(--card-border)", textAlign: "center", fontSize: "18px", fontWeight: "800", letterSpacing: "1px" }}>
            HASAR S 17HANELISASINO <br />
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500", letterSpacing: "normal" }}>yazıp <strong>5664</strong>&apos;e gönderin</span>
          </div>
        </div>
      </div>

      {/* Ücretlendirme Uyarısı (Çift SMS) */}
      <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "16px", padding: "24px", marginBottom: "32px", display: "flex", gap: "20px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Clock size={24} color="#F59E0B" />
        </div>
        <div>
          <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#F59E0B", marginBottom: "8px" }}>
            Ücretlendirme ve Gecikme Uyarısı! (ÖNEMLİ)
          </h4>
          <p style={{ fontSize: "14px", color: "var(--foreground)", lineHeight: "1.6", margin: "0 0 12px 0" }}>
            5664 SMS sorgulama hizmeti <strong>ücretlidir.</strong> Ücretlendirme tüm operatörler (Turkcell, Türk Telekom, Vodafone) için sorgulama başına <strong style={{ color: "#EF4444" }}>275,00 TL</strong>&apos;dir.
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px" }}>
            <AlertTriangle size={16} color="#EF4444" style={{ marginTop: "2px", flexShrink: 0 }} />
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#EF4444" }}>
              LÜTFEN BEKLEYİN: Mesaj attıktan sonra sistemin yoğunluğuna göre cevap 3-5 dakika gecikebilir. "Cevap gelmedi" diyerek peş peşe tekrar SMS atmayın, aksi halde her bir SMS için sizden tekrar tekrar 275 TL kesilecektir!
            </span>
          </div>
        </div>
      </div>

      {/* ERP ve Bedelsiz Hasar Uyarısı */}
      <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--foreground)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <AlertTriangle size={22} color="#EF4444" /> Gelen Mesajı Doğru Okumak
      </h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
        {/* ERP Nedir */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "20px", display: "flex", gap: "16px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Info size={20} color="#10B981" />
          </div>
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "6px" }}>"ERP Çarpışma" Ne Demek?</h4>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
              Gelen mesajda gördüğünüz <strong>ERP</strong> (Eksper Raporu) kısaltması, söz konusu kazanın ardından bir sigorta eksperinin aracı incelediğini ve değişen/boyanan parçaların resmi olarak raporlandığını gösterir. Aracın kayıt altında yetkili bir onarım gördüğü anlamına gelir.
            </p>
          </div>
        </div>

        {/* Fiyat Yazmıyorsa Tehlike */}
        <div style={{ background: "linear-gradient(to right, rgba(239,68,68,0.05), transparent)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "20px", display: "flex", gap: "16px", borderLeft: "4px solid #EF4444" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <XCircle size={20} color="#EF4444" />
          </div>
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#EF4444", marginBottom: "6px" }}>
              Bedelsiz Hasar Kaydına DİKKAT! (Fiyat Yoksa)
            </h4>
            <p style={{ fontSize: "14px", color: "var(--foreground)", margin: 0, lineHeight: "1.6" }}>
              Eğer gelen mesajda "Çarpma" yazıyor ancak karşısında bir <strong style={{ color: "#EF4444" }}>fiyat (rakam) yazmıyorsa</strong> bu çok tehlikelidir! Bu durum genellikle şu anlama gelir:
            </p>
            <ul style={{ marginTop: "10px", paddingLeft: "20px", fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>Araç sigorta şirketi tarafından <strong>"Pert (Ağır Hasarlı)"</strong> sayılarak hurdaya çıkarılmış, ancak satıcı bunu gizliyor olabilir.</li>
              <li>Araç sahibi kazada kusurlu bulunmuş ve aracı kaskodan değil, cebinden (merdiven altı tamircilerde) yaptırmış olabilir. Bu yüzden resmi masraf sisteme girilmemiştir.</li>
              <li>Karşı tarafın masrafı sizin aracın sigortasından karşılanmış, ancak sizin aracın ne kadar hasar aldığı meçhul kalmıştır.</li>
            </ul>
            <div style={{ marginTop: "12px", fontSize: "12px", fontWeight: "700", color: "#EF4444" }}>
              Uzman Tavsiyesi: Fiyatı (Bedeli) olmayan hasar kayıtlı araçlardan ekspertiz garantisi almadan kesinlikle uzak durun!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
