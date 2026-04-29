"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, ArrowRight, CheckCircle, Shield, Sparkles, Trophy, MessageCircle, ChevronRight, Star, AlertCircle, Loader2, Info } from "lucide-react";
import { validateUsername, sanitizeUsername, USERNAME_RULES, getUsernameRulesText } from "@/lib/usernameValidation";

export default function KayitPage() {
    const { theme } = useTheme();
    const { register, loginWithGoogle, checkUsernameAvailability, error: authError } = useAuth();
    const router = useRouter();
    const isDark = theme === 'dark';
    const [mounted, setMounted] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // 81 il listesi
    const SEHIR_LISTESI = [
        "Adana","Adıyaman","Afyon","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir",
        "Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli",
        "Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari",
        "Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir",
        "Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir",
        "Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat",
        "Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman",
        "Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce"
    ];

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        city: "İstanbul",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [success, setSuccess] = useState(false);
    const [registerError, setRegisterError] = useState("");

    useEffect(() => { setMounted(true); }, []);

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Username benzersizlik kontrolü
    const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [showUsernameRules, setShowUsernameRules] = useState(false);
    const usernameCheckTimeout = useRef<NodeJS.Timeout | null>(null);

    const checkUsernameDebounced = useCallback(async (value: string) => {
        const validation = validateUsername(value);
        if (!validation.isValid) {
            setUsernameStatus("invalid");
            setUsernameMessage(validation.message);
            return;
        }
        setUsernameStatus("checking");
        setUsernameMessage("Kontrol ediliyor...");
        const isAvailable = await checkUsernameAvailability(value.trim().toLowerCase());
        if (isAvailable) {
            setUsernameStatus("available");
            setUsernameMessage("✓ Bu kullanıcı adı uygun");
        } else {
            setUsernameStatus("taken");
            setUsernameMessage("Bu kullanıcı adı zaten alınmış");
        }
    }, [checkUsernameAvailability]);

    const handleUsernameChange = (value: string) => {
        const sanitized = sanitizeUsername(value);
        updateField("username", sanitized);

        // Anlık format doğrulama
        if (sanitized.length === 0) {
            setUsernameStatus("idle");
            setUsernameMessage("");
        } else {
            const validation = validateUsername(sanitized);
            if (!validation.isValid) {
                setUsernameStatus("invalid");
                setUsernameMessage(validation.message);
            } else {
                setUsernameStatus("idle");
                setUsernameMessage("");
            }
        }

        // Debounce — 500ms sonra Firestore kontrol
        if (usernameCheckTimeout.current) {
            clearTimeout(usernameCheckTimeout.current);
        }
        const validation = validateUsername(sanitized);
        if (validation.isValid) {
            usernameCheckTimeout.current = setTimeout(() => {
                checkUsernameDebounced(sanitized);
            }, 500);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setRegisterError("");

        const result = await register(formData.email, formData.password, formData.username, formData.city);

        if (result) {
            setIsLoading(false);
            setSuccess(true);
        } else {
            setRegisterError(authError || "Kayıt sırasında bir hata oluştu.");
            setIsLoading(false);
        }
    };

        const handleGoogleRegister = async () => {
        if (!acceptTerms) {
            setRegisterError("Devam etmek için Gizlilik Politikası ve Kullanım Koşullarını kabul etmelisiniz.");
            return;
        }
        setIsLoading(true);
        setRegisterError("");
        const result = await loginWithGoogle();
        if (result.success) {
            router.push("/profil-tamamla");
        } else {
            setIsLoading(false);
        }
    };

    const passwordStrength = () => {
        const pass = formData.password;
        if (!pass) return { level: 0, text: "", color: "" };
        if (pass.length < 6) return { level: 1, text: "Zayıf", color: "#EF4444" };
        if (pass.length < 8) return { level: 2, text: "Orta", color: "#F59E0B" };
        if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
            return { level: 4, text: "Güçlü", color: "#22C55E" };
        }
        return { level: 3, text: "İyi", color: "#3B82F6" };
    };

    const strength = passwordStrength();
    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
    const passwordsDontMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;

    const canProceedStep1 = formData.username.length >= USERNAME_RULES.MIN_LENGTH && formData.email.includes('@') && formData.city.length > 0 && acceptTerms && usernameStatus === "available";
    const canProceedStep2 = formData.password.length >= 6 && passwordsMatch;

    // Success Screen
    if (success) {
        return (
            <>
                <style jsx>{`
                    @keyframes successPop {
                        0% { transform: scale(0); opacity: 0; }
                        50% { transform: scale(1.2); }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes confetti {
                        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                        100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(16px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
                <div style={{
                    minHeight: '100vh',
                    background: 'var(--background)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Confetti particles */}
                    {[...Array(20)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            top: '-20px',
                            left: `${5 + (i * 4.5)}%`,
                            width: `${6 + (i % 3) * 4}px`,
                            height: `${6 + (i % 3) * 4}px`,
                            borderRadius: i % 2 === 0 ? '50%' : '2px',
                            background: ['#ff6b00', '#005ae2', '#22c55e', '#f59e0b', '#00d4ff', '#ff4444'][i % 6],
                            animation: `confetti ${2 + (i % 3)}s ease-in ${i * 0.1}s forwards`,
                            opacity: 0.8,
                        }} />
                    ))}

                    <div style={{ textAlign: 'center', maxWidth: '460px', padding: '40px', position: 'relative', zIndex: 1 }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 32px',
                            boxShadow: '0 12px 40px rgba(34, 197, 94, 0.3)',
                            animation: 'successPop 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}>
                            <CheckCircle size={48} color="white" />
                        </div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '900',
                            color: 'var(--foreground)',
                            marginBottom: '16px',
                            letterSpacing: '-0.5px',
                            animation: 'fadeIn 0.6s ease 0.3s both',
                        }}>
                            Harika, Hoş Geldiniz! 🎉
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: 'var(--text-muted)',
                            marginBottom: '40px',
                            lineHeight: 1.6,
                            animation: 'fadeIn 0.6s ease 0.5s both',
                        }}>
                            Hesabınız başarıyla oluşturuldu ve giriş yapıldı.<br />
                            Otosöz dünyasını keşfetmeye hazırsınız!
                        </p>
                        <Link href="/profil-tamamla" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '16px 40px',
                            background: 'var(--primary)',
                            color: 'white',
                            borderRadius: '14px',
                            fontSize: '16px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 8px 25px var(--primary-glow)',
                            animation: 'fadeIn 0.6s ease 0.7s both',
                        }}>
                            Keşfetmeye Başla <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </>
        );
    }

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
                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 0 0 var(--primary-glow); }
                    50% { box-shadow: 0 0 0 12px transparent; }
                }
                @keyframes stepSlide {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .reg-input {
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
                .reg-input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px var(--primary-glow);
                }
                .reg-input::placeholder {
                    color: var(--text-muted);
                    font-weight: 400;
                }
                .reg-btn {
                    width: 100%;
                    padding: 16px;
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
                .reg-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px var(--primary-glow);
                }
                .reg-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none !important;
                    box-shadow: none !important;
                }
                .social-btn-reg {
                    flex: 1;
                    padding: 14px;
                    background: var(--card-bg);
                    border: 2px solid var(--card-border);
                    border-radius: 14px;
                    color: var(--foreground);
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.2s;
                    font-family: inherit;
                }
                .social-btn-reg:hover {
                    border-color: var(--primary);
                    background: var(--hover-primary);
                    transform: translateY(-1px);
                }
                .testimonial-card {
                    padding: 20px;
                    border-radius: 16px;
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    transition: all 0.3s;
                }
                .testimonial-card:hover {
                    border-color: var(--primary);
                    transform: translateY(-4px);
                    box-shadow: 0 8px 30px var(--primary-glow);
                }
            `}</style>

            <div style={{
                minHeight: '100vh',
                background: 'var(--background)',
                display: 'flex',
                position: 'relative',
                overflow: 'hidden',
            }}>

                {/* LEFT PANEL — Social Proof & Brand */}
                <div style={{
                    flex: '1 1 52%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '60px 70px',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: mounted ? 'slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                }}>
                    {/* Gradient orbs */}
                    <div style={{
                        position: 'absolute',
                        top: '-15%',
                        right: '-5%',
                        width: '450px',
                        height: '450px',
                        borderRadius: '50%',
                        background: isDark
                            ? 'radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(0,90,226,0.06) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-10%',
                        left: '-5%',
                        width: '350px',
                        height: '350px',
                        borderRadius: '50%',
                        background: isDark
                            ? 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Logo */}
                    <Link href="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none',
                        marginBottom: '48px',
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
                    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            background: isDark ? 'rgba(255,107,0,0.12)' : 'rgba(0,90,226,0.08)',
                            color: 'var(--primary)',
                            fontSize: '12px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}>
                            <Sparkles size={13} /> Ücretsiz Kayıt
                        </div>
                    </div>

                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: '900',
                        lineHeight: 1.1,
                        color: 'var(--foreground)',
                        marginBottom: '20px',
                        maxWidth: '480px',
                        letterSpacing: '-1px',
                    }}>
                        Topluluğa{' '}
                        <span style={{
                            background: isDark
                                ? 'var(--primary)'
                                : 'linear-gradient(135deg, #005ae2, #3b82f6, #22c55e)',
                            backgroundSize: '200% 200%',
                            animation: 'gradient-shift 4s ease infinite',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Katılın
                        </span>
                        ,
                        <br />
                        Fark Yaratın.
                    </h1>

                    <p style={{
                        fontSize: '16px',
                        color: 'var(--text-muted)',
                        lineHeight: 1.7,
                        marginBottom: '40px',
                        maxWidth: '420px',
                    }}>
                        12.000'den fazla otomobil tutkunu tarafından güvenilen platformumuza
                        30 saniyede Ücretsiz katılın.
                    </p>

                    {/* Testimonials */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '420px' }}>
                        {[
                            { name: "Mehmet K.", role: "BMW Tutkunu", text: "Otosöz sayesinde aracımı aldım. Güven Metre harika!", stars: 5, avatar: "M" },
                            { name: "Ayşe Y.", role: "Tesla Sahibi", text: "Topluluk desteği inanılmaz. Her soruma anında cevap!", stars: 5, avatar: "A" },
                        ].map((t, i) => (
                            <div key={i} className="testimonial-card" style={{
                                animation: mounted ? `fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.2}s both` : 'none',
                            }}>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                                    {[...Array(t.stars)].map((_, s) => (
                                        <Star key={s} size={14} fill={isDark ? '#ff6b00' : '#f59e0b'} color={isDark ? '#ff6b00' : '#f59e0b'} />
                                    ))}
                                </div>
                                <p style={{ fontSize: '14px', color: 'var(--foreground)', lineHeight: 1.5, marginBottom: '12px', fontWeight: '500' }}>
                                    "{t.text}"
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                    }}>{t.avatar}</div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>{t.name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Social proof counter */}
                    <div style={{
                        marginTop: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        animation: mounted ? 'fadeIn 0.6s ease 0.8s both' : 'none',
                    }}>
                        <div style={{ display: 'flex' }}>
                            {['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'].map((c, i) => (
                                <div key={i} style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: c,
                                    border: '2px solid var(--background)',
                                    marginLeft: i > 0 ? '-8px' : 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '10px',
                                    fontWeight: '700',
                                }}>
                                    {['M', 'A', 'O', 'K'][i]}
                                </div>
                            ))}
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            <strong style={{ color: 'var(--foreground)' }}>+2.341</strong> kişi bugün katıldı
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL — Registration Form */}
                <div style={{
                    flex: '1 1 48%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    position: 'relative',
                    animation: mounted ? 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                }}>
                    {/* Subtle divider */}
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: '10%',
                        bottom: '10%',
                        width: '1px',
                        background: 'var(--card-border)',
                    }} />

                    <div style={{ width: '100%', maxWidth: '440px' }}>
                        {/* Step Indicator */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '32px',
                        }}>
                            {[1, 2].map((step) => (
                                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: step === 2 ? 'none' : 1 }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: currentStep >= step ? 'var(--primary)' : 'var(--card-bg)',
                                        border: `2px solid ${currentStep >= step ? 'var(--primary)' : 'var(--card-border)'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: currentStep >= step ? 'white' : 'var(--text-muted)',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        transition: 'all 0.4s',
                                        flexShrink: 0,
                                    }}>
                                        {currentStep > step ? <CheckCircle size={16} /> : step}
                                    </div>
                                    {step === 1 && (
                                        <div style={{
                                            flex: 1,
                                            height: '2px',
                                            borderRadius: '1px',
                                            background: currentStep > 1 ? 'var(--primary)' : 'var(--card-border)',
                                            transition: 'all 0.4s',
                                        }} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Form Header */}
                        <div style={{ marginBottom: '28px' }}>
                            <h2 style={{
                                fontSize: '28px',
                                fontWeight: '800',
                                color: 'var(--foreground)',
                                marginBottom: '8px',
                                letterSpacing: '-0.5px',
                            }}>
                                {currentStep === 1 ? 'Hesap Oluştur' : 'Güvenlik'}
                            </h2>
                            <p style={{
                                fontSize: '15px',
                                color: 'var(--text-muted)',
                            }}>
                                {currentStep === 1 ? 'Bilgilerinizi girerek başlayın' : 'Hesabınızı güvenli hale getirin'}
                            </p>
                        </div>

                        {/* Google/Apple Auth */}
                        {currentStep === 1 && (
                            <>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                                    <button className="social-btn-reg" type="button" onClick={handleGoogleRegister} disabled={isLoading}>
                                        <svg width="18" height="18" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google
                                    </button>
                                    <button className="social-btn-reg" type="button">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--foreground)">
                                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                        </svg>
                                        Apple
                                    </button>
                                </div>

                                <div style={{
                                    margin: '0 0 24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                }}>
                                    <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '1px' }}>VEYA</span>
                                    <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
                                </div>
                            </>
                        )}

                        {/* Step 1: Username + Email */}
                        {currentStep === 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'stepSlide 0.4s ease' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>
                                            Kullanıcı Adı
                                        </label>
                                        <span style={{
                                            fontSize: '11px',
                                            color: formData.username.length > USERNAME_RULES.MAX_LENGTH ? '#EF4444' : 'var(--text-muted)',
                                            fontWeight: '500',
                                            fontVariantNumeric: 'tabular-nums',
                                        }}>
                                            {formData.username.length}/{USERNAME_RULES.MAX_LENGTH}
                                        </span>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                                            color: focusedField === 'username' ? 'var(--primary)' : 'var(--text-muted)',
                                            transition: 'color 0.3s', display: 'flex',
                                        }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <input className="reg-input" type="text" value={formData.username}
                                            onChange={(e) => handleUsernameChange(e.target.value)}
                                            placeholder="kullanici_adi"
                                            maxLength={USERNAME_RULES.MAX_LENGTH}
                                            onFocus={() => { setFocusedField('username'); setShowUsernameRules(true); }}
                                            onBlur={() => { setFocusedField(null); setTimeout(() => setShowUsernameRules(false), 200); }}
                                            required
                                            style={{
                                                borderColor: (usernameStatus === 'taken' || usernameStatus === 'invalid') ? '#EF4444' : usernameStatus === 'available' ? '#22c55e' : undefined,
                                            }}
                                        />
                                        {usernameStatus === 'checking' && (
                                            <Loader2 size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', animation: 'spin 0.8s linear infinite' }} />
                                        )}
                                        {usernameStatus === 'available' && (
                                            <CheckCircle size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#22c55e' }} />
                                        )}
                                        {(usernameStatus === 'taken' || usernameStatus === 'invalid') && formData.username.length > 0 && (
                                            <AlertCircle size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#EF4444' }} />
                                        )}
                                    </div>
                                    {/* Mesaj alanı */}
                                    {usernameMessage ? (
                                        <p style={{
                                            fontSize: '11px',
                                            color: usernameStatus === 'available' ? '#22c55e' : '#EF4444',
                                            marginTop: '6px', marginLeft: '2px',
                                            fontWeight: '600',
                                        }}>
                                            {usernameMessage}
                                        </p>
                                    ) : (
                                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', marginLeft: '2px' }}>
                                            {USERNAME_RULES.MIN_LENGTH}–{USERNAME_RULES.MAX_LENGTH} karakter, harf ile başlamalı
                                        </p>
                                    )}
                                    {/* Kural listesi */}
                                    {showUsernameRules && (
                                        <div style={{
                                            marginTop: '8px',
                                            padding: '10px 14px',
                                            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '10px',
                                            animation: 'fadeIn 0.2s ease',
                                        }}>
                                            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Info size={12} /> Kullanıcı Adı Kuralları
                                            </p>
                                            {getUsernameRulesText().map((rule, i) => {
                                                const validation = validateUsername(formData.username);
                                                const isPassing = formData.username.length > 0 && !validation.errors.some(e => rule.toLowerCase().includes(e.toLowerCase().slice(0, 10)));
                                                return (
                                                    <div key={i} style={{
                                                        fontSize: '11px',
                                                        color: formData.username.length === 0 ? 'var(--text-muted)' : isPassing ? '#22c55e' : 'var(--text-muted)',
                                                        display: 'flex', alignItems: 'center', gap: '6px',
                                                        padding: '2px 0',
                                                    }}>
                                                        <span style={{ fontSize: '10px' }}>{formData.username.length === 0 ? '○' : isPassing ? '✓' : '○'}</span>
                                                        {rule}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                        E-posta Adresi
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                                            color: focusedField === 'email' ? 'var(--primary)' : 'var(--text-muted)',
                                            transition: 'color 0.3s', display: 'flex',
                                        }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            </svg>
                                        </div>
                                        <input className="reg-input" type="email" value={formData.email}
                                            onChange={(e) => updateField("email", e.target.value)}
                                            placeholder="ornek@email.com"
                                            onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} required
                                        />
                                        {formData.email.includes('@') && formData.email.includes('.') && (
                                            <CheckCircle size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#22c55e' }} />
                                        )}
                                    </div>
                                </div>

                                {/* Şehir Seçimi */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                        Şehriniz
                                        <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--text-muted)', marginLeft: '6px' }}>
                                            (Yakıt fiyatları için)
                                        </span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                                            color: focusedField === 'city' ? 'var(--primary)' : 'var(--text-muted)',
                                            transition: 'color 0.3s', display: 'flex', pointerEvents: 'none', zIndex: 1,
                                        }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <select
                                            className="reg-input"
                                            value={formData.city}
                                            onChange={(e) => updateField("city", e.target.value)}
                                            onFocus={() => setFocusedField('city')}
                                            onBlur={() => setFocusedField(null)}
                                            style={{ appearance: 'none', cursor: 'pointer', paddingRight: '40px' }}
                                        >
                                            {SEHIR_LISTESI.sort().map((sehir) => (
                                                <option key={sehir} value={sehir}>{sehir}</option>
                                            ))}
                                        </select>
                                        <div style={{
                                            position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                            pointerEvents: 'none', color: 'var(--text-muted)',
                                        }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms */}
                                <div style={{
                                    padding: '16px',
                                    background: isDark ? 'rgba(255,107,0,0.06)' : 'rgba(0,90,226,0.04)',
                                    border: `1px solid ${isDark ? 'rgba(255,107,0,0.15)' : 'rgba(0,90,226,0.1)'}`,
                                    borderRadius: '14px',
                                }}>
                                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', userSelect: 'none' }}>
                                        <div
                                            onClick={() => setAcceptTerms(!acceptTerms)}
                                            style={{
                                                width: '22px', height: '22px', borderRadius: '7px',
                                                border: `2px solid ${acceptTerms ? 'var(--primary)' : 'var(--card-border)'}`,
                                                background: acceptTerms ? 'var(--primary)' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all 0.2s', flexShrink: 0, marginTop: '1px',
                                            }}
                                        >
                                            {acceptTerms && (
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                        </div>
                                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                            <Link href="/kullanim-sartlari" target="_blank" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>
                                                Kullanım Şartlarını
                                            </Link>
                                            {" "}ve{" "}
                                            <Link href="/gizlilik-politikasi" target="_blank" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>
                                                Gizlilik Politikasını
                                            </Link>
                                            {" "}okudum ve kabul ediyorum.
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="button"
                                    className="reg-btn"
                                    disabled={!canProceedStep1}
                                    onClick={() => setCurrentStep(2)}
                                    style={{ background: 'var(--primary)', marginTop: '8px' }}
                                >
                                    Devam Et <ArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* Step 2: Password + Terms */}
                        {currentStep === 2 && (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'stepSlide 0.4s ease' }}>
                                {/* Back button */}
                                <button type="button" onClick={() => setCurrentStep(1)} style={{
                                    background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px',
                                    color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                                    padding: 0, marginBottom: '4px', fontFamily: 'inherit',
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                    Geri dön
                                </button>

                                {/* Password */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                        Şifre
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                                            color: focusedField === 'password' ? 'var(--primary)' : 'var(--text-muted)',
                                            transition: 'color 0.3s', display: 'flex',
                                        }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                        </div>
                                        <input className="reg-input" style={{ paddingRight: '48px' }}
                                            type={showPassword ? "text" : "password"} value={formData.password}
                                            onChange={(e) => updateField("password", e.target.value)} placeholder="Minimum 6 karakter"
                                            onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} required
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                                            position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex',
                                        }}>
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {/* Strength bar */}
                                    {formData.password && (
                                        <div style={{ marginTop: '10px' }}>
                                            <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                                                {[1, 2, 3, 4].map((level) => (
                                                    <div key={level} style={{
                                                        flex: 1, height: '4px', borderRadius: '2px',
                                                        background: level <= strength.level ? strength.color : 'var(--card-border)',
                                                        transition: 'all 0.3s',
                                                    }} />
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Şifre Gücü</span>
                                                <span style={{ fontSize: '12px', fontWeight: '700', color: strength.color }}>{strength.text}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                        Şifre Tekrar
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                                            color: focusedField === 'confirmPassword' ? 'var(--primary)' : 'var(--text-muted)',
                                            transition: 'color 0.3s', display: 'flex',
                                        }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                        </div>
                                        <input className="reg-input"
                                            style={{
                                                paddingRight: '48px',
                                                borderColor: passwordsDontMatch ? '#EF4444' : undefined,
                                            }}
                                            type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword}
                                            onChange={(e) => updateField("confirmPassword", e.target.value)} placeholder="Şifrenizi tekrarlayın"
                                            onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)} required
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{
                                            position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex',
                                        }}>
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {passwordsDontMatch && (
                                        <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                                            Şifreler eşleşmiyor
                                        </p>
                                    )}
                                    {passwordsMatch && (
                                        <p style={{ fontSize: '12px', color: '#22c55e', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <CheckCircle size={14} /> Şifreler eşleşiyor
                                        </p>
                                    )}
                                </div>

                                {/* Error */}
                                {registerError && (
                                    <div style={{
                                        padding: '14px 16px',
                                        background: 'rgba(239, 68, 68, 0.08)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        borderRadius: '12px',
                                        color: '#EF4444',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                        {registerError}
                                    </div>
                                )}

                                {/* Submit */}
                                <button type="submit" className="reg-btn" disabled={isLoading || !canProceedStep2}
                                    style={{ background: 'var(--primary)' }}
                                >
                                    {isLoading ? (
                                        <>
                                            <div style={{
                                                width: '20px', height: '20px',
                                                border: '2.5px solid rgba(255,255,255,0.3)', borderTop: '2.5px solid white',
                                                borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                                            }} />
                                            Hesap oluşturuluyor...
                                        </>
                                    ) : (
                                        <>
                                            Hesap Oluştur <Sparkles size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Login Link */}
                        <div style={{
                            marginTop: '28px',
                            textAlign: 'center',
                            paddingTop: '24px',
                            borderTop: '1px solid var(--card-border)',
                        }}>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                Zaten hesabınız var mı?{" "}
                                <Link href="/giris" style={{
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    fontWeight: '700',
                                }}>
                                    Giriş yapın
                                    <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '2px' }} />
                                </Link>
                            </p>
                        </div>

                        {/* Trust */}
                        <div style={{
                            marginTop: '24px',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '20px',
                            opacity: 0.5,
                        }}>
                            {['AES-256', 'KVKK', 'SSL'].map((badge, i) => (
                                <span key={i} style={{
                                    fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600',
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                }}>
                                    <Shield size={10} /> {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
