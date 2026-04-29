"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { User, MapPin, Sparkles, CheckCircle, ChevronDown, AlertCircle, Loader2, Info } from "lucide-react";
import Image from "next/image";
import { validateUsername, sanitizeUsername, USERNAME_RULES, getUsernameRulesText } from "@/lib/usernameValidation";

const CITIES = [
    "Adana", "Adiyaman", "Afyonkarahisar", "Agri", "Aksaray", "Amasya", "Ankara", "Antalya",
    "Ardahan", "Artvin", "Aydin", "Balikesir", "Bartin", "Batman", "Bayburt", "Bilecik",
    "Bingol", "Bitlis", "Bolu", "Burdur", "Bursa", "Canakkale", "Cankiri", "Corum",
    "Denizli", "Diyarbakir", "Duzce", "Edirne", "Elazig", "Erzincan", "Erzurum", "Eskisehir",
    "Gaziantep", "Giresun", "Gumushane", "Hakkari", "Hatay", "Igdir", "Isparta", "Istanbul",
    "Izmir", "Kahramanmaras", "Karabuk", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kilis",
    "Kirikkale", "Kirklareli", "Kirsehir", "Kocaeli", "Konya", "Kutahya", "Malatya", "Manisa",
    "Mardin", "Mersin", "Mugla", "Mus", "Nevsehir", "Nigde", "Ordu", "Osmaniye",
    "Rize", "Sakarya", "Samsun", "Sanliurfa", "Siirt", "Sinop", "Sirnak", "Sivas",
    "Tekirdag", "Tokat", "Trabzon", "Tunceli", "Usak", "Van", "Yalova", "Yozgat", "Zonguldak"
];

