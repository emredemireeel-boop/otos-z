"use client";
import {useState,useRef,useEffect,useContext,createContext} from 'react';
import {Search} from 'lucide-react';
const FilterContext=createContext<{searchQuery:string;setSearchQuery:(value:string)=>void;sortBy:'score'|'name';setSortBy:(value:'score'|'name')=>void}|null>(null);
export function BrandFilterClient({children}:{children:React.ReactNode}){
 const [searchQuery,setSearchQuery]=useState(''),[sortBy,setSortBy]=useState<'score'|'name'>('score');const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{const cards=[...root.current!.querySelectorAll<HTMLElement>('[data-model-card]')];cards.sort((a,b)=>sortBy==='score'?Number(b.dataset.score)-Number(a.dataset.score):(a.dataset.name||'').localeCompare(b.dataset.name||'','tr'));cards.forEach((card,index)=>{card.hidden=!(card.dataset.name||'').toLocaleLowerCase('tr').includes(searchQuery.toLocaleLowerCase('tr'));if(!card.dataset.originalDisplaySaved){card.dataset.originalDisplay=card.style.display;card.dataset.originalDisplaySaved='true';}card.style.display=card.hidden?'none':(card.dataset.originalDisplay||'');card.style.order=String(index);});const empty=root.current!.querySelector<HTMLElement>('[data-empty-models]');if(empty)empty.hidden=cards.some(card=>!card.hidden);},[searchQuery,sortBy]);
 return <FilterContext.Provider value={{searchQuery,setSearchQuery,sortBy,setSortBy}}><div ref={root}>{children}</div></FilterContext.Provider>;
}
export function BrandFilterControls({brandName}:{brandName:string}){const {searchQuery,setSearchQuery,sortBy,setSortBy}=useContext(FilterContext)!;return (                    <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                        <div style={{
                            flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8,
                            background: "var(--card-bg)", border: "1px solid var(--card-border)",
                            borderRadius: 12, padding: "0 14px",
                        }}>
                            <Search size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder={`${brandName} model ara...`}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                    flex: 1, padding: "12px 0", background: "transparent",
                                    border: "none", color: "var(--foreground)", fontSize: 15, outline: "none",
                                }}
                            />
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                            {(["score", "name"] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSortBy(s)}
                                    style={{
                                        padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                                        border: sortBy === s ? "1.5px solid var(--primary)" : "1px solid var(--card-border)",
                                        background: sortBy === s ? "var(--primary)" : "var(--card-bg)",
                                        color: sortBy === s ? "white" : "var(--text-muted)",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {s === "score" ? "Puana Göre" : "İsme Göre"}
                                </button>
                            ))}
                        </div>
                    </div>

);}
