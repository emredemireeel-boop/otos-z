import { NextRequest, NextResponse } from 'next/server';
import obdCodes from '@/data/obd-codes.json';

interface ObdCode {
    code: string;
    title: string;
    description: string;
    type: string;
    isGeneric: boolean;
    severity: string;
    systems: string[];
    symptoms: string[];
    causes: string[];
    fixes: string[];
}

/**
 * OBD kodlarını sayfalanmış (paginated) olarak döndürür.
 * Query params:
 *   q       — arama sorgusu (kod, başlık veya açıklamada aranır)
 *   type    — P, B, C, U filtresi
 *   offset  — başlangıç indeksi (default: 0)
 *   limit   — sayfa boyutu (default: 30, max: 100)
 *
 * Böylece dev 2.9 MB JSON client bundle'a girmez; kullanıcı sadece
 * ihtiyaç duydukça küçük parçalar çeker.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const q = (searchParams.get('q') || '').toLowerCase().trim();
    const type = searchParams.get('type') || '';
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10) || 0);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '30', 10) || 30));

    // Aynı kod veri kaynağında birden fazla kez bulunabiliyor. Liste ve arama
    // sonuçlarında yinelenen URL/kart üretmemek için kodu tekilleştir.
    let result = Array.from(
        new Map((obdCodes as ObdCode[]).map(code => [code.code.toUpperCase(), code])).values()
    );

    // Tip filtresi
    if (type && ['P', 'B', 'C', 'U'].includes(type.toUpperCase())) {
        result = result.filter(c => c.type === type.toUpperCase());
    }

    // Arama filtresi (en az 2 karakter)
    if (q.length >= 2) {
        result = result.filter(c =>
            c.code.toLowerCase().includes(q) ||
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        );
    }

    const total = result.length;
    const items = result.slice(offset, offset + limit);

    return NextResponse.json({
        items,
        total,
        offset,
        limit,
        hasMore: offset + limit < total,
    }, {
        headers: {
            // 5 dakika önbellek — OBD kodları sık değişmez
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
    });
}
