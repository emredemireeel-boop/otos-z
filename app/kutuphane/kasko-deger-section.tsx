"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, Car, Calendar, Shield, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";

interface Arac {
  marka: string;
  model: string;
  yil: number;
  deger: number;
}

export default function KaskoDegerSection() {
  const [markalar, setMarkalar] = useState<string[]>([]);
  const [selectedMarka, setSelectedMarka] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYil, setSelectedYil] = useState("");
  const [sonuclar, setSonuclar] = useState<Arac[]>([]);
  const [toplamSonuc, setToplamSonuc] = useState(0);
  const [loading, setLoading] = useState(false);
  const [guncellenmeTarihi, setGuncellenmeTarihi] = useState("");
  const [offset, setOffset] = useState(0);
  const LIMIT = 50;

  const yillar = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012];

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedMarka || selectedYil || searchQuery.length >= 2) {
        fetchData(0);
      } else { setSonuclar([]); setToplamSonuc(0); }
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedMarka, selectedYil, searchQuery, fetchData]);

  const formatCurrency = (val: number) => val.toLocaleString("tr-TR") + " ₺";
  const showPrompt = !selectedMarka && !selectedYil && searchQuery.length < 2;

  const AC = "#0EA5E9";
  const AC_L = "rgba(14,165,233,0.08)";

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1E3A5F, #0EA5E9)", borderRadius: "20px", padding: "28px", marginBottom: "24px", display: "flex", alignItems: "flex-start", gap: "16px", boxShadow: "0 10px 40px rgba(14,165,233,0.25)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", filter: "blur(30px)" }} />
        <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(255,255,255,0.3)" }}>
          <Shield size={28} color="#FBBF24" />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "white", marginBottom: "8px" }}>Kasko Değer Listesi 2026</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)", lineHeight: "1.6", margin: 0 }}>
            TSB resmi kasko değer listesi — 78.000+ araç kaydı. Marka, model ve yıla göre aracınızın kasko bedelini sorgulayın.
          </p>
          {guncellenmeTarihi && (
            <div style={{ marginTop: "8px", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Son Güncelleme: Nisan 2026 • Kaynak: TSB Resmi Verisi</div>
          )}
        </div>
      </div>

      {/* Filtreler */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        <div style={{ position: "relative" }}>
          <Car size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <select value={selectedMarka} onChange={e => setSelectedMarka(e.target.value)}
            style={{ width: "100%", padding: "12px 12px 12px 36px", borderRadius: "10px", background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)", fontSize: "14px", appearance: "none", cursor: "pointer", outline: "none" }}>
            <option value="">Marka Seçin</option>
            {markalar.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
        </div>
        <div style={{ position: "relative" }}>
          <Calendar size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <select value={selectedYil} onChange={e => setSelectedYil(e.target.value)}
            style={{ width: "100%", padding: "12px 12px 12px 36px", borderRadius: "10px", background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)", fontSize: "14px", appearance: "none", cursor: "pointer", outline: "none" }}>
            <option value="">Yıl Seçin</option>
            {yillar.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
        </div>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input type="text" placeholder="Model ara... (örn: Egea)" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "12px 12px 12px 36px", borderRadius: "10px", background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Prompt */}
      {showPrompt && (
        <div style={{ padding: "50px 20px", textAlign: "center", color: "var(--text-muted)" }}>
          <Shield size={48} style={{ opacity: 0.2, margin: "0 auto 16px" }} />
          <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "var(--foreground)" }}>Kasko Değer Sorgulama</p>
          <p style={{ fontSize: "13px" }}>Yukarıdan bir <strong>marka</strong> veya <strong>yıl</strong> seçerek ya da model adı yazarak arama yapın.</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <Loader2 size={28} color={AC} style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Sonuçlar */}
      {!showPrompt && !loading && sonuclar.length > 0 && (
        <>
          <div style={{ marginBottom: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--foreground)" }}>{toplamSonuc.toLocaleString("tr-TR")}</strong> araç bulundu
            {toplamSonuc > LIMIT && ` (${offset + 1}-${Math.min(offset + LIMIT, toplamSonuc)} arası)`}
          </div>
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "var(--background)" }}>
                    <th style={{ padding: "12px 14px", textAlign: "left", fontWeight: "700", color: "var(--foreground)", borderBottom: "1px solid var(--card-border)" }}>Marka</th>
                    <th style={{ padding: "12px 14px", textAlign: "left", fontWeight: "700", color: "var(--foreground)", borderBottom: "1px solid var(--card-border)" }}>Model / Donanım</th>
                    <th style={{ padding: "12px 14px", textAlign: "center", fontWeight: "700", color: "var(--foreground)", borderBottom: "1px solid var(--card-border)" }}>Yıl</th>
                    <th style={{ padding: "12px 14px", textAlign: "right", fontWeight: "700", color: "var(--foreground)", borderBottom: "1px solid var(--card-border)" }}>Kasko Değeri</th>
                  </tr>
                </thead>
                <tbody>
                  {sonuclar.map((a, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid var(--border-subtle)" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--background)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                      <td style={{ padding: "10px 14px", fontWeight: "600", color: "var(--foreground)", whiteSpace: "nowrap" }}>{a.marka}</td>
                      <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{a.model}</td>
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <span style={{ background: "var(--background)", padding: "3px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "var(--foreground)" }}>{a.yil}</span>
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "right" }}>
                        <span style={{ fontWeight: "800", fontSize: "14px", color: AC }}>{formatCurrency(a.deger)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {toplamSonuc > LIMIT && (
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <button disabled={offset === 0} onClick={() => fetchData(Math.max(0, offset - LIMIT))}
                style={{ padding: "10px 18px", borderRadius: "10px", fontWeight: "600", fontSize: "13px", background: offset === 0 ? "var(--background)" : "var(--card-bg)", color: offset === 0 ? "var(--text-muted)" : "var(--foreground)", border: "1px solid var(--card-border)", cursor: offset === 0 ? "default" : "pointer" }}>
                ← Önceki
              </button>
              <span style={{ padding: "10px 14px", fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
                Sayfa {Math.floor(offset / LIMIT) + 1} / {Math.ceil(toplamSonuc / LIMIT)}
              </span>
              <button disabled={offset + LIMIT >= toplamSonuc} onClick={() => fetchData(offset + LIMIT)}
                style={{ padding: "10px 18px", borderRadius: "10px", fontWeight: "600", fontSize: "13px", background: offset + LIMIT >= toplamSonuc ? "var(--background)" : "var(--card-bg)", color: offset + LIMIT >= toplamSonuc ? "var(--text-muted)" : "var(--foreground)", border: "1px solid var(--card-border)", cursor: offset + LIMIT >= toplamSonuc ? "default" : "pointer" }}>
                Sonraki →
              </button>
            </div>
          )}
        </>
      )}

      {!showPrompt && !loading && sonuclar.length === 0 && (
        <div style={{ padding: "50px", textAlign: "center", color: "var(--text-muted)" }}>
          <Car size={40} style={{ opacity: 0.3, margin: "0 auto 12px" }} />
          <p>Aradığınız kritere uygun araç bulunamadı.</p>
        </div>
      )}

      {/* Detaylı sayfa linki */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Link href="/kutuphane/kasko-deger" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", color: AC, fontWeight: "700", fontSize: "14px", textDecoration: "none", transition: "all 0.2s" }}>
          <Shield size={16} /> Detaylı Kasko Değer Sayfasına Git →
        </Link>
      </div>
    </div>
  );
}
