"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Wrench, ArrowLeft, Star, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UstaOlPage() {
    const { user, isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || isLoading) {
        return <div style={{ minHeight: '100vh', background: 'var(--background)' }} />;
    }

    // Eğer zaten ustaysa komik bir mesaj ver
    if (user?.role === "usta" || user?.role === "admin" || user?.role === "moderator") {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
                <Navbar />
                <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                    <div style={{
                        maxWidth: '500px', width: '100%',
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '24px', padding: '40px', textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ 
                            width: '80px', height: '80px', borderRadius: '50%', 
                            background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            margin: '0 auto 20px' 
                        }}>
                            <Star size={40} />
                        </div>
                        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px' }}>
                            Hop, Yavaş Ol Şampiyon! 🏎️
                        </h1>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                            Sen zaten bu sitenin en kral ustalarından birisin! Buraların senin engin bilgilerine ihtiyacı var. Hadi foruma dön de gençlere biraz motor bloğu nasıl çatlamaz onu anlat. 🔧😎
                        </p>
                        
                        <Link href="/forum" style={{ textDecoration: 'none' }}>
                            <button style={{
                                width: '100%', padding: '14px', borderRadius: '12px',
                                background: 'var(--primary)', color: 'white',
                                fontSize: '15px', fontWeight: '700', border: 'none',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(59,130,246,0.2)'
                            }}>
                                <ThumbsUp size={18} /> Aynen Öyle, Foruma Dön
                            </button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
            <Navbar />
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                <div style={{
                    maxWidth: '500px', width: '100%',
                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                    borderRadius: '24px', padding: '40px', textAlign: 'center'
                }}>
                    <div style={{ 
                        width: '80px', height: '80px', borderRadius: '50%', 
                        background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        margin: '0 auto 20px' 
                    }}>
                        <Wrench size={40} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px' }}>
                        Usta Başvurusu 🛠️
                    </h1>
                    <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                        Sanayi tozu yutmuş, motor sesinden arızayı anlayan ustalardansan doğru yerdesin. 
                        Başvuru formumuz çok yakında burada olacak!
                    </p>
                    
                    <button 
                        onClick={() => window.history.back()}
                        style={{
                            width: '100%', padding: '14px', borderRadius: '12px',
                            background: 'var(--secondary)', color: 'var(--foreground)',
                            border: '1px solid var(--card-border)',
                            fontSize: '15px', fontWeight: '600',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <ArrowLeft size={18} /> Geri Dön
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}
