"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    Bell, Lock, Globe, Trash2, ArrowRight, Moon, Sun, Award,
    MessageSquare, Store, BarChart3, Dna, ClipboardCheck, Shield,
    CheckCircle, ExternalLink, Loader2, MapPin, Phone, Building2, Plus, X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getQuestProgress, QUEST_DEFINITIONS, type QuestProgress } from "@/lib/questService";
import { addBusiness, BUSINESS_TYPES, type BusinessType } from "@/lib/businessService";

const QUEST_ICONS: Record<string, React.ReactNode> = {
    MessageSquare: <MessageSquare size={20} />,
    Store: <Store size={20} />,
    BarChart3: <BarChart3 size={20} />,
    Dna: <Dna size={20} />,
    ClipboardCheck: <ClipboardCheck size={20} />,
    Shield: <Shield size={20} />,
};

export default function SettingsPage() {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab") === "usta" ? "usta" : "notifications";
    const [activeTab, setActiveTab] = useState(initialTab);
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        messageNotifications: true,
    });

    // Quest state
    const [questProgress, setQuestProgress] = useState<QuestProgress | null>(null);
    const [questLoading, setQuestLoading] = useState(false);
    const [showBusinessForm, setShowBusinessForm] = useState(false);
    const [bizForm, setBizForm] = useState({ name: "", type: "tamirci" as BusinessType, city: "", district: "", phone: "", address: "" });
    const [bizSubmitting, setBizSubmitting] = useState(false);
    const [bizSuccess, setBizSuccess] = useState(false);

    useEffect(() => {
        if (activeTab === "usta" && user && !questProgress) {
            setQuestLoading(true);
            getQuestProgress(user.id.toString()).then(p => {
                setQuestProgress(p);
                setQuestLoading(false);
            }).catch(() => setQuestLoading(false));
        }
    }, [activeTab, user, questProgress]);

    const handleBizSubmit = async () => {
        if (!user || !bizForm.name.trim() || !bizForm.city.trim()) return;
        setBizSubmitting(true);
        try {
            await addBusiness({ ...bizForm, addedBy: user.id.toString(), addedByUsername: user.username });
            setBizSuccess(true);
            setShowBusinessForm(false);
            setBizForm({ name: "", type: "tamirci", city: "", district: "", phone: "", address: "" });
            // Refresh quest progress
            const p = await getQuestProgress(user.id.toString());
            setQuestProgress(p);
            setTimeout(() => setBizSuccess(false), 3000);
        } catch (e) { console.error(e); }
        setBizSubmitting(false);
    };

    const isUsta = user?.role === "usta" || user?.role === "admin" || user?.role === "moderator";

    const tabs = [
        { id: "notifications", name: "Bildirimler", icon: Bell },
        { id: "appearance", name: "Görünüm", icon: Moon },
        { id: "usta", name: "Usta Ol!", icon: Award },
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
                    color: 'var(--text-muted)',
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
                                        background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: activeTab === tab.id ? '#3B82F6' : 'var(--foreground)',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        marginBottom: '4px',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = activeTab === tab.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent'}
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
                                                color: 'var(--text-muted)',
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
                                                color: 'var(--text-muted)',
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
                                                color: 'var(--text-muted)',
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

                        {activeTab === "usta" && (
                            <div>
                                {/* Header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: isUsta ? 'rgba(139,92,246,0.15)' : 'rgba(255,107,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Award size={24} color={isUsta ? '#8B5CF6' : 'var(--primary)'} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>
                                            {isUsta ? 'Usta Statünüz Aktif!' : 'Usta Ol!'}
                                        </h2>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                                            {isUsta ? 'Tüm ayrıcalıkların kilidi açıldı' : 'Görevleri tamamla, Usta ol!'}
                                        </p>
                                    </div>
                                </div>

                                {questLoading ? (
                                    <div style={{ textAlign: 'center', padding: '40px' }}>
                                        <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--primary)' }} />
                                        <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '14px' }}>Görevler yükleniyor...</p>
                                    </div>
                                ) : isUsta && !questProgress ? (
                                    <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(139,92,246,0.06)', borderRadius: '16px', border: '1px solid rgba(139,92,246,0.2)' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#8B5CF6', marginBottom: '8px' }}>Zaten Usta Statüsündesiniz!</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Tüm forum özelliklerini kullanabilirsiniz.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Progress Bar */}
                                        <div style={{ marginBottom: '24px', background: 'var(--secondary)', borderRadius: '12px', padding: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>İlerleme</span>
                                                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>{questProgress?.completedCount || 0}/6</span>
                                            </div>
                                            <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, var(--primary), #8B5CF6)', width: `${((questProgress?.completedCount || 0) / 6) * 100}%`, transition: 'width 0.5s ease' }} />
                                            </div>
                                        </div>

                                        {/* Quest Cards */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                                            {QUEST_DEFINITIONS.map(quest => {
                                                const done = questProgress?.[quest.key] || false;
                                                const isBusinessQuest = quest.key === "businessAdded";
                                                return (
                                                    <div key={quest.key} style={{
                                                        display: 'flex', alignItems: 'center', gap: '14px',
                                                        padding: '14px 16px', borderRadius: '12px',
                                                        background: done ? 'rgba(16,185,129,0.06)' : 'var(--secondary)',
                                                        border: `1px solid ${done ? 'rgba(16,185,129,0.25)' : 'var(--card-border)'}`,
                                                        transition: 'all 0.2s',
                                                    }}>
                                                        <div style={{
                                                            width: '40px', height: '40px', borderRadius: '10px',
                                                            background: done ? 'rgba(16,185,129,0.15)' : `${quest.color}15`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: done ? '#10B981' : quest.color, flexShrink: 0,
                                                        }}>
                                                            {done ? <CheckCircle size={20} /> : QUEST_ICONS[quest.icon]}
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: done ? '#10B981' : 'var(--foreground)', textDecoration: done ? 'line-through' : 'none' }}>
                                                                {quest.title}
                                                            </p>
                                                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{quest.description}</p>
                                                        </div>
                                                        {!done && (
                                                            isBusinessQuest ? (
                                                                <button onClick={() => setShowBusinessForm(true)} style={{
                                                                    padding: '7px 14px', borderRadius: '8px', border: 'none',
                                                                    background: quest.color, color: 'white', fontSize: '12px',
                                                                    fontWeight: '700', cursor: 'pointer', display: 'flex',
                                                                    alignItems: 'center', gap: '5px', flexShrink: 0,
                                                                }}>
                                                                    <Plus size={14} /> Ekle
                                                                </button>
                                                            ) : (
                                                                <Link href={quest.href}>
                                                                    <button style={{
                                                                        padding: '7px 14px', borderRadius: '8px', border: 'none',
                                                                        background: quest.color, color: 'white', fontSize: '12px',
                                                                        fontWeight: '700', cursor: 'pointer', display: 'flex',
                                                                        alignItems: 'center', gap: '5px', flexShrink: 0,
                                                                    }}>
                                                                        <ExternalLink size={14} /> Git
                                                                    </button>
                                                                </Link>
                                                            )
                                                        )}
                                                        {done && <span style={{ fontSize: '11px', fontWeight: '700', color: '#10B981', flexShrink: 0 }}>Tamamlandı</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Business Form Modal */}
                                        {showBusinessForm && (
                                            <div style={{ background: 'var(--secondary)', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid var(--card-border)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Building2 size={18} color="#10B981" /> Oto İşletme Ekle
                                                    </h4>
                                                    <button onClick={() => setShowBusinessForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                                    <input placeholder="İşletme Adı *" value={bizForm.name} onChange={e => setBizForm({...bizForm, name: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--foreground)' }} />
                                                    <select value={bizForm.type} onChange={e => setBizForm({...bizForm, type: e.target.value as BusinessType})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--foreground)' }}>
                                                        {BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                                    </select>
                                                    <input placeholder="Şehir *" value={bizForm.city} onChange={e => setBizForm({...bizForm, city: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--foreground)' }} />
                                                    <input placeholder="İlçe" value={bizForm.district} onChange={e => setBizForm({...bizForm, district: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--foreground)' }} />
                                                    <input placeholder="Telefon" value={bizForm.phone} onChange={e => setBizForm({...bizForm, phone: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--foreground)' }} />
                                                    <input placeholder="Adres" value={bizForm.address} onChange={e => setBizForm({...bizForm, address: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--foreground)' }} />
                                                </div>
                                                <button onClick={handleBizSubmit} disabled={bizSubmitting || !bizForm.name.trim() || !bizForm.city.trim()} style={{
                                                    width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                                                    background: '#10B981', color: 'white', fontSize: '14px', fontWeight: '700',
                                                    cursor: 'pointer', opacity: (!bizForm.name.trim() || !bizForm.city.trim()) ? 0.4 : 1,
                                                }}>
                                                    {bizSubmitting ? 'Gönderiliyor...' : 'İşletmeyi Gönder (Admin Onayına Düşer)'}
                                                </button>
                                            </div>
                                        )}

                                        {bizSuccess && (
                                            <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <CheckCircle size={16} color="#10B981" />
                                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#10B981' }}>İşletme başarıyla gönderildi! Admin onayından sonra yayına alınacak.</span>
                                            </div>
                                        )}

                                        {/* Info Box */}
                                        <div style={{ padding: '14px 16px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                            <strong style={{ color: 'var(--foreground)' }}>Nasıl çalışır?</strong><br />
                                            6 görevi tamamlayın ve otomatik olarak Usta statüsüne yükselin. Usta olunca tüm forum özelliklerine erişebilirsiniz.
                                        </div>
                                    </>
                                )}
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
                                        color: 'var(--text-muted)',
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
                                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px', background: 'linear-gradient(to right, var(--foreground), var(--text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        OTOSÖZ
                                    </h2>
                                    <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
                                        Türkiye'nin yapay zeka destekli en kapsamlı ikinci el araç pazar yeri ve analiz platformu.
                                    </p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                                    {[
                                        { title: "Veri Odaklı", desc: "Milyonlarca veri noktasıyla en doğru fiyat analizi.", icon: "📊" },
                                        { title: "Güvenli", desc: "Doğrulanmış satıcılar ve şeffaf ekspertiz raporları.", icon: "🛠️" },
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
                                            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'var(--foreground)' }}>{item.title}</h3>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    padding: '30px',
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                    borderRadius: '16px',
                                    border: '1px solid var(--card-border)',
                                }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: 'var(--foreground)' }}>İletişim & Künye</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>E-posta</span>
                                            <span style={{ color: 'var(--foreground)', fontWeight: '500', fontSize: '14px' }}>iletisim@otosoz.com</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Genel Merkez</span>
                                            <span style={{ color: 'var(--foreground)', fontWeight: '500', fontSize: '14px', textAlign: 'right' }}>Teknopark İzmir, A1 Blok<br />Urla, İzmir</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Versiyon</span>
                                            <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px' }}>v1.0.0 Alpha</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>© 2025 OTOSÖZ. Tüm hakları saklıdır.</p>
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
