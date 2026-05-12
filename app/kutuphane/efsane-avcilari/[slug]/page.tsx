import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, CheckCircle, AlertTriangle, ExternalLink, Beaker, Zap, ChevronRight, BookOpen, Shield } from "lucide-react";
import { mythsData, Myth } from "@/data/efsane-avcilari-data";

interface PageProps {
    params: Promise<{ slug: string }>;
}

function getMythFromSlug(slug: string): Myth | null {
    const parts = slug.split("--");
    const idStr = parts[parts.length - 1];
    const id = parseInt(idStr, 10);
    if (isNaN(id)) return null;
    return mythsData.find(m => m.id === id) || null;
}

function getCategoryLabel(cat: string) {
    switch (cat) {
        case 'fuel': return 'Yakıt Tüketimi';
        case 'engine': return 'Motor & Bakım';
        case 'safety': return 'Sürüş & Güvenlik';
        case 'tire': return 'Lastik & Yürüyen';
        case 'electric': return 'Elektrik & Donanım';
        default: return 'Genel';
    }
}

function getCategoryColor(cat: string) {
    switch (cat) {
        case 'fuel': return '#F59E0B';
        case 'engine': return '#3B82F6';
        case 'safety': return '#EF4444';
        case 'tire': return '#10B981';
        case 'electric': return '#8B5CF6';
        default: return '#6B7280';
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const myth = getMythFromSlug(slug);
    
    if (!myth) {
        return { title: "Efsane Bulunamadı | OtoSöz" };
    }

    return {
        title: `${myth.seoTitle} | Oto Efsane Avcıları`,
        description: myth.seoDescription,
        openGraph: {
            title: `${myth.seoTitle} | OtoSöz`,
            description: myth.seoDescription,
            url: `https://otosoz.com/kutuphane/efsane-avcilari/${slug}`,
            siteName: "OtoSöz",
            locale: "tr_TR",
            type: "article",
        },
        alternates: {
            canonical: `/kutuphane/efsane-avcilari/${slug}`,
        },
    };
}

export function generateStaticParams() {
    return mythsData.map((myth) => ({
        slug: `${myth.slug}--${myth.id}`,
    }));
}

export default async function EfsaneDetayPage({ params }: PageProps) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const myth = getMythFromSlug(slug);

    if (!myth) {
        notFound();
    }

    const catColor = getCategoryColor(myth.category);
    const catLabel = getCategoryLabel(myth.category);

    // Sonraki ve önceki efsaneler
    const currentIndex = mythsData.findIndex(m => m.id === myth.id);
    const prevMyth = currentIndex > 0 ? mythsData[currentIndex - 1] : null;
    const nextMyth = currentIndex < mythsData.length - 1 ? mythsData[currentIndex + 1] : null;

    // Aynı kategoriden 3 öneri
    const relatedMyths = mythsData
        .filter(m => m.category === myth.category && m.id !== myth.id)
        .slice(0, 3);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": myth.seoTitle || myth.myth,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": myth.explanation
            }
        }]
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--background)" }}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <main style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '860px', margin: '0 auto', padding: '100px 24px 60px 24px' }}>
                
                {/* Breadcrumb */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <Link href="/kutuphane" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Kütüphane</Link>
                    <ChevronRight size={14} />
                    <Link href="/kutuphane?kategori=efsane-avcilari" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Efsane Avcıları</Link>
                    <ChevronRight size={14} />
                    <span style={{ color: 'var(--foreground)', fontWeight: '600' }}>Dosya #{myth.id}</span>
                </nav>

                <article>
                    {/* Hero Banner */}
                    <div style={{ 
                        background: 'linear-gradient(135deg, #1f2937, #111827)',
                        borderRadius: '24px', 
                        padding: '48px 40px', 
                        marginBottom: '32px',
                        border: '1px solid var(--card-border)',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ position: 'absolute', right: '-30px', bottom: '-30px', opacity: 0.04, transform: 'rotate(-15deg)' }}>
                            <Beaker size={280} color="white" />
                        </div>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            {/* Badges */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                                <span style={{ 
                                    padding: "6px 14px", background: `${catColor}20`, 
                                    border: `1px solid ${catColor}40`, borderRadius: "8px", 
                                    color: catColor, fontSize: "12px", fontWeight: "700", 
                                    textTransform: "uppercase", letterSpacing: "1px" 
                                }}>
                                    {catLabel}
                                </span>
                                <span style={{ 
                                    padding: "6px 14px", background: 'rgba(239,68,68,0.15)', 
                                    border: '1px solid rgba(239,68,68,0.3)', borderRadius: "8px", 
                                    color: '#F87171', fontSize: "12px", fontWeight: "700", 
                                    textTransform: "uppercase", letterSpacing: "1px",
                                    display: 'flex', alignItems: 'center', gap: '6px'
                                }}>
                                    <AlertTriangle size={12} /> Efsane #{myth.id}
                                </span>
                            </div>

                            <h1 style={{ fontSize: "30px", fontWeight: "800", color: "white", margin: "0 0 12px 0", lineHeight: "1.35" }}>
                                {myth.seoTitle}
                            </h1>
                            <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: '1.6', margin: 0, maxWidth: '650px' }}>
                                {myth.seoDescription}
                            </p>
                        </div>
                    </div>

                    {/* Mit vs Gerçek Kutuları */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "32px" }}>
                        {/* Efsane Kutusu */}
                        <div style={{ flex: "1 1 300px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "20px", padding: "28px", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", right: "-15px", top: "-15px", opacity: 0.06 }}>
                                <AlertTriangle size={100} color="#EF4444" />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", position: "relative", zIndex: 1 }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <AlertTriangle size={18} color="#EF4444" />
                                </div>
                                <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#EF4444", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Şehir Efsanesi</h2>
                            </div>
                            <p style={{ fontSize: "16px", color: "var(--foreground)", lineHeight: "1.6", fontWeight: "600", position: "relative", zIndex: 1, margin: 0 }}>
                                &quot;{myth.myth}&quot;
                            </p>
                        </div>
                        
                        {/* Gerçek Kutusu */}
                        <div style={{ flex: "1 1 300px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "20px", padding: "28px", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", right: "-15px", top: "-15px", opacity: 0.06 }}>
                                <CheckCircle size={100} color="#10B981" />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", position: "relative", zIndex: 1 }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <CheckCircle size={18} color="#10B981" />
                                </div>
                                <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#10B981", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Kısa Gerçek</h2>
                            </div>
                            <p style={{ fontSize: "16px", color: "var(--foreground)", lineHeight: "1.6", position: "relative", zIndex: 1, margin: 0 }}>
                                {myth.reality}
                            </p>
                        </div>
                    </div>

                    {/* Detaylı Mühendislik Açıklaması */}
                    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "36px", marginBottom: '32px' }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid var(--card-border)" }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${catColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Beaker size={20} color={catColor} />
                            </div>
                            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>
                                Detaylı Mühendislik Gerçeği
                            </h2>
                        </div>
                        <div style={{ fontSize: "16px", color: "var(--foreground)", lineHeight: "1.9" }}>
                            {myth.explanation.split('\n').map((paragraph, index) => (
                                <p key={index} style={{ marginBottom: "16px" }}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    {/* Sonuç Kutusu */}
                    <div style={{ 
                        background: `linear-gradient(135deg, ${catColor}08, ${catColor}03)`,
                        border: `1px solid ${catColor}20`, 
                        borderRadius: "16px", 
                        padding: "24px 28px",
                        marginBottom: '32px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px'
                    }}>
                        <Shield size={22} color={catColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '6px', margin: '0 0 6px 0' }}>Sonuç</h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
                                Bu efsane mühendislik gerçekleriyle çürütülmüştür. {myth.reality}
                            </p>
                        </div>
                    </div>
                </article>

                {/* İlgili Efsaneler */}
                {relatedMyths.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <BookOpen size={20} color={catColor} /> Aynı Kategoriden Efsaneler
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {relatedMyths.map(rm => (
                                <Link key={rm.id} href={`/kutuphane/efsane-avcilari/${rm.slug}--${rm.id}`} style={{ textDecoration: 'none' }}>
                                    <div style={{ 
                                        background: 'var(--card-bg)', 
                                        border: '1px solid var(--card-border)', 
                                        borderRadius: '14px', 
                                        padding: '16px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '12px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                                            <AlertTriangle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {rm.myth}
                                            </span>
                                        </div>
                                        <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Önceki / Sonraki Navigasyon */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                    {prevMyth && (
                        <Link href={`/kutuphane/efsane-avcilari/${prevMyth.slug}--${prevMyth.id}`} style={{ flex: '1 1 200px', textDecoration: 'none' }}>
                            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '16px 20px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <ArrowLeft size={12} /> Önceki Efsane
                                </div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {prevMyth.myth}
                                </div>
                            </div>
                        </Link>
                    )}
                    {nextMyth && (
                        <Link href={`/kutuphane/efsane-avcilari/${nextMyth.slug}--${nextMyth.id}`} style={{ flex: '1 1 200px', textDecoration: 'none' }}>
                            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '16px 20px', textAlign: 'right' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                    Sonraki Efsane <ChevronRight size={12} />
                                </div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {nextMyth.myth}
                                </div>
                            </div>
                        </Link>
                    )}
                </div>

                {/* Alt Bağlantılar */}
                <div style={{ paddingTop: "24px", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: 'wrap', gap: '12px' }}>
                    <Link href="/kutuphane?kategori=efsane-avcilari" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--primary)", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>
                        <ArrowLeft size={16} /> Tüm Efsaneleri Gör
                    </Link>
                    <Link href="/forum" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", textDecoration: "none", fontSize: "13px", fontWeight: "600", padding: "8px 14px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px" }}>
                        Forumda Tartış <ExternalLink size={14} />
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
