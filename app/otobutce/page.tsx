import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import LatestThreadsWidget from "@/components/LatestThreadsWidget";
import PopularThreadsWidget from "@/components/PopularThreadsWidget";
import { OTOBUTCE_CATEGORIES } from "@/data/otobutce-data";
import { ChevronRight, Wallet, Target, Info, Lightbulb, TrendingUp, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Bütçeye Göre Araç Önerileri 2026 | OtoBütçe",
  description: "Bütçenizi seçin, uzmanlarımızın önerdiği en mantıklı, az yakan ve masrafsız ikinci el araçları anında keşfedin. Güncel piyasa analizleri.",
  keywords: "bütçeye göre araç, fiyata göre araba, 200 bin tl araç, 500 bin tl araba, oto bütçe, ikinci el araba tavsiyesi",
  alternates: { canonical: "https://otosoz.com/otobutce" },
  openGraph: {
    title: "Bütçeye Göre Araç Önerileri 2026 | OtoBütçe",
    description: "Bütçenize göre en mantıklı, az yakan ve masrafsız ikinci el araç önerilerini karşılaştırın.",
    url: "https://otosoz.com/otobutce",
    type: "website",
  },
};

// Design constants
const BRAND_GRADIENT = "linear-gradient(135deg, #10B981 0%, #059669 100%)";
const AC_L = "rgba(16, 185, 129, 0.08)";

export default function OtoButcePage() {
  return (
    <div className="otobutce-page">
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--background)", paddingBottom: "60px" }}>
        
        {/* Hero Section */}
        <section style={{
          padding: "60px 20px 40px",
          background: "linear-gradient(180deg, var(--secondary) 0%, var(--background) 100%)",
          textAlign: "center",
          borderBottom: "1px solid var(--border-subtle)"
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: AC_L,
              color: "#10B981",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "700",
              marginBottom: "16px",
              border: "1px solid rgba(16, 185, 129, 0.2)"
            }}>
              <Wallet size={14} /> Yeni Modül
            </div>
            <h1 style={{
              fontSize: "36px",
              fontWeight: "800",
              color: "var(--foreground)",
              marginBottom: "16px",
              lineHeight: "1.2"
            }}>
              Bütçenize Uygun <span style={{ background: BRAND_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>En İyi Araçlar</span>
            </h1>
            <p style={{
              fontSize: "16px",
              color: "var(--text-muted)",
              lineHeight: "1.6",
              maxWidth: "600px",
              margin: "0 auto"
            }}>
              Araba almak istiyorsunuz ama hangi modeli seçeceğinize karar veremediniz mi? Bütçenizi seçin, uzmanlarımızın önerdiği en mantıklı araçları keşfedin.
            </p>
          </div>
        </section>

        {/* 3-Column Layout */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
          <div className="home-main-grid" style={{ display: "grid", gridTemplateColumns: "220px 1fr 280px", gap: "24px" }}>
            
            {/* Left Sidebar */}
            <aside className="home-left-sidebar">
              <div style={{ position: "sticky", top: "100px" }}>
                {/* Hızlı Bütçe Seçimi */}
                <div style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "16px",
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Wallet size={14} color="#10B981" /> Bütçe Seçimi
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "240px", overflowY: "auto", paddingRight: "4px" }}>
                    {OTOBUTCE_CATEGORIES.map((cat) => (
                      <li key={cat.id} style={{ marginBottom: "4px" }}>
                        <Link
                          href={`/otobutce/${cat.slug}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            color: "var(--foreground)",
                            fontSize: "13px",
                            textDecoration: "none",
                            transition: "all 0.2s",
                          }}
                        >
                          <span>{cat.title.split(":")[0].split("(")[0].trim()}</span>
                          <span style={{ fontSize: "11px", opacity: 0.5 }}>{cat.cars.length}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Reklam Alanı */}
                <AdPlaceholder position="sidebar" />

                {/* Son Açılan Başlıklar */}
                <LatestThreadsWidget />
              </div>
            </aside>

            {/* Main Content */}
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                {OTOBUTCE_CATEGORIES.map((cat) => (
                  <Link 
                    href={`/otobutce/${cat.slug}`} 
                    key={cat.id}
                    className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                    style={{
                      display: "block",
                      textDecoration: "none",
                      background: "var(--card-bg)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "16px",
                      padding: "24px",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      top: 0, right: 0,
                      width: "100px", height: "100px",
                      background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
                      transform: "translate(30%, -30%)"
                    }} />
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                      <div style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: AC_L,
                        color: "#10B981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Target size={24} />
                      </div>
                      <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "var(--secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-muted)"
                      }}>
                        <ChevronRight size={16} />
                      </div>
                    </div>

                    <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--foreground)", marginBottom: "8px" }}>
                      {cat.title}
                    </h3>
                    <p style={{ fontSize: "14px", color: "var(--text-dimmed)", margin: 0 }}>
                      {cat.cars.length} araç önerisi bulunuyor
                    </p>
                  </Link>
                ))}
              </div>

              {/* Nasıl Belirleniyor Info Box */}
              <div style={{
                marginTop: "24px",
                padding: "20px",
                background: "rgba(59, 130, 246, 0.05)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "12px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start"
              }}>
                <Info size={20} color="#3B82F6" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--foreground)", margin: "0 0 4px 0" }}>Nasıl Belirleniyor?</h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
                    Bu listedeki araçlar, piyasadaki ikinci el satış verileri, yedek parça bulunabilirliği, kronik sorunları ve fiyat/performans oranları dikkate alınarak uzmanlarımız tarafından özenle seçilmiştir.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="home-right-sidebar">
              <div style={{ position: "sticky", top: "100px" }}>
                {/* Uzman Tavsiyeleri */}
                <div style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "16px",
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Lightbulb size={14} color="#f59e0b" /> Uzman Tavsiyeleri
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      { icon: <ShieldCheck size={14} color="#10B981" />, text: "Araç alırken mutlaka ekspertiz raporu isteyin." },
                      { icon: <TrendingUp size={14} color="#3b82f6" />, text: "Az yakıt tüketen modeller uzun vadede tasarruf sağlar." },
                      { icon: <Sparkles size={14} color="#8b5cf6" />, text: "Yedek parça fiyatlarını önceden araştırın." },
                    ].map((tip, i) => (
                      <div key={i} style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        padding: "10px",
                        background: "var(--secondary)",
                        borderRadius: "10px",
                        fontSize: "12px",
                        color: "var(--foreground)",
                        lineHeight: "1.5"
                      }}>
                        <div style={{ flexShrink: 0, marginTop: "1px" }}>{tip.icon}</div>
                        {tip.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* İstatistikler */}
                <div style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "16px",
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <TrendingUp size={14} color="var(--primary)" /> OtoBütçe İstatistikleri
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ padding: "12px", background: "var(--secondary)", borderRadius: "10px" }}>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#10B981" }}>{OTOBUTCE_CATEGORIES.length}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Bütçe Kategorisi</div>
                    </div>
                    <div style={{ padding: "12px", background: "var(--secondary)", borderRadius: "10px" }}>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--primary)" }}>{OTOBUTCE_CATEGORIES.reduce((sum, cat) => sum + cat.cars.length, 0)}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Toplam Araç Önerisi</div>
                    </div>
                  </div>
                </div>

                {/* Reklam Alanı */}
                <AdPlaceholder position="sidebar" />

                {/* Popüler Başlıklar */}
                <PopularThreadsWidget />
              </div>
            </aside>

          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
