import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams, origin } = new URL(request.url);
        
        const title = searchParams.get('title') || "OtoSöz - Türkiye'nin En Kapsamlı Otomobil Platformu";
        const description = searchParams.get('desc') || "Araç arıza kodları, gösterge işaretleri, kütüphane ve teknik rehberler. Aradığınız her şey OtoSöz'de.";
        
        return new ImageResponse(
            (
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: '80px',
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
                    
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '60px', zIndex: 10 }}>
                        <img 
                            src={`${origin}/white_logo.svg`} 
                            width="300" 
                            style={{ objectFit: 'contain' }} 
                            alt="OtoSöz Logo"
                        />
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        maxWidth: '1000px',
                        zIndex: 10,
                    }}>
                        <h1 style={{
                            fontSize: '64px',
                            fontWeight: 'bold',
                            color: 'white',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                            margin: 0,
                        }}>
                            {title}
                        </h1>
                        <p style={{
                            fontSize: '32px',
                            color: '#cbd5e1',
                            lineHeight: 1.5,
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}>
                            {description}
                        </p>
                    </div>

                    <div style={{
                        position: 'absolute',
                        bottom: '80px',
                        left: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        zIndex: 10
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
    } catch (e: any) {
        return new Response(`Failed to generate the image: ${e.message}`, { status: 500 });
    }
}
