import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Map, HelpCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import plakaData from "@/data/plaka_kodlari.json";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PlakaPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for all 81 cities and special plates
export function generateStaticParams() {
    const cityParams = plakaData.iller.map((il) => ({
        slug: `${il.kod}-${il.il.toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c')}-plaka-kodu`,
    }));

    const specialParams = plakaData.ozelPlakalar.map((p) => ({
        slug: p.id,
    }));

    return [...cityParams, ...specialParams];
}

export async function generateMetadata({ params }: PlakaPageProps): Promise<Metadata> {
    const { slug } = await params;
    
    // Check if it's a special plate
    const specialPlate = plakaData.ozelPlakalar.find(p => p.id === slug);
    if (specialPlate) {
        return {
            title: `${specialPlate.isim} Nedir? Kimlere Verilir? | OtoSöz`,
            description: `${specialPlate.isim} anlamı nedir, kimler kullanabilir? ${specialPlate.anlam} Özel plaka detayları OtoSöz Kütüphane'de.`,
        };
    }

    // Check if it's a city plate
    const match = slug.match(/^(\d{2})-(.+)-plaka-kodu$/);
    if (match) {
        const kod = match[1];
        const il = plakaData.iller.find(i => i.kod === kod);
        if (il) {
            return {
                title: `${kod} Nerenin Plakası? ${kod} Hangi Şehrin Plaka Kodu? | OtoSöz`,
                description: `${kod} nerenin plakası? ${kod} plaka kodu ${il.il} iline aittir. ${il.il} plaka harf grupları, özellikleri ve merak edilen tüm detaylar.`,
            };
        }
    }

    return { title: 'Plaka Kodları | OtoSöz' };
}

export default async function PlakaDetailPage({ params }: PlakaPageProps) {
    const { slug } = await params;

    // Determine type and data
    const specialPlate = plakaData.ozelPlakalar.find(p => p.id === slug);
    
    let isCity = false;
    let cityData = null;
    let title = "";
    let description = "";
    let faqs: { question: string; answer: string }[] = [];
    
    if (specialPlate) {
        title = specialPlate.isim;
        description = specialPlate.anlam;
        faqs = [
            { question: `${specialPlate.isim} ne anlama gelir?`, answer: specialPlate.anlam },
            { question: `${specialPlate.isim} kimler tarafından kullanılır?`, answer: `Bu plakalar şu kişiler/kurumlar tarafından kullanılır: ${specialPlate.kullananlar.join(', ')}.` },
        ];
        if (specialPlate.detay) {
            faqs.push({ question: `Bu plakalarla ilgili özel şartlar nelerdir?`, answer: specialPlate.detay });
        }
    } else {
        const match = slug.match(/^(\d{2})-(.+)-plaka-kodu$/);
        if (match) {
            const kod = match[1];
            cityData = plakaData.iller.find(i => i.kod === kod);
            if (cityData) {
                isCity = true;
                title = `${kod} Nerenin Plakası?`;
                description = `${kod} plaka kodu, ülkemizin ${cityData.bolge} Bölgesi'nde yer alan ${cityData.il} ilimize aittir. Trafikte sıkça karşılaştığımız ${kod} plakalı araçlar, ${cityData.il} ilinde tescil edilmiştir.`;
                faqs = [
                    { question: `${kod} Nerenin Plakası?`, answer: `${kod} numaralı plaka kodu ${cityData.il} iline aittir. Trafikte ${kod} plakalı bir otomobil, kamyon veya motosiklet gördüğünüzde, bu aracın ${cityData.il} iline kayıtlı olduğunu anlayabilirsiniz.` },
                    { question: `${kod} Plaka Kodu Hangi Şehre Ait?`, answer: `Türkiye'deki araç plaka sistemine göre ${kod} plaka kodu, ${cityData.il} şehrine aittir. Her ilin alfabetik sıraya göre (ilk 67 il için) belirlenmiş bir kodu vardır ve ${cityData.il} ilinin plaka numarası ${kod} olarak tescillenmiştir.` },
                    { question: `${cityData.il} Plaka Kodu Kaçtır?`, answer: `${cityData.il} ilinin plaka kodu ${kod}'tür. Yeni bir araç aldığınızda veya ${cityData.il} ilinde araç tescil işlemi yaptırdığınızda aracınıza ${kod} ile başlayan bir plaka verilir.` },
                    { question: `${cityData.il} Hangi Bölgede Yer Alır?`, answer: `${cityData.il} ilimiz Türkiye'nin coğrafi bölgelerinden ${cityData.bolge} Bölgesi'nde yer almaktadır. Plaka kodu ${kod} olan bu şehrimiz, bulunduğu bölgenin önemli kentlerinden biridir.` },
                    { question: `${kod} Plaka Harf Grupları Nelerdir?`, answer: `${cityData.il} iline ait merkez ve ilçelerin özel harf grupları bulunur. Plakanın ortasındaki harfler (örneğin ${kod} ABC 123), aracın ${cityData.il} içerisindeki hangi vergi dairesine / ilçeye kayıtlı olduğunu ve tescil sırasını gösterir.` }
                ];
            }
        }
    }

    if (!specialPlate && !isCity) {
        notFound();
    }

    // JSON-LD Schema
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
                <Link href="/kutuphane?kategori=plaka-kodlari" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '24px', textDecoration: 'none', fontWeight: '600' }}>
                    <ArrowLeft size={16} /> Kütüphaneye Dön
                </Link>

                <div style={{
                    background: 'linear-gradient(135deg, #006C4C, #00C9B8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '40px',
                    marginBottom: '40px',
                    boxShadow: '0 20px 40px rgba(0, 108, 76, 0.2)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {isCity && cityData ? (
                        <div style={{
                            width: '120px', height: '120px', borderRadius: '24px', background: 'white',
                            margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '4px solid #000', boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                        }}>
                            <span style={{ fontSize: '64px', fontWeight: '900', color: '#000', letterSpacing: '-2px' }}>{cityData.kod}</span>
                        </div>
                    ) : specialPlate ? (
                        <div style={{
                            background: specialPlate.renkKodu, color: specialPlate.yaziRengi,
                            border: specialPlate.renkKodu === '#FFFFFF' ? '4px solid #000' : '4px solid rgba(255,255,255,0.2)',
                            borderRadius: '16px', padding: '24px', marginBottom: '32px',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `0 10px 25px rgba(0,0,0,0.3)`, position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40px', background: '#2563EB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '4px' }}>
                                <span style={{ color: 'white', fontSize: '12px', fontWeight: '800' }}>TR</span>
                            </div>
                            <span style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '4px', marginLeft: '40px' }}>
                                {specialPlate.ornek || (specialPlate.harfGruplari ? `34 ${specialPlate.harfGruplari[0]} 123` : '34 ABC 123')}
                            </span>
                        </div>
                    ) : null}

                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>{title}</h1>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                        {description}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <HelpCircle size={28} color="var(--primary)" />
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)' }}>Sıkça Sorulan Sorular</h2>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {faqs.map((faq, idx) => (
                                <div key={idx} style={{ background: 'var(--background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <span style={{ color: 'var(--primary)', fontSize: '20px' }}>Q.</span>
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
