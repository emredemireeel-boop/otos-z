"use client";
import { useState } from "react";
import { ShieldAlert, AlertTriangle, Eye, Lock, Phone, CreditCard, Car, Users, ChevronDown, ChevronUp, CheckCircle, XCircle, Smartphone, Globe, MessageSquare, Banknote, FileWarning, ShieldCheck, Fingerprint, BadgeAlert } from "lucide-react";

const dolandiricilikYontemleri = [
  {
    id: 7, baslik: "Noter / Vekaletname (Kapora) Tuzağı", icon: FileWarning, risk: "Kritik",
    gradient: ["#E11D48","#BE123C"],
    ozet: "Satıcı kapora istemez ancak 'Notere git, telefonu memura ver ben tarif edeyim' diyerek fark ettirmeden kendisine araç satış vekaletnamesi çıkarttırır.",
    belirtiler: ["'Bana para atma, güvenini sarsmayayım' denmesi","Noter memuruyla telefonda bizzat konuşmak istenmesi","Sizden 'Araç Satış Vekaletnamesi' veya 'Muvafakatname' istenmesi","İşlemlerin çok aceleye getirilmesi"],
    korunma: ["Noterde telefonu KESİNLİKLE başkasına vermeyin!","Noter memuruna ne belgesi imzaladığınızı açıkça sorun","Kapora göndermek yerine bilet alın/gönderin (Otobüs/Uçak bileti güvenlidir)","Uzaktan kimseye vekalet vermeyin"],
  },
  {
    id: 1, baslik: "Sahte İlan Dolandırıcılığı", icon: Globe, risk: "Çok Yüksek",
    gradient: ["#EF4444","#DC2626"],
    ozet: "Piyasa değerinin çok altında fiyatlarla sahte araç ilanları yayınlanır. Kapora veya ön ödeme alınarak mağdur edilirsiniz.",
    belirtiler: ["Piyasanın çok altında fiyat","Acele ettiren satıcı","Yüz yüze görüşmekten kaçınma","Farklı şehirden kapora isteme","Belgeler bulanık veya sahte"],
    korunma: ["Fiyat gerçekçi mi kontrol edin","Aracı mutlaka yerinde görün","Kapora göndermeden önce yüz yüze görüşün","İlan fotoğraflarını ters arama yapın","Resmi platformları tercih edin"],
  },
  {
    id: 2, baslik: "Kilometre (Km) Düşürme", icon: Car, risk: "Yüksek",
    gradient: ["#F59E0B","#D97706"],
    ozet: "Aracın gerçek kilometresi düşürülerek daha az kullanılmış gibi gösterilir. Bakım maliyetleri ve güvenlik riskleri gizlenir.",
    belirtiler: ["Direksiyon/vites aşırı yıpranmış ama km düşük","Bakım geçmişi tutarsız","Pedallar aşınmış","Koltuk yıpranması km ile uyumsuz","Servis kayıtları eksik"],
    korunma: ["Tramer ve servis kaydını sorgulayın","Bağımsız ekspertiz yaptırın","OBD cihazı ile gerçek km okuyun","Bakım faturaları isteyin","Araç geçmişi raporu alın"],
  },
  {
    id: 3, baslik: "Hasarlı/Boyalı Araç Gizleme", icon: FileWarning, risk: "Yüksek",
    gradient: ["#8B5CF6","#7C3AED"],
    ozet: "Ağır kaza geçmişi, boya ve değişen parçalar gizlenerek araç temiz gibi satılır.",
    belirtiler: ["Panel aralıkları düzensiz","Boya renk tonları farklı","Conta ve fitillerde boya kalıntısı","Bagaj altı veya motor bölgesinde kaynak izi","Tramer kaydı ile satıcı beyanı uyumsuz"],
    korunma: ["Tramer sorgulama yapın","Profesyonel ekspertiz yaptırın","Boya kalınlık ölçümü isteyin","Kaporta altını inceleyin","Aracı gündüz ve açık havada kontrol edin"],
  },
  {
    id: 4, baslik: "Sahte Belge / Evrak Sahteciliği", icon: BadgeAlert, risk: "Çok Yüksek",
    gradient: ["#DC2626","#991B1B"],
    ozet: "Sahte ruhsat, sahte noter belgesi veya çalıntı araç belgeleriyle satış yapılır.",
    belirtiler: ["Belgelerde yazım hataları","Ruhsat hologramı eksik veya bozuk","Şasi numarası kazınmış/değiştirilmiş","Satıcı acele noter isteyor","Motor ve şasi numaraları uyuşmuyor"],
    korunma: ["e-Devlet'ten araç sorgulayın","Noter işlemini kendiniz yaptırın","Şasi numarasını fiziksel kontrol edin","Emniyet'ten çalıntı sorgusu yapın","Ruhsat aslını inceleyin"],
  },
  {
    id: 5, baslik: "Telefon / SMS Dolandırıcılığı", icon: Phone, risk: "Orta",
    gradient: ["#0EA5E9","#0284C7"],
    ozet: "Sahte arama veya SMS ile kişisel bilgileriniz ve banka hesap detaylarınız ele geçirilir.",
    belirtiler: ["Bilinmeyen numaradan arama","Banka/resmi kurum gibi davranma","Acil işlem baskısı","Şifre veya SMS kodu isteme","Sahte link gönderme"],
    korunma: ["Bilinmeyen numaralara dikkat edin","Banka asla şifre/SMS kodu istemez","Gelen linklere tıklamayın","Resmi numarayı kendiniz arayın","Kişisel bilgi paylaşmayın"],
  },
  {
    id: 6, baslik: "Sahte Sigorta Poliçesi", icon: ShieldAlert, risk: "Yüksek",
    gradient: ["#10B981","#059669"],
    ozet: "Geçersiz veya sahte sigorta poliçesi düzenlenerek priminiz alınır, kaza anında sigortasız kalırsınız.",
    belirtiler: ["Piyasanın çok altında sigorta teklifi","Poliçe numarası sorgulamada çıkmıyor","Tanıdık/komisyoncu aracılığı","Dijital poliçe doğrulanamıyor","Acente lisansı yok"],
    korunma: ["e-Devlet veya SBM'den poliçe sorgulayın","Lisanslı acentelerden yaptırın","Poliçe numarasını doğrulayın","Online karşılaştırma sitelerini kullanın","Ödemeyi resmi kanalla yapın"],
  },
];

