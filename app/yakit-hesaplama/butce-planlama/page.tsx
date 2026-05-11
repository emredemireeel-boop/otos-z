import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AracAlimHesapSection from "@/app/kutuphane/arac-alim-hesap-section";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Araç Alım Bütçe Hesaplayıcı 2026 - Kredi, Nakit, Ek Giderler | OtoHesap",
  description: "Araç alırken toplam maliyeti hesaplayın: nakit, banka kredisi faizi, kredi kartı komisyonu, noter, sigorta, kasko ve tüm ek giderler dahil bütçe planlama aracı.",
  keywords: "araç alım maliyeti hesaplama, araç bütçe planlama, araç kredi hesaplama, noter ücreti, araç alım giderleri",
};

export default function ButcePlanlamaPage() {
  return (
    <div>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--background)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 20px 60px" }}>
          <Link href="/yakit-hesaplama" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", marginBottom: "20px", fontWeight: "600" }}>← OtoHesap</Link>
          <AracAlimHesapSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
