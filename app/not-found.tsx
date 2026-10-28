import Link from "next/link";

const links = [
    { href: "/", label: "Ana sayfa" },
    { href: "/kutuphane", label: "Kütüphane" },
    { href: "/obd", label: "OBD arıza kodları" },
    { href: "/arac-dna", label: "Araç DNA" },
];

export default function NotFound() {
    return (
        <main style={{ minHeight: "80vh", display: "grid", placeItems: "center", padding: "48px 24px" }}>
            <section style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>
                <p style={{ color: "var(--primary)", fontSize: 56, fontWeight: 800, margin: "0 0 16px" }}>404</p>
                <h1 style={{ fontSize: 28, marginBottom: 16 }}>Sayfa bulunamadı</h1>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                    Aradığınız içerik bu adreste bulunmuyor. Adresi kontrol edebilir veya aşağıdaki bağlantılardan devam edebilirsiniz.
                </p>
                <nav aria-label="Alternatif sayfalar" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, margin: "28px 0" }}>
                    {links.map(link => <Link key={link.href} href={link.href} style={{ color: "var(--primary)" }}>{link.label}</Link>)}
                </nav>
                <form action="/" method="get" style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                    <label htmlFor="not-found-search" style={{ width: "100%", marginBottom: 4 }}>Sitede ara</label>
                    <input id="not-found-search" name="q" type="search" placeholder="Araç, arıza veya konu" style={{ padding: 12, border: "1px solid var(--card-border)", borderRadius: 8, maxWidth: "100%" }} />
                    <button type="submit" style={{ padding: "12px 20px", background: "var(--primary)", color: "white", border: 0, borderRadius: 8 }}>Ara</button>
                </form>
            </section>
        </main>
    );
}
