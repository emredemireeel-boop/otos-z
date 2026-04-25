import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle, ArrowLeft, IdCard } from "lucide-react";
import Link from "next/link";
import ehliyetData from "@/data/ehliyet_siniflari.json";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface EhliyetSinifPageProps {
    params: {
        slug: string;
    };
}

export function generateStaticParams() {
    return ehliyetData.siniflar.map((sinif) => ({
        slug: `${sinif.id.toLowerCase()}-sinifi-ehliyet`,
    }));
}

export async function generateMetadata({ params }: EhliyetSinifPageProps): Promise<Metadata> {
    const slug = params.slug;
    const match = slug.match(/^([a-z0-9]+)-sinifi-ehliyet$/);
    
    if (match) {
        const id = match[1].toUpperCase();
        const sinif = ehliyetData.siniflar.find(s => s.id === id);
        if (sinif) {
            return {
                title: `${sinif.isim} Nedir? Hangi Araçları Kullanır? | OtoSöz`,
                description: `${sinif.id} sınıfı ehliyet özellikleri, yaş sınırı ve tecrübe şartları. ${sinif.isim} alarak hangi taşıtları kullanabileceğinizi öğrenin.`,
            };
        }
    }
    
    return { title: 'Ehliyet Sınıfları | OtoSöz' };
}

export default function EhliyetSinifDetailPage({ params }: EhliyetSinifPageProps) {
    const slug = params.slug;
    const match = slug.match(/^([a-z0-9]+)-sinifi-ehliyet$/);
    
    if (!match) {
        notFound();
    }
    
    const id = match[1].toUpperCase();
    const sinif = ehliyetData.siniflar.find(s => s.id === id);
    
    if (!sinif) {
        notFound();
    }
    
    const faqs = [
        { 
            question: `${sinif.isim} Nedir?`, 
            answer: `${sinif.isim}, Karayolları Trafik Yönetmeliğine göre belirli motorlu taşıtları kullanmaya yetki veren bir sürücü belgesi türüdür.` 
        },
        { 
            question: `${sinif.id} Sınıfı Ehliyet Hangi Araçları Kullanır?`, 
            answer: `Bu ehliyete sahip olan sürücüler şu araçları kullanmaya yetkilidir: ${sinif.araclar}.` 
        },
        { 
            question: `${sinif.id} Sınıfı Ehliyet Alma Yaş Sınırı Kaçtır?`, 
            answer: `${sinif.id} sınıfı sürücü belgesi alabilmek için belirlenen asgari yaş sınırı ${sinif.yasSiniri}'dir.` 
        },
        { 
            question: `${sinif.id} Sınıfı İçin Tecrübe Şartı Var Mı?`, 
            answer: `${sinif.id} sınıfı ehliyet alabilmek için aranan tecrübe şartı şöyledir: ${sinif.tecrube}.` 
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
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '40px',
                    marginBottom: '40px',
                    boxShadow: '0 20px 40px rgba(245, 158, 11, 0.2)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '24px', background: 'rgba(255,255,255,0.2)',
                        margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)'
                    }}>
                        <IdCard size={48} color="white" />
                    </div>
                    
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>{sinif.isim}</h1>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                        {sinif.id} sınıfı sürücü belgesi şartları, kapsadığı araç türleri ve yaş sınırları rehberi.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <HelpCircle size={28} color="#F59E0B" />
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)' }}>Sıkça Sorulan Sorular</h2>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {faqs.map((faq, idx) => (
                                <div key={idx} style={{ background: 'var(--background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <span style={{ color: '#F59E0B', fontSize: '20px' }}>Q.</span>
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
