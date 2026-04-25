"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronLeft, HelpCircle, ShieldCheck, Tag } from "lucide-react";

interface FaqProps {
    id: number;
    question: string;
    slug: string;
    answer: string;
    category: string;
    tags: string[];
}

export default function TuvturkFaqDetailClient({ faq }: { faq: FaqProps }) {
    // FAQ Schema for Google Rich Snippets
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }]
    };

    return (
        <div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Header */}
                <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)', padding: '32px 24px' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <Link href="/kutuphane?kategori=tuvturk-muayene" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", textDecoration: "none", fontSize: "14px", fontWeight: "600", marginBottom: "24px", padding: "8px 14px", background: "var(--background)", border: "1px solid var(--card-border)", borderRadius: "10px" }}>
                            <ChevronLeft size={16} /> Kütüphaneye Dön
                        </Link>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ padding: '4px 10px', background: 'var(--primary)', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>{faq.category}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>TÜVTÜRK Sıkça Sorulan Sorular</span>
                        </div>
                        
                        <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', lineHeight: '1.3', marginBottom: '16px' }}>
                            {faq.question}
                        </h1>
                    </div>
                </div>

                {/* Content */}
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '32px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-16px', left: '32px', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}>
                            <HelpCircle size={18} color="white" />
                        </div>
                        
                        <div style={{ fontSize: '16px', color: 'var(--foreground)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        
                        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {faq.tags.map((tag, idx) => (
                                <span key={idx} style={{ padding: '6px 12px', background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Tag size={12} /> {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', padding: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(15, 23, 42, 0.2))', border: '1px solid var(--card-border)', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <ShieldCheck size={32} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>TÜVTÜRK Rehberi</h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>Aracınızın muayeneden sorunsuz geçmesi için ağır ve hafif kusur listelerine tam göz atın.</p>
                            <Link href="/kutuphane?kategori=tuvturk-muayene" style={{ display: 'inline-block', padding: '8px 16px', background: 'var(--primary)', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                                Tüm Kusur Listesini İncele
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
