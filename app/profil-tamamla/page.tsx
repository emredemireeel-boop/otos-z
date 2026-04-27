"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { User, MapPin, Sparkles, CheckCircle, ChevronDown } from "lucide-react";
import Image from "next/image";

const CITIES = [
    "Adana","Adıyaman","Afyon","Ağrı","Aksaray","Amasya","Ankara","Antalya",
    "Ardahan","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik",
    "Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum",
    "Denizli","Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir",
    "Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Iğdır","Isparta","İstanbul",
    "İzmir","Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kilis",
    "Kırıkkale","Kırklareli","Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa",
    "Mardin","Mersin","Muğla","Muş","Nevşehir","Niğde","Ordu","Osmaniye",
    "Rize","Sakarya","Samsun","Şanlıurfa","Siirt","Sinop","Şırnak","Sivas",
    "Tekirdağ","Tokat","Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak"
];

export default function ProfilTamamlaPage() {
    const { theme } = useTheme();
    const { user, completeProfile, needsProfileCompletion, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const isDark = theme === "dark";
    const [mounted, setMounted] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [city, setCity] = useState("İstanbul");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

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

    // Google'dan gelen isim bilgisini otomatik doldur
    useEffect(() => {
        if (user) {
            const nameParts = (user.name || "").split(" ");
            if (nameParts.length >= 2 && !firstName && !lastName) {
                setFirstName(nameParts[0]);
                setLastName(nameParts.slice(1).join(" "));
            } else if (nameParts.length === 1 && !firstName) {
                setFirstName(nameParts[0]);
            }
            if (!username && user.email) {
                setUsername(user.email.split("@")[0].replace(/[^a-z0-9_]/g, ""));
            }
        }
    }, [user, firstName, lastName, username]);

    const canSubmit = firstName.trim().length >= 2 && lastName.trim().length >= 2 && username.trim().length >= 3 && city;

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
            // Şehri localStorage'a kaydet (yakıt fiyatları ticker'ı için)
            if (typeof window !== 'undefined') {
                localStorage.setItem('oto_user_city', city);
            }
            setSuccess(true);
            setTimeout(() => router.push("/"), 2000);
        } else {
            setError("Profil tamamlanirken bir hata olustu. Lutfen tekrar deneyin.");
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
                        <label style={{
                            display: "block", fontSize: "13px", fontWeight: "600",
                            color: "var(--foreground)", marginBottom: "8px",
                        }}>
                            Kullanici Adi *
                        </label>
                        <div style={{ position: "relative" }}>
                            <div style={{
                                position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                                color: "var(--text-muted)", fontSize: "14px", fontWeight: "500",
                            }}>@</div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                                placeholder="kullanici_adi"
                                style={{
                                    width: "100%", padding: "12px 14px 12px 32px", borderRadius: "12px",
                                    background: "var(--secondary)", border: "1px solid var(--card-border)",
                                    color: "var(--foreground)", fontSize: "14px", outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                                onBlur={(e) => e.target.style.borderColor = "var(--card-border)"}
                                required
                            />
                        </div>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                            Sadece kucuk harf, rakam ve alt cizgi
                        </p>
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
            `}</style>
        </div>
    );
}
