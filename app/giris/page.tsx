"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Eye, EyeOff, ArrowRight, Shield, Zap, Users, ChevronRight } from "lucide-react";

export default function GirisPage() {
    const router = useRouter();
    const { login, loginWithGoogle, error: authError } = useAuth();
    const { theme } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => { setMounted(true); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const success = await login(email, password);

        if (success) {
            router.push("/");
        } else {
            setError(authError || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setIsLoading(true);
        const result = await loginWithGoogle();
        if (result.success) {
            if (result.isNewUser) {
                router.push("/profil-tamamla");
            } else {
                router.push("/");
            }
        } else {
            setIsLoading(false);
        }
    };

    const isDark = theme === 'dark';

    return (
        <>
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes floatCar {
                    0%, 100% { transform: translateY(0px) rotate(-2deg); }
                    50% { transform: translateY(-8px) rotate(0deg); }
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.95); opacity: 0.5; }
                    50% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(0.95); opacity: 0.5; }
                }
                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes roadLine {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-40px); }
                }
                .login-input {
                    width: 100%;
                    padding: 14px 16px 14px 48px;
                    background: var(--card-bg);
                    border: 2px solid var(--card-border);
                    border-radius: 14px;
                    color: var(--foreground);
                    font-size: 15px;
                    font-weight: 500;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: inherit;
                }
                .login-input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px var(--primary-glow);
                }
                .login-input::placeholder {
                    color: var(--text-muted);
                    font-weight: 400;
                }
                .login-btn {
                    width: 100%;
                    padding: 16px;
                    background: var(--primary);
                    border: none;
                    border-radius: 14px;
                    color: white;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: inherit;
                    position: relative;
                    overflow: hidden;
                }
                .login-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px var(--primary-glow);
                }
                .login-btn:active:not(:disabled) {
                    transform: translateY(0);
                }
                .login-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .social-btn {
                    width: 100%;
                    padding: 14px;
                    background: var(--card-bg);
                    border: 2px solid var(--card-border);
                    border-radius: 14px;
                    color: var(--foreground);
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.2s;
                    font-family: inherit;
                }
                .social-btn:hover {
                    border-color: var(--primary);
                    background: var(--hover-primary);
                    transform: translateY(-1px);
                }
                .feature-pill {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 20px;
                    border-radius: 16px;
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    transition: all 0.3s;
                }
                .feature-pill:hover {
                    border-color: var(--primary);
                    transform: translateX(4px);
                    box-shadow: 0 4px 20px var(--primary-glow);
                }
            `}</style>

            <div style={{
                minHeight: '100vh',
                background: 'var(--background)',
                display: 'flex',
                position: 'relative',
                overflow: 'hidden',
            }}>

                {/* LEFT PANEL — Brand / Illustration */}
                <div style={{
                    flex: '1 1 55%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '60px 80px',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: mounted ? 'slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                }}>
                    {/* Decorative gradient orbs */}
                    <div style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '-10%',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: isDark
                            ? 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(0,90,226,0.08) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-20%',
                        right: '-10%',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: isDark
                            ? 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Logo */}
                    <Link href="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none',
                        marginBottom: '60px',
                    }}>
                        <div style={{ position: 'relative', width: '36px', height: '36px' }}>
                            <Image
                                src={isDark ? "/dark_logo.svg" : "/whitemode_logo.svg"}
                                alt="Otosöz"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        <span style={{
                            fontSize: '18px',
                            fontWeight: '800',
                            color: 'var(--foreground)',
                            letterSpacing: '0.5px',
                        }}>
                            OTO SÖZ
                        </span>
                    </Link>

                    {/* Headline */}
                    <h1 style={{
                        fontSize: '52px',
                        fontWeight: '900',
                        lineHeight: 1.1,
                        color: 'var(--foreground)',
                        marginBottom: '20px',
                        maxWidth: '500px',
                        letterSpacing: '-1px',
                    }}>
                        Otomobil
                        <br />
                        <span style={{
                            background: isDark
                                ? 'var(--primary)'
                                : 'linear-gradient(135deg, #005ae2, #3b82f6, #22c55e)',
                            backgroundSize: '200% 200%',
                            animation: 'gradient-shift 4s ease infinite',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Tutkunlarının
                        </span>
                        <br />
                        Buluşma Noktası.
                    </h1>

                    <p style={{
                        fontSize: '17px',
                        color: 'var(--text-muted)',
                        lineHeight: 1.7,
                        marginBottom: '48px',
                        maxWidth: '440px',
                    }}>
                        Türkiye'nin en büyük otomobil topluluğuna katılın. Uzman görüşleri,
                        pazar analizleri ve binlerce tutkulu sürücüyle tanışın.
                    </p>

                    {/* Feature Pills */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '380px' }}>
                        {[
                            { icon: <Users size={20} />, title: '12.000+ Aktif Üye', desc: 'Canlı topluluk', color: isDark ? '#ff6b00' : '#005ae2' },
                            { icon: <Zap size={20} />, title: 'Anlık Piyasa Verileri', desc: 'Güncel fiyatlar', color: isDark ? '#00d4ff' : '#3b82f6' },
                            { icon: <Shield size={20} />, title: 'Güven Metresi', desc: 'Doğrulanmış ilanlar', color: isDark ? '#00ff88' : '#22c55e' },
                        ].map((f, i) => (
                            <div key={i} className="feature-pill" style={{
                                animation: mounted ? `fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.15}s both` : 'none',
                            }}>
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    background: `${f.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: f.color,
                                    flexShrink: 0,
                                }}>
                                    {f.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>{f.title}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Floating Car SVG */}
                    <div style={{
                        position: 'absolute',
                        bottom: '60px',
                        right: '60px',
                        opacity: 0.08,
                        animation: 'floatCar 6s ease-in-out infinite',
                        pointerEvents: 'none',
                    }}>
                        <svg width="280" height="140" viewBox="0 0 120 60" fill="none">
                            <path d="M20 40 L28 22 C30 18 36 14 44 14 L76 14 C84 14 90 18 92 22 L100 40 Z" fill="var(--foreground)" />
                            <path d="M38 22 L42 10 C44 6 50 4 60 4 C70 4 76 6 78 10 L82 22" fill="var(--foreground)" />
                            <rect x="16" y="40" width="88" height="10" rx="3" fill="var(--foreground)" />
                            <circle cx="36" cy="50" r="8" fill="var(--foreground)" />
                            <circle cx="84" cy="50" r="8" fill="var(--foreground)" />
                        </svg>
                    </div>
                </div>

                {/* RIGHT PANEL — Login Form */}
                <div style={{
                    flex: '1 1 45%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    position: 'relative',
                    animation: mounted ? 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                }}>
                    {/* Subtle border */}
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: '10%',
                        bottom: '10%',
                        width: '1px',
                        background: 'var(--card-border)',
                    }} />

                    <div style={{
                        width: '100%',
                        maxWidth: '420px',
                    }}>
                        {/* Form Header */}
                        <div style={{ marginBottom: '36px' }}>
                            <h2 style={{
                                fontSize: '28px',
                                fontWeight: '800',
                                color: 'var(--foreground)',
                                marginBottom: '8px',
                                letterSpacing: '-0.5px',
                            }}>
                                Giriş Yap
                            </h2>
                            <p style={{
                                fontSize: '15px',
                                color: 'var(--text-muted)',
                            }}>
                                Hesabınıza giriş yaparak devam edin
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{
                                marginBottom: '20px',
                                padding: '14px 16px',
                                background: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '12px',
                                color: '#EF4444',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                animation: 'fadeIn 0.3s ease',
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Google Button */}
                        <button className="social-btn" type="button" onClick={handleGoogleLogin} disabled={isLoading}>
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google ile devam et
                        </button>

                        {/* Divider */}
                        <div style={{
                            margin: '28px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
                            <span style={{
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                                fontWeight: '600',
                                letterSpacing: '1px',
                            }}>VEYA</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Username */}
                            <div>
                                <label htmlFor="email" style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    color: 'var(--foreground)',
                                    marginBottom: '8px',
                                    letterSpacing: '0.3px',
                                }}>
                                    E-posta Adresi
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: focusedField === 'email' ? 'var(--primary)' : 'var(--text-muted)',
                                        transition: 'color 0.3s',
                                        display: 'flex',
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        className="login-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ornek@email.com"
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <label htmlFor="password" style={{
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        color: 'var(--foreground)',
                                        letterSpacing: '0.3px',
                                    }}>
                                        Şifre
                                    </label>
                                    <Link href="#" style={{
                                        fontSize: '13px',
                                        color: 'var(--primary)',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        transition: 'opacity 0.2s',
                                    }}>
                                        Şifremi unuttum
                                    </Link>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: focusedField === 'password' ? 'var(--primary)' : 'var(--text-muted)',
                                        transition: 'color 0.3s',
                                        display: 'flex',
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="login-input"
                                        style={{ paddingRight: '48px' }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '14px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)',
                                            padding: 0,
                                            display: 'flex',
                                            transition: 'color 0.2s',
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                userSelect: 'none',
                            }}>
                                <div
                                    onClick={() => setRememberMe(!rememberMe)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '6px',
                                        border: `2px solid ${rememberMe ? 'var(--primary)' : 'var(--card-border)'}`,
                                        background: rememberMe ? 'var(--primary)' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s',
                                        flexShrink: 0,
                                    }}
                                >
                                    {rememberMe && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                                <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>
                                    Beni hatırla
                                </span>
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="login-btn"
                            >
                                {isLoading ? (
                                    <>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            border: '2.5px solid rgba(255,255,255,0.3)',
                                            borderTop: '2.5px solid white',
                                            borderRadius: '50%',
                                            animation: 'spin 0.8s linear infinite'
                                        }} />
                                        Giriş yapılıyor...
                                    </>
                                ) : (
                                    <>
                                        Giriş Yap
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div style={{
                            marginTop: '32px',
                            textAlign: 'center',
                            paddingTop: '28px',
                            borderTop: '1px solid var(--card-border)',
                        }}>
                            <p style={{
                                fontSize: '14px',
                                color: 'var(--text-muted)',
                            }}>
                                Hesabınız yok mu?{" "}
                                <Link href="/kayit" style={{
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    fontWeight: '700',
                                    transition: 'opacity 0.2s',
                                }}>
                                    Ücretsiz kayıt olun
                                    <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '2px' }} />
                                </Link>
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div style={{
                            marginTop: '32px',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '24px',
                            opacity: 0.5,
                        }}>
                            {['AES-256 Şifreleme', 'KVKK Uyumlu', 'SSL Korumalı'].map((badge, i) => (
                                <span key={i} style={{
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}>
                                    <Shield size={10} />
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
