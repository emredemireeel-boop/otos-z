'use client';
import {useEffect,useState} from 'react';
import {ArrowUp} from 'lucide-react';

export default function LegalScrollClient(){
    const [visible,setVisible]=useState(false);
    useEffect(()=>{
        function update(){
            setVisible(window.scrollY>400);
            let current='';
            document.querySelectorAll<HTMLElement>('[data-section]').forEach(section=>{
                if(section.offsetTop-200<=window.scrollY) current=section.dataset.section || '';
            });
            document.querySelectorAll<HTMLAnchorElement>('.toc-item').forEach(link=>{
                link.classList.toggle('active',link.getAttribute('href')===`#${current}`);
            });
        }
        window.addEventListener('scroll',update,{passive:true});update();
        return()=>window.removeEventListener('scroll',update);
    },[]);
    return visible?<button className="back-to-top" aria-label="Başa dön" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}><ArrowUp size={20}/></button>:null;
}
