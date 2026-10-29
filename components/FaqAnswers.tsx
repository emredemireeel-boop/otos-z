import 'server-only';
export default function FaqAnswers({items}:{items:{soru:string;cevap:string}[]}){
 return <div style={{display:'flex',flexDirection:'column',gap:8}}>{items.map((item,index)=><details key={item.soru} name="traffic-faq" open={index===0} style={{border:'1px solid var(--card-border)',borderRadius:12,padding:'16px 20px',background:'var(--card-bg)'}}><summary style={{cursor:'pointer',fontWeight:600,color:'var(--foreground)',lineHeight:1.5}}>{item.soru}</summary><p style={{color:'var(--text-muted)',fontSize:14,lineHeight:1.8,margin:'12px 0 0'}}>{item.cevap}</p></details>)}</div>;
}
