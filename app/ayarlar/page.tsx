"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Bell, Lock, Globe, Shield, Trash2, DollarSign, ArrowRight, Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState("notifications");
    const [settings, setSettings] = useState({
        // Notifications
        emailNotifications: true,
        pushNotifications: true,
        messageNotifications: true,
    });

    const tabs = [
        { id: "notifications", name: "Bildirimler", icon: Bell },
        { id: "appearance", name: "Görünüm", icon: Moon },
        { id: "expert", name: "Uzman Ol", icon: DollarSign },
        { id: "account", name: "Hesap", icon: Lock },
        { id: "about", name: "Hakkında", icon: Globe },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--background)',
            paddingTop: '60px',
        }}>
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '40px 20px',
            }}>
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    color: 'var(--foreground)',
                    marginBottom: '8px',
                }}>Ayarlar</h1>
                <p style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '32px',
                }}>Hesap ayarlarınızı ve tercihlerinizi yönetin</p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '250px 1fr',
                    gap: '32px',
                }}>
                    {/* Tabs */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '12px',
                        padding: '12px',
                        height: 'fit-content',
                    }}>
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        background: activeTab === tab.id ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: activeTab === tab.id ? 'var(--primary)' : 'var(--foreground)',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        marginBottom: '4px',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 107, 0, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = activeTab === tab.id ? 'rgba(255, 107, 0, 0.1)' : 'transparent'}
                                >
                                    <Icon size={18} />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '12px',
                        padding: '32px',
                    }}>
                        {activeTab === "notifications" && (
                            <div>
                                <h2 style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    color: 'var(--foreground)',
                                    marginBottom: '24px',
                                }}>Bildirim Tercihleri</h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px',
                                        background: 'var(--secondary)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                    }}>
                                        <div>
                                            <div style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: 'var(--foreground)',
                                                marginBottom: '4px',
                                            }}>E-posta Bildirimleri</div>
                                            <div style={{
                                                fontSize: '12px',
                                                color: 'rgba(255,255,255,0.6)',
                                            }}>Önemli güncellemeler için e-posta alın</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.emailNotifications}
                                            onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                        />
                                    </label>

                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px',
                                        background: 'var(--secondary)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                    }}>
                                        <div>
                                            <div style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: 'var(--foreground)',
                                                marginBottom: '4px',
                                            }}>Push Bildirimleri</div>
                                            <div style={{
                                                fontSize: '12px',
                                                color: 'rgba(255,255,255,0.6)',
                                            }}>Tarayıcı üzerinden bildirim alın</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.pushNotifications}
                                            onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                        />
                                    </label>

                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px',
                                        background: 'var(--secondary)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                    }}>
                                        <div>
                                            <div style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: 'var(--foreground)',
                                                marginBottom: '4px',
                                            }}>Mesaj Bildirimleri</div>
                                            <div style={{
                                                fontSize: '12px',
                                                color: 'rgba(255,255,255,0.6)',
                                            }}>Yeni mesajlar için bildirim alın</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.messageNotifications}
                                            onChange={(e) => setSettings({ ...settings, messageNotifications: e.target.checked })}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        {activeTab === "expert" && (
                            <div>
                                <h2 style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    color: 'var(--foreground)',
                                    marginBottom: '24px',
                                }}>Uzman Ol</h2>

                                <div style={{
                                    padding: '32px',
                                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 152, 0, 0.1))',
                                    border: '1px solid rgba(255, 215, 0, 0.3)',
                                    borderRadius: '16px',
                                    marginBottom: '24px',
                                    textAlign: 'center',
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        margin: '0 auto 20px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #FFD700, #FFB300)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <DollarSign style={{ width: '40px', height: '40px', color: 'white' }} />
                                    </div>
                                    <h3 style={{
                                        fontSize: '24px',
                                        fontWeight: '700',
                                        color: '#FFD700',
                                        marginBottom: '12px',
                                    }}>Otosöz ile Uzman Olun!</h3>
                                    <p style={{
                                        fontSize: '14px',
                                        color: 'rgba(255,255,255,0.8)',
                                        marginBottom: '24px',
                                        lineHeight: '1.6',
                                    }}>
                                        Toplulukta aktif olun, profesyonel kimliÃ„şinizi doÃ„şrulayın ve para kazanma özelliÃ„şini aktif edin.
                                    </p>
                                    <Link href="/para-kazan">
                                        <button style={{
                                            padding: '14px 28px',
                                            background: 'linear-gradient(135deg, #FFD700, #FFB300)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                        }}>
                                            Şartları Gör
                                            <ArrowRight size={20} />
                                        </button>
                                    </Link>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '16px',
                                }}>
                                    <div style={{
                                        padding: '20px',
                                        background: 'var(--secondary)',
                                        borderRadius: '12px',
                                    }}>
                                        <div style={{
                                            fontSize: '32px',
                                            fontWeight: '700',
                                            color: 'var(--primary)',
                                            marginBottom: '8px',
                                        }}>4</div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: 'rgba(255,255,255,0.8)',
                                        }}>Temel Gereksinim</div>
                                    </div>
                                    <div style={{
                                        padding: '20px',
                                        background: 'var(--secondary)',
                                        borderRadius: '12px',
                                    }}>
                                        <div style={{
                                            fontSize: '32px',
                                            fontWeight: '700',
                                            color: '#FFD700',
                                            marginBottom: '8px',
                                        }}>1</div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: 'rgba(255,255,255,0.8)',
                                        }}>Profesyonel DoÃ„şrulama</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "account" && (
                            <div>
                                <h2 style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    color: 'var(--foreground)',
                                    marginBottom: '24px',
                                }}>Hesap Ayarları</h2>

                                <div style={{ marginBottom: '32px' }}>
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: 'var(--foreground)',
                                        marginBottom: '16px',
                                    }}>Şifre Değiştir</h3>

                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            color: 'var(--foreground)',
                                            marginBottom: '8px',
                                        }}>Mevcut Şifre</label>
                                        <input
                                            type="password"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                background: 'var(--secondary)',
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '8px',
                                                color: 'var(--foreground)',
                                                fontSize: '14px',
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            color: 'var(--foreground)',
                                            marginBottom: '8px',
                                        }}>Yeni Şifre</label>
                                        <input
                                            type="password"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                background: 'var(--secondary)',
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '8px',
                                                color: 'var(--foreground)',
                                                fontSize: '14px',
                                            }}
                                        />
                                    </div>

                                    <button style={{
                                        padding: '10px 20px',
                                        background: 'var(--primary)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}>
                                        Şifreyi Güncelle
                                    </button>
                                </div>

                                <div style={{
                                    padding: '24px',
                                    background: 'rgba(255, 68, 68, 0.1)',
                                    border: '1px solid rgba(255, 68, 68, 0.3)',
                                    borderRadius: '12px',
                                }}>
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#ff4444',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}>
                                        <Trash2 size={18} />
                                        Tehlikeli Bölge
                                    </h3>
                                    <p style={{
                                        fontSize: '13px',
                                        color: 'rgba(255,255,255,0.6)',
                                        marginBottom: '16px',
                                    }}>
                                        Hesabınızı silmek tüm verilerinizin kalıcı olarak silinmesine neden olur. Bu işlem geri alınamaz.
                                    </p>
                                    <button style={{
                                        padding: '10px 20px',
                                        background: 'transparent',
                                        border: '1px solid #ff4444',
                                        borderRadius: '8px',
                                        color: '#ff4444',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}>
                                        Hesabı Sil
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "about" && (
                            <div>
                                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        background: 'linear-gradient(135deg, var(--primary), #FFD700)',
                                        borderRadius: '20px',
                                        margin: '0 auto 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 10px 30px rgba(255, 107, 0, 0.3)'
                                    }}>
                                        <Globe style={{ width: '40px', height: '40px', color: 'white' }} />
                                    </div>
                                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px', background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        Otosöz
                                    </h2>
                                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
                                        Türkiye'nin yapay zeka destekli en kapsamlı ikinci el araç pazar yeri ve analiz platformu.
                                    </p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                                    {[
                                        { title: "Veri Odaklı", desc: "Milyonlarca veri noktasıyla en doÃ„şru fiyat analizi.", icon: "📊" },
                                        { title: "Güvenli", desc: "DoÃ„şrulanmış satıcılar ve Şeffaf ekspertiz raporları.", icon: "🛠️¡ïÂ¸Â�" },
                                        { title: "Hızlı", desc: "Saniyeler içinde ilan verin, hayalinizdeki aracı bulun.", icon: "⚡" }
                                    ].map((item, idx) => (
                                        <div key={idx} style={{
                                            padding: '20px',
                                            background: 'var(--secondary)',
                                            borderRadius: '16px',
                                            border: '1px solid var(--card-border)',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                                            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'white' }}>{item.title}</h3>
                                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    padding: '30px',
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                    borderRadius: '16px',
                                    border: '1px solid var(--card-border)',
                                }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: 'white' }}>İletişim & Künye</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>E-posta</span>
                                            <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>otosoz.destek@gmail.com</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Genel Merkez</span>
                                            <span style={{ color: 'white', fontWeight: '500', fontSize: '14px', textAlign: 'right' }}>Teknopark İzmir, A1 Blok<br />Urla, İzmir</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Versiyon</span>
                                            <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px' }}>v1.0.0 Alpha</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Ã‚© 2024 Otosöz Inc. Tüm hakları saklıdır.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === "appearance" && (
                            <div className="animate-fadeInUp">
                                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: 'var(--foreground)' }}>Görünüm Ayarları</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Uygulama temasını tercihlerinize göre özelleştirin.</p>

                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <button
                                            onClick={() => theme === 'light' && toggleTheme()}
                                            style={{
                                                padding: '20px',
                                                borderRadius: '12px',
                                                background: theme === 'dark' ? 'rgba(255, 107, 0, 0.1)' : 'var(--secondary)',
                                                border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--card-border)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                color: theme === 'dark' ? 'var(--primary)' : 'var(--text-muted)'
                                            }}
                                        >
                                            <div style={{
                                                padding: '12px',
                                                borderRadius: '50%',
                                                background: theme === 'dark' ? 'rgba(255, 107, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                                            }}>
                                                <Moon size={24} />
                                            </div>
                                            <span style={{ fontWeight: '700' }}>Karanlık Mod</span>
                                        </button>

                                        <button
                                            onClick={() => theme === 'dark' && toggleTheme()}
                                            style={{
                                                padding: '20px',
                                                borderRadius: '12px',
                                                background: theme === 'light' ? 'rgba(0, 90, 226, 0.1)' : 'var(--secondary)',
                                                border: theme === 'light' ? '2px solid #005ae2' : '1px solid var(--card-border)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                color: theme === 'light' ? '#005ae2' : 'var(--text-muted)'
                                            }}
                                        >
                                            <div style={{
                                                padding: '12px',
                                                borderRadius: '50%',
                                                background: theme === 'light' ? 'rgba(0, 90, 226, 0.2)' : 'rgba(255,255,255,0.05)',
                                            }}>
                                                <Sun size={24} />
                                            </div>
                                            <span style={{ fontWeight: '700' }}>Aydınlık Mod</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
