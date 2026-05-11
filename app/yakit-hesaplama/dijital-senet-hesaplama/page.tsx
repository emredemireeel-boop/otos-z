import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DijitalSenetHesapSection from "@/app/kutuphane/dijital-senet-hesap-section";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dijital Senet Hesaplayıcı 2026 - Reel Faiz Oranı Hesaplama | OtoHesap",
  description: "Dijital senet ile araç alımının gerçek maliyetini hesaplayın. Dosya masrafı dahil reel faiz oranı, aylık taksit tutarı ve ödeme tablosu.",
  keywords: "dijital senet hesaplama, dijital senet faiz oranı, senetle araç alma, dijital senet reel faiz, senet taksit hesaplama",
};

export default function DijitalSenetPage() {
  return (
    <div>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--background)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 20px 60px" }}>
          <Link href="/yakit-hesaplama" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", marginBottom: "20px", fontWeight: "600" }}>← OtoHesap</Link>
          <DijitalSenetHesapSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