export default function ProfilTamamlaPage() {
    const { theme } = useTheme();
    const { user, completeProfile, checkUsernameAvailability, needsProfileCompletion, isLoading: authLoading, error: authError } = useAuth();
    const router = useRouter();
    const isDark = theme === "dark";
    const [mounted, setMounted] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [city, setCity] = useState("Istanbul");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Username benzersizlik kontrol state'leri
    const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
    const [usernameMessage, setUsernameMessage] = useState("");
    const usernameCheckTimeout = useRef<NodeJS.Timeout | null>(null);
    const usernameTouched = useRef(false);
    const initialUsernameSet = useRef(false);
    const [showRules, setShowRules] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Eger profil tamamsa veya kullanici yoksa yonlendir
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/giris");
        }
        if (!authLoading && user && !needsProfileCompletion) {
            router.push("/");
        }
    }, [authLoading, user, needsProfileCompletion, router]);

    // Google'dan gelen isim bilgisini otomatik doldur — sadece 1 kere
    useEffect(() => {
        if (user && !initialUsernameSet.current) {
            const nameParts = (user.name || "").split(" ");
            if (nameParts.length >= 2 && !firstName && !lastName) {
                setFirstName(nameParts[0]);
                setLastName(nameParts.slice(1).join(" "));
            } else if (nameParts.length === 1 && !firstName) {
                setFirstName(nameParts[0]);
            }
            if (user.email) {
                const autoUsername = sanitizeUsername(user.email.split("@")[0]);
                setUsername(autoUsername);
            }
            initialUsernameSet.current = true;
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    // Username değiştiğinde debounce ile benzersizlik kontrolü
    const checkUsername = useCallback(async (value: string) => {
        // Önce format doğrulaması
        const validation = validateUsername(value);
        if (!validation.isValid) {
            setUsernameStatus("invalid");
            setUsernameMessage(validation.message);
            return;
        }
        // Format geçerli — Firestore'dan benzersizlik kontrol et
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
        setUsername(sanitized);
        usernameTouched.current = true;

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
                checkUsername(sanitized);
            }, 500);
        }
    };

    const canSubmit = firstName.trim().length >= 2 && lastName.trim().length >= 2 && username.trim().length >= USERNAME_RULES.MIN_LENGTH && city && usernameStatus === "available";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setIsLoading(true);
        setError("");

        const result = await completeProfile({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            username: username.trim().toLowerCase(),
            city,
        });

        if (result) {
            setSuccess(true);
            setTimeout(() => router.push("/"), 2000);
        } else {
            setError(authError || "Bu kullanıcı adı zaten alınmış veya bir hata oluştu. Lütfen farklı bir kullanıcı adı deneyin.");
            setIsLoading(false);
        }
    };

    if (!mounted || authLoading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
                <div style={{ width: 40, height: 40, border: "3px solid var(--card-border)", borderTop: "3px solid var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
        );
    }

    if (success) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--background)",
                flexDirection: "column",
                gap: "20px",
            }}>
                <div style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    animation: "scaleIn 0.5s ease",
                }}>
                    <CheckCircle size={40} color="white" />
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "var(--foreground)" }}>
                    Profiliniz Olusturuldu!
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                    Ana sayfaya yonlendiriliyorsunuz...
                </p>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isDark
                ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)"
                : "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #f0f4ff 100%)",
            padding: "20px",
        }}>
            <div style={{
                width: "100%",
                maxWidth: "520px",
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(0,0,0,0.1)",
            }}>
                {/* Header */}
                <div style={{
                    padding: "32px 32px 24px",
                    background: isDark
                        ? "linear-gradient(135deg, rgba(0,90,226,0.15), rgba(255,107,0,0.1))"
                        : "linear-gradient(135deg, rgba(0,90,226,0.08), rgba(255,107,0,0.05))",
                    borderBottom: "1px solid var(--card-border)",
                    textAlign: "center",
                }}>
                    {user?.avatar ? (
                        <Image
                            src={user.avatar}
                            alt="Profil"
                            width={72}
                            height={72}
                            style={{ borderRadius: "50%", margin: "0 auto 16px", display: "block", border: "3px solid var(--primary)" }}
                        />
                    ) : (
                        <div style={{
                            width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px",
                            background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "28px", fontWeight: "700", color: "white",
                        }}>
                            {(user?.name || "U").charAt(0).toUpperCase()}
                        </div>
                    )}
                    <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--foreground)", marginBottom: "8px" }}>
                        Hosgeldiniz, {user?.name?.split(" ")[0] || ""}!
                    </h1>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.5 }}>
                        Profilinizi tamamlamak icin asagidaki bilgileri doldurun
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: "28px 32px 32px" }}>
                    {/* First Name & Last Name */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                        <div>
                            <label style={{
                                display: "block", fontSize: "13px", fontWeight: "600",
                                color: "var(--foreground)", marginBottom: "8px",
                            }}>
                                Isim *
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Ahmet"
                                style={{
                                    width: "100%", padding: "12px 14px", borderRadius: "12px",
                                    background: "var(--secondary)", border: "1px solid var(--card-border)",
                                    color: "var(--foreground)", fontSize: "14px", outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                                onBlur={(e) => e.target.style.borderColor = "var(--card-border)"}
                                required
                            />
                        </div>
                        <div>
                            <label style={{
                                display: "block", fontSize: "13px", fontWeight: "600",
                                color: "var(--foreground)", marginBottom: "8px",
                            }}>
                                Soyisim *
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Yilmaz"
                                style={{
                                    width: "100%", padding: "12px 14px", borderRadius: "12px",
                                    background: "var(--secondary)", border: "1px solid var(--card-border)",
                                    color: "var(--foreground)", fontSize: "14px", outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                                onBlur={(e) => e.target.style.borderColor = "var(--card-border)"}
                                required
                            />
                        </div>
                    </div>

                    {/* Username */}
                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <label style={{
                                fontSize: "13px", fontWeight: "600",
                                color: "var(--foreground)",
                            }}>
                                Kullanici Adi *
                            </label>
                            <span style={{
                                fontSize: "11px",
                                color: username.length > USERNAME_RULES.MAX_LENGTH ? "#EF4444"
                                    : username.length >= USERNAME_RULES.MIN_LENGTH ? "var(--text-muted)"
                                    : "var(--text-muted)",
                                fontWeight: "500",
                                fontVariantNumeric: "tabular-nums",
                            }}>
                                {username.length}/{USERNAME_RULES.MAX_LENGTH}
                            </span>
                        </div>
                        <div style={{ position: "relative" }}>
                            <div style={{
                                position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                                color: "var(--text-muted)", fontSize: "14px", fontWeight: "500",
                            }}>@</div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                onFocus={() => setShowRules(true)}
                                onBlur={() => setTimeout(() => setShowRules(false), 200)}
                                placeholder="kullanici_adi"
                                maxLength={USERNAME_RULES.MAX_LENGTH}
                                style={{
                                    width: "100%", padding: "12px 40px 12px 32px", borderRadius: "12px",
                                    background: "var(--secondary)",
                                    border: `1px solid ${(usernameStatus === "taken" || usernameStatus === "invalid") ? "#EF4444" : usernameStatus === "available" ? "#22c55e" : "var(--card-border)"}`,
                                    color: "var(--foreground)", fontSize: "14px", outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                required
                            />
                            {/* Status indicator */}
                            {usernameStatus === "checking" && (
                                <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)" }}>
                                    <Loader2 size={16} color="var(--text-muted)" style={{ animation: "spin 0.8s linear infinite" }} />
                                </div>
                            )}
                            {usernameStatus === "available" && (
                                <CheckCircle size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#22c55e" }} />
                            )}
                            {(usernameStatus === "taken" || usernameStatus === "invalid") && username.length > 0 && (
                                <AlertCircle size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#EF4444" }} />
                            )}
                        </div>
                        {/* Mesaj alanı */}
                        {usernameMessage ? (
                            <p style={{
                                fontSize: "11px",
                                color: usernameStatus === "available" ? "#22c55e" : "#EF4444",
                                marginTop: "6px",
                                fontWeight: "600",
                            }}>
                                {usernameMessage}
                            </p>
                        ) : (
                            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                                {USERNAME_RULES.MIN_LENGTH}–{USERNAME_RULES.MAX_LENGTH} karakter, harf ile başlamalı
                            </p>
                        )}
                        {/* Kural listesi — focus olduğunda göster */}
                        {showRules && (
                            <div style={{
                                marginTop: "8px",
                                padding: "10px 14px",
                                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                                border: "1px solid var(--card-border)",
                                borderRadius: "10px",
                                animation: "fadeIn 0.2s ease",
                            }}>
                                <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--foreground)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Info size={12} /> Kullanıcı Adı Kuralları
                                </p>
                                {getUsernameRulesText().map((rule, i) => {
                                    // Her kuralın geçip geçmediğini kontrol et
                                    const validation = validateUsername(username);
                                    const isPassing = username.length > 0 && !validation.errors.some(e => rule.toLowerCase().includes(e.toLowerCase().slice(0, 10)));
                                    return (
                                        <div key={i} style={{
                                            fontSize: "11px",
                                            color: username.length === 0 ? "var(--text-muted)" : isPassing ? "#22c55e" : "var(--text-muted)",
                                            display: "flex", alignItems: "center", gap: "6px",
                                            padding: "2px 0",
                                        }}>
                                            <span style={{ fontSize: "10px" }}>{username.length === 0 ? "○" : isPassing ? "✓" : "○"}</span>
                                            {rule}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* City */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            display: "flex", fontSize: "13px", fontWeight: "600",
                            color: "var(--foreground)", marginBottom: "8px",
                            alignItems: "center", gap: "6px",
                        }}>
                            <MapPin size={14} />
                            Sehriniz *
                        </label>
                        <div style={{ position: "relative" }}>
                            <select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                style={{
                                    width: "100%", padding: "12px 14px", borderRadius: "12px",
                                    background: "var(--secondary)", border: "1px solid var(--card-border)",
                                    color: "var(--foreground)", fontSize: "14px", outline: "none",
                                    appearance: "none", cursor: "pointer",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                                onBlur={(e) => e.target.style.borderColor = "var(--card-border)"}
                            >
                                {CITIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} style={{
                                position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                                color: "var(--text-muted)", pointerEvents: "none",
                            }} />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            padding: "12px 16px", marginBottom: "16px",
                            background: "rgba(239, 68, 68, 0.08)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            borderRadius: "12px", color: "#EF4444", fontSize: "13px",
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!canSubmit || isLoading}
                        style={{
                            width: "100%", padding: "14px",
                            borderRadius: "14px", border: "none",
                            background: canSubmit ? "var(--primary)" : "var(--card-border)",
                            color: "white", fontSize: "15px", fontWeight: "700",
                            cursor: canSubmit ? "pointer" : "not-allowed",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            transition: "all 0.3s",
                            opacity: isLoading ? 0.7 : 1,
                        }}
                    >
                        {isLoading ? (
                            <>
                                <div style={{
                                    width: 18, height: 18,
                                    border: "2.5px solid rgba(255,255,255,0.3)",
                                    borderTop: "2.5px solid white",
                                    borderRadius: "50%",
                                    animation: "spin 0.8s linear infinite",
                                }} />
                                Profil olusturuluyor...
                            </>
                        ) : (
                            <>
                                Profili Tamamla <Sparkles size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>

            <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
