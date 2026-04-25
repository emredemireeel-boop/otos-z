import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle, ArrowLeft, Crown } from "lucide-react";
import Link from "next/link";
import segmentData from "@/data/arac_segmentleri.json";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface SegmentPageProps {
    params: {
        slug: string;
    };
}

export function generateStaticParams() {
    return segmentData.segments.map((segment) => ({
        slug: `${segment.id.toLowerCase()}-segmenti`,
    }));
}

export async function generateMetadata({ params }: SegmentPageProps): Promise<Metadata> {
    const slug = params.slug;
    const segmentIdMatch = slug.match(/^([a-z])-segmenti$/);
    
    if (segmentIdMatch) {
        const id = segmentIdMatch[1].toUpperCase();
        const segment = segmentData.segments.find(s => s.id === id);
        if (segment) {
            return {
                title: `${segment.title} Nedir? ${id} Segmenti Araçlar Nelerdir? | OtoSöz`,
                description: `${segment.title} özellikleri nelerdir? Hangi arabalar ${id} segmentine girer? ${id} segmenti hakkında bilmeniz gereken tüm detaylar OtoSöz Kütüphane'de.`,
            };
        }
    }
    
    return { title: 'Araç Segmentleri | OtoSöz' };
}

export default function SegmentDetailPage({ params }: SegmentPageProps) {
    const slug = params.slug;
    const segmentIdMatch = slug.match(/^([a-z])-segmenti$/);
    
    if (!segmentIdMatch) {
        notFound();
    }
    
    const id = segmentIdMatch[1].toUpperCase();
    const segment = segmentData.segments.find(s => s.id === id);
    
    if (!segment) {
        notFound();
    }
    
    const faqs = [
        { 
            question: `${segment.title} Nedir?`, 
            answer: `${segment.title}, otomotiv sektöründe araçların boyut, performans ve kullanım amacına göre sınıflandırıldığı kategorilerden biridir. ${segment.description}` 
        },
        { 
            question: `${id} Segmenti Araçların Özellikleri Nelerdir?`, 
            answer: `Bu segmentteki araçların genel özellikleri şunlardır: ${segment.characteristics.join(', ')}.` 
        },
        { 
            question: `${id} Segmenti Araçlara Örnekler Nelerdir?`, 
            answer: `Türkiye ve dünya pazarında sıkça karşılaştığımız ${id} segmenti popüler otomobillere örnek olarak; ${segment.examples.join(', ')} verilebilir.` 
        }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '800px', margin: '0 auto', padding: '100px 24px 60px 24px' }}>
                <Link href="/kutuphane?kategori=arac-segmentleri" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '24px', textDecoration: 'none', fontWeight: '600' }}>
                    <ArrowLeft size={16} /> Kütüphaneye Dön
                </Link>

                <div style={{
                    background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '40px',
                    marginBottom: '40px',
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '24px', background: 'rgba(255,255,255,0.2)',
                        margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)'
                    }}>
                        <Crown size={48} color="white" />
                    </div>
                    
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>{segment.title} Nedir?</h1>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                        {segment.description}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <HelpCircle size={28} color="#3B82F6" />
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)' }}>Sıkça Sorulan Sorular</h2>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {faqs.map((faq, idx) => (
                                <div key={idx} style={{ background: 'var(--background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <span style={{ color: '#3B82F6', fontSize: '20px' }}>Q.</span>
                                        {faq.question}
                                    </h3>
                                    <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0, paddingLeft: '32px' }}>
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
