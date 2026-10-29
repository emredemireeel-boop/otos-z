'use client';
import {useState} from 'react';
import dynamic from 'next/dynamic';
const SubmissionModal=dynamic(()=>import('./EventSubmissionModal'),{ssr:false});
const EventForm=dynamic(()=>import('@/app/etkinlikler/EventFormClient'),{ssr:false});
export default function EventActionsClient({children,eventId,eventTitle,cities=[],categories={}}:{children:React.ReactNode;eventId?:string;eventTitle?:string;cities?:string[];categories?:Record<string,any>}){
    const [tab,setTab]=useState<'NEW_EVENT'|'UPDATE_EVENT'>('NEW_EVENT'),[open,setOpen]=useState(false),[version,setVersion]=useState(0);
    return <div onClick={event=>{const target=(event.target as Element).closest<HTMLElement>('[data-event-add],[data-event-submit]');if(!target)return;setTab(target.dataset.eventSubmit==='UPDATE_EVENT'?'UPDATE_EVENT':'NEW_EVENT');setVersion(value=>value+1);setOpen(true);}}>
        {children}
        {open && (eventId?<SubmissionModal key={version} isOpen onClose={()=>setOpen(false)} initialTab={tab} existingEventId={eventId} existingEventTitle={eventTitle}/>:<EventForm key={version} onClose={()=>setOpen(false)} cities={cities} eventCategories={categories}/>)}
    </div>;
}
