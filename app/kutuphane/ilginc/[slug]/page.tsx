import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { readFileSync } from "fs";
import path from "path";
import { Lightbulb, ShieldAlert, Zap, CheckCircle, XCircle, ArrowLeft, ExternalLink } from "lucide-react";

interface PageProps {
    params: { slug: string };
}

function getDataFromSlug(slug: string) {
    // slug formatı: "baslik-buraya--id"
    const parts = slug.split("--");
    const id = parts[parts.length - 1];

    const filePath = path.join(process.cwd(), "public", "data", "interesting_information.json");
    let data: any;
    try {
        data = JSON.parse(readFileSync(filePath, "utf-8"));
    } catch {
        return null;
    }
    const facts = data.interestingFacts;
    if (!facts) return null;

    // Tüm kategorilerde ara
    const allItems = [
        ...((facts.dailyTips || []).map((t: any) => ({ ...t, _type: "tip" }))),
        ...((facts.quickFacts || []).map((f: any) => ({ ...f, _type: "fact" }))),
        ...((facts.mythBusters || []).map((m: any) => ({ ...m, _type: "myth" }))),
        ...((facts.checklists || []).map((c: any) => ({ ...c, _type: "checklist" }))),
        ...((facts.doAndDont || []).map((d: any) => ({ ...d, _type: "doAndDont" }))),
    ];

    return allItems.find((item) => item.id === id) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const item = getDataFromSlug(params.slug);
    if (!item) {
        return { title: "Bulunamadı | OtoSöz" };
    }

    const title = item.title || item.myth || item.text?.slice(0, 80) || "İlginç Bilgi";
    const description = item.tip || item.truth || item.text || item.items?.join(", ").slice(0, 160) || "";

    return {
        title: `${title} | OtoSöz İlginç Bilgiler`,
        description: description.slice(0, 160),
        openGraph: {
            title: `${title} | OtoSöz`,
            description: description.slice(0, 160),
            url: `https://otosoz.com/kutuphane/ilginc/${params.slug}`,
            siteName: "OtoSöz",
            locale: "tr_TR",
            type: "article",
        },
        alternates: {
            canonical: `/kutuphane/ilginc/${params.slug}`,
        },
        other: {
            "article:section": "İlginç Otomotiv Bilgileri",
        },
    };
}

