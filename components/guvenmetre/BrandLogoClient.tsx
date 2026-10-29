'use client';
import {useState} from 'react';
export default function BrandLogoClient({src,name,emoji}:{src:string;name:string;emoji:string}){
    const [failed,setFailed]=useState(false);
    return failed?<span>{emoji}</span>:<img src={src} alt={name} onError={()=>setFailed(true)} style={{width:'100%',height:'100%',objectFit:'contain',background:'white',padding:10}}/>;
}
