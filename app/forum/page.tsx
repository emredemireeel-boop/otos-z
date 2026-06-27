import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Forum | Otosöz",
    description: "OtoSöz forum konuları artık ana sayfada yer almaktadır.",
    robots: { index: false, follow: true },
};

/**
 * /forum hub sayfası — Google'ın "Deceptive Navigation" cezasını
 * tetikleyen sessiz redirect kaldırıldı. Bunun yerine kullanıcıya
 * açıkça yönlendirme bilgisi veriliyor ve noindex ile işaretleniyor.
 */
export default function ForumPage() {
    return (
        <main style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--background)",
            color: "var(--foreground)",
            padding: "24px",
            textAlign: "center",
        }}>
            <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "16px" }}>
                Forum Konuları
            </h1>
            <p style={{ fontSize: "16px", color: "var(--text-muted)", maxWidth: "480px", lineHeight: 1.6, marginBottom: "24px" }}>
                Forum konularımız artık ana sayfamızda yer almaktadır.
                Aşağıdaki bağlantıdan güncel konulara ulaşabilirsiniz.
            </p>
            <Link
                href="/"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 28px",
                    background: "var(--primary)",
                    color: "white",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "15px",
                    transition: "opacity 0.2s",
                }}
            >
                Ana Sayfaya Git →
            </Link>
        </main>
    );
}
