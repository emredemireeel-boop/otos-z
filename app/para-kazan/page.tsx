"use client";

import { useState } from "react";
import Link from "next/link";
import {
    DollarSign,
    CheckCircle,
    TrendingUp,
    FileText,
    ArrowLeftRight,
    Users,
    UserPlus,
    Store,
    Wrench,
    ShieldCheck,
    Shield,
    Zap,
    Info,
    ArrowRight,
    CheckCircle as CheckCircleOutline,
    Mail
} from "lucide-react";

interface UserProgress {
    interactiveEntries: number;
    comparisonAnswers: number;
    communityParticipation: number;
    friendInvites: number;
    professionalStatus: "none" | "pending" | "verified";
}

interface Requirement {
    id: string;
    title: string;
    description: string;
    icon: any;
    required: number;
    current: number;
    isCompleted: boolean;
}

interface ProfessionalOption {
    id: string;
    title: string;
    icon: any;
    description: string;
    verificationDocs: string[];
    isVerified: boolean;
}

export default function EarnMoneyPage() {
    const [userProgress] = useState<UserProgress>({
        interactiveEntries: 35,
        comparisonAnswers: 42,
        communityParticipation: 1,
        friendInvites: 1,
        professionalStatus: "none"
    });

    const [selectedProfession, setSelectedProfession] = useState<string | null>(null);

    const basicRequirements: Requirement[] = [
        {
            id: "entries",
            title: "Etkileşimli Entry",
            description: "Toplulukta aktif olun, entry yazın ve beğeniler toplayın",
            icon: FileText,
            required: 50,
            current: userProgress.interactiveEntries,
            isCompleted: userProgress.interactiveEntries >= 50,
        },
        {
            id: "comparisons",
            title: "Karşılaştırma Cevabı",
            description: "Araç karşılaştırmalarına görüş bildirin",
            icon: ArrowLeftRight,
            required: 50,
            current: userProgress.comparisonAnswers,
            isCompleted: userProgress.comparisonAnswers >= 50,
        },
        {
            id: "community",
            title: "Topluluk Katılımı",
            description: "Farklı tartışmalara katılın ve katkı sağlayın",
            icon: Users,
            required: 2,
            current: userProgress.communityParticipation,
            isCompleted: userProgress.communityParticipation >= 2,
        },
        {
            id: "invites",
            title: "Arkadaş Daveti",
            description: "Arkadaşlarınızı davet edin ve topluluğu büyütün",
            icon: UserPlus,
            required: 2,
            current: userProgress.friendInvites,
            isCompleted: userProgress.friendInvites >= 2,
        },
    ];

    const professionalOptions: ProfessionalOption[] = [
        {
            id: "dealer",
            title: "Galericiyim",
            icon: Store,
            description: "Araç alım-satım işleriyle profesyonel olarak ilgileniyorum",
            verificationDocs: ["İŞyeri Fotoğrafı", "Ticaret Sicil Belgesi", "Vergi Levhası"],
            isVerified: false,
        },
        {
            id: "mechanic",
            title: "Usta/Tamirciyim",
            icon: Wrench,
            description: "Araç tamiri ve bakımı konusunda uzmanlığım var",
            verificationDocs: ["Atölye Fotoğrafı", "Ustalık Belgesi", "İŞ Kartı"],
            isVerified: false,
        },
        {
            id: "expert",
            title: "Ekspertizim",
            icon: ShieldCheck,
            description: "Araç ekspertizi yapma yetkisine sahibim",
            verificationDocs: ["Ekspertiz Sertifikası", "İŞyeri Belgesi", "Kimlik"],
            isVerified: false,
        },
        {
            id: "traffic",
            title: "Trafikçiyim",
            icon: Shield,
            description: "Trafik ve araç mevzuatı konusunda uzmanlığım var",
            verificationDocs: ["Görev Belgesi", "Kimlik", "İŞ Kartı"],
            isVerified: userProgress.professionalStatus === "verified",
        },
    ];

    const basicCompleted = basicRequirements.every(r => r.isCompleted);
    const professionalCompleted = userProgress.professionalStatus === "verified";
    const allCompleted = basicCompleted && professionalCompleted;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0A0A0A',
            paddingTop: '60px',
        }}>
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '40px 20px',
            }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #FFD700, #FFB300)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <DollarSign style={{ width: '28px', height: '28px', color: 'white' }} />
                        </div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '800',
                            color: 'white',
                            margin: 0,
                        }}>Para Kazan</h1>
                    </div>
                    <p style={{
                        fontSize: '16px',
                        color: '#B0B0B0',
                        margin: 0,
                    }}>Aşağıdaki Şartları tamamlayarak para kazanma özelliğini aktif edin</p>
                </div>

                {/* Progress Summary Card */}
                <div style={{
                    background: allCompleted
                        ? 'rgba(76, 175, 80, 0.2)'
                        : 'rgba(66, 165, 245, 0.2)',
                    border: `1px solid ${allCompleted ? '#4CAF50' : '#42A5F5'}`,
                    borderRadius: '24px',
                    padding: '32px',
                    marginBottom: '24px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        {allCompleted ? (
                            <CheckCircle style={{ width: '40px', height: '40px', color: '#4CAF50' }} />
                        ) : (
                            <TrendingUp style={{ width: '40px', height: '40px', color: '#42A5F5' }} />
                        )}
                        <div>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: 'white',
                                margin: '0 0 4px 0',
                            }}>
                                {allCompleted ? "Özellik Açıldı! 🎉" : "İlerleme Durumu"}
                            </h2>
                            <p style={{
                                fontSize: '14px',
                                color: '#B0B0B0',
                                margin: 0,
                            }}>
                                {allCompleted ? "Artık para kazanabilirsiniz!" : "Şartları tamamlayın"}
                            </p>
                        </div>
                    </div>

                    <div style={{
                        height: '1px',
                        background: 'rgba(255,255,255,0.1)',
                        marginBottom: '20px',
                    }} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{
                            padding: '16px',
                            background: basicCompleted
                                ? 'rgba(76, 175, 80, 0.2)'
                                : 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}>
                            {basicCompleted ? (
                                <CheckCircle style={{ width: '24px', height: '24px', color: '#4CAF50' }} />
                            ) : (
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: '2px solid #B0B0B0',
                                }} />
                            )}
                            <span style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: basicCompleted ? '#4CAF50' : '#B0B0B0',
                            }}>Temel</span>
                        </div>

                        <div style={{
                            padding: '16px',
                            background: professionalCompleted
                                ? 'rgba(76, 175, 80, 0.2)'
                                : 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}>
                            {professionalCompleted ? (
                                <CheckCircle style={{ width: '24px', height: '24px', color: '#4CAF50' }} />
                            ) : (
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: '2px solid #B0B0B0',
                                }} />
                            )}
                            <span style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: professionalCompleted ? '#4CAF50' : '#B0B0B0',
                            }}>Profesyonel</span>
                        </div>
                    </div>
                </div>

                {/* Basic Requirements */}
                <div style={{
                    background: '#1A1A1A',
                    borderRadius: '24px',
                    padding: '32px',
                    marginBottom: '24px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <CheckCircleOutline style={{ width: '28px', height: '28px', color: '#42A5F5' }} />
                        <h3 style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: 'white',
                            margin: 0,
                        }}>Temel Gereksinimler</h3>
                    </div>
                    <p style={{
                        fontSize: '14px',
                        color: '#B0B0B0',
                        marginBottom: '24px',
                    }}>Para kazanma özelliğini açmak için aşağıdaki görevleri tamamlamanız gerekiyor:</p>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        {basicRequirements.map((req) => {
                            const Icon = req.icon;
                            return (
                                <div key={req.id} style={{
                                    background: req.isCompleted
                                        ? 'rgba(76, 175, 80, 0.1)'
                                        : 'rgba(255,255,255,0.05)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    display: 'flex',
                                    gap: '16px',
                                }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        background: req.isCompleted
                                            ? 'rgba(76, 175, 80, 0.2)'
                                            : 'rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <Icon style={{
                                            width: '28px',
                                            height: '28px',
                                            color: req.isCompleted ? '#4CAF50' : '#42A5F5'
                                        }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: 'white',
                                            margin: '0 0 4px 0',
                                        }}>{req.title}</h4>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#B0B0B0',
                                            margin: '0 0 12px 0',
                                        }}>{req.description}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                flex: 1,
                                                height: '8px',
                                                background: 'rgba(255,255,255,0.1)',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                            }}>
                                                <div style={{
                                                    width: `${Math.min((req.current / req.required) * 100, 100)}%`,
                                                    height: '100%',
                                                    background: req.isCompleted ? '#4CAF50' : '#42A5F5',
                                                    transition: 'width 0.3s',
                                                }} />
                                            </div>
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: req.isCompleted ? '#4CAF50' : '#B0B0B0',
                                            }}>
                                                {req.current}/{req.required}
                                            </span>
                                        </div>
                                    </div>
                                    {req.isCompleted && (
                                        <CheckCircle style={{ width: '28px', height: '28px', color: '#4CAF50', flexShrink: 0 }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Professional Verification */}
                <div style={{
                    background: '#1A1A1A',
                    borderRadius: '24px',
                    padding: '32px',
                    marginBottom: '24px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <ShieldCheck style={{ width: '28px', height: '28px', color: '#FFD700' }} />
                        <h3 style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: 'white',
                            margin: 0,
                        }}>Profesyonel Doğrulama</h3>
                    </div>
                    <p style={{
                        fontSize: '14px',
                        color: '#B0B0B0',
                        marginBottom: '24px',
                    }}>Aşağıdaki profesyonel kategorilerden birine sahip olduğunuzu doğrulayın:</p>

                    <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
                        {professionalOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => setSelectedProfession(selectedProfession === option.id ? null : option.id)}
                                    disabled={option.isVerified}
                                    style={{
                                        background: option.isVerified
                                            ? 'rgba(76, 175, 80, 0.1)'
                                            : 'rgba(255,255,255,0.05)',
                                        borderRadius: '16px',
                                        padding: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        border: 'none',
                                        cursor: option.isVerified ? 'default' : 'pointer',
                                        width: '100%',
                                        textAlign: 'left',
                                    }}
                                >
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        background: option.isVerified
                                            ? 'rgba(76, 175, 80, 0.2)'
                                            : 'rgba(255, 215, 0, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Icon style={{
                                            width: '28px',
                                            height: '28px',
                                            color: option.isVerified ? '#4CAF50' : '#FFD700'
                                        }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: 'white',
                                            margin: '0 0 4px 0',
                                        }}>{option.title}</h4>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#B0B0B0',
                                            margin: 0,
                                        }}>{option.description}</p>

                                        {selectedProfession === option.id && !option.isVerified && (
                                            <div style={{
                                                marginTop: '16px',
                                                padding: '16px',
                                                background: 'rgba(255,255,255,0.05)',
                                                borderRadius: '12px',
                                            }}>
                                                <p style={{
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    color: 'white',
                                                    margin: '0 0 8px 0',
                                                }}>Gerekli Belgeler:</p>
                                                <ul style={{
                                                    margin: '0 0 16px 0',
                                                    paddingLeft: '20px',
                                                    color: '#B0B0B0',
                                                    fontSize: '13px',
                                                }}>
                                                    {option.verificationDocs.map((doc, i) => (
                                                        <li key={i}>{doc}</li>
                                                    ))}
                                                </ul>
                                                <a
                                                    href={`mailto:Otosözhelp@gmail.com?subject=Profesyonel Doğrulama - ${option.title}&body=Merhaba,%0D%0A%0D%0A${option.title} kategorisi için profesyonel doğrulama talebinde bulunmak istiyorum.%0D%0A%0D%0AGerekli Belgeler:%0D%0A${option.verificationDocs.map((doc, i) => `${i + 1}. ${doc}`).join('%0D%0A')}%0D%0A%0D%0ALütfen belgelerimi bu emaile ekli olarak gönderiyorum.%0D%0A%0D%0ATeşekkürler.`}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        padding: '10px 16px',
                                                        background: 'linear-gradient(135deg, #FFD700, #FFB300)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        color: 'white',
                                                        fontSize: '13px',
                                                        fontWeight: '600',
                                                        textDecoration: 'none',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <Mail style={{ width: '16px', height: '16px' }} />
                                                    Belgeleri Email ile Gönder
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    {option.isVerified ? (
                                        <CheckCircle style={{ width: '28px', height: '28px', color: '#4CAF50' }} />
                                    ) : (
                                        <ArrowRight style={{ width: '24px', height: '24px', color: '#FFD700' }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {!professionalCompleted && (
                        <div style={{
                            padding: '16px',
                            background: 'rgba(255, 152, 0, 0.2)',
                            border: '1px solid #FF9800',
                            borderRadius: '12px',
                            display: 'flex',
                            gap: '12px',
                        }}>
                            <Info style={{ width: '24px', height: '24px', color: '#FF9800', flexShrink: 0 }} />
                            <p style={{
                                fontSize: '13px',
                                color: 'white',
                                margin: 0,
                            }}>
                                Profesyonel kategorilerden en az birine sahip olmalısınız. Doğrulama işlemi 24-48 saat içinde tamamlanır.
                            </p>
                        </div>
                    )}
                </div>

                {/* Success Card */}
                {allCompleted && (
                    <div style={{
                        background: 'rgba(76, 175, 80, 0.2)',
                        border: '1px solid #4CAF50',
                        borderRadius: '24px',
                        padding: '48px 32px',
                        textAlign: 'center',
                    }}>
                        <CheckCircle style={{
                            width: '80px',
                            height: '80px',
                            color: '#4CAF50',
                            margin: '0 auto 24px',
                        }} />
                        <h2 style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#4CAF50',
                            margin: '0 0 12px 0',
                        }}>Tebrikler! 🎉</h2>
                        <p style={{
                            fontSize: '16px',
                            color: 'white',
                            marginBottom: '32px',
                        }}>
                            Para kazanma özelliğini başarıyla açtınız. Artık uygulama içindeki görevleri tamamlayarak kazanç elde edebilirsiniz!
                        </p>
                        <button style={{
                            padding: '16px 32px',
                            background: '#4CAF50',
                            border: 'none',
                            borderRadius: '16px',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}>
                            <Zap style={{ width: '24px', height: '24px' }} />
                            Kazanmaya Başla
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
