"use client";
import { useState } from "react";
import { Snowflake, Zap, Settings, Disc, CircleDot, Gauge, Fuel, Wind, Sun, Thermometer, Volume2, Navigation, Wrench, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Search, Filter } from "lucide-react";

interface ArizaKarti {
  id: number; baslik: string; icon: any; kategori: string;
  uzman: string; uzmanAciklama: string;
  belirtiler: string[]; nereGitmeli: string; nedeniGitmeli: string;
  gradient: [string, string]; risk: "Düşük" | "Orta" | "Yüksek" | "Kritik";
  maliyet: string; sure: string;
}

const arizalar: ArizaKarti[] = [
  { id:1, baslik:"Klima Soğutmuyor / Koku Yapıyor", icon: Snowflake, kategori:"Klima",
    uzman:"Oto Klima Servisi", uzmanAciklama:"Oto tamirci veya elektrikçi klima bakmaz! Özel klima gazı dolum cihazı ve kaçak test ekipmanı gerektirir.",
    belirtiler:["Klima soğutmuyor","Kötü koku geliyor","Cam buğulanıyor","Klima sesi değişti","Kompresör çalışmıyor"],
    nereGitmeli:"Yetkili Oto Klima Servisi", nedeniGitmeli:"Klima sistemi özel gaz (R134a/R1234yf), vakum pompası ve kaçak tespit cihazı gerektirir. Normal tamircide bu ekipman bulunmaz.",
    gradient:["#0EA5E9","#0284C7"], risk:"Orta", maliyet:"500 - 3.000 ₺", sure:"1-3 saat" },
  { id:2, baslik:"Akü Bitik / Şarj Etmiyor", icon: Zap, kategori:"Elektrik",
    uzman:"Oto Elektrikçi", uzmanAciklama:"Motor tamircisi elektrik arızalarına müdahale edemez. Özel dijital test cihazları gereklidir.",
    belirtiler:["Araç çalışmıyor","Far/lamba karartı","Gösterge ışıkları yanıp sönüyor","Marş zor dönüyor","Akü şişmiş"],
    nereGitmeli:"Oto Elektrikçi / Akücü", nedeniGitmeli:"Akü sağlık testi, şarj sistemi (alternatör) kontrolü ve kablo bağlantı ölçümü özel cihazlarla yapılır.",
    gradient:["#F59E0B","#D97706"], risk:"Yüksek", maliyet:"300 - 4.000 ₺", sure:"30dk - 2 saat" },
  { id:3, baslik:"Şanzıman Sert Vites / Kayma", icon: Settings, kategori:"Şanzıman",
    uzman:"Şanzıman Uzmanı (Otomatik/Manuel)", uzmanAciklama:"Genel tamirciler şanzıman içine müdahale edemez. Özel şanzıman tezgahı ve yazılımı gerekir.",
    belirtiler:["Vites geçişleri sert","Vites atlıyor","Kayma hissi","D'ye takınca tepki yok","Vites uyarı lambası yandı"],
    nereGitmeli:"Şanzıman Uzmanı / Mekatronik Servisi", nedeniGitmeli:"Otomatik şanzıman mekatronik ünite, valf gövdesi ve yazılım kalibrasyonu gerektirir. Yanlış müdahale şanzımanı tamamen bozabilir.",
    gradient:["#8B5CF6","#7C3AED"], risk:"Kritik", maliyet:"2.000 - 30.000 ₺", sure:"1-5 gün" },
  { id:4, baslik:"Fren Sesi / Titreşim / Boşluk", icon: Disc, kategori:"Fren",
    uzman:"Fren & Süspansiyon Uzmanı", uzmanAciklama:"Fren sistemi can güvenliğidir. Disk torna, balata değişimi ve ABS kalibrasyonu yapabilen uzman gerekir.",
    belirtiler:["Fren pedalı sert/yumuşak","Fren sesi (cızırtı/gıcırtı)","Direksiyon titriyor frende","Fren mesafesi uzadı","ABS lambası yanıyor"],
    nereGitmeli:"Fren Uzmanı / Rot-Balans Servisi", nedeniGitmeli:"Disk kalınlık ölçümü, hidrolik hat kontrolü ve ABS sensör testi özel ekipman gerektirir.",
    gradient:["#EF4444","#DC2626"], risk:"Kritik", maliyet:"500 - 5.000 ₺", sure:"1-4 saat" },
  { id:5, baslik:"Direksiyon Ağırlaştı / Ses Geliyor", icon: Navigation, kategori:"Direksiyon",
    uzman:"Rot-Balans & Direksiyon Servisi", uzmanAciklama:"Direksiyon kutusu ve hidrolik/elektrikli direksiyon arızaları özel tezgah ve kalibrasyon gerektirir.",
    belirtiler:["Direksiyon ağır","Dönüşlerde ses var","Araç sağa/sola çekiyor","Direksiyon titriyor","Direksiyon simidi oynuyor"],
    nereGitmeli:"Rot-Balans / Direksiyon Uzmanı", nedeniGitmeli:"Rot-balans ayarı, aks ölçümü ve direksiyon kutusu tamiri 3D düzlem ayar cihazı gerektirir.",
    gradient:["#10B981","#059669"], risk:"Yüksek", maliyet:"300 - 6.000 ₺", sure:"1-3 saat" },
  { id:6, baslik:"Motor Arıza Lambası Yandı", icon: AlertTriangle, kategori:"Motor",
    uzman:"Oto Motor Tamircisi / Yetkili Servis", uzmanAciklama:"Motor arıza tespiti OBD cihazı ve uzmanlık gerektirir. Rastgele parça değişimi sorunu çözmez.",
    belirtiler:["Motor arıza lambası yandı","Motor gücü düştü","Rölantide titreşim","Egzoz dumanı değişti","Yakıt tüketimi arttı"],
    nereGitmeli:"Motor Uzmanı / Yetkili Servis", nedeniGitmeli:"OBD arıza kodu okuma, emisyon testi ve motor iç parça kontrolü yapan deneyimli motor ustası gerekir.",
    gradient:["#F97316","#EA580C"], risk:"Yüksek", maliyet:"500 - 20.000 ₺", sure:"2 saat - 3 gün" },
  { id:7, baslik:"Süspansiyon / Amortisör Sorunu", icon: CircleDot, kategori:"Süspansiyon",
    uzman:"Rot-Balans & Süspansiyon Servisi", uzmanAciklama:"Amortisör ve yay değişimi özel pres ve güvenlik ekipmanı gerektirir. Yanlış müdahale çok tehlikelidir.",
    belirtiler:["Tümseklerde aşırı zıplama","Virajlarda yalpalama","Tek taraf çökmüş","Takırtı sesi","Lastik aşınması düzensiz"],
    nereGitmeli:"Süspansiyon Uzmanı / Rot-Balans", nedeniGitmeli:"Amortisör testi, burç değişimi ve aks geometrisi ölçümü profesyonel ekipmanla yapılır.",
    gradient:["#6366F1","#4F46E5"], risk:"Orta", maliyet:"1.000 - 8.000 ₺", sure:"2-6 saat" },
  { id:8, baslik:"LPG Sistemi Arızası", icon: Fuel, kategori:"LPG",
    uzman:"LPG Servis / Dönüşüm Merkezi", uzmanAciklama:"LPG sistemi patlama riski taşır! Kesinlikle genel tamircide tamir edilmemelidir.",
    belirtiler:["Gaz kokusu","LPG'de çalışmıyor","Beyin arızası","Enjektör tıkanması","Gaz kaçağı şüphesi"],
    nereGitmeli:"Yetkili LPG Servis Merkezi", nedeniGitmeli:"LPG sistemi basınçlı gaz içerir. Kaçak testi, enjektör kalibrasyonu ve beyin yazılımı güncelleme uzmanlık gerektirir.",
    gradient:["#14B8A6","#0D9488"], risk:"Kritik", maliyet:"500 - 5.000 ₺", sure:"1-4 saat" },
  { id:9, baslik:"Turbo Arızası / Güç Kaybı", icon: Wind, kategori:"Motor",
    uzman:"Turbo Uzmanı / Dizel Pompa Servisi", uzmanAciklama:"Turbo tamiri özel tezgah ve balans cihazı gerektirir. Yanlış müdahale motora zarar verir.",
    belirtiler:["Motor güç kaybı","Egzozdan aşırı duman","Islık/uğultu sesi","Yağ tüketimi arttı","Turbo uyarı lambası"],
    nereGitmeli:"Turbo Uzmanı / Dizel Servis", nedeniGitmeli:"Turbo revizyon, balans ayarı ve wastegate kalibrasyonu özel turbo tezgahında yapılır.",
    gradient:["#64748B","#475569"], risk:"Yüksek", maliyet:"3.000 - 15.000 ₺", sure:"1-3 gün" },
  { id:10, baslik:"Far / Aydınlatma Sorunu", icon: Sun, kategori:"Elektrik",
    uzman:"Oto Elektrikçi", uzmanAciklama:"LED/Xenon far modülleri özel programlama gerektirebilir. Kablo arızaları oto elektrikçi işidir.",
    belirtiler:["Far yanmıyor","Far kararıyor/titriyor","Sinyal çalışmıyor","Sis farı arızası","Far ayarı bozuk"],
    nereGitmeli:"Oto Elektrikçi / Far Uzmanı", nedeniGitmeli:"LED/Xenon balast değişimi, kablo testi ve far seviye ayarı oto elektrikçi uzmanlığıdır.",
    gradient:["#EAB308","#CA8A04"], risk:"Düşük", maliyet:"100 - 3.000 ₺", sure:"30dk - 2 saat" },
  { id:11, baslik:"Egzoz Sesi / Katalitik Konvertör", icon: Volume2, kategori:"Egzoz",
    uzman:"Egzoz Uzmanı / Egzozcu", uzmanAciklama:"Egzoz kaynak ve montajı özel tezgah ve bükme makinesi gerektirir.",
    belirtiler:["Egzoz sesi arttı","Egzozdan patlama sesi","Egzoz alttan su damlıyor","Katalitik uyarısı","Emisyon testi geçemiyor"],
    nereGitmeli:"Egzoz Uzmanı / Egzozcu", nedeniGitmeli:"Egzoz borusu bükme, katalitik konvertör testi ve susturucu montajı özel egzoz tezgahında yapılır.",
    gradient:["#78716C","#57534E"], risk:"Orta", maliyet:"500 - 8.000 ₺", sure:"1-4 saat" },
  { id:12, baslik:"Radyatör / Hararet Sorunu", icon: Thermometer, kategori:"Soğutma",
    uzman:"Radyatörcü / Motor Tamircisi", uzmanAciklama:"Soğutma sistemi arızaları motor hasarına yol açabilir. Basınç testi ve termostat kontrolü gerekir.",
    belirtiler:["Hararet yükseliyor","Kalorifer ısıtmıyor","Antifriz kaçağı","Su pompası sesi","Radyatör fanı çalışmıyor"],
    nereGitmeli:"Radyatörcü / Motor Uzmanı", nedeniGitmeli:"Radyatör basınç testi, termostat kontrolü ve su pompası değişimi motor uzmanlığı gerektirir.",
    gradient:["#DC2626","#B91C1C"], risk:"Kritik", maliyet:"300 - 5.000 ₺", sure:"1-6 saat" },
];

