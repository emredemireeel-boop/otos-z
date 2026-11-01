import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import {runPublicFirestoreQuery} from '@/lib/forumPublicServer';
import AnketClient from './AnketClient';
import {curatedSurveys} from '@/data/curated-surveys';
import {vehicleDNAData} from '@/data/vehicle-dna';
import {isVehicleIndexable} from '@/lib/indexability';
export default async function Page(){
 const curated=curatedSurveys.map(survey=>({...survey,source:'curated' as const,voters:{}}));
 let community:any[]=[];
 try{const documents=await runPublicFirestoreQuery({collectionId:'surveys',limit:200,orderBy:{field:'createdAt',direction:'DESCENDING'}});const titles=new Set(curated.map(survey=>survey.title.toLocaleLowerCase('tr')));
 community=documents.filter(record=>record.data.status==='active'&&typeof record.data.title==='string'&&Array.isArray(record.data.nominees)&&!titles.has(record.data.title.toLocaleLowerCase('tr')))
 .map(({id,data})=>({id,title:data.title,description:String(data.description||''),category:String(data.category||'Genel'),status:data.status,totalVotes:Number(data.totalVotes||0),nominees:data.nominees,voters:{},source:'firestore'}));
 }catch{console.warn('Anket hub: community snapshot unavailable; existing editorial surveys remain visible.');}
 const initialSurveys=[...curated,...community];
 const textSlots=Object.fromEntries(initialSurveys.map(survey=>[survey.id,{title:<>{survey.title}</>,description:<>{survey.description}</>,nominees:Object.fromEntries(survey.nominees.map((nominee:{id:number;name:string})=>[nominee.id,<>{nominee.name}</>]))}]));
 const featuredVehicles=vehicleDNAData.filter(isVehicleIndexable).slice(0,3).map(({id,brand,model,dnaScore,chronicIssues,totalReports})=>({id,brand,model,dnaScore,chronicCount:chronicIssues.length,totalReports}));
 return <AnketClient breadcrumbs={<PageBreadcrumbs url={'/anket'}/>} initialSurveys={initialSurveys} curatedSurveys={curated} textSlots={textSlots} featuredVehicles={featuredVehicles}/>;
}

export const revalidate=900;
