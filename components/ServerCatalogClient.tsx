'use client';
import {useEffect,useRef,useState} from 'react';

// Receives rendered cards/rows. State contains only filter values, never the catalogue.
export default function ServerCatalogClient({children,initialPanel='',initialFilter='Tümü',initialSort=''}:{children:React.ReactNode;initialPanel?:string;initialFilter?:string;initialSort?:string}){
    const root=useRef<HTMLDivElement>(null);
    const [panel,setPanel]=useState(initialPanel),[filter,setFilter]=useState(initialFilter),[query,setQuery]=useState(''),[sort,setSort]=useState(initialSort),[city,setCity]=useState('Tümü');
    useEffect(()=>{
        const element=root.current!;
        element.querySelectorAll<HTMLElement>('[data-catalog-panel]').forEach(item=>{item.hidden=Boolean(panel && item.dataset.catalogPanel!==panel);});
        const rows=[...element.querySelectorAll<HTMLElement>('[data-catalog-row]')];
        if(sort)rows.sort((a,b)=>Number(b.dataset[sort]||0)-Number(a.dataset[sort]||0));
        rows.forEach((item,index)=>{
            const matchesText=(item.dataset.filterText||item.textContent||'').toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'));
            const groups=(item.dataset.catalogGroup||'').split('|');
            item.hidden=(city!=='Tümü' && item.dataset.catalogCity!==city) || !matchesText || (filter!=='Tümü' && filter!=='all' && !groups.includes(filter));
            if(!item.dataset.catalogDisplaySaved){item.dataset.catalogOriginalDisplay=item.style.display;item.dataset.catalogDisplaySaved='true';}
            item.style.display=item.hidden?'none':(item.dataset.catalogOriginalDisplay||'');
            if(sort)item.style.order=String(index);
        });
        const visibleCount=rows.filter(item=>!item.hidden).length;
        element.querySelectorAll<HTMLElement>('[data-catalog-count]').forEach(item=>{item.textContent=String(visibleCount);});
        element.querySelectorAll<HTMLElement>('[data-catalog-empty]').forEach(item=>{item.hidden=visibleCount>0;});
        element.querySelectorAll<HTMLElement>('[data-catalog-target],[data-catalog-filter],[data-catalog-sort],[data-catalog-city-target]').forEach(button=>{
            const active=button.dataset.catalogTarget?button.dataset.catalogTarget===panel:button.dataset.catalogFilter?button.dataset.catalogFilter===filter:button.dataset.catalogCityTarget?button.dataset.catalogCityTarget===city:button.dataset.catalogSort===sort;
            button.setAttribute('aria-pressed',String(active));
        });
    },[panel,filter,query,sort,city]);
    return <div ref={root} onInput={event=>{const target=event.target as HTMLInputElement;if(target.matches('[data-catalog-search]'))setQuery(target.value);}}
        onClick={event=>{const target=(event.target as Element).closest<HTMLElement>('[data-catalog-target],[data-catalog-filter],[data-catalog-sort],[data-catalog-city-target]');if(!target)return;
            if(target.dataset.catalogTarget)setPanel(target.dataset.catalogTarget);
            if(target.dataset.catalogFilter)setFilter(target.dataset.catalogFilter);
            if(target.dataset.catalogSort)setSort(target.dataset.catalogSort);
            if(target.dataset.catalogCityTarget)setCity(target.dataset.catalogCityTarget);
        }}>{children}</div>;
}
