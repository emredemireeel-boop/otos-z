import {notFound} from 'next/navigation';
import {getSampleComparison} from '@/data/showcase-content';
import {getForumThreadSeo} from '@/lib/forumDataServer';
import ComparisonDetailClient from './ComparisonDetailClient';
export default async function Page({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const sample=getSampleComparison(id)||null;
 const thread=sample?null:await getForumThreadSeo(id);if(!sample&&!thread)notFound();
 return <ComparisonDetailClient threadId={id} sampleComparison={sample} serverThread={thread?{...thread,authorId:'',tags:[]}:undefined} serverEntries={thread?.entries.map(entry=>({...entry,authorId:'',likedBy:[]}))}/>;
}
