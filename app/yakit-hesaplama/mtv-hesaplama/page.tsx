import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MtvHesaplamaSection from "@/app/kutuphane/mtv-hesaplama-section";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MTV Hesaplayıcı 2026 - Motorlu Taşıtlar Vergisi Hesaplama | OtoHesap",
  description: "2026 yılı MTV tutarını hesaplayın. Motor silindir hacmi, araç yaşı ve taşıt değerine göre Motorlu Taşıtlar Vergisi hesaplama aracı. Ocak ve Temmuz taksitleri.",
  keywords: "MTV hesaplama 2026, motorlu taşıtlar vergisi, MTV ne kadar, araç vergisi hesaplama, MTV taksit tutarı",
};

export default function MtvPage() {
  return (
    <div>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--background)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 20px 60px" }}>
          <Link href="/yakit-hesaplama" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", marginBottom: "20px", fontWeight: "600" }}>← OtoHesap</Link>
          <MtvHesaplamaSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
