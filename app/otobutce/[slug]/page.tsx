import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import LatestThreadsWidget from "@/components/LatestThreadsWidget";
import PopularThreadsWidget from "@/components/PopularThreadsWidget";
import { OTOBUTCE_CATEGORIES } from "@/data/otobutce-data";
import { createSlug } from "@/data/vehicle-dna";
import { ArrowLeft, Car, Fuel, Settings, Calendar, ExternalLink, ShieldCheck, BadgePercent, Activity, Wallet, Lightbulb, TrendingUp, Sparkles } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = OTOBUTCE_CATEGORIES.find((c) => c.slug === slug);
  
  if (!category) {
    return { title: "Bulunamadı | OtoBütçe" };
  }

  return {
    title: category.seoTitle,
    description: category.seoDesc,
    keywords: `araba, ikinci el, araç önerisi, ${category.title} araba, ${category.title} araçlar`,
  };
}

export default async function OtoButceCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = OTOBUTCE_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const AC = "#10B981"; // Emerald Green for OtoBütçe

  return (
    <div className="otobutce-category-page">
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--background)", paddingBottom: "60px" }}>
        
        {/* Header / Back Link */}
        <div style={{ background: "var(--secondary)", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 24px" }}>
            <Link 
              href="/otobutce" 
              style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "8px", 
                color: "var(--text-muted)", 
                fontSize: "14px",
                textDecoration: "none",
                fontWeight: "600",
                marginBottom: "16px"
              }}
            >
              <ArrowLeft size={16} /> Tüm Bütçelere Dön
            </Link>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--foreground)", margin: "0 0 8px 0" }}>
              {category.title}
            </h1>
            
            {category.introText ? (
              <p style={{ color: "var(--text-muted)", margin: "0 0 16px 0", fontSize: "15px", lineHeight: "1.6", width: "100%", textAlign: "justify" }}>
                {category.introText}
              </p>
            ) : (
              <p style={{ color: "var(--text-muted)", margin: "0 0 16px 0", fontSize: "15px", width: "100%", textAlign: "justify" }}>
                Uzmanlarımızın bu bütçe için belirlediği en mantıklı {category.cars.length} araç listeleniyor.
              </p>
            )}

            {category.tavsiyeText && (
              <div style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                marginTop: "16px",
                width: "100%"
              }}>
                <ShieldCheck size={24} color="#10B981" style={{ flexShrink: 0 }} />
                <p style={{ color: "var(--foreground)", margin: 0, fontSize: "14px", lineHeight: "1.5", fontWeight: "500", textAlign: "justify" }}>
                  {category.tavsiyeText}
                </p>
              </div>
            )}
          </div>
        </div>

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
                    <Wallet size={14} color="#10B981" /> Diğer Bütçeler
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
                            color: cat.slug === slug ? "white" : "var(--foreground)",
                            background: cat.slug === slug ? "var(--primary)" : "transparent",
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

            {/* Cars List (Main Content) */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {category.cars.map((car, index) => (
                  <div 
                    key={car.id}
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "16px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    {/* Rank Badge */}
                    <div style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: `linear-gradient(135deg, ${AC} 0%, #059669 100%)`,
                      color: "white",
                      padding: "8px 24px",
                      fontSize: "14px",
                      fontWeight: "800",
                      borderBottomLeftRadius: "16px"
                    }}>
                      #{index + 1}
                    </div>

                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                      
                      {/* Car Image Placeholder or Initial */}
                      <div style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "12px",
                        background: "var(--secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid var(--border-subtle)",
                        flexShrink: 0
                      }}>
                        <Car size={48} color="var(--text-dimmed)" />
                      </div>

                      <div style={{ flex: 1, minWidth: "250px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--foreground)", margin: 0, paddingRight: "40px" }}>
                            {car.marka} {car.model}
                          </h2>
                        </div>

                        <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "16px" }}>
                          {car.aciklama}
                        </p>

                        {/* Specs Grid */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--secondary)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "var(--foreground)", border: "1px solid var(--border-subtle)" }}>
                            <Calendar size={14} color="var(--text-muted)" /> {car.yilAraligi}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--secondary)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "var(--foreground)", border: "1px solid var(--border-subtle)" }}>
                            <Fuel size={14} color="var(--text-muted)" /> {car.yakitTipi}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--secondary)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "var(--foreground)", border: "1px solid var(--border-subtle)" }}>
                            <Settings size={14} color="var(--text-muted)" /> {car.sanziman}
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        minWidth: "160px",
                        borderLeft: "1px dashed var(--border-subtle)",
                        paddingLeft: "24px"
                      }}>
                        <Link 
                          href={`/arac-dna/${createSlug(car.marka)}/${createSlug(car.model)}`}
                          className="hover:opacity-90 transition-opacity"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background: `linear-gradient(135deg, ${AC} 0%, #059669 100%)`,
                            color: "white",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "700",
                            textDecoration: "none",
                            width: "100%",
                            justifyContent: "center",
                            textAlign: "center"
                          }}
                        >
                          <Activity size={16} />
                          Araç DNA'sı
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="home-right-sidebar">
              <div style={{ position: "sticky", top: "100px" }}>
                {/* İstatistikler */}
                <div style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "16px",
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <TrendingUp size={14} color="var(--primary)" /> Bu Kategori Hakkında
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ padding: "12px", background: "var(--secondary)", borderRadius: "10px" }}>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#10B981" }}>{category.cars.length}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Önerilen Araç Modeli</div>
                    </div>
                  </div>
                </div>

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
