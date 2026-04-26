"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, ArrowLeft, ShieldCheck, ThumbsUp, Mail, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UzmanOlPage() {
    const { user, isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || isLoading) {
        return <div style={{ minHeight: '100vh', background: 'var(--background)' }} />;
    }

    // Eğer zaten uzmansa komik bir mesaj ver (Burada admin/moderator/usta vs hepsi için geçerli yapalım)
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
                            background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            margin: '0 auto 20px' 
                        }}>
                            <ShieldCheck size={40} />
                        </div>
                        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px' }}>
                            Aman Hocam, Zaten Uzmansın! 🎓
                        </h1>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                            Senin tecrübelerine paha biçilemez! OtoAsfalt topluluğunun aydınlık yüzü olarak foruma dönüp insanların sorularını aydınlatmaya devam etmeye ne dersin? 🌟🚗
                        </p>
                        
                        <Link href="/uzmana-sor" style={{ textDecoration: 'none' }}>
                            <button style={{
                                width: '100%', padding: '14px', borderRadius: '12px',
                                background: '#10b981', color: 'white',
                                fontSize: '15px', fontWeight: '700', border: 'none',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
                            }}>
                                <ThumbsUp size={18} /> Uzmana Sor'a Dön
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
                        background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        margin: '0 auto 20px' 
                    }}>
                        <Briefcase size={40} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px' }}>
                        Uzman Başvurusu 🎓
                    </h1>
                    <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                        Otomotiv dünyasındaki tecrübelerinle topluluğumuza ışık tutmak istiyorsan, doğru adrestesin. 
                        Aşağıdaki belgeleri bize e-posta yoluyla ileterek <strong style={{ color: '#eab308' }}>Onaylı Uzman</strong> rozetine sahip olabilirsin.
                    </p>

                    <div style={{ textAlign: 'left', background: 'var(--secondary)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={18} color="#eab308" /> Gerekli Belgeler
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                Ad Soyad ve OtoSöz Kullanıcı Adınız
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                Uzmanlık Alanınız (Mekanik, Kaporta, Ekspertiz, Yazılım vb.)
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span>
                                    <strong>Uzmanlığı Kanıtlayıcı Belge:</strong> Ustalık Belgesi, Mesleki Yeterlilik (MYK) Belgesi, İşyeri Vergi Levhası veya TSE Hizmet Yeterlilik (Ekspertiz) Belgesi vb.
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.3)', background: 'rgba(234, 179, 8, 0.05)', marginBottom: '24px' }}>
                        <p style={{ fontSize: '14px', color: 'var(--foreground)', marginBottom: '12px' }}>
                            Başvurunuzu aşağıdaki e-posta adresine <strong>"OtoSöz Uzman Başvurusu"</strong> başlığı ile iletebilirsiniz.
                        </p>
                        <a href="mailto:iletisim@otosoz.com?subject=OtoSöz Uzman Başvurusu" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '12px 20px', borderRadius: '8px',
                            background: '#eab308', color: 'white', textDecoration: 'none',
                            fontSize: '15px', fontWeight: '700', transition: 'all 0.2s',
                        }}>
                            <Mail size={18} /> iletisim@otosoz.com
                        </a>
                    </div>
                    
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
