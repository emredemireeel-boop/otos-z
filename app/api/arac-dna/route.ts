import { NextRequest, NextResponse } from 'next/server';
import { vehicleDNAData } from '@/data/vehicle-dna';
import { engineDNAData } from '@/data/engine-dna';
import { trimLevelsData } from '@/data/trim-levels';

// Only explicitly selected records are transferred; never the complete catalogues.
export function GET(request: NextRequest) {
    const ids=(request.nextUrl.searchParams.get('ids') || '').split(',');
    if(ids.length>3 || ids.some(id=>!/^\d+$/.test(id))) return NextResponse.json({error:'Geçersiz araç seçimi'},{status:400});
    const records=ids.map(id=>vehicleDNAData.find(vehicle=>vehicle.id===Number(id)));
    if(records.some(record=>!record)) return NextResponse.json({error:'Araç bulunamadı'},{status:404});
    return NextResponse.json({records:records.map(vehicle=>({vehicle,
        engines:engineDNAData.find(record=>record.vehicleId===vehicle!.id)?.engines || [],
        trims:trimLevelsData.find(record=>record.vehicleId===vehicle!.id) || null}))},
        {headers:{'Cache-Control':'public, max-age=900','X-Robots-Tag':'noindex, follow'}});
}