const kategoriler = ["Tümü", ...new Set(arizalar.map(a => a.kategori))];
const riskRenk: Record<string, string> = { "Düşük":"#10B981", "Orta":"#F59E0B", "Yüksek":"#EF4444", "Kritik":"#DC2626" };

export default function NereyeGitmeliSection() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState("Tümü");

  const filtered = arizalar.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.baslik.toLowerCase().includes(q) || a.uzman.toLowerCase().includes(q) || a.belirtiler.some(b => b.toLowerCase().includes(q));
    const matchKat = filtre === "Tümü" || a.kategori === filtre;
    return matchSearch && matchKat;
  });

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0c1222, #1E3A5F, #2563EB)', borderRadius: '24px', padding: '36px', marginBottom: '28px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(37,99,235,0.3)', boxShadow: '0 20px 60px rgba(37,99,235,0.15)' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'250px', height:'250px', borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.2), transparent)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:'-30px', left:'-30px', width:'160px', height:'160px', borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,0.15), transparent)', filter:'blur(30px)' }} />
        <div style={{ display:'flex', alignItems:'flex-start', gap:'20px', position:'relative', zIndex:1 }}>
          <div style={{ width:'72px', height:'72px', borderRadius:'20px', background:'linear-gradient(135deg, rgba(37,99,235,0.4), rgba(59,130,246,0.6))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:'1px solid rgba(59,130,246,0.5)', boxShadow:'0 0 30px rgba(37,99,235,0.3)' }}>
            <Wrench size={36} color="#93C5FD" />
          </div>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 12px', background:'rgba(59,130,246,0.2)', border:'1px solid rgba(59,130,246,0.3)', borderRadius:'20px', marginBottom:'12px' }}>
              <Wrench size={12} color="#93C5FD" />
              <span style={{ fontSize:'11px', fontWeight:'700', color:'#93C5FD', textTransform:'uppercase', letterSpacing:'1px' }}>Uzman Yönlendirme Rehberi</span>
            </div>
            <h2 style={{ fontSize:'28px', fontWeight:'900', color:'white', marginBottom:'12px', lineHeight:'1.3' }}>Arızan Ne? Nereye Gitmelisin?</h2>
            <p style={{ fontSize:'15px', color:'rgba(255,255,255,0.75)', lineHeight:'1.7', maxWidth:'600px' }}>
              Aracında bir sorun mu var? <strong style={{ color:'#93C5FD' }}>Doğru uzmana</strong> gitmek hem zaman hem para kazandırır. Yanlış yere gitmek sorunu büyütebilir!
            </p>
          </div>
        </div>
      </div>

      {/* Arama & Filtre */}
      <div style={{ display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:'250px', display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'14px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input type="text" placeholder="Arıza veya belirti ara..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'var(--foreground)', fontSize:'14px' }} />
        </div>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center' }}>
          {kategoriler.map(k => (
            <button key={k} onClick={() => setFiltre(k)} style={{
              padding:'8px 16px', borderRadius:'10px', fontSize:'12px', fontWeight:'600', cursor:'pointer', transition:'all 0.2s',
              background: filtre === k ? 'var(--primary)' : 'var(--card-bg)',
              color: filtre === k ? 'white' : 'var(--foreground)',
              border: `1px solid ${filtre === k ? 'var(--primary)' : 'var(--card-border)'}`,
            }}>{k}</button>
          ))}
        </div>
      </div>

      <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'16px' }}>
        <strong style={{ color:'var(--foreground)' }}>{filtered.length}</strong> arıza türü listeleniyor
      </p>

      {/* Kartlar */}
      <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'36px' }}>
        {filtered.map(a => {
          const isOpen = expanded === a.id;
          const Icon = a.icon;
          return (
            <div key={a.id} style={{ background:'var(--card-bg)', border:`1px solid ${isOpen ? a.gradient[0]+'50' : 'var(--card-border)'}`, borderRadius:'18px', overflow:'hidden', transition:'all 0.3s', boxShadow: isOpen ? `0 8px 30px ${a.gradient[0]}12` : 'none' }}>
              <div onClick={() => setExpanded(isOpen ? null : a.id)} style={{ padding:'20px 24px', cursor:'pointer', display:'flex', alignItems:'center', gap:'16px' }}>
                <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:`linear-gradient(135deg, ${a.gradient[0]}, ${a.gradient[1]})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 4px 15px ${a.gradient[0]}40` }}>
                  <Icon size={26} color="white" />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px', flexWrap:'wrap' }}>
                    <h4 style={{ fontSize:'16px', fontWeight:'700', color:'var(--foreground)', margin:0 }}>{a.baslik}</h4>
                    <span style={{ padding:'2px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background:`${riskRenk[a.risk]}15`, color:riskRenk[a.risk], border:`1px solid ${riskRenk[a.risk]}30` }}>{a.risk}</span>
                  </div>
                  <p style={{ fontSize:'13px', color:'var(--text-muted)', margin:0 }}>
                    👉 <strong style={{ color:a.gradient[0] }}>{a.uzman}</strong>
                  </p>
                </div>
                <div style={{ display:'flex', gap:'16px', alignItems:'center', flexShrink:0 }}>
                  <div style={{ textAlign:'center', display:'none' }}> {/* hidden on mobile via CSS */}
                    <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>Maliyet</div>
                    <div style={{ fontSize:'13px', fontWeight:'700', color:'var(--foreground)' }}>{a.maliyet}</div>
                  </div>
                  <div style={{ color:'var(--text-muted)' }}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>
              {isOpen && (
                <div style={{ padding:'0 24px 24px', borderTop:'1px solid var(--card-border)', animation:'fadeIn 0.3s ease' }}>
                  {/* Uyarı */}
                  <div style={{ margin:'20px 0 16px', padding:'14px 18px', background:`${a.gradient[0]}08`, border:`1px solid ${a.gradient[0]}20`, borderRadius:'12px', display:'flex', alignItems:'flex-start', gap:'12px' }}>
                    <AlertTriangle size={18} color={a.gradient[0]} style={{ flexShrink:0, marginTop:'2px' }} />
                    <p style={{ fontSize:'13px', color:'var(--foreground)', lineHeight:'1.6', margin:0, fontWeight:'500' }}>{a.uzmanAciklama}</p>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
                    {/* Belirtiler */}
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                        <AlertTriangle size={14} color="#EF4444" />
                        <span style={{ fontSize:'12px', fontWeight:'700', color:'#EF4444', textTransform:'uppercase', letterSpacing:'0.5px' }}>Belirtiler</span>
                      </div>
                      {a.belirtiler.map((b,i) => (
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', marginBottom:'6px', background:'rgba(239,68,68,0.04)', border:'1px solid rgba(239,68,68,0.08)', borderRadius:'8px' }}>
                          <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#EF4444', flexShrink:0 }} />
                          <span style={{ fontSize:'13px', color:'var(--foreground)' }}>{b}</span>
                        </div>
                      ))}
                    </div>
                    {/* Nereye Git */}
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                        <CheckCircle size={14} color="#10B981" />
                        <span style={{ fontSize:'12px', fontWeight:'700', color:'#10B981', textTransform:'uppercase', letterSpacing:'0.5px' }}>Nereye Gitmeli?</span>
                      </div>
                      <div style={{ padding:'16px', background:`${a.gradient[0]}08`, border:`1px solid ${a.gradient[0]}20`, borderRadius:'12px', marginBottom:'12px' }}>
                        <div style={{ fontSize:'16px', fontWeight:'800', color:a.gradient[0], marginBottom:'8px' }}>{a.nereGitmeli}</div>
                        <p style={{ fontSize:'13px', color:'var(--foreground)', lineHeight:'1.6', margin:0 }}>{a.nedeniGitmeli}</p>
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                        <div style={{ padding:'10px 14px', background:'var(--secondary)', borderRadius:'10px', border:'1px solid var(--card-border)' }}>
                          <div style={{ fontSize:'10px', color:'var(--text-muted)', fontWeight:'600', textTransform:'uppercase' }}>Tahmini Maliyet</div>
                          <div style={{ fontSize:'14px', fontWeight:'800', color:'var(--foreground)', marginTop:'4px' }}>{a.maliyet}</div>
                        </div>
                        <div style={{ padding:'10px 14px', background:'var(--secondary)', borderRadius:'10px', border:'1px solid var(--card-border)' }}>
                          <div style={{ fontSize:'10px', color:'var(--text-muted)', fontWeight:'600', textTransform:'uppercase' }}>Tahmini Süre</div>
                          <div style={{ fontSize:'14px', fontWeight:'800', color:'var(--foreground)', marginTop:'4px' }}>{a.sure}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Genel Kural Kutusu */}
      <div style={{ background:'linear-gradient(135deg, #0a1628, #1a2744)', borderRadius:'20px', padding:'28px', marginBottom:'24px', border:'1px solid rgba(59,130,246,0.2)' }}>
        <h3 style={{ fontSize:'18px', fontWeight:'800', color:'white', marginBottom:'16px', display:'flex', alignItems:'center', gap:'10px' }}>
          💡 Genel Kural: Doğru Uzmana Git!
        </h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'12px' }}>
          {[
            { emoji:"🔧", baslik:"Motor Sorunu", git:"Motor Tamircisi / Yetkili Servis" },
            { emoji:"⚡", baslik:"Elektrik Sorunu", git:"Oto Elektrikçi" },
            { emoji:"❄️", baslik:"Klima Sorunu", git:"Oto Klima Servisi" },
            { emoji:"⚙️", baslik:"Şanzıman Sorunu", git:"Şanzıman / Mekatronik Uzmanı" },
            { emoji:"🛞", baslik:"Fren / Süspansiyon", git:"Rot-Balans Servisi" },
            { emoji:"⛽", baslik:"LPG Sorunu", git:"Yetkili LPG Servisi" },
          ].map((r,i) => (
            <div key={i} style={{ padding:'14px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px' }}>
              <div style={{ fontSize:'14px', fontWeight:'700', color:'white', marginBottom:'4px' }}>{r.emoji} {r.baslik}</div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)' }}>→ {r.git}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding:'14px 18px', background:'var(--secondary)', border:'1px solid var(--card-border)', borderRadius:'12px', display:'flex', alignItems:'flex-start', gap:'10px' }}>
        <AlertTriangle size={18} color="var(--text-muted)" style={{ flexShrink:0, marginTop:'2px' }} />
        <p style={{ fontSize:'12px', color:'var(--text-muted)', margin:0, lineHeight:'1.6' }}>
          Bu rehber <strong style={{ color:'var(--foreground)' }}>Otosöz</strong> tarafından bilgilendirme amacıyla hazırlanmıştır. Maliyetler ve süreler tahminidir, bölgeye göre değişiklik gösterebilir.
        </p>
      </div>
    </div>
  );
}
