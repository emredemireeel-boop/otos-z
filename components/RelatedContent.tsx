"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Wrench, AlertTriangle, ArrowRight, BookMarked, Settings } from "lucide-react";
import faultData from "@/data/fault_lights.json";
import obdCodes from "@/data/obd-codes.json";

// Type definition for what we will render
interface Recommendation {
    id: string;
    url: string;
    title: string;
    description: string;
    type: "makale" | "gosterge" | "obd" | "bakim" | "sozluk";
    icon: React.ReactNode;
    color: string;
}

interface RelatedContentProps {
    currentId: string;
    tags: string[];
    titleKeywords?: string[];
}

export default function RelatedContent({ currentId, tags, titleKeywords = [] }: RelatedContentProps) {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Build recommendation pool
        const pool: Recommendation[] = [];
        
        // 1. Add OBD Codes
        obdCodes.forEach((item: any) => {
            if (item.code === currentId) return; // Skip self
            pool.push({
                id: item.code,
                url: `/obd/${item.code.toLowerCase()}`,
                title: `${item.code} Arıza Kodu`,
                description: item.title,
                type: "obd",
                icon: <Wrench size={18} />,
                color: "#ef4444"
            });
        });

        // 2. Add Gösterge Lights
        if (faultData && faultData.warningLights) {
            faultData.warningLights.forEach((item: any) => {
                if (item.id === currentId || item.urlId?.toString() === currentId) return;
                
                // create slug logic
                const createSlug = (text: string) => {
                    const trMap: { [key: string]: string } = {
                        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
                        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
                    };
                    return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, match => trMap[match] || match)
                        .toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
                };

                pool.push({
                    id: item.id,
                    url: `/gosterge/${createSlug(item.title)}--${item.urlId}`,
                    title: item.title,
                    description: item.meaning,
                    type: "gosterge",
                    icon: <AlertTriangle size={18} />,
                    color: item.color || "#F59E0B"
                });
            });
        }

        // We can fetch Makale (Library Guides) and Bakim from public JSONs if needed
        Promise.all([
            fetch(`/data/library_guides.json?t=${Date.now()}`).then(res => res.ok ? res.json() : null).catch(() => null),
            fetch(`/data/bakim_icerikleri.json?t=${Date.now()}`).then(res => res.ok ? res.json() : null).catch(() => null)
        ]).then(([libraryData, bakimData]) => {
            
            if (libraryData && libraryData.guides) {
                libraryData.guides.forEach((item: any) => {
                    const urlId = item.urlId || item.id.replace(/\D/g, '');
                    if (urlId.toString() === currentId) return;

                    const createSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    pool.push({
                        id: item.id,
                        url: `/makale/${createSlug(item.title)}--${urlId}`,
                        title: item.title,
                        description: item.description,
                        type: "makale",
                        icon: <BookOpen size={18} />,
                        color: "#3b82f6"
                    });
                });
            }

            if (bakimData && bakimData.bakimRehberleri) {
                bakimData.bakimRehberleri.forEach((item: any) => {
                    if (item.id === currentId || item.urlId?.toString() === currentId) return;

                    const createSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    pool.push({
                        id: item.id,
                        url: `/bakim-rehberi/${createSlug(item.title)}--${item.urlId || item.id}`,
                        title: item.title,
                        description: item.shortDesc || "Araç bakım rehberi.",
                        type: "bakim",
                        icon: <Settings size={18} />,
                        color: "#10B981"
                    });
                });
            }

            // Now score the pool based on tags and title keywords
            const searchTerms = [...tags, ...titleKeywords].map(t => t.toLowerCase());
            
            const scored = pool.map(item => {
                let score = 0;
                const itemText = `${item.title} ${item.description}`.toLowerCase();
                
                searchTerms.forEach(term => {
                    if (itemText.includes(term)) score += 2;
                });
                
                // Add random tie-breaker so it doesn't look static
                return { ...item, score: score + Math.random() * 0.5 };
            });

            // Filter out 0 scores if we have enough matches, otherwise keep top randoms
            let topMatches = scored.filter(s => s.score > 0.5).sort((a, b) => b.score - a.score);
            
            if (topMatches.length < 3) {
                // Pad with highly rated/random content if no strong match
                const others = scored.filter(s => s.score <= 0.5).sort((a, b) => b.score - a.score);
                topMatches = [...topMatches, ...others].slice(0, 4);
            } else {
                topMatches = topMatches.slice(0, 4);
            }

            setRecommendations(topMatches);
            setLoading(false);
        });

    }, [currentId, tags, titleKeywords]);

    if (loading || recommendations.length === 0) return null;

    return (
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--card-border)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🔗</span> İlginizi Çekebilecek İçerikler
            </h2>
            
            {/* Grid Layout that is responsive */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
            }}>
                {recommendations.map(rec => (
                    <Link key={rec.id} href={rec.url} style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '16px',
                            padding: '20px',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = rec.color;
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = `0 10px 25px ${rec.color}15`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--card-border)';
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = 'none';
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: rec.color }} />
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    background: `${rec.color}15`, color: rec.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {rec.icon}
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: rec.color, letterSpacing: '0.5px' }}>
                                    {rec.type === 'makale' ? 'Makale' : rec.type === 'obd' ? 'OBD Kodu' : rec.type === 'gosterge' ? 'Gösterge' : 'Bakım Rehberi'}
                                </span>
                            </div>
                            
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px', lineHeight: '1.4' }}>
                                {rec.title}
                            </h3>
                            
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {rec.description}
                            </p>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px', fontSize: '12px', fontWeight: '600', color: rec.color }}>
                                İncele <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
