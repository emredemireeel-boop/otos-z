import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle, ArrowLeft, Car } from "lucide-react";
import Link from "next/link";
import segmentData from "@/data/arac_segmentleri.json";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface KasaPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export function generateStaticParams() {
    return segmentData.bodyTypes.map((type) => ({
        slug: type.id,
    }));
}

export async function generateMetadata({ params }: KasaPageProps): Promise<Metadata> {
    const { slug } = await params;
    const type = segmentData.bodyTypes.find(t => t.id === slug);
    
    if (type) {
        return {
            title: `${type.title} Kasa Nedir? Avantajları ve Özellikleri | OtoSöz`,
            description: `${type.title} nedir? Hangi araçlar ${type.title} olarak adlandırılır? ${type.title} kasa araçların avantajları ve dezavantajları hakkında detaylı bilgiler OtoSöz'de.`,
        };
    }
    
    return { title: 'Araç Kasa Tipleri | OtoSöz' };
}

export default async function KasaDetailPage({ params }: KasaPageProps) {
    const { slug } = await params;
    const type = segmentData.bodyTypes.find(t => t.id === slug);
    
    if (!type) {
        notFound();
    }
    
    const faqs = [
        { 
            question: `${type.title} Kasa Nedir?`, 
            answer: `${type.title}, otomotiv pazarında sıkça tercih edilen gövde tasarımlarından biridir. ${type.description}` 
        },
        { 
            question: `${type.title} Araçların Avantajları Nelerdir?`, 
            answer: `Bir ${type.title} araç satın aldığınızda şu avantajlara sahip olursunuz: ${type.pros.join(', ')}.` 
        },
        { 
            question: `${type.title} Araçların Dezavantajları Nelerdir?`, 
            answer: `Kullanım amacınıza göre ${type.title} kasa bir araç alırken şu dezavantajları göz önünde bulundurmalısınız: ${type.cons.join(', ')}.` 
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
                    background: 'linear-gradient(135deg, #064E3B, #10B981)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '40px',
                    marginBottom: '40px',
                    boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '24px', background: 'rgba(255,255,255,0.2)',
                        margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)'
                    }}>
                        <Car size={48} color="white" />
                    </div>
                    
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>{type.title} Kasa Nedir?</h1>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                        {type.description}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <HelpCircle size={28} color="#10B981" />
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)' }}>Sıkça Sorulan Sorular</h2>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {faqs.map((faq, idx) => (
                                <div key={idx} style={{ background: 'var(--background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <span style={{ color: '#10B981', fontSize: '20px' }}>Q.</span>
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
