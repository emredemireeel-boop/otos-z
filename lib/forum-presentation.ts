import type { Timestamp } from 'firebase/firestore';
import type { ForumThread } from './forumService';
import {createSeoSlug} from './slug';

// Presentation-only timestamp: never pass this object to a Firestore write.
export function displayTimestamp(value:number):Timestamp {
    return {toMillis:()=>value,toDate:()=>new Date(value)} as Timestamp;
}
export function getThreadSlugUrl(thread:Pick<ForumThread,'id'|'title'|'urlId'>):string {
    return thread.urlId?`/forum/${createSeoSlug(thread.title)}--${thread.urlId}`:`/forum/${thread.id}`;
}
export function formatTimestamp(timestamp:Pick<Timestamp,'toDate'>|null):string {
    if(!timestamp)return 'az once';
    const diff=Date.now()-timestamp.toDate().getTime(),minutes=Math.floor(diff/60000),hours=Math.floor(diff/3600000),days=Math.floor(diff/86400000);
    if(minutes<1)return 'az once';
    if(minutes<60)return `${minutes} dakika once`;
    if(hours<24)return `${hours} saat once`;
    if(days<7)return `${days} gun once`;
    if(days<30)return `${Math.floor(days/7)} hafta once`;
    return timestamp.toDate().toLocaleDateString('tr-TR');
}
