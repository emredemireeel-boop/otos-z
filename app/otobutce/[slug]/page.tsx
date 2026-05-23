import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OTOBUTCE_CATEGORIES } from "@/data/otobutce-data";
import { createSlug } from "@/data/vehicle-dna";
import { ArrowLeft, Car, Fuel, Settings, Calendar, ExternalLink, ShieldCheck, BadgePercent, Activity } from "lucide-react";

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
          <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
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
              <p style={{ color: "var(--text-muted)", margin: "0 0 16px 0", fontSize: "15px", lineHeight: "1.6" }}>
                {category.introText}
              </p>
            ) : (
              <p style={{ color: "var(--text-muted)", margin: "0 0 16px 0", fontSize: "15px" }}>
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
                marginTop: "16px"
              }}>
                <ShieldCheck size={24} color="#10B981" style={{ flexShrink: 0 }} />
                <p style={{ color: "var(--foreground)", margin: 0, fontSize: "14px", lineHeight: "1.5", fontWeight: "500" }}>
                  {category.tavsiyeText}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cars List */}
        <section style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
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

                  <div style={{ flex: 1, minWidth: "300px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                      <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>
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
                    minWidth: "200px",
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
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "700",
                        textDecoration: "none",
                        width: "100%",
                        justifyContent: "center"
                      }}
                    >
                      <Activity size={16} />
                      Araç DNA'sına Git
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
