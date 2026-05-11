import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KaskoDegerSection from "@/app/kutuphane/kasko-deger-section";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kasko Değer Listesi Sorgulama 2026 - TSB Araç Kasko Bedeli | OtoHesap",
  description: "2026 güncel kasko değer listesi sorgulama. Marka, model ve yıla göre aracınızın TSB kasko bedelini öğrenin. 78.000+ araç kaydı.",
  keywords: "kasko değer listesi 2026, araç kasko bedeli sorgulama, TSB kasko değer, araç değeri sorgulama, kasko fiyatı",
};

export default function KaskoDegerPage() {
  return (
    <div>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--background)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 20px 60px" }}>
          <Link href="/yakit-hesaplama" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", marginBottom: "20px", fontWeight: "600" }}>← OtoHesap</Link>
          <KaskoDegerSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
