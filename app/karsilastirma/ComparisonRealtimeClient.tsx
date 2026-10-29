'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import type {ForumThread} from '@/lib/forumService';

export default function ComparisonRealtimeClient({initialIds}:{initialIds:string[]}){
    const [threads,setThreads]=useState<ForumThread[]>([]);
    useEffect(()=>{let stopped=false,unsubscribe=()=>{};void import('@/lib/forumService').then(service=>{
        if(stopped)return;unsubscribe=service.subscribeToThreads(records=>setThreads(records.filter(thread=>thread.category==='Karsilastirma'&&!initialIds.includes(thread.id))),200);
    });return()=>{stopped=true;unsubscribe();};},[initialIds]);
    return <>{threads.map(thread=><article key={thread.id} data-catalog-row data-filter-text={thread.title} data-catalog-group={`${thread.tags.filter(tag=>tag.startsWith('arac:')).length} Araç`} style={{padding:24,border:'1px solid var(--card-border)',borderRadius:16,background:'var(--card-bg)'}}><h3><Link href={`/karsilastirma/${thread.id}`}>{thread.title}</Link></h3><p>{thread.description}</p></article>)}</>;
}
