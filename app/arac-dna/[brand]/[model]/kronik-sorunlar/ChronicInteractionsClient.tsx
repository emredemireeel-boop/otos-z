"use client";

import { isVehicleSectionIndexable } from "@/lib/indexability";

import { useRouter } from "next/navigation";

import { Wrench, AlertCircle, AlertTriangle, Plus, X } from "lucide-react";

import { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from "@/context/AuthContext";
import type {DNAChronicIssue} from "@/lib/dnaService";
const loadCommunity=()=>import("@/lib/dnaService");

const VoteContext = createContext<{ requestReport: () => void; vote: (id: string) => void; staticVotes: Record<string, string[]>; userId: string | null } | null>(null);
export default function ChronicInteractions({ brandSlug, modelSlug, brandName, modelName, staticIssueCount, initialIssues=[],initialVotes={}, children }: {
    brandSlug: string; modelSlug: string; brandName: string; modelName: string; staticIssueCount: number;initialIssues?:DNAChronicIssue[];initialVotes?:Record<string,string[]>; children: React.ReactNode;
}) {
    const { user } = useAuth();

    const [dynamicIssues, setDynamicIssues] = useState<DNAChronicIssue[]>(initialIssues);
    const [staticVotes, setStaticVotes] = useState<Record<string, string[]>>(initialVotes);
    const [isReportingChronic, setIsReportingChronic] = useState(false);
    const [chronicText, setChronicText] = useState("");
    const [chronicSubmitting, setChronicSubmitting] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const router = useRouter();


    const handleChronicSubmit = async () => {
        if (!chronicText.trim() || !user || chronicSubmitting) return;
        setChronicSubmitting(true);
        try {
            const {addVehicleChronicIssue}=await loadCommunity();
            const newIssue = await addVehicleChronicIssue(brandSlug, modelSlug, {
                text: chronicText.trim(),
                authorId: user.id as string,
                username: user.username,
            });
            if (newIssue) {
                setDynamicIssues(prev => [...prev, newIssue]);
            }
            setChronicText("");
            setIsReportingChronic(false);
        } catch (e) {
            console.error("Kronik sorun eklenemedi:", e);
        }
        setChronicSubmitting(false);
    };

    const handleChronicVote = async (issueId: string) => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
        try {
            setDynamicIssues(prev => prev.map(iss => {
                if (iss.id !== issueId) return iss;
                const hasVoted = iss.votedBy.includes(user.id as string);
                return {
                    ...iss,
                    votes: hasVoted ? iss.votes - 1 : iss.votes + 1,
                    votedBy: hasVoted ? iss.votedBy.filter(id => id !== user.id) : [...iss.votedBy, user.id as string]
                };
            }));
            const {toggleVehicleChronicVote}=await loadCommunity();
            await toggleVehicleChronicVote(brandSlug, modelSlug, issueId, user.id as string);
        } catch (e) {
            console.error("Kronik sorun oy hatasi:", e);
            // Re-fetch on error
            void loadCommunity().then(sdk=>sdk.getVehicleChronicIssues(brandSlug,modelSlug)).then(setDynamicIssues);
        }
    };

    const handleStaticVote = async (issueId: string) => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
        const idStr = issueId.toString();
        try {
            setStaticVotes(prev => {
                const voters = prev[idStr] || [];
                const hasVoted = voters.includes(user.id as string);
                const newVoters = hasVoted ? voters.filter(id => id !== user.id) : [...voters, user.id as string];
                return { ...prev, [idStr]: newVoters };
            });
            const {toggleVehicleStaticVote}=await loadCommunity();
            await toggleVehicleStaticVote(brandSlug, modelSlug, idStr, user.id as string);
        } catch (e) {
            console.error("Statik kronik sorun oy hatasi:", e);
            void loadCommunity().then(sdk=>sdk.getVehicleStaticVotes(brandSlug,modelSlug)).then(setStaticVotes);
        }
    };

    const requestReport = () => { if (!user) { setShowLoginPrompt(true); return; } if (dynamicIssues.length >= 10) { alert('Maksimum rapor sayısına (10) ulaşıldı.'); return; } setIsReportingChronic(true); };
    return (
        <VoteContext.Provider value={{ requestReport, vote: handleStaticVote, staticVotes, userId: user ? String(user.id) : null }}><div>
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px'
            }}>
                {children}
                {/* Dinamik Kullanıcı Sorunları */}
                {dynamicIssues.length > 0 && (
                    <div style={{ marginTop: '40px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangle size={20} color="#ef4444" /> Kullanıcı Bildirimleri
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[...dynamicIssues].sort((a, b) => b.votes - a.votes).slice(0, 10).map((issue) => {
                                const hasVoted = user && issue.votedBy.includes(user.id as string);
                                return (
                                    <div key={issue.id} style={{
                                        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px',
                                        background: 'var(--card-bg)', border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderLeft: '4px solid #ef4444', borderRadius: '12px', padding: '20px',
                                        flexWrap: 'wrap'
                                    }}>
                                        <div style={{ flex: 1, minWidth: '250px' }}>
                                            <p style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.6', margin: 0, marginBottom: '12px' }}>
                                                {issue.text}
                                            </p>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bildiren: @{issue.author}</span>
                                        </div>
                                        <button
                                            onClick={() => handleChronicVote(issue.id)}
                                            disabled={false}
                                            style={{
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                                                padding: '10px 16px', borderRadius: '8px', flexShrink: 0,
                                                background: hasVoted ? '#ef4444' : 'rgba(239, 68, 68, 0.05)',
                                                border: `1px solid ${hasVoted ? '#ef4444' : 'rgba(239, 68, 68, 0.2)'}`,
                                                color: hasVoted ? 'white' : '#ef4444',
                                                cursor: 'pointer', transition: 'all 0.2s',
                                            }}
                                        >
                                            <span style={{ fontSize: '20px', fontWeight: '800' }}>{issue.votes}</span>
                                            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                                                {hasVoted ? 'Yaşadınız' : 'Ben de Yaşadım'}
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {staticIssueCount === 0 && dynamicIssues.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', background: 'var(--secondary)', borderRadius: '12px', border: '1px dashed var(--card-border)' }}>
                        <span style={{ fontSize: '40px', marginBottom: '16px', display: 'block' }}>✅</span>
                        <h3 style={{ fontSize: '18px', color: 'var(--foreground)', marginBottom: '8px' }}>Bilinen Kronik Sorun Yok</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Bu araç için henüz kaydedilmiş yaygın bir kronik arıza verisi bulunmamaktadır.</p>
                    </div>
                )}
            </div>

            {/* Kronik Sorun Bildir Modali */}
            {isReportingChronic && (
                <>
                    <div onClick={() => setIsReportingChronic(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 999 }} />
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        padding: '32px', borderRadius: '24px', zIndex: 1000,
                        width: '90%', maxWidth: '440px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertTriangle size={20} color="#ef4444" /> Sorun Bildir
                            </h3>
                            <button onClick={() => setIsReportingChronic(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                            Lütfen <strong>{brandName} {modelName}</strong> aracında yaşadığınız yaygın teknik sorunu kısaca açıklayın.
                        </p>
                        <textarea
                            value={chronicText}
                            onChange={(e) => setChronicText(e.target.value)}
                            placeholder="Örn: Motor ısındığında şanzıman vuruntu yapıyor..."
                            style={{
                                width: '100%', height: '100px', padding: '16px',
                                background: 'var(--background)', border: '1px solid var(--card-border)',
                                borderRadius: '12px', color: 'var(--foreground)',
                                fontSize: '14px', resize: 'none', marginBottom: '16px',
                                outline: 'none'
                            }}
                            maxLength={200}
                        />
                        <button
                            onClick={handleChronicSubmit}
                            disabled={chronicSubmitting || !chronicText.trim()}
                            style={{
                                width: '100%', padding: '14px',
                                background: '#ef4444', color: 'white',
                                border: 'none', borderRadius: '12px',
                                fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                                opacity: (chronicSubmitting || !chronicText.trim()) ? 0.7 : 1,
                                transition: 'opacity 0.2s'
                            }}
                        >
                            {chronicSubmitting ? 'Bildiriliyor...' : 'Sorunu Bildir'}
                        </button>
                    </div>
                </>
            )}

            {/* Giriş Yap Uyarı Modali */}
            {showLoginPrompt && (
                <>
                    <div onClick={() => setShowLoginPrompt(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 999 }} />
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        padding: '32px', borderRadius: '24px', zIndex: 1000,
                        width: '90%', maxWidth: '400px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                        }}>
                            <AlertCircle size={32} color="#ef4444" />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
                            Giriş Yapmanız Gerekiyor
                        </h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                            Oy verebilmek veya sorun bildirmek için üye girişi yapmanız gerekmektedir.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => router.push('/giris')}
                                style={{
                                    flex: 1, padding: '14px',
                                    background: 'var(--primary)', color: 'white',
                                    border: 'none', borderRadius: '12px',
                                    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                                    transition: 'opacity 0.2s'
                                }}
                            >
                                Giriş Yap
                            </button>
                            <button
                                onClick={() => router.push('/kayit')}
                                style={{
                                    flex: 1, padding: '14px',
                                    background: 'var(--secondary)', color: 'var(--foreground)',
                                    border: '1px solid var(--card-border)', borderRadius: '12px',
                                    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                                    transition: 'opacity 0.2s'
                                }}
                            >
                                Kayıt Ol
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div></VoteContext.Provider>
    );
}

export function ChronicReportButton() {
    const context = useContext(VoteContext)!;
    return <button onClick={context.requestReport} style={{display:'flex',alignItems:'center',gap:6,padding:'10px 16px',borderRadius:8,background:'rgba(239,68,68,.1)',color:'#ef4444',border:'1px solid rgba(239,68,68,.2)',fontSize:14,fontWeight:700,cursor:'pointer'}}><Plus size={16}/> Kullanıcı Sorunu Bildir</button>;
}
export function StaticIssueCount({ issueId, baseCount }: { issueId: string; baseCount: number }) {
    const context = useContext(VoteContext)!;
    return <>{baseCount + (context.staticVotes[issueId]?.length || 0)}</>;
}
export function StaticIssueVote({ issueId, severityColor }: { issueId: string; severityColor: string }) {
    const context = useContext(VoteContext)!;
    const voted = Boolean(context.userId && context.staticVotes[issueId]?.includes(context.userId));
    return <button onClick={() => context.vote(issueId)} style={{display:'flex',alignItems:'center',padding:'10px 16px',borderRadius:8,background:voted?severityColor:`${severityColor}15`,border:`1px solid ${severityColor}30`,color:voted?'white':severityColor,cursor:'pointer',fontSize:11,fontWeight:700,textTransform:'uppercase'}}>{voted?'Yaşadınız':'Ben de Yaşadım'}</button>;
}