export default function IlgincDetayPage({ params }: PageProps) {
    const item = getDataFromSlug(params.slug);

    if (!item) {
        notFound();
    }

    const renderContent = () => {
        switch (item._type) {
            case "tip":
                return (
                    <article>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Lightbulb size={28} color="#F59E0B" />
                            </div>
                            <div>
                                <span style={{ fontSize: "12px", fontWeight: "700", color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.5px" }}>Günlük İpucu</span>
                                <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>{item.title}</h1>
                            </div>
                        </div>
                        <p style={{ fontSize: "17px", color: "var(--text-muted)", lineHeight: "1.8", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "28px" }}>
                            {item.tip}
                        </p>
                        {item.category && (
                            <div style={{ marginTop: "16px" }}>
                                <span style={{ padding: "6px 14px", background: "rgba(245,158,11,0.1)", color: "#F59E0B", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>
                                    {item.category}
                                </span>
                            </div>
                        )}
                    </article>
                );

            case "myth":
                return (
                    <article>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ShieldAlert size={28} color="#EF4444" />
                            </div>
                            <div>
                                <span style={{ fontSize: "12px", fontWeight: "700", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.5px" }}>Mit Kırıcı</span>
                                <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>Yaygın Yanış Bilgi</h1>
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "24px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                                    <XCircle size={20} color="#EF4444" />
                                    <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#EF4444", margin: 0, textTransform: "uppercase" }}>Yanlış İnanış</h2>
                                </div>
                                <p style={{ fontSize: "16px", color: "var(--foreground)", lineHeight: "1.7", fontWeight: "600" }}>{item.myth}</p>
                            </div>
                            <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "16px", padding: "24px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                                    <CheckCircle size={20} color="#10B981" />
                                    <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#10B981", margin: 0, textTransform: "uppercase" }}>Gerçek</h2>
                                </div>
                                <p style={{ fontSize: "16px", color: "var(--foreground)", lineHeight: "1.7" }}>{item.truth}</p>
                            </div>
                        </div>
                        {item.category && (
                            <div style={{ marginTop: "20px" }}>
                                <span style={{ padding: "6px 14px", background: "rgba(239,68,68,0.1)", color: "#EF4444", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>
                                    {item.category}
                                </span>
                            </div>
                        )}
                    </article>
                );

            case "fact":
                return (
                    <article>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Zap size={28} color="#F59E0B" />
                            </div>
                            <div>
                                <span style={{ fontSize: "12px", fontWeight: "700", color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.5px" }}>Hızlı Bilgi</span>
                                <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>Otomotiv Gerçeği</h1>
                            </div>
                        </div>
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "32px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
                            <Zap size={32} color="#F59E0B" style={{ flexShrink: 0, marginTop: "4px" }} />
                            <p style={{ fontSize: "18px", color: "var(--foreground)", lineHeight: "1.8", fontWeight: "500" }}>{item.text}</p>
                        </div>
                        {item.category && (
                            <div style={{ marginTop: "16px" }}>
                                <span style={{ padding: "6px 14px", background: "rgba(245,158,11,0.1)", color: "#F59E0B", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>
                                    {item.category}
                                </span>
                            </div>
                        )}
                    </article>
                );

            case "checklist":
                return (
                    <article>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <CheckCircle size={28} color="#10B981" />
                            </div>
                            <div>
                                <span style={{ fontSize: "12px", fontWeight: "700", color: "#10B981", textTransform: "uppercase", letterSpacing: "0.5px" }}>Kontrol Listesi</span>
                                <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>{item.title}</h1>
                            </div>
                        </div>
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            {(item.items || []).map((it: string, idx: number) => (
                                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px", background: "var(--background)", borderRadius: "10px" }}>
                                    <CheckCircle size={18} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                                    <span style={{ fontSize: "15px", color: "var(--foreground)", lineHeight: "1.6" }}>{it}</span>
                                </div>
                            ))}
                        </div>
                    </article>
                );

            case "doAndDont":
                return (
                    <article>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>{item.title}</h1>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "16px", padding: "24px" }}>
                                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#10B981", marginBottom: "16px" }}>✓ Yap</h2>
                                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {(item.do?.points || []).map((p: string, i: number) => (
                                        <li key={i} style={{ display: "flex", gap: "10px", fontSize: "15px", color: "var(--foreground)", lineHeight: "1.6" }}>
                                            <span style={{ color: "#10B981", fontWeight: "700" }}>✓</span> {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "24px" }}>
                                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#EF4444", marginBottom: "16px" }}>✗ Yapma</h2>
                                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {(item.dont?.points || []).map((p: string, i: number) => (
                                        <li key={i} style={{ display: "flex", gap: "10px", fontSize: "15px", color: "var(--foreground)", lineHeight: "1.6" }}>
                                            <span style={{ color: "#EF4444", fontWeight: "700" }}>✗</span> {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </article>
                );

            default:
                return null;
        }
    };

    // JSON-LD structured data
    const jsonLd = item._type === "myth" ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": item.myth,
            "acceptedAnswer": { "@type": "Answer", "text": item.truth }
        }]
    } : item._type === "tip" ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": item.title,
        "description": item.tip,
    } : null;

    return (
        <div style={{ minHeight: "100vh", background: "var(--background)", paddingTop: "80px" }}>
            {jsonLd && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            )}

            <main style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
                {/* Geri dön */}
                <Link href="/kutuphane?kategori=ilginc-bilgiler" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", textDecoration: "none", fontSize: "14px", fontWeight: "600", marginBottom: "32px", padding: "8px 14px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px" }}>
                    <ArrowLeft size={16} /> İlginç Bilgiler
                </Link>

                {/* İçerik */}
                <div>
                    {renderContent()}
                </div>

                {/* Alt bağlantı */}
                <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link href="/kutuphane?kategori=ilginc-bilgiler" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--primary)", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
                        <ArrowLeft size={16} /> Tüm İlginç Bilgiler
                    </Link>
                    <Link href="/forum" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", textDecoration: "none", fontSize: "13px" }}>
                        Forumda Tartış <ExternalLink size={14} />
                    </Link>
                </div>
            </main>
        </div>
    );
}
