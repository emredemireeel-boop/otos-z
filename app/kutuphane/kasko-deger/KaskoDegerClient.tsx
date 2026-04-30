"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Car, Calendar, ArrowLeft, Shield, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";

interface Arac {
    marka: string;
    model: string;
    yil: number;
    deger: number;
}

export default function KaskoDegerClient() {
    const [markalar, setMarkalar] = useState<string[]>([]);
    const [selectedMarka, setSelectedMarka] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYil, setSelectedYil] = useState("");
    const [sonuclar, setSonuclar] = useState<Arac[]>([]);
    const [toplamSonuc, setToplamSonuc] = useState(0);
    const [loading, setLoading] = useState(false);
    const [guncellenmeTarihi, setGuncellenmeTarihi] = useState("");
    const [offset, setOffset] = useState(0);
    const LIMIT = 100;

    const yillar = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012];

    // Fetch brands on mount
    useEffect(() => {
        fetch("/api/kasko-deger?markalar=1")
            .then(r => r.json())
            .then(d => {
                setMarkalar(d.markalar || []);
                setGuncellenmeTarihi(d.guncellenmeTarihi || "");
            });
    }, []);

    const fetchData = useCallback(async (newOffset = 0) => {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedMarka) params.set("marka", selectedMarka);
        if (searchQuery.length >= 2) params.set("model", searchQuery);
        if (selectedYil) params.set("yil", selectedYil);
        params.set("limit", String(LIMIT));
        params.set("offset", String(newOffset));

        const res = await fetch(`/api/kasko-deger?${params.toString()}`);
        const data = await res.json();
        setSonuclar(data.sonuclar || []);
        setToplamSonuc(data.toplamSonuc || 0);
        setOffset(newOffset);
        setLoading(false);
    }, [selectedMarka, searchQuery, selectedYil]);

    // Fetch on filter change
    useEffect(() => {
        const timer = setTimeout(() => {
            if (selectedMarka || selectedYil || searchQuery.length >= 2) {
                fetchData(0);
            } else {
                setSonuclar([]);
                setToplamSonuc(0);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [selectedMarka, selectedYil, searchQuery, fetchData]);

    const formatCurrency = (val: number) => val.toLocaleString("tr-TR") + " ₺";

    const slugify = (marka: string, model: string, yil: number) => {
        return `${yil}-${marka}-${model}`
            .toLocaleLowerCase("tr")
            .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ü/g, "u")
            .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    };

    const showPrompt = !selectedMarka && !selectedYil && searchQuery.length < 2;

    return (
        <div style={{ minHeight: "100vh", background: "var(--background)" }}>
            <Navbar />
            <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "120px 24px 60px" }}>
                <Link href="/kutuphane" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", marginBottom: "24px", textDecoration: "none", fontWeight: "600" }}>
                    <ArrowLeft size={16} /> Kütüphaneye Dön
                </Link>

                {/* Hero */}
                <div style={{
                    background: "linear-gradient(135deg, #1E3A5F, #0EA5E9)",
                    borderRadius: "24px", padding: "48px 32px", marginBottom: "40px",
                    boxShadow: "0 20px 50px rgba(14, 165, 233, 0.25)", textAlign: "center",
                    position: "relative", overflow: "hidden"
                }}>
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />
                    <div style={{
                        width: "80px", height: "80px", borderRadius: "20px",
                        background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
                        margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid rgba(255,255,255,0.2)", position: "relative"
                    }}>
                        <Shield size={40} color="#FBBF24" />
                    </div>
                    <h1 style={{ fontSize: "36px", fontWeight: "900", color: "white", marginBottom: "12px", position: "relative" }}>
                        Kasko Değer Listesi 2026
                    </h1>
                    <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.9)", lineHeight: "1.6", maxWidth: "650px", margin: "0 auto", position: "relative" }}>
                        TSB (Türkiye Sigorta Birliği) resmi kasko değer listesi — 78.000+ araç kaydı.
                        Marka, model ve yıla göre aracınızın kasko bedelini sorgulayın.
                    </p>
                    {guncellenmeTarihi && (
                        <div style={{ marginTop: "16px", fontSize: "13px", color: "rgba(255,255,255,0.6)", position: "relative" }}>
                            Son Güncelleme: Nisan 2026 • Kaynak: TSB Resmi Verisi
                        </div>
                    )}
                </div>

                {/* Filtreler */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                    <div style={{ position: "relative" }}>
                        <Car size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                        <select
                            value={selectedMarka}
                            onChange={e => setSelectedMarka(e.target.value)}
                            style={{
                                width: "100%", padding: "14px 14px 14px 42px", borderRadius: "12px",
                                background: "var(--card-bg)", border: "1px solid var(--card-border)",
                                color: "var(--foreground)", fontSize: "15px", appearance: "none", cursor: "pointer", outline: "none"
                            }}
                        >
                            <option value="">Marka Seçin</option>
                            {markalar.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <ChevronDown size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                    </div>

                    <div style={{ position: "relative" }}>
                        <Calendar size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                        <select
                            value={selectedYil}
                            onChange={e => setSelectedYil(e.target.value)}
                            style={{
                                width: "100%", padding: "14px 14px 14px 42px", borderRadius: "12px",
                                background: "var(--card-bg)", border: "1px solid var(--card-border)",
                                color: "var(--foreground)", fontSize: "15px", appearance: "none", cursor: "pointer", outline: "none"
                            }}
                        >
                            <option value="">Yıl Seçin</option>
                            {yillar.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                    </div>

                    <div style={{ position: "relative" }}>
                        <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                        <input
                            type="text"
                            placeholder="Model ara... (örn: Egea, Golf)"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: "100%", padding: "14px 14px 14px 42px", borderRadius: "12px",
                                background: "var(--card-bg)", border: "1px solid var(--card-border)",
                                color: "var(--foreground)", fontSize: "15px", outline: "none", boxSizing: "border-box"
                            }}
                        />
                    </div>
                </div>

                {/* Prompt */}
                {showPrompt && (
                    <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                        <Shield size={56} style={{ opacity: 0.2, margin: "0 auto 20px" }} />
                        <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "var(--foreground)" }}>Kasko Değer Sorgulama</p>
                        <p style={{ fontSize: "14px" }}>Yukarıdan bir <strong>marka</strong> veya <strong>yıl</strong> seçerek ya da model adı yazarak arama yapın.</p>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div style={{ padding: "40px", textAlign: "center" }}>
                        <Loader2 size={32} color="var(--primary)" style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {/* Results */}
                {!showPrompt && !loading && sonuclar.length > 0 && (
                    <>
                        <div style={{ marginBottom: "16px", fontSize: "14px", color: "var(--text-muted)" }}>
                            <strong style={{ color: "var(--foreground)" }}>{toplamSonuc.toLocaleString("tr-TR")}</strong> araç bulundu
                            {toplamSonuc > LIMIT && ` (${offset + 1}-${Math.min(offset + LIMIT, toplamSonuc)} arası gösteriliyor)`}
                        </div>

                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", overflow: "hidden" }}>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                                    <thead>
                                        <tr style={{ background: "var(--background)" }}>
                                            <th style={{ padding: "16px", textAlign: "left", fontWeight: "700", color: "var(--foreground)", borderBottom: "1px solid var(--card-border)" }}>Marka</th>
                                            <th style={{ padding: "16px", textAlign: "left", fontWeight: "700", color: "var(--foreground)", borderBottom: "1px solid var(--card-border)" }}>Model / Donanım</th>
                                            <th style={{ padding: "16px", textAlign: "center", fontWeight: "700", color: "var(--foreground)", borderBottom: "1px solid var(--card-border)" }}>Yıl</th>
                                            <th style={{ padding: "16px", textAlign: "right", fontWeight: "700", color: "var(--foreground)", borderBottom: "1px solid var(--card-border)" }}>Kasko Değeri</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sonuclar.map((a, idx) => (
                                            <tr key={idx} style={{ borderBottom: "1px solid var(--border-subtle)" }}
                                                onMouseEnter={e => { e.currentTarget.style.background = "var(--background)"; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                                            >
                                                <td style={{ padding: "14px 16px", fontWeight: "600", color: "var(--foreground)", whiteSpace: "nowrap" }}>{a.marka}</td>
                                                <td style={{ padding: "14px 16px", color: "var(--text-muted)" }}>{a.model}</td>
                                                <td style={{ padding: "14px 16px", textAlign: "center" }}>
                                                    <span style={{ background: "var(--background)", padding: "4px 10px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>{a.yil}</span>
                                                </td>
                                                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                                                    <span style={{ fontWeight: "800", fontSize: "15px", color: "#0EA5E9" }}>{formatCurrency(a.deger)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {toplamSonuc > LIMIT && (
                            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "24px" }}>
                                <button
                                    disabled={offset === 0}
                                    onClick={() => fetchData(Math.max(0, offset - LIMIT))}
                                    style={{
                                        padding: "10px 20px", borderRadius: "10px", fontWeight: "600", fontSize: "14px",
                                        background: offset === 0 ? "var(--background)" : "var(--card-bg)", color: offset === 0 ? "var(--text-muted)" : "var(--foreground)",
                                        border: "1px solid var(--card-border)", cursor: offset === 0 ? "default" : "pointer"
                                    }}
                                >
                                    ← Önceki
                                </button>
                                <span style={{ padding: "10px 16px", fontSize: "14px", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
                                    Sayfa {Math.floor(offset / LIMIT) + 1} / {Math.ceil(toplamSonuc / LIMIT)}
                                </span>
                                <button
                                    disabled={offset + LIMIT >= toplamSonuc}
                                    onClick={() => fetchData(offset + LIMIT)}
                                    style={{
                                        padding: "10px 20px", borderRadius: "10px", fontWeight: "600", fontSize: "14px",
                                        background: offset + LIMIT >= toplamSonuc ? "var(--background)" : "var(--card-bg)", color: offset + LIMIT >= toplamSonuc ? "var(--text-muted)" : "var(--foreground)",
                                        border: "1px solid var(--card-border)", cursor: offset + LIMIT >= toplamSonuc ? "default" : "pointer"
                                    }}
                                >
                                    Sonraki →
                                </button>
                            </div>
                        )}
                    </>
                )}

                {!showPrompt && !loading && sonuclar.length === 0 && (
                    <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
                        <Car size={48} style={{ opacity: 0.3, margin: "0 auto 16px" }} />
                        <p>Aradığınız kritere uygun araç bulunamadı.</p>
                    </div>
                )}

                {/* Info */}
                <div style={{ marginTop: "40px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", marginBottom: "12px" }}>ℹ️ Kasko Değer Listesi Hakkında</h2>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.7" }}>
                        Bu sayfadaki değerler <strong>Türkiye Sigorta Birliği (TSB)</strong> resmi Nisan 2026 kasko değer listesinden alınmıştır.
                        Otomobil, arazi taşıtı ve hafif ticari araçların değerleri <strong>INDICATA</strong> firmasının katkılarıyla;
                        kamyon, çekici, otobüs, motosiklet ve zirai traktör değerleri ise doğrudan TSB tarafından hazırlanmaktadır.
                        Liste aylık olarak güncellenir. En kesin kasko poliçe teklifleri için sigorta şirketinize başvurunuz.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
