import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Shield, TrendingDown, Car } from "lucide-react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface KaskoPageProps {
    params: Promise<{ slug: string }>;
}

interface Arac {
    marka: string;
    model: string;
    yil: number;
    deger: number;
}

function slugify(marka: string, model: string, yil: number) {
    return `${yil}-${marka}-${model}`
        .toLocaleLowerCase("tr")
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ü/g, "u")
        .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function loadData() {
    const filePath = path.join(process.cwd(), "data", "kasko_deger.json");
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as { guncellenmeTarihi: string; kaynak: string; araclar: Arac[] };
}

function findArac(slug: string) {
    const data = loadData();
    return { arac: data.araclar.find(a => slugify(a.marka, a.model, a.yil) === slug), data };
}

export async function generateMetadata({ params }: KaskoPageProps): Promise<Metadata> {
    const { slug } = await params;
    const { arac } = findArac(slug);
    if (!arac) return { title: "Kasko Değer | OtoSöz" };

    return {
        title: `${arac.yil} ${arac.marka} ${arac.model} Kasko Değeri Ne Kadar? | OtoSöz`,
        description: `${arac.yil} model ${arac.marka} ${arac.model} aracının güncel TSB kasko bedeli ${arac.deger.toLocaleString("tr-TR")} ₺. Yıllara göre değer değişimi ve rakip karşılaştırması.`,
    };
}

export default async function KaskoDegerDetailPage({ params }: KaskoPageProps) {
    const { slug } = await params;
    const { arac, data } = findArac(slug);
    if (!arac) notFound();

    const fmt = (val: number) => val.toLocaleString("tr-TR") + " ₺";

    const yillaraGore = data.araclar
        .filter(a => a.marka === arac.marka && a.model === arac.model)
        .sort((a, b) => b.yil - a.yil);

    const rakipler = data.araclar
        .filter(a => a.yil === arac.yil && a.marka !== arac.marka && Math.abs(a.deger - arac.deger) < arac.deger * 0.15)
        .sort((a, b) => Math.abs(a.deger - arac.deger) - Math.abs(b.deger - arac.deger))
        .slice(0, 6);

    const jsonLd = {
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": `${arac.yil} ${arac.marka} ${arac.model} kasko değeri ne kadar?`, "acceptedAnswer": { "@type": "Answer", "text": `Güncel TSB referans kasko bedeli ${fmt(arac.deger)}'dir.` } },
            { "@type": "Question", "name": `${arac.marka} ${arac.model} kasko yaptırmak zorunlu mu?`, "acceptedAnswer": { "@type": "Answer", "text": "Kasko sigortası zorunlu değildir, isteğe bağlıdır. Kasko bedeli TSB listesindeki değere göre hesaplanır." } }
        ]
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--background)" }}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <main style={{ maxWidth: "800px", margin: "0 auto", padding: "120px 24px 60px" }}>
                <Link href="/kutuphane/kasko-deger" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", marginBottom: "24px", textDecoration: "none", fontWeight: "600" }}>
                    <ArrowLeft size={16} /> Kasko Değer Listesine Dön
                </Link>

                {/* Hero */}
                <div style={{ background: "linear-gradient(135deg, #1E3A5F, #0EA5E9)", borderRadius: "24px", padding: "48px 32px", marginBottom: "40px", boxShadow: "0 20px 50px rgba(14,165,233,0.25)", textAlign: "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px", position: "relative" }}>
                        <span style={{ background: "rgba(255,255,255,0.15)", padding: "6px 14px", borderRadius: "8px", fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.9)" }}>{arac.marka}</span>
                        <span style={{ background: "rgba(255,255,255,0.15)", padding: "6px 14px", borderRadius: "8px", fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.9)" }}>{arac.yil}</span>
                    </div>
                    <h1 style={{ fontSize: "28px", fontWeight: "900", color: "white", marginBottom: "12px", position: "relative" }}>{arac.model}</h1>
                    <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", marginBottom: "24px", position: "relative" }}>Kasko Değeri</p>
                    <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", borderRadius: "16px", padding: "20px 40px", border: "1px solid rgba(255,255,255,0.2)", position: "relative" }}>
                        <span style={{ fontSize: "42px", fontWeight: "900", color: "#FBBF24" }}>{fmt(arac.deger)}</span>
                    </div>
                    <div style={{ marginTop: "12px", fontSize: "13px", color: "rgba(255,255,255,0.5)", position: "relative" }}>Kaynak: {data.kaynak}</div>
                </div>

                {/* Yıllara Göre */}
                {yillaraGore.length > 1 && (
                    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "28px", marginBottom: "24px" }}>
                        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800", color: "var(--foreground)", marginBottom: "20px" }}>
                            <TrendingDown size={22} color="#0EA5E9" /> Yıllara Göre Değer Değişimi
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {yillaraGore.map((a, i) => {
                                const maxD = yillaraGore[0].deger;
                                const pct = (a.deger / maxD) * 100;
                                const active = a.yil === arac.yil;
                                return (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <span style={{ width: "50px", fontSize: "14px", fontWeight: "700", color: active ? "#0EA5E9" : "var(--text-muted)" }}>{a.yil}</span>
                                        <div style={{ flex: 1, height: "28px", background: "var(--background)", borderRadius: "8px", overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${pct}%`, background: active ? "linear-gradient(90deg, #0EA5E9, #38BDF8)" : "var(--border-subtle)", borderRadius: "8px" }} />
                                        </div>
                                        <span style={{ width: "130px", textAlign: "right", fontSize: "14px", fontWeight: active ? "800" : "600", color: active ? "#0EA5E9" : "var(--foreground)" }}>{fmt(a.deger)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Rakipler */}
                {rakipler.length > 0 && (
                    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "28px", marginBottom: "24px" }}>
                        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800", color: "var(--foreground)", marginBottom: "20px" }}>
                            <Car size={22} color="#0EA5E9" /> Benzer Fiyat Aralığındaki Araçlar ({arac.yil})
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
                            {rakipler.map((r, i) => (
                                <Link key={i} href={`/kutuphane/kasko-deger/${slugify(r.marka, r.model, r.yil)}`} style={{ textDecoration: "none" }}>
                                    <div style={{ background: "var(--background)", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "16px" }}>
                                        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>{r.marka}</p>
                                        <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)", marginBottom: "8px", lineHeight: "1.3" }}>{r.model}</p>
                                        <p style={{ fontSize: "16px", fontWeight: "800", color: "#0EA5E9" }}>{fmt(r.deger)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* SSS */}
                <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "28px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--foreground)", marginBottom: "20px" }}>Sıkça Sorulan Sorular</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ background: "var(--background)", padding: "20px", borderRadius: "12px" }}>
                            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginBottom: "8px" }}>{arac.yil} {arac.marka} {arac.model} kasko değeri ne kadar?</h3>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                                {arac.yil} model {arac.marka} {arac.model} aracının güncel TSB referans kasko bedeli <strong>{fmt(arac.deger)}</strong> olarak belirlenmiştir.
                            </p>
                        </div>
                        <div style={{ background: "var(--background)", padding: "20px", borderRadius: "12px" }}>
                            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginBottom: "8px" }}>Bu değer gerçek piyasa fiyatı mıdır?</h3>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                                TSB kasko değeri, piyasa rayiç bedeline yakın bir referans değerdir. İkinci el piyasasında aracın kilometresi, bakım durumu, hasar geçmişi gibi faktörler gerçek fiyatı değiştirebilir.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
