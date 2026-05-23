import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OTOBUTCE_CATEGORIES } from "@/data/otobutce-data";
import { Search, ChevronRight, Wallet, Target, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Bütçeye Göre Araç Önerileri 2026 | OtoBütçe",
  description: "Bütçenizi seçin, uzmanlarımızın önerdiği en mantıklı, az yakan ve masrafsız ikinci el araçları anında keşfedin. Güncel piyasa analizleri.",
  keywords: "bütçeye göre araç, fiyata göre araba, 200 bin tl araç, 500 bin tl araba, oto bütçe, ikinci el araba tavsiyesi"
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

        {/* Categories Grid */}
        <section style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
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

          <div style={{
            marginTop: "40px",
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
        </section>

      </main>
      <Footer />
    </div>
  );
}
