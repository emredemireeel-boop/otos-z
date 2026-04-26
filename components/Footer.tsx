"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'var(--secondary)',
            borderTop: '1px solid var(--card-border)',
            padding: '60px 24px 30px',
            marginTop: '80px',
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
            }}>
                {/* Main Footer Content */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '40px',
                    marginBottom: '40px',
                }}>
                    {/* Logo & Description */}
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '16px',
                        }}>
                            <div style={{
                                position: 'relative',
                                width: '40px',
                                height: '40px',
                            }}>
                                <Image
                                    src="/white_logo.svg"
                                    alt="Otosöz Logo"
                                    fill
                                    style={{ objectFit: 'contain', filter: 'var(--logo-filter)' }}
                                />
                            </div>
                            <span style={{
                                fontSize: '20px',
                                fontWeight: '800',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textTransform: 'uppercase'
                            }}>
                                Otosöz
                            </span>
                        </div>
                        <p style={{
                            color: 'var(--foreground)',
                            fontSize: '15px',
                            lineHeight: '1.6',
                            fontWeight: '600',
                            fontStyle: 'italic',
                            opacity: 0.9,
                        }}>
                            "Tek renk değil çok renk"
                        </p>
                    </div>

                    {/* Links - Forum */}
                    <div>
                        <h4 style={{
                            color: 'var(--foreground)',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '16px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}>
                            Forum
                        </h4>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}>
                            {['Öne Çıkanlar', 'Yeni Konular', 'Yazarlar', 'İstatistikler'].map((item) => (
                                <Link key={item} href="/" style={{ // Assuming links go to home/forum for now
                                    color: 'var(--text-muted)',
                                    fontSize: '14px',
                                    transition: 'color 0.3s ease',
                                    textDecoration: 'none'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links - Kurumsal */}
                    <div>
                        <h4 style={{
                            color: 'var(--foreground)',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '16px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}>
                            Kurumsal
                        </h4>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}>
                            <Link href="/hakkimizda" style={{
                                color: 'var(--text-muted)',
                                fontSize: '14px',
                                transition: 'color 0.3s ease',
                                textDecoration: 'none'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                                Hakkımızda
                            </Link>
                            <Link href="/kullanim-sartlari" style={{
                                color: 'var(--text-muted)',
                                fontSize: '14px',
                                transition: 'color 0.3s ease',
                                textDecoration: 'none'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                                Kullanım Şartları
                            </Link>
                            <Link href="/gizlilik-politikasi" style={{
                                color: 'var(--text-muted)',
                                fontSize: '14px',
                                transition: 'color 0.3s ease',
                                textDecoration: 'none'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                                Gizlilik Politikası
                            </Link>
                            <Link href="/iletisim" style={{
                                color: 'var(--text-muted)',
                                fontSize: '14px',
                                transition: 'color 0.3s ease',
                                textDecoration: 'none'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                                İletişim
                            </Link>
                        </div>
                    </div>


                </div>

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: 'var(--card-border)',
                    marginBottom: '24px',
                }} />

                {/* Bottom Footer */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '13px',
                    }}>
                        © {currentYear} Otosöz. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </footer>
    );
}
