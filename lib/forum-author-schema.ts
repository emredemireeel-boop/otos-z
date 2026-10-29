import 'server-only';
import {unstable_cache} from 'next/cache';
import {getAdminDb,initError} from './firebaseAdmin';
import {runPublicFirestoreQuery} from './forumPublicServer';
// The public profile route resolves usernames, not internal document IDs.
export const verifiedForumAuthorUrl=unstable_cache(async (username:string):Promise<string|undefined>=>{
 if(!username||username.length>80||username==='OtoSöz üyesi')return undefined;
 try{
  if(!initError){const result=await getAdminDb().collection('users').where('username','==',username).limit(1).get();if(!result.empty)return 'https://otosoz.com/profil/'+encodeURIComponent(username);return undefined;}
  const result=await runPublicFirestoreQuery({collectionId:'users',limit:1,where:{field:'username',value:username}});
  return result.length?'https://otosoz.com/profil/'+encodeURIComponent(username):undefined;
 }catch{return undefined;}
},['schema-public-profile-existence-v1'],{revalidate:900});
