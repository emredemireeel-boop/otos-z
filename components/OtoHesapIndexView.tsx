import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight, BadgePercent, Banknote, Calculator, Car, Circle, Clock3,
  CreditCard, FileText, Fuel, Gauge, LineChart, MapPinned, Route,
  ShieldCheck, Sparkles, TrendingUp, Wallet, Wrench, Zap, type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OTOHESAP_META } from "@/data/otohesap-meta";
import { OTOHESAP_GROUPS, OTOHESAP_GUIDES } from "@/data/otohesap-content";

const VISUALS: Record<string, { icon: LucideIcon; accent: string }> = {
  "yakit-hesaplama": { icon: Fuel, accent: "#146b5d" },
  "elektrikli-arac-sarj-maliyeti": { icon: Zap, accent: "#0f8a70" },
  "arac-bakim": { icon: Wrench, accent: "#5b5bd6" },
  "mtv-hesaplama": { icon: FileText, accent: "#7655b5" },
  "arac-vs-taksi": { icon: Route, accent: "#5967a8" },
  "tasit-kredisi": { icon: Banknote, accent: "#21825c" },
  "butce-planlama": { icon: Wallet, accent: "#277861" },
  "kredi-karti-hesaplama": { icon: CreditCard, accent: "#6f55a6" },
  "dijital-senet-hesaplama": { icon: FileText, accent: "#a14848" },
  "otv-muafiyeti": { icon: BadgePercent, accent: "#7b55a6" },
  "kasko-deger-sorgulama": { icon: ShieldCheck, accent: "#28778b" },
  "deger-kaybi": { icon: TrendingUp, accent: "#a66d21" },
  "al-sat-analizi": { icon: Gauge, accent: "#b05b2b" },
  "yatirim-kiyaslama": { icon: LineChart, accent: "#8c731c" },
  "arac-ithalat-vergisi": { icon: MapPinned, accent: "#37788d" },
  "lastik-ebat": { icon: Circle, accent: "#a04472" },
  "km-basina-maliyet": { icon: Route, accent: "#2d7465" },
  "yillik-sahip-olma-maliyeti": { icon: Wallet, accent: "#765b34" },
  "yakit-turu-karsilastirma": { icon: Fuel, accent: "#3f7b5f" },
  "motor-gucu-donusturme": { icon: Gauge, accent: "#536b91" },
  "lastik-basinci-donusturme": { icon: Circle, accent: "#8c596e" },
};

const POPULAR_MODULES = ["yakit-hesaplama", "tasit-kredisi", "mtv-hesaplama", "kasko-deger-sorgulama"];

function toolStyle(accent: string): CSSProperties {
  return { "--tool-accent": accent } as CSSProperties;
}

