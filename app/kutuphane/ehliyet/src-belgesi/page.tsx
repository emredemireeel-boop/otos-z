import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle, ArrowLeft, FileCheck } from "lucide-react";
import Link from "next/link";
import ehliyetData from "@/data/ehliyet_siniflari.json";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "SRC Belgesi Nedir? SRC 1, 2, 3, 4, 5 Ne İşe Yarar? | OtoSöz",
    description: "Ticari araç sürücüleri için zorunlu olan SRC belgesi nedir? SRC türleri arasındaki farklar ve alma şartları hakkında detaylı rehber OtoSöz'de.",
};

export default function SrcBelgesiPage() {
    const { srcBelgesi } = ehliyetData;
    
    const faqs = [
        {
            question: "SRC Belgesi Nedir?",
            answer: srcBelgesi.aciklama
        },
        ...srcBelgesi.turler.map((tur) => ({
            question: `${tur.id} Belgesi Nedir, Ne İşe Yarar?`,
            answer: `${tur.id} belgesi, '${tur.tanim}' yetkisi veren mesleki yeterlilik belgesidir.`
        })),
        {
            question: "SRC Belgesi Almak İçin Şartlar Nelerdir?",
            answer: "SRC belgesi almak için öncelikle B, C veya D sınıfı geçerli bir sürücü belgesine sahip olmak şarttır. 2003 yılından önce ehliyet alanlar eğitime ve sınava girmeden muafiyetle SRC belgesi alabilirler."
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
                <Link href="/kutuphane?kategori=ehliyet-siniflari" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '24px', textDecoration: 'none', fontWeight: '600' }}>
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
                        <FileCheck size={48} color="white" />
                    </div>
                    
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>SRC Belgesi Nedir?</h1>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                        Ticari amaçla araç kullanacak sürücülerin sahip olması gereken mesleki yeterlilik belgeleri ve türleri hakkında tüm detaylar.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <HelpCircle size={28} color="#3B82F6" />
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)' }}>Sıkça Sorulan Sorular (SRC Belgesi)</h2>
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
