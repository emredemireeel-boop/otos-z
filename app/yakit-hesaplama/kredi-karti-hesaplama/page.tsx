import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KrediKartiAracSection from "@/app/kutuphane/kredi-karti-arac-section";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kredi Kartı ile Araç Alma Hesaplayıcı 2026 | OtoHesap - OtoSöz",
  description: "Kredi kartı ile araç alırken komisyon oranını, taksit tutarını ve toplam maliyeti hesaplayın. Kredi kartı komisyon kesintisi hesaplayıcı.",
  keywords: "kredi kartı ile araç alma, araç komisyon hesaplama, kredi kartı taksit hesaplama, araç alım hesaplama",
};

export default function KrediKartiPage() {
  return (
    <div>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--background)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 20px 60px" }}>
          <Link href="/yakit-hesaplama" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", marginBottom: "20px", fontWeight: "600" }}>← OtoHesap</Link>
          <KrediKartiAracSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