export default function OtoHesapIndexView() {
  return (
    <div className="otohesap-index">
      <Navbar />
      <main>
        <section className="oh-hero">
          <div className="oh-page-container oh-hero-inner">
            <div>
              <span className="oh-eyebrow"><Sparkles size={14} /> Otosöz karar araçları</span>
              <h1>Aracınızla ilgili her hesabı tek yerde netleştirin</h1>
              <p className="oh-hero-copy">
                Araç maliyeti, yakıt, kredi, vergi ve teknik dönüşümleri 21 ücretsiz hesaplama aracıyla sade veriler ve anlaşılır sonuçlarla görün.
              </p>
              <div className="oh-hero-actions">
                <Link className="oh-primary-action" href="/otohesap/yakit-hesaplama">
                  Hemen hesapla <ArrowRight size={15} />
                </Link>
                <a className="oh-secondary-action" href="#hesaplayicilar">Tüm araçları incele</a>
              </div>
            </div>

            <aside className="oh-trust-panel" aria-label="OtoHesap özellikleri">
              <div className="oh-trust-label"><Calculator size={14} /> Hesap merkezi</div>
              <div className="oh-stat-grid">
                <div className="oh-stat">
                  <span className="oh-stat-value">{Object.keys(OTOHESAP_GUIDES).length} araç</span>
                  <span className="oh-stat-label">Satın alma ve kullanım kararları için kapsamlı hesaplayıcılar</span>
                </div>
                <div className="oh-stat">
                  <span className="oh-stat-value">Ücretsiz</span>
                  <span className="oh-stat-label">Kayıt gerektirmez</span>
                </div>
                <div className="oh-stat">
                  <span className="oh-stat-value">Anında</span>
                  <span className="oh-stat-label">Şeffaf sonuç özeti</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <div className="oh-page-container oh-index-body">
          <nav aria-label="İçerik yolu" className="oh-breadcrumb">
            <Link href="/">Ana Sayfa</Link><span aria-hidden="true">/</span><span>OtoHesap</span>
          </nav>

          <section aria-labelledby="popular-title">
            <div className="oh-group-header" style={{ marginTop: 22, marginBottom: 13 }}>
              <span className="oh-group-index"><Clock3 size={17} /></span>
              <div>
                <h2 id="popular-title" style={{ margin: "0 0 3px", fontSize: 19, fontWeight: 500 }}>Hızlı başlangıç</h2>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 12 }}>En sık kullanılan hesaplayıcılara doğrudan ulaşın.</p>
              </div>
            </div>
            <div className="oh-popular-grid">
              {POPULAR_MODULES.map(module => {
                const guide = OTOHESAP_GUIDES[module];
                const visual = VISUALS[module] || { icon: Calculator, accent: "#146b5d" };
                const Icon = visual.icon;
                return (
                  <Link key={module} href={`/otohesap/${module}`} className="oh-popular-card" style={toolStyle(visual.accent)}>
                    <span className="oh-icon-box"><Icon size={19} strokeWidth={1.8} /></span>
                    <span>
                      <span className="oh-popular-title">{guide.label}</span>
                      <span className="oh-popular-meta">Sonucu hemen görün</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <div id="hesaplayicilar">
            {OTOHESAP_GROUPS.map((group, groupIndex) => {
              const groupId = `group-${group.title.replaceAll(" ", "-").toLocaleLowerCase("tr-TR")}`;
              return (
                <section key={group.title} aria-labelledby={groupId} className="oh-group">
                  <div className="oh-group-header">
                    <span className="oh-group-index">{String(groupIndex + 1).padStart(2, "0")}</span>
                    <div>
                      <h2 id={groupId}>{group.title}</h2>
                      <p>{group.description}</p>
                    </div>
                  </div>
                  <div className="oh-tool-grid">
                    {group.modules.map(module => {
                      const guide = OTOHESAP_GUIDES[module];
                      const meta = OTOHESAP_META[module];
                      const visual = VISUALS[module] || { icon: Car, accent: "#146b5d" };
                      const Icon = visual.icon;
                      return (
                        <Link key={module} href={`/otohesap/${module}`} className="oh-tool-card" style={toolStyle(visual.accent)}>
                          <div className="oh-tool-card-head">
                            <span className="oh-icon-box"><Icon size={21} strokeWidth={1.8} /></span>
                            <span className="oh-tool-category">{guide.category}</span>
                          </div>
                          <h3 className="oh-tool-title">{guide.label}</h3>
                          <p className="oh-tool-description">{meta.description}</p>
                          <span className="oh-tool-cta">
                            Hesaplamaya başla
                            <span className="oh-tool-cta-icon"><ArrowRight size={14} /></span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <section className="oh-info-grid">
            <article className="oh-info-card">
              <Calculator size={24} color="var(--text-muted)" strokeWidth={1.7} />
              <h2>Sonuçları nasıl değerlendirmelisiniz?</h2>
              <p>Hesaplayıcılar seçenekleri aynı ölçekte görmenize ve bütçe oluşturmanıza yardımcı olur. Sonuçlar girilen verilere dayalı tahminlerdir; banka teklifi, vergi borcu, poliçe bedeli veya resmî ekspertiz yerine geçmez.</p>
            </article>
            <article className="oh-info-card accent">
              <ShieldCheck size={24} color="var(--oh-accent)" strokeWidth={1.7} />
              <h2>Şeffaf hesaplama</h2>
              <p>Her araç kullandığı veriyi, sonucu ve sonucu değiştirebilecek koşulları açık biçimde gösterir.</p>
            </article>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
