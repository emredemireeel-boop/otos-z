import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAdminDb, initError } from "@/lib/firebaseAdmin";
import { MessageSquare, Eye, TrendingUp, Search, Plus } from "lucide-react";
import styles from "./forum.module.css";

// 15 dk'da bir yeniden üret — yeni başlıklar hızla forum hub'ında görünür
export const revalidate = 900;

const BASE_URL = "https://otosoz.com";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Forum kategorileri (thread.category değerleriyle eşleşir)
const FORUM_CATEGORIES: { slug: string; name: string }[] = [
    { slug: "genel", name: "Genel" },
    { slug: "teknik-ariza", name: "Teknik & Arıza" },
    { slug: "bakim-tamir", name: "Bakım & Tamir" },
    { slug: "modifiye-aksesuar", name: "Modifiye & Aksesuar" },
    { slug: "elektrikli-hibrit", name: "Elektrikli & Hibrit" },
    { slug: "lastik-jant", name: "Lastik & Jant" },
    { slug: "sigorta-hukuk", name: "Sigorta & Hukuk" },
    { slug: "alim-satim", name: "Alım-Satım" },
    { slug: "deneyim-inceleme", name: "Deneyim & İnceleme" },
    { slug: "marka-model", name: "Marka & Model" },
];

function createSlug(text: string): string {
    if (!text) return "";
    const trMap: Record<string, string> = {
        "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u",
        "Ç": "c", "Ğ": "g", "İ": "i", "Ö": "o", "Ş": "s", "Ü": "u",
    };
    return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, m => trMap[m] || m)
        .toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

interface HubThread {
    id: string;
    title: string;
    category: string;
    authorUsername: string;
    views: number;
    entryCount: number;
    description: string;
    url: string;
    lastActivity: number;
}

function tsToMillis(ts: any): number {
    if (!ts) return 0;
    if (typeof ts?.toMillis === "function") return ts.toMillis();
    if (ts?.seconds) return ts.seconds * 1000;
    return 0;
}

async function fetchThreads(categoryName: string | null): Promise<HubThread[]> {
    if (initError) return [];
    try {
        const db = getAdminDb();
        let q: FirebaseFirestore.Query = db.collection("threads");
        if (categoryName) q = q.where("category", "==", categoryName);
        // Not: category filtresiyle orderBy composite index gerektirebilir; güvenli tarafta
        // createdAt ile sırala, yoksa client-side sort uygula.
        const snap = await (categoryName
            ? q.limit(100).get()
            : q.orderBy("createdAt", "desc").limit(60).get());

        const threads: HubThread[] = snap.docs.map(d => {
            const data = d.data();
            const url = data.urlId
                ? `/forum/${createSlug(data.title || "")}--${data.urlId}`
                : `/forum/${d.id}`;
            return {
                id: d.id,
                title: data.title || "",
                category: data.category || "Genel",
                authorUsername: data.authorUsername || "anonim",
                views: data.views || 0,
                entryCount: data.entryCount || 0,
                description: data.description || data.seoExcerpt || "",
                url,
                lastActivity: tsToMillis(data.lastEntryAt) || tsToMillis(data.createdAt),
            };
        });
        // En son etkinliğe göre sırala
        threads.sort((a, b) => b.lastActivity - a.lastActivity);
        return threads.slice(0, 50);
    } catch (e) {
        console.error("Forum hub fetch error:", e);
        return [];
    }
}

