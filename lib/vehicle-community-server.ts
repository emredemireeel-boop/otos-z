import 'server-only';
import {getPublicFirestoreDocument} from './forumPublicServer';
import type {DNAChronicIssue} from './dnaService';
export async function getVehicleCommunity(brand:string,model:string){
    try{
        // Uses the same public Firestore rules as the former anonymous client read.
        const document=await getPublicFirestoreDocument('vehicle_chronic_issues',`${brand}_${model}`);
        const data=document?.data;
        const issues:Array<DNAChronicIssue>=Array.isArray(data?.chronicIssues)?data.chronicIssues.filter((issue:DNAChronicIssue)=>issue&&typeof issue.id==='string'&&typeof issue.text==='string').slice(0,10):[];
        const votes:Record<string,string[]>=Object.fromEntries(Object.entries(data?.staticIssueVotes||{}).filter(([,value])=>Array.isArray(value)).map(([id,value])=>[id,(value as unknown[]).filter((v):v is string=>typeof v==='string')]));
        return {issues,votes};
    }catch(error){console.warn('Araç topluluk verisi sunucuda okunamadı:',error);return {issues:[],votes:{}};}
}
