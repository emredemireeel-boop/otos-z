'use client';
import {useState,useEffect} from 'react';
import {Clock} from 'lucide-react';
export default function EventCountdownClient({date}:{date:string}){
const[timeLeft,setTimeLeft]=useState<{d:number;h:number;m:number;s:number}|null>(null);
useEffect(()=>{function update(){const diff=new Date(date).getTime()-Date.now();setTimeLeft(diff>0?{d:Math.floor(diff/86400000),h:Math.floor(diff/3600000)%24,m:Math.floor(diff/60000)%60,s:Math.floor(diff/1000)%60}:null);}update();const timer=setInterval(update,1000);return()=>clearInterval(timer);},[date]);
return timeLeft?(
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        left: '20px',
                                        display: 'flex',
                                        gap: '8px'
                                    }}>
                                        <div style={{
                                            background: 'rgba(255, 107, 0, 0.9)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '12px',
                                            padding: '12px 20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            boxShadow: '0 10px 25px -5px rgba(255, 107, 0, 0.4)'
                                        }}>
                                            <Clock style={{ width: '20px', height: '20px', color: 'white' }} />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '18px', fontWeight: '800', color: 'white', lineHeight: '1' }}>{timeLeft.d}</span>
                                                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>GÜN</span>
                                                </div>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', fontWeight: '800' }}>:</span>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '18px', fontWeight: '800', color: 'white', lineHeight: '1' }}>{String(timeLeft.h).padStart(2, '0')}</span>
                                                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>SAAT</span>
                                                </div>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', fontWeight: '800' }}>:</span>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '18px', fontWeight: '800', color: 'white', lineHeight: '1' }}>{String(timeLeft.m).padStart(2, '0')}</span>
                                                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>DAK</span>
                                                </div>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', fontWeight: '800' }}>:</span>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '18px', fontWeight: '800', color: 'white', lineHeight: '1' }}>{String(timeLeft.s).padStart(2, '0')}</span>
                                                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>SAN</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ):null;
}
