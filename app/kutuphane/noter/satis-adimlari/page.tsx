import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle, ArrowLeft, FileText, AlertTriangle } from "lucide-react";
import Link from "next/link";
import noterData from "@/data/noter_islemleri.json";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Araç Satış Adımları ve Dolandırıcılık Uyarıları | OtoSöz",
    description: "Noterde 2. el araç alım satım süreci nasıl işler? Araç alırken ve satarken dolandırıcılara karşı nelere dikkat edilmeli? Adım adım rehber OtoSöz'de.",
};

export default function SatisAdimlariPage() {
    const { adimlar, dolandiricilikUyarilari } = noterData;
    
    const faqs = [
        ...adimlar.map((adim) => ({
            question: `Adım ${adim.id}: ${adim.baslik} Nasıl Yapılır?`,
            answer: adim.aciklama
        })),
        {
            question: "Araç Alım Satımında Dolandırıcılık Nasıl Önlenir?",
            answer: `Araç alım satımında dolandırıcılığı önlemek için şu uyarılara dikkat etmelisiniz: ${dolandiricilikUyarilari.join(' ')}`
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
                <Link href="/kutuphane?kategori=noter-islemleri" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '24px', textDecoration: 'none', fontWeight: '600' }}>
                    <ArrowLeft size={16} /> Kütüphaneye Dön
                </Link>

                <div style={{
                    background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '40px',
                    marginBottom: '40px',
                    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '24px', background: 'rgba(255,255,255,0.2)',
                        margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)'
                    }}>
                        <FileText size={48} color="white" />
                    </div>
                    
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>Araç Satış Adımları ve Uyarılar</h1>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                        Noter araç satış süreci nasıl ilerler? Nelere dikkat etmelisiniz? Dolandırıcıların en sık kullandığı yöntemler ve alınacak önlemler.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <HelpCircle size={28} color="#8B5CF6" />
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)' }}>Sıkça Sorulan Sorular (Adımlar & Uyarılar)</h2>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {faqs.map((faq, idx) => (
                                <div key={idx} style={{ background: 'var(--background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        {faq.question.includes('Dolandırıcılık') ? (
                                            <AlertTriangle color="#EF4444" size={24} style={{ flexShrink: 0 }} />
                                        ) : (
                                            <span style={{ color: '#8B5CF6', fontSize: '20px', flexShrink: 0 }}>Q.</span>
                                        )}
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