function resolveCategory(kategori: string | null) {
    if (!kategori) return null;
    return FORUM_CATEGORIES.find(c => c.slug === kategori) || null;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    const kategori = typeof params.kategori === "string" ? params.kategori : null;
    const cat = resolveCategory(kategori);

    const title = cat
        ? `${cat.name} Forum Konuları | OtoSöz Topluluk`
        : "OtoSöz Forum - Türkiye'nin Otomobil Topluluğu";
    const description = cat
        ? `${cat.name} kategorisindeki güncel forum konuları, tartışmalar ve sürücü deneyimleri. OtoSöz topluluğuna katıl.`
        : "Araç sahipleri, ustalar ve otomobil tutkunları OtoSöz forumunda buluşuyor. Arıza deneyimleri, teknik tartışmalar, model incelemeleri ve daha fazlası.";
    const canonicalUrl = cat ? `${BASE_URL}/forum?kategori=${cat.slug}` : `${BASE_URL}/forum`;
    const ogUrl = `/api/og?title=${encodeURIComponent(title.split("|")[0].trim())}&desc=${encodeURIComponent(description.slice(0, 100))}`;

    return {
        title,
        description,
        keywords: ["otomobil forumu", "araba forumu", "oto topluluk", "araç deneyimleri", "otomotiv tartışma", cat ? `${cat.name.toLowerCase()} forum` : "türkiye araba forumu"],
        robots: { index: true, follow: true },
        openGraph: {
            title, description, type: "website", url: canonicalUrl, siteName: "OtoSöz",
            images: [{ url: ogUrl, width: 1200, height: 630, alt: title }],
        },
        twitter: { card: "summary_large_image", title, description, images: [ogUrl] },
        alternates: { canonical: canonicalUrl },
    };
}

