"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Star, Shield, Zap, Crown, Construction, Wrench, HardHat } from "lucide-react";
import Link from "next/link";

export default function PremiumPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [popupStage, setPopupStage] = useState(0);

    const funnyMessages = [
        "🚧 Dur bakalım, acelen ne?",
        "👷 Ekibimiz şu an çay molasında...",
        "🔧 Vidaları sıkıyoruz, biraz sabır!",
        "🏗️ Premium sistemi inşa ediyoruz, kask tak!",
        "☕ Yazılımcımız 47. kahvesini içiyor...",
        "🐛 Son bug'ı kovalıyoruz, az kaldı!",
    ];

    useEffect(() => {
        if (showPopup) {
            const interval = setInterval(() => {
                setPopupStage(prev => (prev + 1) % funnyMessages.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [showPopup]);

    const handlePlanClick = (planName: string) => {
        setSelectedPlan(planName);
        setPopupStage(0);
        setShowPopup(true);
    };

    const plans = [
        {
            name: "Ücretsiz",
            price: "0",
            period: "ay",
            description: "OTO SÖZ dünyasına giriş yapmak isteyenler için.",
            features: [
                "Forum erişimi",
                "Temel 'Sürücü' rozeti",
                "Maksimum 3 aktif sohbet",
                "Topluluk desteği",
            ],
            icon: <Star className="w-6 h-6 text-gray-400" />,
            color: "from-gray-500 to-slate-500",
            buttonColor: "bg-gray-700 hover:bg-gray-600",
            popular: false
        },
        {
            name: "Pro",
            price: "99.99",
            period: "ay",
            description: "Otomobil tutkunları için ekstra özellikler ve avantajlar.",
            features: [
                "Gümüş 'Pro' kullanıcı rozeti",
                "Reklamsız deneyim",
                "Ayda 3 ücretsiz ilan öne çıkarma",
                "Geçmiş fiyat analizlerine erişim",
                "Öncelikli destek"
            ],
            icon: <Crown className="w-6 h-6 text-blue-400" />,
            color: "from-blue-500 to-indigo-500",
            buttonColor: "bg-blue-600 hover:bg-blue-700",
            popular: false
        },
        {
            name: "Kurumsal",
            price: "399.99",
            period: "ay",
            description: "Galeriler, ekspertizler ve işletmeler için profesyonel çözümler.",
            features: [
                "Onaylı 'Kurumsal' mağaza profili",
                "Sınırsız ilan yayınlama",
                "Maksimum 8 aktif sohbet",
                "Detaylı pazar analitiği",
                "7/24 Öncelikli destek"
            ],
            icon: <Shield className="w-6 h-6 text-emerald-400" />,
            color: "from-emerald-500 to-green-500",
            buttonColor: "bg-emerald-600 hover:bg-emerald-700",
            popular: true
        },
        {
            name: "Lüks Paket",
            price: "999.99",
            period: "ay",
            description: "Gerçek tutkunlar ve koleksiyonerler için sınırsız ayrıcalıklar.",
            features: [
                "Tüm Kurumsal özellikler",
                "Özel 'VIP' altın rozet",
                "Maksimum 20 aktif sohbet",
                "Etkinliklere VIP davetiye",
                "Özel içeriklere erken erişim",
                "Kişisel müşteri temsilcisi"
            ],
            icon: <Zap className="w-6 h-6 text-amber-400" />,
            color: "from-amber-500 to-orange-600",
            buttonColor: "bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90",
            popular: false
        }
    ];

    return (
        <div style={{ background: 'var(--background)', minHeight: '100vh', color: 'var(--foreground)' }}>
            <Navbar />

            <main style={{ padding: '80px 24px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <span style={{
                        padding: '6px 16px',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.12))',
                        color: '#A78BFA',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: '16px',
                        display: 'inline-block',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                        letterSpacing: '0.5px'
                    }}>
                        Otosöz Premium
                    </span>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: '800',
                        marginBottom: '16px',
                        background: 'linear-gradient(to right, var(--foreground), var(--text-muted))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Deneyiminizi Zirveye Taşıyın
                    </h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '18px' }}>
                        Size en uygun planı seçin, ayrıcalıkların dünyasına adım atın.
                        İster bireysel, ister kurumsal; her ihtiyaca özel çözümler.
                    </p>
                </div>

                {/* Plans Grid */}
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '32px',
                    alignItems: 'start'
                }}>
                    {plans.map((plan) => (
                        <div key={plan.name} style={{
                            background: 'var(--card-bg)',
                            border: plan.popular ? '2px solid var(--primary)' : '1px solid var(--card-border)',
                            borderRadius: '24px',
                            padding: '32px',
                            position: 'relative',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = `0 20px 40px -10px ${plan.popular ? 'rgba(255,107,0,0.2)' : 'rgba(0,0,0,0.5)'}`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'var(--primary)',
                                    padding: '4px 16px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: 'white'
                                }}>
                                    EN POPÜLER
                                </div>
                            )}

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'var(--secondary)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '16px'
                                }}>
                                    {plan.icon}
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                    {plan.name}
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', minHeight: '40px' }}>
                                    {plan.description}
                                </p>
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                    <span style={{ fontSize: '42px', fontWeight: '800', color: 'var(--foreground)' }}>{plan.price}</span>
                                    <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>TL / {plan.period}</span>
                                </div>
                            </div>

                            <ul style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {plan.features.map((feature, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--foreground)', fontSize: '14px' }}>
                                        <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '2px', borderRadius: '50%' }}>
                                            <Check size={14} color="#22c55e" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                background: plan.popular ? 'var(--primary)' : 'var(--foreground)',
                                color: plan.popular ? 'white' : 'var(--background)',
                                border: 'none',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '15px'
                            }}
                                onClick={() => handlePlanClick(plan.name)}
                                onMouseEnter={(e) => {
                                    if (!plan.popular) e.currentTarget.style.opacity = '0.8';
                                }}
                                onMouseLeave={(e) => {
                                    if (!plan.popular) e.currentTarget.style.opacity = '1';
                                }}
                            >
                                Hemen Başla
                            </button>
                        </div>
                    ))}
                </div>

                {/* FAQ / Bottom Section */}
                <div style={{ textAlign: 'center', marginTop: '80px', color: 'var(--text-muted)' }}>
                    <p>Kurumsal çoklu alımlar için özel teklif ister misiniz? <a href="/iletisim" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Bizimle iletişime geçin.</a></p>
                </div>

                {/* Funny Popup */}
                {showPopup && (
                    <div
                        onClick={() => setShowPopup(false)}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', zIndex: 9999,
                            animation: 'fadeIn 0.3s ease'
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'var(--card-bg)', border: '2px solid var(--primary)',
                                borderRadius: '28px', padding: '48px 40px', maxWidth: '480px',
                                width: '90%', textAlign: 'center', position: 'relative',
                                animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                        >
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%',
                                background: 'rgba(255,107,0,0.1)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 24px', animation: 'wobble 2s ease-in-out infinite'
                            }}>
                                <Construction size={40} color="var(--primary)" />
                            </div>

                            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px', color: 'var(--foreground)' }}>
                                Yapım Aşamasında! 🏗️
                            </h2>
                            <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>
                                &quot;{selectedPlan}&quot; planı seçtiniz
                            </p>

                            <div style={{
                                background: 'var(--secondary)', borderRadius: '16px',
                                padding: '20px', marginBottom: '24px', minHeight: '60px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.5s ease'
                            }}>
                                <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--foreground)', margin: 0 }}>
                                    {funnyMessages[popupStage]}
                                </p>
                            </div>

                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '28px' }}>
                                Premium üyelik sistemi üzerinde çalışmalarımız tüm hızıyla devam ediyor.
                                Çok yakında burada olacak! Sabırsızlanıyoruz! 🚀
                            </p>

                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
                                {[0,1,2,3].map(i => (
                                    <div key={i} style={{
                                        width: '12px', height: '12px', borderRadius: '50%',
                                        background: 'var(--primary)',
                                        animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`
                                    }} />
                                ))}
                            </div>

                            <button
                                onClick={() => setShowPopup(false)}
                                style={{
                                    padding: '14px 40px', borderRadius: '14px',
                                    background: 'var(--primary)', color: 'white',
                                    border: 'none', fontWeight: '700', fontSize: '15px',
                                    cursor: 'pointer', transition: 'transform 0.2s, opacity 0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                Tamam, Bekliyorum 😄
                            </button>
                        </div>
                    </div>
                )}

                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes popIn {
                        from { opacity: 0; transform: scale(0.5) rotate(-5deg); }
                        to { opacity: 1; transform: scale(1) rotate(0deg); }
                    }
                    @keyframes wobble {
                        0%, 100% { transform: rotate(0deg); }
                        25% { transform: rotate(-10deg); }
                        75% { transform: rotate(10deg); }
                    }
                    @keyframes bounce {
                        0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
                        40% { transform: scale(1); opacity: 1; }
                    }
                `}</style>
            </main>

            <Footer />
        </div>
    );
}
