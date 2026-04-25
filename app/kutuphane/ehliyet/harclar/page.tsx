import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle, ArrowLeft, Coins } from "lucide-react";
import Link from "next/link";
import ehliyetData from "@/data/ehliyet_siniflari.json";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "2026 Ehliyet Harç Ücretleri | B Sınıfı Ehliyet Ne Kadar? | OtoSöz",
    description: "2026 güncel ehliyet harçları, değerli kağıt bedeli ve vakıf payı ücretleri. B sınıfı, A2 motosiklet ehliyeti ve yenileme fiyatları OtoSöz'de.",
};

export default function EhliyetHarclariPage() {
    const { ucretler2026, digerUcretler } = ehliyetData;
    
    const faqs = [
        ...ucretler2026.map((item) => ({
            question: `2026 Yılı ${item.sinif} Ehliyet Harcı Ne Kadar?`,
            answer: `${item.sinif} ehliyet için 2026 yılında ödenmesi gereken toplam devlete ödenen tutar ${item.toplam}'dir. Bu tutar; ${item.harc} harç bedeli, ${item.degerliKagit} değerli kağıt bedeli ve ${item.vakifPayi} vakıf payından oluşmaktadır.`
        })),
        ...digerUcretler.map((item) => ({
            question: `${item.islem} Ücreti Ne Kadar?`,
            answer: `2026 güncel verilerine göre ${item.islem} için ödenmesi gereken tutar ${item.ucret}'dir. Detay: ${item.detay}`
        }))
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
                        <Coins size={48} color="white" />
                    </div>
                    
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>2026 Ehliyet Harç Ücretleri</h1>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                        Ehliyet sınıflarına göre 2026 yılı güncel devlete ödenen harçlar, vakıf payı ve ehliyet yenileme ücretleri rehberi.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <HelpCircle size={28} color="#10B981" />
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)' }}>Sıkça Sorulan Sorular (Fiyatlar)</h2>
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