function buildJsonLd(threads: HubThread[], catName: string | null): string {
    const pageUrl = catName ? `${BASE_URL}/forum?kategori=${createSlug(catName)}` : `${BASE_URL}/forum`;
    const graph: any[] = [
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
                { "@type": "ListItem", position: 2, name: "Forum", item: `${BASE_URL}/forum` },
                ...(catName ? [{ "@type": "ListItem", position: 3, name: catName, item: pageUrl }] : []),
            ],
        },
        {
            "@type": "CollectionPage",
            name: "OtoSöz Forum",
            description: "Türkiye'nin otomobil topluluğu — araç deneyimleri ve teknik tartışmalar.",
            url: pageUrl,
            isPartOf: { "@type": "WebSite", name: "OtoSöz", url: BASE_URL },
        },
    ];
    if (threads.length > 0) {
        graph.push({
            "@type": "ItemList",
            itemListElement: threads.slice(0, 20).map((t, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${BASE_URL}${t.url}`,
                name: t.title,
            })),
        });
    }
    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

function timeAgo(ms: number): string {
    if (!ms) return "";
    const diff = Date.now() - ms;
    const min = Math.floor(diff / 60000);
    if (min < 1) return "az önce";
    if (min < 60) return `${min} dk önce`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} saat önce`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d} gün önce`;
    const mo = Math.floor(d / 30);
    return mo < 12 ? `${mo} ay önce` : `${Math.floor(mo / 12)} yıl önce`;
}

export default async function ForumHubPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const kategori = typeof params.kategori === "string" ? params.kategori : null;
    const cat = resolveCategory(kategori);
    const threads = await fetchThreads(cat?.name || null);

    const totalEntries = threads.reduce((s, t) => s + t.entryCount, 0);
    const totalViews = threads.reduce((s, t) => s + t.views, 0);

    return (
        <div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: buildJsonLd(threads, cat?.name || null) }} />
            <Navbar />
            <main style={{ minHeight: "100vh", background: "var(--background)" }}>
                {/* Başlık bölümü */}
                <div style={{ background: "var(--top-bar-bg)", borderBottom: "1px solid var(--card-border)", padding: "32px 24px" }}>
                    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                        <nav aria-label="breadcrumb" style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
                            <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Ana Sayfa</Link>
                            <span style={{ margin: "0 8px" }}>/</span>
                            <span style={{ color: "var(--foreground)" }}>Forum{cat ? ` / ${cat.name}` : ""}</span>
                        </nav>
                        <h1 style={{ fontSize: "30px", fontWeight: "800", color: "var(--foreground)", marginBottom: "8px", letterSpacing: "-0.5px" }}>
                            {cat ? `${cat.name} Forum Konuları` : "OtoSöz Forum"}
                        </h1>
                        <p style={{ fontSize: "15px", color: "var(--text-muted)", maxWidth: "640px", lineHeight: 1.6, marginBottom: "20px" }}>
                            {cat
                                ? `${cat.name} kategorisindeki güncel tartışmalar ve sürücü deneyimleri.`
                                : "Araç sahipleri, ustalar ve otomobil tutkunları burada buluşuyor. Arıza deneyimlerinden model incelemelerine, teknik sorulardan alım-satım tavsiyelerine kadar her konu forumumuzda."}
                        </p>

                        {/* Kategori sekmeleri */}
                        <div className={styles.categoryScroller} aria-label="Forum kategorileri">
                            <Link href="/forum" style={pillStyle(!cat)}>Tümü</Link>
                            {FORUM_CATEGORIES.map(c => (
                                <Link key={c.slug} href={`/forum?kategori=${c.slug}`} style={pillStyle(cat?.slug === c.slug)}>{c.name}</Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
                    {/* Özet + Yeni Başlık */}
                    <div className={styles.summaryBar}>
                        <div className={styles.summaryStats}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><MessageSquare size={14} /> {threads.length} konu</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><TrendingUp size={14} /> {totalEntries.toLocaleString("tr-TR")} yanıt</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Eye size={14} /> {totalViews.toLocaleString("tr-TR")} görüntülenme</span>
                        </div>
                        <div className={styles.summaryActions}>
                            <form action="/" method="get" className={styles.searchForm}>
                                <Search size={15} aria-hidden="true" />
                                <input name="q" type="search" aria-label="Forumda ara" placeholder="Forumda ara..." />
                            </form>
                            <Link href="/?yeni=1" className={styles.newTopicLink}>
                                <Plus size={16} /> Yeni Başlık Aç
                            </Link>
                        </div>
                    </div>

                    {/* Konu listesi */}
                    {threads.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 24px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px" }}>
                            <MessageSquare size={40} style={{ margin: "0 auto 14px", display: "block", opacity: 0.3 }} />
                            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", marginBottom: "8px" }}>Bu kategoride henüz konu yok</h2>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>İlk başlığı sen aç, tartışmayı başlat.</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {threads.map(t => (
                                <Link key={t.id} href={t.url} className={styles.threadLink}>
                                    <article className={styles.threadCard}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                                                <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", background: "var(--secondary)", padding: "3px 9px", borderRadius: "6px" }}>{t.category}</span>
                                                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>@{t.authorUsername}</span>
                                                {t.lastActivity > 0 && <span style={{ fontSize: "12px", color: "var(--text-subtle)" }}>· {timeAgo(t.lastActivity)}</span>}
                                            </div>
                                            <h2 className={styles.threadTitle}>{t.title}</h2>
                                            {t.description && (
                                                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", margin: 0 }}>{t.description}</p>
                                            )}
                                            <div style={{ display: "flex", gap: "16px", marginTop: "10px", fontSize: "12px", color: "var(--text-muted)" }}>
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}><MessageSquare size={13} /> {t.entryCount} yanıt</span>
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}><Eye size={13} /> {t.views} görüntülenme</span>
                                            </div>
                                        </div>
                                        <div className={styles.answerCount}>
                                            <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--foreground)" }}>{t.entryCount}</div>
                                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>yanıt</div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* SEO içerik bloğu */}
                    <section style={{ marginTop: "32px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px" }}>
                        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", marginBottom: "12px" }}>OtoSöz Forum Hakkında</h2>
                        <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
                            OtoSöz forumu, Türkiye'deki araç sahiplerini, oto ustalarını ve otomobil tutkunlarını bir araya getiren bağımsız bir topluluktur.
                            Aracınızla ilgili bir arıza mı yaşıyorsunuz, bir model hakkında gerçek kullanıcı yorumları mı arıyorsunuz, yoksa ikinci el alım-satım tavsiyesi mi istiyorsunuz?
                            Foruma ücretsiz katılarak sorularınızı sorabilir, deneyimlerinizi paylaşabilir ve binlerce sürücünün bilgisinden faydalanabilirsiniz.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function pillStyle(active: boolean): React.CSSProperties {
    return {
        padding: "7px 15px", borderRadius: "999px", fontSize: "13px", fontWeight: active ? "700" : "500",
        textDecoration: "none", whiteSpace: "nowrap",
        border: `1px solid ${active ? "var(--text-muted)" : "var(--card-border)"}`,
        background: active ? "var(--secondary)" : "var(--card-bg)",
        color: active ? "var(--foreground)" : "var(--text-muted)",
    };
}
