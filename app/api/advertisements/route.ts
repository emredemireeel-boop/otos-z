import {NextRequest,NextResponse} from 'next/server';
import {getAdminDb} from '@/lib/firebaseAdmin';

// Public creatives only. Billing/contact/admin fields never leave the server.
export async function GET(request:NextRequest){
    const position=request.nextUrl.searchParams.get('position') || 'general';
    if(!/^[a-z0-9_-]{1,50}$/i.test(position))return NextResponse.json({ads:[]},{status:400});
    try{
        const snapshot=await getAdminDb().collection('advertisements').where('status','==','active').where('position','==',position).get();
        const ads=snapshot.docs.map(document=>{
            const data=document.data();
            return {id:document.id,title:String(data.title||''),description:String(data.description||''),url:String(data.url||''),
                imageUrl:typeof data.imageUrl==='string'?data.imageUrl:undefined,advertiser:String(data.advertiser||''),
                createdAt:typeof data.createdAt?.toMillis==='function'?data.createdAt.toMillis():typeof data.createdAt==='number'?data.createdAt:0};
        }).sort((a,b)=>b.createdAt-a.createdAt).slice(0,10);
        return NextResponse.json({ads},{headers:{'Cache-Control':'public, max-age=120, s-maxage=300','X-Robots-Tag':'noindex, follow'}});
    }catch{
        return NextResponse.json({ads:[],unavailable:true},{status:503,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, follow'}});
    }
}
