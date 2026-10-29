import {NextRequest,NextResponse} from 'next/server';
import carModels from '@/data/carmodels.json';
export function GET(request:NextRequest){
    const brand=request.nextUrl.searchParams.get('brand');
    const data=carModels as Record<string,string[]>;
    const headers={'Cache-Control':'public, max-age=3600','X-Robots-Tag':'noindex, follow'};
    if(request.nextUrl.searchParams.get('all')==='1') return NextResponse.json(data,{headers});
    if(!brand)return NextResponse.json({brands:Object.keys(data).sort()},{headers});
    if(!Object.hasOwn(data,brand))return NextResponse.json({models:[]},{status:404,headers});
    return NextResponse.json({models:[...data[brand]].sort()},{headers});
}
