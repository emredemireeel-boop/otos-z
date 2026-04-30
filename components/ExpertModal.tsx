"use client";
import { useState } from "react";
import { X, ShoppingCart, Wrench, Car, ChevronRight, ChevronLeft, Plus, Trash2, Link as LinkIcon, AlertTriangle, CheckCircle, Send, Sparkles, Users, Store, HardHat, Scale, Shield, FileText, MapPin, Truck, MessageSquare, Award } from "lucide-react";

type FlowType = "buysell" | "fault" | "accident";
type BuySellRole = "dealer" | "user" | "expert";
type AccRole = "user" | "expert" | "dealer" | "traffic" | "insurer";

interface Props { show: boolean; onClose: () => void; onSubmitFree: (data: any) => void; }

const S = {
  overlay: { position:'fixed' as const,inset:0,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center' as const,justifyContent:'center' as const,zIndex:1000,padding:'16px' },
  modal: { background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'20px',padding:'0',width:'100%',maxWidth:'640px',maxHeight:'85vh',display:'flex',flexDirection:'column' as const,overflow:'hidden' as const },
  header: { padding:'20px 24px',borderBottom:'1px solid var(--card-border)',display:'flex',justifyContent:'space-between' as const,alignItems:'center' as const },
  body: { padding:'24px',overflowY:'auto' as const,flex:1 },
  footer: { padding:'16px 24px',borderTop:'1px solid var(--card-border)',display:'flex',gap:'12px' },
  btn: (active:boolean,color?:string) => ({ padding:'12px 24px',borderRadius:'12px',border:'none',cursor:active?'pointer':'not-allowed',fontWeight:'600' as const,fontSize:'14px',opacity:active?1:0.5,background:color||'var(--primary)',color:'white',display:'flex',alignItems:'center' as const,gap:'8px',flex:1,justifyContent:'center' as const }),
  btnSec: { padding:'12px 24px',borderRadius:'12px',border:'1px solid var(--card-border)',cursor:'pointer',fontWeight:'500' as const,fontSize:'14px',background:'var(--secondary)',color:'var(--foreground)',display:'flex',alignItems:'center' as const,gap:'8px',justifyContent:'center' as const },
  card: (sel:boolean,c:string) => ({ background:sel?`${c}10`:'var(--secondary)',border:sel?`2px solid ${c}`:'2px solid var(--card-border)',borderRadius:'16px',padding:'20px',cursor:'pointer',transition:'all 0.2s' }),
  roleCard: (sel:boolean,c:string) => ({ background:sel?`${c}15`:'var(--secondary)',border:sel?`2px solid ${c}`:'2px solid var(--card-border)',borderRadius:'14px',padding:'16px',cursor:'pointer',transition:'all 0.2s' }),
  input: { width:'100%',padding:'12px 16px',background:'var(--secondary)',border:'1px solid var(--card-border)',borderRadius:'10px',color:'var(--foreground)',fontSize:'14px',outline:'none' },
  label: { display:'block',fontSize:'13px',fontWeight:'600' as const,color:'var(--text-muted)',marginBottom:'8px' },
  tag: (c:string) => ({ padding:'3px 8px',borderRadius:'6px',fontSize:'11px',fontWeight:'700' as const,background:`${c}18`,color:c }),
};

const FLOWS = [
  { key:'buysell' as FlowType,title:'Alım-Satım Destek',desc:'Karar vermeden önce ustaya sor',badge:'En çok tercih edilen',color:'#f59e0b',icon:ShoppingCart,features:['5 araca kadar değerlendirme','Artı-eksi listesi','Dikkat edilmesi gerekenler'] },
  { key:'fault' as FlowType,title:'Araç Arıza Destek',desc:'Ses, titreme, uyarı ışığı… Usta yorumlasın',badge:'Tek seferlik danışmanlık',color:'#ef4444',icon:Wrench,features:['Olası neden analizi','Maliyet tahmini','Kontrol planı'] },
  { key:'accident' as FlowType,title:'Kaza Destek',desc:'Hasar, parça ve işçilik için hızlı ön rapor',badge:'Sigorta öncesi tavsiye',color:'#3b82f6',icon:Car,features:['Hasar analizi','Parça/işçilik bedeli','Süreç planı'] },
];

const BUYSELL_ROLES = [
  { key:'dealer' as BuySellRole,title:'Galerici',desc:'Mağazan için hızlı artı-eksi değerlendirme',icon:Store,color:'#7c4dff' },
  { key:'user' as BuySellRole,title:'Kullanıcı (Alıcı)',desc:'Risk, kronik sorun ve pazarlık ipuçları',icon:Users,color:'#ff6f00' },
  { key:'expert' as BuySellRole,title:'Usta',desc:'Müşterine rapor hazırlarken destek',icon:HardHat,color:'#00c853' },
];

const ACC_ROLES = [
  { key:'user' as AccRole,title:'Tecrübeli Kullanıcı',desc:'İlk adımlar ve iletişim stratejisi',icon:Users,color:'#7c4dff' },
  { key:'expert' as AccRole,title:'Usta',desc:'Hasar kalemleri ve maliyet tahmini',icon:HardHat,color:'#ff6f00' },
  { key:'dealer' as AccRole,title:'Galerici',desc:'İkinci el değer etkisi analizi',icon:Store,color:'#00c853' },
  { key:'traffic' as AccRole,title:'Trafik Memuru',desc:'Kusur oranı ve tutanak kontrolü',icon:Scale,color:'#26a69a' },
  { key:'insurer' as AccRole,title:'Sigortacı',desc:'Kasko-trafik sigortası süreci',icon:Shield,color:'#42a5f5' },
];

export default function ExpertModal({ show, onClose, onSubmitFree }: Props) {
  const [mode, setMode] = useState<'choose'|'forum'|'pro'>('choose');
  const [step, setStep] = useState(1);
  const [flow, setFlow] = useState<FlowType|null>(null);
  // Forum simple state
  const [forumQ, setForumQ] = useState({ title: '', content: '', subCategory: 'Motor' });
  // BuySell state
  const [bsRole, setBsRole] = useState<BuySellRole>("user");
  const [links, setLinks] = useState([""]);
  const [bsNotes, setBsNotes] = useState("");
  // Fault state
  const [fSubject, setFSubject] = useState("");
  const [fDetail, setFDetail] = useState("");
  // Accident state
  const [accRole, setAccRole] = useState<AccRole|null>(null);
  const [accSummary, setAccSummary] = useState("");
  const [accLocation, setAccLocation] = useState("");
  const [accPlate, setAccPlate] = useState("");
  const [accTow, setAccTow] = useState(false);
  const [accNotes, setAccNotes] = useState("");
  const [showDevMsg, setShowDevMsg] = useState(false);

  if (!show) return null;

  const reset = () => { setMode('choose'); setStep(1); setFlow(null); setForumQ({title:'',content:'',subCategory:'Motor'}); setBsRole("user"); setLinks([""]); setBsNotes(""); setFSubject(""); setFDetail(""); setAccRole(null); setAccSummary(""); setAccLocation(""); setAccPlate(""); setAccTow(false); setAccNotes(""); setShowDevMsg(false); };

  const canStep2 = () => {
    if (flow === "buysell") return links.some(l => l.trim());
    if (flow === "fault") return fSubject.trim() && fDetail.trim();
    if (flow === "accident") return accRole && accSummary.trim();
    return false;
  };

  const buildContent = () => {
    if (flow === "buysell") {
      const validLinks = links.filter(l => l.trim());
      return `[Alım-Satım Destek | Rol: ${BUYSELL_ROLES.find(r=>r.key===bsRole)?.title}]\n\n📎 İlan Linkleri:\n${validLinks.map((l,i)=>`${i+1}. ${l}`).join('\n')}\n\n${bsNotes ? `📝 Notlar:\n${bsNotes}` : ''}`;
    }
    if (flow === "fault") {
      return `[Araç Arıza Destek]\n\n🔧 Konu: ${fSubject}\n\n📋 Detay:\n${fDetail}`;
    }
    if (flow === "accident") {
      const role = ACC_ROLES.find(r=>r.key===accRole)?.title;
      return `[Kaza Destek | Rol: ${role}]\n\n📋 Özet:\n${accSummary}\n\n${accLocation?`📍 Konum: ${accLocation}\n`:''}${accPlate?`🚗 Karşı Plaka: ${accPlate}\n`:''}${accTow?'🚛 Çekici ihtiyacı var\n':''}${accNotes?`\n💬 Notlar:\n${accNotes}`:''}`;
    }
    return "";
  };

  const getTitle = () => {
    if (flow === "buysell") return "Alım-Satım Destek";
    if (flow === "fault") return "Araç Arıza Destek";
    if (flow === "accident") return "Kaza Destek";
    return "";
  };

  const getSubCat = () => {
    if (flow === "buysell") return "Alım-Satım";
    if (flow === "fault") return "Motor";
    if (flow === "accident") return "Kaza";
    return "Diğer";
  };

  const handleFree = () => {
    onSubmitFree({ title: `${getTitle()}: ${flow==='fault'?fSubject:flow==='accident'?accSummary.slice(0,60):links.find(l=>l.trim())||'İlan değerlendirme'}`, content: buildContent(), subCategory: getSubCat() });
    reset(); onClose();
  };

  const stepTitle = mode==='choose'?'Uzmana Soru Sor':mode==='forum'?'Foruma Soru Sor':step===1?'Destek Türü Seçin':step===2?getTitle():'Gönderim Yöntemi';
  const totalSteps = mode==='pro'?3:1;
  const currentStep = mode==='pro'?step:1;

  return (
    <div style={S.overlay} onClick={()=>{onClose();reset();}}>
      <div style={S.modal} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={S.header}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            {(mode!=='choose') && <button onClick={()=>{if(mode==='forum'){setMode('choose');}else if(step>1){setStep(step-1);}else{setMode('choose');}}} style={{...S.btnSec,padding:'8px',flex:'none'}}><ChevronLeft size={18}/></button>}
            <div>
              <h2 style={{fontSize:'20px',fontWeight:'700',color:'var(--foreground)',margin:0}}>{stepTitle}</h2>
              {mode==='pro' && <span style={{fontSize:'12px',color:'var(--text-muted)'}}>Adım {step}/3</span>}
            </div>
          </div>
          <button onClick={()=>{onClose();reset();}} style={{background:'transparent',border:'none',color:'var(--text-muted)',cursor:'pointer'}}><X size={22}/></button>
        </div>
        {/* Progress */}
        {mode==='pro' && <div style={{height:'3px',background:'var(--secondary)'}}>
          <div style={{height:'100%',width:`${(step/3)*100}%`,background:'linear-gradient(90deg,var(--primary),#7c4dff)',transition:'width 0.3s',borderRadius:'0 2px 2px 0'}}/>
        </div>}
        {/* Body */}
        <div style={S.body}>
          {/* MODE: CHOOSE */}
          {mode==='choose' && (
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <p style={{fontSize:'14px',color:'var(--text-muted)',margin:'0 0 4px'}}>Nasıl soru sormak istiyorsun?</p>
              <div style={{...S.roleCard(false,'#22c55e'),padding:'20px',cursor:'pointer'}} onClick={()=>setMode('forum')}>
                <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                  <div style={{width:'52px',height:'52px',borderRadius:'14px',background:'rgba(34,197,94,0.12)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><MessageSquare size={24} color="#22c55e"/></div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'17px',fontWeight:'700',color:'var(--foreground)'}}>Foruma Sor</div>
                    <div style={{fontSize:'13px',color:'var(--text-muted)',marginTop:'4px',lineHeight:'1.5'}}>Topluluk ve gönüllü uzmanlar yanıtlar. Ücretsiz.</div>
                  </div>
                  <ChevronRight size={20} color="var(--text-muted)"/>
                </div>
              </div>
              <div style={{...S.roleCard(false,'#7c4dff'),padding:'20px',cursor:'pointer',position:'relative'}} onClick={()=>setMode('pro')}>
                <div style={{position:'absolute',top:'10px',right:'10px',padding:'3px 10px',borderRadius:'8px',fontSize:'10px',fontWeight:'700',background:'linear-gradient(135deg,#7c4dff,#ff6b00)',color:'white'}}>PREMİUM</div>
                <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                  <div style={{width:'52px',height:'52px',borderRadius:'14px',background:'rgba(124,77,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Award size={24} color="#7c4dff"/></div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'17px',fontWeight:'700',color:'var(--foreground)'}}>Profesyonel Destek Al</div>
                    <div style={{fontSize:'13px',color:'var(--text-muted)',marginTop:'4px',lineHeight:'1.5'}}>Bizzat ustaya gider, foruma düşmez. Alım-satım, arıza veya kaza desteği.</div>
                  </div>
                  <ChevronRight size={20} color="var(--text-muted)"/>
                </div>
              </div>
            </div>
          )}
          {/* MODE: FORUM - Simple form */}
          {mode==='forum' && (
            <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
              <div>
                <label style={S.label}>Kategori</label>
                <select value={forumQ.subCategory} onChange={e=>setForumQ({...forumQ,subCategory:e.target.value})} style={{...S.input,cursor:'pointer'}}>
                  {['Motor','Sanzıman','Lastik','Bakım','Elektrik','Fren','Süspansiyon','Diğer'].map(c=>(<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label style={S.label}>Başlık <span style={{color:'#ef4444'}}>*</span></label>
                <input type="text" value={forumQ.title} onChange={e=>setForumQ({...forumQ,title:e.target.value})} placeholder="Sorunuzun başlığını yazın..." style={S.input}/>
              </div>
              <div>
                <label style={S.label}>Detaylı Açıklama <span style={{color:'#ef4444'}}>*</span></label>
                <textarea value={forumQ.content} onChange={e=>setForumQ({...forumQ,content:e.target.value})} placeholder="Sorununuzu detaylı anlatınız..." rows={5} style={{...S.input,resize:'none' as const}}/>
              </div>
              <div style={{display:'flex',gap:'12px'}}>
                <button onClick={()=>setMode('choose')} style={{...S.btnSec,flex:1}}>Geri</button>
                <button disabled={!forumQ.title.trim()||!forumQ.content.trim()} onClick={()=>{onSubmitFree({title:forumQ.title.trim(),content:forumQ.content.trim(),subCategory:forumQ.subCategory});reset();onClose();}} style={S.btn(!!forumQ.title.trim()&&!!forumQ.content.trim())}>
                  <Sparkles size={16}/> Soruyu Gönder
                </button>
              </div>
            </div>
          )}
          {/* MODE: PRO - STEP 1 */}
          {mode==='pro' && step===1 && (
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <p style={{fontSize:'14px',color:'var(--text-muted)',margin:'0 0 8px'}}>Hangi konuda destek almak istiyorsun?</p>
              {FLOWS.map(f=>{const Icon=f.icon;return(
                <div key={f.key} style={S.card(flow===f.key,f.color)} onClick={()=>setFlow(f.key)}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <div style={{flex:1}}>
                      <span style={{padding:'3px 10px',borderRadius:'8px',fontSize:'10px',fontWeight:'700',background:`${f.color}18`,color:f.color}}>{f.badge}</span>
                      <h3 style={{fontSize:'17px',fontWeight:'700',color:'var(--foreground)',margin:'10px 0 4px'}}>{f.title}</h3>
                      <p style={{fontSize:'13px',color:'var(--text-muted)',margin:0}}>{f.desc}</p>
                    </div>
                    <div style={{width:'44px',height:'44px',borderRadius:'12px',background:`${f.color}12`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginLeft:'12px'}}>
                      <Icon size={22} color={f.color}/>
                    </div>
                  </div>
                  <div style={{marginTop:'12px',display:'flex',flexDirection:'column',gap:'4px'}}>
                    {f.features.map(ft=>(
                      <div key={ft} style={{display:'flex',alignItems:'center',gap:'6px'}}>
                        <CheckCircle size={13} color={f.color}/>
                        <span style={{fontSize:'12px',color:'var(--text-muted)'}}>{ft}</span>
                      </div>
                    ))}
                  </div>
                  {flow===f.key && <div style={{marginTop:'10px',textAlign:'right'}}><span style={{padding:'4px 12px',borderRadius:'8px',fontSize:'11px',fontWeight:'700',background:`${f.color}18`,color:f.color}}>✓ Seçildi</span></div>}
                </div>
              )})}
            </div>
          )}
          {/* PRO STEP 2 - BUYSELL */}
          {mode==='pro' && step===2 && flow==="buysell" && (
            <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
              <div>
                <label style={S.label}>Rolünü Seç</label>
                <p style={{fontSize:'12px',color:'var(--text-muted)',margin:'0 0 10px'}}>Rolüne göre usta dili uyarlanır</p>
                <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                  {BUYSELL_ROLES.map(r=>{const Icon=r.icon;return(
                    <div key={r.key} style={S.roleCard(bsRole===r.key,r.color)} onClick={()=>setBsRole(r.key)}>
                      <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                        <div style={{width:'36px',height:'36px',borderRadius:'10px',background:`${r.color}15`,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={18} color={r.color}/></div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:'14px',fontWeight:'700',color:'var(--foreground)'}}>{r.title}</div>
                          <div style={{fontSize:'12px',color:'var(--text-muted)'}}>{r.desc}</div>
                        </div>
                        {bsRole===r.key && <CheckCircle size={20} color={r.color}/>}
                      </div>
                    </div>
                  )})}
                </div>
              </div>
              <div>
                <label style={S.label}>İlan Linkleri <span style={{color:'#ef4444'}}>*</span></label>
                <p style={{fontSize:'12px',color:'var(--text-muted)',margin:'0 0 10px'}}>En az 1, en fazla 5 ilan linki</p>
                {links.map((l,i)=>(
                  <div key={i} style={{display:'flex',gap:'8px',marginBottom:'8px'}}>
                    <div style={{position:'relative',flex:1}}>
                      <LinkIcon size={14} style={{position:'absolute',left:'12px',top:'14px',color:'var(--text-muted)'}}/>
                      <input value={l} onChange={e=>{const n=[...links];n[i]=e.target.value;setLinks(n);}} placeholder={`İlan linki ${i+1}`} style={{...S.input,paddingLeft:'34px'}}/>
                    </div>
                    {links.length>1 && <button onClick={()=>setLinks(links.filter((_,j)=>j!==i))} style={{...S.btnSec,padding:'10px',flex:'none'}}><Trash2 size={16}/></button>}
                  </div>
                ))}
                {links.length<5 && <button onClick={()=>setLinks([...links,""])} style={{...S.btnSec,width:'100%',marginTop:'4px'}}><Plus size={16}/> Link Ekle ({links.length}/5)</button>}
              </div>
              <div>
                <label style={S.label}>Notlar (opsiyonel)</label>
                <textarea value={bsNotes} onChange={e=>setBsNotes(e.target.value)} placeholder="Mekanik mi kozmetik mi daha önemli? Özel dikkat edilecek bir şey var mı?" rows={3} style={{...S.input,resize:'none' as const}}/>
              </div>
            </div>
          )}
          {/* PRO STEP 2 - FAULT */}
          {mode==='pro' && step===2 && flow==="fault" && (
            <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
              <div>
                <label style={S.label}>Konu <span style={{color:'#ef4444'}}>*</span></label>
                <p style={{fontSize:'12px',color:'var(--text-muted)',margin:'0 0 8px'}}>Tek cümlede arızayı özetle</p>
                <input value={fSubject} onChange={e=>setFSubject(e.target.value)} placeholder="Örn: Rölantide titreme ve sarsıntı" style={S.input}/>
              </div>
              <div>
                <label style={S.label}>Sorun Detayı <span style={{color:'#ef4444'}}>*</span></label>
                <p style={{fontSize:'12px',color:'var(--text-muted)',margin:'0 0 8px'}}>Ne kadar net yazarsan, ustanın tahmini o kadar isabetli olur</p>
                <textarea value={fDetail} onChange={e=>setFDetail(e.target.value)} placeholder={"• Ne zaman başlıyor/bitiyor?\n• Hangi hız/devir aralığında?\n• Uyarı ışığı var mı?\n• Son bakım ne zaman?"} rows={6} style={{...S.input,resize:'none' as const}}/>
              </div>
              <div style={{padding:'16px',background:'var(--secondary)',borderRadius:'12px',border:'1px solid var(--card-border)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                  <FileText size={16} color="var(--primary)"/>
                  <span style={{fontSize:'13px',fontWeight:'700',color:'var(--foreground)'}}>Ustanın Cevap Şablonu</span>
                </div>
                {['Ön değerlendirme ve muhtemel nedenler','Kontrol planı (OBD, basınç vb.)','Parça/işçilik tahmini','Riskler ve önerilen yol haritası'].map(t=>(
                  <div key={t} style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'4px'}}>
                    <CheckCircle size={12} color="var(--primary)"/>
                    <span style={{fontSize:'12px',color:'var(--text-muted)'}}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* PRO STEP 2 - ACCIDENT */}
          {mode==='pro' && step===2 && flow==="accident" && (
            <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
              <div>
                <label style={S.label}>Rolünü Seç</label>
                <p style={{fontSize:'12px',color:'var(--text-muted)',margin:'0 0 10px'}}>Seçtiğin role göre uzman perspektifi değişir</p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                  {ACC_ROLES.map(r=>{const Icon=r.icon;return(
                    <div key={r.key} style={{...S.roleCard(accRole===r.key,r.color),padding:'12px'}} onClick={()=>setAccRole(r.key)}>
                      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                        <Icon size={18} color={r.color}/>
                        <div>
                          <div style={{fontSize:'13px',fontWeight:'700',color:'var(--foreground)'}}>{r.title}</div>
                          <div style={{fontSize:'11px',color:'var(--text-muted)'}}>{r.desc}</div>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              </div>
              <div>
                <label style={S.label}>Kaza Özeti <span style={{color:'#ef4444'}}>*</span></label>
                <textarea value={accSummary} onChange={e=>setAccSummary(e.target.value)} placeholder="Hızım ~50 km/h, sağ şeritte ilerlerken sol şeritten araç aniden önüme kırdı..." rows={4} style={{...S.input,resize:'none' as const}}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                <div>
                  <label style={S.label}><MapPin size={12} style={{display:'inline'}}/> Konum</label>
                  <input value={accLocation} onChange={e=>setAccLocation(e.target.value)} placeholder="İzmir / Bornova" style={S.input}/>
                </div>
                <div>
                  <label style={S.label}><Car size={12} style={{display:'inline'}}/> Karşı Plaka</label>
                  <input value={accPlate} onChange={e=>setAccPlate(e.target.value.toUpperCase())} placeholder="35 ABC 123" style={S.input}/>
                </div>
              </div>
              <div style={{...S.roleCard(accTow,'#3b82f6'),display:'flex',justifyContent:'space-between',alignItems:'center'}} onClick={()=>setAccTow(!accTow)}>
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <Truck size={18} color={accTow?'#3b82f6':'var(--text-muted)'}/>
                  <span style={{fontSize:'14px',fontWeight:accTow?'600':'400',color:'var(--foreground)'}}>Çekiciye ihtiyacım var</span>
                </div>
                <div style={{width:'40px',height:'22px',borderRadius:'11px',background:accTow?'#3b82f6':'var(--card-border)',position:'relative',transition:'all 0.2s'}}>
                  <div style={{width:'18px',height:'18px',borderRadius:'50%',background:'white',position:'absolute',top:'2px',left:accTow?'20px':'2px',transition:'all 0.2s'}}/>
                </div>
              </div>
              <div>
                <label style={S.label}>Notlar (opsiyonel)</label>
                <textarea value={accNotes} onChange={e=>setAccNotes(e.target.value)} placeholder="Kusur oranı tahmini, dikkat edilecek noktalar..." rows={3} style={{...S.input,resize:'none' as const}}/>
              </div>
            </div>
          )}
          {/* PRO STEP 3 */}
          {mode==='pro' && step===3 && (
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <p style={{fontSize:'14px',color:'var(--text-muted)',margin:0}}>Sorunuzu nasıl göndermek istersiniz?</p>
              <div style={{...S.roleCard(false,'#22c55e'),padding:'20px'}} onClick={handleFree}>
                <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                  <div style={{width:'48px',height:'48px',borderRadius:'14px',background:'rgba(34,197,94,0.12)',display:'flex',alignItems:'center',justifyContent:'center'}}><Send size={22} color="#22c55e"/></div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'16px',fontWeight:'700',color:'var(--foreground)'}}>Foruma Gönder (Ücretsiz)</div>
                    <div style={{fontSize:'13px',color:'var(--text-muted)',marginTop:'4px'}}>Topluluk ve gönüllü uzmanlar yanıtlar</div>
                  </div>
                  <ChevronRight size={20} color="var(--text-muted)"/>
                </div>
              </div>
              <div style={{...S.roleCard(false,'#7c4dff'),padding:'20px',position:'relative'}} onClick={()=>setShowDevMsg(true)}>
                <div style={{position:'absolute',top:'10px',right:'10px',padding:'3px 10px',borderRadius:'8px',fontSize:'10px',fontWeight:'700',background:'linear-gradient(135deg,#7c4dff,#ff6b00)',color:'white'}}>PREMİUM</div>
                <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                  <div style={{width:'48px',height:'48px',borderRadius:'14px',background:'rgba(124,77,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center'}}><Sparkles size={22} color="#7c4dff"/></div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'16px',fontWeight:'700',color:'var(--foreground)'}}>Uzmana Gönder (Premium)</div>
                    <div style={{fontSize:'13px',color:'var(--text-muted)',marginTop:'4px'}}>Bizzat ustaya gider, foruma düşmez</div>
                  </div>
                  <ChevronRight size={20} color="var(--text-muted)"/>
                </div>
              </div>
              {showDevMsg && (
                <div style={{padding:'16px',background:'rgba(124,77,255,0.08)',border:'1px solid rgba(124,77,255,0.25)',borderRadius:'12px',display:'flex',alignItems:'center',gap:'12px'}}>
                  <AlertTriangle size={20} color="#7c4dff"/>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:'700',color:'var(--foreground)'}}>🚧 Geliştirme Aşamasında</div>
                    <div style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'2px'}}>Premium uzmana sor özelliği yakında aktif olacak.</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Footer */}
        {mode==='pro' && step<3 && (
          <div style={S.footer}>
            <button onClick={()=>{if(step===1){setMode('choose');}else setStep(step-1);}} style={S.btnSec}>{step===1?'Geri':'Geri'}</button>
            <button disabled={step===1?!flow:!canStep2()} onClick={()=>setStep(step+1)} style={S.btn(step===1?!!flow:!!canStep2())}>
              Devam Et <ChevronRight size={16}/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
