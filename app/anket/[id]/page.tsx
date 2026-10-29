import {notFound} from 'next/navigation';
import {getPublicContentDocument,isHiddenContent} from '@/lib/public-content-server';
import SurveyDetailClient from './SurveyDetailClient';
export default async function Page({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const record=await getPublicContentDocument('surveys',id);
 if(!record||isHiddenContent(record.data))notFound();
 const source=record.data;
 const initialSurvey={id,title:String(source.title||''),description:String(source.description||''),category:String(source.category||''),totalVotes:Number(source.totalVotes||0),nominees:(source.nominees||[]) as {id:number;name:string;votes:number}[],voters:(source.voters||{}) as Record<string,number>};
 return <SurveyDetailClient surveyId={id} initialSurvey={initialSurvey}/>;
}
