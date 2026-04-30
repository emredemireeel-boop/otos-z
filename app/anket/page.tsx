"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Settings, Fuel, CarFront, Activity, Award, CheckCircle, AlertCircle, Plus, X, Trash2, Sparkles, TrendingUp, Users, CheckSquare } from "lucide-react";
import {
    collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
    serverTimestamp, query, orderBy, increment
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Nominee {
    id: number;
    name: string;
    votes: number;
}

interface Survey {
    id: string;
    title: string;
    description: string;
    iconName: string;
    category: string;
    status: string;
    totalVotes: number;
    nominees: Nominee[];
    createdBy?: string;
    voters?: Record<string, number>; // userId -> nomineeId
}

export default function AnketPage() {
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const categories = ["Tümü", "Motor", "Performans", "Modifiye", "Sürüş", "Genel"];

    // Icon mapper
    const getIcon = (iconName: string) => {
        const props = { size: 24, className: "text-white" };
        switch (iconName) {
            case "Settings": return <Settings {...props} />;
            case "Fuel": return <Fuel {...props} />;
            case "CarFront": return <CarFront {...props} />;
            case "Activity": return <Activity {...props} />;
            case "Award": return <Award {...props} />;
            case "none": return null;
            default: return <Award {...props} />;
        }
    };

    const showToast = (message: string, type: 'error' | 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Load surveys from Firebase
    useEffect(() => {
        const loadSurveys = async () => {
            try {
                const snap = await getDocs(query(collection(db, "surveys"), orderBy("createdAt", "desc")));
                const items = snap.docs.map(d => ({
                    id: d.id,
                    ...d.data(),
                })) as Survey[];
                setSurveys(items);
            } catch (e) {
                console.warn("Anketler yuklenemedi:", e);
            }
            setLoading(false);
        };
        loadSurveys();
    }, []);

    // Handle vote
    const handleVote = async (surveyId: string, nomineeId: number) => {
        if (!user) {
            showToast("Oy verebilmek icin uye girisi yapmalisiniz.", "error");
            return;
        }

        const survey = surveys.find(s => s.id === surveyId);
        if (!survey) return;

        const voters = survey.voters || {};
        const prevNomineeId = voters[user.id as string];
        if (prevNomineeId === nomineeId) return; // Same vote

        // Optimistic update
        setSurveys(prev => prev.map(s => {
            if (s.id !== surveyId) return s;
            const newVoters = { ...s.voters, [user.id as string]: nomineeId };
            const newTotalVotes = prevNomineeId !== undefined ? s.totalVotes : s.totalVotes + 1;
            return {
                ...s,
                totalVotes: newTotalVotes,
                voters: newVoters,
                nominees: s.nominees.map(n => {
                    let newVotes = n.votes;
                    if (n.id === nomineeId) newVotes += 1;
                    else if (n.id === prevNomineeId) newVotes = Math.max(0, newVotes - 1);
                    return { ...n, votes: newVotes };
                }),
            };
        }));

        // Save to Firebase
        try {
            const surveyRef = doc(db, "surveys", surveyId);
            const updatedSurvey = surveys.find(s => s.id === surveyId)!;
            const newVoters = { ...(updatedSurvey.voters || {}), [user.id as string]: nomineeId };
            const newNominees = updatedSurvey.nominees.map(n => {
                let newVotes = n.votes;
                if (n.id === nomineeId) newVotes += 1;
                else if (n.id === prevNomineeId) newVotes = Math.max(0, newVotes - 1);
                return { ...n, votes: newVotes };
            });
            const newTotalVotes = prevNomineeId !== undefined ? updatedSurvey.totalVotes : updatedSurvey.totalVotes + 1;

            await updateDoc(surveyRef, {
                voters: newVoters,
                nominees: newNominees,
                totalVotes: newTotalVotes,
            });
            showToast("Oyunuz kaydedildi!", "success");
        } catch (e) {
            console.error("Oy kaydedilemedi:", e);
            showToast("Oy kaydedilemedi, tekrar deneyin.", "error");
        }
    };

    // Create new survey
    const handleCreateSurvey = async (data: { title: string; description: string; category: string; iconName: string; options: string[] }) => {
        if (!user) return;
        try {
            const nominees = data.options.map((name, i) => ({ id: i + 1, name, votes: 0 }));
            const docRef = await addDoc(collection(db, "surveys"), {
                title: data.title,
                description: data.description,
                category: data.category,
                iconName: data.iconName,
                status: "active",
                totalVotes: 0,
                nominees,
                voters: {},
                createdBy: user.username,
                createdAt: serverTimestamp(),
            });
            setSurveys(prev => [{
                id: docRef.id,
                title: data.title,
                description: data.description,
                category: data.category,
                iconName: data.iconName,
                status: "active",
                totalVotes: 0,
                nominees,
                voters: {},
                createdBy: user.username,
            }, ...prev]);
            setShowCreateModal(false);
            showToast("Anket olusturuldu!", "success");
        } catch (e) {
            console.error("Anket olusturulamadi:", e);
            showToast("Anket olusturulamadi.", "error");
        }
    };

    const filteredSurveys = useMemo(() => {
        if (selectedCategory === "Tümü") return surveys;
        return surveys.filter(s => s.category === selectedCategory);
    }, [surveys, selectedCategory]);

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Toast */}
                {toast && (
                    <div style={{
                        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px',
                        background: toast.type === 'error' ? 'var(--card-bg)' : '#10B981',
                        border: toast.type === 'error' ? '1px solid #EF4444' : 'none',
                        color: toast.type === 'error' ? '#EF4444' : 'white',
                        borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        zIndex: 9999, fontWeight: '600',
                    }}>
                        {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                        {toast.message}
                    </div>
                )}

                {/* Sub Header */}
                <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)', padding: '16px 24px' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>Anketler</h1>
                            {user ? (
                                <button onClick={() => setShowCreateModal(true)} style={{
                                    padding: '10px 20px', background: 'var(--primary)', color: 'white',
                                    fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                    fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px',
                                }}>
                                    <Plus size={16} /> Yeni Anket
                                </button>
                            ) : (
                                <Link href="/giris" style={{
                                    padding: '10px 20px', background: 'var(--secondary)', color: 'var(--foreground)',
                                    fontWeight: '600', borderRadius: '10px', border: '1px solid var(--card-border)',
                                    textDecoration: 'none', fontSize: '14px',
                                }}>
                                    Giris Yap
                                </Link>
                            )}
                        </div>

                        {/* Category Pills */}
                        <div className="category-pills" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {categories.map((cat) => (
                                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                                    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
                                    whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
                                    background: selectedCategory === cat ? 'var(--primary)' : 'var(--secondary)',
                                    color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                    transition: 'all 0.2s',
                                }}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div className="home-main-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '24px' }}>
                        {/* Sol Sidebar */}
                        <aside className="home-left-sidebar">
                            <div style={{ position: 'sticky', top: '100px' }}>
                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <TrendingUp size={16} color="var(--primary)" /> Anket Trendleri
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><Users size={14}/></div>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>Topluluğun Sesi</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Binlerce Oy</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><CheckSquare size={14}/></div>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>Güncel Veri</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Gerçek Zamanlı</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Nasıl Çalışır?</h3>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>Fikrinizi belirtmek için anketlere katılın. Sonuçlar anında güncellenir. Dilerseniz kendi anketinizi de oluşturabilirsiniz.</p>
                                </div>
                            </div>
                        </aside>

                        {/* Orta İçerik */}
                        <div>

                    {/* Vitrin Alanı */}
                    {!loading && surveys.length > 0 && (
                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '8px', borderRadius: '10px' }}>
                                    <Award size={20} color="#fbbf24" />
                                </div>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>Günün Vitrini</h2>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                                {surveys.slice(0, 2).map((survey) => (
                                    <div key={`vitrin-${survey.id}`} style={{
                                        background: 'linear-gradient(145deg, var(--card-bg), rgba(255,255,255,0.02))',
                                        border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px',
                                        position: 'relative', overflow: 'hidden'
                                    }}>
                                        <div style={{ position: 'absolute', top: 0, right: 0, background: '#fbbf24', color: 'black', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderBottomLeftRadius: '12px' }}>ÖNE ÇIKAN</div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px', paddingRight: '60px' }}>{survey.title}</h3>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{survey.description}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{survey.totalVotes.toLocaleString()} oy</span>
                                            <button onClick={() => {
                                                const el = document.getElementById(`survey-${survey.id}`);
                                                if (el) {
                                                    const y = el.getBoundingClientRect().top + window.scrollY - 100;
                                                    window.scrollTo({ top: y, behavior: 'smooth' });
                                                }
                                            }} style={{ padding: '6px 12px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}>
                                                Oyla
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '10px' }}>
                            <Activity size={20} color="#3b82f6" />
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>Tüm Anketler</h2>
                    </div>

                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Anketler yukleniyor...</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {filteredSurveys.length === 0 ? (
                                <div style={{ padding: '60px', textAlign: 'center', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', color: 'var(--text-muted)' }}>
                                    {selectedCategory === "Tümü" ? "Henuz anket olusturulmamis. Ilk anketi siz olusturun!" : "Bu kategoride henuz anket bulunmuyor."}
                                </div>
                            ) : (
                                filteredSurveys.map((survey) => {
                                    const myVote = user ? (survey.voters || {})[user.id as string] : undefined;
                                    const hasVoted = myVote !== undefined;

                                    return (
                                        <div id={`survey-${survey.id}`} key={survey.id} style={{
                                            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                                            borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.3s ease',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                                        >
                                            {/* Survey Header */}
                                            <div style={{ padding: '20px', borderBottom: '1px solid var(--card-border)' }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                                    {survey.iconName !== 'none' && (
                                                        <div style={{
                                                            width: '48px', height: '48px', borderRadius: '12px',
                                                            background: 'var(--primary)', display: 'flex',
                                                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                        }}>
                                                            {getIcon(survey.iconName)}
                                                        </div>
                                                    )}
                                                    <div style={{ flex: 1 }}>
                                                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '6px' }}>
                                                            {survey.title}
                                                        </h2>
                                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                                                            {survey.description}
                                                        </p>
                                                    </div>
                                                    <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                            {survey.totalVotes.toLocaleString()} oy
                                                        </span>
                                                        <span style={{ fontSize: '11px', padding: '2px 8px', background: 'var(--secondary)', borderRadius: '4px', color: 'var(--primary)' }}>
                                                            {survey.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Nominees */}
                                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {survey.nominees.map((nominee) => {
                                                    const isSelected = myVote === nominee.id;
                                                    const percentage = survey.totalVotes > 0 ? Math.round((nominee.votes / survey.totalVotes) * 100) : 0;

                                                    return (
                                                        <button
                                                            key={nominee.id}
                                                            onClick={() => handleVote(survey.id, nominee.id)}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                                padding: '14px 16px', borderRadius: '12px',
                                                                border: isSelected ? '2px solid var(--primary)' : '2px solid var(--card-border)',
                                                                cursor: 'pointer',
                                                                background: isSelected ? 'rgba(0, 90, 226, 0.05)' : 'var(--secondary)',
                                                                width: '100%', textAlign: 'left',
                                                                position: 'relative', overflow: 'hidden',
                                                                transition: 'border-color 0.2s ease, background 0.2s',
                                                            }}
                                                        >
                                                            {hasVoted && (
                                                                <div style={{
                                                                    position: 'absolute', left: 0, top: 0, bottom: 0,
                                                                    width: `${percentage}%`,
                                                                    background: isSelected ? 'rgba(0, 90, 226, 0.1)' : 'var(--card-bg)',
                                                                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                    pointerEvents: 'none',
                                                                }} />
                                                            )}

                                                            <div style={{
                                                                width: '22px', height: '22px', borderRadius: '50%',
                                                                border: isSelected ? '6px solid var(--primary)' : '2px solid var(--text-muted)',
                                                                flexShrink: 0, background: 'transparent',
                                                                transition: 'all 0.2s ease', zIndex: 1,
                                                            }} />

                                                            <span style={{
                                                                color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                                                                fontWeight: isSelected ? '700' : '500',
                                                                fontSize: '15px', zIndex: 1,
                                                            }}>
                                                                {nominee.name}
                                                            </span>

                                                            {hasVoted && (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', zIndex: 1 }}>
                                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
                                                                        {nominee.votes.toLocaleString()} oy
                                                                    </span>
                                                                    <span style={{
                                                                        fontSize: '15px', fontWeight: '800',
                                                                        color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                                                                        minWidth: '40px', textAlign: 'right',
                                                                    }}>
                                                                        %{percentage}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Footer */}
                                            {survey.createdBy && (
                                                <div style={{ padding: '0 20px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                                    Olusturan: @{survey.createdBy}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                        </div>

                        {/* Sağ Sidebar */}
                        <aside className="home-right-sidebar">
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {/* Reklam Alanı */}
                                <Link href="/iletisim" style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
                                    <div style={{
                                        background: 'var(--secondary)', border: '1px dashed var(--card-border)', borderRadius: '16px',
                                        height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', padding: '20px', textAlign: 'center'
                                    }}
                                         onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                                         onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                                            <Sparkles size={20} color="currentColor" />
                                        </div>
                                        <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>Buraya Reklam Ver</h3>
                                        <p style={{ fontSize: '12px', lineHeight: '1.5', margin: 0 }}>Günde binlerce otomotiv tutkununa markanızı ulaştırın.</p>
                                    </div>
                                </Link>

                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                        <Activity size={16} color="var(--primary)" />
                                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>İstatistikler</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ padding: '12px', background: 'var(--secondary)', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>{surveys.length}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Toplam Anket</div>
                                        </div>
                                        <div style={{ padding: '12px', background: 'var(--secondary)', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>{surveys.reduce((acc, s) => acc + s.totalVotes, 0)}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Kullanılan Oy</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Create Survey Modal */}
                {showCreateModal && (
                    <CreateSurveyModal
                        onClose={() => setShowCreateModal(false)}
                        onCreate={handleCreateSurvey}
                        categories={categories.filter(c => c !== "Tümü")}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
}

// Create Survey Modal
function CreateSurveyModal({
    onClose,
    onCreate,
    categories,
}: {
    onClose: () => void;
    onCreate: (data: { title: string; description: string; category: string; iconName: string; options: string[] }) => void;
    categories: string[];
}) {
    const [title, setTitle] = useState("Motor Tipi Tercihi: Benzin mi, Dizel mi, Elektrik mi?");
    const [description, setDescription] = useState("Performans, yakıt ekonomisi ve gelecek vizyonu açısından en doğru seçim hangisi?");
    const [category, setCategory] = useState("Genel");
    const [iconName, setIconName] = useState("none");
    const [options, setOptions] = useState(["Benzin", "Dizel", "Elektrik"]);

    const addOption = () => {
        if (options.length < 8) setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
    };

    const updateOption = (index: number, value: string) => {
        setOptions(options.map((o, i) => i === index ? value : o));
    };

    const canSubmit = title.trim() && description.trim() && options.filter(o => o.trim()).length >= 2;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        onCreate({
            title: title.trim(),
            description: description.trim(),
            category,
            iconName,
            options: options.filter(o => o.trim()),
        });
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px', borderRadius: '10px',
        background: 'var(--secondary)', border: '1px solid var(--card-border)',
        color: 'var(--foreground)', outline: 'none', fontSize: '14px',
    };



    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px',
        }}>
            <div style={{
                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                borderRadius: '20px', width: '100%', maxWidth: '520px',
                maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid var(--card-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>Yeni Anket Olustur</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                    {/* Title */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Baslik</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Anket basligini girin" style={inputStyle} />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Aciklama</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Kisa bir aciklama" rows={2} style={{ ...inputStyle, resize: 'none' }} />
                    </div>

                    {/* Category & Icon */}
                    <div style={{ marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Kategori</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>İkon</label>
                            <select value={iconName} onChange={e => setIconName(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="none">İkon Yok</option>
                                <option value="Award">Ödül</option>
                                <option value="CarFront">Araç</option>
                                <option value="Fuel">Yakıt</option>
                                <option value="Settings">Ayar</option>
                                <option value="Activity">Aktivite</option>
                            </select>
                        </div>
                    </div>

                    {/* Options */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            Secenekler (en az 2)
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {options.map((opt, i) => (
                                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input type="text" value={opt} onChange={e => updateOption(i, e.target.value)} placeholder={`Secenek ${i + 1}`} style={{ ...inputStyle, flex: 1 }} />
                                    {options.length > 2 && (
                                        <button type="button" onClick={() => removeOption(i)} style={{
                                            background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px',
                                        }}>
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {options.length < 8 && (
                            <button type="button" onClick={addOption} style={{
                                marginTop: '8px', padding: '8px 16px', borderRadius: '8px',
                                background: 'var(--secondary)', border: '1px solid var(--card-border)',
                                color: 'var(--foreground)', cursor: 'pointer', fontSize: '13px',
                                display: 'flex', alignItems: 'center', gap: '4px',
                            }}>
                                <Plus size={14} /> Secenek Ekle
                            </button>
                        )}
                    </div>

                    {/* Submit */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '12px 24px', borderRadius: '10px', background: 'transparent',
                            border: '1px solid var(--card-border)', color: 'var(--foreground)',
                            cursor: 'pointer', fontWeight: '600',
                        }}>
                            İptal
                        </button>
                        <button type="submit" disabled={!canSubmit} style={{
                            padding: '12px 24px', borderRadius: '10px', background: 'var(--primary)',
                            border: 'none', color: 'white', cursor: 'pointer', fontWeight: '600',
                            opacity: canSubmit ? 1 : 0.5,
                        }}>
                            Anketi Oluştur
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
