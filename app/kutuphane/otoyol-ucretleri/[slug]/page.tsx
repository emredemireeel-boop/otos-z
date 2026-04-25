import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { readFileSync } from "fs";
import path from "path";
import { ArrowLeft, Car, Truck, Bus, Anchor, AlertTriangle, CheckCircle, Navigation } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

function getTollDataFromSlug(slug: string) {
    const filePath = path.join(process.cwd(), "public", "data", "otoyol_ucretleri.json");
    let data: any[] = [];
    try {
        data = JSON.parse(readFileSync(filePath, "utf-8"));
    } catch {
        return null;
    }
    return data.find((item) => item.id === slug) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const item = getTollDataFromSlug(slug);
    
    if (!item) {
        return { title: "Bulunamadı | OtoSöz" };
    }

    return {
        title: `${item.seoTitle} | OtoSöz`,
        description: item.seoDescription,
        openGraph: {
            title: `${item.seoTitle} | OtoSöz`,
            description: item.seoDescription,
            url: `https://otosoz.com/kutuphane/otoyol-ucretleri/${slug}`,
            siteName: "OtoSöz",
            locale: "tr_TR",
            type: "article",
        },
        alternates: {
            canonical: `/kutuphane/otoyol-ucretleri/${slug}`,
        },
    };
}

const VEHICLE_TYPES = [
    { id: 1, label: "1. Sınıf", desc: "Otomobil", icon: Car },
    { id: 2, label: "2. Sınıf", desc: "Minibüs, Kamyonet", icon: Truck },
    { id: 3, label: "3. Sınıf", desc: "Yolcu Otobüsü (3 Akslı)", icon: Bus },
    { id: 4, label: "4. Sınıf", desc: "Kamyon (4-5 Akslı)", icon: Truck },
    { id: 5, label: "5. Sınıf", desc: "Tır (6+ Akslı)", icon: Truck },
    { id: 6, label: "6. Sınıf", desc: "Motosiklet", icon: Anchor },
];

export default async function OtoyolDetayPage({ params }: PageProps) {
    const { slug } = await params;
    const item = getTollDataFromSlug(slug);

    if (!item) {
        notFound();
    }

    // JSON-LD schema for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": item.seoTitle,
        "description": item.seoDescription,
        "articleBody": item.content,
        "author": {
            "@type": "Organization",
            "name": "OtoSöz"
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--background)", paddingTop: "80px" }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <main style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
                {/* Back Button */}
                <Link href="/kutuphane?kategori=otoyol-ucretleri" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", textDecoration: "none", fontSize: "14px", fontWeight: "600", marginBottom: "32px", padding: "8px 14px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px" }}>
                    <ArrowLeft size={16} /> Otoyol ve Köprü Ücretleri
                </Link>

                <article>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                        <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Navigation size={32} color="#22C55E" />
                        </div>
                        <div>
                            <span style={{ fontSize: "12px", fontWeight: "700", color: "#22C55E", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.group}</span>
                            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--foreground)", margin: "4px 0" }}>{item.name}</h1>
                            <p style={{ fontSize: "15px", color: "var(--text-muted)", margin: 0 }}>{item.desc}</p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "32px", marginBottom: "32px" }}>
                        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--foreground)", marginBottom: "16px" }}>Geçiş Hakkında Bilgi</h2>
                        <p style={{ fontSize: "16px", color: "var(--foreground)", lineHeight: "1.8", marginBottom: "24px" }}>
                            {item.content}
                        </p>

                        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <AlertTriangle size={20} color="#F59E0B" /> Kurallar ve Uyarılar
                        </h3>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                            {item.rules.map((rule: string, idx: number) => (
                                <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "15px", color: "var(--foreground)", lineHeight: "1.6" }}>
                                    <CheckCircle size={18} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                                    <span>{rule}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pricing Table */}
                    <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--foreground)", marginBottom: "24px" }}>Araç Sınıfına Göre Geçiş Ücretleri (2026)</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
                        {VEHICLE_TYPES.map((type) => {
                            const price = item.prices[type.id.toString()];
                            const Icon = type.icon;
                            return (
                                <div key={type.id} style={{
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--card-border)",
                                    borderRadius: "14px",
                                    padding: "24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px",
                                    position: "relative",
                                    overflow: "hidden"
                                }}>
                                    {/* Background decorative Icon */}
                                    <Icon size={120} style={{ position: "absolute", bottom: "-20px", right: "-20px", opacity: 0.03, color: "var(--foreground)" }} />
                                    
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Icon size={20} color="var(--foreground)" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)" }}>{type.label}</div>
                                            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{type.desc}</div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "16px" }}>
                                        {price !== null && price !== undefined ? (
                                            <div style={{ fontSize: "28px", fontWeight: "800", color: "#22C55E" }}>{price.toFixed(2)} ₺</div>
                                        ) : (
                                            <div style={{ fontSize: "20px", fontWeight: "700", color: "#EF4444", display: "flex", alignItems: "center", gap: "6px" }}>
                                                <AlertTriangle size={18} /> Yasaklı / Yok
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </article>
            </main>
        </div>
    );
}
