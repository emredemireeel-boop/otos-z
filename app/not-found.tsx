"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Home, Search, ArrowLeft, MessageCircle, BookOpen, Compass } from "lucide-react";

export default function NotFound() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [searchQuery, setSearchQuery] = useState("");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Animated road particles
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const particles: { x: number; y: number; speed: number; size: number; opacity: number }[] = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speed: 0.2 + Math.random() * 0.8,
                size: 1 + Math.random() * 2,
                opacity: 0.1 + Math.random() * 0.3,
            });
        }

        let animId: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
                ctx.fill();
                p.y -= p.speed;
                if (p.y < -10) {
                    p.y = canvas.height + 10;
                    p.x = Math.random() * canvas.width;
                }
            });
            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animId);
        };
    }, []);

    // Parallax effect
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
        };
        window.addEventListener("mousemove", handler);
        return () => window.removeEventListener("mousemove", handler);
    }, []);

    const quickLinks = [
        { icon: <Home size={20} />, label: "Ana Sayfa", href: "/", desc: "Topluluk ve gündem" },
        { icon: <MessageCircle size={20} />, label: "Forum", href: "/forum", desc: "Tartışmalara katıl" },
        { icon: <BookOpen size={20} />, label: "Kütüphane", href: "/kutuphane", desc: "Otomotiv rehberi" },
        { icon: <Compass size={20} />, label: "Araç DNA", href: "/arac-dna", desc: "Araç analizi" },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

            {/* Gradient orbs */}
            <div style={{
                position: 'fixed', width: '600px', height: '600px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
                top: '10%', left: '20%', filter: 'blur(60px)', pointerEvents: 'none',
                transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
                transition: 'transform 0.3s ease-out',
            }} />
            <div style={{
                position: 'fixed', width: '500px', height: '500px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
                bottom: '10%', right: '20%', filter: 'blur(60px)', pointerEvents: 'none',
                transform: `translate(${-mousePos.x * 0.3}px, ${-mousePos.y * 0.3}px)`,
                transition: 'transform 0.3s ease-out',
            }} />

            <Navbar />

            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, padding: '40px 24px' }}>
                <div style={{ textAlign: 'center', maxWidth: '640px', width: '100%' }}>

                    {/* Animated 404 Number */}
                    <div style={{
                        position: 'relative', marginBottom: '32px',
                        transform: `translate(${mousePos.x * 0.15}px, ${mousePos.y * 0.15}px)`,
                        transition: 'transform 0.4s ease-out',
                    }}>
                        <div style={{
                            fontSize: '180px', fontWeight: '900', lineHeight: '1',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text', letterSpacing: '-8px',
                            userSelect: 'none',
                        }}>
                            404
                        </div>
                        {/* Glowing overlay */}
                        <div style={{
                            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '180px', fontWeight: '900', lineHeight: '1', letterSpacing: '-8px',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #3b82f6)',
                            backgroundSize: '200% 200%',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'gradient-shift 4s ease infinite',
                            filter: 'blur(0.5px)',
                        }}>
                            404
                        </div>
                    </div>

                    {/* Speed lines emoji */}
                    <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'float-car 3s ease-in-out infinite' }}>
                        🏎️💨
                    </div>

                    <h1 style={{
                        fontSize: '28px', fontWeight: '800', color: '#0f172a',
                        marginBottom: '12px', letterSpacing: '-0.5px',
                    }}>
                        Yoldan Çıktık!
                    </h1>
                    <p style={{
                        fontSize: '16px', color: '#64748b', lineHeight: '1.6',
                        marginBottom: '36px', maxWidth: '440px', margin: '0 auto 36px',
                    }}>
                        Aradığınız sayfa mevcut değil, taşınmış veya kaldırılmış olabilir. Doğru adreste olduğunuzdan emin olun.
                    </p>

                    {/* Search Bar */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        background: '#ffffff', border: '1px solid #e2e8f0',
                        borderRadius: '16px', padding: '6px 6px 6px 20px',
                        maxWidth: '480px', margin: '0 auto 40px',
                        transition: 'border-color 0.3s',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}>
                        <Search size={18} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Neyi arıyordunuz?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    window.location.href = `/?q=${encodeURIComponent(searchQuery)}`;
                                }
                            }}
                            style={{
                                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                color: '#0f172a', fontSize: '15px', padding: '12px 0',
                            }}
                        />
                        <button
                            onClick={() => {
                                if (searchQuery.trim()) window.location.href = `/?q=${encodeURIComponent(searchQuery)}`;
                            }}
                            style={{
                                padding: '10px 20px', background: 'var(--primary)', color: 'white',
                                border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '14px',
                                cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                            }}
                        >
                            Ara
                        </button>
                    </div>

                    {/* Quick Links */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', maxWidth: '540px', margin: '0 auto 36px' }}>
                        {quickLinks.map((link) => (
                            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    padding: '20px 12px', borderRadius: '16px',
                                    background: '#ffffff', border: '1px solid #e2e8f0',
                                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer',
                                    textAlign: 'center',
                                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#f8fafc';
                                        e.currentTarget.style.borderColor = '#3b82f6';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#ffffff';
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <div style={{ color: '#3b82f6', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                                        {link.icon}
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                                        {link.label}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                                        {link.desc}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Back Button */}
                    <button
                        onClick={() => window.history.back()}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '12px 28px', borderRadius: '12px',
                            background: '#ffffff', border: '1px solid #e2e8f0',
                            color: '#475569', fontSize: '14px', fontWeight: '600',
                            cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#3b82f6';
                            e.currentTarget.style.color = '#3b82f6';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.color = '#475569';
                        }}
                    >
                        <ArrowLeft size={16} /> Geri Dön
                    </button>
                </div>
            </main>

            <Footer />

            <style>{`
                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes float-car {
                    0%, 100% { transform: translateX(0) rotate(0deg); }
                    25% { transform: translateX(8px) rotate(1deg); }
                    75% { transform: translateX(-8px) rotate(-1deg); }
                }
            `}</style>
        </div>
    );
}
