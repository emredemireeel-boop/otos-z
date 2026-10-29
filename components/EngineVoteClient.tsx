'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function EngineVoteClient({brandSlug,modelSlug,issueId}:{brandSlug:string;modelSlug:string;issueId:string}) {
    const {user}=useAuth();
    const [login,setLogin]=useState(false);
    const [voted,setVoted]=useState(false);
    const [pending,setPending]=useState(false);
    const [error,setError]=useState('');
    async function vote() {
        if(!user){setLogin(true);return;}
        setPending(true);setError('');
        try {
            const service=await import('@/lib/dnaService');
            const result=await service.toggleVehicleStaticVote(brandSlug,modelSlug,issueId,String(user.id));
            if(result) { const votes=await service.getVehicleStaticVotes(brandSlug,modelSlug);setVoted(Boolean(votes[issueId]?.includes(String(user.id)))); }
        } catch {setError('Oy kaydedilemedi.');} finally {setPending(false);}
    }
    return <div><button onClick={vote} disabled={pending} style={{padding:'6px 12px',borderRadius:8,background:'var(--card-bg)',border:'1px solid var(--card-border)',color:'var(--foreground)',fontSize:13,cursor:'pointer'}}>{voted?'Yaşadınız':'Ben de yaşadım'}</button>{login&&<p><Link href="/giris">Giriş Yapmanız Gerekiyor</Link></p>}{error&&<p role="alert">{error}</p>}</div>;
}
