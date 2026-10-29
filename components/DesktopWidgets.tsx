"use client";
import {useEffect,useState} from 'react';
// These optional widgets are hidden by CSS on mobile. Avoid hydrating their
// trees and starting their requests on a viewport where they cannot be used.
export default function DesktopWidgets({minWidth,children}:{minWidth:number;children:React.ReactNode}){
    const [visible,setVisible]=useState(false);
    useEffect(()=>{
        const media=window.matchMedia(`(min-width: ${minWidth}px)`);
        const update=()=>setVisible(media.matches);update();media.addEventListener('change',update);
        return()=>media.removeEventListener('change',update);
    },[minWidth]);
    return visible?children:null;
}
