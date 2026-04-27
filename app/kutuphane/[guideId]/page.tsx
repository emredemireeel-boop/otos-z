"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Clock, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2, BookOpen } from "lucide-react";

// Types  
interface TipWarning {
    title: string;
    text: string;
}

interface GuideSubSection {
    subtitle: string;
    text: string;
    points?: string[];
}

interface GuideTable {
    headers: string[];
    rows: string[][];
}

interface GuideSection {
    type: string;
    title: string;
    content: string;
    subsections?: GuideSubSection[];
    warning?: TipWarning;
    tip?: TipWarning;
    table?: GuideTable;
}

interface GuideDetail {
    id: string;
    title: string;
    description: string;
    minutes: number;
    difficulty: string;
    tags: string[];
    author: string;
    sections: GuideSection[];
    finalChecklist?: string[];
}

export default function GuideDetailPage({ params }: { params: Promise<{ guideId: string }> }) {
    const router = useRouter();
    const { guideId } = use(params);
    const [guide, setGuide] = useState<GuideDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("GuideDetailPage params guideId:", guideId);
        fetch(`/data/library_guides.json?v=${new Date().getTime()}`)
            .then(res => res.json())
            .then(data => {
                const foundGuide = data.guides?.find((g: GuideDetail) => g.id === guideId);
                console.log("Found guide:", foundGuide);
                setGuide(foundGuide || null);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading guide:', err);
                setLoading(false);
            });
    }, [guideId]);

    if (loading) {
        return (
            <div>
                <Navbar />
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--background)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            border: '4px solid var(--card-border)',
                            borderTop: '4px solid var(--primary)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }} />
                        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Yükleniyor...</p>
                        <style>
                            {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
                        </style>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!guide) {
        return (
            <div>
                <Navbar />
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--background)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '24px', color: 'var(--foreground)', marginBottom: '16px' }}>
                            Rehber Bulunamadı
                        </h2>
                        <button
                            onClick={() => router.back()}
                            style={{
                                padding: '10px 20px',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Geri Dön
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'kolay': return '#34D399';
            case 'orta': return '#FBBF24';
            case 'zor': return '#F87171';
            case 'kritik': return '#EF4444';
            default: return '#818CF8';
        }
    };

    const jsonLd = guide ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": guide.sections.filter(s => s.title).map(section => ({
            "@type": "Question",
            "name": section.title,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": section.content || (section.subsections ? section.subsections.map(s => s.text).join(" ") : guide.description)
            }
        }))
    } : null;

    return (
        <div>
            <Navbar />
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Hero Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                    borderRadius: '0 0 32px 32px',
                    padding: '60px 24px 40px',
                    marginBottom: '32px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', opacity: 0.5 }} />
                    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                        <button
                            onClick={() => router.back()}
                            style={{
                                padding: '8px 16px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '10px',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '24px'
                            }}
                        >
                            <ArrowLeft style={{ width: '16px', height: '16px' }} />
                            Geri
                        </button>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                            <span style={{
                                padding: '6px 14px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '10px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <Clock style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
                                {guide.minutes} dakika
                            </span>
                            <span style={{
                                padding: '6px 14px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: `1px solid ${getDifficultyColor(guide.difficulty)}`,
                                borderRadius: '10px',
                                fontSize: '12px',
                                fontWeight: '700',
                                color: getDifficultyColor(guide.difficulty),
                                backdropFilter: 'blur(10px)'
                            }}>
                                {guide.difficulty}
                            </span>
                        </div>

                        <h1 style={{
                            fontSize: '36px',
                            fontWeight: '800',
                            color: 'white',
                            marginBottom: '16px',
                            lineHeight: '1.3'
                        }}>
                            {guide.title}
                        </h1>

                        <p style={{
                            fontSize: '16px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            lineHeight: '1.6',
                            marginBottom: '20px'
                        }}>
                            {guide.description}
                        </p>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {guide.tags.map((tag, idx) => (
                                <span key={idx} style={{
                                    padding: '6px 12px',
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    border: '1px solid rgba(255, 255, 255, 0.25)',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    color: 'white',
                                    fontWeight: '600'
                                }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
                        {/* Main Content */}
                        <div>
                            {guide.sections.map((section, idx) => (
                                <div key={idx} style={{ marginBottom: '32px' }}>
                                    {section.type !== 'intro' && section.title && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{
                                                width: '6px',
                                                height: '32px',
                                                background: 'var(--primary)',
                                                borderRadius: '3px'
                                            }} />
                                            <h2 style={{
                                                fontSize: '24px',
                                                fontWeight: '700',
                                                color: 'var(--foreground)'
                                            }}>
                                                {section.title}
                                            </h2>
                                        </div>
                                    )}

                                    <div style={{
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '16px',
                                        padding: '24px'
                                    }}>
                                        {section.content && (
                                            <p style={{
                                                fontSize: '15px',
                                                color: 'var(--text-muted)',
                                                lineHeight: '1.8',
                                                marginBottom: section.subsections ? '20px' : 0
                                            }}>
                                                {section.content}
                                            </p>
                                        )}

                                        {section.subsections?.map((sub, subIdx) => (
                                            <div key={subIdx} style={{
                                                marginTop: subIdx > 0 ? '20px' : 0,
                                                paddingTop: subIdx > 0 ? '20px' : 0,
                                                borderTop: subIdx > 0 ? '1px solid var(--card-border)' : 'none'
                                            }}>
                                                <h4 style={{
                                                    fontSize: '16px',
                                                    fontWeight: '700',
                                                    color: 'var(--foreground)',
                                                    marginBottom: '8px'
                                                }}>
                                                    {sub.subtitle}
                                                </h4>
                                                <p style={{
                                                    fontSize: '14px',
                                                    color: 'var(--text-muted)',
                                                    lineHeight: '1.7',
                                                    marginBottom: sub.points ? '12px' : 0
                                                }}>
                                                    {sub.text}
                                                </p>
                                                {sub.points && (
                                                    <ul style={{ margin: 0, paddingLeft: '20px', listStyle: 'none' }}>
                                                        {sub.points.map((point, pointIdx) => (
                                                            <li key={pointIdx} style={{
                                                                fontSize: '14px',
                                                                color: 'var(--text-muted)',
                                                                lineHeight: '1.7',
                                                                marginBottom: '8px',
                                                                paddingLeft: '24px',
                                                                position: 'relative'
                                                            }}>
                                                                <span style={{
                                                                    position: 'absolute',
                                                                    left: 0,
                                                                    color: 'var(--primary)',
                                                                    fontWeight: '700'
                                                                }}>
                                                                    →
                                                                </span>
                                                                {point}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}

                                        {/* Table Render */}
                                        {section.table && (
                                            <div style={{ overflowX: 'auto', marginTop: '24px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                                    <thead style={{ background: 'var(--secondary)' }}>
                                                        <tr>
                                                            {section.table.headers.map((th, i) => (
                                                                <th key={i} style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--foreground)', borderBottom: '1px solid var(--card-border)' }}>{th}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {section.table.rows.map((row, i) => (
                                                            <tr key={i} style={{ borderBottom: i === section.table!.rows.length - 1 ? 'none' : '1px solid var(--card-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                                                {row.map((td, j) => (
                                                                    <td key={j} style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{td}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>

                                    {/* Warning */}
                                    {section.warning && (
                                        <div style={{
                                            marginTop: '16px',
                                            background: 'rgba(239, 68, 68, 0.08)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            display: 'flex',
                                            gap: '12px'
                                        }}>
                                            <AlertTriangle style={{ width: '20px', height: '20px', color: '#EF4444', flexShrink: 0 }} />
                                            <div>
                                                <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#EF4444', marginBottom: '6px' }}>
                                                    {section.warning.title}
                                                </h5>
                                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                                    {section.warning.text}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tip */}
                                    {section.tip && (
                                        <div style={{
                                            marginTop: '16px',
                                            background: 'rgba(16, 185, 129, 0.08)',
                                            border: '1px solid rgba(16, 185, 129, 0.2)',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            display: 'flex',
                                            gap: '12px'
                                        }}>
                                            <Lightbulb style={{ width: '20px', height: '20px', color: '#10B981', flexShrink: 0 }} />
                                            <div>
                                                <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#10B981', marginBottom: '6px' }}>
                                                    {section.tip.title}
                                                </h5>
                                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                                    {section.tip.text}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Final Checklist */}
                            {guide.finalChecklist && (
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    marginTop: '32px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: 'rgba(67, 233, 123, 0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <CheckCircle2 style={{ width: '24px', height: '24px', color: '#43E97B' }} />
                                        </div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>
                                            Özet Kontrol Listesi
                                        </h3>
                                    </div>
                                    <div style={{ height: '1px', background: 'var(--card-border)', marginBottom: '20px' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {guide.finalChecklist.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                                                <CheckCircle2 style={{ width: '18px', height: '18px', color: '#43E97B', flexShrink: 0, marginTop: '2px' }} />
                                                <span style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside>
                            <div style={{ position: 'sticky', top: '80px' }}>
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '20px'
                                }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <BookOpen style={{ width: '16px', height: '16px' }} />
                                        Bu Rehberde
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {guide.sections.filter(s => s.type !== 'intro' && s.title).map((section, idx) => (
                                            <a
                                                key={idx}
                                                href={`#section-${idx}`}
                                                style={{
                                                    padding: '10px',
                                                    background: 'var(--secondary)',
                                                    borderRadius: '8px',
                                                    fontSize: '13px',
                                                    color: 'var(--foreground)',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                    border: '1px solid var(--card-border)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'var(--secondary)';
                                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'var(--secondary)';
                                                    e.currentTarget.style.borderColor = 'var(--card-border)';
                                                }}
                                            >
                                                {section.title}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <div style={{
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--primary)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    marginTop: '16px'
                                }}>
                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>👍</div>
                                    <h5 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                        Yazar
                                    </h5>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                        {guide.author}
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
