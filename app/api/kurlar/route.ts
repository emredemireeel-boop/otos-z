import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://finans.truncgil.com/today.json', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Kurlar API Error:', error);
    return NextResponse.json(
      { error: 'Kurlar alınamadı' },
      { status: 500 }
    );
  }
}
