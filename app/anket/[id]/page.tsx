"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, TrendingUp, Share2 } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Nominee {
    id: number;
    name: string;
    votes: number;
}

interface SurveyData {
    id: string;
    title: string;
    description: string;
    category: string;
    totalVotes: number;
    nominees: Nominee[];
    voters?: Record<string, number>;
    createdBy?: string;
}

export default function SurveyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const snap = await getDoc(doc(db, "surveys", params.id as string));
                if (snap.exists()) {
                    setSurveyData({ id: snap.id, ...snap.data() } as SurveyData);
                }
            } catch (e) {
                console.warn("Anket yuklenemedi:", e);
            }
            setLoading(false);
        };
        if (params.id) load();
    }, [params.id]);

    const handleVote = async (nomineeId: number) => {
        if (!user || !surveyData) return;
        const voters = surveyData.voters || {};
        const prevNomineeId = voters[user.id as string];
        if (prevNomineeId === nomineeId) return;

        const newVoters = { ...voters, [user.id as string]: nomineeId };
        const newTotalVotes = prevNomineeId !== undefined ? surveyData.totalVotes : surveyData.totalVotes + 1;
        const newNominees = surveyData.nominees.map(n => {
            let v = n.votes;
            if (n.id === nomineeId) v += 1;
            else if (n.id === prevNomineeId) v = Math.max(0, v - 1);
            return { ...n, votes: v };
        });

        setSurveyData({ ...surveyData, voters: newVoters, totalVotes: newTotalVotes, nominees: newNominees });

        try {
            await updateDoc(doc(db, "surveys", surveyData.id), { voters: newVoters, totalVotes: newTotalVotes, nominees: newNominees });
        } catch (e) {
            console.error("Oy kaydedilemedi:", e);
        }
    };

    if (loading) return <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Yukleniyor...</div>;
    if (!surveyData) return <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Anket bulunamadi</div>;

    const myVote = user ? (surveyData.voters || {})[user.id as string] : undefined;
    const hasVoted = myVote !== undefined;

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)', padding: '32px 24px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <button onClick={() => router.back()} style={{
                        display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)',
                        background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px',
                        fontSize: '14px', fontWeight: '600',
                    }}>
                        <ArrowLeft size={16} /> Anketlere Don
                    </button>

                    {/* Survey Card */}
                    <div style={{
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '16px', overflow: 'hidden',
                    }}>
                        {/* Header */}
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)' }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                                background: 'rgba(0,90,226,0.1)', color: 'var(--primary)', marginBottom: '12px',
                            }}>
                                <TrendingUp size={12} /> Anket
                            </span>
                            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
                                {surveyData.title}
                            </h1>
                            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                                {surveyData.description}
                            </p>
                            <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
                                <div>
                                    <span style={{ fontWeight: '800', color: 'var(--foreground)', fontSize: '20px' }}>{surveyData.totalVotes.toLocaleString()}</span>
                                    <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>oy</span>
                                </div>
                                <div>
                                    <span style={{ fontWeight: '800', color: 'var(--foreground)', fontSize: '20px' }}>{surveyData.nominees.length}</span>
                                    <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>secenek</span>
                                </div>
                            </div>
                        </div>

                        {/* Options */}
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {!user && (
                                <p style={{ fontSize: '13px', color: '#f59e0b', marginBottom: '8px' }}>Oy vermek icin giris yapmalisiniz.</p>
                            )}
                            {surveyData.nominees.map((nominee) => {
                                const isSelected = myVote === nominee.id;
                                const percentage = surveyData.totalVotes > 0 ? Math.round((nominee.votes / surveyData.totalVotes) * 100) : 0;

                                return (
                                    <button key={nominee.id} onClick={() => handleVote(nominee.id)} disabled={!user} style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '16px 20px', borderRadius: '12px',
                                        border: isSelected ? '2px solid var(--primary)' : '2px solid var(--card-border)',
                                        cursor: user ? 'pointer' : 'not-allowed',
                                        background: isSelected ? 'rgba(0,90,226,0.05)' : 'var(--secondary)',
                                        width: '100%', textAlign: 'left', position: 'relative', overflow: 'hidden',
                                        transition: 'all 0.2s',
                                    }}>
                                        {hasVoted && (
                                            <div style={{
                                                position: 'absolute', left: 0, top: 0, bottom: 0,
                                                width: `${percentage}%`,
                                                background: isSelected ? 'rgba(0,90,226,0.1)' : 'var(--card-bg)',
                                                transition: 'width 0.6s ease', pointerEvents: 'none',
                                            }} />
                                        )}
                                        <div style={{
                                            width: '24px', height: '24px', borderRadius: '50%',
                                            border: isSelected ? '6px solid var(--primary)' : '2px solid var(--text-muted)',
                                            flexShrink: 0, zIndex: 1,
                                        }} />
                                        <span style={{
                                            color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                                            fontWeight: isSelected ? '700' : '500', fontSize: '15px', zIndex: 1, flex: 1,
                                        }}>
                                            {nominee.name}
                                        </span>
                                        {hasVoted && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
                                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{nominee.votes} oy</span>
                                                <span style={{ fontSize: '16px', fontWeight: '800', color: isSelected ? 'var(--primary)' : 'var(--foreground)' }}>%{percentage}</span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {surveyData.createdBy && (
                            <div style={{ padding: '0 24px 20px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                Olusturan: @{surveyData.createdBy}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
