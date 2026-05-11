import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EvMaliyetSection from "@/app/kutuphane/ev-maliyet-section";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Elektrikli Araç Şarj Maliyeti Hesaplayıcı 2026 | OtoHesap - OtoSöz",
  description: "Elektrikli araç şarj maliyetini hesaplayın. Ev şarjı gece/gündüz tarifesi, DC hızlı şarj fiyatları ve benzinli araçla karşılaştırma. Togg, Tesla, BYD ve daha fazlası.",
  keywords: "elektrikli araç şarj maliyeti, EV şarj hesaplama, ev şarjı maliyeti, elektrikli araç maliyet karşılaştırma, Togg şarj maliyeti",
};

export default function EvMaliyetPage() {
  return (
    <div>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--background)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 20px 60px" }}>
          <Link href="/yakit-hesaplama" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", marginBottom: "20px", fontWeight: "600" }}>← OtoHesap</Link>
          <EvMaliyetSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
