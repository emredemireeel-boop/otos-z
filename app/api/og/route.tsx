import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const title = (searchParams.get('title') || "OtoSöz - Otomotiv Karar Platformu").trim().slice(0, 140);
        const description = (searchParams.get('desc') || "Araç alırken, arızayı araştırırken veya iki otomobil arasında kalırken karar vermeden önce OtoSöz'e sor.").trim().slice(0, 320);

        return new ImageResponse(
            (
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    padding: '56px',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    fontFamily: 'sans-serif',
                }}>
                    {/* Background glow effects */}
                    <div style={{
                        position: 'absolute',
                        right: '-10%',
                        top: '-10%',
                        width: '800px',
                        height: '800px',
                        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 60%)',
                        borderRadius: '50%',
                    }} />
                    <div style={{
                        position: 'absolute',
                        left: '-10%',
                        bottom: '-10%',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, rgba(0,0,0,0) 60%)',
                        borderRadius: '50%',
                    }} />

                    <div style={{ display: 'flex', alignItems: 'center', height: 64, position: 'relative' }}>
                        <span style={{ fontSize: 36, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>OtoSöz</span>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px',
                        position: 'absolute',
                        top: 152,
                        left: 56,
                        right: 56,
                    }}>
                        <h1 style={{
                            fontSize: '50px',
                            fontWeight: 'bold',
                            color: 'white',
                            lineHeight: 1.13,
                            letterSpacing: '-0.02em',
                            margin: 0,
                            maxHeight: 170,
                            overflow: 'hidden',
                            flexShrink: 0,
                        }}>
                            {title}
                        </h1>
                        <p style={{
                            fontSize: '26px',
                            color: '#cbd5e1',
                            lineHeight: 1.35,
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            maxHeight: 106,
                            flexShrink: 0,
                        }}>
                            {description}
                        </p>
                    </div>

                    <div style={{
                        position: 'absolute',
                        bottom: '44px',
                        left: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                    }}>
                        <div style={{ width: '60px', height: '4px', background: '#3b82f6', borderRadius: '2px' }} />
                        <span style={{ color: '#94a3b8', fontSize: '28px', fontWeight: 600, letterSpacing: '0.05em' }}>otosoz.com</span>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch {
        return new Response('Görsel oluşturulamadı.', { status: 500 });
    }
}