const altinKurallar = [
  { icon: Eye, baslik: "Araştır & Sorgula", aciklama: "Her işlemden önce Tramer, e-Devlet ve SBM sorgulamalarını mutlaka yapın.", renk: "#3B82F6" },
  { icon: Fingerprint, baslik: "Kimlik Doğrula", aciklama: "Satıcının kimliğini, ruhsat sahibi ile eşleştiğini kontrol edin.", renk: "#8B5CF6" },
  { icon: Users, baslik: "Yüz Yüze Görüş", aciklama: "Aracı ve satıcıyı mutlaka yüz yüze görün, uzaktan para göndermeyin.", renk: "#10B981" },
  { icon: Lock, baslik: "Bilgilerini Koru", aciklama: "TC, banka şifresi, SMS kodu gibi bilgileri asla paylaşmayın.", renk: "#EF4444" },
  { icon: ShieldCheck, baslik: "Ekspertiz Yaptır", aciklama: "Bağımsız ekspertiz raporu olmadan kesinlikle araç satın almayın.", renk: "#F59E0B" },
  { icon: Smartphone, baslik: "Resmi Kanalları Kullan", aciklama: "Ödeme, sigorta ve noter işlemlerini resmi kanallardan yapın.", renk: "#0EA5E9" },
];

export default function DolandiricilikRehberiSection() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeRule, setActiveRule] = useState<number | null>(null);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a0a0a, #4C1D1D, #991B1B)', borderRadius: '24px', padding: '36px', marginBottom: '32px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 20px 60px rgba(220,38,38,0.2)' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.2), transparent)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.15), transparent)', filter: 'blur(30px)' }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(220,38,38,0.5))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(239,68,68,0.4)', boxShadow: '0 0 30px rgba(239,68,68,0.3)' }}>
            <ShieldAlert size={36} color="#FCA5A5" />
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', marginBottom: '12px' }}>
              <AlertTriangle size={12} color="#FCA5A5" />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#FCA5A5', textTransform: 'uppercase', letterSpacing: '1px' }}>Dikkat — Kritik Bilgi</span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'white', marginBottom: '12px', lineHeight: '1.3' }}>Dolandırıcılık Yöntemleri<br /><span style={{ fontSize: '20px', fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>& Korunma Rehberi</span></h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', maxWidth: '600px' }}>
              Otomotiv sektöründe en yaygın <strong style={{ color: '#FCA5A5' }}>dolandırıcılık yöntemlerini</strong> tanıyın ve <strong style={{ color: '#FCA5A5' }}>altın kurallarla</strong> kendinizi koruyun.
            </p>
          </div>
        </div>
      </div>

      {/* İstatistik Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: "Yaygın Yöntem", value: "6+", icon: AlertTriangle, color: "#EF4444" },
          { label: "Altın Kural", value: "6", icon: ShieldCheck, color: "#10B981" },
          { label: "Risk Seviyesi", value: "Kritik", icon: ShieldAlert, color: "#F59E0B" },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', textAlign: 'center', transition: 'all 0.3s' }}>
            <s.icon size={24} color={s.color} style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '900', color: s.color, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Dolandırıcılık Yöntemleri */}
      <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertTriangle size={22} color="#EF4444" /> En Yaygın Dolandırıcılık Yöntemleri
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
        {dolandiricilikYontemleri.map((yontem) => {
          const isOpen = expanded === yontem.id;
          const Icon = yontem.icon;
          return (
            <div key={yontem.id} style={{ background: 'var(--card-bg)', border: `1px solid ${isOpen ? yontem.gradient[0] + '50' : 'var(--card-border)'}`, borderRadius: '18px', overflow: 'hidden', transition: 'all 0.3s', boxShadow: isOpen ? `0 8px 30px ${yontem.gradient[0]}15` : 'none' }}>
              <div onClick={() => setExpanded(isOpen ? null : yontem.id)} style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `linear-gradient(135deg, ${yontem.gradient[0]}, ${yontem.gradient[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 15px ${yontem.gradient[0]}40` }}>
                  <Icon size={26} color="white" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>{yontem.baslik}</h4>
                    <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: yontem.risk === 'Çok Yüksek' ? 'rgba(239,68,68,0.15)' : yontem.risk === 'Yüksek' ? 'rgba(245,158,11,0.15)' : 'rgba(14,165,233,0.15)', color: yontem.gradient[0], border: `1px solid ${yontem.gradient[0]}30` }}>{yontem.risk}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>{yontem.ozet}</p>
                </div>
                <div style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              {isOpen && (
                <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--card-border)', animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', paddingTop: '20px' }}>
                    {/* Belirtiler */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                        <XCircle size={16} color="#EF4444" />
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tehlike İşaretleri</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {yontem.belirtiler.map((b, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '10px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', flexShrink: 0, marginTop: '6px' }} />
                            <span style={{ fontSize: '13px', color: 'var(--foreground)', lineHeight: '1.5' }}>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Korunma */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                        <CheckCircle size={16} color="#10B981" />
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Korunma Yolları</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {yontem.korunma.map((k, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '10px' }}>
                            <CheckCircle size={14} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontSize: '13px', color: 'var(--foreground)', lineHeight: '1.5' }}>{k}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Altın Kurallar */}
      <div style={{ background: 'linear-gradient(135deg, #0a1628, #1E3A5F, #0a1628)', borderRadius: '24px', padding: '36px', marginBottom: '32px', border: '1px solid rgba(59,130,246,0.2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent)', filter: 'blur(40px)' }} />
        <div style={{ textAlign: 'center', marginBottom: '28px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '20px', marginBottom: '14px' }}>
            <span style={{ fontSize: '16px' }}>🏆</span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '1px' }}>Altın Kurallar</span>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'white', marginBottom: '8px' }}>Korunmak İçin 6 Altın Kural</h3>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto' }}>Bu kuralları uygulayan kişilerin dolandırılma riski %95 azalır.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', position: 'relative', zIndex: 1 }}>
          {altinKurallar.map((kural, i) => {
            const Icon = kural.icon;
            const isActive = activeRule === i;
            return (
              <div key={i} onClick={() => setActiveRule(isActive ? null : i)} style={{ background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isActive ? kural.renk + '60' : 'rgba(255,255,255,0.1)'}`, borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.3s', textAlign: 'center', transform: isActive ? 'scale(1.03)' : 'scale(1)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${kural.renk}20`, border: `1px solid ${kural.renk}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <Icon size={28} color={kural.renk} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: kural.renk, marginBottom: '6px', letterSpacing: '0.5px' }}>KURAL {i + 1}</div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>{kural.baslik}</h4>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', margin: 0 }}>{kural.aciklama}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Acil Durum İhbar */}
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Phone size={20} color="#EF4444" /> Dolandırıldığınızı Düşünüyorsanız
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {[
            { no: "1", text: "155 Polis İmdat'ı arayın", renk: "#EF4444" },
            { no: "2", text: "Bankanızı arayıp hesaplarınızı bloke ettirin", renk: "#F59E0B" },
            { no: "3", text: "e-Devlet üzerinden şikâyet dilekçesi verin", renk: "#3B82F6" },
            { no: "4", text: "Tüm yazışma ve belgeleri saklayın", renk: "#10B981" },
          ].map((step) => (
            <div key={step.no} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: `${step.renk}08`, border: `1px solid ${step.renk}20`, borderRadius: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${step.renk}15`, border: `1px solid ${step.renk}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '15px', fontWeight: '900', color: step.renk }}>{step.no}</div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)' }}>{step.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 18px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <AlertTriangle size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
          Bu rehber <strong style={{ color: 'var(--foreground)' }}>Otosöz</strong> tarafından bilgilendirme amacıyla hazırlanmıştır. Şüpheli durumlarda mutlaka yetkili makamlara başvurun.
        </p>
      </div>
    </div>
  );
}
