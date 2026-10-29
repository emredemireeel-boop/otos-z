"use client";
import {useEffect,useState} from 'react';
import dynamic from 'next/dynamic';
const AdRails=dynamic(()=>import('./GlobalAdRails'),{ssr:false});
export default function AdRailsGate(){
    const [visible,setVisible]=useState(false);
    useEffect(()=>{
        const query=window.matchMedia('(min-width: 1700px) and (min-height: 640px)');
        const update=()=>setVisible(query.matches);update();query.addEventListener('change',update);
        return()=>query.removeEventListener('change',update);
    },[]);
    return visible?<AdRails/>:null;
}
